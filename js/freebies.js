/* ============================================================
   ARCHIVAMILE — FREEBIES / FREE DROP page script
   ============================================================ */

/* ============================================================
   KONFIGURASI FORM REQUEST ASET
   ------------------------------------------------------------
   1. REQUEST_WA    : nomor WhatsApp tujuan. ISI DI SINI dengan
                      format 62 tanpa tanda +, contoh: '6281234567890'
                      (kosongkan kalau belum mau pakai WhatsApp)
   2. REQUEST_EMAIL : email tujuan jika WhatsApp dikosongkan.
   ============================================================ */
const REQUEST_WA = '';
const REQUEST_EMAIL = 'aziz@archivamile.my.id';

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- INTRO ---------- */
  const intro = document.getElementById('intro');
  const navbar = document.getElementById('navbar');
  const introName = document.getElementById('introName');

  const name = introName.textContent.trim();
  introName.textContent = '';
  [...name].forEach((ch, i) => {
    const s = document.createElement('span');
    if (ch !== ' ') s.textContent = ch;
    else s.innerHTML = '&nbsp;';
    s.style.animationDelay = (0.2 + i * 0.08) + 's';
    introName.appendChild(s);
  });

  document.documentElement.classList.add('no-scroll');

  let entered = false;
  const enterIntro = () => {
    if (entered) return;
    entered = true;
    intro.classList.add('exiting');
    setTimeout(() => intro.classList.add('done'), 1150);
    setTimeout(() => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.add('entered');
      navbar.classList.add('loaded');
    }, 980);
  };

  setTimeout(() => introName.classList.add('glitching'), 1600);
  setTimeout(enterIntro, 2600);

  document.getElementById('introSkip').addEventListener('click', (e) => {
    e.stopPropagation();
    enterIntro();
  });
  intro.addEventListener('click', enterIntro);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') enterIntro();
  });

  /* ---------- TV STATIC OVERLAY ---------- */
  const tv = document.createElement('div');
  tv.className = 'tv-static';
  document.body.appendChild(tv);

  /* ---------- THEME TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeFlash = document.getElementById('themeFlash');

  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('zzz-theme', next);

    themeFlash.classList.add('show');
    setTimeout(() => themeFlash.classList.remove('show'), 280);
  });

  /* ---------- NAVBAR SCROLL ---------- */
  const scrollBar = document.getElementById('scrollBar');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (y / h * 100) + '%';

    navbar.classList.toggle('scrolled', y > 40);

    if (y > lastScroll && y > 200 && !mobileMenu.classList.contains('open')) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    lastScroll = y;
  });

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById('burger');

  burger.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ---------- FILTER KATEGORI ---------- */
  const filterBtns = document.querySelectorAll('.fd-filter-btn');
  const cards = document.querySelectorAll('.fd-card');
  const count = document.getElementById('fdCount');

  const applyFilter = (cat) => {
    let shown = 0;
    cards.forEach((card, i) => {
      const visible = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('hide', !visible);
      card.classList.toggle('show', visible);
      if (visible) {
        card.style.animationDelay = (i % 3) * 0.07 + 's';
        shown++;
      }
    });
    count.textContent = String(shown).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  /* ---------- NAV INDICATOR (slider mengikuti link, sama seperti home) ---------- */
  const indicator = document.getElementById('navIndicator');
  const navLinks = document.querySelectorAll('.nav-link');
  const moveIndicator = (link) => {
    if (!indicator || !link || window.innerWidth <= 768) return;
    indicator.style.left = link.offsetLeft + 'px';
    indicator.style.width = link.offsetWidth + 'px';
  };
  moveIndicator(document.querySelector('.nav-link.active'));
  window.addEventListener('resize', () => {
    const act = document.querySelector('.nav-link.active');
    if (act) moveIndicator(act);
  });
  navLinks.forEach(l => {
    l.addEventListener('mouseenter', () => moveIndicator(l));
    l.addEventListener('mouseleave', () => {
      const act = document.querySelector('.nav-link.active');
      if (act) moveIndicator(act);
    });
  });

  /* ---------- MOUSE PARALLAX (judul mengikuti kursor) ---------- */
  const fdHero = document.querySelector('.fd-hero');
  const fdHeroInner = document.querySelector('.fd-hero-inner');
  fdHero.addEventListener('mousemove', (e) => {
    const r = fdHero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    fdHeroInner.style.transform = 'translate(' + (x * 26).toFixed(1) + 'px,' + (y * 18).toFixed(1) + 'px)';
  });
  fdHero.addEventListener('mouseleave', () => {
    fdHeroInner.style.transform = '';
  });

  /* ---------- DOWNLOAD BUTTON (cegah lompat ke atas jika link belum diisi) ---------- */
  document.querySelectorAll('.fd-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '#' || btn.getAttribute('href') === '') {
        e.preventDefault();
      }
    });
  });

  /* ---------- FORM REQUEST ASET (kirim ke WhatsApp / Email + animasi sukses) ---------- */
  const reqForm = document.getElementById('reqForm');
  const reqInput = document.getElementById('reqInput');
  const reqOk = document.getElementById('reqOk');
  if (reqForm) {
    reqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = reqInput.value.trim();
      if (!val) return;

      const msg = 'Halo Archivamile! Aku minta aset gratis di FREE DROP: ' + val + ' — terima kasih!';
      if (REQUEST_WA) {
        window.open('https://wa.me/' + REQUEST_WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      } else {
        window.open('mailto:' + REQUEST_EMAIL +
          '?subject=' + encodeURIComponent('Permintaan Aset // FREE DROP') +
          '&body=' + encodeURIComponent(msg), '_blank', 'noopener');
      }

      reqForm.classList.add('hide');
      reqOk.classList.remove('show');
      void reqOk.offsetWidth;
      reqOk.classList.add('show');
    });
  }

  /* ---------- CUSTOM CURSOR ---------- */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
  });

  const loop = () => {
    cx += (mx - cx) * .16;
    cy += (my - cy) * .16;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll('a, button, input, textarea, .fd-card, .channel').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });

  /* ---------- TRANSISI HALUS ANTAR HALAMAN (fade out sebelum pindah) ---------- */
  document.querySelectorAll('a[href$=".html"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.indexOf('://') !== -1) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(() => { window.location.href = href; }, 320);
    });
  });
});
