---
title: "Before You Build Anything, Get the Plan Torn Apart"
published: "2026-09-06"
author: "Andy Carroll"
format: "article"
tags: ["Frameworks", "Operations"]
excerpt: "Most effort goes into building. Almost none goes into checking whether the plan behind it is actually right. We tore apart the plan for this very article before writing a word of it, and here's the seven-step habit that came out of what it caught."
slug: "before-you-build-anything-get-the-plan-torn-apart"
bluf: "Reviewing a plan before you build anything is one of the highest-leverage habits available: a bad plan is cheap to fix, a bad build is expensive to fix. Here's the seven-step habit, the exact prompt that runs it, and how to do it with nothing but a fresh AI chat."
lead_magnet_cta: "Want a straight answer on where your organisation actually stands with AI? Our free AI Readiness Assessment takes about 10 minutes and gives you a personalised report."
next_article_url: "/insights/articles/how-do-you-know-a-cheaper-ai-model-is-still-good-enough.html"
next_article_title: "How do you know a cheaper AI model is still good enough?"
---

## The plan for this article failed its own review

I sat down to write the plan for this article. Not the article itself: the argument, the structure, the point I wanted to make. First pass took about five minutes.

Then I opened a brand-new chat, no shared history with the one that wrote the plan, and pasted in only the plan itself. I asked for an independent, adversarial review: find every way this fails, don't soften it.

It found a real problem. The plan was leaning on a score comparison from a finished project as its hook, the kind of stat that sounds impressive and proves nothing about what actually mattered. The real mechanism worth teaching had happened earlier: the plan itself had just been reviewed, before anything was built. The hook was measuring the wrong thing.

I revised. Whole cycle, plan to review to fix: about thirty minutes, against five for the first pass.

That is why this article does not open with a stat. It opens with what just happened to it.

The stakes here are small. It's a blog post. But the same five minutes and thirty minutes apply whether what you're reviewing is a blog post, a hiring plan, a pricing change, a system migration, or a client proposal. The mechanism doesn't care what you're building. It only cares whether you checked the plan before you built it.

---

## Most effort goes into building. Almost none goes into deciding what's worth building.

Most people, most of the time, skip straight to building. You want to get something done, so you start doing it: writing the email, building the feature, drafting the proposal. Checking whether the underlying plan is actually right feels like a delay, so it gets skipped.

AI has made this instinct more dangerous, not less. It's now trivial to produce something that looks finished fast: a competent-sounding draft, a plausible-looking build, a slide deck that reads well. The speed doesn't tell you whether the thing being produced is the right thing. It only tells you how quickly you can produce the wrong thing too.

This is what "fix the system, not the output" actually means in practice. Patching a mediocre draft by hand, the way I just did with this article's own first plan, only fixes that one draft. Reviewing the plan before you build fixes every draft that follows from it.

---

## The cheapest place to catch a mistake is the one everyone skips

Change is cheap before anything is built on top of it, and it gets more expensive the more depends on it. This isn't a new idea. Catching a flaw in a plan costs you a rewrite of a paragraph. Catching the same flaw after it has shipped costs you the rebuild, and everything that happened in between.

Here's what the expensive version would have looked like for this article. If the flawed plan had gone straight to a full draft, it would have published with a hook that proved nothing. Readers would have reacted to the wrong argument. Fixing it afterward would have meant a public correction, a rewritten piece, and whatever it cost the people who had already read and shared the wrong version.

Instead, catching it cost about twenty-five extra minutes, once, before any of that happened. That's the whole trade: twenty-five minutes now, or a larger, harder-to-measure cost later, paid by more people, in public.

Add it up and the whole review cycle took five or six times as long as writing a draft and moving on. Depending on the task, and how many passes the review needs, that multiple can run higher.

Said like that, it sounds expensive. Most of us are conditioned to flinch at exactly that kind of number, something costing five times more looks like a bad trade on its face.

It isn't. Twenty-five minutes, paid once, bought exactly what the last two paragraphs described: not paying that same mistake's cost quietly, again and again, and not paying far more than twenty-five minutes the day it finally got found.

