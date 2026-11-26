(() => {
  "use strict";
  const modes = {
    trail: { name: ["遗迹推石", "Ruin Trails"], kind: ["空间规划", "Spatial planning"], image: 1, icon: "box",
      task: ["把古老的石块推回刻印基座。", "Guide the rune stones onto their pedestals."] },
    prism: { name: ["棱镜光路", "Prism Circuit"], kind: ["光路推理", "Circuit logic"], image: 2, icon: "prism",
      task: ["转动镜片，让星光流过每一条通道。", "Turn the lenses to carry starlight through the network."] },
    weave: { name: ["星纹绘卷", "Star Weave"], kind: ["图形推理", "Picture logic"], image: 3, icon: "weave",
      task: ["读懂行列的数字，织出藏在格子里的图案。", "Read the row and column clues to uncover a hidden picture."] }
  };
  // Each chapter has an opening, a companion encounter, a beacon payoff and a field observation.
  const regions = [
    {
      name: ["苔醒原野", "Mosswake"], keeper: ["栗尾", "Pip"], species: ["寻星狐", "Startrail fox"],
      intro: ["昨夜，有一颗星星掉进了原野。天亮时，栗尾叼来一枚罗盘，指针正朝着一座会呼吸的石门。", "A star fell into Mosswake last night. At dawn, Pip brings you a compass. Its needle points to a stone gate that seems to breathe."],
      meet: ["栗尾把罗盘放进你的手心，又把耳朵贴上草地。地底下，有什么东西轻轻回了三声。", "Pip drops the compass into your palm and presses an ear to the grass. From far below come three soft answering taps."],
      note: ["栗尾用蓬松的尾巴扫开苔藓，记路时总先看石头向阳的一面。", "Pip brushes moss aside with a fluffy tail and remembers the sunny side of every stone."],
      ending: ["石门舒展开来。第一束光掠过草尖，落进西边的海湾。罗盘里那颗小星星，竟然在打呼噜。", "The gate unfolds. A ribbon of light brushes the grass and skips across the bay. Inside your compass, the little star starts to snore."]
    },
    {
      name: ["月潮湾", "Moonwater"], keeper: ["泡芙", "Ripple"], species: ["月贝獭", "Moonshell otter"],
      intro: ["海湾的水车停了。泡芙坐在最高的一片桨叶上，看着被困在潮池里的小鱼。", "The tide mill has stopped. Ripple sits on its highest paddle, watching a school of little fish stranded in a pool."],
      meet: ["一只湿漉漉的爪子递来贝壳。泡芙轻敲壳沿，海底的水车也响了一声。", "A wet paw offers you a shell. Ripple taps the rim. Somewhere underwater, a mill bell answers."],
      note: ["泡芙把喜欢的贝壳藏在腋下游泳。涨潮时，壳上的条纹会发出蓝光。", "Ripple swims with a favourite shell tucked under one arm. Its stripes glow blue as the tide comes in."],
      ending: ["最后一片水桨沉入潮水。小鱼结队游向大海，小星星也跟着发出了一声悠长的鲸鸣。", "The last paddle dips into the tide. The fish slip out to sea and the little star sings one long, unmistakable whale note."]
    },
    {
      name: ["风铃峡", "Bellwind"], keeper: ["铜铃", "Clink"], species: ["响角羱羊", "Chimehorn ibex"],
      intro: ["山谷里的钟全在同时响。铜铃听不清回家的路，只好在两座断桥之间来回踱步。", "Every bell in the canyon is ringing at once. Unable to hear the way home, Clink paces between two broken bridges."],
      meet: ["铜铃歪了歪脑袋。两只角发出不同的音高，乱响的峡谷忽然有了节拍。", "Clink tilts his head. His horns ring at different pitches and suddenly the noisy canyon has a beat."],
      note: ["铜铃的左角音低，右角音高。它在大雾里也能听出哪座桥在晃动。", "Clink's left horn sings low and the right one high. Even in fog, he can hear which bridge is swaying."],
      ending: ["群钟依次响起。你从回声里听出来，那首鲸歌有两段。罗盘里的小家伙只会唱前半段。", "The bells ring in order. In their echo you hear two halves of a whale song. The little one in your compass knows only the first."]
    },
    {
      name: ["紫晶洞", "Amethyst Hollow"], keeper: ["紫翼", "Vesper"], species: ["晶耳蝠", "Amethyst bat"],
      intro: ["紫翼守着一面会留下声音的水晶壁。也许很久以前，有谁在这里唱过那首歌的后半段。", "Vesper guards a crystal wall that remembers sounds. Perhaps someone sang the second half of the song here long ago."],
      meet: ["紫翼落在你的肩上。它轻轻一叫，洞顶便亮起一圈又一圈的紫光。", "Vesper lands on your shoulder. One tiny chirp sends rings of violet light across the cavern roof."],
      note: ["紫翼把回声收进半透明的大耳朵里。真正的晶石只回响一次，空洞会响两次。", "Vesper catches echoes in translucent ears. Solid crystal rings once. A hollow behind it rings twice."],
      ending: ["晶壁回放了一段古老的星鲸歌。小星星舒展开来，两片透明的鳍第一次探出了罗盘。", "The wall plays back an ancient sky-whale song. The little star stretches. Two transparent fins peek out of your compass."]
    },
    {
      name: ["兰冠雨林", "Orchid Canopy"], keeper: ["芽芽", "Frond"], species: ["兰冠幼龙", "Orchid drake"],
      intro: ["幼鲸饿了。雨林里的星兰只有喝足水才会结蜜，而树梢上的水渠早已干涸。", "The calf is hungry. Star orchids make nectar only after a good drink, and the aqueduct high in the canopy is dry."],
      meet: ["芽芽张开叶翼接住露水。那一丁点水珠，刚好够它头顶的一朵兰花打开。", "Frond spreads her leafy wings to catch the dew. A single drop opens an orchid on the top of her head."],
      note: ["芽芽喜欢倒挂在树枝下。它合起叶翼时，连蝴蝶都会把它当作一片嫩叶。", "Frond likes to sleep upside down. With her wings closed, even butterflies mistake her for a new leaf."],
      ending: ["兰花一朵朵盛开。幼鲸吃饱了，打了个喷嚏，喷出一整片小星座。它记得回家的方向了。", "The orchids open in waves. Full of nectar, the calf sneezes a tiny constellation. It remembers the way home."]
    },
    {
      name: ["余烬铸谷", "Cinderforge"], keeper: ["炭团", "Ember"], species: ["火冠蝾螈", "Cinder newt"],
      intro: ["风暴折断了旧灯塔的铜环。炭团一直守着最后一炉火，等一个能让熔炉重新运转的人。", "A storm snapped the lighthouse's brass ring. Ember guards the last warm coal, waiting for someone who can start the forge."],
      meet: ["炭团鼓起腮帮，鼻尖冒出一颗火星。它把最暖和的一块石头让给了小鲸。", "Ember puffs up his cheeks and a spark leaps from his nose. He saves the warmest stone for the calf."],
      note: ["炭团身上的斑点会随着温度变亮。等它的尾尖发出金光，铜就软得恰到好处。", "Ember's freckles brighten with heat. When his tail tip shines gold, brass is just soft enough to shape."],
      ending: ["新的铜环映出所有人的脸。幼鲸试着穿环而过，第一次靠自己的鳍飞了起来。", "Everyone's face shines in the new brass ring. The calf slips through it and flies on its own for the first time."]
    },
    {
      name: ["极光林", "Aurora Reach"], keeper: ["雪羽", "Rime"], species: ["霜羽星鸮", "Frostfeather owl"],
      intro: ["雪把北方的路标全埋了。雪羽听见云层上方传来呼唤，却找不到能穿过极光的航道。", "Snow has buried the northern markers. Rime hears a call above the clouds but cannot find a passage through the aurora."],
      meet: ["雪羽静静飞过雪面。一根落羽轻轻旋转，羽尖始终指向风停下来的地方。", "Rime glides across the snow in silence. A fallen feather spins, its tip always pointing to where the wind comes to rest."],
      note: ["雪羽的两只耳朵高度不同。藏在雪下面的小动静，它也能听出方向。", "Rime's ears sit at different heights. Even a sound buried under snow tells her which way to look."],
      ending: ["极光分开了一道门。云海的另一边传来低沉的回答。幼鲸贴着你的手，安静地听了很久。", "The aurora parts. A deep voice answers from beyond the cloud sea. The calf rests against your hand and listens for a long time."]
    },
    {
      name: ["星落之冠", "Starfall Crown"], keeper: ["曜曜", "Sol"], species: ["天环幼狮", "Halo lion"],
      intro: ["山顶的星盘一年只会转到这个位置一次。曜曜守着最后一座灯，等你把群岛的光接成一条航线。", "Only once a year do the summit rings line up like this. Sol guards the final lamp while you join the islands' lights into a skyway."],
      meet: ["曜曜用爪子拨动铜环，七座岛的倒影排成一列。最后那个空位，恰好够一头小鲸穿过。", "Sol rolls a brass ring with one paw. Seven islands line up in its reflection. The last gap is just big enough for a little whale."],
      note: ["曜曜鬃毛上的亮点并非固定不动。它一抬头，鬃毛里就是今晚真正的星空。", "The lights in Sol's mane never stay still. When he lifts his head, they match the real night sky."],
      ending: ["八盏灯同时亮起。天边传来那首歌的后半段，幼鲸从你手边跃进云海。它和妈妈并肩游过群岛，又回头朝你唱了三声。", "Eight beacons shine. The second half of the song rolls over the horizon. The calf leaps into the clouds beside its mother, then turns to sing you three soft notes."]
    }
  ];
  const symbols = {
    leaf: ["叶", "Leaf"], drop: ["水滴", "Drop"], sun: ["太阳", "Sun"], moon: ["月亮", "Moon"],
    bell: ["风铃", "Bell"], gem: ["晶石", "Gem"], feather: ["羽毛", "Feather"], flame: ["火焰", "Flame"],
    star: ["星", "Star"], snow: ["雪花", "Snow"]
  };
  const seals = [
    ["leaf drop sun moon", [["at","leaf",0],["next","sun","moon"],["before","drop","sun"]]],
    ["drop moon gem star", [["edge","drop"],["next","moon","gem"],["before","gem","star"],["before","drop","moon"]]],
    ["bell feather sun leaf moon", [["at","sun",2],["next","bell","feather"],["before","feather","sun"],["before","leaf","moon"]]],
    ["gem moon star drop feather", [["edge","feather"],["next","moon","star"],["next","star","drop"],["before","gem","moon"],["before","drop","feather"]]],
    ["leaf sun drop feather gem", [["between","drop","sun","feather"],["next","leaf","sun"],["edge","gem"],["before","feather","gem"]]],
    ["flame gem bell star sun moon", [["next","flame","gem"],["next","star","sun"],["between","bell","gem","star"],["edge","moon"],["before","sun","moon"]]],
    ["snow moon feather bell drop star", [["edge","snow"],["next","moon","feather"],["between","bell","feather","drop"],["next","drop","star"],["before","snow","moon"]]],
    ["star sun moon flame gem feather", [["next","star","sun"],["between","moon","sun","flame"],["next","gem","feather"],["edge","feather"],["before","flame","gem"]]]
  ];
  function follows(order, [type,a,b,c]) {
    const x = order.indexOf(a), y = order.indexOf(b), z = order.indexOf(c);
    switch (type) {
      case "at": return x === b;
      case "edge": return x === 0 || x === order.length - 1;
      case "next": return y === x + 1;
      case "before": return x < y;
      case "between": return Math.abs(y - z) === 2 && 2 * x === y + z;
      default: return false;
    }
  }
  window.StarfallWorld = { regions, modes, symbols, seals, follows };
})();
