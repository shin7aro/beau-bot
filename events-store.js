// events-store.js
// Shared event storage + mutation logic, used by BOTH the Discord bot
// (index.js) and the website (api.js) — same pattern as comps.js. Keeping
// this here (instead of duplicating create/edit/sign-up logic on each side)
// means a sign-up, edit, or close made from either the bot or the site is
// always working against the exact same rules and the same data.
//
// This module has no discord.js dependency on purpose — it only touches
// plain data. Anything that needs to actually post/edit a Discord message
// lives in event-render.js instead, which both index.js and api.js also
// share.

const path = require('path');
const storage = require('./storage');
const comps = require('./comps');

const DB_PATH = path.join(__dirname, 'events.json'); // local fallback path only
const REDIS_KEY = 'events';

const CATEGORY_ORDER = comps.CATEGORY_ORDER;

// Event "type" — top-level bucket used to separate PVP activities (CTAs,
// group dungeons, ...), PVE activities (Ava dungeons, HCE, ...), and Gank
// activities (small-scale roams/ganks). This replaces the old fixed
// CTA/Group Dungeon/Tracking/Ava Dungeon/Other list — the specific activity
// now goes in the event's title instead.
//
// Events saved before this change carry one of the old values in `type`
// (including the retired "Economy" type). They keep working exactly as
// before (EVENT_TYPE_EMOJI below just falls back to a generic icon for
// anything it doesn't recognize) — no migration needed, nothing breaks on
// old data.
const EVENT_TYPES = ['PVP', 'PVE', 'Gank'];
const EVENT_TYPE_EMOJI = { PVP: '⚔️', PVE: '🐉', Gank: '🗡️' };

// The bot (index.js) loads events into a long-lived in-memory object ONCE
// at startup and mutates that same object directly for every interaction
// afterward — it never re-reads storage on its own. If loadEvents() here
// just re-fetched from storage on every call (as it used to), an event
// created/edited through the site would land in storage correctly but the
// bot's in-memory object would never find out about it — so a Discord
// member clicking a sign-up button on a site-created event would hit
// `events[eventId] === undefined` and get "This event is no longer open."
//
// The fix: cache the loaded object at the module level. Since Node caches
// modules, index.js and api.js both get the exact same `cachedEvents`
// object reference the first time either of them calls loadEvents() — so
// index.js's `events` variable and every api.js route are mutating the
// literal same object, in the same process, with no re-sync step needed.
// saveEvents() keeps the cache and what's persisted to storage in lockstep.
let cachedEvents = null;
let loadingPromise = null;

async function loadEvents() {
  if (cachedEvents) return cachedEvents;
  if (!loadingPromise) {
    loadingPromise = storage.loadJSON(REDIS_KEY, DB_PATH).then((data) => {
      cachedEvents = data;
      return cachedEvents;
    });
  }
  return loadingPromise;
}

async function saveEvents(events) {
  cachedEvents = events;
  await storage.saveJSON(REDIS_KEY, DB_PATH, events);
}

// ---------- sign-up bookkeeping (unchanged behavior, just relocated) ----------

