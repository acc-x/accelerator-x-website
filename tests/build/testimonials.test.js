'use strict';

// Guards the homepage testimonials block (#130). build-testimonials.js overwrites whatever
// build-homepage.js injected between the TESTIMONIALS_COMPONENT markers, so the committed
// index.html must reflect that script's output: the v2 `.ax-testimonial-card` component,
// one card per entry in content/data/testimonials.json, never the retired v1 markup.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '../..');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const testimonials = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'content/data/testimonials.json'), 'utf8')
);

const block = indexHtml.match(
  /<!-- TESTIMONIALS_COMPONENT_START -->([\s\S]*?)<!-- TESTIMONIALS_COMPONENT_END -->/
);

test('homepage has a testimonials block between the markers', () => {
  assert.ok(block, 'TESTIMONIALS_COMPONENT markers missing from index.html');
});

test('testimonials render as v2 .ax-testimonial-card, one per JSON entry', () => {
  const cards = block[1].match(/class="ax-testimonial-card[ "]/g) || [];
  assert.equal(cards.length, testimonials.length);
});

test('no retired v1 testimonial markup survives in the block', () => {
  assert.doesNotMatch(block[1], /card-hoverable/);
  assert.doesNotMatch(block[1], /stars-5/);
});

test('every testimonial name from the JSON appears in the block', () => {
  for (const t of testimonials) {
    assert.ok(block[1].includes(t.name), `${t.name} missing from the rendered testimonials`);
  }
});

test('cards after the first stagger their reveal', () => {
  assert.match(block[1], /ax-testimonial-card reveal reveal-delay-1"/);
  assert.match(block[1], /ax-testimonial-card reveal reveal-delay-2"/);
});
