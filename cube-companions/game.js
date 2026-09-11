import {drawScenery} from './scenery.js?v=mega2';
import {talents,talentHit,bossIntent,resolveBossAction} from './combat.js?v=mega2';
import {regions,regionAt,chests,quests,openChest,claimQuest} from './adventure.js?v=mega2';
import {SAVE_KEY,readSave,writeSave,encodeSave,decodeSave} from './save.js?v=mega2';
import {typeIcons,typeLabel,creatureTypes,matchup,completeBoss,evolutionCost,evolve,gainXP,companionName,bossAt,bossCreature,typeFactor,species,collectibleIds,bossTeam,makeCreature,attack,catchChance,tryCapture,touching,nextBossRound,strengths,directions,movementStep} from './rules.js?v=mega2';
import {renderer,portrait} from './render.js?v=mega2';
import {createWorld} from './world.js?v=mega2';
import {bossSpecialEffect,strike,healEffect,captureEffect,switchEffect} from './effects.js?v=mega2';
import {chooseCue,drawCueRing,drawCueBrackets} from './interaction.js?v=mega2';
const $=s=>document.querySelector(s),overlay=$('#overlay'),canvas=$('#world'),ctx=canvas.getContext('2d');
const world=createWorld(),keys=new Set();
const state={party:[],active:0,cubes:5,wins:0,badge:false,bossIndex:0,seen:[],visited:[],opened:[],claimed:[],forms:[],captures:0,effectiveWins:0,mode:'starter',battle:null,safeUntil:0};
const player={x:0,z:3.5,heading:0,moving:false,runCycle:0},camera={x:0,z:3.5};
const camp={x:0,z:3.5,kind:'camp',name:'Camp'},ranger={x:0,z:-5,kind:'trainer',name:'Ranger Fern',armed:true,cooldown:0};
let nearby=null,last=0,toastTimer,currentCue=null,cueSignature='';
const cueElement=$('#interaction-cue'),reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const name=companionName;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4200);}
function panel(html,kind=''){
  overlay.innerHTML=`<section class="panel ${kind}" role="dialog" aria-modal="true">${html}</section>`;keys.clear();
  requestAnimationFrame(()=>{overlay.querySelectorAll('canvas[data-id]').forEach(c=>portrait(c,c.dataset.id,+c.dataset.stage||0,c.dataset.rare==='true'));overlay.querySelector('button:not(:disabled)')?.focus();});
}
function updateHUD(){
  for(const c of state.party){const form=`${c.id}:${c.stage||0}${c.rare?':rare':''}`;if(!state.forms.includes(form))state.forms.push(form);if(!state.seen.includes(c.id))state.seen.push(c.id);}
  saveAdventure();
  const caught=state.party.length>1,boss=bossAt(state.bossIndex);ranger.name=`Boss ${boss.rank} · ${boss.name}`;
  $('#objective').textContent=!state.party.length?'Choose your first companion':!caught?'Catch a wild companion':`Boss ${boss.rank} · ${boss.name}`;
  $('#quest-detail').textContent=!caught?'Catch creatures to earn XP. Tap Evolve when ready!':`${state.bossIndex} bosses beaten. Next challenger waits north of camp. Your team keeps growing.`;
  $('#progress').innerHTML=`<div class="steps"><div class="${state.party.length?'done':''}">${state.party.length?'✓':'○'} Choose a starter</div><div class="${caught?'done':''}">${caught?'✓':'○'} Catch a companion · ${new Set(state.party.map(c=>c.id)).size}/${collectibleIds.length}</div><div class="${state.badge?'done':''}">${state.badge?'◆':'○'} Bosses defeated: ${state.bossIndex}</div></div>`;
  $('#party').innerHTML=state.party.map((c,i)=>`<button data-party="${i}" class="${i===state.active?'active':''}" ${state.mode!=='explore'?'disabled':''}><canvas data-id="${c.id}" data-stage="${c.stage||0}" data-rare="${!!c.rare}" aria-hidden="true"></canvas>${i===state.active?'▸ ':''}${name(c)}<small>${c.hp} / ${c.max} HP · ${typeLabel(c)}</small><small>${evolutionCost(c)===null?'Final evolution':`${c.xp} / ${evolutionCost(c)} XP`}</small><progress max="${evolutionCost(c)||1}" value="${evolutionCost(c)===null?1:c.xp}" aria-label="${name(c)} evolution experience"></progress></button>${evolutionCost(c)!==null?`<button class="evolve-button" data-evolve="${i}" ${state.mode!=='explore'||c.xp<evolutionCost(c)?'disabled':''}>✦ Evolve ${name(c)}</button>`:''}`).join('')+(state.party.length?`<div class="muted">◈ ${state.cubes} cubes · ${state.wins} ${state.wins===1?'win':'wins'}</div>`:'');
  $('#party').querySelectorAll('canvas').forEach(c=>portrait(c,c.dataset.id,+c.dataset.stage,c.dataset.rare==='true'));
  $('#party').querySelectorAll('[data-party]').forEach(b=>b.onclick=()=>{const i=+b.dataset.party;if(!state.party[i].hp)return toast('Rest at camp to revive this companion.');state.active=i;updateHUD();toast(`${name(state.party[i])} is leading the way.`);});
}
function evolveCompanion(i){
  if(state.mode!=='explore')return;const c=state.party[i],before=name(c);if(!evolve(c))return;
  state.mode='evolution';updateHUD();panel(`<span class="eyebrow">EVOLUTION!</span><h1>Meet ${name(c)}!</h1><canvas class="next-opponent evolution-portrait" data-id="${c.id}" data-stage="${c.stage}" data-rare="${!!c.rare}"></canvas><p>${before} evolved! +18 maximum HP, +${c.stage===3?105:5} skill power. ${c.stage===3?"Mega power can knock out ordinary wild creatures in one skill hit!":""} ${c.stage===1?"New skill unlocked":"Skill upgraded"}: ${talents[species[c.id].type].name} · ${c.stage+1} uses per encounter! ${talents[species[c.id].type].detail} Fully healed.</p><button id="finish-evolution">Keep adventuring</button>`,'result');$('#finish-evolution').onclick=closePanel;
}
$('#party').addEventListener('click',e=>{const b=e.target.closest('[data-evolve]');if(b&&!b.disabled)evolveCompanion(+b.dataset.evolve);});
function starters(){
  state.mode='starter';
  panel(`<span class="eyebrow">CUBE COMPANIONS · AN ENDLESS GROVE</span><h1>Every adventure starts with a friend.</h1><p>Choose a companion, earn XP, evolve your friends, and climb an endless boss ladder.</p><div class="starter-grid">${collectibleIds.map(id=>`<article class="starter"><canvas data-id="${id}" aria-label="${species[id].name} cube creature"></canvas><span class="type">${typeLabel(id)}</span><h2>${species[id].name}</h2><p>${species[id].description}</p><button data-starter="${id}">Choose ${species[id].name}</button></article>`).join('')}</div><p class="muted">WASD / arrows: move straight. Touch a wild creature to start a battle automatically. No interaction key needed!</p>`);
  overlay.querySelectorAll('[data-starter]').forEach(b=>b.onclick=()=>{state.party=[makeCreature(b.dataset.starter)];closePanel();toast('Touch a wild creature to battle! Pebblop is left of camp.');});
}
function resetAdventure(){
  saveBlocked=false;try{storage?.removeItem(SAVE_KEY);}catch{}
  Object.assign(state,{party:[],active:0,cubes:5,wins:0,badge:false,bossIndex:0,seen:[],visited:[],opened:[],claimed:[],forms:[],captures:0,effectiveWins:0,mode:'starter',battle:null,safeUntil:0});
  Object.assign(player,{x:camp.x,z:camp.z,heading:0,moving:false,runCycle:0});Object.assign(camera,{x:camp.x,z:camp.z});
  Object.assign(ranger,{armed:true,cooldown:0});world.reset();keys.clear();nearby=null;clearTimeout(toastTimer);$('#toast').classList.remove('visible');updateHUD();starters();
}
function closePanel(){overlay.innerHTML='';state.mode='explore';state.safeUntil=performance.now()+1000;keys.clear();updateHUD();}
function rest(){state.party.forEach(c=>c.hp=c.max);state.cubes=Math.max(state.cubes,5);updateHUD();toast('Team fully healed. At least 5 capture cubes ready!');}
function returnCamp(){if(state.mode!=='explore')return;player.x=camp.x;player.z=camp.z;state.safeUntil=performance.now()+1800;keys.clear();rest();}
function interact(){if(state.mode!=='explore')return;if(nearby?.kind==='chest'){if(openChest(state,nearby.id)){updateHUD();toast('Treasure! +3 cubes and +20 XP for every companion.');}}else if(nearby?.kind==='camp')rest();else returnCamp();}
function startBattle(target){
  if(state.mode!=='explore'||!state.party[state.active]?.hp)return;
  target.armed=false;
  if(target.kind==='trainer'&&state.party.length<2){toast('Fern: Catch a wild companion first, then touch me to challenge my team!');return;}
  const trainer=target.kind==='trainer',boss=trainer?bossAt(state.bossIndex):null;
  state.mode='battle';state.battle={target,enemy:trainer?bossCreature(boss,0):{...makeCreature(target.id),rare:!!target.rare},trainer,boss,round:0,log:trainer?`${boss.name}: Challenge ${boss.rank}. Let’s begin!`:'A wild companion approaches! Weaken it before throwing a cube.',turn:0,heals:2,talentUses:{},busy:false};
  keys.clear();player.moving=false;updateHUD();renderBattle();
}
function fighter(c,title,side){return `<div class="fighter" data-side="${side}"><span class="type">${title} · ${typeLabel(c)}</span><canvas data-id="${c.id}" data-stage="${c.stage||0}" data-rare="${!!c.rare}" aria-label="${name(c)}"></canvas><h2>${name(c)}</h2><div class="hp"><i style="width:${c.hp/c.max*100}%"></i></div><small class="hp-value">${c.hp} / ${c.max} HP</small></div>`;}
function renderBattle(){
  const b=state.battle,a=state.party[state.active],chance=Math.round(catchChance(b.enemy)*100),effective=strengths[species[a.id].type]||[];
  panel(`<div class="battle-head"><div><span class="eyebrow">${b.trainer?`BOSS · OPPONENT ${b.round+1} OF ${bossTeam.length}`:'WILD ENCOUNTER'}</span><h1>${b.trainer?`Boss ${b.boss.rank} · ${b.boss.name}`:'Make a new friend'}</h1></div><span class="muted">Turn ${b.turn+1}</span></div>${b.trainer?`<div class="boss-roster" aria-label="Boss team">${b.boss.team.map((id,i)=>`<span class="${i<b.round?'defeated':i===b.round?'current':''}">${i<b.round?'✓ ':''}${species[id].name}</span>`).join('')}</div>`:''}<div class="arena">${fighter(a,'Your companion','player')}<span class="versus">VS</span>${fighter(b.enemy,b.trainer?'Fern’s companion':'Wild companion','enemy')}</div>${b.trainer?`<div class="intent"><strong>Next: ${bossIntent(b).name}</strong><br>${bossIntent(b).detail}${b.enemyShield?' Shield active!':''}</div>`:''}<div class="log" role="status" aria-live="polite">${b.log}</div><div class="moves">${a.stage?`<button data-move="talent" ${(b.talentUses[state.active]||0)>=a.stage+1?'disabled':''}>✦ ${talents[species[a.id].type].name}<small>${talents[species[a.id].type].detail} · ${Math.max(0,a.stage+1-(b.talentUses[state.active]||0))} uses left</small></button>`:''}<button data-move="skill">${species[a.id].move}<small>${typeLabel(a)} · best type automatically</small></button><button data-move="tap">Gentle Bump<small>8 damage · useful before capture</small></button><button data-move="guard" ${!b.heals?'disabled':''}>Guard & Recover<small>Heal 14 HP · block 60% · ${b.heals} left</small></button><button data-move="catch" ${b.trainer||!state.cubes?'disabled':''}>Throw Capture Cube<small>${b.trainer?'Trainer companions cannot be caught':`${state.cubes} left · ${chance}% catch chance`}</small></button></div><button id="type-guide">◎ Type matchups</button><div class="switches">${state.party.map((c,i)=>i!==state.active&&c.hp?`<button data-switch="${i}">Switch to ${name(c)}<small>${typeLabel(c)} · ${matchup(c,b.enemy)>1?"✦ Strong":matchup(c,b.enemy)<1?"◇ Resisted":"Normal"} ×${matchup(c,b.enemy)}</small></button>`:'').join('')}<button id="retreat">Retreat to grove</button></div><p class="battle-tip">Your ${typeLabel(a)} skill: ${matchupText(matchup(a,b.enemy))} Capture is guaranteed at 35% HP or less. Switching uses a turn.</p>`,'battle');
  overlay.querySelectorAll('[data-move]').forEach(btn=>btn.onclick=()=>turn(btn.dataset.move));
  overlay.querySelectorAll('[data-switch]').forEach(btn=>btn.onclick=()=>turn('switch',+btn.dataset.switch));
  $('#retreat').onclick=()=>{if(b.busy)return;b.target.cooldown=performance.now()+4000;b.target.armed=false;closePanel();toast('Retreated safely. Move away before starting another battle.');};
  $('#type-guide').onclick=showTypeGuide;
  if(b.busy)lockActions();
}
function lockActions(){overlay.querySelectorAll('button').forEach(b=>b.disabled=true);}
function showHP(){const b=state.battle;for(const [side,c]of [['player',state.party[state.active]],['enemy',b.enemy]]){const el=$(`[data-side="${side}"]`);if(el){el.querySelector('.hp i').style.width=`${c.hp/c.max*100}%`;el.querySelector('.hp-value').textContent=`${c.hp} / ${c.max} HP`;}}}
function sayBattle(message){const el=$('.log');if(el)el.textContent=message;}
function finish(title,message,badge=false){
  const b=state.battle;b.busy=false;b.target.cooldown=performance.now()+15000;b.target.armed=false;state.mode='result';updateHUD();
  panel(`${badge?'<div class="badge">◆</div>':'<span class="eyebrow">ADVENTURE UPDATE</span>'}<h1>${title}</h1><p>${message}</p><button id="continue">${badge?'Continue to the next boss':'Keep exploring'}</button>`,'result');
  $('#continue').onclick=closePanel;
}
function roundWon(defeated){
  const b=state.battle;b.busy=false;state.mode='round';updateHUD();
  panel(`<span class="eyebrow">BOSS · ${b.round} OF ${bossTeam.length} DEFEATED</span><h1>${defeated} defeated!</h1><p>Next up: ${name(b.enemy)} (${typeLabel(b.enemy)}). Your team is healed and recoveries are refilled for the next round.</p><canvas class="next-opponent" data-id="${b.enemy.id}" aria-label="${name(b.enemy)}"></canvas><button id="next-round">Battle ${name(b.enemy)}</button>`,'result');
  $('#next-round').onclick=()=>{state.mode='battle';b.log=`${b.boss.name} sends out ${name(b.enemy)}!`;updateHUD();renderBattle();};
}
async function turn(move,index){
  if(state.mode!=='battle')return;const b=state.battle;if(b.busy)return;
  if(move==='catch'&&(b.trainer||!state.cubes)||move==='guard'&&!b.heals||move==='switch'&&(index===state.active||!state.party[index]?.hp))return;
  if(move==='talent'&&(!state.party[state.active].stage||(b.talentUses[state.active]||0)>=state.party[state.active].stage+1))return;
  b.busy=true;lockActions();let a=state.party[state.active],log='',talentGuard=false;
  if(move==='catch'){
    sayBattle('A capture cube flies through the air…');await captureEffect();state.cubes--;
    if(tryCapture(b.enemy)){
      const owned=state.party.some(c=>c.id===b.enemy.id&&!!c.rare===!!b.enemy.rare);if(!owned)state.party.push({...makeCreature(b.enemy.id),rare:!!b.enemy.rare});else state.cubes++;state.captures++;
      gainXP(a,40);
      return finish(owned?'A familiar friend!':'Companion caught!',owned?`${name(b.enemy)} is already on your team. You return it to the grove and keep your cube. ${name(a)} earned 40 XP!`:`${name(b.enemy)} joined your team, fully healed! Select its card to lead, or switch in battle. ${name(a)} earned 40 XP! Tap Evolve on its card when ready.`);
    }
    log='The cube wobbled… it escaped! Weaken it a little more. ';
  }else if(move==='guard'){
    sayBattle(`${name(a)} gathers strength and raises a shield!`);await healEffect();b.heals--;const heal=Math.min(14,a.max-a.hp);a.hp+=heal;log=`Recovered ${heal} HP and raised a guard. `;showHP();
  }else if(move==='switch'){
    sayBattle(`Come back, ${name(a)}!`);await switchEffect();state.active=index;a=state.party[index];b.log=`Go, ${name(a)}!`;renderBattle();await new Promise(resolve=>requestAnimationFrame(resolve));log=b.log+' ';
  }else if(move==='talent'){
    const t=talents[species[a.id].type];sayBattle(`${name(a)} uses ${t.name}!`);await strike('player',species[a.id].type,matchup(a,b.enemy),a.stage===3);const result=talentHit(a,b.enemy,b.enemyShield);b.enemyShield=false;b.talentUses[state.active]=(b.talentUses[state.active]||0)+1;talentGuard=result.guard;log=`${t.name}: ${result.damage} damage. ${matchupText(matchup(a,b.enemy))} `;showHP();
  }else{
    sayBattle(`${name(a)} uses ${move==='skill'?species[a.id].move:'Gentle Bump'}!`);await strike('player',move==='skill'?species[a.id].type:'stone',move==='skill'?matchup(a,b.enemy):1,a.stage===3&&move==='skill');const n=attack(a,b.enemy,move,b.enemyShield);b.enemyShield=false;log=`${name(a)} dealt ${n} damage. ${matchupText(move==='skill'?matchup(a,b.enemy):1)} `;showHP();
  }
  if(b.enemy.hp<=0){
    const defeated=name(b.enemy);gainXP(a,20);if(['skill','talent'].includes(move)&&matchup(a,b.enemy)>1)state.effectiveWins++;
    if(nextBossRound(b,state.party)){b.turn=0;b.talentUses={};b.enemyShield=false;roundWon(defeated);return;}
    state.wins++;state.cubes=Math.min(99,state.cubes+2);a.hp=a.max;
    if(b.trainer){completeBoss(state);return finish(`Boss ${state.bossIndex} defeated!`,`${b.boss.name} awards your team 40 bonus XP each. Your companions and experience stay with you! Next: Boss ${state.bossIndex+1}, ${bossAt(state.bossIndex).name}, north of camp.`,true);}
    return finish('Battle won!',`${defeated} scampers away. Your lead companion earned 20 XP and is healed. You earned 2 capture cubes. Throw a cube before HP reaches zero to catch one.`);
  }
  const intent=bossIntent(b);sayBattle(`${log}${name(b.enemy)}: ${intent.name}!`);
  if(['attack','burst'].includes(intent.kind))await strike('enemy',species[b.enemy.id].type,matchup(b.enemy,a));
  else await bossSpecialEffect(intent.kind);
  const result=resolveBossAction(b,a,move==='guard'||talentGuard);showHP();log+=`${intent.name}: ${result.damage?result.damage+' damage. '+matchupText(matchup(b.enemy,a)):intent.detail}`;b.turn++;
  if(!a.hp){
    const next=state.party.findIndex(c=>c.hp>0);
    if(next<0){state.party.forEach(c=>c.hp=c.max);state.cubes=5;player.x=camp.x;player.z=camp.z;return finish('A fresh start at camp','Your team needed a rest. Everyone is healed and your cubes are refilled. Your collection is safe.');}
    state.active=next;log+=` ${name(a)} needs rest. ${name(state.party[next])} steps in!`;
  }
  b.log=log;b.busy=false;updateHUD();renderBattle();
}
$('#interact').onclick=interact;
$('#cue-action').onclick=interact;
function updateCue(cue,r){
  currentCue=cue;cueElement.hidden=!cue;
  document.querySelector('.explore-controls').classList.toggle('interaction-ready',!!cue?.action);
  if(!cue){cueSignature='';return;}
  const signature=[cue.target.name,cue.mode,cue.title].join('|');
  if(signature!==cueSignature){
    cueSignature=signature;cueElement.dataset.mode=cue.mode;
    cueElement.querySelector('.cue-key').textContent=cue.key;
    cueElement.querySelector('.cue-name').textContent=cue.target.name;
    cueElement.querySelector('.cue-title').textContent=cue.title;
    cueElement.querySelector('.cue-detail').textContent=cue.detail;
    $('#cue-action').hidden=!cue.action;$('#cue-action').textContent=cue.target.kind==='chest'?'Open treasure':'Rest & refill';
  }
  const [x,y]=r.project(cue.target.x,cue.target.kind==='trainer'?2:1.7,cue.target.z);
  const half=cueElement.offsetWidth/2;
  const left=Math.max(half+10,Math.min(innerWidth-half-10,x));
  const top=Math.max(cueElement.offsetHeight+74,Math.min(innerHeight-90,y-12));
  cueElement.style.left=`${left}px`;cueElement.style.top=`${top}px`;
  cueElement.style.setProperty('--pointer-offset',`${Math.max(18,Math.min(cueElement.offsetWidth-18,x-left+half))}px`);
}
$('#help').onclick=()=>{
  if(state.mode!=='explore')return;state.mode='help';
  panel(`<span class="eyebrow">FIELD GUIDE</span><h1>Welcome to the endless grove.</h1><div class="help-list">Map: travel between five regions. Journal: quests, rewards, and the creature collection.<br>Treasure chests: approach and press E or click Open treasure. Each chest opens once.<br>Bosses announce their next action. Guard before a charged strike!<br>Evolution unlocks a special move: Super form gets 2 uses per encounter, Royal form gets 3, Mega gets 4.<br>Move straight: WASD, arrows, or on-screen arrows. The last direction pressed wins.<br>Touch a wild creature or Fern to battle automatically.<br>Click a companion card to change your lead.<br>Rest at camp or use Return to camp for healing and capture cubes.<br>Catch a companion, then face Fern’s five-creature team.<br>Each boss round heals your team. Beat all five opponents to unlock the next boss.<br>Types: fire, leaf, water, stone, fighting, fairy, steel, and poison. Some companions have two types.<br>Catching earns 40 XP for your lead, even for familiar creatures. Wins earn 20 XP. Tap Evolve at 80 XP, then again at 160 XP, and finally Mega at 500 XP. Boss wins preserve your team and unlock the next challenge.</div><p>Your adventure is automatically saved in this browser. Reloading during a battle returns to the grove; the battle restarts.</p><button id="close-help">Back to the grove</button> <button id="export-save">Download save backup</button> <label class="import-label">Restore backup <input id="import-save" type="file" accept=".json,application/json"></label> <button id="new-adventure">New adventure</button>`);
  $('#export-save').onclick=()=>{const blob=new Blob([encodeSave(state,player)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='cube-companions-save.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);};
  $('#import-save').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error();const restored=decodeSave(await file.text());panel('<h1>Restore this backup?</h1><p>This replaces your current adventure. Download your current save first if you want to keep both.</p><button id="cancel-import">Keep current adventure</button><button id="confirm-import">Restore backup</button>');$('#cancel-import').onclick=closePanel;$('#confirm-import').onclick=()=>{const {player:position,...saved}=restored;saveBlocked=false;Object.assign(state,saved,{battle:null});Object.assign(player,position);Object.assign(camera,position);world.reset();for(const target of [ranger,...world.wildNear(player,4)])target.armed=false;closePanel();toast('Backup restored.');};}catch{toast('That file is not a valid save. Your adventure has not changed.');}};
  $('#close-help').onclick=closePanel;$('#new-adventure').onclick=()=>{panel('<h1>Start a new adventure?</h1><p>This replaces the saved team, quests and boss progress on this device.</p><button id="cancel-reset">Keep my adventure</button> <button id="confirm-reset">Start over</button>');$('#cancel-reset').onclick=closePanel;$('#confirm-reset').onclick=resetAdventure;};
};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(directions[k]&&state.mode==='explore')e.preventDefault();if(!e.repeat)keys.add(k);if(k==='e'&&!e.repeat)interact();});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>keys.clear());
addEventListener('keydown',e=>{if(e.key!=='Tab'||!overlay.children.length)return;const list=[...overlay.querySelectorAll('button:not(:disabled),input,select')];if(!list.length)return;const first=list[0],end=list.at(-1);if(e.shiftKey&&document.activeElement===first){end.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===end){first.focus();e.preventDefault();}});
 document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key.toLowerCase());};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(b.dataset.key.toLowerCase());});
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0);}addEventListener('resize',()=>{resize();document.querySelectorAll('canvas[data-id]').forEach(c=>portrait(c,c.dataset.id,+c.dataset.stage||0,c.dataset.rare==='true'));});resize();
function frame(now){
  const dt=Math.min((now-last)/1000,.05);last=now;const w=innerWidth,h=innerHeight;
  const s=w<760?34:Math.min(60,w/23,h/14),radius=Math.ceil((w/s+h/(s*.48))/4)+4;
  const trees=world.treesNear(player,radius),wild=world.wildNear(player,radius);
  if(state.party.length){let changed=false;for(const c of wild.filter(c=>Math.hypot(c.x-player.x,c.z-player.z)<6)){if(!state.seen.includes(c.id)){state.seen.push(c.id);changed=true;}}if(changed)saveAdventure();}
  player.moving=false;
  const biome=regionAt(player.x,player.z);$('#region-name').textContent=biome.name;
  if(state.party.length&&!state.visited.includes(biome.id)){state.visited.push(biome.id);saveAdventure();}
  if(state.mode==='explore'){
    const {dx,dz}=movementStep(keys,dt);
    if(dx||dz){const nx=player.x+dx,nz=player.z+dz;
      if(!trees.some(([x,z])=>Math.hypot(nx-x,nz-z)<.65)){player.x=nx;player.z=nz;player.moving=true;player.heading=Math.atan2(dx,dz);player.runCycle+=dt*14;}
    }
  }
  for(const c of wild){c.moving=state.mode==='explore'&&now>c.cooldown;if(c.moving){const x=c.homeX+Math.sin(now*.0008+c.phase)*.65,z=c.homeZ+Math.cos(now*.0007+c.phase)*.65;c.heading=Math.atan2(x-c.x,z-c.z);c.x=x;c.z=z;}}
  for(const target of [ranger,...wild]){if(Math.hypot(target.x-player.x,target.z-player.z)>2)target.armed=true;if(state.mode==='explore'&&now>state.safeUntil&&touching(player,target,now))startBattle(target);}
  nearby=Math.hypot(camp.x-player.x,camp.z-player.z)<1.8?camp:chests.find(c=>!state.opened.includes(c.id)&&Math.hypot(c.x-player.x,c.z-player.z)<1.8)||null;
  $('#interact').disabled=state.mode!=='explore';$('#interact').textContent=nearby?.kind==='chest'?'E · Open treasure':nearby?'E · Rest & refill':'Return to camp';
  camera.x+=(player.x-camera.x)*Math.min(1,dt*7);camera.z+=(player.z-camera.z)*Math.min(1,dt*7);
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#9fc579';ctx.fillRect(0,0,w,h);
  const r=renderer(ctx,s,w/2-(camera.x-camera.z)*s,h*.57-(camera.x+camera.z)*s*.48),minX=Math.floor(camera.x)-radius,minZ=Math.floor(camera.z)-radius;
  const cue=chooseCue(player,state,camp,ranger,wild,now,chests);
  for(let x=minX;x<=minX+radius*2;x++)for(let z=minZ;z<=minZ+radius*2;z++){const [px,py]=r.project(x,0,z);if(px<-s*2||px>w+s*2||py<-s||py>h+s)continue;r.box(x,-.35,z,1,.35,1,world.tileColor(x,z));}
  r.flush();
  drawCueRing(ctx,r,s,cue,now,reducedMotion.matches);
  drawScenery(r,player,now,reducedMotion.matches);
  for(const [x,z]of trees){r.box(x-.18,0,z-.18,.36,1.5,.36,'#8a6546');const biome=regionAt(x,z);if(biome.id==='mine'||biome.id==='volcano'){r.box(x-.55,.4,z-.5,1.1,1.1,1,biome.foliage);r.box(x-.25,1.5,z-.25,.5,.5,.5,'#f4dca4');}else{r.box(x-.65,1.15,z-.6,1.3,.9,1.2,biome.foliage);r.box(x-.43,2.05,z-.4,.86,.4,.8,biome.foliage);}}
  for(const chest of chests){const opened=state.opened.includes(chest.id);r.box(chest.x-.4,0,chest.z-.3,.8,.5,.6,opened?'#857656':'#d69730');r.box(chest.x-.44,.5,chest.z-.34,.88,.15,.68,opened?'#968665':'#f6d269');if(!opened)r.box(chest.x-.07,.2,chest.z+.31,.14,.2,.04,'#fff5b4');}
  r.box(1.3,0,3.5,1.4,.7,1,'#e6b963');r.box(1.2,.7,3.4,1.6,.18,1.2,'#d7744c');r.box(1.7,0,4.51,.5,.6,.02,'#705446');r.person(ranger.x,ranger.z,'#6d9361');
  for(const c of wild)if(now>c.cooldown)r.creature(c.id,c.x,0,c.z,.85,{rare:c.rare,heading:c.heading||0,moving:c.moving,runCycle:now*.008+c.phase});
  if(state.party.length){r.person(player.x,player.z,'#e9b754',player);r.creature(state.party[state.active].id,player.x-.65,.02,player.z+.55,.65,{rare:state.party[state.active].rare,stage:state.party[state.active].stage,heading:player.heading,moving:player.moving,runCycle:player.runCycle});}
  r.flush();
  drawCueBrackets(ctx,r,s,cue);
  function label(text,x,z,y=1.6){const [px,py]=r.project(x,y,z);if(px<-80||px>w+80||py<-30||py>h+30)return;ctx.font='bold 12px Trebuchet MS';const tw=ctx.measureText(text).width;ctx.fillStyle='#fff9e8ed';ctx.fillRect(px-tw/2-8,py-17,tw+16,24);ctx.fillStyle='#294535';ctx.textAlign='center';ctx.fillText(text,px,py);}
  for(const c of chests)if(!state.opened.includes(c.id)&&cue?.target!==c)label('◆ TREASURE · E',c.x,c.z,1.2);
  if(cue?.target!==camp)label('CAMP',1.8,4,1.6);
  if(cue?.target!==ranger)label(`◆ ${ranger.name}`,0,-5,2.1);
  for(const c of wild)if(now>c.cooldown&&cue?.target!==c)label(`${c.rare?'✦ Rare ':''}${c.name} · ${typeLabel(c)}`,c.x,c.z,1.75);
  if(state.party.length){const [px,py]=r.project(player.x,1.95,player.z);ctx.fillStyle='#fff9e8';ctx.beginPath();ctx.moveTo(px,py+9);ctx.lineTo(px-6,py);ctx.lineTo(px+6,py);ctx.fill();}
  updateCue(cue,r);
  requestAnimationFrame(frame);
}
let storage;try{storage=localStorage;}catch{storage=null;}
const loaded=readSave(storage);let saveBlocked=!!loaded.error;
if(loaded.data){const {player:position,...saved}=loaded.data;Object.assign(state,saved);Object.assign(player,position);Object.assign(camera,position);for(const target of [ranger,...world.wildNear(player,4)]){if(Math.hypot(target.x-player.x,target.z-player.z)<=2)target.armed=false;}closePanel();state.safeUntil=performance.now()+2500;toast('Adventure loaded. Welcome back!');}else{updateHUD();starters();if(loaded.error)toast('Saved adventure could not be read. It is protected from overwrite. Use Controls to restore a backup or explicitly start over.');}
setInterval(()=>{if(state.mode==='explore')saveAdventure();},3000);
addEventListener('pagehide',()=>saveAdventure());
requestAnimationFrame(frame);
function saveAdventure(){if(!state.party.length){const el=$('#save-status');if(el)el.textContent='Choose a starter to begin saving';return;}const ok=!saveBlocked&&writeSave(storage,state,player);const el=$('#save-status');if(el)el.textContent=ok?'✓ Saved on this device':'⚠ Save unavailable — keep this page open';}
// Read-only diagnostics for canvas gameplay checks; returned values cannot alter play.
export function inspectGame(){return structuredClone({state,player,cue:currentCue,nearbyWild:world.wildNear(player,4),now:performance.now()});}

