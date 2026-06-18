const ROWS = 5;
const COLS = 9;
const SUN_VALUE = 25;
const LEVEL_ORDER = ["garden", "mine", "night"];
const TERRAIN = {
  G: "grass",
  D: "dirt",
  S: "stone",
  O: "ore",
  M: "mud"
};

const difficultyConfigs = {
  easy: {
    initialSun: 300,
    base: 4,
    hpMultiplier: 1.02,
    speedMultiplier: 0.96,
    spawnGapBonus: -40,
    rewardMultiplier: 1.0,
    waveMultiplier: 1.28
  },
  normal: {
    initialSun: 200,
    base: 3,
    hpMultiplier: 1.36,
    speedMultiplier: 1.16,
    spawnGapBonus: -220,
    rewardMultiplier: 0.82,
    waveMultiplier: 1.55
  },
  hard: {
    initialSun: 150,
    base: 2,
    hpMultiplier: 1.78,
    speedMultiplier: 1.34,
    spawnGapBonus: -380,
    rewardMultiplier: 0.66,
    waveMultiplier: 1.95
  }
};

const modeConfigs = {
  campaign: {
    name: "Campaign",
    loadoutSize: 6,
    allPlants: false
  },
  creative: {
    name: "Creative",
    loadoutSize: null,
    allPlants: true,
    initialSun: 1500,
    base: 12,
    spawnGapBonus: 100,
    rewardMultiplier: 1.15
  },
  creativefusion: {
    name: "Creative Fusion",
    loadoutSize: null,
    allPlants: true,
    fusion: true,
    creative: true,
    initialSun: 3000,
    base: 18,
    spawnGapBonus: -60,
    rewardMultiplier: 1.15,
    hpMultiplier: 1.12,
    speedMultiplier: 1.08,
    waveMultiplier: 1.35
  },
  fusion: {
    name: "Fusion Mod",
    loadoutSize: null,
    allPlants: true,
    fusion: true,
    initialSun: 650,
    base: 5,
    spawnGapBonus: -260,
    rewardMultiplier: 0.86,
    hpMultiplier: 1.32,
    speedMultiplier: 1.16,
    waveMultiplier: 1.75
  }
};

const toolTypes = {
  tnt: {
    name: "TNT",
    cost: 125,
    image: "../assets/minecraft/tools/tnt.png",
    damage: 460,
    radius: 1.55
  },
  diamond: {
    name: "Diamond Boost",
    cost: 150,
    image: "../assets/minecraft/tools/diamond.png",
    boost: 1.55
  },
  golem: {
    name: "Iron Golem",
    cost: 200,
    image: "../assets/minecraft/tools/iron-golem.png",
    damage: 145,
    durationMs: 7200
  }
};

const plantOrder = [
  "sunflower",
  "sunshroom",
  "peashooter",
  "repeater",
  "snowpea",
  "threepeater",
  "cattail",
  "cabbagepult",
  "melonpult",
  "cactus",
  "starfruit",
  "fumeshroom",
  "kernelpult",
  "magnetshroom",
  "hypnoshroom",
  "doomshroom",
  "blover",
  "spikeweed",
  "torchwood",
  "wallnut",
  "tallnut",
  "pumpkin",
  "potatomine",
  "chomper",
  "squash",
  "cherrybomb",
  "jalapeno"
];

