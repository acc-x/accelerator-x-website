// Unit tests for netlify/lib/newsletter-subscribe.js.
// Run: node --test tests/
//
// Covers the exact failure shape of the 2026-06-27 incident: a dead/missing Brevo key
// must never look identical to a real subscribe — it must fire a distinct Slack alert.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const MODULE_PATH = path.join(__dirname, '..', '..', 'netlify', 'lib', 'newsletter-subscribe.js');

const ENV_KEYS = ['SLACK_WEBHOOK_URL', 'BREVO_API_KEY'];

function withEnv(overrides, fn) {
  const saved = {};
  for (const key of ENV_KEYS) saved[key] = process.env[key];
  for (const key of ENV_KEYS) delete process.env[key];
  Object.assign(process.env, overrides);
  delete require.cache[require.resolve(MODULE_PATH)];
  try {
    return fn(require(MODULE_PATH));
  } finally {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
    delete require.cache[require.resolve(MODULE_PATH)];
  }
}

function makeEvent(fields, { method = 'POST', bodyOverride } = {}) {
  return {
    httpMethod: method,
    body: bodyOverride !== undefined ? bodyOverride : JSON.stringify(fields),
  };
}

function makeFetchStub(responses) {
  const calls = [];
  const fn = async (url, opts) => {
    calls.push({ url, opts, body: opts?.body ? JSON.parse(opts.body) : undefined });
    const match = responses.find((r) => url.includes(r.match));
    if (!match) throw new Error(`Unstubbed fetch call to ${url}`);
    if (match.throws) throw new Error(match.throws);
    return {
      ok: match.status === undefined || (match.status >= 200 && match.status < 300),
      status: match.status ?? 200,
      text: async () => match.text ?? '',
    };
  };
  fn.calls = calls;
  return fn;
}

test('rejects non-POST methods', async () => {
  await withEnv({}, async (mod) => {
    global.fetch = makeFetchStub([]);
    const res = await mod.handler(makeEvent({}, { method: 'GET' }));
    assert.equal(res.statusCode, 405);
  });
});

test('oversized payload is rejected with 413 before parsing', async () => {
  await withEnv({}, async (mod) => {
    global.fetch = makeFetchStub([]);
    const res = await mod.handler(makeEvent(null, { bodyOverride: 'x'.repeat(10_001) }));
    assert.equal(res.statusCode, 413);
  });
});

test('malformed JSON returns 400, not a generic 500', async () => {
  await withEnv({}, async (mod) => {
    global.fetch = makeFetchStub([]);
    const res = await mod.handler(makeEvent(null, { bodyOverride: '{not valid json' }));
    assert.equal(res.statusCode, 400);
    assert.equal(JSON.parse(res.body).error, 'Invalid JSON');
  });
});

test('invalid email is rejected with 400', async () => {
  await withEnv({}, async (mod) => {
    global.fetch = makeFetchStub([]);
    const res = await mod.handler(makeEvent({ email: 'not-an-email' }));
    assert.equal(res.statusCode, 400);
    assert.equal(JSON.parse(res.body).error, 'Valid email required');
  });
});

test('honeypot returns success:true immediately, no external calls', async () => {
  await withEnv({ SLACK_WEBHOOK_URL: 'https://hooks.slack.test/x', BREVO_API_KEY: 'key' }, async (mod) => {
    global.fetch = makeFetchStub([]); // unstubbed call would throw and fail the test
    const res = await mod.handler(makeEvent({ email: 'test@example.com', _honey: 'bot' }));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { success: true });
  });
});

test('successful subscribe: Brevo created, Slack notified, response reports brevo:"created"', async () => {
  await withEnv(
    { SLACK_WEBHOOK_URL: 'https://hooks.slack.test/newsletter', BREVO_API_KEY: 'live-key' },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'api.brevo.com', status: 201 },
        { match: 'hooks.slack.test', status: 200 },
      ]);
      global.fetch = fetchStub;

      const res = await mod.handler(makeEvent({ email: 'jane@example.com', source: 'homepage' }));
      assert.equal(res.statusCode, 200);
      const body = JSON.parse(res.body);
      assert.equal(body.success, true);
      assert.equal(body.brevo, 'created');

      const slackCalls = fetchStub.calls.filter((c) => c.url.includes('hooks.slack.test'));
      assert.equal(slackCalls.length, 1, 'no failure alert should fire on success');
    }
  );
});

test('missing Brevo key: still succeeds for the user but fires a distinct failure alert (the 2026-06-27 incident)', async () => {
  await withEnv({ SLACK_WEBHOOK_URL: 'https://hooks.slack.test/newsletter' }, async (mod) => {
    const fetchStub = makeFetchStub([{ match: 'hooks.slack.test', status: 200 }]);
    global.fetch = fetchStub;

    const res = await mod.handler(makeEvent({ email: 'jane@example.com' }));
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.success, true, 'user-facing contract must stay fails-soft');
    assert.equal(body.brevo, 'skipped');

    const slackCalls = fetchStub.calls.filter((c) => c.url.includes('hooks.slack.test'));
    assert.equal(slackCalls.length, 2, 'expected the normal signup notification + a distinct Brevo failure alert');
    assert.ok(slackCalls[1].body.text.includes('Brevo write SKIPPED'));
    assert.ok(slackCalls[1].body.text.includes('jane@example.com'));
  });
});

test('Brevo API error (non-2xx, non-204): fails soft but alerts', async () => {
  await withEnv(
    { SLACK_WEBHOOK_URL: 'https://hooks.slack.test/newsletter', BREVO_API_KEY: 'dead-key' },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'api.brevo.com', status: 401, text: 'API Key is not enabled' },
        { match: 'hooks.slack.test', status: 200 },
      ]);
      global.fetch = fetchStub;

      const res = await mod.handler(makeEvent({ email: 'jane@example.com' }));
      const body = JSON.parse(res.body);
      assert.equal(body.success, true);
      assert.equal(body.brevo, 'failed');

      const slackCalls = fetchStub.calls.filter((c) => c.url.includes('hooks.slack.test'));
      assert.equal(slackCalls.length, 2);
      assert.ok(slackCalls[1].body.text.includes('Brevo write FAILED'));
    }
  );
});

test('Brevo 204 (contact already exists) is treated as success, not failure', async () => {
  await withEnv(
    { SLACK_WEBHOOK_URL: 'https://hooks.slack.test/newsletter', BREVO_API_KEY: 'live-key' },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'api.brevo.com', status: 204 },
        { match: 'hooks.slack.test', status: 200 },
      ]);
      global.fetch = fetchStub;

      const res = await mod.handler(makeEvent({ email: 'jane@example.com' }));
      const body = JSON.parse(res.body);
      assert.equal(body.brevo, 'created');

      const slackCalls = fetchStub.calls.filter((c) => c.url.includes('hooks.slack.test'));
      assert.equal(slackCalls.length, 1, 'no failure alert for an already-existing contact');
    }
  );
});
