import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sharfuzzaman.com',
  integrations: [
    react(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
