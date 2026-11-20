const glyphs = {
  tap: '<ellipse cx="13" cy="24" rx="7" ry="4.5" transform="rotate(-20 13 24)" fill="currentColor"/><path d="M19 23V5"/>',
  hold: '<ellipse cx="13" cy="24" rx="7" ry="4.5" transform="rotate(-20 13 24)"/><path d="M19 23V5"/>',
  rest: '<path d="m12 4 8 7-7 6 6 6q-8-2-7 6l-4-4q-2-6 5-6l-6-5 7-6z" fill="currentColor" stroke="none"/>',
  cup: '<path d="M8 5h16l-2 10q-2 5-6 5t-6-5z" fill="#f3c76b"/><path d="M8 8H4q0 8 7 8m13-8h4q0 8-7 8m-5 4v5m-5 2h10"/><path d="m16 7 .8 2 2.2.2-1.7 1.4.5 2.2-1.8-1.2-1.8 1.2.5-2.2L13 9.4l2.2-.2z" fill="#855b34" stroke="none"/>',
  flag: '<path d="M8 27V5m1 1q5-4 10 0t9 0l-3 8q-4 3-9-1t-7-1" fill="#94c5d4"/><path d="m11 8 4 1m1 2 5 2"/>',
  star: '<path d="m16 3 3.4 7.7 8.5.8-6.5 5.5 2 8.4-7.4-4.5-7.4 4.5 2-8.4-6.5-5.5 8.5-.8z" fill="#f1cb78"/><path d="m16 9 .2 6 4 2.6" stroke="#b57945"/>',
  ribbon: '<path d="M3 7q13 11 26 0"/><path d="m5 9 2 8 4-5m1 1 4 9 4-9m1-1 4 5 2-8" fill="#f19f9d"/><path d="M3 5v20m26-20v20"/>',
  ruby: '<path d="M6 24q-5-2-3-8l4 2Q6 8 16 7q10-1 11 9l3-2q3 7-3 10-11 7-21 0Z" fill="#e98992"/><path d="m12 7-1-4 5 1 5-2-1 5z" fill="#79bccc"/><path d="M10 14q1-2 3-1m6-1q2-1 3 1m-6 7q2 2 4-1"/><circle cx="11.5" cy="16.5" r="1" fill="#463e49" stroke="none"/><circle cx="21" cy="16.5" r="1" fill="#463e49" stroke="none"/>',
  planter: '<path d="M10 18h12l-2 8h-8z" fill="#947758"/><path d="M16 18v-7m0 5q-6 0-7-6 6 0 7 6Zm1-2q0-6 7-7-1 6-7 7Z" fill="#92aa8b"/>'
};
function icon(id) {
  return '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+glyphs[id]+'</svg>';
}
function el(tag,cls,text) {
  const n=document.createElement(tag);
  n.className="df-"+cls;
  if(text!==undefined)n.textContent=text;
  return n;
}
function control(cls,act,text) {
  const b=el("button",cls,text);
  b.type="button";b.addEventListener("click",act);
  return b;
}

