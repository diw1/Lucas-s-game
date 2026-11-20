import {drawLandmark} from "./scenery.js";
import {getVista} from "./vistas.js";

const palettes = {
  orchard: {top:"#5297bb",mid:"#a6d5da",haze:"#ffdfa8",lower:"#a2c7b2",land:"#698e81",shadow:"#acc5cb",sun:"#fff3bf",skyline:"#8aa79e"},
  picnic: {top:"#77adc7",mid:"#c3dfdc",haze:"#ffe2ac",lower:"#c2d3b9",land:"#839b81",shadow:"#b8c7c7",sun:"#fff4cc",skyline:"#a6b39b"},
  coral: {top:"#398eae",mid:"#9bd7d6",haze:"#ffe4ba",lower:"#79bab6",land:"#55958e",shadow:"#9cbec9",sun:"#fff0bc",skyline:"#79abb0"},
  castle: {top:"#696d9b",mid:"#b6a8bd",haze:"#f4c3a1",lower:"#a49cb0",land:"#726f85",shadow:"#b4abbc",sun:"#ffecbd",skyline:"#a394aa"},
  festival: {top:"#7594ba",mid:"#c7c8d0",haze:"#ffcf9e",lower:"#c7b6ab",land:"#969785",shadow:"#c0b4bd",sun:"#fff0bb",skyline:"#b2a29d"}
};
const tau=Math.PI*2;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=n=>{const x=clamp(n,0,1);return x*x*(3-2*x);};

function seeded(id){
  let seed=2166136261;
  for(const letter of String(id))seed=Math.imul(seed^letter.charCodeAt(0),16777619);
  return ()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
}
function ellipse(ctx,x,y,rx,ry,color,stroke=null,line=1,tilt=0){
  if(rx<=0||ry<=0)return;
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,tilt,0,tau);
  if(color){ctx.fillStyle=color;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke();}
}
function draw(ctx,paint,edge,width,trace){
  ctx.beginPath();trace(ctx);
  if(paint){ctx.fillStyle=paint;ctx.fill();}
  if(edge){ctx.strokeStyle=edge;ctx.lineWidth=width;ctx.stroke();}
}
function polygon(ctx,points,paint,edge=null,width=1){
  draw(ctx,paint,edge,width,p=>{p.moveTo(...points[0]);for(const point of points.slice(1))p.lineTo(...point);p.closePath();});
}
function line(ctx,points,color,width=1){
  draw(ctx,null,color,width,p=>{p.moveTo(...points[0]);for(const point of points.slice(1))p.lineTo(...point);});
}
function star(ctx,x,y,size,color){
  polygon(ctx,[[x,y-size],[x+size*.24,y-size*.24],[x+size,y],[x+size*.22,y+size*.22],[x,y+size],[x-size*.23,y+size*.23],[x-size,y],[x-size*.23,y-size*.23]],color);
}
function surface(w,h){
  const c=document.createElement("canvas");c.width=w;c.height=h;return c;
}

function cloudStamp(pal,seed){
  const random=seeded("cloud"+seed), cloud=surface(260,125),c=cloud.getContext("2d");
  const lobes=[];
  for(let i=0;i<8;i++){
    const x=31+i*28, r=20+Math.sin(i/7*Math.PI)*15+random()*8;
    lobes.push({x,y:76-r*.25+(random()-.5)*14,r});
  }
  const g=c.createLinearGradient(0,18,0,96);
  g.addColorStop(0,"#fff8dd");g.addColorStop(.57,"#f6edda");g.addColorStop(1,pal.shadow);
  // One common fill across all lobes avoids dark individual circles in a cloud bank.
  c.fillStyle=g;c.beginPath();
  for(const l of lobes){c.moveTo(l.x+l.r,l.y);c.ellipse(l.x,l.y,l.r*1.16,l.r,0,0,tau);}
  c.ellipse(128,73,99,20,0,0,tau);c.fill();
  c.globalAlpha=.42;
  draw(c,pal.shadow,null,0,p=>{p.moveTo(19,84);p.bezierCurveTo(58,91,61,76,89,81);p.bezierCurveTo(112,84,129,94,153,84);p.bezierCurveTo(173,82,199,88,230,78);p.bezierCurveTo(202,97,59,105,19,84);});
  c.globalAlpha=.61;c.lineCap="round";
  draw(c,null,"#fff8de",2.3,p=>{p.moveTo(47,58);p.quadraticCurveTo(55,41,72,46);p.moveTo(141,43);p.quadraticCurveTo(153,32,166,43);});
  return cloud;
}

