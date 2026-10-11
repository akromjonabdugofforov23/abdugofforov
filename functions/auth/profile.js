// POST /auth/profile
// Body: { name, photo }
// Header: x-user-token
// Foydalanuvchi ismi (nickname) va avatarini KV da yangilaydi.

import {
  jsonResponse, corsHeaders, getSessionUsername, getUser, putUser, publicUser,
  verifyPassword, hashPassword, verifyAdminPin, isUserAdmin
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  const username = await getSessionUsername(env, request);
  if (!username) {
    return jsonResponse({ ok: false, message: "Tizimga kirilmagan" }, 401, request, env);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request, env);
  }

  const user = await getUser(env, username);
  if (!user) {
    return jsonResponse({ ok: false, message: "Foydalanuvchi topilmadi" }, 404, request, env);
  }

  if (body.name && typeof body.name === 'string') {
    const trimmed = body.name.trim().slice(0, 50);
    if (trimmed) user.name = trimmed;
  }
  if (body.photo !== undefined && typeof body.photo === 'string') {
    user.photo = body.photo.trim().slice(0, 5000);
  }

  if (body.newPassword) {
    if (!body.currentPassword) {
      return jsonResponse({ ok: false, message: "Parolni o'zgartirish uchun joriy parolni kiriting" }, 400, request, env);
    }
    const passValid = await verifyPassword(body.currentPassword, user.salt, user.passHash);
    const admin = isUserAdmin(user, env);
    let pinValid = false;
    if (!passValid && admin) {
      pinValid = await verifyAdminPin(env, body.currentPassword);
    }
    if (!passValid && !pinValid) {
      return jsonResponse({ ok: false, message: "Joriy parol noto'g'ri" }, 400, request, env);
    }
    if (String(body.newPassword).length < 6) {
      return jsonResponse({ ok: false, message: "Yangi parol kamida 6 belgidan iborat bo'lishi kerak" }, 400, request, env);
    }
    const hashed = await hashPassword(String(body.newPassword));
    user.passHash = hashed.hash;
    user.salt = hashed.salt;
  }

  await putUser(env, user);
  return jsonResponse({ ok: true, user: publicUser(user, env) }, 200, request, env);
}
