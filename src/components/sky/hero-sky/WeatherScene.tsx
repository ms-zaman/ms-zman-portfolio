/**
 * WeatherScene — the lerp state machine and scene root.
 *
 * Owns the single `Live` object and, in one useFrame, eases every field toward the
 * active preset (`THREE.MathUtils.lerp` for numbers, `Color.lerp` for colours) so a
 * `condition` change never pops — it glides over ~1.5 s. It also refreshes the shared
 * sun and moon directions, slowly, from the SkyEngine solar math. Child layers read
 * `Live` via context.
 *
 * The camera does not move. It used to dolly with the pointer (and the phone's gyro),
 * but the sky reads better as a sky than as a thing that follows the cursor.
 */
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';
import { CONDITIONS, type Condition } from './conditions';
import { SkyBackdrop } from './SkyBackdrop';
import { Clouds } from './Clouds';
import { Rain } from './Rain';
import { Snow } from './Snow';
import { Lighting, Atmosphere, Lightning } from './Effects';
import {
  COLOR_KEYS,
  NUM_KEYS,
  SkyProvider,
  easeK,
  makeColors,
  makeLive,
  pickNums,
  type ColKey,
  type NumKey,
} from './sky-state';
import { moonVector, sunVector } from '../../../scripts/sky-engine';
import type { Location } from '../../../scripts/sky-engine';

// eases: fast enough that ~4·TAU ≈ 1.5 s to settle a weather change
const TAU_STATE = 0.4;
const TAU_SUN = 1.2; // the sun moves slowly; ease location upgrades gently
/** Fixed moon elevation on portrait viewports — see the note in the frame loop. */
const PORTRAIT_MOON_EL = 0.36;

interface Props {
  condition: Condition;
  /** Live-updated by HeroSky as geolocation resolves; read each frame for the sun arc. */
  locationRef: MutableRefObject<Location>;
}

export function WeatherScene({ condition, locationRef }: Props) {
  const live = useMemo(() => makeLive(CONDITIONS[condition]), []); // eslint-disable-line react-hooks/exhaustive-deps
  const targetNums = useRef<Record<NumKey, number>>(pickNums(CONDITIONS[condition]));
  const targetCols = useRef<Record<ColKey, THREE.Color>>(makeColors(CONDITIONS[condition]));
  const tmpSun = useMemo(() => new THREE.Vector3(), []);
  const tmpMoon = useMemo(() => new THREE.Vector3(), []);

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

    // Shared moon direction (drives the disc, the dome's moon wash and the moonlight).
    // The engine composes the arc for a wide viewport; a portrait phone has a much
    // narrower *horizontal* fov (fovY is fixed, so halfFovX shrinks with aspect), and
    // the moon would hang off the right edge. Re-aim it as a fraction of whatever
    // horizontal room this viewport actually has.
    const [mx, my, mz] = moonVector(locationRef.current);
    const cam = state.camera as THREE.PerspectiveCamera;
    const halfFovX = Math.atan(Math.tan((cam.fov * Math.PI) / 360) * cam.aspect);
    const az = Math.min(Math.atan2(mx, -mz), halfFovX * 0.62);
    // On a phone the hero copy runs the full width, and the only clear sky is the
    // band between the greet line and the headline (measured: y 138–199 at 390×844).
    // Park the moon there instead of letting the arc drop it behind the h1.
    const el = cam.aspect < 1
      ? PORTRAIT_MOON_EL
      : Math.asin(THREE.MathUtils.clamp(my, -1, 1));
    tmpMoon.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    live.moonDir.lerp(tmpMoon, easeK(dt, TAU_SUN));
  });

  return (
    <SkyProvider value={live}>
      <SkyBackdrop />
      <Lighting />
      <Clouds />
      <Rain />
      <Snow />
      <Atmosphere />
      <Lightning />
    </SkyProvider>
  );
}
