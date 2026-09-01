/**
 * Should this visitor get the WebGL sky at all, and when?
 *
 * The hero used to mount its canvas the moment live weather resolved — which is
 * inside the page's load window. Two things made that expensive:
 *
 *   • the render loop never lets the main thread go quiet, so Lighthouse's TTI
 *     slides to the end of the trace and every long task in between lands in TBT;
 *   • on a machine with no GPU the frames are rasterised on the CPU, and each one
 *     *is* a long task. Measured on the live site: TBT 7.8 s (desktop PSI) and
 *     11.6 s (mobile PSI) against 79 ms for the same page on a real GPU.
 *
 * So the canvas now waits for `load` + idle (`whenIdle`) and only arms on hardware
 * that can actually carry it (`canAffordWebgl`). Everyone else keeps the CSS photo
 * poster, which is the `sunny` hero — a good hero in its own right, not a fallback.
 *
 * These are capability checks, not client sniffing: a real visitor on a GPU-less
 * or memory-starved device gets the poster for the same reason a lab runner does.
 */

/** Remembered verdict from the frame-budget watchdog (see WeatherScene). */
const SLOW_KEY = 'sky:webgl-too-slow';

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * A synchronous pre-check, run *before* the `import('./WeatherCanvas')` so a
 * device that fails it never downloads the ~216 kB gz three.js chunk.
 */
export function canAffordWebgl(): boolean {
  if (typeof window === 'undefined') return false;

  // The browser already decided this one was too slow to render (watchdog below).
  try {
    if (localStorage.getItem(SLOW_KEY) === '1') return false;
  } catch {
    // storage blocked — carry on with the live checks
  }

  const nav = navigator as Navigator & {
    connection?: NetworkInformation;
    deviceMemory?: number;
  };

  // Data saver on, or a connection where 216 kB is a real cost.
  const conn = nav.connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /^(slow-2g|2g|3g)$/.test(conn.effectiveType)) return false;

  // Low-memory / low-core devices: the scene runs, but not without stealing the
  // main thread from scrolling and the contact form.
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return false;

  return !isSoftwareRenderer();
}

/**
 * True when WebGL is unavailable, or present but rasterised on the CPU
 * (SwiftShader, llvmpipe, Mesa's offscreen path, Microsoft's Basic Render driver).
 * Those all draw a full-screen sky at a few frames per second.
 *
 * `WEBGL_debug_renderer_info` is not exposed everywhere — Firefox gates it behind
 * a pref. Its absence is not evidence of a bad GPU, so we report "not software"
 * and leave the verdict to the frame-budget watchdog.
 */
function isSoftwareRenderer(): boolean {
  let gl: WebGLRenderingContext | null = null;
  try {
    const canvas = document.createElement('canvas');
    gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return true; // no WebGL at all → poster

    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (!dbg) return false; // can't tell; let the watchdog judge

    const renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? '');
    return /swiftshader|llvmpipe|software|basic render|mesa offscreen|paravirtual/i.test(renderer);
  } catch {
    return true;
  } finally {
    // release the probe context promptly rather than waiting on GC — browsers cap
    // how many live WebGL contexts a page may hold
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

/**
 * Run `cb` once the page has finished loading and the browser has a spare moment.
 * Same shape as the analytics idle-init in src/scripts/clarity.ts.
 */
export function whenIdle(cb: () => void): void {
  const idle = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(cb, { timeout: 3000 });
    else setTimeout(cb, 1500);
  };
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
}

/** Remember that this browser couldn't keep up, so the next visit skips the download. */
export function rememberTooSlow(): void {
  try {
    localStorage.setItem(SLOW_KEY, '1');
  } catch {
    // storage blocked — the check just won't persist
  }
}
