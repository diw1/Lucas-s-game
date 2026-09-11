import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCreature,damage,attack,catchChance,tryCapture,bossTeam,nextBossRound,touching,movementStep,species} from '../cube-companions/rules.js';
import {createWorld} from '../cube-companions/world.js';

test('capture thresholds include the guarantee boundary and reject a high roll at full HP',()=>{
  const c=makeCreature('pebble');
  assert.equal(catchChance(c),.25);
  assert.equal(tryCapture(c,.9),false);
  c.hp=c.max*.6;assert.equal(catchChance(c),.7);
  c.hp=c.max*.35;assert.equal(catchChance(c),1);
  assert.equal(tryCapture(c,.999999),true);
});
test('element advantages, resistance, and gentle attacks behave differently',()=>{
  const fire=makeCreature('ember'),leaf=makeCreature('sprig'),water=makeCreature('bubble');
  assert.equal(damage(fire,leaf),20);
  assert.equal(damage(fire,water),10);
  assert.equal(damage(fire,water,'tap'),8);
  assert.equal(damage(water,fire),17);
});
test('guard reduces retaliation and attacks never create negative HP',()=>{
  const boss=makeCreature('moss'),a=makeCreature('ember');
  assert.equal(damage(boss,a,'skill',true),4);
  a.hp=2;attack(boss,a);assert.equal(a.hp,0);
});
test('every starter can weaken Pebblop to guaranteed capture without fainting',()=>{
  for(const id of collectibleIds){
    const a=makeCreature(id),wild=makeCreature('pebble');
    while(catchChance(wild)<1){attack(a,wild);assert.ok(wild.hp>0);attack(wild,a);}
    assert.ok(a.hp>0,`${id} must survive the introductory encounter`);
  }
});
test('five sequential boss rounds are winnable with every starter plus Pebblop',()=>{
  for(const id of collectibleIds){
    const party=[makeCreature(id),makeCreature('pebble')],b={trainer:true,round:0,heals:2,enemy:makeCreature(bossTeam[0])};
    let completed=0;
    do{
      let i=0;
      for(let t=0;t<30&&b.enemy.hp>0;t++){
        const a=party[i];let guard=false;
        if(a.hp<=a.max-14&&b.heals){a.hp+=14;b.heals--;guard=true;}else attack(a,b.enemy);
        if(!b.enemy.hp)break;
        attack(b.enemy,a,'skill',guard);
        if(!a.hp){i++;if(i===party.length)break;}
      }
      assert.equal(b.enemy.hp,0,`${id} team must beat round ${b.round+1}`);completed++;
    }while(nextBossRound(b,party));
    assert.equal(completed,5);assert.equal(b.round,4);
  }
});
test('boss advance only follows a knockout, restores the party, and stops at five',()=>{
  const party=[makeCreature('ember')],b={trainer:true,round:0,heals:0,enemy:makeCreature(bossTeam[0])};party[0].hp=0;
  assert.equal(nextBossRound(b,party),false);b.enemy.hp=0;assert.equal(nextBossRound(b,party),true);
  assert.equal(party[0].hp,party[0].max);assert.equal(b.heals,2);assert.equal(b.enemy.id,bossTeam[1]);
  b.round=4;b.enemy.hp=0;assert.equal(nextBossRound(b,party),false);
});
test('touch starts encounters without a key and respects retreat latch and cooldown',()=>{
  const p={x:0,z:0},w={x:1,z:0,cooldown:0};assert.equal(touching(p,w,100),true);
  w.armed=false;assert.equal(touching(p,w,99999),false);w.armed=true;w.cooldown=500;
  assert.equal(touching(p,w,499),false);assert.equal(touching(p,w,500),true);
  w.x=1.1;assert.equal(touching(p,w,500),false);
});
test('single and multiple direction keys always move straight on screen',()=>{
  for(const pressed of [['w'],['a'],['s'],['d'],['w','d'],['a','s']]){
    const {dx,dz}=movementStep(new Set(pressed),.1),screenX=dx-dz,screenY=(dx+dz)*.48;
    assert.ok(screenX===0||screenY===0);
  }
  assert.deepEqual(movementStep(new Set(['w','d']),.1),movementStep(new Set(['d']),.1));
});
test('endless world preserves nearby cooldowns, supplies new types, and resets',()=>{
  const world=createWorld(),origin={x:0,z:0},first=world.wildNear(origin,15),ids=new Set(first.map(c=>c.id));
  for(const id of ['brawl','fairy','steel']){assert.ok(ids.has(id));assert.ok(species[id].move);}
  const c=first.find(c=>c.id==='pebble');c.cooldown=1234;
  assert.equal(world.wildNear(origin,15).find(v=>v===c).cooldown,1234);
  for(const p of [{x:1000,z:-1000},{x:-100000,z:100000}]){
    assert.ok(world.wildNear(p,25).length);assert.match(world.tileColor(p.x,p.z),/^#[0-9a-f]{6}$/);
  }
  world.reset();assert.equal(world.wildNear(origin,15).find(v=>v.id==='pebble').cooldown,0);
});
import {evolve,evolutionCost,gainXP,companionName,bossAt,bossCreature,typeFactor,matchup,collectibleIds} from '../cube-companions/rules.js';
test('XP never evolves automatically, spending is gated, and both manual evolutions improve combat',()=>{
 for(const id of collectibleIds){const c=makeCreature(id),base=damage(c,makeCreature(id));gainXP(c,79);assert.equal(evolve(c),false);gainXP(c,1);assert.equal(c.stage,0);assert.equal(evolve(c),true);assert.equal(c.xp,0);assert.equal(c.max,species[id].max+18);assert.ok(damage(c,makeCreature(id))>base);assert.match(companionName(c),/^Super /);gainXP(c,200);assert.equal(evolve(c),true);assert.equal(c.xp,40);assert.equal(c.hp,c.max);assert.equal(evolutionCost(c),500);assert.equal(evolve(c),false);gainXP(c,460);assert.equal(c.stage,2);assert.equal(evolve(c),true);assert.equal(c.xp,0);assert.equal(c.stage,3);assert.equal(evolutionCost(c),null);assert.equal(evolve(c),false);}
});
test('successive bosses use their own roster through all five rounds without changing collection or XP',()=>{
 for(const index of [0,1,4,5,15]){const boss=bossAt(index),party=[makeCreature('ember'),makeCreature('bubble')];gainXP(party[0],90);evolve(party[0]);const battle={trainer:true,boss,round:0,enemy:bossCreature(boss,0)};for(let round=0;round<5;round++){assert.equal(battle.enemy.id,boss.team[round]);assert.equal(battle.enemy.max,species[boss.team[round]].max+Math.min(index,8)*6);battle.enemy.hp=0;assert.equal(nextBossRound(battle,party),round<4);}assert.equal(party[0].xp,10);assert.equal(party[0].stage,1);assert.equal(party.length,2);assert.equal(bossAt(index+1).rank,boss.rank+1);}
});
test('type guide factors agree with damage for every pair, and gentle bump ignores typing',()=>{for(const a of collectibleIds)for(const d of collectibleIds){const attacker=makeCreature(a),defender=makeCreature(d);assert.equal(damage(attacker,defender),Math.round(species[a].power*matchup(attacker,defender)));assert.equal(damage(attacker,defender,'tap'),8);}});

import {completeBoss} from '../cube-companions/rules.js';
test('boss completion preserves the party and rewards exactly once only after the fifth knockout',()=>{const party=[makeCreature('ember'),makeCreature('steel')],state={party,bossIndex:0,battle:{trainer:true,round:3,enemy:{hp:0}}};gainXP(party[0],80);evolve(party[0]);assert.equal(completeBoss(state),false);state.battle.round=4;state.battle.enemy.hp=1;assert.equal(completeBoss(state),false);state.battle.enemy.hp=0;assert.equal(completeBoss(state),true);assert.equal(state.bossIndex,1);assert.equal(state.party,party);assert.equal(party[0].stage,1);assert.equal(party[0].xp,40);assert.equal(party[1].xp,40);assert.equal(completeBoss(state),false);assert.equal(state.bossIndex,1);});
import {encodeSave,decodeSave,readSave,writeSave} from '../cube-companions/save.js';
import {regions,regionAt,chests,openChest,quests,claimQuest} from '../cube-companions/adventure.js';
import {bossIntent,resolveBossAction,talentHit} from '../cube-companions/combat.js';
const adventureState=()=>({party:[{...makeCreature('ember'),rare:true,stage:1,max:66,hp:42,xp:55}],active:0,cubes:7,wins:3,bossIndex:2,seen:['ember'],visited:['grove'],opened:[],claimed:[],forms:['ember:1:rare'],captures:3,effectiveWins:1});
test('save restores growth, rare forms, progress and position and rejects broken saves',()=>{const state=adventureState(),restored=decodeSave(encodeSave(state,{x:30,z:-4}));assert.deepEqual(restored.party,state.party);assert.equal(restored.bossIndex,2);assert.deepEqual(restored.player,{x:30,z:-4});assert.deepEqual(restored.forms,state.forms);assert.throws(()=>decodeSave('{broken'));assert.throws(()=>decodeSave('{"version":9}'));assert.equal(readSave({getItem(){throw Error();}}).error,true);assert.equal(writeSave({setItem(){throw Error();}},state,{x:0,z:0}),false);});
test('save sanitizes invalid stats and rejects unknown species',()=>{let d=JSON.parse(encodeSave(adventureState(),{x:0,z:0}));d.party[0].stage=50;d.party[0].hp=999;d.active=99;const r=decodeSave(JSON.stringify(d));assert.equal(r.party[0].stage,3);assert.equal(r.party[0].hp,r.party[0].max);assert.equal(r.active,0);d.party[0].id='missing';assert.throws(()=>decodeSave(JSON.stringify(d)));});
test('each region has stable terrain and its own wild creatures',()=>{const world=createWorld();for(const region of regions){assert.equal(regionAt(region.x,region.z).id,region.id);if(region.id!=='grove'){assert.ok(region.colors.includes(world.tileColor(region.x,region.z)));const wild=world.wildNear(region,10);assert.ok(wild.length);for(const c of wild)assert.ok(regionAt(c.x,c.z).species.includes(c.id));}}});
test('chest and quest rewards cannot be claimed twice or early',()=>{const s=adventureState();assert.equal(openChest(s,'bad'),false);assert.equal(openChest(s,chests[0].id),true);assert.equal(s.cubes,10);assert.equal(s.party[0].xp,75);assert.equal(openChest(s,chests[0].id),false);assert.equal(claimQuest(s,'travel'),false);assert.equal(claimQuest(s,'catch3'),true);assert.equal(s.party[0].xp,115);assert.equal(claimQuest(s,'catch3'),false);const restored=decodeSave(encodeSave(s,{x:0,z:0}));assert.equal(openChest(restored,chests[0].id),false);assert.equal(claimQuest(restored,'catch3'),false);});
test('boss charges before burst, guard helps, and shield and healing have distinct turns',()=>{const b={trainer:true,boss:bossAt(1),turn:0,enemy:makeCreature('ember')},a=makeCreature('bubble');assert.equal(bossIntent(b).kind,'charge');resolveBossAction(b,a);assert.equal(a.hp,a.max);b.turn=1;assert.equal(bossIntent(b).kind,'burst');const guarded=resolveBossAction(b,a,true).damage;assert.ok(resolveBossAction(b,a,false).damage>guarded);b.boss=bossAt(3);b.turn=2;resolveBossAction(b,a);assert.equal(b.enemyShield,true);b.boss=bossAt(2);b.enemy.hp=1;resolveBossAction(b,a);assert.equal(b.enemy.hp,13);});
test('evolution skills have distinct healing, shielding and burst effects',()=>{const leaf={...makeCreature('sprig'),stage:1,hp:10},enemy=makeCreature('bubble');talentHit(leaf,enemy);assert.ok(leaf.hp>10);const steel={...makeCreature('steel'),stage:1};assert.equal(talentHit(steel,makeCreature('ember')).guard,true);const fire={...makeCreature('ember'),stage:1};assert.ok(talentHit(fire,makeCreature('bubble')).damage>damage(fire,makeCreature('bubble')));});

test('dual types combine defenses and choose the better attacking element',()=>{
 assert.equal(matchup(makeCreature('sprig'),makeCreature('mire')),1.125);
 assert.equal(matchup(makeCreature('jab'),makeCreature('steel')),1.5);
 assert.equal(matchup(makeCreature('pebble'),makeCreature('mire')),1.125);
 assert.equal(matchup(makeCreature('venom'),makeCreature('fairy')),1.5);
});
test('every Mega can defeat ordinary wild creatures with a skill while tap stays gentle',()=>{
 for(const id of collectibleIds){const c=makeCreature(id);c.xp=740;evolve(c);evolve(c);evolve(c);assert.equal(c.stage,3);for(const target of collectibleIds){const d=makeCreature(target);assert.ok(damage(c,d)>=d.max,`${id} vs ${target}`);assert.equal(damage(c,d,'tap'),8);}}
});
test('pre-Mega version-one saves retain Royal stats, XP, party, rewards and position',()=>{
 const old={version:1,party:[{id:'bubble',stage:2,xp:731,max:84,hp:39,rare:false},{id:'steel',stage:0,xp:20,max:54,hp:54,rare:true}],active:1,cubes:17,wins:12,bossIndex:4,seen:['bubble','steel'],visited:['grove','lake'],opened:['chest-lake'],claimed:['travel'],forms:['bubble:2'],captures:9,effectiveWins:3,player:{x:12,z:29}};
 const loaded=decodeSave(JSON.stringify(old));assert.deepEqual(loaded.party,old.party);for(const k of ['active','cubes','wins','bossIndex','captures','effectiveWins'])assert.equal(loaded[k],old[k]);for(const k of ['seen','visited','opened','claimed','forms','player'])assert.deepEqual(loaded[k],old[k]);
 const mega=loaded.party[0];evolve(mega);assert.equal(mega.stage,3);assert.equal(mega.xp,231);assert.deepEqual(decodeSave(encodeSave(loaded,loaded.player)).party,loaded.party);
});
test('automatic upgrade backup is made once before changing the original save',()=>{
 const map=new Map([['cube-companions-adventure-v1','old exact bytes']]);const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 assert.equal(writeSave(storage,adventureState(),{x:0,z:0}),true);assert.equal(map.get('cube-companions-adventure-v1-before-mega'),'old exact bytes');writeSave(storage,adventureState(),{x:2,z:3});assert.equal(map.get('cube-companions-adventure-v1-before-mega'),'old exact bytes');
});
