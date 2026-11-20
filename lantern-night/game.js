(() => {
  "use strict";
  const el = id => document.getElementById(id);
  const Engine = window.LanternEngine, scenes = window.LanternScenes, sound = window.LanternSound;
  const levels = Engine.levels, byId = new Map(levels.map(level => [level.id,level]));
  const icons = {
    home:'<path d="m3 11 9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    island:'<path d="M2 18q4-3 8 0t8 0q2-1.5 4-1M4 14q4-4 10-2l5 2M10 12l3-8m-5 2q3-5 5-2 3-3 6 1m-6-1q4-1 5 4"/>',
    map:'<path d="m3 5 6-2 6 3 6-2v15l-6 2-6-3-6 2zM9 3v15m6-12v15"/>',
    book:'<path d="M3 5q4.5-1.5 9 2 4.5-3.5 9-2v14q-4.5-1.5-9 2-4.5-3.5-9-2zM12 7v14"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.1a2.6 2.6 0 1 1 4.3 2c-1.2.8-1.8 1.1-1.8 2.7m0 2.8v.1"/>',
    mute:'<path d="M3 9h4l5-4v14l-5-4H3zM16 9l5 6m0-6-5 6"/>',
    volume:'<path d="M3 9h4l5-4v14l-5-4H3zM15 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/>',
    play:'<path d="m7 3 13 9L7 21z" fill="currentColor" stroke-width="1"/>',
    bulb:'<path d="M8.7 15.4a6.2 6.2 0 1 1 6.6 0q-1.1.8-1.2 2.7H10q-.2-1.8-1.3-2.7ZM10.2 21h3.6M12 1v1M2 9h1m18 0h1"/>',
    brush:'<path d="m9 15 8-11q3-3 4-1t-1 4l-10 10zM9 17q-1 5-7 3 3-1 2-4t4-2"/>',
    prev:'<path d="m14 5-7 7 7 7"/>',next:'<path d="m9 5 7 7-7 7"/>',
    circuit:'<path d="M3 18h5V7h8v6h5"/><circle cx="3" cy="18" r="1.3"/><circle cx="21" cy="13" r="1.3"/>',
    undo:'<path d="M9 5 3 10l6 5M4 10h10a6 6 0 0 1 0 12" transform="translate(0 -2)"/>',
    reset:'<path d="M19.5 7.5A8.5 8.5 0 1 0 21 14M20 3.5v5.2h-5.2"/>',
    zoom:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5m-13-11h5m-2.5-2.5v5"/>',
    star:'<path d="m12 2 3 6.2 6.8 1-4.9 4.8 1.2 6.8-6.1-3.2-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1z"/>',
    award:'<circle cx="12" cy="8.5" r="6"/><path d="m8 13-2 8 6-3 6 3-2-8"/>',
    close:'<path d="m6 6 12 12m0-12L6 18"/>', check:'<path d="m4 12 5 5L21 5"/>',
    lantern:'<path d="M9 5V4a3 3 0 1 1 6 0v1M6 7h12l2 2-2 2-1 8-5 3-5-3-1-8-2-2zM6 11h12M12 12v6"/>',
    rotate:'<path d="M19 4v5h-5M19 9a8 8 0 1 0 1 7"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>'
  };
  const glyph = name => '<i data-icon="'+name+'" aria-hidden="true"><svg viewBox="0 0 24 24">'+icons[name]+'</svg></i>';
  document.querySelectorAll("i[data-icon]").forEach(i => { i.outerHTML = glyph(i.dataset.icon); });
  const key = "lucas.lantern-night.v1.", session = new Map();
  function read(part,fallback) {
    try { const raw = localStorage.getItem(key+part); if (raw !== null) return JSON.parse(raw); }
    catch { /* Session storage below also works with browser storage disabled. */ }
    return session.has(part) ? session.get(part) : fallback;
  }
  function save(part,value) { session.set(part,value); try { localStorage.setItem(key+part,JSON.stringify(value)); } catch {} }
  function fresh(level) { return {turns:level.tiles.map(t=>t.initial),history:[],moves:0,hinted:false}; }
  function loadRun(level) {
    const run = read("run."+level.id,null);
    if (!run || !Array.isArray(run.turns) || run.turns.length !== level.tiles.length || !Number.isInteger(run.moves) || run.moves<0) return fresh(level);
    if (run.turns.some((v,i)=>!Number.isInteger(v)||v<0||v>3||((level.tiles[i].type!=="wire"||level.tiles[i].fixed)&&v!==level.tiles[i].initial))) return fresh(level);
    return {turns:run.turns.slice(),moves:run.moves,hinted:!!run.hinted,history:Array.isArray(run.history)?run.history.filter(i=>Number.isInteger(i)&&level.tiles[i]?.type==="wire"&&!level.tiles[i].fixed).slice(-250):[]};
  }
  function record(level) {
    const v=read("best."+level.id,null);
    return v && Number.isInteger(v.moves) && v.moves>0 && Number.isInteger(v.stars) && v.stars>=1 && v.stars<=3 ? v : null;
  }
  const completed = id => !!byId.get(id) && !!record(byId.get(id));
  const winCount = () => levels.filter(level=>completed(level.id)).length;
  const getSrc = id => "assets/art/"+id+".webp";
  const chapterIndex = id => levels.findIndex(level=>level.id===id);
  const two = n=>String(n).padStart(2,"0");
  const plural = (n,one,many)=>n+" "+(n===1 ? one : many);
  let page="", level=null, run=null, board=null, island=null, lastResult=null, hintIndex=null, winTimer, modalType="";
  let soundOn=read("sound",false)===true;
  let focusOnRoute=false;
  function applySound() {
    el("sound").innerHTML=glyph(soundOn?"volume":"mute");el("sound").setAttribute("aria-pressed",String(soundOn));
    const label="Turn sound "+(soundOn?"off":"on"); el("sound").setAttribute("aria-label",label);el("sound").title=label;
    sound.enable(soundOn);
  }
  el("sound").addEventListener("click",()=>{soundOn=!soundOn;save("sound",soundOn);applySound();if(soundOn)sound.play("open");});
  function announce(txt) { el("announcement").textContent=txt; }
  const starsText = n=>"★".repeat(n)+"☆".repeat(3-n);
  function clearDialog() { if(el("dialog").open)el("dialog").close(); modalType=""; }
  function showDialog(type,html,focusSelector) {
    const dialog=el("dialog");
    modalType=type; el("dialog-body").innerHTML=html;
    if(!dialog.open) dialog.showModal();
    const first=focusSelector?el("dialog-body").querySelector(focusSelector):el("close-dialog");
    first?.focus({preventScroll:true});
  }
  el("close-dialog").addEventListener("click",clearDialog);
  el("dialog").addEventListener("close",()=>{modalType="";});
  el("dialog").addEventListener("click",e=>{
    if(e.target===el("dialog")){const r=el("dialog").getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) clearDialog();}
  });
  function help() {
    const html='<p class="eyeline">Field guide</p><h2 id="dialog-title">How to play</h2><p>Tap the track below. A quarter turn is all it takes to carry the spark to the lantern.</p>'+
      '<div class="demo" id="demo">'+glyph("bulb")+'<button id="demo-turn" aria-label="Rotate the sample track"><b></b></button>'+glyph("lantern")+'</div><p class="demo-note" id="demo-note" aria-live="polite">Try turning the middle track.</p>'+
      '<div class="rules"><p>'+glyph("island")+'Walk to a landmark on the 3D island and open its puzzle.</p><p>'+glyph("rotate")+'Tap a track to rotate it clockwise. Light every lantern to finish. Brass rivets mark fixed pieces.</p><p>'+glyph("star")+'Earn one star for finishing, one for matching the perfect route, and one for playing without hints.</p></div>'+
      '<div class="dialog-actions"><button id="got-it" class="gold-button">Got it</button></div>';
    showDialog("help",html,"#demo-turn");
    el("demo-turn").addEventListener("click",()=>{const lit=el("demo").classList.toggle("lit");sound.play(lit?"newlamp":"turn");el("demo-note").textContent=lit?"It glows! The two track ends now meet.":"The track is open. Turn it once more.";});
    el("got-it").addEventListener("click",clearDialog);
  }
  el("help").addEventListener("click",help);el("hero-help").addEventListener("click",help);
  function go(hash) {
    if(location.hash.slice(1)===hash) route(); else location.hash=hash;
  }
  function countsLabel() { return glyph("lantern")+winCount()+" / "+levels.length+" lit"; }
  function renderHome() {
    const rail=el("chapters");rail.replaceChildren();
    levels.forEach((l,i)=>{
      const s=scenes[l.id],cleared=completed(l.id),link=document.createElement("a");
      link.href="#play/"+l.id;link.className="chapter-card";link.setAttribute("aria-label","Chapter "+(i+1)+": "+s.name+(cleared?", lit":""));
      link.innerHTML='<span class="thumb"><img src="'+getSrc(l.id)+'" alt="" loading="lazy" style="object-position:'+s.position+'"><span class="chapter-number">'+two(i+1)+'</span></span><span class="chapter-info"><span>'+s.name+'</span>'+glyph(cleared?"check":"lantern")+'</span>';
      if(cleared) link.querySelector(".chapter-info i").classList.add("complete");
      rail.append(link);
    });
    el("journey-count").innerHTML=countsLabel();
    const last=read("island-last",read("last",null));
    const start=byId.has(last)?last:"canopy";
    el("begin").href="#island/"+start; el("begin").querySelector("span").textContent=last?"Return to the 3D island":"Enter the 3D island";
    requestAnimationFrame(railState);
  }
  function railState() { const r=el("chapters");el("prev-rail").disabled=r.scrollLeft<2;el("next-rail").disabled=r.scrollLeft+r.clientWidth>=r.scrollWidth-2; }
  function moveRail(dir) {const r=el("chapters");r.scrollBy({left:dir*r.clientWidth*.8,behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth"});}
  el("prev-rail").addEventListener("click",()=>moveRail(-1));el("next-rail").addEventListener("click",()=>moveRail(1));el("chapters").addEventListener("scroll",railState,{passive:true});window.addEventListener("resize",()=>{if(page==="home")railState();});
  function renderAlbum() {
    el("album-count").innerHTML=countsLabel();
    el("album-grid").replaceChildren(...levels.map(l=>{
      const s=scenes[l.id], rec=record(l), b=document.createElement("button");b.className="album-card";
      b.innerHTML='<span class="album-photo"><img src="'+getSrc(l.id)+'" alt="" loading="lazy"></span><span class="album-info"><b>'+s.name+'</b><small>'+(rec?starsText(rec.stars):"Unlit")+'</small></span>';
      b.setAttribute("aria-label","View "+s.name+(rec?", lit":", unlit"));b.addEventListener("click",()=>inspect(l.id));return b;
    }));
  }
  function inspect(id) {
    const s=scenes[id],rec=record(byId.get(id));
    showDialog("art",'<p class="eyeline">Original painting by Lucas</p><h2 id="dialog-title">'+s.name+'</h2><img class="dialog-art" src="'+getSrc(id)+'" alt="'+s.name+', painted by Lucas"><p>'+(rec?s.reply:s.story)+'</p><div class="dialog-actions"><button class="gold-button" id="art-go">'+(page==="play"?"Back to the tracks":"Open puzzle")+'</button></div>');
    el("art-go").addEventListener("click",()=>{clearDialog();if(page!=="play")go("play/"+id);});
  }
  function stepAfter(l) {
    const i=chapterIndex(l.id);
    if(l.id==="canopy")return {hash:"island/hollow",text:"Open the treehouse door"};
    if(i+1<levels.length)return {hash:"island/"+levels[i+1].id,text:"Visit "+scenes[levels[i+1].id].name};
    return winCount()===levels.length?{hash:"album",text:"Open the finished album"}:{hash:"island/"+levels.find(l=>!completed(l.id)).id,text:"Find an unlit lantern"};
  }
  function prepare(l) {
    level=l;run=loadRun(l);hintIndex=null;save("last",l.id);
    const s=scenes[l.id],i=chapterIndex(l.id);
    el("chapter-no").innerHTML="<span></span>Chapter "+two(i+1)+" / "+two(levels.length);
    el("chapter-title").textContent=s.chapter;
    el("scene-art").src=getSrc(l.id);el("scene-art").alt=s.name+", an original painting by Lucas";
    el("scene-art").parentElement.style.setProperty("--ratio",s.ratio);
    el("art-place").textContent=s.name;el("par-count").textContent=plural(l.par,"turn","turns");
    el("back-island").href="#island/"+l.id;
    board=window.LanternBoard.mount(el("board-host"),l,turn);
    update();
  }
  function update(last=null,notice="") {
    lastResult=Engine.trace(level,run.turns);
    board.update(run.turns,lastResult,{hintIndex,lastRotated:last,solved:lastResult.won});
    const s=scenes[level.id],lampIndices=level.tiles.map((t,i)=>t.type==="lamp"?i:-1).filter(i=>i>=0);
    el("lamp-counter").innerHTML=glyph("lantern")+lastResult.litLamps.size+" / "+lampIndices.length+" lit";
    el("move-count").textContent=run.moves;el("move-unit").textContent=run.moves===1?"turn":"turns";
    el("undo").disabled=!run.history.length||lastResult.won;el("hint").disabled=lastResult.won;
    el("reset").disabled=run.moves===0&&!run.hinted;
    const rec=record(level);el("best-count").textContent=rec?plural(rec.moves,"turn","turns")+" · "+starsText(rec.stars):"Not yet lit";
    el("story-line").textContent=lastResult.won?s.reply:s.story;el("scene-art").parentElement.classList.toggle("lit",lastResult.won);
    el("glows").replaceChildren(...lampIndices.flatMap((idx,i)=>{
      if(!lastResult.litLamps.has(idx))return [];
      const dot=document.createElement("span"),pos=s.lights[i%s.lights.length];dot.className="glow";dot.style.left=pos[0]+"%";dot.style.top=pos[1]+"%";return [dot];
    }));
    const movable=level.tiles.filter(t=>t.type==="wire"&&!t.fixed).length;
    el("hint-line").textContent=notice||(lastResult.won?"Every lantern is glowing.":movable===1?"Tap the middle track to turn it clockwise.":"Match the track ends to carry light to every lantern.");
    el("play-next").hidden=!lastResult.won;
    if(lastResult.won)el("play-next").textContent=stepAfter(level).text;
  }
  function turn(index) {
    if(page!=="play"||!level||lastResult?.won||level.tiles[index]?.type!=="wire"||level.tiles[index].fixed)return;
    const previous=lastResult.litLamps.size;
    run.turns[index]=(run.turns[index]+1)%4;run.history.push(index);if(run.history.length>250)run.history.shift();run.moves++;hintIndex=null;
    const result=Engine.trace(level,run.turns);
    let stars=0;
    if(result.won) {
      stars=1+Number(run.moves<=level.par)+Number(!run.hinted);
      const prior=record(level);
      save("best."+level.id,{stars:Math.max(stars,prior?.stars||0),moves:Math.min(run.moves,prior?.moves??Infinity)});
    }
    save("run."+level.id,run);update(index);sound.play(result.won?"win":result.litLamps.size>previous?"newlamp":"turn");
    if(result.won) {
      const id=level.id;announce(scenes[id].name+" is lit. "+plural(stars,"star","stars")+" earned.");
      clearTimeout(winTimer);winTimer=setTimeout(()=>{if(page==="play"&&level?.id===id&&lastResult?.won&&!el("dialog").open)victory(stars);},550);
    }
  }
  function victory(stars) {
    const s=scenes[level.id],next=stepAfter(level),count=winCount(),all=count===levels.length;
    showDialog("victory",'<p class="eyeline">'+(all?"All nine paintings are lit":"Lantern seal earned")+'</p><h2 id="dialog-title">'+(all?"The island is aglow!":s.name+" is lit!")+'</h2><div class="result-stars" aria-label="'+stars+' of 3 stars"><span>'+"★".repeat(stars)+'</span><span class="off">'+"☆".repeat(3-stars)+'</span></div><img class="dialog-art" src="'+getSrc(level.id)+'" alt="'+s.name+', painted by Lucas"><p>'+s.reply+'</p><div class="victory-note">'+plural(run.moves,"turn","turns")+' · '+count+' of 9 paintings lit</div><div class="dialog-actions"><button id="next-stop" class="gold-button">'+next.text+'</button><button class="paper-button" id="stay">Stay here</button></div>',"#next-stop");
    el("next-stop").addEventListener("click",()=>{clearDialog();go(next.hash);});el("stay").addEventListener("click",clearDialog);
  }
  el("play-next").addEventListener("click",()=>go(stepAfter(level).hash));
  el("inspect").addEventListener("click",()=>inspect(level.id));
  el("undo").addEventListener("click",()=>{if(!run?.history.length||lastResult.won)return;const i=run.history.pop();run.turns[i]=(run.turns[i]+3)%4;run.moves=Math.max(0,run.moves-1);hintIndex=null;save("run."+level.id,run);sound.play("undo");update(i,"Last turn undone.");});
  el("hint").addEventListener("click",()=>{if(lastResult.won)return;const i=Engine.hint(level,run.turns);if(i==null)return;hintIndex=i;run.hinted=true;save("run."+level.id,run);sound.play("hint");update(null,"Try the glowing ring in row "+(Math.floor(i/level.cols)+1)+", column "+(i%level.cols+1)+".");board.focusTile(i);});
  el("reset").addEventListener("click",()=>{
    showDialog("reset",'<p class="eyeline">Light tracks</p><h2 id="dialog-title">Restart this puzzle?</h2><p>Your lantern seals and best score stay in your album.</p><div class="dialog-actions"><button class="paper-button" id="cancel-reset">Keep playing</button><button class="gold-button" id="do-reset">Restart puzzle</button></div>',"#cancel-reset");
    el("cancel-reset").addEventListener("click",clearDialog);el("do-reset").addEventListener("click",()=>{clearDialog();run=fresh(level);save("run."+level.id,run);hintIndex=null;update();});
  });
  function mountIsland(id) {
    if(!window.LanternIsland?.mount) {
      el("island-host").innerHTML='<div class="workbench"><h2>Choose a landmark</h2><p>The 3D view could not start on this browser. Every puzzle is available here.</p><div class="dialog-actions">'+levels.map(l=>'<a class="sub-link" href="#play/'+l.id+'">'+scenes[l.id].name+'</a>').join("")+'</div></div>';return;
    }
    island=window.LanternIsland.mount(el("island-host"),{
      initialId:id, completed,
      onArrive:placeId=>{
        if(page!=="island"||!byId.has(placeId)||!location.hash.startsWith("#island"))return;
        save("island-last",placeId);
        const previous=location.hash.slice(1).split("/")[1];
        if(previous===placeId)return;
        const crossesDoor=byId.has(previous)&&((previous==="hollow")!==(placeId==="hollow"));
        const hash="#island/"+placeId;
        if(crossesDoor)history.pushState(null,"",hash);
        else history.replaceState(null,"",hash);
      },
      onEnter:placeId=>{if(byId.has(placeId))go("play/"+placeId);}
    });
  }
  function route() {
    clearTimeout(winTimer); clearDialog();if(island){island.destroy();island=null;}
    const [part,id]=location.hash.slice(1).split("/");
    page=part==="play"&&byId.has(id)?"play":part==="album"?"album":part==="island"?"island":"home";
    document.querySelectorAll(".screen").forEach(node=>{node.hidden=node.id!==page;});
    document.querySelectorAll("[data-nav]").forEach(a=>{if(a.dataset.nav===page)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
    if(page==="home")renderHome();else if(page==="album")renderAlbum();else if(page==="island")mountIsland(byId.has(id)?id:(byId.has(read("island-last",read("last")))?read("island-last",read("last")):"canopy"));else prepare(byId.get(id));
    document.title=(page==="play"?scenes[id].name+" · ":page==="island"?"3D Island · ":page==="album"?"Art Album · ":"")+"Lantern Night · Lucas's World";
    window.scrollTo(0,0);
    if(focusOnRoute){const heading=el(page).querySelector("h1");heading.tabIndex=-1;heading.focus({preventScroll:true});}
    focusOnRoute=true;
  }
  window.addEventListener("hashchange",route);
  window.addEventListener("storage",e=>{if(!e.key?.startsWith(key))return;
    if(e.key===key+"sound"){soundOn=read("sound",false)===true;applySound();}
    else if(page==="home")renderHome();else if(page==="album")renderAlbum();else if(page==="island")island?.update?.();
    else if(page==="play"&&(e.key===key+"run."+level.id||e.key===key+"best."+level.id)){run=loadRun(level);hintIndex=null;update();}
  });
  applySound();route();
})();
