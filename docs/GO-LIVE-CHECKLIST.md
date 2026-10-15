# Go-Live Checklist — accelerator-x.ai v2

> **Purpose:** Forensic audit before switching `main` to the v2 rebuild.
> Work through every section. Nothing ships with an open `[ ]` in a Blocking row.
>
> **Maintained continuously** — any agent or session that introduces a placeholder, dummy value,
> unverified copy, or unresolved decision MUST add an entry here before closing.
> See `.claude/rules/session.md §Step 0` and `CLAUDE.md` for the enforcement rule.
>
> **Status:** `[ ]` Not done · `[-]` In progress · `[x]` Done · `[~]` Deferred/accepted risk
> **Blocking** = must be resolved before cutover.
>
> **Tracking (2026-06-07):** This checklist is the source of truth for line-item detail.
> Work is now tracked as GitHub Issues under the **["v2 Cutover" milestone](https://github.com/andy-carroll/accelerator-x-website/milestone/1)** —
> 30 issues split `founder-input` (Andy/Toby supply/decide) vs `build` (engineering), with `blocking` marking the critical path.
> Each issue links back to the relevant section here. Close issues as line-items complete.

---

## 0 · Prerequisite: Airtable fields

These must exist in the Airtable prospects table before ANY form submission goes live.

| Field | Type | Blocking? | Status |
|---|---|---|---|
| `Consent Given` | Checkbox | **Yes** | `[x]` created 2026-06-08 (#32) |
| `Consent Timestamp` | Single line text | **Yes** | `[x]` created 2026-06-08 (#32) |

---

## 1 · Content accuracy

### 1a — Founder bios (homepage + /about)

Both cards live in `_templates/homepage-about.html`. Every line must be verified by the named founder before launch.

> **2026-06-08 (#48):** earlier AI-inferred employers were FABRICATED and have been removed. Real orgs are now founder-confirmed.
> **2026-06-13 (#48):** founder rulings landed — bios rewritten (Andy: 18 years as a product manager and leader; Toby: two decades across tier-one consultancies, startups and scale-ups; "built and sold businesses" dropped). Orgs-only track records confirmed fine to ship.

**Toby Henry**
- `[ ]` Job title: "Co-founder · Strategy & Consulting" — correct?
- `[x]` Bio rewritten 2026-06-13 per founder ruling: two decades across tier-one consultancies, startups and scale-ups, building businesses; "built and sold" claim dropped.
- `[x]` Track record orgs corrected to real: **Alpha, Capco, 10x Banking** (was Capgemini/NHS/WPP/"two exits" — fabricated).
- `[x]` Founder ruling 2026-06-13: orgs-only is fine — no titles/roles needed.
- `[ ]` LinkedIn URL: `https://www.linkedin.com/in/tobyhenry/` — correct handle?

**Andy Carroll**
- `[ ]` Job title: "Co-founder · Product & AI" — correct?
- `[x]` Bio rewritten 2026-06-13 per founder ruling: "Eighteen years as a product manager and leader…" ("Capital One / three Series B" fabrication previously removed).
- `[x]` Track record orgs corrected to real: **BCG Digital Ventures, Allica Bank, Equals Money Group** (was Capital One/Pegasus/"two exits"/"B.Eng" — fabricated).
- `[x]` Founder ruling 2026-06-13: orgs-only is fine — no titles/roles needed.
- `[ ]` LinkedIn URL: `https://linkedin.com/in/andycarroll` — correct handle?

### 1b — LogoStrip ("Operators who built at")

Component: `_templates/components/LogoStrip.html`

> Framed as founder pedigree (where we built), NOT a client logo strip.
> **2026-06-08 (#48):** previous list (Capgemini, WPP, Capital One, NHS, Pegasus Group) was FABRICATED — replaced with real founder pedigree.

- `[x]` List corrected to real orgs: BCG Digital Ventures, Capco, 10x Banking, Allica Bank, Equals Money Group, Alpha.
- `[ ]` Final visual review with both founders before launch (order, which orgs to feature).

### 1c — Client testimonials

**File:** `_templates/homepage-testimonials.html`

> **2026-06-08 (#48):** the three named people + companies + roles are **founder-confirmed REAL** (Alastair Constance / Mercury Global; Mark Bennett / W R Bennett Group — our first client; David Carry / Track Record Coaching). Andy indicated the quotes are approved.
> **RESOLVED 2026-06-13 (#48):** Andy confirmed all three quote wordings are the clients' own and fully approved.

- `[x]` Names, companies, and roles confirmed real with founders.
- `[x]` **RESOLVED 2026-06-13:** Andy confirmed all three quote wordings are the clients' own and fully approved.
- `[ ]` Written approval on file to use each named quote publicly.

### 1d — ProofRow quote

Component: `_templates/components/ProofRow.html`

> **RESOLVED 2026-06-13 (#48):** placeholder quote + fabricated attribution ("CEO, £60M healthcare group") replaced with a real founder-supplied quote — Charlotte Steedman, CEO, Conductor.
> Case studies link is commented out until `/case-studies/` page is live — restore it then.

- `[x]` Replaced 2026-06-13 with real founder-supplied quote — Charlotte Steedman, CEO, Conductor (also used on /what-we-do/leadership-cohort/ proof section).
- `[x]` Attribution: named (Charlotte Steedman, CEO, Conductor).
- `[ ]` Written approval on file for the Charlotte Steedman quote (tracked in #55).
- `[ ]` Restore `<a href="/case-studies/" ...>Read the case studies</a>` when `/case-studies/` is published

### 1e — Pricing and commercial copy

> **UPDATE 2026-06-14 ([#57](https://github.com/andy-carroll/accelerator-x-website/issues/57)):** All pricing now **locked** in the Offer Canon §5 + `offerings.json`: 1:1 Exec AI Fast Track Coaching from £10k · Leadership Team AI Activation base £15k (≤6) +£2k/head · Open Cohort £3,500/place · Phase 0 £5k · cycle £20k — **all +VAT**; standalone £2k workshop **retired**; **no published ROI multiple**. The £4k/£12k/£2k figures in the rows below are stale — use the Canon. Applying to the built pages = Phase 5 of #57.
>
> **✅ BUILT 2026-06-14 (Phase 5):** applied to the built pages and **enforced by Check #10**. Every price on the offer surfaces (home, `/what-we-do/`, 4 offering pages, `/how-we-work/`, Talks) now renders from `offerings.json` via tokens — no literals. Homepage JSON-LD `OfferCatalog` rewritten from the fabricated workshop (£4k) + "8-Week Cycle" (£12k) to the five real offerings with **no prices**. Items below superseded; founder sign-off on the locked numbers still pending (§11).

- `[x]` JSON-LD in `index.html`: stale £4,000/£12,000 fabricated offers **removed** → real offerings, no prices (2026-06-14)
- `[x]` Hero risk-note "Phase 0 from £5,000 · 2 weeks" — now token-driven from Canon (£5k locked); founder sign-off pending §11
- `[ ]` Hero chip: "Now taking on new clients · Q3 2026" — confirm this is accurate at launch date
- `[x]` Process timeline "Phase 1 from £20,000" — now token-driven from Canon (£20k locked); founder sign-off pending §11
- `[ ]` ApplyForm SLA: "Average response time: 2 business days" — accurate?
- `[ ]` CTABand: "Real reply within a week" — accurate SLA?
- `[ ]` Confirm no `priceRange` in JSON-LD remains the right decision (noted in CLAUDE.md)

### 1f — CTA destination / contact page decision

> **Resolved (2026-05-17):** `/contact/` page exists. CTABand routes to `/contact/`.

- `[x]` **Decision:** `/contact/` page created — CTABand `href` updated to `/contact/`
- `[x]` Sitemap updated — `/contact/` included at priority 0.8
- `[x]` Superseded 2026-06-13: nav IA ruling — Contact via the nav CTA (already wired); About added to nav instead (#33)

### 1h — Inner page content requiring founder review

Placeholder and unverified copy introduced in Phase 3 page assembly (2026-05-17).

**`/about/` — Origin story**
- `[x]` Origin story replaced with founder-approved v1 copy (Andy, 2026-06-14) — corrected the AI-timeline error + softened the "only ever us" framing, aligned to offer-canon §6.5. No longer placeholder/blocking. Tighten post-launch with 2–3 concrete named AI builds per founder ([#24](https://github.com/andy-carroll/accelerator-x-website/issues/24)).
- `[ ]` "Two operators. One partnership." heading — intentional?

**`/how-we-work/` — Section copy**
- `[ ]` Principles section (4 items: "Founder-led, always" / "All three, or none" / "We want you to outgrow us" / "Week one earns its keep") — confirm exact wording with founders
- `[ ]` Approach cards (4 cards: "Diagnose first" / "Embedded, not remote" / "Ship, don't strategise" / "Transfer capability") — confirm exact wording
- `[ ]` Engagement phases — Phase 0/1/2…n/Advisory descriptions — confirm details (esp. pricing/duration if any)
- `[ ]` Contrast table ("We never…" / "We always…") — confirm every item is accurate and intentional
- `[x]` **Mark Bennett pull-quote** — resolved 2026-06-13: the page carried a *paraphrased variant* of Mark's approved homepage quote; replaced with a verbatim excerpt of the approved wording. Attribution (CEO, W R Bennett Group) founder-confirmed.

**`/contact/` — Contact details**
- `[ ]` Confirm `toby@accelerator-x.ai` is the correct public email for Toby
- `[ ]` Confirm `andy@accelerator-x.ai` is the correct public email for Andy
- `[ ]` LinkedIn URLs in contact cards match §1a above

**`/what-we-do/` — Offering detail links**
- `[x]` Resolved 2026-06-14 (Phase 5): `OfferingTable`/`DecisionTree` deleted; `/what-we-do/` now uses the `TwoDoors` component linking only the four live offering pages (all built) + Talks. No 404-bound links; Check #10 enforces no links to retired offerings.

**`/what-we-do/` — OfferingTable content misalignment (BLOCKING)**

> **UPDATE 2026-06-14 ([#57](https://github.com/andy-carroll/accelerator-x-website/issues/57)):** RESOLVED at the source. The canonical offer set, names and prices now live in `docs/business-context/offer-canon.md` + `content/data/offerings.json` (the "Two Doors" model). #26 was the symptom; the build reconciliation (kill the OfferingTable's old rows + "8-Week Transformation Cycle", derive from `offerings.json`) is **Phase 5 of #57**. The line-items below are superseded by the Canon.

> **✅ RESOLVED 2026-06-14 (Phase 5 build):** the entire OfferingTable was deleted and the page rebuilt on the `TwoDoors` spine. All items below are done.

- `[x]` "8-Week Transformation Cycle" — **deleted** (the component carrying it was removed; Check #10 forbids the string returning).
- `[x]` Row 01 "Leadership Activation · half-day · £2,000" — **deleted**; the real Leadership Team AI Activation page now derives its name/price from `offerings.json`.
- `[x]` `/what-we-do/8-week-cycle/` dead link — **deleted** (Check #10 forbids it returning).
- `[x]` "FOUR OFFERINGS / Four ways" — **reframed** to "Two doors in. Pick your starting point." across hero, meta and WebPage JSON-LD.
- `[x]` Offering rows now derive from `offerings.json` (names/prices/durations as tokens); the hand-built table is gone.

**`/what-we-do/leadership-cohort/` — Blocking items before launch**
- `[x]` **Cohort start date** — resolved 2026-07-11 (B3 walk, Andy): the hardcoded "12 Aug 2026" was a placeholder; real target is late July / early Aug 2026, exact date TBC. Softened to a target window ("Late July / Aug 2026" / "Next cohort, summer 2026"), then undated ("dates on application") once that window went false 2026-09-01 (#108). `[x]` **Firm date locked 2026-09-04 (Andy):** C3 starts week of 21 September 2026, £3,000/place — live on the canonical page and `offerings.json`.
- `[x]` **Places left** — resolved 2026-07-11 (B3 walk, Andy): the hardcoded "6 of 12" was an unmaintained scarcity claim (same failure mode as B1's retired hero chip); softened to "Limited places" (no count to babysit).
- `[x]` **Cohort number** — fixed 2026-07-11 (B3 walk, Andy): page said "Cohort 04" but the next paid intake is C3 (C0 was free, C1 done, C2 mid-flight, C3 next) — an overclaim of track record. Dropped the sequence number from public copy entirely (also future-proofs against the diversifying cohort structures — see note below).
- `[ ]` **Post-launch (parked 2026-07-11, Andy):** AX is diversifying beyond one cohort type — an advanced follow-on for C1/C2 completers, plus more structures to come. Deliberately parked for the v2 flip (not built; modelling a multi-cohort portfolio is real scope). Track under the cohort-funnel issue (#30).
- `[x]` ProofRow quote resolved 2026-06-13: unverified "It moved my Monday morning…" (CMO, B2B SaaS · Cohort 02) removed; replaced with real founder-supplied quote — Charlotte Steedman, CEO, Conductor. `[ ]` **Flagged 2026-07-11 (B3 walk):** the quote is real + generic ("working with the Accelerator X team") but sits on the cohort page; Charlotte wasn't a cohort participant, so ideally swap for a real cohort-participant quote when one lands (tracked with named-proof #55) — not blocking.
- `[x]` FAQ answers authored 2026-06-14 (Phase 5) — 6 real answers grounded in Canon §7 (already real before; no placeholders). FAQPage JSON-LD still **carried** (T6). Founder review of wording advisable, not blocking.

**`/what-we-do/leadership-activation/` — Blocking items before launch**
- `[x]` Proof section removed 2026-06-13 pending a real client quote — tracked in #55 (founder-input, high priority).
- `[x]` FAQ answers **authored 2026-06-14 (Phase 5)** — 6 real answers from Canon §7 (incl. per-head cost + Door-1-vs-exec-team distinction) + FAQPage JSON-LD. Founder review of wording advisable, not blocking.
- `[x]` Name/price reconciled 2026-06-14: "Leadership Team AI Activation", base £15k + £2k/head (max 12) — tokenised from `offerings.json`.

**`/what-we-do/senior-leader-acceleration/` — Blocking items before launch**
- `[x]` Proof section removed 2026-06-13 pending a real anonymised client quote — tracked in #55 (founder-input, high priority).
- `[x]` FAQ answers **authored 2026-06-14 (Phase 5)** — 6 real answers from Canon §7 (incl. the £10k-vs-£3,500 objection) + FAQPage JSON-LD. Founder review of wording advisable, not blocking.
- `[x]` Name/price reconciled 2026-06-14: "1:1 Exec AI Fast Track Coaching", 6wk / from £10k / 75-min — tokenised. Sidebar now reads "dedicated founder" (coach-naming concern moot).

**`/talks-events/` — Blocking items before launch**
- `[x]` Resolved 2026-06-14 (Phase 5): retired the events-calendar empty state; page is now inquiry-led with the three Canon formats (POA). No EventCard list / `Event` schema needed under the inquiry-led model.

**`/what-we-do/company-enablement/` — Blocking items before launch**
- `[x]` Phase 0 price (£5,000) — locked in Canon, tokenised from `offerings.json` 2026-06-14; founder sign-off on the locked numbers pending §11.
- `[x]` Phase 1+ price (£20,000) — locked in Canon, tokenised 2026-06-14; founder sign-off pending §11.
- `[x]` Proof section removed 2026-06-13 (quote slot had already been neutralised — the original was fabricated). Real quote + linked case study tracked in #55 (founder-input, high priority).
- `[x]` FAQ answers authored 2026-06-14 (Phase 5) — real answers grounded in Canon §7 (already real; no placeholders). FAQPage JSON-LD still **carried** (T6).
- `[x]` Right panel removed with the proof section 2026-06-13 — real case-study panel tracked in #55.

### 1g — General copy review

- `[ ]` Hero headline and subhead — still the right positioning?
- `[ ]` Problem section copy — accurate framing?
- `[ ]` Three differentiator cards — still accurate and intentional?
- `[ ]` Process section copy — 3-step description — accurate?
- `[ ]` FitCheck "Right fit if / Probably not for you if" lists — accurate and intentional?
- `[ ]` Inline code comments across all templates and components — does reading each file give a future agent full clarity without hunting in separate docs? (see `.claude/rules/standards.md`)

---

## 2 · Links

### 2a — Navigation

> **IA approved (Andy, 2026-06-13, #33):** What we do · How we work · **About** · Insights · Quiz → CTA "Apply to work with us" (→ `/contact/`). Contact via CTA only — no separate link. Fixes `/about/` being orphaned (linked from neither nav nor footer).

- `[x]` All nav links resolve to built pages or valid anchors — verified 2026-06-13 (#33)
- `[x]` "What we do" → `/what-we-do/` built ✅
- `[x]` "How we work" → `/how-we-work/` built ✅
- `[x]` "Insights" → `/insights/` — hub page built ✅
- `[ ]` "Quiz" → `quiz.accelerator-x.ai` live? — HTTP answers with a 302 but HTTPS couldn't be verified from the build sandbox (2026-06-13); confirm in a browser before launch
- `[x]` Logo → `/` — confirmed 2026-06-13
- `[x]` Nav CTA "Apply to work with us" → `/contact/` — confirmed 2026-06-13 in desktop bar + mobile drawer (`Nav.html`)
- `[x]` `/contact/` in nav — resolved by IA ruling 2026-06-13: Contact via CTA only; **About** added to nav instead (#33)
- `[x]` **About** → `/about/` added to desktop links + mobile drawer per approved IA — shipped 2026-06-13 (#33)
- `[x]` Mobile nav — verified at 375px (2026-06-13): drawer opens, shows all 5 links + CTA, links navigate, drawer closes
- `[ ]` `aria-current="page"` on active link — blocked on per-page variable mechanism, owned by #49

### 2b — Footer links

- `[ ]` All footer nav links resolve to built pages
- `[ ]` LinkedIn company page URL correct
- `[ ]` Privacy policy → `/privacy.html` exists and is current
- `[x]` Newsletter form in footer submits correctly — verified 2026-06-27 (B7): newsletter → Brevo list #9 confirmed after reactivating the Brevo key (see note below)

### 2c — CTAs throughout

- `[ ]` Hero "Apply to work with us" → `#apply` resolves on same page
- `[ ]` CTABand "Apply to work with us" → `/#apply` resolves from any inner page
- `[ ]` ProofRow case studies link commented out — restore when `/case-studies/` is live
- `[ ]` Andy's writing link → `/insights/` correct destination

### 2d — Legal / consent

- `[ ]` ApplyForm consent link → `/privacy.html` exists and is accurate
- `[ ]` Privacy policy mentions Airtable as data processor

---

## 3 · Forms end-to-end

Test each form with a real submission on the Netlify preview URL (not localhost).

### 3a — ApplyForm (`#apply-form`)

Target: `/.netlify/functions/lead-capture`

- `[x]` Submits without JS errors — verified 2026-06-27 (B7)
- `[x]` Success state displays correctly — verified (B7)
- `[x]` Honeypot invisible; not submitted — function checks `_honeypot` (B7)
- `[x]` All required fields block submission if empty — **B7's original check was incomplete**: it verified the server-side function guard + that `required` was present in the markup, but never an actual live-browser empty submission — which would have caught that `novalidate` + a missing `checkValidity()` call in `forms.js` made every `required` attribute decorative. Found 2026-07-14 (Andy), fixed + verified end-to-end in-browser (#88, see CHANGELOG): empty submit now blocks client-side with no request fired; a fully-completed submission still passes and submits correctly.
- `[x]` Consent checkbox required — cannot submit without it — `required` on the input (B7)
- `[x]` **Slack:** `#website-leads` notification fires — verified (B7, confirmed by Andy)
- `[ ]` **Email:** Brevo welcome automation triggers for new contact (not tested — ApplyForm writes to Airtable, not Brevo; this line applies to the newsletter path)
- _Note: ApplyForm → Airtable + Slack (not Brevo). Brevo is the **newsletter** path — verified separately above._

> ⚠️ **Brevo key finding (2026-06-27, B7):** the `BREVO_API_KEY` was found **deactivated** — newsletter signups were silently not reaching Brevo (the function fails-soft, so Slack still fired and users saw success). Reactivated + verified writing to list #9. **Pre-launch action:** scan Slack `#website-leads` for any newsletter signups received while the key was down and add those real subscribers to Brevo manually. **Hardening shipped 2026-07-04 (#78):** a distinct Slack alert now fires whenever a Brevo write fails or is skipped, so a dead key can't hide again.
>
> ✅ **Resolved 2026-07-13 (Andy):** the 2026-07-04 hardening E2E re-verification's test contact — `hardening-test-delete-me@accelerator-x.ai` — removed from Brevo list #9 via the Brevo UI (same pattern as the 2026-06-27 `b7-newsletter-test-delete@accelerator-x.ai` cleanup).

#### TEST CASE GNG-1 — Consent capture writes to Airtable (go/no-go)

> **Status:** ✅ **PASSED 2026-06-27** (B7/#72) — end-to-end verified on the preview: test application submitted, row landed in Prospects with `Consent Given=true` + ISO `Consent Timestamp`, Slack fired, test row deleted. Schema was in place 2026-06-08 ([#32](https://github.com/andy-carroll/accelerator-x-website/issues/32)). **Re-verified 2026-07-04** after the hardening batch (#78, escaping/size-guards/GNG-1 failure alert added to the function): re-ran the same test, row landed correctly with `Consent Given=true` + ISO timestamp, test row deleted from Airtable immediately.
> **Why this is go/no-go:** consent is a GDPR record. If the write silently drops, we are capturing leads without a defensible consent trail. A pass here is mandatory to go live.

**Setup**
- Prospects table `tblQzgVPzXL4cEQBp`, base `appZwa2e4VZk4ULDA` — fields `Consent Given` (checkbox), `Consent Timestamp` (single line text) exist.
- Use the Netlify preview URL, not localhost.

**Steps**
1. Open the preview ApplyForm, tick the consent checkbox, submit a real test record (note the timestamp).
2. Open the new Prospects record in Airtable.

**Pass criteria (all must hold)**
- `[ ]` `Consent Given` is checked (true).
- `[ ]` `Consent Timestamp` holds a valid ISO 8601 string matching the submission time (within a minute).
- `[x]` No fields silently dropped — `Source` shows "Accelerator X Website" (no hyphen — fixed 2026-07-14, see CHANGELOG; the hyphenated form was a live bug that failed every Airtable write) and the record is otherwise complete.
- `[ ]` Function logs (Netlify) show the Airtable insert returned 200, not an "unknown field name" error.

**Fail = NO-GO.** Most likely cause if it fails: a field name in [`netlify/functions/lead-capture.js`](netlify/functions/lead-capture.js) drifted from the Airtable field name. Reconcile names, redeploy preview, re-run.

_Cleanup: delete the test record after the run._

### 3b — Newsletter subscribe (footer + inline)

Target: `/.netlify/functions/newsletter-subscribe`

- `[ ]` Submits without errors
- `[ ]` Success state displays
- `[ ]` **Brevo:** contact added to list #9
- `[ ]` **Email:** welcome automation triggers

---

## 4 · Email flows

- `[ ]` Welcome email subject line, content, sender name are correct
- `[ ]` Sender is `newsletter@mail.accelerator-x.ai` / Accelerator X (not Accelerator Solutions)
- `[ ]` Unsubscribe link works
- `[ ]` All Brevo automations on list #9 reviewed — confirm each is intentional
- `[x]` **`info@accelerator-x.ai` (Google Group) resolved 2026-07-13.** Root cause confirmed: the Group's "Who can post" access setting had no checkmark for **External** — only Group Owners/Managers/Members could post, so every real external sender was silently rejected (Andy's earlier "it worked" test used an internal/member account, masking this). Fixed by Andy in Google Admin → Groups → `info@` → Access settings → Who can post → added External. Verified live: an external test send (personal Gmail) reached the group. **Follow-on found:** the domain had no SPF record at all (`dig`-verified gap), so Google's relay of that inbound mail to group members looked unauthenticated and the test message landed in spam. Fixed: added `v=spf1 include:_spf.google.com ~all` as a new TXT record at the apex via Netlify DNS (Netlify manages this zone, not Hostinger) — confirmed live via a global recursive DNS check (Cloudflare DoH). Andy also added a personal Gmail filter (`list:(info.accelerator-x.ai)` → never spam, labelled, marked important) as a mailbox-level backstop. **Still open:** Toby should mirror the same Gmail filter on his own mailbox (the filter is per-mailbox, not domain-wide) — not a blocker, just parity. Recommend a spot-check in a day or two once a few more real messages land to confirm none hit spam post-SPF.

---

## 5 · Analytics & instrumentation (PostHog)

> Gold standard: every meaningful user action is tracked. No guessing after launch.

### 5a — Setup

- `[ ]` PostHog JS snippet loaded on all pages (via `assets/js/analytics.js`)
- `[ ]` Correct PostHog project key (production, not dev/test)
- `[ ]` Cookie consent / GDPR approach agreed and implemented if required
- `[ ]` Session replay enabled (or explicitly disabled with reason)
- `[ ]` No PII captured in event properties

### 5b — Page views

- `[ ]` Pageview fires on every page load
- `[ ]` Page title and URL captured correctly
- `[ ]` UTM parameters captured on landing

### 5c — Conversion events (critical path)

- `[ ]` `apply_form_start` — fires when user first interacts with ApplyForm
- `[ ]` `apply_form_submit` — fires on successful form submission (not just button click)
- `[ ]` `apply_form_error` — fires on validation failure with error type
- `[ ]` `newsletter_subscribe` — fires on newsletter form success
- `[ ]` `cta_click` — fires on any primary CTA button with `{label, location}` properties

### 5d — Engagement events

- `[ ]` `section_viewed` — fires when each major page section enters viewport (hero, proof, apply, etc.)
- `[ ]` `quiz_cta_click` — fires when user clicks through to `quiz.accelerator-x.ai`
- `[ ]` `nav_open` — fires on mobile hamburger open
- `[ ]` `outbound_link` — fires on any external link click with `{url, label}`

### 5e — Funnels and dashboards

- `[ ]` Conversion funnel built in PostHog: landing → apply form start → submission
- `[ ]` Core dashboard created: pageviews, conversion rate, top traffic sources
- `[ ]` Slack or email alert configured for first real lead submission

---

## 6 · SEO & AEO (gold standard)

> AEO (Answer Engine Optimisation): structured so AI systems (ChatGPT, Perplexity, Claude)
> can accurately answer questions about Accelerator X from this site.

### 6a — Technical SEO

- `[ ]` `<title>` correct and ≤60 chars on every page
- `[ ]` `meta description` accurate, unique, and ≤160 chars on every page
- `[ ]` `<h1>` — exactly one per page, contains primary keyword
- `[ ]` Heading hierarchy logical (h1 → h2 → h3, no skips)
- `[x]` `canonical` URL set correctly on every page — closed 2026-08-05 (#81): `privacy.html`/`terms.html` were the only pages without one (added); insights index canonicalised `/insights/index.html` → `/insights/` to stop contradicting the sitemap; all other pages verified present + correct
- `[ ]` `robots.txt` — not blocking crawlers; correct disallow rules
- `[~]` `sitemap.xml` generated, accurate, and submitted to Google Search Console — generated + accurate as of 2026-08-05 (#81: 20 → 30 URLs, the five offering pages / coaching lane hub / `/faq/` / cohort funnel were missing; offering URLs now derive from `offerings.json`; `lastmod` git-honest). **GSC submission = Andy, founder access, still open — but no longer urgent: the 2026-08-21 review verified the site is indexed and ranks #1 for its own name in live search; GSC is now for coverage/query data, not indexation rescue**
- `[x]` `llms.txt` — content accurate and up to date (for AI crawlers) — rewritten for v2 2026-08-05 (#81/#43): was still describing the v1 single-programme site with a stale `andy@` contact and wrong LinkedIn URL
- `[ ]` No broken internal links (run a crawl tool on Netlify preview)
- `[ ]` Page speed: Lighthouse ≥95 mobile / ≥98 desktop (target from ROADMAP)
- `[ ]` Core Web Vitals: LCP, CLS, INP all green

### 6b — On-page SEO

- `[ ]` Primary keyword in h1, first paragraph, and meta description on homepage
- `[ ]` Every image has a descriptive, keyword-relevant `alt` attribute (no generic "image" values)
- `[ ]` Internal linking: key pages link to each other where contextually relevant
- `[ ]` Anchor text for internal links is descriptive (not "click here")
- `[ ]` No keyword stuffing — copy reads naturally

### 6c — Structured data (JSON-LD)

- `[x]` Organization schema: name, URL, logo, description, founders, sameAs (LinkedIn) — all accurate — enriched 2026-08-05 (#81): `sameAs` + Companies House record (16974247, verified live); founders' `Person` entities + LinkedIn `sameAs` via site tokens
- `[ ]` WebSite schema: correct
- `[ ]` ProfessionalService schema: serviceType, areaServed, pricing — all accurate and current
- `[ ]` WebPage schema on homepage — correct
- `[~]` FAQPage schema added to FAQ sections (when live) — AI systems extract Q&A pairs directly — FAQ hub + all four offering pages already carried it (B3/B5-verified); articles now auto-derive it from their question-led H2s at build time, 2026-08-05 (#43, 8 of 14 qualify — the 6 statement-H2 articles are the remaining editorial gap, tracked on #43)
- `[ ]` BreadcrumbList schema on inner pages
- `[ ]` Person schema for each founder (if /about page warrants it)
- `[ ]` Validate all schemas at schema.org validator and Google Rich Results Test

### 6d — Open Graph / social

- `[ ]` `og:image` exists at the declared path — correct size (1200×630px)
- `[ ]` `og:image:alt` present and descriptive
- `[ ]` All OG tags accurate on every page
- `[ ]` Twitter card tags correct
- `[x]` `insights/index.html` — add `og:image` + `twitter:card` (built via `build-hub.js`; minor shareability gap flagged in B8/#73, non-blocking) — done 2026-08-05 (#40), plus `og:url`, canonical fix, de-jargoned title, convention-length meta description, and an editorial intro paragraph (the page had almost no indexable prose)
- `[ ]` LinkedIn Post Inspector: no "No author found" errors (may need cache clear)

### 6e — AEO specific

- `[x]` `llms.txt` at root — comprehensive, structured, accurate — rewritten for v2 2026-08-05 (#81/#43): Two Doors + canonical offering names/links from `offerings.json`, guarantee (with the Talks & Events exception), founders + correct LinkedIn URLs, `info@`, company number, explicit brand-spelling note; no prices (each offering page carries current pricing)
- `[ ]` Key facts (who we are, what we do, pricing range, process) appear as clear prose in the body of the page — not only in metadata
- `[ ]` FAQ content uses natural question phrasing that matches how people ask AI assistants
- `[~]` Company name, founders' names, and service names consistent across all pages and structured data — site-side closed 2026-08-05 (#81: the two live "Accelerator-X" hyphenations fixed at source — article 006 footer, David Carry testimonial quote). **Still hyphenated at account level, Andy to fix: quiz subdomain `<title>` ("AI Readiness Assessment | Accelerator-X", separate deployment) and Brevo sender name ("Accelerator-X Team")**
- `[ ]` `<!-- FOR AI SYSTEMS -->` comment in homepage HTML is accurate (currently in index.html `<head>`)

---

## 7 · Technical / build

- `[ ]` **Hub filter — no transition on card show/hide.** Cards jump instantly when a pathway tile is clicked (`display: none/''`). Add a CSS opacity/visibility transition before go-live; the abrupt jump is jarring against the smooth-scroll behaviour already in place.
- `[ ]` **Company Enablement cycle-chain — mobile scroll affordance.** `.ax-cycle-chain` is an intentional `overflow-x:auto` scroller at 375px (Cycle 01→02→N→Advisory, `scrollWidth ~1036` in a ~327px track). Functional (no page overflow), but there's no visual cue it scrolls — consider a fade-edge / peek of the next item. Minor polish, flagged in the 2026-07-03 B2–B6 functional sweep.
- `[ ]` **Quiz link over HTTPS in a real browser (B5).** `/talks-events/` + contact quiz prompts point at `https://quiz.accelerator-x.ai` — link target is correct in markup; still wants an eyes-on real-browser HTTPS load check (couldn't be exercised in the headless functional sweep).
- `[~]` **Content pipeline — `excerpt` / `subtitle` split deferred.** Phase 4 uses a single `excerpt` field for both OG meta and tile display copy. Before the Claude draft skill goes live (Build Plan §10 Phase 3), decide whether to split into separate fields. The draft skill can generate both at zero extra cost; doing it earlier means manually rewriting copy for every article. Revisit at draft-skill build time, not before go-live.
- `[x]` **Dead redirect `/quiz/aireadiness` (502 → placeholder)** — removed 2026-07-04 (#78): the redirect blocks in `netlify.toml` shipped with a literal `YOUR_VERCEL_DEPLOYMENT_URL` placeholder that was never replaced. Nothing linked to it (B8/#73 crawl). Re-add per `docs/tech-architecture/dns-hosting.md` when a quiz surface is actually deployed behind a path proxy.
- `[ ]` `npm run build` passes — zero errors or warnings
- `[ ]` `npm run check` — all 8 checks green
- `[ ]` No unsubstituted `{{tokens}}` in built HTML
- `[ ]` No `console.error` on page load (check browser dev tools)
- `[ ]` All images load — no 404s in network tab
- `[ ]` Hero image slideshow cycles correctly
- `[ ]` Nav sticky + blur effect works on scroll
- `[ ]` Mobile hamburger nav opens and closes
- `[ ]` No horizontal scroll at 375px
- `[ ]` Reduced-motion media query respected (animations disabled)
- `[ ]` **Dead v1 CSS removed from `assets/css/styles.css`** — ~200 lines of orphaned rules left over from v1 inline sections: `.hero-shell`, `.hero-copy-block`, `.hero-media`, `.diff-card`, `.process-card`, `.problem-headline`, `.testimonials-section`, `.testimonial-card`, `.testimonial-stars`, `.testimonial-quote`, `.testimonial-name`, `.testimonial-role`, and related modifier/state selectors. Deferred until v2 go-live to avoid touching the live branch; remove in the same PR as cutover.

---

## 8 · Responsive / visual QA

- `[ ]` 375px mobile: hero, nav, FitCheck, FounderCards, ApplyForm, all sections
- `[ ]` 768px tablet: two-column layouts correct
- `[ ]` 1280px desktop: full layout correct
- `[ ]` Dark sections legible (ProofRow, Testimonials, ApplySection, CTABand)
- `[ ]` Founder portrait images load and crop correctly at all sizes
- `[ ]` Form inputs usable on mobile (no zoom-on-focus issues)

---

## 9 · Pages still to build before cutover

| Page | Blocking cutover? | Status |
|---|---|---|
| `/what-we-do/` | **Yes** — nav link | `[x]` Built ✅ |
| `/how-we-work/` | **Yes** — nav link | `[x]` Built ✅ |
| `/about/` | **Yes** — nav link | `[x]` Built ✅ (origin story = founder-approved v1, 2026-06-14; tighten later #24) |
| `/contact/` | **Yes** — CTABand destination | `[x]` Built ✅ |
| `/privacy.html` | **Yes** — consent link | `[ ]` (may exist in v1) |
| `/case-studies/` | No — ProofRow link commented out | `[ ]` |

---

## 10 · Pre-cutover deployment — DONE 2026-07-14 (B10, #75)

- `[x]` Netlify preview deploy built from `rebuild/v2` — confirmed live 2026-06-07, walked extensively B1–B6.
- `[x]` All Netlify env vars set in production: Airtable API key, Brevo API key, Slack webhook — verified directly via Netlify (all present for the `production` context).
- `[x]` `rebuild/v2` branch pushed to remote — 2026-05-19.
- `[x]` Old `main` tagged `v1-archive` before cutover — pushed, permanent rollback reference (`d3b0f69`).
- `[x]` Cutover plan agreed: merge `rebuild/v2` → `main` (fast-forward, chosen over a Netlify production-branch swap so `main` itself stays semantically correct going forward).
- `[x]` Post-cutover: verify all forms fire — **caught a real bug here**: Airtable writes were silently failing (`Source` field string mismatch). Found via a live production smoke test, root-caused, fixed, redeployed, reverified (`"airtable":"created"`). See CHANGELOG.
- `[~]` Post-cutover: PostHog events flowing correctly — script + project key confirmed correctly loading in production (unchanged from the already-verified B9 config); real-time dashboard ingestion not independently re-checked this session (no live PostHog API access in this session) — low risk given the script is byte-identical to what B9 already confirmed working, but worth a manual glance at the PostHog dashboard next time someone's in there.

---

## 11 · Owner sign-off

Before cutover, both founders sign off:

- `[x]` Andy — all Andy bio content accurate — confirmed across B1/B4's live content walks.
- `[x]` Toby — all Toby bio content accurate — confirmed across B1/B4; Andy explicitly confirmed "Toby is sorted" ahead of the B10 flip (2026-07-14).
- `[x]` Both — real testimonials reviewed and approved for public use — confirmed in B1 (LogoStrip, ProofRow quote).
- `[x]` Both — pricing copy intentional — extensively walked across B1/B2/B5 and the offer-canon governance process.
- `[x]` Both — full site walkthrough on mobile and desktop — cumulative across the six live B-ticket walks (each explicitly covered desktop + 375px); no single dedicated final pass beyond that.
- `[x]` Both — happy for site to be indexed and crawled on launch — technical default (`robots.txt: Allow: /`, `<meta name="robots" content="index, follow">`) unchanged from the already-live, already-indexed v1 site; not a new decision introduced at this cutover.

---

## 12 · /programmes/leadership-cohort funnel page

This page is a live conversion surface separate from the main site cutover.
It can go live independently once all blocking items below are resolved.
Source template: `_templates/programmes/leadership-cohort.html`

> **Contained 2026-08-22 (#108):** none of the blockers below were resolved,
> but exposure is now much lower — the page is `noindex, follow` (out of
> search circulation) and the unapproved £16,000/Mark story has been removed
> entirely (from this page, `PricingBlock.html`, and the deleted `cohort.html`)
> rather than left unapproved and live. The price (£2,950 vs £3,500 canon) and
> the "4 seats remaining" count were still wrong then; both were fixed 2026-10-09 (#164).
> Remaining format, ROI and guarantee wording is tracked in #165.

| Item | Blocking go-live? | Status |
|---|---|---|
| ~~Mark's exact quote — verbatim, approved for publication~~ | No | `[~]` **Moot 2026-08-22 (#108):** the quote/story was removed from the page entirely rather than approved — see #108's containment note above. |
| ~~Mark's consent to be named publicly as "Mark, Group CEO, W R Bennett Group"~~ | No | `[~]` **Moot 2026-08-22 (#108):** no longer referenced on the page. |
| ~~"£16,000 legal dispute" figure — confirmed accurate and approved for use in marketing~~ | No | `[~]` **Moot 2026-08-22 (#108):** figure removed, not approved. |
| H1 headline — confirmed by founders (current draft: "The AI bootcamp built for leaders who run real businesses.") | **Yes** | `[ ]` |
| Meta description — 155-char outcome-first copy written and confirmed | **Yes** | `[ ]` |
| ~~"4 seats remaining" — who owns this number and how/when it gets updated~~ | No | `[~]` **Moot 2026-10-09 (#164):** no seat count is stated anywhere; the page says "limited places" because cohort size is not guaranteed (#159). |
| FAQ answers (6 questions) — reviewed and approved by founders | **Yes** | `[ ]` |
| Andy + Toby portrait images confirmed OK at `/assets/images/andy-black-t-400.*` and `/assets/images/toby-green-shirt-400.*` | **Yes** | `[ ]` |
| Cohort start date — show specific date or keep "Next intake forming"? | **Yes** | `[ ]` |
| Footer decision — stripped footer (current) or full footer? | Yes | `[ ]` |
| JSON-LD Course schema — price inclusion (`"price": "3000"`, now from the single £3,000 price) confirmed intentional | No | `[ ]` |
| `robots: index, follow` — confirmed (not `noindex`; this page should be crawlable) | No | `[ ]` |
| Page title — confirm or replace draft: "Claude Bootcamp for Business Leaders \| 8-Week Cohort \| Accelerator X" | **Yes** | `[ ]` |

---

## 13 · Cohort application form (#172, shipped 2026-10-15)

On-page cohort application on `/what-we-do/leadership-cohort/` → `cohort-application` function → Airtable Coaching Enrollments + Slack. Live in production since PR #181; these items are what remains before it is fully verified.

| Item | Blocking? | Status |
|---|---|---|
| Airtable fields on Coaching Enrollments (Consent Given/Timestamp, Application AI Use/Confidence/Source, Created) | Yes | `[x]` 2026-10-15 (#173) |
| `#cohort-applications` channel + webhook; `SLACK_COHORT_WEBHOOK_URL` + `COHORT_PROGRAMME_RECORD_ID` set in Netlify | No (falls back to waitlist mode + `#website-leads`) | `[ ]` #174, Andy |
| One real production submission: Airtable row linked to C3, Slack ping with working record link; test row deleted | Yes | `[ ]` needs a human (the agent sandbox cannot reach the site) |
| No-JS submission verified on production (lands on `#cohort-applied`) | No | `[ ]` |
| "Cohort applications" Airtable view | No | `[ ]` manual (API cannot create views) |
| Toby's brochure "Apply now" repointed from `/contact/` to `/what-we-do/leadership-cohort/?utm_source=brochure#cohort-apply` | No | `[ ]` |
| Rate limiting on public functions | No (decided 2026-10-15) | `[~]` deferred to #123; trigger: first junk submission past the honeypot |

