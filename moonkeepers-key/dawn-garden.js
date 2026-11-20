const flower = [".#.#.", "#####", ".###.", "..#.#", "..##."];
const rowNames = "ABCDE";
const buttons = (root, selector) => [...root.querySelectorAll(selector)];
const smallSvg = (shapes, view = "0 0 32 32") =>
  '<svg viewBox="'+view+'" aria-hidden="true" focusable="false">'+shapes+'</svg>';
const seed = smallSvg('<path d="M15 25q0-6 1-12" fill="none" stroke="#e0bf7c" stroke-width="2.4"/><path d="M16 20C7 20 5 14 5 11c7-1 12 2 12 9Z" fill="#a4bc80" stroke="#456f5f"/><path d="M16 16c0-6 6-10 12-10 0 6-5 11-12 10Z" fill="#d6d999" stroke="#698666"/><path d="M17 14c-6-1-8-5-5-10 1-2 3-3 4-4 3 4 7 10 1 14Z" fill="#8ac4bd" stroke="#416f73"/><path d="M14 6q-2 3 0 5" stroke="#ebf6d4" stroke-width="1.6" fill="none" stroke-linecap="round"/>');
const cross = smallSvg('<g stroke="#d1bf99" stroke-width="2.2" stroke-linecap="round"><path d="m10 10 12 12m0-12L10 22"/></g>');
const undo = smallSvg('<path d="m14 6-8 8 8 7M7 14h11c5 0 8 3 8 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>');
const dew = smallSvg('<path d="M16 2c-1 5-9 12-9 18a9 9 0 0 0 18 0c0-6-8-13-9-18Z" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M11 19c-1 4 2 6 4 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" fill="none"/>');
function runs(line) {
  return line.join("").split(/0+/).filter(Boolean).map(group => group.length);
}
const pattern = flower.map(row => [...row].map(c => Number(c==="#")));
const rowClues = pattern.map(runs);
const colClues = Array.from({length:5}, (_,c) => runs(pattern.map(row => row[c])));
const coord = (index, cols) => rowNames[Math.floor(index / cols)] + (1 + index % cols);
function keyGrid(event, index, cols, count, go) {
  const step = {ArrowLeft:-1, ArrowRight:1, ArrowUp:-cols, ArrowDown:cols}[event.key];
  if (!step) return;
  event.preventDefault();
  if ((event.key==="ArrowLeft" && index%cols===0) || (event.key==="ArrowRight" && index%cols===cols-1)) return;
  const next=index+step;
  if(next>=0 && next<count) go(next,step);
}
function makeClue(clue, axis, n) {
  const label = (axis==="row"?"Row "+rowNames[n]:"Column "+(n+1))+" groups: "+clue.join(", ");
  return '<div class="dg-count dg-'+axis+'-count" data-'+axis+'="'+n+'" aria-label="'+label+'">'+clue.map(v=>'<b>'+v+'</b>').join('')+'</div>';
}
function seedbed(host,saved,onChange) {
  const cells = Array.isArray(saved?.cells) && saved.cells.length===25 ?
    Array.from(saved.cells,x=>x===1||x===2?x:0) : Array(25).fill(0);
  let mode = saved?.mode==="cross" ? "cross" : "fill";
  const read = () => ({cells:[...cells],mode});
  const check = () => cells.every((v,i)=>(v===1)===Boolean(pattern[Math.floor(i/5)][i%5]));
  const matrix = [];
  for(let i=0; i<25; i++) {
    if(i%5===0) matrix.push(makeClue(rowClues[Math.floor(i/5)],"row",Math.floor(i/5)));
    matrix.push('<button type="button" class="dg-soil" data-seed="'+i+'"><span class="dg-furrow" aria-hidden="true"></span><span class="dg-growth">'+seed+'</span><span class="dg-cross">'+cross+'</span></button>');
  }
  host.innerHTML = '<section class="dg-board dg-garden" aria-label="Dewflower seed lattice">'+
    '<div class="dg-instructions"><div class="dg-specimen">'+dew+'</div><p>Each number is a run of planted squares. Count across each row and down each column. Leave at least one empty square between runs.</p></div>'+
    '<div class="dg-nursery"><div class="dg-plaque"><i></i>Dewflower seedbed<i></i></div>'+
    '<div class="dg-lattice" role="group" aria-label="Five rows and five columns. Arrow keys move between squares."><div class="dg-count-corner" aria-hidden="true">'+dew+'</div>'+
    colClues.map((v,i)=>makeClue(v,"col",i)).join('')+matrix.join('')+'</div></div>'+
    '<div class="dg-controls"><div class="dg-modes" role="group" aria-label="Garden tool">'+
    '<button type="button" data-mode="fill">'+seed+' Plant</button><button type="button" data-mode="cross">'+cross+' Mark empty</button></div>'+
    '<span class="dg-seed-total"></span></div><p class="dg-status" role="status" aria-live="polite"></p></section>';
  const root=host.firstElementChild;
  const squares=buttons(root,"[data-seed]"), modes=buttons(root,"[data-mode]");
  const rows=buttons(root,"[data-row]"), cols=buttons(root,"[data-col]");
  const live=root.querySelector(".dg-status"), total=root.querySelector(".dg-seed-total");
  function render() {
    squares.forEach((square,i)=>{
      const r=Math.floor(i/5), c=i%5, value=cells[i];
      square.dataset.value=String(value);
      square.setAttribute("aria-label",coord(i,5)+", "+["untouched","planted","marked empty"][value]+". Row "+rowClues[r].join(", ")+". Column "+colClues[c].join(", ")+".");
    });
    for(let i=0; i<5; i++) {
      const planted=v=>Number(v===1);
      rows[i].classList.toggle("dg-matched",runs(cells.slice(i*5,i*5+5).map(planted)).join()===rowClues[i].join());
      cols[i].classList.toggle("dg-matched",runs(cells.filter((_,j)=>j%5===i).map(planted)).join()===colClues[i].join());
    }
    modes.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mode===mode)));
    root.classList.toggle("dg-bloom",check());
    total.textContent=cells.filter(v=>v===1).length+" planted";
  }
  modes.forEach(b=>b.addEventListener("click",()=>{
    if(b.dataset.mode===mode) return;
    mode=b.dataset.mode; render(); live.textContent=mode==="cross"?"Mark an empty square. Tap it again to erase the mark.":"Choose a square to plant. Tap it again to lift the seed.";
    onChange?.(read());
  }));
  squares.forEach((square,i)=>{
    square.addEventListener("keydown",event=>keyGrid(event,i,5,25,next=>squares[next].focus()));
    square.addEventListener("click",()=>{
      const chosen=mode==="fill"?1:2;
      cells[i]=cells[i]===chosen?0:chosen;
      render(); live.textContent=check()?"Every row and column matches. Try the lock.":coord(i,5)+" "+["cleared.","planted.","marked empty."][cells[i]];
      onChange?.(read());
    });
  });
  render();live.textContent=check()?"Every row and column matches. Try the lock.":"Choose Plant or Mark empty. Tap the same square again to clear it.";
  return {read,check};
}

