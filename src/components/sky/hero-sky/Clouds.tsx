/**
 * Clouds — the existing brand cloud cut-outs (/sky/cloud-1.png, cloud-2.png) as
 * billboarded planes layered across Z for parallax depth. Lit by MeshLambertMaterial
 * so the condition's key/ambient light actually tints them (warm at golden hour,
 * slate in drizzle, near-black at night) and so lightning can flash across them.
 * Opacity, colour and drift speed are read from the lerped Live state each frame.
 */
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSky } from './sky-state';

interface Layer {
  tex: 0 | 1; // which cloud texture
  x: number;
  y: number;
  z: number; // deeper = more parallax
  scale: number;
  speed: number; // per-layer drift multiplier
  opacity: number; // per-layer opacity multiplier
}

// hand-placed layers: a few near, a few deep, spread across the upper hero
const LAYERS: Layer[] = [
  { tex: 0, x: -9, y: 3.0, z: -10, scale: 13, speed: 0.5, opacity: 0.9 },
  { tex: 1, x: 6, y: 4.2, z: -14, scale: 9, speed: 0.35, opacity: 0.6 },
  { tex: 0, x: 2, y: 1.4, z: -6, scale: 16, speed: 0.8, opacity: 0.8 },
  { tex: 1, x: -5, y: 5.0, z: -18, scale: 7, speed: 0.28, opacity: 0.5 },
  { tex: 0, x: 10, y: 2.2, z: -8, scale: 11, speed: 0.65, opacity: 0.7 },
  { tex: 1, x: -12, y: 0.6, z: -5, scale: 10, speed: 0.95, opacity: 0.65 },
  { tex: 0, x: 0, y: 6.0, z: -22, scale: 6, speed: 0.22, opacity: 0.45 },
];

const WRAP = 20; // horizontal wrap-around half-width

export function Clouds() {
  const live = useSky();
  const groupRef = useRef<THREE.Group>(null!);
  const textures = useTexture(['/sky/cloud-1.png', '/sky/cloud-2.png']);

  useEffect(() => {
    for (const t of textures) t.colorSpace = THREE.SRGBColorSpace;
  }, [textures]);

  // cloud cut-outs are ~2:1 wide, so height = width / 2
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 0.5), []);

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
          scale={layer.scale}
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
