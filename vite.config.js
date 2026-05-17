import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Modern target for smaller output
    target: 'es2020',
    cssCodeSplit: true,
    // Prevent Vite from preloading lazy-loaded blog chunks on the home page.
    // Without this, markdown (~157KB) and syntax-highlighter (~623KB) get
    // <link rel="modulepreload"> in index.html, defeating code splitting.
    modulePreload: {
      resolveDependencies: (_filename, deps) => {
        return deps.filter(dep =>
          !dep.includes('markdown') &&
          !dep.includes('syntax-highlighter') &&
          !dep.includes('search') &&
          !dep.includes('blogService') &&
          !dep.includes('Blog') &&
          !dep.includes('NotFound')
        );
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React runtime — rarely changes, cached long-term
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor';
          }
          // React Router — separate from app code
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // Syntax highlighter is HUGE (~700KB) — isolate it
          if (id.includes('react-syntax-highlighter') || id.includes('highlight.js') || id.includes('refractor')) {
            return 'syntax-highlighter';
          }
          // Markdown processing — only needed on blog pages
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('micromark') || id.includes('mdast') || id.includes('unist') || id.includes('unified')) {
            return 'markdown';
          }
          // Search library — only needed on blog list page
          if (id.includes('fuse.js')) {
            return 'search';
          }
        },
      },
    },
  },
})
