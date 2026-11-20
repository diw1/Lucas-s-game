const node = (tag, cls, text) => {
  const element = document.createElement(tag);
  element.className = "lr-" + cls;
  if (text !== undefined) element.textContent = text;
  return element;
};

function button(cls, label, act) {
  const el = node("button", cls, label);
  el.type = "button";
  el.addEventListener("click", act);
  return el;
}

const lenses = [
  {id:"foam", name:"Foam", color:"#afdcb0", squares:[2,3,6]},
  {id:"drift", name:"Drift", color:"#d4afe7", squares:[2,7,9]},
  {id:"shoal", name:"Shoal", color:"#f5c78b", squares:[3,6,14]},
  {id:"shell", name:"Shell", color:"#f0aaa3", squares:[5,9,12,13]},
  {id:"kelp", name:"Kelp", color:"#93c8db", squares:[5,8,13]},
  {id:"ripple", name:"Ripple", color:"#86dad4", squares:[9,14,15]}
];
const wavePattern = [2,3,5,6,9,12,13,14,15];
const squareName = i => "ABCD"[i % 4] + (Math.floor(i / 4) + 1);
const outline = cells => cells.length ? cells.map(squareName).join(", ") : "none";

function grid(mini = false) {
  const el = node("div", "glass-grid");
  if (mini) {
    el.classList.add("lr-mini");
    el.setAttribute("aria-hidden","true");
  } else {
    el.setAttribute("role","img");
  }
  for (let i=0; i<16; i++) el.append(node("i","pane"));
  return el;
}
function colorPanes(el, pattern, color) {
  for (const i of pattern) {
    el.children[i].classList.add("lr-glowing");
    el.children[i].style.setProperty("--lr-light",color);
  }
}
function windowPane(name, pattern, color) {
  const figure = node("figure","glass-frame");
  const contents = grid();
  colorPanes(contents,pattern,color);
  contents.setAttribute("aria-label",name + ". Illuminated squares: " + outline(pattern) + ". Columns A to D, rows 1 to 4.");
  figure.append(contents,node("figcaption","glass-caption",name));
  return {figure,contents};
}

function makeReef(host, saved, onChange) {
  const savedIds = Array.isArray(saved?.selected) ? saved.selected : [];
  const selected = new Set(lenses.filter(l => savedIds.includes(l.id)).slice(0,3).map(l => l.id));
  const root = node("section","reef");
  root.setAttribute("aria-label","Tideglass lens puzzle");
  const compare = node("div","comparison");
  const target = windowPane("Target pattern",wavePattern,"#ffcf75");
  const preview = windowPane("Your window",[],"#afe0c8");
  compare.append(target.figure,preview.figure);
  const rail = node("div","lens-rail");
  const tools = node("div","lens-tools");
  const usage = node("b","usage");
  const notice = node("p","glass-notice");
  notice.setAttribute("role","status");
  const slots = node("div","lenses");
  slots.setAttribute("role","group");
  slots.setAttribute("aria-label","Choose up to three lenses");
  const read = () => ({selected:lenses.filter(l => selected.has(l.id)).map(l => l.id)});
  const lit = () => new Set(lenses.filter(l => selected.has(l.id)).flatMap(l => l.squares));
  const check = () => {
    const picture = lit();
    return selected.size === 3 && picture.size === wavePattern.length && wavePattern.every(i => picture.has(i));
  };
  const clear = button("clear","Lift all lenses",() => {
    if (!selected.size) return;
    selected.clear();
    render("All three slots are empty.");
    onChange?.(read());
  });
  const choices = lenses.map(lens => {
    const choice = button("lens","",() => {
      const removing = selected.has(lens.id);
      if (!removing && selected.size === 3) {
        notice.textContent = "All three slots are full. Lift a lens to try another.";
        return;
      }
      if (removing) selected.delete(lens.id); else selected.add(lens.id);
      render(lens.name + (removing ? " lifted." : " added."));
      onChange?.(read());
    });
    choice.dataset.lens = lens.id;
    choice.style.setProperty("--lr-lens",lens.color);
    choice.setAttribute("aria-label",lens.name + " lens. Illuminates " + outline(lens.squares) + ".");
    const sample = grid(true);
    colorPanes(sample,lens.squares,lens.color);
    choice.append(sample,node("span","lens-name",lens.name));
    slots.append(choice);
    return choice;
  });
  function render(message = "") {
    const selectedLenses = lenses.filter(l => selected.has(l.id));
    const picture = lit();
    for (let i=0; i<16; i++) {
      const colors = selectedLenses.filter(l => l.squares.includes(i)).map(l => l.color);
      const pane = preview.contents.children[i];
      pane.classList.toggle("lr-glowing", colors.length > 0);
      pane.classList.toggle("lr-overlap", colors.length > 1);
      pane.style.setProperty("--lr-light", colors.length > 1 ? "#fff0bf" : colors[0] || "transparent");
    }
    preview.contents.setAttribute("aria-label","Your window. Illuminated squares: " + outline([...picture].sort((a,b)=>a-b)) + ".");
    usage.textContent = selected.size + " / 3 lenses";
    clear.disabled = !selected.size;
    choices.forEach(el => el.setAttribute("aria-pressed", String(selected.has(el.dataset.lens))));
    notice.textContent = message;
  }
  tools.append(usage,clear);
  rail.append(tools,slots,notice);
  root.append(compare,rail); host.replaceChildren(root);
  render();
  return {read,check};
}

