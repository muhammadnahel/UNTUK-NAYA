/* =====================================================
   Birthday Pixel Polaroid — app.js
   ===================================================== */
(() => {
const C = window.CONFIG;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------------------------------------------------------
   1. PLACEHOLDER FOTO (dipakai kalau src kosong)
--------------------------------------------------------- */
function placeholder(i) {
  const pal = [["#f6b3c8", "#7a3b6e"], ["#9fb8d8", "#2b3d63"], ["#e8d6b8", "#6b7d5a"]][i % 3];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${pal[0]}'/><stop offset='1' stop-color='${pal[1]}'/></linearGradient></defs>
  <rect width='600' height='800' fill='url(#g)'/>
  <circle cx='300' cy='180' r='70' fill='#fff' opacity='.35'/>
  <g fill='#fff' opacity='.9'><circle cx='230' cy='360' r='52'/><rect x='170' y='420' width='120' height='260' rx='50'/>
  <circle cx='375' cy='380' r='48'/><rect x='320' y='436' width='110' height='244' rx='48'/></g>
  <text x='300' y='740' font-family='monospace' font-size='28' fill='#fff' text-anchor='middle'>ganti dengan fotomu (config.js)</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
const photoSrc = i => C.moments[i].src || placeholder(i);

/* ---------------------------------------------------------
   2. PIXEL ART BACKGROUND (canvas, dirender kode)
--------------------------------------------------------- */
function drawPixBg(cv) {
  const W = 108, H = 240; cv.width = W; cv.height = H;
  const g = cv.getContext("2d");
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stops = [[0, [255, 90, 138]], [.32, [255, 112, 120]], [.5, [255, 160, 96]], [.64, [255, 200, 96]], [.76, [255, 228, 140]]];
  const col = t => { for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) { const [a, ca] = stops[i - 1], [b, cb] = stops[i]; const k = (t - a) / (b - a); return ca.map((v, j) => Math.round(v + (cb[j] - v) * k)); } return stops[stops.length - 1][1]; };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let t = y / H; t += (((x + y) & 1) ? .006 : -.006); // dither
    const c = col(Math.min(t, .76)); g.fillStyle = `rgb(${c})`; g.fillRect(x, y, 1, 1);
  }
  // sun
  const cx = W / 2, cy = H * .73, r = W * .34;
  g.fillStyle = "#fdf0a0";
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if ((x - cx) ** 2 + (y - cy) ** 2 < r * r && y < H * .8) g.fillRect(x, y, 1, 1); }
  g.fillStyle = "rgba(255,255,200,.0)";
  // mountains
  const base = H * .76;
  for (let x = 0; x < W; x++) {
    const h = 9 + 6 * Math.abs(Math.sin(x * .13)) + 5 * Math.abs(Math.sin(x * .41 + 1)) + (rnd() * 2 | 0) + (x > 40 && x < 52 ? -8 : 0) + (x > 52 && x < 64 ? -3 : 0);
    for (let y = base - h; y < H * .8; y++) { g.fillStyle = (y - (base - h) < 4) ? "#27b0ae" : (y > base - 4 ? "#0f7a84" : "#18999c"); g.fillRect(x, Math.floor(y), 1, 1); }
  }
  // grass
  const gy = Math.floor(H * .79);
  for (let y = gy; y < gy + 14; y++) for (let x = 0; x < W; x++) {
    const n = Math.sin(x * .5 + y * 1.3) + rnd();
    g.fillStyle = y < gy + 3 ? "#5df29a" : n > 1.2 ? "#27e085" : n > .2 ? "#17c46c" : "#12a85d"; g.fillRect(x, y, 1, 1);
  }
  for (let i = 0; i < 26; i++) { g.fillStyle = ["#ffe34d", "#ff7ab0", "#fff"][i % 3]; g.fillRect(rnd() * W | 0, gy + 3 + (rnd() * 8 | 0), 1, 1); }
  // ground
  for (let y = gy + 14; y < H; y++) for (let x = 0; x < W; x++) {
    const row = y - gy - 14; g.fillStyle = row % 9 < 1 ? "#c93a70" : (row > 22 ? "#d63f77" : "#e8467f"); g.fillRect(x, y, 1, 1);
  }
  // drips
  for (let x = 2; x < W; x += 3 + (rnd() * 6 | 0)) { const l = 2 + (rnd() * 6 | 0); g.fillStyle = "#17c46c"; g.fillRect(x, gy + 14, 1, l); g.fillStyle = "#12a85d"; g.fillRect(x + 1, gy + 14, 1, l - 1); }
}
$$(".pixbg").forEach(drawPixBg);

