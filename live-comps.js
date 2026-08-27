// live-comps.js
// Fetches build/composition data straight from the "Rise of Dahalo" war ledger
// (https://shin7aro.github.io/Rise-of-Dahalo) so the bot never needs builds typed
// in twice. The site is a single-file HTML app with the data stored as plain JS
// literals (const BUILDS = [...], const ITEM_MAP = {...}), so we fetch the raw
// source from GitHub and pull the arrays/object straight out of it.

const RAW_URL = 'https://raw.githubusercontent.com/shin7aro/Rise-of-Dahalo/main/index.html';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes - avoids hammering GitHub on every /event create

let cache = { data: null, fetchedAt: 0 };

// Maps our Discord activity types to the variable names used on the site.
const TYPE_TO_VAR = {
  CTA: 'BUILDS', // matches the "Brawl" tab, which is what your ZvZ example used
  Tracking: 'BUILDS_TRACKING',
  'Group Dungeon': 'BUILDS_GROUP_DUNGEON', // not published yet as of writing - will just be empty until added
  'Ava Dungeon': 'BUILDS_AVA',
};

// Activity types that use a fixed role quota instead of "one slot per weapon".
const QUOTAS = {
  Tracking: { Tank: 1, Healer: 1, DPS: 3 },
  'Group Dungeon': { Tank: 1, Healer: 1, DPS: 3 },
};

// If a type has no data yet, borrow from this type's pool as a stand-in
// (clearly flagged to the organizer when this happens).
const FALLBACK_POOL = {
  'Group Dungeon': 'Tracking',
};

function extractArrayLiteral(html, varName) {
  const re = new RegExp(`const ${varName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`);
  const match = html.match(re);
  if (!match) return null;
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return ${match[1]};`)();
  } catch (e) {
    console.error(`live-comps: failed to parse ${varName}`, e);
    return null;
  }
}

function extractObjectLiteral(html, varName) {
  const re = new RegExp(`const ${varName}\\s*=\\s*(\\{[\\s\\S]*?\\});`);
  const match = html.match(re);
  if (!match) return null;
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return ${match[1]};`)();
  } catch (e) {
    console.error(`live-comps: failed to parse ${varName}`, e);
    return null;
  }
}

async function fetchCompsData(force = false) {
  if (!force && cache.data && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const res = await fetch(RAW_URL);
  if (!res.ok) throw new Error(`Failed to fetch war ledger page: HTTP ${res.status}`);
  const html = await res.text();

  const itemMap = extractObjectLiteral(html, 'ITEM_MAP') || {};
  const pools = {};
  for (const [type, varName] of Object.entries(TYPE_TO_VAR)) {
    pools[type] = extractArrayLiteral(html, varName) || [];
  }

  const data = { itemMap, pools };
  cache = { data, fetchedAt: Date.now() };
  return data;
}

// ---------- weapon -> emoji, based on the Albion item ID naming convention ----------
const WEAPON_EMOJI_RULES = [
  [/HALBERD|GLAIVE|HARPOON|TRIDENT|SPEAR|SCYTHE/, '🔱'],
  [/DUALAXE|_AXE_|_AXE$|POLEAXE/, '🪓'],
  [/DUALMACE|_MACE|HAMMER|ROCKMACE/, '🔨'],
  [/CLEAVER|SWORD|CLAYMORE/, '⚔️'],
  [/DAGGER|CLAWPAIR|_CLAW/, '🔪'],
  [/KNUCKLES/, '🥊'],
  [/DUALCROSSBOW|CROSSBOW/, '🎯'],
  [/LONGBOW|_BOW_|_BOW$/, '🏹'],
  [/QUARTERSTAFF/, '🥋'],
  [/NATURESTAFF|SHAPESHIFTER/, '🌿'],
  [/HOLYSTAFF/, '✨'],
  [/ENIGMATICSTAFF|ENIGMATICORB|ARCANESTAFF/, '🔮'],
  [/FIRESTAFF|INFERNOSTAFF/, '🔥'],
  [/FROSTSTAFF|ICECRYSTAL/, '❄️'],
  [/CURSEDSTAFF/, '💀'],
];

function weaponEmoji(weaponName, itemMap) {
  const id = itemMap ? itemMap[weaponName] : null;
  if (!id) return '🔹';
  for (const [pattern, emoji] of WEAPON_EMOJI_RULES) {
    if (pattern.test(id)) return emoji;
  }
  return '🔹';
}

// ---------- turn a raw build pool into Discord-ready categories ----------
// Returns null if there's no usable data for this type (caller should fall
// back to the manual composition form).
function buildLiveCategories(type, compsData) {
  const roleKeyMap = { tank: 'Tank', dps: 'DPS', healer: 'Healer', support: 'Support' };

  let pool = compsData.pools[type];
  let usedFallbackFrom = null;

  if ((!pool || pool.length === 0) && FALLBACK_POOL[type]) {
    const fallbackType = FALLBACK_POOL[type];
    pool = compsData.pools[fallbackType];
    usedFallbackFrom = fallbackType;
  }

  if (!pool || pool.length === 0) return null;

  const grouped = {};
  for (const entry of pool) {
    const cat = roleKeyMap[entry.role];
    if (!cat) continue;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(entry);
  }
  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => (a.prio || 0) - (b.prio || 0));
  }

  const quotas = QUOTAS[type];
  const categories = {};

  for (const cat of Object.keys(grouped)) {
    if (quotas && !quotas[cat]) continue; // e.g. Tracking/Group Dungeon skip Support entirely

    if (quotas) {
      // de-duplicate weapon names (the same weapon can appear more than once
      // with a different offhand/tier) while keeping the best-tier order
      const seen = new Set();
      const weaponOptions = [];
      for (const entry of grouped[cat]) {
        if (!seen.has(entry.weapon)) {
          seen.add(entry.weapon);
          weaponOptions.push(entry.weapon);
        }
      }
      categories[cat] = {
        mode: 'quota',
        capacity: quotas[cat],
        weaponOptions,
        signups: [], // { userId, weapon }
      };
    } else {
      // merge duplicate weapon names (e.g. the same weapon listed twice with a
      // different offhand/loadout) into one item with a combined slot count,
      // so the sign-up list reads like "Hallowfall (0/2)" instead of two
      // identical-looking rows.
      const merged = [];
      const indexByName = new Map();
      for (const e of grouped[cat]) {
        if (indexByName.has(e.weapon)) {
          merged[indexByName.get(e.weapon)].slots += 1;
        } else {
          indexByName.set(e.weapon, merged.length);
          merged.push({ name: e.weapon, slots: 1, signups: [] });
        }
      }
      categories[cat] = { mode: 'items', items: merged };
    }
  }

  return { categories, usedFallbackFrom };
}

module.exports = { fetchCompsData, buildLiveCategories, weaponEmoji, TYPE_TO_VAR };
