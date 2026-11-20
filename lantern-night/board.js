(() => {
  "use strict";

  const ports = [
    { bit: 1, name: "up", x: 50, y: -1, dx: 0, dy: -1 },
    { bit: 2, name: "right", x: 101, y: 50, dx: 1, dy: 0 },
    { bit: 4, name: "down", x: 50, y: 101, dx: 0, dy: 1 },
    { bit: 8, name: "left", x: -1, y: 50, dx: -1, dy: 0 }
  ];
  const names = { source: "Firefly light source", lamp: "Paper lantern", wire: "Copper pipe", rock: "Rock", empty: "Empty tile" };
  let boardNumber = 0;

  function pipePath(active) {
    if (active.length === 2) {
      const [a, b] = active;
      if (a.dx === -b.dx && a.dy === -b.dy) {
        return `M${a.x} ${a.y} L${b.x} ${b.y}`;
      }
      // Two tangent segments and a circular quarter bend.
      const radius = 25;
      const ax = 50 + a.dx * radius, ay = 50 + a.dy * radius;
      const bx = 50 + b.dx * radius, by = 50 + b.dy * radius;
      const sweep = a.dx * b.dy - a.dy * b.dx < 0 ? 1 : 0;
      return `M${a.x} ${a.y} L${ax} ${ay} A${radius} ${radius} 0 0 ${sweep} ${bx} ${by} L${b.x} ${b.y}`;
    }
    return active.map(p => `M50 50 L${p.x} ${p.y}`).join(" ");
  }

  function pipes(tile) {
    const active = ports.filter(p => tile.base & p.bit);
    if (!active.length) return "";
    const d = pipePath(active);
    const collars = active.map(p => {
      const x = 50 + p.dx * 37, y = 50 + p.dy * 37;
      return `<g class="ln-collar" transform="translate(${x} ${y}) rotate(${p.dx ? 90 : 0})">
        <rect x="-8.2" y="-3.4" width="16.4" height="6.8" rx="1.8"/>
        <path d="M-5.8 -1.25h11.6"/>
      </g>`;
    }).join("");
    const junction = active.length >= 3 || (active.length === 1 && tile.type === "wire")
      ? '<g class="ln-joint"><circle cx="50" cy="50" r="8.2"/><circle cx="50" cy="50" r="3.1"/></g>' : "";
    return `<g class="ln-rotor">
      <path class="ln-pipe-shadow" d="${d}"/>
      <path class="ln-channel" d="${d}"/><path class="ln-lip" d="${d}"/>
      <path class="ln-tube" d="${d}"/><path class="ln-tube-glint" d="${d}"/>
      <path class="ln-current" d="${d}"/>${collars}${junction}
    </g>`;
  }

  function devices(id) {
    const defs = `<defs>
      <linearGradient id="${id}-brass" x1="0" y1="0" x2=".85" y2="1" gradientUnits="objectBoundingBox">
        <stop stop-color="#ffdf91"/><stop offset=".24" stop-color="#cc9c5a"/>
        <stop offset=".6" stop-color="#94643f"/><stop offset="1" stop-color="#c69d60"/>
      </linearGradient>
      <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
        <stop stop-color="#b9e0a7"/><stop offset=".42" stop-color="#49786a"/><stop offset="1" stop-color="#213f3d"/>
      </linearGradient>
      <radialGradient id="${id}-halo">
        <stop stop-color="#ffe29c" stop-opacity=".67"/><stop offset=".55" stop-color="#ffc364" stop-opacity=".35"/>
        <stop offset="1" stop-color="#ffb34f" stop-opacity="0"/>
      </radialGradient>
      <symbol id="${id}-source" viewBox="0 0 100 100">
        <circle class="ln-source-halo" cx="50" cy="51" r="37" fill="url(#${id}-halo)"/>
        <g stroke="#252c23" stroke-width="2.7" stroke-linejoin="round">
          <path d="M40 29v-3c0-14 20-15 20 0v3" fill="none" stroke="#a88c55" stroke-width="4"/>
          <path d="M37 31q13-6 26 0l-3 6H40Z" fill="url(#${id}-brass)"/>
          <path d="M40 35h20l5 29q-15 8-30 0Z" fill="url(#${id}-glass)"/>
          <path d="M41 37l-3 22M59 37l3 22" fill="none" stroke="#eddf9b" stroke-width="1.3"/>
          <path d="M34 64q16 5 32 0l-1 7q-15 5-30 0Z" fill="url(#${id}-brass)"/>
          <path d="M36 72h28l2 3q-16 4-32 0Z" fill="#785138"/>
        </g>
        <g class="ln-firefly">
          <path d="M49 49q-11-13-13-5-1 6 12 8m3-2q9-16 13-8 3 6-10 11" fill="#e5efbb" fill-opacity=".91" stroke="#687850" stroke-width="1.1"/>
          <path d="M48 50q-4 8 1 11 6-1 6-9Z" fill="#ffe079" stroke="#b89136" stroke-width="1"/>
          <circle cx="51" cy="49" r="3" fill="#675938"/><circle cx="50" cy="57" r="2.3" fill="#fff5b4"/>
        </g>
      </symbol>
      <symbol id="${id}-lamp" viewBox="0 0 100 100">
        <circle class="ln-lamp-halo" cx="50" cy="49" r="39" fill="url(#${id}-halo)"/>
        <path d="M44 26v-2a6 6 0 0 1 12 0v2" fill="none" stroke="#9c8562" stroke-width="2.4"/>
        <path class="ln-shade" d="M38 32q12-4 24 0l8 10v14l-9 10q-11 3-22 0l-9-10V42Z" stroke="#302d29" stroke-width="2.6" stroke-linejoin="round"/>
        <path class="ln-fins" d="M43 32q-11 17 0 33m14-33q11 17 0 33M32 41q18-5 36 0M31 56q19 5 38 0" fill="none" stroke-width="1.35"/>
        <path class="ln-lamp-star" d="m50 38 2.3 7.6 5.8 3.4-5.8 3.3L50 60l-2.3-7.7-5.8-3.3 5.8-3.4Z"/>
        <path d="M39 27h22l3 4-3 2H39l-3-2Zm0 38q11 2 22 0v4q-11 3-22 0Z" fill="url(#${id}-brass)" stroke="#392e24" stroke-width="2" stroke-linejoin="round"/>
        <path d="M50 70v5m0-1-2 4m2-4 2 4" stroke="#ba7f43" fill="none" stroke-width="2.3" stroke-linecap="round"/>
        <g class="ln-lamp-rays" fill="none" stroke="#ffe7a4" stroke-width="2.1" stroke-linecap="round">
          <path d="m26 36-4-2m2 15h-5m6 13-4 2m52-28 5-3m-3 16h5m-5 13 4 2"/>
        </g>
      </symbol>
      <symbol id="${id}-rock" viewBox="0 0 100 100">
        <ellipse cx="49" cy="66" rx="29" ry="5" fill="#132c2e" opacity=".65"/>
        <path d="m23 59 8-19 15-6 15 8 6 13 9 5-3 6-43 1Z" fill="#596963" stroke="#233e3d" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="m31 41 15-6 4 12-15 7-10 4Zm19 6 10-3 6 10-11 6Z" fill="#869086"/>
        <path d="m30 61 5-8 14-6m-4-10 5 10-5 10m11 3 10-5" fill="none" stroke="#415654" stroke-width="1.7" stroke-linejoin="round"/>
        <path d="M66 53q4-15 13-14-1 11-13 14Z" fill="#789071" stroke="#324f46" stroke-width="1.5"/>
        <path d="m66 54 10-12" fill="none" stroke="#9aa389" stroke-width="1.25"/>
      </symbol>
      <symbol id="${id}-sprig" viewBox="0 0 100 100">
        <g fill="#56736a" stroke="#244943" stroke-width="1.4">
          <path d="M51 53q-15 2-18-10 13-2 18 10Z"/><path d="M50 51q2-14 13-15 3 12-13 15Z"/>
        </g><path d="m39 47 12 7m-3 8 4-10 8-10" fill="none" stroke="#799083" stroke-width="1.4"/>
      </symbol>
      <symbol id="${id}-lock" viewBox="0 0 100 100">
        <g transform="translate(78 76)" fill="none" stroke="#c1af85" stroke-width="2.2" stroke-linejoin="round">
          <path d="M4 7V5a4 4 0 0 1 8 0v2"/><rect x="2" y="7" width="12" height="10" rx="2" fill="#344c46"/><path d="M8 11v2.3"/>
        </g>
      </symbol>
    </defs>`;
    return `<svg class="ln-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${defs}</svg>`;
  }

  const turnNumber = n => ((n % 4) + 4) % 4;
  const movable = tile => tile.type === "wire" && !tile.fixed && tile.base !== 0;
  const cameraKey = "lucas.lantern.board-view.v1";
  let rememberedView;

  function initialView() {
    if (!CSS.supports("transform-style","preserve-3d") || !CSS.supports("perspective","900px")) return "overhead";
    if (!rememberedView) {
      try { rememberedView = localStorage.getItem(cameraKey); } catch { /* The camera also works without storage. */ }
    }
    if (rememberedView === "overhead" || rememberedView === "diorama") return rememberedView;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "overhead" : "diorama";
  }

  function mount(container, level, onRotate) {
    const engine = window.LanternEngine;
    const id = "ln-board-" + (++boardNumber);
    const frame = document.createElement("div");
    frame.className = "ln-board";
    frame.setAttribute("role","group");
    frame.setAttribute("aria-label",`Lantern Night board, ${level.rows} rows and ${level.cols} columns. Use arrow keys to move. Press Enter or Space to turn a pipe.`);
    frame.innerHTML = devices(id) +
      '<i class="ln-wall ln-deck-front" aria-hidden="true"></i><i class="ln-wall ln-deck-right" aria-hidden="true"></i>' +
      '<div class="ln-board-screws" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
      '<div class="ln-grid"></div>';
    const stage = document.createElement("div");
    stage.className = "ln-table-stage";
    stage.append(frame);
    const controls = document.createElement("div");
    controls.className = "ln-camera";
    controls.setAttribute("role","group");
    controls.setAttribute("aria-label","Board view");
    const cube = '<path d="m3 7 7-4 7 4v8l-7 4-7-4zm0 0 7 4 7-4m-7 4v8"/>';
    const plan = '<rect x="3.5" y="3.5" width="13" height="13" rx="2"/><path d="M10 4v12M4 10h12"/>';
    const cameraButtons = ["diorama","overhead"].map(view => {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = '<svg viewBox="0 0 20 21" aria-hidden="true" focusable="false">' + (view === "diorama" ? cube : plan) + '</svg>';
      button.append(view === "diorama" ? "Diorama view" : "Overhead view");
      button.addEventListener("click",() => {
        rememberedView = view;
        try { localStorage.setItem(cameraKey,view); } catch { /* Keep the choice for this session. */ }
        setView(view);
      });
      controls.append(button);
      return {button,view};
    });
    function setView(next) {
      stage.dataset.view = next;
      for (const {button,view} of cameraButtons) button.setAttribute("aria-pressed",String(next === view));
    }
    setView(initialView());
    const grid = frame.querySelector(".ln-grid");
    grid.style.setProperty("--ln-cols",level.cols);
    grid.style.setProperty("--ln-rows",level.rows);
    const firstMove = level.tiles.findIndex(movable);
    let tabStop = Math.max(0, firstMove);
    let solved = false;
    const pictogram = name => `<use href="#${id}-${name}"/>`;
    const illustration = (cls,content) => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${content}</svg>`;
    const cells = level.tiles.map((tile, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ln-tile ln-" + tile.type;
      button.classList.toggle("ln-movable",movable(tile));
      button.tabIndex = i === tabStop ? 0 : -1;
      const art = pipes(tile);
      let object = "";
      if (tile.type === "source" || tile.type === "lamp" || tile.type === "rock") {
        object = pictogram(tile.type);
      } else if (tile.type === "empty" && (i + Math.floor(i / level.cols)) % 3 !== 1) {
        object = pictogram("sprig");
      }
      if (tile.type === "wire" && tile.fixed) object = pictogram("lock");
      button.innerHTML = '<i aria-hidden="true" class="ln-wall ln-block-front"></i><i aria-hidden="true" class="ln-wall ln-block-right"></i>' +
        (art ? illustration("ln-pipes",art) : "") + (object ? illustration("ln-object",object) : "");
      grid.append(button);
      return {button, rotor:button.querySelector(".ln-rotor"), previous:null, angle:0};
    });

    function tabTo(i, focus) {
      if (!Number.isInteger(i) || !cells[i]) return;
      cells[tabStop].button.tabIndex = -1;
      tabStop = i;
      cells[i].button.tabIndex = 0;
      if (focus) cells[i].button.focus({preventScroll:false});
    }
    cells.forEach(({button}, i) => {
      button.addEventListener("focus",() => tabTo(i,false));
      button.addEventListener("click",() => {
        if (!solved && movable(level.tiles[i])) onRotate(i);
      });
      button.addEventListener("keydown",event => {
        const col = i % level.cols;
        const row = Math.floor(i / level.cols);
        let next;
        switch (event.key) {
          case "ArrowUp": next = Math.max(0,row-1) * level.cols + col; break;
          case "ArrowDown": next = Math.min(level.rows-1,row+1) * level.cols + col; break;
          case "ArrowLeft": next = i - Number(col > 0); break;
          case "ArrowRight": next = i + Number(col < level.cols - 1); break;
          case "Home": next = event.ctrlKey ? 0 : row * level.cols; break;
          case "End": next = event.ctrlKey ? cells.length-1 : (row+1) * level.cols-1; break;
          default: return;
        }
        event.preventDefault();
        tabTo(next,true);
      });
    });

    function update(turns, trace, options = {}) {
      solved = options.solved ?? trace.won;
      frame.classList.toggle("ln-complete", Boolean(solved));
      cells.forEach((cell, i) => {
        const tile = level.tiles[i];
        const rotation = turnNumber(turns[i] ?? tile.initial ?? 0);
        const lit = tile.type === "lamp" ? trace.litLamps.has(i) : trace.litIndices.has(i);
        const hint = options.hintIndex === i;
        const changed = cell.previous !== null && cell.previous !== rotation;
        if (cell.rotor && cell.previous !== rotation) {
          const delta = cell.previous === null ? rotation : turnNumber(rotation - cell.previous);
          cell.angle += cell.previous !== null && delta === 3 ? -1 : delta;
          cell.rotor.style.transform = `rotate(${cell.angle * 90}deg)`;
        }
        cell.previous = rotation;
        cell.button.classList.toggle("ln-lit",lit);
        cell.button.classList.toggle("ln-hint",hint);
        cell.button.classList.toggle("ln-last",options.lastRotated === i);
        if (changed && options.lastRotated === i && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          cell.rotor?.closest("svg").animate?.([{filter:"brightness(1.22)"},{filter:"brightness(1)"}],{duration:260});
        }
        cell.button.setAttribute("aria-disabled",String(Boolean(solved) || !movable(tile)));
        const row = Math.floor(i / level.cols) + 1, col = i % level.cols + 1;
        const parts = [`Row ${row}, column ${col}`, names[tile.type]];
        if (tile.base) {
          const mask = engine.rotateMask(tile.base,rotation);
          parts.push("Connections " + ports.filter(p => p.bit & mask).map(p => p.name).join(" and "));
          parts.push(tile.type === "lamp" ? (lit ? "Lit" : "Unlit") : (lit ? "Powered" : "Unpowered"));
          parts.push(movable(tile) ? (solved ? "Complete" : "Can rotate") : "Fixed");
        }
        if (hint) parts.push("Hinted tile");
        cell.button.setAttribute("aria-label",parts.join(". "));
      });
    }
    const initial = level.tiles.map(tile => tile.initial ?? 0);
    update(initial,engine.trace(level,initial));
    container.replaceChildren(controls,stage);
    return {update, focusTile:i => tabTo(i,true)};
  }

  window.LanternBoard = Object.freeze({mount});
})();