const plantTypes = {
  sunflower: {
    name: "Sunflower",
    note: "makes sun",
    cost: 50,
    hp: 95,
    image: "../assets/characters/sunflower.png",
    producesSun: true,
    sunEvery: 7200
  },
  sunshroom: {
    name: "Sun-shroom",
    note: "cheap sun",
    cost: 25,
    hp: 70,
    image: "../assets/characters/sun-shroom.png",
    producesSun: true,
    sunEvery: 9800
  },
  peashooter: {
    name: "Peashooter",
    note: "basic shot",
    cost: 100,
    hp: 110,
    image: "../assets/characters/peashooter.png",
    damage: 28,
    fireEvery: 1300
  },
  repeater: {
    name: "Repeater",
    note: "double shot",
    cost: 200,
    hp: 125,
    image: "../assets/characters/repeater.png",
    damage: 25,
    shots: 2,
    fireEvery: 1350
  },
  snowpea: {
    name: "Snow Pea",
    note: "slows mobs",
    cost: 175,
    hp: 115,
    image: "../assets/characters/snow-pea.png",
    damage: 22,
    slowFactor: 0.48,
    slowMs: 2400,
    projectileClass: "snow",
    fireEvery: 1450
  },
  threepeater: {
    name: "Threepeater",
    note: "three lanes",
    cost: 325,
    hp: 130,
    image: "../assets/characters/threepeater.png",
    damage: 22,
    fireEvery: 1600,
    laneSpread: true
  },
  cattail: {
    name: "Cattail",
    note: "tracks mobs",
    cost: 225,
    hp: 115,
    image: "../assets/characters/cattail.png",
    damage: 24,
    fireEvery: 1050,
    homing: true,
    projectileClass: "spike"
  },
  cabbagepult: {
    name: "Cabbage-pult",
    note: "lob shot",
    cost: 150,
    hp: 115,
    image: "../assets/characters/cabbage-pult.png",
    damage: 42,
    fireEvery: 2050,
    lob: true,
    projectileClass: "cabbage"
  },
  melonpult: {
    name: "Melon-pult",
    note: "splash hit",
    cost: 300,
    hp: 130,
    image: "../assets/characters/melon-pult.png",
    damage: 54,
    fireEvery: 2450,
    lob: true,
    splashRadius: 0.82,
    projectileClass: "melon"
  },
  cactus: {
    name: "Cactus",
    note: "spike shot",
    cost: 125,
    hp: 110,
    image: "../assets/characters/cactus.png",
    damage: 24,
    fireEvery: 1150,
    bonusVs: { spider: 1.8 },
    projectileClass: "spike"
  },
  starfruit: {
    name: "Starfruit",
    note: "all lanes",
    cost: 125,
    hp: 105,
    image: "../assets/characters/starfruit.png",
    damage: 18,
    fireEvery: 1550,
    allLaneShot: true,
    projectileClass: "star"
  },
  fumeshroom: {
    name: "Fume-shroom",
    note: "short spray",
    cost: 100,
    hp: 100,
    image: "../assets/characters/fume-shroom.png",
    fumeDamage: 34,
    fumeRange: 3.2,
    fireEvery: 1850
  },
  kernelpult: {
    name: "Kernel-pult",
    note: "butter lob",
    cost: 125,
    hp: 105,
    image: "../assets/characters/kernel-pult.png",
    damage: 28,
    fireEvery: 1850,
    lob: true,
    slowFactor: 0.66,
    slowMs: 900,
    projectileClass: "cabbage"
  },
  magnetshroom: {
    name: "Magnet-shroom",
    note: "weakens metal",
    cost: 100,
    hp: 95,
    image: "../assets/characters/magnet-shroom.png",
    fumeDamage: 22,
    fumeRange: 2.8,
    fireEvery: 2100
  },
  hypnoshroom: {
    name: "Hypno-shroom",
    note: "slow charm",
    cost: 75,
    hp: 75,
    image: "../assets/characters/hypno-shroom.png",
    damage: 12,
    slowFactor: 0.34,
    slowMs: 3200,
    projectileClass: "hypno",
    fireEvery: 2300
  },
  doomshroom: {
    name: "Doom-shroom",
    note: "huge boom",
    cost: 225,
    hp: 1,
    image: "../assets/characters/doom-shroom.png",
    instant: true,
    blastRadius: 2.15,
    damage: 780
  },
  blover: {
    name: "Blover",
    note: "pushes lanes",
    cost: 100,
    hp: 85,
    image: "../assets/characters/blover.png",
    fumeDamage: 18,
    fumeRange: 4.2,
    fireEvery: 1750,
    slowFactor: 0.72,
    slowMs: 1200
  },
  spikeweed: {
    name: "Spikeweed",
    note: "ground spikes",
    cost: 100,
    hp: 160,
    image: "../assets/characters/spikeweed.png",
    fumeDamage: 26,
    fumeRange: 1.4,
    fireEvery: 900
  },
  torchwood: {
    name: "Torchwood",
    note: "fires peas",
    cost: 175,
    hp: 235,
    image: "../assets/characters/torchwood.png",
    torch: true
  },
  wallnut: {
    name: "Wall-nut",
    note: "strong wall",
    cost: 50,
    hp: 460,
    image: "../assets/characters/wall-nut.png"
  },
  tallnut: {
    name: "Tall-nut",
    note: "huge wall",
    cost: 125,
    hp: 760,
    image: "../assets/characters/tall-nut.png"
  },
  pumpkin: {
    name: "Pumpkin",
    note: "shell wall",
    cost: 125,
    hp: 620,
    image: "../assets/characters/pumpkin.png"
  },
  potatomine: {
    name: "Potato Mine",
    note: "arms slowly",
    cost: 25,
    hp: 65,
    image: "../assets/characters/potato-mine.png",
    mine: true,
    armMs: 4300,
    damage: 420
  },
  chomper: {
    name: "Chomper",
    note: "bites close",
    cost: 150,
    hp: 145,
    image: "../assets/characters/chomper.png",
    chompDamage: 260,
    chompRange: 1.15,
    chompEvery: 6200
  },
  squash: {
    name: "Squash",
    note: "jumps once",
    cost: 50,
    hp: 85,
    image: "../assets/characters/squash.png",
    squash: true,
    squashRange: 1.45,
    damage: 520
  },
  cherrybomb: {
    name: "Cherry Bomb",
    note: "area boom",
    cost: 150,
    hp: 1,
    image: "../assets/characters/cherry-bomb.png",
    instant: true,
    blastRadius: 1.45,
    damage: 520
  },
  jalapeno: {
    name: "Jalapeno",
    note: "burns row",
    cost: 125,
    hp: 1,
    image: "../assets/characters/jalapeno.png",
    instant: true,
    rowBlast: true,
    damage: 520
  },
  sunshooter: {
    name: "Sunshooter",
    note: "sun + pea",
    cost: 125,
    hp: 135,
    image: "../assets/fusions/sunshooter.png",
    producesSun: true,
    sunEvery: 9200,
    damage: 24,
    fireEvery: 1250,
    fusion: true
  },
  sunmine: {
    name: "Sun Mine",
    note: "sun trap",
    cost: 85,
    hp: 95,
    image: "../assets/fusions/sun-mine.png",
    producesSun: true,
    sunEvery: 10200,
    mine: true,
    armMs: 3600,
    damage: 430,
    fusion: true
  },
  peanut: {
    name: "Peanut",
    note: "wall shooter",
    cost: 150,
    hp: 540,
    image: "../assets/fusions/peanut.png",
    damage: 22,
    fireEvery: 1350,
    fusion: true
  },
  sunnut: {
    name: "Sun-nut",
    note: "sun wall",
    cost: 125,
    hp: 560,
    image: "../assets/fusions/sun-nut.png",
    producesSun: true,
    sunEvery: 7600,
    fusion: true
  },
  torchthree: {
    name: "Torchthree",
    note: "fire lanes",
    cost: 425,
    hp: 185,
    image: "../assets/fusions/torchthree.png",
    damage: 28,
    fireEvery: 1450,
    laneSpread: true,
    projectileClass: "fire",
    fusion: true
  },
  fumewood: {
    name: "Fumewood",
    note: "fire spray",
    cost: 225,
    hp: 285,
    image: "../assets/fusions/fumewood.png",
    fumeDamage: 45,
    fumeRange: 3.55,
    fireEvery: 1700,
    torch: true,
    fusion: true
  },
  potatoshooter: {
    name: "Potato Shooter",
    note: "armed pea",
    cost: 125,
    hp: 115,
    image: "../assets/fusions/potato-shooter.png",
    damage: 22,
    fireEvery: 1450,
    mine: true,
    armMs: 5200,
    mineDamage: 360,
    fusion: true
  },
  cherrymine: {
    name: "Cherry Mine",
    note: "wide trap",
    cost: 125,
    hp: 90,
    image: "../assets/fusions/cherry-mine.png",
    mine: true,
    armMs: 2600,
    damage: 640,
    mineRadius: 1.45,
    fusion: true
  },
  jalapenomine: {
    name: "Jalapeno Mine",
    note: "row trap",
    cost: 100,
    hp: 90,
    image: "../assets/fusions/jalapeno-mine.png",
    mine: true,
    armMs: 3000,
    damage: 430,
    rowMine: true,
    fusion: true
  },
  scorchwood: {
    name: "Scorchwood",
    note: "fire pea",
    cost: 250,
    hp: 275,
    image: "../assets/fusions/scorchwood.png",
    damage: 34,
    fireEvery: 1280,
    projectileClass: "fire",
    torch: true,
    fusion: true
  },
  cherryshooter: {
    name: "Cherry Shooter",
    note: "splash pea",
    cost: 200,
    hp: 130,
    image: "../assets/fusions/cherry-shooter.png",
    damage: 34,
    fireEvery: 1500,
    splashRadius: 0.68,
    projectileClass: "cherry",
    fusion: true
  },
  cabbagenut: {
    name: "Cabbage-nut",
    note: "lob wall",
    cost: 200,
    hp: 520,
    image: "../assets/fusions/cabbage-nut.png",
    damage: 38,
    fireEvery: 2100,
    lob: true,
    projectileClass: "cabbage",
    fusion: true
  },
  cabbagepot: {
    name: "Cabbage-pot",
    note: "mine pult",
    cost: 175,
    hp: 120,
    image: "../assets/fusions/cabbage-pot.png",
    damage: 34,
    fireEvery: 2200,
    lob: true,
    projectileClass: "cabbage",
    mine: true,
    armMs: 4800,
    mineDamage: 380,
    fusion: true
  },
  chompShooter: {
    name: "Chomp Shooter",
    note: "bite + pea",
    cost: 225,
    hp: 170,
    image: "../assets/fusions/chomp-shooter.png",
    damage: 24,
    fireEvery: 1350,
    chompDamage: 190,
    chompRange: 1.1,
    chompEvery: 5600,
    fusion: true
  },
  cherryChomper: {
    name: "Cherry Chomper",
    note: "bite boom",
    cost: 250,
    hp: 170,
    image: "../assets/fusions/cherry-chomper.png",
    chompDamage: 310,
    chompRange: 1.15,
    chompEvery: 7200,
    chompSplashRadius: 0.86,
    fusion: true
  },
  chillybomb: {
    name: "Chilly Bomb",
    note: "ice boom",
    cost: 200,
    hp: 1,
    image: "../assets/fusions/chilly-bomb.png",
    instant: true,
    blastRadius: 1.6,
    damage: 430,
    slowFactor: 0.42,
    slowMs: 3800,
    fusion: true
  },
  sunbomb: {
    name: "Sun Bomb",
    note: "boom + sun",
    cost: 175,
    hp: 1,
    image: "../assets/fusions/sun-bomb.png",
    instant: true,
    blastRadius: 1.45,
    damage: 480,
    sunBurst: 75,
    fusion: true
  },
  sunpepper: {
    name: "Sun Pepper",
    note: "row + sun",
    cost: 175,
    hp: 1,
    image: "../assets/fusions/sun-pepper.png",
    instant: true,
    rowBlast: true,
    damage: 470,
    sunBurst: 50,
    fusion: true
  },
  sunchomper: {
    name: "Sun Chomper",
    note: "bite + sun",
    cost: 225,
    hp: 165,
    image: "../assets/fusions/sun-chomper.png",
    producesSun: true,
    sunEvery: 9400,
    chompDamage: 230,
    chompRange: 1.15,
    chompEvery: 6100,
    fusion: true
  },
  cactusdrone: {
    name: "Cactus Drone",
    note: "smart spike",
    cost: 200,
    hp: 105,
    image: "../assets/fusions/cactus-drone.png",
    damage: 28,
    fireEvery: 950,
    homing: true,
    projectileClass: "spike",
    bonusVs: { spider: 1.7 },
    fusion: true
  },
  flameTallnut: {
    name: "Flame Tall-nut",
    note: "fire wall",
    cost: 250,
    hp: 860,
    image: "../assets/fusions/flame-tall-nut.png",
    torch: true,
    fusion: true
  },
  butterNut: {
    name: "Butter-nut",
    note: "butter wall",
    cost: 175,
    hp: 620,
    image: "../assets/fusions/butter-nut.png",
    damage: 18,
    fireEvery: 1750,
    lob: true,
    slowFactor: 0.48,
    slowMs: 1400,
    projectileClass: "cabbage",
    fusion: true
  },
  butterPot: {
    name: "Butter Pot",
    note: "butter mine",
    cost: 125,
    hp: 105,
    image: "../assets/fusions/butter-pot.png",
    damage: 26,
    fireEvery: 1900,
    lob: true,
    slowFactor: 0.48,
    slowMs: 1500,
    projectileClass: "cabbage",
    mine: true,
    armMs: 4100,
    mineDamage: 320,
    fusion: true
  },
  popcornPult: {
    name: "Popcorn-pult",
    note: "splash butter",
    cost: 225,
    hp: 125,
    image: "../assets/fusions/popcorn-pult.png",
    damage: 46,
    fireEvery: 2200,
    lob: true,
    splashRadius: 0.72,
    slowFactor: 0.58,
    slowMs: 1000,
    projectileClass: "cabbage",
    fusion: true
  },
  peaShroom: {
    name: "Pea-shroom",
    note: "cheap pea",
    cost: 100,
    hp: 95,
    image: "../assets/fusions/pea-shroom.png",
    producesSun: true,
    sunEvery: 11800,
    damage: 18,
    fireEvery: 1250,
    fusion: true
  },
  flameShroom: {
    name: "Flame-shroom",
    note: "fire mist",
    cost: 175,
    hp: 110,
    image: "../assets/fusions/flame-shroom.png",
    fumeDamage: 42,
    fumeRange: 3.4,
    fireEvery: 1550,
    torch: true,
    fusion: true
  },
  torchweed: {
    name: "Torchweed",
    note: "fire spikes",
    cost: 175,
    hp: 210,
    image: "../assets/fusions/torchweed.png",
    fumeDamage: 36,
    fumeRange: 1.65,
    fireEvery: 850,
    torch: true,
    fusion: true
  },
  scorchWallnut: {
    name: "Scorch Wall-nut",
    note: "burning wall",
    cost: 225,
    hp: 690,
    image: "../assets/fusions/scorch-wall-nut.png",
    torch: true,
    fumeDamage: 24,
    fumeRange: 1.2,
    fireEvery: 1100,
    fusion: true
  },
  scorchedThreepeater: {
    name: "Scorched Threepeater",
    note: "hot lanes",
    cost: 450,
    hp: 155,
    image: "../assets/fusions/scorched-threepeater.png",
    damage: 34,
    fireEvery: 1350,
    laneSpread: true,
    projectileClass: "fire",
    fusion: true
  },
  cherryNut: {
    name: "Cherry-nut",
    note: "boom wall",
    cost: 175,
    hp: 540,
    image: "../assets/fusions/cherry-nut.png",
    fumeDamage: 30,
    fumeRange: 1.4,
    fireEvery: 1800,
    fusion: true
  },
  cherryPumpkin: {
    name: "Cherry Pumpkin",
    note: "shell boom",
    cost: 225,
    hp: 720,
    image: "../assets/fusions/cherry-pumpkin.png",
    fumeDamage: 34,
    fumeRange: 1.5,
    fireEvery: 1700,
    fusion: true
  },
  cherryMagnet: {
    name: "Cherry Magnet",
    note: "metal boom",
    cost: 175,
    hp: 110,
    image: "../assets/fusions/cherry-magnet.png",
    damage: 36,
    fireEvery: 1700,
    splashRadius: 0.75,
    projectileClass: "cherry",
    bonusVs: { armoredskeleton: 1.8 },
    fusion: true
  },
  magnetNut: {
    name: "Magnet-nut",
    note: "metal wall",
    cost: 175,
    hp: 650,
    image: "../assets/fusions/magnet-nut.png",
    fumeDamage: 28,
    fumeRange: 2.2,
    fireEvery: 1700,
    bonusVs: { armoredskeleton: 1.7 },
    fusion: true
  },
  hypnoShooter: {
    name: "Hypnoshooter",
    note: "slow pea",
    cost: 175,
    hp: 105,
    image: "../assets/fusions/hypnoshooter.png",
    damage: 22,
    slowFactor: 0.32,
    slowMs: 3600,
    projectileClass: "hypno",
    fireEvery: 1450,
    fusion: true
  },
  hypnoPepper: {
    name: "Hypno Pepper",
    note: "charm row",
    cost: 175,
    hp: 1,
    image: "../assets/fusions/hypno-pepper.png",
    instant: true,
    rowBlast: true,
    damage: 360,
    slowFactor: 0.3,
    slowMs: 4200,
    fusion: true
  },
  doomCactus: {
    name: "Doom Cactus",
    note: "doom spike",
    cost: 275,
    hp: 115,
    image: "../assets/fusions/doom-cactus.png",
    damage: 58,
    fireEvery: 1500,
    splashRadius: 0.9,
    projectileClass: "spike",
    bonusVs: { spider: 1.8 },
    fusion: true
  },
  doomChomper: {
    name: "Doom Chomper",
    note: "huge bite",
    cost: 300,
    hp: 190,
    image: "../assets/fusions/doom-chomper.png",
    chompDamage: 480,
    chompRange: 1.25,
    chompEvery: 7200,
    chompSplashRadius: 1.25,
    fusion: true
  },
  doomPepper: {
    name: "Doom Pepper",
    note: "doom row",
    cost: 300,
    hp: 1,
    image: "../assets/fusions/doom-pepper.png",
    instant: true,
    rowBlast: true,
    damage: 850,
    fusion: true
  },
  doomBlover: {
    name: "Doom Blover",
    note: "wide storm",
    cost: 275,
    hp: 1,
    image: "../assets/fusions/doom-blover.png",
    instant: true,
    blastRadius: 2.45,
    damage: 650,
    slowFactor: 0.48,
    slowMs: 2600,
    fusion: true
  },
  clovePult: {
    name: "Clove-pult",
    note: "wind lob",
    cost: 200,
    hp: 115,
    image: "../assets/fusions/clove-pult.png",
    damage: 34,
    fireEvery: 1850,
    lob: true,
    slowFactor: 0.66,
    slowMs: 1400,
    projectileClass: "cabbage",
    fusion: true
  },
  luminaStar: {
    name: "Lumina Star",
    note: "sun stars",
    cost: 200,
    hp: 115,
    image: "../assets/fusions/lumina-star.png",
    producesSun: true,
    sunEvery: 9800,
    damage: 20,
    fireEvery: 1450,
    allLaneShot: true,
    projectileClass: "star",
    fusion: true
  },
  cherryBombDrone: {
    name: "Cherry Drone",
    note: "homing boom",
    cost: 250,
    hp: 100,
    image: "../assets/fusions/cherry-bomb-drone.png",
    damage: 42,
    fireEvery: 1250,
    homing: true,
    splashRadius: 0.7,
    projectileClass: "cherry",
    fusion: true
  },
  bambomb: {
    name: "Bambomb",
    note: "fast boom",
    cost: 175,
    hp: 1,
    image: "../assets/fusions/bambomb.png",
    instant: true,
    blastRadius: 1.25,
    damage: 560,
    fusion: true
  }
};

