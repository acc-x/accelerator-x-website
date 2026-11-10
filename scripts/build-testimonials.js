const fs = require('fs');
const path = require('path');
const { injectMarked } = require('./lib/marker-injection');
const { writeFileAtomic } = require('./lib/atomic-write');

const TESTIMONIALS_PATH = path.join(__dirname, '../content/data/testimonials.json');
const INDEX_HTML_PATH = path.join(__dirname, '../index.html');
const START_MARKER = '<!-- TESTIMONIALS_COMPONENT_START -->';
const END_MARKER = '<!-- TESTIMONIALS_COMPONENT_END -->';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Emits the v2 `.ax-testimonial-card` component (#130). This script runs after
// build-homepage.js and overwrites everything between the TESTIMONIALS_COMPONENT markers,
// so it, not _templates/homepage-testimonials.html, decides what ships. It used to emit
// the old v1 `.card-hoverable` / `.stars-5` markup, which is why the v2 partial never
// reached production. The words still come from content/data/testimonials.json.
function buildCardHtml(t, indent, index) {
  const quote = escapeHtml(t.quote || '');
  const name = escapeHtml(t.name || '');
  const title = escapeHtml(t.title || '');
  const company = escapeHtml(t.company || '');

  const attribution = [title, company].filter(Boolean).join(', ');

  // Scroll-in stagger: the first card has none, then reveal-delay-1, -2, -3 (capped).
  const delay = index > 0 ? ` reveal-delay-${Math.min(index, 3)}` : '';

  return (
    `${indent}<div class="ax-testimonial-card reveal${delay}">\n` +
    `${indent}  <div class="ax-testimonial-card__stars" aria-hidden="true">\n` +
    `${indent}    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>\n` +
    `${indent}  </div>\n` +
    `${indent}  <span class="sr-only">5 out of 5 stars</span>\n` +
    `${indent}  <p class="ax-testimonial-card__quote">\n` +
    `${indent}    "${quote}"\n` +
    `${indent}  </p>\n` +
    `${indent}  <div class="ax-testimonial-card__attribution">\n` +
    `${indent}    <p class="ax-testimonial-card__name">${name}</p>\n` +
    `${indent}    <p class="ax-testimonial-card__role">${attribution}</p>\n` +
    `${indent}  </div>\n` +
    `${indent}</div>`
  );
}

function main() {
  if (!fs.existsSync(TESTIMONIALS_PATH)) {
    console.warn(`⚠️ Testimonials file not found: ${TESTIMONIALS_PATH}. Skipping.`);
    return;
  }
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.warn(`⚠️ index.html not found: ${INDEX_HTML_PATH}. Skipping.`);
    return;
  }

  const testimonialsRaw = fs.readFileSync(TESTIMONIALS_PATH, 'utf-8');
  let testimonials;
  try {
    testimonials = JSON.parse(testimonialsRaw);
  } catch (err) {
    console.error(`❌ Failed to parse testimonials JSON at ${TESTIMONIALS_PATH}`);
    throw err;
  }

  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    console.warn('⚠️ No testimonials found in JSON. Skipping.');
    return;
  }

  const indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  const indent = '          ';

  const parts = [];
  parts.push('');
  for (let i = 0; i < testimonials.length; i += 1) {
    const t = testimonials[i] || {};

    if (i === 0) parts.push(`${indent}<!-- Testimonial 1 -->`);
    if (i === 1) parts.push(`${indent}<!-- Testimonial 2 -->`);
    if (i === 2) parts.push(`${indent}<!-- Testimonial 3 -->`);

    parts.push(buildCardHtml(t, indent, i));
    parts.push('');
  }

  const replacement = `${parts.join('\n')}\n          `;

  const { content: outHtml } = injectMarked(indexHtml, {
    startMarker: START_MARKER,
    endMarker: END_MARKER,
    replacement,
    onMissing: 'throw',
    context: 'index.html',
  });
  writeFileAtomic(INDEX_HTML_PATH, outHtml);

  console.log(`✅ Testimonials injected into index.html (${testimonials.length} items)`);
}

main();
