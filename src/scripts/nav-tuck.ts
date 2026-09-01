/**
 * nav-tuck — tuck the fixed nav pill away while the visitor scrolls down, and
 * bring it back on the first upward scroll (or anywhere near the top).
 *
 * One window-level scroll listener, bound once per page session; the nav is
 * re-queried per event so the same binding keeps working after a ClientRouter
 * swap on the blog — no rebinding, no listener piling up. The open mobile menu
 * pins the nav (it is anchored to the pill), and focus moving into a tucked
 * nav untucks it so keyboard users can see where they are.
 */
const TOP_ZONE = 120; // this close to the top the nav is always shown
const JITTER = 4; // px of scroll delta to ignore (momentum/rubber-band noise)

let lastY = 0;
let ticking = false;

const currentNav = () => document.querySelector<HTMLElement>('.nav');

function update() {
  ticking = false;
  const nav = currentNav();
  if (!nav) return;
  const y = Math.max(0, window.scrollY);
  const delta = y - lastY;
  if (Math.abs(delta) < JITTER) return;
  lastY = y;
  const menuOpen = nav.querySelector('.nav-menu:not([hidden])');
  nav.classList.toggle('nav-tucked', delta > 0 && y > TOP_ZONE && !menuOpen);
}

export function initNavTuck() {
  lastY = Math.max(0, window.scrollY);
  currentNav()?.classList.remove('nav-tucked');

  if ((window as { __navTuckBound?: boolean }).__navTuckBound) return;
  (window as { __navTuckBound?: boolean }).__navTuckBound = true;

  addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  document.addEventListener('focusin', (e) => {
    const nav = currentNav();
    if (nav && nav.contains(e.target as Node)) nav.classList.remove('nav-tucked');
  });
}
