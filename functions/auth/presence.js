// POST & GET /auth/presence
// Dual-backend pariteti: foydalanuvchi faolligini qayd etish va o'quvchilar sonini qaytarish

import {
  jsonResponse, corsHeaders, getSessionUsername, getUser, putUser, getUsersIndex
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 'deutsch';
  
  let totalUsers = 1;
  let activeOnPage = 1;
  let totalActive = 1;
  
  if (env && env.POSTS_KV) {
    try {
      const idx = await getUsersIndex(env);
      if (Array.isArray(idx)) {
        totalUsers = Math.max(1, idx.length);
      }
      const rawCount = await env.POSTS_KV.get(`presence:${page}:count`);
      if (rawCount) activeOnPage = Math.max(1, parseInt(rawCount, 10) || 1);
      const rawTotal = await env.POSTS_KV.get('presence:total:count');
      if (rawTotal) totalActive = Math.max(1, parseInt(rawTotal, 10) || 1);
    } catch (_) {}
  }

  return jsonResponse({
    ok: true,
    stats: {
      activeOnPage,
      totalActive,
      totalUsers
    }
  }, 200, request, env);
}

export async function onRequestPost(context) {
  const { env, request } = context;
  let body = {};
  try { body = await request.json(); } catch (_) {}
  const page = String(body.page || 'deutsch').slice(0, 30);

  let totalUsers = 1;
  let activeOnPage = 1;
  let totalActive = 1;

  if (env && env.POSTS_KV) {
    try {
      const username = await getSessionUsername(env, request);
      if (username) {
        const user = await getUser(env, username);
        if (user) {
          user.lastSeen = Date.now();
          user.lastPage = page;
          await putUser(env, user);
        }
      }
      const idx = await getUsersIndex(env);
      if (Array.isArray(idx)) totalUsers = Math.max(1, idx.length);
    } catch (_) {}
  }

  return jsonResponse({
    ok: true,
    stats: {
      activeOnPage,
      totalActive,
      totalUsers
    }
  }, 200, request, env);
}
