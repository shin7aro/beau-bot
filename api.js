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
const eventsStore = require('./events-store');
const eventRender = require('./event-render');
const itemMap = require('./item-map');
const lootStore = require('./loot-store');
const lootRender = require('./loot-render');
const rosterStore = require('./roster-store');
const weaponEmojiStore = require('./weapon-emoji-store');
const weaponAliasStore = require('./weapon-alias-store');

const router = express.Router();
router.use(cookieParser());
router.use(express.json());
router.use(auth.attachUser);

// ── DISCORD CLIENT WIRING ──────────────────────────────────────────────
// Set once by index.js right after it creates its Client (see the comment
// there) — this file can't require index.js directly, since index.js is the
// process entry point and re-running it would double-start the bot/server.
// Anything here that needs to post/edit a live Discord message (creating a
// site event, "Ping") goes through this instead, and fails gracefully with
// a clear error if the bot isn't connected yet rather than throwing.
let discordClient = null;
function setClient(client) {
  discordClient = client;
}
function requireDiscordClient(res) {
  if (!discordClient || !discordClient.isReady || !discordClient.isReady()) {
    res.status(503).json({ error: 'The bot is still starting up — try again in a few seconds.' });
    return null;
  }
  return discordClient;
}

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
    const role = await auth.roleForMember(member);

    if (!role) {
      return res.status(403).send("You don't have access to this site — you need the Dahalo role and an active roster status.");
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
  if (!req.user) return res.json({ user: null });
  // Computed fresh from the current ROSTER_ADMIN_IDS/name list (and same
  // for EMOJI_ADMIN_IDS/name below) on every call rather than baked into
  // the session JWT, so revoking/granting access takes effect immediately
  // without forcing a re-login.
  res.json({
    user: {
      ...req.user,
      rosterAdmin: auth.isRosterAdmin(req.user),
      emojiAdmin: auth.isEmojiAdmin(req.user),
    },
  });
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
let emojiCache = { data: null, fetchedAt: 0, pending: null };
const EMOJI_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min - avoids hammering Discord on every page load

// Reads straight from the bot's own live gateway cache instead of ever
// calling Discord's REST API — client.application.emojis.cache is kept in
// sync automatically once the bot's connected, so there's nothing to fetch
// here at all in the normal case, and this can never contribute to a rate
// limit. Falls back to the raw REST call (with the caching+dedup below)
// only if the bot's gateway connection isn't up yet, so this route still
// works during the brief window right after a deploy.
//
// Application emojis (not this guild's own emojis) on purpose — see
// weapon-emoji.js for why: this is what /emoji-sync-weapons populated with
// all 136 weapon icons, and the comp editor's emoji picker is specifically
// for per-weapon-line icons, not the Tank/DPS/Healer/Support role emojis
// (those are a separate guild-emoji lookup, findCustomRoleEmoji in
// event-render.js, used only when the bot builds its own embeds).
router.get('/api/discord-emojis', auth.requireOfficer, async (req, res) => {
  try {
    if (discordClient && discordClient.isReady && discordClient.isReady() && discordClient.application) {
      const emojis = discordClient.application.emojis.cache.map((e) => ({
        id: e.id,
        name: e.name,
        animated: !!e.animated,
        tag: `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`,
        url: e.imageURL({ extension: e.animated ? 'gif' : 'png', size: 32 }),
      }));
      return res.json(emojis);
    }

    if (emojiCache.data && Date.now() - emojiCache.fetchedAt < EMOJI_CACHE_TTL_MS) {
      return res.json(emojiCache.data);
    }
    // Concurrent requests during a cold cache (e.g. several officers
    // loading a page right after a fresh deploy, when the in-memory cache
    // resets) share this same in-flight fetch instead of each hitting
    // Discord separately — that stampede is what trips Discord's 429 rate
    // limit even with the TTL cache above in place.
    if (!emojiCache.pending) {
      emojiCache.pending = (async () => {
        const discordRes = await fetch(`https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/emojis`, {
          headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
        });
        if (!discordRes.ok) throw new Error(`Discord emoji lookup failed: ${discordRes.status}`);
        const { items: raw } = await discordRes.json();
        const emojis = raw.map((e) => ({
          id: e.id,
          name: e.name,
          animated: !!e.animated,
          tag: `<${e.animated ? 'a' : ''}:${e.name}:${e.id}>`,
          url: `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}?size=32`,
        }));
        emojiCache = { data: emojis, fetchedAt: Date.now(), pending: null };
        return emojis;
      })().catch((err) => {
        emojiCache.pending = null; // let the next request retry instead of staying stuck on a failed fetch
        throw err;
      });
    }
    res.json(await emojiCache.pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load weapon emojis.' });
  }
});

// ── WEAPON EMOJI LINKS ──────────────────────────────────────────────────
// The persistent weapon-name -> emoji map the (Shin7aro-only) Emoji
// Linking page maintains. Read side is any officer/admin, same as
// /api/discord-emojis above — the comp editor loads this on every page
// visit to auto-fill a line's emoji the moment a weapon's picked, so it no
// longer needs its own per-line emoji picker. Write side is
// requireEmojiAdmin, not requireAdmin — this is intentionally narrower
// than the site's admin role.

router.get('/api/weapon-emojis', auth.requireOfficer, async (req, res) => {
  res.json(await weaponEmojiStore.loadWeaponEmojis());
});

router.put('/api/weapon-emojis/:weapon', auth.requireEmojiAdmin, async (req, res) => {
  const weapon = decodeURIComponent(req.params.weapon);
  if (!itemMap.WEAPON_NAMES.includes(weapon)) return res.status(400).json({ error: 'Unknown weapon.' });
  const emoji = (req.body && typeof req.body.emoji === 'string' && req.body.emoji.trim()) || null;
  const map = await weaponEmojiStore.setWeaponEmoji(weapon, emoji);
  activityStore.log(req.user, 'weapon-emoji.update', `${emoji ? 'Linked' : 'Unlinked'} emoji for "${weapon}"`);
  res.json(map);
});

// ── WEAPON DISPLAY-NAME ALIASES ─────────────────────────────────────────
// The persistent weapon-name -> short custom display-name map the (same
// Shin7aro-only) Emoji Linking page maintains — lets a weapon show up as
// whatever short name guild members actually call it ("GA" for "Great
// Arcane Staff") wherever its name is shown in the comp editor and on
// event pages, instead of the official in-game name. Read side is public
// (no auth) — unlike /api/weapon-emojis, this needs to render correctly
// on the events page for anyone viewing it, not just officers. Write side
// is requireEmojiAdmin, same as the emoji map above.

router.get('/api/weapon-aliases', async (req, res) => {
  res.json(await weaponAliasStore.loadWeaponAliases());
});

router.put('/api/weapon-aliases/:weapon', auth.requireEmojiAdmin, async (req, res) => {
  const weapon = decodeURIComponent(req.params.weapon);
  if (!itemMap.WEAPON_NAMES.includes(weapon)) return res.status(400).json({ error: 'Unknown weapon.' });
  const alias = (req.body && typeof req.body.alias === 'string' && req.body.alias.trim().slice(0, 24)) || null;
  const map = await weaponAliasStore.setWeaponAlias(weapon, alias);
  activityStore.log(req.user, 'weapon-alias.update', alias ? `Renamed "${weapon}" to "${alias}"` : `Cleared custom name for "${weapon}"`);
  res.json(map);
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

// ── EVENTS ──────────────────────────────────────────────────────────────
// Viewing is public, same as builds — anyone with the link can see what's
// posted. Signing up / leaving needs to be a logged-in Discord member
// (auth.requireMember) since it records a real Discord user id. Creating,
// editing, closing, refreshing, and pinging are officer/admin only, mirrors
// the organizer-or-server-manager check the bot's own /event commands use.

// Resolves signed-up user ids to display names via the live bot client.
// Falls back to showing the raw id if the bot isn't connected or a lookup
// fails — never blocks the response on this.
// Resolves each signed-up user's SERVER display name — their nickname in
// this guild if they have one, else their global display name, else their
// bare username — same precedence the site's login already uses for
// organizerTag (see api.js's /auth/callback). Discord mentions (<@id>) in
// the bot's own embed already show the server nickname automatically; this
// is what makes the site's roster/signups match that instead of showing
// everyone's raw Discord username.
// Resolves both display name and avatar URL for each Discord user ID. Uses
// discord.js's own displayAvatarURL() (guild avatar > user avatar > Discord's
// built-in default avatar) so we don't have to hand-roll that fallback logic.
async function resolveUserInfo(ids) {
  if (!discordClient || ids.length === 0) return Object.fromEntries(ids.map((id) => [id, { username: id, avatarUrl: null }]));
  const guild = discordClient.guilds.cache.get(process.env.GUILD_ID);
  const entries = await Promise.all(
    ids.map(async (id) => {
      try {
        if (guild) {
          const member = await guild.members.fetch(id);
          return [id, { username: member.displayName, avatarUrl: member.displayAvatarURL({ extension: 'png', size: 64 }) }];
        }
        const u = await discordClient.users.fetch(id);
        return [id, { username: u.globalName || u.username, avatarUrl: u.displayAvatarURL({ extension: 'png', size: 64 }) }];
      } catch {
        return [id, { username: id, avatarUrl: null }];
      }
    })
  );
  return Object.fromEntries(entries);
}

function summarizeEvent(event) {
  const rows = comps.expandAllCategoryRows(event.categories, eventsStore.CATEGORY_ORDER);
  return {
    id: event.id,
    title: event.title,
    type: event.type,
    typeEmoji: eventsStore.EVENT_TYPE_EMOJI[event.type] || '🔷',
    time: event.time,
    mass: event.mass,
    sets: event.sets,
    closed: event.closed,
    organizerTag: event.organizerTag,
    compLabel: event.compLabel,
    signedCount: rows.filter((r) => r.signedUserId).length,
    totalSlots: rows.length,
    createdAt: event.createdAt,
  };
}

async function detailEvent(event) {
  const rows = comps.expandAllCategoryRows(event.categories, eventsStore.CATEGORY_ORDER).map((row) => ({
    ...row,
    iconUrl: row.name ? itemMap.itemImageUrl(row.name) : null,
    options: row.options
      ? row.options.map((o) => ({ ...o, iconUrl: itemMap.itemImageUrl(o.name) }))
      : null,
  }));
  const userIds = [...new Set(rows.map((r) => r.signedUserId).filter(Boolean))];
  const userInfo = await resolveUserInfo(userIds);
  const rowsWithNames = rows.map((r) => ({
    ...r,
    signedUsername: r.signedUserId ? userInfo[r.signedUserId].username : null,
    signedAvatarUrl: r.signedUserId ? userInfo[r.signedUserId].avatarUrl : null,
  }));

  // Per-category summary so the site can render a "sign up" dropdown for
  // legacy quota-mode categories (most comps are items-mode, where each row
  // above is already its own pickable slot).
  const categorySummary = {};
  for (const cat of eventsStore.CATEGORY_ORDER) {
    const c = event.categories[cat];
    if (!c) continue;
    categorySummary[cat] =
      c.mode === 'quota'
        ? { mode: 'quota', capacity: c.capacity, weaponOptions: c.weaponOptions, signedCount: c.signups.length }
        : { mode: 'items' };
  }

  return {
    ...summarizeEvent(event),
    organizerId: event.organizerId,
    channelId: event.channelId,
    compKey: event.compKey,
    noShows: event.noShows || [],
    rows: rowsWithNames,
    categories: categorySummary,
  };
}

router.get('/api/events', auth.requireMember, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const list = Object.values(events)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .map(summarizeEvent);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load events.' });
  }
});

router.get('/api/events/:id', auth.requireMember, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    res.json(await detailEvent(event));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load event.' });
  }
});

