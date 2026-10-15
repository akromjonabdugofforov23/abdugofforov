// POST /admin/change-pin
// Header: x-admin-token yoki x-admin-pin
// Body: { oldPin, newPin }
// Admin PIN kodini xavfsiz yangilash (SHA-256 xesh shaklida KV ga saqlash)

import {
  jsonResponse,
  corsHeaders,
  isAdmin,
  verifyAdminPin,
  sha256Hex,
  rateLimit,
  tooManyRequests
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.POSTS_KV) {
    return jsonResponse({ ok: false, error: "Server ombori (KV) sozlanmagan", message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // IP bo'yicha rate-limit: 5 daqiqada 5 ta urinish
  const rl = await rateLimit(env, request, 'admin-change-pin', 5, 300);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi (admin talab etiladi)", message: "Ruxsat berilmadi (admin talab etiladi)" }, 401, request, env);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Noto'g'ri so'rov formati", message: "Noto'g'ri so'rov formati" }, 400, request, env);
  }

  const { oldPin, newPin } = body || {};

  if (!newPin || typeof newPin !== 'string' || newPin.trim().length < 4) {
    return jsonResponse({ ok: false, error: "Yangi PIN kamida 4 belgidan iborat bo'lishi kerak", message: "Yangi PIN kamida 4 belgidan iborat bo'lishi kerak" }, 400, request, env);
  }

  if (!oldPin || !(await verifyAdminPin(env, oldPin))) {
    return jsonResponse({ ok: false, error: "Eski PIN noto'g'ri kiritildi", message: "Eski PIN noto'g'ri kiritildi" }, 403, request, env);
  }

  const newPinClean = newPin.trim();
  const newPinHash = await sha256Hex(newPinClean);

  let settings = {};
  try {
    const raw = await env.POSTS_KV.get('site_settings');
    if (raw) settings = JSON.parse(raw);
  } catch (_) {}

  // Ochiq PIN saqlanmaydi, faqat SHA-256 xesh saqlanadi
  delete settings.adminPin;
  delete settings.admin_pin;
  settings.adminPinHash = newPinHash;
  settings.updatedAt = Date.now();

  await env.POSTS_KV.put('site_settings', JSON.stringify(settings));

  return jsonResponse({ ok: true, message: "PIN kod muvaffaqiyatli yangilandi" }, 200, request, env);
}
