// comps.js
// Storage + helpers for reusable team compositions, created with /comp create
// and edited with /comp edit. This replaces the old live-website build pull —
// the site is still useful for looking up exact builds/icons, so a link to it
// gets attached to any event that was posted from a saved comp.

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'comps.json'); // local fallback path only
const REDIS_KEY = 'comps';
const BUILDS_LINK = 'https://shin7aro.github.io/Rise-of-Dahalo';

// Keep this in sync with CATEGORY_ORDER in index.js.
const CATEGORY_ORDER = ['Tank', 'Support', 'DPS', 'Healer', 'Battlemount'];

async function loadComps() {
  return storage.loadJSON(REDIS_KEY, DB_PATH);
}

async function saveComps(comps) {
  await storage.saveJSON(REDIS_KEY, DB_PATH, comps);
}

function keyFor(label) {
  return label.trim().toLowerCase();
}

// An optional leading emoji on an item line — a custom Discord emoji tag
// (<:name:id> / <a:name:id>), a typed-out ":name:" shortcode, or a single
// unicode emoji character.
const EMOJI_PREFIX_RE = /^(<a?:\w+:\d+>|:\w+:|\p{Extended_Pictographic}\uFE0F?)\s+(.*)$/u;

// Resolves a raw emoji token from the start of an item line into something
// Discord will actually render:
//  - a full custom emoji tag is used as-is
//  - a plain unicode emoji character is used as-is
//  - a typed ":name:" shortcode gets looked up by name against the server's
//    own custom emoji list — Discord's modal text fields don't auto-convert
//    shortcodes into real emoji the way the normal chat box does, so without
//    this the literal text ":name:" would otherwise get treated as part of
//    the item name. If no match is found, it's dropped (falls back to the
//    default icon) rather than leaking ":name:" into the display.
function resolveEmojiToken(token, guild) {
  if (!token) return null;
  if (/^<a?:\w+:\d+>$/.test(token)) return token;

  const shortcode = token.match(/^:(\w+):$/);
  if (shortcode) {
    if (!guild) return null;
    const name = shortcode[1].toLowerCase();
    try {
      const found = guild.emojis.cache.find((e) => e.name && e.name.toLowerCase() === name);
      return found ? found.toString() : null;
    } catch {
      return null;
    }
  }

  return token;
}

// Parses the "Tank / DPS / Healer / Support / Battlemount" text format used by
// both the /comp create and /comp edit modals:
//   Tank
//   🛡️ 1H Mace
//   🔨 Polehammer
//   DPS
//   ⚔️ Carving Sword
//   ⚔️ Carving Sword
// A weapon can appear on more than one line on purpose — each line is its own
// slot, so two identical lines just means two open slots for that weapon,
// no "(1/2)" counter needed. "Name: N" still works as shorthand for N
// duplicate lines.
// A "Party N" line marks the start of a new 20-player party. Composition text
// with no Party headers at all is treated as one single implicit party (fully
// backward compatible with comps saved before this feature existed).
const PARTY_HEADER_RE = /^party\b/i;

function parseComposition(raw, guild) {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const grouped = {};
  let current = null;
  let partyIndex = -1; // -1 = no Party header seen yet; items default to party 0

  for (const line of lines) {
    if (PARTY_HEADER_RE.test(line)) {
      partyIndex += 1;
      current = null;
      continue;
    }

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

    let emoji = null;
    let rest = line;
    const emojiMatch = line.match(EMOJI_PREFIX_RE);
    if (emojiMatch) {
      emoji = resolveEmojiToken(emojiMatch[1], guild);
      rest = emojiMatch[2].trim();
    }

    const match = rest.match(/^(.*?)[\s]*[:\-][\s]*(\d+)\s*$/);
    let name = rest;
    let count = 1;
    if (match) {
      name = match[1].trim();
      count = Math.max(1, parseInt(match[2], 10));
    }
    if (!name) continue;

    const party = partyIndex === -1 ? 0 : partyIndex;

    // Expand "Name: N" into N separate one-slot lines, so duplicates never
    // need a merged counter — the display just repeats the row.
    for (let i = 0; i < count; i++) {
      grouped[current].push({ name, emoji, party, signups: [], buildId: null, buildTab: null });
    }
  }

  const categories = {};
  for (const cat of Object.keys(grouped)) {
    categories[cat] = { mode: 'items', items: grouped[cat] };
  }
  return categories;
}

