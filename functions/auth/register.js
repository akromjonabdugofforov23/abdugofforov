// POST /auth/register
// Body: { name, username, password }
// Yangi foydalanuvchi yaratadi, sessiya tokeni qaytaradi.

import {
  jsonResponse, corsHeaders, hashPassword, normUsername, validUsername,
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

  // IP bo'yicha rate-limit: 10 daqiqada 5 ta ro'yxatdan o'tish urinishi
  const rl = await rateLimit(env, request, 'auth-register', 5, 600);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  // Brute-force sekinlashtirish
  await new Promise(r => setTimeout(r, 120));

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request);
  }

  const name = String(body.name || '').trim().slice(0, 50);
  const username = normUsername(body.username);
  const password = String(body.password || '');

  if (!name || name.length < 2) {
    return jsonResponse({ ok: false, message: "Ism kamida 2 ta belgi bo'lishi kerak" }, 400, request);
  }
  if (!validUsername(username)) {
    return jsonResponse({ ok: false, message: "Username 3-20 ta belgi: faqat a-z, 0-9, _" }, 400, request);
  }
  if (password.length < 6) {
    return jsonResponse({ ok: false, message: "Parol kamida 6 ta belgi bo'lishi kerak" }, 400, request);
  }

  const existing = await getUser(env, username);
  if (existing) {
    return jsonResponse({ ok: false, message: "Bu username band. Boshqasini tanlang." }, 409, request);
  }

  const { hash, salt } = await hashPassword(password);
  const user = {
    name, username, passHash: hash, salt,
    createdAt: Date.now(),
  };
  await putUser(env, user);
  await addUserToIndex(env, username);

  const token = await createSession(env, username);
  return jsonResponse({ ok: true, token, user: publicUser(user) }, 200, request);
}