// Comp picker for the create/edit forms — reuses the same officer-gated
// comp list the compositions page already exposes.
router.get('/api/events-comp-options', auth.requireOfficer, async (req, res) => {
  try {
    res.json(await comps.listComps());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load compositions.' });
  }
});

// Channel picker for the create form — text-postable channels only.
// Uses the bot token directly (same pattern as web-auth.js's guild member
// lookup), so this works even before the live Client has finished connecting.
// Only these channels are offered when creating an event from the site —
// keeps organizers from accidentally posting an event somewhere it doesn't
// belong. Update this list if the channel names change or more get added.
const EVENT_CHANNEL_NAMES = ['chill-activities', 'cta', 'beau-bot-phase-de-test'];

// Discord's per-channel emoji icon (set via right-click a channel > Edit
// Channel > pick an emoji) isn't cosmetic-only — it's actually prepended
// straight into the channel's `name` string the API returns, e.g.
// "🎙chill-activities" instead of "chill-activities". Strip any leading
// run of non-alphanumeric characters before comparing so a channel that
// has one of these icons set still matches its plain name in the list
// above, instead of silently failing an exact-string match.
function stripLeadingChannelIcon(name) {
  return String(name || '').toLowerCase().replace(/^[^a-z0-9]+/, '');
}

// Same TTL-cache-plus-in-flight-dedup pattern as emojiCache above — this
// route used to have no caching at all, hitting Discord fresh on every
// single request, which is exactly what was tripping Discord's 429 rate
// limit whenever a few officers loaded the "new event" form around the
// same time (especially right after a deploy, when the cache is cold).
let discordChannelsCache = { data: null, fetchedAt: 0, pending: null };
const DISCORD_CHANNELS_CACHE_TTL_MS = 5 * 60 * 1000;