const notes = {
  tap:{name:"Tap",beats:1,caption:"1 beat"},
  hold:{name:"Hold",beats:2,caption:"2 beats"},
  rest:{name:"Rest",beats:1,caption:"1 silent beat"}
};
const melodyNames=["Drum","Bell"];
const duration=bar=>bar.reduce((sum,id)=>sum+notes[id].beats,0);
function restoreBar(raw) {
  if(!Array.isArray(raw)||raw.length>4||Array.from(raw).some(id=>typeof id!=="string"||!Object.hasOwn(notes,id)))return [];
  return duration(raw)<=4?[...raw]:[];
}
function musicBox(host,saved,onChange) {
  const bars=[restoreBar(saved?.bars?.[0]),restoreBar(saved?.bars?.[1])];
  let active=saved?.active===1?1:0;
  const root=el("section","rehearsal");
  root.setAttribute("aria-label","Two-bar rehearsal music box");
  const roll=el("div","roll");
  roll.setAttribute("role","group");roll.setAttribute("aria-label","Select a bar to edit");
  const toolbar=el("div","notes");
  toolbar.setAttribute("role","group");toolbar.setAttribute("aria-label","Add a note to the selected bar");
  const under=el("div","music-tools");
  const focusLabel=el("strong","edit-label");
  const live=el("p","status");
  live.setAttribute("role","status");
  const read=()=>({bars:bars.map(bar=>[...bar]),active});
  const check=()=>bars[0].join(",")==="hold,tap,tap"&&bars[1].join(",")==="rest,tap,hold";
  const measures=bars.map((_,i)=>{
    const b=control("measure",()=>{
      if(active===i)return;
      active=i;render();live.textContent="Editing the "+melodyNames[i].toLowerCase()+" bar.";onChange?.(read());
    });
    b.dataset.bar=String(i);
    const head=el("span","measure-head"), name=el("strong","voice",melodyNames[i]+" bar"), count=el("span","beat-count");
    const grid=el("span","staff");
    grid.setAttribute("aria-hidden","true");head.append(name,count);b.append(head,grid);roll.append(b);
    return {b,count,grid};
  });
  for(const [id,n] of Object.entries(notes)) {
    const b=control("note-key",()=>{
      const current=active;
      if(duration(bars[current])+n.beats>4) {
        live.textContent="That note needs "+n.beats+(n.beats===1?" beat.":" beats.")+" Lift the last note or choose the other bar.";
        return;
      }
      bars[current].push(id);
      if(current===0&&duration(bars[0])===4&&duration(bars[1])<4)active=1;
      render();live.textContent=n.name+" added to the "+melodyNames[current].toLowerCase()+" bar."+(current!==active?" Now editing the bell bar.":"");
      onChange?.(read());
    });
    b.dataset.note=id;b.setAttribute("aria-label","Add "+n.name.toLowerCase()+", "+n.caption);
    b.innerHTML=icon(id);b.append(el("b","note-name",n.name),el("small","note-caption",n.caption));toolbar.append(b);
  }
  const lift=control("tool",()=>{
    if(!bars[active].length)return;
    const id=bars[active].pop();render();
    live.textContent=notes[id].name+" lifted from the "+melodyNames[active].toLowerCase()+" bar.";onChange?.(read());
  },"Lift last note");
  lift.dataset.lift="";
  function render() {
    measures.forEach(({b,count,grid},i)=>{
      const bar=bars[i],used=duration(bar);
      b.setAttribute("aria-pressed",String(i===active));
      b.setAttribute("aria-label",melodyNames[i]+" bar, "+used+" of 4 beats. "+(bar.length?bar.map(id=>notes[id].name).join(", "):"Empty")+". Select to edit.");
      count.textContent=used+" / 4";grid.replaceChildren();
      let beat=0;
      for(const id of bar) {
        const segment=el("span","segment");
        segment.dataset.kind=id;segment.style.gridColumn="span "+notes[id].beats;
        segment.innerHTML=icon(id);segment.append(el("small","tick",notes[id].beats===2?(beat+1)+"–"+(beat+2):String(beat+1)));
        grid.append(segment);beat+=notes[id].beats;
      }
      while(beat<4) {
        const empty=el("span","segment");empty.dataset.kind="empty";
        empty.append(el("span","pin"),el("small","tick",String(++beat)));grid.append(empty);
      }
    });
    lift.disabled=!bars[active].length;focusLabel.textContent="Editing the "+melodyNames[active].toLowerCase()+" bar";
  }
  under.append(focusLabel,lift);
  root.append(roll,under,toolbar,live);host.replaceChildren(root);render();
  return {read,check};
}

