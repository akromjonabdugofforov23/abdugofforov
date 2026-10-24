// ============================================================
// Umumiy xavfsizlik va yordamchi kutubxona — auth va API uchun
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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-user-token, x-admin-token, x-admin-pin, Authorization',
    'Access-Control-Max-Age': '86400',
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

// ---- Mijoz IP manzili (IP Spoofing va noto'g'ri headerlardan himoyalangan) ----
export function getClientIp(request) {
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp && /^[0-9a-fA-F:.]+$/.test(cfIp.trim())) {
    return cfIp.trim();
  }

  const xff = request.headers.get('X-Forwarded-For');
  if (xff) {
    const firstIp = xff.split(',')[0].trim();
    if (/^[0-9a-fA-F:.]+$/.test(firstIp)) {
      return firstIp;
    }
  }
  return 'unknown';
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

// ---- Kriptografik tasodifiy qiymatlar ----
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

// ---- Parol hashlash (PBKDF2-SHA256, zamonaviy 250k iteratsiya) ----
const PBKDF2_ITER_MODERN = 250000;
const PBKDF2_ITER_LEGACY = 100000;

export async function hashPassword(password, saltHex, iterations = PBKDF2_ITER_MODERN) {
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
    { name: 'PBKDF2', salt, iterations: iterations || PBKDF2_ITER_MODERN, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return { hash: bufToHex(bits), salt: saltHex };
}

export async function verifyPassword(password, saltHex, expectedHashHex) {
  if (!password || !saltHex || !expectedHashHex) return false;
  // 1. Zamonaviy 250,000 iteratsiya bilan tekshirish
  const modern = await hashPassword(password, saltHex, PBKDF2_ITER_MODERN);
  if (timingSafeEqual(modern.hash, expectedHashHex)) return true;
  // 2. Merosiy 100,000 iteratsiya bilan tekshirish (orqaga moslashuvchanlik)
  const legacy = await hashPassword(password, saltHex, PBKDF2_ITER_LEGACY);
  if (timingSafeEqual(legacy.hash, expectedHashHex)) return true;
  return false;
}

export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// ---- Username va Parol validatsiyasi ----
export function normUsername(u) {
  return String(u || '').trim().toLowerCase();
}
export function validUsername(u) {
  return /^[a-z0-9_]{3,20}$/.test(u);
}
export function validPassword(p) {
  return typeof p === 'string' && p.length >= 4 && p.length <= 128;
}

// ---- Sessiya tokenlari (KV) ----
const SESSION_TTL = 30 * 24 * 3600; // 30 kun

export async function createSession(env, username, meta = {}) {
  const token = randomHex(32);
  await env.POSTS_KV.put(`session:${token}`, JSON.stringify({
    username,
    createdAt: Date.now(),
    ...meta
  }), { expirationTtl: SESSION_TTL });
  return token;
}

export async function getSessionUsername(env, request) {
  let token = request.headers.get('x-user-token') || request.headers.get('x-admin-token');
  if (!token) {
    const auth = request.headers.get('Authorization') || '';
    if (auth.startsWith('Bearer ')) token = auth.slice(7);
  }
  if (!token || !/^[a-f0-9]{32,128}$/.test(token)) return null;
  try {
    const raw = await env.POSTS_KV.get(`session:${token}`);
    if (!raw) {
      const adminToken = await env.POSTS_KV.get(`auth:token:${token}`);
      if (adminToken) return 'abdugofforov';
      return null;
    }
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
export async function removeUserFromIndex(env, username) {
  const raw = await env.POSTS_KV.get('users:index');
  let list = [];
  try { list = raw ? JSON.parse(raw) : []; } catch (e) { list = []; }
  const clean = String(username).toLowerCase();
  list = list.filter(u => String(u).toLowerCase() !== clean);
  await env.POSTS_KV.put('users:index', JSON.stringify(list));
}
export async function deleteUser(env, username) {
  const clean = String(username).toLowerCase();
  await env.POSTS_KV.delete(`user:${clean}`);
  await removeUserFromIndex(env, clean);
}

// ---- Admin PIN tekshiruvi ----
const PRIMARY_ADMIN_SHA256 = "d85deaee34f56859e36a22eab32a6c8dc6cb695440e051e396b865247e9e9349";
const LEGACY_PIN_SHA256 = "827d5449d1f191275051481e75c4ce10e930a64b5585a546363c340d63347089";

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return bufToHex(buf);
}

export async function verifyAdminPin(env, pin) {
  if (pin === undefined || pin === null) return false;
  const cleanPin = String(pin).trim();
  if (!cleanPin || cleanPin.length > 64) return false;
  const pinHash = (await sha256Hex(cleanPin)).toLowerCase();

  // 1. KV'dagi sozlamalar (settings.adminPinHash yoki settings.adminPin) tekshiruvi (Ustuvor)
  if (env && env.POSTS_KV) {
    try {
      const rawSettings = await env.POSTS_KV.get('site_settings');
      if (rawSettings) {
        const settings = JSON.parse(rawSettings);
        if (settings) {
          if (settings.adminPinHash && typeof settings.adminPinHash === 'string') {
            const sHash = String(settings.adminPinHash).trim().toLowerCase();
            if (timingSafeEqual(pinHash, sHash)) return true;
            if (sHash.includes(':')) {
              const [saltHex, expectedHashHex] = sHash.split(':');
              try {
                if (await verifyPassword(cleanPin, saltHex, expectedHashHex)) return true;
              } catch (_) {}
            }
          }
          if (settings.adminPin && (typeof settings.adminPin === 'string' || typeof settings.adminPin === 'number')) {
            const sPin = String(settings.adminPin).trim();
            if (timingSafeEqual(cleanPin, sPin)) return true;
            const sPinHash = (await sha256Hex(sPin)).toLowerCase();
            if (timingSafeEqual(pinHash, sPinHash)) return true;
          }
        }
      }
    } catch (_) {}
  }

  // 2. Cloudflare muhit o'zgaruvchilari (ADMIN_PIN_HASH va ADMIN_PIN)
  const envHash = env && env.ADMIN_PIN_HASH ? String(env.ADMIN_PIN_HASH).trim().toLowerCase() : '';
  if (envHash) {
    if (timingSafeEqual(pinHash, envHash)) return true;
    if (envHash.includes(':')) {
      const [saltHex, expectedHashHex] = envHash.split(':');
      try {
        if (await verifyPassword(cleanPin, saltHex, expectedHashHex)) return true;
      } catch (e) {}
    }
  }

  const envPin = env && (env.ADMIN_PIN || env.ADMIN_PIN_CODE) ? String(env.ADMIN_PIN || env.ADMIN_PIN_CODE).trim() : '';
  if (envPin) {
    if (timingSafeEqual(cleanPin, envPin)) return true;
    const envPinHash = (await sha256Hex(envPin)).toLowerCase();
    if (timingSafeEqual(pinHash, envPinHash)) return true;
  }

  // 3. Standart va zaxira SHA-256 xeshlar
  if (timingSafeEqual(pinHash, PRIMARY_ADMIN_SHA256)) return true;
  if (timingSafeEqual(pinHash, LEGACY_PIN_SHA256)) return true;

  return false;
}

// ---- Admin foydalanuvchilar ro'yxati va tekshiruvi ----
export function getAdminUsernames(env) {
  const custom = env && env.ADMIN_USERNAMES ? String(env.ADMIN_USERNAMES).split(',') : [];
  const list = ['abdugofforov', 'admin', ...custom.map(s => s.trim().toLowerCase())];
  return Array.from(new Set(list.filter(Boolean)));
}

export function isUserAdmin(user, env) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'student') return false;
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

  // Admin PIN orqali to'g'ridan-to'g'ri avtorizatsiya
  const pin = request.headers.get('x-admin-pin') || request.headers.get('x-pin');
  if (pin && await verifyAdminPin(env, pin)) return true;
  return false;
}

