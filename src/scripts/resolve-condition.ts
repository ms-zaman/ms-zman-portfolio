/**
 * Combine coarse weather (Open-Meteo) with the time-of-day phase (SkyEngine) into
 * one of the five scene conditions the R3F hero knows how to render. Also parses
 * the `?skyWeather=` preview override (mirrors the engine's `?skyHour=`).
 */
import type { Phase } from './sky-engine';
import type { WeatherKind } from './weather';
import type { Condition } from '../components/sky/hero-sky/conditions';

const CONDITION_VALUES: readonly Condition[] = [
  'sunny',
  'cloudy',
  'drizzle',
  'snow',
  'overcast-night',
  'clear-night',
];

/** Map weather + phase → scene condition. At night, "clear" → stars, wet/heavy → overcast-night. */
export function resolveCondition(kind: WeatherKind, phase: Phase): Condition {
  const night = phase === 'night';
  switch (kind) {
    case 'clear':
    case 'partly':
      return night ? 'clear-night' : 'sunny';
    case 'overcast':
    case 'fog':
      return night ? 'overcast-night' : 'cloudy';
    case 'snow':
      return night ? 'overcast-night' : 'snow';
    case 'drizzle':
    case 'rain':
    case 'thunder':
      return night ? 'overcast-night' : 'drizzle';
    default:
      return night ? 'clear-night' : 'sunny';
  }
}

/** Dev/preview override: `?skyWeather=drizzle` forces a scene condition. */
export function conditionOverride(): Condition | null {
  try {
    const raw = new URLSearchParams(location.search).get('skyWeather');
    return raw && (CONDITION_VALUES as readonly string[]).includes(raw) ? (raw as Condition) : null;
  } catch {
    return null;
  }
}
