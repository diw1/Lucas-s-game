const chimes = [
  {id:"dew", name:"Dew", mark:"First", beats:[1]},
  {id:"brook", name:"Brook", mark:"Last pair", beats:[2,3]},
  {id:"bell", name:"Bell", mark:"Ends", beats:[1,3]},
  {id:"ribbon", name:"Ribbon", mark:"First pair", beats:[1,2]},
  {id:"beacon", name:"Beacon", mark:"Last", beats:[3]}
];
export const chimeMarks = chimes;

const couriers = [
  {id:"whale", name:"Whale"},
  {id:"turtle", name:"Turtle"},
  {id:"crab", name:"Crab"},
  {id:"fish", name:"Clownfish"}
];

function element(tag, cls, text) {
  const out = document.createElement(tag);
  out.className = "dt-" + cls;
  if (text !== undefined) out.textContent = text;
  return out;
}
function action(cls, label, handler) {
  const b = element("button", cls);
  b.type = "button";
  b.setAttribute("aria-label", label);
  b.addEventListener("click", handler);
  return b;
}
function table(caption) {
  const t = element("table","table");
  t.append(element("caption","accessible",caption));
  return t;
}
function heading(text, scope) {
  const h = element("th","th",text);
  h.scope = scope;
  return h;
}
function shellStamp() {
  return '<svg viewBox="0 0 24 20" focusable="false" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M10 17 3 11c-3-4 0-7 3-6 0-3 4-4 6-2 2-3 6-2 6 1 3-1 6 2 3 6l-7 7Zm1-2L6 7m6 8V5m1 10 5-8"/><path d="M10 17h4v1h-4z"/></svg>';
}

function makeCourier(host, saved, onChange) {
  const shell = element("section","box dt-courier");
  shell.setAttribute("aria-label","Shell parcel manifest");
  const notes = element("div","tide-note");
  notes.append(element("h3","note-head","Three notes from the dock"));
  const lines = element("ul","notes");
  for (const line of [
    "Whale’s parcel had twice as many shells as Clownfish’s.",
    "Turtle counted more shells than Crab.",
    "Whale counted more shells than Turtle."
  ]) lines.append(element("li","note",line));
  notes.append(lines);

  const sheet = element("div","manifest");
  const legend = element("div","manifest-head");
  legend.append(element("h3","machine-title","Shell tally"), element("span","paper-label","Parcels 1–4"));
  const grid = table("Choose one parcel for each courier, using each shell count once.");
  const head = grid.createTHead().insertRow();
  head.append(heading("Courier","col"));
  for (let n=1; n<=4; n++) {
    const h = heading("","col");
    h.innerHTML = shellStamp();
    h.append(element("span","parcel-size",String(n)));
    h.setAttribute("aria-label","Parcel with " + n + (n===1?" shell":" shells"));
    head.append(h);
  }
  const body = grid.createTBody();
  const assigned = couriers.map(() => 0);
  if (Array.isArray(saved?.parcels)) {
    const taken = new Set();
    couriers.forEach((_,i) => {
      const n = saved.parcels[i];
      if (Number.isInteger(n) && n>=1 && n<=4 && !taken.has(n)) {
        assigned[i]=n;
        taken.add(n);
      }
    });
  }
  const read = () => ({parcels:[...assigned]});
  const status = element("p","machine-status");
  status.setAttribute("role","status");
  const keys=[];
  const update = () => keys.forEach(({button, i, n}) => {
    const checked=assigned[i]===n;
    button.setAttribute("aria-pressed",String(checked));
    button.lastChild.textContent=checked?"✓":"·";
  });
  couriers.forEach((courier,i) => {
    const row = body.insertRow();
    const who = heading("","row");
    const picture = element("span","animal");
    picture.dataset.animal=courier.id;
    picture.setAttribute("aria-hidden","true");
    who.append(picture,element("span","animal-name",courier.name));
    row.append(who);
    for (let n=1; n<=4; n++) {
      const label = courier.name+", "+n+(n===1?" shell":" shells");
      const button = action("seal-pad",label,() => {
        const previous=assigned.indexOf(n);
        const removing=assigned[i]===n;
        if (previous!==-1) assigned[previous]=0;
        assigned[i]=removing?0:n;
        update();
        status.textContent=removing?courier.name+"’s parcel removed.":label+"."+
          (previous!==-1 && previous!==i ? " Parcel moved from "+couriers[previous].name+"." : "");
        onChange?.(read());
      });
      button.dataset.courier=courier.id;
      button.dataset.shells=String(n);
      const ink=element("span","ink","·");
      ink.setAttribute("aria-hidden","true");
      button.append(ink); keys.push({button,i,n});
      row.insertCell().append(button);
    }
  });
  const instruction=element("p","guide","Stamp one box in each row. Choosing a parcel again moves it to its new courier.");
  sheet.append(legend,grid);
  shell.append(notes,sheet,instruction,status);
  host.replaceChildren(shell); update();
  function check() {
    const [whale,turtle,crab,fish]=assigned;
    return assigned.every(Boolean) && new Set(assigned).size===4 &&
      whale===2*fish && turtle>crab && whale>turtle;
  }
  return {read,check};
}

