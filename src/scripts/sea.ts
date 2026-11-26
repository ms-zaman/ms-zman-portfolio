/**
 * The sea — the hero's live layer.
 *
 * WebGPU: N plankton particles advected by a curl noise current. The pointer
 * (or, with no pointer, an autonomous ship) excites them by its speed; their
 * light decays over seconds, so every wake is a fading memory. A sinuous
 * current band holds a standing glow so the sea is never empty.
 *
 * It is an enhancement over a static poster that is already painted in the
 * HTML. The canvas only mounts after `load` plus an idle callback, and only on
 * a real GPU: no WebGPU, a fallback (software) adapter, reduced motion, Save
 * Data or a small device all keep the poster. That last rule is what keeps the
 * PageSpeed score: its headless Chrome has no GPU, and a software adapter would
 * run every frame on the CPU (see memory note "PSI has no GPU").
 */

const WGSL_COMMON = /* wgsl */ `
  struct U { time:f32, dt:f32, aspect:f32, count:f32, ptr:vec2f, pvel:vec2f, act:f32, scale:f32, _a:f32, _b:f32 };
  struct P { pos:vec2f, vel:vec2f, energy:f32, seed:f32, _a:f32, _b:f32 };
  @group(0) @binding(0) var<uniform> u:U;
  @group(0) @binding(1) var<storage, ACCESS> ps: array<P>;
  // the standing current; on a portrait screen it runs high, above the words
  fn band(x:f32, t:f32) -> f32 {
    let b = 0.18 + 0.32*sin(1.35*x + 0.6 + t*0.07) + 0.12*sin(3.1*x + 1.7 - t*0.05);
    let portrait = 1.0 - smoothstep(0.8, 1.1, u.aspect);
    return mix(b, 0.56 + 0.30*(b - 0.18), portrait);
  }
`;

const WGSL_COMPUTE = /* wgsl */ `
  fn h2(p:vec2f) -> f32 { return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453); }
  fn vnoise(p:vec2f) -> f32 {
    let i = floor(p); let f = fract(p); let w = f*f*(3.0-2.0*f);
    return mix(mix(h2(i), h2(i+vec2f(1,0)), w.x), mix(h2(i+vec2f(0,1)), h2(i+vec2f(1,1)), w.x), w.y);
  }
  fn psi(p:vec2f, t:f32) -> f32 { return vnoise(p*1.4 + vec2f(0.0, t*0.04)) + 0.5*vnoise(p*2.9 - vec2f(t*0.03, 0.0)); }
  @compute @workgroup_size(256) fn main(@builtin(global_invocation_id) id:vec3u) {
    let i = id.x; if (f32(i) >= u.count) { return; }
    var p = ps[i];
    let wp = vec2f(p.pos.x * u.aspect, p.pos.y);
    let e = 0.01;
    let curl = vec2f(psi(wp + vec2f(0,e), u.time) - psi(wp - vec2f(0,e), u.time), -(psi(wp + vec2f(e,0), u.time) - psi(wp - vec2f(e,0), u.time))) / (2.0*e);
    let flow = curl * 0.055 + vec2f(0.035, 0.0);
    let d = wp - u.ptr; let r2 = dot(d, d);
    let infl = exp(-r2 / 0.012) * u.act;
    let speed = length(u.pvel);
    p.energy = min(p.energy * exp(-u.dt * 0.9) + infl * clamp(speed * 3.0, 0.0, 3.0) * u.dt * 14.0, 2.2);
    p.vel = mix(p.vel, flow, 1.0 - exp(-u.dt * 1.6)) + vec2f(u.pvel.x / u.aspect, u.pvel.y) * infl * 0.06;
    p.pos += p.vel * u.dt;
    if (p.pos.x > 1.0) { p.pos.x -= 2.0; p.energy = 0.0; }
    if (p.pos.x < -1.0) { p.pos.x += 2.0; }
    if (p.pos.y > 1.0) { p.pos.y -= 2.0; }
    if (p.pos.y < -1.0) { p.pos.y += 2.0; }
    ps[i] = p;
  }
`;

