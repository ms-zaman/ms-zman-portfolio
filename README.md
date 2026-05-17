# MS Zaman — Frontend Developer Portfolio

A clean, accessible, single-page portfolio built with React and vanilla CSS.

**Live:** [sharfuzzaman.com](https://sharfuzzaman.com)

---

## Tech Stack

- **React 18** — UI library
- **React Router 7** — Client-side routing with SPA fallback
- **Vite 5** — Build tooling and dev server
- **Vanilla CSS** — Custom design system with CSS custom properties
- **DM Sans / DM Mono** — Typography via Google Fonts
- **Tabler Icons** — Icon set via webfont

---

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx   # Error boundary fallback
│   │   ├── FadeIn.jsx          # Intersection Observer animation
│   │   ├── Footer.jsx          # Site footer with social links
│   │   ├── Layout.jsx          # Root layout (nav + main + footer)
│   │   ├── Navigation.jsx      # Sticky nav with accessible mobile menu
│   │   └── index.js            # Barrel exports
│   ├── pages/
│   │   ├── Home.jsx            # Single-page portfolio content
│   │   └── NotFound.jsx        # 404 page
│   ├── App.jsx                 # Router provider
│   ├── main.jsx                # Entry point
│   ├── index.css               # Design tokens + all styles
│   └── routes.jsx              # Route config
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── index.html                  # HTML shell with SEO meta
├── netlify.toml                # Netlify deploy config
├── vite.config.js
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Deployment

Deployed on [Netlify](https://www.netlify.com/) with automatic builds from the `main` branch. See `netlify.toml` for configuration.

---

## License

MIT
