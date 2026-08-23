// loot-store.js
// Shared loot-split storage + math, used by BOTH the Discord bot (index.js)
// and the website (api.js) — same pattern as events-store.js. No discord.js
// dependency on purpose; anything that needs to actually post/edit a
// Discord message lives in loot-render.js instead.
//
// Two separate Redis keys on purpose:
//  - loot_splits  : the most recent MAX_SPLITS split records in full (for
//    the "recent activity" list on the site and /loot list). Capped, like
//    activity-store's log, so it doesn't grow unbounded.
//  - loot_totals  : lifetime running totals (all-time guild tax, all-time
//    loot value, all-time member earnings, donations, per-member
//    breakdown). NEVER trimmed — this is what answers "total X of all
//    time", independent of whether the individual split record aged out of
//    the capped list above.
//
// A participant's share ends up in exactly one of three states:
//  - pending  : neither claimed nor donated yet (the default)
//  - claimed  : they took it themselves (claimed:true)
//  - donated  : they gave it to the guild instead — either by pressing the
//    "donate my share" button themselves, or automatically after a split
//    sits unclaimed for a week (donated:true)
// claimed and donated are mutually exclusive and, once set, final.

const path = require('path');
const storage = require('./storage');

const SPLITS_DB_PATH = path.join(__dirname, 'loot-splits.json'); // local fallback path only
const TOTALS_DB_PATH = path.join(__dirname, 'loot-totals.json'); // local fallback path only
const SPLITS_REDIS_KEY = 'loot_splits';
const TOTALS_REDIS_KEY = 'loot_totals';
const MAX_SPLITS = 300;

const TAX_RATE = 0.05; // 5% donated to the guild off the top, when a split is taxed
const AUTO_DONATE_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

let cachedSplits = null;
let splitsLoadingPromise = null;
let cachedTotals = null;
let totalsLoadingPromise = null;

async function loadSplits() {
  if (cachedSplits) return cachedSplits;
  if (!splitsLoadingPromise) {
    splitsLoadingPromise = storage.loadJSON(SPLITS_REDIS_KEY, SPLITS_DB_PATH).then((data) => {
      cachedSplits = Array.isArray(data.entries) ? data.entries : [];
      return cachedSplits;
    });
  }
  return splitsLoadingPromise;
}

async function saveSplits(entries) {
  cachedSplits = entries;
  await storage.saveJSON(SPLITS_REDIS_KEY, SPLITS_DB_PATH, { entries });
}

function emptyTotals() {
  return {
    totalLootValue: 0,
    totalGuildTax: 0,
    totalMemberShare: 0, // silver members actually kept (donated shares move OUT of this)
    totalDonated: 0, // silver members chose (or were auto-defaulted) to give back
    splitCount: 0,
    perMember: {}, // { [userId]: { username, totalReceived, splitsParticipated } }
  };
}

async function loadTotals() {
  if (cachedTotals) return cachedTotals;
  if (!totalsLoadingPromise) {
    totalsLoadingPromise = storage.loadJSON(TOTALS_REDIS_KEY, TOTALS_DB_PATH).then((data) => {
      const base = emptyTotals();
      cachedTotals = {
        ...base,
        ...data,
        perMember: (data && data.perMember) || {},
      };
      return cachedTotals;
    });
  }
  return totalsLoadingPromise;
}

