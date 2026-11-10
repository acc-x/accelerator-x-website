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

const CONTACTS_TABLE = 'tblfTdPnRU15wAdtR';
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
    // Contacts-table calls (#204): only stubs naming the Contacts table id claim them (and,
    // when they set `method`, only that method), so a blanket 'api.airtable.com' stub never
    // answers a Contact call by accident. Unclaimed GET/POST get a benign default (no
    // existing Contact, create OK) to keep older Account-focused tests simple; an unclaimed
    // PATCH throws, because no older test expects a Contact to be modified.
    const isContacts = url.includes(CONTACTS_TABLE);
    const method = opts?.method || 'GET';
    const explicit = responses.find((r) => url.includes(r.match) && !(r.once && r.used)
      && (!isContacts || (r.match === CONTACTS_TABLE && (!r.method || r.method === method))));
    const match = explicit || (isContacts && method !== 'PATCH'
      ? { status: 200, text: method === 'GET' ? '{"records":[]}' : '{"id":"recContact1"}' }
      : undefined);
    if (match?.once) match.used = true;
    if (!match) throw new Error(`Unstubbed fetch call to ${url}`);
    if (match.throws) throw new Error(match.throws);
    // The Account POST returns the new record id, which the Contact link needs.
    const defaultText = url.includes('api.airtable.com') && !isContacts ? '{"id":"recAcct1"}' : '';
    return {
      ok: match.status === undefined || (match.status >= 200 && match.status < 300),
      status: match.status ?? 200,
      text: async () => match.text ?? defaultText,
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
        { match: 'api.airtable.com', status: 200, text: '{"id":"recAcct1"}' },
      ]);
      global.fetch = fetchStub;

      const res = await mod.handler(makeEvent({ ...VALID_FIELDS, interest: 'leadership-cohort' }));
      assert.equal(res.statusCode, 200);
      assert.equal(JSON.parse(res.body).airtable, 'created', 'the retry must land the record');

      const airtableCalls = fetchStub.calls.filter((c) => c.url.includes('api.airtable.com') && !c.url.includes(CONTACTS_TABLE));
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

// ---- #204: linked Contact -------------------------------------------------------------

const CONTACT_ENV = {
  SLACK_WEBHOOK_URL: 'https://hooks.slack.test/lead',
  AIRTABLE_TOKEN: 'tok',
  AIRTABLE_BASE_ID: 'appTest',
  AIRTABLE_TABLE: 'Prospects',
};

// Runs the handler capturing console output, so tests can assert on the internal Contact
// outcome (which is deliberately absent from the public response).
async function runCapturing(mod, fields) {
  const logs = { log: [], warn: [], error: [] };
  const orig = { log: console.log, warn: console.warn, error: console.error };
  for (const k of Object.keys(logs)) console[k] = (...a) => logs[k].push(a.join(' '));
  try {
    const res = await mod.handler(makeEvent(fields));
    return { res, logs };
  } finally {
    Object.assign(console, orig);
  }
}

const contactCalls = (stub, method) => stub.calls.filter((c) => c.url.includes(CONTACTS_TABLE) && c.opts.method === method);
const slackTexts = (stub) => stub.calls.filter((c) => c.url.includes('hooks.slack.test')).map((c) => c.body.text || '');

test('new submission creates a Contact (name, title, email, role type, notes) linked to the new Account', async () => {
  await withEnv(CONTACT_ENV, async (mod) => {
    const fetchStub = makeFetchStub([
      { match: 'hooks.slack.test', status: 200 },
      { match: 'api.airtable.com', status: 200, text: '{"id":"recAcctNew"}' },
    ]);
    global.fetch = fetchStub;

    const { res, logs } = await runCapturing(mod, VALID_FIELDS);
    const resBody = JSON.parse(res.body);
    assert.equal(resBody.airtable, 'created');
    assert.ok(logs.log.some((l) => l.includes('Contact outcome: created')));

    const create = contactCalls(fetchStub, 'POST')[0];
    assert.ok(create, 'expected a POST to the Contacts table');
    assert.ok(create.url.includes('/appTest/'), 'Contacts live in the same base as Accounts');
    const f = create.body.fields;
    assert.equal(f.fldgbdXyNz5bGsfyV, 'Jane Doe');
    assert.equal(f.fld9RSxKZZSGxTgtx, 'CEO');
    assert.equal(f.fldq8I7LzeY0I5qcn, 'jane@example.com');
    assert.equal(f.fldpSheO6tJ94mj1n, 'Other');
    assert.deepEqual(f.fld1tpjGWbZ4rUjsb, ['recAcctNew']);
    assert.ok(f.fldNsN7N0AKuDSNdx.length > 0);
    assert.equal(slackTexts(fetchStub).filter((t) => t.includes('⚠️')).length, 0, 'clean path raises no alert');
  });
});

