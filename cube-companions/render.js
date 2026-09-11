import {species} from './rules.js';
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
const corners=(x,y,z,w,h,d)=>[[x,y,z],[x+w,y,z],[x+w,y,z+d],[x,y,z+d],[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]];
export function renderer(ctx,scale,ox,oy){
  const faces=[];
  const project=(x,y,z)=>[ox+(x-z)*scale,oy+(x+z)*scale*.48-y*scale];
  function cuboid(p,color,yaw=0,target=faces){
    const visible={},c=Math.cos(yaw),s=Math.sin(yaw);
    // Cull by world-facing normals, including the sides exposed after a turn.
    for(const [name,ids,nx,nz] of [['back',[0,1,5,4],0,-1],['right',[1,2,6,5],1,0],['front',[2,3,7,6],0,1],['left',[3,0,4,7],-1,0],['top',[4,5,6,7],0,0]]){
      const wx=nx*c+nz*s,wz=-nx*s+nz*c;
      if(name!=='top'&&wx+wz<=1e-8)continue;
      const points=ids.map(i=>p[i]),f=name==='top'?1.12:.765+.065*(wx-wz);
      const depth=points.reduce((sum,v)=>sum+v[0]+v[2]+v[1]*.8,0)/4;
      const face={points:points.map(v=>project(...v)),color:shade(color,f),depth};
      visible[name]=face;target.push(face);
    }
    return visible;
  }
  function box(x,y,z,w,h,d,color){return cuboid(corners(x,y,z,w,h,d),color);}
  function flush(){
    const draw=f=>{ctx.beginPath();f.points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.strokeStyle=f.color;ctx.lineWidth=.5;ctx.stroke();if(f.details)f.details.sort((a,b)=>a.depth-b.depth).forEach(draw);};
    faces.sort((a,b)=>a.depth-b.depth).forEach(draw);faces.length=0;
  }
  // Heading is yaw in radians: 0 faces +z. runCycle advances while moving.
  function creature(id,x,y,z,s=1,pose={}){
    const stage=pose.stage||0;s*=1+stage*.12;
    const a=pose.rare?{...species[id],color:'#c9a244',accent:'#b68ae6'}:species[id],heading=pose.heading??0,c=Math.cos(heading),sn=Math.sin(heading);
    const stride=pose.moving?Math.sin(pose.runCycle??0):0,bob=pose.moving?Math.abs(Math.cos(pose.runCycle??0))*.055:0;
    const b=(dx,dy,dz,w,h,d,color,target=faces)=>cuboid(corners(dx,dy,dz,w,h,d).map(([px,py,pz])=>[x+(px*c+pz*sn)*s,y+(py+bob)*s,z+(-px*sn+pz*c)*s]),color,heading,target);
    b(-.33,.18,-.28,.66,.52,.56,a.color);
    b(-.28,.04+Math.max(0,stride)*.13,-.24+stride*.14,.19,.2,.2,a.accent);
    b(.1,.04+Math.max(0,-stride)*.13,.08-stride*.14,.19,.2,.2,a.accent);
    if(stage){b(-.4,.55,-.15,.12,.65,.2,a.accent);b(.3,.55,-.15,.12,.65,.2,a.accent);if(stage===2){b(-.28,1.12,-.1,.58,.14,.3,'#ffd766');for(const dx of [-.25,-.04,.17])b(dx,1.26,-.04,.1,.2,.16,'#ffd766');}}
    const head=b(-.28,.66,-.15,.58,.42,.48,a.color);
    if(id==='bubble'){b(-.36,.37,-.38,.74,.35,.5,a.accent);b(-.24,1.08,-.1,.13,.13,.13,a.accent);}
    else if(id==='pebble'){b(-.16,1.08,-.07,.22,.22,.23,a.accent);}
    else{b(-.27,1.08,-.09,.15,.28,.19,a.accent);b(.13,1.08,-.09,.15,.28,.19,a.accent);b(-.12,.38,-.58,.22,.24,.35,a.accent);}
    // Keep tiny face voxels with their supporting face, so its center-depth
    // never paints over an eye. A creature facing away shows no floating eyes.
    if(head.front){const details=head.front.details=[];b(-.18,.82,.334,.105,.115,.025,'#25373c',details);b(.12,.82,.334,.105,.115,.025,'#25373c',details);b(-.06,.71,.337,.12,.055,.025,a.accent,details);}
  }
  function person(x,z,color='#e9b754'){
    box(x-.18,.2,z-.13,.16,.37,.25,'#344b65');box(x+.03,.2,z-.13,.16,.37,.25,'#344b65');
    box(x-.24,.57,z-.17,.48,.48,.34,color);const head=box(x-.2,1.05,z-.19,.4,.37,.38,'#eac39a');box(x-.24,1.4,z-.23,.48,.12,.46,'#344b65');
    const eyes=head.front.details=[];
    for(const dx of [-.12,.07])cuboid(corners(x+dx,1.2,z+.195,.075,.08,.02),'#25373c',0,eyes);
  }
  return {box,creature,person,flush,project};
}
export function portrait(canvas,id,stage=0,rare=false){
  const dpr=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth||220,h=canvas.clientHeight||145;
  canvas.width=w*dpr;canvas.height=h*dpr;const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const r=renderer(ctx,h*.48,w/2,h*.84);r.creature(id,0,0,0,.88,{stage,rare});r.flush();
}
