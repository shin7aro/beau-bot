/* ─────────────────────────────────────────
   EVENTS — public sign-up page
   Reads/writes the same `events` data the
   Discord bot's /event commands use (see
   events-store.js / event-render.js on the
   server). Viewing is open to everyone;
   signing up needs a Discord login; creating,
   editing, closing, refreshing, and pinging
   are officer/admin only.
───────────────────────────────────────── */

const EVENT_ROLE_ORDER = ['Tank', 'Support', 'DPS', 'Healer', 'Battlemount'];
const EVENT_TYPES = ['PVP', 'PVE', 'Economy'];
const EVENT_TYPE_EMOJI = { PVP: '⚔️', PVE: '🐉', Economy: '💰' };

// Same tier dicts as profile.js's "Field Dossier" — kept as a separate
// small copy here (rather than a shared import) since this file has no
// module system, just like item-map.js's server-side duplicate.
const EVENT_TIER_LABELS = { gm: 'Guild Master', right_hand: 'Right Hand', officer: 'Officer', member: 'Dahalo' };
const EVENT_TIER_RING_CLASS = { gm: 'ring-gold', right_hand: 'ring-silver', officer: 'ring-bronze', member: 'ring-member' };
const EVENT_TIER_TEXT_CLASS = { gm: 'tier-gold', right_hand: 'tier-silver', officer: 'tier-bronze', member: 'tier-member' };

let allEvents = [];        // list summaries from GET /api/events
let typeFilter = 'all';
let searchStr = '';
let showClosed = false;    // closed events are hidden by default; toggled via #toggle-closed-btn
let currentDetail = null;  // full detail object from GET /api/events/:id
let channelsCache = null;  // officer only, lazy-loaded
let compOptionsCache = null; // officer only, lazy-loaded
let allBuildsCache = null;      // public, lazy-loaded — full builds by tab, for the details panel
let buildLinkOptionsCache = null; // officer only, lazy-loaded — flat [{tab,index,role,weapon}] for the "link a build" picker
let dahaloMembersCache = null; // officer only, lazy-loaded — [{id,username,avatar}] for the "assign a player" picker
let formCompSource = 'comp'; // 'comp' | 'manual', for the create/edit form

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
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  window.SITE_AUTH_READY.then(init);
});

async function init() {
  if (!isLoggedIn()) {
    document.getElementById('gate-message').style.display = '';
    return;
  }
  document.getElementById('events-list-view').style.display = '';

  wireListControls();
  wireModalOverlay();
  document.getElementById('event-back-btn').addEventListener('click', closeDetail);
  document.getElementById('new-event-btn').addEventListener('click', () => openEventForm('create'));

  await loadEvents();

  const hashId = location.hash.startsWith('#e/') ? location.hash.slice(3) : null;
  if (hashId) openEvent(hashId);
}

function wireListControls() {
  const search = document.getElementById('event-search');
  search.addEventListener('input', () => { searchStr = search.value.trim().toLowerCase(); renderList(); });

  document.querySelectorAll('#event-type-filter .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      typeFilter = btn.dataset.type;
      document.querySelectorAll('#event-type-filter .filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderList();
    });
  });

  const toggleClosedBtn = document.getElementById('toggle-closed-btn');
  toggleClosedBtn.addEventListener('click', () => {
    showClosed = !showClosed;
    toggleClosedBtn.textContent = showClosed ? 'Hide closed events' : 'Show closed events';
    toggleClosedBtn.classList.toggle('active', showClosed);
    renderList();
  });
}

/* ---------- list view ---------- */
async function loadEvents() {
  try {
    allEvents = await api('/api/events');
  } catch (err) {
    showToast('Failed to load events: ' + err.message);
    allEvents = [];
  }
  renderList();
}

