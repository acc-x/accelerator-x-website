# Customer experience audit: accelerator-x.ai

**Date:** 2026-11-20 · **Asked for by:** Andy · **Scope:** the live site and quiz as a first-time visitor sees them, the lead paths, and the open issue backlog.

**How it was done**

- Walked the live site in Chrome at desktop and narrow widths: homepage, What we do, Company Enablement, Leadership AI Coaching, the open cohort page, How we work, About, Talks & events, FAQ, Contact, Insights and one article.
- Opened the quiz at quiz.accelerator-x.ai and went as far as question 1. The remaining questions were read from the quiz source (the `scorekit` repo). No form was submitted anywhere.
- A separate agent that had never seen this repo did a cold read of the public site only, to test whether a stranger can work out who the site is for (section 3).
- Read the newsletter list and campaign history in Brevo, and all 27 open GitHub issues.
- Not done: traffic numbers. PostHog was not reachable from this session, so nothing here says how many people visit or where they drop off.

---

## 1. Verdict

The site is honest, well built and well written, and it is set up for a business that has more demand than it can serve. Accelerator X has the opposite problem. Three things follow from that.

1. **Nobody is arriving.** One real application in three months, seven newsletter subscribers, one newsletter ever sent. No change to the site fixes this on its own. The site needs a reason for people to come (posts, a newsletter that goes out, the quiz used in outreach, links from LinkedIn).
2. **When someone does arrive, the only door is an application.** Every page ends in "Apply to work with us": 127 instances across all 36 pages, a form with five required text fields and two required choices, and copy that says "we vet every application", "no calendars to book" and "a fit check comes first". There is no way to ask a question, book a call, or see an email address without scrolling past a line telling you to use the form instead.
3. **The offer takes too much working out.** A visitor has to hold about ten named things (Phase 0, Phase 1+, Phase 2…N, Advisory, DOTS, Company Enablement, three coaching formats, three event formats), and the site cannot decide whether there are "two doors" or "three ways in". The most concrete, easiest-to-buy offer, the £3,000 cohort ("Build your own AI Chief of Staff"), is not mentioned in the homepage body at all.

None of this needs a rebuild. The components and the copy are good. The posture is wrong for where the business is.

---

## 2. What the numbers say

| Signal | Value | Source |
|---|---|---|
| Real applications through the general form, 9 Aug to 10 Nov 2026 | 1 | #179 conclusion |
| Newsletter subscribers (list 9) | 7 | Brevo, 2026-11-20 |
| Newsletters sent to that list, ever | 1 (5 Aug 2026, delivered to 3) | Brevo |
| Newsletter drafts waiting | 1 (created 10 Nov 2026) | Brevo |
| Articles published | 19 | sitemap |
| Most recent article | 6 Sep 2026 | /insights/ |
| Quiz length | 30 questions in 7 sections | scorekit source |
| Homepage length | about 16 screens at 600px wide; the form starts 12.5 screens down | measured in Chrome |

---

## 3. Who is this for? The cold read

A fresh agent read only the public site (20 Nov 2026) and was asked who the customer is. Its answer:

> Founder, CEO or MD of a UK owner-managed or mid-sized business who has dabbled in AI and stalled.

| Part of the picture | Confidence | What it was inferred from |
|---|---|---|
| Role: founder, CEO, MD | Medium | Every testimonial is a CEO or founder; form placeholders say "Managing Director"; "a decision-maker who can put the right people in the room" |
| Company size | Low | Never stated on a commercial page. Clues only: "mid-sized businesses" (Insights intro), "leadership team of up to 10, one site" (Phase 0 price FAQ), "a business your size" (one article) |
| Sector | Low | One line: "regulated industries (legal, private equity, manufacturing)" |
| Trigger: tried AI, it has not worked | High | The homepage problem section |

So the stranger got the role and the trigger, and had to guess the size and sector. That is a pass on the feeling and a fail on the facts a buyer uses to decide "this is for a company like mine".

**Where the cold reader said the target blurs**

