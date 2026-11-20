// Each landmark is painted once in island coordinates. The flight camera supplies
// its position and apparent width as the pilot draws closer.
const stamps = new Map();
const ink = "#364453";

function illustrator(ctx) {
  function path(d, fill, stroke = ink, width = 1.5) {
    const p = new Path2D(d);
    if (fill) { ctx.fillStyle = fill; ctx.fill(p); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(p); }
  }
  function oval(x,y,rx,ry,fill,stroke) {
    ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,2*Math.PI);
    ctx.fillStyle=fill; ctx.fill();
    if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=1.3; ctx.stroke(); }
  }
  function box(x,y,w,h,fill,stroke=ink) {
    ctx.fillStyle=fill; ctx.fillRect(x,y,w,h);
    if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=1.3; ctx.strokeRect(x,y,w,h); }
  }
  function flag(x,y,color) {
    path(`M${x} ${y+14}v-16 l9 2 -9 5`,color);
  }
  function tree(x,y,s,fruit=false) {
    ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
    path("M-4 0Q0 -12 -3 -30L1 -27L5 -37L4 -17L11 -23L7 -15L3 -10L4 0Z","#985839");
    path("M-15 -18Q-23 -24 -17 -31Q-19 -40 -8 -40Q-5 -51 5 -45Q15 -47 16 -37Q27 -30 17 -23Q11 -17 3 -21Q-6 -15 -15 -18Z","#599868");
    path("M-15 -31Q-13 -40 -5 -37Q-1 -45 6 -41Q10 -41 11 -37",null,"#a8c97b",2.6);
    if(fruit) for(const [a,b] of [[-12,-27],[5,-34],[13,-26],[-4,-39]]) oval(a,b,2.3,2.5,"#eb6348",ink);
    ctx.restore();
  }
  return {path,oval,box,tree,flag};
}

function orchard(g) {
  const {path,oval,box,tree}=g;
  tree(-31,0,.65,true); tree(34,0,.58);
  path("M-17 6Q-7 -8 -5 -30L-24 -43L-22 -46L-4 -37L2 -64L7 -62L6 -41L25 -53L27 -49L11 -33L14 -3L21 4Z","#955d3e");
  path("M-36 -43Q-45 -53 -35 -58Q-35 -66 -23 -66Q-17 -74 -6 -67Q0 -75 11 -69Q21 -75 29 -64Q41 -66 41 -55Q48 -48 40 -43Q28 -37 18 -41Q7 -34 -7 -41Q-21 -36 -36 -43Z","#4a865b");
  path("M-33 -57Q-29 -64 -22 -61M-5 -64Q0 -71 9 -66M21 -63Q30 -68 35 -58",null,"#9bbf69",2.6);
  box(-24,-40,33,27,"#ecc559"); path("M-29 -40L-8 -59L13 -40Z","#c44e3e");
  oval(-8,-47,3.4,3.4,"#74abb5",ink);
  box(-21,-28,6,15,"#985637"); box(-11,-35,7,8,"#84bac3"); box(-1,-35,7,8,"#82b6bf");
  path("M-27 -13H32",null,ink,2.5);
  path("M8 -43L17 -52L29 -46L32 -41V-13H8Z","#aa6640");
  box(10,-40,18,11,"#ffdf87"); box(10,-27,18,12,"#f3b985");
  box(12,-32,14,3,"#70a7b8"); oval(24,-34,2.3,1.3,"#fff1ca");
  box(15,-21,9,1.8,"#925d49"); oval(19,-23,1.8,2,"#f28c35",ink);
  path("M23 -14L17 4M27 -14L21 4M20 -7L25 -7M18 -2L23 -2",null,"#533e37",1.5);
  path("M-28 -40Q-6 -30 10 -42",null,"#5a553d",.8);
  for (const [x,y] of [[-23,-38],[-16,-36],[-9,-36],[-2,-36],[5,-39]]) oval(x,y,1.4,1.6,"#fff09b");
}

function picnic(g) {
  const {path,oval,box,tree}=g;
  tree(-26,1,1.1,true); tree(30,0,.8,true);
  path("M-15 -4L11 -7L30 1L1 6Z","#f1c66b");
  for(const x of [-9,0,9]) path(`M${x} -4l12 7`,null,"#e78a56",1.7);
  path("M-11 -2L17 -4M-5 2L24 -1",null,"#fff1b3",1.6);
  box(-3,-20,22,14,"#f5d29a");
  path("M-6 -20L-3 -28H19L23 -20Z","#e8826a");
  for(const x of [-3,5,13]) path(`M${x} -20l2 -8h4v8Z`,"#fff1cf",null);
  box(-5,-12,26,5,"#cd825c"); for(const x of [0,5,14]) oval(x,-13,2.8,1.6,"#e3a852",ink);
  oval(6,-20,3.5,3.7,"#fff7df",ink); oval(4.4,-24.7,1,3,"#fff7df",ink); oval(7.5,-24.7,1,3,"#fff7df",ink);
  path("M-18 -6Q-18 -13 -13 -13Q-8 -13 -8 -6",null,ink,1.3);
  path("M-19 -7L-7 -7L-9 -1L-17 0Z","#b78345");
  for(const [x,y] of [[-16,-7],[-13,-8],[-10,-7]]) oval(x,y,1.8,1.8,"#df7850",ink);
}

