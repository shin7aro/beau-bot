// storage.js
// Thin wrapper around Upstash Redis's REST API. Replaces the old
// fs.readFileSync/writeFileSync JSON-file storage used by events.json and
// comps.json, which was wiped on every Render free-tier redeploy/restart
// (local disk there is ephemeral) — see the "Next task" write-up.
//
// If UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN aren't set (e.g.
// running locally without a Redis database yet), this falls back to the
// original local JSON file behavior so local dev keeps working unchanged.

const fs = require('fs');

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_ENABLED = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

if (!REDIS_ENABLED) {
  console.warn(
    'storage: UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN not set — ' +
    'falling back to local JSON files. On Render free tier this data will ' +
    'NOT survive a redeploy/restart without those env vars set.'
  );
}

// Loads the JSON blob stored under `key` (Redis) or `localPath` (fallback).
// Always resolves to an object — never throws — so callers can treat a
// missing/corrupt/unreachable store the same as "nothing saved yet".
async function loadJSON(key, localPath) {
  if (REDIS_ENABLED) {
    try {
      const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (!res.ok) throw new Error(`Upstash GET ${key} -> HTTP ${res.status}`);
      const data = await res.json();
      if (!data.result) return {};
      return JSON.parse(data.result);
    } catch (e) {
      console.error(`storage: failed to load "${key}" from Redis, using empty object`, e);
      return {};
    }
  }

  if (!fs.existsSync(localPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(localPath, 'utf8'));
  } catch {
    return {};
  }
}

// Saves `value` under `key` (Redis) or `localPath` (fallback). Swallows
// errors (logging them) rather than throwing, since a failed save shouldn't
// crash an in-progress Discord interaction — the in-memory copy is still
// correct, and the next successful save will catch the store back up.
async function saveJSON(key, localPath, value) {
  if (REDIS_ENABLED) {
    try {
      const res = await fetch(UPSTASH_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SET', key, JSON.stringify(value)]),
      });
      if (!res.ok) throw new Error(`Upstash SET ${key} -> HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(`Upstash SET ${key} -> ${data.error}`);
    } catch (e) {
      console.error(`storage: failed to save "${key}" to Redis`, e);
    }
    return;
  }

  fs.writeFileSync(localPath, JSON.stringify(value, null, 2));
}

module.exports = { loadJSON, saveJSON, REDIS_ENABLED };