// The field describes the number engraved on each lily. Water has no landing.
const brookField = [0,0,0,0, 2,2,3,1, 3,1,1,0, 2,0,1,0];
const start=12, goal=3;
const lilyNames=Array.from({length:16},(_,i)=>coord(i,4));
function canHop(from,to,used) {
  if(from===goal || used.includes(to) || (!brookField[to]&&to!==goal)) return false;
  const dx=Math.abs(from%4-to%4),dy=Math.abs(Math.floor(from/4)-Math.floor(to/4));
  return (dx===0||dy===0)&&dx+dy===brookField[from];
}
const lily = smallSvg('<path d="M46 9C28 6 11 17 8 33 4 49 16 61 32 64c15 3 31-5 36-21 0-1 1-4 1-5L48 41l17-12C61 16 55 12 46 9Z" fill="#284e51" opacity=".78" transform="translate(1 4)"/><path class="dg-lily-body" d="M45 8C28 5 11 16 8 32 4 46 14 59 31 62c14 3 32-5 36-20l2-7-24 5 20-13C61 16 55 11 45 8Z" fill="#60937b" stroke="#294f4b" stroke-width="2"/><path d="M13 32c4-12 15-20 27-20m8 0 7 4" fill="none" stroke="#a4bc85" stroke-width="2.2" stroke-linecap="round"/><g fill="none" stroke="#366f61" stroke-width="1.3"><path d="M44 38 26 18m18 20-3-24m3 25 14-16M43 39 15 28m27 12-27 3m29-2L26 55m19-14-2 16m4-15 12 7"/></g><ellipse cx="22" cy="23" rx="2.5" ry="1.6" fill="#c3dfbb" stroke="#6d9a85" stroke-width=".7"/>','0 0 76 74');
const frog = smallSvg('<ellipse cx="20" cy="26" rx="15" ry="4" fill="#224c43" opacity=".55"/><path d="M11 22q-7 0-7 6l6 1 4-3m13-4c6 0 9 3 8 6l-6 1-5-3" fill="#88b172" stroke="#3f6955" stroke-width="1.2"/><ellipse cx="20" cy="21" rx="12" ry="9" fill="#88b172" stroke="#3f6955" stroke-width="1.2"/><path d="M6 16c0-3 2-5 4-6-1-8 8-10 11-4 5-6 12-3 11 4 2 2 3 4 2 7-1 6-8 9-15 8S7 22 6 16Z" fill="#a5c781" stroke="#3f6955" stroke-width="1.3"/><g fill="#f8e8b3"><circle cx="14" cy="9" r="3.4"/><circle cx="27" cy="9" r="3.4"/></g><g fill="#293e38"><circle cx="15" cy="9" r="1.7"/><circle cx="27" cy="9" r="1.7"/></g><path d="M14 17q6 5 12-1" fill="none" stroke="#527552" stroke-width="1.3" stroke-linecap="round"/>','0 0 40 32');
const bell = smallSvg('<path d="M13 6c0-5 6-5 6 0" fill="none" stroke="#dbc48d" stroke-width="2"/><circle cx="16" cy="25" r="3" fill="#ac8055"/><path d="M5 23c4-4 4-6 5-12 2-9 11-9 13 0 1 6 1 8 4 12l-1 2c-8 3-15 2-21 0Z" fill="#edc477" stroke="#916e46" stroke-width="1.3"/><path d="M12 16q0-6 3-8m-7 14q8 2 16 0" fill="none" stroke="#fff0bc" stroke-width="1.5"/>');
function waterArt() {
  return '<svg class="dg-water-art" viewBox="0 0 400 320" preserveAspectRatio="none" aria-hidden="true">'+
    '<g fill="none" stroke="#86baaa" stroke-linecap="round" stroke-width="1.3" opacity=".45"><path d="M-4 56q16 7 30 0t34 0m44-15q19-8 40-1t39 0m-63 8q14-4 29 0m48 17q28 6 50-2t43-2m-83 8q18 3 31 0m70 116q24-8 45-3t54 2m-23 7q-14 3-28 0m-258 53q20 5 34-1t30-1m-48 8q12 3 22 0m90 45q28-8 45-3t41 0m23-143q14 4 23 0M-6 155q14 5 29 1m117-23q12 4 20 1"/></g>'+
    '<g fill="#c7c9a1" opacity=".65"><ellipse cx="107" cy="44" rx="1.7" ry="1"/><circle cx="222" cy="60" r="1.3"/><ellipse cx="339" cy="200" rx="2" ry="1.2"/><circle cx="126" cy="250" r="1.1"/></g>'+
    '<g transform="translate(126 54) rotate(-9)" opacity=".8"><path d="M2 2c6-7 17-7 24-2l7-5-1 6 1 5-8-4C17 9 7 8 2 2Z" fill="#cba473" stroke="#517f77"/><path d="m11-2 5 2-4 3m7-2 3 2" fill="none" stroke="#d47f56" stroke-width="2.2"/><circle cx="6" cy="1" r=".85" fill="#48635a"/></g>'+
    '<g transform="translate(272 20) scale(.8) rotate(18)" opacity=".55"><path d="M0 6q8-12 21-5l7-5-1 6 2 4-9-2Q8 12 0 6Z" fill="#c5ae71"/><path d="m6 4 5-3" stroke="#deb991" stroke-width="2"/></g>'+
    '<g fill="#6a8b66" stroke="#475f55" stroke-width="1"><path d="M-4 21Q5 3 25-3 17 15-4 21Zm1 1q11-13 33-10-13 12-33 10Zm12-9Q10 3 15-2l3 1q-1 8-9 14Z"/><path d="M400 304q-9-22-29-26 8 19 29 26Zm3-1q-2-22-17-34 1 16 17 34Zm-1-3q-14-10-30-6 13 10 30 6Z"/></g>'+
    '<g fill="#87958b" stroke="#5e766e"><path d="M-3 47q5-14 16-12l9 8-4 7L0 53Z"/><path d="m387 314 4-11 10-2 5 8-4 7Z"/></g></svg>';
}
function brook(host,saved,onChange) {
  let path=[start];
  if(Array.isArray(saved?.path) && saved.path[0]===lilyNames[start]) {
    for(const name of saved.path.slice(1,16)) {
      const n=lilyNames.indexOf(name);
      if(n<0||!canHop(path.at(-1),n,path)) break;
      path.push(n);
    }
  }
  const read=()=>({path:path.map(i=>lilyNames[i])});
  const check=()=>path.at(-1)===goal;
  const landscape=Array.from({length:16},(_,i)=>{
    if(!brookField[i]&&i!==goal)return '<span class="dg-water-square" aria-hidden="true"></span>';
    return '<button type="button" class="dg-pad" data-pad="'+lilyNames[i]+'">'+
      '<span class="dg-lily">'+lily+'</span><span class="dg-pad-coordinate">'+lilyNames[i]+'</span><span class="dg-rider">'+frog+'</span>'+
      (i===goal?'<span class="dg-destination">'+bell+'</span>':'<span class="dg-hop-number">'+brookField[i]+'</span>')+'</button>';
  });
  host.innerHTML='<section class="dg-board dg-brook" aria-label="Orchard brook lily ferry">'+
    '<div class="dg-instructions"><div class="dg-specimen">'+frog+'</div><p>Jump exactly the number on your lily, straight across a row or column. You can jump over water and other lilies. Each landing must be new.</p></div>'+
    '<div class="dg-pond-frame"><div class="dg-plaque"><i></i>Orchard brook<i></i></div><div class="dg-pond">'+waterArt()+
    '<svg class="dg-hop-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points=""></polyline></svg>'+
    '<div class="dg-lilies" role="group" aria-label="Lily pads. Reach the bell on A4.">'+landscape.join('')+'</div></div></div>'+
    '<div class="dg-logbar"><div class="dg-hop-log" aria-label="Lily stops"></div><button type="button" class="dg-undo" data-undo-hop>'+undo+' Undo hop</button></div>'+
    '<p class="dg-status" role="status" aria-live="polite"></p></section>';
  const root=host.firstElementChild, pads=buttons(root,"[data-pad]"),back=root.querySelector("[data-undo-hop]");
  const poly=root.querySelector("polyline"),live=root.querySelector(".dg-status"),log=root.querySelector(".dg-hop-log");
  function render() {
    const here=path.at(-1), options=[];
    for(const pad of pads){
      const i=lilyNames.indexOf(pad.dataset.pad), used=path.includes(i), legal=canHop(here,i,path);
      if(legal)options.push(i);
      pad.classList.toggle("dg-here",here===i);pad.classList.toggle("dg-used",used&&i!==here);pad.classList.toggle("dg-reachable",legal);
      pad.classList.toggle("dg-end",i===goal);pad.setAttribute("aria-current",here===i?"location":"false");
      pad.setAttribute("aria-label",lilyNames[i]+", "+(i===goal?"bell landing":"hop "+brookField[i]+" squares")+(here===i?", frog is here":used?", already visited":legal?", reachable":""));
    }
    poly.setAttribute("points",path.map(i=>(12.5+(i%4)*25)+","+(12.5+Math.floor(i/4)*25)).join(" "));
    log.textContent=path.map(i=>lilyNames[i]).join(" › ");back.disabled=path.length===1;
    root.classList.toggle("dg-ferried",check());
    return check()?"You reached the Brook Chime. Try the lock.":!options.length?"No fresh landing from "+lilyNames[here]+". Undo your last hop to try the other fork.":
      "Frog at "+lilyNames[here]+". Jump exactly "+brookField[here]+(brookField[here]===1?" square.":" squares.");
  }
  pads.forEach(pad=>{
    const i=lilyNames.indexOf(pad.dataset.pad);
    pad.addEventListener("click",()=>{
      if(!canHop(path.at(-1),i,path)){
        live.textContent=check()?"The frog is at the bell. Try the lock.":path.includes(i)?"That lily has already held the frog. Use Undo hop to go back.":"That lily is out of reach. "+render();return;
      }
      path.push(i);live.textContent=render();onChange?.(read());
    });
    pad.addEventListener("keydown",event=>keyGrid(event,i,4,16,(next,step)=>{
      let n=next;
      while(n>=0&&n<16&&(Math.abs(step)===4||Math.floor(n/4)===Math.floor(i/4))){
        const dest=pads.find(b=>b.dataset.pad===lilyNames[n]);if(dest){dest.focus();break;}n+=step;
      }
    }));
  });
  back.addEventListener("click",()=>{
    if(path.length===1)return;
    path.pop();live.textContent=render();onChange?.(read());
    if(back.disabled)pads.find(b=>b.dataset.pad===lilyNames[start]).focus();
  });
  live.textContent=render();return {read,check};
}