// Inverse of parseComposition — turns stored categories back into editable
// text, used to prefill the /comp edit modal. Collapses consecutive
// duplicate (name + emoji) rows back into the "Name: N" shorthand.
function stringifyComposition(categories) {
  let maxParty = 0;
  for (const cat of CATEGORY_ORDER) {
    const catData = categories[cat];
    if (!catData || !catData.items) continue;
    for (const item of catData.items) maxParty = Math.max(maxParty, item.party || 0);
  }

  const lines = [];
  for (let p = 0; p <= maxParty; p++) {
    if (maxParty > 0) lines.push(`Party ${p + 1}`);

    for (const cat of CATEGORY_ORDER) {
      const catData = categories[cat];
      if (!catData || !catData.items) continue;
      const itemsInParty = catData.items.filter((it) => (it.party || 0) === p);
      if (itemsInParty.length === 0) continue;
      lines.push(cat);

      let i = 0;
      while (i < itemsInParty.length) {
        const item = itemsInParty[i];
        let count = 1;
        while (
          i + count < itemsInParty.length &&
          itemsInParty[i + count].name === item.name &&
          itemsInParty[i + count].emoji === item.emoji
        ) {
          count++;
        }
        const prefix = item.emoji ? `${item.emoji} ` : '';
        lines.push(count > 1 ? `${prefix}${item.name}: ${count}` : `${prefix}${item.name}`);
        i += count;
      }
    }
  }
  return lines.join('\n');
}

// Expands stored categories into flat, numbered slot rows for display —
// e.g. row 1 and row 2 for two "Carving Sword" lines, instead of a single
// merged "(1/2)" row. Each row carries its parent item's array index (for
// quota mode, itemIndex is not used) so callers can map a dropdown choice
// back to the exact item unambiguously, even when names repeat.
function expandCategoryRows(catData, startNumber = 1) {
  const rows = [];

  if (catData.mode === 'quota') {
    for (let i = 0; i < catData.capacity; i++) {
      const s = catData.signups[i];
      rows.push({
        rowNumber: startNumber + rows.length,
        name: s ? s.weapon : null,
        emoji: null,
        signedUserId: s ? s.userId : null,
      });
    }
    return rows;
  }

  catData.items.forEach((item, itemIndex) => {
    rows.push({
      rowNumber: startNumber + rows.length,
      itemIndex,
      name: item.name,
      emoji: item.emoji || null,
      signedUserId: item.signups[0] || null,
    });
  });

  return rows;
}

// Fixed party size used only for numbering offsets — Party 2 always starts
// at 21 even if Party 1 only has a handful of slots filled in, matching how
// Albion's own party system reserves 20 slots per party regardless of size.
const PARTY_SIZE = 20;

// Expands every category in CATEGORY_ORDER into one flat list, numbered
// per-party: Party 1 gets rows 1-20, Party 2 gets 21-40, etc. — the offset is
// fixed to the party's position, not to how many rows the previous party
// actually used. Comps with no party structure behave exactly as before
// (everything is "party 0", offset 0).
function expandAllCategoryRows(categories, categoryOrder = CATEGORY_ORDER) {
  let maxParty = 0;
  for (const cat of categoryOrder) {
    const catData = categories[cat];
    if (!catData || catData.mode === 'quota' || !catData.items) continue;
    for (const item of catData.items) maxParty = Math.max(maxParty, item.party || 0);
  }

  const allRows = [];
  for (let p = 0; p <= maxParty; p++) {
    let counter = p * PARTY_SIZE;

    for (const cat of categoryOrder) {
      const catData = categories[cat];
      if (!catData) continue;

      if (catData.mode === 'quota') {
        if (p !== 0) continue; // legacy quota categories only ever occupy party 1
        for (let i = 0; i < catData.capacity; i++) {
          counter++;
          const s = catData.signups[i];
          allRows.push({
            rowNumber: counter,
            party: 0,
            category: cat,
            name: s ? s.weapon : null,
            emoji: null,
            signedUserId: s ? s.userId : null,
          });
        }
        continue;
      }

      catData.items.forEach((item, itemIndex) => {
        if ((item.party || 0) !== p) return;
        counter++;
        allRows.push({
          rowNumber: counter,
          party: p,
          category: cat,
          itemIndex,
          name: item.name,
          emoji: item.emoji || null,
          signedUserId: item.signups[0] || null,
        });
      });
    }
  }
  return allRows;
}

