// Netlify Function: newsletter-subscribe
// Triggered by: direct JSON POST from all newsletter forms (homepage, insights hub, article CTAs)
// Bypasses Netlify Forms — no submission limits, no Netlify dashboard noise
// Actions: add contact to Brevo list #9 + notify Slack #website-leads
// Env vars required: SLACK_WEBHOOK_URL, BREVO_API_KEY
// Contract: returns { success: true } on success — forms.js depends on this shape

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const BREVO_LIST_ID = 9;

exports.handler = async (event) => {
  // CORS headers — allow requests from the live site and local dev
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Reject oversized payloads before parsing
  if (event.body && event.body.length > 10_000) {
    return { statusCode: 413, headers, body: JSON.stringify({ error: 'Payload too large' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (parseError) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  try {
    const email = String(body.email || '').trim().toLowerCase().slice(0, 320);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) };
    }

    // Honeypot — bots fill this, humans don't
    if (body._honey) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    const source = String(body.source || 'newsletter').trim().slice(0, 100);
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    // --- Brevo: add contact to list #9 ---
    // Tracked distinctly from the user-facing response: a dead/missing key must never
    // look identical to a real subscribe (2026-06-27 incident — a deactivated key
    // silently dropped signups for days because this branch returned success:true
    // with no alert).
    let brevoStatus = 'skipped';
    if (BREVO_API_KEY) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            listIds: [BREVO_LIST_ID],
            updateEnabled: true  // updates existing contact rather than erroring
          })
        });

        if (brevoRes.ok || brevoRes.status === 204) {
          // 204 = contact already exists in Brevo — not an error
          brevoStatus = 'created';
        } else {
          const text = await brevoRes.text();
          console.error('Brevo error:', brevoRes.status, text);
          brevoStatus = 'failed';
        }
      } catch (err) {
        // Log but don't fail — Slack notification still fires
        console.error('Brevo fetch error:', err.message);
        brevoStatus = 'failed';
      }
    } else {
      console.warn('BREVO_API_KEY not set — skipping Brevo insert');
    }

    // --- Slack: notify #website-leads ---
    if (!SLACK_WEBHOOK_URL) {
      console.warn('SLACK_WEBHOOK_URL not set — skipping Slack notification');
    } else {
      try {
        await fetch(SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocks: [
              {
                type: 'rich_text',
                elements: [
                  {
                    type: 'rich_text_section',
                    elements: [
                      { type: 'emoji', name: 'chipmunk' },
                      { type: 'text', text: ' New newsletter signup just scurried in\n' },
                      { type: 'text', text: 'Email: ' },
                      { type: 'link', url: `mailto:${email}`, text: email },
                      { type: 'text', text: `\nSource: ${source}\nTime: ${new Date().toISOString()}` }
                    ]
                  }
                ]
              }
            ]
          })
        });
      } catch (err) {
        console.error('Slack notify error:', err.message);
      }

      // Distinct alert on Brevo failure/skip — same fails-soft shape as the lead-capture
      // GNG-1 alert, so a dead key is noticed immediately instead of silently dropping
      // subscribers.
      if (brevoStatus === 'failed' || brevoStatus === 'skipped') {
        try {
          await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `⚠️ Brevo write ${brevoStatus.toUpperCase()} for ${email} — subscriber NOT in list #9, add manually.`
            })
          });
        } catch (alertErr) {
          console.error('Brevo failure alert Slack post error:', alertErr.message);
        }
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, brevo: brevoStatus }) };

  } catch (err) {
    console.error('newsletter-subscribe error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
