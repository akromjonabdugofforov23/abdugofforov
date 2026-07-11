// POST /admin/request-code
// Body: { pin: "..." }
//
// 1. PIN ni tekshiradi (hash ENV: ADMIN_PIN_HASH dan)
// 2. 6-xonali kod yaratadi, KV ga saqlaydi (TTL 5 daqiqa)
// 3. Telegram bot orqali admin chatga kod yuboradi
// 4. Mijozga sessionId qaytaradi (verify-code'da kerak bo'ladi)
//
// Cloudflare env o'zgaruvchilari:
//   POSTS_KV           — KV namespace bindingi
//   ADMIN_PIN_HASH     — admin PIN'ning SHA-256 hashi (kuchli PIN tanlang!)
//   TELEGRAM_BOT_TOKEN — @BotFather'dan
//   TELEGRAM_CHAT_ID   — admin chat ID raqami

import {
  jsonResponse, corsHeaders, verifyAdminPin, randomHex,
  getClientIp, rateLimit, tooManyRequests
} from '../_lib.js';

function random6digit() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(100000 + (arr[0] % 900000));
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "KV ombori (POSTS_KV) bog'lanmagan." }, 503, request, env);
  }
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return jsonResponse({
      ok: false,
      configured: false,
      message: "Telegram bot sozlanmagan. TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID env o'zgaruvchilarini qo'shing."
    }, 503, request, env);
  }

  // IP bo'yicha rate-limit: 5 daqiqada 6 ta kod so'rovi
  const rl = await rateLimit(env, request, 'admin-request-code', 6, 300);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  // Brute-force ni biroz sekinlashtirish
  await new Promise(r => setTimeout(r, 150));

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri JSON" }, 400, request, env);
  }

  const pin = String(body.pin || '').trim();
  if (!pin || pin.length > 64) {
    return jsonResponse({ ok: false, message: "PIN topilmadi" }, 400, request, env);
  }

  if (!(await verifyAdminPin(env, pin))) {
    return jsonResponse({ ok: false, message: "PIN noto'g'ri" }, 401, request, env);
  }

  // Sessiya va kod
  const code = random6digit();
  const sessionId = randomHex(16);
  const ip = getClientIp(request);
  const ua = (request.headers.get('User-Agent') || '').substring(0, 80);

  try {
    await env.POSTS_KV.put(`auth:session:${sessionId}`, JSON.stringify({
      code,
      pinVerified: true,
      attempts: 0,
      ip,
      ua,
      createdAt: Date.now(),
    }), { expirationTtl: 300 });
  } catch (e) {
    return jsonResponse({ ok: false, message: "KV saqlashda xato" }, 500, request, env);
  }

  // Telegram ga kod yuborish
  const text =
    "🔐 *Admin panel kirish kodi*\n\n" +
    "Kod: `" + code + "`\n\n" +
    "IP: `" + ip + "`\n" +
    "Brauzer: " + (ua || "noma'lum") + "\n" +
    "Muddat: 5 daqiqa\n\n" +
    "_Agar siz so'ramagan bo'lsangiz — e'tibor bermang va PIN ni o'zgartiring._";

  try {
    const tgRes = await fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    if (!tgRes.ok) {
      const errText = await tgRes.text().catch(() => '');
      await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});
      return jsonResponse({
        ok: false,
        message: "Telegram xato: " + errText.substring(0, 150)
      }, 502, request, env);
    }
  } catch (e) {
    await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});
    return jsonResponse({ ok: false, message: "Telegram bilan bog'lanib bo'lmadi" }, 502, request, env);
  }

  return jsonResponse({ ok: true, sessionId, expiresIn: 300 }, 200, request, env);
}
