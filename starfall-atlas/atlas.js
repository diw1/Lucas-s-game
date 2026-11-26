(() => {

"use strict";
const {regions,modes,symbols,seals,follows}=window.StarfallWorld;
const families=Object.keys(modes), total=176, storeKey="starfall-atlas-v1";
const screen=document.getElementById("screen"),nav=document.getElementById("navigation"),sheet=document.getElementById("sheet");
const pad=n=>String(n).padStart(2,"0");
const puzzleKey=(m,i)=>`${m}-${i}`;
const empty=()=>({version:1,lang:"zh",audio:true,region:0,routeMode:"trail",companion:0,gardens:{},gardenWins:[],visits:[],secretFinds:[],fields:{},fieldWins:[],done:{},drafts:{},beacons:[],orders:{},view:"home",active:null});
const validKey=k=>/^(trail|prism|weave)-([0-9]|[1-4]\d|5[0-5])$/.test(k);
function readSave(input){
  if(!input || input.version!==1) return null;
  const clean=empty();
  clean.lang=input.lang==="en"?"en":"zh";
  if(families.includes(input.routeMode)) clean.routeMode=input.routeMode;
  clean.audio=input.audio!==false;
  const record=o=>o && typeof o==="object" && !Array.isArray(o)?Object.entries(o):[];
  for(const [k,v] of record(input.done)) if(validKey(k)&&Number.isSafeInteger(v)&&v>=0) clean.done[k]=v;
  for(const [k,v] of record(input.drafts)) if(validKey(k)&&v && typeof v==="object") clean.drafts[k]=v;
  for(let r=0;r<8;r++){
    if(!Array.isArray(input.beacons) || !input.beacons.includes(r)) break;
    if(!families.every(m=>Array.from({length:7},(_,i)=>Object.hasOwn(clean.done,puzzleKey(m,r*7+i))).filter(Boolean).length>=5)) break;
    clean.beacons.push(r);
  }
  clean.region=Number.isInteger(input.region)?Math.max(0,Math.min(7,clean.beacons.length,input.region)):0;
  const companion=input.companion;
  clean.companion=Number.isInteger(companion) && companion>=0 && companion<=7 && Object.keys(clean.done).some(k=>Math.floor(Number(k.split("-")[1])/7)===companion)?companion:0;
  for(const [k,v] of record(input.orders)){
    if(!/^[0-7]$/.test(k) || !Array.isArray(v)) continue;
    const ids=seals[k][0].split(" ");
    if(v.length<=ids.length && new Set(v).size===v.length && v.every(id=>ids.includes(id))) clean.orders[k]=v;
  }
  for(const [k,v] of record(input.fields)) if(/^[0-7]$/.test(k)&&v&&typeof v==="object") clean.fields[k]=v;
  if(Array.isArray(input.fieldWins)) clean.fieldWins=[...new Set(input.fieldWins.filter(k=>Number.isInteger(k)&&k>=0&&k<8&&Object.keys(clean.done).some(key=>Math.floor(Number(key.split("-")[1])/7)===k)))];
  for(const [k,v] of record(input.gardens)) if(/^[0-7]$/.test(k)&&v&&typeof v==="object") clean.gardens[k]=v;
  if(Array.isArray(input.gardenWins))clean.gardenWins=[...new Set(input.gardenWins.filter(k=>Number.isInteger(k)&&k>=0&&k<=Math.min(7,clean.beacons.length)))];
  if(Array.isArray(input.visits)) clean.visits=[...new Set(input.visits.filter(k=>Number.isInteger(k)&&k>=0&&k<=Math.min(7,clean.beacons.length)))];
  clean.secretFinds=window.StarfallDiscoveries.restore(input.secretFinds,clean.beacons.length);
  const a=input.active;
  if(a && families.includes(a.m) && Number.isInteger(a.i) && a.i>=0 && a.i<56 && Math.floor(a.i/7)<=clean.beacons.length) clean.active={m:a.m,i:a.i};
  if(["home","map","book","route","play","seal","ending","field","workshop"].includes(input.view)) clean.view=input.view;
  if(clean.view==="play"&&!clean.active || clean.view==="ending"&&clean.beacons.length<8) clean.view="home";
  return clean;
}
let data=empty(), storageFailed=false;
try{data=readSave(JSON.parse(localStorage.getItem(storeKey)))||data;}catch{}
const tr=(zh,en)=>data.lang==="zh"?zh:en;
const tx=pair=>tr(...pair);
const has=(m,i)=>Object.hasOwn(data.done,puzzleKey(m,i));
const tally=(r,m)=>Array.from({length:7},(_,i)=>has(m,7*r+i)).filter(Boolean).length;
const islandTally=r=>families.reduce((n,m)=>n+tally(r,m),0);
const recruited=r=>islandTally(r)>0;
const available=r=>r<=data.beacons.length;
const sealReady=r=>families.every(m=>tally(r,m)>=5);
const activeTotal=()=>Object.keys(data.done).length+data.beacons.length;
const chapter=r=>tr(`第${"一二三四五六七八"[r]}章`,`Chapter ${pad(r+1)}`);
const image=(type,r)=>`art/${type}-${r+1}.webp`;
const coord=[[11,62],[24,36],[37,66],[47,24],[59,46],[69,76],[77,22],[89,48]];
const paths={
 compass:'<circle cx="12" cy="12" r="8.6"/><path d="m15.5 7.5-2.1 6-5 3 2.1-6z"/>',
 map:'<path d="m2 5 6-2 8 3 6-2v15l-6 2-8-3-6 2zM8 3v15m8-12v15"/>',
 book:'<path d="M12 6c-3-2-6-2.5-10-1v14c3.5-1.5 7-1.2 10 1 3-2.2 6.5-2.5 10-1V5c-4-1.5-7-1-10 1zm0 0v14"/>',
 sound:'<path d="m3 9 4 .1L12 5v14l-5-4H3zm12-1c2 2 2 6 0 8m3-11c4 4 4 10 0 14"/>',
 mute:'<path d="m3 9 4 .1L12 5v14l-5-4H3zm12.5 0 6 6m0-6-6 6"/>',
 globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
 play:'<path fill="currentColor" stroke="none" d="M7 3.5 20 12 7 20.5z"/>',
 star:'<path d="M12 2.5c1.1 5.8 3.5 8.2 9.5 9.5-6 1.3-8.4 3.7-9.5 9.5C10.9 15.7 8.5 13.3 2.5 12c6-1.3 8.4-3.7 9.5-9.5z"/>',
 box:'<path d="m3 7 9-5 9 5v10l-9 5-9-5zm0 0 9 5 9-5m-9 5v10M7.5 4.5l9 5"/>',
 prism:'<path d="m12 2 10 18H2zm0 0 3.5 18M3 16l7-3 10 3"/>',
 weave:'<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M9 4v16m6-16v16M4 9h16M4 15h16"/>',
 paw:'<ellipse cx="5" cy="9" rx="2" ry="3"/><ellipse cx="10" cy="6" rx="2" ry="3"/><ellipse cx="16" cy="6.5" rx="2" ry="3"/><ellipse cx="20" cy="11" rx="1.8" ry="2.5"/><path d="M7 15q5-9 10 1c3 7-3 3-5 3-3 0-7 3-6-1z"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
 check:'<path d="m4.5 12.5 5 5 10-11"/>', back:'<path d="m14 5-7 7 7 7"/>',
 pin:'<path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0z"/><circle cx="12" cy="9" r="2.1"/>',
 flag:'<path d="M5 21V4m0 1c4-4 9 3 15-1l-2 8c-5 3-9-3-13 0"/>',
 beacon:'<path d="m12 2 3.5 6-3.5 5-3.5-5zm-3 12-3 7h12l-3-7M3 6l3 1m12 0 3-1"/>',
 feather:'<path d="M4 21 17 8M7 18C2 11 11 2 20 3c1 7-4 16-13 15zm4-5h5"/>',
 moon:'<path d="M20 15A8.5 8.5 0 0 1 9 4a8.5 8.5 0 1 0 11 11z"/>',
 drop:'<path d="M12 2C9 7 4.5 11 5.5 16a6.6 6.6 0 0 0 13 0C19 11 15 7 12 2z"/>',
 leaf:'<path d="M3 20C1 10 9 3 21 3c0 10-6 19-15 15zm2-1 11-11"/>',
 bell:'<path d="m4 17 2-3V9a6 6 0 0 1 12 0v5l2 3zm5 3q3 3 6 0"/>',
 gem:'<path d="m2 8 5-5h10l5 5-10 13zm0 0h20M8 8l4 13 4-13"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
 flame:'<path d="M12 2c1 6 7 7 7 13a7 7 0 0 1-14 0c0-3 1-5 4-8 0 3 1 4 2 4 1-3 1-6 1-9z"/>',
 snow:'<path d="M12 2v20M3.5 7l17 10m0-10-17 10M9 4l3 3 3-3m-6 16 3-3 3 3"/>',
 close:'<path d="m5 5 14 14M19 5 5 19"/>', save:'<path d="M4 3h13l3 3v15H4zm3 0v6h9V3M8 20v-7h8v7"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>', help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-1 1-2 1.5-2 4m0 2h.1"/>'
};
function ic(id,size=20){return `<svg class="sf-icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[id]||paths.star}</svg>`;}
const badge=()=>`<svg class="crest" viewBox="0 0 54 54" aria-hidden="true"><g stroke="currentColor" fill="none"><circle cx="27" cy="27" r="20" stroke-width="1.3"/><circle cx="27" cy="27" r="16.3" stroke-dasharray="1 4"/><path d="M27 1l3 7-3 4-3-4zm0 40 3 5-3 7-3-7zM1 27l7-3 4 3-4 3zm40 0 5-3 7 3-7 3z" fill="currentColor"/></g><path d="m36 13-5 17-13 11 5-17z" fill="currentColor"/><path d="m27 27 9-14-5 17z" fill="#995f32"/><circle cx="27" cy="27" r="2.2" fill="#0c1823"/></svg>`;
function act(action,content,klass="",extra=""){return `<button type="button" class="${klass}" data-sf="${action}" ${extra}>${content}</button>`;}
function progress(n,max){return `<span class="sf-progress" aria-hidden="true"><i style="width:${n/max*100}%"></i></span>`;}
function toast(msg){const el=document.getElementById("notice");el.textContent=msg;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),3300);}
function persist(){
  data.routeMode=routeMode;
  try{localStorage.setItem(storeKey,JSON.stringify(data));}catch{if(!storageFailed)toast(tr("浏览器未能写入存档。可在手记中导出进度。","Browser save is unavailable. Export your progress from the journal."));storageFailed=true;}
}
let audioCtx;
function sound(kind){
  if(!data.audio)return;
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==="suspended")audioCtx.resume().catch(()=>{});
    const shellTones={"poke-low":293.7,"poke-mid":370,"poke-high":440};
    const notes=Object.hasOwn(shellTones,kind)?[shellTones[kind]]:kind==="success"?[440,554.4,659.3,880]:kind==="move"?[330]:[493.9];
    notes.forEach((hz,i)=>{
      const t=audioCtx.currentTime+i*.085, osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
      osc.type=kind==="move"?"sine":"triangle";osc.frequency.value=hz;
      gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(kind==="move"?.025:.045,t+.015);gain.gain.exponentialRampToValueAtTime(.0001,t+.26);
      osc.connect(gain);gain.connect(audioCtx.destination);osc.start(t);osc.stop(t+.28);
    });
  }catch{}
}
function suggested(r){
  if(data.beacons.includes(r)&&data.beacons.length<8) return suggested(data.beacons.length);
  if(sealReady(r)&&!data.beacons.includes(r))return {m:"seal",r};
  for(let j=0;j<7;j++)for(const m of families)if(!has(m,r*7+j))return {m,i:r*7+j};
  if(r<7&&available(r+1))return suggested(r+1);
  for(let k=0;k<r;k++)if(islandTally(k)<21)return suggested(k);
  return {m:"ending"};
}
function resumeOrNext(r){
  const a=data.active;
  return a&&Math.floor(a.i/7)===r&&data.drafts[puzzleKey(a.m,a.i)]?a:suggested(r);
}
let cleanup=null, routeMode=data.routeMode, previewRegion=data.region, bookRegion=data.companion, playSession=0, sheetKind="", sheetInfo=null;
let secretCleanup=null;
function stopSecret(){
  const stop=secretCleanup;
  secretCleanup=null;
  if(typeof stop==="function")stop();
}
function closeSheet(){stopSecret();if(sheet.open)sheet.close();sheetKind="";sheetInfo=null;delete sheet.dataset.kind;}
function modal(kind,content,info){
  stopSecret();
  const alreadyOpen=sheet.open;
  sheet.dataset.kind=kind;
  sheetKind=kind;sheetInfo=info;
  document.getElementById("sheet-content").innerHTML=content;
  if(!alreadyOpen)sheet.showModal();
}
function clearMode(){++playSession;if(typeof cleanup==="function")cleanup();cleanup=null;}
function setView(view,opts={}){
  closeSheet();clearMode();data.view=view;
  if(opts.region!==undefined)data.region=opts.region;
  if(view==="map")previewRegion=data.region;
  if(view==="book")bookRegion=recruited(data.companion)?data.companion:data.region;
  persist();render();window.scrollTo(0,0);screen.focus({preventScroll:true});
}
function launch(m,i){
  if(!families.includes(m)||!Number.isInteger(i)||i<0||i>=56||!available(Math.floor(i/7)))return;
  closeSheet();clearMode();data.active={m,i};data.region=Math.floor(i/7);data.view="play";persist();render();window.scrollTo(0,0);
}
function goTo(task){
  if(task.m==="seal"){setView("seal",{region:task.r});return;}
  if(task.m==="ending"){setView("ending");return;}
  launch(task.m,task.i);
}


