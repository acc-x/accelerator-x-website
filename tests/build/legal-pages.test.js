'use strict';

// /privacy.html and /terms.html are rendered from legal/*.md at build time (#87).
// Legal copy used to load client-side with no rebuild; these tests are what now catch a
// markdown edit that was not rebuilt, and a page that lost its v2 chrome.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '../..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const PAGES = [
  { html: 'privacy.html', md: 'legal/privacy.md', title: 'Privacy Policy' },
  { html: 'terms.html', md: 'legal/terms.md', title: 'Terms of Use' },
];

const stripTags = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ');

for (const page of PAGES) {
  const html = read(page.html);
  const md = read(page.md);

  test(`${page.html}: every markdown heading is on the page, in order`, () => {
    const headings = [...md.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
    assert.ok(headings.length > 5, `${page.md} should have numbered sections`);
    let from = 0;
    for (const h of headings) {
      const at = html.indexOf(`>${h.replace(/&/g, '&amp;')}</h2>`, from);
      assert.notEqual(at, -1, `heading missing or out of order in ${page.html}: "${h}". Run npm run build.`);
      from = at;
    }
  });

  test(`${page.html}: shows the markdown's last-updated date`, () => {
    const date = md.match(/^Last updated:\s*(.+)$/m)[1].trim();
    assert.ok(html.includes(`Last updated: ${date}`), `date "${date}" not on ${page.html}. Run npm run build.`);
  });

  test(`${page.html}: v2 chrome, no inline or fetch script, no raw markdown syntax`, () => {
    assert.ok(html.includes('ax-nav'), 'v2 Nav missing');
    assert.ok(html.includes('ax-footer'), 'v2 Footer missing');
    assert.ok(html.includes('/assets/css/bundle.generated.css'), 'v2 bundle not linked');
    assert.ok(!html.includes('legal-shell'), 'v1 legal-shell markup is back');
    assert.ok(!/<script(?![^>]*\bsrc=)[^>]*>/.test(html), 'inline script on a legal page');
    assert.ok(!html.includes('fetch('), 'client-side fetch on a legal page');
    const body = stripTags(html.slice(html.indexOf('ax-legal__body')));
    assert.ok(!body.includes('**') && !body.includes('`'), 'raw markdown syntax leaked into the page');
  });

  test(`${page.html}: has its own title, description, canonical and social meta`, () => {
    assert.ok(html.includes(`<title>${page.title} | Accelerator X</title>`));
    assert.ok(new RegExp('<meta name="description" content="[^"]{60,}"').test(html), 'description missing or thin');
    assert.ok(html.includes(`<link rel="canonical" href="https://accelerator-x.ai/${page.html}" />`), 'canonical wrong');
    assert.ok(html.includes('property="og:title"') && html.includes('name="twitter:title"'), 'social meta missing');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, 'exactly one h1');
  });
}

test('the footer and both apply forms still link to the legal URLs the build produces', () => {
  for (const file of ['_templates/components/Footer.html', '_templates/components/ApplyForm.html', '_templates/components/CohortApplyForm.html']) {
    assert.ok(read(file).includes('href="/privacy.html"'), `${file} no longer links /privacy.html`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, 'privacy.html')) && fs.existsSync(path.join(ROOT, 'terms.html')));
});

test('a blank "Last updated" line fails the build instead of swallowing the next paragraph', () => {
  const { parseLegalMarkdown } = require('../../scripts/build-legal-pages.js');
  assert.throws(() => parseLegalMarkdown('# Title\n\nLast updated:\n\nFirst real paragraph.\n', 'x.md'), /Last updated/);
  const ok = parseLegalMarkdown('# Title\n\nLast updated: 11 November 2026\n\nFirst real paragraph.\n', 'x.md');
  assert.equal(ok.updated, '11 November 2026');
  assert.ok(ok.body.startsWith('First real paragraph.'));
});
