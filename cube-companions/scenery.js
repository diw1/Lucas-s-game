import {regionAt} from './adventure.js?v=types18';
// Bounded, deterministic decorations; tiny props never block the walking paths.
export function drawScenery(r,player,time,reduced=false){
 const t=reduced?0:time*.001;
 for(let gx=Math.floor(player.x/3)-5;gx<=Math.floor(player.x/3)+5;gx++)for(let gz=Math.floor(player.z/3)-5;gz<=Math.floor(player.z/3)+5;gz++){
  const seed=(Math.imul(gx,73856093)^Math.imul(gz,19349663))>>>0;
  const x=gx*3+.4+(seed%13)/13,z=gz*3+.6+(seed%17)/17;
  if(Math.abs(x)<2||Math.abs(z)<2||Math.hypot(x,z-3.5)<5)continue;
  const biome=regionAt(x,z),sway=Math.sin(t*1.7+seed)*.06;
  if(biome.id==='grove'||biome.id==='fairy'){
   r.box(x,0,z,.09,.22,.08,'#528454');r.box(x-.1,.21,z-.07,.3,.06,.22,biome.id==='fairy'?'#f8cef4':'#f4db8a');
   if(seed%3===0){r.box(x+.42,0,z+.25,.08,.2,.08,'#e6d7b8');r.box(x+.3,.18,z+.13,.33,.09,.32,biome.id==='fairy'?'#c878d0':'#cb775c');}
   r.box(x-.25+sway,.03,z+.3,.06,.2,.05,'#629854');
   if(biome.id==='fairy')r.box(x+sway,.6+Math.sin(t+seed)*.16,z+.25,.045,.045,.045,'#fff2b4');
  }else if(biome.id==='lake'){
   r.box(x,0,z,.05,.44,.05,'#538969');r.box(x-.02,.39,z-.02,.09,.15,.09,'#95754a');r.box(x+.15+sway,0,z+.12,.04,.31,.04,'#639f69');
   r.box(x+.45,.01,z+.5,.4,.02,.3,'#689e79');r.box(x+.55,.035,z+.55,.1,.04,.1,'#f5e1ec');
   r.box(x-.4,.018,z+.6+Math.sin(t+seed)*.1,.5,.015,.025,'#b5eaeb');
  }else if(biome.id==='volcano'){
   r.box(x,0,z,.6,.22,.5,'#624d50');r.box(x+.08,.22,z+.07,.4,.12,.32,'#725958');
   r.box(x+.15,.34,z+.18,.1,.03,.14,'#f5b953');
   const rise=(t*.4+seed%10/10)%1;r.box(x+.18+sway,.45+rise*.6,z+.18,.12+rise*.1,.1,.12+rise*.1,'#a49189');
  }else{
   r.box(x,0,z,.6,.18,.5,'#777b91');r.box(x+.08,.18,z+.07,.4,.18,.33,'#a5aabd');r.box(x+.15,.36,z+.1,.13,.35,.14,'#c0e1ea');r.box(x+.34,.25,z+.15,.1,.26,.13,'#9dc2df');
  }
 }
 // Ancient gateways beside each trailhead, leaving the central route clear.
 for(const [x,z,col] of [[5,-12,'#b4bb94'],[35,5,'#b98267'],[5,35,'#9bbdb5'],[-35,5,'#b5b9ce'],[5,-35,'#cab5d6']]){
  if(Math.hypot(player.x-x,player.z-z)>18)continue;
  r.box(x,0,z,.45,1.4,.5,col);r.box(x+2,0,z,.45,1.1,.5,col);r.box(x-.1,1.4,z-.05,1.3,.25,.6,col);
  r.box(x+.1,.4,z+.51,.2,.2,.02,'#e7d993');
 }
 // A timber boardwalk through the lake region, with room to move along it.
 if(Math.hypot(player.x,player.z-30)<18)for(let i=-3;i<=3;i++)r.box(i*.45,.025,28.5,.4,.06,2.5,'#b49169');
}
