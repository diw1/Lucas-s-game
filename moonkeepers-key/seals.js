const shapes = {
  moon: '<path d="M24 3A12 12 0 1 0 28 23A12.5 12.5 0 0 1 24 3Z"/>',
  leaf: '<path d="M6 24Q3 6 28 4Q27 27 10 27ZM6 28 23 10M12 21l-1-5m7-2 5 1"/>',
  flame: '<path d="M17 3c2 7 9 8 7 15 2-1 3-3 4-5 4 16-8 20-14 17C3 28 3 21 8 14c0 5 3 5 4 6-1-8 7-10 5-17Z"/><path d="M16 27c-1-4 4-6 4-9"/>',
  wave: '<path d="M3 19c4 0 7-2 10-7 5-9 13-8 16-4-6-1-10 4-7 7 2 3 5 2 8 0-1 6-8 10-14 6-5 3-9 3-13 0ZM4 27q6 4 12 0 6 4 13-1"/>',
  star: '<path d="m16.5 3 3.8 8.8 9.4 1.1-7 6.3 2.1 9.3-8.3-4.9-8.3 4.9 2.1-9.3-7-6.3 9.4-1.1Z"/>',
  key: '<path d="M12 6a7 7 0 1 0-1 13l12 12 5-5-3-3-2 2-2-2 2-2-4-4A7 7 0 0 0 12 6Z"/><circle cx="10" cy="12" r="2.1"/>'
};
export function sealIcon(id) {
  return '<svg aria-hidden="true" viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (shapes[id] || shapes.key) + '</svg>';
}

export const seals = [
  {id:"moon",name:"Moon",mark:"Cup",points:[[4,8],[10,24],[23,24],[29,8]]},
  {id:"leaf",name:"Leaf",mark:"Steps",points:[[3,26],[3,17],[15,17],[15,7],[28,7]]},
  {id:"flame",name:"Flame",mark:"Wing",points:[[4,23],[11,7],[16,18],[27,11]]},
  {id:"wave",name:"Wave",mark:"Kite",points:[[16,3],[26,14],[16,28],[6,14],[16,3]]},
  {id:"star",name:"Star",mark:"Crown",points:[[3,10],[7,24],[16,9],[25,24],[29,10]]}
];
export function engraving(seal) {
  const stars=seal.points.map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="2.2"/>').join("");
  return '<svg aria-hidden="true" viewBox="0 0 32 32" fill="currentColor"><polyline points="'+seal.points.map(p=>p.join(",")).join(" ")+'" fill="none" stroke="currentColor" stroke-width="1.45"/>'+stars+'</svg>';
}
