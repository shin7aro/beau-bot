// vod-store.js
// Shared storage + mutation logic for the VOD Review tool — same pattern as
// events-store.js / loot-store.js. Pure data only; no discord.js and no
// websocket code here (that lives in vod-ws.js). Both api.js and vod-ws.js
// require this so a request created/started/annotated from either side is
// always working against the exact same data.
//
// BETA NOTE: this whole feature is currently only linked from the officer/
// admin profile dropdown (see public/js/auth.js) while it's being tried
// out — the permission model below (any member can request/annotate/
// comment, only officer/admin can start/end/delete a review) is the real,
// intended shape for when it opens up to everyone, not a placeholder.

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'vod-review.json'); // local fallback path only
const REDIS_KEY = 'vod_review';

const STATUSES = ['pending', 'reviewing', 'done'];

// Same lazy-load-once-then-mutate-in-place caching pattern as
// events-store.js — see the comment there for why. Keeps api.js and
// vod-ws.js (both requiring this module) looking at the exact same object.
let cached = null;
let loadingPromise = null;

function emptyDb() {
  return { requests: {}, reviews: {} };
}

async function loadDb() {
  if (cached) return cached;
  if (!loadingPromise) {
    loadingPromise = storage.loadJSON(REDIS_KEY, DB_PATH).then((data) => {
      cached = { ...emptyDb(), ...data };
      cached.requests = cached.requests || {};
      cached.reviews = cached.reviews || {};
      return cached;
    });
  }
  return loadingPromise;
}

async function saveDb(db) {
  cached = db;
  await storage.saveJSON(REDIS_KEY, DB_PATH, db);
}

function newId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- YouTube URL handling ----------

// Accepts watch?v=, youtu.be/, embed/, shorts/, and live/ links, with or
// without extra query params (timestamps, playlist, etc). Returns null for
// anything that isn't recognizably a YouTube video link.
function extractYouTubeId(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl || '').trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
  const idFromPath = (prefix) => {
    const i = url.pathname.indexOf(prefix);
    if (i === -1) return null;
    const rest = url.pathname.slice(i + prefix.length).split('/')[0];
    return rest || null;
  };

  let id = null;
  if (host === 'youtu.be') {
    id = url.pathname.slice(1).split('/')[0] || null;
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v');
    else if (url.pathname.startsWith('/embed/')) id = idFromPath('/embed/');
    else if (url.pathname.startsWith('/shorts/')) id = idFromPath('/shorts/');
    else if (url.pathname.startsWith('/live/')) id = idFromPath('/live/');
  }
  if (!id) return null;
  // Real YouTube video IDs are 11 chars of [A-Za-z0-9_-]; guards against a
  // junk/partial match slipping through as a "valid" id.
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

// ---------- requests ----------

async function listRequests() {
  const db = await loadDb();
  return Object.values(db.requests).sort((a, b) => {
    // Live reviews first, then pending (oldest first, front of the queue),
    // then finished ones (most recent first).
    const rank = { reviewing: 0, pending: 1, done: 2 };
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    return a.status === 'done' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
  });
}

async function getRequest(id) {
  const db = await loadDb();
  return db.requests[id] || null;
}

async function createRequest({ youtubeUrl, title, userId, username }) {
  const videoId = extractYouTubeId(youtubeUrl);
  if (!videoId) return { error: 'invalid_youtube_url' };

  const db = await loadDb();
  const id = newId();
  const request = {
    id,
    youtubeUrl: String(youtubeUrl).trim(),
    videoId,
    title: String(title || '').trim().slice(0, 140) || null,
    requestedById: userId,
    requestedByUsername: username,
    status: 'pending',
    createdAt: Date.now(),
    startedById: null,
    startedByUsername: null,
    startedAt: null,
    endedAt: null,
  };
  db.requests[id] = request;
  db.reviews[id] = { drawings: [], comments: [] };
  await saveDb(db);
  return { request };
}

async function startReview(id, { userId, username }) {
  const db = await loadDb();
  const request = db.requests[id];
  if (!request) return { error: 'not_found' };
  if (request.status !== 'pending') return { error: 'not_pending' };
  request.status = 'reviewing';
  request.startedById = userId;
  request.startedByUsername = username;
  request.startedAt = Date.now();
  await saveDb(db);
  return { request };
}

async function endReview(id) {
  const db = await loadDb();
  const request = db.requests[id];
  if (!request) return { error: 'not_found' };
  if (request.status !== 'reviewing') return { error: 'not_reviewing' };
  request.status = 'done';
  request.endedAt = Date.now();
  await saveDb(db);
  return { request };
}

async function deleteRequest(id) {
  const db = await loadDb();
  const request = db.requests[id];
  if (!request) return { error: 'not_found' };
  if (request.status === 'reviewing') return { error: 'in_progress' };
  delete db.requests[id];
  delete db.reviews[id];
  await saveDb(db);
  return { ok: true };
}

// ---------- review data (drawings + comments) ----------

async function getReviewData(id) {
  const db = await loadDb();
  return db.reviews[id] || { drawings: [], comments: [] };
}

// points: [[x0,y0],[x1,y1],...] with x/y normalized 0..1 relative to the
// video frame, so drawings line up correctly no matter what size the video
// player is rendered at for each viewer.
async function addDrawing(id, { authorId, authorUsername, timestamp, color, width, hold, points }) {
  const db = await loadDb();
  if (!db.requests[id]) return { error: 'not_found' };
  const drawing = {
    id: newId(),
    authorId,
    authorUsername,
    timestamp: Math.max(0, Number(timestamp) || 0),
    color: String(color || '#ff5c3f').slice(0, 20),
    width: Math.min(20, Math.max(1, Number(width) || 4)),
    hold: Math.min(15, Math.max(1, Number(hold) || 4)),
    points: Array.isArray(points)
      ? points
          .filter((p) => Array.isArray(p) && p.length === 2)
          .map(([x, y]) => [Math.min(1, Math.max(0, Number(x) || 0)), Math.min(1, Math.max(0, Number(y) || 0))])
          .slice(0, 2000)
      : [],
    createdAt: Date.now(),
  };
  if (drawing.points.length < 2) return { error: 'empty_drawing' };
  db.reviews[id] = db.reviews[id] || { drawings: [], comments: [] };
  db.reviews[id].drawings.push(drawing);
  await saveDb(db);
  return { drawing };
}

async function addComment(id, { authorId, authorUsername, timestamp, text }) {
  const db = await loadDb();
  if (!db.requests[id]) return { error: 'not_found' };
  const clean = String(text || '').trim().slice(0, 500);
  if (!clean) return { error: 'empty_comment' };
  const comment = {
    id: newId(),
    authorId,
    authorUsername,
    timestamp: Math.max(0, Number(timestamp) || 0),
    text: clean,
    createdAt: Date.now(),
  };
  db.reviews[id] = db.reviews[id] || { drawings: [], comments: [] };
  db.reviews[id].comments.push(comment);
  await saveDb(db);
  return { comment };
}

module.exports = {
  DB_PATH,
  REDIS_KEY,
  STATUSES,
  extractYouTubeId,
  listRequests,
  getRequest,
  createRequest,
  startReview,
  endReview,
  deleteRequest,
  getReviewData,
  addDrawing,
  addComment,
};
