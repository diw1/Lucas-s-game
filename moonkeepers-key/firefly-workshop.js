function element(tag, name, text) {
  const node=document.createElement(tag);
  node.className="fw-"+name;
  if(text!==undefined)node.textContent=text;
  return node;
}
function key(name, text, run) {
  const b=element("button",name,text);
  b.type="button";b.addEventListener("click",run);
  return b;
}
function savedUndo(saved,validate) {
  return Array.isArray(saved?.undo)?saved.undo.slice(-24).filter(validate).map(v=>[...v]):[];
}
function remember(history,frame) {
  history.push([...frame]);if(history.length>24)history.shift();
}
const parts=[
  {id:"beak",name:"Beak",poses:["up","straight","down"]},
  {id:"wing",name:"Wing",poses:["up","out","down"]},
  {id:"tail",name:"Tail",poses:["up","straight","down"]}
];
const startingPose=[1,2,0],castingPose=[0,0,2];
const same=(a,b)=>a.every((v,i)=>v===b[i]);
const validPose=p=>Array.isArray(p)&&p.length===3&&Array.from(p).every(v=>Number.isInteger(v)&&v>=0&&v<=2);
const poseNames=p=>parts.map((v,i)=>v.name+" "+v.poses[p[i]]).join(", ");
function bird(p) {
  const [beak,wing,tail]=p;
  return '<svg viewBox="0 0 120 88" aria-hidden="true" focusable="false">'+
    '<g fill="#303440" stroke="#303440" stroke-linecap="round" stroke-linejoin="round">'+
    '<path d="m52 65-3 11-5 2m5-2 4 2m13-15-1 12-4 2m4-2 5 2" fill="none" stroke-width="2.4"/>'+
    '<path d="m38 51-22-9 3 7-13-2q3 7 12 10l-9 3 28 4z" transform="rotate('+[32,0,-32][tail]+' 37 57)"/>'+
    '<path d="m87 39 22 6-20 5z" transform="rotate('+[-32,0,30][beak]+' 89 45)"/>'+
    '<path d="M32 54q1-16 26-17 7 0 12 3 2-13 14-11 13 2 11 17-1 11-13 16-13 13-31 9-12-2-19-12Z"/>'+
    '<path d="M61 56Q43 39 42 12l10 12-1-9q7 7 12 18l2-8q7 16 3 28z" transform="rotate('+[0,-53,-101][wing]+' 62 54)"/></g>'+
    '<circle cx="85" cy="38" r="2.3" fill="#f0dcaf"/></svg>';
}
function shadowFigure(label) {
  const fig=element("figure","screen"),art=element("div","shadow");
  art.setAttribute("role","img");fig.append(art,element("figcaption","screen-label",label));return{fig,art};
}
function shadowExample() {
  const box=element("div","example"),sample=element("div","bird-example");
  sample.setAttribute("aria-hidden","true");
  sample.innerHTML=bird([1,2,1])+'<span>›</span>'+bird([1,0,1]);
  const copy=element("div","example-copy");
  copy.append(element("strong","example-title","One tap moves one part"),element("span","example-text","Tap Wing. The wing flips up. The tail stays still."));
  box.append(sample,copy);return box;
}
function shadowStage(host,saved,onChange) {
  let pose=validPose(saved?.pose)?[...saved.pose]:[...startingPose];
  const history=savedUndo(saved,validPose);
  const root=element("section","workshop");root.setAttribute("aria-label","Pose the bird puppet");
  const theatre=element("div","theatre"),playbill=shadowFigure("Match this shadow"),myBird=shadowFigure("Your puppet");
  playbill.art.innerHTML=bird(castingPose);playbill.art.setAttribute("aria-label","Shadow to match. "+poseNames(castingPose)+".");
  theatre.append(playbill.fig,myBird.fig);
  const controls=element("div","joints"),actions=element("div","actions"),live=element("p","notice");
  live.setAttribute("role","status");
  const read=()=>({pose:[...pose],undo:history.map(p=>[...p])});
  const check=()=>same(pose,castingPose);
  const jointButtons=parts.map((part,i)=>{
    const b=key("joint",undefined,()=>{
      remember(history,pose);pose[i]=(pose[i]+1)%3;
      render();live.textContent=part.name+" "+part.poses[pose[i]]+".";onChange?.(read());
    });
    b.dataset.joint=part.id;b.append(element("b","joint-title",part.name),element("span","current-pose"));controls.append(b);return b;
  });
  const undo=key("undo","Undo",()=>{
    if(!history.length)return;
    pose=history.pop();render();live.textContent="Last move undone.";onChange?.(read());
    if(undo.disabled)jointButtons[0].focus();
  });
  undo.dataset.shadowUndo="";
  function render() {
    myBird.art.innerHTML=bird(pose);myBird.art.setAttribute("aria-label","Your puppet. "+poseNames(pose)+".");
    jointButtons.forEach((b,i)=>{
      const part=parts[i];b.lastElementChild.textContent=part.poses[pose[i]];
      b.setAttribute("aria-label",part.name+" is "+part.poses[pose[i]]+". Tap for "+part.poses[(pose[i]+1)%3]+".");
    });
    undo.disabled=!history.length;
  }
  function guide() {
    const i=[1,0,2].find(i=>pose[i]!==castingPose[i]);
    return i===undefined?null:{target:jointButtons[i],text:"Tap "+parts[i].name+" once."};
  }
  actions.append(live,undo);
  root.append(shadowExample(),theatre,controls,actions);host.replaceChildren(root);render();return{read,check,guide};
}

