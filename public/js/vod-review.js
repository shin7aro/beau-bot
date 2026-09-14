/* ─────────────────────────────────────────
   VOD REVIEW (beta) — queue list + live room
   Server side: vod-store.js (data) + vod-ws.js
   (websocket) + the /api/vod/* routes in api.js.

   Two views living in one page (same pattern as
   events.js's list/detail split), switched by a
   `?review=<id>` query param:
     - list view  : the request queue
     - room view  : the actual review — video,
       drawing canvas, timeline, comments

   Anyone logged in can request a review, draw,
   and comment. Only officers/admins can start,
   control playback of, or end one — enforced
   server-side; this file just hides/disables the
   controls that would 403 anyway.
───────────────────────────────────────── */

const VOD_COLORS = ['#ff5c3f', '#f0c419', '#6bab7a', '#5d8fc9', '#9b72c4', '#ffffff'];
const DRAW_TICK_MS = 150;      // how often we repaint the canvas / advance the timeline
const RESYNC_INTERVAL_MS = 4000; // host -> everyone periodic time nudge, covers drift from scrubbing without pausing
const CONTROL_APPLY_GUARD_MS = 400; // ignore our own player events for a moment after we programmatically move it

let ws = null;
let lobbyWs = null;
let lobbyPollTimer = null;

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function api(path, opts) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) { alert(message); return; }
  toast.innerHTML = escapeHtml(message);
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function wsUrl(path) {
  const scheme = location.protocol === 'https:' ? 'wss://' : 'ws://';
  return `${scheme}${location.host}${path}`;
}

function getReviewIdFromUrl() {
  return new URLSearchParams(location.search).get('review');
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  window.SITE_AUTH_READY.then(init);
});

function init() {
  const loading = document.getElementById('vod-loading-view');
  if (!isLoggedIn()) {
    if (loading) loading.style.display = 'none';
    document.getElementById('gate-message').style.display = '';
    return;
  }
  loading.style.display = 'none';

  wireRequestModal();

  const reviewId = getReviewIdFromUrl();
  if (reviewId) {
    document.getElementById('vod-room-view').style.display = '';
    initRoom(reviewId);
  } else {
    document.getElementById('vod-list-view').style.display = '';
    initList();
  }
}

/* ==========================================================
   LIST VIEW
========================================================== */

async function initList() {
  connectLobby();
  await refreshList();
}

async function refreshList() {
  let requests;
  try {
    requests = await api('/api/vod/requests');
  } catch (err) {
    showToast(err.message);
    return;
  }
  renderQueue(requests);
}

function renderQueue(requests) {
  const wrap = document.getElementById('vod-queue');
  const empty = document.getElementById('vod-empty');
  wrap.innerHTML = '';
  if (requests.length === 0) {
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  for (const r of requests) {
    const card = document.createElement('div');
    card.className = `vod-request-card${r.status === 'reviewing' ? ' is-live' : ''}`;

    const statusLabel = { pending: 'Pending', reviewing: 'Live', done: 'Reviewed' }[r.status] || r.status;
    const metaBits = [];
    if (r.status === 'pending') metaBits.push(`Requested by ${escapeHtml(r.requestedByUsername)}`);
    else if (r.status === 'reviewing') metaBits.push(`Reviewing with ${escapeHtml(r.startedByUsername)}`);
    else metaBits.push(`Reviewed by ${escapeHtml(r.startedByUsername || '—')}`);

    let actions = '';
    if (r.status === 'pending') {
      if (isOfficerOrAdmin()) {
        actions += `<button class="btn" data-action="start" data-id="${r.id}">Start review</button>`;
      } else {
        actions += `<span class="vod-request-meta">Waiting for an officer to start it</span>`;
      }
    } else if (r.status === 'reviewing') {
      actions += `<button class="cta-primary" data-action="join" data-id="${r.id}">Join live</button>`;
    } else {
      actions += `<button class="btn" data-action="join" data-id="${r.id}">View replay</button>`;
    }
    if (isOfficerOrAdmin()) {
      actions += `<button class="btn vod-danger-btn" data-action="delete" data-id="${r.id}" data-status="${r.status}">Delete</button>`;
    }

    card.innerHTML = `
      <div class="vod-request-thumb"><img src="https://i.ytimg.com/vi/${escapeHtml(r.videoId)}/mqdefault.jpg" alt="" loading="lazy"></div>
      <div class="vod-request-main">
        <div class="vod-request-title">${escapeHtml(r.title || 'Untitled VOD')}</div>
        <div class="vod-request-meta">
          <span class="vod-status-pill ${r.status}">${statusLabel}</span>
          <span>${metaBits.join(' · ')}</span>
        </div>
      </div>
      <div class="vod-request-actions">${actions}</div>
    `;
    wrap.appendChild(card);
  }

  wrap.querySelectorAll('button[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => handleQueueAction(btn.dataset.action, btn.dataset.id, btn.dataset.status));
  });
}

