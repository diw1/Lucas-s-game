(() => {
  "use strict";

  // Original companion pieces for FF1078, units 6–8.
  // https://pianoadventures.com/wp-content/uploads/sites/2/2020/06/Progress-Chart-with-Gold-Star.pdf#page=4
  const lowG = 55, C = 60, D = 62, E = 64, F = 65, G = 67, A = 69, highC = 72;
  const bFlat = beats => [70, beats, "B♭4"];

  const butterflyRise = [
    [[F, 1], [A, 1], bFlat(1)],
    [[highC, 2], [A, 1]],
    [[G, 1], bFlat(1), [A, 1]],
    [[G, 3]],
  ];
  const butterflyFall = [
    [[highC, 1], bFlat(1), [A, 1]],
    [[G, 2], [F, 1]],
    [[G, 1], [A, 1], [G, 1]],
    [[F, 3]],
  ];

  Object.assign(window.DuelSongs, {
    scarf: {
      title: ["巴大蝶的丝带舞", "Butterfree’s Ribbon Dance"],
      credit: ["原创曲 · 降 B，八小节舞步跳两遍", "Original tune · a B-flat step in an eight-bar dance, twice"],
      page: "45",
      bench: [
        "翻到第 45 页的《Scarf Dance》。先指出反复记号，看看要回到哪里。弹到那里时，保持原来的速度再跳一圈。",
        "Open Scarf Dance on page 45. Trace the repeat sign back to its starting point. When you get there, keep the pulse going for the second dance.",
      ],
      beatsPerBar: 3,
      sections: [
        { title: ["丝带升起", "Ribbon up"], bars: butterflyRise },
        { title: ["转身落下", "Turn and land"], bars: butterflyFall },
        { title: ["再跳一圈", "Dance it again"], bars: butterflyRise },
        { title: ["轻轻着地", "A soft landing"], bars: butterflyFall },
      ],
    },
    march: {
      title: ["腕力的两音踏步", "Machop’s Two-Note Parade"],
      credit: ["原创曲 · 用 C 和 G 一问一答", "Original tune · a call and response on C and G"],
      page: "46",
      bench: [
        "翻到第 46 页的《Two-Note March》。找一找主音 C 和属音 G。唱着音名弹第一行，听听哪一个音像是回到了家。",
        "Open Two-Note March on page 46. Find the tonic C and dominant G. Sing their names as you play the first line and listen for the note that feels like home.",
      ],
      beatsPerBar: 4,
      sections: [
        {
          title: ["腕力喊口令", "Machop calls"],
          bars: [
            [[C, 1], [C, 1], [G, 2]],
            [[C, 2], [G, 1], [G, 1]],
            [[C, 1], [C, 1], [G, 1], [C, 1]],
            [[G, 2], [null, 2]],
          ],
        },
        {
          title: ["队伍来回答", "The team answers"],
          bars: [
            [[G, 1], [G, 1], [C, 2]],
            [[G, 2], [C, 1], [C, 1]],
            [[G, 1], [null, 1], [G, 1], [C, 1]],
            [[G, 4]],
          ],
        },
        {
          title: ["一起踏步回家", "March home together"],
          bars: [
            [[C, 1], [C, 1], [G, 2]],
            [[G, 1], [G, 1], [C, 2]],
            [[C, 1], [G, 1], [G, 2]],
            [[C, 4]],
          ],
        },
      ],
    },
    bicycle: {
      title: ["嘟嘟的双人单车", "Doduo’s Tandem Ride"],
      credit: ["原创曲 · 轮流弹高音旋律与低音回答", "Original tune · a high melody and a low answer"],
      page: "47",
      bench: [
        "翻到第 47 页的《Girl on a Bicycle》和《Boy on a Bicycle》。选一首弹出第一句，再弹另一首的第一句，听听主音和属音落在哪里。",
        "Find Girl on a Bicycle and Boy on a Bicycle on page 47. Play the first phrase of each. Listen for where each melody lands on the tonic or dominant.",
      ],
      beatsPerBar: 4,
      sections: [
        {
          title: ["前座领骑", "The front rider"],
          bars: [
            [[C, 1], [D, 1], [E, 2]],
            [[G, 2], [E, 1], [D, 1]],
            [[C, 1], [E, 1], [F, 1], [E, 1]],
            [[D, 2], [G, 2]],
          ],
        },
        {
          title: ["后座应声", "The back rider"],
          bars: [
            [[lowG, 2], [C, 1], [C, 1]],
            [[lowG, 1], [C, 1], [D, 2]],
            [[lowG, 2], [D, 1], [C, 1]],
            [[lowG, 4]],
          ],
        },
        {
          title: ["越过小桥", "Across the bridge"],
          bars: [
            [[C, 1], [D, 1], [E, 2]],
            [[lowG, 2], [C, 1], [D, 1]],
            [[E, 1], [F, 1], [G, 2]],
            [[lowG, 2], [D, 2]],
          ],
        },
        {
          title: ["一起溜下坡", "Coasting downhill"],
          bars: [
            [[G, 1], [F, 1], [E, 2]],
            [[F, 1], [E, 1], [D, 2]],
            [[E, 1], [D, 1], [lowG, 2]],
            [[C, 4]],
          ],
        },
      ],
    },
    field: {
      title: ["咕咕的麦田晚歌", "Hoothoot’s Harvest Lullaby"],
      credit: ["原创曲 · 把 C、E、G 分开弹成旋律", "Original tune · a melody built from C, E and G"],
      page: "48–49",
      bench: [
        "翻到第 48 页的《Blocked Chord Study》和《Broken Chord Study》，把 C、E、G 合起来弹，再分开弹。翻到第 49 页的《Song for a Scarecrow》，找出一次 C 和弦。",
        "On page 48, try Blocked Chord Study and Broken Chord Study. Play C, E and G together, then separately. Find a C chord in Song for a Scarecrow on page 49.",
      ],
      beatsPerBar: 3,
      sections: [
        {
          title: ["风吹麦田", "Wind in the wheat"],
          bars: [
            [[C, 1], [E, 1], [G, 1]],
            [[E, 2], [C, 1]],
            [[D, 1], [F, 1], [E, 1]],
            [[D, 3]],
          ],
        },
        {
          title: ["咕咕呼唤", "The owl calls"],
          bars: [
            [[G, 2], [E, 1]],
            [[G, 2], [E, 1]],
            [[F, 1], [E, 1], [D, 1]],
            [[C, 3]],
          ],
        },
        {
          title: ["稻草人在听", "The scarecrow listens"],
          bars: [
            [[E, 1], [G, 1], [E, 1]],
            [[F, 2], [D, 1]],
            [[G, 1], [E, 1], [C, 1]],
            [[D, 2], [G, 1]],
          ],
        },
        {
          title: ["田野入睡", "The fields settle"],
          bars: [
            [[C, 1], [E, 1], [G, 1]],
            [[E, 2], [C, 1]],
            [[G, 1], [E, 1], [D, 1]],
            [[C, 3]],
          ],
        },
      ],
    },
  });
})();
