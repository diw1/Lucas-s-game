(() => {
  'use strict';

  // Light positions are percentages of the uncropped painting, measured from its top left.
  window.LanternScenes = Object.freeze({
    canopy: {
      name: 'Front Porch', chapter: 'A Window for Koala',
      story: 'It’s getting dark by the treehouse. Light the round attic window so Koala can find the front porch.',
      reply: '“There you are!” calls Koala. “I can see your window from down here.”',
      ratio: 788 / 788, lights: [[77, 16], [64, 44], [83, 42]],
      color: '#efba62', position: '56% 35%'
    },
    hollow: {
      name: 'Treehouse Loft', chapter: 'One Last Page',
      story: 'Someone left a book downstairs. Send a reading light up past the little table to the blue bed.',
      reply: 'Squirrel pulls up the blue quilt. “Just one more page?”',
      ratio: 850 / 850, lights: [[61, 19], [60, 40], [52, 57]],
      color: '#f3b75d', position: '55% 39%'
    },
    picnic: {
      name: 'Orchard Picnic', chapter: 'Supper Under Stars',
      story: 'Kitten has saved you a place on the checked blanket. Light the hanging apple and the teacup for a late picnic.',
      reply: '“I saved the last slice for you,” says Kitten, patting the blanket.',
      ratio: 755 / 950, lights: [[30, 29], [64, 55], [65, 20]],
      color: '#ffb966', position: '48% 45%'
    },
    bakery: {
      name: 'Bunny Bakery', chapter: 'The Last Batch',
      story: 'The last tray of rolls is ready. Light the welcome sign and the counter so Bunny can see who’s come for supper.',
      reply: 'Bunny wraps a warm roll in paper. “Careful, it’s fresh from the oven!”',
      ratio: 850 / 850, lights: [[46, 26], [72, 68], [76, 17]],
      color: '#f8c783', position: '51% 47%'
    },
    stage: {
      name: 'Starlight Stage', chapter: 'Raise the Lights',
      story: 'The singer is ready. Wake the lights above the stage and the mushroom lamp beside it.',
      reply: 'The little singer takes a breath. “This next song is for you!”',
      ratio: 850 / 680, lights: [[32, 6], [74, 7], [94, 41]],
      color: '#efa9c3', position: '54% 48%'
    },
    cat: {
      name: 'Kitten Garden', chapter: 'Starlight in Her Eyes',
      story: 'A silver kitten watches the garden path. Put a tiny star in each blue eye.',
      reply: 'The kitten blinks twice, then rests a soft paw on your hand.',
      ratio: 686 / 686, lights: [[33, 39], [62, 38], [35, 28]],
      color: '#91d8e4', position: '49% 39%'
    },
    castle: {
      name: 'Pumpkin Castle', chapter: 'Knock After Dark',
      story: 'A little ghost is listening at the castle gate. Light the tower windows and the grinning pumpkin to let it know you’re here.',
      reply: 'Two knocks come from behind the door. “You remembered our secret signal!”',
      ratio: 850 / 685, lights: [[35, 34], [57, 61], [91, 19]],
      color: '#f6ad63', position: '48% 47%'
    },
    parade: {
      name: 'Ribbon Parade', chapter: 'Trophies on Parade',
      story: 'The pink parade float is almost ready to roll. Make the gold cup, the medal and the tall trophy sparkle.',
      reply: '“Look at that shine!” cheers the little champion under the flags.',
      ratio: 684 / 504, lights: [[23, 28], [40, 40], [76, 21]],
      color: '#f8c652', position: '50% 43%'
    },
    reef: {
      name: 'Coral Cove', chapter: 'Lights Below the Tide',
      story: 'Evening has reached the cove. Send a spark past Whale and Turtle, all the way down to Crab’s sandy doorstep.',
      reply: 'Crab waves both claws. “You brought the stars all the way down here!”',
      ratio: 674 / 472, lights: [[29, 13], [47, 11], [67, 71]],
      color: '#74decf', position: '50% 51%'
    }
  });

  // Each cue is a small set of plucked notes: delay, pitch in hertz, ringing time.
  const cues = {
    turn:   [[0, 392, .09]],
    newlamp:[[0, 659.25, .22], [.08, 987.77, .30]],
    win:    [[0, 523.25, .33], [.09, 659.25, .34], [.18, 783.99, .38], [.34, 1046.5, .55]],
    undo:   [[0, 440, .11], [.065, 329.63, .15]],
    hint:   [[0, 587.33, .19], [.14, 880, .25]],
    open:   [[0, 392, .20], [.11, 523.25, .28]]
  };
  const cooldown = {turn: 105, newlamp: 200, win: 750, undo: 150, hint: 290, open: 360};
  let enabled = false, gestured = false, context, volume;
  let lastCue = -Infinity, quietUntil = -Infinity;
  const lastPlayed = new Map();

  const registerGesture = event => { if (event.isTrusted) gestured = true; };
  window.addEventListener('pointerdown', registerGesture, {capture:true, passive:true});
  window.addEventListener('keydown', registerGesture, {capture:true, passive:true});

  function audio() {
    if (!enabled || !(gestured || window.navigator?.userActivation?.hasBeenActive)) return;
    try {
      if (!context || context.state === 'closed') {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        context = new Audio();
        volume = context.createGain();
        volume.gain.value = 0.44;
        volume.connect(context.destination);
      }
      if (context.state === 'suspended') context.resume().catch(() => {});
      return context;
    } catch {
      return undefined;
    }
  }

  function enable(value) {
    enabled = Boolean(value);
    if (enabled) audio();
    if (context && context.state !== 'closed') {
      volume.gain.setTargetAtTime(enabled ? 0.44 : 0, context.currentTime, 0.012);
    }
  }

  function play(cue) {
    if (!enabled || !Object.hasOwn(cues, cue)) return;
    const now = performance.now();
    if (now - (lastPlayed.get(cue) ?? -Infinity) < cooldown[cue] || now < quietUntil) return;
    if (cue === 'turn' && now - lastCue < 105) return;
    const ctx = audio();
    if (!ctx) return;
    lastCue = now;
    lastPlayed.set(cue, now);
    if (cue === 'win') quietUntil = now + 650;

    for (const [delay, pitch, length] of cues[cue]) {
      const at = ctx.currentTime + 0.008 + delay;
      const voice = ctx.createOscillator();
      const envelope = ctx.createGain();
      voice.type = cue === 'turn' || cue === 'undo' ? 'triangle' : 'sine';
      voice.frequency.value = pitch;
      envelope.gain.setValueAtTime(.0001, at);
      envelope.gain.exponentialRampToValueAtTime(cue === 'turn' ? .055 : .13, at + .009);
      envelope.gain.exponentialRampToValueAtTime(.0001, at + length);
      voice.connect(envelope);
      envelope.connect(volume);
      voice.onended = () => { voice.disconnect(); envelope.disconnect(); };
      voice.start(at);
      voice.stop(at + length + .012);
    }
  }

  window.LanternSound = Object.freeze({enable, play});
})();
