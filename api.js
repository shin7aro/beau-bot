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
    const role = auth.roleForMember(member);

    if (!role) {
      return res.status(403).send('You need to be a member of the Discord server to access this.');
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
async function resolveUsernames(ids) {
  if (!discordClient || ids.length === 0) return Object.fromEntries(ids.map((id) => [id, id]));
  const guild = discordClient.guilds.cache.get(process.env.GUILD_ID);
  const entries = await Promise.all(
    ids.map(async (id) => {
      try {
        if (guild) {
          const member = await guild.members.fetch(id);
          return [id, member.displayName];
        }
        const u = await discordClient.users.fetch(id);
        return [id, u.globalName || u.username];
      } catch {
        return [id, id];
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
  }));
  const userIds = [...new Set(rows.map((r) => r.signedUserId).filter(Boolean))];
  const usernames = await resolveUsernames(userIds);
  const rowsWithNames = rows.map((r) => ({ ...r, signedUsername: r.signedUserId ? usernames[r.signedUserId] : null }));

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

router.get('/api/discord-channels', auth.requireOfficer, async (req, res) => {
  try {
    const discordRes = await fetch(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/channels`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    });
    if (!discordRes.ok) throw new Error(`Discord channel lookup failed: ${discordRes.status}`);
    const raw = await discordRes.json();
    // type 0 = text, 5 = announcement — the only channel types a bot can
    // post a plain message + buttons into — further narrowed to just the
    // approved event channels.
    const channels = raw
      .filter((c) => (c.type === 0 || c.type === 5) && EVENT_CHANNEL_NAMES.includes((c.name || '').toLowerCase()))
      .map((c) => ({ id: c.id, name: c.name }));
    res.json(channels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load channels.' });
  }
});

router.post('/api/events', auth.requireOfficer, async (req, res) => {
  const client = requireDiscordClient(res);
  if (!client) return;

  const { type, title, time, mass, sets, channelId, compKey, categories, compositionRaw } = req.body || {};
  if (!type || !eventsStore.EVENT_TYPES.includes(type)) {
    return res.status(400).json({ error: 'type must be PVP, PVE, or Economy.' });
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
      embeds: [eventRender.buildEmbed(event, channel.guild)],
      components: eventRender.buildButtons(event, channel.guild),
    });
    event.id = message.id;
    await message.edit({
      embeds: [eventRender.buildEmbed(event, channel.guild)],
      components: eventRender.buildButtons(event, channel.guild),
    });
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
      return res.status(400).json({ error: 'type must be PVP, PVE, or Economy.' });
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
// event may have come from, same way sign-ups are event-specific. Anyone
// can already see a linked build (see detailEvent's row.buildTab/buildId,
// or GET /api/builds, both public); only officers/admins can change the link.
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

    const { buildTab, buildId } = req.body || {};
    if (buildTab && buildId !== undefined && buildId !== null) {
      item.buildTab = buildTab;
      item.buildId = Number(buildId);
    } else {
      item.buildTab = null;
      item.buildId = null;
    }

    await eventsStore.saveEvents(events);
    activityStore.log(
      req.user,
      'event.link-build',
      `${item.buildTab ? 'Linked' : 'Unlinked'} a build for "${item.name}" (${req.params.category}) on event "${event.title}"`
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
        await eventRender.updateEventMessage(discordClient, event);
        const channel = await discordClient.channels.fetch(event.channelId);
        const summary = noShowIds.length > 0 ? noShowIds.map((id) => `<@${id}>`).join(', ') : '*none*';
        await channel.send(`🔒 Event **${event.title}** closed. No-shows: ${summary}`);
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
// "still missing" summary, posted to the event's linked thread right away.
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

    let thread;
    try {
      thread = await client.channels.fetch(event.id);
    } catch {
      thread = null;
    }
    if (!thread || !thread.isThread || !thread.isThread()) {
      return res.status(400).json({ error: 'No Discord thread exists for this event yet — create one from the event message first.' });
    }

    const roleMention = eventRender.findDahaloRole(thread.guild);
    const missingText = missing.map((m) => `**${m.category}** (${m.missing} open)`).join(', ');
    await thread.send(
      `⏰ Reminder for **${event.title}** (${event.time}) — still missing: ${missingText}.${
        roleMention ? ` <@&${roleMention.id}>` : ''
      } *(pinged from the site by ${req.user.username})*`
    );
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

    const { category, weapon, itemIndex } = req.body || {};
    if (!category) return res.status(400).json({ error: 'category is required.' });
    const choice = weapon !== undefined ? { weapon } : { itemIndex };
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