const initialHands = [1,2,0];
const targetHands = [5,1,3];
const hours = [12,2,4,6,8,10];
const dialNames = ["Left","Center","Right"];
const wrap = n => ((n % 6) + 6) % 6;
const validTurn = n => Number.isInteger(n) && n >= 0 && n < 6 ? n : 0;
const polar = (r, angle) => {
  const a = angle * Math.PI / 180;
  return [(56 + r * Math.sin(a)).toFixed(2),(56 - r * Math.cos(a)).toFixed(2)];
};

function clockFace(target) {
  const rim = [];
  for (let t=0; t<18; t++) {
    for (const [offset,radius] of [[-9.5,45],[-6.5,45],[-4.5,49],[4.5,49],[6.5,45]]) {
      rim.push(polar(radius,t*20+offset).join(","));
    }
  }
  const ticks = hours.map((hour,i) => {
    const [x,y] = polar(30,60*i);
    return '<text x="'+x+'" y="'+y+'">'+hour+'</text>';
  }).join("");
  const lines = Array.from({length:30},(_,i) => {
    const [x1,y1] = polar(i%5 === 0 ? 35 : 38,12*i);
    const [x2,y2] = polar(40,12*i);
    return '<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'"/>';
  }).join("");
  return '<svg class="lr-face" viewBox="0 0 112 112" aria-hidden="true" focusable="false">'+
    '<polygon class="lr-cog" points="'+rim.join(" ")+'"/>'+
    '<circle class="lr-dial-plate" cx="56" cy="56" r="42"/><circle class="lr-dial-bezel" cx="56" cy="56" r="40"/>'+
    '<g class="lr-ticks">'+lines+'</g><g class="lr-hours">'+ticks+'</g>'+
    '<g transform="rotate('+target*60+' 56 56)"><path class="lr-dial-goal" d="M50.5 11.8 61.5 11.8 56 19Z"/></g>'+
    '<g class="lr-hand"><path class="lr-hand-body" d="M56 24 59.3 33 58 51 59.8 61 56 65 52.2 61 54 51 52.7 33Z"/>'+
    '<path class="lr-hand-glint" d="M55.8 30 55 50"/></g><circle class="lr-axle" cx="56" cy="56" r="4.3"/>'+
    '</svg>';
}
function makeCastle(host, saved, onChange) {
  let left = validTurn(saved?.left), right = validTurn(saved?.right);
  const history = [];
  const root = node("section","castle");
  root.setAttribute("aria-label","Moon clock puzzle");
  const machine = node("div","clock-chassis");
  const clockRow = node("div","clock-row");
  const dials = dialNames.map((name,i) => {
    const item = node("div","instrument");
    const dial = node("div","wheel");
    dial.innerHTML = clockFace(targetHands[i]);
    const label = node("span","wheel-name",name);
    const status = node("span","wheel-status");
    item.append(label,dial,status);
    clockRow.append(item);
    return {dial,status};
  });
  machine.append(clockRow);
  const instructions = node("p","links","Turn either outer wheel one notch. The center turns one notch the other way.");
  const keys = node("div","cranks");
  const read = () => ({left:wrap(left),right:wrap(right)});
  const hands = () => [initialHands[0]+left,initialHands[1]-left-right,initialHands[2]+right];
  const check = () => hands().every((turn,i) => wrap(turn) === targetHands[i]);
  const announce = node("p","sr");
  announce.setAttribute("role","status");
  for (const side of ["left","right"]) {
    const set = node("div","crank-set");
    set.setAttribute("role","group");
    set.setAttribute("aria-label","Wind the " + side + " wheel");
    const title = node("span","crank-name",side === "left" ? "Left wheel" : "Right wheel");
    const controls = node("div","crank-buttons");
    for (const sign of [-1,1]) {
      const name = sign > 0 ? "clockwise" : "counterclockwise";
      const key = button("crank","",() => {
        history.push([left,right]);
        if (history.length > 64) history.shift();
        if (side === "left") left += sign; else right += sign;
        render(true); onChange?.(read());
      });
      key.dataset.wheel = side;
      key.dataset.step = String(sign);
      key.setAttribute("aria-label","Turn " + side + " wheel " + name);
      key.title = name[0].toUpperCase()+name.slice(1);
      const arrow = node("b","crank-icon",sign > 0 ? "↻" : "↺");
      arrow.setAttribute("aria-hidden","true");
      key.append(arrow,node("span","crank-step",sign > 0 ? "+1" : "−1"));
      controls.append(key);
    }
    set.append(title,controls); keys.append(set);
  }
  const undo = button("clear","Undo last turn",() => {
    if (!history.length) return;
    [left,right] = history.pop();
    render(true); onChange?.(read());
  });
  const footer = node("div","clock-footer");
  const legend = node("span","legend","Coral mark = target");
  footer.append(legend,undo);
  function render(speak = false) {
    const turns = hands();
    dials.forEach(({dial,status},i) => {
      const at = wrap(turns[i]), hour = hours[at], goal = hours[targetHands[i]];
      dial.querySelector(".lr-hand").style.setProperty("--lr-angle",turns[i]*60+"deg");
      dial.querySelector(".lr-cog").style.setProperty("--lr-angle",turns[i]*60+"deg");
      dial.classList.toggle("lr-on-target",at === targetHands[i]);
      status.textContent = hour + " / " + goal;
      status.setAttribute("aria-label",dialNames[i]+" hand at "+hour+" o’clock. Target "+goal+" o’clock.");
    });
    undo.disabled = !history.length;
    if (speak) announce.textContent = dials.map(d=>d.status.getAttribute("aria-label")).join(" ");
  }
  root.append(machine,instructions,keys,footer,announce); host.replaceChildren(root);
  render();
  return {read,check};
}

