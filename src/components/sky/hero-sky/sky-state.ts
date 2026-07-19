/**
 * Shared lerp state for the hero weather scene.
 *
 * `Live` is a single mutable object the whole scene reads. `WeatherScene` owns one
 * `useFrame` that eases every field toward the active preset; each visual component
 * (backdrop, clouds, rain, lights, fog) reads `Live` in its *own* `useFrame` and
 * copies the interpolated values onto its three.js objects. Nothing here triggers a
 * React re-render per frame — the interpolation happens entirely in mutable refs.
 */
import { createContext, useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';
import type { Preset } from './conditions';

// Numeric fields interpolate with MathUtils.lerp; colour fields with Color.lerp.
export const NUM_KEYS = [
  'skyBlend', 'glowStrength', 'turbidity', 'rayleigh', 'mie', 'stars',
  'ambient', 'keyIntensity', 'cloudOpacity', 'cloudSpeed',
  'rainOpacity', 'rainSpeed', 'snowOpacity', 'snowSpeed', 'fogDensity', 'lightning',
] as const;
export type NumKey = (typeof NUM_KEYS)[number];

export const COLOR_KEYS = [
  'domeHorizon', 'domeZenith', 'domeGlow',
  'ambientColor', 'keyColor', 'cloudColor', 'rainColor', 'fogColor',
] as const;
export type ColKey = (typeof COLOR_KEYS)[number];

export interface Live {
  nums: Record<NumKey, number>;
  cols: Record<ColKey, THREE.Color>;
  /** Sun direction in scene space (y < 0 at night); shared by <Sky>, dome glow, key light. */
  sunDir: THREE.Vector3;
  /** Smoothed pointer/gyro offset in [-1, 1] for parallax. */
  parallax: THREE.Vector2;
  /** Lightning flash envelope (0..1), written by <Lightning>, read by the dome + key/point lights. */
  flash: number;
}

export function pickNums(p: Preset): Record<NumKey, number> {
  const out = {} as Record<NumKey, number>;
  for (const k of NUM_KEYS) out[k] = p[k] as number;
  return out;
}

export function makeColors(p: Preset): Record<ColKey, THREE.Color> {
  const out = {} as Record<ColKey, THREE.Color>;
  for (const k of COLOR_KEYS) out[k] = new THREE.Color(p[k] as string);
  return out;
}

export function makeLive(p: Preset): Live {
  return {
    nums: pickNums(p),
    cols: makeColors(p),
    sunDir: new THREE.Vector3(0.3, 0.6, -0.35).normalize(),
    parallax: new THREE.Vector2(0, 0),
    flash: 0,
  };
}

const SkyCtx = createContext<Live | null>(null);
export const SkyProvider = SkyCtx.Provider;

export function useSky(): Live {
  const v = useContext(SkyCtx);
  if (!v) throw new Error('useSky must be used inside <WeatherScene>');
  return v;
}

/**
 * Track the pointer (and device gyro on mobile) as a target offset in [-1, 1].
 * Returns a stable ref; `WeatherScene` eases `Live.parallax` toward it so the
 * camera/cloud shift is damped rather than jumpy.
 */
export function useParallax(): MutableRefObject<THREE.Vector2> {
  const target = useRef(new THREE.Vector2(0, 0));
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      // gamma = left/right tilt, beta = front/back tilt; ±45° maps to the full range
      const gx = THREE.MathUtils.clamp((e.gamma ?? 0) / 45, -1, 1);
      const gy = THREE.MathUtils.clamp((e.beta ?? 0) / 45, -1, 1);
      target.current.set(gx, gy);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('deviceorientation', onOrient, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('deviceorientation', onOrient);
    };
  }, []);
  return target;
}

/** Frame-rate-independent easing factor: reaches ~98% of the target after ~4·tau seconds. */
export const easeK = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);