// Foydalanuvchidan parolni olib tashlab, xavfsiz ko'rinish qaytaradi
export function publicUser(user, env) {
  if (!user) return null;
  const admin = isUserAdmin(user, env);
  return {
    id: user.id || user.username,
    name: user.name || user.username,
    username: user.username,
    role: admin ? 'admin' : (user.role || 'student'),
    photo: user.photo || '',
    createdAt: user.createdAt
  };
}

// Telegram chat / channel ID tozalash
export function normalizeTelegramChatId(id) {
  if (!id) return '';
  let clean = String(id).trim();
  clean = clean.replace(/^https?:\/\/t\.me\//i, '').replace(/^t\.me\//i, '');
  clean = clean.replace(/\/+$/, '');
  if (!clean) return '';
  if (!/^-?\d+$/.test(clean) && !clean.startsWith('@')) {
    clean = '@' + clean;
  }
  return clean;
}

// Telegram HTML parse_mode xavfsizligi uchun maxsus belgilarni almashtirish
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Cloudflare muhit va KV'dan dinamik Telegram konfiguratsiyasini olish
export async function getTelegramConfig(env) {
  let siteSettings = {};
  if (env && env.POSTS_KV) {
    try {
      const raw = await env.POSTS_KV.get('site_settings');
      if (raw) siteSettings = JSON.parse(raw) || {};
    } catch (_) {}
  }

  const botToken = (env && env.TELEGRAM_BOT_TOKEN) || siteSettings.telegramBotToken || '';
  let channelId = (env && env.TELEGRAM_CHANNEL_ID) || siteSettings.telegramChannelId || '';
  let adminChatId = (env && (env.TELEGRAM_ADMIN_CHAT_ID || env.TELEGRAM_CHAT_ID)) || siteSettings.telegramAdminChatId || '';

  channelId = normalizeTelegramChatId(channelId);
  adminChatId = normalizeTelegramChatId(adminChatId);

  return {
    botToken,
    channelId,
    adminChatId,
    isConfigured: Boolean(botToken && (channelId || adminChatId))
  };
}

// Cookie sarlavhasini tahlil qilish (parse)
export function parseCookies(header) {
  const map = {};
  if (!header) return map;
  const parts = header.split(';');
  for (const p of parts) {
    const idx = p.indexOf('=');
    if (idx > -1) {
      const key = p.slice(0, idx).trim();
      const val = p.slice(idx + 1).trim();
      if (key) {
        try {
          map[key] = decodeURIComponent(val);
        } catch (_) {
          map[key] = val;
        }
      }
    }
  }
  return map;
}

// 403 Forbidden HTML sahifasi shabloni (Stealth Shield)
export const FORBIDDEN_HTML = `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 Forbidden — Kirish Taqiqlangan</title>
    <meta name="robots" content="noindex, nofollow, noarchive">
    <link rel="icon" type="image/svg+xml" href="/icon.svg">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: #07111c;
            color: #f0f6fc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background-image: 
                radial-gradient(ellipse 60% 50% at 50% 0%, rgba(244, 63, 94, 0.15) 0%, transparent 70%),
                radial-gradient(ellipse 50% 50% at 50% 100%, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
        }
        .forbidden-card {
            background: rgba(14, 30, 48, 0.85);
            border: 1px solid rgba(244, 63, 94, 0.35);
            border-radius: 20px;
            padding: 44px 36px;
            max-width: 480px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(244, 63, 94, 0.15);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .shield-icon {
            width: 72px;
            height: 72px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.05));
            border: 1px solid rgba(244, 63, 94, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 0 0 20px rgba(244, 63, 94, 0.25);
        }
        .status-badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #f43f5e;
            background: rgba(244, 63, 94, 0.12);
            border: 1px solid rgba(244, 63, 94, 0.3);
            padding: 4px 14px;
            border-radius: 999px;
            margin-bottom: 16px;
        }
        h1 {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #ffffff;
            letter-spacing: -0.5px;
        }
        p {
            font-size: 14px;
            line-height: 1.6;
            color: #9cb3c9;
            margin-bottom: 28px;
        }
        .btn-home {
            display: inline-block;
            width: 100%;
            padding: 13px 24px;
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
            background: linear-gradient(135deg, #0284c7, #2563eb);
            border: none;
            border-radius: 12px;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
        }
        .btn-home:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 22px rgba(37, 99, 235, 0.45);
        }
        .meta-notice {
            margin-top: 24px;
            font-size: 11px;
            color: #627d98;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
    </style>
</head>
<body>
    <div class="forbidden-card">
        <div class="shield-icon">🛡️</div>
        <div class="status-badge">403 Forbidden</div>
        <h1>Kirish Taqiqlangan</h1>
        <p>Ushbu boshqaruv qismiga to'g'ridan-to'g'ri kirish cheklangan. Tizim xavfsizlik protokoli tomonidan so'rov bloklandi.</p>
        <a href="/" class="btn-home">← Asosiy sahifaga qaytish</a>
        <div class="meta-notice">Security Shield: Access Denied</div>
    </div>
</body>
</html>`;

// ---- WAF Xavfsizlik Signallari (Telegram Auto-Alert) ----
const ALERT_COOLDOWN_SEC = 60; // 60 soniyalik spamdan himoya

export async function sendTelegramSecurityAlert(context, alert = {}) {
  const { env, request } = context;
  if (!env || !env.TELEGRAM_BOT_TOKEN) return;

  const chatId = env.TELEGRAM_ADMIN_CHAT_ID || env.TELEGRAM_CHAT_ID;
  if (!chatId) return;

  const ip = alert.ip || getClientIp(request);
  const now = Math.floor(Date.now() / 1000);

  // Spam bo'lmasligi uchun Cloudflare KV orqali cooldown tekshiruvi
  if (env.POSTS_KV) {
    try {
      const cooldownKey = `sec_alert:${ip}:${alert.type || 'scan'}`;
      const existing = await env.POSTS_KV.get(cooldownKey);
      if (existing) return;
      await env.POSTS_KV.put(cooldownKey, String(now), { expirationTtl: ALERT_COOLDOWN_SEC });
    } catch (_) {}
  }

  const timeStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  const text = 
    `🚨 <b>[XAVFSIZLIK OGOHLANTIRISHI]</b>\n` +
    `Saytingizda shubhali skaner aniqlandi va bloklandi!\n\n` +
    `🌐 <b>IP manzil:</b> <code>${ip}</code>\n` +
    `🛡 <b>Holat:</b> <code>${alert.status || '403 Forbidden'}</code>\n` +
    `⚠️ <b>Xavf turi:</b> ${alert.type || 'Skaner / Exploit'}\n` +
    `🎯 <b>Nishon:</b> <code>${(alert.target || '').slice(0, 120)}</code>\n` +
    `🛠 <b>Vosita (UA):</b> <code>${(alert.agent || 'Noma\'lum').slice(0, 100)}</code>\n` +
    `⏰ <b>Vaqt:</b> ${timeStr}\n\n` +
    `🔒 <i>Abdugofforov Cloudflare Edge WAF tomonidan to'xtatildi.</i>`;

  const sendPromise = fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  }).catch(() => {});

  if (context.waitUntil) {
    context.waitUntil(sendPromise);
  } else {
    await sendPromise;
  }
}




