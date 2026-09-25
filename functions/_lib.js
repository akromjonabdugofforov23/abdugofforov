// ============================================================
// Umumiy yordamchi kutubxona — auth va natijalar uchun
// (Fayl nomi '_' bilan boshlanadi => Cloudflare Pages uni route qilmaydi,
//  faqat boshqa funksiyalar import qiladi)
// ============================================================

export const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'no-store',
};

// Origin'ni faqat same-origin yoki ALLOWED_ORIGINS ro'yxatidagilarga ruxsat beramiz.
// Bu wildcard ('*') aks ettirishning oldini oladi.
export function isAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin') || '';
  if (!origin) return ''; // Origin yo'q (same-origin GET) — CORS shart emas
  let allowed = [];
  // So'rovning o'z origini (same-origin) doim ruxsat etiladi
  try { allowed.push(new URL(request.url).origin); } catch (e) {}
  // Asosiy domen va subdomainlar avtomatik ruxsat etiladi
  try {
    const originUrl = new URL(origin);
    if (originUrl.hostname === 'abdugofforov.uz' || originUrl.hostname.endsWith('.abdugofforov.uz')) {
      allowed.push(origin);
    }
  } catch (e) {}
  // Qo'shimcha ruxsat etilgan originlar (vergul bilan ajratilgan ENV)
  if (env && env.ALLOWED_ORIGINS) {
    for (const o of String(env.ALLOWED_ORIGINS).split(',')) {
      const t = o.trim();
      if (t) allowed.push(t);
    }
  }
  return allowed.includes(origin) ? origin : '';
}

export function corsHeaders(request, env) {
  const allowOrigin = isAllowedOrigin(request, env);
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-user-token, x-admin-token, x-admin-pin, Authorization',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  };
  // Faqat ruxsat etilgan origin uchun ACAO sarlavhasini qo'shamiz.
  if (allowOrigin) headers['Access-Control-Allow-Origin'] = allowOrigin;
  return headers;
}

export function jsonResponse(data, status, request, env) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { ...corsHeaders(request, env), ...JSON_HEADERS },
  });
}

// ---- Mijoz IP manzili ----
export function getClientIp(request) {
  return request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')
    || 'unknown';
}

// ---- IP bo'yicha rate-limiting (KV asosida) ----
// bucket — endpoint nomi, max — oyna ichidagi maksimal urinishlar, windowSec — oyna (soniya)
// Qaytaradi: { ok: true } yoki { ok: false, retryAfter }
export async function rateLimit(env, request, bucket, max, windowSec) {
  if (!env || !env.POSTS_KV) return { ok: true };
  const ip = getClientIp(request);
  const key = `rl:${bucket}:${ip}`;
  const now = Date.now();
  let rec = null;
  try {
    const raw = await env.POSTS_KV.get(key);
    rec = raw ? JSON.parse(raw) : null;
  } catch (e) { rec = null; }

  if (!rec || now > rec.resetAt) {
    rec = { count: 1, resetAt: now + windowSec * 1000 };
    await env.POSTS_KV.put(key, JSON.stringify(rec), { expirationTtl: windowSec + 5 }).catch(() => {});
    return { ok: true };
  }

  rec.count += 1;
  const ttl = Math.max(1, Math.ceil((rec.resetAt - now) / 1000));
  await env.POSTS_KV.put(key, JSON.stringify(rec), { expirationTtl: ttl + 5 }).catch(() => {});
  if (rec.count > max) {
    return { ok: false, retryAfter: ttl };
  }
  return { ok: true };
}

export function tooManyRequests(request, retryAfter, env) {
  return new Response(JSON.stringify({
    ok: false,
    success: false,
    message: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring.",
  }), {
    status: 429,
    headers: {
      ...corsHeaders(request, env),
      ...JSON_HEADERS,
      'Retry-After': String(retryAfter || 60),
    },
  });
}

// ---- Tasodifiy qiymatlar ----
export function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToBuf(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  return arr;
}

// ---- Parol hashlash (PBKDF2-SHA256, 100k iteratsiya) ----
const PBKDF2_ITER = 100000;

export async function hashPassword(password, saltHex) {
  let salt;
  if (saltHex) {
    salt = hexToBuf(saltHex);
  } else {
    salt = crypto.getRandomValues(new Uint8Array(16));
    saltHex = bufToHex(salt);
  }
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITER, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return { hash: bufToHex(bits), salt: saltHex };
}

export async function verifyPassword(password, saltHex, expectedHashHex) {
  const { hash } = await hashPassword(password, saltHex);
  return timingSafeEqual(hash, expectedHashHex);
}

export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// ---- Username normalizatsiya va validatsiya ----
export function normUsername(u) {
  return String(u || '').trim().toLowerCase();
}
export function validUsername(u) {
  return /^[a-z0-9_]{3,20}$/.test(u);
}

// ---- Sessiya tokenlari (KV) ----
const SESSION_TTL = 30 * 24 * 3600; // 30 kun

export async function createSession(env, username) {
  const token = randomHex(32);
  await env.POSTS_KV.put(`session:${token}`, JSON.stringify({
    username, createdAt: Date.now()
  }), { expirationTtl: SESSION_TTL });
  return token;
}

