// /results
//   POST  -> test natijasini saqlash (foydalanuvchi token bilan)
//            Body: { testId, testTitle, score, total, wrong, date }
//   GET   -> barcha natijalar (faqat admin token/PIN bilan)
//
// Natijalar KV'da 'results:all' kalitida JSON massiv sifatida saqlanadi.
// Oxirgi 2000 ta natija saqlanadi (eskilari avtomatik tushib qoladi).

import {
  jsonResponse, corsHeaders, getSessionUsername, getUser, isAdmin, randomHex
} from './_lib.js';

const RESULTS_KEY = 'results:all';
const MAX_RESULTS = 2000;

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request) });
}

// Foydalanuvchi natijani yuboradi
export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request);
  }

  const username = await getSessionUsername(env, request);
  if (!username) {
    return jsonResponse({ ok: false, message: "Tizimga kiring (natija saqlanmadi)" }, 401, request);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request);
  }

  const total = Math.max(0, Math.min(200, parseInt(body.total, 10) || 0));
  const score = Math.max(0, Math.min(total, parseInt(body.score, 10) || 0));
  const wrong = Math.max(0, total - score);

  const user = await getUser(env, username);
  const entry = {
    id: randomHex(8),
    username,
    name: (user && user.name) || username,
    testId: String(body.testId || '').slice(0, 40),
    testTitle: String(body.testTitle || '').slice(0, 80),
    score,
    total,
    wrong,
    pct: total ? Math.round((score / total) * 100) : 0,
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
    return jsonResponse({ ok: false, message: "Saqlashda xato" }, 500, request);
  }

  return jsonResponse({ ok: true, saved: entry }, 200, request);
}

// Admin barcha natijalarni oladi
export async function onRequestGet(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request);
  }

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, message: "Ruxsat berilmadi (admin kerak)" }, 401, request);
  }

  let list = [];
  try {
    const raw = await env.POSTS_KV.get(RESULTS_KEY);
    list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
  } catch (e) { list = []; }

  return jsonResponse({ ok: true, results: list, count: list.length }, 200, request);
}
