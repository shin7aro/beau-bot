/* ─────────────────────────────────────────
   SPELL MAP — shared frontend gear name -> Albion
   spell-slot data (plus each item's real Albion
   subcategory, e.g. "sword", "plate_helmet", from
   items.xml's own @shopsubcategory1). Used by the
   (Shin7aro-only) Spell Picker admin page
   (spell-picker.html/js) to list every gear piece,
   grouped the way Albion itself groups them, with
   its pickable spell rows. Load this after item-map.js.

   ICON CAVEAT: render.albiononline.com has no single
   consistent spell-icon naming scheme (confirmed
   against the wiki + a working third-party API
   example — some spells are keyed by display name,
   others by an internal codename that matches neither
   the display name nor our "icon"/uisprite value). Each
   candidate below carries three identifiers (name/icon/
   spell) and spell-picker.js tries each in turn client-
   side, falling back to a text badge if all three miss.

   NOTE: there is also a server-side copy of this map
   in spell-map.js at the project root (index.js/api.js
   can't reach browser code directly). Keep both in
   sync — see that file's header for how this was
   generated and how to regenerate it.
───────────────────────────────────────── */
const SPELL_MAP = {
  // Weapons
  "Arcane Staff": { itemId: "T8_MAIN_ARCANESTAFF", slot: "weapon", category: "arcanestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE", name: "Chain Missile" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION", name: "Arcane Protection" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE", name: "Magic Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE", name: "Enigma Blade" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE", name: "Motivating Cleanse" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE", name: "Frazzle" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE", name: "Empowering Beam" }, { spell: "MIMIC", icon: "MIMIC", name: "Mimic" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2", name: "Arcane Orb" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Lingering Power" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Arcanestaff" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Arcanestaff" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE", name: "Hush" }] }
  ] },
  "Arclight Blasters": { itemId: "T8_2H_DUALCROSSBOW_CRYSTAL", slot: "weapon", category: "crossbow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG", name: "Auto Fire" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE", name: "Explosive Bolt" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB", name: "Explosive Salvo" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT", name: "Sunder Shot" }, { spell: "CALTROPS", icon: "CALTROPS", name: "Caltrops" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC", name: "Knockback Shot" }, { spell: "SILENCINGBOLT", icon: "SILENCE", name: "Noise Eraser" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR", name: "Snipe Shot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE", name: "Forceful Bolts" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER", name: "Well-Prepared" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Crossbow" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Crossbow" }] }
  ] },
  "Arctic Staff": { itemId: "T8_2H_FROSTSTAFF_CRYSTAL", slot: "weapon", category: "froststaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE", name: "Frostbite" }, { spell: "ICESHARD", icon: "ICE_SHARD", name: "Ice Shard" }, { spell: "SHATTER_Q", icon: "FROST_NOVA", name: "Shatter Q" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST", name: "Frostbomb Castslow" }, { spell: "FROSTBEAM", icon: "FROSTBEAM", name: "Frost Beam" }, { spell: "FROSTNOVA", icon: "FROSTNOVA", name: "Frost Nova" }, { spell: "FROST_LANCE", icon: "HOARFROST", name: "Frost Lance" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE", name: "Glacial Obelisk" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST", name: "Freezing Wind" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1", name: "Frost" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Froststaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Froststaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Froststaff" }] }
  ] },
  // Chest
  "Armor of Valor": { itemId: "T8_ARMOR_PLATE_AVALON", slot: "chest", category: "plate_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "TAUNT", icon: "TAUNT", name: "Taunt" }, { spell: "REFLECT_CHANNEL", icon: "FORCEFIELD", name: "Requite" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN", name: "Spirit Crush" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS", name: "Protective Instinct" }] }
  ] },
  // Head
  "Assassin Hood": { itemId: "T8_HEAD_LEATHER_SET3", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "SUMMONER_CD_REDUCTION", icon: "HASTEN_COOLDOWN", name: "Meditation" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Chest
  "Assassin Jacket": { itemId: "T8_ARMOR_LEATHER_SET3", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "AMBUSH", icon: "STEALTH", name: "Ambush" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Feet
  "Assassin Shoes": { itemId: "T8_SHOES_LEATHER_SET3", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "ASSASSIN_DASH", icon: "DASH", name: "Swift Cut" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Weapons
  "Astral Staff": { itemId: "T8_2H_ARCANESTAFF_CRYSTAL", slot: "weapon", category: "arcanestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE", name: "Chain Missile" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION", name: "Arcane Protection" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE", name: "Magic Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE", name: "Enigma Blade" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE", name: "Motivating Cleanse" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE", name: "Frazzle" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE", name: "Empowering Beam" }, { spell: "MIMIC", icon: "MIMIC", name: "Mimic" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2", name: "Arcane Orb" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Lingering Power" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Arcanestaff" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Arcanestaff" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE", name: "Hush" }] }
  ] },
  "Battleaxe": { itemId: "T8_MAIN_AXE", slot: "weapon", category: "axe", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT", name: "Rending Strike" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD", name: "Rending Spin" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1", name: "Rending Rage" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE", name: "Deadly Chop" }, { spell: "AXEBOOST", icon: "STRENGTH", name: "Adrenaline Boost" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF", name: "Battle Rush" }, { spell: "INNERBLEEDING", icon: "BLEED", name: "Internal Bleeding" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES", name: "Raging Blades" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT", name: "Blood Bandit" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Axe" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Axe" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Axe" }] }
  ] },
  "Battler Bracers": { itemId: "T8_2H_KNUCKLES_SET2", slot: "weapon", category: "knuckles", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING", name: "Create Opening" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK", name: "Dragon Leap" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1", name: "Crossstep Roundhouse" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH", name: "Shockwave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK", name: "Triple Kick" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH", name: "Backhand Strike" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER", name: "Counter" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO", name: "Devastating Combo" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER", name: "Blazing Geyser" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE", name: "Passive Knuckle Brawler" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN", name: "Rage" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1", name: "Rushdown" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD", name: "Hard to Catch" }] }
  ] },
  "Bear Paws": { itemId: "T8_2H_DUALAXE_KEEPER", slot: "weapon", category: "axe", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT", name: "Rending Strike" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD", name: "Rending Spin" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1", name: "Rending Rage" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE", name: "Deadly Chop" }, { spell: "AXEBOOST", icon: "STRENGTH", name: "Adrenaline Boost" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF", name: "Battle Rush" }, { spell: "INNERBLEEDING", icon: "BLEED", name: "Internal Bleeding" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES", name: "Raging Blades" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT", name: "Blood Bandit" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Axe" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Axe" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Axe" }] }
  ] },
  "Bedrock Mace": { itemId: "T8_MAIN_ROCKMACE_KEEPER", slot: "weapon", category: "mace", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF", name: "Defensive Slam" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND", name: "Threatening Smash" }, { spell: "SACRED_GROUND", icon: "SILENCE", name: "Sacred Ground" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER", name: "Ground Shaker" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF", name: "Snare Charge" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD", name: "Guard Rune" }, { spell: "PBAOE_PULL", icon: "PULL_AOE", name: "Air Compressor" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK", name: "Deep Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Mace" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Mace" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Mace" }] }
  ] },
  "Black Monk Stave": { itemId: "T8_2H_COMBATSTAFF_MORGANA", slot: "weapon", category: "quarterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN", name: "Concussive Combo" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES", name: "Whirling Strikes" }, { spell: "CARTWHEEL", icon: "CARTWHEEL", name: "Cartwheel" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO", name: "Gale Dance" }, { spell: "STUNRUN", icon: "SPRINT_CC", name: "Stun Run" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING", name: "Forceful Swing" }, { spell: "LAUNCHER", icon: "KNOCKUP", name: "Rising Blow" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF", name: "Separator" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP", name: "Vault Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE", name: "Passive Stunchance Quarterstaff" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Quarterstaff" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Quarterstaff" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Quarterstaff" }] }
  ] },
  "Blazing Staff": { itemId: "T8_2H_INFERNOSTAFF_MORGANA", slot: "weapon", category: "firestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE", name: "Fire Bolt" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE", name: "Burning Field" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME", name: "Searing Flame" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE", name: "Flame Blast" }, { spell: "FIREWALL", icon: "INCINERATE", name: "Wall of Flames" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE", name: "Raging Flare" }, { spell: "FIRECONE", icon: "FLAMECONE", name: "Fire Wave" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY", name: "Fire Artillery" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL", name: "Pyroblast Skillshot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1", name: "Burn" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Firestaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Firestaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Firestaff" }] }
  ] },
  "Blight Staff": { itemId: "T8_2H_NATURESTAFF_HELL", slot: "weapon", category: "naturestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT", name: "Rejuvenation" }, { spell: "THORNSAREA", icon: "THORNSAREA", name: "Thorn Growth" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL", name: "Rejuvmushroom Grenade" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS", name: "Brambleseed" }, { spell: "REANIMATE", icon: "REANIMATE", name: "Revitalize" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM", name: "Protection of Nature" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL", name: "Cleanse Heal" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE", name: "Rejuvenating Breeze" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE", name: "Circle of Life" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Naturestaff" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Naturestaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Naturestaff" }] }
  ] },
  "Bloodletter": { itemId: "T8_MAIN_RAPIER_MORGANA", slot: "weapon", category: "dagger", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR", name: "Sunder Armor" }, { spell: "QDASH", icon: "DEADLY_SWIPE", name: "Deadly Swipe" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT", name: "Assassin Spirit" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES", name: "Throwing Blades" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER", name: "Dash" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB", name: "Forbidden Stab" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW", name: "Shadow Edge" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH", name: "Chain Slash" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE", name: "Bloodthirsty Blade" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Dagger" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Dagger" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Dagger" }] }
  ] },
  "Bloodmoon Staff": { itemId: "T8_2H_SHAPESHIFTER_MORGANA", slot: "weapon", category: "shapeshifterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE", name: "Unstable Projectile" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE", name: "Reality Fissure" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX", name: "Adapting Matter" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION", name: "Pulse Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION", name: "Distortion" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT", name: "Positional Drift" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL", name: "Tether Shift" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH", name: "Polymorph" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER", name: "Shadow Panther Transformation" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT", name: "Altered Beast" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR", name: "Intimidating Presence" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN", name: "Innate Power" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER", name: "Rule Bender" }] }
  ] },
  "Boltcasters": { itemId: "T8_2H_DUALCROSSBOW_HELL", slot: "weapon", category: "crossbow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG", name: "Auto Fire" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE", name: "Explosive Bolt" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB", name: "Explosive Salvo" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT", name: "Sunder Shot" }, { spell: "CALTROPS", icon: "CALTROPS", name: "Caltrops" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC", name: "Knockback Shot" }, { spell: "SILENCINGBOLT", icon: "SILENCE", name: "Noise Eraser" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR", name: "Snipe Shot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE", name: "Forceful Bolts" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER", name: "Well-Prepared" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Crossbow" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Crossbow" }] }
  ] },
  // Feet
  "Boots of Valor": { itemId: "T8_SHOES_PLATE_AVALON", slot: "feet", category: "plate_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL", name: "Rejuvenating Sprint" }, { spell: "CC_BLOCK", icon: "PURGE_HOLY", name: "Premonition" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Weapons
  "Bow": { itemId: "T8_2H_BOW", slot: "weapon", category: "bow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE", name: "Multishot" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED", name: "Deadly Shot" }, { spell: "POISONARROW", icon: "POISONED_ARROW", name: "Poisoned Arrow" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT", name: "Ray of Light" }, { spell: "JUMPSHOT2", icon: "BACKFLIP", name: "Frost Shot" }, { spell: "SPEEDSHOT2", icon: "ARROW", name: "Speed Shot" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION", name: "Explosive Arrows" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE", name: "Speedarcher Kite" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Bow" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER", name: "Piercing Arrows" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Bow" }] }
  ] },
  "Bow of Badon": { itemId: "T8_2H_BOW_KEEPER", slot: "weapon", category: "bow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE", name: "Multishot" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED", name: "Deadly Shot" }, { spell: "POISONARROW", icon: "POISONED_ARROW", name: "Poisoned Arrow" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT", name: "Ray of Light" }, { spell: "JUMPSHOT2", icon: "BACKFLIP", name: "Frost Shot" }, { spell: "SPEEDSHOT2", icon: "ARROW", name: "Speed Shot" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION", name: "Explosive Arrows" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE", name: "Speedarcher Kite" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Bow" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER", name: "Piercing Arrows" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Bow" }] }
  ] },
  "Brawler Gloves": { itemId: "T8_2H_KNUCKLES_SET1", slot: "weapon", category: "knuckles", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING", name: "Create Opening" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK", name: "Dragon Leap" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1", name: "Crossstep Roundhouse" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH", name: "Shockwave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK", name: "Triple Kick" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH", name: "Backhand Strike" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER", name: "Counter" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO", name: "Devastating Combo" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER", name: "Blazing Geyser" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE", name: "Passive Knuckle Brawler" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN", name: "Rage" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1", name: "Rushdown" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD", name: "Hard to Catch" }] }
  ] },
  "Bridled Fury": { itemId: "T8_2H_DAGGER_KATAR_AVALON", slot: "weapon", category: "dagger", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR", name: "Sunder Armor" }, { spell: "QDASH", icon: "DEADLY_SWIPE", name: "Deadly Swipe" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT", name: "Assassin Spirit" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES", name: "Throwing Blades" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER", name: "Dash" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB", name: "Forbidden Stab" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW", name: "Shadow Edge" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH", name: "Chain Slash" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE", name: "Bloodthirsty Blade" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Dagger" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Dagger" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Dagger" }] }
  ] },
  "Brimstone Staff": { itemId: "T8_2H_FIRESTAFF_HELL", slot: "weapon", category: "firestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE", name: "Fire Bolt" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE", name: "Burning Field" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME", name: "Searing Flame" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE", name: "Flame Blast" }, { spell: "FIREWALL", icon: "INCINERATE", name: "Wall of Flames" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE", name: "Raging Flare" }, { spell: "FIRECONE", icon: "FLAMECONE", name: "Fire Wave" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY", name: "Fire Artillery" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL", name: "Pyroblast Skillshot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1", name: "Burn" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Firestaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Firestaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Firestaff" }] }
  ] },
  "Broadsword": { itemId: "T8_MAIN_SWORD", slot: "weapon", category: "sword", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE", name: "Heroic Strike" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD", name: "Heroic Cleave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN", name: "Blade Cyclone" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT", name: "Interrupt" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH", name: "Splitting Slash" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING", name: "Hamstring" }, { spell: "PARRY", icon: "BLOCK", name: "Parry Strike" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF", name: "Iron Will" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD", name: "Mighty Blow" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN", name: "Weakening" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS", name: "Heroic Fighting" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Sword" }] }
  ] },
  "Camlann Mace": { itemId: "T8_2H_MACE_MORGANA", slot: "weapon", category: "mace", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF", name: "Defensive Slam" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND", name: "Threatening Smash" }, { spell: "SACRED_GROUND", icon: "SILENCE", name: "Sacred Ground" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER", name: "Ground Shaker" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF", name: "Snare Charge" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD", name: "Guard Rune" }, { spell: "PBAOE_PULL", icon: "PULL_AOE", name: "Air Compressor" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK", name: "Deep Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Mace" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Mace" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Mace" }] }
  ] },
  "Carrioncaller": { itemId: "T8_2H_HALBERD_MORGANA", slot: "weapon", category: "axe", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT", name: "Rending Strike" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD", name: "Rending Spin" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1", name: "Rending Rage" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE", name: "Deadly Chop" }, { spell: "AXEBOOST", icon: "STRENGTH", name: "Adrenaline Boost" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF", name: "Battle Rush" }, { spell: "INNERBLEEDING", icon: "BLEED", name: "Internal Bleeding" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES", name: "Raging Blades" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT", name: "Blood Bandit" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Axe" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Axe" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Axe" }] }
  ] },
  "Carving Sword": { itemId: "T8_2H_CLEAVER_HELL", slot: "weapon", category: "sword", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE", name: "Heroic Strike" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD", name: "Heroic Cleave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN", name: "Blade Cyclone" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT", name: "Interrupt" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH", name: "Splitting Slash" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING", name: "Hamstring" }, { spell: "PARRY", icon: "BLOCK", name: "Parry Strike" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF", name: "Iron Will" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD", name: "Mighty Blow" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN", name: "Weakening" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS", name: "Heroic Fighting" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Sword" }] }
  ] },
  "Chillhowl": { itemId: "T8_MAIN_FROSTSTAFF_AVALON", slot: "weapon", category: "froststaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE", name: "Frostbite" }, { spell: "ICESHARD", icon: "ICE_SHARD", name: "Ice Shard" }, { spell: "SHATTER_Q", icon: "FROST_NOVA", name: "Shatter Q" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST", name: "Frostbomb Castslow" }, { spell: "FROSTBEAM", icon: "FROSTBEAM", name: "Frost Beam" }, { spell: "FROSTNOVA", icon: "FROSTNOVA", name: "Frost Nova" }, { spell: "FROST_LANCE", icon: "HOARFROST", name: "Frost Lance" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE", name: "Glacial Obelisk" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST", name: "Freezing Wind" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1", name: "Frost" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Froststaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Froststaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Froststaff" }] }
  ] },
  "Clarent Blade": { itemId: "T8_MAIN_SCIMITAR_MORGANA", slot: "weapon", category: "sword", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE", name: "Heroic Strike" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD", name: "Heroic Cleave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN", name: "Blade Cyclone" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT", name: "Interrupt" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH", name: "Splitting Slash" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING", name: "Hamstring" }, { spell: "PARRY", icon: "BLOCK", name: "Parry Strike" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF", name: "Iron Will" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD", name: "Mighty Blow" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN", name: "Weakening" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS", name: "Heroic Fighting" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Sword" }] }
  ] },
  "Claws": { itemId: "T8_2H_CLAWPAIR", slot: "weapon", category: "dagger", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR", name: "Sunder Armor" }, { spell: "QDASH", icon: "DEADLY_SWIPE", name: "Deadly Swipe" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT", name: "Assassin Spirit" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES", name: "Throwing Blades" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER", name: "Dash" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB", name: "Forbidden Stab" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW", name: "Shadow Edge" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH", name: "Chain Slash" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE", name: "Bloodthirsty Blade" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Dagger" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Dagger" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Dagger" }] }
  ] },
  "Claymore": { itemId: "T8_2H_CLAYMORE", slot: "weapon", category: "sword", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE", name: "Heroic Strike" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD", name: "Heroic Cleave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN", name: "Blade Cyclone" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT", name: "Interrupt" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH", name: "Splitting Slash" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING", name: "Hamstring" }, { spell: "PARRY", icon: "BLOCK", name: "Parry Strike" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF", name: "Iron Will" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD", name: "Mighty Blow" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN", name: "Weakening" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS", name: "Heroic Fighting" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Sword" }] }
  ] },
  // Head
  "Cleric Cowl": { itemId: "T8_HEAD_CLOTH_SET2", slot: "head", category: "cloth_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT", name: "Force Field" }, { spell: "ICEBLOCK2", icon: "ICEBLOCK2", name: "Ice Block" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Chest
  "Cleric Robe": { itemId: "T8_ARMOR_CLOTH_SET2", slot: "chest", category: "cloth_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD", name: "Frost Shield" }, { spell: "LIFESAVIOR", icon: "PURGE_HOLY", name: "Everlasting Spirit" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Armor Increased Castspeed" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Feet
  "Cleric Sandals": { itemId: "T8_SHOES_CLOTH_SET2", slot: "feet", category: "cloth_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY", name: "Energetic Sprint" }, { spell: "BLINK", icon: "BLINK", name: "Blink" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Head
  "Cowl of Purity": { itemId: "T8_HEAD_CLOTH_AVALON", slot: "head", category: "cloth_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT", name: "Force Field" }, { spell: "AVALON_BEAM", icon: "BEAM_HOLY", name: "Avalonian Beam" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Weapons
  "Crossbow": { itemId: "T8_2H_CROSSBOW", slot: "weapon", category: "crossbow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG", name: "Auto Fire" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE", name: "Explosive Bolt" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB", name: "Explosive Salvo" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT", name: "Sunder Shot" }, { spell: "CALTROPS", icon: "CALTROPS", name: "Caltrops" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC", name: "Knockback Shot" }, { spell: "SILENCINGBOLT", icon: "SILENCE", name: "Noise Eraser" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR", name: "Snipe Shot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE", name: "Forceful Bolts" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER", name: "Well-Prepared" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Crossbow" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Crossbow" }] }
  ] },
  "Crystal Reaper": { itemId: "T8_2H_SCYTHE_CRYSTAL", slot: "weapon", category: "axe", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT", name: "Rending Strike" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD", name: "Rending Spin" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1", name: "Rending Rage" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE", name: "Deadly Chop" }, { spell: "AXEBOOST", icon: "STRENGTH", name: "Adrenaline Boost" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF", name: "Battle Rush" }, { spell: "INNERBLEEDING", icon: "BLEED", name: "Internal Bleeding" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES", name: "Raging Blades" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT", name: "Blood Bandit" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Axe" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Axe" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Axe" }] }
  ] },
  // Head
  "Cultist Cowl": { itemId: "T8_HEAD_CLOTH_MORGANA", slot: "head", category: "cloth_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT", name: "Force Field" }, { spell: "INNER_CORRUPTION", icon: "CURSE", name: "Inner Corruption" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Chest
  "Cultist Robe": { itemId: "T8_ARMOR_CLOTH_MORGANA", slot: "chest", category: "cloth_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD", name: "Frost Shield" }, { spell: "LEVITATE", icon: "LEVITATE", name: "Levitate" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Armor Increased Castspeed" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Feet
  "Cultist Sandals": { itemId: "T8_SHOES_CLOTH_MORGANA", slot: "feet", category: "cloth_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY", name: "Energetic Sprint" }, { spell: "DEMONWALK", icon: "CURSED_AREA", name: "Rotten Ground" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Weapons
  "Cursed Skull": { itemId: "T8_2H_SKULLORB_HELL", slot: "weapon", category: "cursestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE", name: "Vile Curse" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE", name: "Cursed Sickle" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA", name: "Cursed Tar" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER", name: "Armor Piercer" }, { spell: "CURSENOVA", icon: "DESECRATE", name: "Desecrate" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC", name: "Cursedhands Stackup" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM", name: "Cursed Beam" }, { spell: "DARKMATTER", icon: "DARK_MATTER", name: "Dark Matter" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE", name: "Death Curse" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1", name: "Bane" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Cursedstaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Cursedstaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Cursedstaff" }] }
  ] },
  "Cursed Staff": { itemId: "T8_MAIN_CURSEDSTAFF", slot: "weapon", category: "cursestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE", name: "Vile Curse" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE", name: "Cursed Sickle" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA", name: "Cursed Tar" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER", name: "Armor Piercer" }, { spell: "CURSENOVA", icon: "DESECRATE", name: "Desecrate" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC", name: "Cursedhands Stackup" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM", name: "Cursed Beam" }, { spell: "DARKMATTER", icon: "DARK_MATTER", name: "Dark Matter" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE", name: "Death Curse" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1", name: "Bane" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Cursedstaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Cursedstaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Cursedstaff" }] }
  ] },
  "Dagger": { itemId: "T8_MAIN_DAGGER", slot: "weapon", category: "dagger", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR", name: "Sunder Armor" }, { spell: "QDASH", icon: "DEADLY_SWIPE", name: "Deadly Swipe" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT", name: "Assassin Spirit" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES", name: "Throwing Blades" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER", name: "Dash" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB", name: "Forbidden Stab" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW", name: "Shadow Edge" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH", name: "Chain Slash" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE", name: "Bloodthirsty Blade" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Dagger" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Dagger" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Dagger" }] }
  ] },
  "Dagger Pair": { itemId: "T8_2H_DAGGERPAIR", slot: "weapon", category: "dagger", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR", name: "Sunder Armor" }, { spell: "QDASH", icon: "DEADLY_SWIPE", name: "Deadly Swipe" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT", name: "Assassin Spirit" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES", name: "Throwing Blades" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER", name: "Dash" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB", name: "Forbidden Stab" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW", name: "Shadow Edge" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH", name: "Chain Slash" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE", name: "Bloodthirsty Blade" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Dagger" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Dagger" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Dagger" }] }
  ] },
  "Damnation Staff": { itemId: "T8_2H_CURSEDSTAFF_MORGANA", slot: "weapon", category: "cursestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE", name: "Vile Curse" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE", name: "Cursed Sickle" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA", name: "Cursed Tar" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER", name: "Armor Piercer" }, { spell: "CURSENOVA", icon: "DESECRATE", name: "Desecrate" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC", name: "Cursedhands Stackup" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM", name: "Cursed Beam" }, { spell: "DARKMATTER", icon: "DARK_MATTER", name: "Dark Matter" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE", name: "Death Curse" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1", name: "Bane" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Cursedstaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Cursedstaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Cursedstaff" }] }
  ] },
  "Dawnsong": { itemId: "T8_2H_FIRE_RINGPAIR_AVALON", slot: "weapon", category: "firestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE", name: "Fire Bolt" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE", name: "Burning Field" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME", name: "Searing Flame" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE", name: "Flame Blast" }, { spell: "FIREWALL", icon: "INCINERATE", name: "Wall of Flames" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE", name: "Raging Flare" }, { spell: "FIRECONE", icon: "FLAMECONE", name: "Fire Wave" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY", name: "Fire Artillery" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL", name: "Pyroblast Skillshot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1", name: "Burn" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Firestaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Firestaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Firestaff" }] }
  ] },
  "Daybreaker": { itemId: "T8_MAIN_SPEAR_LANCE_AVALON", slot: "weapon", category: "spear", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW", name: "Lunging Strike" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR", name: "Spirit Spear" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE", name: "Forest of Spears" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE", name: "Inner Focus" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE", name: "Cripple" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE", name: "Deflecting Spin" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR", name: "Impaler" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON", name: "Harpoon" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH", name: "Reckless Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Spear" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Spear" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Spear" }] }
  ] },
  "Deathgivers": { itemId: "T8_2H_DUALSICKLE_UNDEAD", slot: "weapon", category: "dagger", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR", name: "Sunder Armor" }, { spell: "QDASH", icon: "DEADLY_SWIPE", name: "Deadly Swipe" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT", name: "Assassin Spirit" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES", name: "Throwing Blades" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER", name: "Dash" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB", name: "Forbidden Stab" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW", name: "Shadow Edge" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH", name: "Chain Slash" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE", name: "Bloodthirsty Blade" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Dagger" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Dagger" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Dagger" }] }
  ] },
  // Chest
  "Demon Armor": { itemId: "T8_ARMOR_PLATE_HELL", slot: "chest", category: "plate_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "TAUNT", icon: "TAUNT", name: "Taunt" }, { spell: "REFLECTAREA", icon: "RETALITATE", name: "Protection of the Fiends" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN", name: "Spirit Crush" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS", name: "Protective Instinct" }] }
  ] },
  // Feet
  "Demon Boots": { itemId: "T8_SHOES_PLATE_HELL", slot: "feet", category: "plate_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL", name: "Rejuvenating Sprint" }, { spell: "BERSERK_SPRINT", icon: "SPRINT_DAMAGE", name: "Vengeful Sprint" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Head
  "Demon Helmet": { itemId: "T8_HEAD_PLATE_HELL", slot: "head", category: "plate_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "STONESKIN", icon: "OVERLOAD", name: "Stone Skin" }, { spell: "WEAPON_SILENCE", icon: "SILENCE", name: "Hush" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Weapons
  "Demonfang": { itemId: "T8_MAIN_DAGGER_HELL", slot: "weapon", category: "dagger", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR", name: "Sunder Armor" }, { spell: "QDASH", icon: "DEADLY_SWIPE", name: "Deadly Swipe" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT", name: "Assassin Spirit" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES", name: "Throwing Blades" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER", name: "Dash" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB", name: "Forbidden Stab" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW", name: "Shadow Edge" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH", name: "Chain Slash" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE", name: "Bloodthirsty Blade" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Dagger" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Dagger" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Dagger" }] }
  ] },
  "Demonic Staff": { itemId: "T8_2H_DEMONICSTAFF", slot: "weapon", category: "cursestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE", name: "Vile Curse" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE", name: "Cursed Sickle" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA", name: "Cursed Tar" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER", name: "Armor Piercer" }, { spell: "CURSENOVA", icon: "DESECRATE", name: "Desecrate" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC", name: "Cursedhands Stackup" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM", name: "Cursed Beam" }, { spell: "DARKMATTER", icon: "DARK_MATTER", name: "Dark Matter" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE", name: "Death Curse" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1", name: "Bane" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Cursedstaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Cursedstaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Cursedstaff" }] }
  ] },
  "Divine Staff": { itemId: "T8_2H_DIVINESTAFF", slot: "weapon", category: "holystaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY", name: "Generous Heal" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY", name: "Smite Aoe" }, { spell: "HOLYFLASH", icon: "AOE_HOLY", name: "Holy Flash" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE", name: "Sacred Pulse" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM", name: "Holy Beam" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER", name: "Holy Blessing" }, { spell: "HOLYORB", icon: "HOLY_ORB", name: "Holy Orb" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY", name: "Reawaken" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER", name: "Desperate Prayer" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Holystaff" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE", name: "Magic Force" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER", name: "Ascended" }] }
  ] },
  "Double Bladed Staff": { itemId: "T8_2H_DOUBLEBLADEDSTAFF", slot: "weapon", category: "quarterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN", name: "Concussive Combo" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES", name: "Whirling Strikes" }, { spell: "CARTWHEEL", icon: "CARTWHEEL", name: "Cartwheel" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO", name: "Gale Dance" }, { spell: "STUNRUN", icon: "SPRINT_CC", name: "Stun Run" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING", name: "Forceful Swing" }, { spell: "LAUNCHER", icon: "KNOCKUP", name: "Rising Blow" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF", name: "Separator" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP", name: "Vault Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE", name: "Passive Stunchance Quarterstaff" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Quarterstaff" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Quarterstaff" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Quarterstaff" }] }
  ] },
  // Head
  "Dragonslayer Hood": { itemId: "T8_HEAD_LEATHER_DRAGON", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "FLARE", icon: "FLARE", name: "Flare" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Chest
  "Dragonslayer Jacket": { itemId: "T8_ARMOR_LEATHER_DRAGON", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "IMMUNEAREA", icon: "IMMUNEAREA", name: "Wings of Fire" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Feet
  "Dragonslayer Shoes": { itemId: "T8_SHOES_LEATHER_DRAGON", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "WEAPON_SPRINT", icon: "WEAPON_SPRINT", name: "Burning Momentum" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Weapons
  "Dreadstorm Monarch": { itemId: "T8_MAIN_MACE_CRYSTAL", slot: "weapon", category: "mace", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF", name: "Defensive Slam" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND", name: "Threatening Smash" }, { spell: "SACRED_GROUND", icon: "SILENCE", name: "Sacred Ground" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER", name: "Ground Shaker" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF", name: "Snare Charge" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD", name: "Guard Rune" }, { spell: "PBAOE_PULL", icon: "PULL_AOE", name: "Air Compressor" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK", name: "Deep Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Mace" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Mace" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Mace" }] }
  ] },
  // Head
  "Druid Cowl": { itemId: "T8_HEAD_CLOTH_KEEPER", slot: "head", category: "cloth_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT", name: "Force Field" }, { spell: "ENERGYFIELD", icon: "RESTOREENERGY", name: "Circle of Inspiration" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Chest
  "Druid Robe": { itemId: "T8_ARMOR_CLOTH_KEEPER", slot: "chest", category: "cloth_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD", name: "Frost Shield" }, { spell: "SPELLRUSH", icon: "OVERLOAD", name: "Obsessive Burst" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Armor Increased Castspeed" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Feet
  "Druid Sandals": { itemId: "T8_SHOES_CLOTH_KEEPER", slot: "feet", category: "cloth_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY", name: "Energetic Sprint" }, { spell: "FROSTWALK", icon: "CONE_FROST", name: "Frost Walk" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Weapons
  "Druidic Staff": { itemId: "T8_MAIN_NATURESTAFF_KEEPER", slot: "weapon", category: "naturestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT", name: "Rejuvenation" }, { spell: "THORNSAREA", icon: "THORNSAREA", name: "Thorn Growth" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL", name: "Rejuvmushroom Grenade" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS", name: "Brambleseed" }, { spell: "REANIMATE", icon: "REANIMATE", name: "Revitalize" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM", name: "Protection of Nature" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL", name: "Cleanse Heal" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE", name: "Rejuvenating Breeze" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE", name: "Circle of Life" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Naturestaff" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Naturestaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Naturestaff" }] }
  ] },
  "Dual Swords": { itemId: "T8_2H_DUALSWORD", slot: "weapon", category: "sword", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE", name: "Heroic Strike" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD", name: "Heroic Cleave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN", name: "Blade Cyclone" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT", name: "Interrupt" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH", name: "Splitting Slash" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING", name: "Hamstring" }, { spell: "PARRY", icon: "BLOCK", name: "Parry Strike" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF", name: "Iron Will" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD", name: "Mighty Blow" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN", name: "Weakening" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS", name: "Heroic Fighting" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Sword" }] }
  ] },
  // Chest
  "Duskweaver Armor": { itemId: "T8_ARMOR_PLATE_FEY", slot: "chest", category: "plate_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "TAUNT", icon: "TAUNT", name: "Taunt" }, { spell: "ARMOR_WEB", icon: "MYTHICAL_WEB", name: "Mythical Web" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN", name: "Spirit Crush" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS", name: "Protective Instinct" }] }
  ] },
  // Feet
  "Duskweaver Boots": { itemId: "T8_SHOES_PLATE_FEY", slot: "feet", category: "plate_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL", name: "Rejuvenating Sprint" }, { spell: "CHARGE_IN", icon: "CARGE_IN", name: "Crush Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Head
  "Duskweaver Helmet": { itemId: "T8_HEAD_PLATE_FEY", slot: "head", category: "plate_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "STONESKIN", icon: "OVERLOAD", name: "Stone Skin" }, { spell: "SPIDER_THREAD", icon: "SPIDER_THREAD", name: "Spider's Thread" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Weapons
  "Earthrune Staff": { itemId: "T8_2H_SHAPESHIFTER_KEEPER", slot: "weapon", category: "shapeshifterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE", name: "Unstable Projectile" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE", name: "Reality Fissure" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX", name: "Adapting Matter" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION", name: "Pulse Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION", name: "Distortion" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT", name: "Positional Drift" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL", name: "Tether Shift" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH", name: "Polymorph" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER", name: "Shadow Panther Transformation" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT", name: "Altered Beast" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR", name: "Intimidating Presence" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN", name: "Innate Power" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER", name: "Rule Bender" }] }
  ] },
  "Energy Shaper": { itemId: "T8_2H_CROSSBOW_CANNON_AVALON", slot: "weapon", category: "crossbow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG", name: "Auto Fire" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE", name: "Explosive Bolt" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB", name: "Explosive Salvo" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT", name: "Sunder Shot" }, { spell: "CALTROPS", icon: "CALTROPS", name: "Caltrops" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC", name: "Knockback Shot" }, { spell: "SILENCINGBOLT", icon: "SILENCE", name: "Noise Eraser" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR", name: "Snipe Shot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE", name: "Forceful Bolts" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER", name: "Well-Prepared" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Crossbow" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Crossbow" }] }
  ] },
  "Enigmatic Staff": { itemId: "T8_2H_ENIGMATICSTAFF", slot: "weapon", category: "arcanestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE", name: "Chain Missile" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION", name: "Arcane Protection" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE", name: "Magic Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE", name: "Enigma Blade" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE", name: "Motivating Cleanse" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE", name: "Frazzle" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE", name: "Empowering Beam" }, { spell: "MIMIC", icon: "MIMIC", name: "Mimic" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2", name: "Arcane Orb" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Lingering Power" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Arcanestaff" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Arcanestaff" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE", name: "Hush" }] }
  ] },
  "Evensong": { itemId: "T8_2H_ARCANE_RINGPAIR_AVALON", slot: "weapon", category: "arcanestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE", name: "Chain Missile" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION", name: "Arcane Protection" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE", name: "Magic Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE", name: "Enigma Blade" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE", name: "Motivating Cleanse" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE", name: "Frazzle" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE", name: "Empowering Beam" }, { spell: "MIMIC", icon: "MIMIC", name: "Mimic" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2", name: "Arcane Orb" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Lingering Power" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Arcanestaff" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Arcanestaff" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE", name: "Hush" }] }
  ] },
  "Exalted Staff": { itemId: "T8_2H_HOLYSTAFF_CRYSTAL", slot: "weapon", category: "holystaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY", name: "Generous Heal" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY", name: "Smite Aoe" }, { spell: "HOLYFLASH", icon: "AOE_HOLY", name: "Holy Flash" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE", name: "Sacred Pulse" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM", name: "Holy Beam" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER", name: "Holy Blessing" }, { spell: "HOLYORB", icon: "HOLY_ORB", name: "Holy Orb" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY", name: "Reawaken" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER", name: "Desperate Prayer" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Holystaff" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE", name: "Magic Force" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER", name: "Ascended" }] }
  ] },
  "Fallen Staff": { itemId: "T8_2H_HOLYSTAFF_HELL", slot: "weapon", category: "holystaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY", name: "Generous Heal" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY", name: "Smite Aoe" }, { spell: "HOLYFLASH", icon: "AOE_HOLY", name: "Holy Flash" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE", name: "Sacred Pulse" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM", name: "Holy Beam" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER", name: "Holy Blessing" }, { spell: "HOLYORB", icon: "HOLY_ORB", name: "Holy Orb" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY", name: "Reawaken" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER", name: "Desperate Prayer" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Holystaff" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE", name: "Magic Force" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER", name: "Ascended" }] }
  ] },
  // Head
  "Feyscale Hat": { itemId: "T8_HEAD_CLOTH_FEY", slot: "head", category: "cloth_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT", name: "Force Field" }, { spell: "HYPER_FOCUS", icon: "HYPERFOCUS", name: "Hyper Focus" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Chest
  "Feyscale Robe": { itemId: "T8_ARMOR_CLOTH_FEY", slot: "chest", category: "cloth_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD", name: "Frost Shield" }, { spell: "WILD_MAGIC", icon: "WILD_MAGIC", name: "Wild Magic" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Armor Increased Castspeed" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Feet
  "Feyscale Sandals": { itemId: "T8_SHOES_CLOTH_FEY", slot: "feet", category: "cloth_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY", name: "Energetic Sprint" }, { spell: "TRANSLUCENT", icon: "TRANSLUCENT", name: "Ethereal Form" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Head
  "Fiend Cowl": { itemId: "T8_HEAD_CLOTH_HELL", slot: "head", category: "cloth_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT", name: "Force Field" }, { spell: "PURGE_HELMET", icon: "PURGE", name: "Purge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Chest
  "Fiend Robe": { itemId: "T8_ARMOR_CLOTH_HELL", slot: "chest", category: "cloth_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD", name: "Frost Shield" }, { spell: "FEAR_AURA", icon: "FEAR", name: "Fear Aura" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Armor Increased Castspeed" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Feet
  "Fiend Sandals": { itemId: "T8_SHOES_CLOTH_HELL", slot: "feet", category: "cloth_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY", name: "Energetic Sprint" }, { spell: "SWAP", icon: "MAGICBARRIER", name: "Position Swap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Weapons
  "Fire Staff": { itemId: "T8_MAIN_FIRESTAFF", slot: "weapon", category: "firestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE", name: "Fire Bolt" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE", name: "Burning Field" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME", name: "Searing Flame" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE", name: "Flame Blast" }, { spell: "FIREWALL", icon: "INCINERATE", name: "Wall of Flames" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE", name: "Raging Flare" }, { spell: "FIRECONE", icon: "FLAMECONE", name: "Fire Wave" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY", name: "Fire Artillery" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL", name: "Pyroblast Skillshot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1", name: "Burn" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Firestaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Firestaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Firestaff" }] }
  ] },
  "Fists of Avalon": { itemId: "T8_2H_KNUCKLES_AVALON", slot: "weapon", category: "knuckles", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING", name: "Create Opening" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK", name: "Dragon Leap" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1", name: "Crossstep Roundhouse" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH", name: "Shockwave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK", name: "Triple Kick" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH", name: "Backhand Strike" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER", name: "Counter" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO", name: "Devastating Combo" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER", name: "Blazing Geyser" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE", name: "Passive Knuckle Brawler" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN", name: "Rage" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1", name: "Rushdown" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD", name: "Hard to Catch" }] }
  ] },
  "Flamewalker Staff": { itemId: "T8_MAIN_FIRESTAFF_CRYSTAL", slot: "weapon", category: "firestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE", name: "Fire Bolt" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE", name: "Burning Field" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME", name: "Searing Flame" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE", name: "Flame Blast" }, { spell: "FIREWALL", icon: "INCINERATE", name: "Wall of Flames" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE", name: "Raging Flare" }, { spell: "FIRECONE", icon: "FLAMECONE", name: "Fire Wave" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY", name: "Fire Artillery" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL", name: "Pyroblast Skillshot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1", name: "Burn" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Firestaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Firestaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Firestaff" }] }
  ] },
  "Forcepulse Bracers": { itemId: "T8_2H_KNUCKLES_CRYSTAL", slot: "weapon", category: "knuckles", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING", name: "Create Opening" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK", name: "Dragon Leap" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1", name: "Crossstep Roundhouse" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH", name: "Shockwave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK", name: "Triple Kick" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH", name: "Backhand Strike" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER", name: "Counter" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO", name: "Devastating Combo" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER", name: "Blazing Geyser" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE", name: "Passive Knuckle Brawler" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN", name: "Rage" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1", name: "Rushdown" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD", name: "Hard to Catch" }] }
  ] },
  "Forge Hammers": { itemId: "T8_2H_DUALHAMMER_HELL", slot: "weapon", category: "hammer", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE", name: "Powerful Swing" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE", name: "Threatening Strike" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR", name: "Iron Breaker" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR", name: "Seismic Tremor" }, { spell: "CHARGESLOWAE", icon: "POUNCE", name: "Slowing Charge" }, { spell: "GEYSER", icon: "EMPOWERMENT", name: "Power Geyser" }, { spell: "KNOCKOUT", icon: "MEZZ", name: "Knockout" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE", name: "Inertia Ring" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER", name: "Earth Shatter" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Hammer" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Hammer" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Hammer" }] }
  ] },
  "Forgebark Staff": { itemId: "T8_MAIN_NATURESTAFF_CRYSTAL", slot: "weapon", category: "naturestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT", name: "Rejuvenation" }, { spell: "THORNSAREA", icon: "THORNSAREA", name: "Thorn Growth" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL", name: "Rejuvmushroom Grenade" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS", name: "Brambleseed" }, { spell: "REANIMATE", icon: "REANIMATE", name: "Revitalize" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM", name: "Protection of Nature" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL", name: "Cleanse Heal" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE", name: "Rejuvenating Breeze" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE", name: "Circle of Life" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Naturestaff" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Naturestaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Naturestaff" }] }
  ] },
  "Frost Staff": { itemId: "T8_MAIN_FROSTSTAFF", slot: "weapon", category: "froststaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE", name: "Frostbite" }, { spell: "ICESHARD", icon: "ICE_SHARD", name: "Ice Shard" }, { spell: "SHATTER_Q", icon: "FROST_NOVA", name: "Shatter Q" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST", name: "Frostbomb Castslow" }, { spell: "FROSTBEAM", icon: "FROSTBEAM", name: "Frost Beam" }, { spell: "FROSTNOVA", icon: "FROSTNOVA", name: "Frost Nova" }, { spell: "FROST_LANCE", icon: "HOARFROST", name: "Frost Lance" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE", name: "Glacial Obelisk" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST", name: "Freezing Wind" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1", name: "Frost" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Froststaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Froststaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Froststaff" }] }
  ] },
  "Galatine Pair": { itemId: "T8_2H_DUALSCIMITAR_UNDEAD", slot: "weapon", category: "sword", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE", name: "Heroic Strike" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD", name: "Heroic Cleave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN", name: "Blade Cyclone" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT", name: "Interrupt" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH", name: "Splitting Slash" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING", name: "Hamstring" }, { spell: "PARRY", icon: "BLOCK", name: "Parry Strike" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF", name: "Iron Will" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD", name: "Mighty Blow" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN", name: "Weakening" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS", name: "Heroic Fighting" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Sword" }] }
  ] },
  "Glacial Staff": { itemId: "T8_2H_GLACIALSTAFF", slot: "weapon", category: "froststaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE", name: "Frostbite" }, { spell: "ICESHARD", icon: "ICE_SHARD", name: "Ice Shard" }, { spell: "SHATTER_Q", icon: "FROST_NOVA", name: "Shatter Q" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST", name: "Frostbomb Castslow" }, { spell: "FROSTBEAM", icon: "FROSTBEAM", name: "Frost Beam" }, { spell: "FROSTNOVA", icon: "FROSTNOVA", name: "Frost Nova" }, { spell: "FROST_LANCE", icon: "HOARFROST", name: "Frost Lance" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE", name: "Glacial Obelisk" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST", name: "Freezing Wind" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1", name: "Frost" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Froststaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Froststaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Froststaff" }] }
  ] },
  "Glaive": { itemId: "T8_2H_GLAIVE", slot: "weapon", category: "spear", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW", name: "Lunging Strike" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR", name: "Spirit Spear" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE", name: "Forest of Spears" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE", name: "Inner Focus" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE", name: "Cripple" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE", name: "Deflecting Spin" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR", name: "Impaler" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON", name: "Harpoon" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH", name: "Reckless Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Spear" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Spear" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Spear" }] }
  ] },
  "Grailseeker": { itemId: "T8_2H_QUARTERSTAFF_AVALON", slot: "weapon", category: "quarterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN", name: "Concussive Combo" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES", name: "Whirling Strikes" }, { spell: "CARTWHEEL", icon: "CARTWHEEL", name: "Cartwheel" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO", name: "Gale Dance" }, { spell: "STUNRUN", icon: "SPRINT_CC", name: "Stun Run" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING", name: "Forceful Swing" }, { spell: "LAUNCHER", icon: "KNOCKUP", name: "Rising Blow" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF", name: "Separator" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP", name: "Vault Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE", name: "Passive Stunchance Quarterstaff" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Quarterstaff" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Quarterstaff" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Quarterstaff" }] }
  ] },
  // Chest
  "Graveguard Armor": { itemId: "T8_ARMOR_PLATE_UNDEAD", slot: "chest", category: "plate_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "TAUNT", icon: "TAUNT", name: "Taunt" }, { spell: "ARMORCHAIN", icon: "PULL_AOE", name: "Soul Chain" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN", name: "Spirit Crush" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS", name: "Protective Instinct" }] }
  ] },
  // Feet
  "Graveguard Boots": { itemId: "T8_SHOES_PLATE_UNDEAD", slot: "feet", category: "plate_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL", name: "Rejuvenating Sprint" }, { spell: "BATTLEFRENZY", icon: "PURGE_HOLY", name: "Battle Frenzy" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Head
  "Graveguard Helmet": { itemId: "T8_HEAD_PLATE_UNDEAD", slot: "head", category: "plate_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "STONESKIN", icon: "OVERLOAD", name: "Stone Skin" }, { spell: "SACRIFICE_HEAL", icon: "LIFESTEAL", name: "Sacrifice" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Weapons
  "Great Arcane Staff": { itemId: "T8_2H_ARCANESTAFF", slot: "weapon", category: "arcanestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE", name: "Chain Missile" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION", name: "Arcane Protection" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE", name: "Magic Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE", name: "Enigma Blade" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE", name: "Motivating Cleanse" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE", name: "Frazzle" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE", name: "Empowering Beam" }, { spell: "MIMIC", icon: "MIMIC", name: "Mimic" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2", name: "Arcane Orb" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Lingering Power" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Arcanestaff" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Arcanestaff" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE", name: "Hush" }] }
  ] },
  "Great Axe": { itemId: "T8_2H_AXE", slot: "weapon", category: "axe", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT", name: "Rending Strike" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD", name: "Rending Spin" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1", name: "Rending Rage" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE", name: "Deadly Chop" }, { spell: "AXEBOOST", icon: "STRENGTH", name: "Adrenaline Boost" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF", name: "Battle Rush" }, { spell: "INNERBLEEDING", icon: "BLEED", name: "Internal Bleeding" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES", name: "Raging Blades" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT", name: "Blood Bandit" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Axe" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Axe" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Axe" }] }
  ] },
  "Great Cursed Staff": { itemId: "T8_2H_CURSEDSTAFF", slot: "weapon", category: "cursestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE", name: "Vile Curse" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE", name: "Cursed Sickle" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA", name: "Cursed Tar" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER", name: "Armor Piercer" }, { spell: "CURSENOVA", icon: "DESECRATE", name: "Desecrate" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC", name: "Cursedhands Stackup" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM", name: "Cursed Beam" }, { spell: "DARKMATTER", icon: "DARK_MATTER", name: "Dark Matter" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE", name: "Death Curse" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1", name: "Bane" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Cursedstaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Cursedstaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Cursedstaff" }] }
  ] },
  "Great Fire Staff": { itemId: "T8_2H_FIRESTAFF", slot: "weapon", category: "firestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE", name: "Fire Bolt" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE", name: "Burning Field" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME", name: "Searing Flame" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE", name: "Flame Blast" }, { spell: "FIREWALL", icon: "INCINERATE", name: "Wall of Flames" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE", name: "Raging Flare" }, { spell: "FIRECONE", icon: "FLAMECONE", name: "Fire Wave" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY", name: "Fire Artillery" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL", name: "Pyroblast Skillshot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1", name: "Burn" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Firestaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Firestaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Firestaff" }] }
  ] },
  "Great Frost Staff": { itemId: "T8_2H_FROSTSTAFF", slot: "weapon", category: "froststaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE", name: "Frostbite" }, { spell: "ICESHARD", icon: "ICE_SHARD", name: "Ice Shard" }, { spell: "SHATTER_Q", icon: "FROST_NOVA", name: "Shatter Q" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST", name: "Frostbomb Castslow" }, { spell: "FROSTBEAM", icon: "FROSTBEAM", name: "Frost Beam" }, { spell: "FROSTNOVA", icon: "FROSTNOVA", name: "Frost Nova" }, { spell: "FROST_LANCE", icon: "HOARFROST", name: "Frost Lance" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE", name: "Glacial Obelisk" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST", name: "Freezing Wind" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1", name: "Frost" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Froststaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Froststaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Froststaff" }] }
  ] },
  "Great Hammer": { itemId: "T8_2H_HAMMER", slot: "weapon", category: "hammer", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE", name: "Powerful Swing" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE", name: "Threatening Strike" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR", name: "Iron Breaker" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR", name: "Seismic Tremor" }, { spell: "CHARGESLOWAE", icon: "POUNCE", name: "Slowing Charge" }, { spell: "GEYSER", icon: "EMPOWERMENT", name: "Power Geyser" }, { spell: "KNOCKOUT", icon: "MEZZ", name: "Knockout" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE", name: "Inertia Ring" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER", name: "Earth Shatter" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Hammer" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Hammer" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Hammer" }] }
  ] },
  "Great Holy Staff": { itemId: "T8_2H_HOLYSTAFF", slot: "weapon", category: "holystaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY", name: "Generous Heal" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY", name: "Smite Aoe" }, { spell: "HOLYFLASH", icon: "AOE_HOLY", name: "Holy Flash" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE", name: "Sacred Pulse" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM", name: "Holy Beam" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER", name: "Holy Blessing" }, { spell: "HOLYORB", icon: "HOLY_ORB", name: "Holy Orb" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY", name: "Reawaken" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER", name: "Desperate Prayer" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Holystaff" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE", name: "Magic Force" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER", name: "Ascended" }] }
  ] },
  "Great Nature Staff": { itemId: "T8_2H_NATURESTAFF", slot: "weapon", category: "naturestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT", name: "Rejuvenation" }, { spell: "THORNSAREA", icon: "THORNSAREA", name: "Thorn Growth" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL", name: "Rejuvmushroom Grenade" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS", name: "Brambleseed" }, { spell: "REANIMATE", icon: "REANIMATE", name: "Revitalize" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM", name: "Protection of Nature" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL", name: "Cleanse Heal" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE", name: "Rejuvenating Breeze" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE", name: "Circle of Life" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Naturestaff" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Naturestaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Naturestaff" }] }
  ] },
  "Grovekeeper": { itemId: "T8_2H_RAM_KEEPER", slot: "weapon", category: "hammer", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE", name: "Powerful Swing" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE", name: "Threatening Strike" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR", name: "Iron Breaker" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR", name: "Seismic Tremor" }, { spell: "CHARGESLOWAE", icon: "POUNCE", name: "Slowing Charge" }, { spell: "GEYSER", icon: "EMPOWERMENT", name: "Power Geyser" }, { spell: "KNOCKOUT", icon: "MEZZ", name: "Knockout" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE", name: "Inertia Ring" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER", name: "Earth Shatter" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Hammer" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Hammer" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Hammer" }] }
  ] },
  // Chest
  "Guardian Armor": { itemId: "T8_ARMOR_PLATE_SET3", slot: "chest", category: "plate_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "TAUNT", icon: "TAUNT", name: "Taunt" }, { spell: "ENFEEBLEAURA", icon: "BARRIER_DEMONIC", name: "Enfeeble Aura" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN", name: "Spirit Crush" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS", name: "Protective Instinct" }] }
  ] },
  // Feet
  "Guardian Boots": { itemId: "T8_SHOES_PLATE_SET3", slot: "feet", category: "plate_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL", name: "Rejuvenating Sprint" }, { spell: "MAXHEALTHBUFF", icon: "GIANTSTEPS", name: "Giant" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Head
  "Guardian Helmet": { itemId: "T8_HEAD_PLATE_SET3", slot: "head", category: "plate_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "STONESKIN", icon: "OVERLOAD", name: "Stone Skin" }, { spell: "EMERGENCY_SHIELD", icon: "EMERGENCY_SHIELD", name: "Emergency Shield" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Weapons
  "Halberd": { itemId: "T8_2H_HALBERD", slot: "weapon", category: "axe", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT", name: "Rending Strike" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD", name: "Rending Spin" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1", name: "Rending Rage" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE", name: "Deadly Chop" }, { spell: "AXEBOOST", icon: "STRENGTH", name: "Adrenaline Boost" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF", name: "Battle Rush" }, { spell: "INNERBLEEDING", icon: "BLEED", name: "Internal Bleeding" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES", name: "Raging Blades" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT", name: "Blood Bandit" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Axe" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Axe" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Axe" }] }
  ] },
  "Hallowfall": { itemId: "T8_MAIN_HOLYSTAFF_AVALON", slot: "weapon", category: "holystaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY", name: "Generous Heal" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY", name: "Smite Aoe" }, { spell: "HOLYFLASH", icon: "AOE_HOLY", name: "Holy Flash" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE", name: "Sacred Pulse" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM", name: "Holy Beam" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER", name: "Holy Blessing" }, { spell: "HOLYORB", icon: "HOLY_ORB", name: "Holy Orb" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY", name: "Reawaken" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER", name: "Desperate Prayer" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Holystaff" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE", name: "Magic Force" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER", name: "Ascended" }] }
  ] },
  "Hammer": { itemId: "T8_MAIN_HAMMER", slot: "weapon", category: "hammer", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE", name: "Powerful Swing" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE", name: "Threatening Strike" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR", name: "Iron Breaker" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR", name: "Seismic Tremor" }, { spell: "CHARGESLOWAE", icon: "POUNCE", name: "Slowing Charge" }, { spell: "GEYSER", icon: "EMPOWERMENT", name: "Power Geyser" }, { spell: "KNOCKOUT", icon: "MEZZ", name: "Knockout" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE", name: "Inertia Ring" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER", name: "Earth Shatter" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Hammer" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Hammer" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Hammer" }] }
  ] },
  "Hand of Justice": { itemId: "T8_2H_HAMMER_AVALON", slot: "weapon", category: "hammer", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE", name: "Powerful Swing" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE", name: "Threatening Strike" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR", name: "Iron Breaker" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR", name: "Seismic Tremor" }, { spell: "CHARGESLOWAE", icon: "POUNCE", name: "Slowing Charge" }, { spell: "GEYSER", icon: "EMPOWERMENT", name: "Power Geyser" }, { spell: "KNOCKOUT", icon: "MEZZ", name: "Knockout" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE", name: "Inertia Ring" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER", name: "Earth Shatter" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Hammer" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Hammer" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Hammer" }] }
  ] },
  "Heavy Crossbow": { itemId: "T8_2H_CROSSBOWLARGE", slot: "weapon", category: "crossbow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG", name: "Auto Fire" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE", name: "Explosive Bolt" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB", name: "Explosive Salvo" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT", name: "Sunder Shot" }, { spell: "CALTROPS", icon: "CALTROPS", name: "Caltrops" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC", name: "Knockback Shot" }, { spell: "SILENCINGBOLT", icon: "SILENCE", name: "Noise Eraser" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR", name: "Snipe Shot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE", name: "Forceful Bolts" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER", name: "Well-Prepared" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Crossbow" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Crossbow" }] }
  ] },
  "Heavy Mace": { itemId: "T8_2H_MACE", slot: "weapon", category: "mace", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF", name: "Defensive Slam" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND", name: "Threatening Smash" }, { spell: "SACRED_GROUND", icon: "SILENCE", name: "Sacred Ground" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER", name: "Ground Shaker" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF", name: "Snare Charge" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD", name: "Guard Rune" }, { spell: "PBAOE_PULL", icon: "PULL_AOE", name: "Air Compressor" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK", name: "Deep Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Mace" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Mace" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Mace" }] }
  ] },
  "Hellfire Hands": { itemId: "T8_2H_KNUCKLES_HELL", slot: "weapon", category: "knuckles", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING", name: "Create Opening" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK", name: "Dragon Leap" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1", name: "Crossstep Roundhouse" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH", name: "Shockwave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK", name: "Triple Kick" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH", name: "Backhand Strike" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER", name: "Counter" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO", name: "Devastating Combo" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER", name: "Blazing Geyser" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE", name: "Passive Knuckle Brawler" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN", name: "Rage" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1", name: "Rushdown" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD", name: "Hard to Catch" }] }
  ] },
  // Head
  "Hellion Hood": { itemId: "T8_HEAD_LEATHER_HELL", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "SMOKEBOMB", icon: "SMOKEBOMB", name: "Smokebomb" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Chest
  "Hellion Jacket": { itemId: "T8_ARMOR_LEATHER_HELL", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "LIFESTEALAURA", icon: "BARRIER_DEMONIC", name: "Life Steal Aura" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Feet
  "Hellion Shoes": { itemId: "T8_SHOES_LEATHER_HELL", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "DEATHMARK", icon: "CROSSHAIR", name: "Mark of Sacrifice" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Weapons
  "Hellspawn Staff": { itemId: "T8_2H_SHAPESHIFTER_HELL", slot: "weapon", category: "shapeshifterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE", name: "Unstable Projectile" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE", name: "Reality Fissure" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX", name: "Adapting Matter" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION", name: "Pulse Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION", name: "Distortion" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT", name: "Positional Drift" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL", name: "Tether Shift" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH", name: "Polymorph" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER", name: "Shadow Panther Transformation" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT", name: "Altered Beast" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR", name: "Intimidating Presence" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN", name: "Innate Power" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER", name: "Rule Bender" }] }
  ] },
  // Head
  "Helmet of Valor": { itemId: "T8_HEAD_PLATE_AVALON", slot: "head", category: "plate_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "STONESKIN", icon: "OVERLOAD", name: "Stone Skin" }, { spell: "PURIFYING_SMOKE", icon: "WINDWALL", name: "Purifying Smoke" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Weapons
  "Heron Spear": { itemId: "T8_MAIN_SPEAR_KEEPER", slot: "weapon", category: "spear", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW", name: "Lunging Strike" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR", name: "Spirit Spear" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE", name: "Forest of Spears" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE", name: "Inner Focus" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE", name: "Cripple" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE", name: "Deflecting Spin" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR", name: "Impaler" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON", name: "Harpoon" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH", name: "Reckless Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Spear" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Spear" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Spear" }] }
  ] },
  "Hoarfrost Staff": { itemId: "T8_MAIN_FROSTSTAFF_KEEPER", slot: "weapon", category: "froststaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE", name: "Frostbite" }, { spell: "ICESHARD", icon: "ICE_SHARD", name: "Ice Shard" }, { spell: "SHATTER_Q", icon: "FROST_NOVA", name: "Shatter Q" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST", name: "Frostbomb Castslow" }, { spell: "FROSTBEAM", icon: "FROSTBEAM", name: "Frost Beam" }, { spell: "FROSTNOVA", icon: "FROSTNOVA", name: "Frost Nova" }, { spell: "FROST_LANCE", icon: "HOARFROST", name: "Frost Lance" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE", name: "Glacial Obelisk" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST", name: "Freezing Wind" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1", name: "Frost" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Froststaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Froststaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Froststaff" }] }
  ] },
  "Holy Staff": { itemId: "T8_MAIN_HOLYSTAFF", slot: "weapon", category: "holystaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY", name: "Generous Heal" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY", name: "Smite Aoe" }, { spell: "HOLYFLASH", icon: "AOE_HOLY", name: "Holy Flash" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE", name: "Sacred Pulse" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM", name: "Holy Beam" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER", name: "Holy Blessing" }, { spell: "HOLYORB", icon: "HOLY_ORB", name: "Holy Orb" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY", name: "Reawaken" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER", name: "Desperate Prayer" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Holystaff" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE", name: "Magic Force" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER", name: "Ascended" }] }
  ] },
  // Head
  "Hood of Tenacity": { itemId: "T8_HEAD_LEATHER_AVALON", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "NASTY_WOUNDS", icon: "BUFF_SPEED", name: "Nasty Wounds" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  "Hunter Hood": { itemId: "T8_HEAD_LEATHER_SET2", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "RETALIATE2", icon: "RETALITATE", name: "Retaliate" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Chest
  "Hunter Jacket": { itemId: "T8_ARMOR_LEATHER_SET2", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "HASTE", icon: "BUFF_SPEED", name: "Haste" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Feet
  "Hunter Shoes": { itemId: "T8_SHOES_LEATHER_SET2", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "OVERSPRINT", icon: "SPRINT_CC", name: "Rush" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Weapons
  "Icicle Staff": { itemId: "T8_2H_ICEGAUNTLETS_HELL", slot: "weapon", category: "froststaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE", name: "Frostbite" }, { spell: "ICESHARD", icon: "ICE_SHARD", name: "Ice Shard" }, { spell: "SHATTER_Q", icon: "FROST_NOVA", name: "Shatter Q" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST", name: "Frostbomb Castslow" }, { spell: "FROSTBEAM", icon: "FROSTBEAM", name: "Frost Beam" }, { spell: "FROSTNOVA", icon: "FROSTNOVA", name: "Frost Nova" }, { spell: "FROST_LANCE", icon: "HOARFROST", name: "Frost Lance" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE", name: "Glacial Obelisk" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST", name: "Freezing Wind" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1", name: "Frost" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Froststaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Froststaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Froststaff" }] }
  ] },
  "Incubus Mace": { itemId: "T8_MAIN_MACE_HELL", slot: "weapon", category: "mace", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF", name: "Defensive Slam" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND", name: "Threatening Smash" }, { spell: "SACRED_GROUND", icon: "SILENCE", name: "Sacred Ground" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER", name: "Ground Shaker" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF", name: "Snare Charge" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD", name: "Guard Rune" }, { spell: "PBAOE_PULL", icon: "PULL_AOE", name: "Air Compressor" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK", name: "Deep Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Mace" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Mace" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Mace" }] }
  ] },
  "Infernal Scythe": { itemId: "T8_2H_SCYTHE_HELL", slot: "weapon", category: "axe", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT", name: "Rending Strike" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD", name: "Rending Spin" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1", name: "Rending Rage" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE", name: "Deadly Chop" }, { spell: "AXEBOOST", icon: "STRENGTH", name: "Adrenaline Boost" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF", name: "Battle Rush" }, { spell: "INNERBLEEDING", icon: "BLEED", name: "Internal Bleeding" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES", name: "Raging Blades" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT", name: "Blood Bandit" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Axe" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Axe" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Axe" }] }
  ] },
  "Infernal Staff": { itemId: "T8_2H_INFERNOSTAFF", slot: "weapon", category: "firestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE", name: "Fire Bolt" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE", name: "Burning Field" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME", name: "Searing Flame" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE", name: "Flame Blast" }, { spell: "FIREWALL", icon: "INCINERATE", name: "Wall of Flames" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE", name: "Raging Flare" }, { spell: "FIRECONE", icon: "FLAMECONE", name: "Fire Wave" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY", name: "Fire Artillery" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL", name: "Pyroblast Skillshot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1", name: "Burn" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Firestaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Firestaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Firestaff" }] }
  ] },
  "Infinity Blade": { itemId: "T8_MAIN_SWORD_CRYSTAL", slot: "weapon", category: "sword", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE", name: "Heroic Strike" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD", name: "Heroic Cleave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN", name: "Blade Cyclone" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT", name: "Interrupt" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH", name: "Splitting Slash" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING", name: "Hamstring" }, { spell: "PARRY", icon: "BLOCK", name: "Parry Strike" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF", name: "Iron Will" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD", name: "Mighty Blow" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN", name: "Weakening" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS", name: "Heroic Fighting" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Sword" }] }
  ] },
  "Ironclad Staff": { itemId: "T8_2H_IRONCLADEDSTAFF", slot: "weapon", category: "quarterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN", name: "Concussive Combo" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES", name: "Whirling Strikes" }, { spell: "CARTWHEEL", icon: "CARTWHEEL", name: "Cartwheel" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO", name: "Gale Dance" }, { spell: "STUNRUN", icon: "SPRINT_CC", name: "Stun Run" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING", name: "Forceful Swing" }, { spell: "LAUNCHER", icon: "KNOCKUP", name: "Rising Blow" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF", name: "Separator" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP", name: "Vault Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE", name: "Passive Stunchance Quarterstaff" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Quarterstaff" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Quarterstaff" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Quarterstaff" }] }
  ] },
  "Ironroot Staff": { itemId: "T8_MAIN_NATURESTAFF_AVALON", slot: "weapon", category: "naturestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT", name: "Rejuvenation" }, { spell: "THORNSAREA", icon: "THORNSAREA", name: "Thorn Growth" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL", name: "Rejuvmushroom Grenade" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS", name: "Brambleseed" }, { spell: "REANIMATE", icon: "REANIMATE", name: "Revitalize" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM", name: "Protection of Nature" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL", name: "Cleanse Heal" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE", name: "Rejuvenating Breeze" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE", name: "Circle of Life" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Naturestaff" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Naturestaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Naturestaff" }] }
  ] },
  // Chest
  "Jacket of Tenacity": { itemId: "T8_ARMOR_LEATHER_AVALON", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "DYNAMIC_DEFENSE", icon: "LIVINGARMOR", name: "Dynamic Defense" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  "Judicator Armor": { itemId: "T8_ARMOR_PLATE_KEEPER", slot: "chest", category: "plate_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "TAUNT", icon: "TAUNT", name: "Taunt" }, { spell: "FORCESHIELD", icon: "FORCEFIELD", name: "Force Shield" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN", name: "Spirit Crush" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS", name: "Protective Instinct" }] }
  ] },
  // Feet
  "Judicator Boots": { itemId: "T8_SHOES_PLATE_KEEPER", slot: "feet", category: "plate_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL", name: "Rejuvenating Sprint" }, { spell: "SHOULDERTACKLE", icon: "HAMMERTACKLE", name: "Elbow Smash" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Head
  "Judicator Helmet": { itemId: "T8_HEAD_PLATE_KEEPER", slot: "head", category: "plate_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "STONESKIN", icon: "OVERLOAD", name: "Stone Skin" }, { spell: "ELECTRICSHOCK", icon: "STORMSHIELD", name: "Electric Discharge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Weapons
  "Kingmaker": { itemId: "T8_2H_CLAYMORE_AVALON", slot: "weapon", category: "sword", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE", name: "Heroic Strike" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD", name: "Heroic Cleave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN", name: "Blade Cyclone" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT", name: "Interrupt" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH", name: "Splitting Slash" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING", name: "Hamstring" }, { spell: "PARRY", icon: "BLOCK", name: "Parry Strike" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF", name: "Iron Will" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD", name: "Mighty Blow" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN", name: "Weakening" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS", name: "Heroic Fighting" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Sword" }] }
  ] },
  // Chest
  "Knight Armor": { itemId: "T8_ARMOR_PLATE_SET2", slot: "chest", category: "plate_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "TAUNT", icon: "TAUNT", name: "Taunt" }, { spell: "WINDWALL", icon: "WINDWALL", name: "Wind Wall" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN", name: "Spirit Crush" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS", name: "Protective Instinct" }] }
  ] },
  // Feet
  "Knight Boots": { itemId: "T8_SHOES_PLATE_SET2", slot: "feet", category: "plate_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL", name: "Rejuvenating Sprint" }, { spell: "CHARGE_SHIELD", icon: "DASH_BUFF", name: "Shield Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Head
  "Knight Helmet": { itemId: "T8_HEAD_PLATE_SET2", slot: "head", category: "plate_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "STONESKIN", icon: "OVERLOAD", name: "Stone Skin" }, { spell: "DISRUPTIONIMMUNITY", icon: "LIVINGARMOR", name: "Displacement Immunity" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Weapons
  "Lifecurse Staff": { itemId: "T8_MAIN_CURSEDSTAFF_UNDEAD", slot: "weapon", category: "cursestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE", name: "Vile Curse" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE", name: "Cursed Sickle" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA", name: "Cursed Tar" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER", name: "Armor Piercer" }, { spell: "CURSENOVA", icon: "DESECRATE", name: "Desecrate" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC", name: "Cursedhands Stackup" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM", name: "Cursed Beam" }, { spell: "DARKMATTER", icon: "DARK_MATTER", name: "Dark Matter" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE", name: "Death Curse" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1", name: "Bane" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Cursedstaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Cursedstaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Cursedstaff" }] }
  ] },
  "Lifetouch Staff": { itemId: "T8_MAIN_HOLYSTAFF_MORGANA", slot: "weapon", category: "holystaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY", name: "Generous Heal" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY", name: "Smite Aoe" }, { spell: "HOLYFLASH", icon: "AOE_HOLY", name: "Holy Flash" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE", name: "Sacred Pulse" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM", name: "Holy Beam" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER", name: "Holy Blessing" }, { spell: "HOLYORB", icon: "HOLY_ORB", name: "Holy Orb" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY", name: "Reawaken" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER", name: "Desperate Prayer" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Holystaff" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE", name: "Magic Force" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER", name: "Ascended" }] }
  ] },
  "Light Crossbow": { itemId: "T8_MAIN_1HCROSSBOW", slot: "weapon", category: "crossbow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG", name: "Auto Fire" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE", name: "Explosive Bolt" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB", name: "Explosive Salvo" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT", name: "Sunder Shot" }, { spell: "CALTROPS", icon: "CALTROPS", name: "Caltrops" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC", name: "Knockback Shot" }, { spell: "SILENCINGBOLT", icon: "SILENCE", name: "Noise Eraser" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR", name: "Snipe Shot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE", name: "Forceful Bolts" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER", name: "Well-Prepared" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Crossbow" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Crossbow" }] }
  ] },
  "Lightcaller": { itemId: "T8_2H_SHAPESHIFTER_AVALON", slot: "weapon", category: "shapeshifterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE", name: "Unstable Projectile" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE", name: "Reality Fissure" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX", name: "Adapting Matter" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION", name: "Pulse Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION", name: "Distortion" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT", name: "Positional Drift" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL", name: "Tether Shift" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH", name: "Polymorph" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER", name: "Shadow Panther Transformation" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT", name: "Altered Beast" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR", name: "Intimidating Presence" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN", name: "Innate Power" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER", name: "Rule Bender" }] }
  ] },
  "Longbow": { itemId: "T8_2H_LONGBOW", slot: "weapon", category: "bow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE", name: "Multishot" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED", name: "Deadly Shot" }, { spell: "POISONARROW", icon: "POISONED_ARROW", name: "Poisoned Arrow" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT", name: "Ray of Light" }, { spell: "JUMPSHOT2", icon: "BACKFLIP", name: "Frost Shot" }, { spell: "SPEEDSHOT2", icon: "ARROW", name: "Speed Shot" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION", name: "Explosive Arrows" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE", name: "Speedarcher Kite" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Bow" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER", name: "Piercing Arrows" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Bow" }] }
  ] },
  "Mace": { itemId: "T8_MAIN_MACE", slot: "weapon", category: "mace", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF", name: "Defensive Slam" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND", name: "Threatening Smash" }, { spell: "SACRED_GROUND", icon: "SILENCE", name: "Sacred Ground" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER", name: "Ground Shaker" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF", name: "Snare Charge" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD", name: "Guard Rune" }, { spell: "PBAOE_PULL", icon: "PULL_AOE", name: "Air Compressor" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK", name: "Deep Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Mace" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Mace" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Mace" }] }
  ] },
  // Head
  "Mage Cowl": { itemId: "T8_HEAD_CLOTH_SET3", slot: "head", category: "cloth_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT", name: "Force Field" }, { spell: "HELMET_FIREBREATH", icon: "FLAMECONE", name: "Firebreath" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Chest
  "Mage Robe": { itemId: "T8_ARMOR_CLOTH_SET3", slot: "chest", category: "cloth_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD", name: "Frost Shield" }, { spell: "PURGINGSHIELD2", icon: "PURGE", name: "Purging Shield" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Armor Increased Castspeed" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Feet
  "Mage Sandals": { itemId: "T8_SHOES_CLOTH_SET3", slot: "feet", category: "cloth_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY", name: "Energetic Sprint" }, { spell: "DELAYED_TELEPORT", icon: "MAGICBARRIER", name: "Delayed Teleport" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Weapons
  "Malevolent Locus": { itemId: "T8_2H_ENIGMATICORB_MORGANA", slot: "weapon", category: "arcanestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE", name: "Chain Missile" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION", name: "Arcane Protection" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE", name: "Magic Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE", name: "Enigma Blade" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE", name: "Motivating Cleanse" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE", name: "Frazzle" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE", name: "Empowering Beam" }, { spell: "MIMIC", icon: "MIMIC", name: "Mimic" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2", name: "Arcane Orb" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Lingering Power" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Arcanestaff" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Arcanestaff" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE", name: "Hush" }] }
  ] },
  // Head
  "Mercenary Hood": { itemId: "T8_HEAD_LEATHER_SET1", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "HOWL", icon: "INTIMIDATINGSHOUT", name: "Howl" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Chest
  "Mercenary Jacket": { itemId: "T8_ARMOR_LEATHER_SET1", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "BLOODLUST", icon: "BLOODLUST", name: "Bloodlust" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Feet
  "Mercenary Shoes": { itemId: "T8_SHOES_LEATHER_SET1", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "CLEANSE_DASH", icon: "DASH_BUFF", name: "Break Free" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Weapons
  "Mistpiercer": { itemId: "T8_2H_BOW_AVALON", slot: "weapon", category: "bow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE", name: "Multishot" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED", name: "Deadly Shot" }, { spell: "POISONARROW", icon: "POISONED_ARROW", name: "Poisoned Arrow" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT", name: "Ray of Light" }, { spell: "JUMPSHOT2", icon: "BACKFLIP", name: "Frost Shot" }, { spell: "SPEEDSHOT2", icon: "ARROW", name: "Speed Shot" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION", name: "Explosive Arrows" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE", name: "Speedarcher Kite" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Bow" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER", name: "Piercing Arrows" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Bow" }] }
  ] },
  // Head
  "Mistwalker Hood": { itemId: "T8_HEAD_LEATHER_FEY", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "IMMORTAL", icon: "IMMORTAL", name: "Immortal" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Chest
  "Mistwalker Jacket": { itemId: "T8_ARMOR_LEATHER_FEY", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "MIST_WALKER", icon: "MIST_WALKER", name: "Mist Cloud" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Feet
  "Mistwalker Shoes": { itemId: "T8_SHOES_LEATHER_FEY", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "AFTER_IMAGE", icon: "AFTER_IMAGE", name: "After Image" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Weapons
  "Morning Star": { itemId: "T8_2H_FLAIL", slot: "weapon", category: "mace", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF", name: "Defensive Slam" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND", name: "Threatening Smash" }, { spell: "SACRED_GROUND", icon: "SILENCE", name: "Sacred Ground" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER", name: "Ground Shaker" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF", name: "Snare Charge" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD", name: "Guard Rune" }, { spell: "PBAOE_PULL", icon: "PULL_AOE", name: "Air Compressor" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK", name: "Deep Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Mace" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Mace" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Mace" }] }
  ] },
  "Nature Staff": { itemId: "T8_MAIN_NATURESTAFF", slot: "weapon", category: "naturestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT", name: "Rejuvenation" }, { spell: "THORNSAREA", icon: "THORNSAREA", name: "Thorn Growth" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL", name: "Rejuvmushroom Grenade" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS", name: "Brambleseed" }, { spell: "REANIMATE", icon: "REANIMATE", name: "Revitalize" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM", name: "Protection of Nature" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL", name: "Cleanse Heal" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE", name: "Rejuvenating Breeze" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE", name: "Circle of Life" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Naturestaff" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Naturestaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Naturestaff" }] }
  ] },
  "Oathkeepers": { itemId: "T8_2H_DUALMACE_AVALON", slot: "weapon", category: "mace", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF", name: "Defensive Slam" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND", name: "Threatening Smash" }, { spell: "SACRED_GROUND", icon: "SILENCE", name: "Sacred Ground" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER", name: "Ground Shaker" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF", name: "Snare Charge" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD", name: "Guard Rune" }, { spell: "PBAOE_PULL", icon: "PULL_AOE", name: "Air Compressor" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK", name: "Deep Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Mace" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Mace" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Mace" }] }
  ] },
  "Occult Staff": { itemId: "T8_2H_ARCANESTAFF_HELL", slot: "weapon", category: "arcanestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE", name: "Chain Missile" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION", name: "Arcane Protection" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE", name: "Magic Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE", name: "Enigma Blade" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE", name: "Motivating Cleanse" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE", name: "Frazzle" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE", name: "Empowering Beam" }, { spell: "MIMIC", icon: "MIMIC", name: "Mimic" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2", name: "Arcane Orb" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Lingering Power" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Arcanestaff" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Arcanestaff" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE", name: "Hush" }] }
  ] },
  "Permafrost Prism": { itemId: "T8_2H_ICECRYSTAL_UNDEAD", slot: "weapon", category: "froststaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE", name: "Frostbite" }, { spell: "ICESHARD", icon: "ICE_SHARD", name: "Ice Shard" }, { spell: "SHATTER_Q", icon: "FROST_NOVA", name: "Shatter Q" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST", name: "Frostbomb Castslow" }, { spell: "FROSTBEAM", icon: "FROSTBEAM", name: "Frost Beam" }, { spell: "FROSTNOVA", icon: "FROSTNOVA", name: "Frost Nova" }, { spell: "FROST_LANCE", icon: "HOARFROST", name: "Frost Lance" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE", name: "Glacial Obelisk" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST", name: "Freezing Wind" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1", name: "Frost" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Froststaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Froststaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Froststaff" }] }
  ] },
  "Phantom Twinblade": { itemId: "T8_2H_DOUBLEBLADEDSTAFF_CRYSTAL", slot: "weapon", category: "quarterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN", name: "Concussive Combo" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES", name: "Whirling Strikes" }, { spell: "CARTWHEEL", icon: "CARTWHEEL", name: "Cartwheel" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO", name: "Gale Dance" }, { spell: "STUNRUN", icon: "SPRINT_CC", name: "Stun Run" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING", name: "Forceful Swing" }, { spell: "LAUNCHER", icon: "KNOCKUP", name: "Rising Blow" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF", name: "Separator" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP", name: "Vault Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE", name: "Passive Stunchance Quarterstaff" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Quarterstaff" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Quarterstaff" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Quarterstaff" }] }
  ] },
  "Pike": { itemId: "T8_2H_SPEAR", slot: "weapon", category: "spear", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW", name: "Lunging Strike" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR", name: "Spirit Spear" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE", name: "Forest of Spears" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE", name: "Inner Focus" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE", name: "Cripple" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE", name: "Deflecting Spin" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR", name: "Impaler" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON", name: "Harpoon" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH", name: "Reckless Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Spear" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Spear" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Spear" }] }
  ] },
  "Polehammer": { itemId: "T8_2H_POLEHAMMER", slot: "weapon", category: "hammer", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE", name: "Powerful Swing" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE", name: "Threatening Strike" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR", name: "Iron Breaker" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR", name: "Seismic Tremor" }, { spell: "CHARGESLOWAE", icon: "POUNCE", name: "Slowing Charge" }, { spell: "GEYSER", icon: "EMPOWERMENT", name: "Power Geyser" }, { spell: "KNOCKOUT", icon: "MEZZ", name: "Knockout" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE", name: "Inertia Ring" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER", name: "Earth Shatter" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Hammer" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Hammer" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Hammer" }] }
  ] },
  "Primal Staff": { itemId: "T8_2H_SHAPESHIFTER_SET3", slot: "weapon", category: "shapeshifterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE", name: "Unstable Projectile" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE", name: "Reality Fissure" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX", name: "Adapting Matter" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION", name: "Pulse Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION", name: "Distortion" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT", name: "Positional Drift" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL", name: "Tether Shift" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH", name: "Polymorph" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER", name: "Shadow Panther Transformation" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT", name: "Altered Beast" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR", name: "Intimidating Presence" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN", name: "Innate Power" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER", name: "Rule Bender" }] }
  ] },
  "Prowling Staff": { itemId: "T8_2H_SHAPESHIFTER_SET1", slot: "weapon", category: "shapeshifterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE", name: "Unstable Projectile" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE", name: "Reality Fissure" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX", name: "Adapting Matter" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION", name: "Pulse Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION", name: "Distortion" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT", name: "Positional Drift" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL", name: "Tether Shift" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH", name: "Polymorph" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER", name: "Shadow Panther Transformation" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT", name: "Altered Beast" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR", name: "Intimidating Presence" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN", name: "Innate Power" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER", name: "Rule Bender" }] }
  ] },
  "Quarterstaff": { itemId: "T8_2H_QUARTERSTAFF", slot: "weapon", category: "quarterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN", name: "Concussive Combo" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES", name: "Whirling Strikes" }, { spell: "CARTWHEEL", icon: "CARTWHEEL", name: "Cartwheel" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO", name: "Gale Dance" }, { spell: "STUNRUN", icon: "SPRINT_CC", name: "Stun Run" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING", name: "Forceful Swing" }, { spell: "LAUNCHER", icon: "KNOCKUP", name: "Rising Blow" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF", name: "Separator" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP", name: "Vault Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE", name: "Passive Stunchance Quarterstaff" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Quarterstaff" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Quarterstaff" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Quarterstaff" }] }
  ] },
  "Rampant Staff": { itemId: "T8_2H_NATURESTAFF_KEEPER", slot: "weapon", category: "naturestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT", name: "Rejuvenation" }, { spell: "THORNSAREA", icon: "THORNSAREA", name: "Thorn Growth" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL", name: "Rejuvmushroom Grenade" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS", name: "Brambleseed" }, { spell: "REANIMATE", icon: "REANIMATE", name: "Revitalize" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM", name: "Protection of Nature" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL", name: "Cleanse Heal" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE", name: "Rejuvenating Breeze" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE", name: "Circle of Life" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Naturestaff" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Naturestaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Naturestaff" }] }
  ] },
  "Ravenstrike Cestus": { itemId: "T8_2H_KNUCKLES_MORGANA", slot: "weapon", category: "knuckles", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING", name: "Create Opening" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK", name: "Dragon Leap" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1", name: "Crossstep Roundhouse" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH", name: "Shockwave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK", name: "Triple Kick" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH", name: "Backhand Strike" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER", name: "Counter" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO", name: "Devastating Combo" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER", name: "Blazing Geyser" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE", name: "Passive Knuckle Brawler" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN", name: "Rage" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1", name: "Rushdown" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD", name: "Hard to Catch" }] }
  ] },
  "Realmbreaker": { itemId: "T8_2H_AXE_AVALON", slot: "weapon", category: "axe", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT", name: "Rending Strike" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD", name: "Rending Spin" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1", name: "Rending Rage" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE", name: "Deadly Chop" }, { spell: "AXEBOOST", icon: "STRENGTH", name: "Adrenaline Boost" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF", name: "Battle Rush" }, { spell: "INNERBLEEDING", icon: "BLEED", name: "Internal Bleeding" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES", name: "Raging Blades" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT", name: "Blood Bandit" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Axe" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armorchance Axe" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Axe" }] }
  ] },
  "Redemption Staff": { itemId: "T8_2H_HOLYSTAFF_UNDEAD", slot: "weapon", category: "holystaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY", name: "Generous Heal" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY", name: "Smite Aoe" }, { spell: "HOLYFLASH", icon: "AOE_HOLY", name: "Holy Flash" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE", name: "Sacred Pulse" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM", name: "Holy Beam" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER", name: "Holy Blessing" }, { spell: "HOLYORB", icon: "HOLY_ORB", name: "Holy Orb" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY", name: "Reawaken" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER", name: "Desperate Prayer" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Holystaff" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE", name: "Magic Force" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER", name: "Ascended" }] }
  ] },
  "Rift Glaive": { itemId: "T8_2H_GLAIVE_CRYSTAL", slot: "weapon", category: "spear", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW", name: "Lunging Strike" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR", name: "Spirit Spear" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE", name: "Forest of Spears" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE", name: "Inner Focus" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE", name: "Cripple" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE", name: "Deflecting Spin" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR", name: "Impaler" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON", name: "Harpoon" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH", name: "Reckless Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Spear" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Spear" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Spear" }] }
  ] },
  // Chest
  "Robe of Purity": { itemId: "T8_ARMOR_CLOTH_AVALON", slot: "chest", category: "cloth_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD", name: "Frost Shield" }, { spell: "CASTBUBBLE", icon: "MAGICCIRCLE_HOLY", name: "Energy Emission" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Armor Increased Castspeed" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Weapons
  "Rootbound Staff": { itemId: "T8_2H_SHAPESHIFTER_SET2", slot: "weapon", category: "shapeshifterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE", name: "Unstable Projectile" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE", name: "Reality Fissure" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX", name: "Adapting Matter" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION", name: "Pulse Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION", name: "Distortion" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT", name: "Positional Drift" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL", name: "Tether Shift" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH", name: "Polymorph" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER", name: "Shadow Panther Transformation" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT", name: "Altered Beast" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR", name: "Intimidating Presence" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN", name: "Innate Power" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER", name: "Rule Bender" }] }
  ] },
  "Rotcaller Staff": { itemId: "T8_MAIN_CURSEDSTAFF_CRYSTAL", slot: "weapon", category: "cursestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE", name: "Vile Curse" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE", name: "Cursed Sickle" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA", name: "Cursed Tar" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER", name: "Armor Piercer" }, { spell: "CURSENOVA", icon: "DESECRATE", name: "Desecrate" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC", name: "Cursedhands Stackup" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM", name: "Cursed Beam" }, { spell: "DARKMATTER", icon: "DARK_MATTER", name: "Dark Matter" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE", name: "Death Curse" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1", name: "Bane" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Cursedstaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Cursedstaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Cursedstaff" }] }
  ] },
  // Chest
  "Royal Armor": { itemId: "T8_ARMOR_PLATE_ROYAL", slot: "chest", category: "plate_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "TAUNT", icon: "TAUNT", name: "Taunt" }, { spell: "MANADRAIN", icon: "RESTOREENERGY", name: "Energy Source" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN", name: "Spirit Crush" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS", name: "Protective Instinct" }] }
  ] },
  // Feet
  "Royal Boots": { itemId: "T8_SHOES_PLATE_ROYAL", slot: "feet", category: "plate_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL", name: "Rejuvenating Sprint" }, { spell: "ROYAL_MARCH", icon: "DASH", name: "Royal March" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Head
  "Royal Cowl": { itemId: "T8_HEAD_CLOTH_ROYAL", slot: "head", category: "cloth_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT", name: "Force Field" }, { spell: "PERPETUALENERGY", icon: "RESTOREENERGY", name: "Perpetual Energy" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  "Royal Helmet": { itemId: "T8_HEAD_PLATE_ROYAL", slot: "head", category: "plate_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "STONESKIN", icon: "OVERLOAD", name: "Stone Skin" }, { spell: "ARTILLERY_COMMAND", icon: "METEOR_FIRE", name: "Ballista Support Fire" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  "Royal Hood": { itemId: "T8_HEAD_LEATHER_ROYAL", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "GROWING_RAGE", icon: "STRENGTH", name: "Growing Rage" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Chest
  "Royal Jacket": { itemId: "T8_ARMOR_LEATHER_ROYAL", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "ROYAL_BANNER", icon: "STRENGTH", name: "Royal Banner" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  "Royal Robe": { itemId: "T8_ARMOR_CLOTH_ROYAL", slot: "chest", category: "cloth_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD", name: "Frost Shield" }, { spell: "MAGICCIRCLE", icon: "MAGICCIRCLE_DEMONIC", name: "Magic Rune" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Armor Increased Castspeed" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Feet
  "Royal Sandals": { itemId: "T8_SHOES_CLOTH_ROYAL", slot: "feet", category: "cloth_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY", name: "Energetic Sprint" }, { spell: "GLASS_MOVESPEED", icon: "BUFF_DAMAGE", name: "Defenseless Rush" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  "Royal Shoes": { itemId: "T8_SHOES_LEATHER_ROYAL", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "JUMP", icon: "DODGE", name: "Evasive Jump" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  "Sandals of Purity": { itemId: "T8_SHOES_CLOTH_AVALON", slot: "feet", category: "cloth_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY", name: "Energetic Sprint" }, { spell: "HOVER_SPRINT", icon: "LEVITATE", name: "Hover" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Head
  "Scholar Cowl": { itemId: "T8_HEAD_CLOTH_SET1", slot: "head", category: "cloth_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT", name: "Force Field" }, { spell: "ENERGYSHIELD2", icon: "POWER_FIELD", name: "Aegis of Energy" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Chest
  "Scholar Robe": { itemId: "T8_ARMOR_CLOTH_SET1", slot: "chest", category: "cloth_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD", name: "Frost Shield" }, { spell: "SPEEDCASTER", icon: "HASTEN_COOLDOWN", name: "Speed Caster" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Armor Increased Castspeed" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Feet
  "Scholar Sandals": { itemId: "T8_SHOES_CLOTH_SET1", slot: "feet", category: "cloth_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY", name: "Energetic Sprint" }, { spell: "CHANNELED_RUN", icon: "RUN", name: "Focused Run" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE", name: "Aggression" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER", name: "Concentration" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1", name: "Efficiency" }] }
  ] },
  // Weapons
  "Shadowcaller": { itemId: "T8_MAIN_CURSEDSTAFF_AVALON", slot: "weapon", category: "cursestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE", name: "Vile Curse" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE", name: "Cursed Sickle" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA", name: "Cursed Tar" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER", name: "Armor Piercer" }, { spell: "CURSENOVA", icon: "DESECRATE", name: "Desecrate" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC", name: "Cursedhands Stackup" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM", name: "Cursed Beam" }, { spell: "DARKMATTER", icon: "DARK_MATTER", name: "Dark Matter" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE", name: "Death Curse" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1", name: "Bane" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Cursedstaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Cursedstaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Cursedstaff" }] }
  ] },
  // Feet
  "Shoes of Tenacity": { itemId: "T8_SHOES_LEATHER_AVALON", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "BLINDSPOT", icon: "STEALTH", name: "Blind Spot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Weapons
  "Siegebow": { itemId: "T8_2H_CROSSBOWLARGE_MORGANA", slot: "weapon", category: "crossbow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG", name: "Auto Fire" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE", name: "Explosive Bolt" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB", name: "Explosive Salvo" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT", name: "Sunder Shot" }, { spell: "CALTROPS", icon: "CALTROPS", name: "Caltrops" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC", name: "Knockback Shot" }, { spell: "SILENCINGBOLT", icon: "SILENCE", name: "Noise Eraser" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR", name: "Snipe Shot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE", name: "Forceful Bolts" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER", name: "Well-Prepared" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Crossbow" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Crossbow" }] }
  ] },
  "Skystrider Bow": { itemId: "T8_2H_BOW_CRYSTAL", slot: "weapon", category: "bow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE", name: "Multishot" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED", name: "Deadly Shot" }, { spell: "POISONARROW", icon: "POISONED_ARROW", name: "Poisoned Arrow" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT", name: "Ray of Light" }, { spell: "JUMPSHOT2", icon: "BACKFLIP", name: "Frost Shot" }, { spell: "SPEEDSHOT2", icon: "ARROW", name: "Speed Shot" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION", name: "Explosive Arrows" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE", name: "Speedarcher Kite" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Bow" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER", name: "Piercing Arrows" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Bow" }] }
  ] },
  // Chest
  "Soldier Armor": { itemId: "T8_ARMOR_PLATE_SET1", slot: "chest", category: "plate_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "TAUNT", icon: "TAUNT", name: "Taunt" }, { spell: "ENRAGE", icon: "BUFF_DAMAGE", name: "Fury" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN", name: "Spirit Crush" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS", name: "Protective Instinct" }] }
  ] },
  // Feet
  "Soldier Boots": { itemId: "T8_SHOES_PLATE_SET1", slot: "feet", category: "plate_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL", name: "Rejuvenating Sprint" }, { spell: "WANDERLUST", icon: "POUNCE", name: "Wanderlust" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Head
  "Soldier Helmet": { itemId: "T8_HEAD_PLATE_SET1", slot: "head", category: "plate_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "STONESKIN", icon: "OVERLOAD", name: "Stone Skin" }, { spell: "BLOCK", icon: "BLOCK", name: "Block" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD", name: "Toughness" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER", name: "Authority" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1", name: "Tenacity" }] }
  ] },
  // Weapons
  "Soulscythe": { itemId: "T8_2H_TWINSCYTHE_HELL", slot: "weapon", category: "quarterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN", name: "Concussive Combo" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES", name: "Whirling Strikes" }, { spell: "CARTWHEEL", icon: "CARTWHEEL", name: "Cartwheel" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO", name: "Gale Dance" }, { spell: "STUNRUN", icon: "SPRINT_CC", name: "Stun Run" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING", name: "Forceful Swing" }, { spell: "LAUNCHER", icon: "KNOCKUP", name: "Rising Blow" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF", name: "Separator" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP", name: "Vault Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE", name: "Passive Stunchance Quarterstaff" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Quarterstaff" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Quarterstaff" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Quarterstaff" }] }
  ] },
  "Spear": { itemId: "T8_MAIN_SPEAR", slot: "weapon", category: "spear", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW", name: "Lunging Strike" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR", name: "Spirit Spear" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE", name: "Forest of Spears" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE", name: "Inner Focus" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE", name: "Cripple" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE", name: "Deflecting Spin" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR", name: "Impaler" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON", name: "Harpoon" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH", name: "Reckless Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Spear" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Spear" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Spear" }] }
  ] },
  // Head
  "Specter Hood": { itemId: "T8_HEAD_LEATHER_UNDEAD", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "ARMOR_CD_RESET", icon: "INSPIRATION", name: "Flash of Insight" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Chest
  "Specter Jacket": { itemId: "T8_ARMOR_LEATHER_UNDEAD", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "BURNAURA", icon: "INCINERATE", name: "Self Ignition" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Feet
  "Specter Shoes": { itemId: "T8_SHOES_LEATHER_UNDEAD", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "INVISIBLE_WALK", icon: "STEALTH", name: "Spectral Run" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Weapons
  "Spiked Gauntlets": { itemId: "T8_2H_KNUCKLES_SET3", slot: "weapon", category: "knuckles", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING", name: "Create Opening" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK", name: "Dragon Leap" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1", name: "Crossstep Roundhouse" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH", name: "Shockwave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK", name: "Triple Kick" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH", name: "Backhand Strike" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER", name: "Counter" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO", name: "Devastating Combo" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER", name: "Blazing Geyser" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE", name: "Passive Knuckle Brawler" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN", name: "Rage" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1", name: "Rushdown" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD", name: "Hard to Catch" }] }
  ] },
  "Spirithunter": { itemId: "T8_2H_HARPOON_HELL", slot: "weapon", category: "spear", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW", name: "Lunging Strike" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR", name: "Spirit Spear" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE", name: "Forest of Spears" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE", name: "Inner Focus" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE", name: "Cripple" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE", name: "Deflecting Spin" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR", name: "Impaler" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON", name: "Harpoon" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH", name: "Reckless Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Spear" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Spear" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Spear" }] }
  ] },
  "Staff of Balance": { itemId: "T8_2H_ROCKSTAFF_KEEPER", slot: "weapon", category: "quarterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN", name: "Concussive Combo" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES", name: "Whirling Strikes" }, { spell: "CARTWHEEL", icon: "CARTWHEEL", name: "Cartwheel" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO", name: "Gale Dance" }, { spell: "STUNRUN", icon: "SPRINT_CC", name: "Stun Run" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING", name: "Forceful Swing" }, { spell: "LAUNCHER", icon: "KNOCKUP", name: "Rising Blow" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF", name: "Separator" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP", name: "Vault Leap" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE", name: "Passive Stunchance Quarterstaff" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Quarterstaff" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Quarterstaff" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Quarterstaff" }] }
  ] },
  // Head
  "Stalker Hood": { itemId: "T8_HEAD_LEATHER_MORGANA", slot: "head", category: "leather_helmet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER", name: "Energizing Shield" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT", name: "Cleanse" }, { spell: "SMELLOFBLOOD", icon: "OVERLOAD_DAMAGE", name: "Mortal Agony" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Chest
  "Stalker Jacket": { itemId: "T8_ARMOR_LEATHER_MORGANA", slot: "chest", category: "leather_armor", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS", name: "Mend Wounds" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD", name: "Inferno Shield" }, { spell: "STORMSHIELD", icon: "STORMSHIELD", name: "Electric Field" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Feet
  "Stalker Shoes": { itemId: "T8_SHOES_LEATHER_MORGANA", slot: "feet", category: "leather_shoes", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL", name: "Dodge" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT", name: "Refreshing Sprint" }, { spell: "DMG_BLINK", icon: "BLINK_DAMAGE", name: "Raging Blink" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD", name: "Courier" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1", name: "Balanced Mind" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1", name: "Swiftness" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS", name: "Quick Thinker" }] }
  ] },
  // Weapons
  "Stillgaze Staff": { itemId: "T8_2H_SHAPESHIFTER_CRYSTAL", slot: "weapon", category: "shapeshifterstaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE", name: "Unstable Projectile" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE", name: "Reality Fissure" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX", name: "Adapting Matter" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION", name: "Pulse Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION", name: "Distortion" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT", name: "Positional Drift" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL", name: "Tether Shift" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH", name: "Polymorph" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER", name: "Shadow Panther Transformation" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT", name: "Altered Beast" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR", name: "Intimidating Presence" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN", name: "Innate Power" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER", name: "Rule Bender" }] }
  ] },
  "Tombhammer": { itemId: "T8_2H_HAMMER_UNDEAD", slot: "weapon", category: "hammer", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE", name: "Powerful Swing" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE", name: "Threatening Strike" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR", name: "Iron Breaker" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR", name: "Seismic Tremor" }, { spell: "CHARGESLOWAE", icon: "POUNCE", name: "Slowing Charge" }, { spell: "GEYSER", icon: "EMPOWERMENT", name: "Power Geyser" }, { spell: "KNOCKOUT", icon: "MEZZ", name: "Knockout" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE", name: "Inertia Ring" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER", name: "Earth Shatter" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Hammer" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Hammer" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Hammer" }] }
  ] },
  "Trinity Spear": { itemId: "T8_2H_TRIDENT_UNDEAD", slot: "weapon", category: "spear", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW", name: "Lunging Strike" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR", name: "Spirit Spear" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE", name: "Forest of Spears" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE", name: "Inner Focus" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE", name: "Cripple" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE", name: "Deflecting Spin" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR", name: "Impaler" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON", name: "Harpoon" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH", name: "Reckless Charge" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Spear" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Spear" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Spear" }] }
  ] },
  "Truebolt Hammer": { itemId: "T8_2H_HAMMER_CRYSTAL", slot: "weapon", category: "hammer", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE", name: "Powerful Swing" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE", name: "Threatening Strike" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR", name: "Iron Breaker" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR", name: "Seismic Tremor" }, { spell: "CHARGESLOWAE", icon: "POUNCE", name: "Slowing Charge" }, { spell: "GEYSER", icon: "EMPOWERMENT", name: "Power Geyser" }, { spell: "KNOCKOUT", icon: "MEZZ", name: "Knockout" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE", name: "Inertia Ring" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER", name: "Earth Shatter" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE", name: "Stunning Strike" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Hammer" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Hammer" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE", name: "Passive Ccduration Chance Hammer" }] }
  ] },
  "Twin Slayers": { itemId: "T8_2H_DAGGERPAIR_CRYSTAL", slot: "weapon", category: "dagger", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR", name: "Sunder Armor" }, { spell: "QDASH", icon: "DEADLY_SWIPE", name: "Deadly Swipe" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT", name: "Assassin Spirit" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES", name: "Throwing Blades" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER", name: "Dash" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB", name: "Forbidden Stab" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW", name: "Shadow Edge" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH", name: "Chain Slash" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE", name: "Bloodthirsty Blade" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1", name: "Deep Cuts" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1", name: "Passive Healthchance Dagger" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Dagger" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Chance Dagger" }] }
  ] },
  "Ursine Maulers": { itemId: "T8_2H_KNUCKLES_KEEPER", slot: "weapon", category: "knuckles", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING", name: "Create Opening" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK", name: "Dragon Leap" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1", name: "Crossstep Roundhouse" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH", name: "Shockwave" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK", name: "Triple Kick" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH", name: "Backhand Strike" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER", name: "Counter" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO", name: "Devastating Combo" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER", name: "Blazing Geyser" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE", name: "Passive Knuckle Brawler" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN", name: "Rage" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1", name: "Rushdown" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD", name: "Hard to Catch" }] }
  ] },
  "Wailing Bow": { itemId: "T8_2H_BOW_HELL", slot: "weapon", category: "bow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE", name: "Multishot" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED", name: "Deadly Shot" }, { spell: "POISONARROW", icon: "POISONED_ARROW", name: "Poisoned Arrow" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT", name: "Ray of Light" }, { spell: "JUMPSHOT2", icon: "BACKFLIP", name: "Frost Shot" }, { spell: "SPEEDSHOT2", icon: "ARROW", name: "Speed Shot" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION", name: "Explosive Arrows" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE", name: "Speedarcher Kite" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Bow" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER", name: "Piercing Arrows" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Bow" }] }
  ] },
  "Warbow": { itemId: "T8_2H_WARBOW", slot: "weapon", category: "bow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE", name: "Multishot" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED", name: "Deadly Shot" }, { spell: "POISONARROW", icon: "POISONED_ARROW", name: "Poisoned Arrow" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT", name: "Ray of Light" }, { spell: "JUMPSHOT2", icon: "BACKFLIP", name: "Frost Shot" }, { spell: "SPEEDSHOT2", icon: "ARROW", name: "Speed Shot" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION", name: "Explosive Arrows" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE", name: "Speedarcher Kite" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Bow" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER", name: "Piercing Arrows" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Bow" }] }
  ] },
  "Weeping Repeater": { itemId: "T8_2H_REPEATINGCROSSBOW_UNDEAD", slot: "weapon", category: "crossbow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG", name: "Auto Fire" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE", name: "Explosive Bolt" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB", name: "Explosive Salvo" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT", name: "Sunder Shot" }, { spell: "CALTROPS", icon: "CALTROPS", name: "Caltrops" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC", name: "Knockback Shot" }, { spell: "SILENCINGBOLT", icon: "SILENCE", name: "Noise Eraser" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR", name: "Snipe Shot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE", name: "Forceful Bolts" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER", name: "Well-Prepared" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Crossbow" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Crossbow" }] }
  ] },
  "Whispering Bow": { itemId: "T8_2H_LONGBOW_UNDEAD", slot: "weapon", category: "bow", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE", name: "Multishot" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED", name: "Deadly Shot" }, { spell: "POISONARROW", icon: "POISONED_ARROW", name: "Poisoned Arrow" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT", name: "Ray of Light" }, { spell: "JUMPSHOT2", icon: "BACKFLIP", name: "Frost Shot" }, { spell: "SPEEDSHOT2", icon: "ARROW", name: "Speed Shot" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION", name: "Explosive Arrows" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE", name: "Speedarcher Kite" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE", name: "Slow Poison" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Bow" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER", name: "Piercing Arrows" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1", name: "Passive Aaspeedchance Bow" }] }
  ] },
  "Wild Staff": { itemId: "T8_2H_WILDSTAFF", slot: "weapon", category: "naturestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT", name: "Rejuvenation" }, { spell: "THORNSAREA", icon: "THORNSAREA", name: "Thorn Growth" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL", name: "Rejuvmushroom Grenade" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS", name: "Brambleseed" }, { spell: "REANIMATE", icon: "REANIMATE", name: "Revitalize" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM", name: "Protection of Nature" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL", name: "Cleanse Heal" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE", name: "Rejuvenating Breeze" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE", name: "Circle of Life" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1", name: "Adrenaline Driven Charity" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Naturestaff" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Naturestaff" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1", name: "Passive Movespeed Chance Naturestaff" }] }
  ] },
  "Wildfire Staff": { itemId: "T8_MAIN_FIRESTAFF_KEEPER", slot: "weapon", category: "firestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE", name: "Fire Bolt" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE", name: "Burning Field" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME", name: "Searing Flame" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE", name: "Flame Blast" }, { spell: "FIREWALL", icon: "INCINERATE", name: "Wall of Flames" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE", name: "Raging Flare" }, { spell: "FIRECONE", icon: "FLAMECONE", name: "Fire Wave" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY", name: "Fire Artillery" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL", name: "Pyroblast Skillshot" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1", name: "Burn" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Firestaff" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Passive Castingspeed Chance Firestaff" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS", name: "Passive Spellpower Caster Firestaff" }] }
  ] },
  "Witchwork Staff": { itemId: "T8_MAIN_ARCANESTAFF_UNDEAD", slot: "weapon", category: "arcanestaff", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE", name: "Chain Missile" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION", name: "Arcane Protection" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE", name: "Magic Shock" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE", name: "Enigma Blade" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE", name: "Motivating Cleanse" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE", name: "Frazzle" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE", name: "Empowering Beam" }, { spell: "MIMIC", icon: "MIMIC", name: "Mimic" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2", name: "Arcane Orb" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER", name: "Lingering Power" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN", name: "Passive Energychance Arcanestaff" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD", name: "Passive Armor Caster Arcanestaff" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE", name: "Hush" }] }
  ] },
};
window.SPELL_MAP = SPELL_MAP;

// Ordered list of render.albiononline.com URLs worth trying for a spell
// candidate — see this file's header for why there are three. The
// caller (spell-picker.js) chains through these on <img onerror>.
window.spellIconCandidates = function spellIconCandidates(candidate) {
  const ids = [candidate.name, candidate.icon, candidate.spell].filter(Boolean);
  return [...new Set(ids)].map(id => `https://render.albiononline.com/v1/spell/${encodeURIComponent(id)}.png?size=217&locale=en`);
};
