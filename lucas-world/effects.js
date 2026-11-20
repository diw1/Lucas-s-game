(() => {
  'use strict';

  const marks = {
    cat: '🐾', paw: '🐾', heart: '♥', bee: '🐝', apple: '🍎',
    fruit: '🍊', grape: '🍇', cake: '🍓', berry: '🍓',
    flower: '🌸', petal: '❀', sparkle: '✧', dash: '•'
  };
  const colors = {
    heart: '#ce4d44', petal: '#ed88a1', flower: '#df6f8a',
    sparkle: '#ffe481', dash: '#6e512a'
  };
  let context;

  function audioContext() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      if (!context || context.state === 'closed') context = new Audio();
      if (context.state === 'suspended' && context.resume) context.resume().catch(() => {});
      return context;
    } catch {
      return undefined;
    }
  }

  function note(ctx, start, duration, from, to = from, volume = 0.05, type = 'sine', wobble = 0) {
    const voice = ctx.createOscillator();
    const gain = ctx.createGain();
    voice.type = type;
    voice.frequency.setValueAtTime(from, start);
    voice.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.035, duration / 4));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    voice.connect(gain);
    gain.connect(ctx.destination);
    let pulse;
    let depth;
    if (wobble) {
      pulse = ctx.createOscillator();
      depth = ctx.createGain();
      pulse.frequency.value = wobble;
      depth.gain.value = from * 0.045;
      pulse.connect(depth);
      depth.connect(voice.frequency);
      pulse.start(start);
      pulse.stop(start + duration);
    }
    voice.onended = () => {
      voice.disconnect();
      gain.disconnect();
      pulse?.disconnect();
      depth?.disconnect();
    };
    voice.start(start);
    voice.stop(start + duration + 0.015);
  }

  function sound(id) {
    const ctx = audioContext();
    if (!ctx) return;
    const start = ctx.currentTime + 0.015;
    if (id === 'cat') {
      note(ctx, start, 0.55, 99, 72, 0.075, 'triangle', 24);
      note(ctx, start + 0.15, 0.27, 355, 278, 0.035, 'sine');
    } else if (id === 'bee') {
      note(ctx, start, 0.31, 168, 231, 0.035, 'triangle', 8);
      note(ctx, start + 0.27, 0.31, 230, 154, 0.027, 'triangle', 9);
    } else if (id === 'apple') {
      note(ctx, start, 0.14, 572, 305, 0.04);
      note(ctx, start + 0.18, 0.19, 160, 71, 0.08, 'triangle');
    } else {
      const notes = {
        fruit: [392, 494, 587], cake: [784, 988, 1175],
        flower: [523, 659, 784], chime: [523, 659, 784, 1047]
      }[id];
      notes?.forEach((pitch, index) => {
        note(ctx, start + index * 0.10, 0.29, pitch, pitch, 0.044);
      });
    }
  }

  function particle(layer, x, y, mark, size, points, duration, delay = 0) {
    const elem = document.createElement('span');
    elem.setAttribute('aria-hidden', 'true');
    const stamp = window.PicnicStamps?.[mark];
    if (['bee', 'apple', 'flower'].includes(mark) && typeof stamp === 'string' && stamp.includes('<svg')) {
      elem.innerHTML = stamp;
      const svg = elem.querySelector('svg');
      if (svg) Object.assign(svg.style, { width: '100%', height: '100%', display: 'block' });
    } else {
      elem.textContent = marks[mark];
    }
    Object.assign(elem.style, {
      position: 'absolute', left: x + '%', top: y + '%', width: size + 'px',
      height: size + 'px', display: 'grid', placeItems: 'center', fontSize: size + 'px',
      lineHeight: '1', color: colors[mark] || '#70523d', fontFamily: 'system-ui, sans-serif',
      pointerEvents: 'none', userSelect: 'none', zIndex: '8', opacity: '0',
      transformOrigin: 'center', filter: 'drop-shadow(0 1px 1px #fff9)',
      transform: 'translate(-50%,-50%)'
    });
    layer.append(elem);
    if (!elem.animate) {
      elem.style.opacity = '1';
      window.setTimeout(() => elem.remove(), 450);
      return;
    }
    const frames = points.map(([offset, dx, dy, rotate, scale, opacity]) => ({
      offset, opacity,
      transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy +
        'px)) rotate(' + rotate + 'deg) scale(' + scale + ')'
    }));
    const animation = elem.animate(frames, { duration, delay, easing: 'ease-in-out', fill: 'both' });
    animation.onfinish = animation.oncancel = () => elem.remove();
  }

  function rise(draw, mark, size, dx, dy, delay = 0) {
    draw(mark, size, [
      [0, 0, 0, -12, 0.4, 0], [0.2, dx * 0.25, dy * 0.25, 6, 1.15, 1],
      [0.68, dx * 0.75, dy * 0.76, -5, 1, 1], [1, dx, dy, 8, 0.75, 0]
    ], 880, delay);
  }

  function play(id, layer, x, y, soundEnabled) {
    if (!(id in marks)) return;
    if (soundEnabled) sound(id);
    if (!layer || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const draw = (mark, size, points, duration, delay) =>
      particle(layer, x, y, mark, size, points, duration, delay);
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      draw(id, 26, [[0, 0, -16, 0, 1, 1], [1, 0, -16, 0, 1, 0]], 500);
      return;
    }
    switch (id) {
      case 'cat':
        rise(draw, 'paw', 21, -26, -53);
        rise(draw, 'heart', 21, 15, -59, 80);
        rise(draw, 'heart', 14, 32, -43, 185);
        break;
      case 'bee': {
        const dir = x > 70 ? -1 : 1;
        draw('bee', 32, [[0, 0, 0, 0, 0.7, 0], [0.15, dir * 12, -11, -10, 1.05, 1],
          [0.44, dir * 38, -34, 13, 1, 1], [0.66, dir * 56, -16, 25, 0.95, 1],
          [1, dir * 90, -48, -18, 0.7, 0]], 1150);
        [13, 23, 31].forEach((distance, i) =>
          draw('dash', 8, [[0, dir * distance, -distance * 0.9, 0, 1, 0],
            [0.2, dir * distance, -distance * 0.9, 0, 1, 1],
            [1, dir * distance, -distance * 0.9, 0, 0.5, 0]], 460, 120 + i * 70));
        break;
      }
      case 'apple':
        draw('apple', 32, [[0, 0, -5, -8, 0.8, 0], [0.16, 1, -9, 8, 1, 1],
          [0.63, 8, 43, 26, 1, 1], [0.78, 12, 28, 33, 1, 1],
          [1, 18, 46, 44, 0.8, 0]], 850);
        break;
      case 'fruit':
        ['apple', 'fruit', 'grape'].forEach((mark, i) => {
          const dx = (i - 1) * 32;
          draw(mark, 23, [[0, 0, 0, 0, 0.5, 0], [0.16, dx * 0.2, -17, -10, 1, 1],
            [0.49, dx * 0.7, -44 + i * 3, 7, 1.1, 1], [1, dx, 4, 22, 0.75, 0]], 790, i * 65);
        });
        break;
      case 'cake':
        rise(draw, 'berry', 26, 1, -53);
        rise(draw, 'sparkle', 24, -25, -36, 85);
        rise(draw, 'sparkle', 20, 29, -43, 140);
        break;
      case 'flower':
        [-30, -12, 15, 31].forEach((dx, i) => {
          draw('petal', 14 + i % 2 * 5, [[0, 0, 0, 0, 0.5, 0], [0.2, dx * 0.5, -19, -20, 1, 1],
            [0.52, dx, -12, 30, 1, 1], [1, dx * 1.25, 23, 85, 0.85, 0]], 1020, i * 55);
        });
        break;
    }
  }

  window.PicnicFX = Object.freeze({ play, chime: enabled => { if (enabled) sound('chime'); } });
})();
