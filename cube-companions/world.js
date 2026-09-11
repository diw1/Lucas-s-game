import {regionAt,regions,chests} from './adventure.js?v=types18';
import { species } from './rules.js?v=types18';

const CHUNK_SIZE = 12;
const SPECIES_IDS = ['sprig', 'ember', 'bubble', 'pebble', 'brawl', 'fairy', 'steel'];
const STARTERS = [
  ['puff', -4, 4],
  ['pebble', -4, 1], ['sprig', 4, 1], ['bubble', -3, -3],
  ['ember', 4, -3], ['brawl', -7, -1], ['fairy', 7, 4], ['steel', -5, -7],
];
const CENTRAL_TREES = [[-8, 6], [8, 7], [-8, -5], [8, -7], [-3, 8], [4, 8]];
const LANDMARKS = [[0, 3.5], [0, -5]];

// Integer hashing makes every chunk reproducible without a growing world save.
function hash(x, z, salt = 0) {
  let value = Math.imul(x | 0, 374761393) ^ Math.imul(z | 0, 668265263) ^ Math.imul(salt, 1597334677);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return (value ^ (value >>> 16)) >>> 0;
}
const unit = (x, z, salt) => hash(x, z, salt) / 4294967296;
const distanceSquared = (a, b) => (a.x - b.x) ** 2 + (a.z - b.z) ** 2;
const outsideCenter = (x, z) => Math.abs(x) > 9 || Math.abs(z) > 9;

function creature(id, x, z, phase) {
  return { x, z, homeX: x, homeZ: z, id, kind: 'wild', rare:hash(Math.round(x*10),Math.round(z*10),99)%20===0, name: species[id]?.name ?? id, phase, cooldown: 0 };
}

function initialWild() {
  return STARTERS.map(([id, x, z], i) => creature(id, x, z, unit(x, z, i + 1) * Math.PI * 2));
}

// Two separated spawn slots per chunk leave plenty of room to run between fights.
function chunkWild(cx, cz) {
  const wild = [];
  for (let i = 0; i < 2; i++) {
    const slot = i === 0 ? 3 : 9;
    const x = cx * CHUNK_SIZE + slot + (unit(cx, cz, 10 + i) - 0.5) * 2;
    const z = cz * CHUNK_SIZE + slot + (unit(cx, cz, 20 + i) - 0.5) * 2;
    if (!outsideCenter(x, z)) continue;
    const pool=regionAt(x,z).species;
    const id = pool[hash(cx, cz, 30 + i) % pool.length];
    wild.push(creature(id, x, z, unit(cx, cz, 40 + i) * Math.PI * 2));
  }
  return wild;
}

function chunkTrees(cx, cz) {
  const trees = [];
  // Check neighboring raw spawn positions too, avoiding cross-chunk collisions.
  const encounters = STARTERS.map(([, x, z]) => ({ x, z }));
  for (let nx = cx - 1; nx <= cx + 1; nx++) {
    for (let nz = cz - 1; nz <= cz + 1; nz++) encounters.push(...chunkWild(nx, nz));
  }
  for (let i = 0; i < 2; i++) {
    const x = cx * CHUNK_SIZE + 1.5 + unit(cx, cz, 50 + i) * 9;
    const z = cz * CHUNK_SIZE + 1.5 + unit(cx, cz, 60 + i) * 9;
    if (!outsideCenter(x, z)) continue;
    if([...regions,...chests].some(p=>(p.x-x)**2+(p.z-z)**2<9))continue;
    if (encounters.some(w => distanceSquared(w, { x, z }) < 2.6 ** 2)) continue;
    if (LANDMARKS.some(([lx, lz]) => (x - lx) ** 2 + (z - lz) ** 2 < 3 ** 2)) continue;
    if (trees.some(([tx, tz]) => (x - tx) ** 2 + (z - tz) ** 2 < 3 ** 2)) continue;
    trees.push([x, z]);
  }
  return trees;
}