function renderList() {
  const grid = document.getElementById('event-card-grid');
  const empty = document.getElementById('event-empty');
  const countLabel = document.getElementById('event-count-label');

  let list = allEvents;
  if (!showClosed) list = list.filter(e => !e.closed);
  if (typeFilter !== 'all') list = list.filter(e => e.type === typeFilter);
  if (searchStr) {
    list = list.filter(e =>
      e.title.toLowerCase().includes(searchStr) ||
      (e.compLabel || '').toLowerCase().includes(searchStr) ||
      (e.organizerTag || '').toLowerCase().includes(searchStr)
    );
  }

  countLabel.textContent = `${list.length} event${list.length === 1 ? '' : 's'}`;
  empty.style.display = list.length === 0 ? '' : 'none';

  grid.innerHTML = list.map(e => `
    <div class="event-card${e.closed ? ' is-closed' : ''}" data-id="${escapeHtml(e.id)}">
      <div class="event-card-top">
        <span class="event-type-badge type-${escapeHtml(e.type)}">${e.typeEmoji || '🔷'} ${escapeHtml(e.type)}</span>
        ${e.closed ? '<span class="event-card-closed-flag">Closed</span>' : ''}
      </div>
      <h3 class="event-card-title">${escapeHtml(e.title)}</h3>
      <div class="event-card-meta">
        <span>🕒 <strong>${escapeHtml(e.time)}</strong></span>
        ${e.mass ? `<span>📍 ${escapeHtml(e.mass)}</span>` : ''}
        <span>Organized by ${escapeHtml(e.organizerTag)}</span>
      </div>
      <div class="event-card-progress-wrap">
        <div class="event-card-progress-bar"><div class="event-card-progress-fill" style="width:${e.totalSlots ? Math.round((e.signedCount / e.totalSlots) * 100) : 0}%"></div></div>
        <span class="event-card-progress-label">${e.signedCount}/${e.totalSlots}</span>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => openEvent(card.dataset.id));
  });
}

/* ---------- detail view ---------- */
async function openEvent(id) {
  try {
    currentDetail = await api('/api/events/' + encodeURIComponent(id));
  } catch (err) {
    showToast('Failed to load event: ' + err.message);
    return;
  }
  location.hash = '#e/' + id;
  document.getElementById('events-list-view').style.display = 'none';
  document.getElementById('event-detail-view').style.display = '';
  renderDetail();
}

function closeDetail() {
  currentDetail = null;
  history.replaceState(null, '', location.pathname + location.search);
  document.getElementById('event-detail-view').style.display = 'none';
  document.getElementById('events-list-view').style.display = '';
  loadEvents();
}

async function refreshDetail() {
  if (!currentDetail) return;
  try {
    currentDetail = await api('/api/events/' + encodeURIComponent(currentDetail.id));
    renderDetail();
  } catch (err) {
    showToast('Failed to refresh: ' + err.message);
  }
}

function renderDetail() {
  const layout = document.getElementById('event-detail-layout');
  const e = currentDetail;
  const canManage = isOfficerOrAdmin() || (window.SITE_AUTH.loggedIn && window.SITE_AUTH.id === e.organizerId);

  layout.innerHTML = `
    <aside class="event-info-col" id="event-info-col"></aside>
    <div class="event-roster-col" id="event-roster-col"></div>
    <aside class="event-details-col" id="event-details-col"></aside>`;

  document.getElementById('event-role-counter-row').innerHTML = renderRoleCounterBar(e);
  document.getElementById('event-info-col').innerHTML = renderInfoCol(e, canManage);
  document.getElementById('event-roster-col').innerHTML = renderRosterCol(e);
  renderDetailsPanelPlaceholder();

  wireDetailActions(canManage);
}

function renderInfoCol(e, canManage) {
  const mySignedRow = e.rows.find(r => r.signedUserId === window.SITE_AUTH.id);
  // A multi-choice row has no name/emoji of its own — the actual weapon the
  // signed-up player picked lives at options[signedOptionIndex] instead.
  const mySignedChoice = mySignedRow && mySignedRow.options
    ? (mySignedRow.options[mySignedRow.signedOptionIndex] || null)
    : mySignedRow;
  return `
    <div class="event-info-card">
      <span class="event-type-badge type-${escapeHtml(e.type)}">${e.typeEmoji || '🔷'} ${escapeHtml(e.type)}</span>
      <h2 class="event-info-title">${escapeHtml(e.title)}</h2>
      <div class="event-info-row"><span class="event-info-label">Time</span><span class="event-info-value">${escapeHtml(e.time)}</span></div>
      ${e.mass ? `<div class="event-info-row"><span class="event-info-label">Mass</span><span class="event-info-value">${escapeHtml(e.mass)}</span></div>` : ''}
      ${e.sets ? `<div class="event-info-row"><span class="event-info-label">Sets</span><span class="event-info-value">${escapeHtml(e.sets)}</span></div>` : ''}
      <div class="event-info-row"><span class="event-info-label">Organizer</span><span class="event-info-value">${escapeHtml(e.organizerTag)}</span></div>
      <div class="event-info-row"><span class="event-info-label">Status</span><span class="event-info-value">${e.closed ? 'Closed' : `<strong>${e.signedCount}/${e.totalSlots}</strong> signed up`}</span></div>
      ${e.compLabel ? `<div class="event-info-row"><span class="event-info-label">Composition</span><span class="event-info-value">${escapeHtml(e.compLabel)}</span></div>` : ''}
    </div>
    ${mySignedRow ? `
      <div class="event-your-signup">
        <div>You're signed up as <strong>${escapeHtml(mySignedRow.category)}</strong> — ${emojiToHtml(mySignedChoice && mySignedChoice.emoji, { size: 14 })} ${escapeHtml((mySignedChoice && mySignedChoice.name) || 'Any')}</div>
        ${!e.closed ? `<button class="event-action-btn danger" id="event-leave-btn">Leave slot</button>` : ''}
      </div>` : ''}
    ${canManage ? `
      <div class="event-action-row">
        <button class="event-action-btn" id="event-edit-btn">✏️ Edit event</button>
        ${e.compKey ? `<button class="event-action-btn" id="event-refresh-btn">🔄 Refresh from comp</button>` : ''}
        ${!e.closed ? `<button class="event-action-btn" id="event-ping-btn">⏰ Ping thread</button>` : ''}
        ${!e.closed ? `<button class="event-action-btn danger" id="event-close-btn">🔒 Close event</button>` : ''}
        ${isOfficerOrAdmin() ? `<button class="event-action-btn danger" id="event-delete-btn">🗑️ Delete event</button>` : ''}
      </div>` : ''}
  `;
}

// Total signups plus a per-role filled count, shown as colored pills at the
// top of the roster — replaces the old separate signups sidebar.
function renderRoleCounterBar(e) {
  const order = ['Tank', 'DPS', 'Healer', 'Support', 'Battlemount'];
  const counts = {};
  let totalFilled = 0;
  for (const row of e.rows) {
    if (!counts[row.category]) counts[row.category] = 0;
    if (row.signedUserId) { counts[row.category]++; totalFilled++; }
  }
  const active = order.filter(cat => counts[cat] !== undefined);
  if (active.length === 0) return '';
  return `
    <div class="event-role-counter">
      <span class="role-count-total">${totalFilled} Signup${totalFilled === 1 ? '' : 's'}</span>
      ${active.map(cat => `
        <span class="role-count-pill role-${cat.toLowerCase()}">
          <span class="role-count-name">${escapeHtml(cat)}</span>
          <span class="role-count-num">${counts[cat]}</span>
        </span>`).join('')}
    </div>`;
}

function renderRosterCol(e) {
  // Legacy quota-mode categories (e.g. a capacity-only role with no named
  // items) get their own small section up top with a weapon dropdown —
  // most comps are items-mode, where every row below is already its own
  // pickable slot.
  const quotaCats = Object.entries(e.categories).filter(([, c]) => c.mode === 'quota');
  const quotaHtml = quotaCats.length ? `
    <div class="event-quota-section">
      <div class="event-signups-head">Open slots</div>
      ${quotaCats.map(([cat, c]) => `
        <div class="event-quota-row" data-cat="${escapeHtml(cat)}">
          <span class="role-pill role-${cat.toLowerCase()}">${escapeHtml(cat)}</span>
          <span style="color:var(--ink-faint);font-size:12px">${c.signedCount}/${c.capacity} filled</span>
          ${!e.closed && c.signedCount < c.capacity ? `
            <select class="event-quota-select">${c.weaponOptions.map(w => `<option value="${escapeHtml(w)}">${escapeHtml(w)}</option>`).join('')}</select>
            <button class="event-action-btn event-quota-signup-btn">Sign up</button>` : ''}
        </div>`).join('')}
    </div>` : '';

  const parties = {};
  for (const row of e.rows) {
    if (!parties[row.party]) parties[row.party] = [];
    parties[row.party].push(row);
  }
  const partyKeys = Object.keys(parties).sort((a, b) => Number(a) - Number(b));
  const hasMultipleParties = partyKeys.length > 1;

  const partiesHtml = `<div class="event-party-grid">${partyKeys.map(pk => `
    <div class="event-party-card">
      ${hasMultipleParties ? `<div class="event-party-head">Party ${Number(pk) + 1}</div>` : `<div class="event-party-head">Roster</div>`}
      ${parties[pk].map(row => renderRosterRow(e, row)).join('')}
    </div>`).join('')}</div>`;

  return quotaHtml + partiesHtml;
}

// Discord custom emoji tags (e.g. <:perma:950504612046111823>) only mean
// anything inside Discord's own client — it swaps them for the real image.
// Everywhere else (including here) they're just literal text, so we detect
// the tag and render an actual <img> from Discord's CDN instead, same as
// the comp editor's emoji picker already does. Anything else (a plain
// unicode emoji, or nothing) falls back to showing it as-is.
function emojiToHtml(value, { size = 16, fallback = '🔹' } = {}) {
  if (!value) return `<span class="event-emoji-fallback">${fallback}</span>`;
  const m = String(value).match(/^<a?:(\w+):(\d+)>$/);
  if (m) {
    const animated = value.startsWith('<a:');
    const url = `https://cdn.discordapp.com/emojis/${m[2]}.${animated ? 'gif' : 'png'}?size=32`;
    return `<img class="event-emoji-img" src="${url}" alt="${escapeHtml(m[1])}" loading="lazy" style="width:${size}px;height:${size}px">`;
  }
  return `<span class="event-emoji-fallback">${escapeHtml(value)}</span>`;
}

