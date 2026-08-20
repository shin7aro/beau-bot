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
    const rowWeaponEmoji = row.emoji || '🔹';
    const label = row.name ? `**${row.name}**` : '*Any*';
    rosterLines.push(`${roleEmoji} - ${rowWeaponEmoji} - ${label} : ${status}`);
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

module.exports = {
  CATEGORY_META,
  ROLE_EMOJI_NAMES,
  findCustomRoleEmoji,
  roleEmojiText,
  roleEmojiForButton,
  buildEmbed,
  buildButtons,
  updateEventMessage,
  findDahaloRole,
};
