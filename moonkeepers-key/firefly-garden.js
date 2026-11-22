const tileSize=32;
const pieces=[
  {id:"fern",name:"Fern",fill:"#92af82",line:"#4f765f",cells:[[0,0],[0,1],[1,1]]},
  {id:"maple",name:"Maple",fill:"#d69371",line:"#97634d",cells:[[0,0],[1,0],[2,0],[1,1]]},
  {id:"reed",name:"Reed",fill:"#d5bb72",line:"#947a46",cells:[[0,0],[1,0],[2,0]]}
];
const holes=new Set([0,11]);
const leafAnswer=[4,5,1]; // Fern B1, Maple B2, Reed A2.
const cellName=i=>"ABC"[Math.floor(i/4)]+(i%4+1);
const wrapSvg=(body,box)=>'<svg viewBox="'+box+'" focusable="false" aria-hidden="true">'+body+'</svg>';
const undoIcon=wrapSvg('<path d="m10 5-6 6 6 5M5 11h9q6 0 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',"0 0 24 24");
function leafStamp(id) {
  if(id==="fern")return '<path d="M-8 8Q-4-3 8-9M-5 3Q-12 0-9-4q5 0 6 4m2-3Q-6-6-4-9q4 1 6 4m-6 7q5 4 9-1-4-2-7-1m7-7q4 2 8-2-4-2-6-1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
  if(id==="maple")return '<path d="m0 9 1-5 6-1-1-2 5-4-4 0 2-4-5 2-2-5-2 3-2-5-2 7-5-3 1 5-4-1 5 5-2 2 8 1-1 4Z" fill="currentColor"/>';
  return '<path d="M-9 7Q-7-4 9-8 6 5-9 7ZM-9 8 7-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>';
}
function paperArt(piece) {
  const owns=(x,y)=>piece.cells.some(([a,b])=>a===x&&b===y), paths=[],borders=[];
  const lines=[[0,-1,0,0,32,0],[1,0,32,0,32,32],[0,1,32,32,0,32],[-1,0,0,32,0,0]];
  for(const [x,y] of piece.cells) {
    const X=x*tileSize,Y=y*tileSize;
    paths.push('<rect x="'+X+'" y="'+Y+'" width="32.1" height="32.1" fill="'+piece.fill+'"/><g transform="translate('+(X+16)+' '+(Y+15)+')" color="'+piece.line+'" opacity=".83">'+leafStamp(piece.id)+'</g>');
    for(const [dx,dy,x1,y1,x2,y2] of lines)if(!owns(x+dx,y+dy))borders.push('M'+(X+x1)+' '+(Y+y1)+'L'+(X+x2)+' '+(Y+y2));
  }
  return paths.join('')+'<path d="'+borders.join(' ')+'" fill="none" stroke="'+piece.line+'" stroke-width="2.3" stroke-linejoin="round"/>'+
    '<circle cx="5.8" cy="5.8" r="3.8" fill="#ffe196" stroke="#786543" stroke-width="1.1"/><circle cx="4.8" cy="4.8" r="1" fill="#fff3c7"/>';
}
function preview(piece) {
  const w=Math.max(...piece.cells.map(c=>c[0]))+1,h=Math.max(...piece.cells.map(c=>c[1]))+1;
  return wrapSvg('<g transform="translate('+(48-w*16)+' '+(34-h*16)+')">'+paperArt(piece)+'</g>',"-2 -2 100 72");
}
function covers(n,origin) {
  if(!Number.isInteger(origin)||origin<0||origin>11)return null;
  const x=origin%4,y=Math.floor(origin/4), cells=[];
  for(const [dx,dy] of pieces[n].cells){
    const p=(y+dy)*4+x+dx;
    if(x+dx>=4||y+dy>=3||holes.has(p))return null;
    cells.push(p);
  }
  return cells;
}
function fits(placed,n,origin) {
  const cover=covers(n,origin);
  return Boolean(cover)&&placed.every((start,j)=>j===n||start===null||!covers(j,start).some(i=>cover.includes(i)));
}
function leafParty(host,saved,onChange){
  const placed=[null,null,null];
  if(Array.isArray(saved?.placed)&&saved.placed.length===3)saved.placed.forEach((at,n)=>{if(fits(placed,n,at))placed[n]=at;});
  let selected=Number.isInteger(saved?.selected)&&pieces[saved.selected]?saved.selected:null;
  const read=()=>({placed:[...placed],selected}),check=()=>placed.every(at=>at!==null);
  const diagram=wrapSvg('<rect x="1" y="3" width="76" height="22" rx="3" fill="#e7d8b2" stroke="#918468"/><path d="M20 4h56v20H20Z" fill="#d5bb72" stroke="#947a46"/><path d="M39 4v20m19-20v20" stroke="#aa934f" stroke-dasharray="2 2"/><circle cx="24" cy="8" r="2.6" fill="#ffe196" stroke="#796544"/><g font-size="8" fill="#514735" font-family="sans-serif"><text x="23" y="20">A2</text><text x="42" y="20">A3</text><text x="61" y="20">A4</text></g>',"0 0 79 28");
  host.innerHTML='<section class="fg-board fg-leaves" aria-label="Festival leaf lantern">'+
    '<div class="fg-sample"><div>'+diagram+'</div><p><strong>Reed example.</strong> Its dot is on A2. The leaf covers A2, A3, and A4.</p></div>'+
    '<div class="fg-shade-case"><div class="fg-shade-hanger" aria-hidden="true"></div><div class="fg-shade">'+
    '<div class="fg-panes" role="group" aria-label="Lantern squares">'+Array.from({length:12},(_,n)=>'<button type="button" class="fg-pane'+(holes.has(n)?' fg-peg':'')+'" data-pane="'+cellName(n)+'">'+(holes.has(n)?'<i aria-hidden="true"></i>':'')+'<span>'+cellName(n)+'</span></button>').join('')+'</div>'+
    '<svg class="fg-overlay" viewBox="0 0 128 96" aria-hidden="true"><g></g></svg></div>'+
    '<div class="fg-shade-foot" aria-hidden="true"><i></i><i></i><i></i></div></div>'+
    '<div class="fg-papers" role="group" aria-label="Pick a leaf">'+pieces.map(p=>'<button type="button" data-paper="'+p.id+'">'+preview(p)+'<span>'+p.name+'</span></button>').join('')+'</div>'+
    '<div class="fg-tools"><span class="fg-count"></span><button type="button" data-lift>'+undoIcon+'Lift leaf</button></div>'+
    '<p class="fg-status" role="status" aria-live="polite"></p></section>';
  const root=host.firstElementChild, panes=[...root.querySelectorAll("[data-pane]")],paper=[...root.querySelectorAll("[data-paper]")];
  const layer=root.querySelector(".fg-overlay g"),lift=root.querySelector("[data-lift]"),live=root.querySelector(".fg-status");
  function occupant(n){return placed.findIndex((at,j)=>at!==null&&covers(j,at).includes(n));}
  function refresh(){
    layer.innerHTML=placed.map((at,j)=>at===null?"":'<g transform="translate('+(at%4*32)+' '+(Math.floor(at/4)*32)+')">'+paperArt(pieces[j])+'</g>').join("");
    panes.forEach((b,i)=>{
      const owner=occupant(i);b.classList.toggle("fg-filled",owner!==-1);
      b.setAttribute("aria-label",cellName(i)+", "+(holes.has(i)?"wooden peg":owner===-1?"empty square":pieces[owner].name+" paper"));
    });
    paper.forEach((b,n)=>{
      b.setAttribute("aria-pressed",String(selected===n));b.classList.toggle("fg-in",placed[n]!==null);
      b.setAttribute("aria-label","Pick "+pieces[n].name+(placed[n]!==null?", dot on "+cellName(placed[n]):", in the tray")+". "+["Gold dot, one square below, one to its right.","Three across the top, one below the middle. Dot at top left.","Three in a row. Dot at the left."][n]);
    });
    root.querySelector(".fg-count").textContent=placed.filter(i=>i!==null).length+" / 3 leaves in";
    lift.disabled=selected===null||placed[selected]===null;root.classList.toggle("fg-glow",check());
  }
  function select(n){
    if(n===selected){live.textContent="Tap a square for "+pieces[n].name+"’s gold dot.";return;}
    selected=n;refresh();live.textContent="Tap the square for "+pieces[n].name+"’s gold dot.";onChange?.(read());
  }
  paper.forEach((b,n)=>b.addEventListener("click",()=>select(n)));
  panes.forEach((b,i)=>{
    b.addEventListener("click",()=>{
      if(holes.has(i)){live.textContent="A wooden peg is here. Pick a paper square.";return;}
      if(selected===null){
        const owner=occupant(i);if(owner>=0)select(owner);else live.textContent="Pick a leaf below the lantern first.";return;
      }
      if(!fits(placed,selected,i)){live.textContent="It won’t fit here. Keep the whole leaf on free squares.";return;}
      if(placed[selected]===i){live.textContent="This leaf already starts here.";return;}
      const name=pieces[selected].name;placed[selected]=i;selected=null;refresh();onChange?.(read());
      live.textContent=check()?"The leaf lantern glows! Try the lock.":name+" is in. Pick the next leaf.";
    });
    b.addEventListener("keydown",event=>{
      const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4}[event.key];if(!delta)return;
      event.preventDefault();const next=i+delta;
      if(panes[next]&&(Math.abs(delta)===4||Math.floor(i/4)===Math.floor(next/4)))panes[next].focus();
    });
  });
  lift.addEventListener("click",()=>{
    if(selected===null||placed[selected]===null)return;
    placed[selected]=null;refresh();onChange?.(read());live.textContent=pieces[selected].name+" is lifted. Tap a new square.";paper[selected].focus();
  });
  function guide(){
    if(check())return null;
    const wrong=placed.findIndex((at,n)=>at!==null&&at!==leafAnswer[n]);
    const i=wrong>=0?wrong:placed.indexOf(null),name=pieces[i].name;
    if(selected!==i)return {target:paper[i],text:"Tap "+name+"."};
    if(wrong>=0)return {target:lift,text:"Tap Lift leaf to make space."};
    return {target:panes[leafAnswer[i]],text:"Tap "+cellName(leafAnswer[i])+" for the gold dot."};
  }
  refresh();live.textContent=check()?"The leaf lantern glows! Try the lock.":selected===null?"Pick a leaf below the lantern.":"Pick a square for "+pieces[selected].name+"’s dot.";
  return {read,check,guide};
}

