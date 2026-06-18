const LANES = 3;
const NOTES = [
  { note: "C", key: "a", solfege: "Do", lane: 0, plant: "peashooter", image: "../assets/characters/peashooter.png" },
  { note: "D", key: "s", solfege: "Re", lane: 1, plant: "sunflower", image: "../assets/characters/sunflower.png" },
  { note: "Eb", key: "w", solfege: "Me", lane: 1, plant: "snowpea", image: "../assets/characters/snow-pea.png" },
  { note: "E", key: "d", solfege: "Mi", lane: 2, plant: "wallnut", image: "../assets/characters/wall-nut.png" },
  { note: "F", key: "f", solfege: "Fa", lane: 0, plant: "snowpea", image: "../assets/characters/snow-pea.png" },
  { note: "F#", key: "t", solfege: "Fi", lane: 0, plant: "starfruit", image: "../assets/characters/starfruit.png" },
  { note: "G", key: "g", solfege: "Sol", lane: 1, plant: "repeater", image: "../assets/characters/repeater.png" },
  { note: "A", key: "h", solfege: "La", lane: 2, plant: "starfruit", image: "../assets/characters/starfruit.png" },
  { note: "Bb", key: "u", solfege: "Te", lane: 2, plant: "snowpea", image: "../assets/characters/snow-pea.png" },
  { note: "B", key: "j", solfege: "Ti", lane: 0, plant: "cabbage", image: "../assets/characters/cabbage-pult.png" },
  { note: "C2", key: "k", solfege: "Do", lane: 1, plant: "cherry", image: "../assets/characters/cherry-bomb.png" },
  { note: "D2", key: "l", solfege: "Re", lane: 1, plant: "cabbage", image: "../assets/characters/cabbage-pult.png" },
  { note: "Eb2", key: ";", solfege: "Me", lane: 2, plant: "snowpea", image: "../assets/characters/snow-pea.png" },
  { note: "F2", key: "'", solfege: "Fa", lane: 0, plant: "cherry", image: "../assets/characters/cherry-bomb.png" }
];

