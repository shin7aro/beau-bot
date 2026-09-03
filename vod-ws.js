// vod-ws.js
// WebSocket layer for the VOD Review tool. Two kinds of connections, both
// hung off the same HTTP server api.js/index.js already run (see attach()):
//
//   /ws/vod-lobby      — every open vod-review.html tab joins this. Used
//                         only to tell tabs "the request list changed, go
//                         refetch" (new request, review started/ended,
//                         request deleted) — no drawing/comment traffic.
//
//   /ws/vod/:requestId — one room per VOD under active review. This is the
//                         actual "live" part: playback control, drawings,
//                         and comments are broadcast to everyone connected
//                         to that room in real time, and persisted via
//                         vod-store.js so a client that joins mid-review
//                         (or reloads) can catch up via the initial `sync`
//                         message.
//
// Auth reuses the site's existing session cookie (see web-auth.js) — a
// WebSocket upgrade request still carries cookies, we just have to parse
// the Cookie header ourselves since cookie-parser only runs as Express
// middleware, not on the raw upgrade request. Nothing here trusts anything
// the client claims about its own identity or role — same JWT the REST API
// verifies.

const { WebSocketServer } = require('ws');
const auth = require('./web-auth');
const vodStore = require('./vod-store');

const HEARTBEAT_INTERVAL_MS = 30000;

// requestId -> { clients: Map<ws, {id, username, role}>, playback, status }
const rooms = new Map();

function parseCookieHeader(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(part.slice(eq + 1).trim());
    } catch {
      out[key] = part.slice(eq + 1).trim();
    }
  }
  return out;
}

// Mirrors web-auth.js's attachUser, just adapted for a raw http.IncomingMessage
// (upgrade request) instead of an Express req that's already been through
// cookie-parser.
function sessionFromRequest(req) {
  const cookies = parseCookieHeader(req.headers.cookie);
  return auth.readSession({ cookies }); // { id, username, avatar, role } or null
}

function send(ws, payload) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
}

function isOfficerOrAdmin(session) {
  return !!session && (session.role === 'officer' || session.role === 'admin');
}

// ---------- lobby ----------

const lobbyClients = new Set();

function broadcastLobbyChanged() {
  const msg = JSON.stringify({ type: 'requests-changed' });
  for (const ws of lobbyClients) {
    if (ws.readyState === ws.OPEN) ws.send(msg);
  }
}

function handleLobbyConnection(ws) {
  lobbyClients.add(ws);
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  ws.on('close', () => lobbyClients.delete(ws));
  ws.on('error', () => lobbyClients.delete(ws));
}

// ---------- review rooms ----------

function getOrCreateRoom(requestId, request) {
  let room = rooms.get(requestId);
  if (!room) {
    room = {
      clients: new Map(), // ws -> { id, username, role }
      playback: { playing: false, time: 0, updatedAt: Date.now() },
      status: request.status,
    };
    rooms.set(requestId, room);
  }
  return room;
}

function presenceList(room) {
  const byUser = new Map();
  for (const info of room.clients.values()) {
    byUser.set(info.id, { id: info.id, username: info.username, role: info.role });
  }
  const users = [...byUser.values()];
  return { count: users.length, users };
}

function broadcastRoom(requestId, payload, { exclude } = {}) {
  const room = rooms.get(requestId);
  if (!room) return;
  const msg = JSON.stringify(payload);
  for (const ws of room.clients.keys()) {
    if (ws === exclude) continue;
    if (ws.readyState === ws.OPEN) ws.send(msg);
  }
}

function broadcastPresence(requestId) {
  const room = rooms.get(requestId);
  if (!room) return;
  broadcastRoom(requestId, { type: 'presence', ...presenceList(room) });
}

// Called by api.js right after a REST call changes a request's lifecycle,
// so anyone already connected to that room finds out immediately instead
// of waiting on a poll. `patch` is merged into the room's tracked status.
function notifyRoomLifecycle(requestId, type, patch = {}) {
  const room = rooms.get(requestId);
  if (room && patch.status) room.status = patch.status;
  broadcastRoom(requestId, { type, ...patch });
}

