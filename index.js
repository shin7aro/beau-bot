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
  AttachmentBuilder,
} = require('discord.js');

const comps = require('./comps');
const eventsStore = require('./events-store');
const eventRender = require('./event-render');
const { askAI, isOnCooldown, markAsked } = require('./ai-assistant');
const storage = require('./storage');
const activityStore = require('./activity-store');
const buildsStore = require('./builds-store');
const itemMap = require('./item-map');
const { weaponEmoji } = require('./live-comps');
const { renderBuildCard } = require('./build-card-image');

// Discord-facing helpers that used to be defined inline here now live in
// events-store.js (pure data) and event-render.js (discord.js rendering) —
// shared with the site's REST API (api.js) so a sign-up, edit, close, or
// refresh from either side behaves identically. Destructured under their
// original names so nothing else in this file has to change.
const { loadEvents, saveEvents, removeUserFromEvent, getSignedUpUserIds, getMissingRolesSummary } = eventsStore;
const { buildEmbed, buildButtons, updateEventMessage, findDahaloRole } = eventRender;

// Shapes a Discord user into the { id, username, role } shape activity-store
// expects — "role" here is just a label for the log (Discord doesn't have
// officer/admin the same way the site's OAuth session does), not a
// permission check.
function logUser(discordUser) {
  return { id: discordUser.id, username: discordUser.username, role: 'discord' };
}

// ---------- storage ----------
// loadEvents/saveEvents come from events-store.js (see the requires block
// above) — same Redis key/local file as before, just shared with the site.

// Populated by the bootstrap at the bottom of this file, before login.
let events = {};

// Temporary holding areas between a slash command / button and the modal submit
const pendingCreations = new Map(); // /event create (manual composition path)
const pendingCompActions = new Map(); // /comp create and /comp edit

// ---------- category metadata ----------
const CATEGORY_ORDER = comps.CATEGORY_ORDER; // ['Tank', 'Support', 'DPS', 'Healer', 'Battlemount']

// CATEGORY_META, event-type emoji, custom role-emoji lookup, buildEmbed, and
// buildButtons all now live in event-render.js (see the requires block at
// the top of this file) — shared with the site's "Ping" and sign-up
// actions. Nothing below this line changed; it just calls the imported
// buildEmbed/buildButtons instead of locally-defined ones.

// Colors match the CSS custom properties in public/css/base.css
// (--tank, --healer, --support, --dps, --gank), hex-ified.
const ROLE_EMBED_COLORS = { tank: 0x5d8fc9, healer: 0x6bab7a, support: 0xcf9d3f, dps: 0xc75847, gank: 0x9b72c4 };

// Builds the "Ask a build" reply payload — mirrors the detail card shown on
// the right side of builds.html when you click a build there. Text fields
// (Role/Head/Cape/etc.) are always included; the composited slot-icon image
// (see build-card-image.js) is added on top when rendering succeeds, since a
// Discord embed can only carry one setImage()/setThumbnail(), not a
// per-field icon. If the image render fails for any reason (network hiccup
// to render.albiononline.com, sharp error, etc.), the reply still goes out
// with just the weapon thumbnail and text fields — never blocks on this.
async function buildAskBuildEmbed(build) {
  const slot = (name) => name || '—';
  const emoji = weaponEmoji(build.weapon, itemMap.ITEM_MAP);
  const embed = new EmbedBuilder()
    .setTitle(`${emoji} ${build.weapon || 'Unnamed build'}`)
    .setColor(ROLE_EMBED_COLORS[build.role] ?? 0x99aab5);

  const thumb = itemMap.itemImageUrl(build.weapon);
  if (thumb) embed.setThumbnail(thumb);

  embed.addFields(
    { name: 'Role', value: build.role ? build.role[0].toUpperCase() + build.role.slice(1) : '—', inline: true },
    { name: 'Head', value: slot(build.head), inline: true },
    { name: 'Cape', value: slot(build.cape), inline: true },
    { name: 'Chest', value: slot(build.chest), inline: true },
    { name: 'Offhand', value: slot(build.offhand), inline: true },
    { name: 'Feet', value: slot(build.feet), inline: true },
    { name: 'Potion', value: slot(build.potion), inline: true },
    { name: 'Food', value: slot(build.food), inline: true }
  );

  if (build.note) {
    embed.addFields({ name: '📌 Note', value: build.note });
  }

  const files = [];
  try {
    const cardBuffer = await renderBuildCard(build);
    const attachment = new AttachmentBuilder(cardBuffer, { name: 'build-card.png' });
    embed.setImage('attachment://build-card.png');
    files.push(attachment);
  } catch (e) {
    console.error('Failed to render build card image, falling back to text-only embed', e);
  }

  return { embeds: [embed], files };
}