- A CEO buying company-wide change, against an individual executive buying personal productivity (the cohort).
- The cohort page also addresses someone who leads "a function in an organisation moving too slowly on AI".
- The newsletter is for "founders, directors and CTOs". CTOs appear nowhere else.
- The August articles (model switching, token costs, "Boards and LPs") speak to a far more advanced reader than "you don't yet have a clear path".
- "The same framework we run with corporates" sits beside proof that is all from smaller firms.

**Its overall verdict, condensed:** the right customer recognises themselves in the problem section, grasps "Phase 0, £5k, two weeks, money back" quickly, then loses the thread across nine offers and three framings. Trust is moderate: honest tone, public prices and real named CEOs, with no case study or number. The next step is clear and high-friction. The two strongest assets, the cohort page and the articles, are the least connected to the main path.

**What the offer canon says** (`docs/business-context/offer-canon.md` §2): the ICP is deliberately psychographic. Senior decision-makers (CEO, founder, MD, C-suite, director) who know AI matters, are overloaded and sceptical, and will invest properly. No company size, no sector.

**Why that matters on the page.** A visitor decides whether a site is "for people like me" from demographic cues: size of company, kind of company, job title, a situation they recognise. The site gives almost none above the fold. "AI enablement for ambitious leaders" could be a solo founder or a FTSE director. The clearest descriptions of the customer are buried:

- "Particularly suited to regulated industries (legal, private equity, manufacturing)" appears once, low on the Company Enablement page.
- "leadership teams and mid-sized businesses" appears in the Insights intro.
- "In a business your size… a managing director who has stepped back from an area" appears in the middle of one of Toby's articles, and is the best one-line picture of the buyer anywhere on the site.

---

## 4. The journey, as a customer

Findings are in the order a visitor meets them.

### 4.1 First screen

