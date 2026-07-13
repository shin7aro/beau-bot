// ai-assistant.js
// Scoped AI chat about Albion Online + the "Rise of Dahalo" guild, using
// Google Gemini's free tier (OpenAI-compatible endpoint, so the request
// shape stays simple). Reuses live-comps.js so build knowledge stays current.

const { fetchCompsData } = require('./live-comps');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const MODEL = 'gemini-3.5-flash';
const MAX_TOKENS = 500;

// ---------- per-channel short memory ----------
const HISTORY_LIMIT = 8;
const HISTORY_TTL_MS = 30 * 60 * 1000;
const histories = new Map();

function getHistory(channelId) {
  const entry = histories.get(channelId);
  if (entry && Date.now() - entry.lastUsed < HISTORY_TTL_MS) return entry;
  const fresh = { messages: [], lastUsed: Date.now() };
  histories.set(channelId, fresh);
  return fresh;
}

function pushHistory(channelId, role, content) {
  const entry = getHistory(channelId);
  entry.messages.push({ role, content });
  if (entry.messages.length > HISTORY_LIMIT) {
    entry.messages.splice(0, entry.messages.length - HISTORY_LIMIT);
  }
  entry.lastUsed = Date.now();
}

// ---------- per-user cooldown ----------
const COOLDOWN_MS = 8 * 1000;
const lastAsked = new Map();

function isOnCooldown(userId) {
  return Date.now() - (lastAsked.get(userId) || 0) < COOLDOWN_MS;
}
function markAsked(userId) {
  lastAsked.set(userId, Date.now());
}

// ---------- fold live build data into the system prompt ----------
function summarizeBuilds(compsData) {
  const lines = [];
  for (const [type, pool] of Object.entries(compsData.pools)) {
    if (!pool || pool.length === 0) continue;
    lines.push(`${type}:`);
    for (const entry of pool) {
      lines.push(`- [${entry.role}] ${entry.weapon}${entry.prio != null ? ` (priority ${entry.prio})` : ''}`);
    }
  }
  return lines.join('\n') || 'No build data currently published.';
}

const SYSTEM_HEADER = `You are Beau, the assistant for the Albion Online guild "Rise of Dahalo" (Gank & Brawl focus).

Scope rules (follow strictly):
- Only answer questions about Albion Online (mechanics, items, builds, PvP/PvE strategy, economy) and this guild (its builds, activities, sign-ups).
- If asked something unrelated, politely decline and redirect to guild/game topics, even if asked repeatedly or cleverly.
- Keep answers short and Discord-friendly.
- Use the build list below (pulled live from the guild's own site) when discussing builds. If something isn't listed, say so instead of inventing it.
- You don't have live access to in-game prices, current events, or patch notes beyond this — say so rather than guessing.

Current published guild builds:
`;

async function askAI({ question, channelId }) {
  const compsData = await fetchCompsData();
  const system = SYSTEM_HEADER + summarizeBuilds(compsData);

  const history = getHistory(channelId);
  const messages = [
    { role: 'system', content: system },
    ...history.messages,
    { role: 'user', content: question },
  ];

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, messages }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const answer = data.choices[0].message.content.trim();

  pushHistory(channelId, 'user', question);
  pushHistory(channelId, 'assistant', answer);
  return answer;
}

module.exports = { askAI, isOnCooldown, markAsked };