const SONGS = [
  {
    title: "Jingle Bells",
    shortTitle: "Jingle Bells",
    tempo: "4/4",
    medium: true,
    measures: [
      ["E", "E", "E"],
      ["E", "E", "E"],
      ["E", "G", "C", "D", "E"],
      ["F", "F", "F", "F"],
      ["F", "E", "E", "E"],
      ["E", "D", "D", "E"],
      ["D", "G"]
    ]
  },
  {
    title: "When the Saints Go Marching In",
    shortTitle: "Saints",
    tempo: "4/4",
    medium: true,
    measures: [
      ["C", "E", "F", "G"],
      ["C", "E", "F", "G"],
      ["C", "E", "F", "G", "E", "C"],
      ["E", "D"],
      ["E", "E", "D", "C"],
      ["C", "E", "G", "G"],
      ["F", "E", "F", "G", "E", "C"],
      ["D", "C"]
    ]
  },
  {
    title: "Yankee Doodle",
    shortTitle: "Yankee",
    tempo: "4/4",
    medium: true,
    measures: [
      ["C", "C", "D", "E"],
      ["C", "E", "D"],
      ["C", "C", "D", "E"],
      ["C", "B", "C"],
      ["D", "D", "E", "F"],
      ["G", "E", "D", "C"],
      ["B", "G", "A", "B"],
      ["C", "C"]
    ]
  },
  {
    title: "Scale Sprint",
    shortTitle: "Scale Sprint",
    tempo: "Fast 4/4",
    hard: true,
    measures: [
      ["C", "D", "E", "F", "G", "A", "B", "C2"],
      ["C2", "B", "A", "G", "F", "E", "D", "C"],
      ["C", "E", "G", "C2", "B", "G", "E", "C"],
      ["D", "F", "A", "C2", "A", "F", "D", "C"],
      ["C", "D", "E", "F", "G", "F", "E", "D"],
      ["C", "E", "F", "G", "A", "G", "F", "E"]
    ]
  },
  {
    title: "Arpeggio Storm",
    shortTitle: "Arpeggio Storm",
    tempo: "Fast 3/4",
    hard: true,
    measures: [
      ["C", "E", "G", "C2", "G", "E"],
      ["D", "F", "A", "C2", "A", "F"],
      ["E", "G", "B", "C2", "B", "G"],
      ["F", "A", "C2", "A", "F", "D"],
      ["G", "B", "C2", "B", "G", "E"],
      ["C2", "A", "F", "D", "F", "A"],
      ["C", "E", "G", "B", "G", "E"],
      ["C", "D", "E", "G", "C2"]
    ]
  },
  {
    title: "Boss Ode",
    shortTitle: "Boss Ode",
    tempo: "Boss 4/4",
    hard: true,
    measures: [
      ["E", "E", "F", "G", "G", "F", "E", "D"],
      ["C", "C", "D", "E", "E", "D", "D"],
      ["E", "E", "F", "G", "G", "F", "E", "D"],
      ["C", "C", "D", "E", "D", "C", "C"],
      ["D", "D", "E", "C", "D", "E", "F", "E", "C"],
      ["D", "E", "F", "E", "D", "C", "D", "G"],
      ["E", "E", "F", "G", "G", "F", "E", "D"],
      ["C", "C", "D", "E", "D", "C", "C"]
    ]
  },
  {
    title: "Canon Run",
    shortTitle: "Canon Run",
    tempo: "Fast 4/4",
    hard: true,
    measures: [
      ["C", "G", "A", "E", "F", "C", "F", "G"],
      ["C2", "G", "A", "E", "F", "C", "F", "G"],
      ["E", "G", "C2", "B", "A", "G", "F", "E"],
      ["D", "F", "A", "G", "F", "E", "D", "C"],
      ["C", "E", "G", "A", "G", "E", "C", "D"],
      ["E", "F", "G", "C2", "B", "A", "G", "C2"]
    ]
  },
  {
    title: "Broken Chord Chase",
    shortTitle: "Broken Chords",
    tempo: "Fast 3/4",
    hard: true,
    measures: [
      ["C", "E", "G", "E", "C", "E"],
      ["D", "F", "A", "F", "D", "F"],
      ["E", "G", "B", "G", "E", "G"],
      ["F", "A", "C2", "A", "F", "A"],
      ["G", "B", "C2", "B", "G", "B"],
      ["C2", "A", "F", "A", "C2", "A"],
      ["B", "G", "E", "G", "B", "G"],
      ["C", "E", "G", "C2"]
    ]
  },
  {
    title: "Volcano Scale",
    shortTitle: "Volcano Scale",
    tempo: "Boss 4/4",
    hard: true,
    measures: [
      ["C", "D", "E", "F", "G", "A", "B", "C2"],
      ["D", "E", "F", "G", "A", "B", "C2", "B"],
      ["E", "F", "G", "A", "B", "C2", "B", "A"],
      ["F", "G", "A", "B", "C2", "B", "A", "G"],
      ["G", "A", "B", "C2", "B", "A", "G", "F"],
      ["C2", "B", "A", "G", "F", "E", "D", "C"]
    ]
  },
  {
    title: "Garden Chase",
    shortTitle: "Garden Chase",
    tempo: "Fast 4/4",
    hard: true,
    measures: [
      ["E", "G", "A", "G", "E", "D", "C", "D"],
      ["E", "F", "G", "A", "G", "F", "E", "D"],
      ["C", "E", "G", "A", "C2", "A", "G", "E"],
      ["D", "F", "A", "B", "C2", "B", "A", "F"],
      ["G", "A", "B", "C2", "G", "E", "D", "C"],
      ["C", "D", "E", "G", "A", "G", "E", "C"]
    ]
  },
  {
    title: "Thunder Steps",
    shortTitle: "Thunder Steps",
    tempo: "Boss 4/4",
    hard: true,
    measures: [
      ["C", "G", "C2", "G", "C", "G", "C2", "G"],
      ["D", "A", "C2", "A", "D", "A", "C2", "A"],
      ["E", "B", "C2", "B", "E", "B", "C2", "B"],
      ["F", "A", "C2", "A", "F", "A", "C2", "A"],
      ["G", "B", "C2", "B", "G", "B", "C2", "B"],
      ["C2", "B", "G", "E", "C", "E", "G", "C2"]
    ]
  },
  {
    title: "Final Boss Etude",
    shortTitle: "Final Boss",
    tempo: "Final 4/4",
    hard: true,
    measures: [
      ["C", "E", "G", "C2", "B", "G", "E", "C"],
      ["D", "F", "A", "C2", "B", "A", "F", "D"],
      ["E", "G", "B", "C2", "B", "G", "E", "D"],
      ["F", "A", "C2", "B", "A", "F", "E", "D"],
      ["G", "B", "C2", "A", "G", "F", "E", "D"],
      ["C", "D", "E", "F", "G", "A", "B", "C2"],
      ["C2", "B", "A", "G", "F", "E", "D", "C"],
      ["C", "E", "G", "C2", "G", "E", "C"]
    ]
  },
  {
    title: "Ninja Scale",
    shortTitle: "Ninja Scale",
    tempo: "Fast 4/4",
    hard: true,
    measures: [
      ["C", "E", "D", "F", "E", "G", "F", "A"],
      ["G", "B", "A", "C2", "B", "G", "E", "C"],
      ["D", "F", "E", "G", "F", "A", "G", "B"],
      ["C2", "A", "F", "D", "E", "G", "B", "C2"],
      ["C2", "B", "A", "G", "F", "E", "D", "C"],
      ["C", "D", "F", "E", "G", "F", "A", "G"]
    ]
  },
  {
    title: "Moonlight Run",
    shortTitle: "Moon Run",
    tempo: "Fast 6/8",
    hard: true,
    measures: [
      ["A", "G", "E", "C", "E", "G"],
      ["B", "A", "F", "D", "F", "A"],
      ["C2", "B", "G", "E", "G", "B"],
      ["A", "C2", "A", "F", "D", "F"],
      ["G", "B", "G", "E", "C", "E"],
      ["A", "G", "F", "E", "D", "C"]
    ]
  },
  {
    title: "Pirate Jig",
    shortTitle: "Pirate Jig",
    tempo: "Fast 3/4",
    hard: true,
    measures: [
      ["E", "G", "E", "C", "D", "E"],
      ["F", "A", "F", "D", "E", "F"],
      ["G", "B", "G", "E", "F", "G"],
      ["A", "C2", "A", "F", "G", "A"],
      ["C2", "B", "A", "G", "F", "E"],
      ["D", "F", "E", "D", "C"]
    ]
  },
  {
    title: "Robot March",
    shortTitle: "Robot March",
    tempo: "Boss 4/4",
    hard: true,
    measures: [
      ["C", "C", "G", "G", "E", "E", "G", "G"],
      ["D", "D", "A", "A", "F", "F", "A", "A"],
      ["E", "E", "B", "B", "G", "G", "B", "B"],
      ["F", "F", "C2", "C2", "A", "A", "C2", "C2"],
      ["G", "F", "E", "D", "C", "D", "E", "F"],
      ["G", "B", "C2", "B", "G", "E", "D", "C"]
    ]
  },
  {
    title: "Dragon Etude",
    shortTitle: "Dragon Etude",
    tempo: "Final 4/4",
    hard: true,
    measures: [
      ["C", "D", "E", "G", "A", "G", "E", "D"],
      ["E", "F", "G", "B", "C2", "B", "G", "F"],
      ["G", "A", "B", "C2", "A", "F", "D", "C"],
      ["C", "E", "G", "C2", "B", "A", "G", "E"],
      ["D", "F", "A", "C2", "A", "F", "D", "C"],
      ["E", "G", "B", "C2", "B", "G", "E", "C"]
    ]
  },
  {
    title: "Saints Rush",
    shortTitle: "Saints Rush",
    tempo: "Fast 4/4",
    hard: true,
    measures: [
      ["C", "E", "F", "G", "C", "E", "F", "G"],
      ["C", "E", "F", "G", "E", "C", "E", "D"],
      ["E", "E", "D", "C", "C", "E", "G", "G"],
      ["F", "E", "F", "G", "E", "C", "D", "C"],
      ["G", "A", "G", "E", "F", "G", "E", "C"],
      ["C", "E", "G", "C2", "G", "E", "D", "C"]
    ]
  },
  {
    title: "Minor Maze",
    shortTitle: "Minor Maze",
    tempo: "Boss 4/4",
    hard: true,
    measures: [
      ["A", "C2", "B", "A", "G", "E", "G", "A"],
      ["F", "A", "G", "F", "E", "D", "E", "F"],
      ["E", "G", "F", "E", "D", "C", "D", "E"],
      ["A", "G", "E", "C", "D", "E", "G", "A"],
      ["C2", "B", "A", "G", "A", "G", "E", "D"],
      ["C", "D", "E", "G", "A", "G", "E", "A"]
    ]
  },
  {
    title: "Bells Remix",
    shortTitle: "Bells Remix",
    tempo: "Fast 4/4",
    hard: true,
    measures: [
      ["E", "E", "E", "G", "E", "D", "C", "D"],
      ["E", "E", "E", "G", "A", "G", "E", "D"],
      ["E", "G", "C", "D", "E", "F", "E", "D"],
      ["F", "F", "F", "A", "F", "E", "D", "E"],
      ["G", "G", "F", "E", "D", "C", "D", "E"],
      ["D", "G", "B", "C2", "B", "G", "E", "C"]
    ]
  },
  {
    title: "Sky Ladder",
    shortTitle: "Sky Ladder",
    tempo: "Fast 4/4",
    hard: true,
    measures: [
      ["C", "D", "E", "G", "D", "E", "F", "A"],
      ["E", "F", "G", "B", "F", "G", "A", "C2"],
      ["G", "A", "B", "C2", "A", "G", "F", "E"],
      ["D", "E", "F", "A", "G", "F", "E", "D"],
      ["C", "E", "G", "B", "C2", "B", "G", "E"],
      ["C", "D", "E", "F", "G", "A", "B", "C2"]
    ]
  },
  {
    title: "Zombie Finale",
    shortTitle: "Zombie Finale",
    tempo: "Final 4/4",
    hard: true,
    measures: [
      ["C", "G", "E", "C", "D", "A", "F", "D"],
      ["E", "B", "G", "E", "F", "C2", "A", "F"],
      ["G", "B", "C2", "G", "A", "C2", "B", "A"],
      ["C2", "B", "A", "G", "F", "E", "D", "C"],
      ["C", "E", "G", "C2", "B", "A", "G", "E"],
      ["D", "F", "A", "C2", "B", "G", "E", "C"],
      ["C", "D", "E", "G", "A", "B", "C2", "B"],
      ["C2", "G", "E", "C", "G", "E", "C"]
    ]
  },
  {
    title: "Pokemon Theme - Lead Sheet",
    shortTitle: "Pokemon Lead",
    tempo: "Theme 4/4",
    hard: true,
    measures: [
      ["A", "A", "A", "A", "A"],
      ["G", "E", "C", "C"],
      ["A", "A", "G", "F"],
      ["G"],
      ["F", "Bb", "Bb", "Bb"],
      ["A", "G", "F", "F"],
      ["A", "A", "G", "F"],
      ["A"]
    ]
  },
  {
    title: "Pokemon Theme - Piano Page 1",
    shortTitle: "Pokemon Piano",
    tempo: "Theme 4/4",
    hard: true,
    measures: [
      ["A", "A", "A", "A", "A"],
      ["G", "E", "C", "C"],
      ["A", "A", "G", "F"],
      ["G"],
      ["F", "Bb", "Bb", "Bb"],
      ["A", "G", "F", "F"],
      ["A", "A", "G", "F"],
      ["A"],
      ["A", "A", "A", "A", "A"],
      ["G", "E", "C", "C"],
      ["A", "A", "G", "F"],
      ["G"],
      ["C", "C", "C", "C", "A"],
      ["G", "F", "F"],
      ["A", "Bb", "A", "G", "F", "A"],
      ["G", "C", "D", "E"]
    ]
  },
  {
    title: "Plants vs Zombies Theme - Right Hand",
    shortTitle: "PVZ Theme",
    tempo: "Theme 4/4",
    hard: true,
    measures: [
      ["Bb", "C2", "Bb", "D2", "Bb", "G"],
      ["Bb", "G", "D2", "G"],
      ["Bb", "C2", "Bb", "D2", "Bb", "G"],
      ["Bb", "G", "D2", "G"],
      ["Bb", "G", "D2", "G"],
      ["Bb", "C2", "Bb", "D2", "Bb", "G"],
      ["Bb", "G", "D2", "G"],
      ["G", "A", "Bb", "C2", "Bb", "A", "G", "F#"],
      ["F#", "G", "A", "Bb", "C2", "D2", "Eb2"],
      ["Bb", "C2", "Bb", "D2", "Bb", "G"],
      ["Bb", "G", "D2", "G"],
      ["G", "A", "Bb", "C2", "Bb", "A", "G", "F#"],
      ["F#", "G", "A", "Bb", "C2", "D2", "Eb2"],
      ["Bb", "C2", "Bb", "D2", "Bb", "G"],
      ["Bb", "G", "D2", "G"],
      ["Bb", "C2", "Bb", "D2", "Bb", "G"],
      ["Bb", "G", "D2", "G"],
      ["D2", "Bb", "C2", "A", "G"],
      ["F2", "D2", "C2", "Bb"],
      ["D2", "Bb", "F#", "G"],
      ["F2", "D2", "C2", "Bb"],
      ["D2", "Bb", "G"],
      ["D2", "Eb2", "D2", "C2", "Bb", "A", "G", "F#"],
      ["F#", "G", "A", "Bb", "C2", "D2", "Eb2", "D2"],
      ["F2", "Eb2", "D2", "C2", "Bb"],
      ["D2", "C2", "Bb", "A", "G"],
      ["G"],
      ["G", "A", "Bb", "C2", "D2"],
      ["Eb2", "D2", "C2", "Bb", "D2", "C2", "G"]
    ]
  }
];