async function handleQueueAction(action, id, status) {
  if (action === 'join') {
    location.href = `vod-review.html?review=${encodeURIComponent(id)}`;
    return;
  }
  if (action === 'start') {
    try {
      await api(`/api/vod/requests/${id}/start`, { method: 'POST' });
      location.href = `vod-review.html?review=${encodeURIComponent(id)}`;
    } catch (err) {
      showToast(err.message);
    }
    return;
  }
  if (action === 'delete') {
    const msg = status === 'reviewing'
      ? 'This review is currently live — deleting it will end it for everyone watching. Delete it anyway?'
      : 'Delete this VOD request? This can\u2019t be undone.';
    if (!confirm(msg)) return;
    try {
      await api(`/api/vod/requests/${id}`, { method: 'DELETE' });
      showToast('VOD request deleted.');
      refreshList();
    } catch (err) {
      showToast(err.message);
    }
  }
}

function connectLobby() {
  try {
    lobbyWs = new WebSocket(wsUrl('/ws/vod-lobby'));
    lobbyWs.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === 'requests-changed') refreshList();
    });
    lobbyWs.addEventListener('close', startLobbyFallbackPolling);
    lobbyWs.addEventListener('error', startLobbyFallbackPolling);
  } catch {
    startLobbyFallbackPolling();
  }
}

// If websockets can't connect at all (locked-down network, proxy that
// strips Upgrade headers, etc), the list still works — it just refreshes
// on a timer instead of instantly.
function startLobbyFallbackPolling() {
  if (lobbyPollTimer) return;
  lobbyPollTimer = setInterval(refreshList, 15000);
}