<figure>
<svg viewBox="0 0 760 400" width="100%" role="img" aria-label="Stylised line chart showing two costs over how long you keep building on a plan. The cost of an independent, adversarial review is a single flat step, paid once, near the start. The cost of skipping that review starts lower but climbs the longer the flawed plan keeps getting built on, then jumps sharply at the point the mistake is finally discovered and has to be rebuilt.">
<rect x="0" y="0" width="760" height="400" fill="#FFFFFF"/>
<g font-family="'DM Sans','Inter',system-ui,sans-serif">
<text x="70" y="24" font-size="13" font-weight="700" letter-spacing="1.2" fill="#475569">COST OVER HOW LONG YOU KEEP BUILDING ON IT</text>
<text x="620" y="24" text-anchor="end" font-size="13" fill="#64748B">stylised, not measured data</text>
<line x1="70" y1="110" x2="620" y2="110" stroke="#E2E8F0" stroke-width="1"/>
<line x1="70" y1="190" x2="620" y2="190" stroke="#E2E8F0" stroke-width="1"/>
<line x1="70" y1="270" x2="620" y2="270" stroke="#E2E8F0" stroke-width="1"/>
<line x1="70" y1="50" x2="70" y2="340" stroke="#E2E8F0" stroke-width="2"/>
<line x1="70" y1="340" x2="620" y2="340" stroke="#E2E8F0" stroke-width="2"/>
<path d="M 70 300 L 130 246 L 620 246" fill="none" stroke="#088ABF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="620" cy="246" r="4.5" fill="#088ABF"/>
<text x="632" y="250" font-size="13" font-weight="600" fill="#475569">cost of the review</text>
<text x="100" y="93" text-anchor="middle" font-size="12" font-weight="700" fill="#088ABF">PAID ONCE, HERE</text>
<line x1="100" y1="103" x2="100" y2="257" stroke="#088ABF" stroke-width="1.5" stroke-dasharray="3 4"/>
<polygon points="100,257 93,244 107,244" fill="#088ABF"/>
<path d="M 70 320 C 220 300, 340 260, 420 210 C 440 197, 455 187, 468 178" fill="none" stroke="#E93F8E" stroke-width="3" stroke-linecap="round"/>
<line x1="468" y1="178" x2="468" y2="70" stroke="#E93F8E" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>
<path d="M 468 70 L 620 46" fill="none" stroke="#E93F8E" stroke-width="3" stroke-linecap="round"/>
<circle cx="468" cy="178" r="4" fill="#E93F8E"/>
<circle cx="620" cy="46" r="4.5" fill="#E93F8E"/>
<text x="632" y="50" font-size="13" font-weight="600" fill="#475569">cost of skipping it</text>
<text x="474" y="120" font-size="12" font-weight="600" fill="#E93F8E">mistake found → rebuild</text>
<text x="70" y="364" font-size="13" fill="#64748B">day one</text>
<text x="345" y="364" text-anchor="middle" font-size="13" fill="#64748B">weeks in</text>
<text x="620" y="364" text-anchor="end" font-size="13" fill="#64748B">months in</text>
<text x="-210" y="26" transform="rotate(-90)" text-anchor="middle" font-size="13" fill="#64748B">cumulative cost</text>
</g>
</svg>
<figcaption>The review is a flat, one-off cost paid up front. Skipping it looks cheaper at first, but the cost of building on a flawed plan keeps climbing the longer it goes uncaught, then jumps hard the day the mistake is finally found and has to be rebuilt. Fix the plan, or fix the system that produced it. Either beats fixing the output after the fact.</figcaption>
</figure>

---

## A seven-step habit, for anything you build

The same habit applies to anything you build, not just an article. It has seven steps.

1. **Outcome.** One sentence: what does success actually look like, and for whom. For this article, the outcome was a CFO or CEO reader believing that plan-review is worth twenty-five minutes.

2. **Strategy.** The big picture only, no task list yet: given what you're actually trying to do and what you can realistically do about it, what's the play.

3. **Plan.** The strategy made concrete: what will actually get done, in what order, and who owns each part.

4. **Independent, adversarial review.** Before you build anything from the plan, someone with no stake in it being good tries to find every way it fails.

