#!/usr/bin/env node
/**
 * Builds /privacy.html and /terms.html from the markdown in legal/ (#87).
 *
 * Both pages used to be static v1 files with an inline script that fetched the markdown at
 * page load. They now render at build time into the shared v2 legal template, so they get the
 * v2 Nav and Footer, a proper <head>, and no client-side fetch or inline script. The output
 * stays at the root (privacy.html, terms.html) because the footer, both apply forms, the
 * sitemap and external emails already link to those URLs.
 *
 * Legal edits therefore need `npm run build` now; the committed-artefact CI check catches a
 * markdown change that was not rebuilt.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { resolveComponentTokens, resolveSiteTokens, resolveOfferingTokens } = require('./build-components');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE = path.join(ROOT, '_templates', 'legal.html');

const PAGES = [
  {
    source: 'legal/privacy.md',
    output: 'privacy.html',
    title: 'Privacy Policy',
    description:
      'How Accelerator X Ltd collects, uses, stores, and protects personal data when you visit our website, submit an enquiry, or subscribe to our communications.',
  },
  {
    source: 'legal/terms.md',
    output: 'terms.html',
    title: 'Terms of Use',
    description:
      'The terms governing your access to and use of the Accelerator X website and the content, materials, and resources made available through it.',
  },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// The markdown is repo-owned, but raw HTML in it is escaped rather than passed through.
marked.use({
  renderer: {
    html(token) {
      return escapeHtml(typeof token === 'string' ? token : token.text);
    },
    // The markdown backticks the company number; in legal copy that should read as plain text.
    codespan({ text }) {
      return escapeHtml(text);
    },
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      const id = `section-${slugify(inner)}`;
      return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
    },
  },
});

/** Split the markdown into its date and body. The page chrome carries the H1 and the date. */
function parseLegalMarkdown(markdown, source) {
  let body = markdown.replace(/\r\n/g, '\n');
  body = body.replace(/^#\s+.+\n+/, '');
  // The date must sit on the same line: a looser match would take the next paragraph as the
  // date when the line is blank and delete that paragraph from the policy.
  const dateMatch = body.match(/^_?Last updated:[ \t]*(\S[^\n]*?)_?[ \t]*\n+/i);
  if (!dateMatch) {
    throw new Error(`${source}: expected a "Last updated: <date>" line right after the title`);
  }
  body = body.slice(dateMatch[0].length);
  return { updated: dateMatch[1].trim(), body };
}

function main() {
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  let built = 0;
  let skipped = 0;

  for (const page of PAGES) {
    const markdown = fs.readFileSync(path.join(ROOT, page.source), 'utf8');
    const { updated, body } = parseLegalMarkdown(markdown, page.source);
    const html = marked.parse(body)
      .trim()
      .split('\n')
      .map((line) => (line ? `          ${line}` : line))
      .join('\n');

    const filled = template
      .split('{{legal_title}}').join(escapeHtml(page.title))
      .split('{{legal_description}}').join(escapeHtml(page.description))
      .split('{{legal_file}}').join(page.output)
      .split('{{legal_source}}').join(page.source)
      .split('{{legal_updated}}').join(escapeHtml(updated))
      .split('{{legal_body}}').join(html);

    const resolved = resolveSiteTokens(resolveOfferingTokens(resolveComponentTokens(filled)));
    const outputPath = path.join(ROOT, page.output);
    const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';

    if (existing === resolved) {
      console.log(`ℹ️  Unchanged: ${page.output}`);
      skipped++;
    } else {
      fs.writeFileSync(outputPath, resolved, 'utf8');
      console.log(`✅ Built: ${page.output}`);
      built++;
    }
  }

  console.log(`\nLegal pages: ${built} built, ${skipped} unchanged.`);
}

if (require.main === module) main();

module.exports = { parseLegalMarkdown };
