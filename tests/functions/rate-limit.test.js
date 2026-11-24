// Tests for the v2 wrappers that carry the Netlify rate limit (#123):
// netlify/functions/{lead-capture,newsletter-subscribe}.mjs over the v1 handlers in netlify/lib/.
// Run: node --test tests/
//
// Netlify enforces the limit itself, at the edge, before the function runs, so it cannot be
// exercised locally. These tests pin what we control: the declared limit, that a normal single
// submission still works end to end through the wrapper, and that the unlimited default URL is
// refused. The live 429 is checked on a deploy preview (see the PR description).

const test = require('node:test');
const assert = require('node:assert/strict');

// The handlers read their Slack webhook once, at module load, so it must be set before the
// first import. Placeholder only; fetch is stubbed in every test that gets this far.
process.env.SLACK_WEBHOOK_URL = 'https://slack.test/hook';
process.env.BREVO_API_KEY = 'test-key';

const load = (name) => import(`../../netlify/functions/${name}.mjs`);

const FUNCTIONS = ['lead-capture', 'newsletter-subscribe'];

for (const name of FUNCTIONS) {
  test(`${name}: declares a per-IP rate limit on a custom /api path`, async () => {
    const { config } = await load(name);
    assert.equal(config.path, `/api/${name}`);
    assert.deepEqual(config.rateLimit, {
      windowLimit: 10,
      windowSize: 180,
      aggregateBy: ['ip', 'domain'],
    });
  });

  test(`${name}: limit is generous enough for one visitor and within Netlify's 180s maximum`, async () => {
    const { config } = await load(name);
    assert.ok(config.rateLimit.windowLimit >= 5, 'a normal visitor and a few retries must fit');
    assert.ok(config.rateLimit.windowSize <= 180, "Netlify's maximum window is 180 seconds");
  });

  test(`${name}: the default /.netlify/functions URL is refused so it cannot bypass the limit`, async () => {
    const { default: fn } = await load(name);
    const res = await fn(new Request(`https://example.test/.netlify/functions/${name}`, {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.co' }),
    }));
    assert.equal(res.status, 404);
  });
}

test('lead-capture: a normal submission through the wrapper behaves as before', async () => {
  const saved = { ...process.env };
  const realFetch = global.fetch;
  const calls = [];
  delete process.env.AIRTABLE_TOKEN;
  delete process.env.AIRTABLE_BASE_ID;
  delete process.env.AIRTABLE_TABLE;
  global.fetch = async (url) => { calls.push(String(url)); return new Response('ok', { status: 200 }); };
  try {
    const { default: fn } = await load('lead-capture');
    const res = await fn(new Request('https://example.test/api/lead-capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'form-name': 'lead-capture-form',
        name: 'Test Person',
        email: 'test@example.com',
        company: 'Test Co',
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
      }),
    }));
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /application\/json/);
    assert.ok(calls.includes('https://slack.test/hook'), 'Slack notification was sent');
  } finally {
    global.fetch = realFetch;
    process.env = saved;
  }
});

test('newsletter-subscribe: a normal subscribe through the wrapper still returns success', async () => {
  const saved = { ...process.env };
  const realFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({ id: 1 }), { status: 201 });
  try {
    const { default: fn } = await load('newsletter-subscribe');
    const res = await fn(new Request('https://example.test/api/newsletter-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', source: 'test' }),
    }));
    assert.equal(res.status, 200);
    assert.equal((await res.json()).success, true);
  } finally {
    global.fetch = realFetch;
    process.env = saved;
  }
});

test('wrapper: non-POST, bad JSON and oversize payloads keep the handler status codes', async () => {
  const { default: fn } = await load('lead-capture');
  const url = 'https://example.test/api/lead-capture';
  assert.equal((await fn(new Request(url, { method: 'GET' }))).status, 405);
  assert.equal((await fn(new Request(url, { method: 'POST', body: '{nope' }))).status, 400);
  assert.equal((await fn(new Request(url, { method: 'POST', body: 'x'.repeat(10_001) }))).status, 413);
});

test('wrapper: CORS preflight 204 returns a bodyless response', async () => {
  const { default: fn } = await load('newsletter-subscribe');
  const res = await fn(new Request('https://example.test/api/newsletter-subscribe', { method: 'OPTIONS' }));
  assert.equal(res.status, 204);
  assert.equal(await res.text(), '');
});
