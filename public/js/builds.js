/* ─────────────────────────────────────────
   BUILDS — data + tab engine
   (weapon/item map, build lists, the
   generic tab engine, flashy interaction
   helpers, and tab-switching)
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   DATA — nothing lives in the DOM
───────────────────────────────────────── */
const ITEM_MAP = {
  "1H Mace":            "T8_MAIN_MACE",
  "Carving Sword":      "T8_2H_CLEAVER_HELL",
  "Bear Paws":          "T8_2H_DUALAXE_KEEPER",
  "Halberd":            "T8_2H_HALBERD",
  "Hallowfall":         "T8_MAIN_HOLYSTAFF_AVALON",
  "Ursine Maulers":     "T8_2H_KNUCKLES_KEEPER",
  "Rootbound Staff":    "T8_2H_SHAPESHIFTER_SET2",
  "Truebolt Hammer":    "T8_2H_HAMMER_CRYSTAL",
  "Astral Staff":       "T8_2H_ARCANESTAFF_CRYSTAL",
  "Polehammer":         "T8_2H_POLEHAMMER",
  "Dreadstorm Monarch": "T8_MAIN_MACE_CRYSTAL",
  "Dawnsong":           "T8_2H_FIRE_RINGPAIR_AVALON",
  "Exalted Staff":      "T8_2H_HOLYSTAFF_CRYSTAL",
  "Enigmatic Staff":    "T8_2H_ENIGMATICSTAFF",
  "Lightcaller":        "T8_2H_SHAPESHIFTER_AVALON",
  "Staff of Balance":   "T8_2H_ROCKSTAFF_KEEPER",
  "Oathkeepers":        "T8_2H_DUALMACE_AVALON",
  "Grailseeker":        "T8_2H_QUARTERSTAFF_AVALON",
  "1H Nature Staff":    "T8_MAIN_NATURESTAFF",
  "Leering Cane":       "T8_OFF_JESTERCANE_HELL",
  "Blueflame Torch":    "T8_OFF_TORCH_CRYSTAL",
  "Judicator Helmet":   "T8_HEAD_PLATE_KEEPER",
  "Soldier Helmet":     "T8_HEAD_PLATE_SET1",
  "Assassin Hood":      "T8_HEAD_LEATHER_SET3",
  "Hellion Hood":       "T8_HEAD_LEATHER_HELL",
  "Feyscale Hat":       "T8_HEAD_CLOTH_FEY",
  "Judicator Armor":    "T8_ARMOR_PLATE_KEEPER",
  "Royal Armor":        "T8_ARMOR_PLATE_ROYAL",
  "Guardian Armor":     "T8_ARMOR_PLATE_SET3",
  "Hellion Jacket":     "T8_ARMOR_LEATHER_HELL",
  "Demon Armor":        "T8_ARMOR_PLATE_HELL",
  "Stalker Jacket":     "T8_ARMOR_LEATHER_MORGANA",
  "Tenacity Jacket":    "T8_ARMOR_LEATHER_AVALON",
  "Royal Boots":        "T8_SHOES_PLATE_ROYAL",
  "Valor Boots":        "T8_SHOES_PLATE_AVALON",
  "Royal Shoes":        "T8_SHOES_LEATHER_ROYAL",
  "Stalker Boots":      "T8_SHOES_LEATHER_MORGANA",
  "Hunter Shoes":       "T8_SHOES_LEATHER_SET2",
  "Feyscale Sandals":   "T8_SHOES_CLOTH_FEY",
  "Bridgewatch Cape":   "T8_CAPEITEM_FW_BRIDGEWATCH",
  "Smuggler Cape":      "T8_CAPEITEM_SMUGGLER",
  "Lymhurst Cape":      "T8_CAPEITEM_FW_LYMHURST",
  "Martlock Cape":      "T8_CAPEITEM_FW_MARTLOCK",
  "Avalonian Omelette": "T7_MEAL_OMELETTE_AVALON@1",
  "Beef stew":          "T8_MEAL_STEW@1",
  "Deadwater eel stew": "T8_MEAL_STEW_FISH",
  "Major Gigantify":    "T7_POTION_REVIVE",
  "Gigantify Potion":   "T7_POTION_REVIVE",
  // Kite & Clap weapons
  "Hand of Justice":    "T8_2H_HAMMER_AVALON",
  "Heavy Mace":         "T8_2H_MACE",
  "Great Arcane":       "T8_2H_ARCANESTAFF",
  "Bedrock":            "T8_MAIN_ROCKMACE_KEEPER",
  "Occult":             "T8_2H_ARCANESTAFF_HELL",
  "Lifecurse":          "T8_MAIN_CURSEDSTAFF_UNDEAD",
  "Rootbound":          "T8_2H_SHAPESHIFTER_SET2",
  "Permafrost":         "T8_2H_ICECRYSTAL_UNDEAD",
  "Realmbreaker":       "T8_2H_AXE_AVALON",
  "Spirit hunter":      "T8_2H_HARPOON_HELL",
  "Spiked":             "T8_2H_KNUCKLES_SET3",
  "Rotcaller":          "T8_MAIN_CURSEDSTAFF_CRYSTAL",
  "Rift Glaive":        "T8_2H_GLAIVE_CRYSTAL",
  "Fallen":             "T8_2H_HOLYSTAFF_HELL",
  "Exalted":            "T8_2H_HOLYSTAFF_CRYSTAL",
  "Blight staff":       "T8_2H_NATURESTAFF_HELL",
  "Earthrune":          "T8_2H_SHAPESHIFTER_KEEPER",
  "Mace":               "T8_MAIN_MACE",
  "Rampant":            "T8_2H_NATURESTAFF_KEEPER",
  "Locus":              "T8_2H_ENIGMATICORB_MORGANA",
  "Incubus":            "T8_MAIN_MACE_HELL",
  "Carving sword":      "T8_2H_CLEAVER_HELL",
  "Damnation":          "T8_2H_CURSEDSTAFF_MORGANA",
  "1H Arcane":          "T8_MAIN_ARCANESTAFF",
  "Heavy Crossbow":     "T8_2H_CROSSBOWLARGE",
  "Longbow":            "T8_2H_LONGBOW",
  "Wailing bow":        "T8_2H_BOW_HELL",
  "Witchwork":          "T8_MAIN_ARCANESTAFF_UNDEAD",
  // Kite & Clap offhands
  "Timelocked Grimoire":"T8_OFF_TOME_CRYSTAL",
  "Mistcaller":         "T8_OFF_HORN_KEEPER",
  "Muisak":             "T8_OFF_DEMONSKULL_HELL",
  "Astral aegis":       "T8_OFF_SHIELD_AVALON",
  // Kite & Clap armour
  "Knight armor":       "T8_ARMOR_PLATE_SET2",
  "Duskweaver armor":   "T8_ARMOR_PLATE_FEY",
  "Royal jacket":       "T8_ARMOR_LEATHER_ROYAL",
  "Scholar robe":       "T8_ARMOR_CLOTH_SET1",
  "Robe of purity":     "T8_ARMOR_CLOTH_AVALON",
  // Kite & Clap helmets
  "Knight helmet":      "T8_HEAD_PLATE_SET2",
  "Druid cowl":         "T8_HEAD_CLOTH_KEEPER",
  "Guardian helmet":    "T8_HEAD_PLATE_SET3",
  "Miswalker hood":     "T8_HEAD_LEATHER_FEY",
  // Kite & Clap feet
  "Stalker shoes":      "T8_SHOES_LEATHER_MORGANA",
  // Kite & Clap capes
  "Morgana cape":       "T8_CAPEITEM_MORGANA",
  // Tracking weapons
  "Claws":              "T8_2H_CLAWPAIR",
  "Primal":             "T8_2H_SHAPESHIFTER_SET3",
  "Forcepulse Bracers": "T8_2H_KNUCKLES_CRYSTAL",
  "Shadowcaller":       "T8_MAIN_CURSEDSTAFF_AVALON",
  "Forgebark":          "T8_MAIN_NATURESTAFF_CRYSTAL",
  "Lifetouch":          "T8_MAIN_HOLYSTAFF_MORGANA",
  "Redemption":         "T8_2H_HOLYSTAFF_UNDEAD",
  "Great Holy":         "T8_2H_HOLYSTAFF",
  "1H Holy":            "T8_MAIN_HOLYSTAFF",
  "Crystal Reaper":     "T8_2H_SCYTHE_CRYSTAL",
  "Dagger pair":        "T8_2H_DAGGERPAIR",
  "1H Dagger":          "T8_MAIN_DAGGER",
  "Blazing":            "T8_2H_INFERNOSTAFF_MORGANA",
  "Demon fang":         "T8_MAIN_DAGGER_HELL",
  "Twin Slayers":       "T8_2H_DAGGERPAIR_CRYSTAL",
  "Deathgivers":        "T8_2H_DUALSICKLE_UNDEAD",
  "Trinity":            "T8_2H_TRIDENT_UNDEAD",
  "Great Fire":         "T8_2H_FIRESTAFF",
  "Hellspawn":          "T8_2H_SHAPESHIFTER_HELL",
  "1H Curse":           "T8_MAIN_CURSEDSTAFF",
  "Brawler gloves":     "T8_2H_KNUCKLES_SET1",
  "Wildfire":           "T8_MAIN_FIRESTAFF_KEEPER",
  "Boltcasters":        "T8_2H_DUALCROSSBOW_HELL",
  "1H Fire":            "T8_MAIN_FIRESTAFF",
  "Whispering bow":     "T8_2H_LONGBOW_UNDEAD",
  // Tracking offhands
  "Celestial censer":   "T8_OFF_CENSER_AVALON",
  "Cryptcandle":        "T8_OFF_LAMP_UNDEAD",
  // Tracking armour
  "Royal robe":         "T8_ARMOR_CLOTH_ROYAL",
  "Druid robe":         "T8_ARMOR_CLOTH_KEEPER",
  // Tracking helmets
  "Specter hood":       "T8_HEAD_LEATHER_UNDEAD",
  "Royal cowl":         "T8_HEAD_CLOTH_ROYAL",
  "Stalker hood":       "T8_HEAD_LEATHER_MORGANA",
  "Assassin hood":      "T8_HEAD_LEATHER_SET3",
  "Druid cowl":         "T8_HEAD_CLOTH_KEEPER",
  "Royal jacket":       "T8_ARMOR_LEATHER_ROYAL",
  // Tracking feet
  "Cultist sandals":    "T8_SHOES_CLOTH_MORGANA",
  "Royal sandals":      "T8_SHOES_CLOTH_ROYAL",
  // Tracking capes
  "Avalonian cape":     "T8_CAPEITEM_AVALON",
  "Caerleon cape":      "T8_CAPEITEM_FW_CAERLEON",
  "Lymhurst cape":      "T8_CAPEITEM_FW_LYMHURST",
  // Tracking consumables
  "Omelette":           "T7_MEAL_OMELETTE",
  "Calming Potion":     "T3_POTION_MOB_RESET@1",
};
const ROLE_COLORS = { healer:"var(--healer)", support:"var(--support)", dps:"var(--dps)", tank:"var(--tank)", gank:"var(--gank)" };
const ROLE_LABELS = { healer:"Healer", support:"Support", dps:"DPS", tank:"Tank", gank:"Gank" };
/* ─────────────────────────────────────────
   ITEM CATALOG BY SLOT
   (derived once from ITEM_MAP so the item
   picker can offer the right items per slot)
───────────────────────────────────────── */
function slotForItemId(id) {
  if (id.includes('_HEAD_'))                        return 'head';
  if (id.includes('_ARMOR_'))                        return 'chest';
  if (id.includes('_SHOES_'))                         return 'feet';
  if (id.includes('CAPEITEM'))                        return 'cape';
  if (id.includes('_OFF_'))                           return 'offhand';
  if (id.includes('_MEAL_'))                          return 'food';
  if (id.includes('_POTION_'))                        return 'potion';
  if (id.includes('_MAIN_') || id.includes('_2H_'))   return 'weapon';
  return null;
}

