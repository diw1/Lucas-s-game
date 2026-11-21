export const bearingMarks = [
  {id:"shell", name:"Shell", mark:"↗ NE · 1", direction:"NE", steps:1},
  {id:"reed", name:"Reed", mark:"↑ N · 2", direction:"N", steps:2},
  {id:"prism", name:"Prism", mark:"→ E · 2", direction:"E", steps:2},
  {id:"mast", name:"Mast", mark:"↙ SW · 2", direction:"SW", steps:2},
  {id:"pearl", name:"Pearl", mark:"↘ SE · 1", direction:"SE", steps:1}
];

function node(tag, cls, text) {
  const el=document.createElement(tag);
  el.className="tv-"+cls;
  if(text!==undefined) el.textContent=text;
  return el;
}

function button(cls, label, click) {
  const el=node("button",cls);
  el.type="button";
  el.setAttribute("aria-label",label);
  el.addEventListener("click",click);
  return el;
}

const gems={
  pearl:{name:"Pearl", paths:'<circle cx="16" cy="17" r="10"/><path d="M10 16q1-6 6-6"/>'},
  fan:{name:"Fan", paths:'<path d="m13 26-10-11q-1-4 3-5 0-4 5-4 2-4 5-2 4-2 6 2 5 0 5 4 4 1 3 5L19 26z"/><path d="m14 22-6-10m8 10V7m2 15 6-10"/>'},
  star:{name:"Star", paths:'<path d="m16 3 3.8 9 9.7 1-7.4 6.5 2.2 9.1-8.3-5-8.3 5 2.2-9.1-7.4-6.5 9.7-1z"/><path d="m16 9 0 6-5 3"/>'},
  drop:{name:"Drop", paths:'<path d="M16 3C14 9 6 15 6 20a10 10 0 0 0 20 0c0-5-8-11-10-17z"/><path d="M11 20q0 4 4 5"/>'}
};
const readings=[
  {gems:["drop","fan","pearl"], exact:2, elsewhere:0},
  {gems:["pearl","star","drop"], exact:0, elsewhere:2},
  {gems:["fan","drop","pearl"], exact:1, elsewhere:1}
];

function gem(id) {
  const piece=node("span","gem");
  piece.dataset.stone=id;
  piece.setAttribute("aria-hidden","true");
  piece.innerHTML='<svg viewBox="0 0 32 32" focusable="false">'+gems[id].paths+'</svg>';
  return piece;
}

function captionedGem(id) {
  const item=node("span","sample-stone");
  item.append(gem(id),node("span","stone-name",gems[id].name));
  return item;
}

function clueBook() {
  const log=node("section","log");
  log.append(node("h3","heading","The kitten’s test strips"));
  const table=node("table","strips");
  const caption=table.createCaption(); caption.className="tv-sr";
  caption.textContent="Previous test strips with their exact and elsewhere counts";
  const head=table.createTHead().insertRow();
  for(const label of ["Stones, left to right","Exact","Elsewhere"]) {
    const th=document.createElement("th"); th.scope="col"; th.textContent=label; head.append(th);
  }
  const body=table.createTBody();
  for(const row of readings) {
    const tr=body.insertRow();
    const lineup=node("div","sample");
    lineup.append(...row.gems.map(captionedGem));
    tr.insertCell().append(lineup);
    for(const [i,n] of [row.exact,row.elsewhere].entries()) {
      const tally=node("span","tally",String(n));
      tally.dataset.kind=i===0?"exact":"elsewhere";
      tr.insertCell().append(tally);
    }
  }
  const expl=node("details","example"), summary=node("summary","example-title","How the kitten scored a strip");
  const pair=node("div","example-pair");
  for(const [label,ids] of [["Pretend lock",["fan","pearl","star"]],["Test strip",["fan","star","drop"]]]) {
    const row=node("div","example-row");
    row.append(node("strong","example-label",label),...ids.map(captionedGem)); pair.append(row);
  }
  expl.append(summary,pair,node("p","example-text","Here Fan is exact. Star belongs in a different place. Drop is absent. The strip earns 1 exact and 1 elsewhere."));
  log.append(table,node("p","strip-key","Exact = right stone in its place. Elsewhere = right stone in a different place."),expl);
  return log;
}

