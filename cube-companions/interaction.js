// Presentation only: the cue never replaces the camp's interaction target.
export function chooseCue(player,state,camp,ranger,wild,now,chests=[],story=[]){
  if(state.mode!=='explore')return null;
  const distance=t=>Math.hypot(t.x-player.x,t.z-player.z);
  if(distance(camp)<1.8)return {target:camp,mode:'ready',key:'E',title:'Rest & refill',detail:'Heal your team and refill capture cubes.',action:true};
  const chest=chests.find(c=>!state.opened?.includes(c.id)&&distance(c)<1.8);if(chest)return {target:chest,mode:'ready',key:'E',title:'Open treasure',detail:'+3 cubes and +20 XP for every companion.',action:true};
  const storyTarget=story.find(t=>distance(t)<1.8);if(storyTarget)return {target:storyTarget,mode:'ready',key:'E',title:storyTarget.actionTitle,detail:'A stop on your adventure route.',action:true};
  const target=[ranger,...wild.filter(t=>now>t.cooldown)].filter(t=>distance(t)<3.4).sort((a,b)=>distance(a)-distance(b))[0];
  if(!target)return null;
  if(target.kind==='trainer'&&state.party.length<2)return {target,mode:'locked',key:'!',title:'Catch a companion first',detail:'The boss needs you to bring at least two companions.'};
  if(!state.party[state.active]?.hp)return {target,mode:'locked',key:'!',title:'Your companion needs rest',detail:'Return to camp to heal your team.'};
  if(now<(target.cooldown||0)||target.armed===false)return {target,mode:'waiting',key:'↔',title:'Move away, then return',detail:'Give this encounter a little space.'};
  if(now<state.safeUntil)return {target,mode:'waiting',key:'…',title:'Get ready…',detail:'Touching will start a battle in a moment.'};
  return {target,mode:'auto',key:'AUTO',title:target.kind==='trainer'?'Touch to challenge boss':'Touch to battle',detail:target.kind==='trainer'?'Five companions. One-on-one battles.':'Battle starts automatically. No key needed.'};
}

export function cueColor(cue){return cue.mode==='ready'?'#1f977d':cue.mode==='auto'?'#d78b12':cue.mode==='locked'?'#8e5863':'#637889';}

export function drawCueRing(ctx,r,scale,cue,now,reducedMotion){
  if(!cue)return;
  const t=cue.target,[x,y]=r.project(t.x,.04,t.z),radius=t.kind==='camp'?1.8:1.05,pulse=reducedMotion?0:(Math.sin(now*.004)+1)*.5;
  ctx.save();ctx.beginPath();ctx.ellipse(x,y,scale*radius*Math.SQRT2,scale*radius*Math.SQRT2*.48,0,0,Math.PI*2);
  ctx.fillStyle=cueColor(cue)+'28';ctx.fill();ctx.strokeStyle=cueColor(cue);ctx.lineWidth=3+pulse;ctx.stroke();
  ctx.beginPath();ctx.ellipse(x,y,scale*radius*Math.SQRT2+5+pulse*5,scale*radius*Math.SQRT2*.48+3+pulse*3,0,0,Math.PI*2);
  ctx.strokeStyle='#fffbe0';ctx.lineWidth=2;ctx.setLineDash([5,6]);ctx.stroke();ctx.restore();
}

export function drawCueBrackets(ctx,r,scale,cue){
  if(!cue||cue.target.kind==='camp')return;
  const t=cue.target,[x,y]=r.project(t.x,0,t.z),width=scale*.72,height=scale*(t.kind==='trainer'?1.75:1.5),arm=12;
  ctx.save();ctx.strokeStyle=cueColor(cue);ctx.lineWidth=4;ctx.shadowColor='#fffbe0';ctx.shadowBlur=5;
  for(const [dx,dy,sx,sy]of [[-width,-height,1,1],[width,-height,-1,1],[-width,8,1,-1],[width,8,-1,-1]]){
    ctx.beginPath();ctx.moveTo(x+dx+sx*arm,y+dy);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+dx,y+dy+sy*arm);ctx.stroke();
  }
  ctx.restore();
}
