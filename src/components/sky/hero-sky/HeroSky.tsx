/**
 * HeroSky — the Astro island entry. Mounted with `client:only="react"` behind the
 * hero content. It:
 *   • resolves the scene `condition` — an explicit prop wins, else the visitor's
 *     own pick (a ?skyWeather preview link, or the choice they made in the sky
 *     picker and we remembered), else live Open-Meteo weather × the SkyEngine
 *     day/night phase (re-evaluated each minute so the sky flips at dusk/dawn);
 *   • lazy-loads <WeatherCanvas> — only once the page has finished loading, only on
 *     hardware that can carry it (capability.ts), and only when the sky is one WebGL
 *     actually draws, so every other visit costs no three.js at all;
 *   • fades itself in once the first frame is ready and hides the CSS poster clouds,
 *     so the instant-painting photo poster covers the wait;
 *   • pauses the render loop when the hero is offscreen or the tab is hidden;
 *   • falls back to the poster on WebGL failure (error boundary) or reduced motion;
 *   • renders the <SkyPicker> chip, which is how a visitor discovers any of this.
 */
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { CanvasErrorBoundary } from './ErrorBoundary';
import { SkyPicker, savedCondition } from './SkyPicker';
import type { Condition } from './conditions';
import { computeState, DHAKA, resolveVisitorLocation } from '../../../scripts/sky-engine';
import type { Location } from '../../../scripts/sky-engine';
import { fetchWeather, type WeatherKind } from '../../../scripts/weather';
import { conditionOverride, resolveCondition } from '../../../scripts/resolve-condition';
import { applyWeatherVars } from '../../../scripts/weather-css';
import { canAffordWebgl, rememberTooSlow, whenIdle } from './capability';

const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Conditions the CSS hero renders better than WebGL can, so the canvas sits them out.
 *
 * `sunny` is the prototype's hero (redesign/variant-e): the sky.avif photograph, its
 * warm off-frame glow, and the drifting cloud cut-outs. A two-stop procedural dome
 * can't reproduce a photograph — matching it by eye left ~11.5° of hue drift at every
 * height, and closing that gap dropped the h1 below its contrast floor. Letting the
 * CSS hero own the clear-sky case makes the two layers identical by construction
 * (there is no handoff to mismatch) and costs no WebGL work on the commonest sky.
 * Every other condition — clouds, rain, snow, the moonlit nights — is procedural,
 * where the canvas earns its keep.
 */
const POSTER_CONDITIONS: ReadonlySet<Condition> = new Set<Condition>(['sunny']);

/** Signal the Astro hero that WebGL is live, so it can hide the CSS poster clouds/glow. */
function markWebglReady() {
  document.querySelector('.hero')?.classList.add('sky-webgl');
}

/**
 * The canvas — and with it three/r3f/drei — is fetched only when one is actually
 * going to mount. On any poster path (`sunny`, reduced motion, a device that fails
 * `canAffordWebgl`, or simply before the page has finished loading) this import
 * never fires, so those visits skip the ~216 kB gz WebGL chunk entirely.
 */
const WeatherCanvas = lazy(() => import('./WeatherCanvas'));

interface Props {
  /** Force a condition (skips live weather, the visitor's pick, and the picker). */
  condition?: Condition;
}

