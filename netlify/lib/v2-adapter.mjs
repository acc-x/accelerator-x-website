// Adapts a legacy (v1) Netlify handler, `async (event) => ({ statusCode, headers, body })`,
// to the v2 signature, `async (Request) => Response` (#123).
//
// Why this exists: Netlify's code-based rate limiting is only documented for v2 functions
// (a `rateLimit` block in the exported `config`, which also requires a `path`). The two
// public form handlers are the money path, so rather than rewrite them we leave their logic
// byte-for-byte as it was and wrap them here. Existing handler tests keep covering the logic;
// the wrapper tests cover this translation.
//
// Lives in netlify/lib/, not netlify/functions/, so Netlify does not deploy it as a function.

// Rate limits attach to the custom /api/* path. The default /.netlify/functions/<name> URL
// stays routable for every function, and Netlify's docs do not say whether a limit covers it,
// so we refuse to serve it: otherwise an abuser would just call that URL and skip the limit.
const ALLOWED_PREFIX = '/api/';

export function adaptHandler(handler) {
  return async (req) => {
    const url = new URL(req.url);
    if (!url.pathname.startsWith(ALLOWED_PREFIX)) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    const event = {
      httpMethod: req.method,
      headers: Object.fromEntries(req.headers),
      queryStringParameters: Object.fromEntries(url.searchParams),
      body: hasBody ? await req.text() : null,
      isBase64Encoded: false,
    };

    const res = await handler(event, {});
    // 204 and 304 must not carry a body; v1 handlers return '' for 204 (CORS preflight).
    const body = res.statusCode === 204 || res.statusCode === 304 ? null : (res.body ?? '');
    return new Response(body, { status: res.statusCode, headers: res.headers });
  };
}
