require('./deploy-commands.js');
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server running'));

// Albion Event Bot - index.js
// Posts sign-up forms for guild activities (CTA, Group Dungeon, Tracking, Ava
// Dungeon, Other). Compositions now come from your own saved /comp entries
// (see comps.js) instead of being pulled live from the guild website — pick a
// saved comp when creating an event, or leave it blank to type one manually.

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  Client,
  GatewayIntentBits,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const comps = require('./comps');
const { askAI, isOnCooldown, markAsked } = require('./ai-assistant');

// ---------- storage (simple JSON file, keyed by the posted message id) ----------
const DB_PATH = path.join(__dirname, 'events.json');

function loadEvents() {
  if (!fs.existsSync(DB_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveEvents(events) {
  fs.writeFileSync(DB_PATH, JSON.stringify(events, null, 2));
}

let events = loadEvents();

// Temporary holding areas between a slash command / button and the modal submit
const pendingCreations = new Map(); // /event create (manual composition path)
const pendingCompActions = new Map(); // /comp create and /comp edit

// ---------- category metadata ----------
const CATEGORY_ORDER = comps.CATEGORY_ORDER; // ['Tank', 'DPS', 'Healer', 'Support', 'Battlemount']
const CATEGORY_META = {
  Tank: { emoji: '🔵', style: ButtonStyle.Primary },
  DPS: { emoji: '🔴', style: ButtonStyle.Danger },
  Healer: { emoji: '🟢', style: ButtonStyle.Success },
  Support: { emoji: '🟡', style: ButtonStyle.Secondary },
  Battlemount: { emoji: '⚪', style: ButtonStyle.Secondary },
};

const ACTIVITY_EMOJI = {
  CTA: '🔴',
  'Group Dungeon': '🟣',
  Tracking: '🟢',
  'Ava Dungeon': '🟠',
  Other: '⚪',
};

// ---------- custom server emoji support ----------
// If your server has its own emojis named "tank", "dps", "healer", "support",
// or "battlemount" (case-insensitive, animated or not), the bot will use those
// instead of the default circle emojis below. Rename this map if you'd rather
// use different emoji names on your server.
const ROLE_EMOJI_NAMES = {
  Tank: 'tank',
  DPS: 'dps',
  Healer: 'healer',
  Support: 'support',
  Battlemount: 'battlemount',
};

function findCustomRoleEmoji(guild, category) {
  if (!guild) return null;
  const name = ROLE_EMOJI_NAMES[category];
  if (!name) return null;
  try {
    return guild.emojis.cache.find((e) => e.name && e.name.toLowerCase() === name) || null;
  } catch {
    return null;
  }
}

// For embed field names / text — returns a unicode circle or a rendered
// custom-emoji tag like <:tank:123456789012345678>
function roleEmojiText(guild, category) {
  const custom = findCustomRoleEmoji(guild, category);
  return custom ? custom.toString() : CATEGORY_META[category].emoji;
}

// For ButtonBuilder#setEmoji — returns a unicode string or a {id, name} object
function roleEmojiForButton(guild, category) {
  const custom = findCustomRoleEmoji(guild, category);
  return custom ? { id: custom.id, name: custom.name } : CATEGORY_META[category].emoji;
}

// ---------- embed + components builders ----------
function buildEmbed(event, guild) {
  const activityEmoji = ACTIVITY_EMOJI[event.type] || '🔷';
  const embed = new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle(`${activityEmoji} ${event.title}`)
    .addFields({ name: '🕒 Time', value: event.time });

  let totalSigned = 0;

  for (const cat of CATEGORY_ORDER) {
    const catData = event.categories[cat];
    if (!catData) continue;
    const roleEmoji = roleEmojiText(guild, cat);

    const rows = comps.expandCategoryRows(catData);
    const lines = rows.map((row) => {
      if (row.signedUserId) totalSigned++;
      const status = row.signedUserId ? `<@${row.signedUserId}>` : '*Open*';
      const weaponEmoji = row.emoji || '🔹';
      const label = row.name ? `**${row.name}**` : '*Any*';
      return `${row.rowNumber} - ${roleEmoji} - ${weaponEmoji} - ${label} : ${status}`;
    });

    embed.addFields({ name: `${roleEmoji} ${cat}`, value: lines.join('\n') });
  }

  if (event.compLabel) {
    embed.addFields({
      name: '🔗 Builds',
      value: `Composition: **${event.compLabel}** — see exact builds/icons on [the war ledger](${comps.BUILDS_LINK})`,
    });
  }

  const flags = [];
  if (event.closed) flags.push('❌ Closed');

  embed.setFooter({
    text: `${event.type} • ${totalSigned} signed up • Organized by ${event.organizerTag} • ID: ${event.id}${
      flags.length ? ' • ' + flags.join(' • ') : ''
    }`,
  });
  embed.setTimestamp(event.createdAt);

  return embed;
}

function buildButtons(event, guild) {
  const row = new ActionRowBuilder();
  const activeCats = CATEGORY_ORDER.filter((c) => event.categories[c]);

  for (const cat of activeCats) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`event_role:${cat}:${event.id}`)
        .setLabel(cat)
        .setEmoji(roleEmojiForButton(guild, cat))
        .setStyle(CATEGORY_META[cat].style)
        .setDisabled(event.closed)
    );
  }

  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`event_leave:${event.id}`)
      .setLabel('Leave')
      .setEmoji('🚪')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(event.closed)
  );

  return [row];
}

