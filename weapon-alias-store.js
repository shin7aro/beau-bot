// weapon-alias-store.js
// Persistent weapon-name -> short custom display-name map, e.g.
//   { "Great Arcane Staff": "GA", ... }
//
// Populated by hand, on the same (Shin7aro-only) "Emoji Linking" admin
// page (public/emoji-linking.html) that maintains weapon-emoji-store.js —
// see api.js's /api/weapon-aliases routes — because guild members often
// call a weapon something shorter/different than its official in-game
// name ("GA" for "Great Arcane Staff"). The comp editor and event pages
// read this map to display that short name wherever the weapon's name
// would otherwise show up. Same shared-Redis pattern as
// weapon-emoji-store.js, with the same local-JSON-file fallback for local
// dev.
//
// A missing key just means that weapon displays under its official name,
// exactly like before this existed. This never touches ITEM_MAP: icon
// lookups and all stored comp/event data still key off the official
// name — this only decides what text renders for it.

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'weapon-aliases.json'); // local fallback path only
const REDIS_KEY = 'weapon_aliases';

async function loadWeaponAliases() {
  return storage.loadJSON(REDIS_KEY, DB_PATH);
}

async function saveWeaponAliases(map) {
  await storage.saveJSON(REDIS_KEY, DB_PATH, map);
  return map;
}

// ---------- in-memory cache for the Discord bot's synchronous embed
// builders ----------
// event-render.js's buildEmbed() and index.js's /comp view (and a handful
// of other reply messages) are called synchronously from ~25 places across
// index.js/api.js — making all of those async just to resolve an alias
// wasn't worth the blast radius. Instead we keep a plain in-memory copy of
// the map, warmed once at require time and kept fresh by setWeaponAlias
// below (every website rename updates it immediately) — good enough since
// this only ever changes from the one Shin7aro-only admin page.
let cachedAliases = {};

async function refreshCache() {
  cachedAliases = await loadWeaponAliases();
  return cachedAliases;
}

// Best-effort initial load so the cache is warm by the time the bot starts
// handling interactions. If this fails (e.g. Redis briefly unreachable at
// boot), cachedAliases just stays {} — weapons display under their
// official name, same as if this feature didn't exist — until the next
// successful setWeaponAlias call refreshes it.
refreshCache().catch((e) => console.error('weapon-alias-store: initial cache load failed', e));

function weaponDisplayName(name) {
  return cachedAliases[name] || name;
}

// Sets (or, with a falsy alias, clears) a single weapon's custom display
// name without clobbering the rest of the map — same one-key-at-a-time
// shape as weapon-emoji-store.js's setWeaponEmoji, for the same reason.
async function setWeaponAlias(weaponName, alias) {
  const map = await loadWeaponAliases();
  if (alias) map[weaponName] = alias;
  else delete map[weaponName];
  await storage.saveJSON(REDIS_KEY, DB_PATH, map);
  cachedAliases = map; // keep the sync cache above in lockstep with the write
  return map;
}

module.exports = { loadWeaponAliases, saveWeaponAliases, setWeaponAlias, refreshCache, weaponDisplayName };