function fusionKey(a, b) {
  return [a, b].sort().join("+");
}

const fusionRecipes = [
  { parts: ["sunflower", "peashooter"], result: "sunshooter", cost: 75 },
  { parts: ["sunflower", "potatomine"], result: "sunmine", cost: 45 },
  { parts: ["wallnut", "peashooter"], result: "peanut", cost: 75 },
  { parts: ["wallnut", "sunflower"], result: "sunnut", cost: 75 },
  { parts: ["torchwood", "threepeater"], result: "torchthree", cost: 125 },
  { parts: ["torchwood", "fumeshroom"], result: "fumewood", cost: 100 },
  { parts: ["potatomine", "peashooter"], result: "potatoshooter", cost: 65 },
  { parts: ["cherrybomb", "potatomine"], result: "cherrymine", cost: 75 },
  { parts: ["jalapeno", "potatomine"], result: "jalapenomine", cost: 70 },
  { parts: ["torchwood", "peashooter"], result: "scorchwood", cost: 95 },
  { parts: ["cherrybomb", "peashooter"], result: "cherryshooter", cost: 95 },
  { parts: ["wallnut", "cabbagepult"], result: "cabbagenut", cost: 80 },
  { parts: ["potatomine", "cabbagepult"], result: "cabbagepot", cost: 80 },
  { parts: ["chomper", "peashooter"], result: "chompShooter", cost: 95 },
  { parts: ["chomper", "cherrybomb"], result: "cherryChomper", cost: 100 },
  { parts: ["snowpea", "cherrybomb"], result: "chillybomb", cost: 100 },
  { parts: ["sunflower", "cherrybomb"], result: "sunbomb", cost: 90 },
  { parts: ["sunflower", "jalapeno"], result: "sunpepper", cost: 90 },
  { parts: ["sunflower", "chomper"], result: "sunchomper", cost: 95 },
  { parts: ["cactus", "cattail"], result: "cactusdrone", cost: 95 },
  { parts: ["tallnut", "torchwood"], result: "flameTallnut", cost: 125 },
  { parts: ["kernelpult", "wallnut"], result: "butterNut", cost: 90 },
  { parts: ["kernelpult", "potatomine"], result: "butterPot", cost: 80 },
  { parts: ["kernelpult", "melonpult"], result: "popcornPult", cost: 110 },
  { parts: ["sunshroom", "peashooter"], result: "peaShroom", cost: 60 },
  { parts: ["sunshroom", "torchwood"], result: "flameShroom", cost: 85 },
  { parts: ["torchwood", "spikeweed"], result: "torchweed", cost: 80 },
  { parts: ["torchwood", "wallnut"], result: "scorchWallnut", cost: 90 },
  { parts: ["threepeater", "jalapeno"], result: "scorchedThreepeater", cost: 150 },
  { parts: ["cherrybomb", "wallnut"], result: "cherryNut", cost: 85 },
  { parts: ["cherrybomb", "pumpkin"], result: "cherryPumpkin", cost: 100 },
  { parts: ["cherrybomb", "magnetshroom"], result: "cherryMagnet", cost: 90 },
  { parts: ["magnetshroom", "wallnut"], result: "magnetNut", cost: 85 },
  { parts: ["hypnoshroom", "peashooter"], result: "hypnoShooter", cost: 85 },
  { parts: ["hypnoshroom", "jalapeno"], result: "hypnoPepper", cost: 90 },
  { parts: ["doomshroom", "cactus"], result: "doomCactus", cost: 125 },
  { parts: ["doomshroom", "chomper"], result: "doomChomper", cost: 140 },
  { parts: ["doomshroom", "jalapeno"], result: "doomPepper", cost: 150 },
  { parts: ["doomshroom", "blover"], result: "doomBlover", cost: 130 },
  { parts: ["blover", "cabbagepult"], result: "clovePult", cost: 90 },
  { parts: ["sunflower", "starfruit"], result: "luminaStar", cost: 90 },
  { parts: ["cattail", "cherrybomb"], result: "cherryBombDrone", cost: 120 },
  { parts: ["squash", "cherrybomb"], result: "bambomb", cost: 95 }
];

const fusionRecipeMap = new Map(fusionRecipes.map((recipe) => [fusionKey(...recipe.parts), recipe]));
const FUSION_DEX_KEY = "blockGardenFusionDex";

const enemyTypes = {
  zombie: {
    label: "Zombie",
    image: "../assets/minecraft/zombie.png",
    hp: 150,
    speed: 19,
    bite: 18,
    biteEvery: 820,
    reward: 15
  },
  skeleton: {
    label: "Skeleton",
    image: "../assets/minecraft/skeleton.png",
    hp: 125,
    speed: 18,
    bite: 13,
    biteEvery: 960,
    range: 3.2,
    rangedDamage: 24,
    reward: 22
  },
  armoredskeleton: {
    label: "Armored Skeleton",
    image: "../assets/minecraft/skeleton.png",
    hp: 230,
    speed: 15,
    bite: 18,
    biteEvery: 880,
    range: 3.4,
    rangedDamage: 32,
    reward: 34,
    armored: true
  },
  witherskeleton: {
    label: "Wither Skeleton",
    image: "../assets/minecraft/wither-skeleton.png",
    hp: 310,
    speed: 17,
    bite: 34,
    biteEvery: 760,
    reward: 48,
    armored: true
  },
  creeper: {
    label: "Creeper",
    image: "../assets/minecraft/creeper.png",
    hp: 170,
    speed: 20,
    bite: 150,
    biteEvery: 1300,
    reward: 25,
    explodes: true
  },
  chargedcreeper: {
    label: "Charged Creeper",
    image: "../assets/minecraft/creeper.png",
    hp: 260,
    speed: 22,
    bite: 220,
    biteEvery: 1120,
    reward: 42,
    explodes: true,
    charged: true
  },
  zombiepigman: {
    label: "Zombie Pigman",
    image: "../assets/minecraft/zombie-pigman.png",
    hp: 260,
    speed: 23,
    bite: 32,
    biteEvery: 640,
    reward: 40
  },
  spider: {
    label: "Spider",
    image: "../assets/minecraft/spider.png",
    hp: 95,
    speed: 35,
    bite: 13,
    biteEvery: 680,
    reward: 24
  },
  slime: {
    label: "Slime",
    image: "../assets/minecraft/slime.png",
    hp: 180,
    speed: 28,
    bite: 16,
    biteEvery: 560,
    reward: 28
  },
  witch: {
    label: "Witch",
    image: "../assets/minecraft/witch.png",
    hp: 340,
    speed: 15,
    bite: 16,
    biteEvery: 1050,
    range: 3.75,
    rangedDamage: 38,
    reward: 55
  },
  blaze: {
    label: "Blaze",
    image: "../assets/minecraft/blaze.png",
    hp: 300,
    speed: 18,
    bite: 30,
    biteEvery: 780,
    range: 3.9,
    rangedDamage: 46,
    reward: 58
  },
  guardian: {
    label: "Guardian",
    image: "../assets/minecraft/guardian.png",
    hp: 420,
    speed: 14,
    bite: 36,
    biteEvery: 820,
    range: 4.15,
    rangedDamage: 54,
    reward: 70,
    armored: true
  },
  ravager: {
    label: "Ravager",
    image: "../assets/minecraft/ravager.png",
    hp: 820,
    speed: 13,
    bite: 42,
    biteEvery: 720,
    reward: 140,
    boss: true
  },
  obsidianravager: {
    label: "Obsidian Ravager",
    image: "../assets/minecraft/ravager.png",
    hp: 1280,
    speed: 11,
    bite: 58,
    biteEvery: 650,
    reward: 210,
    boss: true,
    stompEvery: 5200,
    stompDamage: 34,
    stompRadius: 1.35
  },
  commandravager: {
    label: "Command Ravager",
    image: "../assets/minecraft/ravager.png",
    hp: 1040,
    speed: 12,
    bite: 48,
    biteEvery: 700,
    reward: 230,
    boss: true,
    summonEvery: 6200,
    summonList: ["armoredskeleton", "spider", "chargedcreeper"]
  },
  chargedravager: {
    label: "Charged Ravager",
    image: "../assets/minecraft/ravager.png",
    hp: 1120,
    speed: 15,
    bite: 72,
    biteEvery: 680,
    reward: 250,
    boss: true,
    charged: true,
    deathBlastRadius: 1.85,
    deathBlastDamage: 120
  },
  witherlord: {
    label: "Wither Lord",
    image: "../assets/minecraft/wither-skeleton.png",
    hp: 940,
    speed: 16,
    bite: 34,
    biteEvery: 760,
    range: 4.3,
    rangedDamage: 48,
    reward: 220,
    boss: true,
    summonEvery: 7000,
    summonList: ["witherskeleton", "armoredskeleton"]
  }
};

const terrainMaps = {
  garden: [
    "GGGDGGGGG",
    "GGGGGGGGG",
    "GDGGDGGGG",
    "GGGGGGGGG",
    "GGGGDGGGG"
  ],
  mine: [
    "GGSOGGSGG",
    "GGDGGOMGG",
    "GSGMGGSGG",
    "GGOGDGGGG",
    "GGSGGOMGG"
  ],
  night: [
    "GGMGGSGGG",
    "GGDGGGOGG",
    "GSGMGGSGG",
    "GGOGDGMGG",
    "GGSGGGOGG"
  ],
  fusionlab: [
    "GOGDGGOMG",
    "GGDMGOGGG",
    "GOGGGDMOG",
    "GGGOMGGDG",
    "GMDGGOGGG"
  ]
};

const wavePlans = [
  ["zombie", "zombie", "zombie", "zombie"],
  ["zombie", "skeleton", "zombie", "zombie", "spider"],
  ["zombie", "spider", "skeleton", "creeper", "zombie", "zombie"],
  ["skeleton", "zombie", "spider", "creeper", "skeleton", "zombie", "spider"],
  ["zombie", "zombie", "creeper", "spider", "skeleton", "creeper", "zombie", "spider"],
  ["spider", "skeleton", "zombie", "creeper", "spider", "skeleton", "zombie", "creeper", "zombie"],
  ["zombie", "creeper", "skeleton", "spider", "spider", "creeper", "skeleton", "zombie", "zombie", "creeper"],
  ["skeleton", "skeleton", "spider", "creeper", "zombie", "creeper", "spider", "zombie", "skeleton", "creeper", "spider"],
  ["creeper", "spider", "zombie", "skeleton", "creeper", "creeper", "spider", "zombie", "skeleton", "spider", "creeper", "zombie"],
  ["zombie", "spider", "skeleton", "creeper", "spider", "creeper", "skeleton", "zombie", "creeper", "spider", "skeleton", "creeper", "zombie"]
];

