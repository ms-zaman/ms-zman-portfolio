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
 * ⚠️ Metrics are verified and must not drift or be conflated:
 *    5+ yrs · 40+ packs PERSONALLY DEVELOPED · 500+ packs EXPORTED · 700K+ users.
 *    "40+ developed" and "500+ exported" are different numbers for different things.
 *    Case study numbers (Hermizon, ShopCurator, SchedulePress, WPDeveloper) are
 *    sourced in redesign/case-studies-draft.md (local only). Hermizon is a
 *    "client project" only: never name its owner or how the work came in.
 */

export const SITE = 'https://sharfuzzaman.com';
export const EMAIL = 'dev.mszaman@gmail.com';

/** One-paragraph description reused by llms.txt and the OpenAPI summary. */
export const summary =
  'Sharfuzzaman is a WordPress developer in Dhaka, Bangladesh (GMT+6) with 5+ years of ' +
  'experience who builds products for the web and ships them: WooCommerce stores, WordPress ' +
  'plugins, MCP integrations for AI assistants, and the deploys behind them. Frontend Developer ' +
  'at Startise (WPDeveloper). Open to remote roles and well defined projects.';

/** The homepage, as markdown. Served at /index.md and via Accept negotiation on /. */
export const homeMarkdown = `# Sharfuzzaman

> I build products for the web and ship them.
> Dhaka, Bangladesh (GMT+6) · **open to roles and projects**.

5+ years of production WordPress. Lately: a WooCommerce store I built and run, my own plugin
on WordPress.org, and AI assistants inside a plugin on 10,000+ sites.

## At a glance

| | |
|---|---|
| Role | WordPress developer (Frontend Developer at Startise) |
| Focus | WooCommerce stores, plugin development, MCP and AI integrations, deployment |
| Experience | 5+ years |
| Location | Dhaka, Bangladesh (GMT+6) |
| Availability | Open to remote roles and well defined projects |
| Email | ${EMAIL} |
| Résumé | ${SITE}/Sharfuzzaman-Resume.pdf |

**Verified metrics.** 10,000+ active installs of SchedulePress, which I release ·
34 MCP tools running a live WooCommerce store · 40+ template packs personally developed ·
500+ template packs exported · 700K+ users in the Templately ecosystem · 5+ years.

## What I do

I take a product from the design file to a live server: the storefront, the plugins behind
it, the deploy, and the AI tools around it. WordPress is where I go deepest.

## Selected work

### Hermizon (client project): hermizon.com

A women's footwear store in Bangladesh. I rebuilt it on a custom block theme and six plugins
of my own (phone sign in with SMS codes, courier booking, server side tracking), deployed it,
and run it. The shop's team manages it through an MCP server with 34 tools: every write is
previewed first and needs a signed, single use confirm token; write tools are off until an
admin turns them on. Home page 80% lighter (4,169 KB to 817 KB); mobile LCP 1.36s from real
user data. Deployment is git and Composer only, behind a launch runbook with a final gate.

### ShopCurator (own plugin): <https://wordpress.org/plugins/shopcurator/>

A free WooCommerce plugin for block themes, rebuilt from fixes first written for one store:
22 storefront blocks rendered in PHP, a usable My Account area, size filters that count only
what is in stock, and phone sign in with SMS codes. Approved on WordPress.org in November 2026.

### SchedulePress (WPDeveloper): <https://wordpress.org/plugins/wp-scheduled-posts/>

A post scheduling and social sharing plugin with 10,000+ active installs. I took its MCP
server from an internal branch to public release in 5.4.0 (24 Nov 2026): 20 tools, OAuth
for Claude and ChatGPT, sharing off until an admin allows it, every share confirmed. I run
the Free and Pro releases: three in three weeks in November 2026.

### WPDeveloper sites: <https://wpdeveloper.com/>

The company homepage (live since 8 Oct 2026) and Black Friday 2026 across five sites, built
with a pipeline that generates Elementor page data from Figma in Python, pushes it over the
REST API and checks it against the design in a headless browser.

### Also built

- **Plugin Pilot:** *1st place, Startise AI Automation Competition.* Deploys WordPress
  plugins to many sites at once from a dashboard or Slack. Internal tool.
- **[Saasar](https://astro.build/themes/details/saasar-ai-saas-project-management-astro-theme/):**
  a paid Astro theme for AI SaaS and project management products, 18 page templates, on the
  official Astro themes directory. Built with Build2Next.
- **This site:** a live WebGL weather sky that scores 99 on mobile PageSpeed, up from 42.
- **[Prostuti](https://visaprep.sharfuzzaman.com/):** a Bengali site that helps people in
  Bangladesh prepare Indian visa applications, with an in browser photo checker.

From the Templately library: SaaStrive, MindXtend, BookAnAir, NaturExplo, FlexiDropper,
SnapCatch, Multigency, NooCodeHub, HiringFinds, D-Care.

## Expertise

- **WooCommerce stores:** phone first, cash on delivery, courier booking, SMS codes, server
  side tracking (Meta CAPI, GA4).
- **Plugin development:** PHP plugins that pass WordPress.org review, with PHPStan, PHPCS
  and releases that can be rolled back.
- **MCP and AI integrations:** connecting AI assistants to real systems safely: previews,
  signed confirm tokens, admin switches, rate limits, OAuth.
- **Elementor and Gutenberg:** 40+ production template packs, Global Style & Typography.
- **Deployment and operations:** hosting, staging, git based deploys, launch gates,
  rollbacks, email DNS (Netlify, Cloudflare, xCloud).
- **Performance:** page weight, Critical CSS, Core Web Vitals from real users.

## Toolkit

- **WordPress:** WordPress, WooCommerce, Elementor, Gutenberg, block themes, plugin
  development, Global Style & Typography
- **Backend:** PHP, MySQL, REST API, WP CLI, Composer, PHPStan, MCP, OAuth
- **Frontend:** HTML, CSS, JavaScript, React, Astro, WebGL (React Three Fiber), Figma to code
- **Ship:** Git, GitHub Actions, Netlify, Cloudflare, xCloud, WordPress.org SVN
- **Also:** Python, Rust (learning), SEO aware development, WordPress to Astro

## Lab

- [DesignScan](https://github.com/ms-zaman/DesignScan) *(open source)*: point it at a URL
  and get a \`DESIGN.md\` of its design tokens. TypeScript, Playwright, CLI. MIT.
- [Redline](https://github.com/ms-zaman/Redline) *(open source)*: crawls news sources,
  classifies and geotags incidents with AI, stores them in Postgres, renders a live map.
- [WordPress to Astro kit](https://github.com/ms-zaman/wordpress-to-astro-kit)
  *(open source)*: a starter app and playbook for moving a WordPress site to Astro.
- **Afternote** *(prototype)*: a Bengali first newsroom with a Rust API and an MCP server
  for AI readers.
- **Onushondhan** *(in progress)*: a verified hub for Bangla books and audiobooks.
- [Learning Rust](${SITE}/blog/learning-rust-variables-mutability-shadowing) *(learning in
  public)*: lessons on memory, ownership and concurrency, in Bengali.

## How I ship

1. **Understand:** read the brief, the design and the data before writing code.
2. **Decide, in writing:** every real choice gets a short written record.
3. **Check the real path:** tests are a start; I also check what a user actually touches.
4. **Release behind a gate:** staging first, a checklist, a rollback ready.

## Experience

### Frontend Developer, Startise, Dhaka (Nov 2022 – present)

Started on Templately template packs and now work across the company's WordPress products:
plugin releases, AI integrations, and the live marketing sites.

- Release SchedulePress Free and Pro (10,000+ active installs); took its MCP server from an
  internal branch to public release in 5.4.0.
- Build WPDeveloper's live sites from Figma with a Python to Elementor pipeline: the
  wpdeveloper.com homepage and Black Friday 2026 across five sites.
- Personally developed 40+ template packs and exported 500+, the majority of the team's
  pack exports.
- Expert level Templately Global Style & Typography work; the internal reference point for it.
- Coordinate and review the work of a 4-member development team.
- Own WordPress update and maintenance workflows across Startise's site ecosystem.
- Contributing to production WordPress to Astro migrations, including easy.jobs.

### Frontend Developer, American Best IT, Dhaka (Jan – Oct 2022)

Built functional websites for marketing focused client projects, structuring sites with SEO
in mind: content hierarchy, usability, and search engine friendly markup.

- Applied SEO principles to site structure and content hierarchy.
- Client projects included Alpha Omega Restoration Pros and Dera Resort.

### Jr. Web Developer, Technofelia, Dhaka (Jan – Oct 2021)

Developed websites and web applications, working inside existing PHP codebases and turning
designs into pixel perfect frontends.

- Customised CodeCanyon scripts and fixed bugs in existing PHP applications.
- Handled Fiverr client work involving script customisation and bug fixing.
- Worked on YodaBD.

## Contact

Open to a remote role or a well defined project.

- Email: <${EMAIL}>
- GitHub: <https://github.com/ms-zaman>
- LinkedIn: <https://www.linkedin.com/in/sharfuzzaman/>
- WhatsApp: <https://wa.me/8801764121252>
- Résumé: <${SITE}/Sharfuzzaman-Resume.pdf>
- Writing: <${SITE}/blog>
`;
