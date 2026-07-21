/**
 * Condition preset table — the single source of truth the lerp state machine
 * interpolates toward. Every value here is a *target*; nothing is applied
 * directly. Colours are hex strings (turned into THREE.Color in sky-state.ts);
 * everything else is a plain number so it can be `MathUtils.lerp`-ed per frame.
 *
 * Palette intent (per the design brief):
 *   sunny          warm gold key + bright blue sky, sparse wispy clouds
 *   cloudy         slate-gray, thick clouds, occasional lightning
 *   drizzle        #2d3744 slate, dense slow clouds, rain streaks, lightning
 *   overcast-night moon veiled behind a thick deck — broad diffused wash, no stars
 *   drizzle-night  the same veiled deck, but wet: dim rain over a darker sky
 *   clear-night    moonlit: bright disc, halo across the dome, stars, thin rafts
 */
export type Condition =
  | 'sunny'
  | 'cloudy'
  | 'drizzle'
  | 'snow'
  | 'overcast-night'
  | 'drizzle-night'
  | 'clear-night';

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
  // — moon — (all 0 by day; the disc, its halo on the dome, and its key light)
  moon: number; // moon disc opacity (0 = gone, 1 = clear, ~0.3 = veiled by cloud)
  moonGlow: number; // how far the moon's wash spreads across the sky dome
  moonLight: number; // directional moonlight intensity (silvers the cloud tops)
  moonColor: string;
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
  // — snow —
  snowOpacity: number;
  snowSpeed: number;
  // — fog —
  fogDensity: number;
  fogColor: string;
  // — lightning — (0 = off; higher = more frequent flashes)
  lightning: number;
}

