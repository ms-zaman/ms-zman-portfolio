# CUBE CSS — Sky homepage conventions

The Sky homepage styles follow **CUBE CSS** (Composition · Utility · Block ·
Exception), layered on the existing design tokens. CUBE _extends_ CSS — it leans
on the cascade and inheritance rather than fighting them — so most work is done by
the shared layers and Blocks stay small. Reference: <https://cube.fyi>.

This applies to the **Sky theme only** (pages using `SkyLayout`). The blog's dark
theme (`global.css` / `BaseLayout`) is a separate system, migrated later.

## The layers, and where each lives

| Layer | File(s) | Holds |
|-------|---------|-------|
| **Global / Axioms** | `sky-tokens.css`, `sky-base.css` | design tokens + spacing scale; reset, base element defaults, a11y helpers |
| **C — Composition** | `sky-composition.css` | flexible layout skeletons — _how_ things sit & flow. No colour/type/decoration |
| **U — Utility** | `sky-utilities.css` | single-purpose, token-backed helpers (colour, font, measure, divider, flow-space) |
| **B — Block** | each `*.astro` `<style>` | component-specific **visual** treatment only |
| **E — Exception** | `data-*` attributes on Blocks | state / variant deviations |

Import order (in `SkyLayout.astro`): **tokens → base → composition → utility**.
Component `<style>` Blocks are injected per-component.

## The cascade contract — why no `@layer`

Astro scoped component styles are **unlayered**, so any `@layer` we introduced for
the global sheets would *always lose* to a Block — the opposite of what utilities
need. Instead we use CUBE's native specificity model:

- Composition & Utility are **unscoped, single-class** selectors → specificity `(0,1,0)`.
- A Block's Astro-scoped selector (e.g. `.stats[data-astro-cid-…]`) is `(0,2,0)` → it
  reliably **wins**, so a Block can always override a layout decision locally.
- Utility loads **after** Composition, so utilities win among the global sheets.

**Rule of thumb:** when you hand a property to a Utility or Composition primitive,
**delete it from the Block.** Never fight the cascade with `!important`. If a Utility
truly must override a Block, that's a smell — move the property out of the Block.

## Composition primitives (`sky-composition.css`)

Each exposes a `--hook` with an **inline fallback**, so a Block can pin an exact
value without it inheriting into nested layouts.

| Class | Purpose | Override hook |
|-------|---------|---------------|
| `.wrapper` | centred page gutter (max-width + inline padding) | `--wrapper-pad`, `--wrapper-max` |
| `.flow` | vertical rhythm between direct children (Stack) | `--flow-space` (default `1em`) |
| `.cluster` | wrapping row: tags, meta, button/icon groups | `--cluster-space`, `--cluster-align` |
| `.repel` | push two groups apart; stack when tight | `--repel-space`, `--repel-align` |
| `.grid` | grid items + gutters; **columns set by the Block** | `--grid-space` |
| `.auto-grid` | self-arranging equal columns, no media queries | `--grid-space`, `--grid-min` |
| `.region` | a section's vertical spacing (rhythm only) | `--region-space` |

Bespoke, one-off layouts (e.g. an asymmetric `1fr 1.6fr`) stay a **Block** concern —
composition is for _reusable_ skeletons. Use `.grid` for the gutters and set the
columns in the Block.

## Utilities (`sky-utilities.css`)

Colour (`.text-ink`, `.text-ink-2`, `.text-ink-3`, `.text-accent`, `.bg-card`,
`.bg-paper`, `.bg-accent-soft`) · type (`.font-display`, `.font-sans`, `.measure`,
`.measure-narrow`) · divider (`.border-top-line`) · flow-space
(`.flow-space-s|m|l`) · `.visually-hidden`.

A utility earns its place by **repetition**. One-off odd values (a `22ch` heading, a
`66ch` paragraph) stay in the Block — don't invent a utility for a single use.

## Exceptions — `data-*`, not modifier classes

A variation on a Block goes on a **data attribute**, which signals "driven by an
outside influence (JS, a prop)" and can be read by both CSS and JS:

```html
<button class="btn" data-variant="glass">…</button>
```
```css
.btn[data-variant="glass"] { … }
```

Use for variants and states (`data-variant`, `data-state`). If an "exception" would
transform a Block beyond recognition, make it a **new Block** instead.

## Grouping in the `class` attribute

Order **Block → Composition → Utility**, wrapped in square brackets so a busy
`class` stays scannable:

```html
<section class="[ services ] [ region ] [ border-top-line ]">
  <div class="[ wrapper ]"> … </div>
</section>

<div class="[ stats ] [ grid ] [ border-top-line ]"> … </div>
```

The delimiter is a convention, not a requirement — consistency is what matters.

## Rollout status

- **Done — all Sky components migrated.** The four sheets above + every homepage
  `*.astro` section and the `design-library` styleguide. The `.sky-wrap` and
  `.section` aliases have been **retired** — use `.wrapper`, and `.region` +
  `.border-top-line`. `Loader` and the nav pill stay bespoke Blocks (no shared
  skeleton maps cleanly to their animated/stateful internals — that's fine).
- **Later (separate):** apply the same layers to the blog's `global.css` / dark theme.

## Migrating a component — checklist

1. Move layout to Composition (`.wrapper`, `.flow`, `.cluster`, `.grid`/`.auto-grid`,
   `.region`); pin exact px via the `--hook` where zero-regression matters.
2. Move repeated colour/type/divider to Utilities; **delete those props from the Block**.
3. Keep only component-specific visual treatment in the Block `<style>`.
4. Move variants/states to `data-*` Exceptions.
5. Group classes `[ Block ] [ Composition ] [ Utility ]`.
6. `npm run check` + `npm run build`, then **browser-verify** desktop + mobile
   (390 & 340px) with a `?skyWeather=` sweep — pixel-match the previous look.
