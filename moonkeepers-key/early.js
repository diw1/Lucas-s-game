// The puzzle pieces use the same painted symbols in the clues, in the tray and on the lock.
const pictures = {
  feather: `
    <path d="M20 77C18 54 36 24 71 13c9-2 13-2 13 0-1 23-15 51-45 61l-13 2" fill="#91bdb0"/>
    <path d="M28 70C37 46 64 20 79 15c-12 24-28 44-51 55Z" fill="#c6d9bc" stroke="none"/>
    <path d="M16 85C37 66 56 43 77 21" fill="none" stroke="#596a54" stroke-width="4.2"/>
    <g fill="none" stroke="#668778" stroke-width="1.8"><path d="m30 68-1-13m7 6-1-16m10 8 1-16m7 8 3-14m-17 30 17-3m-7-8 16-3m-9-7 12-3"/></g>
    <path d="m64 45 6-4-3 7m-24 17 7-1-4 4" fill="#233f43" stroke="none"/>`,
  acorn: `
    <path d="M25 42c0 20 9 34 22 39l4 5 4-6c15-8 21-26 19-40Z" fill="#c68d55"/>
    <path d="M32 47c0 11 5 22 10 28" fill="none" stroke="#e6b476" stroke-width="4.3"/>
    <path d="M55 76c8-8 13-17 13-28" fill="none" stroke="#a46a43" stroke-width="2.3"/>
    <path d="M44 29c-4-8-7-12-13-14-3-2 0-7 4-6 10 4 14 11 17 20Z" fill="#8b7050"/>
    <path d="M21 44c0-25 46-34 57-7l-1 8c-14 9-41 9-56-1Z" fill="#927450"/>
    <g fill="none" stroke="#cfad73" stroke-width="2.1"><path d="m27 36 5 4 4-7 6 4 5-8 6 5 5-7 5 5 5-3m-37 16 5-5 6 5 6-6 7 4 5-5 6 3"/></g>
    <path d="M49 23c6-11 16-13 24-11-2 9-9 15-21 16Z" fill="#87a77b"/>`,
  bell: `
    <circle cx="48" cy="22" r="8" fill="none" stroke="#b3844e" stroke-width="5"/>
    <path d="M39 71q0 11 9 13 10-1 10-13" fill="#9f7053"/>
    <path d="M23 65c8-7 7-13 9-24 4-22 31-23 36 0 2 12 1 17 9 24l-2 6H25Z" fill="#d6a554"/>
    <path d="M36 51c1-14 5-19 10-20" fill="none" stroke="#f4d285" stroke-width="4.2"/>
    <path d="M60 34q6 9 6 23" fill="none" stroke="#ab804b" stroke-width="3"/>
    <path d="M22 65q28 7 56 0l1 7c-17 7-42 7-58 0Z" fill="#eac47b"/>
    <path d="m47 43 2 6 5 2-5 2-2 6-2-6-4-2 4-2Z" fill="#bc8752" stroke="none"/>`,
  lamp: `
    <path d="M38 24v-4q0-12 10-12 11 0 11 12v4" fill="none" stroke="#b79968" stroke-width="4"/>
    <path d="m32 31 5-9h23l5 9-6 5H37Z" fill="#ac9462"/>
    <path d="m37 35-8 29 6 9h27l6-9-9-29Z" fill="#edc87c"/>
    <path d="m42 39-4 26m17-27 4 26" fill="none" stroke="#fff0ae" stroke-width="2.4"/>
    <path d="M47 63c-7-5-2-11 2-16-1 6 6 8 4 13q-2 5-6 3Z" fill="#fff2ad" stroke="none"/>
    <path d="M29 66q19 4 38 0v8l-7 6H36l-7-6Z" fill="#a28154"/>`,
  biscuit: `
    <path d="M18 54c-4-18 14-33 33-34 21-2 32 10 31 27 0 20-16 31-37 32-14 1-24-7-27-16Z" fill="#ad7a4f"/>
    <path d="M16 51c-1-17 17-30 35-31 19-2 30 9 30 23 0 16-15 28-33 30-18 2-30-6-32-22Z" fill="#dfaf72"/>
    <path d="M23 48c2-11 13-20 25-22" fill="none" stroke="#f2c991" stroke-width="3.4"/>
    <g fill="#926a4c" stroke="none"><ellipse cx="40" cy="38" rx="3.7" ry="2.1" transform="rotate(-30 40 38)"/><ellipse cx="58" cy="32" rx="3.3" ry="2.1"/><ellipse cx="53" cy="51" rx="4" ry="2.3" transform="rotate(-28 53 51)"/><ellipse cx="32" cy="55" rx="2.8" ry="1.9"/><ellipse cx="65" cy="54" rx="2.8" ry="2"/><ellipse cx="47" cy="63" rx="2.7" ry="1.9"/></g>`,
  crescent: `
    <path d="M13 51c5-9 10-17 17-21 7-10 18-12 27-8 12-1 22 6 24 17 6 5 8 17 4 24-3 6-8 13-14 13-3 0-3-3-2-6 3-8-3-17-12-19-10-3-19-1-25 4-9 7-13 16-18 13-6-3-4-11-1-17Z" fill="#c9985d"/>
    <path d="M20 47q4-11 11-14m5-6q8-6 16-3m10 2q10 0 15 9" fill="none" stroke="#f4cc82" stroke-width="3.3"/>
    <g fill="none" stroke="#966d46" stroke-width="2.4"><path d="M28 33q10 4 12 18m-3-26q12 5 14 22m7-22q8 12 4 26m17-13q-1 9-10 18m14 1-10 6"/></g>
    <path d="M12 62q2 3 5 3m54 6 4-2" fill="none" stroke="#936849" stroke-width="2"/>`,
  loaf: `
    <path d="M13 58c-2-15 8-27 23-33 19-11 43-8 49 11 6 16-1 28-20 36-25 11-48 10-52-7Z" fill="#a96c48"/>
    <path d="M12 55c0-15 9-25 25-32 21-10 41-7 48 11 4 12-5 25-22 31-23 9-45 11-50 1Z" fill="#d7a064"/>
    <g fill="#f0c183" stroke="#b5895b" stroke-width="1.3"><path d="M24 35q12 0 16 15-12-5-16-15Z"/><path d="M39 25q14 0 18 16-13-5-18-16Z"/><path d="M57 22q12 0 16 13-14-5-16-13Z"/></g>
    <path d="M19 62q13 6 28 1" fill="none" stroke="#eeb77c" stroke-width="2.8"/>`,
  weight: `
    <path d="M37 31v-6c0-14 23-14 23 0v6" fill="none" stroke="#a98951" stroke-width="6"/>
    <path d="M28 36q20-9 40 0l8 34q-22 13-55 1Z" fill="#be9857"/>
    <path d="M28 37q19 7 40-1m-39 30 4-22" fill="none" stroke="#e0c288" stroke-width="3"/>
    <path d="M46 46h4v16m-6 1h12" fill="none" stroke="#645842" stroke-width="3.5"/>`
};
const pic = name => `<svg class="er-pic er-pic-${name}" viewBox="0 0 96 96" fill="none" stroke="#504c3e" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${pictures[name]}</svg>`;
const icon = path => '<svg class="er-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+path+'"/></svg>';
const undoIcon = icon("M9 5 3 11l6 5M4 11h9c5 0 8 2 8 7");
const speak = (region,text) => { region.textContent=text; };
const labels={feather:"Feather",acorn:"Acorn",bell:"Bell",biscuit:"Seed biscuit",crescent:"Crescent",loaf:"Loaf",weight:"One-ounce weight"};
const ordinal=["First","Middle","Last"];
function pieceButton(id){
  return '<button type="button" class="er-piece" data-piece="'+id+'">'+pic(id)+'<span>'+labels[id]+'</span></button>';
}