// Each column is a bar of music; 1 = flash, 0 = rest, null = worn away.
const master = [[1,null,null],[1,0,null],[null,null,1],[1,null,1],[null,1,null]];
const beatMask = beats => beats.reduce((mask,b)=>mask|(1<<(b-1)),0);
const motifAt = new Map(chimes.map(chime=>[beatMask(chime.beats),chime]));
const bitAt = (mask,row) => Boolean(mask & (1<<row));

function makeTower(host, saved, onChange) {
  const shell = element("section","box dt-tower");
  shell.setAttribute("aria-label","Mechanical dawn music roll");
  const pegs = Array.from({length:5},(_,i) => {
    const n=Array.isArray(saved?.pegs)?saved.pegs[i]:null;
    return Number.isInteger(n) && n>=0 && n<=7 ? n : 0;
  });
  const read = () => ({pegs:[...pegs]});
  const guide = element("div","blueprint");
  const guideTitle = element("h3","machine-title","The old master roll");
  const legend = element("p","roll-legend");
  for (const [type,mark,label] of [["flash","●","Flash"],["rest","○","Rest"],["worn","?","Worn away"]]) {
    const tag=element("span","legend-item");
    const token=element("b","legend-mark",mark);
    token.dataset.mark=type;
    token.setAttribute("aria-hidden","true");
    tag.append(token,document.createTextNode(label));
    legend.append(tag);
  }
  guide.append(guideTitle,legend);
  const worn = table("Old master roll, three beats in each of five bars.");
  const roll = table("Your music roll. Press a button to add or remove a peg.");
  for (const t of [worn,roll]) {
    const h=t.createTHead().insertRow();
    h.append(heading("","col"));
    for(let bar=1;bar<=5;bar++) h.append(heading("Bar "+bar,"col"));
  }
  const wbody=worn.createTBody(),tbody=roll.createTBody();
  const controls=[],names=[];
  function paint() {
    for(const {button,b,r} of controls) {
      const filled=bitAt(pegs[b],r);
      button.setAttribute("aria-pressed",String(filled));
      button.setAttribute("aria-label","Bar "+(b+1)+", beat "+(r+1)+", "+(filled?"flash":"rest"));
    }
    names.forEach((name,b)=>{
      const matched=motifAt.get(pegs[b]);
      name.textContent=matched?.name || (pegs[b]===0?"—":"?");
      name.setAttribute("aria-label","Bar "+(b+1)+": "+(matched?.name || (pegs[b]===0?"empty":"unknown motif")));
    });
  }
  for(let r=0;r<3;r++) {
    const wr=wbody.insertRow(),tr=tbody.insertRow();
    for(const row of [wr,tr])row.append(heading("Beat "+(r+1),"row"));
    for(let b=0;b<5;b++) {
      const m=master[b][r];
      const printed=element("span","imprint",m===null?"?":m===1?"●":"○");
      printed.dataset.mark=m===null?"worn":m===1?"flash":"rest";
      printed.setAttribute("aria-hidden","true");
      wr.insertCell().append(printed,element("span","accessible",m===null?"Worn away":m===1?"Flash":"Rest"));
      const button=action("peg","",()=>{
        pegs[b]^=1<<r;
        paint();onChange?.(read());
      });
      button.dataset.bar=String(b+1);button.dataset.beat=String(r+1);
      const head=element("span","peg-head");
      head.setAttribute("aria-hidden","true");button.append(head);
      tr.insertCell().append(button);
      controls.push({button,b,r});
    }
  }
  const identity=roll.createTFoot().insertRow();
  identity.append(heading("Chime","row"));
  for(let b=0;b<5;b++){const name=element("span","matched");identity.insertCell().append(name);names.push(name);}
  guide.append(worn);
  const machine=element("div","puncher");
  machine.append(element("h3","machine-title","Your brass music roll"),roll);
  const instruction=element("p","guide","Tap a hole to fit a peg for a flash. An empty hole is a rest. Tap a peg again to lift it.");
  shell.append(guide,machine,instruction);
  host.replaceChildren(shell); paint();

  function check() {
    const unique=pegs.every(mask=>motifAt.has(mask)) && new Set(pegs).size===chimes.length;
    return unique && master.every((bar,b)=>bar.every((mark,r)=>
      mark===null || bitAt(pegs[b],r)===Boolean(mark)
    ));
  }
  return {read,check};
}

