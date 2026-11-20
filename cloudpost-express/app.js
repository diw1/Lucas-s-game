import { routes } from "./routes.js";
import { startFlight } from "./flight.js";
import { createAudio } from "./audio.js";

const el = id => document.getElementById(id);
const audio = createAudio();
const prefix = "lucas.cloudpost.v1.";
const memory = new Map();
function read(key) {
  try { return localStorage.getItem(prefix + key) ?? memory.get(key); }
  catch { return memory.get(key); }
}
function save(key, value) {
  memory.set(key, value);
  try { localStorage.setItem(prefix + key, value); } catch { /* Keep this visit playable. */ }
}
function best(route) {
  const value = read("rings." + route.id);
  if (value == null || !/^\d+$/.test(value)) return null;
  return Math.min(route.rings, Number(value));
}
const collected = () => routes.filter(route => best(route) !== null).length;
let selected = routes.find(route => route.id === read("route"))
  || routes.find(route => best(route) === null) || routes[0];
let sound = read("sound") !== "off";
let engine = null;
let phase = "desk";
let reportRoute = null;
let reportIsAlbum = false;
let lastSelection = null;

function soundControl() {
  audio.setEnabled(sound);
  el("sound").setAttribute("aria-pressed", String(sound));
  el("sound").setAttribute("aria-label", sound ? "Mute sound" : "Turn sound on");
  el("pause-sound").textContent = sound ? "Mute sound" : "Turn sound on";
  el("pause-sound").setAttribute("aria-pressed", String(sound));
}
function toggleSound() {
  sound = !sound;
  save("sound", sound ? "on" : "off");
  soundControl();
  audio.play("click");
}
function live(message) { el("announce").textContent = message; }
function copyTemplate(id) { return el(id).content.firstElementChild.cloneNode(true); }
function show(dialog) { if (!dialog.open) dialog.showModal(); }
function close(dialog) { if (dialog.open) dialog.close(); }
function returnFocus(node) { node?.focus({ preventScroll: true }); }

function renderDesk() {
  const cards = routes.map(route => {
    const card = copyTemplate("route-template");
    const record = best(route);
    card.dataset.route = route.id;
    card.setAttribute("aria-pressed", String(route === selected));
    card.querySelector(".route-no").textContent = String(route.level).padStart(2, "0");
    card.querySelector(".route-image").src = "assets/" + route.id + ".webp";
    card.querySelector(".route-name").textContent = route.name;
    card.querySelector(".route-detail").textContent = route.tagline;
    card.querySelector(".route-status").textContent = record === null
      ? route.rings + " rings" : "Delivered · Best " + record + "/" + route.rings;
    card.addEventListener("click", () => {
      selectRoute(route);
      audio.play("click");
      // Restore focus to the selected route after the cards have been redrawn.
      const launch = el("route-grid").querySelector('[data-route="' + route.id + '"]');
      returnFocus(launch);
      live(route.name + " selected. " + route.brief);
    });
    return card;
  });
  el("route-grid").replaceChildren(...cards);
  el("active-route").textContent = "To " + selected.recipient;
  el("route-brief").textContent = selected.brief;
  el("postcard-count").textContent = String(collected());
  el("postcards-nav").setAttribute("aria-label", "Postcards, " + collected() + " of " + routes.length + " delivered");
}

function selectRoute(route) {
  selected = route;
  save("route", route.id);
  renderDesk();
}

function showDesk(focusStart = true) {
  engine?.destroy();
  engine = null;
  phase = "desk";
  document.querySelectorAll("dialog[open]").forEach(close);
  el("flight").hidden = true;
  el("desk").hidden = false;
  document.body.classList.remove("is-flying");
  renderDesk();
  if (focusStart) {
    window.scrollTo(0, 0);
    returnFocus(el("start-flight"));
  }
}

function renderCollection() {
  el("collection-count").textContent = collected() + " / " + routes.length;
  const cards = routes.map(route => {
    const card = copyTemplate("postcard-template");
    const locked = best(route) === null;
    card.dataset.route = route.id;
    card.disabled = locked;
    card.classList.toggle("is-locked", locked);
    card.querySelector(".postcard-image").src = "assets/" + route.id + ".webp";
    card.querySelector(".postcard-no").textContent = "POST " + String(route.level).padStart(2, "0");
    card.querySelector(".postcard-name").textContent = locked ? route.name : route.stamp;
    card.querySelector(".postcard-caption").textContent = locked ? "Awaiting delivery" : "From " + route.recipient;
    if (!locked) card.addEventListener("click", () => {
      lastSelection = route.id;
      close(el("postcards-dialog"));
      displayReport(route, best(route), true);
    });
    return card;
  });
  el("postcard-grid").replaceChildren(...cards);
}

function openCollection() {
  renderCollection();
  show(el("postcards-dialog"));
  if (lastSelection) returnFocus(el("postcard-grid").querySelector('[data-route="' + lastSelection + '"]'));
}