function porch(host,saved,onChange){
  const pieces=["bell","feather","acorn"], slots=[null,null,null];
  if(Array.isArray(saved?.slots) && saved.slots.length===3){
    saved.slots.forEach((v,n)=>{if(pieces.includes(v)&&!slots.includes(v))slots[n]=v;});
  }
  let selected=null;
  host.innerHTML=`<section class="er-board er-porch" aria-label="Porch rail arrangement">
    <div class="er-evidence er-porch-note"><span class="er-mini-head">The keeper’s note</span>
      <p>“The feather hangs nearer the lantern than the bell. The acorn hangs between them.”</p></div>
    <div class="er-workshop">
      <div class="er-brass-plate"><i></i><span>Porch rail</span><i></i></div>
      <div class="er-rail">
        <div class="er-lamp-end">${pic("lamp")}<span>Lantern end</span></div>
        ${ordinal.map((name,i)=>`<button type="button" class="er-notch" data-notch="${i}"><span class="er-notch-eye"></span><span class="er-hanging"></span><span class="er-notch-name">${name}</span></button>`).join("")}
      </div>
    </div>
    <div class="er-parts-label"><h3>Keepsakes</h3><button type="button" class="er-tool er-return" disabled>${undoIcon} Return to tray</button></div>
    <div class="er-tray">${pieces.map(pieceButton).join("")}</div>
    <p class="er-status" role="status" aria-live="polite">Choose a keepsake, then a hook. You can swap two keepsakes.</p>
  </section>`;
  const root=host.firstElementChild, live=root.querySelector(".er-status");
  const notches=[...root.querySelectorAll(".er-notch")], buttons=[...root.querySelectorAll(".er-piece")], back=root.querySelector(".er-return");
  const read=()=>({slots:[...slots]});
  function render(){
    notches.forEach((b,i)=>{
      const id=slots[i], spot=id?labels[id]:"Empty hook";
      b.querySelector(".er-hanging").innerHTML=id?pic(id):'<span class="er-empty-notch" aria-hidden="true">+</span>';
      b.setAttribute("aria-label",ordinal[i]+" hook. "+spot+(selected?". Place "+labels[selected]+" here.":"."));
      b.classList.toggle("er-full",!!id);b.classList.toggle("er-selected",!!id&&id===selected);
    });
    buttons.forEach(b=>{
      const id=b.dataset.piece;b.setAttribute("aria-pressed",String(id===selected));b.classList.toggle("er-placed",slots.includes(id));
      b.setAttribute("aria-label","Select "+labels[id]+(slots.includes(id)?", on "+ordinal[slots.indexOf(id)].toLowerCase()+" hook":", in the tray"));
    });
    back.disabled=!selected||!slots.includes(selected);
  }
  function select(id){
    selected=id===selected?null:id;render();
    speak(live,selected?labels[selected]+" selected. Choose a hook.":"Choose a keepsake, then a hook.");
  }
  buttons.forEach(b=>b.addEventListener("click",()=>select(b.dataset.piece)));
  notches.forEach((b,i)=>b.addEventListener("click",()=>{
    if(!selected){if(slots[i])select(slots[i]);else speak(live,"Choose a keepsake from the tray first.");return;}
    const previous=slots.indexOf(selected),other=slots[i];
    if(previous===i){select(selected);return;}
    if(previous>=0)slots[previous]=other;
    slots[i]=selected;const moved=selected;selected=null;render();
    speak(live,labels[moved]+" is on the "+ordinal[i].toLowerCase()+" hook."+(slots.every(Boolean)?" The rail is ready to check.":""));
    onChange?.(read());
  }));
  back.addEventListener("click",()=>{
    const i=slots.indexOf(selected);if(i<0)return;
    const v=selected;slots[i]=null;selected=null;render();speak(live,labels[v]+" is back in the tray.");onChange?.(read());
  });
  render();
  return {read,check:()=>slots.join("|")==="feather|acorn|bell"};
}

