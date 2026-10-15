// Unit tests for netlify/functions/cohort-application.js: the open-cohort application path
// (#172/#175): Coaching Enrollments + Slack #cohort-applications.
// Run: node --test tests/functions/cohort-application.test.js
//
// Same harness as lead-capture.test.js: each test resets the env vars the function reads,
// re-requires the handler, and stubs global fetch to capture the exact payloads sent.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const MODULE_PATH = path.join(__dirname, '..', '..', 'netlify', 'functions', 'cohort-application.js');

const ENV_KEYS = ['SLACK_COHORT_WEBHOOK_URL', 'SLACK_WEBHOOK_URL', 'AIRTABLE_TOKEN', 'AIRTABLE_BASE_ID', 'COHORT_PROGRAMME_RECORD_ID'];

const FULL_ENV = {
  SLACK_COHORT_WEBHOOK_URL: 'https://hooks.slack.test/cohort',
  SLACK_WEBHOOK_URL: 'https://hooks.slack.test/website-leads',
  AIRTABLE_TOKEN: 'pat-test',
  AIRTABLE_BASE_ID: 'appTEST0000000000',
  COHORT_PROGRAMME_RECORD_ID: 'recPROGRAMME00000',
};

async function withEnv(overrides, fn) {
  const saved = {};
  for (const key of ENV_KEYS) saved[key] = process.env[key];
  for (const key of ENV_KEYS) delete process.env[key];
  Object.assign(process.env, overrides);
  delete require.cache[require.resolve(MODULE_PATH)];
  try {
    return await fn(require(MODULE_PATH));
  } finally {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
    delete require.cache[require.resolve(MODULE_PATH)];
  }
}

const VALID = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Acme Ltd',
  role: 'Managing Director',
  ai_use: 'regular',
  confidence: 6,
  consent_given: true,
  consent_timestamp: '2026-10-15T09:00:00.000Z',
  source: { page: '/what-we-do/leadership-cohort/', utm_source: 'linkedin', utm_campaign: 'c3-launch' },
  _honeypot: '',
};

const makeEvent = (fields, { method = 'POST', bodyOverride } = {}) => ({
  httpMethod: method,
  body: bodyOverride !== undefined ? bodyOverride : JSON.stringify(fields),
});

// Records every fetch call. A response with `once: true` is consumed by its first match,
// so a test can stub a 422 then a 200 on the retry.
function makeFetchStub(responses) {
  const calls = [];
  const fn = async (url, opts) => {
    calls.push({ url, opts, body: opts?.body ? JSON.parse(opts.body) : undefined });
    const match = responses.find((r) => url.includes(r.match) && !(r.once && r.used));
    if (match?.once) match.used = true;
    if (!match) throw new Error(`Unstubbed fetch call to ${url}`);
    if (match.throws) throw new Error(match.throws);
    return {
      ok: match.status === undefined || (match.status >= 200 && match.status < 300),
      status: match.status ?? 200,
      text: async () => match.text ?? '',
      json: async () => match.json ?? {},
    };
  };
  fn.calls = calls;
  return fn;
}

const AIRTABLE_OK = { match: 'api.airtable.com', json: { id: 'recNEWAPPLICANT01' } };
const SLACK_OK = { match: 'hooks.slack.test/cohort' };

const airtableCalls = (stub) => stub.calls.filter((c) => c.url.includes('api.airtable.com'));
const slackCalls = (stub) => stub.calls.filter((c) => c.url.includes('hooks.slack.test'));
const slackText = (call) => JSON.stringify(call.body.blocks);

test('valid application: Coaching Enrollments row carries the exact #173 fields, linked to the open cohort', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([AIRTABLE_OK, SLACK_OK]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { success: true, airtable: 'created', slack: 'sent' });

    const [at] = airtableCalls(stub);
    assert.equal(at.url, 'https://api.airtable.com/v0/appTEST0000000000/tblFNkbk58DhsRZed');
    assert.equal(at.opts.headers.Authorization, 'Bearer pat-test');
    assert.deepEqual(at.body.fields, {
      'Participant Name': 'Jane Doe',
      Email: 'jane@example.com',
      Company: 'Acme Ltd',
      Role: 'Managing Director',
      Programme: ['recPROGRAMME00000'],
      'Enrollment Status': 'Interested',
      'Application AI Use': 'I use AI regularly for specific tasks',
      'Application Confidence': 6,
      'Application Source': 'Website cohort form · page=/what-we-do/leadership-cohort/ · utm_source=linkedin · utm_campaign=c3-launch',
      'Consent Given': true,
      'Consent Timestamp': '2026-10-15T09:00:00.000Z',
    });
  });
});

