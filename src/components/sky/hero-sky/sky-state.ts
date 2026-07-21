/**
 * Shared lerp state for the hero weather scene.
 *
 * `Live` is a single mutable object the whole scene reads. `WeatherScene` owns one
 * `useFrame` that eases every field toward the active preset; each visual component
 * (backdrop, clouds, rain, lights, fog) reads `Live` in its *own* `useFrame` and
 * copies the interpolated values onto its three.js objects. Nothing here triggers a
 * React re-render per frame — the interpolation happens entirely in mutable refs.
 */
import { createContext, useContext } from 'react';
import * as THREE from 'three';
import type { Preset } from './conditions';

// Numeric fields interpolate with MathUtils.lerp; colour fields with Color.lerp.
export const NUM_KEYS = [
  'skyBlend', 'glowStrength', 'turbidity', 'rayleigh', 'mie', 'stars',
  'moon', 'moonGlow', 'moonLight',
  'ambient', 'keyIntensity', 'cloudOpacity', 'cloudSpeed',
  'rainOpacity', 'rainSpeed', 'snowOpacity', 'snowSpeed', 'fogDensity', 'lightning',
] as const;
export type NumKey = (typeof NUM_KEYS)[number];

export const COLOR_KEYS = [
  'domeHorizon', 'domeZenith', 'domeGlow', 'moonColor',
  'ambientColor', 'keyColor', 'cloudColor', 'rainColor', 'fogColor',
] as const;
export type ColKey = (typeof COLOR_KEYS)[number];

export interface Live {
  nums: Record<NumKey, number>;
  cols: Record<ColKey, THREE.Color>;
  /** Sun direction in scene space (y < 0 at night); shared by <Sky>, dome glow, key light. */
  sunDir: THREE.Vector3;
  /** Moon direction in scene space; shared by the moon disc, the dome halo and the moonlight. */
  moonDir: THREE.Vector3;
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
    moonDir: new THREE.Vector3(0.4, 0.31, -0.86).normalize(),
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

/** Frame-rate-independent easing factor: reaches ~98% of the target after ~4·tau seconds. */
export const easeK = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);
