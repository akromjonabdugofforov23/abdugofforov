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

export function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-user-token, x-admin-token, x-admin-pin, Authorization',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  };
}

export function jsonResponse(data, status, request) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { ...corsHeaders(request), ...JSON_HEADERS },
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

// ---- Admin tekshiruvi (token yoki PIN) ----
const ADMIN_PIN_HASH = "827d5449d1f191275051481e75c4ce10e930a64b5585a546363c340d63347089";
export async function isAdmin(env, request) {
  const token = request.headers.get('x-admin-token');
  if (token && /^[a-f0-9]{32,128}$/.test(token)) {
    try {
      const t = await env.POSTS_KV.get(`auth:token:${token}`);
      if (t) return true;
    } catch (e) {}
  }
  // Telegram sozlanmagan bo'lsa PIN ham qabul qilinadi
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    const pin = request.headers.get('x-admin-pin');
    if (pin && pin.length <= 12) {
      const data = new TextEncoder().encode(pin);
      const buf = await crypto.subtle.digest('SHA-256', data);
      if (timingSafeEqual(bufToHex(buf), ADMIN_PIN_HASH)) return true;
    }
  }
  return false;
}

// Foydalanuvchidan parolni olib tashlab, xavfsiz ko'rinish qaytaradi
export function publicUser(user) {
  if (!user) return null;
  return { name: user.name, username: user.username, createdAt: user.createdAt };
}
