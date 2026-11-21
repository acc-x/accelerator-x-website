---
title: "Where the model came from and where your data goes are two different questions"
published: "2026-08-03"
author: "Toby Henry"
format: "article"
tags: ["Strategy"]
excerpt: "Boards and LPs keep asking one anxious question about AI: whose model is it, and where does our data go? Those are two different questions, and conflating them is producing bad decisions on both."
slug: "where-the-model-came-from-and-where-your-data-goes"
bluf: "Where a model's weights came from and where your data goes when it runs are two different questions. Open weights inside your own boundary send nothing anywhere, whatever their origin, and a Western frontier API is still a residency decision, because your data leaves. Separate the two and most of the anxiety becomes a placement decision you can defend."
lead_magnet_cta: "Want a straight answer on where your organisation actually stands with AI? Our free AI Readiness Assessment takes about 10 minutes and gives you a personalised report."
next_article_url: "/insights/articles/how-do-you-know-a-cheaper-ai-model-is-still-good-enough.html"
next_article_title: "How do you know a cheaper AI model is still good enough?"
---

The question used to arrive from the technology side of the house. This year it is starting to arrive from the other direction: a due-diligence questionnaire from a limited partner with a new section on AI and data handling, a compliance function asking where, precisely, the firm's AI tools send client data, a non-executive who has read something alarming about Chinese models and wants reassurance before the next board meeting.

I have spent twenty years inside large organisations watching how questions like this get handled, and this one usually arrives as a single anxious lump: whose model is this, and where does our data go?

Those are two different questions. They have different answers, different owners and different remedies, and most of the bad AI procurement decisions I have watched over the past two years trace back to treating them as one.

The encouraging part is that separating them takes about a page. Once they are separated, most of the anxiety resolves into a placement decision a leadership team can defend in the LP meeting, in the audit, and in front of its own engineers.

---

## What is the difference between model provenance and data residency?

Provenance asks where the model came from: which lab trained the weights, in which jurisdiction, under what licence, with what visibility into how it was built. Residency asks where the model runs: whose infrastructure performs the work, and therefore where your data travels when the model processes it. The first is a question about the artefact. The second is a question about your boundary.

They are independent. A model with impeccable Western provenance can process your data on infrastructure you will never see. A model of foreign origin can run entirely inside your own cloud account and send nothing anywhere. Every combination of the two exists and is commercially available today.

The market has collapsed them into a single question, usually phrased as "is it safe", and the collapse does real damage in both directions. I have watched a compliance function spend weeks interrogating the nationality of a model's training lab while the same firm's client data flowed daily through a third-party API nobody had mapped. I have watched the opposite too: a blanket ban on open-weight models, imposed on origin grounds, applied to a design in which no data would ever have left the building. Both decisions felt rigorous. Both were answers to the wrong axis.

