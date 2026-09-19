// ============================================================
// Global Cloudflare Pages Middleware
// Ensures responses never leak overly permissive CORS headers
// (such as wildcard Access-Control-Allow-Origin: *)
// ============================================================

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Subdomain routing: deutsch.abdugofforov.uz -> serve deutsch.html
  if (url.hostname.startsWith('deutsch.') || url.searchParams.get('subdomain') === 'deutsch') {
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return context.env.ASSETS.fetch(new URL('/deutsch.html', context.request.url));
    }
  }

  // Redirect abdugofforov.uz/deutsch to subdomain if accessed directly on production
  if (url.pathname === '/deutsch' || url.pathname === '/deutsch/') {
    if (!url.hostname.startsWith('deutsch.')) {
      if (url.hostname.includes('abdugofforov.uz')) {
        return Response.redirect(`https://deutsch.abdugofforov.uz/`, 301);
      }
      return context.env.ASSETS.fetch(new URL('/deutsch.html', context.request.url));
    }
  }

  const response = await context.next();
  
  // Clone response to modify headers (Response object headers are immutable)
  const newResponse = new Response(response.body, response);
  
  // 1. Strip overly permissive wildcard CORS if present
  const acao = newResponse.headers.get('Access-Control-Allow-Origin');
  if (acao === '*') {
    const origin = context.request.headers.get('Origin') || '';
    let allowed = [];
    try { allowed.push(new URL(context.request.url).origin); } catch (e) {}
    try {
      if (url.hostname.endsWith('abdugofforov.uz')) {
        allowed.push('https://abdugofforov.uz', 'https://deutsch.abdugofforov.uz');
      }
    } catch (e) {}
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

  // 2. Global Security Headers (Himoya sarlavhalari — barcha endpointlar uchun)
  if (!newResponse.headers.has('X-Content-Type-Options')) {
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  }
  if (!newResponse.headers.has('X-Frame-Options')) {
    newResponse.headers.set('X-Frame-Options', 'DENY');
  }
  if (!newResponse.headers.has('Referrer-Policy')) {
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  if (!newResponse.headers.has('Permissions-Policy')) {
    newResponse.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), payment=(), usb=()');
  }
  if (!newResponse.headers.has('Cross-Origin-Opener-Policy')) {
    newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  }
  if (!newResponse.headers.has('Cross-Origin-Resource-Policy')) {
    newResponse.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  }
  if (!newResponse.headers.has('X-Permitted-Cross-Domain-Policies')) {
    newResponse.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  }
  if (url.protocol === 'https:' && !newResponse.headers.has('Strict-Transport-Security')) {
    newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  return newResponse;
}
