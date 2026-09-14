/* ─────────────────────────────────────────
   SPELL PICKER — per-build spell-row picker
   Lets Shin7aro pick, per build, which spell
   in each of that build's gear rows is the
   active one (Albion only allows one active
   spell per row). Saved to /api/build-spells,
   keyed by "<tab>:<index>" — the same build-
   identity convention the comp editor's
   "linked build" picker already uses, since
   builds have no separate stable id.
───────────────────────────────────────── */
let allBuilds = {};      // { tab: [build, ...] }
let categories = [];     // [{ id, label, order }]
let buildSpells = {};    // { "tab:idx": { slot: { groupKey: spellId } } }

const GEAR_SLOTS = ['weapon', 'head', 'chest', 'feet']; // offhand/cape/food/potion never have spell rows

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

function initials(name) {
  return (name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// render.albiononline.com has no single consistent spell-icon naming
// scheme (see spell-map.js's header) — try each candidate URL in turn,
// and if every one 404s, swap the <img> for a plain initials badge
// instead of leaving a broken-image icon on screen.
function wireSpellIcon(img, candidate) {
  const urls = window.spellIconCandidates(candidate);
  let i = 0;
  img.src = urls[i];
  img.onerror = () => {
    i += 1;
    if (i < urls.length) {
      img.src = urls[i];
      return;
    }
    const badge = document.createElement('span');
    badge.className = 'spell-option-fallback';
    badge.textContent = initials(candidate.name);
    img.replaceWith(badge);
  };
}

function spellOptionHtml(candidate, groupKey, selectedId, buildKey, slotKey) {
  const selected = candidate.spell === selectedId;
  const candidateJson = escapeHtml(JSON.stringify(candidate));
  return `
    <button type="button" class="spell-option${selected ? ' selected' : ''}"
      data-build="${escapeHtml(buildKey)}" data-slot="${escapeHtml(slotKey)}"
      data-group="${escapeHtml(groupKey)}" data-spell="${escapeHtml(candidate.spell)}"
      data-candidate="${candidateJson}"
      title="${escapeHtml(candidate.name)}">
      <img alt="${escapeHtml(candidate.name)}" data-spell-icon>
    </button>`;
}

function gearBlockHtml(gearName, slotKey, buildKey, choices) {
  const url = window.imgUrl ? window.imgUrl(gearName) : null;
  const entry = window.SPELL_MAP[gearName];
  const rowsHtml = entry.groups.map(g => {
    const selectedId = choices[slotKey] ? choices[slotKey][g.key] : null;
    const options = g.spells.map(c => spellOptionHtml(c, g.key, selectedId, buildKey, slotKey)).join('');
    return `
      <div class="spell-row">
        <span class="spell-row-label">${escapeHtml(g.label)}</span>
        ${options}
      </div>`;
  }).join('');

  return `
    <div class="sp-gear-block">
      <div class="slot-card">
        ${url ? `<img src="${url}" alt="">` : '<span class="slot-empty-icon"></span>'}
        <div class="slot-info">
          <span class="slot-label">${escapeHtml(slotKey)}</span>
          <span class="slot-name" title="${escapeHtml(gearName)}">${escapeHtml(gearName)}</span>
        </div>
      </div>
      ${rowsHtml}
    </div>`;
}

function buildCardHtml(build, tab, idx, categoryLabel) {
  const buildKey = `${tab}:${idx}`;
  const choices = buildSpells[buildKey] || {};

  const blocks = GEAR_SLOTS
    .filter(slot => build[slot] && window.SPELL_MAP[build[slot]])
    .map(slot => gearBlockHtml(build[slot], slot, buildKey, choices))
    .join('');

  if (!blocks) return ''; // nothing spell-bearing equipped on this build — skip it entirely

  return `
    <div class="sp-build" data-build="${escapeHtml(buildKey)}">
      <div class="sp-build-header">
        ${build.role ? `<span class="sp-build-role">${escapeHtml(build.role)}</span>` : ''}
        <span class="sp-build-title">${escapeHtml(build.weapon || 'Unnamed build')}</span>
        <span class="sp-build-tab">${escapeHtml(categoryLabel)}</span>
      </div>
      ${blocks}
    </div>`;
}

function matchesFilter(build, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return [build.weapon, build.role, build.offhand, build.head, build.chest, build.feet]
    .some(v => (v || '').toLowerCase().includes(q));
}

function render() {
  const query = document.getElementById('build-search').value.trim();
  const tabFilter = document.getElementById('category-filter').value;
  const list = document.getElementById('spell-picker-list');

  const sections = categories
    .filter(cat => tabFilter === 'all' || cat.id === tabFilter)
    .sort((a, b) => a.order - b.order)
    .map(cat => {
      const builds = allBuilds[cat.id] || [];
      const cards = builds
        .map((b, idx) => matchesFilter(b, query) ? buildCardHtml(b, cat.id, idx, cat.label) : '')
        .join('');
      if (!cards.trim()) return '';
      return `<h3 class="sp-category-heading">${escapeHtml(cat.label)}</h3><div class="sp-build-list">${cards}</div>`;
    })
    .join('');

  list.innerHTML = sections.trim() ? sections : '<p class="el-empty">No matching builds.</p>';

  list.querySelectorAll('.spell-option').forEach(btn => {
    btn.addEventListener('click', onSpellClick);
    const candidate = JSON.parse(btn.dataset.candidate);
    wireSpellIcon(btn.querySelector('[data-spell-icon]'), candidate);
  });
}

async function onSpellClick(e) {
  const btn = e.currentTarget;
  const { build: buildKey, slot, group, spell } = btn.dataset;
  const row = btn.closest('.spell-row');
  const alreadySelected = btn.classList.contains('selected');
  const newSpell = alreadySelected ? null : spell; // clicking the active one again clears the row

  row.querySelectorAll('.spell-option').forEach(b => b.classList.add('saving'));
  try {
    const saved = await api(`/api/build-spells/${encodeURIComponent(buildKey.split(':')[0])}/${encodeURIComponent(buildKey.split(':')[1])}`, {
      method: 'PUT',
      body: JSON.stringify({ slot, group, spell: newSpell }),
    });
    buildSpells[buildKey] = saved;
    row.querySelectorAll('.spell-option').forEach(b => b.classList.toggle('selected', b.dataset.spell === newSpell));
  } catch (err) {
    alert(err.message);
  } finally {
    row.querySelectorAll('.spell-option').forEach(b => b.classList.remove('saving'));
  }
}

function populateCategoryFilter() {
  const select = document.getElementById('category-filter');
  const options = ['<option value="all">All categories</option>']
    .concat(categories.sort((a, b) => a.order - b.order).map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.label)}</option>`));
  select.innerHTML = options.join('');
}

async function init() {
  const loading = document.getElementById('spell-picker-loading-view');
  await window.SITE_AUTH_READY;
  if (!isEmojiAdmin()) {
    if (loading) loading.style.display = 'none';
    document.getElementById('gate-message').style.display = '';
    return;
  }

  try {
    [allBuilds, categories, buildSpells] = await Promise.all([
      api('/api/builds'),
      api('/api/builds/categories'),
      api('/api/build-spells'),
    ]);
  } catch (err) {
    alert('Failed to load spell picker data: ' + err.message);
    categories = categories.length ? categories : [];
  } finally {
    if (loading) loading.style.display = 'none';
    document.getElementById('spell-picker-app').style.display = '';
  }

  populateCategoryFilter();
  render();

  document.getElementById('build-search').addEventListener('input', render);
  document.getElementById('category-filter').addEventListener('change', render);
}

init();