router.get('/api/discord-channels', auth.requireOfficer, async (req, res) => {
  try {
    // Same "read the bot's live gateway cache instead of calling Discord's
    // REST API" approach as /api/discord-emojis above — the Guilds intent
    // keeps guild.channels.cache in sync automatically, so the normal case
    // costs zero Discord API calls. Falls back to the raw REST call (with
    // caching+dedup) only while the client isn't connected yet.
    const guild = discordClient && discordClient.isReady && discordClient.isReady()
      ? discordClient.guilds.cache.get(process.env.GUILD_ID)
      : null;
    if (guild) {
      // type 0 = text, 5 = announcement — the only channel types a bot can
      // post a plain message + buttons into — further narrowed to just the
      // approved event channels.
      const channels = guild.channels.cache
        .filter((c) => (c.type === 0 || c.type === 5) && EVENT_CHANNEL_NAMES.includes(stripLeadingChannelIcon(c.name)))
        .map((c) => ({ id: c.id, name: c.name }));
      return res.json(channels);
    }

    if (discordChannelsCache.data && Date.now() - discordChannelsCache.fetchedAt < DISCORD_CHANNELS_CACHE_TTL_MS) {
      return res.json(discordChannelsCache.data);
    }
    if (!discordChannelsCache.pending) {
      discordChannelsCache.pending = (async () => {
        const discordRes = await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/channels`, {
          headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
        });
        if (!discordRes.ok) {
          // Surface what Discord actually said (401 = bad/expired token, 403 =
          // bot isn't in that guild or lacks View Channel, 429 = rate-limited,
          // etc.) instead of a bare status code — this is what used to show up
          // as a generic "Failed to load channels." toast with the real reason
          // only visible in the Render logs.
          const detail = await discordRes.text().catch(() => '');
          throw new Error(`Discord channel lookup failed: ${discordRes.status} ${detail}`.trim());
        }
        const raw = await discordRes.json();
        const channels = raw
          .filter((c) => (c.type === 0 || c.type === 5) && EVENT_CHANNEL_NAMES.includes(stripLeadingChannelIcon(c.name)))
          .map((c) => ({ id: c.id, name: c.name }));
        discordChannelsCache = { data: channels, fetchedAt: Date.now(), pending: null };
        return channels;
      })().catch((err) => {
        discordChannelsCache.pending = null; // let the next request retry instead of staying stuck on a failed fetch
        throw err;
      });
    }
    res.json(await discordChannelsCache.pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to load channels: ${err.message}` });
  }
});

// Guild members with the "Dahalo" role — powers the officer/admin-only
// "assign a player" dropdown on the events page (manual add, mirroring the
// Discord thread command in index.js), the roster hierarchy editor, and
// every profile page (any logged-in member, not just officers, so this is
// hit far more often than the other raw-REST routes above). The member
// list itself still needs a raw REST call — it doesn't need the privileged
// GUILD_MEMBERS gateway intent (the List Guild Members REST endpoint
// doesn't require it, only the gateway/cache-based discord.js helpers do),
// but the role lookup that precedes it can skip Discord's API entirely and
// read the bot's live guild.roles.cache instead, same as the channels/
// emojis routes above. Cached + de-duped the same way as those too.
let dahaloMembersRawCache = { data: null, ts: 0, pending: null };
const DAHALO_MEMBERS_CACHE_TTL = 60 * 1000;

// The full Dahalo-role member list straight from Discord, no roster-store
// filtering applied — this is the only place that should ever see someone
// the roster managers have marked inactive (the hierarchy editor, so they
// can find and reactivate them again).
async function fetchDahaloMembersRaw() {
  if (dahaloMembersRawCache.data && Date.now() - dahaloMembersRawCache.ts < DAHALO_MEMBERS_CACHE_TTL) {
    return dahaloMembersRawCache.data;
  }
  if (!dahaloMembersRawCache.pending) {
    dahaloMembersRawCache.pending = (async () => {
      const guildId = process.env.GUILD_ID;
      const botAuth = { Authorization: `Bot ${process.env.DISCORD_TOKEN}` };

      const cachedGuild = discordClient && discordClient.isReady && discordClient.isReady()
        ? discordClient.guilds.cache.get(guildId)
        : null;
      let dahaloRoleId;
      if (cachedGuild) {
        const role = cachedGuild.roles.cache.find((r) => (r.name || '').toLowerCase() === 'dahalo');
        dahaloRoleId = role ? role.id : null;
      } else {
        const rolesRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, { headers: botAuth });
        if (!rolesRes.ok) throw new Error(`Discord role lookup failed: ${rolesRes.status}`);
        const roles = await rolesRes.json();
        const role = roles.find((r) => (r.name || '').toLowerCase() === 'dahalo');
        dahaloRoleId = role ? role.id : null;
      }
      if (!dahaloRoleId) {
        dahaloMembersRawCache = { data: [], ts: Date.now(), pending: null };
        return [];
      }

      const members = [];
      let after = '0';
      for (;;) {
        const membersRes = await fetch(
          `https://discord.com/api/v10/guilds/${guildId}/members?limit=1000&after=${after}`,
          { headers: botAuth }
        );
        if (!membersRes.ok) throw new Error(`Discord member list failed: ${membersRes.status}`);
        const page = await membersRes.json();
        if (page.length === 0) break;

        for (const m of page) {
          if (m.user && !m.user.bot && (m.roles || []).includes(dahaloRoleId)) {
            members.push({
              id: m.user.id,
              username: m.nick || m.user.global_name || m.user.username,
              avatar: m.user.avatar || null,
              joinedAt: m.joined_at || null,
            });
          }
        }

        if (page.length < 1000) break;
        after = page[page.length - 1].user.id;
      }

      members.sort((a, b) => a.username.localeCompare(b.username));
      dahaloMembersRawCache = { data: members, ts: Date.now(), pending: null };
      return members;
    })().catch((err) => {
      dahaloMembersRawCache.pending = null;
      throw err;
    });
  }
  return dahaloMembersRawCache.pending;
}

// The roster every picker/dropdown on the site should actually use — same
// list as above, minus anyone a roster manager has moved to inactive.
// Positions are loaded fresh (not cached) on every call, so retiring
// someone takes effect immediately everywhere, without waiting out the
// raw Discord cache's TTL.
async function fetchDahaloMembers() {
  const raw = await fetchDahaloMembersRaw();
  const positions = await rosterStore.loadPositions();
  return raw.filter((m) => !rosterStore.getEntry(positions, m.id).inactive);
}

router.get('/api/discord-members', auth.requireOfficer, async (req, res) => {
  try {
    res.json(await fetchDahaloMembers());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load guild members.' });
  }
});

