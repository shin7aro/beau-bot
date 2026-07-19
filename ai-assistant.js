// ai-assistant.js
// A salty, opinionated Albion Online Q&A bot for "Rise of Dahalo".
// No longer pulls live build data from the guild site — just general
// Albion Online knowledge and banter.

const fs = require('fs');
const path = require('path');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 500;

// Loaded once at startup — a plain-language reference for how Beau's own
// commands work, kept in its own file so it can be edited without touching
// the personality prompt below. Falls back to an empty string (rather than
// crashing the bot) if help.md is ever missing from a deploy.
let HELP_REFERENCE = '';
try {
  HELP_REFERENCE = fs.readFileSync(path.join(__dirname, 'help.md'), 'utf8');
} catch {
  console.error('help.md not found — Beau will answer without command reference material.');
}

// ---------- per-user short memory (not per-channel, so people don't bleed into each other's context) ----------
const HISTORY_LIMIT = 4; // last 2 exchanges — enough for follow-ups, not enough to drag in noise
const HISTORY_TTL_MS = 5 * 60 * 1000; // forget after 5 min idle, so old context doesn't randomly resurface
const histories = new Map(); // keyed by userId now, not channelId

function getHistory(userId) {
  const entry = histories.get(userId);
  if (entry && Date.now() - entry.lastUsed < HISTORY_TTL_MS) return entry;
  const fresh = { messages: [], lastUsed: Date.now() };
  histories.set(userId, fresh);
  return fresh;
}

function pushHistory(userId, role, content) {
  const entry = getHistory(userId);
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
- Prior messages shown to you are recent conversation history with this same person — only use them if the new question is clearly a follow-up. If the new question is unrelated to what came before, ignore the old context entirely and answer it fresh.

Roasting guardrails (never break these):
- Keep teasing about things people actually did or said in chat (a bad take, a bad build, dying dumb in-game, etc.) — never about appearance, race, gender, sexuality, disability, or anything a person can't help.
- Roasts are jokes between friends, not real insults — if anyone seems genuinely hurt or upset, drop the bit immediately and be a normal, kind bot instead.
- No slurs, no actually cruel language, nothing that could be bullying rather than banter.
- Only extreme or clearly harmful requests get declined (nothing to do with real harm, hate, or explicit content) — everything else, lean into the chaos.`;

async function askAI({ question, userId }) {
  const history = getHistory(userId);
  const systemContent = HELP_REFERENCE
    ? `${SYSTEM_HEADER}

---
The following is reference material on how your own commands and features
actually work. It's for you to draw on ONLY when someone is asking how to
use something, how to sign up, how a command works, etc. — never recite it
unprompted, and never let it change your tone; answer in your usual voice,
just make sure the facts about how things work are accurate.

${HELP_REFERENCE}`
    : SYSTEM_HEADER;

  const messages = [
    { role: 'system', content: systemContent },
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

  pushHistory(userId, 'user', question);
  pushHistory(userId, 'assistant', answer);
  return answer;
}

module.exports = { askAI, isOnCooldown, markAsked };