const guests=[
 {name:["皮卡丘","Pikachu"],world:["宝可梦","Pokémon"],token:["闪电印记","Thunder stamp"],intro:["皮卡丘的脸颊噼啪一闪。罗盘左边断开的两段铜线之间跳出了小火花，右边的彩石却毫无反应。","Pikachu's cheeks crackle. A spark jumps between two broken copper wires on the left of the compass. The coloured stones on the right stay dark."],ask:["该先修哪一处？","What should we mend first?"],choices:[["交换两颗彩石","Swap the coloured stones"],["接回断开的铜线","Join the broken copper wires"],["旋转罗盘外壳","Turn the casing"]],answer:1,out:["皮卡丘把爪子放上接好的触点。罗盘亮起，一条幼鲸的轮廓浮出了表面。","Pikachu touches the repaired contacts. The compass lights up and the outline of a little whale appears."]},
 {name:["太空人 Benny","Benny"],world:["乐高大电影","The LEGO Movie"],token:["飞船印记","Spaceship stamp"],intro:["Benny 拆下蓝色飞船的一块透明舷窗。试水时，蓝标浮筒浮着没动，黄标浮筒顺着水流漂向卡住的水车。","Benny unclips a window from his blue spaceship. In the test pool the blue float stays still. The yellow float drifts all the way to the jammed mill."],ask:["小探测船要沿哪条水道出发？","Which channel will carry the probe to the mill?"],choices:[["蓝标水道","The blue channel"],["把船留在池边","Leave it on the bank"],["黄标水道","The yellow channel"]],answer:2,out:["Benny 扣紧最后一块砖，再放开手。小船稳稳抵达水车，舷窗拍下了被水草勾住的叶片。","Benny snaps the last brick into place and lets go. The probe reaches the mill and photographs weeds caught on a paddle."]},
 {name:["史蒂夫","Steve"],world:["我的世界","Minecraft"],token:["红石印记","Redstone stamp"],intro:["史蒂夫在桥两端各放一盏红石灯。拉动拉杆，近处亮了，远处没亮。两段红石粉之间刚好缺了一格。","Steve sets a redstone lamp at each end of a bridge. When he flicks the lever only the near lamp lights. One block is missing from the redstone trail."],ask:["怎样把信号送过去？","What will carry the signal across?"],choices:[["补上那一格红石粉","Fill the gap with redstone dust"],["在灯旁放普通石块","Put stone beside the lamp"],["挖掉远处的灯","Remove the far lamp"]],answer:0,out:["咔哒！两盏灯一同亮起。史蒂夫收好镐子，指了指桥柱上显出的旧航标。","Click! Both lamps light up. Steve stows his pickaxe and points to an old marker on the bridge pier."]},
 {name:["苦力怕","Creeper"],world:["我的世界","Minecraft"],token:["晶洞印记","Cavern stamp"],intro:["一只苦力怕站在紫晶石后面。你敲左边洞壁，声音马上回来。敲右边，隔了一会儿才有回声。苦力怕朝右边转过头。","A Creeper stands behind an amethyst block. Tap the left wall and the echo comes straight back. Tap the right and the echo takes much longer. The Creeper turns right."],ask:["哪边更可能藏着深通道？","Which side probably hides a deep passage?"],choices:[["左边","The left wall"],["右边","The right wall"],["两边都一样浅","Both are equally shallow"]],answer:1,out:["紫晶后面果然有条长廊。小小的绿影晃了一下，把古老鲸歌的回声留给了你。","A long gallery opens behind the crystal. A small green silhouette vanishes, leaving the echo of an ancient whale song."]},
 {name:["向日葵","Sunflower"],world:["植物大战僵尸","Plants vs. Zombies"],token:["阳光印记","Sunlight stamp"],intro:["向日葵接了两杯晨露。两株星兰一样大，泥土也一样湿。树荫下那株闭着花苞，能照到朝阳那株已经开花。","Sunflower gathers two cups of dew. Two equal-sized orchids grow in equally wet soil. The shaded bud stays closed. The one in the morning sun has opened."],ask:["最值得改变什么条件？","What is the best change to test?"],choices:[["把两株都泡在水里","Soak both orchids"],["换花盆颜色","Change the pot colour"],["让闭合的花苞照到晨光","Let morning light reach the closed bud"]],answer:2,out:["向日葵挪开一片大叶子。第一缕光照到花苞上，花瓣中露出了小鲸最爱喝的蜜。","Sunflower moves a leaf aside. The first sunbeam opens the bud, revealing nectar for the calf."]},
 {name:["艾米特","Emmet"],world:["乐高大电影","The LEGO Movie"],token:["搭建印记","Builder stamp"],intro:["艾米特搭了两片积木墙。第一片每层的竖缝都对齐，一弯就分开。第二片用长砖跨过下一层的竖缝，摇了摇还很稳。","Emmet tests two brick walls. In the first, the seams line up and the wall splits when bent. In the second, long bricks cross the seams below. It holds firm."],ask:["炉边的新护墙该怎样拼？","How should we build the forge wall?"],choices:[["让上一层的砖跨过接缝","Overlap the seams in each row"],["所有竖缝对齐","Line up every seam"],["只加一块装饰砖","Add one decorative brick"]],answer:0,out:["艾米特扣上最后一块砖。小鲸靠在暖墙边睡着了，罗盘的铜环也轻轻转动起来。","Emmet snaps in the last brick. The calf dozes beside the warm wall as the compass ring quietly turns."]},
 {name:["伊布","Eevee"],world:["宝可梦","Pokémon"],token:["雪迹印记","Snowtrail stamp"],intro:["伊布发现了两串脚印。第一串被新雪盖住，第二串踩破了这层雪，脚印边缘还很清楚。","Eevee spots two trails. The first lies under fresh snow. The second cuts through that layer and its edges are still sharp."],ask:["要找刚经过的朋友，该跟哪串脚印？","Which trail belongs to the more recent traveller?"],choices:[["被新雪盖住的","The trail under the new snow"],["踩破新雪的","The trail cutting through the snow"],["只看脚印的大小","Choose by footprint size"]],answer:1,out:["伊布竖起耳朵追了上去。脚印尽头，雪羽正在等你们一起看极光。","Eevee pricks up its ears and follows the trail. Rime is waiting at its end to show you the aurora."]},
 {name:["豌豆射手","Peashooter"],world:["植物大战僵尸","Plants vs. Zombies"],token:["守望印记","Lookout stamp"],intro:["豌豆射手朝旧星盘吐出三颗豌豆。前两颗在铜环边缘弹开，第三颗穿过三个对齐的小孔，撞响了远处的铃。","Peashooter fires three peas at the old dial. Two bounce off a brass rim. The third passes through three aligned holes and rings a distant bell."],ask:["灯光该沿什么方向穿过星盘？","How should the beacon shine through the rings?"],choices:[["沿铜环边缘","Along the brass rim"],["垂直向下","Straight down"],["沿三个小孔对齐的方向","Along the three aligned holes"]],answer:2,out:["豌豆射手抖了抖叶子，朝正确的方向站好。塔尖亮了，云海深处传来一声鲸鸣。","Peashooter shakes its leaves and faces the aligned rings. The tower tip glows. Deep in the cloud sea, a whale answers."]}
];
function guestModal(r,feedback=""){
 if(!available(r))return;
 const g=guests[r],won=data.visits.includes(r),z=regions[r],answer=seals[r][0].split(" ");
 const left=tx(symbols[answer[0]]),right=tx(symbols[answer.at(-1)]);
 const body=won?`<p>${tx(g.out)}</p><div class="guest-clue">${ic("beacon",18)} <span>${tr(`灯塔记录：${left}在${right}的左边。`,`Beacon record: ${left} sits to the left of ${right}.`)}</span></div>`:`<p>${tx(g.intro)}</p><strong>${tx(g.ask)}</strong><div class="guest-choices">${g.choices.map((a,i)=>act("guest-answer",tx(a),"text-button",`data-r="${r}" data-i="${i}"`)).join("")}</div><div class="guest-response" role="status">${feedback}</div>`;
 modal("guest",`<div class="guest-scene" style="--scene:url('${image("isle",r)}')"><img src="${image("guest",r)}" alt="${tx(g.name)}"></div><div class="sheet-body">${eyebrow(won?"check":"pin",`${tx(g.world)} · ${tx(z.name)}`)}<h2 id="sheet-title">${tx(g.name)}</h2>${won?`<span class="guest-stamp">${ic("star",15)} ${tx(g.token)}</span>`:""}${body}<div class="actions">${act("dismiss",won?tr("收好印记","Keep stamp"):tr("稍后再来","Return later"),"glass")}</div></div>`,{r});
}
function visitorsBook(){
 return `<section class="visitor-book"><div class="section-title"><div>${kicker("GUEST STAMPS")}<h2>${tr("异世界访客","Guest encounters")}</h2></div><b>${data.visits.length} / 8</b></div><div class="visitor-grid">${guests.map((g,r)=>act("guest",`<img src="${image("guest",r)}" alt="" loading="lazy"><span><small>${tx(g.world)}</small><strong>${tx(g.name)}</strong><em>${data.visits.includes(r)?tx(g.token):tx(regions[r].name)}</em></span>${ic(data.visits.includes(r)?"check":available(r)?"star":"lock",14)}`,"guest-card",`data-r="${r}" ${available(r)?"":"disabled"}`)).join("")}</div></section>`;
}