/* bintang, balon */
$$(".stars").forEach(el => {
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("i"), z = [3, 4, 6, 8][i % 4];
    s.style.cssText = `left:${(i * 37 + 11) % 96}%;top:${(i * 53 + 7) % 60}%;width:${z}px;height:${z}px;animation-delay:${(i % 6) * .4}s`;
    el.appendChild(s);
  }
  [[8, 14], [76, 22]].forEach(([l, t]) => { const p = document.createElement("i"); p.className = "plus"; p.style.cssText = `left:${l}%;top:${t}%`; el.appendChild(p); });
});
$$(".balloons").forEach(el => {
  [["#ff7ab0", 10, 14, 40, 4.2], ["#ffcb3b", 78, 13, 36, 3.6], ["#7fd2ff", 10, 63, 38, 4.8], ["#9ae88f", 86, 61, 34, 4]].forEach(([c, l, t, w, d]) => {
    const b = document.createElement("b"); b.style.cssText = `--c:${c};left:${l}%;top:${t}%;--w:${w}px;--d:${d}s`; el.appendChild(b);
  });
});

/* ---------------------------------------------------------
   3. KAMERA POLAROID (SVG)
--------------------------------------------------------- */
const CAM_SVG = `
<defs>
 <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3cbfa"/><stop offset="1" stop-color="#9da8ee"/></linearGradient>
 <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b717c"/><stop offset="1" stop-color="#454a54"/></linearGradient>
 <radialGradient id="gl" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#3c3c48"/><stop offset="1" stop-color="#0c0c12"/></radialGradient>
</defs>
<rect x="46" y="4" width="228" height="48" rx="8" fill="url(#gt)"/>
<rect x="214" y="0" width="34" height="14" rx="3" fill="#3a3f48"/>
<rect x="10" y="34" width="300" height="138" rx="16" fill="url(#gb)"/>
<rect x="10" y="34" width="300" height="6" rx="3" fill="#e8ecff" opacity=".8"/>
<rect x="10" y="128" width="300" height="44" fill="#f4f6ff"/>
<rect x="10" y="168" width="300" height="60" rx="0" fill="#2a3b6e"/>
<rect x="10" y="168" width="300" height="3" fill="#44588f"/>
<rect x="10" y="216" width="300" height="14" rx="8" fill="#22315f"/>
<rect x="26" y="52" width="58" height="26" rx="4" fill="#8e9de6" stroke="#6c7bd2" stroke-width="2"/>
<text x="55" y="72" text-anchor="middle" font-family="Press Start 2P, monospace" font-size="12" fill="#2d49c4">1000</text>
<rect x="236" y="50" width="46" height="44" rx="6" fill="#0b0b11"/>
<rect x="240" y="54" width="14" height="6" fill="#fff" opacity=".12"/>
<circle cx="160" cy="92" r="52" fill="#d8dcf8"/>
<circle cx="160" cy="92" r="46" fill="url(#gl)"/>
<circle cx="160" cy="92" r="34" fill="#1d1d26"/>
<circle cx="160" cy="92" r="26" fill="#050507"/>
<path d="M126 78 A36 36 0 0 1 150 60" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/>
<circle cx="46" cy="116" r="14" fill="#cfd3e6"/><circle cx="46" cy="116" r="11" fill="#e23a47"/><circle cx="43" cy="112" r="3" fill="#ff9aa2"/>
<circle cx="262" cy="118" r="11" fill="#2a2a34"/><circle cx="262" cy="118" r="8" fill="#16161d"/>
<g><rect x="146" y="124" width="7" height="46" fill="#e8484a"/><rect x="153" y="124" width="7" height="46" fill="#f6b73c"/><rect x="160" y="124" width="7" height="46" fill="#52c06c"/><rect x="167" y="124" width="7" height="46" fill="#3b8be8"/></g>
<text x="28" y="192" font-family="Courier Prime, monospace" font-size="9.5" fill="#b9c4ee" letter-spacing=".6">POLAROID LAND CAMERA</text>
<g stroke="#44588f" stroke-width="1"><path d="M208 188h92M208 192h92M208 196h92"/></g>
<rect x="24" y="204" width="272" height="10" rx="2" fill="#07070b"/>`;
$("#camFrontA").innerHTML = CAM_SVG;
$("#camFrontB").innerHTML = CAM_SVG.replace(/id="(g[a-z])"/g, 'id="$1b"').replace(/url\(#(g[a-z])\)/g, 'url(#$1b)');

/* ---------------------------------------------------------
   4. AUDIO — chiptune dibuat langsung (tanpa file) + SFX
--------------------------------------------------------- */
const Audio_ = (() => {
  let ctx, master, musicGain, timer, on = true, started = false, ext = null, step = 0, nextT = 0;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const BPM = 116, S = 60 / BPM / 4;
  // progresi: C - G - Am - F  (4 birama, 16 step)
  const chords = [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]].map(c => c);
  const bassRoot = [36, 43, 45, 41];
  const lead = [ // 64 step, nilai semitone dari C5(72) atau null
    [76, null, 79, null, 83, null, 79, null, 76, null, 74, null, 72, null, null, null],
    [74, null, 79, null, 83, null, 86, null, 83, null, 79, null, 74, null, null, null],
    [76, null, 81, null, 84, null, 81, null, 79, null, 76, null, 72, null, 76, null],
    [77, null, 81, null, 84, null, 81, null, 77, null, 76, null, 74, null, null, null]];
  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = .9; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = .5; musicGain.connect(master);
    const len = ctx.sampleRate * .2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; Audio_.noiseBuf = buf;
  }
  function tone(t, f, dur, type, vol, dest, slide) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + .02);
  }
  function hat(t, v) { const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter(); s.buffer = Audio_.noiseBuf; f.type = "highpass"; f.frequency.value = 7000; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + .04); s.connect(f); f.connect(g); g.connect(musicGain); s.start(t); s.stop(t + .05); }
  function sched() {
    while (nextT < ctx.currentTime + .25) {
      const bar = (step >> 4) & 3, i = step & 15, t = nextT;
      const n = lead[bar][i]; if (n) tone(t, mtof(n), S * 2.2, "square", .07, musicGain);
      if (i % 4 === 0) tone(t, mtof(bassRoot[bar] + (i % 8 ? 12 : 0)), S * 3.5, "triangle", .2, musicGain);
      if (i % 2 === 0) { const c = chords[bar][(i / 2) % 3]; tone(t, mtof(60 + c), S * 1.6, "square", .025, musicGain); }
      if (i % 2 === 1) hat(t, .05); if (i === 8) hat(t, .1);
      nextT += S; step++;
    }
  }
  return {
    init,
    async start() {
      init(); if (ctx.state === "suspended") await ctx.resume();
      if (started) return; started = true;
      if (C.musicUrl) { ext = new Audio(C.musicUrl); ext.loop = true; ext.volume = .7; ext.play().catch(() => { }); return; }
      nextT = ctx.currentTime + .1; timer = setInterval(sched, 60);
    },
    get on() { return on; },
    toggle() { on = !on; if (ext) ext.muted = !on; if (master) master.gain.value = on ? .9 : 0; return on; },
    sfx(kind) {
      if (!ctx || !on) return; const t = ctx.currentTime;
      if (kind === "blip") { tone(t, 660, .08, "square", .12); tone(t + .07, 990, .1, "square", .12); }
      if (kind === "start") [523, 659, 784, 1047].forEach((f, i) => tone(t + i * .08, f, .12, "square", .12));
      if (kind === "tick") tone(t, 1200, .03, "square", .05);
      if (kind === "shutter") { tone(t, 180, .08, "square", .2, null, 60); const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = Audio_.noiseBuf; g.gain.setValueAtTime(.25, t + .05); g.gain.exponentialRampToValueAtTime(.001, t + .2); s.connect(g); g.connect(master); s.start(t + .05); }
      if (kind === "flip") tone(t, 200, .5, "sawtooth", .08, null, 900);
      if (kind === "static") { const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = Audio_.noiseBuf; s.loop = true; g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + 1.4); s.connect(g); g.connect(master); s.start(t); s.stop(t + 1.5); }
      if (kind === "pop") { tone(t, 300, .15, "triangle", .25, null, 900); [880, 1175, 1568].forEach((f, i) => tone(t + .12 + i * .07, f, .2, "square", .09)); }
      if (kind === "print") for (let i = 0; i < 14; i++) tone(t + i * .07, 140 + (i % 2) * 40, .06, "sawtooth", .07);
      if (kind === "end") [784, 659, 523, 392].forEach((f, i) => tone(t + i * .16, f, .3, "square", .12));
    }
  };
})();