<figure>
<svg viewBox="0 0 760 560" width="100%" role="img" aria-label="A two by two map. The horizontal axis is residency, where your data goes, running from inference in a vendor's cloud on the left to inference inside your own boundary on the right. The vertical axis is provenance, where the model came from, with closed frontier weights on the top row and open weights of any origin on the bottom row. Top left, frontier API, first party: your data leaves your boundary. Bottom left, hosted open-weight API: your data leaves your boundary. Top right, frontier model in your own VPC, marked as the default for regulated firms: your data stays inside. Bottom right, open weights on your own infrastructure: your data stays inside. Whether data leaves changes only between the columns, never between the rows." font-family="'DM Sans','Inter',system-ui,sans-serif">
  <text x="20" y="30" font-size="13" font-weight="700" letter-spacing="2.5" fill="#E93F8E">TWO QUESTIONS, FOUR POSITIONS</text>
  <rect x="20" y="40" width="32" height="3" fill="#E93F8E"/>
  <text x="297" y="76" font-size="13.5" font-weight="700" letter-spacing="1.2" fill="#1B2A4A" text-anchor="middle">RUNS IN A VENDOR'S CLOUD</text>
  <text x="593" y="76" font-size="13.5" font-weight="700" letter-spacing="1.2" fill="#1B2A4A" text-anchor="middle">RUNS INSIDE YOUR BOUNDARY</text>
  <text transform="rotate(-90 26 276)" x="26" y="276" text-anchor="middle" font-size="13" font-weight="600" letter-spacing="1.2" fill="#088ABF">PROVENANCE &#183; WHERE THE MODEL CAME FROM</text>
  <text x="142" y="174" font-size="13" font-weight="600" fill="#475569" text-anchor="end">closed frontier</text>
  <text x="142" y="192" font-size="13" font-weight="600" fill="#475569" text-anchor="end">weights</text>
  <text x="142" y="366" font-size="13" font-weight="600" fill="#475569" text-anchor="end">open weights</text>
  <text x="142" y="384" font-size="13" font-weight="600" fill="#475569" text-anchor="end">(any origin)</text>
  <rect x="155" y="88" width="284" height="184" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
  <text x="175" y="122" font-size="15" font-weight="700" fill="#1B2A4A">Frontier API, first party</text>
  <text x="175" y="150" font-size="13" fill="#475569">The lab's best models, on the lab's</text>
  <text x="175" y="170" font-size="13" fill="#475569">infrastructure, under contract.</text>
  <circle cx="181" cy="235" r="5" fill="#FEA700"/>
  <text x="193" y="240" font-size="13" font-weight="600" fill="#334155">your data leaves your boundary</text>
  <rect x="451" y="88" width="284" height="184" rx="8" fill="#F8FAFC" stroke="#088ABF" stroke-width="2"/>
  <text x="471" y="122" font-size="15" font-weight="700" fill="#1B2A4A">Frontier model in your own VPC</text>
  <text x="471" y="150" font-size="13" fill="#475569">The same frontier models, served inside</text>
  <text x="471" y="170" font-size="13" fill="#475569">your own cloud account and region.</text>
  <text x="471" y="196" font-size="13" font-weight="600" fill="#E93F8E">The default for regulated firms.</text>
  <circle cx="477" cy="235" r="5" fill="#1FBD53"/>
  <text x="489" y="240" font-size="13" font-weight="600" fill="#334155">your data stays inside</text>
  <rect x="155" y="280" width="284" height="184" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
  <text x="175" y="314" font-size="15" font-weight="700" fill="#1B2A4A">Hosted open-weight API</text>
  <text x="175" y="342" font-size="13" fill="#475569">Open models on someone else's cloud.</text>
  <text x="175" y="362" font-size="13" fill="#475569">Cheap, but your data still travels.</text>
  <circle cx="181" cy="427" r="5" fill="#FEA700"/>
  <text x="193" y="432" font-size="13" font-weight="600" fill="#334155">your data leaves your boundary</text>
  <rect x="451" y="280" width="284" height="184" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
  <text x="471" y="314" font-size="15" font-weight="700" fill="#1B2A4A">Open weights on your</text>
  <text x="471" y="334" font-size="15" font-weight="700" fill="#1B2A4A">own infrastructure</text>
  <text x="471" y="362" font-size="13" fill="#475569">Weights are files. Run here, they send</text>
  <text x="471" y="382" font-size="13" fill="#475569">nothing out, whatever their origin.</text>
  <circle cx="477" cy="427" r="5" fill="#1FBD53"/>
  <text x="489" y="432" font-size="13" font-weight="600" fill="#334155">your data stays inside</text>
  <text x="445" y="490" font-size="13" font-weight="600" letter-spacing="1.2" fill="#088ABF" text-anchor="middle">RESIDENCY &#183; WHERE YOUR DATA GOES</text>
  <line x1="155" y1="502" x2="722" y2="502" stroke="#088ABF" stroke-width="2"/>
  <polygon points="722,496 736,502 722,508" fill="#088ABF"/>
  <text x="445" y="528" font-size="13" fill="#64748B" text-anchor="middle">control of the data boundary increases in this direction</text>
</svg>
<figcaption>The provenance and residency map. Whether your data leaves your boundary changes only as you move between the columns; it never changes as you move between the rows. Most procurement arguments are fought over the rows. The question your compliance function is asking lives in the columns.</figcaption>
</figure>

---

## Weights are files, and files do not send data anywhere

An open-weight model is, in the end, a very large file. Run that file on infrastructure inside your own boundary, your own cloud tenancy or your own hardware, and it sends nothing back to the people who made it: not your prompts, not your documents, not usage telemetry. That holds whatever the file's origin. A Chinese-origin open model running on European hardware inside your boundary sends nothing to China, for the same reason a spreadsheet does not post itself back to its author when you open it.

What remains of the provenance question at that point is real, but it is a different kind of question. Licence terms need reading by someone qualified to read them. Alignment is partly opaque: you cannot fully inspect how a model was trained to behave, so you test the behaviour you care about rather than trusting the label. And there are optics, which I will come to, because for some firms they decide the matter on their own.

What does not remain is a data-flow problem. If someone tells you a locally run open model is leaking data abroad by virtue of its birthplace, they are describing a machine that does not exist. I am not recommending foreign-origin models for regulated work; for most of the firms we advise I would counsel against them, for reasons that have nothing to do with data flow. The point is precision. A board that bans the file while ignoring the boundary has not reduced its risk. It has relocated its attention.