function renderRosterRow(e, row) {
  const isMine = row.signedUserId === window.SITE_AUTH.id;
  const isOpen = !row.signedUserId;
  const hasItemIndex = row.itemIndex !== undefined;
  const isMultiChoice = !!row.options;
  const canSignup = isOpen && !e.closed && window.SITE_AUTH.loggedIn && hasItemIndex;
  // Officer/admin manual assign — button sits at the right end of the row.
  // Only makes sense for item-mode rows (a single named slot); quota-mode
  // categories keep using their own self-serve "pick a weapon, sign up"
  // section instead.
  const canManageAssign = isOfficerOrAdmin() && !e.closed && hasItemIndex;

  let namePill;
  if (isMultiChoice) {
    // Multi-choice line — each option gets its own smaller pill, split
    // evenly across the same footprint the single-choice pill occupies
    // (see .event-row-name-pill-group in events.css), instead of one pill
    // with names chained by "/". Each option is independently clickable —
    // same as a single-choice role's pill — to view/link that option's
    // own build.
    const optionPills = row.options.map((o, oi) => {
      const optIcon = o.iconUrl
        ? `<img class="event-row-pill-icon" src="${escapeHtml(o.iconUrl)}" alt="" loading="lazy">`
        : `<span class="event-row-pill-icon-fallback">${emojiToHtml(o.emoji, { size: 15 })}</span>`;
      const label = `${optIcon}<span class="event-row-name-text">${escapeHtml(o.name)}</span>`;
      return `<button type="button" class="event-row-option-pill event-row-build-trigger role-${row.category.toLowerCase()}" data-cat="${escapeHtml(row.category)}" data-item-index="${row.itemIndex}" data-option-index="${oi}" title="View linked build">${label}</button>`;
    }).join('');
    namePill = `<div class="event-row-name-pill-group">${optionPills}</div>`;
  } else {
    // Weapon icon renders inside the name pill itself (see
    // .event-row-name-pill in events.css) instead of as its own column, so
    // the row is just two even halves: the name pill and the player pill.
    const icon = row.iconUrl
      ? `<img class="event-row-pill-icon" src="${escapeHtml(row.iconUrl)}" alt="" loading="lazy">`
      : `<span class="event-row-pill-icon-fallback">${emojiToHtml(row.emoji, { size: 15 })}</span>`;
    const nameLabel = `${icon}<span class="event-row-name-text">${escapeHtml(row.name || 'Any')}</span>`;
    namePill = hasItemIndex
      ? `<button type="button" class="event-row-name-pill event-row-build-trigger role-${row.category.toLowerCase()}" data-cat="${escapeHtml(row.category)}" data-item-index="${row.itemIndex}" title="View linked build">${nameLabel}</button>`
      : `<span class="event-row-name-pill role-${row.category.toLowerCase()}">${nameLabel}</span>`;
  }
  const assignBtn = canManageAssign
    ? `<button type="button" class="event-row-assign-btn${isOpen ? ' add' : ' remove'}"
        data-cat="${escapeHtml(row.category)}" data-item-index="${row.itemIndex}"
        title="${isOpen ? 'Assign a player to this slot' : 'Remove this player from the slot'}">${isOpen ? '+' : '−'}</button>`
    : '';
  const status = row.signedUserId
    ? `<button type="button" class="event-row-player-pill" data-user-id="${escapeHtml(row.signedUserId)}" data-cat="${escapeHtml(row.category)}" data-item-index="${row.itemIndex ?? ''}" title="View player">
        <img class="event-row-player-avatar" src="${escapeHtml(row.signedAvatarUrl || window.discordAvatarUrl(row.signedUserId, null))}" alt="" loading="lazy">
        <span class="event-row-player-name">${escapeHtml(row.signedUsername)}</span>
      </button>`
    : `<span class="event-row-status">${canSignup ? 'Sign up' : 'Open'}</span>`;

  return `
    <div class="event-row${isOpen ? ' is-open' : ''}${canSignup ? ' can-signup' : ''}${isMine ? ' is-mine' : ''}${canManageAssign ? ' has-assign-btn' : ''}"
         ${canSignup ? `data-cat="${escapeHtml(row.category)}" data-item-index="${row.itemIndex}"` : ''}
         ${isMultiChoice ? 'data-options="1"' : ''}>
      ${namePill}
      ${status}
      ${assignBtn}
    </div>`;
}

/* ---------- details panel (build view/link, player snippet) ---------- */
// Replaces the old signups sidebar: clicking a role's name shows the build
// linked to it (with an officer/admin-only option to link one), clicking a
// signed-up player's name shows a small profile snippet.
// Same role tokens builds.js uses for the card's color bar + role pill,
// plus battlemount (events-only category, styled in events.css) so every
// event role has a matching color here too.
const EVENT_ROLE_COLORS = { healer: 'var(--healer)', support: 'var(--support)', dps: 'var(--dps)', tank: 'var(--tank)', gank: 'var(--gank)', battlemount: 'var(--cosmic)' };
const EVENT_ROLE_LABELS = { healer: 'Healer', support: 'Support', dps: 'DPS', tank: 'Tank', gank: 'Gank', battlemount: 'Battlemount' };
// Same flag glyph as the build page's card-note-block (builds.js FLAG_SVG).
const EVENT_FLAG_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4a1 1 0 0 1 1.45-.9L19 9.5 5.45 16.4A1 1 0 0 1 4 15.5"/></svg>`;

// Item-card cell for the build gear grid — identical markup to the build
// page's own slotCard() (icon + label + name via js/item-map.js's imgUrl()),
// just without the editable/pencil bits since this panel is read-only.
const imgUrl = window.imgUrl;
function renderGearSlot(label, name) {
  if (!name && !label) return `<div class="slot-card empty spacer"></div>`;
  if (!name) return `
    <div class="slot-card empty">
      <div class="slot-empty-icon"></div>
      <div class="slot-info"><span class="slot-label">${escapeHtml(label)}</span><span class="slot-name">—</span></div>
    </div>`;
  const url = typeof imgUrl === 'function' ? imgUrl(name) : null;
  const icon = url
    ? `<img src="${escapeHtml(url)}" alt="" loading="lazy" onerror="this.style.opacity='0.15'">`
    : `<div class="slot-empty-icon"></div>`;
  return `
    <div class="slot-card">
      ${icon}
      <div class="slot-info"><span class="slot-label">${escapeHtml(label)}</span><span class="slot-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span></div>
    </div>`;
}

