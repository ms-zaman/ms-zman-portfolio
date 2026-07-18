/**
 * SkyEngine v1 — drives the hero sky from the visitor's local time.
 *
 * It computes where the sun sits on its arc and a dawn/day/dusk/night colour
 * palette, then writes them to the CSS custom properties the Hero consumes:
 *   --sun-x / --sun-y   sun glow position (see sky-tokens.css)
 *   --sun-glow          sun glow colour
 *   --sky-tint / -2     overlay wash the hero fades over the photo
 * It also stamps `data-sky-phase` on <html> so CSS can key off the phase.
 *
 * Location defaults to Dhaka — MS Zaman is a "web developer in Dhaka", so every
 * visitor sees the sky over Dhaka. If the visitor has *already* granted
 * geolocation permission we silently upgrade to their own sky; we never prompt
 * on load. A UI control can call requestVisitorLocation() to ask explicitly.
 *
 * No network and no dependencies: sunrise/sunset come from the standard solar
 * equation (USNO/Almanac), so this works offline on a static Netlify build.
 * Weather (Open-Meteo) is a later v2 concern.
 */

type Phase = 'dawn' | 'day' | 'dusk' | 'night';

interface Location {
  lat: number;
  lng: number;
  /** Fixed UTC offset in hours, used to express solar times in local time. */
  utcOffset: number;
}

interface SkyState {
  phase: Phase;
  sunX: number; // percent
  sunY: number; // percent (small = high in the sky)
  glow: string;
  tint: string;
  tint2: string;
}

const DHAKA: Location = { lat: 23.8103, lng: 90.4125, utcOffset: 6 };

const RAD = Math.PI / 180;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const norm360 = (v: number) => ((v % 360) + 360) % 360;
const norm24 = (v: number) => ((v % 24) + 24) % 24;

/** Per-phase glow + tint. `day` is fully transparent so the photo shows raw. */
const PALETTE: Record<Phase, { glow: string; tint: string; tint2: string }> = {
  dawn:  { glow: 'rgba(255, 209, 166, .62)', tint: 'rgba(255, 178, 150, .26)', tint2: 'rgba(120, 140, 205, .12)' },
  day:   { glow: 'rgba(255, 244, 214, .70)', tint: 'rgba(255, 255, 255, 0)',   tint2: 'rgba(255, 255, 255, 0)' },
  dusk:  { glow: 'rgba(255, 176, 120, .70)', tint: 'rgba(255, 138, 92, .30)',  tint2: 'rgba(72, 60, 120, .22)' },
  night: { glow: 'rgba(200, 218, 255, .14)', tint: 'rgba(9, 19, 52, .58)',     tint2: 'rgba(16, 30, 72, .40)' },
};

/**
 * Sunrise & sunset as fractional hours in the location's local time.
 * Returns null for the polar edge case (sun never crosses the horizon).
 */
function sunTimes(date: Date, loc: Location): { sunrise: number | null; sunset: number | null } {
  const zenith = 90.833; // official: includes atmospheric refraction + the sun's radius

  // day of the year (1 = Jan 1), computed in UTC to avoid DST wobble
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 0);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const N = Math.round((today - yearStart) / 86400000);

  const lngHour = loc.lng / 15;

  const calc = (rising: boolean): number | null => {
    const t = N + ((rising ? 6 : 18) - lngHour) / 24;

    const M = 0.9856 * t - 3.289;                    // sun's mean anomaly (deg)
    const L = norm360(                                // sun's true longitude (deg)
      M + 1.916 * Math.sin(M * RAD) + 0.020 * Math.sin(2 * M * RAD) + 282.634,
    );

    let RA = norm360(Math.atan(0.91764 * Math.tan(L * RAD)) / RAD); // right ascension (deg)
    RA += Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90;        // same quadrant as L
    RA /= 15;                                                        // into hours

    const sinDec = 0.39782 * Math.sin(L * RAD);
    const cosDec = Math.cos(Math.asin(sinDec));

    const cosH = (Math.cos(zenith * RAD) - sinDec * Math.sin(loc.lat * RAD)) /
      (cosDec * Math.cos(loc.lat * RAD));
    if (cosH > 1 || cosH < -1) return null; // sun never rises / never sets here today

    const H = (rising ? 360 - Math.acos(cosH) / RAD : Math.acos(cosH) / RAD) / 15;
    const T = H + RA - 0.06571 * t - 6.622; // local mean time of the event (hours)
    const UT = norm24(T - lngHour);         // → UTC
    return norm24(UT + loc.utcOffset);      // → location local time
  };

  return { sunrise: calc(true), sunset: calc(false) };
}