const levelConfigs = {
  garden: {
    name: "Garden",
    terrain: terrainMaps.garden,
    waves: [...wavePlans.slice(0, 5), ["zombie", "spider", "skeleton", "ravager"]]
  },
  mine: {
    name: "Mine Rush",
    terrain: terrainMaps.mine,
    waves: [
      ["zombie", "spider", "zombie", "spider"],
      ["spider", "zombie", "creeper", "zombie", "spider"],
      ["zombie", "creeper", "spider", "skeleton", "spider", "zombie"],
      ["spider", "spider", "creeper", "zombie", "skeleton", "creeper", "spider"],
      ["creeper", "spider", "zombie", "creeper", "spider", "skeleton", "zombie", "spider"],
      ["spider", "creeper", "spider", "skeleton", "creeper", "zombie", "spider", "creeper", "zombie"],
      ["creeper", "creeper", "spider", "zombie", "skeleton", "spider", "creeper", "spider", "zombie", "creeper"],
      ["spider", "creeper", "skeleton", "spider", "creeper", "zombie", "spider", "creeper", "skeleton", "spider", "creeper"],
      ["spider", "creeper", "skeleton", "ravager", "spider", "creeper", "zombie"]
    ]
  },
  night: {
    name: "Night Siege",
    terrain: terrainMaps.night,
    waves: [...wavePlans.slice(0, 9), ["zombie", "spider", "skeleton", "creeper", "ravager", "creeper", "spider", "skeleton"]]
  },
  fusionlab: {
    name: "Fusion Lab",
    terrain: terrainMaps.fusionlab,
    waves: [
      ["zombie", "spider", "armoredskeleton", "zombie"],
      ["spider", "chargedcreeper", "zombiepigman", "armoredskeleton", "slime"],
      ["armoredskeleton", "witch", "chargedcreeper", "spider", "zombiepigman", "armoredskeleton"],
      ["chargedcreeper", "slime", "blaze", "armoredskeleton", "zombiepigman", "spider"],
      ["guardian", "chargedcreeper", "spider", "commandravager", "armoredskeleton", "witch", "slime"],
      ["chargedcreeper", "witherskeleton", "spider", "ravager", "blaze", "witherlord", "armoredskeleton"],
      ["armoredskeleton", "guardian", "obsidianravager", "slime", "chargedcreeper", "zombiepigman", "witch"],
      ["witherlord", "blaze", "armoredskeleton", "commandravager", "guardian", "chargedcreeper", "witherskeleton"],
      ["chargedravager", "guardian", "witherlord", "chargedcreeper", "obsidianravager", "blaze", "commandravager"]
    ]
  }
};

const dom = {
  battlefield: document.querySelector("#battlefield"),
  projectileLayer: document.querySelector("#projectileLayer"),
  fxLayer: document.querySelector("#fxLayer"),
  seedBank: document.querySelector("#seedBank"),
  fusionGuide: document.querySelector("#fusionGuide"),
  modeButtons: Array.from(document.querySelectorAll("[data-mode]")),
  levelButtons: Array.from(document.querySelectorAll("[data-level]")),
  difficultyButtons: Array.from(document.querySelectorAll("[data-difficulty]")),
  toolButtons: Array.from(document.querySelectorAll("[data-tool]")),
  soundButton: document.querySelector("#soundButton"),
  unlockStatus: document.querySelector("#unlockStatus"),
  sunCount: document.querySelector("#sunCount"),
  waveCount: document.querySelector("#waveCount"),
  baseCount: document.querySelector("#baseCount"),
  modeStatus: document.querySelector("#modeStatus"),
  message: document.querySelector("#message"),
  startWaveButton: document.querySelector("#startWaveButton"),
  restartButton: document.querySelector("#restartButton"),
  playAgainButton: document.querySelector("#playAgainButton"),
  endOverlay: document.querySelector("#endOverlay"),
  endKicker: document.querySelector("#endKicker"),
  endTitle: document.querySelector("#endTitle")
};

const state = {
  sun: difficultyConfigs.normal.initialSun,
  base: difficultyConfigs.normal.base,
  wave: 1,
  level: firstUnlockedLevel(),
  mode: "campaign",
  difficulty: "normal",
  selectedPlant: "sunflower",
  selectedTool: null,
  soundOn: false,
  plants: [],
  enemies: [],
  projectiles: [],
  suns: [],
  golems: [],
  tnts: [],
  usedOre: new Set(),
  loadout: [],
  discoveredFusions: loadDiscoveredFusions(),
  pinnedFusionRecipe: null,
  unlockedLevels: loadUnlockedLevels(),
  waveActive: false,
  gameOver: false,
  spawnQueue: [],
  nextSpawnAt: 0,
  nextWaveAutoAt: 0,
  nextWaveCountdown: 0,
  lastFrameAt: performance.now(),
  nextSkySunAt: performance.now() + 4300
};

let tileSize = 0;
let audioContext = null;

function loadUnlockedLevels() {
  try {
    const saved = JSON.parse(localStorage.getItem("blockGardenUnlockedLevels") || "null");
    if (Array.isArray(saved) && saved.length) {
      return new Set(saved.filter((level) => LEVEL_ORDER.includes(level)));
    }
  } catch {
    // Ignore bad local storage and fall back to the first level.
  }
  return new Set(["garden"]);
}

function loadDiscoveredFusions() {
  try {
    const saved = JSON.parse(localStorage.getItem(FUSION_DEX_KEY) || "null");
    if (Array.isArray(saved)) {
      const validResults = new Set(fusionRecipes.map((recipe) => recipe.result));
      return new Set(saved.filter((key) => validResults.has(key)));
    }
  } catch {
    // Ignore bad local storage and start a fresh fusion dex.
  }
  return new Set();
}

function saveDiscoveredFusions() {
  localStorage.setItem(FUSION_DEX_KEY, JSON.stringify(Array.from(state.discoveredFusions)));
}

function saveUnlockedLevels() {
  localStorage.setItem("blockGardenUnlockedLevels", JSON.stringify(Array.from(state.unlockedLevels)));
}

function firstUnlockedLevel() {
  const unlocked = loadUnlockedLevels();
  return LEVEL_ORDER.find((level) => unlocked.has(level)) || "garden";
}

