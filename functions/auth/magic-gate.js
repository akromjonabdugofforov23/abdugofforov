// Cloudflare Pages Function — Stealth Admin Gate (/auth/magic-gate)
// Xavfsizlik xususiyatlari:
//  - Token yoki Admin PIN orqali autentifikatsiya
//  - Yashirin eshik: yaroqsiz so'rovlar hech qanday iz qoldirmasdan asosiy sahifaga yo'naltiriladi
//  - Timing hujumlariga qarshi doimiy vaqtli (constant-time) solishtirish
//  - IP bo'yicha rate-limiting va brute-force dan himoya

import {
  jsonResponse, corsHeaders, verifyAdminPin, createSession, getClientIp,
  rateLimit, tooManyRequests, getUser, putUser, addUserToIndex, timingSafeEqual,
  randomHex, publicUser
} from '../_lib.js';

const ADMIN_TOKEN_TTL = 8 * 3600; // 8 soat

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

async function validateSecret(env, candidate) {
  if (candidate === undefined || candidate === null) return false;
  const clean = String(candidate).trim();
  if (!clean || clean.length > 256) return false;

  // 1. Admin PIN tekshiruvi (hashlar va env)
  if (await verifyAdminPin(env, clean)) return true;

  // 2. Maxfiy tokenlar (env.MAGIC_GATE_TOKEN, env.ADMIN_TOKEN, env.MAGIC_TOKEN)
  const envTokens = [
    env && env.MAGIC_GATE_TOKEN,
    env && env.ADMIN_TOKEN,
    env && env.MAGIC_TOKEN
  ].filter(Boolean);

  for (const t of envTokens) {
    if (timingSafeEqual(clean, String(t).trim())) return true;
  }

  // 3. KV'dagi mavjud faol admin tokeni
  if (env && env.POSTS_KV && /^[a-f0-9]{32,128}$/.test(clean)) {
    try {
      const existingToken = await env.POSTS_KV.get(`auth:token:${clean}`);
      if (existingToken) return true;
      const existingSession = await env.POSTS_KV.get(`session:${clean}`);
      if (existingSession) {
        const parsed = JSON.parse(existingSession);
        if (parsed && (parsed.role === 'admin' || parsed.username === 'abdugofforov')) return true;
      }
    } catch (_) {}
  }

  return false;
}

async function issueAdminSession(env, request, context) {
  const token = randomHex(32);
  const ip = getClientIp(request);

  if (env && env.POSTS_KV) {
    try {
      await env.POSTS_KV.put(`auth:token:${token}`, JSON.stringify({
        createdAt: Date.now(),
        ip,
        source: 'magic-gate'
      }), { expirationTtl: ADMIN_TOKEN_TTL });

      await env.POSTS_KV.put(`session:${token}`, JSON.stringify({
        username: 'abdugofforov',
        role: 'admin',
        createdAt: Date.now(),
        ip
      }), { expirationTtl: 30 * 24 * 3600 });

      let user = await getUser(env, 'abdugofforov');
      if (!user) {
        user = {
          name: 'Abdugofforov',
          username: 'abdugofforov',
          role: 'admin',
          createdAt: Date.now()
        };
        await putUser(env, user);
        await addUserToIndex(env, 'abdugofforov');
      }
    } catch (_) {}
  }

  // Muvaffaqiyatli kirish haqida Telegram bildirishnomasi (silent)
  if (env && env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID && context && context.waitUntil) {
    const text =
      "⚡️ *Stealth Magic Gate orqali admin kirdi*\n\n" +
      "IP: `" + ip + "`\n" +
      "Vaqt: " + new Date().toISOString() + "\n" +
      "Muddati: 8 soat";
    context.waitUntil(
      fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      }).catch(() => {})
    );
  }

  return token;
}

export async function onRequestGet(context) {
  const { request, env } = context;

  // Rate limiting (1 daqiqada 10 urinish)
  const rl = await rateLimit(env, request, 'magic-gate', 10, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  await new Promise(r => setTimeout(r, 150));

  const url = new URL(request.url);
  const candidate = url.searchParams.get('token') || url.searchParams.get('pin') || url.searchParams.get('key') || '';
  const acceptHeader = request.headers.get('Accept') || '';
  const isHtmlRequest = acceptHeader.includes('text/html') && !acceptHeader.includes('application/json');

  const isValid = await validateSecret(env, candidate);

  if (isValid) {
    const token = await issueAdminSession(env, request, context);
    if (isHtmlRequest) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `/kay.html?token=${encodeURIComponent(token)}`,
          'Set-Cookie': `kay_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`
        }
      });
    }
    return jsonResponse({
      ok: true,
      success: true,
      token,
      redirectUrl: `/kay.html?token=${token}`
    }, 200, request, env);
  }

  // Yaroqsiz bo'lsa: HTML so'rov bo'lsa darhol / ga yo'naltirish (Stealth 404/silent redirect)
  if (isHtmlRequest) {
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/' }
    });
  }

  return jsonResponse({
    ok: false,
    success: false,
    message: "Noto'g'ri token yoki PIN-kod"
  }, 401, request, env);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'magic-gate', 10, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  await new Promise(r => setTimeout(r, 150));

  let body = {};
  try {
    body = await request.json();
  } catch (_) {}

  const url = new URL(request.url);
  const candidate = (body && (body.token || body.pin || body.adminPin || body.key)) ||
                    request.headers.get('x-admin-pin') || request.headers.get('x-pin') || request.headers.get('x-admin-token') ||
                    url.searchParams.get('token') || url.searchParams.get('pin') || '';
  const acceptHeader = request.headers.get('Accept') || '';
  const isHtmlRequest = acceptHeader.includes('text/html') && !acceptHeader.includes('application/json');

  const isValid = await validateSecret(env, candidate);

  if (isValid) {
    const token = await issueAdminSession(env, request, context);
    if (isHtmlRequest) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `/kay.html?token=${encodeURIComponent(token)}`,
          'Set-Cookie': `kay_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`
        }
      });
    }
    return jsonResponse({
      ok: true,
      success: true,
      token,
      user: {
        id: 'abdugofforov',
        name: "Abdug'afforov",
        username: 'abdugofforov',
        role: 'admin'
      },
      redirectUrl: `/kay.html?token=${token}`
    }, 200, request, env);
  }

  if (isHtmlRequest) {
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/' }
    });
  }

  return jsonResponse({
    ok: false,
    success: false,
    message: "Noto'g'ri token yoki PIN-kod"
  }, 401, request, env);
}