function makeVault(host,saved,onChange) {
  const slots=[null,null,null], previous=Array.isArray(saved?.slots)?saved.slots:[];
  slots.forEach((_,i)=>{
    const id=previous[i];
    if(typeof id==="string" && Object.hasOwn(gems,id) && !slots.includes(id)) slots[i]=id;
  });
  let selected=slots.indexOf(null);
  if(selected<0) selected=0;
  const read=()=>({slots:[...slots]});
  const root=node("div","board"), layout=node("div","vault"), cabinet=node("section","cabinet");
  const seats=node("div","sockets"), rack=node("div","rack"), message=node("p","status");
  seats.setAttribute("role","group"); seats.setAttribute("aria-label","Lock sockets");
  rack.setAttribute("role","group"); rack.setAttribute("aria-label","Choose a stone for the selected socket");
  message.setAttribute("role","status");
  const keys=slots.map((_,i)=>{
    const key=button("socket","",()=>{selected=i; paint(); message.textContent="Choose a stone for socket "+(i+1)+".";});
    key.dataset.socket=String(i+1); seats.append(key); return key;
  });
  for(const id of Object.keys(gems)) {
    const item=button("choice","Place "+gems[id].name,()=>{
      const i=selected,old=slots.indexOf(id);
      if(old!==-1) slots[old]=null;
      slots[i]=id;
      const free=slots.indexOf(null);
      if(free!==-1) selected=free;
      paint();
      message.textContent=gems[id].name+" in socket "+(i+1)+". "+(free===-1?"All three sockets are filled.":"Choose a stone for socket "+(selected+1)+".");
      onChange?.(read());
    });
    item.dataset.gem=id; item.append(gem(id),node("span","choice-title",gems[id].name)); rack.append(item);
  }
  function paint() {
    keys.forEach((key,i)=>{
      const id=slots[i], contents=node("span","socket-inlay");
      if(id) contents.append(gem(id));
      key.setAttribute("aria-pressed",String(i===selected));
      key.setAttribute("aria-label","Socket "+(i+1)+", "+(id?gems[id].name:"empty"));
      key.replaceChildren(node("span","socket-no","Socket "+(i+1)),contents,node("span","socket-word",id?gems[id].name:"Empty"));
    });
  }
  cabinet.append(node("h3","heading","The vault lock"),node("p","tray-guide","Choose a socket, then a stone. Use three different stones."),seats,rack,message);
  layout.append(clueBook(),cabinet); root.append(layout); host.replaceChildren(root); paint();
  return {read,check:()=>slots.every(Boolean) && readings.every(row=>{
    const exact=row.gems.filter((id,i)=>slots[i]===id).length;
    const matches=row.gems.filter(id=>slots.includes(id)).length;
    return exact===row.exact && matches-exact===row.elsewhere;
  })};
}

// Coordinates are chart cells. North is up; the tide acts only at departure.
const columns="ABCDE", start="A5";
const directions={N:[0,-1],NE:[1,-1],E:[1,0],SE:[1,1],S:[0,1],SW:[-1,1],W:[-1,0],NW:[-1,-1]};
const currents=new Set(["D1","B2","D3","B4","C4"]);
const cellCoords=cell=>[columns.indexOf(cell[0]),Number(cell[1])-1];
const seaCell=(x,y)=>columns[x]+String(y+1);
function endpoint(origin,bearing) {
  const [x,y]=cellCoords(origin), [dx,dy]=directions[bearing.direction];
  return seaCell(x+dx*bearing.steps+(currents.has(origin)?1:0),y+dy*bearing.steps);
}

// Coastlines and whale soundings on the printed nautical chart. The tappable
// grid and the course overlay share this square viewBox at every screen size.
const chartArt='<svg class="tv-chart-art" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><defs>'+
  '<pattern id="tv-wave" width="14" height="12" patternUnits="userSpaceOnUse"><path d="M3 6q1.4.9 2.7 0t2.7 0m2.6 4q.7.4 1.4 0" fill="none" stroke="#bfebe0" stroke-width=".3" opacity=".39"/></pattern>'+
  '<g id="tv-isle"><path d="M0 6Q2 2 4 3L7 0l3 3q4 0 6 3-7 3-16 0Z" fill="#95a57b" stroke="#e6d9ac" stroke-width=".65"/><path d="m3.2 5 4-3.4 3.1 3m-2.6-2.4-.4 2.1" fill="none" stroke="#576e65" stroke-width=".55"/></g>'+
  '<g id="tv-whale"><path d="M0 1C2 2 3 3 4 2c1-2 4-3 7-2l2 1 2-2 .4 2-1.5 2-1.4-.5C10 7 3 6 2 3Z" fill="#a3d3d0" stroke="#306e73" stroke-width=".38"/><circle cx="4" cy="3" r=".45" fill="#34777d"/><path d="M4 0q.1-1.9-1-2.1m1 2.1q.2-1.8 1.4-1.7" fill="none" stroke="#d0ede3" stroke-width=".4"/></g></defs>'+
  '<rect width="100" height="100" fill="url(#tv-wave)"/><g fill="none" stroke="#bbd8b2" stroke-width=".36" opacity=".48"><path d="M-3 14q9-7 14-3t11-3M-3 16q10-7 15-3t12-4M79 3q-3 6 5 10t17 0m-23-9q-3 7 4 11t20 0M12 66q8-4 15-1t10-3m-24 6q8-4 14-1t12-4M84 74q10-3 15 2m-15 0q10-3 15 2"/></g>'+
  '<use href="#tv-isle" x="0" y="5"/><use href="#tv-isle" transform="translate(83 6) scale(.9)"/><use href="#tv-isle" transform="translate(20 61) scale(.73)"/><use href="#tv-isle" transform="translate(90 70) scale(.64)"/>'+
  '<use href="#tv-whale" transform="translate(24 24) scale(.58)"/><use href="#tv-whale" transform="translate(63 46) scale(.7)"/><use href="#tv-whale" transform="translate(83 88) scale(.78)"/><use href="#tv-whale" transform="translate(87 92.5) scale(.48)"/></svg>';