function header(){
  const view=data.view;
  const tabs=[["home","compass",tr("探险营地","Expedition")],["map","map",tr("群岛航图","World map")],["book","book",tr("伙伴手记","Field journal")]];
  nav.innerHTML=`${act("home",`${badge()}<span class="wordmark">STARFALL <b>ATLAS</b></span>`,"brand",'aria-label="Starfall Atlas"')}<nav class="tabs" aria-label="${tr("游戏导航","Game navigation")}">${tabs.map(([id,icon,label])=>{const on=view===id||id==="home"&&["play","seal","ending","route","field","workshop"].includes(view);return act(id,ic(icon,17)+`<span>${label}</span>`,on?"selected":"",on?'aria-current="page"':"");}).join("")}</nav><div class="tools">${act("audio",ic(data.audio?"sound":"mute",18),"round",`title="${tr("音效","Sound")}" aria-label="${tr("音效","Sound")}" aria-pressed="${data.audio}"`)}${act("lang",ic("globe",16)+`<span>${tr("EN","中文")}</span>`,"language",`aria-label="${tr("Switch to English","切换到中文")}"`)}</div>`;
  document.documentElement.lang=tr("zh-CN","en");document.title=tr("星落群岛 · Starfall Atlas","Starfall Atlas · 星落群岛");
}
function specks(){return `<div class="motes" aria-hidden="true">${Array.from({length:16},(_,i)=>`<i style="--x:${(i*29+9)%98}%;--y:${(i*37+7)%90}%;--d:${i%5+5}s;--t:-${(i*19)%13}s"></i>`).join("")}</div>`;}
function eyebrow(icon,txt){return `<div class="eyebrow">${ic(icon,15)}<span>${txt}</span></div>`;}
function kicker(txt){return `<p class="kicker">${txt}</p>`;}
function statusLine(r){return `${islandTally(r)}/21 ${tr("处遗迹","ruins")} <span>·</span> ${data.beacons.includes(r)?tr("灯塔已点亮","Beacon lit"):tr("灯塔待点亮","Beacon sleeping")}`;}
function homeView(){
  const r=data.region,z=regions[r],started=activeTotal()>0 || data.active;
  const name=tr("星落群岛","Starfall Atlas");
  const intro=r===0?tr("皮卡丘和寻星狐发现了一枚会发光的罗盘。穿过八座浮空岛，带一颗迷路的星星回家。","Pikachu and a startrail fox have found a glowing compass. Cross eight floating islands and guide a lost star home."):tx(z.intro);
  const earned=Object.keys(data.done).length,n=data.companion;
  return `<section class="hero-banner ${r===0?"opening":"later"}" style="--scene:url('${r===0?"art/cover.webp":image("horizon",r)}')"><div class="hero-scene"></div>${specks()}<div class="hero-inner"><div class="hero-copy">${eyebrow("star",`${chapter(r)} <i></i> ${tx(z.name)}`)}<h1>${r===0?name:tx(z.name)}</h1>${r===0?`<div class="submark"><b></b>${tr("S T A R F A L L &nbsp; A T L A S","星 落 群 岛")}<b></b></div>`:""}<p>${intro}</p><div class="actions">${act("continue",ic("play",16)+(started?tr("继续探险","Continue expedition"):tr("开始探险","Begin expedition")),"primary")}${act("map",ic("map",17)+tr("查看航图","Open world map"),"glass")}</div></div>${act("guest",`<img src="${image("guest",r)}" alt=""><span><small>${tr("营地访客","Camp visitor")} · ${tx(guests[r].world)}</small><b>${tx(guests[r].name)}</b></span>${ic(data.visits.includes(r)?"check":"book",16)}`,"hero-guest",`data-r="${r}"`)}</div></section>
  <div class="content home-content"><section class="routes"><div class="section-title"><div>${kicker("EXPEDITION ROUTES")}<h2>${tr("探险路线","Expedition routes")}</h2></div><div class="section-counter">${ic("flag",16)} ${tr("本岛进度","Island progress")} <b>${islandTally(r)} / 21</b></div></div><div class="route-grid">${families.map((m,i)=>{const a=modes[m];return act("route",`<div class="route-art" style="background-image:url('art/discipline-${a.image}.webp')"></div><div class="route-top"><span class="route-emblem">${ic(a.icon,18)}</span><small>${pad(tally(r,m))} / 07</small></div><div class="route-bottom"><span>${tx(a.kind)}</span><h3>${tx(a.name)}</h3></div>`,`route-card route-${m}`,`data-mode="${m}"`);}).join("")}</div></section>
  <section class="workshop-banner" style="--scene:url('art/workshop-cover.webp')"><div>${eyebrow("box",tr("营地工坊","Camp workshop"))}<h2>${tr("积木温室","Brickbloom Workshop")}</h2><p>${tr("搭浮台，种向日葵和豌豆射手。试试你的布局能不能守住幼苗。","Build studded platforms and plant sunflowers and pea shooters. Test your layout against the moss slimes.")}</p>${act("workshop",ic(data.gardenWins.includes(r)?"check":"box",16)+(data.gardenWins.includes(r)?tr("已守护 · 重开蓝图","Protected · revisit blueprint"):tr("打开蓝图","Open blueprint")),"glass")}</div></section><section class="camp-row">${act("book",`<img src="${image("keeper",n)}" alt=""><div>${kicker(tr("伙伴手记","Field journal"))}<strong>${tx(regions[n].keeper)} <span>· ${tx(regions[n].species)}</span></strong><p>${recruited(n)?tx(regions[n].note):tr("栗尾在第一座遗迹等你。","Pip is waiting at the first ruin.")}</p></div>`,"companion-strip")}${act("beacon-info",`<span class="beacon-medal">${ic("beacon",32)}</span><div>${kicker(tr("本章终点","Chapter finale"))}<strong>${tr("星序灯塔","The star beacon")}</strong><p>${tr("每条路线各修复五处遗迹，集齐三组线索。","Restore five ruins on each route to gather the three sets of clues.")}</p></div>`,"beacon-strip")}</section><div class="journey-foot"><span>${ic("compass",16)} ${tr("航程谜题","Campaign puzzles")} <b>${earned+data.beacons.length} / ${total}</b></span><span>${ic("save",15)} ${tr("进度自动保存在此浏览器","Progress saves in this browser")}</span></div></div>`;
}
function routeView(){
  const r=data.region,m=routeMode,z=regions[r],a=modes[m];
  return `<div class="content interior route-page">${act("home",ic("back",15)+tr("营地","Camp"),"back-link")}<div class="route-hero" style="--scene:url('art/discipline-${a.image}.webp')"><div>${eyebrow(a.icon,`${chapter(r)} · ${tx(z.name)}`)}<h1>${tx(a.name)}</h1><p>${tx(a.task)}</p></div></div><div class="family-tabs">${families.map(f=>act("route",ic(modes[f].icon,17)+tx(modes[f].name),f===m?"selected":"",`data-mode="${f}"`)).join("")}</div><div class="section-title"><div>${kicker("RUIN SITES")}<h2>${tr("选择遗迹","Choose a ruin")}</h2></div><strong>${tally(r,m)} / 7</strong></div><div class="level-grid">${Array.from({length:7},(_,j)=>{
    const i=r*7+j,done=has(m,i),saved=!!data.drafts[puzzleKey(m,i)], title=window.StarfallModes?.[m]?.getTitle?.(i,data.lang);
    return act("level",`<span class="level-number">${pad(j+1)}</span><div><b>${typeof title==="string"?title:tr(`${tx(a.name)} · ${j+1}`,`${tx(a.name)} ${j+1}`)}</b><small>${done?tr("已修复 · 可以重玩","Restored · replay"):saved?tr("途中存档","In progress"):j>4?tr("进阶遗迹","Expert ruin"):tr("等待探索","Unexplored")}</small></div>${ic(done?"check":saved?"save":a.icon,19)}`,"level"+(done?" complete":""),`data-mode="${m}" data-i="${i}"`);}).join("")}</div></div>`;
}
function mapView(){
  const r=previewRegion,z=regions[r],open=available(r);
  return `<div class="content interior"><div class="section-title page-title"><div>${kicker("WORLD ATLAS")}<h1>${tr("群岛航图","World map")}</h1></div><div class="section-counter">${ic("beacon",17)} ${tr("已点亮","Beacons lit")} <b>${data.beacons.length} / 8</b></div></div>
  <div class="chart"><img src="art/chart.webp" alt="${tr("星空云海中的八座浮岛","Eight floating islands above a sea of clouds")}"><svg class="map-line" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${coord.map(p=>p.join(",")).join(" ")}" fill="none" stroke="#f6d59b" stroke-width=".4" stroke-dasharray=".85 1.1" opacity=".7"/></svg>${regions.map((region,k)=>act("inspect",`<b>${pad(k+1)}</b><span>${tx(region.name)}</span>`,`map-pin ${available(k)?"open":"locked"} ${k===r?"selected":""}`,`data-r="${k}" style="left:${coord[k][0]}%;top:${coord[k][1]}%" aria-label="${chapter(k)} ${tx(region.name)}"`)).join("")}</div>
  <div class="map-detail"><img src="${image("isle",r)}" alt=""><div>${eyebrow("pin",chapter(r))}<h2>${tx(z.name)}</h2><p>${open?tx(z.intro):tr(`点亮${tx(regions[r-1].name)}的灯塔后，航路就会打开。`,`Light the beacon in ${tx(regions[r-1].name)} to open this route.`)}</p></div><div>${open?act("visit",ic("flag",17)+tr("前往营地","Visit camp"),"primary",`data-r="${r}"`):`<span class="locked-label">${ic("lock",17)} ${tr("航路未开启","Route closed")}</span>`}<small>${statusLine(r)}</small></div></div></div>`;
}