function shuffleList(items) {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function chooseLoadout() {
  const mode = modeConfigs[state.mode];
  if (mode.allPlants) {
    state.loadout = [...plantOrder];
    return;
  }

  const extraSlots = Math.max(0, mode.loadoutSize - 1);
  const candidates = plantOrder.filter((key) => key !== "sunflower");
  state.loadout = ["sunflower", ...shuffleList(candidates).slice(0, extraSlots)];
}

function activePlantKeys() {
  return state.loadout.length ? state.loadout : ["sunflower"];
}

function makeSeedBank() {
  dom.seedBank.innerHTML = "";
  activePlantKeys().forEach((key) => {
    const type = plantTypes[key];
    const card = document.createElement("button");
    card.className = "seed-card";
    card.type = "button";
    card.dataset.plant = key;
    card.innerHTML = `
      <img src="${type.image}" alt="" />
      <span>${type.name}<small>${type.note}</small></span>
      <strong>${type.cost}</strong>
    `;
    card.addEventListener("click", () => {
      state.selectedPlant = key;
      state.selectedTool = null;
      refreshSeedCards();
      refreshToolButtons();
      refreshFusionGuide();
      setMessage(selectionMessage(key));
      playSound("click");
    });
    dom.seedBank.append(card);
  });
}

function makeFusionGuide() {
  if (!dom.fusionGuide) return;
  dom.fusionGuide.innerHTML = "";
  dom.fusionGuide.classList.toggle("is-hidden", !modeConfigs[state.mode].fusion);
  if (!modeConfigs[state.mode].fusion) return;

  fusionRecipes.forEach((recipe) => {
    const [first, second] = recipe.parts;
    const result = plantTypes[recipe.result];
    const item = document.createElement("div");
    item.className = "fusion-recipe";
    item.dataset.first = first;
    item.dataset.second = second;
    item.dataset.result = recipe.result;
    item.dataset.cost = recipe.cost;
    item.dataset.recipe = fusionKey(first, second);
    item.innerHTML = `
      <img src="${plantTypes[first].image}" alt="" />
      <span>+</span>
      <img src="${plantTypes[second].image}" alt="" />
      <span>=</span>
      <img class="fusion-result" src="${result.image}" alt="" />
      <strong>${result.name}<small>${recipe.cost}</small><em>New</em></strong>
    `;
    item.addEventListener("click", () => {
      state.selectedPlant = first;
      state.selectedTool = null;
      state.pinnedFusionRecipe = item.dataset.recipe;
      refreshSeedCards();
      refreshToolButtons();
      refreshFusionGuide();
      setMessage(`Recipe selected: plant ${plantTypes[first].name}, then fuse with ${plantTypes[second].name}.`);
      playSound("click");
    });
    dom.fusionGuide.append(item);
  });
  refreshFusionGuide();
}

function fusionPartnersFor(key) {
  return fusionRecipes
    .filter((recipe) => recipe.parts.includes(key))
    .map((recipe) => recipe.parts.find((part) => part !== key));
}

function fusionRecipesFor(key) {
  return fusionRecipes.filter((recipe) => recipe.parts.includes(key));
}

function selectionMessage(key) {
  const type = plantTypes[key];
  if (!modeConfigs[state.mode].fusion) return `${type.name} selected.`;
  const partners = fusionPartnersFor(key).map((partner) => plantTypes[partner].name);
  if (!partners.length) return `${type.name} selected. No fusion recipe yet.`;
  return `${type.name} selected. Can fuse with ${partners.slice(0, 3).join(", ")}${partners.length > 3 ? "..." : ""}.`;
}

function refreshFusionGuide() {
  if (!dom.fusionGuide || !modeConfigs[state.mode].fusion) return;
  const selectedRecipes = fusionRecipesFor(state.selectedPlant);
  const shouldFilter = selectedRecipes.length > 0;
  Array.from(dom.fusionGuide.querySelectorAll(".fusion-recipe")).forEach((item) => {
    const active = item.dataset.first === state.selectedPlant || item.dataset.second === state.selectedPlant;
    const affordable = state.sun >= Number(item.dataset.cost || 0);
    const pinned = state.pinnedFusionRecipe === item.dataset.recipe;
    const discovered = state.discoveredFusions.has(item.dataset.result);
    item.classList.toggle("is-active", active);
    item.classList.toggle("is-pinned", pinned);
    item.classList.toggle("is-disabled", !affordable);
    item.classList.toggle("is-discovered", discovered);
    item.classList.toggle("is-filtered-out", shouldFilter && !active);
  });
  dom.fusionGuide.dataset.filterPlant = shouldFilter ? plantTypes[state.selectedPlant].name : "";
}

function makeBoard() {
  dom.battlefield.innerHTML = "";
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const terrain = terrainAt(row, col);
      const cell = document.createElement("button");
      cell.className = `cell terrain-${terrain}${col === 0 ? " base-lane" : ""}`;
      cell.type = "button";
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.dataset.terrain = terrain;
      cell.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}`);
      cell.addEventListener("click", () => placePlant(row, col));
      dom.battlefield.append(cell);
    }
  }
  syncTileSize();
}

function terrainAt(row, col) {
  const rowMap = currentLevel().terrain[row] || "";
  return TERRAIN[rowMap[col]] || "grass";
}

function syncTileSize() {
  const rect = dom.battlefield.getBoundingClientRect();
  tileSize = rect.width / COLS;
}

function resetGame() {
  const difficulty = currentDifficulty();
  chooseLoadout();
  state.sun = difficulty.initialSun;
  state.base = difficulty.base;
  state.wave = 1;
  state.selectedPlant = activePlantKeys().includes(state.selectedPlant) ? state.selectedPlant : "sunflower";
  state.selectedTool = null;
  state.plants = [];
  state.enemies = [];
  state.projectiles = [];
  state.suns = [];
  state.golems = [];
  state.tnts = [];
  state.usedOre = new Set();
  state.pinnedFusionRecipe = null;
  state.waveActive = false;
  state.gameOver = false;
  state.spawnQueue = [];
  state.nextSpawnAt = 0;
  state.nextWaveAutoAt = 0;
  state.nextWaveCountdown = 0;
  state.lastFrameAt = performance.now();
  state.nextSkySunAt = performance.now() + 4300;
  dom.projectileLayer.innerHTML = "";
  dom.fxLayer.innerHTML = "";
  dom.endOverlay.classList.add("is-hidden");
  dom.startWaveButton.disabled = false;
  dom.startWaveButton.textContent = "Start Wave";
  const mode = modeConfigs[state.mode];
  setMessage(
    state.mode === "creativefusion"
      ? "Creative Fusion: huge sun, all plants, and every fusion recipe."
      : mode.fusion
      ? "Fusion Mod: plant a recipe part on another plant to fuse them."
      : state.mode === "creative"
        ? "Creative mode: all plants are ready."
        : "New random plant hand. Sunflower is always included."
  );
  makeBoard();
  makeSeedBank();
  makeFusionGuide();
  refreshHud();
  refreshSeedCards();
  refreshToolButtons();
  refreshOptionButtons();
  renderAll();
}

function refreshHud() {
  dom.sunCount.textContent = state.sun;
  dom.waveCount.textContent = `${Math.min(state.wave, currentMaxWaves())}/${currentMaxWaves()}`;
  dom.baseCount.textContent = state.base;
  if (dom.modeStatus) {
    dom.modeStatus.textContent =
      state.mode === "creativefusion"
        ? `Creative Fusion Dex ${state.discoveredFusions.size}/${fusionRecipes.length}`
        : modeConfigs[state.mode].fusion
        ? `Fusion Dex ${state.discoveredFusions.size}/${fusionRecipes.length}`
        : state.mode === "creative"
        ? "All plants, 1500 starting sun."
        : `${activePlantKeys().length} random plants this run.`;
  }
}

function refreshSeedCards() {
  const fusionPartners = new Set(modeConfigs[state.mode].fusion ? fusionPartnersFor(state.selectedPlant) : []);
  const pinnedRecipe = fusionRecipes.find((recipe) => fusionKey(...recipe.parts) === state.pinnedFusionRecipe);
  const pinnedParts = new Set(pinnedRecipe?.parts || []);
  Array.from(dom.seedBank.querySelectorAll(".seed-card")).forEach((card) => {
    const key = card.dataset.plant;
    card.classList.toggle("is-selected", !state.selectedTool && state.selectedPlant === key);
    card.classList.toggle("is-disabled", state.sun < plantTypes[key].cost);
    card.classList.toggle("is-fusion-partner", fusionPartners.has(key));
    card.classList.toggle("is-recipe-part", pinnedParts.has(key));
  });
  refreshFusionGuide();
}

function refreshToolButtons() {
  dom.toolButtons.forEach((button) => {
    const key = button.dataset.tool;
    button.classList.toggle("is-selected", state.selectedTool === key);
    button.classList.toggle("is-disabled", state.sun < toolTypes[key].cost);
  });
  dom.soundButton.classList.toggle("is-on", state.soundOn);
}

function refreshOptionButtons() {
  document.body.dataset.mode = state.mode;
  dom.modeButtons.forEach((button) => {
    button.classList.toggle("is-selected", state.mode === button.dataset.mode);
  });
  dom.levelButtons.forEach((button) => {
    const locked = !levelIsAvailable(button.dataset.level);
    button.classList.toggle("is-selected", state.level === button.dataset.level);
    button.classList.toggle("is-locked", locked);
    button.disabled = locked;
  });
  dom.difficultyButtons.forEach((button) => {
    button.classList.toggle("is-selected", state.difficulty === button.dataset.difficulty);
  });
  if (state.mode === "creative") {
    dom.unlockStatus.textContent = "Creative opens every level for testing.";
  } else if (state.mode === "creativefusion") {
    dom.unlockStatus.textContent = "Creative Fusion opens every level with all recipes and extra sun.";
  } else if (state.mode === "fusion") {
    dom.unlockStatus.textContent = "Fusion opens every level and keeps campaign progress separate.";
  } else {
    const nextLocked = LEVEL_ORDER.find((level) => !state.unlockedLevels.has(level));
    dom.unlockStatus.textContent = nextLocked
      ? `Clear ${levelConfigs[LEVEL_ORDER[LEVEL_ORDER.indexOf(nextLocked) - 1]]?.name || "Garden"} to unlock ${levelConfigs[nextLocked].name}.`
      : "All levels unlocked.";
  }
}

function currentLevel() {
  return levelConfigs[state.level];
}

function currentDifficulty() {
  const difficulty = difficultyConfigs[state.difficulty];
  const mode = modeConfigs[state.mode];
  if (!mode.initialSun) return difficulty;
  return {
    ...difficulty,
    initialSun: mode.initialSun,
    base: mode.base,
    hpMultiplier: difficulty.hpMultiplier * (mode.hpMultiplier || 1),
    speedMultiplier: difficulty.speedMultiplier * (mode.speedMultiplier || 1),
    spawnGapBonus: difficulty.spawnGapBonus + (mode.spawnGapBonus || 0),
    rewardMultiplier: mode.rewardMultiplier || difficulty.rewardMultiplier,
    waveMultiplier: difficulty.waveMultiplier * (mode.waveMultiplier || 1)
  };
}

function currentMaxWaves() {
  return currentLevel().waves.length;
}

function levelIsAvailable(level) {
  return state.mode !== "campaign" || state.unlockedLevels.has(level);
}

function setMessage(text) {
  dom.message.textContent = text;
}

function getPlantAt(row, col) {
  return state.plants.find((plant) => plant.row === row && plant.col === col);
}

function getTntAt(row, col) {
  return state.tnts.find((tnt) => tnt.row === row && tnt.col === col);
}

function placePlant(row, col) {
  if (state.gameOver) return;

  if (state.selectedTool) {
    useToolAt(row, col);
    return;
  }

  const type = plantTypes[state.selectedPlant];
  const terrain = terrainAt(row, col);
  if (terrain === "stone") {
    setMessage("Stone blocks are too hard for plants. Use TNT or another block.");
    playSound("error");
    return;
  }
  const existingPlant = getPlantAt(row, col);
  if (existingPlant) {
    if (tryFusePlant(existingPlant, state.selectedPlant)) {
      return;
    }
    setMessage("That block already has a plant.");
    return;
  }
  if (state.sun < type.cost) {
    setMessage(`Need ${type.cost} sun for ${type.name}.`);
    return;
  }

  state.sun -= type.cost;
  playSound("plant");
  refreshHud();
  refreshSeedCards();

  const now = performance.now();
  const plant = {
    id: crypto.randomUUID(),
    type: state.selectedPlant,
    row,
    col,
    hp: type.hp,
    maxHp: type.hp,
    nextFireAt: now + 650,
    nextSunAt: now + 2200,
    terrain,
    sunEvery: terrain === "dirt" && type.producesSun ? Math.round(type.sunEvery * 0.72) : type.sunEvery,
    armedAt: type.mine ? now + type.armMs : 0,
    nextChompAt: now + 500,
    el: null
  };
  state.plants.push(plant);
  grantOreBonus(row, col);
  renderPlant(plant);

  if (type.instant && type.rowBlast) {
    setMessage("Jalapeno planted. The whole row is about to burn.");
    setTimeout(() => detonateJalapeno(plant), 520);
  } else if (type.instant) {
    setMessage("Cherry Bomb planted. Big boom incoming.");
    setTimeout(() => detonateCherry(plant), 520);
  } else if (type.mine) {
    setMessage("Potato Mine is hiding. It needs a moment to arm.");
  } else {
    setMessage(`${type.name} is ready.`);
  }
}

function tryFusePlant(plant, ingredientKey) {
  if (!modeConfigs[state.mode].fusion) return false;
  const recipe = fusionRecipeMap.get(fusionKey(plant.type, ingredientKey));
  if (!recipe) {
    setMessage("No fusion recipe for those two plants.");
    playSound("error");
    return true;
  }
  if (state.sun < recipe.cost) {
    setMessage(`Need ${recipe.cost} sun to fuse ${plantTypes[recipe.result].name}.`);
    playSound("error");
    return true;
  }

  spendSun(recipe.cost);
  const previousName = plantTypes[plant.type].name;
  const ingredientName = plantTypes[ingredientKey].name;
  const resultType = plantTypes[recipe.result];
  const now = performance.now();
  plant.type = recipe.result;
  plant.maxHp = resultType.hp;
  plant.hp = Math.min(resultType.hp, Math.max(plant.hp, Math.round(resultType.hp * 0.68)));
  plant.nextFireAt = now + 480;
  plant.nextSunAt = now + 1800;
  plant.sunEvery = plant.terrain === "dirt" && resultType.producesSun ? Math.round(resultType.sunEvery * 0.72) : resultType.sunEvery;
  plant.armedAt = resultType.mine ? now + resultType.armMs : 0;
  plant.nextChompAt = now + 500;
  renderPlant(plant);
  fusionAt(plant.col * tileSize + tileSize * 0.5, plant.row * tileSize + tileSize * 0.5);
  const isNewDiscovery = !state.discoveredFusions.has(recipe.result);
  state.discoveredFusions.add(recipe.result);
  saveDiscoveredFusions();
  state.pinnedFusionRecipe = null;
  refreshHud();
  refreshSeedCards();
  refreshFusionGuide();
  setMessage(`${previousName} + ${ingredientName} = ${resultType.name}.`);
  if (isNewDiscovery) {
    setMessage(`New Fusion Dex: ${resultType.name}.`);
  }
  if (resultType.instant && resultType.rowBlast) {
    setTimeout(() => detonateJalapeno(plant), 520);
  } else if (resultType.instant) {
    setTimeout(() => detonateCherry(plant), 520);
  }
  playSound("boost");
  return true;
}

function renderPlant(plant) {
  const cell = getCell(plant.row, plant.col);
  if (!cell) return;

  if (!plant.el) {
    const el = document.createElement("div");
    el.className = `plant ${plant.type}`;
    const img = document.createElement("img");
    img.src = plantTypes[plant.type].image;
    img.alt = "";
    const health = document.createElement("div");
    health.className = "health-bar";
    const fill = document.createElement("div");
    fill.className = "health-fill";
    health.append(fill);
    el.append(img, health);
    plant.el = el;
    cell.append(el);
  }

  plant.el.className = `plant ${plant.type}`;
  const img = plant.el.querySelector("img");
  img.src = plantTypes[plant.type].image;
  const fill = plant.el.querySelector(".health-fill");
  fill.style.width = `${Math.max(0, (plant.hp / plant.maxHp) * 100)}%`;
  fill.style.background = plant.hp < plant.maxHp * 0.35 ? "#c83e35" : "#43a047";
  plant.el.classList.toggle("is-armed", Boolean(plantTypes[plant.type].mine && performance.now() >= plant.armedAt));
  plant.el.classList.toggle("is-boosted", Boolean(plant.boosted));
  plant.el.classList.toggle("is-fusion", Boolean(plantTypes[plant.type].fusion));
}

function getCell(row, col) {
  return dom.battlefield.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function useToolAt(row, col) {
  const tool = toolTypes[state.selectedTool];
  if (!tool) return;
  if (state.sun < tool.cost) {
    setMessage(`Need ${tool.cost} sun for ${tool.name}.`);
    playSound("error");
    return;
  }

  if (state.selectedTool === "diamond") {
    const plant = getPlantAt(row, col);
    if (!plant) {
      setMessage("Diamond Boost needs a plant on that block.");
      playSound("error");
      return;
    }
    if (plant.boosted) {
      setMessage("That plant already has a diamond boost.");
      playSound("error");
      return;
    }
    spendSun(tool.cost);
    plant.boosted = true;
    plant.boost = tool.boost;
    plant.maxHp = Math.round(plant.maxHp * 1.25);
    plant.hp = Math.min(plant.maxHp, Math.round(plant.hp * 1.25));
    renderPlant(plant);
    setMessage("Diamond Boost powered up that plant.");
    playSound("boost");
    return;
  }

  if (state.selectedTool === "tnt") {
    if (getPlantAt(row, col) || getTntAt(row, col)) {
      setMessage("TNT needs an empty block.");
      playSound("error");
      return;
    }
    spendSun(tool.cost);
    placeTnt(row, col);
    grantOreBonus(row, col);
    setMessage("TNT armed. It will explode when a mob steps on it.");
    playSound("plant");
    return;
  }

  if (state.selectedTool === "golem") {
    spendSun(tool.cost);
    deployGolem(row);
    setMessage("Iron Golem is guarding that lane.");
    playSound("golem");
  }
}

function grantOreBonus(row, col) {
  if (terrainAt(row, col) !== "ore") return;
  const key = `${row}:${col}`;
  if (state.usedOre.has(key)) return;
  state.usedOre.add(key);
  state.sun += 50;
  refreshHud();
  refreshSeedCards();
  refreshToolButtons();
  setMessage("Diamond ore gave +50 sun.");
}

function spendSun(amount) {
  state.sun -= amount;
  refreshHud();
  refreshSeedCards();
  refreshToolButtons();
}

function placeTnt(row, col) {
  const tnt = {
    id: crypto.randomUUID(),
    row,
    col,
    el: null
  };
  state.tnts.push(tnt);
  renderTnt(tnt);
}

function renderTnt(tnt) {
  const cell = getCell(tnt.row, tnt.col);
  if (!cell || tnt.el) return;
  const el = document.createElement("div");
  el.className = "tnt-charge";
  el.innerHTML = `<img src="${toolTypes.tnt.image}" alt="" />`;
  tnt.el = el;
  cell.append(el);
}

function triggerTnt(tnt) {
  tnt.dead = true;
  tnt.el?.remove();
  tntBlastAt(tnt.col * tileSize + tileSize * 0.5, tnt.row * tileSize + tileSize * 0.5);
  damageEnemiesAround(tnt.row, tnt.col, toolTypes.tnt.radius, toolTypes.tnt.damage);
  removeDeadEnemies();
  setMessage("TNT exploded.");
  playSound("boom");
}

function startWave() {
  if (state.gameOver || state.waveActive) return;
  state.nextWaveAutoAt = 0;
  state.nextWaveCountdown = 0;
  state.waveActive = true;
  state.spawnQueue = buildSpawnQueue(currentLevel().waves[state.wave - 1]);
  state.nextSpawnAt = performance.now() + 450;
  dom.startWaveButton.disabled = true;
  dom.startWaveButton.textContent = "Wave Running";
  setMessage(`${currentLevel().name} wave ${state.wave} started.`);
  playSound("wave");
}

function buildSpawnQueue(plan) {
  const difficulty = currentDifficulty();
  const targetCount = Math.max(plan.length, Math.ceil(plan.length * (difficulty.waveMultiplier || 1)));
  const queue = [...plan];
  const isFusion = modeConfigs[state.mode].fusion;
  const fusionPool = [
    "armoredskeleton",
    "chargedcreeper",
    "spider",
    "witch",
    "slime",
    "zombiepigman",
    "blaze",
    "witherskeleton",
    "guardian"
  ];
  const normalPool = ["zombie", "skeleton", "spider", "creeper"];
  const pool = isFusion ? fusionPool : normalPool;

  for (let index = queue.length; index < targetCount; index += 1) {
    if (isFusion && state.wave >= 8 && index % 10 === 7) {
      queue.push(index % 20 === 7 ? "commandravager" : "witherlord");
    } else if (isFusion && state.wave >= 6 && index % 8 === 5) {
      queue.push("ravager");
    } else if (index % 5 === 4 && state.wave >= 3) {
      queue.push(isFusion ? "chargedcreeper" : "creeper");
    } else if (index % 4 === 2 && state.wave >= 2) {
      queue.push(isFusion ? "armoredskeleton" : "skeleton");
    } else {
      queue.push(pool[(index + state.wave) % pool.length]);
    }
  }

  return queue;
}

function spawnEnemy(kind, options = {}) {
  const type = enemyTypes[kind];
  const difficulty = currentDifficulty();
  const row = options.row ?? Math.floor(Math.random() * ROWS);
  const bonus = state.wave - 1;
  const hp = Math.round((type.hp + bonus * 20) * difficulty.hpMultiplier * (options.hpScale || 1));
  const now = performance.now();
  const enemy = {
    id: crypto.randomUUID(),
    kind,
    row,
    x: options.x ?? COLS * tileSize + tileSize * 0.18,
    hp,
    maxHp: hp,
    speed: (type.speed + bonus * 1.25) * difficulty.speedMultiplier,
    nextBiteAt: 0,
    nextSpecialAt: now + 1800 + Math.random() * 1400,
    slowUntil: 0,
    slowFactor: 1,
    el: null
  };
  state.enemies.push(enemy);
  renderEnemy(enemy);
}

function renderEnemy(enemy) {
  if (!enemy.el) {
    const type = enemyTypes[enemy.kind];
    const el = document.createElement("div");
    el.className = `enemy ${enemy.kind} has-art`;
    el.innerHTML = `
      <img class="enemy-art" src="${type.image}" alt="" />
      <div class="enemy-head"></div>
      <div class="enemy-body"></div>
      <div class="enemy-leg left"></div>
      <div class="enemy-leg right"></div>
      <div class="health-bar"><div class="health-fill"></div></div>
      <span class="enemy-name">${type.label}</span>
    `;
    const art = el.querySelector(".enemy-art");
    art.addEventListener("error", () => {
      el.classList.remove("has-art");
      art.remove();
    });
    enemy.el = el;
    dom.battlefield.append(el);
  }

  enemy.el.style.left = `${enemy.x}px`;
  enemy.el.style.top = `${enemy.row * tileSize + tileSize * (enemy.kind === "spider" ? 0.18 : 0.04)}px`;
  enemy.el.classList.toggle("is-slowed", enemy.slowUntil > performance.now());
  const fill = enemy.el.querySelector(".health-fill");
  fill.style.width = `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`;
  fill.style.background = enemy.hp < enemy.maxHp * 0.35 ? "#c83e35" : "#43a047";
}

function gameLoop(now) {
  const dt = Math.min(0.05, (now - state.lastFrameAt) / 1000);
  state.lastFrameAt = now;

  if (!state.gameOver) {
    updateSpawning(now);
    updatePlants(now);
    updateGolems(now, dt);
    updateEnemies(now, dt);
    updateProjectiles(dt, now);
    updateSuns(now);
    checkWaveComplete();
    updateAutoWaveCountdown(now);
    renderAll();
  }

  requestAnimationFrame(gameLoop);
}

function updateSpawning(now) {
  if (!state.waveActive || state.spawnQueue.length === 0 || now < state.nextSpawnAt) return;
  spawnEnemy(state.spawnQueue.shift());
  const gap = Math.max(520, 1600 - state.wave * 85 + currentDifficulty().spawnGapBonus);
  state.nextSpawnAt = now + gap;
}

function updatePlants(now) {
  state.plants.forEach((plant) => {
    const type = plantTypes[plant.type];
    if (state.waveActive && type.producesSun && now >= plant.nextSunAt) {
      createSun(plant.col * tileSize + tileSize * 0.55, plant.row * tileSize + tileSize * 0.15, true);
      plant.nextSunAt = now + plant.sunEvery;
    }

    if (type.squash) {
      const target = nearestEnemyInRow(plant.row, plant.col, type.squashRange);
      if (target) {
        target.hp -= boostedValue(plant, type.damage);
        blastAt(target.x + tileSize * 0.32, target.row * tileSize + tileSize * 0.48);
        plant.hp = 0;
        setMessage("Squash flattened a mob.");
      }
    }

    if (type.chompDamage && now >= plant.nextChompAt) {
      const target = nearestEnemyInRow(plant.row, plant.col, type.chompRange);
      if (target) {
        target.hp -= boostedValue(plant, type.chompDamage);
        if (type.chompSplashRadius) {
          damageEnemiesAround(target.row, target.x / tileSize, type.chompSplashRadius, Math.round(boostedValue(plant, type.chompDamage) * 0.45));
        }
        plant.nextChompAt = now + type.chompEvery;
        blastAt(target.x + tileSize * 0.25, target.row * tileSize + tileSize * 0.5);
        setMessage("Chomper took a big bite.");
      }
    }

    if (type.fumeDamage && now >= plant.nextFireAt) {
      const hitCount = fireFume(plant, type);
      if (hitCount) {
        plant.nextFireAt = now + type.fireEvery;
      }
    }

    if (type.damage && type.fireEvery && now >= plant.nextFireAt) {
      fireForPlant(plant, type);
      plant.nextFireAt = now + type.fireEvery;
    }
  });

  removeDeadPlants();
  removeDeadEnemies();
}

function boostedValue(plant, value) {
  return Math.round(value * (plant.boost || 1));
}

function nearestEnemyInRow(row, col, range) {
  return state.enemies
    .filter((enemy) => {
      const enemyCol = enemy.x / tileSize;
      return enemy.row === row && enemyCol >= col - 0.25 && enemyCol <= col + range;
    })
    .sort((a, b) => a.x - b.x)[0];
}

function fireForPlant(plant, type) {
  if (type.homing) {
    const target = nearestEnemyAnywhere(plant.col);
    if (!target) return;
    firePea({
      row: target.row,
      x: plant.col * tileSize + tileSize * 0.62,
      y: plant.row * tileSize + tileSize * 0.38,
      targetY: target.row * tileSize + tileSize * 0.42,
      targetId: target.id,
      damage: boostedValue(plant, type.damage),
      className: type.projectileClass || "pea",
      speed: 330,
      homing: true,
      splashRadius: type.splashRadius,
      bonusVs: type.bonusVs
    });
    return;
  }

  const rows = type.allLaneShot
    ? Array.from({ length: ROWS }, (_, row) => row)
    : type.laneSpread
      ? [plant.row - 1, plant.row, plant.row + 1]
      : [plant.row];
  rows
    .filter((row) => row >= 0 && row < ROWS)
    .forEach((targetRow) => {
      const hasTarget = state.enemies.some((enemy) => enemy.row === targetRow && enemy.x > plant.col * tileSize);
      if (!hasTarget) return;
      const shots = type.shots || 1;
      const laneOffset = targetRow - plant.row;
      for (let index = 0; index < shots; index += 1) {
        firePea({
          row: targetRow,
          x: plant.col * tileSize + tileSize * (0.66 - index * 0.1),
          y: plant.row * tileSize + tileSize * (0.42 + laneOffset * 0.12 + index * 0.06),
          targetY: targetRow * tileSize + tileSize * 0.42,
          damage: boostedValue(plant, type.damage),
          slowFactor: type.slowFactor,
          slowMs: type.slowMs,
          className: type.projectileClass || "pea",
          lob: type.lob,
          splashRadius: type.splashRadius,
          bonusVs: type.bonusVs,
          speed: type.lob ? 215 : 285
        });
      }
    });
}

function firePea(config) {
  const projectile = {
    id: crypto.randomUUID(),
    row: config.row,
    x: config.x,
    y: config.y,
    targetY: config.targetY ?? config.y,
    speed: config.speed || 285,
    damage: config.damage,
    slowFactor: config.slowFactor || 1,
    slowMs: config.slowMs || 0,
    targetId: config.targetId,
    homing: Boolean(config.homing),
    lob: Boolean(config.lob),
    splashRadius: config.splashRadius || 0,
    bonusVs: config.bonusVs,
    className: config.className,
    el: null
  };
  state.projectiles.push(projectile);
  renderProjectile(projectile);
}

function nearestEnemyAnywhere(col) {
  const minX = col * tileSize;
  return state.enemies
    .filter((enemy) => enemy.x > minX)
    .sort((a, b) => a.x - b.x)[0];
}

function fireFume(plant, type) {
  const originX = plant.col * tileSize + tileSize * 0.58;
  const targets = state.enemies.filter((enemy) => {
    if (enemy.row !== plant.row) return false;
    const enemyCol = enemy.x / tileSize;
    return enemyCol >= plant.col && enemyCol <= plant.col + type.fumeRange;
  });
  if (!targets.length) return 0;

  targets.forEach((enemy) => {
    enemy.hp -= boostedValue(plant, type.fumeDamage);
  });
  sprayAt(originX, plant.row * tileSize + tileSize * 0.38, type.fumeRange * tileSize);
  playSound("hit");
  return targets.length;
}

function renderProjectile(projectile) {
  if (!projectile.el) {
    const el = document.createElement("div");
    el.className = `projectile ${projectile.className}`;
    projectile.el = el;
    dom.projectileLayer.append(el);
  }
  projectile.el.className = `projectile ${projectile.className}${projectile.lob ? " is-lob" : ""}`;
  projectile.el.style.left = `${projectile.x}px`;
  projectile.el.style.top = `${projectile.y}px`;
}

function deployGolem(row) {
  const golem = {
    id: crypto.randomUUID(),
    row,
    x: -tileSize * 0.8,
    speed: 88,
    damage: toolTypes.golem.damage,
    expiresAt: performance.now() + toolTypes.golem.durationMs,
    nextHitAt: 0,
    el: null
  };
  state.golems.push(golem);
  renderGolem(golem);
}

function updateGolems(now, dt) {
  state.golems.forEach((golem) => {
    golem.x += golem.speed * dt;
    const hit = state.enemies.find((enemy) => {
      return enemy.row === golem.row && Math.abs(enemy.x - golem.x) < tileSize * 0.5;
    });
    if (hit && now >= golem.nextHitAt) {
      hit.hp -= golem.damage;
      golem.nextHitAt = now + 520;
      blastAt(hit.x + tileSize * 0.25, hit.row * tileSize + tileSize * 0.52);
      playSound("hit");
    }
    if (now >= golem.expiresAt || golem.x > COLS * tileSize + tileSize) {
      golem.dead = true;
    }
  });

  state.golems = state.golems.filter((golem) => {
    if (!golem.dead) return true;
    golem.el?.remove();
    return false;
  });
  removeDeadEnemies();
}

function renderGolem(golem) {
  if (!golem.el) {
    const el = document.createElement("div");
    el.className = "golem";
    el.innerHTML = `<img src="${toolTypes.golem.image}" alt="" />`;
    golem.el = el;
    dom.fxLayer.append(el);
  }
  golem.el.style.left = `${golem.x}px`;
  golem.el.style.top = `${golem.row * tileSize - tileSize * 0.03}px`;
}

function updateEnemies(now, dt) {
  state.enemies.forEach((enemy) => {
    const type = enemyTypes[enemy.kind];
    const enemyCol = Math.floor((enemy.x + tileSize * 0.26) / tileSize);
    const tnt = getTntAt(enemy.row, enemyCol);
    if (tnt) {
      triggerTnt(tnt);
      return;
    }
    updateEnemySpecial(enemy, type, enemyCol, now);

    const blocker = state.plants.find((plant) => plant.row === enemy.row && plant.col === enemyCol);
    const mine = blocker && plantTypes[blocker.type].mine ? blocker : null;

    if (mine && now >= mine.armedAt) {
      const mineType = plantTypes[mine.type];
      blastAt(enemy.x + tileSize * 0.28, enemy.row * tileSize + tileSize * 0.48);
      if (mineType.rowMine) {
        rowBlastAt(enemy.row);
        state.enemies.forEach((rowEnemy) => {
          if (rowEnemy.row === enemy.row) {
            rowEnemy.hp -= mineType.damage;
          }
        });
      } else {
        damageEnemiesAround(enemy.row, enemyCol, mineType.mineRadius || 1.05, mineType.mineDamage || mineType.damage);
      }
      mine.hp = 0;
      setMessage(`${mineType.name} popped.`);
      return;
    }

    const rangedTarget = findRangedTarget(enemy, type);
    if (!blocker && rangedTarget) {
      if (now >= enemy.nextBiteAt) {
        rangedTarget.hp -= type.rangedDamage;
        enemy.nextBiteAt = now + type.biteEvery;
      }
      return;
    }

    if (blocker) {
      if (now >= enemy.nextBiteAt) {
        blocker.hp -= type.bite;
        enemy.nextBiteAt = now + type.biteEvery;

        if (type.explodes) {
          blastAt(enemy.x + tileSize * 0.32, enemy.row * tileSize + tileSize * 0.48);
          damagePlantsAround(enemy.row, enemyCol, 1.2, type.bite);
          enemy.hp = 0;
          setMessage("Creeper exploded.");
          playSound("boom");
        }
      }
    } else {
      const slow = enemy.slowUntil > now ? enemy.slowFactor : 1;
      const terrainSlow = terrainAt(enemy.row, Math.max(0, Math.min(COLS - 1, enemyCol))) === "mud" ? 0.72 : 1;
      enemy.x -= enemy.speed * slow * terrainSlow * dt;
    }

    if (enemy.x < -tileSize * 0.5) {
      enemy.hp = 0;
      enemy.noReward = true;
      if (type.explodes) {
        blastAt(tileSize * 0.3, enemy.row * tileSize + tileSize * 0.48);
        state.base -= 2;
        setMessage("A Creeper exploded at the base.");
        playSound("boom");
      } else {
        state.base -= 1;
        setMessage("A mob reached the base.");
      }
      refreshHud();
      if (state.base <= 0) {
        endGame(false);
      }
    }
  });

  removeDeadPlants();
  removeDeadTnts();
  removeDeadEnemies();
}

function updateEnemySpecial(enemy, type, enemyCol, now) {
  if (!type.boss || now < enemy.nextSpecialAt) return;

  if (type.stompEvery) {
    rowBlastAt(enemy.row);
    damagePlantsAround(enemy.row, enemyCol, type.stompRadius || 1.15, type.stompDamage || 28);
    enemy.nextSpecialAt = now + type.stompEvery;
    setMessage(`${type.label} stomped the lane.`);
    playSound("boom");
    return;
  }

  if (type.summonEvery && type.summonList?.length) {
    const summonKind = type.summonList[Math.floor(Math.random() * type.summonList.length)];
    const summonRow = Math.max(0, Math.min(ROWS - 1, enemy.row + [-1, 0, 1][Math.floor(Math.random() * 3)]));
    spawnEnemy(summonKind, { row: summonRow, hpScale: 0.72 });
    enemy.nextSpecialAt = now + type.summonEvery;
    setMessage(`${type.label} called reinforcements.`);
    playSound("wave");
  }
}

function findRangedTarget(enemy, type) {
  if (!type.range) return null;
  return state.plants
    .filter((plant) => {
      if (plant.row !== enemy.row) return false;
      const plantX = plant.col * tileSize + tileSize * 0.5;
      const distance = enemy.x - plantX;
      return distance > tileSize * 0.55 && distance <= type.range * tileSize;
    })
    .sort((a, b) => b.col - a.col)[0];
}

function updateProjectiles(dt, now) {
  state.projectiles.forEach((projectile) => {
    if (projectile.homing) {
      const target = state.enemies.find((enemy) => enemy.id === projectile.targetId && enemy.hp > 0) || nearestEnemyAnywhere(0);
      if (target) {
        projectile.row = target.row;
        projectile.targetY = target.row * tileSize + tileSize * 0.42;
      }
    }

    projectile.x += projectile.speed * dt;
    projectile.y += (projectile.targetY - projectile.y) * Math.min(1, dt * 7);
    igniteProjectile(projectile);
    const hit = state.enemies.find((enemy) => {
      if (enemy.row !== projectile.row) return false;
      return projectile.x > enemy.x && projectile.x < enemy.x + tileSize * 0.72;
    });
    if (hit) {
      const bonus = projectile.bonusVs?.[hit.kind] || 1;
      const damage = Math.round(projectile.damage * bonus);
      if (projectile.splashRadius) {
        damageEnemiesAround(hit.row, hit.x / tileSize, projectile.splashRadius, damage);
        blastAt(hit.x + tileSize * 0.28, hit.row * tileSize + tileSize * 0.46);
      } else {
        hit.hp -= damage;
      }
      hitSparkAt(hit.x + tileSize * 0.3, hit.row * tileSize + tileSize * 0.44, projectile.className);
      if (projectile.slowMs) {
        hit.slowUntil = now + projectile.slowMs;
        hit.slowFactor = projectile.slowFactor;
      }
      projectile.dead = true;
    }
    if (projectile.x > COLS * tileSize + 60) {
      projectile.dead = true;
    }
  });

  state.projectiles = state.projectiles.filter((projectile) => {
    if (!projectile.dead) return true;
    projectile.el?.remove();
    return false;
  });
  removeDeadEnemies();
}

function igniteProjectile(projectile) {
  if (projectile.fireBoosted || projectile.className === "fire") return;
  const torch = state.plants.find((plant) => {
    if (plant.row !== projectile.row || !plantTypes[plant.type].torch) return false;
    const torchX = plant.col * tileSize + tileSize * 0.48;
    return projectile.x >= torchX && projectile.x <= torchX + tileSize * 0.34;
  });
  if (!torch) return;

  projectile.fireBoosted = true;
  projectile.damage = Math.round(projectile.damage * 1.65);
  projectile.className = "fire";
  renderProjectile(projectile);
}

function createSun(x, y, fromPlant = false) {
  const now = performance.now();
  const sun = {
    id: crypto.randomUUID(),
    x,
    y,
    targetY: fromPlant ? y + tileSize * 0.38 : y + tileSize * 1.25,
    bornAt: now,
    autoCollectAt: now + (fromPlant ? 900 : 1300),
    el: document.createElement("button")
  };
  sun.el.className = "sun-token";
  sun.el.type = "button";
  sun.el.setAttribute("aria-label", "Collect sun");
  sun.el.addEventListener("click", () => collectSun(sun.id));
  state.suns.push(sun);
  dom.fxLayer.append(sun.el);
}

function updateSuns(now) {
  if (state.waveActive && now >= state.nextSkySunAt) {
    createSun(tileSize * (1 + Math.random() * 6.8), -20, false);
    state.nextSkySunAt = now + 5600 + Math.random() * 2400;
  }

  state.suns.forEach((sun) => {
    if (sun.y < sun.targetY) {
      sun.y += 42 / 60;
    }
    if (now >= sun.autoCollectAt) {
      collectSun(sun.id, true);
    } else if (now - sun.bornAt > 10500) {
      collectSun(sun.id, true);
    }
  });

  state.suns = state.suns.filter((sun) => {
    if (!sun.dead) return true;
    sun.el.remove();
    return false;
  });
}

function collectSun(id, silent = false) {
  const sun = state.suns.find((item) => item.id === id);
  if (!sun) return;
  sun.dead = true;
  state.sun += SUN_VALUE;
  refreshHud();
  refreshSeedCards();
  refreshToolButtons();
  if (!silent) {
    setMessage(`Collected ${SUN_VALUE} sun.`);
  }
}

function detonateCherry(plant) {
  if (state.gameOver) return;
  const type = plantTypes[plant.type];
  const row = plant.row;
  const col = plant.col;
  blastAt(col * tileSize + tileSize * 0.5, row * tileSize + tileSize * 0.5);
  damageEnemiesAround(row, col, type.blastRadius || plantTypes.cherrybomb.blastRadius, type.damage || plantTypes.cherrybomb.damage);
  if (type.slowMs) {
    slowEnemiesAround(row, col, type.blastRadius || plantTypes.cherrybomb.blastRadius, type.slowMs, type.slowFactor || 0.5);
  }
  grantSunBurst(type.sunBurst);
  plant.hp = 0;
  removeDeadPlants();
  removeDeadEnemies();
  setMessage(`${type.name} cleared nearby blocks.`);
}

function detonateJalapeno(plant) {
  if (state.gameOver) return;
  const type = plantTypes[plant.type];
  rowBlastAt(plant.row);
  state.enemies.forEach((enemy) => {
    if (enemy.row === plant.row) {
      enemy.hp -= type.damage || plantTypes.jalapeno.damage;
      if (type.slowMs) {
        enemy.slowUntil = performance.now() + type.slowMs;
        enemy.slowFactor = type.slowFactor || 0.5;
      }
    }
  });
  grantSunBurst(type.sunBurst);
  plant.hp = 0;
  removeDeadPlants();
  removeDeadEnemies();
  setMessage(`${type.name} burned a whole row.`);
}

function damageEnemiesAround(row, col, radius, damage) {
  state.enemies.forEach((enemy) => {
    const enemyCol = enemy.x / tileSize;
    const distance = Math.hypot(enemy.row - row, enemyCol - col);
    if (distance <= radius) {
      enemy.hp -= damage;
    }
  });
}

function damagePlantsAround(row, col, radius, damage) {
  state.plants.forEach((plant) => {
    const distance = Math.hypot(plant.row - row, plant.col - col);
    if (distance <= radius) {
      plant.hp -= damage;
    }
  });
}

function slowEnemiesAround(row, col, radius, slowMs, slowFactor) {
  const now = performance.now();
  state.enemies.forEach((enemy) => {
    const enemyCol = enemy.x / tileSize;
    const distance = Math.hypot(enemy.row - row, enemyCol - col);
    if (distance <= radius) {
      enemy.slowUntil = now + slowMs;
      enemy.slowFactor = slowFactor;
    }
  });
}

function grantSunBurst(amount) {
  if (!amount) return;
  state.sun += amount;
  refreshHud();
  refreshSeedCards();
  refreshToolButtons();
}

function blastAt(x, y) {
  const el = document.createElement("div");
  el.className = "explosion";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  dom.fxLayer.append(el);
  setTimeout(() => el.remove(), 540);
}

function tntBlastAt(x, y) {
  const el = document.createElement("div");
  el.className = "tnt-blast";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  dom.fxLayer.append(el);
  setTimeout(() => el.remove(), 660);
}

function fusionAt(x, y) {
  const el = document.createElement("div");
  el.className = "fusion-burst";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  dom.fxLayer.append(el);
  setTimeout(() => el.remove(), 640);
}

function hitSparkAt(x, y, kind = "pea") {
  const el = document.createElement("div");
  el.className = `hit-spark ${kind}`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  dom.fxLayer.append(el);
  setTimeout(() => el.remove(), 360);
}

function sprayAt(x, y, width) {
  const el = document.createElement("div");
  el.className = "fume-spray";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${width}px`;
  dom.fxLayer.append(el);
  setTimeout(() => el.remove(), 420);
}

