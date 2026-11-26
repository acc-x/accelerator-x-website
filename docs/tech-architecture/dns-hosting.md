# DNS & Hosting Reference

> Single source of truth for how accelerator-x.ai is registered, hosted, and routed.
> If something is down or needs changing, start here.

---

## Quick reference

| What | Who manages it | Where to go |
|------|---------------|-------------|
| Domain registration | Hostinger (Toby's account) | hostinger.com → Domains |
| DNS zone | **Netlify DNS** | app.netlify.com → accelerator-x → Domains → DNS panel |
| Web hosting | Netlify | app.netlify.com → accelerator-x |
| SSL certificate | Netlify (Let's Encrypt, auto) | app.netlify.com → accelerator-x → Domain management → HTTPS |
| Business email | Google Workspace | Google Admin |
| Newsletter sending | Brevo | brevo.com — sender domain `mail.accelerator-x.ai` |
| Quiz subdomain | Vercel (separate app) | Vercel dashboard |

---

## Domain registration

- **Registrar:** Hostinger
- **Registrant account:** `tobiashenry1986@gmail.com` (Toby's)
- **Expiry:** 2028-01-26
- **Auto-renewal:** ON, confirmed by Andy 2026-07-13 (was off as of 2026-06-13)
- The domain registration at Hostinger is now purely administrative (billing/ownership). **Do not touch DNS settings in Hostinger** — DNS is managed entirely by Netlify.

---

## DNS

**Nameservers (Netlify DNS — set 2026-06-13):**
```
dns1.p03.nsone.net
dns2.p03.nsone.net
dns3.p03.nsone.net
dns4.p03.nsone.net
```

**To make any DNS change:** go to **Netlify → accelerator-x → Domains → DNS panel**. Do not use Hostinger's DNS zone editor — it is no longer active.

### Full DNS zone (as of 2026-06-13)

| Name | Type | Value | Purpose |
|------|------|-------|---------|
| `accelerator-x.ai` | NETLIFY | `accelerator-x.netlify.app` | Apex → Netlify (auto-managed) |
| `www.accelerator-x.ai` | NETLIFY | `accelerator-x.netlify.app` | www → Netlify (auto-managed) |
| `quiz.accelerator-x.ai` | CNAME | `12e065e68de4a0b8.vercel-dns-017.com` | Quiz app on Vercel |
| `accelerator-x.ai` | MX (pri 1) | `SMTP.GOOGLE.COM` | Business email (Google Workspace) |
| `accelerator-x.ai` | TXT | `google-site-verification=jDfN4lyvfgQF-IBjYpFMx0qpYVNKCFVVfBSHfqunPA8` | Google verification |
| `accelerator-x.ai` | TXT | `brevo-code:49172414b1f1759991fa8d8074d7665a` | Brevo domain verification |
| `accelerator-x.ai` | TXT | `anthropic-domain-verification-p5gp9k=Sgaz8oIgfDPEy7KNuXbpsEAdL` | Anthropic verification |
| `_dmarc.accelerator-x.ai` | TXT | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | DMARC for apex |
| `brevo1._domainkey.accelerator-x.ai` | CNAME | `b1.accelerator-x-ai.dkim.brevo.com` | Brevo DKIM signing key 1 |
| `brevo2._domainkey.accelerator-x.ai` | CNAME | `b2.accelerator-x-ai.dkim.brevo.com` | Brevo DKIM signing key 2 |
| `mail.accelerator-x.ai` | TXT | `brevo-code:49172414b1f1759991fa8d8074d7665a` | Brevo sending subdomain verification |
| `_dmarc.mail.accelerator-x.ai` | TXT | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | DMARC for sending subdomain |
| `brevo1._domainkey.mail.accelerator-x.ai` | CNAME | `b1.mail-accelerator-x-ai.dkim.brevo.com` | Brevo mail DKIM key 1 |
| `brevo2._domainkey.mail.accelerator-x.ai` | CNAME | `b2.mail-accelerator-x-ai.dkim.brevo.com` | Brevo mail DKIM key 2 |

---

## Web hosting

- **Platform:** Netlify, free tier
- **Site name:** `accelerator-x` → permanent URL `accelerator-x.netlify.app`
- **Deploy model:** pre-built artefacts committed to repo; Netlify serves the repo root as-is (no build command on Netlify). Push to `main` → auto-deploy.
- **Branch preview:** `rebuild/v2` → https://rebuild-v2--accelerator-x.netlify.app

### SSL

Netlify provisions and auto-renews a Let's Encrypt certificate covering `accelerator-x.ai` and `www.accelerator-x.ai`. With Netlify DNS, this is fully automatic — no manual renewal ever needed.

If HTTPS stops working: go to Netlify → Domain management → HTTPS → **"Renew certificate"**. With Netlify DNS managing the zone, this will always succeed.

---

## Email

- **Provider:** Google Workspace
- **MX record:** `SMTP.GOOGLE.COM` (priority 1)
- **Accounts in use:** `andy@accelerator-x.ai`, `toby@accelerator-x.ai`, `hello@accelerator-x.ai`
- Inbound email routes directly to Google — independent of the website or Netlify.

---

## Newsletter (Brevo)

- **Platform:** Brevo, list #9 (Main AX Newsletter)
- **Sending domain:** `mail.accelerator-x.ai`
- **Sender address:** `newsletter@mail.accelerator-x.ai`
- Authentication: SPF via Brevo, DKIM via `brevo1/2._domainkey.mail` CNAMEs, DMARC at `_dmarc.mail`
- Signup flow: form → `/api/newsletter-subscribe` → Brevo API direct (bypasses Netlify Forms)
- **Reply-To: `info@accelerator-x.ai`.** `mail.accelerator-x.ai` has no MX/A record — it's a send-only subdomain, so replies to the bare sender address bounce. The welcome-email automation (list #9 → contact added) has Reply-To set to `info@accelerator-x.ai` (a real Google Workspace inbox) so the "just reply" copy actually works. Fixed and verified live 2026-08-10 (accelerator-x-website#103); same pattern as `reports@mail.accelerator-x.ai` in ax-agent-hub#978.

---

## Quiz app

- **URL:** `quiz.accelerator-x.ai`
- **Platform:** Vercel (separate Next.js app — not in this repo)
- **DNS:** CNAME → `12e065e68de4a0b8.vercel-dns-017.com`
- If the quiz stops loading: check Vercel dashboard first, then verify the CNAME in Netlify DNS panel.

---

## Incident log

### 2026-08-05 — NordVPN Threat Protection blocked `quiz.accelerator-x.ai` — third occurrence of the same failure class

**Andy hit a NordVPN "Threat Protection Pro" block screen** ("We blocked this website for your protection because it's a known phishing site") clicking through to `quiz.accelerator-x.ai` — the first time this failure class has hit the quiz subdomain specifically, rather than the apex domain (the 2026-06-13 and 2026-07-14 incidents below).

**Checked independently before assuming the same cause applied, since the quiz runs on separate infrastructure (Vercel, not Netlify) from the two prior incidents:**
- SSL: valid Let's Encrypt cert, correct `CN=quiz.accelerator-x.ai`, not expired (expires 2026-10-13).
- Headers: clean Vercel/Next.js response — `HTTP/2 200`, `strict-transport-security` present, `server: Vercel`, `x-vercel-cache: HIT` with an `age` header showing **this exact response has been served unchanged for ~18 days** — not the signature of a freshly-compromised or altered page.
- Content: fetched directly and read in full — the real "Is your organisation ready for AI?" landing page, no injected scripts, no credential-harvesting form, no unexpected redirects. Matches what it's supposed to be.
- No public security-researcher writeups or news coverage of this domain found via web search — not itself proof of anything, but a mild signal against "known, actively-discussed phishing domain."

**Andy checked Google Safe Browsing's transparency report directly** (`transparencyreport.google.com/safe-browsing/search?url=quiz.accelerator-x.ai`, tooling in this session was policy-blocked from it): **"Current status: No available data."** Distinct from Google's normal clean verdict ("No unsafe content found") — this means Google hasn't crawled/classified this specific subdomain either way, not that it actively verified it safe. But it rules out the scarier possibility: **Google has no negative data on this domain at all**, so the block isn't sourced from or corroborated by Safe Browsing, and isn't propagating into Chrome's own warnings or the many other tools that lean on Google's feed. It's isolated to whatever proprietary list NordVPN's "Threat Protection Pro" licenses.

**Verdict: very likely the same failure class as the two incidents below** (`.ai` TLD + relatively young DNS/hosting history reading as "new/suspicious" to heuristic classifiers) — now a third occurrence, the first to hit a specific subdomain rather than the apex, and the first with a same-day Google Safe Browsing cross-check ruling out the highest-reach source.

**Resolved (same day): Andy submitted the miscategorisation report to NordVPN**, covering both `quiz.accelerator-x.ai` and `accelerator-x.ai`, via the "Report issue" link on the block screen itself. Report cited: legitimate UK business (Companies House 16974247), the assessment's actual data collection (a work email for a results report — no passwords, no payment details, no phishing-pattern behaviour), the SSL/header/content evidence above, the Safe Browsing "no available data" finding, and the July 2026 precedent below as a second confirmed false positive from the same vendor. **This closes the deferred action from 2026-07-14's entry** — that one was never actually submitted; this is the first time the "submit to NordVPN" lesson has actually been executed rather than logged and left. Awaiting NordVPN's response; no reply mechanism confirmed, so recurrence remains possible until they act on it.

### 2026-07-14 — "prod is fucked" was NordVPN's Threat Protection, not the site

**Minutes after the B10 cutover flip, Andy's laptop rendered the live site as broken and unstyled** (no CSS, duplicated nav, unfamiliar old copy) and a NordVPN browser-extension warning flagged `accelerator-x.ai` as "Unsafe — Phishing". Loaded perfectly on mobile data on the same home WiFi. Turning off the VPN connection itself didn't fix it; **pausing NordVPN's separate "Threat Protection" feature did** — confirmed via NordVPN's own activity log showing `https://accelerator-x.ai` — Malicious website — Blocked.

**The site itself was never broken.** `curl` from an independent sandbox throughout the incident consistently returned `HTTP 200` with correct, current v2 content (matching what was actually deployed) — the broken rendering Andy saw was NordVPN's extension intercepting and replacing the page client-side, not anything the origin served.

**This is the same failure class as the 2026-06-13 Sky Broadband Shield incident below** — a third-party security/content-filtering product heuristically misflagging the domain (again plausibly `.ai` TLD + a relatively recent DNS/nameserver history reading as "new/suspicious"), not a real compromise or outage. Two independent vendors (Sky, NordVPN) have now false-flagged this exact domain the same way.

**Lesson (extending the one below):** when a **specific person** reports the live site as broken/unsafe while it verifies clean from an independent check, suspect a **client-side security product** (ISP content filter, VPN threat-protection, antivirus browser extension) before suspecting the site, DNS, or hosting. Ask what security software/extensions are active before deep-diagnosing the origin. Not yet actioned: submitting `accelerator-x.ai` to NordVPN as miscategorised (same idea as the still-open Sky TODO above) — worth doing if this recurs for another visitor.

### 2026-06-13 (part 2) — CORRECTION: the "outage" was an ISP filter, not DNS

**The site was never actually down.** A full diagnostic on 2026-06-13 proved `accelerator-x.ai` was serving `HTTP 200` from Netlify globally the whole time, with a valid SSL cert and correct DNS. The perceived outage was **Sky Broadband Shield** (Sky's content filter) DNS-blocking the domain *on Andy's home connection only*.

**Evidence:**
- Global DNS (Cloudflare DoH) + direct HTTPS to the Netlify IPs (`63.176.8.218`, `35.157.26.135`) → `HTTP 200, server: Netlify`, cert valid. Those AWS-Frankfurt IPs **are** Netlify (current infra, not legacy `75.2.60.5`).
- From the Sky connection: `http://` redirected to `block.isp.sky.com`; `https://` silently timed out (Sky can't MITM TLS, so it drops the connection → white screen). Confirmed working instantly on mobile data.
- Reputation sweep all clean: Google Safe Browsing, Spamhaus DBL, SURBL, Spamhaus ZEN (IPs). Not on any industry blocklist — this was Sky's own proprietary heuristic (likely `.ai` TLD + recent NS change reading as "new/suspicious").

**This also corrects the 2026-06-11 entry below.** The IP `90.207.238.183` cited there as a "Hostinger parking IP" is in fact **`SKY-BROADBAND / Sky UK Limited`** (confirmed by whois — `netname: SKY-BROADBAND`). It is Sky's block-page server. So the original outage was very likely the *same* Sky filter, misdiagnosed as a nameserver reversion. The Netlify DNS migration was not wrong (it's a better setup and worth keeping), but it did not fix the outage — the filter lifting intermittently created the illusion that it had.

**Resolution / actions:**
- Cleared on Andy's account via Sky Broadband Shield settings (allow-list / protection level).
- TODO: submit `accelerator-x.ai` to Sky as **miscategorised** from the block page → clears it at Sky's network level for all Sky customers, not just one account.
- Site reputation confirmed healthy; email deliverability unaffected.

**Lesson:** if the site is unreachable from one connection but resolves/serves fine globally (test with `dig @1.1.1.1` + `curl --resolve <domain>:443:<ip>`), suspect an **ISP/content filter before DNS**. A `.ai` domain on a consumer ISP with parental/security filtering is a known false-positive pattern.

### 2026-06-11 — ~2-day HTTPS "outage" *(see correction above — root cause was the Sky filter, not this)*

**What was believed at the time:** `accelerator-x.ai` went down on HTTPS around 2026-06-11. The theory was that the domain's nameservers had reverted to Hostinger's parking nameservers (`ns1/ns2.dns-parking.com`) serving a dead parking IP (`90.207.238.183`). **This IP was later confirmed to be Sky's block-page server, not Hostinger's** — so this diagnosis was wrong. Email was unaffected throughout.

**How it was "fixed":** migrated to Netlify-managed DNS. This is a genuinely better setup (Netlify DNS owns the zone, nothing to revert to) and worth keeping — but it was not the actual fix for the outage.

**Lesson:** with Netlify DNS, the nameservers are authoritative for everything. The Hostinger panel is registration-only. Do not make DNS changes in Hostinger.
