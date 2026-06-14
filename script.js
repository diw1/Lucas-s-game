const plants = [
  {
    name: "Peashooter",
    icon: "pea",
    color: "#62b94d",
    accent: "#2f8b57",
    tags: ["shoots", "green", "day", "common"],
    clues: ["I shoot one green pea.", "I am one of the first plants.", "I have a round pea mouth."]
  },
  {
    name: "Sunflower",
    icon: "sun",
    color: "#f5c84c",
    accent: "#8fb83f",
    tags: ["sun", "yellow", "day", "common"],
    clues: ["I help make sunshine.", "I have yellow petals.", "I smile at the lawn."]
  },
  {
    name: "Cherry Bomb",
    icon: "bomb",
    color: "#d94b45",
    accent: "#7b2f31",
    tags: ["explodes", "red", "day", "instant"],
    clues: ["I am two red fruits.", "I make a big boom.", "I disappear after helping."]
  },
  {
    name: "Wall-nut",
    icon: "nut",
    color: "#b9824b",
    accent: "#704323",
    tags: ["blocks", "brown", "day", "common"],
    clues: ["I am very tough.", "Zombies chew on me.", "I look like a big nut."]
  },
  {
    name: "Potato Mine",
    icon: "mine",
    color: "#9c6a3d",
    accent: "#d94b45",
    tags: ["explodes", "brown", "day", "instant"],
    clues: ["I hide in the ground.", "I need a little time to wake up.", "I pop up with a boom."]
  },
  {
    name: "Snow Pea",
    icon: "pea",
    color: "#8fd4e8",
    accent: "#3d7ea1",
    tags: ["shoots", "blue", "day", "cold"],
    clues: ["My peas are chilly.", "I slow zombies down.", "I am a cool blue shooter."]
  },
  {
    name: "Chomper",
    icon: "chomp",
    color: "#7d4bb3",
    accent: "#3c225f",
    tags: ["eats", "purple", "day", "bite"],
    clues: ["I have a giant mouth.", "I can gulp one zombie.", "I need time to chew."]
  },
  {
    name: "Repeater",
    icon: "doublepea",
    color: "#56a646",
    accent: "#1f6336",
    tags: ["shoots", "green", "day", "pea"],
    clues: ["I shoot two peas at a time.", "I look like a stronger Peashooter.", "I am green and busy."]
  },
  {
    name: "Puff-shroom",
    icon: "mushroom",
    color: "#b291d1",
    accent: "#65468f",
    tags: ["mushroom", "purple", "night", "short"],
    clues: ["I am tiny and free.", "I work at night.", "I puff at close zombies."]
  },
  {
    name: "Sun-shroom",
    icon: "mushroom",
    color: "#ffd86e",
    accent: "#9a7b25",
    tags: ["mushroom", "sun", "yellow", "night"],
    clues: ["I am a mushroom that makes sun.", "I start little and grow bigger.", "I like night levels."]
  },
  {
    name: "Fume-shroom",
    icon: "fume",
    color: "#8b6fc5",
    accent: "#4f3a80",
    tags: ["mushroom", "purple", "night", "pierces"],
    clues: ["My smoke goes through screen doors.", "I am a purple mushroom.", "I attack in a short line."]
  },
  {
    name: "Hypno-shroom",
    icon: "swirl",
    color: "#cf6ec7",
    accent: "#6b2f79",
    tags: ["mushroom", "purple", "night", "trick"],
    clues: ["I make a zombie change teams.", "I have a swirly look.", "I vanish after one bite."]
  },
  {
    name: "Scaredy-shroom",
    icon: "mushroom",
    color: "#cfbfdc",
    accent: "#6b5184",
    tags: ["mushroom", "purple", "night", "shy"],
    clues: ["I shoot far away.", "I hide when zombies get close.", "I am a nervous night plant."]
  },
  {
    name: "Ice-shroom",
    icon: "snow",
    color: "#9adcf0",
    accent: "#477dba",
    tags: ["mushroom", "blue", "night", "cold"],
    clues: ["I freeze the whole screen.", "I am a chilly mushroom.", "I work best after coffee in the day."]
  },
  {
    name: "Doom-shroom",
    icon: "doom",
    color: "#5d4b68",
    accent: "#e6c25d",
    tags: ["mushroom", "explodes", "night", "instant"],
    clues: ["My boom is huge.", "I leave a crater.", "I am a very serious mushroom."]
  },
  {
    name: "Grave Buster",
    icon: "chomp",
    color: "#6f4f7d",
    accent: "#2f233b",
    tags: ["grave", "purple", "night", "instant"],
    clues: ["I eat graves.", "I only works on graves.", "I helps clear night lawns."]
  },
  {
    name: "Lily Pad",
    icon: "lily",
    color: "#4fbf8a",
    accent: "#f2df62",
    tags: ["water", "green", "support", "pool"],
    clues: ["I float on water.", "Other plants can sit on me.", "I live in the pool."]
  },
  {
    name: "Squash",
    icon: "squash",
    color: "#77a848",
    accent: "#3f6b2f",
    tags: ["squashes", "green", "day", "instant"],
    clues: ["I jump and flatten zombies.", "I look grumpy.", "I only attack once."]
  },
  {
    name: "Threepeater",
    icon: "triplepea",
    color: "#5db94f",
    accent: "#266b3f",
    tags: ["shoots", "green", "day", "pea"],
    clues: ["I shoot in three lanes.", "I have three pea heads.", "I cover above, middle, and below."]
  },
  {
    name: "Tangle Kelp",
    icon: "kelp",
    color: "#287b6a",
    accent: "#155145",
    tags: ["water", "green", "pool", "instant"],
    clues: ["I pull a zombie under water.", "I live in the pool.", "I look like seaweed."]
  },
  {
    name: "Jalapeno",
    icon: "pepper",
    color: "#d64231",
    accent: "#5b9f3f",
    tags: ["explodes", "red", "fire", "instant"],
    clues: ["I clear one whole row.", "I am a hot red pepper.", "I leave fire behind."]
  },
  {
    name: "Spikeweed",
    icon: "spike",
    color: "#4b8a4d",
    accent: "#2b5730",
    tags: ["spikes", "green", "ground", "day"],
    clues: ["I sit on the ground.", "Zombies step on my spikes.", "I can pop tires."]
  },
  {
    name: "Torchwood",
    icon: "torch",
    color: "#8a5b36",
    accent: "#f28d36",
    tags: ["fire", "brown", "support", "pea"],
    clues: ["I turn peas into fireballs.", "I am a wooden stump.", "I help pea shooters hit harder."]
  },
  {
    name: "Tall-nut",
    icon: "tallnut",
    color: "#b9824b",
    accent: "#704323",
    tags: ["blocks", "brown", "tall", "day"],
    clues: ["I am taller than Wall-nut.", "Pole vaulters cannot jump over me.", "I am a big blocker."]
  },
  {
    name: "Sea-shroom",
    icon: "mushroom",
    color: "#7fd3d8",
    accent: "#3e8895",
    tags: ["mushroom", "water", "pool", "night"],
    clues: ["I am a mushroom for water.", "I live in the pool at night.", "I shoot close zombies."]
  },
  {
    name: "Plantern",
    icon: "torch",
    color: "#f7d46a",
    accent: "#6f8b3e",
    tags: ["fog", "light", "support", "pool"],
    clues: ["I shine through fog.", "I help you see hidden lanes.", "I look like a little lantern."]
  },
  {
    name: "Cactus",
    icon: "cactus",
    color: "#55a45c",
    accent: "#d84e63",
    tags: ["shoots", "green", "air", "day"],
    clues: ["I can pop balloon zombies.", "I am prickly.", "I grow taller to shoot the sky."]
  },
  {
    name: "Blover",
    icon: "wind",
    color: "#87cbe5",
    accent: "#447a8d",
    tags: ["air", "blue", "instant", "wind"],
    clues: ["I blow fog away.", "I push flying zombies off screen.", "I am a windy plant."]
  },
  {
    name: "Split Pea",
    icon: "splitpea",
    color: "#66b34f",
    accent: "#2e7040",
    tags: ["shoots", "green", "backwards", "pea"],
    clues: ["I shoot forward and backward.", "I help against digger zombies.", "I have faces on both sides."]
  },
  {
    name: "Starfruit",
    icon: "star",
    color: "#f1d94c",
    accent: "#8c7a21",
    tags: ["shoots", "yellow", "star", "day"],
    clues: ["I shoot stars in five directions.", "I am shaped like a star.", "I can cover odd angles."]
  },
  {
    name: "Pumpkin",
    icon: "pumpkin",
    color: "#e88335",
    accent: "#62351b",
    tags: ["blocks", "orange", "shell", "day"],
    clues: ["I protect another plant.", "I am an orange shell.", "Zombies bite me first."]
  },
  {
    name: "Cattail",
    icon: "cactus",
    color: "#e7a9c9",
    accent: "#6f4c83",
    tags: ["water", "air", "pool", "upgrade"],
    clues: ["I sit on a Lily Pad.", "I shoot spikes at many lanes.", "I can hit flying zombies."]
  },
  {
    name: "Magnet-shroom",
    icon: "magnet",
    color: "#b15c7e",
    accent: "#6c304f",
    tags: ["mushroom", "metal", "night", "support"],
    clues: ["I pull metal away from zombies.", "Buckets and helmets do not like me.", "I am a magnetic mushroom."]
  },
  {
    name: "Cabbage-pult",
    icon: "cabbage",
    color: "#86b94f",
    accent: "#415f29",
    tags: ["throws", "green", "roof", "day"],
    clues: ["I throw cabbages.", "I am useful on the roof.", "My shots go over slopes."]
  },
  {
    name: "Flower Pot",
    icon: "pumpkin",
    color: "#c77a4a",
    accent: "#704323",
    tags: ["roof", "support", "pot", "brown"],
    clues: ["Plants sit inside me on the roof.", "I am a clay pot.", "I make roof planting possible."]
  },
  {
    name: "Kernel-pult",
    icon: "corn",
    color: "#f2d75c",
    accent: "#5c8a42",
    tags: ["throws", "yellow", "roof", "butter"],
    clues: ["I throw corn kernels.", "Sometimes I throw butter.", "Butter can stop a zombie."]
  },
  {
    name: "Coffee Bean",
    icon: "mine",
    color: "#8f5a2c",
    accent: "#4d2a16",
    tags: ["coffee", "night", "support", "wake"],
    clues: ["I wake up mushrooms in the day.", "I am a tiny bean.", "Sleepy plants need me."]
  },
  {
    name: "Garlic",
    icon: "garlic",
    color: "#f0ead7",
    accent: "#776c55",
    tags: ["redirects", "white", "support", "day"],
    clues: ["I make zombies change lanes.", "I am a smelly bulb.", "Zombies take one bite and move."]
  },
  {
    name: "Umbrella Leaf",
    icon: "umbrella",
    color: "#79b855",
    accent: "#2f7040",
    tags: ["protects", "green", "roof", "support"],
    clues: ["I block falling bungees.", "I open like an umbrella.", "I protect nearby plants."]
  },
  {
    name: "Marigold",
    icon: "sun",
    color: "#f0c54a",
    accent: "#7f8e32",
    tags: ["money", "yellow", "garden", "bonus"],
    clues: ["I make coins.", "I am a flower for money.", "I am famous in the Zen Garden."]
  },
  {
    name: "Melon-pult",
    icon: "melon",
    color: "#6fbf66",
    accent: "#d85872",
    tags: ["throws", "green", "roof", "splash"],
    clues: ["I throw heavy melons.", "My splash hurts groups.", "I am a strong pult plant."]
  }
];

