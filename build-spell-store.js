// build-spell-store.js
// Persistent per-build spell choices, e.g.
//   {
//     "brawl:0": {
//       "weapon": { "active1": "HEROICSTRIKE2", "active2": "SWORD_SPIN", "active3": "MIGHTYBLOW", "passive": "PASSIVE_BLEEDCHANCE" },
//       "head":   { "active": "STONESKIN", "passive": "PASSIVE_CCDURATION" }
//     },
//     ...
//   }
//
// Populated by hand on the (Shin7aro-only) "Spell Picker" admin page
// (public/spell-picker.html) — see api.js's /api/build-spells routes.
// Keyed by "<tab>:<index>", the same build-identity convention
// builds-store.js's listAllForLinking() already uses (builds have no
// separate stable id — a build's tab + position in that tab's array
// is what identifies it everywhere else on the site). That means
// reordering or deleting builds within a tab will desync this map from
// the build it was meant for, same caveat that already applies to the
// comp editor's "linked build" references — nothing new here.
//
// Same shared-Redis pattern as weapon-emoji-store.js, with the same
// local-JSON-file fallback for local dev.

const path = require('path');
const storage = require('./storage');

const DB_PATH = path.join(__dirname, 'build-spells.json'); // local fallback path only
const REDIS_KEY = 'build_spells';

async function loadAllBuildSpells() {
  return storage.loadJSON(REDIS_KEY, DB_PATH);
}

async function loadBuildSpells(buildKey) {
  const all = await loadAllBuildSpells();
  return all[buildKey] || {};
}

// Sets (or, with a falsy spellId, clears) a single row's chosen spell for
// one build's one gear slot, without touching anything else already saved
// for that build — this is what each radio click on the Spell Picker page
// calls, so one save can't race/undo another.
async function setBuildSpellChoice(buildKey, slotKey, groupKey, spellId) {
  const all = await loadAllBuildSpells();
  if (!all[buildKey]) all[buildKey] = {};
  if (!all[buildKey][slotKey]) all[buildKey][slotKey] = {};
  if (spellId) all[buildKey][slotKey][groupKey] = spellId;
  else delete all[buildKey][slotKey][groupKey];

  if (Object.keys(all[buildKey][slotKey]).length === 0) delete all[buildKey][slotKey];
  if (Object.keys(all[buildKey]).length === 0) delete all[buildKey];

  await storage.saveJSON(REDIS_KEY, DB_PATH, all);
  return all[buildKey] || {};
}

module.exports = { loadAllBuildSpells, loadBuildSpells, setBuildSpellChoice };
