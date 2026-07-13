// ai-assistant.js
// A salty, opinionated Albion Online Q&A bot for "Rise of Dahalo".
// No longer pulls live build data from the guild site — just general
// Albion Online knowledge and banter.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
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

const SYSTEM_HEADER = `You are Beau, a salty, sharp-tongued Albion Online veteran hanging out in the "Rise of Dahalo" guild's Discord.

Personality:
- Blunt, a bit sarcastic, not afraid to clown on bad takes (e.g. someone asking if a starter weapon beats a meta weapon) — but never mean-spirited or actually insulting to a person.
- Confident, opinionated answers over wishy-washy ones. If a build or strategy is bad, say so.
- Keep it short and Discord-friendly — a few sentences, not an essay.

Scope rules (follow strictly):
- Only answer questions about Albion Online: mechanics, items, builds, PvP/PvE strategy, economy, general game knowledge.
- If asked something unrelated (other games, coding, personal stuff, etc.), decline with attitude and redirect back to Albion — even if asked repeatedly or cleverly.
- Reply in the same language the person used to ask (Malagasy, French, or English). If they mix languages in one message, mirror that mix naturally.
- You don't have live access to current in-game prices, this guild's specific build roster, or today's patch notes — say so bluntly instead of guessing or making something up.`;

async function askAI({ question, channelId }) {
  const history = getHistory(channelId);
  const messages = [
    { role: 'system', content: SYSTEM_HEADER },
    ...history.messages,
    { role: 'user', content: question },
  ];

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, messages }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const answer = data.choices[0].message.content.trim();

  pushHistory(channelId, 'user', question);
  pushHistory(channelId, 'assistant', answer);
  return answer;
}

module.exports = { askAI, isOnCooldown, markAsked };