const bells={
  leaf:{name:"Leaf",fill:"#a6c8a2",mark:'<path d="M15 21q-2-9 9-12 0 11-9 12Zm0 0 6-8"/>'},
  moon:{name:"Moon",fill:"#c4bedf",mark:'<path d="M22 11a6.3 6.3 0 1 0 2 10 6.5 6.5 0 0 1-2-10Z"/>'},
  sun:{name:"Sun",fill:"#ebba72",mark:'<circle cx="19" cy="17" r="3"/><path d="M19 10v2m0 10v2m-7-7h2m10 0h2m-12-5 1.5 1.5m7 7 1.5 1.5m0-10-1.5 1.5m-7 7L14 22"/>'}
};
const strips=[["leaf","moon","sun"],["sun","moon","leaf"]];
const bakers=["Rose","Pip"];
const tune=strips[0].flatMap((_,i)=>[strips[0][i],strips[1][i]]);
function bell(id) {
  const choice=bells[id];
  return '<svg viewBox="0 0 38 34" aria-hidden="true" focusable="false"><g stroke="#584e45" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">'+
    '<path d="M16 6q0-6 3-5t3 5" fill="none"/><path d="M15 28q0 8 5 5 2-1 2-5" fill="#c59655"/>'+
    '<path d="M4 27q5-4 6-13T19 5t9 9q1 9 6 13-15 5-30 0Z" fill="'+choice.fill+'"/><path d="M5 26q14 4 28 0" fill="none"/>'+
    '<g fill="none" stroke-width="1.6">'+choice.mark+'</g></g></svg>';
}
function validKit(v) {
  return Array.isArray(v)&&v.length===6&&Array.from(v).every(x=>x===null||(typeof x==="string"&&Object.hasOwn(bells,x)));
}
function validFrame(frame) {
  return Array.isArray(frame)&&frame.length===7&&Number.isInteger(frame[6])&&frame[6]>=0&&frame[6]<6&&validKit(frame.slice(0,6));
}
function bellExample() {
  const box=element("div","example"),pair=element("div","example-pair");
  pair.setAttribute("aria-hidden","true");
  for(const [i,id] of ["moon","leaf"].entries()) {
    const n=element("span","sample-bell");n.innerHTML=bell(id);
    n.append(element("small","baker-tag",bakers[i]));pair.append(n);
  }
  const copy=element("div","example-copy");
  copy.append(element("strong","example-title","Take turns"),element("span","example-text","If Rose has Moon and Pip has Leaf, thread Moon first. Then thread Leaf."));
  box.append(pair,copy);return box;
}
function bellChoir(host,saved,onChange) {
  let slots=validKit(saved?.slots)?[...saved.slots]:Array(6).fill(null);
  let active=Number.isInteger(saved?.active)&&saved.active>=0&&saved.active<6?saved.active:0;
  const history=savedUndo(saved,validFrame);
  const root=element("section","workshop");root.setAttribute("aria-label","Make the bakers’ bell chain");
  const recipe=element("div","recipe");recipe.setAttribute("role","group");recipe.setAttribute("aria-label","Read each baker’s bells from the left");
  strips.forEach((strip,row)=>{
    const line=element("div","baker-line");
    line.setAttribute("role","img");line.setAttribute("aria-label",bakers[row]+"’s row, left to right: "+strip.map(id=>bells[id].name).join(", ")+".");
    line.append(element("b","baker",bakers[row]));
    for(const id of strip){const n=element("span","recipe-bell");n.innerHTML=bell(id);line.append(n);}
    recipe.append(line);
  });
  const bench=element("div","bench"),chain=element("div","chain");
  chain.setAttribute("role","group");chain.setAttribute("aria-label","Your six bells. Tap a space to change it.");
  const info=element("div","chain-info"),label=element("b","chain-title"),live=element("p","notice");
  live.setAttribute("role","status");
  const read=()=>({slots:[...slots],active,undo:history.map(p=>[...p])});
  const check=()=>same(slots,tune);
  const places=slots.map((_,i)=>{
    const b=key("place",undefined,()=>{
      if(active===i)return;active=i;render();onChange?.(read());
    });
    b.dataset.bellSlot=String(i);chain.append(b);return b;
  });
  const palette=element("div","bells"),keys={};
  for(const [id,choice] of Object.entries(bells)) {
    const b=key("bell",undefined,()=>{
      const old=active;
      if(slots[old]===id)return;
      remember(history,[...slots,active]);slots[old]=id;
      const empty=slots.findIndex((v,i)=>v===null&&i>old);
      const first=slots.indexOf(null);
      if(empty>=0)active=empty;else if(first>=0)active=first;
      render();live.textContent="Bell "+(old+1)+" is "+choice.name+".";onChange?.(read());
    });
    b.innerHTML=bell(id);b.append(element("span","bell-name",choice.name));b.dataset.bell=id;
    b.setAttribute("aria-label","Thread the "+choice.name+" bell");keys[id]=b;palette.append(b);
  }
  const undo=key("undo","Undo",()=>{
    if(!history.length)return;
    const frame=history.pop();slots=frame.slice(0,6);active=frame[6];render();
    live.textContent="Last bell undone.";onChange?.(read());if(undo.disabled)places[active].focus();
  });
  undo.dataset.bellUndo="";
  function render(){
    places.forEach((b,i)=>{
      const id=slots[i];b.setAttribute("aria-pressed",String(i===active));
      b.setAttribute("aria-label","Space "+(i+1)+", "+(id?bells[id].name:"empty")+". Tap to change.");
      b.replaceChildren();
      if(id)b.innerHTML=bell(id);else b.append(element("span","ring"));
      b.append(element("small","space-number",String(i+1)));
    });
    label.textContent="Choose bell "+(active+1);undo.disabled=!history.length;
  }
  function guide() {
    const i=slots[active]!==tune[active]?active:slots.findIndex((v,i)=>v!==tune[i]);
    if(i<0)return null;
    return i===active?{target:keys[tune[i]],text:"Tap the "+bells[tune[i]].name+" bell."}:{target:places[i],text:"Tap space "+(i+1)+"."};
  }
  info.append(label,undo);bench.append(chain,info,palette);
  root.append(bellExample(),recipe,bench,live);host.replaceChildren(root);render();return{read,check,guide};
}