async function ensureAllBuildsLoaded() {
  if (allBuildsCache) return allBuildsCache;
  allBuildsCache = await api('/api/builds');
  return allBuildsCache;
}

async function ensureBuildLinkOptionsLoaded() {
  if (buildLinkOptionsCache) return buildLinkOptionsCache;
  buildLinkOptionsCache = await api('/api/comps-build-options');
  return buildLinkOptionsCache;
}

async function ensureDahaloMembersLoaded() {
  if (dahaloMembersCache) return dahaloMembersCache;
  dahaloMembersCache = await api('/api/discord-members');
  return dahaloMembersCache;
}

/* ---------- shared "pick a weapon" popover (multi-choice lines) ----------
   Used both for a self sign-up on an open multi-choice row and for an
   officer's manual assign (after they've picked the player) — same
   floating-popover chrome as the assign popover above, just listing the
   row's own options instead of Dahalo members. */
function closeOptionPopover() {
  const pop = document.getElementById('event-option-popover');
  if (pop) pop.remove();
  document.removeEventListener('mousedown', handleOptionPopoverOutsideClick, true);
}

function handleOptionPopoverOutsideClick(e) {
  const pop = document.getElementById('event-option-popover');
  if (pop && !pop.contains(e.target)) closeOptionPopover();
}

function openOptionPopover(anchorEl, options, onPick) {
  closeOptionPopover();
  const pop = document.createElement('div');
  pop.id = 'event-option-popover';
  pop.className = 'event-assign-popover';
  pop.innerHTML = `<div class="event-assign-popover-list">${options.map((o, i) => `
    <button type="button" class="event-assign-popover-item" data-i="${i}">
      ${o.iconUrl ? `<img src="${escapeHtml(o.iconUrl)}" alt="" loading="lazy">` : ''}
      <span>${escapeHtml(o.name)}</span>
    </button>`).join('')}</div>`;
  document.body.appendChild(pop);

  const rect = anchorEl.getBoundingClientRect();
  pop.style.top = `${window.scrollY + rect.bottom + 6}px`;
  pop.style.left = `${window.scrollX + rect.left}px`;

  pop.querySelectorAll('.event-assign-popover-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeOptionPopover();
      onPick(Number(btn.dataset.i));
    });
  });

  setTimeout(() => document.addEventListener('mousedown', handleOptionPopoverOutsideClick, true), 0);
}

function findRosterRow(cat, itemIndex) {
  return (currentDetail.rows || []).find(r => r.category === cat && r.itemIndex === itemIndex);
}

function openSelfOptionPopover(anchorEl, cat, itemIndex) {
  if (!window.SITE_AUTH.loggedIn) {
    showToast('Log in with Discord to sign up.');
    return;
  }
  const row = findRosterRow(cat, itemIndex);
  if (!row || !row.options) return;
  openOptionPopover(anchorEl, row.options, (optionIndex) => handleSignup(cat, itemIndex, optionIndex));
}

/* ---------- manual assign / remove (officer/admin only) ----------
   The site equivalent of mentioning a player + role name in an event's
   Discord thread. "+" on an open slot opens a searchable popover of
   Dahalo-role members (same open/close/outside-click pattern as comps.js's
   emoji popover); picking one assigns them — and for a multi-choice line,
   immediately follows up with the weapon-choice popover above before the
   assignment is actually sent. "−" on a filled slot removes whoever's
   there, after a confirm — same convention as builds.js's card-delete-btn. */
function closeAssignPopover() {
  const pop = document.getElementById('event-assign-popover');
  if (pop) pop.remove();
  document.removeEventListener('mousedown', handleAssignPopoverOutsideClick, true);
}

function handleAssignPopoverOutsideClick(e) {
  const pop = document.getElementById('event-assign-popover');
  if (pop && !pop.contains(e.target)) closeAssignPopover();
}

async function openAssignPopover(anchorBtn, cat, itemIndex) {
  closeAssignPopover();
  const pop = document.createElement('div');
  pop.id = 'event-assign-popover';
  pop.className = 'event-assign-popover';
  pop.innerHTML = `
    <input type="text" class="event-assign-popover-search" placeholder="Search Dahalo members…" autocomplete="off">
    <div class="event-assign-popover-list"><p class="event-assign-popover-empty">Loading…</p></div>`;
  document.body.appendChild(pop);

  const rect = anchorBtn.getBoundingClientRect();
  pop.style.top = `${window.scrollY + rect.bottom + 6}px`;
  pop.style.left = `${window.scrollX + rect.left}px`;

  const list = pop.querySelector('.event-assign-popover-list');
  let members;
  try {
    members = await ensureDahaloMembersLoaded();
  } catch (err) {
    list.innerHTML = `<p class="event-assign-popover-empty">Failed to load members: ${escapeHtml(err.message)}</p>`;
    setTimeout(() => document.addEventListener('mousedown', handleAssignPopoverOutsideClick, true), 0);
    return;
  }

  const row = findRosterRow(cat, itemIndex);

  const renderList = (filter = '') => {
    const q = filter.trim().toLowerCase();
    const matches = q ? members.filter(m => m.username.toLowerCase().includes(q)) : members;
    if (matches.length === 0) {
      list.innerHTML = `<p class="event-assign-popover-empty">${members.length === 0 ? 'No members found with the Dahalo role.' : 'No matches.'}</p>`;
      return;
    }
    list.innerHTML = matches.slice(0, 50).map(m => `
      <button type="button" class="event-assign-popover-item" data-user-id="${escapeHtml(m.id)}">
        <img src="${escapeHtml(window.discordAvatarUrl(m.id, m.avatar, 32))}" alt="" loading="lazy">
        <span>${escapeHtml(m.username)}</span>
      </button>`).join('');
    list.querySelectorAll('.event-assign-popover-item').forEach(itemBtn => {
      itemBtn.addEventListener('click', () => {
        closeAssignPopover();
        // Multi-choice line — one more popover to say which weapon, right
        // where the member popover just was.
        if (row && row.options) {
          openOptionPopover(anchorBtn, row.options, (optionIndex) => handleAssignAdd(cat, itemIndex, itemBtn.dataset.userId, optionIndex));
        } else {
          handleAssignAdd(cat, itemIndex, itemBtn.dataset.userId);
        }
      });
    });
  };
  renderList();

  pop.querySelector('.event-assign-popover-search').addEventListener('input', e => renderList(e.target.value));
  pop.querySelector('.event-assign-popover-search').focus();

  setTimeout(() => document.addEventListener('mousedown', handleAssignPopoverOutsideClick, true), 0);
}

