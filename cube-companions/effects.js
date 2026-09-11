// Battle effects finish before damage is applied. The controller locks all moves
// until both attack animations complete, so rapid clicks cannot skip a turn.
import {typeColors as colors} from './types.js?v=story2';
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
async function animate(el,frames,ms){if(!el)return;await el.animate(frames,{duration:reduced()?70:ms,easing:'ease-in-out'}).finished;}
function effect(arena,className,text=''){const e=document.createElement('span');e.className=className;e.textContent=text;e.setAttribute('aria-hidden','true');arena.append(e);return e;}
export async function strike(side,type,factor=1,mega=false){
  const arena=document.querySelector('.arena'),attacker=document.querySelector(`[data-side="${side}"] canvas`),other=side==='player'?'enemy':'player',victim=document.querySelector(`[data-side="${other}"] canvas`);
  if(!arena)return;
  if(mega){const pulse=effect(arena,'mega-flare','✦ MEGA ✦');await animate(pulse,[{opacity:0,transform:'scale(.3)'},{opacity:1,transform:'scale(1.2)',offset:.6},{opacity:0,transform:'scale(1.7)'}],650);pulse.remove();}
  const dir=side==='player'?1:-1,travel=Math.min(75,arena.clientWidth*.16);
  await animate(attacker,[{transform:'translate(0,0)'},{transform:`translate(${-dir*12}px,5px)`,offset:.2},{transform:`translate(${dir*travel}px,-12px)`,offset:.7},{transform:'translate(0,0)'}],420);
  const feedback=factor!==1?effect(arena,`effectiveness ${factor>1?'strong':'resisted'}`,factor>1?`✦ SUPER EFFECTIVE ×${factor}`:`◇ RESISTED ×${factor}`):null;
  if(factor===0){if(feedback){feedback.textContent='○ IMMUNE · NO DAMAGE';feedback.style.left=other==='enemy'?'72%':'28%';await animate(feedback,[{opacity:0},{opacity:1,offset:.25},{opacity:0}],700);feedback.remove();}return;}
  if(feedback)feedback.style.left=other==='enemy'?'72%':'28%';
  const burst=effect(arena,'hit-burst',factor<1?'◇':'✦');burst.style.left=other==='enemy'?'75%':'25%';burst.style.color=colors[type]||'#f6de86';
  const sparks=Array.from({length:factor>1?12:factor<1?3:7},(_,i)=>{const e=effect(arena,'spark');e.style.left=burst.style.left;e.style.background=colors[type]||'#fff';return {e,dx:Math.cos(i/7*Math.PI*2)*48,dy:Math.sin(i/7*Math.PI*2)*45};});
  await Promise.all([animate(burst,[{transform:'translate(-50%,-50%) scale(.2)',opacity:0},{transform:'translate(-50%,-50%) scale(1.3)',opacity:1,offset:.35},{transform:`translate(-50%,-50%) scale(${factor>1?2.5:factor<1?.8:1.7})`,opacity:0}],330),animate(victim,[{transform:'translateX(0)'},{transform:`translateX(${dir*(factor>1?25:factor<1?4:15)}px)`,filter:'brightness(1.9)'},{transform:`translateX(${-dir*9}px)`},{transform:'translateX(0)',filter:'brightness(1)'}],330),...sparks.map(({e,dx,dy})=>animate(e,[{transform:'translate(0,0)',opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(90deg)`,opacity:0}],330))]);
  if(feedback){await animate(feedback,[{transform:'translate(-50%,0) scale(.8)',opacity:0},{transform:'translate(-50%,-12px) scale(1.05)',opacity:1,offset:.25},{transform:'translate(-50%,-20px)',opacity:0}],650);feedback.remove();}
  burst.remove();sparks.forEach(({e})=>e.remove());
}
export async function healEffect(){
  const arena=document.querySelector('.arena');if(!arena)return;
  const shield=effect(arena,'guard-ring'),text=effect(arena,'heal-text','+ HP');
  await Promise.all([animate(shield,[{transform:'translate(-50%,-50%) scale(.5)',opacity:0},{transform:'translate(-50%,-50%) scale(1)',opacity:1,offset:.4},{transform:'translate(-50%,-50%) scale(1.15)',opacity:0}],600),animate(text,[{transform:'translateY(15px)',opacity:0},{transform:'translateY(-5px)',opacity:1,offset:.4},{transform:'translateY(-30px)',opacity:0}],600)]);shield.remove();text.remove();
}
export async function captureEffect(){
  const arena=document.querySelector('.arena');if(!arena)return;
  const cube=effect(arena,'capture-cube','◆');
  await animate(cube,[{left:'25%',top:'55%',transform:'rotate(0)'},{left:'50%',top:'15%',transform:'rotate(140deg)',offset:.45},{left:'75%',top:'42%',transform:'rotate(270deg)'}],500);
  cube.style.left='75%';cube.style.top='42%';
  await animate(cube,[{transform:'rotate(-15deg)'},{transform:'rotate(15deg)'},{transform:'rotate(-15deg)'},{transform:'rotate(15deg)'},{transform:'rotate(0)'}],550);cube.remove();
}
export async function switchEffect(){const c=document.querySelector('[data-side="player"] canvas');await animate(c,[{transform:'scale(1)',opacity:1},{transform:'scale(.1)',opacity:0}],220);}

export async function bossSpecialEffect(kind){const arena=document.querySelector('.arena');if(!arena)return;const e=effect(arena,'boss-special',kind==='charge'?'⚡':kind==='shield'?'◇':'+ HP');e.style.color=kind==='charge'?'#e89921':kind==='shield'?'#7aa4cc':'#4cba8d';await animate(e,[{transform:'translate(-50%,0) scale(.6)',opacity:0},{transform:'translate(-50%,-15px) scale(1.2)',opacity:1,offset:.6},{transform:'translate(-50%,-25px)',opacity:0}],750);e.remove();}
