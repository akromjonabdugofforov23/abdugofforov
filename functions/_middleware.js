// ============================================================
// Global Cloudflare Pages Middleware
// Ensures responses never leak overly permissive CORS headers
// (such as wildcard Access-Control-Allow-Origin: *)
// ============================================================

export async function onRequest(context) {
  const response = await context.next();
  
  // Clone response to modify headers (Response object headers are immutable)
  const newResponse = new Response(response.body, response);
  
  // Strip overly permissive wildcard CORS if present
  const acao = newResponse.headers.get('Access-Control-Allow-Origin');
  if (acao === '*') {
    const origin = context.request.headers.get('Origin') || '';
    let allowed = [];
    try { allowed.push(new URL(context.request.url).origin); } catch (e) {}
    if (context.env && context.env.ALLOWED_ORIGINS) {
      for (const o of String(context.env.ALLOWED_ORIGINS).split(',')) {
        const t = o.trim();
        if (t) allowed.push(t);
      }
    }
    
    if (origin && allowed.includes(origin)) {
      newResponse.headers.set('Access-Control-Allow-Origin', origin);
      newResponse.headers.set('Vary', 'Origin');
    } else {
      newResponse.headers.delete('Access-Control-Allow-Origin');
    }
  }
  
  return newResponse;
}
