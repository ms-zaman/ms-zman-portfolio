/**
 * SkyPicker — the hero's weather chip, and the only reason a visitor ever finds
 * out the sky is real.
 *
 * By default the hero renders the *live* condition: Dhaka's current weather from
 * Open-Meteo crossed with the visitor's time of day. That's the nice part, and it
 * was also completely invisible — nothing on the page said "this sky is Dhaka's
 * sky right now", and there was no way to see the other six. So the chip does two
 * jobs at once:
 *
 *   • resting, it *states* the fact — "☀ Dhaka, 2:40 pm" with a live dot;
 *   • opened, it hands the sky over: seven conditions plus Auto to give it back.
 *
 * A manual pick is remembered in localStorage (`STORE_KEY`), so a visitor who
 * likes the snow keeps the snow on their next visit. `?skyWeather=` still wins
 * over both and is deliberately *not* saved — it's a preview link, not a choice.
 */
import { useEffect, useId, useRef, useState } from 'react';
import type { Condition } from './conditions';
import { DHAKA, skyHour } from '../../../scripts/sky-engine';
import type { Location } from '../../../scripts/sky-engine';

export const STORE_KEY = 'sky:condition';

/** The saved preference: a condition, or null for "follow the live weather". */
export function savedCondition(): Condition | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw && raw !== 'auto' && GROUPS.some((g) => g.items.some((i) => i.id === raw))
      ? (raw as Condition)
      : null;
  } catch {
    return null; // private mode / storage disabled — just follow the weather
  }
}

function save(condition: Condition | null) {
  try {
    localStorage.setItem(STORE_KEY, condition ?? 'auto');
  } catch {
    /* not being able to remember is not worth breaking the click over */
  }
}

// — icons — inline SVG rather than ☀/☁ glyphs, which fall out of the self-hosted
// font stack and land on whatever the OS has. 16×16, stroked to match the socials.
const Ico = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </>
  ),
  cloud: <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97 6 6 0 0 0-11.66 1.6A3.5 3.5 0 0 0 7 19h10.5Z" />,
  rain: (
    <>
      <path d="M17.5 16a4.5 4.5 0 0 0 .5-8.97 6 6 0 0 0-11.66 1.6A3.5 3.5 0 0 0 7 16" />
      <path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2" />
    </>
  ),
  snow: (
    <>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
      <path d="M9.4 4.6L12 6.6l2.6-2M9.4 19.4L12 17.4l2.6 2" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  auto: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M18.5 2v4h-4" />
    </>
  ),
} as const;

type IconName = keyof typeof Ico;

function Icon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {Ico[name]}
    </svg>
  );
}

interface Item {
  id: Condition;
  label: string;
  icon: IconName;
}

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: 'Day',
    items: [
      { id: 'sunny', label: 'Sunny', icon: 'sun' },
      { id: 'cloudy', label: 'Cloudy', icon: 'cloud' },
      { id: 'drizzle', label: 'Rain', icon: 'rain' },
      { id: 'snow', label: 'Snow', icon: 'snow' },
    ],
  },
  {
    title: 'Night',
    items: [
      { id: 'clear-night', label: 'Clear night', icon: 'moon' },
      { id: 'overcast-night', label: 'Cloudy night', icon: 'cloud' },
      { id: 'drizzle-night', label: 'Rainy night', icon: 'rain' },
    ],
  },
];

const ITEMS: Item[] = GROUPS.flatMap((g) => g.items);

/** 12-hour clock from the sky's own hour, so `?skyHour` previews stay honest. */
function clockLabel(loc: Location): string {
  const h = skyHour(loc);
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  const suffix = hh < 12 ? 'am' : 'pm';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, '0')} ${suffix}`;
}

interface Props {
  /** What the sky is showing right now. */
  condition: Condition;
  /** null = following the live weather. */
  manual: Condition | null;
  onPick: (condition: Condition | null) => void;
  location: Location;
}

export function SkyPicker({ condition, manual, onPick, location }: Props) {
  const [open, setOpen] = useState(false);
  const [inHero, setInHero] = useState(true);
  // re-render each minute so the clock on the chip doesn't go stale
  const [, tick] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  // On a phone the hero is taller than the viewport, so a chip pinned to the
  // hero's bottom edge starts below the fold — i.e. invisible, which defeats the
  // whole point. There it goes `position: fixed` instead (see Hero.astro), and
  // this is what retires it again once the hero has scrolled away.
  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInHero(e.isIntersecting);
        if (!e.isIntersecting) setOpen(false);
      },
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // close on outside click / Escape; Escape hands focus back to the chip
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const active = ITEMS.find((i) => i.id === condition) ?? ITEMS[0];
  const auto = manual === null;
  const place = location.lat === DHAKA.lat && location.lng === DHAKA.lng ? 'Dhaka' : 'Your sky';

  const pick = (next: Condition | null) => {
    onPick(next);
    save(next);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={`sky-pick${open ? ' open' : ''}${inHero ? '' : ' gone'}`} ref={rootRef}>
      {open && (
        <div className="sky-menu" id={menuId} role="radiogroup" aria-label="Hero sky">
          <button
            type="button"
            role="radio"
            aria-checked={auto}
            className={`sky-opt${auto ? ' on' : ''}`}
            onClick={() => pick(null)}
          >
            <Icon name="auto" />
            <span>Auto</span>
            <em>live weather</em>
          </button>
          {GROUPS.map((g) => (
            <div className="sky-group" key={g.title}>
              <p className="sky-group-t">{g.title}</p>
              {g.items.map((i) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={manual === i.id}
                  className={`sky-opt${manual === i.id ? ' on' : ''}`}
                  key={i.id}
                  onClick={() => pick(i.id)}
                >
                  <Icon name={i.icon} />
                  <span>{i.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        ref={triggerRef}
        className="sky-chip"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name={active.icon} />
        {auto ? (
          <>
            <span className="sky-live" aria-hidden="true" />
            <span>
              {place}, {clockLabel(location)}
            </span>
            <span className="sr-only">— live weather. Change the hero sky</span>
          </>
        ) : (
          <>
            <span>{active.label}</span>
            <span className="sr-only">— chosen. Change the hero sky</span>
          </>
        )}
      </button>
    </div>
  );
}
