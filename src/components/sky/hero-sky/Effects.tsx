/**
 * Atmospheric effects — lighting, fog and lightning. Small pieces grouped together;
 * each reads the lerped Live state in its own useFrame.
 */
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSky } from './sky-state';

/** Ambient fill + a key "sun" light aimed along the shared sunDir; both lerped. */
export function Lighting() {
  const live = useSky();
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const keyRef = useRef<THREE.DirectionalLight>(null!);

  useFrame(() => {
    ambientRef.current.intensity = live.nums.ambient;
    ambientRef.current.color.copy(live.cols.ambientColor);
    keyRef.current.intensity = live.nums.keyIntensity;
    keyRef.current.color.copy(live.cols.keyColor);
    // place the key light along the sun direction so cloud shading tracks the sun
    keyRef.current.position.copy(live.sunDir).multiplyScalar(20);
  });

  return (
    <>
      <ambientLight ref={ambientRef} />
      <directionalLight ref={keyRef} />
    </>
  );
}

/** Exponential fog for depth; density + colour lerped. Applied to lit scene objects. */
export function Atmosphere() {
  const live = useSky();
  const { scene } = useThree();
  const fog = useMemo(() => new THREE.FogExp2(new THREE.Color('#cfe4fb').getHex(), 0.0016), []);

  useEffect(() => {
    const prev = scene.fog;
    scene.fog = fog;
    return () => {
      scene.fog = prev;
    };
  }, [scene, fog]);

  useFrame(() => {
    fog.density = live.nums.fogDensity;
    fog.color.copy(live.cols.fogColor);
  });

  return null;
}

/**
 * Occasional lightning: writes a flash envelope into `Live.flash` (so the whole
 * sky-dome lights up — see SkyDome's uFlash) and drives a point light hidden in
 * the clouds (so the cloud undersides pop). `Live.lightning` sets the average
 * frequency (drizzle/cloudy > 0, everything else 0).
 *
 * Physics: a strike snaps the envelope to 1, then it decays exponentially. Real
 * lightning is a rapid multi-stroke flicker, so during a strike we occasionally
 * re-arm a second, dimmer envelope (the "return stroke") and modulate the value
 * with noise — never a clean linear fade.
 */
export function Lightning() {
  const live = useSky();
  const lightRef = useRef<THREE.PointLight>(null!);
  const envelope = useRef(0); // current flash brightness (decays each frame)
  const cooldown = useRef(THREE.MathUtils.randFloat(1.5, 9)); // seconds until the next strike
  const restrike = useRef(0); // pending double-strike timer

  useFrame((_, dt) => {
    const rate = live.nums.lightning;

    if (rate > 0.01) {
      cooldown.current -= dt;
      if (cooldown.current <= 0) {
        // random strike strength — not every bolt is a full-brightness flash
        envelope.current = THREE.MathUtils.randFloat(0.6, 1);
        // ~50% of strikes get a quick second flash a beat later
        restrike.current = Math.random() < 0.5 ? THREE.MathUtils.randFloat(0.06, 0.24) : 0;
        // irregular gaps: usually a few seconds, but ~30% of the time a long lull —
        // so the storm never settles into a predictable rhythm
        const gap =
          THREE.MathUtils.randFloat(2.5, 13) +
          (Math.random() < 0.3 ? THREE.MathUtils.randFloat(5, 13) : 0);
        cooldown.current = gap / Math.max(rate, 0.1);
      }
      if (restrike.current > 0) {
        restrike.current -= dt;
        if (restrike.current <= 0) envelope.current = Math.max(envelope.current, 0.7);
      }
    } else {
      envelope.current = 0;
    }

    // exponential-ish decay + high-frequency flicker so it reads as a strike, not a fade
    envelope.current = Math.max(0, envelope.current - dt * 3.6);
    const flicker = envelope.current > 0 ? 0.55 + 0.45 * Math.random() : 0;
    const value = envelope.current * flicker;

    live.flash = value; // → SkyDome uFlash: the whole sky flares
    lightRef.current.intensity = value * 9; // → cloud undersides light up
  });

  return <pointLight ref={lightRef} position={[0, 7, 3]} color="#eaf0ff" intensity={0} distance={90} decay={1.3} />;
}
