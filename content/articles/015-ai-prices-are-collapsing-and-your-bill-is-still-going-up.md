---
title: "AI prices are collapsing and your bill is still going up"
published: "2026-07-30"
author: "Andy Carroll"
format: "article"
tags: ["Strategy"]
excerpt: "Unit prices for AI are falling roughly tenfold a year and total spend is rising anyway, because agents work continuously rather than when asked. Stop forecasting in tokens and start forecasting in work."
slug: "ai-prices-are-collapsing-and-your-bill-is-still-going-up"
bluf: "AI unit prices are collapsing and bills are rising anyway, because agents work continuously and consumption grows faster than prices fall. Never forecast in tokens; forecast in work: tasks, agent-hours, documents processed. Cost per task is a falling curve you ride, not a price you dread."
lead_magnet_cta: "Want a straight answer on where your organisation actually stands with AI? Our free AI Readiness Assessment takes about 10 minutes and gives you a personalised report."
next_article_url: "/insights/articles/five-things-to-do-before-you-switch-ai-models.html"
next_article_title: "Five things to do before you switch AI models"
---

## Both of these things are true

Somewhere this quarter, a finance director will have two browser tabs open at the same time. In the first, a vendor announcement celebrating another price cut: the class of AI model that cost serious money eighteen months ago is now, per unit of work, almost embarrassingly cheap. In the second, the monthly AI invoice. It is up again.

Both tabs are telling the truth. The unit price of machine intelligence is falling faster than anything else on a technology budget, roughly an order of magnitude a year for equivalent capability. And total spend keeps rising anyway, wherever AI is doing real work, for reasons that are structural rather than accidental.

The tempting conclusion is to wait. If it is all getting cheaper, why commit now? Buy later, buy cheaper. That logic works for laptops. It fails for AI, because price is not the only curve that is moving. **The volume of work being done by AI rises faster than the price falls**, and it keeps doing so, because the defining feature of this generation of AI is that it works continuously rather than when asked. Waiting does not hold your spend flat. It means the growth arrives anyway, without a plan attached, and gets its first serious management attention in the week after the invoice that finally gets noticed.

The bill is not misbehaving. The unit it is being measured in is.

## Why is your AI bill rising while prices fall?

Because the price of each task fell and the number of tasks grew faster, and the second effect is bigger than the first. That is the entire mechanism. Naming it precisely matters, because the usual instincts, blaming waste, misuse or a vendor quietly repricing, all point at the wrong fix.

Chat-era AI spent money when a human asked it a question, so spend was bounded by headcount and the working day. Agent-era AI spends money continuously: monitoring inboxes, sweeping pipelines, reconciling records, drafting, researching, checking its own output, on schedules nobody is watching. We run an agent fleet in our own business, and a meaningful share of its work happens while we are asleep. That is not a defect. It is the point. I have argued before that the honest case for AI in most businesses is [the first worker that never gets bored](/insights/articles/why-ai-strategy-is-the-wrong-question.html) of the connective, clerical work everything else depends on. The uncomfortable half of that sentence is that a worker who never gets bored also never clocks off, and never stops running the meter.

Economics has seen this shape before. In 1865, William Stanley Jevons noticed that as steam engines became more efficient, Britain burned more coal, not less: cheaper power made new uses economic, and the new uses swamped the saving. Cheaper cognition behaves the same way. Every time a class of task gets ten times cheaper, somebody finds ten new tasks that were never worth running at the old price. Put the forces on one chart and the confusing invoice becomes legible.

<figure>
<svg viewBox="0 0 760 430" width="100%" role="img" aria-label="Stylised line chart, indexed to today, covering the next two years. From the same starting point, the unit price per task falls steeply, the volume of work done by AI rises much faster, and total spend climbs steadily above today's level despite the falling unit price.">
<rect x="0" y="0" width="760" height="430" fill="#FFFFFF"/>
<g font-family="'DM Sans','Inter',system-ui,sans-serif">
<text x="70" y="24" font-size="13" font-weight="700" letter-spacing="1.2" fill="#475569">THE THREE CURVES, INDEXED TO TODAY</text>
<text x="620" y="24" text-anchor="end" font-size="13" fill="#64748B">stylised, not measured data</text>
<line x1="70" y1="130" x2="620" y2="130" stroke="#E2E8F0" stroke-width="1"/>
<line x1="70" y1="210" x2="620" y2="210" stroke="#E2E8F0" stroke-width="1"/>
<line x1="70" y1="290" x2="620" y2="290" stroke="#E2E8F0" stroke-width="1"/>
<line x1="70" y1="50" x2="70" y2="370" stroke="#E2E8F0" stroke-width="2"/>
<line x1="70" y1="370" x2="620" y2="370" stroke="#E2E8F0" stroke-width="2"/>
<line x1="70" y1="250" x2="620" y2="250" stroke="#64748B" stroke-width="1.2" stroke-dasharray="5 6"/>
<text x="76" y="240" font-size="13" fill="#64748B">today = 100</text>
<path d="M 70 250 C 200 328, 410 350, 620 356" fill="none" stroke="#088ABF" stroke-width="3" stroke-linecap="round"/>
<path d="M 70 250 C 270 246, 460 148, 620 70" fill="none" stroke="#E93F8E" stroke-width="3" stroke-linecap="round"/>
<path d="M 70 250 C 270 248, 480 220, 620 172" fill="none" stroke="#1B2A4A" stroke-width="4" stroke-linecap="round"/>
<circle cx="620" cy="356" r="4.5" fill="#088ABF"/>
<circle cx="620" cy="70" r="4.5" fill="#E93F8E"/>
<circle cx="620" cy="172" r="5" fill="#1B2A4A"/>
<text x="632" y="74" font-size="14" font-weight="600" fill="#475569">volume of work</text>
<text x="632" y="176" font-size="14" font-weight="600" fill="#475569">total spend</text>
<text x="632" y="360" font-size="14" font-weight="600" fill="#475569">unit price per task</text>
<text x="70" y="394" font-size="13" fill="#64748B">today</text>
<text x="345" y="394" text-anchor="middle" font-size="13" fill="#64748B">in a year</text>
<text x="620" y="394" text-anchor="end" font-size="13" fill="#64748B">in two years</text>
<text x="-210" y="26" transform="rotate(-90)" text-anchor="middle" font-size="13" fill="#64748B">relative level</text>
</g>
</svg>
<figcaption>Start all three curves at today's level and let them run. The unit price per task keeps falling, but the volume of work rises faster than the price drops, so total spend still climbs. The bill is not measuring price. It is measuring how much more work now runs. Stylised shapes, not measured data.</figcaption>
</figure>

