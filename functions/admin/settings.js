// functions/admin/settings.js
// Cloudflare Pages Function — Sayt Sozlamalari (Settings) API (/admin/settings)
// Header: x-admin-token yoki x-admin-pin
// GET: Sozlamalarni o'qish (maxfiy PIN-kodlar tozalangan holda)
// POST/PUT: Yangi sozlamalarni saqlash (KV: 'site_settings')

import {
  jsonResponse,
  corsHeaders,
  isAdmin,
  rateLimit,
  tooManyRequests
} from '../_lib.js';

const DEFAULT_SETTINGS = {
  siteName: "Abdugofforov",
  siteTitle: "ABDUGOFFOROV | Kay Portfolio & Ecosystem",
  siteDesc: "Vaqt sarguzashtlari va unutilmas xotiralar kundaligi.",
  authorName: "Akromjon Abdugofforov",
  authorBio: "Dasturchi, muhandis va nemis tili o'rganuvchisi. Zamonaviy dasturlash, veb-texnologiyalar va bulutli tizimlar ishqibozi.",
  contactEmail: "akromjon@abdugofforov.uz",
  contactPhone: "+998 (90) 000-00-00",
  socialTg: "https://t.me/abdugofforov_uz",
  socialGh: "https://github.com/akrin4477",
  socialLc: "https://leetcode.com/u/akrin4477",
  socialIg: "https://instagram.com/abdugofforov",
  bannerActive: true,
  bannerText: "🚀 2026-yilgi yangi ekotizim yangilanishi e'lon qilindi! Tools Lab va 3D tajribalarni sinab ko'ring."
};

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
    return jsonResponse({ ok: true, settings: DEFAULT_SETTINGS, configured: false }, 200, request, env);
  }

  let settings = { ...DEFAULT_SETTINGS };
  try {
    const raw = await env.POSTS_KV.get('site_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        settings = { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch (e) {
    return jsonResponse({ ok: false, error: "Sozlamalarni o'qishda xatolik", message: e.message }, 500, request, env);
  }

  // Maxfiy parollarni mijozga qaytarmaslik
  const safeSettings = { ...settings };
  delete safeSettings.adminPin;
  delete safeSettings.admin_pin;
  delete safeSettings.pin;
  delete safeSettings.adminPinHash;

  return jsonResponse({ ok: true, settings: safeSettings }, 200, request, env);
}

async function handleSaveSettings(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "Server ombori (KV) sozlanmagan" }, 503, request, env);
  }

  // Rate limit: daqiqasiga 20 ta yozish urinishi
  const rl = await rateLimit(env, request, 'admin-settings', 20, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin talab etiladi)" }, 401, request, env);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Noto'g'ri JSON", message: "Noto'g'ri so'rov formati" }, 400, request, env);
  }

  if (!body || typeof body !== 'object') {
    return jsonResponse({ ok: false, error: "Yaroqsiz sozlamalar ma'lumotlari" }, 400, request, env);
  }

  // Mavjud sozlamalarni o'qib, adminPinHash ni saqlab qolish
  let existing = {};
  try {
    const raw = await env.POSTS_KV.get('site_settings');
    if (raw) existing = JSON.parse(raw) || {};
  } catch (_) {}

  // Yangi sozlamalarni birlashtirish
  const merged = {
    ...DEFAULT_SETTINGS,
    ...existing,
    ...body,
    updatedAt: Date.now()
  };

  // Hech qachon ochiq PIN ni sozlamalar orqali yozishga ruxsat berilmaydi
  delete merged.adminPin;
  delete merged.admin_pin;
  delete merged.pin;

  // Agar mavjud adminPinHash bo'lsa uni saqlab qolamiz
  if (existing.adminPinHash && !merged.adminPinHash) {
    merged.adminPinHash = existing.adminPinHash;
  }

  await env.POSTS_KV.put('site_settings', JSON.stringify(merged));

  const safeSettings = { ...merged };
  delete safeSettings.adminPin;
  delete safeSettings.admin_pin;
  delete safeSettings.pin;
  delete safeSettings.adminPinHash;

  return jsonResponse({
    ok: true,
    message: "Sayt sozlamalari saqlandi",
    settings: safeSettings
  }, 200, request, env);
}

export async function onRequestPost(context) {
  return handleSaveSettings(context);
}

export async function onRequestPut(context) {
  return handleSaveSettings(context);
}