const WGSL_RENDER = /* wgsl */ `
  struct VO { @builtin(position) pos:vec4f, @location(0) uv:vec2f, @location(1) col:vec4f };
  @vertex fn vs(@builtin(vertex_index) vi:u32, @builtin(instance_index) ii:u32) -> VO {
    let p = ps[ii];
    var q = array<vec2f,6>(vec2f(-1,-1), vec2f(1,-1), vec2f(-1,1), vec2f(-1,1), vec2f(1,-1), vec2f(1,1));
    let wx = p.pos.x * u.aspect;
    let d = abs(p.pos.y - band(wx, u.time));
    let stand = exp(-d*d / 0.010) * smoothstep(-0.55*u.aspect, 0.15*u.aspect, wx);
    let e = clamp(p.energy, 0.0, 2.2);
    let glow = 0.06 + stand * 0.55 + e * 0.75;
    let size = (1.1 + stand * 1.2 + e * 2.4 + p.seed * 0.6) * u.scale;
    var o:VO;
    o.pos = vec4f(p.pos + q[vi] * vec2f(size / u.aspect, size), 0.0, 1.0);
    o.uv = q[vi];
    var c = mix(vec3f(0.10, 0.17, 0.25), vec3f(0.12, 0.55, 1.0), smoothstep(0.0, 0.45, stand + e));
    c = mix(c, vec3f(0.40, 0.96, 1.0), smoothstep(0.6, 1.6, e + stand * 0.6));
    o.col = vec4f(c * glow, 1.0);
    return o;
  }
  @fragment fn fs(i:VO) -> @location(0) vec4f {
    let r = dot(i.uv, i.uv); if (r > 1.0) { discard; }
    let a = exp(-r * 3.2);
    return vec4f(i.col.rgb * a, a);
  }
`;

/** Same standing current as the shader, for the autonomous ship's course. */
function band(x: number, t: number, aspect: number) {
  const b = 0.18 + 0.32 * Math.sin(1.35 * x + 0.6 + t * 0.07) + 0.12 * Math.sin(3.1 * x + 1.7 - t * 0.05);
  const k = Math.min(1, Math.max(0, (aspect - 0.8) / 0.3));
  const portrait = 1 - k * k * (3 - 2 * k);
  return b + ((0.56 + 0.30 * (b - 0.18)) - b) * portrait;
}

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

async function getDevice(): Promise<GPUDevice | null> {
  const nav = navigator as Nav;
  if (!('gpu' in navigator) || !navigator.gpu) return null;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (nav.connection?.saveData) return null;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return null;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return null;
  try {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return null;
    // a fallback adapter is a software rasteriser: every frame would land on the CPU
    const info = (adapter as GPUAdapter & { info?: { isFallbackAdapter?: boolean } }).info;
    if (info?.isFallbackAdapter || (adapter as GPUAdapter & { isFallbackAdapter?: boolean }).isFallbackAdapter) return null;
    return await adapter.requestDevice();
  } catch {
    return null;
  }
}

