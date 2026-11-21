---
title: "How do you know a cheaper AI model is still good enough?"
published: "2026-08-04"
author: "Andy Carroll"
format: "article"
tags: ["Tooling"]
excerpt: "Swap in a cheaper AI model and nothing breaks. It just gets quietly worse, and nothing alerts you. Here is the test that tells you, before production does, whether cheap is good enough."
slug: "how-do-you-know-a-cheaper-ai-model-is-still-good-enough"
bluf: "A cheaper model that is not good enough does not fail. It produces the same confident output, slightly worse, and nothing alerts you because nothing broke. The only way to know in advance is a test: twenty cases with known right answers, run against the candidate, and a decision made on the score."
lead_magnet_cta: "Want a straight answer on where your organisation actually stands with AI? Our free AI Readiness Assessment takes about 10 minutes and gives you a personalised report."
next_article_url: "/insights/articles/the-end-of-prompt-engineering.html"
next_article_title: "The End of Prompt Engineering"
---

## The model got cheaper and the work got quietly worse

The pressure to move AI work onto a cheaper model is constant, and the reasons behind it are good ones: unit prices keep dropping, capable budget models sell for a fraction of the top-tier price, and finance will quite reasonably ask why routine work runs on the expensive option.

So the switch happens. It takes an afternoon. The outputs still arrive, nothing errors, no alarm goes off anywhere. The project is declared a saving and everyone moves on.

Three weeks later, someone in operations mentions that the enquiry summaries feel thinner than they used to. A detail that would have been pulled out in June is missing in July. A customer's actual question sat in the third paragraph of their email and never made it into the summary at all. Nobody can say when it started, because there was no moment when anything visibly changed. No outage, no error rate, no alert, because nothing failed.

That is the specific danger of switching models on price alone, and it is worth being precise about it. A model that is not good enough for a task does not break. It gets quietly worse, in ways nobody notices for weeks.

---

## Nothing failed, so nothing flagged

Ordinary software fails loudly. A payment that does not process throws an error. A page that will not load times out. A calculation that produces nonsense gets caught by the reconciliation it feeds. Decades of operational tooling exist to catch exactly these events, which is why a genuine system failure in most businesses is measured in minutes, not weeks.

Work done by a model has no equivalent. A weaker model given the same task produces the same artefact as a stronger one: grammatical, confident, correctly formatted, on time. The difference is entirely in the judgement inside it, the category chosen, the date extracted, the detail deemed worth keeping. When that judgement is wrong, the output does not look wrong. It looks exactly like the output you have been trusting for months, which is what makes the degradation silent.

Worse, once someone does notice, the conversation has nowhere useful to go. The person who made the switch cannot prove the new model is fine, and the sceptic cannot prove it is not. Two people trade impressions of recent outputs, and the business either switches back out of caution or carries on out of hope. Both moves are guesses. The question that matters is simple to state: how do you know, before you switch, whether the cheaper model is good enough for this specific task? Not good in general. Good enough, for this.

---

## What is an AI eval, in plain terms?

An eval is a test suite for judgement: a fixed set of real cases where the right answer is already known, run against a model, scored by counting how many it gets right. The word is short for evaluation, and if you have heard it from a vendor or an engineer and assumed it named something exotic, it does not. Twenty cases, known answers, a score.

The discipline behind it is one your business already owns. Nobody ships a change to a payment system and hopes. A set of checks must pass before the change goes anywhere near live, and that has been settled engineering practice for decades. Every leader I have met accepts it without argument for software that calculates. An eval is the same discipline applied to work where the output is a judgement rather than a number.

The part people expect to be hard is building the test, and here is the useful surprise: the right answers already exist in your systems, because your team has been producing them for years. Twenty invoices your finance team already coded correctly. Twenty contract dates someone already confirmed the hard way. Twenty enquiries a good operator already routed to the right place. You are not inventing an answer key. You are collecting one your business has already paid for.

---

## One cheap model, two verdicts

Here is what the test looks like end to end, on two tasks you can probably find a version of in your own business this week. Both currently run on an expensive model, and a budget model is the candidate to take them over. One thing has to be true before any of this starts: the work has already cleared the data question. Whether a given model is allowed anywhere near this material at all is a separate decision, and it is the subject of [where the model came from and where your data goes](/insights/articles/where-the-model-came-from-and-where-your-data-goes.html). Nothing below moves work across that line.