export const lateRooms = [
  {
    id:"reef", title:"The Tideglass Window", place:"Coral Cove", art:"reef",
    brief:"At low tide, Ruby finds six loose lenses in the lighthouse window. Moonlight used to shine through them in the shape of a wave.",
    clue:"Stack three lenses to match the gold pattern. Light every marked square and leave the others dark. Tap a lens again to lift it.",
    hints:[
      "A square stays lit when more glass is added. Rule out any lens that lights a square the target leaves dark.",
      "Foam is the only lens with both lights in the top row. Look for another lens with the two lights at the bottom left.",
      "Start with Foam and Shell, then add Ripple. Shell and Ripple can share a square."
    ],
    reward:{symbol:"wave",name:"Wave"},
    reply:"Ruby tips the finished window toward the sea. A silver wave washes across the wall, leaving a tiny Wave seal on the sill.",
    create:makeReef
  },
  {
    id:"castle", title:"The Moon Clock", place:"Pumpkin Castle", art:"castle",
    brief:"The bat at Pumpkin Castle can hear the clock ticking behind a locked panel. Three brass hands must point to their coral marks together.",
    clue:"Match each hand to its marked hour. You can wind the left and right wheels either way; both turn the center wheel backwards.",
    hints:[
      "Each notch is two clock hours. Watch the center as you move an outer wheel, then try the reverse button to undo it.",
      "The left target is 10 o’clock. From its starting position at 2, two counterclockwise turns reach it.",
      "From the reset position, turn the left wheel back twice and the right wheel forward three times. The center lands on 2."
    ],
    reward:{symbol:"star",name:"Star"},
    reply:"The three hands click into place. A little brass door opens under the clock face. The bat catches the Star seal before it hits the floor.",
    create:makeCastle
  }
];
