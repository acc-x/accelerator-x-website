'use strict';

// The offline brochure PDF is the cohort page, printed (#203). It is committed, so it can
// go stale; this fails the moment the page changes without the PDF being reprinted.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.join(__dirname, '../..');
const PAGE = path.join(ROOT, 'what-we-do/leadership-cohort/index.html');
const PDF = path.join(ROOT, 'assets/downloads/accelerator-x-bootcamp-brochure.pdf');
const PRINT_CSS = path.join(ROOT, 'assets/css/components/LeadershipCohort.css');
const HASH = `${PDF}.source-sha256`;
const FIX = 'Run `npm run build && npm run build:pdf` (needs Chrome) and commit the PDF and its .source-sha256.';

test('the brochure PDF exists and is a PDF', () => {
  assert.ok(fs.existsSync(PDF), `brochure PDF is missing. ${FIX}`);
  assert.equal(fs.readFileSync(PDF).subarray(0, 5).toString(), '%PDF-');
});

test('the brochure PDF was printed from the current cohort page', () => {
  const current = crypto.createHash('sha256').update(fs.readFileSync(PAGE)).update(fs.readFileSync(PRINT_CSS)).digest('hex');
  const printed = fs.readFileSync(HASH, 'utf8').trim();
  assert.equal(printed, current, `the cohort page or its print rules changed since the PDF was printed. ${FIX}`);
});

test('the cohort page links to the brochure PDF', () => {
  const html = fs.readFileSync(PAGE, 'utf8');
  assert.ok(html.includes('/assets/downloads/accelerator-x-bootcamp-brochure.pdf'), 'download link missing from the page');
});
