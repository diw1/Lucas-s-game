import {species,damage,attack} from './rules.js?v=types18';
export const talents={
 poison:{name:'Venom Bloom',detail:'A powerful cloud of spores (1.6× skill damage).',kind:'burst'},
 fire:{name:'Blazing Burst',detail:'A powerful flame strike (1.6× skill damage).',kind:'burst'},
 water:{name:'Healing Tide',detail:'Attack and restore up to 12 HP.',kind:'drain'},
 grass:{name:'Leech Vines',detail:'Attack and absorb half the damage as HP.',kind:'leech'},
 rock:{name:'Crystal Armor',detail:'Attack and block 60% of the next hit.',kind:'shield'},
 fighting:{name:'Meteor Combo',detail:'A powerful combo (1.6× skill damage).',kind:'burst'},
 fairy:{name:'Starlight Wish',detail:'Attack and restore up to 12 HP.',kind:'drain'},
 steel:{name:'Iron Fortress',detail:'Attack and block 60% of the next hit.',kind:'shield'}
};
for(const [type,name,kind] of [
 ['normal','Brave Charge','burst'],['electric','Thunder Dash','burst'],['ice','Glacier Guard','shield'],['ground','Dune Fortress','shield'],['flying','Hurricane Dive','burst'],['psychic','Dream Renewal','drain'],['bug','Silk Shelter','shield'],['ghost','Spirit Drain','leech'],['dragon','Dragon Nova','burst'],['dark','Midnight Rush','burst']
])talents[type]={name,kind,detail:kind==='burst'?'A powerful strike (1.6× skill damage).':kind==='shield'?'Attack and block 60% of the next hit.':kind==='drain'?'Attack and restore up to 12 HP.':'Attack and absorb half the damage as HP.'};
export function talentHit(a,d,shield=false){const t=talents[species[a.id].type];const n=Math.max(0,Math.round(damage(a,d,'skill',shield)*(t.kind==='burst'?1.6:1)));const actual=Math.min(d.hp,n);d.hp=Math.max(0,d.hp-n);const heal=t.kind==='leech'?Math.round(actual/2):t.kind==='drain'?12:0;a.hp=Math.min(a.max,a.hp+heal);return {damage:n,guard:t.kind==='shield'};}
export function bossIntent(b){if(!b.trainer)return {kind:'attack',name:'Attack',detail:'A normal type attack.'};const phase=b.turn%3,style=b.boss.index%5;
 if(phase===0)return {kind:'charge',name:'Gathering power',detail:'No attack this turn. A powerful strike comes next — prepare to Guard!'};
 if(phase===1)return {kind:'burst',name:['Grove Slam','Volcanic Eruption','Tidal Wave','Iron Avalanche','Starfall'][style],detail:'A 1.8× attack this turn. Guard or use a defensive evolution skill.'};
 return style===3?{kind:'shield',name:'Iron Wall',detail:'Raises a shield this turn. Your next attack deals 60% less damage.'}:style===2||style===4?{kind:'heal',name:'Renewal',detail:'Restores up to 12 HP instead of attacking.'}:{kind:'attack',name:'Quick Strike',detail:'A normal type attack this turn.'};
}
export function resolveBossAction(b,a,guard=false){const intent=bossIntent(b);if(intent.kind==='charge')return {damage:0};if(intent.kind==='shield'){b.enemyShield=true;return {damage:0};}if(intent.kind==='heal'){b.enemy.hp=Math.min(b.enemy.max,b.enemy.hp+12);return {damage:0};}const n=Math.round(damage(b.enemy,a,'skill',guard)*(intent.kind==='burst'?1.8:1));a.hp=Math.max(0,a.hp-n);return {damage:n};}
