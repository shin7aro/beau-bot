/* ─────────────────────────────────────────
   COMPOSITIONS — officer/admin editor
   Reads/writes the same `comps` data the
   Discord bot's /comp commands use.

   Page layout mirrors events.js on purpose:
   a card grid list (filterable by PVP/PVE),
   a read-only "detail view" that looks like an
   opened event (info column + party roster +
   build viewer), and the actual party-column
   editor living in a modal reached via
   "+ New composition" or "Edit composition".
───────────────────────────────────────── */
const CATEGORY_ORDER = ['Tank', 'Support', 'DPS', 'Healer', 'Battlemount'];
const TAB_LABELS = { brawl: 'Brawl', gank: 'Gank', kite: 'Kite & Clap', brawlclap: 'Brawl & Clap', tracking: 'Tracking', groupdungeon: 'Group Dungeon', avadungeon: 'Ava Dungeon' };
const COMP_TYPE_EMOJI = { PVP: '⚔️', PVE: '🐉' };

// Same role tokens events.js uses for the build-viewer card's color bar +
// role pill, so a comp's linked build looks identical whether you're
// viewing it here or from an opened event.
const EVENT_ROLE_COLORS = { healer: 'var(--healer)', support: 'var(--support)', dps: 'var(--dps)', tank: 'var(--tank)', battlemount: 'var(--cosmic)' };
const EVENT_ROLE_LABELS = { healer: 'Healer', support: 'Support', dps: 'DPS', tank: 'Tank', battlemount: 'Battlemount' };
const EVENT_FLAG_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4a1 1 0 0 1 1.45-.9L19 9.5 5.45 16.4A1 1 0 0 1 4 15.5"/></svg>`;
const TRASH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>`;

let allComps = [];       // [{ key, label, category, mainWeapon, categories, updatedAt, ... }]
let buildOptions = [];   // [{ tab, index, role, weapon }]
let serverEmojis = [];   // [{ id, name, animated, tag, url }] from /api/discord-emojis
let allBuildsCache = null; // lazy-loaded, for the read-only build viewer panel
let typeFilter = 'all';    // list view PVP/PVE filter
let currentDetailKey = null; // comp currently open in the read-only detail view
let editingKey = null;   // null = creating in the editor modal, otherwise the comp being edited
let draft = null;        // working copy of the comp currently open in the editor modal

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function buildOptionValue(o) { return `${o.tab}:${o.index}`; }

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

// Discord custom emoji tags only render inside Discord's own client — same
// fallback-to-<img> treatment events.js uses everywhere else.
function emojiToHtml(value, { size = 16, fallback = '🔹' } = {}) {
  if (!value) return `<span class="event-emoji-fallback">${fallback}</span>`;
  const m = String(value).match(/^<a?:(\w+):(\d+)>$/);
  if (m) {
    const animated = value.startsWith('<a:');
    const url = `https://cdn.discordapp.com/emojis/${m[2]}.${animated ? 'gif' : 'png'}?size=32`;
    return `<img class="event-emoji-img" src="${escapeHtml(url)}" alt="${escapeHtml(m[1])}" loading="lazy" style="width:${size}px;height:${size}px">`;
  }
  return `<span class="event-emoji-fallback">${escapeHtml(value)}</span>`;
}

async function loadAll() {
  [allComps, buildOptions, serverEmojis] = await Promise.all([
    api('/api/comps'),
    api('/api/comps-build-options'),
    api('/api/discord-emojis').catch(() => []),
  ]);
  renderList();
}

function newDraftCategories() {
  const cats = {};
  for (const cat of CATEGORY_ORDER) cats[cat] = { mode: 'items', items: [] };
  return cats;
}

// How many party columns to show, derived from the highest party index any
// item currently uses.
function computePartyCount(categories) {
  let max = 0;
  for (const cat of CATEGORY_ORDER) {
    for (const item of categories[cat].items) {
      if (typeof item.party === 'number' && item.party > max) max = item.party;
    }
  }
  return max + 1;
}

function totalSlotsFor(categories) {
  return CATEGORY_ORDER.reduce((sum, cat) => sum + ((categories[cat] && categories[cat].items) ? categories[cat].items.length : 0), 0);
}

/* ================= LIST VIEW ================= */
function wireListControls() {
  document.querySelectorAll('#comp-type-filter .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      typeFilter = btn.dataset.type;
      document.querySelectorAll('#comp-type-filter .filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderList();
    });
  });
}

