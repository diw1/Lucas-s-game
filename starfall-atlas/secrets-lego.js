(() => {
  "use strict";
  const images={benny:"art/guest-2.webp",emmet:"art/guest-6.webp",duck:"art/secret-lego-duck.webp",rover:"art/secret-lego-rover.webp"};
  function el(tag,cls,txt) {const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;}
  const pair=(a,b)=>[a,b];
  function game(host,{lang,onWin=()=>{},sound=()=>{}},kind) {
    const root=el("section","sfl sfl-"+kind),stage=el("div","sfl-stage"),prompt=el("p","sfl-prompt"),controls=el("div","sfl-controls"),log=el("p","sfl-log");
    const timers=new Set(), t=(cn,en)=>lang==="zh"?cn:en;
    let live=true,won=false,listener=null;
    root.append(prompt,stage,controls,log);host.replaceChildren(root);log.setAttribute("aria-live","polite");
    function button(action,txt,tag="",cls="") {
      const b=el("button","sfl-key "+cls,txt);b.type="button";b.dataset.action=action;if(tag!=="")b.dataset.tag=tag;return b;
    }
    function img(path,alt,cls) {const pic=el("img",cls);pic.src=path;pic.alt=alt;pic.draggable=false;return pic;}
    function later(fn,ms) {
      const id=setTimeout(()=>{timers.delete(id);if(live&&!won)fn();},ms);timers.add(id);
    }
    function act(fn) {listener=e=>{const b=e.target.closest("button[data-action]");if(live&&!won&&b&&!b.disabled&&root.contains(b))fn(b.dataset.action,b.dataset.tag,b);};root.addEventListener("click",listener);}
    function win(txt) {if(won||!live)return;won=true;log.textContent=txt;root.classList.add("sfl-won");sound("success");onWin();}
    function cleanup() {live=false;timers.forEach(clearTimeout);timers.clear();if(listener)root.removeEventListener("click",listener);root.remove();}
    return {root,stage,prompt,controls,log,t,button,img,later,act,win,cleanup,sound};
  }
  function spaceSignal(host,opts) {
    const g=game(host,opts,"radio"),{t,stage,controls,button}=g;
    const icons=["✦","☾","◎"],names=[t("星","Star"),t("月","Moon"),t("环","Ring")],code=[0,2,1,0];
    g.prompt.textContent=t("班尼从经典太空站发来一串信号。读出天线记录的四个符号，在电台上按同样顺序回电。","Benny is calling from his Classic Space station. Read the four received symbols and tap the radio keys to echo them in order.");
    const station=el("div","sfl-station"),face=g.img(images.benny,t("班尼","Benny"),"sfl-portrait"),scope=el("div","sfl-scope");
    scope.append(el("small","",t("收到的电码","INCOMING SIGNAL")));
    const pulses=el("div","sfl-pulses"); const bars=code.map(i=>{const d=el("span","sfl-pulse sfl-p"+i,icons[i]);d.setAttribute("aria-label",names[i]);pulses.append(d);return d;});
    const transcript=el("span","sfl-transcript",code.map(i=>names[i]).join(" · "));scope.append(pulses,transcript);
    station.append(face,scope);stage.append(station);
    const out=el("div","sfl-transmit"),readout=el("span","sfl-readout");out.append(el("small","",t("你的回电","YOUR REPLY")),readout);stage.append(out);
    const pads=el("div","sfl-bank");names.forEach((label,i)=>{const b=button("tone","",i,"sfl-keycap sfl-k"+i);b.append(el("b","",icons[i]),el("span","",label));pads.append(b);});controls.append(pads);
    const aux=el("div","sfl-row"),play=button("play",t("▷ 重播信号","▷ Replay signal")),undo=button("back",t("↶ 删去最后一音","↶ Remove last")),send=button("send",t("发射回电","Transmit reply"),"","sfl-primary");aux.append(play,undo,send);controls.append(aux);
    let entered=[],generation=0;
    function paint(){readout.textContent=Array.from({length:4},(_,i)=>i<entered.length?icons[entered[i]]:"·").join("  ");undo.disabled=!entered.length;send.disabled=entered.length!==4;}
    function playCode(){
      const run=++generation;bars.forEach(b=>b.classList.remove("sfl-lit"));
      code.forEach((_,i)=>{g.later(()=>{if(run!==generation)return;bars.forEach(b=>b.classList.remove("sfl-lit"));bars[i].classList.add("sfl-lit");g.sound("tap");},i*350);});
      g.later(()=>{if(run===generation)bars.forEach(b=>b.classList.remove("sfl-lit"));},1460);
    }
    g.act((a,v)=>{
      if(a==="play"){playCode();return;}
      if(a==="tone"&&entered.length<4){entered.push(+v);g.sound("move");g.log.textContent="";}
      if(a==="back"&&entered.length){entered.pop();g.log.textContent="";g.sound("tap");}
      if(a==="send"){
        const missed=entered.findIndex((n,i)=>n!==code[i]);
        if(missed<0&&entered.length===4){g.win(t("班尼收到！飞船，飞船，太空飞船！","Benny copies! Spaceship, spaceship, SPACESHIP!"));return;}
        entered=entered.slice(0,missed);g.log.textContent=t("前 "+missed+" 音对上了。再看看第 "+(missed+1)+" 个信号。",missed+" matched. Look again at signal "+(missed+1)+".");
      }
      paint();
    });paint();return g.cleanup;
  }
  function brickDuck(host,opts) {
    const g=game(host,opts,"duck"),{stage,controls,t,button}=g;
    g.prompt.textContent=t("这只乐高拖车鸭还差三样东西。先选一块零件，再点鸭子上合适的接口。装好后拉一拉细绳。","This LEGO pull-along duck is missing three pieces. Choose a piece, then tap its matching joint on the duck. Pull the cord when it is ready.");
    const scene=el("div","sfl-duck-scene"),body=el("div","sfl-duckbody");
    body.setAttribute("role","group");body.setAttribute("aria-label",t("拖车鸭装配台","Duck assembly bench"));
    ["sfl-duck-tail","sfl-duck-belly","sfl-duck-neck","sfl-duck-head","sfl-duck-eye","sfl-duck-cord"].forEach(cls=>body.append(el("i",cls)));
    const pieces=[t("黄色铰接嘴","Yellow hinged beak"),t("蓝色侧翼","Blue wing"),t("车轮与轮轴","Wheelset")];
    const sockets=[t("头前的铰链","Hinge on the head"),t("身侧的双凸点","Two side studs"),t("底部的轴孔","Axle holes underneath")];
    const fitted=new Set();let selected=-1;
    const joins=sockets.map((name,i)=>{const b=button("socket",String(i+1),i,"sfl-socket sfl-socket-"+i);b.setAttribute("aria-label",name);b.title=name;body.append(b);return b;});
    scene.append(body);stage.append(scene);const parts=el("div","sfl-parts");
    const keys=pieces.map((name,i)=>{const b=button("part","",i);b.append(el("i","sfl-part-icon sfl-part-"+i),el("span","",name));parts.append(b);return b;});controls.append(parts);
    const row=el("div","sfl-row"),n=el("span","sfl-meter"),pull=button("pull",t("拉动拖绳 →","Pull the cord →"),"","sfl-primary");row.append(n,pull);controls.append(row);
    function paint() {
      keys.forEach((b,i)=>{b.disabled=fitted.has(i);b.setAttribute("aria-pressed",String(selected===i));joins[i].disabled=fitted.has(i);joins[i].classList.toggle("sfl-fitted",fitted.has(i));joins[i].setAttribute("aria-label",sockets[i]+(fitted.has(i)?t("，已安装",", fitted"):""));});
      pull.disabled=fitted.size!==3;n.textContent=t("已接好 "+fitted.size+" / 3",fitted.size+" / 3 fitted");
    }
    g.act((a,v)=>{
      const i=+v;
      if(a==="part"){selected=i;g.log.textContent=t("拿起了"+pieces[i]+"。点选鸭子上的接口。",pieces[i]+" selected. Choose its joint.");}
      else if(a==="socket"){
        if(selected===i){fitted.add(i);selected=-1;g.sound("move");g.log.textContent=fitted.size===3?t("咔嗒！拉动拖绳，让轮轴带动鸭嘴。","Click! Pull the cord so the wheels can work the beak."):t("咔嗒！零件扣紧了。","Click! That piece fits.");}
        else g.log.textContent=selected<0?t("先从下方拿一块零件。","Choose a loose piece below first."):t("这里是"+sockets[i]+"，再看看手上的连接件。","This is the "+sockets[i].toLowerCase()+". Check the loose piece's connector.");
      }else if(a==="pull"&&fitted.size===3){
        pull.disabled=true;scene.classList.add("sfl-rolling");g.sound("move");g.log.textContent=t("轮轴转了，鸭嘴一张一合：嘎、嘎！","The wheels turn, the bill opens and shuts: quack, quack!");g.later(()=>g.win(t("嘎嘎！","Quack!")),520);return;
      }
      paint();
    });paint();return g.cleanup;
  }
  function buildHat(host,opts) {
    const g=game(host,opts,"builder"),{stage,t,button}=g;
    g.prompt.textContent=t("艾米特的施工手册缺了一页。横梁必须正好盖住七个凸点，唯一一道接缝要压在黄色支柱上。按从左到右的顺序选两块板。","Emmet is missing an instruction page. Cover exactly seven studs with two plates. Their only seam must sit above the yellow support. Pick plates from left to right.");
    const area=el("div","sfl-buildsite"),buddy=g.img(images.emmet,t("艾米特","Emmet"),"sfl-builder-face"),bridge=el("div","sfl-blueprint");
    const layout=el("div","sfl-span"),placed=el("div","sfl-placed"),guide=el("div","sfl-guide-studs");
    for(let i=1;i<=7;i++)guide.append(el("span","",String(i)));
    const support=el("div","sfl-support");support.textContent="▲";bridge.append(layout,guide,support);layout.append(placed);area.append(buddy,bridge);stage.append(area);
    const tray=el("div","sfl-parts");const pieces=[2,3,4,5],picked=[];
    const keys=pieces.map((len,i)=>{const b=button("plate","",len);const tile=el("i","sfl-sample sfl-sample-"+i);for(let n=0;n<len;n++)tile.append(el("i"));b.append(tile,el("span","",t(len+" 凸点",len+" studs")));tray.append(b);return b;});g.controls.append(tray);
    const row=el("div","sfl-row"),undo=button("back",t("↶ 取回上一块","↶ Lift last plate")),check=button("check",t("安全帽就位 · 验桥","Hard hat on · test bridge"),"","sfl-primary");row.append(undo,check);g.controls.append(row);
    function paint(){
      placed.replaceChildren();picked.forEach(len=>{const b=el("span","sfl-beam sfl-sample-"+pieces.indexOf(len));b.style.flex="0 0 "+(100*len/7)+"%";for(let n=0;n<len;n++)b.append(el("i"));placed.append(b);});
      const total=picked.reduce((a,b)=>a+b,0);keys.forEach((b,i)=>b.disabled=picked.length>=2||picked.includes(pieces[i]));
      check.disabled=picked.length!==2;undo.disabled=!picked.length;bridge.setAttribute("aria-label",t("七凸点桥面，支柱在第 3 和第 4 凸点之间。已铺 "+total+" 凸点。","Seven-stud deck. The support is between studs 3 and 4. "+total+" studs laid."));
    }
    g.act((a,v)=>{
      if(a==="plate"&&picked.length<2){picked.push(+v);g.sound("move");g.log.textContent="";}
      else if(a==="back"){picked.pop();g.log.textContent="";}
      else if(a==="check"&&picked.length===2){
        const sum=picked[0]+picked[1];
        if(sum===7&&picked[0]===3){g.win(t("安全帽轻轻一跳。艾米特走过桥，手中的咖啡一滴也没洒！","Emmet's hard hat bobs. He crosses the bridge without spilling a drop of coffee!"));return;}
        g.log.textContent=sum!==7?t("这两块板合起来有 "+sum+" 个凸点，桥面需要 7 个。取回一块再试。","Those plates make "+sum+" studs. The deck needs seven. Lift a plate and try again."):t("长度刚好，接缝却落在支柱旁边。看看支柱左边有几个凸点。","The length is right, but the seam misses the support. Count the studs left of the yellow post.");
      }
      paint();
    });bridge.setAttribute("role","img");paint();return g.cleanup;
  }
  function moonRover(host,opts) {
    const g=game(host,opts,"lunar"),{stage,t,button}=g;
    g.prompt.textContent=t("经典太空月球车朝右停着。编一段指令，让它捡起绿色月石，再开进旗帜车库。转向只会原地转，前进才会走一格。","The Classic Space buggy starts facing right. Program it to pick up the green moon stud and reach the flag garage. Turns pivot in place. Forward drives one tile.");
    const grid=el("div","sfl-moonboard"),rows=["#.*G","#..#","S.##"],symbols={F:"↑",L:"↶",R:"↷"},names={F:t("前进","Forward"),L:t("左转","Left"),R:t("右转","Right")},dirs=[[0,-1],[1,0],[0,1],[-1,0]],heads=["↑","→","↓","←"];
    const cells=[],commands=[];let busy=false,robot;
    const badge=g.img(images.rover,t("经典太空月球车","Classic Space lunar buggy"),"sfl-rover-photo");
    const gridPanel=el("div","sfl-lunar-lab");gridPanel.append(grid,badge);stage.append(gridPanel);
    grid.setAttribute("role","img");
    grid.setAttribute("aria-label",t("三行四列。从上往下：坑、路、月石、车库；坑、路、路、坑；起点朝右、路、坑、坑。","Three rows of four. Top: crater, path, sample, garage. Middle: crater, path, path, crater. Bottom: start facing right, path, crater, crater."));
    rows.forEach((row,y)=>[...row].forEach((v,x)=>{const cell=el("div","sfl-mooncell sfl-terrain-"+({"#":"pit",".":"road","*":"sample","G":"goal","S":"start"}[v]));cell.dataset.x=x;cell.dataset.y=y;if(v==="*")cell.append(el("i","sfl-specimen"));if(v==="G")cell.append(el("span","sfl-flag","⚑"));grid.append(cell);cells.push(cell);}));
    const screen=el("div","sfl-program");screen.setAttribute("aria-live","polite");stage.append(screen);
    const row=el("div","sfl-row");const keys=Object.keys(names).map(c=>{const b=button("command",symbols[c]+" "+names[c],c);row.append(b);return b;});g.controls.append(row);
    const tools=el("div","sfl-row"),undo=button("undo",t("↶ 删除一步","↶ Undo")),erase=button("clear",t("清空","Clear")),go=button("go",t("▷ 出发","▷ Launch"),"","sfl-primary");tools.append(undo,erase,go);g.controls.append(tools);
    function reset(){robot={x:0,y:2,d:1,sample:false};}
    function draw(active=-1){
      grid.querySelector(".sfl-buggy")?.remove();grid.classList.toggle("sfl-loaded",robot.sample);
      const body=el("span","sfl-buggy");body.setAttribute("aria-hidden","true");body.textContent=heads[robot.d];cells[robot.y*4+robot.x].append(body);
      screen.replaceChildren();if(!commands.length)screen.append(el("span","",t("指令槽：从朝右的车头开始。","Program tray · the nose starts east.")));
      commands.forEach((cmd,i)=>{const n=el("b",i===active?"sfl-current":"",symbols[cmd]);n.title=(i+1)+". "+names[cmd];n.setAttribute("aria-label",n.title);screen.append(n);});
      keys.forEach(b=>b.disabled=busy||commands.length>=12);undo.disabled=erase.disabled=go.disabled=busy||!commands.length;
    }
    function execute(i) {
      if(i===commands.length){
        busy=false;draw();
        if(robot.sample&&rows[robot.y][robot.x]==="G")g.win(t("月石到站！班尼把这颗绿色凸点装上了新飞船的仪表盘。","Sample delivered! Benny snaps the green stud onto his new spaceship's dashboard."));
        else g.log.textContent=robot.sample?t("月石已经装车。再补几步，把它送到旗帜那里。","Sample aboard. Add the final commands to reach the flag."):t("程序走完了。先踏过绿色月石，再进入车库。","The program ended. Cross the green stud and finish at the flag.");
        return;
      }
      const c=commands[i];
      if(c==="L"||c==="R")robot.d=(robot.d+(c==="R"?1:3))%4;
      else {
        const x=robot.x+dirs[robot.d][0],y=robot.y+dirs[robot.d][1],next=rows[y]?.[x];
        if(!next||next==="#"){busy=false;draw(i);g.log.textContent=t("第 "+(i+1)+" 步前方没有平地。检查这个箭头前的朝向，再发车。","No flat ground ahead at step "+(i+1)+". Check the turn before that command and relaunch.");return;}
        robot.x=x;robot.y=y;if(next==="*")robot.sample=true;
      }
      draw(i);g.sound("move");g.later(()=>execute(i+1),180);
    }
    g.act((a,v)=>{
      if(busy)return;
      if(a==="go"){reset();busy=true;g.log.textContent=t("月球车正在执行程序。","Rover executing program.");draw();execute(0);return;}
      if(a==="command"&&commands.length<12)commands.push(v);
      else if(a==="undo")commands.pop();else if(a==="clear")commands.length=0;
      reset();draw();g.sound("tap");g.log.textContent=commands.length===12?t("指令槽已满。可以出发，或删去一步。","Program tray full. Launch or undo a command."):"";
    });reset();draw();return g.cleanup;
  }
  const registry=window.StarfallSecrets=window.StarfallSecrets||{};
  Object.assign(registry,{
    "space-signal":{region:1,name:pair("班尼的星际回电","Benny's star signal"),lead:pair("一根蓝色天线在反复播送四个短音。","A blue aerial keeps sending four short pulses."),mark:"⌁",art:images.benny,memory:pair("班尼在经典太空站听见了你的回电。他一边找飞船蓝图，一边兴奋地喊起了“太空飞船！”","Benny caught your reply at the Classic Space station. Rummaging for his blueprints, he burst out with “Spaceship!”"),mount:spaceSignal},
    "brick-duck":{region:2,name:pair("凸点小鸭的拖绳","The brick duck's cord"),lead:pair("一截黄色细绳从红色积木木箱下面露了出来。","A yellow pull cord peeks out beneath a red brick crate."),mark:"♬",art:images.duck,memory:pair("车轮带动凸轮，小鸭一路开合鸭嘴。你捡到了这只红色乐高拖车鸭留下的蓝色轮毂。","The turning wheels worked the beak all the way down the path. A blue hubcap from the little red LEGO duck found a home in your journal."),mount:brickDuck},
    "build-hat":{region:5,name:pair("艾米特的七凸点桥","Emmet's seven-stud bridge"),lead:pair("一顶红色安全帽，压住了只画了一半的施工蓝图。","A red hard hat holds down a half-finished blueprint."),mark:"▥",art:images.emmet,memory:pair("艾米特走过你搭的检修桥，把那张补全的施工图折好。咖啡杯在最后一个凸点上留下了一个小圆印。","Emmet crossed your inspection bridge and folded the completed drawing. His coffee cup left a little ring over the final stud."),mount:buildHat},
    "moon-rover":{region:7,name:pair("经典太空月球车","Classic Space moon buggy"),lead:pair("六排小小的轮痕在坑边转了个弯，通往一面蓝旗。","Six little tyre tracks curve around a crater towards a blue flag."),mark:"☾",art:images.rover,memory:pair("你让蓝灰色经典太空月球车带回了一颗绿色月石。班尼把它扣在太空飞船的仪表盘正中央。","Your blue-and-grey Classic Space buggy delivered a green moon stud. Benny snapped it into the centre of his spaceship dashboard."),mount:moonRover}
  });
})();
