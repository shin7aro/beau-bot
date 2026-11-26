// user-prefs-store.js
// Small per-member preferences, keyed by Discord user ID. Same shared-Redis
// pattern as the other *-store.js modules. Currently one preference:
//
//   buildPing (boolean, default TRUE) — whether Beau pings this member in an
//   event's thread with their role's build card after they pick a role.
//   Experienced players can switch it off from the profile dropdown on the
//   site. A member with no saved entry is treated as "on".

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'user-prefs.json'); // local fallback path only
const REDIS_KEY = 'user_prefs';

const DEFAULTS = { buildPing: true };

async function loadAllPrefs() {
  const data = await storage.loadJSON(REDIS_KEY, DB_PATH);
  return data && typeof data === 'object' ? data : {};
}

function resolve(all, userId) {
  return { ...DEFAULTS, ...((all && all[userId]) || {}) };
}

async function getPrefs(userId) {
  return resolve(await loadAllPrefs(), userId);
}

async function setPrefs(userId, patch) {
  const all = await loadAllPrefs();
  const next = { ...resolve(all, userId) };
  if (typeof patch.buildPing === 'boolean') next.buildPing = patch.buildPing;
  all[userId] = next;
  await storage.saveJSON(REDIS_KEY, DB_PATH, all);
  return next;
}

module.exports = { loadAllPrefs, getPrefs, setPrefs, resolve, DEFAULTS };
