(() => {
  "use strict";
  const entries={
    psyduck:{
      region:0,name:["可达鸭","Psyduck"],mark:"≋",
      lead:["芦苇边有三趾脚印，水洼里还漂着三根黑绒毛。","Three-toed tracks cross the reeds. Three black downy hairs float in a puddle."],
      memory:["芦苇后，可达鸭正捂着头发呆。一圈念力涟漪托起了它脚边的小石头。它眨眨眼，自己也吓了一跳。","Behind the reeds, Psyduck holds its aching head. A psychic ripple lifts a pebble from the mud. Psyduck blinks, just as surprised as you."],
      title:["一串湿脚印","Tracks in the mud"],
      how:["从小旗出发，顺着三趾印的脚尖，一次走到相邻的一格。最后拨开芦苇。","Start at the pennant. Follow the direction of each three-toed print, one neighbouring square at a time. Part the reeds at the end."],
      run:tracks
    },
    lapras:{
      region:1,name:["拉普拉斯","Lapras"],mark:"♫",
      lead:["涨潮时，三枚贝壳把海湾尽头的歌声留了下来。","At high tide, three shells hold on to a song from the far side of the bay."],
      memory:["最后一个音落下，拉普拉斯探出了水面。它把背上的灰壳贴着码头，唱着歌送一只走散的小海鸟回家。","As the last note fades, Lapras surfaces and rests its grey shell beside the jetty. It sings a lost seabird all the way home."],
      title:["贝壳里的回歌","The shell refrain"],
      how:["海面把四个音从左到右刻了下来。一层水纹是低音，两层是中音，三层是高音。点贝壳把旋律唱回去。","Read the four wave marks from left to right. One wave is low, two are middle, and three are high. Play the shells to answer the song."],
      run:shells
    },
    gengar:{
      region:3,name:["耿鬼","Gengar"],mark:"◐",
      lead:["晶壁上的灯换过位置，有一道影子却还赖在旧地方。","The lamp has moved along the crystal wall. One shadow still lingers where it used to be."],
      memory:["那道影子忽然咧开嘴，耿鬼从石台后钻了出来。它冲你做了个鬼脸，又贴着你的影子溜走了。","The shadow breaks into a grin. Gengar pops out from behind the plinth, pulls a face, then slips away inside your own shadow."],
      title:["不肯挪步的影子","The stubborn shadow"],
      how:["把灯从一边移到另一边，观察三道影子。真的石影会背向灯光。点出没有跟着换边的那道。","Move the lamp to the opposite wall and watch all three shadows. A stone casts its shadow away from the lamp. Tap the one that never changes sides."],
      run:shadows
    },
    bulbasaur:{
      region:4,name:["妙蛙种子","Bulbasaur"],mark:"❧",
      lead:["一根细藤从叶丛伸出来，把沾露的叶片一片片扳向太阳。","A vine reaches out of the foliage and tips dew-covered leaves toward the sun."],
      memory:["暖光正好照到妙蛙种子背上的种子。两根藤鞭伸了个懒腰，又轻轻把最后一片叶子放回原处。","Warm sunlight lands on the seed on Bulbasaur’s back. Two vines stretch lazily, then set the last leaf gently back in place."],
      title:["借一束晨光","A little borrowed sun"],
      how:["阳光从左下方的小太阳向右照。点带露珠的叶片，让亮线拐弯，一直接到右下的种子，再把晨光送给它。","Light travels right from the little sun. Turn the dew leaves to bend the bright ray until it reaches the seed at the lower right, then send it some morning sun."],
      run:leaves
    }
  };
  function mount(host,opts,id) {
    const entry=entries[id], en=opts?.lang==="en", T=(zh,english)=>en?english:zh, tx=pair=>pair[en?1:0];
    const controller=new AbortController(), timers=new Set();
    let disposed=false,won=false,reported=false;
    const listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:controller.signal});
    function el(tag,cls,content,parent){
      const node=document.createElement(tag);
      if(cls)node.className=cls;
      if(content!=null)node.textContent=content;
      if(parent)parent.append(node);
      return node;
    }
    function btn(cls,label,parent,action){
      const b=el("button",cls,label,parent);b.type="button";listen(b,"click",action);return b;
    }
    function later(fn,ms){
      const key=setTimeout(()=>{timers.delete(key);if(!disposed)fn();},ms);timers.add(key);return key;
    }
    function sound(kind){if(!disposed)opts?.sound?.(kind);}
    function report(){if(disposed||reported||!won)return;reported=true;opts?.onWin?.();}
    const root=el("section","sp-secret sp-"+id);
    root.setAttribute("aria-label",tx(entry.title));
    root.style.setProperty("--sp-bg",'url("art/isle-'+(entry.region+1)+'.webp")');
    host.replaceChildren(root);
    const title=el("h3","sp-title",tx(entry.title),root);
    const guide=el("p","sp-guide",tx(entry.how),root);
    const area=el("div","sp-scene",null,root);
    const status=el("p","sp-status",null,root);status.setAttribute("aria-live","polite");
    function say(msg){status.textContent=msg;}
    function reveal(){
      if(won||disposed)return;won=true;opts?.onDiscover?.();
      root.classList.add("sp-found");area.replaceChildren();status.textContent="";
      title.textContent=tx(entry.name);guide.hidden=true;
      const framed=el("div","sp-portrait",null,area);
      el("i","sp-halo",null,framed);
      const img=el("img","sp-sprite",null,framed);img.src=entry.art;img.alt=tx(entry.name);
      for(let i=0;i<6;i++){const glint=el("i","sp-glint",null,framed);glint.style.setProperty("--i",i);}
      el("p","sp-memory",tx(entry.memory),area);
      btn("sp-collect",T("收进手记 ›","Keep the memory ›"),area,report);
      sound("success");
      later(report,1850);
    }
    entry.run({T,el,btn,listen,later,sound,say,area,reveal,isDone:()=>disposed||won});
    return ()=>{disposed=true;controller.abort();for(const key of timers)clearTimeout(key);};
  }
  function arrowNav(buttons,columns,listen){
    buttons.forEach((button,i)=>listen(button,"keydown",e=>{
      const delta={ArrowRight:1,ArrowLeft:-1,ArrowDown:columns,ArrowUp:-columns}[e.key];
      if(!delta)return;const dest=i+delta;
      if(dest<0||dest>=buttons.length||(Math.abs(delta)===1&&Math.floor(dest/columns)!==Math.floor(i/columns)))return;
      e.preventDefault();e.stopPropagation();buttons[dest].focus();
    }));
  }
  function tracks({T,el,btn,listen,sound,say,area,reveal}){
    const route=[8,9,5,6,2,3], direction={8:["→","右","right",90],9:["↑","上","up",0],5:["→","右","right",90],6:["↑","上","up",0],2:["→","右","right",90]};
    let at=0;
    const grid=el("div","sp-marsh",null,area),cells=[];
    const extras={0:"pebble",1:"frog",4:"reed",7:"pebble",10:"frog",11:"reed"};
    const extraNames={pebble:T("石子","pebble"),frog:T("蛙印","frog track"),reed:T("短芦苇","short reeds")};
    for(let i=0;i<12;i++){
      const b=btn("sp-mud",null,grid,()=>move(i));cells.push(b);
      const d=direction[i],y=Math.floor(i/4)+1,x=i%4+1;
      let label;
      if(i===3||extras[i]==="reed"){
        el("i","sp-reeds",null,b);
        label=i===3?T("浓密的芦苇","tall reeds"):extraNames.reed;
        if(i===3)b.classList.add("sp-goal");
      }else if(d){
        const print=el("i","sp-print",null,b);print.style.setProperty("--turn",d[3]+"deg");
        el("span","sp-mark-arrow",d[0],b);
        if(i===8)el("span","sp-flag","⚑",b);
        label=(i===8?T("起点，","start, "):"")+T("三趾印，脚尖向"+d[1],"three-toed print pointing "+d[2]);
      }else{
        el("i","sp-"+extras[i],null,b);label=extraNames[extras[i]];
      }
      b.setAttribute("aria-label",T("第 "+y+" 行，第 "+x+" 格，","Row "+y+", square "+x+", ")+label);
    }
    function mark(){
      cells.forEach((b,i)=>{
        b.classList.toggle("sp-walked",route.slice(0,at).includes(i));
        b.classList.toggle("sp-here",route[at]===i);
        if(route[at]===i)b.setAttribute("aria-current","step");else b.removeAttribute("aria-current");
      });
    }
    function move(i){
      if(route[at]===i){say(T("你站在金色脚印上，看看脚尖朝哪边。","You are standing on the golden print. Which way do its toes point?"));return;}
      if(i!==route[at+1]){say(T("脚印还在原处。沿金框里的脚尖方向走一格。","The trail is still there. Step one square in the direction of the toes inside the gold frame."));return;}
      sound("move");at++;mark();
      if(at===route.length-1){reveal();return;}
      say(T("湿泥上又露出一枚三趾印。","Another webbed footprint appears in the wet mud."));
    }
    arrowNav(cells,4,listen);mark();say(T("小旗插在左下角。","The pennant stands at the lower left."));
  }
  function waves(n,parent,el){
    const box=el("span","sp-wave-glyph",null,parent);
    box.setAttribute("aria-hidden","true");
    for(let j=0;j<=n;j++)el("i","",null,box);
  }
  function shells({T,el,btn,later,sound,say,area,reveal,isDone}){
    const music=[0,2,1,0],tones=["poke-low","poke-mid","poke-high"],names=[T("低音","Low"),T("中音","Middle"),T("高音","High")];
    const strip=el("div","sp-score",null,area), notes=[];
    music.forEach((n,i)=>{
      const item=el("span","sp-note",null,strip);waves(n,item,el);
      item.setAttribute("aria-label",T("第 "+(i+1)+" 音："+names[n],"Note "+(i+1)+", "+names[n]));
      notes.push(item);
    });
    const coast=el("div","sp-shore",null,area);
    let step=0,echo=0;
    function mark(){notes.forEach((n,i)=>{n.classList.toggle("sp-played",i<step);n.classList.toggle("sp-next",i===step);});}
    function ring(n){
      echo++;notes.forEach(item=>item.classList.remove("sp-playing"));
      sound(tones[n]);
      if(music[step]!==n){say(T("这一音和海面的水纹不一样。看看金框里有几层水纹。","That note makes a different ripple. Count the waves inside the gold frame."));return;}
      step++;mark();
      if(step===music.length){reveal();return;}
      say(T("海湾回应了。接着读下一格。","The bay answers. Read the next mark."));
    }
    for(let n=0;n<3;n++){
      const b=btn("sp-shell",null,coast,()=>ring(n));
      b.style.setProperty("--hue",[32,185,289][n]);
      el("i","sp-conch",null,b);waves(n,b,el);el("b","",names[n],b);
      b.setAttribute("aria-label",T(names[n]+"贝壳，"+(n+1)+" 层水纹",names[n]+" shell, "+(n+1)+" wave"+(n?"s":"")));
    }
    const listen=btn("sp-small",T("▷ 重听海湾的歌","▷ Hear the bay again"),area,()=>{
      const token=++echo;
      music.forEach((n,i)=>later(()=>{
        if(isDone()||token!==echo)return;
        notes.forEach((item,j)=>item.classList.toggle("sp-playing",j===i));
        sound(tones[n]);
        if(i===music.length-1)later(()=>{if(token===echo)notes.forEach(item=>item.classList.remove("sp-playing"));},420);
      },i*525));
    });
    listen.title=T("播放时也会逐格亮起","Each mark also lights up during playback");
    mark();say(T("海湾的四个音都留在上面的贝壳谱里。","All four notes are written in the wave score above."));
  }
  function shadows({T,el,btn,sound,say,area,reveal}){
    const cavern=el("div","sp-cavern",null,area),rail=el("div","sp-rail",null,cavern);
    const lamp=el("i","sp-lamp",null,rail);
    const row=el("div","sp-stones",null,cavern);
    const names=[T("矮石","Low stone"),T("尖晶","Pointed crystal"),T("石柱","Pillar")];
    const spots=[];
    let side=0,observed=false;
    function point(i){return i===1||side===0?1:-1;}
    for(let i=0;i<3;i++){
      const b=btn("sp-plinth sp-kind-"+i,null,row,()=>{
        if(!observed){say(T("先移动灯，看三道影子如何回应。","Move the lamp first and see how the three shadows respond."));return;}
        if(i!==1){say(T("这道影子随灯换了方向。看看哪块石台上的影子始终朝右。","This shadow changes with the lamp. Look for the shadow that keeps pointing right."));return;}
        reveal();
      });
      const model=el("span","sp-model",null,b);
      el("i","sp-cast",null,model);el("i","sp-mineral",null,model);el("i","sp-base",null,model);
      const text=el("b","",null,b);spots.push({b,text});
    }
    const switcher=btn("sp-small sp-switch","",area,()=>{side=1-side;observed=true;draw();sound("move");});
    function draw(){
      lamp.classList.toggle("sp-right",side===1);
      switcher.textContent=side===0?T("移灯到右端 →","Move lamp to the right →"):T("← 移灯到左端","← Move lamp to the left");
      spots.forEach(({b,text},i)=>{
        const d=point(i);
        b.style.setProperty("--lean",d<0?"35deg":"-35deg");
        text.textContent=names[i]+" "+(d===1?"→":"←");
        b.setAttribute("aria-label",names[i]+T("，影子向"+(d===1?"右":"左"),", shadow points "+(d===1?"right":"left")));
      });
      say(side===0?T("灯在左端。箭头和石台上的影子指向同一边。","Lamp on the left. The little arrows show the directions of the shadows."):T("灯到了右端。现在再看看三道影子。","Lamp on the right. Compare the three shadows again."));
    }
    draw();
  }
  function leaves({T,el,btn,listen,sound,say,area,reveal}){
    const starts=[1,3,9],slash={1:false,3:true,9:false},dirs=[[-1,0],[0,1],[1,0],[0,-1]],from=8,to=15;
    const grid=el("div","sp-bower",null,area),squares=[],turners=[];
    let reaches=false;
    for(let i=0;i<16;i++){
      const leafy=starts.includes(i);
      let square;
      if(leafy){
        square=btn("sp-sun-cell sp-turnleaf",null,grid,()=>{
          slash[i]=!slash[i];draw();sound("move");
          say(reaches?T("种子接到了光。现在送出这束晨光。","The ray touches the seed. Send it the morning sun."):T("叶片转了四分之一圈。沿亮线找下一处弯。","The leaf turns. Follow the light to the next bend."));
        });turners.push(square);
      }else square=el("div","sp-sun-cell",null,grid);
      const ray=el("span","sp-ray",null,square);
      if(i===from){el("i","sp-source","☀",square);square.setAttribute("aria-label",T("起点太阳，向右照","Sun sending light to the right"));}
      if(i===to){el("i","sp-bulb",null,square);square.setAttribute("aria-label",T("种子","Seed"));}
      if(leafy)el("i","sp-leaf",null,square);
      squares.push({square,ray});
    }
    const send=btn("sp-small",T("☀ 送出晨光","☀ Send the sunlight"),area,()=>{
      if(reaches)reveal();
      else say(T("光从叶丛边缘溜走了。转动亮线经过的最后一片叶子，再看看。","The ray slips out at the edge. Try turning the last leaf it reaches."));
    });
    function draw(){
      const used=Array.from({length:16},()=>new Set());
      let i=from,d=1;reaches=false;
      const seen=new Set();
      while(true){
        if(seen.has(i+"-"+d))break;seen.add(i+"-"+d);
        if(starts.includes(i))d=slash[i]?[1,0,3,2][d]:[3,2,1,0][d];
        if(i===to){reaches=true;break;}
        used[i].add(d);
        const [dy,dx]=dirs[d],y=Math.floor(i/4)+dy,x=i%4+dx;
        if(y<0||y>3||x<0||x>3)break;i=y*4+x;used[i].add((d+2)%4);
      }
      squares.forEach(({square,ray},i)=>{
        ray.replaceChildren();for(const v of used[i])el("i","sp-segment sp-dir-"+v,null,ray);
        if(starts.includes(i)){
          square.classList.toggle("sp-forward",slash[i]);
          const orient=slash[i]?"/":"\\";
          square.setAttribute("aria-label",T("第 "+(Math.floor(i/4)+1)+" 行，第 "+(i%4+1)+" 列，叶片 "+orient,"Row "+(Math.floor(i/4)+1)+", column "+(i%4+1)+", leaf "+orient));
        }
        square.classList.toggle("sp-lit",i===to&&reaches);
      });
      send.classList.toggle("sp-ready",reaches);
    }
    turners.forEach((b,i)=>listen(b,"keydown",e=>{
      if(!["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(e.key))return;
      e.preventDefault();e.stopPropagation();turners[(i+(e.key==="ArrowRight"||e.key==="ArrowDown"?1:2))%3].focus();
    }));
    draw();say(T("露珠会把光折向直角的另一边。","Each dew leaf bends the ray through a right angle."));
  }
  const api=window.StarfallSecrets||(window.StarfallSecrets={});
  for(const [id,entry] of Object.entries(entries)){
    entry.art="art/secret-poke-"+id+".png";
    api[id]={name:entry.name,region:entry.region,lead:entry.lead,mark:entry.mark,art:entry.art,memory:entry.memory,
      mount:(host,opts)=>mount(host,opts,id)};
  }
})();
