// build-card-image.js
// Renders a single PNG showing every equipment slot of a build as an icon
// tile with its item name underneath — the visual equivalent of the
// slots-grid on builds.html's detail card.
//
// Why this exists: a Discord embed can only carry one setThumbnail() (small)
// and one setImage() (large) — there's no way to attach a separate icon to
// each embed field. To show all 8 slot icons at once (head/cape/weapon/
// chest/offhand/potion/feet/food), we fetch each item's render from
// render.albiononline.com and composite them into one image server-side
// with `sharp`, then attach that single PNG and point setImage() at it.
//
// Everything here is free: render.albiononline.com is Albion's own public,
// unauthenticated asset server, and `sharp` is a local, open-source library
// (no hosted/paid image service involved).

const sharp = require('sharp');
const itemMap = require('./item-map');
const spellMap = require('./spell-map');
const buildSpellStore = require('./build-spell-store');

const TILE = 96; // icon size, px
const GAP = 10; // spacing between cells, px
const SPELL_ICON = 20; // per-spell badge size, px
const SPELL_ROW_H = SPELL_ICON + 4; // strip housing the spell badges, under the icon
const LABEL_H = 26; // label strip height under each icon, px
const COLS = 3;
const ROWS = 3;
const CELL_W = TILE + GAP;
const CELL_H = TILE + SPELL_ROW_H + LABEL_H + GAP;
const CANVAS_BG = { r: 30, g: 32, b: 38, alpha: 1 };
const TILE_BG = { r: 47, g: 50, b: 58, alpha: 1 };

// Mirrors the 3x3 `slots-grid` layout in public/js/builds.js's card
// template: empty / Head / Cape, then Weapon / Chest / Offhand, then
// Potion / Feet / Food.
const LAYOUT = [
  [null, 'head', 'cape'],
  ['weapon', 'chest', 'offhand'],
  ['potion', 'feet', 'food'],
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

// A rounded-rect tile background, reused for every slot (empty or filled).
function tileBackgroundSvg() {
  return Buffer.from(
    `<svg width="${TILE}" height="${TILE}">
      <rect width="${TILE}" height="${TILE}" rx="10" ry="10"
        fill="rgb(${TILE_BG.r},${TILE_BG.g},${TILE_BG.b})" />
    </svg>`
  );
}

function labelSvg(text) {
  const safe = escapeXml(truncate(text, 15));
  return Buffer.from(
    `<svg width="${TILE}" height="${LABEL_H}">
      <text x="50%" y="${LABEL_H - 8}" font-family="sans-serif" font-size="12"
        fill="#dcdfe4" text-anchor="middle">${safe}</text>
    </svg>`
  );
}

async function fetchIconBuffer(itemName) {
  const url = itemMap.itemImageUrl(itemName);
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null; // network hiccup or unknown item — caller just shows an empty tile
  }
}

// Same fallback-candidate order as public/js/spell-map.js's
// window.spellIconCandidates(): confirmed (hand-verified working URL) beats
// spell (raw uniquename, the most reliable general fallback), which beats
// name/icon. Tries each in turn against Albion's public render server.
function spellIconCandidateUrls(candidate) {
  const ids = [candidate.confirmed, candidate.spell, candidate.name, candidate.icon].filter(Boolean);
  return [...new Set(ids)].map((id) => `https://render.albiononline.com/v1/spell/${encodeURIComponent(id)}.png`);
}

async function fetchSpellIconBuffer(candidate) {
  for (const url of spellIconCandidateUrls(candidate)) {
    try {
      const res = await fetch(url);
      if (res.ok) return Buffer.from(await res.arrayBuffer());
    } catch {
      // try the next candidate URL
    }
  }
  return null; // every candidate failed — caller just skips the badge
}

