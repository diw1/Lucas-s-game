(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const staff = $("songStaff");
  const firstLine = 25, lineGap = 10, bottomLine = firstLine + 4 * lineGap;
  const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
  let current, score, bars, staffPage, minBarWidth, staffHeight;

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
    const wholeBar = beats === score.beatsPerBar;
    if (wholeBar || beats >= 2) {
      // A whole rest hangs below line four; a half rest sits on the middle line.
      const y = wholeBar ? firstLine + lineGap : firstLine + 2 * lineGap - 5;
      group.append(element("rect", { x: x - 6, y, width: 12, height: 5, fill: "currentColor" }));
    } else if (beats === 0.5) {
      group.append(element("path", {
        d: "M -5 -5 C -7 -9 -4 -12 -1 -10 C 2 -9 1 -5 -1 -4 Q 3 -3 6 -9 L 7 -9 L 0 10 L -2 10 L 3 -4 Q -3 0 -5 -5 Z",
        transform: "translate(" + x + " 48)", fill: "currentColor",
      }));
    } else {
      group.append(element("path", {
        d: "M -3 -14 L 5 -8 L 0 -2 L 5 5 C -4 0 -4 7 0 12 C -10 7 -8 -3 -2 -3 L -6 -7 L 0 -12 Z",
        transform: "translate(" + x + " 46)", fill: "currentColor",
      }));
    }
    if (!wholeBar && (beats === 1.5 || beats === 3)) drawDot(group, x, firstLine + 1.5 * lineGap);
  }
  function drawDot(group, x, y) {
    group.append(element("circle", { cx: x + 10, cy: y, r: 2, fill: "currentColor" }));
  }
  function drawNote(group, x, pitch, beats, sign) {
    const { y } = pitch;
    for (let ledger = bottomLine + lineGap; ledger <= y; ledger += lineGap) {
      group.append(line(x - 9, ledger, x + 9, ledger, "currentColor", 1.25));
    }
    if (sign) group.append(element("text", {
      x: x - 9, y: y + 5, "text-anchor": "end", class: "note-accidental",
    }, sign));
    const whole = beats === 4, filled = beats < 2;
    const head = element("ellipse", {
      cx: x, cy: y, rx: whole ? 6.6 : 5.7, ry: whole ? 3.7 : 4.0,
      transform: whole ? "" : "rotate(-20 " + x + " " + y + ")",
      stroke: "currentColor", "stroke-width": filled ? 1 : 1.8,
      fill: filled ? "currentColor" : "#fffdf1",
    });
    if (!whole) {
      const down = y <= firstLine + 2 * lineGap;
      const stemX = x + (down ? -5 : 5);
      const stemTip = y + (down ? 28 : -28);
      group.append(line(stemX, y, stemX, stemTip, "currentColor", 1.65));
      if (beats === 0.5) group.append(element("path", {
        d: "M0 0 C1 7 12 9 9 18 Q8 21 6 23 C12 12 2 12 0 8 Z", fill: "currentColor",
        transform: "translate(" + stemX + " " + stemTip + ") scale(1 " + (down ? -1 : 1) + ")",
      }));
    }
    group.append(head);
    if (beats === 1.5 || beats === 3) {
      const onLine = (y - firstLine) % lineGap === 0;
      drawDot(group, x, onLine ? y - lineGap / 2 : y);
    }
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
      let offset = 0;
      const bar = bars[b];
      bar.events.forEach(([midi, beats, spelling], i) => {
        const rest = midi === null;
        const pitch = rest ? null : writtenPitch(midi, spelling);
        // Short notes need more horizontal space per beat to keep their flags readable.
        const x = rest && beats === score.beatsPerBar ? (start + end) / 2
          : start + 18 + (barWidth - 26) * offset / bar.weight;
        const group = element("g", { class: "staff-note", "data-bar": b, "data-event": i });
        group.append(element("rect", { x: x - 10, y: 17, width: 20, height: staffHeight - 19, rx: 6, class: "note-halo" }));
        if (rest) drawRest(group, x, beats);
        else {
          const staffPosition = pitch.letter + pitch.octave;
          const oldSign = accidentals.get(staffPosition) || "";
          const changed = pitch.sign !== oldSign;
          drawNote(group, x, pitch, beats, changed ? pitch.sign || "♮" : "");
          accidentals.set(staffPosition, pitch.sign);
        }
        const caption = rest ? (language === "en" ? "rest" : "休") : pitch.label + (midi < 60 ? pitch.octave : "");
        group.append(element("text", { x, y: staffHeight - 7, "text-anchor": "middle", class: "note-name" }, caption));
        layer.append(group);
        offset += Math.sqrt(beats);
      });
    }
    staff.setAttribute("viewBox", "0 0 " + width + " " + staffHeight);
    staff.replaceChildren(layer);
    staffPage = { from, count, width, language };
  }

  function render(state) {
    current = state;
    const { song, barIndex, eventInBar, language, demo, complete } = state;
    const en = language === "en", lang = en ? 1 : 0;
    if (score !== song) {
      score = song;
      bars = song.sections.flatMap((section) => section.bars.map((events) => {
        const weights = events.map(([, beats]) => Math.sqrt(beats));
        return { events, section, weight: weights.reduce((sum, w) => sum + w, 0), shortest: Math.min(...weights) };
      }));
      minBarWidth = Math.max(...bars.map(b => 26 + 20 * b.weight / b.shortest));
      // Keep the pitch labels below the lowest ledger note for the entire song.
      const noteHeights = bars.flatMap(b => b.events.filter(([midi]) => midi !== null)
        .map(([midi, , spelling]) => writtenPitch(midi, spelling).y));
      staffHeight = Math.max(98, Math.max(0, ...noteHeights) + 23);
      staff.style.height = staffHeight + "px";
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
    const fit = Math.max(1, Math.floor((width - 54) / minBarWidth));
    const count = Math.min(bars.length, width >= 490 ? 3 : 2, fit);
    const from = Math.min(bar, bars.length - count);
    if (!staffPage || staffPage.from !== from || staffPage.width !== width || staffPage.count !== count || staffPage.language !== language) {
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
    const melody = active.events.map(([midi, beats, spelling], i) => {
      const pitch = midi === null ? null : writtenPitch(midi, spelling);
      const name = pitch ? pitch.label + pitch.octave : (en ? "rest" : "休止");
      const cue = !complete && i === eventInBar ? (en ? "current: " : "当前 ") : "";
      return cue + name + (en ? " " + beats + (beats === 1 ? " beat" : " beats") : " " + beats + "拍");
    });
    const meter = song.beatsPerBar + (en ? "/4 time" : "/4 拍");
    staff.setAttribute("aria-label", position + " · " + meter + " · " + melody.join(en ? ", " : "，"));
  }

  window.addEventListener("resize", () => { if (current) render(current); });
  window.DuelScore = { render };
})();
