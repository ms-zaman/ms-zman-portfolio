/**
 * Weather source for the R3F hero — Open-Meteo (keyless, no API token, CORS-open),
 * so it works from the static Netlify build with a plain client-side fetch. WMO
 * weather-interpretation codes are folded into a small set of "kinds" that the
 * condition resolver maps onto the five scene presets.
 */
import type { Location } from './sky-engine';

export type WeatherKind =
  | 'clear'
  | 'partly'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunder';

/** WMO weather-interpretation code → coarse kind. */
function wmoToKind(code: number): WeatherKind {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'thunder';
  return 'partly';
}

/**
 * Current weather for a location. Returns null on any failure (offline, blocked,
 * rate-limited) so the caller can fall back to a clear sky.
 */
export async function fetchWeather(loc: Location, signal?: AbortSignal): Promise<WeatherKind | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${loc.lat.toFixed(3)}&longitude=${loc.lng.toFixed(3)}&current=weather_code`;
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const json = (await res.json()) as { current?: { weather_code?: number } };
    const code = json?.current?.weather_code;
    return typeof code === 'number' ? wmoToKind(code) : null;
  } catch {
    return null;
  }
}