async function saveTotals(totals) {
  cachedTotals = totals;
  await storage.saveJSON(TOTALS_REDIS_KEY, TOTALS_DB_PATH, totals);
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// Computes the tax/share breakdown for a loot value + participant count.
// When taxed, 5% off the top goes to the guild and the remainder splits
// evenly; when not, the whole value splits evenly and "tax" is just
// whatever sub-silver rounding remainder is left over (see below) — the
// guild isn't actually taking a cut, it's just where the odd fraction of a
// cent has to land. Both figures are rounded to 2 decimals, and any
// leftover fraction from rounding down the share is folded back into the
// tax figure — so taxAmount + (shareAmount * participantCount) always
// exactly equals lootValue, to the cent, with nothing silently lost.
function computeSplit(lootValue, participantCount, taxed = true) {
  const value = Number(lootValue);
  const rate = taxed ? TAX_RATE : 0;
  const rawTax = value * rate;
  const rawRemaining = value - rawTax;
  const shareAmount = round2(rawRemaining / participantCount);
  const distributedTotal = round2(shareAmount * participantCount);
  const taxAmount = round2(value - distributedTotal);
  return { taxAmount, shareAmount, distributedTotal };
}

function newId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Builds an (unsaved, unposted) split record. Caller posts the Discord
// message next (see loot-render.postSplit), fills in messageId/threadId/
// channelId, then calls saveNewSplit() to persist it.
function createSplit({ lootName, lootLocation, lootValue, participants, createdBy, guildId, taxed }) {
  const name = String(lootName || '').trim();
  if (!name) return { error: 'loot_name_required' };

  const value = Number(lootValue);
  if (!Number.isFinite(value) || value <= 0) return { error: 'invalid_value' };

  const cleanParticipants = Array.isArray(participants)
    ? participants
        .filter((p) => p && p.userId)
        .filter((p, idx, arr) => arr.findIndex((q) => q.userId === p.userId) === idx) // dedupe
    : [];
  if (cleanParticipants.length === 0) return { error: 'no_participants' };

  // Taxed by default — only skips the guild cut if explicitly told not to.
  const isTaxed = taxed !== false;
  const { taxAmount, shareAmount, distributedTotal } = computeSplit(value, cleanParticipants.length, isTaxed);

  const split = {
    id: newId(),
    messageId: null,
    threadId: null,
    channelId: null,
    guildId: guildId || null,
    lootName: name,
    lootLocation: lootLocation ? String(lootLocation).trim() : null,
    lootValue: value,
    taxed: isTaxed,
    taxAmount,
    shareAmount,
    distributedTotal,
    participants: cleanParticipants.map((p) => ({
      userId: p.userId,
      username: p.username || null,
      claimed: false,
      claimedAt: null,
      donated: false,
      donatedAt: null,
    })),
    createdBy: createdBy ? { id: createdBy.id, username: createdBy.username } : null,
    createdAt: Date.now(),
    lastReminderAt: null,
    closed: false, // true once every participant has claimed or donated
  };
  return { split };
}

// Persists a freshly-posted split and folds it into the all-time totals.
// Totals update here, once, at creation — the tax and shares are owed the
// moment the split is declared, not whenever people get around to
// claiming/donating. Every participant's share starts out counted as
// "kept by the member" (totalMemberShare / perMember.totalReceived); a
// later donation (see recordDonation) moves their portion over to
// totalDonated instead.
async function saveNewSplit(split) {
  const entries = await loadSplits();
  entries.unshift(split);
  if (entries.length > MAX_SPLITS) entries.length = MAX_SPLITS;
  await saveSplits(entries);

  const totals = await loadTotals();
  totals.totalLootValue = round2(totals.totalLootValue + split.lootValue);
  totals.totalGuildTax = round2(totals.totalGuildTax + split.taxAmount);
  totals.totalMemberShare = round2(totals.totalMemberShare + split.distributedTotal);
  totals.splitCount += 1;
  for (const p of split.participants) {
    if (!totals.perMember[p.userId]) {
      totals.perMember[p.userId] = { username: p.username || p.userId, totalReceived: 0, splitsParticipated: 0 };
    }
    const rec = totals.perMember[p.userId];
    if (p.username) rec.username = p.username; // keep the freshest known name
    rec.totalReceived = round2(rec.totalReceived + split.shareAmount);
    rec.splitsParticipated += 1;
  }
  await saveTotals(totals);
}

async function findSplit(id) {
  const entries = await loadSplits();
  return entries.find((s) => s.id === id) || null;
}

async function findSplitByMessageId(messageId) {
  const entries = await loadSplits();
  return entries.find((s) => s.messageId === messageId) || null;
}

async function persistSplit(split) {
  const entries = await loadSplits();
  const idx = entries.findIndex((s) => s.id === split.id);
  if (idx !== -1) entries[idx] = split;
  await saveSplits(entries);
}

// Removes a split entirely and un-does its contribution to the all-time
// totals — so a deleted test split leaves no trace, same as if it had
// never been posted. Handles both cases per participant: a share that was
// still "kept by the member" (pending or claimed) gets subtracted back out
// of totalMemberShare/perMember.totalReceived; a share that had already
// been donated gets subtracted out of totalDonated instead, since it was
// already moved out of totalMemberShare when the donation happened.
async function deleteSplit(id) {
  const entries = await loadSplits();
  const idx = entries.findIndex((s) => s.id === id);
  if (idx === -1) return { error: 'not_found' };
  const [split] = entries.splice(idx, 1);
  await saveSplits(entries);

  const totals = await loadTotals();
  totals.totalLootValue = round2(totals.totalLootValue - split.lootValue);
  totals.totalGuildTax = round2(totals.totalGuildTax - split.taxAmount);
  totals.splitCount = Math.max(0, totals.splitCount - 1);

  for (const p of split.participants) {
    if (p.donated) {
      totals.totalDonated = round2((totals.totalDonated || 0) - split.shareAmount);
    } else {
      totals.totalMemberShare = round2(totals.totalMemberShare - split.shareAmount);
      const rec = totals.perMember[p.userId];
      if (rec) rec.totalReceived = round2(rec.totalReceived - split.shareAmount);
    }
    const rec = totals.perMember[p.userId];
    if (rec) {
      rec.splitsParticipated = Math.max(0, rec.splitsParticipated - 1);
      if (rec.splitsParticipated === 0) delete totals.perMember[p.userId];
    }
  }
  await saveTotals(totals);

  return { split };
}

// Participants who haven't been resolved yet either way — still eligible
// for reminders, still eligible to be auto-donated after a week.
function unclaimedParticipants(split) {
  return split.participants.filter((p) => !p.claimed && !p.donated);
}

// Marks a participant as having claimed their share personally.
//  - {error:'not_participant'} if the clicker wasn't one of the chosen
//    participants (so it's a no-op, not an error shown to them).
//  - {error:'already_donated'} if they already gave this share away —
//    claiming and donating are mutually exclusive and final.
//  - {ok:true, alreadyClaimed:true} if they'd already checked off.
//  - {ok:true, alreadyClaimed:false, allResolved} otherwise.
function markClaimed(split, userId) {
  const p = split.participants.find((x) => x.userId === userId);
  if (!p) return { error: 'not_participant' };
  if (p.donated) return { error: 'already_donated' };
  if (p.claimed) return { ok: true, alreadyClaimed: true, allResolved: unclaimedParticipants(split).length === 0 };
  p.claimed = true;
  p.claimedAt = Date.now();
  const allResolved = unclaimedParticipants(split).length === 0;
  if (allResolved) split.closed = true;
  return { ok: true, alreadyClaimed: false, allResolved };
}

// Marks a participant's share as donated, WITHOUT touching totals or
// persistence — call donateShare() below instead unless you're composing
// something custom (the auto-expiry sweep uses this directly so it can
// batch the persistSplit() call across several participants at once).
function markDonatedOnly(split, userId) {
  const p = split.participants.find((x) => x.userId === userId);
  if (!p) return { error: 'not_participant' };
  if (p.claimed) return { error: 'already_claimed' };
  if (p.donated) return { ok: true, alreadyDonated: true, allResolved: unclaimedParticipants(split).length === 0 };
  p.donated = true;
  p.donatedAt = Date.now();
  const allResolved = unclaimedParticipants(split).length === 0;
  if (allResolved) split.closed = true;
  return { ok: true, alreadyDonated: false, allResolved };
}

// Folds one freshly-donated share out of totalMemberShare/perMember and
// into totalDonated. Only call this once per donation (guarded by callers
// checking alreadyDonated first).
async function recordDonation(userId, shareAmount) {
  const totals = await loadTotals();
  totals.totalMemberShare = round2(totals.totalMemberShare - shareAmount);
  totals.totalDonated = round2((totals.totalDonated || 0) + shareAmount);
  const rec = totals.perMember[userId];
  if (rec) rec.totalReceived = round2(rec.totalReceived - shareAmount);
  await saveTotals(totals);
}

// High-level "someone's share goes to the guild instead" action — marks,
// persists the split, and updates totals in one call. Used by the Discord
// donate button, the site (if ever wired up), and the auto-expiry sweep.
async function donateShare(split, userId) {
  const result = markDonatedOnly(split, userId);
  if (result.error) return result;
  await persistSplit(split);
  if (!result.alreadyDonated) {
    await recordDonation(userId, split.shareAmount);
  }
  return result;
}

async function listRecent(limit = 100) {
  const entries = await loadSplits();
  return entries.slice(0, limit);
}

async function listOpen() {
  const entries = await loadSplits();
  return entries.filter((s) => !s.closed);
}

async function getTotals() {
  return loadTotals();
}

async function leaderboard(limit = 20) {
  const totals = await loadTotals();
  return Object.entries(totals.perMember)
    .map(([userId, rec]) => ({ userId, ...rec }))
    .sort((a, b) => b.totalReceived - a.totalReceived)
    .slice(0, limit);
}

module.exports = {
  TAX_RATE,
  MAX_SPLITS,
  AUTO_DONATE_AFTER_MS,
  computeSplit,
  createSplit,
  saveNewSplit,
  findSplit,
  findSplitByMessageId,
  persistSplit,
  deleteSplit,
  unclaimedParticipants,
  markClaimed,
  markDonatedOnly,
  recordDonation,
  donateShare,
  listRecent,
  listOpen,
  getTotals,
  leaderboard,
};
