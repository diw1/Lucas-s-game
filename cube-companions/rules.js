import {typeIcons,typeText,strengths,typeFactor} from './types.js?v=types18';
export {typeIcons,typeText,strengths,typeFactor};
export const species = {
  sprig: {name:'Spriglet',type:'grass',color:'#73af49',accent:'#d5e96a',max:44,power:12,move:'Vine Whip',description:'A leafy little fox with a fearless heart.'},
  ember: {name:'Embercub',type:'fire',color:'#e78243',accent:'#ffd15e',max:48,power:13,move:'Spark Pounce',description:'Warm paws. Big courage. Slightly singed ears.'},
  bubble: {name:'Bubblit',type:'water',color:'#54b6d1',accent:'#b4eef2',max:48,power:11,move:'Bubble Burst',description:'A calm cube turtle that never gives up.'},
  pebble: {name:'Pebblop',type:'rock',color:'#a599bc',accent:'#e4d8ed',max:38,power:10,move:'Rock Roll',description:'A round-hearted rock in a very square world.'},
  moss: {name:'Mossjaw',type:'grass',color:'#4e895a',accent:'#c8d66d',max:64,power:12,move:'Grove Slam',description:'The ranger’s loyal grove guardian.'},
  brawl: {name:'Brawbun',type:'fighting',color:'#c36d62',accent:'#f2ccb6',max:46,power:12,move:'Comet Punch',description:'Small paws, a mighty punch, and a very bouncy step.'},
  fairy: {name:'Glimsy',type:'fairy',color:'#d783bd',accent:'#f9dfee',max:42,power:12,move:'Starlight Swirl',description:'A little daydream with a pocket full of starlight.'},
  steel: {name:'Ferrit',type:'steel',color:'#839caf',accent:'#d3edf0',max:54,power:11,move:'Iron Charge',description:'An iron-clad friend with a soft spot for adventure.'}
};
Object.assign(species,{
 venom:{name:'Venoodle',type:'poison',color:'#a06bb9',accent:'#d9ef78',max:48,power:12,move:'Venom Puff',size:.78,description:'A tiny mushroom serpent with a surprisingly big hiss.'},
 mire:{name:'Mirefin',type:'water',secondary:'poison',color:'#559e97',accent:'#c792da',max:52,power:12,move:'Toxic Wave',size:1.05,description:'A wide-finned swamp swimmer. Water + Poison.'},
 jab:{name:'Jabtoad',type:'fighting',secondary:'poison',color:'#9878b5',accent:'#c6e66e',max:56,power:12,move:'Venom Jab',size:1.2,description:'A stout toad with huge boxing paws. Fighting + Poison.'},
 otter:{name:'Tidekick',type:'fighting',secondary:'water',color:'#5a9dbd',accent:'#e5d2a2',max:48,power:12,move:'Surf Kick',size:.9,description:'A speedy river otter with a paddle tail. Fighting + Water.'}
});
Object.assign(species,{
 puff:{name:'Pufflet',type:'normal',color:'#c9b99b',accent:'#f4e5c7',max:46,power:12,move:'Cozy Tackle',size:.85,description:'A fluffy little cub with a curled tail. Normal · 一般.'},
 volt:{name:'Voltkit',type:'electric',color:'#e5c641',accent:'#fff09a',max:44,power:12,move:'Spark Dash',size:.8,description:'A bright-eared kitten with a lightning tail. Electric · 电.'},
 frost:{name:'Frostseal',type:'ice',color:'#8dced9',accent:'#e5faff',max:50,power:12,move:'Ice Shard',size:1.05,description:'A frosty seal with crystal flippers. Ice · 冰.'},
 dune:{name:'Dunemole',type:'ground',color:'#bc936b',accent:'#e5c695',max:54,power:12,move:'Sand Quake',size:1.05,description:'A sturdy digger with broad paws. Ground · 地面, different from Rock.'},
 sky:{name:'Skydove',type:'flying',color:'#a5bce2',accent:'#eef0fa',max:44,power:12,move:'Gust Wings',size:.85,description:'A little bird with big sky-blue wings. Flying · 飞行.'},
 prism:{name:'Prismew',type:'psychic',color:'#d688bb',accent:'#f5c7e9',max:44,power:12,move:'Mind Pulse',size:.85,description:'A floating dreamer with a shining forehead gem. Psychic · 超能力.'},
 grub:{name:'Grubloom',type:'bug',color:'#a6b64c',accent:'#e5eea2',max:46,power:12,move:'Silk Strike',size:.75,description:'A tiny caterpillar with long feelers. Bug · 虫.'},
 wisp:{name:'Wispurr',type:'ghost',color:'#8e80b3',accent:'#d1c6f0',max:44,power:12,move:'Spirit Spark',size:.8,description:'A playful spirit with a wispy tail. Ghost · 幽灵.'},
 drake:{name:'Drakeling',type:'dragon',color:'#8e83c9',accent:'#d7c7ef',max:54,power:12,move:'Dragon Roar',size:1.15,description:'A proud little dragon with horns and a long tail. Dragon · 龙.'},
 shade:{name:'Shadeling',type:'dark',color:'#69657e',accent:'#b9a0c6',max:48,power:12,move:'Night Pounce',size:.9,description:'A quiet night fox with tall pointed ears. Dark · 恶.'}
});
export const collectibleIds=['sprig','ember','bubble','pebble','brawl','fairy','steel','venom','mire','jab','otter','puff','volt','frost','dune','sky','prism','grub','wisp','drake','shade'];
export const creatureTypes=c=>{const s=species[typeof c==='string'?c:c.id];return [s.type,s.secondary].filter(Boolean);};
export const typeLabel=c=>creatureTypes(c).map(t=>typeText(t)).join(' + ');
export const attackType=(a,d)=>creatureTypes(a).reduce((best,t)=>creatureTypes(d).reduce((f,v)=>f*typeFactor(t,v),1)>creatureTypes(d).reduce((f,v)=>f*typeFactor(best,v),1)?t:best);
export const matchup=(a,d)=>Math.max(...creatureTypes(a).map(t=>creatureTypes(d).reduce((f,v)=>f*typeFactor(t,v),1)));
export const bossTeam=['ember','bubble','brawl','fairy','steel'];
export const makeCreature = id => ({id,hp:species[id].max,max:species[id].max,xp:0,stage:0});
export function damage(attacker,defender,move='skill',guard=false){
  const a=species[attacker.id],d=species[defender.id];
  const factor=move==='skill'?matchup(attacker,defender):1;
  if(factor===0)return 0;
  return Math.max(1,Math.round((move==='skill'?a.power+(attacker.stage||0)*5+(attacker.stage===3?100:0)+(attacker.bonus||0):8)*factor*(guard?.4:1)));
}
export const catchChance = enemy => enemy.hp/enemy.max<=.35?1:enemy.hp/enemy.max<=.6?.7:.25;
export function attack(attacker,defender,move='skill',guard=false){const n=damage(attacker,defender,move,guard);defender.hp=Math.max(0,defender.hp-n);return n;}
export function tryCapture(enemy,roll=Math.random()){return roll<catchChance(enemy);}
export function touching(player,target,now){return target.armed!==false&&now>=(target.cooldown||0)&&Math.hypot(player.x-target.x,player.z-target.z)<=1.05;}
export function nextBossRound(battle,party){
  if(!battle.trainer||battle.enemy.hp>0||battle.round>=bossTeam.length-1)return false;
  battle.round++;battle.enemy=battle.boss?bossCreature(battle.boss,battle.round):makeCreature(bossTeam[battle.round]);battle.heals=2;
  party.forEach(c=>c.hp=c.max);
  return true;
}
export const directions={w:[0,-1],arrowup:[0,-1],s:[0,1],arrowdown:[0,1],a:[-1,0],arrowleft:[-1,0],d:[1,0],arrowright:[1,0]};
export function movementStep(pressed,dt){
  const key=[...pressed].reverse().find(k=>directions[k]);
  if(!key)return {dx:0,dz:0};
  const [sx,sy]=directions[key];return {dx:(sx+sy)*dt*3.2,dz:(sy-sx)*dt*3.2};
}