const ITEMS_BY_SLOT = (() => {
  const map = { weapon:[], offhand:[], head:[], chest:[], feet:[], cape:[], food:[], potion:[] };
  const seen = new Set();
  Object.keys(ITEM_MAP).forEach(name => {
    const slot = slotForItemId(ITEM_MAP[name]);
    if (!slot) return;
    const key = slot + '::' + name;
    if (seen.has(key)) return;
    seen.add(key);
    map[slot].push(name);
  });
  Object.keys(map).forEach(k => map[k].sort((a, b) => a.localeCompare(b)));
  return map;
})();

const SLOT_LABELS = { weapon:"Weapon", offhand:"Offhand", head:"Head", chest:"Chest", feet:"Feet", cape:"Cape", food:"Food", potion:"Potion" };
/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function imgUrl(name) {
  const id = ITEM_MAP[name];
  return id ? `https://render.albiononline.com/v1/item/${id}.png?quality=1` : null;
}

function imgTag(name, size) {
  const url = imgUrl(name);
  const r = size > 36 ? 7 : 5;
  const base = `width:${size}px;height:${size}px;border-radius:${r}px;border:1px solid var(--line-2);background:var(--surface-2);object-fit:contain;flex-shrink:0`;
  if (!url) return `<div style="${base}"></div>`;
  return `<img src="${url}" width="${size}" height="${size}" style="${base}" alt="${name}" loading="lazy" onerror="this.style.opacity='0.15'">`;
}

