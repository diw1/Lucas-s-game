(() => {
  "use strict";
  const lessons = window.FireflyLessons;
  const audio = window.FireflyAudio;
  const $ = (id) => document.getElementById(id);
  const namespace = "lucas.firefly-vale.v1";
  const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  const flatNames = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
  const beatMs = 520;
  let whites = [];
  let shortcuts = {};
  const keys = new Map();
  const voices = new Map();
  const shortFor = (midi) => Object.keys(shortcuts).find((key) => shortcuts[key] === midi).toUpperCase();
  const isBlack = (midi) => names[midi % 12].length === 2;
  const pitch = (midi) => (phrase().accidentals === "flat" ? flatNames : names)[midi % 12];
  const fullPitch = (midi) => pitch(midi) + (Math.floor(midi / 12) - 1);
  const lamp = '<svg class="ico" aria-hidden="true"><use href="#i-lamp"/></svg>';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(namespace)) || {}; } catch { /* Private or first visit. */ }
  const lastIndex = lessons.findIndex((item) => item.id === saved.lesson);
  const recommended = lessons.findIndex((item) => item.id === "oars");
  const startPage = 35;
  const pageBand = (item) => {
    const first = Number.parseInt(item.page, 10);
    if (first < startPage) return "early";
    return first <= 45 ? "current" : "later";
  };
  const state = {
    language: saved.language === "en" ? "en" : "zh",
    index: saved.startPage === startPage && lastIndex >= 0 ? lastIndex : Math.max(0, recommended),
    band: "current",
    hints: saved.hints !== false,
    trail: {}, passes: {},
    round: 0, cursor: 0, phase: "play", demoIndex: -1,
    micState: "off", micDetail: "", message: "ready", heard: null
  };
  for (const item of lessons) {
    const n = saved.trail?.[item.id];
    state.trail[item.id] = Number.isInteger(n) && n >= 0 && n <= 4 ? n : 0;
    state.passes[item.id] = saved.passes?.[item.id] === true || n === 4;
  }
  const current = () => lessons[state.index];
  const phrase = () => current().rounds[state.round];
  const lit = () => state.trail[current().id];
  const t = (zh, en) => state.language === "en" ? en : zh;
  const copy = (item, field) => state.language === "en" ? item[field + "En"] : item[field];
  const lessonName = (item) => t(item.name, item.en);
  const page = (item) => t("第 " + item.page + " 页", (item.page.includes("–") ? "pp. " : "p. ") + item.page);
  function save() {
    try {
      const { language, trail, passes, hints } = state;
      localStorage.setItem(namespace, JSON.stringify({ language, lesson: current().id, trail, passes, hints, startPage }));
    } catch { /* Play continues in this tab when storage is unavailable. */ }
  }

  function release(input) {
    const end = voices.get(input);
    if (end) {
      voices.delete(input); end();
      if (restWaitingForRelease && voices.size === 0) beginRest();
    }
  }
  function releaseAll() { for (const input of voices.keys()) release(input); }
  function keyDown(input, midi) {
    if (state.phase !== "play" || voices.has(input)) return;
    voices.set(input, audio.press(midi));
    play(midi);
  }
  function buildKeys() {
    const base = current().baseMidi ?? 60;
    whites = [];
    for (let midi = base; whites.length < 8; midi++) if (!isBlack(midi)) whites.push(midi);
    shortcuts = {};
    "asdfghjk".split("").forEach((key, i) => { shortcuts[key] = whites[i]; });
    const topKeys = "wertyui";
    for (let i=0; i<7; i++) if (whites[i+1]-whites[i]===2) shortcuts[topKeys[i]]=whites[i]+1;
    keys.clear();
    $("keyboard").replaceChildren();
    for (const [shortcut, midi] of Object.entries(shortcuts).sort((a,b) => a[1] - b[1])) {
      const white = whites.includes(midi);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "piano-key " + (white ? "white" : "black");
      button.dataset.note = midi;
      button.setAttribute("aria-label", fullPitch(midi) + " (" + shortcut.toUpperCase() + ")");
      if (!white) button.style.left = (whites.filter((note) => note < midi).length * 12.5) + "%";
      const keyName = pitch(midi) === "C" ? 'C<sub>' + (Math.floor(midi/12)-1) + '</sub>' : pitch(midi);
      button.innerHTML = '<span class="key-note">' + (white ? keyName : "") + '</span><small class="key-short">' + shortFor(midi) + '</small>';
      button.addEventListener("pointerdown", (ev) => {
        if (ev.button !== 0) return;
        button.setPointerCapture(ev.pointerId);
        keyDown("pointer"+ev.pointerId, midi);
      });
      button.addEventListener("lostpointercapture", (ev) => release("pointer"+ev.pointerId));
      button.addEventListener("click", (ev) => {
        if (ev.detail === 0 && state.phase === "play") { audio.tone(midi, .5); play(midi); }
      });
      keys.set(midi, button);
      $("keyboard").append(button);
    }
  }
  function pulse(midi) {
    const key = keys.get(midi);
    if (!key) return;
    key.classList.add("pressed");
    clearTimeout(key.pulseTimer);
    key.pulseTimer = setTimeout(() => key.classList.remove("pressed"), 200);
  }
  function drawScore() {
    const p = phrase();
    const isDemo = state.phase === "demo";
    const active = isDemo ? state.demoIndex : state.cursor;
    const degree = (midi) => Math.floor(midi/12)*7 + "CDEFGAB".indexOf(pitch(midi)[0]);
    const bass = (p.clef || current().clef) === "bass";
    const bottom = bass ? 43 : 64;
    const noteY = (midi) => 67.4 - (degree(midi) - degree(bottom)) * 4.8;
    const restY = (beats) => beats === 4 ? 38.6 : 43.4;
    const restName = (beats) => t(beats + " 拍休止", beats + "-beat rest");
    const area = 290;
    const xpos = p.notes.map((_, i) => 75 + i * (area / (p.notes.length - 1)));
    let drawing = "";
    if (active >= 0 && active < p.notes.length) {
      const y = p.notes[active] === null ? restY(p.beats[active]) + 2.4 : noteY(p.notes[active]);
      drawing += '<circle cx="'+xpos[active]+'" cy="'+y+'" r="13" fill="'+(isDemo ? "#ffe6a6" : "#d9eed7")+'"/>';
    }
    for (let i = 0; i < 5; i++) {
      const y = noteY(bottom) - i * 9.6;
      drawing += '<path class="staff-line" d="M12 ' + y + 'h380"/>';
    }
    if (bass) {
      // The two dots straddle the F line (fourth line from the bottom).
      drawing += '<g fill="#364d47"><path d="M14 40C13 32 19 27 25 28c7 .4 10 6 9 13-1 10-8 17-20 22 10-8 15-16 15-25 0-6-2-8-6-8-4 0-6 3-7 5 2-1 6-1 7 2 2 5-5 8-8 4Z"/><circle cx="38" cy="34" r="2"/><circle cx="38" cy="43" r="2"/></g>';
    } else {
      drawing += '<text x="14" y="68" font-size="57" font-family="Segoe UI Symbol,Apple Symbols,Noto Music,serif" fill="#364d47">𝄞</text>';
    }
    const accidentals = new Map();
    p.notes.forEach((midi, i) => {
      const x = xpos[i];
      if (i > 0 && p.bars?.includes(i)) {
        const barX = (x + xpos[i-1]) / 2;
        drawing += '<path class="ledger" d="M'+barX+' 29v38.4"/>';
        accidentals.clear();
      }
      const className = isDemo ? (i === active ? "demo-note" : "") : (i < active ? "played" : i === active ? "current" : "");
      drawing += '<g class="' + className + '">';
      if (midi === null) {
        const beats = p.beats[i];
        drawing += '<rect x="'+(x-6)+'" y="'+restY(beats)+'" width="12" height="4.8" fill="currentColor"/>';
        if (state.hints) drawing += '<text class="note-label" x="'+x+'" y="107" text-anchor="middle">'+t(beats+" 拍", beats+" beats")+'</text>';
        drawing += '</g>';
        return;
      }
      const y = noteY(midi), down = degree(midi) - degree(bottom) >= 4;
      const staffStep = degree(midi) - degree(bottom);
      const ledgerAt = (step) => '<path class="ledger" d="M' + (x-12) + ' ' + (67.4 - step*4.8) + 'h24"/>';
      for (let step = -2; step >= staffStep; step -= 2) drawing += ledgerAt(step);
      for (let step = 10; step <= staffStep; step += 2) drawing += ledgerAt(step);
      const sign = pitch(midi).slice(1);
      if (sign !== (accidentals.get(staffStep) || "")) {
        drawing += '<text class="accidental" x="'+(x-11)+'" y="'+(y+6)+'" text-anchor="end" font-family="Segoe UI Symbol,Apple Symbols,serif" font-size="22" fill="currentColor">'+(sign || "♮")+'</text>';
      }
      accidentals.set(staffStep, sign);
      drawing += '<ellipse class="note-head' + (p.beats[i] >= 2 ? " hollow" : "") + '" cx="' + x + '" cy="' + y + '" rx="6.5" ry="4.5" transform="rotate(-19 ' + x + ' ' + y + ')"/>';
      drawing += '<path class="stem" d="M' + (x + (down ? -5.9 : 5.9)) + ' ' + y + 'v' + (down ? 26 : -26) + '"/>';
      if (p.touch === "staccato") drawing += '<circle class="articulation" cx="' + x + '" cy="' + (y + (down ? -9 : 9)) + '" r="2"/>';
      if (state.hints) drawing += '<text class="note-label" x="' + x + '" y="107" text-anchor="middle">' + pitch(midi) + '</text>';
      drawing += '</g>';
    });
    if (p.touch === "legato") drawing += '<path class="slur" d="M' + xpos[0] + ' ' + (noteY(p.notes[0])+9) + ' Q215 99 ' + xpos.at(-1) + ' ' + (noteY(p.notes.at(-1))+9) + '"/>';
    const accessibleNotes = state.hints ? p.notes.map((midi, i) => midi === null ? restName(p.beats[i]) : fullPitch(midi)).join(", ") : t("按五线谱弹奏", "Read the staff");
    $("staff").innerHTML = '<svg viewBox="0 0 406 114" role="img" aria-label="' + accessibleNotes + '">' + drawing + '</svg>';
    for (const [midi, button] of keys) {
      button.classList.toggle("target", (isDemo || state.hints) && midi === p.notes[active]);
      if (isBlack(midi)) {
        button.setAttribute("aria-label", fullPitch(midi) + " (" + shortFor(midi) + ")");
        button.querySelector(".key-note").textContent = state.hints && p.notes.includes(midi) ? pitch(midi) : "";
      }
    }
  }
  function paintScene() {
    const n = lit();
    window.FireflyScene.draw($("landscape"), { lesson: state.index, place: current().id, lit: n, total: 4, celebrate: n === 4 });
    $("lampCount").textContent = n + " / 4";
    $("lampTrack").innerHTML = [0,1,2,3].map((i) => '<span class="' + (i < n ? "lit" : "") + '">' + lamp + '</span>').join("");
    $("sceneEyebrow").textContent = page(current()) + " · " + current().piece;
    $("sceneName").textContent = lessonName(current());
  }
  function drawMap() {
    $("lessonList").replaceChildren();
    $("mapTabs").setAttribute("aria-label", t("选择教材页码", "Choose book pages"));
    for (const tab of $("mapTabs").querySelectorAll("button")) {
      const range = tab.dataset.pages;
      tab.textContent = t(range + " 页", "pp. " + range);
      tab.setAttribute("aria-pressed", String(tab.dataset.band === state.band));
    }
    lessons.forEach((item, i) => {
      if (pageBand(item) !== state.band) return;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lesson";
      const active = state.index === i;
      if (active) b.setAttribute("aria-current", "step");
      b.innerHTML = '<span class="lesson-num">' + (state.passes[item.id] ? "✓" : "0"+(i+1)) + '</span><span class="lesson-text"><strong>' + lessonName(item) + '</strong><small>' + page(item) + ' · ' + copy(item, "skill") + '</small></span><span class="lesson-arrow" aria-hidden="true">' + (active ? "◆" : "›") + '</span>';
      if (state.passes[item.id]) b.setAttribute("aria-label", lessonName(item) + t("，已完成", ", completed"));
      b.addEventListener("click", () => {
        if (!active) {
          openLesson(i);
          const selected = $("lessonList").querySelector('[aria-current]');
          if (selected) selected.focus({preventScroll:true});
        }
      });
      $("lessonList").append(b);
    });
    const list = $("lessonList"), active = list.querySelector('[aria-current]');
    if (active && list.scrollWidth > list.clientWidth) {
      const offset = active.getBoundingClientRect().left - list.getBoundingClientRect().left;
      list.scrollLeft += offset - (list.clientWidth - active.clientWidth)/2;
    }
  }
  function drawFeedback() {
    const p = phrase(), demoing = state.phase === "demo";
    const item = demoing ? state.demoIndex : state.cursor;
    if (p.notes[item] === null) {
      const beats = p.beats[item];
      const feedback = $("feedback");
      if (!demoing && restWaitingForRelease) {
        feedback.textContent = t("松开琴键，准备数 " + beats + " 拍休止。", "Lift your fingers and get ready to count " + beats + " silent beats.");
      } else if (restBeat === 0) {
        feedback.textContent = t("准备休止，手指休息一下。", "Get ready for the rest. Let the last note finish.");
      } else {
        feedback.textContent = t("休止 · " + restBeat + " / " + beats + " 拍，先不弹。", "Rest · beat " + restBeat + " of " + beats + ". Wait before playing.");
      }
      feedback.dataset.kind = "rest";
      return;
    }
    const next = p.notes[state.cursor];
    const answer = state.hints && next != null ? fullPitch(next) : t("谱上的下一个音", "the next note on the staff");
    const messages = {
      ready: t("弹完这句就能点灯。点琴键、按 A–K，或开启真琴拾音。", "Play this phrase to light a lantern. Tap the keys, use A–K, or turn on piano listening."),
      demo: t("听小狐狸弹，留意最后一个音有多长。", "Listen to Fox. How long does the last note ring?"),
      silentDemo: t("跟着亮起的琴键看一遍。浏览器的声音暂时不可用。", "Watch the keys light up. Audio is unavailable in this browser."),
      again: t("轮到你了，从第一个音开始。", "Your turn. Start with the first note."),
      ok: t("接上了！继续弹。", "That’s it! Keep going."),
      miss: t("刚才是 " + fullPitch(state.heard ?? 60) + "，试试 " + answer + "。", "That was " + fullPitch(state.heard ?? 60) + ". Try " + answer + ".")
    };
    $("feedback").textContent = messages[state.message] || messages.ready;
    $("feedback").dataset.kind = state.message;
  }
  function drawMic() {
    const mode = state.micState;
    const live = mode === "listening", pending = mode === "requesting";
    const mic = $("mic");
    mic.setAttribute("aria-pressed", String(live || pending));
    mic.querySelector("span").textContent = live ? t("关闭拾音", "Stop listening") : pending ? t("取消开启", "Cancel request") : t("开启真琴拾音", "Use my piano");
    const info = $("micInfo");
    info.hidden = mode === "off";
    if (live) {
      info.textContent = current().id === "drums"
        ? t("拾音会识别新弹的音。休止时松开琴键和踏板，听琴声收住，再跟着屏幕数拍。", "Listening for new notes. At a rest, release the key and pedal, listen for silence and follow the count.")
        : t("正在听这台设备旁的钢琴。一次弹一个音，暂时松开延音踏板。", "Listening on this device. Play one note at a time with the sustain pedal up.");
    }
    if (pending) info.textContent = t("请在浏览器中允许使用麦克风。", "Allow microphone access in your browser.");
    if (mode === "error") {
      let zh = "麦克风未能启动，可重试，也可以继续点琴键。";
      if (/access is off/i.test(state.micDetail)) zh = "麦克风权限未开启，可在浏览器中允许，也可以继续点琴键。";
      if (/No microphone/i.test(state.micDetail)) zh = "没有找到麦克风，仍然可以点屏幕琴键。";
      if (/HTTPS/i.test(state.micDetail)) zh = "这个浏览器需要通过 HTTPS 或本机 localhost 地址使用麦克风，屏幕琴键可以照常玩。";
      info.textContent = t(zh, state.micDetail);
    }
  }
  function drawStation() {
    const item = current(), phase = state.phase;
    const playArea = phase === "play" || phase === "demo";
    $("playArea").hidden = !playArea;
    $("reward").hidden = playArea;
    $("demo").hidden = !playArea;
    $("chord").hidden = !playArea || !phrase().chord;
    $("chord").disabled = phase === "demo";
    if (phrase().chord) $("chord").textContent = t(phrase().chord.label, phrase().chord.labelEn);
    $("practiceLabel").textContent = playArea ? t("乐句 " + (state.round+1) + " / 3", "Phrase " + (state.round+1) + " of 3") : t("森林旅程", "Forest trail");
    $("practiceTitle").textContent = playArea ? copy(item, "skill") : lessonName(item);
    $("demo").querySelector("span").textContent = phase === "demo" ? t("结束示范", "Stop demo") : t("听一遍", "Hear it");
    $("hints").textContent = state.hints ? t("隐藏音名和键位提示", "Hide note hints") : t("显示音名和键位提示", "Show note hints");
    $("hints").setAttribute("aria-pressed", String(state.hints));
    $("instruction").textContent = copy(phrase(), "hint");
    if (playArea) { drawScore(); drawFeedback(); drawMic(); }
    else {
      const transition = phase === "round";
      const bench = phase === "bench";
      $("rewardTitle").textContent = transition ? t("第 " + lit() + " 盏灯亮了！", "Lantern " + lit() + " is glowing!") : bench ? t("最后一盏，在你的钢琴上。", "Light the last lantern at your piano.") : t("小狐狸到家了！", "Fox made it home!");
      $("rewardCopy").textContent = transition ? t("小狐狸往前走了一段。准备好再弹下一句了吗？", "Fox is a little closer to home. Ready for the next phrase?") : bench ? copy(item,"bench") : t("这一站的四盏灯都亮了。你可以再弹一遍，也可以换一站。", "All four lanterns are glowing. Play this trail again or visit another stop.");
      $("advance").textContent = transition ? t("弹下一句 →", "Next phrase →") : bench ? t("我在真琴上弹过了 ✓", "I played it on my piano ✓") : t("去下一站 →", "Next stop →");
      const next = lessons[state.index + 1];
      $("advance").hidden = phase === "done" && (!next || pageBand(next) !== pageBand(item));
      $("replay").textContent = transition ? t("再弹这一句", "Play this phrase again") : bench ? t("再练游戏里的乐句", "Practise the phrases again") : t("再玩这一站", "Play this stop again");
    }
    $("bookLabel").textContent = t("纸书任务", "At your piano") + " · " + page(item) + " · " + item.piece;
    $("bookTask").textContent = copy(item,"bench");
    $("bookNote").textContent = t("游戏里的短句是原创热身。拾音会检查音高和顺序。节奏和触键可以跟示范、书谱对照。", "The game phrases are original warm-ups. Piano listening checks pitch and order. Use the demo and your book to compare rhythm and touch.");
    $("backing").textContent = t("听教材官方伴奏 ↗", "Listen to the book accompaniments ↗");
    window.FireflyEar.show({lessonId: item.id, language: state.language, enabled: phase === "bench" || phase === "done"});
  }
  function drawAll() {
    document.documentElement.lang = t("zh-Hans","en");
    $("language").textContent = t("English", "中文");
    $("title").textContent = t("萤火琴谷", "Firefly Vale");
    $("homeText").textContent = document.body.hasAttribute("data-standalone") ? t("选一站", "Choose a stop") : t("Lucas 的游戏厅", "Lucas’s arcade");
    $("tagline").textContent = t("弹一小段，陪小狐狸点亮回家的路。", "Play a little tune and light the way home for Fox.");
    $("mapTitle").textContent = t("选一站", "Choose a stop");
    $("landscape").setAttribute("aria-label",t("小狐狸穿过森林溪谷，沿路的灯笼随你的练习点亮。","Fox explores a woodland valley. The lanterns light up as you play."));
    drawMap(); paintScene(); drawStation();
  }
  let demoToken = 0, timer;
  let restTimer, restBeat = 0, restWaitingForRelease = false;
  function cancelRest() {
    clearTimeout(restTimer);
    restWaitingForRelease = false; restBeat = 0;
  }
  function beginRest(tailMs = 0) {
    cancelRest();
    if (state.phase !== "play" || phrase().notes[state.cursor] !== null || document.hidden) return;
    restWaitingForRelease = voices.size > 0;
    drawScore(); drawFeedback();
    if (restWaitingForRelease) return;
    function count() {
      ++restBeat;
      if (restBeat > phrase().beats[state.cursor]) {
        cancelRest(); advanceItem(); return;
      }
      drawFeedback();
      restTimer = setTimeout(count, beatMs);
    }
    if (tailMs > 0) restTimer = setTimeout(count, tailMs);
    else count();
  }
  function cancelDemo() {
    ++demoToken;
    clearTimeout(timer); cancelRest();
    if (state.phase === "demo") {
      state.phase = "play"; state.demoIndex = -1; state.message = "again";
    }
  }
  async function demo() {
    if (state.phase === "demo") { cancelDemo(); drawStation(); return; }
    if (state.phase !== "play") return;
    cancelDemo();
    releaseAll();
    const token = demoToken, p = phrase();
    state.phase = "demo"; state.cursor = 0; state.message = "demo"; state.demoIndex = -1;
    drawStation();
    const audible = await audio.unlock();
    if (token !== demoToken) return;
    if (!audible) { state.message = "silentDemo"; drawFeedback(); }
    function step(i, count = 1) {
      if (token !== demoToken) return;
      if (i >= p.notes.length) { cancelDemo(); drawStation(); return; }
      state.demoIndex = i;
      if (p.notes[i] === null) {
        restBeat = count;
        drawScore(); drawFeedback();
        timer = setTimeout(() => {
          if (count < p.beats[i]) step(i, count + 1);
          else step(i + 1);
        }, beatMs);
        return;
      }
      const seconds = p.beats[i] * beatMs / 1000;
      const length = p.touch === "staccato" ? seconds * 0.32 : p.touch === "legato" ? seconds : seconds * 0.83;
      if (audible) audio.tone(p.notes[i], length);
      drawScore(); drawFeedback();
      timer = setTimeout(() => step(i + 1), seconds * 1000 + (i === p.notes.length-1 ? 220 : 0));
    }
    step(0);
  }
  function play(midi) {
    if (state.phase !== "play") return;
    pulse(midi);
    if (phrase().notes[state.cursor] === null) {
      beginRest(beatMs);
      return;
    }
    if (midi !== phrase().notes[state.cursor]) {
      state.heard = midi; state.message = "miss"; drawFeedback(); return;
    }
    advanceItem();
  }
  function advanceItem() {
    const priorBeats = phrase().beats[state.cursor];
    ++state.cursor;
    state.message = "ok";
    if (state.cursor < phrase().notes.length) {
      if (phrase().notes[state.cursor] === null) beginRest(priorBeats * beatMs);
      else { drawScore(); drawFeedback(); }
      return;
    }
    state.trail[current().id] = Math.max(lit(), state.round + 1);
    state.phase = state.round === current().rounds.length - 1 ? "bench" : "round";
    if (state.phase === "bench") audio.stopListening();
    save(); paintScene(); drawStation(); $("advance").focus({preventScroll:true});
  }
  function startRound(index) {
    cancelRest();
    state.round = index; state.cursor = 0; state.message = "ready"; state.phase = "play";
    drawStation();
  }
  function openLesson(index) {
    cancelDemo(); releaseAll(); audio.stopListening();
    state.index = index; state.cursor = 0; state.message = "ready";
    state.band = pageBand(current());
    state.micState = "off"; state.micDetail = "";
    state.round = Math.min(lit(), current().rounds.length - 1);
    state.phase = lit() === 4 ? "done" : lit() === 3 ? "bench" : "play";
    $("bookDetails").open = false;
    buildKeys();
    drawAll(); save();
  }
  $("advance").addEventListener("click", () => {
    if (state.phase === "round") { startRound(state.round + 1); $("demo").focus({preventScroll:true}); }
    else if (state.phase === "bench") {
      state.trail[current().id] = 4; state.passes[current().id] = true; state.phase = "done";
      save(); drawAll();
    } else if (state.phase === "done" && state.index < lessons.length - 1) openLesson(state.index + 1);
  });
  $("replay").addEventListener("click", () => {
    if (state.phase === "round") startRound(state.round);
    else { state.trail[current().id] = 0; save(); startRound(0); paintScene(); }
    $("demo").focus({preventScroll:true});
  });
  $("mic").addEventListener("click", () => {
    if (["listening","requesting"].includes(state.micState)) { audio.stopListening(); return; }
    audio.listen({ onNote: play, onState: (mode, detail) => {
      state.micState = mode; state.micDetail = detail || ""; drawMic();
    }});
  });
  $("chord").addEventListener("click", () => {
    if (state.phase !== "play" || !phrase().chord) return;
    for (const midi of phrase().chord.notes) { audio.tone(midi, .86); pulse(midi); }
  });
  $("mapTabs").addEventListener("click", (event) => {
    const tab = event.target.closest("button[data-band]");
    if (tab) { state.band = tab.dataset.band; drawMap(); }
  });
  $("demo").addEventListener("click", demo);
  $("hints").addEventListener("click", () => { state.hints = !state.hints; save(); drawStation(); });
  $("language").addEventListener("click", () => { state.language = t("en","zh"); save(); drawAll(); });
  document.addEventListener("keydown", (event) => {
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return;
    const midi = shortcuts[event.key.toLowerCase()];
    if (typeof midi !== "number" || state.phase !== "play") return;
    event.preventDefault(); keyDown("key"+event.code, midi);
  });
  document.addEventListener("keyup", (event) => release("key"+event.code));
  document.addEventListener("pointerup", (event) => release("pointer"+event.pointerId));
  document.addEventListener("pointercancel", (event) => release("pointer"+event.pointerId));
  window.addEventListener("blur", releaseAll);
  window.addEventListener("pagehide", releaseAll);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { cancelRest(); releaseAll(); }
    if (document.hidden && state.phase === "demo") { cancelDemo(); drawStation(); }
    if (!document.hidden && state.phase === "play" && phrase().notes[state.cursor] === null) beginRest();
  });
  openLesson(state.index);
})();
