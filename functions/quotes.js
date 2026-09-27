// Cloudflare Pages Function — Haftalik Kun Hikmatlari API (/quotes)
import { jsonResponse, corsHeaders } from './_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestGet(context) {
  const { request, env } = context;

  // Agar KV'da maxsus haftalik hikmatlar saqlangan bo'lsa, undan olamiz
  if (env && env.POSTS_KV) {
    try {
      const kvQuotes = await env.POSTS_KV.get('weekly_quotes');
      if (kvQuotes) {
        const parsed = JSON.parse(kvQuotes);
        return jsonResponse({ ok: true, source: 'kv', ...parsed }, 200, request, env);
      }
    } catch (e) {}
  }

  // Standart static data/quotes.json manziliga yo'naltirish yoki 200 holatda xabar
  return jsonResponse({
    ok: true,
    source: 'static',
    endpoint: '/data/quotes.json',
    message: 'Haftalik hikmatlar /data/quotes.json manzilida mavjud'
  }, 200, request, env);
}