export async function getSessionUsername(env, request) {
  let token = request.headers.get('x-user-token');
  if (!token) {
    const auth = request.headers.get('Authorization') || '';
    if (auth.startsWith('Bearer ')) token = auth.slice(7);
  }
  if (!token || !/^[a-f0-9]{32,128}$/.test(token)) return null;
  try {
    const raw = await env.POSTS_KV.get(`session:${token}`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.username || null;
  } catch (e) { return null; }
}

export async function deleteSession(env, request) {
  let token = request.headers.get('x-user-token');
  if (!token) {
    const auth = request.headers.get('Authorization') || '';
    if (auth.startsWith('Bearer ')) token = auth.slice(7);
  }
  if (token && /^[a-f0-9]{32,128}$/.test(token)) {
    await env.POSTS_KV.delete(`session:${token}`).catch(() => {});
  }
}

// ---- Foydalanuvchi KV ----
export async function getUser(env, username) {
  const raw = await env.POSTS_KV.get(`user:${username}`);
  return raw ? JSON.parse(raw) : null;
}
export async function putUser(env, user) {
  await env.POSTS_KV.put(`user:${user.username}`, JSON.stringify(user));
}

// Foydalanuvchilar ro'yxati indeksi (admin uchun)
export async function addUserToIndex(env, username) {
  const raw = await env.POSTS_KV.get('users:index');
  let list = [];
  try { list = raw ? JSON.parse(raw) : []; } catch (e) { list = []; }
  if (!list.includes(username)) {
    list.push(username);
    await env.POSTS_KV.put('users:index', JSON.stringify(list));
  }
}
export async function getUsersIndex(env) {
  const raw = await env.POSTS_KV.get('users:index');
  try { return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}

// ---- Admin PIN ----
// Asosiy admin PIN (0509) va Cloudflare ENV (ADMIN_PIN_HASH) bilan tekshirish
const LEGACY_PIN_SHA256 = "827d5449d1f191275051481e75c4ce10e930a64b5585a546363c340d63347089";

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return bufToHex(buf);
}

export async function verifyAdminPin(env, pin) {
  if (typeof pin !== 'string' || !pin || pin.length > 64) return false;
  const cleanPin = pin.trim();

  // 1. Dastlabki admin PIN (0509) ni to'g'ridan-to'g'ri yoki SHA-256 bilan qabul qilish
  if (cleanPin === '0509') return true;
  const pinHash = await sha256Hex(cleanPin);
  if (timingSafeEqual(pinHash, LEGACY_PIN_SHA256)) return true;

  // 2. Agar Cloudflare'da ADMIN_PIN_HASH o'rnatilgan bo'lsa
  const envHash = env && env.ADMIN_PIN_HASH ? String(env.ADMIN_PIN_HASH).trim() : '';
  if (envHash) {
    if (cleanPin === envHash) return true;
    if (timingSafeEqual(pinHash, envHash.toLowerCase())) return true;
    if (envHash.includes(':')) {
      const [saltHex, expectedHashHex] = envHash.split(':');
      try {
        if (await verifyPassword(cleanPin, saltHex, expectedHashHex)) return true;
      } catch (e) {}
    }
  }

  return false;
}

// ---- Admin foydalanuvchilar ro'yxati va tekshiruvi ----
export function getAdminUsernames(env) {
  const custom = env && env.ADMIN_USERNAMES ? String(env.ADMIN_USERNAMES).split(',') : [];
  const list = ['abdugofforov', 'admin', 'akrin4477', 'akrin', ...custom.map(s => s.trim().toLowerCase())];
  return Array.from(new Set(list.filter(Boolean)));
}

export function isUserAdmin(user, env) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const adminUsers = getAdminUsernames(env);
  if (user.username && adminUsers.includes(String(user.username).toLowerCase())) return true;
  if (env && env.TELEGRAM_CHAT_ID && user.tgId && String(user.tgId) === String(env.TELEGRAM_CHAT_ID)) return true;
  return false;
}

// ---- Admin tekshiruvi (token, x-user-token yoki PIN) ----
export async function isAdmin(env, request) {
  const token = request.headers.get('x-admin-token');
  if (token && /^[a-f0-9]{32,128}$/.test(token)) {
    try {
      const t = await env.POSTS_KV.get(`auth:token:${token}`);
      if (t) return true;
    } catch (e) {}
  }

  // x-user-token yoki Authorization header orqali kirgan admin foydalanuvchini tekshirish
  try {
    const sessionUsername = await getSessionUsername(env, request);
    if (sessionUsername) {
      const user = await getUser(env, sessionUsername);
      if (user && isUserAdmin(user, env)) return true;
    }
  } catch (e) {}

  // Telegram sozlanmagan bo'lsa PIN ham qabul qilinadi
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    const pin = request.headers.get('x-admin-pin');
    if (pin && await verifyAdminPin(env, pin)) return true;
  }
  return false;
}

// Foydalanuvchidan parolni olib tashlab, xavfsiz ko'rinish qaytaradi
export function publicUser(user, env) {
  if (!user) return null;
  const admin = isUserAdmin(user, env);
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: admin ? 'admin' : (user.role || 'student'),
    photo: user.photo,
    createdAt: user.createdAt
  };
}