function backdrop(w,h,pal,theme,seed,vista){
  const b=surface(Math.max(1,Math.round(w)),Math.max(1,Math.round(h))),c=b.getContext("2d"),rng=seeded(seed+".sky");
  if(vista){
    const vw=vista.naturalWidth||vista.width,vh=vista.naturalHeight||vista.height;
    const scale=Math.max(w/vw,h/vh),sw=vw*scale,sh=vh*scale;
    c.drawImage(vista,(w-sw)*.5,(h-sh)*.47,sw,sh);
    return b;
  }
  const sky=c.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,pal.top);sky.addColorStop(.36,pal.mid);sky.addColorStop(.54,pal.haze);sky.addColorStop(1,pal.lower);
  c.fillStyle=sky;c.fillRect(0,0,w,h);
  const sx=w*.79,sy=h*.174,sr=Math.min(w,h)*.043,glow=c.createRadialGradient(sx,sy,sr*.35,sx,sy,h*.32);
  glow.addColorStop(0,"rgba(255,239,175,.55)");glow.addColorStop(.43,"rgba(255,231,169,.16)");glow.addColorStop(1,"rgba(255,239,175,0)");
  c.fillStyle=glow;c.fillRect(0,0,w,h);ellipse(c,sx,sy,sr,sr,pal.sun);
  c.lineCap="round";
  for(let i=0;i<22;i++){
    const x=rng()*w,y=(.035+rng()*.44)*h,len=(.024+rng()*.098)*w,wind=(rng()-.5)*h*.018;
    c.globalAlpha=.13+rng()*.14;
    draw(c,null,"#fff4cf",Math.max(1,h*.0023),p=>{p.moveTo(x,y);p.bezierCurveTo(x+len*.2,y+wind,x+len*.74,y-wind*.5,x+len,y+wind*.1);});
  }
  c.globalAlpha=1;
  if(theme==="castle"||theme==="festival"){
    for(let i=0;i<14;i++){const x=rng()*w,y=rng()*h*.285;star(c,x,y,1+rng()*1.6,"rgba(255,241,202,.72)");}
  }
  const ridge=(base,amp,color,count)=>{
    c.globalAlpha=.45;c.fillStyle=color;c.beginPath();c.moveTo(-5,base);
    let x=-5,y=base;
    for(let i=0;i<count;i++){
      const nx=(i+1)*w/count,ny=base-(.18+rng()*.82)*amp;
      c.bezierCurveTo(x+(nx-x)*.25,y,x+(nx-x)*.7,ny,nx,ny);x=nx;y=ny;
    }
    c.lineTo(w,h);c.lineTo(0,h);c.closePath();c.fill();
  };
  ridge(h*.523,h*.054,pal.skyline,15);ridge(h*.547,h*.035,pal.land,19);c.globalAlpha=1;
  const aerial=c.createLinearGradient(0,h*.50,0,h);aerial.addColorStop(0,"rgba(252,231,189,.53)");aerial.addColorStop(.39,"rgba(218,229,206,.25)");aerial.addColorStop(1,"rgba(198,216,206,0)");
  c.fillStyle=aerial;c.fillRect(0,h*.49,w,h*.51);
  // Far water and meadow contours put a quiet surface beneath the floating islands.
  for(let n=0;n<58;n++){
    const t=rng(),y=h*(.543+.45*t*t),x=rng()*w,len=w*(.008+t*.087)*(.45+rng());
    c.globalAlpha=.10+rng()*.11;line(c,[[x,y],[x+len*.7,y-1.4*t],[x+len,y]],n%3?"#ffedcf":pal.land,1+t*1.5);
  }
  return b;
}

function littleIsland(ctx,x,y,size,variant,pal){
  ctx.save();ctx.translate(x,y);ctx.scale(size/100,size/100);
  draw(ctx,"#a8866a","#8e8270",.8,p=>{p.moveTo(-49,0);p.quadraticCurveTo(-34,12,-20,12);p.lineTo(-13,21);p.lineTo(-3,18);p.lineTo(4,26);p.lineTo(14,13);p.quadraticCurveTo(38,12,49,1);p.closePath();});
  polygon(ctx,[[-14,9],[-3,9],[-4,18],[-10,20]],"#ccac7d");
  polygon(ctx,[[15,8],[30,4],[23,13],[13,16]],"#b39b79");
  ellipse(ctx,0,0,50,9,"#96b083");ellipse(ctx,-3,-2,42,6,"#aabf86");
  const tree=(xx,yy,s)=>{
    ctx.fillStyle="#7a715c";ctx.fillRect(xx-1.6*s,yy-12*s,3.4*s,13*s);
    if(variant%2===0){polygon(ctx,[[xx-9*s,yy-9*s],[xx,yy-31*s],[xx+9*s,yy-9*s]],"#5e8d79");
      polygon(ctx,[[xx-6.7*s,yy-16*s],[xx,yy-33*s],[xx+6.7*s,yy-16*s]],"#799e85");}
    else{ellipse(ctx,xx,yy-17*s,10*s,10*s,"#79a083");ellipse(ctx,xx-3*s,yy-20*s,7.3*s,7*s,"#94b28b");}
  };
  tree(-24,-2,.61);tree(-13,-3,.84);tree(24,-1,.58);
  if(variant%3===1){polygon(ctx,[[-2,-1],[12,-1],[12,-12],[-2,-12]],"#ddc48e");polygon(ctx,[[-5,-11],[5,-19],[15,-11]],"#bb8065");}
  else{ellipse(ctx,6,-3,9,4,pal.land);ellipse(ctx,13,-1,6,3,"#8e9d85");}
  ctx.restore();
}

function drawEnvelope(ctx,x,y,size,rot=0,flap=false){
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(size/54,size/54);
  ctx.shadowColor="rgba(52,60,64,.26)";ctx.shadowBlur=4;ctx.shadowOffsetY=2;
  if(flap)polygon(ctx,[[-26,-15],[-2,-35],[26,-15]],"#eabf82","#89674b",1.2);
  draw(ctx,"#fff5d7","#81644b",1.8,p=>{p.roundRect(-27,-16,54,32,3);});
  ctx.shadowColor="transparent";
  line(ctx,[[-26,14],[-8,0]],"#bbaa82",1.15);line(ctx,[[26,14],[8,0]],"#bbaa82",1.15);
  line(ctx,[[-24,-13],[0,5],[24,-13]],"#a58a65",1.7);
  ctx.fillStyle="#da6c55";ctx.fillRect(15,-12,7,8);
  for(let i=0;i<3;i++)line(ctx,[[-20+i*7,11],[-17+i*7,14]],i%2?"#719caa":"#d47b64",1.5);
  ellipse(ctx,0,4,4.3,4.3,"#bd604c");ctx.restore();
}

