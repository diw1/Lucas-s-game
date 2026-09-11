export const regions=[
 {id:'grove',name:'Home Grove',x:0,z:3.5,colors:['#81ab68','#7ba562'],foliage:'#548650',species:['sprig','brawl']},
 {id:'volcano',name:'Ember Volcano',x:30,z:0,colors:['#765854','#825d51'],foliage:'#dd7044',species:['ember','pebble']},
 {id:'lake',name:'Crystal Lake',x:0,z:30,colors:['#7fc3cb','#8bd2d1'],foliage:'#499f9e',species:['bubble','sprig']},
 {id:'mine',name:'Iron Mountains',x:-30,z:0,colors:['#9093a5','#a4a5b3'],foliage:'#b4c9e2',species:['steel','pebble','brawl']},
 {id:'fairy',name:'Starlight Forest',x:0,z:-30,colors:['#b995bf','#ab8dbb'],foliage:'#df9acc',species:['fairy','sprig']}
];
export function regionAt(x,z){if(Math.max(Math.abs(x),Math.abs(z))<16)return regions[0];return Math.abs(x)>Math.abs(z)?regions[x>0?1:3]:regions[z>0?2:4];}
export const chests=regions.map(r=>({id:`chest-${r.id}`,x:r.x+3,z:r.z+2,kind:'chest',name:`${r.name} treasure`}));
export function openChest(state,id){if(!chests.some(c=>c.id===id)||state.opened.includes(id))return false;state.opened.push(id);state.cubes=Math.min(99,state.cubes+3);state.party.forEach(c=>c.xp+=20);return true;}
export const quests=[
 {id:'catch3',name:'Make three new friends',detail:'Complete 3 successful captures.',goal:3,value:s=>s.captures},
 {id:'travel',name:'Across the world',detail:'Visit all five regions.',goal:5,value:s=>s.visited.length},
 {id:'evolve',name:'Growing stronger',detail:'Evolve a companion once.',goal:1,value:s=>s.party.some(c=>c.stage>0)?1:0},
 {id:'advantage',name:'Know your types',detail:'Win a battle with an effective finishing attack.',goal:1,value:s=>s.effectiveWins},
 {id:'treasure',name:'Treasure hunter',detail:'Open three different treasure chests.',goal:3,value:s=>s.opened.length}
];
export function claimQuest(state,id){const q=quests.find(q=>q.id===id);if(!q||state.claimed.includes(id)||q.value(state)<q.goal)return false;state.claimed.push(id);state.cubes=Math.min(99,state.cubes+3);state.party.forEach(c=>c.xp+=40);return true;}