function albumView(){
 const found=data.secretFinds, r=bookRegion,lib=window.StarfallDiscoveries;
 const counts=lib.worlds.map(world=>world.ids.filter(id=>found.includes(id)).length);
 const local=lib.locations.filter(site=>site.region===r);
 const hints=available(r)?`<details class="secret-clues"><summary>${ic("compass",16)}${tx(regions[r].name)} · ${tr("查看寻迹提示","Read the trail hints")}</summary>${local.map(site=>`<p>${ic(found.includes(site.id)?"check":"feather",15)}<span>${tx(site.hint)}</span></p>`).join("")}</details>`:`<p class="secret-quiet">${tr("抵达这座岛后，就能读到当地的线索。","Reach this island to read its trail hints.")}</p>`;
 const keepsakes=found.map(id=>{
   const site=lib.byId(id),e=lib.episode(id);
   if(!e)return "";
   return act("secret-memory",`<img src="${e.art}" loading="lazy" alt=""><span><small>${tx(regions[site.region].name)}</small><b>${tx(e.name)}</b></span>`,"secret-keepsake",`data-secret="${id}"`);
 }).join("");
 const worlds=lib.breadth(found);
 return `<section id="secret-album" class="secret-album" tabindex="-1"><div class="section-title"><div>${kicker("HIDDEN DISCOVERIES")}<h2>${tr("栗尾的奇遇夹页","Pip’s secret scrapbook")}</h2></div><b class="secret-count">${found.length} / ${lib.locations.length}</b></div>
 <div class="secret-worlds">${lib.worlds.map((world,k)=>`<span class="${counts[k]?"has-stamp":""}">${tx(world.name)} <b>${counts[k]}/4</b></span>`).join("")}</div>
 ${hints}${found.length?`<div class="secret-keepsakes">${keepsakes}</div>`:""}
 <div class="secret-envelope">${ic("star",21)}<span>${worlds===4?tr("四界营火明信片","The Four Worlds campfire postcard"):tr("四个世界各留一枚印记，就能拆开栗尾的信。","Find one keepsake from each world to open Pip’s letter.")}</span>${worlds===4?act("secret-postcard",tr("拆开信封","Open letter"),"glass"):`<b>${worlds}/4</b>`}</div></section>`;
}
function refreshAlbum(){
 const current=screen.querySelector("#secret-album");
 if(current)current.outerHTML=albumView();
}
function goToAlbum(site){
 setView("book");
 if(site)bookRegion=site.region;
 if(site)render();
 const album=document.getElementById("secret-album");
 album?.focus({preventScroll:true});
 album?.scrollIntoView({block:"start"});
}
function inspectTrace(id,replay=false){
 const lib=window.StarfallDiscoveries,site=lib.byId(id),e=lib.episode(id);
 if(!site||!e||!available(site.region))return;
 if(!replay&&data.secretFinds.includes(id)){secretMemory(id);return;}
 modal("secret",`<div class="secret-heading"><div>${eyebrow("compass",tx(regions[site.region].name))}<h2 id="sheet-title">${tx(site.title)}</h2></div>${act("dismiss",ic("close",17),"round",`aria-label="${tr("回到现场","Return to scene")}"`)}</div><div id="secret-host"></div>`,{id});
 const host=document.getElementById("secret-host");
 const first=!data.secretFinds.includes(id), previousBreadth=lib.breadth(data.secretFinds);
 const recordFind=()=>{
   if(sheetKind!=="secret"||sheetInfo?.id!==id||!host.isConnected)return;
   if(!data.secretFinds.includes(id)){
     data.secretFinds.push(id);persist();
     screen.querySelectorAll(`[data-sf="trace"][data-secret="${id}"]`).forEach(el=>el.classList.add("traced"));
     refreshAlbum();
   }
 };
 const onWin=()=>{
   if(!host.isConnected||sheetKind!=="secret")return;
   recordFind();
   secretMemory(id,first,previousBreadth<4&&lib.breadth(data.secretFinds)===4);
 };
 const stop=e.mount(host,{lang:data.lang,sound,onWin,onDiscover:recordFind});
 if(host.isConnected)secretCleanup=stop;
 else if(typeof stop==="function")stop();
}
function secretMemory(id,justFound=false,letterArrived=false){
 const e=window.StarfallDiscoveries.episode(id),site=window.StarfallDiscoveries.byId(id);
 if(!e||!site||!data.secretFinds.includes(id))return;
 const completed=justFound&&data.secretFinds.length===window.StarfallDiscoveries.locations.length;
 const letter=letterArrived||completed;
 const caption=completed?tr("最后一枚印记落下，明信片的背面也写满了。","The last stamp fills the back of the postcard."):tr("栗尾把四个世界的邮戳按上信封。里面有一张寄给 Lucas 的明信片。","Pip presses four postmarks onto an envelope. Inside is a postcard for Lucas.");
 modal("keepsake",`<div class="secret-reveal" style="--scene:url('${image("isle",site.region)}')"><img src="${e.art}" alt=""></div><div class="sheet-body">${eyebrow("star",tx(site.world.name)+" · "+tx(regions[site.region].name))}<h2 id="sheet-title">${tx(e.name)}</h2><p>${tx(e.memory)}</p><div class="secret-saved">${ic("book",16)} ${tr("已收进奇遇夹页","Filed in the scrapbook")} <b>${data.secretFinds.length} / 16</b></div>${letter?`<div class="secret-letter-news"><p>${caption}</p>${act("secret-postcard",tr("打开明信片","Open postcard"),"primary")}</div>`:""}<div class="actions">${act("dismiss",tr("回到现场","Return to scene"),"glass")}${act("secret-book",tr("翻开夹页","Open scrapbook"),"text-button",`data-secret="${id}"`)}${act("secret-replay",tr("再玩一次","Play again"),"text-button",`data-secret="${id}"`)}</div></div>`,{id});
}
function showPostcard(back=false){
 const lib=window.StarfallDiscoveries,found=data.secretFinds;
 if(lib.breadth(found)!==4)return;
 const full=found.length===lib.locations.length;
 const side=back&&full?"back":"front",lang=data.lang;
 const caption=side==="back"?tr("十六件小事，都留在了这一面。","Sixteen little discoveries fill this side."):tr("给 Lucas，纪念第一次集齐四个世界的奇遇。","For Lucas, on finding a little wonder in all four worlds.");
 const alt=side==="back"?tr("盖满十六枚奇遇印记的明信片背面","The reverse of the postcard, with all sixteen keepsakes"):tr("皮卡丘、班尼、史蒂夫和向日葵在星空下围着营灯合影","Pikachu, Benny, Steve and Sunflower gathered around the camp lantern under the stars");
 modal("postcard",`<div class="postcard-photo"><div class="postcard-pending" role="status">${tr("正在打开信封…","Opening the envelope…")}</div><img hidden alt="${alt}"></div><div class="sheet-body">${eyebrow("star",tr("栗尾来信","A letter from Pip"))}<h2 id="sheet-title">${tr("四界营火","Four worlds, one campfire")}</h2><p>${caption}</p>${!full?`<p class="secret-quiet">${tr("集齐十六件纪念物，还能翻看盖满印记的背面。","Find all sixteen keepsakes to reveal the stamped back.")}</p>`:""}<div class="actions"><a class="postcard-download" hidden download="Lucas-Starfall-${side}-${lang}.png">${ic("save",16)} ${tr("保存明信片","Save postcard")}</a>${full?act(side==="back"?"secret-postcard":"secret-back",tr("翻面","Turn over"),"glass"):""}${act("dismiss",tr("收好","Close"),"text-button")}</div></div>`);
 const preview=sheet.querySelector(".postcard-photo img"),status=sheet.querySelector(".postcard-pending"),download=sheet.querySelector(".postcard-download");
 lib.postcardUrl(side,lang).then(url=>{
   if(!preview.isConnected)return;
   preview.src=url;preview.hidden=false;download.href=url;download.hidden=false;status.remove();
 }).catch(()=>{
   if(status.isConnected)status.textContent=tr("这张明信片的图片没有载入。请重新打开信封。","The postcard image could not load. Reopen the envelope to try again.");
 });
}

