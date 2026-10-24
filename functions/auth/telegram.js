// POST /auth/telegram
// Telegram OAuth Widget YOKI Telegram Mini App (WebAppData) ma'lumotlarini qabul qiladi.
// Cloudflare'dagi TELEGRAM_BOT_TOKEN yordamida HMAC-SHA256 hash imzosisini qat'iy tekshiradi!

import {
  jsonResponse, corsHeaders, normUsername, timingSafeEqual,
  createSession, getUser, putUser, addUserToIndex, publicUser, rateLimit, tooManyRequests,
  getClientIp
} from '../_lib.js';

// 1. Telegram Login Widget HMAC-SHA256 tekshiruvi (secret_key = SHA256(botToken))
async function verifyTelegramWidgetHash(tgData, botToken) {
  if (!botToken || !tgData || !tgData.hash) return false;
  
  const { hash, ...data } = tgData;
  const dataCheckString = Object.keys(data)
    .filter(k => data[k] !== undefined && data[k] !== null && data[k] !== '')
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');
    
  const encoder = new TextEncoder();
  const secretKeyBuf = await crypto.subtle.digest('SHA-256', encoder.encode(botToken));
  const hmacKey = await crypto.subtle.importKey(
    'raw', secretKeyBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signatureBuf = await crypto.subtle.sign('HMAC', hmacKey, encoder.encode(dataCheckString));
  const calculatedHash = Array.from(new Uint8Array(signatureBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return timingSafeEqual(calculatedHash.toLowerCase(), String(hash).toLowerCase());
}

// 2. Telegram Mini App (WebAppData) HMAC-SHA256 tekshiruvi (secret_key = HMAC("WebAppData", botToken))
async function verifyTelegramMiniAppInitData(initDataRaw, botToken) {
  if (!botToken || !initDataRaw || typeof initDataRaw !== 'string') return null;

  try {
    const params = new URLSearchParams(initDataRaw);
    const hash = params.get('hash');
    if (!hash) return null;

    // auth_date tekshiruvi (24 soat)
    const authDate = params.get('auth_date');
    if (authDate) {
      const authTime = parseInt(authDate, 10);
      const nowSec = Math.floor(Date.now() / 1000);
      if (isNaN(authTime) || Math.abs(nowSec - authTime) > 86400) {
        return { error: 'Eskirgan autentifikatsiya ma\'lumoti' };
      }
    }

    // Hash'dan boshqa barcha parametrlarni alifbo tartibida saralaymiz
    const pairs = [];
    params.forEach((value, key) => {
      if (key !== 'hash') {
        pairs.push(`${key}=${value}`);
      }
    });
    pairs.sort();
    const dataCheckString = pairs.join('\n');

    const encoder = new TextEncoder();
    // 1-qadam: secret_key = HMAC_SHA256("WebAppData", botToken)
    const webAppDataKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode('WebAppData'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const secretKeyBuf = await crypto.subtle.sign('HMAC', webAppDataKey, encoder.encode(botToken));

    // 2-qadam: calculated_hash = HMAC_SHA256(secret_key, dataCheckString)
    const hmacKey = await crypto.subtle.importKey(
      'raw',
      secretKeyBuf,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBuf = await crypto.subtle.sign('HMAC', hmacKey, encoder.encode(dataCheckString));
    const calculatedHash = Array.from(new Uint8Array(signatureBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

    const isValid = timingSafeEqual(calculatedHash.toLowerCase(), hash.toLowerCase());
    if (!isValid) return null;

    // User ma'lumotini JSON dan ajratamiz
    const userStr = params.get('user');
    let userObj = null;
    if (userStr) {
      try { userObj = JSON.parse(userStr); } catch (_) {}
    }

    return {
      isValid: true,
      user: userObj,
      authDate,
      queryId: params.get('query_id')
    };
  } catch (err) {
    return null;
  }
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // Telegram bot tokeni bo'lishi shart (faqat Cloudflare Environment Variable orqali olinadi)
  const botToken = env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return jsonResponse({
      ok: false,
      message: "Telegram autentifikatsiyasi serverda sozlanmagan (TELEGRAM_BOT_TOKEN muhit o'zgaruvchisi topilmadi)."
    }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'auth-telegram', 25, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request, env);
  }

  let tgUser = null;

  // A) Telegram Mini App (initData) orqali kirish
  if (body.initData && typeof body.initData === 'string') {
    const verified = await verifyTelegramMiniAppInitData(body.initData, botToken);
    if (!verified || !verified.isValid) {
      return jsonResponse({
        ok: false,
        message: verified?.error || "Telegram Mini App autentifikatsiyasi tasdiqlanmadi (imzo noto'g'ri)!"
      }, 401, request, env);
    }
    tgUser = verified.user;
    if (!tgUser) {
      return jsonResponse({ ok: false, message: "Telegram foydalanuvchi ma'lumoti topilmadi" }, 400, request, env);
    }
  } 
  // B) Telegram Login Widget orqali kirish
  else {
    const tgData = body.user || body;
    if (!tgData || (!tgData.id && !tgData.username && !tgData.first_name)) {
      return jsonResponse({ ok: false, message: "Telegram ma'lumotlari yetarsiz" }, 400, request, env);
    }

    if (!tgData.hash) {
      return jsonResponse({
        ok: false,
        message: "Xavfsizlik xatosi: Telegram imzosi (hash) topilmadi!"
      }, 401, request, env);
    }

    if (tgData.auth_date) {
      const authTime = parseInt(tgData.auth_date, 10);
      const nowSec = Math.floor(Date.now() / 1000);
      if (isNaN(authTime) || Math.abs(nowSec - authTime) > 86400) {
        return jsonResponse({
          ok: false,
          message: "Telegram autentifikatsiya muddati eskirgan. Qaytadan urinib ko'ring."
        }, 401, request, env);
      }
    }

    const isVerified = await verifyTelegramWidgetHash(tgData, botToken);
    if (!isVerified) {
      return jsonResponse({
        ok: false,
        message: "Telegram autentifikatsiya xatosi: Telegram ma'lumotlari haqiqiy emas yoki o'zgartirilgan!"
      }, 401, request, env);
    }

    tgUser = tgData;
  }

  const rawUsername = tgUser.username || ('tg_' + tgUser.id);
  const username = normUsername(rawUsername).replace(/[^a-z0-9_]/g, '_').slice(0, 20);

  let name = (tgUser.first_name || '') + (tgUser.last_name ? (' ' + tgUser.last_name) : '');
  if (!name.trim()) name = tgUser.name || username;
  name = name.trim().slice(0, 50);

  const isAdminTg = Boolean(env.TELEGRAM_CHAT_ID && tgUser.id && String(tgUser.id) === String(env.TELEGRAM_CHAT_ID));

  let user = await getUser(env, username);
  if (!user) {
    user = {
      name,
      username,
      tgId: tgUser.id || null,
      photo: tgUser.photo_url || tgUser.photo || '',
      provider: 'telegram',
      role: isAdminTg ? 'admin' : 'student',
      verified: true,
      createdAt: Date.now()
    };
    await putUser(env, user);
    await addUserToIndex(env, username);
  } else {
    user.name = name || user.name;
    if (tgUser.photo_url || tgUser.photo) user.photo = tgUser.photo_url || tgUser.photo;
    user.provider = 'telegram';
    if (tgUser.id) user.tgId = tgUser.id;
    if (isAdminTg) user.role = 'admin';
    user.verified = true;
    await putUser(env, user);
  }

  const ip = getClientIp(request);
  const token = await createSession(env, username, { ip, tgId: tgUser.id });
  return jsonResponse({ ok: true, token, user: publicUser(user, env) }, 200, request, env);
}