/* ---------------------------------------------------------
   5. CONFETTI
--------------------------------------------------------- */
const cf = $("#confetti"), cg = cf.getContext("2d"); let parts = [], cfRun = false;
function sizeCf() { cf.width = cf.clientWidth; cf.height = cf.clientHeight; } sizeCf(); addEventListener("resize", sizeCf);
function burst(n = 120, x = .5, y = .45) {
  const cols = ["#ffd54a", "#ff6aa0", "#7fd2ff", "#9ae88f", "#fff", "#ff9a5a"];
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 9; parts.push({ x: cf.width * x, y: cf.height * y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, s: 4 + Math.random() * 6, c: cols[i % cols.length], r: Math.random() * 6, vr: (Math.random() - .5) * .4, tri: i % 3 === 0, life: 220 + Math.random() * 80 }); }
  if (!cfRun) { cfRun = true; requestAnimationFrame(loopCf); }
}
function rain(sec = 4) { const end = performance.now() + sec * 1000; (function f() { if (performance.now() > end) return; for (let i = 0; i < 2; i++) parts.push({ x: Math.random() * cf.width, y: -10, vx: (Math.random() - .5) * 1.5, vy: 1.5 + Math.random() * 2.5, s: 4 + Math.random() * 5, c: ["#ffd54a", "#ff6aa0", "#7fd2ff", "#9ae88f", "#fff"][Math.random() * 5 | 0], r: 0, vr: (Math.random() - .5) * .3, tri: Math.random() < .3, life: 400 }); if (!cfRun) { cfRun = true; requestAnimationFrame(loopCf); } setTimeout(f, 60); })(); }
function loopCf() {
  cg.clearRect(0, 0, cf.width, cf.height);
  parts = parts.filter(p => p.life-- > 0 && p.y < cf.height + 20);
  for (const p of parts) { p.vy += .22; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; cg.save(); cg.translate(p.x, p.y); cg.rotate(p.r); cg.fillStyle = p.c; if (p.tri) { cg.beginPath(); cg.moveTo(0, -p.s); cg.lineTo(p.s, p.s); cg.lineTo(-p.s, p.s); cg.fill(); } else cg.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .7); cg.restore(); }
  if (parts.length) requestAnimationFrame(loopCf); else cfRun = false;
}