// ── ROSTER (family-tree hierarchy page) ─────────────────────────────────
// Public read — anyone can see the guild's chain of command, same as the
// War Ledger. Never includes anyone marked inactive; that's enforced by
// building this off fetchDahaloMembers(), the already-filtered list.
router.get('/api/roster', async (req, res) => {
  try {
    const members = await fetchDahaloMembers();
    const positions = await rosterStore.loadPositions();
    const enriched = members.map((m) => {
      const entry = rosterStore.getEntry(positions, m.id);
      return { id: m.id, username: m.username, avatar: m.avatar, tier: entry.tier, order: entry.order };
    });

    const byTier = (tier) =>
      enriched
        .filter((m) => m.tier === tier)
        .sort((a, b) => a.order - b.order || a.username.localeCompare(b.username));

    res.json({
      gm: byTier('gm'),
      rightHand: byTier('right_hand'),
      officers: byTier('officer'),
      members: byTier('member'),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load the roster.' });
  }
});

// Roster-manager-only view: every Dahalo-role member, including inactive
// ones (so Shin7aro/Erdan can find and reactivate someone), with their
// current tier/order/inactive status attached — powers the hierarchy
// editor on the roster page.
router.get('/api/roster/admin', auth.requireRosterAdmin, async (req, res) => {
  try {
    const raw = await fetchDahaloMembersRaw();
    const positions = await rosterStore.loadPositions();
    const enriched = raw
      .map((m) => {
        const entry = rosterStore.getEntry(positions, m.id);
        return { id: m.id, username: m.username, avatar: m.avatar, tier: entry.tier, order: entry.order, inactive: entry.inactive };
      })
      .sort((a, b) => a.username.localeCompare(b.username));
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load the roster.' });
  }
});

// Reassigns the manual ordering within one tier in one shot. Body:
// { tier, orderedIds: [userId, ...] } — the tier's members in the order
// they should appear. Defined BEFORE the /:userId route below — Express
// matches routes in order, and "reorder" would otherwise be swallowed by
// :userId.
router.put('/api/roster/admin/reorder', auth.requireRosterAdmin, async (req, res) => {
  const { tier, orderedIds } = req.body || {};
  if (!rosterStore.TIERS.includes(tier) || !Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'Invalid reorder request.' });
  }
  try {
    await rosterStore.setTierOrder(tier, orderedIds);
    const tierLabel = { gm: 'GM', right_hand: 'Right Hand', officer: 'Officer', member: 'Member' }[tier] || tier;
    await activityStore.log(req.user, 'roster.reorder', `Reordered the ${tierLabel} tier`);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder the roster.' });
  }
});

// Set one member's tier and/or active status. Roster-manager-only —
// enforced separately from (and more narrowly than) the officer/admin
// Discord roles, per web-auth.js's requireRosterAdmin.
router.put('/api/roster/admin/:userId', auth.requireRosterAdmin, async (req, res) => {
  const { userId } = req.params;
  const { tier, inactive, username } = req.body || {};

  if (tier !== undefined && !rosterStore.TIERS.includes(tier)) {
    return res.status(400).json({ error: 'Invalid tier.' });
  }

  const patch = {};
  if (tier !== undefined) patch.tier = tier;
  if (inactive !== undefined) patch.inactive = Boolean(inactive);

  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ error: 'Nothing to update.' });
  }

  try {
    const updated = await rosterStore.setEntry(userId, patch);
    const who = username || userId;
    if (inactive !== undefined) {
      await activityStore.log(
        req.user,
        inactive ? 'roster.deactivate' : 'roster.reactivate',
        inactive ? `Moved ${who} to inactive` : `Reactivated ${who}`
      );
    } else {
      const tierLabel = { gm: 'GM', right_hand: 'Right Hand', officer: 'Officer', member: 'Member' }[tier] || tier;
      await activityStore.log(req.user, 'roster.tier', `Set ${who}'s roster tier to ${tierLabel}`);
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update the roster.' });
  }
});

// Same roster as above, but open to any logged-in member (not just
// officers/admins) — powers the participant picker on the Loot Manager
// page, which every member can use.
router.get('/api/loot/members', auth.requireMember, async (req, res) => {
  try {
    res.json(await fetchDahaloMembers());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load guild members.' });
  }
});

// ── PROFILE ──────────────────────────────────────────────────────────────
// Maps the old, pre-PVP/PVE/Gank event "type" values (see events-store.js's
// EVENT_TYPES comment) onto the three attendance buckets below, so events
// created before that change still count toward attendance instead of
// being silently dropped. "Other" has no sensible bucket and is
// intentionally left uncounted — same as the retired "Economy" type
// (and its old "Tracking" alias), which no longer has a bucket to land in.
const LEGACY_EVENT_TYPE_BUCKET = {
  CTA: 'PVP',
  'Group Dungeon': 'PVE',
  'Ava Dungeon': 'PVE',
};

function attendanceBucketFor(type) {
  if (eventsStore.EVENT_TYPES.includes(type)) return type;
  return LEGACY_EVENT_TYPE_BUCKET[type] || null;
}

// Attendance only counts CLOSED events — `noShows` is only known once an
// event is closed, so an open event's sign-up is just intent, not
// attendance yet. A no-show on a closed event doesn't count either, per
// its name.
//
// Also derives, from that same closed-event history:
//   - favoriteRole: whichever CATEGORY_ORDER role (Tank/Support/DPS/
//     Healer/Battlemount) this member's signed-up slot fell under most
//     often — ties keep whichever role was seen first.
//   - recentCampaigns: every closed event they attended (not a no-show
//     on), newest first.
//   - topWeaponsPvp / topWeaponsPve: every weapon they've actually signed
//     up and played across that same closed-event history, tallied
//     separately per bucket (a PVP signup only ever feeds topWeaponsPvp,
//     a PVE one only topWeaponsPve — Gank signups don't have a weapon
//     grid of their own and are left out of both), each sorted by play
//     count desc (ties keep whichever weapon was seen first) — the full
//     history, not capped, since both the profile page's grids and the
//     events-page snippet scroll/wrap this list rather than truncating
//     it. A multi-choice row (options) has no name of its own — the
//     weapon actually played lives at options[signedOptionIndex], same
//     lookup renderInfoCol's mySignedChoice uses on the events page.
// profile.js (the frontend) renders both of these directly, so they need
// to always be present — an empty roleCounts/campaigns list still
// resolves to `null`/`[]` rather than `undefined`.
async function computeProfileStats(userId) {
  const events = await eventsStore.loadEvents();
  const attendance = { PVP: 0, PVE: 0, Gank: 0 };
  const roleCounts = {};
  const weaponCountsByBucket = { PVP: {}, PVE: {} };
  const campaigns = [];

  for (const event of Object.values(events)) {
    if (!event.closed) continue;
    if (!eventsStore.getSignedUpUserIds(event).includes(userId)) continue;
    const noShows = new Set(event.noShows || []);
    if (noShows.has(userId)) continue;

    const bucket = attendanceBucketFor(event.type);
    if (bucket) attendance[bucket] += 1;

    const rows = comps.expandAllCategoryRows(event.categories);
    for (const row of rows) {
      if (row.signedUserId === userId) {
        roleCounts[row.category] = (roleCounts[row.category] || 0) + 1;

        const weaponName = row.options
          ? (row.options[row.signedOptionIndex] && row.options[row.signedOptionIndex].name)
          : row.name;
        const weaponCounts = weaponCountsByBucket[bucket];
        if (weaponName && weaponCounts) weaponCounts[weaponName] = (weaponCounts[weaponName] || 0) + 1;
      }
    }

    campaigns.push({ id: event.id, title: event.title, type: event.type, createdAt: event.createdAt });
  }

  campaigns.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  let favoriteRole = null;
  let bestCount = 0;
  for (const role of comps.CATEGORY_ORDER) {
    const count = roleCounts[role] || 0;
    if (count > bestCount) {
      bestCount = count;
      favoriteRole = role;
    }
  }

  const topWeaponsFrom = (counts) => Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const topWeaponsPvp = topWeaponsFrom(weaponCountsByBucket.PVP);
  const topWeaponsPve = topWeaponsFrom(weaponCountsByBucket.PVE);

  return { attendance, favoriteRole, recentCampaigns: campaigns, topWeaponsPvp, topWeaponsPve };
}