const zombies = [
  {
    name: "Zombie",
    icon: "zombie",
    color: "#9ab38f",
    accent: "#7b4a36",
    clues: ["I am the normal lawn zombie.", "I wear a brown jacket.", "I walk slowly."]
  },
  {
    name: "Flag Zombie",
    icon: "flagzombie",
    color: "#9ab38f",
    accent: "#d43b35",
    clues: ["I carry a red flag.", "I usually starts a big wave.", "I still walks like a normal zombie."]
  },
  {
    name: "Conehead Zombie",
    icon: "conezombie",
    color: "#9ab38f",
    accent: "#ef7d22",
    clues: ["I wear an orange cone.", "I am tougher than a normal zombie.", "My hat is pointy."]
  },
  {
    name: "Buckethead Zombie",
    icon: "bucketzombie",
    color: "#9ab38f",
    accent: "#aab4bd",
    clues: ["I wear a metal bucket.", "I am very tough.", "Magnet-shroom can steal my hat."]
  },
  {
    name: "Newspaper Zombie",
    icon: "paperzombie",
    color: "#9ab38f",
    accent: "#f0ead7",
    clues: ["I hold a newspaper.", "I gets angry when it breaks.", "I starts slow, then runs."]
  },
  {
    name: "Screen Door Zombie",
    icon: "doorzombie",
    color: "#9ab38f",
    accent: "#8aa7b5",
    clues: ["I carry a screen door.", "Fume-shroom can hit through my shield.", "My shield is in front of me."]
  },
  {
    name: "Football Zombie",
    icon: "footballzombie",
    color: "#9ab38f",
    accent: "#c93338",
    clues: ["I wear football gear.", "I run fast.", "I have a helmet."]
  },
  {
    name: "Pole Vaulting Zombie",
    icon: "polezombie",
    color: "#9ab38f",
    accent: "#8f5e38",
    clues: ["I carry a long pole.", "I jump over the first plant.", "Tall-nut can stop my jump."]
  },
  {
    name: "Dancing Zombie",
    icon: "dancezombie",
    color: "#9ab38f",
    accent: "#7c4ec2",
    clues: ["I dance onto the lawn.", "I can bring backup dancers.", "I has groovy hair."]
  },
  {
    name: "Ducky Tube Zombie",
    icon: "duckyzombie",
    color: "#9ab38f",
    accent: "#f3d23f",
    clues: ["I float in the pool.", "I wear a yellow ducky tube.", "You see me in water levels."]
  },
  {
    name: "Snorkel Zombie",
    icon: "snorkelzombie",
    color: "#9ab38f",
    accent: "#4fb0d8",
    clues: ["I hide under water.", "I pop up to eat plants.", "I wear snorkel gear."]
  },
  {
    name: "Zomboni",
    icon: "zomboni",
    color: "#b9d9ea",
    accent: "#d6453b",
    clues: ["I drive an ice machine.", "I leaves an icy trail.", "Spikeweed can pop me."]
  },
  {
    name: "Dolphin Rider Zombie",
    icon: "dolphin",
    color: "#9ab38f",
    accent: "#6ca7bd",
    clues: ["I ride a dolphin.", "I jumps over the first water plant.", "I appears in the pool."]
  },
  {
    name: "Jack-in-the-Box Zombie",
    icon: "jackzombie",
    color: "#9ab38f",
    accent: "#e54543",
    clues: ["I carry a surprise box.", "My box can explode.", "I winds up while walking."]
  },
  {
    name: "Balloon Zombie",
    icon: "balloonzombie",
    color: "#9ab38f",
    accent: "#d84e63",
    clues: ["I floats in the air.", "Cactus can pop my balloon.", "Blover can blow me away."]
  },
  {
    name: "Digger Zombie",
    icon: "diggerzombie",
    color: "#9ab38f",
    accent: "#b2a69a",
    clues: ["I dig underground.", "I comes from the back.", "Split Pea is good against me."]
  },
  {
    name: "Pogo Zombie",
    icon: "pogozombie",
    color: "#9ab38f",
    accent: "#e0b443",
    clues: ["I bounce on a pogo stick.", "I jumps over plants.", "Magnet-shroom can take my stick."]
  },
  {
    name: "Bungee Zombie",
    icon: "bungeezombie",
    color: "#9ab38f",
    accent: "#354f9c",
    clues: ["I drops from the sky.", "I can steal a plant.", "Umbrella Leaf can block me."]
  },
  {
    name: "Ladder Zombie",
    icon: "ladderzombie",
    color: "#9ab38f",
    accent: "#b8844b",
    clues: ["I carry a ladder.", "I can climb over blockers.", "Magnet-shroom can take my ladder."]
  },
  {
    name: "Gargantuar",
    icon: "gargantuar",
    color: "#8fa184",
    accent: "#6b4b3d",
    clues: ["I am giant.", "I carries a huge club.", "I can throw an Imp."]
  },
  {
    name: "Catapult Zombie",
    icon: "zomboni",
    color: "#9ab38f",
    accent: "#6f7380",
    clues: ["I attack from the roof side.", "I throws things over plants.", "Umbrella Leaf can block my shots."]
  },
  {
    name: "Zombie Bobsled Team",
    icon: "zomboni",
    color: "#9ab38f",
    accent: "#d6453b",
    clues: ["We move together on ice.", "We need a frozen path.", "A whole team rides in one sled."]
  },
  {
    name: "Imp",
    icon: "zombie",
    color: "#9ab38f",
    accent: "#6b4b3d",
    clues: ["I am tiny but troublesome.", "A giant zombie may throw me.", "I can appear deep in your defense."]
  },
  {
    name: "Zombie Yeti",
    icon: "zombie",
    color: "#dce8e8",
    accent: "#8fa8a8",
    clues: ["I am rare and surprising.", "I visits cold adventure moments.", "I may run away with treasure."]
  }
];

const difficultySettings = {
  easy: {
    poolSize: 14,
    choices: 4,
    lives: 4,
    clues: 3
  },
  medium: {
    poolSize: 28,
    choices: 6,
    lives: 3,
    clues: 2
  },
  hard: {
    poolSize: 999,
    choices: 8,
    lives: 2,
    clues: 1
  }
};

const highQualityPools = {
  plant: [
    "Peashooter",
    "Sunflower",
    "Cherry Bomb",
    "Wall-nut",
    "Potato Mine",
    "Snow Pea",
    "Chomper",
    "Repeater",
    "Puff-shroom",
    "Sun-shroom",
    "Fume-shroom",
    "Hypno-shroom",
    "Scaredy-shroom",
    "Ice-shroom",
    "Doom-shroom",
    "Grave Buster",
    "Lily Pad",
    "Squash",
    "Threepeater",
    "Tangle Kelp",
    "Jalapeno",
    "Spikeweed",
    "Torchwood",
    "Tall-nut",
    "Sea-shroom",
    "Plantern",
    "Cactus",
    "Blover",
    "Split Pea",
    "Starfruit",
    "Pumpkin",
    "Cattail",
    "Magnet-shroom",
    "Cabbage-pult",
    "Flower Pot",
    "Kernel-pult",
    "Coffee Bean",
    "Garlic",
    "Umbrella Leaf",
    "Marigold",
    "Melon-pult"
  ],
  zombie: [
    "Zombie",
    "Conehead Zombie",
    "Buckethead Zombie",
    "Newspaper Zombie",
    "Football Zombie",
    "Pole Vaulting Zombie",
    "Dancing Zombie",
    "Snorkel Zombie",
    "Balloon Zombie",
    "Dolphin Rider Zombie",
    "Zomboni",
    "Zombie Bobsled Team",
    "Jack-in-the-Box Zombie",
    "Pogo Zombie",
    "Bungee Zombie",
    "Ladder Zombie",
    "Catapult Zombie",
    "Gargantuar",
    "Digger Zombie",
    "Imp",
    "Zombie Yeti"
  ]
};

const characterImageFiles = {
  Peashooter: "peashooter.png",
  Sunflower: "sunflower.png",
  "Snow Pea": "snow-pea.png",
  Repeater: "repeater.png",
  "Sun-shroom": "sun-shroom.png",
  Squash: "squash.png",
  "Tall-nut": "tall-nut.png",
  Pumpkin: "pumpkin.png",
  "Cabbage-pult": "cabbage-pult.png",
  "Kernel-pult": "kernel-pult.png",
  "Melon-pult": "melon-pult.png",
  "Wall-nut": "wall-nut.png",
  "Dancing Zombie": "dancing-zombie.png",
  "Pogo Zombie": "pogo-zombie.png",
  "Zombie Yeti": "zombie-yeti.png"
};

