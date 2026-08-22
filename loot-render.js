// loot-render.js
// Builds the Discord embed for a loot split, posts it (+ pings + ✅ reaction
// + thread) to the payout channel, and pushes updates as people claim their
// share. Split out of index.js the same way event-render.js is, so the
// site's "create a split" form can trigger the exact same Discord post the
// /loot create command does.

const { EmbedBuilder } = require('discord.js');
const lootStore = require('./loot-store');

const CLAIM_EMOJI = '✅';
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
  return `${Math.round(n).toLocaleString('en-US')} silver`;
}

function buildEmbed(split) {
  const unclaimed = lootStore.unclaimedParticipants(split);
  const embed = new EmbedBuilder()
    .setColor(split.closed ? 0x6bab7a : GOLD)
    .setTitle(`💰 Loot Split — ${split.lootName}`)
    .addFields(
      { name: '💰 Loot value', value: formatSilver(split.lootValue), inline: true },
      { name: '🏛️ Guild tax (5%)', value: formatSilver(split.taxAmount), inline: true },
      {
        name: '🤝 Share per participant',
        value: `${formatSilver(split.shareAmount)} × ${split.participants.length}`,
        inline: true,
      }
    );

  if (split.lootLocation) {
    embed.addFields({ name: '📍 Location', value: split.lootLocation });
  }

  const rosterLines = split.participants.map(
    (p) => `${p.claimed ? '✅' : '⏳'} <@${p.userId}>`
  );
  embed.addFields({ name: 'Participants', value: rosterLines.join('\n') });

  embed.setFooter({
    text: split.closed
      ? `Fully claimed • ID: ${split.id}`
      : `React ${CLAIM_EMOJI} once you've taken your split • ${unclaimed.length} pending • ID: ${split.id}`,
  });
  embed.setTimestamp(split.createdAt);

  return embed;
}

// Posts a brand-new split to the guild's payout channel: the embed, a
// content line that actually @-mentions every participant (so they get a
// real notification, not just an embed nobody sees), a bot-added ✅
// reaction so members just have to click the same one, and a thread on the
// message for the recurring "you still haven't claimed" reminders. Mutates
// and returns `split` with messageId/threadId/channelId filled in — caller
// still needs to call lootStore.saveNewSplit(split) after this succeeds.
async function postSplit(client, split, guildId) {
  const guild = await client.guilds.fetch(guildId);
  const channel = findPayoutChannel(guild);
  if (!channel) {
    return { error: 'no_payout_channel' };
  }

  const mentions = split.participants.map((p) => `<@${p.userId}>`).join(' ');
  const message = await channel.send({
    content: `${mentions}\n📢 New loot split posted — react ${CLAIM_EMOJI} below once you've taken your share.`,
    embeds: [buildEmbed(split)],
  });

  try {
    await message.react(CLAIM_EMOJI);
  } catch (e) {
    console.error('loot-render: failed to add claim reaction', e);
  }

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
      `Track your split here. I'll ping anyone who hasn't reacted ${CLAIM_EMOJI} yet every couple hours until everyone's claimed.`
    );
  } catch (e) {
    console.error('loot-render: failed to create thread for split', e);
  }

  return { message };
}

// Re-renders the embed on an already-posted split's message — called after
// any claim so the roster's ✅/⏳ status and footer count stay live.
async function updateSplitMessage(client, split) {
  if (!split.messageId || !split.channelId) return;
  const channel = await client.channels.fetch(split.channelId);
  const message = await channel.messages.fetch(split.messageId);
  await message.edit({ embeds: [buildEmbed(split)] });
  return message;
}

// Called once, right when a split transitions from "someone still pending"
// to "everyone's claimed" — whether that happened via a ✅ reaction, the
// /loot mark-claimed command, or the site's manual "mark claimed" action.
// Posts a little celebration in the thread and archives it.
async function celebrateCompletedThread(client, split) {
  if (!split.threadId) return;
  try {
    const thread = await client.channels.fetch(split.threadId);
    if (thread && thread.isThread && thread.isThread()) {
      await thread.send(`🎉 Everyone's claimed their split of **${split.lootName}** — nice work.`);
      await thread.setArchived(true).catch(() => {});
    }
  } catch (e) {
    console.error('loot-render: failed to post/archive completed-split thread message', e);
  }
}

module.exports = {
  CLAIM_EMOJI,
  PAYOUT_CHANNEL_NAMES,
  stripLeadingChannelIcon,
  findPayoutChannel,
  formatSilver,
  buildEmbed,
  postSplit,
  updateSplitMessage,
  celebrateCompletedThread,
};