// One member's profile — role, attendance, and loot earned. Gated the
// same way events/loot data already is (auth.requireMember): the roster
// page's list of names is public, but the stats behind each name follow
// the same members-only boundary as the events/loot pages they're drawn
// from.
router.get('/api/profile/:userId', auth.requireMember, async (req, res) => {
  try {
    const { userId } = req.params;
    const raw = await fetchDahaloMembersRaw();
    const found = raw.find((m) => m.id === userId);

    const positions = await rosterStore.loadPositions();
    const entry = rosterStore.getEntry(positions, userId);

    const totals = await lootStore.getTotals();
    const lootRecord = totals.perMember[userId];

    const { attendance, favoriteRole, recentCampaigns, topWeaponsPvp, topWeaponsPve } = await computeProfileStats(userId);

    res.json({
      id: userId,
      username: (found && found.username) || (lootRecord && lootRecord.username) || userId,
      avatar: (found && found.avatar) || null,
      tier: entry.tier,
      inactive: entry.inactive,
      inGuild: Boolean(found),
      memberSince: (found && found.joinedAt) || null,
      attendance,
      favoriteRole,
      recentCampaigns,
      topWeaponsPvp,
      topWeaponsPve,
      totalLootEarned: lootRecord ? lootRecord.totalReceived : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load profile.' });
  }
});

// ── LOOT MANAGER ────────────────────────────────────────────────────────
// Open to any logged-in member, not just officers/admins — anyone in the
// guild can run a split. Posting still goes through the live Discord bot
// (loot-render.js), same "site triggers the exact same message the /loot
// command would" approach the events feature uses above.

router.get('/api/loot', auth.requireMember, async (req, res) => {
  try {
    const [recent, totals] = await Promise.all([lootStore.listRecent(50), lootStore.getTotals()]);
    res.json({ recent, totals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load loot splits.' });
  }
});

router.get('/api/loot/stats', auth.requireMember, async (req, res) => {
  try {
    const [totals, leaderboard] = await Promise.all([lootStore.getTotals(), lootStore.leaderboard(20)]);
    res.json({ totals, leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load loot stats.' });
  }
});

router.post('/api/loot', auth.requireMember, async (req, res) => {
  const client = requireDiscordClient(res);
  if (!client) return;

  const { lootName, lootLocation, lootValue, participantIds, taxed } = req.body || {};
  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    return res.status(400).json({ error: 'Pick at least one participant.' });
  }

  let participants;
  try {
    const roster = await fetchDahaloMembers();
    const byId = new Map(roster.map((m) => [m.id, m]));
    participants = participantIds.map((id) => ({ userId: id, username: byId.get(id)?.username || null }));
  } catch (err) {
    console.error('Failed to resolve participants for loot split', err);
    return res.status(500).json({ error: 'Failed to load the member list — try again shortly.' });
  }

  const { split, error } = lootStore.createSplit({
    lootName,
    lootLocation,
    lootValue,
    participants,
    taxed: taxed !== false, // defaults to true unless the form explicitly unchecked it
    createdBy: { id: req.user.id, username: req.user.username },
    guildId: process.env.GUILD_ID,
  });

  if (error === 'loot_name_required') return res.status(400).json({ error: 'Loot name is required.' });
  if (error === 'invalid_value') return res.status(400).json({ error: 'Loot value has to be a positive number.' });
  if (error === 'no_participants') return res.status(400).json({ error: 'Pick at least one participant.' });
  if (error) return res.status(400).json({ error: 'Something about that split was invalid.' });

  const postResult = await lootRender.postSplit(client, split, process.env.GUILD_ID);
  if (postResult.error === 'no_payout_channel') {
    return res.status(400).json({ error: 'No "payout" channel found in the server — ask an admin to create one.' });
  }

  await lootStore.saveNewSplit(split);
  activityStore.log(
    { id: req.user.id, username: req.user.username },
    'loot.create',
    `Posted a loot split for "${split.lootName}" (${lootRender.formatSilver(split.lootValue)}, ${
      split.participants.length
    } participants)`
  );

  res.json({ split });
});

// Manual "mark this person claimed" — for when someone actually took their
// share but forgot to react. Same organizer-or-officer/admin gate as the
// reminder route above.
router.post('/api/loot/:id/claim', auth.requireMember, async (req, res) => {
  const client = requireDiscordClient(res);
  if (!client) return;

  const split = await lootStore.findSplit(req.params.id);
  if (!split) return res.status(404).json({ error: 'Loot split not found.' });

  const isCreator = split.createdBy && split.createdBy.id === req.user.id;
  const isManager = req.user.role === 'officer' || req.user.role === 'admin';
  if (!isCreator && !isManager) {
    return res.status(403).json({ error: 'Only the person who posted this split (or an officer/admin) can mark someone as claimed.' });
  }

  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId is required.' });

  const result = lootStore.markClaimed(split, userId);
  if (result.error === 'not_participant') return res.status(400).json({ error: 'That person is not a participant on this split.' });
  if (result.error === 'already_donated') return res.status(400).json({ error: 'That share was already donated to the guild.' });
  if (result.alreadyClaimed) return res.json({ split, alreadyClaimed: true });

  await lootStore.persistSplit(split);
  await lootRender.updateSplitMessage(client, split);
  if (result.allResolved) await lootRender.celebrateCompletedThread(client, split);

  const claimedParticipant = split.participants.find((p) => p.userId === userId);
  activityStore.log(
    { id: req.user.id, username: req.user.username },
    'loot.mark_claimed',
    `Marked ${claimedParticipant?.username || userId} as having claimed their split of "${split.lootName}"`
  );

  res.json({ split });
});

// Manual "mark this person donated" — the site-side equivalent of the
// Discord "Donate my share to the guild" button, for when someone told
// the organizer/an officer they wanted to donate but never pressed it
// themselves. Same organizer-or-officer/admin gate as the claim route
// above, and same mutual-exclusivity rules (lootStore.donateShare handles
// both the participant flag and folding the share into totalDonated).
router.post('/api/loot/:id/donate', auth.requireMember, async (req, res) => {
  const client = requireDiscordClient(res);
  if (!client) return;

  const split = await lootStore.findSplit(req.params.id);
  if (!split) return res.status(404).json({ error: 'Loot split not found.' });

  const isCreator = split.createdBy && split.createdBy.id === req.user.id;
  const isManager = req.user.role === 'officer' || req.user.role === 'admin';
  if (!isCreator && !isManager) {
    return res.status(403).json({ error: 'Only the person who posted this split (or an officer/admin) can mark someone as donated.' });
  }

  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId is required.' });

  const result = await lootStore.donateShare(split, userId);
  if (result.error === 'not_participant') return res.status(400).json({ error: 'That person is not a participant on this split.' });
  if (result.error === 'already_claimed') return res.status(400).json({ error: 'That share was already claimed by that person.' });
  if (result.alreadyDonated) return res.json({ split, alreadyDonated: true });

  await lootRender.updateSplitMessage(client, split);
  if (result.allResolved) await lootRender.celebrateCompletedThread(client, split);

  const donatedParticipant = split.participants.find((p) => p.userId === userId);
  activityStore.log(
    { id: req.user.id, username: req.user.username },
    'loot.mark_donated',
    `Marked ${donatedParticipant?.username || userId} as having donated their split of "${split.lootName}" to the guild`
  );

  res.json({ split });
});

// Manual "ping unclaimed now" — same organizer-or-server-manager gate the
// bot's /loot remind command uses, checked here via the site's officer/admin
// roles instead of a live Discord permission check (the site doesn't have
// one to check against for a background HTTP request).
router.post('/api/loot/:id/remind', auth.requireMember, async (req, res) => {
  const client = requireDiscordClient(res);
  if (!client) return;

  const split = await lootStore.findSplit(req.params.id);
  if (!split) return res.status(404).json({ error: 'Loot split not found.' });

  const isCreator = split.createdBy && split.createdBy.id === req.user.id;
  const isManager = req.user.role === 'officer' || req.user.role === 'admin';
  if (!isCreator && !isManager) {
    return res.status(403).json({ error: 'Only the person who posted this split (or an officer/admin) can send a reminder.' });
  }

  const unclaimed = lootStore.unclaimedParticipants(split);
  if (unclaimed.length === 0) return res.status(400).json({ error: 'Everyone has already claimed their split.' });
  if (!split.threadId) return res.status(400).json({ error: "This split doesn't have a thread to post in." });

  try {
    const thread = await client.channels.fetch(split.threadId);
    const mentionText = unclaimed.map((p) => `<@${p.userId}>`).join(' ');
    await lootRender.deletePreviousReminder(thread, split.lastReminderMessageId);
    const sent = await thread.send(
      `⏰ Still waiting on your split from **${split.lootName}** (${lootRender.formatSilver(split.shareAmount)} each): ${mentionText}`
    );
    split.lastReminderAt = Date.now();
    split.lastReminderMessageId = sent.id;
    await lootStore.persistSplit(split);
    res.json({ ok: true });
  } catch (err) {
    console.error('Manual loot reminder failed', err);
    res.status(500).json({ error: 'Failed to send the reminder — try again shortly.' });
  }
});

// Deletes a split entirely — for clearing out test splits. Stricter than
// remind/mark-claimed on purpose: officer/admin only, no "or whoever
// created it" exception, since this also wipes the split out of the
// all-time totals (see lootStore.deleteSplit). Doesn't hard-require a live
// Discord client — the split data still gets deleted even if the bot isn't
// connected right now; the Discord message just won't get cleaned up until
// it reconnects (or someone deletes it by hand).
router.delete('/api/loot/:id', auth.requireOfficer, async (req, res) => {
  const result = await lootStore.deleteSplit(req.params.id);
  if (result.error === 'not_found') return res.status(404).json({ error: 'Loot split not found.' });

  const split = result.split;
  if (discordClient && discordClient.isReady && discordClient.isReady() && split.channelId && split.messageId) {
    try {
      const channel = await discordClient.channels.fetch(split.channelId);
      const message = await channel.messages.fetch(split.messageId);
      await message.delete();
    } catch (err) {
      console.error('Failed to delete loot split Discord message', err);
    }
  }

  activityStore.log(
    { id: req.user.id, username: req.user.username },
    'loot.delete',
    `Deleted the loot split for "${split.lootName}" (${lootRender.formatSilver(split.lootValue)})`
  );

  res.json({ ok: true });
});

router.post('/api/events', auth.requireOfficer, async (req, res) => {
  const client = requireDiscordClient(res);
  if (!client) return;

  const { type, title, time, mass, sets, channelId, compKey, categories, compositionRaw } = req.body || {};
  if (!type || !eventsStore.EVENT_TYPES.includes(type)) {
    return res.status(400).json({ error: 'type must be PVP, PVE, or Gank.' });
  }
  if (!time || !String(time).trim()) return res.status(400).json({ error: 'time is required.' });
  if (!channelId) return res.status(400).json({ error: 'channelId is required.' });
  if (!compKey && !categories && !compositionRaw) {
    return res.status(400).json({ error: 'Provide compKey, categories, or compositionRaw.' });
  }

  const meta = {
    type,
    title: title && title.trim() ? title.trim() : type,
    time: String(time).trim(),
    mass,
    sets,
    organizerId: req.user.id,
    organizerTag: req.user.username,
    channelId,
    guildId: process.env.GUILD_ID,
  };

  let result;
  if (compKey) {
    result = await eventsStore.createEventFromComp({ compKey, ...meta });
  } else if (compositionRaw) {
    const guild = client.guilds.cache.get(process.env.GUILD_ID) || null;
    result = eventsStore.createEventFromRawText({ compositionRaw, guild, ...meta });
  } else {
    result = eventsStore.createEventManual({ categories, ...meta });
  }

  if (result.error === 'comp_not_found') return res.status(400).json({ error: "That saved composition couldn't be found." });
  if (result.error === 'empty_composition') {
    return res.status(400).json({
      error: "Couldn't find any items under a Tank/DPS/Healer/Support/Battlemount header — check the format.",
    });
  }

  const event = result.event;
  let channel, message;
  try {
    channel = await client.channels.fetch(channelId);
    // The embed/buttons below still have event.id === null baked into the
    // footer text and every button's customId — a message's real id only
    // exists after it's posted. Same two-step dance the Discord-native
    // /event create flow already does: post once, learn the real id from
    // the sent message, then edit it in place so the id is finally correct
    // everywhere it's referenced.
    message = await channel.send({
      content: eventRender.dahaloPingContent(channel.guild) || undefined,
      embeds: [eventRender.buildEmbed(event, channel.guild)],
      components: eventRender.buildButtons(event, channel.guild),
    });
    event.id = message.id;
    await message.edit({
      embeds: [eventRender.buildEmbed(event, channel.guild)],
      components: eventRender.buildButtons(event, channel.guild),
    });
    await eventRender.createEventThread(message, event);
  } catch (err) {
    console.error('Failed to post site-created event to Discord', err);
    return res.status(400).json({ error: "Couldn't post to that channel — check the bot has access to it." });
  }

  const events = await eventsStore.loadEvents();
  events[event.id] = event;
  await eventsStore.saveEvents(events);
  activityStore.log(req.user, 'event.create', `Created event "${event.title}" (${event.type}) from the site`);
  res.status(201).json(await detailEvent(event));
});

router.put('/api/events/:id', auth.requireOfficer, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const { title, time, type, mass, sets, compKey, categories, compositionRaw } = req.body || {};
    if (type && !eventsStore.EVENT_TYPES.includes(type)) {
      return res.status(400).json({ error: 'type must be PVP, PVE, or Gank.' });
    }

    const patch = { title, time, type };
    if (mass !== undefined) patch.mass = mass;
    if (sets !== undefined) patch.sets = sets;
    eventsStore.applyMetaEdits(event, patch);

    let dropped = [];
    if (compKey) {
      const result = await eventsStore.relinkComp(event, compKey);
      if (result.error === 'comp_not_found') return res.status(400).json({ error: "That saved composition couldn't be found." });
      dropped = result.dropped;
    } else if (compositionRaw) {
      const guild = discordClient ? discordClient.guilds.cache.get(process.env.GUILD_ID) : null;
      const result = eventsStore.applyRawTextCategories(event, compositionRaw, guild);
      if (result.error === 'empty_composition') {
        return res.status(400).json({ error: "Couldn't find any items under a Tank/DPS/Healer/Support/Battlemount header — check the format." });
      }
      dropped = result.dropped;
    } else if (categories) {
      const result = eventsStore.applyManualCategories(event, categories);
      if (result.error === 'empty_composition') return res.status(400).json({ error: 'The composition has no items.' });
      dropped = result.dropped;
    }

    await eventsStore.saveEvents(events);
    activityStore.log(req.user, 'event.edit', `Edited event "${event.title}" from the site`);

    if (discordClient) {
      try {
        await eventRender.updateEventMessage(discordClient, event);
      } catch (e) {
        console.error('Failed to update Discord message after site edit', e);
      }
    }

    res.json({ ...(await detailEvent(event)), dropped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to edit event.' });
  }
});

// Links (or unlinks, if buildTab/buildId are omitted) a build to one role
// line on THIS event only — it doesn't touch the saved composition the
// event may have come from, same way sign-ups are event-specific. A
// multi-choice line has no single build of its own, so req.body.optionIndex
// says which of its options the link applies to. Anyone can already see a
// linked build (see detailEvent's row.options[].buildTab/buildId, or GET
// /api/builds, both public); only officers/admins can change the link.
router.put('/api/events/:id/rows/:category/:itemIndex/build', auth.requireOfficer, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const catData = event.categories[req.params.category];
    if (!catData || catData.mode !== 'items') return res.status(400).json({ error: 'Invalid category.' });
    const idx = Number(req.params.itemIndex);
    const item = catData.items[idx];
    if (!item) return res.status(404).json({ error: 'Role line not found.' });

    const { buildTab, buildId, optionIndex } = req.body || {};
    // Multi-choice lines have no single weapon of their own — the caller
    // must say which option's build they mean instead.
    let target = item;
    if (item.options) {
      if (optionIndex === undefined || optionIndex === null || !item.options[optionIndex]) {
        return res.status(400).json({ error: 'Provide a valid optionIndex for a multi-choice line.' });
      }
      target = item.options[optionIndex];
    }

    if (buildTab && buildId !== undefined && buildId !== null) {
      target.buildTab = buildTab;
      target.buildId = Number(buildId);
    } else {
      target.buildTab = null;
      target.buildId = null;
    }

    await eventsStore.saveEvents(events);
    activityStore.log(
      req.user,
      'event.link-build',
      `${target.buildTab ? 'Linked' : 'Unlinked'} a build for "${comps.itemLabel(item)}" (${req.params.category}) on event "${event.title}"`
    );

    if (discordClient) {
      try {
        await eventRender.updateEventMessage(discordClient, event);
      } catch (e) {
        console.error('Failed to update Discord message after build link change', e);
      }
    }

    res.json(await detailEvent(event));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update the build link.' });
  }
});

// Manual "assign a player to an open slot" — the site equivalent of
// mentioning someone + a role name in an event's Discord thread (see
// index.js). Officer/admin only. Only covers items-mode categories, same
// restriction as the build-link route above — quota-mode roles keep using
// their own self-serve "pick a weapon, sign up" section, since there's no
// single slot to assign into.
router.post('/api/events/:id/rows/:category/:itemIndex/assign', auth.requireOfficer, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    if (event.closed) return res.status(400).json({ error: 'This event is no longer open.' });

    const catData = event.categories[req.params.category];
    if (!catData || catData.mode !== 'items') return res.status(400).json({ error: 'Invalid category.' });
    const idx = Number(req.params.itemIndex);
    const item = catData.items[idx];
    if (!item) return res.status(404).json({ error: 'Role line not found.' });
    if (item.signups.length > 0) return res.status(400).json({ error: 'That slot is already filled.' });

    const { userId, optionIndex } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId is required.' });

    // Multi-choice line — the officer also has to say which weapon the
    // player is taking, same as a self-signup would.
    let label = item.name;
    if (item.options) {
      const idxNum = Number(optionIndex);
      if (!Number.isInteger(idxNum) || !item.options[idxNum]) {
        return res.status(400).json({ error: 'optionIndex is required for a multi-choice line.' });
      }
      eventsStore.removeUserFromEvent(event, userId);
      item.signups.push(userId);
      item.signedOptionIndex = idxNum;
      label = item.options[idxNum].name;
    } else {
      eventsStore.removeUserFromEvent(event, userId);
      item.signups.push(userId);
    }

    await eventsStore.saveEvents(events);
    activityStore.log(
      req.user,
      'event.assign',
      `Assigned <@${userId}> to "${label}" (${req.params.category}) on event "${event.title}"`
    );

    if (discordClient) {
      try {
        await eventRender.updateEventMessage(discordClient, event);
      } catch (e) {
        console.error('Failed to update Discord message after manual assign', e);
      }
    }

    res.json(await detailEvent(event));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign player.' });
  }
});

// Manual "remove whoever's in this slot" — the site equivalent of the
// remove path in the same Discord thread command.
router.delete('/api/events/:id/rows/:category/:itemIndex/assign', auth.requireOfficer, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    if (event.closed) return res.status(400).json({ error: 'This event is no longer open.' });

    const catData = event.categories[req.params.category];
    if (!catData || catData.mode !== 'items') return res.status(400).json({ error: 'Invalid category.' });
    const idx = Number(req.params.itemIndex);
    const item = catData.items[idx];
    if (!item) return res.status(404).json({ error: 'Role line not found.' });

    const removedUserId = item.signups[0] || null;
    item.signups = [];
    if (item.options) item.signedOptionIndex = null;

    await eventsStore.saveEvents(events);
    activityStore.log(
      req.user,
      'event.unassign',
      `Removed ${removedUserId ? `<@${removedUserId}>` : 'a player'} from "${item.name}" (${req.params.category}) on event "${event.title}"`
    );

    if (discordClient) {
      try {
        await eventRender.updateEventMessage(discordClient, event);
      } catch (e) {
        console.error('Failed to update Discord message after manual unassign', e);
      }
    }

    res.json(await detailEvent(event));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove player.' });
  }
});