/**
 * Endless meadow data with no DOM or rendering dependency.
 * wildNear(player, radius=16): stable, mutable encounter objects inside the radius.
 * treesNear(player, radius=16): [x,z] positions inside the radius.
 * tileColor(x,z): hex terrain color; reset(): fresh central encounters and chunks.
 * Nearby chunks retain mutations. Chunks left far behind are discarded and
 * regenerate fresh when revisited. Radius is capped at 64 to bound each query.
 */
export function createWorld() {
  let centralWild = initialWild();
  const centralTrees = CENTRAL_TREES.map(position => [...position]);
  const chunks = new Map();

  function nearbyChunks(player, radius) {
    const safeRadius = Number.isFinite(radius) ? Math.max(0, Math.min(64, radius)) : 16;
    const cx = Math.floor(player.x / CHUNK_SIZE), cz = Math.floor(player.z / CHUNK_SIZE);
    const reach = Math.ceil(safeRadius / CHUNK_SIZE) + 1;
    const retain = reach + 2;
    for (const [key, chunk] of chunks) {
      if (Math.abs(chunk.cx - cx) > retain || Math.abs(chunk.cz - cz) > retain) chunks.delete(key);
    }
    const result = [];
    for (let x = cx - reach; x <= cx + reach; x++) {
      for (let z = cz - reach; z <= cz + reach; z++) {
        const key = `${x},${z}`;
        let chunk = chunks.get(key);
        if (!chunk) {
          chunk = { cx: x, cz: z, wild: chunkWild(x, z), trees: chunkTrees(x, z) };
          chunks.set(key, chunk);
        }
        result.push(chunk);
      }
    }
    return { chunks: result, radiusSquared: safeRadius ** 2 };
  }

  function wildNear(player, radius = 16) {
    const view = nearbyChunks(player, radius);
    const result = centralWild.filter(w => distanceSquared(w, player) <= view.radiusSquared);
    for (const chunk of view.chunks) {
      for (const w of chunk.wild) if (distanceSquared(w, player) <= view.radiusSquared) result.push(w);
    }
    return result;
  }

  function treesNear(player, radius = 16) {
    const view = nearbyChunks(player, radius);
    const result = centralTrees.filter(([x, z]) => (x - player.x) ** 2 + (z - player.z) ** 2 <= view.radiusSquared);
    for (const chunk of view.chunks) {
      for (const tree of chunk.trees) {
        if ((tree[0] - player.x) ** 2 + (tree[1] - player.z) ** 2 <= view.radiusSquared) result.push(tree);
      }
    }
    return result;
  }

  function tileColor(x, z) {
    const tx = Math.floor(x), tz = Math.floor(z);
    const checker = (tx + tz) & 1;
    if (Math.abs(tx) <= 3 && tz >= -7 && tz <= -3) return checker ? '#c5bf8b' : '#b9b582';
    if ((Math.abs(tx) <= 1 && tz >= -3 && tz <= 5) || (Math.abs(tx) <= 3 && tz >= 3 && tz <= 5)) {
      return checker ? '#d1bc86' : '#c6b07c';
    }
    const biome=regionAt(tx,tz);if(biome.id!=='grove'){
      if(biome.id==='lake'){const island=(tx%12+12)%12<4&&(tz%12+12)%12<4;return island?(checker?'#d9d1a2':'#c9c590'):biome.colors[checker];}
      if(biome.id==='volcano'&&((tx+tz)%13+13)%13===0)return checker?'#f29a46':'#d8753e';
      return biome.colors[checker];
    }
    const patch = hash(Math.floor(tx / 5), Math.floor(tz / 5), 72) % 7;
    if (patch === 0) return checker ? '#8bae67' : '#85a861';
    if (patch === 1) return checker ? '#76a269' : '#709c63';
    return checker ? '#81ab68' : '#7ba562';
  }

  function reset() {
    chunks.clear();
    centralWild = initialWild();
  }

  return { wildNear, treesNear, tileColor, reset };
}
