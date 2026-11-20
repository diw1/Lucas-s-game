(() => {
  'use strict';

  // Clockwise from north. A connection works only when both adjoining edges match.
  const directions = [[0,-1,1,4],[1,0,2,8],[0,1,4,1],[-1,0,8,2]];
  function rotateMask(base, turns = 0) {
    const shift = turns & 3;
    return ((base << shift) | (base >>> (4 - shift))) & 15;
  }

  // Each route is a hand-drawn run of neighboring cells. The first route begins
  // at the source; every route ends at a lamp. Later routes fork from earlier runs.
  // A switch listed at zero is already aligned but remains playable.
  const layouts = [
    {
      id:'canopy', cols:3, rows:3, par:1,
      routes:['a2 b2 b1 c1'],
      switches:{b2:3}, rocks:'a1 c3'
    },
    {
      id:'hollow', cols:4, rows:3, par:3,
      routes:['a1 b1 b2 c2 c3 d3'],
      switches:{b1:3,c2:2,c3:0}, rocks:'c1 a3 d1'
    },
    {
      id:'picnic', cols:4, rows:3, par:4,
      routes:['a2 b2 c2 c1 d1','c2 c3 d3'],
      switches:{b2:0,c2:1,c1:0,c3:3}, rocks:'b1 a3'
    },
    {
      id:'bakery', cols:4, rows:4, par:6,
      routes:['b4 b3 a3 a2 b2 c2 c1','c2 c3 d3 d2 d1'],
      switches:{b3:3,a3:3,a2:0,b2:1,c2:3,c3:3,d3:3}, rocks:'a1 d4'
    },
    {
      id:'stage', cols:5, rows:4, par:8,
      routes:['c4 c3 c2 b2 a2 a1','c2 d2 e2 e1','c3 d3 d4 e4'],
      switches:{c3:2,c2:3,a2:2,e2:3,d4:3,d3:0,b2:0,d2:1}, rocks:'b1 d1 a4'
    },
    {
      id:'cat', cols:5, rows:5, par:10,
      routes:['c3 c4 b4 a4 a3 a2 a1 b1 b2','c4 d4 e4 e3 e2 e1 d1 d2'],
      switches:{c4:3,a4:3,a1:2,b1:0,b4:1,a2:1,e4:2,e1:3,d1:3}, rocks:'b3 d3 c5'
    },
    {
      id:'castle', cols:5, rows:5, par:12,
      routes:['a5 a4 a3 b3 b2 b1 c1','b3 c3 c4 d4 e4 e3 e2 e1','c4 c5 d5'],
      switches:{a4:1,a3:2,b3:3,b1:2,c3:3,c4:2,c5:3,e4:2,e2:0}, rocks:'a1 d1 d3 b5'
    },
    {
      id:'parade', cols:5, rows:5, par:13,
      routes:['a3 b3 b2 c2 d2 d3 e3 e4 e5','b2 b1 c1','d3 c3 c4 b4 b5 a5'],
      switches:{b3:2,b2:1,c2:1,d2:3,d3:2,e3:3,e4:0,b1:3,c4:3,b5:3}, rocks:'a2 d1 d4'
    },
    {
      id:'reef', cols:5, rows:5, par:15,
      routes:['d1 c1 b1 b2 a2 a3 a4 b4 b5 c5','b2 c2 c3 d3 d4 e4 e5','d3 e3 e2 e1'],
      switches:{b1:2,b2:1,a2:2,a4:3,b4:0,c2:3,c3:2,d3:3,e4:2,e3:3}, rocks:'a1 b3 d5'
    }
  ];
  function compile({id, cols, rows, par, routes, switches, rocks}) {
    const index = cell => (Number(cell.slice(1)) - 1) * cols + cell.charCodeAt(0) - 97;
    const tiles = Array.from({length:cols * rows}, () => ({type:'empty',base:0,fixed:true,initial:0}));
    for (const cell of rocks.split(' ')) tiles[index(cell)].type = 'rock';
    const runs = routes.map(line => line.split(' ').map(index));
    for (const run of runs) {
      for (let step=1; step<run.length; step++) {
        const a = run[step-1], b = run[step];
        const dx = b % cols - a % cols, dy = Math.floor(b / cols) - Math.floor(a / cols);
        const [, , edge, opposite] = directions.find(([x,y]) => x === dx && y === dy);
        tiles[a].base |= edge;
        tiles[b].base |= opposite;
        tiles[a].type = tiles[b].type = 'wire';
      }
    }
    tiles[runs[0][0]].type = 'source';
    for (const run of runs) tiles[run[run.length-1]].type = 'lamp';
    for (const [cell, initial] of Object.entries(switches)) {
      const tile = tiles[index(cell)];
      tile.fixed = false;
      tile.initial = initial;
    }
    return {id,cols,rows,tiles,par};
  }
  const levels = layouts.map(compile);
  const topologies = new WeakMap();
  function topology(level) {
    if (topologies.has(level)) return topologies.get(level);
    const {tiles,cols,rows} = level;
    const neighbors = tiles.map((_,i) => {
      const x = i % cols, y = Math.floor(i / cols);
      return directions.map(([dx,dy]) => {
        const nx=x+dx, ny=y+dy;
        return nx>=0 && nx<cols && ny>=0 && ny<rows ? ny*cols+nx : -1;
      });
    });
    const source = tiles.findIndex(tile => tile.type === 'source');
    const lamps = tiles.filter(tile => tile.type === 'lamp').length;
    const order = [source], visited = new Set(order);
    // This fixed order starts at the source and follows the fully connected design.
    // Restoring the first wrong piece extends an already-aligned path from the source.
    for (let head=0; head<order.length; head++) {
      const i = order[head];
      directions.forEach(([, , edge, opposite], direction) => {
        const j = neighbors[i][direction];
        if (j<0 || visited.has(j) || !(tiles[i].base & edge) || !(tiles[j].base & opposite)) return;
        order.push(j);
        visited.add(j);
      });
    }
    const result = {neighbors,source,lamps,order};
    topologies.set(level,result);
    return result;
  }
  function maskAt(level, turns, i) {
    const tile = level.tiles[i];
    return tile.fixed ? tile.base : rotateMask(tile.base, turns?.[i] ?? tile.initial);
  }
  function trace(level, turns) {
    const {source,neighbors,lamps} = topology(level);
    const queue = [source], litIndices = new Set(queue), litLamps = new Set();
    for (let head=0; head<queue.length; head++) {
      const i = queue[head], mask = maskAt(level,turns,i);
      if (level.tiles[i].type === 'lamp') litLamps.add(i);
      for (let d=0; d<4; d++) {
        const [, , edge, opposite] = directions[d];
        if (!(mask & edge)) continue;
        const next = neighbors[i][d];
        if (next<0 || litIndices.has(next) || !(maskAt(level,turns,next) & opposite)) continue;
        litIndices.add(next);
        queue.push(next);
      }
    }
    return {litIndices,litLamps,won:litLamps.size === lamps};
  }
  function hint(level, turns) {
    if (trace(level,turns).won) return null;
    for (const i of topology(level).order) {
      if (maskAt(level,turns,i) !== level.tiles[i].base) return i;
    }
    return null;
  }
  globalThis.LanternEngine = Object.freeze({levels, rotateMask, trace, hint});
})();