router.post('/api/events/:id/refresh', auth.requireOfficer, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const result = await eventsStore.refreshFromLinkedComp(event);
    if (result.error === 'no_linked_comp') return res.status(400).json({ error: 'This event was not created from a saved comp.' });
    if (result.error === 'comp_not_found') return res.status(400).json({ error: "The linked composition couldn't be found anymore." });

    await eventsStore.saveEvents(events);
    activityStore.log(req.user, 'event.refresh', `Refreshed event "${event.title}" from the site`);

    if (discordClient) {
      try {
        await eventRender.updateEventMessage(discordClient, event);
      } catch (e) {
        console.error('Failed to update Discord message after site refresh', e);
      }
    }

    res.json({ ...(await detailEvent(event)), dropped: result.dropped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to refresh event.' });
  }
});

router.post('/api/events/:id/close', auth.requireOfficer, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    if (event.closed) return res.status(400).json({ error: 'This event is already closed.' });

    const noShowIds = Array.isArray(req.body && req.body.noShowIds) ? req.body.noShowIds : [];
    event.closed = true;
    event.noShows = noShowIds;
    await eventsStore.saveEvents(events);
    activityStore.log(
      req.user,
      'event.close',
      `Closed event "${event.title}" from the site${noShowIds.length ? ` — ${noShowIds.length} no-show${noShowIds.length === 1 ? '' : 's'}` : ''}`
    );

    if (discordClient) {
      try {
        await eventRender.deleteEventReminder(discordClient, event);
        await eventRender.updateEventMessage(discordClient, event);
        await eventRender.postEventCloseSummary(discordClient, event, noShowIds);
      } catch (e) {
        console.error('Failed to update Discord after site close', e);
      }
    }

    res.json(await detailEvent(event));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to close event.' });
  }
});

