# Accelerator X — Design System

**Version:** 2.0
**Date:** 16 May 2026
**Status:** Canonical. Supersedes v1.3 (`DESIGN (1).md`) and the wireframe-direction-B token system.
**Source of truth:** This document for principles; `tokens.css` for implementation; `tokens.json` for interop.

---

## Why v2

v1.3 was a good audit of the brand as it stood. v2 is the **single canonical system** for the rebuild — reconciled with the Direction B wireframe explorations, gaps filled, contradictions resolved, applied everywhere we make work.

What changed:

- **Reconciled** the brand DS (Figtree + navy/pink palette) with Direction B wireframes (editorial restraint, warm paper surfaces). The brand DS wins on type and palette; Direction B's structural quality (whitespace, type hierarchy, layout discipline) survives in how we apply it.
- **Added** the *paper* surface — a warm ivory for longform reading surfaces (articles, case studies, the methodology page).
- **Added** component primitives with full state coverage (buttons, inputs, chips).
- **Added** accessibility-verified colour pairings (every brand colour, every surface).
- **Added** sections on iconography, photography, motion principles, OG/social cards, email signatures, naming conventions.
- **Resolved** open inconsistencies from v1.3 §10 (rogue colours, font migration, logo placement).
- **Dropped** Aptos references entirely, A/C/D direction-specific tokens, wireframe-temporary `--c-*` variables.

---

## Contents

