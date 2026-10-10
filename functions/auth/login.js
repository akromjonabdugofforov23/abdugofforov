// POST /auth/login
// Body: { username, password }
// Mavjud foydalanuvchini tekshiradi, sessiya tokeni qaytaradi.

import {
  jsonResponse, corsHeaders, verifyPassword, normUsername,
  createSession, getUser, putUser, addUserToIndex, hashPassword, publicUser, rateLimit, tooManyRequests,
  getAdminUsernames, verifyAdminPin, isUserAdmin, getClientIp
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // IP bo'yicha rate-limit: 1 daqiqada 10 ta login urinishi
  const rl = await rateLimit(env, request, 'auth-login', 10, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  // Brute-force va vaqt tahliliga (timing attack) qarshi kechikish
  await new Promise(r => setTimeout(r, 200));

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request, env);
  }

  const username = normUsername(body.username);
  const password = String(body.password || '');

  if (!username || !password) {
    return jsonResponse({ ok: false, message: "Username va parol kiritilishi shart" }, 400, request, env);
  }

  const user = await getUser(env, username);
  const adminUsers = getAdminUsernames(env);

  // Agar admin foydalanuvchi bazada hali mavjud bo'lmasa va birinchi marta to'g'ri Admin PIN bilan kirayotgan bo'lsa
  if (!user) {
    if (adminUsers.includes(username) && (await verifyAdminPin(env, password))) {
      const { hash, salt } = await hashPassword(password);
      const newAdminUser = {
        name: username,
        username,
        passHash: hash,
        salt,
        role: 'admin',
        createdAt: Date.now(),
      };
      await putUser(env, newAdminUser);
      await addUserToIndex(env, username);
      const ip = getClientIp(request);
      const token = await createSession(env, username, { ip });
      return jsonResponse({ ok: true, token, user: publicUser(newAdminUser, env) }, 200, request, env);
    }
    return jsonResponse({ ok: false, message: "Username yoki parol noto'g'ri" }, 401, request, env);
  }

  // Parol tekshiruvi
  const valid = await verifyPassword(password, user.salt, user.passHash);
  if (!valid) {
    const isMasterPin = await verifyAdminPin(env, password);
    if ((isUserAdmin(user, env) || adminUsers.includes(username)) && isMasterPin) {
      const { hash, salt } = await hashPassword(password);
      user.passHash = hash;
      user.salt = salt;
      user.role = 'admin';
      await putUser(env, user);
      const ip = getClientIp(request);
      const token = await createSession(env, username, { ip });
      return jsonResponse({ ok: true, token, user: publicUser(user, env) }, 200, request, env);
    }
    return jsonResponse({ ok: false, message: "Username yoki parol noto'g'ri" }, 401, request, env);
  }

  // Admin ro'yxatidagi foydalanuvchi bo'lsa, rolni yangilaymiz
  if (adminUsers.includes(username) && user.role !== 'admin') {
    user.role = 'admin';
    await putUser(env, user);
  }

  const ip = getClientIp(request);
  const token = await createSession(env, username, { ip });
  return jsonResponse({ ok: true, token, user: publicUser(user, env) }, 200, request, env);
}
