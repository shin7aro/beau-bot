/* ─────────────────────────────────────────
   SPELL MAP — shared frontend gear name -> Albion
   spell-slot data. Used by the (Shin7aro-only) Spell
   Picker admin page (spell-picker.html/js) to render
   each build's gear pieces with their pickable spell
   rows. Load this after item-map.js.

   NOTE: there is also a server-side copy of this map
   in spell-map.js at the project root (index.js/api.js
   can't reach browser code directly). Keep both in
   sync — see that file's header for how this was
   generated and how to regenerate it.
───────────────────────────────────────── */
const SPELL_MAP = {
  // Weapons
  "Arcane Staff": { itemId: "T8_MAIN_ARCANESTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE" }, { spell: "MIMIC", icon: "MIMIC" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE" }] }
  ] },
  "Arclight Blasters": { itemId: "T8_2H_DUALCROSSBOW_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT" }, { spell: "CALTROPS", icon: "CALTROPS" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC" }, { spell: "SILENCINGBOLT", icon: "SILENCE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Arctic Staff": { itemId: "T8_2H_FROSTSTAFF_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE" }, { spell: "ICESHARD", icon: "ICE_SHARD" }, { spell: "SHATTER_Q", icon: "FROST_NOVA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST" }, { spell: "FROSTBEAM", icon: "FROSTBEAM" }, { spell: "FROSTNOVA", icon: "FROSTNOVA" }, { spell: "FROST_LANCE", icon: "HOARFROST" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Armor of Valor": { itemId: "T8_ARMOR_PLATE_AVALON", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "TAUNT", icon: "TAUNT" }, { spell: "REFLECT_CHANNEL", icon: "FORCEFIELD" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Head
  "Assassin Hood": { itemId: "T8_HEAD_LEATHER_SET3", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "SUMMONER_CD_REDUCTION", icon: "HASTEN_COOLDOWN" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Assassin Jacket": { itemId: "T8_ARMOR_LEATHER_SET3", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "AMBUSH", icon: "STEALTH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Assassin Shoes": { itemId: "T8_SHOES_LEATHER_SET3", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "ASSASSIN_DASH", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Weapons
  "Astral Staff": { itemId: "T8_2H_ARCANESTAFF_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE" }, { spell: "MIMIC", icon: "MIMIC" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE" }] }
  ] },
  "Battleaxe": { itemId: "T8_MAIN_AXE", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE" }, { spell: "AXEBOOST", icon: "STRENGTH" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF" }, { spell: "INNERBLEEDING", icon: "BLEED" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Battler Bracers": { itemId: "T8_2H_KNUCKLES_SET2", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD" }] }
  ] },
  "Bear Paws": { itemId: "T8_2H_DUALAXE_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE" }, { spell: "AXEBOOST", icon: "STRENGTH" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF" }, { spell: "INNERBLEEDING", icon: "BLEED" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Bedrock Mace": { itemId: "T8_MAIN_ROCKMACE_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND" }, { spell: "SACRED_GROUND", icon: "SILENCE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD" }, { spell: "PBAOE_PULL", icon: "PULL_AOE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Black Monk Stave": { itemId: "T8_2H_COMBATSTAFF_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES" }, { spell: "CARTWHEEL", icon: "CARTWHEEL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO" }, { spell: "STUNRUN", icon: "SPRINT_CC" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING" }, { spell: "LAUNCHER", icon: "KNOCKUP" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Blazing Staff": { itemId: "T8_2H_INFERNOSTAFF_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE" }, { spell: "FIREWALL", icon: "INCINERATE" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE" }, { spell: "FIRECONE", icon: "FLAMECONE" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Blight Staff": { itemId: "T8_2H_NATURESTAFF_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT" }, { spell: "THORNSAREA", icon: "THORNSAREA" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS" }, { spell: "REANIMATE", icon: "REANIMATE" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Bloodletter": { itemId: "T8_MAIN_RAPIER_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR" }, { spell: "QDASH", icon: "DEADLY_SWIPE" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Bloodmoon Staff": { itemId: "T8_2H_SHAPESHIFTER_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Boltcasters": { itemId: "T8_2H_DUALCROSSBOW_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT" }, { spell: "CALTROPS", icon: "CALTROPS" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC" }, { spell: "SILENCINGBOLT", icon: "SILENCE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Boots of Valor": { itemId: "T8_SHOES_PLATE_AVALON", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL" }, { spell: "CC_BLOCK", icon: "PURGE_HOLY" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Weapons
  "Bow": { itemId: "T8_2H_BOW", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED" }, { spell: "POISONARROW", icon: "POISONED_ARROW" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT" }, { spell: "JUMPSHOT2", icon: "BACKFLIP" }, { spell: "SPEEDSHOT2", icon: "ARROW" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Bow of Badon": { itemId: "T8_2H_BOW_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED" }, { spell: "POISONARROW", icon: "POISONED_ARROW" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT" }, { spell: "JUMPSHOT2", icon: "BACKFLIP" }, { spell: "SPEEDSHOT2", icon: "ARROW" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Brawler Gloves": { itemId: "T8_2H_KNUCKLES_SET1", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD" }] }
  ] },
  "Bridled Fury": { itemId: "T8_2H_DAGGER_KATAR_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR" }, { spell: "QDASH", icon: "DEADLY_SWIPE" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Brimstone Staff": { itemId: "T8_2H_FIRESTAFF_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE" }, { spell: "FIREWALL", icon: "INCINERATE" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE" }, { spell: "FIRECONE", icon: "FLAMECONE" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Broadsword": { itemId: "T8_MAIN_SWORD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING" }, { spell: "PARRY", icon: "BLOCK" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD" }] }
  ] },
  "Camlann Mace": { itemId: "T8_2H_MACE_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND" }, { spell: "SACRED_GROUND", icon: "SILENCE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD" }, { spell: "PBAOE_PULL", icon: "PULL_AOE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Carrioncaller": { itemId: "T8_2H_HALBERD_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE" }, { spell: "AXEBOOST", icon: "STRENGTH" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF" }, { spell: "INNERBLEEDING", icon: "BLEED" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Carving Sword": { itemId: "T8_2H_CLEAVER_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING" }, { spell: "PARRY", icon: "BLOCK" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD" }] }
  ] },
  "Chillhowl": { itemId: "T8_MAIN_FROSTSTAFF_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE" }, { spell: "ICESHARD", icon: "ICE_SHARD" }, { spell: "SHATTER_Q", icon: "FROST_NOVA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST" }, { spell: "FROSTBEAM", icon: "FROSTBEAM" }, { spell: "FROSTNOVA", icon: "FROSTNOVA" }, { spell: "FROST_LANCE", icon: "HOARFROST" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Clarent Blade": { itemId: "T8_MAIN_SCIMITAR_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING" }, { spell: "PARRY", icon: "BLOCK" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD" }] }
  ] },
  "Claws": { itemId: "T8_2H_CLAWPAIR", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR" }, { spell: "QDASH", icon: "DEADLY_SWIPE" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Claymore": { itemId: "T8_2H_CLAYMORE", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING" }, { spell: "PARRY", icon: "BLOCK" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD" }] }
  ] },
  // Head
  "Cleric Cowl": { itemId: "T8_HEAD_CLOTH_SET2", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT" }, { spell: "ICEBLOCK2", icon: "ICEBLOCK2" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Chest
  "Cleric Robe": { itemId: "T8_ARMOR_CLOTH_SET2", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD" }, { spell: "LIFESAVIOR", icon: "PURGE_HOLY" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Feet
  "Cleric Sandals": { itemId: "T8_SHOES_CLOTH_SET2", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY" }, { spell: "BLINK", icon: "BLINK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Head
  "Cowl of Purity": { itemId: "T8_HEAD_CLOTH_AVALON", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT" }, { spell: "AVALON_BEAM", icon: "BEAM_HOLY" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Weapons
  "Crossbow": { itemId: "T8_2H_CROSSBOW", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT" }, { spell: "CALTROPS", icon: "CALTROPS" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC" }, { spell: "SILENCINGBOLT", icon: "SILENCE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Crystal Reaper": { itemId: "T8_2H_SCYTHE_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE" }, { spell: "AXEBOOST", icon: "STRENGTH" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF" }, { spell: "INNERBLEEDING", icon: "BLEED" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Head
  "Cultist Cowl": { itemId: "T8_HEAD_CLOTH_MORGANA", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT" }, { spell: "INNER_CORRUPTION", icon: "CURSE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Chest
  "Cultist Robe": { itemId: "T8_ARMOR_CLOTH_MORGANA", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD" }, { spell: "LEVITATE", icon: "LEVITATE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Feet
  "Cultist Sandals": { itemId: "T8_SHOES_CLOTH_MORGANA", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY" }, { spell: "DEMONWALK", icon: "CURSED_AREA" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Weapons
  "Cursed Skull": { itemId: "T8_2H_SKULLORB_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER" }, { spell: "CURSENOVA", icon: "DESECRATE" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM" }, { spell: "DARKMATTER", icon: "DARK_MATTER" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Cursed Staff": { itemId: "T8_MAIN_CURSEDSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER" }, { spell: "CURSENOVA", icon: "DESECRATE" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM" }, { spell: "DARKMATTER", icon: "DARK_MATTER" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Dagger": { itemId: "T8_MAIN_DAGGER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR" }, { spell: "QDASH", icon: "DEADLY_SWIPE" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Dagger Pair": { itemId: "T8_2H_DAGGERPAIR", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR" }, { spell: "QDASH", icon: "DEADLY_SWIPE" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Damnation Staff": { itemId: "T8_2H_CURSEDSTAFF_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER" }, { spell: "CURSENOVA", icon: "DESECRATE" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM" }, { spell: "DARKMATTER", icon: "DARK_MATTER" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Dawnsong": { itemId: "T8_2H_FIRE_RINGPAIR_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE" }, { spell: "FIREWALL", icon: "INCINERATE" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE" }, { spell: "FIRECONE", icon: "FLAMECONE" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Daybreaker": { itemId: "T8_MAIN_SPEAR_LANCE_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Deathgivers": { itemId: "T8_2H_DUALSICKLE_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR" }, { spell: "QDASH", icon: "DEADLY_SWIPE" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Demon Armor": { itemId: "T8_ARMOR_PLATE_HELL", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "TAUNT", icon: "TAUNT" }, { spell: "REFLECTAREA", icon: "RETALITATE" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Demon Boots": { itemId: "T8_SHOES_PLATE_HELL", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL" }, { spell: "BERSERK_SPRINT", icon: "SPRINT_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Head
  "Demon Helmet": { itemId: "T8_HEAD_PLATE_HELL", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "STONESKIN", icon: "OVERLOAD" }, { spell: "WEAPON_SILENCE", icon: "SILENCE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Weapons
  "Demonfang": { itemId: "T8_MAIN_DAGGER_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR" }, { spell: "QDASH", icon: "DEADLY_SWIPE" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Demonic Staff": { itemId: "T8_2H_DEMONICSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER" }, { spell: "CURSENOVA", icon: "DESECRATE" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM" }, { spell: "DARKMATTER", icon: "DARK_MATTER" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Divine Staff": { itemId: "T8_2H_DIVINESTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY" }, { spell: "HOLYFLASH", icon: "AOE_HOLY" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER" }, { spell: "HOLYORB", icon: "HOLY_ORB" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Double Bladed Staff": { itemId: "T8_2H_DOUBLEBLADEDSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES" }, { spell: "CARTWHEEL", icon: "CARTWHEEL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO" }, { spell: "STUNRUN", icon: "SPRINT_CC" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING" }, { spell: "LAUNCHER", icon: "KNOCKUP" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE" }] }
  ] },
  // Head
  "Dragonslayer Hood": { itemId: "T8_HEAD_LEATHER_DRAGON", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "FLARE", icon: "FLARE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Dragonslayer Jacket": { itemId: "T8_ARMOR_LEATHER_DRAGON", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "IMMUNEAREA", icon: "IMMUNEAREA" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Dragonslayer Shoes": { itemId: "T8_SHOES_LEATHER_DRAGON", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "WEAPON_SPRINT", icon: "WEAPON_SPRINT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Weapons
  "Dreadstorm Monarch": { itemId: "T8_MAIN_MACE_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND" }, { spell: "SACRED_GROUND", icon: "SILENCE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD" }, { spell: "PBAOE_PULL", icon: "PULL_AOE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE" }] }
  ] },
  // Head
  "Druid Cowl": { itemId: "T8_HEAD_CLOTH_KEEPER", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT" }, { spell: "ENERGYFIELD", icon: "RESTOREENERGY" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Chest
  "Druid Robe": { itemId: "T8_ARMOR_CLOTH_KEEPER", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD" }, { spell: "SPELLRUSH", icon: "OVERLOAD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Feet
  "Druid Sandals": { itemId: "T8_SHOES_CLOTH_KEEPER", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY" }, { spell: "FROSTWALK", icon: "CONE_FROST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Weapons
  "Druidic Staff": { itemId: "T8_MAIN_NATURESTAFF_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT" }, { spell: "THORNSAREA", icon: "THORNSAREA" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS" }, { spell: "REANIMATE", icon: "REANIMATE" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Dual Swords": { itemId: "T8_2H_DUALSWORD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING" }, { spell: "PARRY", icon: "BLOCK" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD" }] }
  ] },
  // Chest
  "Duskweaver Armor": { itemId: "T8_ARMOR_PLATE_FEY", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "TAUNT", icon: "TAUNT" }, { spell: "ARMOR_WEB", icon: "MYTHICAL_WEB" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Duskweaver Boots": { itemId: "T8_SHOES_PLATE_FEY", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL" }, { spell: "CHARGE_IN", icon: "CARGE_IN" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Head
  "Duskweaver Helmet": { itemId: "T8_HEAD_PLATE_FEY", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "STONESKIN", icon: "OVERLOAD" }, { spell: "SPIDER_THREAD", icon: "SPIDER_THREAD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Weapons
  "Earthrune Staff": { itemId: "T8_2H_SHAPESHIFTER_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Energy Shaper": { itemId: "T8_2H_CROSSBOW_CANNON_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT" }, { spell: "CALTROPS", icon: "CALTROPS" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC" }, { spell: "SILENCINGBOLT", icon: "SILENCE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Enigmatic Staff": { itemId: "T8_2H_ENIGMATICSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE" }, { spell: "MIMIC", icon: "MIMIC" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE" }] }
  ] },
  "Evensong": { itemId: "T8_2H_ARCANE_RINGPAIR_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE" }, { spell: "MIMIC", icon: "MIMIC" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE" }] }
  ] },
  "Exalted Staff": { itemId: "T8_2H_HOLYSTAFF_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY" }, { spell: "HOLYFLASH", icon: "AOE_HOLY" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER" }, { spell: "HOLYORB", icon: "HOLY_ORB" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Fallen Staff": { itemId: "T8_2H_HOLYSTAFF_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY" }, { spell: "HOLYFLASH", icon: "AOE_HOLY" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER" }, { spell: "HOLYORB", icon: "HOLY_ORB" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  // Head
  "Feyscale Hat": { itemId: "T8_HEAD_CLOTH_FEY", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT" }, { spell: "HYPER_FOCUS", icon: "HYPERFOCUS" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Chest
  "Feyscale Robe": { itemId: "T8_ARMOR_CLOTH_FEY", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD" }, { spell: "WILD_MAGIC", icon: "WILD_MAGIC" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Feet
  "Feyscale Sandals": { itemId: "T8_SHOES_CLOTH_FEY", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY" }, { spell: "TRANSLUCENT", icon: "TRANSLUCENT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Head
  "Fiend Cowl": { itemId: "T8_HEAD_CLOTH_HELL", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT" }, { spell: "PURGE_HELMET", icon: "PURGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Chest
  "Fiend Robe": { itemId: "T8_ARMOR_CLOTH_HELL", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD" }, { spell: "FEAR_AURA", icon: "FEAR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Feet
  "Fiend Sandals": { itemId: "T8_SHOES_CLOTH_HELL", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY" }, { spell: "SWAP", icon: "MAGICBARRIER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Weapons
  "Fire Staff": { itemId: "T8_MAIN_FIRESTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE" }, { spell: "FIREWALL", icon: "INCINERATE" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE" }, { spell: "FIRECONE", icon: "FLAMECONE" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Fists of Avalon": { itemId: "T8_2H_KNUCKLES_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD" }] }
  ] },
  "Flamewalker Staff": { itemId: "T8_MAIN_FIRESTAFF_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE" }, { spell: "FIREWALL", icon: "INCINERATE" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE" }, { spell: "FIRECONE", icon: "FLAMECONE" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Forcepulse Bracers": { itemId: "T8_2H_KNUCKLES_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD" }] }
  ] },
  "Forge Hammers": { itemId: "T8_2H_DUALHAMMER_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR" }, { spell: "CHARGESLOWAE", icon: "POUNCE" }, { spell: "GEYSER", icon: "EMPOWERMENT" }, { spell: "KNOCKOUT", icon: "MEZZ" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Forgebark Staff": { itemId: "T8_MAIN_NATURESTAFF_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT" }, { spell: "THORNSAREA", icon: "THORNSAREA" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS" }, { spell: "REANIMATE", icon: "REANIMATE" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Frost Staff": { itemId: "T8_MAIN_FROSTSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE" }, { spell: "ICESHARD", icon: "ICE_SHARD" }, { spell: "SHATTER_Q", icon: "FROST_NOVA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST" }, { spell: "FROSTBEAM", icon: "FROSTBEAM" }, { spell: "FROSTNOVA", icon: "FROSTNOVA" }, { spell: "FROST_LANCE", icon: "HOARFROST" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Galatine Pair": { itemId: "T8_2H_DUALSCIMITAR_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING" }, { spell: "PARRY", icon: "BLOCK" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD" }] }
  ] },
  "Glacial Staff": { itemId: "T8_2H_GLACIALSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE" }, { spell: "ICESHARD", icon: "ICE_SHARD" }, { spell: "SHATTER_Q", icon: "FROST_NOVA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST" }, { spell: "FROSTBEAM", icon: "FROSTBEAM" }, { spell: "FROSTNOVA", icon: "FROSTNOVA" }, { spell: "FROST_LANCE", icon: "HOARFROST" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Glaive": { itemId: "T8_2H_GLAIVE", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Grailseeker": { itemId: "T8_2H_QUARTERSTAFF_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES" }, { spell: "CARTWHEEL", icon: "CARTWHEEL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO" }, { spell: "STUNRUN", icon: "SPRINT_CC" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING" }, { spell: "LAUNCHER", icon: "KNOCKUP" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE" }] }
  ] },
  // Chest
  "Graveguard Armor": { itemId: "T8_ARMOR_PLATE_UNDEAD", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "TAUNT", icon: "TAUNT" }, { spell: "ARMORCHAIN", icon: "PULL_AOE" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Graveguard Boots": { itemId: "T8_SHOES_PLATE_UNDEAD", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL" }, { spell: "BATTLEFRENZY", icon: "PURGE_HOLY" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Head
  "Graveguard Helmet": { itemId: "T8_HEAD_PLATE_UNDEAD", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "STONESKIN", icon: "OVERLOAD" }, { spell: "SACRIFICE_HEAL", icon: "LIFESTEAL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Weapons
  "Great Arcane Staff": { itemId: "T8_2H_ARCANESTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE" }, { spell: "MIMIC", icon: "MIMIC" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE" }] }
  ] },
  "Great Axe": { itemId: "T8_2H_AXE", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE" }, { spell: "AXEBOOST", icon: "STRENGTH" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF" }, { spell: "INNERBLEEDING", icon: "BLEED" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Great Cursed Staff": { itemId: "T8_2H_CURSEDSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER" }, { spell: "CURSENOVA", icon: "DESECRATE" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM" }, { spell: "DARKMATTER", icon: "DARK_MATTER" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Great Fire Staff": { itemId: "T8_2H_FIRESTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE" }, { spell: "FIREWALL", icon: "INCINERATE" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE" }, { spell: "FIRECONE", icon: "FLAMECONE" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Great Frost Staff": { itemId: "T8_2H_FROSTSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE" }, { spell: "ICESHARD", icon: "ICE_SHARD" }, { spell: "SHATTER_Q", icon: "FROST_NOVA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST" }, { spell: "FROSTBEAM", icon: "FROSTBEAM" }, { spell: "FROSTNOVA", icon: "FROSTNOVA" }, { spell: "FROST_LANCE", icon: "HOARFROST" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Great Hammer": { itemId: "T8_2H_HAMMER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR" }, { spell: "CHARGESLOWAE", icon: "POUNCE" }, { spell: "GEYSER", icon: "EMPOWERMENT" }, { spell: "KNOCKOUT", icon: "MEZZ" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Great Holy Staff": { itemId: "T8_2H_HOLYSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY" }, { spell: "HOLYFLASH", icon: "AOE_HOLY" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER" }, { spell: "HOLYORB", icon: "HOLY_ORB" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Great Nature Staff": { itemId: "T8_2H_NATURESTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT" }, { spell: "THORNSAREA", icon: "THORNSAREA" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS" }, { spell: "REANIMATE", icon: "REANIMATE" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Grovekeeper": { itemId: "T8_2H_RAM_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR" }, { spell: "CHARGESLOWAE", icon: "POUNCE" }, { spell: "GEYSER", icon: "EMPOWERMENT" }, { spell: "KNOCKOUT", icon: "MEZZ" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE" }] }
  ] },
  // Chest
  "Guardian Armor": { itemId: "T8_ARMOR_PLATE_SET3", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "TAUNT", icon: "TAUNT" }, { spell: "ENFEEBLEAURA", icon: "BARRIER_DEMONIC" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Guardian Boots": { itemId: "T8_SHOES_PLATE_SET3", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL" }, { spell: "MAXHEALTHBUFF", icon: "GIANTSTEPS" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Head
  "Guardian Helmet": { itemId: "T8_HEAD_PLATE_SET3", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "STONESKIN", icon: "OVERLOAD" }, { spell: "EMERGENCY_SHIELD", icon: "EMERGENCY_SHIELD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Weapons
  "Halberd": { itemId: "T8_2H_HALBERD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE" }, { spell: "AXEBOOST", icon: "STRENGTH" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF" }, { spell: "INNERBLEEDING", icon: "BLEED" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Hallowfall": { itemId: "T8_MAIN_HOLYSTAFF_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY" }, { spell: "HOLYFLASH", icon: "AOE_HOLY" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER" }, { spell: "HOLYORB", icon: "HOLY_ORB" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Hammer": { itemId: "T8_MAIN_HAMMER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR" }, { spell: "CHARGESLOWAE", icon: "POUNCE" }, { spell: "GEYSER", icon: "EMPOWERMENT" }, { spell: "KNOCKOUT", icon: "MEZZ" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Hand of Justice": { itemId: "T8_2H_HAMMER_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR" }, { spell: "CHARGESLOWAE", icon: "POUNCE" }, { spell: "GEYSER", icon: "EMPOWERMENT" }, { spell: "KNOCKOUT", icon: "MEZZ" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Heavy Crossbow": { itemId: "T8_2H_CROSSBOWLARGE", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT" }, { spell: "CALTROPS", icon: "CALTROPS" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC" }, { spell: "SILENCINGBOLT", icon: "SILENCE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Heavy Mace": { itemId: "T8_2H_MACE", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND" }, { spell: "SACRED_GROUND", icon: "SILENCE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD" }, { spell: "PBAOE_PULL", icon: "PULL_AOE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Hellfire Hands": { itemId: "T8_2H_KNUCKLES_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD" }] }
  ] },
  // Head
  "Hellion Hood": { itemId: "T8_HEAD_LEATHER_HELL", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "SMOKEBOMB", icon: "SMOKEBOMB" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Hellion Jacket": { itemId: "T8_ARMOR_LEATHER_HELL", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "LIFESTEALAURA", icon: "BARRIER_DEMONIC" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Hellion Shoes": { itemId: "T8_SHOES_LEATHER_HELL", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "DEATHMARK", icon: "CROSSHAIR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Weapons
  "Hellspawn Staff": { itemId: "T8_2H_SHAPESHIFTER_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  // Head
  "Helmet of Valor": { itemId: "T8_HEAD_PLATE_AVALON", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "STONESKIN", icon: "OVERLOAD" }, { spell: "PURIFYING_SMOKE", icon: "WINDWALL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Weapons
  "Heron Spear": { itemId: "T8_MAIN_SPEAR_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Hoarfrost Staff": { itemId: "T8_MAIN_FROSTSTAFF_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE" }, { spell: "ICESHARD", icon: "ICE_SHARD" }, { spell: "SHATTER_Q", icon: "FROST_NOVA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST" }, { spell: "FROSTBEAM", icon: "FROSTBEAM" }, { spell: "FROSTNOVA", icon: "FROSTNOVA" }, { spell: "FROST_LANCE", icon: "HOARFROST" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Holy Staff": { itemId: "T8_MAIN_HOLYSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY" }, { spell: "HOLYFLASH", icon: "AOE_HOLY" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER" }, { spell: "HOLYORB", icon: "HOLY_ORB" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  // Head
  "Hood of Tenacity": { itemId: "T8_HEAD_LEATHER_AVALON", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "NASTY_WOUNDS", icon: "BUFF_SPEED" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Hunter Hood": { itemId: "T8_HEAD_LEATHER_SET2", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "RETALIATE2", icon: "RETALITATE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Hunter Jacket": { itemId: "T8_ARMOR_LEATHER_SET2", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "HASTE", icon: "BUFF_SPEED" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Hunter Shoes": { itemId: "T8_SHOES_LEATHER_SET2", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "OVERSPRINT", icon: "SPRINT_CC" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Weapons
  "Icicle Staff": { itemId: "T8_2H_ICEGAUNTLETS_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE" }, { spell: "ICESHARD", icon: "ICE_SHARD" }, { spell: "SHATTER_Q", icon: "FROST_NOVA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST" }, { spell: "FROSTBEAM", icon: "FROSTBEAM" }, { spell: "FROSTNOVA", icon: "FROSTNOVA" }, { spell: "FROST_LANCE", icon: "HOARFROST" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Incubus Mace": { itemId: "T8_MAIN_MACE_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND" }, { spell: "SACRED_GROUND", icon: "SILENCE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD" }, { spell: "PBAOE_PULL", icon: "PULL_AOE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Infernal Scythe": { itemId: "T8_2H_SCYTHE_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE" }, { spell: "AXEBOOST", icon: "STRENGTH" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF" }, { spell: "INNERBLEEDING", icon: "BLEED" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Infernal Staff": { itemId: "T8_2H_INFERNOSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE" }, { spell: "FIREWALL", icon: "INCINERATE" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE" }, { spell: "FIRECONE", icon: "FLAMECONE" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Infinity Blade": { itemId: "T8_MAIN_SWORD_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING" }, { spell: "PARRY", icon: "BLOCK" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD" }] }
  ] },
  "Ironclad Staff": { itemId: "T8_2H_IRONCLADEDSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES" }, { spell: "CARTWHEEL", icon: "CARTWHEEL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO" }, { spell: "STUNRUN", icon: "SPRINT_CC" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING" }, { spell: "LAUNCHER", icon: "KNOCKUP" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Ironroot Staff": { itemId: "T8_MAIN_NATURESTAFF_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT" }, { spell: "THORNSAREA", icon: "THORNSAREA" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS" }, { spell: "REANIMATE", icon: "REANIMATE" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  // Chest
  "Jacket of Tenacity": { itemId: "T8_ARMOR_LEATHER_AVALON", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "DYNAMIC_DEFENSE", icon: "LIVINGARMOR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Judicator Armor": { itemId: "T8_ARMOR_PLATE_KEEPER", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "TAUNT", icon: "TAUNT" }, { spell: "FORCESHIELD", icon: "FORCEFIELD" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Judicator Boots": { itemId: "T8_SHOES_PLATE_KEEPER", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL" }, { spell: "SHOULDERTACKLE", icon: "HAMMERTACKLE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Head
  "Judicator Helmet": { itemId: "T8_HEAD_PLATE_KEEPER", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "STONESKIN", icon: "OVERLOAD" }, { spell: "ELECTRICSHOCK", icon: "STORMSHIELD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Weapons
  "Kingmaker": { itemId: "T8_2H_CLAYMORE_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HEROICSTRIKE2", icon: "DECAPITATE" }, { spell: "CLEAVE", icon: "CLEAVE_SWORD" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SWORD_SPIN", icon: "SWORD_SPIN" }, { spell: "INTERRUPT2", icon: "INTERRUPT_BLUNT" }, { spell: "SPLITTINGSLASH", icon: "SPLITTING_SMASH" }, { spell: "HAMSTRINGSWORD", icon: "HAMSTRING" }, { spell: "PARRY", icon: "BLOCK" }, { spell: "DEFENSERUN", icon: "MELEE_BUFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MIGHTYBLOW", icon: "WHIRLWIND_SWORD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_REDUCE_DMG_SWORD", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEROICSTACK", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_ARMORCHANCE_SWORD", icon: "PASSIVEEFFECT_GUARD" }] }
  ] },
  // Chest
  "Knight Armor": { itemId: "T8_ARMOR_PLATE_SET2", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "TAUNT", icon: "TAUNT" }, { spell: "WINDWALL", icon: "WINDWALL" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Knight Boots": { itemId: "T8_SHOES_PLATE_SET2", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL" }, { spell: "CHARGE_SHIELD", icon: "DASH_BUFF" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Head
  "Knight Helmet": { itemId: "T8_HEAD_PLATE_SET2", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "STONESKIN", icon: "OVERLOAD" }, { spell: "DISRUPTIONIMMUNITY", icon: "LIVINGARMOR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Weapons
  "Lifecurse Staff": { itemId: "T8_MAIN_CURSEDSTAFF_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER" }, { spell: "CURSENOVA", icon: "DESECRATE" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM" }, { spell: "DARKMATTER", icon: "DARK_MATTER" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Lifetouch Staff": { itemId: "T8_MAIN_HOLYSTAFF_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY" }, { spell: "HOLYFLASH", icon: "AOE_HOLY" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER" }, { spell: "HOLYORB", icon: "HOLY_ORB" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Light Crossbow": { itemId: "T8_MAIN_1HCROSSBOW", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT" }, { spell: "CALTROPS", icon: "CALTROPS" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC" }, { spell: "SILENCINGBOLT", icon: "SILENCE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Lightcaller": { itemId: "T8_2H_SHAPESHIFTER_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Longbow": { itemId: "T8_2H_LONGBOW", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED" }, { spell: "POISONARROW", icon: "POISONED_ARROW" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT" }, { spell: "JUMPSHOT2", icon: "BACKFLIP" }, { spell: "SPEEDSHOT2", icon: "ARROW" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Mace": { itemId: "T8_MAIN_MACE", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND" }, { spell: "SACRED_GROUND", icon: "SILENCE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD" }, { spell: "PBAOE_PULL", icon: "PULL_AOE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE" }] }
  ] },
  // Head
  "Mage Cowl": { itemId: "T8_HEAD_CLOTH_SET3", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT" }, { spell: "HELMET_FIREBREATH", icon: "FLAMECONE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Chest
  "Mage Robe": { itemId: "T8_ARMOR_CLOTH_SET3", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD" }, { spell: "PURGINGSHIELD2", icon: "PURGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Feet
  "Mage Sandals": { itemId: "T8_SHOES_CLOTH_SET3", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY" }, { spell: "DELAYED_TELEPORT", icon: "MAGICBARRIER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Weapons
  "Malevolent Locus": { itemId: "T8_2H_ENIGMATICORB_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE" }, { spell: "MIMIC", icon: "MIMIC" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE" }] }
  ] },
  // Head
  "Mercenary Hood": { itemId: "T8_HEAD_LEATHER_SET1", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "HOWL", icon: "INTIMIDATINGSHOUT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Mercenary Jacket": { itemId: "T8_ARMOR_LEATHER_SET1", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "BLOODLUST", icon: "BLOODLUST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Mercenary Shoes": { itemId: "T8_SHOES_LEATHER_SET1", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "CLEANSE_DASH", icon: "DASH_BUFF" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Weapons
  "Mistpiercer": { itemId: "T8_2H_BOW_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED" }, { spell: "POISONARROW", icon: "POISONED_ARROW" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT" }, { spell: "JUMPSHOT2", icon: "BACKFLIP" }, { spell: "SPEEDSHOT2", icon: "ARROW" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  // Head
  "Mistwalker Hood": { itemId: "T8_HEAD_LEATHER_FEY", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "IMMORTAL", icon: "IMMORTAL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Mistwalker Jacket": { itemId: "T8_ARMOR_LEATHER_FEY", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "MIST_WALKER", icon: "MIST_WALKER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Mistwalker Shoes": { itemId: "T8_SHOES_LEATHER_FEY", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "AFTER_IMAGE", icon: "AFTER_IMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Weapons
  "Morning Star": { itemId: "T8_2H_FLAIL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND" }, { spell: "SACRED_GROUND", icon: "SILENCE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD" }, { spell: "PBAOE_PULL", icon: "PULL_AOE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Nature Staff": { itemId: "T8_MAIN_NATURESTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT" }, { spell: "THORNSAREA", icon: "THORNSAREA" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS" }, { spell: "REANIMATE", icon: "REANIMATE" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Oathkeepers": { itemId: "T8_2H_DUALMACE_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "DEFENSIVESLAM", icon: "MACE_BUFF" }, { spell: "THREATENINGSMASH", icon: "MELEEWHIRLWIND" }, { spell: "SACRED_GROUND", icon: "SILENCE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDSHAKER", icon: "GROUND_SHAKER" }, { spell: "CHARGE_ROOT", icon: "DASH_DEBUFF" }, { spell: "GUARDRUNE", icon: "MAGICCIRCLE_GUARD" }, { spell: "PBAOE_PULL", icon: "PULL_AOE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "MACELEAP", icon: "JUMP_ATTACK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_MACE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_MACE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_MACE", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Occult Staff": { itemId: "T8_2H_ARCANESTAFF_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE" }, { spell: "MIMIC", icon: "MIMIC" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE" }] }
  ] },
  "Permafrost Prism": { itemId: "T8_2H_ICECRYSTAL_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FROST_BITE", icon: "FROSTBITE" }, { spell: "ICESHARD", icon: "ICE_SHARD" }, { spell: "SHATTER_Q", icon: "FROST_NOVA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FROSTBOMB_CASTSLOW", icon: "NOVA_FROST" }, { spell: "FROSTBEAM", icon: "FROSTBEAM" }, { spell: "FROSTNOVA", icon: "FROSTNOVA" }, { spell: "FROST_LANCE", icon: "HOARFROST" }, { spell: "ICE_SCULPTURE", icon: "ICESCULPTURE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "FREEZINGWIND", icon: "CONE_FROST" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_FROST", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FROSTSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FROSTSTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FROSTSTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Phantom Twinblade": { itemId: "T8_2H_DOUBLEBLADEDSTAFF_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES" }, { spell: "CARTWHEEL", icon: "CARTWHEEL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO" }, { spell: "STUNRUN", icon: "SPRINT_CC" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING" }, { spell: "LAUNCHER", icon: "KNOCKUP" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Pike": { itemId: "T8_2H_SPEAR", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Polehammer": { itemId: "T8_2H_POLEHAMMER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR" }, { spell: "CHARGESLOWAE", icon: "POUNCE" }, { spell: "GEYSER", icon: "EMPOWERMENT" }, { spell: "KNOCKOUT", icon: "MEZZ" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Primal Staff": { itemId: "T8_2H_SHAPESHIFTER_SET3", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Prowling Staff": { itemId: "T8_2H_SHAPESHIFTER_SET1", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Quarterstaff": { itemId: "T8_2H_QUARTERSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES" }, { spell: "CARTWHEEL", icon: "CARTWHEEL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO" }, { spell: "STUNRUN", icon: "SPRINT_CC" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING" }, { spell: "LAUNCHER", icon: "KNOCKUP" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Rampant Staff": { itemId: "T8_2H_NATURESTAFF_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT" }, { spell: "THORNSAREA", icon: "THORNSAREA" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS" }, { spell: "REANIMATE", icon: "REANIMATE" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Ravenstrike Cestus": { itemId: "T8_2H_KNUCKLES_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD" }] }
  ] },
  "Realmbreaker": { itemId: "T8_2H_AXE_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "RENDINGSTRIKE", icon: "AXE_DOT" }, { spell: "RENDINGSPIN", icon: "CLEAVE_SWORD" }, { spell: "RENDINGCOMBO", icon: "RENDING_COMBO_1" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "AXESMASH", icon: "HEAVY_AXE" }, { spell: "AXEBOOST", icon: "STRENGTH" }, { spell: "AXE_CHARGE", icon: "DASH_BUFF" }, { spell: "INNERBLEEDING", icon: "BLEED" }, { spell: "BLADE_AURA", icon: "ENFEEBLEBLADES" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "AXETHROW", icon: "BLOOD_BANDIT" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_AXE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMORCHANCE_AXE", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_AXE", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Redemption Staff": { itemId: "T8_2H_HOLYSTAFF_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "GENEROUSHEAL", icon: "HEAL_SELF_HOLY" }, { spell: "SMITE_AOE", icon: "NOVA_HOLY" }, { spell: "HOLYFLASH", icon: "AOE_HOLY" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "PULSINGHEAL", icon: "HOLY_PULSE" }, { spell: "HEALINGBEAM", icon: "HOLY_BEAM" }, { spell: "HOLYHOT", icon: "DESPERATEHOLYPRAYER" }, { spell: "HOLYORB", icon: "HOLY_ORB" }, { spell: "RESURRECTION", icon: "RESURRECT_HOLY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HOLYDESPERATEPRAYER2", icon: "DESPERATE_PRAYER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_HOLYSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNOCKBACK_CASTER_HOLYSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HOLY_ASCENDED", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Rift Glaive": { itemId: "T8_2H_GLAIVE_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  // Chest
  "Robe of Purity": { itemId: "T8_ARMOR_CLOTH_AVALON", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD" }, { spell: "CASTBUBBLE", icon: "MAGICCIRCLE_HOLY" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Weapons
  "Rootbound Staff": { itemId: "T8_2H_SHAPESHIFTER_SET2", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Rotcaller Staff": { itemId: "T8_MAIN_CURSEDSTAFF_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER" }, { spell: "CURSENOVA", icon: "DESECRATE" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM" }, { spell: "DARKMATTER", icon: "DARK_MATTER" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  // Chest
  "Royal Armor": { itemId: "T8_ARMOR_PLATE_ROYAL", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "TAUNT", icon: "TAUNT" }, { spell: "MANADRAIN", icon: "RESTOREENERGY" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Royal Boots": { itemId: "T8_SHOES_PLATE_ROYAL", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL" }, { spell: "ROYAL_MARCH", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Head
  "Royal Cowl": { itemId: "T8_HEAD_CLOTH_ROYAL", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT" }, { spell: "PERPETUALENERGY", icon: "RESTOREENERGY" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  "Royal Helmet": { itemId: "T8_HEAD_PLATE_ROYAL", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "STONESKIN", icon: "OVERLOAD" }, { spell: "ARTILLERY_COMMAND", icon: "METEOR_FIRE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  "Royal Hood": { itemId: "T8_HEAD_LEATHER_ROYAL", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "GROWING_RAGE", icon: "STRENGTH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Royal Jacket": { itemId: "T8_ARMOR_LEATHER_ROYAL", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "ROYAL_BANNER", icon: "STRENGTH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Royal Robe": { itemId: "T8_ARMOR_CLOTH_ROYAL", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD" }, { spell: "MAGICCIRCLE", icon: "MAGICCIRCLE_DEMONIC" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Feet
  "Royal Sandals": { itemId: "T8_SHOES_CLOTH_ROYAL", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY" }, { spell: "GLASS_MOVESPEED", icon: "BUFF_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  "Royal Shoes": { itemId: "T8_SHOES_LEATHER_ROYAL", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "JUMP", icon: "DODGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Sandals of Purity": { itemId: "T8_SHOES_CLOTH_AVALON", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY" }, { spell: "HOVER_SPRINT", icon: "LEVITATE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Head
  "Scholar Cowl": { itemId: "T8_HEAD_CLOTH_SET1", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "PBAOE_KNOCKBACK", icon: "INTIMIDATINGSHOUT" }, { spell: "ENERGYSHIELD2", icon: "POWER_FIELD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Chest
  "Scholar Robe": { itemId: "T8_ARMOR_CLOTH_SET1", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FROSTSHIELD", icon: "FROSTSHIELD" }, { spell: "SPEEDCASTER", icon: "HASTEN_COOLDOWN" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ARMOR_INCREASED_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Feet
  "Scholar Sandals": { itemId: "T8_SHOES_CLOTH_SET1", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTEOT", icon: "SPRINT_ENERGY" }, { spell: "CHANNELED_RUN", icon: "RUN" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_INCREASED_DAMAGE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CASTSPEED", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_REDUCED_ENERGYCOST", icon: "PASSIVE_CONCENTRATION_1" }] }
  ] },
  // Weapons
  "Shadowcaller": { itemId: "T8_MAIN_CURSEDSTAFF_AVALON", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CURSEDOT", icon: "VILE_CURSE" }, { spell: "CURSEBLADE", icon: "CURSED_SICKLE" }, { spell: "CURSED_SPLAT", icon: "CURSED_AREA" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ARMORPIERCER", icon: "ARMOR_PIERCER" }, { spell: "CURSENOVA", icon: "DESECRATE" }, { spell: "CURSEDHANDS_STACKUP", icon: "BARRIER_DEMONIC" }, { spell: "CURSEDBEAM", icon: "CURSED_BEAM" }, { spell: "DARKMATTER", icon: "DARK_MATTER" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DEATHCURSE2", icon: "COUPDEGRACE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_CURSE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_CURSEDSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CURSEDSTAFF", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_MOVESPEED_CHANCE_CURSEDSTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  // Feet
  "Shoes of Tenacity": { itemId: "T8_SHOES_LEATHER_AVALON", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "BLINDSPOT", icon: "STEALTH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Weapons
  "Siegebow": { itemId: "T8_2H_CROSSBOWLARGE_MORGANA", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT" }, { spell: "CALTROPS", icon: "CALTROPS" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC" }, { spell: "SILENCINGBOLT", icon: "SILENCE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Skystrider Bow": { itemId: "T8_2H_BOW_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED" }, { spell: "POISONARROW", icon: "POISONED_ARROW" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT" }, { spell: "JUMPSHOT2", icon: "BACKFLIP" }, { spell: "SPEEDSHOT2", icon: "ARROW" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  // Chest
  "Soldier Armor": { itemId: "T8_ARMOR_PLATE_SET1", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "TAUNT", icon: "TAUNT" }, { spell: "ENRAGE", icon: "BUFF_DAMAGE" }] },
      { key: "passive1", label: "Passive slot 1", spells: [{ spell: "PASSIVE_ARMOR_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_ARMOR_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ARMOR_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] },
      { key: "passive2", label: "Passive slot 2", spells: [{ spell: "PASSIVE_PLATEARMOR_HEALTH_REDUCTION", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_PLATEARMOR_THREATGENERATION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Soldier Boots": { itemId: "T8_SHOES_PLATE_SET1", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINTHOT", icon: "SPRINT_HEAL" }, { spell: "WANDERLUST", icon: "POUNCE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Head
  "Soldier Helmet": { itemId: "T8_HEAD_PLATE_SET1", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "STONESKIN", icon: "OVERLOAD" }, { spell: "BLOCK", icon: "BLOCK" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MR_AR", icon: "PASSIVE_GUARD" }, { spell: "PASSIVE_CCDURATION", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_INCREASED_CCR", icon: "PASSIVE_THORNS_1" }] }
  ] },
  // Weapons
  "Soulscythe": { itemId: "T8_2H_TWINSCYTHE_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES" }, { spell: "CARTWHEEL", icon: "CARTWHEEL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO" }, { spell: "STUNRUN", icon: "SPRINT_CC" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING" }, { spell: "LAUNCHER", icon: "KNOCKUP" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Spear": { itemId: "T8_MAIN_SPEAR", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  // Head
  "Specter Hood": { itemId: "T8_HEAD_LEATHER_UNDEAD", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "ARMOR_CD_RESET", icon: "INSPIRATION" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Specter Jacket": { itemId: "T8_ARMOR_LEATHER_UNDEAD", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "BURNAURA", icon: "INCINERATE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Specter Shoes": { itemId: "T8_SHOES_LEATHER_UNDEAD", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "INVISIBLE_WALK", icon: "STEALTH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Weapons
  "Spiked Gauntlets": { itemId: "T8_2H_KNUCKLES_SET3", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD" }] }
  ] },
  "Spirithunter": { itemId: "T8_2H_HARPOON_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Staff of Balance": { itemId: "T8_2H_ROCKSTAFF_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CONCUSSIVEBLOW_MULTI_1", icon: "STUN" }, { spell: "WHIRLING_STAFF", icon: "WHIRLING_STRIKES" }, { spell: "CARTWHEEL", icon: "CARTWHEEL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "QSTAFF_COMBO", icon: "QSTAFF_COMBO" }, { spell: "STUNRUN", icon: "SPRINT_CC" }, { spell: "QS_WHIRLWIND2", icon: "FORCEFUL_SWING" }, { spell: "LAUNCHER", icon: "KNOCKUP" }, { spell: "SEPARATING_SLAM", icon: "OVERHEADSWING_STAFF" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "VAULT_ATTACK", icon: "VAULT_LEAP" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE_QUARTERSTAFF", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_QUARTERSTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_QUARTERSTAFF", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_QUARTERSTAFF", icon: "PASSIVE_REINFORCE" }] }
  ] },
  // Head
  "Stalker Hood": { itemId: "T8_HEAD_LEATHER_MORGANA", slot: "head", groups: [
      { key: "active", label: "Active", spells: [{ spell: "ENERGY_BARRIER", icon: "MAGICBARRIER" }, { spell: "SELF_CLEANSE", icon: "MAGICCIRCLE_MOVEMENT" }, { spell: "SMELLOFBLOOD", icon: "OVERLOAD_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Chest
  "Stalker Jacket": { itemId: "T8_ARMOR_LEATHER_MORGANA", slot: "chest", groups: [
      { key: "active", label: "Active", spells: [{ spell: "OUTOFCOMBATHEAL", icon: "MEND_WOUNDS" }, { spell: "FLAMESHIELD", icon: "INFERNOSHIELD" }, { spell: "STORMSHIELD", icon: "STORMSHIELD" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ARMOR_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ARMOR_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_ARMOR_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Feet
  "Stalker Shoes": { itemId: "T8_SHOES_LEATHER_MORGANA", slot: "feet", groups: [
      { key: "active", label: "Active", spells: [{ spell: "DODGE", icon: "DODGE_ROLL" }, { spell: "SPRINT_CD_REDUCTION", icon: "SPRINT" }, { spell: "DMG_BLINK", icon: "BLINK_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_MAXLOAD_SHOES", icon: "PASSIVE_MAXLOAD" }, { spell: "PASSIVE_BALANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_INCREASED_AASPEED", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_CD_REDUCTION", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  // Weapons
  "Stillgaze Staff": { itemId: "T8_2H_SHAPESHIFTER_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SHAPE_Q_CAST", icon: "UNSTABLE_PROJECTILE" }, { spell: "SHAPE_Q_SKILLSHOT", icon: "REALITY_FISSURE" }, { spell: "SHAPE_Q_DAMAGE_AND_SHIELD", icon: "MALLUABLE_FLUX" }, { spell: "SHAPE_Q_CONE_MELEE", icon: "ENERGY_EXERTION" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "SHAPE_W_DAMAGE_AOE", icon: "DISTORTION" }, { spell: "SHAPE_W_AREA_PULL", icon: "POSITIONAL_DRIFT" }, { spell: "SHAPE_W_TETHERBEAM", icon: "REALITY_TENDRIL" }, { spell: "SHAPE_W_POLYMORPH", icon: "POLYMORPH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SHAPESHIFT_PANTHER", icon: "SHAPESHIFT_PANTHER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SHAPESHIFT_ATTACK_BUFF", icon: "PASSIVE_SHAPE_ENT" }, { spell: "PASSIVE_SHAPESHIFT_Q_CAST_DAMAGE_REDUCE", icon: "PASSIVE_SHAPE_BEAR" }, { spell: "PASSIVE_SHAPESHIFT_GATHER_CHARGES", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SHAPESHIFT_W_CAST_SPEED_BUFF", icon: "PASSIVE_SHARPSHOOTER" }] }
  ] },
  "Tombhammer": { itemId: "T8_2H_HAMMER_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR" }, { spell: "CHARGESLOWAE", icon: "POUNCE" }, { spell: "GEYSER", icon: "EMPOWERMENT" }, { spell: "KNOCKOUT", icon: "MEZZ" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Trinity Spear": { itemId: "T8_2H_TRIDENT_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SPEAR_LUNGE", icon: "SPEAR_THROW" }, { spell: "SPIRITSPEAR", icon: "SPIRITSPEAR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FORESTOFSPEARS", icon: "SPEAR_CONE" }, { spell: "CHARGINGBLADE", icon: "BLAST_FIRE" }, { spell: "LEGBREAKER", icon: "SPEAR_PURGE" }, { spell: "DEFLECTINGSTANCE", icon: "RETALITATE" }, { spell: "GROUNDSPEAR", icon: "GROUND_SPEAR" }, { spell: "SKILLSHOT_PULL", icon: "HARPOON" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "DASHDMG", icon: "DASH" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_HEALTHCHANCE_SPEAR", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_SPEAR", icon: "PASSIVE_PARALYSIS" }, { spell: "PASSIVE_AASPEEDCHANCE_SPEAR", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Truebolt Hammer": { itemId: "T8_2H_HAMMER_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "HAMMER_SHOVE", icon: "SHOVE" }, { spell: "THREATENINGSTRIKE_HAMMER", icon: "THREATENING_STRIKE" }, { spell: "IRONBREAKER", icon: "SUNDER_ARMOR" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "HAMMER_TREMOR", icon: "SEISMIC_TREMOR" }, { spell: "CHARGESLOWAE", icon: "POUNCE" }, { spell: "GEYSER", icon: "EMPOWERMENT" }, { spell: "KNOCKOUT", icon: "MEZZ" }, { spell: "TAR_RING", icon: "MOUNTSPELL_BIGCLEAVE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "HAMMERWHIRLWIND2", icon: "WHIRLWIND_HAMMER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_STUNCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_HAMMER", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_HEALTHCHANCE_HAMMER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_CCDURATION_CHANCE_HAMMER", icon: "PASSIVE_REINFORCE" }] }
  ] },
  "Twin Slayers": { itemId: "T8_2H_DAGGERPAIR_CRYSTAL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "SUNDERARMOR2", icon: "SUNDER_ARMOR" }, { spell: "QDASH", icon: "DEADLY_SWIPE" }, { spell: "ASSASSINSPIRIT", icon: "ASSASSIN_SPIRIT" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "THROWINGBLADES", icon: "THROWING_BLADES" }, { spell: "GROUNDDASH", icon: "DASH_DAGGER" }, { spell: "DEEPCUTS", icon: "FORBIDDEN_STAB" }, { spell: "SKILLSHOT_TELEPORT", icon: "DAGGER_THROW" }, { spell: "CHAINDASH", icon: "CHAIN_SLASH" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLOODTHIRSTYBLADE", icon: "BLOODTHIRSTYBLADE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BLEEDCHANCE", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_HEALTHCHANCE_DAGGER", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_AASPEEDCHANCE_DAGGER", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_SPELLPOWER_CHANCE_DAGGER", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Ursine Maulers": { itemId: "T8_2H_KNUCKLES_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "CREATE_OPENING", icon: "KNUCKLES_CREATE_OPENING" }, { spell: "DASHKICK", icon: "KNUCKLES_DASHKICK" }, { spell: "CROSSSTEP_ROUNDHOUSE", icon: "KNUCKLES_TRIPLE_COMBO_1" }, { spell: "SHOCKWAVE_PUNCH", icon: "KNUCKLES_SHOCKWAVE_PUNCH" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "TRIPLE_KICK", icon: "KNUCKLES_TRIPLE_KICK" }, { spell: "BACKHAND_KNOCKBACK", icon: "KNUCKLES_BACKHAND_PUNCH" }, { spell: "KNUCKLE_COUNTER", icon: "KNUCKLES_COUNTER" }, { spell: "KNUCKLECOMBO", icon: "KNUCKLES_PUNCH_COMBO" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "BLAZING_GEYSER", icon: "KNUCKLES_POWER_GEYSER" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNUCKLE_BRAWLER", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_KNUCKLE_RAGE", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_KNUCKLE_RUSHDOWN", icon: "PASSIVE_AGILITY_1" }, { spell: "PASSIVE_KNUCKLE_COMBOBREAKER", icon: "PASSIVE_GUARD" }] }
  ] },
  "Wailing Bow": { itemId: "T8_2H_BOW_HELL", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED" }, { spell: "POISONARROW", icon: "POISONED_ARROW" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT" }, { spell: "JUMPSHOT2", icon: "BACKFLIP" }, { spell: "SPEEDSHOT2", icon: "ARROW" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Warbow": { itemId: "T8_2H_WARBOW", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED" }, { spell: "POISONARROW", icon: "POISONED_ARROW" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT" }, { spell: "JUMPSHOT2", icon: "BACKFLIP" }, { spell: "SPEEDSHOT2", icon: "ARROW" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Weeping Repeater": { itemId: "T8_2H_REPEATINGCROSSBOW_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "AUTOFIRE2", icon: "BOLT_DMG" }, { spell: "BOLTSHOT", icon: "MAGICPROJECTILE_FIRE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ACID_BOMB", icon: "ACID_BOMB" }, { spell: "SUNDERSHOT", icon: "RANGED_INTERRUPT" }, { spell: "CALTROPS", icon: "CALTROPS" }, { spell: "KNOCKBACKSHOT2", icon: "ARROW_MAGIC" }, { spell: "SILENCINGBOLT", icon: "SILENCE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SNIPESHOT_CROSSBOW", icon: "CROSSHAIR" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_KNOCKBACKCHANCE", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_CD_RESET_Q", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_CROSSBOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_SPELLPOWER_CASTER_CROSSBOW", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Whispering Bow": { itemId: "T8_2H_LONGBOW_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "MULTISHOT2", icon: "ARROW_CONE" }, { spell: "DEADLYSHOT", icon: "ARROW_AIMED" }, { spell: "POISONARROW", icon: "POISONED_ARROW" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "GROUNDARROW", icon: "RAY_OF_LIGHT" }, { spell: "JUMPSHOT2", icon: "BACKFLIP" }, { spell: "SPEEDSHOT2", icon: "ARROW" }, { spell: "BURNINGARROWS", icon: "ARROW_EXPLOSION" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "SPEEDARCHER_KITE", icon: "BUFF_DAMAGE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_SLOWPOISON", icon: "PASSIVE_DAZE" }, { spell: "PASSIVE_ENERGYCHANCE_BOW", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_PIERCE_STACK", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_AASPEEDCHANCE_BOW", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Wild Staff": { itemId: "T8_2H_WILDSTAFF", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "REJUVENATION", icon: "HEAL_HOT" }, { spell: "THORNSAREA", icon: "THORNSAREA" }, { spell: "REJUVMUSHROOM_GRENADE", icon: "NATURE_HEALING_SPELL" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "BRAMBLESEED", icon: "THORNS" }, { spell: "REANIMATE", icon: "REANIMATE" }, { spell: "NATURERESILIENCE", icon: "REJUVMUSHROOM" }, { spell: "CLEANSEHEAL", icon: "CLEANSEHEAL" }, { spell: "REJUVENATING_BREEZE", icon: "REJUVINATING_BREEZE" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "CIRCLEOFLIFE", icon: "CIRCLEOFLIFE" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_HEALPOWERCHANCE", icon: "PASSIVE_VITALITY_1" }, { spell: "PASSIVE_ENERGYCHANCE_NATURESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_NATURESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_MOVESPEED_CHANCE_NATURESTAFF", icon: "PASSIVE_AGILITY_1" }] }
  ] },
  "Wildfire Staff": { itemId: "T8_MAIN_FIRESTAFF_KEEPER", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "FIRESTAFFBOLT2", icon: "MAGICPROJECTILE_FIRE" }, { spell: "FIRESTAFFBOLT_AOE", icon: "AOE_FIRE" }, { spell: "SEARING_FLAME", icon: "SEARING_FLAME" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "FIRESTAFFIGNITE2_SPREAD", icon: "IGNITE" }, { spell: "FIREWALL", icon: "INCINERATE" }, { spell: "SKILLSHOT_FIREBALL", icon: "FIRE_WAVE" }, { spell: "FIRECONE", icon: "FLAMECONE" }, { spell: "FIREARTILLERY", icon: "FIRE_ARTILLERY" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "PYROBLAST_SKILLSHOT", icon: "FIRE_BALL" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_BURN", icon: "PASSIVE_FURY_1" }, { spell: "PASSIVE_ENERGYCHANCE_FIRESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_CASTINGSPEED_CHANCE_FIRESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_SPELLPOWER_CASTER_FIRESTAFF", icon: "PASSIVE_PARALYSIS" }] }
  ] },
  "Witchwork Staff": { itemId: "T8_MAIN_ARCANESTAFF_UNDEAD", slot: "weapon", groups: [
      { key: "active1", label: "Active slot 1", spells: [{ spell: "ARCANE_CHAIN_MISSILE", icon: "CHAIN_MISSILE" }, { spell: "SHIELDFRIENDLY", icon: "ARCANE_PROTECTION" }, { spell: "MAGICSHOCK", icon: "NOVA_ARCANE" }] },
      { key: "active2", label: "Active slot 2", spells: [{ spell: "ENIGMA_BLADE", icon: "ENIGMA_BLADE" }, { spell: "CLEANSESPEED2", icon: "MOTIVATING_CLEANSE" }, { spell: "FRAZZLE2", icon: "MAGICPROJECTILE_ARCANE" }, { spell: "EMPOWERBEAM", icon: "BEAM_ARCANE" }, { spell: "MIMIC", icon: "MIMIC" }] },
      { key: "active3", label: "Active slot 3", spells: [{ spell: "ARCANEORB2", icon: "ARCANE_ORB_2" }] },
      { key: "passive", label: "Passive", spells: [{ spell: "PASSIVE_ATTACKBUFF_ARCANESTAFF", icon: "PASSIVE_SHARPSHOOTER" }, { spell: "PASSIVE_ENERGYCHANCE_ARCANESTAFF", icon: "PASSIVE_TACTICIAN" }, { spell: "PASSIVE_ARMOR_CASTER_ARCANESTAFF", icon: "PASSIVEEFFECT_GUARD" }, { spell: "PASSIVE_SILENCECHANCE", icon: "PASSIVE_DAZE" }] }
  ] },
};
window.SPELL_MAP = SPELL_MAP;

// Same uisprite-vs-uniquename caveat as item-map.js's imgUrl(): the
// render API wants each candidate's "icon" field, not its "spell" field.
window.spellIconUrl = function spellIconUrl(icon) {
  return icon ? `https://render.albiononline.com/v1/spell/${icon}.png` : null;
};
