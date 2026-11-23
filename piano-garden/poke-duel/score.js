(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const staff = $("songStaff");
  const firstLine = 25, lineGap = 10, bottomLine = firstLine + 4 * lineGap;
  const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  let current, score, bars, staffPage;

  function element(tag, attributes, label) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    if (label !== undefined) node.textContent = label;
    return node;
  }
  function line(x1, y1, x2, y2, stroke, width = 1) {
    return element("line", { x1, y1, x2, y2, stroke, "stroke-width": width });
  }
  function writtenPitch(midi, spelling) {
    const name = spelling || names[midi % 12] + (Math.floor(midi / 12) - 1);
    const [, letter, sign, octave] = /^([A-G])([♭♯]?)(-?\d+)$/.exec(name);
    const step = (Number(octave) - 4) * 7 + "CDEFGAB".indexOf(letter) - 2;
    return { letter, sign, octave, label: letter + sign, y: bottomLine - step * lineGap / 2 };
  }
  function drawRest(group, x, beats) {
    if (beats === 4 || beats === 2) {
      // A whole rest hangs below line four; a half rest sits on the middle line.
      const y = firstLine + (beats === 4 ? 1 : 2) * lineGap - (beats === 2 ? 5 : 0);
      group.append(element("rect", { x: x - 6, y, width: 12, height: 5, fill: "currentColor" }));
    } else {
      group.append(element("path", {
        d: "M -3 -14 L 5 -8 L 0 -2 L 5 5 C -4 0 -4 7 0 12 C -10 7 -8 -3 -2 -3 L -6 -7 L 0 -12 Z",
        transform: "translate(" + x + " 46)", fill: "currentColor",
      }));
    }
  }
  function drawNote(group, x, pitch, beats, sign) {
    const { y } = pitch;
    for (let ledger = bottomLine + lineGap; ledger <= y; ledger += lineGap) {
      group.append(line(x - 9, ledger, x + 9, ledger, "currentColor", 1.25));
    }
    if (sign) group.append(element("text", {
      x: x - 9, y: y + 5, "text-anchor": "end", class: "note-accidental",
    }, sign));
    const whole = beats === 4;
    const head = element("ellipse", {
      cx: x, cy: y, rx: whole ? 6.6 : 5.7, ry: whole ? 3.7 : 4.0,
      transform: whole ? "" : "rotate(-20 " + x + " " + y + ")",
      stroke: "currentColor", "stroke-width": beats === 1 ? 1 : 1.8,
      fill: beats === 1 ? "currentColor" : "#fffdf1",
    });
    if (!whole) {
      const down = y <= firstLine + 2 * lineGap;
      const stemX = x + (down ? -5 : 5);
      group.append(line(stemX, y, stemX, y + (down ? 28 : -28), "currentColor", 1.65));
    }
    group.append(head);
  }
  function clefAndMeter(layer) {
    layer.append(element("path", {
      class: "staff-clef",
      d: "M20 68 C8 68 3 59 7 51 C10 44 17 40 22 34 C28 27 28 20 25 14 C19 16 17 24 18 32 L23 69 C25 80 22 84 17 84 C13 84 10 81 10 78 C10 75 12 73 15 74 C19 75 18 80 15 80 C18 84 24 80 22 71 L16 35 C14 24 15 14 23 6 C30 10 31 24 26 33 C22 41 14 46 11 53 C7 62 14 69 22 66 C29 64 30 56 26 52 C23 48 17 49 16 53 C15 57 17 60 20 61 C13 61 10 54 14 48 C18 42 27 44 30 51 C35 61 29 69 20 68 Z",
      transform: "translate(-3 0)",
    }));
    const meter = { x: 36, class: "staff-meter", "text-anchor": "middle" };
    layer.append(element("text", { ...meter, y: firstLine + 18 }, score.beatsPerBar),
      element("text", { ...meter, y: bottomLine - 2 }, "4"));
  }
  function drawStaff(width, from, count, language) {
    const left = 48, right = width - 6;
    const barWidth = (right - left) / count;
    const layer = document.createDocumentFragment();
    for (let i = 0; i < 5; i++) {
      const y = firstLine + i * lineGap;
      layer.append(element("path", { d: "M0 " + y + "H" + right, class: "staff-lines" }));
    }
    clefAndMeter(layer);
    for (let b = from; b < from + count; b++) {
      const start = left + (b - from) * barWidth;
      const end = start + barWidth;
      layer.append(element("text", { x: start + 5, y: 13, class: "measure-index", "data-bar": b }, b + 1));
      const lastBar = b === bars.length - 1;
      layer.append(line(end - (lastBar ? 6 : 0), firstLine, end - (lastBar ? 6 : 0), bottomLine, "#778a79"));
      if (lastBar) layer.append(line(end - 1, firstLine, end - 1, bottomLine, "#385643", 3));
      const accidentals = new Map();
      let beat = 0;
      bars[b].events.forEach(([midi, beats, spelling], i) => {
        const rest = midi === null;
        const pitch = rest ? null : writtenPitch(midi, spelling);
        // Whole-measure rests are centred; other events follow the beat grid.
        const x = rest && beats === score.beatsPerBar ? (start + end) / 2
          : start + 18 + (barWidth - 23) * beat / score.beatsPerBar;
        const group = element("g", { class: "staff-note", "data-bar": b, "data-event": i });
        group.append(element("rect", { x: x - 10, y: 17, width: 20, height: 79, rx: 6, class: "note-halo" }));
        if (rest) drawRest(group, x, beats);
        else {
          const staffPosition = pitch.letter + pitch.octave;
          const oldSign = accidentals.get(staffPosition) || "";
          const changed = pitch.sign !== oldSign;
          drawNote(group, x, pitch, beats, changed ? pitch.sign || "♮" : "");
          accidentals.set(staffPosition, pitch.sign);
        }
        const caption = rest ? (language === "en" ? "rest" : "休") : pitch.label;
        group.append(element("text", { x, y: 91, "text-anchor": "middle", class: "note-name" }, caption));
        layer.append(group);
        beat += beats;
      });
    }
    staff.setAttribute("viewBox", "0 0 " + width + " 98");
    staff.replaceChildren(layer);
    staffPage = { from, count, width, language };
  }

  function render(state) {
    current = state;
    const { song, barIndex, eventInBar, language, demo, complete } = state;
    const en = language === "en", lang = en ? 1 : 0;
    if (score !== song) {
      score = song;
      bars = song.sections.flatMap((section) => section.bars.map((events) => ({ events, section })));
      $("scoreProgress").replaceChildren(...bars.map(() => document.createElement("i")));
      staffPage = null;
    }
    const bar = Math.max(0, Math.min(barIndex, bars.length - 1));
    const active = bars[bar];
    const position = en ? "Bar " + (bar + 1) + " of " + bars.length : "第 " + (bar + 1) + " / " + bars.length + " 小节";
    $("songCard").dataset.demo = String(Boolean(demo));
    $("songTitle").textContent = song.title[lang];
    $("songCredit").textContent = song.credit[lang];
    $("scoreBar").textContent = complete ? (en ? "Song complete" : "全曲完成") : position;
    $("scoreSection").textContent = active.section.title[lang];
    const progress = $("scoreProgress");
    progress.setAttribute("aria-valuemax", bars.length);
    progress.setAttribute("aria-valuenow", complete ? bars.length : bar);
    progress.setAttribute("aria-valuetext", $("scoreBar").textContent);
    Array.from(progress.children).forEach((mark, i) => {
      mark.className = complete || i < bar ? "played" : i === bar ? "current" : "";
    });
    const width = Math.max(200, Math.floor(staff.getBoundingClientRect().width));
    const count = Math.min(bars.length, width >= 490 ? 3 : 2);
    const from = Math.min(bar, bars.length - count);
    if (!staffPage || staffPage.from !== from || staffPage.width !== width || staffPage.language !== language) {
      drawStaff(width, from, count, language);
    }
    for (const note of staff.querySelectorAll(".staff-note")) {
      const b = Number(note.dataset.bar), i = Number(note.dataset.event);
      const earlier = b < bar || (b === bar && i < eventInBar);
      note.classList.toggle("played", complete || earlier);
      note.classList.toggle("current", !complete && b === bar && i === eventInBar);
    }
    for (const index of staff.querySelectorAll(".measure-index")) {
      index.classList.toggle("current", !complete && Number(index.dataset.bar) === bar);
    }
    const melody = active.events.map(([midi, beats, spelling]) => {
      const name = midi === null ? (en ? "rest" : "休止") : writtenPitch(midi, spelling).label;
      return name + (en ? " " + beats + (beats === 1 ? " beat" : " beats") : " " + beats + "拍");
    });
    staff.setAttribute("aria-label", position + " · " + melody.join(en ? ", " : "，"));
  }

  window.addEventListener("resize", () => { if (current) render(current); });
  window.DuelScore = { render };
})();
