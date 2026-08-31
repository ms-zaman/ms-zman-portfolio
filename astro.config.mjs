import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sharfuzzaman.com',
  // Self-hosted, subset, preloaded fonts with auto metric-matched fallbacks
  // (eliminates the font-swap layout shift and the Google CDN round-trip).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter Tight',
      cssVariable: '--font-inter-tight',
      weights: [500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
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
