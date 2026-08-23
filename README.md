# Sharfuzzaman — WordPress Developer Portfolio

A time- and weather-aware single-page portfolio with a WebGL "Sky" hero, built
with Astro and a small amount of React.

**Live:** [sharfuzzaman.com](https://sharfuzzaman.com)

---

## Tech Stack

- **Astro 6** — static site framework, islands architecture
- **React 18** — used only where interactivity is needed (the WebGL hero + blog search)
- **three.js / @react-three/fiber / @react-three/drei** — the hero's live weather scene
- **Vanilla CSS (CUBE CSS)** — token-driven design system, no utility framework
- **Inter / Inter Tight** — self-hosted, subset & preloaded via the Astro Fonts API
- **Netlify Forms** — contact form handling (honeypot + AJAX, no-JS fallback)

The hero renders the local time of day (a solar-position engine drives the sky
palette and sun/moon arc) and live weather from Open-Meteo, with a WebGL scene
for rain, snow, clouds, fog, and lightning. It degrades to a static poster under
`prefers-reduced-motion`.

---

## Project Structure

```
├── src/
│   ├── pages/
│   │   ├── index.astro            # Homepage — the "Sky" portfolio
│   │   ├── 404.astro              # Not-found page
│   │   ├── design-library.astro   # Internal styleguide (noindex, not linked)
│   │   └── blog/
│   │       ├── index.astro        # Blog listing + search
│   │       └── [slug].astro       # Blog post
│   ├── layouts/
│   │   ├── SkyLayout.astro         # Homepage shell (JSON-LD, sky engine)
│   │   └── BlogLayout.astro        # Blog / 404 shell (view transitions)
│   ├── components/
│   │   ├── SkyNav.astro            # Site navigation
│   │   ├── BlogSearch.jsx          # Fuse.js-powered blog search island
│   │   ├── Clarity.astro           # Microsoft Clarity tag (both layouts)
│   │   └── sky/
│   │       ├── Hero.astro, WhatIDo.astro, Services.astro, …  # Page sections
│   │       └── hero-sky/           # React Three Fiber weather hero island
│   ├── scripts/
│   │   ├── sky-engine.ts           # Solar position → sky palette / sun arc
│   │   ├── weather.ts              # Open-Meteo fetch
│   │   ├── resolve-condition.ts    # Weather + phase → visual condition
│   │   ├── weather-css.ts          # Condition → CSS custom properties
│   │   └── clarity.ts              # Clarity init, deferred to browser idle
│   ├── styles/                     # CUBE CSS layers (tokens, base, composition, …)
│   ├── blog/                       # Blog post content (Markdown)
│   ├── images/                     # Bundled images (OG fallback)
│   └── content.config.ts           # Content collections config
├── public/
│   ├── sky/                        # Hero textures (clouds, sky poster)
│   ├── favicon.svg, apple-touch-icon.png, og.jpg
│   └── robots.txt
├── astro.config.mjs                # Integrations, fonts, WebGL vendor chunk
├── netlify.toml                    # Netlify deploy config, redirects, headers
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type-check (astro check)
npm run check

# Production build
npm run build

# Preview production build
npm run preview
```

**Dev previews:** override the hero with `?skyHour=<0-24>` (time of day) or
`?skyWeather=<sunny|cloudy|drizzle|snow|overcast-night|drizzle-night|clear-night>`.

---

## Deployment

Deployed on [Netlify](https://www.netlify.com/) with automatic builds from the
`main` branch. See `netlify.toml` for build config, redirects, and security
headers.

---

## License

MIT
