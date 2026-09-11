import {species} from './rules.js?v=mega2';
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
    const stage=pose.stage||0;s*=(1+stage*.08)*(species[id].size||1);
    const a=pose.rare?{...species[id],color:'#c9a244',accent:'#b68ae6'}:species[id],heading=pose.heading??0,c=Math.cos(heading),sn=Math.sin(heading);
    const stride=pose.moving?Math.sin(pose.runCycle??0):0,bob=pose.moving?Math.abs(Math.cos(pose.runCycle??0))*.055:0;
    const b=(dx,dy,dz,w,h,d,color,target=faces)=>cuboid(corners(dx,dy,dz,w,h,d).map(([px,py,pz])=>[x+(px*c+pz*sn)*s,y+(py+bob)*s,z+(-px*sn+pz*c)*s]),color,heading,target);
    b(-.33,.18,-.28,.66,.52,.56,a.color);
    b(-.28,.04+Math.max(0,stride)*.13,-.24+stride*.14,.19,.2,.2,a.accent);
    b(.1,.04+Math.max(0,-stride)*.13,.08-stride*.14,.19,.2,.2,a.accent);
    // Each family grows its own silhouette instead of sharing a crown.
    if(stage){
      const reach=.18+stage*.11;
      if(id==='sprig'){for(const side of [-1,1]){b(side*.4-reach/2,.5,-.23,reach,.15,.6,a.accent);b(side*.3,1.05,-.1,.1,.15+stage*.13,.12,a.accent);}if(stage>1)b(-.15,.45,-.9,.3,.2,.6,a.color);}
      else if(id==='ember'){for(let i=0;i<stage+1;i++)b(-.08,.6+i*.15,-.45-i*.09,.16,.28,.15,i%2?'#ffe19a':'#ed713c');for(const side of [-1,1])b(side*.4-.12,.7,-.14,.24,.32,.4,'#bc593b');}
      else if(id==='bubble'||id==='mire'){b(-.45,.38,-.52,.9,.25+stage*.1,.65,a.accent);for(const side of [-1,1])b(side*.47-.07,.48,-.36,.14,.15,.45+stage*.12,a.color);if(stage>1)for(const side of [-1,1])b(side*.27-.08,.82,-.48,.16,.17,.55,a.accent);}
      else if(id==='pebble'||id==='steel'){for(const side of [-1,1]){b(side*.48-.16,.3,-.25,.32,.45+stage*.12,.42,a.accent);b(side*.45-.18,.04,.02,.36,.2,.38,a.color);}for(let i=0;i<stage;i++)b(-.23+i*.17,1.05,-.12,.13,.15+i*.09,.22,a.accent);}
      else if(id==='brawl'||id==='jab'){for(const side of [-1,1]){b(side*.48-.16,.46,.03,.32+stage*.05,.32,.35,a.accent);b(side*.2-.14,.03,.04,.28,.17,.42,a.color);}if(stage>1)b(-.32,.98,-.19,.64,.12,.55,'#e3c476');}
      else if(id==='fairy'){for(const side of [-1,1]){b(side*(.36+reach/2)-reach/2,.7,-.3,reach,.4,.1,a.accent);if(stage>1)b(side*.52-.16,.3,-.3,.32,.35,.12,a.accent);}b(-.06,1.02,-.02,.12,.2+stage*.1,.12,'#ffe1a9');}
      else if(id==='venom'){b(-.28,.18,-.65,.56,.2,.6,a.color);b(-.4,1.0,-.3,.8,.16,.7,a.accent);for(let i=0;i<stage;i++)b(-.34+i*.24,1.16,-.1,.13,.1,.13,'#ae62c6');}
      else if(id==='otter'){b(-.18,.15,-.85,.36,.12,.7,a.accent);for(const side of [-1,1])b(side*.42-.1,.4,.05,.2,.45,.2,a.color);b(-.3,.68,-.2,.65,.09,.58,a.accent);}
    }
    if(stage>=2){
      if(id==='sprig')for(const side of [-1,1])b(side*.37-.12,1.08,-.18,.24,.32,.23,a.accent);
      if(id==='ember')b(-.32,.67,-.35,.64,.24,.3,'#f4b94d');
      if(id==='bubble')for(const side of [-1,1])b(side*.4-.13,.77,.15,.26,.22,.65,a.accent);
      if(id==='mire')b(-.07,1.07,-.3,.14,.4,.6,a.accent);
      if(id==='otter')b(-.32,.35,-.22,.64,.4,.15,a.accent);
    }
    if(stage===3){
      if(id==='ember')for(const side of [-1,1]){b(side*.62-.25,.85,-.35,.5,.32,.15,'#ed713c');b(side*.82-.13,1.14,-.35,.26,.3,.15,'#ffc962');}
      if(id==='sprig')for(const side of [-1,1]){b(side*.4-.04,1.2,-.14,.08,.42,.08,'#78694a');b(side*.5-.25,1.46,-.23,.5,.2,.32,a.accent);}
      if(id==='bubble')for(const side of [-1,1]){b(side*.43-.16,.8,.05,.32,.3,.8,'#91e4e2');b(side*.43-.1,.87,.855,.2,.15,.025,'#316c82');}
      if(id==='pebble'||id==='steel')for(const side of [-1,1]){b(side*.56-.2,.24,-.23,.4,.75,.45,a.accent);b(side*.57-.09,.99,-.1,.18,.3,.18,id==='steel'?'#d4f6ef':'#b38add');}
      if(id==='fairy')for(const side of [-1,1]){b(side*.65-.3,.92,-.31,.6,.4,.13,'#edbef1');b(side*.76-.18,1.22,-.31,.36,.3,.13,'#f7ddec');}
      if(id==='brawl'||id==='jab')for(const side of [-1,1]){b(side*.56-.23,.33,.03,.46,.47,.54,a.accent);b(side*.45-.06,.82,-.03,.12,.25,.15,a.color);}
      if(id==='venom'){b(-.5,.05,-.65,1,.22,.85,a.color);b(-.6,1.1,-.34,1.2,.18,.85,a.accent);for(const side of [-1,1])b(side*.43-.05,.36,.3,.1,.5,.14,'#e4f690');}
      if(id==='mire')for(const side of [-1,1]){b(side*.7-.25,.34,-.21,.5,.12,.65,a.accent);b(side*.88-.09,.45,-.1,.18,.3,.3,a.accent);}
      if(id==='otter'){b(-.26,.15,-1.1,.52,.16,.85,a.accent);for(const side of [-1,1])b(side*.44-.13,.4,.15,.26,.6,.24,a.color);}
      for(const side of [-1,1])b(side*.53-.06,1.5,-.14,.12,.12,.12,'#b4f4f0');
    }
    const head=b(-.28,.66,-.15,.58,.42,.48,a.color);
    if(id==='venom'){b(-.39,1.07,-.25,.8,.13,.65,a.accent);b(-.18,.13,-.62,.36,.14,.45,a.color);}
    else if(id==='mire'){for(const side of [-1,1])b(side*.43-.13,.4,-.17,.26,.12,.48,a.accent);b(-.14,.28,-.67,.28,.2,.45,a.color);}
    else if(id==='jab'){for(const side of [-1,1]){b(side*.36-.13,.35,.17,.26,.3,.3,a.accent);b(side*.18-.1,1.07,.12,.2,.18,.22,a.accent);}}
    else if(id==='otter'){b(-.15,.18,-.67,.3,.12,.5,a.accent);b(-.26,1.07,-.04,.13,.16,.16,a.accent);b(.12,1.07,-.04,.13,.16,.16,a.accent);}
    else if(id==='bubble'){b(-.36,.37,-.38,.74,.35,.5,a.accent);b(-.24,1.08,-.1,.13,.13,.13,a.accent);}
    else if(id==='pebble'){b(-.16,1.08,-.07,.22,.22,.23,a.accent);}
    else{b(-.27,1.08,-.09,.15,.28,.19,a.accent);b(.13,1.08,-.09,.15,.28,.19,a.accent);b(-.12,.38,-.58,.22,.24,.35,a.accent);}
    // Keep tiny face voxels with their supporting face, so its center-depth
    // never paints over an eye. A creature facing away shows no floating eyes.
    if(head.front){const details=head.front.details=[];b(-.18,.82,.334,.105,.115,.025,'#25373c',details);b(.12,.82,.334,.105,.115,.025,'#25373c',details);b(-.06,.71,.337,.12,.055,.025,a.accent,details);}
  }
  function person(x,z,color='#e9b754',pose={}){
    const heading=pose.heading||0,c=Math.cos(heading),s=Math.sin(heading),stride=pose.moving?Math.sin(pose.runCycle||0):0,bob=Math.abs(stride)*.045;
    const b=(dx,y,dz,w,h,d,col,target=faces)=>cuboid(corners(dx,y,dz,w,h,d).map(([px,py,pz])=>[x+px*c+pz*s,py+bob,z-px*s+pz*c]),col,heading,target);
    for(const side of [-1,1]){const step=stride*side;
      b(side*.13-.08,.12+Math.max(0,step)*.13,-.13+step*.22,.16,.45,.23,'#344b65');
      b(side*.13-.09,.03+Math.max(0,step)*.13,-.08+step*.22,.18,.13,.3,'#263848');
      b(side*.33-.08,.6,-.12-step*.2,.16,.32,.2,color);
      b(side*.33-.085,.48,-.12-step*.2,.17,.17,.2,'#eac39a');
    }
    b(-.24,.57,-.17,.48,.48,.34,color);b(-.18,.65,-.27,.36,.35,.15,'#986b49');const head=b(-.2,1.05,-.19,.4,.37,.38,'#eac39a');b(-.24,1.4,-.23,.48,.12,.46,'#344b65');
    if(head.front){const eyes=head.front.details=[];for(const dx of [-.12,.07])b(dx,1.2,.195,.075,.08,.02,'#25373c',eyes);}
  }
  return {box,creature,person,flush,project};
}
export function portrait(canvas,id,stage=0,rare=false){
  const dpr=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth||220,h=canvas.clientHeight||145;
  canvas.width=w*dpr;canvas.height=h*dpr;const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const r=renderer(ctx,h*(stage>=2?.34:.43),w/2,h*.84);r.creature(id,0,0,0,.88,{stage,rare});r.flush();
}
