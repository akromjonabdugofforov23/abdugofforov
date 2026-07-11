// POST /admin/verify-code
// Body: { sessionId: "...", code: "123456" }
//
// 1. Sessiyani KV dan oladi
// 2. Kodni tekshiradi (5 marta noto'g'ri kirsa — sessiya o'chiriladi)
// 3. To'g'ri bo'lsa — 8 soatga admin token yaratadi va KV ga saqlaydi
// 4. Tokenni mijozga qaytaradi

import {
  jsonResponse, corsHeaders, randomHex, timingSafeEqual,
  getClientIp, rateLimit, tooManyRequests
} from '../_lib.js';

const TOKEN_TTL = 8 * 3600; // 8 soat
const MAX_ATTEMPTS = 5;

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "KV ombori (POSTS_KV) bog'lanmagan." }, 503, request, env);
  }

  // IP bo'yicha rate-limit: 5 daqiqada 15 ta kod tekshiruvi
  const rl = await rateLimit(env, request, 'admin-verify-code', 15, 300);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  // Brute force sekinlashtirish
  await new Promise(r => setTimeout(r, 200));

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri JSON" }, 400, request, env);
  }

  const sessionId = String(body.sessionId || '').trim();
  const code = String(body.code || '').trim();

  if (!/^[a-f0-9]{16,64}$/.test(sessionId) || !/^\d{6}$/.test(code)) {
    return jsonResponse({ ok: false, message: "Noto'g'ri kod yoki sessiya" }, 400, request, env);
  }

  let raw;
  try {
    raw = await env.POSTS_KV.get(`auth:session:${sessionId}`);
  } catch (e) {
    return jsonResponse({ ok: false, message: "KV xato" }, 500, request, env);
  }

  if (!raw) {
    return jsonResponse({ ok: false, message: "Sessiya topilmadi yoki eskirgan. Qaytadan PIN kiriting." }, 401, request, env);
  }

  let session;
  try { session = JSON.parse(raw); } catch (e) {
    await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});
    return jsonResponse({ ok: false, message: "Sessiya buzilgan" }, 500, request, env);
  }

  if ((session.attempts || 0) >= MAX_ATTEMPTS) {
    await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});
    return jsonResponse({ ok: false, message: "Juda ko'p urinish — qaytadan PIN kiriting" }, 429, request, env);
  }

  // Doimiy vaqtli solishtirish (timing hujumlaridan himoya)
  if (!timingSafeEqual(String(session.code || ''), code)) {
    session.attempts = (session.attempts || 0) + 1;
    await env.POSTS_KV.put(`auth:session:${sessionId}`, JSON.stringify(session), {
      expirationTtl: 300,
    }).catch(() => {});
    const left = MAX_ATTEMPTS - session.attempts;
    return jsonResponse({
      ok: false,
      message: "Kod noto'g'ri (" + left + " urinish qoldi)",
      attemptsLeft: left,
    }, 401, request, env);
  }

  // Muvaffaqiyat — admin token
  const token = randomHex(32);
  try {
    await env.POSTS_KV.put(`auth:token:${token}`, JSON.stringify({
      createdAt: Date.now(),
      ip: session.ip || '',
      ua: session.ua || '',
    }), { expirationTtl: TOKEN_TTL });
  } catch (e) {
    return jsonResponse({ ok: false, message: "Token saqlashda xato" }, 500, request, env);
  }

  // Sessiyani o'chiramiz (qayta ishlatish mumkin emas)
  await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});

  // Muvaffaqiyatli kirish haqida TG ga xabar (silent)
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const ip = getClientIp(request);
    const text =
      "✅ *Admin panelga muvaffaqiyatli kirildi*\n\n" +
      "IP: `" + ip + "`\n" +
      "Vaqt: " + new Date().toISOString() + "\n" +
      "Token muddati: 8 soat";
    context.waitUntil(
      fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown',
          disable_web_page_preview: true,
        }),
      }).catch(() => {})
    );
  }

  return jsonResponse({ ok: true, token, expiresIn: TOKEN_TTL }, 200, request, env);
}