const mysteryHintBank = {
  Peashooter: ["I am the lawn's simple starter helper.", "I solve problems from a distance.", "My attack travels in a straight lane."],
  Sunflower: ["I make future turns easier instead of fighting.", "Players protect me early.", "I help pay for the team."],
  "Cherry Bomb": ["I am a one-time answer to a crowded problem.", "I like the middle of danger.", "Two little heads make one big blast."],
  "Wall-nut": ["My job is patience, not damage.", "I buy time for friends behind me.", "Hungry enemies spend a long time on me."],
  "Potato Mine": ["I am strongest after waiting quietly.", "The first step over me can be the last.", "I start hidden low on the lawn."],
  "Snow Pea": ["I makes a lane feel slower.", "I am a shooter with a chilly trick.", "My shots are cold."],
  Chomper: ["I need a break after one big job.", "Close enemies are in the most danger.", "I solve problems with one giant bite."],
  Repeater: ["I am for when one shot feels too slow.", "I am related to a very basic shooter.", "Two peas leave my mouth."],
  "Puff-shroom": ["I is tiny, cheap, and brave at night.", "I only help when danger is close.", "I am a little mushroom."],
  "Sun-shroom": ["I begin small but becomes more useful later.", "I helps pay the team during dark levels.", "I am a night-time sun maker."],
  "Fume-shroom": ["Some shields do not bother me.", "I do not shoot a single small bullet.", "My attack is a short cloud."],
  "Hypno-shroom": ["An enemy who bites me may regret it.", "I turn trouble into help.", "My power works only once."],
  "Scaredy-shroom": ["I am helpful until danger gets too near.", "I prefer fighting from far away.", "I hides when scared."],
  "Ice-shroom": ["Everyone on screen gets a chilly pause.", "I am strongest when timing matters.", "I am a freezing mushroom."],
  "Doom-shroom": ["I fixes a huge mess and leaves a problem behind.", "My power is too big for normal use.", "I make a crater."],
  "Grave Buster": ["I removes something that is not a zombie.", "I is only useful in spooky places.", "I chews up graves."],
  "Lily Pad": ["I makes impossible water spots usable.", "I usually carries another helper.", "I floats in pool lanes."],
  Squash: ["I waits for someone to come too close.", "I helps once, then leaves.", "I jumps down flat on trouble."],
  Threepeater: ["I cares about nearby lanes, not only mine.", "One body watches three directions.", "I shoots peas in three lanes."],
  "Tangle Kelp": ["I removes one swimmer without a fight on land.", "I works from below.", "I pulls a water enemy under."],
  Jalapeno: ["I is a row-wide emergency button.", "I clears a path in a hurry.", "I leaves fire behind."],
  Spikeweed: ["I hurts feet instead of faces.", "Big vehicles dislike me.", "I sits flat on the ground."],
  Torchwood: ["I makes a friend's attack hotter.", "I is support for pea shooters.", "Peas change after passing through me."],
  "Tall-nut": ["Jumpers have a harder time with me.", "I am a taller kind of blocker.", "I protects a lane for a long time."],
  "Sea-shroom": ["I am a night helper for water.", "I is small and costs nothing.", "I shoots in pool lanes."],
  Plantern: ["I helps you see what the level hides.", "I is support, not a fighter.", "I lights up fog."],
  Cactus: ["I changes height when danger flies.", "Air enemies should be careful around me.", "I is prickly and can pop balloons."],
  Blover: ["I changes the weather for a moment.", "Flying enemies can vanish when I arrive.", "I blows things away."],
  "Split Pea": ["I worries about enemies from behind.", "One plant watches two directions.", "I shoots forward and backward."],
  Starfruit: ["I is useful when straight lines are not enough.", "My attacks leave in many directions.", "I shoots five little stars."],
  Pumpkin: ["I protects a friend from the outside.", "I is a shell around another plant.", "Enemies bite me before the plant inside."],
  Cattail: ["I needs water before it can join.", "I does not care much which lane needs help.", "I can hit flying enemies from a pool spot."],
  "Magnet-shroom": ["Metal things mysteriously disappear near me.", "Some tough hats become less useful.", "I steals buckets, helmets, and ladders."],
  "Cabbage-pult": ["I is comfortable on sloped roofs.", "My shots travel in an arc.", "I throws leafy balls."],
  "Flower Pot": ["I makes roof planting possible.", "I usually holds someone more exciting.", "I is a little clay home."],
  "Kernel-pult": ["Sometimes my best shot is sticky.", "I throws food in an arc.", "Butter is my lucky surprise."],
  "Coffee Bean": ["I wakes up sleepy helpers.", "I is small but changes day levels.", "Mushrooms need me in daytime."],
  Garlic: ["I does not stop enemies for long; I redirects them.", "A bite from me changes the path.", "I makes zombies switch lanes."],
  "Umbrella Leaf": ["I protects friends from danger above.", "Sky attacks are less scary near me.", "I opens like a shield."],
  Marigold: ["I is more about rewards than battles.", "I helps outside the normal fight.", "I makes coins."],
  "Melon-pult": ["I is a heavy roof attacker.", "Groups feel my splash.", "I throws big fruit in an arc."],
  Zombie: ["I am the plain version of the problem.", "No special tool, no special ride.", "I shamble in a brown jacket."],
  "Flag Zombie": ["I announces that more trouble is coming.", "I is not much stronger than a basic walker.", "I carries a red flag."],
  "Conehead Zombie": ["A little headwear makes me tougher.", "I am still basic, just better protected.", "My hat is from the street."],
  "Buckethead Zombie": ["Metal makes me take much longer.", "A certain mushroom can ruin my defense.", "My headgear is a bucket."],
  "Newspaper Zombie": ["I gets more dangerous after losing something.", "My quiet walk can turn angry.", "I carries something to read."],
  "Screen Door Zombie": ["Some attacks go through my protection.", "I hides behind a household shield.", "I carries a screen door."],
  "Football Zombie": ["I is built for speed and toughness.", "Magnet power can make me easier.", "I wears sports gear."],
  "Pole Vaulting Zombie": ["My first obstacle may not stop me.", "Tall blockers are a problem for my trick.", "I carries a pole."],
  "Dancing Zombie": ["I does not like arriving alone.", "My move can bring backup.", "I dances onto the lawn."],
  "Ducky Tube Zombie": ["I is a basic swimmer with a silly helper.", "You meet me in pool lanes.", "I wears a yellow float."],
  "Snorkel Zombie": ["I is hard to hit while traveling.", "I appears in water lanes.", "I hides under the pool surface."],
  "Balloon Zombie": ["Ground plans may miss me.", "Wind is my bad day.", "I float above the lawn."],
  "Dolphin Rider Zombie": ["Pool defenses get jumped first.", "I am fast in water.", "I rides over the first water plant."],
  Zomboni: ["I changes the ground as I move.", "Spikes are bad news for my machine.", "I drives over the lawn."],
  "Jack-in-the-Box Zombie": ["I carries a surprise that nobody wants.", "My music means danger is coming.", "My box can explode."],
  "Pogo Zombie": ["Normal blockers are not always enough for me.", "A magnet can ruin my trick.", "I bounce over plants."],
  "Bungee Zombie": ["I appears from above instead of walking in.", "One plant can stop my drop.", "I can steal plants."],
  "Ladder Zombie": ["I makes walls easier for friends behind me.", "Metal-removing plants are bad for me.", "I carries a climbing tool."],
  "Catapult Zombie": ["I causes trouble from the roof side.", "Umbrella Leaf can protect nearby friends.", "I throws basketballs."],
  "Zombie Bobsled Team": ["One icy path can bring a whole group.", "We arrive together instead of alone.", "We ride a sled."],
  Gargantuar: ["Tiny answers are not enough for me.", "I carry something huge.", "I can throw a smaller friend."],
  "Digger Zombie": ["Front defenses are not my favorite route.", "I makes trouble from behind.", "I travels underground first."],
  Imp: ["I am small enough to surprise you.", "I often arrives because someone bigger helped.", "A giant can throw me."],
  "Zombie Yeti": ["I am not part of an ordinary wave.", "I is rare and likes to disappear.", "I brings a snowy surprise."]
};

