/**
 * Clouds — the brand cloud cut-outs (/sky/cloud-1.png, cloud-2.png) as billboarded
 * planes, scattered across the sky at varied heights & depths so each reads as a
 * distinct fluffy raft (মেঘের ভেলা) rather than a merged haze band. Each plane is
 * sized to its texture's NATIVE aspect (no vertical squash), soft-edged (no alphaTest
 * hard-cut), and lit by MeshLambertMaterial so the condition's key/ambient light
 * tints them (bright white midday, slate in drizzle, near-black at night) and
 * lightning can flash across them. Opacity/colour/drift come from the lerped Live state.
 */
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSky } from './sky-state';

// native pixel aspect (width / height) of each cloud PNG — planes match this so the
// cloud keeps its real shape instead of being stretched to a fixed 2:1 quad
const ASPECT = [2048 / 729, 1024 / 393] as const;

interface Layer {
  tex: 0 | 1; // which cloud texture
  x: number;
  y: number;
  z: number; // deeper = smaller on screen + more parallax
  w: number; // world width (height derives from the texture aspect)
  speed: number; // per-layer drift multiplier
  opacity: number; // per-layer opacity multiplier
}

// Hand-scattered rafts: varied x, y (height) and z (depth) so they never line up
// into a band. A few big & nearer, a few small & deep. The 3D clouds sit under the
// scrim + text, so placement is free of legibility concerns.
const LAYERS: Layer[] = [
  { tex: 0, x: -13, y: 5.2, z: -14, w: 12, speed: 0.42, opacity: 0.98 },
  { tex: 1, x: -6, y: 2.6, z: -11, w: 9, speed: 0.52, opacity: 0.92 },
  { tex: 0, x: 2, y: 7.4, z: -19, w: 12, speed: 0.3, opacity: 0.85 },
  { tex: 1, x: 7, y: 4.0, z: -12, w: 8, speed: 0.5, opacity: 0.94 },
  { tex: 0, x: 14, y: 6.2, z: -16, w: 12, speed: 0.4, opacity: 0.9 },
  { tex: 1, x: -12, y: 8.0, z: -20, w: 8, speed: 0.28, opacity: 0.8 },
  { tex: 0, x: 12, y: 2.8, z: -12, w: 11, speed: 0.5, opacity: 0.94 },
  { tex: 1, x: -2, y: 5.0, z: -15, w: 8, speed: 0.4, opacity: 0.88 },
];

const WRAP = 22; // horizontal wrap-around half-width

export function Clouds() {
  const live = useSky();
  const groupRef = useRef<THREE.Group>(null!);
  const textures = useTexture(['/sky/cloud-1.png', '/sky/cloud-2.png']);

  useEffect(() => {
    for (const t of textures) t.colorSpace = THREE.SRGBColorSpace;
  }, [textures]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  useFrame((_, dt) => {
    const g = groupRef.current;
    const meshes = g.children as THREE.Mesh[];
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      const layer = LAYERS[i];
      // drift right, wrap around
      mesh.position.x += live.nums.cloudSpeed * layer.speed * dt;
      if (mesh.position.x > WRAP) mesh.position.x -= WRAP * 2;
      const mat = mesh.material as THREE.MeshLambertMaterial;
      mat.opacity = live.nums.cloudOpacity * layer.opacity;
      mat.color.copy(live.cols.cloudColor);
    }
    // parallax: deeper Z already gives depth; a small group tilt adds perspective
    g.rotation.y = live.parallax.x * 0.05;
    g.rotation.x = -live.parallax.y * 0.03;
  });

  return (
    <group ref={groupRef}>
      {LAYERS.map((layer, i) => (
        <mesh
          key={i}
          geometry={geometry}
          position={[layer.x, layer.y, layer.z]}
          scale={[layer.w, layer.w / ASPECT[layer.tex], 1]}
        >
          <meshLambertMaterial
            map={textures[layer.tex]}
            color="#ffffff"
            transparent
            opacity={layer.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
