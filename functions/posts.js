// Cloudflare Pages Function — Postlar uchun umumiy ombor (KV asosida)
//
// Maqsad: admin yozgan postlar barcha mehmonlarga ko'rinsin (oddiy IndexedDB
// faqat shu brauzerga tegishli edi).
//
// Endpointlar:
//   GET  /posts          -> hammaga ochiq, JSON array qaytaradi
//   PUT  /posts          -> butun ro'yxatni almashtirish (faqat PIN bilan)
//
// Auth: admin yozish so'rovida x-admin-pin header beradi.
// PIN check-pin.js dagi kabi SHA-256 hash bilan solishtiriladi.
//
// Cloudflare sozlash:
//   1. KV namespace yarating (masalan, nomi: ABDU_POSTS)
//   2. Pages -> Settings -> Functions -> KV namespace bindings:
//        Variable name: POSTS_KV
//        KV namespace:  ABDU_POSTS
//   Bog'lanmagan bo'lsa, GET bo'sh array qaytaradi; PUT 503 qaytaradi.

const CORRECT_PIN_HASH = "827d5449d1f191275051481e75c4ce10e930a64b5585a546363c340d63347089";
const KV_KEY = 'posts:list';
const MAX_BYTES = 24 * 1024 * 1024; // 24MB — KV qiymat chegarasidan ehtiyot

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'no-store',
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-pin, x-admin-token',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  };
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

// Auth: ikki usul qo'llab-quvvatlanadi
// 1) x-admin-token (yangi — Telegram 2FA dan keyin verify-code.js bergan)
// 2) x-admin-pin (eski — faqat agar Telegram ENV sozlanmagan bo'lsa)
async function isAuthorized(request, env) {
  // 1) Token-based auth (yangi)
  const token = request.headers.get('x-admin-token');
  if (token && typeof token === 'string' && /^[a-f0-9]{32,128}$/.test(token)) {
    try {
      const tokenData = await env.POSTS_KV.get(`auth:token:${token}`);
      if (tokenData) return true;
    } catch (e) { /* KV xato — quyiga o'tamiz */ }
  }

  // 2) Eski PIN-based — faqat Telegram sozlanmagan bo'lsa qabul qilamiz
  // (Telegram sozlangach, foydalanuvchi to'liq 2FA orqali o'tishi shart)
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    const pin = request.headers.get('x-admin-pin');
    if (pin && typeof pin === 'string' && pin.length <= 12) {
      const hash = await sha256Hex(pin);
      if (timingSafeEqual(hash, CORRECT_PIN_HASH)) return true;
    }
  }

  return false;
}

function jsonResponse(body, status, request) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), ...JSON_HEADERS },
  });
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request) });
}

// GET /posts — barchaga ochiq
export async function onRequestGet(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    // KV bog'lanmagan — bo'sh ro'yxat qaytaramiz (frontend mahalliyga fallback qiladi)
    return jsonResponse({ posts: [], configured: false }, 200, request);
  }

  try {
    const raw = await env.POSTS_KV.get(KV_KEY);
    const posts = raw ? JSON.parse(raw) : [];
    return jsonResponse({ posts, configured: true }, 200, request);
  } catch (e) {
    return jsonResponse({ posts: [], configured: true, error: 'read_failed' }, 200, request);
  }
}

// PUT /posts — faqat admin PIN bilan
export async function onRequestPut(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    return jsonResponse(
      { ok: false, configured: false, message: 'KV (POSTS_KV) bog\'lanmagan' },
      503, request
    );
  }

  // Brute-force ni biroz sekinlashtirish
  await new Promise(r => setTimeout(r, 150));

  const authorized = await isAuthorized(request, env);
  if (!authorized) {
    const tgConfigured = !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
    return jsonResponse({
      ok: false,
      message: tgConfigured
        ? "Ruxsat berilmadi. Telegram orqali admin panelga qayta kiring."
        : "Ruxsat berilmadi"
    }, 401, request);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, message: 'Noto\'g\'ri JSON' }, 400, request);
  }

  const posts = Array.isArray(body && body.posts) ? body.posts : null;
  if (!posts) {
    return jsonResponse({ ok: false, message: 'posts massivi kerak' }, 400, request);
  }

  // Soddalashtirilgan tekshiruv: har post obyekti bo'lishi shart
  const cleaned = posts.filter(p => p && typeof p === 'object' && p.id != null && typeof p.title === 'string');

  const serialized = JSON.stringify(cleaned);
  if (serialized.length > MAX_BYTES) {
    return jsonResponse(
      { ok: false, message: 'Ma\'lumot juda katta (24MB chegara). Rasmlarni kichraytiring.' },
      413, request
    );
  }

  try {
    await env.POSTS_KV.put(KV_KEY, serialized);
    return jsonResponse({ ok: true, count: cleaned.length }, 200, request);
  } catch (e) {
    return jsonResponse({ ok: false, message: 'Saqlashda xato' }, 500, request);
  }
}
