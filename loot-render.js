// loot-render.js
// Builds the Discord embed + buttons for a loot split, posts it (+ pings +
// thread) to the payout channel, and pushes updates as people claim or
// donate their share. Split out of index.js the same way event-render.js
// is, so the site's "create a split" form can trigger the exact same
// Discord post the /loot create command does.

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const lootStore = require('./loot-store');

const CLAIM_BUTTON_LABEL = "I took my split";
const DONATE_BUTTON_LABEL = 'Donate my share to the guild';
const GOLD = 0xf1c40f;

// The channel a loot split gets posted to — same "strip the leading emoji
// icon off the channel name, then compare" approach api.js's event-channel
// picker uses, so a "╏💵╏payout"-style icon on the channel doesn't break
// the match.
const PAYOUT_CHANNEL_NAMES = ['payout', 'beau-bot-phase-de-test'];

function stripLeadingChannelIcon(name) {
  return String(name || '').toLowerCase().replace(/^[^a-z0-9]+/, '');
}

function findPayoutChannel(guild) {
  if (!guild) return null;
  return (
    guild.channels.cache.find(
      (c) => (c.type === 0 || c.type === 5) && PAYOUT_CHANNEL_NAMES.includes(stripLeadingChannelIcon(c.name))
    ) || null
  );
}

function formatSilver(n) {
  return Math.round(n).toLocaleString('en-US');
}

function buildEmbed(split) {
  const pending = lootStore.unclaimedParticipants(split);
  const taxLabel = split.taxed ? '🏛️ Guild tax (5%)' : '🏛️ Guild tax';
  const taxValue = split.taxed ? formatSilver(split.taxAmount) : 'None — untaxed run';

  const embed = new EmbedBuilder()
    .setColor(split.closed ? 0x6bab7a : GOLD)
    .setTitle(`💰 Loot Split — ${split.lootName}`)
    .addFields(
      { name: '💰 Loot value', value: formatSilver(split.lootValue), inline: true },
      { name: taxLabel, value: taxValue, inline: true },
      {
        name: '🤝 Share per participant',
        value: `${formatSilver(split.shareAmount)} × ${split.participants.length}`,
        inline: true,
      }
    );

  if (split.lootLocation) {
    embed.addFields({ name: '📍 Location', value: split.lootLocation });
  }

  const rosterLines = split.participants.map((p) => {
    if (p.claimed) return `✅ <@${p.userId}> — took their split`;
    if (p.donated) return `🎁 <@${p.userId}> — donated to the guild`;
    return `⏳ <@${p.userId}> — pending`;
  });
  embed.addFields({ name: 'Participants', value: rosterLines.join('\n') });

  embed.setFooter({
    text: split.closed
      ? `All shares resolved • ID: ${split.id}`
      : `Use the buttons below • ${pending.length} pending • auto-donated to the guild after 1 week • ID: ${split.id}`,
  });
  embed.setTimestamp(split.createdAt);

  return embed;
}

// Buttons every participant uses to resolve their own share. Left enabled
// (participant-only enforcement happens when the button is clicked, in
// index.js — anyone can see them, only a listed participant can use them)
// until the split is fully resolved, at which point both are disabled so
// the message reads as done.
function buildActionRow(split) {
  const claimBtn = new ButtonBuilder()
    .setCustomId(`loot_claim:${split.id}`)
    .setLabel(CLAIM_BUTTON_LABEL)
    .setEmoji('✅')
    .setStyle(ButtonStyle.Success)
    .setDisabled(split.closed);

  const donateBtn = new ButtonBuilder()
    .setCustomId(`loot_donate:${split.id}`)
    .setLabel(DONATE_BUTTON_LABEL)
    .setEmoji('🎁')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(split.closed);

  return new ActionRowBuilder().addComponents(claimBtn, donateBtn);
}

// Posts a brand-new split to the guild's payout channel: the embed, a
// content line that actually @-mentions every participant (so they get a
// real notification, not just an embed nobody sees), the claim/donate
// buttons, and a thread on the message for the recurring "you still
// haven't claimed" reminders. Mutates and returns `split` with
// messageId/threadId/channelId filled in — caller still needs to call
// lootStore.saveNewSplit(split) after this succeeds.
async function postSplit(client, split, guildId) {
  const guild = await client.guilds.fetch(guildId);
  const channel = findPayoutChannel(guild);
  if (!channel) {
    return { error: 'no_payout_channel' };
  }

  const mentions = split.participants.map((p) => `<@${p.userId}>`).join(' ');
  const message = await channel.send({
    content: `📢 ${mentions}`,
    embeds: [buildEmbed(split)],
    components: [buildActionRow(split)],
  });

  split.messageId = message.id;
  split.channelId = channel.id;
  split.guildId = guild.id;

  try {
    const thread = await message.startThread({
      name: `Loot: ${split.lootName}`.slice(0, 100),
      autoArchiveDuration: 1440,
    });
    split.threadId = thread.id;
    await thread.send(
      "Track your split here. I'll ping anyone who hasn't claimed or donated yet every couple hours — and after a week, any still-unclaimed share gets automatically donated to the guild."
    );
  } catch (e) {
    console.error('loot-render: failed to create thread for split', e);
  }

  return { message };
}

// Re-renders the embed + buttons on an already-posted split's message —
// called after any claim/donation so the roster's status, footer count,
// and button disabled-state all stay live.
async function updateSplitMessage(client, split) {
  if (!split.messageId || !split.channelId) return;
  const channel = await client.channels.fetch(split.channelId);
  const message = await channel.messages.fetch(split.messageId);
  await message.edit({ embeds: [buildEmbed(split)], components: [buildActionRow(split)] });
  return message;
}

// Called once, right when a split transitions from "someone still pending"
// to "everyone's resolved" — whether that happened via the claim button,
// the donate button, /loot mark-claimed, the site's manual "mark claimed"
// action, or the auto-donate sweep. Posts a little wrap-up in the thread
// and archives it.
async function celebrateCompletedThread(client, split) {
  if (!split.threadId) return;
  try {
    const thread = await client.channels.fetch(split.threadId);
    if (thread && thread.isThread && thread.isThread()) {
      await thread.send(`🎉 Every share of **${split.lootName}** has been claimed or donated — nice work.`);
      await thread.setArchived(true).catch(() => {});
    }
  } catch (e) {
    console.error('loot-render: failed to post/archive completed-split thread message', e);
  }
}

// Deletes the previous reminder message (if any) right before a new one
// gets posted, so a thread doesn't accumulate a stack of stale reminders —
// used by the auto reminder sweep and both manual "remind" triggers (site +
// bot). Best-effort: the message may already be gone, which isn't a reason
// to skip sending the new reminder.
async function deletePreviousReminder(thread, messageId) {
  if (!messageId) return;
  try {
    const message = await thread.messages.fetch(messageId);
    await message.delete();
  } catch {
    // already gone, or unreachable — fine, just move on
  }
}

module.exports = {
  PAYOUT_CHANNEL_NAMES,
  stripLeadingChannelIcon,
  findPayoutChannel,
  formatSilver,
  buildEmbed,
  buildActionRow,
  postSplit,
  updateSplitMessage,
  celebrateCompletedThread,
  deletePreviousReminder,
};
