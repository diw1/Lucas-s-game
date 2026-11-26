(function () {
  'use strict';
  // Maps use x for a wall and . for a traversable tile. Rune 0 is the common grove rune.
  const stages = [
    [["xxxxxxxx","xxx...xx","x.....xx","x.....xx","xxx...xx","xxxxxxxx"],26,[[27,0]],[[29,0]],[],"11"],
    [["xxxxxxxx","x......x","xxx.x..x","x......x","x.x.x.xx","x......x","xxxxxxxx"],30,[[29,0]],[[42,0]],[],"33100332220112233"],
    [["xxxxxxx","x.....x","x.x..xx","x.x...x","x.....x","xxxxxxx"],26,[[18,0],[25,0]],[[26,0],[30,0]],[],"32333000111232123"],
    [["xxxxxxxx","x......x","x......x","x...x..x","xx.....x","x..x...x","xxxxxxxx"],42,[[34,0],[35,0]],[[25,0],[44,0]],[],"01031212110032123"],
    [["xxxxxxx","x.xxxxx","x..x..x","x.....x","x.....x","xxxxxxx"],8,[[25,0],[15,0]],[[29,0],[8,0]],[],"21212110032123033230111233030"],
    [["xxxxxxxx","xx..xx.x","x....x.x","x.x..x.x","x......x","x.....xx","xxxxxxxx"],38,[[34,0],[37,0]],[[45,0],[20,0]],[],"3233330121002330011212321"],
    [["xxxxxxx","x.x...x","x.....x","x..x..x","x.....x","xxxxxxx"],15,[[23,0],[16,0]],[[25,0],[12,0]],[],"113322103012211002233001012"],
    [["xxxxxxx","x....xx","x.x..xx","x.....x","x.....x","xxxxxxx"],25,[[24,0],[18,0]],[[15,0],[9,0]],[],"23033001112033322110103222110333230"],
    [["xxxxxxxx","x..xx.xx","x.....xx","x......x","x...x..x","x.....xx","xxxxxxxx"],13,[[34,0],[21,0]],[[20,0],[9,0]],[],"2323223001032301122211010330332210301"],
    [["xxxxxxx","x.....x","x.....x","x.....x","x.....x","x.x.x.x","xx...xx","xxxxxxx"],45,[[38,0],[17,0]],[[8,0],[12,0]],[],"003012100233001122301033"],
    [["xxxxxxxx","x..x...x","x....x.x","x...x..x","x......x","xx.....x","xxxxxxxx"],43,[[35,0],[34,0]],[[30,0],[29,0]],[],"0110100332332321113300123212110233011210"],
    [["xxxxxxx","x....xx","xx..x.x","x...x.x","x.....x","x.....x","xxxxxxx"],9,[[33,0],[17,0],[16,0]],[[19,0],[26,0],[36,0]],[],"1223221110022333011210330003222123"],
    [["xxxxxxxx","xx....xx","x..x..xx","x..x...x","x....xxx","x.....xx","x......x","xxxxxxxx"],30,[[34,0],[18,0],[29,0]],[[28,0],[49,0],[45,0]],[],"3003332322130012221230000011222000332221210"],
    [["xxxxxxxxx","x...x..xx","x..x..x.x","x...x...x","x.......x","xx......x","xxxxxxxxx"],14,[[39,0],[23,0],[20,0]],[[34,0],[52,0],[19,0]],[],"2212233330030012322121101233301121110033232110301233303230"],
    [["xxxxxxxx","x.x....x","x......x","x....x.x","x.x....x","x.....xx","xxxxxxxx"],20,[[36,1],[19,0],[37,0]],[[43,1],[28,0],[42,0]],[],"0322332211102333001121230001220011223230"],
    [["xxxxxxxxx","x..x..xxx","x..x....x","x......xx","x...x..xx","x.......x","xxxxxxxxx"],25,[[24,1],[31,0],[33,0]],[[32,1],[50,0],[51,0]],[],"322033001232323300123210123211"],
    [["xxxxxxxx","xx.....x","x......x","xx.x...x","x..x...x","x......x","xx.....x","xxxxxxxx"],17,[[37,1],[42,0],[18,0]],[[13,1],[38,0],[29,0]],[],"10112222100030332223211121030100303321121100323301"],
    [["xxxxxxxxx","xx..x...x","x....x..x","x....x..x","x.......x","x..x....x","xxxxxxxxx"],43,[[33,1],[38,0],[42,0]],[[22,1],[21,0],[20,0]],[],"23303033322100301211212110331100321223303121103323002303322100"],
    [["xxxxxxxx","xx....xx","xx.x..xx","x..x...x","x......x","x......x","xxxxxxxx"],10,[[18,1],[20,0],[21,0]],[[20,1],[18,0],[29,0]],[],"223211300011203322211210333000112200332221211010323023233001001112033322322100"],
    [["xxxxxxxxx","x.x.....x","x.....x.x","x..xx...x","x.......x","x...xx..x","x.x.....x","xxxxxxxxx"],42,[[38,1],[21,0],[41,0]],[[19,1],[58,0],[29,0]],[],"223330301221110031223330033001133221021221110003003323110120112223333111010033221222333001101221233100333230"],
    [["xxxxxxxx","x.xx...x","x..x...x","x......x","x......x","x.x....x","xxxxxxxx"],33,[[21,1],[26,0],[34,0]],[[41,1],[30,0],[14,0]],[],"011211010032212323300133321011011223003012222330211033303201111"],
    [["xxxxxxxxx","xxx.x..xx","x......xx","x..x.x..x","x...x...x","x.......x","xxxxxxxxx"],15,[[23,1],[24,0],[29,0]],[[52,1],[50,0],[46,0]],[[21,1],[33,2]],"2212233330330011113332322111111003232333300011110122122310030333322123000111121223301012030333322121"],
    [["xxxxxxxx","xx.x...x","x...x..x","x.x....x","x......x","x...x..x","xxxxxxxx"],43,[[29,1],[35,0],[42,0]],[[22,1],[12,0],[43,0]],[[30,0]],"010121023333300112033221110112230333321011110300123223301210010322210"],
    [["xxxxxxxxx","x...x...x","x......xx","xx....x.x","x.......x","xxx..x..x","x...x...x","xxxxxxxxx"],57,[[31,1],[51,0],[48,0]],[[38,1],[30,0],[37,0]],[[39,1]],"0101030332212100121122301033003303220112322101032331100332"],
    [["xxxxxxxx","xx.....x","x.x....x","x......x","x..xx..x","x..x...x","xxxxxxxx"],25,[[34,1],[26,0],[29,0]],[[20,1],[44,0],[37,0]],[[21,3]],"11011221230003321333221030110111223010033232100112312230100332011230332213001122"],
    [["xxxxxxxxx","x....x..x","x.xx....x","xx...x..x","x.......x","x.......x","xxxxxxxxx"],13,[[42,1],[22,0],[23,0]],[[47,1],[37,0],[29,0]],[[30,3]],"22322111100321233331103330110132211010032212333230103"],
    [["xxxxxxxx","x......x","x.....xx","x...xx.x","xx.....x","x......x","x......x","xxxxxxxx"],27,[[45,1],[19,0],[35,0],[26,0]],[[12,1],[21,0],[27,0],[20,0]],[[11,1]],"21221010322333000300112033211133221030122322100211033230003011"],
    [["xxxxxxxxx","x.......x","x..x....x","x...x...x","x.......x","xx......x","xxxxxxxxx"],11,[[38,1],[20,0],[33,0],[32,0]],[[16,1],[19,0],[11,0],[49,0]],[[28,0]],"11122003333222112111003003332322110323010011122101032232003033221211011223003012103033311122223"],
    [["xxxxxxxxx","x.x.....x","x.....x.x","x.......x","x.......x","x..x..x.x","x.......x","xxxxxxxxx"],56,[[20,1],[23,0],[47,0],[49,0]],[[57,1],[15,0],[59,0],[61,0]],[[60,1]],"300001211103032200112233322001123032322111113003203332211100332321"],
    [["xxxxxxxxxx","x........x","x....x...x","x......xxx","x........x","x.x......x","x....xx..x","x.....x..x","xxxxxxxxxx"],28,[[53,1],[17,0],[32,0],[27,0]],[[12,1],[18,0],[17,0],[43,0]],[[64,0],[33,0]],"033222233230000103232321011110011230322330011123232210002330011"],
    [["xxxxxxxxx","x.xxx...x","x.......x","x.x.....x","x...x...x","x.......x","x...x.x.x","xxxxxxxxx"],22,[[23,1],[33,0],[42,0],[21,0]],[[46,1],[37,0],[50,0],[25,0]],[[51,3]],"212211000033222001122233333010111322110032123300332330011121223323010310111003222"],
    [["xxxxxxxxxx","x........x","x..x..xxxx","x..x.....x","x........x","x........x","x.xx.....x","xxxxxxxxxx"],47,[[42,1],[22,0],[46,0],[35,0]],[[18,1],[14,0],[15,0],[53,0]],[[24,2],[43,1]],"0323233330111330030122211212110333001322100030111332223330001322211111032300"],
    [["xxxxxxxxx","x.....x.x","x.....x.x","xx......x","xxx.....x","x....x..x","x..x....x","x......xx","xxxxxxxxx"],16,[[33,1],[56,0],[42,0],[25,0]],[[10,1],[40,0],[11,0],[43,0]],[[39,0],[34,2]],"22332300103331122222233030113221100000103311221123312210"],
    [["xxxxxxxxxx","x..x.....x","xx...x...x","x........x","x........x","x..x.....x","x..x.....x","xxxxxxxxxx"],12,[[36,1],[52,0],[45,0],[22,0]],[[51,1],[27,0],[54,0],[68,0]],[[41,2]],"2110112233233322103011011201123223301211000333201123123211000333323301011212333032011111210"],
    [["xxxxxxxxx","x.....x.x","x..x....x","x....x..x","x.xx....x","x.....x.x","x.......x","xxxxxxxxx"],22,[[33,1],[30,0],[20,0],[23,0]],[[12,1],[55,0],[31,0],[43,0]],[[52,0],[29,3]],"033322113300120112233032221111011003311223010322323333001112122330121030113303300112233322111101003033322110103121223230"],
    [["xxxxxxxxx","x.......x","x.x.....x","x.......x","x.......x","xxx...x.x","x...xx..x","xxxxxxxxx"],57,[[32,1],[29,2],[30,0],[48,0]],[[49,1],[38,2],[14,0],[11,0]],[[41,0],[21,2]],"0100003332221121000112303320033221211330300112120303322121211010033220032123110100332210303"],
    [["xxxxxxxxxx","xx...x...x","xx.......x","x........x","x..x.....x","x........x","xxx......x","x...x....x","xxxxxxxxxx"],73,[[44,1],[63,2],[22,0],[37,0]],[[67,1],[28,2],[33,0],[66,0]],[[53,1],[45,0]],"010100322003322121113300030111133303321122233030101111122123032"],
    [["xxxxxxxxx","x.......x","x..x....x","x......xx","x..x.x..x","x....x..x","x...x...x","xxxxxxxxx"],33,[[42,1],[47,2],[32,0],[24,0]],[[40,1],[19,2],[28,0],[15,0]],[[30,3],[48,3]],"31030333222322110323000100111223331101110331222122300030011230321230323300111"],
    [["xxxxxxxxxx","x........x","xx.......x","x....x...x","x.....x..x","xx.xx....x","x........x","xxxxxxxxxx"],11,[[22,1],[37,2],[23,0],[12,0]],[[18,1],[64,2],[56,0],[13,0]],[[25,1],[47,2]],"12112233301210101323301212121101003222123330110000332121223303030110111223303011222123"],
    [["xxxxxxxxx","x.......x","x.....x.x","x...x...x","x.......x","xx......x","x..x....x","xx......x","xxxxxxxxx"],38,[[41,1],[29,2],[51,0],[58,0]],[[22,1],[13,2],[21,0],[10,0]],[[56,0],[12,3],[40,3]],"100112123323011221030333030111332210301221100211003311222333230021122230010332301032300"],
    [["xxxxxxxxxx","x..x.....x","x........x","x.x...x..x","x........x","x........x","x....xxx.x","xxxxxxxxxx"],48,[[44,1],[35,2],[47,0],[37,0]],[[58,1],[38,2],[31,0],[21,0]],[[41,0],[55,3],[28,2]],"2330303010111222323300011012333222110310223333000101111233333312221102330111303001112223210003323303032112110333"],
    [["xxxxxxxxx","x.....x.x","x.......x","x....x..x","x...xx..x","x.......x","x.xx....x","xxxxxxxxx"],11,[[21,1],[47,2],[24,0],[20,0]],[[51,1],[33,2],[12,0],[43,0]],[[52,0],[49,1]],"1223232111121001003303322101032233300122232111330012001111222233301211000033323232100011112222330101003332322112110"],
    [["xxxxxxxxx","x.x..xx.x","x.......x","x..x.x..x","x.......x","x.....x.x","x.......x","xxxxxxxxx"],21,[[29,1],[22,2],[33,0],[20,0]],[[38,1],[10,2],[48,0],[55,0]],[[24,3],[39,1],[42,3]],"122111003212312233030333001201012332322111121100003333323011122001122323101003322212333"],
    [["xxxxxxxxxx","x..x.....x","x........x","x..xx..x.x","x......x.x","x....x...x","x.x.....xx","x.x......x","xxxxxxxxxx"],65,[[35,1],[66,2],[53,0],[32,0]],[[27,1],[25,2],[51,0],[58,0]],[[67,0],[45,1]],"30033300120111122212230000221100003332333232211012321112103012333033300121230001112033322111322110030001123033233221111023333001101212230"],
    [["xxxxxxxxx","x..x....x","x.......x","x....x..x","x......xx","x.......x","xxx.xxx.x","xxxxxxxxx"],57,[[30,1],[21,2],[29,0],[48,0]],[[34,1],[50,2],[51,0],[52,0]],[[25,2],[49,1]],"030300113322121101100033222003332211023300111110123333332112113300123210011220033221213033210001122"],
    [["xxxxxxxxxx","x........x","x.......xx","x....xxxxx","xx.x.....x","x........x","x.......xx","xxxxxxxxxx"],48,[[55,1],[47,2],[52,0],[57,0]],[[51,1],[17,2],[33,0],[27,0]],[[12,1],[46,3]],"3323311032300030111233222233021103302110003332122111121010333230022330001111"],
    [["xxxxxxxxx","xx......x","x...x.x.x","x.......x","x...x...x","x....x..x","x.......x","x..xx...x","xxxxxxxxx"],49,[[42,1],[20,2],[48,0],[58,0]],[[29,1],[55,2],[32,0],[12,0]],[[46,2],[51,2]],"30011112230103331003332200111223323122330101011122233300002223322101000033222011223030121033001212230101"],
    [["xxxxxxxxxx","xx.x.....x","x........x","xxx..x...x","x.x....x.x","x........x","x...x....x","xxxxxxxxxx"],21,[[55,1],[22,2],[44,0],[57,0]],[[37,1],[58,2],[41,0],[21,0]],[[25,1],[53,3]],"11222112100010033210123222333000111101220332222110323300100112200332232300211003333112212211033333230"],
    [["xxxxxxxxx","x.......x","x.x.....x","xx..xx..x","x....x..x","x.......x","x......xx","xxxxxxxxx"],52,[[24,1],[51,2],[48,0],[22,0]],[[58,1],[21,2],[25,0],[42,0]],[[30,2],[57,1]],"000032033321101122223010003321333221221100022233012100223333011030001111233303222321211100022233300120300011112330332221212101003033"],
    [["xxxxxxxxx","x......xx","x......xx","x..x....x","x.......x","x.....x.x","x.....x.x","xxxxxxxxx"],43,[[14,1],[21,2],[33,0],[42,0]],[[15,1],[23,2],[12,0],[56,0]],[[47,0],[22,3]],"030330123303223212110101123303200332211322110032123300111003322103030332210301"],
    [["xxxxxxxxxx","x........x","x........x","x...xx...x","x.x..x..xx","x.....x..x","x..x.....x","x.x...x..x","xxxxxxxxxx"],47,[[25,1],[37,2],[66,0],[22,0]],[[31,1],[11,2],[25,0],[61,0]],[[14,3],[57,0]],"300331122100103333331111122222332301033310033221111211000003333320112322233001322111121100000333332322211003011"],
    [["xxxxxxxxx","x.......x","x.......x","x.......x","x...x.x.x","x.......x","x..x..x.x","xxxxxxxxx"],41,[[47,1],[32,2],[20,0],[50,0]],[[15,1],[10,2],[24,0],[12,0]],[[14,1],[41,2]],"033233221003012100233001111322110323010333122330121011112223333033221000301111"],
    [["xxxxxxxxxx","x........x","x........x","x.x..x..xx","x.x..x...x","x.x..x...x","x........x","xxxxxxxxxx"],44,[[57,1],[37,2],[22,0],[34,0]],[[54,1],[44,2],[64,0],[68,0]],[[56,0],[46,0]],"221110103230022233003000111123033220011230332212030012112210300112330333332101222200033222211111133330012030012200011230322"],
    [["xxxxxxxxx","x.......x","x.x.....x","x.......x","x..xx.x.x","x.......x","xx......x","x....x..x","xxxxxxxxx"],41,[[21,1],[24,2],[32,0],[50,0],[22,0]],[[57,1],[58,2],[66,0],[64,0],[23,0]],[[33,3],[51,3]],"2110000333320332211001112320112222333011100033220003322130011220112223311000332223111003032330121112233331111003320333222011223300001111122233101003333322120300111112223330330011122123"],
    [["xxxxxxxxxx","x...x....x","x......x.x","xx...x...x","x..x.....x","x....x...x","x........x","xxxxxxxxxx"],48,[[24,1],[37,2],[47,0],[57,0],[53,0]],[[64,1],[33,2],[52,0],[54,0],[51,0]],[[67,3],[26,2],[23,2]],"0003323323300123210122200010111223122310331010033233222310001011122233311010033233233232211010021110100332212331003323323221101003300123223221103110030321121100332330012322001111212223010331003322"],
    [["xxxxxxxxx","x...x.x.x","x.......x","x.....x.x","xx..x...x","xx......x","xx......x","xxxxxxxxx"],14,[[38,1],[24,2],[31,0],[23,0],[22,0]],[[23,1],[49,2],[56,0],[42,0],[51,0]],[[32,2],[24,3]],"22212233033001221211003003122122330133001012332211211000031222233033001121122302330100333300112222123111100003332333001120332111322321"]
  ];
  const dirs = ['up', 'right', 'down', 'left'];
  const arrows = ['↑', '→', '↓', '←'];
  function boardFor(stage) {
    const [rows, start, crystals, shrines, winds, solution] = stage;
    const h = rows.length, w = rows[0].length, n = w * h;
    const walls = Array.from(rows.join(''), c => c === 'x');
    const adj = Array.from({length: n}, (_, i) => [
      i >= w ? i - w : -1, i % w < w - 1 ? i + 1 : -1,
      i + w < n ? i + w : -1, i % w ? i - 1 : -1
    ].map(j => j >= 0 && !walls[j] ? j : -1));
    const wind = new Int8Array(n).fill(-1);
    for (const [i, d] of winds) wind[i] = d;
    const runes = crystals.map(c => c[1]);
    const goal = new Int8Array(n).fill(-1);
    for (const [i, rune] of shrines) goal[i] = rune;
    const distance = shrines.map(([g]) => {
      const dist = new Int16Array(n).fill(999), queue = [g];
      dist[g] = 0;
      for (let k = 0; k < queue.length; k++) {
        const curr = queue[k];
        for (let d = 0; d < 4; d++) {
          const back = (d + 2) % 4, prev = adj[curr][back];
          if (prev < 0 || adj[prev][back] < 0 || dist[prev] !== 999 || (wind[prev] >= 0 && wind[prev] !== d)) continue;
          dist[prev] = dist[curr] + 1;
          queue.push(prev);
        }
      }
      return dist;
    });
    return {w, h, n, walls, adj, wind, start, boxes:crystals.map(c => c[0]), runes, shrines, goal, distance, solution};
  }
  function solved(b, boxes) { return boxes.every((tile, j) => b.goal[tile] === b.runes[j]); }
  function pathTo(b, player, boxes, dest) {
    if (player === dest) return [];
    const taken = new Set(boxes), from = new Int16Array(b.n).fill(-1), direction = new Int8Array(b.n);
    const queue = [player];
    from[player] = player;
    for (let k = 0; k < queue.length; k++) {
      for (let d = 0; d < 4; d++) {
        const next = b.adj[queue[k]][d];
        if (next < 0 || from[next] >= 0 || taken.has(next)) continue;
        from[next] = queue[k]; direction[next] = d;
        if (next === dest) {
          const path = [];
          for (let at = dest; at !== player; at = from[at]) path.push(direction[at]);
          return path.reverse();
        }
        queue.push(next);
      }
    }
    return null;
  }
  function move(b, player, boxes, dir) {
    const next = b.adj[player][dir];
    if (next < 0) return null;
    const id = boxes.indexOf(next);
    if (id < 0) return {player:next, boxes, pushed:-1};
    const end = b.adj[next][dir];
    if (end < 0 || boxes.includes(end) || (b.wind[next] >= 0 && b.wind[next] !== dir)) return null;
    const changed = boxes.slice(); changed[id] = end;
    return {player:next, boxes:changed, pushed:id};
  }
  function assignment(b, boxes) {
    let best = 999;
    function visit(j, used, total) {
      if (total >= best) return;
      if (j === boxes.length) { best = total; return; }
      for (let g = 0; g < b.shrines.length; g++) {
        if (!(used & (1 << g)) && b.shrines[g][1] === b.runes[j]) {
          visit(j + 1, used | (1 << g), total + b.distance[g][boxes[j]]);
        }
      }
    }
    visit(0, 0, 0);
    return best;
  }
  function makeSearch(b, player, boxes) {
    const heap = [], seen = new Map(), route = new Uint16Array(b.n), block = new Uint8Array(b.n);
    let visited = 0;
    function put(node) {
      let at = heap.length;
      while (at) {
        const parent = (at - 1) >> 1;
        if (heap[parent].score <= node.score) break;
        heap[at] = heap[parent]; at = parent;
      }
      heap[at] = node;
    }
    function take() {
      const first = heap[0], last = heap.pop();
      if (!heap.length) return first;
      let at = 0;
      while (2 * at + 1 < heap.length) {
        let child = 2 * at + 1;
        if (child + 1 < heap.length && heap[child + 1].score < heap[child].score) child++;
        if (last.score <= heap[child].score) break;
        heap[at] = heap[child]; at = child;
      }
      heap[at] = last;
      return first;
    }
    function reach(p, crates) {
      block.fill(0);
      for (const c of crates) block[c] = 2;
      let first = p, tail = 1;
      route[0] = p; block[p] = 1;
      for (let k = 0; k < tail; k++) {
        for (const next of b.adj[route[k]]) {
          if (next >= 0 && !block[next]) {
            block[next] = 1; route[tail++] = next;
            if (next < first) first = next;
          }
        }
      }
      return first;
    }
    function key(p, crates) {
      const grouped = crates.map((c, i) => b.runes[i] * 128 + c).sort((a, d) => a - d);
      return String.fromCharCode(p, ...grouped);
    }
    put({p:player, crates:boxes.slice(), depth:0, score:0, parent:null});
    function step(limit) {
      for (let j = 0; j < limit && heap.length; j++) {
        const node = take();
        const min = reach(node.p, node.crates), id = key(min, node.crates);
        if ((seen.get(id) ?? Infinity) <= node.depth) continue;
        seen.set(id, node.depth); visited++;
        if (solved(b, node.crates)) {
          const pushes = [];
          for (let n = node; n.parent; n = n.parent) pushes.push([n.crate, n.d]);
          const steps = []; let p = player; const c = boxes.slice();
          for (const [idx, d] of pushes.reverse()) {
            const tile = c[idx], stand = b.adj[tile][(d + 2) % 4];
            steps.push(...pathTo(b, p, c, stand), d);
            c[idx] = b.adj[tile][d]; p = tile;
          }
          return {done:true, steps, pushes:node.depth, visited};
        }
        for (let i = 0; i < node.crates.length; i++) {
          const at = node.crates[i];
          for (let d = 0; d < 4; d++) {
            if (b.wind[at] >= 0 && b.wind[at] !== d) continue;
            const to = b.adj[at][d], stand = b.adj[at][(d + 2) % 4];
            if (to < 0 || stand < 0 || block[to] === 2 || block[stand] !== 1) continue;
            const crates = node.crates.slice(); crates[i] = to;
            const lower = assignment(b, crates);
            if (lower === 999) continue;
            const depth = node.depth + 1;
            put({p:at, crates, depth, score:(depth + lower) * 128 + lower, parent:node, crate:i, d});
          }
        }
      }
      return {done:!heap.length, steps:null, visited};
    }
    return {step};
  }
  // Each biome has its own floor, stone and foliage pigments.
  const biomes = [
    ['#334347','#425a55','#769684','#203735','#4d7964','#89bd79'],
    ['#424142','#645444','#ac9a70','#3e4235','#73744e','#b9b773'],
    ['#2f3b50','#435269','#7396a8','#273a4e','#486c83','#96c3c7'],
    ['#464450','#65596b','#aaa0ad','#353849','#626481','#c2a7c7'],
    ['#433e3c','#65544e','#a59179','#453833','#785744','#d0a468'],
    ['#34464b','#4c626a','#8cabb1','#2b4952','#527d85','#98bcc0'],
    ['#394451','#4d586a','#8e9db4','#303d50','#526a87','#acbadc'],
    ['#3a3b53','#56516d','#a49ab7','#312e48','#625983','#bb9ed5']
  ];
  const minerals = [
    ['#ecfff0','#99ffbb','#44cba0','#187467','#14464e'],
    ['#fff9dd','#ffe4a1','#f0a94e','#a15d3d','#573640'],
    ['#fff1ff','#e2c0ff','#b77bd8','#7859a7','#493d6c']
  ];
  const scriptPath=typeof document==='undefined'?null:document.currentScript?.src;
  let atlas=null, atlasRequest=null;
  function loadArt(){
    if(!atlasRequest){
      atlasRequest=new Promise(resolve=>{
        const img=new Image();
        img.onload=()=>{atlas=img;resolve(true);};
        img.onerror=()=>resolve(false);
        img.src=scriptPath?new URL('art/trail-terrain.webp',scriptPath).href:'art/trail-terrain.webp';
      });
    }
    return atlasRequest;
  }
  const terrainSheets=[];
  function biomeSheet(region){
    if(!atlas)return null;
    if(terrainSheets[region])return terrainSheets[region];
    const grades=['none','saturate(.83) hue-rotate(72deg)','sepia(.2) saturate(1.04) hue-rotate(-12deg)',
      'saturate(.82) hue-rotate(203deg)','saturate(1.22) hue-rotate(38deg)',
      'saturate(1.15) hue-rotate(-42deg)','saturate(.59) hue-rotate(107deg) brightness(1.11)','saturate(.79) hue-rotate(223deg)'];
    const sheet=document.createElement('canvas');
    sheet.width=atlas.naturalWidth;sheet.height=atlas.naturalHeight/2;
    const context=sheet.getContext('2d');
    context.filter=grades[region]||'none';context.drawImage(atlas,0,0);
    terrainSheets[region]=sheet;return sheet;
  }
  function sprite(ctx,col,row,x,y,w,h,sheet=atlas){
    const cell=(sheet.naturalWidth||sheet.width)/4;
    ctx.drawImage(sheet,col*cell,row*cell,cell,cell,x,y,w,h);
  }
  function polygon(ctx, points, fill, edge) {
    ctx.beginPath(); ctx.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 1; ctx.stroke(); }
  }
  function ellipse(ctx, x,y,rx,ry,fill,angle=0) {
    ctx.beginPath(); ctx.ellipse(x,y,rx,ry,angle,0,Math.PI*2); ctx.fillStyle=fill; ctx.fill();
  }
  function stroke(ctx, points, color, width) {
    ctx.beginPath(); ctx.moveTo(points[0],points[1]);
    for(let i=2;i<points.length;i+=2) ctx.lineTo(points[i],points[i+1]);
    ctx.strokeStyle=color; ctx.lineWidth=width; ctx.stroke();
  }
  function wash(ctx, x,y,r,center,edge) {
    const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,center);g.addColorStop(1,edge);return g;
  }
  function rune(ctx, type, cx,cy, scale, color) {
    ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);
    if(type===1){
      ctx.beginPath();ctx.arc(0,0,8,Math.PI*.32,Math.PI*1.68);ctx.bezierCurveTo(-2,-6,-3,5,4.3,6.7);
      ctx.closePath();ctx.fillStyle=color;ctx.fill();
    }else if(type===2){
      polygon(ctx,[0,-9,2,-3,8,-6,5,0,10,2,3,4,2,10,-2,5,-8,7,-5,1,-9,-2,-3,-3],color);
    }else{
      polygon(ctx,[0,-9,7,0,0,9,-7,0],null,color);stroke(ctx,[0,-5,0,5],color,1.5);
    }
    ctx.restore();
  }
  function crystal(ctx, x,y, type, lit) {
    const pal=minerals[type];
    ctx.save();ctx.translate(x,y);
    if(atlas){
      ellipse(ctx,50,82,34,11,'#1a201a66');
      if(lit){
        ellipse(ctx,50,67,45,31,wash(ctx,50,67,44,pal[1]+'d9',pal[2]+'00'));
        ctx.strokeStyle=pal[0];ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(50,78,38,14,0,0,Math.PI*2);ctx.stroke();
      }
      sprite(ctx,type+1,1,3,2,94,86);
      ctx.restore();return;
    }
    ellipse(ctx,51,75,32,11,'#061c26a8');
    if(lit) ellipse(ctx,50,59,47,39,wash(ctx,50,59,46,pal[2]+'6e',pal[2]+'00'));
    polygon(ctx,[21,58,31,43,65,42,81,56,73,70,48,78,25,69],'#273d40','#b5b99b');
    polygon(ctx,[24,60,46,67,74,60,68,70,47,76,28,68],'#536461','#7b8877');
    polygon(ctx,[33,48,42,30,52,20,65,31,72,55,59,65,41,67,30,58],pal[3],pal[4]);
    polygon(ctx,[33,48,42,30,52,20,48,44,41,67,30,58],pal[2]);
    polygon(ctx,[52,20,65,31,59,46,48,44],pal[1]);
    polygon(ctx,[48,44,59,46,59,65,41,67],pal[2]);
    polygon(ctx,[65,31,72,55,59,65,59,46],pal[3]);
    polygon(ctx,[31,55,25,48,22,37,30,40,38,51,39,61],pal[2],pal[4]);
    polygon(ctx,[22,37,29,47,31,55,25,48],pal[1]);
    polygon(ctx,[67,54,74,38,79,34,80,49,73,60,66,62],pal[2],pal[4]);
    stroke(ctx,[33,48,42,30,52,20,64,31],pal[0],1.4);
    stroke(ctx,[48,44,42,62],pal[0]+'9c',1);
    rune(ctx,type,51.5,54,.83,'#203f49');
    ellipse(ctx,50,27,2,4,pal[0],.5);
    ctx.restore();
  }
  function familiar(ctx,x,y,facing) {
    ctx.save();ctx.translate(x,y);if(facing===3){ctx.translate(100,0);ctx.scale(-1,1);}
    if(atlas){
      ellipse(ctx,53,83,31,9,'#2c271b66');sprite(ctx,0,1,3,1,94,90);ctx.restore();return;
    }
    ellipse(ctx,50,78,29,10,'#11292ca1');
    // A white-tipped tail and a blue explorer's neckerchief identify the guide at small sizes.
    ctx.beginPath();ctx.moveTo(44,67);ctx.bezierCurveTo(30,73,14,68,16,42);
    ctx.bezierCurveTo(21,46,26,40,31,45);ctx.bezierCurveTo(29,55,43,50,48,59);
    ctx.closePath();ctx.fillStyle='#ca763f';ctx.fill();ctx.strokeStyle='#573f35';ctx.lineWidth=1.6;ctx.stroke();
    polygon(ctx,[17,43,22,46,30,44,29,51,25,54,23,51,20,54],'#fff0ce');
    ellipse(ctx,51,62,16,16,'#ac633c');ellipse(ctx,50,64,12,13,'#eee4c8');
    ellipse(ctx,40,75,8,4,'#66453b');ellipse(ctx,61,75,8,4,'#66453b');
    polygon(ctx,[36,52,43,73,51,63,62,55],'#16a7a5','#176261');
    polygon(ctx,[34,49,28,30,30,15,48,30,57,28,72,15,73,33,69,47], '#d88949','#644636');
    polygon(ctx,[31,23,33,38,42,32],'#735556');
    polygon(ctx,[68,23,59,32,68,36],'#735556');
    polygon(ctx,[35,39,41,32,50,29,60,31,69,38,74,50,66,53,58,59,45,58,34,52,29,47], '#e8a25f','#71583c');
    polygon(ctx,[31,45,41,46,49,51,54,47,66,45,72,47,65,53,57,58,46,57,35,51],'#fff0ce');
    ellipse(ctx,45,43,2.9,3.5,'#273c41');ellipse(ctx,61,42,2.8,3.3,'#273c41');
    ellipse(ctx,46,42,1,1,'#fff9de');ellipse(ctx,62,41,1,1,'#fff9de');
    polygon(ctx,[50,49,57,48,54,53],'#483e3f');
    stroke(ctx,[53.5,53,51,55,48,54],'#967158',1.05);
    ellipse(ctx,45,62,3,3,'#dfbd70');ctx.restore();
  }
  function scenery(b,region,index) {
    const art=document.createElement('canvas');art.width=b.w*100;art.height=b.h*100;
    const c=art.getContext('2d'),p=biomes[region] || biomes[0], sheet=biomeSheet(region);
    c.fillStyle='#18292c';c.fillRect(0,0,art.width,art.height); c.lineCap='round';c.lineJoin='round';
    for(let i=0;i<b.n;i++){
      const x=(i%b.w)*100,y=Math.floor(i/b.w)*100;
      let n=(Math.imul(i+417+index*83,1611471591)>>>0);
      function noise(){n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;}
      c.save();c.translate(x,y);
      if(!b.walls[i]){
        if(atlas){
          const tile=noise()>.48?1:0;
          c.fillStyle='#39403b';c.fillRect(0,0,100,100);
          c.save();if(noise()>.5){c.translate(100,0);c.scale(-1,1);}
          sprite(c,tile,0,1,1,98,98,sheet);c.restore();
          c.fillStyle=p[0]+(region<2?'25':'43');c.fillRect(1,1,98,98);
        }else{
        const g=c.createLinearGradient(0,0,90,110);g.addColorStop(0,p[1]);g.addColorStop(1,p[0]);
        polygon(c,[3,8,9,2,89,2,98,9,97,85,90,98,9,97,2,90],'#243539');
        polygon(c,[3,8,9,2,89,2,98,9,96,82,90,91,9,93,2,86],g);
        stroke(c,[4,9,10,3,88,3,95,8],p[2]+'94',1.8);
        stroke(c,[7,89,87,89,95,81],'#152b3399',1.5);
        for(let q=0;q<19;q++){
          const xx=6+noise()*86,yy=8+noise()*75;
          ellipse(c,xx,yy,.5+noise()*1.8,.4+noise(),noise()>.48?'#eef3d524':'#131e2d36');
        }
        if(noise()>.45)stroke(c,[10,88,18,77,26,76,32,69],p[2]+'4d',1.3);
        }
        if(b.goal[i]>=0){
          const gp=minerals[b.goal[i]];
          polygon(c,[15,40,30,24,65,21,84,39,85,60,67,76,32,79,14,63], '#273c43',p[2]);
          polygon(c,[21,42,32,30,64,27,78,41,79,60,65,70,34,73,22,61], '#33494a',gp[2]);
          c.shadowColor=gp[2];c.shadowBlur=8;rune(c,b.goal[i],50,50,1.72,gp[1]);c.shadowBlur=0;
          for(const [ax,ay] of [[22,46],[76,48],[48,27],[49,71]])ellipse(c,ax,ay,2,1.5,gp[1]);
        }
        if(b.wind[i]>=0){
          c.save();c.translate(50,50);c.rotate(b.wind[i]*Math.PI/2);
          for(const yy of [-7,10]){stroke(c,[-13,yy+6,0,yy-7,13,yy+6],'#253742',7);stroke(c,[-13,yy+6,0,yy-7,13,yy+6],'#9dd6e8',3.4);}
          c.restore();
        }
      }else{
        const empty = i%b.w===0||i%b.w===b.w-1||i<b.w||i>=b.n-b.w;
        if(atlas){
          const planting=noise()>(empty?.32:.89);
          c.save();
          if(noise()>.5){c.translate(100,0);c.scale(-1,1);}
          if(planting){
            const rot=Math.floor(noise()*4);c.translate(50,50);c.rotate(rot*Math.PI/2);c.translate(-50,-50);
          }
          sprite(c,planting?3:2,0,0,0,100,100,sheet);c.restore();
          c.fillStyle=p[3]+(planting?'35':'26');c.fillRect(0,0,100,100);
        }else{
        c.fillStyle=empty?'#1e3032':'#263a3b';c.fillRect(0,0,100,100);
        const a=noise()*10,k=noise()*9;
        polygon(c,[0,23+a,13,9+k,66,4,95,16,100,33,96,73,83,95,25,100,0,83],p[3]);
        polygon(c,[0,24+a,14,12+k,62,6,91,17,95,31,82,62,58,76,14,68,0,51],p[4]);
        polygon(c,[13,18+k,28,12,61,8,88,19,58,25,31,26],p[5]+'66');
        stroke(c,[4,52,19,60,37,63,59,71,82,58],p[5]+'4d',1.5);
        stroke(c,[67,12,56,24,58,39,49,46],p[3],2.3);
        for(let q=0;q<15;q++){
          const xx=4+noise()*83,yy=9+noise()*47,rr=2+noise()*5.3;
          ellipse(c,xx,yy,rr,rr*.36,noise()>.55?p[5]+'65':p[3]+'76',noise()*2);
        }
        if(noise()>.38){
          const xx=10+noise()*66,yy=35+noise()*41;
          for(let q=0;q<6;q++){const angle=-2.9+q*.48;const ex=xx+Math.cos(angle)*(8+noise()*10),ey=yy+Math.sin(angle)*(7+noise()*11);polygon(c,[xx,yy,(xx+ex)/2-1,(yy+ey)/2-2,ex,ey,(xx+ex)/2+2,(yy+ey)/2+3],q%2?p[5]:p[4]);}
        }
        if(noise()>.85){for(let q=0;q<4;q++){const xx=12+noise()*63,yy=13+noise()*34;ellipse(c,xx,yy,2.5,1.8,'#c8d49a');}}
        }
      }
      c.restore();
    }
    const shade=c.createRadialGradient(art.width*.5,art.height*.46,art.width*.22,art.width*.5,art.height*.46,art.width*.7);
    shade.addColorStop(0,'#10202b00');shade.addColorStop(1,'#07121f88');
    c.fillStyle=shade;c.fillRect(0,0,art.width,art.height);
    return art;
  }
  function mount(host, options) {
    const {index, region, lang, onSave, onWin, sound}=options;
    const zh=lang==='zh', tr=(en,cn)=>zh?cn:en;
    const b=boardFor(stages[index]);
    let player=b.start, boxes=b.boxes.slice(), facing=1, history='', snapshots=[];
    let hint=null, searchTimer=0, frame=0, travelTimer=0, winTimer=0, active=true, finished=false;
    let animation=null, gesture=null;
    const rules=[
      tr('Guide each crystal onto a plinth marked with its rune. Stand behind a crystal and walk into it to push.', '把每块晶石推上刻有相同符号的石座。走到晶石背后，再向前一步就能推动它。'),
      tr('Crystals can only be pushed. Leave space to walk around them before pushing one to a wall.', '晶石只能推。先给自己留条绕行的路，再把晶石推到墙边。'),
      tr('Moon crystals belong on crescent plinths. Match the symbols when the paths cross.', '月牙晶石要放到月牙石座上。两条路线交叉时，留意各自的符号。'),
      tr('A wind tile only lets a crystal leave in the direction of its arrows. Your scout can cross freely.', '晶石从风纹地砖离开时，只能沿箭头方向。小狐狸可以自由经过。'),
      tr('Work out which crystal needs the narrow passage first. Leave a way out for the scout.', '想一想，哪块晶石要先经过窄道？给小狐狸留一条出来的路。'),
      tr('Star, moon and grove crystals each have their own plinth. Trace every route before filling the middle.', '星纹、月纹和森纹各有自己的石座。填上中央石座前，先看看其余路线。'),
      tr('A crystal can pass over its own plinth. Sometimes you need to move it away to make room.', '晶石可以经过自己的石座。有时要暂时把它推开，给其他晶石让路。'),
      tr('Plan the last push into each shrine, then work backwards to find the space your scout needs.', '先想好每个石座的最后一推，再倒着找小狐狸需要的站位。')
    ];
    function el(tag,cls,words){const n=document.createElement(tag);if(cls)n.className=cls;if(words!==undefined)n.textContent=words;return n;}
    const wrap=el('section','sf-trail'), play=el('div','sf-trail-field'), canvas=el('canvas','sf-trail-map');
    const intro=el('p','sf-trail-rule',rules[region] || rules[0]);
    canvas.tabIndex=0;
    canvas.setAttribute('aria-label',tr('Ruin Trails puzzle board. Use the arrow keys or the direction buttons to move the fox.', '遗迹推石棋盘。使用方向键或下方按钮移动小狐狸。'));
    const hud=el('div','sf-trail-hud'), sealed=el('span','sf-trail-seals'), counter=el('span','sf-trail-count');
    hud.append(sealed,counter);
    play.append(canvas,hud);
    const controls=el('div','sf-trail-controls'), dpad=el('div','sf-trail-pad'), tools=el('div','sf-trail-tools');
    const names=zh?['上','右','下','左']:['Up','Right','Down','Left'];
    const padButtons=[];
    for(let d=0;d<4;d++){
      const btn=el('button','sf-trail-dir sf-trail-'+dirs[d],arrows[d]);
      btn.type='button';btn.setAttribute('aria-label',names[d]);
      btn.addEventListener('click',()=>takeStep(d));padButtons.push(btn);dpad.append(btn);
    }
    const notice=el('div','sf-trail-notice');notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');
    function tool(icon,label,action){
      const btn=el('button','sf-trail-action');btn.type='button';
      const symbol=el('span','',icon);symbol.setAttribute('aria-hidden','true');btn.append(symbol,el('span','',label));
      btn.addEventListener('click',action);tools.append(btn);return btn;
    }
    const undoButton=tool('↶',tr('Undo','撤销'),undo);
    const hintButton=tool('✧',tr('Hint','提示'),showHint);
    const resetButton=tool('↻',tr('Restart','重来'),reset);
    const legend=el('p','sf-trail-keys',tr('Arrow keys / WASD · Tap a tile to walk · Z to undo', '方向键 / WASD 移动 · 点地砖可走过去 · Z 撤销'));
    controls.append(dpad,tools);wrap.append(intro,play,controls,notice,legend);host.replaceChildren(wrap);
    let terrain=scenery(b,region,index);
    const ctx=canvas.getContext('2d');
    canvas.width=terrain.width;canvas.height=terrain.height;
    function restore(){
      const saved=options.saved;
      if(!saved || saved.stage!==index || typeof saved.trail!=='string' || !/^[0-3]*$/.test(saved.trail))return;
      for(const c of saved.trail){
        const dir=Number(c),step=move(b,player,boxes,dir);
        if(!step || solved(b,boxes))break;
        snapshots.push([player,boxes,facing]);history+=c;player=step.player;boxes=step.boxes;facing=dir;
      }
    }
    function persist(){if(onSave)onSave({stage:index,trail:history});}
    function updateHud(){
      const correct=boxes.filter((p,j)=>b.goal[p]===b.runes[j]).length;
      sealed.textContent=tr('Plinths ','已点亮 ')+correct+' / '+boxes.length;
      counter.textContent=tr('Steps ','步数 ')+history.length;
      undoButton.disabled=resetButton.disabled=!history.length||finished;
      hintButton.disabled=finished;
    }
    function xy(tile){return [(tile%b.w)*100,Math.floor(tile/b.w)*100];}
    function paint(now){
      if(!active)return;
      cancelAnimationFrame(frame);frame=0;
      ctx.drawImage(terrain,0,0);
      if(hint){
        let at=player;ctx.lineCap='round';
        for(const dir of hint.directions){
          const next=b.adj[at][dir],a=xy(at),z=xy(next);
          stroke(ctx,[a[0]+50,a[1]+57,z[0]+50,z[1]+57],'#daf7c288',3);
          ellipse(ctx,z[0]+50,z[1]+57,4,4,'#e7ffd4');at=next;
        }
      }
      let tween=1;
      if(animation){tween=Math.min(1,(now-animation.start)/115);tween=1-Math.pow(1-Math.max(0,tween),2);}
      for(let id=0;id<boxes.length;id++){
        const to=xy(boxes[id]),from=animation?xy(animation.boxes[id]):to;
        crystal(ctx,from[0]+(to[0]-from[0])*tween,from[1]+(to[1]-from[1])*tween,b.runes[id],b.goal[boxes[id]]===b.runes[id]);
      }
      const to=xy(player),from=animation?xy(animation.player):to;
      familiar(ctx,from[0]+(to[0]-from[0])*tween,from[1]+(to[1]-from[1])*tween-Math.sin(tween*Math.PI)*3,facing);
      if(hint){
        const pos=xy(hint.crystal);
        ctx.save();ctx.translate(pos[0]+50,pos[1]+15);ctx.rotate(hint.dir*Math.PI/2);
        polygon(ctx,[0,-14,11,-3,4,-3,4,6,-4,6,-4,-3,-11,-3], '#fff4ac','#31434b');ctx.restore();
      }
      if(animation && tween<1)frame=requestAnimationFrame(paint);else animation=null;
    }
    function draw(){paint(performance.now());}
    function cancelHints(){
      clearTimeout(searchTimer);hint=null;hintButton.removeAttribute('aria-busy');
    }
    function stopWalking(){clearTimeout(travelTimer);travelTimer=0;}
    function win(){
      finished=true;stopWalking();cancelHints();updateHud();
      notice.textContent=tr('All crystals are singing. Habitat restored!','所有晶石一起鸣响，这片栖息地恢复了生机！');
      if(sound)sound('success');
      winTimer=setTimeout(()=>{if(active && onWin)onWin({moves:history.length});},250);
    }
    function takeStep(dir,auto=false){
      if(finished||!active)return false;
      if(!auto)stopWalking();
      const step=move(b,player,boxes,dir);
      if(!step){
        const at=b.adj[player][dir], crystal=boxes.indexOf(at);
        notice.textContent=crystal>=0 && b.wind[at]>=0 && b.wind[at]!==dir?
          tr('The wind points '+arrows[b.wind[at]]+'. Push the crystal that way.', '风纹指向 '+arrows[b.wind[at]]+'，请沿这个方向推晶石。'):
          crystal>=0?tr('That crystal needs a free tile in front of it.', '晶石前面需要一块空地砖。'):tr('A ruin wall blocks that way.', '这边有遗迹石墙挡路。');
        return false;
      }
      const oldHint=hint;cancelHints();
      animation={player,boxes,start:performance.now()};snapshots.push([player,boxes,facing]);
      player=step.player;boxes=step.boxes;facing=dir;history+=dir;notice.textContent='';
      if(oldHint && oldHint.directions.length && oldHint.directions[0]===dir){
        hint={...oldHint,directions:oldHint.directions.slice(1)};
        if(!hint.directions.length)notice.textContent=tr('Push '+arrows[hint.dir]+'.','现在朝 '+arrows[hint.dir]+' 推。');
      }
      if(step.pushed>=0 && sound)sound('move');
      persist();updateHud();draw();
      if(solved(b,boxes))win();
      else if(step.pushed>=0 && b.distance.every((dist,i)=>b.shrines[i][1]!==b.runes[step.pushed] || dist[boxes[step.pushed]]===999)){
        notice.textContent=tr('That crystal cannot reach its plinth from here. Undo this push to try another route.', '晶石从这里到不了自己的石座。撤销这一步，试试别的方向。');
      }
      return true;
    }
    function undo(){
      if(finished||!history.length)return;
      cancelHints();stopWalking();animation=null;history=history.slice(0,-1);
      [player,boxes,facing]=snapshots.pop();notice.textContent='';if(sound)sound('tap');persist();updateHud();draw();
    }
    function reset(){
      if(finished||!history.length)return;
      cancelHints();stopWalking();animation=null;history='';snapshots=[];player=b.start;boxes=b.boxes.slice();facing=1;
      notice.textContent=tr('Back at the trailhead.', '回到了这一关的起点。');if(sound)sound('tap');persist();updateHud();draw();
    }
    function displayHint(steps){
      hintButton.removeAttribute('aria-busy');
      if(!steps || !steps.length){
        notice.textContent=tr('This position has no route home. Undo your last push, then ask for a new clue.', '从现在的位置已经无法全部归位。撤销到上一次推石前，再看看提示。');return;
      }
      let p=player;const route=[];
      for(const d of steps){
        const at=b.adj[p][d],id=boxes.indexOf(at);
        if(id>=0){
          hint={directions:route,crystal:at,dir:d};
          notice.textContent=route.length?
            tr('Follow the dots, then push the marked crystal '+arrows[d]+'.','沿亮点走到晶石旁，再朝 '+arrows[d]+' 推。'):
            tr('Push the marked crystal '+arrows[d]+'.','把标记的晶石朝 '+arrows[d]+' 推。');
          draw();return;
        }route.push(d);p=at;
      }
    }
    function showHint(){
      if(finished)return;stopWalking();cancelHints();if(sound)sound('tap');
      if(b.solution.startsWith(history)){displayHint(Array.from(b.solution.slice(history.length),Number));return;}
      hintButton.setAttribute('aria-busy','true');
      notice.textContent=tr('Tracing a route through the ruins…','正在寻找能走通的路线……');
      const solver=makeSearch(b,player,boxes);
      function next(){
        if(!active)return;
        const start=performance.now();let r;
        do{r=solver.step(80);}while(!r.done && r.visited<50000 && performance.now()-start<12);
        if(r.done){displayHint(r.steps);return;}
        if(r.visited>=50000){
          hintButton.removeAttribute('aria-busy');notice.textContent=tr('Too many paths branch here. Undo a few pushes or restart to follow the marked route.', '这里的岔路太多了。可以撤回几次推动，或从起点跟着亮点走。');return;
        }
        searchTimer=setTimeout(next,0);
      }
      searchTimer=setTimeout(next,0);
    }
    function walkTo(tile){
      if(finished || tile<0 || tile>=b.n || b.walls[tile])return;
      stopWalking();
      const nearby=b.adj[player].indexOf(tile);
      if(nearby>=0){takeStep(nearby);return;}
      if(boxes.includes(tile)){
        notice.textContent=tr('Tap a tile behind the crystal to walk there. Then tap the crystal to push.', '先点晶石背后的地砖走过去，再点晶石推动它。');return;
      }
      const route=pathTo(b,player,boxes,tile);
      if(!route){notice.textContent=tr('The scout cannot walk there yet.', '小狐狸暂时走不到那里。');return;}
      let k=0;function next(){if(!active||k>=route.length||!takeStep(route[k++],true))return;if(k<route.length)travelTimer=setTimeout(next,95);}
      next();
    }
    canvas.addEventListener('pointerdown',e=>{
      if(e.button!==0)return;
      gesture={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture?.(e.pointerId);
      canvas.focus({preventScroll:true});
    });
    canvas.addEventListener('pointercancel',()=>{gesture=null;});
    canvas.addEventListener('pointerup',e=>{
      if(!gesture||gesture.id!==e.pointerId)return;
      const {x,y}=gesture;gesture=null;const dx=e.clientX-x,dy=e.clientY-y;
      if(Math.max(Math.abs(dx),Math.abs(dy))>22){takeStep(Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?2:0));return;}
      const rect=canvas.getBoundingClientRect();
      if(e.clientX<rect.left||e.clientX>=rect.right||e.clientY<rect.top||e.clientY>=rect.bottom)return;
      walkTo(Math.floor((e.clientX-rect.left)*b.w/rect.width)+Math.floor((e.clientY-rect.top)*b.h/rect.height)*b.w);
    });
    const keyMap={ArrowUp:0,w:0,ArrowRight:1,d:1,ArrowDown:2,s:2,ArrowLeft:3,a:3};
    function keys(e){
      const dialog=document.querySelector('dialog[open]');
      if(!active||finished||e.ctrlKey||e.altKey||e.metaKey||e.defaultPrevented||(dialog && !dialog.contains(host)) || /INPUT|TEXTAREA|SELECT/.test(e.target?.tagName))return;
      if(e.key in keyMap){e.preventDefault();takeStep(keyMap[e.key]);}
      else if(e.key.toLowerCase()==='z'){e.preventDefault();undo();}
    }
    restore();updateHud();draw();
    if(!atlas)loadArt().then(loaded=>{if(active && loaded){terrain=scenery(b,region,index);draw();}});
    if(index===0&&!history.length)notice.textContent=tr('Walk right twice to light the first plinth.','朝右走两步，点亮第一座石台。');
    if(solved(b,boxes))win();
    document.addEventListener('keydown',keys);
    return function cleanup(){active=false;document.removeEventListener('keydown',keys);clearTimeout(winTimer);cancelHints();stopWalking();cancelAnimationFrame(frame);};
  }
  function validate(){
    return stages.map((stage,index)=>{
      const b=boardFor(stage);let player=b.start,boxes=b.boxes,pushes=0;
      for(const key of b.solution){
        const step=move(b,player,boxes,Number(key));
        if(!step)throw Error('Invalid trail at '+index);
        if(step.pushed>=0)pushes++;
        player=step.player;boxes=step.boxes;
      }
      return {index,solved:solved(b,boxes),moves:b.solution.length,pushes,crystals:boxes.length};
    });
  }
  const siteNames=[
    ['第一座石台','The First Plinth'],['栗尾的脚印','Pip’s Pawprints'],['一对森纹石','Twin Grove Stones'],
    ['苔石小径','The Mossy Path'],['蕨叶拐角','Fernleaf Corner'],['树根之间','Between Roots'],['苏醒的石门','The Waking Gate'],
    ['潮池仓房','Tidepool Storehouse'],['贝壳庭院','Shell Court'],['浅滩渡口','Shoal Crossing'],
    ['退潮之后','After the Ebb'],['沉船码头','Wreckside Quay'],['水磨坊','The Tide Mill'],['月光船坞','Moonlit Dockyard'],
    ['月纹初现','The Crescent Mark'],['羱羊隘口','Ibex Pass'],['三声风铃','Three Chimes'],
    ['山背小道','Ridgeline Trail'],['铜铃栈桥','Brassbell Bridge'],['回音庭','Echo Court'],['钟楼山口','Belfry Pass'],
    ['第一道风纹','The First Windmark'],['晶洞岔口','Crystal Fork'],['倒垂的钟乳石','The Hanging Spires'],
    ['紫翼巢室','Vesper’s Roost'],['地下河岸','Underground Shore'],['月影岩厅','Moonshadow Hall'],['回声密室','Echo Chamber'],
    ['藤蔓架','The Vine Trellis'],['兰花台阶','Orchid Steps'],['幼龙的小路','The Drake’s Path'],
    ['四石平台','Four-Stone Terrace'],['树冠雨亭','Canopy Shelter'],['空心树廊','The Hollow Trunk'],['兰冠高庭','Orchid Crown Court'],
    ['星纹炉台','The Starforge'],['余烬壁龛','Ember Niche'],['炉心走廊','Furnace Walk'],
    ['黄铜铸室','Brass Casting Room'],['炭团的工坊','Ember’s Workshop'],['矿车转盘','Minecart Turntable'],['重燃铸谷','The Forge Relit'],
    ['覆雪的石座','Snowbound Plinths'],['雪鸮栖木','The Owl’s Perch'],['冰镜水岸','Mirror-Ice Shore'],
    ['北光隧道','Aurora Tunnel'],['古松内院','Old Pine Court'],['极光长阶','The Aurora Steps'],['霜羽钟台','Frostfeather Belfry'],
    ['星环门厅','The Ring Vestibule'],['七岛倒影','Seven Reflections'],['群星观测台','The Observatory'],
    ['曜曜的密径','Sol’s Hidden Way'],['五枚星石','Five Star Stones'],['云海前庭','Court of Clouds'],['星鲸归航台','The Whale Landing']
  ];
  function getTitle(index,lang){return siteNames[index]?.[lang==='zh'?0:1];}
  const modes=window.StarfallModes || (window.StarfallModes={});
  modes.trail={count:stages.length,mount,validate,getTitle};
})();
