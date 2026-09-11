import {species,makeCreature,collectibleIds} from './rules.js?v=types18';
export const SAVE_KEY='cube-companions-adventure-v1';
const list=v=>Array.isArray(v)?v.filter(x=>typeof x==='string').slice(0,1000):[];
const num=(v,f=0,max=1000000)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):f;
export function decodeSave(raw){
 const d=JSON.parse(raw);if(d.version!==1||!Array.isArray(d.party)||!d.party.length)throw Error('Unsupported save');
 const party=d.party.slice(0,collectibleIds.length*2).map(c=>{if(!species[c.id])throw Error('Unknown companion');const stage=num(c.stage,0,3),max=species[c.id].max+stage*18;return {...makeCreature(c.id),stage,max,hp:num(c.hp,max,max),xp:num(c.xp),rare:c.rare===true};});
 const position=v=>Number.isFinite(v)&&Math.abs(v)<=100000?v:0;
 return {party,active:num(d.active,0,party.length-1),cubes:num(d.cubes,5,99),wins:num(d.wins),bossIndex:num(d.bossIndex),badge:!!d.bossIndex,seen:list(d.seen),visited:list(d.visited),opened:list(d.opened),claimed:list(d.claimed),captures:num(d.captures),effectiveWins:num(d.effectiveWins),forms:list(d.forms),player:{x:position(d.player?.x),z:position(d.player?.z)}};
}
export function encodeSave(state,player){const {party,active,cubes,wins,bossIndex,seen,visited,opened,claimed,captures,effectiveWins,forms}=state;return JSON.stringify({version:1,party,active,cubes,wins,bossIndex,seen,visited,opened,claimed,captures,effectiveWins,forms,player:{x:player.x,z:player.z}});}
export function readSave(storage){try{const raw=storage.getItem(SAVE_KEY);return {data:raw?decodeSave(raw):null};}catch{return {data:null,error:true};}}
export function writeSave(storage,state,player){try{const old=storage.getItem(SAVE_KEY);if(old&&!storage.getItem(SAVE_KEY+'-before-mega'))storage.setItem(SAVE_KEY+'-before-mega',old);storage.setItem(SAVE_KEY,encodeSave(state,player));return true;}catch{return false;}}
