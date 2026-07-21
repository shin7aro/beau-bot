// web-auth.js
// Discord OAuth2 login for the website, reusing the bot's own Discord
// Application (same Client ID/Secret as DISCORD_TOKEN belongs to). After
// login we ask Discord who the user is, then use the BOT TOKEN (server-side
// only, never exposed to the browser) to look up that user's member record
// in the guild and read their roles — this is what decides "officer" or
// "admin", not anything the browser claims about itself.
//
// Session = a signed JWT stored in an httpOnly cookie. Nothing is kept in
// server memory, so this is fine across Render restarts/multiple instances.

const jwt = require('jsonwebtoken');

const DISCORD_CLIENT_ID = process.env.CLIENT_ID; // same var the bot already uses
const {
  DISCORD_CLIENT_SECRET,
  DISCORD_TOKEN,
  GUILD_ID,
  OFFICER_ROLE_ID,
  ADMIN_ROLE_ID,
  SESSION_SECRET,
  PUBLIC_URL, // e.g. https://your-app.onrender.com  (no trailing slash)
} = process.env;

const COOKIE_NAME = 'rod_session';
const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 14; // 14 days

function redirectUri() {
  return `${PUBLIC_URL}/auth/callback`;
}

function loginUrl(state) {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: 'identify',
    prompt: 'consent',
    state: state || '',
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

async function exchangeCode(code) {
  const body = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri(),
  });
  const res = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Discord token exchange failed: ${res.status}`);
  return res.json();
}

async function fetchDiscordUser(accessToken) {
  const res = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Discord /users/@me failed: ${res.status}`);
  return res.json();
}

// Uses the BOT token (not the user's OAuth token) to read the user's guild
// member record — this is how we get their roles without needing the
// guilds.members.read scope, which requires per-user approval in Discord's
// Linked Roles flow. The bot is already in the guild, so this just works.
async function fetchGuildMember(userId) {
  const res = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${userId}`, {
    headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
  });
  if (res.status === 404) return null; // not a member of the guild
  if (!res.ok) throw new Error(`Discord guild member lookup failed: ${res.status}`);
  return res.json();
}

function roleForMember(member) {
  if (!member) return null;
  const roles = member.roles || [];
  if (ADMIN_ROLE_ID && roles.includes(ADMIN_ROLE_ID)) return 'admin';
  if (OFFICER_ROLE_ID && roles.includes(OFFICER_ROLE_ID)) return 'officer';
  return null;
}

function makeSessionCookie(res, payload) {
  const token = jwt.sign(payload, SESSION_SECRET, { expiresIn: '14d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

function readSession(req) {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, SESSION_SECRET);
  } catch {
    return null;
  }
}

// Attaches req.user = { id, username, avatar, role } or null. Never blocks.
function attachUser(req, res, next) {
  req.user = readSession(req);
  next();
}

function requireOfficer(req, res, next) {
  if (!req.user || (req.user.role !== 'officer' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Officer or admin access required.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

module.exports = {
  COOKIE_NAME,
  loginUrl,
  exchangeCode,
  fetchDiscordUser,
  fetchGuildMember,
  roleForMember,
  makeSessionCookie,
  readSession,
  attachUser,
  requireOfficer,
  requireAdmin,
};