function rowBlastAt(row) {
  const el = document.createElement("div");
  el.className = "row-blast";
  el.style.top = `${row * tileSize}px`;
  dom.fxLayer.append(el);
  setTimeout(() => el.remove(), 580);
}

function removeDeadPlants() {
  state.plants = state.plants.filter((plant) => {
    if (plant.hp > 0) return true;
    plant.el?.remove();
    return false;
  });
}

function removeDeadTnts() {
  state.tnts = state.tnts.filter((tnt) => !tnt.dead);
}

function removeDeadEnemies() {
  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.hp > 0) return true;
    enemy.el?.remove();
    const type = enemyTypes[enemy.kind];
    if (!enemy.noReward && type.deathBlastRadius) {
      const enemyCol = enemy.x / tileSize;
      blastAt(enemy.x + tileSize * 0.3, enemy.row * tileSize + tileSize * 0.48);
      damagePlantsAround(enemy.row, enemyCol, type.deathBlastRadius, type.deathBlastDamage || type.bite);
      setMessage(`${type.label} exploded on defeat.`);
      playSound("boom");
    }
    const reward = enemy.noReward ? 0 : Math.round(type.reward * currentDifficulty().rewardMultiplier);
    if (reward && !state.gameOver) {
      state.sun += reward;
      refreshHud();
      refreshSeedCards();
    }
    return false;
  });
}

