// event-render.js
// Builds the Discord embed/buttons for an event, and pushes updates to the
// posted message. Split out of index.js so the site (api.js) can reuse the
// exact same rendering — e.g. its "Ping" button and its "sign up" action
// both need to push a live update to the same Discord message the bot
// posted, using the exact same layout.
//
// Requires discord.js builders, so (unlike events-store.js) this can't be
// required from anywhere without discord.js installed — that's fine, it's
// always used alongside the bot's own dependencies either way.

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const comps = require('./comps');
const eventsStore = require('./events-store');
const weaponAliasStore = require('./weapon-alias-store');

const CATEGORY_ORDER = eventsStore.CATEGORY_ORDER;
const CATEGORY_META = {
  Tank: { emoji: '🔵', style: ButtonStyle.Primary },
  DPS: { emoji: '🔴', style: ButtonStyle.Danger },
  Healer: { emoji: '🟢', style: ButtonStyle.Success },
  Support: { emoji: '🟡', style: ButtonStyle.Secondary },
  Battlemount: { emoji: '⚪', style: ButtonStyle.Secondary },
};

const EVENT_TYPE_EMOJI = eventsStore.EVENT_TYPE_EMOJI;

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
  const activityEmoji = EVENT_TYPE_EMOJI[event.type] || '🔷';
  const embed = new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle(`${activityEmoji} ${event.title}`)
    .addFields({ name: '🕒 Time', value: event.time });

  if (event.mass) embed.addFields({ name: '📍 Mass', value: event.mass, inline: true });
  if (event.sets) embed.addFields({ name: '🎒 Sets', value: event.sets, inline: true });

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
    // Multi-choice line — each option gets its own weapon emoji, chained
    // with "/" (no per-option build link, no separate "Any" fallback since
    // a multi-choice line is never nameless).
    const label = row.options
      ? row.options.map((o) => `${o.emoji || '🔹'} **${weaponAliasStore.weaponDisplayName(o.name)}**`).join('/')
      : `${row.emoji || '🔹'} ${row.name ? `**${weaponAliasStore.weaponDisplayName(row.name)}**` : '*Any*'}`;
    rosterLines.push(`${roleEmoji}-${label} : ${status}`);
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
  // Row 1: up to 5 role buttons, one per active category (Discord's
  // 5-buttons-per-row limit means this can't share a row with anything else
  // once all categories in CATEGORY_ORDER are active).
  const roleRow = new ActionRowBuilder();
  const activeCats = CATEGORY_ORDER.filter((c) => event.categories[c]);

  for (const cat of activeCats) {
    roleRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`event_role:${cat}:${event.id}`)
        .setLabel(cat)
        .setEmoji(roleEmojiForButton(guild, cat))
        .setStyle(CATEGORY_META[cat].style)
        .setDisabled(event.closed)
    );
  }

  // Row 2: Leave + Ask a build. "Ask a build" stays enabled even once the
  // event is closed — people should still be able to check gear afterward.
  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`event_leave:${event.id}`)
      .setLabel('Leave')
      .setEmoji('🚪')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(event.closed),
    new ButtonBuilder()
      .setCustomId(`event_askbuild:${event.id}`)
      .setLabel('Ask a build')
      .setEmoji('🧭')
      .setStyle(ButtonStyle.Secondary)
  );

  return [roleRow, actionRow];
}

// Pushes a fresh embed/components onto the already-posted event message.
// Used after ANY mutation from either side (Discord buttons, /event edit,
// /event refresh, or the site's create/edit/sign-up/close/refresh) so the
// live Discord message never goes stale.
async function updateEventMessage(client, event) {
  const channel = await client.channels.fetch(event.channelId);
  const message = await channel.messages.fetch(event.id);
  await message.edit({ embeds: [buildEmbed(event, channel.guild)], components: buildButtons(event, channel.guild) });
  return message;
}

function findDahaloRole(guild) {
  if (!guild) return null;
  return guild.roles.cache.find((r) => r.name.toLowerCase() === 'dahalo') || null;
}

// Content string for pinging @Dahalo — used on the event's own channel
// message (see api.js / index.js's /event create), not inside its thread.
// Discord only auto-adds/notifies a role's members from a mention made
// *inside a thread* when that role has fewer than 100 members; past that,
// the mention still renders but silently notifies nobody who isn't already
// in the thread. A normal channel message has no such cap, so the ping
// belongs on the embed post itself. Returns null if the server has no
// "Dahalo" role.
function dahaloPingContent(guild) {
  const role = findDahaloRole(guild);
  return role ? `📢 <@&${role.id}>` : null;
}

