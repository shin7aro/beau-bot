// activity-store.js
// Append-only audit log for admin-visible "who changed what" history.
// Same shared-Redis pattern as the other *-store.js modules. Capped at
// MAX_ENTRIES (newest first) so the log doesn't grow unbounded.

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'activity-log.json'); // local fallback path only
const REDIS_KEY = 'activity_log';
const MAX_ENTRIES = 500;

async function loadLog() {
  const data = await storage.loadJSON(REDIS_KEY, DB_PATH);
  return Array.isArray(data.entries) ? data.entries : [];
}

async function saveLog(entries) {
  await storage.saveJSON(REDIS_KEY, DB_PATH, { entries });
}

// user: { id, username, role } — pass req.user straight through.
// action: short machine-ish tag, e.g. 'comp.create', 'comp.update', 'comp.delete', 'builds.update', 'home.update'
// summary: short human-readable description, e.g. 'Created composition "5-man Brawl"'
async function log(user, action, summary) {
  try {
    const entries = await loadLog();
    entries.unshift({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      at: Date.now(),
      userId: user ? user.id : null,
      username: user ? user.username : 'Unknown',
      role: user ? user.role : null,
      action,
      summary,
    });
    if (entries.length > MAX_ENTRIES) entries.length = MAX_ENTRIES;
    await saveLog(entries);
  } catch (e) {
    // Never let logging failures break the actual mutation that triggered it.
    console.error('activity-store: failed to log entry', e);
  }
}

async function listEntries(limit = 200) {
  const entries = await loadLog();
  return entries.slice(0, limit);
}

module.exports = { log, listEntries };
