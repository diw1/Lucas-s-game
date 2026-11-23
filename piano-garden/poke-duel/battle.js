(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const audio = window.FireflyAudio;
  const creatures = {
    pikachu: {
      name: ["皮卡丘", "Pikachu"],
      move: ["电击", "Thunder Shock"],
      special: ["十万伏特", "Thunderbolt"],
      type: "electric",
    },
    charmander: {
      name: ["小火龙", "Charmander"],
      move: ["火花", "Ember"],
      special: ["喷射火焰", "Flamethrower"],
      type: "fire",
    },
    squirtle: {
      name: ["杰尼龟", "Squirtle"],
      move: ["水枪", "Water Gun"],
      special: ["水炮", "Hydro Pump"],
      type: "water",
    },
    bulbasaur: {
      name: ["妙蛙种子", "Bulbasaur"],
      move: ["藤鞭", "Vine Whip"],
      special: ["日光束", "Solar Beam"],
      type: "grass",
    },
    eevee: {
      name: ["伊布", "Eevee"],
      move: ["撞击", "Tackle"],
      special: ["高速星星", "Swift"],
      type: "normal",
    },
    psyduck: {
      name: ["可达鸭", "Psyduck"],
      move: ["水枪", "Water Gun"],
      special: ["水之波动", "Water Pulse"],
      type: "water",
    },
    gengar: {
      name: ["耿鬼", "Gengar"],
      move: ["舌舔", "Lick"],
      special: ["暗影球", "Shadow Ball"],
      type: "ghost",
    },
    lapras: {
      name: ["拉普拉斯", "Lapras"],
      move: ["水枪", "Water Gun"],
      special: ["冲浪", "Surf"],
      type: "water",
    },
    jigglypuff: {
      name: ["胖丁", "Jigglypuff"],
      move: ["拍击", "Pound"],
      special: ["巨声", "Hyper Voice"],
      type: "normal",
    },
    cubone: {
      name: ["卡拉卡拉", "Cubone"],
      move: ["骨棒", "Bone Club"],
      special: ["骨头回力镖", "Bonemerang"],
      type: "ground",
    },
    mareep: {
      name: ["咩利羊", "Mareep"],
      move: ["电击", "Thunder Shock"],
      special: ["放电", "Discharge"],
      type: "electric",
    },
    poliwag: {
      name: ["蚊香蝌蚪", "Poliwag"],
      move: ["泡沫", "Bubble"],
      special: ["泡沫光线", "Bubble Beam"],
      type: "water",
    },
    butterfree: {
      name: ["巴大蝶", "Butterfree"], move: ["起风", "Gust"],
      special: ["空气斩", "Air Slash"], type: "flying",
    },
    machop: {
      name: ["腕力", "Machop"], move: ["空手劈", "Karate Chop"],
      special: ["十字劈", "Cross Chop"], type: "fighting",
    },
    doduo: {
      name: ["嘟嘟", "Doduo"], move: ["啄", "Peck"],
      special: ["啄钻", "Drill Peck"], type: "flying",
    },
    hoothoot: {
      name: ["咕咕", "Hoothoot"], move: ["啄", "Peck"],
      special: ["空气斩", "Air Slash"], type: "flying",
    },
    ponyta: {
      name: ["小火马", "Ponyta"], move: ["火花", "Ember"],
      special: ["火焰轮", "Flame Wheel"], type: "fire",
    },
  };
  const starters = ["pikachu", "charmander", "squirtle", "bulbasaur"];
  const gyms = [
    {
      id: "rowboat", zone: 1,
      name: ["拉普拉斯湖", "Lapras Lake"],
      badge: ["船桨徽章", "Oar Badge"],
      foe: "lapras",
    },
    {
      id: "london", zone: 0,
      name: ["草地音乐厅", "Meadow Concert Hall"],
      badge: ["交响徽章", "Symphony Badge"],
      foe: "jigglypuff",
    },
    {
      id: "shepherd", zone: 0,
      name: ["牧羊草坡", "Shepherd’s Meadow"],
      badge: ["田园徽章", "Pastoral Badge"],
      foe: "mareep",
    },
    {
      id: "bongo", zone: 0, companion: true,
      name: ["骨鼓山道", "Bone Drum Trail"],
      badge: ["鼓点徽章", "Drumbeat Badge"],
      foe: "cubone",
    },
    {
      id: "bubble", zone: 1, companion: true,
      name: ["泡泡池塘", "Bubble Pond"],
      badge: ["涟漪徽章", "Ripple Badge"],
      foe: "poliwag",
    },
    {
      id: "scarf", zone: 0, shelf: "midway", companion: true,
      name: ["丝带花园", "Ribbon Garden"], badge: ["丝带徽章", "Ribbon Badge"], foe: "butterfree",
    },
    {
      id: "march", zone: 0, shelf: "midway", companion: true,
      name: ["行进广场", "Parade Square"], badge: ["步伐徽章", "Parade Badge"], foe: "machop",
    },
    {
      id: "bicycle", zone: 1, shelf: "midway", companion: true,
      name: ["河畔车道", "Riverside Cycleway"], badge: ["车轮徽章", "Wheel Badge"], foe: "doduo",
    },
    {
      id: "field", zone: 2, shelf: "midway", companion: true,
      name: ["月下麦田", "Moonlit Field"], badge: ["麦穗徽章", "Harvest Badge"], foe: "hoothoot",
    },
    {
      id: "pony", zone: 0, shelf: "midway",
      name: ["草原马场", "Prairie Paddock"], badge: ["马蹄徽章", "Horseshoe Badge"], foe: "ponyta",
    },
    {
      id: "oars", zone: 0,
      name: ["常青草地", "Viridian Meadow"],
      badge: ["回声徽章", "Echo Badge"],
      foe: "eevee",
    },
    {
      id: "drums", zone: 1,
      name: ["溪畔道馆", "Brookside Gym"],
      badge: ["静拍徽章", "Stillbeat Badge"],
      foe: "psyduck",
    },
    {
      id: "spell", zone: 2,
      name: ["月影道馆", "Moonshade Gym"],
      badge: ["半音徽章", "Half-step Badge"],
      foe: "gengar",
    },
  ].map((g) => {
    const song = window.DuelSongs[g.id];
    const earlierLesson = window.FireflyLessons.find((lesson) => lesson.id === g.id);
    return {
      ...g, song, shelf: g.shelf ?? (earlierLesson ? "review" : "chapter"),
      page: song.page ?? earlierLesson.page,
      bench: song.bench ?? [earlierLesson.bench, earlierLesson.benchEn],
    };
  });
  const shortcut = {
    z: 55,
    x: 56,
    c: 57,
    v: 58,
    b: 59,
    a: 60,
    w: 61,
    s: 62,
    e: 63,
    d: 64,
    f: 65,
    t: 66,
    g: 67,
    y: 68,
    h: 69,
    u: 70,
    j: 71,
    k: 72,
    o: 73,
    l: 74,
  };
  const whites = [55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74];
  const sharpNames = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  const storeKey = "lucas.pokemon-piano.v1";
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storeKey)) || {};
  } catch {}
  const earned = new Set(gyms.filter((g) => saved.badges?.includes?.(g.id)).map((g) => g.id));
  const available = () => [...starters, ...gyms.filter((g) => earned.has(g.id)).map((g) => g.foe)];
  let language = saved.language === "en" ? "en" : "zh";
  const tr = (pair) => pair[language === "en" ? 1 : 0];
  const t = (zh, en) => tr([zh, en]);
  let partner = available().includes(saved.partner) ? saved.partner : "pikachu";
  // Older saves open the new chapter once. Subsequent visits remember any choice, including review.
  const libraryVersion = 2;
  let gymIndex = saved.libraryVersion === libraryVersion
    ? Math.max(0, gyms.findIndex((g) => g.id === saved.gym))
    : 0;
  if (new URLSearchParams(location.search).get("pages") === "45-50" && gyms[gymIndex].shelf !== "midway")
    gymIndex = gyms.findIndex((g) => g.shelf === "midway");
  const minBpm = 40, maxBpm = 240;
  const limitBpm = (n) => Math.max(minBpm, Math.min(maxBpm, n));
  let bpm = Number.isInteger(saved.bpm) ? limitBpm(saved.bpm) : 120;
  let followTempo = saved.followTempo !== false;
  let liveBeatMs = 60000 / bpm;
  const beatSamples = [];
  let lastAttack = null, retrying = false, missedNotes = 0, manualSkips = 0;
  const pendingAttacks = [];
  const gym = () => gyms[gymIndex];
  const ally = () => creatures[partner];
  const foe = () => creatures[gym().foe];
  const beatMs = () => demoStart !== null ? 60000 / bpm : liveBeatMs;
  const song = () => gym().song;
  const maxAlly = 66,
    maxFoe = 90;
  let phase, cursor, slots, due, hp, enemyHp, chain, power, shielded;
  let totalBars, totalNotes, hasEighths, notesPlayed, onBeat, lastNoteEnd, pausedTailBeats, pausedRestOffset;
  let lastHeard, lastHeardSlot,
    lastGrade,
    logMessage,
    inputMessage,
    mode,
    micState = "off";
  let restHeld = false,
    demoStart = null,
    demoStep = -1,
    demoVersion = 0,
    lastPaint = 0,
    lastCue = "";
  let demoVoice, demoReleaseAt, splashTimer, resultTimer;
  const held = new Map(),
    keyElements = new Map();
  function save() {
    try {
      localStorage.setItem(
        storeKey,
        JSON.stringify({ libraryVersion, language, partner, gym: gym().id, bpm, followTempo, badges: [...earned] }),
      );
    } catch {}
  }
  function pitch(midi, full = false, slot = slots?.[cursor]) {
    if (slot?.midi === midi && slot.spelling)
      return full ? slot.spelling : slot.spelling.replace(/[0-9]+$/, "");
    const name = sharpNames[midi % 12];
    return name + (full ? Math.floor(midi / 12) - 1 : "");
  }
  const log = (zh, en) => {
    logMessage = [zh, en];
    $("log").textContent = tr(logMessage);
  };
  const noteStatus = (zh, en) => {
    inputMessage = [zh, en];
    $("inputState").textContent = tr(inputMessage);
  };
  function stopTones() {
    for (const end of held.values()) end();
    held.clear();
    for (const b of keyElements.values()) b.classList.remove("pressed");
  }
  function loadSong() {
    slots = [];
    totalBars = 0;
    totalNotes = 0;
    hasEighths = false;
    let start = 0;
    song().sections.forEach((section, sectionIndex) => {
      for (const bar of section.bars) {
        bar.forEach(([midi, beats, spelling], eventInBar) => {
          slots.push({ midi, beats, spelling, start, sectionIndex, barIndex: totalBars, eventInBar });
          start += beats;
          if (beats < 1) hasEighths = true;
          if (midi !== null) totalNotes++;
        });
        totalBars++;
      }
    });
  }
  function reset() {
    stopDemo();
    clearTimeout(splashTimer);
    clearTimeout(resultTimer);
    $("moveSplash").hidden = true;
    phase = "ready";
    audio.stopListening();
    stopTones();
    mode = "touch";
    micState = "off";
    cursor = 0;
    due = null;
    restHeld = false;
    shielded = false;
    lastNoteEnd = null;
    pausedTailBeats = null;
    pausedRestOffset = null;
    liveBeatMs = 60000 / bpm;
    beatSamples.length = 0;
    clearAttackHistory();
    missedNotes = 0;
    manualSkips = 0;
    notesPlayed = 0;
    onBeat = 0;
    hp = maxAlly;
    enemyHp = maxFoe;
    chain = 0;
    power = 0;
    lastHeard = null;
    lastGrade = "";
    loadSong();
    buildKeys();
    log("野生的" + foe().name[0] + "出现了！", "A wild " + foe().name[1] + " appeared!");
    noteStatus(
      "把设备放在钢琴旁，也可以点屏幕琴键。",
      "Place your device beside the piano, or play the screen keys.",
    );
    paintArena();
    renderAll();
  }
  function paintArena() {
    window.DuelArena.show({ player: partner, foe: gym().foe, zone: gym().zone });
  }
  function createChoice(tag, cls, portrait, text, detail, selected, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.setAttribute("aria-pressed", String(selected));
    const img = document.createElement("img");
    img.src = "art/" + portrait + ".png";
    img.alt = "";
    b.append(img);
    const label = document.createElement("span");
    if (detail) {
      label.className = "gym-text";
      const name = document.createElement("strong"),
        small = document.createElement("small");
      name.textContent = text;
      small.textContent = detail;
      label.append(name, small);
    } else label.textContent = text;
    b.append(label);
    b.addEventListener("click", onClick);
    $(tag).append(b);
    return b;
  }
  function renderSetup() {
    $("partners").replaceChildren();
    for (const shelf of ["chapter", "midway", "review"]) $(shelf + "Songs").replaceChildren();
    if (gym().shelf !== "chapter") $(gym().shelf).open = true;
    for (const id of available()) {
      createChoice("partners", "partner", id, tr(creatures[id].name), "", partner === id, () =>
        changeSetup(id, gymIndex),
      );
    }
    gyms.forEach((g, i) => {
      const mark = document.createElement("span");
      mark.className = "gym-mark";
      mark.textContent = earned.has(g.id) ? "✦" : "›";
      const pageLabel = t("第 " + g.page + " 页", "p. " + g.page);
      const sourceLabel = g.companion ? t(" · 配套原创", " · Original practice song") : "";
      createChoice(
        g.shelf + "Songs",
        "gym",
        g.foe,
        tr(g.song.title),
        tr(creatures[g.foe].name) + " · " + pageLabel + sourceLabel,
        gymIndex === i,
        () => changeSetup(partner, i),
      ).append(mark);
    });
    $("caseCount").textContent = earned.size + " / " + gyms.length;
    $("moveName").textContent = tr(ally().special);
    $("moveInfo").textContent = t(
      "踩准 4 个音就能使出" + ally().special[0] + "。弹完整首，再来一次终结技！",
      "Four on-beat notes unleash " + ally().special[1] + ". Finish the song for a knockout!",
    );
  }
  function renderNumbers() {
    $("allyHp").textContent = hp + "/" + maxAlly;
    $("foeHp").textContent = enemyHp + "/" + maxFoe;
    for (const [id, n, max] of [
      ["allyBar", hp, maxAlly],
      ["foeBar", enemyHp, maxFoe],
    ]) {
      $(id).style.width = (n / max) * 100 + "%";
      $(id).dataset.low = String(n / max <= 0.3);
    }
    $("combo").textContent = t("连击 ", "COMBO ") + chain;
    $("charge").innerHTML = Array.from(
      { length: 4 },
      (_, i) => '<i class="pip' + (i < power ? " on" : "") + '"></i>',
    ).join("");
  }
  function clearAttackHistory() {
    lastAttack = null;
    pendingAttacks.length = 0;
    retrying = false;
  }
  function renderTempo() {
    $("tempo").value = String(bpm);
    $("tempoReadout").textContent = bpm + " BPM";
    $("tempoMinus").disabled = bpm === minBpm;
    $("tempoPlus").disabled = bpm === maxBpm;
    $("followTempo").checked = followTempo;
    const measured = Math.round(60000 / liveBeatMs);
    $("followReadout").textContent = followTempo && beatSamples.length && phase === "play"
      ? t("实测 " + measured + " BPM", "Playing at " + measured + " BPM") : "";
  }
  function setTempo(nextBpm, nextFollow = followTempo) {
    if (!Number.isFinite(nextBpm)) return;
    nextBpm = limitBpm(Math.round(nextBpm));
    if (nextBpm === bpm && nextFollow === followTempo) return;
    const now = performance.now(), oldBeat = beatMs();
    bpm = nextBpm;
    followTempo = nextFollow;
    liveBeatMs = 60000 / bpm;
    beatSamples.length = 0;
    clearAttackHistory();
    // Move deadlines around this instant so a half-finished beat stays half-finished.
    const ratio = beatMs() / oldBeat;
    const rebase = (time) => now + (time - now) * ratio;
    if (due !== null) due = rebase(due);
    if (lastNoteEnd !== null) lastNoteEnd = rebase(lastNoteEnd);
    if (demoStart !== null) {
      demoStart = rebase(demoStart);
      if (demoVoice) demoReleaseAt = rebase(demoReleaseAt);
    }
    save();
    renderTempo();
    drawLane(now);
  }
  function renderControls() {
    const live = micState === "listening",
      asking = micState === "requesting";
    $("micLabel").textContent = asking
      ? t("取消开启", "Cancel request")
      : live
        ? t("暂停拾音", "Pause mic")
        : phase === "paused"
          ? t("用真琴继续", "Resume with piano")
          : t("用真琴出战", "Play with my piano");
    $("mic").setAttribute("aria-pressed", String(live || asking));
    $("screen").textContent =
      phase === "won"
        ? t("再战一次", "Rematch")
        : phase === "play"
          ? t("暂停对战", "Pause battle")
          : phase === "paused"
            ? t("屏幕琴键继续", "Resume on screen")
            : t("屏幕琴键试玩", "Use screen keys");
    $("screen").disabled = asking;
    $("demo").textContent =
      demoStart !== null ? t("停止示范", "Stop demo") : t("♪ 听整首示范", "♪ Hear the whole song");
    $("demo").disabled = asking || phase === "won";
    renderTempo();
    $("controlTitle").textContent = t("节奏轨道", "Rhythm track");
  }
  function renderAll() {
    document.documentElement.lang = t("zh-Hans", "en");
    for (const node of document.querySelectorAll("[data-zh]"))
      node.textContent = t(node.dataset.zh, node.dataset.en);
    $("lang").textContent = t("English", "中文");
    $("dismiss").setAttribute("aria-label", t("关闭", "Close"));
    $("foeName").textContent = tr(foe().name);
    $("allyName").textContent = tr(ally().name);
    $("zoneLabel").textContent =
      tr(gym().name) + " · " + t("第 " + gym().page + " 页", "p. " + gym().page);
    $("log").textContent = tr(logMessage);
    $("inputState").textContent = tr(inputMessage);
    renderSetup();
    renderNumbers();
    renderControls();
    fillLane();
    updateReadout();
    drawLane(performance.now());
  }
  function fillLane() {
    $("beats").replaceChildren();
    $("laneTicks").replaceChildren();
    for (const s of slots) {
      const token = document.createElement("div");
      token.className = "beat" + (s.midi === null ? " rest" : "");
      const name = document.createElement("b"),
        length = document.createElement("small");
      name.textContent = s.midi === null ? t("休", "Rest") : pitch(s.midi, false, s);
      length.textContent = s.beats + t("拍", "b");
      token.append(name, length);
      s.el = token;
      $("beats").append(token);
    }
    for (let n = 0; n < 10; n++) {
      const tick = document.createElement("i");
      tick.className = "tick";
      $("laneTicks").append(tick);
    }
    lastCue = "";
  }
  function drawLane(now) {
    const here = slots[cursor] || slots[0],
      demo = demoStart !== null;
    let position = here.start;
    if (demo) position = Math.max(-1, (now - demoStart) / beatMs());
    else if (phase === "play" && lastNoteEnd !== null)
      position += here.beats - Math.max(0, (lastNoteEnd - now) / beatMs());
    else if (phase === "play" && due !== null) {
      const offset = (now - due) / beatMs();
      position += Math.min(here.midi === null && !restHeld ? here.beats : 0, offset);
    }
    const step = hasEighths ? 23 : 15;
    slots.forEach((s, i) => {
      const left = 16 + (s.start - position) * step;
      const visible = left >= -7 && left <= 108;
      if (s.el.hidden === visible) s.el.hidden = !visible;
      if (!visible) return;
      s.el.style.left = left + "%";
      s.el.classList.toggle("current", i === (demo ? demoStep : cursor));
      s.el.classList.toggle("past", i < (demo ? demoStep : cursor));
    });
    Array.from($("laneTicks").children).forEach((tick, n) => {
      tick.style.left = 16 + (n - 2 - (position % 1)) * step + "%";
    });
    $("lane").dataset.timed = String((phase === "play" && due !== null) || demo);
    if (phase === "play" && !demo && (here.midi === null || lastNoteEnd !== null)) {
      const count = lastNoteEnd !== null
        ? t("尾音 · 数 ", "Final note · count ") +
          Math.max(1, Math.min(here.beats, here.beats - Math.ceil((lastNoteEnd - now) / beatMs()) + 1)) + "/" + here.beats
        : restHeld
        ? t("松开琴键", "Release the keys")
        : due === null || now < due
          ? t("准备休止", "Rest coming")
          : t("休止 · 数 ", "Rest · count ") +
            Math.min(here.beats, Math.floor((now - due) / beatMs()) + 1) +
            "/" +
            here.beats;
      if (lastCue !== count) {
        $("cue").textContent = count;
        lastCue = count;
      }
    }
  }
  function updateReadout() {
    const demoing = demoStart !== null;
    const s = slots[demoing ? Math.max(0, demoStep) : cursor];
    const skip = $("skipUnheard");
    skip.hidden = phase !== "play" || mode !== "mic" || demoing;
    skip.disabled = !canSkipUnheard();
    $("turnLabel").textContent = t("小节 ", "BAR ") + (s.barIndex + 1) + " / " + totalBars;
    window.DuelScore.render({
      song: song(), barIndex: s.barIndex, eventInBar: s.eventInBar,
      language, demo: demoing, complete: phase === "won",
    });
    for (const [m, b] of keyElements) {
      const spelling = s.midi === m ? s : slots.find((slot) => slot.midi === m);
      b.classList.toggle(
        "target",
        s.midi === m && (phase === "play" || phase === "ready" || phase === "paused" || demoing),
      );
      b.setAttribute("aria-label", pitch(m, true, spelling));
      if (!whites.includes(m))
        b.querySelector("span").textContent = spelling ? pitch(m, false, spelling) : "";
    }
    let label;
    if (demoing) label = t("示范中 · 跟着听", "Demo · listen along");
    else if (phase === "won") label = t("全曲完成！", "Song complete!");
    else if (lastNoteEnd !== null || pausedTailBeats !== null)
      label = t("尾音数满 " + s.beats + " 拍", "Count out the final " + s.beats + " beats");
    else if (s.midi !== null)
      label = (cursor === 0 ? t("从 ", "Start on ") : t("接下来 ", "Next: ")) + pitch(s.midi, true);
    else label = t("休止", "Rest");
    $("cue").textContent = label;
    lastCue = "";
    $("heard").textContent =
      lastHeard === null
        ? ""
        : (mode === "mic" ? t("听到 ", "Heard ") : t("弹下 ", "Played ")) +
          pitch(lastHeard, true, lastHeardSlot) +
          (lastGrade ? " · " + tr(lastGrade) : "");
  }
  function flash(kind, words) {
    window.DuelArena.effect(kind, ally().type, slots[cursor].beats * beatMs());
    const splash = $("moveSplash");
    clearTimeout(splashTimer);
    splash.textContent = words;
    splash.dataset.kind = kind === "win" ? "super" : kind;
    splash.hidden = false;
    splashTimer = setTimeout(
      () => {
        splash.hidden = true;
      },
      kind === "win" ? 1300 : kind === "super" ? 900 : 410,
    );
  }
  function release(source) {
    const voice = held.get(source);
    if (voice) {
      voice();
      held.delete(source);
    }
    if (restHeld && held.size === 0 && phase === "play" && slots[cursor]?.midi === null) {
      restHeld = false;
      due = Math.max(due ?? 0, performance.now());
    }
  }
  function touchDown(source, midi) {
    if (phase !== "play" || demoStart !== null || held.has(source) || mode !== "touch") return;
    const now = performance.now();
    tickSong(now, midi);
    if (phase !== "play") return;
    held.set(source, audio.press(midi));
    accept(midi, now);
  }
  function buildKeys() {
    const pitches = slots.filter((slot) => slot.midi !== null).map((slot) => slot.midi);
    const low = Math.min(...pitches) < 60 ? 55 : 60;
    const high = Math.max(low < 60 ? 67 : 72, ...pitches);
    const visibleWhites = whites.filter((midi) => low <= midi && midi <= high);
    $("keyboard").replaceChildren();
    keyElements.clear();
    $("keyboard").style.setProperty("--black-key-width", 58 / visibleWhites.length + "%");
    for (const [letter, m] of Object.entries(shortcut).sort((a, b) => a[1] - b[1])) {
      if (m < low || m > high) continue;
      const white = whites.includes(m),
        b = document.createElement("button");
      b.className = "key " + (white ? "white" : "black");
      b.type = "button";
      b.dataset.note = m;
      if (!white) b.style.left = (visibleWhites.filter((n) => n < m).length / visibleWhites.length) * 100 + "%";
      const name = document.createElement("span"),
        hint = document.createElement("small");
      name.textContent = white ? pitch(m, m === low || m === high || m % 12 === 0) : "";
      hint.textContent = letter.toUpperCase();
      b.append(name, hint);
      b.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        b.setPointerCapture(e.pointerId);
        touchDown("p" + e.pointerId, m);
      });
      b.addEventListener("lostpointercapture", (e) => release("p" + e.pointerId));
      b.addEventListener("click", (e) => {
        if (e.detail === 0 && phase === "play" && mode === "touch" && demoStart === null) {
          audio.tone(m, 0.35);
          accept(m, performance.now());
        }
      });
      keyElements.set(m, b);
      $("keyboard").append(b);
    }
  }
  function advance(nextDue) {
    const previous = slots[cursor];
    if (cursor === slots.length - 1) {
      finish();
      return;
    }
    cursor++;
    due = nextDue;
    restHeld = false;
    if (previous.sectionIndex !== slots[cursor].sectionIndex) {
      const name = song().sections[slots[cursor].sectionIndex].title;
      if (shielded) {
        log("节奏护盾挡住了还击！接着弹「" + name[0] + "」。",
          "Rhythm shield blocked the counter! Keep playing “" + name[1] + "”.");
      } else {
        // A counter adds drama at a phrase boundary, but never cuts a song short.
        hp = Math.max(1, hp - 8);
        window.DuelArena.effect("ally-hit");
        log(foe().name[0] + "还击！带着搭档继续弹「" + name[0] + "」。",
          foe().name[1] + " counters! Keep playing “" + name[1] + "”.");
      }
      shielded = false;
      chain = 0;
      renderNumbers();
    }
    updateReadout();
  }
  function tickSong(now, incomingMidi) {
    if (phase !== "play") return;
    if (lastNoteEnd !== null) {
      if (now >= lastNoteEnd) finish();
      return;
    }
    const s = slots[cursor];
    if (s.midi !== null || due === null) return;
    if (held.size && now >= due) restHeld = true;
    const restEnd = due + s.beats * beatMs();
    // Pitch detection and a player's attack can straddle the end of a counted rest.
    const enteringOnPitch = incomingMidi !== undefined && slots[cursor + 1]?.midi === incomingMidi;
    const grace = enteringOnPitch ? Math.min(110, beatMs() * 0.15) : 0;
    if (restHeld) return;
    if (now >= restEnd - grace) {
      advance(restEnd);
    } else if (followTempo && enteringOnPitch && lastAttack && !retrying) {
      // A faster performance can reach the rest's exit before the displayed target.
      // Use the full written note-to-note interval, including all the silent beats.
      const arrivalBeat = intervalBeat(slots[cursor + 1], now);
      const minimum = Math.max(60000 / maxBpm * 0.85, liveBeatMs * (beatSamples.length ? 0.68 : 0.38));
      if (arrivalBeat >= minimum) advance(now);
    }
  }
  function intervalBeat(slot, now) {
    return lastAttack ? (now - lastAttack.time) / (slot.start - lastAttack.beat) : NaN;
  }
  function trackAttack(slot, now) {
    const sample = intervalBeat(slot, now);
    if (followTempo && !retrying && plausibleBeat(sample)) {
      beatSamples.push(sample);
      if (beatSamples.length > 3) beatSamples.shift();
      const sorted = [...beatSamples].sort((a, b) => a - b);
      const median = sorted.length === 2 ? (sorted[0] + sorted[1]) / 2 : sorted[Math.floor(sorted.length / 2)];
      liveBeatMs = Math.max(60000 / maxBpm, Math.min(60000 / minBpm, median));
      renderTempo();
    }
    lastAttack = { time: now, beat: slot.start, midi: slot.midi };
    retrying = false;
  }
  function plausibleBeat(ms) {
    return ms >= 60000 / maxBpm * 0.8 && ms <= 60000 / minBpm * 1.16;
  }
  function nextPitched(index) {
    while (index < slots.length && slots[index].midi === null) index++;
    return index;
  }
  function passSlot() {
    if (slots[cursor].midi !== null) {
      missedNotes++;
      chain = 0;
      shielded = false;
    }
    advance(due === null ? null : due + slots[cursor].beats * beatMs());
  }
  function canSkipUnheard() {
    if (phase !== "play" || mode !== "mic" || lastNoteEnd !== null || manualSkips >= 2) return false;
    // The last pitched note must actually be played, even when there are trailing rests.
    return nextPitched(nextPitched(cursor) + 1) < slots.length;
  }
  function skipUnheard() {
    if (!canSkipUnheard()) return;
    const target = nextPitched(cursor);
    manualSkips++;
    clearAttackHistory();
    while (cursor <= target) passSlot();
    // The player is choosing where to resume. Start a fresh timing anchor there.
    due = slots[cursor].midi === null ? performance.now() : null;
    lastGrade = ["漏音未计分", "Missed note · no points"];
    log("跳过一个漏听的音，从高亮处接着弹。", "One missed note skipped. Continue at the highlighted note.");
    renderNumbers();
    updateReadout();
  }
  const rateDifference = (a, b) => Math.abs(Math.log2(a / b));
  function alignmentCost(rates, omissions) {
    // A steady passage in a new tempo is stronger evidence than closeness
    // to the preset. Prefer fewer omissions when the timing cannot decide.
    let cost = omissions * 0.14;
    for (let i = 0; i < rates.length; i++) {
      cost += rateDifference(rates[i], beatMs()) * (followTempo && rates.length > 1 ? 0.35 : 1);
      if (i) cost += rateDifference(rates[i], rates[i - 1]) * 1.1;
    }
    return cost;
  }
  function alignmentPaths(attacks, allowance) {
    // At most three real onsets and two missing pitches. Rests occupy score time
    // but never consume an attack. Compare musical intervals, not frame counts.
    const paths = [];
    function extend(startIndex, indices, missed, previous, rates) {
      const attack = attacks[indices.length];
      let index = nextPitched(startIndex);
      for (let gap = 0; gap <= allowance - missed && index < slots.length; gap++, index = nextPitched(index + 1)) {
        const slot = slots[index];
        if (slot.midi !== attack.midi) continue;
        const possibleRates = [previous ? (attack.time - previous.time) / (slot.start - previous.beat) : null];
        // Early identical notes may already have been credited to an earlier copy.
        // Keep that interpretation alive until a different pitch settles the location.
        if (previous && !indices.length && gap) {
          for (let k = nextPitched(startIndex); k < index && slots[k].midi === previous.midi; k = nextPitched(k + 1))
            possibleRates.push((attack.time - previous.time) / (slot.start - slots[k].start));
        }
        const nextIndices = [...indices, index], omissions = missed + gap;
        for (const rate of possibleRates) {
          if (rate !== null && !plausibleBeat(rate)) continue;
          if (rates.length && rateDifference(rate, rates.at(-1)) > 1.05) continue;
          const nextRates = rate === null ? rates : [...rates, rate];
          if (nextIndices.length === attacks.length)
            paths.push({ indices: nextIndices, omissions, cost: alignmentCost(nextRates, omissions) });
          else
            extend(index + 1, nextIndices, omissions, { ...attack, beat: slot.start }, nextRates);
        }
      }
    }
    extend(cursor, [], 0, lastAttack, []);
    return paths.sort((a, b) => a.cost - b.cost);
  }
  function deliverAlignment(path) {
    const attacks = pendingAttacks.splice(0);
    retrying = false;
    path.indices.forEach((target, i) => {
      while (cursor < target) passSlot();
      lastHeardSlot = slots[cursor];
      playNote(attacks[i].time, true);
    });
  }
  function followScore(midi, now) {
    const mic = mode === "mic", s = slots[cursor];
    // Keep fixed-tempo screen practice strictly sequential. Screen following
    // retains its existing single-omission recovery after a player has started.
    if (!mic && (!followTempo || !lastAttack || s.midi === null)) return false;
    if (!pendingAttacks.length && s.midi === midi && (!mic || !lastAttack)) return false;
    const previous = pendingAttacks.at(-1) || lastAttack;
    if (previous?.midi === midi && now - previous.time < 75) return true;
    pendingAttacks.push({ midi, time: now });
    let paths = alignmentPaths(pendingAttacks, mic ? 2 : 1);
    if (!paths.length && pendingAttacks.length > 1) {
      pendingAttacks.splice(0, pendingAttacks.length - 1);
      if (s.midi === midi) {
        pendingAttacks.length = 0;
        return false;
      }
      paths = alignmentPaths(pendingAttacks, mic ? 2 : 1);
    }
    const best = paths[0];
    if (!best || (!mic && pendingAttacks.length === 1 && s.midi === midi) ||
        (s.midi === null && best.indices[0] === nextPitched(cursor))) {
      pendingAttacks.length = 0;
      return false;
    }
    const count = pendingAttacks.length, target = best.indices.at(-1);
    const other = paths.find((p) => p.indices.at(-1) !== target);
    const decisive = !other || other.cost > best.cost + 0.20;
    const unsettled = mic && followTempo && !beatSamples.length && other && lastAttack;
    if (count === 1 && s.midi === midi && !unsettled && (!best.omissions || !decisive)) {
      pendingAttacks.length = 0;
      return false;
    }
    // A single final onset is enough only if it lands near the predicted cadence
    // after a real preceding attack. Silence alone can never end a pitched bar.
    const finalOnTime = mic && lastAttack && notesPlayed >= 2 && nextPitched(target + 1) === slots.length &&
      Math.abs(now - lastAttack.time - (slots[target].start - lastAttack.beat) * beatMs()) <= beatMs() * 0.38;
    if ((count > 1 && ((decisive && !unsettled) || count >= 3)) || (finalOnTime && decisive)) {
      deliverAlignment(best);
      return true;
    }
    lastGrade = ["正在对齐乐谱，接着弹", "Finding your place · keep playing"];
    updateReadout();
    return true;
  }
  function accept(midi, now) {
    if (phase !== "play" || demoStart !== null) return;
    tickSong(now, midi);
    if (phase !== "play" || lastNoteEnd !== null) return;
    const s = slots[cursor];
    lastHeard = midi;
    lastHeardSlot = s;
    const button = keyElements.get(midi);
    if (button) {
      button.classList.add("pressed");
      clearTimeout(button.flash);
      button.flash = setTimeout(() => button.classList.remove("pressed"), 200);
    }
    if (followScore(midi, now)) return;
    if (s.midi === null || midi !== s.midi) {
      chain = 0;
      retrying = true;
      if (s.midi === null) {
        // A new attack during a rest restarts its full count.
        due = Math.max(due ?? now, now);
        restHeld = held.size > 0;
        lastGrade = ["休止时留白", "Leave the rest quiet"];
      } else {
        lastGrade = ["再试 " + pitch(s.midi, true), "Try " + pitch(s.midi, true)];
      }
      renderNumbers();
      updateReadout();
      return;
    }
    playNote(now);
  }
  function playNote(now, aligned = false) {
    const s = slots[cursor], ms = beatMs();
    const delta = due === null ? Infinity : now - due;
    const previous = slots[cursor - 1];
    const tooEarly = followTempo ? lastAttack?.midi === s.midi && now - lastAttack.time < 75
      : previous && delta < -previous.beats * ms * 0.45;
    if (tooEarly && !aligned) {
      lastGrade = ["再数一拍，等音符到圆环", "A little early · wait for the ring"];
      updateReadout();
      return;
    }
    trackAttack(s, now);
    manualSkips = 0;
    const timed = Math.abs(delta) <= ms * 0.35;
    if (timed) {
      chain++;
      onBeat++;
      power++;
      if (chain >= 2) shielded = true;
    } else chain = 0;
    const special = power >= 4;
    if (special) power = 0;
    notesPlayed++;
    // Reserve the last fraction of HP for the final cadence, at every tempo.
    const remaining = maxFoe - Math.round((maxFoe - 12) * notesPlayed / totalNotes);
    const damage = enemyHp - remaining;
    enemyHp = remaining;
    lastGrade = special ? ["大招！", "Super move!"]
      : timed ? ["合拍！", "On beat!"] : ["音高正确", "Right note"];
    const move = special ? ally().special : ally().move;
    log(
      ally().name[0] + "使出" + move[0] + "！  −" + damage + " HP",
      ally().name[1] + " used " + move[1] + "!  −" + damage + " HP",
    );
    flash(special ? "super" : "hit", special ? tr(move) + "!" : "−" + damage);
    renderNumbers();
    if (cursor === slots.length - 1) {
      lastNoteEnd = now + s.beats * beatMs();
      updateReadout();
      return;
    }
    // Musical time follows the player; only small timing jitter is snapped to the grid.
    const anchor = !followTempo && Math.abs(delta) <= ms * 0.12 ? due : now;
    advance(anchor + s.beats * beatMs());
  }
  function finish() {
    phase = "won";
    lastNoteEnd = null;
    pausedTailBeats = null;
    enemyHp = 0;
    audio.stopListening();
    stopTones();
    earned.add(gym().id);
    save();
    flash("win", tr(ally().special) + "!");
    log(
      "全曲完成！" + ally().name[0] + "的" + ally().special[0] + "击败了" + foe().name[0] + "！",
      "Song complete! " + ally().name[1] + " defeats " + foe().name[1] + " with " + ally().special[1] + "!",
    );
    noteStatus("下一场可以选择新的搭档或道馆。", "Choose a partner or a gym for your next battle.");
    renderAll();
    resultTimer = setTimeout(() => {
      if (phase === "won" && !$("sheet").open) openResult();
    }, 1450);
  }
  function freezeClock() {
    if (phase !== "play") return;
    const now = performance.now();
    if (lastNoteEnd !== null) {
      pausedTailBeats = Math.max(0, (lastNoteEnd - now) / beatMs());
      lastNoteEnd = null;
    }
    if (slots[cursor].midi === null && due !== null)
      pausedRestOffset = restHeld ? 0 : (due - now) / beatMs();
    clearAttackHistory();
    phase = "paused";
    due = null;
    restHeld = false;
  }
  function pause() {
    stopDemo();
    freezeClock();
    audio.stopListening();
    stopTones();
    if (phase === "paused") {
      log("对战已暂停。", "Battle paused.");
      noteStatus("点真琴或屏幕琴键，从当前音继续。", "Resume at this note with your piano or screen keys.");
    }
    renderControls();
    updateReadout();
    drawLane(performance.now());
  }
  function start(kind) {
    if (phase === "won") reset();
    stopDemo();
    mode = kind;
    phase = "play";
    const now = performance.now();
    due = slots[cursor].midi === null ? now + (pausedRestOffset ?? 0) * beatMs() : null;
    pausedRestOffset = null;
    if (pausedTailBeats !== null) {
      lastNoteEnd = now + pausedTailBeats * beatMs();
      pausedTailBeats = null;
    }
    restHeld = false;
    log("轮到" + ally().name[0] + "了！", "It’s " + ally().name[1] + "’s turn!");
    noteStatus(
      kind === "mic" ? "拾音中 · 一次弹一个音，先松开延音踏板。" : "点屏幕琴键，也可以按琴键上标出的电脑字母。",
      kind === "mic"
        ? "Mic on · play one note at a time with the sustain pedal up."
        : "Tap a piano key or press the computer letter shown on it.",
    );
    renderControls();
    updateReadout();
    drawLane(now);
  }
  function explainMic(detail) {
    if (/access is off/i.test(detail))
      return [
        "未获麦克风权限。可在浏览器地址栏允许，再点真琴出战。",
        "Microphone permission is off. Allow it in site settings and try again.",
      ];
    if (/No microphone/i.test(detail))
      return [
        "没找到麦克风。请接上麦克风，或选屏幕琴键。",
        "No microphone found. Connect one or use screen keys.",
      ];
    if (/HTTPS/i.test(detail))
      return [
        "请用 HTTPS 游戏链接打开麦克风，或选屏幕琴键。",
        "Open the HTTPS game link to use your microphone, or use screen keys.",
      ];
    return [
      "拾音已中断，可重新开启，或用屏幕琴键。",
      detail || "Microphone interrupted. Try again or use screen keys.",
    ];
  }
  function useMic() {
    if (micState === "listening" || micState === "requesting") {
      pause();
      return;
    }
    if (phase === "won") reset();
    pause();
    audio.listen({
      isExpectedPitch: (midi) => {
        if (phase !== "play" || mode !== "mic" || lastNoteEnd !== null) return false;
        let index = nextPitched(cursor);
        const reach = Math.min(5, 3 + pendingAttacks.length);
        for (let i = 0; i < reach && index < slots.length; i++, index = nextPitched(index + 1))
          if (slots[index].midi === midi) return true;
        return false;
      },
      onNote: (midi) => {
        if (mode === "mic") accept(midi, performance.now());
      },
      onState: (status, detail) => {
        micState = status;
        if (status === "requesting")
          noteStatus("请允许浏览器使用麦克风。", "Allow microphone access in your browser.");
        if (status === "listening") start("mic");
        if (status === "error") {
          freezeClock();
          noteStatus(...explainMic(detail || ""));
        }
        if (status === "off" && mode === "mic") freezeClock();
        renderControls();
        updateReadout();
      },
    });
  }
  function stopDemo() {
    if (demoVoice) demoVoice();
    demoVoice = null;
    demoVersion++;
    demoStart = null;
    demoStep = -1;
  }
  function endDemo() {
    stopDemo();
    noteStatus(
      phase === "paused" ? "可以接着弹刚才的小节。" : "准备好了，点真琴或屏幕琴键，自己从头弹一遍。",
      phase === "paused" ? "Resume at the bar where you paused." : "Ready? Play the song from the start on piano or screen keys.",
    );
    renderControls();
    updateReadout();
    drawLane(performance.now());
  }
  async function demo() {
    if (demoStart !== null) {
      endDemo();
      return;
    }
    pause();
    const version = ++demoVersion;
    const audible = await audio.unlock();
    if (version !== demoVersion || document.hidden) return;
    demoStart = performance.now() + 240;
    demoStep = -1;
    noteStatus(
      audible ? "跟着乐谱听完整首，可以随时停止。" : "声音暂时不可用，可以跟着乐谱看一遍。",
      audible
        ? "Follow the score through the whole song. Stop whenever you’re ready."
        : "Audio unavailable. Watch the score for the full song.",
    );
    renderControls();
    updateReadout();
  }
  function runFrame(now) {
    requestAnimationFrame(runFrame);
    if (document.hidden || now - lastPaint < 30) return;
    lastPaint = now;
    if (demoStart !== null) {
      if (demoVoice && now >= demoReleaseAt) {
        demoVoice();
        demoVoice = null;
      }
      const position = (now - demoStart) / beatMs(),
        last = slots[slots.length - 1];
      if (position >= last.start + last.beats) {
        endDemo();
        return;
      }
      const index = slots.findLastIndex((s) => s.start <= position);
      if (index >= 0 && index !== demoStep) {
        demoStep = index;
        const s = slots[index];
        if (demoVoice) demoVoice();
        demoVoice = s.midi === null ? null : audio.press(s.midi);
        demoReleaseAt = demoStart + (s.start + s.beats * 0.88) * beatMs();
        updateReadout();
      }
      drawLane(now);
    } else if (phase === "play") {
      tickSong(now);
      drawLane(now);
    }
  }
  function showDialog(title, type) {
    $("sheet").dataset.page = type;
    $("sheetTitle").textContent = title;
    $("sheetBody").replaceChildren();
    $("sheetActions").replaceChildren();
    if (!$("sheet").open) $("sheet").showModal();
  }
  function paragraph(text, parent = $("sheetBody")) {
    const p = document.createElement("p");
    p.textContent = text;
    parent.append(p);
  }
  function dialogButton(text, action, primary = false) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = text;
    b.className = primary ? "primary" : "secondary";
    b.addEventListener("click", action);
    $("sheetActions").append(b);
  }
  const closeDialog = () => $("sheet").close();
  function openHelp() {
    pause();
    showDialog(t("用钢琴指挥对战", "Battle with your piano"), "help");
    paragraph(
      t(
        "1. 选一首曲子和搭档。可以先听整首示范，再点「用真琴出战」允许麦克风。准备好再弹第一个音。",
        "1. Choose a song and partner. Listen to the whole demo if you like, then select Play with my piano and allow the mic. Start when ready.",
      ),
    );
    paragraph(
      t(
        "2.「跟着我弹」会按你弹奏的快慢移动谱面。关闭跟随后可以按设定速度练准拍。休止时松开琴键和踏板。",
        "2. Follow my playing moves the score at your pace. Turn it off to practise at the set tempo. Lift the keys and pedal for rests.",
      ),
    );
    paragraph(
      t(
        "3. 音符到达圆环时弹下，连中两次可以挡住乐段结束时的还击。累计合拍四次自动放大招。接着往下弹，完整弹完曲子就会发动终结技，击败并招募对手。",
        "3. Play as the note reaches the ring. Two consecutive on-beat notes shield against the next section counter. Four on-beat hits unleash a special. Finish the song to knock out and recruit your rival.",
      ),
    );
    paragraph(
      t(
        "麦克风在设备上识别单音。两种速度模式都可以在漏听一两个音后继续弹，谱面会按后续音和节奏寻找位置。若仍停在原处，点「跳过漏听的音」，每次跳一个，漏音不计分。漏听最后一个音时，请把高亮的尾音再弹一次。",
        "The mic listens on your device. At either tempo setting, keep playing after one or two missed notes. The game uses your next pitches and their timing to find your place. If it stays stuck, choose Skip unheard note, one note at a time. Missed notes earn no points. If the last note is missed, play the highlighted final pitch again.",
      ),
    );
    const credits = document.createElement("a");
    credits.href = "https://github.com/PokeAPI/sprites";
    credits.target = "_blank";
    credits.rel = "noopener noreferrer";
    credits.textContent = t("宝可梦像素图来源 · PokéAPI", "Pokémon sprite credits · PokéAPI");
    $("sheetBody").append(credits);
    dialogButton(t("明白了", "Got it"), closeDialog, true);
  }
  function openCase() {
    pause();
    showDialog(t("我的道馆徽章", "My gym badges"), "case");
    const box = document.createElement("div");
    box.className = "collection";
    $("sheetBody").append(box);
    for (const g of gyms) {
      const card = document.createElement("div");
      card.className = "badge-card" + (earned.has(g.id) ? " earned" : "");
      const img = document.createElement("img");
      img.src = "art/" + g.foe + ".png";
      img.alt = "";
      const name = document.createElement("strong");
      name.textContent = tr(g.badge);
      const state = document.createElement("small");
      state.textContent = earned.has(g.id) ? t("已招募", "Recruited") : tr(g.name);
      card.append(img, name, state);
      box.append(card);
    }
    dialogButton(t("回到道馆", "Back to gym"), closeDialog, true);
  }
  function openResult() {
    showDialog(t("获得" + gym().badge[0] + "！", gym().badge[1] + " earned!"), "result");
    const img = document.createElement("img");
    img.src = "art/" + gym().foe + ".png";
    img.alt = "";
    img.className = "reward-sprite";
    $("sheetBody").append(img);
    paragraph(t(
      "你弹完了《" + song().title[0] + "》的全部 " + totalBars + " 小节，击败了" + foe().name[0] + "！",
      "You played all " + totalBars + " bars of “" + song().title[1] + "” and defeated " + foe().name[1] + "!",
    ));
    paragraph(t(
      notesPlayed + " 个音符 · " + onBeat + " 次合拍 · " + foe().name[0] + "加入了可选搭档。",
      notesPlayed + " notes · " + onBeat + " on beat · " + foe().name[1] + " is now a playable partner.",
    ));
    if (missedNotes) paragraph(t(
      "已接回乐谱，" + missedNotes + " 个漏音未计分。",
      "The score rejoined you. " + missedNotes + (missedNotes === 1 ? " missed note" : " missed notes") + " received no points.",
    ));
    paragraph(t("回到书上 · ", "At the piano · ") + tr(gym().bench));
    dialogButton(
      t("带" + foe().name[0] + "出战", "Team up with " + foe().name[1]),
      () => {
        closeDialog();
        partner = gym().foe;
        save();
        reset();
      },
      true,
    );
    dialogButton(t("回到道馆", "Back to gym"), closeDialog);
  }
  function changeSetup(p, i) {
    if (p === partner && i === gymIndex) return;
    const apply = () => {
      if ($("sheet").open) closeDialog();
      partner = p;
      gymIndex = i;
      const url = new URL(location.href);
      if (url.searchParams.get("pages") === "45-50" && gym().shelf !== "midway") {
        url.searchParams.delete("pages");
        history.replaceState(history.state, "", url);
      }
      save();
      reset();
    };
    if (phase === "play" || phase === "paused") {
      pause();
      showDialog(t("重新开始这场对战？", "Start a fresh battle?"), "switch");
      paragraph(
        t(
          "更换搭档或道馆会重新计算这场的 HP。已获得的徽章保存在本机。",
          "Changing partner or gym starts both HP bars over. Earned badges are saved on this device.",
        ),
      );
      dialogButton(t("更换并重新开始", "Switch and restart"), apply, true);
      dialogButton(t("保留这场", "Keep this battle"), closeDialog);
    } else apply();
  }
  $("mic").addEventListener("click", useMic);
  $("skipUnheard").addEventListener("click", skipUnheard);
  $("screen").addEventListener("click", () => {
    if (phase === "play") {
      pause();
      return;
    }
    audio.stopListening();
    void audio.unlock();
    start("touch");
  });
  $("demo").addEventListener("click", demo);
  $("help").addEventListener("click", openHelp);
  $("openCase").addEventListener("click", openCase);
  $("dismiss").addEventListener("click", closeDialog);
  $("tempo").addEventListener("input", () => setTempo(Number($("tempo").value)));
  $("tempoMinus").addEventListener("click", () => setTempo(bpm - 5));
  $("tempoPlus").addEventListener("click", () => setTempo(bpm + 5));
  $("followTempo").addEventListener("change", () => setTempo(bpm, $("followTempo").checked));
  $("lang").addEventListener("click", () => {
    language = t("en", "zh");
    save();
    renderAll();
  });
  document.addEventListener("keydown", (e) => {
    if (
      e.repeat ||
      e.ctrlKey ||
      e.altKey ||
      e.metaKey ||
      e.isComposing ||
      $("sheet").open ||
      e.target.tagName === "SELECT"
    )
      return;
    const m = shortcut[e.key.toLowerCase()];
    if (!keyElements.has(m) || phase !== "play" || mode !== "touch") return;
    e.preventDefault();
    touchDown("k" + e.code, m);
  });
  document.addEventListener("keyup", (e) => release("k" + e.code));
  for (const event of ["pointerup", "pointercancel"])
    document.addEventListener(event, (e) => release("p" + e.pointerId));
  window.addEventListener("blur", stopTones);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
  window.addEventListener("pagehide", () => {
    stopDemo();
    audio.stopListening();
    stopTones();
  });
  reset();
  requestAnimationFrame(runFrame);
})();
