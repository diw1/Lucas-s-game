// Modern main-series matchup chart (attack rows, defense columns).
// Source: https://diamondpearl.pokemon.com/en-gb/trainersguide/fundamentals/battling/
export const typeIcons={normal:'⚪',fire:'🔥',water:'💧',electric:'⚡',grass:'🌿',ice:'❄️',fighting:'🥊',poison:'☠️',ground:'⛰️',flying:'🪽',psychic:'🔮',bug:'🐛',rock:'🪨',ghost:'👻',dragon:'🐉',dark:'🌙',steel:'⚙️',fairy:'✨'};
export const typeNames={normal:'一般',fire:'火',water:'水',electric:'电',grass:'草',ice:'冰',fighting:'格斗',poison:'毒',ground:'地面',flying:'飞行',psychic:'超能力',bug:'虫',rock:'岩石',ghost:'幽灵',dragon:'龙',dark:'恶',steel:'钢',fairy:'妖精'};
export const typeIds=Object.keys(typeIcons);
export const typeColors={normal:'#b7b1a5',fire:'#f99b36',water:'#54d3ed',electric:'#ecd34f',grass:'#8ace48',ice:'#99e0e5',fighting:'#e16c5e',poison:'#b47fdb',ground:'#ceaa78',flying:'#aaa5eb',psychic:'#ef7cae',bug:'#aec447',rock:'#baaa73',ghost:'#9481bb',dragon:'#8472da',dark:'#80728a',steel:'#c1e5ef',fairy:'#f2a9e0'};
const chart={
 normal:[[],['rock','steel'],['ghost']],
 fire:[['grass','ice','bug','steel'],['fire','water','rock','dragon'],[]],
 water:[['fire','ground','rock'],['water','grass','dragon'],[]],
 electric:[['water','flying'],['electric','grass','dragon'],['ground']],
 grass:[['water','ground','rock'],['fire','grass','poison','flying','bug','dragon','steel'],[]],
 ice:[['grass','ground','flying','dragon'],['fire','water','ice','steel'],[]],
 fighting:[['normal','ice','rock','dark','steel'],['poison','flying','psychic','bug','fairy'],['ghost']],
 poison:[['grass','fairy'],['poison','ground','rock','ghost'],['steel']],
 ground:[['fire','electric','poison','rock','steel'],['grass','bug'],['flying']],
 flying:[['grass','fighting','bug'],['electric','rock','steel'],[]],
 psychic:[['fighting','poison'],['psychic','steel'],['dark']],
 bug:[['grass','psychic','dark'],['fire','fighting','poison','flying','ghost','steel','fairy'],[]],
 rock:[['fire','ice','flying','bug'],['fighting','ground','steel'],[]],
 ghost:[['psychic','ghost'],['dark'],['normal']],
 dragon:[['dragon'],['steel'],['fairy']],
 dark:[['psychic','ghost'],['fighting','dark','fairy'],[]],
 steel:[['ice','rock','fairy'],['fire','water','electric','steel'],[]],
 fairy:[['fighting','dragon','dark'],['fire','poison','steel'],[]]
};
export const canonicalType=t=>({leaf:'grass',stone:'rock'}[t]||t);
export const typeText=t=>`${typeIcons[canonicalType(t)]} ${canonicalType(t)} · ${typeNames[canonicalType(t)]}`;
export const strengths=Object.fromEntries(typeIds.map(t=>[t,chart[t][0]]));
export function typeFactor(attack,defense){const a=chart[canonicalType(attack)],d=canonicalType(defense);if(!a||!chart[d])throw Error('Unknown type');return a[2].includes(d)?0:a[0].includes(d)?2:a[1].includes(d)?.5:1;}
