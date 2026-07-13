// Albion Event Bot - index.js
// Posts sign-up forms for guild activities (CTA, Group Dungeon, Tracking, Ava Dungeon, Other).
// CTA and Tracking pull real builds live from https://shin7aro.github.io/Rise-of-Dahalo
// (via the raw GitHub source). Group Dungeon borrows the Tracking pool until real
// Group Dungeon builds are published on the site. Ava Dungeon / Other use a manual
// composition form, same as before.

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

const { fetchCompsData, buildLiveCategories, weaponEmoji } = require('./live-comps');

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

// Temporary holding area between the /event create command and the modal submit
// (used only for the manual-entry path: Ava Dungeon / Other / fetch failures)
const pendingCreations = new Map();

// Types that try to auto-populate from the live site before falling back to manual entry
const LIVE_TYPES = new Set(['CTA', 'Tracking', 'Group Dungeon']);

// ---------- category metadata ----------
const CATEGORY_ORDER = ['Tank', 'DPS', 'Healer', 'Support'];
const CATEGORY_META = {
  Tank: { emoji: '🛡️', style: ButtonStyle.Primary },
  DPS: { emoji: '⚔️', style: ButtonStyle.Secondary },
  Healer: { emoji: '💚', style: ButtonStyle.Success },
  Support: { emoji: '🔶', style: ButtonStyle.Secondary },
};

const ACTIVITY_EMOJI = {
  CTA: '🔴',
  'Group Dungeon': '🟣',
  Tracking: '🟢',
  'Ava Dungeon': '🟠',
  Other: '⚪',
};

// ---------- parsing manual composition text (Ava Dungeon / Other / fallback) ----------
// One item per line, grouped under a bare category header:
//   Tank
//   1H Mace: 1
//   Polehammer
//   DPS
//   Carving Sword: 1
function parseComposition(raw) {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const grouped = {};
  let current = null;

  for (const line of lines) {
    const asCategory = CATEGORY_ORDER.find(
      (c) => c.toLowerCase() === line.toLowerCase().replace(/[:：]$/, '')
    );
    if (asCategory) {
      current = asCategory;
      if (!grouped[current]) grouped[current] = [];
      continue;
    }

    if (!current) continue; // ignore stray lines before the first category header
    if (!grouped[current]) grouped[current] = [];

    const match = line.match(/^(.*?)[\s]*[:\-][\s]*(\d+)\s*$/);
    let name = line;
    let slots = 1;
    if (match) {
      name = match[1].trim();
      slots = Math.max(1, parseInt(match[2], 10));
    }
    if (!name) continue;

    grouped[current].push({ name, slots, signups: [] });
  }

  const categories = {};
  for (const cat of Object.keys(grouped)) {
    categories[cat] = { mode: 'items', items: grouped[cat] };
  }
  return categories;
}