export const evolutionCost=c=>[80,160,500,null][c.stage||0];
export const companionName=c=>(c.rare?'✦ Rare ':'')+['','Super ','Royal ','Mega '][c.stage||0]+species[c.id].name;
export function gainXP(c,amount){c.xp=(c.xp||0)+amount;}
export function evolve(c){const cost=evolutionCost(c);if(cost===null||(c.xp||0)<cost)return false;c.xp-=cost;c.stage=(c.stage||0)+1;c.max=species[c.id].max+c.stage*18;c.hp=c.max;return true;}
export function bossAt(index=0){const names=['Ranger Fern','Flame Keeper Ash','Tide Captain Marina','Iron Master Flint','Star Guardian Nova'];return {index,name:names[index%names.length],rank:index+1,team:bossTeam.map((_,i)=>collectibleIds[(collectibleIds.indexOf(bossTeam[i])+index)%collectibleIds.length])};}
export function bossCreature(boss,round){const c=makeCreature(boss.team[round]),growth=Math.min(boss.index,8);c.max+=growth*6;c.hp=c.max;c.bonus=growth;return c;}

export function completeBoss(state){if(!state.battle?.trainer||state.battle.enemy.hp>0||state.battle.round!==4||state.battle.rewarded)return false;state.battle.rewarded=true;state.badge=true;state.bossIndex++;state.party.forEach(c=>{gainXP(c,40);c.hp=c.max;});return true;}