async function handleRoomConnection(ws, requestId, session) {
  const request = await vodStore.getRequest(requestId);
  if (!request) {
    ws.close(4404, 'VOD request not found');
    return;
  }
  if (request.status !== 'reviewing') {
    ws.close(4409, 'This review is not currently live');
    return;
  }

  const room = getOrCreateRoom(requestId, request);
  room.status = 'reviewing';
  room.clients.set(ws, { id: session.id, username: session.username, role: session.role });
  ws.isAlive = true;
  ws.vodRequestId = requestId;

  const reviewData = await vodStore.getReviewData(requestId);
  send(ws, {
    type: 'sync',
    request: { id: request.id, title: request.title, videoId: request.videoId, status: request.status },
    drawings: reviewData.drawings,
    comments: reviewData.comments,
    playback: room.playback,
    ...presenceList(room),
    you: { id: session.id, username: session.username, role: session.role, canControl: isOfficerOrAdmin(session) },
  });
  broadcastPresence(requestId);

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (!msg || typeof msg.type !== 'string') return;

    // Room may have ended between messages — re-check the live cache
    // rather than trusting whatever `room.status` was at connect time.
    if (room.status !== 'reviewing') {
      send(ws, { type: 'error', message: 'This review has ended.' });
      return;
    }

    if (msg.type === 'draw') {
      const { drawing, error } = await vodStore.addDrawing(requestId, {
        authorId: session.id,
        authorUsername: session.username,
        timestamp: msg.timestamp,
        color: msg.color,
        width: msg.width,
        hold: msg.hold,
        points: msg.points,
      });
      if (error) return send(ws, { type: 'error', message: 'Could not save that drawing.' });
      broadcastRoom(requestId, { type: 'draw', drawing });
      return;
    }

    if (msg.type === 'comment') {
      const { comment, error } = await vodStore.addComment(requestId, {
        authorId: session.id,
        authorUsername: session.username,
        timestamp: msg.timestamp,
        text: msg.text,
      });
      if (error) return send(ws, { type: 'error', message: 'Comment can\u2019t be empty.' });
      broadcastRoom(requestId, { type: 'comment', comment });
      return;
    }

    if (msg.type === 'control') {
      if (!isOfficerOrAdmin(session)) {
        return send(ws, { type: 'error', message: 'Only officers/admins can control playback.' });
      }
      if (!['play', 'pause', 'seek'].includes(msg.action)) return;
      room.playback = {
        playing: msg.action === 'pause' ? false : msg.action === 'play' ? true : room.playback.playing,
        time: Number.isFinite(msg.time) ? Math.max(0, msg.time) : room.playback.time,
        updatedAt: Date.now(),
      };
      broadcastRoom(requestId, {
        type: 'control',
        action: msg.action,
        time: room.playback.time,
        playing: room.playback.playing,
        by: { id: session.id, username: session.username },
      }, { exclude: ws });
      return;
    }
  });

  const cleanup = () => {
    room.clients.delete(ws);
    if (room.clients.size === 0) rooms.delete(requestId);
    else broadcastPresence(requestId);
  };
  ws.on('close', cleanup);
  ws.on('error', cleanup);
}

// ---------- wiring ----------

function attach(server) {
  const lobbyWss = new WebSocketServer({ noServer: true });
  const roomWss = new WebSocketServer({ noServer: true });

  lobbyWss.on('connection', handleLobbyConnection);
  roomWss.on('connection', (ws, req, requestId, session) => {
    handleRoomConnection(ws, requestId, session).catch((err) => {
      console.error('vod-ws room connection error:', err);
      try { ws.close(1011, 'Internal error'); } catch {}
    });
  });

  server.on('upgrade', (req, socket, head) => {
    let pathname;
    try {
      pathname = new URL(req.url, 'http://internal').pathname;
    } catch {
      socket.destroy();
      return;
    }

    if (pathname === '/ws/vod-lobby') {
      const session = sessionFromRequest(req);
      if (!session) { socket.destroy(); return; }
      lobbyWss.handleUpgrade(req, socket, head, (ws) => lobbyWss.emit('connection', ws, req));
      return;
    }

    const match = pathname.match(/^\/ws\/vod\/([^/]+)$/);
    if (match) {
      const session = sessionFromRequest(req);
      if (!session) { socket.destroy(); return; }
      const requestId = decodeURIComponent(match[1]);
      roomWss.handleUpgrade(req, socket, head, (ws) => roomWss.emit('connection', ws, req, requestId, session));
      return;
    }

    // Not a path this module owns — leave the socket alone in case some
    // other upgrade handler wants it, rather than destroying it out from
    // under a future feature.
  });

  // Heartbeat: drop sockets that stopped answering pings (closed laptop
  // lid, dead wifi, etc) so presence counts and room membership don't
  // silently rot. Applies to both lobby and room connections.
  const interval = setInterval(() => {
    for (const wss of [lobbyWss, roomWss]) {
      for (const ws of wss.clients) {
        if (ws.isAlive === false) { ws.terminate(); continue; }
        ws.isAlive = false;
        try { ws.ping(); } catch {}
      }
    }
  }, HEARTBEAT_INTERVAL_MS);
  server.on('close', () => clearInterval(interval));
}

module.exports = {
  attach,
  broadcastLobbyChanged,
  notifyRoomLifecycle,
};