const starPositions=[
  ["A1",12,15],["A2",31,15],["A4",69,15],["A5",88,15],
  ["B1",12,47],["B2",31,47],["B3",50,47],["B4",69,47],["B5",88,47],
  ["C1",12,79],["C2",31,79],["C3",50,79],["C4",69,79],["C5",88,79]
];
const skyById=new Map(starPositions.map(([id,x,y])=>[id,[x,y]]));
const seam=["C1","B2","B3","A4","B5","C4"];
const diamond='<path d="m12 1 2.65 7.9L23 12l-8.35 2.75L12 23l-2.65-8.25L1 12l8.35-3.1Z"/>';
function neighbor(a,b){
  const [ax,ay]=skyById.get(a),[bx,by]=skyById.get(b);
  return Math.abs(bx-ax)<=19&&Math.abs(by-ay)<=32;
}

function loft(host,saved,onChange){
  let path=[];
  if(Array.isArray(saved?.path)&&saved.path.length<=seam.length&&saved.path[0]===seam[0]&&
      saved.path.every(p=>skyById.has(p))&&new Set(saved.path).size===saved.path.length&&
      saved.path.every((p,i)=>!i||neighbor(saved.path[i-1],p)))path=[...saved.path];
  const refPoints=seam.map(id=>{const [x,y]=skyById.get(id);return [14+x*1.7,11+y*.80];});
  const quilt=`<svg class="er-chart" viewBox="0 0 204 92" role="img" aria-label="The quilt starts at the brass ring. Its five stitches go up-right, right, up-right, down-right, and down-left.">
    <rect x="3" y="3" width="198" height="86" rx="7" fill="#375e72" stroke="#92aaa5" stroke-width="2"/>
    <rect x="8" y="8" width="188" height="76" rx="4" fill="none" stroke="#b9bba0" stroke-dasharray="3 4"/>
    <path d="m10 26 18-17m-18 35 35-35m-35 52 52-52m-52 69 68-69m-49 74 74-74m-52 74 74-74m-51 74 74-74m-51 74 74-74m-51 74 72-71m-49 71 49-49m-27 49 27-27" stroke="#a2b9ae" stroke-opacity=".13" fill="none"/>
    <polyline points="${refPoints.map(p=>p.join(",")).join(" ")}" fill="none" stroke="#ead09b" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 3"/>
    ${refPoints.map(([x,y],i)=>i===0?`<circle cx="${x}" cy="${y}" r="4.7" fill="#bd965a" stroke="#ffdf8c" stroke-width="2.6"/>`:`<path d="M${x} ${y-4.6}l1.5 3.15 3.6 1.45-3.6 1.4-1.5 3.15-1.45-3.15-3.65-1.4 3.65-1.45Z" fill="#f0e2b6"/>`).join("")}
    </svg>`;
  host.innerHTML=`<section class="er-board er-loft" aria-label="Trace the star window">
    <div class="er-evidence er-quilt-note">${quilt}<div><span class="er-mini-head">The blue quilt</span><p>Copy its five stitches onto the window. Start at the brass ring.</p></div></div>
    <div class="er-window">
      <div class="er-brass-plate"><i></i><span>Star window</span><i></i></div>
      <div class="er-sky" role="group" aria-label="Star positions">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="er-thread" aria-hidden="true"><polyline points=""></polyline></svg>
        ${starPositions.map(([id,x,y])=>`<button type="button" class="er-star${id==="C1"?" er-start":""}" data-star="${id}" style="left:${x}%;top:${y}%"><svg viewBox="0 0 24 24" aria-hidden="true">${diamond}</svg><span class="er-star-tag">${id}</span></button>`).join("")}
      </div>
    </div>
    <div class="er-foot-tools"><span class="er-counter" aria-live="off"></span><button type="button" class="er-tool er-undo">${undoIcon} Undo stitch</button></div>
    <p class="er-status" role="status" aria-live="polite"></p></section>`;
  const root=host.firstElementChild, live=root.querySelector(".er-status"),line=root.querySelector(".er-thread polyline");
  const stars=[...root.querySelectorAll(".er-star")],undo=root.querySelector(".er-undo"),count=root.querySelector(".er-counter");
  const read=()=>({path:[...path]});
  function refresh(){
    stars.forEach(b=>{
      const id=b.dataset.star,n=path.indexOf(id);
      b.classList.toggle("er-on",n!==-1);b.classList.toggle("er-tail",id===path.at(-1));b.setAttribute("aria-pressed",String(n!==-1));
      b.setAttribute("aria-label",[id,id==="C1"?"brass starting ring":"star",n!==-1?"point "+(n+1)+" of the trail":"untraced"].join(", "));
    });
    line.setAttribute("points",path.map(id=>skyById.get(id).join(",")).join(" "));
    count.textContent=Math.max(0,path.length-1)+" / 5 stitches";undo.disabled=!path.length;
  }
  function next(id){
    if(!path.length&&id!=="C1"){speak(live,"Find the brass ring at C1 to begin.");return;}
    if(id===path.at(-1)){undoStitch();return;}
    if(path.includes(id)){speak(live,"That star is already threaded. Undo the last stitch to change direction.");return;}
    if(path.length>=6){speak(live,"All five stitches are in place. Check the lock or undo a stitch.");return;}
    if(path.length&&!neighbor(path.at(-1),id)){speak(live,"One stitch reaches a neighboring star. Choose a star one step from "+path.at(-1)+".");return;}
    path.push(id);refresh();speak(live,path.length===1?"The thread is tied to C1. Choose the next star.":path.length===6?"Five stitches made. Check the lock.":"Stitch "+(path.length-1)+" ends at "+id+".");onChange?.(read());
  }
  stars.forEach(b=>b.addEventListener("click",()=>next(b.dataset.star)));
  function undoStitch(){
    if(!path.length)return;path.pop();refresh();speak(live,path.length?"The thread ends at "+path.at(-1)+".":"Start again at the brass ring.");onChange?.(read());
  }
  undo.addEventListener("click",undoStitch);
  refresh();speak(live,path.length===6?"Your five stitches are ready to check.":path.length?"Your thread ends at "+path.at(-1)+".":"Tap the brass ring at C1 to start the thread.");
  return {read,check:()=>path.join("|")===seam.join("|")};
}