function pictureCollection(){
 const module=window.StarfallModes.weave, indices=Array.from({length:56},(_,i)=>i).filter(i=>has("weave",i));
 return `<section class="picture-journal"><div class="section-title"><div>${kicker("WOVEN DISCOVERIES")}<h2>${tr("星纹收藏册","Woven discoveries")}</h2></div><b>${indices.length} / 56</b></div>${indices.length?`<div class="picture-grid">${indices.map(i=>act("picture",`<img src="${module.preview(i)}" alt=""><strong>${module.getTitle(i,data.lang)}</strong>`,"picture-card",`data-i="${i}"`)).join("")}</div>`:`<p>${tr("完成星纹绘卷后，织出的图案会在这里显色。","Complete a Star Weave puzzle and its coloured motif will appear here.")}</p>`}</section>`;
}
function showPicture(i){
 if(!Number.isInteger(i)||!has("weave",i))return;
 const a=window.StarfallModes.weave,r=Math.floor(i/7);
 modal("picture",`<div class="picture-display"><img src="${a.preview(i)}" alt="${a.getTitle(i,data.lang)}"></div><div class="sheet-body">${eyebrow("weave",tx(regions[r].name))}<h2 id="sheet-title">${a.getTitle(i,data.lang)}</h2><p>${a.getNote(i,data.lang)}</p>${act("dismiss",tr("收回手记","Back to journal"),"glass")}</div>`);
}
function creditDetails(){
 return `<details class="art-credit"><summary>${tr("访客与美术来源","Guest art credits")}</summary><p>${tr("本作是为 Lucas 制作的同人探险。群岛、当地伙伴与调查场景使用原创插画。访客角色分别来自宝可梦、乐高、我的世界及植物大战僵尸。","A personal fan adventure for Lucas. The islands, resident companions and field scenes use original illustrations. Guest characters belong to Pokémon, LEGO, Minecraft and Plants vs. Zombies.")}</p><p><a href="https://www.pokemon.com/us/pokedex/pikachu" target="_blank" rel="noopener">Pokémon · Pikachu</a> · <a href="https://www.pokemon.com/us/pokedex/eevee" target="_blank" rel="noopener">Eevee</a> · <a href="https://www.lego.com/en-us/themes/the-lego-movie-2/characters/benny" target="_blank" rel="noopener">LEGO · Benny</a> · <a href="https://www.lego.com/en-nl/themes/the-lego-movie-2/characters/emmet" target="_blank" rel="noopener">Emmet</a> · <a href="https://www.smashbros.com/en_US/fighter/77.html" target="_blank" rel="noopener">Minecraft · Steve</a> · ${tr("植物与像素角色立绘沿用 Lucas 游戏大厅的素材。彩蛋中的方块纹理来自 Mojang 的基岩版示例资源。","Plant and pixel-character sprites come from Lucas’s game library. Secret block textures use Mojang’s Bedrock sample resources.")} <a href="https://github.com/Mojang/bedrock-samples/tree/main/resource_pack/textures" target="_blank" rel="noopener">Mojang · Bedrock Samples</a></p></details>`;
}