// This build's chosen spells for one gear slot (e.g. this weapon's Q/W/E/
// passive), read via build-spell-store — same per-build, per-slot, per-row
// data the site's builds.js/spell-picker.html write to. Only rows the
// build actually has a choice saved for come back; empty/unset rows are
// left out entirely (there's no "editable +" placeholder in a static image).
function chosenSpellsForSlot(itemName, slotKey, buildSpells) {
  const entry = itemName && spellMap.SPELL_MAP[itemName];
  if (!entry) return [];
  const choices = (buildSpells && buildSpells[slotKey]) || {};
  const chosen = [];
  for (const g of entry.groups) {
    const spellId = choices[g.key];
    if (!spellId) continue;
    const candidate = g.spells.find((s) => s.spell === spellId);
    if (candidate) chosen.push(candidate);
  }
  return chosen;
}

// Returns a PNG buffer for the full build card image, or throws if sharp
// itself fails (caller should catch and fall back to a text-only embed).
// `buildKey` (the same "<tab>:<index>" identity used everywhere else this
// build's spell choices are read) is optional — pass it to also badge each
// gear tile with its chosen spells; omit it to render gear-only, as before.
async function renderBuildCard(build, buildKey) {
  const width = CELL_W * COLS;
  const height = CELL_H * ROWS;
  const tileBg = tileBackgroundSvg();
  const buildSpells = buildKey ? await buildSpellStore.loadBuildSpells(buildKey) : {};

  // Collect every occupied cell first, then fetch + resize all icons in
  // parallel. Fetching them one at a time (the original approach) chained
  // up to 8 sequential network round-trips to render.albiononline.com,
  // which was slow enough in practice to blow past Discord's 3-second
  // interaction window even with a defer in place.
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const slotKey = LAYOUT[r][c];
      if (!slotKey) continue;
      cells.push({
        left: c * CELL_W + GAP / 2,
        top: r * CELL_H + GAP / 2,
        itemName: build[slotKey],
        slotKey,
        spells: chosenSpellsForSlot(build[slotKey], slotKey, buildSpells),
      });
    }
  }

  const [icons, spellIconSets] = await Promise.all([
    Promise.all(
      cells.map(async (cell) => {
        if (!cell.itemName) return null;
        const iconBuf = await fetchIconBuffer(cell.itemName);
        if (!iconBuf) return null;
        try {
          return await sharp(iconBuf).resize(TILE - 10, TILE - 10, { fit: 'contain' }).png().toBuffer();
        } catch {
          return null; // corrupt/unexpected image data — just skip the icon, keep the label
        }
      })
    ),
    Promise.all(
      cells.map((cell) =>
        Promise.all(
          cell.spells.map(async (spell) => {
            const buf = await fetchSpellIconBuffer(spell);
            if (!buf) return null;
            try {
              return await sharp(buf).resize(SPELL_ICON, SPELL_ICON, { fit: 'contain' }).png().toBuffer();
            } catch {
              return null;
            }
          })
        )
      )
    ),
  ]);

  const composites = [];
  cells.forEach((cell, i) => {
    composites.push({ input: tileBg, left: cell.left, top: cell.top });
    if (icons[i]) composites.push({ input: icons[i], left: cell.left + 5, top: cell.top + 5 });

    // Small spell badges in a centered row directly under the gear icon —
    // the static-image equivalent of builds.js's .gear-spell-col strip.
    const badges = (spellIconSets[i] || []).filter(Boolean);
    if (badges.length) {
      const rowWidth = badges.length * SPELL_ICON + (badges.length - 1) * 4;
      let bx = cell.left + (TILE - rowWidth) / 2;
      const by = cell.top + TILE + 2;
      for (const badge of badges) {
        composites.push({ input: badge, left: Math.round(bx), top: by });
        bx += SPELL_ICON + 4;
      }
    }

    composites.push({ input: labelSvg(cell.itemName || '—'), left: cell.left, top: cell.top + TILE + SPELL_ROW_H });
  });

  return sharp({ create: { width, height, channels: 4, background: CANVAS_BG } })
    .composite(composites)
    .png()
    .toBuffer();
}

module.exports = { renderBuildCard };
