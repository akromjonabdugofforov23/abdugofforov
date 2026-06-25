// GET /auth/me
// Header: x-user-token yoki Authorization: Bearer <token>
// Joriy foydalanuvchini qaytaradi (token amal qilsa).

import {
  jsonResponse, corsHeaders, getSessionUsername, getUser, publicUser
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request);
  }

  const username = await getSessionUsername(env, request);
  if (!username) {
    return jsonResponse({ ok: false, message: "Tizimga kirilmagan" }, 401, request);
  }

  const user = await getUser(env, username);
  if (!user) {
    return jsonResponse({ ok: false, message: "Foydalanuvchi topilmadi" }, 404, request);
  }

  return jsonResponse({ ok: true, user: publicUser(user) }, 200, request);
}
