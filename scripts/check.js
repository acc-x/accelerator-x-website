#!/usr/bin/env node
'use strict';

// scripts/check.js — codebase standards enforcement
//
// Runs a targeted battery of checks derived from .claude/rules/standards.md.
// Every check here exists because a real violation occurred or was identified
// as a plausible failure mode for this specific codebase.
//
// Usage:  npm run check
// Also:   pre-commit hook (blocks commit on failure)
//         GitHub Actions CI (blocks merge on failure)
//
// Adding a new check: add a function below, call it in main(), add a comment
// explaining which rule it enforces and what real incident prompted it.

const fs   = require('fs');
const path = require('path');

// CHECK_ROOT lets tests/build/check.test.js point the checks at a fixture tree (#134).
// Unset in normal use, where the root is the repo itself.
const ROOT = process.env.CHECK_ROOT
  ? path.resolve(process.env.CHECK_ROOT)
  : path.resolve(__dirname, '..');

// ── Utilities ─────────────────────────────────────────────────────────────────

let violations = 0;
let warnings   = 0;

const fail = (msg) => { console.error(`  ✗  ${msg}`); violations++; };
const warn = (msg) => { console.warn( `  ⚠  ${msg}`); warnings++;   };
const pass = (msg) => { console.log(  `  ✓  ${msg}`);               };

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function filesIn(relDir, ext) {
  const dir = path.join(ROOT, relDir);
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = `${relDir}/${entry.name}`;
    if (entry.isDirectory()) {
      results.push(...filesIn(rel, ext));
    } else if (!ext || entry.name.endsWith(ext)) {
      results.push(rel);
    }
  }
  return results;
}

// Every HTML file npm run build generates — the surface Checks #3 and #8 scan.
// Deliberately excluded (legacy v1 orphans, reconciliation tracked separately):
//   privacy.html / terms.html — v1 legal pages awaiting v2 reconciliation (#87)
// They predate the token/component system and would fail checks written for v2
// output; extending coverage to them belongs to their own tracked rebuilds.
const BUILT_HTML_DIRS = [
  'about',
  'contact',
  'design-system',
  'faq',
  'how-we-work',
  'insights',
  'programmes',
  'talks-events',
  'what-we-do',
];

function builtHtmlFiles() {
  const files = ['index.html'];
  for (const dir of BUILT_HTML_DIRS) {
    files.push(...filesIn(dir, '.html'));
  }
  return files;
}

// Commented-out markup never renders, so tokens/ids/imgs inside it aren't real
// violations (e.g. ProofRow's parked case-tile variant, held in a comment until
// #55 lands a real case study). Blanking rather than deleting keeps reported
// line numbers pointing at the actual file.
function stripHtmlComments(content) {
  return content.replace(/<!--[\s\S]*?-->/g, (comment) => comment.replace(/[^\n]/g, ''));
}

// ── Check 1: No inline <script> blocks in templates ───────────────────────────
// Rule: .claude/rules/standards.md "No inline scripts"
// Incident: inline newsletter handler in _templates/article.html competed with
//   forms.js, silently swallowed events, and took hours to diagnose.

