(() => {
  "use strict";

  // Each event is [MIDI pitch, quarter-note beats, optional written pitch].
  const C = 60, D = 62, E = 64, F = 65, G = 67;
  const Eb = 63, Fs = 66, Ab = 68;

  // Traditional melody, checked against the public-domain C-major edition at
  // https://www.kinder-wollen-singen.de/lieder/haenschen-klein/
  // The game uses quarter notes for the pulse and sustains each tonic cadence.
  const rowingCall = [
    [[G, 1], [E, 1], [E, 2]],
    [[F, 1], [D, 1], [D, 2]],
  ];
  const homeward = [
    ...rowingCall,
    [[C, 1], [E, 1], [G, 1], [G, 1]],
    [[C, 4]],
  ];

  window.DuelSongs = {
    oars: {
      title: ["轻轻划船", "Lightly Row"],
      credit: ["传统民歌 · C 大调单旋律版", "Traditional folk tune · C major melody"],
      beatsPerBar: 4,
      sections: [
        {
          title: ["出发", "Cast off"],
          bars: [
            ...rowingCall,
            [[C, 1], [D, 1], [E, 1], [F, 1]],
            [[G, 1], [G, 1], [G, 2]],
          ],
        },
        { title: ["顺流", "Downstream"], bars: homeward },
        {
          title: ["浪花", "Over the waves"],
          bars: [
            [[D, 1], [D, 1], [D, 1], [D, 1]],
            [[D, 1], [E, 1], [F, 2]],
            [[E, 1], [E, 1], [E, 1], [E, 1]],
            [[E, 1], [F, 1], [G, 2]],
          ],
        },
        { title: ["靠岸", "Back to shore"], bars: homeward },
      ],
    },
    drums: {
      title: ["可达鸭的雨靴", "Psyduck’s Rain Boots"],
      credit: ["原创曲 · 休止时数两拍或四拍", "Original tune · half and whole rests"],
      beatsPerBar: 4,
      sections: [
        {
          title: ["踩水花", "Splish, splash"],
          bars: [
            [[C, 1], [C, 1], [E, 2]],
            [[G, 2], [null, 2]],
            [[F, 1], [F, 1], [D, 2]],
            [[G, 2], [D, 2]],
          ],
        },
        {
          title: ["躲雨", "Under cover"],
          bars: [
            [[C, 1], [C, 1], [E, 2]],
            [[G, 1], [F, 1], [E, 1], [D, 1]],
            [[C, 2], [C, 2]],
            [[null, 4]],
          ],
        },
        {
          title: ["听雨点", "Raindrops answer"],
          bars: [
            [[G, 1], [E, 1], [null, 2]],
            [[F, 1], [D, 1], [null, 2]],
            [[E, 1], [G, 1], [E, 1], [C, 1]],
            [[D, 2], [G, 2]],
          ],
        },
        {
          title: ["跳回家", "Hop back home"],
          bars: [
            [[C, 1], [C, 1], [E, 2]],
            [[G, 2], [null, 2]],
            [[F, 1], [E, 1], [D, 2]],
            [[C, 4]],
          ],
        },
      ],
    },
    spell: {
      title: ["耿鬼的捉迷藏", "Gengar Plays Hide-and-Seek"],
      credit: ["原创曲 · 升 F、降 E 和降 A", "Original tune · F sharp, E flat and A flat"],
      beatsPerBar: 4,
      sections: [
        {
          title: ["踮脚走", "On tiptoe"],
          bars: [
            [[C, 2], [Eb, 1, "E♭4"], [D, 1]],
            [[C, 2], [G, 2]],
            [[F, 1], [Fs, 1, "F♯4"], [G, 2]],
            [[Eb, 2, "E♭4"], [D, 2]],
          ],
        },
        {
          title: ["墙上的影子", "On the wall"],
          bars: [
            [[C, 2], [Eb, 1, "E♭4"], [D, 1]],
            [[C, 1], [D, 1], [Eb, 2, "E♭4"]],
            [[F, 1], [Fs, 1, "F♯4"], [G, 2]],
            [[C, 4]],
          ],
        },
        {
          title: ["谁在身后", "Behind you"],
          bars: [
            [[G, 2], [Ab, 1, "A♭4"], [G, 1]],
            [[F, 2], [Eb, 2, "E♭4"]],
            [[Eb, 1, "E♭4"], [F, 1], [G, 1], [Ab, 1, "A♭4"]],
            [[G, 4]],
          ],
        },
        {
          title: ["找到你了", "Found you"],
          bars: [
            [[C, 2], [Eb, 1, "E♭4"], [D, 1]],
            [[F, 1], [Fs, 1, "F♯4"], [G, 2]],
            [[G, 1], [F, 1], [Eb, 1, "E♭4"], [D, 1]],
            [[C, 4]],
          ],
        },
      ],
    },
  };
})();