// A position is the leading square of a wagon along its one movable axis.
const wagons=[
  {id:"ruby",name:"Ruby",axis:"x",lane:2,start:0,color:"#d8838c"},
  {id:"cup",name:"Cup",axis:"x",lane:0,start:1,color:"#d6b573"},
  {id:"flag",name:"Flag",axis:"y",lane:2,start:1,color:"#88b8c5"},
  {id:"star",name:"Star",axis:"y",lane:3,start:2,color:"#caa1ca"},
  {id:"ribbon",name:"Ribbon",axis:"x",lane:4,start:2,color:"#83b6aa"}
];
const initial=wagons.map(w=>w.start);
const planters=[8,17]; // D2 and C4, row-major.
const moves={left:["x",-1],right:["x",1],up:["y",-1],down:["y",1]};
function squares(w,pos) {
  const start=w.axis==="x"?w.lane*5+pos:pos*5+w.lane;
  return [start,start+(w.axis==="x"?1:5)];
}
function validPositions(p) {
  if(!Array.isArray(p)||p.length!==wagons.length)return false;
  const occupied=new Set(planters);
  for(let i=0;i<wagons.length;i++) {
    if(!Number.isInteger(p[i])||p[i]<0||p[i]>3)return false;
    for(const sq of squares(wagons[i],p[i])) {
      if(occupied.has(sq))return false;
      occupied.add(sq);
    }
  }
  return true;
}
function adjacent(a,b) {
  return a.reduce((distance,v,i)=>distance+Math.abs(v-b[i]),0)===1;
}
function bridge(host,saved,onChange) {
  let positions=validPositions(saved?.positions)?[...saved.positions]:[...initial];
  let selected=wagons.some(w=>w.id===saved?.selected)?saved.selected:"ruby";
  const history=[];
  if(Array.isArray(saved?.history)) {
    let after=positions;
    for(const earlier of saved.history.slice(-32).reverse()) {
      if(!validPositions(earlier)||!adjacent(earlier,after))break;
      history.unshift([...earlier]);after=earlier;
    }
  }
  const read=()=>({positions:[...positions],selected,history:history.map(pos=>[...pos])});
  const check=()=>positions[0]===3;
  const root=el("section","bridge");
  root.setAttribute("aria-label","Sliding float puzzle");
  const mat=el("div","bridge-mat");
  const board=el("div","lanes");board.setAttribute("role","group");board.setAttribute("aria-label","Five by five parade bridge. Select a float.");
  const gate=el("span","gate","Gate");
  const controls=el("div","drive");
  const selectedLabel=el("strong","chosen"), directions=el("div","directions");
  directions.setAttribute("role","group");directions.setAttribute("aria-label","Slide the selected float one square");
  const live=el("p","status");live.setAttribute("role","status");
  for(const sq of planters) {
    const tile=el("span","planter");tile.style.left=(sq%5)*20+"%";tile.style.top=Math.floor(sq/5)*20+"%";
    tile.innerHTML=icon("planter");tile.setAttribute("role","img");tile.setAttribute("aria-label","Fixed planter at "+"ABCDE"[sq%5]+(Math.floor(sq/5)+1));board.append(tile);
  }
  const floats=wagons.map(w=>{
    const b=control("float",()=>{
      if(selected===w.id)return;
      selected=w.id;render();live.textContent=w.name+" selected.";onChange?.(read());
    });
    b.dataset.float=w.id;b.dataset.axis=w.axis;b.style.setProperty("--df-cart",w.color);
    b.innerHTML='<span class="df-car">'+icon(w.id)+'</span>';
    b.addEventListener("keydown",e=>{
      const d={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"}[e.key];
      if(d){e.preventDefault();slide(w.id,d);}
    });
    board.append(b);return b;
  });
  const turnButtons={};
  for(const dir of Object.keys(moves)) {
    const title=dir[0].toUpperCase()+dir.slice(1);
    const b=control("dir",()=>slide(selected,dir),title);
    b.dataset.move=dir;turnButtons[dir]=b;directions.append(b);
  }
  const undo=control("tool",()=>{
    if(!history.length)return;
    positions=history.pop();render();live.textContent="Last slide undone.";onChange?.(read());
  },"Undo slide");
  undo.dataset.undoSlide="";
  function next(i,dir) {
    const [axis,step]=moves[dir];
    if(wagons[i].axis!==axis)return null;
    const p=[...positions];p[i]+=step;return validPositions(p)?p:null;
  }
  function slide(id,dir) {
    const i=wagons.findIndex(w=>w.id===id),p=next(i,dir);
    if(!p){live.textContent=wagons[i].name+" cannot move "+dir+".";return;}
    selected=id;history.push([...positions]);if(history.length>32)history.shift();
    positions=p;render();live.textContent=check()?"Ruby has reached the gate. Try the lock.":wagons[i].name+" moved "+dir+".";
    onChange?.(read());
  }
  function render() {
    wagons.forEach((w,i)=>{
      const pos=positions[i],x=w.axis==="x"?pos:w.lane,y=w.axis==="y"?pos:w.lane,b=floats[i];
      b.style.left=x*20+"%";b.style.top=y*20+"%";
      b.setAttribute("aria-pressed",String(w.id===selected));
      const end=squares(w,pos)[1];
      b.setAttribute("aria-label",w.name+" float. "+"ABCDE"[x]+(y+1)+" to "+"ABCDE"[end%5]+(Math.floor(end/5)+1)+". Slides "+(w.axis==="x"?"left or right.":"up or down."));
    });
    const i=wagons.findIndex(w=>w.id===selected),w=wagons[i];
    selectedLabel.textContent=w.name+" float";selectedLabel.style.setProperty("--df-cart",w.color);
    for(const [dir,b] of Object.entries(turnButtons)) {
      b.hidden=moves[dir][0]!==w.axis;b.disabled=!next(i,dir);
      b.setAttribute("aria-label","Slide "+w.name+" "+dir+" one square");
    }
    undo.disabled=!history.length;gate.classList.toggle("df-arrived",check());
  }
  mat.append(board,gate);controls.append(selectedLabel,directions,undo);
  root.append(mat,controls,live);host.replaceChildren(root);render();
  return {read,check};
}

export const fairRooms=[
  {
    id:"rehearsal",title:"The Four-Beat Rehearsal",place:"Starlight Stage",art:"stage",boardTitle:"The rehearsal roll",
    brief:"The stage drummer has the clapper for the Dawn Bell. Ruby must finish the morning call before the drummer can hand it over.",
    clue:"Give each bar four beats. The drum strikes three times, and its first strike lasts longer than its last. The bell waits one silent beat, then strikes twice. Its last ring lasts longer than its first.",
    hints:[
      "Tap makes one beat of sound, Hold makes two, and Rest uses one beat of silence. Select either bar to edit it.",
      "Three drum strikes fill four beats only if one of them is a Hold. The clue puts that Hold first.",
      "From Reset, enter Hold, Tap, Tap for the drum. The bell bar opens next. Enter Rest, Tap, Hold."
    ],
    miss:"The drummer is waiting. Count four beats in each bar and check which sound lasts longer.",
    reward:{symbol:"bell",name:"Bell Chime"},
    reply:"Ruby winds the roll. Three drumstrokes cross the stage, then the little bell answers. The drummer unhooks the brass clapper and wraps it in velvet.",
    journalNote:"The stage drummer gave Ruby the velvet-wrapped clapper for the Dawn Bell.",
    create:musicBox
  },
  {
    id:"paradebridge",title:"The Parade Crossing",place:"Ribbon Parade",art:"parade",boardTitle:"The parade bridge",
    brief:"Ruby’s pink float is carrying the clapper, but four parade wagons crowd the bridge. The gate is at the right end of Ruby’s lane.",
    clue:"Select a float, then slide it one square at a time. Each float follows its own rails. The two planted pots stay put. Bring Ruby to the gate.",
    hints:[
      "Follow Ruby’s row to the gate. The blue Flag and purple Star are parked across it. Check the ends of their rails.",
      "The Cup above the Flag can slide left. At the bottom, move the Ribbon left so the Star can slide down.",
      "From Reset, slide Cup left, Flag up, Ribbon left and Star down. Then slide Ruby right three times."
    ],
    miss:"Ruby has not reached the gate. Clear both crossings and slide the pink float all the way right.",
    reward:{symbol:"ribbon",name:"Ribbon Chime"},
    reply:"Ruby rolls beneath the arch. The parade marshal unties its longest ribbon and threads it through the clapper. The Dawn Bell has a pull cord again.",
    journalNote:"The parade marshal tied a ribbon pull cord to the Dawn Bell’s clapper.",
    create:bridge
  }
];