async function handleAssignAdd(cat, itemIndex, userId, optionIndex) {
  try {
    const body = { userId };
    if (optionIndex !== undefined) body.optionIndex = optionIndex;
    currentDetail = await api(
      `/api/events/${encodeURIComponent(currentDetail.id)}/rows/${encodeURIComponent(cat)}/${itemIndex}/assign`,
      { method: 'POST', body: JSON.stringify(body) }
    );
    renderDetail();
    showToast('Player assigned.');
  } catch (err) {
    showToast('Failed to assign player: ' + err.message);
  }
}

async function handleAssignRemove(cat, itemIndex) {
  if (!confirm('Remove this player from the slot?')) return;
  try {
    currentDetail = await api(
      `/api/events/${encodeURIComponent(currentDetail.id)}/rows/${encodeURIComponent(cat)}/${itemIndex}/assign`,
      { method: 'DELETE' }
    );
    renderDetail();
    showToast('Player removed.');
  } catch (err) {
    showToast('Failed to remove player: ' + err.message);
  }
}

function renderDetailsPanelPlaceholder() {
  const col = document.getElementById('event-details-col');
  if (!col) return;
  col.innerHTML = `
    <div class="event-details-head">Details</div>
    <p class="event-details-empty">Click a role to see its linked build, or a player's name to see their profile.</p>`;
}

async function showBuildPanel(cat, itemIndexStr, optionIndexStr) {
  const col = document.getElementById('event-details-col');
  const itemIndex = itemIndexStr === '' ? undefined : Number(itemIndexStr);
  const row = currentDetail.rows.find(r => r.category === cat && r.itemIndex === itemIndex);
  if (!row) return;
  // A multi-choice line has no build of its own — each option carries its
  // own buildTab/buildId, so every lookup/save below reads and writes
  // `target` (the option) instead of `row` whenever one was clicked.
  const optionIndex = (optionIndexStr === undefined || optionIndexStr === '') ? undefined : Number(optionIndexStr);
  const option = optionIndex !== undefined && row.options ? row.options[optionIndex] : null;
  if (optionIndex !== undefined && !option) return;
  const target = option || row;

  col.innerHTML = `<div class="event-details-head">Details</div><p class="event-details-empty">Loading build…</p>`;

  let build = null;
  if (target.buildTab && target.buildId != null) {
    try {
      const all = await ensureAllBuildsLoaded();
      build = (all[target.buildTab] || [])[target.buildId] || null;
    } catch (err) {
      showToast('Failed to load build: ' + err.message);
    }
  }

  const canManage = isOfficerOrAdmin();
  let linkerHtml = '';
  if (canManage) {
    let options = [];
    try {
      options = await ensureBuildLinkOptionsLoaded();
    } catch {
      options = [];
    }
    const roleOptions = options.filter(o => o.role && o.role.toLowerCase() === cat.toLowerCase());
    linkerHtml = `
      <div class="event-build-linker">
        <select class="event-build-link-select">
          <option value="">No build</option>
          ${roleOptions.map(o => `<option value="${o.tab}:${o.index}" ${build && target.buildTab === o.tab && target.buildId === o.index ? 'selected' : ''}>${escapeHtml(o.weapon)}</option>`).join('')}
        </select>
        <button type="button" class="event-action-btn" id="event-build-link-save">${build ? 'Change' : 'Link build'}</button>
      </div>`;
  }

  const roleKey = cat.toLowerCase();
  const color = EVENT_ROLE_COLORS[roleKey] || 'var(--line-2)';
  const roleLabel = EVENT_ROLE_LABELS[roleKey] || cat;
  const displayName = option ? option.name : (row.name || 'Any');

  // Same card-header / slots-grid / card-note-block markup as the builds
  // tab's own detail card (see builds.js select()), just read-only and
  // followed by the event-only build-linker for officers/admins.
  col.innerHTML = `
    <div class="event-details-head">Details</div>
    <div class="event-build-panel">
      ${build ? `
        <div class="card-header">
          <div class="card-role-bar" style="background:${color}"></div>
          <div class="card-title-row">
            <div class="card-title">${escapeHtml(build.weapon || 'Unnamed build')}</div>
          </div>
          <div class="card-meta">
            <span class="role-pill role-${roleKey}"><span class="role-pill-dot" style="background:${color}"></span>${escapeHtml(roleLabel)}</span>
          </div>
        </div>
        <div>
          <div class="section-label">Build</div>
          <div class="slots-grid event-build-slots">
            ${renderGearSlot('', '')}
            ${renderGearSlot('Head', build.head)}
            ${renderGearSlot('Cape', build.cape)}
            ${renderGearSlot('Weapon', build.weapon)}
            ${renderGearSlot('Chest', build.chest)}
            ${renderGearSlot('Offhand', build.offhand)}
            ${renderGearSlot('Potion', build.potion)}
            ${renderGearSlot('Feet', build.feet)}
            ${renderGearSlot('Food', build.food)}
          </div>
        </div>
        ${build.note ? `<div class="card-note-block">${EVENT_FLAG_SVG}<span class="card-note-text">${escapeHtml(build.note)}</span></div>` : ''}
      ` : `
        <div class="event-build-role"><span class="role-pill role-${roleKey}"><span class="role-pill-dot" style="background:${color}"></span>${escapeHtml(roleLabel)}</span> ${escapeHtml(displayName)}</div>
        <p class="event-details-empty">No build linked yet.</p>`}
      ${linkerHtml}
    </div>`;

  // The slot-card entrance animation (see .slots-grid .slot-card / .revealed
  // in builds.css) starts every card at opacity:0 and only reveals them once
  // JS adds .revealed to the grid — normally done by the build page's own
  // reveal step. This panel builds the same markup directly via
  // renderGearSlot() without going through that step, so without this the
  // cards would just stay invisible forever. Same double-rAF timing as
  // builds.js uses, so the staggered per-card pop-in still plays here too.
  const grid = col.querySelector('.event-build-slots');
  const header = col.querySelector('.card-header');
  if (grid) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        grid.classList.add('revealed');
      });
    });
  }
  if (header) setTimeout(() => header.classList.add('shimmer'), 750);

  const saveBtn = document.getElementById('event-build-link-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const select = col.querySelector('.event-build-link-select');
      const value = select.value;
      const body = value ? { buildTab: value.split(':')[0], buildId: Number(value.split(':')[1]) } : {};
      if (optionIndex !== undefined) body.optionIndex = optionIndex;
      try {
        currentDetail = await api(
          `/api/events/${encodeURIComponent(currentDetail.id)}/rows/${encodeURIComponent(cat)}/${itemIndex}/build`,
          { method: 'PUT', body: JSON.stringify(body) }
        );
        document.getElementById('event-roster-col').innerHTML = renderRosterCol(currentDetail);
        wireRosterActions();
        showBuildPanel(cat, itemIndexStr, optionIndexStr);
        showToast(value ? 'Build linked.' : 'Build unlinked.');
      } catch (err) {
        showToast('Failed to update build link: ' + err.message);
      }
    });
  }
}