---

## A Western frontier API is still a residency decision

The conflation cuts the other way as well, and this direction is the expensive one, because it hides inside what feels like the safe choice.

When your teams use a frontier model through the vendor's own API, your data leaves your boundary. It is processed on the vendor's infrastructure, in the vendor's tenancy, under a contract. The provenance could not be more reassuring, and the residency position is still this: our client data is processed on somebody else's computers. For most firms and most classes of data that is fine, and I want to be plain about it. The contracts are real, the security work at the major labs is serious, and treating every vendor API as a breach in waiting is its own kind of carelessness.

But "fine for most data" is a conclusion you are entitled to only after you have asked the question for each class of data you hold, and many firms have never asked it once. Fund accounting records, LP personal data, portfolio-company financials inside a live deal window: whether those may be processed outside your boundary, and under what terms, is a decision your regulator and your investors expect you to have made deliberately. "The model is American" is not an answer to that question. It was never the question.

---

## Where should a regulated firm actually run AI workloads?

A regulated firm can run AI workloads in one of four places, ordered by how much of the data boundary the firm controls, and for most the realistic centre of gravity is the third.

The first is the hosted open-weight API: capable open models served cheaply from someone else's cloud. The second is the frontier API: the strongest models available, on the vendor's infrastructure, under contract. Both are perfectly defensible for work on data that is cleared to travel, and both are residency decisions in the sense that matters, because in both your data leaves.

The third is the same frontier capability running inside your own boundary. The hyperscaler platforms, AWS Bedrock and Google Vertex being the recognisable routes, serve frontier models inside your own cloud account and region, with contractual commitments that your data is not used for training. The reason this tier matters is not technical elegance. It is that the boundary it creates is one your auditors already understand: a named cloud account, in a chosen region, inside controls you already attest to every year. For private equity, fintech and legal work it is the realistic default. You pay a modest premium, the newest releases arrive slightly later, and what you buy is an answer that survives the second question in the meeting.

The fourth, genuinely sovereign inference, means open weights on infrastructure you control. It is real, and it is narrow. You buy it for the boundary, never for the bill: the economics only make sense at high, sustained volume, and running model-serving infrastructure is a serious operations discipline, easy to underestimate and hard to staff. Some data genuinely should never leave, and the workloads that touch it belong here. Most firms hold far less of that data than they think.

Two cautions about the ladder. Price picks a model within a tier; it must never pick the tier. And before price moves anything anywhere, the boring housekeeping comes first: my co-founder Andy has written about [the five things to do before you switch AI models](/insights/articles/five-things-to-do-before-you-switch-ai-models.html), and every one of them pays for itself before any new trust decision is required.

---

## Optics are a third axis, and they belong on the record

There is a version of this analysis that stops at the technical truth, and it tends to get its author into trouble, so let me add the axis the engineering conversation usually leaves out.

For a fund that answers to limited partners, "we run a Chinese model" can be reputationally wrong even where it is technically clean. The data flows nowhere, the licence is workable, and the sentence still lands badly in a room whose trust you cannot afford to spend. I have given the same advice more than once, in almost exactly these words: defensible on paper, indefensible in the LP meeting, do not do it.

The governance rule that follows is easy to state. Provenance and residency are explicit, recorded decisions, taken for each class of data, by somebody with the authority to take them, and neither is ever left as a silent default inside a routing layer or a supplier's configuration. In my experience boards will forgive a considered decision that ages badly. What they will not forgive is discovering that a decision this visible was made by nobody, on no particular date, for no reason anyone wrote down.

---

## What does a clean answer look like?

A clean answer takes the shape of a single table. Your classes of data down the side. Two questions across the top: may this class leave our boundary, and under what terms; and separately, whose weights are we comfortable running on it, and who signed that off. Each class placed on the map above, with a name and a date against the placement. That single artefact is worth more in a diligence exercise than any amount of vendor reassurance, because it shows the two questions were separated and actually decided.

We answered them for our own agent fleet before advising anyone else. Most of our own workloads run against a frontier vendor under contract, and that is a recorded residency decision, made with our eyes open, not an accident of whichever tool arrived first. The point is not where we landed. The point is that the decision exists, in writing, and we can defend it line by line.

The honest version of the effort involved: building that table takes one focused sitting and a leadership team willing to be specific. What follows it, the contracts, the VPC plumbing, the evaluation gates that make any later move safe, is real work, measured in months. But that sitting comes first, it costs nothing, and it converts one anxious question into two answerable ones. That is the moment this stops being a source of board-level worry and becomes what it should have been all along: a placement decision, owned, dated and written down.
