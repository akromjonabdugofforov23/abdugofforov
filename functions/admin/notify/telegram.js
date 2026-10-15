// functions/admin/notify/telegram.js
// Cloudflare Pages Function — Telegram kanal/admin bildirishnomasi (/admin/notify/telegram)
// POST: Post chop etilganda Telegram kanalga e'lon yuborish

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

  const rl = await rateLimit(env, request, 'notify-tg', 20, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Faqat admin uchun" }, 401, request, env);
  }

  let body = {};
  try { body = await request.json(); } catch (_) { body = {}; }

  const { post, message } = body;
  const targetPost = post || {
    title: message || 'Yangi xabar',
    excerpt: message ? message.slice(0, 160) : '',
    content: message || ''
  };

  const botToken = env && env.TELEGRAM_BOT_TOKEN;
  const chatId = env && (env.TELEGRAM_CHANNEL_ID || env.TELEGRAM_ADMIN_CHAT_ID || env.TELEGRAM_CHAT_ID);

  if (!botToken || !chatId) {
    return jsonResponse({
      ok: true,
      mocked: true,
      message: "Telegram bot sozlanmagan (mock rejimida muvaffaqiyatli qabul qilindi)"
    }, 200, request, env);
  }

  const text = `📰 <b>Yangi Hikoya / Maqola!</b>\n\n` +
               `✨ <b>${targetPost.title}</b>\n\n` +
               `${targetPost.excerpt || (targetPost.content ? targetPost.content.slice(0, 180) : '')}...\n\n` +
               `🔗 Saytda o'qish: <a href="https://abdugofforov.uz/#blog">abdugofforov.uz</a>`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });

    const data = await res.json().catch(() => ({ ok: res.ok }));
    return jsonResponse({
      ok: true,
      result: data,
      message: "Telegram kanalga xabar yuborildi"
    }, 200, request, env);
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: "Telegramga yuborishda xatolik yuz berdi",
      message: err.message
    }, 500, request, env);
  }
}