// Deletes an event outright — data is gone, and (best-effort) the posted
// Discord message/thread too. Distinct from close: closing just stops new
// sign-ups and keeps the event around for the record; delete is for
// getting rid of it entirely, e.g. test events that shouldn't linger in
// the events list forever just because they got closed.
router.delete('/api/events/:id', auth.requireOfficer, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    delete events[req.params.id];
    await eventsStore.saveEvents(events);
    activityStore.log(req.user, 'event.delete', `Deleted event "${event.title}" (${event.type}) from the site`);

    if (discordClient) {
      try {
        await eventRender.deleteEventMessage(discordClient, event);
      } catch (e) {
        console.error('Failed to delete Discord message after site delete', e);
      }
    }

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

// Manual, immediate version of the bot's 30-minute auto-reminder — same
// "still missing" summary. Posted to the dedicated #event-reminders
// channel with a jump link back to the event's embed message — a role
// mention dropped inside a thread only notifies members already in that
// thread once the role passes ~100 members (see dahaloPingContent in
// event-render.js), which silently breaks the ping for a guild-wide role
// like Dahalo.
router.post('/api/events/:id/ping', auth.requireOfficer, async (req, res) => {
  const client = requireDiscordClient(res);
  if (!client) return;

  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    if (event.closed) return res.status(400).json({ error: 'This event is closed.' });

    const missing = eventsStore.getMissingRolesSummary(event);
    if (missing.length === 0) return res.status(400).json({ error: 'Every slot is already filled.' });

    const guild = client.guilds.cache.get(event.guildId);
    const remindersChannel = eventRender.findEventRemindersChannel(guild);
    if (!remindersChannel) {
      return res.status(400).json({ error: 'No #event-reminders channel found in this server — create one first.' });
    }

    await eventRender.deletePreviousReminder(remindersChannel, event.lastReminderMessageId);
    const sent = await remindersChannel.send(eventRender.buildReminderMessage(event, guild, missing, req.user.username));
    event.lastReminderMessageId = sent.id;
    await eventsStore.saveEvents(events);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send the reminder.' });
  }
});

