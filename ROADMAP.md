# Accelerator X Development Roadmap

_This is a living document. It connects our high-level business strategy with daily execution.
It operates on a "Now, Next, Later" horizon to maintain momentum without administrative drag._

_Last updated: 2026-10-15 (cohort application form added to Post-Launch Polish, #172). Previous: 2026-08-21 (reconciliation pass from the [2026-08-21 architecture review](docs/tech-architecture/architecture-review-2026-08-21.md): the v2 Cutover shipped 2026-07-14; stale NOW items below marked done or reframed to post-launch reality. The repo now lives at `acc-x/accelerator-x-website`.)_

---

## The Strategy (The "Why")

**Objective:** Accelerate Accelerator X from a live marketing site into an active growth engine.
**The Goal:** Attract, qualify, and convert the "Tuesday morning leader" — senior decision-makers
tired of hype and ready for fundamental AI transformation — driving growth across our three-layer
business model (Enablement, Strategic Access, Implementation).
_The customer-facing expression of the offer is now the "Two Doors" model — canonical in `docs/business-context/offer-canon.md`._
**The Approach:** "Slow is smooth, smooth is fast." Compounding, authority-building content and
transparent, anti-agency positioning.

---

## 🟢 NOW (Active Sprint)

**Status Key:** `[ ]` To Do · `[-]` In Flight · `[x]` Done

### Site Rebuild — v2 (primary track)

- [x] **Phase 2 — Component library** — all 22 components built and gate-verified ✅
  - [x] Wave A — Primitives (TypeScale, Buttons, FormInputs, Chips)
  - [x] Wave B — Global Chrome (Nav, Footer, NewsletterCTA, PageHero, CTABand)
  - [x] Wave C — Content Blocks (all 13 components: LogoStrip → DecisionTree)
  - [x] Wave D — Interactive: QuizCTA · ScarcityCard · CohortList · ApplyForm — gate passed ✅
- [x] **Phase 3 — Page Assembly** — all pages assembled ✅ (`/what-we-do`, `/how-we-work`, `/about`, `/contact`; homepage v2 inline sections done in prior session)
- [x] **Phase 4 — Content pipeline** — articles migrated to Build Plan §10 data model; `format` + `published` + `read_time`; `renderArticleTile()` + tag-based hub filter ✅
- [x] **Phase 5 — Analytics** — PostHog conversion instrumentation shipped cookieless, ingestion confirmed in prod (B9, [#74](https://github.com/acc-x/accelerator-x-website/issues/74), 2026-06-27)
- [x] **Offer Canon + site derivation** ([#57](https://github.com/acc-x/accelerator-x-website/issues/57), closed 2026-06-14): `{{offering:…}}` token engine, **Two Doors** restored, four offering pages reconciled + tokenised, **Check #10** drift-guard, `/faq/` hub + FAQPage JSON-LD.

### Post-Launch Polish (site is live — real visitors landing now)

- [-] **Cohort application form** ([#172](https://github.com/acc-x/accelerator-x-website/issues/172)): shipped to production 2026-10-15 (PR #181). Cohort applicants apply on the cohort page and land in Airtable Coaching Enrollments, not Accounts; general apply form signposts to it (#177). **Remaining:** Slack channel + Netlify env vars (#174, Andy), one live submission check, then close #175/#176.

- [-] **P0 → hygiene: Indexation** ([#81](https://github.com/acc-x/accelerator-x-website/issues/81)) — technical half shipped 2026-08-05; **the 2026-08-21 review re-tested live search: the site now ranks #1 for its own name**, so the old "invisible until GSC" framing is stale. Remaining: Andy verifies GSC (~10 min) for coverage/query data — worth doing, no longer an emergency.
- [x] **P1: Cohort surfaces honesty fix, decided and shipped 2026-08-22 (#108)** — Andy's calls: `cohort.html` 301-redirected to the canonical page and deleted; `/programmes/leadership-cohort/` noindexed pending its remaining GO-LIVE-CHECKLIST §12 items; the canonical intake date switched to undated phrasing ("dates on application") ahead of the 2026-09-01 falsity deadline; the unapproved £16,000/Mark story removed everywhere it appeared (not just the deleted page). **Still open, deliberately untouched:** `/programmes/leadership-cohort/`'s off-canon £2,950 price and unmaintained "4 seats remaining" count — noindexing only contained the exposure, it didn't resolve §12.
- [x] **P1: Navigation structure overhaul** — shipped ([#33](https://github.com/andy-carroll/accelerator-x-website/issues/33), 2026-06-13): reusable `Nav.html` component (single source of truth), About added to nav, mobile drawer verified at 375px across all pages. (`aria-current` carried to #49's per-page variable mechanism.)
- [x] **Share panel** — SVG icons (LinkedIn + X) + "Share" heading — fixed in prior session
- [ ] **Hero imagery** — swap interim stills for final production photos; update alt text in
      `content/data/hero-media.config.json`. Run `npm run process:hero-images && npm run build`.
- [x] **Brevo email infra** — `mail.accelerator-x.ai` subdomain authenticated (SPF/DKIM);
      sender `newsletter@mail.accelerator-x.ai` / Accelerator-X Team — 2026-03-21
- [x] **Brevo welcome email** — automation live on list #9; trigger: contact added to list — 2026-03-21
- [x] **insights-subscribe form** — confirmed: all 4 submissions were Andy's own tests. No real contacts lost.
- [x] **Newsletter forms bypass Netlify Forms** — both forms now POST direct to Brevo via
      `netlify/functions/newsletter-subscribe.js`. 100/month limit no longer applies. — 2026-03-21
- [ ] **Lighthouse targets** — ≥95 mobile / ≥98 desktop. Capture HTML reports to
      `docs/analytics/`. Fix any blocking issues before driving paid traffic.
- [x] **Homepage architecture refactor** — canonical homepage shell + assembler contract now live.
      `_templates/homepage.html` is the authored shell, `scripts/build-homepage.js` assembles the
      generated homepage, and major static sections now live in dedicated fragments
      (`homepage-about`, `homepage-apply`, `homepage-who`, `homepage-testimonials`, `homepage-trust`).
      Remaining decision is whether further decomposition is worthwhile, or whether shared footer/nav
      ownership is the next higher-value architecture task.

### Autonomous AI Agent Fleet (strategic priority)

- [x] **Session protocol hardening (Phase 1)** — added profile-driven session lifecycle policy
      (`.session-protocol.json`), safe-by-default session-end modes (plan/dry-run/write),
      explicit write confirmation gates, branch policy checks, scoped staging, and updated
      protocol operator docs (`.claude/rules/session.md`, `CLAUDE.md`, `README.md`).
- [x] **Shared agent skills sync scaffold** — added canonical skills profile pointer
      (`.agent-skills-profile.json`), sync utility (`scripts/skills-sync.js`), npm scripts
      (`skills:sync`, `skills:sync:force`), and operations runbook
      (`docs/agent-skills-shared-ops.md`).
- [x] **Session protocol layering + review gate (Phase 2)** — decided in
      [#82](https://github.com/andy-carroll/accelerator-x-website/issues/82) (2026-07-06): the
      portable `ax-skill-ops` skills carry the cross-repo practice; the native scripts stay as
      this repo's deterministic enforcement layer. `session-end:write` now blocks without a
      recorded independent fresh-eyes review outcome (`## Review` in session-notes.md).
- [ ] **Design agent permission + capability framework** — define what agents can do
      autonomously vs. what requires human approval. Document in `docs/agent-fleet.md`.
- [ ] **Introduce first autonomous agent** — scoped to a specific, safe, repeatable task
      (e.g. content publishing, lead enrichment, or session-end hygiene). Use Claude Agent SDK
      with worktree isolation. Migrate git policy to feature branches at this point (see
      `CLAUDE.md` Decisions — git workflow).
- [ ] **Agent capacity planning** — identify the 3–5 highest-leverage tasks where autonomous
      agents would 10x throughput without introducing risk.

---

## 🟡 NEXT (Scoped, not yet started)

- [ ] **Newsletter broadcast template** — design Brevo email template (logo, typography,
      CTA block) for the weekly dispatch
- [ ] **Behavior analytics rollout (PostHog)** — staged session replay + funnel diagnostics
      → `docs/posthog-behavior-insights-prd.md`
- [ ] **Talks & Events** — now a defined offering in the Offer Canon (Keynote / Leadership Offsite / Hackathon, **price-on-application, inquiry-led**); `/talks-events/` exists — re-elevate + populate in Phase 5.
- [x] ~~**Workshop sales path** (£4k entry-point)~~ — **superseded by the Offer Canon:** the standalone workshop is retired; the entry point is now the Open Cohort (from £3,500) / Phase 0 (from £5k). Path-to-purchase folds into Phase 5.
- [ ] **World-class landing page architecture** — execute `docs/world-class-landing-pages-thesis.md`:
      Clarity Engine, diagnostic architecture, journey-based navigation, pricing psychology
      framework for £4k–£200k offerings, evidence-based video strategy.
      Navigation architecture spec now in `docs/navigation-architecture-thesis.md`.
- [ ] **LinkedIn Post Inspector — "No author found"** — investigate further after cache clears.
      JSON-LD is correct and validates in Google Rich Results Test. Low urgency.

---

## 🟤 DEFERRED (Tech Debt)

- [ ] Split `styles.css` (1800+ lines) into logical partials — typography, components, layout, utilities
- [ ] Shared layout ownership cleanup — resolve footer/navigation single-source-of-truth across homepage,
      Insights, and other templates now that homepage shell/fragment architecture is in place
- [x] Extract hub filter script (inline in `_templates/index.html`) → `assets/js/hub-filter.js` — 2026-03-22
- [x] Add automated tests for Netlify functions — `lead-capture` (which replaced `submission-created`) + `newsletter-subscribe` now have a dedicated incident-derived `node:test` suite wired into CI, grown further by the 2026-08-21 hardening batch (full suite: 44 cases)

### Session protocol hardening backlog (deferred, trigger-based)

- [ ] Add profile JSON schema validation and fail-fast diagnostics for malformed protocol configs
- [ ] Add end-to-end protocol test matrix (mode toggles, staged-path policy, branch policy edge cases)
- [ ] Add explicit CI status-check verification step before optional push path in team mode
- [ ] Add issue severity conventions in `CLAUDE.md` (`[blocking]`, `[non-blocking]`) with lint/check enforcement
- [ ] Add scripted `solo` ↔ `team` mode switch helper (single command wrapper)

**Activation triggers:** second collaborator joins, protocol incident occurs, or release cadence increases
enough that manual protocol overhead becomes measurable.

---

## 🔵 LATER (Strategic Backlog)

- [ ] Multi-channel content syndication — automated LinkedIn/X asset generation from Hub articles
- [ ] Client "Enablement" Portal (Layer 1 scalable product)
- [ ] Remotion programmatic video ads infrastructure
- [ ] Legal hardening — privacy policy + terms rewritten for `Accelerator X Ltd`
      (company no. `16974247`)
- [ ] Cookie consent banner (required before running paid ads)
- [ ] Accessibility audit (keyboard nav, focus states, screen reader pass)
- [ ] A/B testing infrastructure

---

## 🏆 Done

- [x] Site live at `https://accelerator-x.ai` — 2026-03-17
- [x] Google Search Console property verified — 2026-03-21
- [x] `sitemap.xml` + `robots.txt` generated and deployed
- [x] Page title expanded for SEO
- [x] Article JSON-LD (`Article` schema) on all 6 articles
- [x] `og:url`, `article:author`, `article:published_time` on all articles
- [x] LinkedIn author URLs in `authors.json`
- [x] OG excerpt validator in build pipeline
- [x] Hero pill badges — "Boardroom clarity" + "Hands-on support"
- [x] LinkedIn company URL corrected → `linkedin.com/company/accelerator-x-uk/`
- [x] Homepage JSON-LD price corrected (8-week cycle £12k)
- [x] Netlify Functions — form → Brevo list #9 + Slack `#website-leads`
- [x] PostHog product analytics wired to production
- [x] Hero Media Library System — config-driven cycling, responsive, lazy-load
- [x] Testimonials generated from JSON at build time
- [x] Content Hub (`/insights`) — Markdown → static HTML pipeline
- [x] Design system established (`docs/design-system.md`)
- [x] Image pipeline (`scripts/img-process.sh` + `scripts/img-audit.sh`)
- [x] AI instruction architecture (consolidated 2026-06-20 onto `CLAUDE.md` + `.claude/rules/`)
- [x] Direct-to-main git policy formalised; DoD now in `.claude/rules/standards.md`
- [x] Three-layer automated enforcement: `scripts/check.js` (8 checks) + `.githooks/pre-commit` (committed) + GitHub Actions CI — 2026-03-22
- [x] `.env.example` — all 5 required env vars documented — 2026-03-22
- [x] CSS design token drift check (check 7) + HTML validation check (check 8) — 2026-03-22
- [x] Philosophy + self-classifying "We never" rules ("We move fast by not making messes") — now in `.claude/rules/standards.md` — 2026-03-22
- [x] Repo made public — no secrets in codebase; credentials in Netlify env vars — 2026-03-22
- [x] GitHub branch protection on `main` — 3 required status checks (Build, Standards, CHANGELOG) — 2026-03-22
- [x] `llms.txt` + AI agent Easter eggs (index.html, robots.txt, AGENTS.md) — 2026-03-22

<!-- Session 20260322-211525 logged -->

<!-- Session 20260322-234000 logged -->

<!-- Session 20260322-235352 logged -->

<!-- Session 20260329-180314 logged -->

<!-- SESSION_PROTOCOL:START -->
- Session ID: 20261015-120103
- Updated: 2026-10-15T12:01:06.821Z
- Mode: write
<!-- SESSION_PROTOCOL:END -->
