/**
 * Condition preset table — the single source of truth the lerp state machine
 * interpolates toward. Every value here is a *target*; nothing is applied
 * directly. Colours are hex strings (turned into THREE.Color in sky-state.ts);
 * everything else is a plain number so it can be `MathUtils.lerp`-ed per frame.
 *
 * Palette intent (per the design brief):
 *   sunny          warm gold key + bright blue sky, sparse wispy clouds
 *   cloudy         slate-gray, thick clouds, occasional lightning
 *   drizzle        #475569 slate, dense slow clouds, 3000+ rain streaks, lightning
 *   overcast-night deep navy #0a192f, thick dark clouds, exponential fog
 *   clear-night    same navy but sparse clouds + stars
 */
export type Condition = 'sunny' | 'cloudy' | 'drizzle' | 'overcast-night' | 'clear-night';

export interface Preset {
  // — backdrop (drei <Sky> + gradient SkyDome) —
  skyBlend: number; // 0 = physical <Sky> shows through … 1 = dome fully covers it
  domeHorizon: string;
  domeZenith: string;
  domeGlow: string;
  glowStrength: number;
  turbidity: number; // <Sky> haze
  rayleigh: number; // <Sky> blue scattering
  mie: number; // <Sky> sun disc scattering
  stars: number; // starfield opacity (0..1)
  // — lighting —
  ambient: number;
  ambientColor: string;
  keyIntensity: number;
  keyColor: string;
  // — clouds —
  cloudOpacity: number;
  cloudColor: string;
  cloudSpeed: number;
  // — rain —
  rainOpacity: number;
  rainSpeed: number;
  rainColor: string;
  // — fog —
  fogDensity: number;
  fogColor: string;
  // — lightning — (0 = off; higher = more frequent flashes)
  lightning: number;
}

export const CONDITIONS: Record<Condition, Preset> = {
  sunny: {
    skyBlend: 0.52,
    domeHorizon: '#d6ebfe', domeZenith: '#2b74c8', domeGlow: '#ffe4a6', glowStrength: 1.0,
    turbidity: 1.5, rayleigh: 2.7, mie: 0.005, stars: 0,
    ambient: 0.9, ambientColor: '#eaf4ff', keyIntensity: 1.5, keyColor: '#ffe680',
    cloudOpacity: 0.16, cloudColor: '#ffffff', cloudSpeed: 0.55,
    rainOpacity: 0, rainSpeed: 0, rainColor: '#cfe0f5',
    fogDensity: 0.0016, fogColor: '#cfe4fb',
    lightning: 0,
  },
  cloudy: {
    skyBlend: 0.82,
    domeHorizon: '#c7d3df', domeZenith: '#8b9aac', domeGlow: '#e8eef5', glowStrength: 0.5,
    turbidity: 8, rayleigh: 2, mie: 0.02, stars: 0,
    ambient: 0.7, ambientColor: '#dfe6ee', keyIntensity: 0.7, keyColor: '#c3cfdd',
    cloudOpacity: 0.9, cloudColor: '#b9c4d2', cloudSpeed: 0.9,
    rainOpacity: 0, rainSpeed: 0, rainColor: '#aebccd',
    fogDensity: 0.006, fogColor: '#b7c3d1',
    lightning: 0.4,
  },
  drizzle: {
    skyBlend: 1,
    domeHorizon: '#64748b', domeZenith: '#475569', domeGlow: '#8a97a8', glowStrength: 0.25,
    turbidity: 12, rayleigh: 1.4, mie: 0.03, stars: 0,
    ambient: 0.5, ambientColor: '#8f9cad', keyIntensity: 0.45, keyColor: '#8a97a8',
    cloudOpacity: 1, cloudColor: '#6b7789', cloudSpeed: 1.4,
    rainOpacity: 0.5, rainSpeed: 9, rainColor: '#c3ccd8',
    fogDensity: 0.011, fogColor: '#5b6675',
    lightning: 0.9,
  },
  'overcast-night': {
    skyBlend: 1,
    domeHorizon: '#101b2e', domeZenith: '#0a192f', domeGlow: '#1b2740', glowStrength: 0.12,
    turbidity: 10, rayleigh: 0.6, mie: 0.02, stars: 0,
    ambient: 0.28, ambientColor: '#26344c', keyIntensity: 0.18, keyColor: '#2a3a56',
    cloudOpacity: 1, cloudColor: '#1c2740', cloudSpeed: 1,
    rainOpacity: 0, rainSpeed: 0, rainColor: '#3a465a',
    fogDensity: 0.014, fogColor: '#0a1120',
    lightning: 0,
  },
  'clear-night': {
    skyBlend: 0.92,
    domeHorizon: '#0e1b33', domeZenith: '#060f22', domeGlow: '#16233d', glowStrength: 0.1,
    turbidity: 4, rayleigh: 0.5, mie: 0.01, stars: 1,
    ambient: 0.24, ambientColor: '#223049', keyIntensity: 0.14, keyColor: '#2a3a56',
    cloudOpacity: 0.22, cloudColor: '#141f36', cloudSpeed: 0.5,
    rainOpacity: 0, rainSpeed: 0, rainColor: '#2a3546',
    fogDensity: 0.004, fogColor: '#060d1c',
    lightning: 0,
  },
};