function removeUserFromEvent(event, userId) {
  for (const cat of Object.values(event.categories)) {
    if (cat.mode === 'quota') {
      cat.signups = cat.signups.filter((s) => s.userId !== userId);
    } else {
      for (const item of cat.items) {
        const idx = item.signups.indexOf(userId);
        if (idx !== -1) item.signups.splice(idx, 1);
      }
    }
  }
}

async function updateEventMessage(client, event) {
  const channel = await client.channels.fetch(event.channelId);
  const message = await channel.messages.fetch(event.id);
  await message.edit({ embeds: [buildEmbed(event, channel.guild)], components: buildButtons(event, channel.guild) });
}

// ---------- client ----------
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;

  const question = message.content.replace(/<@!?\d+>/g, '').trim();
  if (!question) {
    await message.reply("Ask me something about Albion or the guild's builds!");
    return;
  }

  if (isOnCooldown(message.author.id)) {
    await message.reply('One sec between questions 🙂');
    return;
  }
  markAsked(message.author.id);

  await message.channel.sendTyping();

  try {
    const answer = await askAI({ question, userId: message.author.id });
    await message.reply(answer.slice(0, 1900));
  } catch (err) {
    console.error('AI assistant error:', err);
    await message.reply("Sorry, couldn't reach the AI service just now — try again shortly.");
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  // ----- autocomplete: saved comp names -----
  if (interaction.isAutocomplete()) {
    const focused = interaction.options.getFocused(true);
    if (focused.name === 'comp') {
      const saved = comps.loadComps();
      const query = focused.value.toLowerCase();
      const choices = Object.entries(saved)
        .filter(([, c]) => c.label.toLowerCase().includes(query))
        .slice(0, 25)
        .map(([key, c]) => ({ name: c.label, value: key }));
      try {
        await interaction.respond(choices);
      } catch {
        /* ignore - interaction may have expired */
      }
    }
    return;
  }

  try {
    // ----- /event create | /event close -----
    if (interaction.isChatInputCommand() && interaction.commandName === 'event') {
      const sub = interaction.options.getSubcommand();

      if (sub === 'create') {
        const type = interaction.options.getString('type');
        const time = interaction.options.getString('time');
        const title = interaction.options.getString('title') || type;
        const compKey = interaction.options.getString('comp');

        const baseMeta = {
          type,
          title,
          time,
          organizerId: interaction.user.id,
          organizerTag: interaction.user.username,
          channelId: interaction.channelId,
          guildId: interaction.guildId,
          closed: false,
          createdAt: Date.now(),
        };

        // ----- path 1: build from a saved comp -----
        if (compKey) {
          const saved = comps.loadComps()[compKey];
          if (!saved) {
            await interaction.reply({
              content: "I couldn't find that saved composition — it may have been deleted. Try /comp list.",
              ephemeral: true,
            });
            return;
          }

          const event = {
            id: null,
            ...baseMeta,
            categories: comps.cloneCategories(saved.categories),
            compLabel: saved.label,
          };

          await interaction.reply({ embeds: [buildEmbed(event, interaction.guild)], components: buildButtons(event, interaction.guild) });
          const message = await interaction.fetchReply();
          event.id = message.id;
          events[event.id] = event;
          saveEvents(events);
          await interaction.editReply({ embeds: [buildEmbed(event, interaction.guild)], components: buildButtons(event, interaction.guild) });
          return;
        }

        // ----- path 2: manual composition (no comp selected) -----
        const pendingId = `${interaction.user.id}_${Date.now()}`;
        pendingCreations.set(pendingId, baseMeta);
        setTimeout(() => pendingCreations.delete(pendingId), 15 * 60 * 1000);

        const modal = new ModalBuilder()
          .setCustomId(`event_create_modal:${pendingId}`)
          .setTitle(`New ${type} event`);

        const compositionInput = new TextInputBuilder()
          .setCustomId('composition')
          .setLabel('Composition (one item per line, see guide)')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Tank\n🛡️ 1H Mace\nDPS\n⚔️ Carving Sword\nHealer\n✨ Hallowfall: 2')
          .setRequired(true)
          .setMaxLength(4000);

        modal.addComponents(new ActionRowBuilder().addComponents(compositionInput));
        await interaction.showModal(modal);
        return;
      }

      if (sub === 'close') {
        const eventId = interaction.options.getString('event_id');
        const event = events[eventId];
        if (!event) {
          await interaction.reply({ content: 'No event found with that ID.', ephemeral: true });
          return;
        }
        const isOrganizer = event.organizerId === interaction.user.id;
        const canManage = interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
        if (!isOrganizer && !canManage) {
          await interaction.reply({
            content: 'Only the organizer or a server manager can close this event.',
            ephemeral: true,
          });
          return;
        }

        event.closed = true;
        saveEvents(events);

        try {
          await updateEventMessage(client, event);
        } catch (e) {
          console.error('Failed to update closed event message', e);
        }

        await interaction.reply({ content: `Event \`${eventId}\` closed.`, ephemeral: true });
        return;
      }
    }

    // ----- /comp create | /comp edit | /comp delete | /comp list -----
    if (interaction.isChatInputCommand() && interaction.commandName === 'comp') {
      const sub = interaction.options.getSubcommand();

      if (sub === 'create') {
        const pendingId = `${interaction.user.id}_${Date.now()}`;
        pendingCompActions.set(pendingId, { mode: 'create' });
        setTimeout(() => pendingCompActions.delete(pendingId), 15 * 60 * 1000);

        const modal = new ModalBuilder()
          .setCustomId(`comp_create_modal:${pendingId}`)
          .setTitle('Create a saved composition');

        const labelInput = new TextInputBuilder()
          .setCustomId('label')
          .setLabel('Label (name for this composition)')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('e.g. ZvZ Brawl, Gank 5s, Static Group')
          .setRequired(true)
          .setMaxLength(80);

        const compositionInput = new TextInputBuilder()
          .setCustomId('composition')
          .setLabel('Composition (one item per line, see guide)')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Tank\n🛡️ 1H Mace\nDPS\n⚔️ Carving Sword\nHealer\n✨ Hallowfall: 2')
          .setRequired(true)
          .setMaxLength(4000);

        modal.addComponents(
          new ActionRowBuilder().addComponents(labelInput),
          new ActionRowBuilder().addComponents(compositionInput)
        );
        await interaction.showModal(modal);
        return;
      }

      if (sub === 'edit') {
        const key = interaction.options.getString('comp');
        const saved = comps.loadComps()[key];
        if (!saved) {
          await interaction.reply({ content: "I couldn't find that saved composition.", ephemeral: true });
          return;
        }

        const canManage = interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
        if (saved.createdBy !== interaction.user.id && !canManage) {
          await interaction.reply({
            content: 'Only the person who created this comp, or a server manager, can edit it.',
            ephemeral: true,
          });
          return;
        }

        const pendingId = `${interaction.user.id}_${Date.now()}`;
        pendingCompActions.set(pendingId, { mode: 'edit', key });
        setTimeout(() => pendingCompActions.delete(pendingId), 15 * 60 * 1000);

        const modal = new ModalBuilder()
          .setCustomId(`comp_edit_modal:${pendingId}`)
          .setTitle(`Edit "${saved.label}"`);

        const labelInput = new TextInputBuilder()
          .setCustomId('label')
          .setLabel('Label (name for this composition)')
          .setStyle(TextInputStyle.Short)
          .setValue(saved.label)
          .setRequired(true)
          .setMaxLength(80);

        const compositionInput = new TextInputBuilder()
          .setCustomId('composition')
          .setLabel('Composition (one item per line, see guide)')
          .setStyle(TextInputStyle.Paragraph)
          .setValue(comps.stringifyComposition(saved.categories))
          .setRequired(true)
          .setMaxLength(4000);

        modal.addComponents(
          new ActionRowBuilder().addComponents(labelInput),
          new ActionRowBuilder().addComponents(compositionInput)
        );
        await interaction.showModal(modal);
        return;
      }

      if (sub === 'delete') {
        const key = interaction.options.getString('comp');
        const saved = comps.loadComps()[key];
        if (!saved) {
          await interaction.reply({ content: "I couldn't find that saved composition.", ephemeral: true });
          return;
        }

        const canManage = interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
        if (saved.createdBy !== interaction.user.id && !canManage) {
          await interaction.reply({
            content: 'Only the person who created this comp, or a server manager, can delete it.',
            ephemeral: true,
          });
          return;
        }

        comps.deleteComp(key);
        await interaction.reply({ content: `Deleted saved composition **${saved.label}**.`, ephemeral: true });
        return;
      }

      if (sub === 'list') {
        const saved = comps.loadComps();
        const keys = Object.keys(saved);
        if (keys.length === 0) {
          await interaction.reply({
            content: 'No saved compositions yet — create one with `/comp create`.',
            ephemeral: true,
          });
          return;
        }

        const embed = new EmbedBuilder().setColor(0xe74c3c).setTitle('📋 Saved compositions');

        for (const key of keys.sort((a, b) => saved[a].label.localeCompare(saved[b].label))) {
          const c = saved[key];
          const lines = [];
          for (const cat of CATEGORY_ORDER) {
            const catData = c.categories[cat];
            if (!catData || catData.items.length === 0) continue;
            const roleEmoji = roleEmojiText(interaction.guild, cat);
            for (const row of comps.expandCategoryRows(catData)) {
              lines.push(`${row.rowNumber} - ${roleEmoji} - ${row.emoji || '🔹'} - **${row.name}**`);
            }
          }
          embed.addFields({ name: c.label, value: lines.join('\n') || '*empty*' });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    }

    // ----- modal submit: create the event (manual path) -----
    if (interaction.isModalSubmit() && interaction.customId.startsWith('event_create_modal:')) {
      const pendingId = interaction.customId.split(':')[1];
      const pending = pendingCreations.get(pendingId);
      if (!pending) {
        await interaction.reply({
          content: 'This form expired, please run /event create again.',
          ephemeral: true,
        });
        return;
      }
      pendingCreations.delete(pendingId);

      const compositionRaw = interaction.fields.getTextInputValue('composition');
      const categories = comps.parseComposition(compositionRaw);

      if (Object.keys(categories).length === 0) {
        await interaction.reply({
          content:
            "I couldn't find any items under a Tank/DPS/Healer/Support/Battlemount header — please run /event create again and check the format.",
          ephemeral: true,
        });
        return;
      }

      const event = {
        id: null,
        ...pending,
        categories,
        closed: false,
      };

      await interaction.reply({ embeds: [buildEmbed(event, interaction.guild)], components: buildButtons(event, interaction.guild) });
      const message = await interaction.fetchReply();

      event.id = message.id;
      events[event.id] = event;
      saveEvents(events);

      await interaction.editReply({ embeds: [buildEmbed(event, interaction.guild)], components: buildButtons(event, interaction.guild) });
      return;
    }

    // ----- modal submit: /comp create -----
    if (interaction.isModalSubmit() && interaction.customId.startsWith('comp_create_modal:')) {
      const pendingId = interaction.customId.split(':')[1];
      const pending = pendingCompActions.get(pendingId);
      if (!pending) {
        await interaction.reply({ content: 'This form expired, please run /comp create again.', ephemeral: true });
        return;
      }
      pendingCompActions.delete(pendingId);

      const label = interaction.fields.getTextInputValue('label');
      const compositionRaw = interaction.fields.getTextInputValue('composition');

      const created = comps.createComp({ label, compositionRaw, userId: interaction.user.id });
      if (!created) {
        await interaction.reply({
          content:
            "I couldn't find any items under a Tank/DPS/Healer/Support/Battlemount header — please run /comp create again and check the format.",
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `Saved composition **${created.label}** — use it next time with \`/event create comp:${created.label}\`.`,
        ephemeral: true,
      });
      return;
    }

    // ----- modal submit: /comp edit -----
    if (interaction.isModalSubmit() && interaction.customId.startsWith('comp_edit_modal:')) {
      const pendingId = interaction.customId.split(':')[1];
      const pending = pendingCompActions.get(pendingId);
      if (!pending) {
        await interaction.reply({ content: 'This form expired, please run /comp edit again.', ephemeral: true });
        return;
      }
      pendingCompActions.delete(pendingId);

      const label = interaction.fields.getTextInputValue('label');
      const compositionRaw = interaction.fields.getTextInputValue('composition');

      const updated = comps.updateComp({ key: pending.key, newLabel: label, compositionRaw, userId: interaction.user.id });
      if (!updated) {
        await interaction.reply({
          content:
            "I couldn't find any items under a Tank/DPS/Healer/Support/Battlemount header — please run /comp edit again and check the format.",
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({ content: `Updated saved composition **${updated.label}**.`, ephemeral: true });
      return;
    }

    // ----- role button clicked -----
    if (interaction.isButton() && interaction.customId.startsWith('event_role:')) {
      const [, category, eventId] = interaction.customId.split(':');
      const event = events[eventId];
      if (!event || event.closed) {
        await interaction.reply({ content: 'This event is no longer open.', ephemeral: true });
        return;
      }

      const catData = event.categories[category];

      if (catData.mode === 'quota') {
        if (catData.signups.length >= catData.capacity) {
          await interaction.reply({ content: `All ${category} slots are full.`, ephemeral: true });
          return;
        }

        if (catData.weaponOptions.length === 1) {
          removeUserFromEvent(event, interaction.user.id);
          catData.signups.push({ userId: interaction.user.id, weapon: catData.weaponOptions[0] });
          saveEvents(events);
          await interaction.update({ embeds: [buildEmbed(event, interaction.guild)], components: buildButtons(event, interaction.guild) });
          return;
        }

        const select = new StringSelectMenuBuilder()
          .setCustomId(`event_select:${category}:${eventId}`)
          .setPlaceholder(`Choose your ${category} build`)
          .addOptions(catData.weaponOptions.slice(0, 25).map((weapon) => ({ label: weapon, value: weapon })));

        await interaction.reply({
          content: `Pick your ${category} build:`,
          components: [new ActionRowBuilder().addComponents(select)],
          ephemeral: true,
        });
        return;
      }

      // items mode - each item is exactly one slot; duplicate weapon names
      // are just separate items (separate rows), never merged
      const items = catData.items;
      const rows = comps.expandCategoryRows(catData);
      const availableIndexes = items
        .map((item, idx) => idx)
        .filter((idx) => items[idx].signups.length === 0);

      if (availableIndexes.length === 0) {
        await interaction.reply({ content: `All ${category} slots are full.`, ephemeral: true });
        return;
      }

      if (availableIndexes.length === 1) {
        removeUserFromEvent(event, interaction.user.id);
        items[availableIndexes[0]].signups.push(interaction.user.id);
        saveEvents(events);
        await interaction.update({ embeds: [buildEmbed(event, interaction.guild)], components: buildButtons(event, interaction.guild) });
        return;
      }

      const select = new StringSelectMenuBuilder()
        .setCustomId(`event_select:${category}:${eventId}`)
        .setPlaceholder(`Choose your ${category} build`)
        .addOptions(
          availableIndexes.slice(0, 25).map((idx) => {
            const item = items[idx];
            const row = rows.find((r) => r.itemIndex === idx);
            const option = { label: `${row.rowNumber}. ${item.name}`, value: String(idx) };
            if (item.emoji) option.emoji = item.emoji;
            return option;
          })
        );

      await interaction.reply({
        content: `Pick your ${category} build:`,
        components: [new ActionRowBuilder().addComponents(select)],
        ephemeral: true,
      });
      return;
    }

    // ----- select menu: specific build chosen -----
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('event_select:')) {
      const [, category, eventId] = interaction.customId.split(':');
      const event = events[eventId];
      if (!event || event.closed) {
        await interaction.update({ content: 'This event is no longer open.', components: [] });
        return;
      }

      const chosenValue = interaction.values[0];
      const catData = event.categories[category];

      if (catData.mode === 'quota') {
        if (catData.signups.length >= catData.capacity) {
          await interaction.update({ content: 'That role just filled up, try another.', components: [] });
          return;
        }
        removeUserFromEvent(event, interaction.user.id);
        catData.signups.push({ userId: interaction.user.id, weapon: chosenValue });
        saveEvents(events);

        try {
          await updateEventMessage(client, event);
        } catch (e) {
          console.error('Failed to update event message after select', e);
        }

        await interaction.update({ content: `Signed up as **${chosenValue}** (${category}).`, components: [] });
        return;
      }

      const item = catData.items[Number(chosenValue)];
      if (!item || item.signups.length >= 1) {
        await interaction.update({ content: 'That slot just filled up, try another.', components: [] });
        return;
      }

      removeUserFromEvent(event, interaction.user.id);
      item.signups.push(interaction.user.id);
      saveEvents(events);

      try {
        await updateEventMessage(client, event);
      } catch (e) {
        console.error('Failed to update event message after select', e);
      }

      await interaction.update({ content: `Signed up as **${item.name}** (${category}).`, components: [] });
      return;
    }

    // ----- leave button -----
    if (interaction.isButton() && interaction.customId.startsWith('event_leave:')) {
      const [, eventId] = interaction.customId.split(':');
      const event = events[eventId];
      if (!event) {
        await interaction.reply({ content: 'Event not found.', ephemeral: true });
        return;
      }
      removeUserFromEvent(event, interaction.user.id);
      saveEvents(events);
      await interaction.update({ embeds: [buildEmbed(event, interaction.guild)], components: buildButtons(event, interaction.guild) });
      return;
    }
  } catch (err) {
    console.error('Interaction error:', err);
    if (interaction.isRepliable()) {
      try {
        await interaction.reply({ content: 'Something went wrong, please try again.', ephemeral: true });
      } catch {
        /* ignore */
      }
    }
  }
});

client.on(Events.Error, (err) => {
  console.error('Discord client error:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error('Failed to log in to Discord:', err);
});
