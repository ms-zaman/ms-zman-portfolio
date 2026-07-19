/**
 * WeatherScene — the lerp state machine and scene root.
 *
 * Owns the single `Live` object and, in one useFrame, eases every field toward the
 * active preset (`THREE.MathUtils.lerp` for numbers, `Color.lerp` for colours) so a
 * `condition` change never pops — it glides over ~1.5 s. It also refreshes the shared
 * sun direction (slowly, from the SkyEngine solar math) and applies the damped
 * parallax offset to the camera. Child layers read `Live` via context.
 */
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';
import { CONDITIONS, type Condition } from './conditions';
import { SkyBackdrop } from './SkyBackdrop';
import { Clouds } from './Clouds';
import { Rain } from './Rain';
import { Lighting, Atmosphere, Lightning } from './Effects';
import {
  COLOR_KEYS,
  NUM_KEYS,
  SkyProvider,
  easeK,
  makeColors,
  makeLive,
  pickNums,
  useParallax,
  type ColKey,
  type NumKey,
} from './sky-state';
import { sunVector } from '../../../scripts/sky-engine';
import type { Location } from '../../../scripts/sky-engine';

// eases: fast enough that ~4·TAU ≈ 1.5 s to settle a weather change
const TAU_STATE = 0.4;
const TAU_SUN = 1.2; // the sun moves slowly; ease location upgrades gently
const TAU_PARALLAX = 0.35;

interface Props {
  condition: Condition;
  /** Live-updated by HeroSky as geolocation resolves; read each frame for the sun arc. */
  locationRef: MutableRefObject<Location>;
}

export function WeatherScene({ condition, locationRef }: Props) {
  const live = useMemo(() => makeLive(CONDITIONS[condition]), []); // eslint-disable-line react-hooks/exhaustive-deps
  const targetNums = useRef<Record<NumKey, number>>(pickNums(CONDITIONS[condition]));
  const targetCols = useRef<Record<ColKey, THREE.Color>>(makeColors(CONDITIONS[condition]));
  const parallax = useParallax();
  const tmpSun = useMemo(() => new THREE.Vector3(), []);

  // retarget when the condition changes (colours are copied into stable Color objects)
  useEffect(() => {
    targetNums.current = pickNums(CONDITIONS[condition]);
    const next = makeColors(CONDITIONS[condition]);
    for (const k of COLOR_KEYS) targetCols.current[k].copy(next[k]);
  }, [condition]);

  useFrame((state, dt) => {
    const kState = easeK(dt, TAU_STATE);
    for (const n of NUM_KEYS) {
      live.nums[n] = THREE.MathUtils.lerp(live.nums[n], targetNums.current[n], kState);
    }
    for (const c of COLOR_KEYS) {
      live.cols[c].lerp(targetCols.current[c], kState);
    }

    // shared sun direction (drives <Sky>, dome glow and the key light)
    const [sx, sy, sz] = sunVector(locationRef.current);
    tmpSun.set(sx, sy, sz);
    live.sunDir.lerp(tmpSun, easeK(dt, TAU_SUN));

    // damped parallax → subtle camera dolly for depth
    live.parallax.lerp(parallax.current, easeK(dt, TAU_PARALLAX));
    state.camera.position.x = live.parallax.x * 0.5;
    state.camera.position.y = 0.2 - live.parallax.y * 0.35;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <SkyProvider value={live}>
      <SkyBackdrop />
      <Lighting />
      <Clouds />
      <Rain />
      <Atmosphere />
      <Lightning />
    </SkyProvider>
  );
}