function makeVoyage(host,saved,onChange) {
  const stops=[];
  if(Array.isArray(saved?.stops)) {
    for(const cell of saved.stops.slice(0,bearingMarks.length)) {
      if(typeof cell!=="string" || !/^[A-E][1-5]$/.test(cell)) break;
      stops.push(cell);
    }
  }
  const read=()=>({stops:[...stops]});
  const root=node("section","board"), layout=node("div","voyage");
  const help=node("div","sailing-notes"), heading=node("h3","heading","Pilot’s orders");
  const rules=node("p","rules","Sail each journal bearing from your last stop. If you start on a current, slide one extra square east after sailing. Currents you pass or land on wait until the next leg.");
  help.append(heading,rules);
  const panel=node("div","chart-panel"), top=node("div","chart-cap");
  top.append(node("h3","chart-title","Calf Passage"),node("span","north","↑ North"));
  const map=node("div","sea");
  map.innerHTML=chartArt+'<svg class="tv-course" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><polyline class="tv-course-shadow"/><polyline class="tv-course-ink"/></svg>';
  const strokes=map.querySelectorAll("polyline");
  const grid=node("div","grid");
  grid.setAttribute("role","group"); grid.setAttribute("aria-label","Chart squares. North is up. Use arrow keys to move and Enter to plot.");
  const legend=node("div","chart-key");
  legend.append(node("span","legend-start","⚑  A5 · Start"),node("span","legend-current","⇉  East current"),node("span","legend-scale","1 step = 1 square"));
  const dock=node("div","logbook"), steps=node("ol","legs"), status=node("p","leg-status");
  status.setAttribute("role","status");
  const fields=bearingMarks.map(mark=>{
    const leg=node("li","leg");
    const value=node("b","leg-coordinate","—"); leg.append(node("span","leg-name",mark.name),value); steps.append(leg); return {leg,value};
  });
  const undo=button("undo","Undo last stop",()=>{
    if(!stops.length) return;
    stops.pop();
    const last=stops.at(-1)||start; moveTab(last,false);
    draw(); onChange?.(read());
  }); undo.textContent="↶  Undo stop";
  const footer=node("div","chart-actions"); footer.append(status,undo);
  const cells=new Map();
  const moveTab=(cell,focus)=>{
    for(const [name,el] of cells) el.tabIndex=name===cell?0:-1;
    if(focus) cells.get(cell).focus();
  };
  for(let y=0;y<5;y++) for(let x=0;x<5;x++) {
    const cell=seaCell(x,y),current=currents.has(cell);
    const el=button("cell",cell,()=>{
      if(stops.length===bearingMarks.length) return;
      stops.push(cell); moveTab(cell,false); draw(); onChange?.(read());
    });
    el.dataset.seaCell=cell;
    const coord=node("span","coordinate",cell); coord.setAttribute("aria-hidden","true"); el.append(coord);
    if(current || cell===start) {
      const mark=node("span",current?"flow":"flag",current?"⇉":"⚑");
      mark.setAttribute("aria-hidden","true"); el.append(mark);
    }
    const pin=node("span","pin"); pin.setAttribute("aria-hidden","true"); el.append(pin);
    el.addEventListener("keydown",ev=>{
      const offsets={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
      const d=offsets[ev.key];
      if(!d)return;
      ev.preventDefault();
      const nx=Math.max(0,Math.min(4,x+d[0])),ny=Math.max(0,Math.min(4,y+d[1]));
      moveTab(seaCell(nx,ny),true);
    });
    cells.set(cell,el); grid.append(el);
  }
  function draw() {
    const path=[start,...stops];
    const track=[cellCoords(start)];
    stops.forEach((cell,i)=>{
      const [x,y]=cellCoords(cell);
      if(currents.has(path[i]) && x>0) track.push([x-1,y]);
      track.push([x,y]);
    });
    const points=track.map(coords=>coords.map(n=>n*20+10).join(",")).join(" ");
    for(const line of strokes) line.setAttribute("points",points);
    for(const [cell,el] of cells) {
      const legs=stops.flatMap((v,i)=>v===cell?[i+1]:[]);
      const latest=legs.at(-1);
      const pin=el.querySelector(".tv-pin"); pin.textContent=latest||""; pin.hidden=!latest;
      el.classList.toggle("tv-plotted",!!latest);
      el.classList.toggle("tv-last",path.at(-1)===cell);
      el.setAttribute("aria-label",[cell,cell===start?"starting flag":"",currents.has(cell)?"east current":"calm water",legs.length?"charted stops "+legs.join(" and "):""].filter(Boolean).join(", "));
    }
    fields.forEach(({leg,value},i)=>{
      value.textContent=stops[i]||"—";
      leg.classList.toggle("tv-next",i===stops.length);
      if(i===stops.length)leg.setAttribute("aria-current","step"); else leg.removeAttribute("aria-current");
    });
    const index=stops.length, from=path.at(-1);
    status.textContent=index===bearingMarks.length?"Five stops plotted. Check your course.":"From "+from+", plot the "+bearingMarks[index].name+" bearing.";
    undo.disabled=!stops.length;
  }
  moveTab(stops.at(-1)||start,false);
  map.append(grid); panel.append(top,map,legend); dock.append(steps,footer); layout.append(help,panel,dock); root.append(layout);
  host.replaceChildren(root); draw();
  return {read,check:()=>stops.length===bearingMarks.length && stops.every((cell,i)=>cell===endpoint(i===0?start:stops[i-1],bearingMarks[i]))};
}

export const voyageRooms=[
  {
    id:"pearlvault",title:"The Pearl Vault",place:"The Kitten’s Garden",art:"cat",boardTitle:"The three-stone lock",
    brief:"Under the garden stones, the kitten finds a little vault lined with oyster silk. Its lid holds three sockets and a notebook of tries from the last navigator.",
    clue:"Read the three test strips together. The marks count how many stones fit exactly and how many belong elsewhere. Each count describes the whole strip.",
    hints:[
      "Look at the first and third strips. They use the same stones. Only the first two swap places. Pearl stays at the right both times.",
      "Pearl must be on the right. If Pearl were absent, Drop and Fan would both fit on strip one, and swapping them would leave strip three with no exact match.",
      "If Drop were first, Star would have to be in the middle. That would give strip two an exact match, but it has none. Set Star, Fan, Pearl."
    ],
    reward:{symbol:"pearl",name:"Pearl Bearing"},
    reply:"The oyster silk unfolds. The kitten lifts a milky compass bead. Under its glass, a needle points out to the open sea.",
    miss:"Check each strip against your lock, from left to right. An exact match counts only once. It cannot also count as elsewhere.",
    journalNote:"The Pearl Bearing points southeast for one square.",create:makeVault
  },
  {
    id:"whaleroute",title:"Where the Whales Sing",place:"Calf Passage",art:"reef",boardTitle:"The whale chart",
    brief:"A small whale waits by the harbor flag. From beyond the coral, a deep call crosses the water. The kitten lays five bearings on the deck to plot the calf’s way home.",
    clue:"Start at A5. Plot one stop for each bearing in journal order. Count diagonal steps corner to corner. Water marked ⇉ adds one square east when you leave it.",
    hints:[
      "The Shell Bearing points northeast one. From A5 that is B4. B4 has a current, so the next leg will slide east after you count its steps.",
      "From B4 sail two north to B2, then drift east to C2. Prism sends you two east to E2. An arrow you pass does nothing.",
      "From E2 go two southwest to C4. Leave its current by sailing one southeast to D5, then sliding east to E5. Your five stops are B4, C2, E2, C4, E5."
    ],
    reward:{symbol:"atlas",name:"The Tideglass Atlas"},
    reply:"A broad gray back breaks the water beside the calf. Two tails rise together, then slip into the blue. The kitten closes the atlas with a drop of sea still shining on its cover.",
    miss:"Trace each leg from the stop before it. Apply the one-square east drift only when you leave a current. Undo a stop to retrace your course.",
    journalNote:"The calf found its family in the eastern water. All five bearings are bound into the Tideglass Atlas.",create:makeVoyage
  }
];
