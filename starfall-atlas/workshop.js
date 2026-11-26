(() => {
  "use strict";
  const cols=6;
  const levels=[
    {
      name:["第一枚绿叶砖","The first green brick"],
      brief:["《我的世界》的史莱姆从右边跳来。豌豆射手鼓起了脸颊！把他扣在绿色圆钉上，让他的萤光豌豆照顾来客。","Minecraft slimes are hopping in from the right. Peashooter puffs up his cheeks! Snap him onto a green stud and let his glowing peas greet the visitors."],
      hint:["越靠左，射手能照顾同一只史莱姆的时间越长。","A Peashooter near the left can look after each visitor for longer."],
      terrain:["-.-..-"], kit:[1,0,0],waves:[[0,1,4],[0,6,3]],
      proof:[[1,"p"]]
    },{
      name:["水面上的花园","A garden on water"],
      brief:["两路来客同时抵达。河床没有圆钉，在水面扣一块蓝色浮台，就能再种植物。","Two lanes receive visitors together. Snap a blue brick onto the water to make a floating planting pad."],
      hint:["第二路只有水面能搭建。先放积木，再把射手扣在它上面。","The second lane has only water sockets. Place a brick first, then a Peashooter on top."],
      terrain:["-.--.#","--~--#"],kit:[2,0,1],waves:[[0,1,5],[1,1,5],[0,7,4],[1,8,4]],
      proof:[[1,"p"],[8,"b"],[8,"p"]]
    },{
      name:["峡谷日光站","The canyon sun station"],
      brief:["向日葵哼起了歌。把她放在豌豆射手的上下左右，她的阳光会让豌豆每拍发出双倍萤光。","Sunflower hums a tune. Place her directly beside, above or below Peashooter. Her sunshine doubles the glow of his peas."],
      hint:["左侧的两块草地正好相连。把射手放在左边可以多照顾来客一拍。","The two plots on the left touch. A Peashooter on the left plot gets an extra beat."],
      terrain:["-..#.-"],kit:[1,1,0],waves:[[0,1,9],[0,5,6],[0,11,8]],
      proof:[[1,"p"],[2,"s"]]
    },{
      name:["停两拍的矮墙","The two-beat wall"],
      brief:["紫晶回声太响。把积木扣在陆地上变成矮墙，每位来客会停两拍听回声。","Build low brick walls on dry land. Each visitor pauses for two beats to listen to the echoes, giving the plants more time."],
      hint:["射手只能照顾自己右边及本格的来客，把墙搭在射手右侧。","Peashooters reach their own square and squares to the right. Build the wall ahead of the plant."],
      terrain:["##..--","#-..#-"],kit:[2,0,2],waves:[[0,1,7],[1,2,7],[0,10,7],[1,11,7]],
      proof:[[2,"p"],[3,"b"],[8,"p"],[9,"b"]]
    },{
      name:["三层花架","The three-tier trellis"],
      brief:["只有一株向日葵。上下两层都来了硬壳史莱姆，中层留给花匠布置。","There is just one Sunflower. Sturdy visitors use the top and bottom lanes; the middle tier is free for your design."],
      hint:["试试把一株花安排在两位射手的正中间。阳光可以跨到相邻的一路。","Set the flower directly between the two Peashooters. Its sunshine can reach across lanes."],
      terrain:["-.-.#-","#.--.#","-.-..-"],kit:[2,1,0],waves:[[0,1,10],[2,2,10],[0,7,9],[2,7,8]],
      proof:[[1,"p"],[7,"s"],[13,"p"]]
    },{
      name:["熔炉的双工位","The twin forge benches"],
      brief:["熔炉旁的冷却水占了第一路的工位。两块积木，要分别作浮台与矮墙。","Cooling water covers a forge socket. Split the two bricks between a floating pad and a delay wall."],
      hint:["第一路需要阳光。先在第二路安排矮墙和射手，让来客慢下来。","The first lane needs sunshine. Start with a wall and a shooter to slow visitors in the second lane."],
      terrain:["#.~-#-","#-..#-"],kit:[2,1,2],waves:[[0,1,10],[1,2,7],[0,8,9],[1,11,7]],
      proof:[[1,"s"],[2,"b"],[2,"p"],[8,"p"],[9,"b"]]
    },{
      name:["浮冰共用花槽","The floating flower box"],
      brief:["中层的冰水槽正好连通上下两路。三路都有来客，要让有限的砖块各有用途。","An icy socket joins the upper and lower terraces. All three lanes have visitors, so give each brick a job."],
      hint:["把向日葵种在中路的浮台上。中路的射手自己还需要一堵墙吗？","Try a Sunflower on the middle floating pad. Check whether the middle Peashooter also needs a wall."],
      terrain:["-.--.#","-~.-.#","-.--.#"],kit:[3,1,2],waves:[[0,1,10],[2,1,10],[1,2,7],[0,8,10],[2,8,9],[1,11,7]],
      proof:[[1,"p"],[13,"p"],[7,"b"],[7,"s"],[8,"p"],[10,"b"]]
    },{
      name:["星冠温室总装","The grand greenhouse"],
      brief:["为三路接力准备最后一次总装。头顶的星星表示安抚来客需要的萤光，密集的来客会争用同一株射手。","Prepare the greenhouse for a three-lane relay. Stars show each visitor’s glow requirement; closely spaced visitors share the same Peashooter."],
      hint:["正中的浮台让一株花照到上下两路。观察第二路与第三路，哪一波还需要墙来争取时间？","A flower on the central pontoon can power two lanes. Watch the middle and lower waves to decide where delays help."],
      terrain:["##.-.#","#-~...","-#.-.#"],kit:[4,1,3],waves:[[0,1,10],[2,1,12],[1,2,15],[0,7,10],[2,9,13],[1,11,15],[0,14,9],[2,18,13],[1,20,16]],
      proof:[[2,"p"],[14,"p"],[8,"b"],[8,"s"],[9,"p"],[10,"p"],[16,"b"],[11,"b"]]
    }
  ];
  const types={p:0,s:1,b:2};
  function tileAt(l,i){return l.terrain[Math.floor(i/cols)]?.[i%cols];}
  const empty=l=>Array(l.terrain.length*cols).fill("");
  const has=(cell,s)=>cell.includes(s);
  const countParts=(board,k)=>board.filter(cell=>has(cell,k)).length;
  function reason(l,board,i,k){
    const terrain=tileAt(l,i), here=board[i];
    if(k==="x")return here?"":"empty";
    if(k!=="p"&&k!=="s"&&k!=="b")return "socket";
    if(terrain!=="."&&terrain!=="~")return "socket";
    if(countParts(board,k)>=l.kit[types[k]])return "inventory";
    if(terrain==="~" && k!=="b" && here!=="b")return here?"occupied":"water";
    if(here && !(terrain==="~"&&here==="b"&&k!=="b"))return "occupied";
    return "";
  }
  function build(l,board,i,k){
    if(reason(l,board,i,k))return false;
    board[i]=k==="x"?board[i].slice(0,-1):board[i]+k;
    return true;
  }
  function boosts(board,i){
    const y=Math.floor(i/cols),x=i%cols;
    return [[y-1,x],[y+1,x],[y,x-1],[y,x+1]].some(([r,c])=>r>=0&&c>=0&&c<cols&&has(board[r*cols+c]||"","s"));
  }
  function newRun(l,board){
    return {tick:0, visitors:[], shots:[], arrived:0, calmed:0,done:false,pass:false,failedLane:-1, assist:false,
      plants:board.flatMap((cell,i)=>has(cell,"p")?[{x:i%cols,r:Math.floor(i/cols),power:boosts(board,i)?2:1}]:[]),
      walls:board.map((cell,i)=>cell==="b"&&tileAt(l,i)===".")};
  }
  function advance(l,run,pauseVisitors=false){
    if(run.done)return;
    run.tick++;run.shots=[];
    for(const [r,t,hp] of l.waves)if(t===run.tick){
      run.visitors.push({id:run.arrived++,r,x:cols,hp,max:hp,hold:0});
    }
    for(const plant of run.plants){
      const target=run.visitors.filter(v=>v.r===plant.r&&v.x>=plant.x&&v.hp>0)
        .sort((a,b)=>a.x-b.x||a.id-b.id)[0];
      if(!target)continue;
      run.shots.push({r:plant.r,from:plant.x,to:target.x,power:plant.power});
      target.hp-=plant.power;
      if(target.hp<=0)run.calmed++;
    }
    run.visitors=run.visitors.filter(v=>v.hp>0);
    for(const v of run.visitors) {
      if(pauseVisitors)continue;
      if(v.hold>0){v.hold--;continue;}
      v.x--;
      if(v.x<0){run.failedLane=v.r;run.done=true;break;}
      if(run.walls[v.r*cols+v.x])v.hold=2;
    }
    if(!run.done && run.calmed===l.waves.length){run.done=true;run.pass=true;}
  }
  function validate(){
    return levels.map(l=>{
      const board=empty(l);
      const legal=l.proof.every(([i,k])=>build(l,board,i,k));
      const run=newRun(l,board);
      while(!run.done&&run.tick<100)advance(l,run);
      return {name:l.name[1],legal,solved:run.pass,ticks:run.tick,calmed:run.calmed,waves:l.waves.length};
    });
  }
  const names={
    p:["豌豆射手","Peashooter"],s:["向日葵","Sunflower"],b:["拼搭砖","Snap brick"],x:["拆件器","Lift a piece"],
    ".":["草地圆钉","grass socket"],"~":["水面圆钉","water socket"],"-":["小径","path"],"#":["岩石","bedrock"]
  };
  const problems={
    empty:["这里还没有零件。","There is no piece here to lift."],socket:["岩石和小径没有圆钉，试试草地或水面的底座。","Rocks and paths have no studs. Try a green or blue socket."],
    inventory:["这种零件用完了。可以拆下一件，再换个位置。","This tray is empty. Lift a piece to move it to a new socket."],
    water:["水上需要积木浮台。先扣一块砖，再放植物。","Water needs a floating pad. Snap a brick here before planting."],
    occupied:["这个位置已经有零件。用拆件器取下最上面一件。","This socket is occupied. Use the lifter to take off its top piece."]
  };
  const locals=[
    ["栗尾","Pip"],["泡芙","Ripple"],["铜铃","Clink"],["紫翼","Vesper"],
    ["芽芽","Frond"],["炭团","Ember"],["雪羽","Rime"],["曜曜","Sol"]
  ];
  const accents=["#a5df76","#7cdeee","#f1bc6b","#c4a2fa","#9ee878","#ffa678","#a6dcfa","#d2b8ff"];
  function decode(l,values){
    if(!Array.isArray(values)||values.length!==l.terrain.length*cols)return null;
    const result=empty(l);
    for(let i=0;i<result.length;i++){
      if(typeof values[i]!=="string"||!["","b","s","p","bs","bp"].includes(values[i]))return null;
      for(const k of values[i])if(!build(l,result,i,k))return null;
    }
    return result;
  }
  function mount(host,{region=0,lang="zh",saved,onSave,onWin,sound,companion=0,placeTrace}={}){
    const id=Number.isInteger(region)&&levels[region]?region:0;
    const l=levels[id], en=lang==="en", tr=(zh,english)=>en?english:zh, loc=pair=>pair[en?1:0];
    const helper=loc(locals[companion]||locals[0]);
    const restored=saved?.version===1&&saved.region===id?decode(l,saved.board):null;
    let board=restored||empty(l);
    let moves=restored&&Number.isSafeInteger(saved.moves)?Math.max(0,saved.moves):0;
    let history=restored&&Array.isArray(saved.history)?saved.history.slice(-16).filter(item=>decode(l,item)):[];
    let tool="p",run=null,timer=null,finishTimer=null,fast=false,reported=false,disposed=false;
    const signal=new AbortController();
    const listen=(el,kind,fn)=>el.addEventListener(kind,fn,{signal:signal.signal});
    function el(tag,cls,txt,where){
      const node=document.createElement(tag);
      if(cls)node.className=cls;
      if(txt!=null)node.textContent=txt;
      if(where)where.append(node);
      return node;
    }
    function btn(cls,txt,where,act){
      const n=el("button",cls,txt,where);
      n.type="button";listen(n,"click",act);return n;
    }
    function img(src,cls,parent){
      const node=el("img",cls,null,parent);node.src=src;node.alt="";node.draggable=false;return node;
    }
    function save(){onSave?.({version:1,region:id,board:board.slice(),moves,history:history.map(b=>b.slice())});}
    function halt(){clearInterval(timer);timer=null;}
    function speak(txt){status.textContent=txt;}
    const wrap=el("section","wk-game");
    wrap.style.setProperty("--wk-accent",accents[id]);
    wrap.style.setProperty("--wk-backdrop",'url("art/isle-'+(id+1)+'.webp")');
    wrap.setAttribute("aria-label",tr("积木温室","Brickbloom Workshop"));
    host.replaceChildren(wrap);
    const heading=el("div","wk-heading",null,wrap);
    const title=el("div","",null,heading);
    el("small","wk-kicker",tr("搭建图纸","BUILDING PLAN")+" 0"+(id+1)+" / 08",title);
    el("h3","",loc(l.name),title);
    const emblem=el("div","wk-sample-brick",null,heading);emblem.setAttribute("aria-hidden","true");
    el("p","wk-brief",loc(l.brief),wrap);
    const middle=el("div","wk-layout",null,wrap);
    const worktop=el("div","wk-worktop",null,middle);
    const roof=el("div","wk-roof",null,worktop);
    el("span","",tr("幼苗","SEEDLINGS")+" ◂",roof);
    el("span","",tr("来客方向","VISITORS")+" ←",roof);
    const trays=el("div","wk-terraces",null,worktop);
    const cells=[],lanes=[],effectLayers=[],seedpods=[],units=new Map();
    for(let r=0;r<l.terrain.length;r++){
      const row=el("div","wk-terrace",null,trays);
      const seed=el("div","wk-seedpod",null,row);
      seed.title=tr("第 "+(r+1)+" 路的幼苗","Lane "+(r+1)+" seedling");
      const grow=el("i","wk-sprout",null,seed);grow.setAttribute("aria-hidden","true");
      el("span","",String(r+1),seed);
      seedpods.push(seed);
      const bed=el("div","wk-bed",null,row);
      lanes.push(bed);
      for(let x=0;x<cols;x++){
        const i=r*cols+x,terrain=tileAt(l,i);
        const cell=btn("wk-cell",null,bed,()=>place(i));
        cell.dataset.terrain=terrain;
        cell.style.setProperty("--wk-tilt",((i*3+2)%7-3)+"deg");
        const surface=el("i","wk-surface",null,cell);surface.setAttribute("aria-hidden","true");
        const piece=el("span","wk-piece",null,cell);piece.setAttribute("aria-hidden","true");
        cells.push({cell,piece});
        listen(cell,"keydown",e=>{
          const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-cols,ArrowDown:cols}[e.key];
          if(!delta)return;
          const to=i+delta;if(to<0||to>=board.length||(Math.abs(delta)===1 && Math.floor(to/cols)!==r))return;
          e.preventDefault();e.stopPropagation();cells[to].cell.focus();
        });
      }
      effectLayers.push(el("div","wk-effects",null,bed));
    }
    const meter=el("div","wk-meter",null,worktop);
    const tickLabel=el("b","",null,meter),calmLabel=el("span","",null,meter);
    const status=el("p","wk-status",null,worktop);status.setAttribute("aria-live","polite");
    const panel=el("div","wk-panel",null,middle);
    const kitTitle=el("div","wk-kitlabel",tr("零件盒","Parts tray"),panel);
    const trayTrace=placeTrace?.(kitTitle);
    const rack=el("div","wk-rack",null,panel);
    const toolNodes=new Map();
    const animatePlants=!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const partImage=(k,parent,boardPiece=false)=>{
      if(k==="p"||k==="s")img((k==="p"?"art/workshop-pea.":"art/workshop-sun.")+(boardPiece&&animatePlants?"gif":"png"),"wk-plant",parent);
      else el("i",k==="b"?"wk-brickicon":"wk-liftericon",null,parent);
    };
    for(const k of ["p","s","b","x"]){
      if(k!=="x"&&!l.kit[types[k]])continue;
      const b=btn("wk-tool",null,rack,()=>{
        if(run)return;
        tool=k;drawTools();
        const tips={
          p:tr("射手每拍照顾同路右边最近的来客。","Each beat it reaches the nearest visitor to its right in the same lane."),
          s:tr("阳光照到上下左右相邻的射手，每拍安抚力从 1 升到 2。","Sunlight boosts orthogonally adjacent Peashooters from 1 to 2 glow per beat."),
          b:tr("水上搭浮台，草地搭矮墙。每只史莱姆在墙边停两拍。","Build a floating pad on water or a two-beat delay wall on grass."),
          x:tr("点一格取下最上面一件零件。它会回到盒子里。","Tap a square to lift its top piece into the tray.")
        };
        speak(tips[k]);sound?.("tap");
      });
      const icon=el("span","wk-particon",null,b);partImage(k,icon);
      el("span","wk-partname",loc(names[k]),b);
      const amount=el("b","wk-stock","",b);
      toolNodes.set(k,{b,amount});
    }
    const edits=el("div","wk-edittools",null,panel);
    const undo=btn("wk-link",tr("↶ 撤销","↶ Undo"),edits,()=>{
      if(run||!history.length)return;
      board=history.pop();moves=Math.max(0,moves-1);save();draw();speak(tr("已撤销上一次搭建。","The last build change was undone."));
    });
    const hintButton=btn("wk-link",tr("✧ 图纸提示","✧ Design hint"),edits,()=>speak(loc(l.hint)));
    const help=el("details","wk-help",null,panel);
    el("summary","",tr("零件怎么搭？","How the pieces work"),help);
    el("p","",tr("每拍先发光，再移动。射手只照顾同一路前方及本格的来客，每拍提供 1 点萤光。每只来客需要的萤光见下方时刻表。","Plants fire before visitors move. A Peashooter gives 1 glow per beat to the nearest visitor on or ahead of its square in the same lane. The timetable lists each visitor’s glow need."),help);
    if(l.kit[1])el("p","",tr("向日葵给相邻四格供光，射手每拍变为 2 点。同一射手只需一株向日葵。","A Sunflower boosts its four orthogonal neighbours. A powered Peashooter gives 2 glow and needs only one flower."),help);
    if(l.kit[2])el("p","",tr("砖在水上能托住植物，在草地上能让每只经过的史莱姆停两拍。岩石和小径上无法搭建。","A brick on water can carry a plant. A brick on grass makes each visitor pause for two beats. Rock and path tiles have no building sockets."),help);
    const forecast=el("details","wk-forecast",null,wrap);
    el("summary","",tr("史莱姆时刻表","Minecraft slime timetable")+" · "+l.waves.length+tr(" 只"," visitors"),forecast);
    const sched=el("div","wk-sched",null,forecast);
    for(let r=0;r<l.terrain.length;r++){
      const item=el("div","",null,sched);
      el("b","",tr("第 "+(r+1)+" 路","Lane "+(r+1)),item);
      const local=l.waves.filter(w=>w[0]===r);
      if(!local.length)el("span","",tr("本路没有来客","No visitors"),item);
      for(const [,tick,hp] of local)el("span","",tr("第 "+tick+" 拍 · "+hp+" 萤光","Beat "+tick+" · "+hp+" glow"),item);
    }
    const controls=el("div","wk-controls",null,wrap);
    const play=btn("wk-primary","",controls,togglePlay);
    const step=btn("wk-action","",controls,singleStep);
    const edit=btn("wk-action","",controls,backToBuild);
    const speed=btn("wk-action wk-speed","1×",controls,()=>{
      fast=!fast;if(timer){halt();schedule();}
      drawTools();
    });
    const assist=btn("wk-action wk-assist","",controls,()=>{
      if(!run||run.done||run.assist)return;
      run.assist=true;beat(true);sound?.("tap");
    });
    const claim=btn("wk-primary","",controls,report);
    function drawTools(){
      if(trayTrace)trayTrace.hidden=!!run;
      for(const [k,{b,amount}] of toolNodes){
        b.disabled=!!run;b.setAttribute("aria-pressed",k===tool);
        amount.textContent=k==="x"?"":String(l.kit[types[k]]-countParts(board,k));
      }
      undo.disabled=!!run||!history.length;
      hintButton.disabled=false;
      play.hidden=!!run?.done;
      play.textContent=timer?tr("Ⅱ 暂停","Ⅱ Pause"):run?tr("▶ 继续","▶ Continue"):tr("▶ 动画试跑","▶ Test build");
      step.hidden=!!run?.done;
      step.textContent=tr("逐拍 ▸","Step ▸");
      edit.hidden=!run;edit.textContent=run?.done?tr("返回改搭","Revise build"):tr("停止改搭","Stop & edit");
      speed.hidden=!!run?.done;speed.textContent=fast?"2×":"1×";
      speed.setAttribute("aria-label",tr("播放速度 ","Playback speed ")+(fast?"2×":"1×"));
      assist.hidden=!run||!!run.done;assist.disabled=!!run?.assist;
      assist.textContent=run?.assist?tr("伙伴已出场","Partner helped"):tr("✧ "+helper+" · 停步一拍","✧ "+helper+" · hold a beat");
      claim.hidden=!run?.pass;claim.textContent=tr("领取温室勋章 ›","Collect workshop stamp ›");
      tickLabel.textContent=run?tr("第 "+run.tick+" 拍","Beat "+run.tick):tr("搭建中","Building");
      calmLabel.textContent=tr("安抚 ","Calmed ")+(run?.calmed||0)+" / "+l.waves.length;
    }
    function drawBoard(){
      for(let i=0;i<cells.length;i++){
        const {cell,piece}=cells[i],terrain=tileAt(l,i),value=board[i],boost=has(value,"p")&&boosts(board,i);
        cell.classList.toggle("wk-example",id===0 && !board.some(Boolean) && !run && i===1);
        cell.classList.toggle("wk-powered",boost);
        const label=[tr("第 "+(Math.floor(i/cols)+1)+" 路，第 "+(i%cols+1)+" 格","Lane "+(Math.floor(i/cols)+1)+", square "+(i%cols+1)),loc(names[terrain])];
        if(has(value,"b"))label.push(terrain==="~"?tr("浮台","pontoon"):tr("矮墙","wall"));
        for(const k of ["p","s"])if(has(value,k))label.push(loc(names[k]));
        if(boost)label.push(tr("双倍萤光","double glow"));
        cell.setAttribute("aria-label",label.join(" · "));cell.title=label.join(" · ");
        cell.setAttribute("aria-disabled",!!run);
        if(piece.dataset.built===value)continue;
        piece.replaceChildren();piece.dataset.built=value;
        if(has(value,"b"))el("i",terrain==="~"?"wk-block wk-pontoon":"wk-block wk-wall",null,piece);
        if(has(value,"s"))partImage("s",piece,true);
        if(has(value,"p"))partImage("p",piece,true);
      }
      seedpods.forEach((seed,r)=>seed.classList.toggle("wk-bumped",run?.failedLane===r));
      wrap.classList.toggle("wk-live",!!run&&!run.done);
    }
    function draw(){drawBoard();drawTools();}
    function place(i){
      if(run)return;
      const error=reason(l,board,i,tool);
      if(error){speak(loc(problems[error]));return;}
      history.push(board.slice());if(history.length>16)history.shift();
      build(l,board,i,tool);moves++;save();draw();sound?.("move");
      if(tool==="b")speak(tileAt(l,i)==="~"?tr("浮台已扣紧，现在可以在上面种植物。","Pontoon connected. A plant can now snap onto it."):tr("矮墙已扣紧。经过的来客会在这里停两拍。","Wall connected. Each passing visitor pauses here for two beats."));
      else if(tool==="x")speak(tr("零件已放回盒子。","The piece is back in the tray."));
      else speak(tr("已扣紧。随时可以试跑，也可以逐拍观察。","Snapped in. Test at any time or step through one beat at a time."));
    }
    function drawVisitors(){
      const active=new Set();
      for(const v of run?.visitors||[]){
        let token=units.get(v.id);
        if(!token){
          token=el("div","wk-visitor",null,effectLayers[v.r]);img("art/workshop-slime.png","wk-slime",token);el("b","wk-hp","",token);
          units.set(v.id,token);
        }
        active.add(v.id);
        token.style.left=(Math.max(-.13,Math.min(cols-.54,v.x))+.5)*100/cols+"%";
        token.style.setProperty("--wk-jitter",(v.id%3-1)*3+"px");
        token.classList.toggle("wk-held",v.hold>0);
        token.lastElementChild.textContent=String(v.hp);
        token.setAttribute("aria-label",tr("史莱姆，还需 "+v.hp+" 点萤光","Slime, "+v.hp+" glow remaining"));
      }
      for(const [key,node] of units)if(!active.has(key)){node.remove();units.delete(key);}
      for(const layer of effectLayers)for(const fading of layer.querySelectorAll(".wk-flight"))fading.remove();
      for(const shot of run?.shots||[]){
        const flight=el("i","wk-flight"+(shot.power===2?" wk-super":""),null,effectLayers[shot.r]);
        flight.style.left=(shot.from+.64)*100/cols+"%";
        flight.style.width=Math.max(.13,Math.min(cols-.5,shot.to)-shot.from-.1)*100/cols+"%";
      }
    }
    function startRun(){
      if(run)return true;
      if(!board.some(s=>has(s,"p"))){speak(tr("先把一株豌豆射手扣在底座上。","Snap in a Peashooter before starting the test."));return false;}
      run=newRun(l,board);reported=false;draw();return true;
    }
    function report(){
      if(!run?.pass||reported||disposed)return;
      reported=true;clearTimeout(finishTimer);onWin?.({moves});
    }
    function beat(held=false){
      if(!run||run.done)return;
      advance(l,run,held);drawVisitors();
      if(run.done){
        halt();
        if(run.pass){
          speak(tr("所有来客都安静下来，幼苗安全地舒展开了叶子。","Every visitor settled down. The seedling has opened its leaves."));
          sound?.("success");finishTimer=setTimeout(report,1700);
        }else {
          const lost=run.visitors.find(v=>v.r===run.failedLane&&v.x<0);
          speak(tr("第 "+(run.failedLane+1)+" 路有一位来客还差 "+(lost?.hp||1)+" 点萤光。保留搭建，调整这一路再试。","A lane "+(run.failedLane+1)+" visitor still needed "+(lost?.hp||1)+" glow. Revise this lane and test again."));
        }
      }else if(held)speak(tr(helper+" 放出星光。植物正常发光，所有来客原地停留一拍。",helper+" sent a star pulse. Plants fired while every visitor held still for one beat."));
      else if(run.shots.length)speak(tr("本拍送出 "+run.shots.reduce((s,e)=>s+e.power,0)+" 点萤光。","Plants sent "+run.shots.reduce((s,e)=>s+e.power,0)+" glow this beat."));
      else speak(tr("小径上的来客向前跳了一格。","Visitors hopped one square along their paths."));
      drawTools();drawBoard();
    }
    function schedule(){timer=setInterval(()=>beat(),fast?350:750);}
    function togglePlay(){
      if(timer){halt();drawTools();return;}
      if(!startRun()||run.done)return;
      schedule();beat();
    }
    function singleStep(){
      if(!startRun()||run.done)return;
      halt();beat();
    }
    function backToBuild(){
      halt();clearTimeout(finishTimer);run=null;reported=false;drawVisitors();draw();
      speak(tr("图纸与零件都保留着。点格子继续改搭。","Your build is preserved. Tap a square to revise it."));
    }
    draw();
    speak(id===0?tr("先选豌豆射手，再点金色边框里的圆钉。","Choose the Peashooter, then tap the gold-outlined socket."):tr("点盒子选零件，再点草地或水面圆钉。","Choose a part, then tap a green or blue socket."));
    return ()=>{disposed=true;halt();clearTimeout(finishTimer);signal.abort();};
  }
  window.StarfallWorkshop={count:levels.length,mount,validate,
    getTitle:(region,lang)=>levels[region]?.name[lang==="en"?1:0]};
})();