function mailbox(ctx,x,y,size,t,opened){
  ctx.save();ctx.translate(x,y);ctx.scale(size/70,size/70);
  ellipse(ctx,2,2,29,5,"rgba(50,71,63,.22)");
  polygon(ctx,[[-7,-5],[-3,-55],[4,-55],[5,0]],"#b18c58","#765d43",1.5);
  polygon(ctx,[[2,-50],[8,-51],[7,-1],[3,1]],"#8e6d4b");
  draw(ctx,"#c95743","#824c3d",2,p=>{p.moveTo(-26,-43);p.lineTo(-26,-64);p.bezierCurveTo(-24,-79,-8,-82,3,-77);p.lineTo(21,-71);p.lineTo(23,-43);p.quadraticCurveTo(2,-38,-26,-43);p.closePath();});
  draw(ctx,"#e57553","#9d5742",1.6,p=>{p.moveTo(-4,-42);p.lineTo(-4,-61);p.bezierCurveTo(-2,-81,24,-83,27,-63);p.lineTo(27,-43);p.quadraticCurveTo(13,-40,-4,-42);});
  draw(ctx,null,"#f0a174",2,p=>{p.moveTo(-22,-64);p.quadraticCurveTo(-17,-76,-6,-75);});
  ctx.fillStyle="#463e39";ctx.fillRect(1,-62,19,3.2);
  ctx.save();ctx.translate(12,-43);ctx.rotate(opened?-.55:0);ctx.fillStyle="#e6bf84";ctx.fillRect(-4,-5,8,3);ctx.restore();
  drawEnvelope(ctx,-15,-54,15,-.06);
  line(ctx,[[21,-45],[21,-86]],"#76583d",2.8);
  const flap=Math.sin(t*3)*1.7;
  polygon(ctx,[[21,-86],[39,-85+flap],[34,-79+flap],[21,-78]],"#efb947","#ac7a40",1);
  ctx.restore();
}

function windsock(ctx,x,y,size,t){
  ctx.save();ctx.translate(x,y);ctx.scale(size,size);
  line(ctx,[[0,0],[0,-40]],"#856d56",2);ellipse(ctx,0,-40,2.1,2.1,"#f5d78e");
  const shift=Math.sin(t*3)*2;
  for(let j=0;j<5;j++){const a=j*5,b=(j+1)*5;const yy=n=>-38+Math.sin(t*3-n*.18)*1.5+n*.14;
    polygon(ctx,[[a,yy(a)-4.3+j*.48],[b,yy(b)-4.3+(j+1)*.48],[b,yy(b)+4.3-(j+1)*.48],[a,yy(a)+4.3-j*.48]],j%2?"#f6dfb4":"#cf5e4a");}
  line(ctx,[[25,-34+shift],[30,-32+shift]],"#d87851",.9);ctx.restore();
}

function hoop(ctx,x,y,r,age,spin,passed=false){
  if(r<2)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(spin*.065);
  const tall=r*1.03,wire=clamp(r*.092,1.3,14),flicker=Math.sin(age*3.3+spin)*.055;
  ctx.lineCap="round";ctx.lineJoin="round";
  const rail=ctx.createLinearGradient(-r,-r,r,r);rail.addColorStop(0,"#ffe8a0");rail.addColorStop(.34,"#ffcc64");rail.addColorStop(.73,"#e7a544");rail.addColorStop(1,"#ffdd85");
  ctx.beginPath();ctx.ellipse(0,0,r,tall,0,0,tau);ctx.strokeStyle=passed?"#7ca78b":"#a47544";ctx.lineWidth=wire*1.52;ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,-wire*.13,r,tall,0,0,tau);ctx.strokeStyle=passed?"#c3e3af":rail;ctx.lineWidth=wire;ctx.stroke();
  ctx.beginPath();ctx.ellipse(-wire*.12,-wire*.23,r,tall,0,Math.PI*1.015,Math.PI*1.70);ctx.lineWidth=Math.max(.55,wire*.22);ctx.strokeStyle="#fff0b3";ctx.stroke();
  if(r>9){
    for(let i=0;i<8;i++){const a=i*Math.PI/4+.16;ctx.beginPath();ctx.ellipse(0,0,r,tall,0,a,a+.050);
      ctx.lineWidth=wire*1.12;ctx.strokeStyle=i%2?"#fcdfa1":"#a9794a";ctx.stroke();}
    for(const side of [-1,1]){
      const yy=Math.sin(age*3.8+side)*r*.05;
      polygon(ctx,[[side*r*.965,-r*.09],[side*r*1.35,-r*.15+yy],[side*r*1.24,-r*.022+yy],[side*r*1.37,r*.08+yy],[side*r*.975,r*.073]],"#d86048","#ac5d40",wire*.13);
      line(ctx,[[side*r*1.02,-r*.052],[side*r*1.21,-r*.059+yy*.4]],"#f7c995",wire*.23);
    }
  }
  if(r>15&&!passed){
    ctx.save();ctx.translate(0,-tall);ctx.rotate(flicker);drawEnvelope(ctx,0,0,r*.27);ctx.restore();
    star(ctx,r*.70,-r*.75,r*(.045+.015*Math.sin(age*4)),"#fff3bb");
  }
  ctx.restore();
}

