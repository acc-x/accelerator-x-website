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
    const method = (opts && opts.method) || 'GET';
    const match = responses.find((r) => url.includes(r.match) && (!r.method || r.method === method) && !(r.once && r.used));
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

// Record writes only; the prior-enrolment lookup (#183) is a GET and has its own helper.
const airtableCalls = (stub) => stub.calls.filter((c) => c.url.includes('api.airtable.com') && c.opts && c.opts.method === 'POST');
const lookupCalls = (stub) => stub.calls.filter((c) => c.url.includes('api.airtable.com') && !(c.opts && c.opts.method));
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
    // Lookup (GET), then the record write (POST), then Slack.
    assert.ok(stub.calls[0].url.includes('tblFNkbk58DhsRZed?') && !stub.calls[0].opts.method);
    assert.equal(stub.calls[1].opts.method, 'POST');
    assert.ok(stub.calls[2].url.includes('hooks.slack.test/cohort'));
    const text = slackText(stub.calls[2]);
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
      { match: 'api.airtable.com', method: 'POST', once: true, status: 422, text: '{"error":{"type":"INVALID_MULTIPLE_CHOICE_OPTIONS","message":"Insufficient permissions to create new select option ""I use AI regularly for specific tasks"""}}' },
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

// ── No-JS path: the form's native urlencoded POST (review finding, #176) ────────────────

const formPost = (fields, referer = 'https://accelerator-x.ai/what-we-do/leadership-cohort/?utm_source=brochure&utm_campaign=c3') => ({
  httpMethod: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded', referer },
  body: new URLSearchParams(fields).toString(),
});

const FORM_FIELDS = {
  _honeypot: '', name: 'Jane Doe', email: 'jane@example.com', company: 'Acme Ltd',
  role: 'Managing Director', ai_use: 'embedded', confidence: '9', consent_given: 'true',
};

test('no-JS form post: writes the same record, server consent time, UTM from Referer, 303 to the success notice', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([AIRTABLE_OK, SLACK_OK]);
    global.fetch = stub;
    const res = await mod.handler(formPost(FORM_FIELDS));
    assert.equal(res.statusCode, 303);
    assert.equal(res.headers.Location, '/what-we-do/leadership-cohort/#cohort-applied');
    const fields = airtableCalls(stub)[0].body.fields;
    assert.equal(fields['Application AI Use'], 'AI is embedded in how I work day to day');
    assert.equal(fields['Application Confidence'], 9);
    assert.equal(fields['Consent Given'], true);
    assert.ok(Math.abs(Date.parse(fields['Consent Timestamp']) - Date.now()) < 60_000);
    assert.equal(fields['Application Source'], 'Website cohort form · page=/what-we-do/leadership-cohort/ · utm_source=brochure · utm_campaign=c3');
  });
});

test('no-JS form post: base64-encoded body is decoded', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([AIRTABLE_OK, SLACK_OK]);
    global.fetch = stub;
    const ev = formPost(FORM_FIELDS);
    ev.body = Buffer.from(ev.body).toString('base64');
    ev.isBase64Encoded = true;
    const res = await mod.handler(ev);
    assert.equal(res.statusCode, 303);
    assert.equal(airtableCalls(stub)[0].body.fields['Participant Name'], 'Jane Doe');
  });
});

test('no-JS form post: missing consent or an invalid field 303s to the failure notice, no writes', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    global.fetch = makeFetchStub([]);
    for (const override of [{ consent_given: '' }, { confidence: '' }, { email: 'a@b' }]) {
      const res = await mod.handler(formPost({ ...FORM_FIELDS, ...override }));
      assert.equal(res.statusCode, 303);
      assert.equal(res.headers.Location, '/what-we-do/leadership-cohort/#cohort-apply-failed');
    }
  });
});

test('no-JS form post: a filled honeypot gets the success redirect a person would, with no writes', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    global.fetch = makeFetchStub([]);
    const res = await mod.handler(formPost({ ...FORM_FIELDS, _honeypot: 'bot' }));
    assert.equal(res.statusCode, 303);
    assert.equal(res.headers.Location, '/what-we-do/leadership-cohort/#cohort-applied');
  });
});

test('no-JS form post: total failure 303s to the failure notice', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    global.fetch = makeFetchStub([
      { match: 'api.airtable.com', status: 500, text: 'down' },
      { match: 'hooks.slack.test/cohort', status: 500 },
    ]);
    const res = await mod.handler(formPost(FORM_FIELDS));
    assert.equal(res.statusCode, 303);
    assert.equal(res.headers.Location, '/what-we-do/leadership-cohort/#cohort-apply-failed');
  });
});

test('a multi-KB Airtable error page cannot push the Slack fallback past its 3,000-char section limit', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([{ match: 'api.airtable.com', status: 502, text: '<html>' + 'x'.repeat(5000) + '</html>' }, SLACK_OK]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 200);
    for (const block of slackCalls(stub)[0].body.blocks) {
      if (block.text && block.text.text) assert.ok(block.text.text.length <= 3000, `section is ${block.text.text.length} chars`);
    }
  });
});

