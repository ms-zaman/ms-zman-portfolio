import Clarity from '@microsoft/clarity';

// Microsoft Clarity (heatmaps + session replay), alongside GA.
// The id is build-time public config; without it Clarity simply never loads,
// so local dev and forks stay clean.
const projectId = import.meta.env.PUBLIC_CLARITY_ID;

if (projectId) {
  // Hold the tag until the browser is idle — the hero boots WebGL right after
  // paint, and analytics must not compete with it for the LCP window.
  // Clarity's own injector is id-guarded, so a repeat call is a no-op.
  const start = () => Clarity.init(projectId);

  if ('requestIdleCallback' in window) {
    requestIdleCallback(start, { timeout: 5000 });
  } else {
    setTimeout(start, 2000);
  }
}
