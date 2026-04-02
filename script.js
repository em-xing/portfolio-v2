/* ── Clock ── */
const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function tick() {
  const n  = new Date();
  const hh = String(n.getHours()).padStart(2,'0');
  const mm = String(n.getMinutes()).padStart(2,'0');
  const ss = String(n.getSeconds()).padStart(2,'0');
  const mo = String(n.getMonth()+1).padStart(2,'0');
  const dd = String(n.getDate()).padStart(2,'0');
  const yy = String(n.getFullYear()).slice(2);
  const ts = `${hh}:${mm}:${ss}`;
  const ds = `${yy}.${mo}.${dd}`;

  document.getElementById('top-t').textContent  = ts;
  document.getElementById('top-d').textContent  = ds;
  document.getElementById('sb-clk').textContent = `${hh}:${mm}`;
  document.getElementById('sb-dt').textContent  = `${DAYS[n.getDay()]} ${dd} ${MONS[n.getMonth()]} ${n.getFullYear()}`;
  document.getElementById('mf-d').textContent   = ds;
  document.querySelectorAll('.et').forEach(el => el.textContent = ts);
}
tick();
setInterval(tick, 1000);

/* ── Scroll: progress bar + TOC + frame counter ── */
const SECS = ['s1','s2','s3','s4','s5','s6'];
const NUMS  = { s1:'001', s2:'002', s3:'003', s4:'004', s5:'005', s6:'006' };

function onScroll() {
  const st  = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? Math.round((st / max) * 100) : 0;

  document.getElementById('top-pct').textContent = pct + '%';
  document.getElementById('prog-f').style.width  = pct + '%';

  let cur = SECS[0];
  for (const id of SECS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.42) cur = id;
  }

  const fr = `Frame ${NUMS[cur]}`;
  document.getElementById('top-frame').textContent = fr;
  document.getElementById('sb-frame').textContent  = fr;
  document.querySelectorAll('.sbl').forEach(a => a.classList.toggle('active', a.dataset.sec === cur));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Light / dark ── */
document.getElementById('mode-btn').addEventListener('click', () => {
  document.body.classList.toggle('light');
});

/* ── Hamburger ── */
document.getElementById('hburg').addEventListener('click', () => {
  document.getElementById('sb').classList.toggle('open');
});

/* ── Star canvas: warm teal-tinted twinkle ── */
const cv = document.getElementById('star-c');
const cx = cv.getContext('2d');

function rz() {
  cv.width  = cv.offsetWidth  * devicePixelRatio;
  cv.height = cv.offsetHeight * devicePixelRatio;
  cx.scale(devicePixelRatio, devicePixelRatio);
}
rz();
window.addEventListener('resize', rz);

const W  = () => cv.offsetWidth;
const H  = () => cv.offsetHeight;
const ST = Array.from({ length: 18 }, () => ({
  x:  Math.random(),
  y:  Math.random(),
  r:  Math.random() * 0.55 + 0.15,
  a:  Math.random() * 0.25 + 0.06,
  ph: Math.random() * Math.PI * 2,
  sp: 0.2 + Math.random() * 0.5,
}));

function draw(ts) {
  const w  = W(), h = H();
  const t  = ts * 0.001;
  const lm = document.body.classList.contains('light');

  cx.clearRect(0, 0, w, h);
  cx.fillStyle = lm ? 'rgba(208,202,232,1)' : 'rgba(6,5,3,1)';
  cx.fillRect(0, 0, w, h);

  ST.forEach(s => {
    const a = s.a * (0.4 + 0.6 * Math.sin(t * s.sp + s.ph));
    cx.beginPath();
    cx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
    cx.fillStyle = `rgba(138,184,176,${a})`;
    cx.fill();
  });

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
/* ── Map ── */
const map = L.map('map', {
  center: [30, 105],
  zoom: 3,
  scrollWheelZoom: false,
  zoomControl: true,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © CARTO',
  subdomains: 'abcd', maxZoom: 19
}).addTo(map);

const dotIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:9px; height:9px; border-radius:50%;
    background:var(--teal2); border:1.5px solid var(--ink);
    box-shadow:0 0 6px rgba(90,180,160,0.5);
  "></div>`,
  iconSize: [9,9], iconAnchor: [4,4], popupAnchor: [0,-8]
});

const places = [
  { coords: [31.2304, 121.4737], name: 'Shanghai',   note: 'Home.' },
  { coords: [39.9042, 116.4074], name: 'Beijing',    note: 'Where I grew up spending summers.' },
  { coords: [39.2904, -76.6122], name: 'Baltimore',  note: 'Johns Hopkins &amp; early research.' },
  { coords: [42.3601, -71.0589], name: 'Boston',     note: 'Harvard. Home now.' },
  { coords: [40.7128, -74.0060], name: 'New York',   note: 'Always a reason to visit.' },
];

places.forEach(p => {
  L.marker(p.coords, { icon: dotIcon })
   .addTo(map)
   .bindPopup(`<strong>${p.name}</strong><p>${p.note}</p>`);
});
