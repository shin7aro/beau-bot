// builds-store.js
// Shared storage for the War Ledger build lists, using the same
// storage.js (Upstash Redis, JSON-blob-per-key) the bot already uses for
// comps/events. Seeded once from builds-seed.json on first read.

const path = require('path');
const fs = require('fs');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'builds.json'); // local fallback path only
const REDIS_KEY = 'builds';
const CATEGORIES_REDIS_KEY = 'build_categories';
const CATEGORIES_DB_PATH = path.join(__dirname, 'build-categories.json');
const SEED_PATH = path.join(__dirname, 'builds-seed.json');

const DEFAULT_TABS = ['brawl', 'gank', 'kite', 'brawlclap', 'tracking', 'groupdungeon', 'avadungeon'];
const DEFAULT_CATEGORIES = [
  { id: 'brawl', label: 'Brawl', order: 0 },
  { id: 'gank', label: 'Gank', order: 1 },
  { id: 'kite', label: 'Kite & Clap', order: 2 },
  { id: 'brawlclap', label: 'Brawl & Clap', order: 3 },
  { id: 'tracking', label: 'Tracking', order: 4 },
  { id: 'groupdungeon', label: 'Group Dungeon', order: 5 },
  { id: 'avadungeon', label: 'Ava Dungeon', order: 6 },
];

function seedData() {
  return JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
}

async function loadCategories() {
  const data = await storage.loadJSON(CATEGORIES_REDIS_KEY, CATEGORIES_DB_PATH);
  if (!data || !Array.isArray(data) || data.length === 0) {
    await storage.saveJSON(CATEGORIES_REDIS_KEY, CATEGORIES_DB_PATH, DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }
  return data;
}

async function saveCategories(categories) {
  await storage.saveJSON(CATEGORIES_REDIS_KEY, CATEGORIES_DB_PATH, categories);
  return categories;
}

async function loadAllBuilds() {
  const data = await storage.loadJSON(REDIS_KEY, DB_PATH);
  const categories = await loadCategories();
  const allTabIds = categories.map(c => c.id);
  
  if (!data || Object.keys(data).length === 0) {
    const seed = seedData();
    await storage.saveJSON(REDIS_KEY, DB_PATH, seed);
    return seed;
  }
  
  // Make sure all category tabs are present in builds data
  let changed = false;
  for (const tabId of allTabIds) {
    if (!Array.isArray(data[tabId])) { data[tabId] = []; changed = true; }
  }
  if (changed) await storage.saveJSON(REDIS_KEY, DB_PATH, data);
  return data;
}

async function saveTab(tab, list) {
  const categories = await loadCategories();
  const validTabs = categories.map(c => c.id);
  if (!validTabs.includes(tab)) throw new Error(`Unknown build tab: ${tab}`);
  const all = await loadAllBuilds();
  all[tab] = list;
  await storage.saveJSON(REDIS_KEY, DB_PATH, all);
  return all[tab];
}

// Flat, cross-tab list used by the comps editor's "link to a build" picker.
async function listAllForLinking() {
  const all = await loadAllBuilds();
  const categories = await loadCategories();
  const rows = [];
  for (const cat of categories) {
    for (let i = 0; i < (all[cat.id] || []).length; i++) {
      const b = all[cat.id][i];
      rows.push({ tab: cat.id, index: i, role: b.role, weapon: b.weapon || 'Unnamed build' });
    }
  }
  return rows;
}

module.exports = { 
  DEFAULT_TABS, 
  loadAllBuilds, 
  saveTab, 
  listAllForLinking,
  loadCategories,
  saveCategories
};