function bookView(){
  const r=bookRegion,z=regions[r],met=recruited(r),count=regions.filter((_,i)=>recruited(i)).length;
  return `<div class="content interior"><div class="section-title page-title"><div>${kicker("FIELD JOURNAL")}<h1>${tr("伙伴手记","Field journal")}</h1></div><div class="section-counter">${ic("paw",18)} ${tr("已结识","Befriended")} <b>${count} / 8</b></div></div>
  <div class="journal-layout"><div class="journal-list">${regions.map((a,k)=>act("record",`<img src="${image("keeper",k)}" alt="" class="${recruited(k)?"":"undiscovered"}"><span><small>${tx(a.name)}</small><b>${recruited(k)?tx(a.keeper):tr("未知伙伴","Unknown companion")}</b></span>${ic(recruited(k)?"paw":"lock",15)}`,k===r?"selected":"",`data-r="${k}"`)).join("")}</div>
  <article class="specimen"><div class="portrait"><img src="${image("keeper",r)}" alt="" class="${met?"":"undiscovered"}"></div><div class="specimen-notes">${eyebrow("pin",tx(z.name))}<h2>${met?tx(z.keeper):tr("尚未相遇","Yet to meet")}</h2>${met?`<div class="affinity">${ic(elements[r][2],14)} ${tr(elements[r][0]+"属性",elements[r][1]+" affinity")}</div>`:""}<strong>${met?tx(z.species):tr("在这座岛上修好第一处遗迹，就会发现它的踪迹。","Restore one ruin on this island to meet its companion.")}</strong>${met?`<p>${tx(z.meet)}</p><p class="field-note">${tx(z.note)}</p>${data.fieldWins.includes(r)?`<p class="field-note"><b>${tx(window.StarfallField.cases[r].stamp)}</b><br>${tx(window.StarfallField.cases[r].ending)}</p>`:""}${act("field",ic("compass",17)+(data.fieldWins.includes(r)?tr("重访栖息地","Revisit habitat"):tr("实地调查","Investigate habitat")),"primary",`data-r="${r}"`)} ${act("equip",ic("paw",17)+(data.companion===r?tr("正在同行","Travelling together"):tr("邀请同行","Travel together")),"glass",data.companion===r?"disabled":"")}`:""}</div></article></div>
  ${albumView()}${visitorsBook()}${pictureCollection()}<section class="book-foot"><div>${ic("save",20)}<span>${tr("探险存档","Expedition save")} <small>${activeTotal()} / ${total}</small></span></div><div>${act("export",tr("导出存档","Export save"),"text-button")}${act("import",tr("导入存档","Import save"),"text-button")}<input id="save-file" type="file" accept=".json,application/json" hidden></div></section>${data.beacons.length===8?act("ending",ic("star")+tr("重温结局","Revisit the ending"),"primary"):""}${creditDetails()}</div>`;
}
function playView(){
  const {m,i}=data.active,r=Math.floor(i/7),a=modes[m],z=regions[r];
  return `<div class="content play-page"><div class="play-top">${act("back-route",ic("back",15)+tr("遗迹列表","Ruin sites"),"back-link")}<div class="play-location">${ic("pin",14)} ${tx(z.name)} <i></i> ${tr(`遗迹 ${pad(i%7+1)} / 07`,`Ruin ${pad(i%7+1)} / 07`)}</div></div><div class="play-heading"><div>${eyebrow(a.icon,tx(a.kind))}<h1>${tx(a.name)}</h1></div><div class="play-friends">${act("guest",`<img src="${image("guest",r)}" alt=""><span>${tx(guests[r].name)}</span>`,"buddy guest-buddy",`data-r="${r}"`)}${act("buddy",`<img src="${image("keeper",data.companion)}" alt=""><span>${tx(regions[data.companion].keeper)}</span>`,"buddy",`title="${tr("伙伴观察","Companion observation")}"`)}</div></div><section id="mode-host" class="mode-host" aria-label="${tx(a.name)}"></section></div>`;
}
function endingView(){
  const mastered=Object.keys(data.done).length===168;
  return `<section class="last-scene">${eyebrow("star",tr("终章 · 云海之上","Epilogue · Above the clouds"))}<h1>${tr("星鲸归航","The whales return")}</h1><p>${tx(regions[7].ending)}</p>${mastered?`<p>${tr("每一处遗迹都醒了。翻开航图，八座岛的灯正一盏接一盏地回答你。","Every ruin is awake. On your atlas, eight islands answer one another in light.")}</p>`:""}<div class="actions">${act("home",ic("compass",17)+tr("返回营地","Return to camp"),"primary")}${act("book",ic("book",17)+tr("伙伴手记","Field journal"),"glass")}</div></section>`;
}


