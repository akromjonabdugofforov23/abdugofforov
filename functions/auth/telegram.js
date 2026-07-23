// POST /auth/telegram
// Body: { id, first_name, last_name, username, photo_url, hash, auth_date }
// Telegram 1-Click login orqali kelgan foydalanuvchini serverda ro'yxatga oladi/sessiya yaratadi.

import {
  jsonResponse, corsHeaders, normUsername,
  createSession, getUser, putUser, addUserToIndex, publicUser, rateLimit, tooManyRequests
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // Rate limit
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

  const rawUsername = tgData.username || ('tg_' + (tgData.id || Math.floor(Math.random() * 89999999 + 10000000)));
  const username = normUsername(rawUsername).replace(/[^a-z0-9_]/g, '_').slice(0, 20);

  let name = '';
  if (tgData.first_name || tgData.last_name) {
    name = (tgData.first_name || '') + (tgData.last_name ? (' ' + tgData.last_name) : '');
  } else if (tgData.name) {
    name = tgData.name;
  } else {
    name = username;
  }
  name = name.trim().slice(0, 50);

  let user = await getUser(env, username);
  if (!user) {
    user = {
      name,
      username,
      tgId: tgData.id || null,
      photo: tgData.photo_url || tgData.photo || '',
      provider: 'telegram',
      createdAt: Date.now()
    };
    await putUser(env, user);
    await addUserToIndex(env, username);
  } else {
    // Profil ma'lumotlarini yangilash
    user.name = name || user.name;
    if (tgData.photo_url || tgData.photo) user.photo = tgData.photo_url || tgData.photo;
    user.provider = 'telegram';
    if (tgData.id) user.tgId = tgData.id;
    await putUser(env, user);
  }

  const token = await createSession(env, username);
  return jsonResponse({ ok: true, token, user: publicUser(user) }, 200, request);
}