// ---------- embed + components builders ----------
function buildEmbed(event) {
  const activityEmoji = ACTIVITY_EMOJI[event.type] || '🔷';
  const embed = new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle(`${activityEmoji} ${event.title}`)
    .addFields({ name: '🕒 Time', value: event.time });

  let totalSigned = 0;
  const itemMap = event.itemMap || {};

  for (const cat of CATEGORY_ORDER) {
    const catData = event.categories[cat];
    if (!catData) continue;
    const meta = CATEGORY_META[cat];
    let lines;

    if (catData.mode === 'quota') {
      lines = [];
      for (let i = 0; i < catData.capacity; i++) {
        const s = catData.signups[i];
        if (s) {
          totalSigned++;
          lines.push(`${weaponEmoji(s.weapon, itemMap)} <@${s.userId}> — **${s.weapon}**`);
        } else {
          lines.push(`${meta.emoji} *Open*`);
        }
      }
    } else {
      lines = catData.items.map((item) => {
        totalSigned += item.signups.length;
        const wEmoji = weaponEmoji(item.name, itemMap);
        if (item.slots === 1) {
          const status = item.signups.length ? `<@${item.signups[0]}>` : '*Open*';
          return `${wEmoji} **${item.name}** — ${status}`;
        }
        const names = item.signups.map((id) => `<@${id}>`).join(', ');
        const status = names ? `— ${names}` : '— *Open*';
        return `${wEmoji} **${item.name}** (${item.signups.length}/${item.slots}) ${status}`;
      });
    }

    embed.addFields({ name: `${meta.emoji} ${cat}`, value: lines.join('\n') });
  }

  const flags = [];
  if (event.usedFallbackFrom) flags.push(`⚠️ using ${event.usedFallbackFrom} builds (no ${event.type} builds published yet)`);
  if (event.closed) flags.push('❌ Closed');

  embed.setFooter({
    text: `${event.type} • ${totalSigned} signed up • Organized by ${event.organizerTag} • ID: ${event.id}${
      flags.length ? ' • ' + flags.join(' • ') : ''
    }`,
  });
  embed.setTimestamp(event.createdAt);

  return embed;
}

function buildButtons(event) {
  const row = new ActionRowBuilder();
  const activeCats = CATEGORY_ORDER.filter((c) => event.categories[c]);

  for (const cat of activeCats) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`event_role:${cat}:${event.id}`)
        .setLabel(cat)
        .setEmoji(CATEGORY_META[cat].emoji)
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
  await message.edit({ embeds: [buildEmbed(event)], components: buildButtons(event) });
}

