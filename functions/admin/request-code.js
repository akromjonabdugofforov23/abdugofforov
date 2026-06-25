// POST /admin/request-code
// Body: { pin: "..." }
//
// 1. PIN ni tekshiradi
// 2. 6-xonali kod yaratadi, KV ga saqlaydi (TTL 5 daqiqa)
// 3. Telegram bot orqali admin chatga kod yuboradi
// 4. Mijozga sessionId qaytaradi (verify-code'da kerak bo'ladi)
//
// Cloudflare env o'zgaruvchilari:
//   POSTS_KV          — KV namespace bindingi (postlar bilan birga ishlatiladi)
//   TELEGRAM_BOT_TOKEN — @BotFather'dan
//   TELEGRAM_CHAT_ID   — admin chat ID raqami (@userinfobot'dan)

const CORRECT_PIN_HASH = "827d5449d1f191275051481e75c4ce10e930a64b5585a546363c340d63347089";
const SESSION_TTL = 300; // 5 daqiqa

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

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function random6digit() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(100000 + (arr[0] % 900000));
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request) });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "KV ombori (POSTS_KV) bog'lanmagan." }, 503, request);
  }
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return jsonResponse({
      ok: false,
      configured: false,
      message: "Telegram bot sozlanmagan. TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID env o'zgaruvchilarini qo'shing."
    }, 503, request);
  }

  // Brute-force ni biroz sekinlashtirish
  await new Promise(r => setTimeout(r, 150));

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri JSON" }, 400, request);
  }

  const pin = String(body.pin || '').trim();
  if (!pin || pin.length > 12) {
    return jsonResponse({ ok: false, message: "PIN topilmadi" }, 400, request);
  }

  const pinHash = await sha256Hex(pin);
  if (!timingSafeEqual(pinHash, CORRECT_PIN_HASH)) {
    return jsonResponse({ ok: false, message: "PIN noto'g'ri" }, 401, request);
  }

  // Sessiya va kod
  const code = random6digit();
  const sessionId = randomHex(16);
  const ip = request.headers.get('CF-Connecting-IP') || "noma'lum";
  const ua = (request.headers.get('User-Agent') || '').substring(0, 80);

  try {
    await env.POSTS_KV.put(`auth:session:${sessionId}`, JSON.stringify({
      code,
      pinVerified: true,
      attempts: 0,
      ip,
      ua,
      createdAt: Date.now(),
    }), { expirationTtl: SESSION_TTL });
  } catch (e) {
    return jsonResponse({ ok: false, message: "KV saqlashda xato" }, 500, request);
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
      // Sessiyani tozalaymiz (foydasiz)
      await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});
      return jsonResponse({
        ok: false,
        message: "Telegram xato: " + errText.substring(0, 150)
      }, 502, request);
    }
  } catch (e) {
    await env.POSTS_KV.delete(`auth:session:${sessionId}`).catch(() => {});
    return jsonResponse({ ok: false, message: "Telegram bilan bog'lanib bo'lmadi" }, 502, request);
  }

  return jsonResponse({ ok: true, sessionId, expiresIn: SESSION_TTL }, 200, request);
}
