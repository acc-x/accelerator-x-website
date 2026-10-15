// Netlify Function: cohort-application
// Triggered by: same-origin JSON POST from the cohort apply form (assets/js/cohort-apply.js),
//   or, when JS is off or failed to load, the same form's native urlencoded POST
// Handles: open-cohort applications → Airtable Coaching Enrollments (consent-stamped,
//   linked to the open cohort's Coaching Programmes record) + Slack #cohort-applications
// NOT responsible for: company leads (lead-capture.js → Accounts) or newsletter signups.
// Kept separate from lead-capture.js on purpose (#172): a cohort applicant is a person
// joining a programme, not a company prospect, so it writes to a different table, and a
// change to either path can't break the other.
// Env vars: AIRTABLE_TOKEN, AIRTABLE_BASE_ID (shared with lead-capture),
//   SLACK_COHORT_WEBHOOK_URL (falls back to SLACK_WEBHOOK_URL / #website-leads),
//   COHORT_PROGRAMME_RECORD_ID (the open cohort; empty = waitlist mode, no programme link)

// Coaching Enrollments in the CRM & Delivery base. A stable, non-secret id, so it lives in
// code where a change is reviewed; the per-cohort switch is the env var above.
const ENROLLMENTS_TABLE_ID = 'tblFNkbk58DhsRZed';
// Coaching Programmes, read only to name a returning participant's earlier cohort.
const PROGRAMMES_TABLE_ID = 'tblTuSr8AJUu9HlHx';

// Core question C4 (adoption pattern), verbatim. Canonical source:
// ax-agent-hub/plugins/ax-delivery/skills/ax-survey-builder/references/core-questions.md
// These strings must match the Airtable "Application AI Use" options character for
// character (#173): the scale is shared with the intake, pulse and end-of-phase surveys,
// so the wording is never edited here alone.
const AI_USE = {
  none: { label: "I don't use AI tools yet", short: 'Not yet' },
  experimenting: { label: "I experiment occasionally but don't have a consistent pattern", short: 'Experimenting' },
  regular: { label: 'I use AI regularly for specific tasks', short: 'Regular' },
  embedded: { label: 'AI is embedded in how I work day to day', short: 'Embedded' }
};

// Helpers below are deliberately duplicated from lead-capture.js rather than extracted to
// a shared module: extraction would mean editing the hardened company-lead path in the
// same change. If you change one, check its twin there.
const safeTrim = (val = '', maxLen = Infinity) => String(val ?? '').trim().slice(0, maxLen);
// Slack mrkdwn treats &, <, > as markup (https://api.slack.com/reference/surfaces/formatting#escaping)
const escapeSlack = (val = '') => String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

const SOURCE_KEYS = ['page', 'utm_source', 'utm_medium', 'utm_campaign', 'referrer'];

// Where a native (no-JS) form post lands afterwards. The cohort page reveals the matching
// notice with CSS :target, so the outcome is visible without any script.
const NO_JS_RETURN = '/what-we-do/leadership-cohort/';
const NO_JS_SUCCESS = `${NO_JS_RETURN}#cohort-applied`;
const NO_JS_FAILED = `${NO_JS_RETURN}#cohort-apply-failed`;
const NO_JS_DUPLICATE = `${NO_JS_RETURN}#cohort-apply-duplicate`;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

const postJson = (url, payload, extraHeaders = {}) => fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...extraHeaders },
  body: JSON.stringify(payload)
});

// Flattens page + UTM tags into one readable line for the Application Source field, e.g.
// "Website cohort form · page=/what-we-do/leadership-cohort/ · utm_source=linkedin".
// Non-empty is also how a website applicant is told apart from a hand-added row.
function describeSource(source) {
  const parts = ['Website cohort form'];
  if (source && typeof source === 'object') {
    for (const key of SOURCE_KEYS) {
      const value = safeTrim(source[key], 200);
      if (value) parts.push(`${key}=${value}`);
    }
  }
  return parts.join(' · ');
}

const redirect = (location) => ({ statusCode: 303, headers: { Location: location }, body: '' });

