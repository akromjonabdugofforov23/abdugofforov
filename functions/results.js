// functions/results.js
// Cloudflare Pages Function — Test Natijalari API (/results va /api/admin/results)
// POST   -> test natijasini saqlash (foydalanuvchi token bilan yoki mehmon)
// GET    -> barcha natijalar (faqat admin token/PIN bilan)
// DELETE -> bitta natijani o'chirish (/results/:id) yoki hammasini tozalash (/results)

import {
  jsonResponse,
  corsHeaders,
  getSessionUsername,
  getUser,
  isAdmin,
  randomHex,
  rateLimit,
  tooManyRequests
} from './_lib.js';

const RESULTS_KEY = 'results:all';
const MAX_RESULTS = 2000;

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

function extractResultId(context, body) {
  const { request, params } = context;
  if (params && params.path && params.path.length > 0) {
    const raw = params.path[0];
    if (raw && raw !== 'results') return String(raw).trim();
  }

  try {
    const url = new URL(request.url);
    const m = url.pathname.match(/\/(?:api\/admin\/|admin\/)?results\/([^/]+)/);
    if (m && m[1] && m[1] !== 'results') {
      return decodeURIComponent(m[1]).trim();
    }
    const q = url.searchParams.get('id') || url.searchParams.get('targetId');
    if (q) return String(q).trim();
  } catch (_) {}

  if (body) {
    const b = body.id || body.targetId;
    if (b) return String(b).trim();
  }
  return '';
}

// Foydalanuvchi natijani yuboradi
export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // IP bo'yicha rate-limit: daqiqada 30 ta natija saqlash
  const rl = await rateLimit(env, request, 'results-post', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request, env);
  }

  const sessionUser = await getSessionUsername(env, request);
  const username = sessionUser || (body && body.username) || 'mehmon';

  const rawTotal = body && (body.total !== undefined ? body.total : (body.maxScore !== undefined ? body.maxScore : 10));
  const total = Math.max(1, Math.min(200, parseInt(rawTotal, 10) || 10));
  const rawScore = body && (body.score !== undefined ? body.score : (body.correct !== undefined ? body.correct : 0));
  const score = Math.max(0, Math.min(total, parseInt(rawScore, 10) || 0));
  const wrong = body && body.wrong !== undefined ? parseInt(body.wrong, 10) : Math.max(0, total - score);

  const testId = String(body && (body.testId || body.topicId || 'quiz')).slice(0, 40);
  const testTitle = String(body && (body.testTitle || body.topicTitle || (body.level ? body.level + ' Test' : 'Nemis tili testi'))).slice(0, 80);

  const user = sessionUser ? await getUser(env, sessionUser) : null;
  const entry = {
    id: randomHex(8),
    username,
    name: (user && user.name) || (body && (body.name || body.username)) || username,
    testId,
    testTitle,
    score,
    total,
    wrong,
    pct: Math.round((score / total) * 100),
    date: new Date().toISOString(),
  };

  let list = [];
  try {
    const raw = await env.POSTS_KV.get(RESULTS_KEY);
    list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
  } catch (e) { list = []; }

  list.unshift(entry);
  if (list.length > MAX_RESULTS) list = list.slice(0, MAX_RESULTS);

  try {
    await env.POSTS_KV.put(RESULTS_KEY, JSON.stringify(list));
  } catch (e) {
    return jsonResponse({ ok: false, message: "Saqlashda xato" }, 500, request, env);
  }

  return jsonResponse({ ok: true, result: entry, saved: entry, message: "Natija saqlandi" }, 200, request, env);
}

// Admin barcha natijalarni oladi
export async function onRequestGet(context) {
  const { env, request } = context;
  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin kerak)" }, 401, request, env);
  }

  let list = [];
  try {
    const raw = await env.POSTS_KV.get(RESULTS_KEY);
    list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
  } catch (e) { list = []; }

  return jsonResponse({ ok: true, results: list, count: list.length }, 200, request, env);
}

// DELETE: bitta natijani o'chirish yoki barcha natijalarni tozalash
export async function onRequestDelete(context) {
  const { env, request } = context;
  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'results-del', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin kerak)" }, 401, request, env);
  }

  let body = {};
  try { body = await request.json(); } catch (_) { body = {}; }

  const targetId = extractResultId(context, body);

  let list = [];
  try {
    const raw = await env.POSTS_KV.get(RESULTS_KEY);
    list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
  } catch (e) { list = []; }

  // Agar ID berilmagan bo'lsa -> barcha natijalarni tozalash
  if (!targetId) {
    try {
      await env.POSTS_KV.put(RESULTS_KEY, JSON.stringify([]));
      return jsonResponse({ ok: true, message: "Barcha test natijalari tozalandi" }, 200, request, env);
    } catch (err) {
      return jsonResponse({ ok: false, error: "Tozalashda xatolik", message: err.message }, 500, request, env);
    }
  }

  // Bitta natijani o'chirish (ID yoki indeks bo'yicha)
  const initialLen = list.length;
  list = list.filter(r => String(r.id) !== String(targetId));

  // Agar ID topilmagan va targetId son bo'lsa (indeks bo'yicha o'chirish zaxirasi)
  if (list.length === initialLen && /^\d+$/.test(targetId)) {
    const idx = parseInt(targetId, 10);
    if (idx >= 0 && idx < list.length) {
      list.splice(idx, 1);
    }
  }

  try {
    await env.POSTS_KV.put(RESULTS_KEY, JSON.stringify(list));
    return jsonResponse({ ok: true, message: "Natija muvaffaqiyatli o'chirildi" }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "O'chirishda xatolik", message: err.message }, 500, request, env);
  }
}
