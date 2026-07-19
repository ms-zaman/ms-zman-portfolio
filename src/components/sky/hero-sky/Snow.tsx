/**
 * Snow — GPU-animated drifting flakes as a single <points> draw call. Each flake
 * falls and sways entirely in the vertex shader (driven by one uTime uniform), so
 * there's no per-frame CPU work regardless of count. Overall opacity comes from the
 * lerped `snowOpacity`, so snow fades in/out smoothly with the condition; the whole
 * system is hidden (and skipped) when there's no snow.
 */
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSky } from './sky-state';

const SNOW_COUNT = 1800;
const RANGE_Y = 26; // vertical wrap height (taller than the viewport so recycling is off-screen)
const SPREAD_X = 34;
const SPREAD_Z_NEAR = -5;
const SPREAD_Z_FAR = 9;

const VERT = /* glsl */ `
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aSize;
  attribute float aSway;
  uniform float uTime;
  uniform float uFall;
  uniform float uRange;
  varying float vFade;
  void main() {
    vec3 p = position;
    // fall + wrap: cycle through [0, uRange), then recentre around the origin
    float y = mod(p.y - uTime * uFall * aSpeed, uRange);
    p.y = y - uRange * 0.5;
    // gentle horizontal sway, each flake on its own phase
    p.x += sin(uTime * 0.7 + aPhase) * aSway;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (14.0 / -mv.z);
    // fade near the top & bottom of the column so the wrap-around is invisible
    float t = y / uRange;
    vFade = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.9, t);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying float vFade;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.15, d); // soft round flake
    gl_FragColor = vec4(vec3(1.0), a * uOpacity * vFade);
  }
`;

export function Snow() {
  const live = useSky();
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const geometry = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    const speed = new Float32Array(SNOW_COUNT);
    const phase = new Float32Array(SNOW_COUNT);
    const size = new Float32Array(SNOW_COUNT);
    const sway = new Float32Array(SNOW_COUNT);
    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3] = THREE.MathUtils.randFloatSpread(SPREAD_X);
      pos[i * 3 + 1] = Math.random() * RANGE_Y; // 0..RANGE_Y — the shader wraps it
      pos[i * 3 + 2] = THREE.MathUtils.randFloat(SPREAD_Z_NEAR, SPREAD_Z_FAR);
      speed[i] = THREE.MathUtils.randFloat(0.6, 1.4);
      phase[i] = Math.random() * Math.PI * 2;
      size[i] = THREE.MathUtils.randFloat(2, 5);
      sway[i] = THREE.MathUtils.randFloat(0.3, 1.1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aSway', new THREE.BufferAttribute(sway, 1));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uFall: { value: 1 }, uRange: { value: RANGE_Y }, uOpacity: { value: 0 } }),
    [],
  );

  useFrame((_, dt) => {
    const op = live.nums.snowOpacity;
    matRef.current.uniforms.uOpacity.value = op;
    // no snow → hide and skip advancing time (sunny/rain cost nothing)
    if (op < 0.01) {
      pointsRef.current.visible = false;
      return;
    }
    pointsRef.current.visible = true;
    matRef.current.uniforms.uFall.value = live.nums.snowSpeed;
    matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false} renderOrder={5}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        depthTest={false}
        fog={false}
      />
    </points>
  );
}