async function run(canvas: HTMLCanvasElement, hint: HTMLElement | null) {
  const maybe = await getDevice();
  if (!maybe) return;
  const device: GPUDevice = maybe;
  const ctx = canvas.getContext('webgpu');
  if (!ctx) return;
  const format = navigator.gpu.getPreferredCanvasFormat();
  ctx.configure({ device, format, alphaMode: 'opaque' });

  const mobile = matchMedia('(max-width: 760px)').matches;
  const N = mobile ? 24000 : 70000;
  const init = new Float32Array(N * 8);
  for (let i = 0; i < N; i++) {
    init[i * 8] = Math.random() * 2 - 1;
    init[i * 8 + 1] = Math.random() * 2 - 1;
    init[i * 8 + 5] = Math.random();
  }
  const pbuf = device.createBuffer({ size: init.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
  device.queue.writeBuffer(pbuf, 0, init);
  const ubuf = device.createBuffer({ size: 48, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });

  device.pushErrorScope('validation');
  const cLayout = device.createBindGroupLayout({ entries: [
    { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
    { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
  ] });
  const rLayout = device.createBindGroupLayout({ entries: [
    { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
    { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
  ] });
  const cmod = device.createShaderModule({ code: WGSL_COMMON.replace('ACCESS', 'read_write') + WGSL_COMPUTE });
  const rmod = device.createShaderModule({ code: WGSL_COMMON.replace('ACCESS', 'read') + WGSL_RENDER });
  const cpipe = device.createComputePipeline({ layout: device.createPipelineLayout({ bindGroupLayouts: [cLayout] }), compute: { module: cmod, entryPoint: 'main' } });
  const rpipe = device.createRenderPipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [rLayout] }),
    vertex: { module: rmod, entryPoint: 'vs' },
    fragment: {
      module: rmod,
      entryPoint: 'fs',
      targets: [{ format, blend: { color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' }, alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } } }],
    },
    primitive: { topology: 'triangle-list' },
  });
  const cbind = device.createBindGroup({ layout: cLayout, entries: [{ binding: 0, resource: { buffer: ubuf } }, { binding: 1, resource: { buffer: pbuf } }] });
  const rbind = device.createBindGroup({ layout: rLayout, entries: [{ binding: 0, resource: { buffer: ubuf } }, { binding: 1, resource: { buffer: pbuf } }] });
  if (await device.popErrorScope()) { device.destroy(); return; }

  let aspect = 1;
  let scale = 0.003;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    scale = 1.6 / Math.max(1, canvas.clientHeight);
  };
  resize();
  addEventListener('resize', resize);

  // pointer in the shader's space; idle hands the helm to an autonomous ship
  const ptr = { x: 0, y: 0, vx: 0, vy: 0, last: -1e9, has: false };
  const move = (cx: number, cy: number) => {
    const r = canvas.getBoundingClientRect();
    const x = ((cx - r.left) / r.width * 2 - 1) * aspect;
    const y = -((cy - r.top) / r.height * 2 - 1);
    const now = performance.now();
    if (ptr.has) {
      const dt = Math.max(8, now - ptr.last) / 1000;
      ptr.vx = (x - ptr.x) / dt;
      ptr.vy = (y - ptr.y) / dt;
    }
    Object.assign(ptr, { x, y, last: now, has: true });
    if (hint) hint.style.opacity = '0';
  };
  const host = canvas.parentElement!;
  host.addEventListener('pointermove', (e) => move(e.clientX, e.clientY), { passive: true });
  host.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); }, { passive: true });

  let visible = true;
  let raf = 0;
  const kick = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick(); }).observe(canvas);
  document.addEventListener('visibilitychange', kick);

  const u = new Float32Array(12);
  const t0 = performance.now();
  let last = t0;
  const ship = { x: 0, y: 0 };
  let shown = false;
  function frame(now: number) {
    raf = 0;
    if (!visible || document.hidden) { last = now; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    let px: number, py: number, vx: number, vy: number, act = 1;
    if (now - ptr.last > 2500) {
      const nx = Math.sin(t * 0.21) * aspect * 0.75 + aspect * 0.15;
      const ny = band(nx, t, aspect) + Math.sin(t * 0.53) * (aspect < 1 ? 0.08 : 0.18);
      vx = t < 0.2 ? 0 : (nx - ship.x) / Math.max(dt, 1e-3);
      vy = t < 0.2 ? 0 : (ny - ship.y) / Math.max(dt, 1e-3);
      ship.x = px = nx; ship.y = py = ny; act = 0.8;
    } else {
      px = ptr.x; py = ptr.y; vx = ptr.vx; vy = ptr.vy;
      ptr.vx *= Math.exp(-dt * 6); ptr.vy *= Math.exp(-dt * 6);
      ship.x = px; ship.y = py;
    }
    u.set([t, dt, aspect, N, px, py, vx, vy, act, scale, 0, 0]);
    device.queue.writeBuffer(ubuf, 0, u);
    const enc = device.createCommandEncoder();
    const cp = enc.beginComputePass();
    cp.setPipeline(cpipe); cp.setBindGroup(0, cbind); cp.dispatchWorkgroups(Math.ceil(N / 256)); cp.end();
    const rp = enc.beginRenderPass({ colorAttachments: [{ view: ctx!.getCurrentTexture().createView(), clearValue: { r: 0.012, g: 0.024, b: 0.043, a: 1 }, loadOp: 'clear', storeOp: 'store' }] });
    rp.setPipeline(rpipe); rp.setBindGroup(0, rbind); rp.draw(6, N); rp.end();
    device.queue.submit([enc.finish()]);
    if (!shown) { shown = true; canvas.classList.add('live'); hint?.classList.add('on'); }
    kick();
  }
  device.lost.then(() => canvas.classList.remove('live'));
  kick();
}

/** Mount after the page has loaded and the main thread is idle. */
export function initSea() {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-sea]');
  if (!canvas) return;
  const hint = document.querySelector<HTMLElement>('[data-sea-hint]');
  const start = () => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => run(canvas, hint), { timeout: 2500 });
    else setTimeout(() => run(canvas, hint), 400);
  };
  if (document.readyState === 'complete') start();
  else addEventListener('load', start, { once: true });
}
