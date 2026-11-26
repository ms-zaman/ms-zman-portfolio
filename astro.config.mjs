import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sharfuzzaman.com',
  // The dev toolbar ships its own dependencies, which Vite's optimizer treats as a
  // separate dependency graph from the site's. That graph is what kept returning
  // "504 (Outdated Optimize Dep)" for dev-toolbar/entrypoint.js on every reload —
  // noise that reads like a site error and drowned out real ones (it hid the WebGL
  // context loss behind it). Nothing here uses the toolbar, and it never ships to
  // production, so turning it off is free.
  devToolbar: { enabled: false },
  // Self-hosted, subset, preloaded fonts with auto metric-matched fallbacks.
  //
  // `display: 'optional'` is doing real work here. The generated fallback faces are
  // metric-matched vertically (size-adjust / ascent-override), which fixes line
  // height — but not per-glyph advance widths, so a late swap can still re-wrap a
  // line. Measured on a throttled first load: the fonts landed ~1.1 s after first
  // paint and re-wrapped the hero's glance card, 185px → 157px — CLS 0.20 in one
  // shift. `optional` gives the preloads a short window and then commits to whatever
  // it has for that page load, so a swap can never shift the layout. Repeat visits
  // (the files are immutably cached) always get the real faces.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'optional',
    },
    {
      provider: fontProviders.google(),
      name: 'Jost',
      cssVariable: '--font-jost',
      weights: [200, 300, 400],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'optional',
    },
    {
      provider: fontProviders.google(),
      name: 'Overpass Mono',
      cssVariable: '--font-overpass-mono',
      weights: [600],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'optional',
    },
  ],
  integrations: [react(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  build: {
    // Inline the stylesheets rather than linking them. The homepage sheet is ~60 kB
    // raw / 10 kB gz, and as an external <link> it was a render-blocking round-trip
    // in front of first paint (PSI: ~300 ms on mobile). Inlined it rides the HTML's
    // own brotli and costs no extra request.
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          // React exists only for the blog's search island; keep it in its own
          // chunk so no other page ever downloads it.
          manualChunks(id) {
            if (id.includes('vite/preload-helper')) return 'react';
            if (!id.includes('node_modules')) return;
            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/scheduler/')
            ) {
              return 'react';
            }
          },
        },
      },
    },
  },
});
