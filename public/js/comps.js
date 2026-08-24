/* ─────────────────────────────────────────
   COMPOSITIONS — officer/admin editor
   Reads/writes the same `comps` data the
   Discord bot's /comp commands use.
───────────────────────────────────────── */
const CATEGORY_ORDER = ['Tank', 'Support', 'DPS', 'Healer', 'Battlemount'];
const TAB_LABELS = { brawl: 'Brawl', gank: 'Gank', kite: 'Kite & Clap', brawlclap: 'Brawl & Clap', tracking: 'Tracking', groupdungeon: 'Group Dungeon', avadungeon: 'Ava Dungeon' };

let allComps = [];       // [{ key, label, categories, updatedAt, ... }]
let buildOptions = [];   // [{ tab, index, role, weapon }]
let serverEmojis = [];   // [{ id, name, animated, tag, url }] from /api/discord-emojis
let editingKey = null;   // null = viewing/creating, otherwise the comp being edited
let draft = null;        // working copy of the comp currently shown in the editor

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

async function loadAll() {
  [allComps, buildOptions, serverEmojis] = await Promise.all([
    api('/api/comps'),
    api('/api/comps-build-options'),
    api('/api/discord-emojis').catch(() => []),
  ]);
  renderCompSelect();
}

/* ---------- comp picker (dropdown) ---------- */
function renderCompSelect() {
  const select = document.getElementById('comp-select');
  const countLabel = document.getElementById('comp-count-label');
  countLabel.textContent = `${allComps.length} composition${allComps.length === 1 ? '' : 's'}`;

  const sorted = [...allComps].sort((a, b) => a.label.localeCompare(b.label));
  const currentValue = select.value;
  select.innerHTML = `<option value="">Select a composition…</option>` +
    sorted.map(c => `<option value="${escapeHtml(c.key)}">${escapeHtml(c.label)}</option>`).join('');
  if (currentValue && sorted.some(c => c.key === currentValue)) select.value = currentValue;
}

function newDraftCategories() {
  const cats = {};
  for (const cat of CATEGORY_ORDER) cats[cat] = { mode: 'items', items: [] };
  return cats;
}

// How many party columns to show, derived from the highest party index any
// item currently uses (so opening an existing comp shows exactly as many
// columns as it actually has). Always at least 1 — Party 1 is the default
// and can't be removed.
function computePartyCount(categories) {
  let max = 0;
  for (const cat of CATEGORY_ORDER) {
    for (const item of categories[cat].items) {
      if (typeof item.party === 'number' && item.party > max) max = item.party;
    }
  }
  return max + 1;
}

function selectComp(key) {
  const comp = allComps.find(c => c.key === key);
  if (!comp) return;
  editingKey = key;
  draft = { label: comp.label, categories: JSON.parse(JSON.stringify(comp.categories)) };
  for (const cat of CATEGORY_ORDER) if (!draft.categories[cat]) draft.categories[cat] = { mode: 'items', items: [] };
  draft.partyCount = computePartyCount(draft.categories);
  document.getElementById('comp-select').value = key;
  renderDetail();
}

function startNewComp() {
  editingKey = null;
  draft = { label: '', categories: newDraftCategories(), partyCount: 1 };
  document.getElementById('comp-select').value = '';
  renderDetail();
}

/* ---------- emoji picker (picker only — no typed shortcode) ---------- */
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
      renderDetail();
    }));
  };
  renderGrid();
  pop.querySelector('.emoji-popover-search').addEventListener('input', e => renderGrid(e.target.value));
  pop.querySelector('.emoji-popover-search').focus();

  setTimeout(() => document.addEventListener('mousedown', handleEmojiPopoverOutsideClick, true), 0);
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
  // Defensive: if the currently linked build's role doesn't match this row's
  // category anymore (role data changed, or the row's category changed after
  // linking), still show it selected instead of silently unlinking it.
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
    alert(`Party ${lastIdx + 1} still has role lines — remove or move them to another party first.`);
    return;
  }
  draft.partyCount--;
  renderDetail();
}