function renderList() {
  const grid = document.getElementById('comp-card-grid');
  const empty = document.getElementById('comp-empty');
  const countLabel = document.getElementById('comp-count-label');

  let list = allComps;
  if (typeFilter !== 'all') list = list.filter(c => c.category === typeFilter);
  list = [...list].sort((a, b) => a.label.localeCompare(b.label));

  countLabel.textContent = `${list.length} composition${list.length === 1 ? '' : 's'}`;
  empty.style.display = list.length === 0 ? '' : 'none';

  grid.innerHTML = list.map(c => {
    const partyCount = computePartyCount(c.categories);
    const slots = totalSlotsFor(c.categories);
    const weaponIcon = c.mainWeapon && window.imgUrl ? window.imgUrl(c.mainWeapon) : null;
    return `
    <div class="event-card" data-key="${escapeHtml(c.key)}">
      <div class="event-card-top">
        ${c.category ? `<span class="event-type-badge type-${c.category}">${COMP_TYPE_EMOJI[c.category] || ''} ${c.category}</span>` : '<span class="comp-card-untagged">Untagged</span>'}
      </div>
      <div class="comp-card-title-row">
        ${weaponIcon ? `<img class="comp-card-weapon-icon" src="${escapeHtml(weaponIcon)}" alt="" loading="lazy">` : ''}
        <h3 class="event-card-title">${escapeHtml(c.label)}</h3>
      </div>
      <div class="event-card-meta">
        <span>🧩 ${partyCount} part${partyCount === 1 ? 'y' : 'ies'}</span>
        <span>${slots} slot${slots === 1 ? '' : 's'}</span>
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => openComp(card.dataset.key));
  });
}

/* ================= READ-ONLY DETAIL VIEW ================= */
function openComp(key) {
  const comp = allComps.find(c => c.key === key);
  if (!comp) return;
  currentDetailKey = key;
  document.getElementById('comps-list-view').style.display = 'none';
  document.getElementById('comp-detail-view').style.display = '';
  renderCompDetail(comp);
}

function closeCompDetail() {
  currentDetailKey = null;
  document.getElementById('comp-detail-view').style.display = 'none';
  document.getElementById('comps-list-view').style.display = '';
  renderList();
}

function renderCompDetail(comp) {
  const layout = document.getElementById('comp-detail-layout');
  layout.innerHTML = `
    <aside class="event-info-col" id="comp-info-col"></aside>
    <div class="event-roster-col" id="comp-roster-col"></div>
    <aside class="event-details-col" id="comp-details-col"></aside>`;

  document.getElementById('comp-info-col').innerHTML = renderCompInfoCol(comp);
  document.getElementById('comp-roster-col').innerHTML = renderCompRosterCol(comp);
  renderCompDetailsPlaceholder();

  document.getElementById('comp-edit-btn').addEventListener('click', () => openEditor(comp.key));
  wireCompRosterActions();
}

function renderCompInfoCol(comp) {
  const weaponIcon = comp.mainWeapon && window.imgUrl ? window.imgUrl(comp.mainWeapon) : null;
  const partyCount = computePartyCount(comp.categories);
  const slots = totalSlotsFor(comp.categories);
  return `
    <div class="event-info-card">
      ${comp.category ? `<span class="event-type-badge type-${comp.category}">${COMP_TYPE_EMOJI[comp.category] || ''} ${comp.category}</span>` : ''}
      <h2 class="event-info-title">
        ${weaponIcon ? `<img class="comp-card-weapon-icon" src="${escapeHtml(weaponIcon)}" alt="" style="vertical-align:-4px;margin-right:6px">` : ''}${escapeHtml(comp.label)}
      </h2>
      <div class="event-info-row"><span class="event-info-label">Parties</span><span class="event-info-value">${partyCount}</span></div>
      <div class="event-info-row"><span class="event-info-label">Total slots</span><span class="event-info-value">${slots}</span></div>
    </div>
    <div class="event-action-row">
      <button class="event-action-btn" id="comp-edit-btn">✏️ Edit composition</button>
    </div>`;
}

function renderCompRosterRow(cat, item) {
  const isMultiChoice = !!item.options;
  let namePill;
  if (isMultiChoice) {
    const optionPills = item.options.map((o, oi) => {
      const iconUrl = window.imgUrl ? window.imgUrl(o.name) : null;
      const icon = iconUrl
        ? `<img class="event-row-pill-icon" src="${escapeHtml(iconUrl)}" alt="" loading="lazy">`
        : `<span class="event-row-pill-icon-fallback">${emojiToHtml(o.emoji, { size: 15 })}</span>`;
      return `<button type="button" class="event-row-option-pill event-row-build-trigger role-${cat.toLowerCase()}"
                data-cat="${escapeHtml(cat)}" data-build-tab="${escapeHtml(o.buildTab || '')}" data-build-id="${o.buildId ?? ''}"
                title="View linked build">${icon}<span class="event-row-name-text">${escapeHtml(o.name)}</span></button>`;
    }).join('');
    namePill = `<div class="event-row-name-pill-group">${optionPills}</div>`;
  } else {
    const iconUrl = window.imgUrl ? window.imgUrl(item.name) : null;
    const icon = iconUrl
      ? `<img class="event-row-pill-icon" src="${escapeHtml(iconUrl)}" alt="" loading="lazy">`
      : `<span class="event-row-pill-icon-fallback">${emojiToHtml(item.emoji, { size: 15 })}</span>`;
    namePill = `<button type="button" class="event-row-name-pill event-row-build-trigger role-${cat.toLowerCase()}"
                  data-cat="${escapeHtml(cat)}" data-build-tab="${escapeHtml(item.buildTab || '')}" data-build-id="${item.buildId ?? ''}"
                  title="View linked build">${icon}<span class="event-row-name-text">${escapeHtml(item.name || 'Any')}</span></button>`;
  }
  return `<div class="event-row">${namePill}<span class="event-row-status">Slot</span></div>`;
}

function renderCompRosterCol(comp) {
  const parties = {};
  for (const cat of CATEGORY_ORDER) {
    const catData = comp.categories[cat];
    if (!catData || !catData.items) continue;
    catData.items.forEach(item => {
      const p = item.party || 0;
      (parties[p] = parties[p] || []).push({ cat, item });
    });
  }
  const partyKeys = Object.keys(parties).sort((a, b) => Number(a) - Number(b));
  if (partyKeys.length === 0) return '<p class="event-details-empty">No roles in this composition yet — click "Edit composition" to add some.</p>';

  const hasMultipleParties = partyKeys.length > 1;
  return `<div class="event-party-grid">${partyKeys.map(pk => `
    <div class="event-party-card">
      <div class="event-party-head">${hasMultipleParties ? `Party ${Number(pk) + 1}` : 'Roster'}</div>
      ${parties[pk].map(({ cat, item }) => renderCompRosterRow(cat, item)).join('')}
    </div>`).join('')}</div>`;
}

function wireCompRosterActions() {
  document.querySelectorAll('#comp-roster-col .event-row-build-trigger').forEach(btn => {
    btn.addEventListener('click', () => showCompBuildPanel(btn.dataset.cat, btn.dataset.buildTab || null, btn.dataset.buildId));
  });
}

/* ---------- build viewer panel (identical markup to events.js's) ---------- */
function renderCompDetailsPlaceholder() {
  const col = document.getElementById('comp-details-col');
  if (!col) return;
  col.innerHTML = `<div class="event-details-head">Details</div><p class="event-details-empty">Click a role to see its linked build.</p>`;
}

function renderGearSlot(label, name) {
  if (!name && !label) return `<div class="slot-card empty spacer"></div>`;
  if (!name) return `
    <div class="slot-card empty">
      <div class="slot-empty-icon"></div>
      <div class="slot-info"><span class="slot-label">${escapeHtml(label)}</span><span class="slot-name">—</span></div>
    </div>`;
  const url = window.imgUrl ? window.imgUrl(name) : null;
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

async function showCompBuildPanel(cat, buildTab, buildIdStr) {
  const col = document.getElementById('comp-details-col');
  if (!col) return;
  col.innerHTML = `<div class="event-details-head">Details</div><p class="event-details-empty">Loading build…</p>`;

  const buildId = buildIdStr === '' || buildIdStr == null ? null : Number(buildIdStr);
  let build = null;
  if (buildTab && buildId != null) {
    try {
      const all = await ensureAllBuildsLoaded();
      build = (all[buildTab] || [])[buildId] || null;
    } catch (err) {
      showToast('Failed to load build: ' + err.message);
    }
  }

  const roleKey = cat.toLowerCase();
  const color = EVENT_ROLE_COLORS[roleKey] || 'var(--line-2)';
  const roleLabel = EVENT_ROLE_LABELS[roleKey] || cat;

  col.innerHTML = `
    <div class="event-details-head">Details</div>
    <div class="event-build-panel">
      ${build ? `
        <div class="card-header">
          <div class="card-role-bar" style="background:${color}"></div>
          <div class="card-title-row"><div class="card-title">${escapeHtml(build.weapon || 'Unnamed build')}</div></div>
          <div class="card-meta"><span class="role-pill role-${roleKey}"><span class="role-pill-dot" style="background:${color}"></span>${escapeHtml(roleLabel)}</span></div>
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
      ` : `<p class="event-details-empty">No build linked for this role yet — open the editor to link one.</p>`}
    </div>`;

  const grid = col.querySelector('.event-build-slots');
  const header = col.querySelector('.card-header');
  if (grid) requestAnimationFrame(() => requestAnimationFrame(() => grid.classList.add('revealed')));
  if (header) setTimeout(() => header.classList.add('shimmer'), 750);
}

/* ================= EDITOR MODAL ================= */
function wireModalOverlay() {
  const overlay = document.getElementById('comp-form-overlay');
  overlay.addEventListener('click', e => { if (e.target === overlay) closeEditor(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.style.display !== 'none') closeEditor(); });
}

function openEditor(key) {
  if (key) selectComp(key); else startNewComp();
  document.getElementById('comp-form-overlay').style.display = 'flex';
}

function closeEditor() {
  document.getElementById('comp-form-overlay').style.display = 'none';
  editingKey = null;
  draft = null;
}

function selectComp(key) {
  const comp = allComps.find(c => c.key === key);
  if (!comp) return;
  editingKey = key;
  draft = {
    label: comp.label,
    category: comp.category || null,
    mainWeapon: comp.mainWeapon || null,
    categories: JSON.parse(JSON.stringify(comp.categories)),
  };
  for (const cat of CATEGORY_ORDER) if (!draft.categories[cat]) draft.categories[cat] = { mode: 'items', items: [] };
  draft.partyCount = computePartyCount(draft.categories);
  renderEditor();
}

function startNewComp() {
  editingKey = null;
  draft = { label: '', category: null, mainWeapon: null, categories: newDraftCategories(), partyCount: 1 };
  renderEditor();
}

/* ---------- emoji picker (per role line) — picker only, no typed shortcode ---------- */
function emojiPreviewHtml(value) {
  if (!value) return '<span class="emoji-preview-empty">+</span>';
  const m = value.match(/^<a?:(\w+):(\d+)>$/);
  if (m) {
    const known = serverEmojis.find(e => e.id === m[2]);
    const url = known ? known.url : `https://cdn.discordapp.com/emojis/${m[2]}.${value.startsWith('<a:') ? 'gif' : 'png'}?size=32`;
    return `<img class="emoji-preview-img" src="${url}" alt="${escapeHtml(m[1])}">`;
  }
  return `<span class="emoji-preview-char">${escapeHtml(value)}</span>`;
}

function closeEmojiPopover() {
  const pop = document.getElementById('emoji-popover');
  if (pop) pop.remove();
  document.removeEventListener('mousedown', handleEmojiPopoverOutsideClick, true);
}

function handleEmojiPopoverOutsideClick(e) {
  const pop = document.getElementById('emoji-popover');
  if (pop && !pop.contains(e.target)) closeEmojiPopover();
}

function openEmojiPopover(anchorBtn, cat, i, optionIndex) {
  closeEmojiPopover();
  const pop = document.createElement('div');
  pop.id = 'emoji-popover';
  pop.className = 'emoji-popover';
  pop.innerHTML = `
    <input type="text" class="emoji-popover-search" placeholder="Search emoji…" autocomplete="off">
    <div class="emoji-popover-grid"></div>
    ${serverEmojis.length === 0 ? '<p class="section-sub" style="padding:0 2px">No custom server emojis found — check the bot has emoji permissions and GUILD_ID is set.</p>' : ''}`;
  document.body.appendChild(pop);

  const rect = anchorBtn.getBoundingClientRect();
  pop.style.top = `${window.scrollY + rect.bottom + 6}px`;
  pop.style.left = `${window.scrollX + rect.left}px`;

  const grid = pop.querySelector('.emoji-popover-grid');
  const renderGrid = (filter = '') => {
    const q = filter.toLowerCase();
    const list = serverEmojis.filter(e => !q || e.name.toLowerCase().includes(q));
    const clearTile = `<button type="button" class="emoji-popover-item emoji-popover-clear" data-tag="" title="No emoji">✕</button>`;
    grid.innerHTML = clearTile + list.map(e =>
      `<button type="button" class="emoji-popover-item" data-tag="${escapeHtml(e.tag)}" title="${escapeHtml(e.name)}">
         <img src="${e.url}" alt="${escapeHtml(e.name)}">
       </button>`
    ).join('');

    grid.querySelectorAll('.emoji-popover-item').forEach(btn => btn.addEventListener('click', () => {
      const item = draft.categories[cat].items[i];
      const target = optionIndex !== undefined ? item.options[optionIndex] : item;
      target.emoji = btn.dataset.tag || null;
      closeEmojiPopover();
      renderEditor();
    }));
  };
  renderGrid();
  pop.querySelector('.emoji-popover-search').addEventListener('input', e => renderGrid(e.target.value));
  pop.querySelector('.emoji-popover-search').focus();

  setTimeout(() => document.addEventListener('mousedown', handleEmojiPopoverOutsideClick, true), 0);
}

/* ---------- main weapon picker (comp header) — searchable text list of
   window.ITEM_MAP weapon names, since there are far too many to grid like
   the emoji picker does. */
function closeWeaponPopover() {
  const pop = document.getElementById('comp-weapon-popover');
  if (pop) pop.remove();
  document.removeEventListener('mousedown', handleWeaponPopoverOutsideClick, true);
}

function handleWeaponPopoverOutsideClick(e) {
  const pop = document.getElementById('comp-weapon-popover');
  if (pop && !pop.contains(e.target)) closeWeaponPopover();
}

function openWeaponPopover(anchorBtn) {
  closeWeaponPopover();
  const pop = document.createElement('div');
  pop.id = 'comp-weapon-popover';
  pop.className = 'comp-weapon-popover';
  pop.innerHTML = `
    <input type="text" class="comp-weapon-popover-search" placeholder="Search weapon…" autocomplete="off">
    <div class="comp-weapon-popover-list"></div>`;
  document.body.appendChild(pop);

  const rect = anchorBtn.getBoundingClientRect();
  pop.style.top = `${window.scrollY + rect.bottom + 6}px`;
  pop.style.left = `${window.scrollX + rect.left}px`;

  const list = pop.querySelector('.comp-weapon-popover-list');
  const names = Object.keys(window.ITEM_MAP || {});
  const renderWeaponList = (filter = '') => {
    const q = filter.trim().toLowerCase();
    const matches = q ? names.filter(n => n.toLowerCase().includes(q)) : names;
    const clearItem = `<button type="button" class="comp-weapon-popover-item" data-name="">✕ <span>No weapon icon</span></button>`;
    list.innerHTML = clearItem + (matches.length === 0
      ? `<p class="comp-weapon-popover-empty">No matches.</p>`
      : matches.slice(0, 80).map(n => `
          <button type="button" class="comp-weapon-popover-item" data-name="${escapeHtml(n)}">
            <img src="${escapeHtml(window.imgUrl(n))}" alt="" loading="lazy">
            <span>${escapeHtml(n)}</span>
          </button>`).join(''));

    list.querySelectorAll('.comp-weapon-popover-item').forEach(btn => btn.addEventListener('click', () => {
      draft.mainWeapon = btn.dataset.name || null;
      closeWeaponPopover();
      renderEditor();
    }));
  };
  renderWeaponList();
  pop.querySelector('.comp-weapon-popover-search').addEventListener('input', e => renderWeaponList(e.target.value));
  pop.querySelector('.comp-weapon-popover-search').focus();

  setTimeout(() => document.addEventListener('mousedown', handleWeaponPopoverOutsideClick, true), 0);
}

/* ---------- build dropdown, filtered to the row's own role ---------- */
function buildOptionsHtml(selectedTab, selectedIndex, cat) {
  let html = `<option value=""${selectedTab == null ? ' selected' : ''}>No build yet</option>`;
  const roleFiltered = buildOptions.filter(o => o.role && o.role.toLowerCase() === cat.toLowerCase());
  const byTab = {};
  roleFiltered.forEach(o => { (byTab[o.tab] = byTab[o.tab] || []).push(o); });
  for (const tab of Object.keys(byTab)) {
    html += `<optgroup label="${TAB_LABELS[tab] || tab}">`;
    html += byTab[tab].map(o => {
      const sel = (o.tab === selectedTab && o.index === selectedIndex) ? ' selected' : '';
      return `<option value="${buildOptionValue(o)}"${sel}>${escapeHtml(o.weapon)}</option>`;
    }).join('');
    html += `</optgroup>`;
  }
  const stillLinkedButFiltered = selectedTab != null && !roleFiltered.some(o => o.tab === selectedTab && o.index === selectedIndex);
  if (stillLinkedButFiltered) {
    const linked = buildOptions.find(o => o.tab === selectedTab && o.index === selectedIndex);
    if (linked) html += `<option value="${buildOptionValue(linked)}" selected>${escapeHtml(linked.weapon)} — different role</option>`;
  }
  return html;
}

/* ---------- party columns ---------- */
function renderMultiChoiceRow(cat, i, item) {
  const optionsHtml = item.options.map((opt, oi) => `
    <div class="comp-item-option" data-cat="${cat}" data-i="${i}" data-oi="${oi}">
      <button type="button" class="comp-item-emoji-pick comp-item-option-emoji-pick" title="Pick a server emoji">${emojiPreviewHtml(opt.emoji)}</button>
      <input type="text" class="comp-item-name comp-item-option-name" value="${escapeHtml(opt.name)}" placeholder="Weapon name">
      <select class="comp-item-build comp-item-option-build">${buildOptionsHtml(opt.buildTab, opt.buildId, cat)}</select>
      <button type="button" class="comp-item-option-remove" title="Remove this choice">${TRASH_ICON}</button>
    </div>`).join('');
  return `
    <div class="comp-item-row comp-item-row-multi" data-cat="${cat}" data-i="${i}">
      <div class="comp-item-options">
        ${optionsHtml}
        <button type="button" class="btn comp-item-add-option-btn" data-cat="${cat}" data-i="${i}">+ Add choice</button>
      </div>
      <button type="button" class="comp-item-remove" title="Remove line">${TRASH_ICON}</button>
    </div>`;
}

function renderPartyColumn(p) {
  const categoriesHtml = CATEGORY_ORDER.map(cat => {
    const items = draft.categories[cat].items;
    const rows = items
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => (item.party || 0) === p)
      .map(({ item, i }) => item.options ? renderMultiChoiceRow(cat, i, item) : `
        <div class="comp-item-row" data-cat="${cat}" data-i="${i}">
          <button type="button" class="comp-item-emoji-pick" title="Pick a server emoji">${emojiPreviewHtml(item.emoji)}</button>
          <input type="text" class="comp-item-name" value="${escapeHtml(item.name)}" placeholder="Weapon / role name">
          <select class="comp-item-build">${buildOptionsHtml(item.buildTab, item.buildId, cat)}</select>
          <button type="button" class="btn comp-item-add-choice-btn" data-cat="${cat}" data-i="${i}" title="Give this line more than one acceptable weapon">+ Choice</button>
          <button type="button" class="comp-item-remove" title="Remove">${TRASH_ICON}</button>
        </div>`)
      .join('');
    return `
      <div class="comp-category" data-cat="${cat}">
        <div class="comp-category-head">
          <span class="role-pill role-${cat.toLowerCase()}">${cat}</span>
          <button type="button" class="btn comp-add-item-btn" data-cat="${cat}" data-party="${p}">+ Add line</button>
        </div>
        <div class="comp-items-list">${rows || '<p class="section-sub">No lines yet.</p>'}</div>
      </div>`;
  }).join('');

  const isLast = p === draft.partyCount - 1;
  const canRemove = isLast && p > 0;
  return `
    <div class="comp-party-col" data-party="${p}">
      <div class="comp-party-head">
        <span>Party ${p + 1}</span>
        ${canRemove ? `<button type="button" class="comp-party-remove-btn" id="comp-party-remove-btn" title="Remove this party">${TRASH_ICON}</button>` : ''}
      </div>
      ${categoriesHtml}
    </div>`;
}

