// functions/admin/notify/telegram.js
// Cloudflare Pages Function — Telegram kanal/admin bildirishnomasi (/admin/notify/telegram)
// POST: Saytdagi o'zgarishlar (post, loyiha, iqtibos, yangilanish)ni Telegram kanalga e'lon qilish

import {
  jsonResponse,
  corsHeaders,
  isAdmin,
  rateLimit,
  tooManyRequests,
  escapeHtml,
  normalizeTelegramChatId,
  getTelegramConfig
} from '../../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  const rl = await rateLimit(env, request, 'notify-tg', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Faqat admin uchun" }, 401, request, env);
  }

  let body = {};
  try { body = await request.json(); } catch (_) { body = {}; }

  const tgConfig = await getTelegramConfig(env);
  const botToken = (body.config && body.config.botToken)
    ? String(body.config.botToken).trim()
    : tgConfig.botToken;

  const targetChat = (body.config && body.config.channelId)
    ? normalizeTelegramChatId(body.config.channelId)
    : (tgConfig.channelId || tgConfig.adminChatId);

  // 1. Telegram Ulanishini Tekshirish (Test Connection)
  if (body.type === 'test') {
    if (!botToken) {
      return jsonResponse({
        ok: false,
        configured: false,
        message: "Telegram Bot Token kiritilmagan. BotFather bergan tokenni kiriting."
      }, 400, request, env);
    }

    try {
      const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const meData = await meRes.json().catch(() => ({ ok: false }));
      if (!meData.ok) {
        return jsonResponse({
          ok: false,
          error: meData.description || "Bot token noto'g'ri",
          message: `Bot bilan aloqa o'rnatilmadi: ${meData.description || 'Token noto\'g\'ri'}`
        }, 400, request, env);
      }

      const botInfo = meData.result || {};
      if (!targetChat) {
        return jsonResponse({
          ok: true,
          bot: botInfo,
          message: `Bot (@${botInfo.username}) faol, lekin kanal yoki chat ID ko'rsatilmagan.`
        }, 200, request, env);
      }

      const testMsg = `⚡ <b>Telegram Integratsiyasi Sinovi!</b>\n\n` +
                      `✅ <b>Bot:</b> @${botInfo.username}\n` +
                      `📡 <b>Kanal/Chat:</b> <code>${targetChat}</code>\n` +
                      `⏱ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n\n` +
                      `<i>Abdugofforov ekotizimidan ushbu kanalga xabarlar muvaffaqiyatli uzatilmoqda.</i>`;

      const sendRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChat,
          text: testMsg,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      const sendData = await sendRes.json().catch(() => ({ ok: false }));
      if (sendData.ok) {
        return jsonResponse({
          ok: true,
          bot: botInfo,
          targetChat,
          message: `Telegram aloqasi a'lo darajada! @${botInfo.username} boti ${targetChat} manziliga sinov xabarini yetkazdi.`
        }, 200, request, env);
      }

      let errorAdvice = sendData.description || "Xabar yuborib bo'lmadi";
      if (/chat not found/i.test(errorAdvice)) {
        errorAdvice += " (Kanal username to'g'riligini va bot kanalda mavjudligini tekshiring)";
      } else if (/not enough rights|administrator rights/i.test(errorAdvice)) {
        errorAdvice += " (Botni ushbu kanalda ADMINISTRATOR qilib belgilang va post yuborish huquqini bering!)";
      }

      return jsonResponse({
        ok: false,
        bot: botInfo,
        error: sendData.description,
        message: errorAdvice
      }, 400, request, env);
    } catch (e) {
      return jsonResponse({ ok: false, error: e.message, message: "Telegram API ga ulanishda xato: " + e.message }, 500, request, env);
    }
  }

  // E'lon yuborish uchun token va chat mavjudligini tekshirish
  if (!botToken || !targetChat) {
    return jsonResponse({
      ok: false,
      configured: false,
      message: "Telegram bot yoki kanal sozlanmagan (Admin Sozlamalarida Bot Token va Kanal nomini kiriting)"
    }, 400, request, env);
  }

  let text = '';
  const isUpdate = Boolean(body.isUpdate);

  // 2. Loyiha e'loni
  if (body.type === 'project' && body.project) {
    const proj = body.project;
    const title = escapeHtml(proj.title || 'Yangi Loyiha');
    const desc = escapeHtml(proj.description || proj.desc || '');
    const tech = Array.isArray(proj.tags || proj.tech) ? (proj.tags || proj.tech).map(t => `#${t.replace(/\s+/g, '_')}`).join(' ') : '';
    const link = proj.link && proj.link !== '#' ? proj.link : 'https://abdugofforov.uz';
    text = `🚀 <b>${isUpdate ? "Loyiha Yangilandi!" : 'Yangi Portfel Loyihasi!'}</b>\n\n` +
           `💼 <b>${title}</b>\n\n` +
           `${desc}\n\n` +
           (tech ? `🛠 <b>Texnologiyalar:</b> ${tech}\n\n` : '') +
           `🔗 Jonli Demo: <a href="${link}">Ko'rish</a> | Sayt: <a href="https://abdugofforov.uz">abdugofforov.uz</a>`;
  }
  // 3. Iqtibos e'loni
  else if (body.type === 'quote' && body.quote) {
    const q = body.quote;
    const uzText = escapeHtml(q.uz || q.text || q.quote || '');
    const deText = escapeHtml(q.de || '');
    const author = escapeHtml(q.author || "Noma'lum");
    text = `💡 <b>Kun Hikmati / Zitat des Tages</b>\n\n` +
           `<i>"${uzText}"</i>\n`;
    if (deText) text += `\n🇩🇪 <i>"${deText}"</i>\n`;
    text += `\n✍️ <b>— ${author}</b>\n\n` +
            `🔗 Manba: <a href="https://abdugofforov.uz">abdugofforov.uz</a>`;
  }
  // 4. Sayt Yangilanishi
  else if (body.type === 'update') {
    const upd = body.update || {};
    const title = escapeHtml(upd.title || body.title || "Saytda Yangilanish");
    const desc = escapeHtml(upd.description || upd.message || body.message || body.desc || '');
    text = `🔔 <b>Sayt Ekotizimida Yangilanish!</b>\n\n` +
           `✨ <b>${title}</b>\n\n` +
           `${desc}\n\n` +
           `🌐 Barcha o'zgarishlar: <a href="https://abdugofforov.uz">abdugofforov.uz</a>`;
  }
  // 5. Post (Maqola) e'loni (standart)
  else {
    const targetPost = body.post || {
      title: body.message || 'Yangi xabar',
      excerpt: body.message ? body.message.slice(0, 160) : '',
      content: body.message || ''
    };
    const title = escapeHtml(targetPost.title || 'Yangi Maqola');
    const excerpt = escapeHtml(targetPost.excerpt || (targetPost.content ? targetPost.content.slice(0, 180) : ''));
    const tags = Array.isArray(targetPost.tags) ? targetPost.tags.map(t => `#${t.replace(/\s+/g, '_')}`).join(' ') : '';
    text = `${isUpdate ? '♻️' : '📰'} <b>${isUpdate ? "Maqola Yangilandi / O'zgarishlar!" : 'Yangi Hikoya / Maqola!'}</b>\n\n` +
           `✨ <b>${title}</b>\n\n` +
           `${excerpt}...\n\n` +
           (tags ? `${tags}\n\n` : '') +
           `🔗 Saytda to'liq o'qish: <a href="https://abdugofforov.uz/#blog">abdugofforov.uz</a>`;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChat,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });

    const data = await res.json().catch(() => ({ ok: res.ok }));
    if (!data.ok) {
      return jsonResponse({
        ok: false,
        error: data.description || "Telegramga yuborishda xatolik",
        message: data.description || "Telegram kanalga xabar yuborib bo'lmadi"
      }, 400, request, env);
    }

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
