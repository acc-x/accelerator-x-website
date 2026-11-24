// Netlify Function (v2): lead-capture, the public rate-limited entry point (#123).
// Logic lives in netlify/lib/lead-capture.js; this file only adapts it to the v2 signature
// and declares the route and rate limit. See netlify/lib/v2-adapter.mjs for why.
import mod from '../lib/lead-capture.js';
import { adaptHandler } from '../lib/v2-adapter.mjs';

export default adaptHandler(mod.handler);

// Literal on purpose: Netlify reads `config` statically, so no imported constants here.
// Limit: 10 submissions per IP per 3 minutes (180s is Netlify's maximum window). A visitor
// submits once and a few retries after an error fit easily; a shared office or workshop
// room can still get several people through. Netlify counts asynchronously, so a burst can
// overshoot by a few requests for up to ~10s before blocking starts. The same numbers are
// asserted in tests/functions/rate-limit.test.js, so change both together.
export const config = {
  path: '/api/lead-capture',
  rateLimit: {
    windowLimit: 10,
    windowSize: 180,
    aggregateBy: ['ip', 'domain'],
  },
};
