#!/usr/bin/env node
/**
 * Prints the cohort page to the offline brochure PDF (#203).
 *
 *   npm run build:pdf
 *
 * The PDF is the page itself, printed by headless Chrome through the page's own
 * @media print rules (assets/css/components/LeadershipCohort.css §8), so there is one
 * source of copy and design. It is deliberately NOT part of `npm run build`, because it
 * needs a local Chrome; instead tests/build/brochure-pdf.test.js fails when the page has
 * changed since the PDF was printed, with this command in the message.
 *
 * Needs Google Chrome, Chromium or Edge. Override the binary with CHROME_PATH.
 * Fonts load from Google Fonts at print time, so run it online.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const PAGE_URL_PATH = '/what-we-do/leadership-cohort/';
const PAGE_FILE = path.join(ROOT, 'what-we-do', 'leadership-cohort', 'index.html');
const OUT_DIR = path.join(ROOT, 'assets', 'downloads');
const OUT_PDF = path.join(OUT_DIR, 'accelerator-x-bootcamp-brochure.pdf');
const OUT_HASH = `${OUT_PDF}.source-sha256`;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  return candidates.find((c) => fs.existsSync(c));
}

function sourceHash() {
  return crypto.createHash('sha256').update(fs.readFileSync(PAGE_FILE)).digest('hex');
}

function serve() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function main() {
  if (!fs.existsSync(PAGE_FILE)) {
    console.error('Built page missing. Run `npm run build` first.');
    process.exit(1);
  }
  const chrome = findChrome();
  if (!chrome) {
    console.error('No Chrome, Chromium or Edge found. Install one or set CHROME_PATH.');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}${PAGE_URL_PATH}`;
  const tmp = `${OUT_PDF}.tmp`;

  // Async on purpose: spawnSync would block the event loop and starve the local server
  // Chrome is fetching the page from.
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${tmp}`,
    url,
  ];
  const outcome = await new Promise((resolve) => {
    const child = spawn(chrome, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (d) => { stderr += d; });
    const timer = setTimeout(() => { child.kill('SIGKILL'); resolve({ code: null, stderr: `${stderr}\nTimed out after 90s.` }); }, 90000);
    child.on('exit', (code) => { clearTimeout(timer); resolve({ code, stderr }); });
  });
  server.close();

  if (outcome.code !== 0 || !fs.existsSync(tmp)) {
    console.error('Chrome did not produce a PDF.');
    console.error(outcome.stderr.split('\n').filter((l) => !/VERBOSE|CVDisplayLink|Crashpad/.test(l)).slice(-15).join('\n'));
    process.exit(1);
  }

  fs.renameSync(tmp, OUT_PDF);
  fs.writeFileSync(OUT_HASH, `${sourceHash()}\n`);
  const kb = Math.round(fs.statSync(OUT_PDF).size / 1024);
  console.log(`PDF written: ${path.relative(ROOT, OUT_PDF)} (${kb} KB)`);
}

main();
