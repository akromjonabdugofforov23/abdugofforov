// functions/admin/backup/restore.js
// Cloudflare Pages Function — Zaxira Nusxadan Qayta Tiklash API (/admin/backup/restore)
// Header: x-admin-token yoki x-admin-pin
// Body: JSON zaxira fayli yoki { data: { ... } }

import {
  jsonResponse,
  corsHeaders,
  isAdmin,
  rateLimit,
  tooManyRequests
} from '../../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // Rate limit: daqiqasiga 5 ta tiklash urinishi
  const rl = await rateLimit(env, request, 'admin-backup-restore', 5, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin talab etiladi)" }, 401, request, env);
  }

  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Noto'g'ri JSON formati", message: "Noto'g'ri JSON" }, 400, request, env);
  }

  if (!payload || typeof payload !== 'object') {
    return jsonResponse({ ok: false, error: "Yaroqsiz zaxira fayl formati" }, 400, request, env);
  }

  // data ichida yoki ildiz darajasida bo'lishi mumkin
  const targetData = (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data))
    ? payload.data
    : payload;

  try {
    // 1. Postlar
    const posts = Array.isArray(targetData.posts) ? targetData.posts : (Array.isArray(payload.posts) ? payload.posts : null);
    if (posts) {
      await env.POSTS_KV.put('posts:list', JSON.stringify(posts));
      await env.POSTS_KV.put('posts', JSON.stringify(posts));
    }

    // 2. Loyihalar (projects yoki portfolio)
    const projs = Array.isArray(targetData.projects) ? targetData.projects
      : (Array.isArray(targetData.portfolio) ? targetData.portfolio
      : (Array.isArray(payload.projects) ? payload.projects
      : (Array.isArray(payload.portfolio) ? payload.portfolio : null)));
    if (projs) {
      await env.POSTS_KV.put('projects:list', JSON.stringify(projs));
      await env.POSTS_KV.put('projects:all', JSON.stringify(projs));
    }

    // 3. Iqtiboslar
    const quotes = Array.isArray(targetData.quotes) ? targetData.quotes : (Array.isArray(payload.quotes) ? payload.quotes : null);
    if (quotes) {
      await env.POSTS_KV.put('quotes:list', JSON.stringify(quotes));
      await env.POSTS_KV.put('quotes:all', JSON.stringify(quotes));
    }

    // 4. Rejalar
    const tasks = Array.isArray(targetData.tasks) ? targetData.tasks : (Array.isArray(payload.tasks) ? payload.tasks : null);
    if (tasks) {
      await env.POSTS_KV.put('tasks:list', JSON.stringify(tasks));
      await env.POSTS_KV.put('tasks:all', JSON.stringify(tasks));
    }

    // 5. Natijalar
    const results = Array.isArray(targetData.results) ? targetData.results : (Array.isArray(payload.results) ? payload.results : null);
    if (results) {
      await env.POSTS_KV.put('results:all', JSON.stringify(results));
    }

    // 6. Sozlamalar
    const settings = (targetData.settings && typeof targetData.settings === 'object' && !Array.isArray(targetData.settings))
      ? targetData.settings
      : ((payload.settings && typeof payload.settings === 'object' && !Array.isArray(payload.settings)) ? payload.settings : null);

    if (settings) {
      let existing = {};
      try {
        const raw = await env.POSTS_KV.get('site_settings');
        if (raw) existing = JSON.parse(raw) || {};
      } catch (_) {}

      const mergedSettings = { ...existing, ...settings, updatedAt: Date.now() };
      delete mergedSettings.adminPin;
      delete mergedSettings.admin_pin;
      delete mergedSettings.pin;
      if (existing.adminPinHash && !mergedSettings.adminPinHash) {
        mergedSettings.adminPinHash = existing.adminPinHash;
      }
      await env.POSTS_KV.put('site_settings', JSON.stringify(mergedSettings));
    }

    return jsonResponse({
      ok: true,
      message: "Ma'lumotlar bazasi zaxira nusxadan muvaffaqiyatli tiklandi"
    }, 200, request, env);

  } catch (err) {
    return jsonResponse({
      ok: false,
      error: "Tiklash jarayonida xatolik yuz berdi: " + err.message,
      message: err.message
    }, 500, request, env);
  }
}
