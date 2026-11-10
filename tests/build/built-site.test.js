'use strict';

// Regression checks on built output — content that check.js's structural gates
// (tokens, alt, duplicate ids) can't see: the conversion-critical pieces that
// have silently vanished before. Replaces the orphaned scripts/test-site.js,
// which rotted asserting v1 markup (site-footer) because nothing ever ran it;
// wiring these into `npm test` is the fix for that failure mode, not just the
// selectors.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const read = (rel) => fs.readFileSync(path.join(__dirname, '../..', rel), 'utf8');

const assertIncludes = (content, expected, message) => {
  assert.ok(content.includes(expected), `${message}\nMissing: ${expected}`);
};

test('homepage renders founder headshots, hero media library and footer', () => {
  const homepage = read('index.html');
  assertIncludes(homepage, '/assets/images/toby-green-shirt-400.png', 'Homepage founder headshot regression check failed for Toby.');
  assertIncludes(homepage, '/assets/images/andy-black-t-400.jpg', 'Homepage founder headshot regression check failed for Andy.');
  assertIncludes(homepage, 'data-hero-library', 'Homepage hero media library did not render.');
  assertIncludes(homepage, 'hero-media-slide', 'Homepage hero media slides missing.');
  assertIncludes(homepage, 'ax-footer', 'Homepage footer missing.');
});

test('insights hub and articles render footer and author card', () => {
  const insightsIndex = read('insights/index.html');
  const article = read('insights/articles/building-the-ai-native-team.html');
  assertIncludes(insightsIndex, 'ax-footer', 'Insights index footer missing.');
  assertIncludes(article, 'ax-footer', 'Insights article footer missing.');
  assertIncludes(article, 'article-author-card__image', 'Insights article author card did not render.');
  assertIncludes(article, 'Andy Carroll', 'Insights article author name missing.');
  assertIncludes(article, 'Co-founder', 'Insights article author role missing.');
});

test('legal pages carry the legal identity', () => {
  // privacy.html / terms.html are rendered from legal/*.md by build-legal-pages.js (#87);
  // compare on text so inline markup (bold, links) does not matter.
  const text = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
  const privacy = text(read('privacy.html'));
  const terms = text(read('terms.html'));
  assertIncludes(privacy, 'Accelerator X Ltd is a company registered in England and Wales under company number 16974247.', 'Privacy legal identity missing.');
  assertIncludes(terms, 'The website is operated by Accelerator X Ltd, a company registered in England and Wales under company number 16974247.', 'Terms legal identity missing.');
});
