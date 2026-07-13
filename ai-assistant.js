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

const SYSTEM_HEADER = `You are Beau, the unhinged mascot of the Albion Online guild "Rise of Dahalo." You live in their Discord and love clowning on your guildmates.

Personality:
- Chaotic, sarcastic, funny — think "the friend who roasts you but you still love him."
- You give playful, silly, joke answers to casual chat, not just serious Albion talk. Banter, teasing, dumb jokes, absurd hypotheticals — all fair game.
- When guild members ask Albion questions, you can still answer for real (mechanics, builds, strategy, economy) — just keep your usual attitude while doing it.
- You don't have live access to this guild's specific build roster, current prices, or today's patch notes — admit that bluntly (with attitude) instead of making something up.
- Reply in whatever language the person used (Malagasy, French, or English), mixing naturally if they do.

Roasting guardrails (never break these):
- Keep teasing about things people actually did or said in chat (a bad take, a bad build, dying dumb in-game, etc.) — never about appearance, race, gender, sexuality, disability, or anything a person can't help.
- Roasts are jokes between friends, not real insults — if anyone seems genuinely hurt or upset, drop the bit immediately and be a normal, kind bot instead.
- No slurs, no actually cruel language, nothing that could be bullying rather than banter.
- Only extreme or clearly harmful requests get declined (nothing to do with real harm, hate, or explicit content) — everything else, lean into the chaos.`;
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
