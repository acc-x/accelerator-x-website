---
title: "Five things to do before you switch AI models"
published: "2026-08-01"
author: "Andy Carroll"
format: "article"
tags: ["Tooling"]
excerpt: "Most teams respond to a rising AI bill by shopping for a cheaper model. Five boring changes come first: they need no new vendor and no new risk, and most of the saving is already sitting in your own configuration."
slug: "five-things-to-do-before-you-switch-ai-models"
bluf: "Most teams reach for a cheaper AI model while most of the saving is still sitting in their own configuration. Five changes, none of which needs a new vendor or a new risk conversation, come first. And the two questions that actually decide where work should run, stakes and sensitivity, are not about price at all."
lead_magnet_cta: "Want a straight answer on where your organisation actually stands with AI? Our free AI Readiness Assessment takes about 10 minutes and gives you a personalised report."
next_article_url: "/insights/articles/where-the-model-came-from-and-where-your-data-goes.html"
next_article_title: "Where the model came from and where your data goes are two different questions"
---

## The cheaper model is the last move, not the first

There is a predictable moment in every serious AI rollout: partway through the first full quarter of real usage, the bill crosses a line, finance asks what happened, and somebody gets sent off to find a cheaper model. It feels like the responsible response. It is usually the wrong first move.

I wrote recently about [why the bill behaves like this](/insights/articles/ai-prices-are-collapsing-and-your-bill-is-still-going-up.html): unit prices are collapsing, but agent-era systems work continuously rather than only when asked, so consumption grows faster than prices fall and total spend climbs anyway. The natural follow-up is what to do about it, and the market's default answer is a procurement answer. Switch to something cheaper.

Switching is a real decision with real costs. A new vendor means new data terms for your lawyers, new failure modes for your engineers, and quality differences that only show up in production. It is also almost always premature, because a first integration nearly always ships with none of the boring savings switched on. Nobody notices at pilot scale, where the bill is a rounding error. The habits that were harmless at fifty requests a day are expensive at fifty thousand.

Worked through in order, on published prices alone, the five changes below take somewhere between 50 and 80 percent off a bill that runs everything at frontier list prices. The exact figure depends on the shape of your workload, not on any cleverness in the buying. They need no new vendor, no new trust decision, and no rebuild.

They are also a useful test of anyone advising you. If someone is pitching GPU clusters or exotic model routing while your integration does not yet have prompt caching turned on, they are selling exoticism, not engineering.

---

## What is prompt caching and why does it come first?

Prompt caching means your provider stores the parts of a prompt that repeat between requests, your system instructions, your policy documents, your reference material, and bills them at a fraction of list price when they are reused. On current published pricing at the major providers, a cached read costs about a tenth of the normal input price, in exchange for a premium of about a quarter the first time the content is written to the cache.

That matters because almost every production AI system sends the same context over and over. An assistant that answers customer emails carries the same tone guide, the same product catalogue and the same escalation rules on every single request, thousands of times a day. Without caching, you pay full price for every repeat. It is the equivalent of couriering the full staff handbook along with every one-line memo.

It comes first because it is the cheapest work on the list: hours of configuration, not weeks of engineering. The test for your technical lead this week is a single question. What is our cache hit rate? If nobody can answer it, that is the finding, and the saving compounds on every request from the day it is fixed.

---

## Batch the work that can wait

Every major provider now runs a batch endpoint: submit work that can tolerate waiting, typically up to a day, and pay half the list price for exactly the same model and exactly the same quality.

This lever gets more valuable every quarter, because the fastest-growing part of most AI bills is not a human waiting for an answer. It is scheduled work. Overnight report drafts, weekly digests, monitoring sweeps, data enrichment, backfills. None of it needs a response in four seconds, and all of it is billed at interactive prices unless someone deliberately moves it.

This is off-peak electricity, sitting in the public price list, waiting to be claimed. The exercise: list every scheduled or background AI job you run, and mark the ones whose output nobody reads within the hour. Those are batch candidates, and moving them is usually a small code change rather than a redesign.

---

## Right-size inside the ladder you already trust

Every serious provider sells a ladder of models, not a single product: a frontier model for genuinely hard reasoning, a mid-tier for everyday work, and a small, fast one for mechanical steps. The spread on list price inside a single vendor's ladder is around five times. At Anthropic, the provider we run our own agent fleet on, as I write, the top of the ladder costs $5 per million input tokens and $25 per million output. The bottom costs $1 and $5.

