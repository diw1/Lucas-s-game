/* The trail is painted at the resolution of a small pixel-art game. */
(() => {
  "use strict";

  const W = 480;
  const H = 184;
  const scenes = new WeakMap();
  const palettes = [
    ["#202d4b", "#547285", "#a7a097", "#afc5aa", "#244f58", "#29575a"],
    ["#2d304e", "#726781", "#c39891", "#cbc3a1", "#365264", "#31535d"],
    ["#193c50", "#547c8b", "#a4b4a1", "#d2d2ab", "#285967", "#285d5f"],
    ["#2b2b4d", "#616888", "#af93a2", "#e2c6b1", "#304d65", "#334e62"]
  ];

  function random(seed) {
    return () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function rect(c, x, y, w, h, color) {
    c.fillStyle = color;
    c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // Scan rows give slopes and silhouettes deliberate, hard pixel edges.
  function poly(c, points, color) {
    let top = Infinity, bottom = -Infinity;
    for (const [, y] of points) {
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
    c.fillStyle = color;
    for (let y = Math.floor(top); y < bottom; y++) {
      const hits = [];
      const row = y + 0.5;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [ax, ay] = points[j], [bx, by] = points[i];
        if ((ay > row) !== (by > row)) hits.push(ax + (row - ay) * (bx - ax) / (by - ay));
      }
      hits.sort((a, b) => a - b);
      for (let k = 0; k + 1 < hits.length; k += 2) {
        c.fillRect(Math.round(hits[k]), y, Math.round(hits[k + 1]) - Math.round(hits[k]), 1);
      }
    }
  }

  function oval(c, x, y, rx, ry, color) {
    for (let i = -ry; i <= ry; i++) {
      const width = Math.round(rx * Math.sqrt(Math.max(0, 1 - i * i / (ry * ry))));
      rect(c, x - width, y + i, width * 2 + 1, 1, color);
    }
  }

  function line(c, x1, y1, x2, y2, color, width = 1) {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
    for (let i = 0; i <= steps; i++) {
      const a = i / steps;
      rect(c, x1 + a * (x2 - x1), y1 + a * (y2 - y1), width, width, color);
    }
  }

  function gradient(c, top, bottom, height, start = 0) {
    const rgb = hex => [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
    const a = rgb(top), b = rgb(bottom);
    for (let y = 0; y < height; y += 3) {
      const t = y / height;
      const color = a.map((n, i) => Math.round(n * (1 - t) + b[i] * t));
      rect(c, 0, start + y, W, 3, "rgb(" + color.join(",") + ")");
    }
  }

  function pine(c, x, foot, h, dark, mid, tip, seed) {
    const pick = random(seed);
    const top = foot - h, span = h * 0.26;
    rect(c, x - Math.max(1, h / 34), top + h * .34, Math.max(2, h / 14), h * .66, dark);
    for (let i = 0; i < 6; i++) {
      const y = top + h * (.04 + i * .135), w = span * (.22 + i * .15);
      const end = y + h * (.22 + i * .009);
      const left = x - w * (1 + pick() * .19), right = x + w * (1 + pick() * .14);
      poly(c, [[x, y - 2], [x + w * .55, end - h * .085], [right, end - h * .035],
        [right - 2, end], [x + w * .18, end - h * .019], [x + 1, end + 1],
        [x - w * .41, end - h * .016], [left, end], [left + w * .18, end - h * .047]], dark);
      if (mid) {
        poly(c, [[x - 1,y], [x + w * .11,end - h * .12], [x - w * .18,end - h * .087],
          [x - w * .07,end - h * .065], [left,end - 1], [x - w * .48,end - h * .1]], mid);
      }
      if (tip && i > 1) rect(c, left + 2, end - 2, Math.max(1,w * .16), 1, tip);
    }
  }

  function groundDetail(c, pick, x, y, scale = 1) {
    const bright = pick() > .7 ? "#719768" : "#507b60";
    rect(c, x, y, 3 * scale, scale, "#1b423e");
    line(c, x + 1, y, x - scale, y - scale * 2, bright);
    line(c, x + scale, y, x + 3 * scale, y - 3 * scale, "#689066");
  }

  function rock(c, x, y, size) {
    poly(c, [[x-size,y-1],[x-size+2,y-5],[x,y-size*.68],[x+size*.6,y-size*.5],
      [x+size,y-1],[x+size-2,y+1],[x-size+2,y+1]], "#274c4c");
    poly(c, [[x-size+1,y-2],[x-size+3,y-5],[x,y-size*.68],
      [x+size*.55,y-size*.45],[x+size*.12,y-3]], "#6b8b79");
    rect(c,x-size+3,y-4,Math.max(2,size/2),1,"#92a48a");
  }

  function cabin(c, x, y) {
    c.save();
    c.translate(x,y);
    // A little wooden keeper's hut with a moss-and-slate gable roof.
    rect(c,-20,-25,37,25,"#252e35");
    rect(c,-17,-22,30,20,"#806447");
    for(let k=0;k<4;k++) {
      rect(c,-17,-21+k*5,31,1,"#ab8055");
      rect(c,-15,-19+k*5,29,1,"#584b3d");
    }
    rect(c,3,-37,6,14,"#4b4650");
    rect(c,2,-37,8,2,"#ae8980");
    poly(c,[[-25,-24],[-6,-42],[11,-42],[25,-25],[17,-21]],"#293743");
    poly(c,[[-23,-26],[-6,-43],[11,-43],[23,-27],[4,-28]],"#46645f");
    poly(c,[[-22,-26],[-6,-42],[5,-42],[-9,-26]],"#557364");
    line(c,-22,-26,-6,-42,"#a3a27c");
    line(c,-5,-42,10,-42,"#98a37c");
    for(const [a,b,len] of [[-9,-37,4],[-12,-33,4],[0,-38,5],[5,-33,5],[-3,-30,4],[12,-30,3]]) rect(c,a,b,len,1,"#77937b");
    rect(c,-24,-26,46,2,"#3b4944");
    rect(c,-18,-23,3,24,"#414638");
    rect(c,12,-24,3,25,"#49483a");
    rect(c,3,-16,8,16,"#433b32");
    rect(c,5,-14,5,13,"#705543");
    rect(c,8,-8,1,1,"#e6be74");
    oval(c,-7,-13,9,8,"rgba(251, 174, 80, .11)");
    rect(c,-13,-20,12,13,"#413e35");
    rect(c,-12,-19,10,11,"#d58c48");
    rect(c,-11,-18,8,8,"#ffd785");
    rect(c,-10,-17,6,5,"#ffedac");
    rect(c,-8,-18,1,9,"#966338");
    rect(c,-12,-14,10,1,"#966338");
    rect(c,-14,-8,14,2,"#c9a075");
    rect(c,-20,0,37,2,"#748273");
    rect(c,1,2,13,2,"#9c9780");
    rect(c,-2,4,18,1,"#71806a");
    c.restore();
  }

  const fox = [
    "....oo......oo......",
    "....oco....oco......",
    "....occo..occo......",
    "....occcooccco......",
    "...orccccccccco.....",
    "...orcccccccycco....",
    "..orccycccccycco....",
    "..occcwccccwccco....",
    "..occwowccwowco.....",
    "...owwwwowwwwo......",
    "....owwwwwwwor......",
    "....obbbbbbbbo....co",
    "...obuuubbbuubo..cwo",
    "...ocuuuuuuuubo.cwwo",
    "...ocwuuuluuuocccwo.",
    "....ouullllluoocco..",
    "....ouullluulooro...",
    "....ollloollloo.....",
    "....oooo..oooo......"
  ];
  const fur = {o:"#253b3c",c:"#e8884c",r:"#aa5e40",y:"#fbb16e",w:"#fff0c3",b:"#397c7a",u:"#65a795",l:"#3b6564"};

  function drawFox(c, x, y) {
    oval(c, x+13, y+28, 12, 2, "#365e4d");
    for (let j=0; j<fox.length; j++) {
      for (let i=0; i<fox[j].length; i++) {
        const shade = fur[fox[j][i]];
        if (shade) rect(c,x+Math.round(i*1.5),y+Math.round(j*1.5),Math.round((i+1)*1.5)-Math.round(i*1.5),Math.round((j+1)*1.5)-Math.round(j*1.5),shade);
      }
    }
  }

  function bridgeY(t) { return 143 - 13*t - 9*Math.sin(Math.PI*t); }

  function drawBridge(c) {
    const start=139, span=174;
    for(const t of [.09,.27,.73,.91]) {
      const x=start+t*span,y=bridgeY(t);
      rect(c,x,y,3,15,"#273b39");
      rect(c,x+1,y+1,1,11,"#796b4f");
    }
    for(let i=0;i<29;i++) {
      const t=i/29, x=start+span*t, y=bridgeY(t);
      poly(c,[[x,y],[x+7,bridgeY((i+1)/29)],[x+12,bridgeY((i+1)/29)+5],[x+5,y+5]],i%4===0?"#a8895a":"#b4996b");
      rect(c,x+4,y+5,7,3,"#644d3d");
      if(i%3===0) rect(c,x+4,y+2,2,1,"#dfbd82");
    }
    for(let i=0;i<7;i++) {
      const t=i/6, x=Math.round(start+span*t), y=Math.round(bridgeY(t));
      if(i<6) {
        const nextX=Math.round(start+span*(i+1)/6),nextY=Math.round(bridgeY((i+1)/6));
        line(c,x,y-7,(x+nextX)/2,(y+nextY)/2-5,"#514739");
        line(c,(x+nextX)/2,(y+nextY)/2-5,nextX,nextY-7,"#514739");
      }
      rect(c,x-1,y-10,3,12,"#514d3c");
      rect(c,x-1,y-9,1,10,"#ac8c5c");
    }
  }

  function makeLandscape(lesson) {
    const canvas = document.createElement("canvas");
    canvas.width=W; canvas.height=H;
    const c=canvas.getContext("2d");
    const p=palettes[lesson % palettes.length], pick=random(1207);
    gradient(c,p[0],p[1],67);
    gradient(c,p[1],p[2],34,66);
    for(let i=0;i<105;i++) {
      const x=pick()*W, y=pick()*68;
      rect(c,x,y,1,1,i%4===0?"#e0d7b0":"#8e9ca6");
      if(i%23===0) {
        rect(c,x-1,y,3,1,"#b6bbb2"); rect(c,x,y-1,1,3,"#b6bbb2");
        rect(c,x,y,1,1,"#f3e2bb");
      }
    }
    const moonX=276 + (lesson%3)*9;
    oval(c,moonX,25,12,12,"rgba(255,226,165,.035)");
    for(let y=-8;y<=8;y++) for(let x=-8;x<=8;x++) {
      if(x*x+y*y<=64 && (x-3)*(x-3)+(y+3)*(y+3)>50) rect(c,moonX+x,25+y,1,1,"#f1ddb5");
    }
    for(let i=0;i<20;i++) {
      const x=pick()*W,y=48+pick()*32,len=8+pick()*38;
      rect(c,x,y,len,1,"rgba(207, 195, 175, .17)");
      if(i%3===0) rect(c,x+5,y-1,len*.35,1,"rgba(207, 195, 175, .15)");
    }
    const ridge1=[[0,77],[34,63],[50,68],[83,47],[96,53],[126,32],[159,60],[177,47],[199,59],[228,39],[264,63],[282,52],[298,60],[328,43],[366,66],[399,45],[436,66],[464,55],[480,61],[480,111],[0,111]];
    poly(c,ridge1,"#677c86");
    for(const [x,y,r] of [[126,32,31],[228,39,30],[328,43,22],[399,45,25]]) {
      poly(c,[[x-r,y+r*.78],[x,y],[x+13,y+11],[x+5,y+7],[x+2,y+7],[x-1,y+4],[x-9,y+12],[x-10,y+10]],"#9a9c9a");
    }
    poly(c,[[0,72],[35,64],[71,77],[95,67],[132,81],[159,64],[179,70],[203,56],[235,73],[264,65],[294,77],[318,56],[334,62],[353,54],[374,64],[415,51],[458,67],[480,60],[480,109],[0,109]],"#506d79");
    for(let i=-1;i<70;i++) {
      const x=i*7+pick()*3, y=97+4*Math.sin(x/31);
      pine(c,x,y,8+pick()*10,"#466773",null,null,i+200);
    }
    poly(c,[[0,83],[43,74],[91,84],[129,79],[161,91],[208,84],[255,95],[290,84],[337,81],[362,70],[403,75],[438,62],[480,70],[480,105],[0,105]],p[4]);
    for(let i=0;i<70;i++) {
      const x=i*7+pick()*6, y=95 - Math.max(0,x-275)*.095+3*Math.sin(x/23);
      pine(c,x,y,6+pick()*11,p[4],null,null,i+48);
    }
    gradient(c,p[1],p[5],90,96);
    rect(c,0,96,W,2,"#759292");
    for(let i=0;i<255;i++) {
      const x=pick()*W, y=99+pick()*85;
      rect(c,x,y,2+pick()*((y-91)*.19+3),1, i%5===0?"#7f9e99":i%3===0?"#527f83":"#608689");
    }
    for(let i=0;i<24;i++) {
      const y=99+i*2, dx=(y-96)*.44;
      rect(c,moonX+(pick()-.5)*dx*2,y,2+pick()*(dx*.5+4),1,i%3===0?"#b8b8a0":"#92a79d");
    }
    // The far island makes a solid dark setting for the warm cabin.
    for(let i=0;i<20;i++) {
      const x=308+i*9+pick()*5;
      pine(c,x,110-7*Math.sin((x-298)/85),18+pick()*26,"#284e4f","#365d58",null,i+789);
    }
    poly(c,[[277,112],[291,107],[304,106],[313,101],[326,102],[340,96],[364,96],[378,91],[400,92],[422,87],[451,88],[479,81],[480,120],[434,121],[404,116],[368,120],[335,119],[315,116],[288,116]],"#3d6358");
    line(c,278,113,307,115,"#769183");
    pine(c,323,107,36,"#264b48","#3c6354","#52725d",408);
    pine(c,401,99,38,"#284b49","#3b6054","#567963",910);
    cabin(c,362,103);
    for(let i=0;i<25;i++) {
      const x=316+pick()*137,y=105+pick()*8;
      if(x<340 || x>382) groundDetail(c,pick,x,y);
    }
    const left=[[0,98],[15,95],[37,101],[56,102],[72,110],[92,111],[111,121],[127,123],[139,132],[155,135],[160,141],[151,145],[160,153],[155,156],[173,158],[185,169],[191,170],[200,184],[0,184]];
    const right=[[282,129],[307,123],[328,120],[338,116],[366,112],[383,112],[413,105],[440,103],[456,96],[480,95],[480,184],[288,184],[301,177],[326,173],[333,165],[356,163],[357,157],[347,152],[322,150],[310,147],[287,146],[280,142],[299,137]];
    poly(c,left,"#4e765e"); poly(c,right,"#557a61");
    const lowerLeft=[[0,126],[23,116],[46,122],[64,119],[82,128],[100,127],[119,137],[128,140],[142,143],[135,150],[149,159],[166,163],[171,171],[189,179],[194,184],[0,184]];
    const lowerRight=[[299,184],[315,178],[340,175],[351,167],[369,165],[375,154],[362,146],[342,145],[327,138],[317,138],[330,131],[355,126],[375,128],[399,118],[419,120],[433,111],[458,113],[480,107],[480,184]];
    poly(c,lowerLeft,"#355e4e"); poly(c,lowerRight,"#41694f");
    // An ochre footpath connects the fox, bridge and hut.
    poly(c,[[30,184],[43,173],[69,162],[86,151],[104,144],[113,134],[124,133],[132,135],[146,137],[148,142],[132,144],[119,141],[108,147],[97,156],[80,164],[61,176],[54,184]],"#84906a");
    poly(c,[[296,128],[315,124],[329,122],[338,116],[348,115],[354,110],[361,107],[368,107],[361,112],[351,118],[341,119],[333,125],[318,129],[301,131]],"#8d9471");
    for(let i=0;i<110;i++){
      const x=pick()*W,y=112+pick()*72;
      if ((x < (y-100)*1.8 && (x<56 || y>163)) || (x>390 && y>125) || (x>349 && y>175)) groundDetail(c,pick,x,y);
    }
    for(const [x,y,s] of [[156,159,6],[169,165,4],[278,150,5],[288,151,3],[301,132,5],[333,165,7],[191,178,7],[83,144,4],[405,139,7],[65,168,5]]) rock(c,x,y,s);
    drawBridge(c);
    for(const [x,y,h,s] of [[24,119,79,44],[-3,124,103,62],[70,117,47,97],[47,117,59,94],[450,117,65,99],[477,109,92,27],[433,111,41,29]]) pine(c,x,y,h,"#234942","#365e4e","#5a795d",s);
    // Lily pads and reeds along the shoreline give the close water its scale.
    for(const [x,y,s] of [[237,163,5],[248,168,3],[255,156,4],[198,175,4],[207,177,2],[322,157,3],[221,148,2]]){
      oval(c,x,y,s,1,"#305a52"); rect(c,x-s,y-1,s*1.5,1,"#70936c");
    }
    for(let i=0;i<46;i++) {
      const leftSide=i<23;
      const x=leftSide?pick()*65:390+pick()*89;
      const y=150+pick()*38;
      const h=4+pick()*8;
      line(c,x,y,x-2,y-h,"#3b644f");
      if(i%4===0) {
        rect(c,x-3,y-h-2,2,3,"#c79879"); rect(c,x-3,y-h-2,1,1,"#f4d099");
      } else if(i%3===0) {
        rect(c,x-3,y-h-3,2,4,"#82684b");
      }
    }
    pine(c,-8,159,133,"#183b36","#284d3f","#44644b",920);
    pine(c,492,155,130,"#1d403c","#2b5245","#4c6e54",313);
    const foreground=[[0,158],[14,161],[21,157],[35,168],[41,166],[47,174],[61,172],[70,177],[84,176],[89,180],[110,181],[119,184],[0,184]];
    poly(c,foreground,"#1f473c");
    poly(c,[[359,184],[373,178],[387,179],[391,174],[402,175],[410,170],[419,173],[432,166],[445,167],[450,159],[464,157],[480,148],[480,184]],"#22483d");
    for(const [x,y,n] of [[14,168,8],[82,181,6],[441,169,7],[467,160,8]]) {
      for(let i=0;i<n;i++) {
        const a=pick()*Math.PI, reach=3+pick()*7;
        const dx=Math.round(Math.cos(a)*reach),dy=Math.round(Math.sin(a)*reach);
        poly(c,[[x,y],[x+dx-2,y-dy+3],[x+dx,y-dy-1],[x+dx+2,y-dy+2]],i%2?"#447056":"#41634e");
        if(i%3===0) rect(c,x+dx,y-dy,1,2,"#76916a");
      }
    }
    for(const [x,y,size] of [[31,167,4],[37,168,3],[449,160,4],[455,158,2]]) {
      rect(c,x,y-size*.55,1,size+1,"#d2bf91");
      oval(c,x,y-size,size,Math.max(1,Math.round(size*.55)),"#b87d60");
      rect(c,x-size+1,y-size-1,2,1,"#eab993");
      rect(c,x+1,y-size,1,1,"#f1d4a5");
    }
    return canvas;
  }

  function glow(c,x,y,size) {
    oval(c,x,y,size,size,"rgba(255,193,67,.055)");
    oval(c,x,y,Math.max(2,Math.round(size*.62)),Math.max(2,Math.round(size*.62)),"rgba(255,195,68,.09)");
    oval(c,x,y,Math.max(1,Math.round(size*.34)),Math.max(1,Math.round(size*.34)),"rgba(255,204,82,.15)");
  }

  function rowboat(c, progress, time) {
    const x = Math.round(202 + 67 * progress + Math.sin(time * .44));
    const y = Math.round(154 + 7 * progress + Math.sin(time * .8) * .65);
    c.save();
    c.translate(x, y);
    rect(c,-22,6,19,1,"#80a4a0");
    rect(c,-15,8,9,1,"#6b9794");
    rect(c,3,7,13,1,"#74a09a");
    oval(c,1,5,13,1,"#2e6062");
    poly(c,[[-16,-4],[-9,-2],[8,-3],[16,-6],[15,-1],[10,4],[-6,5],[-12,3]],"#51413a");
    poly(c,[[-15,-3],[-7,0],[8,-1],[15,-4],[11,2],[-5,4],[-11,2]],"#c47e4f");
    line(c,-14,-4,-7,-2,"#f1c387");
    line(c,-7,-2,8,-3,"#efc58d");
    line(c,8,-3,15,-6,"#f1cc93");
    line(c,-3,-4,1,-1,"#986246",2);
    line(c,4,-7,-1,3,"#e2bc86");
    poly(c,[[-1,1],[1,3],[-3,8],[-5,8],[-5,6]],"#f3ce8c");
    rect(c,-9,-9,1,5,"#705640");
    rect(c,-11,-11,4,4,"#ac683e");
    rect(c,-10,-10,2,2,"#ffe18a");
    c.restore();
  }

  function beacon(c, progress) {
    c.save();
    c.translate(325,104);
    oval(c,1,0,9,2,"#3c574b");
    poly(c,[[-6,0],[-4,-21],[4,-21],[6,0]],"#455657");
    poly(c,[[-4,-1],[-3,-20],[2,-20],[4,-1]],"#d4b593");
    rect(c,-3,-15,6,3,"#ad6d55");
    rect(c,-3,-9,7,3,"#ad6d55");
    rect(c,-1,-4,2,4,"#625244");
    if(progress>0) glow(c,0,-24,Math.round(8+progress*12));
    rect(c,-4,-28,9,7,"#3d5052");
    rect(c,-3,-27,7,5,progress>0?"#ffd575":"#85938a");
    rect(c,-2,-26,5,3,progress>.5?"#fff2a9":progress>0?"#edb85e":"#aab19a");
    rect(c,0,-27,1,5,"#8c724d");
    rect(c,-6,-21,13,2,"#52615b");
    poly(c,[[-6,-28],[0,-34],[7,-28]],"#ad664b");
    line(c,-6,-28,0,-34,"#e7b286");
    rect(c,0,-36,1,3,"#e7c78b");
    c.restore();
  }

  function paint(s, now) {
    const {ctx:c, background, total, lit, celebrate} = s;
    c.drawImage(background,0,0);
    const t=now/1000;
    // Each recovered light moves the traveller from the bank to the cabin.
    const progress=lit/total;
    if(s.place==="boat" || s.place==="oars") rowboat(c,progress,t);
    if(s.place==="chords") beacon(c,progress);
    const foxX=107+progress*221;
    const foxFeet=progress<.15 ? 136+progress*47 :
      progress<.88 ? bridgeY((progress-.15)/.73)+1 :
      131-(progress-.88)*124;
    drawFox(c,Math.round(foxX),Math.round(foxFeet)-28);
    for(let i=0;i<total;i++) {
      const a=(i+.5)/total;
      const x=Math.round(141+172*a), y=Math.round(bridgeY(a)-7);
      const on=i<lit;
      if(on) glow(c,x,y-9,12);
      rect(c,x-1,y-15,2,15,"#4b4c3f");
      rect(c,x-2,y-12,5,1,"#41453d");
      rect(c,x-2,y-11,5,5,on?"#b98241":"#655e4a");
      rect(c,x-1,y-10,3,3,on?"#ffde74":"#9d9571");
      if(on) rect(c,x,y-10,1,2,"#fffaaf");
      rect(c,x-2,y-6,5,1,"#4b4c3f");
    }
    const bugs=[[79,91],[117,87],[147,100],[181,78],[214,102],[260,88],[321,85],[390,97],[405,77],[271,151],[212,152],[91,136]];
    const count=celebrate?bugs.length:4+Math.round(lit/total*6);
    for(let i=0;i<count;i++) {
      const [bx,by]=bugs[(i*5+s.lesson)%bugs.length];
      const x=Math.round(bx+Math.sin(t*.55+i*1.43)*3),y=Math.round(by+Math.cos(t*.8+i)*2);
      const bright=Math.sin(t*1.9+i*2.4)>.18;
      if(bright) glow(c,x,y,4);
      rect(c,x,y,bright?2:1,1,bright?"#fff3a0":"#d8cc80");
    }
    if(celebrate) {
      for(let i=0;i<8;i++) {
        const x=145+i*23+Math.round(Math.sin(i*8.2)*10);
        const y=Math.round(82+Math.sin(t*.7+i*1.3)*6-Math.sin(i*.52)*9);
        rect(c,x-1,y,3,1,"#fff1aa"); rect(c,x,y-1,1,3,"#fff1aa");
      }
    }
  }

  function draw(canvas, {lesson=0,place="",lit=0,total=4,celebrate=false}={}) {
    if(!canvas) return;
    lesson=Math.max(0,Math.floor(Number(lesson)||0));
    total=Math.min(12,Math.max(1,Math.floor(Number(total)||4)));
    let s=scenes.get(canvas);
    if(!s) {
      canvas.width=W; canvas.height=H;
      canvas.style.imageRendering="pixelated";
      const ctx=canvas.getContext("2d");
      if(!ctx) return;
      s={ctx,lesson:-1,frame:0,lastPaint:0};
      scenes.set(canvas,s);
    }
    if(s.lesson!==lesson) s.background=makeLandscape(lesson);
    Object.assign(s,{lesson,place,lit:Math.max(0,Math.min(total,Number(lit)||0)),total,celebrate});
    const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    paint(s,reduced?0:performance.now());
    if(reduced || s.frame || typeof requestAnimationFrame!=="function") return;
    function tick(now) {
      if(!canvas.isConnected || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        s.frame=0;
        return;
      }
      if(now-s.lastPaint>140 && canvas.getClientRects().length) {
        paint(s,now);
        s.lastPaint=now;
      }
      s.frame=requestAnimationFrame(tick);
    }
    s.frame=requestAnimationFrame(tick);
  }

  window.FireflyScene={draw};
})();