// A no-JS submit arrives urlencoded with every value as a string and no client timestamp
// or UTM capture, so normalise it into the JSON shape: consent "true" becomes a boolean,
// consent time is left empty (server time is then used, which is accurate for a post that
// just arrived), and page + UTM tags come from the Referer the browser sent.
function fromFormPost(body, headers) {
  const params = new URLSearchParams(body);
  const data = {};
  for (const key of ['name', 'email', 'company', 'role', 'ai_use', 'confidence', '_honeypot']) {
    data[key] = params.get(key) || '';
  }
  data.consent_given = params.get('consent_given') === 'true';
  const referer = headers.referer || headers.Referer || '';
  try {
    const ref = new URL(referer);
    data.source = {
      page: ref.pathname,
      utm_source: ref.searchParams.get('utm_source') || '',
      utm_medium: ref.searchParams.get('utm_medium') || '',
      utm_campaign: ref.searchParams.get('utm_campaign') || ''
    };
  } catch (_) {
    data.source = { page: 'no-js form post' };
  }
  return data;
}

// Looks up earlier Coaching Enrollments rows for this email (#183), so a repeat application
// for the open cohort doesn't create a duplicate row and a returning participant is flagged.
// Fails open: any lookup problem returns "nothing found" and the application goes through as
// new, because a lookup must never cost us an applicant.
async function findPriorEnrolments({ baseId, token, email, programmeId }) {
  const none = { sameCohort: null, earlier: null };
  try {
    const auth = { headers: { Authorization: `Bearer ${token}` } };
    // Airtable formula string literal: escape backslashes and double quotes. The email has
    // already passed EMAIL_PATTERN, but that still allows quote characters.
    const literal = email.toLowerCase().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const params = new URLSearchParams({ filterByFormula: `LOWER({Email}) = "${literal}"`, maxRecords: '20' });
    for (const f of ['Programme', 'Enrollment Status']) params.append('fields[]', f);
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${ENROLLMENTS_TABLE_ID}?${params}`, auth);
    if (!res.ok) throw new Error(`lookup ${res.status}`);
    const records = ((await res.json()) || {}).records || [];

    const programmesOf = (r) => (r.fields && Array.isArray(r.fields.Programme) ? r.fields.Programme : []);
    // In waitlist mode the "same cohort" is the unlinked waitlist itself.
    const sameCohort = records.find((r) => (programmeId
      ? programmesOf(r).includes(programmeId)
      : programmesOf(r).length === 0)) || null;
    if (sameCohort) return { sameCohort, earlier: null };

    const earlierRow = records.find((r) => programmesOf(r).length > 0);
    if (!earlierRow) return none;
    const status = (earlierRow.fields && earlierRow.fields['Enrollment Status']) || 'status unknown';
    let cohort = 'an earlier programme';
    try {
      const pr = await fetch(`https://api.airtable.com/v0/${baseId}/${PROGRAMMES_TABLE_ID}/${programmesOf(earlierRow)[0]}`, auth);
      if (pr.ok) cohort = (((await pr.json()) || {}).fields || {})['Cohort name'] || cohort;
    } catch (_) { /* the name is a nicety; the flag still stands without it */ }
    return { sameCohort: null, earlier: { cohort: safeTrim(cohort, 200), status: safeTrim(status, 60) } };
  } catch (err) {
    console.warn('cohort-application: prior-enrolment lookup failed, treating as new:', err.message);
    return none;
  }
}

function validate(data) {
  const fields = {
    name: safeTrim(data.name, 200),
    email: safeTrim(data.email, 320),
    company: safeTrim(data.company, 200),
    role: safeTrim(data.role, 200),
    aiUse: safeTrim(data.ai_use, 40),
    confidence: Number(data.confidence)
  };
  const invalid = [];
  if (!fields.name) invalid.push('name');
  if (!EMAIL_PATTERN.test(fields.email)) invalid.push('email');
  if (!fields.company) invalid.push('company');
  if (!fields.role) invalid.push('role');
  if (!Object.prototype.hasOwnProperty.call(AI_USE, fields.aiUse)) invalid.push('ai_use');
  if (!Number.isInteger(fields.confidence) || fields.confidence < 1 || fields.confidence > 10) invalid.push('confidence');
  if (data.consent_given !== true) invalid.push('consent_given');
  return { fields, invalid };
}