const ounces={biscuit:2,crescent:3,loaf:5};
const bakes=Object.keys(ounces);
function receipt(left,right,alt){
  const side=parts=>parts.map((part,i)=>(i?'<span class="er-plus">+</span>':'')+
    (typeof part==="string"?pic(part):'<span class="er-multiplier">'+part[0]+' ×</span>'+pic(part[1]))).join('');
  return '<div class="er-receipt" role="img" aria-label="'+alt+'"><div aria-hidden="true">'+side(left)+'<span class="er-equals">=</span>'+side(right)+'</div></div>';
}
function scalePan(which,load){
  return '<g class="er-pan-'+which+'"><circle cy="0" r="3.8" fill="#eac688" stroke="#815a3c" stroke-width="1.5"/>'+
    '<path d="m0 2-54 52m54-52 54 52M0 3v46" fill="none" stroke="#c1a47c" stroke-width="1.7"/>'+
    load+'<path d="M-56 52q55 8 112 0l-8 8q-46 17-96 0Z" fill="#a97e54" stroke="#5c503d" stroke-width="2"/>'+
    '<path d="M-53 53q54 8 106 0" fill="none" stroke="#e3c58b" stroke-width="2.4"/></g>';
}
function bakery(host,saved,onChange){
  const tray=Array.isArray(saved?.tray)?saved.tray.filter(b=>bakes.includes(b)).slice(0,3):[];
  const goldWeight='<path d="M-7 28v-4a7 7 0 0 1 14 0v4" fill="none" stroke="#d7b775" stroke-width="4"/>'+
    '<path d="M-13 28q13-4 26 0l6 22q-18 6-38 0Z" fill="#cda55f" stroke="#705a40" stroke-width="1.8"/>'+
    '<text y="46" fill="#433e33" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-weight="bold">11 oz</text>';
  const instrument='<svg class="er-balance" viewBox="0 0 480 158" aria-hidden="true">'+
    '<path d="M202 126q10-6 22-8l10-42v-22l6-11 6 11v22l10 42q12 2 22 8l2 6h-80Z" fill="#987147" stroke="#5e503e" stroke-width="2.2"/>'+
    '<path d="M214 123q13-4 17-6l8-39m5 3 6 36" fill="none" stroke="#d8b577" stroke-width="2"/>'+
    '<path d="M195 132h90l5 7H190Z" fill="#bc975f" stroke="#5a4e3e" stroke-width="2"/>'+
    '<path d="M213 43q27-21 54 0m-27-11v5m-13-3 2 5m24-5-2 5" fill="none" stroke="#b79c71" stroke-width="1.5"/>'+
    '<g class="er-scale-beam"><path d="M97 54q59 6 124-11l19-2 19 2q65 17 124 11l-2 8q-63 4-124-8l-17-1-17 1q-61 12-124 8Z" fill="#bd955e" stroke="#67533e" stroke-width="2"/>'+
    '<path d="M103 56q67 1 122-10m29 0q62 12 122 10" fill="none" stroke="#eccb8c" stroke-width="2"/>'+
    '<path d="M238 46l2-19 2 19Z" fill="#f1d6a1"/><circle cx="240" cy="52" r="8" fill="#c4a76c" stroke="#705438" stroke-width="2"/><circle cx="240" cy="52" r="2.8" fill="#665543"/></g>'+
    scalePan("left",'<g class="er-pan-load"></g>')+scalePan("right",goldWeight)+'</svg>';
  host.innerHTML=`<section class="er-board er-bakery" aria-label="The baker’s balance">
    <div class="er-evidence er-ledger"><span class="er-mini-head">Baker’s weight book</span>
      <div class="er-receipts">${receipt([ [2,"biscuit"] ],[ [4,"weight"] ],"Two seed biscuits weigh the same as four one-ounce weights.")}${receipt(["biscuit","weight"],["crescent"],"A seed biscuit and a one-ounce weight balance one crescent.")}${receipt(["crescent","biscuit"],["loaf"],"One crescent and one seed biscuit balance one loaf.")}</div>
      <p>Each brass weight is 1 ounce.</p></div>
    <div class="er-scale-case"><div class="er-brass-plate"><i></i><span>Bakery balance</span><i></i></div>
      ${instrument}<div class="er-scale-reading"><strong class="er-weighed"></strong><span>Order · 11 ounces</span></div></div>
    <div class="er-parts-label"><h3>Choose three bakes</h3><span class="er-counter er-bake-count"></span></div>
    <div class="er-tray er-pantry">${bakes.map(pieceButton).join("")}</div>
    <div class="er-order" role="group" aria-label="Your order. Select a bake to take it off the scale.">
      ${[0,1,2].map(i=>'<button type="button" class="er-order-slot" data-order="'+i+'"></button>').join("")}
    </div><p class="er-status" role="status" aria-live="polite"></p></section>`;
  const root=host.firstElementChild,ready=root.querySelector(".er-weighed"),live=root.querySelector(".er-status");
  const available=[...root.querySelectorAll(".er-piece")],order=[...root.querySelectorAll(".er-order-slot")];
  const beam=root.querySelector(".er-scale-beam"),left=root.querySelector(".er-pan-left"),right=root.querySelector(".er-pan-right");
  const read=()=>({tray:[...tray]});
  const total=()=>tray.reduce((sum,bake)=>sum+ounces[bake],0);
  function refresh(){
    const mass=total(),delta=11-mass,angle=Math.min(7,Math.max(-7,delta*1.8)),rad=angle*Math.PI/180;
    const dx=139*Math.cos(rad),dy=139*Math.sin(rad);
    beam.setAttribute("transform","rotate("+angle+" 240 52)");
    left.setAttribute("transform","translate("+(240-dx)+" "+(57-dy)+")");right.setAttribute("transform","translate("+(240+dx)+" "+(57+dy)+")");
    root.querySelector(".er-pan-load").innerHTML=tray.map((key,i)=>{
      const x=(i-(tray.length-1)/2)*25-17;
      return '<svg x="'+x+'" y="20" width="34" height="35" viewBox="0 0 96 96" fill="none" stroke="#504c3e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'+pictures[key]+'</svg>';
    }).join("");
    ready.textContent=!tray.length?"Pan empty":delta>0?"Too light":delta<0?"Too heavy":"Balanced";
    root.querySelector(".er-scale-reading").classList.toggle("er-balanced",delta===0);
    root.querySelector(".er-bake-count").textContent=tray.length+" / 3 bakes";
    available.forEach(b=>{b.setAttribute("aria-label","Add "+labels[b.dataset.piece]);b.setAttribute("aria-disabled",String(tray.length===3));});
    order.forEach((b,i)=>{
      const id=tray[i];b.disabled=!id;b.setAttribute("aria-label",id?"Remove "+labels[id]+" from order position "+(i+1):"Empty order position "+(i+1));
      b.innerHTML=id?pic(id)+'<span>'+labels[id]+'</span><span aria-hidden="true" class="er-minus">−</span>':'<span class="er-dash" aria-hidden="true">—</span> Empty';
    });
  }
  function report(){
    refresh();
    const weights=total()<11?"lighter than":total()>11?"heavier than":"level with";
    speak(live,tray.length?"Your order is "+weights+" the eleven-ounce weight. "+(tray.length===3?(total()===11?"Check the lock.":"Tap a bake in the order to take it off."): "Add another bake."):"Choose a bake to put it on the left pan.");
  }
  available.forEach(b=>b.addEventListener("click",()=>{
    if(tray.length>=3){speak(live,"Your order has three bakes. Tap one below the pantry to remove it.");return;}
    tray.push(b.dataset.piece);report();onChange?.(read());
  }));
  order.forEach((b,i)=>b.addEventListener("click",()=>{
    if(i>=tray.length)return;
    const [removed]=tray.splice(i,1);report();onChange?.(read());
    if(b.disabled)available.find(item=>item.dataset.piece===removed)?.focus();
  }));
  report();
  return {read,check:()=>tray.length===3&&total()===11};
}

