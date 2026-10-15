// Unit tests for netlify/functions/lead-capture.js — the GNG-1 consent-capture money path.
// Run: node --test tests/
//
// The function reads env vars + fetch at module load / call time, so each test resets
// process.env and clears the require cache before re-requiring the handler.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const MODULE_PATH = path.join(__dirname, '..', '..', 'netlify', 'functions', 'lead-capture.js');
const OFFERINGS_PATH = path.join(__dirname, '..', '..', 'content', 'data', 'offerings.json');
const APPLYFORM_PATH = path.join(__dirname, '..', '..', '_templates', 'components', 'ApplyForm.html');

const ENV_KEYS = ['SLACK_WEBHOOK_URL', 'AIRTABLE_TOKEN', 'AIRTABLE_BASE_ID', 'AIRTABLE_TABLE'];

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

const VALID_FIELDS = {
  'form-name': 'lead-capture-form',
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Acme Ltd',
  website: 'acme.com',
  role: 'CEO',
  timeline: 'immediately',
  consent_given: true,
  consent_timestamp: '2026-07-04T00:00:00.000Z',
};

function makeEvent(fields, { method = 'POST', bodyOverride } = {}) {
  return {
    httpMethod: method,
    body: bodyOverride !== undefined ? bodyOverride : JSON.stringify(fields),
  };
}

// Records every fetch call so assertions can inspect exact payloads sent to Slack/Airtable.
// A response with `once: true` is consumed by its first match — lets a test stub a 422
// on the first Airtable call and a 200 on the retry (the #106 select-drift recovery path).
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
    };
  };
  fn.calls = calls;
  return fn;
}

test('honeypot submissions are skipped as spam, no external calls', async () => {
  await withEnv({ SLACK_WEBHOOK_URL: 'https://hooks.slack.test/x' }, async (mod) => {
    global.fetch = makeFetchStub([]); // any call here throws "unstubbed" and fails the test
    const res = await mod.handler(makeEvent({ _honeypot: 'bot-filled-this' }));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { skipped: 'spam' });
  });
});

test('non-lead-capture form names are skipped', async () => {
  await withEnv({}, async (mod) => {
    global.fetch = makeFetchStub([]);
    const res = await mod.handler(makeEvent({ ...VALID_FIELDS, 'form-name': 'some-other-form' }));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { skipped: 'different form' });
  });
});

test('missing required fields are skipped', async () => {
  await withEnv({}, async (mod) => {
    global.fetch = makeFetchStub([]);
    const { name, ...rest } = VALID_FIELDS;
    const res = await mod.handler(makeEvent(rest));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { skipped: 'missing required fields' });
  });
});

test('malformed email is skipped — the endpoint accepts unauthenticated POSTs, format is not guaranteed', async () => {
  await withEnv({}, async (mod) => {
    global.fetch = makeFetchStub([]);
    const res = await mod.handler(makeEvent({ ...VALID_FIELDS, email: 'not-an-email' }));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { skipped: 'invalid email' });
  });
});

