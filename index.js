require('./deploy-commands.js'); 
require('dns').setDefaultResultOrder('ipv4first');
require('./deploy-commands.js');
const path = require('path');
const express = require('express');
const app = express();
// Website (index.html / builds.html / comps.html + assets) lives in /public
// and is served straight off this same Render service — no separate host.
app.use(express.static(path.join(__dirname, 'public')));
// Auth + builds/comps/home REST API used by the site (see api.js).
app.use(require('./api.js'));
app.listen(process.env.PORT || 3000, () => console.log('Web server running'));

// Albion Event Bot - index.js
// Posts sign-up forms for guild activities (CTA, Group Dungeon, Tracking, Ava
// Dungeon, Other). Compositions now come from your own saved /comp entries
// (see comps.js) instead of being pulled live from the guild website — pick a
// saved comp when creating an event, or leave it blank to type one manually.

require('dotenv').config();
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
const storage = require('./storage');

// ---------- storage (Redis-backed via storage.js, keyed by the posted message id) ----------
const DB_PATH = path.join(__dirname, 'events.json'); // local fallback path only
const EVENTS_REDIS_KEY = 'events';

async function loadEvents() {
  return storage.loadJSON(EVENTS_REDIS_KEY, DB_PATH);
}

async function saveEvents(events) {
  await storage.saveJSON(EVENTS_REDIS_KEY, DB_PATH, events);
}

// Populated by the bootstrap at the bottom of this file, before login.
let events = {};

// Temporary holding areas between a slash command / button and the modal submit
const pendingCreations = new Map(); // /event create (manual composition path)
const pendingCompActions = new Map(); // /comp create and /comp edit

