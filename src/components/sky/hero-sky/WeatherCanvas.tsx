/**
 * WeatherCanvas — the R3F <Canvas> and everything that reaches three.js, split
 * out of HeroSky so it can be lazy-imported.
 *
 * Why the split: HeroSky renders no canvas at all under reduced motion, on a
 * `sunny` sky (the CSS hero owns that case — see POSTER_CONDITIONS), or before
 * the page has finished loading on capable hardware (see capability.ts), yet a
 * top-level `@react-three/fiber` import still dragged the ~216 kB gz WebGL
 * vendor chunk onto every visit. Behind React.lazy the chunk is fetched only
 * when a canvas is actually going to mount.
 *
 * Keep this file the ONLY place in the hero tree that imports three/r3f/drei at
 * the top level, or the chunk leaks back onto the poster path.
 */
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { Suspense, useEffect, type MutableRefObject } from 'react';
import { WeatherScene } from './WeatherScene';
import type { Condition } from './conditions';
import type { Location } from '../../../scripts/sky-engine';

/**
 * The sky is a slow, atmospheric backdrop behind text — it reads identically at
 * 30 fps and costs half the GPU/CPU of 60. `frameloop="demand"` hands the render
 * schedule to us; this drives it at a capped rate instead of every vsync.
 */
const FPS = 30;

function FrameDriver() {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      if (t - last < 1000 / FPS) return;
      last = t;
      invalidate();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);

  return null;
}

/**
 * Device pixel ratio. Capped at 1.5 on desktop and pinned to 1 on phones: the
 * dome and cloud rafts have no hard edges to alias, and dropping from 2 to 1
 * quarters the fragment work — the single biggest per-frame saving available.
 */
function pickDpr(): [number, number] {
  return window.matchMedia('(max-width: 900px)').matches ? [1, 1] : [1, 1.5];
}

interface Props {
  condition: Condition;
  /** Live-updated by HeroSky as geolocation resolves; read each frame for the sun arc. */
  locationRef: MutableRefObject<Location>;
  /** Drives the render loop: false parks it while the hero is offscreen or the tab is hidden. */
  active: boolean;
  /** Fired inside onCreated, once the GL context exists. */
  onCreated: () => void;
  /** Fired when the frame budget says this device can't carry the scene. */
  onTooSlow: () => void;
}

export default function WeatherCanvas({
  condition,
  locationRef,
  active,
  onCreated,
  onTooSlow,
}: Props) {
  return (
    <Canvas
      dpr={pickDpr()}
      frameloop={active ? 'demand' : 'never'}
      // No antialiasing: nothing in the scene has a hard edge for MSAA to soften,
      // so it was pure cost on every frame.
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.1, 6], fov: 60, near: 0.1, far: 1_000_000 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        onCreated();
      }}
    >
      <Suspense fallback={null}>
        <WeatherScene condition={condition} locationRef={locationRef} onTooSlow={onTooSlow} />
      </Suspense>
      {active && <FrameDriver />}
      {/* auto-drop resolution under sustained load to protect the frame rate */}
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
