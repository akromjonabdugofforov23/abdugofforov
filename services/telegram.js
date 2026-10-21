/**
 * ============================================================
 * TELEGRAM NOTIFICATION & BOT SERVICE
 * Kanalga e'lonlar, adminka bildirishnomalari va ogohlantirishlar
 * Nol-qaramlik (zero-dependency) HTTPS asosidagi xizmat.
 * ============================================================
 */

const https = require('https');

// Chat / Channel ID ni tozalash va to'g'ri formatga keltirish
function normalizeTelegramChatId(id) {
    if (!id) return '';
    let clean = String(id).trim();
    // Havola shaklida kiritilgan bo'lsa (https://t.me/kanal_nomi yoki t.me/kanal_nomi)
    clean = clean.replace(/^https?:\/\/t\.me\//i, '').replace(/^t\.me\//i, '');
    clean = clean.replace(/\/+$/, '');
    if (!clean) return '';
    // Agar sof raqam bo'lmasa va @ bilan boshlanmasa, @ qo'shamiz
    if (!/^-?\d+$/.test(clean) && !clean.startsWith('@')) {
        clean = '@' + clean;
    }
    return clean;
}

// Telegram HTML parse_mode uchun maxsus belgilarni zararsizlantirish
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Dinamik konfiguratsiyani olish (.env ustuvor, so'ng database sozlamalari)
function getTelegramConfig() {
    let dbSettings = {};
    try {
        const db = require('../database');
        dbSettings = (db && typeof db.getSettings === 'function') ? db.getSettings() : {};
    } catch (_) {
        try {
            const dbData = require('../data/db.json');
            dbSettings = dbData.settings || {};
        } catch (_) {}
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN || dbSettings.telegramBotToken || '';
    let channelId = process.env.TELEGRAM_CHANNEL_ID || dbSettings.telegramChannelId || '';
    let adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID || dbSettings.telegramAdminChatId || '';

    channelId = normalizeTelegramChatId(channelId);
    adminChatId = normalizeTelegramChatId(adminChatId);

    return {
        botToken,
        channelId,
        adminChatId,
        isConfigured: Boolean(botToken && (channelId || adminChatId))
    };
}

async function makeTelegramRequest(method, payload = null, tokenOverride = null) {
    const config = getTelegramConfig();
    const token = tokenOverride || config.botToken;

    if (!token) {
        return { ok: false, configured: false, error: 'Telegram bot token kiritilmagan' };
    }

    return new Promise((resolve) => {
        const data = payload ? JSON.stringify(payload) : null;
        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${token}/${method}`,
            method: payload ? 'POST' : 'GET',
            headers: payload ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            } : {},
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => { body += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } catch (_) {
                    resolve({ ok: false, error: 'JSON parse error', raw: body });
                }
            });
        });

        req.on('error', (err) => {
            console.warn('[TELEGRAM ERROR]', err.message);
            resolve({ ok: false, error: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ ok: false, error: 'Telegram serveriga ulanish vaqti tugadi (Timeout)' });
        });

        if (data) req.write(data);
        req.end();
    });
}

async function sendMessage(chatId, text, parseMode = 'HTML', disablePreview = false) {
    const config = getTelegramConfig();
    const targetChat = normalizeTelegramChatId(chatId) || config.channelId || config.adminChatId;

    if (!config.botToken || !targetChat) {
        console.log(`[TELEGRAM MOCK] ChatID: ${targetChat || 'none'} | Xabar:\n${text}`);
        return {
            ok: false,
            mocked: true,
            configured: false,
            message: "Telegram bot yoki kanal sozlanmagan (.env yoki Sozlamalarda Bot Token va Kanal ID ni kiriting)"
        };
    }

    const payload = {
        chat_id: targetChat,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: disablePreview
    };

    const res = await makeTelegramRequest('sendMessage', payload);
    return res;
}

// Telegram ulanishini sinovdan o'tkazish (getMe va sendMessage)
async function testConnection(customConfig = null) {
    const config = getTelegramConfig();
    const token = (customConfig && customConfig.botToken) ? String(customConfig.botToken).trim() : config.botToken;
    let channelId = (customConfig && customConfig.channelId) ? normalizeTelegramChatId(customConfig.channelId) : config.channelId;
    let adminChatId = (customConfig && customConfig.adminChatId) ? normalizeTelegramChatId(customConfig.adminChatId) : config.adminChatId;

    if (!token) {
        return {
            ok: false,
            configured: false,
            message: "Telegram Bot Token kiritilmagan. BotFather bergan tokenni kiriting."
        };
    }

    // 1. getMe orqali bot mavjudligi va token to'g'riligini tekshirish
    const meRes = await makeTelegramRequest('getMe', null, token);
    if (!meRes || !meRes.ok) {
        return {
            ok: false,
            error: meRes?.description || meRes?.error || "Bot token noto'g'ri",
            message: `Bot bilan aloqa o'rnatilmadi: ${meRes?.description || 'Token noto\'g\'ri'}`
        };
    }

    const botInfo = meRes.result || {};
    const targetChat = channelId || adminChatId;

    if (!targetChat) {
        return {
            ok: true,
            bot: botInfo,
            message: `Bot (@${botInfo.username}) faol, biroq xabar yuborish uchun Kanal ID yoki Admin Chat ID kiritilmagan.`
        };
    }

    // 2. Sinov xabari yuborish
    const testText = `⚡ <b>Telegram Integratsiyasi Sinovi!</b>\n\n` +
                     `✅ <b>Bot:</b> @${botInfo.username} (${escapeHtml(botInfo.first_name || '')})\n` +
                     `📡 <b>Maqsad:</b> <code>${targetChat}</code>\n` +
                     `⏱ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n\n` +
                     `<i>Abdugofforov ekotizimidan ushbu kanalga xabarlar muvaffaqiyatli uzatilmoqda.</i>`;

    const sendRes = await makeTelegramRequest('sendMessage', {
        chat_id: targetChat,
        text: testText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    }, token);

    if (sendRes && sendRes.ok) {
        return {
            ok: true,
            bot: botInfo,
            targetChat,
            message: `Telegram aloqasi a'lo darajada! @${botInfo.username} boti ${targetChat} manziliga sinov xabarini yetkazdi.`
        };
    }

    let errorAdvice = sendRes?.description || "Xabar yuborib bo'lmadi";
    if (/chat not found/i.test(errorAdvice)) {
        errorAdvice += " (Kanal username to'g'riligini va bot ushbu kanalga qo'shilganini tekshiring)";
    } else if (/not enough rights|need administrator rights|have no rights/i.test(errorAdvice)) {
        errorAdvice += " (Botni ushbu kanalda ADMINISTRATOR qilib belgilang va 'Post Messages' huquqini bering!)";
    }

    return {
        ok: false,
        bot: botInfo,
        error: sendRes?.description || 'Send failed',
        message: errorAdvice
    };
}

// 1. Yangi foydalanuvchi ro'yxatdan o'tganda xabar
async function notifyNewUser(user) {
    const config = getTelegramConfig();
    const targetChat = config.adminChatId || config.channelId;
    if (!targetChat) return { ok: false, message: 'Chat ID yo\'q' };

    const text = `👤 <b>Yangi Foydalanuvchi Ro'yxatdan O'tdi!</b>\n\n` +
                 `▫️ <b>Ism:</b> ${escapeHtml(user.name || 'Noma\'lum')}\n` +
                 `▫️ <b>Username:</b> @${escapeHtml(user.username)}\n` +
                 `▫️ <b>Rol:</b> ${escapeHtml(user.role)}\n` +
                 `▫️ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;
    return sendMessage(targetChat, text);
}

// 2. Yangi izoh qo'shilganda xabar
async function notifyNewComment(comment, postTitle) {
    const config = getTelegramConfig();
    const targetChat = config.adminChatId || config.channelId;
    if (!targetChat) return { ok: false, message: 'Chat ID yo\'q' };

    const content = escapeHtml((comment.content || comment.text || '').slice(0, 300));
    const title = escapeHtml(postTitle || 'Umumiy');
    const author = escapeHtml(comment.author || 'Anonim');

    const text = `💬 <b>Yangi Izoh Qoldirildi!</b>\n\n` +
                 `▫️ <b>Post:</b> ${title}\n` +
                 `▫️ <b>Muallif:</b> ${author}\n` +
                 `▫️ <b>Matn:</b> <i>${content}</i>\n` +
                 `▫️ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;
    return sendMessage(targetChat, text);
}

// 3. Yangi post chop etilganda yoki yangilanganda kanalga xabar
async function broadcastPost(post, isUpdate = false) {
    const config = getTelegramConfig();
    const targetChat = config.channelId || config.adminChatId;
    if (!targetChat) {
        return {
            ok: false,
            configured: false,
            message: "Telegram kanal sozlanmagan"
        };
    }

    const title = escapeHtml(post.title || 'Yangi Maqola');
    const excerpt = escapeHtml(post.excerpt || (post.content ? post.content.slice(0, 180) : ''));
    const tags = Array.isArray(post.tags) ? post.tags.map(t => `#${t.replace(/\s+/g, '_')}`).join(' ') : '';

    const text = `${isUpdate ? '♻️' : '📰'} <b>${isUpdate ? "Maqola Yangilandi / O'zgarishlar!" : 'Yangi Hikoya / Maqola!'}</b>\n\n` +
                 `✨ <b>${title}</b>\n\n` +
                 `${excerpt}...\n\n` +
                 (tags ? `${tags}\n\n` : '') +
                 `🔗 Saytda to'liq o'qish: <a href="https://abdugofforov.uz/#blog">abdugofforov.uz</a>`;

    return sendMessage(targetChat, text);
}

// 4. Yangi loyiha (Portfolio Project) qo'shilganda yoki yangilanganda kanalga e'lon
async function broadcastProject(project, isUpdate = false) {
    const config = getTelegramConfig();
    const targetChat = config.channelId || config.adminChatId;
    if (!targetChat) return { ok: false, configured: false, message: "Telegram kanal sozlanmagan" };

    const title = escapeHtml(project.title || 'Yangi Loyiha');
    const desc = escapeHtml(project.description || project.desc || '');
    const tech = Array.isArray(project.tags || project.tech) ? (project.tags || project.tech).map(t => `#${t.replace(/\s+/g, '_')}`).join(' ') : '';
    const link = project.link && project.link !== '#' ? project.link : 'https://abdugofforov.uz';

    const text = `🚀 <b>${isUpdate ? "Loyiha Yangilandi!" : 'Yangi Portfel Loyihasi!'}</b>\n\n` +
                 `💼 <b>${title}</b>\n\n` +
                 `${desc}\n\n` +
                 (tech ? `🛠 <b>Texnologiyalar:</b> ${tech}\n\n` : '') +
                 `🔗 Jonli Demo: <a href="${link}">Ko'rish</a> | Sayt: <a href="https://abdugofforov.uz">abdugofforov.uz</a>`;

    return sendMessage(targetChat, text);
}

// 5. Yangi iqtibos / kun hikmati qo'shilganda kanalga e'lon
async function broadcastQuote(quote) {
    const config = getTelegramConfig();
    const targetChat = config.channelId || config.adminChatId;
    if (!targetChat) return { ok: false, configured: false, message: "Telegram kanal sozlanmagan" };

    const uzText = escapeHtml(quote.uz || quote.text || quote.quote || '');
    const deText = escapeHtml(quote.de || '');
    const author = escapeHtml(quote.author || "Noma'lum");

    let text = `💡 <b>Kun Hikmati / Zitat des Tages</b>\n\n` +
               `<i>"${uzText}"</i>\n`;
    if (deText) {
        text += `\n🇩🇪 <i>"${deText}"</i>\n`;
    }
    text += `\n✍️ <b>— ${author}</b>\n\n` +
            `🔗 Manba: <a href="https://abdugofforov.uz">abdugofforov.uz</a>`;

    return sendMessage(targetChat, text);
}

// 6. Sayt umumiy o'zgarishlari va yangilanishlari (Site Update Broadcast)
async function broadcastSiteUpdate(update) {
    const config = getTelegramConfig();
    const targetChat = config.channelId || config.adminChatId;
    if (!targetChat) return { ok: false, configured: false, message: "Telegram kanal sozlanmagan" };

    const title = escapeHtml(update.title || "Saytda Yangilanish");
    const desc = escapeHtml(update.description || update.message || update.text || '');

    const text = `🔔 <b>Sayt Ekotizimida Yangilanish!</b>\n\n` +
                 `✨ <b>${title}</b>\n\n` +
                 `${desc}\n\n` +
                 `🌐 Barcha o'zgarishlar bilan tanishing: <a href="https://abdugofforov.uz">abdugofforov.uz</a>`;

    return sendMessage(targetChat, text);
}

module.exports = {
    normalizeTelegramChatId,
    escapeHtml,
    getTelegramConfig,
    sendMessage,
    testConnection,
    notifyNewUser,
    notifyNewComment,
    broadcastPost,
    broadcastProject,
    broadcastQuote,
    broadcastSiteUpdate
};