exports.handler = async (event) => {
  // No CORS headers by design: the form posts same-origin (same stance as lead-capture.js).
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  if (event.body && event.body.length > 10_000) return json(413, { error: 'Payload too large' });

  const headers = event.headers || {};
  const contentType = String(headers['content-type'] || headers['Content-Type'] || '');
  const isFormPost = contentType.includes('application/x-www-form-urlencoded');
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body;

  let data;
  if (isFormPost) {
    data = fromFormPost(rawBody || '', headers);
  } else {
    try {
      data = JSON.parse(rawBody);
    } catch (_) {
      return json(400, { error: 'Invalid JSON' });
    }
    if (!data || typeof data !== 'object') return json(400, { error: 'Invalid JSON' });
  }

  // A bot gets the same answer a person would, so the honeypot isn't advertised.
  if (data._honeypot) return isFormPost ? redirect(NO_JS_SUCCESS) : json(200, { skipped: 'spam' });

  // Unlike lead-capture.js, a validation failure is a 400, not a silent 200: the form must
  // show an error rather than a false "application received". Client-side validation means
  // a real applicant should never see this.
  const { fields, invalid } = validate(data);
  if (invalid.length) return isFormPost ? redirect(NO_JS_FAILED) : json(400, { error: 'invalid', fields: invalid });

  // Same hostile-input posture as lead-capture.js (#106): an unparseable timestamp would
  // 422 the whole record on the dateTime field, so fall back to server time and keep the
  // rejected raw value in Notes.
  const consentTimestampRaw = safeTrim(data.consent_timestamp, 64);
  const consentTimestampRejected = Boolean(consentTimestampRaw)
    && !(ISO_TIMESTAMP.test(consentTimestampRaw) && !Number.isNaN(Date.parse(consentTimestampRaw)));
  const consentTimestamp = consentTimestampRaw && !consentTimestampRejected
    ? consentTimestampRaw
    : new Date().toISOString();

  const aiUse = AI_USE[fields.aiUse];
  const applicationSource = describeSource(data.source);
  const programmeId = safeTrim(process.env.COHORT_PROGRAMME_RECORD_ID, 40);
  const baseId = process.env.AIRTABLE_BASE_ID;
  const token = process.env.AIRTABLE_TOKEN;
  const slackUrl = process.env.SLACK_COHORT_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

  const postSlack = async (text, blocks) => {
    if (!slackUrl) {
      console.warn('cohort-application: no Slack webhook configured');
      return false;
    }
    try {
      const res = await postJson(slackUrl, { text, blocks });
      if (!res.ok) throw new Error(`Slack webhook error: ${res.status}`);
      return true;
    } catch (err) {
      console.error('cohort-application Slack error:', err.message);
      return false;
    }
  };
  const applicantFields = (extra = []) => ({
    type: 'section',
    fields: [
      { type: 'mrkdwn', text: `*Name:*\n${escapeSlack(fields.name)}` },
      { type: 'mrkdwn', text: `*Role:*\n${escapeSlack(fields.role)} at ${escapeSlack(fields.company)}` },
      { type: 'mrkdwn', text: `*Email:*\n${escapeSlack(fields.email)}` },
      { type: 'mrkdwn', text: `*AI use:*\n${aiUse.short}` },
      { type: 'mrkdwn', text: `*Confidence:*\n${fields.confidence}/10` },
      { type: 'mrkdwn', text: `*Source:*\n${escapeSlack(applicationSource)}` },
      ...extra
    ]
  });
  const recordLink = (id) => `<https://airtable.com/${baseId}/${ENROLLMENTS_TABLE_ID}/${id}|Open in Airtable>`;

  // ── 0. Already applied? (#183) ──
  const prior = baseId && token
    ? await findPriorEnrolments({ baseId, token, email: fields.email, programmeId })
    : { sameCohort: null, earlier: null };

  if (prior.sameCohort) {
    // No second row: the existing one stays the record. The ping still goes out, because a
    // repeat usually means someone keen or chasing, and it links to the row they already have.
    const header = '🔁 Repeat application (already in Airtable)';
    await postSlack(header, [
      { type: 'header', text: { type: 'plain_text', text: header, emoji: true } },
      applicantFields(),
      { type: 'section', text: { type: 'mrkdwn', text: `No new row created. Existing record: ${recordLink(prior.sameCohort.id)}` } }
    ]);
    if (isFormPost) return redirect(NO_JS_DUPLICATE);
    return json(200, { success: true, duplicate: true });
  }

  const returningNote = prior.earlier
    ? `Returning participant: previously ${prior.earlier.cohort} (${prior.earlier.status})`
    : '';

  // ── 1. Airtable first, so the Slack ping can link straight to the record ──
  let recordId = null;
  let airtableError = null;
  if (baseId && token) {
    const notes = [
      returningNote,
      consentTimestampRejected ? `Consent timestamp (rejected, server time used): ${consentTimestampRaw}` : ''
    ].filter(Boolean).join('\n\n');
    const recordFields = {
      'Participant Name': fields.name,
      Email: fields.email,
      Company: fields.company,
      Role: fields.role,
      ...(programmeId ? { Programme: [programmeId] } : {}),
      'Enrollment Status': 'Interested',
      'Application AI Use': aiUse.label,
      'Application Confidence': fields.confidence,
      'Application Source': applicationSource,
      'Consent Given': true,
      'Consent Timestamp': consentTimestamp,
      ...(notes ? { Notes: notes } : {})
    };
    const url = `https://api.airtable.com/v0/${baseId}/${ENROLLMENTS_TABLE_ID}`;
    const auth = { Authorization: `Bearer ${token}` };
    try {
      let res = await postJson(url, { fields: recordFields }, auth);
      if (!res.ok) {
        const text = await res.text();
        // Select drift costs a label, never the applicant (same recovery as lead-capture.js,
        // #106): the PAT has no schema rights, so strip the rejected select(s) into Notes
        // and retry exactly once.
        if (res.status === 422 && /INVALID_MULTIPLE_CHOICE_OPTIONS|select option/i.test(text)) {
          const selects = ['Enrollment Status', 'Application AI Use'];
          const named = selects.filter((f) => text.includes(recordFields[f]));
          const retryFields = { ...recordFields };
          const stripped = (named.length ? named : selects).map((f) => {
            const value = retryFields[f];
            delete retryFields[f];
            return `${f} (Airtable rejected the choice, kept here): ${value}`;
          });
          retryFields.Notes = [retryFields.Notes, ...stripped].filter(Boolean).join('\n\n');
          console.warn('Airtable rejected a select choice, retrying without:', stripped.join(' | '));
          res = await postJson(url, { fields: retryFields }, auth);
          if (!res.ok) {
            const retryText = await res.text();
            throw new Error(`Airtable error after select retry: ${res.status} ${retryText} (first attempt: 422 ${text})`);
          }
        } else {
          throw new Error(`Airtable error: ${res.status} ${text}`);
        }
      }
      const created = await res.json();
      recordId = created && created.id ? created.id : null;
    } catch (err) {
      airtableError = err.message;
      console.error('cohort-application Airtable insert error:', err.message);
    }
  } else {
    airtableError = 'Airtable env vars missing';
    console.warn('cohort-application: Airtable env vars missing; record not written');
  }

  // ── 2. Slack ──
  const saved = Boolean(recordId);
  const baseHeader = !saved
    ? '⚠️ Cohort application NOT saved to Airtable'
    : programmeId ? '🎓 New cohort application' : '🎓 New cohort waitlist sign-up';
  const header = prior.earlier ? `${baseHeader} · returning participant` : baseHeader;
  const blocks = [
    { type: 'header', text: { type: 'plain_text', text: header, emoji: true } },
    applicantFields(prior.earlier
      ? [{ type: 'mrkdwn', text: `*Previously:*\n${escapeSlack(prior.earlier.cohort)} (${escapeSlack(prior.earlier.status)})` }]
      : [])
  ];
  if (saved) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: recordLink(recordId) } });
  } else {
    // Every submitted field is already in the blocks above, so a human can add the record
    // by hand; the error says why it needs to. Truncated because Slack rejects a section over
    // 3,000 characters, and an outage can return a multi-KB HTML error page: an oversized
    // block would lose the applicant on exactly the path where Slack is the only record.
    const reason = escapeSlack(String(airtableError || 'unknown error').slice(0, 1500)).replace(/\n/g, '\n>');
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Add this applicant to Coaching Enrollments by hand.* Airtable said:\n>${reason}` }
    });
  }
  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: `🕐 ${new Date().toISOString()} · Reply within 1 business day` }]
  });

  const slackOk = await postSlack(header, blocks);

  // Only a total loss is an error to the applicant. Raw error detail stays in the logs.
  if (!saved && !slackOk) return isFormPost ? redirect(NO_JS_FAILED) : json(500, { error: 'Server error' });
  if (isFormPost) return redirect(NO_JS_SUCCESS);
  return json(200, { success: true, airtable: saved ? 'created' : 'failed', slack: slackOk ? 'sent' : 'failed' });
};
