// home-store.js
// Storage for the admin-editable home page content (hero copy, stats, about
// text) and the YouTube highlights list. Same shared-Redis pattern as
// builds-store.js / comps.js.

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'home-content.json'); // local fallback path only
const REDIS_KEY = 'home_content';

const DEFAULT_CONTENT = {
  heroEyebrow: 'Guild dossier · Black zone operations',
  heroTagline: "Five-man discipline. Twenty-man execution.",
  heroSub: "We're a black-zone PvP guild built around one idea: know your kit before the horn sounds. Every build in the War Ledger is fight-tested and rebuilt the morning after a loss — so nobody's asking what to wear when it matters.",
  discordInviteUrl: '',
  stats: [
    { num: '95', label: 'Builds logged' },
    { num: '3', label: 'Content tracks live' },
    { num: 'T8', label: 'Standard gear tier' },
    { num: '4', label: 'Tracks in progress' },
  ],
  quicklinksEyebrow: 'Inside the guild',
  quicklinksTitle: 'Where to go',
  quicklinksSub: "The site's still being built out — the Ledger's live, the rest is on the way.",
  highlightsEyebrow: 'Watch the fights',
  highlightsTitle: 'Highlights',
  highlightsSub: 'Clips from recent content — ZvZs, ganks, and the odd disaster.',
  aboutTitle: 'Built for the fights that matter',
  aboutParagraphs: [
    "Rise of Dahalo formed around a simple frustration: showing up to a fight without knowing what your five teammates were wearing. We fixed that by writing it down — every comp, every swap — so the only thing left to figure out in voice chat is the call, not the kit.",
    "We run black-zone PvP at every scale: five-man brawls, gank squads, kiting comps for sieges, and the slow grind of tracking parties between fights. The Ledger covers what's live today and keeps growing as we document the rest.",
  ],
  aboutQuote: 'Know your kit. Trust the call. Win the fight.',
  aboutQuoteCite: '— Dahalo Command',
  highlights: [], // [{ id, title, youtubeUrl, addedAt }]
};

async function loadHomeContent() {
  const data = await storage.loadJSON(REDIS_KEY, DB_PATH);
  if (!data || Object.keys(data).length === 0) {
    await storage.saveJSON(REDIS_KEY, DB_PATH, DEFAULT_CONTENT);
    return DEFAULT_CONTENT;
  }
  return { ...DEFAULT_CONTENT, ...data };
}

async function saveHomeContent(content) {
  await storage.saveJSON(REDIS_KEY, DB_PATH, content);
  return content;
}

module.exports = { loadHomeContent, saveHomeContent, DEFAULT_CONTENT };