/* ---------- main render ---------- */
function renderDetail() {
  const placeholder = document.getElementById('comp-detail-placeholder');
  const card = document.getElementById('comp-detail-card');
  placeholder.style.display = 'none';
  card.classList.add('visible');

  const partyColumnsHtml = Array.from({ length: draft.partyCount }, (_, p) => renderPartyColumn(p)).join('');

  card.innerHTML = `
    <div class="card-header">
      <div class="card-title-row">
        <input type="text" id="comp-label-input" class="comp-label-input" value="${escapeHtml(draft.label)}" placeholder="Composition name">
        ${editingKey ? `<button class="card-delete-btn" type="button" id="comp-delete-btn" title="Delete this composition">${TRASH_ICON}</button>` : ''}
      </div>
    </div>
    <div class="comp-parties-toolbar">
      <button type="button" class="btn" id="comp-add-party-btn">+ Add party</button>
    </div>
    <div class="comp-parties-row">${partyColumnsHtml}</div>
    <div class="comp-save-row">
      <button class="btn" id="comp-save-btn"><span class="btn-label">${editingKey ? 'Save changes' : 'Create composition'}</span></button>
    </div>`;

  // Line-level controls only (single-choice rows) — option-level emoji/name
  // controls inside a multi-choice row share some of the same classes for
  // consistent styling, so they're explicitly excluded here and wired
  // separately below.
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
    renderDetail();
  }));
  card.querySelectorAll('.comp-add-item-btn').forEach(btn => btn.addEventListener('click', () => {
    draft.categories[btn.dataset.cat].items.push({ name: '', emoji: null, party: +btn.dataset.party, signups: [], buildId: null, buildTab: null });
    renderDetail();
  }));

  // Turns a single-choice line into a multi-choice one, seeding the first
  // option from whatever was already typed so nothing's lost, plus one
  // empty option ready to fill in.
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
    renderDetail();
  }));

  // Option-level controls inside a multi-choice line.
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
    renderDetail();
  }));
  // Removing an option drops it straight back to a normal single-choice
  // line once only one option is left, instead of leaving a "multi-choice"
  // line with nothing to choose between — carries that last option's own
  // build link forward too, so it isn't lost in the conversion.
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
    renderDetail();
  }));

  document.getElementById('comp-label-input').addEventListener('input', e => { draft.label = e.target.value; });
  document.getElementById('comp-add-party-btn').addEventListener('click', () => { draft.partyCount++; renderDetail(); });
  const removePartyBtn = document.getElementById('comp-party-remove-btn');
  if (removePartyBtn) removePartyBtn.addEventListener('click', removeLastParty);

  const deleteBtn = document.getElementById('comp-delete-btn');
  if (deleteBtn) deleteBtn.addEventListener('click', async () => {
    if (!confirm(`Delete "${draft.label}"? This can't be undone.`)) return;
    await api(`/api/comps/${editingKey}`, { method: 'DELETE' });
    closeDetail();
    await loadAll();
  });

  document.getElementById('comp-save-btn').addEventListener('click', saveDraft);
}

async function saveDraft() {
  const label = draft.label.trim();
  if (!label) { alert('Give the composition a name first.'); return; }
  const hasAnyItem = CATEGORY_ORDER.some(cat => draft.categories[cat].items.some(it => it.name.trim()));
  if (!hasAnyItem) { alert('Add at least one role line first.'); return; }

  try {
    if (editingKey) {
      await api(`/api/comps/${editingKey}`, {
        method: 'PUT',
        body: JSON.stringify({ newLabel: label, categories: draft.categories }),
      });
    } else {
      await api('/api/comps', {
        method: 'POST',
        body: JSON.stringify({ label, categories: draft.categories }),
      });
    }
    closeDetail();
    await loadAll();
  } catch (err) {
    alert(err.message);
  }
}

function closeDetail() {
  editingKey = null;
  draft = null;
  document.getElementById('comp-select').value = '';
  document.getElementById('comp-detail-card').classList.remove('visible');
  document.getElementById('comp-detail-placeholder').style.display = '';
}

const TRASH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>`;

async function init() {
  await window.SITE_AUTH_READY;
  if (!isOfficerOrAdmin()) {
    document.getElementById('gate-message').style.display = '';
    return;
  }
  document.getElementById('comps-app').style.display = '';

  document.getElementById('comp-select').addEventListener('change', e => {
    if (e.target.value) selectComp(e.target.value);
    else closeDetail();
  });
  document.getElementById('new-comp-btn').addEventListener('click', startNewComp);

  try {
    await loadAll();
  } catch (err) {
    alert('Failed to load compositions: ' + err.message);
  }
}

init();
