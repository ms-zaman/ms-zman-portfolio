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
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('/three/') || id.includes('@react-three') || id.includes('/maath/')) {
              return 'webgl';
            }
          },
        },
      },
    },
  },
});
