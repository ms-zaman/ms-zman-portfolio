/**
 * HeroSky — the Astro island entry. Mounted with `client:only="react"` behind the
 * hero content. It:
 *   • resolves the scene `condition` — an explicit prop wins, else the ?skyWeather
 *     preview override, else live Open-Meteo weather × the SkyEngine day/night phase
 *     (re-evaluated each minute so the sky flips at dusk/dawn);
 *   • renders the <Canvas> (dpr 1–2, AdaptiveDpr) with <WeatherScene> under Suspense;
 *   • fades itself in once the first frame is ready and hides the CSS poster clouds,
 *     so the instant-painting photo poster covers the pre-hydration gap;
 *   • bails out entirely under prefers-reduced-motion, leaving the poster in place.
 */
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { WeatherScene } from './WeatherScene';
import type { Condition } from './conditions';
import { computeState, DHAKA, resolveVisitorLocation } from '../../../scripts/sky-engine';
import type { Location } from '../../../scripts/sky-engine';
import { fetchWeather, type WeatherKind } from '../../../scripts/weather';
import { conditionOverride, resolveCondition } from '../../../scripts/resolve-condition';
import { applyWeatherVars } from '../../../scripts/weather-css';

const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Signal the Astro hero that WebGL is live, so it can hide the CSS poster clouds/glow. */
function markWebglReady() {
  document.querySelector('.hero')?.classList.add('sky-webgl');
}

interface Props {
  /** Force a condition (skips live weather + the ?skyWeather override). */
  condition?: Condition;
}

export default function HeroSky({ condition: forced }: Props) {
  const [reduced] = useState(prefersReducedMotion);
  const [condition, setCondition] = useState<Condition>(
    () => forced ?? conditionOverride() ?? 'sunny',
  );
  const [ready, setReady] = useState(false);
  const locationRef = useRef<Location>(DHAKA);

  // resolve the live condition (unless forced or overridden via ?skyWeather)
  useEffect(() => {
    if (reduced) return;
    if (forced) {
      setCondition(forced);
      return;
    }
    const override = conditionOverride();
    if (override) {
      setCondition(override);
      return;
    }

    let cancelled = false;
    let kind: WeatherKind = 'clear';
    const recompute = () => {
      if (!cancelled) {
        setCondition(resolveCondition(kind, computeState(locationRef.current).phase));
      }
    };

    (async () => {
      const loc = await resolveVisitorLocation(true); // silent; Dhaka fallback
      if (cancelled) return;
      locationRef.current = loc;
      const weather = await fetchWeather(loc);
      if (cancelled) return;
      if (weather) kind = weather;
      recompute();
    })();

    // the phase (and so the condition) flips at dusk/dawn even if the weather holds
    const id = window.setInterval(recompute, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [forced, reduced]);

  // Publish the resolved condition to CSS so the mid-page SkyBand (which stays
  // CSS, not a second WebGL canvas) tracks the hero's weather. Runs even under
  // reduced motion so the band still gets the initial condition's wash.
  useEffect(() => {
    applyWeatherVars(condition);
  }, [condition]);

  // Dev-only: preview any condition live from the console, e.g.
  //   __setSkyCondition('drizzle')   (watch it lerp over ~1.5s)
  // Stripped from production builds by Vite (import.meta.env.DEV → false).
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    (window as unknown as { __setSkyCondition?: typeof setCondition }).__setSkyCondition = setCondition;
  }, []);

  // reduced motion → no canvas; the CSS photo poster (+ birds) carries the hero
  if (reduced) return null;

  return (
    <div className={`hero-sky${ready ? ' ready' : ''}`} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.2, 6], fov: 60, near: 0.1, far: 1_000_000 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          markWebglReady();
          requestAnimationFrame(() => setReady(true));
        }}
      >
        <Suspense fallback={null}>
          <WeatherScene condition={condition} locationRef={locationRef} />
        </Suspense>
        {/* auto-drop resolution under sustained load to protect 60 FPS */}
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}