function checkWaveComplete() {
  if (!state.waveActive || state.spawnQueue.length || state.enemies.length) return;

  if (state.wave >= currentMaxWaves()) {
    endGame(true);
    return;
  }

  state.wave += 1;
  state.waveActive = false;
  state.nextWaveAutoAt = performance.now() + 3000;
  state.nextWaveCountdown = 3;
  dom.startWaveButton.disabled = true;
  dom.startWaveButton.textContent = "Next Wave 3";
  refreshHud();
  setMessage(`Wave cleared. Next wave starts in 3.`);
}

function updateAutoWaveCountdown(now) {
  if (!state.nextWaveAutoAt || state.waveActive || state.gameOver) return;
  const remaining = Math.max(0, Math.ceil((state.nextWaveAutoAt - now) / 1000));
  if (remaining !== state.nextWaveCountdown) {
    state.nextWaveCountdown = remaining;
    dom.startWaveButton.textContent = remaining > 0 ? `Next Wave ${remaining}` : "Starting";
    if (remaining > 0) {
      setMessage(`Wave ${state.wave} starts in ${remaining}.`);
    }
  }
  if (now >= state.nextWaveAutoAt) {
    state.nextWaveAutoAt = 0;
    state.nextWaveCountdown = 0;
    startWave();
  }
}

