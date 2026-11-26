/**
 * Split flaps for the harbour's departures board.
 *
 * Each `.flaps[data-len]` element's text becomes a row of cells; every cell
 * flips through the drum to its letter, staggered by row and column, once the
 * board surfaces. The cells are only built when the board nears the viewport
 * (it sits below the fold), so building ~370 spans never lands in the load
 * window; until then the rows read as plain text. The cells are aria-hidden: each row carries its own
 * screen-reader sentence. Reduced motion sets the letters at once. A
 * `[data-clock]` element shows live Dhaka time and flips on the minute.
 */
const DRUM = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:-';

interface Cell { el: HTMLSpanElement; target: number; cur: number; wait: number; flip: boolean }

export function initFlaps() {
  const board = document.querySelector<HTMLElement>('[data-board]');
  if (!board) return;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    start(board);
  }, { rootMargin: '400px 0px' });
  io.observe(board);
}

function start(board: HTMLElement) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cells: Cell[] = [];

  const build = (el: HTMLElement, text: string): Cell[] => {
    const len = Number(el.dataset.len) || text.length;
    const t = text.toUpperCase().padEnd(len).slice(0, len);
    el.textContent = '';
    el.setAttribute('aria-hidden', 'true');
    const list: Cell[] = [];
    for (let i = 0; i < len; i++) {
      const span = document.createElement('span');
      span.className = 'cell';
      const target = Math.max(0, DRUM.indexOf(t[i]));
      const cur = reduce ? target : (target - 3 - Math.floor(Math.random() * 9) + DRUM.length * 2) % DRUM.length;
      span.textContent = DRUM[cur];
      el.appendChild(span);
      list.push({ el: span, target, cur, wait: 0, flip: false });
    }
    return list;
  };

  board.querySelectorAll<HTMLElement>('.row').forEach((row, r) => {
    row.querySelectorAll<HTMLElement>('.flaps').forEach((f, k) => {
      build(f, (f.textContent || '').trim()).forEach((c, i) => { c.wait = r * 4 + k * 3 + i; cells.push(c); });
    });
  });

  const clockEl = board.querySelector<HTMLElement>('[data-clock]');
  let clock: Cell[] = [];
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Dhaka' });
  const setClock = () => {
    if (!clockEl) return;
    const t = fmt.format(new Date());
    clockEl.parentElement?.setAttribute('aria-label', `Local time in Dhaka ${t}`);
    if (!clock.length) { clock = build(clockEl, t); cells.push(...clock); return; }
    [...t].forEach((ch, i) => {
      const c = clock[i];
      if (!c) return;
      c.target = Math.max(0, DRUM.indexOf(ch));
      if (reduce) { c.cur = c.target; c.el.textContent = ch; }
    });
  };
  setClock();
  setInterval(setClock, 15000);
  if (reduce) return;

  let running = false;
  new IntersectionObserver(([e]) => { if (e.isIntersecting) running = true; }, { threshold: 0.25 }).observe(board);
  setInterval(() => {
    if (!running || document.hidden) return;
    for (const c of cells) {
      if (c.wait > 0) { c.wait--; continue; }
      if (c.cur === c.target) continue;
      c.cur = (c.cur + 1) % DRUM.length;
      c.el.textContent = DRUM[c.cur];
      c.flip = !c.flip;
      c.el.classList.toggle('fa', c.flip);
      c.el.classList.toggle('fb', !c.flip);
    }
  }, 60);
}
