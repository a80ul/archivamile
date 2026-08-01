/* ============================================================
   ARCHIVAMILE — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 600);
  });
  setTimeout(() => preloader.classList.add('done'), 3000); // fallback

  /* ---------- TV STATIC OVERLAY ---------- */
  const tv = document.createElement('div');
  tv.className = 'tv-static';
  document.body.appendChild(tv);

  /* ---------- THEME TOGGLE (light / dark) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeFlash = document.getElementById('themeFlash');

  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('zzz-theme', next);

    // ZZZ channel-flip flash
    themeFlash.classList.add('show');
    setTimeout(() => themeFlash.classList.remove('show'), 280);
  });

  /* ---------- NAVBAR: reveal, hide-on-scroll-down, show-on-up ---------- */
  const navbar = document.getElementById('navbar');
  const scrollBar = document.getElementById('scrollBar');
  let lastScroll = 0;

  requestAnimationFrame(() => navbar.classList.add('loaded'));
  setTimeout(() => navbar.classList.add('loaded'), 120);

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // progress bar
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (y / h * 100) + '%';

    // scrolled state
    navbar.classList.toggle('scrolled', y > 40);

    // hide/show
    if (y > lastScroll && y > 200 && !mobileMenu.classList.contains('open')) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    lastScroll = y;

    // HUD signal flicker
    const signal = document.getElementById('signal');
    if (Math.random() > .94) signal.textContent = 'ERR';
    else signal.textContent = 'OK';
  });

  /* ---------- SCROLLSPY (active nav link) ---------- */
  const links = document.querySelectorAll('.nav-link');
  const sections = ['home', 'about', 'skills', 'projects', 'contact'];

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
        const frame = document.getElementById('frame');
        if (frame) frame.textContent = String(sections.indexOf(e.target.id) + 1).padStart(2, '0');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

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

  /* ---------- COUNTERS ---------- */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target; return; }
        el.textContent = cur;
        requestAnimationFrame(tick);
      };
      tick();
      counterObs.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

  /* ---------- SKILL BARS ---------- */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const bar = e.target;
      const width = bar.dataset.width;
      const val = bar.closest('.skill-card').querySelector('.skill-val');
      bar.style.width = width + '%';
      let cur = 0;
      const target = +width;
      const tick = () => {
        cur += Math.max(1, Math.round(target / 45));
        if (cur >= target) { val.textContent = target + '%'; return; }
        val.textContent = cur + '%';
        requestAnimationFrame(tick);
      };
      setTimeout(tick, 250);
      skillObs.unobserve(bar);
    });
  }, { threshold: .4 });
  document.querySelectorAll('.skill-bar i').forEach(el => skillObs.observe(el));

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

  document.querySelectorAll('a, button, input, textarea, .proj-card, .channel').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
  });

  /* ---------- CONTACT FORM ---------- */
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.form-btn');
    btn.textContent = 'SINYAL TERKIRIM ✓';
    btn.style.background = '#16a34a';
    setTimeout(() => {
      btn.textContent = 'Kirim Sinyal';
      btn.style.background = '';
      e.target.reset();
    }, 2600);
  });
});