function endGame(won) {
  state.gameOver = true;
  if (won) {
    unlockNextLevel();
  }
  dom.endKicker.textContent = won ? "Victory" : "Game over";
  dom.endTitle.textContent = won ? "Lucas defended the garden." : "The base fell.";
  dom.endOverlay.classList.remove("is-hidden");
  dom.startWaveButton.disabled = true;
  refreshOptionButtons();
}

function unlockNextLevel() {
  if (state.mode !== "campaign") return;
  const index = LEVEL_ORDER.indexOf(state.level);
  const nextLevel = LEVEL_ORDER[index + 1];
  if (!nextLevel || state.unlockedLevels.has(nextLevel)) return;
  state.unlockedLevels.add(nextLevel);
  saveUnlockedLevels();
  setMessage(`${levelConfigs[nextLevel].name} unlocked.`);
}

function renderAll() {
  state.plants.forEach(renderPlant);
  state.tnts.forEach(renderTnt);
  state.enemies.forEach(renderEnemy);
  state.projectiles.forEach(renderProjectile);
  state.golems.forEach(renderGolem);
  state.suns.forEach((sun) => {
    sun.el.style.left = `${sun.x}px`;
    sun.el.style.top = `${sun.y}px`;
  });
}

function ensureAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playSound(kind) {
  if (!state.soundOn) return;
  ensureAudio();
  const sounds = {
    click: [380, 0.035],
    plant: [520, 0.055],
    wave: [220, 0.1],
    boom: [90, 0.16],
    boost: [760, 0.11],
    golem: [160, 0.14],
    hit: [130, 0.05],
    error: [120, 0.08]
  };
  const [frequency, duration] = sounds[kind] || sounds.click;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = kind === "boom" ? "sawtooth" : "square";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration + 0.02);
}

dom.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    if (modeConfigs[state.mode].fusion) {
      state.level = "fusionlab";
    } else if (!levelIsAvailable(state.level)) {
      state.level = firstUnlockedLevel();
    }
    resetGame();
    setMessage(`${modeConfigs[state.mode].name} mode selected.`);
    playSound("click");
  });
});

dom.levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!levelIsAvailable(button.dataset.level)) {
      setMessage("Clear the previous level first.");
      playSound("error");
      return;
    }
    state.level = button.dataset.level;
    resetGame();
    setMessage(`${currentLevel().name} selected.`);
    playSound("click");
  });
});

dom.difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.difficulty = button.dataset.difficulty;
    resetGame();
    setMessage(`${button.textContent} difficulty selected.`);
    playSound("click");
  });
});

dom.toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.tool;
    state.selectedTool = state.selectedTool === key ? null : key;
    refreshSeedCards();
    refreshToolButtons();
    const tool = toolTypes[key];
    setMessage(state.selectedTool ? `${tool.name} selected. Click a block.` : "Pick a plant, then click a grass block.");
    playSound("click");
  });
});

dom.soundButton.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  refreshToolButtons();
  if (state.soundOn) {
    ensureAudio();
    playSound("boost");
  }
});

dom.startWaveButton.addEventListener("click", startWave);
dom.restartButton.addEventListener("click", resetGame);
dom.playAgainButton.addEventListener("click", resetGame);

window.addEventListener("resize", () => {
  syncTileSize();
  renderAll();
});

resetGame();
requestAnimationFrame(gameLoop);
