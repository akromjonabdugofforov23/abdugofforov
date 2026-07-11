// Cloudflare Pages Function — PIN tekshiruvi (server tomonida)
// Xavfsizlik xususiyatlari:
//  - PIN hash sifatida solishtiriladi (ochiq matnda saqlanmaydi)
//  - Hash ENV o'zgaruvchisidan olinadi (ADMIN_PIN_HASH), kodda hardcode emas
//  - Doimiy vaqtli (constant-time) solishtirish — timing hujumlaridan himoya
//  - IP bo'yicha rate-limiting (brute-force'ga qarshi) + kichik kechikish
//  - Same-origin'ga cheklangan CORS

import {
  jsonResponse, corsHeaders, verifyAdminPin, rateLimit, tooManyRequests
} from './_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // IP bo'yicha rate-limit: 5 daqiqada 8 ta urinish
  const rl = await rateLimit(env, request, 'check-pin', 8, 300);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  try {
    const body = await request.json();
    const userPin = (body && typeof body.pin === 'string') ? body.pin : '';

    // Brute-force ni sekinlashtirish uchun kichik kechikish (~250ms)
    await new Promise(r => setTimeout(r, 250));

    if (!userPin || userPin.length > 64) {
      return jsonResponse({ success: false, message: "Noto'g'ri so'rov" }, 400, request, env);
    }

    if (await verifyAdminPin(env, userPin)) {
      return jsonResponse({ success: true }, 200, request, env);
    }

    return jsonResponse({ success: false, message: "Noto'g'ri PIN-kod!" }, 401, request, env);
  } catch (err) {
    return jsonResponse({ success: false, message: "Xato so'rov jo'natildi" }, 400, request, env);
  }
}