export const gardenRooms=[
  {id:"dewgarden",title:"The Dewflower Seedbed",place:"Orchard Picnic",art:"picnic",boardTitle:"The seed lattice",
    brief:"The picnic orchard is quiet at first light. Five brass chimes are missing from the Dawn Bell. The gardener tucked the first beneath a flower that blooms only in the right pattern.",
    clue:"The numbers give groups of planted squares in order. A row marked 1, 1 has two single plants with a gap between them. An empty square can stay untouched.",
    hints:["The second row reads 5. Plant all five squares in that row.","Column 1 needs only one plant. It already has one in the second row. A run of four in column 3 must also include rows C and D.","Column 4 reads 3, 1. With just five spaces, its pattern must be plant, plant, plant, gap, plant. Use that to settle the top and bottom rows."],
    miss:"A planting group still differs from its numbers. Matched clue plaques glow gold.",
    reward:{symbol:"dew",name:"Dew Chime"},reply:"Dew gathers on the new flower. When its petals open, the first brass chime rolls onto the picnic cloth.",
    journalNote:"Recovered in the orchard when the seed rows opened into a dewflower.",create:seedbed},
  {id:"brook",title:"The Lily Ferry",place:"Treehouse Brook",art:"canopy",boardTitle:"The lily crossing",
    brief:"A second chime hangs across the brook below the yellow treehouse. A little green frog offers to fetch it, one lily at a time.",
    clue:"Read the number on the frog’s current lily. The frog must hop exactly that many squares, horizontally or vertically, onto a fresh lily. The chime waits on A4.",
    hints:["The starting lily D1 says 2. You can land on B1 or D3. Look at where each of those lilies could send you next.","The B1 fork strands the frog at B3. From D1 go right to D3, then up one square to C3.","From C3, visit C2 and then B2. B2 sends the frog two squares right to B4, directly below the bell."],
    miss:"The chime is still on A4. Follow the number on your current lily, or undo a hop to try another fork.",
    reward:{symbol:"brook",name:"Brook Chime"},reply:"The frog nudges the brass chime free. Its low note travels across the water like a ripple.",
    journalNote:"Ferried back across the treehouse brook by a frog with strong legs.",create:brook}
];