const PENCIL_SVG = `<svg class="slot-edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`;

function slotCard(label, name, slotKey) {
  if (!name && !label) return `<div class="slot-card empty spacer"></div>`;
  const editable = slotKey ? ` editable" data-slot="${slotKey}` : '';
  if (!name) return `
    <div class="slot-card empty${editable}">
      <div class="slot-empty-icon"></div>
      <div class="slot-info"><span class="slot-label">${label}</span><span class="slot-name">—</span></div>
      ${slotKey ? PENCIL_SVG : ''}
    </div>`;
  return `
    <div class="slot-card${editable}">
      ${imgTag(name, 56)}
      <div class="slot-info"><span class="slot-label">${label}</span><span class="slot-name" title="${name}">${name}</span></div>
      ${slotKey ? PENCIL_SVG : ''}
    </div>`;
}

const FLAG_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4a1 1 0 0 1 1.45-.9L19 9.5 5.45 16.4A1 1 0 0 1 4 15.5"/></svg>`;
const TRASH_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"/></svg>`;
const PLUS_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`;

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ─────────────────────────────────────────
   ITEM PICKER MODAL
   (shared overlay used by every tab to
   change a single equipment slot)
───────────────────────────────────────── */
let pickerTarget = null; // { onPick(name), slotKey }

function ensurePicker() {
  if (document.getElementById('item-picker-overlay')) return;
  const div = document.createElement('div');
  div.id = 'item-picker-overlay';
  div.className = 'item-picker-overlay';
  div.innerHTML = `
    <div class="item-picker-modal">
      <div class="item-picker-head">
        <span class="item-picker-title" id="item-picker-title">Choose item</span>
        <input type="text" id="item-picker-search" placeholder="Search item…" autocomplete="off">
        <button class="item-picker-close" type="button" aria-label="Close">✕</button>
      </div>
      <div class="item-picker-grid" id="item-picker-grid"></div>
    </div>`;
  document.body.appendChild(div);
  div.addEventListener('click', e => { if (e.target === div) closePicker(); });
  div.querySelector('.item-picker-close').addEventListener('click', closePicker);
  div.querySelector('#item-picker-search').addEventListener('input', e => renderPickerGrid(e.target.value));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePicker(); });
}

function openPicker(slotKey, allowClear, onPick) {
  ensurePicker();
  pickerTarget = { slotKey, allowClear, onPick };
  document.getElementById('item-picker-title').textContent = `Choose ${SLOT_LABELS[slotKey] || slotKey}`;
  const overlay = document.getElementById('item-picker-overlay');
  overlay.classList.add('open');
  const search = document.getElementById('item-picker-search');
  search.value = '';
  renderPickerGrid('');
  setTimeout(() => search.focus(), 30);
}

function closePicker() {
  const el = document.getElementById('item-picker-overlay');
  if (el) el.classList.remove('open');
  pickerTarget = null;
}

function renderPickerGrid(q) {
  const grid = document.getElementById('item-picker-grid');
  if (!pickerTarget) return;
  const query = q.toLowerCase();
  const items = (ITEMS_BY_SLOT[pickerTarget.slotKey] || []).filter(name => !query || name.toLowerCase().includes(query));

  let html = '';
  if (pickerTarget.allowClear) {
    html += `<div class="item-pick-tile item-pick-clear" data-name="">
      <div class="slot-empty-icon" style="width:44px;height:44px;"></div>
      <span>None</span>
    </div>`;
  }
  html += items.map(name => `
    <div class="item-pick-tile" data-name="${escapeHtml(name)}">
      ${imgTag(name, 44)}
      <span title="${escapeHtml(name)}">${escapeHtml(name)}</span>
    </div>`).join('');

  grid.innerHTML = html || `<div class="item-picker-empty">No items found.</div>`;
  grid.querySelectorAll('.item-pick-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const name = tile.dataset.name;
      const onPick = pickerTarget.onPick;
      closePicker();
      onPick(name);
    });
  });
}

/* ─────────────────────────────────────────
   FLASHY ACCENTS — small, reusable, event-driven
   (no timers/loops — every call here is fired
   directly from a real click/input handler below)
───────────────────────────────────────── */
function spawnRipple(x, y) {
  const r = document.createElement('div');
  r.className = 'click-ripple';
  r.style.left = x + 'px';
  r.style.top = y + 'px';
  document.body.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

function pulseButton(btn) {
  btn.classList.remove('pulse');
  void btn.offsetWidth; // reflow so the animation can re-trigger on repeat clicks
  btn.classList.add('pulse');
  btn.addEventListener('animationend', () => btn.classList.remove('pulse'), { once: true });
}
/* ─────────────────────────────────────────
   REMOTE DATA
   All builds now live in the shared database
   (same one the Discord bot writes to) behind
   /api/builds. No more per-device localStorage.
───────────────────────────────────────── */
let ALL_BUILDS = null; // { brawl: [...], kite: [...], tracking: [...], ... }

async function fetchAllBuilds() {
  const res = await fetch('/api/builds');
  if (!res.ok) throw new Error('Failed to load builds');
  return res.json();
}

async function saveTabToServer(tabKey, list) {
  const res = await fetch(`/api/builds/${tabKey}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(list),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    alert(body.error || 'Could not save — you may need to log in again.');
    throw new Error('save failed');
  }
  return res.json();
}

