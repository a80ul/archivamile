/* ============================================================
   ARCHIVAMILE — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- INTRO ---------- */
  const intro = document.getElementById('intro');
  const navbar = document.getElementById('navbar');
  const introName = document.getElementById('introName');

  // split brand name letter by letter
  const name = introName.textContent.trim();
  introName.textContent = '';
  [...name].forEach((ch, i) => {
    const s = document.createElement('span');
    if (ch !== ' ') s.textContent = ch;
    else s.innerHTML = '&nbsp;';
    s.style.animationDelay = (0.2 + i * 0.08) + 's';
    introName.appendChild(s);
  });

  // lock scroll while intro is shown
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

  // glitch name after letters settle
  setTimeout(() => introName.classList.add('glitching'), 2000);

  // auto-enter after the intro sequence completes
  setTimeout(enterIntro, 3900);

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
  const scrollBar = document.getElementById('scrollBar');
  let lastScroll = 0;

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
        const act = links[0].parentElement.querySelector('.nav-link.active');
        if (act) moveIndicator(act);
        const frame = document.getElementById('frame');
        if (frame) frame.textContent = String(sections.indexOf(e.target.id) + 1).padStart(2, '0');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* ---------- NAV INDICATOR (slider) ---------- */
  const indicator = document.getElementById('navIndicator');
  const moveIndicator = (link) => {
    if (!indicator || !link || window.innerWidth <= 768) return;
    indicator.style.left = link.offsetLeft + 'px';
    indicator.style.width = link.offsetWidth + 'px';
  };
  moveIndicator(links[0]);
  window.addEventListener('resize', () => {
    const act = document.querySelector('.nav-link.active');
    if (act) moveIndicator(act);
  });
  links.forEach(l => {
    l.addEventListener('mouseenter', () => moveIndicator(l));
    l.addEventListener('mouseleave', () => {
      const act = document.querySelector('.nav-link.active');
      if (act) moveIndicator(act);
    });
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

  /* ---------- MINI GAME: ARSIP ARCADE (klik target) ---------- */
  const arena = document.getElementById('cgArena');
  const overlay = document.getElementById('cgOverlay');
  const startBtn = document.getElementById('cgStart');
  const scoreEl = document.getElementById('cgScore');
  const bestEl = document.getElementById('cgBest');
  const comboEl = document.getElementById('cgCombo');
  const timeEl = document.getElementById('cgTime');
  const result = document.getElementById('cgResult');
  const resultTitle = document.getElementById('cgResultTitle');
  const resultDesc = document.getElementById('cgResultDesc');
  const rsScore = document.getElementById('cgRS1');
  const rsCombo = document.getElementById('cgRS2');
  const rsBest = document.getElementById('cgRS3');
  const againBtn = document.getElementById('cgAgain');

  const GAME_TIME = 30;
  const TARGET_TTL = 1050;
  const GOLD_TTL = 700;
  const TARGET_SIZE = 46;

  let score = 0, timeLeft = GAME_TIME, combo = 0, comboMax = 0, best = 0;
  try { best = parseInt(localStorage.getItem('zzz-best'), 10) || 0; } catch (e) {}
  bestEl.textContent = best;

  let running = false, timeInt = null, spawnInt = null, lastMult = 1;

  const mult = () => 1 + Math.min(3, Math.floor(combo / 5));

  const popup = (x, y, txt) => {
    const r = arena.getBoundingClientRect();
    const p = document.createElement('span');
    p.className = 'cg-pop';
    p.textContent = txt;
    p.style.left = (x - r.left) + 'px';
    p.style.top = (y - r.top) + 'px';
    arena.appendChild(p);
    setTimeout(() => p.remove(), 700);
  };

  const burst = (x, y) => {
    const r = arena.getBoundingClientRect();
    const cx = x - r.left, cy = y - r.top;
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('i');
      s.className = 'cg-spark';
      const ang = (i / 8) * Math.PI * 2;
      const dist = 26 + Math.random() * 20;
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';
      s.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(0) + 'px');
      s.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(0) + 'px');
      arena.appendChild(s);
      setTimeout(() => s.remove(), 480);
    }
  };

  const multPop = (m) => {
    const p = document.createElement('span');
    p.className = 'cg-mult';
    p.textContent = 'MULTIPLIER x' + m + '!';
    arena.appendChild(p);
    setTimeout(() => p.remove(), 900);
  };

  const shake = () => {
    arena.classList.remove('shake');
    void arena.offsetWidth;
    arena.classList.add('shake');
  };

  const updateCombo = () => {
    comboEl.textContent = 'COMBO ' + combo;
    const m = mult();
    if (m > lastMult) {
      comboEl.classList.add('up');
      setTimeout(() => comboEl.classList.remove('up'), 700);
      multPop(m);
    }
    lastMult = m;
  };

  const spawnTarget = () => {
    if (!running) return;
    const r = arena.getBoundingClientRect();
    const maxX = r.width - TARGET_SIZE - 30;
    const maxY = r.height - TARGET_SIZE - 30;
    if (maxX <= 0 || maxY <= 0) return;

    const roll = Math.random();
    const type = roll < .12 ? 'bomb' : (roll < .28 ? 'gold' : 'red');
    const ttl = type === 'gold' ? GOLD_TTL : (type === 'bomb' ? 1300 : TARGET_TTL);

    const t = document.createElement('div');
    t.className = 'cg-target' + (type !== 'red' ? ' ' + type : '');
    t.style.left = (30 + Math.random() * maxX) + 'px';
    t.style.top = (30 + Math.random() * maxY) + 'px';
    arena.appendChild(t);

    const kill = setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, ttl);

    t.addEventListener('click', (e) => {
      if (!running) return;
      e.stopPropagation();
      clearTimeout(kill);
      t.classList.add('hit');
      burst(e.clientX, e.clientY);

      if (type === 'bomb') {
        score = Math.max(0, score - 2);
        timeLeft = Math.max(2, timeLeft - 3);
        combo = 0;
        updateCombo();
        shake();
        popup(e.clientX, e.clientY, '-2!');
      } else {
        const m = mult();
        const gain = type === 'gold' ? 3 * m : m;
        score += gain;
        combo++;
        comboMax = Math.max(comboMax, combo);
        updateCombo();
        popup(e.clientX, e.clientY, '+' + gain);
      }

      scoreEl.textContent = score;
      timeEl.textContent = timeLeft + 's';
      setTimeout(() => t.remove(), 260);
    });
  };

  const end = () => {
    running = false;
    clearInterval(timeInt);
    clearInterval(spawnInt);
    arena.querySelectorAll('.cg-target').forEach(t => t.remove());

    if (score > best) {
      best = score;
      bestEl.textContent = best;
      try { localStorage.setItem('zzz-best', best); } catch (e) {}
    }

    let title, desc;
    if (score >= 15) {
      title = 'REFLEKS LUAR BIASA!';
      desc = 'Skor ' + score + ' dengan kombo maksimal x' + Math.min(4, 1 + Math.floor(comboMax / 5)) + ' — kamu ngebut banget. Secepat itu juga aku ngerjain proyekmu.';
    } else if (score >= 7) {
      title = 'CEPAT MULAI!';
      desc = 'Skor ' + score + ' — lumayan tajam. Sedikit lagi jadi pro, main lagi untuk nambah skor?';
    } else {
      title = 'SINYAL LEMAH...';
      desc = 'Skor ' + score + ' — refleksmu butuh pemanasan. Coba main lagi, atau ajak aku ngobrol dulu.';
    }
    resultTitle.textContent = title;
    resultDesc.textContent = desc;
    rsScore.textContent = score;
    rsCombo.textContent = comboMax;
    rsBest.textContent = best;
    result.classList.add('show');
  };

  const start = () => {
    if (running) return;
    running = true;
    score = 0; timeLeft = GAME_TIME; combo = 0; comboMax = 0; lastMult = 1;
    scoreEl.textContent = '0';
    timeEl.textContent = GAME_TIME + 's';
    timeEl.classList.remove('warn');
    updateCombo();
    overlay.classList.add('hide');
    result.classList.remove('show');
    timeInt = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft + 's';
      if (timeLeft <= 5) timeEl.classList.add('warn');
      if (timeLeft <= 0) end();
    }, 1000);
    spawnInt = setInterval(spawnTarget, 620);
    spawnTarget();
  };

  startBtn.addEventListener('click', start);
  againBtn.addEventListener('click', start);

  /* ---------- FREEBIES: auto-pindah ke freebies.html saat scroll dipaksa ---------- */
  const REDIRECT_URL = 'freebies.html';
  let redirecting = false;
  const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 140;

  let warn = null, warnTimer = null;

  const closeWarn = () => {
    if (warnTimer) { clearInterval(warnTimer); warnTimer = null; }
    if (warn) { warn.remove(); warn = null; }
  };

  const doRedirect = () => {
    closeWarn();
    redirecting = true;
    const veil = document.createElement('div');
    veil.className = 'redirect-veil';
    veil.innerHTML = '<span class="rv-txt">MEMINDAHKAN KE FREE DROP<span class="load-dots">...</span></span>';
    document.body.appendChild(veil);
    setTimeout(() => { window.location.href = REDIRECT_URL; }, 950);
  };

  const showWarn = () => {
    if (warn || redirecting) return;
    warn = document.createElement('div');
    warn.className = 'warn-veil';
    warn.innerHTML =
      '<div class="warn-box">' +
        '<span class="warn-label">PERINGATAN // AUTO-PINDAH</span>' +
        '<p class="warn-title">Kamu akan pindah ke <b>FREE DROP</b></p>' +
        '<p class="warn-desc">Arsip aset gratis menunggu di halaman berikutnya.</p>' +
        '<div class="warn-actions">' +
          '<button class="warn-cancel" id="warnCancel">BATAL</button>' +
          '<span class="warn-count" id="warnCount">3</span>' +
          '<button class="warn-go" id="warnGo">PINDAH &#8594;</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(warn);

    let c = 3;
    const countEl = document.getElementById('warnCount');
    const tick = () => {
      c--;
      countEl.textContent = c;
      countEl.classList.remove('tick');
      void countEl.offsetWidth;
      countEl.classList.add('tick');
      if (c <= 0) doRedirect();
    };
    warnTimer = setInterval(tick, 1000);

    const cancel = () => {
      closeWarn();
      wheelForce = 0;
      downPresses = 0;
    };
    document.getElementById('warnCancel').addEventListener('click', cancel);
    document.getElementById('warnGo').addEventListener('click', doRedirect);
    warn.addEventListener('click', (e) => { if (e.target === warn) cancel(); });
  };

  let wheelForce = 0;
  let downPresses = 0;
  let lastTouchY = null;

  window.addEventListener('wheel', (e) => {
    if (redirecting) return;
    if (atBottom() && e.deltaY > 0) {
      wheelForce += e.deltaY;
      if (wheelForce > 320) showWarn();
    } else if (!atBottom()) {
      wheelForce = 0;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (redirecting || e.touches.length === 0) return;
    const y = e.touches[0].clientY;
    if (lastTouchY !== null && atBottom() && y < lastTouchY) {
      wheelForce += (lastTouchY - y) * 2.5;
      if (wheelForce > 320) showWarn();
    } else if (!atBottom()) {
      wheelForce = 0;
    }
    lastTouchY = y;
  }, { passive: true });

  window.addEventListener('touchend', () => { lastTouchY = null; });

  window.addEventListener('keydown', (e) => {
    if (redirecting) return;
    if (!atBottom()) return;
    if (e.key === 'End' || e.key === 'PageDown') {
      showWarn();
    } else if (e.key === 'ArrowDown') {
      downPresses++;
      if (downPresses >= 3) showWarn();
    }
  });

  /* ---------- PARTICLE CANVAS (hero) ---------- */
  const hero = document.getElementById('home');
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const sizeCanvas = () => {
    const r = hero.getBoundingClientRect();
    W = canvas.width = Math.max(1, r.width * DPR);
    H = canvas.height = Math.max(1, r.height * DPR);
    canvas.style.width = r.width + 'px';
    canvas.style.height = r.height + 'px';
  };
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  const COLORS = ['255,255,255', '228,0,43', '255,212,0'];
  const parts = [];
  const spawn = () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: (Math.random() * 1.9 + .6) * DPR,
    vx: (Math.random() - .5) * .3 * DPR,
    vy: (-Math.random() * .5 - .08) * DPR,
    o: Math.random() * .55 + .15,
    tw: Math.random() * Math.PI * 2,
    ts: Math.random() * .02 + .008,
    c: COLORS[(Math.random() * 3) | 0]
  });
  for (let i = 0; i < 70; i++) parts.push(spawn());

  const streaks = [];
  setInterval(() => { if (streaks.length < 6) streaks.push({
    x: Math.random() * W, y: -30,
    vy: (Math.random() * 5 + 4) * DPR,
    vx: (Math.random() - .5) * 1.5 * DPR,
    len: (Math.random() * 130 + 60) * DPR,
    o: Math.random() * .14 + .04
  }); }, 900);

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.tw += p.ts;
      if (p.y < -12) { Object.assign(p, spawn()); p.y = H + 12; }
      if (p.x < -12) p.x = W + 12;
      if (p.x > W + 12) p.x = -12;
      const a = p.o * (.55 + .45 * Math.sin(p.tw));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.c + ',' + a.toFixed(3) + ')';
      ctx.fill();
    }
    for (let i = streaks.length - 1; i >= 0; i--) {
      const s = streaks[i];
      s.y += s.vy; s.x += s.vx;
      if (s.y > H + 80) { streaks.splice(i, 1); continue; }
      const g = ctx.createLinearGradient(0, s.y - s.len, 0, s.y);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(255,255,255,' + s.o + ')');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - s.len);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  })();

  /* ---------- MOUSE PARALLAX (hero) ---------- */
  const heroInner = hero.querySelector('.hero-inner');
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    heroInner.style.transform = 'translate(' + (x * 24).toFixed(1) + 'px,' + (y * 16).toFixed(1) + 'px)';
  });
  hero.addEventListener('mouseleave', () => {
    heroInner.style.transform = '';
  });

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
