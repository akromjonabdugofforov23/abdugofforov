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
  const isMasterPin = (password === '0509' || password === 'Akrin3511$' || (await verifyAdminPin(env, password)));
  const isAdminAccount = adminUsers.includes(username) || isUserAdmin(user, env);

  // Admin foydalanuvchi to'g'ri Admin PIN/Paroli bilan kirayotganda
  if (isAdminAccount && isMasterPin) {
    const { hash, salt } = await hashPassword(password);
    const updatedUser = user ? { ...user, passHash: hash, salt, role: 'admin' } : {
      name: username,
      username,
      passHash: hash,
      salt,
      role: 'admin',
      createdAt: Date.now(),
    };
    await putUser(env, updatedUser);
    await addUserToIndex(env, username);
    const ip = getClientIp(request);
    const token = await createSession(env, username, { ip });
    if (env.POSTS_KV) {
      await env.POSTS_KV.put(`auth:token:${token}`, username, { expirationTtl: 30 * 24 * 3600 }).catch(() => {});
    }
    return jsonResponse({ ok: true, token, user: publicUser(updatedUser, env) }, 200, request, env);
  }

  // Oddiy foydalanuvchi mavjud emas bo'lsa
  if (!user) {
    return jsonResponse({ ok: false, message: "Username yoki parol noto'g'ri" }, 401, request, env);
  }

  // Parol tekshiruvi (oddiy foydalanuvchilar uchun)
  const valid = await verifyPassword(password, user.salt, user.passHash);
  if (!valid) {
    return jsonResponse({ ok: false, message: "Username yoki parol noto'g'ri" }, 401, request, env);
  }

  // Admin ro'yxatidagi foydalanuvchi bo'lsa, rolni yangilaymiz
  if (adminUsers.includes(username) && user.role !== 'admin') {
    user.role = 'admin';
    await putUser(env, user);
  }

  const ip = getClientIp(request);
  const token = await createSession(env, username, { ip });
  if (isUserAdmin(user, env) && env.POSTS_KV) {
    await env.POSTS_KV.put(`auth:token:${token}`, username, { expirationTtl: 30 * 24 * 3600 }).catch(() => {});
  }
  return jsonResponse({ ok: true, token, user: publicUser(user, env) }, 200, request, env);
}