test('the form template offers exactly the four ai_use keys, labelled with the C4 anchors the function writes', () => {
  const fs = require('node:fs');
  const html = fs.readFileSync(path.join(__dirname, '..', '..', '_templates', 'components', 'CohortApplyForm.html'), 'utf8');
  const pairs = [...html.matchAll(/name="ai_use" value="(\w+)"[^>]*>\s*<span class="check-field__label">([^<]+)<\/span>/g)]
    .map(([, key, label]) => [key, label.trim()]);
  assert.deepEqual(Object.fromEntries(pairs), {
    none: "I don't use AI tools yet",
    experimenting: "I experiment occasionally but don't have a consistent pattern",
    regular: 'I use AI regularly for specific tasks',
    embedded: 'AI is embedded in how I work day to day',
  });
  const scale = [...html.matchAll(/name="confidence" value="(\d+)"/g)].map((m) => Number(m[1]));
  assert.deepEqual(scale, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});


// ── Repeat applications and returning participants (#183) ──────────────────────────────

const LOOKUP = (records) => ({ match: 'tblFNkbk58DhsRZed?', method: 'GET', json: { records } });
const WRITE_OK = { match: 'api.airtable.com', method: 'POST', json: { id: 'recNEWAPPLICANT01' } };
const PROGRAMME_NAME = (name) => ({ match: 'tblTuSr8AJUu9HlHx/', method: 'GET', json: { fields: { 'Cohort name': name } } });

test('same email, same cohort: no new row, a duplicate response and a repeat ping linking the existing record', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([
      LOOKUP([{ id: 'recEXISTING000001', fields: { Programme: ['recPROGRAMME00000'], 'Enrollment Status': 'Interested' } }]),
      SLACK_OK,
    ]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { success: true, duplicate: true });
    assert.equal(airtableCalls(stub).length, 0);
    const text = slackText(slackCalls(stub)[0]);
    assert.ok(text.includes('Repeat application'));
    assert.ok(text.includes('tblFNkbk58DhsRZed/recEXISTING000001'));
  });
});

test('same email, same cohort via the no-JS form: 303 to the duplicate notice', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    global.fetch = makeFetchStub([LOOKUP([{ id: 'recEXISTING000001', fields: { Programme: ['recPROGRAMME00000'] } }]), SLACK_OK]);
    const res = await mod.handler(formPost(FORM_FIELDS));
    assert.equal(res.statusCode, 303);
    assert.equal(res.headers.Location, '/what-we-do/leadership-cohort/#cohort-apply-duplicate');
  });
});

test('the duplicate response stands even if the repeat ping fails: the record already exists', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    global.fetch = makeFetchStub([
      LOOKUP([{ id: 'recEXISTING000001', fields: { Programme: ['recPROGRAMME00000'] } }]),
      { match: 'hooks.slack.test/cohort', status: 500 },
    ]);
    const res = await mod.handler(makeEvent(VALID));
    assert.deepEqual(JSON.parse(res.body), { success: true, duplicate: true });
  });
});

test('waitlist mode: an existing unlinked row is the same cohort', async () => {
  await withEnv({ ...FULL_ENV, COHORT_PROGRAMME_RECORD_ID: '' }, async (mod) => {
    const stub = makeFetchStub([LOOKUP([{ id: 'recWAITLIST000001', fields: {} }]), SLACK_OK]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.deepEqual(JSON.parse(res.body), { success: true, duplicate: true });
    assert.equal(airtableCalls(stub).length, 0);
  });
});

test('same email, earlier cohort: new row, returning note in Notes, flagged in Slack with the cohort name', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([
      LOOKUP([{ id: 'recC2SEAT00000001', fields: { Programme: ['recC2PROGRAMME001'], 'Enrollment Status': 'Done' } }]),
      PROGRAMME_NAME('Claude Bootcamp for Leaders: Cohort 2'),
      WRITE_OK,
      SLACK_OK,
    ]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.deepEqual(JSON.parse(res.body), { success: true, airtable: 'created', slack: 'sent' });
    const written = airtableCalls(stub)[0].body.fields;
    assert.deepEqual(written.Programme, ['recPROGRAMME00000']);
    assert.equal(written.Notes, 'Returning participant: previously Claude Bootcamp for Leaders: Cohort 2 (Done)');
    const text = slackText(slackCalls(stub)[0]);
    assert.ok(text.includes('returning participant'));
    assert.ok(text.includes('Claude Bootcamp for Leaders: Cohort 2 (Done)'));
  });
});

test('returning participant whose programme name cannot be fetched is still flagged', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([
      LOOKUP([{ id: 'recC2SEAT00000001', fields: { Programme: ['recC2PROGRAMME001'], 'Enrollment Status': 'Done' } }]),
      { match: 'tblTuSr8AJUu9HlHx/', method: 'GET', status: 500 },
      WRITE_OK,
      SLACK_OK,
    ]);
    global.fetch = stub;
    await mod.handler(makeEvent(VALID));
    assert.equal(airtableCalls(stub)[0].body.fields.Notes, 'Returning participant: previously an earlier programme (Done)');
  });
});

test('lookup fails open: an Airtable read error still creates the application as new', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([{ match: 'tblFNkbk58DhsRZed?', method: 'GET', status: 500, text: 'down' }, WRITE_OK, SLACK_OK]);
    global.fetch = stub;
    const res = await mod.handler(makeEvent(VALID));
    assert.deepEqual(JSON.parse(res.body), { success: true, airtable: 'created', slack: 'sent' });
    assert.equal(airtableCalls(stub).length, 1);
  });
});

test('lookup matches email case-insensitively and escapes quotes in the formula', async () => {
  await withEnv(FULL_ENV, async (mod) => {
    const stub = makeFetchStub([LOOKUP([]), WRITE_OK, SLACK_OK]);
    global.fetch = stub;
    await mod.handler(makeEvent({ ...VALID, email: 'Ja"ne@Example.COM' }));
    const formula = new URL(lookupCalls(stub)[0].url).searchParams.get('filterByFormula');
    assert.equal(formula, 'LOWER({Email}) = "ja\\"ne@example.com"');
  });
});
