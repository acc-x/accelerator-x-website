# CLAUDE.md — Accelerator X Cockpit

> The single file an agent reads first. Keep it under one page — detail lives in the linked files.
> Standards (enforced): `.claude/rules/standards.md` · Session protocol: `.claude/rules/session.md` · History: `.claude/sessions/`
> **Go-live tracker:** GitHub ["v2 Cutover" milestone](https://github.com/andy-carroll/accelerator-x-website/milestone/1) · line-item detail: `docs/GO-LIVE-CHECKLIST.md`

---

## Project

**Site:** https://accelerator-x.ai — live, real visitors
**Stack:** Static HTML + compiled Tailwind (CLI → committed bundle, since 2026-07-04) + `npm run build` → Netlify (pre-built artefacts committed)
**Email:** Brevo list #9 | **Analytics:** PostHog | **Notifications:** Slack `#website-leads`
**Node:** v26.0.0 via `/opt/homebrew/bin/node` — run `export PATH="/opt/homebrew/bin:$PATH"` if npm isn't found.
**DNS/hosting reference:** `docs/tech-architecture/dns-hosting.md` — registrar, nameservers, full zone, SSL, email, quiz, incident log.

---

## Current State

**Active track:** `rebuild/v2` — full visual + structural rebuild from design handoff.
- Build plan: `docs/design_handoff_website_rebuild/README.md` · design system: `…/design-system/DESIGN.md` · wireframes: `…/wireframes/`
- Built through Phase 2 Wave D + Phase 3 page assembly (4 inner pages live: `/what-we-do`, `/how-we-work`, `/about`, `/contact`). Component-level detail in `CHANGELOG.md` + `.claude/sessions/`.

**Last session:** 2026-08-22 — Continuation of the same session recorded in `.claude/sessions/session-20260821-131750.md` (the 8-dimension review + 7-PR fix chain). This stretch covered: merging all 7 PRs (#109–#115) top-down with a re-verified fresh-eyes review catching one more issue mid-merge (see Review below); discovering and fixing that Netlify's GitHub connection had been silently dead since the org move — nothing had auto-deployed in 12 days — by relinking it in Netlify's UI (Andy) and verifying auto-deploy-on-merge genuinely restored on the next two merges; a small doc-pointer fix (#116); a corrected design for the "Wren/Ada/Marlow reporting on the website" idea after actually reading `ax-agent-hub`'s real fleet architecture instead of inventing generic automation — filed properly as ax-agent-hub#1814, with ax-agent-hub#1745 marked superseded (not deleted); and executing all four of Andy's #108 cohort-honesty decisions as PR #117 (merged, auto-deployed, verified live).

**Earlier (2026-08-09):** closed out a build-tooling investigation that had been open since 2026-08-05: `npm run build`'s CSS step was reported as "non-deterministic" (two consecutive builds from an identical clean checkout producing different bytes). Root cause was pipeline ordering, not the tool — `build:css`/`build:css-bundle` ran *before* the HTML-generation steps in `npm run build`, so Tailwind's content scan saw the previous run's HTML, not this run's; any class introduced only by generated (not source-template) markup could be silently missing from committed CSS until a later build happened to pick it up. Tested hard for genuine non-determinism first (7+ consecutive clean-checkout builds, byte-identical every time) before concluding the Tailwind CLI itself is deterministic — the drift was purely this ordering bug. Fixed by moving the CSS build steps to run last (verified safe: no earlier step reads the generated CSS); an independent fresh-eyes review caught and fixed one inaccurate claim in the first commit/CHANGELOG draft (that this commit rebuilt the CSS — it had already self-corrected via an intervening session's own build, a live example of the bug's own mechanic) before it landed. **Repo housekeeping in the same pass:** deleted the stray `claude/crazy-shirley-540e0d` branch (flagged safe-to-delete since 2026-08-05, its one commit already superseded by #81's redirects) and removed the now-merged scratch worktree/branch this fix was built in. `main` and `rebuild/v2` back in sync at the same commit, both pushed; no open worktrees or stray branches remain.

**Earlier (2026-08-05):** Four sessions' worth of work landed in one day — SEO indexation batch (#81/#40/#43, sitemap 20→30 URLs + FAQPage JSON-LD + `llms.txt` rewrite), the compute-economics blog series (`015`–`018`, ax-agent-hub #1003, backdated after a future-dates catch), the lead-magnet CTA fix (#94, the AI readiness scorecard had never actually been wired into article pages), and a NordVPN false-positive block on the quiz subdomain (report submitted, resolved by 2026-08-05 close). **Founder actions still open from #81: verify the domain in Google Search Console, submit `sitemap.xml`, request indexing (~10 min).** Full detail: `CHANGELOG.md` + `.claude/sessions/session-20260805-095458.md` + `session-20260805-205850.md`.

**Earlier (2026-07-21, cloud sessions):** Content batch #93 — 8 new insights articles + quality refresh of the 5 weak originals (closing a 4.5-month publishing gap) — and the canonical tracking plan doc (#92). Both landed via PRs; see CHANGELOG.

**Earlier (2026-07-14, early):** Post-flip scare resolved: what looked like a broken production site immediately after the B10 cutover was NordVPN's own Threat Protection browser extension false-flagging accelerator-x.ai as malicious — the same failure class as June's Sky Broadband Shield incident. Site was never actually broken; documented in the DNS/hosting incident log.

**Earlier (2026-07-13):** **B5 (#70) content-honesty walk closed — five of six B-tickets now done (B1–B5); only B6 remains before B10.** Walked Contact + FAQ + Talks & Events with Andy. Direct-contact email consolidated from two personal addresses to one shared `info@accelerator-x.ai` (Andy: cleaner than maintaining two role-labelled founder cards that wrongly implied a functional split — "we both look after most things"); Contact's founder cards simplified to name + LinkedIn only. Fixed the long-flagged false "No email required" quiz claim (#61, absorbed) — the assessment does require an email, now reads honestly about the on-screen + emailed-PDF report. Talks & Events dropped unmaintained audience-capacity numbers (2,000 / 10–40 / 40–200 people) from all three format cards, same failure mode as B1's retired scarcity chip. FAQ's ROI answer reworked to resolve an internal contradiction (asserted a 10x+/12-month floor, then disclaimed claiming unmeasured numbers, one sentence apart); an orphaned, unused `FAQList.html` component carrying a similar unverifiable claim was deleted. **Biggest find:** broadening a check on Contact's reply-time promise surfaced a 3-way sitewide inconsistency — "2 business days" (Contact), "within a week" (shared `CTABand` component on 6 pages + homepage + all four Door 2 offering pages, 9 further instances spanning already-closed B1/B3 scope), and Andy's confirmed-correct answer of "1 business day" — reconciled all 15 instances to match. Em-dash sweep + FAQ JSON-LD/on-page sync run across all three pages (18/18 → all 14 FAQ pairs verified matching programmatically); two pre-existing drift instances caught and fixed in passing. **`info@` Google Group fixed same-session:** root cause was the Group's "Who can post" setting excluding External senders (Andy's earlier test used an internal account, masking it) — fixed in Google Admin. Follow-on found and fixed: the domain had no SPF record at all, so Google's relay of external mail to the group looked unauthenticated and a test message landed in spam — added `v=spf1 include:_spf.google.com ~all` via Netlify DNS, confirmed live. Andy also added a personal Gmail filter as a mailbox-level backstop (Toby should mirror it — per-mailbox, not domain-wide, only remaining follow-up). **Independent review (mandatory gate) caught the founder-role fix had only partially landed** — same failure pattern as the 2026-07-09 close: Contact's role-label removal hadn't propagated to Homepage/About/`programmes/leadership-cohort.html`. Andy's call: remove everywhere — fixed all four pages, and found + deleted a second orphaned component (`FounderCard.html`) in the process. Review also caught the FAQ's ROI rewording had never been reconciled with `docs/business-context/offer-canon.md` (this repo's versioned source of truth for customer-facing claims) — canon bumped to **v0.6**, ROI framing and the founder-roles section (§6.5, now explicitly internal-context-only) both updated to match the live site, with a decision-log entry recording why. Full detail: `CHANGELOG.md` + `.claude/sessions/`.

**Earlier (2026-07-11):** **B3 (#68) and B4 (#69) content-honesty walks closed — four of six B-tickets now done (B1–B4); only B5 + B6 remain before B10.** Walked Door 2 (coaching hub + 3 offering pages) and How We Work + About with Andy. Biggest catch was on the cohort page: **"Cohort 04" was an overclaim** (next paid intake is really C3 — C0 was a free pilot, C1 done, C2 mid-flight), so the public sequence number was dropped entirely (also future-proofs against AX's diversifying cohort structures, which Andy confirmed are coming); the hardcoded "12 Aug 2026" became a "Late July / Aug 2026" target window (exact date TBC — a logged go-live task, not a blocker); and "6 of 12 places" was softened to "Limited places" (unmaintained scarcity count, same failure mode as B1's retired hero chip). Proof scan across all four Door 2 pages came back clean — no fabrication; the one live quote (Charlotte Steedman) is real, flagged only for eventual swap to a genuine cohort-participant quote (#55). `senior-leader-acceleration`'s "dedicated founder for six weeks" was **confirmed a keeper** by Andy (the 1:1 product genuinely is personal founder time — a true, durable differentiator, not the false blanket claim retired elsewhere). Em-dash sweep + FAQ JSON-LD/on-page sync done across all six pages (18 Q&A pairs verified matching). B4 surfaced that How We Work still frames the engagement around the company/Phase path only — coaching is nav-reachable but not signposted in-page; extending it is deliberately deferred as a careful post-launch fast-follow ([#86](https://github.com/andy-carroll/accelerator-x-website/issues/86), supersedes closed #63). Independent fresh-eyes review of the cumulative diff: approve-with-nits, 0 blocking, one comma-splice nit fixed inline. **New cohort structures parked** for post-launch (#30). Full detail: `CHANGELOG.md` + `.claude/sessions/`.

**Earlier (2026-07-09):** **B1 (#76) and B2 (#67) founder content-honesty walks closed — the first two of the six B-tickets gating B10.** Andy walked homepage + Door 1/Company Enablement content live in-session: bios, LogoStrip order, testimonials, ProofRow quote, hero copy all confirmed. Three real content decisions came out of it, not just typos — (1) the hero chip's unfalsifiable date-stamped scarcity claim ("Now taking on new clients · Q3 2026") replaced with an honest category label ("AI Enablement for Ambitious Leaders"); (2) "Founder-led, always" / "no associates, ever" retired site-wide as false (Andy: may hire juniors) and unscalable, reframed around **senior ownership and accountability, not headcount** — juniors framed as a genuine speed benefit, not something to hide; (3) the ApplyForm simplified — dropped a free-text "about your business" section (redundant with auto-research) and replaced "what does your business offer" with an optional problem field + a required service-fit chip group tied to the real offerings. The `/about/` "Our story" section was also rewritten for voice (Andy: reads "obviously-AI," too many em-dashes) with the message and length preserved, and both founder bios there strengthened with real track-record orgs the page had been missing. **This session's own close caught its own gap:** an independent fresh-eyes review of the cumulative diff found the senior-ownership reframe had only partially landed — `/faq/`, `leadership-cohort`, `leadership-activation`, and `leadership-ai-coaching` still carried the old blanket claim, live and contradicting the homepage. Fixed all four before closing (one instance, `senior-leader-acceleration`'s "dedicated founder" framing, deliberately left as a narrower, still-true product claim — flagged for Andy). Full detail: `CHANGELOG.md` + `.claude/sessions/`.

**Earlier (2026-07-06, pm):** **#82 closed: protocol reconciliation decided (layered keep) + fresh-eyes review gate shipped.** Verified the continuity fixes in anger first: the fresh brief surfaced full multi-section notes for three past sessions — the truncation fix works, retroactively too. Decided retire-vs-keep as **layered keep**, not the retire-the-scripts recommendation on record: the portable `ax-skill-ops` skills carry the cross-repo protocol *practice*; the native `session-start.js`/`session-end.js` stay as this repo's **deterministic enforcement layer** (branch policy, quality gates, staged-path allowlist, summary + review evidence — hard blocks an LLM-followed skill can't guarantee), per #50's own guardrail "repos hold parameters, skills hold practice". Ported the independent review gate as an **evidence check**: `session-end:write` now blocks unless `.claude/session-notes.md` records the review outcome under `## Review` (notes parsing moved to `session-protocol-utils.js`, 3 new test groups, template updated; a real `$`-in-multiline regex bug caught by the new tests). Handoff writing single-sourced to `session-end:write` — a skill-driven close must invoke the npm scripts, never hand-write a note. Layering documented in `.claude/rules/session.md` preamble + the config block below; #50's stale extraction line reconciled.

**Earlier (2026-07-06, am):** Session-protocol continuity fixed: portable-skill config block added (skills couldn't find this repo's handoff notes at all); the native brief's h2-collision truncation fixed both ends (`session-end.js` demotes embedded headings on write, `session-start.js` captures full sections, old logs included — 600 → 4,726 chars on the 2026-07-04 log); priorities-parsing placeholder bug fixed earlier (`a12fc70`). Preserved the 2026-07-04 architecture scorecard as `docs/tech-architecture/architecture-review-2026-07-04.md`; opened + scoped #82. Detail: `.claude/sessions/` + #82.

**Earlier (2026-07-04):** Two parts. (1) Closed B7/B8 gates (verified PASS 2026-06-27 but never formally closed); ran a full B1–B6 functional-half QA sweep (all pages, desktop+375px, all pass) and corrected CLAUDE.md's stale "critical path is founder content" narrative — #26 and all content sub-issues are closed, only the founder honesty-gate content walk remains before B10. (2) Ran a three-agent architecture review (scored 7.0/10, rescored ~8.0–8.2 post-fix — full scorecard + what's left to reach 8.5-9 in `docs/tech-architecture/architecture-review-2026-07-04.md`) and executed the P0/P1 fix batch autonomously (#78, closed): CSP+HSTS added; a cache-tier bug fixed **twice** (first attempt used unsupported extglob header syntax that matched nothing — caught via live header verification, corrected to rely on Netlify's own safe default); dead `/quiz/aireadiness` placeholder redirect removed; both money-path functions hardened (payload/JSON guards, Slack-escaping, and — the standout fix — distinct Slack alerts on GNG-1/Brevo write failure, closing the exact silent-failure class that caused the 2026-06-27 incident); 16 `node:test` cases added + wired into CI; article-build tokens made fail-fast; nav focus-restore (WCAG 2.4.3); CSS bundled from 24 stylesheets to 1 (verified via a 14-sample computed-style diff, zero changes). Both functions E2E-tested live against real Airtable/Brevo/Slack; one Brevo test contact left for Andy to remove (flagged in go-live checklist). 8 commits for the hardening batch (11 total this session) pushed to `rebuild/v2`, build+check+tests green throughout.

**Earlier (2026-06-27):** Set up + documented full autonomous agent access to the stack (Netlify CLI+MCP user-scoped, PostHog MCP, Vercel MCP, Airtable MCP, GitHub) → `docs/tech-architecture/integrations-and-access.md`. Cleared B9 (PostHog conversion instrumentation, cookieless, ingestion confirmed in prod).

**Earlier (2026-06-23):** Walked Door 1 (B2/#67) and Door 2 (B3/#68) on the preview, fixing snags; re-architected the About page IA (B4/#69); repriced Leadership Team AI Activation to £14k/≤8 across data, pages, hub card, prose canon.

**Earlier (2026-06-14):** Phase 5 ([#57](https://github.com/andy-carroll/accelerator-x-website/issues/57), closed) — site now derives offer names/prices from the Offer Canon via `{{offering:KEY.field}}` tokens, with a drift-guard (Check #10); Two Doors spine restored; fabricated content removed; `/faq/` hub + FAQPage JSON-LD; newsletter signup consolidated to one component; "no value, no payment" guarantee reconciled. Full detail: `CHANGELOG.md` + `.claude/sessions/`.

**Build:** ✅ passing | **Git:** repo lives at `acc-x/accelerator-x-website` (org transfer, ~2026-08-10); `main` is the only long-lived remote branch — `rebuild/v2` was retired in the move (its preview URL now 404s); PR branches are short-lived and deleted on merge. Work lands via **short-lived branches → PRs into `main`** behind 3 required checks. | **Deployed:** `main` live at https://accelerator-x.ai — **v2, since 2026-07-14 (B10).** Old v1 tagged `v1-archive`.
<!-- Branch/deploy facts (working branch, production branch, preview URL) are single-sourced in `.session-protocol.json`. The literal names above are this session's snapshot only — at cutover, edit the config + this line. -->

**Known issues (rebuild):** Figtree via Google Fonts CDN (render-blocking; self-host later).
**Known issues (live):** ~~HTTPS down~~ — resolved: was a Sky Broadband Shield false-positive, site healthy globally (see DNS doc incident log) · LinkedIn Post Inspector "No author found" (likely cache, low priority) · hero imagery still interim stills.

---

## The cutover — DONE (2026-07-14)

v2 shipped as **one full cutover, not piecemeal** — `main` was fast-forwarded to `rebuild/v2`'s tip (a clean fast-forward; `main` had not diverged) after tagging the pre-cutover `main` tip as `v1-archive` (pushed, permanent rollback reference — `git checkout v1-archive` recovers the exact old site). *(Historical note: `rebuild/v2` continued as the working branch until the ~2026-08-10 org transfer to `acc-x`, when it was retired; the working model is now short-lived branches → PRs into `main` — see Decisions.)*

- **Tracker:** the ["v2 Cutover" milestone](https://github.com/andy-carroll/accelerator-x-website/milestone/1) is now fully closed out except any explicitly-deferred post-launch items (see below). `docs/GO-LIVE-CHECKLIST.md` holds the forensic line-item detail.
- **The post-flip smoke test earned its keep:** submitting a real test application against production caught a live money-path bug (Airtable `Source` field, one-character string mismatch) within minutes of the flip — found, fixed, deployed, reverified, cleaned up. See CHANGELOG [Unreleased] and the "Last session" note above for the full story.

---

## Next (post-launch)

1. **Andy: Google Search Console (~10 min — now hygiene, not emergency).** The 2026-08-21 review re-tested live search and **the site now ranks #1 for its own name** (beating the .eu/.org namesakes) — indexation evidently followed the 2026-08-05 technical batch, so the long-standing "invisible on its own name" framing is stale. GSC verification is still worth doing for coverage/query data: verify `accelerator-x.ai` as a Domain property (the existing `google-site-verification` DNS TXT may satisfy it in one click), submit `sitemap.xml`. Also account-level, same issue: quiz subdomain still titles itself "Accelerator-X" (separate deployment), Brevo sender name is "Accelerator-X Team".
2. **Toby** should mirror Andy's Gmail safety-net filter for `info@accelerator-x.ai` on his own mailbox (per-mailbox, not domain-wide — logged in go-live checklist §4, not a blocker).
3. **The deferred em-dash pass** (title-separator convention — `<title>`/`og:title`/`twitter:title`/JSON-LD names sitewide) is still queued; Andy's call on timing now that the flip itself is done.
4. **Everything else is `post-launch`**, already tracked and not urgent: legal-page v2 reconciliation (#87), the remaining SEO/AEO editorial pass — FAQ blocks, comparison content, keyword strategy (#40, rescoped 2026-08-22 after merging #43's identical remaining scope into it), proof upgrade (#55), FitCheck componentise (#49), cohort surface (#30, #64), real photography to replace the 4 stock hero images (#89, waiting on Andy), homepage testimonials rendering old v1 markup instead of the v2 `.ax-testimonial-card` component (#130, found 2026-08-22 during #79), rate limiting on public functions (#123, filed 2026-08-22).

---

## Decisions (never reverse without discussion)

- **`rebuild/v2` ships as a full cutover, not piecemeal** — switch `main` to v2 once milestone blockers clear. No long-lived unshipped branches: every session ends in a deploy (preview at minimum) or an explicitly tracked carry. Work tracked as GitHub Issues under "v2 Cutover".
- **Newsletter sending domain:** `mail.accelerator-x.ai` — authenticated; sender `newsletter@mail.accelerator-x.ai`
- **Newsletter forms:** bypass Netlify Forms → `/.netlify/functions/newsletter-subscribe` → Brevo API direct
- **Repo is public** — no secrets in codebase; all credentials in Netlify env vars
- **GitHub branch protection** — classic protection on `main`; 3 required status checks: Build passes, Standards check passes, CHANGELOG updated
- **PR flow, not direct commits** (ratified by merging the 2026-08-21 operating-model PR; supersedes "Direct commits to `main` — no PRs until a second collaborator joins"): the second collaborator *did* join — agents. Changes land on short-lived branches (`fix/*`, `batch/*`, `issue-*`, `claude/*`…) → PR into `main` behind the 3 required checks. The old decision's trigger condition was met, not reversed. Exception unchanged: if production is actively broken, a hotfix may land on `main` directly.
- **Brevo, not GoHighLevel** — email capture switched at launch
- **Pre-built artefacts committed** — no build command on Netlify, serves repo root as-is
- **Single opt-in** — no Brevo double opt-in confirmation email for now
- **No `priceRange` in JSON-LD** — deliberate; many clients won't pay listed rates

---

## Session protocols

> **Every session runs one turn of the SDLC loop:** scope → measurable outcome → build → test → deploy → monitor.
> Full procedure: `.claude/rules/session.md`. Template: `.claude/session-notes-template.md`.

**Start:** `npm run session-start` first — no exceptions. Read the full output, post the brief, confirm focus before any task work.

**During (continuous):** update `CHANGELOG.md` on each unit complete; update this file's "Last session" + state on any milestone; add any placeholder/dummy/unverified content to `docs/GO-LIVE-CHECKLIST.md` and a GitHub issue the moment it's introduced — never at close.

**End — agent initiates at any natural completion, no prompt needed:**

1. **Pre-close audit** — review every file touched; fix bugs, ARIA, dead code; update CLAUDE.md + CHANGELOG + ROADMAP; sweep `docs/GO-LIVE-CHECKLIST.md`. Full checklist: `.claude/rules/session.md §Step 0`.
2. **Independent fresh-eyes review** — `/code-review` (or a fresh-context subagent, never a self-review) on the session's **cumulative diff**; fix blocking findings now (then re-run gates), raise non-blocking ones as issues; record the outcome for step 4. Detail: `.claude/rules/session.md §Step 1`.
3. **Close-gate** — all work this session is **tracked** (GitHub issue updated/closed) and **shipped** (pushed to preview), or **explicitly carried** into session-notes + Next Session Priorities with a reason.
4. **Write `.claude/session-notes.md`** — from the template; `session-end:write` blocks if `## Summary` **or `## Review`** is missing/placeholder.
5. Run `npm run session-end:dry-run`, then `npm run session-end:write:yes`.
6. Confirm the session log is in `.claude/sessions/`. Push only when policy + flags allow.
7. **Offer** (optional, human-in-the-loop) to post a short **exec summary** (Shipped / Why it matters / Next + preview link) to Slack `#ax-business-building` — confirm before posting. Detail: `.claude/rules/session.md §Exec summary to Slack`.

## Next Session Priorities

> **North star (Andy, 2026-06-08): ship a *working, honest* v2 soon — zero clangers.** Fabricated content is the #1 unacceptable clanger.
> **Mandate (Andy, 2026-06-16): get v2 LIVE — even if imperfect. Ship over polish.** Work the [🚀 v2 Launch Board (#77)](https://github.com/andy-carroll/accelerator-x-website/issues/77) — the single ship checklist.

**MVP = honest + functional + reachable — SHIPPED 2026-07-14.** All three hard blockers held at the flip: (1) nothing fabricated (six B-ticket content-honesty walks, all closed); (2) money path works — and was smoke-tested for real against production at the flip, catching and fixing a live Airtable-write bug within minutes; (3) nothing dead-ends.

**Status as of 2026-07-14: v2 cutover complete.** B1–B10 all closed. The "v2 Cutover" milestone is done. Work now shifts to post-launch (see "Next" above) and whatever comes after.

**The 10 batch tickets (all closed, under the "v2 Cutover" milestone, `launch-batch` label):**
- **B1** [#76](https://github.com/andy-carroll/accelerator-x-website/issues/76) Homepage · **B2** [#67](https://github.com/andy-carroll/accelerator-x-website/issues/67) Door 1 · **B3** [#68](https://github.com/andy-carroll/accelerator-x-website/issues/68) Door 2 · **B4** [#69](https://github.com/andy-carroll/accelerator-x-website/issues/69) How We Work + About · **B5** [#70](https://github.com/andy-carroll/accelerator-x-website/issues/70) Contact + FAQ + Talks · **B6** [#71](https://github.com/andy-carroll/accelerator-x-website/issues/71) Global furniture — closed 2026-07-09 through 2026-07-13, see "Earlier" entries above for detail.
- Gates: **B7** [#72](https://github.com/andy-carroll/accelerator-x-website/issues/72) · **B8** [#73](https://github.com/andy-carroll/accelerator-x-website/issues/73) · **B9** [#74](https://github.com/andy-carroll/accelerator-x-website/issues/74) · **B10** [#75](https://github.com/andy-carroll/accelerator-x-website/issues/75) — **the flip, closed 2026-07-14.**

**Deferred — shipped WITHOUT (`post-launch` label):** legal-page v2 reconciliation (#87) · named client proof (#55) · SEO/AEO editorial pass (#40 — FAQ blocks, comparison content, keyword strategy; #43 merged into it 2026-08-22) · FitCheck componentise (#49) · Door 2 follow-ups (#64, #86) · cohort funnel (#30) · homepage testimonials v1/v2 markup mismatch (#130, found 2026-08-22 during #79) · rate limiting on public functions (#123, filed 2026-08-22) · the site-wide title-separator em-dash pass (deferred across every B-ticket; timing now Andy's call, no longer gated by an upcoming cutover). #83 remains queued whenever engineering-only work resumes. (Closed 2026-08-22 backlog batch: #77, #56, #58, #81, #46, #43→#40, #85, #44, #80, #79 — see CHANGELOG.)

**Cohort follow-ups (from B3, 2026-07-11):** ~~firm cohort start date still TBC~~ **resolved 2026-09-04** — C3 starts the week of 21 September 2026 at £3,000/place (Andy), replacing both the retired "Late July / Aug 2026" window and the £3,500 canon set 2026-06-13; live on `offerings.json` and the canonical cohort page. AX's diversifying cohort structures (advanced follow-on etc.) parked for post-launch under #30. How We Work coaching-path coverage is fast-follow [#86](https://github.com/andy-carroll/accelerator-x-website/issues/86).

**Open follow-ups from recent sessions:** Toby needs to mirror Andy's Gmail safety-net filter for `info@` on his own mailbox (B5, not a blocker). Legal-page v2 reconciliation tracked as #87 (B6). Monitor `#website-leads` for a day or two to confirm the Airtable `Source`-field fix holds under real production traffic (B10). From 2026-07-14 (pm): real photography to replace the 4 stock hero images, waiting on Andy (#89) · a sharper trigger path for #88's `data.skipped`-vs-`data.error` gap, noted as an addendum not a new issue. (#91, the stale reply-time promise on orphaned `cohort.html`, is already closed — that file was deleted entirely under #108, 2026-08-22; this line previously left it listed as open after the fact.) (The stray `claude/crazy-shirley-540e0d` branch was deleted 2026-08-09 — this list previously contradicted that.)

> **Operating-model thread (Andy, 2026-06-11):** this repo is now the **reference implementation** for a cross-repo operating model — proactive batch planning → swarm-ready tickets → parallel agentic execution, eventually extracted to portable skills. Umbrella: [#50](https://github.com/andy-carroll/accelerator-x-website/issues/50) (children: #51 batch-health check, #52 plan-batch ceremony, #53 CI on `rebuild/*` ✅, #54 swarm pilot, #82 protocol reconciliation ✅ 2026-07-06). Not in the v2 Cutover milestone — infrastructure, not a ship blocker. The v2 ship remains priority one; protocol decisions here should be designed for export.

---

## Session protocol — repo config

**Layered protocol (decided in [#82](https://github.com/andy-carroll/accelerator-x-website/issues/82), 2026-07-06):** the portable `ax-skill-ops` `/session-start` / `/session-end` skills carry the cross-repo **practice**; the native `npm run session-start` / `session-end` scripts (config: `.session-protocol.json`, procedure: `.claude/rules/session.md`) are this repo's **deterministic enforcement layer** — the skills must invoke them here, not bypass them. Concretely: the brief comes from `npm run session-start`; handoff notes are **generated only by** `npm run session-end:write:yes` (gated, single format) — never hand-written into `.claude/sessions/`. The block below maps the skills' contract onto this repo. Keep it and `.session-protocol.json` in sync when either changes.

```yaml
session_protocol:
  handoff_dir: .claude/sessions            # native scripts write here — NOT the skill default docs/sessions
  handoff_filename: "session-{YYYYMMDD}-{HHMMSS}.md"  # match the native session-end.js format exactly
  # Handoff notes are GENERATED by `npm run session-end:write:yes` (gated, single format) —
  # a skill-driven close invokes that script; it never hand-writes a note into handoff_dir.
  verify_command: "npm run build && npm run check && npm test"
  deploy_check: null                       # Netlify auto-deploys main on merge → https://accelerator-x.ai (merged == deployed); PRs get Netlify deploy previews; verify headers/pages with curl if needed
  review:
    enabled: true
    command: "/code-review"                # independent fresh-eyes pass; evidence enforced natively — session-end:write blocks without a recorded ## Review outcome in session-notes.md (#82)
  stakeholder_summary:
    enabled: true
    channel: "C0ACNB3RV1B"                 # #ax-business-building — same channel as .claude/rules/session.md §Exec summary
  work_tracking:
    issues: true                           # "v2 Cutover" milestone is the source of truth for work
    labels: [launch-batch, build, founder-input, post-launch, blocking, operating-model, area:content, area:tech, area:seo, area:deploy, area:forms, area:analytics, area:links]
    branch_policy: feature-branch          # short-lived per-change branches (fix/*, batch/*, issue-*, claude/*…) off main — the long-lived rebuild/v2 model was retired in the ~2026-08-10 org move (.session-protocol.json → git.workingBranch is now main)
    push_policy: pull-request              # push the branch, open a PR into main behind the 3 required checks; merge = deploy (main IS production). EXCEPTION (exercised once, the B10 post-flip Airtable hotfix): if production is actively broken, a fix may land on main directly.
  structural_docs:
    decisions: CHANGELOG.md                # decisions land in CHANGELOG [Unreleased] + the session log's Decisions section
    architecture: docs/tech-architecture/  # reviews, scorecards, integration/DNS docs — anything with standalone value beyond the diff
  extra_orientation:
    - "Layered protocol (decided #82): portable skills carry the practice, native npm scripts are this repo's deterministic gate layer — run `npm run session-start` for the brief and `npm run session-end:*` to close; skills must not bypass them"
    - "Go-live tracker: GitHub 'v2 Cutover' milestone; forensic line-item detail in docs/GO-LIVE-CHECKLIST.md"
    - "Session close checklist: did this session produce a review/audit/scorecard with standalone value? It gets a doc under docs/tech-architecture/, not just a chat answer"
```

---

## Repo review config

**Ada's two-tier codebase health practice (ax-agent-hub `repo-review` skill — ax-agent-hub#1745):** a weekly drift pulse (autonomous, scheduled) plus a deep scored review (interactive, quarterly or event-triggered), reading the block below for baseline doc, dimension weights and the stale-content watchlist. Engineering lens only (build, security, performance, testing/CI, accessibility at the markup level, ops/docs, backlog governance) — never content honesty, SEO/AEO or conversion copy, which is Marlow's separate content pulse (ax-agent-hub#1814 item 3).

```yaml
repo_review:
  baseline_doc: docs/tech-architecture/architecture-review-2026-08-21.md
  dimensions:            # Ada's 7 engineering-lens dimensions, weighted; content/SEO excluded — Marlow's remit
    build_pipeline: 20
    security: 20
    performance: 15
    testing_ci: 15
    accessibility_ux: 10
    ops_process: 10
    backlog_platform: 10
  stale_content_watchlist:
    - { file: "_templates/offerings/leadership-cohort.html", pattern: "Week of \\d", note: "cohort intake date — added after the 2026-09-04 incident" }
  pulse:
    cadence: "weekly, Monday 08:15 UTC"
    channel: "#ai-driven-development"
  deep_review:
    quarterly_days: 91          # mechanically checked every pulse (step 3e) — the standing reminder
    event_triggers: "migration | launch | stack-change"  # documentation only; not detectable from repo state, stay a human's own call
```