/* ---------------------------------------------------------
   6. STATIC NOISE (layar belakang kamera)
--------------------------------------------------------- */
const nz = $("#noise"), ng = nz.getContext("2d"); let noiseOn = false;
function noiseLoop() {
  if (!noiseOn) return; const id = ng.createImageData(96, 96);
  for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255 | 0; id.data[i] = v; id.data[i + 1] = v; id.data[i + 2] = v; id.data[i + 3] = 255; }
  const band = (performance.now() / 8 % 120) | 0;
  for (let y = band; y < band + 12 && y < 96; y++) for (let x = 0; x < 96; x++) { const k = (y * 96 + x) * 4; id.data[k] = 255; id.data[k + 1] = 110; id.data[k + 2] = 170; }
  ng.putImageData(id, 0, 0); requestAnimationFrame(noiseLoop);
}

/* ---------------------------------------------------------
   7. ALUR / SCENES
--------------------------------------------------------- */
let curScene = null;
function show(id) {
  $$(".scene").forEach(s => s.classList.remove("active"));
  curScene = $("#" + id); curScene.classList.add("active");
}
$("#helloTitle").textContent = `Hi ${C.name}, ready?`;

// -- intro -> loading
let started = false;
$("#btnStart").addEventListener("click", async () => {
  if (started) return; started = true;
  await Audio_.start(); Audio_.sfx("start");
  $("#signHello").hidden = true; $("#signLoad").hidden = false;
  const fill = $("#barFill"), txt = $("#loadTxt"); let p = 0;
  while (p < 100) { p = Math.min(100, p + 2 + Math.random() * 6); fill.style.width = p + "%"; txt.textContent = `${Math.round(p)}% · mohon tunggu…`; Audio_.sfx("tick"); await sleep(110); }
  await sleep(350); sceneCamera();
});