// Finds the dedicated reminders channel (named "event-reminders", loosely
// matched so decorative prefixes like "╏📢╏" don't need to match exactly)
// that every event reminder — the 30-minute auto reminder and the manual
// "Ping" button — gets posted to instead of the event's own channel or
// thread. Returns null if no such channel exists in the guild yet.
function findEventRemindersChannel(guild) {
  if (!guild) return null;
  return (
    guild.channels.cache.find(
      (c) => c.isTextBased && c.isTextBased() && !(c.isThread && c.isThread()) && c.name.toLowerCase().includes('event-reminders')
    ) || null
  );
}

// Jump link straight to an event's posted embed message, so a reminder
// sent elsewhere (e.g. #event-reminders) can link back to where the actual
// sign-up buttons live.
function eventJumpLink(event) {
  return `https://discord.com/channels/${event.guildId}/${event.channelId}/${event.id}`;
}

// Builds the #event-reminders message content — shared by the 30-minute
// auto reminder and the manual "Ping" button so both stay in sync. `missing`
// is getMissingRolesSummary(event)'s result. Pass `pingedBy` (a username)
// only for the manual, site-triggered ping — it adds one extra trailing
// line, omitted for the automatic reminder.
function buildReminderMessage(event, guild, missing, pingedBy) {
  const role = findDahaloRole(guild);
  const missingText = missing.map((m) => `${m.missing} ${m.category}`).join(', ');
  const lines = [
    role ? `<@&${role.id}> ⏰` : '⏰',
    '',
    `Reminder for **${event.title}** - ${event.time}`,
    '',
    `Still missing: ${missingText}`,
    '',
    `GO SIGN UP HERE ---> ${eventJumpLink(event)}`,
  ];
  if (pingedBy) lines.push('', `(pinged from the site by ${pingedBy})`);
  return lines.join('\n');
}

// Best-effort cleanup of the posted message (and its thread, if one was
// created) when an event is deleted outright — used by both /event delete
// and the site's delete button. Never throws: if the message or thread was
// already removed manually, or the bot no longer has access, deleting the
// event's data should still succeed regardless.
async function deleteEventMessage(client, event) {
  try {
    const channel = await client.channels.fetch(event.channelId);
    const message = await channel.messages.fetch(event.id);
    await message.delete();
  } catch {
    // already gone, or the bot can't see it anymore — not fatal
  }
  try {
    const thread = await client.channels.fetch(event.id);
    if (thread && thread.isThread && thread.isThread()) {
      await thread.delete();
    }
  } catch {
    // no thread was ever created, or it's already gone
  }
}

// Auto-creates the event's Discord thread right when it's first posted,
// instead of waiting for someone to manually right-click → Create Thread
// on the event message (which used to be the only way reminders could ever
// work at all — see the "No Discord thread exists yet" error elsewhere).
// The actual @Dahalo ping happens on the channel message itself (see
// dahaloPingContent above) rather than in here — a role ping dropped
// inside a thread only notifies members already in that thread once the
// role passes ~100 members, which silently breaks the ping for a
// guild-wide role. Best-effort: thread creation can fail (rate limits,
// permission hiccups, an unboosted guild rejecting a longer archive
// duration) without stopping the event itself from existing — callers just
// don't get an auto-thread yet and can still create one manually.
async function createEventThread(message, event) {
  try {
    return await message.startThread({
      name: (event.title || 'Event').slice(0, 100),
      autoArchiveDuration: 1440,
    });
  } catch (e) {
    console.error('Failed to auto-create event thread', event.id, e);
    return null;
  }
}

// Deletes the previous reminder message (if any) right before a new one
// gets posted, so an event's channel/thread doesn't accumulate a stack of
// stale reminders — used by both the auto reminder loop and the manual
// "Ping" button (site + bot). `channel` can be any text-based channel or
// thread. Best-effort: the message may already be gone (deleted manually,
// or from before the bot could see it), which isn't a reason to skip
// sending the new reminder.
async function deletePreviousReminder(channel, messageId) {
  if (!messageId) return;
  try {
    const message = await channel.messages.fetch(messageId);
    await message.delete();
  } catch {
    // already gone, or unreachable — fine, just move on
  }
}

module.exports = {
  CATEGORY_META,
  ROLE_EMOJI_NAMES,
  findCustomRoleEmoji,
  roleEmojiText,
  roleEmojiForButton,
  buildEmbed,
  buildButtons,
  updateEventMessage,
  deleteEventMessage,
  createEventThread,
  deletePreviousReminder,
  findDahaloRole,
  dahaloPingContent,
  findEventRemindersChannel,
  eventJumpLink,
  buildReminderMessage,
};
