export const lanternCards=[
  {id:"leaf",name:"Leaf",mark:"Shell · Drop",left:"Shell",right:"Drop"},
  {id:"apple",name:"Apple",mark:"Sun · Drop",left:"Sun",right:"Drop"},
  {id:"star",name:"Star",mark:"Heart · Moon",left:"Heart",right:"Moon"},
  {id:"bell",name:"Bell",mark:"Heart · Cloud",left:"Heart",right:"Cloud"},
  {id:"flower",name:"Flower",mark:"Shell · Cloud",left:"Shell",right:"Cloud"}
];
const cardsById=new Map(lanternCards.map(card=>[card.id,card]));
const symbols={
  Shell:'<path d="M10 20 3 12q-1-3 2-4 0-3 3-3 2-3 4-1 3-2 5 1 3 0 3 3 3 1 1 5l-7 7Z"/><path d="m10 17-4-7m6 7V6m2 11 4-7"/>',
  Drop:'<path d="M12 2C10 7 4.5 11 4.5 15a7.5 7.5 0 0 0 15 0C19.5 11 14 7 12 2Z"/><path d="M8.3 15q0 3 2.8 3.7"/>',
  Sun:'<circle cx="12" cy="12" r="5.1"/><path d="M12 1.5v3m0 15v3m10.5-10.5h-3m-15 0h-3M4.5 4.5l2.1 2.1m10.8 10.8 2.1 2.1M19.5 4.5l-2.1 2.1M6.6 17.4l-2.1 2.1"/>',
  Heart:'<path d="M12 21S2.2 15.5 2.2 8.8c0-5 6-7.5 9.8-2.8 3.8-4.7 9.8-2.2 9.8 2.8C21.8 15.5 12 21 12 21Z"/>',
  Moon:'<path d="M18.9 18.4A9.5 9.5 0 0 1 9 2.7a9.5 9.5 0 1 0 11.7 14.8z"/>',
  Cloud:'<path d="M6 19h12a4.4 4.4 0 0 0 .4-8.8 6.3 6.3 0 0 0-12-1.3A5.1 5.1 0 0 0 6 19Z"/>',
  Daisy:'<g fill="#fff0ca" stroke="#87754a"><ellipse cx="12" cy="6.8" rx="2.8" ry="5.1"/><ellipse cx="12" cy="17.2" rx="2.8" ry="5.1"/><ellipse cx="7.5" cy="9.4" rx="2.8" ry="5.1" transform="rotate(-60 7.5 9.4)"/><ellipse cx="16.5" cy="14.6" rx="2.8" ry="5.1" transform="rotate(-60 16.5 14.6)"/><ellipse cx="16.5" cy="9.4" rx="2.8" ry="5.1" transform="rotate(60 16.5 9.4)"/><ellipse cx="7.5" cy="14.6" rx="2.8" ry="5.1" transform="rotate(60 7.5 14.6)"/></g><circle cx="12" cy="12" r="3.1" fill="#e7af43"/>',
  Tulip:'<path fill="#849b64" stroke="#5f7754" d="M12 14v8m0-2q-5 .4-6.5-4.2 4.3.2 6.5 3.5"/><path d="M4.6 3.6 9 7.2 12 2l3 5.2 4.4-3.6v5.1a7.4 7.4 0 0 1-14.8 0Z"/>',
  Bluebell:'<path fill="none" stroke="#536f4d" d="M4 22q9-4 8-14 0-5 4-5 2 0 2 3"/><path d="M17 5q-5 .5-5.2 5.4-.4 2.7-2.4 5 1.7 2 4 .8 1.5 2.4 3.7.7 2.4 1.4 3.8-.6 2 .3 2.2-1.2-2.4-2-2.3-5Q21 6 17 5Z"/>'
};
function pict(word) {
  return '<span class="fp-pict" data-pict="'+word+'"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">'+symbols[word]+'</svg><span class="fp-pict-name">'+word+'</span></span>';
}
function ends(card,flip) {return flip?[card.right,card.left]:[card.left,card.right];}
export function lanternPair(card,flipped=false) {
  const [left,right]=ends(card,flipped);
  return '<span class="fp-pair" role="img" aria-label="'+left+' on the left, '+right+' on the right">'+pict(left)+pict(right)+'</span>';
}
function el(tag,cls,text) {
  const out=document.createElement(tag);out.className="fp-"+cls;
  if(text!==undefined)out.textContent=text;
  return out;
}
function button(cls,handler) {
  const out=el("button",cls);out.type="button";out.addEventListener("click",handler);return out;
}
function labelGroup(out,name) {out.setAttribute("role","group");out.setAttribute("aria-label",name);}
const garden=[
  ["Daisy","Tulip","Daisy"],
  ["Bluebell","Daisy","Tulip"],
  ["Daisy","Tulip","Tulip"]
];
const flowerWords=["Daisy","Tulip","Bluebell"], gardenAnswer=["A2","C1","B3"];
const cellId=(x,y)=>"ABC"[x]+(y+1);
const firefly='<svg class="fp-bug" aria-hidden="true" focusable="false" viewBox="0 0 27 23"><g stroke="#413a43" stroke-width="1.2"><path d="M13 12q-8-11-10-5-1 4 9 7m2-1q9-10 10-4 .5 4-10 5" fill="#c6e9d9"/><path d="M12 11q-5 3-3 7t6 1q3-4-1-7Z" fill="#ffda54"/><circle cx="14" cy="10" r="2.8" fill="#53464b"/><path d="m14 8-1-3m2 3 2-2" fill="none"/></g></svg>';
function makeGarden(host,saved,onChange) {
  const root=el("section","board"), patch=el("div","patch"), bed=el("div","bed");
  const cellButtons=new Map(), petals=new Map(), rowCounts=[],colCounts=[],picked=new Set();
  if(Array.isArray(saved?.flies))for(const id of saved.flies) {
    if(typeof id==="string" && /^[A-C][1-3]$/.test(id) && picked.size<3)picked.add(id);
  }
  const read=()=>({flies:[...picked]});
  const title=el("div","garden-head"), count=el("span","fly-count");
  title.append(el("h3","title","The firefly garden"),count);
  patch.append(title,el("p","instructions","Tap a flower for each firefly. Tap it again to lift the bug."));
  labelGroup(bed,"Flower beds. Put one firefly in each row and each column.");
  bed.append(el("span","corner","↓"));
  for(let x=0;x<3;x++){const tag=el("span","total");bed.append(tag);colCounts.push(tag);}
  for(let y=0;y<3;y++) {
    const tag=el("span","total");bed.append(tag);rowCounts.push(tag);
    for(let x=0;x<3;x++) {
      const id=cellId(x,y),word=garden[y][x];
      const b=button("flower-cell",()=>{
        if(picked.has(id))picked.delete(id);
        else if(picked.size<3)picked.add(id);
        else {live.textContent="All three bugs are out. Tap a lit flower to lift one.";return;}
        paint();
        live.textContent=picked.has(id)?"A firefly is on "+word+" at "+id+".":"You lifted the firefly at "+id+".";
        onChange?.(read());
      });
      b.dataset.flowerCell=id;
      b.innerHTML='<span class="fp-coordinate">'+id+'</span>'+pict(word)+firefly;
      b.setAttribute("aria-label",word+" at "+id);cellButtons.set(id,b);bed.append(b);
    }
  }
  const key=el("div","flower-key");labelGroup(key,"One firefly on each kind of flower");
  for(const word of flowerWords) {
    const item=el("span","flower-tally"),tally=el("b","flower-count");
    item.innerHTML=pict(word);item.append(tally);petals.set(word,{item,tally});key.append(item);
  }
  const directions=el("p","row-key","One bug in each row → and each column ↓. One on each kind of flower.");
  const live=el("p","status");live.setAttribute("role","status");
  const tallies=()=>{
    const rows=[0,0,0],cols=[0,0,0],flowers={Daisy:0,Tulip:0,Bluebell:0};
    for(const id of picked) {
      const x="ABC".indexOf(id[0]),y=Number(id[1])-1;
      rows[y]++;cols[x]++;flowers[garden[y][x]]++;
    }
    return {rows,cols,flowers};
  };
  function paint() {
    const {rows,cols,flowers}=tallies();
    count.textContent=picked.size+" / 3 bugs";
    for(const [id,b] of cellButtons)b.setAttribute("aria-pressed",String(picked.has(id)));
    const meter=(tag,n,side,index)=>{
      tag.textContent=(side==="row"?"→ ":"↓ ")+n+"/1";tag.dataset.count=String(n);
      tag.setAttribute("aria-label",side+" "+index+", "+n+" of 1 bug");
    };
    rowCounts.forEach((tag,i)=>meter(tag,rows[i],"row",i+1));colCounts.forEach((tag,i)=>meter(tag,cols[i],"column","ABC"[i]));
    for(const [word,{item,tally}] of petals) {item.dataset.count=String(flowers[word]);tally.textContent=flowers[word]+"/1";}
  }
  const check=()=>{
    const {rows,cols,flowers}=tallies();
    return [...rows,...cols,...Object.values(flowers)].every(n=>n===1);
  };
  function guide(){
    const extra=[...picked].find(id=>!gardenAnswer.includes(id));
    if(extra)return {target:cellButtons.get(extra),text:"Tap "+extra+" to lift that firefly."};
    const missing=gardenAnswer.find(id=>!picked.has(id));
    return missing?{target:cellButtons.get(missing),text:"Tap the "+garden[Number(missing[1])-1]["ABC".indexOf(missing[0])].toLowerCase()+" at "+missing+"."}:null;
  }
  patch.append(directions,bed,key,live);root.append(patch);host.replaceChildren(root);paint();
  return {read,check,guide};
}