export const CONDITIONS: Record<Condition, Preset> = {
  sunny: {
    // Dome-dominant so the vibrant azure isn't diluted grey by the pale <Sky>
    // horizon band. Palette sampled from the original hero photo (sky.avif):
    // a saturated azure up top easing to light azure low (the scrim whitens the
    // very bottom for legibility). A sliver of <Sky> (0.1) keeps the sun alive.
    skyBlend: 0.9,
    domeHorizon: '#65abf6', domeZenith: '#0347de', domeGlow: '#ffe4a6', glowStrength: 1.0,
    turbidity: 1.5, rayleigh: 2.7, mie: 0.005, stars: 0,
    moon: 0, moonGlow: 0, moonLight: 0, moonColor: '#dfe9ff',
    ambient: 1.7, ambientColor: '#ffffff', keyIntensity: 1.5, keyColor: '#ffe680',
    cloudOpacity: 1, cloudColor: '#ffffff', cloudSpeed: 0.5,
    rainOpacity: 0, rainSpeed: 0, rainColor: '#cfe0f5',
    snowOpacity: 0, snowSpeed: 0,
    fogDensity: 0.0016, fogColor: '#cfe4fb',
    lightning: 0,
  },
  cloudy: {
    skyBlend: 0.82,
    domeHorizon: '#92a6bc', domeZenith: '#425269', domeGlow: '#e8eef5', glowStrength: 0.5,
    turbidity: 8, rayleigh: 2, mie: 0.02, stars: 0,
    moon: 0, moonGlow: 0, moonLight: 0, moonColor: '#dfe9ff',
    ambient: 0.7, ambientColor: '#dfe6ee', keyIntensity: 0.7, keyColor: '#c3cfdd',
    cloudOpacity: 0.9, cloudColor: '#b9c4d2', cloudSpeed: 0.9,
    rainOpacity: 0, rainSpeed: 0, rainColor: '#aebccd',
    snowOpacity: 0, snowSpeed: 0,
    fogDensity: 0.006, fogColor: '#b7c3d1',
    lightning: 0.4,
  },
  // A daytime storm, not a night one. This used to author #475569 for the zenith and
  // land at rgb(16,23,36) on screen — darker than clear-night — so a rainy afternoon
  // read as midnight. Now the dome encodes properly (see SkyBackdrop's DOME_FRAG) and
  // these values are the slate they look like.
  drizzle: {
    skyBlend: 1,
    domeHorizon: '#485463', domeZenith: '#2d3744', domeGlow: '#a5adb6', glowStrength: 0.3,
    turbidity: 12, rayleigh: 1.4, mie: 0.03, stars: 0,
    moon: 0, moonGlow: 0, moonLight: 0, moonColor: '#dfe9ff',
    ambient: 0.62, ambientColor: '#9fadbe', keyIntensity: 0.5, keyColor: '#93a1b2',
    cloudOpacity: 1, cloudColor: '#7d8a9c', cloudSpeed: 1.4,
    rainOpacity: 0.48, rainSpeed: 4, rainColor: '#c3ccd8',
    snowOpacity: 0, snowSpeed: 0,
    fogDensity: 0.011, fogColor: '#6e7a8a',
    lightning: 0.9,
  },
  snow: {
    skyBlend: 0.86,
    domeHorizon: '#c6d4e5', domeZenith: '#6c7c93', domeGlow: '#eef2f7', glowStrength: 0.35,
    turbidity: 9, rayleigh: 1.4, mie: 0.02, stars: 0,
    moon: 0, moonGlow: 0, moonLight: 0, moonColor: '#dfe9ff',
    ambient: 0.88, ambientColor: '#eef3f8', keyIntensity: 0.8, keyColor: '#dde7f2',
    cloudOpacity: 0.85, cloudColor: '#cdd6e0', cloudSpeed: 0.7,
    rainOpacity: 0, rainSpeed: 0, rainColor: '#ffffff',
    snowOpacity: 0.9, snowSpeed: 1.1,
    fogDensity: 0.009, fogColor: '#d9e2ec',
    lightning: 0,
  },
  // Moon behind the cloud deck: no disc to speak of and no stars, but the whole
  // sky glows where it sits, and the rafts are lit from *behind* — so they read as
  // silver-edged shapes against a lifted navy instead of black-on-black.
  'overcast-night': {
    skyBlend: 1,
    domeHorizon: '#040a1e', domeZenith: '#010308', domeGlow: '#233150', glowStrength: 0.15,
    turbidity: 10, rayleigh: 0.6, mie: 0.02, stars: 0,
    moon: 0.3, moonGlow: 1.6, moonLight: 0.5, moonColor: '#c9d8f5',
    ambient: 0.6, ambientColor: '#3a4f74', keyIntensity: 0.2, keyColor: '#33466a',
    cloudOpacity: 1, cloudColor: '#44567f', cloudSpeed: 1,
    rainOpacity: 0, rainSpeed: 0, rainColor: '#3a465a',
    snowOpacity: 0, snowSpeed: 0,
    fogDensity: 0.011, fogColor: '#1a2742',
    lightning: 0,
  },
  // Rain at night. Previously this case fell through to overcast-night, which has
  // rainOpacity 0 — so a rainy night showed no rain at all. Same veiled moon as
  // overcast-night, but wetter and darker, and the streaks are dimmer than by day
  // (night rain only catches what little light there is).
  'drizzle-night': {
    skyBlend: 1,
    domeHorizon: '#030716', domeZenith: '#010205', domeGlow: '#1c2942', glowStrength: 0.12,
    turbidity: 12, rayleigh: 0.5, mie: 0.02, stars: 0,
    moon: 0.18, moonGlow: 1.2, moonLight: 0.4, moonColor: '#bccbe8',
    ambient: 0.5, ambientColor: '#33475f', keyIntensity: 0.15, keyColor: '#2b3c5a',
    cloudOpacity: 1, cloudColor: '#38486b', cloudSpeed: 1.3,
    rainOpacity: 0.4, rainSpeed: 4, rainColor: '#a8bcd6',
    snowOpacity: 0, snowSpeed: 0,
    fogDensity: 0.012, fogColor: '#131e33',
    lightning: 0.7,
  },
  // The headline night: a bright moon high in the right of the frame, its wash
  // lifting the sky around it, stars everywhere except where that wash drowns
  // them, and a few thin rafts drifting through the moonlight.
  'clear-night': {
    skyBlend: 0.97,
    domeHorizon: '#030922', domeZenith: '#000104', domeGlow: '#16233d', glowStrength: 0.1,
    turbidity: 4, rayleigh: 0.5, mie: 0.01, stars: 1.15,
    moon: 1, moonGlow: 1, moonLight: 0.8, moonColor: '#dbe6ff',
    ambient: 0.45, ambientColor: '#3b5480', keyIntensity: 0.1, keyColor: '#2a3a56',
    cloudOpacity: 0.72, cloudColor: '#6d84af', cloudSpeed: 0.45,
    rainOpacity: 0, rainSpeed: 0, rainColor: '#2a3546',
    snowOpacity: 0, snowSpeed: 0,
    fogDensity: 0.0035, fogColor: '#14224a',
    lightning: 0,
  },
};