const REFERENCE_SONG_INDEXES = [0, 1, 2, 22, 23, 24];
SONGS.splice(0, SONGS.length, ...REFERENCE_SONG_INDEXES.map((index) => SONGS[index]));

const CUSTOM_SONG_INDEX = SONGS.length;
const VALID_NOTE_NAMES = new Set(NOTES.map((item) => item.note));

const DIFFICULTIES = {
  practice: {
    label: "Practice",
    gardenHealth: 6,
    spawnDelay: 1150,
    spawnGap: 2350,
    speed: 0.78,
    hp: 0.85,
    wrongPush: 8,
    bossEveryMeasure: false
  },
  rush: {
    label: "Zombie Rush",
    gardenHealth: 4,
    spawnDelay: 650,
    spawnGap: 1450,
    speed: 1.18,
    hp: 1.1,
    wrongPush: 22,
    bossEveryMeasure: false
  },
  boss: {
    label: "Boss Mode",
    gardenHealth: 3,
    spawnDelay: 420,
    spawnGap: 1050,
    speed: 1.36,
    hp: 1.25,
    wrongPush: 34,
    bossEveryMeasure: true
  }
};

const dom = {
  battlefield: document.querySelector("#battlefield"),
  fxLayer: document.querySelector("#fxLayer"),
  keyboard: document.querySelector("#keyboard"),
  songButtons: Array.from(document.querySelectorAll("[data-song]")),
  customSongButton: document.querySelector("#customSongButton"),
  customSongInput: document.querySelector("#customSongInput"),
  loadCustomButton: document.querySelector("#loadCustomButton"),
  clearCustomButton: document.querySelector("#clearCustomButton"),
  difficultyButtons: Array.from(document.querySelectorAll("[data-difficulty]")),
  songLabel: document.querySelector("#songLabel"),
  sheetMusic: document.querySelector("#sheetMusic"),
  notePattern: document.querySelector("#notePattern"),
  plantPower: document.querySelector("#plantPower"),
  gardenHealth: document.querySelector("#gardenHealth"),
  comboCount: document.querySelector("#comboCount"),
  starCount: document.querySelector("#starCount"),
  message: document.querySelector("#message"),
  startButton: document.querySelector("#startButton"),
  demoButton: document.querySelector("#demoButton"),
  restartButton: document.querySelector("#restartButton"),
  soundButton: document.querySelector("#soundButton"),
  endOverlay: document.querySelector("#endOverlay"),
  endKicker: document.querySelector("#endKicker"),
  endTitle: document.querySelector("#endTitle"),
  playAgainButton: document.querySelector("#playAgainButton")
};