function biplane(ctx,x,y,scale,bank,pitch,t,slow,reduced){
  ctx.save();ctx.translate(x,y);ctx.rotate(bank);ctx.scale(scale,scale);
  // The silhouette always has two staggered wings. Struts sit between their lit upper surfaces.
  const ox="#793e33",red="#c44c3b",vermilion="#e1674e",cream="#f5d495",metal="#776a55";
  const bob=reduced?0:Math.sin(t*4)*.78;ctx.translate(0,bob+pitch*2.2);
  ctx.lineJoin="round";ctx.lineCap="round";
  for(const a of [-1,1]){
    const vv=11+pitch*1.4;line(ctx,[[a*9,6],[a*19,23],[a*25,vv]],"#5f5245",2.4);
    ellipse(ctx,a*19,25.4,4.1,7.8,"#4b4d48","#393c39",1,-a*.08);
    ellipse(ctx,a*19.4,25.1,1.5,3.8,"#9c9781");
  }
  // The blurred propeller is ahead of the cockpit, rotating behind the leading wing.
  ctx.save();ctx.translate(0,-24.8-pitch*1.4);
  ellipse(ctx,0,0,28.7,5.4,"rgba(246,234,194,.2)","rgba(250,242,209,.28)",1);
  const phase=t*(slow?11:28);ctx.globalAlpha=.62;
  for(const a of [-1,1]){const xx=a*(7+18*Math.abs(Math.cos(phase))),yy=a*Math.sin(phase)*3;line(ctx,[[a*2,0],[xx,yy]],"#d4c095",2.6);}
  ctx.restore();
  function wing(rootY,half,depth,top){
    ctx.save();ctx.translate(0,rootY);
    for(const a of [-1,1]){
      ctx.save();ctx.scale(a,1);
      const fill=ctx.createLinearGradient(0,-9,0,depth);fill.addColorStop(0,top?"#ed7756":"#be4b38");fill.addColorStop(.54,top?"#d95b43":"#aa4133");fill.addColorStop(1,top?"#bf4b39":"#863f32");
      draw(ctx,fill,ox,1.45,p=>{
        p.moveTo(3,-3);p.bezierCurveTo(half*.27,-4,half*.76,-10,half-6,-9);
        p.quadraticCurveTo(half+3,-8,half-1,-1);p.lineTo(half-8,depth-3);
        p.bezierCurveTo(half*.76,depth+1,half*.24,depth+3,4,depth-1);p.closePath();
      });
      const s=half*.72;polygon(ctx,[[s,-7],[s+8,-7.9],[s+5,depth-.8],[s-4,depth+.05]],cream);
      polygon(ctx,[[s+10.8,-8.2],[s+13.7,-8.4],[s+10.8,depth-1.3],[s+8.1,depth-1]],"#e9b771");
      draw(ctx,null,top?"#f79972":"#d97354",1.1,p=>{p.moveTo(8,-2);p.quadraticCurveTo(half*.57,-4.9,half-6,-7.1);});
      for(let j=0;j<3;j++){const sx=half*(.32+j*.12);line(ctx,[[sx,0],[sx-1.5,depth*.78]],"rgba(120,57,47,.35)",.8);}
      ctx.restore();
    }ctx.restore();
  }
  wing(7,80,11,false);
  for(const a of [-1,1]){
    line(ctx,[[a*60,11.5],[a*63,-13],[a*48,11.5]],ox,2.4);
    line(ctx,[[a*62.7,-13],[a*61,10.5]],"#c4b591",.95);
    line(ctx,[[a*30,10],[a*62,-13]],"rgba(91,79,65,.6)",.9);
    line(ctx,[[a*13,-5],[a*25,-16],[a*33,7.5]],metal,1.8);
  }
  // A warm reflected underside and rounded cowling give the craft depth at small sizes.
  const fuse=ctx.createLinearGradient(-15,0,15,0);fuse.addColorStop(0,"#8c4034");fuse.addColorStop(.30,"#d15e44");fuse.addColorStop(.58,"#e77d4d");fuse.addColorStop(1,"#a34839");
  draw(ctx,fuse,ox,1.5,p=>{p.moveTo(-12,-20);p.bezierCurveTo(-26,-13,-15,15,-8,32);p.quadraticCurveTo(0,42,8,32);p.bezierCurveTo(16,13,23,-11,12,-20);p.quadraticCurveTo(0,-28,-12,-20);});
  ellipse(ctx,0,-21,13,6,"#bd7052",ox,1.3);line(ctx,[[-10,-21],[9,-22]],"#e9be7e",1.2);
  wing(-16.4,92,10.5,true);
  ellipse(ctx,0,-6.4,12.9,8.9,"#714b3c","#e7aa72",1.8);
  for(const a of [-1,1]){
    polygon(ctx,[[a*4.4,-14],[a*12.4,-31],[a*13.9,-8.5]],"#bbc6c0","#566361",1.15);
    polygon(ctx,[[a*8.4,-15],[a*11.6,-25],[a*12.7,-13.1]],"#d69e99");
  }
  ellipse(ctx,0,-8.9,11.2,9.4,"#aeb9b7","#56615f",1.05);
  draw(ctx,"#bec7c1",null,0,p=>{p.moveTo(-10,-9);p.quadraticCurveTo(-14,-17,-8,-17);p.quadraticCurveTo(0,-22,8,-16);p.quadraticCurveTo(2,-17,-1,-13);p.lineTo(-3,-15);p.closePath();});
  draw(ctx,null,"#886443",2.1,p=>{p.moveTo(-10,-11);p.quadraticCurveTo(0,-16,10,-11);});
  for(const a of [-1,1]){
    ellipse(ctx,a*5.4,-14.7,4.7,3.1,"#a3d1d0","#79573d",1.1,-a*.12);
    line(ctx,[[a*5.5-1.3,-15.9],[a*5.5+1.6,-16.2]],"#f1e2b6",.8);
    line(ctx,[[a*9,-6.2],[a*15.2,-7.2]],"#66716b",.63);
    line(ctx,[[a*9,-4.5],[a*14.8,-3.4]],"#66716b",.62);
  }
  draw(ctx,null,"#4d918d",3.5,p=>{p.moveTo(-9,-3);p.quadraticCurveTo(0,1,9,-3);});
  // The kitten's teal scarf trails toward the tail, moving opposite the bank.
  const wave=reduced?0:Math.sin(t*5.3)*3,sw=-bank*16;
  draw(ctx,"#60aaa0","#3d7571",.9,p=>{p.moveTo(4,-1);p.bezierCurveTo(7,3,16+sw,5,15+wave+sw,9);p.quadraticCurveTo(13+sw,12,23+wave+sw,17);p.lineTo(18+wave+sw,17);p.lineTo(20+wave+sw,21);p.bezierCurveTo(10+sw,17,9+sw,9,10,7);p.quadraticCurveTo(7,4,2,3);p.closePath();});
  for(const a of [-1,1]){
    ctx.save();ctx.scale(a,1);
    draw(ctx,vermilion,ox,1.25,p=>{p.moveTo(2,25);p.quadraticCurveTo(16,24,34,30);p.quadraticCurveTo(37,33,31,35);p.lineTo(6,34);p.closePath();});
    line(ctx,[[22,29],[19,34]],cream,2.7);ctx.restore();
  }
  draw(ctx,red,ox,1.25,p=>{p.moveTo(-2,32);p.lineTo(-2,14);p.quadraticCurveTo(0,6,3,16);p.lineTo(6,33);p.quadraticCurveTo(2,36,-2,32);});
  line(ctx,[[.5,20],[2,30]],cream,1.6);
  ctx.restore();
}

