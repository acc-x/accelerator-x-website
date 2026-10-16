# Integrations & Agent Access

> What systems an agent (Claude Code) can reach for this repo, how each is wired, and the
> official docs behind each. Companion to `dns-hosting.md` (registrar/DNS/SSL/email) and
> `agent-skills-shared-ops.md` (shared ops skills).
>
> **Security rule (enforced):** no secrets in this repo — all tokens/keys live in the agent's
> user-scoped config (`~/.claude.json`), Netlify env vars, or the operator's keychain. See
> `.claude/rules/standards.md`. The only key that legitimately lives in code is the **public**
> PostHog browser key in `assets/js/analytics.js` (designed to be client-visible).

Last updated: 2026-06-27

---

## Status at a glance

| System | How wired | State | Used for |
|---|---|---|---|
| **GitHub** | `gh` CLI (keyring) | ✅ Authed as `andy-carroll` | Issues, PRs, milestone tracker, Actions |
| **Netlify MCP** | Remote HTTP MCP | ✅ Authed in-session (verified `get-user`) | Sites, deploys, env vars, logs, DNS |
| **Netlify CLI** | `netlify-cli` global | ✅ Logged in + linked (`Andy-Main` / `accelerator-x`) | Deploys, env, local dev, logs |
| **Netlify skills** | `.claude/skills/netlify-*` | ✅ Installed | Build/deploy best-practice context |
| **PostHog (site)** | `assets/js/analytics.js` | ✅ Live (EU, public key) | Client-side product analytics |
| **PostHog MCP** | Remote HTTP MCP (added by wizard) | ✅ Authed in-session (verified) | Query/manage analytics from the agent |
| **Vercel MCP** | Account-level connector | ✅ Authed (verified `list_teams`) | Manage Vercel projects/deploys |
| **Vercel CLI** | `vercel` global (`54.14.5`) | ⬜ `vercel login` optional (Andy's Vercel empty) | Per-project deploy/link |
| **Brevo** | Netlify function + env vars | ✅ Live | Newsletter capture (list #9) |
| **Slack** | Connected MCP connector | ✅ Available | Lead/exec notifications |
| **Airtable (forms)** | Netlify functions + env vars | ✅ Live (cohort form: 🔑 needs #174 env vars) | Company leads → Accounts; cohort applications → Coaching Enrollments |

Legend: ✅ ready · 🔑 needs a one-time human auth · ⬜ not set up yet.

---

## Scope: what's account-level vs per-repo

Set up once, reused everywhere vs. redone per project:

| Thing | Scope | Redo per repo? |
|---|---|---|
| CLI auth — `gh auth login`, `netlify login`, `vercel login` | Account (token in home dir) | **No** — once, all repos |
| CLI link — `netlify link`, `vercel link` | Per-folder (`.netlify/`, `.vercel/`) | **Yes** — once per repo (~5s) |
| MCP **connectors** (PostHog, Vercel, Slack, Airtable, Notion…) | Account-level | **No** — auto-available everywhere |
| MCP added via `claude mcp add --scope user` (Netlify here) | User config | **No** — all your projects |
| MCP added via `claude mcp add` (default `local` scope) | This repo only | Yes — avoid; use `--scope user` |

**Rule of thumb:** auth once per account; only `*-link` is per-repo. The Netlify MCP was
deliberately promoted to **user scope** so it travels to every repo.

---

## GitHub

- **Wiring:** `gh` CLI, token in macOS keyring. Scopes: `read:org`, `repo`, `workflow`.
- **Account:** `andy-carroll`.
- **Used for:** the [v2 Cutover milestone](https://github.com/andy-carroll/accelerator-x-website/milestone/1)
  and [v2 Launch Board (#77)](https://github.com/andy-carroll/accelerator-x-website/issues/77).
- **Re-auth:** `gh auth login` · **Docs:** https://cli.github.com/manual/

---

## Netlify

The site is hosted on Netlify (pre-built artefacts committed; no build command). Site lives under
**Andy's Netlify account**.

### MCP server (primary agent path)
- **Added with:** `claude mcp add --transport http netlify https://netlify-mcp.netlify.app/mcp`
  (local/project scope in `~/.claude.json`).
- **Auth (one-time, human):** in Claude Code run `/mcp` → `netlify` → authenticate in the browser.
  Status shows `Needs authentication` until done.
- **Capabilities:** read/manage sites & deploys, environment variables, deploy logs, DNS, forms,
  functions, extensions.
- **Docs:** setup guide → https://docs.netlify.com/build/build-with-ai/agent-setup-guides/set-up-claude-code-for-netlify/
  · MCP server → https://github.com/netlify/netlify-mcp
  · MCP in Claude Code → https://code.claude.com/docs/en/mcp
- **Fallback (if remote MCP blocked):** `claude mcp add netlify -- npx -y @netlify/mcp`

### CLI
- **Installed:** `netlify-cli/26.1.0` (`npm install -g netlify-cli`).
- **Auth (one-time, human):** `netlify login` (browser OAuth). Verify with `netlify status`.
- **Link this repo to its site:** `netlify link` (writes `.netlify/state.json`, git-ignored).
- **Deploy types:**
  - `netlify deploy` — draft/preview deploy (safe test)
  - `netlify deploy --prod` — production deploy
  - `netlify deploy --allow-anonymous` — temp URL, expires in 1h unless claimed (no sensitive data)
- **Docs:** https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/
- **Caution:** never commit `.netlify/` config or a personal access token. If SSO is on, the token
  must be authorised for the team.

### Agent skills
- **Installed with:** `npx -y skills add netlify/context-and-tools --skill '*' --yes --agent claude-code`
- **Location:** `.claude/skills/netlify-*` (cli-and-deploy, config, deploy, functions,
  edge-functions, forms, frameworks, identity, image-cdn, blobs, caching, database, ai-gateway,
  agent-runner).
- **Docs / source:** https://github.com/netlify/context-and-tools

---

## PostHog

### On-site analytics (live)
- **Wiring:** `assets/js/analytics.js` — public browser key `phc_…` (safe to be client-visible),
  EU host `https://eu.i.posthog.com`.
- **Docs:** https://posthog.com/docs

### MCP server (agent query/management — pending)
- **Setup (operator runs):** `npx -y @posthog/wizard@latest mcp add` — opens browser, pick **EU**
  region, stores a personal API key in agent config. (Operator chose the wizard path so the key
  never passes through chat or the repo.)
- **Capabilities:** query insights/events, manage feature flags, inspect dashboards from the agent.
- **Docs:** https://posthog.com/docs/model-context-protocol

---

## Vercel

Hosts the AI-readiness quiz (separate Next.js app, **not in this repo**).

- **All Vercel infra is Andy's**, under the **old email `andy@heyandycarroll.com`**. (Toby is not a
  developer — Andy owns all engineering/infra.)
- **MCP connector:** ⚠️ currently authed to the WRONG Vercel account — reported team "Andy
  Carroll's projects" `team_K8DePJtxLfM046gBMy8gDNoV` with **0 projects**, i.e. not the
  `heyandycarroll.com` account that holds the quiz. To fix when needed: Disconnect the Vercel
  connector → reconnect signing into `andy@heyandycarroll.com`.
- **CLI:** `vercel` `54.14.5` installed; `vercel login` not done (optional).
- **Not on the launch critical path:** the quiz (`quiz.accelerator-x.ai`) works (200) and is a
  separate app outside this repo. The only quiz cleanup here (dead `/quiz/aireadiness` redirect) is
  fixed by pointing at the subdomain — no Vercel access required.
- **Docs:** CLI → https://vercel.com/docs/cli

---

## Brevo (email / newsletter)

- **Wiring:** newsletter forms bypass Netlify Forms → `/.netlify/functions/newsletter-subscribe`
  → Brevo API direct. Credentials in Netlify env vars. **List #9 = "Main AX Newsletter".** Sender
  `newsletter@mail.accelerator-x.ai` (authenticated domain).
- **API key:** `BREVO_API_KEY` (Netlify env). No IP restriction. ⚠️ Was found **deactivated** on
  2026-06-27 (Brevo: "API Key is not enabled") — newsletter signups were silently failing to reach
  Brevo (the function fails-soft, so Slack still fired and users saw success). Reactivated; verified
  writing to list #9. If it ever shows "not enabled" again, reactivate in Brevo → Settings → SMTP &
  API → API Keys.
- **Fails-soft caveat:** the function swallows Brevo errors so a dead key won't surface to users —
  scan Slack `#website-leads` to recover any signups missed during an outage.
- **Docs:** https://developers.brevo.com/

---

## Website form functions (Airtable + Slack)

Each signup type writes to its own place (#172, 2026-10-15). Never route one form's data
into another's table.

| Function | Form | Writes to | Slack | Env vars |
|---|---|---|---|---|
| `lead-capture` | General apply form (`ApplyForm`, `/contact/` + homepage) | CRM & Delivery › **Accounts** | `#website-leads` | `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE`, `SLACK_WEBHOOK_URL` |
| `cohort-application` | Cohort form (`CohortApplyForm`, `/what-we-do/leadership-cohort/`) | CRM & Delivery › **Coaching Enrollments** (`tblFNkbk58DhsRZed`), linked to the open cohort | `#cohort-applications` (falls back to `#website-leads`) | `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `SLACK_COHORT_WEBHOOK_URL`, `COHORT_PROGRAMME_RECORD_ID` |
| `newsletter-subscribe` | Newsletter signup | Brevo list #9 | `#website-leads` | `BREVO_API_KEY`, `SLACK_WEBHOOK_URL` |

- **`COHORT_PROGRAMME_RECORD_ID` is the cohort switch.** Set it to the open cohort's
  Coaching Programmes record (C3: `recc2kh6YWpe4WZOJ`). Change it for the next cohort, or
  leave it empty for waitlist mode (applications saved unlinked, labelled "waitlist" in Slack).
- **Repeat applications (#183):** `cohort-application` reads Coaching Enrollments by email before writing. Same email for the open cohort means no new row, a "Sit tight" message and a repeat ping; an earlier programme flags a returning participant. The read fails open.
- **Verifying an `AIRTABLE_TOKEN` rotation takes two form submissions:** one general apply
  form, one cohort form (they write to different tables).

## Slack

- **Wiring:** connected MCP connector. Channels: `#website-leads` (company leads, newsletter),
  `#cohort-applications` (cohort applications, #174), `#ax-business-building` (exec summaries).
- **Used for:** session exec summaries (human-in-the-loop) and lead alerts.

---

## One-time human auth checklist

These cannot be done by the agent — they need a browser / secret:

- [ ] **Netlify MCP** — `/mcp` → `netlify` → authenticate (re-auth needed after promoting to user scope 2026-06-27)
- [x] **Netlify CLI** — `netlify login`, then `netlify link` in this repo ✅ done 2026-06-27
- [x] **PostHog MCP** — `npx -y @posthog/wizard@latest mcp add` + `/mcp` auth ✅ done 2026-06-27
- [x] **Vercel MCP** — account connector, already authed ✅ 2026-06-27
- [ ] **Vercel CLI** — `vercel login` (optional; account-level, once) — only if Andy adds Vercel projects
