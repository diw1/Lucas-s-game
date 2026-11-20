(() => {
  "use strict";

  const el = id => document.getElementById(id);
  const shapes = {
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16.5 7.5-3 6-6 3 3-6z"/>',
    book: '<path d="M3 4.5c3.2-.8 6.1-.1 9 1.8 2.9-1.9 5.8-2.6 9-1.8v14c-3.3-.8-6.1-.1-9 1.8-2.9-1.9-5.7-2.6-9-1.8zM12 6.5v13"/>',
    picture: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m4 17 5-5 3 3 4-6 5 7"/><circle cx="8" cy="8.5" r="1"/>',
    mute: '<path d="m4 9 4 0 5-4v14l-5-4H4zM17 9l5 6m0-6-5 6"/>',
    volume: '<path d="m3 9 4 0 5-4v14l-5-4H3zM15.5 8.5a5 5 0 0 1 0 7M18 5a9.5 9.5 0 0 1 0 14"/>',
    hand: '<path d="M8 12.5 6.8 7.2c-.7-2.4 2-3.1 2.7-.9l1.6 5.1-.7-7.1c-.2-2 2.5-2.2 2.7-.2l.7 6.4.7-5.1c.3-1.9 2.7-1.4 2.5.5l-.4 5.3 1-2.9c.7-1.8 2.8-1 2.4.8l-1.5 7.5c-.9 4.4-5.8 6.1-9.5 3.2L3 14.1c-1.4-1.4.1-3.4 1.8-2.4l3.2 2.1"/>',
    "map-pin": '<path d="M19.5 10c0 5.3-7.5 11-7.5 11S4.5 15.3 4.5 10a7.5 7.5 0 1 1 15 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    expand: '<path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/>',
    shrink: '<path d="M4 8h4V4m8 0v4h4M8 20v-4H4m16 0h-4v4"/>',
    pencil: '<path d="m4 16-1 5 5-1L20 8l-4-4zM14 6l4 4M4 16l4 4"/>',
    bulb: '<path d="M8 15a6 6 0 1 1 8 0c-1 .8-1.5 1.6-1.5 3h-5c0-1.4-.5-2.2-1.5-3zM10 21h4M12 1V0M2 9H1m22 0h-1"/>',
    refresh: '<path d="M20 5v5h-5M4 19v-5h5"/><path d="M19.1 10a7.2 7.2 0 0 0-12.2-4M4.9 14a7.2 7.2 0 0 0 12.2 4"/>',
    arrow: '<path d="M3 12h16m-6-6 6 6-6 6"/>',
    sprout: '<path d="M12 21c0-6-1-9-6-12m6 8c.3-4 2.7-7.5 6-10M4 6c5 0 8 3 7 7-5 1-8-2-8-7Zm16-3c1 6-2 10-7 10-1-5 1-9 7-10Z"/>'
  };
  const icon = key => '<svg viewBox="0 0 24 24" aria-hidden="true">' + shapes[key] + '</svg>';
  const setIcon = (element, key) => { element.dataset.icon = key; element.innerHTML = icon(key); };
  document.querySelectorAll("[data-icon]").forEach(i => setIcon(i, i.dataset.icon));
  document.querySelectorAll("[data-stamp]").forEach(node => { node.innerHTML = window.PicnicStamps[node.dataset.stamp]; });

  // Each target has its own bounds in each painting. All coordinates are percentages of the artwork.
  const items = [
    {id:"cat",name:"小猫",hint:"谁系着黄色的小领巾，坐在树下等你？",story:"小猫眯起眼，轻轻把脑袋蹭进你的手心。",again:"再摸摸它",say:["喵呜！一起野餐吧。","呼噜噜……好舒服！","喵，你又来啦！"],world:[31.2,49.5,13,29],painting:[54.3,26.7,11,14]},
    {id:"bee",name:"蜜蜂",hint:"树梢边传来嗡嗡声，找找穿条纹衫的小客人。",story:"蜜蜂绕了一个小圈，把花香带到了野餐布上。",again:"再飞一圈",say:["嗡嗡！跟我去采花蜜。","飞一圈，再转个弯！"],world:[83.2,21.7,10,21],painting:[13.7,33.4,14,10]},
    {id:"apple",name:"苹果",hint:"有个红彤彤的小家伙，正挂在树枝上晒太阳。",story:"枝头摇了摇，一颗红苹果咕噜噜地滚下来。",again:"摇摇苹果树",say:["扑通！苹果熟啦。","再接住一颗！"],world:[50.3,25.4,8,12],painting:[29.7,28.2,7.5,9]},
    {id:"fruit",name:"果篮",hint:"哪只编织篮里，挤满了圆滚滚的水果？",story:"掀开篮子，葡萄和苹果挤在一起，满满都是果香。",again:"翻翻果篮",say:["葡萄、苹果，分你一份！","篮底还藏着一颗！"],world:[52.3,54,17,28],painting:[32.2,40.1,17,16]},
    {id:"cake",name:"蛋糕",hint:"野餐布上有一块彩色的点心，数数它有几层。",story:"切下一小角，每一层都是不一样的甜。",again:"再切一小块",say:["给你留了最甜的一块！","一层奶油，一层惊喜！"],world:[84.1,62.5,10,18],painting:[90.6,46.5,12,9]},
    {id:"flower",name:"小花",hint:"找一朵粉色的小花，轻轻碰一碰它的花瓣。",story:"花瓣乘着风打了个转，像在向你招手。",again:"让花瓣飞起来",say:["一片花瓣，送给你！","风来了，跳个舞吧！"],world:[7.4,85.2,7.6,13],painting:[65.1,20.1,8,7]}
  ];
  // Other clearly drawn examples of the same object also respond to a tap.
  const extras = {
    world:{bee:[[73,28,7.5,12]],apple:[[7.5,36,8,12],[30,29,8,12],[70.8,12,7,12]],flower:[[96.8,71.4,6,12],[10.8,6.6,9,13],[18.3,91,7,12],[31,4.8,6,11],[61,6.8,7,12],[62,20,6,11]],fruit:[[66.8,59,12,18]]},
    painting:{bee:[[13.4,40.3,11,7]],apple:[[17.6,24.8,5.7,7],[74.3,10.7,5.5,5.7]],flower:[[6.1,21.5,6,7],[35.7,18.9,7,7],[53.9,2.9,7,5],[3.9,10.3,6,6],[88.6,7.3,8,8],[24.8,3.6,7,7]],fruit:[[24.7,50.2,17,12],[73,45,14,12]]}
  };
  const storageKey = "lucas.picnic.stamps.v1";
  function readValue(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function writeValue(key, value) { try { localStorage.setItem(key, value); } catch { /* Play stays available during this visit. */ } }
  let initial = [];
  try { const saved = JSON.parse(readValue(storageKey) || "[]"); if (Array.isArray(saved)) initial = saved; } catch { /* A new book can always be opened. */ }
  const found = new Set(initial.filter(id => items.some(item => item.id === id)));
  const counts = new Map();
  const frame = el("frame"), pan = el("scene-pan"), stage = el("stage"), lightbox = el("lightbox");
  let sound = readValue("lucas.picnic.sound") === "on";
  let view = "world", scene = "world", activeId = null, hintId = null, bubbleTimer = 0, spotlightTimer = 0;
  const small = () => window.matchMedia("(max-width:585px)").matches;
  const stamp = id => '<span class="art" aria-hidden="true">' + window.PicnicStamps[id] + '</span>';
  const speak = message => { el("announce").textContent = message; };
  const save = () => writeValue(storageKey, JSON.stringify([...found]));

  function renderCollection() {
    el("count").textContent = el("journal-count").textContent = found.size;
    const track = document.querySelector(".progress-track");
    track.setAttribute("aria-valuenow", found.size);
    track.firstElementChild.style.width = (found.size / items.length * 100) + "%";
    el("stamp-grid").replaceChildren();
    el("journal-grid").replaceChildren();
    for (const item of items) {
      const collected = found.has(item.id);
      const slot = document.createElement("button");
      slot.className = "slot" + (collected ? " found" : "") + (item.id === activeId ? " selected" : "");
      slot.innerHTML = stamp(item.id) + '<span class="slot-label">' + item.name + '</span>';
      slot.setAttribute("aria-label", item.name + (collected ? "，查看发现" : "，查看线索"));
      slot.addEventListener("click", () => selectEntry(item));
      el("stamp-grid").append(slot);
      const entry = document.createElement("button");
      entry.className = "journal-entry" + (collected ? " found" : "");
      entry.innerHTML = stamp(item.id) + "<span><b>" + item.name + "</b><small>" + (collected ? item.story : "尚未发现 · 去画里找找") + "</small></span>";
      entry.addEventListener("click", () => { location.hash = scene; showView(scene); selectEntry(item, true); });
      el("journal-grid").append(entry);
    }
  }
  function showHint(item, locate = false) {
    activeId = null;
    hintId = item?.id || null;
    const complete = found.size === items.length;
    el("hint-label").textContent = !item && complete ? "六枚印章集齐啦！" : "探索小提示";
    el("hint-text").textContent = item ? item.hint : "这场野餐的六位老朋友，都住进了你的手记。";
    el("next-hint").hidden = !item && complete;
    el("note-action").hidden = !complete || !!item;
    if (!item && complete) {
      el("note-action").textContent = "翻开我的手记 →";
      el("note-action").onclick = () => { location.hash = "book"; };
    }
    if (locate && item) highlight(item.id);
    renderCollection();
  }
  function showDiscovery(item) {
    activeId = item.id;
    hintId = null;
    el("hint-label").textContent = "已盖章 · " + item.name;
    el("hint-text").textContent = item.story;
    el("next-hint").hidden = false;
    el("note-action").hidden = false;
    el("note-action").textContent = item.again + " →";
    el("note-action").onclick = () => { highlight(item.id); discover(item, item[scene]); };
    renderCollection();
  }
  function nextHint() {
    const missing = items.filter(item => !found.has(item.id));
    if (!missing.length) { showHint(null); return; }
    const next = (missing.findIndex(item => item.id === hintId) + 1) % missing.length;
    showHint(missing[next], true);
  }
  function selectEntry(item, bringToView = false) {
    if (found.has(item.id)) { showDiscovery(item); highlight(item.id); }
    else showHint(item, true);
    if (bringToView) frame.scrollIntoView({block:"center", behavior:"instant"});
    speak(found.has(item.id) ? item.story : item.hint);
  }
  function highlight(id) {
    stage.querySelectorAll(".spotlight").forEach(node => node.classList.remove("spotlight"));
    const target = el("hotspots").querySelector('[data-item="' + id + '"]');
    if (!target) return;
    target.classList.add("spotlight");
    if (pan.scrollWidth > pan.clientWidth + 1) {
      pan.scrollTo({left:target.offsetLeft - pan.clientWidth / 2, behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
    }
    clearTimeout(spotlightTimer);
    spotlightTimer = setTimeout(() => target.classList.remove("spotlight"), 4000);
  }
  function showSpeech(message, x, y) {
    clearTimeout(bubbleTimer);
    const bubble = el("bubble");
    bubble.textContent = message;
    bubble.style.left = Math.min(80, Math.max(20, x)) + "%";
    bubble.style.top = Math.max(18, y - 8) + "%";
    bubble.hidden = false;
    bubbleTimer = setTimeout(() => { bubble.hidden = true; }, 2600);
  }
  function discover(item, bounds) {
    const isNew = !found.has(item.id);
    const repeat = counts.get(item.id) || 0;
    counts.set(item.id, repeat + 1);
    if (isNew) { found.add(item.id); save(); }
    stage.querySelectorAll('[data-item="' + item.id + '"]').forEach(node => node.classList.add("found"));
    const [x,y] = bounds;
    window.PicnicFX.play(item.id, el("effects"), x, y, sound);
    const message = item.say[repeat % item.say.length];
    showSpeech(message, x, y);
    if (isNew && found.size === items.length) {
      showHint(null);
      window.PicnicFX.chime(sound);
      speak("六枚印章集齐啦！可以翻开手记回顾这场野餐。");
    } else {
      showDiscovery(item);
      speak((isNew ? "收集到" + item.name + "印章。" : "") + message);
    }
  }
  function renderSpots() {
    el("hotspots").replaceChildren();
    for (const item of items) {
      const regions = [item[scene], ...(extras[scene][item.id] || [])];
      regions.forEach((bounds, index) => {
        const [x,y,w,h] = bounds;
        const button = document.createElement("button");
        button.className = "spot" + (found.has(item.id) ? " found" : "");
        button.dataset.item = item.id;
        button.style.cssText = "left:"+x+"%;top:"+y+"%;width:"+w+"%;height:"+h+"%";
        button.setAttribute("aria-label", "探索" + item.name);
        if (index === 0) button.innerHTML = '<span class="pin" aria-hidden="true"></span>';
        else { button.tabIndex = -1; button.setAttribute("aria-hidden","true"); }
        button.addEventListener("click", () => discover(item,bounds));
        el("hotspots").append(button);
      });
    }
  }
  function updateTip() {
    el("canvas-tip").textContent = small() && scene === "world" ? "左右滑动画面，点一点探索" : "点击画中事物，收集印章";
  }
  function showView(next) {
    view = ["world","painting","book"].includes(next) ? next : "world";
    document.querySelectorAll("[data-nav]").forEach(a => {
      if (a.dataset.nav === view) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
    });
    el("explorer").hidden = view === "book";
    el("journal").hidden = view !== "book";
    const isOriginal = view === "painting";
    el("heading").innerHTML = view === "book" ? '我的<span class="underline">发现手记</span>' : isOriginal ? '画里的<span class="underline">野餐</span>' : '树下的<span class="underline">野餐</span>';
    el("subheading").textContent = view === "book" ? "每枚印章，都记着你在苹果树下遇见的一位朋友。" : isOriginal ? "这是 Lucas 亲手画的野餐世界。点点原画，也能找到同一组印章。" : "走进 Lucas 的画里，点点树下的小伙伴，把新发现盖进手记。";
    if (view === "book") { renderCollection(); return; }
    const changed = scene !== view;
    scene = view;
    frame.classList.toggle("original-mode",isOriginal);
    const img = el("scene-image");
    const file = isOriginal ? "assets/original.jpg" : "assets/orchard.webp";
    if (img.getAttribute("src") !== file) {
      img.width = isOriginal ? 880 : 1774;
      img.height = isOriginal ? 1108 : 887;
      img.src = file;
    }
    img.alt = isOriginal ? "Lucas 的野餐原画。小猫、蜜蜂、水果和点心围着一块黄白格纹野餐布。" : "苹果树下有一只戴黄领巾的小猫，两只蜜蜂在格纹野餐布上方飞舞。";
    el("mode-label").textContent = isOriginal ? "画家原作" : "绘本场景";
    if (changed) { el("bubble").hidden = true; el("effects").replaceChildren(); pan.scrollLeft = 0; }
    updateTip();
    renderSpots();
    if (!activeId && !hintId) showHint(items.find(item => !found.has(item.id)) || null);
  }
  function renderSound() {
    el("sound").setAttribute("aria-pressed",sound);
    el("sound").setAttribute("aria-label",sound ? "关闭声音" : "开启声音");
    el("sound").querySelector("span").textContent = sound ? "声音开" : "声音关";
    setIcon(el("sound").querySelector("i"),sound ? "volume" : "mute");
  }
  el("sound").addEventListener("click", () => {
    sound = !sound; writeValue("lucas.picnic.sound", sound ? "on" : "off");
    renderSound(); window.PicnicFX.chime(sound);
  });
  el("markers").addEventListener("click",() => {
    const enabled = frame.classList.toggle("markers-off") === false;
    el("markers").setAttribute("aria-pressed",enabled);
    speak(enabled ? "标记已显示" : "标记已隐藏，仍可点击画中事物。");
  });
  el("next-hint").addEventListener("click",nextHint);
  function zoomLabel(isOpen) {
    setIcon(el("expand").querySelector("i"),isOpen ? "shrink" : "expand");
    el("expand").title = isOpen ? "退出放大" : "放大画面";
    el("expand").setAttribute("aria-label",el("expand").title);
  }
  el("expand").addEventListener("click",() => {
    if (lightbox.open) { lightbox.close(); return; }
    el("zoom-home").append(frame); document.body.classList.add("zooming");
    lightbox.showModal(); zoomLabel(true); el("expand").focus({preventScroll:true});
  });
  lightbox.addEventListener("close",() => {
    el("frame-home").prepend(frame); document.body.classList.remove("zooming");
    zoomLabel(false); el("expand").focus({preventScroll:true});
  });
  lightbox.addEventListener("click",event => { if (event.target === lightbox) lightbox.close(); });
  window.addEventListener("hashchange",() => {
    if (lightbox.open) lightbox.close();
    showView(location.hash.slice(1));
  });
  window.matchMedia("(max-width:585px)").addEventListener("change",updateTip);
  renderSound();
  showView(location.hash.slice(1));
})();
