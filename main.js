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

/* ---- Countdown timer ---- */
(function () {
  // Set target: 2 days, 8 hours from now stored in sessionStorage so it persists on reload
  const KEY = 'tac_offer_end';
  let endTime = parseInt(sessionStorage.getItem(KEY) || '0', 10);
  const now = Date.now();

  if (!endTime || endTime < now) {
    // 2 days + 8 hours
    endTime = now + (2 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000);
    sessionStorage.setItem(KEY, endTime);
  }

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-minutes');
  const elSecs = document.getElementById('cd-seconds');

  if (!elDays || !elHours || !elMins || !elSecs) return;

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function tick() {
    const remaining = Math.max(0, endTime - Date.now());
    const totalSecs = Math.floor(remaining / 1000);
    const days  = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins  = Math.floor((totalSecs % 3600) / 60);
    const secs  = totalSecs % 60;

    elDays.textContent  = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent  = pad(mins);
    elSecs.textContent  = pad(secs);

    if (remaining > 0) {
      requestAnimationFrame(tick);
    }
  }

  tick();
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