function matchupText(f){return f>1?`Super effective! ×${f} damage.`:f<1?`Resisted! ×${f} damage.`:'Normal hit. ×1 damage.';}
function showTypeGuide(){
  if(state.battle?.busy&&state.mode==='battle')return;
  const previous=state.mode;if(!['battle','explore'].includes(previous))return;state.mode='guide';updateHUD();
  const a=state.party[state.active],b=state.battle;
  panel(`<span class="eyebrow">TYPE SCHOOL</span><h1>Find the strong matchup</h1><p>Read from the attacking type to its target. ✦ Strong = 1.5× damage. ◇ Resisted = 0.75× damage. All other matchups = 1×. Dual types: multiply both defensive matchups; your skill automatically uses your better attacking type. For example, water against fire + stone is 1.5 × 1.5 = 2.25×. Gentle Bump always ignores types.</p>${previous==='battle'?`<p class="matchup-summary">Your ${typeLabel(a)} → their ${typeLabel(b.enemy)}: ${matchupText(matchup(a,b.enemy))}<br>Their ${typeLabel(b.enemy)} → your ${typeLabel(a)}: ${matchupText(matchup(b.enemy,a))}</p>`:''}<div class="type-table"><table><thead><tr><th>Attack type</th><th>✦ Strong against</th><th>◇ Resisted by</th></tr></thead><tbody>${Object.keys(strengths).map(t=>`<tr><th>${typeIcons[t]} ${t}</th><td>${strengths[t].map(v=>typeIcons[v]+' '+v).join(', ')}</td><td>${Object.keys(strengths).filter(d=>typeFactor(t,d)<1).join(', ')||'—'}</td></tr>`).join('')}</tbody></table></div><button id="close-types">${previous==='battle'?'Back to battle':'Back to grove'}</button>`);
  $('#close-types').onclick=()=>{if(previous==='battle'){state.mode='battle';updateHUD();renderBattle();}else closePanel();};
}
$('#types').onclick=showTypeGuide;

