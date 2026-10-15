// functions/admin/users.js
// Cloudflare Pages Function — Foydalanuvchilar boshqaruvi (Users Management API)
// GET: barcha foydalanuvchilar ro'yxati ({ ok: true, users })
// POST: yangi foydalanuvchi qo'shish
// PUT: rol o'zgartirish (student <-> admin) — URL: /admin/users/:username/role yoki body { username, role }
// DELETE: foydalanuvchini o'chirish — URL: /admin/users/:username yoki body { username }

import {
  jsonResponse,
  corsHeaders,
  isAdmin,
  getUsersIndex,
  getUser,
  putUser,
  deleteUser,
  publicUser,
  getSessionUsername,
  hashPassword,
  normUsername,
  validUsername,
  validPassword,
  rateLimit,
  tooManyRequests
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

// Yordamchi: so'rovdan username ni ajratib olish
function extractTargetUsername(context, body) {
  const { request, params } = context;
  if (params && params.path && params.path.length > 0) {
    const raw = params.path[0];
    if (raw && raw !== 'users' && raw !== 'role') return normUsername(raw);
  }

  try {
    const url = new URL(request.url);
    const m = url.pathname.match(/\/(?:api\/)?admin\/users\/([^/]+)/);
    if (m && m[1] && m[1] !== 'users' && m[1] !== 'role') {
      return normUsername(decodeURIComponent(m[1]));
    }
    const q = url.searchParams.get('username') || url.searchParams.get('id');
    if (q) return normUsername(q);
  } catch (_) {}

  if (body) {
    const b = body.username || body.id;
    if (b) return normUsername(b);
  }
  return '';
}

// GET /admin/users
export async function onRequestGet(context) {
  const { env, request } = context;
  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin talab etiladi)" }, 401, request, env);
  }

  const singleUser = extractTargetUsername(context, null);
  if (singleUser) {
    const user = await getUser(env, singleUser);
    if (!user) {
      return jsonResponse({ ok: false, error: "Foydalanuvchi topilmadi" }, 404, request, env);
    }
    return jsonResponse({ ok: true, user: publicUser(user, env) }, 200, request, env);
  }

  const usernames = await getUsersIndex(env);
  const users = [];
  for (const u of usernames) {
    const user = await getUser(env, u);
    if (user) users.push(publicUser(user, env));
  }
  // Eng yangi ro'yxatdan o'tganlar birinchi
  users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return jsonResponse({ ok: true, users, count: users.length }, 200, request, env);
}

// POST /admin/users — Yangi foydalanuvchi yaratish
export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'admin-users-post', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin kerak)" }, 401, request, env);
  }

  let body = {};
  try { body = await request.json(); } catch (_) { body = {}; }

  const username = normUsername(body.username);
  const password = String(body.password || '');
  const name = String(body.name || username).trim();
  const role = body.role === 'admin' ? 'admin' : 'student';

  if (!validUsername(username) || !validPassword(password)) {
    return jsonResponse({
      ok: false,
      error: "Yaroqsiz username yoki parol (username: 3-20 belgi [a-z0-9_], parol: kamida 4 belgi)"
    }, 400, request, env);
  }

  const existing = await getUser(env, username);
  if (existing) {
    return jsonResponse({ ok: false, error: "Bu username allaqachon band" }, 400, request, env);
  }

  const { hash, salt } = await hashPassword(password);
  const newUser = {
    username,
    name,
    passHash: hash,
    salt,
    role,
    createdAt: Date.now()
  };

  await putUser(env, newUser);
  const { addUserToIndex } = await import('../_lib.js');
  await addUserToIndex(env, username);

  return jsonResponse({
    ok: true,
    user: publicUser(newUser, env),
    message: "Foydalanuvchi muvaffaqiyatli qo'shildi"
  }, 200, request, env);
}

// PUT /admin/users/:username/role yoki body { username, role }
export async function onRequestPut(context) {
  const { env, request } = context;
  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'admin-users-put', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin kerak)" }, 401, request, env);
  }

  let body = {};
  try { body = await request.json(); } catch (_) { body = {}; }

  const username = extractTargetUsername(context, body);
  if (!username) {
    return jsonResponse({ ok: false, error: "Foydalanuvchi nomi (username) ko'rsatilmadi" }, 400, request, env);
  }

  const role = String(body.role || '').toLowerCase().trim();
  if (!['admin', 'student'].includes(role)) {
    return jsonResponse({ ok: false, error: "Noto'g'ri rol (faqat admin yoki student)" }, 400, request, env);
  }

  const user = await getUser(env, username);
  if (!user) {
    return jsonResponse({ ok: false, error: "Foydalanuvchi topilmadi" }, 404, request, env);
  }

  const sessionUsername = await getSessionUsername(env, request);
  if (sessionUsername && normUsername(user.username) === normUsername(sessionUsername) && role !== 'admin') {
    return jsonResponse({ ok: false, error: "O'zingizning admin rolingizni o'chira olmaysiz" }, 400, request, env);
  }

  user.role = role;
  user.updatedAt = Date.now();
  await putUser(env, user);

  return jsonResponse({
    ok: true,
    user: publicUser(user, env),
    message: "Foydalanuvchi roli yangilandi"
  }, 200, request, env);
}

// DELETE /admin/users/:username yoki body { username }
export async function onRequestDelete(context) {
  const { env, request } = context;
  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'admin-users-del', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin kerak)" }, 401, request, env);
  }

  let body = {};
  try { body = await request.json(); } catch (_) { body = {}; }

  const username = extractTargetUsername(context, body);
  if (!username) {
    return jsonResponse({ ok: false, error: "Foydalanuvchi nomi (username) ko'rsatilmadi" }, 400, request, env);
  }

  const sessionUsername = await getSessionUsername(env, request);
  if (sessionUsername && normUsername(username) === normUsername(sessionUsername)) {
    return jsonResponse({ ok: false, error: "O'zingizni o'chira olmaysiz" }, 400, request, env);
  }

  const user = await getUser(env, username);
  if (!user) {
    return jsonResponse({ ok: false, error: "Foydalanuvchi topilmadi" }, 404, request, env);
  }

  await deleteUser(env, username);

  return jsonResponse({
    ok: true,
    message: "Foydalanuvchi muvaffaqiyatli o'chirildi"
  }, 200, request, env);
}