/* ─────────────────────────────────────────
   GENERIC TAB ENGINE
   (drives Brawl / Kite & Clap / Tracking —
   identical behavior, one implementation)
───────────────────────────────────────── */
function createTab(opts) {
  const { searchId, filterId, countId, tbodyId, emptyId, placeholderId, cardId, paneId } = opts;
  const roles = opts.roles || ['dps', 'healer', 'support', 'tank'];
  let workingBuilds = (ALL_BUILDS[opts.tabKey] || []).slice();
  let activeRole = 'all', searchStr = '', currentList = workingBuilds.slice();

  function canEdit() { return typeof isOfficerOrAdmin === 'function' && isOfficerOrAdmin(); }

  function render(builds) {
    currentList = builds;
    const tbody = document.getElementById(tbodyId);
    const empty = document.getElementById(emptyId);
    const countLabel = document.getElementById(countId);
    countLabel.textContent = `${builds.length} build${builds.length !== 1 ? 's' : ''}`;

    if (!builds.length) { tbody.innerHTML = ''; empty.style.display = ''; return; }
    empty.style.display = 'none';

    tbody.innerHTML = builds.map((b, i) => `
      <tr data-idx="${i}" data-role="${b.role}">
        <td><span class="role-pill role-${b.role}">
          <span class="role-pill-dot" style="background:${ROLE_COLORS[b.role]}"></span>
          ${ROLE_LABELS[b.role]}
        </span></td>
        <td><div class="weapon-cell">
          ${imgTag(b.weapon, 27)}
          <span class="weapon-name" title="${b.weapon}">${b.weapon || 'Unnamed build'}</span>
        </div></td>
      </tr>`).join('');

    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', (e) => {
        spawnRipple(e.clientX, e.clientY);
        select(parseInt(row.dataset.idx));
      });
    });
  }

  // Re-saves to the server, re-filters and re-renders after any in-place edit to build `b`.
  async function refreshAfterEdit(b) {
    await saveTabToServer(opts.tabKey, workingBuilds);
    applyFilters();
    const newIdx = currentList.indexOf(b);
    if (newIdx !== -1) select(newIdx); else closeDetail();
  }

  function select(idx) {
    const b = currentList[idx];
    if (!b) return;
    const editable = canEdit();

    document.querySelectorAll(`#${tbodyId} tr`).forEach(r =>
      r.classList.toggle('selected', parseInt(r.dataset.idx) === idx)
    );

    const placeholder = document.getElementById(placeholderId);
    const card        = document.getElementById(cardId);
    const pane        = document.getElementById(paneId);

    placeholder.style.display = 'none';
    card.classList.add('visible');
    pane.classList.add('open');

    const color = ROLE_COLORS[b.role];

    card.innerHTML = `
      <div class="card-header">
        <div class="card-role-bar" style="background:${color}"></div>
        <div class="card-title-row">
          <div class="card-title">${b.weapon || 'Unnamed build'}</div>
          ${editable ? `<button class="card-delete-btn" type="button" title="Delete this build">${TRASH_SVG}</button>` : ''}
        </div>
        <div class="card-meta">
          <button class="role-pill role-${b.role}${editable ? ' role-pill-btn' : ''}" type="button" title="${editable ? 'Click to change role' : ''}">
            <span class="role-pill-dot" style="background:${color}"></span>
            ${ROLE_LABELS[b.role]}
          </button>
          <span class="card-note-wrap${b.note ? '' : ' empty'}"${editable ? ' title="Click to edit note"' : ''}>${b.note ? FLAG_SVG + escapeHtml(b.note) : (editable ? '+ Add note' : '')}</span>
        </div>
      </div>
      <div>
        <div class="section-label">Build ${editable ? '<small class="section-hint">click any slot to change it</small>' : ''}</div>
        <div class="slots-grid">
          ${slotCard('', '')}
          ${slotCard('Head', b.head, editable ? 'head' : null)}
          ${slotCard('Cape', b.cape, editable ? 'cape' : null)}
          ${slotCard('Weapon', b.weapon, editable ? 'weapon' : null)}
          ${slotCard('Chest', b.chest, editable ? 'chest' : null)}
          ${slotCard('Offhand', b.offhand, editable ? 'offhand' : null)}
          ${slotCard('Potion', b.potion, editable ? 'potion' : null)}
          ${slotCard('Feet', b.feet, editable ? 'feet' : null)}
          ${slotCard('Food', b.food, editable ? 'food' : null)}
        </div>
      </div>`;

    if (editable) {
      // Slot clicks open the item picker for that slot.
      card.querySelectorAll('.slot-card.editable').forEach(el => {
        el.addEventListener('click', () => {
          const slotKey = el.dataset.slot;
          const allowClear = slotKey !== 'weapon';
          openPicker(slotKey, allowClear, (name) => {
            b[slotKey] = name;
            refreshAfterEdit(b);
          });
        });
      });

      // Role pill cycles through the roles available on this tab.
      const rolePillBtn = card.querySelector('.role-pill-btn');
      if (rolePillBtn) rolePillBtn.addEventListener('click', () => {
        const i = roles.indexOf(b.role);
        b.role = roles[(i + 1) % roles.length] || roles[0];
        refreshAfterEdit(b);
      });

      // Note — click to edit inline.
      card.querySelector('.card-note-wrap').addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'card-note-input';
        input.placeholder = 'Add a note…';
        input.value = b.note || '';
        this.replaceWith(input);
        input.focus();
        const commit = () => { b.note = input.value.trim(); refreshAfterEdit(b); };
        input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
        input.addEventListener('blur', commit, { once: true });
      });

      // Delete this build entirely.
      const deleteBtn = card.querySelector('.card-delete-btn');
      if (deleteBtn) deleteBtn.addEventListener('click', () => {
        if (!confirm('Delete this build from the composition?')) return;
        const i = workingBuilds.indexOf(b);
        if (i !== -1) workingBuilds.splice(i, 1);
        saveTabToServer(opts.tabKey, workingBuilds);
        closeDetail();
        applyFilters();
      });
    }

    // Flashy reveal: slots pop in staggered (CSS handles timing via
    // .slots-grid.revealed nth-child delays), then one shimmer sweep
    // across the header once they've landed.
    const grid = card.querySelector('.slots-grid');
    const header = card.querySelector('.card-header');
    header.classList.remove('shimmer');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        grid.classList.add('revealed');
      });
    });
    setTimeout(() => header.classList.add('shimmer'), 750);
  }

  function closeDetail() {
    document.getElementById(paneId).classList.remove('open');
  }

  function applyFilters() {
    const q = searchStr.toLowerCase();
    const filtered = workingBuilds.filter(b => {
      const roleOk   = activeRole === 'all' || b.role === activeRole;
      const searchOk = !q || [b.weapon, b.offhand, b.head, b.chest, b.feet, b.cape, b.note]
                             .some(v => v && v.toLowerCase().includes(q));
      return roleOk && searchOk;
    });
    render(filtered);
  }

  function addBuild() {
    const b = {
      role: roles[0], weapon: '', offhand: '', head: '', chest: '', feet: '', cape: '', food: '', potion: '', note: ''
    };
    workingBuilds.push(b);
    saveTabToServer(opts.tabKey, workingBuilds);

    // Reset filters so the freshly added build is guaranteed to be visible.
    activeRole = 'all'; searchStr = '';
    const searchInput = document.getElementById(searchId);
    if (searchInput) searchInput.value = '';
    document.querySelectorAll(`#${filterId} .filter-btn`).forEach(btn =>
      btn.classList.toggle('active', btn.dataset.role === 'all')
    );

    applyFilters();
    const idx = currentList.indexOf(b);
    if (idx !== -1) select(idx);
  }

  document.getElementById(searchId).addEventListener('input', e => {
    searchStr = e.target.value;
    applyFilters();
  });

  document.getElementById(filterId).addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    spawnRipple(e.clientX, e.clientY);
    pulseButton(btn);
    activeRole = btn.dataset.role;
    document.querySelectorAll(`#${filterId} .filter-btn`).forEach(b => b.classList.toggle('active', b === btn));
    applyFilters();
  });

  const backBtn = document.querySelector(`.detail-back-btn[data-back-for="${opts.tabKey}"]`);
  if (backBtn) backBtn.addEventListener('click', closeDetail);

  const addBtn = document.getElementById(opts.addBtnId);
  if (addBtn) {
    addBtn.style.display = canEdit() ? '' : 'none';
    addBtn.addEventListener('click', addBuild);
  }

  // "Reset" now means "discard my unsaved-to-me view and reload the live,
  // shared copy from the server" — there's no more per-device default to
  // revert to, since every officer/admin edits the same live list.
  const resetBtn = document.getElementById(opts.resetBtnId);
  if (resetBtn) {
    resetBtn.style.display = canEdit() ? '' : 'none';
    resetBtn.addEventListener('click', async () => {
      if (!confirm('Discard any unsaved changes and reload the live list from the server?')) return;
      const fresh = await fetchAllBuilds();
      workingBuilds = (fresh[opts.tabKey] || []).slice();
      closeDetail();
      applyFilters();
    });
  }

  render(workingBuilds);
}