Task one is invoice categorisation: each incoming supplier invoice gets coded to a spending category before approval. Twenty past invoices come out of the accounts, with the codes the finance team assigned as the answer key. The current model scores twenty out of twenty. The candidate scores nineteen out of twenty, missing one unusual supplier. Then the deciding question, which is never the score alone: what does a wrong answer cost? Here, a miscoded invoice surfaces at approval or at month end and costs minutes to fix. One miss in twenty, on a task where a human still approves every invoice, at a fraction of the running cost. The task moves, and the same twenty cases keep running monthly afterwards as a standing check, so any future slip shows up in a test rather than in the accounts.

Task two is deadline extraction: pulling notice periods and renewal dates out of supplier contracts to feed the renewals calendar. Twenty clauses, dates confirmed by a person, same method. The candidate scores twelve out of twenty. It misreads relative wording like ninety days before expiry, it misses dates buried in cross-referenced schedules, and it delivers every one of its eight misses with the same confidence as its twelve hits. A wrong date looks exactly like a right date. And a wrong answer here does not cost minutes: a missed notice window renews a contract nobody wanted, and there is no human check downstream to catch it. The task stays on the stronger model.

<figure>
<svg viewBox="0 0 760 420" width="100%" role="img" aria-label="Decision diagram: one cheaper candidate model is scored against twenty known answer cases for each of two tasks. Invoice categorisation scores nineteen out of twenty, and a wrong answer there costs minutes, so the task moves to the cheaper model. Contract deadline extraction scores twelve out of twenty, and a wrong answer there is a missed renewal date, so the task stays on the stronger model." xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="axgate-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8"/>
    </marker>
  </defs>
  <rect width="760" height="420" fill="#FFFFFF"/>
  <g font-family="'DM Sans','Inter',system-ui,sans-serif">
    <text x="20" y="34" font-size="13" font-weight="700" letter-spacing="1.5" fill="#E93F8E">ONE CANDIDATE MODEL &#183; TWO TASKS &#183; TWO VERDICTS</text>
    <!-- lane connectors -->
    <line x1="222" y1="150" x2="304" y2="150" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#axgate-arr)"/>
    <line x1="222" y1="310" x2="304" y2="310" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#axgate-arr)"/>
    <line x1="452" y1="150" x2="552" y2="150" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#axgate-arr)"/>
    <line x1="452" y1="310" x2="552" y2="310" stroke="#94A3B8" stroke-width="1.5" marker-end="url(#axgate-arr)"/>
    <!-- task cards -->
    <rect x="16" y="102" width="200" height="96" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
    <text x="32" y="130" font-size="14" font-weight="700" fill="#1B2A4A">Invoice categorisation</text>
    <text x="32" y="152" font-size="13" fill="#475569">a wrong answer costs</text>
    <text x="32" y="170" font-size="13" fill="#475569">minutes at approval</text>
    <rect x="16" y="262" width="200" height="96" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
    <text x="32" y="290" font-size="14" font-weight="700" fill="#1B2A4A">Contract deadlines</text>
    <text x="32" y="312" font-size="13" fill="#475569">a wrong answer is a</text>
    <text x="32" y="330" font-size="13" fill="#475569">missed renewal date</text>
    <!-- the gate -->
    <rect x="312" y="88" width="136" height="300" rx="10" fill="#FFFFFF" stroke="#1B2A4A" stroke-width="2"/>
    <line x1="312" y1="150" x2="448" y2="150" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="4 4"/>
    <line x1="312" y1="310" x2="448" y2="310" stroke="#E2E8F0" stroke-width="1.5" stroke-dasharray="4 4"/>
    <text x="380" y="192" font-size="13" font-weight="700" letter-spacing="1.2" fill="#E93F8E" text-anchor="middle">THE GATE</text>
    <text x="380" y="218" font-size="13" fill="#475569" text-anchor="middle">20 past cases</text>
    <text x="380" y="238" font-size="13" fill="#475569" text-anchor="middle">known answers</text>
    <text x="380" y="258" font-size="13" fill="#475569" text-anchor="middle">run the candidate</text>
    <text x="380" y="278" font-size="13" fill="#475569" text-anchor="middle">count the hits</text>
    <!-- score pills -->
    <rect x="470" y="134" width="64" height="32" rx="16" fill="#1FBD53"/>
    <text x="502" y="155" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">19/20</text>
    <rect x="470" y="294" width="64" height="32" rx="16" fill="#FEA700"/>
    <text x="502" y="315" font-size="15" font-weight="700" fill="#1B2A4A" text-anchor="middle">12/20</text>
    <!-- verdicts -->
    <rect x="560" y="102" width="184" height="96" rx="8" fill="#FFFFFF" stroke="#1FBD53" stroke-width="2"/>
    <text x="576" y="132" font-size="16" font-weight="700" fill="#1B2A4A">Moves</text>
    <text x="576" y="154" font-size="13" fill="#475569">to the cheaper model,</text>
    <text x="576" y="172" font-size="13" fill="#475569">test reruns monthly</text>
    <rect x="560" y="262" width="184" height="96" rx="8" fill="#FFFFFF" stroke="#FEA700" stroke-width="2"/>
    <text x="576" y="292" font-size="16" font-weight="700" fill="#1B2A4A">Stays</text>
    <text x="576" y="314" font-size="13" fill="#475569">on the stronger model,</text>
    <text x="576" y="332" font-size="13" fill="#475569">retest as models improve</text>
    <text x="380" y="410" font-size="13" fill="#64748B" text-anchor="middle">Stakes set the bar. The score decides. Neither is an opinion.</text>
  </g>