async function showPlayerPanel(cat, itemIndexStr, userId) {
  const col = document.getElementById('event-details-col');
  const itemIndex = itemIndexStr === '' ? undefined : Number(itemIndexStr);
  const row = currentDetail.rows.find(r => r.category === cat && r.itemIndex === itemIndex);
  const avatarUrl = (row && row.signedAvatarUrl) || window.discordAvatarUrl(userId, null, 128);
  const profileHref = `profile.html?id=${encodeURIComponent(userId)}`;
  const displayName = row ? row.signedUsername : userId;

  // A multi-choice row has no weapon name of its own — the actual pick
  // lives at options[signedOptionIndex] instead (same lookup renderInfoCol
  // uses for "You're signed up as…"). Keep the resolved option/row object
  // itself too (not just its name) — it's what carries buildTab/buildId
  // for the build-icon lookup below.
  const signedTarget = row
    ? (row.options ? row.options[row.signedOptionIndex] : row)
    : null;
  const signedWeapon = signedTarget ? signedTarget.name : null;

  col.innerHTML = `
    <div class="event-details-head">Details</div>
    <div class="event-player-panel">
      <div class="event-player-head">
        <a href="${profileHref}" class="event-player-avatar-wrap">
          <img class="event-player-avatar" src="${escapeHtml(avatarUrl)}" alt="" loading="lazy">
        </a>
        <div class="event-player-id">
          <a href="${profileHref}" class="event-player-name">${escapeHtml(displayName)}</a>
        </div>
      </div>
      ${row ? `<div class="event-player-role"><span class="role-pill role-${cat.toLowerCase()}">${escapeHtml(cat)}</span> ${escapeHtml(signedWeapon || 'Any')}</div>` : ''}
      <p class="event-details-empty">Loading profile…</p>
    </div>`;

  // Profile stats and the linked-build lookup (for this specific role's
  // weapon icon) don't depend on each other, so run them side by side
  // instead of one after the other.
  const [profileResult, buildResult] = await Promise.allSettled([
    api(`/api/profile/${encodeURIComponent(userId)}`),
    (signedTarget && signedTarget.buildTab && signedTarget.buildId != null)
      ? ensureAllBuildsLoaded()
      : Promise.resolve(null),
  ]);

  const profile = profileResult.status === 'fulfilled' ? profileResult.value : null;

  // If this role has a build linked to it, that build's own weapon (which
  // can be a more specific pick than the row's generic weapon name — e.g.
  // "Realmbreaker" for a "Great Axe" slot) is what shows up as the icon
  // for the "playing this event" chip, same as the gear grid uses
  // build.weapon for its Weapon slot icon.
  let buildWeaponIcon = null;
  if (buildResult && buildResult.status === 'fulfilled' && buildResult.value && signedTarget) {
    const build = (buildResult.value[signedTarget.buildTab] || [])[signedTarget.buildId];
    if (build && build.weapon) buildWeaponIcon = build.weapon;
  }

  const empty = col.querySelector('.event-player-panel > .event-details-empty');
  if (!empty) return; // panel was replaced by another click while this was in flight
  if (!profile) {
    empty.textContent = 'Failed to load this player\u2019s profile.';
    return;
  }

  const ringClass = EVENT_TIER_RING_CLASS[profile.tier] || 'ring-member';
  const textClass = EVENT_TIER_TEXT_CLASS[profile.tier] || 'tier-member';
  const tierLabel = EVENT_TIER_LABELS[profile.tier] || 'Dahalo';
  const avatarWrap = col.querySelector('.event-player-avatar-wrap');
  if (avatarWrap) avatarWrap.classList.add(ringClass);

  const idBlock = col.querySelector('.event-player-id');
  if (idBlock) {
    idBlock.insertAdjacentHTML('beforeend', `<span class="event-player-tier ${textClass}">${escapeHtml(tierLabel)}</span>`);
  }

  const eventType = currentDetail.type;
  const attendanceCount = (profile.attendance && profile.attendance[eventType]) || 0;
  const attendanceLine = `${attendanceCount} ${escapeHtml(eventType)} event${attendanceCount === 1 ? '' : 's'} attended`;

  // Full all-time weapon history (not capped — the row scrolls
  // horizontally rather than wrapping/truncating, see
  // .event-player-weapon-row in events.css), with the weapon they're
  // playing for this event pulled to the front of the list regardless of
  // its play count, then the rest in most-played-first order. If today's
  // weapon isn't in that history yet (a first-time pick), it's added as
  // that first chip with no count rather than dropped.
  const topWeapons = profile.topWeapons || [];
  const chips = topWeapons.slice();
  let currentChipData = null;
  if (signedWeapon) {
    const idx = chips.findIndex(w => w.name === signedWeapon);
    currentChipData = idx !== -1 ? chips.splice(idx, 1)[0] : { name: signedWeapon, count: null };
    chips.unshift({ ...currentChipData, isCurrent: true });
  }

  const weaponsHtml = chips.length
    ? `<div class="event-player-weapons">
        <div class="section-label">Weapons played</div>
        <div class="event-player-weapon-row">
          ${chips.map(w => {
            const isCurrent = Boolean(w.isCurrent);
            // The linked build's weapon (if any) only overrides the icon
            // for the current chip — history chips keep showing whatever
            // that past event's own weapon actually was.
            const iconName = (isCurrent && buildWeaponIcon) ? buildWeaponIcon : w.name;
            const url = typeof imgUrl === 'function' ? imgUrl(iconName) : null;
            const titleBits = [w.name];
            if (isCurrent && buildWeaponIcon && buildWeaponIcon !== w.name) titleBits.push(`linked build: ${buildWeaponIcon}`);
            if (isCurrent) titleBits.push('playing this event');
            return `
              <div class="event-player-weapon-chip${isCurrent ? ' is-current' : ''}" title="${escapeHtml(titleBits.join(' — '))}">
                ${url
                  ? `<img src="${escapeHtml(url)}" alt="" loading="lazy" onerror="this.style.opacity='0.15'">`
                  : `<div class="slot-empty-icon"></div>`}
                ${w.count != null ? `<span class="event-player-weapon-count">${w.count}</span>` : ''}
              </div>`;
          }).join('')}
        </div>
      </div>`
    : '';

  empty.outerHTML = `
    <div class="event-player-attendance">${attendanceLine}</div>
    ${weaponsHtml}`;
}

