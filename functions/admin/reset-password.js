// POST /admin/reset-password
// Header: x-admin-token yoki x-admin-pin
// Body: { username, newPassword }
// Foydalanuvchi parolini yangilash (faqat admin uchun)

import {
  jsonResponse, corsHeaders, isAdmin, getUser, putUser, hashPassword, normUsername,
  rateLimit, tooManyRequests
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // IP bo'yicha rate-limit: 5 daqiqada 10 ta parol tiklash urinishi
  const rl = await rateLimit(env, request, 'admin-reset-pw', 10, 300);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, message: "Ruxsat berilmadi (admin talab etiladi)" }, 401, request, env);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov formati" }, 400, request, env);
  }

  const username = normUsername(body.username);
  const newPassword = String(body.newPassword || '');

  if (!username) {
    return jsonResponse({ ok: false, message: "Username ko'rsatilmadi" }, 400, request, env);
  }

  if (!newPassword || newPassword.length < 6) {
    return jsonResponse({ ok: false, message: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak" }, 400, request, env);
  }

  const user = await getUser(env, username);
  if (!user) {
    return jsonResponse({ ok: false, message: "Foydalanuvchi topilmadi" }, 404, request, env);
  }

  // Yangi parolni PBKDF2 bilan hashlash
  const { hash, salt } = await hashPassword(newPassword);
  user.passHash = hash;
  user.salt = salt;
  user.passwordUpdatedAt = Date.now();

  await putUser(env, user);

  return jsonResponse({
    ok: true,
    message: `@${username} uchun yangi parol muvaffaqiyatli saqlandi`
  }, 200, request, env);
}