const lineAnswer=[["star",true],["bell",false],["flower",true],["leaf",false],["apple",true]];
function makeLine(host,saved,onChange) {
  const root=el("section","board"), workshop=el("div","workshop");
  const slots=lanternCards.map(()=>null), flipped=new Set();
  if(Array.isArray(saved?.hooks))saved.hooks.slice(0,5).forEach((id,i)=>{
    if(cardsById.has(id) && !slots.includes(id))slots[i]=id;
  });
  if(Array.isArray(saved?.flipped))for(const id of saved.flipped)if(cardsById.has(id))flipped.add(id);
  let active=Math.max(0,slots.indexOf(null)),flipAt=slots[active]?active:slots.findIndex(Boolean);
  const read=()=>({hooks:[...slots],flipped:[...flipped]});
  const orient=id=>ends(cardsById.get(id),flipped.has(id));
  const match=i=>{
    const before=i===0?"Moon":(slots[i-1]&&orient(slots[i-1])[1]);
    const after=i===slots.length?"Sun":(slots[i]&&orient(slots[i])[0]);
    return !!before && before===after;
  };
  const check=()=>slots.every(Boolean) && [0,1,2,3,4,5].every(match);
  const heading=el("div","line-head"),example=el("div","match-example");
  example.innerHTML=pict("Heart")+'<b aria-hidden="true">↔</b>'+pict("Heart");
  example.append(el("span","example-label","Two hearts match."));
  heading.append(el("h3","title","The lantern line"),example);
  const rail=el("div","rail"), anchors=el("div","anchors"), hooks=el("div","hooks");
  for(const [pos,word] of [["Start","Moon"],["End","Sun"]]) {
    const anchor=el("span","anchor");anchor.innerHTML=pict(word);anchor.prepend(el("small","anchor-word",pos));anchors.append(anchor);
  }
  labelGroup(hooks,"Five hooks from Moon on the left to Sun on the right");
  const hookBtns=slots.map((_,i)=>{
    const b=button("hook",()=>{active=i;flipAt=slots[i]?i:-1;paint();live.textContent="Hook "+(i+1)+". Tap a lantern below.";});
    b.dataset.hook=String(i+1);hooks.append(b);return b;
  });
  const basket=el("div","basket");labelGroup(basket,"Lanterns to hang or move");
  const cardButtons=new Map();
  for(const card of lanternCards) {
    const b=button("lantern",()=>{
      const target=active,old=slots.indexOf(card.id);
      // Moving a hung lantern to a full hook trades their places.
      if(old!==-1 && old!==target)slots[old]=slots[target];
      slots[target]=card.id;flipAt=target;
      const empty=slots.indexOf(null);if(empty!==-1)active=empty;
      paint();
      live.textContent=card.name+" hangs on hook "+(target+1)+".";
      onChange?.(read());
    });
    b.dataset.lantern=card.id;cardButtons.set(card.id,b);basket.append(b);
  }
  const flip=button("flip",()=>{
    if(flipAt<0 || !slots[flipAt])return;
    const id=slots[flipAt];
    if(flipped.has(id))flipped.delete(id);else flipped.add(id);
    paint();live.textContent=cardsById.get(id).name+" is now "+orient(id).join(" then ")+".";
    onChange?.(read());
  });
  flip.dataset.flip="";
  const edit=el("div","edit"), preview=el("div","preview"),live=el("p","status");
  live.setAttribute("role","status");edit.append(preview,flip);
  const rackTitle=el("h4","rack-title");
  function paint() {
    const filled=slots.every(Boolean);
    hookBtns.forEach((b,i)=>{
      const id=slots[i],card=cardsById.get(id);
      b.setAttribute("aria-pressed",String(i===active));
      b.setAttribute("aria-label","Hook "+(i+1)+", "+(id?card.name+" lantern, "+orient(id).join(" then "):"empty"));
      b.classList.toggle("fp-joins",match(i));b.classList.toggle("fp-last-joins",i===4&&match(5));
      b.dataset.card=id||"";
      b.replaceChildren(el("span","hook-label",String(i+1)));
      if(card)b.insertAdjacentHTML("beforeend",lanternPair(card,flipped.has(id)));
      else b.append(el("span","empty","＋"));
    });
    for(const [id,b] of cardButtons) {
      const card=cardsById.get(id),i=slots.indexOf(id);
      b.innerHTML=lanternPair(card,flipped.has(id));
      b.prepend(el("span","card-name",card.name));
      b.append(el("small","card-hook",i===-1?"In basket":"Hook "+(i+1)));
      b.setAttribute("aria-label",card.name+" lantern, "+orient(id).join(" then ")+". Hang on hook "+(active+1)+".");
    }
    const id=flipAt<0?null:slots[flipAt];
    flip.disabled=!id;flip.textContent=id?"↔ Flip hook "+(flipAt+1):"↔ Flip";
    preview.replaceChildren();
    if(id) {
      preview.append(el("strong","preview-title","Hook "+(flipAt+1)+" · "+cardsById.get(id).name));
      preview.insertAdjacentHTML("beforeend",lanternPair(cardsById.get(id),flipped.has(id)));
    } else preview.append(el("span","preview-title","Tap a hung lantern to turn it."));
    rackTitle.textContent=(filled?"Move a lantern to hook ":"Pick a lantern for hook ")+(active+1);
  }
  function guide() {
    const i=lineAnswer.findIndex(([id,turn],i)=>slots[i]!==id || flipped.has(id)!==turn);
    if(i===-1)return null;
    const [id]=lineAnswer[i];
    if(slots[i]===id && flipAt===i)return {target:flip,text:"Tap Flip hook "+(i+1)+"."};
    if(active!==i || slots[i]===id)return {target:hookBtns[i],text:"Tap hook "+(i+1)+" on the line."};
    return {target:cardButtons.get(id),text:"Tap the "+cardsById.get(id).name+" lantern."};
  }
  rail.append(anchors,hooks);
  workshop.append(heading,el("p","instructions","Hang a lantern on each hook. Match the pictures that touch. Tap Flip to turn a lantern."),rail,edit,rackTitle,basket,live);
  root.append(workshop);host.replaceChildren(root);paint();
  return {read,check,guide};
}

