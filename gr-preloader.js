/* ===== GRODZISKI RZEŹNIK — PRELOADER (self-contained, portable) ===== */
(function () {
  try {
    if (sessionStorage.getItem('gr-preloaded') === '1') return;
  } catch (e) {}

  var theme = 'dark';
  try { if (localStorage.getItem('gr-theme') === 'light') theme = 'light'; } catch (e) {}
  var reduce = false;
  try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var isLight = theme === 'light';
  var bg = isLight ? '#EEE6D6' : '#14100C';
  var track = isLight ? 'rgba(74,48,20,.16)' : 'rgba(240,231,216,.14)';
  var fill = isLight ? '#8C2F33' : '#C6A15E';
  var txt = isLight ? '#6A4A22' : '#C6A15E';

  var LOGO = 'uploads/logo-17c7c13c.png';
  var KEY = [
    LOGO,
    isLight ? 'uploads/hero-glowna-jasna.png' : 'uploads/zdjecia/hero-glowna.png',
    'uploads/zdjecia/onas-mieso.png',
    'uploads/zdjecia/onas-wedliny.png',
    'uploads/zdjecia/onas-sery.png'
  ];

  var el = document.createElement('div');
  el.id = 'gr-preloader';
  el.setAttribute('style', [
    'position:fixed', 'inset:0', 'z-index:99999', 'display:flex',
    'flex-direction:column', 'align-items:center', 'justify-content:center',
    'gap:26px', 'background:' + bg,
    'transition:opacity .38s ease', 'opacity:1'
  ].join(';'));

  var floatAnim = reduce ? '' : 'animation:grPreFloat 2.4s ease-in-out infinite';
  var barTrans = reduce ? '' : 'transition:width .3s ease';
  el.innerHTML =
    '<img src="' + LOGO + '" alt="Grodziski Rzeznik" style="width:132px;height:auto;filter:drop-shadow(0 12px 24px rgba(0,0,0,.5));' + floatAnim + '">' +
    '<div style="width:210px;height:4px;border-radius:999px;background:' + track + ';overflow:hidden">' +
      '<div id="gr-pre-bar" style="height:100%;width:0%;background:' + fill + ';border-radius:999px;' + barTrans + '"></div>' +
    '</div>' +
    '<div style="font-family:\'Playfair Display\',serif;font-style:italic;font-size:15px;letter-spacing:.5px;color:' + txt + '">Premium delikatesy mięsne</div>';

  var styleTag = document.createElement('style');
  styleTag.textContent = '@keyframes grPreFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}';
  el.appendChild(styleTag);

  function mount() {
    if (document.body && !document.getElementById('gr-preloader')) document.body.appendChild(el);
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  var bar = el.querySelector('#gr-pre-bar');
  var done = 0, total = KEY.length, finished = false;

  function setBar(p) { if (bar) bar.style.width = Math.round(p * 100) + '%'; }
  function tick() { done++; setBar(done / total); if (done >= total) finish(); }
  function finish() {
    if (finished) return; finished = true;
    try { sessionStorage.setItem('gr-preloaded', '1'); } catch (e) {}
    setBar(1);
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, reduce ? 0 : 420);
    }, reduce ? 0 : 180);
  }

  KEY.forEach(function (src) {
    var im = new Image();
    im.onload = tick; im.onerror = tick;
    im.src = src;
  });
  window.addEventListener('load', finish);
  setTimeout(finish, 6000);
})();
