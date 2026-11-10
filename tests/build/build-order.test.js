'use strict';

// Regression guard for the step order of `npm run build` (#134).
//
// The build is order-dependent, and reordering it fails silently rather than loudly:
//   - build-testimonials.js injects into index.html, which build:homepage regenerates,
//     so testimonials must run after the homepage (the ordering behind #130).
//   - Tailwind's content scan reads the generated HTML, so build:css must run after every
//     step that writes HTML, or classes that exist only in generated markup are missing
//     from the committed CSS until some later build happens to pick them up (2026-08-09).
//   - build:css-bundle concatenates the Tailwind output, so it must follow build:css and
//     come last.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '../..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const steps = pkg.scripts.build.split('&&').map((s) => s.trim());

const CSS_STEPS = ['npm run build:css', 'npm run build:css-bundle'];
const indexOf = (step) => steps.indexOf(step);

test('build script has the expected steps, none duplicated', () => {
  assert.ok(steps.length >= 2, 'build script should chain several steps');
  assert.equal(new Set(steps).size, steps.length, 'a build step is listed twice');
});

test('every build step resolves to a real script or file', () => {
  for (const step of steps) {
    const run = step.match(/^npm run (\S+)$/);
    if (run) {
      assert.ok(pkg.scripts[run[1]], `"${step}" names a package.json script that does not exist`);
      continue;
    }
    const node = step.match(/^node (\S+)$/);
    assert.ok(node, `unrecognised build step form: "${step}"`);
    assert.ok(fs.existsSync(path.join(ROOT, node[1])), `"${step}" points at a missing file`);
  }
});

// Dropping a generator from the chain leaves every order assertion below green while its
// committed output goes stale, so the chain must still reach every generator script.
const LIBRARY_ONLY = new Set(['build-components.js']);

test('every scripts/build-*.js generator is reached by the build', () => {
  const reached = new Set();
  for (const step of steps) {
    const run = step.match(/^npm run (\S+)$/);
    const command = run ? pkg.scripts[run[1]] || '' : step;
    for (const m of command.matchAll(/scripts\/(build-[\w-]+\.js)/g)) reached.add(m[1]);
  }
  const generators = fs
    .readdirSync(path.join(ROOT, 'scripts'))
    .filter((f) => /^build-.*\.js$/.test(f) && !LIBRARY_ONLY.has(f));
  for (const file of generators) {
    assert.ok(reached.has(file), `${file} exists but is not part of npm run build`);
  }
});

test('build:homepage runs before build-testimonials.js', () => {
  const home = indexOf('npm run build:homepage');
  const testimonials = indexOf('node scripts/build-testimonials.js');
  assert.notEqual(home, -1, 'build:homepage missing from build');
  assert.notEqual(testimonials, -1, 'build-testimonials.js missing from build');
  assert.ok(home < testimonials, 'testimonials would be injected into a stale index.html');
});

test('both CSS steps run after every HTML-generating step', () => {
  const css = indexOf('npm run build:css');
  assert.notEqual(css, -1, 'build:css missing from build');
  steps.forEach((step, i) => {
    if (CSS_STEPS.includes(step)) return;
    assert.ok(i < css, `"${step}" runs after build:css, so Tailwind scans stale HTML`);
  });
});

test('build:css-bundle follows build:css and is the last step', () => {
  const css = indexOf('npm run build:css');
  const bundle = indexOf('npm run build:css-bundle');
  assert.notEqual(bundle, -1, 'build:css-bundle missing from build');
  assert.ok(css < bundle, 'the bundle would concatenate the previous run\'s Tailwind output');
  assert.equal(bundle, steps.length - 1, 'build:css-bundle must be the final step');
});