test('the public response never reveals the Contact outcome (no email-existence oracle)', async () => {
  await withEnv(CONTACT_ENV, async (mod) => {
    for (const records of [[], [{ id: 'recOld', fields: {} }]]) {
      global.fetch = makeFetchStub([
        { match: 'hooks.slack.test', status: 200 },
        { match: CONTACTS_TABLE, method: 'GET', status: 200, text: JSON.stringify({ records }) },
        { match: CONTACTS_TABLE, method: 'PATCH', status: 200, text: '{}' },
        { match: 'api.airtable.com', status: 200, text: '{"id":"recAcctNew"}' },
      ]);
      const { res } = await runCapturing(mod, VALID_FIELDS);
      assert.deepEqual(Object.keys(JSON.parse(res.body)).sort(), ['airtable', 'message', 'success']);
    }
  });
});

test('an existing Contact with NO Account links is linked to the new Account, not duplicated', async () => {
  await withEnv(CONTACT_ENV, async (mod) => {
    const fetchStub = makeFetchStub([
      { match: 'hooks.slack.test', status: 200 },
      { match: CONTACTS_TABLE, method: 'GET', status: 200,
        text: JSON.stringify({ records: [{ id: 'recOld', fields: {} }] }) },
      { match: CONTACTS_TABLE, method: 'PATCH', status: 200, text: '{}' },
      { match: 'api.airtable.com', status: 200, text: '{"id":"recAcctNew"}' },
    ]);
    global.fetch = fetchStub;

    const { logs } = await runCapturing(mod, VALID_FIELDS);
    assert.ok(logs.log.some((l) => l.includes('Contact outcome: matched')));
    const lookup = contactCalls(fetchStub, 'GET')[0];
    assert.ok(decodeURIComponent(lookup.url).includes('LOWER({fldq8I7LzeY0I5qcn})="jane@example.com"'));
    assert.equal(contactCalls(fetchStub, 'POST').length, 0, 'no second Contact may be created');
    const patch = contactCalls(fetchStub, 'PATCH')[0];
    assert.ok(patch.url.endsWith('/recOld'), 'the PATCH must be served by the PATCH stub and target the existing Contact');
    assert.deepEqual(patch.body.fields.fld1tpjGWbZ4rUjsb, ['recAcctNew']);
  });
});

test('an existing Contact already linked to another Account is NOT touched: no patch, no create, distinct alert with the new Account id', async () => {
  await withEnv(CONTACT_ENV, async (mod) => {
    const fetchStub = makeFetchStub([
      { match: 'hooks.slack.test', status: 200 },
      { match: CONTACTS_TABLE, method: 'GET', status: 200,
        text: JSON.stringify({ records: [{ id: 'recClient', fields: { fld1tpjGWbZ4rUjsb: ['recRealClientAcct'] } }] }) },
      { match: 'api.airtable.com', status: 200, text: '{"id":"recAcctNew"}' },
    ]);
    global.fetch = fetchStub;

    const { res, logs } = await runCapturing(mod, VALID_FIELDS);
    assert.equal(JSON.parse(res.body).airtable, 'created', 'the Account and success response are unaffected');
    assert.equal(contactCalls(fetchStub, 'PATCH').length, 0, "a real client's Contact must never be re-linked by a form submission");
    assert.equal(contactCalls(fetchStub, 'POST').length, 0);
    assert.ok(logs.warn.some((l) => l.includes('already belongs to another Account')));
    const alerts = slackTexts(fetchStub).filter((t) => t.includes('CONTACT NOT LINKED'));
    assert.equal(alerts.length, 1);
    assert.ok(alerts[0].includes('jane@example.com') && alerts[0].includes('recAcctNew'));
  });
});

test('a quote in the email cannot break out of the lookup formula', async () => {
  await withEnv(CONTACT_ENV, async (mod) => {
    const fetchStub = makeFetchStub([
      { match: 'hooks.slack.test', status: 200 },
      { match: 'api.airtable.com', status: 200, text: '{"id":"recAcctNew"}' },
    ]);
    global.fetch = fetchStub;
    await runCapturing(mod, { ...VALID_FIELDS, email: 'a"b@example.com' });
    const lookup = contactCalls(fetchStub, 'GET')[0];
    assert.ok(decodeURIComponent(lookup.url).includes('="a\\"b@example.com"'));
  });
});