const fruitArt={
  apple:'<path d="M3 10q9-2 19-1-2 9-10 11-7 2-9-6Z" fill="#b95847" stroke="#854e40" stroke-width="1.2"/><path d="M3 9q10-5 19-1-2 8-10 9-7 1-9-8Z" fill="#eed39a" stroke="#b98c65" stroke-width="1"/><path d="M5 10q7-4 14-2" stroke="#fff0c4" fill="none" stroke-width="1.2"/><path d="M12 11q2-2 4-1-1 3-4 3Z" fill="#896747"/>',
  berry:'<path d="M5 13q0-7 7-8t9 6q2 8-5 10-9 3-11-4Z" fill="#778cb4" stroke="#495f80" stroke-width="1.2"/><path d="M8 12q0-4 4-5" stroke="#becbd9" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="m15 6 1-3 2 2 3-1-1 3 1 1-4 1-3-2Z" fill="#687b71" stroke="#4c6271" stroke-width=".7"/>'
};
const animalArt={
  cat:'<path d="m5 13-1-9 7 4q5-2 10 0l6-5-1 11q1 10-9 12Q6 27 5 18Z" fill="#bdc2af" stroke="#61736a" stroke-width="1.1"/><path d="m6 6 1 6 3-3m12 1 4-5-1 7" fill="#dcae9b"/><path d="m12 8 1 4 2-4 2 4 2-4" fill="#88998a"/><circle cx="10" cy="15" r="1.4" fill="#384e45"/><circle cx="21" cy="15" r="1.4" fill="#384e45"/><path d="m14 18 3-.3-1.4 2Z" fill="#a87869"/><path d="m8 18-5-1m5 3-5 1m20-3 5-1m-5 3 5 1" stroke="#718477" fill="none"/>',
  koala:'<g stroke="#6c766e" stroke-width="1.1"><circle cx="6" cy="12" r="5.2" fill="#99aaa3"/><circle cx="26" cy="12" r="5.2" fill="#99aaa3"/><ellipse cx="16" cy="16" rx="11" ry="10" fill="#b6c1b3"/></g><g fill="#ddbcac"><circle cx="5.4" cy="12" r="2.5"/><circle cx="26.6" cy="12" r="2.5"/></g><circle cx="11" cy="15" r="1.25" fill="#3d4d47"/><circle cx="21" cy="15" r="1.25" fill="#3d4d47"/><path d="M13.7 18q0-4 2.5-4t2.7 4q0 2-2.7 2t-2.5-2Z" fill="#58645d"/><path d="M15 22q1.3 1 3-.3" fill="none" stroke="#758078"/>'
};
const dishes=["cat","koala"], names=["Cat","Koala"];
const sticks=[[1,0],[2,1],[2,2],[0,2]],allocation=[1,0,1,0];
const animals=id=>wrapSvg(animalArt[id],"0 0 32 30");
function fruitLine(apples,berries){
  const all=[...Array(apples).fill("apple"),...Array(berries).fill("berry")];
  return all.map(type=>wrapSvg(fruitArt[type],"0 0 25 25")).join("");
}
function picnic(host,saved,onChange){
  const served=Array.isArray(saved?.served)&&saved.served.length===4?Array.from(saved.served,v=>v===0||v===1?v:null):Array(4).fill(null);
  const read=()=>({served:[...served]});
  function totals(){
    const counts=[[1,0],[0,1]];
    served.forEach((who,i)=>{if(who!==null){counts[who][0]+=sticks[i][0];counts[who][1]+=sticks[i][1];}});
    return counts;
  }
  const check=()=>served.every(v=>v!==null)&&totals().every(([a,b])=>a===3&&b===3);
  const boards=dishes.map((id,n)=>'<div class="fg-dish fg-'+id+'" data-dish="'+id+'"><div class="fg-dish-name">'+animals(id)+'<b>'+names[n]+'</b></div>'+
    '<div class="fg-fruit-bowl" aria-hidden="true"><div></div></div><span class="fg-dish-tally"></span></div>').join("");
  host.innerHTML='<section class="fg-board fg-picnic" aria-label="Share the fruit sticks">'+
    '<div class="fg-sample"><div class="fg-apple-sum" aria-hidden="true">'+fruitLine(1,0)+'<b>+</b>'+fruitLine(2,0)+'<b>= 3</b></div><p><strong>Count the plate too.</strong> One apple slice plus two more makes three.</p></div>'+
    '<div class="fg-blanket"><div class="fg-plates">'+boards+'</div></div>'+
    '<div class="fg-skewers" role="group" aria-label="Give each fruit stick to Cat or Koala">'+
    sticks.map(([a,b],i)=>'<div class="fg-skewer"><b class="fg-stick-tag">Stick '+(i+1)+'</b><div class="fg-stick-fruit" role="img" aria-label="'+a+' apple slices, '+b+' berries">'+fruitLine(a,b)+'</div>'+
      '<div class="fg-serve-to">'+dishes.map((id,n)=>'<button type="button" data-stick="'+(i+1)+'" data-plate="'+id+'" aria-label="Give stick '+(i+1)+' to '+names[n]+'">'+names[n]+'</button>').join("")+'</div></div>').join("")+
    '</div><p class="fg-status" role="status" aria-live="polite"></p></section>';
  const root=host.firstElementChild,live=root.querySelector(".fg-status"),guests=[...root.querySelectorAll("[data-dish]")],choices=[...root.querySelectorAll("[data-stick]")];
  function refresh(){
    const counts=totals();
    guests.forEach((dish,n)=>{
      const [a,b]=counts[n];dish.querySelector(".fg-fruit-bowl div").innerHTML=fruitLine(a,b);
      dish.querySelector(".fg-dish-tally").textContent=a+(a===1?" slice":" slices")+" · "+b+(b===1?" berry":" berries");
      dish.classList.toggle("fg-ready",a===3&&b===3);
    });
    choices.forEach(button=>{
      const given=served[Number(button.dataset.stick)-1]===dishes.indexOf(button.dataset.plate);
      button.setAttribute("aria-pressed",String(given));
    });
  }
  choices.forEach(button=>button.addEventListener("click",()=>{
    const i=Number(button.dataset.stick)-1,n=dishes.indexOf(button.dataset.plate);
    served[i]=served[i]===n?null:n;refresh();onChange?.(read());
    live.textContent=check()?"Three of each for both friends! Try the lock.":served[i]===null?"Stick "+(i+1)+" is back on the cloth.":names[n]+" has stick "+(i+1)+".";
  }));
  function guide(){
    const i=served.findIndex((n,j)=>n!==allocation[j]);
    return i<0?null:{target:root.querySelector('[data-stick="'+(i+1)+'"][data-plate="'+dishes[allocation[i]]+'"]'),text:"Tap "+names[allocation[i]]+" on stick "+(i+1)+"."};
  }
  refresh();live.textContent=check()?"Three of each for both friends! Try the lock.":"Pick Cat or Koala beside each stick. Tap again to take it back.";
  return {read,check,guide};
}

