import { engraving, sealIcon, seals } from "./seals.js";

const messages = [
  {start:"moon",step:2}, {start:"star",step:1}, {start:"leaf",step:-3}
];
const answer = messages.map(({start,step}) => seals[(seals.findIndex(s=>s.id===start)+step+5)%5].id);
const positions = ["First", "Second", "Third"];

export const finalRoom = {
  id:"observatory", title:"The Moonkeeper’s Cipher", place:"Moonlit Observatory", art:"cat",
  brief:"Three engravings hide the wordless combination. Your five seals are the codebook.",
  clue:"Look up each star pattern in your journal. Find its seal on the wheel. Follow the arrow one spoke per step, then fit the seal you reach.",
  hints:[
    "The Cup engraving belongs to the Moon. Start at Moon for the first socket. Count moves after leaving your starting seal.",
    "Two clockwise steps from Moon pass Leaf and land on Flame. For the second socket, start at the seal with the Crown engraving.",
    "Crown starts at Star: one clockwise step lands on Moon. Steps starts at Leaf: three counterclockwise steps pass Moon and Star, then land on Wave."
  ],
  reward:{symbol:"key",name:"The Moonkeeper’s Key"},
  reply:"The brass key turns. Moonlight spills down the oak, from the loft’s blue bed to the last lantern on Koala’s porch. The kitten curls up beside your journal. The island is ready for dreams.",
  create(host,saved,onChange) {
    const valid=s=>seals.some(it=>it.id===s);
    const sockets = Array.from({length:3},(_,i)=> valid(saved?.sockets?.[i]) ? saved.sockets[i] : null);
    let active = Number.isInteger(saved?.active) && saved.active>=0 && saved.active<3 ? saved.active : Math.max(0,sockets.indexOf(null));
    const read=()=>({sockets:[...sockets],active});
    const shell=document.createElement("section");
    shell.className="cipher";
    shell.innerHTML='<div class="cipher-rack" aria-label="Three coded key sockets"></div><div class="cipher-body"><div class="cipher-wheel" role="group" aria-label="Seal wheel, clockwise from Moon at the top"><div class="cipher-wheel-ring" aria-hidden="true"></div><div class="cipher-axis" aria-hidden="true">'+sealIcon("key")+'</div></div><p class="cipher-guide"></p></div>';
    host.replaceChildren(shell);
    const rack=shell.querySelector(".cipher-rack"),wheel=shell.querySelector(".cipher-wheel"),guide=shell.querySelector(".cipher-guide");
    function refresh() {
      [...rack.children].forEach((button,i)=>{
        const s=seals.find(x=>x.id===sockets[i]);
        const decoded=button.querySelector(".cipher-decoded");
        decoded.textContent=s?.name || "Empty";
        button.setAttribute("aria-pressed",String(active===i));
        const start=seals.find(s=>s.id===messages[i].start);
        button.setAttribute("aria-label",positions[i]+" socket. "+start.mark+" pattern, "+button.dataset.walk+". Fitted seal: "+decoded.textContent);
      });
      const s=seals.find(x=>x.id===sockets[active]);
      [...wheel.querySelectorAll("button")].forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.seal===s?.id)));
      guide.textContent = sockets.every(Boolean) ? "All three sockets are filled. Try the lock, or select a socket to change it." : "Tap a seal on the wheel to fit it in the " + positions[active].toLowerCase() + " socket.";
    }
    messages.forEach(({start,step},i)=>{
      const source=seals.find(s=>s.id===start),button=document.createElement("button");
      const direction=step>0?"clockwise":"counterclockwise";
      const walk=Math.abs(step)+" "+(Math.abs(step)===1?"step":"steps")+" "+direction;
      button.type="button"; button.className="cipher-socket"; button.dataset.socket=i;button.dataset.walk=walk;
      button.innerHTML='<span class="cipher-label">'+positions[i]+'</span><span class="cipher-etch">'+engraving(source)+'</span><span class="cipher-walk"><b aria-hidden="true">'+(step>0?"↻":"↺")+'</b> '+Math.abs(step)+'</span><strong class="cipher-decoded"></strong>';
      button.addEventListener("click",()=>{if(active!==i){active=i;refresh();onChange(read());}});
      rack.append(button);
    });
    seals.forEach((seal,i)=>{
      const a = i*2*Math.PI/5-Math.PI/2,button=document.createElement("button");
      button.type="button";button.className="cipher-seal";button.dataset.seal=seal.id;
      button.style.setProperty("--x",50+35*Math.cos(a)+"%");
      button.style.setProperty("--y",50+34*Math.sin(a)+"%");
      button.innerHTML=sealIcon(seal.id)+"<span>"+seal.name+"</span>";
      button.addEventListener("click",()=>{
        sockets[active]=seal.id;
        const next=sockets.findIndex((x,i)=>!x&&i>active);
        const empty=sockets.indexOf(null);
        if(next!==-1) active=next; else if(empty!==-1) active=empty;
        refresh();onChange(read());
      });
      wheel.append(button);
    });
    refresh();
    return {read,check:()=>answer.every((sym,i)=>sym===sockets[i])};
  }
};