// ---------- category metadata ----------
const CATEGORY_ORDER = comps.CATEGORY_ORDER; // ['Tank', 'Support', 'DPS', 'Healer', 'Battlemount']
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

  // One continuous, numbered roster across every role — no per-role header,
  // the role emoji on each row is what tells you Tank vs DPS vs Healer, etc.
  // A "Party N" label is only shown when the comp actually has more than one
  // party, so single-party comps look exactly as before.
  const allRows = comps.expandAllCategoryRows(event.categories, CATEGORY_ORDER);
  const hasMultipleParties = allRows.some((row) => row.party > 0);
  const rosterLines = [];
  let lastParty = null;
  for (const row of allRows) {
    if (row.signedUserId) totalSigned++;
    if (hasMultipleParties && row.party !== lastParty) {
      if (lastParty !== null) rosterLines.push('');
      rosterLines.push(`**Party ${row.party + 1}**`);
      lastParty = row.party;
    }
    const roleEmoji = roleEmojiText(guild, row.category);
    const status = row.signedUserId ? `<@${row.signedUserId}>` : '*Open*';
    const weaponEmoji = row.emoji || '🔹';
    const label = row.name ? `**${row.name}**` : '*Any*';
    rosterLines.push(`${roleEmoji} - ${weaponEmoji} - ${label} : ${status}`);
  }

  if (rosterLines.length > 0) {
    embed.setDescription(rosterLines.join('\n'));
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

// All distinct users currently signed up anywhere on the event.
function getSignedUpUserIds(event) {
  const ids = new Set();
  for (const cat of Object.values(event.categories)) {
    if (cat.mode === 'quota') {
      for (const s of cat.signups) ids.add(s.userId);
    } else {
      for (const item of cat.items) {
        if (item.signups[0]) ids.add(item.signups[0]);
      }
    }
  }
  return [...ids];
}

// Groups open (unsigned) slots by role, for the 30-minute reminder ping —
// e.g. [{ category: 'Tank', missing: 2 }, { category: 'Healer', missing: 1 }].
function getMissingRolesSummary(event) {
  const rows = comps.expandAllCategoryRows(event.categories, CATEGORY_ORDER);
  const counts = {};
  for (const row of rows) {
    if (row.signedUserId) continue;
    counts[row.category] = (counts[row.category] || 0) + 1;
  }
  return CATEGORY_ORDER.filter((cat) => counts[cat] > 0).map((cat) => ({ category: cat, missing: counts[cat] }));
}

function findDahaloRole(guild) {
  if (!guild) return null;
  return guild.roles.cache.find((r) => r.name.toLowerCase() === 'dahalo') || null;
}

// Shared by both the "pick no-shows" select menu and the "no no-shows"
// button — marks the event closed, records who didn't show, updates the
// posted embed, and announces the outcome publicly in the event's channel.
async function finalizeEventClose(client, event, noShowIds) {
  event.closed = true;
  event.noShows = noShowIds;
  await saveEvents(events);

  try {
    await updateEventMessage(client, event);
  } catch (e) {
    console.error('Failed to update event message on close', e);
  }

  try {
    const channel = await client.channels.fetch(event.channelId);
    const summary = noShowIds.length > 0 ? noShowIds.map((id) => `<@${id}>`).join(', ') : '*none*';
    await channel.send(`🔒 Event **${event.title}** closed. No-shows: ${summary}`);
  } catch (e) {
    console.error('Failed to post close summary', e);
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

  // Every 30 minutes, ping the Dahalo role in each open event's thread with
  // whatever roles are still missing. Only fires if the organizer actually
  // created a thread from the event message (its ID has to match the
  // event's message ID — see the mention-based sign-up management below for
  // why that's how a thread gets linked to an event), and only if there's
  // actually something missing (no point pinging a fully-staffed event).
  setInterval(async () => {
    for (const event of Object.values(events)) {
      if (event.closed) continue;

      const missing = getMissingRolesSummary(event);
      if (missing.length === 0) continue;

      let thread;
      try {
        thread = await client.channels.fetch(event.id);
      } catch {
        continue; // no thread created for this event yet
      }
      if (!thread || !thread.isThread || !thread.isThread()) continue;

      const roleMention = findDahaloRole(thread.guild);
      const missingText = missing.map((m) => `**${m.category}** (${m.missing} open)`).join(', ');

      try {
        await thread.send(
          `⏰ Reminder for **${event.title}** (${event.time}) — still missing: ${missingText}.${
            roleMention ? ` <@&${roleMention.id}>` : ''
          }`
        );
      } catch (e) {
        console.error('Failed to send reminder for event', event.id, e);
      }
    }
  }, 30 * 60 * 1000);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;

  // ----- manual sign-up management from inside an event's thread -----
  // If this message is in a thread created directly from an event's posted
  // message (Discord gives that thread the same ID as the message it was
  // made from), and it mentions both a player and a role name, treat it as
  // "add/remove this player from this role" instead of a normal AI question.
  // This lets an organizer reserve or clear a slot for someone who isn't
  // online to click the buttons themselves.
  if (message.channel.isThread()) {
    const event = events[message.channel.id];
    if (event) {
      const targetUser = message.mentions.users.find((u) => u.id !== client.user.id);
      const contentNoMentions = message.content.replace(/<@!?\d+>/g, '').trim();
      const roleMatch = CATEGORY_ORDER.find((cat) =>
        new RegExp(`\\b${cat}\\b`, 'i').test(contentNoMentions)
      );

      if (targetUser && roleMatch) {
        const isOrganizer = event.organizerId === message.author.id;
        const canManage = message.member?.permissions?.has(PermissionFlagsBits.ManageGuild);
        if (!isOrganizer && !canManage) {
          await message.reply('Only the organizer or a server manager can manage sign-ups here.');
          return;
        }

        if (event.closed) {
          await message.reply('This event is closed, so sign-ups can no longer be changed.');
          return;
        }

        const isRemoval = /\b(remove|retire|delete|unassign|unsign|cancel|drop|leave|out)\b/i.test(
          contentNoMentions
        );
        const catData = event.categories[roleMatch];

        if (!catData) {
          await message.reply(`This event doesn't have a **${roleMatch}** role.`);
          return;
        }

        if (isRemoval) {
          let removed = false;
          let itemName = null;
          if (catData.mode === 'quota') {
            const idx = catData.signups.findIndex((s) => s.userId === targetUser.id);
            if (idx !== -1) {
              itemName = catData.signups[idx].weapon;
              catData.signups.splice(idx, 1);
              removed = true;
            }
          } else {
            const idx = catData.items.findIndex((it) => it.signups[0] === targetUser.id);
            if (idx !== -1) {
              itemName = catData.items[idx].name;
              catData.items[idx].signups = [];
              removed = true;
            }
          }

          if (!removed) {
            await message.reply(`<@${targetUser.id}> isn't currently signed up for **${roleMatch}**.`);
            return;
          }

          await saveEvents(events);
          await updateEventMessage(client, event);
          await message.reply(
            `✅ Removed <@${targetUser.id}> from **${roleMatch}**${itemName ? ` (**${itemName}**)` : ''}.`
          );
          return;
        }

        // add / assign — show the same picker a self sign-up would get,
        // so the organizer chooses exactly which slot, instead of the bot
        // silently grabbing the first open one.
        if (catData.mode === 'quota') {
          if (catData.signups.length >= catData.capacity) {
            await message.reply(`All **${roleMatch}** slots are full.`);
            return;
          }

          if (catData.weaponOptions.length === 1) {
            removeUserFromEvent(event, targetUser.id);
            catData.signups.push({ userId: targetUser.id, weapon: catData.weaponOptions[0] });
            await saveEvents(events);
            await updateEventMessage(client, event);
            await message.reply(`✅ Added <@${targetUser.id}> to **${roleMatch}**.`);
            return;
          }

          const select = new StringSelectMenuBuilder()
            .setCustomId(`event_select_for:${roleMatch}:${event.id}:${targetUser.id}`)
            .setPlaceholder(`Choose ${targetUser.username}'s ${roleMatch} build`)
            .addOptions(catData.weaponOptions.slice(0, 25).map((weapon) => ({ label: weapon, value: weapon })));

          await message.reply({
            content: `Pick <@${targetUser.id}>'s **${roleMatch}** build:`,
            components: [new ActionRowBuilder().addComponents(select)],
          });
          return;
        }

        const items = catData.items;
        const availableIndexes = items
          .map((item, idx) => idx)
          .filter((idx) => items[idx].signups.length === 0);

        if (availableIndexes.length === 0) {
          await message.reply(`All **${roleMatch}** slots are full.`);
          return;
        }

        if (availableIndexes.length === 1) {
          removeUserFromEvent(event, targetUser.id);
          items[availableIndexes[0]].signups.push(targetUser.id);
          await saveEvents(events);
          await updateEventMessage(client, event);
          await message.reply(
            `✅ Added <@${targetUser.id}> to **${roleMatch}** (**${items[availableIndexes[0]].name}**).`
          );
          return;
        }

        const select = new StringSelectMenuBuilder()
          .setCustomId(`event_select_for:${roleMatch}:${event.id}:${targetUser.id}`)
          .setPlaceholder(`Choose ${targetUser.username}'s ${roleMatch} build`)
          .addOptions(
            availableIndexes.slice(0, 25).map((idx) => {
              const item = items[idx];
              const option = { label: item.name, value: String(idx) };
              if (item.emoji) option.emoji = item.emoji;
              return option;
            })
          );

        await message.reply({
          content: `Pick <@${targetUser.id}>'s **${roleMatch}** build:`,
          components: [new ActionRowBuilder().addComponents(select)],
        });
        return;
      }
    }
  }

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
      const saved = await comps.loadComps();
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
          const saved = (await comps.loadComps())[compKey];
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
            compKey: compKey,
          };

          await interaction.reply({ embeds: [buildEmbed(event, interaction.guild)], components: buildButtons(event, interaction.guild) });
          const message = await interaction.fetchReply();
          event.id = message.id;
          events[event.id] = event;
          await saveEvents(events);
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

        if (event.closed) {
          await interaction.reply({ content: 'This event is already closed.', ephemeral: true });
          return;
        }

        const signedUpIds = getSignedUpUserIds(event);
        const noShowButton = new ButtonBuilder()
          .setCustomId(`event_close_none:${eventId}`)
          .setLabel('No no-shows — close now')
          .setStyle(ButtonStyle.Success);

        if (signedUpIds.length === 0) {
          // nobody signed up at all — nothing to pick from, just close
          await finalizeEventClose(client, event, []);
          await interaction.reply({ content: `Event \`${eventId}\` closed. Nobody had signed up.`, ephemeral: true });
          return;
        }

        const users = await Promise.all(
          signedUpIds.slice(0, 25).map(async (id) => {
            try {
              const u = await client.users.fetch(id);
              return { id, name: u.username };
            } catch {
              return { id, name: id };
            }
          })
        );

        const select = new StringSelectMenuBuilder()
          .setCustomId(`event_close_select:${eventId}`)
          .setPlaceholder('Select anyone who did not show up')
          .setMinValues(0)
          .setMaxValues(users.length)
          .addOptions(users.map((u) => ({ label: u.name, value: u.id })));

        await interaction.reply({
          content: `Closing **${event.title}** — select any no-shows, or press the button if everyone attended.`,
          components: [new ActionRowBuilder().addComponents(select), new ActionRowBuilder().addComponents(noShowButton)],
          ephemeral: true,
        });
        return;
      }

      if (sub === 'refresh') {
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
            content: 'Only the organizer or a server manager can refresh this event.',
            ephemeral: true,
          });
          return;
        }

        if (!event.compKey) {
          await interaction.reply({
            content:
              "This event wasn't created from a saved comp (its composition was typed manually), so there's nothing to refresh it against.",
            ephemeral: true,
          });
          return;
        }

        const saved = (await comps.loadComps())[event.compKey];
        if (!saved) {
          await interaction.reply({
            content:
              "I couldn't find the linked saved composition anymore — it may have been renamed or deleted. Check `/comp list`, or recreate the event from the current comp.",
            ephemeral: true,
          });
          return;
        }

        const { categories, dropped } = comps.refreshEventCategories(event.categories, saved.categories);
        event.categories = categories;
        event.compLabel = saved.label;
        await saveEvents(events);

        try {
          await updateEventMessage(client, event);
        } catch (e) {
          console.error('Failed to update event message after refresh', e);
        }

        let content = `Event \`${eventId}\` refreshed from **${saved.label}**. Existing sign-ups were kept wherever their slot still exists.`;
        if (dropped.length > 0) {
          const names = dropped
            .map((d) => `<@${d.userId}> (was **${d.name}**, ${d.category})`)
            .join(', ');
          content += `\n⚠️ ${dropped.length} sign-up${
            dropped.length === 1 ? '' : 's'
          } no longer had a matching slot and ${dropped.length === 1 ? 'was' : 'were'} removed: ${names}`;
        }

        await interaction.reply({ content, ephemeral: true });
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
        const saved = (await comps.loadComps())[key];
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
        const saved = (await comps.loadComps())[key];
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

        await comps.deleteComp(key);
        await interaction.reply({ content: `Deleted saved composition **${saved.label}**.`, ephemeral: true });
        return;
      }

    if (sub === 'list') {
        const saved = await comps.loadComps();
        const keys = Object.keys(saved);
        if (keys.length === 0) {
          await interaction.reply({
            content: 'No saved compositions yet — create one with `/comp create`.',
            ephemeral: true,
          });
          return;
        }

        const sortedKeys = keys.sort((a, b) => saved[a].label.localeCompare(saved[b].label));
        const nameLines = sortedKeys.map((key) => {
          const c = saved[key];
          const slotCount = comps.expandAllCategoryRows(c.categories, CATEGORY_ORDER).length;
          return `• **${c.label}** — ${slotCount} slot${slotCount === 1 ? '' : 's'}`;
        });

        const embed = new EmbedBuilder()
          .setColor(0xe74c3c)
          .setTitle('📋 Saved compositions')
          .setDescription(nameLines.join('\n'))
          .setFooter({ text: 'Use /comp view to see the full roster for one composition.' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      if (sub === 'view') {
        const key = interaction.options.getString('comp');
        const saved = (await comps.loadComps())[key];
        if (!saved) {
          await interaction.reply({ content: "I couldn't find that saved composition.", ephemeral: true });
          return;
        }

        const allRows = comps.expandAllCategoryRows(saved.categories, CATEGORY_ORDER);
        const hasMultipleParties = allRows.some((row) => row.party > 0);
        const lines = [];
        let lastParty = null;
        for (const row of allRows) {
          if (hasMultipleParties && row.party !== lastParty) {
            if (lastParty !== null) lines.push('');
            lines.push(`**Party ${row.party + 1}**`);
            lastParty = row.party;
          }
          const roleEmoji = roleEmojiText(interaction.guild, row.category);
          lines.push(`${roleEmoji} - ${row.emoji || '🔹'} - **${row.name}**`);
        }

        let description = lines.join('\n') || '*empty*';
        if (description.length > 4096) {
          description = description.slice(0, 4000) + '\n\n*(truncated — this composition is very large)*';
        }

        const embed = new EmbedBuilder()
          .setColor(0xe74c3c)
          .setTitle(`📋 ${saved.label}`)
          .setDescription(description);

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
    }

    // ----- /giveaway: draw winners from an event's attendees -----
    if (interaction.isChatInputCommand() && interaction.commandName === 'giveaway') {
      const eventId = interaction.options.getString('event_id');
      const prize = interaction.options.getString('prize');
      const winnersCount = interaction.options.getInteger('winners') || 1;

      const event = events[eventId];
      if (!event) {
        await interaction.reply({ content: 'No event found with that ID.', ephemeral: true });
        return;
      }

      if (!event.closed) {
        await interaction.reply({
          content:
            'Close this event first with `/event close` — that\'s when no-shows get marked, and the giveaway needs to know who actually attended.',
          ephemeral: true,
        });
        return;
      }

      const signedUp = getSignedUpUserIds(event);
      const noShows = new Set(event.noShows || []);
      const attendees = signedUp.filter((id) => !noShows.has(id));

      if (attendees.length === 0) {
        await interaction.reply({
          content: "No eligible participants — everyone who signed up was marked as a no-show, or nobody signed up.",
          ephemeral: true,
        });
        return;
      }

      const shuffled = [...attendees].sort(() => Math.random() - 0.5);
      const drawCount = Math.min(winnersCount, shuffled.length);
      const winners = shuffled.slice(0, drawCount);

      const embed = new EmbedBuilder()
        .setColor(0xf1c40f)
        .setTitle('🎉 Giveaway!')
        .addFields(
          { name: 'Prize', value: prize },
          { name: 'From event', value: event.title },
          {
            name: drawCount === 1 ? 'Winner' : 'Winners',
            value: winners.map((id) => `<@${id}>`).join('\n'),
          },
          { name: 'Eligible attendees', value: String(attendees.length), inline: true }
        )
        .setFooter({ text: `Drawn by ${interaction.user.username}` });

      if (drawCount < winnersCount) {
        embed.addFields({
          name: 'Note',
          value: `Only ${attendees.length} attendee${attendees.length === 1 ? '' : 's'} available, so fewer winners were drawn than requested.`,
        });
      }

      await interaction.reply({ embeds: [embed] });
      return;
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
      const categories = comps.parseComposition(compositionRaw, interaction.guild);

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
      await saveEvents(events);

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

      const created = await comps.createComp({ label, compositionRaw, userId: interaction.user.id, guild: interaction.guild });
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

      const updated = await comps.updateComp({ key: pending.key, newLabel: label, compositionRaw, userId: interaction.user.id, guild: interaction.guild });
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
          await saveEvents(events);
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
      // Use the same party-aware numbering as the posted embed, filtered
      // down to this category, so the numbers a user picks from match what
      // they see in the roster exactly.
      const rows = comps.expandAllCategoryRows(event.categories, CATEGORY_ORDER).filter((r) => r.category === category);
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
        await saveEvents(events);
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
            const option = { label: item.name, value: String(idx) };
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
        await saveEvents(events);

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
      await saveEvents(events);

      try {
        await updateEventMessage(client, event);
      } catch (e) {
        console.error('Failed to update event message after select', e);
      }

      await interaction.update({ content: `Signed up as **${item.name}** (${category}).`, components: [] });
      return;
    }

    // ----- select menu: organizer picking a slot on behalf of someone else -----
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('event_select_for:')) {
      const [, category, eventId, targetUserId] = interaction.customId.split(':');
      const event = events[eventId];
      if (!event || event.closed) {
        await interaction.update({ content: 'This event is no longer open.', components: [] });
        return;
      }

      const isOrganizer = event.organizerId === interaction.user.id;
      const canManage = interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
      if (!isOrganizer && !canManage) {
        await interaction.reply({
          content: 'Only the organizer or a server manager can finish this assignment.',
          ephemeral: true,
        });
        return;
      }

      const chosenValue = interaction.values[0];
      const catData = event.categories[category];

      if (catData.mode === 'quota') {
        if (catData.signups.length >= catData.capacity) {
          await interaction.update({ content: 'That role just filled up, try another.', components: [] });
          return;
        }
        removeUserFromEvent(event, targetUserId);
        catData.signups.push({ userId: targetUserId, weapon: chosenValue });
        await saveEvents(events);

        try {
          await updateEventMessage(client, event);
        } catch (e) {
          console.error('Failed to update event message after select', e);
        }

        await interaction.update({
          content: `✅ Added <@${targetUserId}> as **${chosenValue}** (${category}).`,
          components: [],
        });
        return;
      }

      const item = catData.items[Number(chosenValue)];
      if (!item || item.signups.length >= 1) {
        await interaction.update({ content: 'That slot just filled up, try another.', components: [] });
        return;
      }

      removeUserFromEvent(event, targetUserId);
      item.signups.push(targetUserId);
      await saveEvents(events);

      try {
        await updateEventMessage(client, event);
      } catch (e) {
        console.error('Failed to update event message after select', e);
      }

      await interaction.update({
        content: `✅ Added <@${targetUserId}> as **${item.name}** (${category}).`,
        components: [],
      });
      return;
    }

    // ----- close flow: no-shows picked from the multi-select -----
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('event_close_select:')) {
      const [, eventId] = interaction.customId.split(':');
      const event = events[eventId];
      if (!event) {
        await interaction.update({ content: 'This event no longer exists.', components: [] });
        return;
      }
      const isOrganizer = event.organizerId === interaction.user.id;
      const canManage = interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
      if (!isOrganizer && !canManage) {
        await interaction.reply({ content: 'Only the organizer or a server manager can close this event.', ephemeral: true });
        return;
      }
      if (event.closed) {
        await interaction.update({ content: 'This event is already closed.', components: [] });
        return;
      }

      const noShowIds = interaction.values;
      await finalizeEventClose(client, event, noShowIds);
      await interaction.update({
        content: `Event closed. No-shows: ${noShowIds.length > 0 ? noShowIds.map((id) => `<@${id}>`).join(', ') : '*none*'}`,
        components: [],
      });
      return;
    }

    // ----- close flow: "no no-shows" button -----
    if (interaction.isButton() && interaction.customId.startsWith('event_close_none:')) {
      const [, eventId] = interaction.customId.split(':');
      const event = events[eventId];
      if (!event) {
        await interaction.update({ content: 'This event no longer exists.', components: [] });
        return;
      }
      const isOrganizer = event.organizerId === interaction.user.id;
      const canManage = interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
      if (!isOrganizer && !canManage) {
        await interaction.reply({ content: 'Only the organizer or a server manager can close this event.', ephemeral: true });
        return;
      }
      if (event.closed) {
        await interaction.update({ content: 'This event is already closed.', components: [] });
        return;
      }

      await finalizeEventClose(client, event, []);
      await interaction.update({ content: 'Event closed. No-shows: *none*', components: [] });
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
      await saveEvents(events);
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

(async () => {
  events = await loadEvents();
  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error('Failed to log in to Discord:', err);
  }
})();