const fusionRecipes = [
  { inputs: ["Peashooter", "Peashooter"], result: "Repeater", exists: true },
  { inputs: ["Peashooter", "Sunflower"], result: "Sunshooter", exists: true, image: "sunshooter.png" },
  { inputs: ["Peashooter", "Cherry Bomb"], result: "Cherry-shooter", exists: true, image: "cherry-shooter.png" },
  { inputs: ["Peashooter", "Wall-nut"], result: "Peanut", exists: true, image: "peanut.png" },
  { inputs: ["Peashooter", "Potato Mine"], result: "Potato-shooter", exists: true, image: "potato-shooter.png" },
  { inputs: ["Peashooter", "Chomper"], result: "Chomp-shooter", exists: true, image: "chomp-shooter.png" },
  { inputs: ["Peashooter", "Puff-shroom"], result: "Pea-shroom", exists: true, image: "pea-shroom.png" },
  { inputs: ["Peashooter", "Fume-shroom"], result: "Soy-shroom", exists: true, image: "soy-shroom.png" },
  { inputs: ["Peashooter", "Hypno-shroom"], result: "Hypnoshooter", exists: true, image: "hypnoshooter.png" },
  { inputs: ["Peashooter", "Jalapeno"], result: "Blaze Pea", exists: true },
  { inputs: ["Repeater", "Jalapeno"], result: "Blaze Repeater", exists: true },
  { inputs: ["Sunflower", "Cherry Bomb"], result: "Sun Bomb", exists: true, image: "sun-bomb.png" },
  { inputs: ["Sunflower", "Wall-nut"], result: "Sun-nut", exists: true, image: "sun-nut.png" },
  { inputs: ["Sunflower", "Potato Mine"], result: "Sun Mine", exists: true, image: "sun-mine.png" },
  { inputs: ["Sunflower", "Chomper"], result: "Sun Chomper", exists: true, image: "sun-chomper.png" },
  { inputs: ["Jalapeno", "Sunflower"], result: "Sun Pepper", exists: true, image: "sun-pepper.png" },
  { inputs: ["Jalapeno", "Cherry Bomb"], result: "Bambomb", exists: true, image: "bambomb.png" },
  { inputs: ["Jalapeno", "Wall-nut"], result: "Scorch Wall-nut", exists: true, image: "scorch-wall-nut.png" },
  { inputs: ["Jalapeno", "Potato Mine"], result: "Jalapeno Mine", exists: true, image: "jalapeno-mine.png" },
  { inputs: ["Jalapeno", "Fume-shroom"], result: "Flame-shroom", exists: true, image: "flame-shroom.png" },
  { inputs: ["Jalapeno", "Ice-shroom"], result: "Unstable Obsidian", exists: true },
  { inputs: ["Jalapeno", "Doom-shroom"], result: "Doom Pepper", exists: true, image: "doom-pepper.png" },
  { inputs: ["Jalapeno", "Tall-nut"], result: "Flame Tall-nut", exists: true, image: "flame-tall-nut.png" },
  { inputs: ["Jalapeno", "Hypno-shroom"], result: "Hypno Pepper", exists: true, image: "hypno-pepper.png" },
  { inputs: ["Jalapeno", "Threepeater"], result: "Scorched Threepeater", exists: true, image: "scorched-threepeater.png" },
  { inputs: ["Jalapeno", "Squash"], result: "Spicy Squash", exists: true },
  { inputs: ["Jalapeno", "Torchwood"], result: "Scorchwood", exists: true, image: "scorchwood.png" },
  { inputs: ["Cherry Bomb", "Wall-nut"], result: "Cherry-nut", exists: true, image: "cherry-nut.png" },
  { inputs: ["Cherry Bomb", "Potato Mine"], result: "Cherry Mine", exists: true, image: "cherry-mine.png" },
  { inputs: ["Cherry Bomb", "Pumpkin"], result: "Cherry Pumpkin", exists: true, image: "cherry-pumpkin.png" },
  { inputs: ["Cherry Bomb", "Chomper"], result: "Cherry Chomper", exists: true, image: "cherry-chomper.png" },
  { inputs: ["Cherry Bomb", "Blover"], result: "Cherry Bomb Drone", exists: true, image: "cherry-bomb-drone.png" },
  { inputs: ["Cherry Bomb", "Magnet-shroom"], result: "Cherry-magnet", exists: true, image: "cherry-magnet.png" },
  { inputs: ["Cherry Bomb", "Ice-shroom"], result: "Chilly Bomb", exists: true, image: "chilly-bomb.png" },
  { inputs: ["Threepeater", "Torchwood"], result: "Torchthree", exists: true, image: "torchthree.png" },
  { inputs: ["Cactus", "Blover"], result: "Cactus Drone", exists: true, image: "cactus-drone.png" },
  { inputs: ["Cactus", "Doom-shroom"], result: "Doom Cactus", exists: true, image: "doom-cactus.png" },
  { inputs: ["Chomper", "Doom-shroom"], result: "Doom Chomper", exists: true, image: "doom-chomper.png" },
  { inputs: ["Blover", "Doom-shroom"], result: "Doom Blover", exists: true, image: "doom-blover.png" },
  { inputs: ["Tangle Kelp", "Torchwood"], result: "Torch-kelp", exists: true, image: "torch-kelp.png" },
  { inputs: ["Spikeweed", "Torchwood"], result: "Torchweed", exists: true, image: "torchweed.png" },
  { inputs: ["Fume-shroom", "Torchwood"], result: "Fumewood", exists: true, image: "fumewood.png" },
  { inputs: ["Wall-nut", "Kernel-pult"], result: "Butter-nut", exists: true, image: "butter-nut.png" },
  { inputs: ["Flower Pot", "Kernel-pult"], result: "Butter Pot", exists: true, image: "butter-pot.png" },
  { inputs: ["Wall-nut", "Cabbage-pult"], result: "Cabbage-nut", exists: true, image: "cabbage-nut.png" },
  { inputs: ["Cabbage-pult", "Flower Pot"], result: "Cabbage Pot", exists: true, image: "cabbage-pot.png" },
  { inputs: ["Kernel-pult", "Garlic"], result: "Clove-pult", exists: true, image: "clove-pult.png" },
  { inputs: ["Puff-shroom", "Kernel-pult"], result: "Popcorn-pult", exists: true, image: "popcorn-pult.png" },
  { inputs: ["Wall-nut", "Magnet-shroom"], result: "Magnet-nut", exists: true, image: "magnet-nut.png" },
  { inputs: ["Starfruit", "Plantern"], result: "Lumina Star", exists: true, image: "lumina-star.png" },
  { inputs: ["Torchwood", "Pumpkin"], result: "Shieldwood", exists: true, image: "shieldwood.png" },
  { inputs: ["Garlic", "Cactus"], result: "Blank square", exists: false },
  { inputs: ["Marigold", "Coffee Bean"], result: "Blank square", exists: false },
  { inputs: ["Lily Pad", "Torchwood"], result: "Blank square", exists: false },
  { inputs: ["Plantern", "Potato Mine"], result: "Blank square", exists: false },
  { inputs: ["Flower Pot", "Tangle Kelp"], result: "Blank square", exists: false },
  { inputs: ["Blover", "Garlic"], result: "Blank square", exists: false }
];

const blankFusionChoice = {
  name: "Blank square",
  fusion: true,
  blank: true
};

const state = {
  player: "Lucas",
  difficulty: "easy",
  mode: "plant",
  playMode: "shape",
  round: 1,
  score: 0,
  target: null,
  fusionRecipe: null,
  pool: [],
  choices: [],
  diffusionSelection: [],
  cluesLeft: 0,
  lives: 0,
  cluesUsed: 0,
  finished: false,
  targetQueue: [],
  targetQueueKey: "",
  lastTargetName: ""
};

const startScreen = document.querySelector("#startScreen");
const gameScreen = document.querySelector("#gameScreen");
const startForm = document.querySelector("#startForm");
const playerNameInput = document.querySelector("#playerName");
const greeting = document.querySelector("#greeting");
const roundLabel = document.querySelector("#roundLabel");
const questionsLeftEl = document.querySelector("#questionsLeft");
const livesLeftEl = document.querySelector("#livesLeft");
const scoreValueEl = document.querySelector("#scoreValue");
const mysteryArt = document.querySelector("#mysteryArt");
const answerReveal = document.querySelector("#answerReveal");
const fusionBoard = document.querySelector("#fusionBoard");
const hintStack = document.querySelector("#hintStack");
const answerLog = document.querySelector("#answerLog");
const plantGrid = document.querySelector("#plantGrid");
const messageBanner = document.querySelector("#messageBanner");
const clueButton = document.querySelector("#clueButton");
const newPlantButton = document.querySelector("#newPlantButton");
const homeButton = document.querySelector("#homeButton");
const roundPopup = document.querySelector("#roundPopup");
const popupTitle = document.querySelector("#popupTitle");
const popupDetail = document.querySelector("#popupDetail");
const modeRadios = Array.from(document.querySelectorAll('[name="mode"]'));
const recipeModeInputs = Array.from(document.querySelectorAll('[name="playMode"][value="fusion"], [name="playMode"][value="diffusion"]'));

modeRadios.forEach(input => input.addEventListener("change", syncRecipeModeAvailability));
syncRecipeModeAvailability();

startForm.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(startForm);
  state.player = (playerNameInput.value || "Lucas").trim().slice(0, 16) || "Lucas";
  state.difficulty = formData.get("difficulty") || "easy";
  state.mode = formData.get("mode") || "plant";
  state.playMode = formData.get("playMode") || "shape";
  if (state.mode === "zombie" && isRecipePlayMode(state.playMode)) state.playMode = "shape";
  if (isRecipeMode()) state.mode = "plant";
  state.round = 1;
  state.score = Number(localStorage.getItem("plantGuessStars") || "0");
  resetTargetQueue();
  startScreen.classList.add("is-hidden");
  gameScreen.classList.remove("is-hidden");
  startRound();
});

newPlantButton.addEventListener("click", () => {
  state.round += 1;
  startRound();
});

homeButton.addEventListener("click", () => {
  gameScreen.classList.add("is-hidden");
  startScreen.classList.remove("is-hidden");
});

const launchParams = new URLSearchParams(window.location.search);
if (launchParams.get("autostart") === "1") {
  const requestedDifficulty = launchParams.get("difficulty");
  const requestedMode = launchParams.get("mode");
  const requestedPlayMode = launchParams.get("playMode");
  const difficultyInput = document.querySelector(`[name="difficulty"][value="${cssEscape(requestedDifficulty || "")}"]`);
  const modeInput = document.querySelector(`[name="mode"][value="${cssEscape(requestedMode || "")}"]`);
  const playModeInput = document.querySelector(`[name="playMode"][value="${cssEscape(requestedPlayMode || "")}"]`);
  if (difficultyInput) difficultyInput.checked = true;
  if (modeInput) modeInput.checked = true;
  if (playModeInput) playModeInput.checked = true;
  syncRecipeModeAvailability();
  requestAnimationFrame(() => startForm.requestSubmit());
}

clueButton.addEventListener("click", () => {
  if (state.finished || state.cluesLeft <= 0) return;
  const clues = getHints(state.target);
  const clue = clues[state.cluesUsed] || `First letter: ${state.target.name[0]}`;
  state.cluesUsed += 1;
  state.cluesLeft -= 1;
  addAnswer(`Clue: ${clue}`, "yes");
  setMessage(clue);
  updateHud();
});

