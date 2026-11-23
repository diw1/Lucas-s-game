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
      counter: 13,
    },
    {
      id: "drums",
      name: ["溪畔道馆", "Brookside Gym"],
      badge: ["静拍徽章", "Stillbeat Badge"],
      foe: "psyduck",
      counter: 15,
    },
    {
      id: "spell",
      name: ["月影道馆", "Moonshade Gym"],
      badge: ["半音徽章", "Half-step Badge"],
      foe: "gengar",
      counter: 18,
    },
  ].map((g) => ({ ...g, lesson: window.FireflyLessons.find((l) => l.id === g.id) }));
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
  const flatNames = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
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
  const rounds = () => gym().lesson.rounds;
  const maxAlly = 66,
    maxFoe = 90;
  let phase, turn, cursor, slots, due, hp, enemyHp, chain, power, errors, protectedTurn, pendingCounter;
  let lastHeard,
    lastGrade,
    logMessage,
    inputMessage,
    mode,
    micState = "off",
    micError = "";
  let restHeld = false,
    demoStart = null,
    demoStep = -1,
    demoVersion = 0,
    lastPaint = 0,
    lastCue = "";
  let nextTurnAt = 0,
    counterAt = 0,
    counterShown = false,
    splashTimer,
    resultTimer;
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
  const phrase = () => rounds()[turn % rounds().length];
  function pitch(midi, full = false) {
    const name = (phrase().accidentals === "flat" ? flatNames : sharpNames)[midi % 12];
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
  function loadPhrase() {
    cursor = 0;
    due = null;
    restHeld = false;
    errors = 0;
    protectedTurn = false;
    let start = 0;
    slots = phrase().notes.map((midi, i) => {
      const item = { midi, start, beats: phrase().beats[i] };
      start += item.beats;
      return item;
    });
    fillLane();
  }
  function reset() {
    demoVersion++;
    demoStart = null;
    demoStep = -1;
    clearTimeout(splashTimer);
    clearTimeout(resultTimer);
    $("moveSplash").hidden = true;
    phase = "ready";
    audio.stopListening();
    stopTones();
    mode = "touch";
    micState = "off";
    micError = "";
    turn = 0;
    hp = maxAlly;
    enemyHp = maxFoe;
    chain = 0;
    power = 0;
    pendingCounter = false;
    lastHeard = null;
    lastGrade = "";
    loadPhrase();
    log("野生的" + foe().name[0] + "出现了！", "A wild " + foe().name[1] + " appeared!");
    noteStatus(
      "把设备放在钢琴旁，也可以点屏幕琴键。",
      "Place your device beside the piano, or play the screen keys.",
    );
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
        tr(g.name),
        t(
          "第 " + g.lesson.page + " 页 · " + g.lesson.skill,
          "p. " + g.lesson.page + " · " + g.lesson.skillEn,
        ),
        gymIndex === i,
        () => changeSetup(partner, i),
      ).append(mark);
    });
    $("tempo").value = String(bpm);
    $("caseCount").textContent = earned.size + " / 3";
    $("moveName").textContent = tr(ally().special);
    $("moveInfo").textContent = t(
      "踩准 4 个音，自动使出" + ally().special[0] + "。",
      "Hit 4 notes on the beat to unleash " + ally().special[1] + ".",
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
    $("turnLabel").textContent = t("回合 ", "TURN ") + String(turn + 1).padStart(2, "0");
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
      phase === "won" || phase === "lost"
        ? t("再战一次", "Rematch")
        : phase === "play" || phase === "counter"
          ? t("暂停对战", "Pause battle")
          : phase === "paused"
            ? t("屏幕琴键继续", "Resume on screen")
            : t("屏幕琴键试玩", "Use screen keys");
    $("screen").disabled = asking;
    $("demo").textContent =
      demoStart !== null ? t("停止示范", "Stop demo") : t("♪ 听示范", "♪ Hear phrase");
    $("demo").disabled = asking || phase === "won" || phase === "lost";
    $("tempo").disabled = phase === "play" || phase === "counter" || demoStart !== null || asking;
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
    paintArena();
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
      name.textContent = s.midi === null ? t("休", "Rest") : pitch(s.midi);
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
    else if (phase === "play" && due !== null) {
      const offset = (now - due) / beatMs();
      position += Math.min(here.midi === null && !restHeld ? here.beats : 0, offset);
    }
    const step = 15;
    slots.forEach((s, i) => {
      const left = 16 + (s.start - position) * step;
      s.el.style.left = left + "%";
      s.el.style.visibility = left < -7 || left > 108 ? "hidden" : "";
      s.el.classList.toggle("current", i === (demo ? demoStep : cursor));
      s.el.classList.toggle("past", i < (demo ? demoStep : cursor));
    });
    Array.from($("laneTicks").children).forEach((tick, n) => {
      tick.style.left = 16 + (n - 2 - (position % 1)) * step + "%";
    });
    $("lane").dataset.timed = String((phase === "play" && due !== null) || demo);
    if (here.midi === null && phase === "play" && !demo) {
      const count = restHeld
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
    const s = slots[demoing ? Math.max(0, demoStep) : cursor] || slots[0];
    for (const [m, b] of keyElements) {
      b.classList.toggle(
        "target",
        s.midi === m && (phase === "play" || phase === "ready" || phase === "paused" || demoing),
      );
      b.setAttribute("aria-label", pitch(m, true));
      if (!whites.includes(m))
        b.querySelector("span").textContent = phrase().notes.includes(m) ? pitch(m) : "";
    }
    let label;
    if (demoing) label = t("示范中 · 跟着听", "Demo · listen along");
    else if (phase === "counter") label = t("对手回合…", "Rival’s turn…");
    else if (phase === "won" || phase === "lost")
      label =
        phase === "won" ? t("道馆挑战成功！", "Gym cleared!") : t("搭档正在休息", "Partner is resting");
    else if (s.midi !== null)
      label = (cursor === 0 ? t("从 ", "Start on ") : t("接下来 ", "Next: ")) + pitch(s.midi, true);
    else label = t("休止", "Rest");
    $("cue").textContent = label;
    lastCue = "";
    $("heard").textContent =
      lastHeard === null
        ? ""
        : (mode === "mic" ? t("听到 ", "Heard ") : t("弹下 ", "Played ")) +
          pitch(lastHeard, true) +
          (lastGrade ? " · " + tr(lastGrade) : "");
  }
  function flash(kind, words) {
    window.DuelArena.effect(kind, ally().type);
    const splash = $("moveSplash");
    clearTimeout(splashTimer);
    splash.textContent = words;
    splash.dataset.kind = kind;
    splash.hidden = false;
    splashTimer = setTimeout(
      () => {
        splash.hidden = true;
      },
      kind === "super" ? 900 : 410,
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
      due = performance.now();
    }
  }
  function touchDown(source, midi) {
    if (phase !== "play" || demoStart !== null || held.has(source) || mode !== "touch") return;
    const now = performance.now();
    restDone(now);
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
  function settle() {
    pendingCounter = true;
    counterShown = false;
    phase = "counter";
    due = null;
    chain = 0;
    const now = performance.now();
    counterAt = now + 550;
    nextTurnAt = now + 1420;
    renderNumbers();
    renderControls();
    updateReadout();
  }
  function counterAttack() {
    if (counterShown) return;
    counterShown = true;
    const damage = protectedTurn ? 0 : gym().counter + 3 * Math.min(errors, 4);
    hp = Math.max(0, hp - damage);
    log(
      damage
        ? foe().name[0] + "还击，搭档失去 " + damage + " HP。"
        : "节奏护盾挡住了" + foe().name[0] + "的还击！",
      damage
        ? foe().name[1] + " strikes back for " + damage + " HP."
        : "Your rhythm shield blocked " + foe().name[1] + "!",
    );
    if (damage) window.DuelArena.effect("ally-hit");
    renderNumbers();
    if (!hp) finish(false);
  }
  function continueTurn() {
    pendingCounter = false;
    turn++;
    phase = "play";
    loadPhrase();
    log(
      "下一回合！从 " + pitch(slots[0].midi, true) + " 开始。",
      "Next turn! Start on " + pitch(slots[0].midi, true) + ".",
    );
    renderNumbers();
    renderControls();
    updateReadout();
  }
  function restDone(now) {
    const s = slots[cursor];
    if (!s || s.midi !== null || due === null) return;
    if (held.size && now >= due) restHeld = true;
    if (!restHeld && now >= due + s.beats * beatMs()) {
      due += s.beats * beatMs();
      cursor++;
      if (cursor === slots.length) settle();
      else updateReadout();
    }
  }
  function accept(midi, now) {
    if (phase !== "play" || demoStart !== null) return;
    restDone(now);
    if (phase !== "play") return;
    const s = slots[cursor];
    lastHeard = midi;
    const button = keyElements.get(midi);
    if (button) {
      button.classList.add("pressed");
      clearTimeout(button.flash);
      button.flash = setTimeout(() => button.classList.remove("pressed"), 200);
    }
    if (s.midi === null) {
      chain = 0;
      errors++;
      due = now;
      restHeld = held.size > 0;
      lastGrade = ["休止时留白", "Leave the rest quiet"];
      renderNumbers();
      updateReadout();
      return;
    }
    if (midi !== s.midi) {
      chain = 0;
      errors++;
      lastGrade = ["试试 " + pitch(s.midi, true), "Try " + pitch(s.midi, true)];
      renderNumbers();
      updateReadout();
      return;
    }
    const ms = beatMs(),
      delta = due === null ? null : now - due;
    if (delta !== null && delta < -ms * 0.44) {
      lastGrade = ["早了一点，等圆环", "A little early · wait for the ring"];
      updateReadout();
      return;
    }
    const timed = delta !== null && Math.abs(delta) <= ms * 0.35;
    if (timed) {
      chain++;
      power++;
      if (chain >= 2) protectedTurn = true;
    } else chain = 0;
    const special = power >= 4;
    if (special) power = 0;
    const end = cursor === slots.length - 1;
    const damage = 3 + (timed ? 2 : 0) + (end ? 12 : 0) + (special ? 12 : 0);
    enemyHp = Math.max(0, enemyHp - damage);
    lastGrade = special
      ? ["大招！", "Super move!"]
      : timed
        ? ["合拍！", "On beat!"]
        : ["音高正确", "Right note"];
    const move = special ? ally().special : ally().move;
    log(
      ally().name[0] + "使出" + move[0] + "！  −" + damage + " HP",
      ally().name[1] + " used " + move[1] + "!  −" + damage + " HP",
    );
    flash(special ? "super" : "hit", special ? tr(move) + "!" : "−" + damage);
    renderNumbers();
    if (!enemyHp) {
      finish(true);
      return;
    }
    if (end) {
      settle();
      return;
    }
    const anchor = timed ? due : now;
    due = anchor + s.beats * ms;
    cursor++;
    updateReadout();
  }
  function finish(won) {
    phase = won ? "won" : "lost";
    pendingCounter = false;
    audio.stopListening();
    stopTones();
    if (won) {
      earned.add(gym().id);
      save();
      window.DuelArena.effect("win");
    }
    log(
      won ? foe().name[0] + "愿意加入你的队伍！" : "搭档需要休息，准备好了可以再来一场。",
      won ? foe().name[1] + " joined your team!" : "Your partner needs a rest. Try a rematch when ready.",
    );
    noteStatus("下一场可以选择新的搭档或道馆。", "Choose a partner or a gym for your next battle.");
    renderAll();
    resultTimer = setTimeout(() => {
      if ((phase === "won" || phase === "lost") && !$("sheet").open) openResult(won);
    }, 700);
  }
  function pause() {
    stopDemo();
    if (phase === "play" || phase === "counter") phase = "paused";
    audio.stopListening();
    stopTones();
    due = null;
    restHeld = false;
    if (phase === "paused") {
      log("对战已暂停。", "Battle paused.");
      noteStatus(
        "点真琴或屏幕琴键继续这一场。",
        "Resume this battle with the microphone or screen keys.",
      );
    }
    renderControls();
    updateReadout();
  }
  function start(kind) {
    if (phase === "won" || phase === "lost") reset();
    stopDemo();
    mode = kind;
    if (pendingCounter) {
      phase = "counter";
      counterAt = performance.now() + 300;
      nextTurnAt = counterAt + 750;
    } else {
      phase = "play";
      due = slots[cursor].midi === null ? performance.now() : null;
      restHeld = false;
      log("轮到" + ally().name[0] + "了！", "It’s " + ally().name[1] + "’s turn!");
    }
    noteStatus(
      kind === "mic" ? "拾音中 · 一次弹一个音，先松开延音踏板。" : "点击琴键，或用电脑 A–K 与上排黑键。",
      kind === "mic"
        ? "Mic on · play one note at a time with the sustain pedal up."
        : "Tap the keys or use A–K and the black keys above them.",
    );
    renderControls();
    updateReadout();
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
    if (phase === "won" || phase === "lost") reset();
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
          if (phase === "play" || phase === "counter") phase = "paused";
          micError = detail || "";
          noteStatus(...explainMic(micError));
        }
        if (status === "off" && mode === "mic" && (phase === "play" || phase === "counter"))
          phase = "paused";
        renderControls();
        updateReadout();
      },
    });
  }
  function stopDemo() {
    demoVersion++;
    demoStart = null;
    demoStep = -1;
  }
  async function demo() {
    if (demoStart !== null) {
      stopDemo();
      renderControls();
      updateReadout();
      drawLane(performance.now());
      return;
    }
    pause();
    const version = ++demoVersion;
    const audible = await audio.unlock();
    if (version !== demoVersion || document.hidden) return;
    demoStart = performance.now() + 240;
    demoStep = -1;
    noteStatus(
      audible ? "跟着轨道听一遍，再自己弹。" : "声音暂时不可用，可以跟着轨道看一遍。",
      audible
        ? "Listen along with the track, then try it yourself."
        : "Audio unavailable. Watch the track for the phrase.",
    );
    renderControls();
    updateReadout();
  }
  function runFrame(now) {
    requestAnimationFrame(runFrame);
    if (document.hidden || now - lastPaint < 30) return;
    lastPaint = now;
    if (demoStart !== null) {
      const position = (now - demoStart) / beatMs(),
        last = slots[slots.length - 1];
      if (position >= last.start + last.beats) {
        stopDemo();
        renderControls();
        updateReadout();
        drawLane(now);
        return;
      }
      const index = slots.findLastIndex((s) => s.start <= position);
      if (index >= 0 && index !== demoStep) {
        demoStep = index;
        const s = slots[index];
        if (s.midi !== null) audio.tone(s.midi, s.beats * beatMs() * 0.00078);
        updateReadout();
      }
      drawLane(now);
    } else if (phase === "play") {
      restDone(now);
      drawLane(now);
    } else if (phase === "counter") {
      if (now >= counterAt && !counterShown) counterAttack();
      if (phase === "counter" && now >= nextTurnAt) continueTurn();
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
        "1. 选择搭档和道馆，点「用真琴出战」，允许麦克风。第一个音可以自己决定什么时候弹。",
        "1. Choose your partner and gym, select Play with my piano and allow the mic. Start the first note whenever you’re ready.",
      ),
    );
    paragraph(
      t(
        "2. 音符从右向左滑。音名到圆环时弹下对应的琴键。弹对就攻击，合拍会蓄能；同一句连中两拍还能挡住对手的还击。",
        "2. Notes travel from right to left. Play the matching key when its name reaches the ring. Correct notes attack, on-beat notes charge power, and two consecutive on-beat hits in a phrase block the counterattack.",
      ),
    );
    paragraph(
      t(
        "3. 蓄满四格自动放大招。错音会加强对手下一次还击，节奏护盾可以全挡下来。击败对手后，它就能成为你下一场的搭档。",
        "3. Four charges trigger the special move. Missed pitches strengthen the next counterattack, which a rhythm shield can block. Defeat a rival to recruit it for the next battle.",
      ),
    );
    paragraph(
      t(
        "麦克风在设备上识别单音。休止时松开琴键和踏板，跟着屏幕数拍。游戏里的乐句是对应书页的原创练习。",
        "The mic detects single notes on this device. Release the key and pedal for rests and follow the count. The game phrases are original exercises for the indicated book pages.",
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
  function openResult(won) {
    showDialog(
      won
        ? t("获得" + gym().badge[0] + "！", gym().badge[1] + " earned!")
        : t("再来挑战", "Try another battle"),
      "result",
    );
    if (won) {
      const img = document.createElement("img");
      img.src = "art/" + gym().foe + ".png";
      img.alt = "";
      img.className = "reward-sprite";
      $("sheetBody").append(img);
      paragraph(tr(foe().name) + t("加入了可选搭档。", " is now a playable partner."));
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
    } else {
      paragraph(
        t(
          "可以放慢到 60 BPM，先听示范，再让搭档上场。",
          "Try 60 BPM, listen to the demo, then send your partner back in.",
        ),
      );
      dialogButton(
        t("慢速再试", "Try at 60 BPM"),
        () => {
          closeDialog();
          bpm = 60;
          save();
          reset();
        },
        true,
      );
    }
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
    if (phase === "play" || phase === "paused" || phase === "counter") {
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
    if (phase === "play" || phase === "counter") {
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
