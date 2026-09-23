// Cloudflare Pages Function — Postlar uchun umumiy ombor (KV asosida)
//
// Endpointlar:
//   GET  /posts          -> hammaga ochiq, JSON array qaytaradi
//   PUT  /posts          -> butun ro'yxatni almashtirish (faqat admin)
//
// Auth: x-admin-token (Telegram 2FA dan keyin) yoki, Telegram sozlanmagan
// bo'lsa, x-admin-pin. PIN hashi ENV (ADMIN_PIN_HASH) dan olinadi.

import {
  jsonResponse, corsHeaders, verifyAdminPin, rateLimit, tooManyRequests, isAdmin
} from './_lib.js';

const KV_KEY = 'posts:list';
const MAX_BYTES = 24 * 1024 * 1024; // 24MB — KV qiymat chegarasidan ehtiyot

// Auth: Admin sessiyasi (x-user-token), x-admin-token yoki x-admin-pin
async function isAuthorized(request, env) {
  return await isAdmin(env, request);
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

// GET /posts — barchaga ochiq
export async function onRequestGet(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    return jsonResponse({ posts: [], configured: false }, 200, request, env);
  }

  try {
    const raw = await env.POSTS_KV.get(KV_KEY);
    const posts = raw ? JSON.parse(raw) : [];
    return jsonResponse({ posts, configured: true }, 200, request, env);
  } catch (e) {
    return jsonResponse({ posts: [], configured: true, error: 'read_failed' }, 200, request, env);
  }
}

// PUT /posts — faqat admin
export async function onRequestPut(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    return jsonResponse(
      { ok: false, configured: false, message: 'KV (POSTS_KV) bog\'lanmagan' },
      503, request, env
    );
  }

  // IP bo'yicha rate-limit: daqiqada 20 ta yozish urinishi
  const rl = await rateLimit(env, request, 'posts-put', 20, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const authorized = await isAuthorized(request, env);
  if (!authorized) {
    const tgConfigured = !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
    return jsonResponse({
      ok: false,
      message: tgConfigured
        ? "Ruxsat berilmadi. Telegram orqali admin panelga qayta kiring."
        : "Ruxsat berilmadi"
    }, 401, request, env);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, message: 'Noto\'g\'ri JSON' }, 400, request, env);
  }

  const posts = Array.isArray(body && body.posts) ? body.posts : null;
  if (!posts) {
    return jsonResponse({ ok: false, message: 'posts massivi kerak' }, 400, request, env);
  }

  // Soddalashtirilgan tekshiruv: har post obyekti bo'lishi shart
  const cleaned = posts.filter(p => p && typeof p === 'object' && p.id != null && typeof p.title === 'string');

  const serialized = JSON.stringify(cleaned);
  if (serialized.length > MAX_BYTES) {
    return jsonResponse(
      { ok: false, message: 'Ma\'lumot juda katta (24MB chegara). Rasmlarni kichraytiring.' },
      413, request, env
    );
  }

  try {
    await env.POSTS_KV.put(KV_KEY, serialized);
    return jsonResponse({ ok: true, count: cleaned.length }, 200, request, env);
  } catch (e) {
    return jsonResponse({ ok: false, message: 'Saqlashda xato' }, 500, request, env);
  }
}