function startRound() {
  const settings = currentSettings();
  if (state.playMode === "fusion") {
    state.pool = fusionRecipes.slice(0, fusionPoolSize());
    state.fusionRecipe = nextFusionRecipe(state.pool);
    state.target = fusionResultChoice(state.fusionRecipe);
    state.choices = buildFusionChoices(state.target, settings.choices);
  } else if (state.playMode === "diffusion") {
    state.pool = fusionRecipes.filter(recipe => recipe.exists).slice(0, fusionPoolSize());
    state.fusionRecipe = nextFusionRecipe(state.pool);
    state.target = diffusionAnswerChoice(state.fusionRecipe);
    state.choices = buildDiffusionPlantChoices(state.fusionRecipe, state.pool, settings.choices);
  } else {
    state.pool = activeCharacters().slice(0, settings.poolSize);
    state.fusionRecipe = null;
    state.target = nextTarget(state.pool);
    state.choices = buildChoices(state.target, state.pool, settings.choices);
  }
  state.cluesLeft = settings.clues;
  state.lives = settings.lives;
  state.cluesUsed = 0;
  state.finished = false;
  state.diffusionSelection = [];

  greeting.textContent = isRecipeMode() ? `${state.player}, guess the ${state.playMode}.` : `${state.player}, guess the ${state.mode}.`;
  roundLabel.textContent = `Round ${state.round} · ${capitalize(state.difficulty)} · ${capitalize(state.mode)} · ${capitalize(state.playMode)}`;
  answerReveal.textContent = "";
  answerReveal.classList.remove("show");
  mysteryArt.classList.remove("revealed");
  mysteryArt.classList.toggle("is-hidden", state.playMode === "hints" || isRecipeMode());
  document.querySelector(".big-question").classList.toggle("is-hidden", state.playMode === "hints" || isRecipeMode());
  hintStack.classList.toggle("show", state.playMode === "hints");
  fusionBoard.classList.toggle("show", isRecipeMode());
  mysteryArt.innerHTML = isRecipeMode() ? "" : renderCharacterImage(state.target);
  fusionBoard.innerHTML = "";
  hintStack.innerHTML = "";
  answerLog.innerHTML = "";
  hideRoundPopup();

  if (state.playMode === "fusion") {
    renderFusionBoard();
    setMessage("Guess what these two plants fuse into.");
  } else if (state.playMode === "diffusion") {
    renderDiffusionBoard();
    setMessage("Pick the two plants that make this fusion.");
  } else if (state.playMode === "hints") {
    showStartingHints();
    setMessage("Read the hints, then pick an answer.");
  } else {
    setMessage("Guess the shape.");
  }

  renderPlantGrid();
  updateHud();
}

function renderPlantGrid() {
  plantGrid.innerHTML = "";
  state.choices.forEach(plant => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = state.playMode === "diffusion" ? "plant-card diffusion-plant-card" : "plant-card";
    card.dataset.name = plant.name;
    card.dataset.choiceId = plant.choiceId || plant.name;
    card.innerHTML = `${renderChoiceImage(plant)}<span class="plant-name">${plant.name}</span>`;
    card.addEventListener("click", () => guessPlant(plant));
    plantGrid.append(card);
  });
}

function guessPlant(plant) {
  if (state.finished) return;
  if (state.playMode === "diffusion") {
    guessDiffusionPlant(plant);
    return;
  }
  const card = plantGrid.querySelector(`[data-name="${cssEscape(plant.name)}"]`);

  if (plant.name === state.target.name) {
    state.finished = true;
    state.score += Math.max(1, state.lives + state.cluesLeft);
    localStorage.setItem("plantGuessStars", String(state.score));
    revealAnswer();
    setMessage(`Correct! It was ${plant.name}.`, "win");
    if (card) card.classList.add("is-correct");
    disableRoundControls();
    updateHud();
    showRoundPopup("Correct!", `${plant.name} · next round...`);
    window.setTimeout(() => {
      state.round += 1;
      startRound();
    }, 1500);
    return;
  }

  state.lives -= 1;
  if (card) {
    card.classList.add("is-wrong");
    card.disabled = true;
  }
  setMessage(`${plant.name} is not it. Try again!`, "miss");
  updateHud();

  if (state.lives <= 0) {
    state.finished = true;
    revealAnswer();
    setMessage(`The answer was ${state.target.name}.`, "miss");
    markCorrectCard();
    disableRoundControls();
    showRoundPopup("Out of hearts!", `${state.target.name} · next round...`);
    window.setTimeout(() => {
      state.round += 1;
      startRound();
    }, 2300);
  }
}

function guessDiffusionPlant(plant) {
  const choiceId = plant.choiceId || plant.name;
  const alreadySelected = state.diffusionSelection.findIndex(choice => choice.choiceId === choiceId);
  if (alreadySelected >= 0) {
    state.diffusionSelection.splice(alreadySelected, 1);
    renderDiffusionBoard();
    syncDiffusionSelectionCards();
    setMessage("Pick two plants that make this fusion.");
    return;
  }
  if (state.diffusionSelection.length >= 2) return;

  state.diffusionSelection.push(plant);
  renderDiffusionBoard();
  syncDiffusionSelectionCards();

  if (state.diffusionSelection.length < 2) {
    setMessage("Pick one more plant.");
    return;
  }

  const selectedNames = state.diffusionSelection.map(choice => choice.name);
  if (samePlantSet(selectedNames, state.target.inputs)) {
    state.finished = true;
    state.score += Math.max(1, state.lives + state.cluesLeft);
    localStorage.setItem("plantGuessStars", String(state.score));
    revealAnswer();
    setMessage(`Correct! ${state.target.name} makes it.`, "win");
    markCorrectCard();
    disableRoundControls();
    updateHud();
    showRoundPopup("Correct!", `${state.target.name} · next round...`);
    window.setTimeout(() => {
      state.round += 1;
      startRound();
    }, 1500);
    return;
  }

  state.lives -= 1;
  markDiffusionSelection("is-wrong");
  setMessage(`${selectedNames.join(" + ")} is not the recipe.`, "miss");
  updateHud();

  if (state.lives <= 0) {
    state.finished = true;
    revealAnswer();
    setMessage(`The answer was ${state.target.name}.`, "miss");
    markCorrectCard();
    disableRoundControls();
    showRoundPopup("Out of hearts!", `${state.target.name} · next round...`);
    window.setTimeout(() => {
      state.round += 1;
      startRound();
    }, 2300);
    return;
  }

  window.setTimeout(() => {
    state.diffusionSelection = [];
    renderDiffusionBoard();
    syncDiffusionSelectionCards();
    setMessage("Try another pair.");
  }, 800);
}

function revealAnswer() {
  mysteryArt.classList.toggle("is-hidden", isRecipeMode());
  hintStack.classList.remove("show");
  document.querySelector(".big-question").classList.add("is-hidden");
  mysteryArt.classList.add("revealed");
  if (state.playMode === "fusion") renderFusionBoard(true);
  if (state.playMode === "diffusion") renderDiffusionBoard(true);
  answerReveal.textContent = state.target.name;
  answerReveal.classList.add("show");
}

function disableRoundControls() {
  if (state.playMode === "diffusion") {
    plantGrid.querySelectorAll("button").forEach(button => {
      button.disabled = true;
    });
    clueButton.disabled = true;
    return;
  }
  plantGrid.querySelectorAll("button").forEach(button => {
    if (button.dataset.name !== state.target.name) button.disabled = true;
  });
  clueButton.disabled = true;
}

function markCorrectCard() {
  if (state.playMode === "diffusion") {
    const remaining = plantNameCounts(state.target.inputs);
    plantGrid.querySelectorAll("button").forEach(button => {
      const name = button.dataset.name;
      if (remaining.get(name) > 0) {
        button.classList.remove("is-selected", "is-wrong");
        button.classList.add("is-correct");
        remaining.set(name, remaining.get(name) - 1);
      }
    });
    return;
  }
  const card = plantGrid.querySelector(`[data-name="${cssEscape(state.target.name)}"]`);
  if (card) card.classList.add("is-correct");
}

function addAnswer(text, tone) {
  const pill = document.createElement("div");
  pill.className = `answer-pill ${tone}`;
  pill.textContent = text;
  answerLog.prepend(pill);
}

function updateHud() {
  questionsLeftEl.textContent = String(state.cluesLeft);
  livesLeftEl.textContent = "♥".repeat(Math.max(0, state.lives)) || "0";
  scoreValueEl.textContent = String(state.score);
  clueButton.classList.toggle("is-hidden", state.playMode === "hints" || isRecipeMode());
  clueButton.disabled = state.playMode === "hints" || isRecipeMode() || state.finished || state.cluesLeft <= 0;
}

function showStartingHints() {
  const hintCount = currentSettings().clues;
  const hints = getHints(state.target).slice(0, hintCount);
  state.cluesLeft = hints.length;
  hints.forEach((hint, index) => {
    const card = document.createElement("div");
    card.className = "hint-card";
    card.textContent = `${index + 1}. ${hint}`;
    hintStack.append(card);
  });
}

function showRoundPopup(title, detail) {
  popupTitle.textContent = title;
  popupDetail.textContent = detail;
  roundPopup.classList.remove("is-hidden");
}

function hideRoundPopup() {
  roundPopup.classList.add("is-hidden");
}

function setMessage(text, tone = "") {
  messageBanner.className = `message-banner ${tone}`.trim();
  messageBanner.textContent = text;
}

function currentSettings() {
  return difficultySettings[state.difficulty] || difficultySettings.easy;
}

function isRecipeMode() {
  return isRecipePlayMode(state.playMode);
}

function isRecipePlayMode(playMode) {
  return playMode === "fusion" || playMode === "diffusion";
}

function syncRecipeModeAvailability() {
  const selectedMode = document.querySelector('[name="mode"]:checked')?.value || "plant";
  const isZombie = selectedMode === "zombie";
  recipeModeInputs.forEach(input => {
    const label = input.closest("label");
    input.disabled = isZombie;
    label?.classList.toggle("is-unavailable", isZombie);
    label?.setAttribute("aria-disabled", String(isZombie));
  });
  if (isZombie && recipeModeInputs.some(input => input.checked)) {
    const shapeInput = document.querySelector('[name="playMode"][value="shape"]');
    if (shapeInput) shapeInput.checked = true;
  }
}

function activeCharacters() {
  const source = state.mode === "zombie" ? zombies : plants;
  const names = highQualityPools[state.mode] || highQualityPools.plant;
  return names.map(name => source.find(character => character.name === name)).filter(Boolean);
}