// Roster-col listeners only — safe to re-run after a partial roster-col
// refresh (e.g. after linking a build) without touching the info column's
// buttons, which weren't recreated and would otherwise get double-bound.
function wireRosterActions() {
  document.querySelectorAll('.event-row.can-signup').forEach(row => {
    row.addEventListener('click', () => {
      const cat = row.dataset.cat;
      const itemIndex = Number(row.dataset.itemIndex);
      // Multi-choice line — ask which weapon before signing up, instead
      // of assuming one.
      if (row.dataset.options) openSelfOptionPopover(row, cat, itemIndex);
      else handleSignup(cat, itemIndex);
    });
  });

  document.querySelectorAll('.event-quota-signup-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.event-quota-row');
      const cat = wrap.dataset.cat;
      const weapon = wrap.querySelector('.event-quota-select').value;
      handleQuotaSignup(cat, weapon);
    });
  });

  document.querySelectorAll('.event-row-build-trigger[data-item-index]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showBuildPanel(btn.dataset.cat, btn.dataset.itemIndex, btn.dataset.optionIndex);
    });
  });
  document.querySelectorAll('.event-row-player-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPlayerPanel(btn.dataset.cat, btn.dataset.itemIndex, btn.dataset.userId);
    });
  });

  // Officer/admin manual assign — "+" opens the Dahalo-member picker,
  // "−" removes whoever's currently in the slot. stopPropagation so this
  // doesn't also trigger the row's own self-signup click when both apply
  // (an officer viewing their own open slot).
  document.querySelectorAll('.event-row-assign-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.dataset.cat;
      const itemIndex = Number(btn.dataset.itemIndex);
      if (btn.classList.contains('add')) openAssignPopover(btn, cat, itemIndex);
      else handleAssignRemove(cat, itemIndex);
    });
  });
}

// Info-col listeners — only meaningful right after a full renderDetail(),
// since these buttons only exist in the info column.
function wireInfoActions(canManage) {
  const leaveBtn = document.getElementById('event-leave-btn');
  if (leaveBtn) leaveBtn.addEventListener('click', handleLeave);

  if (!canManage) return;
  const editBtn = document.getElementById('event-edit-btn');
  if (editBtn) editBtn.addEventListener('click', () => openEventForm('edit'));
  const refreshBtn = document.getElementById('event-refresh-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', handleRefresh);
  const pingBtn = document.getElementById('event-ping-btn');
  if (pingBtn) pingBtn.addEventListener('click', handlePing);
  const closeBtn = document.getElementById('event-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', openCloseForm);
  const deleteBtn = document.getElementById('event-delete-btn');
  if (deleteBtn) deleteBtn.addEventListener('click', handleDelete);
}

function wireDetailActions(canManage) {
  wireRosterActions();
  wireInfoActions(canManage);
}