function displayReport(route, score, album = false) {
  const all = collected() === routes.length;
  reportIsAlbum = album;
  reportRoute = route;
  el("result-title").textContent = album ? route.stamp : all ? "The whole world has mail!" : "Mail delivered!";
  el("result-summary").textContent = album ? "A keepsake from " + route.name + "."
    : all ? "All five postcards are in your collection. The parade can begin!"
      : "A postcard from " + route.name + " has arrived.";
  el("result-delivered").textContent = "1 / 1";
  el("result-score").textContent = score + " / " + route.rings;
  const stars = 1 + Number(score >= Math.ceil(route.rings * .5)) + Number(score === route.rings);
  el("result-stars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  el("result-stars").setAttribute("aria-label", stars + " of 3 stars");
  el("result-stamp").textContent = route.stamp;
  el("result-image").src = "assets/" + route.id + ".webp";
  el("result-image").alt = route.landmark + ", painted by Lucas";
  el("result-recipient").textContent = "From " + route.recipient;
  el("result-letter").textContent = route.letter;
  el("result-next").textContent = album ? "Back to postcards" : all ? "View postcards" : "Next route";
  show(el("result-dialog"));
  returnFocus(el("result-next"));
}

function handleHud({ caught, total, progress, hint, canDeliver }) {
  el("hud-score").textContent = caught + " / " + total;
  el("flight-progress").value = Math.round(progress * 100);
  if (hint && el("flight-hint").textContent !== hint) el("flight-hint").textContent = hint;
  el("deliver").disabled = !canDeliver;
}

function startRoute(route) {
  engine?.destroy();
  document.querySelectorAll("dialog[open]").forEach(close);
  selectRoute(route);
  phase = "flight";
  reportRoute = null;
  document.body.classList.add("is-flying");
  el("desk").hidden = true;
  el("flight").hidden = false;
  el("flight-title").textContent = route.name;
  el("flight-route-no").textContent = "Route " + String(route.level).padStart(2, "0") + " · To " + route.recipient;
  handleHud({ caught: 0, total: route.rings, progress: 0, canDeliver: false, hint: "Drag on the sky or use the arrow keys to steer." });
  window.scrollTo(0, 0);
  audio.play("start");
  returnFocus(el("flight-canvas"));
  engine = startFlight(el("flight-canvas"), route, {
    onHUD: handleHud,
    onEvent(type) {
      audio.play(type);
      if (type === "approach") live("Drop zone open. Press Space or tap Deliver mail.");
    },
    onFinish({ caught }) {
      phase = "result";
      const high = Math.max(best(route) ?? 0, caught);
      save("rings." + route.id, String(high));
      audio.play("finish");
      renderDesk();
      displayReport(route, caught);
      live("Letter delivered to " + route.recipient + ".");
    }
  });
}

function pauseFlight() {
  if (phase !== "flight") return;
  engine?.pause();
  phase = "paused";
  show(el("pause-dialog"));
  returnFocus(el("resume"));
}
function resumeFlight() {
  if (phase !== "paused") return;
  close(el("pause-dialog"));
  phase = "flight";
  engine?.resume();
  returnFocus(el("flight-canvas"));
}

el("start-flight").addEventListener("click", () => startRoute(selected));
el("dispatch-flight")?.addEventListener("click", () => startRoute(selected));
el("help-open").addEventListener("click", () => show(el("help-dialog")));
el("sound").addEventListener("click", toggleSound);
el("pause-sound").addEventListener("click", toggleSound);
el("postcards-nav").addEventListener("click", () => {
  if (phase !== "desk") return;
  lastSelection = null; openCollection();
});
el("deliver").addEventListener("click", () => { if (phase === "flight") engine?.deliver(); });
el("pause").addEventListener("click", pauseFlight);
el("resume").addEventListener("click", resumeFlight);
el("restart").addEventListener("click", () => startRoute(selected));
el("quit").addEventListener("click", () => showDesk());
el("result-home").addEventListener("click", () => showDesk());
el("result-replay").addEventListener("click", () => startRoute(reportRoute));
el("result-next").addEventListener("click", () => {
  if (reportIsAlbum || collected() === routes.length) {
    showDesk(false); openCollection(); return;
  }
  const next = [...routes.slice(reportRoute.level), ...routes.slice(0, reportRoute.level)]
    .find(route => best(route) === null);
  startRoute(next);
});
for (const button of document.querySelectorAll("[data-close]")) {
  button.addEventListener("click", () => close(button.closest("dialog")));
}
el("postcards-dialog").addEventListener("close", () => {
  if (phase === "desk" && !el("result-dialog").open && !el("postcards-dialog").open) returnFocus(el("postcards-nav"));
});
el("pause-dialog").addEventListener("cancel", event => { event.preventDefault(); resumeFlight(); });
el("result-dialog").addEventListener("cancel", event => {
  event.preventDefault(); showDesk(); if (reportIsAlbum) openCollection();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && phase === "flight" && !document.querySelector("dialog[open]")) {
    event.preventDefault(); pauseFlight();
  }
});
document.addEventListener("visibilitychange", () => { if (document.hidden) pauseFlight(); });
window.addEventListener("pagehide", pauseFlight);
window.addEventListener("storage", event => {
  if (phase === "desk" && event.key?.startsWith(prefix + "rings.")) {
    renderDesk();
    if (el("postcards-dialog").open) renderCollection();
  }
});
soundControl();
showDesk(false);
