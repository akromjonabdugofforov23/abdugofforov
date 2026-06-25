// GET /admin/users
// Header: x-admin-token (yoki Telegram sozlanmagan bo'lsa x-admin-pin)
// Barcha ro'yxatdan o'tgan foydalanuvchilarni qaytaradi (parolsiz).

import {
  jsonResponse, corsHeaders, isAdmin, getUsersIndex, getUser, publicUser
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request);
  }

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, message: "Ruxsat berilmadi (admin kerak)" }, 401, request);
  }

  const usernames = await getUsersIndex(env);
  const users = [];
  for (const u of usernames) {
    const user = await getUser(env, u);
    if (user) users.push(publicUser(user));
  }
  // Eng yangi ro'yxatdan o'tganlar birinchi
  users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return jsonResponse({ ok: true, users, count: users.length }, 200, request);
}