// ---------- client ----------
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // ----- /event create | /event close -----
    if (interaction.isChatInputCommand() && interaction.commandName === 'event') {
      const sub = interaction.options.getSubcommand();

      if (sub === 'create') {
        const type = interaction.options.getString('type');
        const time = interaction.options.getString('time');
        const title = interaction.options.getString('title') || type;

        const baseMeta = {
          type,
          title,
          time,
          organizerId: interaction.user.id,
          organizerTag: interaction.user.username,
          channelId: interaction.channelId,
          closed: false,
          createdAt: Date.now(),
        };

        let compsData = null;
        try {
          compsData = await fetchCompsData();
        } catch (e) {
          console.error('Failed to fetch live comps data, falling back to manual entry:', e);
        }

        // Try the live-data path first for CTA / Tracking / Group Dungeon
        if (LIVE_TYPES.has(type) && compsData) {
          const live = buildLiveCategories(type, compsData);
          if (live) {
            const event = {
              id: null,
              ...baseMeta,
              categories: live.categories,
              itemMap: compsData.itemMap,
              usedFallbackFrom: live.usedFallbackFrom || null,
            };

            await interaction.reply({ embeds: [buildEmbed(event)], components: buildButtons(event) });
            const message = await interaction.fetchReply();
            event.id = message.id;
            events[event.id] = event;
            saveEvents(events);
            await interaction.editReply({ embeds: [buildEmbed(event)], components: buildButtons(event) });

            if (live.usedFallbackFrom) {
              await interaction.followUp({
                content: `⚠️ No **${type}** builds are published on the site yet, so this event is using the **${live.usedFallbackFrom}** build pool as a placeholder. Add a matching builds array to the site and future events will use the real thing automatically.`,
                ephemeral: true,
              });
            }
            return;
          }
        }

        // Fallback: manual composition form (Ava Dungeon, Other, or no live data available)
        const pendingId = `${interaction.user.id}_${Date.now()}`;
        pendingCreations.set(pendingId, { ...baseMeta, itemMap: compsData ? compsData.itemMap : {} });
        setTimeout(() => pendingCreations.delete(pendingId), 15 * 60 * 1000);

        const modal = new ModalBuilder()
          .setCustomId(`event_create_modal:${pendingId}`)
          .setTitle(`New ${type} event`);

        const compositionInput = new TextInputBuilder()
          .setCustomId('composition')
          .setLabel('Composition (one item per line, see guide)')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder(
            'Tank\n1H Mace: 1\nPolehammer\nDPS\nCarving Sword: 1\nHealer\nHallowfall: 2\nSupport\nRootbound Staff: 1'
          )
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
      const categories = parseComposition(compositionRaw);

      if (Object.keys(categories).length === 0) {
        await interaction.reply({
          content:
            "I couldn't find any items under a Tank/DPS/Healer/Support header — please run /event create again and check the format.",
          ephemeral: true,
        });
        return;
      }

      const event = {
        id: null,
        type: pending.type,
        title: pending.title,
        time: pending.time,
        organizerId: pending.organizerId,
        organizerTag: pending.organizerTag,
        channelId: pending.channelId,
        categories,
        itemMap: pending.itemMap || {},
        closed: false,
        createdAt: pending.createdAt,
      };

      await interaction.reply({ embeds: [buildEmbed(event)], components: buildButtons(event) });
      const message = await interaction.fetchReply();

      event.id = message.id;
      events[event.id] = event;
      saveEvents(events);

      await interaction.editReply({ embeds: [buildEmbed(event)], components: buildButtons(event) });
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
          await interaction.update({ embeds: [buildEmbed(event)], components: buildButtons(event) });
          return;
        }

        const select = new StringSelectMenuBuilder()
          .setCustomId(`event_select:${category}:${eventId}`)
          .setPlaceholder(`Choose your ${category} build`)
          .addOptions(
            catData.weaponOptions.slice(0, 25).map((weapon) => {
              const e = weaponEmoji(weapon, event.itemMap);
              return { label: weapon, value: weapon, emoji: e === '🔹' ? undefined : e };
            })
          );

        await interaction.reply({
          content: `Pick your ${category} build:`,
          components: [new ActionRowBuilder().addComponents(select)],
          ephemeral: true,
        });
        return;
      }

      // items mode
      const items = catData.items;
      const available = items.filter((i) => i.signups.length < i.slots);

      if (available.length === 0) {
        await interaction.reply({ content: `All ${category} slots are full.`, ephemeral: true });
        return;
      }

      if (available.length === 1) {
        removeUserFromEvent(event, interaction.user.id);
        available[0].signups.push(interaction.user.id);
        saveEvents(events);
        await interaction.update({ embeds: [buildEmbed(event)], components: buildButtons(event) });
        return;
      }

      const select = new StringSelectMenuBuilder()
        .setCustomId(`event_select:${category}:${eventId}`)
        .setPlaceholder(`Choose your ${category} build`)
        .addOptions(
          available.slice(0, 25).map((item) => {
            const e = weaponEmoji(item.name, event.itemMap);
            return {
              label: `${item.name} (${item.signups.length}/${item.slots} taken)`,
              value: item.name,
              emoji: e === '🔹' ? undefined : e,
            };
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

      const chosenName = interaction.values[0];
      const catData = event.categories[category];

      if (catData.mode === 'quota') {
        if (catData.signups.length >= catData.capacity) {
          await interaction.update({ content: 'That role just filled up, try another.', components: [] });
          return;
        }
        removeUserFromEvent(event, interaction.user.id);
        catData.signups.push({ userId: interaction.user.id, weapon: chosenName });
        saveEvents(events);

        try {
          await updateEventMessage(client, event);
        } catch (e) {
          console.error('Failed to update event message after select', e);
        }

        await interaction.update({ content: `Signed up as **${chosenName}** (${category}).`, components: [] });
        return;
      }

      const item = catData.items.find((i) => i.name === chosenName);
      if (!item || item.signups.length >= item.slots) {
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

      await interaction.update({ content: `Signed up as **${chosenName}** (${category}).`, components: [] });
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
      await interaction.update({ embeds: [buildEmbed(event)], components: buildButtons(event) });
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

client.login(process.env.DISCORD_TOKEN);