function removeLastParty() {
  const lastIdx = draft.partyCount - 1;
  if (lastIdx === 0) return;
  const hasItems = CATEGORY_ORDER.some(cat => draft.categories[cat].items.some(it => (it.party || 0) === lastIdx));
  if (hasItems) {
    showToast(`Party ${lastIdx + 1} still has role lines — remove or move them to another party first.`);
    return;
  }
  draft.partyCount--;
  renderEditor();
}

/* ---------- editor render ---------- */
function renderEditor() {
  const card = document.getElementById('comp-form-card');
  const partyColumnsHtml = Array.from({ length: draft.partyCount }, (_, p) => renderPartyColumn(p)).join('');
  const weaponIconUrl = draft.mainWeapon && window.imgUrl ? window.imgUrl(draft.mainWeapon) : null;

  card.innerHTML = `
    <div class="card-header">
      <div class="comp-editor-head-row">
        <input type="text" id="comp-label-input" class="comp-label-input" value="${escapeHtml(draft.label)}" placeholder="Composition name">
        <select id="comp-category-select" class="comp-category-select">
          <option value="">No category</option>
          <option value="PVP" ${draft.category === 'PVP' ? 'selected' : ''}>⚔️ PVP</option>
          <option value="PVE" ${draft.category === 'PVE' ? 'selected' : ''}>🐉 PVE</option>
        </select>
        <button type="button" class="comp-weapon-pick" id="comp-weapon-pick-btn" title="Pick the main weapon icon shown on this comp's card">
          ${weaponIconUrl ? `<img src="${escapeHtml(weaponIconUrl)}" alt="">` : '➕'}
          <span>${draft.mainWeapon ? escapeHtml(draft.mainWeapon) : 'Main weapon'}</span>
        </button>
        ${editingKey ? `<button class="card-delete-btn" type="button" id="comp-delete-btn" title="Delete this composition">${TRASH_ICON}</button>` : ''}
      </div>
    </div>
    <div class="comp-parties-toolbar">
      <button type="button" class="btn" id="comp-add-party-btn">+ Add party</button>
    </div>
    <div class="comp-parties-row">${partyColumnsHtml}</div>
    <div class="comp-save-row">
      <button class="btn" id="comp-cancel-btn" style="margin-right:auto">Cancel</button>
      <button class="btn" id="comp-save-btn"><span class="btn-label">${editingKey ? 'Save changes' : 'Create composition'}</span></button>
    </div>`;

  // Line-level controls only (single-choice rows) — option-level controls
  // inside a multi-choice row are wired separately below.
  card.querySelectorAll('.comp-item-emoji-pick:not(.comp-item-option-emoji-pick)').forEach(btn => btn.addEventListener('click', e => {
    const row = e.target.closest('.comp-item-row');
    openEmojiPopover(btn, row.dataset.cat, +row.dataset.i);
  }));
  card.querySelectorAll('.comp-item-name:not(.comp-item-option-name)').forEach(inp => inp.addEventListener('input', e => {
    const row = e.target.closest('.comp-item-row');
    draft.categories[row.dataset.cat].items[+row.dataset.i].name = e.target.value;
  }));
  card.querySelectorAll('.comp-item-build:not(.comp-item-option-build)').forEach(sel => sel.addEventListener('change', e => {
    const row = e.target.closest('.comp-item-row');
    const item = draft.categories[row.dataset.cat].items[+row.dataset.i];
    if (!e.target.value) { item.buildTab = null; item.buildId = null; }
    else { const [tab, idx] = e.target.value.split(':'); item.buildTab = tab; item.buildId = parseInt(idx, 10); }
  }));
  card.querySelectorAll('.comp-item-remove').forEach(btn => btn.addEventListener('click', e => {
    const row = e.target.closest('.comp-item-row');
    draft.categories[row.dataset.cat].items.splice(+row.dataset.i, 1);
    renderEditor();
  }));
  card.querySelectorAll('.comp-add-item-btn').forEach(btn => btn.addEventListener('click', () => {
    draft.categories[btn.dataset.cat].items.push({ name: '', emoji: null, party: +btn.dataset.party, signups: [], buildId: null, buildTab: null });
    renderEditor();
  }));

  card.querySelectorAll('.comp-item-add-choice-btn').forEach(btn => btn.addEventListener('click', () => {
    const item = draft.categories[btn.dataset.cat].items[+btn.dataset.i];
    draft.categories[btn.dataset.cat].items[+btn.dataset.i] = {
      options: [
        { name: item.name || '', emoji: item.emoji || null, buildId: item.buildId ?? null, buildTab: item.buildTab ?? null },
        { name: '', emoji: null, buildId: null, buildTab: null },
      ],
      party: item.party || 0,
      signups: [],
      signedOptionIndex: null,
    };
    renderEditor();
  }));

  card.querySelectorAll('.comp-item-option-emoji-pick').forEach(btn => btn.addEventListener('click', e => {
    const opt = e.target.closest('.comp-item-option');
    openEmojiPopover(btn, opt.dataset.cat, +opt.dataset.i, +opt.dataset.oi);
  }));
  card.querySelectorAll('.comp-item-option-name').forEach(inp => inp.addEventListener('input', e => {
    const opt = e.target.closest('.comp-item-option');
    draft.categories[opt.dataset.cat].items[+opt.dataset.i].options[+opt.dataset.oi].name = e.target.value;
  }));
  card.querySelectorAll('.comp-item-option-build').forEach(sel => sel.addEventListener('change', e => {
    const opt = e.target.closest('.comp-item-option');
    const option = draft.categories[opt.dataset.cat].items[+opt.dataset.i].options[+opt.dataset.oi];
    if (!e.target.value) { option.buildTab = null; option.buildId = null; }
    else { const [tab, idx] = e.target.value.split(':'); option.buildTab = tab; option.buildId = parseInt(idx, 10); }
  }));
  card.querySelectorAll('.comp-item-add-option-btn').forEach(btn => btn.addEventListener('click', () => {
    draft.categories[btn.dataset.cat].items[+btn.dataset.i].options.push({ name: '', emoji: null, buildId: null, buildTab: null });
    renderEditor();
  }));
  card.querySelectorAll('.comp-item-option-remove').forEach(btn => btn.addEventListener('click', e => {
    const opt = e.target.closest('.comp-item-option');
    const item = draft.categories[opt.dataset.cat].items[+opt.dataset.i];
    item.options.splice(+opt.dataset.oi, 1);
    if (item.options.length < 2) {
      const last = item.options[0] || { name: '', emoji: null, buildId: null, buildTab: null };
      draft.categories[opt.dataset.cat].items[+opt.dataset.i] = {
        name: last.name, emoji: last.emoji, party: item.party || 0, signups: [],
        buildId: last.buildId ?? null, buildTab: last.buildTab ?? null,
      };
    }
    renderEditor();
  }));

  document.getElementById('comp-label-input').addEventListener('input', e => { draft.label = e.target.value; });
  document.getElementById('comp-category-select').addEventListener('change', e => { draft.category = e.target.value || null; });
  document.getElementById('comp-weapon-pick-btn').addEventListener('click', e => openWeaponPopover(e.currentTarget));
  document.getElementById('comp-cancel-btn').addEventListener('click', closeEditor);
  document.getElementById('comp-add-party-btn').addEventListener('click', () => { draft.partyCount++; renderEditor(); });
  const removePartyBtn = document.getElementById('comp-party-remove-btn');
  if (removePartyBtn) removePartyBtn.addEventListener('click', removeLastParty);

  const deleteBtn = document.getElementById('comp-delete-btn');
  if (deleteBtn) deleteBtn.addEventListener('click', async () => {
    if (!confirm(`Delete "${draft.label}"? This can't be undone.`)) return;
    await api(`/api/comps/${editingKey}`, { method: 'DELETE' });
    closeEditor();
    if (currentDetailKey) closeCompDetail();
    await loadAll();
  });

  document.getElementById('comp-save-btn').addEventListener('click', saveDraft);
}

