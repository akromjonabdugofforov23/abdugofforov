// ============================================================
// Global Cloudflare Pages Middleware
// Xavfsizlik protokollari: CORS, CSP, HSTS, va boshqa HTTP himoya sarlavhalari
// ============================================================

export async function onRequest(context) {
  const url = new URL(context.request.url);

  const ADMIN_GATE_KEY = 'kay_admin_7904cc18';
  const hasGateParam = url.searchParams.get('gate') === ADMIN_GATE_KEY;

  // 1. Subdomain routing: deutsch.abdugofforov.uz -> serve deutsch.html
  if (url.hostname.startsWith('deutsch.') || url.searchParams.get('subdomain') === 'deutsch') {
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const resp = await context.env.ASSETS.fetch(new URL('/deutsch.html', context.request.url));
      return applySecurityHeaders(resp, context, url);
    }
  }

  // Redirect abdugofforov.uz/deutsch to subdomain if accessed directly on production
  if (url.pathname === '/deutsch' || url.pathname === '/deutsch/') {
    if (!url.hostname.startsWith('deutsch.')) {
      if (url.hostname.includes('abdugofforov.uz')) {
        return Response.redirect(`https://deutsch.abdugofforov.uz/`, 301);
      }
      const resp = await context.env.ASSETS.fetch(new URL('/deutsch.html', context.request.url));
      return applySecurityHeaders(resp, context, url);
    }
  }

  // 2. Subdomain routing: tools.abdugofforov.uz -> serve tools.html (Ommaviy)
  if (url.hostname.startsWith('tools.') || url.searchParams.get('subdomain') === 'tools') {
    if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/tools' || url.pathname === '/tools.html') {
      const resp = await context.env.ASSETS.fetch(new URL('/tools.html', context.request.url));
      return applySecurityHeaders(resp, context, url);
    }
  }

  // Redirect abdugofforov.uz/tools to subdomain if accessed directly on production
  if (url.pathname === '/tools' || url.pathname === '/tools/') {
    if (!url.hostname.startsWith('tools.')) {
      if (url.hostname.includes('abdugofforov.uz')) {
        return Response.redirect(`https://tools.abdugofforov.uz/`, 301);
      }
      const resp = await context.env.ASSETS.fetch(new URL('/tools.html', context.request.url));
      return applySecurityHeaders(resp, context, url);
    }
  }

  // 3. Subdomain routing: cv.abdugofforov.uz -> serve cv.html (Ommaviy)
  if (url.hostname.startsWith('cv.') || url.searchParams.get('subdomain') === 'cv') {
    if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/cv' || url.pathname === '/cv.html') {
      const resp = await context.env.ASSETS.fetch(new URL('/cv.html', context.request.url));
      return applySecurityHeaders(resp, context, url);
    }
  }

  // Redirect abdugofforov.uz/cv to subdomain if accessed directly on production
  if (url.pathname === '/cv' || url.pathname === '/cv/') {
    if (!url.hostname.startsWith('cv.')) {
      if (url.hostname.includes('abdugofforov.uz')) {
        return Response.redirect(`https://cv.abdugofforov.uz/`, 301);
      }
      const resp = await context.env.ASSETS.fetch(new URL('/cv.html', context.request.url));
      return applySecurityHeaders(resp, context, url);
    }
  }

  const response = await context.next();
  return applySecurityHeaders(response, context, url);
}

function applySecurityHeaders(response, context, url) {
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
  if (!newResponse.headers.has('X-XSS-Protection')) {
    newResponse.headers.set('X-XSS-Protection', '0');
  }
  if (!newResponse.headers.has('X-DNS-Prefetch-Control')) {
    newResponse.headers.set('X-DNS-Prefetch-Control', 'off');
  }
  if (!newResponse.headers.has('Origin-Agent-Cluster')) {
    newResponse.headers.set('Origin-Agent-Cluster', '?1');
  }
  if (!newResponse.headers.has('Cross-Origin-Embedder-Policy')) {
    newResponse.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  }
  if (!newResponse.headers.has('Referrer-Policy')) {
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  if (!newResponse.headers.has('Permissions-Policy')) {
    newResponse.headers.set('Permissions-Policy', 'accelerometer=(), autoplay=(), camera=(), cross-origin-isolated=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(self), screen-wake-lock=(), sync-xhr=(), usb=(), xr-spatial-tracking=()');
  }
  if (!newResponse.headers.has('Cross-Origin-Opener-Policy')) {
    newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  }
  if (!newResponse.headers.has('Cross-Origin-Resource-Policy')) {
    newResponse.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  }
  if (!newResponse.headers.has('X-Permitted-Cross-Domain-Policies')) {
    newResponse.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  }
  if (!newResponse.headers.has('Reporting-Endpoints')) {
    newResponse.headers.set('Reporting-Endpoints', 'csp-endpoint="https://abdugofforov.uz/csp-report"');
  }
  if (url.protocol === 'https:' && !newResponse.headers.has('Strict-Transport-Security')) {
    newResponse.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  // 3. Content-Security-Policy (CSP) sarlavhasi
  if (!newResponse.headers.has('Content-Security-Policy')) {
    const cspDirectives = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://challenges.cloudflare.com https://telegram.org",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "media-src 'self' data: blob:",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://challenges.cloudflare.com https://oauth.telegram.org",
      "connect-src 'self' https://abdugofforov.uz https://*.abdugofforov.uz https://ipapi.co https://api.open-meteo.com https://cloudflareinsights.com https://oauth.telegram.org",
      "report-uri /csp-report",
      "report-to csp-endpoint"
    ];
    newResponse.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  }
  
  return newResponse;
}