What makes this lever different from switching vendors is what it leaves intact: the same data terms, the same security review, the same integration, the same account. You are not adding a company to your risk register. You are declining to send the most expensive model in the building to do the filing.

Most real workloads decompose the same way once you look: a few steps that carry judgement, and a long tail of mechanical ones. Extracting fields, reformatting, routing, classifying, summarising. The mechanical tail rarely needs frontier capability, and it is usually most of the volume.

One caveat, and we will not soften it: a downgrade is a claim about quality, and claims about quality get tested, not assumed. Move a task down the ladder only behind a test that proves the smaller model still does the job, and leave that test running afterwards as a tripwire. Anything else is guessing with your output.

---

## Most of your context is dead weight

Every token you send costs money, and most integrations send far too many. System prompts grow by accretion: every incident adds a paragraph, and nobody ever deletes one. Whole documents get pasted in where a retrieved extract would do. Conversation histories get replayed in full when a running summary would carry the same meaning at a twentieth of the length.

Context discipline is the plainest item on an already unsexy list, and it is pure arithmetic: the saving is exactly linear in what you remove. It is also the only lever here that improves quality while it cuts cost. In our experience, a short, sharp instruction gets followed more reliably than the same instruction buried under an inch of attachments.

The check takes an afternoon and it is brutal. Read your longest system prompt and ask, for each paragraph, what would break if it were deleted. If nobody can answer, delete it. Then look at what gets attached by default, and replace the document dumps with retrieval of the two pages that actually matter.

---

## Match the thinking to the stakes

Modern models can be told how hard to think. Reasoning effort is now a setting: turn it up and the model deliberates in more depth, at more cost and more latency; turn it down and it answers quickly. Most integrations set it once, high, for everything, and never look at it again.

That default is expensive in a very specific way. It pays for a week of deliberation on questions that needed a yes by lunchtime. Deep effort is worth every penny on the analysis that ends up in front of a client. It is waste on triage, formatting and routine classification.

The fix is an effort budget per job type rather than one global setting. Deep for the decisions that matter, shallow for the mechanical steps. It is a small configuration change, not a rebuild, and on reasoning-heavy workloads the difference is material.

---

## What should decide where an AI task runs?

Two questions, and neither of them is price. First, stakes: what does a wrong answer cost? Second, sensitivity: whose data does the task touch, and what boundary must that data stay inside? Price gets a vote only after both of those questions have answered.

Everything above this line saves money without moving any work anywhere. But sooner or later somebody will propose moving work: to a cheaper vendor, a cheaper class of model, or infrastructure you control. Those conversations go wrong when they start with the price tag, because price is the only consideration in the room that cannot see risk.

