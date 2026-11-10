'use strict';

// Fixture tests for scripts/check.js (#134). check.js is the content-honesty and token
// drift guard (Checks #1-#10) and a silent failure in it would let a clanger through, so
// every check gets at least one fixture that must fail, plus a clean tree that must pass.
//
// Each test builds a minimal passing tree in a temp dir, mutates one thing, and runs the
// real script against it via CHECK_ROOT.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const CHECK_JS = path.join(__dirname, '../../scripts/check.js');

const BASELINE = {
  '_templates/page.html': '<h1>Hello</h1>\n<a href="/about/">About</a>\n',
  'netlify/functions/fn.js': "module.exports = { handler: async () => ({ statusCode: 200 }) };\n",
  'index.html': '<!doctype html><html><body><img src="a.png" alt="a"><p id="one"></p></body></html>\n',
  'CHANGELOG.md': '# Changelog\n\n## [Unreleased]\n\n### Added\n\n- something\n\n## [1.0.0]\n\n- old\n',
  '.claude/rules/standards.md': '# Standards\n\n## We never\n\n- never hardcode a secret <!-- check: scripts/check.js -->\n',
  'styles.css': ':root {\n  --color-a: #ffffff;\n}\n.a { color: var(--color-a); }\n',
  'content/data/offerings.json': JSON.stringify({ offerings: [] }),
};

