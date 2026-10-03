/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'panificio-zilio',
    /* nessun WhatsApp dichiarato: il telefono */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (2/10/2026): lunedì 7:30–13 · martedì–sabato 7:30–13 e 16–19 · domenica chiuso */
    hours: {
      0: [],
      1: [['07:30', '13:00']],
      2: [['07:30', '13:00'], ['16:00', '19:00']], 3: [['07:30', '13:00'], ['16:00', '19:00']], 4: [['07:30', '13:00'], ['16:00', '19:00']], 5: [['07:30', '13:00'], ['16:00', '19:00']], 6: [['07:30', '13:00'], ['16:00', '19:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Panificio Pasticceria Zilio: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.giorni": "Every day",
      "n.feste": "The holidays",
      "n.campana": "The bell",
      "n.recensioni": "Reviews",
      "n.orari": "Hours",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "t.orari": "Hours",
      "h.occhio": "Bakery and pastry shop in Ponte Lambro",
      "h.frase": "Every morning’s bread, pizzas and focaccia, the pastries. And on what leaves our counter we put our golden seal.",
      "h.n": "4.7",
      "h.voto": "on Google, 58 reviews",
      "a.confezione": "A loaf cake dusted with icing sugar on a golden tray, wrapped in cellophane with a knotted gold ribbon and the oval golden seal of Panificio Pasticceria Zilio.",
      "h.fconfezione": "The loaf cake with the ribbon and the seal, as it left the counter (photo by Daniela B.)",
      "p.aria": "A customer’s words",
      "p.fonte": "on Google, 2026",
      "g.occhio": "Every day",
      "g.titolo": "Sweet or savoury",
      "g.v1": "Bread",
      "g.v1t": "Every morning’s bread, in many kinds.",
      "g.v2": "Pizzas and focaccia",
      "g.v2t": "Pizzas and focaccia: some people take them for their parties too.",
      "g.v3": "Pastries",
      "g.v3t": "Shortbread, biscuits and jam tarts on the counter; cream horns; cakes, with our little chocolate plaque on top; chocolate discs with the seal.",
      "a.torta": "A cake in a chocolate bowl covered with white chocolate curls, with the oval plaque Pasticceria Zilio; next to it a tray of cream horns.",
      "g.ftorta": "The cake with white chocolate curls and the cream horns (photo by Luca E.)",
      "a.frolle": "The glass counter: trays of shortbread, biscuits and puff pastries and, below, three lattice jam tarts.",
      "g.ffrolle": "Shortbread, biscuits and jam tarts on the counter",
      "a.dischi": "Two chocolate discs in cellophane, one white with strawberries and one milk, each with the oval golden seal.",
      "g.fdischi": "The chocolate discs, white with strawberries and milk",
      "f.occhio": "The holidays",
      "f.titolo": "Every holiday changes the counter",
      "f.intro": "On our holiday cakes we write the greetings in chocolate, on a white plaque with a zigzag edge. Below, the holidays as they come to our counter. To know what is there these days, call us: 02 504188.",
      "a.chiacchiere": "Chiacchiere, fried pastry ribbons dusted with icing sugar, piled in a wicker basket on the glass shelf.",
      "f.1": "Carnival",
      "f.1t": "Chiacchiere, the fried pastry ribbons dusted with icing sugar, in wicker baskets.",
      "a.cuori": "Puff pastry hearts with custard, whipped cream, wild strawberries and the oval chocolate plaque Pasticceria Zilio, on golden discs.",
      "f.2": "Valentine’s Day",
      "f.2t": "Puff pastry hearts with custard, cream and wild strawberries. On top, our little chocolate plaque.",
      "a.colombe": "On the upper shelf the colomba cakes glazed with sugar grains, in cellophane; below, the cakes with white chocolate curls.",
      "a.campane": "Four chocolate bells with white dots and a white bow, on golden cardboard.",
      "f.3": "Easter",
      "f.3t": "Colomba cakes with their glaze and sugar grains. And chocolate: the dotted bells with a bow, the ones with hearts, the eggs.",
      "a.zucche": "Shortbread biscuits with a Halloween pumpkin, among the little cakes and the chocolate squares.",
      "f.4": "Halloween",
      "f.4t": "Shortbread biscuits with the pumpkin, on the counter among the little cakes.",
      "a.capovolti": "Freshly baked panettoni, skewered and hung upside down on rods to cool, in the bakery.",
      "a.natale": "A Christmas cake wrapped in chocolate, with icing sugar, little chocolate trees, redcurrants and the oval plaque Pasticceria Zilio Milano.",
      "a.pbanco": "Panettoni in cellophane with a little gold bow, on the glass shelves of the counter.",
      "f.5": "Christmas",
      "f.5t": "We make our own panettoni: fresh from the oven we skewer them and hang them upside down to cool, then they go on the counter in cellophane. And pandoro, and cakes decorated with chocolate.",
      "c.occhio": "The bell",
      "c.titolo2": "Dots or hearts",
      "c.intro": "At Easter the glass shelf holds the chocolate bells: dark ones with white dots and a bow, milk ones with hearts. Here we have drawn one: the decorations settle one by one and, when it is finished, it rings.",
      "c.titolo": "The chocolate bell",
      "c.desc": "A dark chocolate bell on the golden cardboard of the counter. The white dots settle one by one, from top to bottom; the white bow comes last. Then the bell rings: it swings and stops. In the second mode the bell is milk chocolate and instead of dots there are white hearts.",
      "c.d0": "Dots: the dark bell, the white dots one by one, the bow on top. Then it rings.",
      "c.d1": "Hearts: the milk chocolate bell and the white hearts, one by one. Then it rings.",
      "c.modi": "The decoration of the bell",
      "c.b0": "Dots",
      "c.b1": "Hearts",
      "r.occhio": "Reviews",
      "r.titolo": "People who came to the counter",
      "r.g19": "Google, 2019",
      "r.g20": "Google, 2020",
      "r.g22": "Google, 2022",
      "r.g24": "Google, 2024",
      "r.g26": "Google, 2026",
      "r.nota": "From the reviews on Google, as they were written, in Italian; […] where we shortened them.",
      "r.tutte": "All the reviews on Google",
      "o.occhio": "Hours and directions",
      "o.titolo": "From half past seven",
      "o.orari": "Hours",
      "o.cap": "Opening hours",
      "o.nota": "Hours from our Google listing (October 2026).",
      "d.lun": "Monday",
      "d.mar": "Tuesday",
      "d.mer": "Wednesday",
      "d.gio": "Thursday",
      "d.ven": "Friday",
      "d.sab": "Saturday",
      "d.dom": "Sunday",
      "d.chiuso": "closed",
      "w.dove": "Where",
      "w.dovev": "Via Privata Montecassino 19, 20138 Milan (Ponte Lambro)",
      "w.bus": "Bus",
      "w.busv": "the 66 and the 88, Via Vittorini – Via Umiliati stop, about 65 metres away; the 45 and the 175, Via Ucelli di Nemi – Via Serrati stop, about 160 metres away",
      "w.metro": "Metro",
      "w.metrov": "from San Donato (M3) by bus 45",
      "w.tel": "Phone",
      "w.mappa": "Map: Panificio Pasticceria Zilio, Via Privata Montecassino 19, Milan",
      "q.occhio": "Questions",
      "q.titolo": "Before you drop by",
      "q.d1": "Do you make holiday cakes?",
      "q.r1": "Yes: chiacchiere at Carnival, hearts on Valentine’s Day, colomba cakes and chocolate bells at Easter, pumpkin biscuits at Halloween, panettoni and pandoro at Christmas. To know what is on the counter these days, call 02 504188.",
      "q.d2": "Do you make the panettoni yourselves?",
      "q.r2": "Yes, in our own bakery: fresh from the oven we skewer them and hang them upside down to cool.",
      "q.d3": "Besides sweets, is there savoury food too?",
      "q.r3": "Yes: bread, pizzas and focaccia.",
      "q.d4": "When are you open?",
      "q.r4": "On Mondays from 7:30am to 1pm. Tuesday to Saturday from 7:30am to 1pm and from 4pm to 7pm. On Sundays we are closed.",
      "q.d5": "How do I get there?",
      "q.r5": "We are at Via Privata Montecassino 19, in Ponte Lambro. Buses 66 and 88 stop at Via Vittorini – Via Umiliati, about 65 metres away; the 45 and the 175 at Via Ucelli di Nemi – Via Serrati, about 160 metres away.",
      "f2.orario": "Monday <span class=\"intero\">7:30am–1pm</span> · Tuesday–Saturday <span class=\"intero\">7:30am–1pm</span> and <span class=\"intero\">4pm–7pm</span> · closed on Sundays",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · hours, rating and reviews from the Google listing (October 2026). The photos are from the Google listing: those of the counter by the customers Daniela B. and Luca E., the one of the bakehouse by the Panificio itself. Seal and bell redrawn by Bespoke Studio.",
      "f2.su": "Back to top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ PANIFICIO PASTICCERIA ZILIO — forno e pasticceria, Via Privata Montecassino 19 ══════════
     la FIRMA — «la campana»: la campana di cioccolato di Pasqua delle loro foto, sul cartone dorato. I decori bianchi si posano uno
     a uno dall'alto in basso, per ultimo il fiocco; poi la campana suona (dondola appesa alla cima, sempre meno, e si ferma). Lo
     stato è M (A pois / Coi cuori), T (0…1) e V (0 al suo posto; fino a 1 la campana sale di poco e si spegne; da −1 a 0 arriva la
     prossima, nuda). Senza JS e alla fine: A pois, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la campana nuda.
     Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante
     l'animazione la ferma dov'è. */
  var DATI = {"vb":[640,516],"via":-14,"perno":[320,150],"modi":[{"nome":"A pois","decori":[{"x":320,"y":151,"dx":0,"dy":-18,"s0":0,"w":[0.05,0.09]},{"x":250,"y":322,"dx":0,"dy":-18,"s0":0,"w":[0.085,0.09]},{"x":290,"y":322,"dx":0,"dy":-18,"s0":0,"w":[0.121,0.09]},{"x":350,"y":322,"dx":0,"dy":-18,"s0":0,"w":[0.156,0.09]},{"x":390,"y":322,"dx":0,"dy":-18,"s0":0,"w":[0.192,0.09]},{"x":232,"y":376,"dx":0,"dy":-18,"s0":0,"w":[0.227,0.09]},{"x":266,"y":376,"dx":0,"dy":-18,"s0":0,"w":[0.262,0.09]},{"x":320,"y":376,"dx":0,"dy":-18,"s0":0,"w":[0.298,0.09]},{"x":374,"y":376,"dx":0,"dy":-18,"s0":0,"w":[0.333,0.09]},{"x":408,"y":376,"dx":0,"dy":-18,"s0":0,"w":[0.368,0.09]},{"x":228,"y":428,"dx":0,"dy":-18,"s0":0,"w":[0.404,0.09]},{"x":290,"y":430,"dx":0,"dy":-18,"s0":0,"w":[0.439,0.09]},{"x":350,"y":430,"dx":0,"dy":-18,"s0":0,"w":[0.475,0.09]},{"x":412,"y":432,"dx":0,"dy":-18,"s0":0,"w":[0.51,0.09]},{"x":320,"y":258,"dx":0,"dy":-70,"s0":1,"w":[0.6,0.12]}],"suona":[0.74,0.26],"ampiezza":9,"rintocchi":3},{"nome":"Coi cuori","decori":[{"x":320,"y":151,"dx":0,"dy":-18,"s0":0,"w":[0.05,0.12]},{"x":358,"y":252,"dx":0,"dy":-18,"s0":0,"w":[0.129,0.12]},{"x":292,"y":286,"dx":0,"dy":-18,"s0":0,"w":[0.207,0.12]},{"x":362,"y":344,"dx":0,"dy":-18,"s0":0,"w":[0.286,0.12]},{"x":262,"y":372,"dx":0,"dy":-18,"s0":0,"w":[0.364,0.12]},{"x":322,"y":424,"dx":0,"dy":-18,"s0":0,"w":[0.443,0.12]},{"x":410,"y":428,"dx":0,"dy":-18,"s0":0,"w":[0.521,0.12]},{"x":234,"y":446,"dx":0,"dy":-18,"s0":0,"w":[0.6,0.12]}],"suona":[0.74,0.26],"ampiezza":9,"rintocchi":3}],"tempi":{"inizio":300,"campana":6000,"servi":420,"arriva":480,"campanaV":5000}};
  /* la campana a (M, T, V) — una sola fonte: la usano _zil_firma.mjs (l'HTML allo stato finale), main.js (via main.cjs) e la prova
     (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     La campana di cioccolato di Pasqua delle loro foto, sul cartone dorato: i decori bianchi si posano uno a uno dall'alto in basso
     (un piccolo rimbalzo), per ultimo il fiocco; poi la campana suona: dondola appesa alla cima, sempre meno, e si ferma dritta.
     Col V la campana sale di poco e si spegne; la prossima arriva, nuda. */
  function creaCampana(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w[0] + w[1] - 1e-9 ? 1 : c01((t - w[0]) / w[1]); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    /* il decoro si posa: cresce un po' oltre la sua misura e torna */
    var rimbalzo = function (u) { return u < .7 ? 1.15 * dolce(u / .7) : 1.15 - .15 * dolce((u - .7) / .3); };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var uno = function (cl, m, k) { return q('.' + cl + '[data-m="' + m + '"]' + (k === undefined ? '' : '[data-k="' + k + '"]')); };
    var pezzi = D.modi.map(function (M, m) {
      return {
        decori: M.decori.map(function (_, k) { return uno('cp-decoro', m, k); }),
        campana: uno('cp-campana', m), suono: uno('cp-suono', m)
      };
    });
    function disegna(m, t, v) {
      var P = pezzi[m], M = D.modi[m], k;
      /* i decori: da poco più su (dx, dy) al loro posto, da piccoli (s0) alla loro misura, col rimbalzo */
      for (k = 0; k < P.decori.length; k++) {
        var d = M.decori[k], u = fase(t, d.w), e = dolce(u), s = d.s0 + (1 - d.s0) * rimbalzo(u);
        P.decori[k].setAttribute('transform', 'translate(' + r1(d.x + d.dx * (1 - e)) + ' ' + r1(d.y + d.dy * (1 - e)) + ') scale(' + r3(s) + ')');
        P.decori[k].setAttribute('opacity', r3(Math.min(1, u * 4)));
      }
      /* la campana suona: dondola intorno alla cima, sempre meno; i segni del suono si vedono solo mentre dondola */
      var n = fase(t, M.suona), a = M.ampiezza * Math.sin(2 * Math.PI * M.rintocchi * n) * (1 - n) * (1 - n);
      P.campana.setAttribute('transform', 'rotate(' + r1(a) + ' ' + D.perno[0] + ' ' + D.perno[1] + ')');
      P.suono.setAttribute('opacity', r3(Math.sin(Math.PI * n)));
      /* col V la campana sale di poco e si spegne; la prossima arriva */
      servito.setAttribute('transform', 'translate(0 ' + r1(D.via * v) + ')');
      servito.setAttribute('opacity', r3(1 - Math.abs(v)));
    }
    var completo = !!servito && pezzi.every(function (P) { return P.campana && P.suono && P.decori.length > 0 && P.decori.every(Boolean); });
    return { disegna: disegna, pezzi: pezzi, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('campana-firma'), svgF = prendi('campanaSvg'), leggiF = prendi('campanaLeggi');
  var CAMPANA = svgF ? creaCampana(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.campana__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.campana__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    CAMPANA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) CAMPANA.disegna(k, 1, 0); });
    CAMPANA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la campana nuda */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la campana nuda */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.campana, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.campana });
  }
  /* il gesto: scegliere che cosa guardare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la scena scende e si spegne, arriva dall'alto la prossima, vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.campanaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && CAMPANA && CAMPANA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaCampana); } catch (e) {}
    window.__campana = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__campana.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la campana nuda */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__campana.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
