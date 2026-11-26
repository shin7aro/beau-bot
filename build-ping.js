// build-ping.js
// When a member picks a role on an open event, Beau posts their build card
// in the event's thread (pinging them). If they change role, leave, or are
// removed, the old message is deleted and — when there's a new role with a
// linked build — replaced by a fresh one. Members can opt out from the site's
// profile dropdown (see user-prefs-store.js).
//
// How it works: instead of hooking every sign-up/leave path (Discord buttons,
// selects, the thread "@Beau @player role" command, and the site's assign
// routes all exist), this runs after EVERY saveEvents() (see
// events-store.onSaved) and diffs "who should have a build message right now"
// against "who does" (event.buildPings, persisted with the event). Whatever
// differs is fixed. Runs are queued one at a time so two quick saves can't
// post duplicates.
//
// event.buildPings = { [userId]: { sig, messageId } }

const eventsStore = require('./events-store');
const buildsStore = require('./builds-store');
const userPrefs = require('./user-prefs-store');

let ctx = null; // { client, renderBuild }
let chain = Promise.resolve();

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// Where is this user signed up, and does that slot have a linked build?
// Returns null when they aren't signed up at all.
function slotFor(event, userId) {
  for (const [category, cat] of Object.entries(event.categories || {})) {
    if (cat.mode === 'quota') {
      if ((cat.signups || []).some((s) => s.userId === userId)) {
        return { category, slotKey: `${category}:q`, label: null, buildTab: null, buildId: null };
      }
      continue;
    }
    for (let i = 0; i < (cat.items || []).length; i++) {
      const item = cat.items[i];
      if (item.signups[0] !== userId) continue;
      const src = item.options ? item.options[item.signedOptionIndex] : item;
      const buildTab = src && src.buildTab ? src.buildTab : null;
      const buildId = src && src.buildId != null ? src.buildId : null;
      return {
        category,
        slotKey: `${category}:${i}:${item.options ? item.signedOptionIndex : ''}`,
        label: src ? src.name : null,
        buildTab,
        buildId,
      };
    }
  }
  return null;
}

function isOpen(event) {
  return event && event.categories && !event.closed && !event.cancelled;
}

// Current state of an open event, as { userId: { sig, slot } } for users who
// should have a build message (signed up, slot has a build, not opted out).
function desiredFor(event, allPrefs) {
  const out = {};
  for (const userId of eventsStore.getSignedUpUserIds(event)) {
    if (!userPrefs.resolve(allPrefs, userId).buildPing) continue;
    const slot = slotFor(event, userId);
    if (!slot || !slot.buildTab || slot.buildId == null) continue;
    out[userId] = { sig: `${slot.slotKey}|${slot.buildTab}:${slot.buildId}`, slot };
  }
  return out;
}

async function getThread(eventId) {
  try {
    const ch = await ctx.client.channels.fetch(eventId);
    return ch && ch.isThread && ch.isThread() ? ch : null;
  } catch {
    return null;
  }
}

async function deleteMessage(thread, messageId) {
  if (!thread || !messageId) return;
  try {
    const msg = await thread.messages.fetch(messageId);
    await msg.delete();
  } catch {
    // already gone — fine
  }
}

async function syncOnce() {
  if (!ctx || !ctx.client.isReady || !ctx.client.isReady()) return;
  const events = await eventsStore.loadEvents();
  const allPrefs = await userPrefs.loadAllPrefs();
  let changed = false;

  for (const event of Object.values(events)) {
    if (!isOpen(event)) continue;
    const pings = event.buildPings || {};
    const desired = desiredFor(event, allPrefs);

    const stale = Object.keys(pings).filter((u) => !desired[u] || desired[u].sig !== pings[u].sig);
    const fresh = Object.keys(desired).filter((u) => !pings[u] || desired[u].sig !== pings[u].sig);
    if (stale.length === 0 && fresh.length === 0) {
      if (!event.buildPings) event.buildPings = pings;
      continue;
    }

    const thread = await getThread(event.id);
    if (!thread) continue; // no thread (yet) — a later save will retry

    event.buildPings = pings;

    // 1) delete messages that no longer apply (changed role / left / opted out)
    for (const userId of stale) {
      await deleteMessage(thread, pings[userId].messageId);
      delete pings[userId];
      changed = true;
    }

    // 2) post the new ones
    if (fresh.length > 0) {
      const allBuilds = await buildsStore.loadAllBuilds();
      for (const userId of fresh) {
        const { sig, slot } = desired[userId];
        const build = (allBuilds[slot.buildTab] || [])[slot.buildId];
        if (!build) continue;
        try {
          const payload = await ctx.renderBuild(build, `${slot.buildTab}:${slot.buildId}`);
          const sent = await thread.send({
            content:
              `<@${userId}> you're on **${cap(slot.category)}**` +
              `${slot.label ? ` (${slot.label})` : ''} — here's your build:\n` +
              `-# Don't need these? Turn off "Build pings" in the profile menu on the website.`,
            embeds: payload.embeds,
            files: payload.files,
            allowedMentions: { users: [userId] },
          });
          pings[userId] = { sig, messageId: sent.id };
          changed = true;
        } catch (err) {
          console.error('build-ping: failed to post build for', userId, 'in event', event.id, err);
        }
      }
    }
  }

  if (changed) await eventsStore.saveEvents(events, { silent: true });
}

function sync() {
  chain = chain.then(syncOnce).catch((err) => console.error('build-ping sync error:', err));
  return chain;
}

// Events that were already open before this feature shipped: record who is
// signed up right now WITHOUT posting, so deploying doesn't ping everyone.
async function baselineExisting() {
  const events = await eventsStore.loadEvents();
  const allPrefs = await userPrefs.loadAllPrefs();
  let changed = false;
  for (const event of Object.values(events)) {
    if (!isOpen(event) || event.buildPings) continue;
    event.buildPings = {};
    for (const [userId, d] of Object.entries(desiredFor(event, allPrefs))) {
      event.buildPings[userId] = { sig: d.sig, messageId: null };
    }
    changed = true;
  }
  if (changed) await eventsStore.saveEvents(events, { silent: true });
}

// renderBuild(build, "<tab>:<id>") -> { embeds, files }  (index.js's buildAskBuildEmbed)
async function init({ client, renderBuild }) {
  ctx = { client, renderBuild };
  await baselineExisting();
  eventsStore.onSaved(sync);
}

module.exports = { init, sync };
