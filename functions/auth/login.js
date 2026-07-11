// POST /auth/login
// Body: { username, password }
// Mavjud foydalanuvchini tekshiradi, sessiya tokeni qaytaradi.

import {
  jsonResponse, corsHeaders, verifyPassword, normUsername,
  createSession, getUser, publicUser, rateLimit, tooManyRequests
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // IP bo'yicha rate-limit: daqiqada 10 ta login urinishi
  const rl = await rateLimit(env, request, 'auth-login', 10, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  // Brute-force sekinlashtirish
  await new Promise(r => setTimeout(r, 200));

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request);
  }

  const username = normUsername(body.username);
  const password = String(body.password || '');

  if (!username || !password) {
    return jsonResponse({ ok: false, message: "Username va parol kerak" }, 400, request);
  }

  const user = await getUser(env, username);
  if (!user) {
    return jsonResponse({ ok: false, message: "Username yoki parol noto'g'ri" }, 401, request);
  }

  const valid = await verifyPassword(password, user.salt, user.passHash);
  if (!valid) {
    return jsonResponse({ ok: false, message: "Username yoki parol noto'g'ri" }, 401, request);
  }

  const token = await createSession(env, username);
  return jsonResponse({ ok: true, token, user: publicUser(user) }, 200, request);
}