test('oversized payload is rejected with 413 before parsing', async () => {
  await withEnv({}, async (mod) => {
    global.fetch = makeFetchStub([]);
    const res = await mod.handler(makeEvent(null, { bodyOverride: 'x'.repeat(10_001) }));
    assert.equal(res.statusCode, 413);
    assert.equal(JSON.parse(res.body).error, 'Payload too large');
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

test('valid submission: Slack message is escaped and Airtable carries the GNG-1 consent fields exactly', async () => {
  await withEnv(
    {
      SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
      AIRTABLE_TOKEN: 'tok',
      AIRTABLE_BASE_ID: 'appTest',
      AIRTABLE_TABLE: 'Prospects',
    },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        { match: 'api.airtable.com', status: 200 },
      ]);
      global.fetch = fetchStub;

      const fields = {
        ...VALID_FIELDS,
        name: '<script>alert(1)</script> & friends',
      };
      const res = await mod.handler(makeEvent(fields));

      assert.equal(res.statusCode, 200);
      const resBody = JSON.parse(res.body);
      assert.equal(resBody.success, true);
      assert.equal(resBody.airtable, 'created');

      const slackCall = fetchStub.calls.find((c) => c.url.includes('hooks.slack.test'));
      const nameField = slackCall.body.blocks[1].fields[0].text;
      assert.ok(nameField.includes('&lt;script&gt;'), 'HTML must be escaped in Slack mrkdwn');
      assert.ok(nameField.includes('&amp; friends'), 'ampersand must be escaped in Slack mrkdwn');
      assert.ok(!nameField.includes('<script>'), 'raw script tag must not reach Slack');

      const airtableCall = fetchStub.calls.find((c) => c.url.includes('api.airtable.com'));
      assert.equal(airtableCall.body.fields['Consent Given'], true);
      assert.equal(airtableCall.body.fields['Consent Timestamp'], '2026-07-04T00:00:00.000Z');
      assert.equal(airtableCall.body.fields.Email, 'jane@example.com');
      // Must match the Prospects table's "Source" single-select option EXACTLY (Airtable
      // rejects any non-matching string as an attempt to create a new option, which this
      // token lacks permission to do — caught live in production at the 2026-07-14 B10
      // cutover: the code said "Accelerator-X Website", Airtable's option is "Accelerator X
      // Website" (no hyphen), and the mismatch was invisible to this suite's mocked fetch
      // since a stub returns 200 regardless of payload content).
      assert.equal(airtableCall.body.fields.Source, 'Accelerator X Website');
    }
  );
});

test('service-interest slug is mapped to a readable label in Slack + Airtable Notes; problem text flows into Notes and its own Slack block', async () => {
  await withEnv(
    {
      SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
      AIRTABLE_TOKEN: 'tok',
      AIRTABLE_BASE_ID: 'appTest',
      AIRTABLE_TABLE: 'Prospects',
    },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        { match: 'api.airtable.com', status: 200 },
      ]);
      global.fetch = fetchStub;

      const fields = {
        ...VALID_FIELDS,
        interest: 'leadership-activation',
        problem: 'Our leadership team has no shared AI vocabulary',
      };
      const res = await mod.handler(makeEvent(fields));
      assert.equal(res.statusCode, 200);

      const slackCall = fetchStub.calls.find((c) => c.url.includes('hooks.slack.test'));
      const slackText = JSON.stringify(slackCall.body);
      assert.ok(slackText.includes('Leadership Team AI Activation'), 'raw slug must be mapped to its display name');
      assert.ok(slackText.includes('Trying to solve'));
      assert.ok(slackText.includes('no shared AI vocabulary'));

      const airtableCall = fetchStub.calls.find((c) => c.url.includes('api.airtable.com'));
      // Service interest is a real multipleSelects field as of 2026-08-09, not prose in
      // Notes — that was the whole point of adding it. Notes keeps only the answers that
      // have no structured home.
      assert.deepEqual(airtableCall.body.fields['Service Interest'], ['Leadership Team AI Activation']);
      assert.ok(!airtableCall.body.fields.Notes.includes('Service interest:'));
      assert.ok(airtableCall.body.fields.Notes.includes('Trying to solve: Our leadership team has no shared AI vocabulary'));
    }
  );
});

test('multiple service interests are written as an array (form may send string or array)', async () => {
  await withEnv(
    {
      SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
      AIRTABLE_TOKEN: 'tok',
      AIRTABLE_BASE_ID: 'appTest',
      AIRTABLE_TABLE: 'Accounts',
    },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        { match: 'api.airtable.com', status: 200 },
      ]);
      global.fetch = fetchStub;

      const res = await mod.handler(
        makeEvent({ ...VALID_FIELDS, interest: ['company-enablement', 'leadership-activation'] })
      );
      assert.equal(res.statusCode, 200);

      const airtableCall = fetchStub.calls.find((c) => c.url.includes('api.airtable.com'));
      assert.deepEqual(airtableCall.body.fields['Service Interest'], [
        'Company Enablement',
        'Leadership Team AI Activation',
      ]);

      const slackText = JSON.stringify(fetchStub.calls.find((c) => c.url.includes('hooks.slack.test')).body);
      assert.ok(slackText.includes('Company Enablement'));
      assert.ok(slackText.includes('Leadership Team AI Activation'));
    }
  );
});

