(() => {
  "use strict";
  const base = new URL(".", document.currentScript?.src || document.baseURI);
  const file = name => new URL(name,base).href;
  const sites = {
    canopy: {name:"Front Porch", pos:[-6.6,-3.5], arrival:[-6.3,-1.73], label:4.55},
    hollow: {name:"Treehouse Loft"},
    picnic: {name:"Orchard Picnic", pos:[-7.4,2.7], arrival:[-6.3,3.76],label:2.85},
    bakery: {name:"Bunny Bakery", pos:[-2.8,.22], arrival:[-2.9,1.7],label:3.32},
    stage: {name:"Starlight Stage", pos:[-.7,-4.3], arrival:[-.7,-2.85],label:2.86},
    cat: {name:"Kitten Garden", pos:[.0,3.65], arrival:[.2,4.86],label:2.34},
    castle: {name:"Pumpkin Castle", pos:[5.5,-3.9], arrival:[5.35,-2.28],label:4.26},
    parade: {name:"Ribbon Parade", pos:[5.35,.95], arrival:[4.4,2.56],label:2.86},
    reef: {name:"Coral Cove", pos:[8.38,4.36], arrival:[7.95,4.93],label:1.45}
  };
  const stops = Object.keys(sites).filter(id => id !== "hollow");
  const nav = [...stops.map(id=>sites[id].arrival),[-5,.20],[-1.1,1.72],[2.6,.12],[2,-2.52],[3.25,3.84]];
  const edges = [[0,8],[8,1],[8,2],[2,9],[8,3],[3,11],[11,5],[11,10],[10,6],[10,9],[9,4],[4,12],[12,6],[6,7]];
  const dist = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1]);
  function nearest(point) {
    return nav.reduce((best,n,i) => dist(n,point)<dist(nav[best],point)?i:best,0);
  }
  function pathBetween(start,end) {
    const from=nearest(start), to=nearest(end);
    const cost=nav.map(()=>Infinity), prev=nav.map(()=>-1), done=new Set();
    cost[from]=0;
    while(done.size<nav.length) {
      let v=-1; for(let k=0;k<nav.length;k++) if(!done.has(k)&&(v<0||cost[k]<cost[v])) v=k;
      if(v===to||v<0) break;
      done.add(v);
      for(const [a,b] of edges) {
        const n=a===v?b:b===v?a:-1;
        if(n<0) continue;
        const c=cost[v]+dist(nav[n],nav[v]); if(c<cost[n]) {cost[n]=c;prev[n]=v;}
      }
    }
    const route=[nav[to]]; let p=to; while(p!==from && prev[p]>=0) {p=prev[p];route.unshift(nav[p]);}
    if(dist(route[0],start)<.13) route.shift();
    if(!route.length||dist(route.at(-1),end)>.1) route.push(end);
    return route;
  }
  const topY = (x,z) => .22+.022*Math.cos(x*.48+z*.27)+.018*Math.sin(z*.85-x*.28);
  const icons = {
    map:'<path d="m2 5 7-2 6 3 7-2v15l-7 2-6-3-7 2zM9 3v15m6-12v15"/>',
    plus:'<path d="M5 12h14M12 5v14"/>', minus:'<path d="M5 12h14"/>',
    north:'<circle cx="12" cy="12" r="9"/><path d="m15.5 6.5-2 7-5 4 2-7Z"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4.5 2.6c-1.3.7-1.5 1.2-1.5 2.4m0 3v.2"/>',
    light:'<path d="M9 4V3c0-2 6-2 6 0v1M7 6h10l2 9-2 3H7l-2-3zm0 13h10m-7 2h4"/>',
    walk:'<circle cx="14" cy="4" r="2"/><path d="m10 10 3-3 3 4 3 1m-6-5-3 8-4 6m5-7 4 3 1 5m-6-12-4 3"/>',
    play:'<path d="m8 5 11 7-11 7z"/>', door:'<path d="M4 21h16M6 20V4l11-2v19m-4-9h.2"/>'
  };
  const ico = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';
  let serial=0;

  // Bake static toy pieces into a few draw calls, keeping an independent raycast mesh per landmark.
  function kit(T) {
    const geom=new Map(), colors=new Map(), generated=new Set(), materials=new Set(), textures=new Set(), pending=new Set();
    let disposed=false;
    function geometry(key,fn){if(!geom.has(key))geom.set(key,fn());return geom.get(key);}
    const boxG=geometry("box",()=>new T.BoxGeometry(1,1,1)), ballG=geometry("ball",()=>new T.IcosahedronGeometry(1,1));
    const sourceMat=new T.MeshBasicMaterial();materials.add(sourceMat);
    const clay=new T.MeshLambertMaterial({vertexColors:true,flatShading:true,side:T.DoubleSide});
    const hot=new T.MeshBasicMaterial({vertexColors:true,side:T.DoubleSide});
    materials.add(clay);materials.add(hot);
    function color(c){if(!colors.has(c))colors.set(c,new T.Color(c));return colors.get(c);}
    function g(parent,x=0,y=0,z=0){const o=new T.Group();o.position.set(x,y,z);if(parent)parent.add(o);return o;}
    function part(root,geo,x,y,z,sx,sy,sz,c,lit=false,rx=0,ry=0,rz=0){
      const m=new T.Mesh(geo,sourceMat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.set(rx,ry,rz);m.userData.paint=c;m.userData.lit=lit;root.add(m);return m;
    }
    function box(p,x,y,z,w,h,d,c,lit=false,rx=0,ry=0,rz=0){return part(p,boxG,x,y,z,w,h,d,c,lit,rx,ry,rz);}
    function ball(p,x,y,z,w,h,d,c,lit=false){return part(p,ballG,x,y,z,w,h,d,c,lit);}
    function tube(p,x,y,z,rt,rb,h,c,n=9,lit=false){
      const ratio=rb?rt/rb:0;
      const geo=geometry("c"+ratio+","+n,()=>new T.CylinderGeometry(ratio,1,1,n));
      return part(p,geo,x,y,z,rb,h,rb,c,lit);
    }
    function beam(p,a,b,r,c,sides=7,top=r){
      const mid=a.map((v,i)=>(v+b[i])/2),v=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
      const obj=tube(p,...mid,top,r,v.length(),c,sides); obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return obj;
    }
    function triangles(p,pts,c,lit=false){
      const geo=new T.BufferGeometry();geo.setAttribute("position",new T.Float32BufferAttribute(pts.flat(),3));geo.computeVertexNormals();
      generated.add(geo);return part(p,geo,0,0,0,1,1,1,c,lit);
    }
    function roof(p,x,y,z,w,h,d,paint){
      const a=[x-w/2,y,z+d/2],b=[x+w/2,y,z+d/2],c=[x,y+h,z+d/2],a2=[a[0],y,z-d/2],b2=[b[0],y,z-d/2],c2=[x,y+h,z-d/2];
      triangles(p,[a,b,c,b2,a2,c2,a,c,c2,a,c2,a2,b,b2,c2,b,c2,c],paint);
    }
    function bake(parent,source,key){
      source.updateMatrixWorld(true); const streams=[{p:[],c:[]},{p:[],c:[]}], v=new T.Vector3();
      source.traverse(o=>{
        if(!o.isMesh)return;const s=streams[+!!o.userData.lit],a=o.geometry.attributes.position,idx=o.geometry.index,co=color(o.userData.paint);
        for(let i=0,n=idx?idx.count:a.count;i<n;i++) {
          v.fromBufferAttribute(a,idx?idx.getX(i):i).applyMatrix4(o.matrixWorld);s.p.push(v.x,v.y,v.z);s.c.push(co.r,co.g,co.b);
        }
      });
      for(let i=0;i<2;i++)if(streams[i].p.length){
        const geo=new T.BufferGeometry();geo.setAttribute("position",new T.Float32BufferAttribute(streams[i].p,3));
        geo.setAttribute("color",new T.Float32BufferAttribute(streams[i].c,3));geo.computeVertexNormals();geo.computeBoundingSphere();generated.add(geo);
        const obj=new T.Mesh(geo,i?hot:clay);obj.userData.place=key;
        obj.castShadow=!i;obj.receiveShadow=!i;parent.add(obj);
      }
    }
    function picture(parent,place,x,y,z,w,h){
      const mat=new T.MeshBasicMaterial({color:0xded4b2,side:T.DoubleSide});materials.add(mat);
      const pl=geometry("picture",()=>new T.PlaneGeometry(1,1));const face=new T.Mesh(pl,mat);
      face.position.set(x,y,z);face.scale.set(w,h,1);face.userData.place=place; parent.add(face);
      const tx=new T.TextureLoader().load(file("assets/art/"+place+".webp"),t=>{
        pending.delete(t);if(disposed){t.dispose();return;}t.colorSpace=T.SRGBColorSpace;mat.map=t;mat.color.set(0xffffff);mat.needsUpdate=true;
      },undefined,()=>{});
      textures.add(tx);pending.add(tx);
    }
    function dispose(){disposed=true;geom.forEach(g=>g.dispose());generated.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}
    return {g,box,ball,tube,beam,roof,triangles,bake,picture,color,dispose,materials,generated,textures};
  }

  function buildWorld(T,K){
    const {g,box,ball,tube,beam,roof,triangles,bake,picture}=K;
    const outdoor=g(), indoor=g();let seed=9219;
    const rnd=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
    const green=["#346c59","#467e5e","#2f6555","#5b9364"], bark="#80583d",wood="#ac784a",trim="#513c36";
    function foliage(p,x,y,z,r,c){ball(p,x,y,z,r,r*.86,r*.9,c);}
    function pine(p,x,y,z,s){
      tube(p,x,y+.43*s,z,.1*s,.16*s,.9*s,bark,6);
      for(let i=0;i<3;i++)tube(p,x,y+(.86+.40*i)*s,z,0,(.55-.10*i)*s,(1.04-.1*i)*s,["#315e50","#3c715c","#508366"][i],7);
    }
    function tree(p,x,y,z,s,apples=false){
      tube(p,x,y+.84*s,z,.19*s,.28*s,1.7*s,bark,7);
      for(const [dx,dz,h] of [[-.63,0,1.77],[.48,-.32,1.98],[.24,.49,1.66],[0,0,2.22]]) {
        beam(p,[x,y+.93*s,z],[x+dx*s,y+h*s,z+dz*s],.10*s,bark);
        foliage(p,x+dx*s,y+h*s,z+dz*s,.78*s,green[Math.floor(rnd()*4)]);
        if(apples)for(let j=0;j<3;j++)ball(p,x+(dx+(j-1)*.22)*s,y+(h+.05*(j%2)-.17)*s,z+(dz+.54)*s,.11*s,.13*s,.1*s,"#d85a41");
      }
    }
    function flower(p,x,y,z,c,s=1){
      tube(p,x,y+.16*s,z,.025*s,.035*s,.33*s,"#51845f",5);
      for(let n=0;n<5;n++){let t=n*Math.PI*.4;ball(p,x+Math.cos(t)*.115*s,y+.35*s,z+Math.sin(t)*.105*s,.105*s,.06*s,.09*s,c);}
      ball(p,x,y+.396*s,z,.069*s,.042*s,.07*s,"#f7c76a");
    }
    function lantern(p,x,y,z,s=.7){
      box(p,x,y+.71*s,z,.09*s,1.42*s,.09*s,trim);
      box(p,x,y+1.49*s,z,.46*s,.10*s,.4*s,trim);
      box(p,x,y+1.72*s,z,.3*s,.4*s,.29*s,"#ffc36c",true);
      for(const a of [-1,1])for(const b of [-1,1])box(p,x+a*.16*s,y+1.71*s,z+b*.15*s,.045*s,.45*s,.045*s,trim);
      tube(p,x,y+2*s,z,0,.36*s,.26*s,"#52665b",4).rotation.y=Math.PI/4;
    }
    function windowBox(p,x,y,z,w,h){
      box(p,x,y,z,w+.12,h+.13,.05,trim);box(p,x,y,z+.035,w,h,.05,"#ffcf81",true);
      box(p,x,y,z+.075,.055,h,.045,wood);box(p,x,y,z+.075,w,.055,.045,wood);
    }
    function critter(p,x,y,z,s,cat=false){
      const cream=cat?"#a2ada6":"#c3c1a6";
      ball(p,x,y+.38*s,z,.48*s,.51*s,.35*s,cream);
      ball(p,x,y+.89*s,z+.05*s,.58*s,.46*s,.40*s,cream);
      for(const a of [-1,1]){
        if(cat){
          const ear=tube(p,x+a*.39*s,y+1.31*s,z+.04*s,0,.27*s,.54*s,"#a4b3ad",3);ear.rotation.y=.52;
          triangles(p,[[x+(a*.39-.14)*s,y+1.18*s,z+.19*s],[x+(a*.39+.14)*s,y+1.18*s,z+.19*s],[x+a*.42*s,y+1.5*s,z+.14*s]],"#d69da0");
        }else{ball(p,x+a*.48*s,y+1.11*s,z,.26*s,.25*s,.14*s,cream);ball(p,x+a*.50*s,y+1.11*s,z+.09*s,.17*s,.16*s,.08*s,"#9b8f85");}
        ball(p,x+a*.21*s,y+.94*s,z+.405*s,.118*s,.12*s,.043*s,cat?"#69c6d9":"#423e39");
        if(cat)ball(p,x+a*.20*s,y+.94*s,z+.442*s,.054*s,.082*s,.025*s,"#263b45");
        ball(p,x+a*.21*s-.02*s,y+.97*s,z+.464*s,.024*s,.026*s,.012*s,"#fff4d3",true);
      }ball(p,x,y+.78*s,z+.43*s,(cat?.082:.13)*s,.085*s,.06*s,cat?"#db8d85":"#49433e");
    }
    function house(p){
      tube(p,0,1.37,0,.48,.70,2.72,bark,8);
      beam(p,[0,1.1,0],[-1.46,3.55,-.32],.24,bark,8,.12);
      beam(p,[0,1.3,0],[1.45,3.25,-.18],.23,bark,8,.12);
      for(const [x,y,z,r] of [[-1.4,3.5,-.35,1.13],[-.6,3.95,-.7,1.1],[1.48,3.3,-.5,1],[.54,3.95,-.72,.9]])foliage(p,x,y,z,r,green[Math.floor(rnd()*4)]);
      box(p,0,1.26,.32,2.8,.23,1.91,wood);box(p,0,2.1,.13,2.42,1.57,1.58,"#eab957");
      roof(p,0,2.89,.13,2.86,.96,1.96,"#be5946");
      tube(p,0,3.12,1.13,.20,.20,.08,trim,12).rotation.x=Math.PI/2;
      tube(p,0,3.12,1.18,.13,.13,.08,"#ffd784",12,true).rotation.x=Math.PI/2;
      box(p,-.72,1.94,.951,.47,1.15,.08,trim);box(p,-.72,1.93,1.01,.35,.98,.08,wood);
      windowBox(p,.68,2.28,.96,.54,.55);windowBox(p,.02,2.28,.96,.4,.55);
      for(let i=0;i<7;i++)box(p,-1.20+i*.39,1.58,1.2,.08,.51,.07,"#966846");
      box(p,0,1.85,1.2,2.69,.085,.085,wood);
      for(const x of [-.24,.28,.90]){
        beam(p,[x,1.83,1.25],[x-.08,.9,1.29],.016,"#597951",5);
        for(let n=0;n<4;n++)ball(p,x-.04+(n%2?.075:-.07),1.68-n*.18,1.29,.093,.055,.054,"#68905d");
      }
      for(const a of [-1,1])beam(p,[-1.1+a*.21,.14,1.76],[-1.1+a*.21,1.29,1.05],.045,wood);
      for(let j=0;j<6;j++)box(p,-1.1,.25+j*.185,1.70-j*.11,.45,.055,.07,"#bd8d57");
      critter(p,1.02,.06,1.07,.52);lantern(p,-1.45,0,.85,.65);
    }
    function bakery(p){
      box(p,0,.89,0,2.37,1.77,1.64,"#d5ac76");roof(p,0,1.78,0,2.8,.73,2.03,"#617e69");
      box(p,-.70,.54,.85,.47,.98,.05,trim); windowBox(p,.42,1.13,.86,1.09,.64);
      for(let i=0;i<7;i++){
        const c=i%2?"#e9d4a4":"#cc7966";box(p,-1.11+i*.37,1.57,1.02,.38,.10,.72,c,false,.22);
        box(p,-1.11+i*.37,1.38,1.37,.38,.19,.08,c);
      }
      box(p,.40,.67,1.09,1.37,.12,.59,wood);
      for(let j=0;j<4;j++)ball(p,-.1+j*.28,.80,1.12,.15,.10,.12,"#e7a65b");
      ball(p,-.66,1.17,1,.27,.24,.22,"#efedd4");
      for(const a of [-1,1]){ball(p,-.66+a*.13,1.49,.99,.084,.24,.09,"#eee8cc");ball(p,-.66+a*.10,1.18,1.20,.026,.032,.02,trim);}
      beam(p,[.96,.58,.59],[1.22,2.62,.53],.013,"#bbab84",4);
      ball(p,1.22,2.78,.53,.24,.32,.22,"#5795a5");
      lantern(p,1.55,0,.82,.7);
    }
    function castle(p){
      box(p,0,1.02,0,2.12,2.05,1.49,"#5b596c");roof(p,0,2.04,.04,2.45,1.06,1.71,"#353d54");
      for(const [x,z,h] of [[-1.15,.26,1.77],[1.12,.25,1.94],[.55,-.74,2.5]]) {
        tube(p,x,h/2,z,.38,.44,h,"#6b6575",7);tube(p,x,h+.52,z,0,.56,1.16,"#3e4059",7);
        box(p,x,h*.72,z+.37,.135,.34,.08,"#ffe19d",true);
        beam(p,[x,h+1.08,z],[x,h+1.38,z],.025,trim);
        triangles(p,[[x,h+1.4,z],[x+.34,h+1.30,z],[x,h+1.18,z]],"#d4925d");
      }
      box(p,0,.52,.785,.56,1.04,.07,"#392e3b");windowBox(p,-.6,1.45,.79,.34,.50);windowBox(p,.61,1.47,.79,.34,.5);
      for(const [x,z,r] of [[1.22,1,.47],[-1.37,.74,.34]]){
        for(let i=0;i<7;i++){let a=i*Math.PI*2/7;ball(p,x+Math.cos(a)*r*.27,r*.83,z+Math.sin(a)*r*.27,r*.72,r*.84,r*.69,"#e88c46");}
        tube(p,x,r*1.80,z,.065,.076,.2,"#526747",6);
        for(const a of [-1,1])ball(p,x+a*r*.34,r*.98,z+r*.84,.057,.073,.037,"#ffe3a1",true);
      }
      const tower=g(p,1.46,.0,-.44);
      tube(tower,0,.61,0,.38,.49,1.19,"#54736c",8);tube(tower,0,1.26,0,.42,.44,.17,"#c69258",8);
      for(let n=0;n<7;n++){const t=n*Math.PI*2/7;ball(tower,Math.cos(t)*.18,1.68,Math.sin(t)*.15,.4,.42,.36,"#e98b47");}
      beam(tower,[0,2,0],[.09,2.26,-.03],.064,"#638153");
      for(const sx of [-.17,.17])ball(tower,sx,1.77,.475,.075,.087,.027,"#ffe69a",true);
      box(tower,0,1.59,.52,.20,.055,.025,"#773f34");
    }
    function stage(p){
      box(p,0,.18,0,2.83,.36,2.04,wood);box(p,0,.39,.04,2.77,.08,1.97,"#ac7e67");
      for(const a of [-1,1]){tube(p,a*1.22,1.27,-.56,.082,.10,1.9,"#ab8d5c",8);ball(p,a*1.2,2.23,-.54,.14,.14,.14,"#ffdb8f",true);}
      beam(p,[-1.24,2.18,-.56],[1.24,2.18,-.56],.065,"#907559");
      for(let j=0;j<7;j++){let x=-.99+j*.33;triangles(p,[[x-.14,2.17,-.54],[x+.14,2.17,-.54],[x,1.85,-.54]],j%2?"#e1af62":"#d18487");}
      ball(p,0,1,.17,.69,.65,.56,"#e49da1");
      for(const a of [-1,1]){ball(p,a*.38,.53,.51,.30,.18,.28,"#cb675e");ball(p,a*.60,.93,.25,.26,.21,.23,"#db8e90");ball(p,a*.20,1.13,.695,.053,.103,.037,trim);}
      ball(p,0,.95,.73,.097,.08,.03,"#974f58");
      for(const a of [-1,1]){tube(p,a*1.28,.63,.68,.07,.11,.59,"#c0a072",7);ball(p,a*1.28,.98,.68,.28,.17,.27,"#d57966");}
    }
    function parade(p){
      tube(p,0,.15,0,1.22,1.3,.30,"#b88769",12);tube(p,0,.36,0,.91,1,.15,"#d1ac7c",12);
      tube(p,0,.54,.18,.34,.47,.14,"#b57a3e",8);tube(p,0,.83,.18,.12,.22,.44,"#e6b65f",8);
      tube(p,0,1.25,.18,.53,.2,.59,"#f3c369",9);
      for(const a of [-1,1]){
        beam(p,[a*.43,1.45,.18],[a*.64,1.43,.18],.067,"#e3aa55");
        beam(p,[a*.64,1.43,.18],[a*.58,1.15,.18],.06,"#e3aa55");
        beam(p,[a*.58,1.15,.18],[a*.34,1.10,.18],.055,"#e3aa55");}
      for(const [x,z,y,c] of [[-1.03,-.1,2.15,"#dc8b94"],[-.66,-.6,2.5,"#72a7a3"],[.84,-.49,2.16,"#e9b060"],[1.16,-.11,1.82,"#cd8a9d"]]){
        beam(p,[x*.76,.31,z],[x,y-.24,z],.017,"#d7c09a",4);ball(p,x,y,z,.30,.37,.27,c);
      }
    }
    function reef(p){
      ball(p,0,-.28,.2,1.81,.51,1.38,"#79908a");
      for(const [x,z,s,c] of [[-.97,.42,.8,"#df886c"],[.77,.66,.64,"#d89d9b"],[1.08,-.14,.72,"#ab91b0"]]){
        beam(p,[x,0,z],[x,s,z],.09,c,6,.055);
        for(const side of [-1,1]){beam(p,[x,s*.35,z],[x+side*.3,s*.55,z],.073,c,6,.056);beam(p,[x+side*.3,s*.55,z],[x+side*.34,s*.90,z],.054,c,6,.035);}
      }
      ball(p,-.03,.32,0,.70,.35,.55,"#719660");ball(p,-.11,.55,-.02,.52,.15,.39,"#b2a66b");
      ball(p,.57,.40,.30,.28,.23,.25,"#a9bc79");ball(p,.69,.46,.484,.041,.047,.026,trim);
      for(const a of [-1,1])for(const b of [-1,1])ball(p,a*.45,.12,b*.49,.26,.10,.22,"#91ad72");
    }
    function picnic(p){
      tree(p,-.62,0,-.49,1.02,true);
      for(let i=0;i<5;i++)for(let j=0;j<4;j++)box(p,-.85+i*.41,.054,.02+j*.37,.415,.055,.376,(i+j)%2?"#ead4a4":"#d6a44e");
      box(p,.29,.29,.58,.64,.4,.42,wood);beam(p,[.04,.45,.58],[.04,.76,.58],.04,bark);beam(p,[.53,.45,.58],[.53,.76,.58],.04,bark);beam(p,[.04,.76,.58],[.53,.76,.58],.04,bark);
      for(let i=0;i<3;i++)ball(p,.06+i*.2,.50,.61,.13,.15,.12,i===1?"#c4a253":"#d97551");
      tube(p,-.44,.12,1.03,.24,.24,.05,"#879f91",12); ball(p,-.44,.2,1.03,.15,.09,.13,"#be7768");lantern(p,1.26,0,.27,.65);
    }
    function garden(p){ball(p,0,.06,0,1.29,.2,1.01,"#75965c");critter(p,0,.16,0,1.24,true);
      for(let j=0;j<9;j++){const t=j*Math.PI*2/9;flower(p,Math.cos(t)*1.08,.07,.2+Math.sin(t)*.73,["#d58992","#f4bf73","#aa92b5"][j%3],.8);}}
    const builders={canopy:house,picnic,bakery,stage,cat:garden,castle,parade,reef};
    const coast=[],N=56;
    const terrain=g();
    for(let i=0;i<N;i++){
      const a=i/N*Math.PI*2,r=1+.047*Math.sin(5*a)+.069*Math.cos(3*a-.6)+rnd()*.055;
      coast.push([Math.cos(a)*10.95*r,Math.sin(a)*6.9*r]);
    }
    const rings=[0,.25,.52,.78,1].map((s,k)=>coast.map(([x,z],i)=>{
      const f=(k===4||!k)?s:s+(Math.sin(i*.9+k)*.018);
      return [x*f,topY(x*f,z*f),z*f];
    }));
    for(let i=0;i<N;i++){
      const j=(i+1)%N;
      for(let r=1;r<rings.length;r++){
        const a=rings[r-1][i],b=rings[r-1][j],c=rings[r][i],d=rings[r][j];
        const turf=r===4?["#578c6d","#588e72","#53886b"]:["#538b69","#548d6c","#588e6b","#5b926f"];
        triangles(terrain,[a,d,c],turf[Math.floor(rnd()*turf.length)]);if(r>1)triangles(terrain,[a,b,d],turf[Math.floor(rnd()*turf.length)]);
      }
      const a=rings[4][i],b=rings[4][j];
      const a1=[a[0]*1.025,-.25-Math.abs(Math.sin(i))*.18,a[2]*1.025],b1=[b[0]*1.025,-.25-Math.abs(Math.sin(j))*.18,b[2]*1.025];
      const a2=[a[0]*.97,-1.10,a[2]*.97],b2=[b[0]*.97,-1.10,b[2]*.97];
      triangles(terrain,[a,b,b1,a,b1,a1],i%3?"#c3a479":"#d2b58b");
      triangles(terrain,[a1,b1,a2,b1,b2,a2],["#877b69","#948672","#9e8c76"][i%3]);
    }
    function track(p,a,b,width,c){
      const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=dz/len*width/2,nz=-dx/len*width/2;
      const ay=topY(...a)+.038,by=topY(...b)+.038;
      const l=[a[0]+nx,ay,a[1]+nz],r=[a[0]-nx,ay,a[1]-nz],l2=[b[0]+nx,by,b[1]+nz],r2=[b[0]-nx,by,b[1]-nz];
      triangles(p,[l,r,l2,r,r2,l2],c);
      tube(p,a[0],ay-.009,a[1],width/2,width/2,.02,c,10);
      tube(p,b[0],by-.009,b[1],width/2,width/2,.02,c,10);
    }
    for(const [a,b] of edges)track(terrain,nav[a],nav[b],.60,"#bda47d");
    function bridge(p,a,b){
      const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),ang=-Math.atan2(dz,dx);
      const span=g(p,(a[0]+b[0])/2,topY(...a)+.045,(a[1]+b[1])/2);span.rotation.y=ang;
      const n=Math.ceil(len/.22);
      for(let i=0;i<n;i++)box(span,-len/2+(i+.5)*len/n,.077,.0,len/n*.93,.12,.73,i%2?"#ba905d":"#c99b64");
      for(const side of [-1,1]){
        for(const a of [-.47,0,.47])box(span,a*len,.34,side*.40,.076,.68,.076,wood);
        beam(span,[-len*.48,.55,side*.40],[len*.48,.55,side*.40],.033,"#aa8153",5);
      }
    }
    bridge(terrain,[5.85,3.55],[7.63,4.63]);bridge(terrain,[-4.67,-.16],[-4.05,.55]);
    const waterLine=(x,z)=>Math.hypot(x/10.4,z/6.55);
    for(let i=0;i<108;i++){
      const x=(rnd()-.5)*21.7,z=(rnd()-.5)*13.1;
      if(waterLine(x,z)>.94||stops.some(id=>dist(sites[id].pos,[x,z])<2.0)||nav.some(n=>dist(n,[x,z])<1.25)) continue;
      if(edges.some(([a,b])=>{const p=nav[a],q=nav[b],xx=q[0]-p[0],zz=q[1]-p[1],t=Math.max(0,Math.min(1,((x-p[0])*xx+(z-p[1])*zz)/(xx*xx+zz*zz)));return Math.hypot(x-p[0]-t*xx,z-p[1]-t*zz)<.79;}))continue;
      if(i%6===0)tree(terrain,x,topY(x,z),z,.39+rnd()*.18);
      else if(i%3===0)pine(terrain,x,topY(x,z),z,.63+rnd()*.38);
      else if(i%2===0)flower(terrain,x,topY(x,z),z,["#c99097","#eabe80","#ece0ae"][i%3],.6+rnd()*.45);
      else{ball(terrain,x,topY(x,z)+.09,z,.24,.19,.2,"#8e9a84");foliage(terrain,x+.27,topY(x,z)+.08,z,.24,"#6d895c");}
    }
    for(const [x,z] of [[-5.1,-.82],[-3.76,2.42],[1.43,-1.8],[4.3,3.11],[1.3,4.8]])lantern(terrain,x,topY(x,z),z,.54);
    bake(outdoor,terrain);
    for(const id of stops){
      const [x,z]=sites[id].pos, model=g();model.position.set(x,topY(x,z),z);builders[id](model);bake(outdoor,model,id);
      if(id==="bakery"||id==="stage"){
        const sign=g();box(sign,x+1.17,topY(x,z)+.61,z+1.05,.55,.55,.075,wood);
        box(sign,x+1.17,topY(x,z)+.27,z+1.03,.08,.52,.08,bark);bake(outdoor,sign,id);
        picture(outdoor,id,x+1.17,topY(x,z)+.61,z+1.095,.45,.44);
      }
    }
    // The exposed tree trunk has two usable floors and a separate sleeping loft.
    const room=g(); const rad=4.15;
    tube(room,0,-.24,0,rad,rad*.96,.54,"#896547",14);tube(room,0,.035,0,rad*.97,rad,.11,"#c09b68",14);
    for(let i=0;i<13;i++){
      const a=Math.PI+.18+i*(Math.PI-.36)/12,x=Math.cos(a)*3.8,z=Math.sin(a)*2.6;
      tube(room,x,2.06,z,.50,.54,4.13,i%2?"#a57d50":"#b18a59",7);
      if(i%3===1)box(room,x,2.16,z+.45,.14,2.94,.09,"#806246");
    }
    for(const a of [-1,1]){tube(room,a*3.6,2.20,.24,.37,.52,4.49,bark,8);foliage(room,a*3.7,4.39,.12,.69,"#547850");}
    box(room,.60,2.12,-.63,5.86,.25,2.51,"#a8784d");
    for(let j=0;j<11;j++)box(room,-2+j*.51,2.254,-.65,.48,.04,2.39,"#bf9b6e");
    box(room,1.01,2.56,-.92,2.72,.54,1.50,"#684d3a");box(room,1.03,2.89,-.92,2.70,.15,1.54,"#e1d2a8");
    box(room,.62,3.02,-.95,1.83,.15,1.53,"#5593a6");box(room,.04,3.102,-.96,.17,.035,1.53,"#92bac1");ball(room,1.93,3.04,-.92,.43,.16,.57,"#eee1b6");
    for(const a of [-1,1])for(const b of [-1,1])box(room,-1.06+a*.63,.56,-.14+b*.42,.14,1.07,.14,wood);
    box(room,-1.06,1.17,-.14,1.65,.16,1.17,"#bc8451");tube(room,-1.13,1.3,-.19,.30,.22,.13,"#c2b58d",9);ball(room,-1.15,1.47,-.2,.21,.23,.20,"#d89d37");
    windowBox(room,-1.50,3.11,-1.99,.85,.83);
    for(const a of [-1,1])beam(room,[1.4+a*.42,.12,1.62],[1.4+a*.42,2.44,.48],.10,wood,8);
    for(let i=0;i<8;i++)box(room,1.4,.27+i*.29,1.53-i*.142,.92,.095,.14,"#d3a56a");
    for(const [x,y,z] of [[-2.82,.10,-.40],[2.62,2.25,-.75],[-.2,.09,-1.55]])lantern(room,x,y,z,.61);
    box(room,-2.6,.69,-1.28,1.05,1.35,.73,"#966947");for(let i=0;i<3;i++)box(room,-2.6,.3+i*.36,-.87,.86,.25,.08,"#bb905e");
    for(let i=0;i<7;i++){
      const x=-1.72+i*.63,y=2.07-.24*Math.sin(i*Math.PI/6);
      if(i<6)beam(room,[x,y,.69],[x+.63,2.07-.24*Math.sin((i+1)*Math.PI/6),.69],.020,"#5b6751",4);
      ball(room,x,y-.074,.70,.061,.085,.061,"#ffcf76",true);
    }
    picture(indoor,"hollow",-2.52,2.97,-1.37,.63,.70);bake(indoor,room);
    return {outdoor,indoor,coast};
  }

  function makeViewport(T,host,handlers) {
    const renderer = new T.WebGLRenderer({alpha:false,antialias:true,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.65));
    renderer.outputColorSpace=T.SRGBColorSpace;
    // The little buildings and lights are stationary. Refresh the shadow texture only on a room switch.
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
    const canvas=renderer.domElement;canvas.className="li-canvas";canvas.tabIndex=0;
    canvas.setAttribute("role","group");canvas.setAttribute("aria-label","Walk on the 3D island. Use the arrow keys or W A S D to walk, Q and E to orbit, plus and minus to zoom.");
    host.prepend(canvas);
    const K=kit(T), scene=new T.Scene(), camera=new T.PerspectiveCamera(35,1,.1,180);
    scene.background=new T.Color("#243d50");scene.fog=new T.FogExp2("#426070",.008);
    const hemisphere=new T.HemisphereLight("#cbdff0","#7c8797",1.10);scene.add(hemisphere);
    const sun=new T.DirectionalLight("#ffdda9",2.06);sun.position.set(-10,15,9);sun.castShadow=true;
    sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-14,right:14,top:12,bottom:-12,near:.5,far:48});
    sun.shadow.camera.updateProjectionMatrix();sun.shadow.bias=-.0008;sun.shadow.normalBias=.035;scene.add(sun);
    const moon=new T.DirectionalLight("#9abdda",.91);moon.position.set(9,7,-9);scene.add(moon);
    const world=buildWorld(T,K);scene.add(world.outdoor,world.indoor);
    const lampCanvas=document.createElement("canvas");lampCanvas.width=lampCanvas.height=64;
    const ctx=lampCanvas.getContext("2d"),halo=ctx.createRadialGradient(32,32,0,32,32,32);
    halo.addColorStop(0,"rgba(255,241,175,.88)");halo.addColorStop(.19,"rgba(255,202,98,.43)");
    halo.addColorStop(.52,"rgba(246,159,60,.14)");halo.addColorStop(1,"rgba(242,143,45,0)");
    ctx.fillStyle=halo;ctx.fillRect(0,0,64,64);const glowTex=new T.CanvasTexture(lampCanvas);glowTex.colorSpace=T.SRGBColorSpace;K.textures.add(glowTex);
    const glowMat=new T.SpriteMaterial({map:glowTex,color:0xffdd9c,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.8});
    K.materials.add(glowMat);const glows=[];
    function glow(root,x,y,z,scale,id){
      const s=new T.Sprite(glowMat);s.position.set(x,y,z);s.scale.set(scale,scale,1);root.add(s);
      if(id)glows.push([s,scale,id]);
    }
    for(const [id,x,y,z,r] of [
      ["canopy",.68,2.29,1.045,.98],["canopy",.01,2.29,1.045,.86],["canopy",-1.45,1.14,.85,.82],
      ["bakery",.42,1.15,1.04,1.13],["bakery",1.55,1.20,.82,.9],
      ["stage",-1.2,2.23,-.52,1.13],["stage",1.2,2.23,-.52,1.13],
      ["castle",-.6,1.48,.86,1],["castle",.60,1.47,.86,1],["castle",1.46,1.76,.1,.87],
      ["picnic",1.26,1.14,.27,.86],["parade",0,1.45,.18,.64]]){
      const [px,pz]=sites[id].pos;glow(world.outdoor,px+x,topY(px,pz)+y,pz+z,r,id);
    }
    for(const [x,z] of [[-5.1,-.82],[-3.76,2.42],[1.43,-1.8],[4.3,3.11],[1.3,4.8]])glow(world.outdoor,x,topY(x,z)+.92,z,.72);
    for(const [x,y,z] of [[-2.82,1.16,-.40],[2.62,3.31,-.75],[-.2,1.15,-1.55]])glow(world.indoor,x,y,z,1.03,"hollow");
    glow(world.indoor,-1.50,3.11,-1.86,1.5,"hollow");
    const waterMat=new T.ShaderMaterial({
      uniforms:{uTime:{value:0}},
      vertexShader:'varying vec3 point;void main(){point=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(point,1.);}',
      fragmentShader:`varying vec3 point;uniform float uTime;
        float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.54);}
        void main(){vec2 p=point.xz;float r=length(p/vec2(11.,7.));float shoal=1.-smoothstep(.90,1.45,r);
        vec3 water=mix(vec3(.009,.045,.082),vec3(.018,.162,.173),shoal);
        float swell=.5+.5*sin(p.x*.32+p.y*.71+sin(p.y*.31)+uTime*.22);
        water+=swell*vec3(.003,.013,.017);
        vec2 cells=vec2(p.x*1.09+p.y*.52+uTime*.09,p.y*2.6+sin(p.x*.7)*.22);
        vec2 id=floor(cells),q=fract(cells)-.5;
        float wave=(1.-smoothstep(.04,.13,abs(q.y-.14*sin(q.x*4.))))*(1.-smoothstep(.16,.47,abs(q.x)))*step(.77,h(id));
        water+=wave*vec3(.024,.056,.060);
        gl_FragColor=vec4(water,1.);
        #include <colorspace_fragment>
        }`
    });
    const waterGeo=new T.PlaneGeometry(230,230),water=new T.Mesh(waterGeo,waterMat);
    water.rotation.x=-Math.PI/2;water.position.y=-.65;world.outdoor.add(water);
    K.materials.add(waterMat);K.generated.add(waterGeo);
    // Short strokes at the irregular shore read as breakers without obscuring the beach.
    const foamSource=K.g(), foamGroup=K.g();world.outdoor.add(foamGroup);
    for(let i=0;i<world.coast.length;i++){
      const a=world.coast[i],b=world.coast[(i+1)%world.coast.length],f=1.061+.015*Math.sin(i*1.94);
      if(i%4!==1)K.beam(foamSource,[a[0]*f,-.603,a[1]*f],[(a[0]*.19+b[0]*.81)*f,-.603,(a[1]*.19+b[1]*.81)*f],.025+(i%3)*.008,"#84aba0",4);
    }
    for(let i=0;i<18;i++){
      const t=i*2.399,r=16+(i%4)*2.4,x=Math.cos(t)*r,z=Math.sin(t)*r*.82,s=.36+(i%3)*.23;
      K.ball(foamSource,x,-.67,z,s*1.05,s*.77,s*.72,i%3?"#6e8380":"#86908a");
      if(i%3===0)K.ball(foamSource,x+.67,-.71,z+.27,.41,.38,.34,"#7c8f88");
    }
    K.bake(foamGroup,foamSource);
    const traveler=new T.Group(), body=new T.Group();traveler.add(body);scene.add(traveler);
    const doll=K.g();
    K.tube(doll,0,.33,0,.18,.31,.52,"#3e8385",9);
    K.ball(doll,0,.74,0,.245,.253,.215,"#e8b987");
    K.tube(doll,0,.945,-.015,.055,.285,.33,"#d68952",8);
    K.tube(doll,0,.82,0,.31,.32,.09,"#a86447",9);
    K.ball(doll,0,1.105,-.018,.066,.07,.066,"#f9cf78");
    for(const a of [-1,1]){K.ball(doll,a*.089,.746,.197,.025,.028,.021,"#443e3a");K.ball(doll,a*.125,.085,.07,.096,.11,.14,"#584e43");}
    K.box(doll,.28,.34,.16,.19,.24,.17,"#ffd57b",true);K.box(doll,.28,.49,.16,.22,.05,.19,"#8e6e45");
    K.bake(body,doll);body.traverse(piece=>{if(piece.isMesh)piece.castShadow=false;});traveler.scale.setScalar(.92);
    const shadowGeo=new T.CircleGeometry(.38,16), shadowMat=new T.MeshBasicMaterial({color:0x183b3c,opacity:.34,transparent:true,depthWrite:false});
    K.materials.add(shadowMat);K.generated.add(shadowGeo);const shadow=new T.Mesh(shadowGeo,shadowMat);shadow.rotation.x=-Math.PI/2;traveler.add(shadow);shadow.position.y=.011;
    const specks=[], fireGeo=new T.BufferGeometry();
    for(let i=0;i<30;i++)specks.push(Math.sin(i*2.236)*8.8,.8+Math.cos(i*1.93)*.33,Math.cos(i*2.68)*5.8);
    fireGeo.setAttribute("position",new T.Float32BufferAttribute(specks,3));
    const fireMat=new T.PointsMaterial({color:0xf7c76b,size:.083,transparent:true,opacity:.85,depthWrite:false});
    const fire=new T.Points(fireGeo,fireMat);world.outdoor.add(fire);K.materials.add(fireMat);K.generated.add(fireGeo);

    let inside=false, destroyed=false, paused=false, ready=false, frameId=0, lastTime=0;
    let yaw=.13, pitch=.68, zoom=1, targetX=0,targetY=.45,targetZ=0,w=1,h=1,t=0;
    let route=[],onArrival=null,selected=null,lastMark="",pointerMode=null, moving=false;
    const pointers=new Map(), keys=new Set(), temp=new T.Vector3(), point=new T.Vector2(),ray=new T.Raycaster();
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
    const ground=(x,z)=>inside ? .115 : topY(x,z)+.074;
    // The front door and ladder are directly touchable parts of their models.
    const portalMat=new T.MeshBasicMaterial({side:T.DoubleSide});K.materials.add(portalMat);
    function portalSurface(x,y,z,w,h,tilt){
      const geo=new T.PlaneGeometry(w,h);K.generated.add(geo);const surface=new T.Mesh(geo,portalMat);
      surface.position.set(x,y,z);surface.rotation.x=tilt;surface.updateMatrixWorld();return surface;
    }
    const housePos=sites.canopy.pos;
    const exteriorDoor=portalSurface(housePos[0]-.72,topY(...housePos)+1.94,housePos[1]+1.11,.54,1.16,0);
    const interiorLadder=portalSurface(1.4,1.26,1.13,1,2.53,-.46);
    function stopWalk(){route=[];onArrival=null;moving=false;}
    function setPos(x,z){traveler.position.set(x,ground(x,z),z);}
    function selectView(isInside){
      inside=isInside;world.outdoor.visible=!inside;world.indoor.visible=inside;
      scene.background.set(inside?"#263a41":"#243d50");scene.fog.density=inside ? .014 : .008;
      renderer.shadowMap.needsUpdate=true;
      stopWalk();keys.clear();yaw=inside ? .12 : .13;pitch=inside ? .39 : .68;zoom=1;
      targetX=0;targetY=inside?1.73:.45;targetZ=inside?-.18:0;
      lastMark="";if(inside)setPos(-.34,1.83);
    }
    const terrainPlane=new T.Plane(new T.Vector3(0,1,0),-.21);
    function roomId(){return inside?"hollow":null;}
    function activate(id,instant=false){
      selected=id;
      if(id==="hollow"){selectView(true);handlers.arrived(id);return;}
      const leftRoom=inside;if(inside)selectView(false);
      if(leftRoom)setPos(...sites.canopy.arrival);
      if(!sites[id]?.arrival)return;
      const at=sites[id].arrival;
      if(instant||dist(at,[traveler.position.x,traveler.position.z])<.14){stopWalk();setPos(...at);handlers.arrived(id);return;}
      route=pathBetween([traveler.position.x,traveler.position.z],at);onArrival=()=>handlers.arrived(id);
    }
    function walkPoint(x,z){
      const pos=[traveler.position.x,traveler.position.z];
      if(inside){
        if(Math.hypot(x/3.5,z/3.2)>1.05)return;
        route=[[clamp(x,-3,3),clamp(z,.15,2.64)]];
      }else{
        // Travel along the island's walked-in trails, even when the tap is between two paths.
        let end=null,min=Infinity;
        for(const [i,j] of edges){const a=nav[i],b=nav[j],dx=b[0]-a[0],dz=b[1]-a[1];
          const f=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1),p=[a[0]+dx*f,a[1]+dz*f],d=dist([x,z],p);
          if(d<min){min=d;end=p;}
        }
        if(min>2.7)return;
        const close=stops.find(id=>dist(sites[id].arrival,end)<.75);if(close){handlers.choose(close);return;}
        route=pathBetween(pos,end);
      }
      onArrival=null;handlers.roaming(inside);
    }
    function tap(clientX,clientY){
      const bounds=canvas.getBoundingClientRect();point.set((clientX-bounds.left)/bounds.width*2-1,-(clientY-bounds.top)/bounds.height*2+1);ray.setFromCamera(point,camera);
      const active=inside?world.indoor:world.outdoor;
      const hit=ray.intersectObjects(active.children.filter(c=>c.isMesh && c!==water),false)[0];
      const portal=ray.intersectObject(inside?interiorLadder:exteriorDoor,false)[0];
      if(portal&&(!hit||portal.distance<hit.distance+.18)){
        if(inside){handlers.choose("canopy");return;}
        if(dist([traveler.position.x,traveler.position.z],sites.canopy.arrival)<.9){handlers.choose("hollow");return;}
      }
      if(!inside && hit?.object.userData.place){handlers.choose(hit.object.userData.place);return;}
      const q=new T.Vector3();terrainPlane.constant=inside?-.14:-.22;
      if(ray.ray.intersectPlane(terrainPlane,q))walkPoint(q.x,q.z);
    }
    function stepZoom(scale){zoom=clamp(zoom*scale,.66,2.05);}
    function reset(){yaw=inside ? .12 : .13;pitch=inside ? .39 : .68;zoom=1;targetX=0;targetZ=inside?-.18:0;}
    function orbit(ax,ay){yaw-=ax*.008;pitch=clamp(pitch+ay*.006,inside ? .16 : .31,inside ? .73 : 1.07);if(inside)yaw=clamp(yaw,-.92,.92);}
    const listeners=[];
    function listen(el,event,fn,opt){el.addEventListener(event,fn,opt);listeners.push(()=>el.removeEventListener(event,fn,opt));}
    function gap(){const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y);}
    listen(canvas,"pointerdown",e=>{
      if(e.button!==0&&e.pointerType==="mouse")return;
      canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY});
      pointerMode=pointers.size>1?{pinch:gap(),dragged:true}:{dragged:false};
    });
    listen(canvas,"pointermove",e=>{
      const v=pointers.get(e.pointerId);if(!v||!pointerMode)return;
      const dx=e.clientX-v.x,dy=e.clientY-v.y;v.x=e.clientX;v.y=e.clientY;
      if(pointers.size>=2){const distance=gap();if(pointerMode.pinch>1)stepZoom(distance/pointerMode.pinch);pointerMode.pinch=distance;pointerMode.dragged=true;return;}
      if(Math.hypot(v.x-v.sx,v.y-v.sy)>5)pointerMode.dragged=true;
      if(pointerMode.dragged)orbit(dx,dy);
    });
    const endPointer=(e,cancel)=>{
      if(!pointers.has(e.pointerId))return;
      if(!cancel&&!pointerMode?.dragged&&pointers.size===1)tap(e.clientX,e.clientY);
      pointers.delete(e.pointerId);pointerMode=pointers.size?{dragged:true}:null;
    };
    listen(canvas,"pointerup",e=>endPointer(e,false));listen(canvas,"pointercancel",e=>endPointer(e,true));
    listen(canvas,"wheel",e=>{e.preventDefault();stepZoom(Math.exp(-clamp(e.deltaY,-160,160)*.0015));},{passive:false});
    const moveKeys=["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"];
    listen(canvas,"keydown",e=>{
      const k=e.key.toLowerCase();if(moveKeys.includes(k)){e.preventDefault();if(!keys.has(k)){stopWalk();handlers.roaming(inside);}keys.add(k);}
      else if(k==="q"||k==="e"){e.preventDefault();orbit(k==="q"?13:-13,0);}
      else if(k==="+"||k==="="||k==="-"){e.preventDefault();stepZoom(k==="-"?1/1.16:1.16);}
      else if(k==="home"){e.preventDefault();reset();}
      else if(k==="enter"){e.preventDefault();if(!e.repeat)handlers.enter();}
    });
    listen(canvas,"keyup",e=>keys.delete(e.key.toLowerCase()));listen(canvas,"blur",()=>keys.clear());
    function keyboard(dt){
      let dx=Number(keys.has("d")||keys.has("arrowright"))-Number(keys.has("a")||keys.has("arrowleft"));
      let dz=Number(keys.has("s")||keys.has("arrowdown"))-Number(keys.has("w")||keys.has("arrowup"));if(!(dx||dz))return false;
      const heading=Math.hypot(dx,dz),x=(dx*Math.cos(yaw)+dz*Math.sin(yaw))/heading,z=(-dx*Math.sin(yaw)+dz*Math.cos(yaw))/heading;
      const nx=traveler.position.x+x*dt*3.85,nz=traveler.position.z+z*dt*3.85;
      const allowed=inside ? Math.hypot(nx/3.55,nz/3.32)<.99&&nz>=.13 :
        (Math.hypot(nx/10.25,nz/6.25)<1||dist([nx,nz],sites.reef.arrival)<1.0);
      if(allowed){setPos(nx,nz);traveler.rotation.y=Math.atan2(x,z);}
      if(!inside){const near=stops.find(id=>dist([nx,nz],sites[id].arrival)<.88);
        if(near){selected=near;handlers.nearby(near);}else handlers.roaming(false);}
      return true;
    }
    function move(dt){
      if(keys.size) return keyboard(dt);
      if(!route.length)return false;
      const [x,z]=route[0],dx=x-traveler.position.x,dz=z-traveler.position.z,len=Math.hypot(dx,dz),d=dt*(inside?3.4:7.4);
      if(len<=d){setPos(x,z);route.shift();if(!route.length&&onArrival){const cb=onArrival;onArrival=null;cb();}}
      else {setPos(traveler.position.x+dx/len*d,traveler.position.z+dz/len*d);traveler.rotation.y=Math.atan2(dx,dz);}
      return true;
    }
    function resize(){
      const rect=host.getBoundingClientRect();if(rect.width<3||rect.height<3)return;
      w=rect.width;h=rect.height;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();ready=true;
    }
    function render(now){
      if(destroyed)return;frameId=requestAnimationFrame(render);const dt=lastTime?Math.min(.055,(now-lastTime)/1000):.016;lastTime=now;
      if(paused||document.hidden||!ready)return;t+=dt;moving=move(dt);
      body.position.y=moving&&!reduced.matches ? .065*Math.abs(Math.sin(t*16)) : 0;
      waterMat.uniforms.uTime.value=reduced.matches?0:t;fire.position.y=reduced.matches?0:Math.sin(t*.71)*.10;
      const eyeDist=inside?Math.max(12.6,14.65/camera.aspect)/zoom:Math.max(24,38.9/camera.aspect)/zoom;
      // Zoom toward the traveler; all eight landmarks fit again at the home distance.
      const follow=inside?0:clamp((zoom-1)*.50,0,.51);
      const target=new T.Vector3(targetX+traveler.position.x*follow,targetY,targetZ+traveler.position.z*follow);
      camera.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*eyeDist,target.y+Math.sin(pitch)*eyeDist,target.z+Math.cos(yaw)*Math.cos(pitch)*eyeDist);
      camera.lookAt(target);camera.updateMatrixWorld();renderer.render(scene,camera);
      const state=[w,h,inside,Math.round(yaw*800),Math.round(pitch*800),Math.round(zoom*800),Math.round(target.x*40),Math.round(target.z*40)].join("|");
      if(state!==lastMark){
        lastMark=state;const coordinates={};
        if(!inside)for(const id of stops){const s=sites[id],p=s.pos;
          temp.set(p[0],topY(...p)+s.label,p[1]).project(camera);
          coordinates[id]=[(temp.x*.5+.5)*w,(-temp.y*.5+.5)*h,temp.z>=-1&&temp.z<1];
        }handlers.project(coordinates,inside,w,h,yaw);
      }
    }
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    const visibility=new IntersectionObserver(e=>{paused=!e[0].isIntersecting;if(!paused){resize();lastTime=0;}},{rootMargin:"100px"});visibility.observe(host);
    listen(canvas,"webglcontextlost",e=>{e.preventDefault();handlers.lost();});
    selectView(false);setPos(...nav[9]);frameId=requestAnimationFrame(render);
    return {activate,reset,stepZoom,roomId,focus:()=>canvas.focus({preventScroll:true}),updateLights(complete){
      for(const [sprite,size,id] of glows){const scale=size*(complete(id)?1.60:1);sprite.scale.set(scale,scale,1);}
    },destroy(){
      destroyed=true;cancelAnimationFrame(frameId);observer.disconnect();visibility.disconnect();listeners.forEach(f=>f());K.dispose();sun.shadow.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();
    }};
  }

  function mount(container,{onEnter,onArrive,completed=()=>false,initialId="canopy"}){
    const uid="li-"+(++serial);
    let selected=sites[initialId]?initialId:"canopy", state="loading", mode="loading", view=null,dead=false;
    const root=document.createElement("section");root.className="li-world";root.setAttribute("aria-label","Explore Lantern Island");
    root.innerHTML=`<div class="li-viewport">
      <div class="li-map-layer" aria-label="Island landmarks"></div>
      <div class="li-fallback" hidden><span>Pick a destination to explore its puzzle.</span></div>
      <div class="li-maptools">
        <label class="li-place-select">${ico("map")}<span class="li-sr">Travel to a landmark</span><select aria-label="Travel to a landmark"></select></label>
        <div class="li-zoom"><button type="button" data-map-tool="minus" aria-label="Zoom out" title="Zoom out">${ico("minus")}</button><button type="button" data-map-tool="plus" aria-label="Zoom in" title="Zoom in">${ico("plus")}</button><button type="button" data-map-tool="north" aria-label="Reset island view" title="Reset island view">${ico("north")}</button></div>
      </div>
      <button class="li-help-toggle" type="button" aria-label="Island controls" aria-controls="${uid}-help" aria-expanded="false" title="Island controls">${ico("help")}</button>
      <div id="${uid}-help" class="li-help" hidden><strong>Island controls</strong><p>Choose a landmark or tap a trail to walk. Drag to orbit. Pinch or scroll to zoom.</p><p>With the island focused, use WASD or the arrow keys to walk, Q and E to orbit, and Enter to play.</p></div>
      <span class="li-compass" aria-hidden="true"><i>▲</i>N</span>
    </div>
    <div class="li-dock">
      <img class="li-thumb" alt="">
      <div class="li-place-note"><strong></strong><span role="status" aria-live="polite"></span></div>
      <div class="li-actions"><button type="button" class="li-door" hidden></button><button type="button" class="li-enter">${ico("play")}<span>Play puzzle</span></button></div>
    </div>`;
    container.replaceChildren(root);
    const find=s=>root.querySelector(s),host=find(".li-viewport"), layer=find(".li-map-layer"),select=find("select");
    const title=find(".li-place-note strong"),status=find(".li-place-note span"),thumb=find(".li-thumb"),door=find(".li-door"),enterBtn=find(".li-enter");
    const help=find(".li-help-toggle"),info=find(".li-help");
    const menu=document.createElement("option");menu.value="";menu.textContent="Travel to…";menu.disabled=true;select.append(menu);
    for(const [id,s] of Object.entries(sites)){const opt=document.createElement("option");opt.value=id;opt.textContent=s.name;select.append(opt);}
    const pins=new Map();
    for(const id of stops){
      const button=document.createElement("button");button.type="button";button.className="li-pin";
      const name=id==="canopy"?"Forest Treehouse":sites[id].name;
      button.innerHTML=ico("light")+"<span>"+name+"</span>";button.setAttribute("aria-label","Walk to "+name);button.title=name;
      button.addEventListener("click",()=>focusPlace(id));layer.append(button);pins.set(id,button);
    }
    function markComplete(id){try{return !!completed(id);}catch{return false;}}
    function update(){
      view?.updateLights(markComplete);
      pins.forEach((b,id)=>{
        b.classList.toggle("li-sealed",markComplete(id)&&(id!=="canopy"||markComplete("hollow")));
        b.classList.toggle("li-chosen",selected===id&&state!=="roaming");b.setAttribute("aria-pressed",String(selected===id&&state!=="roaming"));
      });
      for(const opt of select.options)if(opt.value)opt.textContent=sites[opt.value].name+(markComplete(opt.value)?" ✓":"");
    }
    function paint(){
      select.value=state==="roaming"?"":selected;
      title.textContent=state==="roaming"?"On the island trail":sites[selected].name;
      if(thumb.dataset.place!==selected){thumb.src=file("assets/art/"+selected+".webp");thumb.dataset.place=selected;}
      let message=state==="loading"?"Opening the island…":state==="moving"?"Your traveler is on the way…":state==="roaming"?"Walk up to a landmark or choose one above.":selected==="hollow"?"Inside the treehouse · Sleeping loft":"Ready to play";
      if(state==="arrived"&&markComplete(selected))message=selected==="hollow"?"Inside the treehouse · Puzzle complete":"Lantern lit · Play again";
      if(status.textContent!==message)status.textContent=message;
      enterBtn.disabled=state!=="arrived";
      const hasDoor=state==="arrived"&&(selected==="canopy"||selected==="hollow");
      door.hidden=!hasDoor;
      if(hasDoor)door.innerHTML=ico("door")+"<span>"+(selected==="canopy"?"Go inside":"Exit treehouse")+"</span>";
      root.classList.toggle("li-inside",selected==="hollow");update();
    }
    function arrive(id){if(dead)return;selected=id;state="arrived";paint();onArrive?.(id);}
    function focusPlace(id){
      if(dead||!sites[id])return false;
      const leavingRoom=selected==="hollow";selected=id;
      if(mode==="fallback"){arrive(id);return true;}
      state=mode==="loading"?"loading":"moving";paint();
      if(view)view.activate(id,leavingRoom&&id==="canopy");
      return true;
    }
    function enter(){
      if(dead||state!=="arrived"||!sites[selected])return false;
      onEnter?.(selected);return true;
    }
    select.addEventListener("change",()=>focusPlace(select.value));door.addEventListener("click",()=>focusPlace(selected==="hollow"?"canopy":"hollow"));
    enterBtn.addEventListener("click",enter);
    function helpOpen(open){info.hidden=!open;help.setAttribute("aria-expanded",String(open));}
    help.addEventListener("click",()=>helpOpen(info.hidden));
    root.addEventListener("keydown",e=>{if(e.key==="Escape"&&!info.hidden){helpOpen(false);help.focus();}});
    for(const b of root.querySelectorAll("[data-map-tool]"))b.addEventListener("click",()=>{
      if(!view)return;const tool=b.dataset.mapTool;if(tool==="north")view.reset();else view.stepZoom(tool==="plus"?1.20:1/1.20);
    });
    function fallback(){
      if(dead)return;mode="fallback";root.classList.add("li-no-webgl");find(".li-fallback").hidden=false;
      if(view){const stale=view;view=null;stale.destroy();}host.querySelector("canvas")?.remove();
      for(const b of root.querySelectorAll("[data-map-tool]"))b.disabled=true;
      arrive(selected);
    }
    function project(points,inside,width,height,yaw){
      if(dead)return;layer.hidden=inside;
      const crowded=width<590;
      for(const [id,b] of pins){
        const pos=points[id];const visible=pos?.[2]&&pos[0]>5&&pos[0]<width-5&&pos[1]>12&&pos[1]<height-4;
        b.hidden=!visible;
        if(visible){b.style.left=pos[0]+"px";b.style.top=pos[1]+"px";b.classList.toggle("li-tight",crowded);}
      }
      find(".li-compass i").style.transform="rotate("+(-yaw)+"rad)";
    }
    const handlers={choose:focusPlace,enter,arrived:arrive,project,lost:fallback,
      roaming(inRoom){
        if(inRoom||state==="roaming")return;state="roaming";paint();
      },
      nearby(id){if(state!=="arrived"||selected!==id)arrive(id);}
    };
    paint();
    import(file("assets/three/three-0.160.0.module.min.js")).then(T=>{
      if(dead)return;
      try{view=makeViewport(T,host,handlers);mode="webgl";root.classList.add("li-interactive");view.activate(selected,true);}
      catch{fallback();}
    }).catch(fallback);
    return {focusPlace,enter,update:()=>{if(!dead)paint();},destroy(){if(dead)return;dead=true;view?.destroy();root.remove();}};
  }
  window.LanternIsland=Object.freeze({mount});
})();