function fusionPoolSize() {
  if (state.difficulty === "easy") return 18;
  if (state.difficulty === "medium") return 36;
  return fusionRecipes.length;
}

function getHints(character) {
  return mysteryHintBank[character.name] || character.clues;
}

function nextFusionRecipe(pool) {
  const queueKey = `fusion:${state.difficulty}:${pool.map(recipe => fusionRecipeKey(recipe)).join("|")}`;
  if (state.targetQueueKey !== queueKey || state.targetQueue.length === 0) {
    state.targetQueueKey = queueKey;
    state.targetQueue = shuffle(pool.map(recipe => fusionRecipeKey(recipe)));
    if (state.targetQueue.length > 1 && state.targetQueue[0] === state.lastTargetName) {
      state.targetQueue.push(state.targetQueue.shift());
    }
  }
  const nextKey = state.targetQueue.shift();
  const recipe = pool.find(item => fusionRecipeKey(item) === nextKey) || randomItem(pool);
  state.lastTargetName = fusionRecipeKey(recipe);
  return recipe;
}

function fusionRecipeKey(recipe) {
  return `${recipe.inputs.join("+")}=${recipe.result}`;
}

function fusionResultChoice(recipe) {
  if (!recipe.exists) return blankFusionChoice;
  return {
    name: recipe.result,
    fusion: true,
    image: recipe.image || "",
    missingImage: !recipe.image
  };
}

function diffusionAnswerChoice(recipe) {
  return {
    name: recipe.inputs.join(" + "),
    diffusion: true,
    inputs: recipe.inputs,
    recipeKey: fusionRecipeKey(recipe)
  };
}

function buildFusionChoices(target, count) {
  const realChoices = fusionRecipes
    .filter(recipe => recipe.exists && recipe.result !== target.name)
    .map(fusionResultChoice);
  const unique = uniqueChoices(realChoices);
  const pool = target.blank ? unique : [blankFusionChoice, ...unique];
  const choiceCount = Math.min(count, pool.length + 1);
  const others = shuffle(pool.filter(choice => choice.name !== target.name)).slice(0, choiceCount - 1);
  return shuffle([target, ...others]);
}

