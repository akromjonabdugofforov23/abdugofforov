// functions/admin/backup.js
// Cloudflare Pages Function — Ma'lumotlar bazasi Zaxira Nusxasi API (/admin/backup)
// Header: x-admin-token yoki x-admin-pin
// KV dagi barcha asosiy ma'lumotlarni yig'ib JSON formatda yuklab beradi

import {
  jsonResponse,
  corsHeaders,
  isAdmin,
  getUsersIndex,
  getUser,
  publicUser
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestGet(context) {
  const { env, request } = context;

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin talab etiladi)" }, 401, request, env);
  }

  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  let posts = [];
  try {
    const raw = await env.POSTS_KV.get('posts') || await env.POSTS_KV.get('posts:list');
    posts = raw ? JSON.parse(raw) : [];
  } catch (_) {}

  let projects = [];
  try {
    const raw = await env.POSTS_KV.get('projects:all') || await env.POSTS_KV.get('projects:list') || await env.POSTS_KV.get('projects');
    projects = raw ? JSON.parse(raw) : [];
  } catch (_) {}

  let quotes = [];
  try {
    const raw = await env.POSTS_KV.get('quotes:all') || await env.POSTS_KV.get('quotes:list') || await env.POSTS_KV.get('quotes');
    quotes = raw ? JSON.parse(raw) : [];
  } catch (_) {}

  let tasks = [];
  try {
    const raw = await env.POSTS_KV.get('tasks:all') || await env.POSTS_KV.get('tasks:list') || await env.POSTS_KV.get('tasks');
    tasks = raw ? JSON.parse(raw) : [];
  } catch (_) {}

  let results = [];
  try {
    const raw = await env.POSTS_KV.get('results:all') || await env.POSTS_KV.get('results:list') || await env.POSTS_KV.get('results');
    results = raw ? JSON.parse(raw) : [];
  } catch (_) {}

  let settings = {};
  try {
    const raw = await env.POSTS_KV.get('site_settings');
    if (raw) settings = JSON.parse(raw);
  } catch (_) {}
  delete settings.adminPin;
  delete settings.admin_pin;
  delete settings.pin;
  delete settings.adminPinHash;

  let users = [];
  try {
    const uList = await getUsersIndex(env);
    for (const u of uList) {
      const user = await getUser(env, u);
      if (user) users.push(publicUser(user, env));
    }
  } catch (_) {}

  const backupData = {
    version: "2.0.0",
    exportedAt: new Date().toISOString(),
    source: "Cloudflare Pages KV",
    data: {
      users,
      posts,
      projects,
      quotes,
      tasks,
      results,
      settings
    }
  };

  const headers = {
    ...corsHeaders(request, env),
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Disposition': `attachment; filename="abdugofforov_backup_${Date.now()}.json"`,
    'Cache-Control': 'no-store'
  };

  return new Response(JSON.stringify(backupData, null, 2), { status: 200, headers });
}