async function initTabs() {
  await window.SITE_AUTH_READY;
  ALL_BUILDS = await fetchAllBuilds();

  createTab({ tabKey: 'brawl',    searchId: 'search',          filterId: 'filter-group',          countId: 'count-label',          tbodyId: 'tbody',          emptyId: 'empty',          placeholderId: 'detail-placeholder',          cardId: 'detail-card',          paneId: 'brawl-detail-pane',    addBtnId: 'add-build-btn',          resetBtnId: 'reset-build-btn',          roles: ['dps','healer','support','tank'] });
  createTab({ tabKey: 'kite',     searchId: 'kite-search',     filterId: 'kite-filter-group',     countId: 'kite-count-label',     tbodyId: 'kite-tbody',     emptyId: 'kite-empty',     placeholderId: 'kite-detail-placeholder',     cardId: 'kite-detail-card',     paneId: 'kite-detail-pane',     addBtnId: 'kite-add-build-btn',     resetBtnId: 'kite-reset-build-btn',     roles: ['dps','healer','support','tank'] });
  createTab({ tabKey: 'tracking', searchId: 'tracking-search', filterId: 'tracking-filter-group', countId: 'tracking-count-label', tbodyId: 'tracking-tbody', emptyId: 'tracking-empty', placeholderId: 'tracking-detail-placeholder', cardId: 'tracking-detail-card', paneId: 'tracking-detail-pane', addBtnId: 'tracking-add-build-btn', resetBtnId: 'tracking-reset-build-btn', roles: ['dps','healer','tank'] });
}

initTabs();
/* ─────────────────────────────────────────
   TAB SWITCHING
   (copy-link button lives in shared js/site.js)
───────────────────────────────────────── */
document.getElementById('tab-nav').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  const tab = btn.dataset.tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
});