test('Airtable is written before Slack, and the Slack ping links straight to the new record', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([AIRTABLE_OK, SLACK_OK]);
    global.fetch = stub;
    await mod.handler(makeEvent(VALID));
    assert.ok(stub.calls[0].url.includes('api.airtable.com'));
    assert.ok(stub.calls[1].url.includes('hooks.slack.test/cohort'));
    const text = slackText(stub.calls[1]);
    assert.ok(text.includes('🎓 New cohort application'));
    assert.ok(text.includes('https://airtable.com/appTEST0000000000/tblFNkbk58DhsRZed/recNEWAPPLICANT01|Open in Airtable'));
    assert.ok(text.includes('Managing Director at Acme Ltd'));
    assert.ok(text.includes('Regular'));
    assert.ok(text.includes('6/10'));
  });
});

test('waitlist mode: no programme env var means no Programme link and a waitlist header', async () => {
  await withEnv({ ...FULL_ENV, COHORT_PROGRAMME_RECORD_ID: '' }, async (mod) => {
    const stub = makeFetchStub([AIRTABLE_OK, SLACK_OK]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 200);
    assert.equal('Programme' in airtableCalls(stub)[0].body.fields, false);
    assert.ok(slackText(slackCalls(stub)[0]).includes('🎓 New cohort waitlist sign-up'));
  });
});

test('Slack falls back to the #website-leads webhook when the cohort webhook is unset', async () => {
  const env = { ...FULL_ENV };
  delete env.SLACK_COHORT_WEBHOOK_URL;
  await withEnv(env, async (mod) => {
    const stub = makeFetchStub([AIRTABLE_OK, { match: 'hooks.slack.test/website-leads' }]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 200);
    assert.equal(slackCalls(stub)[0].url, 'https://hooks.slack.test/website-leads');
  });
});

test('each validation failure is a 400 naming the field, with no external calls', async () => {
  const cases = [
    [{ name: '' }, 'name'],
    [{ email: 'not-an-email' }, 'email'],
    [{ company: '   ' }, 'company'],
    [{ role: '' }, 'role'],
    [{ ai_use: 'sometimes' }, 'ai_use'],
    [{ confidence: 0 }, 'confidence'],
    [{ confidence: 11 }, 'confidence'],
    [{ confidence: 6.5 }, 'confidence'],
    [{ confidence: 'six' }, 'confidence'],
    [{ consent_given: 'true' }, 'consent_given'],
    [{ consent_given: false }, 'consent_given'],
  ];
  await withEnv(FULL_ENV, async (mod) => {
    for (const [override, field] of cases) {
      global.fetch = makeFetchStub([]); // any call throws "unstubbed"
      const res = await mod.handler(makeEvent({ ...VALID, ...override }));
      assert.equal(res.statusCode, 400, `expected 400 for ${JSON.stringify(override)}`);
      assert.deepEqual(JSON.parse(res.body), { error: 'invalid', fields: [field] });
    }
  });
});

test('every ai_use key maps to the exact C4 anchor stored as an Airtable option (#173)', async () => {
  const expected = {
    none: "I don't use AI tools yet",
    experimenting: "I experiment occasionally but don't have a consistent pattern",
    regular: 'I use AI regularly for specific tasks',
    embedded: 'AI is embedded in how I work day to day',
  };
  await withEnv(FULL_ENV, async (mod) => {
    for (const [key, label] of Object.entries(expected)) {
      const stub = makeFetchStub([AIRTABLE_OK, SLACK_OK]);
      global.fetch = stub;
      await mod.handler(makeEvent({ ...VALID, ai_use: key }));
      assert.equal(airtableCalls(stub)[0].body.fields['Application AI Use'], label);
    }
  });
});

test('confidence arriving as a numeric string is accepted and written as a number', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([AIRTABLE_OK, SLACK_OK]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent({ ...VALID, confidence: '10' }));
    assert.equal(res.statusCode, 200);
    assert.equal(airtableCalls(stub)[0].body.fields['Application Confidence'], 10);
  });
});