const elements=[["草","Leaf","leaf"],["水","Tide","drop"],["风","Wind","feather"],["晶","Crystal","gem"],["草","Leaf","leaf"],["火","Fire","flame"],["冰","Frost","snow"],["星","Star","star"]];
function clueText([type,a,b,c]){
 const A=tx(symbols[a]),B=symbols[b]?tx(symbols[b]):"",C=symbols[c]?tx(symbols[c]):"";
 switch(type){
   case "at":return tr(`${A}在第 ${b+1} 个位置。`,`${A} is in position ${b+1}.`);
   case "edge":return tr(`${A}在最左或最右的一端。`,`${A} is at one end of the dial.`);
   case "next":return tr(`${B}紧挨在${A}的右边。`,`${B} sits immediately to the right of ${A}.`);
   case "before":return tr(`${A}在${B}的左边，中间可以有别的符号。`,`${A} is left of ${B}, with any distance between them.`);
   case "between":return tr(`${A}夹在${B}和${C}正中间，三个符号紧挨着。`,`${A} is between ${B} and ${C}, touching both.`);
 }
}
function clueGroups(r,always=false){
  return `<div class="clue-grid">${families.map((m,j)=>{const known=always||tally(r,m)>=5;return `<div class="clue-group ${known?"known":""}"><h3>${ic(modes[m].icon,17)}${tx(modes[m].name)} ${known?ic("check",15):ic("lock",14)}</h3>${known?seals[r][1].filter((_,k)=>k%3===j).map(c=>`<p>${clueText(c)}</p>`).join(""):`<p>${tr("修复五处，取得线索","Restore five ruins for these clues")} · ${Math.min(5,tally(r,m))}/5</p>`}</div>`;}).join("")}</div>`;
}
function plate(id){return `${ic(id,25)}<span>${tx(symbols[id])}</span>`;}
function sealView(){
  const r=data.region,z=regions[r],tokens=seals[r][0].split(" "),order=data.orders[r]||[];
  const pool=[...tokens.slice(1).reverse(),tokens[0]];
  return `<div class="content interior seal-page">${act("home",ic("back",15)+tr("营地","Camp"),"back-link")}<div class="section-title"><div>${eyebrow("beacon",`${chapter(r)} · ${tx(z.name)}`)}<h1>${tr("星序灯塔","The star beacon")}</h1><p>${tr("从左到右装入符印，让航线符合三份考察记录。点已装入的符印可以取下。","Fit the seals from left to right to match the three expedition records. Select a fitted seal to take it back.")}</p></div></div><div class="seal-table"><div class="sockets">${tokens.map((_,i)=>order[i]?act("unseal",plate(order[i]),"seal-piece filled",`data-i="${i}"`):`<span class="seal-piece blank"><small>${pad(i+1)}</small></span>`).join("")}</div><div class="token-bank">${pool.map(id=>act("add-seal",plate(id),"token",`data-token="${id}" ${order.includes(id)?"disabled":""}`)).join("")}</div></div>${clueGroups(r,true)}${data.visits.includes(r)?act("guest",`<img src="${image("guest",r)}" alt=""><span>${tx(guests[r].name)} · ${tr("重读访客记录","Read guest record")}</span>`,"buddy guest-buddy",`data-r="${r}"`):""}<div class="actions seal-actions">${act("test-seal",ic("beacon",17)+tr("点亮灯塔","Light the beacon"),"primary",order.length!==tokens.length?"disabled":"")}${act("seal-hint",ic("paw",17)+tr("伙伴提示","Ask companion"),"glass")}${act("clear-seal",tr("清空星盘","Clear the dial"),"text-button",order.length?"":"disabled")}</div><p id="seal-response" role="status"></p></div>`;
}
function infoModal(){
 const r=data.region;
 modal("info",`<div class="sheet-body">${eyebrow("beacon",tx(regions[r].name))}<h2 id="sheet-title">${tr("灯塔线索","Beacon clues")}</h2><p>${tr("每条路线任选五处遗迹修复，就能读到一份记录。三份记录合起来会告诉你灯塔符印的排列顺序。","Restore any five ruins on a route to read its record. Together, the three records reveal the order of the beacon seals.")}</p>${clueGroups(r)}<div class="actions">${sealReady(r)?act("go-seal",ic("beacon")+tr("前往灯塔","Visit beacon"),"primary"):""}${act("dismiss",tr("返回","Back"),"glass")}</div></div>`);
}
function resultSheet({r,m,i,first,stage,finished,field}){
  const z=regions[r],isSeal=m==="seal",isField=m==="field",isWorkshop=m==="workshop";
  let img=first?image("keeper",r):isSeal?image("isle",r):isField?image("keeper",r):isWorkshop?"art/workshop-cover.webp":`art/discipline-${modes[m].image}.webp`;
  const woven=m==="weave"?window.StarfallModes.weave.preview(i):null;
  let title=first?tr(`遇见${tx(z.keeper)}`,`Meet ${tx(z.keeper)}`):isSeal?tr("灯塔已点亮","Beacon rekindled"):isField?tr("调查记录已收录","Observation recorded"):isWorkshop?tr("温室守护成功","Seedling protected"):tr("遗迹已修复","Ruin restored");
  let desc=first?tx(z.meet):isSeal?tx(z.ending):isField?tr("你的发现已经记进了这座岛的伙伴手记。","Your discovery is now part of this companion's field journal."):isWorkshop?tr("这张蓝图已盖上温室印章。你仍然可以回来试验别的搭法。","This blueprint has earned its greenhouse stamp. Come back to try a different build."):stage===5?tr("第五处遗迹亮起了。你找到一份能读懂星序灯塔的记录！","The fifth ruin lights up. You found a field record for the star beacon!"):stage===7?tr("这条路线上的七处遗迹已经全部修复。","All seven ruins along this island route are now restored."):m==="weave"&&window.StarfallModes.weave.getNote?window.StarfallModes.weave.getNote(i,data.lang):tr("罗盘留住了这处遗迹的星光。","Your compass holds the light of this ruin.");
  const done="dismiss", nextAction=isSeal?(r===7?"ending":"next-island"):isField?"book":isWorkshop?"home":"continue";
  const label=isSeal?(r===7?tr("看星鲸归航","Watch the reunion"):tr("驶向下一座岛","Sail to the next island")):isField?tr("翻开手记","Open journal"):isWorkshop?tr("返回营地","Return to camp"):tr("继续探险","Continue expedition");
  modal("result",`<div class="reward-image ${first?"portrait-reward":""}" style="--scene:url('${img}')">${woven?`<img class="victory-motif" src="${woven}" alt="">`:""}</div><div class="sheet-body">${eyebrow(first||isField?"paw":isSeal?"beacon":"star",`${chapter(r)} · ${tx(z.name)}`)}<h2 id="sheet-title">${title}</h2><p>${desc}</p>${!isSeal&&!isField&&!isWorkshop?`<div class="result-progress"><span>${tx(modes[m].name)}</span><b>${tally(r,m)} / 7</b></div>${progress(tally(r,m),7)}`:""}<div class="actions">${act(nextAction,ic("play",15)+label,"primary",`data-r="${r}"`)}${act(done,tr("关闭","Close"),"glass")}</div></div>`,{r});
}
function companionSheet(){
 const r=data.companion,z=regions[r],element=elements[r];
 modal("buddy",`<div class="buddy-main"><img src="${image("keeper",r)}" alt=""><div>${eyebrow(element[2],tr(`${element[0]}属性`,`${element[1]} affinity`))}<h2 id="sheet-title">${tx(z.keeper)}</h2><strong>${tx(z.species)}</strong><p>${tx(z.note)}</p></div></div><div class="sheet-body compact"><p>${tr("在与自身属性共鸣的灯塔，同行伙伴可以辨认正确的下一枚符印。","When its affinity matches a beacon, your travelling companion can identify the next seal.")}</p>${act("dismiss",tr("继续","Continue"),"primary")}</div>`);
}
function dossierView(which){
 const r=data.region,workshop=which==="workshop",z=regions[r];
 return `<div class="content play-page"><div class="play-top">${act(workshop?"home":"book",ic("back",15)+(workshop?tr("营地","Camp"):tr("手记","Journal")),"back-link")}<span class="play-location">${ic("pin",15)} ${tx(z.name)}</span></div><div class="play-heading"><div>${eyebrow(workshop?"box":"paw",workshop?tr("营地工坊","Camp workshop"):tx(z.keeper))}<h1>${workshop?tr("积木温室","Brickbloom Workshop"):tr("栖息地调查","Habitat investigation")}</h1></div></div><section id="mode-host"></section></div>`;
}


