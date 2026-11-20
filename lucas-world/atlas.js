(() => {
  "use strict";
  const el = id => document.getElementById(id);
  const places = window.LucasPlaces;
  const byId = new Map(places.map(place => [place.id, place]));
  const glyphs = {
    map:'<path d="m3 5 6-2 6 3 6-2v15l-6 2-6-3-6 2zM9 3v15m6-12v15"/>',
    frame:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.3"/><path d="m4 17 5-5 3 3 4-5 5 6"/>',
    book:'<path d="M5 3h13a2 2 0 0 1 2 2v16H7a3 3 0 0 1-3-3V5a2 2 0 0 1 1-2Zm-1 15c0-1.3 1.2-2.4 3-2.4h13M8 3v12.5"/><circle cx="14" cy="9" r="2.5"/>',
    mute:'<path d="M3 9h4l5-4v14l-5-4H3zM16 9l5 6m0-6-5 6"/>',
    volume:'<path d="M3 9h4l5-4v14l-5-4H3zM15 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m16.4 7.6-3 5.8-5.8 3 3-5.8z"/>',
    pencil:'<path d="m4 16-1 5 5-1L20 8l-4-4zM14 6l4 4M4 16l4 4"/>',
    pin:'<path d="M19 9.5c0 5.2-7 11-7 11s-7-5.8-7-11a7 7 0 1 1 14 0Z"/><circle cx="12" cy="9.5" r="2"/>',
    check:'<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3.3 3.3 6-7"/>',
    expand:'<path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/>',
    close:'<path d="m5 5 14 14m0-14L5 19"/>',
    hand:'<path d="M8.5 13 6.7 7.3c-.5-1.8 1.8-2.3 2.3-.8l1.4 4.2-.5-6.2c-.1-1.9 2.5-2.1 2.6-.2l.6 6.2.9-4.8c.3-1.7 2.6-1.2 2.4.5l-.5 5.3 1.3-3c.6-1.5 2.7-.7 2.2.9l-1.6 6.8c-.9 4.4-5.8 6.2-9.3 3.1l-5.2-5.2c-1.4-1.4.1-3.2 1.7-2.1l3.2 2z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'
  };
  function glyph(name) { return '<i data-glyph="'+name+'" aria-hidden="true"><svg viewBox="0 0 24 24">'+glyphs[name]+'</svg></i>'; }
  document.querySelectorAll("i[data-glyph]").forEach(node => { node.outerHTML = glyph(node.dataset.glyph); });
  el("post-sun").innerHTML = window.PicnicStamps.sun;
  const destinations = {
    canopy:[35,16,53,29], castle:[81,17,24,27],
    picnic:[17,47,26,25], bakery:[50,45,26,26], stage:[83,46,23,26],
    cat:[20,73,23,28], parade:[51,74,24,28], reef:[82.5,77,24,26]
  };
  const tints = {picnic:"#e4e7c9",canopy:"#dbe6d2",hollow:"#e8debf",bakery:"#e7e6ce",stage:"#eedfcd",castle:"#eadbbc",cat:"#d2e7de",parade:"#eddfd3",reef:"#cde6e4"};
  const keys = {sound:"lucas.picnic.sound", picnic:"lucas.picnic.stamps.v1", mail:"lucas.world.mail.v1"};
  const memory = new Map();
  function read(key) { try { return localStorage.getItem(key) ?? memory.get(key); } catch { return memory.get(key); } }
  function write(key,value) { memory.set(key,value); try { localStorage.setItem(key,value); } catch { /* Current visit works with storage disabled. */ } }
  function picnicFinds() {
    try { const values = JSON.parse(read(keys.picnic) || "[]"); return new Set(Array.isArray(values) ? values : []); }
    catch { return new Set(); }
  }
  function has(id,spotId) {
    return id === "picnic" ? picnicFinds().has(spotId) : read("lucas.world.find."+id+"."+spotId) === "yes";
  }
  function foundCount(place) { return place.spots.reduce((sum,spot) => sum + Number(has(place.id,spot.id)),0); }
  function earned(place) { return foundCount(place) === place.spots.length; }
  let sound = read(keys.sound) === "on";
  let noticeTimer;
  function notify(message) {
    el("notice").textContent = message;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => { el("notice").textContent = ""; },3800);
  }
  function refreshSound() {
    const button = el("sound");
    button.innerHTML = glyph(sound ? "volume" : "mute") + "<span>"+(sound ? "声音开" : "声音关")+"</span>";
    button.setAttribute("aria-pressed",String(sound));
    button.setAttribute("aria-label",sound ? "关闭声音" : "打开声音");
  }
  el("sound").addEventListener("click",() => {
    sound = !sound;
    write(keys.sound,sound ? "on" : "off"); refreshSound();
    window.PicnicFX.chime(sound);
  });
  const mailRoute = [
    ["picnic","第一封信放在野餐布上。点点画里的朋友，帮小猫捎句话。"],
    ["canopy","小猫邀树屋的朋友来野餐。点点屋里屋外，把邀请送到。"],
    ["hollow","考拉从屋外捎来一片叶子。推开树屋的门，让屋里的朋友猜猜它的香气。"],
    ["bakery","树屋里的朋友想用一颗橡果，换一份刚出炉的小面包。"],
    ["stage","面包师把点心包好了，请你捎给正在舞台上排练的朋友。"],
    ["castle","舞台上的演员想办一场夜间演出。到南瓜城堡敲一敲门吧。"],
    ["cat","城堡寄来了一张星星贴纸。到花园里，把它送给蓝眼睛的小猫。"],
    ["parade","花园小猫想把一朵花送给庆典上的朋友。快去听听欢呼声。"],
    ["reef","庆典的最后一张邀请函，要交给珊瑚海湾里的朋友。"]
  ];
  function mailStep() {
    const raw = read(keys.mail);
    if (raw == null) return -1;
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n <= mailRoute.length ? n : -1;
  }
  let current = "map", currentPlace = null, hasRouted = false;
  function renderMail() {
    const n = mailStep();
    const onRoute = n >= 0 && n < mailRoute.length;
    const id = onRoute ? mailRoute[n][0] : null;
    const done = n === mailRoute.length;
    el("mail-title").textContent = onRoute ? "寄往 · "+byId.get(id).name : done ? "九封信，都送到了！" : "小猫有一封信";
    el("mail-body").textContent = onRoute ? mailRoute[n][1] : done ? "从树下的野餐到珊瑚海湾，岛上的朋友都收到了问候。" : "从野餐布旁出发，把朋友的问候一站一站送遍小岛。";
    el("mail-button").innerHTML = glyph(done ? "book" : "mail")+(done ? "看看旅行护照" : onRoute ? "去"+byId.get(id).name : "领取第一封信");
    const belt = el("delivery-belt");
    belt.hidden = current !== "visit" || n < 0;
    if (belt.hidden) return;
    if (done) { belt.innerHTML = "<span>"+glyph("mail")+" 邮路走完了，九封信都已送达。</span><a href='#passport'>翻开旅行护照</a>"; return; }
    const atDestination = currentPlace?.id === id;
    belt.innerHTML = "<span>"+glyph("mail")+(atDestination ? "你带着寄往这里的信。点一下原画里的事物，就能把信送到。" : "邮袋里有一封寄往「"+byId.get(id).name+"」的信。")+"</span>"+(atDestination ? "" : "<a href='#place/"+id+"'>去送信</a>");
  }
  el("mail-button").addEventListener("click",() => {
    let n = mailStep();
    if (n === -1) { n = 0; write(keys.mail,"0"); }
    if (n === mailRoute.length) { location.hash = "passport"; return; }
    location.hash = "place/"+mailRoute[n][0];
  });
  function discover(id,spotId) {
    const place = byId.get(id);
    if (!place || !place.spots.some(s => s.id === spotId)) return false;
    const fresh = !has(id,spotId);
    if (fresh) {
      if (id === "picnic") { const values = picnicFinds(); values.add(spotId); write(keys.picnic,JSON.stringify([...values])); }
      else write("lucas.world.find."+id+"."+spotId,"yes");
    }
    const n = mailStep();
    let note = fresh && earned(place) ? "盖上了「"+place.stamp+"」原画印章！" : "";
    if (n >= 0 && n < mailRoute.length && mailRoute[n][0] === id) {
      write(keys.mail,String(n+1));
      note += (note ? " " : "") + (n+1 === mailRoute.length ? "最后一封信也送到了！" : "信送到了！下一站是"+byId.get(mailRoute[n+1][0]).name+"。");
    }
    if (note) notify(note);
    renderMail();
    return fresh;
  }
  function drawMap() {
    const pins = el("map-pins"); pins.replaceChildren();
    for (const place of places) {
      if (place.id === "hollow") continue; // Both sides of the treehouse share its island entrance.
      const [x,y,w,h] = destinations[place.id];
      const landmarkName = place.id === "canopy" ? "森林树屋" : place.name;
      const pin = document.createElement("a");
      const complete = earned(place) && (place.id !== "canopy" || earned(byId.get("hollow")));
      pin.className = "map-pin"+(complete ? " earned" : "");
      pin.href = "#place/"+place.id; pin.setAttribute("aria-label","走进"+landmarkName);
      pin.style.cssText = "left:"+x+"%;top:"+y+"%;width:"+w+"%;height:"+h+"%";
      pin.innerHTML = '<span class="pin-label">'+glyph(complete ? "check" : "pin")+landmarkName+'</span>';
      pins.append(pin);
    }
    const total = places.filter(earned).length;
    el("stamp-total").textContent = total;
    el("cover-progress").innerHTML = places.map(p => '<span class="'+(earned(p)?"done":"")+'"></span>').join("");
  }
  function card(place,gallery) {
    const a = document.createElement("a");
    a.href = "#place/"+place.id;
    const n = foundCount(place), max = place.spots.length;
    if (gallery) {
      a.className = "gallery-card";
      a.style.setProperty("--tint",tints[place.id]);
      a.innerHTML = '<div class="gallery-art"><img src="'+place.src+'" loading="lazy" alt=""></div><div class="gallery-meta"><h2>'+place.name+'</h2><span>'+n+' / '+max+' 个发现</span></div>';
    } else {
      a.className = "passport-card"+(earned(place) ? " earned" : "");
      a.innerHTML = '<span class="stamp-portrait"><img src="'+place.src+'" loading="lazy" alt=""></span><span><h2>'+place.name+'</h2><p>'+place.stamp+'</p><small>'+(n === max ? "已盖章" : "已找到 "+n+" / "+max)+"</small></span>";
    }
    return a;
  }
  function showCollection(gallery) {
    const target = el(gallery ? "gallery-grid" : "passport-grid");
    target.replaceChildren(...places.map(p => card(p,gallery)));
    if (!gallery) {
      const discoveries = places.reduce((s,p) => s+foundCount(p),0);
      const all = places.reduce((s,p) => s+p.spots.length,0);
      el("passport-summary").textContent = "已收集 "+places.filter(earned).length+" / "+places.length+" 枚原画印章，发现 "+discoveries+" / "+all+" 处小秘密。找齐一幅画里的秘密，就能盖上它的印章。";
    }
  }
  const api = Object.freeze({has,discover,sound:() => sound,go:id => { if (byId.has(id)) location.hash = "place/"+id; }});
  const dialog = el("map-dialog"), frame = el("map-card"), zoom = el("zoom");
  function restoreMap() {
    el("map-home").append(frame); document.body.classList.remove("map-zoom");
    zoom.innerHTML = glyph("expand"); zoom.setAttribute("aria-label","放大地图"); zoom.title = "放大地图";
    if (current === "map") zoom.focus({preventScroll:true});
  }
  zoom.addEventListener("click",() => {
    if (dialog.open) { dialog.close(); return; }
    el("map-enlarged").append(frame); dialog.showModal(); document.body.classList.add("map-zoom");
    zoom.innerHTML = glyph("close"); zoom.setAttribute("aria-label","收起地图"); zoom.title = "收起地图";
    zoom.focus({preventScroll:true});
  });
  dialog.addEventListener("close",restoreMap);
  dialog.addEventListener("click",e => { if (e.target === dialog) dialog.close(); });
  el("labels").addEventListener("click",() => {
    const hidden = frame.classList.toggle("hide-labels"); el("labels").setAttribute("aria-pressed",String(!hidden));
  });
  function route() {
    const hash = location.hash.substring(1);
    if (["world","painting","book"].includes(hash)) { location.replace("picnic.html#"+hash); return; }
    const [name,id] = hash.split("/");
    currentPlace = name === "place" ? byId.get(id) : null;
    current = currentPlace ? "visit" : ["gallery","passport"].includes(name) ? name : "map";
    if (dialog.open) dialog.close();
    document.querySelectorAll(".atlas-page").forEach(page => { page.hidden = page.id !== current+"-page"; });
    document.querySelectorAll("[data-section]").forEach(a => {
      if (a.dataset.section === current) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
    });
    document.title = current === "map" ? "Lucas's World" : (currentPlace?.name || (current === "gallery" ? "原画集" : "旅行护照"))+" · Lucas's World";
    if (current === "map") drawMap();
    else if (current === "visit") window.LucasVisit.show(el("visit-mount"),currentPlace,api);
    else showCollection(current === "gallery");
    renderMail(); window.scrollTo(0,0);
    if (hasRouted) {
      const heading = el(current+"-page").querySelector("h1");
      if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    }
    hasRouted = true;
  }
  function reloadProgress() {
    sound = read(keys.sound) === "on"; refreshSound();
    if (current === "map") drawMap();
    if (current === "gallery" || current === "passport") showCollection(current === "gallery");
    if (current === "visit" && currentPlace) window.LucasVisit.show(el("visit-mount"),currentPlace,api);
    renderMail();
  }
  window.addEventListener("hashchange",route);
  window.addEventListener("storage", event => { if (event.key == null || event.key.startsWith("lucas.")) reloadProgress(); });
  window.addEventListener("pageshow",event => { if (event.persisted) reloadProgress(); });
  refreshSound(); route();
})();