test('an unmapped select value degrades to Notes rather than 422-ing the whole record', async () => {
  await withEnv(
    {
      SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
      AIRTABLE_TOKEN: 'tok',
      AIRTABLE_BASE_ID: 'appTest',
      AIRTABLE_TABLE: 'Accounts',
    },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        { match: 'api.airtable.com', status: 200 },
      ]);
      global.fetch = fetchStub;

      // Airtable rejects any select value that is not already a choice. A form option
      // added without adding the Airtable choice must cost us the label, never the lead.
      const res = await mod.handler(
        makeEvent({ ...VALID_FIELDS, interest: 'some-new-offering-nobody-added', timeline: 'next-decade' })
      );
      assert.equal(res.statusCode, 200);

      const fields = fetchStub.calls.find((c) => c.url.includes('api.airtable.com')).body.fields;
      assert.ok(!('Service Interest' in fields), 'unmapped interest must be omitted, not sent');
      assert.ok(!('Timeline' in fields), 'unmapped timeline must be omitted, not sent');
      assert.ok(fields.Notes.includes('Service interest (unmapped): some-new-offering-nobody-added'));
      assert.ok(fields.Notes.includes('Timeline (unmapped): next-decade'));
      assert.equal(fields['Primary Contact Name'], VALID_FIELDS.name, 'the lead itself must still be written');
    }
  );
});

test('consent is written as structured fields — the GDPR record, not prose', async () => {
  await withEnv(
    {
      SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
      AIRTABLE_TOKEN: 'tok',
      AIRTABLE_BASE_ID: 'appTest',
      AIRTABLE_TABLE: 'Accounts',
    },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        { match: 'api.airtable.com', status: 200 },
      ]);
      global.fetch = fetchStub;

      await mod.handler(
        makeEvent({ ...VALID_FIELDS, consent_given: true, consent_timestamp: '2026-08-09T20:25:50.924Z' })
      );

      const fields = fetchStub.calls.find((c) => c.url.includes('api.airtable.com')).body.fields;
      assert.equal(fields['Consent Given'], true);
      assert.equal(fields['Consent Timestamp'], '2026-08-09T20:25:50.924Z');
      assert.equal(fields['Primary Contact Role'], VALID_FIELDS.role);
    }
  );
});