/* ---------- sign-up / leave ---------- */
async function handleSignup(category, itemIndex, optionIndex) {
  if (!window.SITE_AUTH.loggedIn) {
    showToast('Log in with Discord to sign up.');
    return;
  }
  try {
    const body = { category, itemIndex };
    if (optionIndex !== undefined) body.optionIndex = optionIndex;
    currentDetail = await api(`/api/events/${encodeURIComponent(currentDetail.id)}/signup`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    renderDetail();
  } catch (err) {
    showToast(err.message);
    refreshDetail();
  }
}

async function handleQuotaSignup(category, weapon) {
  if (!window.SITE_AUTH.loggedIn) {
    showToast('Log in with Discord to sign up.');
    return;
  }
  try {
    currentDetail = await api(`/api/events/${encodeURIComponent(currentDetail.id)}/signup`, {
      method: 'POST',
      body: JSON.stringify({ category, weapon }),
    });
    renderDetail();
  } catch (err) {
    showToast(err.message);
    refreshDetail();
  }
}

async function handleLeave() {
  try {
    currentDetail = await api(`/api/events/${encodeURIComponent(currentDetail.id)}/leave`, { method: 'POST' });
    renderDetail();
  } catch (err) {
    showToast(err.message);
  }
}

/* ---------- officer actions: refresh / ping / close ---------- */
async function handleRefresh() {
  try {
    const result = await api(`/api/events/${encodeURIComponent(currentDetail.id)}/refresh`, { method: 'POST' });
    currentDetail = result;
    renderDetail();
    if (result.dropped && result.dropped.length) {
      showToast(`Refreshed — ${result.dropped.length} sign-up${result.dropped.length === 1 ? '' : 's'} no longer matched a slot and were removed.`);
    } else {
      showToast('Roster refreshed from the linked comp.');
    }
  } catch (err) {
    showToast('Failed to refresh: ' + err.message);
  }
}

async function handlePing() {
  try {
    await api(`/api/events/${encodeURIComponent(currentDetail.id)}/ping`, { method: 'POST' });
    showToast('Reminder sent.');
  } catch (err) {
    showToast('Failed to ping: ' + err.message);
  }
}

async function handleDelete() {
  const e = currentDetail;
  if (!confirm(`Delete "${e.title}"? This removes it (and its Discord message) entirely and can't be undone.`)) return;
  try {
    await api(`/api/events/${encodeURIComponent(e.id)}`, { method: 'DELETE' });
    showToast('Event deleted.');
    closeDetail();
  } catch (err) {
    showToast('Failed to delete: ' + err.message);
  }
}

function openCloseForm() {
  const e = currentDetail;
  const signed = e.rows.filter(r => r.signedUserId);
  const overlay = document.getElementById('event-form-overlay');
  const card = document.getElementById('event-form-card');
  card.innerHTML = `
    <h2>Close "${escapeHtml(e.title)}"</h2>
    <p class="modal-hint">Check anyone who signed up but didn't show — this is just recorded for later, it doesn't remove them from the roster.</p>
    <div class="modal-field">
      ${signed.length === 0 ? '<span class="modal-hint">Nobody signed up.</span>' : signed.map(r => `
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;padding:4px 0;">
          <input type="checkbox" class="close-no-show-cb" value="${escapeHtml(r.signedUserId)}">
          ${escapeHtml(r.signedUsername)} — ${escapeHtml(r.category)}
        </label>`).join('')}
    </div>
    <div class="modal-actions">
      <button class="event-action-btn" id="close-form-cancel">Cancel</button>
      <button class="event-action-btn danger" id="close-form-submit">Close event</button>
    </div>`;
  overlay.style.display = 'flex';
  document.getElementById('close-form-cancel').addEventListener('click', closeModal);
  document.getElementById('close-form-submit').addEventListener('click', async () => {
    const noShowIds = [...card.querySelectorAll('.close-no-show-cb:checked')].map(cb => cb.value);
    try {
      currentDetail = await api(`/api/events/${encodeURIComponent(e.id)}/close`, {
        method: 'POST',
        body: JSON.stringify({ noShowIds }),
      });
      closeModal();
      renderDetail();
      showToast('Event closed.');
    } catch (err) {
      showToast('Failed to close: ' + err.message);
    }
  });
}

/* ---------- create / edit form ---------- */
function wireModalOverlay() {
  const overlay = document.getElementById('event-form-overlay');
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

function closeModal() {
  document.getElementById('event-form-overlay').style.display = 'none';
}

async function ensureChannelsLoaded() {
  if (channelsCache) return channelsCache;
  channelsCache = await api('/api/discord-channels');
  return channelsCache;
}

async function ensureCompOptionsLoaded() {
  if (compOptionsCache) return compOptionsCache;
  compOptionsCache = await api('/api/events-comp-options');
  return compOptionsCache;
}

async function openEventForm(mode) {
  const isEdit = mode === 'edit';
  const e = isEdit ? currentDetail : null;
  formCompSource = isEdit && !e.compKey ? 'manual' : 'comp';

  let channels = [];
  let comps = [];
  try {
    [channels, comps] = await Promise.all([
      isEdit ? Promise.resolve([]) : ensureChannelsLoaded(),
      ensureCompOptionsLoaded(),
    ]);
  } catch (err) {
    showToast('Failed to load form data: ' + err.message);
    return;
  }

  const overlay = document.getElementById('event-form-overlay');
  const card = document.getElementById('event-form-card');
  card.innerHTML = `
    <h2>${isEdit ? 'Edit event' : 'New event'}</h2>
    <div class="modal-row">
      <div class="modal-field">
        <label>Type</label>
        <select id="ef-type">${EVENT_TYPES.map(t => `<option value="${t}" ${e && e.type === t ? 'selected' : ''}>${EVENT_TYPE_EMOJI[t]} ${t}</option>`).join('')}</select>
      </div>
      <div class="modal-field">
        <label>Time</label>
        <input type="text" id="ef-time" placeholder="21h Mada" value="${escapeHtml(e ? e.time : '')}">
      </div>
    </div>
    <div class="modal-field">
      <label>Title <span style="font-weight:400;text-transform:none">(optional — defaults to the type)</span></label>
      <input type="text" id="ef-title" placeholder="e.g. CTA vs Blood Moon" value="${escapeHtml(e ? e.title : '')}">
    </div>
    <div class="modal-row">
      <div class="modal-field">
        <label>Mass <span style="font-weight:400;text-transform:none">(optional)</span></label>
        <input type="text" id="ef-mass" placeholder="Lymhurst Portal" value="${escapeHtml(e ? e.mass || '' : '')}">
      </div>
      <div class="modal-field">
        <label>Sets <span style="font-weight:400;text-transform:none">(optional)</span></label>
        <input type="text" id="ef-sets" placeholder="1+0" value="${escapeHtml(e ? e.sets || '' : '')}">
      </div>
    </div>
    ${!isEdit ? `
      <div class="modal-field">
        <label>Channel</label>
        <select id="ef-channel">${channels.map(c => `<option value="${escapeHtml(c.id)}">#${escapeHtml(c.name)}</option>`).join('')}</select>
      </div>` : `<p class="modal-hint">The channel can't be changed after an event is posted — close this one and create a new one if you need a different channel.</p>`}

    <div class="modal-field">
      <label>Composition</label>
      <div class="modal-source-toggle">
        <button type="button" id="ef-src-comp" class="${formCompSource === 'comp' ? 'active' : ''}">Use a saved comp</button>
        <button type="button" id="ef-src-manual" class="${formCompSource === 'manual' ? 'active' : ''}">Type manually</button>
      </div>
    </div>
    <div class="modal-field" id="ef-comp-wrap" style="display:${formCompSource === 'comp' ? '' : 'none'}">
      <select id="ef-comp">${comps.map(c => `<option value="${escapeHtml(c.key)}" ${e && e.compKey === c.key ? 'selected' : ''}>${escapeHtml(c.label)}</option>`).join('')}</select>
      ${isEdit ? '<p class="modal-hint">Switching comps keeps sign-ups whose slot still matches; anyone else is dropped and shown to you after saving.</p>' : ''}
    </div>
    <div class="modal-field" id="ef-manual-wrap" style="display:${formCompSource === 'manual' ? '' : 'none'}">
      <textarea id="ef-manual" placeholder="Tank&#10;🛡️ 1H Mace&#10;DPS&#10;⚔️ Carving Sword&#10;Healer&#10;✨ Hallowfall: 2"></textarea>
      <p class="modal-hint">One role per line (Tank / DPS / Healer / Support / Battlemount), then one weapon per line under it — same format as the Discord modal. Add ": N" after a line for an unnamed slot with N open spots.</p>
    </div>

    <div class="modal-actions">
      <button class="event-action-btn" id="ef-cancel">Cancel</button>
      <button class="event-action-btn" id="ef-submit">${isEdit ? 'Save changes' : 'Post event'}</button>
    </div>`;

  overlay.style.display = 'flex';
  document.getElementById('ef-cancel').addEventListener('click', closeModal);
  document.getElementById('ef-src-comp').addEventListener('click', () => setFormSource('comp'));
  document.getElementById('ef-src-manual').addEventListener('click', () => setFormSource('manual'));
  document.getElementById('ef-submit').addEventListener('click', () => submitEventForm(isEdit));
}

function setFormSource(src) {
  formCompSource = src;
  document.getElementById('ef-src-comp').classList.toggle('active', src === 'comp');
  document.getElementById('ef-src-manual').classList.toggle('active', src === 'manual');
  document.getElementById('ef-comp-wrap').style.display = src === 'comp' ? '' : 'none';
  document.getElementById('ef-manual-wrap').style.display = src === 'manual' ? '' : 'none';
}

async function submitEventForm(isEdit) {
  const type = document.getElementById('ef-type').value;
  const time = document.getElementById('ef-time').value.trim();
  const title = document.getElementById('ef-title').value.trim();
  const mass = document.getElementById('ef-mass').value.trim();
  const sets = document.getElementById('ef-sets').value.trim();

  if (!time) { showToast('Time is required.'); return; }

  const body = { type, time, title, mass, sets };
  if (!isEdit) body.channelId = document.getElementById('ef-channel').value;
  if (formCompSource === 'comp') {
    body.compKey = document.getElementById('ef-comp').value;
    if (!body.compKey) { showToast('Pick a saved composition, or switch to "Type manually".'); return; }
  } else {
    body.compositionRaw = document.getElementById('ef-manual').value;
    if (!body.compositionRaw.trim()) { showToast('Type a composition first.'); return; }
  }

  try {
    let result;
    if (isEdit) {
      result = await api(`/api/events/${encodeURIComponent(currentDetail.id)}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      result = await api('/api/events', { method: 'POST', body: JSON.stringify(body) });
    }
    closeModal();
    currentDetail = result;
    if (isEdit) {
      renderDetail();
    } else {
      openEvent(result.id);
    }
    if (result.dropped && result.dropped.length) {
      showToast(`Saved — ${result.dropped.length} sign-up${result.dropped.length === 1 ? '' : 's'} no longer matched a slot and were removed.`);
    } else {
      showToast(isEdit ? 'Event updated.' : 'Event posted.');
    }
  } catch (err) {
    showToast('Failed to save: ' + err.message);
  }
}
