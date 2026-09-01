/**
 * agent-docs — the plain-text/markdown mirror of the site, for AI agents.
 *
 * The homepage is assembled from ~11 Astro components, so there is no markdown
 * source to serve back for `Accept: text/markdown`. This module is that source,
 * hand-authored and kept in ONE place so the drift is visible: when homepage
 * copy changes materially (positioning, metrics, roles), change it here too.
 *
 * Consumed by src/pages/index.md.ts and src/pages/llms.txt.ts.
 *
 * ⚠️ The four metrics are verified and must not drift or be conflated:
 *    5+ yrs · 40+ packs PERSONALLY DEVELOPED · 500+ packs EXPORTED · 700K+ users.
 *    "40+ developed" and "500+ exported" are different numbers for different things.
 */

export const SITE = 'https://sharfuzzaman.com';
export const EMAIL = 'dev.mszaman@gmail.com';

/** One-paragraph description reused by llms.txt and the OpenAPI summary. */
export const summary =
  'Sharfuzzaman is a WordPress Developer in Dhaka, Bangladesh (GMT+6) with 5+ years of ' +
  'experience specializing in Elementor, Gutenberg and pixel-perfect frontend implementation. ' +
  'Currently a Frontend Developer at Startise building production template packs for Templately. ' +
  'Open to remote opportunities.';

/** The homepage, as markdown. Served at /index.md and via Accept negotiation on /. */
export const homeMarkdown = `# Sharfuzzaman

> WordPress Developer specializing in Elementor & Gutenberg.
> Dhaka, Bangladesh (GMT+6) · **open to remote opportunities**.

5+ years building pixel-perfect, production-ready WordPress experiences, with 40+ template
packs personally developed for an ecosystem of 700K+ users.

## At a glance

| | |
|---|---|
| Role | WordPress Developer (Frontend Developer at Startise) |
| Specialization | Elementor, Gutenberg, pixel-perfect implementation |
| Experience | 5+ years |
| Location | Dhaka, Bangladesh (GMT+6) |
| Availability | Open to remote opportunities |
| Email | ${EMAIL} |
| Résumé | ${SITE}/Sharfuzzaman-Resume.pdf |

**Verified metrics.** 700K+ users in the Templately ecosystem my work ships to ·
40+ template packs personally developed (Elementor & Gutenberg) ·
500+ template packs exported, most of the team's output · 5+ years of experience.

## What I do

I turn design files into pixel-perfect production WordPress: Elementor and Gutenberg in
roughly equal measure, built to hold up on every screen and stay easy for the next person
to edit.

## Expertise

- **Elementor development:** production template packs and client-editable sites: custom
  layouts, responsive breakpoints, and structure that survives real content.
- **Gutenberg development:** native block editor builds: block patterns, reusable layouts,
  and clean semantic structure that stays fast without a page-builder runtime.
- **Pixel-perfect implementation:** translating design specifications into production
  builds, working directly with designers and QA until it matches at every breakpoint.
- **Global Style & Typography:** expert-level work on Templately's Global Style and
  Typography systems across template packs; the internal reference point for it on my team.
- **WooCommerce & production WordPress:** store and site work on live installs, theme
  customisation, plus the update and maintenance workflows that keep an ecosystem healthy.
- **Frontend, migration & automation:** hand-written HTML, CSS, JavaScript and React where
  a builder is the wrong tool, plus WordPress migrations, WordPress-to-Astro work, and
  automating repetitive maintenance.

## Toolkit

- **WordPress:** WordPress, Elementor, Gutenberg, WooCommerce, theme development, template
  development, Global Style & Typography
- **Frontend:** HTML5, CSS3, JavaScript, React, responsive development, pixel-perfect UI
  implementation, Figma → WordPress
- **Development:** PHP, MySQL, Git, GitHub
- **Additional:** on-page SEO-aware development, WordPress migration, WordPress → Astro,
  AI-assisted automation

## Selected work

- [SaaStrive](https://templately.com/pack/saastrive-elementor-saas-template): SaaS website
  template (Elementor). 8 page designs, 15 sections. Built every page from the design
  reference, pixel-perfect and fully responsive.
- [MindXtend](https://templately.com/pack/mindxtend-business-consultancy-template-gutenberg):
  business consultancy template, built natively in the block editor. 7 page designs,
  12 sections.
- [BookAnAir](https://templately.com/pack/bookanair-elementor-flight-booking-website):
  flight booking website (Elementor). 8 page designs, 11 sections.

Also from the Templately library: NaturExplo, FlexiDropper, SnapCatch, Multigency,
NooCodeHub, HiringFinds, D-Care, NatureTreat.

### Also built

- **Plugin Pilot:** *1st place, Startise AI Automation Competition.* A WordPress automation
  tool streamlining repetitive maintenance across Templately's multisite template-pack
  environments, starting with plugin installs and updates.
- **WordPress → Astro migration** *(in progress)*: contributing to production
  WordPress-to-Astro migrations on the team, including the ongoing migration of easy.jobs.

## Open source

- [DesignScan](https://github.com/ms-zaman/DesignScan) : point it at a URL and get a
  \`DESIGN.md\`: automatic design-token extraction (colors, type, spacing, radius) from any
  live site, ready for your coding agent. TypeScript, Playwright, CLI. MIT.
- [Redline](https://github.com/ms-zaman/Redline) : an end-to-end data pipeline that crawls
  news sources, uses AI to classify and geo-tag each incident, stores it in Postgres, and
  renders it on a live filterable map with charts. Next.js, React, Express, PostgreSQL,
  Puppeteer, Leaflet.

## Experience

### Frontend Developer, Startise, Dhaka (Nov 2022 – present)

Building production WordPress template packs for Templately, split roughly 50/50 between
Elementor and Gutenberg, in a workflow where pixel-perfect implementation is the baseline.

- Personally developed 40+ template packs and exported 500+, the majority of the team's
  pack exports.
- Expert-level Templately Global Style & Typography work; the internal reference point for it.
- Work directly with designers and QA to refine each build until it matches the design.
- Supported and reviewed template migrations across the library.
- Coordinate and review the work of a 4-member development team.
- Own WordPress update and maintenance workflows across Startise's site ecosystem.
- Contributing to production WordPress → Astro migrations, including easy.jobs.

### Frontend Developer, American Best IT, Dhaka (Jan – Oct 2022)

Built functional websites for marketing-focused client projects, structuring sites with SEO
in mind: content hierarchy, usability, and search-engine-friendly markup.

- Applied on-page SEO principles to site structure and content hierarchy.
- Client projects included Alpha Omega Restoration Pros and Dera Resort.

### Jr. Web Developer, Technofelia, Dhaka (Jan – Oct 2021)

Developed websites and web applications, working inside existing PHP codebases and turning
designs into pixel-perfect frontends.

- Customised CodeCanyon scripts and fixed bugs in existing PHP applications.
- Handled Fiverr client work involving script customisation and bug fixing.
- Worked on YodaBD.

## Contact

Currently looking for a remote WordPress / Web Developer position.

- Email: <${EMAIL}>
- GitHub: <https://github.com/ms-zaman>
- LinkedIn: <https://www.linkedin.com/in/sharfuzzaman/>
- WhatsApp: <https://wa.me/8801764121252>
- Résumé: <${SITE}/Sharfuzzaman-Resume.pdf>
- Writing: <${SITE}/blog>
`;