const state = {
  running: false,
  gameOver: false,
  soundOn: true,
  difficulty: "practice",
  gardenHealth: DIFFICULTIES.practice.gardenHealth,
  stars: 0,
  combo: 0,
  plantPower: 0,
  songIndex: 0,
  measureIndex: 0,
  noteIndex: 0,
  demoing: false,
  demoMeasureIndex: 0,
  demoNoteIndex: 0,
  demoTimer: null,
  songComplete: false,
  zombies: [],
  shots: [],
  plants: [],
  nextZombieAt: 0,
  lastFrameAt: performance.now(),
  customSong: null,
  audioContext: null
};

let stageWidth = 0;

function currentSong() {
  if (state.songIndex === CUSTOM_SONG_INDEX) {
    return state.customSong || SONGS[0];
  }
  return SONGS[state.songIndex] || SONGS[0];
}

function songByIndex(index) {
  if (index === CUSTOM_SONG_INDEX) return state.customSong;
  return SONGS[index] || null;
}

function refreshSongButtons() {
  dom.songButtons.forEach((button) => {
    button.classList.toggle("is-selected", Number(button.dataset.song) === state.songIndex);
  });
  dom.customSongButton.disabled = !state.customSong;
  dom.customSongButton.textContent = state.customSong
    ? `Imported (${state.customSong.measures.length})`
    : "Imported Theme";
}

function selectSong(index) {
  if (!songByIndex(index)) return;
  state.songIndex = index;
  refreshSongButtons();
  resetGame();
}

function currentMeasure() {
  return currentSong().measures[Math.min(state.measureIndex, currentSong().measures.length - 1)];
}

function currentDifficulty() {
  return DIFFICULTIES[state.difficulty];
}

function noteConfig(noteName) {
  return NOTES.find((item) => item.note === noteName);
}

function makeBattlefield() {
  dom.battlefield.innerHTML = "";
  state.plants = [];
  for (let lane = 0; lane < LANES; lane += 1) {
    const laneEl = document.createElement("div");
    laneEl.className = "lane";
    laneEl.dataset.lane = lane;
    dom.battlefield.append(laneEl);

    const config = NOTES.find((item) => item.lane === lane) || NOTES[0];
    const plant = {
      lane,
      el: document.createElement("div")
    };
    plant.el.className = "plant";
    plant.el.innerHTML = `<img src="${config.image}" alt="" />`;
    laneEl.append(plant.el);
    state.plants.push(plant);
  }
  syncStage();
}

