# Analytics tracking plan — Accelerator X marketing website

_Status: **canonical** — this is the single source of truth for what the site tracks and how to read it._
_Last updated: 2026-07-15_

**Source of truth rule:** the implementation is `assets/js/analytics.js` (init + `cta_click`) and `assets/js/forms.js` (form funnel). This document mirrors that code exactly. **If you change what/how the site tracks, update this file in the same PR.** Anything here that disagrees with the code is a bug in this file — fix the file.

This plan **supersedes** two older, now-stale artifacts, which describe intent that the shipped code diverged from — do not use them for event names or config:
- `docs/PRDs/posthog-behavior-insights-prd.md` (2026-03-06) — proposed autocapture + session recording ON and "Lead form start/submit" names; the cookieless decision (below) and the shipped code superseded both.
- `docs/design_handoff_website_rebuild/Build Plan.html` — lists `apply_form_started` / `apply_form_submitted` with `form_id, programme_slug, intent`; none of those names or props are what actually fires.

---

## 1. Platform & configuration

| Setting | Value | Where |
|---|---|---|
| Platform | PostHog | — |
| Project | **135921** (Accelerator X) | — |
| Region / host | **EU** — `https://eu.i.posthog.com` (browser); `eu.posthog.com` (app/API) | `analytics.js` |
| Public browser key | `phc_4v79jqLmPAIw1Se2KTeVIXe0gsf5xcKViZwv1N0F2LQ` (not a secret — public capture key) | `analytics.js` |
| Persistence | **`memory`** (cookieless) | `analytics.js` |
| Autocapture | **OFF** | `analytics.js` |
| Session recording | **OFF** | `analytics.js` |
| Surveys | **OFF** | `analytics.js` |
| Web vitals | ON (default) | PostHog defaults `2026-01-30` |
| Init timing | Lazy — first of `pointerdown`/`keydown`/`touchstart`/`scroll`, else a 15s fallback | `analytics.js` |

**Why cookieless (Andy, 2026-06-27):** `persistence: "memory"` means no cookies or localStorage, so **no consent banner is required**. The trade-off is the single most important fact for interpreting this data — see §4.

---

## 2. Event dictionary

Only these events fire. Autocapture is off, so there are **no** automatic element-click / input events — if it's not listed here, the site does not send it.

| Event | When it fires | Properties (custom) | Source |
|---|---|---|---|
| `$pageview` | Page load / reload (PostHog default) | standard PostHog props (`$current_url`, `$pathname`, `$referrer`, `$referring_domain`, geoip, device/browser, `$virt_*` bot flags) | default |
| `$web_vitals` | Automatically, per page (Core Web Vitals) | standard web-vitals metrics | default |
| `cta_click` | Click on any `a.btn`, `button.btn`, or `[data-cta]` element | `label` (the `data-cta` value, else visible text stripped of arrows, ≤80 chars), `location` (`window.location.pathname`) | `analytics.js:107` |
| `apply_form_start` | First engagement (focus) with a lead form (`[data-lead-form]` / `#lead-form`) — fires once | `location` (the form's `data-source`, default `"apply_form"`) | `forms.js:63` |
| `apply_form_submit` | **Successful** lead-form submission (after the `/api/lead-capture` POST resolves without error) | `location` (as above). Until #222 it also carried `timeline` and `interest` (select values from chips the form no longer has); any saved insight broken down by those properties shows blanks from the ship date. | `forms.js:138` |

**PII discipline:** `cta_click` sends no PII. `apply_form_submit` sends only `location`, the form's own source label, and no form values. Never add form values, least of all free text, as event properties.

---

## 3. Canonical conversion funnel

The one funnel to report against. Same-page where possible (see §4).

```
$pageview  →  cta_click ("Talk to us")  →  apply_form_start  →  apply_form_submit
```

The primary CTA label changed from "Apply to work with us" to "Talk to us" in #221, so `cta_click` events before and after that ship date carry different `label` values. Filter on both when charting across the change.

- `apply_form_start` → `apply_form_submit` is the form-completion rate.
- `cta_click` → `apply_form_start` is CTA-to-form intent.
- Attribute movement by `location` (which page/section) and, for `cta_click`, by `label`.

---

## 4. How to read this data (analysis constraints)

These are not optional caveats — a report that ignores them will be wrong.

1. **No cross-page or cross-session user stitching.** Because persistence is memory-only, PostHog cannot reliably tie two pageviews to the same person across navigations or visits. **Trust aggregate event counts and same-page/same-session funnels. Do not report "unique users", cross-session retention, or multi-page journeys as if they're accurate** — they undercount and fragment. Frame session/user figures as "diagnostic, approximate".
2. **Filter bots.** PostHog tags traffic with `$virt_is_bot` / `$virt_traffic_type` (Regular / Bot / AI Agent / Automation). For any human-behaviour metric, exclude `$virt_is_bot = true`. AI-crawler traffic (`$virt_traffic_category`) is itself worth watching separately as an AEO signal, but never in the conversion numbers.
3. **Low volume — respect a floor.** The site is new (tens of pageviews/day as of launch, 2026-07-14). Percentage swings on tiny counts are noise; apply an absolute floor (≥10 events) before calling a move significant.
4. **Timezone.** Project timezone is UTC. Convert to Europe/London for human-facing framing, but keep query windows in UTC to match ingestion.

---

## 5. Planned but not yet implemented

The PRD (§4) envisaged these; they are **not** in the shipped code and do not fire. Do not query for them until they ship, and add them to §2 when they do:

- Scroll depth / section dwell time (`#problem`, `#different`, `#process`, `#apply`)
- Rageclick / dead-click / clickmaps (would require autocapture or heatmaps, currently off)
- Field-level form-abandonment detail (only the single `apply_form_start` step exists today)

---

## 6. Consumers

This plan is mirrored (essentials only) into the AX Agent Hub so autonomous skills read event names + constraints without re-deriving from PostHog each run:
- `ax-agent-hub` → `plugins/ax-content/skills/marketing-pulse/references/posthog-queries.md` (the "Connection" section pins this plan). When this file changes, re-sync that mirror.
