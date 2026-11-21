(() => {
  // ============================================================
  // FORM HANDLERS — accelerator-x.ai
  // ============================================================
  // All form submissions on the site go through this file.
  // No inline scripts. No exceptions.
  //
  // Lead capture  (#lead-form)         → POST /.netlify/functions/lead-capture
  //                                    → Airtable + Slack #website-leads
  //
  // Newsletter    (#newsletter-form)   → POST /.netlify/functions/newsletter-subscribe
  //                                    → Brevo list #9 + Slack #website-leads
  //
  // Both handlers are independent — either can exist on a page without the other.
  // ============================================================

  const isSubmitting = new WeakMap();

  // Analytics — fire-and-forget. PostHog is init-deferred (see analytics.js) and its
  // snippet queues capture() calls before init, so guarding on existence is enough.
  // Never pass PII (name/email/company) in properties — only non-identifying context.
  const track = (event, props = {}) => {
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(event, props);
      }
    } catch (_) { /* analytics must never break a form */ }
  };

  const setSubmitState = (btn, { disabled, label }) => {
    if (!btn) return;
    btn.disabled = disabled;
    btn.classList.toggle('opacity-70', disabled);
    if (label) btn.textContent = label;
  };

  const showError = (el, message) => {
    if (!el) return;
    if (message) el.textContent = message;
    el.classList.remove('hidden');
  };

  const clearError = (el) => {
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
  };

  // ── Lead capture ─────────────────────────────────────────────────────────

  const leadForms = Array.from(document.querySelectorAll('[data-lead-form], #lead-form'));

  leadForms.forEach((leadForm) => {
    const leadSuccess = document.getElementById(leadForm.dataset.successId || 'form-success');
    const leadError = document.getElementById(leadForm.dataset.errorId || 'form-error');
    const leadSource = leadForm.dataset.source || 'apply_form';

    // Funnel step: apply_form_start — fires once when the user first engages the form.
    let started = false;
    leadForm.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      track('apply_form_start', { location: leadSource });
    }, { once: false });

    const showLeadSuccess = () => {
      leadForm.classList.add('hidden');
      if (!leadSuccess) return;
      leadSuccess.classList.remove('hidden');
      leadSuccess.classList.add('is-visible');
      const icon = leadSuccess.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.animate(
          [
            { transform: 'scale(0.9)', opacity: 0.2 },
            { transform: 'scale(1.05)', opacity: 1 },
            { transform: 'scale(1)', opacity: 1 },
          ],
          { duration: 300, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }
        );
      }
    };

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isSubmitting.get(leadForm)) return;

      // Form carries `novalidate` (suppresses the browser's implicit validate-on-submit)
      // so custom JS controls exactly when validation runs: without this call every
      // `required` attribute in the markup would be decorative.
      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
      }

      isSubmitting.set(leadForm, true);
      clearError(leadError);

      const btn          = leadForm.querySelector('button[type="submit"]');
      const originalLabel = btn ? btn.textContent : '';
      setSubmitState(btn, { disabled: true, label: 'Sending…' });

      const formData = new FormData(leadForm);
      const payload = {
        'form-name': formData.get('form-name') || 'lead-capture-form',
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        // website, role, timeline and interest are no longer on the form (#222); they post
        // as empty strings so the payload shape stays stable for lead-capture.js.
        website: formData.get('website') || '',
        role: formData.get('role') || '',
        timeline: formData.get('timeline') || '',
        problem: formData.get('problem') || '',
        interest: formData.get('interest') || leadForm.dataset.interest || '',
        source: formData.get('source') || leadForm.dataset.source || '',
        _honeypot: formData.get('_honeypot') || '',
        consent_given: formData.get('consent_given') === 'true',
        consent_timestamp: new Date().toISOString()
      };

      fetch('/.netlify/functions/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          // Conversion event: where the form lives, nothing the visitor typed.
          track('apply_form_submit', { location: leadSource });
          showLeadSuccess();
        })
        .catch((err) => {
          console.error('Lead form error:', err);
          // info@ is the consolidated public contact route (B5, 2026-07-13) — hello@ exists
          // but is unmonitored as a published channel. The {{site:INFO_EMAIL}} token can't
          // reach here: token resolution runs on templates only, not assets/js.
          showError(leadError, 'Something went wrong sending your message. Please try again, or email us at info@accelerator-x.ai');
          setSubmitState(btn, { disabled: false, label: originalLabel });
        })
        .finally(() => {
          isSubmitting.set(leadForm, false);
        });
    });
  });

  // ── Newsletter signup ─────────────────────────────────────────────────────
  // One handler for every NewsletterSignup instance (the footer band on all pages,
  // plus an in-page band on content pages). Binds by class and resolves status nodes
  // relative to each form, so a page can carry more than one with no duplicate IDs.
  // The component uses the native `hidden` attribute for form/status visibility.

  const setHidden = (el, hidden) => {
    if (!el) return;
    if (hidden) el.setAttribute('hidden', '');
    else el.removeAttribute('hidden');
  };

  const newsletterForms = Array.from(document.querySelectorAll('form.js-newsletter-form'));

  newsletterForms.forEach((form) => {
    const scope   = form.closest('.ax-newsletter') || form.parentElement;
    const success = scope ? scope.querySelector('.ax-newsletter__status--success') : null;
    const error   = scope ? scope.querySelector('.ax-newsletter__status--error') : null;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isSubmitting.get(form)) return;

      // Every NewsletterSignup instance carries `novalidate` (same rationale as the
      // lead form above), so `required` + type="email" never ran on their own — an
      // empty or malformed email dead-ended the submit silently: no bubble, no status
      // node, nothing. Same fix as the lead form: run the native constraint check
      // explicitly before doing anything else.
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const emailInput    = form.querySelector('input[type="email"]');
      const email         = emailInput ? emailInput.value.trim() : '';
      const btn           = form.querySelector('button[type="submit"]');
      const originalLabel = btn ? btn.textContent : '';

      isSubmitting.set(form, true);
      setHidden(error, true);
      setSubmitState(btn, { disabled: true, label: 'Subscribing…' });

      fetch('/.netlify/functions/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: form.dataset.newsletterSource || 'newsletter_form' }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            track('newsletter_subscribe', { location: form.dataset.newsletterSource || 'newsletter_form' });
            setHidden(form, true);
            setHidden(success, false);
          } else {
            throw new Error(data.error || 'Unknown error');
          }
        })
        .catch((err) => {
          console.error('Newsletter form error:', err);
          setSubmitState(btn, { disabled: false, label: originalLabel });
          setHidden(error, false);
        })
        .finally(() => {
          isSubmitting.set(form, false);
        });
    });
  });
})();