## Never forecast in tokens

A budget denominated in tokens goes stale within a quarter, and I mean that mechanically, not rhetorically. Between drafting the forecast and presenting it, three things move underneath it. The list price changes: the frontier labs spent last year cutting top-tier prices, in one case by two thirds inside twelve months, while capable budget models now sit at a tenth to a fiftieth of frontier list. The model changes: newer releases routinely do the same job on fewer tokens, or a cheaper tier turns out to handle it perfectly well. And the plumbing changes: repeated context can be cached at a fraction of list price, and scheduled work that can wait runs at half price on published rate cards, without anyone touching the work itself. Any one of these breaks the forecast. All of them happened last year, more than once.

There is a second problem, and it is the one I would fix first: nobody who owns a P&L thinks in tokens. A board that would interrogate a hiring plan line by line will nod a token forecast through, because the unit means nothing to anyone in the room and everyone knows it. The number is not wrong, exactly. It is unfalsifiable in the language of the business, which is worse than wrong.

So the pattern repeats. A pilot costs pennies, so nobody builds any discipline around it. The same capability then gets wired into a schedule and runs day and night, exactly as designed. And the first anyone hears of it is finance asking why the line tripled, a question the token forecast was never capable of answering.

## What should you forecast instead?

Forecast work. Tasks run, documents processed, cases triaged, agent-hours on the jobs you have decided are worth doing: units that survive every price cut and mean something to the people accountable for the money.

The practical form of this is a task inventory, and it is deliberately boring: what work runs, how often it runs, what a wrong answer costs, and whose data it touches. Notice what is not on the list: the model, the vendor, the token price. Prices decay in weeks. A task inventory decays at the speed of your business, which is to say slowly. When the next price cut lands, a token forecast is waste paper; the task inventory simply gets cheaper to run.

The bridge between the two worlds is cost per task: what you spend, divided by the work it bought. That is the number worth watching monthly, because it converts the market's chaos into a trend line you can actually manage against.

I will be honest about the unglamorous part, because we have had to build this for our own fleet: the hard work is attribution. An invoice tells you what you spent. It does not tell you what you bought. Wiring spend back to the task that caused it, agent by agent, job by job, is plumbing, and it is exactly the step most organisations skip. Which is why so many can quote their AI bill to the penny and cannot price a single task on it.

## Cost per task is a curve you ride, not a price you dread

Here is what changes when you denominate in work. Every vendor price cut, every caching improvement, every job moved to a cheaper model that demonstrably handles it, all of it now flows through your accounts as the same thing: a falling cost per task, on a volume of work you chose deliberately. The market's deflation stops being a reason to wait and becomes the tailwind you planned for. You are no longer guessing a price eighteen months out. You are riding a curve that falls in your favour, and measuring the ride.

Seen this way, a rising bill can be exactly what you wanted. If cost per task is falling while volume grows, the constraint on how much useful work your organisation does has moved from price to appetite. The question changes from "why is the bill up?", which has no good answer, to "is the new work worth what it costs?", which a business actually knows how to answer, task by task.

It also explains why waiting fails. The falling curve rewards whoever is positioned on it: the organisation that knows its tasks, attributes its spend, and can move work to cheaper tiers when the evidence supports the move. Cost control in AI is an architecture problem, not a procurement problem. Procurement can negotiate the price of a unit. It cannot decide which work should run, what a wrong answer costs, or whether the cheaper model is genuinely good enough for the job. Those decisions are where the money is.

None of this is quick, and I would distrust anyone who tells you it is. The attribution takes real engineering. The inventory takes real conversations with the people who own the work. The first version of both will be wrong in places. It is still the only approach to AI cost that compounds over time, because everything else on offer is a price negotiation that the next price cut makes irrelevant.

## Start with one page

You do not need a platform, a committee or a procurement cycle to begin. You need one page with four columns: the task, how often it runs, what a wrong answer costs, whose data it touches. Fill it in for the AI work your organisation already runs, including the scheduled work nobody has looked at since it was set up. That is usually where the surprises live.

Then write a second list, and this is the one that predicts your next two years: the work you would run if it cost a tenth of today's price. That list is coming whether or not you write it down. The price curve will make it economic on its own schedule. The only question is whether it arrives into an architecture that can name it, cost it and decide it is worth it, or arrives as next year's confusing invoice.

And if the page turns out to be hard to write, if nobody can quite say what runs, how often, or what a wrong answer would cost, that is not a failed exercise. That is the finding. It is the first gap we go looking for when a business asks us why the price of AI keeps falling and the cost of it keeps going up, and closing it is where the real work starts. The bill is rising because the work is growing. Make the work visible, and the bill stops being a mystery and becomes a decision.