test('unrecognised interest slug falls back to showing the raw value, not a blank or thrown error', async () => {
  await withEnv(
    { SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead' },
    async (mod) => {
      global.fetch = makeFetchStub([{ match: 'hooks.slack.test', status: 200 }]);
      const res = await mod.handler(makeEvent({ ...VALID_FIELDS, interest: 'some-future-offering' }));
      assert.equal(res.statusCode, 200);
      const slackCall = global.fetch.calls.find((c) => c.url.includes('hooks.slack.test'));
      assert.ok(JSON.stringify(slackCall.body).includes('some-future-offering'));
    }
  );
});

// Drift guard: the function's interestLabels map hardcodes offering display names, which
// Check #10 does NOT scan (it only covers _templates/). This test is the guard instead —
// it parses the interest slugs the ApplyForm actually offers and asserts each renders its
// offerings.json name through the function, so form ⇄ function ⇄ offer-canon can't silently desync.
test('every ApplyForm interest slug maps to its offerings.json name via the function (no silent label drift)', async () => {
  const offerings = JSON.parse(fs.readFileSync(OFFERINGS_PATH, 'utf8')).offerings;
  const applyForm = fs.readFileSync(APPLYFORM_PATH, 'utf8');
  const formSlugs = [...applyForm.matchAll(/name="interest"\s+value="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(formSlugs.length >= 2, 'expected to find interest radio values in ApplyForm.html');
  // Slugs the form no longer offers but the function still maps, because older cached pages
  // may post them: the cohort moved to its own form (#177). Kept under the same guard.
  const LEGACY_SLUGS = ['leadership-cohort'];
  const slugs = [...new Set([...formSlugs, ...LEGACY_SLUGS])];

  for (const slug of slugs) {
    if (slug === 'just-exploring') continue; // not an offering — has its own literal label
    const offering = offerings.find((o) => o.key === slug);
    assert.ok(offering, `ApplyForm offers interest "${slug}" but offerings.json has no matching key`);

    await withEnv({ SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead' }, async (mod) => {
      global.fetch = makeFetchStub([{ match: 'hooks.slack.test', status: 200 }]);
      await mod.handler(makeEvent({ ...VALID_FIELDS, interest: slug }));
      const slackCall = global.fetch.calls.find((c) => c.url.includes('hooks.slack.test'));
      assert.ok(
        JSON.stringify(slackCall.body).includes(offering.name),
        `interest "${slug}" should render offerings.json name "${offering.name}" — the function's interestLabels map has drifted from the canon`
      );
    });
  }
});

test('missing interest with a source present falls back to "Not specified" and still captures the lead', async () => {
  await withEnv(
    {
      SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
      AIRTABLE_TOKEN: 'tok',
      AIRTABLE_BASE_ID: 'appTest',
      AIRTABLE_TABLE: 'Prospects',
    },
    async (mod) => {
      global.fetch = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        { match: 'api.airtable.com', status: 200 },
      ]);
      // VALID_FIELDS carries no `interest`; add a source so the interest/source block renders.
      const res = await mod.handler(makeEvent({ ...VALID_FIELDS, source: 'homepage-hero' }));
      assert.equal(res.statusCode, 200);
      assert.equal(JSON.parse(res.body).airtable, 'created', 'a lead without interest must still be captured, not rejected');
      const slackCall = global.fetch.calls.find((c) => c.url.includes('hooks.slack.test'));
      assert.ok(JSON.stringify(slackCall.body).includes('Not specified'));
    }
  );
});

// #106 claim 1: Consent Timestamp is an Airtable dateTime field, so an unparseable value
// 422s the ENTIRE record — the same failure class #95 fixed, on the GDPR field #95 existed
// to protect. These assert the record IS WRITTEN (airtable: 'created' + payload inspected),
// not merely that no exception escaped.
test('a malformed consent_timestamp still writes the record — server time used, rejected value preserved in Notes', async () => {
  // Both shapes must fail the guard: garbage that fails the ISO regex, and a string that
  // LOOKS ISO-shaped but is an impossible date (only Date.parse catches it).
  for (const badTimestamp of ['yesterday-ish, around noon', '2026-13-45T99:99:99.000Z']) {
    await withEnv(
      {
        SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
        AIRTABLE_TOKEN: 'tok',
        AIRTABLE_BASE_ID: 'appTest',
        AIRTABLE_TABLE: 'Accounts',
      },
      async (mod) => {
        const fetchStub = makeFetchStub([
          { match: 'hooks.slack.test', status: 200 },
          { match: 'api.airtable.com', status: 200 },
        ]);
        global.fetch = fetchStub;

        const res = await mod.handler(makeEvent({ ...VALID_FIELDS, consent_timestamp: badTimestamp }));
        assert.equal(res.statusCode, 200);
        assert.equal(JSON.parse(res.body).airtable, 'created', `record must still be written for "${badTimestamp}"`);

        const fields = fetchStub.calls.find((c) => c.url.includes('api.airtable.com')).body.fields;
        assert.equal(fields['Primary Contact Name'], VALID_FIELDS.name, 'the lead itself must still be written');
        assert.notEqual(fields['Consent Timestamp'], badTimestamp, 'the rejected value must never reach the dateTime field');
        assert.ok(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(fields['Consent Timestamp']),
          'fallback must be clean server-time ISO-8601'
        );
        assert.ok(
          fields.Notes.includes(`Consent timestamp (rejected, server time used): ${badTimestamp}`),
          'the rejected raw value must be preserved in Notes'
        );
      }
    );
  }
});

// #106 claim 2: the mapped-choices guard only covers values the FUNCTION doesn't know.
// Drift the other way — a label the function knows but Airtable doesn't (new offering,
// choice not yet added) — 422s the whole record. The recovery: retry once with the
// rejected select moved to Notes, so drift costs a label, never the lead.
test('a select choice Airtable does not know still writes the record — one retry with the field moved to Notes', async () => {
  await withEnv(
    {
      SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
      AIRTABLE_TOKEN: 'tok',
      AIRTABLE_BASE_ID: 'appTest',
      AIRTABLE_TABLE: 'Accounts',
    },
    async (mod) => {
      const rejectedLabel = 'Open Cohort AI Bootcamp for Business Leaders';
      const fetchStub = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        {
          match: 'api.airtable.com',
          status: 422,
          text: `{"error":{"type":"INVALID_MULTIPLE_CHOICE_OPTIONS","message":"Insufficient permissions to create new select option \\"${rejectedLabel}\\""}}`,
          once: true,
        },
        { match: 'api.airtable.com', status: 200 },
      ]);
      global.fetch = fetchStub;

      const res = await mod.handler(makeEvent({ ...VALID_FIELDS, interest: 'leadership-cohort' }));
      assert.equal(res.statusCode, 200);
      assert.equal(JSON.parse(res.body).airtable, 'created', 'the retry must land the record');

      const airtableCalls = fetchStub.calls.filter((c) => c.url.includes('api.airtable.com'));
      assert.equal(airtableCalls.length, 2, 'expected exactly one retry after the 422');
      const retryFields = airtableCalls[1].body.fields;
      assert.ok(!('Service Interest' in retryFields), 'the rejected select must be omitted on retry');
      assert.ok(retryFields.Notes.includes(rejectedLabel), 'the rejected choice must be preserved in Notes');
      assert.equal(retryFields.Timeline, 'Immediately', 'selects the 422 did not name must survive the retry');
      assert.equal(retryFields.Source, 'Accelerator X Website');
      assert.equal(retryFields['Primary Contact Name'], VALID_FIELDS.name, 'the lead itself must still be written');
      assert.equal(retryFields['Consent Given'], true, 'the GDPR consent record must survive the retry');

      const slackCalls = fetchStub.calls.filter((c) => c.url.includes('hooks.slack.test'));
      assert.equal(slackCalls.length, 1, 'a recovered write must not fire the GNG-1 failure alert');
    }
  );
});

