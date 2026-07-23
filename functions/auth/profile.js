// POST /auth/profile
// Body: { name, photo }
// Header: x-user-token
// Foydalanuvchi ismi (nickname) va avatarini KV da update qiladi.

import {
  jsonResponse, corsHeaders, getSessionUsername, getUser, putUser, publicUser
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request);
  }

  const username = await getSessionUsername(env, request);
  if (!username) {
    return jsonResponse({ ok: false, message: "Tizimga kirilmagan" }, 401, request);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request);
  }

  const user = await getUser(env, username);
  if (!user) {
    return jsonResponse({ ok: false, message: "Foydalanuvchi topilmadi" }, 404, request);
  }

  if (body.name && typeof body.name === 'string') {
    user.name = body.name.trim().slice(0, 50);
  }
  if (body.photo !== undefined && typeof body.photo === 'string') {
    user.photo = body.photo.trim().slice(0, 300);
  }

  await putUser(env, user);
  return jsonResponse({ ok: true, user: publicUser(user) }, 200, request);
}