// Builds a fixture tree: baseline plus overrides. A null override removes a baseline file.
function run(overrides = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-test-'));
  try {
    const files = { ...BASELINE, ...overrides };
    for (const [rel, content] of Object.entries(files)) {
      if (content === null) continue;
      const abs = path.join(dir, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content);
    }
    const result = spawnSync(process.execPath, [CHECK_JS], {
      env: { ...process.env, CHECK_ROOT: dir },
      encoding: 'utf8',
    });
    return { status: result.status, out: `${result.stdout}\n${result.stderr}` };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function assertFails(overrides, pattern) {
  const { status, out } = run(overrides);
  assert.equal(status, 1, `expected a failing exit code, got ${status}\n${out}`);
  assert.match(out, pattern);
}

function assertPasses(overrides) {
  const { status, out } = run(overrides);
  assert.equal(status, 0, `expected a clean exit, got ${status}\n${out}`);
  return out;
}

test('clean fixture passes every check', () => {
  const out = assertPasses();
  assert.match(out, /All checks passed/);
});

// Check 1: inline scripts
test('check 1 fails on an inline <script> in a template', () => {
  assertFails({ '_templates/page.html': '<script>alert(1)</script>\n' }, /inline <script> block/);
});
test('check 1 allows external scripts and JSON-LD', () => {
  assertPasses({
    '_templates/page.html': '<script src="https://example.com/x.js"></script>\n<script type="application/ld+json">{}</script>\n',
  });
});

// Check 2: hardcoded secrets
// The secret-shaped fixtures are assembled at runtime so no token-looking literal sits in
// this file: GitHub push protection (rightly) blocks anything that matches a secret pattern.
test('check 2 fails on a hardcoded Slack webhook URL in a function', () => {
  const url = ['https://hooks.slack', 'com/services/T000/B000/fixture'].join('.');
  assertFails(
    { 'netlify/functions/fn.js': `const u = '${url}';\n` },
    /hardcoded Slack webhook URL/
  );
});
test('check 2 fails on a hardcoded Slack bot token in a function', () => {
  const token = ['xoxb', '1111111111', '2222222222', 'f'.repeat(24)].join('-');
  assertFails(
    { 'netlify/functions/fn.js': `const t = '${token}';\n` },
    /hardcoded Slack bot token/
  );
});

// Check 3: unsubstituted build tokens
test('check 3 fails on an unsubstituted token in built HTML', () => {
  assertFails(
    { 'index.html': '<html><body><a href="{{site:QUIZ_URL}}">quiz</a></body></html>\n' },
    /unsubstituted token/
  );
});
test('check 3 ignores a token inside an HTML comment', () => {
  assertPasses({ 'index.html': '<html><body><!-- {{site:QUIZ_URL}} --><p>ok</p></body></html>\n' });
});
test('check 3 scans built pages in subdirectories, not just index.html', () => {
  assertFails({ 'what-we-do/index.html': '<p>{{offering:foo.price_gbp}}</p>\n' }, /what-we-do\/index\.html:1 .*unsubstituted token/);
});

// Check 4: script src references resolve
test('check 4 fails on a script src that points at a missing file', () => {
  assertFails(
    { '_templates/page.html': '<script src="/assets/js/missing.js"></script>\n' },
    /references missing file: \/assets\/js\/missing\.js/
  );
});
test('check 4 passes when the referenced file exists', () => {
  assertPasses({
    '_templates/page.html': '<script src="/assets/js/real.js"></script>\n',
    'assets/js/real.js': '// real\n',
  });
});

// Check 5: CHANGELOG [Unreleased] (a warning, not a failure)
test('check 5 warns, and does not fail, when [Unreleased] has no entries', () => {
  const out = assertPasses({ 'CHANGELOG.md': '# Changelog\n\n## [Unreleased]\n\n## [1.0.0]\n\n- old\n' });
  assert.match(out, /\[Unreleased\] has no entries/);
  assert.match(out, /Passed with 1 warning/);
});

// Check 6: "We never" rules are classified
test('check 6 fails on an unclassified "We never" rule', () => {
  assertFails(
    { '.claude/rules/standards.md': '# Standards\n\n## We never\n\n- never do the thing\n- never do the other thing <!-- check: x -->\n' },
    /unclassified "We never" rule: - never do the thing/
  );
});
test('check 6 accepts a not-automatable classification', () => {
  assertPasses({
    '.claude/rules/standards.md': '# Standards\n\n## We never\n\n- never be rude <!-- not-automatable: judgement call -->\n',
  });
});

// Check 7: hardcoded hex colours outside :root
test('check 7 fails on a hex colour outside the :root token block', () => {
  assertFails(
    { 'styles.css': ':root {\n  --color-a: #ffffff;\n}\n.b { color: #ff0000; }\n' },
    /styles\.css:4 .*hardcoded hex colour/
  );
});
test('check 7 allows hex in comments and data URIs', () => {
  assertPasses({
    'styles.css':
      ':root {\n  --color-a: #ffffff;\n}\n/* #ff0000 documented */\n.b { background: url("data:image/svg+xml,%3Csvg fill=\'#ff0000\'%3E"); }\n',
  });
});

// Check 8: built HTML validation
test('check 8 fails on an <img> without alt', () => {
  assertFails({ 'index.html': '<html><body><img src="a.png"></body></html>\n' }, /<img> missing alt attribute/);
});
test('check 8 allows a decorative <img> marked aria-hidden', () => {
  assertPasses({ 'index.html': '<html><body><img src="a.png" aria-hidden="true"></body></html>\n' });
});
test('check 8 fails on a duplicate id in one file', () => {
  assertFails({ 'index.html': '<html><body><p id="x"></p><p id="x"></p></body></html>\n' }, /duplicate id="x"/);
});
test('check 8 does not count data-*-id attributes as ids', () => {
  assertPasses({ 'index.html': '<html><body><p id="apply-error" data-error-id="apply-error"></p></body></html>\n' });
});

// Check 9: hardcoded site-config URLs in templates
test('check 9 fails on a hardcoded founder LinkedIn URL in a template', () => {
  assertFails(
    { '_templates/page.html': '<a href="https://www.linkedin.com/in/someone/">Someone</a>\n' },
    /hardcoded founder LinkedIn profile URL/
  );
});
test('check 9 fails on a hardcoded quiz URL in a template', () => {
  assertFails(
    { '_templates/page.html': '<a href="https://quiz.accelerator-x.ai/">Quiz</a>\n' },
    /hardcoded quiz URL URL/
  );
});

// Check 10: offerings derive from offerings.json
test('check 10a fails on a hardcoded £ price on an offer surface', () => {
  assertFails({ '_templates/what-we-do.html': '<p>Only £3,000 per place</p>\n' }, /hardcoded £-price/);
});
test('check 10a allows a price on a data-pricing-note element and in a comment', () => {
  assertPasses({
    '_templates/what-we-do.html': '<!-- was £3,000 -->\n<p data-pricing-note>£100 per head</p>\n',
  });
});
test('check 10b fails on a reference to a retired offering', () => {
  assertFails({ '_templates/page.html': '<a href="/what-we-do/fractional-advisory/">Advisory</a>\n' }, /Fractional AI Advisory \(retired-for-v2\)/);
});
test('check 10c fails when a live offering has no template', () => {
  assertFails(
    {
      'content/data/offerings.json': JSON.stringify({
        offerings: [{ key: 'foo', status: 'live', slug: '/what-we-do/foo/' }],
      }),
    },
    /live offering 'foo' .* has no template/
  );
});
test('check 10c passes when the live offering has its template', () => {
  assertPasses({
    'content/data/offerings.json': JSON.stringify({
      offerings: [{ key: 'foo', status: 'live', slug: '/what-we-do/foo/' }],
    }),
    '_templates/offerings/foo.html': '<h1>Foo</h1>\n',
  });
});