export const gardenFireflyRooms=[
  {id:"leafparty",title:"The Leaf Lantern",place:"Treehouse Loft",art:"hollow",boardTitle:"Fit the leaves",
    brief:"Cat is making a lantern in the loft. Help fit its three paper leaves into the wooden frame.",
    clue:"Cover all the paper squares. Leave the two round pegs free. Pick a leaf, then tap a square for its gold dot.",
    hints:["The straight Reed needs three squares in a row. Look at the three paper squares in the top row.","From Reset, pick Reed and tap A2. Pick Fern and tap B1.","From Reset, put Reed on A2, Fern on B1, and Maple on B2."],
    miss:"There are gaps in the lantern. Use all three leaves. To move one, pick it again.",reward:{symbol:"leaf",name:"Leaf lantern"},
    reply:"Warm light shines through the leaves. Cat hangs the first lantern by the loft window.",journalNote:"Made from three paper leaves in the treehouse loft.",create:leafParty},
  {id:"picnicplates",title:"The Firefly Picnic",place:"Orchard Picnic",art:"picnic",boardTitle:"Share the fruit sticks",
    brief:"Cat and Koala spread a picnic cloth under the trees. Can you share their fruit?",
    clue:"Each friend wants 3 apple slices and 3 berries. Give away whole sticks. Cat has one apple slice. Koala has one berry.",
    hints:["From Reset, Cat needs two more apple slices. Koala needs three.","From Reset, give stick 2 to Cat. Cat now needs two berries. Look for a stick with just two berries.","From Reset, give sticks 2 and 4 to Cat. Give sticks 1 and 3 to Koala."],
    miss:"Count each plate. Both friends need 3 apple slices and 3 berries.",reward:{symbol:"apple",name:"Apple lantern"},
    reply:"Both plates are ready. Koala lights the apple lantern beside the picnic cloth.",journalNote:"Lit at the orchard picnic after Cat and Koala shared their fruit.",create:picnic}
];
