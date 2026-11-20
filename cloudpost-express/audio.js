// [onset, duration, starting Hz, ending Hz, loudness, oscillator type]
const cues = {
  click: [[0, .07, 680, 460, .17, "sine"]],
  start: [
    [0, .14, 294, 330, .26, "triangle"],
    [.10, .14, 370, 392, .24, "triangle"],
    [.21, .25, 494, 587, .24, "sine"]
  ],
  ring: [
    [0, .23, 880, 880, .25, "sine"],
    [.045, .22, 1319, 1319, .14, "sine"]
  ],
  miss: [
    [0, .17, 330, 208, .24, "triangle"],
    [.085, .18, 220, 164, .17, "sine"]
  ],
  deliver: [
    [0, .075, 170, 83, .32, "triangle"],
    [.06, .20, 523, 523, .20, "sine"],
    [.16, .30, 784, 784, .23, "triangle"]
  ],
  finish: [
    [0, .14, 392, 392, .25, "triangle"],
    [.11, .14, 494, 494, .23, "triangle"],
    [.23, .16, 587, 587, .24, "triangle"],
    [.37, .43, 784, 784, .24, "sine"],
    [.37, .42, 494, 494, .12, "sine"],
    [.37, .43, 392, 392, .10, "sine"]
  ]
};

export function createAudio() {
  let enabled = false;
  let destroyed = false;
  let generation = 0;
  let context, master;
  const active = new Set();

  function silence() {
    generation++;
    for (const oscillator of active) {
      try { oscillator.stop(); } catch { /* It may already have ended. */ }
    }
  }

  function setEnabled(value) {
    if (destroyed || enabled === Boolean(value)) return;
    enabled = Boolean(value);
    if (!enabled) silence();
    if (context && master) master.gain.setTargetAtTime(enabled ? .21 : 0, context.currentTime, .008);
  }

  function schedule(cue) {
    const start = context.currentTime + .005;
    for (const [offset, duration, from, to, loudness, type] of cue) {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      const t = start + offset;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(from, t);
      if (to !== from) oscillator.frequency.exponentialRampToValueAtTime(to, t + duration);
      envelope.gain.setValueAtTime(.0001, t);
      envelope.gain.exponentialRampToValueAtTime(loudness, t + .012);
      envelope.gain.exponentialRampToValueAtTime(.0001, t + duration);
      oscillator.connect(envelope).connect(master);
      oscillator.onended = () => {
        active.delete(oscillator);
        oscillator.disconnect();
        envelope.disconnect();
      };
      active.add(oscillator);
      oscillator.start(t);
      oscillator.stop(t + duration + .02);
    }
  }

  function play(type) {
    const cue = Object.hasOwn(cues, type) && cues[type];
    if (destroyed || !enabled || !cue) return;
    const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Audio) return;
    try {
      if (!context) {
        context = new Audio();
        master = context.createGain();
        master.gain.value = .21;
        master.connect(context.destination);
      }
      if (context.state === "running") {
        schedule(cue);
      } else {
        const currentGeneration = generation;
        const deadline = performance.now() + 350;
        // A blocked autoplay request can resolve on a later tap. Never replay old ring sounds.
        context.resume().then(() => {
          if (enabled && !destroyed && currentGeneration === generation && performance.now() < deadline) {
            schedule(cue);
          }
        }).catch(() => {});
      }
    } catch { /* Continue the flight when audio is unavailable. */ }
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    enabled = false;
    silence();
    master?.disconnect();
    if (context && context.state !== "closed") context.close().catch(() => {});
  }
  return {setEnabled, play, destroy};
}
