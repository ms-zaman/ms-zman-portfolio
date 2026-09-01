import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sharfuzzaman.com',
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
      name: 'Inter Tight',
      cssVariable: '--font-inter-tight',
      weights: [500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      display: 'optional',
    },
  ],
  integrations: [
    react(),
    sitemap({
      // keep the internal styleguide out of the sitemap
      filter: (page) => !page.includes('/design-library'),
    }),
  ],
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
      // the WebGL vendor chunk is intentionally large, deferred (client:only) and
      // immutably cached — don't fail/alarm the build over its size.
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Isolate the heavy, stable WebGL deps (three + r3f + drei) into one
          // vendor chunk so a scene tweak re-downloads only the tiny scene code,
          // not ~1 MB of libraries. Kept as a single chunk to avoid a circular
          // three↔drei split.
          //
          // React must be pulled out FIRST. Left to itself, Rollup hoists react +
          // react-dom into `webgl` as the shared ancestor of both islands — which
          // made /blog download the whole 270 kB gz three.js chunk just to render
          // a search box. Its own chunk keeps that to ~43 kB gz.
          manualChunks(id) {
            // Vite's __vitePreload helper is a virtual module, so it falls past
            // the node_modules guard below and Rollup parks it wherever it likes
            // — it landed in `webgl`, which meant HeroSky imported 220 kB gz of
            // three.js just to reach a ~20-line helper, undoing the lazy split.
            // Pin it next to React, which every island loads anyway.
            if (id.includes('vite/preload-helper')) return 'react';
            if (!id.includes('node_modules')) return;
            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/scheduler/')
            ) {
              return 'react';
            }
            if (id.includes('/three/') || id.includes('@react-three') || id.includes('/maath/')) {
              return 'webgl';
            }
          },
        },
      },
    },
  },
});
