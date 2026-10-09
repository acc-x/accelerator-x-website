# Page Spec: Leadership Cohort

**URL:** `/what-we-do/leadership-cohort/`
**Template:** `_templates/offerings/leadership-cohort.html`
**Output:** `what-we-do/leadership-cohort/index.html`
**Wireframe source:** "Leadership Cohort" — canonical coaching template (full detail)
**Status:** Ready to build — pending founder review of flagged items

---

## Build registration

Add to `scripts/build-inner-pages.js` PAGES array:

```javascript
{ template: '_templates/offerings/leadership-cohort.html', output: 'what-we-do/leadership-cohort/index.html' },
```

---

## SEO block

```html
<title>Leadership Cohort | Accelerator X</title>
<meta name="description" content="An eight-week founder-led cohort for senior leaders from non-competing companies. Four hours a week. One shipped artefact.">
<link rel="canonical" href="https://accelerator-x.ai/what-we-do/leadership-cohort/">
<meta property="og:title" content="Leadership Cohort | Accelerator X">
<meta property="og:description" content="An eight-week founder-led cohort for senior leaders from non-competing companies. Four hours a week. One shipped artefact.">
<meta property="og:url" content="https://accelerator-x.ai/what-we-do/leadership-cohort/">
<meta property="og:type" content="website">
```

JSON-LD type: `Service` — serviceType: "Leadership Cohort", provider: Accelerator X

---

## CSS to load (in addition to global styles)

```html
<link rel="stylesheet" href="/assets/css/components/PageHero.css">
<link rel="stylesheet" href="/assets/css/components/CTABand.css">
<link rel="stylesheet" href="/assets/css/components/FitCheck.css">
<link rel="stylesheet" href="/assets/css/components/FAQList.css">
<link rel="stylesheet" href="/assets/css/components/ProofRow.css">
<link rel="stylesheet" href="/assets/css/components/PlanLayers.css">
<link rel="stylesheet" href="/assets/css/components/DeliverablesGrid.css">
<link rel="stylesheet" href="/assets/css/components/ScarcityCard.css">
<link rel="stylesheet" href="/assets/css/components/InnerPages.css">
```

---

## Sections (in order)

### 1. Nav
```
{{component:Nav}}
```

---

### 2. Hero
Custom 2-column hero layout (not standard PageHero — sidebar investment card on right).

**Left column:**
- Breadcrumb: `What we do / Leadership Cohort`
- Chip: `Cohort · 8 weeks · limited places · senior leaders`
- H1: `Eight weeks of AI in a room of your peers.`
  - Wrap "your peers." in `<span class="ax-accent">` for pink accent
- Body copy: `A founder-led cohort for senior leaders who'd rather lead the AI conversation than be led by it. Non-competing companies. Four hours a week. Eight weeks. One shipped artefact.`

**Right column — sidebar investment card:**
- Header text: "Apply to join"
- Badge: `Cohort 04` — chip `--cyan` variant
- Spec table rows:
  - Duration: 8 weeks
  - Cadence: Weekly · 4hrs · Mondays
  - Format: In-person + Zoom hybrid
  - From: £3,500 per place
  - Starts: 12 Aug 2026
  - Places left: **6 of 12** — highlight in cyan
- CTA button (full-width, `.btn--accent .btn--lg`): `Apply to work with us →` → `/contact/`
- Sub-note: `Short pre-qualification form · we reply within a week · only good fits get a booking link.`

> **GO-LIVE FLAG:** Start date (12 Aug 2026) and places left (6 of 12) are placeholder — founders must confirm before launch.

---

### 3. Who is this for
Alt background section.

- H2: `A room of senior leaders, vetted to be non-competing.`
- 3-column card grid:

| # | Eyebrow (cyan) | H4 | Body |
|---|---|---|---|
| 1 | The peer mix | Different industries, no competitors. | No two cohort members from competing companies. Vetted at application. |
| 2 | The seniority bar | Director+ / function owner. | Real decision authority. AI is on your plate, not your team's. |
| 3 | The commitment | 4 hrs / week. 8 weeks. | Light pre-work. No certificate. A shipped artefact by week 8. |

