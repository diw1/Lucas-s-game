function node(tag, part, text) {
  const element = document.createElement(tag);
  element.className = "tl-" + part;
  if (text !== undefined) element.textContent = text;
  return element;
}
function button(part, handle) {
  const element = node("button", part);
  element.type = "button";
  element.addEventListener("click", handle);
  return element;
}
const colNames = "ABCDE";
const address = (x,y) => colNames[x] + (y+1);
const directions = [[0,-1],[1,0],[0,1],[-1,0]];
const mirrors = [[1,3],[1,1],[3,1],[3,4]];
const obstacles = [[1,4],[0,1],[3,0]];
const startMirrors = [1,0,0,0];
const at = (position,x,y) => position[0]===x && position[1]===y;

function trace(angles) {
  let x=0,y=3,dir=1,throughGlass=false;
  const amber=[[x,y]], blue=[], visited=new Set(), events=[];
  let points=amber;
  while(true) {
    const key=(y*5+x)*4+dir;
    if(visited.has(key))return {amber,blue,events,throughGlass,result:"loop"};
    visited.add(key);
    const [dx,dy]=directions[dir];x+=dx;y+=dy;
    if(x<0||x>4||y<0||y>4) {
      points.push([x-dx*.5,y-dy*.5]);events.push("open sea");
      return {amber,blue,events,throughGlass,result:"sea"};
    }
    if(at([2,1],x,y)) {
      points.push([x,y]);throughGlass=true;events.push("crystal C2");
      points=blue;if(!blue.length)blue.push([x,y]);
    }
    if(at([4,4],x,y)) {
      points.push([x,y]);events.push("beacon E5");
      return {amber,blue,events,throughGlass,result:throughGlass?"lit":"uncharged"};
    }
    if(obstacles.some(p=>at(p,x,y))) {
      points.push([x,y]);events.push("rock "+address(x,y));
      return {amber,blue,events,throughGlass,result:"rock"};
    }
    const i=mirrors.findIndex(p=>at(p,x,y));
    if(i>=0) {
      points.push([x,y]);events.push("mirror "+address(x,y));
      dir=(angles[i]===0?[1,0,3,2]:[3,2,1,0])[dir];
    }
  }
}
const rock = '<path d="m4 35 7-12 7-3 5-9 8 4 3 9 5 2 6 9-10 4-22 1Z" fill="#5b767b" stroke="#263e4c" stroke-width="2"/><path d="m10 31 8-7 5-12 4 12 7 4m-15-3 5 6m7-3 5 6" fill="none" stroke="#b0b5a1" stroke-width="1.4"/><path d="M4 40q6 2 10 0m16 0q8 1 13-2" fill="none" stroke="#91b5af"/>';
const lamp = '<path d="M3 32h14l-1 6H6Zm3-1V18q4-5 9 0v13" fill="#b48754" stroke="#2b4047" stroke-width="2"/><path d="m12 19 13 2v7l-13 3z" fill="#efbc68" stroke="#354851" stroke-width="2"/><path d="M24 20q7 0 7 5t-7 5z" fill="#ffe5a6" stroke="#f4bd69" stroke-width="2"/><path d="M5 38h14m-9-13h1" stroke="#ebcc89" stroke-width="2"/>';
const crystal = '<g class="tl-crystal"><path d="m12 21 7-9h13l7 9-14 19z" fill="#91d9d7" fill-opacity=".86" stroke="#304d59" stroke-width="2"/><path d="m12 21 13 19-6-19 6-9 7 9-7 19 14-19Zm0 0h27" fill="none" stroke="#e0ffff" stroke-width="1.2"/></g>';
const beacon = '<g class="tl-beacon"><path d="M9 40h32l-4-5H13Zm6-5 5-16h10l6 16" fill="#eee0b5" stroke="#28424c" stroke-width="2"/><path d="m17 30 15-4 1 5-18 4z" fill="#ce8275"/><path class="tl-lamp-window" d="M18 12h14v9H18z" fill="#586d72" stroke="#2f4550" stroke-width="1.6"/><path d="m15 13 10-8 10 8zM16 22h18" fill="#d4aa71" stroke="#304754" stroke-width="1.8"/></g>';
const sprite = (x,y,markup) => '<g transform="translate('+x*50+' '+y*50+')">'+markup+'</g>';

