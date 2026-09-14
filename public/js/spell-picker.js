/* ─────────────────────────────────────────
   SPELL PICKER — gear-by-gear spell verifier
   Lists every weapon/head/chest/feet piece in
   item-map.js's ITEM_MAP, grouped by Albion's own
   weapon/armor subcategory (spell-map.js's
   "category" field, sourced from items.xml's
   @shopsubcategory1 — not guessed from names), so
   every spell icon can be eyeballed against the
   real game art. Purely a verification tool: clicks
   only toggle a local highlight for your own
   scanning, nothing is saved anywhere.
───────────────────────────────────────── */

// Requested display order. Each entry's key must match a "category"
// value in spell-map.js (itself Albion's own @shopsubcategory1).
const WEAPON_CATEGORY_ORDER = [
  { key: 'sword', label: 'Swords' },
  { key: 'axe', label: 'Axes' },
  { key: 'mace', label: 'Maces' },
  { key: 'hammer', label: 'Hammers' },
  { key: 'knuckles', label: 'Gloves' },
  { key: 'crossbow', label: 'Crossbows' },
  { key: 'bow', label: 'Bows' },
  { key: 'dagger', label: 'Daggers' },
  { key: 'spear', label: 'Spears' },
  { key: 'quarterstaff', label: 'Quarterstaffs' },
  { key: 'shapeshifterstaff', label: 'Shapeshifters' },
  { key: 'naturestaff', label: 'Nature Staffs' },
  { key: 'firestaff', label: 'Fire Staffs' },
  { key: 'holystaff', label: 'Holy Staffs' },
  { key: 'arcanestaff', label: 'Arcane Staffs' },
  { key: 'froststaff', label: 'Frost Staffs' },
  { key: 'cursestaff', label: 'Curse Staffs' },
];

const ARMOR_MATERIAL_ORDER = [
  { suffix: 'plate', label: 'Plate' },
  { suffix: 'leather', label: 'Leather' },
  { suffix: 'cloth', label: 'Cloth' },
];

const SECTIONS = [
  { title: 'Weapons', slot: 'weapon', categories: WEAPON_CATEGORY_ORDER },
  { title: 'Head', slot: 'head', categories: ARMOR_MATERIAL_ORDER.map(m => ({ key: `${m.suffix}_helmet`, label: m.label })) },
  { title: 'Chest', slot: 'chest', categories: ARMOR_MATERIAL_ORDER.map(m => ({ key: `${m.suffix}_armor`, label: m.label })) },
  { title: 'Feet', slot: 'feet', categories: ARMOR_MATERIAL_ORDER.map(m => ({ key: `${m.suffix}_shoes`, label: m.label })) },
];

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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

function spellOptionHtml(candidate) {
  const candidateJson = escapeHtml(JSON.stringify(candidate));
  return `
    <button type="button" class="spell-option" data-candidate="${candidateJson}" title="${escapeHtml(candidate.name)}">
      <img alt="${escapeHtml(candidate.name)}" data-spell-icon>
    </button>`;
}

function gearCardHtml(gearName, entry) {
  const url = window.imgUrl ? window.imgUrl(gearName) : null;
  const rowsHtml = entry.groups.map(g => `
      <div class="spell-row">
        <span class="spell-row-label">${escapeHtml(g.label)}</span>
        ${g.spells.map(spellOptionHtml).join('')}
      </div>`).join('');

  return `
    <div class="sp-gear-block">
      <div class="slot-card">
        ${url ? `<img src="${url}" alt="">` : '<span class="slot-empty-icon"></span>'}
        <div class="slot-info">
          <span class="slot-name" title="${escapeHtml(gearName)}">${escapeHtml(gearName)}</span>
        </div>
      </div>
      ${rowsHtml}
    </div>`;
}

function matchesFilter(name, query) {
  return !query || name.toLowerCase().includes(query.toLowerCase());
}

function populateCategoryFilter() {
  const select = document.getElementById('category-filter');
  const groups = SECTIONS.map(section => {
    const opts = section.categories.map(c => `<option value="${escapeHtml(c.key)}">${escapeHtml(c.label)}</option>`).join('');
    return `<optgroup label="${escapeHtml(section.title)}">${opts}</optgroup>`;
  }).join('');
  select.innerHTML = `<option value="all">All gear</option>${groups}`;
}

function render() {
  const query = document.getElementById('build-search').value.trim();
  const catFilter = document.getElementById('category-filter').value;
  const list = document.getElementById('spell-picker-list');

  const html = SECTIONS.map(section => {
    const catsHtml = section.categories
      .filter(cat => catFilter === 'all' || catFilter === cat.key)
      .map(cat => {
        const names = Object.keys(window.SPELL_MAP)
          .filter(name => window.SPELL_MAP[name].slot === section.slot && window.SPELL_MAP[name].category === cat.key)
          .filter(name => matchesFilter(name, query))
          .sort();
        if (!names.length) return '';
        const cards = names.map(name => gearCardHtml(name, window.SPELL_MAP[name])).join('');
        return `<h4 class="sp-subheading">${escapeHtml(cat.label)}</h4><div class="sp-build-list">${cards}</div>`;
      })
      .join('');
    if (!catsHtml.trim()) return '';
    return `<h3 class="sp-category-heading">${escapeHtml(section.title)}</h3>${catsHtml}`;
  }).join('');

  list.innerHTML = html.trim() ? html : '<p class="el-empty">No matching gear.</p>';

  list.querySelectorAll('.spell-option').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('selected'));
    const candidate = JSON.parse(btn.dataset.candidate);
    wireSpellIcon(btn.querySelector('[data-spell-icon]'), candidate);
  });
}

async function init() {
  const loading = document.getElementById('spell-picker-loading-view');
  await window.SITE_AUTH_READY;
  if (!isEmojiAdmin()) {
    if (loading) loading.style.display = 'none';
    document.getElementById('gate-message').style.display = '';
    return;
  }

  if (loading) loading.style.display = 'none';
  document.getElementById('spell-picker-app').style.display = '';

  populateCategoryFilter();
  render();

  document.getElementById('build-search').addEventListener('input', render);
  document.getElementById('category-filter').addEventListener('change', render);
}

init();
