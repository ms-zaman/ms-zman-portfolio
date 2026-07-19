/**
 * Weather → CSS bridge. The R3F hero owns the WebGL weather scene, but the
 * mid-page SkyBand stays CSS (no second WebGL context). So the hero island
 * publishes the *resolved* condition as a CSS custom property (`--wx-tint`, a
 * translucent wash) + a `data-sky-weather` attribute on <html>; SkyBand blends
 * the wash over its existing time-of-day atmosphere and cross-fades via its own
 * CSS transition. Keeps the band in sync with the hero's weather, for free.
 */
import type { Condition } from '../components/sky/hero-sky/conditions';

/**
 * Per-condition wash. Day/night darkening is already handled by the SkyEngine's
 * time-based `--sky-tint`, so these encode only the *weather* delta (cloud/wet
 * veil) — night conditions stay light so they don't double up on the night tint.
 */
// Strong enough to read over the bright sky.avif photo — a light mute reads as
// "still sunny", so the wet/overcast conditions need a heavy veil.
const WX_TINT: Record<Condition, string> = {
  sunny: 'rgba(255, 255, 255, 0)', // clear — no veil
  cloudy: 'rgba(128, 143, 166, 0.60)', // grey overcast
  drizzle: 'rgba(46, 57, 74, 0.74)', // wet storm slate
  'overcast-night': 'rgba(8, 15, 30, 0.70)', // heavy dark veil
  'clear-night': 'rgba(10, 20, 42, 0.42)', // clear — let the night tint show
};

export function applyWeatherVars(condition: Condition, root: HTMLElement = document.documentElement): void {
  root.style.setProperty('--wx-tint', WX_TINT[condition]);
  root.dataset.skyWeather = condition; // → <html data-sky-weather="…"> (future CSS hooks)
}
