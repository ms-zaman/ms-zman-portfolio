/**
 * Moon — a camera-facing quad parked far down `Live.moonDir`, drawn additively so
 * it *lights* the navy dome behind it instead of pasting a white sticker on it.
 *
 * One draw call does three jobs in the fragment shader:
 *   • the disc      — soft-limbed, with limb darkening so it reads spherical
 *   • the maria     — three faint dark patches, so it isn't a flat circle
 *   • the halo      — a wide power falloff; this is the part that actually sells
 *                     "moonlit", and it doubles as the glow bloom on overcast nights
 *
 * `moon` fades the whole thing (1 = clear night, ~0.3 = veiled behind the deck);
 * the clouds draw *after* it (renderOrder), so rafts pass in front of the moon.
 */
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSky } from './sky-state';

const DIST = 90; // far enough to sit behind every cloud raft (z ≥ -20)
const SIZE = 34; // quad size; the disc is a small fraction of it, the halo fills it

const MOON_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const MOON_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uGlow;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;   // -1 … 1 across the quad
    float r = length(p);

    // — disc: soft edge so it doesn't alias against the sky —
    float disc = smoothstep(0.200, 0.180, r);
    // limb darkening — the rim falls off, which is what makes a circle read as a sphere
    float limb = 0.78 + 0.22 * sqrt(max(0.0, 1.0 - pow(r / 0.200, 2.0)));
    // maria: two overlapping blobs form one irregular sea, plus a small one below.
    // Three separate equal circles read as a cartoon face — the overlap is the fix.
    float m = 0.0;
    m += smoothstep(0.090, 0.0, length(p - vec2(-0.052, 0.044)));
    m += smoothstep(0.068, 0.0, length(p - vec2(-0.016, 0.074)));
    m += smoothstep(0.048, 0.0, length(p - vec2( 0.054, -0.034)));
    float face = limb * (1.0 - 0.13 * clamp(m, 0.0, 1.0));

    // — halo: tight inner bloom + wide outer wash —
    float inner = pow(clamp(1.0 - r / 0.42, 0.0, 1.0), 2.2) * 0.55;
    float outer = pow(clamp(1.0 - r, 0.0, 1.0), 3.2) * 0.30;
    // keep the halo *outside* the disc — stacked on top it blows the face to a flat
    // white blob under additive blending, and the maria disappear
    float halo = (inner + outer) * uGlow * (1.0 - disc);

    // 0.86 leaves headroom under the additive clip, so the seas stay readable
    vec3 col = uColor * (disc * face * 0.86 + halo);
    gl_FragColor = vec4(col * uOpacity, 1.0);
  }
`;

export function Moon() {
  const live = useSky();
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#dbe6ff') },
      uOpacity: { value: 0 },
      uGlow: { value: 1 },
    }),
    [],
  );

  useFrame(() => {
    const mesh = meshRef.current;
    mesh.position.copy(live.moonDir).multiplyScalar(DIST);
    // billboard: the quad always faces the camera, so the disc never skews
    mesh.quaternion.copy(camera.quaternion);
    // shrink on portrait, where the moon has to fit a narrow gap in the copy
    const aspect = (camera as THREE.PerspectiveCamera).aspect;
    mesh.scale.setScalar(SIZE * (aspect < 1 ? 0.7 : 1));

    const u = matRef.current.uniforms;
    u.uColor.value.copy(live.cols.moonColor);
    u.uOpacity.value = live.nums.moon;
    u.uGlow.value = live.nums.moonGlow;
    // skip the draw entirely by day rather than blending a fully transparent quad
    mesh.visible = live.nums.moon > 0.002;
  });

  return (
    <mesh ref={meshRef} renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={MOON_VERT}
        fragmentShader={MOON_FRAG}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </mesh>
  );
}
