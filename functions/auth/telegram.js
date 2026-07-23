// POST /auth/telegram
// Telegram OAuth Widget yoki Telegram WebApp (Mini App) ma'lumotlarini qabul qiladi.
// Cloudflare'dagi TELEGRAM_BOT_TOKEN yordamida HMAC-SHA256 hash imzosisini tekshiradi!

import {
  jsonResponse, corsHeaders, normUsername,
  createSession, getUser, putUser, addUserToIndex, publicUser, rateLimit, tooManyRequests
} from '../_lib.js';

// Telegram HMAC-SHA256 cryptographic hash tekshiruvi
async function verifyTelegramHash(tgData, botToken) {
  if (!botToken || !tgData || !tgData.hash) return false;
  
  const { hash, ...data } = tgData;
  // Kalitlarni alifbo tartibida saralab string yasaymiz
  const dataCheckString = Object.keys(data)
    .filter(k => data[k] !== undefined && data[k] !== null && data[k] !== '')
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');
    
  const encoder = new TextEncoder();
  // secret_key = SHA256(botToken)
  const secretKeyBuf = await crypto.subtle.digest('SHA-256', encoder.encode(botToken));
  const hmacKey = await crypto.subtle.importKey(
    'raw', secretKeyBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  // calculated_hash = HMAC-SHA256(secretKey, dataCheckString)
  const signatureBuf = await crypto.subtle.sign('HMAC', hmacKey, encoder.encode(dataCheckString));
  const calculatedHash = Array.from(new Uint8Array(signatureBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return calculatedHash.toLowerCase() === String(hash).toLowerCase();
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'auth-telegram', 15, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request);
  }

  const tgData = body.user || body;
  if (!tgData || (!tgData.id && !tgData.username && !tgData.first_name)) {
    return jsonResponse({ ok: false, message: "Telegram ma'lumotlari yetarsiz" }, 400, request);
  }

  // Real Telegram Hash Verification
  let isVerified = false;
  if (env.TELEGRAM_BOT_TOKEN && tgData.hash) {
    isVerified = await verifyTelegramHash(tgData, env.TELEGRAM_BOT_TOKEN);
    if (!isVerified) {
      return jsonResponse({
        ok: false,
        message: "Telegram autentifikatsiya xatosi: Telegram ma'lumotlari haqiqiy emas yoki o'zgartirilgan!"
      }, 401, request, env);
    }
  } else if (!env.TELEGRAM_BOT_TOKEN) {
    console.warn("⚠️ TELEGRAM_BOT_TOKEN sozlanmagan — Hash tekshiruvisiz autentifikatsiya qilindi.");
  }

  const rawUsername = tgData.username || ('tg_' + tgData.id);
  const username = normUsername(rawUsername).replace(/[^a-z0-9_]/g, '_').slice(0, 20);

  let name = (tgData.first_name || '') + (tgData.last_name ? (' ' + tgData.last_name) : '');
  if (!name.trim()) name = tgData.name || username;
  name = name.trim().slice(0, 50);

  let user = await getUser(env, username);
  if (!user) {
    user = {
      name,
      username,
      tgId: tgData.id || null,
      photo: tgData.photo_url || tgData.photo || '',
      provider: 'telegram',
      verified: isVerified,
      createdAt: Date.now()
    };
    await putUser(env, user);
    await addUserToIndex(env, username);
  } else {
    user.name = name || user.name;
    if (tgData.photo_url || tgData.photo) user.photo = tgData.photo_url || tgData.photo;
    user.provider = 'telegram';
    if (tgData.id) user.tgId = tgData.id;
    user.verified = isVerified;
    await putUser(env, user);
  }

  const token = await createSession(env, username);
  return jsonResponse({ ok: true, token, user: publicUser(user) }, 200, request);
}
