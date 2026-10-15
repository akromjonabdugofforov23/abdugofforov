// POST /auth/change-password
// Body: { oldPassword, newPassword }
// Header: x-user-token
// Foydalanuvchi joriy parolini tekshirib, yangi parolni xavfsiz saqlaydi (Cloudflare KV).

import {
  jsonResponse, corsHeaders, getSessionUsername, getUser, putUser, publicUser,
  verifyPassword, hashPassword, verifyAdminPin, isUserAdmin, rateLimit, tooManyRequests
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // Rate limiting: 10 ta urinish / 5 daqiqa
  const rl = await rateLimit(env, request, 'change-password', 10, 300);
  if (!rl.ok) {
    return tooManyRequests(request, rl.retryAfter, env);
  }

  const username = await getSessionUsername(env, request);
  if (!username) {
    return jsonResponse({ ok: false, message: "Tizimga kirilmagan" }, 401, request, env);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov formati" }, 400, request, env);
  }

  const oldPass = String(body.oldPassword || body.currentPassword || '');
  const newPass = String(body.newPassword || '');

  if (!oldPass || !newPass) {
    return jsonResponse({ ok: false, message: "Eski va yangi parolni kiriting" }, 400, request, env);
  }

  if (newPass.length < 6) {
    return jsonResponse({ ok: false, message: "Yangi parol kamida 6 belgidan iborat bo'lishi kerak" }, 400, request, env);
  }

  if (oldPass === newPass) {
    return jsonResponse({ ok: false, message: "Yangi parol eski paroldan farq qilishi kerak" }, 400, request, env);
  }

  const user = await getUser(env, username);
  if (!user) {
    return jsonResponse({ ok: false, message: "Foydalanuvchi topilmadi" }, 404, request, env);
  }

  // Eski parolni tekshirish (PBKDF2 va Admin PIN fallback)
  const passValid = await verifyPassword(oldPass, user.salt, user.passHash);
  const admin = isUserAdmin(user, env);
  let pinValid = false;
  if (!passValid && admin) {
    pinValid = await verifyAdminPin(env, oldPass);
  }

  if (!passValid && !pinValid) {
    return jsonResponse({ ok: false, message: "Joriy (eski) parol noto'g'ri" }, 400, request, env);
  }

  // Yangi parolni PBKDF2 bilan xesh qilish
  const hashed = await hashPassword(newPass);
  user.passHash = hashed.hash;
  user.salt = hashed.salt;
  user.algo = 'pbkdf2';

  await putUser(env, user);

  return jsonResponse({
    ok: true,
    message: "Parol muvaffaqiyatli yangilandi",
    user: publicUser(user, env)
  }, 200, request, env);
}
