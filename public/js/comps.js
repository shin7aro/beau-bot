/* ─────────────────────────────────────────
   COMPOSITIONS — visual card list, viewer & editor
   Reads/writes the same `comps` data the
   Discord bot's /comp commands use.
───────────────────────────────────────── */
const CATEGORY_ORDER = ['Tank', 'Support', 'DPS', 'Healer', 'Battlemount'];
const TAB_LABELS = { brawl: 'Brawl', gank: 'Gank', kite: 'Kite & Clap', brawlclap: 'Brawl & Clap', tracking: 'Tracking', groupdungeon: 'Group Dungeon', avadungeon: 'Ava Dungeon' };
const EVENT_TYPE_LABELS = { PVP: 'PvP', PVE: 'PvE', Gank: 'Gank' };

let allComps = [];       // [{ key, label, categories, eventType, updatedAt, ... }]
let buildOptions = [];   // [{ tab, index, role, weapon }]
let weaponEmojiMap = {}; // { "Broadsword": "<:tag:id>", ... } from /api/weapon-emojis
let allBuildsCache = null; // lazy-loaded full builds list
let viewingKey = null;   // currently selected comp key in read-only viewer
let editingKey = null;   // null = creating new, otherwise key of comp being edited
let draft = null;        // working copy of the comp currently shown in the editor
let searchStr = '';
let typeFilter = 'all';  // all / PVP / PVE / Gank

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

async function loadAll() {
  let weaponAliases;
  [allComps, buildOptions, weaponEmojiMap, weaponAliases] = await Promise.all([
    api('/api/comps'),
    api('/api/comps-build-options'),
    api('/api/weapon-emojis').catch(() => ({})),
    api('/api/weapon-aliases').catch(() => ({})),
  ]);
  window.WEAPON_ALIASES = weaponAliases;
  renderCompGrid();
}

/* ---------- helper: expand comp items into rows ---------- */
function getCompRows(comp) {
  const rows = [];
  if (!comp || !comp.categories) return rows;
  for (const cat of CATEGORY_ORDER) {
    const cData = comp.categories[cat];
    if (!cData || !Array.isArray(cData.items)) continue;
    cData.items.forEach((item, itemIndex) => {
      const party = typeof item.party === 'number' ? item.party : 0;
      if (item.options && Array.isArray(item.options)) {
        rows.push({
          category: cat,
          party,
          itemIndex,
          options: item.options.map(o => ({
            name: o.name,
            emoji: o.emoji,
            iconUrl: window.imgUrl ? window.imgUrl(o.name) : null,
            buildTab: o.buildTab,
            buildId: o.buildId,
          })),
        });
      } else {
        rows.push({
          category: cat,
          name: item.name,
          emoji: item.emoji,
          party,
          itemIndex,
          iconUrl: window.imgUrl ? window.imgUrl(item.name) : null,
          buildTab: item.buildTab,
          buildId: item.buildId,
        });
      }
    });
  }
  return rows;
}

function countCompSlots(comp) {
  return getCompRows(comp).length;
}

function getCompRoleCounts(comp) {
  const counts = {};
  const rows = getCompRows(comp);
  for (const row of rows) {
    counts[row.category] = (counts[row.category] || 0) + 1;
  }
  return counts;
}