function wireRequestModal() {
  const overlay = document.getElementById('vod-request-overlay');
  const openBtn = document.getElementById('new-request-btn');
  const cancelBtn = document.getElementById('vod-request-cancel-btn');
  const submitBtn = document.getElementById('vod-request-submit-btn');
  const urlInput = document.getElementById('vod-request-url');
  const titleInput = document.getElementById('vod-request-title');
  if (!openBtn) return; // room view doesn't have this modal's trigger visible, but overlay markup is shared

  const close = () => { overlay.style.display = 'none'; urlInput.value = ''; titleInput.value = ''; };
  openBtn.addEventListener('click', () => { overlay.style.display = ''; urlInput.focus(); });
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  submitBtn.addEventListener('click', async () => {
    const youtubeUrl = urlInput.value.trim();
    const title = titleInput.value.trim();
    if (!youtubeUrl) { showToast('Paste a YouTube link first.'); return; }
    submitBtn.disabled = true;
    try {
      await api('/api/vod/requests', { method: 'POST', body: JSON.stringify({ youtubeUrl, title }) });
      showToast('VOD request submitted.');
      close();
      refreshList();
    } catch (err) {
      showToast(err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });
}

/* ==========================================================
   ROOM VIEW
========================================================== */

const room = {
  id: null,
  status: null,          // 'pending' | 'reviewing' | 'done'
  videoId: null,
  canControl: false,
  drawings: [],
  comments: [],
  player: null,
  duration: 0,
  applyingRemoteControl: false,
  autoPausedForComment: false,
  activeStroke: null,    // { points: [[x,y],...] } while pointer is down
  color: VOD_COLORS[0],
};

async function initRoom(id) {
  room.id = id;
  document.getElementById('vod-back-btn').addEventListener('click', () => { location.href = 'vod-review.html'; });

  let data;
  try {
    data = await api(`/api/vod/requests/${id}`);
  } catch (err) {
    showToast(err.message);
    location.href = 'vod-review.html';
    return;
  }

  room.status = data.status;
  room.videoId = data.videoId;
  room.drawings = data.drawings || [];
  room.comments = data.comments || [];

  document.getElementById('vod-room-title').textContent = data.title || 'Untitled VOD';
  setRoomStatusBadge(data.status);

  if (data.status === 'pending') {
    showToast('This review hasn\u2019t started yet.');
    location.href = 'vod-review.html';
    return;
  }

  wireToolbar();
  wireTimeline();
  wireCommentComposer();
  wirePresencePopover();
  loadYouTubeApi(() => createPlayer(data.videoId));

  if (data.status === 'reviewing') {
    connectRoomSocket(id);
  } else {
    // finished review: read-only replay, no websocket needed, so there's no
    // live presence to track — just hide that indicator entirely.
    room.canControl = false;
    setComposerEnabled(false);
    document.getElementById('vod-draw-hint').textContent = 'This review has ended — you can still scrub through and read what was flagged.';
    document.getElementById('vod-end-review-btn').classList.add('vod-ended');
    document.getElementById('vod-presence').style.display = 'none';
    renderCommentList();
  }
}

function setRoomStatusBadge(status) {
  const el = document.getElementById('vod-room-status');
  const label = { reviewing: 'Live', done: 'Ended', pending: 'Pending' }[status] || status;
  el.innerHTML = `<span class="vod-status-pill ${status}">${label}</span>`;
}

// Hover shows the "who's watching" popover on desktop for free (see CSS);
// this just adds a tap-to-toggle fallback for touch devices, where :hover
// doesn't really work, plus closes it when you tap elsewhere.
function wirePresencePopover() {
  const presence = document.getElementById('vod-presence');
  presence.addEventListener('click', (e) => {
    e.stopPropagation();
    presence.classList.toggle('is-open');
  });
  document.addEventListener('click', () => presence.classList.remove('is-open'));
}

function loadYouTubeApi(onReady) {
  if (window.YT && window.YT.Player) { onReady(); return; }
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { if (prev) prev(); onReady(); };
  if (!document.getElementById('vod-yt-api-script')) {
    const tag = document.createElement('script');
    tag.id = 'vod-yt-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
}

function createPlayer(videoId) {
  room.player = new YT.Player('vod-yt-player', {
    videoId,
    // controls: 0 hides YouTube's own play/pause/seek bar entirely — we
    // draw our own play button + timeline below instead, driven through
    // the IFrame API either way. (YouTube's small logo/title on hover is
    // baked into the embed and can't be removed — that's the one thing
    // that isn't actually a "control".)
    playerVars: { rel: 0, modestbranding: 1, playsinline: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3 },
    events: {
      onReady: () => {
        room.duration = room.player.getDuration() || 0;
        document.getElementById('vod-time-duration').textContent = formatTime(room.duration);
        renderTimelineMarks();
        startTicking();
      },
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerStateChange(evt) {
  if (!room.canControl || room.status !== 'reviewing') return;
  if (room.applyingRemoteControl) return; // this state change is US applying someone else's command — don't echo it back

  if (evt.data === YT.PlayerState.PLAYING) {
    sendWs({ type: 'control', action: 'play', time: room.player.getCurrentTime() });
  } else if (evt.data === YT.PlayerState.PAUSED) {
    sendWs({ type: 'control', action: 'pause', time: room.player.getCurrentTime() });
  }
}

function applyRemoteControl({ action, time, playing }) {
  if (!room.player || typeof room.player.seekTo !== 'function') return;
  room.applyingRemoteControl = true;
  const current = room.player.getCurrentTime ? room.player.getCurrentTime() : 0;
  if (action === 'seek' || Math.abs(current - time) > 1) {
    room.player.seekTo(time, true);
  }
  if (playing) room.player.playVideo(); else room.player.pauseVideo();
  setTimeout(() => { room.applyingRemoteControl = false; }, CONTROL_APPLY_GUARD_MS);
}

// Host-side periodic nudge so followers stay aligned even through a scrub
// that doesn't cross a play/pause boundary (YouTube's API has no discrete
// "seek" event to hook, so play/pause + this heartbeat covers it).
setInterval(() => {
  if (!room.canControl || room.status !== 'reviewing' || !room.player) return;
  if (typeof room.player.getPlayerState !== 'function') return;
  if (room.player.getPlayerState() !== YT.PlayerState.PLAYING) return;
  sendWs({ type: 'control', action: 'seek', time: room.player.getCurrentTime() });
}, RESYNC_INTERVAL_MS);

/* ---------- websocket (live rooms only) ---------- */

function connectRoomSocket(id) {
  ws = new WebSocket(wsUrl(`/ws/vod/${encodeURIComponent(id)}`));
  ws.addEventListener('message', (evt) => handleRoomMessage(JSON.parse(evt.data)));
  ws.addEventListener('close', () => {
    if (room.status === 'reviewing') showToast('Lost the live connection — reload to rejoin.');
  });
  ws.addEventListener('error', () => {});
}

function sendWs(payload) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
}

function handleRoomMessage(msg) {
  switch (msg.type) {
    case 'sync': {
      room.drawings = msg.drawings || [];
      room.comments = msg.comments || [];
      room.canControl = !!(msg.you && msg.you.canControl);
      renderCommentList();
      renderTimelineMarks();
      setComposerEnabled(true);
      renderPresence(msg);
      // #vod-end-review-btn's visibility is handled by the same .officer-only
      // class/CSS every other officer-gated control on the site uses (see
      // auth.js's renderAuthControl) — canControl here is just the same
      // role check, so there's nothing extra to toggle.
      if (msg.playback && (msg.playback.playing || msg.playback.time > 0)) {
        applyRemoteControl({ action: 'seek', time: msg.playback.time, playing: msg.playback.playing });
      }
      break;
    }
    case 'presence':
      renderPresence(msg);
      break;
    case 'draw':
      room.drawings.push(msg.drawing);
      renderTimelineMarks();
      break;
    case 'comment':
      room.comments.push(msg.comment);
      renderCommentList();
      renderTimelineMarks();
      break;
    case 'control':
      applyRemoteControl(msg);
      break;
    case 'ended':
      room.status = 'done';
      room.canControl = false;
      setRoomStatusBadge('done');
      setComposerEnabled(false);
      document.getElementById('vod-end-review-btn').classList.add('vod-ended');
      document.getElementById('vod-presence').style.display = 'none';
      document.getElementById('vod-draw-hint').textContent = 'This review just ended — you can still scrub through and read what was flagged.';
      showToast('This review has ended.');
      if (ws) { ws.close(); ws = null; }
      break;
    case 'deleted':
      showToast('This VOD request was deleted.');
      if (ws) { ws.close(); ws = null; }
      location.href = 'vod-review.html';
      break;
    case 'error':
      showToast(msg.message);
      break;
  }
}

// Updates both the "N watching" count and the hover popover listing who —
// used by both the initial `sync` payload and every later `presence` ping.
function renderPresence({ count, users }) {
  document.getElementById('vod-presence-count').textContent = `${count} watching`;
  const popover = document.getElementById('vod-presence-popover');
  if (!users || users.length === 0) {
    popover.innerHTML = '<div class="vod-presence-empty">Nobody else here yet</div>';
    return;
  }
  popover.innerHTML = users.map((u) => `
    <div class="vod-presence-user">
      <span>${escapeHtml(u.username)}</span>
      ${u.role === 'officer' || u.role === 'admin' ? `<span class="vod-presence-user-role">${escapeHtml(u.role)}</span>` : ''}
    </div>
  `).join('');
}

/* ---------- ticking: timeline, active-drawing overlay, active comment ---------- */

function startTicking() {
  setInterval(() => {
    if (!room.player || typeof room.player.getCurrentTime !== 'function') return;
    const t = room.player.getCurrentTime();
    document.getElementById('vod-time-current').textContent = formatTime(t);
    document.getElementById('vod-comment-ts-badge').textContent = formatTime(t);
    if (room.duration > 0) {
      const pct = Math.min(100, (t / room.duration) * 100);
      document.getElementById('vod-timeline-fill').style.width = `${pct}%`;
      document.getElementById('vod-timeline-scrubber').style.left = `${pct}%`;
    }
    redrawCanvas(t);
    highlightActiveComment(t);
    updatePlayButton();
  }, DRAW_TICK_MS);
}

function highlightActiveComment(t) {
  document.querySelectorAll('.vod-comment-item').forEach((el) => {
    const ts = Number(el.dataset.ts);
    el.classList.toggle('is-active', Math.abs(ts - t) < 1.5);
  });
}

// Whether THIS client is allowed to actually move the shared playhead:
// always true once a review is done (private replay, nothing to keep in
// sync), and while it's live, only for the officer/admin driving it —
// otherwise everyone's view would be fighting for control of one stream.
function canOperatePlayer() {
  return room.status === 'done' || (room.status === 'reviewing' && room.canControl);
}

function updatePlayButton() {
  const btn = document.getElementById('vod-play-btn');
  const icon = document.getElementById('vod-play-icon');
  const track = document.getElementById('vod-timeline-track');
  const note = document.getElementById('vod-timeline-note');
  if (!btn || !room.player || typeof room.player.getPlayerState !== 'function') return;

  const allowed = canOperatePlayer();
  btn.disabled = !allowed;
  track.classList.toggle('is-locked', !allowed);
  note.textContent = allowed ? '' : 'Only the reviewing officer/admin controls playback';

  const isPlaying = room.player.getPlayerState() === YT.PlayerState.PLAYING;
  icon.innerHTML = isPlaying
    ? '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'   // pause glyph
    : '<path d="M8 5v14l11-7z"/>';                // play glyph
  btn.title = isPlaying ? 'Pause' : 'Play';
}

/* ---------- drawing canvas ---------- */

// The video needs to keep a true 16:9 shape no matter what odd size the
// column ends up being (narrow sidebar, short viewport, mobile, etc), but
// it must NEVER just claim however much height it wants — that's exactly
// what was pushing the toolbar/timeline off-screen before. So `.vod-player-
// wrap` gets whatever space is left after the toolbar+timeline (flex
// handles that), and this only ever shrinks the video to fit inside
// whatever that turns out to be, letterboxing with the wrap's own black
// background rather than overflowing it.
function layoutPlayerFrame() {
  const wrap = document.getElementById('vod-player-wrap');
  const frame = document.getElementById('vod-player-frame');
  const canvas = document.getElementById('vod-draw-canvas');
  if (!wrap || !frame) return;
  const rect = wrap.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  let width = rect.width;
  let height = width * 9 / 16;
  if (height > rect.height) {
    height = rect.height;
    width = height * 16 / 9;
  }
  frame.style.width = `${Math.round(width)}px`;
  frame.style.height = `${Math.round(height)}px`;
  if (canvas) {
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
  }
}

function wireToolbar() {
  const swatchWrap = document.getElementById('vod-color-swatches');
  VOD_COLORS.forEach((color, i) => {
    const btn = document.createElement('button');
    btn.className = `vod-color-swatch${i === 0 ? ' active' : ''}`;
    btn.style.background = color;
    btn.addEventListener('click', () => {
      room.color = color;
      swatchWrap.querySelectorAll('.vod-color-swatch').forEach((el) => el.classList.remove('active'));
      btn.classList.add('active');
    });
    swatchWrap.appendChild(btn);
  });

  const widthRange = document.getElementById('vod-width-range');
  const holdRange = document.getElementById('vod-hold-range');
  const holdValue = document.getElementById('vod-hold-value');
  holdRange.addEventListener('input', () => { holdValue.textContent = `${Number(holdRange.value).toFixed(1)}s`; });

  document.getElementById('vod-clear-local-btn').addEventListener('click', () => {
    const canvas = document.getElementById('vod-draw-canvas');
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  });

  const canvas = document.getElementById('vod-draw-canvas');
  const hint = document.getElementById('vod-draw-hint');
  layoutPlayerFrame();
  window.addEventListener('resize', layoutPlayerFrame);
  new ResizeObserver(layoutPlayerFrame).observe(document.getElementById('vod-player-wrap'));

  canvas.addEventListener('pointerdown', (e) => {
    if (!canDraw()) return;
    hint.classList.add('hide');
    const p = pointFromEvent(e, canvas);
    room.activeStroke = { points: [p] };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!room.activeStroke) return;
    room.activeStroke.points.push(pointFromEvent(e, canvas));
  });
  canvas.addEventListener('pointerup', () => finishStroke(Number(widthRange.value), Number(holdRange.value)));
  canvas.addEventListener('pointercancel', () => { room.activeStroke = null; });
}

function canDraw() {
  return room.status === 'reviewing' && (ws && ws.readyState === WebSocket.OPEN);
}

function pointFromEvent(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  return [
    Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
    Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
  ];
}

function finishStroke(width, hold) {
  if (!room.activeStroke || room.activeStroke.points.length < 2) { room.activeStroke = null; return; }
  const points = room.activeStroke.points;
  room.activeStroke = null;
  const timestamp = room.player && room.player.getCurrentTime ? room.player.getCurrentTime() : 0;
  sendWs({ type: 'draw', timestamp, color: room.color, width, hold, points });
}

function strokePath(ctx, canvas, points, color, width) {
  if (points.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0][0] * canvas.width, points[0][1] * canvas.height);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0] * canvas.width, points[i][1] * canvas.height);
  ctx.stroke();
}

function redrawCanvas(currentTime) {
  const canvas = document.getElementById('vod-draw-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const d of room.drawings) {
    const elapsed = currentTime - d.timestamp;
    if (elapsed < 0 || elapsed > d.hold) continue;
    // fade out over the last 25% of the hold window instead of popping off abruptly
    const fadeStart = d.hold * 0.75;
    const opacity = elapsed > fadeStart ? Math.max(0, 1 - (elapsed - fadeStart) / (d.hold - fadeStart)) : 1;
    ctx.globalAlpha = opacity;
    strokePath(ctx, canvas, d.points, d.color, d.width);
  }
  ctx.globalAlpha = 1;

  if (room.activeStroke) strokePath(ctx, canvas, room.activeStroke.points, room.color, Number(document.getElementById('vod-width-range').value));
}

/* ---------- timeline ---------- */

function wireTimeline() {
  const track = document.getElementById('vod-timeline-track');
  track.addEventListener('click', (e) => {
    if (room.duration <= 0 || !canOperatePlayer()) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const time = pct * room.duration;
    seekPlayer(time);
  });

  document.getElementById('vod-play-btn').addEventListener('click', () => {
    if (!canOperatePlayer() || !room.player || typeof room.player.getPlayerState !== 'function') return;
    if (room.player.getPlayerState() === YT.PlayerState.PLAYING) room.player.pauseVideo();
    else room.player.playVideo();
  });
}

// Shared by the timeline click and the comment-timestamp click: moves the
// local player, and — only when we're actually allowed to drive playback —
// tells everyone else where to jump to as well.
function seekPlayer(time) {
  if (!room.player) return;
  room.player.seekTo(time, true);
  if (room.status === 'reviewing' && room.canControl) {
    sendWs({ type: 'control', action: 'seek', time, playing: room.player.getPlayerState() === YT.PlayerState.PLAYING });
  }
}

function renderTimelineMarks() {
  const wrap = document.getElementById('vod-timeline-marks');
  if (room.duration <= 0) return;
  wrap.innerHTML = '';
  for (const c of room.comments) {
    const pct = Math.min(100, (c.timestamp / room.duration) * 100);
    const el = document.createElement('div');
    el.className = 'vod-timeline-mark mark-comment';
    el.style.left = `${pct}%`;
    el.title = `Comment at ${formatTime(c.timestamp)}`;
    wrap.appendChild(el);
  }
  for (const d of room.drawings) {
    const pct = Math.min(100, (d.timestamp / room.duration) * 100);
    const el = document.createElement('div');
    el.className = 'vod-timeline-mark mark-drawing';
    el.style.left = `${pct}%`;
    el.title = `Drawing at ${formatTime(d.timestamp)}`;
    wrap.appendChild(el);
  }
}

/* ---------- comments ---------- */

function wireCommentComposer() {
  const input = document.getElementById('vod-comment-input');
  const pauseToggle = document.getElementById('vod-pause-on-comment');
  const sendBtn = document.getElementById('vod-comment-send-btn');

  input.addEventListener('focus', () => {
    if (!pauseToggle.checked || !room.player || typeof room.player.getPlayerState !== 'function') return;
    if (room.player.getPlayerState() === YT.PlayerState.PLAYING) {
      room.player.pauseVideo();
      room.autoPausedForComment = true;
    }
  });

  function resumeIfAutoPaused() {
    if (room.autoPausedForComment && room.player) {
      room.player.playVideo();
      room.autoPausedForComment = false;
    }
  }
  input.addEventListener('blur', () => { if (!input.value.trim()) resumeIfAutoPaused(); });

  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    if (!canDraw()) { showToast('Comments need a live connection.'); return; }
    const timestamp = room.player && room.player.getCurrentTime ? room.player.getCurrentTime() : 0;
    sendWs({ type: 'comment', timestamp, text });
    input.value = '';
    resumeIfAutoPaused();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendBtn.click(); }
  });

  document.getElementById('vod-end-review-btn').addEventListener('click', async () => {
    if (!confirm('End this review for everyone?')) return;
    try {
      await api(`/api/vod/requests/${room.id}/end`, { method: 'POST' });
    } catch (err) {
      showToast(err.message);
    }
  });

  document.getElementById('vod-delete-review-btn').addEventListener('click', async () => {
    const msg = room.status === 'reviewing'
      ? 'This review is currently live — deleting it will end it for everyone watching. Delete it anyway?'
      : 'Delete this VOD request? This can\u2019t be undone.';
    if (!confirm(msg)) return;
    try {
      await api(`/api/vod/requests/${room.id}`, { method: 'DELETE' });
      showToast('VOD request deleted.');
      location.href = 'vod-review.html';
    } catch (err) {
      showToast(err.message);
    }
  });
}