function buildDiffusionPlantChoices(recipe, pool, count) {
  const requiredNames = recipe.inputs;
  const requiredCounts = plantNameCounts(requiredNames);
  const candidateNames = uniqueNames(pool.flatMap(item => item.inputs))
    .filter(name => plants.some(plant => plant.name === name))
    .filter(name => !requiredCounts.has(name));
  const choiceCount = Math.max(requiredNames.length, count);
  const names = shuffle([
    ...requiredNames,
    ...shuffle(candidateNames).slice(0, Math.max(0, choiceCount - requiredNames.length))
  ]);
  return names.map((name, index) => ({
    ...findPlantByName(name),
    choiceId: `diffusion-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  }));
}

function uniqueChoices(choices) {
  const seen = new Set();
  return choices.filter(choice => {
    if (seen.has(choice.name)) return false;
    seen.add(choice.name);
    return true;
  });
}

function renderFusionBoard(revealed = false) {
  const [first, second] = state.fusionRecipe.inputs.map(findPlantByName);
  const result = revealed ? state.target : null;
  fusionBoard.innerHTML = `
    ${renderFusionInput(first)}
    <div class="fusion-op">+</div>
    ${renderFusionInput(second)}
    <div class="fusion-op">=</div>
    <div class="fusion-card fusion-result-card">
      ${result ? renderFusionChoiceImage(result) : '<div class="fusion-question">?</div>'}
      <span>${result ? result.name : "What fusion?"}</span>
    </div>
  `;
}

function renderDiffusionBoard(revealed = false) {
  const result = fusionResultChoice(state.fusionRecipe);
  const [first, second] = state.fusionRecipe.inputs.map(findPlantByName);
  const [selectedFirst, selectedSecond] = state.diffusionSelection;
  fusionBoard.innerHTML = `
    <div class="fusion-card fusion-result-card">
      ${renderFusionChoiceImage(result)}
      <span>${result.name}</span>
    </div>
    <div class="fusion-op">=</div>
    <div class="fusion-card">
      ${renderDiffusionSlot(revealed ? first : selectedFirst, "First plant")}
    </div>
    <div class="fusion-op">+</div>
    <div class="fusion-card">
      ${renderDiffusionSlot(revealed ? second : selectedSecond, "Second plant")}
    </div>
  `;
}

function renderDiffusionSlot(plant, fallbackLabel) {
  if (!plant) {
    return `
      <div class="fusion-question">?</div>
      <span>${fallbackLabel}</span>
    `;
  }
  return `
    ${renderCharacterImage(plant)}
    <span>${plant.name}</span>
  `;
}

function renderFusionInput(plant) {
  return `
    <div class="fusion-card">
      ${renderCharacterImage(plant)}
      <span>${plant.name}</span>
    </div>
  `;
}

function findPlantByName(name) {
  return plants.find(plant => plant.name === name) || { name };
}

function nextTarget(pool) {
  const queueKey = `${state.mode}:${state.difficulty}:${pool.map(character => character.name).join("|")}`;
  if (state.targetQueueKey !== queueKey || state.targetQueue.length === 0) {
    state.targetQueueKey = queueKey;
    state.targetQueue = shuffle(pool.map(character => character.name));
    if (state.targetQueue.length > 1 && state.targetQueue[0] === state.lastTargetName) {
      state.targetQueue.push(state.targetQueue.shift());
    }
  }
  const nextName = state.targetQueue.shift();
  const target = pool.find(character => character.name === nextName) || randomItem(pool);
  state.lastTargetName = target.name;
  return target;
}

function resetTargetQueue() {
  state.targetQueue = [];
  state.targetQueueKey = "";
  state.lastTargetName = "";
}

function buildChoices(target, pool, count) {
  const choiceCount = Math.min(count, pool.length);
  const others = shuffle(pool.filter(item => item.name !== target.name)).slice(0, choiceCount - 1);
  return shuffle([target, ...others]);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function uniqueNames(names) {
  return [...new Set(names)];
}

function plantNameCounts(names) {
  const counts = new Map();
  names.forEach(name => counts.set(name, (counts.get(name) || 0) + 1));
  return counts;
}

function samePlantSet(selectedNames, targetNames) {
  if (selectedNames.length !== targetNames.length) return false;
  const counts = plantNameCounts(targetNames);
  selectedNames.forEach(name => counts.set(name, (counts.get(name) || 0) - 1));
  return [...counts.values()].every(count => count === 0);
}

function syncDiffusionSelectionCards() {
  const selectedIds = new Set(state.diffusionSelection.map(choice => choice.choiceId));
  plantGrid.querySelectorAll("button").forEach(button => {
    button.classList.toggle("is-selected", selectedIds.has(button.dataset.choiceId));
    button.classList.remove("is-wrong");
  });
}

function markDiffusionSelection(className) {
  const selectedIds = new Set(state.diffusionSelection.map(choice => choice.choiceId));
  plantGrid.querySelectorAll("button").forEach(button => {
    if (selectedIds.has(button.dataset.choiceId)) button.classList.add(className);
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function cssEscape(value) {
  if (window.CSS && CSS.escape) return CSS.escape(value);
  return value.replace(/["\\]/g, "\\$&");
}

function renderChoiceImage(choice) {
  if (choice.fusion) return renderFusionChoiceImage(choice);
  return renderCharacterImage(choice);
}

function renderFusionChoiceImage(choice) {
  if (choice.blank) return '<div class="blank-square" aria-hidden="true"></div>';
  if (choice.image) return `<img src="assets/fusions/${choice.image}" alt="${choice.name}" draggable="false" />`;
  const plant = plants.find(item => item.name === choice.name);
  if (plant) return renderCharacterImage(plant);
  return '<div class="fusion-name-art" aria-hidden="true">Fusion</div>';
}

function renderCharacterImage(character) {
  const file = characterImageFiles[character.name] || `${slugify(character.name)}.png`;
  const path = `assets/characters/${file}`;
  return `<img src="${path}" alt="${character.name}" draggable="false" />`;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const face = color => `
  <circle cx="47" cy="52" r="4" fill="${color.outline}" />
  <circle cx="72" cy="52" r="4" fill="${color.outline}" />
  <path d="M48 72 Q60 82 73 72" fill="none" stroke="${color.outline}" stroke-width="4" stroke-linecap="round" />
`;

const stem = color => `
  <path d="M60 78 C58 91 55 101 50 113" fill="none" stroke="${color.outline}" stroke-width="12" stroke-linecap="round" />
  <path d="M60 78 C58 91 55 101 50 113" fill="none" stroke="${color.leaf}" stroke-width="7" stroke-linecap="round" />
  <ellipse cx="38" cy="99" rx="20" ry="10" fill="${color.leaf}" stroke="${color.outline}" stroke-width="4" transform="rotate(-18 38 99)" />
  <ellipse cx="74" cy="99" rx="21" ry="10" fill="${color.leaf}" stroke="${color.outline}" stroke-width="4" transform="rotate(18 74 99)" />
`;

const zombieBody = (color, extras = "") => `
  <path d="M49 101 L43 116 M72 101 L80 116" stroke="${color.outline}" stroke-width="11" stroke-linecap="round" />
  <path d="M49 101 L43 116 M72 101 L80 116" stroke="${color.accent}" stroke-width="6" stroke-linecap="round" opacity="0.8" />
  <rect x="37" y="57" width="47" height="48" rx="14" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" />
  <circle cx="60" cy="39" r="26" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
  <path d="M40 62 L21 78 M80 62 L99 77" stroke="${color.outline}" stroke-width="10" stroke-linecap="round" />
  <path d="M40 62 L21 78 M80 62 L99 77" stroke="${color.body}" stroke-width="5" stroke-linecap="round" />
  <circle cx="51" cy="36" r="4" fill="${color.outline}" />
  <circle cx="69" cy="36" r="4" fill="${color.outline}" />
  <path d="M51 50 Q60 46 70 50" fill="none" stroke="${color.outline}" stroke-width="4" stroke-linecap="round" />
  ${extras}
`;

const coneHat = color => `
  <path d="M40 29 L60 4 L80 29Z" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" stroke-linejoin="round" />
  <path d="M46 24 H74" stroke="#ffd08d" stroke-width="4" stroke-linecap="round" />
`;

const bucketHat = color => `
  <path d="M38 15 H82 L76 36 H44Z" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" stroke-linejoin="round" />
  <path d="M42 20 H78" stroke="#eef4f8" stroke-width="4" stroke-linecap="round" />
`;

const iconTemplates = {
  zombie: color => zombieBody(color),
  flagzombie: color => zombieBody(color, `
    <path d="M20 77 V18" stroke="${color.outline}" stroke-width="5" stroke-linecap="round" />
    <path d="M22 20 H56 L51 41 H22Z" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" stroke-linejoin="round" />
  `),
  conezombie: color => zombieBody(color, coneHat(color)),
  bucketzombie: color => zombieBody(color, bucketHat(color)),
  paperzombie: color => zombieBody(color, `
    <rect x="15" y="63" width="42" height="28" rx="3" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" transform="rotate(-8 36 77)" />
    <path d="M24 72 H48 M25 80 H45" stroke="#7d7568" stroke-width="3" stroke-linecap="round" />
  `),
  doorzombie: color => zombieBody(color, `
    <rect x="71" y="43" width="35" height="56" rx="4" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" />
    <path d="M79 51 H99 M79 62 H99 M79 73 H99 M79 84 H99" stroke="#d5edf5" stroke-width="3" stroke-linecap="round" />
  `),
  footballzombie: color => zombieBody(color, `
    <path d="M39 25 C44 7 76 7 81 25 L74 35 H46Z" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" />
    <path d="M40 64 H80" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
  `),
  polezombie: color => zombieBody(color, `
    <path d="M100 12 L25 113" stroke="${color.outline}" stroke-width="6" stroke-linecap="round" />
    <path d="M100 12 L25 113" stroke="#d9b27a" stroke-width="3" stroke-linecap="round" />
  `),
  dancezombie: color => zombieBody(color, `
    <path d="M42 16 C54 4 69 4 80 16 C70 13 54 13 42 16Z" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" />
    <path d="M45 75 C55 65 67 65 77 75" fill="none" stroke="#f7d24a" stroke-width="5" stroke-linecap="round" />
  `),
  duckyzombie: color => zombieBody(color, `
    <ellipse cx="60" cy="88" rx="45" ry="22" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="89" cy="78" r="10" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" />
    <path d="M99 80 L111 75 L103 86Z" fill="#ef8a2d" stroke="${color.outline}" stroke-width="3" />
  `),
  snorkelzombie: color => zombieBody(color, `
    <path d="M72 21 H91 V8 H104" fill="none" stroke="${color.accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
    <rect x="45" y="31" width="31" height="14" rx="7" fill="#d9f8ff" stroke="${color.outline}" stroke-width="4" />
  `),
  zomboni: color => `
    <rect x="18" y="54" width="84" height="43" rx="10" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M33 54 L47 31 H79 L91 54Z" fill="#e9f7fb" stroke="${color.outline}" stroke-width="5" />
    <circle cx="42" cy="98" r="9" fill="${color.outline}" />
    <circle cx="82" cy="98" r="9" fill="${color.outline}" />
    <rect x="23" y="67" width="34" height="12" rx="6" fill="${color.accent}" />
  `,
  dolphin: color => zombieBody(color, `
    <path d="M22 90 C47 61 82 61 106 85 C79 82 51 87 22 90Z" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" />
    <path d="M75 71 L87 52 L92 76" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" stroke-linejoin="round" />
  `),
  jackzombie: color => zombieBody(color, `
    <rect x="17" y="72" width="31" height="31" rx="5" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" />
    <path d="M22 78 H43 M32 72 V103" stroke="#ffe070" stroke-width="4" stroke-linecap="round" />
    <path d="M32 72 C32 60 46 60 46 71" fill="none" stroke="${color.outline}" stroke-width="4" stroke-linecap="round" />
  `),
  balloonzombie: color => zombieBody(color, `
    <ellipse cx="91" cy="20" rx="20" ry="26" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" />
    <path d="M89 46 C81 58 82 70 74 82" fill="none" stroke="${color.outline}" stroke-width="3" stroke-linecap="round" />
  `),
  diggerzombie: color => zombieBody(color, `
    ${bucketHat({ ...color, accent: "#c9c0b7" })}
    <path d="M18 84 L49 57" stroke="${color.outline}" stroke-width="8" stroke-linecap="round" />
    <path d="M13 89 L28 73 L38 84 L22 98Z" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" />
  `),
  pogozombie: color => zombieBody(color, `
    <path d="M58 98 V116" stroke="${color.outline}" stroke-width="6" stroke-linecap="round" />
    <path d="M42 116 H77" stroke="${color.outline}" stroke-width="6" stroke-linecap="round" />
    <circle cx="60" cy="88" r="10" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" />
  `),
  bungeezombie: color => zombieBody(color, `
    <path d="M60 0 V20" stroke="${color.outline}" stroke-width="5" stroke-linecap="round" />
    <path d="M45 19 H75 L69 31 H51Z" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" />
  `),
  ladderzombie: color => zombieBody(color, `
    <path d="M91 25 V107 M110 20 V102 M93 43 H108 M93 61 H108 M93 79 H108 M93 97 H108" stroke="${color.accent}" stroke-width="5" stroke-linecap="round" />
    <path d="M91 25 V107 M110 20 V102" stroke="${color.outline}" stroke-width="9" stroke-linecap="round" opacity="0.35" />
  `),
  gargantuar: color => `
    <path d="M45 96 L38 116 M76 96 L86 116" stroke="${color.outline}" stroke-width="15" stroke-linecap="round" />
    <rect x="28" y="45" width="65" height="57" rx="18" fill="${color.accent}" stroke="${color.outline}" stroke-width="6" />
    <circle cx="60" cy="28" r="30" fill="${color.body}" stroke="${color.outline}" stroke-width="6" />
    <path d="M22 61 L7 86 M94 61 L111 85" stroke="${color.outline}" stroke-width="14" stroke-linecap="round" />
    <path d="M92 19 L112 5" stroke="${color.outline}" stroke-width="12" stroke-linecap="round" />
    <circle cx="49" cy="25" r="5" fill="${color.outline}" />
    <circle cx="71" cy="25" r="5" fill="${color.outline}" />
    <path d="M49 46 Q61 39 74 46" fill="none" stroke="${color.outline}" stroke-width="5" stroke-linecap="round" />
  `,
  pea: color => `
    ${stem(color)}
    <circle cx="58" cy="50" r="31" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <ellipse cx="88" cy="51" rx="20" ry="16" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="49" cy="42" r="4" fill="${color.outline}" />
    <path d="M43 63 Q54 70 66 63" fill="none" stroke="${color.outline}" stroke-width="4" stroke-linecap="round" />
  `,
  doublepea: color => `
    ${stem(color)}
    <circle cx="45" cy="55" r="25" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="66" cy="47" r="28" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <ellipse cx="94" cy="47" rx="17" ry="14" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="57" cy="39" r="4" fill="${color.outline}" />
  `,
  triplepea: color => `
    ${stem(color)}
    <circle cx="42" cy="58" r="22" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="59" cy="42" r="23" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="75" cy="62" r="22" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <ellipse cx="97" cy="61" rx="15" ry="12" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="54" cy="36" r="4" fill="${color.outline}" />
  `,
  splitpea: color => `
    ${stem(color)}
    <circle cx="60" cy="52" r="29" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <ellipse cx="90" cy="52" rx="18" ry="14" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <ellipse cx="30" cy="52" rx="18" ry="14" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="52" cy="44" r="4" fill="${color.outline}" />
    <circle cx="68" cy="44" r="4" fill="${color.outline}" />
  `,
  sun: color => `
    ${stem(color)}
    ${Array.from({ length: 12 }, (_, index) => {
      const angle = index * 30;
      return `<ellipse cx="60" cy="45" rx="12" ry="25" fill="${color.body}" stroke="${color.outline}" stroke-width="4" transform="rotate(${angle} 60 45)" />`;
    }).join("")}
    <circle cx="60" cy="45" r="26" fill="#8b5d2f" stroke="${color.outline}" stroke-width="5" />
    ${face(color)}
  `,
  bomb: color => `
    <path d="M59 36 C63 22 78 22 82 34" fill="none" stroke="${color.leaf}" stroke-width="7" stroke-linecap="round" />
    <circle cx="45" cy="58" r="28" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="75" cy="58" r="28" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <rect x="37" y="83" width="47" height="13" rx="7" fill="${color.leaf}" stroke="${color.outline}" stroke-width="4" />
    <circle cx="36" cy="52" r="4" fill="${color.outline}" />
    <circle cx="66" cy="52" r="4" fill="${color.outline}" />
  `,
  nut: color => `
    <ellipse cx="60" cy="61" rx="36" ry="48" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M38 35 C48 26 70 25 83 40" fill="none" stroke="${color.accent}" stroke-width="5" stroke-linecap="round" />
    ${face(color)}
  `,
  tallnut: color => `
    <ellipse cx="60" cy="58" rx="33" ry="54" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M41 28 C55 20 76 25 84 42" fill="none" stroke="${color.accent}" stroke-width="5" stroke-linecap="round" />
    ${face(color)}
  `,
  mine: color => `
    <ellipse cx="60" cy="92" rx="42" ry="14" fill="${color.soil}" opacity="0.55" />
    <ellipse cx="60" cy="61" rx="31" ry="25" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <circle cx="59" cy="43" r="11" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" />
    <path d="M48 34 L41 24 M62 31 L65 19 M73 36 L84 27" stroke="${color.outline}" stroke-width="4" stroke-linecap="round" />
    ${face(color)}
  `,
  chomp: color => `
    ${stem(color)}
    <path d="M30 70 C20 35 42 18 69 27 C99 37 103 74 75 89 C55 100 37 91 30 70Z" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M40 68 C54 55 74 55 90 66" fill="none" stroke="#f6e8f9" stroke-width="11" stroke-linecap="round" />
    <path d="M46 51 L52 66 L58 51 M66 51 L72 66 L78 51" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" />
    <circle cx="55" cy="42" r="4" fill="${color.outline}" />
  `,
  mushroom: color => `
    <ellipse cx="60" cy="52" rx="40" ry="24" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <rect x="43" y="58" width="34" height="38" rx="16" fill="#f2e8d9" stroke="${color.outline}" stroke-width="5" />
    <circle cx="45" cy="47" r="6" fill="${color.accent}" />
    <circle cx="69" cy="38" r="7" fill="${color.accent}" />
    ${face(color)}
  `,
  fume: color => `
    <rect x="41" y="59" width="34" height="37" rx="16" fill="#f2e8d9" stroke="${color.outline}" stroke-width="5" />
    <path d="M24 58 C28 27 53 19 77 29 C95 36 100 56 87 70 C66 60 45 60 24 58Z" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M76 44 C93 35 105 39 111 51" fill="none" stroke="${color.accent}" stroke-width="7" stroke-linecap="round" />
    ${face(color)}
  `,
  swirl: color => `
    <ellipse cx="60" cy="52" rx="39" ry="24" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M47 50 C45 39 62 36 64 48 C67 63 43 62 42 48" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" />
    <rect x="43" y="58" width="34" height="38" rx="16" fill="#f2e8d9" stroke="${color.outline}" stroke-width="5" />
    ${face(color)}
  `,
  snow: color => `
    <ellipse cx="60" cy="52" rx="40" ry="24" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M60 35 V68 M45 43 L75 60 M75 43 L45 60" stroke="#fff" stroke-width="5" stroke-linecap="round" />
    <rect x="43" y="58" width="34" height="38" rx="16" fill="#e9fbff" stroke="${color.outline}" stroke-width="5" />
    ${face(color)}
  `,
  doom: color => `
    <ellipse cx="60" cy="58" rx="44" ry="30" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M38 51 H82 M46 39 L74 72 M74 39 L46 72" stroke="${color.accent}" stroke-width="6" stroke-linecap="round" />
    <rect x="42" y="72" width="36" height="24" rx="12" fill="#d7d2de" stroke="${color.outline}" stroke-width="5" />
  `,
  lily: color => `
    <ellipse cx="60" cy="75" rx="47" ry="24" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M60 75 L93 57" stroke="${color.outline}" stroke-width="5" stroke-linecap="round" />
    <circle cx="47" cy="67" r="4" fill="${color.outline}" />
    <circle cx="70" cy="67" r="4" fill="${color.outline}" />
    <ellipse cx="60" cy="39" rx="10" ry="21" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" />
  `,
  squash: color => `
    <ellipse cx="60" cy="66" rx="34" ry="43" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M52 23 C61 31 67 31 76 23" fill="none" stroke="${color.leaf}" stroke-width="7" stroke-linecap="round" />
    <path d="M46 52 L55 58 M74 52 L65 58" stroke="${color.outline}" stroke-width="5" stroke-linecap="round" />
    <path d="M49 77 Q60 70 73 77" fill="none" stroke="${color.outline}" stroke-width="4" stroke-linecap="round" />
  `,
  kelp: color => `
    <path d="M41 105 C29 79 48 58 36 33" fill="none" stroke="${color.outline}" stroke-width="13" stroke-linecap="round" />
    <path d="M41 105 C29 79 48 58 36 33" fill="none" stroke="${color.body}" stroke-width="8" stroke-linecap="round" />
    <path d="M64 105 C82 80 60 57 77 28" fill="none" stroke="${color.outline}" stroke-width="13" stroke-linecap="round" />
    <path d="M64 105 C82 80 60 57 77 28" fill="none" stroke="${color.body}" stroke-width="8" stroke-linecap="round" />
    <circle cx="51" cy="62" r="4" fill="${color.outline}" />
    <circle cx="67" cy="62" r="4" fill="${color.outline}" />
  `,
  pepper: color => `
    <path d="M62 27 C65 16 78 18 81 28" fill="none" stroke="${color.accent}" stroke-width="7" stroke-linecap="round" />
    <path d="M48 27 C84 39 83 84 57 101 C35 86 29 47 48 27Z" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M51 55 L60 62 L70 55" fill="none" stroke="${color.outline}" stroke-width="4" stroke-linecap="round" />
    <circle cx="51" cy="45" r="4" fill="${color.outline}" />
    <circle cx="70" cy="45" r="4" fill="${color.outline}" />
  `,
  spike: color => `
    <ellipse cx="60" cy="88" rx="48" ry="16" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M21 81 L31 50 L43 81 L54 45 L65 81 L77 48 L88 81 L99 55" fill="none" stroke="${color.outline}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M25 82 L34 58 L43 82 L54 55 L65 82 L77 58 L86 82 L96 61" fill="none" stroke="#d9f0c9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  `,
  torch: color => `
    <rect x="38" y="45" width="44" height="57" rx="14" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M60 13 C78 33 52 35 70 53 C48 49 39 32 60 13Z" fill="${color.accent}" stroke="${color.outline}" stroke-width="5" />
    <path d="M60 26 C66 36 56 39 63 47" fill="none" stroke="#ffe078" stroke-width="5" stroke-linecap="round" />
    ${face(color)}
  `,
  cactus: color => `
    <path d="M59 100 V32" stroke="${color.outline}" stroke-width="24" stroke-linecap="round" />
    <path d="M59 100 V32" stroke="${color.body}" stroke-width="17" stroke-linecap="round" />
    <path d="M42 63 H25 V47" stroke="${color.outline}" stroke-width="18" stroke-linecap="round" />
    <path d="M42 63 H25 V47" stroke="${color.body}" stroke-width="11" stroke-linecap="round" />
    <path d="M76 71 H95 V53" stroke="${color.outline}" stroke-width="18" stroke-linecap="round" />
    <path d="M76 71 H95 V53" stroke="${color.body}" stroke-width="11" stroke-linecap="round" />
    <ellipse cx="60" cy="25" rx="13" ry="8" fill="${color.accent}" stroke="${color.outline}" stroke-width="4" />
    ${face(color)}
  `,
  wind: color => `
    ${stem(color)}
    <circle cx="55" cy="57" r="31" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M73 48 H108 M71 61 H101 M71 74 H91" stroke="${color.accent}" stroke-width="7" stroke-linecap="round" />
    <circle cx="47" cy="50" r="4" fill="${color.outline}" />
  `,
  star: color => `
    ${stem(color)}
    <path d="M60 16 L72 43 L102 45 L79 65 L86 96 L60 80 L34 96 L41 65 L18 45 L48 43Z" fill="${color.body}" stroke="${color.outline}" stroke-width="5" stroke-linejoin="round" />
    ${face(color)}
  `,
  pumpkin: color => `
    <ellipse cx="60" cy="65" rx="43" ry="35" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M48 35 C52 25 70 25 73 35" fill="none" stroke="${color.leaf}" stroke-width="7" stroke-linecap="round" />
    <path d="M42 40 C34 55 35 78 45 95 M60 33 C55 54 55 80 60 100 M78 40 C88 56 86 80 75 96" fill="none" stroke="${color.accent}" stroke-width="4" stroke-linecap="round" />
    ${face(color)}
  `,
  magnet: color => `
    <ellipse cx="60" cy="62" rx="37" ry="26" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M42 48 V35 C42 23 78 23 78 35 V48" fill="none" stroke="${color.outline}" stroke-width="11" stroke-linecap="round" />
    <path d="M42 48 V35 C42 23 78 23 78 35 V48" fill="none" stroke="#d7d2de" stroke-width="6" stroke-linecap="round" />
    <rect x="43" y="67" width="34" height="30" rx="15" fill="#f2e8d9" stroke="${color.outline}" stroke-width="5" />
    ${face(color)}
  `,
  cabbage: color => `
    ${stem(color)}
    <circle cx="60" cy="53" r="34" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M34 55 C45 38 62 34 84 45 M41 73 C55 58 72 57 87 68 M52 29 C57 45 56 66 47 84" fill="none" stroke="${color.accent}" stroke-width="4" stroke-linecap="round" />
    ${face(color)}
  `,
  corn: color => `
    ${stem(color)}
    <ellipse cx="60" cy="55" rx="23" ry="39" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M45 52 H75 M45 65 H75 M52 24 V88 M61 19 V91 M70 28 V83" stroke="${color.accent}" stroke-width="3" stroke-linecap="round" />
    ${face(color)}
  `,
  garlic: color => `
    <path d="M60 26 C86 49 87 91 60 103 C33 91 34 49 60 26Z" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M50 32 C44 51 45 80 55 98 M70 32 C76 51 75 80 65 98" fill="none" stroke="${color.accent}" stroke-width="4" stroke-linecap="round" />
    <path d="M48 61 L56 57 M72 61 L64 57" stroke="${color.outline}" stroke-width="4" stroke-linecap="round" />
    <path d="M52 79 Q60 74 68 79" fill="none" stroke="${color.outline}" stroke-width="4" stroke-linecap="round" />
  `,
  umbrella: color => `
    ${stem(color)}
    <path d="M20 59 C30 22 90 22 100 59 C83 50 75 50 60 60 C45 50 36 50 20 59Z" fill="${color.body}" stroke="${color.outline}" stroke-width="5" stroke-linejoin="round" />
    <path d="M60 28 V80" stroke="${color.outline}" stroke-width="5" stroke-linecap="round" />
    ${face(color)}
  `,
  melon: color => `
    ${stem(color)}
    <ellipse cx="60" cy="54" rx="38" ry="32" fill="${color.body}" stroke="${color.outline}" stroke-width="5" />
    <path d="M34 54 C47 42 70 42 86 54 M37 69 C52 59 68 59 83 69" fill="none" stroke="${color.accent}" stroke-width="4" stroke-linecap="round" />
    <circle cx="51" cy="51" r="4" fill="${color.outline}" />
    <circle cx="69" cy="51" r="4" fill="${color.outline}" />
  `
};
