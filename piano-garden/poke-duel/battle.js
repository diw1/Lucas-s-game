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
  };
  const starters = ["pikachu", "charmander", "squirtle", "bulbasaur"];
  const gyms = [
    {
      id: "oars",
      name: ["常青草地", "Viridian Meadow"],
      badge: ["回声徽章", "Echo Badge"],
      foe: "eevee",
    },
    {
      id: "drums",
      name: ["溪畔道馆", "Brookside Gym"],
      badge: ["静拍徽章", "Stillbeat Badge"],
      foe: "psyduck",
    },
    {
      id: "spell",
      name: ["月影道馆", "Moonshade Gym"],
      badge: ["半音徽章", "Half-step Badge"],
      foe: "gengar",
    },
  ].map((g) => ({
    ...g,
    lesson: window.FireflyLessons.find((l) => l.id === g.id),
    song: window.DuelSongs[g.id],
  }));
  const shortcut = {
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
  };
  const whites = [60, 62, 64, 65, 67, 69, 71, 72];
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
  let gymIndex = Math.max(
    0,
    gyms.findIndex((g) => g.id === saved.gym),
  );
  let bpm = [60, 80, 100].includes(saved.bpm) ? saved.bpm : 80;
  const gym = () => gyms[gymIndex];
  const ally = () => creatures[partner];
  const foe = () => creatures[gym().foe];
  const beatMs = () => 60000 / bpm;
  const bookPage = () => gym().lesson.page;
  const song = () => gym().song;
  const maxAlly = 66,
    maxFoe = 90;
  let phase, cursor, slots, due, hp, enemyHp, chain, power, shielded;
  let totalBars, totalNotes, notesPlayed, onBeat, lastNoteEnd, pausedTailBeats;
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
        JSON.stringify({ language, partner, gym: gym().id, bpm, badges: [...earned] }),
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
    let start = 0;
    song().sections.forEach((section, sectionIndex) => {
      for (const bar of section.bars) {
        bar.forEach(([midi, beats, spelling], eventInBar) => {
          slots.push({ midi, beats, spelling, start, sectionIndex, barIndex: totalBars, eventInBar });
          start += beats;
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
    notesPlayed = 0;
    onBeat = 0;
    hp = maxAlly;
    enemyHp = maxFoe;
    chain = 0;
    power = 0;
    lastHeard = null;
    lastGrade = "";
    loadSong();
    log("野生的" + foe().name[0] + "出现了！", "A wild " + foe().name[1] + " appeared!");
    noteStatus(
      "把设备放在钢琴旁，也可以点屏幕琴键。",
      "Place your device beside the piano, or play the screen keys.",
    );
    paintArena();
    renderAll();
  }
  function paintArena() {
    window.DuelArena.show({ player: partner, foe: gym().foe, zone: gymIndex });
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
    $("gyms").replaceChildren();
    for (const id of available()) {
      createChoice("partners", "partner", id, tr(creatures[id].name), "", partner === id, () =>
        changeSetup(id, gymIndex),
      );
    }
    gyms.forEach((g, i) => {
      const mark = document.createElement("span");
      mark.className = "gym-mark";
      mark.textContent = earned.has(g.id) ? "✦" : "›";
      createChoice(
        "gyms",
        "gym",
        g.foe,
        tr(g.song.title),
        t(
          creatures[g.foe].name[0] + " · 第 " + g.lesson.page + " 页",
          creatures[g.foe].name[1] + " · p. " + g.lesson.page,
        ),
        gymIndex === i,
        () => changeSetup(partner, i),
      ).append(mark);
    });
    $("tempo").value = String(bpm);
    $("caseCount").textContent = earned.size + " / 3";
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
    $("tempo").disabled = phase === "play" || demoStart !== null || asking;
    $("tempoReadout").textContent = "♩ " + bpm + " BPM";
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
      tr(gym().name) + " · " + t("第 " + bookPage() + " 页", "p. " + bookPage());
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
    const step = 15;
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
    window.DuelArena.effect(kind, ally().type);
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
    for (const [letter, m] of Object.entries(shortcut).sort((a, b) => a[1] - b[1])) {
      const white = whites.includes(m),
        b = document.createElement("button");
      b.className = "key " + (white ? "white" : "black");
      b.type = "button";
      b.dataset.note = m;
      if (!white) b.style.left = whites.filter((n) => n < m).length * 12.5 + "%";
      const name = document.createElement("span"),
        hint = document.createElement("small");
      name.textContent = white ? sharpNames[m % 12] + (m % 12 === 0 ? Math.floor(m / 12) - 1 : "") : "";
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
    if (!restHeld && now >= restEnd - grace) advance(restEnd);
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
    if (s.midi === null || midi !== s.midi) {
      chain = 0;
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
    const ms = beatMs();
    const delta = due === null ? Infinity : now - due;
    const previous = slots[cursor - 1];
    if (previous && delta < -previous.beats * ms * 0.45) {
      lastGrade = ["再数一拍，等音符到圆环", "A little early · wait for the ring"];
      updateReadout();
      return;
    }
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
      lastNoteEnd = now + s.beats * ms;
      updateReadout();
      return;
    }
    // Musical time follows the player; only small timing jitter is snapped to the grid.
    const anchor = Math.abs(delta) <= ms * 0.12 ? due : now;
    advance(anchor + s.beats * ms);
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
    if (lastNoteEnd !== null) {
      pausedTailBeats = Math.max(0, (lastNoteEnd - performance.now()) / beatMs());
      lastNoteEnd = null;
    }
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
    due = slots[cursor].midi === null ? now : null;
    if (pausedTailBeats !== null) {
      lastNoteEnd = now + pausedTailBeats * beatMs();
      pausedTailBeats = null;
    }
    restHeld = false;
    log("轮到" + ally().name[0] + "了！", "It’s " + ally().name[1] + "’s turn!");
    noteStatus(
      kind === "mic" ? "拾音中 · 一次弹一个音，先松开延音踏板。" : "点击琴键，或用电脑 A–K 与上排黑键。",
      kind === "mic"
        ? "Mic on · play one note at a time with the sustain pedal up."
        : "Tap the keys or use A–K and the black keys above them.",
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
        "2. 跟着高亮的音符弹。每弹对一个音，对手就会掉血。弹错了，在原处重试。休止时松开琴键和踏板，跟着屏幕数拍。",
        "2. Play the highlighted note to wear down your rival. If you miss, try that note again. Lift the key and pedal for rests and follow the count.",
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
        "麦克风在设备上识别单音。练习时可以随时暂停，或用屏幕琴键从同一个音继续。",
        "Microphone recognition runs on your device, one note at a time. Pause whenever you like and resume at the same note on piano or screen keys.",
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
    paragraph(t("回到书上 · ", "At the piano · ") + tr([gym().lesson.bench, gym().lesson.benchEn]));
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
  $("tempo").addEventListener("change", () => {
    const v = Number($("tempo").value);
    if ([60, 80, 100].includes(v)) {
      bpm = v;
      save();
      renderControls();
    }
  });
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
    if (typeof m !== "number" || phase !== "play" || mode !== "touch") return;
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
  buildKeys();
  reset();
  requestAnimationFrame(runFrame);
})();
