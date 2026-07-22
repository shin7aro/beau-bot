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
  // Weapons
  "Broadsword": "T8_MAIN_SWORD",
  "Claymore": "T8_2H_CLAYMORE",
  "Dual Swords": "T8_2H_DUALSWORD",
  "Clarent Blade": "T8_MAIN_SCIMITAR_MORGANA",
  "Carving Sword": "T8_2H_CLEAVER_HELL",
  "Galatine Pair": "T8_2H_DUALSCIMITAR_UNDEAD",
  "Kingmaker": "T8_2H_CLAYMORE_AVALON",
  "Infinity Blade": "T8_MAIN_SWORD_CRYSTAL",
  "Battleaxe": "T8_MAIN_AXE",
  "Great Axe": "T8_2H_AXE",
  "Halberd": "T8_2H_HALBERD",
  "Carrioncaller": "T8_2H_HALBERD_MORGANA",
  "Infernal Scythe": "T8_2H_SCYTHE_HELL",
  "Bear Paws": "T8_2H_DUALAXE_KEEPER",
  "Realmbreaker": "T8_2H_AXE_AVALON",
  "Crystal Reaper": "T8_2H_SCYTHE_CRYSTAL",
  "Mace": "T8_MAIN_MACE",
  "Heavy Mace": "T8_2H_MACE",
  "Morning Star": "T8_2H_FLAIL",
  "Bedrock Mace": "T8_MAIN_ROCKMACE_KEEPER",
  "Incubus Mace": "T8_MAIN_MACE_HELL",
  "Camlann Mace": "T8_2H_MACE_MORGANA",
  "Oathkeepers": "T8_2H_DUALMACE_AVALON",
  "Dreadstorm Monarch": "T8_MAIN_MACE_CRYSTAL",
  "Hammer": "T8_MAIN_HAMMER",
  "Polehammer": "T8_2H_POLEHAMMER",
  "Great Hammer": "T8_2H_HAMMER",
  "Tombhammer": "T8_2H_HAMMER_UNDEAD",
  "Forge Hammers": "T8_2H_DUALHAMMER_HELL",
  "Grovekeeper": "T8_2H_RAM_KEEPER",
  "Hand of Justice": "T8_2H_HAMMER_AVALON",
  "Truebolt Hammer": "T8_2H_HAMMER_CRYSTAL",
  "Crossbow": "T8_2H_CROSSBOW",
  "Heavy Crossbow": "T8_2H_CROSSBOWLARGE",
  "Light Crossbow": "T8_MAIN_1HCROSSBOW",
  "Weeping Repeater": "T8_2H_REPEATINGCROSSBOW_UNDEAD",
  "Boltcasters": "T8_2H_DUALCROSSBOW_HELL",
  "Siegebow": "T8_2H_CROSSBOWLARGE_MORGANA",
  "Energy Shaper": "T8_2H_CROSSBOW_CANNON_AVALON",
  "Arclight Blasters": "T8_2H_DUALCROSSBOW_CRYSTAL",
  "Brawler Gloves": "T8_2H_KNUCKLES_SET1",
  "Battler Bracers": "T8_2H_KNUCKLES_SET2",
  "Spiked Gauntlets": "T8_2H_KNUCKLES_SET3",
  "Ursine Maulers": "T8_2H_KNUCKLES_KEEPER",
  "Hellfire Hands": "T8_2H_KNUCKLES_HELL",
  "Ravenstrike Cestus": "T8_2H_KNUCKLES_MORGANA",
  "Fists of Avalon": "T8_2H_KNUCKLES_AVALON",
  "Forcepulse Bracers": "T8_2H_KNUCKLES_CRYSTAL",
  "Bow": "T8_2H_BOW",
  "Warbow": "T8_2H_WARBOW",
  "Longbow": "T8_2H_LONGBOW",
  "Whispering Bow": "T8_2H_LONGBOW_UNDEAD",
  "Wailing Bow": "T8_2H_BOW_HELL",
  "Bow of Badon": "T8_2H_BOW_KEEPER",
  "Mistpiercer": "T8_2H_BOW_AVALON",
  "Skystrider Bow": "T8_2H_BOW_CRYSTAL",
  "Dagger": "T8_MAIN_DAGGER",
  "Dagger Pair": "T8_2H_DAGGERPAIR",
  "Claws": "T8_2H_CLAWPAIR",
  "Bloodletter": "T8_MAIN_RAPIER_MORGANA",
  "Demonfang": "T8_MAIN_DAGGER_HELL",
  "Deathgivers": "T8_2H_DUALSICKLE_UNDEAD",
  "Bridled Fury": "T8_2H_DAGGER_KATAR_AVALON",
  "Twin Slayers": "T8_2H_DAGGERPAIR_CRYSTAL",
  "Spear": "T8_MAIN_SPEAR",
  "Pike": "T8_2H_SPEAR",
  "Glaive": "T8_2H_GLAIVE",
  "Heron Spear": "T8_MAIN_SPEAR_KEEPER",
  "Spirithunter": "T8_2H_HARPOON_HELL",
  "Trinity Spear": "T8_2H_TRIDENT_UNDEAD",
  "Daybreaker": "T8_MAIN_SPEAR_LANCE_AVALON",
  "Rift Glaive": "T8_2H_GLAIVE_CRYSTAL",
  "Quarterstaff": "T8_2H_QUARTERSTAFF",
  "Ironclad Staff": "T8_2H_IRONCLADEDSTAFF",
  "Double Bladed Staff": "T8_2H_DOUBLEBLADEDSTAFF",
  "Black Monk Stave": "T8_2H_COMBATSTAFF_MORGANA",
  "Soulscythe": "T8_2H_TWINSCYTHE_HELL",
  "Staff of Balance": "T8_2H_ROCKSTAFF_KEEPER",
  "Grailseeker": "T8_2H_QUARTERSTAFF_AVALON",
  "Phantom Twinblade": "T8_2H_DOUBLEBLADEDSTAFF_CRYSTAL",
  "Nature Staff": "T8_MAIN_NATURESTAFF",
  "Great Nature Staff": "T8_2H_NATURESTAFF",
  "Wild Staff": "T8_2H_WILDSTAFF",
  "Druidic Staff": "T8_MAIN_NATURESTAFF_KEEPER",
  "Blight Staff": "T8_2H_NATURESTAFF_HELL",
  "Rampant Staff": "T8_2H_NATURESTAFF_KEEPER",
  "Ironroot Staff": "T8_MAIN_NATURESTAFF_AVALON",
  "Forgebark Staff": "T8_MAIN_NATURESTAFF_CRYSTAL",
  "Prowling Staff": "T8_2H_SHAPESHIFTER_SET1",
  "Rootbound Staff": "T8_2H_SHAPESHIFTER_SET2",
  "Primal Staff": "T8_2H_SHAPESHIFTER_SET3",
  "Bloodmoon Staff": "T8_2H_SHAPESHIFTER_MORGANA",
  "Hellspawn Staff": "T8_2H_SHAPESHIFTER_HELL",
  "Earthrune Staff": "T8_2H_SHAPESHIFTER_KEEPER",
  "Lightcaller": "T8_2H_SHAPESHIFTER_AVALON",
  "Stillgaze Staff": "T8_2H_SHAPESHIFTER_CRYSTAL",
  "Fire Staff": "T8_MAIN_FIRESTAFF",
  "Great Fire Staff": "T8_2H_FIRESTAFF",
  "Infernal Staff": "T8_2H_INFERNOSTAFF",
  "Wildfire Staff": "T8_MAIN_FIRESTAFF_KEEPER",
  "Brimstone Staff": "T8_2H_FIRESTAFF_HELL",
  "Blazing Staff": "T8_2H_INFERNOSTAFF_MORGANA",
  "Dawnsong": "T8_2H_FIRE_RINGPAIR_AVALON",
  "Flamewalker Staff": "T8_MAIN_FIRESTAFF_CRYSTAL",
  "Holy Staff": "T8_MAIN_HOLYSTAFF",
  "Great Holy Staff": "T8_2H_HOLYSTAFF",
  "Divine Staff": "T8_2H_DIVINESTAFF",
  "Lifetouch Staff": "T8_MAIN_HOLYSTAFF_MORGANA",
  "Fallen Staff": "T8_2H_HOLYSTAFF_HELL",
  "Redemption Staff": "T8_2H_HOLYSTAFF_UNDEAD",
  "Hallowfall": "T8_MAIN_HOLYSTAFF_AVALON",
  "Exalted Staff": "T8_2H_HOLYSTAFF_CRYSTAL",
  "Arcane Staff": "T8_MAIN_ARCANESTAFF",
  "Great Arcane Staff": "T8_2H_ARCANESTAFF",
  "Enigmatic Staff": "T8_2H_ENIGMATICSTAFF",
  "Witchwork Staff": "T8_MAIN_ARCANESTAFF_UNDEAD",
  "Occult Staff": "T8_2H_ARCANESTAFF_HELL",
  "Malevolent Locus": "T8_2H_ENIGMATICORB_MORGANA",
  "Evensong": "T8_2H_ARCANE_RINGPAIR_AVALON",
  "Astral Staff": "T8_2H_ARCANESTAFF_CRYSTAL",
  "Frost Staff": "T8_MAIN_FROSTSTAFF",
  "Great Frost Staff": "T8_2H_FROSTSTAFF",
  "Glacial Staff": "T8_2H_GLACIALSTAFF",
  "Hoarfrost Staff": "T8_MAIN_FROSTSTAFF_KEEPER",
  "Icicle Staff": "T8_2H_ICEGAUNTLETS_HELL",
  "Permafrost Prism": "T8_2H_ICECRYSTAL_UNDEAD",
  "Chillhowl": "T8_MAIN_FROSTSTAFF_AVALON",
  "Arctic Staff": "T8_2H_FROSTSTAFF_CRYSTAL",
  "Cursed Staff": "T8_MAIN_CURSEDSTAFF",
  "Great Cursed Staff": "T8_2H_CURSEDSTAFF",
  "Demonic Staff": "T8_2H_DEMONICSTAFF",
  "Lifecurse Staff": "T8_MAIN_CURSEDSTAFF_UNDEAD",
  "Cursed Skull": "T8_2H_SKULLORB_HELL",
  "Damnation Staff": "T8_2H_CURSEDSTAFF_MORGANA",
  "Shadowcaller": "T8_MAIN_CURSEDSTAFF_AVALON",
  "Rotcaller Staff": "T8_MAIN_CURSEDSTAFF_CRYSTAL",
  // Offhand
  "Shield": "T8_OFF_SHIELD",
  "Sarcophagus": "T8_OFF_TOWERSHIELD_UNDEAD",
  "Caitiff Shield": "T8_OFF_SHIELD_HELL",
  "Facebreaker": "T8_OFF_SPIKEDSHIELD_MORGANA",
  "Astral Aegis": "T8_OFF_SHIELD_AVALON",
  "Unbreakable Ward": "T8_OFF_SHIELD_CRYSTAL",
  "Torch": "T8_OFF_TORCH",
  "Mistcaller": "T8_OFF_HORN_KEEPER",
  "Sacred Scepter": "T8_OFF_TALISMAN_AVALON",
  "Cryptcandle": "T8_OFF_LAMP_UNDEAD",
  "Leering Cane": "T8_OFF_JESTERCANE_HELL",
  "Blueflame Torch": "T8_OFF_TORCH_CRYSTAL",
  "Tome of spells": "T8_OFF_BOOK",
  "Eye of Secrets": "T8_OFF_ORB_MORGANA",
  "Muisak": "T8_OFF_DEMONSKULL_HELL",
  "Taproot": "T8_OFF_TOTEM_KEEPER",
  "Celestial Censer": "T8_OFF_CENSER_AVALON",
  "Timelocked Grimoire": "T8_OFF_TOME_CRYSTAL",
  // Headpiece
  "Soldier Helmet": "T8_HEAD_PLATE_SET1",
  "Knight Helmet": "T8_HEAD_PLATE_SET2",
  "Guardian Helmet": "T8_HEAD_PLATE_SET3",
  "Graveguard Helmet": "T8_HEAD_PLATE_UNDEAD",
  "Demon Helmet": "T8_HEAD_PLATE_HELL",
  "Judicator Helmet": "T8_HEAD_PLATE_KEEPER",
  "Duskweaver Helmet": "T8_HEAD_PLATE_FEY",
  "Helmet of Valor": "T8_HEAD_PLATE_AVALON",
  "Royal Helmet": "T8_HEAD_PLATE_ROYAL",
  "Mercenary Hood": "T8_HEAD_LEATHER_SET1",
  "Hunter Hood": "T8_HEAD_LEATHER_SET2",
  "Assassin Hood": "T8_HEAD_LEATHER_SET3",
  "Stalker Hood": "T8_HEAD_LEATHER_MORGANA",
  "Hellion Hood": "T8_HEAD_LEATHER_HELL",
  "Specter Hood": "T8_HEAD_LEATHER_UNDEAD",
  "Mistwalker Hood": "T8_HEAD_LEATHER_FEY",
  "Hood of Tenacity": "T8_HEAD_LEATHER_AVALON",
  "Royal Hood": "T8_HEAD_LEATHER_ROYAL",
  "Scholar Cowl": "T8_HEAD_CLOTH_SET1",
  "Cleric Cowl": "T8_HEAD_CLOTH_SET2",
  "Mage Cowl": "T8_HEAD_CLOTH_SET3",
  "Druid Cowl": "T8_HEAD_CLOTH_KEEPER",
  "Fiend Cowl": "T8_HEAD_CLOTH_HELL",
  "Cultist Cowl": "T8_HEAD_CLOTH_MORGANA",
  "Feyscale Hat": "T8_HEAD_CLOTH_FEY",
  "Cowl of Purity": "T8_HEAD_CLOTH_AVALON",
  "Royal Cowl": "T8_HEAD_CLOTH_ROYAL",
  // Chest Piece
  "Soldier Armor": "T8_ARMOR_PLATE_SET1",
  "Knight Armor": "T8_ARMOR_PLATE_SET2",
  "Guardian Armor": "T8_ARMOR_PLATE_SET3",
  "Graveguard Armor": "T8_ARMOR_PLATE_UNDEAD",
  "Demon Armor": "T8_ARMOR_PLATE_HELL",
  "Judicator Armor": "T8_ARMOR_PLATE_KEEPER",
  "Duskweaver Armor": "T8_ARMOR_PLATE_FEY",
  "Armor of Valor": "T8_ARMOR_PLATE_AVALON",
  "Royal Armor": "T8_ARMOR_PLATE_ROYAL",
  "Mercenary Jacket": "T8_ARMOR_LEATHER_SET1",
  "Hunter Jacket": "T8_ARMOR_LEATHER_SET2",
  "Assassin Jacket": "T8_ARMOR_LEATHER_SET3",
  "Stalker Jacket": "T8_ARMOR_LEATHER_MORGANA",
  "Hellion Jacket": "T8_ARMOR_LEATHER_HELL",
  "Specter Jacket": "T8_ARMOR_LEATHER_UNDEAD",
  "Mistwalker Jacket": "T8_ARMOR_LEATHER_FEY",
  "Jacket of Tenacity": "T8_ARMOR_LEATHER_AVALON",
  "Royal Jacket": "T8_ARMOR_LEATHER_ROYAL",
  "Scholar Robe": "T8_ARMOR_CLOTH_SET1",
  "Cleric Robe": "T8_ARMOR_CLOTH_SET2",
  "Mage Robe": "T8_ARMOR_CLOTH_SET3",
  "Druid Robe": "T8_ARMOR_CLOTH_KEEPER",
  "Fiend Robe": "T8_ARMOR_CLOTH_HELL",
  "Cultist Robe": "T8_ARMOR_CLOTH_MORGANA",
  "Feyscale Robe": "T8_ARMOR_CLOTH_FEY",
  "Robe of Purity": "T8_ARMOR_CLOTH_AVALON",
  "Royal Robe": "T8_ARMOR_CLOTH_ROYAL",
  // Footwear
  "Soldier Boots": "T8_SHOES_PLATE_SET1",
  "Knight Boots": "T8_SHOES_PLATE_SET2",
  "Guardian Boots": "T8_SHOES_PLATE_SET3",
  "Graveguard Boots": "T8_SHOES_PLATE_UNDEAD",
  "Demon Boots": "T8_SHOES_PLATE_HELL",
  "Judicator Boots": "T8_SHOES_PLATE_KEEPER",
  "Duskweaver Boots": "T8_SHOES_PLATE_FEY",
  "Boots of Valor": "T8_SHOES_PLATE_AVALON",
  "Royal Boots": "T8_SHOES_PLATE_ROYAL",
  "Mercenary Shoes": "T8_SHOES_LEATHER_SET1",
  "Hunter Shoes": "T8_SHOES_LEATHER_SET2",
  "Assassin Shoes": "T8_SHOES_LEATHER_SET3",
  "Stalker Shoes": "T8_SHOES_LEATHER_MORGANA",
  "Hellion Shoes": "T8_SHOES_LEATHER_HELL",
  "Specter Shoes": "T8_SHOES_LEATHER_UNDEAD",
  "Mistwalker Shoes": "T8_SHOES_LEATHER_FEY",
  "Shoes of Tenacity": "T8_SHOES_LEATHER_AVALON",
  "Royal Shoes": "T8_SHOES_LEATHER_ROYAL",
  "Scholar Sandals": "T8_SHOES_CLOTH_SET1",
  "Cleric Sandals": "T8_SHOES_CLOTH_SET2",
  "Mage Sandals": "T8_SHOES_CLOTH_SET3",
  "Druid Sandals": "T8_SHOES_CLOTH_KEEPER",
  "Fiend Sandals": "T8_SHOES_CLOTH_HELL",
  "Cultist Sandals": "T8_SHOES_CLOTH_MORGANA",
  "Feyscale Sandals": "T8_SHOES_CLOTH_FEY",
  "Sandals of Purity": "T8_SHOES_CLOTH_AVALON",
  "Royal Sandals": "T8_SHOES_CLOTH_ROYAL",
  // Cape
  "Bridgewatch Cape": "T8_CAPEITEM_FW_BRIDGEWATCH",
  "Martlock Cape": "T8_CAPEITEM_FW_MARTLOCK",
  "Thetford Cape": "T8_CAPEITEM_FW_THETFORD",
  "Fort Sterling Cape": "T8_CAPEITEM_FW_FORTSTERLING",
  "Lymhurst Cape": "T8_CAPEITEM_FW_LYMHURST",
  "Caerleon Cape": "T8_CAPEITEM_FW_CAERLEON",
  "Brecilien Cape": "T8_CAPEITEM_FW_BRECILIEN",
  "Avalonian Cape": "T8_CAPEITEM_AVALON",
  "Heretic Cape": "T8_CAPEITEM_HERETIC",
  "Undead Cape": "T8_CAPEITEM_UNDEAD",
  "Keeper Cape": "T8_CAPEITEM_KEEPER",
  "Morgana Cape": "T8_CAPEITEM_MORGANA",
  "Demon Cape": "T8_CAPEITEM_DEMON",
  "Smuggler Cape": "T8_CAPEITEM_SMUGGLER",
  // Potion
  "Poison Potion": "T8_POTION_COOLDOWN",
  "Invisibility Potion": "T8_POTION_CLEANSE",
  "Berserk Potion": "T8_POTION_BERSERK",
  "Hellfire Potion": "T8_POTION_LAVA",
  "Gathering Potion": "T8_POTION_GATHER",
  "Tornado in a Bottle": "T8_POTION_TORNADO",
  "Gigantify Potion": "T7_POTION_REVIVE",
  "Resistance Potion": "T7_POTION_STONESKIN",
  "Sticky Potion": "T7_POTION_SLOWFIELD",
  "Calming Potion": "T7_POTION_MOB_RESET",
  "Cleansing Potion": "T7_POTION_CLEANSE2",
  "Acid Potion": "T7_POTION_ACID",
  "Healing Potion": "T6_POTION_HEAL",
  "Energy Potion": "T6_POTION_ENERGY",
  // Food
  "Pork Pie": "T7_MEAL_PIE",
  "Pork Omelette": "T7_MEAL_OMELETTE",
  "Dusthole Crab Omelette": "T7_MEAL_OMELETTE_FISH",
  "Avalonian Pork Omelette": "T7_MEAL_OMELETTE_AVALON",
  "Beef Stew": "T8_MEAL_STEW",
  "Deadwater Eel Stew": "T8_MEAL_STEW_FISH",
  "Beef Sandwich": "T8_MEAL_SANDWICH",
  "Thunderfall Lurcher Sandwich": "T8_MEAL_SANDWICH_FISH",
  "Avalonian Beef Sandwich": "T8_MEAL_SANDWICH_AVALON",
  "Roast Pork": "T7_MEAL_ROAST",
  "Roasted Puremist Snapper": "T7_MEAL_ROAST_FISH",
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
      </div>
      ${(b.note || editable) ? `
      <div class="card-note-block${b.note ? '' : ' empty'}"${editable ? ' title="Click to edit note"' : ''}>
        ${FLAG_SVG}<span class="card-note-text">${b.note ? escapeHtml(b.note) : 'Add a note…'}</span>
      </div>` : ''}`;

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
      const noteBlock = card.querySelector('.card-note-block');
      if (noteBlock) noteBlock.addEventListener('click', function () {
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

  // Optional tabs (gank, brawl & clap, group dungeon, ava dungeon) start life
  // as a "coming soon" placeholder for everyone. The moment an officer/admin
  // is logged in — or the tab already has builds in it, for regular members
  // once someone's added the first one — the real builder UI takes over.
  if (opts.comingSoonId && opts.builderId) {
    const comingSoon = document.getElementById(opts.comingSoonId);
    const builder = document.getElementById(opts.builderId);
    const show = canEdit() || workingBuilds.length > 0;
    if (comingSoon) comingSoon.style.display = show ? 'none' : '';
    if (builder) builder.style.display = show ? '' : 'none';
  }

  // Lets a deep link (?tab=kite&build=3, e.g. from a posted Discord event's
  // roster) jump straight to this build once the page loads.
  TAB_SELECT_BY_INDEX[opts.tabKey] = (idx) => {
    activeRole = 'all'; searchStr = '';
    applyFilters();
    const build = workingBuilds[idx];
    const listIdx = build ? currentList.indexOf(build) : -1;
    if (listIdx !== -1) select(listIdx);
  };
}

const TAB_SELECT_BY_INDEX = {};

// Reads ?tab=<tabKey>&build=<index> from the URL (used by links the bot
// posts in Discord event rosters) and jumps straight to that build.
function applyDeepLinkFromURL() {
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');
  const buildIdx = params.get('build');
  if (!tab || buildIdx === null) return;

  const tabBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
  if (tabBtn) tabBtn.click();

  const selector = TAB_SELECT_BY_INDEX[tab];
  if (selector) selector(parseInt(buildIdx, 10));
}

async function initTabs() {
  await window.SITE_AUTH_READY;
  ALL_BUILDS = await fetchAllBuilds();

  createTab({ tabKey: 'brawl',    searchId: 'search',          filterId: 'filter-group',          countId: 'count-label',          tbodyId: 'tbody',          emptyId: 'empty',          placeholderId: 'detail-placeholder',          cardId: 'detail-card',          paneId: 'brawl-detail-pane',    addBtnId: 'add-build-btn',          resetBtnId: 'reset-build-btn',          roles: ['dps','healer','support','tank'] });
  createTab({ tabKey: 'kite',     searchId: 'kite-search',     filterId: 'kite-filter-group',     countId: 'kite-count-label',     tbodyId: 'kite-tbody',     emptyId: 'kite-empty',     placeholderId: 'kite-detail-placeholder',     cardId: 'kite-detail-card',     paneId: 'kite-detail-pane',     addBtnId: 'kite-add-build-btn',     resetBtnId: 'kite-reset-build-btn',     roles: ['dps','healer','support','tank'] });
  createTab({ tabKey: 'tracking', searchId: 'tracking-search', filterId: 'tracking-filter-group', countId: 'tracking-count-label', tbodyId: 'tracking-tbody', emptyId: 'tracking-empty', placeholderId: 'tracking-detail-placeholder', cardId: 'tracking-detail-card', paneId: 'tracking-detail-pane', addBtnId: 'tracking-add-build-btn', resetBtnId: 'tracking-reset-build-btn', roles: ['dps','healer','tank'] });

  // Optional tabs — "coming soon" for everyone until an officer/admin logs
  // in and starts building it out, or it already has builds in it.
  createTab({ tabKey: 'gank',         searchId: 'gank-search',         filterId: 'gank-filter-group',         countId: 'gank-count-label',         tbodyId: 'gank-tbody',         emptyId: 'gank-empty',         placeholderId: 'gank-detail-placeholder',         cardId: 'gank-detail-card',         paneId: 'gank-detail-pane',         addBtnId: 'gank-add-build-btn',         resetBtnId: 'gank-reset-build-btn',         roles: ['gank','dps','healer','support','tank'], comingSoonId: 'gank-comingsoon',         builderId: 'gank-builder' });
  createTab({ tabKey: 'brawlclap',    searchId: 'brawlclap-search',    filterId: 'brawlclap-filter-group',    countId: 'brawlclap-count-label',    tbodyId: 'brawlclap-tbody',    emptyId: 'brawlclap-empty',    placeholderId: 'brawlclap-detail-placeholder',    cardId: 'brawlclap-detail-card',    paneId: 'brawlclap-detail-pane',    addBtnId: 'brawlclap-add-build-btn',    resetBtnId: 'brawlclap-reset-build-btn',    roles: ['dps','healer','support','tank'],          comingSoonId: 'brawlclap-comingsoon',    builderId: 'brawlclap-builder' });
  createTab({ tabKey: 'groupdungeon', searchId: 'groupdungeon-search', filterId: 'groupdungeon-filter-group', countId: 'groupdungeon-count-label', tbodyId: 'groupdungeon-tbody', emptyId: 'groupdungeon-empty', placeholderId: 'groupdungeon-detail-placeholder', cardId: 'groupdungeon-detail-card', paneId: 'groupdungeon-detail-pane', addBtnId: 'groupdungeon-add-build-btn', resetBtnId: 'groupdungeon-reset-build-btn', roles: ['dps','healer','support','tank'],          comingSoonId: 'groupdungeon-comingsoon', builderId: 'groupdungeon-builder' });
  createTab({ tabKey: 'avadungeon',  searchId: 'avadungeon-search',  filterId: 'avadungeon-filter-group',  countId: 'avadungeon-count-label',  tbodyId: 'avadungeon-tbody',  emptyId: 'avadungeon-empty',  placeholderId: 'avadungeon-detail-placeholder',  cardId: 'avadungeon-detail-card',  paneId: 'avadungeon-detail-pane',  addBtnId: 'avadungeon-add-build-btn',  resetBtnId: 'avadungeon-reset-build-btn',  roles: ['dps','healer','support','tank'],          comingSoonId: 'avadungeon-comingsoon',  builderId: 'avadungeon-builder' });

  applyDeepLinkFromURL();
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
