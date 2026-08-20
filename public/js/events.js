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

let allEvents = [];        // list summaries from GET /api/events
let typeFilter = 'all';
let searchStr = '';
let currentDetail = null;  // full detail object from GET /api/events/:id
let channelsCache = null;  // officer only, lazy-loaded
let compOptionsCache = null; // officer only, lazy-loaded
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
    <aside class="event-signups-col" id="event-signups-col"></aside>`;

  document.getElementById('event-info-col').innerHTML = renderInfoCol(e, canManage);
  document.getElementById('event-roster-col').innerHTML = renderRosterCol(e);
  document.getElementById('event-signups-col').innerHTML = renderSignupsCol(e);

  wireDetailActions(canManage);
}

function renderInfoCol(e, canManage) {
  const mySignedRow = e.rows.find(r => r.signedUserId === window.SITE_AUTH.id);
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
        <div>You're signed up as <strong>${escapeHtml(mySignedRow.category)}</strong> — ${mySignedRow.emoji ? mySignedRow.emoji + ' ' : ''}${escapeHtml(mySignedRow.name || 'Any')}</div>
        ${!e.closed ? `<button class="event-action-btn danger" id="event-leave-btn">Leave slot</button>` : ''}
      </div>` : ''}
    ${canManage ? `
      <div class="event-action-row">
        <button class="event-action-btn" id="event-edit-btn">✏️ Edit event</button>
        ${e.compKey ? `<button class="event-action-btn" id="event-refresh-btn">🔄 Refresh from comp</button>` : ''}
        ${!e.closed ? `<button class="event-action-btn" id="event-ping-btn">⏰ Ping thread</button>` : ''}
        ${!e.closed ? `<button class="event-action-btn danger" id="event-close-btn">🔒 Close event</button>` : ''}
      </div>` : ''}
  `;
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
  const canSignup = isOpen && !e.closed && window.SITE_AUTH.loggedIn && row.itemIndex !== undefined;
  const icon = row.iconUrl
    ? `<img class="event-row-icon" src="${escapeHtml(row.iconUrl)}" alt="" loading="lazy">`
    : `<span class="event-row-icon-fallback">${emojiToHtml(row.emoji, { size: 16 })}</span>`;
  const roleColors = { Tank: 'var(--tank)', DPS: 'var(--dps)', Healer: 'var(--healer)', Support: 'var(--support)', Battlemount: 'var(--cosmic)' };

  return `
    <div class="event-row${isOpen ? ' is-open' : ''}${canSignup ? ' can-signup' : ''}${isMine ? ' is-mine' : ''}"
         ${canSignup ? `data-cat="${escapeHtml(row.category)}" data-item-index="${row.itemIndex}"` : ''}>
      <span class="event-row-role-dot" style="background:${roleColors[row.category] || 'var(--ink-faint)'}" title="${escapeHtml(row.category)}"></span>
      ${icon}
      <span class="event-row-name">${escapeHtml(row.name || 'Any')}</span>
      <span class="event-row-status${row.signedUserId ? ' filled' : ''}">${row.signedUserId ? escapeHtml(row.signedUsername) : (canSignup ? 'Open — click to sign up' : 'Open')}</span>
    </div>`;
}

function renderSignupsCol(e) {
  const signed = e.rows.filter(r => r.signedUserId);
  return `
    <div class="event-signups-head">Signups · ${signed.length}</div>
    ${signed.length === 0 ? `<div class="event-signups-empty">Nobody's signed up yet.</div>` : signed.map(r => `
      <div class="event-signup-entry">
        <span class="role-pill role-${r.category.toLowerCase()}" style="font-size:10px">${escapeHtml(r.category)}</span>
        <span class="event-signup-name">${escapeHtml(r.signedUsername)}</span>
        <span class="event-signup-weapon">${r.emoji ? emojiToHtml(r.emoji, { size: 14 }) + ' ' : ''}${escapeHtml(r.name || '')}</span>
      </div>`).join('')}
  `;
}

function wireDetailActions(canManage) {
  const leaveBtn = document.getElementById('event-leave-btn');
  if (leaveBtn) leaveBtn.addEventListener('click', handleLeave);

  document.querySelectorAll('.event-row.can-signup').forEach(row => {
    row.addEventListener('click', () => handleSignup(row.dataset.cat, Number(row.dataset.itemIndex)));
  });

  document.querySelectorAll('.event-quota-signup-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.event-quota-row');
      const cat = wrap.dataset.cat;
      const weapon = wrap.querySelector('.event-quota-select').value;
      handleQuotaSignup(cat, weapon);
    });
  });

  if (!canManage) return;
  const editBtn = document.getElementById('event-edit-btn');
  if (editBtn) editBtn.addEventListener('click', () => openEventForm('edit'));
  const refreshBtn = document.getElementById('event-refresh-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', handleRefresh);
  const pingBtn = document.getElementById('event-ping-btn');
  if (pingBtn) pingBtn.addEventListener('click', handlePing);
  const closeBtn = document.getElementById('event-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', openCloseForm);
}

/* ---------- sign-up / leave ---------- */
async function handleSignup(category, itemIndex) {
  if (!window.SITE_AUTH.loggedIn) {
    showToast('Log in with Discord to sign up.');
    return;
  }
  try {
    currentDetail = await api(`/api/events/${encodeURIComponent(currentDetail.id)}/signup`, {
      method: 'POST',
      body: JSON.stringify({ category, itemIndex }),
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
