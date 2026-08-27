// builds-store.js
// Shared storage for the War Ledger build lists, using the same
// storage.js (Upstash Redis, JSON-blob-per-key) the bot already uses for
// comps/events. Seeded once from builds-seed.json on first read.

const path = require('path');
const fs = require('fs');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'builds.json'); // local fallback path only
const REDIS_KEY = 'builds';
const SEED_PATH = path.join(__dirname, 'builds-seed.json');

const TABS = ['brawl', 'gank', 'kite', 'brawlclap', 'tracking', 'groupdungeon', 'avadungeon'];

function seedData() {
  return JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
}

async function loadAllBuilds() {
  const data = await storage.loadJSON(REDIS_KEY, DB_PATH);
  if (!data || Object.keys(data).length === 0) {
    const seed = seedData();
    await storage.saveJSON(REDIS_KEY, DB_PATH, seed);
    return seed;
  }
  // Make sure any tab added later (e.g. a new content track) is present.
  let changed = false;
  for (const tab of TABS) {
    if (!Array.isArray(data[tab])) { data[tab] = []; changed = true; }
  }
  if (changed) await storage.saveJSON(REDIS_KEY, DB_PATH, data);
  return data;
}

async function saveTab(tab, list) {
  if (!TABS.includes(tab)) throw new Error(`Unknown build tab: ${tab}`);
  const all = await loadAllBuilds();
  all[tab] = list;
  await storage.saveJSON(REDIS_KEY, DB_PATH, all);
  return all[tab];
}

// Flat, cross-tab list used by the comps editor's "link to a build" picker.
async function listAllForLinking() {
  const all = await loadAllBuilds();
  const rows = [];
  for (const tab of TABS) {
    for (let i = 0; i < (all[tab] || []).length; i++) {
      const b = all[tab][i];
      rows.push({ tab, index: i, role: b.role, weapon: b.weapon || 'Unnamed build' });
    }
  }
  return rows;
}

module.exports = { TABS, loadAllBuilds, saveTab, listAllForLinking };
