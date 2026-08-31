/**
 * WeatherCanvas — the R3F <Canvas> and everything that reaches three.js, split
 * out of HeroSky so it can be lazy-imported.
 *
 * Why the split: HeroSky renders no canvas at all under reduced motion or on a
 * `sunny` sky (the CSS hero owns that case — see POSTER_CONDITIONS), yet a
 * top-level `@react-three/fiber` import still dragged the ~270 kB gz WebGL
 * vendor chunk onto every visit, including the commonest daytime one. Behind
 * React.lazy the chunk is fetched only when a canvas is actually going to mount.
 *
 * Keep this file the ONLY place in the hero tree that imports three/r3f/drei at
 * the top level, or the chunk leaks back onto the poster path.
 */
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { Suspense, type MutableRefObject } from 'react';
import { WeatherScene } from './WeatherScene';
import type { Condition } from './conditions';
import type { Location } from '../../../scripts/sky-engine';

interface Props {
  condition: Condition;
  /** Live-updated by HeroSky as geolocation resolves; read each frame for the sun arc. */
  locationRef: MutableRefObject<Location>;
  /** Drives the render loop: false parks it while the hero is offscreen or the tab is hidden. */
  active: boolean;
  /** Fired inside onCreated, once the GL context exists. */
  onCreated: () => void;
}

export default function WeatherCanvas({ condition, locationRef, active, onCreated }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.1, 6], fov: 60, near: 0.1, far: 1_000_000 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        onCreated();
      }}
    >
      <Suspense fallback={null}>
        <WeatherScene condition={condition} locationRef={locationRef} />
      </Suspense>
      {/* auto-drop resolution under sustained load to protect 60 FPS */}
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
