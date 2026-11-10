// Netlify Function: lead-capture
// Triggered by: direct same-origin JSON POST from the apply form (assets/js/forms.js)
// Handles: lead applications → Airtable CRM (consent-stamped) + Slack #website-leads
// NOT responsible for: newsletter signups (handled by newsletter-subscribe.js directly)
// Env vars required: SLACK_WEBHOOK_URL, AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// Airtable configuration via environment variables
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE;

const AIRTABLE_API_URL = AIRTABLE_BASE_ID && AIRTABLE_TABLE
  ? `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`
  : null;

// CRM Contacts table (same base as Accounts). Field ids, not names, so a renamed column
// cannot silently break the write (#204). Role type is a single select; "Other" is the
// closest existing choice for a web applicant.
const CONTACTS_API_URL = AIRTABLE_BASE_ID
  ? `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/tblfTdPnRU15wAdtR`
  : null;
const CONTACT_FIELDS = {
  name: 'fldgbdXyNz5bGsfyV',
  jobTitle: 'fld9RSxKZZSGxTgtx',
  email: 'fldq8I7LzeY0I5qcn',
  roleType: 'fldpSheO6tJ94mj1n',
  account: 'fld1tpjGWbZ4rUjsb',
  notes: 'fldNsN7N0AKuDSNdx'
};