---

### 4. The Plan
```
{{component:PlanLayers}}
```
3-column variant.

- Kicker chip: `The plan`
- H2: `Three phases. Eight weeks. One shipped artefact.`

| Phase | Label | Weeks | Bg | H4 | Body |
|---|---|---|---|---|---|
| 1 | 01 · PREP | Week 0 | default | Pre-cohort interview. | 1:1 with a founder. Context-gathering and cohort-fit confirmation. |
| 2 | 02 · SESSIONS | Weeks 1–8 | accent | Weekly working sessions. | DOTS applied to each leader's context. Peer accountability. Founder-led teaching, not associates. |
| 3 | 03 · EMBED | Weeks 6–8 | default | Ship + share. | Each leader ships a real artefact and presents it to the cohort. |

---

### 5. Deliverables
Alt background.
```
{{component:DeliverablesGrid}}
```
4-column variant.

- H2: `Four outcomes. None of them a certificate.`

| # | Title | Body |
|---|---|---|
| 01 | Personal AI operating model | How you actually use AI in your role — tested against your own context. |
| 02 | A shipped artefact | By week 8 you've built something real with AI in your own workflow. |
| 03 | A peer network | Fellow senior leaders, vetted non-competing, who you can text. |
| 04 | DOTS, turned inward | The framework we run with corporates, applied to your own work. |

---

### 6. FitCheck
```
{{component:FitCheck}}
```

- H2: `For leaders who'll lead the AI conversation. Not be led by it.`

**Right fit if you…**
- Run a function or business unit and own outcomes.
- Want to lead the AI conversation, not be led by it.
- Can commit 4 hours a week for 8 weeks.
- Are comfortable being challenged by peers.

**Probably not for you if you…**
- Are looking for technical training — there's no code in this room.
- Need a certificate more than capability.
- Can't make consistent time week-to-week.

---

### 7. Proof
```
{{component:ProofRow}}
```

- Pull-quote: `"It moved my Monday morning. I now run my leadership team meetings with AI in the loop, not as a topic on the agenda. Hard to overstate the shift."`
- Attribution: `CMO, B2B SaaS · Cohort 02 · Feb 2026`

> **GO-LIVE FLAG:** Confirm this is a real, approved quote — or replace with approved alternative before launch.

---

### 8. FAQ
```
{{component:FAQList}}
```

- H2: `The six questions cohort applicants ask.`
- Questions (answers to be written by founders):
  1. I don't have 4 hours a week.
  2. Will my company expense this?
  3. What if a competitor of mine applies?
  4. Can my whole team join?
  5. What if I miss a session?
  6. Is there a money-back guarantee?

> **GO-LIVE FLAG:** Answers to all 6 FAQs must be written by founders before launch.

---

### 9. Final CTA
Custom dark-background section (not standard CTABand — includes scarcity copy).

- Chip (`.chip--on-dark`): `Apply`
- H2: `August cohort. 6 places left.` — wrap "6 places left." in `<span class="ax-accent">`
- Body: `If you've read this far, you should apply. Worst case, we say no — and you've spent 5 minutes.`
- CTA button (`.btn--accent .btn--lg`): `Apply to work with us →` → `/contact/`
- Sub-note: `Short pre-qualification form · no calendars to book · we reply within a week.`

---

### 10. Footer
```
{{component:Footer}}
```

---

## Go-live checklist additions

- [ ] **BLOCKING** Cohort start date (12 Aug 2026) — confirm accuracy at launch
- [ ] **BLOCKING** Places left (6 of 12) — update to actual availability at launch
- [ ] **BLOCKING** ProofRow quote — confirm real + approved client quote
- [ ] **BLOCKING** FAQ answers — all 6 written by founders
