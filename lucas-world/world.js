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
    {id:"cat",name:"Kitten",hint:"Who’s wearing a yellow neckerchief under the tree?",story:"The kitten closes its eyes and nudges its head against your hand.",again:"Pet the kitten again",say:["Meow! Sit with me!","Purrr. Right there!","Meow! You’re back!"],world:[31.2,49.5,13,29],painting:[54.3,26.7,11,14]},
    {id:"bee",name:"Honeybee",hint:"Hear that buzz in the branches? Look for a guest in stripes.",story:"The bee loops over the blanket. A little cloud of pollen drifts behind it.",again:"Fly another loop",say:["Bzzz! Come find some nectar!","Around we go!"],world:[83.2,21.7,10,21],painting:[13.7,33.4,14,10]},
    {id:"apple",name:"Apple",hint:"What’s round, red and basking in the sun on a branch?",story:"The branch gives a shake. A ripe red apple drops and rolls toward you.",again:"Shake the tree",say:["Plop! A ripe one!","Catch the next one!"],world:[50.3,25.4,8,12],painting:[29.7,28.2,7.5,9]},
    {id:"fruit",name:"Fruit basket",hint:"Which woven basket is piled high with fruit?",story:"You peek into the basket. The grapes are tucked up against the apples.",again:"Peek inside again",say:["Help yourself to some fruit!","One more at the bottom!"],world:[52.3,54,17,28],painting:[32.2,40.1,17,16]},
    {id:"cake",name:"Layer cake",hint:"Can you spot the treat with layers of different colors?",story:"You slice off a little corner. Each layer tastes a little different.",again:"Cut another slice",say:["The sweetest slice is yours!","Cream, cake, then cream again!"],world:[84.1,62.5,10,18],painting:[90.6,46.5,12,9]},
    {id:"flower",name:"Blossom",hint:"Find a pink blossom and give its petals a gentle tap.",story:"A breeze sets the petals spinning like tiny waving hands.",again:"Send the petals flying",say:["A petal for you!","Here comes the breeze!"],world:[7.4,85.2,7.6,13],painting:[65.1,20.1,8,7]}
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
      slot.setAttribute("aria-label", item.name + (collected ? ", read your discovery" : ", get a clue"));
      slot.addEventListener("click", () => selectEntry(item));
      el("stamp-grid").append(slot);
      const entry = document.createElement("button");
      entry.className = "journal-entry" + (collected ? " found" : "");
      entry.innerHTML = stamp(item.id) + "<span><b>" + item.name + "</b><small>" + (collected ? item.story : "Still hiding in the picture") + "</small></span>";
      entry.addEventListener("click", () => { location.hash = scene; showView(scene); selectEntry(item, true); });
      el("journal-grid").append(entry);
    }
  }
  function showHint(item, locate = false) {
    activeId = null;
    hintId = item?.id || null;
    const complete = found.size === items.length;
    el("hint-label").textContent = !item && complete ? "All six stamps!" : "Picnic clue";
    el("hint-text").textContent = item ? item.hint : "All six picnic discoveries now have a place in your journal.";
    el("next-hint").hidden = !item && complete;
    el("note-action").hidden = !complete || !!item;
    if (!item && complete) {
      el("note-action").textContent = "Open my journal";
      el("note-action").onclick = () => { location.hash = "book"; };
    }
    if (locate && item) highlight(item.id);
    renderCollection();
  }
  function showDiscovery(item) {
    activeId = item.id;
    hintId = null;
    el("hint-label").textContent = "Stamp collected · " + item.name;
    el("hint-text").textContent = item.story;
    el("next-hint").hidden = false;
    el("note-action").hidden = false;
    el("note-action").textContent = item.again;
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
      speak("You found all six stamps! Open your journal to see them again.");
    } else {
      showDiscovery(item);
      speak((isNew ? "You earned the " + item.name.toLowerCase() + " stamp. " : "") + message);
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
        button.setAttribute("aria-label", "Find the " + item.name.toLowerCase());
        if (index === 0) button.innerHTML = '<span class="pin" aria-hidden="true"></span>';
        else { button.tabIndex = -1; button.setAttribute("aria-hidden","true"); }
        button.addEventListener("click", () => discover(item,bounds));
        el("hotspots").append(button);
      });
    }
  }
  function updateTip() {
    el("canvas-tip").textContent = small() && scene === "world" ? "Swipe to explore. Tap to collect." : "Tap the picture to collect stamps.";
  }
  function showView(next) {
    view = ["world","painting","book"].includes(next) ? next : "world";
    document.querySelectorAll("[data-nav]").forEach(a => {
      if (a.dataset.nav === view) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
    });
    el("explorer").hidden = view === "book";
    el("journal").hidden = view !== "book";
    const isOriginal = view === "painting";
    el("heading").innerHTML = view === "book" ? 'My <span class="underline">Field Journal</span>' : isOriginal ? 'The Original <span class="underline">Painting</span>' : 'Picnic Under the <span class="underline">Apple Tree</span>';
    el("subheading").textContent = view === "book" ? "Each stamp holds a little memory from under the apple tree." : isOriginal ? "Here’s the picnic as Lucas drew it. Can you find the same six stamps in his painting?" : "Who’s come to Lucas’s picnic? Tap the picture to meet the guests and collect six stamps.";
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
    img.alt = isOriginal ? "Lucas’s original painting of a kitten, bees, fruit and treats beside a yellow-and-white checkered blanket." : "A kitten in a yellow neckerchief sits under an apple tree. Two bees hover over the checkered picnic blanket.";
    el("mode-label").textContent = isOriginal ? "Original art" : "Storybook scene";
    if (changed) { el("bubble").hidden = true; el("effects").replaceChildren(); pan.scrollLeft = 0; }
    updateTip();
    renderSpots();
    if (!activeId && !hintId) showHint(items.find(item => !found.has(item.id)) || null);
  }
  function renderSound() {
    el("sound").setAttribute("aria-pressed",sound);
    el("sound").setAttribute("aria-label",sound ? "Turn sound off" : "Turn sound on");
    el("sound").querySelector("span").textContent = sound ? "Sound on" : "Sound off";
    setIcon(el("sound").querySelector("i"),sound ? "volume" : "mute");
  }
  el("sound").addEventListener("click", () => {
    sound = !sound; writeValue("lucas.picnic.sound", sound ? "on" : "off");
    renderSound(); window.PicnicFX.chime(sound);
  });
  el("markers").addEventListener("click",() => {
    const enabled = frame.classList.toggle("markers-off") === false;
    el("markers").setAttribute("aria-pressed",enabled);
    speak(enabled ? "Markers are visible." : "Markers are hidden. You can still tap the picture.");
  });
  el("next-hint").addEventListener("click",nextHint);
  function zoomLabel(isOpen) {
    setIcon(el("expand").querySelector("i"),isOpen ? "shrink" : "expand");
    el("expand").title = isOpen ? "Close enlarged picture" : "Enlarge picture";
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
