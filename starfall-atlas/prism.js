/* Starfall Atlas · Prism Circuit. Bits run clockwise from north. */
(() => {
  "use strict";
  // [width, solution, opening, pins, sources, bridges, gates, lamp colors]
  const charts = [
    [3,"2c42b9","4342b9",[3,4,5],[4],[],[],"101100"],
    [3,"6a87ec111","6527ec481",[0,5,8],[0],[],[],"001000111"],
    [4,"2ea86d6813b8","1e586d348374",[1],[1],[],[],"100100011001"],
    [3,"2ac6ed1512b8","256cdd8582b2",[5],[5],[],[],"100000101101"],
    [4,"2ec46d7d1111","8b686d7d2142",[6],[6],[],[],"100100001111"],
    [4,"6a8452ed7e951381","6a2251b7ee951c28",[0],[0],[],[],"0011010000001011"],
    [4,"6ae87838546c3b91","6ad17498a13c9b61",[4],[4],[],[],"0001010101000001"],
    [4,"42c452bd3829","229454bd3416",[7,8],[8,7],[],[],"120202000120"],
    [4,"44443d7d2d552911","81423dbd27aa2318",[5,7],[5,7],[],[],"1122000010001022"],
    [5,"2c6802b96802ab8","466102d96408ab2",[7,13],[7,13],[],[],"100101000202002"],
    [4,"04686d7c15112ba8","02313e7c85111ba2",[7,9],[9,7],[],[],"0102000010221001"],
    [5,"2ea842bea92a9682aa90","2d5841beac8533815ac0",[7,17],[7,17],[],[],"10011100001000220000"],
    [4,"2c406d7c11552ed50111","2c409d7984aa1dda0411",[1,14],[1,14],[],[],"10200000110020000222"],
    [5,"0446843d547ed7911138","048c149da17ddd618131",[7,18],[7,18],[],[],"01102100020000011102"],
    [5,"046806b9443eab903a80","046106d981375e306a10",[7],[7],[],[],"01010000110000000010"],
    [4,"00442eb92d6847b83900","00222ed38ec827b26900",[14],[14],[],[],"00111000100110010000"],
    [5,"2aeac42905502c13eebc29381","2ad5344c0aa04913ebbc46911",[1,15],[1,15],[],[],"1000021000002010000020022"],
    [5,"42e803ebe82d07c01291","827806dbe88e07302862",[13],[13],[],[],"11010000011000001101"],
    [5,"406a856ba83feec6d51511101","406a4a6e526fbec97a2a11404",[6,11],[6],[],[],"1000100001000000001011101"],
    [6,"042ee82d69782d103c03aa81","0217d22ec9b82d2033095581",[13,16],[13,16],[],[],"012002100002102000000012"],
    [5,"0442c47d453953d6ebe911290","014431dd2a365cdceb7348260",[16],[16],[],[],"0111010010000000000011100"],
    [5,"6e8407fad41107902ab8","978407f5d8880e308ab1",[6,17],[17],[6],[],"00110000011100001001"],
    [5,"402ec3eefd2d5556d11513801","801ec3dbfd47a5a6e82543404",[8,9],[9],[8],[],"1010000000100000011010101"],
    [6,"0442e82d7ad42fd0790392b8","0121d88dbad22fb0bc09c2d8",[10,13],[10],[13],[],"011101100001100000000101"],
    [5,"0446c2d7d56d51553fe912910","042691ed7acea1559fe984980",[17,18],[18],[17],[],"0110010000000100000011010"],
    [6,"2eaa802bc2ac2ef86d2b96d102a938","2ea5804d32ac8ef13b4e66e408acc4",[2,14,26],[2,26],[14],[],"100010100200100100100002020002"],
    [5,"440683bc3c2c7ad039416eefc11139","840c23e66c197ae09321ceef9118c3",[13,22,23],[13,22],[23],[],"110010000010000000210000022200"],
    [6,"4442e83d785443d0797812fc3aaab9","8141b43b785426d0bcb844f3955ab3",[6,22,27],[6,27],[22],[],"111202000102200000021200000000"],
    [5,"042e82bafc2e85147c3839380","084718dafc87154173c83c310",[8,9],[9],[],[8,15],"0110110000101010000100010"],
    [6,"686c4052d7d43ad11502b829","616610a1d7d465724a087189",[2],[2],[],[22,6],"010010010001000110010100"],
    [5,"4402c3feed29115042ad2baed28291","480863feb72344504457475ee42491",[6,28],[28],[],[7,26],"110100000010110011001000010101"],
    [6,"2c42e82f92d42d407d297e952a9381","8c42e21f68d247407e46e76a85c384",[7,27],[27],[],[21,1],"101101100101101000100000100011"],
    [6,"4680681782d42faabd43e8693a9038","4980648744724f5abe29b16c356064",[13,15],[15],[],[0,16],"001001101101100000100100000001"],
    [6,"2eaae8292c3c2c452907b9402baeb8282ba8","1e55d1861c69231a2907b9104b5b74424b58",[1,19],[1,19],[],[30,16],"100001102000202000000020200002012002"],
    [6,"02c4406ab95452e83916d4682d3fb8038380","08c4106ad9a1a1d4c926d8914bcfb4032940",[7,20,27],[7,20],[],[10,18],"010110000001020200000202200002002020"],
    [6,"2c42e82d7ad44550153bfaed2ab811","8c21d487d5e24a501537f5e78ad281",[18,20,25],[18,25],[20],[],"102202100001100020000000200211"],
    [6,"44402c3bd4456c3ff91787bc2f83c12b8038","818043c7b24a6c9ffc478d7c1f8cc22b4091",[15,16,23,25,31],[23,31],[16],[],"111010000110000000202000202001202001"],
    [6,"6aac44382bf902e85046bef83b8138","caa341942ef908b8a089bef1671891",[10,11,20,22],[11,20],[10],[],"000021011000020200200002002202"],
    [7,"042c440692fd78784557c3c7939103baa80","0116810398fbb4d88a5ecc979c920c7a580",[10,23,26],[23,26],[10],[],"01102200020002011000000000020000010"],
    [6,"0044446afbb93e92ec2f82d56d2e91112900","00811135f7e3cb617c4f22ea6d2e92141900",[8,19,25,28],[25,28],[8],[],"001111000000000200101200002002112000"],
    [7,"2c686a847bc7a87b81504506efe93853d7c2ab8111","8cc23a887e6e51dd8250250cbfb992a3dd91578482",[8,25,31],[8,31],[25],[],"100100210000020011002000000001000002002222"],
    [6,"2aec402c17b86bc3c412d0792ad4782afd1402bba9","25bc108c2eb23bc63484d0e98574d415f72208d7a6",[3,20,32],[3,20],[32],[],"100010201001000001220000200201200012020000"],
    [6,"0682c02d46fc2d79552d16b92faba8012a80","0648c08b86f68b795a8746761fae54088580",[1,9,10,25],[1,9],[10,25],[7,34],"001200102000100000102000200002011000"],
    [7,"0042c442e96bbd2befe854413f813ba8100","00249242b3ceee2defe8a1446f423da2400",[16,17,25,30],[16,30],[17,25],[11,28],"00120221000000100001022100220002100"],
    [6,"442ea83fabac696805507e813a97e86eafb8138128","141e529f5b5333310a50eb416a9be197afb2192441",[3,7,26,33],[3,26],[7,33],[40,11],"121001000000000200000021000002000002202201"],
    [7,"68444403ed3fb8453afe83b803f82c6c2940393aa9","612228037e6fb81a65fb29d103f22c9916803c3a5c",[7,11,18,25,26],[7,25],[18,26],[36,10],"011222000000021000001001000220001020000000"],
    [6,"4406e8516ffc52d11154786c3d169147afac3ba901","2803d1a46ff9a1d222a4b8636d86c21daf563dac08",[8,9,10,33,36],[36,8],[10,33],[7,23],"110002000000020222010200002001100000000001"],
    [7,"02eac4442b85553ee83fd69506d13ef813c013aa81","04da62184e8aa59e72cfe69503e83ef18360295518",[13,19,21,30],[13,21],[19,30],[5,14],"010000121010000002000000000100022000200022"],
    [7,"042c46843abbbc3eae8416fad6d4512d15512c7ef92a91390","08164c289aee7c9d57842cfadcb2a14b8a5186bdf38a92960",[9,22,34,40],[9,34],[22,40],[12,43],"0110101200000000002210000002022020021000001002000"],
    [7,"6c2868053e878416d2d452fd03d52bf82fd0292a91","6c18940a3e1b4216d478a4fb03ea8df24fe01945c2",[8,22,25,30,33],[8,25],[22,30],[32,2],"000202000010221002020100000010010000102002"],
    [6,"4406a83f85682befb82c17e86fa93c17ee85291101","2406549f4a614e7f724317e1cfa9634dbb85164204",[7,10,15,21,25],[10,21],[15,25],[34,8],"110002000001100001101002000000200000101102"],
    [7,"02aaea86c6efec155155147d053c3fb87c12d4413c0113aa9","0855d513637fd98aa15521ed0a9c3fe4e3127248cc0186553",[11,18,28,29],[18,28],[11,29],[6,37],"0100000000000020020022000000000200220011000210000"],
    [8,"02aea8686eab8454152c43fd2fabfed14782fd78112a9110","045da264375b82a88a4383f74f5bfeb21d18fde888859280",[4,22,25,27,28,36],[4,27],[25,28],[23,32],"010001020000120210202000200000020012000221200220"],
    [7,"6ea84407fa83f851682b87856ee8547fff83d1517801292b8","ce524107fa86f4a468172b2ac7e4a8bfff8c78a8e4044c2e4",[8,9,12,16,31,32,33],[9,16],[8,31,33],[19,0],"0001110000100101021010100002010000200202020120202"],
    [8,"2eec04686d13ef941142fd2d043abbc147c6e8543ff97c7d29129111","2be90261378cbf922814fb4e01c5ebc887c9b2a16ff3b67e89113214",[13,20,30,34,41,42],[30,34],[13,20,42],[23,9],"10000101001000011111001002000001200002010000000020220211"],
    [8,"2ac444446abbfd791682d7946bc2b92d7efc04695157853812ffafa82a912ba8","2a92421835e7f7b64c88e7983e31ec17dbf90463a4ae1a3414ff5f511ac18ea1",[1,12,34,38,50,51,53],[1,38],[12,34,50],[47,17],"1001111100000000102100020001002000000200020020002200000220022002"]
  ];
  const titles = [
    ["苔灯初明","The Mosslight"],["萤火传信","Firefly Post"],["晨露支流","Dew Fork"],["蕨叶回廊","Fern Arcade"],["石根下的灯","Under the Roots"],["林间六点星","Clearing Stars"],["沉睡的日晷","Sleeping Sundial"],
    ["日与月","Sun and Moon"],["贝壳双生","The Shell Twins"],["退潮的码头","The Ebb-Tide Pier"],["咸风灯塔","Saltwind Beacon"],["潮池两岸","Across the Tidepool"],["月螺之歌","Moon-Shell Song"],["潮汐天平","Tidal Balance"],
    ["断桥边的铃","Broken Bell Bridge"],["山壁留白","A Rift in Stone"],["双翼风标","Twin Vanes"],["悬钟窄径","Hanging Chimes"],["云中的缺口","Cloud Window"],["峡口的回声","Canyon Echo"],["静风钟楼","The Silent Belfry"],
    ["桥上与桥下","Over and Under"],["紫晶横梁","Violet Crossbeam"],["钟乳石林","Dripstone Grove"],["水晶缝隙","Crystal Seam"],["相遇的光","Passing Lights"],["地心镜室","Deep Mirror"],["折光大殿","Hall of Refraction"],
    ["两扇兰花门","The Orchid Gates"],["藤蔓捷径","Vine Shortcut"],["飞蛾密径","Secret Mothway"],["空中花房","Canopy House"],["花粉星环","Pollen Halo"],["双生花丛","Twin Blossoms"],["无声迁徙","Silent Migration"],
    ["余火分流","Ember Fork"],["黑曜石桥","Obsidian Crossing"],["炭炉星眼","The Furnace Eye"],["铜工的轮轴","Copper Axle"],["炉心之月","The Forge Moon"],["群星炼炉","Star Kiln"],["山腹之光","Heart of the Mountain"],
    ["极光的折痕","Aurora Fold"],["冻泉双门","Frozen Spring Gates"],["银枝纺车","Silver Spindle"],["冰镜走廊","Winter Mirror"],["夜色尽头","The Far Night"],["北辰之轮","Pole-Star Wheel"],["天幕织机","Sky Loom"],
    ["坠星罗盘","Starfall Compass"],["星冠双弧","Twin Arcs"],["天体仪","The Orrery"],["守望者的镜室","The Keeper’s Lens"],["王冠的缺口","Crown Notch"],["长夜最后一盏灯","Last Light of Night"],["群星归位","The Stars Align"]
  ];
  const north = 0, east = 1, south = 2, west = 3;
  const deltas = [[0,-1],[1,0],[0,1],[-1,0]];
  const terminals = [[50,0],[100,50],[50,100],[0,50]];
  const bit = (m,d) => (m >> d) & 1;
  const rotate = m => ((m << 1) & 15) | (m >> 3);
  const packed = a => a.map(v => v.toString(16)).join("");
  const unpack = s => Array.from(s, c => parseInt(c,16));
  function orientations(m) { return [...new Set([m,rotate(m),rotate(rotate(m)),rotate(rotate(rotate(m)))])]; }
  function readChart(i) {
    const [width, encoded, opening, pins, sources, crossings, gates, receivers] = charts[i];
    const solved = unpack(encoded), height = solved.length / width, size = solved.length;
    const around = solved.map((m,p) => deltas.map(([dx,dy]) => {
      const x = p % width + dx, y = Math.floor(p / width) + dy, next = y * width + x;
      return x >= 0 && y >= 0 && x < width && y < height && solved[next] ? next : -1;
    }));
    return {width,height,size,solved,initial:unpack(opening),locked:new Set(pins),sources,
      crossings:new Set(crossings), gates, receivers:[...receivers].map(Number), around};
  }
  function inspect(level, masks) {
    const {size, crossings, gates, sources, receivers, around} = level;
    const graph = Array.from({length:size*2}, () => []);
    const lane = (p,d) => crossings.has(p) && d % 2 ? p + size : p;
    const link = (a,b) => { graph[a].push(b); graph[b].push(a); };
    if (gates.length) link(...gates);
    let loose = 0;
    masks.forEach((m,p) => {
      for (let d=0;d<4;d++) {
        if (!bit(m,d)) continue;
        const next = around[p][d];
        if (next < 0 || !bit(masks[next],(d+2)%4)) { loose++; continue; }
        if (d === east || d === south) link(lane(p,d), lane(next,d));
      }
    });
    const light = Array(size*2).fill(0);
    sources.forEach((p,sourceIndex) => {
      const color = 1 << sourceIndex, queue = [p]; light[p] |= color;
      for (let j=0;j<queue.length;j++) for (const q of graph[queue[j]]) {
        if (!(light[q] & color)) { light[q] |= color; queue.push(q); }
      }
    });
    const lamps = receivers.filter(Boolean).length;
    const lit = receivers.filter((c,p) => c && c === light[p]).length;
    const mixed = light.includes(3);
    const complete = !loose && !mixed && lit === lamps &&
      masks.every((m,p) => !m || light[p] && (!crossings.has(p) || light[p+size]));
    return {light,loose,lit,lamps,mixed,complete};
  }
  /* Propagate matched openings from edges, fixed optics and adjoining tiles.
     Keep the first round each orientation becomes forced for graduated hints. */
  function deduce(level) {
    const {solved,around,locked} = level;
    let domains = solved.map((m,p) => locked.has(p) ? [m] : orientations(m));
    const clues = solved.map(() => ({rank:1000, edge:[], neighbor:-1}));
    solved.forEach((m,p) => {
      if (!m || locked.has(p)) return;
      const edge = around[p].flatMap((q,d) => q < 0 ? [d] : []);
      domains[p] = domains[p].filter(v => edge.every(d => !bit(v,d)));
      if (domains[p].length === 1) clues[p] = {rank:0, edge, neighbor:-1};
    });
    for (let round=1;round<=solved.length;round++) {
      let changed = false;
      const next = domains.map((domain,p) => {
        if (domain.length === 1) return domain;
        let candidates = domain;
        for (let d=0;d<4;d++) {
          const q = around[p][d];
          if (q < 0) continue;
          const survivors = candidates.filter(m => domains[q].some(other => bit(m,d) === bit(other,(d+2)%4)));
          if (survivors.length === candidates.length) continue;
          changed = true; candidates = survivors;
          if (candidates.length === 1) { clues[p] = {rank:round, edge:[], neighbor:d}; break; }
        }
        return candidates;
      });
      domains = next;
      if (!changed) break;
    }
    return clues;
  }
  function pipeGroup(path,color) {
    return '<g class="sfp-pipe sfp-color-'+color+'" fill="none" stroke-linecap="round" stroke-linejoin="round">'+
      ['bezel','housing','halo','glass','core'].map(name => '<path class="sfp-'+name+'" d="'+path+'"/>').join("")+'</g>';
  }
  function route(mask) {
    const dirs = [north,east,south,west].filter(d => bit(mask,d));
    if (dirs.length === 2 && (dirs[0]+2)%4 !== dirs[1]) {
      const [a,b] = dirs.map(d => terminals[d]);
      const near = point => point.map(v => 50+(v-50)*0.3).join(" ");
      return 'M'+a.join(" ")+' L'+near(a)+' Q50 50 '+near(b)+' L'+b.join(" ");
    }
    return dirs.map(d => 'M50 50 L'+terminals[d].join(" ")).join(" ");
  }
  function gem(c, source, active) {
    const rim = c === 1 ? '#e7b96e' : '#a5dbed', interior = c === 1 ? '#79522a' : '#295b72';
    if (source) {
      const disk = '<circle cx="50" cy="50" r="19" fill="#15262a" stroke="'+rim+'" stroke-width="2.2"/>';
      const mark = c === 1
        ? '<g fill="none" stroke="'+rim+'" stroke-width="2.5"><circle cx="50" cy="50" r="6"/><path d="M50 36v4m0 20v4m-14-14h4m20 0h4m-24-10 3 3m14 14 3 3m0-20-3 3m-14 14-3 3"/></g>'
        : '<path d="M56 39a12 12 0 1 0 4 17 11 11 0 0 1-4-17Z" fill="'+rim+'"/>';
      return disk+mark;
    }
    if (c === 1) return '<path d="M50 34 66 50 50 66 34 50Z" fill="'+interior+'" stroke="'+rim+'" stroke-width="2.2"/><path d="m50 41 8 9-8 9-8-9Z" fill="'+(active?'#ffe2a3':'#453d31')+'"/><path d="m50 35 0 6m15 9h-7m-8 15v-6m-15-9h7" stroke="'+rim+'" opacity=".65"/>';
    return '<circle cx="50" cy="50" r="15" fill="'+interior+'" stroke="'+rim+'" stroke-width="2.2"/><path d="M53 41a9 9 0 1 0 5 13 8 8 0 0 1-5-13Z" fill="'+(active?'#d9f6ff':'#7396a5')+'"/>';
  }
  function tileArt(level,p,mask,light) {
    const src = level.sources.indexOf(p), lamp = level.receivers[p];
    let glass, optic = "";
    if (level.crossings.has(p)) {
      glass = pipeGroup('M50 0V100',light[p])+pipeGroup('M0 50H27C36 50 37 39 46 39H54C63 39 64 50 73 50H100',light[p+level.size]);
    } else { glass = pipeGroup(route(mask),light[p]); }
    if (src >= 0) optic = gem(src+1,true,true);
    else if (lamp) optic = gem(lamp,false,lamp === light[p]);
    else if (level.gates.includes(p)) optic = '<path d="m50 33 15 8v18l-15 8-15-8V41Z" stroke="#d6b8ee" fill="#302840" stroke-width="2.3"/><path d="m41 49 7-5v10l-7 5m11-10 7-5v10l-7 5" fill="none" stroke="#e6d9fc" stroke-width="2.5"/>';
    else if (!level.crossings.has(p) && (mask===15 || [7,11,13,14].includes(mask))) optic = '<circle cx="50" cy="50" r="4" fill="#dad3b5" opacity=".8"/>';
    const rivet = level.locked.has(p) ? '<g fill="#baaa85" opacity=".72"><circle cx="11" cy="11" r="2.2"/><circle cx="89" cy="89" r="2.2"/></g>' : "";
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g class="sfp-turn">'+glass+'</g>'+optic+rivet+'</svg>';
  }
  function mount(host,{index=0,lang="en",saved,onSave=()=>{},onWin=()=>{},sound=()=>{}}={}) {
    const zh = lang === "zh", t = (cn,en) => zh ? cn : en;
    index = Number.isInteger(index) && index >= 0 && index < charts.length ? index : 0;
    const level = readChart(index), clues = deduce(level), dirs = zh ? ["北","东","南","西"] : ["north","east","south","west"];
    const coord = p => t("第"+(Math.floor(p/level.width)+1)+"行第"+(p%level.width+1)+"格","row "+(Math.floor(p/level.width)+1)+", column "+(p%level.width+1));
    const ports = m => [0,1,2,3].filter(d => bit(m,d)).map(d => dirs[d]).join(zh ? "、" : ", ");
    const allowed = level.solved.map(orientations);
    const isSaved = s => typeof s === "string" && /^[0-9a-f]+$/.test(s) && s.length === level.size &&
      unpack(s).every((v,p) => allowed[p].includes(v) && (!level.locked.has(p) || v === level.solved[p]));
    const valid = saved && saved.v === 1 && saved.index === index && isSaved(saved.board) && Number.isSafeInteger(saved.moves) && saved.moves >= 0;
    let masks = valid ? unpack(saved.board) : level.initial.slice(), moves = valid ? saved.moves : 0;
    let history = valid && Array.isArray(saved.history) ? saved.history.filter(h=> Array.isArray(h) && isSaved(h[0]) && Number.isSafeInteger(h[1]) && h[1]>=0).slice(-100) : [];
    let hint = -1, reverse = false, retired = false, focus = masks.findIndex((m,p) => m && !level.locked.has(p));
    let view = inspect(level,masks), ended = false;
    const root = document.createElement("section");
    root.className = "sfp";
    root.innerHTML = '<div class="sfp-head"><div class="sfp-insignia" aria-hidden="true">✧</div><div class="sfp-caption"><h3></h3><p></p></div><button type="button" class="sfp-help" data-action="help" aria-expanded="false">?</button></div><div class="sfp-guide" hidden></div><div class="sfp-instrument"><div class="sfp-ruler"><span class="sfp-count"></span><span class="sfp-turns"></span></div><div class="sfp-map"><div class="sfp-board"></div></div><div class="sfp-status" aria-live="polite"></div></div><div class="sfp-actions"></div><div class="sfp-hint" aria-live="polite" hidden></div>';
    host.replaceChildren(root);
    const get = s => root.querySelector(s), board = get(".sfp-board"), status = get(".sfp-status"), help = get(".sfp-help"), guide = get(".sfp-guide"), advice = get(".sfp-hint");
    get("h3").textContent = titles[index][zh?0:1];
    const rules = level.sources.length===2 ? t("让太阳与月亮各自点亮同色灯。两路光不能相连。","Light each lamp with its own sun or moon. Keep the two currents apart.") : t("转动镜片，把阳光送到每盏灯，接好所有光路。","Turn the lenses to light every lamp and join every open end.");
    const special = [
      level.crossings.size && t("拱桥的横路和直路各走各的。","At a bridge, horizontal and vertical light travel separately."),
      level.gates.length && t("两枚紫色跃迁门可以隔空传光。","Light jumps between the two violet gates.")
    ].filter(Boolean);
    get(".sfp-caption p").textContent = rules;
    help.setAttribute("aria-label",t("镜阵说明","Lens guide"));
    const guideText = [t("点一下顺时针转动。铜钉固定的镜片不能转。所有接头都要对齐，整座镜阵都要通光。","Tap a tile for a clockwise turn. Brass rivets mark fixed tiles. Match every open end and power the whole array."),...special,
      t("键盘可用方向键选格、空格转动、Shift 加空格反转、Z 撤销。","Use arrows to select a tile, Space to turn, Shift + Space to reverse, and Z to undo.")];
    guideText.forEach(s=>{ const a=document.createElement("p");a.textContent=s;guide.append(a); });
    board.setAttribute("role","group"); board.setAttribute("aria-label",t("棱镜光路镜阵","Prism circuit lens board"));
    board.style.setProperty("--sfp-cols",level.width); root.style.setProperty("--sfp-w",level.width);
    const tileNodes = masks.map((m,p) => {
      const el = document.createElement(m ? "button" : "span");
      if (m) {
        el.type="button"; el.className="sfp-cell"; el.dataset.cell=p; el.tabIndex = p===focus ? 0 : -1;
        if (level.locked.has(p)) el.classList.add("sfp-fixed");
      } else { el.className="sfp-hole"; el.setAttribute("aria-hidden","true"); }
      board.append(el); return el;
    });
    const actionBar=get(".sfp-actions");
    const buttons={};
    function addAction(id,icon,label) {
      const el=document.createElement("button"); el.type="button";el.dataset.action=id;el.className="sfp-action";
      const symbol=document.createElement("span"); symbol.className="sfp-symbol";symbol.setAttribute("aria-hidden","true");symbol.textContent=icon;
      const text=document.createElement("span");text.textContent=label;el.append(symbol,text);actionBar.append(el);buttons[id]=el;
    }
    addAction("undo","↶",t("撤销","Undo")); addAction("reverse","↺",t("反向转","Reverse"));buttons.reverse.setAttribute("aria-pressed","false");
    addAction("hint","✧",t("线索","Hint")); addAction("reset","⟲",t("复原","Restart"));
    function save() { onSave({v:1,index,board:packed(masks),moves,history}); }
    function remember() { history=history.concat([[packed(masks),moves]]).slice(-100); }
    function clearHint() {
      if (hint >= 0) tileNodes[hint].classList.remove("sfp-marked");
      hint=-1;advice.hidden=true;advice.replaceChildren();
    }
    function select(p,keyboard=false) {
      if (focus>=0) tileNodes[focus].tabIndex=-1;
      focus=p;tileNodes[p].tabIndex=0;
      if (keyboard) tileNodes[p].focus();
    }
    function draw() {
      view=inspect(level,masks);
      masks.forEach((m,p) => {
        if(!m)return;
        const el=tileNodes[p], light=view.light[p], src=level.sources.indexOf(p), lamp=level.receivers[p];
        const tag=src>=0 ? t(src===0?"太阳光源":"月亮光源",src===0?"Sun source":"Moon source") : lamp ? t(lamp===1?"太阳灯":"月亮灯",lamp===1?"Sun lamp":"Moon lamp") :
          level.gates.includes(p) ? t("跃迁门","Gate") : level.crossings.has(p) ? t("拱桥","Bridge") : t("镜片","Lens");
        const shown=[m,light,level.crossings.has(p)?view.light[p+level.size]:0].join("/");
        if (el.dataset.paint!==shown) {
          el.innerHTML=tileArt(level,p,m,view.light);el.dataset.paint=shown;
          el.setAttribute("aria-label",[coord(p),tag,ports(m), light===0?t("未亮","dark"):light===3?t("混光","mixed light"):t("已亮","lit"),level.locked.has(p)?t("固定","fixed"):""].filter(Boolean).join(" · "));
        }
      });
      get(".sfp-count").textContent=t("点灯 "+view.lit+" / "+view.lamps,view.lit+" / "+view.lamps+" lamps");
      get(".sfp-turns").textContent=t(moves+" 转",moves+" turns");
      buttons.undo.disabled=history.length===0;
      buttons.reset.disabled=packed(masks)===packed(level.initial) && moves===0;
      status.classList.toggle("sfp-mixed",view.mixed);
      status.textContent=view.complete ? t("全部光路已接通。","Every channel is alight.") :
        view.mixed ? t("两种光混在一起了。沿紫色光路找找交汇点。","The currents have mixed. Trace the violet light to find the join.") :
        view.lit===view.lamps ? t("灯都亮了。再找找断开的接头和未亮的镜片。","Every lamp is lit. Check for loose ends and dark tiles.") :
        special.length ? special.join(" ") : index===0 ? t("试着先转动左上角的菱形灯，让它朝向旁边的镜片。","Start with the diamond lamp at the top left. Turn it towards the lens beside it.") :
        t("镜片边缘的接头必须两两相接。","Match the openings on both sides of every seam.");
    }
    function update() {
      draw();save();
      if (view.complete && !ended && !retired) { ended=true;sound("success");onWin({moves}); }
    }
    function turn(p,reverseTurn=false,to=-1) {
      if (ended || p<0 || !masks[p] || level.locked.has(p)) return;
      clearHint();remember();let m=rotate(masks[p]);
      if (reverseTurn) m=rotate(rotate(m));
      if (to>=0) {
        const clockwise=orientations(masks[p]).indexOf(to);
        moves+=clockwise===2?2:1;m=to;
      } else { moves++; }
      masks[p]=m; sound("move"); update();
      if (retired || ended || to>=0 || (typeof matchMedia==="function" && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
      tileNodes[p].querySelector(".sfp-turn")?.animate?.([{transform:"rotate("+(reverseTurn?90:-90)+"deg)"},{transform:"rotate(0deg)"}],{duration:120,easing:"ease-out"});
    }
    function showHint() {
      clearHint();
      const choices=masks.map((m,p)=>m!==level.solved[p]?p:-1).filter(p=>p>=0).sort((a,b)=>clues[a].rank-clues[b].rank);
      if (!choices.length) return;
      hint=choices[0]; const {edge,neighbor}=clues[hint],location=coord(hint);
      const note=document.createElement("span");
      if(edge.length) note.textContent=t(location+"靠近空处，接头不能朝"+edge.map(d=>dirs[d]).join("、")+"。","Look at "+location+". Its openings cannot point "+edge.map(d=>dirs[d]).join(" or ")+" into empty space.");
      else if(neighbor>=0) {
        const required=bit(level.solved[hint],neighbor),dir=dirs[neighbor];
        note.textContent=t("观察"+location+"的"+dir+"边。相邻镜片"+(required?"需要一个接头伸过来。":"的这条边必须封住。"),
          "Check the "+dir+" side of "+location+". The adjacent lens "+(required?"needs a connection here.":"must have a closed edge here."));
      } else note.textContent=t("从"+location+"沿分支向外追光。试一试哪种朝向能让每条支路都通往自己的光源。","Trace the branches from "+location+". Which orientation lets each branch reach its own source?");
      const assist=document.createElement("button");assist.type="button";assist.dataset.action="align";assist.textContent=t("帮我对齐这格","Align this tile");
      advice.replaceChildren(note,assist);advice.hidden=false;tileNodes[hint].classList.add("sfp-marked");sound("tap");
    }
    function action(id) {
      switch(id) {
        case "help": guide.hidden=!guide.hidden;help.setAttribute("aria-expanded",String(!guide.hidden));break;
        case "undo": if (!ended && history.length) { const prev=history.at(-1);history=history.slice(0,-1);masks=unpack(prev[0]);moves=prev[1];clearHint();sound("tap");update(); } break;
        case "reverse": reverse=!reverse;buttons.reverse.setAttribute("aria-pressed",String(reverse));sound("tap");break;
        case "reset": if (!ended && !buttons.reset.disabled){remember();masks=level.initial.slice();moves=0;clearHint();sound("tap");update();}break;
        case "hint": if (!ended)showHint();break;
        case "align": if(hint>=0&&!ended){const p=hint;select(p);turn(p,false,level.solved[p]);}break;
      }
    }
    function click(e) {
      const button=e.target.closest("button");if (!button || !root.contains(button)) return;
      if (button.dataset.cell!=null) {const p=Number(button.dataset.cell);select(p);turn(p,reverse);}
      else action(button.dataset.action);
    }
    function context(e) {
      const cell=e.target.closest(".sfp-cell");if (!cell) return;
      e.preventDefault();const p=Number(cell.dataset.cell);select(p);turn(p,true);
    }
    function keyboard(e) {
      if (e.ctrlKey||e.altKey||e.metaKey||!board.contains(e.target))return;
      const d=["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"].indexOf(e.key);
      if (d>=0) {
        e.preventDefault();let x=focus%level.width,y=Math.floor(focus/level.width);
        while(true) { x+=deltas[d][0];y+=deltas[d][1]; if(x<0||y<0||x>=level.width||y>=level.height)break; const next=y*level.width+x;if(masks[next]){select(next,true);break;} }
      } else if (e.key===" " || e.key==="Enter") {e.preventDefault();if(!e.repeat)turn(focus,e.shiftKey||reverse);}
      else if (e.key.toLowerCase()==="z") {e.preventDefault();action("undo");}
    }
    root.addEventListener("click",click);root.addEventListener("contextmenu",context);root.addEventListener("keydown",keyboard);
    draw();
    if (view.complete) queueMicrotask(()=>{if(!retired&&!ended){ended=true;onWin({moves});}});
    return () => {retired=true;root.removeEventListener("click",click);root.removeEventListener("contextmenu",context);root.removeEventListener("keydown",keyboard);root.remove();};
  }
  const modes=window.StarfallModes=window.StarfallModes||{};
  modes.prism={count:charts.length,mount,getTitle(index,lang){return titles[index]?.[lang==="zh"?0:1];}};
})();
