// The five mail runs follow the painted coast from morning to evening.
const light = {
  orchard: null,
  picnic: ["rgba(255,217,155,.18)", "rgba(255,216,150,.06)", "rgba(243,194,131,.08)"],
  coral: ["rgba(91,194,211,.18)", "rgba(160,231,222,.09)", "rgba(43,172,193,.20)"],
  castle: ["rgba(77,65,129,.76)", "rgba(196,127,140,.48)", "rgba(77,73,127,.55)"],
  festival: ["rgba(125,117,178,.49)", "rgba(251,166,122,.32)", "rgba(205,147,158,.29)"]
};
const grades = new Map();
let original;
let pending;

function tint(theme) {
  if (grades.has(theme)) return grades.get(theme);
  const colors = light[theme];
  if (!colors) return original;
  const surface = document.createElement("canvas");
  surface.width = original.naturalWidth;
  surface.height = original.naturalHeight;
  const ctx = surface.getContext("2d");
  ctx.drawImage(original, 0, 0);
  const glow = ctx.createLinearGradient(0, 0, 0, surface.height);
  glow.addColorStop(0, colors[0]); glow.addColorStop(.48, colors[1]); glow.addColorStop(1, colors[2]);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, surface.width, surface.height);
  grades.set(theme, surface);
  return surface;
}

export function getVista(theme, onLoad) {
  if (original) return tint(theme);
  if (!pending) {
    pending = new Promise(resolve => {
      const img = new Image();
      img.onload = () => { original = img; resolve(true); };
      img.onerror = () => resolve(false);
      img.src = new URL("./assets/sky-coast.webp", import.meta.url).href;
    });
  }
  if (onLoad) pending.then(ready => { if (ready) onLoad(tint(theme)); });
  return null;
}
