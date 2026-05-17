# Designing a Dark Theme Portfolio with Full WCAG AA Compliance

When I set out to redesign my portfolio, I knew I wanted a sleek, premium dark theme. Dark mode isn't just an aesthetic choice anymore; it's an expectation. However, creating a dark theme that looks good is only half the battle. Making it accessible is where the real engineering happens.

## The Contrast Problem

One of the biggest mistakes developers make with dark mode is using pure black (`#000000`) backgrounds with pure white (`#FFFFFF`) text. While this creates maximum contrast, it actually causes eye strain (halation) for many users. 

Instead, I opted for a dark grey surface palette (like `#121212`) combined with off-white text (`#E0E0E0`). But I couldn't just guess these colors—I needed to ensure they met the **WCAG AA standard**, which requires a contrast ratio of at least 4.5:1 for normal text.

## Automating the Audit

To ensure my entire React application was compliant, I didn't rely on manual checking. Here was my process:

1. **Tokenization:** I extracted all my colors into CSS variables (`var(--bg)`, `var(--surface)`, `var(--text)`, `var(--text-muted)`).
2. **Contrast Checking:** I ran automated contrast audits on all UI elements—from buttons and borders to disabled text states.
3. **Refining the Palette:** When my `var(--text-muted)` failed the 4.5:1 ratio against `var(--surface)`, I systematically lightened the hex value until it passed, without losing the visual hierarchy.

```css
/* Example of accessible dark theme tokens */
:root {
  --bg: #0A0A0A;
  --surface: #141414;
  
  /* High emphasis text (Passes WCAG AAA) */
  --text: #F3F4F6; 
  
  /* Medium emphasis text (Passes WCAG AA against --surface) */
  --text-muted: #9CA3AF; 
  
  /* Primary interactive color */
  --primary: #6366F1;
}
```

## The "Invisible" Borders Issue

Another challenge was structural borders. In a dark theme, elements can blend together. I initially used a very subtle border color (`#1F2937`), but an audit revealed it was nearly invisible on some monitors. I adjusted the lightness up by just 5%, making it perceptible without being overwhelming.

## Conclusion

Accessibility should never be an afterthought bolted onto a project. By integrating contrast checks into my design system from day one, I created a portfolio that not only looks premium but is usable by everyone, regardless of their visual capabilities.