/* ─────────────────────────────────────────
   1. LIST VIEW: COMP CARDS GRID
───────────────────────────────────────── */
function renderCompGrid() {
  const grid = document.getElementById('comp-card-grid');
  const empty = document.getElementById('comp-empty');
  const countLabel = document.getElementById('comp-count-label');

  let list = allComps;
  if (typeFilter !== 'all') {
    list = list.filter(c => c.eventType === typeFilter);
  }
  if (searchStr) {
    list = list.filter(c => c.label.toLowerCase().includes(searchStr));
  }

  countLabel.textContent = `${list.length} composition${list.length === 1 ? '' : 's'}`;
  empty.style.display = list.length === 0 ? '' : 'none';

  grid.innerHTML = list.map(c => {
    const totalSlots = countCompSlots(c);
    const roleCounts = getCompRoleCounts(c);
    const rolePillsHtml = CATEGORY_ORDER
      .filter(cat => roleCounts[cat])
      .map(cat => `<span class="comp-card-role-chip role-${cat.toLowerCase()}">${cat}: ${roleCounts[cat]}</span>`)
      .join('');

    const eventTypeLabel = c.eventType ? EVENT_TYPE_LABELS[c.eventType] || c.eventType : 'Untagged';
    const eventTypeBadgeClass = c.eventType ? `type-${c.eventType}` : 'type-untagged';
    const creatorName = c.createdBy || 'Unknown';

    // Icon weapon: use iconWeapon if available, otherwise fallback to first tank weapon
    let iconWeapon = c.iconWeapon;
    if (!iconWeapon && c.categories && c.categories.Tank && c.categories.Tank.items && c.categories.Tank.items.length > 0) {
      const firstTankItem = c.categories.Tank.items[0];
      iconWeapon = firstTankItem.options ? (firstTankItem.options[0]?.name || null) : firstTankItem.name;
    }
    const iconUrl = iconWeapon && window.imgUrl ? window.imgUrl(iconWeapon) : null;

    return `
      <div class="comp-card event-card" data-key="${escapeHtml(c.key)}">
        <div class="comp-card-header">
          <h3 class="comp-card-title">${escapeHtml(c.label)}</h3>
          <span class="event-type-badge ${eventTypeBadgeClass}">${eventTypeLabel}</span>
          ${iconUrl ? `<img class="comp-card-icon" src="${escapeHtml(iconUrl)}" alt="" loading="lazy">` : '<div class="comp-card-icon-placeholder"></div>'}
        </div>
        <div class="event-card-meta comp-card-meta">
          <span>Total slots: <strong>${totalSlots}</strong></span>
          <div class="comp-card-roles">${rolePillsHtml || '<span style="color:var(--ink-faint)">No roles added</span>'}</div>
        </div>
        <div class="comp-card-footer">
          <span class="comp-card-creator">Created by ${escapeHtml(creatorName)}</span>
        </div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.comp-card').forEach(card => {
    card.addEventListener('click', () => openViewer(card.dataset.key));
  });
}

/* ─────────────────────────────────────────
   2. COMP VIEWER (READ-ONLY)
───────────────────────────────────────── */
function openViewer(key) {
  const comp = allComps.find(c => c.key === key);
  if (!comp) return;
  viewingKey = key;
  location.hash = '#c/' + encodeURIComponent(key);

  document.getElementById('comps-list-view').style.display = 'none';
  document.getElementById('comps-editor-view').style.display = 'none';
  document.getElementById('comps-viewer-view').style.display = '';

  renderViewer(comp);
}

function closeViewer() {
  viewingKey = null;
  history.replaceState(null, '', location.pathname + location.search);
  document.getElementById('comps-viewer-view').style.display = 'none';
  document.getElementById('comps-editor-view').style.display = 'none';
  document.getElementById('comps-list-view').style.display = '';
  renderCompGrid();
}

function renderViewer(comp) {
  const rows = getCompRows(comp);
  const totalSlots = rows.length;
  const roleCounts = getCompRoleCounts(comp);

  // Role counter header bar
  const counterRow = document.getElementById('comp-viewer-role-counter-row');
  const rolePillsHtml = CATEGORY_ORDER
    .filter(cat => roleCounts[cat])
    .map(cat => `
      <span class="role-count-pill role-${cat.toLowerCase()}">
        <span class="role-count-name">${escapeHtml(cat)}</span>
        <span class="role-count-num">${roleCounts[cat]}</span>
      </span>`).join('');

  counterRow.innerHTML = `
    <div class="event-role-counter">
      <span class="role-count-total">${totalSlots} Slot${totalSlots === 1 ? '' : 's'}</span>
      ${rolePillsHtml}
    </div>`;

  // Parties breakdown
  const parties = {};
  for (const row of rows) {
    if (!parties[row.party]) parties[row.party] = [];
    parties[row.party].push(row);
  }
  const partyKeys = Object.keys(parties).sort((a, b) => Number(a) - Number(b));
  const hasMultipleParties = partyKeys.length > 1;

  const partiesHtml = `<div class="event-party-grid">${partyKeys.map(pk => `
    <div class="event-party-card">
      <div class="event-party-head">${hasMultipleParties ? `Party ${Number(pk) + 1}` : 'Roster'}</div>
      ${parties[pk].map(row => renderViewerRow(row)).join('')}
    </div>`).join('')}</div>`;

  const canEdit = isOfficerOrAdmin();
  const eventTypeLabel = comp.eventType ? EVENT_TYPE_LABELS[comp.eventType] || comp.eventType : 'Untagged';
  const eventTypeBadgeClass = comp.eventType ? `type-${comp.eventType}` : 'type-untagged';

  const layout = document.getElementById('comp-viewer-layout');
  layout.innerHTML = `
    <div class="event-info-col">
      <div class="event-info-card">
        <span class="event-type-badge ${eventTypeBadgeClass}" style="align-self:flex-start;">${eventTypeLabel}</span>
        <h2 class="event-info-title">${escapeHtml(comp.label)}</h2>
        <div class="event-info-row">
          <span class="event-info-label">Total slots</span>
          <span class="event-info-value"><strong>${totalSlots}</strong></span>
        </div>
        <div class="event-info-row">
          <span class="event-info-label">Parties</span>
          <span class="event-info-value">${partyKeys.length} ${partyKeys.length === 1 ? 'party' : 'parties'}</span>
        </div>
        ${canEdit ? `
          <div class="event-action-row" style="margin-top:8px;">
            <button class="event-action-btn" id="comp-viewer-edit-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              Edit composition
            </button>
          </div>` : ''}
      </div>
    </div>
    <div class="event-roster-col">
      ${partiesHtml || '<p class="section-sub">No slots in this composition.</p>'}
    </div>
    <div class="event-build-col" id="comp-viewer-build-col" style="display:none;"></div>`;

  const editBtn = document.getElementById('comp-viewer-edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => openEditor(comp.key));
  }

  // Wire build inspection clicks on weapon pills
  layout.querySelectorAll('[data-build-tab][data-build-id]').forEach(el => {
    el.addEventListener('click', () => {
      const tab = el.dataset.buildTab;
      const id = el.dataset.buildId;
      const cat = el.dataset.category;
      if (tab && id !== undefined && id !== '' && cat) {
        showBuildDetail(tab, parseInt(id, 10), el.dataset.weaponName || '', cat);
      }
    });
  });
}

function renderViewerRow(row) {
  const isMulti = !!row.options;
  const roleClass = `role-${row.category.toLowerCase()}`;

  if (isMulti) {
    const optionsHtml = row.options.map(o => {
      const icon = o.iconUrl
        ? `<img class="event-row-pill-icon" src="${escapeHtml(o.iconUrl)}" alt="" loading="lazy">`
        : emojiToHtml(o.emoji, { size: 16, fallback: '🔹' });
      const displayName = window.weaponDisplayName ? window.weaponDisplayName(o.name) : o.name;
      const buildAttr = (o.buildTab && o.buildId !== null)
        ? `data-build-tab="${escapeHtml(o.buildTab)}" data-build-id="${o.buildId}" data-weapon-name="${escapeHtml(o.name)}" data-category="${escapeHtml(row.category)}" title="Click to view build"`
        : '';
      return `
        <button type="button" class="comp-viewer-option-pill ${roleClass}" ${buildAttr}>
          ${icon}
          <span class="event-row-name-text">${escapeHtml(displayName || 'Any')}</span>
        </button>`;
    }).join('');

    return `
      <div class="comp-viewer-row">
        <div class="comp-viewer-options-wrap">${optionsHtml}</div>
      </div>`;
  }

  const icon = row.iconUrl
    ? `<img class="event-row-pill-icon" src="${escapeHtml(row.iconUrl)}" alt="" loading="lazy">`
    : emojiToHtml(row.emoji, { size: 16, fallback: '🔹' });
  const displayName = window.weaponDisplayName ? window.weaponDisplayName(row.name) : row.name;
  const buildAttr = (row.buildTab && row.buildId !== null)
    ? `data-build-tab="${escapeHtml(row.buildTab)}" data-build-id="${row.buildId}" data-weapon-name="${escapeHtml(row.name)}" data-category="${escapeHtml(row.category)}" title="Click to view build"`
    : '';

  return `
    <div class="comp-viewer-row">
      <button type="button" class="comp-viewer-row-pill ${roleClass}" ${buildAttr}>
        ${icon}
        <span class="event-row-name-text">${escapeHtml(displayName || 'Any')}</span>
      </button>
    </div>`;
}

const EVENT_ROLE_COLORS = { healer: 'var(--healer)', support: 'var(--support)', dps: 'var(--dps)', tank: 'var(--tank)', battlemount: 'var(--cosmic)' };
const EVENT_ROLE_LABELS = { healer: 'Healer', support: 'Support', dps: 'DPS', tank: 'Tank', battlemount: 'Battlemount' };
const EVENT_FLAG_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4a1 1 0 0 1 1.45-.9L19 9.5 5.45 16.4A1 1 0 0 1 4 15.5"/></svg>`;

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

async function showBuildDetail(tab, buildId, weaponName, cat) {
  const col = document.getElementById('comp-viewer-build-col');
  if (!col) return;

  let builds;
  try {
    builds = await ensureAllBuildsLoaded();
  } catch (err) {
    col.style.display = '';
    col.innerHTML = `<div class="event-info-card"><p style="color:var(--ink-faint)">Failed to load builds: ${escapeHtml(err.message)}</p></div>`;
    return;
  }

  const tabBuilds = builds[tab] || [];
  const build = tabBuilds[buildId];
  if (!build) {
    col.style.display = '';
    col.innerHTML = `<div class="event-info-card"><p style="color:var(--ink-faint)">Build not found.</p></div>`;
    return;
  }

  const roleKey = cat.toLowerCase();
  const color = EVENT_ROLE_COLORS[roleKey] || 'var(--line-2)';
  const roleLabel = EVENT_ROLE_LABELS[roleKey] || cat;

  col.style.display = '';
  col.innerHTML = `
    <div class="event-details-head">War Ledger Build</div>
    <div class="event-build-panel">
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
      <div style="padding-top:12px;">
        <a class="cta-primary" href="builds.html?tab=${encodeURIComponent(tab)}&build=${encodeURIComponent(buildId)}" style="display:inline-flex; font-size:12px; padding:8px 12px; justify-content:center;">
          Open in War Ledger →
        </a>
      </div>
    </div>`;

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
}

/* ─────────────────────────────────────────
   3. COMP EDITOR (EDIT / CREATE)
───────────────────────────────────────── */
function newDraftCategories() {
  const cats = {};
  for (const cat of CATEGORY_ORDER) cats[cat] = { mode: 'items', items: [] };
  return cats;
}

function computePartyCount(categories) {
  let max = 0;
  for (const cat of CATEGORY_ORDER) {
    if (!categories[cat] || !categories[cat].items) continue;
    for (const item of categories[cat].items) {
      if (typeof item.party === 'number' && item.party > max) max = item.party;
    }
  }
  return max + 1;
}

function openEditor(key = null) {
  if (!isOfficerOrAdmin()) {
    showToast('Only officers and admins can edit compositions.');
    return;
  }

  editingKey = key;
  if (key) {
    const comp = allComps.find(c => c.key === key);
    if (!comp) return;
    draft = { 
      label: comp.label, 
      categories: JSON.parse(JSON.stringify(comp.categories)),
      eventType: comp.eventType || null,
      iconWeapon: comp.iconWeapon || null
    };
    for (const cat of CATEGORY_ORDER) if (!draft.categories[cat]) draft.categories[cat] = { mode: 'items', items: [] };
    draft.partyCount = computePartyCount(draft.categories);
  } else {
    draft = { label: '', categories: newDraftCategories(), partyCount: 1, eventType: null, iconWeapon: null };
  }

  document.getElementById('comps-list-view').style.display = 'none';
  document.getElementById('comps-viewer-view').style.display = 'none';
  document.getElementById('comps-editor-view').style.display = '';

  renderEditor();
}

function closeEditor() {
  editingKey = null;
  draft = null;
  document.getElementById('comps-editor-view').style.display = 'none';
  if (viewingKey) {
    document.getElementById('comps-viewer-view').style.display = '';
  } else {
    document.getElementById('comps-list-view').style.display = '';
  }
}

function renderPartyColumn(p) {
  const categoriesHtml = CATEGORY_ORDER.map(cat => {
    const catData = draft.categories[cat];
    const itemsInParty = catData.items
      .map((it, originalIdx) => ({ it, originalIdx }))
      .filter(({ it }) => (it.party || 0) === p);

    const rows = itemsInParty.map(({ it, originalIdx: i }) => {
      if (it.options) {
        const optionsHtml = it.options.map((opt, oi) => {
          const matchingBuilds = buildOptions.filter(b => b.role === cat.toLowerCase() && b.weapon === opt.name);
          const currentVal = (opt.buildTab && opt.buildId !== null) ? `${opt.buildTab}:${opt.buildId}` : '';
          const buildOptionsHtml = `<option value="">No linked build</option>` +
            matchingBuilds.map(b => `<option value="${buildOptionValue(b)}" ${currentVal === buildOptionValue(b) ? 'selected' : ''}>[${TAB_LABELS[b.tab] || b.tab}] ${escapeHtml(b.weapon)}</option>`).join('');

          return `
            <div class="comp-item-option" data-cat="${cat}" data-i="${i}" data-oi="${oi}">
              <button type="button" class="comp-item-weapon-btn comp-item-option-weapon-btn">
                ${weaponPreviewHtml(opt.name)}
              </button>
              <select class="comp-item-option-build">${buildOptionsHtml}</select>
              <button type="button" class="comp-item-option-remove" title="Remove this choice">✕</button>
            </div>`;
        }).join('');

        return `
          <div class="comp-item-row comp-item-row-multi" data-cat="${cat}" data-i="${i}">
            <div class="comp-item-options">
              ${optionsHtml}
              <button type="button" class="btn comp-item-add-option-btn" data-cat="${cat}" data-i="${i}">+ Add choice</button>
            </div>
            <button type="button" class="comp-item-remove" title="Remove whole line">${TRASH_ICON}</button>
          </div>`;
      }

      const matchingBuilds = buildOptions.filter(b => b.role === cat.toLowerCase() && b.weapon === it.name);
      const currentVal = (it.buildTab && it.buildId !== null) ? `${it.buildTab}:${it.buildId}` : '';
      const buildOptionsHtml = `<option value="">No linked build</option>` +
        matchingBuilds.map(b => `<option value="${buildOptionValue(b)}" ${currentVal === buildOptionValue(b) ? 'selected' : ''}>[${TAB_LABELS[b.tab] || b.tab}] ${escapeHtml(b.weapon)}</option>`).join('');

      return `
        <div class="comp-item-row" data-cat="${cat}" data-i="${i}">
          <button type="button" class="comp-item-weapon-btn">
            ${weaponPreviewHtml(it.name)}
          </button>
          <select class="comp-item-build">${buildOptionsHtml}</select>
          <button type="button" class="btn comp-item-add-choice-btn" data-cat="${cat}" data-i="${i}">+ Choice</button>
          <button type="button" class="comp-item-remove" title="Remove line">${TRASH_ICON}</button>
        </div>`;
    }).join('');

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

function renderEditor() {
  const card = document.getElementById('comp-detail-card');
  const partyColumnsHtml = Array.from({ length: draft.partyCount }, (_, p) => renderPartyColumn(p)).join('');

  card.innerHTML = `
    <div class="card-header">
      <div class="card-title-row">
        <input type="text" id="comp-label-input" class="comp-label-input" value="${escapeHtml(draft.label)}" placeholder="Composition name">
        ${editingKey ? `<button class="card-delete-btn" type="button" id="comp-delete-btn" title="Delete this composition">${TRASH_ICON}</button>` : ''}
      </div>
    </div>
    <div class="comp-event-type-row">
      <span class="comp-event-type-label">Composition Type:</span>
      <select id="comp-event-type-select" class="comp-event-type-select">
        <option value="">Untagged</option>
        <option value="PVP" ${draft.eventType === 'PVP' ? 'selected' : ''}>PvP</option>
        <option value="PVE" ${draft.eventType === 'PVE' ? 'selected' : ''}>PvE</option>
        <option value="Gank" ${draft.eventType === 'Gank' ? 'selected' : ''}>Gank</option>
      </select>
    </div>
    <div class="comp-event-type-row">
      <span class="comp-event-type-label">Icon Weapon:</span>
      <button type="button" class="comp-item-weapon-btn" id="comp-icon-weapon-btn" style="max-width:280px;">
        ${weaponPreviewHtml(draft.iconWeapon)}
      </button>
    </div>
    <div class="comp-parties-toolbar">
      <button type="button" class="btn" id="comp-add-party-btn">+ Add party</button>
    </div>
    <div class="comp-parties-row">${partyColumnsHtml}</div>
    <div class="comp-save-row">
      <button class="btn" id="comp-save-btn"><span class="btn-label">${editingKey ? 'Save changes' : 'Create composition'}</span></button>
    </div>`;

  card.querySelectorAll('.comp-item-weapon-btn:not(.comp-item-option-weapon-btn)').forEach(btn => btn.addEventListener('click', () => {
    const row = btn.closest('.comp-item-row');
    openWeaponPopover(btn, row.dataset.cat, +row.dataset.i);
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

  card.querySelectorAll('.comp-item-option-weapon-btn').forEach(btn => btn.addEventListener('click', () => {
    const opt = btn.closest('.comp-item-option');
    openWeaponPopover(btn, opt.dataset.cat, +opt.dataset.i, +opt.dataset.oi);
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
  document.getElementById('comp-event-type-select').addEventListener('change', e => { draft.eventType = e.target.value || null; });
  
  // Icon weapon picker
  const iconWeaponBtn = document.getElementById('comp-icon-weapon-btn');
  if (iconWeaponBtn) {
    iconWeaponBtn.addEventListener('click', () => openIconWeaponPopover(iconWeaponBtn));
  }
  
  document.getElementById('comp-add-party-btn').addEventListener('click', () => { draft.partyCount++; renderEditor(); });
  const removePartyBtn = document.getElementById('comp-party-remove-btn');
  if (removePartyBtn) removePartyBtn.addEventListener('click', removeLastParty);

  const deleteBtn = document.getElementById('comp-delete-btn');
  if (deleteBtn) deleteBtn.addEventListener('click', async () => {
    if (!confirm(`Delete "${draft.label}"? This can't be undone.`)) return;
    await api(`/api/comps/${editingKey}`, { method: 'DELETE' });
    showToast(`Deleted composition "${draft.label}".`);
    viewingKey = null;
    closeEditor();
    await loadAll();
  });

  document.getElementById('comp-save-btn').addEventListener('click', saveDraft);
}

function removeLastParty() {
  const lastIdx = draft.partyCount - 1;
  if (lastIdx === 0) return;
  const hasItems = CATEGORY_ORDER.some(cat => draft.categories[cat].items.some(it => (it.party || 0) === lastIdx));
  if (hasItems) {
    alert(`Party ${lastIdx + 1} still has role lines — remove or move them to another party first.`);
    return;
  }
  draft.partyCount--;
  renderEditor();
}

async function saveDraft() {
  const label = draft.label.trim();
  if (!label) { alert('Give the composition a name first.'); return; }
  if (!draft.iconWeapon) { alert('Choose an icon weapon for this composition.'); return; }
  const hasAnyItem = CATEGORY_ORDER.some(cat => draft.categories[cat].items.some(it => (it.name && it.name.trim()) || (it.options && it.options.length)));
  if (!hasAnyItem) { alert('Add at least one role line first.'); return; }

  try {
    if (editingKey) {
      await api(`/api/comps/${editingKey}`, {
        method: 'PUT',
        body: JSON.stringify({ newLabel: label, categories: draft.categories, eventType: draft.eventType, iconWeapon: draft.iconWeapon }),
      });
      showToast(`Updated composition "${label}".`);
    } else {
      await api('/api/comps', {
        method: 'POST',
        body: JSON.stringify({ label, categories: draft.categories, eventType: draft.eventType, iconWeapon: draft.iconWeapon }),
      });
      showToast(`Created composition "${label}".`);
    }
    const savedKey = editingKey;
    closeEditor();
    await loadAll();
    if (savedKey) openViewer(savedKey);
  } catch (err) {
    alert(err.message);
  }
}

/* ─────────────────────────────────────────
   4. WEAPON POPOVER SEARCH & PICKER
───────────────────────────────────────── */
function weaponPreviewHtml(name) {
  if (!name) return '<span class="weapon-preview-empty">Pick a weapon…</span>';
  const url = window.imgUrl ? window.imgUrl(name) : null;
  const display = window.weaponDisplayName ? window.weaponDisplayName(name) : name;
  return `
    ${url ? `<img class="weapon-preview-icon" src="${url}" alt="">` : '<span class="weapon-preview-icon weapon-preview-icon-blank"></span>'}
    <span class="weapon-preview-name">${escapeHtml(display)}</span>`;
}

function closeWeaponPopover() {
  const pop = document.getElementById('weapon-popover');
  if (pop) pop.remove();
  document.removeEventListener('mousedown', handleWeaponPopoverOutsideClick, true);
}

function handleWeaponPopoverOutsideClick(e) {
  const pop = document.getElementById('weapon-popover');
  if (pop && !pop.contains(e.target)) closeWeaponPopover();
}

function openWeaponPopover(anchorBtn, cat, itemIndex, optionIndex = null) {
  closeWeaponPopover();

  const pop = document.createElement('div');
  pop.id = 'weapon-popover';
  pop.className = 'weapon-popover';
  pop.innerHTML = `
    <input type="text" class="weapon-popover-search" placeholder="Search weapons…" autocomplete="off">
    <div class="weapon-popover-list"></div>`;
  document.body.appendChild(pop);

  const rect = anchorBtn.getBoundingClientRect();
  pop.style.top = `${window.scrollY + rect.bottom + 6}px`;
  pop.style.left = `${window.scrollX + rect.left}px`;

  const list = pop.querySelector('.weapon-popover-list');
  const input = pop.querySelector('.weapon-popover-search');
  const allWeapons = window.WEAPON_NAMES || Object.keys(window.ITEM_MAP || {});

  const renderList = (filter = '') => {
    const q = filter.trim().toLowerCase();
    const matches = allWeapons.filter(w => {
      if (!q) return true;
      if (w.toLowerCase().includes(q)) return true;
      const alias = window.weaponDisplayName ? window.weaponDisplayName(w) : '';
      return alias && alias.toLowerCase().includes(q);
    });

    if (matches.length === 0) {
      list.innerHTML = `<div class="weapon-popover-empty">No weapons found</div>`;
      return;
    }

    list.innerHTML = matches.map(w => {
      const url = window.imgUrl ? window.imgUrl(w) : null;
      const display = window.weaponDisplayName ? window.weaponDisplayName(w) : w;
      return `
        <button type="button" class="weapon-popover-item" data-weapon="${escapeHtml(w)}">
          ${url ? `<img src="${url}" alt="">` : ''}
          <span>${escapeHtml(display)}</span>
        </button>`;
    }).join('');

    list.querySelectorAll('.weapon-popover-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.weapon;
        const autoEmoji = weaponEmojiMap[chosen] || null;

        if (optionIndex !== null) {
          const opt = draft.categories[cat].items[itemIndex].options[optionIndex];
          opt.name = chosen;
          opt.emoji = autoEmoji;
        } else {
          const it = draft.categories[cat].items[itemIndex];
          it.name = chosen;
          it.emoji = autoEmoji;
        }

        closeWeaponPopover();
        renderEditor();
      });
    });
  };

  renderList();
  input.addEventListener('input', e => renderList(e.target.value));
  setTimeout(() => input.focus(), 20);

  setTimeout(() => document.addEventListener('mousedown', handleWeaponPopoverOutsideClick, true), 0);
}

/* Icon weapon picker - dedicated popover for composition icon */
function openIconWeaponPopover(anchorBtn) {
  closeWeaponPopover();

  const pop = document.createElement('div');
  pop.id = 'weapon-popover';
  pop.className = 'weapon-popover';
  pop.innerHTML = `
    <input type="text" class="weapon-popover-search" placeholder="Search weapons…" autocomplete="off">
    <div class="weapon-popover-list"></div>`;
  document.body.appendChild(pop);

  const rect = anchorBtn.getBoundingClientRect();
  pop.style.top = `${window.scrollY + rect.bottom + 6}px`;
  pop.style.left = `${window.scrollX + rect.left}px`;

  const list = pop.querySelector('.weapon-popover-list');
  const input = pop.querySelector('.weapon-popover-search');
  const allWeapons = window.WEAPON_NAMES || Object.keys(window.ITEM_MAP || {});

  const renderList = (filter = '') => {
    const q = filter.trim().toLowerCase();
    const matches = allWeapons.filter(w => {
      if (!q) return true;
      if (w.toLowerCase().includes(q)) return true;
      const alias = window.weaponDisplayName ? window.weaponDisplayName(w) : '';
      return alias && alias.toLowerCase().includes(q);
    });

    if (matches.length === 0) {
      list.innerHTML = `<div class="weapon-popover-empty">No weapons found</div>`;
      return;
    }

    list.innerHTML = matches.map(w => {
      const url = window.imgUrl ? window.imgUrl(w) : null;
      const display = window.weaponDisplayName ? window.weaponDisplayName(w) : w;
      return `
        <button type="button" class="weapon-popover-item" data-weapon="${escapeHtml(w)}">
          ${url ? `<img src="${url}" alt="">` : ''}
          <span>${escapeHtml(display)}</span>
        </button>`;
    }).join('');

    list.querySelectorAll('.weapon-popover-item').forEach(btn => {
      btn.addEventListener('click', () => {
        draft.iconWeapon = btn.dataset.weapon;
        closeWeaponPopover();
        renderEditor();
      });
    });
  };

  renderList();
  input.addEventListener('input', e => renderList(e.target.value));
  setTimeout(() => input.focus(), 20);

  setTimeout(() => document.addEventListener('mousedown', handleWeaponPopoverOutsideClick, true), 0);
}

const TRASH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>`;

/* ─────────────────────────────────────────
   5. BOOT & NAVIGATION
───────────────────────────────────────── */
async function init() {
  const loading = document.getElementById('comps-loading-view');
  await window.SITE_AUTH_READY;

  if (!isOfficerOrAdmin()) {
    if (loading) loading.style.display = 'none';
    document.getElementById('gate-message').style.display = '';
    return;
  }

  const searchInput = document.getElementById('comp-search');
  searchInput.addEventListener('input', () => {
    searchStr = searchInput.value.trim().toLowerCase();
    renderCompGrid();
  });

  document.querySelectorAll('#comp-type-filter .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      typeFilter = btn.dataset.type;
      document.querySelectorAll('#comp-type-filter .filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderCompGrid();
    });
  });

  document.getElementById('new-comp-btn').addEventListener('click', () => openEditor(null));
  document.getElementById('comp-viewer-back-btn').addEventListener('click', closeViewer);
  document.getElementById('comp-editor-back-btn').addEventListener('click', closeEditor);

  try {
    await loadAll();
  } catch (err) {
    showToast('Failed to load compositions: ' + err.message);
  } finally {
    if (loading) loading.style.display = 'none';
    document.getElementById('comps-list-view').style.display = '';
  }

  const hashId = location.hash.startsWith('#c/') ? decodeURIComponent(location.hash.slice(3)) : null;
  if (hashId) openViewer(hashId);
}

init();