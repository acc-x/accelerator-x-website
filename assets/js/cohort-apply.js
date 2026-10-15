(() => {
  // ============================================================
  // COHORT APPLICATION: accelerator-x.ai (#172/#176)
  // ============================================================
  // The form markup lives in _templates/components/CohortApplyForm.html.
  // Submits to /.netlify/functions/cohort-application → Coaching Enrollments + Slack.
  //
  // Progressive enhancement: every Apply trigger is a plain link to #cohort-apply, where
  // the form already sits inline, so it works without JS. With JS, a trigger opens a
  // native <dialog> and the one form card is moved into it (and back on close), so there
  // is never a second copy of the form with duplicate ids.
  // ============================================================

  const home = document.querySelector('[data-cohort-apply-home]');
  const card = document.querySelector('[data-cohort-apply-card]');
  const form = document.querySelector('[data-cohort-apply-form]');
  if (!home || !card || !form) return;

  const dialog = document.querySelector('[data-cohort-apply-dialog]');
  const slot = dialog ? dialog.querySelector('[data-cohort-apply-slot]') : null;
  const success = card.querySelector('[data-cohort-apply-success]');
  const errorEl = card.querySelector('[data-cohort-apply-error]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.textContent.trim() : '';

  // Same contract as forms.js: fire-and-forget, never PII. ai_use and confidence are
  // fixed-choice self-ratings, so they are safe to send; name/email/company/role never are.
  const track = (event, props = {}) => {
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(event, props);
      }
    } catch (_) { /* analytics must never break a form */ }
  };

  // ── Dialog ────────────────────────────────────────────────────────────────

  const canDialog = Boolean(dialog && slot && typeof dialog.showModal === 'function');
  let lastTrigger = null;

  const openDialog = (trigger) => {
    lastTrigger = trigger;
    slot.appendChild(card);
    dialog.showModal();
    const first = card.querySelector('[data-cohort-apply-success]:not([hidden])') || form.querySelector('input:not([type="hidden"]):not([tabindex="-1"])');
    if (first) first.focus();
    track('cohort_apply_open', { location: trigger.dataset.cohortApplyOpen || 'unknown' });
  };

  if (canDialog) {
    document.querySelectorAll('[data-cohort-apply-open]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openDialog(trigger);
      });
    });

    dialog.querySelector('[data-cohort-apply-close]').addEventListener('click', () => dialog.close());

    // A click on the backdrop lands on the <dialog> element itself, not its content.
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });

    // Fires for Esc, the close button and backdrop clicks alike. Put the card back so the
    // inline copy at #cohort-apply shows the same state, and return focus (WCAG 2.4.3).
    dialog.addEventListener('close', () => {
      home.appendChild(card);
      if (lastTrigger) lastTrigger.focus();
    });
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const sourceFromPage = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      page: window.location.pathname,
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      referrer: document.referrer || ''
    };
  };

  const setBusy = (busy) => {
    if (!submitBtn) return;
    submitBtn.disabled = busy;
    submitBtn.textContent = busy ? 'Sending…' : submitLabel;
  };

  let submitting = false;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitting) return;

    // novalidate keeps the browser from validating on its own schedule; run it here.
    if (!form.checkValidity()) {
      form.reportValidity();
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    const payload = {
      name: (data.get('name') || '').trim(),
      email: (data.get('email') || '').trim(),
      company: (data.get('company') || '').trim(),
      role: (data.get('role') || '').trim(),
      ai_use: data.get('ai_use') || '',
      confidence: Number(data.get('confidence')),
      consent_given: data.get('consent_given') === 'true',
      consent_timestamp: new Date().toISOString(),
      source: sourceFromPage(),
      _honeypot: data.get('_honeypot') || ''
    };

    submitting = true;
    setBusy(true);
    if (errorEl) errorEl.hidden = true;

    fetch('/.netlify/functions/cohort-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok || !body || body.error) throw new Error((body && body.error) || 'request failed');
        track('cohort_apply_submit', { ai_use: payload.ai_use, confidence: payload.confidence });

        const firstName = payload.name.split(/\s+/)[0];
        const nameSlot = success.querySelector('[data-cohort-apply-first-name]');
        const emailSlot = success.querySelector('[data-cohort-apply-email]');
        // textContent, never innerHTML: these are the applicant's own words.
        if (nameSlot && firstName) nameSlot.textContent = `, ${firstName}`;
        if (emailSlot && payload.email) emailSlot.textContent = ` at ${payload.email}`;

        form.hidden = true;
        success.hidden = false;
        success.focus();
      })
      .catch((err) => {
        console.error('Cohort application error:', err);
        if (errorEl) errorEl.hidden = false;
        setBusy(false);
      })
      .finally(() => {
        submitting = false;
      });
  });
})();
