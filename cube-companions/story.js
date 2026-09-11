import {creatureTypes} from './rules.js?v=story2';

export const chapters=[
 {id:'forest',title:'The sleeping forest',subtitle:'Find the lost Sunseed and reopen the lake trail.',badge:'🌿 Grove Badge',end:'forest-boss'},
 {id:'lake',title:'The stolen lake light',subtitle:'Recover the Tide Crystal and bring light back to the lake.',badge:'💧 Tide Badge',end:'lake-boss'}
];
export const storyTargets=[
 {id:'forest-guide',region:'grove',x:-2,z:6,name:'Guide Willow',role:'guide',color:'#9ab96a',title:'A forest in need',dialog:'The Sunseed is missing from our old gateway, and the lake trail has gone dark. Bring two different types of companions, then search the broken arch to the west.',reward:10},
 {id:'forest-seed',region:'grove',x:-6,z:8,name:'Lost Sunseed',role:'relic',color:'#f0d34f',title:'A warm golden seed',dialog:'Under the fallen stones, a tiny Sunseed still shines. Scout Pip knows how to carry it safely back to the gateway.',reward:20},
 {id:'forest-scout',region:'grove',x:6,z:6,name:'Scout Pip',role:'trainer',color:'#dcaf63',title:'Practice with Pip',dialog:'My Bug and Grass companions guard this path. Fire and Flying are useful here. You can check Types and change your lead before we start.',reward:30,team:['grub','sprig'],style:0},
 {id:'forest-boss',region:'grove',x:-6,z:-9,name:'Warden Rowan',role:'boss',color:'#648e57',title:'Light the forest gateway',dialog:'Show me that your team can protect the Sunseed. My Grass, Bug and Fighting companions each have different weaknesses. Watch for the charged Grove Slam!',reward:80,team:['sprig','grub','brawl'],style:0},
 {id:'lake-guide',region:'lake',x:-2,z:27,name:'Ferrykeeper Mira',role:'guide',color:'#78b7c9',title:'Where did the lake light go?',dialog:'You reopened our trail! But the Tide Crystal has washed into the old lakeside ruins. Bring a Water companion to help us search; then meet Ripple for a practice battle.',reward:10},
 {id:'lake-crystal',region:'lake',x:5,z:36,name:'Lost Tide Crystal',role:'relic',color:'#89e7e7',title:'The crystal beneath the reeds',dialog:'Your Water companion spots a blue glow between the stones. The crystal is safe! Ripple is waiting near the boardwalk to prepare you for Captain Marina.',reward:20},
 {id:'lake-scout',region:'lake',x:6,z:28,name:'Trainer Ripple',role:'trainer',color:'#6d9fce',title:'A lesson beside the water',dialog:'Water and Ice are different types. Electric works well against Water; Fighting helps against Ice. Try the type calculator before challenging my team.',reward:40,team:['bubble','frost'],style:2},
 {id:'lake-boss',region:'lake',x:0,z:39,name:'Captain Marina',role:'boss',color:'#577fac',title:'Return the lake light',dialog:'Five companions protect this lake. Electric is useful against Water, but watch the Ice companion and the Water + Poison combination. Guard before Tidal Wave!',reward:120,team:['bubble','mire','otter','frost','bubble'],style:2}
].map(t=>({...t,kind:'story',actionTitle:t.role==='relic'?'Collect':t.team?'Talk & challenge':'Talk'}));
const regionIds=['grove','lake','volcano','mine','fairy'];
export function normalizeStory(raw,visited=[]){
 const flags=[...new Set((Array.isArray(raw?.flags)?raw.flags:[]).filter(id=>storyTargets.some(t=>t.id===id)))];
 // A pre-story save keeps access to every region it has already visited.
 const prior=raw?raw.unlocked:visited;
 const unlocked=[...new Set(['grove',...(Array.isArray(prior)?prior:[]).filter(id=>regionIds.includes(id))])];
 if(flags.includes('forest-boss')&&!unlocked.includes('lake'))unlocked.push('lake');
 if(flags.includes('lake-boss'))for(const id of regionIds)if(!unlocked.includes(id))unlocked.push(id);
 return {version:1,flags,unlocked};
}
export const hasStoryEvent=(state,id)=>!!state.story?.flags?.includes(id);
export const regionUnlocked=(state,id)=>id==='grove'||!!state.story?.unlocked?.includes(id);
export function storySteps(state,chapter){
 const forest=chapter==='forest';
 return [
  {id:forest?'forest-guide':'lake-guide',title:forest?'Talk to Guide Willow':'Meet Ferrykeeper Mira',detail:forest?'Willow waits beside camp.':'Mira waits by the lake trailhead.',target:forest?'forest-guide':'lake-guide'},
  {id:forest?'forest-team':'lake-team',title:forest?'Bring two different types':'Bring a Water companion',detail:forest?'Catch a second type. Pufflet waits west of camp; check the icons on your team.':'Catch a Water companion near the lake, or bring one already on your team.',done:forest?new Set(state.party.flatMap(creatureTypes)).size>=2&&state.party.length>=2:state.party.some(c=>creatureTypes(c).includes('water'))},
  {id:forest?'forest-seed':'lake-crystal',title:forest?'Find the Sunseed in the ruins':'Find the Tide Crystal',detail:forest?'Search the broken arch west of camp.':'Search the ruins beyond the eastern reeds.',target:forest?'forest-seed':'lake-crystal'},
  {id:forest?'forest-scout':'lake-scout',title:forest?'Practice with Scout Pip':'Train with Ripple',detail:forest?'Pip waits east of camp with two companions.':'Ripple waits east of the boardwalk.',target:forest?'forest-scout':'lake-scout'},
  {id:forest?'forest-boss':'lake-boss',title:forest?'Challenge Warden Rowan':'Challenge Captain Marina',detail:forest?'Return the Sunseed and win the Grove Badge.':'Restore the lake light and win the Tide Badge.',target:forest?'forest-boss':'lake-boss'}
 ].map(step=>({...step,done:step.done??hasStoryEvent(state,step.id)}));
}
export function currentStory(state){const chapter=chapters.find(c=>!hasStoryEvent(state,c.end));if(!chapter)return {complete:true,title:'Both chapters complete!',detail:'Explore the unlocked regions, collect companions, or challenge the endless boss ladder north of camp.'};const steps=storySteps(state,chapter.id),next=steps.find(s=>!s.done);return {chapter,steps,next,title:next.title,detail:next.detail};}
export const storyReady=(state,id)=>currentStory(state).next?.target===id;
export function storyBoss(target){return {index:target.style,rank:target.role==='boss'?target.region==='grove'?1:2:0,name:target.name,team:[...target.team]};}
export function completeStoryEvent(state,id){
 if(!storyReady(state,id)||hasStoryEvent(state,id))return null;
 const target=storyTargets.find(t=>t.id===id);if(!target)return null;
 state.story.flags.push(id);state.story=normalizeStory(state.story);
 state.party.forEach(c=>{c.xp+=target.reward;if(target.team)c.hp=c.max;});
 state.cubes=Math.min(99,state.cubes+2);
 return {xp:target.reward,badge:chapters.find(c=>c.end===id)?.badge||null};
}
export function completeStoryBattle(state){const b=state.battle,target=storyTargets.find(t=>t.id===b?.storyId);if(!target?.team||!b.trainer||b.rewarded||b.enemy.hp>0||b.round!==target.team.length-1)return null;const reward=completeStoryEvent(state,target.id);if(reward)b.rewarded=true;return reward;}