function makeKeyboard() {
  dom.keyboard.innerHTML = "";
  NOTES.forEach((config) => {
    const button = document.createElement("button");
    button.className = "piano-key";
    button.type = "button";
    button.dataset.note = config.note;
    button.innerHTML = `<kbd>${config.key.toUpperCase()}</kbd><span>${config.note}</span><small>${config.solfege}</small>`;
    button.addEventListener("click", () => playNote(config.note));
    dom.keyboard.append(button);
  });
}

function renderLesson() {
  const song = currentSong();
  const displayMeasureIndex = state.demoing ? state.demoMeasureIndex : state.measureIndex;
  const displayNoteIndex = state.demoing ? state.demoNoteIndex : state.noteIndex;
  const measure = song.measures[Math.min(displayMeasureIndex, song.measures.length - 1)];
  const measureNumber = Math.min(displayMeasureIndex + 1, song.measures.length);
  dom.songLabel.textContent = state.songComplete
    ? `${song.title} · clear the lawn`
    : `${song.title} · ${song.tempo} · Measure ${measureNumber}/${song.measures.length}`;
  renderSheet();
  dom.notePattern.innerHTML = "";
  if (state.songComplete) {
    const el = document.createElement("div");
    el.className = "target-note is-current";
    el.textContent = "Clear";
    dom.notePattern.append(el);
    refreshKeys();
    return;
  }
  measure.forEach((note, index) => {
    const el = document.createElement("div");
    el.className = "target-note";
    el.textContent = note;
    el.classList.toggle("is-current", index === displayNoteIndex);
    el.classList.toggle("is-done", index < displayNoteIndex);
    dom.notePattern.append(el);
  });
  refreshKeys();
}

function renderSheet() {
  const song = currentSong();
  const displayMeasureIndex = state.demoing ? state.demoMeasureIndex : state.measureIndex;
  const displayNoteIndex = state.demoing ? state.demoNoteIndex : state.noteIndex;
  dom.sheetMusic.innerHTML = "";
  song.measures.forEach((measure, measureIndex) => {
    const measureEl = document.createElement("div");
    measureEl.className = "sheet-measure";
    measureEl.classList.toggle("is-current", !state.songComplete && measureIndex === displayMeasureIndex);
    measureEl.classList.toggle("is-done", state.songComplete || measureIndex < displayMeasureIndex);
    measure.forEach((note, noteIndex) => {
      const noteEl = document.createElement("span");
      noteEl.className = "sheet-note";
      noteEl.textContent = note;
      noteEl.classList.toggle("is-current", measureIndex === displayMeasureIndex && noteIndex === displayNoteIndex);
      measureEl.append(noteEl);
    });
    dom.sheetMusic.append(measureEl);
  });
}

function refreshKeys() {
  const target = state.songComplete
    ? null
    : state.demoing
      ? currentSong().measures[state.demoMeasureIndex]?.[state.demoNoteIndex]
      : currentMeasure()[state.noteIndex];
  Array.from(dom.keyboard.children).forEach((button) => {
    button.classList.toggle("is-target", button.dataset.note === target && state.running);
    button.classList.toggle("is-demo", button.dataset.note === target && state.demoing);
  });
}

function refreshHud() {
  dom.gardenHealth.textContent = state.gardenHealth;
  dom.comboCount.textContent = state.combo;
  dom.starCount.textContent = state.stars;
  dom.plantPower.style.width = `${Math.min(100, state.plantPower)}%`;
}

function setMessage(text) {
  dom.message.textContent = text;
}

