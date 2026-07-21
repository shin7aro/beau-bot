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
  res.status(201).json(result);
});

router.put('/api/comps/:key', auth.requireOfficer, async (req, res) => {
  const { newLabel, categories } = req.body || {};
  if (!newLabel || !categories) return res.status(400).json({ error: 'newLabel and categories are required.' });
  const result = await comps.updateCompStructured({
    key: req.params.key, newLabel, categories, userId: req.user.id,
  });
  if (!result) return res.status(400).json({ error: 'Composition not found, name collision, or no items.' });
  res.json(result);
});

router.delete('/api/comps/:key', auth.requireOfficer, async (req, res) => {
  const ok = await comps.deleteComp(req.params.key);
  if (!ok) return res.status(404).json({ error: 'Composition not found.' });
  res.status(204).end();
});

router.get('/api/comps-build-options', auth.requireOfficer, async (req, res) => {
  res.json(await buildsStore.listAllForLinking());
});

// ── HOME PAGE CONTENT ─────────────────────────────────────────────────────

router.get('/api/home', async (req, res) => {
  res.json(await homeStore.loadHomeContent());
});

router.put('/api/home', auth.requireAdmin, async (req, res) => {
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ error: 'Invalid body.' });
  res.json(await homeStore.saveHomeContent(req.body));
});

module.exports = router;