export const paradeFireflyRooms=[
  {
    id:"flowerpatch",title:"Three Little Fireflies",place:"The Treehouse Garden",art:"canopy",boardTitle:"Light the flowers",
    brief:"Three fireflies slip into the garden. Each one wants its own row and its own kind of flower.",
    clue:"Give each row and each column one bug. Put one on a daisy, one on a tulip and one on a bluebell.",
    hints:["Look for the bluebell. There is only one. Tap it for your first bug.",
      "The bluebell takes row 2 and column A. Find the daisy outside that row and column.",
      "Tap the bluebell at A2, the daisy at C1 and the tulip at B3. Tap any extra bug to lift it."],
    reward:{symbol:"flower",name:"Flower Lantern"},reply:"Three tiny lights blink on. The kitten picks up the Flower Lantern and follows them home.",
    miss:"Look for a count of 0 or 2. Tap a lit flower to lift its bug, then tap a new flower.",journalNote:"Flower has a Shell at one end and a Cloud at the other.",create:makeGarden
  },
  {
    id:"lanternline",title:"A Line of Lights",place:"The Treehouse Bridge",art:"hollow",boardTitle:"Hang the five lanterns",
    brief:"A rope runs between the two treehouse doors. Five lanterns lie in the kitten’s basket. Can you light the rope from Moon to Sun?",
    clue:"Start with Moon on the left. Make each pair of pictures touch its twin. Finish with Sun on the right.",
    hints:["Find the lantern with a moon. Hang it on hook 1. Flip it until the moon is on the left.",
      "After Moon comes Heart. Find the next Heart in the basket. Then match Cloud to Cloud.",
      "Hang Star, Bell, Flower, Leaf, Apple. Read the pictures from the left: Moon, Heart, Cloud, Shell, Drop, Sun. Flip any lantern that faces the wrong way."],
    reward:{symbol:"firefly",name:"The Firefly Festival"},reply:"One light, two lights, then five! Fireflies dance along the rope. At both treehouse doors, small paws clap.",
    miss:"Start at Moon. Look at the two pictures where each lantern meets the next one. Tap a hook to move or flip its lantern.",
    journalNote:"Five lanterns lit the bridge from Moon to Sun.",create:makeLine
  }
];
