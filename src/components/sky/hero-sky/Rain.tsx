/**
 * Rain — 3500 vertical streaks rendered as ONE draw call via <instancedMesh>.
 * Each instance falls at its own speed and wraps from the bottom back to the top
 * (an infinite loop), so no droplets are ever created or destroyed. Overall
 * opacity and fall speed come from the lerped Live state, so drizzle↔sunny is a
 * smooth fade of the same buffer rather than a pop. When effectively invisible
 * (opacity ≈ 0) the per-instance matrix work is skipped entirely — sunny costs
 * nothing.
 */
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSky } from './sky-state';

const RAIN_MAX = 3500;
const SPREAD_X = 30; // droplets fill a box in front of the camera
const SPREAD_Z_NEAR = -4;
const SPREAD_Z_FAR = 9;
const TOP = 12;
const BOTTOM = -12;
const WIND = 0.18; // horizontal drift as a fraction of fall speed — wind-blown rain
const TILT = Math.atan(WIND); // lean each streak to match its velocity direction

interface Drop {
  x: number;
  y: number;
  z: number;
  len: number; // streak length multiplier
  spd: number; // per-drop speed multiplier
}

export function Rain() {
  const live = useSky();
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo<Drop[]>(
    () =>
      Array.from({ length: RAIN_MAX }, () => ({
        x: THREE.MathUtils.randFloatSpread(SPREAD_X),
        y: THREE.MathUtils.randFloat(BOTTOM, TOP),
        z: THREE.MathUtils.randFloat(SPREAD_Z_NEAR, SPREAD_Z_FAR),
        len: THREE.MathUtils.randFloat(0.5, 1.4),
        spd: THREE.MathUtils.randFloat(0.7, 1.3),
      })),
    [],
  );

  // seed the instance matrices once
  useEffect(() => {
    for (let i = 0; i < RAIN_MAX; i++) {
      const d = drops[i];
      dummy.position.set(d.x, d.y, d.z);
      dummy.scale.set(1, d.len, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [drops, dummy]);

  useFrame((_, dt) => {
    const opacity = live.nums.rainOpacity;
    matRef.current.opacity = opacity;
    matRef.current.color.copy(live.cols.rainColor);

    // cheap out when there's no visible rain — skip 3500 matrix writes
    if (opacity < 0.01) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    const fall = live.nums.rainSpeed * Math.min(dt, 0.05); // clamp dt to avoid teleporting
    const wind = fall * WIND; // horizontal component of the fall
    const drift = live.parallax.x * 0.6; // droplets shift slightly with parallax
    dummy.rotation.z = TILT; // streaks lean along their velocity (trailing end upwind)
    for (let i = 0; i < RAIN_MAX; i++) {
      const d = drops[i];
      d.y -= fall * d.spd;
      d.x -= wind * d.spd;
      if (d.y < BOTTOM) d.y += TOP - BOTTOM; // wrap to the top
      if (d.x < -SPREAD_X / 2) d.x += SPREAD_X; // wrap horizontally as the wind carries it
      dummy.position.set(d.x + drift, d.y, d.z);
      dummy.scale.set(1, d.len, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, RAIN_MAX]}
      frustumCulled={false}
      renderOrder={5}
    >
      <boxGeometry args={[0.015, 0.55, 0.015]} />
      <meshBasicMaterial
        ref={matRef}
        color="#cfe0f5"
        transparent
        opacity={0}
        depthWrite={false}
        fog={false}
      />
    </instancedMesh>
  );
}