router.post('/api/events/:id/signup', auth.requireMember, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    if (event.closed) return res.status(400).json({ error: 'This event is no longer open.' });

    const { category, weapon, itemIndex, optionIndex } = req.body || {};
    if (!category) return res.status(400).json({ error: 'category is required.' });
    const choice = weapon !== undefined ? { weapon } : { itemIndex, optionIndex };
    const result = eventsStore.signUp(event, req.user.id, category, choice);
    if (result.error) {
      const messages = {
        no_category: 'That role does not exist on this event.',
        full: 'That slot just filled up — try another.',
        invalid_choice: 'Invalid choice.',
      };
      return res.status(400).json({ error: messages[result.error] || 'Could not sign up.' });
    }

    await eventsStore.saveEvents(events);

    if (discordClient) {
      try {
        await eventRender.updateEventMessage(discordClient, event);
      } catch (e) {
        console.error('Failed to update Discord message after site sign-up', e);
      }
    }

    res.json(await detailEvent(event));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sign up.' });
  }
});

router.post('/api/events/:id/leave', auth.requireMember, async (req, res) => {
  try {
    const events = await eventsStore.loadEvents();
    const event = events[req.params.id];
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    eventsStore.leave(event, req.user.id);
    await eventsStore.saveEvents(events);

    if (discordClient) {
      try {
        await eventRender.updateEventMessage(discordClient, event);
      } catch (e) {
        console.error('Failed to update Discord message after site leave', e);
      }
    }

    res.json(await detailEvent(event));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to leave event.' });
  }
});

router.setClient = setClient;
module.exports = router;
