# Accelerator X — Offer Canon

> **Status: CANONICAL SOURCE OF TRUTH for what we offer.** Version 0.7 — 2026-10-08.
> This document supersedes `ax-offering-architecture.md` and `ax-canonical-offer-strategy.md`.
> The website **derives** from this and from its machine-readable companion `content/data/offerings.json`.
> **Do not edit offering names, prices, durations, or descriptions on the website directly** — change them here, then in `offerings.json`, and let the build propagate.
>
> Markers used in this draft:
> **⚠️ DECISION (Andy+Toby)** = an open founder decision, not yet resolved.
> **🔧 RECONCILE** = a value that conflicts across legacy sources and needs locking.
> **🟡 FAQ-SEED** = raised here; the answer is authored in the FAQ/objection bank (Phase 4).

---

## 1. What we do

We **build human capability with AI systems** — capability designed around your business, your people, and your challenges. We are **anti-agency and anti-consultancy** in the traditional sense: we build capability that *stays with the client*, not dependency on us.

Three promises carry the positioning (customer-tested language, from `landing-page-copy.md`):

- **We build capability, not dependency.** The best outcome is that you outgrow us.
- **We deliver results, not recommendations.** We do the work *with* you — we don't hand over a deck and disappear.
- **We stay until the job is done.** One cycle or a year — no lock-in, no dragging it out.