<figure>
<svg viewBox="0 0 760 322" width="100%" role="img" aria-label="Flow diagram in three stages. Stage one: every task, with the questions what is the work, how often does it run, and who acts on the output. Stage two: two questions, stakes meaning what does a wrong answer cost, and sensitivity meaning whose data does it touch. Stage three: a tier, not a model, shown as a four-band ladder ordered by control of your data, from budget model APIs at the bottom, through frontier vendor API and frontier in your cloud, to your own infrastructure at the top. A closing note reads: price never chooses the tier, it only chooses within one." font-family="'DM Sans','Inter',system-ui,sans-serif">
  <text x="20" y="24" font-size="13" font-weight="600" letter-spacing="2" fill="#64748B">PLACEMENT: TWO QUESTIONS BEFORE ANY PRICE</text>
  <rect x="20" y="32" width="32" height="3" fill="#E93F8E"/>
  <rect x="20" y="56" width="188" height="218" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
  <text x="36" y="88" font-size="16" font-weight="700" fill="#1B2A4A">1 &#183; Every task</text>
  <text x="36" y="118" font-size="13" fill="#475569">What is the work?</text>
  <text x="36" y="138" font-size="13" fill="#475569">How often does it run?</text>
  <text x="36" y="158" font-size="13" fill="#475569">Who acts on the output?</text>
  <text x="36" y="236" font-size="13" font-style="italic" fill="#64748B">a task inventory,</text>
  <text x="36" y="254" font-size="13" font-style="italic" fill="#64748B">not a token count</text>
  <line x1="214" y1="165" x2="238" y2="165" stroke="#64748B" stroke-width="2"/>
  <polygon points="238,158 238,172 250,165" fill="#64748B"/>
  <rect x="252" y="56" width="232" height="218" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
  <text x="268" y="88" font-size="16" font-weight="700" fill="#1B2A4A">2 &#183; Two questions</text>
  <rect x="268" y="104" width="200" height="72" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
  <rect x="269" y="110" width="3" height="60" fill="#E93F8E"/>
  <text x="284" y="128" font-size="14" font-weight="700" fill="#1B2A4A">Stakes</text>
  <text x="284" y="148" font-size="13" fill="#475569">what does a wrong</text>
  <text x="284" y="166" font-size="13" fill="#475569">answer cost?</text>
  <rect x="268" y="188" width="200" height="72" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
  <rect x="269" y="194" width="3" height="60" fill="#E93F8E"/>
  <text x="284" y="212" font-size="14" font-weight="700" fill="#1B2A4A">Sensitivity</text>
  <text x="284" y="232" font-size="13" fill="#475569">whose data does it</text>
  <text x="284" y="250" font-size="13" fill="#475569">touch?</text>
  <line x1="490" y1="165" x2="514" y2="165" stroke="#64748B" stroke-width="2"/>
  <polygon points="514,158 514,172 526,165" fill="#64748B"/>
  <rect x="528" y="56" width="212" height="218" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
  <text x="544" y="88" font-size="16" font-weight="700" fill="#1B2A4A">3 &#183; A tier, not a model</text>
  <rect x="544" y="104" width="180" height="32" rx="5" fill="#1B2A4A"/>
  <text x="554" y="125" font-size="13" fill="#FFFFFF">4 &#183; your infrastructure</text>
  <rect x="544" y="143" width="180" height="32" rx="5" fill="#F0F9FF"/>
  <text x="554" y="164" font-size="13" fill="#1B2A4A">3 &#183; frontier, your cloud</text>
  <rect x="544" y="182" width="180" height="32" rx="5" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
  <text x="554" y="203" font-size="13" fill="#1B2A4A">2 &#183; frontier vendor API</text>
  <rect x="544" y="221" width="180" height="32" rx="5" fill="#F1F5F9"/>
  <text x="554" y="242" font-size="13" fill="#1B2A4A">1 &#183; budget model APIs</text>
  <text x="544" y="266" font-size="13" fill="#64748B">&#8593; more control of your data</text>
  <text x="380" y="306" text-anchor="middle" font-size="14" font-weight="600" fill="#1B2A4A">Price never chooses the tier. It only chooses within one.</text>
</svg>
<figcaption>Stakes and sensitivity assign every task to a tier, and the tiers are ordered by how much control you keep over your data. Price picks the model within a tier. A task never moves down the ladder to save money.</figcaption>
</figure>

Here is the pattern from our own fleet. One of our agents does finance work. The steps where it proposes entries in the accounts are decision-bearing: one wrong figure that slips past a tired reviewer costs more than a year of token savings on that path, so those steps run on the most capable tier regardless of price. The same agent's diary checks and formatting steps are mechanical and low blast radius, and they are fair game for the cheapest model that passes the tests. Same agent, two placements, decided by stakes rather than by the price list.

Sensitivity works the same way. A task that drafts marketing copy from public information can run almost anywhere. A task that reads your client contracts has a boundary question to answer before any price question, and for some classes of data the honest answer is that the work should not leave infrastructure you control at any price. Where a model came from and where your data goes are two different questions, and they deserve better than to be settled by a discount.

So the order of operations: harvest the five boring savings first, because they require no new trust decisions at all. Then put every task through the two questions, and let stakes and sensitivity, not the price list, decide where the work belongs. This is the order we hold our own agent fleet to, and it is why we instrument what each of our agents costs per task rather than admiring the total on the invoice.

If you want somewhere to start this week: pull your ten most expensive workloads from your provider dashboard and write three things next to each one. Does its context repeat? Could it wait an hour? What would a wrong answer cost? That single exercise will do more for next year's bill than any model announcement, because it is the beginning of an architecture, and the bill was never really about the models.