function coral(g) {
  const {path,oval,tree}=g;
  tree(-32,0,.45); tree(35,1,.4);
  path("M-35 1Q-23 -4 -12 -1T9 -3T32 1Q16 9 -1 6T-35 1Z","#55c6c5","#458f9c");
  path("M-25 -18Q-19 -14 -12 -17Q-9 -34 5 -34Q22 -35 25 -23Q27 -12 18 -9Q5 -5 -4 -10Q-11 -14 -16 -12L-23 -10Q-23 -14 -25 -18Z","#518bad");
  path("M-4 -13Q5 -7 15 -10Q22 -11 23 -16Q14 -12 6 -15Z","#e1ecd5",null);
  oval(15,-24,3.8,4.2,"#f6edcf",ink); oval(16,-24,2,2.8,ink); oval(16.5,-25, .7,.7,"white");
  path("M1 -34Q-2 -40 -5 -38M2 -34Q3 -43 8 -42",null,"#81d3da",1.8);
  path("M-12 -5Q-7 -14 2 -10Q8 -8 7 -4Q3 -1 -3 -3Q-7 -5 -13 -3L-17 -6Z","#6facbc");
  for(const x of [-31,29]) path(`M${x} 2q2 -8 0 -15m1 10l-5 -4m5 1l5 -5`,null,"#ea9076",2.5);
}

function castle(g) {
  const {path,oval,box,flag}=g;
  for(const [x,h] of [[-23,27],[-8,46],[10,32],[21,38]]){
    box(x-5,-h+8,10,h-7,"#515573");
    path(`M${x-8} ${-h+9}Q${x-2} ${-h+2} ${x} ${-h-6}Q${x+2} ${-h} ${x+7} ${-h+9}Z`,"#383952");
    for(const y of [-h+15,-h+22]) path(`M${x-2} ${y+3}v-4q2 -4 4 0v4Z`,"#ffdb79",null);
  }
  box(-18,-16,36,17,"#686580"); path("M-5 1v-8q5 -12 10 0v8Z","#f4ba6b");
  flag(-8,-52,"#db7555");
  for(const [x,y,s] of [[31,-1,7],[31,-9,6],[32,-17,5],[-32,0,5]]){
    oval(x,y-s*.4,s,s*.7,"#f39b48",ink);
    path(`M${x-2} ${y-2}l1 -2l1 2Zm4 0l1 -2l1 2Z`,ink,null);
  }
  path("M-37 -31q4 -2 7 3q1 -5 7 -5M13 -53q4 -1 6 2q1 -3 5 -3",null,"#51425a",1.5);
}

function festival(g) {
  const {path,oval,box,flag}=g;
  path("M-33 0V-37M31 0V-40",null,"#885f44",2);
  path("M-33 -36Q0 -17 31 -39",null,ink,1.4);
  const colors=["#e87965","#f6c65a","#6db2b0","#b192b8"];
  for(let i=0;i<8;i++){ const x=-28+i*8, y=-36+8*(1-(x/31)**2);
    path(`M${x} ${y}l6 1l-3 6Z`,colors[i%4],null); }
  box(-20,-3,37,5,"#669d94");
  oval(-4,-12,13,13,"#efa1a8",ink); oval(-12,-4,6,3.4,"#cb615e",ink); oval(4,-4,6,3.5,"#ca615b",ink);
  oval(-9,-15,1.4,2.3,ink); oval(-2,-15,1.4,2.3,ink);
  path("M-8 -10q3 3 6 -1",null,ink,1.1);
  path("M9 -23h10q-1 9 -5 9q-4 0 -5 -9ZM14 -14v6m-4 0h8", "#f8cc56",ink,1.5);
  for(const [x,y,c] of [[-25,-17,"#f6c65a"],[23,-22,"#68b1bd"],[28,-14,"#e98870"]]){
    path(`M${x} ${y}q-3 9 0 14`,null,"#8a776b",.7); oval(x,y,3.7,5,c,ink);
  }
  flag(34,-33,"#e78666");
}

function paintStamp(theme) {
  const canvas=document.createElement("canvas");
  canvas.width=700; canvas.height=660;
  const ctx=canvas.getContext("2d");
  ctx.translate(350,489); ctx.scale(6.5,6.5);
  ctx.lineJoin="round"; ctx.lineCap="round";
  const g=illustrator(ctx);
  g.path("M-49 -1Q-48 -8 -35 -10Q-20 -14 -5 -12Q9 -15 19 -11Q41 -12 48 -4Q53 0 44 5L33 9L26 15L16 14L8 21L2 25L-5 18L-14 20L-26 13L-37 10Z","#ad8164");
  g.path("M-45 3L-28 6L-16 16L-24 13ZM-10 8L1 11L4 20L-2 17ZM18 7L35 5L23 13L17 13Z","#ca9d71",null);
  g.path("M-49 -2Q-43 -10 -31 -10Q-18 -15 -4 -12Q6 -14 19 -11Q41 -12 48 -4Q51 0 42 3Q34 2 29 6Q20 9 12 5Q1 11 -9 6Q-21 8 -29 4Q-42 5 -49 -2Z",theme==="coral"?"#8abca0":"#8caf71");
  ({orchard,picnic,coral,castle,festival}[theme] || orchard)(g);
  for(const [x,y] of [[-41,0],[21,4],[-21,5],[39,-1]]) {g.oval(x,y,.9,.8,"#ffce72");g.oval(x+2,y-1,.8,.7,"#f7ebbd");}
  return canvas;
}

export function drawLandmark(ctx, theme, x, y, size, time = 0) {
  if(size<2) return;
  if(!stamps.has(theme)) stamps.set(theme,paintStamp(theme));
  const scale=size/100, bob=Math.sin(time*.65)*Math.min(size*.006,2);
  ctx.drawImage(stamps.get(theme),x-350/6.5*scale,y-489/6.5*scale+bob,700/6.5*scale,660/6.5*scale);
}