function removeUserFromEvent(event, userId) {
  for (const cat of Object.values(event.categories)) {
    if (cat.mode === 'quota') {
      cat.signups = cat.signups.filter((s) => s.userId !== userId);
    } else {
      for (const item of cat.items) {
        const idx = item.signups.indexOf(userId);
        if (idx !== -1) {
          item.signups.splice(idx, 1);
          if (item.options) item.signedOptionIndex = null;
        }
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

// Groups open (unsigned) slots by role — used by both the 30-minute auto
// reminder and the manual "Ping" button (site + bot).
function getMissingRolesSummary(event) {
  const rows = comps.expandAllCategoryRows(event.categories, CATEGORY_ORDER);
  const counts = {};
  for (const row of rows) {
    if (row.signedUserId) continue;
    counts[row.category] = (counts[row.category] || 0) + 1;
  }
  return CATEGORY_ORDER.filter((cat) => counts[cat] > 0).map((cat) => ({ category: cat, missing: counts[cat] }));
}

// ---------- creation ----------

function baseMetaFrom({ type, title, time, mass, sets, organizerId, organizerTag, channelId, guildId }) {
  return {
    type,
    title,
    time,
    mass: mass || null, // optional meeting point / portal, shown like the reference tool's "Mass" field
    sets: sets || null, // optional gear reminder, e.g. "1+0", shown like the reference tool's "Sets" field
    organizerId,
    organizerTag,
    channelId,
    guildId,
    closed: false,
    createdAt: Date.now(),
    lastReminderMessageId: null, // so a fresh reminder can delete the previous one first
  };
}

// Builds an (unsaved — no `id` yet) event from a saved comp. Caller is
// responsible for posting/saving it and assigning the real id (matches how
// /event create's comp path already works).
async function createEventFromComp({ compKey, ...meta }) {
  const saved = (await comps.loadComps())[compKey];
  if (!saved) return { error: 'comp_not_found' };
  const event = {
    id: null,
    ...baseMetaFrom(meta),
    categories: comps.cloneCategories(saved.categories),
    compLabel: saved.label,
    compKey,
  };
  return { event };
}

// Builds an (unsaved) event from already-structured categories — used by
// the site's manual builder (same shape comps.js's structured API uses).
function createEventManual({ categories, ...meta }) {
  const clean = normalizeManualCategories(categories);
  if (Object.keys(clean).length === 0) return { error: 'empty_composition' };
  const event = {
    id: null,
    ...baseMetaFrom(meta),
    categories: clean,
    compLabel: null,
    compKey: null,
  };
  return { event };
}

function normalizeManualCategories(categories) {
  const out = {};
  for (const cat of CATEGORY_ORDER) {
    const catData = categories && categories[cat];
    if (!catData || !Array.isArray(catData.items) || catData.items.length === 0) continue;
    out[cat] = {
      mode: 'items',
      items: catData.items
        .map((it) => ({
          name: String((it && it.name) || '').trim(),
          emoji: (it && it.emoji) || null,
          party: Number.isInteger(it && it.party) ? it.party : 0,
          signups: [],
          buildId: (it && it.buildId) ?? null,
          buildTab: (it && it.buildTab) ?? null,
        }))
        .filter((it) => it.name),
    };
  }
  return out;
}

// Builds an (unsaved) event from raw composition text — the exact same
// format (and parser) the Discord "type it manually" modal uses. Lets the
// site's manual path be "paste the same text you'd type in Discord" instead
// of needing its own drag-and-drop category builder.
function createEventFromRawText({ compositionRaw, guild, ...meta }) {
  const categories = comps.parseComposition(compositionRaw, guild);
  if (Object.keys(categories).length === 0) return { error: 'empty_composition' };
  const event = {
    id: null,
    ...baseMetaFrom(meta),
    categories,
    compLabel: null,
    compKey: null,
  };
  return { event };
}

function applyRawTextCategories(event, compositionRaw, guild) {
  const categories = comps.parseComposition(compositionRaw, guild);
  if (Object.keys(categories).length === 0) return { error: 'empty_composition' };
  const { categories: merged, dropped } = comps.refreshEventCategories(event.categories, categories);
  event.categories = merged;
  event.compLabel = null;
  event.compKey = null;
  return { dropped };
}

// ---------- editing ----------

const EDITABLE_META_FIELDS = ['title', 'time', 'type'];
const EDITABLE_OPTIONAL_META_FIELDS = ['mass', 'sets']; // allowed to be cleared with an empty string

function applyMetaEdits(event, patch) {
  for (const field of EDITABLE_META_FIELDS) {
    if (patch[field] !== undefined && patch[field] !== null && String(patch[field]).trim() !== '') {
      event[field] = patch[field];
    }
  }
  for (const field of EDITABLE_OPTIONAL_META_FIELDS) {
    if (patch[field] !== undefined) {
      const v = String(patch[field] || '').trim();
      event[field] = v || null;
    }
  }
  return event;
}

// Replaces an event's roster with a different saved comp's, keeping any
// sign-up whose (party, name, emoji) slot still exists — same matching
// comps.refreshEventCategories already does for /event refresh.
async function relinkComp(event, newCompKey) {
  const saved = (await comps.loadComps())[newCompKey];
  if (!saved) return { error: 'comp_not_found' };
  const { categories, dropped } = comps.refreshEventCategories(event.categories, saved.categories);
  event.categories = categories;
  event.compLabel = saved.label;
  event.compKey = newCompKey;
  return { dropped };
}

// Re-applies the comp an event is already linked to (picks up edits made to
// that comp since the event was posted) — same as /event refresh.
async function refreshFromLinkedComp(event) {
  if (!event.compKey) return { error: 'no_linked_comp' };
  const saved = (await comps.loadComps())[event.compKey];
  if (!saved) return { error: 'comp_not_found' };
  const { categories, dropped } = comps.refreshEventCategories(event.categories, saved.categories);
  event.categories = categories;
  event.compLabel = saved.label;
  return { dropped };
}

// Replaces an event's roster with a freshly-typed manual composition,
// keeping sign-ups the same way relinkComp/refreshFromLinkedComp do. Used
// when editing a manually-built (non-comp) event.
function applyManualCategories(event, categories) {
  const clean = normalizeManualCategories(categories);
  if (Object.keys(clean).length === 0) return { error: 'empty_composition' };
  const { categories: merged, dropped } = comps.refreshEventCategories(event.categories, clean);
  event.categories = merged;
  event.compLabel = null;
  event.compKey = null;
  return { dropped };
}

// ---------- sign up / leave ----------
// signUp() mirrors the exact check-then-remove-then-push order the Discord
// button/select handlers already use, so behavior is identical either way.

function signUp(event, userId, category, choice) {
  const catData = event.categories[category];
  if (!catData) return { error: 'no_category' };

  if (catData.mode === 'quota') {
    if (catData.signups.length >= catData.capacity) return { error: 'full' };
    const weapon = choice && choice.weapon;
    if (!weapon || !catData.weaponOptions.includes(weapon)) return { error: 'invalid_choice' };
    removeUserFromEvent(event, userId);
    catData.signups.push({ userId, weapon });
    return { ok: true, label: weapon };
  }

  const idx = choice && choice.itemIndex;
  const item = catData.items[idx];
  if (!item || item.signups.length >= 1) return { error: 'full' };

  // Multi-choice line — the caller must say which of the item's options
  // they're taking (see comps.js's itemLabel/itemSignature for how these
  // are shaped). Single-choice items ignore optionIndex entirely.
  if (item.options) {
    const optionIndex = choice && Number.isInteger(choice.optionIndex) ? choice.optionIndex : null;
    if (optionIndex === null || !item.options[optionIndex]) return { error: 'invalid_choice' };
    removeUserFromEvent(event, userId);
    item.signups.push(userId);
    item.signedOptionIndex = optionIndex;
    return { ok: true, label: item.options[optionIndex].name };
  }

  removeUserFromEvent(event, userId);
  item.signups.push(userId);
  return { ok: true, label: item.name };
}

// Returns what a caller needs to either sign up directly (one option) or
// present a choice (multiple options) — shared by the Discord button
// handler and the site's "sign up" click. This is about which SLOT
// (row/item) to sign into when more than one is open — a separate concern
// from which WEAPON to take on a multi-choice item, which the caller
// finds out about via row.options and handles as its own follow-up step.
function signUpChoices(event, category) {
  const catData = event.categories[category];
  if (!catData) return { error: 'no_category' };

  if (catData.mode === 'quota') {
    if (catData.signups.length >= catData.capacity) return { error: 'full' };
    if (catData.weaponOptions.length === 1) return { direct: { weapon: catData.weaponOptions[0] } };
    return { options: catData.weaponOptions.map((w) => ({ value: w, label: w })) };
  }

  const availableIndexes = catData.items.map((it, idx) => idx).filter((idx) => catData.items[idx].signups.length === 0);
  if (availableIndexes.length === 0) return { error: 'full' };
  if (availableIndexes.length === 1) return { direct: { itemIndex: availableIndexes[0] } };
  return {
    options: availableIndexes.map((idx) => {
      const item = catData.items[idx];
      return {
        value: String(idx),
        label: comps.itemLabel(item),
        emoji: item.options ? item.options[0].emoji || null : item.emoji || null,
      };
    }),
  };
}

function leave(event, userId) {
  removeUserFromEvent(event, userId);
}

module.exports = {
  DB_PATH,
  REDIS_KEY,
  CATEGORY_ORDER,
  EVENT_TYPES,
  EVENT_TYPE_EMOJI,
  loadEvents,
  saveEvents,
  removeUserFromEvent,
  getSignedUpUserIds,
  getMissingRolesSummary,
  createEventFromComp,
  createEventManual,
  createEventFromRawText,
  normalizeManualCategories,
  applyMetaEdits,
  relinkComp,
  refreshFromLinkedComp,
  applyManualCategories,
  applyRawTextCategories,
  signUp,
  signUpChoices,
  leave,
};