function checkNoInlineScripts() {
  console.log('\n[1] No inline <script> blocks in templates');

  // Matches <script> tags that are NOT external (src=) and NOT structured data (ld+json)
  const INLINE_SCRIPT = /<script(?![^>]*(?:\bsrc=|type=["']application\/ld\+json["']))[^>]*>/gi;

  let clean = true;
  for (const file of filesIn('_templates', '.html')) {
    const content = readFile(file);
    const matches = [...content.matchAll(INLINE_SCRIPT)];
    if (matches.length > 0) {
      fail(`${file} — ${matches.length} inline <script> block(s). Move logic to assets/js/`);
      clean = false;
    }
  }
  if (clean) pass('No inline scripts found in templates');
}

// ── Check 2: No hardcoded secrets in Netlify functions ────────────────────────
// Rule: .claude/rules/standards.md "We never hardcode secrets"
// Incident: SLACK_WEBHOOK_URL hardcoded in lead-capture.js and
//   newsletter-subscribe.js — exposed in public GitHub repo for weeks.

function checkNoHardcodedSecrets() {
  console.log('\n[2] No hardcoded secrets in netlify/functions/');

  const PATTERNS = [
    { re: /hooks\.slack\.com\/services\//i,  label: 'Slack webhook URL' },
    { re: /xoxb-\d{10,}-\d{10,}-\w{20,}/,   label: 'Slack bot token'   },
  ];

  let clean = true;
  for (const file of filesIn('netlify/functions', '.js')) {
    const content = readFile(file);
    for (const { re, label } of PATTERNS) {
      if (re.test(content)) {
        fail(`${file} — hardcoded ${label} detected. Use process.env.* instead`);
        clean = false;
      }
    }
  }
  if (clean) pass('No hardcoded secrets found in functions');
}

// ── Check 3: No unsubstituted build tokens in generated HTML ──────────────────
// Rule: .claude/rules/standards.md — the build is the contract
// Rationale: if a {{token}} appears in built output, the build silently produced
//   a broken page. This catches missed token substitution before it reaches prod.
// Incident: design-system/index.html shipped live with {{site:QUIZ_URL}} hrefs
//   (build-design-system.js only ran resolveComponentTokens) while this check —
//   then scoped to insights/articles/ only — passed clean. Now scans all built HTML.

function checkNoUnsubstitutedTokens() {
  console.log('\n[3] No unsubstituted {{tokens}} in built HTML');

  let clean = true;
  for (const file of builtHtmlFiles()) {
    const content = stripHtmlComments(readFile(file));
    // Find any {{ not inside a <script type="application/ld+json"> block
    // Simple check: just flag any {{ appearance — tokens should never survive the build
    const lines = content.split('\n');
    const hits  = lines
      .map((line, i) => ({ line, n: i + 1 }))
      .filter(({ line }) => /\{\{/.test(line));

    if (hits.length > 0) {
      hits.forEach(({ line, n }) =>
        fail(`${file}:${n} — unsubstituted token: ${line.trim().slice(0, 80)}`)
      );
      clean = false;
    }
  }
  if (clean) pass('All build tokens substituted in built HTML');
}

// ── Check 4: All <script src="..."> references in templates + index.html exist ─
// Rule: .claude/rules/standards.md — dead references must not exist
// Rationale: a missing JS file 404s silently in production. Catches the case
//   where a script is referenced before it is created, or after it is moved.

function checkScriptReferencesExist() {
  console.log('\n[4] All <script src="..."> references resolve to existing files');

  const SRC_ATTR = /<script[^>]+src=["']([^"']+)["']/gi;

  const filesToScan = [
    ...filesIn('_templates', '.html'),
    'index.html',
  ];

  let clean = true;
  for (const file of filesToScan) {
    const content = readFile(file);
    for (const match of content.matchAll(SRC_ATTR)) {
      const src = match[1];
      // Only check local paths (skip CDN/external URLs)
      if (src.startsWith('http') || src.startsWith('//')) continue;
      // Strip leading slash to resolve from repo root
      const resolved = path.join(ROOT, src.replace(/^\//, ''));
      if (!fs.existsSync(resolved)) {
        fail(`${file} — references missing file: ${src}`);
        clean = false;
      }
    }
  }
  if (clean) pass('All script references resolve to existing files');
}

// ── Check 5: CHANGELOG has content under [Unreleased] ────────────────────────
// Rule: .claude/rules/standards.md (completion gates) — CHANGELOG always updated
// This is a warning (not a failure) — there are legitimate moments when
//   [Unreleased] is empty (e.g. immediately after cutting a release).

function checkChangelogHasContent() {
  console.log('\n[5] CHANGELOG [Unreleased] section has content');

  const content = readFile('CHANGELOG.md');
  const section = content.match(/## \[Unreleased\]([\s\S]*?)(?=\n## \[|\n---\n## \[|$)/);

  if (!section) {
    warn('CHANGELOG.md — could not find [Unreleased] section');
    return;
  }

  const body = section[1].replace(/<!--.*?-->/gs, '').trim();
  // Check for at least one ### heading (Added / Changed / Fixed / etc.)
  const hasEntries = /^###\s/m.test(body);

  if (!hasEntries) {
    warn('CHANGELOG.md [Unreleased] has no entries. Add one before shipping.');
  } else {
    pass('[Unreleased] section has content');
  }
}

// ── Check 6: Every "We never" rule in .claude/rules/standards.md is classified ─
// Rule: .claude/rules/standards.md §We never — a rule without enforcement is a wish.
// How it works: every bullet under "## We never" must have an inline HTML comment
//   on the same or following line containing either:
//     <!-- check: <location> -->       — automated, enforced at <location>
//     <!-- not-automatable: <reason> --> — deliberately not automated, reason stated
// Adding a new rule without classifying it causes this check to fail, which blocks
// the commit via the pre-commit hook. The classification is part of the definition
// of done for any new rule.

function checkWeNeverRulesAreClassified() {
  console.log('\n[6] Every "We never" rule in .claude/rules/standards.md is classified');

  const content = readFile('.claude/rules/standards.md');

  // Extract the "We never" section
  const section = content.match(/#+ We never([\s\S]*?)(?=\n#+ |$)/);
  if (!section) {
    warn('.claude/rules/standards.md — could not find "We never" section');
    return;
  }

  const body  = section[1];
  const lines = body.split('\n');

  // Find bullet lines (start with "- ")
  let clean = true;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trimStart().startsWith('- ')) continue;

    // A rule is classified if its line or the immediately following line(s)
    // contain a <!-- check: ... --> or <!-- not-automatable: ... --> annotation
    // ...but never the NEXT bullet's annotation: the window stops at the next bullet,
    // otherwise an unclassified rule slips through beside a classified one (#134).
    let end = i + 1;
    while (end < i + 3 && end < lines.length && !lines[end].trimStart().startsWith('- ')) end++;
    const window = lines.slice(i, end).join(' ');
    const hasCheck          = /<!--\s*check:/i.test(window);
    const hasNotAutomatable = /<!--\s*not-automatable:/i.test(window);

    if (!hasCheck && !hasNotAutomatable) {
      const rule = lines[i].trim().slice(0, 80);
      fail(`.claude/rules/standards.md — unclassified "We never" rule: ${rule}`);
      fail(`  Add <!-- check: <location> --> or <!-- not-automatable: <reason> --> to classify it`);
      clean = false;
    }
  }

  if (clean) pass('All "We never" rules are classified');
}

// ── Check 7: No hardcoded hex colours outside CSS design token definitions ─────
// Rule: .claude/rules/standards.md "We never use hardcoded colour values outside
//   CSS design token definitions"
// Incident: three hex colours found in styles.css outside :root — gradient,
//   hero background, and testimonial star colour — all bypassing the token system.
// How it works: tracks whether each line is inside a :root { } block. Flags any
//   hex colour pattern on a line that is NOT a CSS variable definition (--color-*)
//   and NOT inside :root. Skips comments and SVG data URIs.

function checkNoCssTokenDrift() {
  console.log('\n[7] No hardcoded hex colours outside CSS design token definitions');

  const content = readFile('styles.css');
  const lines   = content.split('\n');

  const HEX_COLOUR = /#[0-9a-fA-F]{3,8}\b/;
  const CSS_VAR_DEF = /^\s*--[\w-]+\s*:/;  // a CSS custom property definition
  const COMMENT     = /^\s*\/\*/;           // a CSS comment line

  let inRoot = false;
  let depth  = 0;
  let clean  = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track :root block entry/exit via brace depth
    if (/^\s*:root\s*\{/.test(line)) { inRoot = true; depth = 1; continue; }
    if (inRoot) {
      depth += (line.match(/\{/g) || []).length;
      depth -= (line.match(/\}/g) || []).length;
      if (depth <= 0) { inRoot = false; depth = 0; }
      continue; // inside :root — all hex values here are valid token definitions
    }

    // Outside :root — flag any hex colour that isn't a variable definition or comment
    if (!HEX_COLOUR.test(line))   continue;
    if (COMMENT.test(line))        continue;
    if (CSS_VAR_DEF.test(line))    continue; // shouldn't happen outside :root but be safe
    if (line.includes('data:image')) continue; // SVG data URIs in CSS

    fail(`styles.css:${i + 1} — hardcoded hex colour outside design tokens: ${line.trim().slice(0, 80)}`);
    fail(`  Replace with var(--color-*). See :root block for available tokens.`);
    clean = false;
  }

  if (clean) pass('No hardcoded hex colours outside design tokens');
}

// ── Check 8: HTML validation on build output ──────────────────────────────────
// Rule: .claude/rules/standards.md — build output must be structurally valid
// Rationale: malformed HTML ships silently. Catches build script regressions
//   before they reach production. Zero dependencies — regex-based spot checks
//   for the most impactful classes of error.
// Checks: <img> without alt (a11y + SEO critical), duplicate id= values per file
// Scope: all built HTML — this check was scoped to insights/articles/ only until
//   the design-system token incident (Check #3) showed the other ~15 built pages
//   were shipping unvalidated.

function checkBuiltHtml() {
  console.log('\n[8] Built HTML validation (alt attributes, duplicate IDs)');

  const IMG_NO_ALT  = /<img(?![^>]*\balt=)[^>]*>/gi;
  // Lookbehind excludes data-*-id="…" attributes — \b alone treats the hyphen in
  // data-error-id="apply-error" as a boundary and miscounts it as a second id.
  const ID_ATTR     = /(?<![-\w])id="([^"]+)"/g;

  let clean = true;

  for (const file of builtHtmlFiles()) {
    const content = stripHtmlComments(readFile(file));

    // Check 8a: <img> tags missing alt attribute
    const imgViolations = [...content.matchAll(IMG_NO_ALT)];
    for (const match of imgViolations) {
      // Skip tracking pixels and decorative patterns that intentionally omit alt
      const tag = match[0];
      if (tag.includes('role="presentation"') || tag.includes('aria-hidden')) continue;
      fail(`${file} — <img> missing alt attribute: ${tag.slice(0, 100)}`);
      clean = false;
    }

    // Check 8b: duplicate id= values within a single file
    const ids   = [];
    const dupes = new Set();
    for (const match of content.matchAll(ID_ATTR)) {
      const id = match[1];
      if (ids.includes(id)) dupes.add(id);
      else ids.push(id);
    }
    for (const id of dupes) {
      fail(`${file} — duplicate id="${id}"`);
      clean = false;
    }
  }

  if (clean) pass('Built HTML: no missing alt attributes or duplicate IDs');
}

// ── Check 9: No hardcoded LinkedIn or site-config URLs in templates ───────────
// Rule: .claude/rules/standards.md — site-wide URLs must use {{site:KEY}} tokens
// Rationale: LinkedIn profile/company URLs and external tool URLs (quiz etc.)
//   must live in scripts/site-config.js. Hardcoding them causes silent drift
//   when URLs change. We ran into this with founder profiles. Comments are
//   excluded; only href/src/content attribute values are flagged.

function checkNoHardcodedSiteUrls() {
  console.log('\n[9] No hardcoded site-config URLs in templates (use {{site:KEY}} tokens)');

  const TEMPLATE_DIRS = ['_templates'];
  const PATTERNS = [
    { label: 'founder LinkedIn profile', re: /href="https?:\/\/(www\.)?linkedin\.com\/in\//i },
    { label: 'company LinkedIn',         re: /href="https?:\/\/(www\.)?linkedin\.com\/company\//i },
    { label: 'quiz URL',                 re: /href="https?:\/\/quiz\.accelerator-x\.ai/i },
  ];

  let clean = true;

  for (const dir of TEMPLATE_DIRS) {
    for (const file of filesIn(dir, '.html')) {
      // Skip design-system docs — they contain demo/documentation content
      if (file.includes('design-system')) continue;

      const lines = readFile(file).split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip HTML comments
        if (/^\s*<!--/.test(line)) continue;
        for (const { label, re } of PATTERNS) {
          if (re.test(line)) {
            fail(`${file}:${i + 1} — hardcoded ${label} URL. Use {{site:KEY}} token from scripts/site-config.js`);
            clean = false;
          }
        }
      }
    }
  }

  if (clean) pass('No hardcoded site-config URLs in templates');
}

// ── Check 10: Offerings derive from offerings.json (no drift) ─────────────────
// Rule: content/data/offerings.json is the single source of truth for offering
//   names/prices (offer-canon.md §8). Templates must inject them via {{offering:…}}
//   tokens, never hardcode them. Modelled on Check 9.
// Incident: the site defined the offer in three contradictory places (#26/#57) —
//   a fabricated "8-Week Transformation Cycle", stale coaching prices, and a dead
//   Fractional Advisory link all shipped. Phase 5 derived everything from the JSON;
//   this check stops it drifting back.
// Enforces:
//   (a) No hardcoded £-prices in templates — use {{offering:…_gbp}} tokens.
//       Exempt: design-system docs, HTML comments, JSON-LD answer text, and a
//       single per-page pricing-detail element marked `data-pricing-note`
//       (for per-head models / worked examples that aren't a single scalar).
//   (b) No references to retired or never-built offerings (status retired-for-v2)
//       or the killed legacy constructs.
//   (c) Slug/template coherence — every live offering has a built template.

function checkNoOfferingDrift() {
  console.log('\n[10] Offerings derive from offerings.json (no hardcoded prices / dead offers)');

  let clean = true;

  // (a) No hardcoded £-prices on the canonical offer surfaces. These are the pages
  //     Phase 5 derives from offerings.json. Deliberately NOT scanned: the funnel
  //     page (_templates/programmes/ — its own conversion page with bespoke
  //     early-bird pricing), competitor-comparison components (AlternativesGrid),
  //     and proof components flagged separately (CaseTile/PricingBlock, #55).
  const IN_OFFER_SURFACE = (file) =>
    file.startsWith('_templates/offerings/') ||
    file.startsWith('_templates/homepage') ||
    file === '_templates/what-we-do.html' ||
    file === '_templates/how-we-work.html' ||
    file === '_templates/components/TwoDoors.html';

  const PRICE_RE = /£\s?\d/;
  for (const file of filesIn('_templates', '.html')) {
    if (!IN_OFFER_SURFACE(file)) continue;
    const lines = readFile(file).split('\n');
    let inJsonLd = false;
    let inComment = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Track multi-line HTML comments and JSON-LD blocks (both may carry £ legitimately).
      if (inComment) { if (line.includes('-->')) inComment = false; continue; }
      if (/<!--/.test(line) && !line.includes('-->')) { inComment = true; continue; }
      if (/^\s*<!--/.test(line)) continue;            // single-line comment
      if (/<script[^>]*application\/ld\+json/.test(line)) inJsonLd = true;
      if (inJsonLd) { if (line.includes('</script>')) inJsonLd = false; continue; }
      if (line.includes('data-pricing-note')) continue; // designated pricing prose
      if (PRICE_RE.test(line)) {
        fail(`${file}:${i + 1} — hardcoded £-price. Use a {{offering:KEY.*_gbp}} token (or mark a single pricing-detail element data-pricing-note).`);
        clean = false;
      }
    }
  }

  // (b) No references to retired / killed offerings.
  const FORBIDDEN = [
    { re: /fractional-advisory/,           label: 'Fractional AI Advisory (retired-for-v2)' },
    { re: /8-week-cycle/,                   label: 'dead /8-week-cycle/ route' },
    { re: /8-Week Transformation Cycle/i,   label: 'fabricated "8-Week Transformation Cycle"' },
  ];
  for (const file of filesIn('_templates', '.html')) {
    if (file.includes('design-system')) continue;
    const lines = readFile(file).split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*<!--/.test(lines[i])) continue;
      for (const { re, label } of FORBIDDEN) {
        if (re.test(lines[i])) {
          fail(`${file}:${i + 1} — reference to ${label}. Removed in Phase 5; do not reintroduce.`);
          clean = false;
        }
      }
    }
  }

  // (c) Slug/template coherence — every live offering with a /what-we-do/ slug has a built template.
  const offerings = JSON.parse(readFile('content/data/offerings.json')).offerings || [];
  for (const o of offerings) {
    if (o.status !== 'live') continue;
    if (!o.slug || !o.slug.startsWith('/what-we-do/')) continue;
    const tpl = `_templates/offerings/${o.key}.html`;
    if (!fs.existsSync(path.join(ROOT, tpl))) {
      fail(`offerings.json — live offering '${o.key}' (${o.slug}) has no template at ${tpl}`);
      clean = false;
    }
  }

  if (clean) pass('Offerings derive from offerings.json — no hardcoded prices or dead offers');
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Accelerator X — Standards Check');
  console.log('  .claude/rules/standards.md enforcement');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  checkNoInlineScripts();
  checkNoHardcodedSecrets();
  checkNoUnsubstitutedTokens();
  checkScriptReferencesExist();
  checkChangelogHasContent();
  checkWeNeverRulesAreClassified();
  checkNoCssTokenDrift();
  checkBuiltHtml();
  checkNoHardcodedSiteUrls();
  checkNoOfferingDrift();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (violations > 0) {
    console.error(`\n  ✗  ${violations} violation(s). Fix before committing.\n`);
    process.exit(1);
  } else if (warnings > 0) {
    console.warn(`\n  ✓  Passed with ${warnings} warning(s).\n`);
  } else {
    console.log('\n  ✓  All checks passed.\n');
  }
}

main();
