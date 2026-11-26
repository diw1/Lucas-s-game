(() => {
  "use strict";

  // Each stamp is an original drawing. A caret reflects the half-row at the
  // centre of the square; otherwise rows are read left to right, padded blank.
  const stamps = [
    [5,"Dewheart","露珠之心","Its two lobes catch a single drop of morning dew.","两片小叶凑在一起，正好接住一滴晨露。","^.# ### ### .## ..#"],
    [5,"Trail lantern","引路灯","Count the wick and the little foot beneath the glass.","灯罩下方的小灯芯一直亮着。","^..# .## .#. .## ..#"],
    [5,"Hatchling track","雏鸟脚印","Three toes point the way back to the nest.","三根趾尖都指向鸟巢。","#.#.# #.#.# .### ..# ..##"],
    [5,"Poké Ball","精灵球","The little round latch sits between the red and white halves.","红白两半球壳交会的地方，有一枚小小的圆形开关。","^.## ### ##. #.. .##"],
    [5,"Fern snail","卷叶蜗","The two feelers stick out ahead of its spiral shell.","两根触角从螺壳前方伸出来。","..## .#### .#.## ##.## #####"],
    [5,"Seedwing","种翅蛾","Two broad wings shade a thin body.","展开的两对翅膀盖住了细细的身体。","^#.. ##. ### .## #.#"],
    [5,"Red panda cub","小红熊猫","Two little ears stand above its round face.","圆脸上竖着两只小耳朵。","^#.. ##. ### #.# .##"],

    [7,"Magikarp","鲤鱼王","With its crown-like fin held high, Magikarp makes a magnificent Splash.","鲤鱼王竖起皇冠般的背鳍，精神抖擞地使出水溅跃。","...#.# ..#### #.#### ####.## #.#### ..#### ...##"],
    [7,"Raindrop","雨滴灵","Its pointed crown shows which way the rain fell.","尖尖的头顶朝向雨滴落下的地方。","^...# ..## ..## .### ##.# #### .###"],
    [7,"River reed","溪岸芦苇","Its side leaves bend while the stalk stands straight.","两侧的叶子弯下来，茎仍然笔直。","...## ...## #..# ##.#..# .###.## ...### ...#"],
    [7,"River otter","溪流小獭","Its nose pokes up while its long tail trails behind.","小獭的鼻尖冒出水面，长尾巴跟在后面。","....## ....### ....#.# ...### ...### .##### #.##..#"],
    [7,"Little ferry","芦苇帆船","One triangular sail pulls the curved hull.","三角帆牵着弯曲的小船身。","...# ..## .### ####... ...#... ####### .#####"],
    [7,"Pond frog","池塘蛙","Its high-set eyes can watch the bank from underwater.","长在头顶的眼睛能从水里看见岸边。","^.#.. ###. #.## #### .### #.## ##.."],
    [7,"Moon jelly","月伞水母","Four ribbons dangle beneath its glowing bell.","发光的伞盖下垂着几条触须。","^..## .### #### #### .#.# .#.# #..#"],

    [8,"Mesa chick","台地绒鸟","Its rust-red feathers hide a bright little beak.","铁锈色的羽毛间探出了一只小尖嘴。","...## ..#### ..##.### ...#### .##### ###### .#### ..#.#"],
    [8,"Wind bell","峡风钟","The clapper shows just beneath the heavy lip.","厚厚的钟沿下露出了一点钟舌。","^...# ..## .### .#.# .#.# #### #### ...#"],
    [8,"Flame bud","焰芯花","Three tongues of flame guard the cold seed inside.","三簇火苗护着中间冰凉的种子。","...# ...## .#.## .####.# ##.###.# #####.## .###### ..####"],
    [8,"Stone pick","星矿镐","The curved metal head is heavier than the handle.","弯弯的镐头比木柄更重。","..##.# .###### ...##### ....### ....## ...## ..## .##"],
    [8,"Creeper face","苦力怕的脸","Two square eyes and a long dark mouth: Minecraft's quietest visitor has left a mark.","方方的眼睛、长长的深色嘴巴：《我的世界》里那位轻手轻脚的访客留下了印记。","^. .## .## ...# ..## ..## ..# ."],
    [8,"Gem crab","宝石蟹","Its claws hold crystals without scratching them.","这双大钳子能稳稳夹起水晶。","^#.#. ###. .##. ..## .### #### #.## #..."],
    [8,"Cliff ibex","岩角羱羊","Its curved horns frame two watchful eyes.","卷曲的双角护着一双机警的眼睛。","^.##. ##.# #..# .### #### .#.# ..## ...#"],

    [9,"Cavern fox","晶耳狐","Its dark ear tips show up against the pale crystals.","深色的耳尖在浅色的水晶旁格外显眼。","^# ## ### ##### ##.## .##.# ..### ...## ....#"],
    [9,"Amethyst flake","紫晶星花","The crystal branches scatter the lamplight.","水晶的枝杈把灯光折向四处。","^#.#.# .#..# ..#.# ...## ##### ...## ..#.# .#..# #.#.#"],
    [9,"Zubat","超音蝠","Zubat sends a tiny squeak into the crystal cave. The returning echo guides its wings.","超音蝠朝晶洞轻轻叫了一声，循着传回的回声展开双翅。","^#.... ##... .##.# ..### .##.# ##### #.### ..#.# ...#."],
    [9,"Crystal spires","并生晶簇","Two violet crystals meet above one rocky base.","两根紫水晶从同一块岩石上长出来。","......# .....### ..#..### .###.#### .####.### #####..## ######.## ######### #########"],
    [9,"Star compass","探星罗盘","The long needle points through the middle ring.","长长的指针穿过了中央的圆环。","^....# ...## ..#.# .#.## ##### .#.## ..#.# ...## ....#"],
    [9,"Woolly owlet","绒翅小鸮","Two broad eye rings make its face easy to find.","两个大眼圈勾出了它的脸。","^#...# ##.## ##### #.##. ##.## .#### ..#.# ..### .#.#."],
    [9,"Geode key","晶洞钥匙","Two little teeth sit at the far end of the shaft.","钥匙柄末端长着两枚小齿。","..### .##### ##...## #..#.## .##### ..#### ...#### ....#### .....#.##"],

    [10,"Minecraft bee","方块蜜蜂","The tiny wings keep a surprisingly big striped cube in the air.","两片小翅膀嗡嗡转，让《我的世界》里这只条纹方块蜜蜂悬在花丛上方。","...#..# ..##.## ..##.## .####### ###.##.### ###.##.## ###.##.### .####### ..#..# ."],
    [10,"Orchid mantis","兰花螳螂","Its folded forelegs look like flower petals.","合起来的前足像两片花瓣。","^#.# .# ..#.# ...## .#### ##.## #..## #.### .#..# #...#"],
    [10,"Vine bridge","藤索桥","Hanging vines keep the planks above the ravine.","垂下的藤索把桥板吊在峡谷上方。","^# ##.# #.# #..# #...# ##..# #.### ##### # #"],
    [10,"Cloud lemur","云尾狐猴","Its tall tail is as long as its little body.","翘起的尾巴和身体几乎一样长。","......### .....#### ..#.##..## .#####..## .##.##...# ..####..## ..####.## .####### .##..## ###..###"],
    [10,"Pollen lily","金粉睡莲","Three overlapping petals protect the pollen.","三层花瓣护住中心的花粉。","^#...# #...# ##.## .#### ..### .#### #### ..### ....# ...##"],
    [10,"Fern dragon","蕨羽龙","Wide green wing membranes resemble forest fronds.","宽大的绿色翼膜看起来像两片蕨叶。","^.#... .##.. ..### #.### ##### .###. .#### ..### ...## ....#"],
    [10,"Hollow stump","空心树桩","The dark opening is a safe nest for tiny creatures.","树洞是小动物避雨的窝。","^..#.# .#### .#..# .#### .##.# .#### ##..# ##... ##... ###.#"],

    [11,"Sun scarab","日轮圣甲","The groove down its back divides two shield-like wings.","背上的凹线把盾牌般的翅膀分成两半。","^..# .#.#.# ....## .##### ##.### ..### .#### ##.## ..#### .#### #..#"],
    [11,"Hourglass","流沙之瓶","Sand spills through a neck only one star wide.","沙漏的瓶颈只有一格宽。","^###### .##### .#...# ..#..# ...## .....# ....## ...### ..#### .##### ######"],
    [11,"Cinder scorpion","烬尾蝎","Its curled tail comes up over its back.","弯弯的尾巴从背上高高翘起。","........### .......#### .......##.# .......## .#.#....## ##.##....## .####..#### ...####### ..###### ##.#..# #..#..#..#"],
    [11,"Kiln arch","古窑石拱","Stones lean on their neighbours above a kiln door.","窑门顶上的每块石头都靠着旁边的石块。","^....## ...### ..#### .###.. .##... ###... ##.... ##.... ##.... ###... ###..."],
    [11,"Sand sail","沙海帆车","Two round wheels carry its long pointed sail.","两只轮子托着尖尖的风帆。",".....# ....## ...### ..#### .##### ######.##.. .....#.###. .########## ..#######.. ..##...##.. ..##...##.."],
    [11,"Ember newt","熔火蝾螈","Its long tail curls away from the hot stones.","细长的尾巴绕开了滚烫的石头。",".......###. ......###.# .....###### .##..####.. ..#####.##. ..####..... .######.... .###.##.... ###...##... ##......... .####......"],
    [11,"Peashooter","豌豆射手","A Peashooter pauses, puffs up those cheeks, and aims one bright pea straight ahead.","豌豆射手站稳了，鼓起脸颊，正对着前方准备发射。","...### ..#####.### .###.###..# .#######..# ..#####.### ...### ....# .##.#..## .####.### ..###### ....##"],

    [13,"Pikachu","皮卡丘","Those long ears heard the aurora first. Now the cheek pouches crackle with little sparks.","长耳朵先听见了极光下的动静。皮卡丘的电气囊噼啪闪出了小小的火花。","^# ## .## .### ..##### .###### .##.### .###### ##..##. ###.### .#####. ..##### ....###"],
    [13,"Frost fan","冰纹扇贝","Its shell survives winter below the frozen harbour.","它躲在结冰的港湾下度过寒冬。","^...##.. ..####. .##.### ##.##.# ##.##.# ##.##.# .##.### ..##### ...###. ....### ...#### ..##### ...####"],
    [13,"Northern beacon","北境灯塔","The lantern window sits above a striped tower.","条纹塔身顶端的小窗里亮着灯。","^......# .....## ....### ...#..# ...#..# ...#### ....### ....##. ....### ...###. ...#### ..##### .######"],
    [13,"Snowy owl","雪林鸮","Its white feathers nearly disappear against the snow.","白色的羽毛让它藏进了雪地里。","^.#..... .##.##. ..##### .###.## ##..### ##.#### .###### ..###.# ..##.## ...#### ...#.#. ..##.## ..#..#."],
    [13,"Diving bell","深海潜钟","A round viewing port peers out below the cable.","缆绳下方的圆窗向深海望去。","^......# .....## ......# .....## ....### ...#### ..##### ..##... .##..## .##..## .###... .###### #######"],
    [13,"Narwhal scout","独角鲸侦察员","Its long tusk breaks the water before its nose.","小鲸的长牙比鼻尖更早探出水面。","...........#. ..........##. .........##.. .....#####... ....#######.. ...#####.###. ...########## #..#########. ##.#######... .####.###.... ..##...##.... .##.......... ###.........."],
    [13,"Rime branches","雾凇枝冠","Frost coats every twig on the old tree.","霜花爬满了老树的每一根细枝。","^.#..... .##..#. ..#..#. #.##.## #..###. ##..##. .#####. ...#### .#.#### .###.## ..##### ....### ...####"],

    [15,"Moonwing moth","月纹大蛾","Its four wings carry two pairs of pale moon marks.","四片翅膀上藏着两对浅色月纹。","^..#.# ...#..# #...#.# ###..### ####.### ##.##### #...#### ##.##### .####### ..###.## .####### ##.##### #.##..## .##...# .#...#"],
    [15,"Observatory","云上观星台","A slit in the dome follows the turning sky.","穹顶上的细缝追随着转动的星空。","^.......# ......## .....##. ....##.# ...##.## ..##.### .####### ######## ..###### ..#.#..# ..#.#..# ..###### ..###..# .####..# ########"],
    [15,"Benny the spaceman","乐高太空人班尼","Benny checks his blue spacesuit and waves. There is always another spaceship to build.","班尼检查好蓝色太空服，伸出积木小手打招呼。他已经在想下一艘飞船要怎么搭了。","^.....### ....#### ...##### ...#.... ...##.## ....#### ..###### .###.### ##.##### ##.##### #..##### ...##### ...###.# ...###.# ..####.#"],
    [15,"Orbital astrolabe","星环仪","Two sighting rings turn around a common axle.","两道瞄准环绕着同一条轴转动。","^......## ....##.# ...##..# ..##.#.# .##.#..# .#.#...# #.#..### ######## #..###.# .#.##..# .##...## ..#..##. ...####. .....### ...#####"],
    [15,"Lunar stag","月角星鹿","A wide pair of antlers frames its listening ears.","张开的鹿角护着正在听风的耳朵。","^.#...... .#..#... #.#.#... .####... ...##... ....##.. .##..##. ..###### ...##### ...##.## ....#### .....### ......## .....### ....##.#"],
    [15,"Sky galleon","星海大帆船","Three sails carry the vessel past the thin moon.","三面风帆带着小船驶过弯月。",".......#....... ......##...#... .....###..##... ....####.###... ...#####.###... .......#.####.. ..#....#...#... .##..###...###. ###.####..####. .......#...#... ############### .#############. ..##.##.##.##.. ...#########... ....#######...."],
    [15,"Atlas lion","星图守护狮","Its many-pointed mane is the final seal in the atlas.","这圈有许多尖角的鬃毛，是星图最后一枚印记。","^#...# ##..##.# .##.#.## .####### ..###.## #..##### ##.##..# .##.#### ..###.## ...##### ..###.## .####### ##.##.## #.##### ..##..##"],
  ];

  const lineCache = new Map();

  function runs(line) {
    const groups = [];
    let length = 0;
    for (const value of line) {
      if (value === 1) length++;
      else if (length) { groups.push(length); length = 0; }
    }
    if (length) groups.push(length);
    return groups;
  }

  function masksFor(size, groups) {
    const key = size + ":" + groups.join(".");
    if (lineCache.has(key)) return lineCache.get(key);
    const masks = [];
    const tail = groups.map((_, i) => groups.slice(i).reduce((sum, n) => sum + n + 1, -1));
    function place(i, start, mask) {
      if (i === groups.length) { masks.push(mask); return; }
      for (let pos = start; pos <= size - tail[i]; pos++) {
        place(i + 1, pos + groups[i] + 1, mask | (((1 << groups[i]) - 1) << pos));
      }
    }
    place(0, 0, 0);
    lineCache.set(key, masks);
    return masks;
  }

  function parseStamp(stamp) {
    const [n,en,zh,noteEn,noteZh,raw] = stamp;
    const mirror = raw.startsWith("^");
    const rows = (mirror ? raw.slice(1) : raw).split(" ");
    if (rows.length !== n) throw Error(en + " has " + rows.length + " rows");
    const solution = [];
    for (const row of rows) {
      const width = mirror ? Math.ceil(n / 2) : n;
      if (row.length > width || /[^.#]/.test(row)) throw Error(en + " has invalid row " + row);
      const half = row.padEnd(width, ".");
      const full = half + (mirror ? [...half.slice(0, Math.floor(n / 2))].reverse().join("") : "");
      for (const val of full) solution.push(val === "#" ? 1 : 2);
    }
    const lines = Array.from({ length: 2 * n }, (_, i) => {
      const positions = Array.from({ length: n }, (_, j) => i < n ? i * n + j : j * n + i - n);
      const groups = runs(positions.map(p => solution[p]));
      return { positions, groups, masks: masksFor(n, groups) };
    });
    return { n,en,zh,noteEn,noteZh,solution,lines };
  }

  function deductions(line, state) {
    let ink = 0, blank = 0;
    line.positions.forEach((p, i) => {
      if (state[p] === 1) ink |= 1 << i;
      if (state[p] === 2) blank |= 1 << i;
    });
    const candidates = line.masks.filter(m => (m & ink) === ink && !(m & blank));
    if (!candidates.length) return { candidates: 0, forced: [] };
    let common = candidates[0], possible = common;
    for (const m of candidates) { common &= m; possible |= m; }
    const forced = [];
    line.positions.forEach((p, i) => {
      if (state[p]) return;
      const bit = 1 << i;
      if (common & bit) forced.push([p, 1]);
      else if (!(possible & bit)) forced.push([p, 2]);
    });
    return { candidates: candidates.length, forced };
  }

  const puzzles = stamps.map((stamp,index)=>({...parseStamp(stamp),region:Math.floor(index/7)}));

  function validate() {
    return puzzles.map(puzzle => {
      const state = Array(puzzle.solution.length).fill(0);
      let rounds = 0, changed;
      do {
        const next = state.slice();
        for (const line of puzzle.lines) {
          for (const [p, v] of deductions(line, state).forced) next[p] = v;
        }
        changed = next.some((v, i) => v !== state[i]);
        if (changed) rounds++;
        state.splice(0, state.length, ...next);
      } while (changed);
      return { title: puzzle.en, size: puzzle.n, solved: state.every((v, i) => v === puzzle.solution[i]), unknown: state.filter(v => !v).length, rounds };
    });
  }

  const inks = [
    ["#80dfab","#158e77","#f8d69b"],["#85dfe5","#2e8baf","#eece8f"],
    ["#f0bb72","#b56736","#ffe298"],["#d3a8f8","#8061be","#ffdfab"],
    ["#a7e775","#3b9972","#ffd38e"],["#ffb477","#bc624c","#ffe0a0"],
    ["#b7eafe","#627ecb","#fff1b3"],["#c9baff","#687fd6","#ffd385"],
  ];
  const portraitPalettes={
    "Poké Ball":["#ff9077","#aa483f","#fff3cc"],"Magikarp":["#ffb66c","#d96846","#ffe59c"],
    "Creeper face":["#bfe87b","#668745","#e0f7b0"],"Zubat":["#a5b6ff","#5f76c0","#d8a5e8"],
    "Minecraft bee":["#ffe57c","#bb832c","#d4edfa"],"Peashooter":["#c7ed6c","#5c9c38","#f6ed8b"],
    "Pikachu":["#ffe576","#cc9b42","#ffeaaa"],"Benny the spaceman":["#87caef","#4778bb","#ffe195"]
  };
  function pigment(puzzle,i){
    const key=puzzle.en,n=puzzle.n,x=i%n,y=Math.floor(i/n),filled=puzzle.solution[i]===1;
    switch(key){
      case "Poké Ball":
        if((x===0||x===4)&&(y===0||y===4))return null;
        if(x===2&&y===2)return "#f8f3d8";
        if(y===2||y===4||((x===0||x===4)&&y===3))return "#34434b";
        return y<2?"#e76655":"#e5e6cf";
      case "Creeper face":
        return filled?"#20332b":["#70a452","#8eb963","#80af59","#95be6f"][(x*3+y*7+x*y)%4];
      case "Minecraft bee":
        if(y>=4&&y<=6&&(x===3||x===6))return "#51462e";
        if(!filled)return null;
        if(y<3)return "#bde1e1";
        return (x>7&&y===4)||y>7?"#4c4232":"#eab94e";
      case "Pikachu":
        if(y===8&&(x===2||x===3||x===n-3||x===n-4))return "#ed7055";
        if(y===6&&(x===3||x===n-4)||y===8&&x===6)return "#423c37";
        if(!filled)return null;
        return y<=1?"#494039":(y>=10?"#e9be48":"#f6d75d");
      case "Benny the spaceman":
        if(y===3&&x>=4&&x<=10)return "#e9be54";
        if(y===7&&x>=5&&x<=8)return x===6?"#f4d672":"#cadce1";
        return filled?(y<6?"#67a4d5":"#4c86bf"):null;
      case "Magikarp": return filled?(y<2||x<2?"#edc16d":"#e98a58"):null;
      case "Zubat": return filled?(y>3&&x>1&&x<n-2?"#b58acb":"#829bd4"):null;
      case "Peashooter": return filled?(y>5?"#659c45":(x>(n-4)?"#93bd4c":"#a3cf5e")):null;
      default:{
        if(!filled)return null;
        const palette=inks[puzzle.region];
        return palette[(x*2+y*3+i)%11<2?2:(x+y)%4===0?1:0];
      }
    }
  }
  function preview(index){
    const puzzle=puzzles[index];if(!puzzle)return "";
    const c=document.createElement("canvas");
    c.width=c.height=puzzle.n;
    const g=c.getContext("2d");
    puzzle.solution.forEach((_,i)=>{
      const colour=pigment(puzzle,i);if(!colour)return;
      g.fillStyle=colour;g.fillRect(i%puzzle.n,Math.floor(i/puzzle.n),1,1);
    });
    return c.toDataURL();
  }
  const safeGrid = (value, n) => typeof value === "string" && value.length === n * n && !/[^012]/.test(value);

  function mount(host, options) {
    const {index, region, lang, saved, onSave, onWin, sound} = options;
    const T = (en, zh) => lang === "zh" ? zh : en;
    const puzzle = puzzles[index];
    if (!puzzle) throw Error("Unknown weave pattern");
    const n = puzzle.n;
    const palette = portraitPalettes[puzzle.en] || inks[region] || inks[Math.floor(index / 7)];
    const restored = saved?.version === 1 && saved.index === index && safeGrid(saved.grid, n);
    let state = restored ? [...saved.grid].map(Number) : Array(n*n).fill(0);
    let history = restored && Array.isArray(saved.history) ? saved.history.filter(g => safeGrid(g, n)).slice(-48) : [];
    let moves = restored && Number.isSafeInteger(saved.moves) ? Math.max(0, saved.moves) : 0;
    let tool = restored && [0,1,2].includes(saved.tool) ? saved.tool : 1;
    let focus = 0, hover = -1, stroke = null, hint = null, resetArmed = false;
    let won = false, reported = false, finishTimer = null, disposed = false;
    const controller = new AbortController();
    const listen = (node, event, fn, extras = {}) => node.addEventListener(event, fn, {signal: controller.signal, ...extras});
    function element(tag, cls, content, parent) {
      const node = document.createElement(tag);
      if (cls) node.className = cls;
      if (content != null) node.textContent = content;
      if (parent) parent.append(node);
      return node;
    }
    function button(text, cls, parent, action) {
      const b = element("button", cls, text, parent);
      b.type = "button";
      listen(b, "click", action);
      return b;
    }
    function save() {
      onSave?.({version:1, index, grid:state.join(""), moves, tool, history:history.slice(-48)});
    }
    const wrap = element("section","sw-game");
    wrap.setAttribute("aria-label",T("Star Weave puzzle","星纹绘卷谜题"));
    wrap.style.setProperty("--sw-bright",palette[0]);
    wrap.style.setProperty("--sw-deep",palette[1]);
    wrap.style.setProperty("--sw-gold",palette[2]);
    host.replaceChildren(wrap);

    const header = element("div","sw-heading",null,wrap);
    const nameSide = element("div","sw-name",null,header);
    element("span","sw-spool",null,nameSide).setAttribute("aria-hidden","true");
    element("h3","",T(puzzle.en,puzzle.zh),nameSide);
    const dimensions = element("span","sw-size",n+" × "+n,header);
    dimensions.title = T("Pattern dimensions","星纹尺寸");

    const layout = element("div","sw-layout",null,wrap);
    const viewing = element("div","sw-view",null,layout);
    const scroll = element("div","sw-scroll",null,viewing);
    const grid = element("div","sw-grid",null,scroll);
    grid.tabIndex = 0;
    grid.setAttribute("role","grid");
    grid.setAttribute("aria-rowcount",n);
    grid.setAttribute("aria-colcount",n);
    grid.setAttribute("aria-label", T("Picture grid. Arrow keys to navigate, space to paint, X to mark a blank, Delete to erase.","绘图格。方向键移动，空格涂色，X 标空，Delete 擦除。"));
    const rowUnits = Math.max(1.5,...puzzle.lines.slice(0,n).map(l => l.groups.length * .72 + .45));
    grid.style.setProperty("--sw-n",n);
    grid.style.setProperty("--sw-left",(100 * rowUnits / (n+rowUnits)) + "%");
    const lines = [];
    const cells = [];
    const corner = element("div","sw-corner",null,grid);
    corner.setAttribute("aria-hidden","true");
    element("span","", "✧", corner);
    function clue(id) {
      const row = id<n;
      const node = element("div","sw-clue "+(row?"sw-row":"sw-col"),null,grid);
      const groups = puzzle.lines[id].groups;
      for (const group of groups.length ? groups : [0]) element("span","",group,node);
      const num = (id % n) + 1;
      node.title = (row ? T("Row ","行 ") : T("Column ","列 ")) + num + " · " + (groups.join("  ") || "0");
      lines[id] = node;
    }
    for (let x=0;x<n;x++) clue(x+n);
    const idPrefix = "sw-"+Math.random().toString(36).slice(2,9)+"-";
    for (let y=0;y<n;y++) {
      clue(y);
      for (let x=0;x<n;x++) {
        const p=y*n+x;
        const tile=element("div","sw-tile",null,grid);
        tile.dataset.p=p; tile.id=idPrefix+p;
        tile.setAttribute("role","gridcell");
        tile.setAttribute("aria-rowindex",y+1);
        tile.setAttribute("aria-colindex",x+1);
        if (x && x%5===0) tile.classList.add("sw-v5");
        if (y && y%5===0) tile.classList.add("sw-h5");
        const colour=pigment(puzzle,p);
        if(colour)tile.style.setProperty("--sw-reveal",colour);
        cells.push(tile);
      }
    }
    const caption = element("div","sw-caption",null,viewing);
    const progress = element("span","",null,caption);
    const zoom = button(T("Enlarge","放大棋盘"),"sw-zoom",caption,() => {
      const enlarged=scroll.classList.toggle("sw-enlarged");
      zoom.textContent=enlarged?T("Fit board","适应宽度"):T("Enlarge","放大棋盘");
      zoom.setAttribute("aria-pressed",enlarged);
      pan.hidden=!enlarged; scroll.scrollLeft=0; pan.value=0;
    });
    zoom.setAttribute("aria-pressed","false");
    const pan=element("input","sw-pan",null,viewing);
    pan.type="range";pan.min=0;pan.max=100;pan.value=0;pan.hidden=true;
    pan.setAttribute("aria-label",T("Pan enlarged board left or right","左右移动放大的棋盘"));
    listen(pan,"input",()=>{scroll.scrollLeft=(scroll.scrollWidth-scroll.clientWidth)*Number(pan.value)/100;});
    listen(scroll,"scroll",()=>{const max=scroll.scrollWidth-scroll.clientWidth;if(max>0)pan.value=Math.round(scroll.scrollLeft*100/max);});
    const panel=element("div","sw-panel",null,layout);
    const guide=element("details","sw-guide",null,panel);
    guide.open=index===0 && !restored;
    element("summary","",T("How to read the stars","怎么看数字"),guide);
    element("p","",T("The numbers show groups of inked squares in order. Leave at least one blank between groups. Match both the row and its column.","数字按顺序表示每段连续涂色的格数。两段之间至少留一格空白。每一行、每一列都要对上。"),guide);
    const sample=element("div","sw-sample",null,guide);
    element("b","","2  1",sample);
    for (const val of [1,1,2,1]) element("i",val===1?"ink":"blank",val===2?"×":"",sample);
    element("p","",T("A cross is a reminder that a square is empty. You can leave empty squares unmarked.","叉号帮你记住空格。通关只需要涂对图案，空格可以留白。"),guide);
    if(index===0) element("p","sw-first","",guide).textContent=T("Start with row 2. Its 5 fills the entire row.","从第 2 行开始。数字 5 正好填满这一行。");
    const toolsLabel=element("div","sw-tools",null,panel);
    const toolButtons=new Map();
    function selectTool(v) {
      if(won) return;
      tool=v; resetArmed=false; draw(); save();
    }
    for(const [v,mark,label] of [[1,"◆",T("Ink","涂色")],[2,"×",T("Blank","标空")],[0,"◇",T("Erase","擦除")]]) {
      const b=button("","sw-tool",toolsLabel,()=>selectTool(v));
      element("span","sw-tool-icon",mark,b).setAttribute("aria-hidden","true");
      element("span","",label,b);
      toolButtons.set(v,b);
    }
    const actions=element("div","sw-actions",null,panel);
    const undo=button(T("↶  Undo","↶  撤销"),"sw-minor",actions,undoLast);
    const reset=button(T("Reset","重置"),"sw-minor",actions,resetGrid);
    const hintBox=element("div","sw-hintbox",null,panel);
    const hintBtn=button("","sw-hintbtn",hintBox,advanceHint);
    const message=element("p","sw-message",null,hintBox);
    message.setAttribute("aria-live","polite");
    const finish=button(T("Collect pattern  ›","收录星纹  ›"),"sw-finish",panel,report);
    finish.hidden=true;
    const tip=T("Drag across several squares to ink them in one stroke.","按住并拖过相邻格子，可以一笔连涂。");
    message.textContent=tip;
    const total=puzzle.solution.filter(v=>v===1).length;
    function report() {
      if(!won || reported || disposed) return;
      reported=true;
      onWin?.({moves, title:T(puzzle.en,puzzle.zh), note:T(puzzle.noteEn,puzzle.noteZh)});
    }
    function solved() { return state.every((v,i)=>(v===1)===(puzzle.solution[i]===1)); }
    function checkWin() {
      if(!solved() || won) return;
      won=true; hint=null; draw();
      message.textContent=T(puzzle.noteEn,puzzle.noteZh);
      finish.hidden=false;
      sound?.("success");
      finishTimer=setTimeout(report,1600);
    }
    function draw() {
      wrap.classList.toggle("sw-won",won);
      const pointed=hover>=0?hover:focus;
      for(let i=0;i<cells.length;i++){
        const c=cells[i],v=state[i];
        c.dataset.ink=v;
        c.classList.toggle("sw-focus",i===focus);
        c.classList.toggle("sw-target",hint?.stage===2 && hint.p===i);
        c.classList.toggle("sw-guideline",hint && (hint.line<n?Math.floor(i/n)===hint.line:i%n===hint.line-n));
        if(c.getAttribute("data-label-state")!==String(v)){
          c.setAttribute("data-label-state",v);
          c.setAttribute("aria-label",T("Row "+(Math.floor(i/n)+1)+", column "+(i%n+1)+", ","第 "+(Math.floor(i/n)+1)+" 行，第 "+(i%n+1)+" 列，")+(v===1?T("inked","已涂色"):v===2?T("marked blank","已标空"):T("unmarked","未标记")));
        }
      }
      grid.setAttribute("aria-activedescendant",cells[focus].id);
      for(let i=0;i<lines.length;i++){
        const info=puzzle.lines[i];
        const done=info.groups.join()===runs(info.positions.map(p=>state[p])).join();
        lines[i].classList.toggle("sw-matched",done);
        lines[i].classList.toggle("sw-active",i===Math.floor(pointed/n)||i===n+pointed%n);
        lines[i].classList.toggle("sw-prompt",i===hint?.line);
      }
      for(const [v,b] of toolButtons){b.setAttribute("aria-pressed",v===tool);b.disabled=won;}
      undo.disabled=won || !history.length;
      reset.disabled=won || !state.some(Boolean);
      reset.textContent=resetArmed?T("Confirm reset","确认重置"):T("Reset","重置");
      hintBtn.disabled=won;
      hintBtn.textContent=hint?.stage===1?T("Show the square","指出这格"):hint?.stage===2?T("Apply this clue","应用这步"):T("✧  Find a clue","✧  找一条线索");
      progress.textContent=won?T("Pattern discovered","星纹已显现"):T("Inked ","已涂 ")+state.filter(v=>v===1).length+" / "+total;
    }
    function clearFeedback(){
      hint=null;resetArmed=false;message.textContent=tip;
    }
    function record(before){
      if(before===state.join(""))return;
      history.push(before);if(history.length>48)history.shift();
      moves++;draw();save();sound?.("move");checkWin();
    }
    function undoLast(){
      if(won||!history.length)return;
      state=[...history.pop()].map(Number);
      moves=Math.max(0,moves-1);
      clearFeedback();draw();save();sound?.("tap");
    }
    function resetGrid(){
      if(won)return;
      if(!resetArmed){hint=null;resetArmed=true;draw();message.textContent=T("Press again to clear the pattern. Undo can bring it back.","再按一次清空棋盘。撤销可以恢复这次操作。");return;}
      const before=state.join("");state.fill(0);clearFeedback();record(before);
    }
    function findHint(){
      const incorrect=state.findIndex((v,i)=>v!==0 && v!==puzzle.solution[i]);
      if(incorrect>=0)return {p:incorrect,v:0,line:Math.floor(incorrect/n),error:true,stage:1};
      const options=puzzle.lines.map((line,i)=>({...deductions(line,state),line:i})).filter(a=>a.forced.length);
      options.sort((a,b)=>a.candidates-b.candidates || b.forced.length-a.forced.length || a.line-b.line);
      if(!options.length)return null;
      const best=options[0];
      const [p,v]=best.forced.find(([,v])=>v===1)||best.forced[0];
      return {p,v,line:best.line,candidates:best.candidates,stage:1};
    }
    function advanceHint(){
      if(won)return;
      resetArmed=false;
      if(!hint)hint=findHint();
      else if(hint.stage===1)hint.stage=2;
      else{
        const before=state.join("");state[hint.p]=hint.v;clearFeedback();record(before);return;
      }
      if(!hint)return;
      const line=hint.line<n?T("row "+(hint.line+1),"第 "+(hint.line+1)+" 行"):T("column "+(hint.line-n+1),"第 "+(hint.line-n+1)+" 列");
      const name=hint.v===1?T("inked","涂色"):T("blank","标空");
      if(hint.stage===1){
        const groups=puzzle.lines[hint.line].groups.join(" · ")||"0";
        if(hint.error)message.textContent=T("One mark in "+line+" disagrees with the hidden pattern. Recheck it using its column.","「"+line+"」有一格和图案不符。对照它所在的列检查一下。");
        else if(hint.candidates===1)message.textContent=T("Look at "+line+" ("+groups+"). Only one arrangement fits.","看「"+line+"」的 "+groups+"。满足线索的排列只剩一种。");
        else message.textContent=T("Try "+line+" ("+groups+"). Its "+hint.candidates+" possible arrangements agree on a square.","看「"+line+"」的 "+groups+"。剩下 "+hint.candidates+" 种排法中，有一格的位置都相同。");
      }else{
        focus=hint.p;
        const y=Math.floor(hint.p/n)+1,x=hint.p%n+1;
        message.textContent=hint.error?T("Erase the mark at row "+y+", column "+x+", then read its numbers again.","先擦掉第 "+y+" 行、第 "+x+" 列的标记，再读一次线索。"):T("Row "+y+", column "+x+" must be "+name+" in every fitting arrangement.","每一种可行排法里，第 "+y+" 行、第 "+x+" 列都要"+name+"。");
      }
      draw();sound?.("tap");
    }
    function squareAt(target){
      const tile=target?.closest?.(".sw-tile");
      return tile && grid.contains(tile)?Number(tile.dataset.p):-1;
    }
    function paint(p){
      if (!stroke || p<0 || p>=state.length) return;
      const prev=stroke.last;
      if(prev!=null && prev!==p && (Math.floor(prev/n)===Math.floor(p/n) || prev%n===p%n)){
        const step=Math.sign(p-prev)*(prev%n===p%n?n:1);
        for(let i=prev+step;i!==p;i+=step)state[i]=stroke.v;
      }
      state[p]=stroke.v;stroke.last=p;focus=p;hover=p;draw();
    }
    function endStroke(){
      if(stroke){const before=stroke.before;stroke=null;record(before);}
    }
    listen(grid,"contextmenu",e=>e.preventDefault());
    listen(grid,"pointerdown",e=>{
      const p=squareAt(e.target);
      if(won || stroke || p<0 || (e.button!==0&&e.button!==2))return;
      if(scroll.classList.contains("sw-enlarged")&&e.pointerType==="touch"&&e.isPrimary===false)return;
      e.preventDefault();grid.focus({preventScroll:true});grid.setPointerCapture(e.pointerId);
      const ink=e.button===2?2:tool;
      clearFeedback();
      stroke={id:e.pointerId,before:state.join(""),v:state[p]===ink?0:ink,last:null};paint(p);
    });
    listen(grid,"pointermove",e=>{
      if(stroke){
        if(e.pointerId!==stroke.id)return;
        const p=squareAt(document.elementFromPoint(e.clientX,e.clientY));
        if(p>=0 && p!==stroke.last)paint(p);
      }else if(e.pointerType==="mouse"){
        const p=squareAt(e.target);
        if(p!==hover){hover=p;draw();}
      }
    });
    for(const event of ["pointerup","pointercancel","lostpointercapture"])listen(grid,event,e=>{if(stroke?.id===e.pointerId)endStroke();});
    listen(grid,"pointerleave",()=>{if(!stroke&&hover>=0){hover=-1;draw();}});
    listen(grid,"keydown",e=>{
      if(won||e.altKey||e.metaKey||e.ctrlKey)return;
      const key=e.key.toLowerCase(), x=focus%n,y=Math.floor(focus/n);
      if(key==="arrowleft")focus=y*n+Math.max(0,x-1);
      else if(key==="arrowright")focus=y*n+Math.min(n-1,x+1);
      else if(key==="arrowup")focus=Math.max(0,y-1)*n+x;
      else if(key==="arrowdown")focus=Math.min(n-1,y+1)*n+x;
      else if([" ","enter","x","backspace","delete"].includes(key)){
        const v=key==="x"?2:(key==="delete"||key==="backspace")?0:tool;
        const before=state.join("");
        clearFeedback();state[focus]=state[focus]===v?0:v;record(before);
      }else if(key==="z")undoLast();
      else return;
      e.preventDefault();e.stopPropagation();hover=-1;draw();
      if(scroll.classList.contains("sw-enlarged"))cells[focus].scrollIntoView({block:"nearest",inline:"nearest"});
    });
    draw();checkWin();
    return ()=>{
      endStroke();disposed=true;clearTimeout(finishTimer);controller.abort();
    };
  }

  window.StarfallModes = window.StarfallModes || {};
  window.StarfallModes.weave = {
    count: puzzles.length, mount, validate, preview,
    getTitle(index, lang) { return puzzles[index]?.[lang === "zh" ? "zh" : "en"]; },
    getNote(index, lang) { return puzzles[index]?.[lang === "zh" ? "noteZh" : "noteEn"]; },
  };
})();
