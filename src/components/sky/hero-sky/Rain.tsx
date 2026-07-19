/**
 * Rain — 3500 motion-blurred streaks rendered as ONE draw call via <instancedMesh>.
 *
 * Each streak is a camera-facing quad textured with a soft, comet-shaped alpha
 * gradient (bright leading head, feathered trailing tail) instead of a hard box —
 * so it reads as a translucent, motion-blurred raindrop rather than a solid stick.
 * Depth sells the volume: a drop's distance from the camera fixes its width, length
 * and brightness once (near = long/wide/bright, far = short/thin/faint), giving
 * natural atmospheric layering. Per-drop brightness lives in the instance colour
 * (set once, never per frame); only position moves each frame, and each instance
 * falls at its own speed, wrapping bottom→top forever (no drops created/destroyed).
 *
 * Opacity and fall speed come from the lerped Live state, so drizzle↔sunny is a
 * smooth fade of the same buffer. When effectively invisible (opacity ≈ 0) the
 * per-instance matrix work is skipped entirely — sunny costs nothing.
 */
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSky } from './sky-state';

const RAIN_MAX = 3500;
const SPREAD_X = 30; // droplets fill a box in front of the camera
const Z_FAR = -10; // deepest layer (faint, thin)
const Z_NEAR = 3; // nearest layer — kept in front of the camera (which sits at z≈6)
const TOP = 12;
const BOTTOM = -12;
const SPAN_Y = TOP - BOTTOM;
const WIND = 0.18; // horizontal drift as a fraction of fall speed — wind-blown rain
const TILT = Math.atan(WIND); // lean each streak to match its velocity direction

interface Drop {
  x: number;
  y: number;
  z: number;
  w: number; // world width  (depth-scaled: near = wider)
  h: number; // world length (depth-scaled: near = longer)
  spd: number; // per-drop fall-speed multiplier
  bri: number; // per-drop brightness (baked into the instance colour)
}

/**
 * A soft, comet-shaped streak in a tiny canvas, used as the alpha map. Bright near
 * the leading (bottom, uv.y→0) end, tapering to nothing up the trail; feathered on
 * the sides so the streak has no hard edges. Grayscale — only the green channel is
 * sampled by MeshBasicMaterial.alphaMap.
 */
function makeStreakTexture(): THREE.Texture {
  const W = 16;
  const H = 64;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);
  const smooth = (a: number, b: number, x: number) => {
    const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  for (let y = 0; y < H; y++) {
    // uv.y: 0 = leading head (bottom), 1 = tail (top)
    const ty = y / (H - 1);
    const head = smooth(0, 0.12, ty); // quick fade-in at the head
    const tail = smooth(1, 0.2, ty); // long fade-out up the tail
    const vy = head * tail;
    for (let x = 0; x < W; x++) {
      const tx = x / (W - 1);
      const hx = smooth(0.5, 0.12, Math.abs(tx - 0.5)); // soft sides
      const v = Math.round(vy * hx * 255);
      const i = (y * W + x) * 4;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export function Rain() {
  const live = useSky();
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const alphaMap = useMemo(makeStreakTexture, []);

  const drops = useMemo<Drop[]>(
    () =>
      Array.from({ length: RAIN_MAX }, () => {
        const z = THREE.MathUtils.randFloat(Z_FAR, Z_NEAR);
        const near = (z - Z_FAR) / (Z_NEAR - Z_FAR); // 0 = far … 1 = near
        return {
          x: THREE.MathUtils.randFloatSpread(SPREAD_X),
          y: THREE.MathUtils.randFloat(BOTTOM, TOP),
          z,
          w: THREE.MathUtils.lerp(0.014, 0.05, near),
          h: THREE.MathUtils.lerp(0.45, 1.3, near) * THREE.MathUtils.randFloat(0.8, 1.25),
          spd: THREE.MathUtils.randFloat(0.75, 1.25),
          bri: THREE.MathUtils.lerp(0.4, 1, near) * THREE.MathUtils.randFloat(0.7, 1),
        };
      }),
    [],
  );

  // seed the instance matrices + per-drop brightness once (brightness never changes)
  useEffect(() => {
    const mesh = meshRef.current;
    const col = new THREE.Color();
    for (let i = 0; i < RAIN_MAX; i++) {
      const d = drops[i];
      dummy.position.set(d.x, d.y, d.z);
      dummy.rotation.z = TILT;
      dummy.scale.set(d.w, d.h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, col.setScalar(d.bri));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
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
      if (d.y < BOTTOM) d.y += SPAN_Y; // wrap to the top
      if (d.x < -SPREAD_X / 2) d.x += SPREAD_X; // wrap horizontally as the wind carries it
      dummy.position.set(d.x + drift, d.y, d.z);
      dummy.scale.set(d.w, d.h, 1);
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
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={matRef}
        color="#cfe0f5"
        alphaMap={alphaMap}
        transparent
        opacity={0}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