// Creates a Contact linked to the new Account, or links the existing Contact that has the
// same email (so a repeat submission never makes a second one). Throws on any failure; the
// caller treats that as non-fatal and alerts, because the Account and Slack post matter more.
async function upsertContact({ name, email, role, accountId, source }) {
  if (!CONTACTS_API_URL) throw new Error('Contacts table URL unavailable (AIRTABLE_BASE_ID missing)');
  if (!accountId) throw new Error('Account created but its record id was not returned, cannot link Contact');
  const auth = { Authorization: `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' };

  // Case-insensitive exact match on email; escape for the formula string literal.
  const emailLiteral = email.toLowerCase().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const formula = `LOWER({${CONTACT_FIELDS.email}})="${emailLiteral}"`;
  const lookupUrl = `${CONTACTS_API_URL}?maxRecords=1&returnFieldsByFieldId=true&filterByFormula=${encodeURIComponent(formula)}`;
  const lookup = await fetch(lookupUrl, { method: 'GET', headers: auth });
  if (!lookup.ok) throw new Error(`Contact lookup error: ${lookup.status} ${await lookup.text()}`);
  const found = JSON.parse((await lookup.text()) || '{}').records?.[0];

  if (found) {
    const linked = Array.isArray(found.fields?.[CONTACT_FIELDS.account]) ? found.fields[CONTACT_FIELDS.account] : [];
    if (linked.includes(accountId)) return 'matched';
    const patch = await fetch(`${CONTACTS_API_URL}/${found.id}`, {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify({ fields: { [CONTACT_FIELDS.account]: [...linked, accountId] } })
    });
    if (!patch.ok) throw new Error(`Contact link error: ${patch.status} ${await patch.text()}`);
    return 'matched';
  }

  const create = await fetch(CONTACTS_API_URL, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      fields: {
        [CONTACT_FIELDS.name]: name,
        [CONTACT_FIELDS.jobTitle]: role,
        [CONTACT_FIELDS.email]: email,
        [CONTACT_FIELDS.roleType]: 'Other',
        [CONTACT_FIELDS.account]: [accountId],
        [CONTACT_FIELDS.notes]: `Created automatically from a website application${source ? ` (${source})` : ''}.`
      }
    })
  });
  if (!create.ok) throw new Error(`Contact create error: ${create.status} ${await create.text()}`);
  return 'created';
}

exports.handler = async (event, context) => {
  // No CORS headers by design: forms.js posts same-origin, so no preflight ever fires.
  // The previous 'Access-Control-Allow-Origin: *' advertised a cross-origin contract
  // whose OPTIONS handler was unreachable anyway (the 405 guard ran first) — dropping
  // both locks the endpoint to same-origin use instead of half-promising more.
  const headers = { 'Content-Type': 'application/json' };

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Reject oversized payloads before parsing
  if (event.body && event.body.length > 10_000) {
    return { statusCode: 413, headers, body: JSON.stringify({ error: 'Payload too large' }) };
  }

  let body;
  try {
    // Parse form data - accept both direct JSON and Netlify webhook format
    body = JSON.parse(event.body);
  } catch (parseError) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  try {
    const data = body.payload?.data || body;

    // Honeypot / spam check
    if (data._honeypot) {
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'spam' }) };
    }

    // Route by form name — only handle lead-capture-form
    const formName = data['form-name'] || data.form_name || '';
    if (formName !== 'lead-capture-form') {
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'different form' }) };
    }

    const safeTrim = (val = '', maxLen = Infinity) => String(val).trim().slice(0, maxLen);

    // Normalize website: prepend https:// if missing
    const normalizeWebsite = (val = '') => {
      const v = safeTrim(val, 320);
      if (!v) return '';
      if (/^https?:\/\//i.test(v)) return v;
      return `https://${v}`;
    };

    // Slack mrkdwn treats &, <, > as markup — escape before interpolating user input
    // (https://api.slack.com/reference/surfaces/formatting#escaping)
    const escapeSlack = (val = '') => String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const name = safeTrim(data.name, 200);
    const email = safeTrim(data.email, 320);
    const company = safeTrim(data.company, 200);
    const website = normalizeWebsite(data.website);
    const role = safeTrim(data.role, 200);
    const timelineRaw = safeTrim(data.timeline);
    const problem = safeTrim(data.problem || '', 500);
    // Service interest is MULTI-select as of 2026-08-09 — the form may send a single
    // string (current) or an array (once the redesign lands). Accept both so the
    // function does not need to ship in lockstep with the form.
    const interestRawList = (Array.isArray(data.interest) ? data.interest : [data.interest || ''])
      .map((v) => safeTrim(v, 200))
      .filter(Boolean);
    const interestRaw = interestRawList.join(',');
    const source = safeTrim(data.source || '', 200);
    const consentGiven = data.consent_given === true;
    // Airtable's Consent Timestamp is a dateTime field — an unparseable value 422s the
    // ENTIRE record (#106, the same failure class #95 fixed, on the GDPR field #95
    // existed to protect). The endpoint accepts direct unauthenticated POSTs, so treat
    // the client value as hostile: anything that isn't clean ISO-8601 falls back to
    // server time (a defensible consent timestamp — the request just arrived) and the
    // rejected raw value is preserved in Notes rather than costing the lead.
    const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
    const consentTimestampRaw = safeTrim(data.consent_timestamp || '', 64);
    const consentTimestampRejected = Boolean(consentTimestampRaw)
      && !(ISO_TIMESTAMP.test(consentTimestampRaw) && !Number.isNaN(Date.parse(consentTimestampRaw)));
    const consentTimestamp = consentTimestampRaw && !consentTimestampRejected
      ? consentTimestampRaw
      : new Date().toISOString();

    // Required fields guard
    if (!name || !email || !company || !website || !role) {
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'missing required fields' }) };
    }

    // Basic domain validation post-normalization (allows bare domains once https:// is added)
    const domainPattern = /^https?:\/\/[\w.-]+\.[A-Za-z]{2,}.*$/;
    if (!domainPattern.test(website)) {
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'invalid website' }) };
    }

    // Same hostile-input posture as the timestamp/website checks above — this endpoint
    // accepts direct unauthenticated POSTs, so email format isn't guaranteed by the
    // client's type="email" input. Mirrors newsletter-subscribe.js's validation.
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_PATTERN.test(email)) {
      return { statusCode: 200, headers, body: JSON.stringify({ skipped: 'invalid email' }) };
    }

    // Format timeline for readability
    const timelineLabels = {
      'immediately': 'Immediately',
      'within-1-month': 'Within 1 month',
      '1-3-months': '1-3 months',
      'exploring': 'Just exploring'
    };
    const timeline = timelineLabels[timelineRaw] || timelineRaw || 'Not specified';

    // Mirrors the live offering keys/names in content/data/offerings.json + "just-exploring".
    // Intentionally hardcoded (not require()'d from the JSON) to keep this GNG-1 money path
    // free of a file-load failure mode for what is only a cosmetic Slack/Airtable label.
    // Drift is guarded instead by a CI test (tests/functions/lead-capture.test.js) that fails
    // if these fall out of sync with offerings.json. Fallback behaviour: an unknown KEY shows
    // the raw slug; a key whose NAME changed in the JSON (but not here) would show the stale
    // name until the test catches it — which is why the test, not runtime coupling, is the guard.
    const interestLabels = {
      'company-enablement': 'Company Enablement',
      'leadership-activation': 'Leadership Team AI Activation',
      'senior-leader-acceleration': '1:1 Exec AI Fast Track Coaching',
      'leadership-cohort': 'Open Cohort AI Bootcamp for Business Leaders',
      'just-exploring': 'Just exploring'
    };
    const interestList = interestRawList.map((key) => interestLabels[key] || key);
    const interest = interestList.join(', ') || 'Not specified';

    // Airtable single/multi-selects reject any value not already a choice (422
    // UNKNOWN_FIELD_NAME's sibling, INVALID_MULTIPLE_CHOICE_OPTIONS). An unrecognised
    // form value must therefore degrade to "not written" rather than fail the whole
    // record — the lead matters more than the label. Notes keeps the raw value either
    // way, so nothing is lost.
    const TIMELINE_CHOICES = new Set(Object.values(timelineLabels).concat('Not specified'));
    const INTEREST_CHOICES = new Set(Object.values(interestLabels).concat('Not specified'));
    const timelineForAirtable = TIMELINE_CHOICES.has(timeline) ? timeline : null;
    const interestForAirtable = interestList.filter((v) => INTEREST_CHOICES.has(v));
    const unmappedSelects = [
      TIMELINE_CHOICES.has(timeline) ? '' : `Timeline (unmapped): ${timeline}`,
      interestList.length !== interestForAirtable.length
        ? `Service interest (unmapped): ${interestList.filter((v) => !INTEREST_CHOICES.has(v)).join(', ')}`
        : ''
    ].filter(Boolean);

    // Build Slack Block Kit message
    const slackMessage = {
      text: 'New Accelerator X Application',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎯 New Accelerator X Application',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Name:*\n${escapeSlack(name) || 'N/A'}` },
            { type: 'mrkdwn', text: `*Email:*\n${escapeSlack(email) || 'N/A'}` },
            { type: 'mrkdwn', text: `*Company:*\n${escapeSlack(company) || 'N/A'}` },
            { type: 'mrkdwn', text: `*Website:*\n${escapeSlack(website) || 'N/A'}` },
            { type: 'mrkdwn', text: `*Role:*\n${escapeSlack(role) || 'N/A'}` },
            { type: 'mrkdwn', text: `*Timeline:*\n${escapeSlack(timeline)}` }
          ]
        }
      ]
    };

    if (interestRaw || source) {
      slackMessage.blocks.push({
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Service interest:*\n${escapeSlack(interest)}` },
          { type: 'mrkdwn', text: `*Source:*\n${escapeSlack(source) || 'Website'}` }
        ]
      });
    }

    // Add problem block if present
    if (problem) {
      slackMessage.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Trying to solve:*\n>${escapeSlack(problem).replace(/\n/g, '\n>')}`
        }
      });
    }
    
    // Add timestamp and divider
    const timestamp = new Date().toISOString();
    slackMessage.blocks.push(
      { type: 'divider' },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🕐 ${timestamp} | Submitted via accelerator-x.ai`
          }
        ]
      }
    );
    
    // Send to Slack first (preserve existing behaviour)
    if (!SLACK_WEBHOOK_URL) {
      console.warn('SLACK_WEBHOOK_URL not set — skipping Slack notification');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Skipped — Slack webhook not configured', airtable: 'skipped' })
      };
    }
    
    const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage)
    });
    
    if (!slackResponse.ok) {
      throw new Error(`Slack webhook error: ${slackResponse.status}`);
    }

    // Attempt Airtable insert; do not fail the whole request if Airtable is down
    let airtableStatus = 'skipped';
    let contactStatus = 'skipped';
    if (AIRTABLE_API_URL && AIRTABLE_TOKEN) {
      const airtablePayload = {
        fields: {
          'Primary Contact Name': name,
          Email: email,
          Company: company,
          Website: website,
          'Primary Contact Role': role,
          ...(timelineForAirtable ? { Timeline: timelineForAirtable } : {}),
          ...(interestForAirtable.length ? { 'Service Interest': interestForAirtable } : {}),
          Notes: [
            source ? `Source detail: ${source}` : '',
            problem ? `Trying to solve: ${problem}` : '',
            ...unmappedSelects,
            consentTimestampRejected ? `Consent timestamp (rejected, server time used): ${consentTimestampRaw}` : ''
          ].filter(Boolean).join('\n\n'),
          Source: 'Accelerator X Website',
          'Consent Given': consentGiven,
          'Consent Timestamp': consentTimestamp
        }
      };

      try {
        const postToAirtable = (payload) => fetch(AIRTABLE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AIRTABLE_TOKEN}`
          },
          body: JSON.stringify(payload)
        });

        let airtableResponse = await postToAirtable(airtablePayload);

        if (!airtableResponse.ok) {
          const text = await airtableResponse.text();
          // The mapped-choices guard above only covers values THIS function doesn't
          // know. The likelier drift runs the other way (#106): a value the function
          // knows but Airtable doesn't — a new offering whose Service Interest choice
          // hasn't been added yet passes the guard and 422s the whole record. The PAT
          // deliberately lacks typecast/schema rights, so recover reactively instead:
          // strip the rejected select field(s) into Notes and retry once — select
          // drift in either direction costs a label, never the lead.
          if (airtableResponse.status === 422 && /INVALID_MULTIPLE_CHOICE_OPTIONS|select option/i.test(text)) {
            const sentSelects = ['Timeline', 'Service Interest', 'Source'].filter((f) => f in airtablePayload.fields);
            const named = sentSelects.filter((f) =>
              [].concat(airtablePayload.fields[f]).some((v) => text.includes(v)));
            const retryFields = { ...airtablePayload.fields };
            // If the 422 body names none of the values we sent, strip every select —
            // over-stripping into Notes is recoverable; a second 422 is not.
            const rejectedNotes = (named.length ? named : sentSelects).map((f) => {
              const value = [].concat(retryFields[f]).join(', ');
              delete retryFields[f];
              return `${f} (Airtable rejected the choice, kept here): ${value}`;
            });
            retryFields.Notes = [retryFields.Notes, ...rejectedNotes].filter(Boolean).join('\n\n');
            console.warn('Airtable rejected a select choice — retrying without:', rejectedNotes.join(' | '));
            airtableResponse = await postToAirtable({ fields: retryFields });
            if (!airtableResponse.ok) {
              const retryText = await airtableResponse.text();
              throw new Error(`Airtable error after select retry: ${airtableResponse.status} ${retryText} (first attempt: 422 ${text})`);
            }
          } else {
            throw new Error(`Airtable error: ${airtableResponse.status} ${text}`);
          }
        }
        airtableStatus = 'created';

        // Contact is best-effort: its failure must not undo the Account or the Slack post.
        // Logged to function logs and raised in Slack (distinct message) so it is seen.
        try {
          let accountId;
          try { accountId = JSON.parse((await airtableResponse.text()) || '{}').id; } catch (_) { accountId = undefined; }
          contactStatus = await upsertContact({ name, email, role, accountId, source });
        } catch (contactError) {
          contactStatus = 'failed';
          console.error('Airtable Contact write error:', contactError.message);
          try {
            await fetch(SLACK_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `⚠️ CONTACT WRITE FAILED — Account created for ${escapeSlack(email) || 'unknown'} but no linked Contact. Add one by hand. Error: ${escapeSlack(contactError.message)}`
              })
            });
          } catch (alertError) {
            console.error('Contact failure alert Slack post error:', alertError.message);
          }
        }
      } catch (airtableError) {
        airtableStatus = 'failed';
        console.error('Airtable insert error:', airtableError.message);

        // GNG-1 is the go/no-go consent-capture gate — a silent Airtable failure here
        // means we accepted a lead without a defensible consent record. Alert loudly
        // (distinct message) rather than let the fails-soft 200 mask it.
        try {
          await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `⚠️ CONSENT WRITE FAILED — lead from ${escapeSlack(email) || 'unknown'} saved to Slack only. Airtable insert errored: ${escapeSlack(airtableError.message)}. GNG-1 path degraded — check Airtable manually.`
            })
          });
        } catch (alertError) {
          console.error('GNG-1 failure alert Slack post error:', alertError.message);
        }
      }
    } else {
      console.warn('Airtable env vars missing; skipping Airtable insert');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Notification sent to Slack', airtable: airtableStatus, contact: contactStatus })
    };

  } catch (error) {
    console.error('lead-capture error:', error.message);
    // Internal detail (raw Slack/Airtable error strings) stays in the function logs —
    // this is an unauthenticated endpoint, so the caller gets only a generic message
    // (matching newsletter-subscribe.js).
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