function journalTab(title,body){if(state.mode!=='explore')return;state.mode='journal';keys.clear();panel(`<span class="eyebrow">ADVENTURE JOURNAL</span><h1>${title}</h1>${body}<button id="close-journal">Back to adventure</button>`);$('#close-journal').onclick=closePanel;}
function showMap(){journalTab('Choose your next destination',`<p>Walk freely across the world, or travel to a region's trailhead. Each region has its own creatures and a treasure chest. Bosses wait north of Home Grove.</p><div class="region-grid">${regions.map(r=>`<button data-travel="${r.id}">${r.name}<small>${[...new Set(r.species.flatMap(id=>creatureTypes(id)))].map(t=>typeIcons[t]+' '+t).join(' · ')}${state.visited.includes(r.id)?' · Visited':''}</small></button>`).join('')}</div>`);overlay.querySelectorAll('[data-travel]').forEach(b=>b.onclick=()=>{const r=regions.find(r=>r.id===b.dataset.travel);player.x=r.x;player.z=r.z;camera.x=r.x;camera.z=r.z;closePanel();state.safeUntil=performance.now()+2200;toast(`Welcome to ${r.name}! Look for the gold treasure chest.`);});}
$('#map').onclick=()=>{if(state.mode==='explore')showMap();};

function showJournal(){
 const cards=collectibleIds.map(id=>{const owned=state.party.filter(c=>c.id===id),seen=state.seen.includes(id);return `<article class="dex-card" data-species="${id}"><h3>${seen?species[id].name:'Unknown companion'}</h3>${seen?`<canvas data-id="${id}" aria-label="${species[id].name}"></canvas><p>${typeLabel(id)} · ${owned.length?'Caught':'Seen, not caught'}</p><small>Forms: ${[0,1,2,3].map(n=>state.forms.some(f=>f.startsWith(id+':'+n))?['Base','Super','Royal','Mega'][n]:'?').join(' → ')}<br>Rare: ${owned.some(c=>c.rare)?'✦ Collected':'Not found'}</small>`:'<p>Explore other regions to discover it.</p>'}</article>`;}).join('');
 journalTab('Quests & companion collection',`<p>Quest rewards: 3 cubes and 40 XP for every companion. Rare gold-and-violet creatures can be found in the wild; collect them alongside their normal form.</p><details><summary>Quests & rewards</summary><div class="quest-list">${quests.map(q=>`<article><strong>${q.name}</strong><p>${q.detail} ${Math.min(q.goal,q.value(state))}/${q.goal}</p><button data-claim="${q.id}" ${state.claimed.includes(q.id)||q.value(state)<q.goal?'disabled':''}>${state.claimed.includes(q.id)?'Claimed':'Claim reward'}</button></article>`).join('')}</div></details><h2>Companion collection</h2><div class="dex-filters"><label>Find a companion <input id="dex-search" type="search" placeholder="Name or type"></label><label>Type <select id="dex-type"><option value="">All types</option>${Object.keys(typeIcons).map(t=>`<option value="${t}">${typeIcons[t]} ${t}</option>`).join('')}</select></label></div><p id="dex-count" role="status"></p><div class="region-grid" id="dex-results">${cards}</div>`);
 const filterDex=()=>{const q=$('#dex-search').value.toLowerCase().trim(),t=$('#dex-type').value;let count=0;overlay.querySelectorAll('[data-species]').forEach(card=>{const id=card.dataset.species;card.hidden=!(id+' '+species[id].name.toLowerCase()+' '+typeLabel(id)).includes(q)||(!!t&&!creatureTypes(id).includes(t));if(!card.hidden)count++;});$('#dex-count').textContent=`${count} companion${count===1?'':'s'} found`;requestAnimationFrame(()=>overlay.querySelectorAll('.dex-card:not([hidden]) canvas').forEach(c=>portrait(c,c.dataset.id)));};$('#dex-search').oninput=filterDex;$('#dex-type').onchange=filterDex;filterDex();
 overlay.querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>{if(claimQuest(state,b.dataset.claim)){state.mode='explore';updateHUD();showJournal();}});
}
$('#journal').onclick=()=>{if(state.mode==='explore')showJournal();};
