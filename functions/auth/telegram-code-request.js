// POST /auth/telegram-code-request
// Body: { target: "123456789" } (Telegram chat ID yoki username)
// Telegram bot orqali foydalanuvchiga 6-xonali kirish kodini yuboradi.

import {
  jsonResponse, corsHeaders, rateLimit, tooManyRequests
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
    return jsonResponse({ ok: false, message: "KV ombori bog'lanmagan." }, 503, request, env);
  }
  if (!env.TELEGRAM_BOT_TOKEN) {
    return jsonResponse({
      ok: false,
      message: "Telegram bot (TELEGRAM_BOT_TOKEN) sozlanmagan. Admin panel orqali env o'zgaruvchilarini sozlang."
    }, 503, request, env);
  }

  // Rate-limit: 5 daqiqada 5 ta kod so'rovi
  const rl = await rateLimit(env, request, 'tg-code-request', 5, 300);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request, env);
  }

  let target = String(body.target || '').trim();
  if (!target) {
    target = env.TELEGRAM_CHAT_ID || '';
  }
  if (!target) {
    return jsonResponse({ ok: false, message: "Telegram Chat ID kiritilmadi" }, 400, request, env);
  }

  const cleanTarget = target.replace('@', '');
  const code = random6digit();

  try {
    await env.POSTS_KV.put(`auth:tgcode:${cleanTarget}`, JSON.stringify({
      code,
      target: cleanTarget,
      attempts: 0,
      createdAt: Date.now(),
    }), { expirationTtl: 300 });
  } catch (e) {
    return jsonResponse({ ok: false, message: "KV omborida saqlashda xato" }, 500, request, env);
  }

  const text =
    "🔐 *Abdugofforov.uz — Telegram Kirish Kodi*\n\n" +
    "Sizning tasdiqlash kodingiz: `" + code + "`\n\n" +
    "⏰ Muddat: 5 daqiqa\n" +
    "_Agar siz kirmagan bo'lsangiz, ushbu xabarga e'tibor bermang._";

  try {
    const tgRes = await fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: target,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    if (!tgRes.ok) {
      const errData = await tgRes.json().catch(() => ({}));
      await env.POSTS_KV.delete(`auth:tgcode:${cleanTarget}`).catch(() => {});
      return jsonResponse({
        ok: false,
        message: "Telegram bot xabari yuborilmadi: " + (errData.description || "Botga oldin /start yuborganingizni tekshiring.")
      }, 400, request, env);
    }
  } catch (e) {
    await env.POSTS_KV.delete(`auth:tgcode:${cleanTarget}`).catch(() => {});
    return jsonResponse({ ok: false, message: "Telegram serveri bilan bog'lanishda xato" }, 502, request, env);
  }

  return jsonResponse({ ok: true, target: cleanTarget, message: "Kod Telegram'ga yuborildi!" }, 200, request, env);
}
