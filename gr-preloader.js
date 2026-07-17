/* ===== GRODZISKI RZEŹNIK — PRELOADER (self-contained, portable) =====
   Strona pokazuje się dopiero, gdy wczytają się WSZYSTKIE zdjęcia z listy poniżej —
   above-fold (logo, hero, karty "O nas"), CAŁA Galeria (16 zdjęć, także te ukryte pod
   "Zobacz więcej") ORAZ zakładki Oferty "Wędliny" i "Wyroby garmażeryjne" (11 produktów,
   oba warianty jasny/ciemny). Dzięki temu pierwsze kliknięcie "Zobacz więcej" / tych
   zakładek pokazuje zdjęcia natychmiast z cache przeglądarki, bez doczytywania.
   Pasek postępu odzwierciedla realny % wczytanych obrazów. Timeout 9 s jako bezpiecznik. */
(function () {
  // Resolve theme FIRST and stamp <html data-theme> before first paint (kills theme flash).
  var theme = 'light';
  try { if (localStorage.getItem('gr-theme') === 'dark') theme = 'dark'; } catch (e) {}
  try { document.documentElement.setAttribute('data-theme', theme); } catch (e) {}

  // Background-preload BOTH theme versions of key images so a theme toggle swaps instantly.
  try {
    ['uploads/zdjecia/hero-glowna.webp', 'uploads/hero-glowna-jasna.webp',
     './lokal-mrghfios.webp', 'uploads/kontakt-budynek-jasna.webp',
     'uploads/zdjecia/asystent-awatar.webp', 'uploads/asystent-awatar-jasna.webp'
    ].forEach(function (u) { var i = new Image(); i.src = u; });
  } catch (e) {}

  var isLight = theme === 'light';

  // ── Lista obrazów, których pełne wczytanie decyduje o zniknięciu preloadera ──
  var LOGO = 'uploads/logo-17c7c13c.png';
  // above-the-fold: logo, hero (wg motywu) + wszystkie karty sekcji "O nas"
  var KEY = [
    LOGO,
    isLight ? 'uploads/hero-glowna-jasna.webp' : 'uploads/zdjecia/hero-glowna.webp',
    'uploads/onas-mieso-real.webp',
    'uploads/onas-wedliny-real.webp',
    'uploads/onas-sery-real.webp',
    'uploads/onas-produkty-swiata-real.webp',
    'uploads/onas-steki-real.webp',
    'uploads/onas-wina-real.webp'
  ];
  // CAŁA Galeria — 9 produktowych + 7 lokal (również ukryte pod "Zobacz więcej").
  // Trzymać zsynchronizowane z tablicą galleryAll w Grodziski Rzeznik.dc.html / index.html.
  var GALLERY = [
    'produkt-01', 'produkt-04', 'produkt-05', 'produkt-08', 'produkt-11',
    'produkt-12', 'produkt-14', 'produkt-16', 'produkt-19',
    'lokal-01', 'lokal-03', 'lokal-06', 'lokal-08', 'lokal-09', 'lokal-12', 'lokal-14'
  ].map(function (n) { return 'uploads/galeria/' + n + '.webp'; });

  // Zakładki Oferty "Wędliny" (8) + "Wyroby garmażeryjne" (3) — OBA warianty (ciemny/jasny),
  // żeby pierwsze kliknięcie tych zakładek nie miało laga, niezależnie od aktywnego motywu.
  // Trzymać zsynchronizowane z tablicą products (cat:'wedliny'/'garmaz') w Grodziski Rzeznik.dc.html.
  var WEDLINY_GARMAZ_NAMES = [
    'wedliny-szynka-debowa', 'wedliny-szynka-dojrzewajaca', 'wedliny-szynka-pieczona',
    'wedliny-schab-eko', 'wedliny-poledwica-drobiowa', 'wedliny-baleron-debowy',
    'wedliny-frankfurterka', 'wedliny-kabanos-premium',
    'wedliny-pasztet-gesi', 'wedliny-pasztetowa-wedzona', 'wedliny-kaszanka'
  ];
  var WEDLINY_GARMAZ = WEDLINY_GARMAZ_NAMES.map(function (n) { return 'uploads/zdjecia/' + n + '.webp'; })
    .concat(WEDLINY_GARMAZ_NAMES.map(function (n) { return 'uploads/' + n + '-jasna.webp'; }));

  var ALL = KEY.concat(GALLERY).concat(WEDLINY_GARMAZ);

  // Na kolejnych wejściach w tej samej sesji obrazy są już w cache — pomiń preloader,
  // ale wystartuj ciche pobranie Galerii + Wędlin/Garmażu (na wszelki wypadek), żeby zawsze były gotowe.
  try {
    if (sessionStorage.getItem('gr-preloaded') === '1') {
      GALLERY.concat(WEDLINY_GARMAZ).forEach(function (u) { var i = new Image(); i.src = u; });
      return;
    }
  } catch (e) {}

  var reduce = false;
  try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var bg = isLight ? '#EEE6D6' : '#14100C';
  var track = isLight ? 'rgba(74,48,20,.16)' : 'rgba(240,231,216,.14)';
  var fill = isLight ? '#8C2F33' : '#C6A15E';
  var txt = isLight ? '#6A4A22' : '#C6A15E';

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
  var done = 0, total = ALL.length, finished = false;

  function setBar(p) { if (bar) bar.style.width = Math.round(p * 100) + '%'; }
  function tick() {
    done++;
    setBar(done / total);
    if (done >= total) finish();
  }
  function finish() {
    if (finished) return; finished = true;
    try { sessionStorage.setItem('gr-preloaded', '1'); } catch (e) {}
    setBar(1);
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, reduce ? 0 : 420);
    }, reduce ? 0 : 180);
  }

  // Każdy obraz zgłasza się przez onload/onerror (błąd też liczymy, żeby pasek nie utknął).
  ALL.forEach(function (src) {
    var im = new Image();
    im.onload = tick; im.onerror = tick;
    im.src = src;
  });

  // Bezpiecznik: gdyby któreś zdjęcie nie doszło (błąd sieci), po 9 s i tak pokaż stronę.
  setTimeout(finish, 9000);
})();