function optics(host,saved,onChange) {
  const valid=Array.isArray(saved?.mirrors)&&saved.mirrors.length===4&&
    Array.from(saved.mirrors).every(v=>v===0||v===1);
  const angles=valid?[...saved.mirrors]:[...startMirrors];
  const root=node("section","optics");
  root.setAttribute("aria-label","Turn the lighthouse mirrors");
  const panel=node("div","optical-case"), board=node("div","water");
  const lines=[1,2,3,4].map(n=>'M'+50*n+' 0v250M0 '+50*n+'h250').join("");
  const coast=obstacles.map(([x,y])=>sprite(x,y,rock)).join("");
  board.innerHTML='<svg class="tl-chart" viewBox="0 0 250 250" aria-hidden="true" focusable="false">'+
    '<path d="'+lines+'" fill="none" stroke="#a7bcac" stroke-opacity=".21" stroke-width="1"/>'+
    coast+'<g class="tl-rays"></g>'+sprite(0,3,lamp)+sprite(2,1,crystal)+sprite(4,4,beacon)+'</svg>';
  const read=()=>({mirrors:[...angles]});
  const check=()=>trace(angles).result==="lit";
  const status=node("p","ray-status");
  status.setAttribute("role","status");
  const switches=mirrors.map(([x,y],i)=>{
    const name=address(x,y);
    const b=button("mirror",()=>{
      angles[i]=1-angles[i];render();onChange?.(read());
    });
    b.dataset.mirror=name.toLowerCase();b.style.left=x*20+"%";b.style.top=y*20+"%";
    b.innerHTML='<svg viewBox="0 0 50 50" aria-hidden="true" focusable="false">'+
      '<circle class="tl-mirror-rim" cx="25" cy="25" r="17.5"/>'+
      '<g class="tl-mirror-glass"><path d="m9 35 26-26 5 5-26 26z" fill="#c2e8e3" stroke="#335363" stroke-width="1.6"/>'+
      '<path d="m12 34 22-22" stroke="#fff0c2" stroke-width="2.5"/></g>'+
      '<circle cx="25" cy="25" r="2.4" fill="#f8d894" stroke="#775d3f" stroke-width="1"/></svg>';
    b.append(node("span","map-label",name));board.append(b);return b;
  });
  const legend=node("div","legend");
  legend.append(node("span","amber-key","Yellow from the lamp"),node("span","blue-key","Blue from the crystal"));
  const path=(p,cls)=>{
    if(p.length<2)return "";
    const d=p.map(([x,y],i)=>(i?"L":"M")+(x*50+25)+" "+(y*50+25)).join(" ");
    return '<g class="tl-ray tl-'+cls+'"><path class="tl-halo" d="'+d+'"/><path class="tl-core" d="'+d+'"/></g>';
  };
  function render() {
    const ray=trace(angles);
    board.querySelector(".tl-rays").innerHTML=path(ray.amber,"amber")+path(ray.blue,"blue");
    board.classList.toggle("tl-prism-on",ray.throughGlass);
    board.classList.toggle("tl-beacon-on",ray.result==="lit");
    switches.forEach((b,i)=>{
      const name=address(...mirrors[i]),falls=angles[i]===1;
      b.classList.toggle("tl-falls",falls);
      b.setAttribute("aria-label","Mirror "+name+". It slopes "+(falls?"down":"up")+" to the right. Tap to turn.");
    });
    const outcome=ray.result==="lit"?"The blue beam lights the beacon.":ray.result==="rock"?"A rock stops the light at "+ray.events.at(-1).split(" ")[1]+".":ray.result==="sea"?"The light goes out to sea.":ray.result==="loop"?"The light goes round in a loop.":"The lighthouse needs blue light.";
    status.textContent=outcome;
    const route=node("span","sr"," Beam path: lamp A4, "+ray.events.join(", ")+".");status.append(route);
  }
  const demo=node("div","example"),copy=node("div","example-copy");
  const drawing=node("span","mirror-example");
  drawing.innerHTML='<svg viewBox="0 0 96 42" aria-hidden="true"><path d="M5 32h50V6" fill="none" stroke="#b47624" stroke-width="3"/><path d="m49 12 6-8 6 8" fill="none" stroke="#b47624" stroke-width="3"/><path d="m43 40 24-24" stroke="#365764" stroke-width="5"/><path d="m43 38 23-23" stroke="#84bfc2" stroke-width="2"/></svg>';
  copy.append(node("b","example-head","How a mirror works"),node("span","explanation","Light comes from the left. This mirror sends it up."));
  demo.append(drawing,copy);
  function guide() {
    const answer=[0,0,1,1],i=angles.findIndex((v,j)=>v!==answer[j]);
    return i<0?null:{target:switches[i],text:"Tap mirror "+address(...mirrors[i])+" to send the light "+["up","right","down","right"][i]+"."};
  }
  panel.append(board,legend);root.append(demo,panel,status);host.replaceChildren(root);render();
  return {read,check,guide};
}