test('Contact write failure: Account and Slack post stand; failure is logged and alerted with the Account id and link', async () => {
  await withEnv(CONTACT_ENV, async (mod) => {
    const fetchStub = makeFetchStub([
      { match: 'hooks.slack.test', status: 200 },
      { match: CONTACTS_TABLE, method: 'GET', status: 403, text: 'NOT_AUTHORIZED' },
      { match: 'api.airtable.com', status: 200, text: '{"id":"recAcctNew"}' },
    ]);
    global.fetch = fetchStub;
    const { res, logs } = await runCapturing(mod, VALID_FIELDS);

    const resBody = JSON.parse(res.body);
    assert.equal(res.statusCode, 200);
    assert.equal(resBody.success, true);
    assert.equal(resBody.airtable, 'created', 'Account write must not be undone');
    assert.ok(logs.error.some((e) => e.includes('Contact write error')), 'failure must reach the function logs');
    const texts = slackTexts(fetchStub);
    assert.equal(texts.length, 2, 'lead notification + a distinct Contact failure alert');
    assert.ok(texts[1].includes('CONTACT WRITE FAILED'));
    assert.ok(!texts[1].includes('CONSENT WRITE FAILED'), 'must not masquerade as a GNG-1 failure');
    assert.ok(texts[1].includes('recAcctNew'), 'alert names the Account record');
    assert.ok(texts[1].includes('https://airtable.com/appTest/tblLEGVkKjS4WaQ4L/recAcctNew'), 'alert links the Account');
  });
});

test('a hanging Contacts call is aborted and becomes a failed outcome, not a function timeout', async () => {
  await withEnv(CONTACT_ENV, async (mod) => {
    const calls = [];
    global.fetch = async (url, opts) => {
      calls.push({ url, opts, body: opts?.body ? JSON.parse(opts.body) : undefined });
      if (url.includes(CONTACTS_TABLE)) {
        assert.ok(opts.signal, 'every Contacts call must carry an abort signal');
        // Hang until the signal fires, as a stalled socket would.
        return new Promise((_, reject) => opts.signal.addEventListener('abort', () => reject(new Error('aborted'))));
      }
      return { ok: true, status: 200, text: async () => '{"id":"recAcctNew"}' };
    };
    const { res, logs } = await runCapturing(mod, VALID_FIELDS);
    assert.equal(JSON.parse(res.body).success, true);
    assert.ok(logs.error.some((e) => e.includes('Contact write error')));
    const alert = calls.filter((c) => c.url.includes('hooks.slack.test')).map((c) => c.body.text).find((t) => t.includes('CONTACT WRITE FAILED'));
    assert.ok(alert, 'timeout raises the existing failure alert');
  });
}, { timeout: 10000 });

test('a post-create re-check finding two Contacts for the email is logged and alerted (double-submit race)', async () => {
  await withEnv(CONTACT_ENV, async (mod) => {
    const fetchStub = makeFetchStub([
      { match: 'hooks.slack.test', status: 200 },
      { match: CONTACTS_TABLE, method: 'GET', status: 200, once: true, text: '{"records":[]}' },
      { match: CONTACTS_TABLE, method: 'GET', status: 200,
        text: JSON.stringify({ records: [{ id: 'recA', fields: {} }, { id: 'recB', fields: {} }] }) },
      { match: 'api.airtable.com', status: 200, text: '{"id":"recAcctNew"}' },
    ]);
    global.fetch = fetchStub;
    const { logs } = await runCapturing(mod, VALID_FIELDS);
    assert.equal(contactCalls(fetchStub, 'GET').length, 2, 'lookup, then re-check after create');
    assert.ok(logs.warn.some((l) => l.includes('More than one Contact')));
    const alert = slackTexts(fetchStub).find((t) => t.includes('DUPLICATE CONTACT'));
    assert.ok(alert && alert.includes('recAcctNew'));
  });
});

test('no Contact write is attempted when the Account write failed', async () => {
  await withEnv(CONTACT_ENV, async (mod) => {
    const fetchStub = makeFetchStub([
      { match: 'hooks.slack.test', status: 200 },
      { match: 'api.airtable.com', status: 422, text: 'INVALID_REQUEST' },
    ]);
    global.fetch = fetchStub;
    await runCapturing(mod, VALID_FIELDS);
    assert.equal(fetchStub.calls.filter((c) => c.url.includes(CONTACTS_TABLE)).length, 0);
  });
});
