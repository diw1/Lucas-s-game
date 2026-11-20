import {earlyRooms} from "./early.js";
import {lateRooms} from "./late.js";
import {finalRoom} from "./final.js";
import {engraving, sealIcon, seals} from "./seals.js?v=dawn";
import {gardenRooms} from "./dawn-garden.js";
import {fairRooms} from "./dawn-fair.js";
import {towerRooms,chimeMarks} from "./dawn-tower.js";

const nightRooms=[...earlyRooms,...lateRooms,finalRoom];
const dawnRooms=[...gardenRooms,...fairRooms,...towerRooms];
const books={
  night:{
    rooms:nightRooms, first:0, heading:"The Moonkeeper’s", emphasis:"Key", trail:"The moonlight trail",
    intro:"The moon is up, but the island’s lanterns are dark. Follow the silver kitten through Lucas’s paintings to find the missing key.",
    cover:"assets/moonroom.webp",alt:"A silver kitten keeps watch beside the telescope and brass lock in the treehouse observatory.",
    start:"Enter the observatory", ending:"Moonlight returns", endingArt:"assets/moonrise.webp",
    collection:"seals", guide:"Each seal has a star engraving. Match the engravings around the wheel in room six."
  },
  dawn:{
    rooms:dawnRooms, first:nightRooms.length, heading:"The Dawn", emphasis:"Bell", trail:"The morning bell trail",
    intro:"The first light reaches the treehouse, but the morning bell is silent. Gather its five chimes and help the kitten ring in the day.",
    cover:"assets/dawnbell.webp",alt:"The silver kitten and squirrel beside a great brass bell above Lucas’s orchard at sunrise.",
    start:"Follow the first chime", ending:"The island wakes!", endingArt:"assets/dawnbell.webp",
    collection:"chimes", guide:"Read each chime’s three beats from left to right. A bright lamp flashes; a dark lamp rests. Use these patterns at the bell tower."
  }
};
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
let book=books.night,volume=book;
function progress(selected=book) {
  const {rooms}=selected,next=rooms.findIndex(room=>!earned(room));
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
  const {rooms}=book,n=progress(),count=n+" / "+rooms.length+" rooms solved";
  $("desk-count").textContent=count;$("game-progress").textContent=count;
  $("desk-track").max=rooms.length;$("desk-track").value=n;
  $("desk-track").setAttribute("aria-label","Mysteries solved");
  setCaption($("enter-room"),n===rooms.length?(book===books.night?"Explore Book II":"Open your completed journal"):n?"Continue the mystery":book.start);
  $("room-grid").replaceChildren(...rooms.map((room,i)=>{
    const card=clone("room-template"),locked=i>n,done=i<n;
    card.dataset.room=room.id;card.disabled=locked;
    card.classList.toggle("is-locked",locked);card.classList.toggle("is-open",!locked);
    card.classList.toggle("is-solved",done);card.classList.toggle("is-current",i===n);
    by(card,".room-art").src=art(room);
    by(card,".room-number").textContent="Room "+tickName(book.first+i);
    by(card,".room-name").textContent=room.title;
    by(card,".room-status").textContent=locked?"Locked":done?"Solved · Revisit":"Ready to explore";
    by(card,".room-icon").innerHTML=icon(locked?"lock":done?"check":"key");
    card.addEventListener("click",()=>navigate(room));
    return card;
  }));
}
function markFor(selected,i) {
  return (selected===books.night?seals:chimeMarks)[i];
}
function drawMark(mark) {
  if(!mark.beats)return engraving(mark);
  const lights=[1,2,3].map(i=>mark.beats.includes(i));
  const pattern=lights.map(lit=>lit?"flash":"rest").join(", ");
  return '<span class="mk-pulses" role="img" aria-label="'+pattern+'">'+lights.map(lit=>'<i aria-hidden="true"'+(lit?' class="on"':'')+'></i>').join("")+'</span>';
}
function markTitle(mark){return mark.mark+(mark.beats?" rhythm":" engraving");}
function renderJournal() {
  const n=progress(volume),night=volume===books.night;
  $("journal-count").textContent=Math.min(5,n)+" / 5 "+volume.collection+(n===6?(night?" + key":" + bell"):"");
  $("journal-lede").textContent=volume.guide;
  $("journal-title").textContent=night?"Seal journal":"Chime journal";
  for(const tab of document.querySelectorAll("[data-volume]"))tab.setAttribute("aria-pressed",String(volume===books[tab.dataset.volume]));
  $("journal-grid").replaceChildren(...volume.rooms.map((room,i)=>{
    const card=clone("journal-template"),found=i<n,seal=markFor(volume,i);
    card.classList.toggle("is-locked",!found);card.dataset.room=room.id;
    by(card,".journal-art").src=art(room);by(card,".journal-number").textContent=seal?(night?"Seal ":"Chime ")+tickName(i):"Room "+tickName(volume.first+i);
    by(card,".journal-seal").innerHTML=found?sealIcon(room.reward.symbol):icon("lock");
    by(card,".journal-name").textContent=found?room.reward.name:room.place;
    const note=by(card,".journal-note");
    if(found&&seal) {
      note.classList.add("mk-code");note.innerHTML=drawMark(seal);
      const text=document.createElement("span");text.textContent=markTitle(seal);note.append(text);
    }else note.textContent=found?(night?"The observatory is alight.":room.journalNote):"Open this room to reveal its entry.";
    if(found&&seal&&room.journalNote) {
      const memory=document.createElement("p");memory.className="mk-journal-memory";
      memory.textContent=room.journalNote;note.after(memory);
    }
    return card;
  }));
}
function openJournal() {volume=book;renderJournal();showDialog($("journal-dialog"));}
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
  const {rooms}=book,i=rooms.indexOf(room);
  $("desk").hidden=true;$("game").hidden=false;
  $("nav-desk").removeAttribute("aria-current");
  $("game-number").textContent="Room "+tickName(book.first+i)+" · "+room.place;
  $("game-title").textContent=room.title;$("game-brief").textContent=room.brief;
  $("game-art").src=art(room);$("game-art").alt=room.place+", from Lucas’s original painting";
  $("art-caption").textContent=room.place+" · Painted by Lucas";
  $("clue-title").textContent=room===finalRoom?"Read the engravings":"Keeper’s clue";
  $("clue-text").textContent=room.clue;
  $("board-head").textContent=room.boardTitle||["The porch rail","The star chart","The baker’s scales","The tideglass frame","The moon clock","The cipher wheel"][i];
  setCaption($("game-journal"),book===books.night?"Open seal journal":"Open chime journal");
  $("room-next").hidden=!earned(room);
  setCaption($("room-next"),i===rooms.length-1?(book===books.night?"Explore Book II":"Chime journal"):"Next room");
  resetFeedback();paintHints();setBoard(load("board."+room.id));
  paintProgress();window.scrollTo(0,0);focus($("game-title"));
}
function useBook(selected) {
  book=selected;
  $("desk").dataset.edition=book===books.night?"night":"dawn";
  $("book-kicker").textContent=book===books.night?"Book I · A Lantern Night mystery":"Book II · A Lantern Night mystery";
  $("desk-title").replaceChildren(document.createTextNode(book.heading),document.createElement("br"),Object.assign(document.createElement("em"),{textContent:book.emphasis}));
  $("book-intro").textContent=book.intro;
  if($("book-cover").getAttribute("src")!==book.cover)$("book-cover").src=book.cover;
  $("book-cover").alt=book.alt;$("chapter-title").textContent=book.trail;
  $("chapter-range").textContent="Rooms "+tickName(book.first)+"–"+tickName(book.first+book.rooms.length-1);
  for(const tab of document.querySelectorAll("[data-book]")) {
    if(book===books[tab.dataset.book])tab.setAttribute("aria-current","page");else tab.removeAttribute("aria-current");
  }
}
function renderLocation() {
  closeDialogs();
  const roomId=location.hash.startsWith("#room/")?location.hash.slice(6):"";
  const roomBook=Object.values(books).find(b=>b.rooms.some(r=>r.id===roomId));
  const bookId=location.hash.startsWith("#book/")?location.hash.slice(6):"";
  const explicit=Object.hasOwn(books,bookId)?books[bookId]:roomBook;
  const preferred=progress(books.night)===nightRooms.length||load("book")==="dawn"?books.dawn:books.night;
  useBook(explicit||preferred);
  if(explicit)store("book",book===books.night?"night":"dawn");
  const i=book.rooms.findIndex(r=>r.id===roomId);
  if(i>=0&&i<=progress()){renderGame(book.rooms[i]);return;}
  if(roomId||(!explicit&&location.hash&&location.hash!=="#desk"))history.replaceState(null,"",book===books.night?"#book/night":"#book/dawn");
  current=null;board=null;$("board-mount").replaceChildren();
  $("desk").hidden=false;$("game").hidden=true;$("nav-desk").setAttribute("aria-current","page");
  paintProgress();window.scrollTo(0,0);
}
function navigate(room) {
  const target=room?"#room/"+room.id:(book===books.night?"#book/night":"#book/dawn");
  if(location.hash!==target)history.pushState(null,"",target);
  renderLocation();
  if(!room)focus($("enter-room"));
}
function nextRoom() {
  const next=book.rooms[book.rooms.indexOf(current)+1];
  if(next)navigate(next);
  else if(book===books.night)visitDawn();
  else{navigate(null);openJournal();}
}
function visitDawn(){useBook(books.dawn);navigate(null);}
function showReward() {
  const i=book.rooms.indexOf(current),final=i===book.rooms.length-1,seal=markFor(book,i),night=book===books.night;
  $("reward-dialog").classList.toggle("mk-ending",final);
  $("reward-kicker").textContent=final?"Mystery solved":"Room "+tickName(book.first+i)+" unlocked";
  $("reward-title").textContent=final?book.ending:"The "+current.reward.name+(night?" seal":"");
  $("reward-text").textContent=current.reply;
  $("reward-icon").innerHTML=sealIcon(current.reward.symbol);
  $("reward-art").src=final?book.endingArt:art(current);
  $("reward-art").alt=final?(night?"The illuminated Moonkeeper’s Observatory":book.alt):current.place;
  const mark=$("reward-seal");
  if(seal) {
    mark.innerHTML=drawMark(seal);
    const label=document.createElement("span");label.textContent="In your journal · "+markTitle(seal);mark.append(label);
  }else mark.textContent=night?"Five seals collected · The Moonkeeper’s Key found":"Five chimes reunited · The Dawn Bell restored";
  setCaption($("reward-next"),final?(night?"Explore Book II":"View chime journal"):"Next room");
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
    $("board-status").textContent=current.miss||missMessages[book.rooms.indexOf(current)];
    ring("wrong");return;
  }
  store("board."+current.id,board.read());
  store("opened."+current.id,true);
  $("room-next").hidden=false;paintProgress();resetFeedback();
  $("board-status").textContent="The lock is open.";
  ring(current===book.rooms.at(-1)?"final":"open");showReward();
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
  const n=progress();if(n<book.rooms.length)navigate(book.rooms[n]);else if(book===books.night)visitDawn();else openJournal();
});
for(const id of ["back-desk","nav-desk","home-brand","reward-desk"])
  $(id).addEventListener("click",e=>{e.preventDefault();navigate(null);});
for(const id of ["game-journal","nav-journal"])$(id).addEventListener("click",openJournal);
for(const tab of document.querySelectorAll("[data-volume]"))tab.addEventListener("click",()=>{
  volume=books[tab.dataset.volume];renderJournal();
});
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