export const towerRooms=[
  {
    id:"courier",title:"The Shell Manifest",place:"Coral Cove",art:"reef",boardTitle:"The shell manifest",
    brief:"Four swimmers brought four shell-stamped parcels to the lighthouse. Ruby’s tally sheet got wet. Can you put the right parcel beside each courier?",
    clue:"The tags carry one, two, three or four shells. Each courier brought one different parcel. Use the dock notes to rebuild Ruby’s tally.",
    hints:[
      "If Clownfish has one shell, Whale has two. If Clownfish has two, Whale has four. Those are the only pairs that double.",
      "Both Turtle and Crab had fewer shells than Whale. Only one parcel is smaller than two, so Whale cannot have two.",
      "Whale has four and Clownfish has two. Of the remaining parcels, Turtle gets the larger: three for Turtle and one for Crab."
    ],
    reward:{symbol:"beacon",name:"Beacon Chime"},
    reply:"Ruby unrolls the biggest parcel. Inside is the lighthouse chime, still bright with salt. She hands it to the kitten for the climb to the bell tower.",
    miss:"Each shell count is used once. Compare Whale’s parcel with Clownfish’s, then read Turtle’s place between Crab and Whale.",
    journalNote:"The Beacon Chime flashes on the last beat only.",create:makeCourier
  },
  {
    id:"belltower",title:"The First Peal",place:"The Bell Tower",art:"hollow",boardTitle:"The dawn music roll",
    brief:"At the top of the treehouse, the kitten finds the silent Dawn Bell. Its master roll is worn thin. Fit new brass pegs to play the five chimes again.",
    clue:"Read each bar from top to bottom. Copy every surviving flash and rest. Fill the worn marks so the five chime patterns in your journal each appear exactly once.",
    hints:[
      "Bar 4 flashes on beats one and three. Only the Bell fits. Bar 2 starts with a flash and a rest; it cannot be Bell again.",
      "Put Dew in bar 2 and Bell in bar 4. Bar 1 needs a first-beat flash too, so use the remaining first-beat chime: Ribbon.",
      "The five bars are Ribbon, Dew, Beacon, Bell and Brook. Fit pegs on beats 1 and 2; 1; 3; 1 and 3; then 2 and 3."
    ],
    reward:{symbol:"sunrise",name:"The Dawn Bell"},
    reply:"The kitten turns the handle. Five little chimes answer, then the big bell rings. Daylight runs along the branches, over the bakery roof and out to Ruby’s lighthouse.",
    miss:"Check the old roll’s surviving marks. Your new roll needs Dew, Brook, Bell, Ribbon and Beacon, each in a different bar.",
    journalNote:"Five chimes played the first peal. Morning came all the way to Coral Cove.",create:makeTower
  }
];
