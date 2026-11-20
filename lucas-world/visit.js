(() => {
  'use strict';

  const icons = {
    map: 'm3 5 6-2 6 3 6-2v15l-6 2-6-3-6 2zm6-2v15m6-12v15',
    door: 'M4 21h16m-13 0V6q0-3 3-3h4q3 0 3 3v15M8 9h8m-3 6h1',
    ladder: 'm5 21 5-18m4 18 5-18M9 7h9m-11 5h9M6 17h9',
    check: 'm5 12 4 4L20 5',
    mark: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Zm-7-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    brush: 'm8 15 9-11q3-3 4-1t-1 4L10 17ZM9 18q-1 5-7 3 3-1 2-4t4-2',
    book: 'M3 5q5-1 9 2 4-3 9-2v14q-5-1-9 2-4-3-9-2Zm9 2v14',
    step: 'M6 18c6 2 9-1 7-4-1-2-5 0-5-4q0-3 7-3M7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm13-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
    sound: 'M4 10h4l5-4v12l-5-4H4Zm13-1q3 3 0 6'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + icons[name] + '"/></svg>';
  }
  function node(tag, cls, value) {
    const el = document.createElement(tag);
    el.className = 'visit-' + cls;
    if (value !== undefined) el.textContent = value;
    return el;
  }
  function action(cls, label, shape) {
    const button = node('button', cls);
    button.type = 'button';
    if (shape) button.innerHTML = icon(shape);
    button.append(node('span','action-label',label));
    return button;
  }

  // Each visual cue has its own mark, flight path, sound and movement of the painted detail.
  const cues = {
    purr:['♥','rise','sway','#c45b5a', [246.94,293.66,246.94]],
    buzz:['∿','spiral','buzz','#a77622',[220,329.63,293.66]],
    drop:['•','fall','shake','#cf6148',[392,329.63,196]],
    rustle:['❧','breeze','shake','#657b43',[293.66,349.23,392]],
    sprinkle:['✧','fall','hop','#cd7271',[523.25,659.25,783.99]],
    petals:['❀','breeze','sway','#cb7495',[392,493.88,587.33]],
    wave:['✦','rise','sway','#71958e',[349.23,440,523.25]],
    knock:['◌','ring','knock','#a77e46',[174.61,174.61]],
    peek:['✦','rise','hop','#9c804e',[329.63,392,523.25]],
    sleep:['z','rise','sway','#6c90aa',[261.63,220,174.61]],
    hum:['♫','rise','sway','#bf7280',[329.63,392,349.23]],
    hop:['✧','rise','hop','#c98b55',[349.23,523.25]],
    steam:['∿','rise','sway','#a48260',[261.63,329.63,392]],
    bob:['○','rise','bob','#4d87a6',[293.66,392,493.88]],
    song:['♪','rise','hop','#bd5881',[392,493.88,587.33,783.99]],
    glow:['✦','burst','glow','#e3a82b',[440,554.37,659.25]],
    trail:['·','trail','crawl','#799252',[261.63,293.66,329.63]],
    flutter:['✧','spiral','flutter','#785b92',[329.63,392,329.63]],
    twinkle:['✧','burst','glow','#468caa',[659.25,783.99,987.77]],
    chime:['✦','burst','glow','#d5a228',[523.25,659.25,783.99]],
    confetti:['▰','fall','hop','#ce675a',[392,523.25,659.25,783.99]],
    bubbles:['○','rise','swim','#4c99aa',[196,293.66,392]],
    swim:['○','trail','swim','#609a8d',[261.63,349.23,392]],
    scuttle:['·','trail','crawl','#ce6e52',[293.66,293.66,392]]
  };
  let audioContext;
  function playSound(cue, enabled) {
    if (!enabled || !(window.AudioContext || window.webkitAudioContext)) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const start = audioContext.currentTime;
      const knock = cue[2] === 'knock';
      cue[4].forEach((pitch, i) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const at = start + i * (knock ? 0.2 : 0.115);
        oscillator.type = knock || cue[2] === 'buzz' ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(pitch, at);
        if (knock) oscillator.frequency.exponentialRampToValueAtTime(62, at + 0.09);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.055, at + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + (knock ? 0.12 : 0.29));
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.32);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } catch { /* Visual responses are available if the device cannot play sound. */ }
  }

  function animate(layer, img, bounds, spot, sound) {
    const [x,y,w,h] = bounds;
    const cue = cues[spot.effect];
    playSound(cue, sound);
    layer.replaceChildren();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ring = node('i','echo');
    ring.style.cssText = 'left:' + x + '%;top:' + y + '%;--visit-ink:' + cue[3];
    layer.append(ring);
    if (!reduced) {
      // Repaint exactly the clicked patch, then move it briefly to animate the original linework.
      const patch = node('div','piece');
      patch.dataset.motion = cue[2];
      const patchW = w * 1.1, patchH = h * 1.1;
      patch.style.cssText = 'left:' + (x-patchW/2) + '%;top:' + (y-patchH/2) + '%;width:' + patchW + '%;height:' + patchH + '%';
      const art = img.cloneNode(false);
      art.removeAttribute('class');
      art.alt = '';
      art.style.cssText = 'width:' + (10000 / patchW) + '%;max-width:none;left:' + ((patchW / 2 - x) / patchW * 100) + '%;top:' + ((patchH / 2 - y) / patchH * 100) + '%';
      patch.append(art);
      layer.prepend(patch);

      const colors = ['#d58a36','#588f83','#c96a82','#8e6995','#75a44f'];
      for (let i=0; i<7; i++) {
        const particle = node('i','particle',cue[0]);
        const angle = (i / 7 * Math.PI * 2) - 1.57;
        const scale = Math.min(1, Math.max(0.55, img.clientWidth / 560));
        const reach = scale * (39 + (i % 3) * 10);
        let dx = Math.cos(angle)*reach, dy = Math.sin(angle)*reach;
        if (cue[1] === 'rise' || cue[1] === 'breeze') {
          dx = (i-3) * 12 * scale + (cue[1] === 'breeze' ? 15 : 0);
          dy = -(30 + (i%3)*20) * scale;
        } else if (cue[1] === 'fall') {
          dx = (i-3)*13*scale;
          dy = (20+(i%3)*16)*scale;
        } else if (cue[1] === 'trail') {
          dx = (18+i*9)*scale;
          dy = (i%2 ? -1 : 1) * (6 + i*1.4) * scale;
        }
        const color = spot.effect === 'confetti' || spot.effect === 'sprinkle' ? colors[i % colors.length] : cue[3];
        particle.style.cssText = 'left:'+x+'%;top:'+y+'%;color:'+color+';--visit-dx:'+dx+'px;--visit-dy:'+dy+'px;--visit-spin:'+(i%2?22:-18)+'deg;--visit-delay:'+(i%3)*55+'ms';
        layer.append(particle);
      }
    }
    // Taking a snapshot avoids an older animation clearing particles from a newer tap.
    const retiring = [...layer.children];
    window.setTimeout(() => retiring.forEach(el => el.remove()), reduced ? 360 : 1400);
  }

  const primaryBounds = spot => [spot.x,spot.y,spot.w,spot.h];
  let focusNextView = false;
  function treeLink(cls,id) {
    const link = node('a',cls);
    link.href = '#place/' + id;
    link.addEventListener('click', event => {
      if (!event.detail && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && link.hash !== location.hash) {
        focusNextView = true;
      }
    });
    return link;
  }
  function show(mount, place, api) {
    const root = node('section','scene');
    const heading = node('header','heading');
    const back = node('a','back'); back.href = '#map';
    back.innerHTML = icon('map'); back.append('Back to the map');
    const title = node('h1','title',place.name);
    const description = node('p','description',place.description);
    heading.append(back,title,description);
    if (place.treehouse) {
      const views = node('nav','views');
      views.setAttribute('aria-label','Treehouse views');
      for (const part of window.LucasPlaces.filter(p => p.treehouse)) {
        const link = treeLink('view',part.id);
        link.textContent = part.treehouse.view;
        if (part.id === place.id) link.setAttribute('aria-current','page');
        views.append(link);
      }
      heading.append(views);
    }

    const layout = node('div','layout');
    const painting = node('section','painting');
    painting.setAttribute('aria-label', place.name + ' interactive painting');
    const tools = node('div','tools');
    const credit = node('span','credit'); credit.innerHTML = icon('brush');
    credit.append('Art by Lucas');
    const markers = action('markers','Hide markers','mark');
    markers.setAttribute('aria-pressed','true');
    tools.append(credit,markers);
    const mat = node('div','mat');
    const canvas = node('div','canvas');
    canvas.style.setProperty('--visit-ratio', place.size[0] / place.size[1]);
    const img = node('img','art');
    img.src = place.src; img.alt = place.name + ', painted by Lucas'; img.width = place.size[0]; img.height = place.size[1];
    img.draggable = false;
    const targets = node('div','targets'), effects = node('div','effects');
    effects.setAttribute('aria-hidden','true');
    const toast = node('div','toast');
    toast.setAttribute('aria-hidden','true');
    toast.hidden = true;
    canvas.append(img,targets,effects,toast);
    if (place.treehouse) {
      const {to,action,where,bounds:[x,y,w,h]} = place.treehouse;
      const portal = treeLink('portal',to);
      portal.style.cssText = 'left:'+x+'%;top:'+y+'%;width:'+w+'%;height:'+h+'%';
      portal.setAttribute('aria-label',action+' using the '+where);
      const sign = node('span','portal-sign');
      sign.innerHTML = icon(place.id === 'canopy' ? 'door' : 'ladder');
      sign.append(action);
      portal.append(sign); canvas.append(portal);
    }
    mat.append(canvas);
    const caption = node('p','caption',place.treehouse ? 'Tap the painting to discover its secrets, or use the '+place.treehouse.where+' to '+place.treehouse.action.toLowerCase()+'.' : 'Tap something in the painting and see what happens.');
    painting.append(tools,mat,caption);

    const side = node('aside','side');
    const notebook = node('section','notebook');
    const notebookHead = node('div','notebook-head');
    const notesTitle = node('h2','subtitle','Discoveries');
    const count = node('span','count');
    notebookHead.append(notesTitle,count);
    const meter = node('div','meter');
    meter.setAttribute('aria-hidden','true');
    const meterFill = node('i','meter-fill'); meter.append(meterFill);
    const note = node('div','note');
    const noteCaption = node('div','note-caption');
    noteCaption.innerHTML = icon('brush');
    const noteTag = node('span','tag','Field notes');
    const noteTitle = node('h3','note-title','Where shall we start?');
    const noteBody = node('p','note-body','Tap a dot in the painting, or pick a clue below.');
    noteCaption.append(noteTag);
    note.append(noteCaption,noteTitle,noteBody);
    const list = node('div','list');
    const listLabel = node('p','list-label','Pick a clue');
    notebook.append(notebookHead,meter,note,listLabel,list);
    if (place.id === 'picnic') {
      const story = node('a','picture-book'); story.href = 'picnic.html#world';
      story.innerHTML = icon('book');
      story.append(node('span','book-label','Open the picnic storybook'));
      notebook.append(story);
    }
    const roads = node('section','roads'); const roadsHead = node('h2','roads-head');
    roadsHead.innerHTML = icon('step'); roadsHead.append('Nearby places'); roads.append(roadsHead);
    place.neighbors.forEach(id => {
      const dest = window.LucasPlaces.find(p => p.id === id);
      const a = node('a','road'); a.href = '#place/' + id;
      const label = node('span','road-label');
      label.append(node('strong','road-name',dest.name),node('small','road-copy',place.trails[id]));
      a.append(label);
      a.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); api.go(id);
      });
      roads.append(a);
    });
    side.append(notebook,roads); layout.append(painting,side);
    const live = node('span','sr');
    live.setAttribute('role','status'); live.setAttribute('aria-live','polite');
    root.append(heading,layout,live);
    mount.replaceChildren(root);
    if (focusNextView) {
      focusNextView = false;
      root.querySelector('.visit-view[aria-current="page"]')?.focus({preventScroll:true});
    }

    let selected = '', timer = 0, hintTimer = 0;
    const entries = new Map();
    let showMarkers = true;
    function renderState() {
      let found = 0;
      place.spots.forEach(spot => {
        const seen = api.has(place.id,spot.id);
        if (seen) found++;
        const {row, buttons, index} = entries.get(spot.id);
        row.classList.toggle('visit-found',seen);
        row.classList.toggle('visit-selected',selected === spot.id);
        row.querySelector('.visit-row-bullet').innerHTML = seen ? icon('check') : String(index+1);
        row.setAttribute('aria-label',spot.name + (seen ? ', revisit discovery' : ', get a clue'));
        buttons.forEach((button,j) => {
          button.classList.toggle('visit-found',seen);
          if (j === 0) button.querySelector('.visit-dot').innerHTML = seen ? icon('check') : '+';
          button.setAttribute('aria-label','Explore ' + spot.name + (seen ? ', already found' : ''));
        });
      });
      count.textContent = found + ' / ' + place.spots.length;
      count.setAttribute('aria-label',found + ' of ' + place.spots.length + ' discoveries found');
      meterFill.style.width = (found / place.spots.length * 100) + '%';
      return found;
    }
    function setNote(tag, name, copy, discovered) {
      noteTag.textContent = tag; noteTitle.textContent = name; noteBody.textContent = copy;
      note.classList.toggle('visit-written',discovered);
    }
    function reply(spot, bounds, tappedPainting) {
      const wasSeen = api.has(place.id,spot.id);
      if (tappedPainting) api.discover(place.id,spot.id);
      selected = spot.id;
      const total = renderState();
      const finished = !wasSeen && total === place.spots.length;
      setNote(finished ? 'Painting complete!' : 'In your notebook',spot.name,spot.reply,true);
      animate(effects,img,bounds,spot,api.sound());
      window.clearTimeout(timer);
      toast.textContent = spot.reply; toast.hidden = false;
      toast.classList.toggle('visit-toast-above', bounds[1] > 50);
      timer = window.setTimeout(() => {toast.hidden = true;}, 3000);
      live.textContent = (finished ? 'You found everything in this painting! ' : wasSeen ? '' : 'Found: ' + spot.name + '. ') + spot.reply;
    }
    function hint(spot) {
      if (api.has(place.id,spot.id)) { reply(spot, primaryBounds(spot),false); return; }
      selected = spot.id;
      renderState(); setNote('Your clue',spot.name,spot.clue,false);
      const button = entries.get(spot.id).buttons[0];
      targets.querySelectorAll('.visit-hinted').forEach(el => el.classList.remove('visit-hinted'));
      button.classList.add('visit-hinted');
      window.clearTimeout(hintTimer); hintTimer = window.setTimeout(() => button.classList.remove('visit-hinted'), 6500);
      if (mat.getBoundingClientRect().bottom < 100 && window.innerWidth < 820) {
        mat.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      }
      live.textContent = spot.clue;
    }

    place.spots.forEach((spot, index) => {
      const row = action('row',spot.name);
      const bullet = node('i','row-bullet'); bullet.setAttribute('aria-hidden','true'); row.prepend(bullet);
      row.addEventListener('click',() => hint(spot)); list.append(row);
      const buttons = [primaryBounds(spot),...(spot.marks || [])].map((bounds,j) => {
        const [x,y,w,h] = bounds;
        const button = node('button','target');
        button.type = 'button';
        button.style.cssText = 'left:'+x+'%;top:'+y+'%;width:'+w+'%;height:'+h+'%;z-index:'+Math.max(1,Math.round(5000/(w*h)));
        const dot = node('span','dot');
        dot.setAttribute('aria-hidden','true'); button.append(dot);
        if (j > 0) {
          button.tabIndex = -1; button.setAttribute('aria-hidden','true'); button.classList.add('visit-alias');
        }
        button.addEventListener('click',() => reply(spot,bounds,true));
        targets.append(button); return button;
      });
      entries.set(spot.id,{row,buttons,index});
    });
    markers.addEventListener('click',() => {
      showMarkers = !showMarkers; canvas.classList.toggle('visit-no-markers',!showMarkers);
      markers.setAttribute('aria-pressed', String(showMarkers));
      markers.querySelector('span').textContent = showMarkers ? 'Hide markers' : 'Show markers';
    });
    const initial = renderState();
    if (initial === place.spots.length) setNote('Painting complete!',place.stamp,'Tap your old friends in the painting to play with them again.',true);
  }
  window.LucasVisit = Object.freeze({show});
})();
