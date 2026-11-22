const svg=(content,box="0 0 48 48")=>'<svg viewBox="'+box+'" aria-hidden="true" focusable="false">'+content+'</svg>';
const rotateIcon=svg('<path d="M11 23a13 13 0 1 1 5 12m-5-20v9h10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');
const undoIcon=svg('<path d="m18 11-10 10 10 9M9 21h16q12 0 13 12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');
const lighthouse='<g stroke="#705f4c" stroke-linejoin="round" stroke-width="1.4"><path d="M8 40q10-5 28-2l6 5H5Z" fill="#a39973"/><path d="m16 38 3-23h11l3 23Z" fill="#f8dfaf"/><path d="m18 24 13-3 .7 5-14.3 4Z" fill="#b96854" stroke="none"/><path d="M17 15h15v4H17Z" fill="#725f52"/><path d="M19 8h11v7H19Z" fill="#f1c87b"/><path d="m16 8 8-6 9 6Z" fill="#b66853"/><path d="M23 38v-5q2-4 4 0v5" fill="#685e50"/></g>';
const anchor='<g fill="none" stroke-linejoin="round" stroke-linecap="round"><path d="M24 13v24m-9-17h18M6 29q3 13 18 13 15 0 18-13m-35 0 1 8m0-8 8 3m26-3-2 8m1-8-7 3" stroke="#806e50" stroke-width="5"/><path d="M24 13v24m-9-17h18M7 29q3 12 17 12 15 0 17-12m-34 0 2 7m-2-7 8 3m26-3-2 7m2-7-7 3" stroke="#d8b66e" stroke-width="2.8"/><circle cx="24" cy="9" r="5" fill="#63908b" stroke="#806e50" stroke-width="4"/><circle cx="24" cy="9" r="5" stroke="#e1bd7d" stroke-width="1.8"/></g>';
const quadrantNames=["Top left","Top right","Bottom left","Bottom right"],codes=["nw","ne","sw","se"];
const initialTurns=[1,3,2,1], directions=["north","east","south","west"];
const coastlines=[
  [[-20,-20],[153,-20],[143,0],[158,24],[143,39],[127,47],[139,57],[128,66],[111,60],[96,68],[84,76],[91,83],[113,86],[128,99],[121,111],[108,120],[91,125],[75,114],[70,102],[61,94],[45,90],[32,93],[23,104],[21,120],[-4,136],[-20,138]],
  [[210,36],[187,44],[179,58],[181,72],[170,85],[162,92],[160,102],[167,113],[169,126],[157,134],[143,131],[128,140],[126,152],[110,162],[98,160],[87,152],[73,157],[63,171],[57,182],[43,190],[36,205],[37,220],[220,220],[220,36]]
];
const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
function coast(points) {
  let a=mid(points.at(-1),points[0]), d="M"+a.join(" ");
  const sample=[];
  points.forEach((p,i)=>{
    const b=mid(p,points[(i+1)%points.length]);d+=" Q"+p.join(" ")+" "+b.join(" ");
    for(let n=1;n<=8;n++){
      const t=n/8,u=1-t;sample.push([u*u*a[0]+2*u*t*p[0]+t*t*b[0],u*u*a[1]+2*u*t*p[1]+t*t*b[1]]);
    }
    a=b;
  });
  return {d:d+"Z",sample};
}
const land=coastlines.map(coast);
function inside([x,y],polygon) {
  let hit=false;
  for(let a=polygon.at(-1),i=0;i<polygon.length;i++){
    const b=polygon[i];
    if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;
    a=b;
  }
  return hit;
}
// Each tile samples its visible shoreline clockwise, so adjoining edges read in reverse.
const edges=codes.map((_,i)=>directions.map((__,s)=>Array.from({length:18},(_,n)=>{
  const p=(n+.5)*100/18,[x,y]=[[p,0],[100,p],[100-p,100],[0,100-p]][s];
  return land.some(l=>inside([x+i%2*100,y+Math.floor(i/2)*100],l.sample))?"L":"W";
}).join("")));
const seams=[[0,1,1,3],[2,1,3,3],[0,2,2,0],[1,2,3,0]];
function shoreJoins(turns) {
  const at=(q,s)=>edges[q][(s-turns[q]+4)%4];
  return seams.map(([a,s,b,t])=>at(a,s)===[...at(b,t)].reverse().join(""));
}
function paintMap() {
  const tree=(x,y,k)=>'<g transform="translate('+x+' '+y+') scale('+k+')"><path d="M0 0v9" stroke="#726f4e" stroke-width="1.1"/><path d="m0-7-4 6 2-.3L-5 4Q0 6 5 4L2-.9l2 .3Z" fill="#6e8b66" stroke="#53765d" stroke-width=".65"/><path d="M0-5-2 0m2 0-2 3" stroke="#aec197" stroke-width=".7" fill="none"/></g>';
  const trees=[[12,24,1],[19,25,.72],[25,18,.75],[9,31,.7],[17,34,.78],[65,45,.68],[71,42,.8],[76,45,.65],[77,48,.6],
    [45,62,.8],[51,66,.85],[42,68,.65],[57,65,.53],[119,21,.65],[125,18,.84],[130,21,.65],[122,25,.62],[105,96,.6],[111,99,.55],
    [160,150,.8],[167,153,1],[172,147,.75],[178,152,.7],[159,157,.7],[73,182,.75],[80,185,.66],[85,179,.95],[92,181,.72]];
  const waves=[[162,14],[175,30],[154,57],[151,72],[137,85],[146,116],[123,128],[118,142],[103,145],[83,135],[68,147],[51,123],[39,137],[21,154],[12,176],[31,174],[53,159],[181,9],[7,190]];
  const ranges='<g fill="#a8a183" stroke="#83856c" stroke-width=".75" stroke-linejoin="round"><path d="m70 18 7-10 7 10m-2 1 8-13 9 14m-3 1 5-7 4 7m72 155 10-15 11 15m-24 3 5-11 8 11"/><path d="m74 13 3-5 3 5-2-1-1 2-1-2Zm12 0 4-7 4 7-3-2-1 2-1-2Zm98 154 3-6 4 6-3-1-1 1-1-2Z" fill="#e8dfbc" stroke="none"/></g>';
  return '<rect x="-2" y="-2" width="204" height="204" fill="#80b7b2"/>'+
    '<g fill="none" stroke="#aad0c0" stroke-width=".8" opacity=".7"><path d="M-5 157q27-4 41-19t31-13m8 8q29 11 53-11t22-46m-23 50q19-9 25-29m21-70q-14 18-16 31m-141 122q22-12 35-17"/></g>'+
    land.map(({d})=>'<path d="'+d+'" fill="#c3c398" stroke="#6ca8a2" stroke-width="8"/><path d="'+d+'" fill="#c2c498" stroke="#c7dfc4" stroke-width="4"/><path d="'+d+'" fill="#c5c69a" stroke="#a8946a" stroke-width="1"/><path d="'+d+'" fill="none" stroke="#edd7a3" stroke-width="2.3"/>').join('')+
    '<g fill="none" stroke="#a7ad80" stroke-width="1" opacity=".9"><path d="M-4 56q20-13 37-2t32 2q11-6 24-22t22-4m-108 79q8-23 28-27t49 4m13-70q25-8 45 5m-40 83q10 11 22 0m36 57q14-13 23-9t26-7m-46 28q18-11 33-8m-111 44q20-13 36-12"/></g>'+
    ranges+trees.map(t=>tree(...t)).join('')+
    waves.map(([x,y])=>'<path d="m'+x+' '+y+'q2 1.6 4 0t4 0m-6 2q2 1 4 0" fill="none" stroke="#568f92" stroke-width=".65" stroke-linecap="round"/>').join('')+
    '<g stroke="#7d775c" stroke-width=".7"><path d="M32 83q6-19 22-29t30-17m-30 18 1-17" fill="none" stroke-dasharray="1.4 1.6"/><path d="m52 40 4-3 4 4-1 3-7-1Z" fill="#d9c799"/><path d="m51 40 5-5 5 5" fill="#b97e60"/></g>'+
    '<g transform="translate(140 106) rotate(12)"><path d="m-6 2 13-1-3 3-7 .5Z" fill="#a47e5c" stroke="#696c59" stroke-width=".6"/><path d="M0 1v-8l-5 8Zm1-7 4 6-4 .4Z" fill="#efe0af" stroke="#8f8d70" stroke-width=".55"/></g>'+
    '<g transform="translate(43 1) scale(.49)">'+lighthouse+'</g><g transform="translate(140 178) scale(.43)">'+anchor+'</g>'+
    '<g fill="#907d56" opacity=".4">'+[[3,76],[37,31],[67,24],[37,44],[179,137],[133,185],[119,180],[64,76],[85,41]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r=".6"/>').join('')+'</g>';
}
let chartInstance=0;
function chart(host,saved,onChange) {
  const turns=Array.isArray(saved?.turns)&&saved.turns.length===4&&saved.turns.every(v=>Number.isInteger(v)&&v>=0&&v<4)?[...saved.turns]:[...initialTurns];
  const angles=[...turns],id="ts-coast-"+(++chartInstance),read=()=>({turns:[...turns]});
  const check=()=>turns[0]===0&&turns[3]===0&&shoreJoins(turns).every(Boolean);
  host.innerHTML='<section class="ts-board ts-chart" aria-label="Four pieces of a sea map">'+
    '<svg class="ts-definitions" aria-hidden="true" focusable="false"><defs><g id="'+id+'">'+paintMap()+'</g></defs></svg>'+
    '<div class="ts-map-case"><div class="ts-frame-label ts-north">'+svg(lighthouse)+'<span>Lighthouse</span></div>'+
    '<div class="ts-map" role="group" aria-label="Tap a piece to turn it">'+codes.map((code,i)=>
      '<button type="button" data-chart="'+code+'" class="ts-quarter">'+
        '<svg class="ts-quarter-picture" viewBox="'+(i%2*100)+' '+(Math.floor(i/2)*100)+' 100 100" aria-hidden="true" focusable="false"><use href="#'+id+'"/></svg>'+
        '<span class="ts-quarter-tag">'+quadrantNames[i]+'</span><span class="ts-turn">'+rotateIcon+'</span></button>').join('')+'</div>'+
    '<div class="ts-frame-label ts-south">'+svg(anchor)+'<span>Anchor</span></div></div>'+
    '<div class="ts-example">'+svg('<path d="M3 7h42v34H3Z" fill="#7cafaa" stroke="#8d7c53"/><path d="M3 7h42v8Q32 13 23 26 14 35 3 29Z" fill="#b8bf8c" stroke="#f1dbae" stroke-width="2"/><path d="M24 7v34" stroke="#766d55" stroke-width="1.5"/>')+'<span>Join sand to sand like this.</span></div>'+
    '<div class="ts-readout" aria-label="Chart progress"><span data-shores></span><span data-marks></span></div>'+
    '<p class="ts-status" role="status" aria-live="polite"></p></section>';
  const root=host.firstElementChild,tiles=[...root.querySelectorAll("[data-chart]")],live=root.querySelector(".ts-status");
  function render() {
    const joined=shoreJoins(turns);
    tiles.forEach((b,i)=>{
      const turn=turns[i],dist=i===0?directions[turn]:i===3?directions[(2+turn)%4]:null;
      b.querySelector(".ts-quarter-picture").style.transform="rotate("+(angles[i]*90)+"deg)";
      const details=seams.flatMap(([a,s,b,t],n)=>a===i||b===i?[directions[a===i?s:t]+" edge "+(joined[n]?"joined":"apart")]:[]);
      b.setAttribute("aria-label",quadrantNames[i]+" map piece. Tap to turn. "+details.join(", ")+". "+(dist?"The "+(i===0?"lighthouse":"anchor")+" is at its "+dist+" edge.":""));
    });
    const joints=joined.filter(Boolean).length,marks=Number(turns[0]===0)+Number(turns[3]===0);
    root.querySelector("[data-shores]").textContent=joints+" / 4 shores joined";root.querySelector("[data-marks]").textContent=marks+" / 2 pictures match";
    root.classList.toggle("ts-restored",check());return joints+" of four shores join. "+marks+" of two pictures match.";
  }
  tiles.forEach((b,i)=>b.addEventListener("click",()=>{
    turns[i]=(turns[i]+1)%4;angles[i]++;const status=render();
    live.textContent=check()?"The map fits! Try the lock.":quadrantNames[i]+" turned. "+status;onChange?.(read());
  }));
  render();live.textContent=check()?"The map fits! Try the lock.":"Tap a piece. It turns one step to the right.";
  function guide(){
    const i=turns.findIndex(v=>v!==0);
    return i<0?null:{target:tiles[i],text:"Tap the "+quadrantNames[i].toLowerCase()+" piece once."};
  }
  return {read,check,guide};
}

const friends={
  pup:{name:"Pup",bit:1,art:
    '<g stroke="#6e5845" stroke-width="1.35" stroke-linejoin="round"><path d="M11 29c-3-8 0-17 9-19 10-4 20 2 21 12 2 10-4 17-17 17-7 0-11-3-13-10Z" fill="#d5af75"/>'+
    '<path d="M14 13C8 8 5 12 5 19l1 13q1 6 7 2l6-15Z" fill="#977457"/><path d="M31 11q7-6 10 0l2 14q-1 4-5 3l-8-10Z" fill="#9b7655"/>'+
    '<path d="M22 30q5-6 12-2l2 4q-1 7-10 6-6-1-4-8Z" fill="#edd8a5" stroke="none"/><path d="M26 29q3-2 6 0-1 4-4 3Z" fill="#574d42"/>'+
    '<ellipse cx="21" cy="23" rx="1.5" ry="2" fill="#403e34"/><ellipse cx="34" cy="22" rx="1.5" ry="2" fill="#403e34"/><path d="m28 32-1 2-3 1m4-2 3 1" fill="none"/><path d="m15 37 7 5 12-3-4-3Z" fill="#ae6a50"/></g>'},
  duck:{name:"Duckling",bit:2,art:
    '<g stroke="#8d7850" stroke-width="1.3" stroke-linejoin="round"><path d="m17 37-3 5 7-1m7-4 1 5 6-1" fill="none" stroke="#b08755" stroke-width="2"/>'+
    '<path d="M8 24q6 4 11 1c-2-5-1-12 5-15q7-4 12 1 4 4 2 10l-1 4q3 7-3 12c-8 6-20 3-25-2-2-3-3-7-3-10Z" fill="#e4be63"/>'+
    '<path d="M22 14q5-7 11-3" fill="none" stroke="#f8df98" stroke-width="2.6"/><path d="m37 18 7 3-6 3-4-2Z" fill="#cb8958"/><circle cx="32" cy="17" r="1.6" fill="#493f31"/>'+
    '<path d="M13 29q6 1 14-2-3 8-10 9" fill="#d5aa52" stroke="#bc934c"/><path d="m13 30 5 1" fill="none" stroke="#f2d68b"/></g>'},
  peas:{name:"Sweet peas",bit:4,art:
    '<g stroke-linejoin="round" stroke-linecap="round"><path d="M6 32q11-16 28-15l6-4q0 13-15 21-12 8-20 2Z" fill="#8fa66c" stroke="#576e4f" stroke-width="1.5"/>'+
    '<path d="M6 34q8-12 24-14l7-3q-2 8-17 15-8 5-14 2Z" fill="#d1d799" stroke="#788e5f"/><g fill="#8faf6d" stroke="#668859" stroke-width="1"><circle cx="14" cy="31" r="3.4"/><circle cx="21.4" cy="27.8" r="3.8"/><circle cx="29" cy="23.6" r="3.3"/></g>'+
    '<path d="M30 24q6-5 7-11-1-7 3-7 4 1 1 4" fill="none" stroke="#697d52" stroke-width="1.6"/><path d="M36 15q-7-4-7-9 7 1 7 9Z" fill="#a5ae76" stroke="#70815b"/></g>'}
};
const friendIds=Object.keys(friends);
const captain='<g stroke="#5d6057" stroke-width="1.2" stroke-linejoin="round"><path d="M13 37q2-10 12-10 10 0 11 12" fill="#71988e"/><path d="M12 23 11 9l8 5q5-2 10 0l8-6-1 14q1 9-10 11-11 2-14-10Z" fill="#b8b7a4"/><path d="m13 12 1 7 4-3m13 1 4-6-1 8" fill="#d8aa96" stroke="none"/><path d="M20 14l1 5 3-5 2 5 3-5" fill="#7e8176" stroke="none"/><circle cx="18.7" cy="22.4" r="1.3" fill="#353f38"/><circle cx="29.5" cy="21.8" r="1.3" fill="#353f38"/><path d="m22 25 4-.5-2 2Z" fill="#a77d70"/><path d="m23.7 27-2 1 4 .2m-10-4-6-1m7 3-6 2m21-4 7-2m-6 5 6 1" fill="none" stroke-width=".8"/><path d="M16 31q9 4 18-1l-3 5-8 1-4 5-3-2 2-5Z" fill="#c98858"/></g>';
const boatShape='<path d="M6 31q6-4 17-6 17-4 38-1l11 3q-2 11-27 14-27 4-37-2Z" fill="#aa805c" stroke="#695540" stroke-width="1.6"/><path d="M7 30q7-5 23-7t40 2q-10 10-29 11-23 2-34-6Z" fill="#6c624a" stroke="#e0b980" stroke-width="2"/>';
function riverBackdrop() {
  return '<svg class="ts-river-art" viewBox="0 0 560 244" preserveAspectRatio="none" aria-hidden="true">'+
    '<path d="M0 0h171q47 23 16 62t-1 59q20 28-6 54t-13 69H0ZM560 0H386q-37 28-13 55t-5 71q-21 32 6 60t14 58h172Z" fill="#a2af85" stroke="#ebd4a1" stroke-width="7"/>'+
    '<g fill="none" stroke="#a0c5b3" stroke-width="1.4" stroke-linecap="round"><path d="M231 24q14 4 27 0t24-1m9-1 10 .2m-35 10 18-.8m39 21q12-4 23 0m-132 55q13 4 29 0t26 1m-22 6 17-.5m33 75q14-6 27-1t19-1m-62 40q19 4 30-1m-68-71q9 5 26 0"/></g>'+
    '<g stroke="#778767" fill="none" stroke-width="1.6" opacity=".8"><path d="M4 30q26-9 55-4m18 181q34-10 57-2m266 8q18-9 34-6m9-186q30-9 70-1M8 179q24-9 55-7"/></g>'+
    '<g fill="#718c70" stroke="#54745f" stroke-width=".8"><path d="M179 21q-14-11-21-10 9 9 21 10Zm-2 0q-2-12-9-15 2 8 9 15Zm-7 200q-10-9-17-11 4 9 17 11Zm207-62q9-15 17-15-6 10-17 15Zm2 0 4-16q-6 6-4 16Z"/></g>'+
    '<g fill="#d7be96" stroke="#988f72"><path d="m180 85 5-5 9 1 3 5-4 3-11 1Zm179 66 5-3 4 2-2 3h-8Zm26-122 4-5 8 2 1 4-8 2Z"/></g>'+
    '<g fill="none" stroke="#9a9c74" stroke-width="1"><path d="M3 48q8-13 17-18m-6 8 8-1m-11 5 2-6m534 162q-14-8-23-5m12 1 1-5m-6 5-3 4"/></g></svg>';
}
const seatIsKnown=id=>id===null||(typeof id==="string"&&Object.hasOwn(friends,id));
function crossing(state,passenger) {
  if(!seatIsKnown(passenger))return {reason:"Pick someone on this side."};
  const bit=passenger===null?0:friends[passenger].bit;
  if(bit&&Number(Boolean(state.mask&bit))!==state.bank)return {reason:"That one is across the river."};
  const mask=state.mask^bit, unattended=state.bank===0?7^mask:mask;
  if((unattended&3)===3)return {reason:"Pup would chase Duckling here. Pick someone else."};
  if((unattended&6)===6)return {reason:"Duckling would eat the peas here. Pick someone else."};
  return {mask,bank:1-state.bank};
}
function nextPassenger(state) {
  // At most sixteen combinations of river bank and cargo positions exist.
  const queue=[{state}],visited=new Set([state.mask*2+state.bank]);
  for(let i=0;i<queue.length;i++) {
    const step=queue[i];
    for(const passenger of [...friendIds,null]) {
      const next=crossing(step.state,passenger);
      if(next.reason)continue;
      const first=i===0?passenger:step.first;
      if(next.mask===7&&next.bank===1)return first;
      const key=next.mask*2+next.bank;
      if(visited.has(key))continue;
      visited.add(key);queue.push({state:next,first});
    }
  }
  return undefined;
}
function ferry(host,saved,onChange) {
  let state={mask:0,bank:0},history=[],seat=null;
  const snapshots=[state];
  if(Array.isArray(saved?.voyages)){
    for(const passenger of saved.voyages) {
      if(state.mask===7&&state.bank===1)break;
      const next=crossing(state,passenger);if(next.reason)break;
      state=next;history.push(passenger);snapshots.push(state);
    }
  }
  if(saved?.seat&&seatIsKnown(saved.seat)&&Number(Boolean(state.mask&friends[saved.seat].bit))===state.bank&&state.mask!==7)seat=saved.seat;
  const read=()=>({voyages:[...history],seat}),check=()=>state.mask===7&&state.bank===1;
  host.innerHTML='<section class="ts-board ts-ferry" aria-label="The picnic rowboat">'+
    '<div class="ts-ferry-rules"><p><b>Keep the kitten with these pairs</b></p>'+
    '<div class="ts-pairs"><span>'+svg(friends.pup.art)+' + '+svg(friends.duck.art)+'<em>Pup chases Duckling.</em></span><span>'+svg(friends.duck.art)+' + '+svg(friends.peas.art)+'<em>Duckling eats peas.</em></span></div></div>'+
    '<div class="ts-river-case"><div class="ts-banks"><span>Picnic side</span><span>Ferry house</span></div>'+
    '<div class="ts-river">'+riverBackdrop()+'<div class="ts-deck">'+friendIds.map((id,n)=>
      '<button type="button" class="ts-passenger" data-passenger="'+id+'" style="grid-row:'+(n+1)+'">'+svg(friends[id].art)+'<strong>'+friends[id].name+'</strong></button>').join('')+
    '<div class="ts-ferry-boat" aria-hidden="true"><svg viewBox="0 0 79 48" focusable="false">'+boatShape+
    '<g transform="translate(10 0) scale(.62)">'+captain+'</g><g class="ts-cargo-art" transform="translate(35 0) scale(.61)"></g>'+
    '<path d="M7 31q30 12 63-5-12 13-38 13-15-1-25-8Z" fill="#b58659" stroke="#78604a" stroke-width="1"/><path d="M8 31q26 9 55-2" fill="none" stroke="#efce92" stroke-width="1.6"/><path d="m25 27 22 13 5 1-1 2-5-1-23-13Z" fill="#d0b175" stroke="#816b51" stroke-width=".6"/></svg></div></div></div>'+
    '<div class="ts-boat-label"><span data-bank-label></span><span data-voyages></span></div></div>'+
    '<div class="ts-ferry-controls"><div class="ts-seat-caption" aria-live="off"></div><div class="ts-sail-controls"><button type="button" class="ts-undo" data-undo-voyage>'+undoIcon+'Undo</button><button type="button" class="ts-row" data-sail></button></div></div>'+
    '<p class="ts-status" role="status" aria-live="polite"></p></section>';
  const root=host.firstElementChild,live=root.querySelector(".ts-status"),passengers=[...root.querySelectorAll("[data-passenger]")];
  const art=root.querySelector(".ts-cargo-art"),back=root.querySelector("[data-undo-voyage]"),row=root.querySelector("[data-sail]");
  const bankNames=["picnic side","ferry house"];
  function render() {
    root.dataset.bank=String(state.bank);
    passengers.forEach(b=>{
      const id=b.dataset.passenger,side=Number(Boolean(state.mask&friends[id].bit)),near=side===state.bank&&!check();
      b.style.gridColumn=side?"3":"1";b.classList.toggle("ts-away",!near);b.setAttribute("aria-disabled",String(!near));b.setAttribute("aria-pressed",String(id===seat));
      b.setAttribute("aria-label",friends[id].name+", "+bankNames[side]+(id===seat?", in the boat":near?", tap to take along":", across the water"));
    });
    art.innerHTML=seat?friends[seat].art:"";back.disabled=!history.length;row.disabled=check();
    root.querySelector("[data-bank-label]").textContent="Boat at "+bankNames[state.bank];
    root.querySelector("[data-voyages]").textContent=history.length+(history.length===1?" trip":" trips");
    root.querySelector(".ts-seat-caption").textContent=check()?"All across!":seat?friends[seat].name+" is in the boat.":"One empty seat";
    row.textContent=check()?"Arrived":seat?"Row with "+friends[seat].name:"Row alone";
    row.setAttribute("aria-label",row.textContent+(check()?"":" to the "+bankNames[1-state.bank]));
  }
  passengers.forEach(b=>b.addEventListener("click",()=>{
    const id=b.dataset.passenger;
    if(check()){live.textContent="All three are across! Try the lock.";return;}
    if(Number(Boolean(state.mask&friends[id].bit))!==state.bank){live.textContent=friends[id].name+" is across the river. Pick someone by the boat.";return;}
    seat=seat===id?null:id;render();live.textContent=seat?friends[id].name+" is in the boat. Tap again to take them out.":"The seat is empty.";onChange?.(read());
  }));
  row.addEventListener("click",()=>{
    if(check())return;
    const next=crossing(state,seat);
    if(next.reason){live.textContent=next.reason;return;}
    const traveler=seat?friends[seat].name+" and the kitten":"The kitten";
    history.push(seat);state=next;snapshots.push(state);seat=null;render();onChange?.(read());
    live.textContent=check()?"All three are across! Try the lock.":traveler+" reached the "+bankNames[state.bank]+".";
  });
  back.addEventListener("click",()=>{
    if(!history.length)return;
    history.pop();snapshots.pop();state=snapshots.at(-1);seat=null;render();live.textContent="Back one trip. The boat is at the "+bankNames[state.bank]+".";onChange?.(read());
  });
  render();live.textContent=check()?"All three are across! Try the lock.":seat?friends[seat].name+" is in the boat. Tap Row.":"Tap someone by the boat. Then tap Row. You can also row alone.";
  function guide() {
    if(check())return null;
    const next=nextPassenger(state);
    if(next===undefined)return null;
    if(next===seat)return {target:row,text:seat?"Tap Row with "+friends[seat].name+".":"Tap Row alone."};
    const id=next===null?seat:next;
    return {target:passengers.find(b=>b.dataset.passenger===id),text:next===null?"Tap "+friends[seat].name+" to empty the seat.":"Tap "+friends[next].name+" to put them in the boat."};
  }
  return {read,check,guide};
}

export const shoreRooms=[
  {id:"chartroom",title:"The Torn Sea Chart",place:"Treehouse Chartroom",art:"hollow",boardTitle:"Turn the map",
    brief:"Help the little whale get home. Fix its sea map to find the first bearing.",
    clue:"Match the lighthouse to the top picture. Match the anchor to the bottom picture. Join the sandy lines.",
    hints:["Look at the top left piece. Its little lighthouse goes at the top.","The anchor goes at the bottom. The sandy lines should meet at each edge.","From Reset, tap top left 3 times, top right once, bottom left twice, then bottom right 3 times."],
    miss:"Find a break in a sandy line. Turn a piece beside it. Check both pictures too.",reward:{symbol:"shell",name:"Shell Bearing"},
    reply:"The coast fits! A shell pops out of the frame. It is the whale’s first bearing.",journalNote:"Found in the treehouse map.",create:chart},
  {id:"ferrycross",title:"The Picnic Rowboat",place:"Orchard Ferry",art:"picnic",boardTitle:"Cross the river",
    brief:"Pup, Duckling, and the peas need a ride. Take all three to the ferry house.",
    clue:"The kitten can take one friend or the peas. It can also row alone. Pup and the peas can wait together.",
    hints:["Pup and the peas can wait together. Duckling needs the kitten beside Pup or the peas.","From Reset, take Duckling across. Row back alone. Take Pup across. Bring Duckling back.","From Reset, row seven times. Take Duckling, nobody, Pup, Duckling, peas, nobody, Duckling."],
    miss:"Get all three to the ferry house on the right. The kitten can row back.",reward:{symbol:"reed",name:"Reed Bearing"},
    reply:"Pup runs up the dock. Duckling follows. The ferryman gives you the Reed Bearing.",journalNote:"A gift for bringing the picnic across.",create:ferry}
];