function ringPositions(route,total,duration){
  const rnd=seeded(route.id+".hoops"),points=[];
  const easy=Number(route.level||1)<=2;
  for(let i=0;i<total;i++){
    const origin=6.6,span=duration-13-origin;
    const arc=total===1 ? .4 : i/(total-1);
    let x=i===0?0:Math.sin(i*1.92+(rnd()-.5)*.54)*(easy ? .58 : .76);
    let y=i===0?0:Math.cos(i*1.42+.58+(rnd()-.5)*.47)*(easy ? .40 : .66);
    if(route.theme==="festival"&&i){x=(i%2?1:-1)*(.59+(i%3)*.065);y=Math.sin(i*Math.PI*.52)*.66;}
    points.push({pass:origin+arc*span,x,y,status:"pending",seed:rnd()*2-1});
  }
  return points;
}

export function startFlight(canvas,route,callbacks={}){
  const ctx=canvas.getContext("2d",{alpha:false});
  if(!ctx)throw new Error("Cloudpost Express needs a 2D canvas.");
  const pal=palettes[route.theme]||palettes.orchard,total=clamp(Math.round(route.rings)||6,1,18);
  const level=clamp(Number(route.level)||1,1,5),duration=45+(level-1)*3.4;
  const dropTime=duration-2.5,rings=ringPositions(route,total,duration);
  const random=seeded(route.id+".weather"), clouds=Array.from({length:4},(_,i)=>cloudStamp(pal,i));
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const plane={x:0,y:0,aimX:0,aimY:0,bank:0,pitch:0};
  const features=[],particles=[],trails=[],keys=new Set(),undoListeners=[];
  const arrows={arrowup:"up",w:"up",arrowdown:"down",s:"down",arrowleft:"left",a:"left",arrowright:"right",d:"right"};
  let w=1,h=1,dpr=1,bg,vista=null,skyTime=0,flightTime=0,deliveryTime=0,caught=0;
  let mode="cruise",paused=false,dead=false,raf=0,lastFrame=null,pointer=null,lastHud="";
  let flash="",flashUntil=0,replyUntil=0,reply="",trailTime=0,sizePlane=1,deliveryStart=null;

  for(let i=-8;i<(duration+24)*1.15;i++){
    const side=i%2===0?1:-1, k=random(), pass=i*.93+(random()-.5)*.61;
    features.push({kind:k<.62?"cloud":k<.87?"island":k<.95?"birds":"balloon",pass,
      x:side*(1.32+random()*2.7),y:k<.62?-1.4+random()*3.6:k<.87?-.2-random()*1.8:.35+random()*1.25,
      size:k<.62?.35+random()*.30:.18+random()*.15,seed:Math.floor(random()*350)});
  }

  function listen(node,event,fn,options){node.addEventListener(event,fn,options);undoListeners.push(()=>node.removeEventListener(event,fn,options));}
  function event(type){callbacks.onEvent?.(type);}
  function dispatchHud(force=false){
    const n=Math.round(clamp(flightTime/dropTime,0,1)*100),canDeliver=mode==="ready";
    let hint;
    if(mode==="ready")hint="Your drop zone is open. Press Space or tap Deliver mail.";
    else if(mode==="delivering"||mode==="finished")hint="Special delivery! Your letter is on its way.";
    else if(skyTime<replyUntil)hint=reply;
    else if(flightTime<9)hint="Drag the sky or use arrow keys to fly through the gold rings.";
    else if(flightTime>duration-12)hint="There’s the post stop! Fly on to the red mailbox.";
    else if(route.theme==="coral")hint="The sea breeze bobs the hoops. Follow them up and down.";
    else if(route.theme==="festival")hint="Fly the parade slalom. The hoops take turns on the left and right.";
    else hint="Steer toward the next gold ring. Your letter stays safe if you miss.";
    const signature=n+"|"+caught+"|"+hint+"|"+canDeliver;
    if(!force&&signature===lastHud)return;lastHud=signature;
    callbacks.onHUD?.({caught,total,progress:n/100,hint,canDeliver});
  }
  function measure(){
    const r=canvas.getBoundingClientRect();if(r.width<2||r.height<2)return;
    w=r.width;h=r.height;dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));
    sizePlane=clamp(Math.min(w*.35,h*.51),74,260)/184;
    bg=backdrop(w,h,pal,route.theme,route.id,vista);
    trails.length=0;drawFrame();
  }
  function aircraft(){
    // A following chase camera shares part of each movement with the plane.
    return {x:w*(.5+plane.x*.181),y:h*(.727-plane.y*.138)};
  }
  function project(x,y,distance){
    const vpX=w*(.50-plane.x*.037),vpY=h*(.445+plane.y*.024);
    const nearX=w*(.5+(x-plane.x*.545)*.397), nearY=h*(.727-(y-plane.y*.46)*.255);
    const k=2.62/Math.max(.48,2.62+distance);
    return {x:lerp(vpX,nearX,k),y:lerp(vpY,nearY,k),k};
  }
  function hoopCenter(r){
    if(route.theme==="coral"&&r!==rings[0])return {x:r.x,y:r.y+Math.sin(flightTime*.98+r.seed*2.9)*.145};
    return r;
  }
  const nearRadius=()=>Math.min(w*.164,h*.194);
  function dest(){
    const approach=ease((flightTime-(duration-28))/25.5), drift=plane.x*.022;
    const size=Math.min(w*.76,h*.838)*lerp(.038,.95,approach);
    const x=clamp(w*(.56+.075*approach-drift*(1-approach*.65)),size*.55+5,w-size*.55-5);
    const y=h*(.45+.247*approach+plane.y*.009);
    const boxSize=clamp(size*.181,2,h*.187);
    return {x,y,size,alpha:clamp((flightTime-(duration-33))/8,0,1),mailX:x+size*.156,mailY:y+size*.044,boxSize};
  }
  function activeInput(){return !dead&&!paused&&mode!=="delivering"&&mode!=="finished";}
  function steer(dx,dy){
    if(!activeInput()||!Number.isFinite(dx)||!Number.isFinite(dy))return;
    plane.aimX=clamp(plane.aimX+clamp(dx,-1,1)*.40,-1.04,1.04);
    plane.aimY=clamp(plane.aimY-clamp(dy,-1,1)*.40,-.96,.96);
  }
  function releasePointer(){
    if(pointer){try{if(canvas.hasPointerCapture(pointer.id))canvas.releasePointerCapture(pointer.id);}catch{/* The pointer has already left. */}}
    pointer=null;
  }
  listen(canvas,"pointerdown",e=>{
    if(!activeInput()||pointer||(e.pointerType==="mouse"&&e.button!==0))return;
    canvas.focus({preventScroll:true});
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY,aimX:plane.aimX,aimY:plane.aimY};
    try{canvas.setPointerCapture(e.pointerId);}catch{/* A lost touch can still be ended normally. */}
    e.preventDefault();
  });
  listen(canvas,"pointermove",e=>{
    if(!activeInput()||pointer?.id!==e.pointerId)return;
    plane.aimX=clamp(pointer.aimX+(e.clientX-pointer.x)/(w*.30),-1.04,1.04);
    plane.aimY=clamp(pointer.aimY-(e.clientY-pointer.y)/(h*.29),-.96,.96);
  });
  const endPointer=e=>{if(pointer?.id===e.pointerId)releasePointer();};
  listen(canvas,"pointerup",endPointer);listen(canvas,"pointercancel",endPointer);
  listen(canvas,"lostpointercapture",e=>{if(pointer?.id===e.pointerId)pointer=null;});
  listen(window,"keydown",e=>{
    if(!activeInput()||e.repeat&&e.code==="Space"||e.metaKey||e.altKey||e.ctrlKey)return;
    const k=e.key.toLowerCase(),target=e.target;
    if(target?.isContentEditable||target?.closest?.("input,textarea,select,dialog"))return;
    if(arrows[k]){e.preventDefault();keys.add(k);}
    else if(e.code==="Space"&&!(target?.closest?.("button,a"))){e.preventDefault();deliver();}
  });
  listen(window,"keyup",e=>keys.delete(e.key.toLowerCase()));
  const forgetInput=()=>{keys.clear();releasePointer();lastFrame=null;};
  listen(window,"blur",forgetInput);
  listen(document,"visibilitychange",forgetInput);

  function burst(x,y,speed=1){
    const length=reduced.matches?5:17;
    for(let n=0;n<length;n++){
      const a=n/length*tau+(n%3)*.07,rad=(.023+.014*(n%4))*Math.min(w,h)*speed;
      particles.push({x,y,vx:Math.cos(a)*rad*4,vy:Math.sin(a)*rad*3.5,t:0,life:.48+(n%6)*.07,
        sz:Math.max(2,Math.min(w,h)*(.006+(n%3)*.003)),color:["#ffe293","#fff0bd","#ec9b60","#d86c4f"][n%4],spin:n*.5});
    }
  }
  function collect(r,p){
    r.status="caught";r.changed=flightTime;caught++;
    burst(p.x,p.y,1.15);flash="+1 ring";flashUntil=skyTime+.86;
    reply=caught===total?"Every ring stamped! The mailbox is just ahead.":"Ring stamped!";replyUntil=skyTime+1.2;
    event("ring");dispatchHud(true);
  }
  function deliver(){
    if(dead||paused||mode!=="ready")return false;
    const a=aircraft();deliveryStart={x:a.x/w,y:(a.y-4*sizePlane)/h};
    deliveryTime=0;mode="delivering";keys.clear();releasePointer();event("deliver");dispatchHud(true);return true;
  }
  function step(dt){
    if(dead||paused||mode==="finished")return;
    skyTime+=dt;
    if(mode==="cruise")flightTime=Math.min(dropTime,flightTime+dt);
    const dx=Number(keys.has("arrowright")||keys.has("d"))-Number(keys.has("arrowleft")||keys.has("a"));
    const dy=Number(keys.has("arrowup")||keys.has("w"))-Number(keys.has("arrowdown")||keys.has("s"));
    plane.aimX=clamp(plane.aimX+dx*dt*1.33,-1.04,1.04);
    plane.aimY=clamp(plane.aimY+dy*dt*1.22,-.96,.96);
    const ax=plane.x,ay=plane.y,follow=1-Math.exp(-dt*9);
    plane.x=lerp(plane.x,plane.aimX,follow);plane.y=lerp(plane.y,plane.aimY,follow);
    if(dt>0){plane.bank=lerp(plane.bank,clamp((plane.x-ax)/dt*.27,-.31,.31),1-Math.exp(-dt*8));
      plane.pitch=lerp(plane.pitch,clamp((plane.y-ay)/dt,-1,1),1-Math.exp(-dt*7));}
    if(mode==="cruise"){
      for(const r of rings){
        if(r.status!=="pending")continue;
        const after=flightTime-r.pass;
        if(after>=-.43&&after<=.68){
          const center=hoopCenter(r),p=project(center.x,center.y,0),planeAt=aircraft(),radius=nearRadius();
          // Compare to the visible hoop, with a small tolerance for the last half-second.
          const testX=(planeAt.x-p.x)/(radius*1.055),testY=(planeAt.y-p.y)/(radius*1.09);
          if(testX*testX+testY*testY<=1)collect(r,p);
        }else if(after>.68){
          r.status="missed";r.changed=flightTime;reply="Keep flying — your letter is safe.";replyUntil=skyTime+1.5;event("miss");
        }
      }
      if(flightTime>=dropTime){mode="ready";event("approach");dispatchHud(true);}
    }
    if(mode==="delivering"){
      const prev=deliveryTime;deliveryTime+=dt;
      if(prev<1.13&&deliveryTime>=1.13){const o=dest();burst(o.mailX,o.mailY-o.boxSize*.88,.92);}
      if(deliveryTime>=1.93){mode="finished";dispatchHud(true);callbacks.onFinish?.({caught,total});return;}
    }
    trailTime+=dt;
    if(!reduced.matches&&trailTime>.095&&mode!=="delivering"){
      trailTime=0;const a=aircraft();
      for(const side of [-1,1])trails.push({x:a.x+Math.cos(plane.bank)*side*80*sizePlane,y:a.y+Math.sin(plane.bank)*side*80*sizePlane+8*sizePlane,age:0,side});
    }
    for(let i=trails.length-1;i>=0;i--){const v=trails[i];v.age+=dt;v.x+=v.side*w*.045*dt;v.y+=h*.105*dt;if(v.age>.53)trails.splice(i,1);}
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=h*.072*dt;if(p.t>=p.life)particles.splice(i,1);}
    dispatchHud();
  }
  function renderFeature(obj){
    const distance=obj.pass-flightTime,j=project(obj.x,obj.y,distance),width=Math.min(w,h*1.7)*obj.size*j.k;
    if(j.x+width*1.1<0||j.x-width*1.1>w||j.y+width<h*-.1||j.y-width>h*1.2)return;
    ctx.save();ctx.globalAlpha=clamp((22-distance)/5,0,1)*clamp(.56+j.k*.40,.48,1);
    if(obj.kind==="cloud"){
      const stamp=clouds[obj.seed%clouds.length],float=reduced.matches?0:Math.sin(skyTime*.48+obj.seed)*width*.012;
      ctx.drawImage(stamp,j.x-width*.5,j.y-width*.21+float,width,width*.49);
    }else if(obj.kind==="island")littleIsland(ctx,j.x,j.y,width,obj.seed,pal);
    else if(obj.kind==="birds"){
      const s=width*.064;ctx.lineCap="round";
      for(let i=0;i<3;i++){const x=j.x+(i-1)*s*3.25,y=j.y+Math.abs(i-1)*s*1.4;
        const v=Math.sin(skyTime*4+i)*s*.68;
        draw(ctx,null,"#648a8b",Math.max(.65,s*.16),p=>{p.moveTo(x-s,y-v);p.quadraticCurveTo(x-s*.3,y-s*.4,x,y+.9*s);p.quadraticCurveTo(x+s*.3,y-s*.4,x+s,y-v);});}
    }else{
      const s=width*.16;ellipse(ctx,j.x,j.y-s*.9,s*.69,s,"#dc9b74","#a48265",Math.max(.65,s*.045));
      ellipse(ctx,j.x,j.y-s*.9,s*.23,s,"#f5d49b");line(ctx,[[j.x-s*.35,j.y],[j.x-s*.14,j.y+s*.42],[j.x+s*.14,j.y+s*.42],[j.x+s*.35,j.y]],"#806f59",Math.max(.6,s*.065));
      ctx.fillStyle="#a07754";ctx.fillRect(j.x-s*.22,j.y+s*.37,s*.44,s*.28);
    }ctx.restore();
  }
  function drawPostStop(){
    const d=dest();if(d.alpha<=0)return;
    ctx.save();ctx.globalAlpha=d.alpha;drawLandmark(ctx,route.theme,d.x,d.y,d.size,skyTime);
    if(d.size>18){windsock(ctx,d.x-d.size*.18,d.y+d.size*.022,d.size/160,skyTime);mailbox(ctx,d.mailX,d.mailY,d.boxSize,skyTime,mode==="delivering"&&deliveryTime>1.05);}
    if(mode==="ready"||mode==="delivering"&&deliveryTime<1.15){
      const float=reduced.matches?0:Math.sin(skyTime*3)*3, y=d.mailY-d.boxSize*1.48+float;
      const s=clamp(d.boxSize*.17,6,16);
      ctx.save();ctx.globalAlpha=.77;
      draw(ctx,null,"#fff1bf",Math.max(2,s*.25),p=>{p.moveTo(d.mailX-s*.65,y);p.lineTo(d.mailX,y+s*.53);p.lineTo(d.mailX+s*.65,y);});ctx.restore();
    }ctx.restore();
  }
  function drawAirLanes(next){
    if(!next||next.pass-flightTime>13)return;
    const gap=next.pass-flightTime;if(gap<.85)return;
    // A few glints connect the flight line to the next visible ring.
    ctx.save();ctx.globalAlpha=.60;
    const center=hoopCenter(next),pos=aircraft(),ahead=project(center.x,center.y,gap);
    for(let i=1;i<=4;i++){
      const f=i/5,alpha=.18+.44*f;
      const x=lerp(pos.x,ahead.x,f),y=lerp(pos.y-h*.07,ahead.y,f);
      ellipse(ctx,x,y,Math.max(1,(1-f)*w*.0028),Math.max(1,(1-f)*w*.0028),"rgba(255,245,205,"+alpha+")");
    }ctx.restore();
  }
  function drawRing(r,secondary=false){
    const distance=r.pass-flightTime;if(distance>25||distance< -1.52)return;
    const center=hoopCenter(r),p=project(center.x,center.y,distance),radius=nearRadius()*p.k;
    const since=flightTime-(r.changed??flightTime),alive=r.status==="caught"?clamp(1-since/.69,0,1):1;
    if(!alive)return;ctx.save();
    ctx.globalAlpha=clamp((25-distance)/7,.05,1)*alive*(secondary ? .52 : 1)*(r.status==="missed"?clamp(1-since/.75,0,1):1);
    hoop(ctx,p.x,p.y,radius,skyTime,r.seed,r.status==="caught");ctx.restore();
  }
  function drawTrails(){
    ctx.save();ctx.lineCap="round";
    for(const v of trails){
      const f=v.age/.53;ctx.globalAlpha=(1-f)*.27;
      line(ctx,[[v.x,v.y],[v.x+v.side*(1+f)*4*sizePlane,v.y+(2+f*5)*sizePlane]],"#fff5d4",Math.max(.75,2*sizePlane*(1-f)));
    }ctx.restore();
  }
  function deliveryEnvelope(){
    if(mode!=="delivering"||deliveryTime>1.17||!deliveryStart)return;
    const a=clamp(deliveryTime/1.15,0,1),f=ease(a),d=dest();
    const from={x:deliveryStart.x*w,y:deliveryStart.y*h},to={x:d.mailX+d.boxSize*.14,y:d.mailY-d.boxSize*.84};
    const mid={x:(from.x+to.x)*.5-w*.055,y:Math.min(from.y,to.y)-h*.25};
    const at=v=>({x:(1-v)**2*from.x+2*(1-v)*v*mid.x+v*v*to.x,y:(1-v)**2*from.y+2*(1-v)*v*mid.y+v*v*to.y});
    const p=at(f);ctx.save();ctx.lineCap="round";
    for(let i=1;i<=6;i++){const n=Math.max(0,f-i*.04);if(n===0)continue;const q=at(n);
      ellipse(ctx,q.x,q.y,Math.max(.8,3-i*.27),Math.max(.8,3-i*.27),"rgba(255,240,184,"+(.65-i*.07)+")");}
    drawEnvelope(ctx,p.x,p.y,lerp(Math.min(w*.114,h*.131),d.boxSize*.23,f),-.15+Math.sin(f*Math.PI)*.64);ctx.restore();
  }
  function drawFrame(){
    if(dead||!bg)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalAlpha=1;
    const fringe=(!reduced.matches&&vista)?Math.min(w,h)*.015:0;
    ctx.drawImage(bg,-fringe*(1+plane.x*.85),-fringe*(1-plane.y*.73),w+2*fringe,h+2*fringe);
    const ordered=features.filter(o=>o.pass>flightTime-1.62&&o.pass<flightTime+22).sort((a,b)=>b.pass-a.pass);
    const nextIndex=rings.findIndex(r=>r.status==="pending"), next=rings[nextIndex];
    for(const o of ordered)if(o.pass-flightTime>3.25)renderFeature(o);
    drawPostStop();
    for(const o of ordered)if(o.pass-flightTime<=3.25)renderFeature(o);
    if(mode==="cruise"){
      // Nearby cloud banks open out to the edges much faster than the distant coast.
      for(const side of [-1,1]){
        const u=((flightTime*.092+(side===1 ? .49 : .01))%1),drift=ease(u);
        const sw=Math.min(w,h*1.8)*(.082+.335*drift),sx=w*(.5+side*(.28+.39*drift)-plane.x*.032*drift);
        const sy=h*(.558+.47*drift+plane.y*.019);
        ctx.save();ctx.globalAlpha=(vista ? .56 : .81)*clamp(u*5,0,1)*clamp((1-u)*8,0,1);
        ctx.drawImage(clouds[side===1?1:3],sx-sw*.5,sy-sw*.23,sw,sw*.49);ctx.restore();
      }
    }
    drawAirLanes(next);
    for(let i=rings.length-1;i>=0;i--){
      if(rings[i].pass-flightTime<=.05||rings[i].status==="pending"&&i>nextIndex+1)continue;
      drawRing(rings[i],rings[i].status==="pending"&&i>nextIndex);
    }
    const pilot=aircraft();drawTrails();
    biplane(ctx,pilot.x,pilot.y,sizePlane,reduced.matches?plane.bank*.54:plane.bank,plane.pitch,skyTime,mode!=="cruise",reduced.matches);
    for(let i=rings.length-1;i>=0;i--)if(rings[i].pass-flightTime<=.05)drawRing(rings[i]);
    deliveryEnvelope();
    ctx.save();
    for(const p of particles){const f=p.t/p.life;ctx.globalAlpha=1-f;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.spin+f*2);
      star(ctx,0,0,p.sz*(1-f*.63),p.color);ctx.restore();}
    ctx.restore();
    if(skyTime<flashUntil&&flash){
      const size=clamp(Math.min(w*.036,h*.042),12,21),x=pilot.x,y=pilot.y-sizePlane*42-(.86-(flashUntil-skyTime))*15;
      ctx.save();ctx.globalAlpha=clamp((flashUntil-skyTime)*4.5,0,1);ctx.textAlign="center";ctx.lineJoin="round";
      ctx.font="700 "+size+"px system-ui, sans-serif";ctx.lineWidth=Math.max(2.4,size*.20);ctx.strokeStyle="#735b39";ctx.strokeText(flash,x,y);
      ctx.fillStyle="#fff0b1";ctx.fillText(flash,x,y);ctx.restore();
    }
  }
  function tick(now){
    raf=0;if(dead||paused||mode==="finished")return;
    if(!document.hidden){
      const dt=lastFrame===null?0:clamp((now-lastFrame)/1000,0,.10);lastFrame=now;
      step(dt);drawFrame();
    }else lastFrame=null;
    if(!dead&&!paused&&mode!=="finished")raf=requestAnimationFrame(tick);
  }
  function pause(){if(dead||paused)return;paused=true;forgetInput();cancelAnimationFrame(raf);raf=0;}
  function resume(){if(dead||!paused||mode==="finished")return;paused=false;lastFrame=null;raf=requestAnimationFrame(tick);}
  function destroy(){if(dead)return;dead=true;cancelAnimationFrame(raf);forgetInput();observer.disconnect();undoListeners.forEach(fn=>fn());}
  vista=getVista(route.theme,loaded=>{
    if(dead)return;
    vista=loaded;bg=backdrop(w,h,pal,route.theme,route.id,vista);drawFrame();
  });
  const observer=new ResizeObserver(measure);observer.observe(canvas);measure();dispatchHud(true);raf=requestAnimationFrame(tick);
  return {pause,resume,destroy,deliver,steer};
}