export const earlyRooms=[
  {id:"porch",title:"The Porch Rail",place:"Treehouse Porch",art:"canopy",
    brief:"Three keepsakes slipped from the rail outside the yellow treehouse. Put them on their hooks, reading from the lantern end.",
    clue:"Look for the lantern on the left. The keeper’s note tells you where each keepsake belongs.",
    hints:["Find the lantern end of the rail. Nearer means fewer hooks away from that end.","The acorn sits between the two other keepsakes, so it belongs in the middle.","Place the feather nearest the lantern, the acorn in the middle, and the bell on the last hook."],
    reward:{symbol:"moon",name:"Moon"},reply:"The bell gives a single chime. A brass Moon seal slips from its rim into your palm.",create:porch},
  {id:"loft",title:"A Seam of Stars",place:"Treehouse Loft",art:"hollow",
    brief:"The loft window has lost its constellation. The blue quilt keeps a stitched copy of the missing pattern.",
    clue:"Tie the thread to the brass ring, then match the direction and length of each stitch on the quilt.",
    hints:["The round brass knot on the quilt matches the ring around C1 on the window.","Your first stitch moves one row up and one column right. The second goes one column straight right.","Start at C1 and visit B2, B3, A4, B5, then C4. Use Undo stitch to unpick the thread."],
    reward:{symbol:"leaf",name:"Leaf"},reply:"The last star catches the thread. A little Leaf seal tumbles from the folded quilt.",create:loft},
  {id:"bakery",title:"The Baker’s Measure",place:"Bunny Bakery",art:"bakery",
    brief:"The night order calls for exactly three bakes weighing eleven ounces together. The baker left the weight book open beside the scale.",
    clue:"Read the three entries in the weight book, then try bakes on the left pan. You may choose the same kind more than once.",
    hints:["The first entry shows two identical seed biscuits balancing four one-ounce weights. How heavy is one biscuit?","A biscuit weighs two ounces. One extra ounce makes a crescent, and a crescent together with a biscuit makes a loaf.","Use one five-ounce loaf. The two remaining bakes must make six ounces together."],
    reward:{symbol:"flame",name:"Flame"},reply:"The pans hang level. The baker ties up your order and hands you a warm copper Flame seal.",create:bakery}
];