function parseCustomSongInput(value) {
  const lines = value
    .trim()
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const sourceMeasures = lines.length > 1 ? lines : value.split("|");
  const measures = sourceMeasures
    .map((measure) => measure
      .toUpperCase()
      .replace(/D[\s-]*2/g, "D2")
      .replace(/E[\s-]*(B|♭)[\s-]*2/g, "Eb2")
      .replace(/F[\s-]*2/g, "F2")
      .replace(/C[\s-]*2/g, "C2")
      .replace(/E[\s-]*(B|♭)/g, "Eb")
      .replace(/D[\s-]*#/g, "Eb")
      .replace(/F[\s-]*#/g, "F#")
      .replace(/G[\s-]*(B|♭)/g, "F#")
      .replace(/A[\s-]*#/g, "Bb")
      .replace(/B[\s-]*(B|♭)/g, "Bb")
      .match(/Eb2|D2|F2|C2|Bb|Eb|F#|[ABCDEFG]/g) || [])
    .filter((measure) => measure.length > 0)
    .map((measure) => measure.filter((note) => VALID_NOTE_NAMES.has(note)));

  const validMeasures = measures.filter((measure) => measure.length > 0);
  const totalNotes = validMeasures.reduce((total, measure) => total + measure.length, 0);
  if (totalNotes < 4) {
    return null;
  }

  return {
    title: "Imported Theme Practice",
    shortTitle: "Imported",
    tempo: "Custom",
    hard: totalNotes >= 28,
    measures: validMeasures.map((measure) => measure.slice(0, 12)).slice(0, 16)
  };
}

function loadCustomSong() {
  const song = parseCustomSongInput(dom.customSongInput.value);
  if (!song) {
    setMessage("Paste notes like C D Eb F# | G A Bb C2 D2.");
    dom.customSongInput.focus();
    return;
  }
  state.customSong = song;
  state.songIndex = CUSTOM_SONG_INDEX;
  refreshSongButtons();
  resetGame();
  setMessage(`Imported ${song.measures.length} measures. Press Demo or Start.`);
}

function clearCustomSong() {
  state.customSong = null;
  dom.customSongInput.value = "";
  if (state.songIndex === CUSTOM_SONG_INDEX) {
    state.songIndex = 0;
  }
  refreshSongButtons();
  resetGame();
  setMessage("Imported song cleared.");
}

function startGame() {
  if (state.demoing) {
    stopDemo({ message: false, render: false });
  }
  if (state.gameOver) {
    resetGame();
  }
  state.running = true;
  state.nextZombieAt = performance.now() + currentDifficulty().spawnDelay;
  dom.startButton.textContent = "Playing";
  setMessage(`${currentDifficulty().label}: ${currentSong().title}.`);
  refreshKeys();
  playSound("start");
}

function resetGame() {
  stopDemo({ message: false, render: false });
  state.running = false;
  state.gameOver = false;
  state.gardenHealth = currentDifficulty().gardenHealth;
  state.stars = 0;
  state.combo = 0;
  state.plantPower = 0;
  state.measureIndex = 0;
  state.noteIndex = 0;
  state.songComplete = false;
  state.zombies.forEach((zombie) => zombie.el.remove());
  state.shots.forEach((shot) => shot.el.remove());
  state.zombies = [];
  state.shots = [];
  dom.fxLayer.innerHTML = "";
  dom.endOverlay.classList.add("is-hidden");
  dom.startButton.textContent = "Start";
  setMessage(`Press Start for ${currentSong().title}.`);
  refreshSongButtons();
  renderLesson();
  refreshHud();
  refreshDifficultyButtons();
}

function startDemo() {
  if (state.running) return;
  if (state.gameOver) {
    resetGame();
  }
  if (state.demoing) {
    stopDemo();
    return;
  }

  state.demoing = true;
  state.demoMeasureIndex = 0;
  state.demoNoteIndex = 0;
  dom.demoButton.textContent = "Stop";
  dom.startButton.disabled = true;
  setMessage(`Demo: ${currentSong().title}.`);
  runDemoStep();
}

function runDemoStep() {
  if (!state.demoing) return;

  const song = currentSong();
  if (state.demoMeasureIndex >= song.measures.length) {
    stopDemo({ message: false });
    setMessage(`Demo finished. Press Start for ${song.title}.`);
    return;
  }

  const measure = song.measures[state.demoMeasureIndex];
  const noteName = measure[state.demoNoteIndex];
  const config = noteConfig(noteName);
  renderLesson();
  pulseKey(noteName);
  playPianoTone(noteName);
  if (config) {
    powerPlant(config.lane, config.image);
  }

  state.demoNoteIndex += 1;
  let delay = currentSong().hard ? 330 : 390;
  if (state.demoNoteIndex >= measure.length) {
    state.demoMeasureIndex += 1;
    state.demoNoteIndex = 0;
    delay = 620;
  }
  state.demoTimer = setTimeout(runDemoStep, delay);
}

function stopDemo({ message = true, render = true } = {}) {
  if (state.demoTimer) {
    clearTimeout(state.demoTimer);
  }
  state.demoTimer = null;
  state.demoing = false;
  state.demoMeasureIndex = 0;
  state.demoNoteIndex = 0;
  dom.demoButton.textContent = "Demo";
  dom.startButton.disabled = false;
  if (message) {
    setMessage(`Press Start for ${currentSong().title}.`);
  }
  if (render) {
    renderLesson();
  }
}

function playNote(noteName) {
  pulseKey(noteName);
  playPianoTone(noteName);
  if (!state.running || state.gameOver) {
    setMessage("Press Start first.");
    return;
  }

  if (state.songComplete) {
    const config = noteConfig(noteName);
    if (!config) return;
    state.combo += 1;
    fireMusicShot(config);
    if (state.combo % 4 === 0) {
      fireMusicShot({ ...config, lane: (config.lane + 1) % LANES });
    }
    powerPlant(config.lane, config.image);
    setMessage("Song complete. Clear the remaining zombies.");
    refreshHud();
    return;
  }

  const target = currentMeasure()[state.noteIndex];
  if (noteName === target) {
    handleCorrectNote(noteName);
    return;
  }

  state.combo = 0;
  state.plantPower = Math.max(0, state.plantPower - 10);
  hurryZombies();
  setMessage(`Almost. Try ${target} next.`);
  playSound("miss");
  refreshHud();
}

function handleCorrectNote(noteName) {
  const config = noteConfig(noteName);
  state.combo += 1;
  state.plantPower += state.combo >= 4 ? 18 : 12;
  state.stars += 1;
  fireMusicShot(config);
  if (state.combo >= 8 && state.combo % 4 === 0) {
    fireMusicShot({ ...config, lane: (config.lane + 1) % LANES, note: `${config.note}` });
    showComboFlash(`${state.combo} combo`);
  }
  powerPlant(config.lane, config.image);
  sunBurst(config.lane);

  state.noteIndex += 1;
  if (state.noteIndex >= currentMeasure().length) {
    completeMeasure();
    refreshHud();
    if (state.gameOver) return;
  } else {
    setMessage(`${noteName} worked. Next note: ${currentMeasure()[state.noteIndex]}.`);
    refreshHud();
  }

  renderLesson();
}

function completeMeasure() {
  state.measureIndex += 1;
  state.noteIndex = 0;
  state.plantPower = Math.min(100, state.plantPower + 18);
  if (state.plantPower >= 100) {
    melodyBlast();
    state.plantPower = 25;
  }
  if (currentDifficulty().bossEveryMeasure || currentSong().hard) {
    spawnBossZombie();
  }
  if (state.measureIndex >= currentSong().measures.length) {
    completeSong();
    return;
  }
  setMessage(`Measure complete. Next measure: ${state.measureIndex + 1}.`);
  playSound("pattern");
}

function completeSong() {
  state.stars += 12;
  state.songComplete = true;
  state.plantPower = 100;
  melodyBlast();
  renderLesson();
  setMessage(`${currentSong().title} complete. Now finish the boss.`);
  checkWinAfterClear();
}

function powerPlant(lane, image) {
  const plant = state.plants[lane];
  if (!plant) return;
  plant.el.innerHTML = `<img src="${image}" alt="" />`;
  plant.el.classList.remove("is-powered");
  void plant.el.offsetWidth;
  plant.el.classList.add("is-powered");
}

function pulseKey(noteName) {
  const key = dom.keyboard.querySelector(`[data-note="${noteName}"]`);
  if (!key) return;
  key.classList.add("is-hit");
  setTimeout(() => key.classList.remove("is-hit"), 110);
}

function fireMusicShot(config) {
  const laneEl = laneElement(config.lane);
  if (!laneEl) return;
  const shot = {
    note: config.note,
    lane: config.lane,
    x: 92,
    damage: config.note === "C2" ? 5 : 3,
    speed: config.note === "C2" ? 680 : 540,
    el: document.createElement("div")
  };
  shot.el.className = "music-shot";
  shot.el.dataset.note = config.note;
  laneEl.append(shot.el);
  state.shots.push(shot);
  renderShot(shot);
}

function spawnZombie() {
  const lane = Math.floor(Math.random() * LANES);
  const strong = state.stars > 18 && Math.random() > 0.72;
  const difficulty = currentDifficulty();
  const laneEl = laneElement(lane);
  const zombie = {
    lane,
    x: stageWidth + 18,
    hp: Math.round((strong ? 9 : 5) * difficulty.hp),
    maxHp: Math.round((strong ? 9 : 5) * difficulty.hp),
    speed: (strong ? 21 : 28 + Math.min(22, state.stars * 0.38)) * difficulty.speed,
    el: document.createElement("div")
  };
  zombie.el.className = "zombie";
  zombie.el.innerHTML = `
    <img src="${strong ? "../assets/characters/conehead-zombie.png" : "../assets/characters/zombie.png"}" alt="" />
    <div class="zombie-health"><span></span></div>
  `;
  laneEl.append(zombie.el);
  state.zombies.push(zombie);
}

function spawnBossZombie() {
  if (state.zombies.some((zombie) => zombie.boss)) return;
  const lane = Math.floor(Math.random() * LANES);
  const laneEl = laneElement(lane);
  const hp = currentDifficulty().bossEveryMeasure ? 22 : 16;
  const zombie = {
    lane,
    x: stageWidth + 28,
    hp,
    maxHp: hp,
    speed: 13 * currentDifficulty().speed,
    boss: true,
    el: document.createElement("div")
  };
  zombie.el.className = "zombie boss";
  zombie.el.innerHTML = `
    <img src="../assets/characters/gargantuar.png" alt="" />
    <div class="zombie-health"><span></span></div>
  `;
  laneEl.append(zombie.el);
  state.zombies.push(zombie);
  showComboFlash("Boss!");
}

function renderZombie(zombie) {
  zombie.el.style.left = `${zombie.x}px`;
  const health = zombie.el.querySelector(".zombie-health span");
  health.style.width = `${Math.max(0, (zombie.hp / zombie.maxHp) * 100)}%`;
}

function renderShot(shot) {
  shot.el.style.left = `${shot.x}px`;
  shot.el.style.top = "42%";
}

function updateGame(now) {
  const dt = Math.min(0.05, (now - state.lastFrameAt) / 1000);
  state.lastFrameAt = now;

  if (!state.running || state.gameOver) {
    requestAnimationFrame(updateGame);
    return;
  }

  if (!state.songComplete && now >= state.nextZombieAt) {
    spawnZombie();
    const difficulty = currentDifficulty();
    const gap = Math.max(720, difficulty.spawnGap - state.stars * 18);
    state.nextZombieAt = now + gap + Math.random() * 700;
  }

  state.zombies.forEach((zombie) => {
    zombie.x -= zombie.speed * dt;
    if (zombie.x < 68) {
      zombie.hp = 0;
      zombie.reachedGarden = true;
      state.gardenHealth -= 1;
      state.combo = 0;
      setMessage("A zombie reached the garden. Keep playing the target notes.");
      playSound("miss");
    }
  });

  state.shots.forEach((shot) => {
    shot.x += shot.speed * dt;
    const hit = state.zombies.find((zombie) => zombie.lane === shot.lane && shot.x > zombie.x + 8 && shot.x < zombie.x + 76);
    if (hit) {
      hit.hp -= shot.damage;
      shot.dead = true;
      makeTinyBurst(shot.lane, hit.x + 30);
    }
    if (shot.x > stageWidth + 80) {
      shot.dead = true;
    }
  });

  state.zombies = state.zombies.filter((zombie) => {
    if (zombie.hp > 0) return true;
    if (!zombie.reachedGarden) {
      state.stars += 2;
      state.plantPower = Math.min(100, state.plantPower + 5);
      playSound("pop");
    }
    zombie.el.remove();
    return false;
  });

  state.shots = state.shots.filter((shot) => {
    if (!shot.dead) return true;
    shot.el.remove();
    return false;
  });

  state.zombies.forEach(renderZombie);
  state.shots.forEach(renderShot);
  refreshHud();

  if (state.gardenHealth <= 0) {
    endGame(false);
  } else {
    checkWinAfterClear();
  }

  requestAnimationFrame(updateGame);
}

function hurryZombies() {
  state.zombies.forEach((zombie) => {
    zombie.x -= currentDifficulty().wrongPush;
  });
}

function melodyBlast() {
  state.zombies.forEach((zombie) => {
    zombie.hp -= 5;
  });
  for (let lane = 0; lane < LANES; lane += 1) {
    sunBurst(lane);
  }
  setMessage("Plant Power full. A melody blast hit every lane.");
  playSound("blast");
}

function checkWinAfterClear() {
  if (!state.songComplete || state.gameOver) return;
  if (state.zombies.length || state.shots.length) return;
  endGame(true);
}

function endGame(won) {
  state.gameOver = true;
  state.running = false;
  dom.endKicker.textContent = won ? "Victory" : "Try again";
  dom.endTitle.textContent = won ? "The piano garden is safe." : "The zombies ate the melody.";
  dom.endOverlay.classList.remove("is-hidden");
  dom.startButton.textContent = "Start";
}

function sunBurst(lane) {
  const laneEl = laneElement(lane);
  if (!laneEl) return;
  const burst = document.createElement("div");
  burst.className = "sun-burst";
  burst.style.left = "86px";
  burst.style.top = "50%";
  laneEl.append(burst);
  setTimeout(() => burst.remove(), 540);
}

function makeTinyBurst(lane, x) {
  const laneEl = laneElement(lane);
  if (!laneEl) return;
  const burst = document.createElement("div");
  burst.className = "sun-burst";
  burst.style.width = "42px";
  burst.style.left = `${x}px`;
  burst.style.top = "48%";
  laneEl.append(burst);
  setTimeout(() => burst.remove(), 520);
}

function showComboFlash(text) {
  const el = document.createElement("div");
  el.className = "combo-flash";
  el.textContent = text;
  dom.fxLayer.append(el);
  setTimeout(() => el.remove(), 700);
}

function laneElement(lane) {
  return dom.battlefield.querySelector(`[data-lane="${lane}"]`);
}

function syncStage() {
  stageWidth = dom.battlefield.getBoundingClientRect().width;
}

function ensureAudio() {
  if (!state.audioContext) {
    state.audioContext = new AudioContext();
  }
  if (state.audioContext.state === "suspended") {
    state.audioContext.resume();
  }
}

function playPianoTone(noteName) {
  if (!state.soundOn) return;
  ensureAudio();
  const frequencies = {
    C: 261.63,
    D: 293.66,
    Eb: 311.13,
    E: 329.63,
    F: 349.23,
    "F#": 369.99,
    G: 392,
    A: 440,
    Bb: 466.16,
    B: 493.88,
    C2: 523.25,
    D2: 587.33,
    Eb2: 622.25,
    F2: 698.46
  };
  const ctx = state.audioContext;
  const frequency = frequencies[noteName] || 261.63;
  const output = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const now = ctx.currentTime;
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(4200, now);
  filter.frequency.exponentialRampToValueAtTime(1400, now + 0.55);
  output.gain.setValueAtTime(0.0001, now);
  output.gain.exponentialRampToValueAtTime(0.22, now + 0.012);
  output.gain.exponentialRampToValueAtTime(0.075, now + 0.14);
  output.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
  filter.connect(output);
  output.connect(ctx.destination);

  [
    { ratio: 1, gain: 0.86, detune: 0 },
    { ratio: 2, gain: 0.22, detune: 5 },
    { ratio: 3, gain: 0.12, detune: -7 },
    { ratio: 4, gain: 0.055, detune: 9 }
  ].forEach((partial) => {
    const oscillator = ctx.createOscillator();
    const partialGain = ctx.createGain();
    oscillator.type = partial.ratio === 1 ? "triangle" : "sine";
    oscillator.frequency.value = frequency * partial.ratio;
    oscillator.detune.value = partial.detune;
    partialGain.gain.value = partial.gain;
    oscillator.connect(partialGain);
    partialGain.connect(filter);
    oscillator.start(now);
    oscillator.stop(now + 1.2);
  });

  const hammer = ctx.createOscillator();
  const hammerGain = ctx.createGain();
  hammer.type = "square";
  hammer.frequency.value = frequency * 7.5;
  hammerGain.gain.setValueAtTime(0.035, now);
  hammerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
  hammer.connect(hammerGain);
  hammerGain.connect(output);
  hammer.start(now);
  hammer.stop(now + 0.04);
}

function playSound(kind) {
  if (!state.soundOn) return;
  ensureAudio();
  const sounds = {
    start: [196, 0.09],
    hit: [520, 0.05],
    miss: [130, 0.08],
    pop: [330, 0.05],
    pattern: [660, 0.12],
    blast: [92, 0.18]
  };
  const [frequency, duration] = sounds[kind] || sounds.hit;
  const ctx = state.audioContext;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = kind === "blast" ? "sawtooth" : "square";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration + 0.02);
}

dom.startButton.addEventListener("click", startGame);
dom.demoButton.addEventListener("click", startDemo);
dom.restartButton.addEventListener("click", resetGame);
dom.playAgainButton.addEventListener("click", resetGame);
dom.songButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextSongIndex = Number(button.dataset.song);
    if (!Number.isInteger(nextSongIndex)) return;
    selectSong(nextSongIndex);
  });
});
dom.loadCustomButton.addEventListener("click", loadCustomSong);
dom.clearCustomButton.addEventListener("click", clearCustomSong);
dom.difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!DIFFICULTIES[button.dataset.difficulty]) return;
    state.difficulty = button.dataset.difficulty;
    resetGame();
  });
});
dom.soundButton.addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  dom.soundButton.classList.toggle("is-on", state.soundOn);
  if (state.soundOn) {
    ensureAudio();
    playSound("pattern");
  }
});

function refreshDifficultyButtons() {
  dom.difficultyButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.difficulty === state.difficulty);
  });
  dom.soundButton.classList.toggle("is-on", state.soundOn);
}

window.addEventListener("keydown", (event) => {
  const config = NOTES.find((item) => item.key === event.key.toLowerCase());
  if (!config || event.repeat) return;
  event.preventDefault();
  playNote(config.note);
});

window.addEventListener("resize", () => {
  syncStage();
  state.zombies.forEach(renderZombie);
  state.shots.forEach(renderShot);
});

makeBattlefield();
makeKeyboard();
renderLesson();
refreshHud();
refreshDifficultyButtons();
requestAnimationFrame(updateGame);
