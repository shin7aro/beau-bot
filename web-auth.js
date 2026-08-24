// web-auth.js
// Discord OAuth2 login for the website, reusing the bot's own Discord
// Application (same Client ID/Secret as DISCORD_TOKEN belongs to). After
// login we ask Discord who the user is, then use the BOT TOKEN (server-side
// only, never exposed to the browser) to look up that user's member record
// in the guild and read their roles — this is what decides "officer",
// "admin", or plain "member" (which now also requires the "Dahalo" role,
// see roleForMember below), not anything the browser claims about itself.
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

// Resolves the "Dahalo" role's Discord ID by name — same lookup
// findDahaloRole() (event-render.js) and fetchDahaloMembersRaw() (api.js)
// already do, so no separate DAHALO_ROLE_ID env var is needed. The
// trade-off: unlike ADMIN_ROLE_ID/OFFICER_ROLE_ID (fixed IDs), renaming
// that Discord role silently breaks this — the role stops resolving,
// roleForMember() below then finds no ordinary member has it, and every
// non-officer/admin guild member is locked out until the role is either
// renamed back or this lookup is pointed at a real ID. Cached briefly
// since it's one extra Discord API call per resolution.
let dahaloRoleIdCache = { id: null, ts: 0 };
const DAHALO_ROLE_ID_CACHE_TTL = 60 * 1000;

async function fetchDahaloRoleId() {
  if (dahaloRoleIdCache.id && Date.now() - dahaloRoleIdCache.ts < DAHALO_ROLE_ID_CACHE_TTL) {
    return dahaloRoleIdCache.id;
  }
  const res = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/roles`, {
    headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Discord role lookup failed: ${res.status}`);
  const roles = await res.json();
  const dahalo = roles.find((r) => (r.name || '').toLowerCase() === 'dahalo');
  dahaloRoleIdCache = { id: dahalo ? dahalo.id : null, ts: Date.now() };
  return dahaloRoleIdCache.id;
}

// 'admin'/'officer' for those roles. Everyone else needs the "Dahalo" role
// specifically to get in at all — just being in the guild isn't enough by
// itself anymore (an ally, alt, or applicant without that role is treated
// exactly like someone who isn't a guild member: null, blocked at login).
// Admins/officers bypass this Dahalo check entirely — those Discord roles
// already imply trust on their own.
async function roleForMember(member) {
  if (!member) return null;
  const roles = member.roles || [];
  if (ADMIN_ROLE_ID && roles.includes(ADMIN_ROLE_ID)) return 'admin';
  if (OFFICER_ROLE_ID && roles.includes(OFFICER_ROLE_ID)) return 'officer';

  const dahaloRoleId = await fetchDahaloRoleId();
  if (dahaloRoleId && roles.includes(dahaloRoleId)) return 'member';
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

// Any logged-in guild member — officer/admin included, since they're also
// members. Used for actions any Discord member should be able to do on the
// site (currently: viewing + signing up for events), as opposed to
// requireOfficer/requireAdmin which gate management actions.
function requireMember(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ error: 'You need to be logged in with Discord to do that.' });
  }
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

// ── ROSTER HIERARCHY MANAGERS ───────────────────────────────────────────
// A small, hand-picked pair of people who can restructure the roster tree
// (who's GM/Right Hand/Officer) and retire someone from the roster
// entirely — separate from, and narrower than, the officer/admin Discord
// roles above. This is intentionally not tied to a Discord role: it's two
// specific people, full stop.
//
// Prefer ROSTER_ADMIN_IDS (comma-separated Discord user IDs) once you have
// them — right-click each person in Discord > Copy User ID (Developer Mode
// must be on). IDs survive nickname/username changes; the name fallback
// below does not, so treat it as a bootstrap default, not a long-term setup.
const ROSTER_ADMIN_IDS = (process.env.ROSTER_ADMIN_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const ROSTER_ADMIN_NAMES = ['Shin7aro 👑', 'Erdan Silentread'];

function isRosterAdmin(user) {
  if (!user) return false;
  if (ROSTER_ADMIN_IDS.length > 0) return ROSTER_ADMIN_IDS.includes(user.id);
  return ROSTER_ADMIN_NAMES.includes(user.username);
}

function requireRosterAdmin(req, res, next) {
  if (!isRosterAdmin(req.user)) {
    return res.status(403).json({ error: 'Only the roster managers can do that.' });
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
  requireMember,
  requireOfficer,
  requireAdmin,
  isRosterAdmin,
  requireRosterAdmin,
};
