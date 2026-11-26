---
title: "Give AI a Desk, Not a Question: The Setup That Stops You Re-explaining Yourself"
published: "2026-11-26"
author: "Andy Carroll"
format: "article"
tags: ["Capability", "Workflows", "Leadership"]
excerpt: "If every AI chat starts with you explaining who you are and what you need, the tool is working against you. Here is the thirty-minute setup that fixes it, and how to do it this week."
slug: "give-ai-a-desk-not-a-question"
bluf: "Most leaders who stall with AI are using it as a question box: every chat starts from zero, so the output is generic and needs rework. The fix is to give it a desk: say who you are once, give each recurring job its own folder with a short rules file, and let the prompt carry only what is new today."
lead_magnet_cta: "Want a straight answer on where your organisation stands with AI? Our free readiness scorecard takes five minutes and gives you a personalised result."
next_article_url: "/insights/articles/why-ai-pilots-die-in-the-gap.html"
next_article_title: "Why AI Pilots Die in the Gap Between the Demo and Tuesday Morning"
---

## Why does AI output still need so much rework?

Ask a room of founders and managing directors what frustrates them about AI and two answers come up again and again. The output needs reworking before it is any use, and the tool does not understand their business. We heard exactly that from the leaders on our current bootcamp cohort, in their first week.

Both complaints have the same cause. Most people use AI as a question box. You open a chat, explain who you are, explain the situation, ask for the thing, get something generic back, explain again what you meant, and close the window. Tomorrow you start from zero. What the tool lacks is context about you and your business, and you pay for that gap in time, every single chat.

## What does "giving AI a desk" actually mean?

Think about how you would set up a capable new chief of staff on their first day. You would not brief them from scratch every time you asked for something. You would tell them once who you are and how you like to work. You would give them a desk with the relevant files on it. Then each request would be short, because everything else is already in place.

AI works the same way, and the context stacks in three layers:

1. **Who you are, set once.** Your role, your business, who you communicate with, how you like things written, what you never want. Every mainstream assistant has a place for this: Claude calls it Instructions for Claude, ChatGPT calls it custom instructions. It sits behind every chat you have.
2. **What this piece of work is for, set per job.** A folder on your computer for one recurring job, with a short rules file inside it that says what the folder is for, where things go and how to behave.
3. **What you want right now, in the prompt.** Only what is new today. Because the first two layers are doing the heavy lifting, the prompt gets shorter and the result gets better.

Most leaders have only ever used the third layer. That is why it feels like hard work.

## Why a folder, of all things?

A folder is the most ordinary filing system there is, and that is the point: you already know how to use one, and it outlasts any particular chat. In Claude's desktop app you can point a project at a folder on your computer and the assistant reads and saves files there, so what it makes stays somewhere you can find it. Other tools handle files differently, so check what yours supports.

A simple layout that works for most jobs:

- **inputs/** for what you bring in: notes, emails, reports, transcripts.
- **outputs/** for what it makes that is worth keeping, with the date at the front of the file name.
- **reference/** for background it should know but never change.
- **A rules file** at the top. Claude looks for a file called `CLAUDE.md`. Make its first line an instruction to read the whole file before doing anything, then check in a fresh chat that it actually does, rather than assuming it.

## What goes in the rules file?

Less than you think. Here is an illustrative example for a managing director who prepares a board meeting every month. It is made up, but it is the right size:

> **Board prep.** Read this whole file before you do anything in this folder.
> This folder is for preparing our monthly board meeting. Papers for the next meeting go in inputs/. Last quarter's minutes and our three-year plan are in reference/.
> You prepare; I review and circulate. Nothing leaves this folder without me.
> If a figure is not in the papers, leave a visible gap rather than estimating it.
> Lead with the decisions the board needs to make, and put any summary after them.
> Keep anything you write to a single page unless I ask for more.

Notice what is not in there: anything about the person. Who you are belongs in the first layer, once. The rules file only describes the job. Keep the two apart and each one stays short enough to read and easy to change.

## How much time does this save?

We would rather you measured it than took our word for it. The test is simple: after a week, count how many times you had to explain the same background twice. With the setup in place, you should find that number drops, and that you are editing first drafts instead of rewriting them.

That is the shift that matters: you stop doing the part of the job that is pure repetition, so the same leader, with the same team, gets through considerably more of the work that actually needs them.

## What gets in the way?

The honest answer, from watching people do this live: rarely the AI, quite often the laptop. In the first week of our current cohort, several people could not connect the assistant to their folder at all, and most of them were on company-managed Windows laptops. Managed machines can block an assistant from reaching local folders, and cloud-synced folders sometimes show files as "online only", which the assistant cannot open. We have learned to sort this out before anyone sits down to build, not in the middle of it. If you are on a company laptop, a five-minute conversation with whoever runs your IT will save you an hour of frustration.

## What can you do this week?

Set aside thirty minutes and do four things.

1. **Write your standing instructions.** The fastest way is to ask the assistant to interview you for them. Paste this into a new chat:

<div class="bg-surface-2 border-l-4 border-primary rounded-r-xl p-6 lg:p-8" style="margin:2rem 0;">
<p class="ax-kicker ax-kicker--accent" style="margin:0 0 0.75rem;">Copy this prompt</p>
<p class="font-mono text-navy leading-relaxed" style="margin:0;">Interview me, one question at a time, to write my standing instructions: who I am, what I do, who I write for, how I like you to work, and anything you must always or never do. Play back what you understood after each answer. Then draft them in the first person, under 350 words, with nothing confidential, and show me the draft to correct.</p>
</div>

2. **Make one folder** for one job you do every week or every month. Add inputs, outputs and reference inside it.
3. **Write the rules file,** six or seven lines, like the example above. Ask the assistant to draft it from a two-sentence description, then cut it down.
4. **Run one real task** in that folder and notice what you no longer had to explain.

That is the first layer of what we call an AI Chief of Staff: a system you build from your own files and your own way of working, so you stop re-teaching the tool. It is week one of our eight-week [Open Cohort AI Bootcamp for Business Leaders](/what-we-do/leadership-cohort/), where each week adds a layer on top of this one, built on your real work.
