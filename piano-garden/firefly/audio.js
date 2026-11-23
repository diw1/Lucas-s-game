(() => {
  "use strict";

  let context;
  let mic;
  let ignoreSpeakerUntil = 0;
  const heldVoices = new Set();
  const speakerTailMs = 225;

  function audioContext() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error("Audio is unavailable in this browser.");
    if (!context || context.state === "closed") context = new Audio();
    return context;
  }

  async function unlock() {
    try {
      const ctx = audioContext();
      if (ctx.state !== "running") await ctx.resume();
      return ctx.state === "running";
    } catch {
      return false;
    }
  }

  function pianoVoice(midi, duration, held) {
    if (!Number.isInteger(midi) || midi < 0 || midi > 127) return;
    let ctx;
    try { ctx = audioContext(); } catch { return; }
    if (ctx.state !== "running") void unlock();
    const start = ctx.currentTime;
    const hz = 440 * 2 ** ((midi - 69) / 12);
    // The analyser hears the room, including the device's own speaker.
    const partials = [];
    if (held) heldVoices.add(partials);
    else ignoreSpeakerUntil = Math.max(ignoreSpeakerUntil, performance.now() + duration * 1000 + speakerTailMs);
    // A quick hammer attack and faster decay of the upper partials keep the
    // notes clear on small speakers, even when several notes overlap.
    for (const [ratio, level, decay] of [[1, 0.20, 1], [2, 0.09, 0.72], [3.002, 0.045, 0.55], [4.006, 0.018, 0.4]]) {
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      const end = start + duration * decay;
      const attack = start + 0.008;
      const knee = start + Math.min(held ? 0.26 : 0.55, duration * decay * 0.42);
      oscillator.frequency.value = hz * ratio;
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(level, attack);
      envelope.gain.exponentialRampToValueAtTime(level * 0.36, knee);
      envelope.gain.exponentialRampToValueAtTime(0.0001, end);
      oscillator.connect(envelope);
      envelope.connect(ctx.destination);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
        if (ratio === 1 && heldVoices.delete(partials)) {
          ignoreSpeakerUntil = Math.max(ignoreSpeakerUntil, performance.now() + speakerTailMs);
        }
      };
      if (held) partials.push({ oscillator, gain: envelope.gain, attack, knee, level, end });
      oscillator.start(start);
      oscillator.stop(end + 0.005);
    }
    if (!held) return;
    return function release() {
      if (!heldVoices.delete(partials)) return;
      const now = ctx.currentTime;
      const releaseTime = 0.07;
      for (const { oscillator, gain, attack, knee, level, end } of partials) {
        const when = Math.max(now, attack);
        if (when >= end) continue;
        // Rebuild the envelope value at release, including in browsers that
        // lack cancelAndHoldAtTime. Keep a short strike on very quick taps.
        const onFirstSlope = when < knee;
        const from = onFirstSlope ? level : level * 0.36;
        const to = onFirstSlope ? level * 0.36 : 0.0001;
        const fraction = onFirstSlope ? (when - attack) / (knee - attack) : (when - knee) / (end - knee);
        const value = from * (to / from) ** fraction;
        gain.cancelScheduledValues(when);
        gain.exponentialRampToValueAtTime(value, when);
        gain.exponentialRampToValueAtTime(0.0001, when + releaseTime);
        oscillator.stop(when + releaseTime + 0.005);
      }
      ignoreSpeakerUntil = Math.max(ignoreSpeakerUntil, performance.now() + releaseTime * 1000 + speakerTailMs);
    };
  }

  function tone(midi, seconds = 0.5) {
    pianoVoice(midi, Math.max(0.09, Math.min(4, Number(seconds) || 0.5)), false);
  }

  function press(midi) {
    return pianoVoice(midi, 4, true) || (() => {});
  }

  // Normalised difference (YIN). Sampling at about 12 kHz keeps the work
  // small while retaining the pitch range needed for the two staves.
  function makePitchReader(sampleRate, frameSize) {
    const stride = Math.max(1, Math.round(sampleRate / 12000));
    const rate = sampleRate / stride;
    const samples = new Float32Array(Math.floor(frameSize / stride));
    const minLag = Math.max(2, Math.floor(rate / 1700));
    const maxLag = Math.min(Math.floor(samples.length / 2) - 1, Math.ceil(rate / 69));
    const windowSize = samples.length - maxLag;
    const difference = new Float32Array(maxLag + 1);
    return function read(samplesIn) {
      for (let i = 0; i < samples.length; i++) {
        let sum = 0;
        for (let j = 0; j < stride; j++) sum += samplesIn[i * stride + j];
        samples[i] = sum / stride;
      }
      let totalDifference = 0;
      for (let lag = 1; lag <= maxLag; lag++) {
        let sum = 0;
        for (let i = 0; i < windowSize; i++) {
          const delta = samples[i] - samples[i + lag];
          sum += delta * delta;
        }
        totalDifference += sum;
        difference[lag] = totalDifference > 0 ? sum * lag / totalDifference : 1;
        const middle = lag - 1;
        if (middle < minLag || difference[middle] > 0.14 || difference[lag] <= difference[middle]) continue;
        const left = difference[middle - 1];
        const right = difference[lag];
        const curvature = left - 2 * difference[middle] + right;
        const period = middle + (curvature ? (left - right) / (2 * curvature) : 0);
        const pitch = 69 + 12 * Math.log2(rate / period / 440);
        const midi = Math.round(pitch);
        return midi >= 38 && midi <= 88 && Math.abs(pitch - midi) <= 0.42 ? midi : null;
      }
      return null;
    };
  }

  function makeNoteGate() {
    let active = null;
    let candidate = null;
    let candidateSince = 0;
    let quietSince = null;
    let lastAttack = -Infinity;
    let renewedAt = null;
    return function update(note, level, recentFloor, now) {
      if (level < 0.0035) {
        if (quietSince === null) quietSince = now;
        if (now - quietSince >= 45) {
          active = null;
          renewedAt = null;
        }
      } else {
        quietSince = null;
      }
      // A fresh hammer attack can rise from the previous note's ringing tail.
      // Wait for the pitch window to catch up before calling it a repeated note.
      if (renewedAt !== null && now - renewedAt > 90) renewedAt = null;
      if (active !== null && renewedAt === null && now - lastAttack >= 68 &&
          level > Math.max(0.005, recentFloor * 1.36, recentFloor + 0.0025)) {
        renewedAt = now;
      }
      if (note !== candidate || note === null) {
        candidate = note;
        candidateSince = now;
      }
      if (level < 0.004 || note === null || now - candidateSince < 14) return null;
      if (note === active && (renewedAt === null || now - renewedAt < 32)) return null;
      active = note;
      lastAttack = now;
      renewedAt = null;
      return note;
    };
  }

  function finish(session, status, detail) {
    if (mic !== session) return;
    mic = undefined;
    clearTimeout(session.timer);
    if (session.source) session.source.disconnect();
    if (session.analyser) session.analyser.disconnect();
    if (session.stream) {
      for (const track of session.stream.getTracks()) {
        track.onended = null;
        track.stop();
      }
    }
    session.onState(status, detail);
  }

  function stopListening() {
    if (mic) finish(mic, "off");
  }

  function errorMessage(error) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return "Microphone access is off. Allow it in your browser, or use the screen keys.";
    }
    if (error.name === "NotFoundError") return "No microphone found. Try the screen keys.";
    if (error.name === "NotReadableError") return "The microphone is busy. Close the other app and try again.";
    return "The microphone couldn't start. Try again, or use the screen keys.";
  }

  async function listen({ onNote = () => {}, onState = () => {} } = {}) {
    stopListening();
    const session = { onState, timer: 0 };
    mic = session;
    onState("requesting");
    if (!navigator.mediaDevices?.getUserMedia) {
      finish(session, "error", "Microphone access needs a supported browser on HTTPS or localhost. You can use the screen keys here.");
      return false;
    }
    try {
      const ctx = audioContext();
      // Resume inside the gesture that opened the mic, before permission UI.
      const ready = unlock();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      });
      if (mic !== session) {
        for (const track of stream.getTracks()) track.stop();
        return false;
      }
      session.stream = stream;
      for (const track of stream.getAudioTracks()) {
        track.onended = () => finish(session, "error", "The microphone disconnected. Reconnect it and try again.");
      }
      if (!await ready) throw new Error("Audio unavailable");
      if (mic !== session) return false;
      session.source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      session.analyser = analyser;
      analyser.fftSize = ctx.sampleRate > 64000 ? 4096 : 2048;
      session.source.connect(analyser);
      const buffer = new Float32Array(analyser.fftSize);
      const readPitch = makePitchReader(ctx.sampleRate, buffer.length);
      const span = Math.min(Math.round(ctx.sampleRate * 0.012), Math.floor(buffer.length / 3));
      function rmsAt(end) {
        let sum = 0;
        for (let i = end - span; i < end; i++) sum += buffer[i] * buffer[i];
        return Math.sqrt(sum / span);
      }
      let gate = makeNoteGate();
      let wasMuted = false;
      function sample() {
        if (mic !== session) return;
        // Capture successive strikes even on a display rendering at 30 fps.
        session.timer = setTimeout(sample, 12);
        const now = performance.now();
        if (now < ignoreSpeakerUntil || heldVoices.size > 0) {
          wasMuted = true;
          return;
        }
        if (wasMuted) {
          gate = makeNoteGate();
          wasMuted = false;
        }
        analyser.getFloatTimeDomainData(buffer);
        const end = buffer.length;
        const level = rmsAt(end);
        const recentFloor = Math.min(rmsAt(end - span), rmsAt(end - Math.round(span * 1.5)), rmsAt(end - 2 * span));
        const note = gate(level >= 0.004 ? readPitch(buffer) : null, level, recentFloor, now);
        if (note !== null) onNote(note);
      }
      sample();
      onState("listening");
      return true;
    } catch (error) {
      if (mic === session) finish(session, "error", errorMessage(error));
      return false;
    }
  }

  window.addEventListener("pagehide", stopListening);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopListening();
  });
  window.FireflyAudio = { unlock, tone, press, listen, stopListening };
})();
