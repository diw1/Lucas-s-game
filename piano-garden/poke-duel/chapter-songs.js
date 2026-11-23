(() => {
  "use strict";

  const C = 60, D = 62, E = 64, F = 65, G = 67;
  const A = 69, B = 71, highC = 72, highD = 74;

  // Page assignments follow Faber's Level 1 (FF1078) progress chart, units 8–10.
  // https://pianoadventures.com/wp-content/uploads/sites/2/2020/06/Progress-Chart-with-Gold-Star.pdf
  // Row, Row: each compound beat of the traditional tune becomes a bar of
  // three quarter-note beats. C-major answers fill the ends of the long lines.
  // https://www.kinder-wollen-singen.de/lieder/row-row-row-your-boat/
  const rowingVerse = [
    [[C, 3]],
    [[C, 3]],
    [[C, 2], [D, 1]],
    [[E, 3]],
    [[E, 2], [D, 1]],
    [[E, 2], [F, 1]],
    [[G, 3]],
    [[C, 1], [E, 1], [G, 1]],
  ];
  const rowingAnswer = [
    [[highC, 1], [highC, 1], [highC, 1]],
    [[G, 1], [G, 1], [G, 1]],
    [[E, 1], [E, 1], [E, 1]],
    [[C, 1], [C, 1], [C, 1]],
    [[G, 2], [F, 1]],
    [[E, 2], [D, 1]],
    [[C, 1], [E, 1], [G, 1]],
    [[C, 3]],
  ];

  // Haydn, Hob. I:104, finale, first violin, bars 3–10. Transposed to C,
  // with the low dominant raised an octave and the ornamental eighths simplified.
  // https://imslp.org/wiki/Symphony_No.104_in_D_major,_Hob.I:104_(Haydn,_Joseph)
  const londonOpening = [
    [[G, 1], [F, 1], [D, 2]],
    [[F, 1], [E, 1], [C, 2]],
    [[G, 1], [G, 1], [D, 1], [E, 1]],
  ];
  const londonQuestion = [...londonOpening, [[C, 2], [D, 2]]];
  const londonAnswer = [...londonOpening, [[C, 2], [C, 2]]];

  Object.assign(window.DuelSongs, {
    rowboat: {
      title: ["划呀划小船", "Row, Row, Row Your Boat"],
      credit: ["传统儿歌 · C 大调旋律与分解和弦，弹两遍", "Traditional round · melody and broken C chords, twice"],
      page: "51",
      bench: [
        "翻到第 51 页。先用左手一起按下 C、E、G，听听书里的划船伴奏，再把右手旋律加进去。",
        "Open page 51. Play C, E and G together with your left hand. Listen to the rowing accompaniment, then add the right-hand tune.",
      ],
      beatsPerBar: 3,
      sections: [
        { title: ["第一趟出发", "First launch"], bars: rowingVerse },
        { title: ["唱过浪尖", "Over the waves"], bars: rowingAnswer },
        { title: ["轻轻唱第二遍", "A softer second verse"], bars: rowingVerse },
        { title: ["划进港湾", "Into the harbour"], bars: rowingAnswer },
      ],
    },
    london: {
      title: ["《伦敦交响曲》终乐章主题", "London Symphony Finale Theme"],
      credit: ["海顿 · C 大调五指改编", "Joseph Haydn · C five-finger arrangement"],
      page: "52",
      bench: [
        "翻到第 52 页。先在琴上找到书里的两音 V7 和弦，用左手从 F、G 一起响的位置回到 C、E、G。再听一听这两个和弦怎样回答旋律。",
        "Open page 52. Find the book’s two-note V7 chord. Play F and G together in the left hand, then return to C, E and G. Listen to how the two chords answer the tune.",
      ],
      beatsPerBar: 4,
      sections: [
        { title: ["胖丁来领奏", "Jigglypuff takes the lead"], bars: londonQuestion },
        { title: ["第一声回应", "First answer"], bars: londonAnswer },
        { title: ["轻声再问", "Ask again softly"], bars: londonQuestion },
        { title: ["全场齐奏", "Everyone joins in"], bars: londonAnswer },
      ],
    },
    bongo: {
      title: ["卡拉卡拉的骨棒鼓", "Cubone’s Bone Drum"],
      credit: ["原创曲 · G 五指位置的重拍与休止", "Original tune · strong beats and rests in G position"],
      page: "56–58",
      bench: [
        "翻到第 57 页，把右手五指依次放在 G、A、B、C、D 上。弹一遍热身，再翻到第 58 页，找出你最想跺脚的那一拍。",
        "On page 57, place your right-hand fingers on G, A, B, C and D. Play the warm-up, then open page 58 and find a beat that makes you want to stomp.",
      ],
      beatsPerBar: 4,
      sections: [
        {
          title: ["骨棒发令", "The drum call"],
          bars: [
            [[G, 1], [G, 1], [highD, 1], [B, 1]],
            [[A, 1], [null, 1], [G, 2]],
            [[G, 1], [G, 1], [B, 1], [highD, 1]],
            [[highC, 2], [A, 2]],
          ],
        },
        {
          title: ["岩壁回声", "Echo on the rocks"],
          bars: [
            [[highD, 1], [highD, 1], [B, 1], [G, 1]],
            [[A, 1], [null, 1], [B, 2]],
            [[highC, 1], [B, 1], [A, 1], [highC, 1]],
            [[highD, 2], [null, 2]],
          ],
        },
        {
          title: ["轮流击鼓", "Trading rhythms"],
          bars: [
            [[G, 1], [B, 1], [highD, 2]],
            [[A, 1], [highC, 1], [highD, 2]],
            [[B, 1], [highD, 1], [highC, 1], [B, 1]],
            [[A, 1], [null, 1], [highD, 2]],
          ],
        },
        {
          title: ["最后一跺", "The final stomp"],
          bars: [
            [[G, 1], [G, 1], [highD, 1], [B, 1]],
            [[A, 1], [null, 1], [G, 2]],
            [[highD, 1], [B, 1], [A, 1], [highC, 1]],
            [[G, 4]],
          ],
        },
      ],
    },
    bubble: {
      title: ["蚊香蝌蚪的泡泡圆舞曲", "Poliwag’s Bubble Waltz"],
      credit: ["原创曲 · G 五指位置的三拍子圆舞曲", "Original tune · a three-beat waltz in G position"],
      page: "60",
      bench: [
        "翻到第 60 页的《The Bubble》。在第一句中圈出属于 G 五指位置的音，再试着一口气弹完这一句。",
        "Open The Bubble on page 60. Point out the notes of the G five-finger position in the first phrase, then play that phrase in one breath.",
      ],
      beatsPerBar: 3,
      sections: [
        {
          title: ["小泡泡升起来", "Bubbles rise"],
          bars: [
            [[G, 1], [A, 1], [B, 1]],
            [[highD, 2], [B, 1]],
            [[A, 1], [B, 1], [highC, 1]],
            [[highD, 3]],
          ],
        },
        {
          title: ["在水面打转", "Spinning on the pond"],
          bars: [
            [[highD, 1], [highC, 1], [B, 1]],
            [[A, 2], [highC, 1]],
            [[B, 1], [A, 1], [G, 1]],
            [[A, 3]],
          ],
        },
        {
          title: ["追着水纹走", "Follow the ripples"],
          bars: [
            [[B, 1], [G, 1], [B, 1]],
            [[highC, 1], [A, 1], [highC, 1]],
            [[highD, 1], [highC, 1], [B, 1]],
            [[A, 2], [highD, 1]],
          ],
        },
        {
          title: ["轻轻落回水里", "Back to the water"],
          bars: [
            [[G, 1], [A, 1], [B, 1]],
            [[highD, 2], [highC, 1]],
            [[B, 1], [A, 1], [G, 1]],
            [[G, 3]],
          ],
        },
      ],
    },
  });
})();
