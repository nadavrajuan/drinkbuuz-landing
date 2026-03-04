/* ═══════════════════════════════════════════════
   SUBSCRIBE FORM → Pipedrive API
═══════════════════════════════════════════════ */
const signupForm = document.querySelector('.signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = signupForm.querySelector('.signup-input');
    const btn   = signupForm.querySelector('button[type="submit"]');
    const email = input.value.trim();
    if (!email) return;

    btn.textContent = 'Subscribing…';
    btn.disabled = true;

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        btn.textContent = 'Subscribed!';
        input.value = '';
      } else {
        btn.textContent = 'Try again';
        btn.disabled = false;
      }
    } catch (_) {
      btn.textContent = 'Try again';
      btn.disabled = false;
    }
  });
}

/* ═══════════════════════════════════════════════
   NAV: scroll shadow
═══════════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Staggered groups
[
  '.sci-card',
  '.testimonial',
  '.sub-list li',
  '.perk-list li',
  '.retailer-logos li',
  '.attr-chip',
  '.stat-card',
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 80}ms`;
    revealObserver.observe(el);
  });
});

// Single reveals
[
  '.hero-title',
  '.hero-foot',
  '.section-dark .title-xl',
  '.photo-stack',
  '.section-light .title-lg',
  '.statement-body',
  '.award-block',
  '.award-img',
  '.product-title',
  '.signup-card',
].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});
