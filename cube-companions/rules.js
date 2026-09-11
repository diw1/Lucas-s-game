export const species = {
  sprig: {name:'Spriglet',type:'leaf',color:'#73af49',accent:'#d5e96a',max:44,power:12,move:'Vine Whip',description:'A leafy little fox with a fearless heart.'},
  ember: {name:'Embercub',type:'fire',color:'#e78243',accent:'#ffd15e',max:48,power:13,move:'Spark Pounce',description:'Warm paws. Big courage. Slightly singed ears.'},
  bubble: {name:'Bubblit',type:'water',color:'#54b6d1',accent:'#b4eef2',max:48,power:11,move:'Bubble Burst',description:'A calm cube turtle that never gives up.'},
  pebble: {name:'Pebblop',type:'stone',color:'#a599bc',accent:'#e4d8ed',max:38,power:10,move:'Rock Roll',description:'A round-hearted rock in a very square world.'},
  moss: {name:'Mossjaw',type:'leaf',color:'#4e895a',accent:'#c8d66d',max:64,power:12,move:'Grove Slam',description:'The ranger’s loyal grove guardian.'},
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
export const collectibleIds=['sprig','ember','bubble','pebble','brawl','fairy','steel','venom','mire','jab','otter'];
export const typeIcons={leaf:'🌿',fire:'🔥',water:'💧',stone:'🪨',fighting:'🥊',fairy:'✨',steel:'⚙️',poison:'☠️'};
export const creatureTypes=c=>{const s=species[typeof c==='string'?c:c.id];return [s.type,s.secondary].filter(Boolean);};
export const typeLabel=c=>creatureTypes(c).map(t=>`${typeIcons[t]} ${t}`).join(' + ');
export const matchup=(a,d)=>Math.max(...creatureTypes(a).map(t=>creatureTypes(d).reduce((f,v)=>f*typeFactor(t,v),1)));
export const bossTeam=['ember','bubble','brawl','fairy','steel'];
export const strengths={fire:['leaf','steel'],leaf:['water'],water:['fire','stone'],stone:['fire','poison'],fighting:['stone','steel'],fairy:['fighting'],steel:['fairy','stone','poison'],poison:['leaf','fairy']};
export const makeCreature = id => ({id,hp:species[id].max,max:species[id].max,xp:0,stage:0});
export function damage(attacker,defender,move='skill',guard=false){
  const a=species[attacker.id],d=species[defender.id];
  const factor=move==='skill'?matchup(attacker,defender):1;
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

export const typeFactor=(a,d)=>strengths[a]?.includes(d)?1.5:strengths[d]?.includes(a)?.75:1;
export const evolutionCost=c=>[80,160,500,null][c.stage||0];
export const companionName=c=>(c.rare?'✦ Rare ':'')+['','Super ','Royal ','Mega '][c.stage||0]+species[c.id].name;
export function gainXP(c,amount){c.xp=(c.xp||0)+amount;}
export function evolve(c){const cost=evolutionCost(c);if(cost===null||(c.xp||0)<cost)return false;c.xp-=cost;c.stage=(c.stage||0)+1;c.max=species[c.id].max+c.stage*18;c.hp=c.max;return true;}
export function bossAt(index=0){const names=['Ranger Fern','Flame Keeper Ash','Tide Captain Marina','Iron Master Flint','Star Guardian Nova'];return {index,name:names[index%names.length],rank:index+1,team:bossTeam.map((_,i)=>collectibleIds[(collectibleIds.indexOf(bossTeam[i])+index)%collectibleIds.length])};}
export function bossCreature(boss,round){const c=makeCreature(boss.team[round]),growth=Math.min(boss.index,8);c.max+=growth*6;c.hp=c.max;c.bonus=growth;return c;}

export function completeBoss(state){if(!state.battle?.trainer||state.battle.enemy.hp>0||state.battle.round!==4||state.battle.rewarded)return false;state.battle.rewarded=true;state.badge=true;state.bossIndex++;state.party.forEach(c=>{gainXP(c,40);c.hp=c.max;});return true;}