/** Current wall-clock hour (fractional) at the location. */
function localHours(date: Date, loc: Location): number {
  const utc = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  return norm24(utc + loc.utcOffset);
}

/** Dev/preview override: `?skyHour=18.5` forces the clock so any phase can be inspected. */
function overrideHour(): number | null {
  try {
    const raw = new URLSearchParams(location.search).get('skyHour');
    if (raw === null) return null;
    const n = parseFloat(raw);
    return Number.isFinite(n) ? norm24(n) : null;
  } catch {
    return null;
  }
}

function computeState(loc: Location, now: Date = new Date()): SkyState {
  const { sunrise, sunset } = sunTimes(now, loc);
  const SR = sunrise ?? 6;   // polar fallback: assume a plain 6→18 day
  const SS = sunset ?? 18;
  const h = overrideHour() ?? localHours(now, loc);

  // soft transition windows around sunrise/sunset
  const dawnStart = SR - 0.6, dawnEnd = SR + 0.9;
  const duskStart = SS - 0.9, duskEnd = SS + 0.6;

  let phase: Phase;
  if (h < dawnStart || h >= duskEnd) phase = 'night';
  else if (h < dawnEnd) phase = 'dawn';
  else if (h < duskStart) phase = 'day';
  else phase = 'dusk';

  // sun travels left→right and arcs high at solar noon
  const dayFrac = clamp((h - SR) / (SS - SR), 0, 1);
  const sunX = lerp(6, 94, dayFrac);
  const sunY = clamp(60 - 58 * Math.sin(Math.PI * dayFrac), 2, 60);

  const p = PALETTE[phase];
  return { phase, sunX, sunY, glow: p.glow, tint: p.tint, tint2: p.tint2 };
}

function apply(root: HTMLElement, s: SkyState): void {
  root.style.setProperty('--sun-x', `${s.sunX.toFixed(1)}%`);
  root.style.setProperty('--sun-y', `${s.sunY.toFixed(1)}%`);
  root.style.setProperty('--sun-glow', s.glow);
  root.style.setProperty('--sky-tint', s.tint);
  root.style.setProperty('--sky-tint-2', s.tint2);
  root.dataset.skyPhase = s.phase; // → <html data-sky-phase="…">
}

let currentLoc: Location = DHAKA;

/**
 * Fetch the visitor's own coordinates and re-render. Triggers the browser
 * permission prompt, so only call this from an explicit user action — unless
 * `silentOnly` is true, in which case it upgrades only when permission was
 * already granted and never prompts.
 */
export function requestVisitorLocation(silentOnly = false): void {
  if (!('geolocation' in navigator)) return;

  const use = () =>
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          utcOffset: -new Date().getTimezoneOffset() / 60,
        };
        apply(document.documentElement, computeState(currentLoc));
      },
      () => {}, // denied / unavailable → stay on the Dhaka sky
      { maximumAge: 30 * 60_000, timeout: 8000 },
    );

  if (!silentOnly) {
    use();
    return;
  }

  // silent path: only upgrade if the visitor already granted permission
  navigator.permissions?.query({ name: 'geolocation' as PermissionName })
    .then((status) => { if (status.state === 'granted') use(); })
    .catch(() => {});
}

/** Wire up the engine: render Dhaka now, keep it live, upgrade silently if allowed. */
export function initSkyEngine(): void {
  const w = window as unknown as { __skyEngine?: boolean };
  if (w.__skyEngine) return;
  w.__skyEngine = true;

  const render = () => apply(document.documentElement, computeState(currentLoc));

  render();
  requestVisitorLocation(true); // silent upgrade if already granted

  // keep it live: tick each minute and whenever the tab regains focus
  setInterval(render, 60_000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
}