// -- kamera
async function sceneCamera() {
  show("s-cam"); const cam = $("#cam"); cam.className = "cam pop"; $("#screenTxt").className = "cb-txt"; $("#screenTxt").textContent = "";
  await sleep(1500);
  cam.classList.remove("pop"); cam.classList.add("shake"); Audio_.sfx("shutter"); $("#flash").classList.remove("go"); void $("#flash").offsetWidth; $("#flash").classList.add("go");
  await sleep(600); cam.classList.remove("shake"); Audio_.sfx("flip"); cam.classList.add("flipped");
  await sleep(900); noiseOn = true; noiseLoop(); Audio_.sfx("static");
  await sleep(1500);
  const t = $("#screenTxt"); t.textContent = "HAPPY BIRTHDAY"; t.classList.add("show");
  await sleep(1500); noiseOn = false;
  sceneBday();
}

// -- happy birthday
function sceneBday() {
  show("s-bday"); Audio_.sfx("pop"); setTimeout(() => { burst(140, .5, .4); rain(5); }, 150);
}
$("#btnBdayNext").addEventListener("click", () => { Audio_.sfx("blip"); sceneGallery(0); });

// -- galeri
let gi = 0, busy = false;
async function sceneGallery(i) {
  gi = i; show("s-gal"); $$("#navDots i").forEach((d, k) => d.classList.toggle("on", k === i));
  $("#momentTxt").textContent = `Moment ${i + 1} / ${C.moments.length}`;
  const m = C.moments[i]; $("#gTitle").textContent = m.title; $("#gSub").textContent = m.cap; $("#gCap").textContent = m.cap;
  const img = $("#gImg"); img.src = photoSrc(i);
  const tc = $("#titleCard"), fw = $("#frameWrap");
  tc.classList.remove("hide"); fw.classList.remove("show");
  $("#btnPrev").style.visibility = i === 0 ? "hidden" : "visible";
  await sleep(1700); if (gi !== i) return;
  tc.classList.add("hide"); Audio_.sfx("shutter"); $("#flash").classList.remove("go"); void $("#flash").offsetWidth; $("#flash").classList.add("go");
  fw.classList.add("show"); burst(22, .5, .4);
}
$("#btnNext").addEventListener("click", () => { Audio_.sfx("blip"); if (gi < C.moments.length - 1) sceneGallery(gi + 1); else scenePrint(); });
$("#btnPrev").addEventListener("click", () => { Audio_.sfx("blip"); if (gi > 0) sceneGallery(gi - 1); });
$("#btnMusic").addEventListener("click", e => { const on = Audio_.toggle(); e.target.textContent = on ? "MUSIK ON" : "MUSIK OFF"; });

