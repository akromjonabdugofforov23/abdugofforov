// POST /auth/register
// Body: { name, username, password, adminPin }
// Yangi foydalanuvchi yaratadi, sessiya tokeni qaytaradi.

import {
  jsonResponse, corsHeaders, hashPassword, normUsername, validUsername, validPassword,
  createSession, getUser, putUser, addUserToIndex, publicUser, rateLimit, tooManyRequests,
  getAdminUsernames, verifyAdminPin, getClientIp
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // IP bo'yicha qat'iy rate-limit: 10 daqiqada 5 ta ro'yxatdan o'tish urinishi
  const rl = await rateLimit(env, request, 'auth-register', 5, 600);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  // Brute-force sekinlashtirish
  await new Promise(r => setTimeout(r, 150));

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request, env);
  }

  const name = String(body.name || '').trim().slice(0, 50);
  const username = normUsername(body.username);
  const password = String(body.password || '');
  const adminPin = String(body.adminPin || body.pin || '').trim();

  if (!name || name.length < 2) {
    return jsonResponse({ ok: false, message: "Ism kamida 2 ta belgi bo'lishi kerak" }, 400, request, env);
  }
  if (!validUsername(username)) {
    return jsonResponse({ ok: false, message: "Username 3-20 ta belgi: faqat a-z, 0-9, _" }, 400, request, env);
  }
  if (!validPassword(password)) {
    return jsonResponse({ ok: false, message: "Parol kamida 4 ta belgidan iborat bo'lishi kerak" }, 400, request, env);
  }

  // XAVFSIZLIK: Mavjud hisobni hech qachon ustidan yozib (account takeover) bo'lmaydi!
  const existing = await getUser(env, username);
  if (existing) {
    return jsonResponse({ ok: false, message: "Bu username band. Boshqasini tanlang." }, 409, request, env);
  }

  // Admin huquqini tekshirish
  const adminUsers = getAdminUsernames(env);
  let isAdminUser = false;

  if (adminUsers.includes(username)) {
    if (!adminPin || !(await verifyAdminPin(env, adminPin))) {
      return jsonResponse({
        ok: false,
        needsAdminPin: true,
        message: "Ushbu admin profilini ro'yxatdan o'tkazish uchun to'g'ri Admin PIN kodini kiriting."
      }, 403, request, env);
    }
    isAdminUser = true;
  }

  const { hash, salt } = await hashPassword(password);
  const ip = getClientIp(request);
  const user = {
    name,
    username,
    passHash: hash,
    salt,
    role: isAdminUser ? 'admin' : 'student',
    createdAt: Date.now(),
  };

  await putUser(env, user);
  await addUserToIndex(env, username);

  // Adminga Telegram orqali bildirishnoma yuborish (notifyNewUser mantiqi)
  const tgToken = env.TELEGRAM_BOT_TOKEN;
  const tgChatId = env.TELEGRAM_ADMIN_CHAT_ID || env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChatId) {
    let timeStr;
    try {
      timeStr = new Date().toLocaleString('uz-UZ');
    } catch (_) {
      timeStr = new Date().toISOString();
    }
    const text = `👤 <b>Yangi Foydalanuvchi Ro'yxatdan O'tdi!</b>\n\n` +
                 `▫️ <b>Ism:</b> ${user.name || 'Noma\'lum'}\n` +
                 `▫️ <b>Username:</b> @${user.username}\n` +
                 `▫️ <b>Rol:</b> ${user.role}\n` +
                 `▫️ <b>Vaqt:</b> ${timeStr}`;
    const notifyPromise = fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: tgChatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    }).catch(() => {});

    if (context && typeof context.waitUntil === 'function') {
      context.waitUntil(notifyPromise);
    }
  }

  const token = await createSession(env, username, { ip });
  return jsonResponse({ ok: true, token, user: publicUser(user, env) }, 200, request, env);
}