const shores=[
  {side:"west",label:"West of row 1",count:2,line:[0,1,2],row:1,col:0},
  {side:"east",label:"East of row 1",count:1,line:[2,1,0],row:1,col:4},
  {side:"south",label:"South of column A",count:2,line:[6,3,0],row:4,col:1}
];
const rows=[[0,1,2],[3,4,5],[6,7,8]], columns=[[0,3,6],[1,4,7],[2,5,8]];
function seen(line,heights) {
  let tallest=0,count=0;
  for(const index of line) {
    if(heights[index]>tallest){tallest=heights[index];count++;}
  }
  return count;
}
function miniature(height) {
  const hull='<path d="M3 37h32l-5 5H11z" fill="#b58768" stroke="#495c62" stroke-width="1.4"/><path d="M5 44q4-2 7 0t7 0 7 0 7 0" fill="none" stroke="#74a6b0" stroke-width="1.1"/>';
  let sails="";
  for(let i=0;i<height;i++) {
    const top=29-i*8;
    sails+='<path d="M18 '+top+'l-8 6h8zm3 0 5 5h-5z" fill="'+["#ffe2a4","#e2c28b","#edc184"][i]+'" stroke="#7e7563" stroke-width=".7"/>';
  }
  const tip=32-height*8;
  return '<svg viewBox="0 0 38 46" aria-hidden="true" focusable="false">'+hull+
    (height?'<path d="M19.5 37V'+tip+'" stroke="#4b5859" stroke-width="2"/><path d="M20 '+tip+'l7 2.6-7 2.3z" fill="#c97066"/>'+sails:'')+'</svg>';
}
function shoreDiagram() {
  const d=node("div","example");
  const strip=node("div","sample-ships");
  strip.setAttribute("aria-hidden","true");
  const eye=node("span","look");
  eye.innerHTML='<svg viewBox="0 0 30 23" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 11q10-13 20 0-10 13-20 0Z"/><circle cx="12" cy="11" r="3"/><path d="M22 11h6m-3-3 3 3-3 3"/></svg>';
  strip.append(eye);
  for(const [i,h] of [1,3,2].entries()) {
    const sample=node("span","sample");sample.innerHTML=miniature(h);
    sample.append(node("small","sample-number",String(h)));if(i===2)sample.classList.add("tl-hidden-mast");
    strip.append(sample);
  }
  const copy=node("div","example-copy");
  copy.append(node("b","example-head","How many can you see?"),node("span","explanation","Look from the left. The 3 hides the 2. You see two masts."));
  d.append(strip,copy);return d;
}
function skyline(host,saved,onChange) {
  const valid=Array.isArray(saved?.heights)&&saved.heights.length===9&&
    Array.from(saved.heights).every(n=>Number.isInteger(n)&&n>=0&&n<=3);
  const heights=valid?[...saved.heights]:Array(9).fill(0);
  let active=Number.isInteger(saved?.active)&&saved.active>=0&&saved.active<9?saved.active:0;
  const root=node("section","skyline");
  root.setAttribute("aria-label","Give each boat a mast");
  const board=node("div","harbour"), frame=node("div","sky-case");
  board.setAttribute("role","group");board.setAttribute("aria-label","Nine boats. Look from the three arrows.");
  function place(n,row,col) {n.style.gridRow=String(row+1);n.style.gridColumn=String(col+1);board.append(n);}
  const shoreSigns=shores.map(shore=>{
    const sign=node("div","shore");
    sign.dataset.shore=shore.side;sign.setAttribute("role","img");
    const arrow=node("span","look-direction",{west:"→",east:"←",south:"↑"}[shore.side]);
    arrow.setAttribute("aria-hidden","true");sign.append(node("b","shore-count",String(shore.count)),arrow);
    place(sign,shore.row,shore.col);return sign;
  });
  const read=()=>({heights:[...heights],active});
  const check=()=>heights.every(Boolean)&&[...rows,...columns].every(line=>new Set(line.map(i=>heights[i])).size===3)&&shores.every(s=>seen(s.line,heights)===s.count);
  const here=i=>address(i%3,Math.floor(i/3));
  const live=node("p","sr");live.setAttribute("role","status");
  const controls=node("div","height-tools"), label=node("strong","height-label"), palette=node("div","palette");
  palette.setAttribute("role","group");palette.setAttribute("aria-label","Set mast height");
  function choose(i) {
    if(i===active)return;
    active=i;render();onChange?.(read());
  }
  function setHeight(value,i=active) {
    const previous=active,old=heights[i];active=i;heights[i]=value;
    if(!old&&value) {
      for(let n=1;n<9;n++){
        const j=(i+n)%9;if(!heights[j]){active=j;break;}
      }
    }
    if(old===value&&active===previous)return;
    render();live.textContent=here(i)+(value?" is "+value+" high.":" is empty.")+(i!==active?" Next boat: "+here(active)+".":"");onChange?.(read());
  }
  const berths=heights.map((_,i)=>{
    const b=button("berth",()=>choose(i));
    b.dataset.berth=here(i).toLowerCase();
    b.addEventListener("keydown",e=>{
      const key=e.key;
      if(["1","2","3","Delete","Backspace"].includes(key)){
        e.preventDefault();setHeight(["Delete","Backspace"].includes(key)?0:Number(key),i);berths[active].focus();return;
      }
      const x=i%3,y=Math.floor(i/3),shift={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[key];
      if(shift){e.preventDefault();const nx=x+shift[0],ny=y+shift[1];if(nx>=0&&nx<3&&ny>=0&&ny<3){const j=ny*3+nx;choose(j);berths[j].focus();}}
    });
    place(b,Math.floor(i/3)+1,i%3+1);return b;
  });
  const keys=[1,2,3].map(n=>{
    const b=button("height-key",()=>setHeight(n));b.dataset.height=String(n);
    b.setAttribute("aria-label","Set mast height to "+n);b.textContent=String(n);palette.append(b);return b;
  });
  function render(){
    berths.forEach((b,i)=>{
      const h=heights[i];
      b.setAttribute("aria-pressed",String(active===i));b.setAttribute("aria-label","Boat "+here(i)+". "+(h?"Mast height "+h:"No mast yet")+". Tap to choose.");
      b.innerHTML='<span class="tl-coordinate">'+here(i)+'</span>'+miniature(h)+'<b class="tl-height-value">'+(h||"·")+'</b>';
    });
    shoreSigns.forEach((sign,i)=>{
      const s=shores[i],filled=s.line.every(j=>heights[j]),actual=seen(s.line,heights);
      sign.classList.toggle("tl-matched",filled&&actual===s.count);
      sign.setAttribute("aria-label",s.label+". The arrow wants "+s.count+(s.count===1?" mast.":" masts.")+(filled?" You can see "+actual+".":""));
    });
    label.textContent="Choose a height for "+here(active);
    keys.forEach((b,i)=>b.setAttribute("aria-pressed",String(heights[active]===i+1)));
  }
  controls.append(label,palette);frame.append(board,controls);root.append(shoreDiagram(),frame,live);host.replaceChildren(root);render();
  function guide() {
    const answer=[2,1,3,3,2,1,1,3,2];
    const i=heights[active]!==answer[active]?active:heights.findIndex((v,j)=>v!==answer[j]);
    if(i<0)return null;
    return i===active?{target:keys[answer[i]-1],text:"Tap "+answer[i]+" for boat "+here(i)+"."}:{target:berths[i],text:"Tap boat "+here(i)+"."};
  }
  return {read,check,guide};
}

export const lightRooms=[
  {
    id:"prismwatch",title:"The Prism Watch",place:"Pumpkin Castle Lighthouse",art:"castle",boardTitle:"The lighthouse mirrors",
    brief:"The little whale is lost in the fog. Help Ruby light the striped lighthouse so the whale can see it.",
    clue:"Tap a mirror to turn it. Send the light through the crystal at C2. Then aim the blue light at the lighthouse at E5.",
    hints:[
      "Start at the lamp on the left. Follow the yellow line to the first mirror.",
      "B4 should send light up. B2 should send it right, through the crystal.",
      "From Reset, tap B4 once. Tap D2 once. Tap D5 once."
    ],
    miss:"The lighthouse is still dark. Follow the light to see where it stops.",
    reward:{symbol:"prism",name:"Prism Bearing"},
    reply:"The blue light shines through the fog. The little whale sends up a spout. Ruby marks the spot on her map.",
    journalNote:"The blue light helped the whale see through the fog.",create:optics
  },
  {
    id:"skyline",title:"The Harbour Skyline",place:"Treehouse Harbour",art:"canopy",boardTitle:"The harbour berths",
    brief:"Ruby spots nine boats from the treehouse. Help her put the right mast on each boat.",
    clue:"Tap a boat. Pick a height. Use 1, 2 and 3 once across each row and down each column. Each arrow tells how many masts you should see from that side.",
    hints:[
      "Look at the 1 on the right. A tall mast at C1 can hide the whole row.",
      "Put 3 at C1. Try 2, then 1 in front of it. How many can you see from the left?",
      "From Reset, fill the top row with 2, 1, 3. Use 3, 2, 1 in the middle. Use 1, 3, 2 at the bottom."
    ],
    miss:"Look along one row. Can you find a 1, a 2 and a 3? Then try one arrow.",
    reward:{symbol:"mast",name:"Mast Bearing"},
    reply:"Ruby looks past the tallest mast. There’s the little whale! She draws a safe path out of the harbour.",
    journalNote:"Ruby found a safe path past the boats.",create:skyline
  }
];