// -- cetak foto & surat
function buildPaper() {
  $("#pImg").src = C.printPhoto || photoSrc(0);
  $("#l1txt").textContent = C.letters[0].text; $("#l2txt").textContent = C.letters[1].text;
  $("#pL1 h4").textContent = C.letters[0].title; $("#pL2 h4").textContent = C.letters[1].title;
  const ul = $("#plist"); ul.innerHTML = "";
  const hue = [330, 200, 20, 280, 340];
  C.playlist.forEach((s, i) => {
    const li = document.createElement("li");
    const cv = document.createElement("canvas"); cv.width = cv.height = 10;
    const g = cv.getContext("2d"); for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) { g.fillStyle = `hsl(${hue[i % 5] + x * 3},55%,${35 + y * 4}%)`; g.fillRect(x, y, 1, 1); }
    const im = new Image(); im.src = cv.toDataURL();
    li.appendChild(im); li.insertAdjacentHTML("beforeend", `<div><b>${s.t}</b><small>${s.a}</small></div><em>▶</em>`);
    ul.appendChild(li);
  });
}
let printed = false;
async function scenePrint() {
  printed = false; buildPaper(); show("s-print");
  { const st = $("#stack"); st.style.setProperty("--fit", 1); const avail = innerHeight - st.getBoundingClientRect().top - 52; st.style.setProperty("--fit", Math.min(1, avail / st.offsetHeight).toFixed(3)); }
  const ct = $("#camTop"); ct.className = "cam-top"; void ct.offsetWidth; ct.classList.add("in");
  $$(".paper").forEach(p => p.classList.remove("out")); $("#hint").classList.remove("show");
  await sleep(1300);
  ct.classList.add("vib"); Audio_.sfx("print");
  await sleep(500); $("#pPhoto").classList.add("out");
  await sleep(1500); Audio_.sfx("print"); $("#pL1").classList.add("out");
  await sleep(1500); Audio_.sfx("print"); $("#pL2").classList.add("out");
  await sleep(1500); Audio_.sfx("print"); $("#pPl").classList.add("out");
  await sleep(1200); ct.classList.remove("vib");
  $("#hint").classList.add("show"); printed = true;
}
$("#s-print").addEventListener("click", async () => {
  if (!printed) return; printed = false; Audio_.sfx("blip");
  $("#hint").classList.remove("show");
  show("s-endcam"); const c2 = $("#cam2"); c2.classList.remove("flipped"); void c2.offsetWidth; c2.classList.add("flipped");
  Audio_.sfx("flip"); await sleep(1700); Audio_.sfx("end");
  await sleep(1400); show("s-end");
});
$("#btnRestart").addEventListener("click", () => { started = false; Audio_.sfx("blip"); $("#signHello").hidden = false; $("#signLoad").hidden = true; $("#barFill").style.width = "0"; show("s-intro"); });

// debug: ?scene=cam|bday|gal|print|end untuk preview cepat
const q = new URLSearchParams(location.search).get("scene");
if (q) { started = true; ({ cam: sceneCamera, bday: sceneBday, gal: () => sceneGallery(0), print: scenePrint, end: () => show("s-end") })[q]?.(); }
})();