// Re-applies a (possibly edited) saved comp onto an already-posted event's
// categories. Tries to keep every existing sign-up attached to the same
// logical slot — matched by (party, weapon name, emoji) — so a routine edit
// (fixing a typo, swapping one weapon) doesn't bump people who are already
// signed up. Any sign-up that no longer has a matching slot (its weapon/party
// was removed or reduced) is dropped and reported back to the caller so the
// organizer can follow up with that person.
function refreshEventCategories(oldCategories, newCategories) {
  const categories = {};
  const dropped = [];

  for (const cat of CATEGORY_ORDER) {
    const newCatData = newCategories[cat];
    if (!newCatData) continue; // category no longer exists in the comp

    if (newCatData.mode === 'quota') {
      // legacy quota categories aren't affected by refresh; keep as-is
      categories[cat] = JSON.parse(JSON.stringify(newCatData));
      continue;
    }

    const freshItems = newCatData.items.map((item) => ({ ...item, signups: [] }));
    const used = new Array(freshItems.length).fill(false);

    const oldCatData = oldCategories[cat];
    if (oldCatData && oldCatData.mode !== 'quota' && oldCatData.items) {
      for (const oldItem of oldCatData.items) {
        const userId = oldItem.signups && oldItem.signups[0];
        if (!userId) continue;

        const matchIdx = freshItems.findIndex(
          (ni, idx) =>
            !used[idx] &&
            (ni.party || 0) === (oldItem.party || 0) &&
            ni.name === oldItem.name &&
            ni.emoji === oldItem.emoji
        );

        if (matchIdx !== -1) {
          freshItems[matchIdx].signups.push(userId);
          used[matchIdx] = true;
        } else {
          dropped.push({ userId, category: cat, name: oldItem.name, party: oldItem.party || 0 });
        }
      }
    }

    categories[cat] = { mode: 'items', items: freshItems };
  }

  // categories that existed before but were removed entirely from the comp
  for (const cat of Object.keys(oldCategories)) {
    if (categories[cat]) continue;
    const oldCatData = oldCategories[cat];
    if (!oldCatData || oldCatData.mode === 'quota' || !oldCatData.items) continue;
    for (const item of oldCatData.items) {
      const userId = item.signups && item.signups[0];
      if (userId) dropped.push({ userId, category: cat, name: item.name, party: item.party || 0 });
    }
  }

  return { categories, dropped };
}

// A raw-text /comp edit on Discord has no way to express a build link, so
// parseComposition() always comes back with buildId/buildTab set to null.
// Without this, editing a comp's text on Discord would silently wipe out
// every link the site editor had set up. We carry links forward by matching
// old vs new items on (party, name, emoji) — the same identity key used
// elsewhere in this file — same as refreshEventCategories does for signups.
function carryOverBuildLinks(oldCategories, newCategories) {
  for (const cat of Object.keys(newCategories)) {
    const newCatData = newCategories[cat];
    const oldCatData = oldCategories[cat];
    if (!newCatData || !newCatData.items || !oldCatData || !oldCatData.items) continue;

    const used = new Array(oldCatData.items.length).fill(false);
    for (const item of newCatData.items) {
      const matchIdx = oldCatData.items.findIndex(
        (oi, idx) =>
          !used[idx] &&
          (oi.party || 0) === (item.party || 0) &&
          oi.name === item.name &&
          oi.emoji === item.emoji
      );
      if (matchIdx !== -1) {
        item.buildId = oldCatData.items[matchIdx].buildId ?? null;
        item.buildTab = oldCatData.items[matchIdx].buildTab ?? null;
        used[matchIdx] = true;
      }
    }
  }
  return newCategories;
}

