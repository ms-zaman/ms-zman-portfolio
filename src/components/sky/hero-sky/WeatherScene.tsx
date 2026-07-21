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
  useParallax,
  type ColKey,
  type NumKey,
} from './sky-state';
import { moonVector, sunVector } from '../../../scripts/sky-engine';
import type { Location } from '../../../scripts/sky-engine';

// eases: fast enough that ~4·TAU ≈ 1.5 s to settle a weather change
const TAU_STATE = 0.4;
const TAU_SUN = 1.2; // the sun moves slowly; ease location upgrades gently
// Parallax springs. τ=0.35 needed ~1.4 s to settle, so the sky trailed the hand;
// 0.11 lands in the ~0.25 s range that feels attached to the pointer.
const TAU_NEAR = 0.11; // leads — the cloud rafts
const TAU_FAR = 0.26; // trails — the camera, and with it the whole backdrop
const PARALLAX_X = 1.1; // camera dolly, world units at full deflection
const PARALLAX_Y = 0.6;
const CAMERA_Y = 0.1; // slight lift; with the dolly there is no lookAt tilt to offset
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
  const parallax = useParallax();
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

    // Two springs off the same input: the fast one leads (near layer), the slow one
    // trails (camera → far layer). That difference in *timing* is most of what makes
    // depth read as depth; matched springs move everything as one rigid slab.
    live.parallax.lerp(parallax.current, easeK(dt, TAU_NEAR));
    live.parallaxSlow.lerp(parallax.current, easeK(dt, TAU_FAR));

    // Dolly, don't orbit. The old code moved the camera and then re-aimed it with
    // lookAt(0,0,0), which pivots the whole scene — the rotation swamps the
    // translation, so the *far* backdrop swept further than the near rafts and the
    // depth cue came out backwards. Translating with the aim held fixed gives the
    // real thing: near moves a lot, far barely moves.
    state.camera.position.x = live.parallaxSlow.x * PARALLAX_X;
    state.camera.position.y = CAMERA_Y - live.parallaxSlow.y * PARALLAX_Y;
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