export const workshopFireflyRooms=[
  {
    id:"shadowstage",title:"The Shadow Bird",place:"Starlight Stage",art:"stage",boardTitle:"The puppet theatre",
    brief:"The fireflies are ready for the show. Help Ruby make her paper bird look like the shadow on the curtain.",
    clue:"Look at the bird on the left. Tap Beak, Wing or Tail to move one part of your bird. Match all three parts.",
    hints:["Start with the wing. Where does the tip point on the left bird?","The target bird has its wing up and its tail down. Check its beak too.","From Reset, tap Wing once. Tap Beak twice. Tap Tail twice."],
    miss:"One part still looks different. Compare the two birds from beak to tail.",
    reward:{symbol:"star",name:"Star lantern"},
    reply:"The paper bird spreads its wing. Fireflies land on the screen like tiny stars. Ruby lights the Star lantern.",
    journalNote:"A paper bird danced in the Star lantern’s light.",create:shadowStage
  },
  {
    id:"bellchoir",title:"The Bakers’ Bell Chain",place:"Bunny Bakery",art:"bakery",boardTitle:"The bell string",
    brief:"Rose and Pip brought bells for the bakery door. Help Ruby string them up for the festival.",
    clue:"Read both rows from the left. Take one bell from Rose. Take one from Pip. Keep taking turns.",
    hints:["Your first bell is Rose’s first bell. Your second is Pip’s first bell.","Now take the next bell from each row. Both have a Moon in the middle.","From Reset, tap Leaf, Sun, Moon. Then tap Moon, Sun, Leaf."],
    miss:"Check the bells in pairs. Take Rose’s bell first and Pip’s bell second.",
    reward:{symbol:"bell",name:"Bell lantern"},
    reply:"The bakery door swings open. Six little bells ring, and fireflies dart through the doorway. Pip hands Ruby the Bell lantern.",
    journalNote:"Rose and Pip took turns filling the Bell lantern’s string.",create:bellChoir
  }
];
