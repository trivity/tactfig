/* ============================================
   TACTICAL HEATING AND AIR — main.js
   ============================================ */

/* ---- Sticky nav shadow on scroll ---- */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,0.15)'
      : '0 2px 12px rgba(0,0,0,0.08)';
  }, { passive: true });
})();

/* ---- Mobile hamburger menu ---- */
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    // Animate hamburger to X
    const spans = btn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      const spans = btn.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  const nav = document.getElementById('nav');
})();

/* ---- Hero 3-2-1 Countdown → Confetti → Offer Reveal ---- */
(function () {
  const countdownEl = document.getElementById('countdown-number');
  const offerEl = document.getElementById('offer-reveal');
  const canvasEl = document.getElementById('confetti-canvas');
  if (!countdownEl || !offerEl || !canvasEl) return;

  let count = 3;
  countdownEl.textContent = count;

  function pulseNumber() {
    // Re-trigger the CSS animation
    countdownEl.style.animation = 'none';
    countdownEl.offsetHeight; // reflow
    countdownEl.style.animation = 'countdown-pulse 0.8s ease-in-out';
    countdownEl.textContent = count;
  }

  pulseNumber();

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      pulseNumber();
    } else {
      clearInterval(interval);
      countdownEl.classList.add('hidden');
      offerEl.classList.add('visible');
      fireConfetti(canvasEl);
    }
  }, 1000);

  function fireConfetti(canvas) {
    const ctx = canvas.getContext('2d');
    const W = 800;
    const H = 400;
    canvas.width = W;
    canvas.height = H;

    const colors = ['#ff0000', '#ff4444', '#ffcc00', '#ffffff', '#0055ff', '#ff6600', '#00cc44'];
    const particles = [];
    const TOTAL = 150;

    for (let i = 0; i < TOTAL; i++) {
      particles.push({
        x: W / 2 + (Math.random() - 0.5) * 60,
        y: H / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 1) * 14 - 4,
        w: Math.random() * 10 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.25 + Math.random() * 0.15,
        opacity: 1,
        decay: 0.008 + Math.random() * 0.008,
      });
    }

    let frame;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;

      for (const p of particles) {
        if (p.opacity <= 0) continue;
        alive++;
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.opacity -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (alive > 0) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, W, H);
      }
    }

    draw();
  }
})();

/* ---- Review tabs ---- */
(function () {
  const tabs = document.querySelectorAll('.review-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Future: filter cards by tab.dataset.tab
    });
  });
})();

/* ---- Intersection observer for fade-in animations ---- */
(function () {
  const targets = document.querySelectorAll(
    '.service-card, .review-card, .section__header, .section__title, ' +
    '.give-review__text, .give-review__photo, .cta-section__content, ' +
    '.where-we-operate__text, .get-in-touch__text, .get-in-touch__photo, ' +
    '.brands__logos, .footer__brand, .footer__contact, .footer__links'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
})();

/* ---- Avatar image fallback: show initials div if image fails ---- */
(function () {
  document.querySelectorAll('.review-card__avatar').forEach(img => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = this.nextElementSibling;
      if (fallback && fallback.classList.contains('review-card__avatar-fallback')) {
        fallback.style.display = 'flex';
      }
    });
  });
})();

/* ---- Brands marquee: dynamically clone items to fill any viewport ---- */
(function () {
  const track = document.querySelector('.brands__marquee-track');
  if (!track) return;

  // Grab the original set of brand tiles (first 8)
  const baseTiles = Array.from(track.querySelectorAll('.brand-logo-tile')).slice(0, 8);
  if (!baseTiles.length) return;

  // Clear the track and rebuild with enough clones
  track.innerHTML = '';

  // We need enough tiles so the total width >= 2× viewport.
  // Each tile is roughly 160-200px wide, so calculate how many sets we need.
  const viewportW = window.innerWidth;
  const estTileWidth = 180; // average tile width with padding
  const tilesPerSet = baseTiles.length;
  const setsNeeded = Math.ceil((viewportW * 3) / (tilesPerSet * estTileWidth));
  const totalSets = Math.max(setsNeeded, 4); // minimum 4 sets

  for (let s = 0; s < totalSets; s++) {
    baseTiles.forEach(tile => {
      track.appendChild(tile.cloneNode(true));
    });
  }

  // Adjust animation duration proportionally: 7s per set for smooth speed
  const duration = totalSets * 7;
  track.style.animationDuration = duration + 's';
})();