test('a select-drift retry that also 422s falls through to the GNG-1 alert — one retry, never a loop', async () => {
  await withEnv(
    {
      SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
      AIRTABLE_TOKEN: 'tok',
      AIRTABLE_BASE_ID: 'appTest',
      AIRTABLE_TABLE: 'Accounts',
    },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        {
          match: 'api.airtable.com',
          status: 422,
          text: '{"error":{"type":"INVALID_MULTIPLE_CHOICE_OPTIONS","message":"Insufficient permissions to create new select option"}}',
        },
      ]);
      global.fetch = fetchStub;

      const res = await mod.handler(makeEvent(VALID_FIELDS));
      assert.equal(res.statusCode, 200);
      assert.equal(JSON.parse(res.body).airtable, 'failed');

      const airtableCalls = fetchStub.calls.filter((c) => c.url.includes('api.airtable.com'));
      assert.equal(airtableCalls.length, 2, 'exactly one retry — a persistent 422 must not loop');
      const slackCalls = fetchStub.calls.filter((c) => c.url.includes('hooks.slack.test'));
      assert.equal(slackCalls.length, 2, 'expected the lead notification + the GNG-1 failure alert');
      assert.ok(slackCalls[1].body.text.includes('CONSENT WRITE FAILED'));
    }
  );
});

test('non-POST methods get a 405 — the endpoint is same-origin by design, no CORS preflight contract', async () => {
  await withEnv({}, async (mod) => {
    global.fetch = makeFetchStub([]);
    for (const method of ['OPTIONS', 'GET']) {
      const res = await mod.handler(makeEvent(null, { method, bodyOverride: '' }));
      assert.equal(res.statusCode, 405);
      assert.ok(!JSON.stringify(res.headers).includes('Access-Control'), 'no CORS headers — same-origin only');
    }
  });
});

test('an unexpected failure returns a generic 500 — internal error detail stays in the logs, not the response', async () => {
  await withEnv(
    { SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead' },
    async (mod) => {
      global.fetch = makeFetchStub([{ match: 'hooks.slack.test', status: 500 }]);
      const res = await mod.handler(makeEvent(VALID_FIELDS));
      assert.equal(res.statusCode, 500);
      assert.equal(JSON.parse(res.body).error, 'Server error');
      assert.ok(!res.body.includes('Slack'), 'internal error strings must not leak to the client');
    }
  );
});

test('Airtable write failure fires a distinct GNG-1 alert and still returns success:true (fails-soft)', async () => {
  await withEnv(
    {
      SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
      AIRTABLE_TOKEN: 'tok',
      AIRTABLE_BASE_ID: 'appTest',
      AIRTABLE_TABLE: 'Prospects',
    },
    async (mod) => {
      const fetchStub = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        { match: 'api.airtable.com', status: 422, text: 'INVALID_REQUEST' },
      ]);
      global.fetch = fetchStub;

      const res = await mod.handler(makeEvent(VALID_FIELDS));
      assert.equal(res.statusCode, 200);
      const resBody = JSON.parse(res.body);
      assert.equal(resBody.success, true, 'must stay fails-soft for the user');
      assert.equal(resBody.airtable, 'failed');

      const slackCalls = fetchStub.calls.filter((c) => c.url.includes('hooks.slack.test'));
      assert.equal(slackCalls.length, 2, 'expected the normal lead notification + a distinct GNG-1 failure alert');
      const alert = slackCalls[1].body;
      assert.ok(alert.text.includes('CONSENT WRITE FAILED'));
      assert.ok(alert.text.includes('GNG-1'));
    }
  );
});
