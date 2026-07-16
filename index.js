require('./deploy-commands.js');
// comps.js
// Storage + helpers for reusable team compositions, created with /comp create
// and edited with /comp edit. This replaces the old live-website build pull —
// the site is still useful for looking up exact builds/icons, so a link to it
// gets attached to any event that was posted from a saved comp.

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'comps.json');
const BUILDS_LINK = 'https://shin7aro.github.io/Rise-of-Dahalo';

// Keep this in sync with CATEGORY_ORDER in index.js.
const CATEGORY_ORDER = ['Tank', 'DPS', 'Healer', 'Support', 'Battlemount'];

function loadComps() {
  if (!fs.existsSync(DB_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveComps(comps) {
  fs.writeFileSync(DB_PATH, JSON.stringify(comps, null, 2));
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
function parseComposition(raw, guild) {
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

    // Expand "Name: N" into N separate one-slot lines, so duplicates never
    // need a merged counter — the display just repeats the row.
    for (let i = 0; i < count; i++) {
      grouped[current].push({ name, emoji, signups: [] });
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
  const lines = [];
  for (const cat of CATEGORY_ORDER) {
    const catData = categories[cat];
    if (!catData || !catData.items || catData.items.length === 0) continue;
    lines.push(cat);

    let i = 0;
    while (i < catData.items.length) {
      const item = catData.items[i];
      let count = 1;
      while (
        i + count < catData.items.length &&
        catData.items[i + count].name === item.name &&
        catData.items[i + count].emoji === item.emoji
      ) {
        count++;
      }
      const prefix = item.emoji ? `${item.emoji} ` : '';
      lines.push(count > 1 ? `${prefix}${item.name}: ${count}` : `${prefix}${item.name}`);
      i += count;
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

// Expands every category in CATEGORY_ORDER into one flat, continuously
// numbered list (Tank's last row number + 1 becomes DPS's first, etc.),
// instead of each category restarting at 1. Each row carries its `category`
// so the caller can still look up the right role emoji/color per row.
function expandAllCategoryRows(categories, categoryOrder = CATEGORY_ORDER) {
  const allRows = [];
  let counter = 0;
  for (const cat of categoryOrder) {
    const catData = categories[cat];
    if (!catData) continue;
    const rows = expandCategoryRows(catData, counter + 1);
    for (const row of rows) allRows.push({ ...row, category: cat });
    counter += rows.length;
  }
  return allRows;
}

function createComp({ label, compositionRaw, userId, guild }) {
  const categories = parseComposition(compositionRaw, guild);
  if (Object.keys(categories).length === 0) return null;

  const comps = loadComps();
  const key = keyFor(label);
  comps[key] = {
    label: label.trim(),
    categories,
    createdBy: userId,
    updatedBy: userId,
    updatedAt: Date.now(),
  };
  saveComps(comps);
  return comps[key];
}

// newLabel may be the same as the old one (rename support is just "free" here).
function updateComp({ key, newLabel, compositionRaw, userId, guild }) {
  const categories = parseComposition(compositionRaw, guild);
  if (Object.keys(categories).length === 0) return null;

  const comps = loadComps();
  const existing = comps[key];
  if (!existing) return null;

  const newKey = keyFor(newLabel);
  delete comps[key];
  comps[newKey] = {
    label: newLabel.trim(),
    categories,
    createdBy: existing.createdBy,
    updatedBy: userId,
    updatedAt: Date.now(),
  };
  saveComps(comps);
  return comps[newKey];
}

function deleteComp(key) {
  const comps = loadComps();
  if (!comps[key]) return false;
  delete comps[key];
  saveComps(comps);
  return true;
}

// Deep clone so multiple events built from the same saved comp don't end up
// sharing (and corrupting) the same signups arrays.
function cloneCategories(categories) {
  return JSON.parse(JSON.stringify(categories));
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
};