export default function HeroSky({ condition: forced }: Props) {
  const [reduced] = useState(prefersReducedMotion);
  // What the live weather says. Tracked even while a manual pick is in force, so
  // switching back to Auto is instant instead of a fetch away.
  const [autoCondition, setAutoCondition] = useState<Condition>('sunny');
  // What the visitor asked for; null = follow the weather. A ?skyWeather= link
  // seeds it (preview), otherwise their remembered choice does.
  const [manual, setManual] = useState<Condition | null>(
    () => conditionOverride() ?? savedCondition(),
  );
  const [ready, setReady] = useState(false);
  // Whether WebGL is allowed to mount yet. False until the page has loaded and gone
  // idle, and permanently false on hardware that can't afford it — the render loop
  // used to start inside the load window and keep the main thread from ever going
  // quiet, which is what put TBT into the seconds.
  const [armed, setArmed] = useState(false);
  const [location, setLocation] = useState<Location>(DHAKA);
  const locationRef = useRef<Location>(DHAKA);
  const containerRef = useRef<HTMLDivElement>(null);
  // drive the render loop: "always" when the hero is visible, "never" when it isn't
  const [active, setActive] = useState(true);
  const condition = forced ?? manual ?? autoCondition;
  const usePoster = reduced || !armed || POSTER_CONDITIONS.has(condition);

  // Arm the canvas after `load` + idle, if this device can carry it at all.
  useEffect(() => {
    if (reduced) return;
    whenIdle(() => setArmed(canAffordWebgl()));
  }, [reduced]);

  // The scene measured itself and couldn't hold a frame rate: retire the canvas for
  // good and let the CSS poster have the sky back.
  const handleTooSlow = useCallback(() => {
    rememberTooSlow();
    setArmed(false);
  }, []);

  // track the live weather (skipped when a caller forces the condition outright)
  useEffect(() => {
    if (reduced || forced) return;

    let cancelled = false;
    let kind: WeatherKind = 'clear';
    const recompute = () => {
      if (!cancelled) {
        setAutoCondition(resolveCondition(kind, computeState(locationRef.current).phase));
      }
    };

    (async () => {
      const loc = await resolveVisitorLocation(true); // silent; Dhaka fallback
      if (cancelled) return;
      locationRef.current = loc;
      setLocation(loc); // the picker names the place it's reporting weather for
      // cap the request so a stalled network can't hold the connection open;
      // fetchWeather swallows the abort and returns null → we keep the default sky
      const weather = await fetchWeather(loc, AbortSignal.timeout(6000));
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
    (window as unknown as { __setSkyCondition?: typeof setManual }).__setSkyCondition = setManual;
  }, []);

  // Hand the sky back to the CSS hero: drop the class that hides its clouds/glow.
  // (The Loader no longer waits on the hero — WebGL now arrives well after the
  // reveal, so gating the splash on a first frame only held the page back.)
  useEffect(() => {
    if (!usePoster) return;
    document.querySelector('.hero')?.classList.remove('sky-webgl');
    setReady(false);
  }, [usePoster]);

  // Pause the WebGL loop when the hero is offscreen (scrolled past) or the tab is
  // hidden, so it doesn't burn GPU/battery while the visitor reads the rest of the
  // page. `frameloop="never"` fully stops rendering until it's visible again.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let inView = true;
    const update = () => setActive(inView && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { rootMargin: '200px' }, // resume just before it scrolls back into view
    );
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  // Runs inside the canvas's onCreated: hide the CSS poster's clouds/glow, then
  // (one frame later, so the sky is genuinely painted) fade the canvas in. The
  // .hero-sky opacity transition covers the handoff.
  const handleCanvasCreated = useCallback(() => {
    markWebglReady();
    requestAnimationFrame(() => setReady(true));
  }, []);

  return (
    <>
      {/* reduced motion, or a condition the CSS hero owns → no canvas at all */}
      {!usePoster && (
        <div ref={containerRef} className={`hero-sky${ready ? ' ready' : ''}`} aria-hidden="true">
          <CanvasErrorBoundary>
            <Suspense fallback={null}>
              <WeatherCanvas
                condition={condition}
                locationRef={locationRef}
                active={active}
                onCreated={handleCanvasCreated}
                onTooSlow={handleTooSlow}
              />
            </Suspense>
          </CanvasErrorBoundary>
        </div>
      )}

      {/* Under reduced motion the sky is a still photo and only `sunny` is honest —
          picking anything else would strip the scrim and show no weather at all.
          So the control only appears where it can actually deliver. */}
      {!reduced && !forced && (
        <SkyPicker condition={condition} manual={manual} onPick={setManual} location={location} />
      )}
    </>
  );
}
