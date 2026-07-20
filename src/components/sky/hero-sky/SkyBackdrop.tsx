/**
 * Hybrid sky backdrop — two concentric layers, cross-faded, never unmounted:
 *
 *   <Sky>       drei/Preetham atmospheric scattering (physically-correct golden
 *               hour). sunPosition/turbidity/rayleigh/mie are pushed as lerped
 *               uniforms each frame — no React re-renders. Dominant when skyBlend→0.
 *   <SkyDome>   a BackSide sphere with a custom gradient shader that reproduces the
 *               brand --sky-* palette (+ navy at night) and a sun-glow term. Its
 *               uOpacity = skyBlend, so it fades *over* <Sky> for overcast/drizzle/night.
 *   <Starfield> a points shell with a uOpacity uniform, faded in for clear-night.
 *
 * Draw order (all depthWrite:false): Sky (opaque pass) → dome (-2) → stars (-1) →
 * everything else. The dome/stars never occlude the scene depth.
 */
import { useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSky } from './sky-state';

// — gradient dome —
const DOME_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);            // direction from the dome centre
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DOME_FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vDir;
  uniform vec3 uHorizon;
  uniform vec3 uZenith;
  uniform vec3 uGlow;
  uniform vec3 uSunDir;
  uniform float uGlowStrength;
  uniform float uOpacity;
  uniform float uFlash;
  void main() {
    // vertical gradient: horizon low → zenith high (matches the 5-stop CSS sky)
    float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(uHorizon, uZenith, smoothstep(0.12, 0.92, h));
    // additive sun glow around the shared sun direction
    float d = max(dot(normalize(vDir), normalize(uSunDir)), 0.0);
    col += uGlow * (pow(d, 8.0) * uGlowStrength);
    // lightning: flare the whole sky, brightest overhead where the bolt sits
    col += vec3(0.82, 0.88, 1.0) * (uFlash * (0.55 + 0.6 * h));
    // when the dome is see-through (skyBlend→0) the flash still needs to register
    float alpha = clamp(uOpacity + uFlash * 0.9, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

function SkyDome() {
  const live = useSky();
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(
    () => ({
      uHorizon: { value: new THREE.Color('#dcecfb') },
      uZenith: { value: new THREE.Color('#3f86cf') },
      uGlow: { value: new THREE.Color('#fff4d6') },
      uSunDir: { value: new THREE.Vector3(0.3, 0.6, -0.35) },
      uGlowStrength: { value: 1 },
      uOpacity: { value: 0 },
      uFlash: { value: 0 },
    }),
    [],
  );

  useFrame(() => {
    const u = matRef.current.uniforms;
    u.uHorizon.value.copy(live.cols.domeHorizon);
    u.uZenith.value.copy(live.cols.domeZenith);
    u.uGlow.value.copy(live.cols.domeGlow);
    u.uSunDir.value.copy(live.sunDir);
    u.uGlowStrength.value = live.nums.glowStrength;
    u.uOpacity.value = live.nums.skyBlend;
    u.uFlash.value = live.flash;
  });

  return (
    <mesh scale={500} renderOrder={-2} frustumCulled={false}>
      <sphereGeometry args={[1, 32, 16]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={DOME_VERT}
        fragmentShader={DOME_FRAG}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        depthTest={false}
        fog={false}
      />
    </mesh>
  );
}

// — starfield (custom, so we can fade opacity, which drei <Stars> doesn't expose) —
const STAR_COUNT = 900;

const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aTwinkle;
  varying float vTwinkle;
  uniform float uTime;
  void main() {
    vTwinkle = 0.6 + 0.4 * sin(uTime * 1.5 + aTwinkle * 6.2831);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAG = /* glsl */ `
  precision highp float;
  varying float vTwinkle;
  uniform float uOpacity;
  void main() {
    // soft round point
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(1.0), a * uOpacity * vTwinkle);
  }
`;

function Starfield() {
  const live = useSky();
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const geometry = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const size = new Float32Array(STAR_COUNT);
    const twinkle = new Float32Array(STAR_COUNT);
    const R = 120;
    for (let i = 0; i < STAR_COUNT; i++) {
      // upper hemisphere shell (stars overhead, not below the horizon)
      const u = Math.random();
      const v = Math.random() * 0.85 + 0.05;
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(v); // bias toward the top
      pos[i * 3] = R * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = R * Math.cos(phi);
      pos[i * 3 + 2] = R * Math.sin(phi) * Math.sin(theta);
      size[i] = THREE.MathUtils.randFloat(1.1, 3.2);
      twinkle[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkle, 1));
    return g;
  }, []);

  const uniforms = useMemo(() => ({ uOpacity: { value: 0 }, uTime: { value: 0 } }), []);

  useFrame((_, dt) => {
    matRef.current.uniforms.uOpacity.value = live.nums.stars;
    matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <points geometry={geometry} renderOrder={-1} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={STAR_VERT}
        fragmentShader={STAR_FRAG}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </points>
  );
}

export function SkyBackdrop() {
  const live = useSky();
  // drei <Sky> forwards its ref to the Sky mesh; we mutate its material uniforms directly.
  const skyRef = useRef<THREE.Mesh & { material: THREE.ShaderMaterial }>(null);

  useFrame(() => {
    const sky = skyRef.current;
    if (!sky?.material) return;
    const u = sky.material.uniforms;
    u.turbidity.value = live.nums.turbidity;
    u.rayleigh.value = live.nums.rayleigh;
    u.mieCoefficient.value = live.nums.mie;
    (u.sunPosition.value as THREE.Vector3).copy(live.sunDir);
  });

  return (
    <>
      <Sky ref={skyRef as never} distance={450000} />
      <SkyDome />
      <Starfield />
    </>
  );
}
