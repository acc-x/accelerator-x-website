# Engineering Standards (enforced)

> The canonical operating doc is **`CLAUDE.md`**. This file holds only the **enforced standards** —
> the rules `scripts/check.js`, the pre-commit hook, and GitHub Actions actually verify.
> A rule without enforcement is a wish, not a rule.

## Philosophy

**We move fast by not making messes.** Speed comes from clarity, not shortcuts. Every decision
carries its rationale at the point of decision; standards are enforced by automation, not memory.
Comments say *why*, never *what* — and point to the spec when deeper context exists.

Plan non-trivial work and get a quick nod before building; live polish passes with Andy iterate
directly.

## We never

Each rule is either automated (enforced by `scripts/check.js` or CI) or explicitly classified as
not-automatable with a stated reason. Adding a rule without classifying it causes `npm run check`
to fail (Check 6).

- Commit without updating `CHANGELOG.md`
  <!-- check: .github/workflows/doc-freshness.yml -->
- Add inline `<script>` blocks to HTML files or templates
  <!-- check: scripts/check.js#1 -->
- Hardcode secrets, URLs, or credentials that belong in environment variables
  <!-- check: scripts/check.js#2 -->
- Leave dead code, dead files, or dead references — remove them, or comment exactly why they
  must stay <!-- not-automatable: requires human judgment about intent and context -->
- Make a change without first understanding why the thing being changed exists
  <!-- not-automatable: requires human judgment; enforced by review -->
- Write a comment that describes *what* code does — only *why* it does it that way
  <!-- not-automatable: requires human judgment about comment content -->
- Use hardcoded colour values outside CSS design token definitions in `assets/css/tokens.css`
  <!-- check: scripts/check.js#7 -->
- Ship built HTML with missing `alt` attributes or duplicate `id` values
  <!-- check: scripts/check.js#8 -->
- Hardcode site-wide URLs or emails defined in `scripts/site-config.js` (LinkedIn
  profiles, company LinkedIn, quiz URL, founder emails) — use `{{site:KEY}}` tokens
  <!-- check: scripts/check.js#9 -->
- Use brand amber (`--ax-amber`) as a text colour: it is 1.96:1 on white. Text uses
  `--ax-amber-text`; amber stays for fills, borders and icons (#229)
  <!-- check: scripts/check.js#11 -->

## No inline scripts

**Never add `<script>` blocks directly in HTML files or templates.** All JavaScript belongs in
`assets/js/` (form handling → `forms.js`, analytics → `analytics.js`, new behaviour → a new
`assets/js/<name>.js` referenced with `<script defer src="...">`). Inline scripts break separation
of concerns and have caused real bugs (competing event listeners, build scripts overwriting
edits). No exceptions — if you're adding a `<script>` block to HTML, stop and externalise it.

## Completion gates (what CI enforces)

A change is not done until:

1. `npm run build` exits 0 — no errors, no warnings.
2. `npm run check` exits 0.
3. `bash scripts/img-audit.sh` exits 0 (if images were touched).
4. `CHANGELOG.md` has an entry describing what changed and why (enforced by doc-freshness CI).
5. Committed with a clear, typed message (`feat`/`fix`/`docs`/`refactor`/`chore`/`style`).
6. Pushed to **the working branch** (current target tracked in `.session-protocol.json` and
   CLAUDE.md "Current State" — never hardcode a branch name in a rule).

## Escalation triggers

Pause and ask a human before:

- destructive operations
- production-impacting deployment changes
- irreversible data changes
- security/privacy-sensitive modifications
