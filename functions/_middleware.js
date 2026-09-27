// ============================================================
// Global Cloudflare Pages Middleware
// Xavfsizlik protokollari: CORS, CSP, HSTS, va boshqa HTTP himoya sarlavhalari
// ============================================================

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Subdomain routing: deutsch.abdugofforov.uz -> serve deutsch.html
  const ADMIN_GATE_KEY = 'kay_admin_7904cc18';

  // Subdomain routing: deutsch.abdugofforov.uz -> serve deutsch.html (Barcha uchun ochiq)
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

  // ===== MAXFIY SUBDOMENLAR VA SAHIFALAR (CV & TOOLS) — FAQAT ADMIN UCHUN =====
  // Skanerlar va ruxsatsiz foydalanuvchilarga 404 Not Found qaytaradi (go'yo mavjud emasdek).
  const isCvReq = url.hostname.startsWith('cv.') || 
                  url.searchParams.get('subdomain') === 'cv' ||
                  url.pathname === '/cv' || url.pathname === '/cv/' || url.pathname === '/cv.html';

  const isToolsReq = url.hostname.startsWith('tools.') || 
                     url.searchParams.get('subdomain') === 'tools' ||
                     url.pathname === '/tools' || url.pathname === '/tools/' || url.pathname === '/tools.html';

  if (isCvReq || isToolsReq) {
    const cookieHeader = context.request.headers.get('Cookie') || '';
    const hasGateParam = url.searchParams.get('gate') === ADMIN_GATE_KEY;
    const hasGateCookie = cookieHeader.includes(`kay_admin_gate=${ADMIN_GATE_KEY}`);

    // Agar admin kaliti yoki cookie bo'lmasa -> 404 (Skanerlar va begonalardan 100% yashirish)
    if (!hasGateParam && !hasGateCookie) {
      return new Response('404 Not Found', {
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet'
        }
      });
    }

    // Faqat admin ruxsati bo'lsa -> sahifani ochamiz va cookie o'rnatamiz
    const targetFile = isCvReq ? '/cv.html' : '/tools.html';
    const assetResp = await context.env.ASSETS.fetch(new URL(targetFile, context.request.url));
    const securedResp = new Response(assetResp.body, assetResp);
    securedResp.headers.set('Set-Cookie', `kay_admin_gate=${ADMIN_GATE_KEY}; Path=/; Max-Age=86400; SameSite=Lax; HttpOnly; Secure`);
    securedResp.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    return securedResp;
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
        allowed.push(
          'https://abdugofforov.uz',
          'https://deutsch.abdugofforov.uz',
          'https://tools.abdugofforov.uz',
          'https://cv.abdugofforov.uz'
        );
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

  // 3. Content-Security-Policy (CSP) sarlavhasi
  if (!newResponse.headers.has('Content-Security-Policy')) {
    const cspDirectives = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "upgrade-insecure-requests",
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://challenges.cloudflare.com https://telegram.org",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "media-src 'self' data: blob:",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://challenges.cloudflare.com https://oauth.telegram.org",
      "connect-src 'self' https://abdugofforov.uz https://*.abdugofforov.uz https://ipapi.co https://api.open-meteo.com https://cloudflareinsights.com https://oauth.telegram.org"
    ];
    newResponse.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  }
  
  return newResponse;
}