function render(){
  header();
  screen.classList.toggle("in-adventure",["play","seal"].includes(data.view));
  screen.style.setProperty("--habitat",`url("${image("field",data.region)}")`);
  if(data.view==="field"&&!recruited(data.region) || data.view==="seal"&&!sealReady(data.region))data.view="home";
  const views={home:homeView,map:mapView,book:bookView,route:routeView,play:playView,seal:sealView,ending:endingView,field:()=>dossierView("field"),workshop:()=>dossierView("workshop")};
  screen.innerHTML=(views[data.view]||homeView)();
  window.StarfallDiscoveries.decorate(screen,{view:data.view,region:data.region,route:routeMode,frontier:data.beacons.length,lang:data.lang,found:data.secretFinds});
  const optional=data.view==="field"||data.view==="workshop",playing=data.view==="play";
  if(!optional&&!playing)return;
  const r=data.region,mode=playing?data.active.m:data.view,i=playing?data.active.i:r,session=++playSession;
  const key=playing?puzzleKey(mode,i):r, drafts=playing?data.drafts:mode==="field"?data.fields:data.gardens;
  const module=playing?window.StarfallModes?.[mode]:mode==="field"?window.StarfallField:window.StarfallWorkshop;
  const host=document.getElementById("mode-host");
  if(!module?.mount){
    host.innerHTML=`<p>${tr("没有读到这处遗迹的游戏文件，请重新打开游戏。","The files for this activity could not be loaded. Reopen the game to try again.")}</p>`;
    return;
  }
  cleanup=module.mount(host,{index:i,region:r,companion:data.companion,lang:data.lang,saved:drafts[key]||null,sound,
    placeTrace(parent){return window.StarfallDiscoveries.addToSurface(parent,mode,r,data.lang,data.secretFinds);},
    onSave(snapshot){if(session!==playSession)return;if(snapshot==null)delete drafts[key];else drafts[key]=snapshot;persist();},
    onWin(result){
      if(session!==playSession)return;
      // Leave the completed board before presenting its reward. Reloading here returns to the camp or route.
      const first=playing&&!recruited(r);
      if(playing){
        const moves=Number.isSafeInteger(result?.moves)?Math.max(0,result.moves):0;
        data.done[key]=has(mode,i)?Math.min(data.done[key],moves):moves;
        if(first)data.companion=r;
        routeMode=mode;
        data.active=null;
      }else{
        const wins=mode==="field"?data.fieldWins:data.gardenWins;
        if(!wins.includes(r))wins.push(r);
      }
      delete drafts[key];
      const args={r,m:mode,i,first,stage:playing?tally(r,mode):0};
      queueMicrotask(()=>{
        if(session!==playSession)return;
        setView(playing?"route":mode==="field"?"book":"home");
        if(mode==="field"&&bookRegion!==r){bookRegion=r;render();}
        resultSheet(args);
      });
    }});
}
function refresh(){
  clearMode();render();persist();
}
function clearSealMessage(text){
 const el=document.getElementById("seal-response");if(el){el.textContent=text;el.scrollIntoView({behavior:"auto",block:"nearest"});}
}
function trySeal(){
 const r=data.region, sequence=data.orders[r]||[],clues=seals[r][1];
 if(sequence.length!==seals[r][0].split(" ").length)return;
 const fail=clues.find(rule=>!follows(sequence,rule));
 if(fail){sound("tap");clearSealMessage(tr("这条记录和星盘还没对上：","One record still disagrees with the dial: ")+clueText(fail));return;}
 const newly=!data.beacons.includes(r);if(newly)data.beacons.push(r);
 sound("success");setView("home");resultSheet({r,m:"seal"});
}
function hintSeal(){
 const r=data.region, solution=seals[r][0].split(" "),order=data.orders[r]||[],buddy=data.companion;
 const first=solution.findIndex((val,i)=>val!==order[i]), name=tx(regions[buddy].keeper);
 if(first<0){clearSealMessage(tr("罗盘发出了和弦。试试点亮灯塔！","The compass sings a chord. Light the beacon!"));return;}
 if(elements[buddy][2]===elements[r][2]){
   clearSealMessage(tr(`${name}与灯塔产生了共鸣：第 ${first+1} 格应该放${tx(symbols[solution[first]])}。`,`${name} feels the beacon resonate. ${tx(symbols[solution[first]])} belongs in slot ${first+1}.`));
 }else{
   const rule=seals[r][1].find(rule=>rule.slice(1).includes(solution[first]));
   clearSealMessage(tr(`${name}轻轻敲了敲记录：`,`${name} taps this record: `)+clueText(rule));
 }
}
let pendingImport=null;
function exportFile(){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),el=document.createElement("a");
 el.href=url;el.download=`Starfall-Atlas-${new Date().toISOString().slice(0,10)}.json`;el.click();
 setTimeout(()=>URL.revokeObjectURL(url),2000);
}
document.addEventListener("change",async e=>{
 if(e.target.id!=="save-file")return;
 const file=e.target.files[0];e.target.value="";if(!file)return;
 try{
   if(file.size>4_000_000)throw Error();
   const raw=JSON.parse(await file.text());
   if(!raw || raw.version!==1 || !raw.done || !Array.isArray(raw.beacons) || !raw.drafts)throw Error();
   pendingImport=readSave(raw);if(!pendingImport)throw Error();
   const n=Object.keys(pendingImport.done).length+pendingImport.beacons.length;
   modal("import",`<div class="sheet-body">${eyebrow("save",tr("探险存档","Expedition save"))}<h2 id="sheet-title">${tr("载入这份存档？","Load this save?")}</h2><p>${tr(`这份存档完成了 ${n} / 176 个主线及进阶谜题。载入后将替换本机当前进度。`,`This save has ${n} of 176 campaign puzzles complete. Loading it replaces the current progress on this device.`)}</p><div class="actions">${act("confirm-import",tr("载入存档","Load save"),"primary")}${act("dismiss",tr("取消","Cancel"),"glass")}</div></div>`);
 }catch{pendingImport=null;toast(tr("无法读取这份探险存档。","This expedition save could not be read."));}
});
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-sf]");if(!b||b.disabled)return;
 const action=b.dataset.sf,r=data.region,chosen=Number(b.dataset.r),i=Number(b.dataset.i),m=b.dataset.mode;
 if(action!=="audio"&&action!=="test-seal")sound("tap");
 switch(action){
  case "home":case "map":setView(action);break;
  case "book":setView("book");if(Number.isInteger(chosen)&&recruited(chosen)){bookRegion=chosen;render();}break;
  case "continue":goTo(resumeOrNext(r));break;
  case "lang":data.lang=data.lang==="zh"?"en":"zh";refresh();break;
  case "audio":data.audio=!data.audio;persist();header();if(data.audio)sound("tap");document.querySelector('[data-sf="audio"]')?.focus({preventScroll:true});break;
  case "route":routeMode=m;setView("route");break;
  case "back-route":routeMode=data.active?.m||data.routeMode||"trail";setView("route");break;
  case "level":launch(m,i);break;
  case "inspect":previewRegion=chosen;render();break;
  case "visit":if(available(chosen))setView("home",{region:chosen});break;
  case "record":bookRegion=chosen;render();break;
  case "equip":if(recruited(bookRegion)){data.companion=bookRegion;persist();render();}break;
  case "buddy":companionSheet();break;
  case "picture":showPicture(i);break;
  case "trace":inspectTrace(b.dataset.secret);break;
  case "secret-memory":secretMemory(b.dataset.secret);break;
  case "secret-replay":inspectTrace(b.dataset.secret,true);break;
  case "secret-book":goToAlbum(window.StarfallDiscoveries.byId(b.dataset.secret));break;
  case "secret-postcard":showPostcard();break;
  case "secret-back":showPostcard(true);break;
  case "guest":guestModal(chosen);break;
  case "guest-answer":{
    if(!available(chosen)) break;
    if(i===guests[chosen].answer){if(!data.visits.includes(chosen))data.visits.push(chosen);persist();sound("success");if(data.view==="book"||data.view==="home")render();guestModal(chosen);}
    else guestModal(chosen,tr("再看一眼现场记录，哪一项能解释刚才看到的现象？","Take another look at the observation. Which choice explains it?"));
    break;
  }
  case "field":if(recruited(chosen))setView("field",{region:chosen});break;
  case "workshop":setView("workshop");break;
  case "beacon-info":infoModal();break;
  case "go-seal":if(sealReady(r))setView("seal");break;
  case "add-seal":{
    const order=data.orders[r]||=[];if(!order.includes(b.dataset.token)&&seals[r][0].split(" ").includes(b.dataset.token)){order.push(b.dataset.token);persist();render();}break;}
  case "unseal":data.orders[r].splice(i,1);persist();render();break;
  case "clear-seal":data.orders[r]=[];persist();render();break;
  case "seal-hint":hintSeal();break;
  case "test-seal":trySeal();break;
  case "next-island":if(chosen<7&&available(chosen+1))setView("home",{region:chosen+1});break;
  case "ending":if(data.beacons.length===8)setView("ending");break;
  case "export":exportFile();break;
  case "import":document.getElementById("save-file")?.click();break;
  case "confirm-import":if(pendingImport){data=pendingImport;pendingImport=null;previewRegion=data.region;bookRegion=data.companion;routeMode=data.active?.m||data.routeMode||"trail";setView(data.view);}break;
  case "dismiss":pendingImport=null;closeSheet();break;
 }
});
sheet.addEventListener("cancel",()=>{stopSecret();sheetKind="";sheetInfo=null;pendingImport=null;delete sheet.dataset.kind;});
if(data.active && data.view==="play")data.region=Math.floor(data.active.i/7);
routeMode=data.active?.m||data.routeMode||"trail";
render();

})();
