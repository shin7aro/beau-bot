// weapon-emoji-store.js
// Persistent weapon-name -> Discord emoji tag map, e.g.
//   { "Broadsword": "<:broadsword:123456789012345678>", ... }
//
// Populated once, by hand, on the (Shin7aro-only) "Emoji Linking" admin
// page (public/emoji-linking.html) — see api.js's /api/weapon-emojis
// routes — so nobody has to pick an emoji per comp line in the comp
// editor ever again; the editor just looks a weapon's name up in this map
// the moment it's chosen. Same shared-Redis pattern as home-store.js /
// builds-store.js, with the same local-JSON-file fallback for local dev.
//
// Not every one of the 136 weapons needs an entry immediately — a missing
// key just means that weapon's comp lines save with no emoji, exactly like
// before this page existed. Nothing else in the data model changes: this
// only decides what value gets written into a line's existing `emoji`
// field, it isn't a new field itself.

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'weapon-emojis.json'); // local fallback path only
const REDIS_KEY = 'weapon_emojis';

async function loadWeaponEmojis() {
  return storage.loadJSON(REDIS_KEY, DB_PATH);
}

async function saveWeaponEmojis(map) {
  await storage.saveJSON(REDIS_KEY, DB_PATH, map);
  return map;
}

// Sets (or, with a falsy emojiTag, clears) a single weapon's linked emoji
// without clobbering the rest of the map — this is what each click on the
// Emoji Linking page calls, so one save can't race/undo another.
async function setWeaponEmoji(weaponName, emojiTag) {
  const map = await loadWeaponEmojis();
  if (emojiTag) map[weaponName] = emojiTag;
  else delete map[weaponName];
  await storage.saveJSON(REDIS_KEY, DB_PATH, map);
  return map;
}

module.exports = { loadWeaponEmojis, saveWeaponEmojis, setWeaponEmoji };
