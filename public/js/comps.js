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
let searchStr = '';
let editingKey = null;   // null = viewing/creating, otherwise the comp being edited
let draft = null;        // working copy of the comp currently shown in the detail pane

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function buildOptionValue(o) { return `${o.tab}:${o.index}`; }

function buildLabel(tab, index) {
  const o = buildOptions.find(b => b.tab === tab && b.index === index);
  return o ? `${TAB_LABELS[o.tab] || o.tab} · ${o.weapon}` : null;
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

async function loadAll() {
  [allComps, buildOptions, serverEmojis] = await Promise.all([
    api('/api/comps'),
    api('/api/comps-build-options'),
    api('/api/discord-emojis').catch(() => []),
  ]);
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('comp-tbody');
  const empty = document.getElementById('comp-empty');
  const countLabel = document.getElementById('comp-count-label');
  const q = searchStr.toLowerCase();
  const filtered = allComps.filter(c => !q || c.label.toLowerCase().includes(q));
  countLabel.textContent = `${filtered.length} composition${filtered.length !== 1 ? 's' : ''}`;

  if (!filtered.length) { tbody.innerHTML = ''; empty.style.display = ''; return; }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(c => {
    const roles = CATEGORY_ORDER.filter(cat => c.categories[cat] && c.categories[cat].items && c.categories[cat].items.length);
    const when = c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : '—';
    return `<tr data-key="${escapeHtml(c.key)}">
      <td><span class="weapon-name">${escapeHtml(c.label)}</span></td>
      <td>${roles.map(r => `<span class="role-pill role-${r.toLowerCase()}" style="margin-right:4px">${r}</span>`).join('') || '<span class="section-sub">empty</span>'}</td>
      <td>${when}</td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => selectComp(row.dataset.key));
  });
}

function newDraftCategories() {
  const cats = {};
  for (const cat of CATEGORY_ORDER) cats[cat] = { mode: 'items', items: [] };
  return cats;
}

function selectComp(key) {
  const comp = allComps.find(c => c.key === key);
  if (!comp) return;
  editingKey = key;
  draft = { label: comp.label, categories: JSON.parse(JSON.stringify(comp.categories)) };
  for (const cat of CATEGORY_ORDER) if (!draft.categories[cat]) draft.categories[cat] = { mode: 'items', items: [] };
  renderDetail();
}

function startNewComp() {
  editingKey = null;
  draft = { label: '', categories: newDraftCategories() };
  renderDetail();
}

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

function openEmojiPopover(anchorBtn, cat, i) {
  closeEmojiPopover();
  if (!serverEmojis.length) {
    alert('No custom server emojis found (or GUILD_ID/DISCORD_TOKEN not set on the server). You can still type a shortcode or paste a unicode emoji directly into the box.');
    return;
  }
  const pop = document.createElement('div');
  pop.id = 'emoji-popover';
  pop.className = 'emoji-popover';
  pop.innerHTML = `
    <input type="text" class="emoji-popover-search" placeholder="Search emoji…" autocomplete="off">
    <div class="emoji-popover-grid"></div>`;
  document.body.appendChild(pop);

  const rect = anchorBtn.getBoundingClientRect();
  pop.style.top = `${window.scrollY + rect.bottom + 6}px`;
  pop.style.left = `${window.scrollX + rect.left}px`;

  const grid = pop.querySelector('.emoji-popover-grid');
  const renderGrid = (filter = '') => {
    const q = filter.toLowerCase();
    const list = serverEmojis.filter(e => !q || e.name.toLowerCase().includes(q));
    grid.innerHTML = list.map(e =>
      `<button type="button" class="emoji-popover-item" data-tag="${escapeHtml(e.tag)}" title="${escapeHtml(e.name)}">
         <img src="${e.url}" alt="${escapeHtml(e.name)}">
       </button>`
    ).join('') || '<p class="section-sub" style="padding:8px">No matches.</p>';

    grid.querySelectorAll('.emoji-popover-item').forEach(btn => btn.addEventListener('click', () => {
      draft.categories[cat].items[i].emoji = btn.dataset.tag;
      closeEmojiPopover();
      renderDetail();
    }));
  };
  renderGrid();
  pop.querySelector('.emoji-popover-search').addEventListener('input', e => renderGrid(e.target.value));
  pop.querySelector('.emoji-popover-search').focus();

  setTimeout(() => document.addEventListener('mousedown', handleEmojiPopoverOutsideClick, true), 0);
}

function renderDetail() {
  const placeholder = document.getElementById('comp-detail-placeholder');
  const card = document.getElementById('comp-detail-card');
  const pane = document.getElementById('comp-detail-pane');
  placeholder.style.display = 'none';
  card.classList.add('visible');
  pane.classList.add('open');

  const buildOptionsHtml = (selectedTab, selectedIndex) => {
    let html = `<option value=""${selectedTab == null ? ' selected' : ''}>No build yet</option>`;
    const byTab = {};
    buildOptions.forEach(o => { (byTab[o.tab] = byTab[o.tab] || []).push(o); });
    for (const tab of Object.keys(byTab)) {
      html += `<optgroup label="${TAB_LABELS[tab] || tab}">`;
      html += byTab[tab].map(o => {
        const sel = (o.tab === selectedTab && o.index === selectedIndex) ? ' selected' : '';
        return `<option value="${buildOptionValue(o)}"${sel}>${escapeHtml(o.weapon)} (${o.role})</option>`;
      }).join('');
      html += `</optgroup>`;
    }
    return html;
  };

  const categoriesHtml = CATEGORY_ORDER.map(cat => {
    const items = draft.categories[cat].items;
    const rows = items.map((item, i) => `
      <div class="comp-item-row" data-cat="${cat}" data-i="${i}">
        <button type="button" class="comp-item-emoji-pick" title="Pick a server emoji">${emojiPreviewHtml(item.emoji)}</button>
        <input type="text" class="comp-item-emoji" value="${escapeHtml(item.emoji || '')}" placeholder=":perma:">
        <input type="text" class="comp-item-name" value="${escapeHtml(item.name)}" placeholder="Weapon / role name">
        <input type="number" class="comp-item-party" value="${item.party || 0}" min="0" title="Party # (0 = party 1)">
        <select class="comp-item-build">${buildOptionsHtml(item.buildTab, item.buildId)}</select>
        <button type="button" class="comp-item-remove" title="Remove">${TRASH_ICON}</button>
      </div>`).join('');
    return `
      <div class="comp-category" data-cat="${cat}">
        <div class="comp-category-head">
          <span class="role-pill role-${cat.toLowerCase()}">${cat}</span>
          <button type="button" class="btn comp-add-item-btn" data-cat="${cat}">+ Add role line</button>
        </div>
        <div class="comp-items-list">${rows || '<p class="section-sub">No lines yet.</p>'}</div>
      </div>`;
  }).join('');

  card.innerHTML = `
    <div class="card-header">
      <div class="card-title-row">
        <input type="text" id="comp-label-input" class="comp-label-input" value="${escapeHtml(draft.label)}" placeholder="Composition name">
        ${editingKey ? `<button class="card-delete-btn" type="button" id="comp-delete-btn" title="Delete this composition">${TRASH_ICON}</button>` : ''}
      </div>
    </div>
    <div class="comp-categories">${categoriesHtml}</div>
    <div class="comp-save-row">
      <button class="btn" id="comp-save-btn"><span class="btn-label">${editingKey ? 'Save changes' : 'Create composition'}</span></button>
    </div>`;

  card.querySelectorAll('.comp-item-emoji').forEach(inp => inp.addEventListener('input', e => {
    const row = e.target.closest('.comp-item-row');
    const item = draft.categories[row.dataset.cat].items[+row.dataset.i];
    item.emoji = e.target.value.trim() || null;
    row.querySelector('.comp-item-emoji-pick').innerHTML = emojiPreviewHtml(item.emoji);
  }));
  card.querySelectorAll('.comp-item-emoji-pick').forEach(btn => btn.addEventListener('click', e => {
    const row = e.target.closest('.comp-item-row');
    openEmojiPopover(btn, row.dataset.cat, +row.dataset.i);
  }));
  card.querySelectorAll('.comp-item-name').forEach(inp => inp.addEventListener('input', e => {
    const row = e.target.closest('.comp-item-row');
    draft.categories[row.dataset.cat].items[+row.dataset.i].name = e.target.value;
  }));
  card.querySelectorAll('.comp-item-party').forEach(inp => inp.addEventListener('input', e => {
    const row = e.target.closest('.comp-item-row');
    draft.categories[row.dataset.cat].items[+row.dataset.i].party = parseInt(e.target.value, 10) || 0;
  }));
  card.querySelectorAll('.comp-item-build').forEach(sel => sel.addEventListener('change', e => {
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
    draft.categories[btn.dataset.cat].items.push({ name: '', emoji: null, party: 0, signups: [], buildId: null, buildTab: null });
    renderDetail();
  }));
  document.getElementById('comp-label-input').addEventListener('input', e => { draft.label = e.target.value; });

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
  document.getElementById('comp-detail-pane').classList.remove('open');
  editingKey = null;
  draft = null;
}

const TRASH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>`;

async function init() {
  await window.SITE_AUTH_READY;
  if (!isOfficerOrAdmin()) {
    document.getElementById('gate-message').style.display = '';
    return;
  }
  document.getElementById('comps-app').style.display = '';

  document.getElementById('comp-search').addEventListener('input', e => { searchStr = e.target.value; renderTable(); });
  document.getElementById('new-comp-btn').addEventListener('click', startNewComp);
  document.getElementById('comp-back-btn').addEventListener('click', closeDetail);

  try {
    await loadAll();
  } catch (err) {
    alert('Failed to load compositions: ' + err.message);
  }
}

init();