// Every role row in an event that has a build linked, deduped by
// tab:id — used by both the "Ask a build" button and its follow-up select.
function linkedBuildRowsFor(event) {
  const rows = comps.expandAllCategoryRows(event.categories, CATEGORY_ORDER);
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    if (!row.buildTab || row.buildId == null) continue;
    const key = `${row.buildTab}:${row.buildId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

// A single Discord select menu is capped at 25 options — an event spanning
// several parties can easily have more than 25 linked-build rows across all
// categories combined, which silently truncated the list under the old
// one-menu-for-everything approach. Splitting into one menu per category
// instead uses Discord's 5-action-rows-per-message allowance (which happens
// to match CATEGORY_ORDER's 5 categories exactly) to get up to 125 slots
// total (25 per category) rather than 25 overall.
function buildAskBuildSelectRows(eventId, linkedRows) {
  const rowsByCategory = new Map();
  for (const row of linkedRows) {
    if (!rowsByCategory.has(row.category)) rowsByCategory.set(row.category, []);
    rowsByCategory.get(row.category).push(row);
  }

  const actionRows = [];
  const truncatedCategories = [];

  for (const cat of CATEGORY_ORDER) {
    const rows = rowsByCategory.get(cat);
    if (!rows || rows.length === 0) continue;

    if (rows.length > 25) truncatedCategories.push(cat);

    const select = new StringSelectMenuBuilder()
      .setCustomId(`event_askbuild_select:${eventId}:${cat}`)
      .setPlaceholder(`Choose a ${cat} build`)
      .addOptions(
        rows.slice(0, 25).map((row) => ({
          label: row.name || 'Unnamed build',
          value: `${row.buildTab}:${row.buildId}`,
        }))
      );

    actionRows.push(new ActionRowBuilder().addComponents(select));
  }

  return { actionRows, truncatedCategories };
}

// removeUserFromEvent, getSignedUpUserIds, getMissingRolesSummary, and
// findDahaloRole all now live in events-store.js / event-render.js (see the
// requires block at the top of this file).

// Shared by both the "pick no-shows" select menu and the "no no-shows"
// button — marks the event closed, records who didn't show, updates the
// posted embed, and announces the outcome publicly in the event's channel.
async function finalizeEventClose(client, event, noShowIds, closedByUser) {
  event.closed = true;
  event.noShows = noShowIds;
  await saveEvents(events);

  if (closedByUser) {
    activityStore.log(
      logUser(closedByUser),
      'event.close',
      `Closed event "${event.title}" (${event.type})${noShowIds.length ? ` — ${noShowIds.length} no-show${noShowIds.length === 1 ? '' : 's'}` : ''}`
    );
  }

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

// updateEventMessage now lives in event-render.js (see the requires block
// at the top of this file).

// ---------- client ----------
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Hands the live client to the site's REST API (see api.js's setClient) so
// site-triggered actions that need to touch Discord — currently just the
// events page's "Ping" button — can post/edit messages through the same
// bot connection, without api.js requiring index.js (which would re-run
// this whole file as a side effect — see the note in api.js).
require('./api.js').setClient(client);

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
              itemName = comps.itemLabel(catData.items[idx]);
              catData.items[idx].signups = [];
              if (catData.items[idx].options) catData.items[idx].signedOptionIndex = null;
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
          const onlyIdx = availableIndexes[0];
          const onlyItem = items[onlyIdx];
          if (onlyItem.options) {
            const optSelect = new StringSelectMenuBuilder()
              .setCustomId(`event_optionselect_for:${roleMatch}:${event.id}:${onlyIdx}:${targetUser.id}`)
              .setPlaceholder(`Choose ${targetUser.username}'s ${roleMatch} weapon`)
              .addOptions(onlyItem.options.slice(0, 25).map((opt, i) => {
                const option = { label: opt.name, value: String(i) };
                if (opt.emoji) option.emoji = opt.emoji;
                return option;
              }));
            await message.reply({
              content: `Pick <@${targetUser.id}>'s **${roleMatch}** weapon:`,
              components: [new ActionRowBuilder().addComponents(optSelect)],
            });
            return;
          }

          removeUserFromEvent(event, targetUser.id);
          items[onlyIdx].signups.push(targetUser.id);
          await saveEvents(events);
          await updateEventMessage(client, event);
          await message.reply(
            `✅ Added <@${targetUser.id}> to **${roleMatch}** (**${onlyItem.name}**).`
          );
          return;
        }

        const select = new StringSelectMenuBuilder()
          .setCustomId(`event_select_for:${roleMatch}:${event.id}:${targetUser.id}`)
          .setPlaceholder(`Choose ${targetUser.username}'s ${roleMatch} build`)
          .addOptions(
            availableIndexes.slice(0, 25).map((idx) => {
              const item = items[idx];
              const option = { label: comps.itemLabel(item), value: String(idx) };
              const emoji = item.options ? item.options[0].emoji : item.emoji;
              if (emoji) option.emoji = emoji;
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
        const mass = interaction.options.getString('mass');
        const sets = interaction.options.getString('sets');

        const baseMeta = {
          type,
          title,
          time,
          mass: mass || null,
          sets: sets || null,
          organizerId: interaction.user.id,
          organizerTag: interaction.member?.displayName || interaction.user.username,
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
          activityStore.log(logUser(interaction.user), 'event.create', `Created event "${event.title}" (${event.type}) from comp "${saved.label}"`);
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
          await finalizeEventClose(client, event, [], interaction.user);
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
        activityStore.log(logUser(interaction.user), 'event.refresh', `Refreshed event "${event.title}" from comp "${saved.label}"`);

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

      if (sub === 'edit') {
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
            content: 'Only the organizer or a server manager can edit this event.',
            ephemeral: true,
          });
          return;
        }

        const title = interaction.options.getString('title');
        const time = interaction.options.getString('time');
        const type = interaction.options.getString('type');
        const mass = interaction.options.getString('mass');
        const sets = interaction.options.getString('sets');
        const compKey = interaction.options.getString('comp');

        const before = { title: event.title, time: event.time, type: event.type, mass: event.mass, sets: event.sets };
        const patch = { title, time, type };
        if (mass !== null) patch.mass = mass;
        if (sets !== null) patch.sets = sets;
        eventsStore.applyMetaEdits(event, patch);

        const changes = [];
        if (event.title !== before.title) changes.push('title');
        if (event.time !== before.time) changes.push('time');
        if (event.type !== before.type) changes.push('type');
        if (event.mass !== before.mass) changes.push('mass');
        if (event.sets !== before.sets) changes.push('sets');

        let dropped = [];
        if (compKey) {
          const result = await eventsStore.relinkComp(event, compKey);
          if (result.error === 'comp_not_found') {
            await interaction.reply({
              content: "I couldn't find that saved composition — it may have been deleted. Try /comp list.",
              ephemeral: true,
            });
            return;
          }
          dropped = result.dropped;
          changes.push('composition');
        }

        if (changes.length === 0) {
          await interaction.reply({ content: 'Nothing to change — pass at least one field to edit.', ephemeral: true });
          return;
        }

        await saveEvents(events);
        activityStore.log(logUser(interaction.user), 'event.edit', `Edited event "${event.title}" (${changes.join(', ')})`);

        try {
          await updateEventMessage(client, event);
        } catch (e) {
          console.error('Failed to update event message after edit', e);
        }

        let editContent = `Event \`${eventId}\` updated: ${changes.join(', ')}.`;
        if (dropped.length > 0) {
          const names = dropped.map((d) => `<@${d.userId}> (was **${d.name}**, ${d.category})`).join(', ');
          editContent += `\n⚠️ ${dropped.length} sign-up${
            dropped.length === 1 ? '' : 's'
          } no longer had a matching slot and ${dropped.length === 1 ? 'was' : 'were'} removed: ${names}`;
        }

        await interaction.reply({ content: editContent, ephemeral: true });
        return;
      }

      if (sub === 'delete') {
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
            content: 'Only the organizer or a server manager can delete this event.',
            ephemeral: true,
          });
          return;
        }

        delete events[eventId];
        await saveEvents(events);
        activityStore.log(logUser(interaction.user), 'event.delete', `Deleted event "${event.title}" (${event.type})`);

        try {
          await eventRender.deleteEventMessage(client, event);
        } catch (e) {
          console.error('Failed to delete event message', e);
        }

        await interaction.reply({ content: `Event \`${eventId}\` ("${event.title}") deleted.`, ephemeral: true });
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
        activityStore.log(logUser(interaction.user), 'comp.delete', `Deleted composition "${saved.label}"`);
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
      activityStore.log(
        logUser(interaction.user),
        'giveaway.draw',
        `Drew ${drawCount} winner${drawCount === 1 ? '' : 's'} for "${prize}" from event "${event.title}"`
      );
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
      activityStore.log(logUser(interaction.user), 'event.create', `Created event "${event.title}" (${event.type}, manual composition)`);

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
      activityStore.log(logUser(interaction.user), 'comp.create', `Created composition "${created.label}"`);
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
      activityStore.log(logUser(interaction.user), 'comp.update', `Updated composition "${updated.label}"`);
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
        const onlyIdx = availableIndexes[0];
        const onlyItem = items[onlyIdx];
        // Multi-choice line — still need to know which weapon before we
        // can sign them up, even with only one open slot.
        if (onlyItem.options) {
          const optSelect = new StringSelectMenuBuilder()
            .setCustomId(`event_optionselect:${category}:${eventId}:${onlyIdx}`)
            .setPlaceholder(`Choose your ${category} weapon`)
            .addOptions(onlyItem.options.slice(0, 25).map((opt, i) => {
              const option = { label: opt.name, value: String(i) };
              if (opt.emoji) option.emoji = opt.emoji;
              return option;
            }));
          await interaction.reply({
            content: `Pick your ${category} weapon:`,
            components: [new ActionRowBuilder().addComponents(optSelect)],
            ephemeral: true,
          });
          return;
        }

        removeUserFromEvent(event, interaction.user.id);
        items[onlyIdx].signups.push(interaction.user.id);
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
            const option = { label: comps.itemLabel(item), value: String(idx) };
            const emoji = item.options ? item.options[0].emoji : item.emoji;
            if (emoji) option.emoji = emoji;
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

      // Multi-choice line — one more select to say which weapon, instead
      // of finishing the sign-up right here.
      if (item.options) {
        const optSelect = new StringSelectMenuBuilder()
          .setCustomId(`event_optionselect:${category}:${eventId}:${Number(chosenValue)}`)
          .setPlaceholder(`Choose your ${category} weapon`)
          .addOptions(item.options.slice(0, 25).map((opt, i) => {
            const option = { label: opt.name, value: String(i) };
            if (opt.emoji) option.emoji = opt.emoji;
            return option;
          }));
        await interaction.update({
          content: `Pick your ${category} weapon:`,
          components: [new ActionRowBuilder().addComponents(optSelect)],
        });
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

    // ----- select menu: weapon chosen for a multi-choice line (self sign-up) -----
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('event_optionselect:')) {
      const [, category, eventId, itemIndexStr] = interaction.customId.split(':');
      const event = events[eventId];
      if (!event || event.closed) {
        await interaction.update({ content: 'This event is no longer open.', components: [] });
        return;
      }

      const catData = event.categories[category];
      const item = catData && catData.items[Number(itemIndexStr)];
      if (!item || item.signups.length >= 1) {
        await interaction.update({ content: 'That slot just filled up, try another.', components: [] });
        return;
      }

      const optionIndex = Number(interaction.values[0]);
      const option = item.options && item.options[optionIndex];
      if (!option) {
        await interaction.update({ content: 'Invalid choice.', components: [] });
        return;
      }

      removeUserFromEvent(event, interaction.user.id);
      item.signups.push(interaction.user.id);
      item.signedOptionIndex = optionIndex;
      await saveEvents(events);

      try {
        await updateEventMessage(client, event);
      } catch (e) {
        console.error('Failed to update event message after option select', e);
      }

      await interaction.update({ content: `Signed up as **${option.name}** (${category}).`, components: [] });
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

      // Multi-choice line — one more select to say which weapon
      // <@targetUserId> is taking.
      if (item.options) {
        const optSelect = new StringSelectMenuBuilder()
          .setCustomId(`event_optionselect_for:${category}:${eventId}:${Number(chosenValue)}:${targetUserId}`)
          .setPlaceholder(`Choose ${targetUserId}'s ${category} weapon`)
          .addOptions(item.options.slice(0, 25).map((opt, i) => {
            const option = { label: opt.name, value: String(i) };
            if (opt.emoji) option.emoji = opt.emoji;
            return option;
          }));
        await interaction.update({
          content: `Pick <@${targetUserId}>'s **${category}** weapon:`,
          components: [new ActionRowBuilder().addComponents(optSelect)],
        });
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

    // ----- select menu: weapon chosen for a multi-choice line (assigning someone else) -----
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('event_optionselect_for:')) {
      const [, category, eventId, itemIndexStr, targetUserId] = interaction.customId.split(':');
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

      const catData = event.categories[category];
      const item = catData && catData.items[Number(itemIndexStr)];
      if (!item || item.signups.length >= 1) {
        await interaction.update({ content: 'That slot just filled up, try another.', components: [] });
        return;
      }

      const optionIndex = Number(interaction.values[0]);
      const option = item.options && item.options[optionIndex];
      if (!option) {
        await interaction.update({ content: 'Invalid choice.', components: [] });
        return;
      }

      removeUserFromEvent(event, targetUserId);
      item.signups.push(targetUserId);
      item.signedOptionIndex = optionIndex;
      await saveEvents(events);

      try {
        await updateEventMessage(client, event);
      } catch (e) {
        console.error('Failed to update event message after option select', e);
      }

      await interaction.update({
        content: `✅ Added <@${targetUserId}> as **${option.name}** (${category}).`,
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
      await finalizeEventClose(client, event, noShowIds, interaction.user);
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

      await finalizeEventClose(client, event, [], interaction.user);
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

    // ----- "Ask a build" button: reply (ephemeral) with the build card for
    // whichever role(s) on this event have a build linked -----
    if (interaction.isButton() && interaction.customId.startsWith('event_askbuild:')) {
      const [, eventId] = interaction.customId.split(':');
      const event = events[eventId];
      if (!event) {
        await interaction.reply({ content: 'Event not found.', ephemeral: true });
        return;
      }

      const linkedRows = linkedBuildRowsFor(event);

      if (linkedRows.length === 0) {
        await interaction.reply({ content: 'No builds are linked to this event.', ephemeral: true });
        return;
      }

      if (linkedRows.length === 1) {
        const row = linkedRows[0];
        // Loading the build + compositing its icon grid can take longer
        // than Discord's 3-second interaction window, so acknowledge first
        // and fill in the real content once it's ready.
        await interaction.deferReply({ ephemeral: true });

        const allBuilds = await buildsStore.loadAllBuilds();
        const build = (allBuilds[row.buildTab] || [])[row.buildId];
        if (!build) {
          await interaction.editReply({ content: 'That build could not be found — it may have been removed from the war ledger.' });
          return;
        }
        const payload = await buildAskBuildEmbed(build);
        await interaction.editReply(payload);
        return;
      }

      const { actionRows, truncatedCategories } = buildAskBuildSelectRows(eventId, linkedRows);

      let content = 'Which build would you like to see?';
      if (truncatedCategories.length > 0) {
        content += `\n\n⚠️ Discord caps each dropdown at 25 options — showing only the first 25 for: ${truncatedCategories.join(', ')}.`;
      }

      await interaction.reply({
        content,
        components: actionRows,
        ephemeral: true,
      });
      return;
    }

    // ----- follow-up select for "Ask a build" when more than one role has a
    // linked build -----
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('event_askbuild_select:')) {
      // Same reasoning as above — defer immediately, since loading the
      // build + compositing its icon grid can exceed Discord's 3-second
      // window. deferUpdate (not deferReply) because this edits the
      // existing ephemeral message in place rather than sending a new one.
      await interaction.deferUpdate();

      const [buildTab, buildIdRaw] = interaction.values[0].split(':');
      const buildId = Number(buildIdRaw);

      const allBuilds = await buildsStore.loadAllBuilds();
      const build = (allBuilds[buildTab] || [])[buildId];
      if (!build) {
        await interaction.editReply({ content: 'That build could not be found — it may have been removed from the war ledger.', embeds: [], components: [] });
        return;
      }

      const payload = await buildAskBuildEmbed(build);
      await interaction.editReply({ content: null, components: [], ...payload });
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