function setComposerEnabled(enabled) {
  document.getElementById('vod-comment-input').disabled = !enabled;
  document.getElementById('vod-comment-send-btn').disabled = !enabled;
  const canvas = document.getElementById('vod-draw-canvas');
  canvas.style.pointerEvents = enabled && room.status === 'reviewing' ? 'auto' : 'none';
  document.getElementById('vod-toolbar').style.opacity = enabled && room.status === 'reviewing' ? '1' : '0.5';
}

function renderCommentList() {
  const list = document.getElementById('vod-comment-list');
  const empty = document.getElementById('vod-comment-empty');
  const sorted = [...room.comments].sort((a, b) => a.timestamp - b.timestamp);
  document.getElementById('vod-comment-count').textContent = `${sorted.length} comment${sorted.length === 1 ? '' : 's'}`;

  if (sorted.length === 0) {
    list.innerHTML = '';
    list.appendChild(empty);
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = sorted.map((c) => `
    <div class="vod-comment-item" data-ts="${c.timestamp}">
      <div class="vod-comment-item-head">
        <span class="vod-comment-author">${escapeHtml(c.authorUsername)}</span>
        <span class="vod-comment-ts" data-seek="${c.timestamp}">${formatTime(c.timestamp)}</span>
      </div>
      <div class="vod-comment-text">${escapeHtml(c.text)}</div>
    </div>
  `).join('');

  list.querySelectorAll('.vod-comment-ts').forEach((el) => {
    el.addEventListener('click', () => {
      if (!canOperatePlayer()) return;
      seekPlayer(Number(el.dataset.seek));
    });
  });
}