- **Headline is good.** "Stop buying tools. Start building capability." is clear and has a point of view.
- **No "who".** The eyebrow says "ambitious leaders". Nothing says what size or kind of business.
- **The only button is "Apply to work with us."** A first-time visitor is being asked to apply before they know what the thing is. There is no second, lighter action (see how it works, take the assessment, read a client story).
- **"Phase 0 from £5,000 · 2 weeks"** sits under the button. "Phase 0" is internal language; the visitor has not been told what it is yet. The price and the guarantee are a strength and are worth keeping in plain words.
- **The image is stock.** Known (#89). It matters more than it looks: with no logos and no faces above the fold, there is nothing to say this is a real firm with real clients.

### 4.2 Scrolling the homepage

- The problem section ("You've tried. It hasn't worked.") is the strongest copy on the site.
- **"Three ways in"** on the homepage becomes **"Two doors in"** on What we do. Same three cards.
- The homepage then explains Phase 0, Phase 1, Phase 2…N and Advisory in detail, for the company path only. That is one of three paths getting four cards of explanation before the visitor has seen any proof.
- **Proof comes late.** Three named CEO testimonials (Mercury Global, W R Bennett Group, Track Record Coaching) are real and strong. They sit about nine screens down. There are no client logos, no numbers and no case study anywhere on the site. The FAQ asks "can you show named clients and outcomes?", which is the right question, and the homepage does not answer it early.
- **The cohort is missing.** The homepage body never names the open cohort, its price or its start date. It is the only offer on the site with a fixed price, a date, and a one-minute application.
- **Length.** About 16 screens, ending in a nine-field form.

### 4.3 Understanding the offer

Named things a visitor meets: Company Enablement, Phase 0, Phase 1+, Phase 2…N, Advisory, DOTS (Dream / Obstacles / Triage / Sequence), Executive DOTS, Team activation, Strategy playback, Leadership AI Coaching, 1:1 Exec AI Fast Track Coaching, Leadership Team AI Activation, Open Cohort AI Bootcamp for Business Leaders, AI Keynote, Leadership Offsite, AI Hackathon.

Each page explains its own piece well. Nobody has written the two-sentence version: "Most clients start with X. If you are Y, start with Z."

Smaller things on the offer pages:

- What we do still shows audience sizes for events ("up to 2,000", "10–40 leaders", "40–200"). These were removed from the Talks page in July as unmaintained; the hub card kept them (source: `content/data/offerings.json` `audience_size`).
- What we do labels the £1,750 team price as "open cohort" (already filed, #170).
- "Can we skip Phase 0? No." is a hard line for a company with no inbound. It may be right. It reads as a rule for the firm's convenience.

### 4.4 Getting in touch

This is the biggest problem on the site, and the cheapest to fix.

| What the visitor meets | Where |
|---|---|
| "Apply to work with us" as the only call to action | nav, hero, every page footer band (127 instances across all 36 pages) |
| Five required text fields: name, job title, work email, company, company website | form |
| Two required choices: which offer fits, when you want to start | form |
| "Submit application" | button |
| "We vet every application" | offering pages |
| "No calendars to book" / "There's no calendar to book: a fit check comes first" | homepage, contact, offering pages |
| "We work with a small number of clients at any time" | homepage |
| "Application-shaped enquiries should still use the form above" | contact page, directly above the email address |
| Email address presented as for "press, speaking enquiries, or partnership conversations" | contact page |
| Four button labels that all open the same application form: "Apply to work with us", "Talk to a founder", "Bring us to your team", "Tell us about your event" | across offering pages |
| No free-text message box; the one open question is a single optional line | form |

A senior buyer who is curious but not yet sold has no move. They cannot ask a question, they cannot book 20 minutes, and they are told the email address is not for them. The form also asks them to pick from product names they may not have understood.

What is good and worth keeping: "Real reply within 1 business day", and the promise that a founder reads it.

The apply form rework has been open since 9 August (#97). Its notes already say five required fields on a top-of-funnel form is worth challenging, and that the confirmation message needs replacing.

### 4.5 The cohort page

The best page on the site. "Build your own AI Chief of Staff", eight weeks, £3,000, early January 2027, apply in a minute, two sessions risk-free. A visitor knows what they get, what it costs and what to do.

It is two clicks from the homepage, behind "Leadership AI coaching", and it is not in the nav.

---

## 5. Things that are not true (fix first)

The standing rule is that nothing fabricated ships. These are live now.

| Claim | Reality | Where |
|---|---|---|
| "Weekly dispatch… One email a week" / "One useful note each week" | One newsletter sent, ever (5 Aug). | Newsletter component: Insights hub and all 19 articles (the component appears 57 times across 35 pages). Andy, 2026-11-21: the promise stays and the business commits to sending weekly; see #226 |
| "Take the 4-minute AI Readiness Assessment" | 30 questions. The quiz itself says 10 minutes. | Contact page |
| "takes five minutes" | Same. | CTA at the foot of every article (19) |
| "Join hundreds of organisations who have used this assessment" | Andy: the quiz is unused. | Quiz landing page (scorekit repo) |
| Event audience sizes | Removed elsewhere as unmaintained in July. | What we do hub |
| "We don't subcontract. We don't send associates. You get us." | Retired sitewide in July as false (juniors may be hired). The homepage now says "support from the wider team". | About page (`_templates/about.html:113`) |
| Toby's bio: "including BCG Digital Ventures, Capco and 10x Banking" | BCG Digital Ventures is Andy's. Toby's are Alpha FMC, Capco and 10x Banking. The homepage has it right. | About page (`_templates/about.html:136`) |
| "No calendars to book" | The quiz result ends in "Book Your Free Strategy Session", a Google Calendar link. | Quiz report (scorekit) against homepage, contact and offering pages |

**Facts that disagree with each other** (one of each pair is wrong)

| Subject | Version A | Version B |
|---|---|---|
| Phase 0 on the Company Enablement page | "Three workshops, one playback" | Three cards shown: Executive DOTS, Team activation, Strategy playback. The canon's fourth session, Team-level DOTS, is missing. |
| Length of the 1:1 programme | "A 8-week AI sprint" (page heading, with the typo) | "6-week" (`llms.txt`) |
| Founder experience | "Two decades each" | "Eighteen years" and "17+ years" for Andy |
| How many ways in | "Three ways in" (homepage, coaching page) | "Two doors in" (What we do) |
| What the guarantee covers | "If it isn't valuable, you don't pay" (hero, reads as all of Phase 0) | "After your first session, you decide" (Company Enablement) |
| Named clients | Three named CEOs on the homepage | "We won't invent clients to look bigger than we are… References are available on request" (FAQ), which reads as if there were none to show |

Checked against the offer canon on 2026-11-21 and found consistent, so not listed above: the homepage's "Two DOTS sessions + team activation + AI strategy playback" equals the canon's three workshops plus a playback; and the cohort's "seven live sessions plus the in-person session" equals "eight weekly sessions".

Also inconsistent, though not false: the quiz is called "Quiz" (nav), "AI readiness quiz" (footer), "AI Readiness Assessment" (contact page, quiz itself) and "AI readiness scorecard" (articles). One thing, four names.

**To check, not confirmed here:** the cold reader saw the quiz's public code posting submissions to a webhook on a personal domain rather than a company one. The quiz source reads the address from a public setting (`NEXT_PUBLIC_WEBHOOK_URL`), so the destination was not confirmed from the repo. Worth checking against what the privacy policy says about where lead data goes.

**Housekeeping:** the homepage and About page source carry a commented-out case-study block with placeholder text and a link to `/case-studies/`, which does not exist. It is invisible to visitors and is dead code under the repo's own standards.

---

## 6. The quiz

**What it is today:** a separate app (the `scorekit` repo, last commit 18 July) with its own look: different font, orange highlight, no link back to the main site, browser title "Accelerator-X". Landing page, then seven sections, 30 questions, one dropdown per screen with a Next button, then an email gate, then an on-screen report and a PDF.

**Why it is not working as a lead magnet**

1. **Too long for a cold visitor.** 30 single-question screens is 60-plus clicks before any value.
2. **The questions are written for a large organisation.** "How well integrated are your key data systems?", "Do you have clear data governance policies?", "How much has your organisation invested in AI in the last 12 months?" An owner-manager of a 60-person firm will score badly on things that are not their real constraint, and will not recognise their own situation. The four context questions at the start (role, headcount, industry, why now) and the two at the end (frustrations, what success looks like) are the ones that tell Accelerator X something useful.
3. **The email gate is as heavy as the apply form.** After 30 questions and before any result, it asks for five required fields: name, work email, company, role and company website.
4. **It does not lead anywhere useful.** The result ends in a 45-minute "strategy session" booking, which the main site says it does not do. There is no visible link from the quiz back to the offers, and the main site treats it as a footnote: a nav item called "Quiz" with an external-link arrow, one line on the contact page, and a box under articles.
5. **Claims that do not hold** (section 5).

**What "minor tweaks" could look like:** cut to 10 to 12 questions that match the buyer; one name and one honest duration everywhere; landing page in the main site's design with a link back; a result page that names a next step by score band (cohort for an individual leader, Phase 0 for a team that is stuck); and use it in outreach, where a "3-minute check, here is your score" link gives a cold message a reason to exist.

This is a separate repo and a separate piece of work from the main site.

---

## 7. Blog and newsletter

- **Quality is high.** The article read in full (Toby, "How to choose an AI consultancy") is specific, opinionated and plainly written by someone who has done the work. It also describes the buyer better than the homepage does.
- **Cadence has stopped.** 19 articles from 29 January to 6 September 2026: steady at first, a burst of four in a week around the start of August, one in September, nothing since. A visitor in late November sees a blog that went quiet eleven weeks ago.
- **The hub leads with furniture.** On /insights/ the first screen is a title, three category tiles and a newsletter sign-up. The first article is on the second screen.
- **Articles lead to the quiz and the newsletter, not to a conversation or an offer.** For the consultancy-choice article in particular, the natural next step is "talk to us" or the cohort.
- **The newsletter promise is the problem, not the newsletter.** Seven subscribers is what you would expect from no traffic. Promising weekly and sending once is the part to fix.
- **Topics drift technical.** Five of the last six articles are about model pricing, switching models and plan review. Useful, and aimed more at a builder than at the MD the site sells to.

Cohort training material as a source for posts is a good idea: it is already tested on the exact audience, and each session is a ready-made "here is what a room of leaders got stuck on" piece.

---

## 8. Open issues sweep

27 open. Grouped by what should happen to them.

**Close now (work is done or concluded)**

- #179: live check of the general form. Conclusion posted 10 Nov: "no traffic, path healthy".
- #173: Airtable fields for cohort applications. All six created 15 Oct.
- #190: repo-pulse report of 9 Nov. A dated report with no comments, not a task.

**Directly about getting customers, and stuck**

| # | What | Open since | Blocked on |
|---|---|---|---|
| #97 | Rework the apply form | 9 Aug | Andy saying what is wrong with it. This audit answers that. |
| #55 | Real proof: client quotes and a case study | 12 Jun | Founder input |
| #89 | Real photography for the hero | 14 Jul | Founder input |
| #170 | Hub card mislabels the £1,750 price | 14 Oct | A one-line decision |
| #165 | Old cohort funnel page: format, ROI sum, guarantee | 10 Oct | Decision: reconcile or retire |
| #86 | How we work ignores the coaching path | 11 Jul | Nobody |
| #180 | Acknowledgement email to cohort applicants | 15 Oct | Nobody |
| #40 | SEO editorial pass | 7 Jun | Nobody |

**Waiting on Andy to finish a go-live**

- #172: cohort application. Built and live; the Slack webhook, the programme record ID and one real test application are outstanding. Note the programme record still points at Cohort 3, which has started.
- #204: lead form now creates a linked Contact. Merged 10 Nov; production deploy and live check not confirmed.
- #178: Cohort 3 facts in Airtable against the page.
- #154: privacy and responsible-AI page draft, waiting for review.

**Engineering, not urgent:** #133 (accessibility remainder), #123 (rate limiting), #49 (FitCheck component), #186 (open cohorts from Airtable), #64, #30.

**Operating model, parked:** #50, #51, #52, #54. #135 (September improvement programme) is an umbrella whose remaining items are all listed above; it could be closed in favour of them.

Pattern: eight of the 27 carry `founder-input`. The backlog is not short of engineering; it is short of decisions.

---

## 9. Decisions since the audit

| Date | Decision (Andy) |
|---|---|
| 2026-11-20 | Button label becomes "Talk to us". The form is cut to name, work email, company and one open question. |
| 2026-11-20 | The quiz is called "AI Readiness Assessment" and described as "about 10 minutes" until it is shortened. |
| 2026-11-21 | The newsletter keeps its weekly promise; the business commits to sending weekly. The site copy does not change. |
| 2026-11-21 | The public email address is info@accelerator-x.ai. |
| 2026-11-21 | Every change is written up as itemised tickets before anything is built. |

**Tickets filed 2026-11-21.** Tracker: #220. Build tickets: #221 (button label), #222 (contact form), #223 (contact page and gatekeeping copy), #224 (untrue statements), #225 (quiz name and duration). Not site changes: #226 (newsletter goes weekly), #227 (ten founder rulings), acc-x/scorekit#36 (quiz landing page claim). The ticket drafts were checked line by line against the source by an independent reviewer before filing.

Step 6 below (settle "two doors" or "three ways") is not applied in the first batch: "Two doors in" is the offer canon's locked spine, so it went to the founder rulings ticket.

---

## 10. What to do, in order

**Now: open the front door** (this repo, one pull request)

1. Replace "Apply to work with us" with a plain invitation to talk, everywhere.
2. Cut the form to what is needed to reply: name, work email, company, and one free-text question. Everything else optional or gone.
3. Put the email address next to the form as an equal option. Remove the gatekeeping lines.
4. Write a confirmation message that says who replies and when.
5. Fix every item in section 5 that lives in this repo.
6. Settle "two doors" or "three ways" and use one.

**Next: make the homepage say who it is for and show the easy offer**

7. One line in the hero that names the customer.
8. A second, lighter button in the hero.
9. Testimonials moved up to directly after the problem section.
10. The cohort on the homepage with its price and date.
11. Shorten: the Phase 1 / 2…N / Advisory detail belongs on the Company Enablement page.

**Then: give people a reason to come**

12. Ten posts drafted from cohort material, in the founders' voice, for review. Publish on a cadence the newsletter can honestly match.
13. Quiz tune-up (section 6), in the scorekit repo.
14. A case study page from one of the three named clients (#55).

**Decisions only Andy or Toby can make**

- Who the site is for, in demographic terms a visitor would recognise.
- Whether a booking link is acceptable, given "no calendars" has been a deliberate position.
- What the newsletter cadence really is.
- Whether "everyone starts at Phase 0, no exceptions" still holds.