test('honeypot submissions are skipped as spam, no external calls', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    global.fetch = makeFetchStub([]);
    const res = await mod.handler(makeEvent({ ...VALID, _honeypot: 'bot' }));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { skipped: 'spam' });
  });
});

test('non-POST is 405, oversized is 413, malformed JSON is 400', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    global.fetch = makeFetchStub([]);
    assert.equal((await mod.handler(makeEvent(VALID, { method: 'GET' }))).statusCode, 405);
    assert.equal((await mod.handler(makeEvent(null, { bodyOverride: 'x'.repeat(10_001) }))).statusCode, 413);
    assert.equal((await mod.handler(makeEvent(null, { bodyOverride: '{not json' }))).statusCode, 400);
    assert.equal((await mod.handler(makeEvent(null, { bodyOverride: 'null' }))).statusCode, 400);
  });
});

test('user input is escaped in Slack mrkdwn', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([AIRTABLE_OK, SLACK_OK]);
    global.fetch = stub;
    await mod.handler(makeEvent({ ...VALID, name: '<!channel> & co', company: 'A<b>C' }));
    const text = slackText(slackCalls(stub)[0]);
    assert.ok(text.includes('&lt;!channel&gt; &amp; co'));
    assert.ok(text.includes('A&lt;b&gt;C'));
    assert.ok(!text.includes('<!channel>'));
  });
});

test('a malformed consent timestamp still writes the record: server time used, raw value kept in Notes', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([AIRTABLE_OK, SLACK_OK]);
    global.fetch = stub;
    await mod.handler(makeEvent({ ...VALID, consent_timestamp: 'yesterday-ish' }));
    const fields = airtableCalls(stub)[0].body.fields;
    assert.ok(!Number.isNaN(Date.parse(fields['Consent Timestamp'])));
    assert.notEqual(fields['Consent Timestamp'], 'yesterday-ish');
    assert.ok(fields.Notes.includes('yesterday-ish'));
  });
});

test('a select choice Airtable rejects is retried once without it, kept in Notes', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([
      { match: 'api.airtable.com', once: true, status: 422, text: '{"error":{"type":"INVALID_MULTIPLE_CHOICE_OPTIONS","message":"Insufficient permissions to create new select option ""I use AI regularly for specific tasks"""}}' },
      AIRTABLE_OK,
      SLACK_OK,
    ]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 200);
    const [, retry] = airtableCalls(stub);
    assert.equal('Application AI Use' in retry.body.fields, false);
    assert.equal(retry.body.fields['Enrollment Status'], 'Interested');
    assert.ok(retry.body.fields.Notes.includes('Application AI Use (Airtable rejected the choice, kept here): I use AI regularly for specific tasks'));
    assert.equal(airtableCalls(stub).length, 2);
  });
});

test('Airtable fails, Slack ok: 200, and Slack carries a NOT saved header plus the error', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([{ match: 'api.airtable.com', status: 500, text: 'boom' }, SLACK_OK]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { success: true, airtable: 'failed', slack: 'sent' });
    const text = slackText(slackCalls(stub)[0]);
    assert.ok(text.includes('⚠️ Cohort application NOT saved to Airtable'));
    assert.ok(text.includes('jane@example.com'));
    assert.ok(text.includes('Airtable error: 500 boom'));
    assert.ok(!text.includes('Open in Airtable'));
  });
});

test('Airtable ok, Slack fails: still 200, because the record exists', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    global.fetch = makeFetchStub([AIRTABLE_OK, { match: 'hooks.slack.test/cohort', status: 500 }]);
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { success: true, airtable: 'created', slack: 'failed' });
  });
});

test('both fail: generic 500, internal detail stays out of the response', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    global.fetch = makeFetchStub([
      { match: 'api.airtable.com', throws: 'secret internal detail' },
      { match: 'hooks.slack.test/cohort', throws: 'also internal' },
    ]);
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 500);
    assert.deepEqual(JSON.parse(res.body), { error: 'Server error' });
  });
});

test('missing Airtable env vars: nothing written, Slack still gets the full applicant', async () => {
  await withEnv({ SLACK_COHORT_WEBHOOK_URL: FULL_ENV.SLACK_COHORT_WEBHOOK_URL }, async (mod) => {
    const stub = makeFetchStub([SLACK_OK]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 200);
    assert.equal(airtableCalls(stub).length, 0);
    assert.ok(slackText(slackCalls(stub)[0]).includes('NOT saved to Airtable'));
  });
});