</svg>
<figcaption>One candidate model, two tasks, one method. Twenty known-answer cases per task: invoice categorisation clears the bar at nineteen out of twenty and moves to the cheaper model; contract deadline extraction misses eight of twenty and stays. The verdict belongs to the task, not to the model.</figcaption>
</figure>

Same model, same method, opposite verdicts, and both of them correct. That is the whole point. Whether the cheaper model is any good in general was never an answerable question. Whether it is good enough for this task, at these stakes, is a measurement. And the eight failures that would have leaked into production over a month instead surfaced on a desk in an afternoon.

---

## Why is a documented refusal worth as much as a saving?

Because it turns an assumed boundary into a known one, and known boundaries can be retested. The twelve out of twenty was not the exercise failing. It was the exercise working.

A firm that runs that test holds something most firms do not: a dated score, a list of exactly how the cheap model fails, and a written definition of what good enough means for that task. Models keep improving and prices keep falling, which gives the refusal a useful shelf life. When the next budget model releases, the same twenty cases rerun in an hour. The twelve may well become a nineteen within a couple of releases, and the firm with the test will know the week it happens. The firm without it will find out years later, or never.

Most businesses currently have neither the saving nor the refusal. They have an unexamined default, and it comes in two flavours. Either everything runs on the expensive model out of caution, which quietly taxes every routine task with a premium a measurement would have removed. Or bits of work have already drifted onto cheaper models out of thrift, unmeasured, which is how this piece's opening story happens. Both are guesses wearing a decision's clothes.

There is a harder-edged reason to care, and it is coming from procurement. Expect "show us you are not locked in to one AI vendor" to become a due diligence question over the next couple of years, from customers, investors and regulators alike. A slide of intentions will not answer it. A per-task definition of good enough that exists independently of any vendor, with dated scores against the alternatives, answers it completely, including for the workloads you tested and deliberately chose not to move.

---

## Where to start, and what it actually costs

Here is the rule we run ourselves. Our own business is operated by a fleet of AI agents, and every packaged task we ship to that fleet carries its own test set as a condition of shipping. A cheaper model takes over a task only by passing that task's tests, and a refusal gets recorded with the same care as a move, because the refusal is the proof that the gate is real.

The version you can start in-house is deliberately boring. Pick one task: narrow, high volume, low drama. Pull twenty finished cases from your own records and write the known right answers next to them. Score the model you use today first, because the baseline is occasionally its own surprise. Then score the candidate, and make the call against what a wrong answer costs, never against the score alone.

Be honest about the costs, because there are real ones. The first test takes longer than planned, and most of the overrun is people disagreeing about what the right answer actually is. That argument is not wasted time. It is the first time anyone has defined good in writing for that task, and the definition outlives the argument. The test set needs maintaining as the work changes. And a pass does not make a migration free: there is still real engineering in the move itself. None of it is quick or effortless. It is measurement, and it compounds: every test you build turns the next price drop from a quarter of debate into a week of checking.

Without a test, moving work to a cheaper model is gambling, and the losses arrive silently. With one, it is engineering. That is the entire difference, and it fits in a sentence. How do you know a cheaper AI model is still good enough? You never simply know. You test it, and then you read the score.
