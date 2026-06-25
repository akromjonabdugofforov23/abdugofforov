// /tournament
//   POST -> turnir natijasini saqlash. Token ixtiyoriy:
//           - login bo'lsa: username + name (token orqali)
//           - mehmon bo'lsa: faqat name (body'dan)
//           Body: { name, score, total }
//   GET  -> leaderboard (hammaga ochiq, top natijalar)
//
// KV kalit: 'tournament:scores' — JSON massiv. Oxirgi 500 ta saqlanadi,
// leaderboard'da har foydalanuvchining ENG YAXSHI natijasi ko'rsatiladi.

import {
  jsonResponse, corsHeaders, getSessionUsername, getUser, randomHex
} from './_lib.js';

const SCORES_KEY = 'tournament:scores';
const MAX_SCORES = 500;

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request);
  }

  let body;
  try { body = await request.json(); } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri so'rov" }, 400, request);
  }

  const total = Math.max(1, Math.min(200, parseInt(body.total, 10) || 0));
  const score = Math.max(0, Math.min(total, parseInt(body.score, 10) || 0));

  // Login bo'lsa — token orqali ism/username, mehmon bo'lsa body.name
  let username = await getSessionUsername(env, request);
  let name, registered = false;
  if (username) {
    const user = await getUser(env, username);
    name = (user && user.name) || username;
    registered = true;
  } else {
    name = String(body.name || '').trim().slice(0, 40) || 'Mehmon';
  }

  const entry = {
    id: randomHex(8),
    name,
    username: username || null,
    registered,
    score,
    total,
    pct: total ? Math.round((score / total) * 100) : 0,
    date: new Date().toISOString(),
  };

  let list = [];
  try {
    const raw = await env.POSTS_KV.get(SCORES_KEY);
    list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
  } catch (e) { list = []; }

  list.unshift(entry);
  if (list.length > MAX_SCORES) list = list.slice(0, MAX_SCORES);

  try {
    await env.POSTS_KV.put(SCORES_KEY, JSON.stringify(list));
  } catch (e) {
    return jsonResponse({ ok: false, message: "Saqlashda xato" }, 500, request);
  }

  // Reyting o'rnini hisoblaymiz (eng yaxshi natijalar bo'yicha)
  const leaderboard = buildLeaderboard(list);
  const rank = leaderboard.findIndex(e =>
    (entry.username && e.username === entry.username) ||
    (!entry.username && e.name === entry.name && e.score === entry.score)
  );

  return jsonResponse({ ok: true, saved: entry, rank: rank >= 0 ? rank + 1 : null, totalPlayers: leaderboard.length }, 200, request);
}

export async function onRequestGet(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: true, leaderboard: [], configured: false }, 200, request);
  }

  let list = [];
  try {
    const raw = await env.POSTS_KV.get(SCORES_KEY);
    list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
  } catch (e) { list = []; }

  const leaderboard = buildLeaderboard(list).slice(0, 50);
  return jsonResponse({ ok: true, leaderboard, count: leaderboard.length }, 200, request);
}

// Har bir o'yinchining ENG YAXSHI natijasini olib, reyting bo'yicha tartiblaydi
function buildLeaderboard(list) {
  const best = {};
  for (const e of list) {
    const key = e.username ? ('u:' + e.username) : ('g:' + e.name);
    if (!best[key] || e.pct > best[key].pct || (e.pct === best[key].pct && e.score > best[key].score)) {
      best[key] = e;
    }
  }
  return Object.values(best).sort((a, b) => {
    if (b.pct !== a.pct) return b.pct - a.pct;
    return new Date(a.date) - new Date(b.date); // teng bo'lsa avval qilgan yuqori
  });
}
