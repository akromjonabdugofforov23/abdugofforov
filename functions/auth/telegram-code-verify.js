// POST /auth/telegram-code-verify
// Body: { target: "...", code: "123456" }
// 6-xonali Telegram kodini tekshiradi, foydalanuvchini ro'yxatga oladi va sessiya qaytaradi.

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
    return jsonResponse({ ok: false, message: "KV ombori bog'lanmagan." }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'tg-code-verify', 10, 300);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request, env);
  }

  const target = String(body.target || '').replace('@', '').trim();
  const code = String(body.code || '').trim();

  if (!target || !code || code.length !== 6) {
    return jsonResponse({ ok: false, message: "Chat ID va 6-xonali kod kerak" }, 400, request, env);
  }

  const kvKey = `auth:tgcode:${target}`;
  let rawData = null;
  try {
    const raw = await env.POSTS_KV.get(kvKey);
    rawData = raw ? JSON.parse(raw) : null;
  } catch (e) { rawData = null; }

  if (!rawData) {
    return jsonResponse({ ok: false, message: "Kod muddati o'tgan yoki so'ralmagan. Qayta kod oling." }, 400, request, env);
  }

  if (rawData.attempts >= 5) {
    await env.POSTS_KV.delete(kvKey).catch(() => {});
    return jsonResponse({ ok: false, message: "Urinishlar soni tugadi. Qayta kod so'rang." }, 429, request, env);
  }

  if (rawData.code !== code) {
    rawData.attempts += 1;
    await env.POSTS_KV.put(kvKey, JSON.stringify(rawData), { expirationTtl: 300 }).catch(() => {});
    return jsonResponse({ ok: false, message: "Kiritilgan kod noto'g'ri!" }, 400, request, env);
  }

  // Kod to'g'ri — KV dan kodni o'chiramiz
  await env.POSTS_KV.delete(kvKey).catch(() => {});

  const username = normUsername('tg_' + target).slice(0, 20);
  const name = 'Telegram User (' + target + ')';

  let user = await getUser(env, username);
  if (!user) {
    user = {
      name,
      username,
      tgId: target,
      provider: 'telegram',
      verified: true,
      createdAt: Date.now()
    };
    await putUser(env, user);
    await addUserToIndex(env, username);
  } else {
    user.verified = true;
    await putUser(env, user);
  }

  const token = await createSession(env, username);
  return jsonResponse({ ok: true, token, user: publicUser(user) }, 200, request, env);
}