1. [Brand foundations](#1-brand-foundations)
2. [Logo](#2-logo)
3. [Colour](#3-colour)
4. [Typography](#4-typography)
5. [Spacing & layout](#5-spacing--layout)
6. [Motion](#6-motion)
7. [Iconography](#7-iconography)
8. [Photography & imagery](#8-photography--imagery)
9. [Component primitives](#9-component-primitives)
10. [Voice](#10-voice)
11. [Conventions](#11-conventions)
12. [Asset library](#12-asset-library)
13. [Migration from v1.3](#13-migration-from-v13)

---

## 1. Brand foundations

Accelerator X is a founder-led AI transformation consultancy for senior business leaders. The brand should convey:

- **Credibility and precision** — not agency polish, not consultancy bloat.
- **Practical intelligence** — practitioner brand, not product brand.
- **Energy and directness** — bold without being loud.

The visual system is built around a dark navy base, punctuated by a signature pink/magenta accent and a small palette of functional secondary colours. Editorial restraint over decorative flourish. The system spans web, slides, documents, email — and looks native on each because no surface depends on a font being installed.

---

## 2. Logo

### Primary wordmark

The logo is a sans-serif wordmark — "AcceleratorX" set in a custom cut — where the terminal **X** is rendered in **brand pink (`#E93F8E`)** against the otherwise **navy (`#1B2A4A`)** letterforms.

The pink **X** is the defining brand signature and should never be altered in colour, weight, or proportion. It is the brand's strongest visual asset and earns priority in any composition.

### Icon mark

A circular icon mark — navy circle, white **A** + pink **X** — acts as the avatar variant of the brand. Use for favicons, social profiles, app icons, footer chips, and anywhere the horizontal wordmark won't fit. The pink X stays readable down to 16px.

### Files

| Format | Variant | Path | Notes |
|--------|---------|------|-------|
| SVG | Wordmark, full colour | `design-system/brand-assets/logos/SVG/AcceleratorX.svg` | 748×127, transparent |
| SVG | Wordmark, white | `design-system/brand-assets/logos/SVG/AcceleratorX-white.svg` | For dark backgrounds |
| PNG | Wordmark | `design-system/brand-assets/logos/PNG/AcceleratorX-wordmark.png` | 1125×195 |
| PNG | Icon mark | `design-system/brand-assets/logos/PNG/AcceleratorX-icon.png` | 362×362, transparent corners |

### Rules

- Full-colour SVG for digital wherever supported.
- White SVG on dark backgrounds.
- Icon mark for favicons, social avatars, app icons, anywhere the wordmark won't fit.
- PNG only where SVG isn't supported (PowerPoint, Word, email).
- Clear space = height of the capital "A" on all sides.
- Never recolour, distort, crop, or add effects.
- **The pink X may be used as a standalone motif** (section dividers, list bullets, end-of-article marks) — see §7.

---

## 3. Colour

### 3.1 Brand palette

The brand's identity colours. Confirmed against the asset pack and the production website.

| Token | Hex | Role |
|---|---|---|
| `--ax-navy` | `#1B2A4A` | Primary dark — backgrounds, headlines, dark panels |
| `--ax-navy-deep` | `#131D30` | Very dark — section dividers, footer bars |
| `--ax-pink` | `#E93F8E` | Signature accent — the X, primary CTAs, emphasis |
| `--ax-cyan` | `#088ABF` | Secondary accent — web "go" colour, data callouts |
| `--ax-amber` | `#FEA700` | Tertiary — highlights, outputs, warnings. Fills, borders and icons only, never text on a light surface (§3.6) |
| `--ax-amber-text` | `#8A5E00` | Amber **as text** on white, paper or the amber tint (5.7:1, 5.4:1, 5.2:1). Never on navy |
| `--ax-purple` | `#882DE7` | Quaternary — alternative pathways, secondary concepts |
| `--ax-green` | `#1FBD53` | Success states, positive indicators |
| `--ax-blue` | `#3477F5` | Functional blue — links, secondary CTAs |

### 3.2 Surfaces

| Token | Hex | Role |
|---|---|---|
| `--ax-white` | `#FFFFFF` | Default light surface |
| `--ax-off-white` | `#F8FAFC` | Cool off-white — secondary light surface |
| `--ax-pale-blue` | `#F0F9FF` | Tinted callout background |
| `--ax-paper` | `#FAF8F3` | **NEW** Warm ivory — editorial/longform surfaces |
| `--ax-paper-deep` | `#F1EDE2` | **NEW** Recessed warm — sidebars, cards on paper |

**When to use `--ax-paper`:** Articles, case studies, methodology longform, about page. Anything that asks the reader to *settle in*. The warm tone reads as considered, editorial, calm. Pair with navy text and pink accents.

**When to use `--ax-white`:** Default for marketing surfaces — home, overview pages, forms, application flows. Conversion-oriented.

**Mixing rule:** A page picks one surface family (cool or warm) and stays there. Sections within a page can shift to a darker variant (`--ax-off-white` for inset blocks on a white page; `--ax-paper-deep` for inset blocks on paper). Never mix `--ax-paper` and `--ax-off-white` on the same surface — the temperature break is jarring.

### 3.3 Pastel washes

Used sparingly for category-coded cards (pricing, process steps).

| Token | Hex |
|---|---|
| `--ax-cyan-light` | `#C8F9FE` |
| `--ax-pink-light` | `#FCE3F1` |
| `--ax-purple-light` | `#F1E5FF` |

### 3.4 Slate text scale

| Token | Hex | Role |
|---|---|---|
| `--ax-slate-dark` | `#334155` | Subheadings, secondary text |
| `--ax-slate-medium` | `#475569` | Body text |
| `--ax-slate-light` | `#64748B` | Captions, supporting |
| `--ax-border` | `#E2E8F0` | Default border / divider |
| `--ax-border-strong` | `#CBD5E1` | Form fields, muted on-dark text |
| `--ax-surface-2` | `#F1F5F9` | Secondary cool surface |
| `--ax-deep-blue` | `#0C4A6E` | Dark blue panels — sparingly |

### 3.5 Semantic aliases (paint to role)

Components should reference semantic aliases, not brand tokens directly. This keeps theming portable.

```css
/* Foreground */
--fg-1: var(--ax-navy);          /* Primary text */
--fg-2: var(--ax-slate-dark);    /* Secondary text */
--fg-3: var(--ax-slate-medium);  /* Body */
--fg-4: var(--ax-slate-light);   /* Captions */
--fg-on-dark: var(--ax-white);
--fg-muted-on-dark: var(--ax-border-strong);

/* Background */
--bg-1: var(--ax-white);
--bg-2: var(--ax-off-white);
--bg-3: var(--ax-surface-2);
--bg-paper: var(--ax-paper);
--bg-paper-deep: var(--ax-paper-deep);
--bg-dark: var(--ax-navy);
--bg-darker: var(--ax-navy-deep);

/* Action */
--action-primary: var(--ax-cyan);    /* The "go" colour */
--action-accent:  var(--ax-pink);    /* Signature CTA / emphasis */
```

### 3.6 Accessibility — verified pairings

Pairings tested at WCAG AA. ✅ passes for normal-size body (4.5:1). 🅻 passes only for large text or non-text content (3:1). ❌ fails both.

Recomputed on 2026-11-21 from the token hex values in `tokens.css` (WCAG relative-luminance formula). The earlier table had several wrong rows, most importantly cyan on white, which was listed ✅ 4.8 and is 3.89. Never sample by eye; recompute from the hex values.

| Foreground | On `--ax-white` | On `--ax-paper` | On `--ax-navy` | On `--ax-navy-deep` |
|---|---|---|---|---|
| `--ax-navy` | ✅ 14.2 | ✅ 13.4 | — | — |
| `--ax-slate-dark` | ✅ 10.4 | ✅ 9.8 | — | — |
| `--ax-slate-medium` | ✅ 7.6 | ✅ 7.1 | — | — |
| `--ax-slate-light` | ✅ 4.76 | 🅻 4.48 | — | — |
| `--ax-pink` | 🅻 3.8 | 🅻 3.6 | 🅻 3.8 | 🅻 4.47 |
| `--ax-cyan` | 🅻 3.9 | 🅻 3.7 | 🅻 3.7 | 🅻 4.3 |
| `--ax-blue` | 🅻 4.1 | 🅻 3.9 | 🅻 3.5 | 🅻 4.1 |
| `--ax-amber` | ❌ 2.0 | ❌ 1.8 | ✅ 7.3 | ✅ 8.6 |
| `--ax-amber-text` | ✅ 5.7 | ✅ 5.4 | ❌ 2.5 | ❌ 2.9 |
| `--ax-purple` | ✅ 5.9 | ✅ 5.5 | ❌ 2.4 | ❌ 2.9 |
| `--ax-green` | ❌ 2.5 | ❌ 2.3 | ✅ 5.7 | ✅ 6.8 |
| `--ax-white` | — | — | ✅ 14.2 | ✅ 16.9 |

`--ax-amber-text` on the 14% amber tint (`--surface-amber-subtle` over white) is 5.2:1.

**Rules:**

- **Amber is never text on a light surface.** `--ax-amber` is 2.0:1 on white. For amber text on white, paper or the amber tint use `--ax-amber-text` (`#8A5E00`). Bright `--ax-amber` is fine as a fill, border or icon, and as text on navy (7.3:1). Enforced by `scripts/check.js` Check #11 (#229): `color: var(--ax-amber)` and the `text-amber` utility fail the build.
- **Pink for emphasis, not body text.** On white/paper, pink is for short headlines, CTAs, and chips — never paragraph-length copy. Use navy for body, pink for the moment that needs to land.
- **Cyan, pink, blue and green fail AA as small text on light surfaces** (see the table). Cyan is today's link colour and the site's `.ax-kicker`/eyebrow colour, so small cyan text on white does not meet AA. Decision and fix are tracked in #230; until it lands, do not add new small cyan, pink or green text on white.
- **Captions on paper:** `--ax-slate-light` is just under AA (4.48). Use `--ax-slate-medium` for captions on `--ax-paper`.
- **Links:** `--ax-cyan` on light surfaces, `--ax-pink` on dark. Both are 🅻 in the table; the text-safe shades are the open decision in #230.
- **Focus ring:** A 3px cyan ring at `rgba(8, 138, 191, 0.4)` — verified against all surfaces.

### 3.7 Resolved colour decisions

| Issue | Resolution |
|---|---|
| Two purples (`#882DE7` vs `#7C3AED`) | `#882DE7` canonical. Replace `#7C3AED` everywhere. |
| Two ambers (`#FEA700` vs `#D97706`) | `#FEA700` canonical. Replace `#D97706` everywhere. |
| Rogue `#FFFF00` in Albany deck | Remove. Use `--ax-amber`. |
| Amber used as small text on light surfaces (1.96:1) | `--ax-amber-text` (`#8A5E00`) for text; `--ax-amber` for fills, borders, icons and text on navy. Added 2026-11-21 (#229), enforced by Check #11. |
| Off-brand `#2E75B6`, `#2C3E50`, `#1E2A3A` in Word docs | Replace with `--ax-cyan`, `--ax-slate-dark`, `--ax-navy-deep` on next revision. |

---

## 4. Typography

### 4.1 Strategy — zero-install everywhere

The system optimises **reliability over distinctiveness**. AX work travels across web, slides, documents, phones, and other people's machines. The typeface system is designed so no surface ever fails to render because a font isn't installed.

Three faces, each chosen because it will *always* be there:

| Role | Typeface | Where it lives |
|---|---|---|
| **Display headlines** (web) | **Figtree** | Google Fonts CDN. Falls back to the system stack if blocked. |
| **Body & UI** (web) | **System stack** | San Francisco on Mac/iOS, Segoe UI on Windows, Roboto on Android. Never loads, always native. |
| **PowerPoint + Word** | **Arial** | Pre-installed on every OS, ever. |

The brand's distinctiveness lives in **colour, layout, the pink X, and the brand graphics** — not in the typeface. This is the right trade.

### 4.2 Web

```css
--font-system:
  -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue",
  Arial, "Liberation Sans", sans-serif;

--font-body:    var(--font-system);
--font-display: "Figtree", var(--font-system);
--font-deck:    Arial, "Helvetica Neue", sans-serif;
--font-mono:    ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
```

Figtree is loaded once via `@import` inside `tokens.css` — no separate `<link>` needed.

**Figtree weights used:** 500, 600, 700, 900. The 900 weight is reserved for the boldest display moments (hero, section openers). 700 for standard headlines. 600/500 for sub-headings.

### 4.3 PowerPoint

Arial throughout. Set at the `.potx` theme level so existing decks pick it up automatically.

| Context | Size |
|---|---|
| Hero / title (display) | 44–54pt |
| Slide title | 32–36pt |
| Section subheading | 28–32pt |
| Primary body | 18–24pt |
| Secondary body | 16–18pt |
| Caption / supporting | 10–12pt |
| Footnote / label | 9–10pt |

Display headlines on slides use **Bold + tracking −2%** (PowerPoint Character Spacing) to echo the web's punchy feel.

### 4.4 Word

Arial throughout. The Word master template (`AX_Document_Template.dotx`) has these styles pre-configured.

| Role | Size | Weight | Colour |
|---|---|---|---|
| Document title | 20pt | Bold | `--ax-navy` |
| Heading 1 | 18pt | Bold | `--ax-navy` |
| Heading 2 | 14pt | Bold | `--ax-slate-dark` |
| Heading 3 | 12pt | Bold | `--ax-slate-medium` |
| Body | 11pt | Regular | `--ax-slate-medium` |
| Caption / label | 9pt | Regular | `--ax-slate-light` |

### 4.5 Web type scale

Tailwind-compatible rem scale (1rem = 16px).

| Token | Size | Use |
|---|---|---|
| `--text-xs` | 12px | Caption, label, eyebrow |
| `--text-sm` | 14px | Supporting, mono inline |
| `--text-base` | 16px | Body default |
| `--text-lg` | 18px | Body emphasis, lead paragraphs |
| `--text-xl` | 20px | H5, sub-headings |
| `--text-2xl` | 24px | H4, card titles |
| `--text-3xl` | 30px | H3 |
| `--text-4xl` | 36px | H2 |
| `--text-5xl` | 48px | H1 |
| `--text-6xl` | 60px | Display hero |

### 4.6 Display style — `.ax-display`

The signature AX big-type treatment.

```css
.ax-display {
  font-family: var(--font-display);
  font-weight: 700;             /* 900 for the hero moment */
  line-height: 1.0;
  letter-spacing: -0.05em;       /* tight */
  font-size: clamp(2rem, 4vw + 1rem, 3.75rem);
  text-wrap: balance;
}
```

Tight tracking, weight 700, fluid sizing. Used for hero / section openers / process cards. **One per page maximum** — display moments lose meaning when repeated.

### 4.7 Kicker / eyebrow

The small uppercase label that sits above a headline.

```css
.ax-kicker {
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--action-primary);  /* cyan by default */
}
```

Use sparingly — every section doesn't need a kicker. Reserve for moments where the headline benefits from context.

### 4.8 Body text — defaults

- Body: `--font-system`, 16px, `--ax-slate-medium`, line-height 1.6
- `text-wrap: pretty` on paragraphs by default
- `text-wrap: balance` on headings by default
- Maximum line length: ~70 characters for body, ~50 for display

---

## 5. Spacing & layout

### 5.1 Spacing scale

Tailwind-compatible 4px-based scale.

| Token | Size | Common use |
|---|---|---|
| `--space-1` | 4px | Icon-to-label, tight grouping |
| `--space-2` | 8px | Within-component gaps |
| `--space-3` | 12px | Default chip padding |
| `--space-4` | 16px | Default paragraph margin |
| `--space-5` | 20px | Card padding (small) |
| `--space-6` | 24px | Card padding (default) |
| `--space-8` | 32px | Section internal padding |
| `--space-10` | 40px | — |
| `--space-12` | 48px | Major block spacing |
| `--space-16` | 64px | Section spacing (compact) |
| `--space-20` | 80px | Section spacing (default) |
| `--space-24` | 96px | Section spacing (generous) |
| `--space-32` | 128px | Page-level breaks |

### 5.2 Radii

| Token | Size | Use |
|---|---|---|
| `--radius-sm` | 6px | Small inputs, tight buttons |
| `--radius-md` | 8px | Default buttons |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Feature cards |
| `--radius-2xl` | 24px | Hero cards, process panels |
| `--radius-full` | 9999px | Pills, avatars |

### 5.3 Shadows

Soft, brand-neutral, additive.

```css
--shadow-sm:           0 1px 2px 0 rgba(0,0,0,0.05);
--shadow-md:           0 4px 6px -1px rgba(0,0,0,0.10),
                       0 2px 4px -1px rgba(0,0,0,0.06);
--shadow-lg:           0 10px 15px -3px rgba(0,0,0,0.10),
                       0 4px 6px -2px rgba(0,0,0,0.05);
--shadow-card-hover:   0 4px 8px rgba(0,0,0,0.04),
                       0 12px 24px rgba(0,0,0,0.08);
--shadow-button-hover: 0 4px 12px rgba(0,0,0,0.15);
--shadow-on-navy:      0 12px 30px rgba(13,27,63,0.18);
```

### 5.4 Web grid & containers

The site uses a max-width container at 1280px with consistent side padding. Common widths:

| Token | Max width | Use |
|---|---|---|
| `--container-tight` | 720px | Article body, longform reading |
| `--container-default` | 1200px | Standard marketing sections |
| `--container-wide` | 1440px | Full-bleed-feel sections |
| `--container-full` | 100% | Hero / image-led sections |

**Side padding** (responsive): 24px on mobile, 32px on tablet, 32–48px on desktop.

### 5.5 Vertical rhythm

Sections separate by `--space-20` (80px) by default. Compact sections use `--space-16` (64px), generous sections (heroes, closing CTAs) use `--space-24` (96px) or `--space-32` (128px).

Within a section, content stacks at `--space-6` (24px) by default, `--space-8` (32px) for emphasis, `--space-12` (48px) for sub-section breaks.

---

## 6. Motion

### 6.1 Principles

- **Motion exists to inform, not decorate.** Every animation should clarify state, reveal content, or signal direction.
- **Quiet by default.** The site shouldn't move when it doesn't need to. No parallax-for-its-own-sake.
- **Fast for interactions, slower for reveals.** Hover/focus = 150–200ms. Scroll reveal = 400–600ms. Page transition = 300ms.
- **Honour `prefers-reduced-motion`.** Implemented in `tokens.css`.

### 6.2 Durations & easings

```css
--ease-out:    cubic-bezier(0.25, 0.1, 0.25, 1);   /* default */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

--dur-fast: 150ms;   /* hover state, focus */
--dur-base: 200ms;   /* button press, small state change */
--dur-slow: 300ms;   /* modal entry, page-level state */
--dur-page: 600ms;   /* scroll reveal, large block entry */
```

### 6.3 Patterns

- **Hover lift:** `transform: translateY(-2px)` + `--shadow-card-hover`, 200ms ease-out.
- **Fade-up on scroll:** `opacity 0 → 1`, `translateY(20px → 0)`, 600ms ease-out, triggered at 80% viewport.
- **Underline expand on links:** width 0 → 100%, 200ms ease-out, left-anchored.
- **Pink X bullet on appear:** scale 0 → 1, 300ms ease-out, used on list items entering view.

### 6.4 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
}
```

---

## 7. Iconography

### 7.1 Three asset families

| Family | What it is | When to use |
|---|---|---|
| **Brand graphics** | 47 PNGs, 258×258, transparent. Abstract, geometric, flat. | Concepts, frameworks, metaphors. Section openers. Decorative anchors that aren't UI. |
| **Brand icons (Pink / Purple / Yellow)** | 3 colour variants. Larger, expressive. | Process steps, category markers, callouts. |
| **System icons** | Open-source set (Lucide / Phosphor). Stroke-based, monochrome. | UI affordances — buttons, form fields, status, nav. |

### 7.2 When to use each

- **A UI affordance** (close, expand, link out, info, error) → system icon.
- **A concept that's part of the content** (a step in a process, a brand framework) → brand graphic or brand icon.
- **A decorative moment** (section opener, page break) → brand graphic.
- **The pink X as a punctuation mark** → use it. Sparingly. As section dividers, end-of-article marks, list bullets in hero moments.

### 7.3 System icons — spec

- **Library:** Lucide (16px, 20px, 24px, 32px sizes).
- **Stroke weight:** 1.5px (default).
- **Colour:** `currentColor` — inherits from text. Never standalone colours.
- **Pairing with text:** 8px gap, vertically aligned to text baseline.

### 7.4 Brand graphic rules

- Used at native size (258×258) or scaled in 2× increments.
- Transparent background — they overlay any surface.
- One brand graphic per section maximum.
- Position deliberately — corner anchors, between content blocks. Never centred-and-floating.

### 7.5 Known gaps

- Brand graphics 8, 11, 15, 33, 38 are missing from the library.
- No monochrome / navy icon variant for use on light backgrounds.
- No system-icon documentation existed before v2 — defined here for the first time.

---

## 8. Photography & imagery

### 8.1 Stance

Photography earns its place by doing work that type and brand graphics can't — humanising the founders, showing real engagement settings, anchoring case studies. **Stock photography is banned.** Real photos of real moments only.

### 8.2 Treatment (provisional — to be refined when production photos land)

- **Aspect ratios:** 16:9 for hero, 3:4 for portraits, 1:1 for tiles.
- **Crop:** Tight. Faces fill the frame. Settings show context, not décor.
- **Colour:** Natural. No heavy grading, no duotone (the brand graphics carry the colour).
- **Treatment on placement:** Subtle navy tint over portraits on dark sections (10% opacity) to integrate with the brand palette.

### 8.3 Use cases

- Founder portraits — about page, home About snippet, VSL "Founders speak" block, footer credit.
- Engagement photography — methodology page, case study heroes, talks & events.
- Studio / workshop photography — VSL hero alternative when video isn't ready.

### 8.4 Pending

The photo library is in production. Final guidelines (Section 8.2) will be tightened once the actual photos exist. Until then: navy + brand graphics + Figtree-as-photo are the substitute aesthetic.

---

## 9. Component primitives

The atomic UI units. Every component in the library (Build Plan §08) composes from these.

### 9.1 Buttons

**Variants:** Primary · Accent · Outline · Ghost · Link

**Sizes:** sm (32px), md (40px, default), lg (48px)

**States:** Default · Hover · Focus · Active · Disabled · Loading

```
Primary:   bg navy        | fg white       | hover: bg navy-deep + shadow
Accent:    bg pink        | fg white       | hover: bg pink (darker -8%) + shadow
Outline:   bg transparent | border navy    | hover: bg navy 6% tint
Ghost:     bg transparent | fg navy        | hover: bg navy 4% tint
Link:      bg none        | fg cyan        | hover: fg pink + underline
```

**Focus state:** Always shows the `--focus-ring`. Never removed for aesthetics.
**Loading state:** Inline spinner replacing icon (or prepended). Button width locked to prevent layout shift.
**Disabled:** 50% opacity, `cursor: not-allowed`. Never use disabled as a "soft no" — be explicit about why.

### 9.2 Form inputs

**Variants:** Text · Textarea · Select · Checkbox · Radio · Toggle

**States:** Default · Focus · Filled · Error · Disabled · Read-only

```
Default:  bg white  | border ax-border         | text navy
Focus:    bg white  | border ax-cyan           | + focus-ring
Error:    bg white  | border ax-error          | + helper text in ax-error
Disabled: bg surface-2 | border ax-border      | text slate-light | cursor not-allowed
```

**Label position:** Always above the input. Never placeholder-as-label (accessibility failure).
**Helper / error text:** Below input, 14px, slate-medium (default) or error red.
**Required indicator:** `*` in pink after the label.

### 9.3 Chips / tags / pills

**Variants:** Filter chip · Status pill · Kicker chip · Tag

```
Filter chip (interactive):
  default:  bg surface-2 | text slate-dark | hover: bg surface-2 +shade
  selected: bg navy      | text white

Status pill:
  bg color-light variant | text color-base | small, padded 4×10

Kicker chip:
  bg cyan 10%      | text cyan | 11px | uppercase 0.08em tracking | rounded-full

Tag:
  bg transparent | text slate-medium | border ax-border | hover: bg surface-2
```

### 9.4 Links

- Inline links: `--ax-cyan`, underline on hover from-left.
- Standalone links ("Read more →"): `--ax-cyan`, no underline, arrow translates 2px on hover.
- Footer links: `--ax-slate-light` on navy, hover to white.

### 9.5 Focus management

- All interactive elements have a visible `:focus-visible` style.
- Focus ring: `0 0 0 3px rgba(8,138,191,0.4)` + border-radius matching the element.
- Skip-to-content link on every page, visible on focus.

---

## 10. Voice

### 10.1 Principles

- **Direct.** Say it once, clearly. No preamble.
- **Credible.** Practitioner voice, not consultant voice. Avoid jargon.
- **Challenging.** Make the audience feel something — seen, slightly uncomfortable, then clear.
- **Human.** Warm but not soft. Not corporate. Not agency-casual.

### 10.2 Writing rules

- Short sentences. Active voice.
- **No buzzwords.** Banned: "leverage", "ecosystem", "unlock potential", "transformative journey", "synergies", "best-in-class", "world-class", "thought leader", "step-change", "value-add", "north star" (used non-literally), "low-hanging fruit".
- **No hedging.** Banned: "might", "could potentially", "it could be argued", "in some sense".
- Numbers and specifics beat generalities. "20 years of tier-one consulting" beats "extensive experience".
- First person ("we") is fine and preferred for the consultancy's voice. "We build capability, not dependency."
- Lists aid scanning, not replace thinking. Every bullet should stand alone.
- **Headers tell, don't label.** "What makes us different" > "Differentiators".

### 10.3 Slide / page copy rules

- Slide titles are statements or provocations, not labels.
- Avoid full sentences ending in full stops on slides — unless a quote or key statement.
- One idea per slide. Resist the urge to add.
- The narrative is in the speaker notes, not crammed onto the slide.

### 10.4 Tone by surface

| Surface | Tone |
|---|---|
| Marketing pages | Confident, plain, structured. Help the visitor decide. |
| Offering pages | Honest, specific, no oversell. Disqualify clearly. |
| VSL pages | Direct, conversational, conversion-engineered. Single ask. |
| Articles | Voice-led — your voice (or whoever's bylined). Opinion welcome. |
| Case studies | Outcomes-first. Numbers. Quote the client. |
| About | Founders' voice. Personal. Why this, why us. |
| Forms / UI | Helpful, brief, no surprise. Tell the user what happens next. |
| Errors / 404 | A little wit. Never blame the user. |

---

## 11. Conventions

### 11.1 Slide layout (PowerPoint)

- **Canvas:** 33.87 × 19.05 cm (13.33 × 7.5 in), 16:9.
- **Default body bg:** `--ax-off-white` (`#F8FAFC`) or `--ax-white`.
- **Default section/title bg:** `--ax-navy` or `--ax-navy-deep`.
- **Logo:** Lower-right, every slide, 24×24mm, white variant on dark / colour variant on light.
- **Slide numbers:** Lower-right corner, `[n]`, 9pt Arial, `--ax-slate-light`.
- **Date/client on title:** `[Programme] | [Client] | [DD.MM.YY]`, lower band, Arial 11pt.

### 11.2 Document layout (Word)

Header block in `AX_Document_Template.dotx`:

```
ACCELERATOR-X
[Document Title]
v[number] · [DD Month YYYY] · [Client / CONFIDENTIAL]
```

`ACCELERATOR-X` is Arial Bold 20pt navy with a 1pt pink bottom border (`--ax-pink`).

Metadata table at the top of client-facing docs:

| Field | Value |
|---|---|
| Prepared for | [Client name] |
| Prepared by | Accelerator-X: Toby Henry & Andrew Carroll |
| Date | [DD Month YYYY] |
| Version | [e.g. v7] |
| Status | [e.g. CONFIDENTIAL — not for external distribution] |

### 11.3 Open Graph / social cards

Every published content piece (article, podcast, video, case study) gets an OG card auto-generated from a template.

**Spec:**

- Dimensions: 1200×630.
- Background: `--ax-navy` with a single brand graphic in the lower-right, 30% opacity.
- Title: Figtree 700, 64px, white, top-left, max 3 lines.
- Kicker above title: type (Article · Podcast · Video · Case Study), uppercase, 18px, `--ax-pink`.
- Brand mark: White AX logo, lower-left, 40px tall.
- Author / date: bottom-left, 16px, `--ax-border-strong`.

Template lives at `templates/og-card.html` — rendered by the build step from frontmatter.

### 11.4 Email signature

```
[Name] · [Role]
Accelerator-X
[email] · [phone]
accelerator-x.ai

[Optional 1-line current-focus, italic]
```

Set in Arial 11pt. Name and "Accelerator-X" in `--ax-navy`. Rest in `--ax-slate-medium`. The terminal X in "Accelerator-X" in `--ax-pink` (`<span style="color:#E93F8E">X</span>`).

### 11.5 Naming conventions

| What | Pattern | Example |
|---|---|---|
| URLs | kebab-case | `/what-we-do/company-enablement` |
| Markdown content files | kebab-case + format suffix in frontmatter | `phase-0-the-honest-bit.md` |
| Components (React) | PascalCase | `OfferingCard`, `CTABand` |
| CSS tokens | `--ax-{family}-{role}` | `--ax-cyan`, `--ax-paper-deep` |
| Semantic aliases | `--{role}-{level}` | `--fg-1`, `--bg-paper`, `--action-primary` |
| Analytics events | snake_case, intent-led | `offering_apply_clicked`, `vsl_section_in_view` |
| Programme slugs | kebab-case, cohort identifier | `leadership-cohort-miami-2026-08` |
| Image assets | descriptive kebab-case | `toby-portrait-engaged.jpg`, `graphic-04-pink.png` |

---

## 12. Asset library

### 12.1 Where things live

```
/design-system/brand-assets/
  logos/
    SVG/
      AcceleratorX.svg              ← wordmark, full colour, 748×127
      AcceleratorX-white.svg        ← wordmark, white, for dark bg
    PNG/
      AcceleratorX-wordmark.png     ← wordmark PNG, 1125×195
      AcceleratorX-icon.png         ← circular icon mark, 362×362
    JPG/                            ← carry over from v1.3 if needed
    PDF/                            ← carry over from v1.3 if needed
  graphics/
    Graphic01.png … Graphic47.png   (258×258, transparent)
  icons/
    Pink/        (PNG, brand icons)
    Purple/
    Yellow/
    Navy/                           ← gap, monochrome for light bg
  fonts/
    (Figtree loaded from Google Fonts; Arial pre-installed)
  photos/                           ← in production, to land soon
```

### 12.2 Templates

```
/templates/
  AX_Presentation_Template.potx   ← migrating to Arial-only theme
  AX_Document_Template.dotx       ← live, Arial throughout
  og-card.html                    ← to build (§11.3)
  email-signature.html            ← to build (§11.4)
```

### 12.3 Known gaps

| Asset | Priority | Owner |
|---|---|---|
| Logo wordmark SVG (both variants) | — | ✅ Present |
| Logo wordmark PNG | — | ✅ Present (1125×195) |
| Icon mark PNG | — | ✅ Present (362×362) |
| Logo wordmark PNG @ 2000px | Low | Useful for hero use; existing 1125px covers most cases |
| Photo library | High | Toby, in flight |
| Brand graphics 8, 11, 15, 33, 38 | Medium | Designer |
| Monochrome navy icon set | Medium | Designer |
| `.potx` Arial-only theme update | High | Migration in progress |
| OG card template | Medium | Build alongside content pipeline |
| Email signature HTML | Low | 30 min job |

---

## 13. Migration from v1.3

### 13.1 What's superseded

| v1.3 element | v2 status |
|---|---|
| Aptos as PPT body font | **Removed.** Arial is canonical (was already decided 16/05). |
| Display = "Play" font | **Removed.** Use Arial in decks, Figtree on web. |
| Newsreader serif (wireframe Direction B) | **Removed from canonical.** Wireframes will be re-typeset in Figtree. |
| Geist body font (wireframes) | **Removed.** System stack is canonical. |
| `--c-bg`, `--c-fg`, `--c-accent` (wireframes) | **Removed.** Use `--ax-*` tokens and semantic aliases. |
| Direction A / C / D variants | **Removed.** Direction B alone, applied through v2's tokens. |
| Open colour decisions (purple, amber variants) | **Resolved.** See §3.7. |
| Photography guidelines absent | **Provisional spec added** (§8), final on photo arrival. |

### 13.2 What's retained

- Brand palette (all of it).
- Figtree + System + Arial type strategy.
- Spacing, radii, shadow, motion tokens from `colors_and_type.css`.
- Voice principles from v1.3 §9 — unchanged.
- Slide / Word conventions.
- Asset library structure.

### 13.3 What's new

- **`--ax-paper` warm surface** for editorial / longform.
- **Component primitive specs** with state coverage (§9).
- **Accessibility-verified colour pairings** (§3.6).
- **Iconography rules** for the three asset families (§7).
- **Motion principles** (§6).
- **OG / social cards** + **email signature** templates (§11.3, §11.4).
- **Naming conventions** (§11.5).
- **Section on photography** awaiting the photos themselves (§8).

### 13.4 Application order

When migrating existing surfaces:

1. **Tokens first.** Drop `tokens.css` in, replace any hand-rolled colour/spacing with token references.
2. **Type next.** Swap Newsreader/Geist for Figtree/System.
3. **Surfaces.** Decide cool (white/off-white) or warm (paper) per page.
4. **Components.** Refactor against the primitive specs (§9).
5. **Final pass.** Voice review, accessibility audit, asset placement.

---

*v2.0 · 16 May 2026 · This is a living document. Versioned in repo. PRs welcome.*
