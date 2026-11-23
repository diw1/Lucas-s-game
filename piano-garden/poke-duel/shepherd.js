(() => {
  "use strict";

  // Beethoven, Symphony No. 6, Op. 68, V, violin I, bars 9–16.
  // https://s9.imslp.org/files/imglnks/usimg/c/c8/IMSLP878037-PMLP1595-Symphony_No.6_Op.68_Ludwig_van_Beethoven.pdf#page=125
  // Each three-eighth group becomes one 3/4 bar. Long tied pitches are
  // rearticulated at a bar line, and the last tonic is held for the cadence.
  // The published Level 1 slow demonstration (track 84) puts the theme in C.
  const lowG = 55, lowA = 57, lowB = 59, C = 60, D = 62, E = 64, F = 65, G = 67;
  window.DuelSongs.shepherd = {
    title: ["牧羊人之歌", "Shepherd’s Song"],
    page: "54–55",
    bench: [
      "翻到第 54–55 页，先哼出开头的 E、C、G，再照书上的指法把左手伴奏加进来。",
      "Open pages 54–55. Sing the opening E, C, G, then add the left-hand accompaniment with the book’s fingering.",
    ],
    credit: [
      "贝多芬《田园交响曲》· C 大调单音改编",
      "Beethoven’s Pastoral Symphony · C major melody arrangement",
    ],
    beatsPerBar: 3,
    sections: [
      {
        title: ["牧歌响起", "The shepherd sings"],
        bars: [
          [[E, 3]], [[C, 2], [G, 1]],
          [[E, 3]], [[C, 2], [lowG, 1]],
        ],
      },
      {
        title: ["越过山坡", "Across the hill"],
        bars: [
          [[C, 2], [E, 1]], [[G, 2], [E, 1]],
          [[F, 3]], [[F, 2], [D, 1]],
        ],
      },
      {
        title: ["山谷回声", "The valley answers"],
        bars: [
          [[F, 3]], [[D, 2], [G, 1]],
          [[E, 3]], [[C, 2], [E, 1]],
        ],
      },
      {
        title: ["羊群归家", "Home to the fold"],
        bars: [
          [[D, 2], [lowA, 1]], [[lowB, 2], [lowG, 1]],
          [[lowG, 1], [C, 2]], [[C, 3]],
        ],
      },
    ],
  };
})();
