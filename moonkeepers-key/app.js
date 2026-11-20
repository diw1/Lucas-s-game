import {earlyRooms} from "./early.js";
import {lateRooms} from "./late.js";
import {finalRoom} from "./final.js";
import {engraving, sealIcon, seals} from "./seals.js";

const rooms=[...earlyRooms,...lateRooms,finalRoom];
const $=id=>document.getElementById(id);
const by=(node,selector)=>node.querySelector(selector);
const clone=id=>$(id).content.firstElementChild.cloneNode(true);
const tickName=n=>String(n+1).padStart(2,"0");
const art=room=>"../lantern-night/assets/art/"+room.art+".webp";
const icon=name=>'<svg class="mk-icon" aria-hidden="true"><use href="#mk-'+name+'"/></svg>';
const key="lucas.moonkeepers-key.v1.";
const cache=new Map();
function load(k) {
  try {const raw=localStorage.getItem(key+k); if(raw!==null)return JSON.parse(raw);}
  catch { /* An unavailable store still allows play within this visit. */ }
  return cache.get(k);
}
function store(k,v) {
  cache.set(k,v);
  try {localStorage.setItem(key+k,JSON.stringify(v));}catch { /* Retain the in-memory copy. */ }
}
const earned=room=>load("opened."+room.id)===true;
function progress() {
  const next=rooms.findIndex(room=>!earned(room));
  return next<0 ? rooms.length : next;
}
function storedHints(room) {
  const n=load("hints."+room.id);
  return Number.isInteger(n) ? Math.max(0,Math.min(room.hints.length,n)) : 0;
}
function showDialog(node) {if(!node.open) node.showModal();}
function closeDialogs() {document.querySelectorAll("dialog[open]").forEach(d=>d.close());}
const focus=node=>node?.focus({preventScroll:true});
let current=null,board=null,sound=load("sound")!==false,context;

