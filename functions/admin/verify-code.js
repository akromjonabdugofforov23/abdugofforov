// POST /admin/verify-code
// Body: { sessionId: "...", code: "123456" }
//
// 1. Sessiyani KV dan oladi
// 2. Kodni tekshiradi (5 marta noto'g'ri kirsa — sessiya o'chiriladi)
// 3. To'g'ri bo'lsa — 8 soatga admin token yaratadi va KV ga saqlaydi
// 4. Tokenni mijozga qaytaradi (frontend uni sessionStorage'ga saqlab,
//    keyingi PUT /posts so'rovlarida x-admin-token header'da yuboradi)

const TOKEN_TTL = 8 * 3600; // 8 soat
const MAX_ATTEMPTS = 5;

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'no-store',
};

function corsHeaders(request) {
  return {
    'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function jsonResponse(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(request), ...JSON_HEADERS },
  });
}

function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request) });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "KV ombori (POSTS_KV) bog'lanmagan." }, 503, request);
  }

  // Brute force sekinlashtirish
  await new Promise(r => setTimeout(r, 200));

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri JSON" }, 400, request);
  }

  const sessionId = String(body.sessionId || '').trim();
  const code = String(body.code || '').trim();

  if (!/^[a-f0-9]{16,64}$/.test(sessionId) || !/^\d{6}$/.test(code)) {
    return jsonResponse({ ok: false, message: "Noto'g'ri kod yoki sessiya" }, 400, request);
  }

  let raw;
  try {
    raw = await env.POSTS_KV.get(`auth:session:${sessionId}`);
  } catch (e) {
    return jsonResponse({ ok: false, message: "KV xato" }, 500, request);
  }

  if (!raw) {
    return jsonResponse({ ok: false, message: "Sessiya topilmadi yoki eskirgan. Qaytadan PIN kiriting." }, 401, request);
  }

  let session;
  try { session = JSON.parse(raw); } catch (e) {
    await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});
    return jsonResponse({ ok: false, message: "Sessiya buzilgan" }, 500, request);
  }

  if ((session.attempts || 0) >= MAX_ATTEMPTS) {
    await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});
    return jsonResponse({ ok: false, message: "Juda ko'p urinish — qaytadan PIN kiriting" }, 429, request);
  }

  if (session.code !== code) {
    session.attempts = (session.attempts || 0) + 1;
    await env.POSTS_KV.put(`auth:session:${sessionId}`, JSON.stringify(session), {
      expirationTtl: 300,
    }).catch(() => {});
    const left = MAX_ATTEMPTS - session.attempts;
    return jsonResponse({
      ok: false,
      message: "Kod noto'g'ri (" + left + " urinish qoldi)",
      attemptsLeft: left,
    }, 401, request);
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
    return jsonResponse({ ok: false, message: "Token saqlashda xato" }, 500, request);
  }

  // Sessiyani o'chiramiz (qayta ishlatish mumkin emas)
  await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});

  // Muvaffaqiyatli kirish haqida TG ga xabar (silent — xato bo'lsa ham davom etamiz)
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const ip = request.headers.get('CF-Connecting-IP') || "noma'lum";
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

  return jsonResponse({ ok: true, token, expiresIn: TOKEN_TTL }, 200, request);
}