**What makes us different (and who we're not for).** We're a **rare combination — hands-on technologists, consultants, teachers and coaches.** We work the full span: north-star strategy (DOTS) → **systems design, architecture and implementation** → and the **human capability** to run it. That span is the line between us and the two things buyers compare us to:
- **vs an AI automation agency** — they sell and drop in the tech (an n8n workflow, a bot) and leave; the capability — and the dependency — stays with *them*. We build the systems too, but we also build *your people's* capability, so the value compounds and isn't hostage to a vendor.
- **vs a training company / traditional consultancy** — workshops, slides and recommendations, but no build. We go all the way into hands-on implementation.

If you want a quick fix you don't have to engage with — something dropped in so you *don't* have to do the work — **we're honestly not your team.** Our value is **tech *and* capability, together.** (Don't over-index on "coaching" in the copy — the technologist/implementer half is just as real and is part of what's rare.)

> *Near-term (SEO/AEO, relates [#43](https://github.com/andy-carroll/accelerator-x-website/issues/43)): turn this into discoverable **comparison content** — "AX vs an AI automation agency", "AX vs a consultancy" — a known search pattern. Not v1 dedicated landing pages; the FAQs below + this block are the start.*

**How we deliver (founder-led, specialist-complemented).** Toby and Andy are the **orchestrators and architects** of every engagement and stay **hands-on throughout** — your strategy, DOTS sessions and coaching are delivered by a founder, personally. Where it adds value we complement that with **deep networks of senior specialists, mapped to each client's needs** (e.g. career software engineers; learning-&-development experts who design *and* deliver curricula). This is the opposite of the big-consultancy **bait-and-switch** (partners in the room to win the work, a junior team to do it): our specialists are seniors who *complement* the founders, who stay accountable. We frame it entirely around the client — **more value, lower risk, continuity, maintained quality** — intelligent tech and intelligent humans working seamlessly together. *(Honesty note: speak to the model + the specialists who genuinely exist; don't claim a big bench we don't have.)*

**Tagline candidates** (from the design + copy): *"A clear path from overwhelmed to operational."* · *"Partners who understand you."*

---

## 2. Who it's for (ICP) — and who it isn't

**Primary ICP** (from `ax-canonical-offer-strategy.md`, the dossier, and 50+ exec research in `world-class-landing-pages-thesis.md`):

- Senior decision-makers — **CEO, founder, MD, C-suite, director** — who can say yes without endless procurement.
- Know AI matters and is **time-sensitive**; want **fundamental, lasting change**, not a quick fix.
- **Cognitively overloaded** by AI hype, **strategically cautious** after stalled transformations, **time-starved**, and **sceptical of yet another "expert."**
- Willing to invest properly — time, budget, execution. Value a **direct relationship over a vendor process.**

**Disqualifiers (this is *not* for you if):**

- You want someone to build a chatbot and disappear.
- You're looking for the cheapest option / want to run it through procurement and pick the lowest bid.
- You think AI transformation happens in a few weeks.
- You want free strategy with no intent to execute.

> The ICP is **psychographic** (ready-to-commit mindset), not demographic. Price is a **qualification filter**, not a lever to discount.

---

## 3. The spine: Two Doors in

> **This is the carrier signal of the entire offer.** Recovered verbatim from the locked design (`home-b-v2.jsx`, §05 "Two doors in" — *"Pick your starting point."*). Everything below hangs off it. The built site expanded this into a six-row decision tree that muddied it; the Canon restores the two doors.

The right starting point depends on **what you're trying to move — yourself, your leadership team, or your whole business.**

> **It's a menu, not an either/or (Andy, 2026-06-14).** The Doors are *entry points*, not lanes you're locked into. Clients routinely run **two, three, or four offerings in parallel** — that's often where they find the most value. (Live example: a client running full Company Enablement *and* the in-house exec-team cohort *and* 1:1 founder coaching at the same time.) The job of the website is to give a clear place to **start**, while making obvious that the rest is available and frequently combined. Routing copy should say "start here" — never imply "pick one only."

### 🚪 Door 1 — "For your business" → **Company Enablement**
> *"Three workshops plus an AI strategy playback. Aligns leadership, activates the team, and leaves you with a costed 90-day plan — whether you continue with us or not."*
Everyone starts at **Phase 0** (2 weeks, from £5,000), then **Phase 1+ Transformation Cycles** (8 weeks each, from £20k) as far as you want to go.

### 🚪 Door 2 — "For yourself or your leadership team" → **Leadership AI Coaching**
> *"Workshops, peer accountability, and DOTS applied to your own context. The fastest way to build personal AI capability."*
One lane, **three formats** (see §4.2): **1:1 / very small group · your exec team (closed) · open cross-company cohort.**

### ↘ Tertiary callout — **Talks & Events**
> *"I need someone to lead a big AI moment."* Keynotes, leadership offsites, hackathons. First-class, not buried.

> **✅ DECIDED (Andy, 2026-06-14):** The design also had an *"Already running AI internally? → Fractional AI Advisory (monthly)"* strip. **Dropped from v2** until it's a real, priced offering. Recorded in `offerings.json` as `status: retired-for-v2`.

---

## 4. The offer set

> Each offering below carries its **approved customer-facing language** (from the built detail pages, which the founders confirmed are the closest thing to the real offer). Prices are locked — see §5.

### 4.1 · Door 1 — Company Enablement *(flagship for businesses)*

**Customer line:** *"How a company moves with us."* Two phases. The first aligns and activates in two weeks; the second ships capability, cycle by cycle, until you're self-sufficient. **Everyone starts with Phase 0.**

**Phase 0 — "Two weeks to clarity."** 2 weeks · **3 workshops + 1 playback** · **from £5,000** (the floor). The flow:
1. **Executive DOTS** — half-day with the leadership team. Produces a **tangible high-level roadmap** — vision, north star, key themes and opportunity focus areas (Dream / Obstacles / Triage / Sequence). This is the *boulder-to-rock* level of granularity.
2. **Team Activation** — our foundational **2.5-hr** workshop for the wider team: shared operating model + mental model, enablement, and rapid practical upskilling. Run in groups of **~20–25 at a time (max 30)** — multiple sessions scale it to larger organisations (tens to a few hundred people; we don't put 200 in one room).
3. **Team-level DOTS** — one level down, guided by the Exec DOTS: it takes those rocks down to **stones** (toward — not all the way to — grain-of-sand detail), focusing on specific functions / high-priority areas and sequencing them into the 90-day roadmap, tied to clear business metrics. Crucially it **draws the dotted line from executive steering to execution**, and **transfers ownership to the team with clarity, conviction and engagement** — the exec team has been heard and set the direction; the people who'll execute now own it. That's how you get shared ownership across the organisation, not a plan imposed from the top.
4. **Strategy playback** — the costed, sequenced 90-day roadmap; Phase 1 scope agreed (or not).
*You walk away with:* top-level direction + strategy + focus; a **costed 90-day roadmap tied to business metrics**; aligned leadership; **and a team levelled-up on how to execute** — so Phase 1+ becomes a collaboration on a **shared roadmap**, with our involvement dialled up or down. *"A roadmap you can defend."*

**Phase 1+ Transformation Cycles — "Eight-week cycles. One capability at a time."** 8 weeks/cycle · **from £20,000/cycle**. Three streams every cycle: **People** ("train your operators"), **Process** ("change the rituals"), **Product** ("ship the thing"). Cycles chain: Cycle 01 → 02 → N → Advisory (when self-sufficient).
🟡 FAQ-SEED: *"Can we skip Phase 0?"* · *"Can cycles run in parallel?"* · *"What's the '+' in Phase 1+?"*

### 4.2 · Door 2 — Leadership AI Coaching *(one lane, three formats)*

> **✅ NAMES DECIDED (Andy, 2026-06-14) — "Ronseal" titles + an explanatory subtitle each:**
> • **1:1 Exec AI Fast Track Coaching** — *A bespoke 6-week 1:1 sprint that takes AI work off your plate.*
> • **Leadership Team AI Activation** — *Eight weeks with your leadership team, in-house, to one shared way of working with AI.*
> • **Open Cohort AI Bootcamp for Business Leaders** — *Eight weeks of AI in a room of non-competing peers — one shipped artefact.*
> Same DOTS engine, three depths: on your own / your team (closed) / with peers (open). Slugs/keys unchanged until Phase 5.

**Format A — 1:1 Exec AI Fast Track Coaching** *(name decided 2026-06-14; very-small-group on request. Built page is STALE — was "Senior Leader Acceleration", 12wk/£12k/90-min; update in Phase 5.)*
*Elite, high-touch, fully bespoke.* **6 weeks** · weekly **75-min** private remote sessions + continuous async support (Slack/WhatsApp/Loom) · dedicated founder coach · **from £10,000 per individual** *(locked 2026-06-14; premium, scarce inventory; small-group variant possible)*.
**The promise: we take things off your plate, not add something new to learn.** Begins with a rigorous async **audit** of your day-to-day to find the highest-ROI AI integration points (inbox triage, strategy synthesis, managing direct reports, strategic decision-making & comms). You build **proprietary workflows, custom instructions, and personal AI assistants** tuned to your leadership style and the company's tech stack — **at your pace, not a group's.** Confidential.
🟡 FAQ-SEED: *"Why from £10k for 1:1 when a cohort place is £3.5k?"* → opportunity cost (a cohort fills 10–12 seats), plus bespoke + your-pace + done-with-you.

**Format B — Leadership Team AI Activation** *(your exec team, closed, single company; name decided 2026-06-14, was "Leadership Activation")*
*"A leadership team that moves together."* 8 weeks · bi-weekly half-days · on-site · up to 12 leaders from one organisation · **base £14,000 (up to 8 people) + £2,000 per person above 8, max 12 → range £14k–£22k; £1,750/person at 8** *(repriced 2026-06-24, Andy; was base £15k/≤6)*.
*"Your team, not a peer cohort. We come to you."* You leave with one shared AI operating model, a team-level artefact, aligned leadership.

**Format C — Open Cohort AI Bootcamp for Business Leaders ⭐ FLAGSHIP** *(name decided 2026-06-14, was "Leadership Cohort")*
*"Eight weeks of AI in a room of your peers."* 8 weeks · one 90-min live session a week on a video call (use between sessions is discretionary) · in-person London element for those who can attend, incl. a small-group closing session · 12 places, vetted non-competing · **from £3,000 per place** *(C3 price, Andy 2026-09-04; was £3,500)*. **Programme spine (Andy, 2026-10-08):** participants build their own agentic Chief of Staff on Claude (knows you, chases you, reminds you, acts on request and automatically), then the method to build systems for any other part of work or life — the system that builds the system, then the system of systems. Next intake late October 2026, date TBC.
*"A founder-led cohort for senior leaders who'd rather lead the AI conversation than be led by it."* You leave with a working agentic Chief of Staff, the toolkit to build more systems, a personal AI operating model, and a peer network.
🟡 FAQ-SEED: *"How much time does this take?"* · *"What if a competitor applies?"* · *"Can my whole team join?"* · *"What if I miss a session?"*

> **The relationship to make obvious in copy (Andy's design intent):** same underlying process (DOTS), three depths — on your own (A), your team behind closed doors (B), or alongside peers from other companies (C).

### 4.3 · Talks & Events *(first-class — revived this session)*

**Customer line:** *"Move a room. In an afternoon."* *"High-impact AI events for conferences, leadership offsites, and senior partnerships… not talks — hands-on activation moments."* Three formats (from `events.jsx`):
- **AI Keynote** — 45–90 min, up to 2,000. *"A high-signal, low-fluff main-stage talk… what matters and what to do on Monday."*
- **Leadership Offsite** — half/full day, 10–40 leaders. Live DOTS; leaders leave with a 90-day plan. *(Natural hand-off into Phase 0.)*
- **AI Hackathon** — 4–8 hrs, 40–200. Hands-on Claude hackathon around your real work.
> **✅ DECIDED (Andy, 2026-06-14):** the three formats are confirmed. **No prices — price on application.** Events are too situation-dependent for a number (e.g. £25k for two AI hackathon offsites + travel/accommodation). Present **inquiry-led** — *"tell us the moment you want to create"* — not an events calendar. The Leadership Offsite is also the answer for anyone wanting a one-off workshop.

### 4.4 · Fractional AI Advisory — *retired for v2*
In the design as a tertiary callout (£6k/mo) but **never built** (no page, no confirmed model/price). **Dropped from v2 routing** this session. Kept in `offerings.json` as `status: retired-for-v2` so the decision is documented, not lost. Revisit post-launch.

---

## 5. Pricing — rules & the numbers to lock

**Philosophy** (from `ax-canonical-offer-strategy.md` + dossier): value-first, then price. Quoted prices are **"the floor"** — they flex by business size, delivery complexity, travel/on-site, and scope. **No discount-led positioning.** **ROI — outcomes-first (v0.6, 2026-07-13).** See **§5.5 "How to think about ROI"** — the canonical framing. In short: we're outcomes-focused and tie every engagement to defined targets up front; we aim for **a return that dwarfs the fee**, anchored in the client's own numbers — **never** an unsubstantiated claim of a *delivered* multiple, and (as of v0.6) no fixed multiple/timeframe promised either, since the two read as contradictory side by side. Real measured cases still to be published (near-term).

**VAT (decided 2026-06-14):** all prices quoted **"+VAT"** (exclusive) — the UK B2B norm; VAT-registered clients reclaim it, so it's immaterial to the buyer. **One site-wide footnote** handles the international case (B2B place-of-supply: non-UK businesses are not charged UK VAT) — e.g. *"Prices exclude VAT. UK VAT added where applicable; international clients billed per place-of-supply rules."* No per-price VAT logic, no VAT-inclusive pricing.

**Risk reversal / guarantee — our "no value, no payment" promise (decided 2026-06-14; clarified 2026-06-14 by Andy — lead with the principle, no caveats or legal-speak up front):**
The core commitment, stated plainly: **we don't want to work with anyone who doesn't feel they've received far more value than they paid.** So across **everything we do — Company Enablement, and all coaching, training and activation/enablement programmes** — there's a genuine, no-questions / no-objections money-back option. (The only exception is one-off **Talks & Events / keynotes**, which this doesn't cover.)
- **Company Enablement / Phase 0:** after your **first session**, *you* decide. If it isn't worth it, you pay nothing.
- **Coaching (all three formats):** you get **two full sessions and the resources are yours to keep** — if it's not for you, cancel **before the third session** and get a **full refund**.
- This is a real commitment, not theatre. Beyond it there's **no lock-in** — engagements run a cycle/format at a time; you decide if there's a next one.
- **Presentation rule:** state the strong principle up front ("no value, no payment"); the simple mechanism (decide after session 1 / two sessions then cancel before the third) is the *how*, not a hedge. Do **not** front-load conditions like "within 48 hours" or "in line with expectations."

**IP / data (decided 2026-06-14 — keep it light on the site, no NDA detail):** **what you build is yours.** Frameworks/tools we share are yours to use freely across your business and personal life — the only restriction is no reselling or running them as a competing service. 1:1 work is confidential. NDAs/DPAs handled directly with the client's team, not on the website.

**Procurement / discounting (light touch):** we don't compete on discount — price reflects value and tends to move **up**, not down. We can work within a required formal process (done before, incl. a global financial consulting firm); a heavier process usually means more scope, which the price reflects. Don't over-explain this on the site.

**Making "yes" easy — no 12-month commitment (decided 2026-06-14 — a core part of the offer, surface it).** We deliberately **do not sell a 12-month programme**, and we won't drag you through proposal/finance-approval purgatory. (We've watched businesses spend *12 weeks and nine proposal drafts*, or *nine months of board decks*, just *talking* — it feels like progress but moves nothing.) The model is built to make yes easy and to remove downside: you commit to **one Phase 0**, then **8 weeks at a time**; you **never enter a cycle without full clarity on what it will deliver and its ROI**; and the money-back guarantee removes the risk of starting. We genuinely can't predict the number or scope of cycles before Phase 0 — it might be one or several, sometimes tapering to a small monthly advisory retainer (~£6k/mo). So we don't quote a fixed annual figure; we scope value **cycle by cycle**.

**Pricing — locked 2026-06-14** (was a reconcile across legacy sources, #23):

| Offering | Built page | Strategy/dossier | Canon working value | Status |
|---|---|---|---|---|
| Open cohort (per place) | £3,500 | £8,000 (old table) | **£3,000** (C3, 2026-09-04) | ✅ Andy confirmed |
| 1:1 (6 weeks) | £12k (stale page) | £4k/mo or £10k (design) | **from £10,000 / individual** | ✅ Andy 2026-06-14 |
| Leadership Team AI Activation | £18k (stale) | — | **base £14k (≤8) + £2k/head, max 12 → £14–22k; £1,750/person at 8** | ✅ Andy 2026-06-24 |
| Company Enablement Phase 0 | £5,000 | £2k–£9k typical | **from £5,000** | ✅ Andy 2026-06-14 |
| Phase 1+ cycle | £20,000 | £20–25k | **from £20,000/cycle** | ✅ Andy 2026-06-14 |
| Half-day workshop ("from £2k") | — | £2k–£5k (design) | **RETIRED** | ✅ Andy 2026-06-14 — not listed |
| Events | — | ~£10k (dossier) | **Price on application** | ✅ Andy 2026-06-14 |

**✅ DECIDED (Andy, 2026-06-14):** The standalone half-day workshop is **retired** — not a listed offering. Workshops live *inside* Phase 0 and Leadership Team AI Activation; standalone facilitated sessions are the Talks & Events **Leadership Offsite**; genuine one-offs are handled ad hoc on request. **Public headline price = "from £3,500 +VAT"** (the cohort place — the lowest honest entry, and a healthier anchor than £2k).

---

## 5.5 How to think about ROI (outcomes-first)

> **A key cross-site narrative element — not FAQ filler.** It deserves a prominent home (its own block/section) and should be **woven through the home page, `/what-we-do/`, pricing, and the offering pages** — the thread that makes the value undeniable. Tone: help the buyer reason in *their own* world; flip the question to *"can we afford not to?"*

**We're outcomes-focused. Nothing matters if we're not delivering business results** — so we tie the AI opportunity roadmap and every piece of work to **clearly defined results and targets** (that's exactly what the Phase 0 roadmap is). We won't hand you a generic number; we build the model *with* you.

**No two businesses are the same.** Structure differs, and what you measure differs. A **1% improvement to a critical function in a 2,000-person organisation can be worth millions in year one** — the same percentage means something entirely different in a smaller business. The point isn't our number; it's anchoring the calculation in *yours*.

**The bar we work toward: a return that dwarfs the fee** — often substantial, often fast. Where it shows up:

- **Capacity you stop needing to hire for** — when the mundane work is handled, teams stop needing the next few headcount. *(One leader told us our work saved them around four hires — call it £200k+ a year — for a fraction of that.)*
- **Top line** — better-fit customers, a tighter sales process, more value delivered per customer with less effort. A couple of points of conversion or revenue-per-customer compounds fast.
- **A workforce multiplier** — if every person becomes even **1.5–2× more effective (the low end)**, what does your business do with that? Now picture a year where everyone is 2–5× the operator they were — without hiring.
- **Enterprise value** — a demonstrably **AI-native operating model** (shared infrastructure, AI-enabled people) is a premium an investor or acquirer will pay for. Becoming AI-native re-rates the whole business.
- **The compounding shift that's hard to price but easy to feel** — a leadership team perfectly in sync; a **shared "company brain" that's self-documenting and self-healing**; quality up, costs down, confusion down; and decisions **compressed from weeks to near-real-time**, because you're no longer waiting on a human to approve what should be approvable instantly.

So the real question stops being *"can we afford to invest?"* and becomes **"can we afford *not* to?"** — and then we make it concrete, together, against targets we both sign up to.

> **Honesty guardrail:** this is *a way to reason*, plus honestly-attributed illustration — **not** a claim of measured past results, and **not** a fixed multiple or timeframe promise (a specific "10x+ within 12 months" figure was tried and retired in v0.6 — it read as internally contradictory next to "we won't claim a number we haven't measured in your business," which sits right beside it on the FAQ). Keep it that way until real measured cases are published (in flight, #22/#55).

## 6. The method (the spine under every offering)

### DOTS — the connective tissue
*"Four moves — connected — that take a leadership team from overwhelmed and confused to clear and aligned. Fast."* (`dots-method.jsx`). **D**ream · **O**bstacles · **T**riage · **S**equence. *"It's the spine of every engagement we run — workshops, cohorts, Phase 0, transformation cycles, even keynotes."* A dedicated `/how-we-work/dots` page is designed. DOTS should be **front and centre**, not buried.

Why it works (verbatim): *ambition before friction* · *honest filtering* (the wasted year hides in O+T) · *sequence over strategy* (a 90-day plan that survives contact with reality beats a 30-page deck nobody acts on).

### The Capability Curve — the development framework
Five levels a client moves through (`ax-offering-architecture.md`): **1 Context & Communicate** (CRISP prompting) · **2 System & Plan** *(the centrepiece — AI as a genuine thinking partner; where the real value begins)* · **3 Codify** (reusable assets) · **4 Automate & Combine** · **5 Scale** (org-wide, self-sustaining). DOTS lives at the System & Plan level; TSS (Tools × Skills × Systems) is the underlying, non-client-facing logic.

> Both frameworks live here per this session's decision (one doc, no separate method-canon for now).

---

## 6.5 Founders & origin (DRAFT — for the About page; deliberately light, tighten post-launch)

> Light capture to unblock the About page (#24/#18/#19) so we can ship v2. Honest and shippable as a v1; refine later.

**The credibility that matters to buyers — we're AI-native ourselves.** The proof clients care about isn't a CV; it's that **we've built and embedded true AI capability where it counts — starting with our own business.** We've designed and run **AI-native operating systems** — agents, skills, connectors, whole architectures (e.g. the AX agent hub) — and delivered the same kind of capability into Toby's other business, **Accelerator Solutions**, and into client businesses. We don't just advise on becoming AI-native; we live it. It's always the **combination of intelligent humans and intelligent systems.** *(To tighten later: 2–3 named, concrete AI builds/outcomes per founder.)*

**Origin.** Both founders spent nearly two decades building independently — leading products **0→1** across a range of businesses, building teams, and helping clients build their own. We joined forces after years on parallel tracks: **different angles, a big overlap in ethos and approach.** We've driven change programmes and thrive in early-stage, high-ambiguity environments — distilling opinions, insight and large, messy datasets into something **actionable, fast, with clarity and conviction.**

**The "why" — we're actually partners.** Most AI agencies and consultancies aren't partners; they're selling you something — *their* team vs *your* team. The thing you feel with us is that **we're on your team.** That partnership is our core differentiator and our most sustainable moat.

**Roles (rough — a single clean title each is hard, and that's fine):**
- **Toby** — strategy, consulting and partnership; the client relationship / traditional consulting-partner role.
- **Andy** — product and technology; systems design, architecture and hands-on implementation — the **human × technology** intersection.
The combination *is* the point.

**⚠️ Not a public label (updated v0.6, 2026-07-13, Andy):** the site does **not** display a title/role split anywhere — both founders are shown as **"Co-founder"** only, full stop, no qualifier. The bullets above are internal context for writing differentiated bio *prose* (each founder's specific focus and track record, useful colour in a longer bio), not a tag to render standalone. Andy: a bare "Strategy & Consulting" / "Product & AI" split (as briefly shipped on Contact, Homepage, About and the cohort funnel page) wrongly implied a rigid functional division that doesn't reflect how the co-founders actually work day to day — "we both look after most things."

**Specialists:** we don't name individuals (not confirmed for public use). Point instead to our **deep networks** of trusted specialists we've worked closely with, mapped to each client's needs as they arise.

## 7. FAQ / objection bank

> **Generated by the 2026-06-14 multi-persona adversarial pass** (4 ideal-customer viewpoints → synthesis). Draft answers are grounded only in this Canon, in the AX voice (honest, anti-agency, *"great that you asked"*). **⚠️ = answer still depends on an open founder item** (real proof/case outcomes, and founder AI-specific pedigree for the About page) — don't publish those until resolved. Pricing, guarantee, naming, events and the delivery/continuity model are now locked.
> **Principle (Andy):** ~95% of questions are repeats — answer them on the page, *"great that you asked."* FAQs are **first-class across the site**, not buried. Add **FAQPage JSON-LD** so AI assistants extract them.

### Positioning / "is this real?" (homepage + /what-we-do)

- **We've been talking about AI internally for months and still feel lost — can you actually get us moving?** — This is the exact thing we exist to fix. We've watched businesses spend 6–12 months in board decks and exec debates about AI — endless meetings that *feel* like progress but move nothing. Straight up: **you'll achieve more in the two weeks of Phase 0 with us than in the last 6–12 months of talking amongst yourselves.** What's that worth? Almost certainly more than the ~£5–8k Phase 0 costs — and if that first session doesn't clear the bar, it's free.
- **Is this another agency sales funnel dressed up in nicer language?** — Healthy suspicion, and the only real answer is what we do rather than what we say. We're anti-agency by design: we do the work *with* you, not for you; what we build stays as your capability; and the explicit aim is that you outgrow us. Phase 0's roadmap is yours whether you continue or not — a strange thing to hand over if the goal were to trap you. Hold us to those three.
- **How are you different from an AI automation agency that can build me a workflow in a couple of weeks?** — If you genuinely just want a bot or an n8n workflow dropped in and nothing else, an automation agency is faster and cheaper — and we'll tell you so. The difference: they sell you the tech and leave, so the capability (and the dependency) stays with *them*. We *do* build the systems — we're hands-on technologists who design, architect and implement — but we also build *your* team's capability, so it compounds and isn't hostage to a vendor. **Tech *and* capability, owned by you.**
- **Are you a training/coaching outfit, or a consultancy?** — Both, and neither. We're a rare mix of **technologists, consultants, teachers and coaches** — we go from strategy (DOTS) right through to systems design, architecture and implementation, and we build your people's capability alongside. Most firms do one slice of that; doing the whole span is the point.
- **Is this strategy-level work or just AI tool demos?** — Strategy-level. The spine of every engagement is **DOTS** — Dream, Obstacles, Triage, Sequence — that takes a leadership team from overwhelmed to a 90-day plan that survives contact with reality. Tools come in only in service of capability your people keep. Ask to see what an Executive DOTS session actually produces.
- **⚠️ Who have you actually done this with? Can you show me named clients and outcomes, and could I speak to one?** — Great that you asked — first thing we'd want to know too. *[FOUNDER INPUT: real proof exists (Mark Bennett / Alastair Constance / David Carry / Charlotte Steedman) but is not yet woven into the offer narrative — see §7.5 #1.]* We won't invent clients to look bigger than we are; we'd rather show real work on a call and connect you with someone we've worked with. If proof is the thing standing between us, say so and we'll lead with it.
- **Who are you two? What have Toby and Andy actually built or run that earns the right to coach my exec team?** — Fair — never take AI direction from a self-appointed expert. The short version: we're **AI-native ourselves** — we've designed and run real AI-native operating systems (agents, skills, connectors, whole architectures) in our own business and embedded the same capability into others'. That sits on nearly two decades *each* of building products 0→1, building teams and driving change in high-ambiguity environments. Toby leads strategy and the partnership; Andy leads product, architecture and hands-on implementation. Full story on the About page. *(To tighten: 2–3 concrete named builds.)*

### Pricing

- **Your prices all say "from." What's the actual number for me — and is it plus VAT?** — "From" shouldn't mean "unknowable." The floors are genuine: cohort from £3,000/place, Phase 0 from £5,000, cycles from £20,000 each — all **+VAT** (UK businesses reclaim it; non-UK clients aren't charged UK VAT). They flex with size, on-site/travel and scope — a 2-week Phase 0 for a 30-person firm and a 2,000-person one aren't the same job. Tell us the shape and we'll give you a real figure.
- **What ROI can I expect — and how should I think about it?** — The better question is usually *"can we afford **not** to?"* We're outcomes-focused: we tie the work to defined targets up front and aim for **a return that dwarfs the fee**. Because no two businesses measure value the same way, we help you anchor it in *your* numbers rather than waving ours at you (a 1% lift to a critical function in a big org can be millions; capacity you stop hiring for; a workforce 1.5–5× more effective; even your valuation as you become AI-native). **See §5.5 "How to think about ROI" for the full picture.** We won't claim a figure we haven't earned in your business.
- **What's the realistic 12-month all-in cost for a company my size?** — Honestly, we can't know before Phase 0 — and that's the point. **You're not committing to a 12-month programme.** You commit to one Phase 0 (from £5,000), then **8 weeks at a time** — and you never start a cycle (from £20,000) without full clarity on what it delivers and its ROI. How many cycles depends on what we find: maybe one, maybe several, sometimes tapering to a small monthly advisory retainer (~£6,000/mo). We won't drag you through a 12-month budgeting debate or nine proposal drafts — the model exists precisely to escape that. If finance needs something to hold, we'll sketch an *illustrative* range with caveats; what we won't do is invent a fixed annual figure that fakes a certainty we don't have until we've done the work.

### Company Enablement (Door 1)

- **Do I have to pick just one? Can we run more than one at the same time?** — Not at all — and most of our highest-value relationships don't. The Doors are just a clear place to *start*; the rest is a menu. Plenty of clients run several at once — for example full Company Enablement across the business, the in-house cohort for the exec team, and 1:1 coaching for a leader carrying the most — because they reinforce each other. Start where it's clearest, and add what helps.
- **What's the difference between Company Enablement and the closed exec-team coaching? Both work with my leadership team.** — The most common confusion, so thank you for naming it. Company Enablement (Door 1) moves your **whole business** — it starts by aligning leadership but its job is to activate your wider team and ship capability across the org, cycle by cycle. The closed exec-team format (Door 2 B) is narrower and deeper: it builds the AI capability of your **leadership group itself**. Rule of thumb: Door 1 for org-wide change; exec-team format for upskilling your leaders specifically.
- **If I do Phase 0 and stop, what do I walk away owning — and isn't a 90-day roadmap just the deck you say you don't do?** — The contradiction worth pushing on. Phase 0 leaves you a costed 90-day roadmap, use cases evaluated, aligned leadership and an activated team — yours whether you continue or not. The difference from a consultant's deck: it comes out of doing the work *with* your leadership and team in the room (Executive DOTS + team activation), built to execute yourselves. Stopping after Phase 0 is a legitimate outcome, not a failed sale.
- **Can I skip Phase 0?** — Everyone starts with Phase 0, for a reason: it's where we get genuinely aligned and produce the costed roadmap — without it, a cycle is building on guesses. It's also your lowest-risk way in: if the playback isn't defensible, you've learned that for a floor of £5,000, not after committing to cycles.
- **Isn't "we stay until the job is done" + endless chained cycles just the engagement creep you claim to be against?** — Fair tension. The difference is who controls the next cycle: each is scoped to ship a specific capability, and *you* decide if there's a next one — the goal is that you stop needing us. If a cycle ever feels like a treadmill, that's our failure, and no-lock-in means you can act on it.
- **What does my team actually keep doing without you 6 and 12 months later?** — The whole point. We do the work *with* your people: what stays is a shared AI operating model, your people trained as operators, changed rituals, and shipped artefacts they built. Cycles chain only as far as you want, then taper into light advisory once you're self-sufficient.
- **How do you measure success during an engagement, and what reporting do I get for my exec team?** — You need evidence between sessions, not just at the end. Every cycle runs on three streams (People, Process, Product) and ships a concrete capability, so progress shows in what changed, not a status slide. We agree cadence and reporting up front so you can defend the spend.

### Leadership AI Coaching (Door 2)

- **What's the real difference between the three coaching formats — and why choose the closed team over sending people to the cohort?** — Same engine, three depths. All run on DOTS; what changes is the room. Format A: one founder in your corner, 1:1. Format B: your own leadership team, closed, on-site, working on your confidential context together. Format C: you alongside vetted non-competing peers. The open cohort is the lightest way in per person; the closed team buys privacy, a session built entirely around your business, and a team-level artefact your leaders own together. Different jobs, not better-or-worse.
- **Is the open cohort a group from different companies, or somewhere I send my own team?** — A peer room: 12 vetted places, senior leaders from different non-competing companies. If you want your own team in a closed room, that's the exec-team format (B). On more than one person from your company, just ask — we vet for a good mix.
- **Is this realistic for a busy CEO, and what if I miss sessions?** — Glad you raised it rather than bouncing. Cohort is one 90-minute live session a week for 8 weeks, plus as much use between sessions as you choose; the 1:1 is 75 minutes a week over 6 weeks — real commitment, deliberately, because capability doesn't stick from one afternoon. The work is built around your actual job, not bolted on top. On missed sessions, ask how we handle it for your format.
- **What does the closed exec-team programme (Leadership Team AI Activation) cost for, say, 8 leaders?** — It's a base plus per-head: **£14,000 for up to 8 people, then £2,000 per person above that, to a max of 12** — so a team of 8 is £14,000 (about £1,750 per person, all +VAT). Tell us your group size and we'll confirm the exact figure.

### Talks & Events

- **What's the lightest-touch way to work with you — a talk or a one-off session?** — A talk or event: a keynote (45–90 min), a leadership offsite, or a hands-on hackathon — designed to move a room in an afternoon (the offsite doubles as a one-off workshop). These are scoped to your situation, so they're **price-on-application** — tell us the moment you want to create and we'll come back with format and cost. For something ongoing, the cohort (from £3,500/place) is the lightest programme.

### Trust / commercial / legal (contact)

- **If it's not working, can I stop? Is there a guarantee?** — Yes, and we mean it. **Phase 0:** if that first leadership-team DOTS session (2.5–3 hrs) isn't comfortably in line with or beyond what you expected, it's a **full, no-questions money-back guarantee** — just tell us on the day or within 48 hours. **Coaching:** full money-back through your **first two sessions** — quit before the third and you owe nothing. Beyond that there's **no lock-in** — engagements run a cycle at a time, your call. We'd rather earn the next cycle than trap you.
- **It's just the two of you — what if you're ill or oversubscribed, and how does this scale to a large org?** — Founder-led is deliberate and stays that way: Toby and Andy orchestrate, architect and stay hands-on in every engagement, and your strategy, DOTS and coaching are delivered by a founder personally. What we're *not* is a bottleneck or a bait-and-switch — where it adds value we draw on **deep networks of senior specialists, mapped to your needs** (career software engineers; L&D experts who design and deliver curricula) to complement delivery. That protects continuity and quality, increases the value you get, and lets org-wide change scale through *your* people too — intelligent tech and intelligent humans working together. You always have a founder accountable; you're never handed to a junior team.
- **Who owns what we build, and will you sign our NDA/DPA?** — Simple: **what you build is yours.** Any frameworks or tools we share are yours to use freely across your business and personal life — the only line is you can't resell them or run them as a competing service. Your 1:1 work stays confidential. We handle NDAs/DPAs directly with your team.
- **Do you discount, and can you work with our procurement process?** — We don't compete on discount — price reflects the value, and tends to move up, not down. If a formal process is required we can work within it (we've done so before, including with a global financial consulting firm); a heavier process usually means more scope, which the price reflects.

## 7.5 Required revisions (from the 2026-06-14 adversarial pass)

> All four personas converged on these. The four **HIGH** items gate an honest cutover.

**🔴 HIGH**
1. **Proof gap (#1 ship-blocker) — partly addressed 2026-06-14.** The offer asserts results with *zero* proof woven in — every persona called it a dealbreaker. **Asset confirmed:** all early clients (Alastair Constance/Mercury Global, Mark Bennett/W R Bennett Group, David Carry/Track Record Coaching, Charlotte Steedman/Conductor) **+ others are willing to be reference calls for serious prospects** (see [[verified-clients-and-pedigree]]). **Action (Andy prioritising over coming weeks, #22/#55):** capture 2–3 concrete before/after outcomes (e.g. Mark's £16k dispute resolved in a week — named or anonymised), weave them into the offer narrative + offering pages, and surface *"references available on request."* North star forbids fabrication — this is founder-content. **Update 2026-06-14:** founder *credibility* now drafted (§6.5 — "AI-native ourselves" framing); the still-open piece is **measured client outcomes** + 2–3 concrete named founder AI builds.
2. ✅ **RESOLVED → reframed (Andy, 2026-06-14, v0.4): outcomes-first ROI.** The bare unsupported multiple stays out; in its place a **standalone "How to think about ROI" block (§5.5)** — outcomes-focused, tied to defined targets, a **10x+ floor framed as a reasoning model anchored in the client's own numbers**, plus the qualitative "company brain" flywheel. Prominent + woven across the site, *not* buried in FAQ. Honesty held: a target + reasoning + honest illustration, never a measured-result claim; real cases still to publish (#22/#55).
3. ✅ **RESOLVED (Andy, 2026-06-14): pricing locked.** All numbers set in §5 + `offerings.json` (cohort £3,500; 1:1 from £10k; Leadership Team AI Activation base £14k (≤8) + £2k/head [repriced 2026-06-24, was £15k/≤6]; Phase 0 £5k; cycle £20k; events POA; workshop retired); VAT stated once (+VAT). **Phase-5 reminder:** no 🔧/⚠️ may reach the public site. *Note:* we deliberately do **not** publish a fixed 12-month figure/upper bound (see §5 "Making yes easy") — finance gets an *illustrative* range with caveats, scoped cycle by cycle.
4. **Door 1 vs Door 2 Format B confusable.** Both engage leadership, run DOTS, on-site, produce a 90-day plan. **Action:** one load-bearing routing sentence — Door 1 = move the whole business (leadership is the *start*); Format B = build the leadership team's own capability (leaders are the *end*).

**🟡 MEDIUM** — 5. "Results not recommendations" vs Phase 0's roadmap deliverable (reconcile in copy: produced *with* you, owned by you). · 6. Framework overload (DOTS/Curve/CRISP/TSS) trips the "methodology theatre" alarm — lead with DOTS only at first contact, demote the rest behind "how it works." · 7. Disqualifiers are rhetoric, not structural — the cohort-place-vs-closed-team arbitrage is a real cheap-door loophole; explain the value gap, firm up prices. · 8. Generic hero ("We build human capability with AI systems") loses the 7-second scan — lead with the buyer's problem + proof. · 9. ✅ RESOLVED 2026-06-14: exit/guarantee (full money-back — Phase 0 first session / first two coaching sessions), data/IP ("what you build is yours", light touch), and procurement/discount all answered with founder rulings — see §5 + §7.

**🟢 LOW** — 10. ✅ RESOLVED 2026-06-14: Talks & Events = three confirmed formats, price-on-application, inquiry-led (no fake events calendar). · 11. ✅ RESOLVED 2026-06-14: coaching names closed (1:1 Exec AI Fast Track Coaching / Leadership Team AI Activation / Open Cohort AI Bootcamp for Business Leaders) + the shared-DOTS-engine / three-depths framing is now explicit in §3–§4.2.

---

## 8. Governance & change control

This document is the source of truth for the **offer structure and approved language**. `content/data/offerings.json` is the machine-readable derivation the site renders from. To change anything customer-facing about an offering:

1. Edit the Canon (and bump the version + add a decision-log entry below).
2. Update `content/data/offerings.json` to match.
3. Rebuild; the drift check (`check.js`, planned Check #10) fails if any template hardcodes a value that has drifted from `offerings.json`.

**Decision log** (date · decision · rationale · impacted assets):

- **2026-06-13** · Adopt the design-intent "Two Doors" model as canonical; coaching = one lane, three formats; revive Talks & Events; drop Fractional AI Advisory from v2. · Build had diverged from the carefully-designed model; restore it. · Impacts: `/what-we-do/`, home, DecisionTree, OfferingTable, all offering pages, `offerings.json`.
- **2026-06-14** · v0.2: ran the 4-persona adversarial pass; authored the FAQ/objection bank (§7) and the required-revisions list (§7.5). · Surfaced 4 HIGH gating findings (proof, ROI claim, pricing, Door-1-vs-Format-B confusion) + 22 FAQs. · Impacts: §7, §7.5; feeds #27 (FAQ), #22/#55 (proof), #23 (pricing).
- **2026-06-14 (founder rulings, Andy)** · Decisions 1–2 locked: (a) the offer is a **stackable menu**, not either/or — clients run 2–4 in parallel; (b) coaching names = **1:1 Exec AI Fast Track Coaching · Leadership Team AI Activation · Open Cohort AI Bootcamp for Business Leaders** (Ronseal title + subtitle each); (c) 1:1 re-specced — 6 wks, 75-min remote, async, pre-work audit, bespoke systems, **from £10k**; (d) Leadership Team AI Activation = **base £15k (≤6) + £2k/head, max 12**; (e) cohort **£3,500/place**; (f) Phase 0 **from £5k**, Phase 1+ **from £20k/cycle**; (g) all prices **+VAT** (exclusive) + one international footnote. · Impacts §3, §4.2, §5, §7 + `offerings.json`. **Built coaching/exec pages now stale on duration/price — update in Phase 5.** · Still open: half-day workshop (Decision 3), public headline price, proof/ROI (4), guarantee/legal (5), events (6).
- **2026-06-14 (founder rulings, Andy) — Decisions 3–6, v0.3:** (3) standalone half-day workshop **retired** (workshops live inside offerings / the Leadership Offsite); public headline = **"from £3,500 +VAT"**. (4) ROI multiple **removed** (unmeasured anecdote) — measure + publish a real case soon; **all early clients available as reference calls**. (5) **Full money-back guarantee** — Phase 0 first session / first two coaching sessions; IP = "what you build is yours" (light touch, no NDA detail on site); no discounting, can work within formal processes. (6) Talks & Events = three formats, **price-on-application**, inquiry-led. · **All six decisions resolved — Canon ready for a sign-off read.** Remaining open items are near-term proof work (#22/#55) + Phase-5 build (derive site, Door-1-vs-Format-B routing copy, FAQPage JSON-LD).
- **2026-06-14 (Andy) — v0.4: ROI reframed, outcomes-first.** Replaced "no multiple" with a **standalone "How to think about ROI" (§5.5)** — outcomes-focused, tied to defined results/targets; **10x+ within 12 months as a floor**, framed as a reasoning model anchored in the client's own numbers (capacity / top-line / workforce-multiplier / enterprise-value + the self-healing "company brain" flywheel); flip to *"can you afford not to?"*. It's a **cross-site narrative element** (prominent, referenced in several places), not FAQ filler. Honesty held: a target + reasoning, never an unsubstantiated delivered-result claim; real measured cases still in flight. · Impacts §5, **§5.5 (new)**, §7, §7.5.
- **2026-06-14 (Andy) — "make yes easy" / no 12-month commitment + Phase 0 flow correction.** (a) Added the commercial principle (§5): we don't sell a 12-month programme or run proposal/finance-approval purgatory; commit one Phase 0 then 8 weeks at a time, each cycle entered only with clarity on deliverable + ROI, downside removed by the guarantee, value scoped cycle-by-cycle (may taper to ~£6k/mo advisory). Reworked the "12-month cost" FAQ to match; added the "stuck talking about AI for months" objection-handler ("more in two weeks than the last 6–12 months — first session clears £5–8k or it's free"). (b) Corrected Phase 0 (§4.1) to the real flow — **3 workshops** (Exec DOTS → Team Activation [2.5hr, groups ~20–25, max 30, multiple sessions scale to larger orgs] → Team-level DOTS) **+ playback**; added the boulder→rock→stones granularity link and the **ownership-transfer** narrative (exec steers, team owns). · Impacts §4.1, §5, §7 + `offerings.json`.
- **2026-06-14 (Andy) — founders/origin/credibility (LIGHT capture, v0.5) + titles.** Going light to prioritise shipping v2. Added a draft **§6.5 Founders & origin**: AI-credibility through the buyer's lens (**we're AI-native ourselves** — built agentic/AI-native operating systems, agents/skills/connectors incl. the AX agent hub, in our own business + Accelerator Solutions + clients); origin (both ~2 decades building products 0→1 + teams, joined forces, shared ethos, thrive in ambiguity, distil mess → actionable clarity); the **"why" = genuine partnership** (the moat — agencies/consultancies sell *at* you, we're on your team). **Titles (rough):** Toby = strategy/consulting/partnership; Andy = product/architecture/hands-on implementation. **Specialists:** unnamed (unconfirmed) — point to deep networks mapped to needs. Answered the "who are you two" FAQ. **To tighten later:** 2–3 concrete named AI builds/outcomes per founder + measured client outcomes (#22/#55). · Impacts §1, §6.5 (new), §7.
- **2026-06-14 (Andy) — delivery model: founders + a specialist constellation (answers the capacity/continuity gap).** Founders **orchestrate, architect and stay hands-on** (strategy/DOTS/coaching delivered by a founder personally), **complemented by a hand-picked constellation of senior specialists** (career software engineers; L&D curriculum experts — forming now, growing as we scale). Explicitly *not* the consultancy bait-and-switch; framed via value / risk / continuity / quality / intelligent-tech-+-intelligent-humans. Added a "How we deliver" block (§1), rewrote the capacity FAQ (§7), softened the "only ever us / not a junior" absolutes. **Phase 5:** built pages saying "founder-led, not associates" need the same softening. **About still needs:** real *AI-specific* pedigree (2–3 concrete things each founder has built/run with AI), the true origin story (#24), confirmed titles, and the specialists' intro. · Impacts §1, §7, §7.5 legend.
- **2026-06-14 (Andy) — differentiation vs automation agencies & consultancies.** Added "What makes us different (and who we're not for)" (§1) + two FAQs (§7): the **rare combination** (hands-on technologists + consultants + teachers + coaches), the full **span** (strategy → systems design/architecture/implementation → human capability), and the two contrasts (automation agency = tech-only, dependency stays with them; training/consultancy = no build). Explicit "not for quick-fix buyers"; deliberately *don't over-index on coaching* — the technologist/implementer half is equally real. Flagged **near-term comparison content** ("AX vs …") for SEO/AEO (#43) — not v1 dedicated pages. · Impacts §1, §7 + `offerings.json`.
- **2026-06-24 (Andy) — Leadership Team AI Activation repriced.** Base **£14,000 up to 8 people** (was £15k/≤6) + £2,000/head for 9–12, max 12 → range **£14k–£22k**; **£1,750/person at 8** is now the lowest per-person entry across Door 2. Re-anchored the What We Do hub Door 2 card to *"from £1,750/person in a team programme"* (was the cohort's £3,500/place). · Impacts §4.2, §5 table, §7 FAQ + `offerings.json` + `TwoDoors`/activation page. · **Open:** the public **headline price** (§5 Decision, currently "from £3,500") may want revisiting now that £1,750/person exists — left as-is pending Andy.
- **2026-07-13 (Andy) — v0.6: ROI floor retired (second reversal); founder title/role split removed as a public label.** Caught during B5 (#70) content-honesty walk + its independent fresh-eyes review. **(1) ROI:** the v0.4 "10x+ within 12 months as a floor" framing sat one sentence away from "we won't claim a number we haven't measured in your business" on the live FAQ — the same paragraph asserted and disclaimed a specific multiple, an internal contradiction not caught until this walk. Replaced with **"a return that dwarfs the fee"** — keeps the ambition and the "can we afford not to?" flip, drops the specific multiple/timeframe. The qualitative illustration list (capacity/top-line/workforce-multiplier/enterprise-value + company-brain flywheel) is unaffected — only the hard number goes. **(2) Founder roles:** the §6.5 "Roles (rough)" split (Toby = Strategy & Consulting, Andy = Product & AI) had been compressed into a public role tag on Contact, Homepage, About and the cohort funnel page. Andy: this wrongly implied a rigid functional division — "we both look after most things." Tag removed everywhere; both founders now show as "Co-founder" only. The §6.5 bullets stay as internal bio-writing context, explicitly no longer a public label. · Impacts §5 (Philosophy line), **§5.5**, §6.5, §7 (ROI FAQ), `offerings.json` (`_meta.open_decisions` ROI note), live site: `contact.html`, `homepage-about.html`, `about.html`, `programmes/leadership-cohort.html`, `faq.html` (+ its FAQPage JSON-LD).

---

*End of document. v0.6 — Offer Canon (#57). All founder decisions closed; ROI, differentiation, "make-yes-easy", delivery-model and a draft founders/origin section (§6.5) added; FAQ bank authored. v0.6 (2026-07-13): ROI floor figure retired a second time (contradicted its own honesty guardrail); founder role/title split removed as a public label (§6.5 now internal-context-only). **Remaining (deliberately light — priority is shipping v2):** real measured client-outcome proof (#22/#55), tighten the founders/AI-pedigree specifics (§6.5), and the Phase-5 site build (derive from `offerings.json`).*
- **2026-10-08 (Andy) — Open cohort (C3) reframed and corrected, v0.7.** C3 never started on 21 September; it is open and filling, planned start late October 2026 (date TBC). Format corrected: one 90-min live weekly session (not ~4 hrs/week), discretionary use between sessions, in-person London element for those who can attend, one small-group closing session. Programme now leads with building your own agentic Chief of Staff on Claude, then the method for any other system (system that builds the system → system of systems). No new pages or offerings yet; the op-model end-to-end offering is a later decision.