function ring(kind) {
  if(!sound)return;
  try {
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)return;
    context??=new Audio();
    if(context.state!=="running")context.resume().catch(()=>{});
    const melody=kind==="final"?[392,493.88,587.33,783.99,987.77]:
      kind==="open"?[392,493.88,659.25]:kind==="hint"?[523.25,659.25]:kind==="wrong"?[329.63,293.66]:[440];
    for(const [i,hz] of melody.entries()) {
      const oscillator=context.createOscillator(),envelope=context.createGain();
      const t=context.currentTime+i*(kind==="final"?.145:.105);
      oscillator.type="sine";oscillator.frequency.value=hz;
      envelope.gain.setValueAtTime(.0001,t);envelope.gain.exponentialRampToValueAtTime(.062,t+.012);
      envelope.gain.exponentialRampToValueAtTime(.0001,t+.55);
      oscillator.connect(envelope).connect(context.destination);oscillator.start(t);oscillator.stop(t+.58);
      oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();};
    }
  }catch{ /* Audio is optional. */ }
}
function updateSound() {
  $("sound").setAttribute("aria-pressed",String(sound));
  $("sound").setAttribute("aria-label",sound?"Mute sound":"Turn sound on");
  $("sound").title=sound?"Mute sound":"Turn sound on";
}
function setCaption(button,label) {
  // Preserve the icon when the hero and tool labels change with progress.
  let span=button.querySelector(".mk-action-label");
  if(!span) {
    for(const item of [...button.childNodes]) if(item.nodeType===Node.TEXT_NODE)item.remove();
    span=document.createElement("span");span.className="mk-action-label";button.append(span);
  }
  span.textContent=label;
}
function paintProgress() {
  const n=progress(),count=n+" / "+rooms.length+" rooms open";
  $("desk-count").textContent=count;$("game-progress").textContent=count;
  $("desk-track").max=rooms.length;$("desk-track").value=n;
  $("desk-track").setAttribute("aria-label","Mysteries solved");
  setCaption($("enter-room"),n===rooms.length?"Open your completed journal":n?"Continue the mystery":"Enter the observatory");
  $("room-grid").replaceChildren(...rooms.map((room,i)=>{
    const card=clone("room-template"),locked=i>n,done=i<n;
    card.dataset.room=room.id;card.disabled=locked;
    card.classList.toggle("is-locked",locked);card.classList.toggle("is-open",!locked);
    card.classList.toggle("is-solved",done);card.classList.toggle("is-current",i===n);
    by(card,".room-art").src=art(room);
    by(card,".room-number").textContent="Room "+tickName(i);
    by(card,".room-name").textContent=room.title;
    by(card,".room-status").textContent=locked?"Locked":done?"Solved · Revisit":"Ready to explore";
    by(card,".room-icon").innerHTML=icon(locked?"lock":done?"check":"key");
    card.addEventListener("click",()=>navigate(room));
    return card;
  }));
}
function renderJournal() {
  const n=progress();
  $("journal-count").textContent=Math.min(5,n)+" / 5 seals"+(n===6?" + key":"");
  $("journal-grid").replaceChildren(...rooms.map((room,i)=>{
    const card=clone("journal-template"),found=i<n,seal=seals[i];
    card.classList.toggle("is-locked",!found);card.dataset.room=room.id;
    by(card,".journal-art").src=art(room);by(card,".journal-number").textContent=(seal?"Seal ":"Room ")+tickName(i);
    by(card,".journal-seal").innerHTML=found?sealIcon(room.reward.symbol):icon("lock");
    by(card,".journal-name").textContent=found?room.reward.name:room.place;
    const note=by(card,".journal-note");
    if(found&&seal) {
      note.classList.add("mk-code");note.innerHTML=engraving(seal);
      const text=document.createElement("span");text.textContent=seal.mark+" engraving";note.append(text);
    }else note.textContent=found?"The observatory is alight.":"Open this room to reveal its entry.";
    return card;
  }));
}
function openJournal() {renderJournal();showDialog($("journal-dialog"));}
function resetFeedback() {
  $("board-status").textContent="";$("board-status").removeAttribute("data-tone");
}
function paintHints() {
  const n=storedHints(current);
  const region=$("board-hint");
  region.replaceChildren(...current.hints.slice(0,n).map((hint,i)=>{
    const line=document.createElement("span");line.className="mk-hint-line";
    line.textContent="Hint "+(i+1)+" of "+current.hints.length+" · "+hint;
    return line;
  }));
  $("hint").disabled=n===current.hints.length;
  setCaption($("hint"),n===0?"Hint":n===current.hints.length?"All hints shown":"Next hint");
}
function setBoard(saved) {
  const room=current;
  board=room.create($("board-mount"),saved,state=>{
    store("board."+room.id,state);
    resetFeedback();
  });
}
function renderGame(room) {
  current=room;
  const i=rooms.indexOf(room);
  $("desk").hidden=true;$("game").hidden=false;
  $("nav-desk").removeAttribute("aria-current");
  $("game-number").textContent="Room "+tickName(i)+" · "+room.place;
  $("game-title").textContent=room.title;$("game-brief").textContent=room.brief;
  $("game-art").src=art(room);$("game-art").alt=room.place+", from Lucas’s original painting";
  $("art-caption").textContent=room.place+" · Painted by Lucas";
  $("clue-title").textContent=room===finalRoom?"Read the engravings":"Keeper’s clue";
  $("clue-text").textContent=room.clue;
  $("board-head").textContent=["The porch rail","The star chart","The baker’s scales","The tideglass frame","The moon clock","The cipher wheel"][i];
  $("room-next").hidden=!earned(room);
  setCaption($("room-next"),i===rooms.length-1?"Seal journal":"Next room");
  resetFeedback();paintHints();setBoard(load("board."+room.id));
  paintProgress();window.scrollTo(0,0);focus($("game-title"));
}
function renderLocation() {
  closeDialogs();
  const id=location.hash.replace(/^#room\//,""),i=rooms.findIndex(room=>room.id===id);
  if(i>=0&&i<=progress()) {renderGame(rooms[i]);return;}
  if(location.hash&&location.hash!=="#desk")history.replaceState(null,"","#desk");
  current=null;board=null;$("board-mount").replaceChildren();
  $("desk").hidden=false;$("game").hidden=true;$("nav-desk").setAttribute("aria-current","page");
  paintProgress();window.scrollTo(0,0);
}
function navigate(room) {
  const target=room?"#room/"+room.id:"#desk";
  if(location.hash!==target)history.pushState(null,"",target);
  renderLocation();
  if(!room)focus($("enter-room"));
}
function nextRoom() {
  const next=rooms[rooms.indexOf(current)+1];
  if(next)navigate(next);else{navigate(null);openJournal();}
}
function showReward() {
  const final=current===finalRoom,i=rooms.indexOf(current),seal=seals[i];
  $("reward-dialog").classList.toggle("mk-ending",final);
  $("reward-kicker").textContent=final?"Mystery solved":"Room "+tickName(i)+" unlocked";
  $("reward-title").textContent=final?"Moonlight returns":"The "+current.reward.name+" seal";
  $("reward-text").textContent=current.reply;
  $("reward-icon").innerHTML=sealIcon(current.reward.symbol);
  $("reward-art").src=final?"assets/moonrise.webp":art(current);
  $("reward-art").alt=final?"The illuminated Moonkeeper’s Observatory":current.place;
  const mark=$("reward-seal");
  if(seal) {
    mark.innerHTML=engraving(seal);
    const label=document.createElement("span");label.textContent="In your journal · "+seal.mark+" engraving";mark.append(label);
  }else mark.textContent="Five seals collected · The Moonkeeper’s Key found";
  setCaption($("reward-next"),final?"View seal journal":"Next room");
  showDialog($("reward-dialog"));focus($("reward-next"));
}
const missMessages=[
  "The porch latch is still shut. Check which keepsake is nearest the lantern.",
  "The star latch is still shut. Compare each step with the stitched chart.",
  "The baker’s drawer is still shut. Check both the order and its weight.",
  "The glass is still dark. Compare every lit pane with the target.",
  "The clock is still asleep. All three hands need to meet their targets together.",
  "The key won’t turn yet. Check each starting engraving and count the spaces you move."
];
$("check").addEventListener("click",()=>{
  if(!current||!board)return;
  if(!board.check()) {
    $("board-status").dataset.tone="warm";
    $("board-status").textContent=missMessages[rooms.indexOf(current)];
    ring("wrong");return;
  }
  store("board."+current.id,board.read());
  store("opened."+current.id,true);
  $("room-next").hidden=false;paintProgress();resetFeedback();
  $("board-status").textContent="The lock is open.";
  ring(current===finalRoom?"final":"open");showReward();
});
$("reset").addEventListener("click",()=>{
  if(!current)return;
  setBoard(undefined);store("board."+current.id,board.read());
  resetFeedback();$("board-status").textContent="Mechanism reset.";
});
$("hint").addEventListener("click",()=>{
  if(!current)return;
  const n=Math.min(storedHints(current)+1,current.hints.length);
  store("hints."+current.id,n);paintHints();ring("hint");
});
$("sound").addEventListener("click",()=>{
  sound=!sound;store("sound",sound);updateSound();ring("click");
});
$("enter-room").addEventListener("click",()=>{
  const n=progress();if(n===rooms.length)openJournal();else navigate(rooms[n]);
});
for(const id of ["back-desk","nav-desk","home-brand","reward-desk"])
  $(id).addEventListener("click",e=>{e.preventDefault();navigate(null);});
for(const id of ["game-journal","nav-journal"])$(id).addEventListener("click",openJournal);
for(const id of ["reward-next","room-next"])$(id).addEventListener("click",nextRoom);
for(const b of document.querySelectorAll("[data-close]"))b.addEventListener("click",()=>b.closest("dialog").close());
$("help").addEventListener("click",()=>showDialog($("help-dialog")));
$("inspect-art").addEventListener("click",()=>{
  if(!current)return;
  $("art-title").textContent=current.place;
  $("art-full").src=art(current);$("art-full").alt="Lucas’s painting of "+current.place;
  showDialog($("art-dialog"));
});
window.addEventListener("hashchange",renderLocation);
window.addEventListener("storage",e=>{
  if(e.key?.startsWith(key+"opened.")){paintProgress();if($("journal-dialog").open)renderJournal();}
  if(e.key===key+"sound"){sound=load("sound")!==false;updateSound();}
});
updateSound();renderLocation();
