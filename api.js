// api.js
// All the HTTP surface the website needs. Mounted onto the bot's existing
// Express app in index.js. Everything here shares the same Upstash Redis
// database as the Discord bot (via storage.js / builds-store.js /
// home-store.js / comps.js) — a comp or build created in Discord shows up
// on the site and vice versa.

const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const auth = require('./web-auth');
const buildsStore = require('./builds-store');
const homeStore = require('./home-store');
const comps = require('./comps');
const activityStore = require('./activity-store');

const router = express.Router();
router.use(cookieParser());
router.use(express.json());
router.use(auth.attachUser);

// ── AUTH ────────────────────────────────────────────────────────────────

router.get('/auth/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : '/';
  res.cookie('rod_oauth_state', JSON.stringify({ state, returnTo }), {
    httpOnly: true, secure: true, sameSite: 'lax', maxAge: 5 * 60 * 1000, path: '/',
  });
  res.redirect(auth.loginUrl(state));
});

router.get('/auth/callback', async (req, res) => {
  try {
    const raw = req.cookies && req.cookies.rod_oauth_state;
    const saved = raw ? JSON.parse(raw) : null;
    if (!saved || saved.state !== req.query.state) {
      return res.status(400).send('Login failed: state mismatch. Please try again.');
    }

    const tokenData = await auth.exchangeCode(req.query.code);
    const discordUser = await auth.fetchDiscordUser(tokenData.access_token);
    const member = await auth.fetchGuildMember(discordUser.id);
    const role = auth.roleForMember(member);

    if (!role) {
      return res.status(403).send('You need an Officer or Admin role in the Discord server to access this.');
    }

    auth.makeSessionCookie(res, {
      id: discordUser.id,
      username: member.nick || discordUser.global_name || discordUser.username,
      avatar: discordUser.avatar,
      role,
    });

    res.clearCookie('rod_oauth_state', { path: '/' });
    res.redirect(saved.returnTo || '/');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Login failed. Please try again.');
  }
});

router.get('/auth/logout', (req, res) => {
  res.clearCookie(auth.COOKIE_NAME, { path: '/' });
  res.redirect('/');
});

router.get('/auth/me', (req, res) => {
  res.json({ user: req.user || null });
});

// ── BUILDS ──────────────────────────────────────────────────────────────

router.get('/api/builds', async (req, res) => {
  try {
    res.json(await buildsStore.loadAllBuilds());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load builds.' });
  }
});

router.put('/api/builds/:tab', auth.requireOfficer, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Body must be an array of builds.' });
    const saved = await buildsStore.saveTab(req.params.tab, req.body);
    activityStore.log(req.user, 'builds.update', `Updated the "${req.params.tab}" build list (${saved.length} build${saved.length === 1 ? '' : 's'})`);
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ── COMPS (officer/admin only, view + edit) ──────────────────────────────

router.get('/api/comps', auth.requireOfficer, async (req, res) => {
  try {
    res.json(await comps.listComps());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load compositions.' });
  }
});

router.get('/api/comps/:key', auth.requireOfficer, async (req, res) => {
  const comp = await comps.getCompByKey(req.params.key);
  if (!comp) return res.status(404).json({ error: 'Composition not found.' });
  res.json(comp);
});

router.post('/api/comps', auth.requireOfficer, async (req, res) => {
  const { label, categories } = req.body || {};
  if (!label || !categories) return res.status(400).json({ error: 'label and categories are required.' });
  const result = await comps.createCompStructured({ label, categories, userId: req.user.id });
  if (!result) return res.status(400).json({ error: 'A composition with that name already exists, or it had no items.' });
  activityStore.log(req.user, 'comp.create', `Created composition "${label}"`);
  res.status(201).json(result);
});

router.put('/api/comps/:key', auth.requireOfficer, async (req, res) => {
  const { newLabel, categories } = req.body || {};
  if (!newLabel || !categories) return res.status(400).json({ error: 'newLabel and categories are required.' });
  const result = await comps.updateCompStructured({
    key: req.params.key, newLabel, categories, userId: req.user.id,
  });
  if (!result) return res.status(400).json({ error: 'Composition not found, name collision, or no items.' });
  activityStore.log(req.user, 'comp.update', `Updated composition "${newLabel}"`);
  res.json(result);
});

router.delete('/api/comps/:key', auth.requireOfficer, async (req, res) => {
  const existing = await comps.getCompByKey(req.params.key);
  const ok = await comps.deleteComp(req.params.key);
  if (!ok) return res.status(404).json({ error: 'Composition not found.' });
  activityStore.log(req.user, 'comp.delete', `Deleted composition "${existing ? existing.label : req.params.key}"`);
  res.status(204).end();
});

router.get('/api/comps-build-options', auth.requireOfficer, async (req, res) => {
  res.json(await buildsStore.listAllForLinking());
});

// ── SERVER EMOJIS (for the comp editor's emoji picker) ────────────────────
// Uses the BOT token, same pattern as web-auth.js's guild member lookup —
// no dependency on the live discord.js Client, so this works regardless of
// bot process timing and can't affect the bot's own connection.
let emojiCache = { data: null, fetchedAt: 0 };
const EMOJI_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min - avoids hammering Discord on every page load

router.get('/api/discord-emojis', auth.requireOfficer, async (req, res) => {
  try {
    if (emojiCache.data && Date.now() - emojiCache.fetchedAt < EMOJI_CACHE_TTL_MS) {
      return res.json(emojiCache.data);
    }
    const discordRes = await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/emojis`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    });
    if (!discordRes.ok) throw new Error(`Discord emoji lookup failed: ${discordRes.status}`);
    const raw = await discordRes.json();
    const emojis = raw.map((e) => ({
      id: e.id,
      name: e.name,
      animated: !!e.animated,
      tag: `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`,
      url: `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}?size=32`,
    }));
    emojiCache = { data: emojis, fetchedAt: Date.now() };
    res.json(emojis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load server emojis.' });
  }
});

// ── HOME PAGE CONTENT ─────────────────────────────────────────────────────

router.get('/api/home', async (req, res) => {
  res.json(await homeStore.loadHomeContent());
});

router.put('/api/home', auth.requireAdmin, async (req, res) => {
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ error: 'Invalid body.' });
  const saved = await homeStore.saveHomeContent(req.body);
  activityStore.log(req.user, 'home.update', 'Updated home page content');
  res.json(saved);
});

// ── HISTORY (admin only) ──────────────────────────────────────────────────

router.get('/api/history', auth.requireAdmin, async (req, res) => {
  try {
    res.json(await activityStore.listEntries());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load history.' });
  }
});

module.exports = router;
