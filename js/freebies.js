/* ============================================================
   ARCIVAMILE — FREEBIES / FREE DROP page script
   ============================================================ */
const REQUEST_WA = '';
const REQUEST_EMAIL = 'arcivamile@gmail.com';

/* ---------- DATA WHAT'S NEW (isi data rilisan aset terbaru) ---------- */
const WHATS_NEW = [
  {
    date:  '7 AUG 2026',
    tag: 'PNG',
    color: '#ff5a75',
    image: 'img/thumb/kaki5abc.jpg',
    title: 'MASAKAN KAKI 5 - LITE',
    desc: 'Rilisan terbaru di kategori PNG: Lengkapi desainmu sekarang juga, yuk liat rilisan terbaru MASAKAN KAKI 5 - LITE'
  }
];

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
      maybeShowWhatNew();
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

  /* ---------- WHAT'S NEW — data update di halaman ---------- */
  let maybeShowWhatNew = () => {};
  const buildWnItem = (u) =>
    '<div class="fd-wn-item">' +
    (u.image ? '<div class="fd-wn-img"><img src="' + u.image + '" alt="' + u.title + '"></div>' : '') +
    '<div class="fd-wn-meta">' +
    '<span class="fd-wn-date">' + u.date + '</span>' +
    '<span class="fd-wn-tag" style="background:' + (u.color || '#ffd400') + '">' + u.tag + '</span></div>' +
    '<div class="fd-wn-body-txt"><h3>' + u.title + '</h3><p>' + u.desc + '</p></div></div>';

  /* ---------- POPUP WHAT'S NEW (muncul tiap masuk/refresh halaman) ---------- */
  const wnModal = document.getElementById('wnModal');
  if (wnModal) {
    const wnBody = document.getElementById('wnBody');
    const wnOk = document.getElementById('wnOk');
    const wnBg = document.getElementById('wnBg');
    const wnClose = document.getElementById('wnClose');
    wnBody.innerHTML = WHATS_NEW.map(buildWnItem).join('');

    const openWn = () => {
      wnModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    };
    const closeWn = () => {
      wnModal.classList.remove('show');
      document.body.style.overflow = '';
    };
    maybeShowWhatNew = () => {
      setTimeout(openWn, 900);
    };

    wnOk.addEventListener('click', closeWn);
    wnClose.addEventListener('click', closeWn);
    wnBg.addEventListener('click', closeWn);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wnModal.classList.contains('show')) closeWn();
    });
  }

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
  const emptyBox = document.getElementById('fdEmpty');

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
    if (count) count.textContent = String(shown).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
    if (emptyBox) emptyBox.classList.toggle('show', shown === 0);
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  applyFilter('all');

  /* ---------- STAT ARSIP OTOMATIS (jumlah diambil dari kartu yang ada) ---------- */
  if (document.querySelector('.fd-stats')) {
    const localCards = document.querySelectorAll('.fd-card');
    const applyStat = (cards) => {
      const cats = new Set();
      cards.forEach(c => cats.add(c.dataset.cat));
      const elArsip = document.getElementById('statArsip');
      const elKategori = document.getElementById('statKategori');
      if (elArsip) elArsip.textContent = String(cards.length).padStart(2, '0');
      if (elKategori) elKategori.textContent = String(cats.size).padStart(2, '0');
    };
    if (localCards.length) {
      applyStat(localCards);
    } else {
      fetch('arsip')
        .then(r => r.text())
        .then(html => {
          applyStat(new DOMParser().parseFromString(html, 'text/html').querySelectorAll('.fd-card'));
        })
        .catch(() => {});
    }
  }

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

  /* ---------- MOUSE PARALLAX  ---------- */
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

  /* ---------- POPUP INFO DOWNLOAD (kreator, tanggal, lisensi) ---------- */
  const modal = document.getElementById('fdModal');
  const modalBg = document.getElementById('fdModalBg');
  const mCat = document.getElementById('mCat');
  const mTitle = document.getElementById('mTitle');
  const mDesc = document.getElementById('mDesc');
  const mCreator = document.getElementById('mCreator');
  const mDate = document.getElementById('mDate');
  const mFormat = document.getElementById('mFormat');
  const mSize = document.getElementById('mSize');
  const mLicense = document.getElementById('mLicense');
  const mDownload = document.getElementById('mDownload');
  const mClose = document.getElementById('mClose');

  const closeModal = () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };

  if (modal) {
    document.querySelectorAll('.fd-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.fd-card');
        if (!card) return;
        mCat.textContent = (card.dataset.cat || 'ASET').toUpperCase();
        const h3 = card.querySelector('h3');
        const p = card.querySelector('p');
        if (h3) mTitle.textContent = h3.textContent;
        if (p) mDesc.textContent = p.textContent;
        mCreator.textContent = card.dataset.creator || '-';
        mDate.textContent = card.dataset.date || '-';
        mFormat.textContent = card.dataset.format || '-';
        mSize.textContent = card.dataset.size || '-';
        mLicense.textContent = card.dataset.license || '-';
        mDownload.setAttribute('href', btn.getAttribute('href'));
        const mDetail = document.getElementById('mDetail');
        if (mDetail) mDetail.setAttribute('href', card.dataset.detail || 'arsip');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        if (fdAgree) fdAgree.checked = false;
        agreeChecked = false;
        setHuman(false);
        setGuardMsg('');
        renderGuard();
      });
    });

    modalBg.addEventListener('click', closeModal);
    mClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });

    /* ---------- GATE ANTI-SPAM: VERIFIKASI MANUSIA + COOLDOWN ---------- */
    const TURNSTILE_SITEKEY = '0x4AAAAAAEEaW_rpLhenvdHG';
    const COOLDOWN_SEC = 30;
    const mGuardMsg = document.getElementById('fdGuardMsg');
    const fdGuardFallback = document.getElementById('fdGuardFallback');
    const fdAgree = document.getElementById('fdAgree');
    let humanVerified = false;
    let agreeChecked = false;
    let turnstileWidget = null;

    const lastDownload = () => Number(localStorage.getItem('zzz-last-dl') || 0);
    const remainingCooldown = () => {
      const s = Math.floor(Date.now() / 1000) - lastDownload();
      return Math.max(0, COOLDOWN_SEC - s);
    };
    const setGuardMsg = (txt) => { if (mGuardMsg) mGuardMsg.textContent = txt || ''; };
    const updateGate = () => {
      const ok = humanVerified && agreeChecked;
      const lbl = mDownload.querySelector('.fd-mdl-label');
      if (lbl) lbl.innerHTML = ok ? 'DOWNLOAD \u2193' : 'VERIFIKASI DULU';
      mDownload.classList.toggle('locked', !ok);
    };
    const setHuman = (ok) => {
      humanVerified = ok;
      updateGate();
    };

    const renderGuard = () => {
      const box = document.getElementById('cf-turnstile');
      if (!box) return;
      if (TURNSTILE_SITEKEY && window.turnstile) {
        if (turnstileWidget) {
          window.turnstile.reset(turnstileWidget);
        } else {
          turnstileWidget = window.turnstile.render(box, {
            sitekey: TURNSTILE_SITEKEY,
            theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
            callback: () => { setHuman(true); setGuardMsg(''); },
            'expired-callback': () => setHuman(false)
          });
        }
        fdGuardFallback.hidden = true;
      } else {
        fdGuardFallback.hidden = false;
      }
    };

    if (fdGuardFallback) {
      fdGuardFallback.addEventListener('click', () => {
        setGuardMsg('Memeriksa...');
        setTimeout(() => { setHuman(true); setGuardMsg(''); }, 700);
      });
    }

    if (fdAgree) {
      fdAgree.addEventListener('change', () => {
        agreeChecked = fdAgree.checked;
        if (agreeChecked && !humanVerified) setGuardMsg('Selesaikan verifikasi "Saya bukan robot" dulu.');
        else setGuardMsg('');
        updateGate();
      });
    }

    mDownload.addEventListener('click', (e) => {
      e.preventDefault();
      const href = mDownload.getAttribute('href');
      if (!agreeChecked) {
        setGuardMsg('Centang persetujuan "tidak membagikan ulang" dulu.');
        return;
      }
      if (!humanVerified) {
        setGuardMsg('Selesaikan verifikasi "Saya bukan robot" dulu.');
        return;
      }
      const wait = remainingCooldown();
      if (wait > 0) {
        setGuardMsg('Tunggu ' + wait + ' detik untuk unduh berikutnya.');
        return;
      }
      if (!href || href === '#') return;
      localStorage.setItem('zzz-last-dl', String(Math.floor(Date.now() / 1000)));
      setGuardMsg('');
      setHuman(false);
      if (fdAgree) fdAgree.checked = false;
      agreeChecked = false;
      renderGuard();
      window.open(href, '_blank', 'noopener');
    });
  }

  /* ---------- POPUP DOKUMEN LEGAL (terms, privasi, lisensi, hak cipta) ---------- */
  const legalModal = document.getElementById('fdLegalModal');
  if (legalModal) {
    const legalBg = document.getElementById('fdLegalBg');
    const legalClose = document.getElementById('legalClose');
    const legalCat = document.getElementById('legalCat');
    const legalTitle = document.getElementById('legalTitle');
    const legalBody = document.getElementById('legalBody');

    const LEGAL_DOCS = {
      terms: {
        cat: 'LEGAL // TERMS',
        title: 'Syarat & Ketentuan',
        body: '<h4>1. Penerimaan Ketentuan</h4><p>Dengan mengakses atau menggunakan situs FREE DROP milik Arcivamile, kamu dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan di bawah ini. Jika tidak setuju, mohon berhenti menggunakan layanan ini.</p><h4>2. Penggunaan Layanan</h4><p>Layanan ini menyediakan aset desain digital (logo, font, PNG, dan JPG) secara gratis untuk membantu kebutuhan desainmu. Semua aset disediakan "apa adanya" tanpa jaminan tertentu.</p><h4>3. Hak Penggunaan Aset</h4><p>Seluruh aset di situs ini boleh digunakan untuk keperluan personal maupun komersial. Kredit kepada Arcivamile bersifat opsional — tidak diwajibkan, namun sangat dihargai jika diberikan. Hak cipta atas aset tetap milik pembuatnya.</p><h4>4. Larangan</h4><p>Dilarang keras untuk: (a) mengunggah ulang atau membagikan ulang aset dalam bentuk apa pun, termasuk ke platform lain, grup, atau channel; (b) menjual kembali aset tanpa izin tertulis; (c) mengklaim aset sebagai karya sendiri; (d) menggunakan aset untuk konten ilegal atau menyesatkan.</p><h4>5. Perubahan Ketentuan</h4><p>Ketentuan ini dapat diperbarui sewaktu-waktu. Perubahan berlaku saat diumumkan di halaman ini, dan penggunaan lanjutan setelah perubahan dianggap sebagai persetujuan.</p><h4>6. Batasan Tanggung Jawab</h4><p>Arcivamile tidak bertanggung jawab atas kerugian apa pun yang timbul akibat penggunaan aset atau layanan ini. Semua aset dipakai dengan risiko pengguna masing-masing.</p>'
      },
      privacy: {
        cat: 'LEGAL // PRIVACY',
        title: 'Kebijakan Privasi',
        body: '<h4>1. Informasi yang Kami Kumpulkan</h4><p>Situs ini tidak memerlukan pendaftaran akun dan tidak mengumpulkan data pribadi seperti nama, email, atau nomor telepon. Data yang tersimpan hanya di perangkatmu sendiri (localStorage) berupa preferensi tema dan pencatat waktu unduhan untuk mencegah spam.</p><h4>2. Verifikasi Manusia</h4><p>Untuk mencegah spam unduhan, situs menggunakan Cloudflare Turnstile. Widget ini dapat memproses data teknis perangkatmu sesuai Kebijakan Privasi Cloudflare (cloudflare.com/privacy).</p><h4>3. Cookie &amp; Penyimpanan Lokal</h4><p>Kami menggunakan localStorage untuk menyimpan preferensi tema dan waktu unduhan terakhir. Kamu dapat menghapusnya kapan saja lewat pengaturan browser.</p><h4>4. Berbagi Data</h4><p>Kami tidak menjual, menyewakan, atau membagikan data pengguna kepada pihak ketiga, kecuali diwajibkan oleh hukum atau untuk keperluan keamanan layanan.</p><h4>5. Keamanan</h4><p>Seluruh aset dan halaman disajikan melalui koneksi aman (HTTPS). Meski demikian, tidak ada metode transmisi data yang 100% aman.</p><h4>6. Kontak</h4><p>Jika ada pertanyaan seputar kebijakan privasi, hubungi kami melalui halaman Request atau email resmi Arcivamile.</p>'
      },
      license: {
        cat: 'LEGAL // LICENSE',
        title: 'Lisensi Aset',
        body: '<h4>1. Lisensi</h4><p>Setiap aset di arsip ini dirilis di bawah lisensi gratis Arcivamile, yang mengizinkan penggunaan personal dan komersial tanpa biaya.</p><h4>2. Kredit</h4><p>Kredit bersifat sukarela dan tidak wajib. Jika kamu ingin menyebutkannya, contohnya menulis "Aset oleh Arcivamile" atau menautkan situs ini saat aset dipakai publik.</p><h4>3. Modifikasi</h4><p>Kamu bebas memodifikasi aset sesuai kebutuhan proyekmu, termasuk mengubah warna, bentuk, atau menggabungkannya dengan karya lain.</p><h4>4. Yang Tidak Diizinkan</h4><p>Membagikan ulang aset dalam bentuk mentah/awal, mengunggah ulang ke situs lain, menjual kembali file aslinya, atau mengklaimnya sebagai karya sendiri. Bagikan link halaman ini, bukan filenya.</p><h4>5. Sifat Lisensi</h4><p>Lisensi bersifat non-eksklusif, tidak dapat dipindahtangankan, dan dapat dicabut jika ketentuan dilanggar.</p><h4>6. Pertanyaan</h4><p>Untuk penggunaan di luar ketentuan di atas (misalnya lisensi komersial khusus), ajukan permintaan melalui halaman Request.</p>'
      },
      copyright: {
        cat: 'LEGAL // COPYRIGHT',
        title: 'Hak Cipta',
        body: '<h4>1. Kepemilikan</h4><p>Seluruh aset, desain, dan konten di situs ini adalah karya asli Arcivamile dan dilindungi undang-undang hak cipta yang berlaku.</p><h4>2. Hak Kekayaan Intelektual</h4><p>Logo, merek, dan identitas "Arcivamile" serta "FREE DROP" merupakan bagian dari identitas merek dan tidak boleh digunakan tanpa izin untuk tujuan yang tidak terkait.</p><h4>3. Penggunaan</h4><p>Hak cipta atas aset tetap milik Arcivamile meskipun file sudah diunduh. Lisensi penggunaan diberikan lewat dokumen Lisensi Aset.</p><h4>4. Pelanggaran</h4><p>Mengunggah ulang, menjual, atau mengklaim aset sebagai milik sendiri merupakan pelanggaran hak cipta dan dapat dikenakan tuntutan sesuai hukum yang berlaku.</p><h4>5. Dukungan</h4><p>Cara terbaik mendukung kami: bagikan link resmi situs ini, beri kredit saat memakai aset (opsional), dan dukung lewat Saweria.</p><h4>6. Kontak</h4><p>Untuk izin khusus atau pelaporan pelanggaran, hubungi melalui halaman Request.</p>'
      }
    };

    const closeLegal = () => {
      legalModal.classList.remove('show');
      document.body.style.overflow = '';
    };

    const openLegal = (key) => {
      const doc = LEGAL_DOCS[key];
      if (!doc) return;
      legalCat.textContent = doc.cat;
      legalTitle.textContent = doc.title;
      legalBody.innerHTML = doc.body;
      legalModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    document.querySelectorAll('[data-legal]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openLegal(a.dataset.legal);
      });
    });
    legalBg.addEventListener('click', closeLegal);
    legalClose.addEventListener('click', closeLegal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && legalModal.classList.contains('show')) closeLegal();
    });
  }

  /* ---------- FORM REQUEST ASET (kirim ke WhatsApp / Email + animasi sukses) ---------- */
  const reqForm = document.getElementById('reqForm');
  const reqInput = document.getElementById('reqInput');
  const reqOk = document.getElementById('reqOk');
  if (reqForm) {
    document.querySelectorAll('.fd-req-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        reqInput.value = chip.dataset.val || '';
        reqInput.focus();
      });
    });

    reqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = reqInput.value.trim();
      if (!val) return;

      const msg = 'Halo Arcivamile! Saran aset untuk FREE DROP: ' + val + ' — terima kasih!';
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

  /* ---------- CURSOR PLASMA + PARTIKEL ---------- */
  const cursor = document.getElementById('cursor');

  let mx = 0, my = 0, cx = 0, cy = 0;
  let lx = 0, ly = 0, lt = performance.now();
  let burstTimer = null;

  const sparkColors = ['#ffd000', '#ffb800', '#ff9a00', '#ff7a00', '#ff5a1f', '#ff3b30', '#e4002b'];

  function spawnSpark(x, y, spd) {
    const s = document.createElement('div');
    s.className = 'spark';
    const ang = Math.random() * Math.PI * 2;
    const dist = 12 + Math.random() * 55 * Math.min(1, spd);
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.background = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
    s.style.setProperty('--dur', (.22 + Math.random() * .28) + 's');
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }

  function sparkBurst(x, y) {
    const n = 16 + Math.floor(Math.random() * 10);
    for (let i = 0; i < n; i++) {
      setTimeout(() => spawnSpark(x, y, .8 + Math.random() * 1), Math.random() * 180);
    }
  }

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    const now = performance.now();
    const spd = Math.hypot(mx - lx, my - ly) / Math.max(16, now - lt);
    if (spd > .2 && Math.random() < .95) spawnSpark(mx, my, spd);
    if (spd > .6 && Math.random() < .5) spawnSpark(mx, my, spd);
    lx = mx; ly = my; lt = now;
  });

  setInterval(() => {
    if (Math.random() < .9) spawnSpark(mx, my, .45 + Math.random() * .35);
    if (Math.random() < .55) spawnSpark(mx, my, .5);
  }, 60);

  const loop = () => {
    cx += (mx - cx) * .18;
    cy += (my - cy) * .18;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll('a[href], button, input, textarea, select, [role="button"], .fd-card, .channel').forEach(el => {
    el.addEventListener('mouseenter', () => {
      sparkBurst(mx, my);
      burstTimer = setInterval(() => sparkBurst(mx, my), 320);
    });
    el.addEventListener('mouseleave', () => {
      clearInterval(burstTimer);
    });
  });

  /* ---------- MARQUEE INFO (freedrop) — pesan informasi acak ---------- */
  const mqInfo = document.getElementById('mqInfo');
  if (mqInfo) {
    const pool = [
      'Setiap aset di arsip ini dibuat dari nol dengan tangan sendiri, bukan hasil unduhan ulang',
      'Gunakan dengan bebas untuk proyek personal maupun komersial, tanpa biaya sepeser pun',
      'Kredit tidak wajib, tapi sempatkan membagikan link web ini kepada yang membutuhkan',
      'Dilarang keras mengunggah ulang aset ini di platform lain dalam bentuk apa pun',
      'Aset yang kamu cari belum ada? Sampaikan sarannya, dan itu akan dipertimbangkan',
      'Pertahankan web ini tetap gratis selamanya dengan dukunganmu lewat Saweria',
      'Unduh langsung tanpa akun, tanpa daftar, tanpa paywall, sekali buka langsung dapat',
      'Verifikasi anti-spam terpasang untuk menjaga server tetap ramah bagi semua pengunjung',
      'Setiap karya lahir dari proses panjang: riset, desain, dan revisi tanpa henti',
      'Jangan bagikan file-nya, bagikan linknya supaya semua orang mendapat versi terbaru',
      'Aset dirancang khusus untuk kebutuhan desain modern, dari branding sampai konten sosial media',
      'Semua file diarsipkan dengan rapi, diberi nama jelas, dan siap pakai dalam hitungan detik',
      'Arsip ini terus bertambah seiring waktu, jadi mampir lagi untuk melihat karya-karya terbaru',
      'Dibuat dengan ketelitian tinggi supaya hasil akhirmu tampil profesional dan memukau',
      'Berbagi itu indah, tapi berbagi karya orang lain tanpa izin tidaklah keren',
      'Satu halaman, banyak aset gratis: logo, font, PNG, dan JPG dalam satu arsip'
    ];
    const seq = [];
    while (pool.length) {
      seq.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    const build = (arr) => arr.map(t =>
      '<span class="mq-word"><i>' + t + '</i></span><span class="mq-sep">//</span>'
    ).join('');
    mqInfo.innerHTML = build(seq) + build(seq);
  }

  /* ---------- MARQUEE — gerak halus + melambat saat hover (sinkron) ---------- */
  const marqueeTracks = document.querySelectorAll('.marquee-track');
  if (marqueeTracks.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    marqueeTracks.forEach(track => {
      const spans = track.querySelectorAll('span');
      const half = Math.floor(spans.length / 2);
      let halfWidth = 0;
      for (let i = 0; i < half; i++) halfWidth += spans[i].offsetWidth;
      if (halfWidth <= 0) return;
      const base = Math.min(halfWidth / 64, 64);
      const marquee = track.closest('.marquee');
      let pos = 0;
      let speed = base;
      let last = performance.now();
      const loop = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const target = marquee.matches(':hover') ? base * 0.12 : base;
        speed += (target - speed) * Math.min(1, dt * 5);
        pos -= speed * dt;
        if (pos <= -halfWidth) pos += halfWidth;
        track.style.transform = 'translateX(' + pos + 'px)';
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  }

  /* ---------- TRANSISI HALUS ANTAR HALAMAN (fade out sebelum pindah) ---------- */
  document.querySelectorAll('a[href^="freedrop"], a[href^="arsip"], a[href^="request"], a[href$=".html"]').forEach(a => {
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
