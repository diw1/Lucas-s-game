(() => {
  "use strict";

  // C. G. Hering, “Hopp, hopp, hopp, Pferdchen, lauf Galopp”.
  // Public-domain melody: https://www.kinder-wollen-singen.de/lieder/hopp-hopp-hopp/
  // Faber's Level 1 track 76 confirms the tune and C-major register.
  // Double the written note values to count the hoofbeats in quarter notes.
  const lowG = 55, lowB = 59, C = 60, D = 62, E = 64, F = 65, G = 67;
  const downTheTrail = [[G, 1], [F, 1], [E, 1], [D, 1]];
  const overTheStones = [
    [[D, 1], [D, 1], [lowB, 1], [lowG, 1]],
    [[G, 1], [G, 1], [E, 1], [C, 1]],
  ];

  window.DuelSongs.pony = {
    title: ["我的小马", "My Pony"],
    page: "50",
    bench: [
      "翻到第 50 页，找出开头的 C、E、G。先分开弹这三个音，再把课本里的 C 和弦一起按下。",
      "Open page 50 and find the opening C, E, G. Play the notes separately, then play the book’s C chord with all three keys together.",
    ],
    credit: [
      "C. G. 赫林的德国儿歌 · C 大调单音改编",
      "German children’s song by C. G. Hering · C major melody arrangement",
    ],
    beatsPerBar: 4,
    sections: [
      {
        title: ["小马出发", "Saddle up"],
        bars: [
          [[C, 2], [E, 2]], [[G, 4]],
          downTheTrail, [[C, 4]],
        ],
      },
      {
        title: ["跳过石头", "Over the stones"],
        bars: [...overTheStones, ...overTheStones],
      },
      {
        title: ["沿小路回家", "Down the trail"],
        bars: [
          [[C, 1], [D, 1], [E, 1], [F, 1]], [[G, 4]],
          downTheTrail, [[C, 4]],
        ],
      },
    ],
  };
})();
