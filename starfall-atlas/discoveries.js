(function buildSecretAtlas(){
"use strict";
// Coordinates are percentages of the illustrated scene. On phones the camp uses a taller crop.
const sites=[
 ["psyduck",0,"camp",[63,70,39,42],"水边的三趾印","Three-toed tracks","营地风景里，找一串湿脚印。","Look for wet tracks in the camp landscape."],
 ["wallnut",0,"workshop",[],"磕碰的硬壳","A scuffed shell","进积木温室，看看零件盒边上。","Enter the greenhouse and inspect the rim of the parts tray."],
 ["space-signal",1,"camp",[61,31,40,26],"断续的蓝光","A blinking blue signal","营地上方有盏蓝灯，正在发信号。","Watch for a small blue signal above camp."],
 ["lapras",1,"map",[15,47,16,46],"潮汐里的歌","An ebb-tide song","翻开群岛航图，看看月潮湾左下方的云海。","On the world map, look in the cloud sea below and left of Moonwater."],
 ["brick-duck",2,"camp",[70,72,44,43],"崖边的黄砖","A yellow brick","风铃峡营地的崖边落下了一块黄砖。","A yellow brick lies at the edge of the Bellwind camp."],
 ["redstone",2,"trail",[79,63,85,37],"发亮的红粉","A red dust trail","打开本岛的遗迹推石路线，留意入口画面上的红粉。","Open this island’s Ruin Trails route. Look for red dust in the entrance picture."],
 ["enderman",3,"camp",[58,56,29,36],"紫晶间的微光","Violet glimmers","营地的晶洞深处，有两点紫光。","Look into the dark part of the camp cavern for two violet glimmers."],
 ["gengar",3,"field",[45,33,45,33],"慢半拍的影子","The lingering shadow","从伙伴手记进入紫晶洞的实地调查，观察洞顶的阴影。","Open the Amethyst Hollow habitat investigation from the journal and scan the cavern ceiling."],
 ["bulbasaur",4,"camp",[69,74,50,43],"向光的叶子","A sun-seeking leaf","营地的蕨叶间，有片小叶子在转。","Look among the ferns in camp for a little turning leaf."],
 ["plantern",4,"workshop",[],"雾里的灯芯","A wick in the mist","打开这一岛的积木温室，看看零件盒上亮着什么。","Enter this island’s greenhouse and look for a light on the parts tray."],
 ["build-hat",5,"camp",[68,75,45,45],"搁在炉边的帽子","The forge-side hard hat","炉边有顶落下的帽子，在营地风景里找找。","In the camp landscape, look near the forge for a fallen hard hat."],
 ["kernel",5,"prism",[78,61,85,31],"金黄的小方块","A golden little cube","翻开这座岛的棱镜光路，在入口图里找一小块金黄。","Open the island’s Prism Circuit route and look for a golden fleck in the entrance picture."],
 ["snow-golem",6,"camp",[63,72,40,44],"雪地里的纽扣","Buttons in the snow","营地雪地上，两颗黑纽扣排成一列。","Two dark buttons make a line in the snow at camp."],
 ["snowpea",6,"weave",[81,60,86,35],"绣框上的霜花","Frost on the loom","星纹绘卷的路线入口结了一小片霜。","A patch of frost has formed on the Star Weave route entrance."],
 ["moon-rover",7,"camp",[68,72,45,43],"观星台的车辙","Treads on the terrace","营地的观星台上，多了两道平行的车辙。","Two parallel tracks cross the observatory terrace at camp."],
 ["end-dragon",7,"map",[91,71,91,78],"盘旋的黑影","A circling shadow","群岛航图上，星落之冠南边的云层有个黑影。","On the world map, a shadow circles south of Starfall Crown."]
];
const worlds=[
 {name:["宝可梦","Pokémon"],ids:["psyduck","lapras","gengar","bulbasaur"]},
 {name:["乐高","LEGO"],ids:["space-signal","brick-duck","build-hat","moon-rover"]},
 {name:["我的世界","Minecraft"],ids:["redstone","enderman","snow-golem","end-dragon"]},
 {name:["植物大战僵尸","Plants vs. Zombies"],ids:["wallnut","plantern","kernel","snowpea"]}
];
const locations=sites.map(([id,region,surface,coords,zh,en,hintZh,hintEn])=>({
 id,region,surface,coords,title:[zh,en],hint:[hintZh,hintEn],world:worlds.find(world=>world.ids.includes(id))
}));
const byId=new Map(locations.map(site=>[site.id,site]));
const campaignId=id=>byId.get(id);
const episode=id=>Object.hasOwn(window.StarfallSecrets||{},id)?window.StarfallSecrets[id]:null;
const breadth=found=>worlds.filter(world=>world.ids.some(id=>found.includes(id))).length;
function restore(value,frontier){
 if(!Array.isArray(value)) return [];
 return [...new Set(value.filter(id=>byId.has(id)&&byId.get(id).region<=frontier))];
}
// Game-world props are drawn as tiny footprints, discarded objects or glows, each with a generous hit target.
const shapes={
 "psyduck":'<g fill="#d2af62" stroke="#473d28" stroke-width="1.2"><path d="m3 33 2-9 4 2 4-5 2 10-4 5z"/><path d="m19 23 1-9 4 3 5-4 1 9-6 4z"/><path d="m29 12 1-8 4 2 4-3v8l-5 3z"/></g>',
 "wallnut":'<path fill="#af7540" stroke="#e9c48d" stroke-width="2" d="M11 34C4 24 10 7 18 7q3-5 7 0c11 2 14 20 4 28z"/><path d="m20 11-3 6 5 4-4 6" fill="none" stroke="#65432b" stroke-width="2"/>',
 "space-signal":'<path d="m12 28 8-9 7 8-6 7z" fill="#58a1c9"/><path d="M25 16q6 1 8 8m-7-14q11 2 14 13" fill="none" stroke="#a8eaff" stroke-width="2.3"/><circle cx="21" cy="20" r="3.3" fill="#fff0a8"/>',
 "lapras":'<g fill="none" stroke="#b3e4f0" stroke-width="1.7"><path d="M4 26q6-4 12 0t12 0 11 0M7 33q5-3 9 0t10 0 10 0M20 18V9l9-2v8"/><ellipse cx="17" cy="18" rx="3" ry="2" fill="#dfd1a3"/><ellipse cx="26" cy="15" rx="3" ry="2" fill="#dfd1a3"/></g>',
 "brick-duck":'<path fill="#f3bd36" stroke="#614321" stroke-width="1.5" d="m4 20 19-6 13 5-18 7zm0 0 14 6v10L4 30zm14 6 18-7v10l-18 7z"/><g fill="#ffdc58" stroke="#ac7f31" stroke-width="1.3"><ellipse cx="14" cy="19" rx="4" ry="2.3"/><ellipse cx="23" cy="16.5" rx="4" ry="2.3"/></g>',
 "redstone":'<path d="M4 30h8v-7h8v-6h8v-7h8" fill="none" stroke="#742b32" stroke-width="6"/><path d="M4 29h8v-7h8v-6h8v-7h8" fill="none" stroke="#ff7750" stroke-width="2.5"/>',
 "enderman":'<path fill="#34203f" d="M3 11h35v18H3z"/><path fill="#cd79ff" d="M6 19h11v5H6zm18 0h11v5H24z"/><path fill="#fff2fe" d="M12 19h4v5h-4zm13 0h4v5h-4z"/>',
 "gengar":'<path fill="#594178" stroke="#c39cda" stroke-width="1.2" d="m4 31 7-11-2-8 9 5 8-7 2 9 9 4-6 11-8-2-9 2z"/><path d="m13 24 6 2m5-1 5-3" stroke="#ebc5d9" stroke-width="1.6"/>',
 "bulbasaur":'<path d="M19 34c1-5 2-8 3-13" fill="none" stroke="#d5df84" stroke-width="3"/><path d="M21 26C8 26 7 14 7 10c12 1 17 6 14 16z" fill="#75b56a" stroke="#cae598"/><path d="M21 24C20 12 31 8 36 7c1 11-5 17-15 17z" fill="#8cc990" stroke="#ddf0a4"/>',
 "plantern":'<path d="M14 12q6-17 13 0m-15 2h17l-2 17H14z" fill="#304a43" stroke="#a3c799" stroke-width="2"/><path d="m17 18 8-1-1 10h-6z" fill="#fff1a4"/><path d="M11 32h18" stroke="#768f66" stroke-width="2"/>',
 "build-hat":'<path fill="#f3b73d" stroke="#7c4925" stroke-width="1.8" d="M5 28h3c0-12 5-17 14-17s12 8 12 15l4 2v4H5z"/><path d="M18 10h5v15h-5z" fill="#ffcf60"/>',
 "kernel":'<path fill="#f5cd67" stroke="#8e6e3b" stroke-width="1.4" d="m8 16 15-5 11 6-15 6zm0 0 11 7v11L8 28zm11 7 15-6v11l-15 6z"/>',
 "snow-golem":'<g fill="#28323a" stroke="#c7dce5" stroke-width="1.3"><rect x="15" y="7" width="8" height="8"/><rect x="20" y="23" width="8" height="8"/></g><path d="m28 12 7-4m-23 20-7-4" stroke="#a68558" stroke-width="2"/>',
 "snowpea":'<g fill="none" stroke="#d0f8ff" stroke-width="2"><path d="M20 3v34M5 11l30 18M5 29l30-18M15 6l5 5 5-5m-10 28 5-5 5 5M4 17l7-2-2-7m23 24-2-7 7-2"/></g>',
 "moon-rover":'<g fill="none" stroke="#d8c99c" stroke-width="3" stroke-dasharray="3 3"><path d="M7 35Q20 22 18 7M20 37Q35 22 30 7"/></g>',
 "end-dragon":'<path d="m2 8 12 7 4 6 4-2 3-9 5-7-1 12 10-5-6 11-8 4-3 9-5 3 2-9-9-5-4-8 8 3z" fill="#3d3158" stroke="#c4a6de" stroke-width="1.5"/>'
};
function marker(site,lang,found){
 const e=episode(site.id);
 if(!e) return null;
 const ix=lang==="en"?1:0,button=document.createElement("button");
 button.type="button";
 button.className="secret-trace trace-"+site.surface+(found.includes(site.id)?" traced":"");
 button.dataset.sf="trace";button.dataset.secret=site.id;
 button.setAttribute("aria-label",site.title[ix]);button.title=site.title[ix];
 const [x,y,mx,my]=site.coords;
 if(x!==undefined) for(const [k,v] of [["x",x],["y",y],["mx",mx],["my",my]])button.style.setProperty("--trace-"+k,v+"%");
 button.innerHTML=`<svg viewBox="0 0 42 42" aria-hidden="true">${shapes[site.id]}</svg>`;
 return button;
}
function addToSurface(parent,surface,region,lang,found){
 const site=locations.find(item=>item.region===region&&item.surface===surface);
 if(!site)return null;
 const el=marker(site,lang,found);
 if(el)parent.append(el);
 return el;
}
function decorate(root,{view,region,route,frontier,lang,found}){
 if(view==="map"){
   const chart=root.querySelector(".chart");
   for(const site of locations.filter(item=>item.surface==="map"&&item.region<=frontier)){
     const trace=marker(site,lang,found);
     if(trace)chart.append(trace);
   }
   return;
 }
 const target=view==="home"?".hero-inner":view==="route"?".route-hero":null;
 if(target)addToSurface(root.querySelector(target),view==="home"?"camp":route,region,lang,found);
}
// A Blob URL can be downloaded on both localhost and a double-clicked file.
// Read the illustrated card only when someone actually opens that side of the letter.
const postcards=new Map();
window.StarfallPostcardPixels=Object.create(null);
function postcardUrl(side,lang){
 const key=side+"-"+lang;
 if(!["front","back"].includes(side)||!["en","zh"].includes(lang))return Promise.reject(new Error("Unknown postcard"));
 if(postcards.has(key))return postcards.get(key);
 const pending=new Promise((resolve,reject)=>{
   const script=document.createElement("script");
   script.src="art/secret-postcard-"+key+".js";
   script.onload=()=>{
     try{
       const binary=atob(window.StarfallPostcardPixels[key]);
       const pixels=Uint8Array.from(binary,c=>c.charCodeAt(0));
       resolve(URL.createObjectURL(new Blob([pixels],{type:"image/png"})));
     }catch(error){reject(error);}
     finally{delete window.StarfallPostcardPixels[key];script.remove();}
   };
   script.onerror=()=>{script.remove();reject(new Error("Postcard asset unavailable"));};
   document.head.append(script);
 }).catch(error=>{postcards.delete(key);throw error;});
 postcards.set(key,pending);
 return pending;
}
window.StarfallDiscoveries={locations,byId:campaignId,episode,worlds,breadth,restore,addToSurface,decorate,postcardUrl};
})();

