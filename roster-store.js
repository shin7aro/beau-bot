// roster-store.js
// Stores the guild's roster hierarchy (GM / Right Hand / Officer / Member)
// and each member's active/inactive status, keyed by Discord user id. This
// is a thin layer on top of the live Discord "Dahalo" role member list
// (see api.js's fetchDahaloMembersRaw) — Discord stays the source of truth
// for "who's in the guild", this store only decides "where do they sit in
// the tree" and "should they still show up anywhere on the site". Keying
// by id (not username/nickname) means the assignment survives nickname
// changes. Same shared-Redis pattern as the other *-store.js modules.

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'roster.json'); // local fallback path only
const REDIS_KEY = 'roster_positions';

const TIERS = ['gm', 'right_hand', 'officer', 'member'];
const DEFAULT_ENTRY = { tier: 'member', order: 0, inactive: false };

async function loadPositions() {
  const data = await storage.loadJSON(REDIS_KEY, DB_PATH);
  return data && typeof data.positions === 'object' && data.positions ? data.positions : {};
}

async function savePositions(positions) {
  await storage.saveJSON(REDIS_KEY, DB_PATH, { positions });
}

// Always returns a complete { tier, order, inactive } object, defaulting
// anyone never touched by a roster manager to a plain, active "member".
function getEntry(positions, userId) {
  return { ...DEFAULT_ENTRY, ...(positions[userId] || {}) };
}

// Applies a partial update ({ tier?, inactive? }) to one member's entry.
// Promoting someone into "gm" or "right_hand" automatically bumps whoever
// previously held that seat down to "officer" — there's only ever one of
// each, so the tree can't end up with two roots.
async function setEntry(userId, patch) {
  const positions = await loadPositions();
  const current = getEntry(positions, userId);
  const next = { ...current, ...patch };

  if (patch.tier && (patch.tier === 'gm' || patch.tier === 'right_hand')) {
    for (const [id, entry] of Object.entries(positions)) {
      if (id !== userId && entry.tier === patch.tier) {
        positions[id] = { ...getEntry(positions, id), tier: 'officer' };
      }
    }
  }

  positions[userId] = next;
  await savePositions(positions);
  return next;
}

// Reassigns the manual ordering within one tier in one shot — `orderedIds`
// is the tier's member ids in the exact order they should appear, and each
// gets `order` set to its index. Used by the "move up/down" controls on
// the hierarchy editor, which always resend the whole tier's order rather
// than nudging a single delta (simpler, and self-correcting if anything
// ever drifts).
async function setTierOrder(tier, orderedIds) {
  const positions = await loadPositions();
  orderedIds.forEach((id, i) => {
    positions[id] = { ...getEntry(positions, id), tier, order: i };
  });
  await savePositions(positions);
}

module.exports = {
  TIERS,
  DEFAULT_ENTRY,
  loadPositions,
  savePositions,
  getEntry,
  setEntry,
  setTierOrder,
};
