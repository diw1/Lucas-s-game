(() => {
  "use strict";
  const homeChord = [48, 52, 55];
  const signalChord = [53, 55];
  const modes = {
    oars: {
      question: ["第二个音从 C 往上跳了四度，还是五度？", "Did the second note jump a fourth or a fifth above C?"],
      choices: [["四度 · C 到 F", "Fourth · C to F"], ["五度 · C 到 G", "Fifth · C to G"]],
      listenFor: ["再听一次。可以先在琴上从 C 弹到 F，再从 C 弹到 G，比一比哪一组更像。", "Listen again. Try C to F, then C to G on your piano. Which pair sounds the same?"],
      answers: [["听出来了！C 到 F 是四度。", "You heard it! C to F is a fourth."], ["听出来了！C 到 G 是五度。", "You heard it! C to G is a fifth."]]
    },
    boat: {
      question: ["三个音是一起响，还是一个接一个？", "Do the three notes sound together or one by one?"],
      choices: [["一起响", "Together"], ["一个接一个", "One by one"]],
      listenFor: ["再听开头，三个音是同时响，还是轮流出现？", "Listen to the start again. Do all three notes arrive together, or do they take turns?"],
      answers: [["对！C、E、G 一起响，是柱式和弦。", "Yes! C, E and G sound together as a blocked chord."],
                ["对！你听见三个音轮流出现，是分解和弦。", "Yes! Each note takes its own turn. That is a broken chord."]]
    },
    chords: {
      question: ["听两次和弦，最后响的是哪一个？", "Listen to two chords. Which chord comes last?"],
      choices: [["I · C、E、G", "I · C, E, G"], ["V7 · F、G", "V7 · F, G"]],
      listenFor: ["再听第二个和弦：F 和 G 紧挨着，C、E、G 则隔开一些。", "Listen to the second chord again. F and G sit close together, while C, E and G are spaced apart."],
      answers: [["对！最后是 C、E、G 一起响，回到 I 和弦了。", "Yes! The last chord brings C, E and G together. That’s I."],
                ["对！最后听到紧挨着的 F 和 G，就是书里的两音 V7。", "Yes! F and G sit side by side. That’s the book’s two-note V7."]]
    }
  };

  let quiz;
  let language = "zh";
  const choose = () => Math.random() < 0.5 ? 0 : 1;
  const tr = (pair) => pair[language === "en" ? 1 : 0];

  function cancelSound(q) {
    q.version++;
    q.timers.forEach(clearTimeout);
    q.timers.length = 0;
  }

  function newClue(q) {
    cancelSound(q);
    q.answer = choose();
    q.variation = choose();
    q.phase = "new";
    q.heard = false;
    update();
  }

  function update() {
    if (!quiz) return;
    const q = quiz, el = q.elements, mode = modes[q.id];
    el.title.textContent = tr(["加玩 · 听音猜一猜", "Bonus · Ear challenge"]);
    el.question.textContent = tr(mode.question);
    el.listen.textContent = q.phase === "playing" ? tr(["正在播放…", "Listening…"]) :
      q.heard ? tr(["再听一遍", "Hear it again"]) : tr(["播放谜题", "Play the mystery"]);
    el.listen.disabled = q.phase === "playing";
    el.answers.forEach((answer, i) => {
      answer.textContent = tr(mode.choices[i]);
      answer.disabled = !q.heard || q.phase === "playing" || q.phase === "solved";
    });
    el.next.hidden = q.phase !== "solved";
    el.next.textContent = tr(["再猜一题", "New mystery"]);
    if (q.phase === "solved") el.feedback.textContent = tr(mode.answers[q.answer]);
    else if (q.phase === "retry") el.feedback.textContent = tr(mode.listenFor);
    else if (q.phase === "unavailable") el.feedback.textContent = tr(["暂时无法播放。打开设备声音后可重试。", "Audio is unavailable. Check your device sound and try again."]);
    else el.feedback.textContent = "";
  }

  async function listen(q) {
    if (quiz !== q || q.phase === "playing") return;
    cancelSound(q);
    const version = q.version;
    const solved = q.phase === "solved";
    q.phase = "playing";
    update();
    let ready = false;
    try { ready = await window.FireflyAudio.unlock(); } catch { /* Keep the exercise optional. */ }
    if (quiz !== q || version !== q.version) return;
    if (!ready) {
      q.heard = false;
      q.phase = "unavailable";
      update();
      return;
    }
    const ring = (notes, seconds) => notes.forEach((midi) => window.FireflyAudio.tone(midi, seconds));
    const later = (fn, ms) => q.timers.push(setTimeout(() => {
      if (quiz === q && q.version === version) fn();
    }, ms));
    let end;
    if (q.id === "oars") {
      ring([60], 0.4);
      later(() => ring([q.answer === 0 ? 65 : 67], 0.55), 510);
      end = 1110;
    } else if (q.id === "boat" && q.answer === 0) {
      ring(homeChord, 0.88);
      end = 940;
    } else if (q.id === "boat") {
      const pitches = q.variation ? [55, 52, 48] : homeChord;
      pitches.forEach((midi, index) => later(() => ring([midi], 0.28), index * 330));
      end = 990;
    } else {
      const options = [homeChord, signalChord];
      ring(options[q.variation], 0.58);
      later(() => ring(options[q.answer], 0.72), 830);
      end = 1610;
    }
    later(() => { q.heard = true; q.phase = solved ? "solved" : "guess"; update(); }, end);
  }

  function build(container, q) {
    const make = (tag, parent = container) => parent.appendChild(document.createElement(tag));
    const button = (parent, fn, cls) => {
      const btn = make("button", parent);
      btn.type = "button";
      btn.className = cls;
      btn.addEventListener("click", fn);
      return btn;
    };
    const title = make("strong"), question = make("p"), controls = make("div");
    controls.className = "ear-controls";
    const playback = button(controls, () => { void listen(q); }, "light-btn");
    const answers = [0, 1].map((i) => button(controls, () => {
      if (!q.heard || !["guess", "retry"].includes(q.phase)) return;
      q.phase = i === q.answer ? "solved" : "retry";
      update();
    }, "light-btn"));
    const next = button(controls, () => { newClue(q); playback.focus(); }, "text-btn");
    const feedback = make("p");
    feedback.setAttribute("role", "status");
    q.elements = { title, question, listen: playback, answers, next, feedback };
  }

  function show({lessonId, language: lang, enabled}) {
    const box = document.getElementById("earQuiz");
    if (!box) return;
    language = lang;
    const id = enabled && Object.hasOwn(modes, lessonId) ? lessonId : null;
    if (quiz && quiz.id !== id) {
      cancelSound(quiz);
      quiz = null;
      box.replaceChildren();
    }
    box.hidden = !id;
    if (!id) return;
    if (!quiz) {
      box.classList.add("ear-quiz");
      quiz = { id, version: 0, timers: [] };
      build(box, quiz);
      newClue(quiz);
    } else update();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && quiz?.phase === "playing") {
      cancelSound(quiz);
      quiz.phase = quiz.heard ? "guess" : "new";
      update();
    }
  });
  window.FireflyEar = { show };
})();