async function createComp({ label, compositionRaw, userId, guild }) {
  const categories = parseComposition(compositionRaw, guild);
  if (Object.keys(categories).length === 0) return null;

  const comps = await loadComps();
  const key = keyFor(label);
  comps[key] = {
    label: label.trim(),
    categories,
    createdBy: userId,
    updatedBy: userId,
    updatedAt: Date.now(),
  };
  await saveComps(comps);
  return comps[key];
}

// newLabel may be the same as the old one (rename support is just "free" here).
async function updateComp({ key, newLabel, compositionRaw, userId, guild }) {
  const categories = parseComposition(compositionRaw, guild);
  if (Object.keys(categories).length === 0) return null;

  const comps = await loadComps();
  const existing = comps[key];
  if (!existing) return null;

  carryOverBuildLinks(existing.categories, categories);

  const newKey = keyFor(newLabel);
  delete comps[key];
  comps[newKey] = {
    label: newLabel.trim(),
    categories,
    createdBy: existing.createdBy,
    updatedBy: userId,
    updatedAt: Date.now(),
  };
  await saveComps(comps);
  return comps[newKey];
}

async function deleteComp(key) {
  const comps = await loadComps();
  if (!comps[key]) return false;
  delete comps[key];
  await saveComps(comps);
  return true;
}

// Deep clone so multiple events built from the same saved comp don't end up
// sharing (and corrupting) the same signups arrays.
function cloneCategories(categories) {
  return JSON.parse(JSON.stringify(categories));
}

// ── Structured (site) API ──────────────────────────────────────────────
// The Discord /comp create|edit flow works from a single block of raw text
// (parseComposition/stringifyComposition above). The site's comp editor
// instead sends already-structured categories straight from its form state,
// including each item's buildId/buildTab — so no text round-trip needed.

function normalizeStructuredCategories(categories) {
  const out = {};
  for (const cat of CATEGORY_ORDER) {
    const catData = categories[cat];
    if (!catData || !Array.isArray(catData.items) || catData.items.length === 0) continue;
    out[cat] = {
      mode: 'items',
      items: catData.items.map((it) => ({
        name: String(it.name || '').trim(),
        emoji: it.emoji || null,
        party: Number.isInteger(it.party) ? it.party : 0,
        signups: [],
        buildId: it.buildId ?? null,
        buildTab: it.buildTab ?? null,
      })).filter((it) => it.name),
    };
  }
  return out;
}

async function listComps() {
  const comps = await loadComps();
  return Object.entries(comps).map(([key, c]) => ({ key, ...c }));
}

async function getCompByKey(key) {
  const comps = await loadComps();
  return comps[key] || null;
}

async function createCompStructured({ label, categories, userId }) {
  const clean = normalizeStructuredCategories(categories);
  if (Object.keys(clean).length === 0) return null;

  const comps = await loadComps();
  const key = keyFor(label);
  if (comps[key]) return null; // caller should use update instead

  comps[key] = {
    label: label.trim(),
    categories: clean,
    createdBy: userId,
    updatedBy: userId,
    updatedAt: Date.now(),
  };
  await saveComps(comps);
  return { key, ...comps[key] };
}

async function updateCompStructured({ key, newLabel, categories, userId }) {
  const clean = normalizeStructuredCategories(categories);
  if (Object.keys(clean).length === 0) return null;

  const comps = await loadComps();
  const existing = comps[key];
  if (!existing) return null;

  const newKey = keyFor(newLabel);
  if (newKey !== key && comps[newKey]) return null; // name collision

  delete comps[key];
  comps[newKey] = {
    label: newLabel.trim(),
    categories: clean,
    createdBy: existing.createdBy,
    updatedBy: userId,
    updatedAt: Date.now(),
  };
  await saveComps(comps);
  return { key: newKey, ...comps[newKey] };
}

module.exports = {
  CATEGORY_ORDER,
  BUILDS_LINK,
  loadComps,
  saveComps,
  keyFor,
  parseComposition,
  stringifyComposition,
  createComp,
  updateComp,
  deleteComp,
  cloneCategories,
  expandCategoryRows,
  expandAllCategoryRows,
  refreshEventCategories,
  carryOverBuildLinks,
  listComps,
  getCompByKey,
  createCompStructured,
  updateCompStructured,
};
