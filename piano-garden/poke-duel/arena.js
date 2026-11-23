/* Pokémon sprites: PokeAPI/sprites, Black and White set. The field art is original. */
(() => {
  "use strict";
  const scriptUrl = document.currentScript?.src || document.baseURI;
  const artRoot = new URL("art/", scriptUrl);
  const images = new Map();
  const wild = new Set(["eevee", "psyduck", "gengar", "lapras", "jigglypuff", "mareep", "cubone", "poliwag"]);
  const elementOf = {
    pikachu: "electric",
    charmander: "fire",
    squirtle: "water",
    bulbasaur: "grass",
    eevee: "normal",
    psyduck: "water",
    gengar: "ghost",
    lapras: "water",
    jigglypuff: "normal",
    mareep: "electric",
    cubone: "ground",
    poliwag: "water",
  };
  const trailColors = {
    ghost: ["#684c91", "#c5a1eb"],
    fire: ["#dd654c", "#ffc45b"],
    water: ["#4c9db5", "#b9f3eb"],
    ground: ["#956940", "#e4c88a"],
  };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const duration = { hit: 580, "ally-hit": 580, super: 850, win: 1250 };
  let canvas,
    ctx,
    frame = 0,
    animation = null,
    battle = null;
  const round = Math.round;
  const clamp = (x) => Math.max(0, Math.min(1, x));

  function getImage(name) {
    if (images.has(name)) return images.get(name);
    const image = new Image();
    images.set(name, image);
    image.onload = paint;
    image.src = new URL(name + ".png", artRoot).href;
    return image;
  }
  function ready(image) {
    return image.complete && image.naturalWidth > 0;
  }
  function rect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(round(x), round(y), round(w), round(h));
  }
  function pixelLine(x1, y1, x2, y2, color, width) {
    const n = Math.ceil(Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)));
    for (let i = 0; i <= n; i++) {
      const t = n ? i / n : 0;
      rect(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, width, width, color);
    }
  }
  function shadow(x, y, w) {
    for (let row = 0; row < 8; row++) {
      const dx = Math.sqrt(1 - ((row - 3.5) / 4.1) ** 2) * w;
      rect(x - dx, y + row - 4, dx * 2, 1, "rgba(48,76,60,.25)");
    }
  }
  function sprite(image, x, feet, scale, flash) {
    if (!ready(image)) return;
    const w = round(image.width * scale),
      h = round(image.height * scale);
    if (flash) ctx.globalAlpha = 0.43;
    ctx.drawImage(image, round(x - w / 2), round(feet - h), w, h);
    ctx.globalAlpha = 1;
  }
  function sparkle(x, y, size, color) {
    rect(x - size, y - 1, size * 2 + 1, 3, color);
    rect(x - 1, y - size, 3, size * 2 + 1, color);
    if (size > 4) rect(x - 2, y - 2, 5, 5, "#fff9de");
  }
  function orb(x, y, r, edge, fill) {
    rect(x - r + 2, y - r, r * 2 - 4, r * 2, edge);
    rect(x - r, y - r + 2, r * 2, r * 2 - 4, edge);
    rect(x - r + 2, y - r + 2, r * 2 - 4, r * 2 - 4, fill);
    rect(x - r + 2, y - r + 2, 2, 2, "#fffbed");
  }
  function bolt(x1, y1, x2, y2, t) {
    const pts = [[x1, y1]];
    for (let i = 1; i <= 9; i++) {
      const f = i / 10;
      pts.push([
        x1 + (x2 - x1) * f,
        y1 + (y2 - y1) * f + (i % 2 === 0 ? -10 : 9) + 4 * Math.sin(i * 3 + Math.floor(t * 15)),
      ]);
    }
    pts.push([x2, y2]);
    for (let i = 1; i < pts.length; i++) {
      pixelLine(...pts[i - 1], ...pts[i], "#db8a32", 4);
      pixelLine(...pts[i - 1], ...pts[i], "#fff9aa", 2);
    }
  }
  function beam(element, x1, y1, x2, y2, fraction, powerful) {
    const t = clamp((fraction - 0.13) / 0.5);
    if (fraction < 0.13 || fraction > 0.71) return;
    const x = x1 + (x2 - x1) * t,
      y = y1 + (y2 - y1) * t;
    if (element === "electric") {
      const tail = Math.max(0, t - 0.43);
      bolt(x1 + (x2 - x1) * tail, y1 + (y2 - y1) * tail, x, y, fraction);
      sparkle(x, y, powerful ? 8 : 5, "#fff1a3");
    } else if (element === "grass") {
      for (let i = 0; i < 5; i++) {
        const u = Math.max(0, t - 0.05 * i);
        const xx = x1 + (x2 - x1) * u,
          yy = y1 + (y2 - y1) * u + Math.sin(u * 8 + i) * 9;
        pixelLine(xx - 6, yy + 4, xx + 5, yy - 3, "#34764d", 3);
        pixelLine(xx - 4, yy + 2, xx + 4, yy - 2, "#b6e478", 2);
      }
    } else if (Object.hasOwn(trailColors, element)) {
      for (let i = 4; i >= 0; i--) {
        const u = Math.max(0, t - i * 0.045);
        orb(
          x1 + (x2 - x1) * u,
          y1 + (y2 - y1) * u + Math.sin(u * 13 + i) * 4,
          3 + (4 - i) + (powerful ? 2 : 0),
          ...trailColors[element],
        );
      }
    } else {
      const direction = Math.sign(x2 - x1);
      for (let j = 0; j < 3; j++)
        pixelLine(
          x - direction * (8 + j * 3),
          y - 7 + j * 7,
          x + direction * 6,
          y - 10 + j * 7,
          "#fff4cb",
          2,
        );
    }
  }
  function impact(x, y, power, p) {
    if (p <= 0 || p >= 1) return;
    const r = (power ? 35 : 22) * p + 4;
    for (let j = 0; j < (power ? 12 : 8); j++) {
      const angle = j * 2.4;
      const dx = Math.cos(angle),
        dy = Math.sin(angle);
      pixelLine(
        x + dx * r,
        y + dy * r,
        x + dx * (r + 5),
        y + dy * (r + 5),
        j % 2 ? "#fffbe2" : "#ffd064",
        2,
      );
    }
  }
  function paint() {
    if (!battle || !ctx) return;
    const field = getImage("field-" + battle.zone);
    if (ready(field)) ctx.drawImage(field, 0, 0);
    else rect(0, 0, 560, 256, "#a9c78b");
    let t = 0,
      action = animation?.kind;
    if (animation) t = clamp((performance.now() - animation.time) / duration[action]);
    const fromAlly = action !== "ally-hit";
    const finale = action === "win";
    const powerful = finale || action === "super";
    // Leave the second half of the finale for the rival to faint.
    const strikeTime = finale ? clamp(t / 0.55) : t;
    const start = fromAlly ? [148, 173] : [391, 100],
      end = fromAlly ? [408, 107] : [129, 179];
    const lunge = action && !reducedMotion.matches ? Math.sin(Math.PI * clamp(strikeTime / 0.38)) * 9 : 0;
    const jolt = action && strikeTime > 0.56 && strikeTime < 0.87 && !reducedMotion.matches ? Math.sin(strikeTime * 72) * 4 : 0;
    const flash = action && strikeTime > 0.57 && strikeTime < 0.83 && Math.floor(strikeTime * 19) % 2 === 0;
    const foeImage = getImage(battle.foe),
      allyImage = getImage(battle.player + "-back");
    const faintProgress = finale ? clamp((t - 0.43) / 0.32) : Number(battle.fainted);
    const sink = reducedMotion.matches ? Number(faintProgress === 1) : faintProgress;
    if (sink < 1) {
      shadow(409, 144, 31 * (1 - sink));
      ctx.save();
      ctx.beginPath();
      ctx.rect(300, 0, 225, 144);
      ctx.clip();
      sprite(foeImage, 409 + (fromAlly ? jolt : -lunge), 144 + 150 * sink, 1.8, fromAlly && flash);
      ctx.restore();
    }
    shadow(129, 231, 49);
    sprite(allyImage, 129 + (fromAlly ? lunge : -jolt), 233, 2.65, !fromAlly && flash);
    if (action && !reducedMotion.matches) {
      beam(
        animation.element || elementOf[fromAlly ? battle.player : battle.foe],
        ...start,
        ...end,
        strikeTime,
        powerful,
      );
      impact(...end, powerful, (strikeTime - 0.57) / 0.33);
    }
    if (finale && t > 0.57) {
      for (let i = 0; i < 13; i++) {
        const x = 129 + Math.cos(i * 2.4) * (23 + i * 3);
        const y = 107 + ((i * 19) % 63) - (reducedMotion.matches ? 0 : t * 19);
        const size = 2 + 3 * Math.max(0, Math.sin(Math.PI * t));
        sparkle(x, y, size, i % 2 ? "#fff8cb" : "#f3bc5b");
      }
    } else if (action && reducedMotion.matches && strikeTime > 0.35 && strikeTime < 0.85) sparkle(...end, 6, "#fff5bd");
  }
  function tick(now) {
    frame = 0;
    if (!animation) return;
    if (now - animation.time >= duration[animation.kind] || document.hidden) {
      animation = null;
      paint();
      return;
    }
    paint();
    frame = requestAnimationFrame(tick);
  }
  function show({ player = "pikachu", foe = "eevee", zone = 0 } = {}) {
    const current = document.getElementById("arenaCanvas");
    if (!current) return;
    if (canvas !== current) {
      canvas = current;
      canvas.width = 560;
      canvas.height = 256;
      ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
    }
    const next = {
      player: Object.hasOwn(elementOf, player) ? player : "pikachu",
      foe: wild.has(foe) ? foe : "eevee",
      zone: Math.max(0, Math.min(2, Math.floor(Number(zone) || 0))),
      fainted: false,
    };
    cancelAnimationFrame(frame);
    frame = 0;
    animation = null;
    battle = next;
    paint();
  }
  function effect(kind, element) {
    if (!Object.hasOwn(duration, kind) || !battle || !ctx) return;
    if (kind === "win") battle.fainted = true;
    if (document.hidden) return;
    animation = { kind, element, time: performance.now() };
    if (!frame) frame = requestAnimationFrame(tick);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      animation = null;
    } else paint();
  });
  window.DuelArena = { show, effect };
})();