5. **Revise.** Fix what the review found. Only send it back for another review if the plan changed in a real way, not for every small edit.

6. **Execute.** Build the thing.

7. **Independent, adversarial review, again.** The same discipline, this time on the finished thing: does it actually do what the plan said it would, and if not, why. If the answer is no, you fix it before it reaches anyone, the same as any other finding. That's the whole point of doing this before it ships, not after.

---

## Independent and adversarial, defined.

Independent means the reviewer has no stake in the plan being good, no part in writing it, and no context on how or why any choice was made. Adversarial means the reviewer is actively trying to find a way the plan fails, not confirming that it looks fine.

Here's the exact instruction that does both, worth copying as-is:

<div class="bg-surface-2 border-l-4 border-primary rounded-r-xl p-6 lg:p-8" style="margin:2rem 0;">
<p class="ax-kicker ax-kicker--accent" style="margin:0 0 0.75rem;">Copy this prompt</p>
<p class="font-mono text-navy leading-relaxed" style="margin:0;">Perform an independent, adversarial review of this plan. You have no stake in it being good. Find every way it fails, every gap, everything that would only surface once we're already building it. Don't soften it. Only pass it if it earns one.</p>
</div>

Worth being honest about the limit here. A fresh chat with no shared history is still the same underlying model that might have written the plan in the first place, not a genuine stranger. Removing the shared context and the prior confidence removes most of the bias that would otherwise make a reviewer agreeable toward its own earlier work. It doesn't remove all of it. That's still worth doing, and it's still better than asking the same conversation that wrote the plan whether the plan is good.

A colleague can do this too, if they're genuinely uninvolved and have the time. The advantage of an AI reviewer is that it's always available, free to ask, and comes back in seconds rather than whenever your colleague gets to it.

Two things are worth watching either way. A clean review, one that finds nothing, is a real result, not a reason to keep asking until it finds something.

And a review that raises a concern deserves the same scrutiny the plan itself just got: check the finding against what the plan actually needs to achieve, not against how confident the reviewer sounds. The habit is the same discipline in both directions.

Below is exactly how to run this without any special tooling.

---

## Do I need special software to run one?

No special software. Open a brand-new chat with whichever AI assistant you already use, not a reply in an existing conversation and not inside a shared project that carries context. Paste in only the plan and what success looks like, nothing about how it was made or who made it. Ask it neutrally, "here's a plan for X," not "here's my plan," so it has no reason to be generous toward it.

---

## Is it safe to paste a real plan into an AI chat?

Not if it's genuinely sensitive. Don't paste unreleased financials, personal data, or live contract terms into a general-purpose chat without checking your own data-handling policy first. Most plans worth reviewing this way, a project structure, a campaign shape, a process redesign, don't contain anything sensitive to begin with. If yours does, that's a reason to check your policy, not a reason to skip the review.

---

## Isn't this just extra, slower process?

It costs roughly twenty to thirty minutes, once. That's the whole price, and it's cheaper than the rebuild it's protecting against. It isn't a new layer of ongoing process sitting on top of everything else. It's one bounded step, done before the expensive part starts, not a habit of checking and re-checking forever.

---

## Do I need AI expertise to do this?

No. The reviewer only needs the plan and the success criteria, never the underlying tooling or the domain expertise behind it. That's exactly why a fresh, uninformed chat works: it isn't judging whether you know what you're doing, only whether the plan itself holds up against what it's supposed to achieve.

---

## Higher-leverage people, not just faster output

None of this makes anyone faster at typing or building. What it does is stop the wrong thing from being built quickly, which is a different kind of leverage entirely.

For as long as producing things was expensive, effort was the scarce resource, so more of it was almost always worth paying for. AI just made producing things cheap. What's scarce now is judgment: deciding what's actually worth building, and catching what's wrong with it before any of it costs anything.

Producing the right thing more often, checked before it costs anything to be wrong. That's what making people higher-leverage with AI actually means.

This piece is proof of it. Its own plan failed its first review, and got better because of it, before a single paragraph of the finished argument existed.

Whatever you're building next already has a plan, even if it's only in your head. The only real question left is whether anyone's torn it apart yet.