async function saveDraft() {
  const label = draft.label.trim();
  if (!label) { showToast('Give the composition a name first.'); return; }
  const hasAnyItem = CATEGORY_ORDER.some(cat => draft.categories[cat].items.some(it =>
    it.options ? it.options.some(o => o.name.trim()) : (it.name || '').trim()
  ));
  if (!hasAnyItem) { showToast('Add at least one role line first.'); return; }

  const isEdit = !!editingKey;
  const body = { categories: draft.categories, category: draft.category, mainWeapon: draft.mainWeapon };

  try {
    let result;
    if (isEdit) {
      result = await api(`/api/comps/${editingKey}`, { method: 'PUT', body: JSON.stringify({ ...body, newLabel: label }) });
    } else {
      result = await api('/api/comps', { method: 'POST', body: JSON.stringify({ ...body, label }) });
    }
    closeEditor();
    await loadAll();
    openComp(result.key);
    showToast(isEdit ? 'Composition updated.' : 'Composition created.');
  } catch (err) {
    showToast('Failed to save: ' + err.message);
  }
}

/* ================= INIT ================= */
async function init() {
  await window.SITE_AUTH_READY;
  if (!isOfficerOrAdmin()) {
    document.getElementById('gate-message').style.display = '';
    return;
  }
  document.getElementById('comps-list-view').style.display = '';

  wireListControls();
  wireModalOverlay();
  document.getElementById('comp-back-btn').addEventListener('click', closeCompDetail);
  document.getElementById('new-comp-btn').addEventListener('click', () => openEditor(null));

  try {
    await loadAll();
  } catch (err) {
    showToast('Failed to load compositions: ' + err.message);
  }
}

init();
