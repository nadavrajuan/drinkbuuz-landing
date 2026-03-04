/* ═══════════════════════════════════════════════
   NAV: scroll shadow + hamburger drawer
═══════════════════════════════════════════════ */
const nav       = document.getElementById('nav');
const burger    = document.getElementById('burger');
const drawer    = document.getElementById('drawer');
const backdrop  = document.getElementById('backdrop');

// Scroll shadow
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

// Open / close drawer
function openDrawer() {
  drawer.classList.add('open');
  backdrop.classList.add('visible');
  requestAnimationFrame(() => backdrop.classList.add('open'));
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  backdrop.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Remove 'visible' after transition
  backdrop.addEventListener('transitionend', () => {
    backdrop.classList.remove('visible');
  }, { once: true });
}

burger.addEventListener('click', () => {
  const isOpen = drawer.classList.contains('open');
  isOpen ? closeDrawer() : openDrawer();
});
backdrop.addEventListener('click', closeDrawer);
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
});

/* ═══════════════════════════════════════════════
   SCIENCE REEL: update dot indicator
═══════════════════════════════════════════════ */
const reel = document.querySelector('.science__reel');
const dots = document.querySelectorAll('.science__dots .dot');

if (reel && dots.length) {
  reel.addEventListener('scroll', () => {
    const cards   = reel.querySelectorAll('.science__card');
    const reelL   = reel.scrollLeft;
    let activeIdx = 0;
    cards.forEach((card, i) => {
      if (card.offsetLeft - reel.offsetLeft <= reelL + card.offsetWidth * 0.5) {
        activeIdx = i;
      }
    });
    dots.forEach((d, i) => d.classList.toggle('dot--active', i === activeIdx));
    reel.setAttribute('data-active', activeIdx + 1);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
);

// Stagger children within certain containers
const staggerSelectors = [
  '.science__reel .science__card',
  '.proof__reel .testimonial',
  '.sub-list li',
  '.product__perks li',
  '.footer__col',
  '.retailers__logos li',
];
staggerSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 80}ms`;
    revealObserver.observe(el);
  });
});

// Single-element reveals
[
  '.get-buuz__body',
  '.functional__body',
  '.statement__content',
  '.proof__award-img',
  '.proof > .btn',
  '.product__panel',
  '.subscribe__body',
  '.signup__card',
  '.science__head',
  '.proof__header',
  '.retailers',
  '.stats .stat-card',
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (sel === '.stats .stat-card') el.style.transitionDelay = `${i * 100}ms`;
    revealObserver.observe(el);
  });
});
