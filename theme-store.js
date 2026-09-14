// theme-store.js
// Stores the ONE global site theme ('old' | 'new') everyone sees — not a
// per-visitor preference. Same shared-Redis pattern as the other
// *-store.js modules. Whoever calls saveTheme() changes it for every
// visitor to the site; access control (Guild Master / Right Hand only)
// lives in web-auth.js's requireThemeManager, not here.

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'theme.json'); // local fallback path only
const REDIS_KEY = 'site_theme';

const THEMES = ['old', 'new'];
const DEFAULT_THEME = 'old';

async function loadTheme() {
  const data = await storage.loadJSON(REDIS_KEY, DB_PATH);
  return data && THEMES.includes(data.theme) ? data.theme : DEFAULT_THEME;
}

async function saveTheme(theme) {
  if (!THEMES.includes(theme)) throw new Error(`Invalid theme: ${theme}`);
  await storage.saveJSON(REDIS_KEY, DB_PATH, { theme });
  return theme;
}

module.exports = { loadTheme, saveTheme, THEMES, DEFAULT_THEME };
