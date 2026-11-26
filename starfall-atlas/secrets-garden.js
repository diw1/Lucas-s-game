(() => {
  'use strict';
  const art = id => 'art/secret-garden-' + id + '.webp';
  const records = {
    wallnut: [
      ['坚果站岗','Wall-nut on Watch'],['两行草叶被踩平了，幼苗旁散着几片坚果壳。','Two rows of grass lie flat. A few pieces of nutshell rest beside the seedlings.'],'◉',
      ['两颗坚果挡住了两排脚步。栗尾发现，连最小的幼苗也没有被踩弯。','Two Wall-nuts held the lanes. Pip checked even the smallest seedling: every stem was still upright.']
    ],
    redstone: [
      ['红石分岔口','A Fork in the Redstone'],['峡谷的铜灯之间，岩缝里洒着几粒暗红色粉末。','A few grains of deep red dust mark the cracks between the canyon lamps.'],'ϟ',
      ['拉杆一响，两盏灯同时亮了。红石粉在桥面画出一根发光的树枝。','A click from the lever lit both lamps. The redstone dust made a glowing branch across the bridge.']
    ],
    enderman: [
      ['不眨眼的访客','The Visitor Who Never Blinks'],['水潭边的泥块不见了，干燥的石台上却浮着紫色星屑。','A dirt block is missing beside the pool. Violet motes hover above the dry ledges.'],'⋮',
      ['透过雕刻南瓜的眼孔，你拍到了末影人怀里的方块。它转过身，悄悄放下了那块泥土。','Through the carved pumpkin’s eyeholes you caught the Enderman holding the missing block. It turned and quietly put the dirt down.']
    ],
    plantern: [
      ['雾里的路灯花','A Plantern in the Fog'],['浓雾里闪着一颗不会移动的金色星星，下面还有叶子的影子。','One golden star in the fog never moves. Beneath it is the shadow of a leaf.'],'✣',
      ['路灯花照亮了每一块稳当的踏石。雾里的金光，原来一直在为过路的小动物引路。','Plantern revealed every sound stepping stone. The golden light had been guiding little animals through the fog.']
    ],
    kernel: [
      ['黄油着陆点','Butter Landing'],['铸谷的试车轨道边，落着一颗玉米粒和一小方黄油。','A kernel and a square of butter lie beside the test tracks in the forge.'],'▰',
      ['黄油让领先的假人停了一会儿，普通玉米粒只叮地响了一声。两辆小车恰好并排停在标线前。','Butter held the leading dummy still. A plain kernel only made a tapping sound. Both carts finished side by side at the line.']
    ],
    'snow-golem': [
      ['南瓜头的脚印','A Pumpkin’s Snow Trail'],['两块洁白的雪方块旁，有一个刻过脸的南瓜。','Two white snow blocks lie beside a pumpkin with a face carved into it.'],'❄',
      ['雕刻南瓜刚放好，雪傀儡就迈开了脚步。一条细细的雪迹从你的脚下延伸到松林。','The carved pumpkin settled into place and a snow golem took its first step. A fine trail of snow led away into the pines.']
    ],
    snowpea: [
      ['穿过树火的冰豆','A Pea Through the Flame'],['雪地里的蓝色豌豆痕，经过温暖的树桩就变成了绿色。','Blue pea marks in the snow turn green on the far side of a warm stump.'],'❅',
      ['寒冰射手留下两枚实验印记。冰豆穿过火炬树桩会成为普通豌豆，绕过树桩则会保留冰霜。','Snow Pea left two trial marks. Its frozen pea stayed icy on an open lane and became an ordinary green pea after passing through Torchwood.']
    ],
    'end-dragon': [
      ['归乡门的四束光','Four Beams at the Exit'],['黑曜石边，四道细光从不同方向指向同一个空心石环。','Beside the obsidian, four thin rays point towards the same hollow ring of stone.'],'✥',
      ['四枚末地水晶在返回传送门边缘互相呼应。群岛上空掠过一道熟悉的紫色龙影。','The four End Crystals answered one another from the rim of the exit portal. A familiar purple dragon swept across the islands.']
    ]
  };
  function makeUI(host,id,opts) {
    const t=(zh,en)=>opts.lang==='zh'?zh:en;
    const wrap=document.createElement('section');
    wrap.className='sg-secret sg-'+id;
    host.replaceChildren(wrap);
    let done=false, notice='', events={}, redraw=()=>{}, busy=false;
    const img=(key,alt='',cls='')=>'<img draggable="false" class="sg-img '+cls+'" src="'+art(key)+'" alt="'+alt+'">';
    const block=(i)=>'<span class="sg-block" aria-hidden="true" style="--tile:'+i+'"></span>';
    const btn=(key,content,classes='',label='',pressed=null)=>'<button type="button" class="sg-b '+classes+'" data-sg="'+key+'"'+(label?' aria-label="'+label+'"':'')+(pressed===null?'':' aria-pressed="'+pressed+'"')+'>'+content+'</button>';
    const tile=(value,cls='',label='')=>'<div class="sg-tile '+cls+'"'+(label?' aria-label="'+label+'"':'')+'>'+value+'</div>';
    const text=(zh,en)=>'<p>'+t(zh,en)+'</p>';
    const ui={
      t,img,block,btn,tile,text,
      paint(inner,rule,initial=''){
        const active=wrap.contains(document.activeElement)?document.activeElement.dataset.sg:null;
        wrap.innerHTML='<p class="sg-rule">'+rule+'</p>'+inner+'<p class="sg-notice" role="status" aria-live="polite">'+(notice||initial)+'</p>';
        if(active)Array.from(wrap.querySelectorAll('[data-sg]')).find(b=>b.dataset.sg===active)?.focus({preventScroll:true});
      },
      bind(run,action){redraw=run;events=action;redraw();},
      say(value){notice=value;},
      finish(){if(done)return;done=true;opts.onWin?.();},
      get done(){return done;}
    };
    function click(e){
      const b=e.target.closest('[data-sg]');
      if(!b || !wrap.contains(b)||done||busy)return;
      const [cmd,n]=b.dataset.sg.split(':');const handler=events[cmd];
      if(!handler)return;
      busy=true;notice='';try{
        opts.sound?.('tap');handler(n===undefined?null:Number(n));
        if(!done && wrap.isConnected)redraw();
      }finally{busy=false;}
    }
    wrap.addEventListener('click',click);
    ui.cleanup=()=>{done=true;wrap.removeEventListener('click',click);};
    return ui;
  }
  const grid=(cols,children,extra='')=>'<div class="sg-grid '+extra+'" style="--cols:'+cols+'">'+children.join('')+'</div>';
  const bar=(...buttons)=>'<div class="sg-bar">'+buttons.join('')+'</div>';
  const coords=(i,cols)=>String.fromCharCode(65+Math.floor(i/cols))+(i%cols+1);
  const nearby=(i,j,w)=>Math.abs(Math.floor(i/w)-Math.floor(j/w))+Math.abs(i%w-j%w)===1;
  const range=n=>Array.from({length:n},(_,i)=>i);
  function wallnut(u){
    const {t,img,btn,tile}=u, nuts=new Set(),plants=[1,2,2],occupied=new Set([1,7,12,4,14]);
    let tested=false;
    function laneSafe(r){return [...nuts].some(i=>Math.floor(i/5)===r && i%5>plants[r]);}
    function draw(){
      const cells=range(15).map(i=>{
        const r=Math.floor(i/5),c=i%5,threat=r!==1,key=coords(i,5);
        if(c===plants[r])return tile('<span aria-hidden="true">♧</span>','sg-seed',t('幼苗 ','Seedling ')+key);
        if(threat && c===4)return tile(img('zombie',t('僵尸','Zombie')),'sg-enemy');
        const label=(nuts.has(i)?t('收回坚果 ','Lift Wall-nut '):t('种下坚果 ','Plant Wall-nut '))+key;
        return btn('nut:'+i,nuts.has(i)?img('wallnut',t('坚果墙','Wall-nut')):(threat?'‹':'·'),'sg-cell '+(threat?'sg-track':'')+(nuts.has(i)?' sg-chosen':''),label,nuts.has(i));
      });
      const result=tested?'<div class="sg-tags">'+[0,2].map(r=>'<span>'+t('第 '+(r+1)+' 行','Lane '+(r+1))+' '+(laneSafe(r)?'✓':'×')+'</span>').join('')+'</div>':'';
      u.paint(grid(5,cells,'sg-grass')+result+bar('<span class="sg-stock">'+img('wallnut')+' '+(2-nuts.size)+'/2</span>',btn('try',t('让队伍前进','Advance the line'),'sg-main')),
        t('脚印从右向左。把两颗坚果种在有脚印的行里，挡在僵尸和幼苗之间。再点一次可以收回。','Footprints lead from right to left. Plant two Wall-nuts between the zombies and the seedlings in the trampled lanes. Tap a nut to lift it.'));
    }
    u.bind(draw,{nut(i){if(occupied.has(i))return;tested=false;if(nuts.has(i))nuts.delete(i);else if(nuts.size<2)nuts.add(i);else u.say(t('先点一颗已种下的坚果，把它收回来。','Lift one planted nut to use it somewhere else.'));},try(){
      tested=true;if(laneSafe(0)&&laneSafe(2)){u.finish();return;}
      u.say(t('有一排脚步还没被拦住。看看标有 × 的行，从右边向左检查。','One lane is still open. Follow the row marked × from right to left.'));
    }});
  }
  function redstone(u){
    const {t,img,block,btn,tile}=u,loose=new Set(),fixed=[1,3,11,13],pads=[2,5,6,7,9,10,12],lamps=[4,14];
    let on=false;
    function powered(){
      const seen=new Set();if(!on)return seen;
      const wire=new Set([...fixed,...loose]),q=[0];seen.add(0);
      for(let k=0;k<q.length;k++){for(const n of [...wire,...lamps])if(!seen.has(n)&&nearby(q[k],n,5)){seen.add(n);if(wire.has(n))q.push(n);}}
      return seen;
    }
    function check(){const seen=powered();if(lamps.every(l=>seen.has(l)))u.finish();}
    function draw(){
      const seen=powered();const cells=range(15).map(i=>{
        if(i===0)return btn('lever',on?'⏽':'⏻','sg-cell sg-lever '+(on?'sg-powered':''),t('开关拉杆','Power lever'),on);
        if(lamps.includes(i))return tile(block(seen.has(i)?6:5),'sg-lamp '+(seen.has(i)?'sg-on':''),t('红石灯','Redstone lamp'));
        if(fixed.includes(i))return tile('✣','sg-wire '+(seen.has(i)?'sg-powered':''),t('已有红石线','Fixed redstone'));
        if(pads.includes(i))return btn('dust:'+i,loose.has(i)?'✣':'+','sg-cell sg-wire '+(seen.has(i)?'sg-powered':''),t('红石地格 ','Dust socket ')+coords(i,5),loose.has(i));
        return tile(block(7),'sg-rock');
      });
      u.paint(grid(5,cells,'sg-stone')+bar('<span class="sg-stock">'+img('redstone')+' '+(3-loose.size)+'/3</span>',btn('lever',on?t('放下拉杆','Switch off'):t('拉起拉杆','Switch on'),'sg-main')),
        t('用三撮红石粉把左上角的拉杆接到两盏灯。线路只能上下左右相连。点加号铺粉，再点一下收回。','Connect the top-left lever to both lamps using three pinches of redstone. Paths connect across shared edges. Tap a + to lay dust; tap it again to lift it.'),
        t('亮灯 ','Lamps lit ')+lamps.filter(l=>seen.has(l)).length+' / 2');
    }
    u.bind(draw,{dust(i){if(loose.has(i))loose.delete(i);else if(loose.size<3)loose.add(i);else u.say(t('红石粉用完了，可以从另一格收回一撮。','Lift a pinch of dust from another socket.'));check();},lever(){on=!on;check();}});
  }
  function enderman(u){
    const {t,img,block,btn,tile}=u;let lens=0,where=2,hood=false;
    function draw(){
      const cells=range(3).map(i=>btn('aim:'+i,
        (where===i?img('enderman',t('末影人','Enderman'))+'<b class="sg-motes">✧ ✧</b>':'<span class="sg-stones">▴ ▵</span>')+
        '<span class="sg-aim">'+(lens===i?'⌖':'·')+'</span>','sg-cell sg-ledge '+(lens===i?'sg-focused':''),t('镜头对准石台 ','Aim at ledge ')+(i+1),lens===i));
      u.paint(grid(3,cells,'sg-night')+bar(btn('hood',block(1)+(hood?t('摘下南瓜','Remove pumpkin'):t('戴上雕刻南瓜','Wear pumpkin')),'sg-tool',undefined,hood),btn('record',t('观察并记录','Look through the lens'),'sg-main')),
        t('紫色粒子暴露了末影人的位置。点石台对准镜头，记录它带着的方块。直接与它对视会惊动它，雕刻南瓜可以遮住你的眼睛。','Violet particles reveal the Enderman. Tap a ledge to aim the lens and record the block it carries. Direct eye contact disturbs it. A carved pumpkin can hide your eyes.'),
        hood?t('南瓜面罩已戴好。','Pumpkin mask fitted.'):t('镜头盖已经打开。','The lens cap is off.'));
    }
    u.bind(draw,{aim(i){lens=i;},hood(){hood=!hood;},record(){
      if(lens!==where){u.say(t('镜头里只有岩石。找找紫色的粒子。','Only rock is in the frame. Look for the violet particles.'));return;}
      if(!hood){where=(where+1)%3;u.say(t('紫光一闪，它瞬移了！戴上雕刻南瓜，再找找它落在了哪块石台上。','A violet flash! It teleported. Put on the carved pumpkin and find its new ledge.'));return;}
      u.finish();
    }});
  }
  function plantern(u){
    const {t,img,btn,tile}=u, path=new Set([8,9,5,6,2,3]),posts=[8,6,3],visited=new Set([8]);
    let player=8,lit=8;
    const light=i=>Math.max(Math.abs(i%4-lit%4),Math.abs(Math.floor(i/4)-Math.floor(lit/4)))<=1;
    function draw(){
      const cells=range(12).map(i=>{
        const fog=!light(i)&&!visited.has(i);
        const symbol=i===player?'◆':fog?'≋':path.has(i)?(i===3?'⚑':'◇'):'≈';
        const word=i===player?t('当前位置','Current position'):fog?t('浓雾','Fog'):path.has(i)?t('踏石','Stepping stone'):t('水面','Water');
        return btn('step:'+i,symbol,'sg-cell '+(i===player?'sg-walker':fog?'sg-fog':path.has(i)?'sg-path':'sg-water'),word+' '+coords(i,4));
      });
      u.paint(grid(4,cells,'sg-marsh')+bar('<span class="sg-stock">'+img('plantern')+'</span>',...posts.map((p,j)=>btn('lantern:'+j,t('灯架 '+(j+1),'Post '+(j+1)),'sg-tool '+(p===lit?'sg-chosen':''),undefined,p===lit))),
        t('挪动路灯花可以照散附近的浓雾。◆ 是你，◇ 是踏石。每次沿上下左右走一格，到右上角的旗子。','Move Plantern between the posts to clear nearby fog. You are ◆. Tap neighbouring ◇ stepping stones to reach the flag in the upper right.'));
    }
    u.bind(draw,{lantern(j){lit=posts[j];},step(i){
      if(i===player)return;
      if(!nearby(i,player,4)){u.say(t('每次只能从脚下的踏石走一格。','Move one step from your current stone.'));return;}
      if(!light(i)&&!visited.has(i)){u.say(t('雾太浓了。换一个灯架，照亮前路。','The fog is too thick. Try another lamp post.'));return;}
      if(!path.has(i)){u.say(t('那是水面，选择菱形的踏石。','That is open water. Choose a diamond-shaped stone.'));return;}
      player=i;visited.add(i);if(i===3)u.finish();
    }});
  }
  function kernel(u){
    const {t,img,btn,tile}=u;
    let turn=0,pos=[2,1],stuck=[0,0],failed=false;
    const butter=[true,false,true];
    function reset(){turn=0;pos=[2,1];stuck=[0,0];failed=false;}
    function draw(){
      const tracks=pos.map((p,lane)=>'<div class="sg-test-row"><b>'+String.fromCharCode(65+lane)+'</b>'+
        grid(5,range(5).map(i=>tile(i===p?img('zombie',t('假人','Target dummy'))+(stuck[lane]?'<small>▰</small>':''):(i===3?'⚑':'·'),
        'sg-rail '+(i===3?'sg-safe':'')+(i===p&&stuck[lane]?' sg-butter':''))))+'</div>').join('');
      const tray=butter.map((b,i)=>'<span class="sg-ammo '+(turn===i?'sg-current':i<turn?'sg-used':'')+'">'+(b?t('▰ 黄油','▰ Butter'):t('• 玉米','• Kernel'))+'</span>').join('');
      const fire=failed?[btn('reset',t('重新试车','Reset the trial'),'sg-main')]:[...range(2).map(i=>btn('shoot:'+i,t('瞄准 ','Aim at ')+String.fromCharCode(65+i),'sg-main'))];
      u.paint('<div class="sg-experiment"><div class="sg-load">'+img('kernel')+'<div>'+tray+'</div></div>'+tracks+'</div>'+bar(...fire),
        t('三发之后，让两个假人都停在旗子上。每发之后两车各走一格。黄油能让一辆车连续两次不动；玉米不会减速。弹药从左向右使用。','After three shots, both dummies should be on their flags. Each cart advances one square after a shot. Butter holds one cart still for two advances; a kernel does not slow it. The tray feeds from left to right.'),
        t('领先的小车会先越线。','The leading cart will cross the line first.'));
    }
    u.bind(draw,{shoot(lane){
      if(failed||turn===3)return;
      const buttery=butter[turn++];if(buttery)stuck[lane]=2;
      for(let i=0;i<2;i++){if(stuck[i])stuck[i]--;else pos[i]=Math.min(4,pos[i]+1);}
      if(turn===3&&pos.every(p=>p===3)){u.finish();return;}
      if(pos.some(p=>p>3)||turn===3){
        failed=true;u.say(t('有一辆车错过了旗子。再试一次，先留住领先的车。','A cart missed its flag. Try again, holding the leading cart first.'));
      }else u.say(buttery?t('黄油使这辆车停住了。','The butter held that cart still.'):t('玉米粒命中了，车轮仍可以转动。','The kernel hit. The wheels can still turn.'));
    },reset});
  }
  function golem(u){
    const {t,btn,block,tile}=u;let stack=[];
    const materials=[[0,t('雪方块','Snow block')],[1,t('雕刻南瓜','Carved pumpkin')],[2,t('泥土','Dirt')]];
    function draw(){
      const slots=[2,1,0].map((j)=>tile(j<stack.length?block(stack[j]):'·','sg-stack-slot '+(j===stack.length?'sg-next-slot':'')));
      const blocks=materials.map(([b,name])=>btn('place:'+b,block(b)+'<span>'+name+'</span>','sg-material'));
      u.paint('<div class="sg-yard"><div class="sg-stack">'+slots.join('')+'</div><div class="sg-supplies">'+blocks.join('')+'</div></div>'+bar(btn('undo',t('拿走最上面一块','Lift the top block'),'sg-tool')),
        t('把材料从下往上堆进空位。雪地里的纸条写着：“两块一样的冷白石，最后才戴上有脸的帽子。”','Stack the materials from the ground up. A note in the snow reads, “Two matching blocks of frozen white. Put the face on last.”'));
    }
    u.bind(draw,{place(i){
      if(stack.length===3){u.say(t('先拿走放错的方块，再试试。','Lift the misplaced blocks to try another stack.'));return;}
      stack.push(i);
      if(stack.length===3){
        if(stack.join(',')==='0,0,1'){u.finish();return;}
        u.say(t('雪地没有出现脚印。检查两块身体和最后放的头。','There are no footprints. Check both body blocks and the head that went on last.'));
      }else if(i===1)u.say(t('南瓜已经放下了。纸条说要最后才戴上它。','The pumpkin is in place. The note said the face goes on last.'));
    },undo(){stack.pop();}});
  }
  function snowpea(u){
    const {t,img,btn,tile}=u;
    let stump=false,marked=[false,false],last=null;
    function draw(){
      const track=[tile(img('snowpea',t('寒冰射手','Snow Pea')),'sg-shooter'),tile('→','sg-flight'),
        btn('stump',stump?img('torchwood',t('火炬树桩','Torchwood')):'+','sg-cell sg-plantspot',t('放下或移走火炬树桩','Plant or lift Torchwood'),stump),tile('→','sg-flight'),
        tile(last===null?'◎':last?'●':'❅','sg-target '+(last===null?'':last?'sg-green':'sg-blue'))];
      const samples='<div class="sg-tags"><span class="'+(marked[0]?'sg-checked':'')+'">'+(marked[0]?'✓ ':'□ ')+t('冰豆印记','Frost mark')+'</span><span class="'+(marked[1]?'sg-checked':'')+'">'+(marked[1]?'✓ ':'□ ')+t('普通豌豆印记','Green mark')+'</span></div>';
      u.paint(grid(5,track,'sg-frost')+samples+bar(btn('stump',stump?t('移开火炬树桩','Lift Torchwood'):t('放入火炬树桩','Plant Torchwood'),'sg-tool'),btn('fire',t('试射一颗','Fire one pea'),'sg-main')),
        t('用同一株寒冰射手在靶上留下两种不同印记。可以让冰豆直接飞过去，也可以在中途放一株火炬树桩。','Make two different marks on the target using the same Snow Pea. Fire across the empty plot or plant Torchwood in the middle.'));
    }
    u.bind(draw,{stump(){stump=!stump;},fire(){last=stump;marked[Number(stump)]=true;
      if(marked.every(Boolean)){u.finish();return;}
      u.say(stump?t('冰豆穿过火焰，靶上留下普通豌豆的圆印。再试试没有树桩的路线。','The frozen pea passed through flame and left a round green mark. Try a clear lane next.'):
        t('冰霜在靶上结了一朵雪花。现在试试让它穿过火炬树桩。','Frost made a snowflake on the target. Send the next pea through Torchwood.'));
    }});
  }
  function dragon(u){
    const {t,btn,block,tile}=u,crystals=new Set(),axis=[1,3,5,7];
    const compass=['↖','↑','↗','←','◆','→','↙','↓','↘'];
    function draw(){
      const cells=range(9).map(i=>i===4?tile('<span>✦</span>','sg-portal',t('返回传送门','Exit portal')):
        btn('place:'+i,crystals.has(i)?block(4):'<span>'+compass[i]+'</span>',
          'sg-cell sg-rim '+(crystals.has(i)?'sg-crystallized':''),t('石环位置 ','Stone ring position ')+coords(i,3),crystals.has(i)));
      u.paint(grid(3,cells,'sg-end')+bar('<span class="sg-stock">'+block(4)+' '+(4-crystals.size)+'/4</span>',btn('call',t('唤醒传送门','Awaken the portal'),'sg-main')),
        t('把四枚末地水晶放到返回传送门边缘。石刻说四束光要从正北、正东、正南和正西汇入中心。点已放好的水晶可以收回。','Set four End Crystals on the rim of the exit portal. The carving shows beams entering from due north, east, south and west. Tap a placed crystal to lift it.'));
    }
    u.bind(draw,{place(i){if(crystals.has(i))crystals.delete(i);else if(crystals.size<4)crystals.add(i);else u.say(t('手里没有水晶了，可以先收回一枚。','Lift a crystal to move it to another socket.'));},call(){
      if(crystals.size<4){u.say(t('四枚水晶要一起回应石环。','The ring needs four crystals together.'));return;}
      if(axis.every(i=>crystals.has(i))){u.finish();return;}
      u.say(t('对角的水晶没有接上光束。检查传送门每条边的正中央。','A crystal on a corner missed its beam. Check the midpoint of each side of the portal.'));
    }});
  }
  const games={wallnut,redstone,enderman,plantern,kernel,'snow-golem':golem,snowpea,'end-dragon':dragon};
  const registry=window.StarfallSecrets ||= {};
  for(const [id,[name,lead,mark,memory]] of Object.entries(records)){
    registry[id]={name,lead,mark,memory,art:art(id),mount(host,opts){
      const ui=makeUI(host,id,opts);games[id](ui);return ui.cleanup;
    }};
  }
})();
