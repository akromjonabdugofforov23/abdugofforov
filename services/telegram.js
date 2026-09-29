/**
 * ============================================================
 * TELEGRAM NOTIFICATION & BOT SERVICE
 * Kanalga e'lonlar, adminka bildirishnomalari va ogohlantirishlar
 * Nol-qaramlik (zero-dependency) HTTPS asosidagi xizmat.
 * ============================================================
 */

const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '';

async function sendMessage(chatId, text, parseMode = 'HTML') {
    if (!BOT_TOKEN || !chatId) {
        // Muhitda sozlanmagan bo'lsa, xato chiqarmasdan xavfsiz davom etadi
        console.log(`[TELEGRAM MOCK] ChatID: ${chatId || 'none'} | Xabar:\n${text}`);
        return { ok: true, mocked: true };
    }

    return new Promise((resolve) => {
        const payload = JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: parseMode,
            disable_web_page_preview: false
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 443,
            path: `/bot${BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
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
                    resolve({ ok: false, error: 'JSON parse error' });
                }
            });
        });

        req.on('error', (err) => {
            console.warn('[TELEGRAM ERROR]', err.message);
            resolve({ ok: false, error: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ ok: false, error: 'Timeout' });
        });

        req.write(payload);
        req.end();
    });
}

// 1. Yangi foydalanuvchi ro'yxatdan o'tganda xabar
async function notifyNewUser(user) {
    const text = `👤 <b>Yangi Foydalanuvchi Ro'yxatdan O'tdi!</b>\n\n` +
                 `▫️ <b>Ism:</b> ${user.name || 'Noma\'lum'}\n` +
                 `▫️ <b>Username:</b> @${user.username}\n` +
                 `▫️ <b>Rol:</b> ${user.role}\n` +
                 `▫️ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;
    return sendMessage(ADMIN_CHAT_ID, text);
}

// 2. Yangi izoh qo'shilganda xabar
async function notifyNewComment(comment, postTitle) {
    const text = `💬 <b>Yangi Izoh Qoldirildi!</b>\n\n` +
                 `▫️ <b>Post:</b> ${postTitle || 'Umumiy'}\n` +
                 `▫️ <b>Muallif:</b> ${comment.author || 'Anonim'}\n` +
                 `▫️ <b>Matn:</b> <i>${comment.content ? comment.content.slice(0, 200) : ''}</i>\n` +
                 `▫️ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;
    return sendMessage(ADMIN_CHAT_ID, text);
}

// 3. Yangi post chop etilganda kanalga xabar
async function broadcastPost(post) {
    const targetChat = CHANNEL_ID || ADMIN_CHAT_ID;
    const text = `📰 <b>Yangi Hikoya / Maqola!</b>\n\n` +
                 `✨ <b>${post.title}</b>\n\n` +
                 `${post.excerpt || post.content.slice(0, 180)}...\n\n` +
                 `🔗 Saytda o'qish: <a href="https://abdugofforov.uz/#blog">abdugofforov.uz</a>`;
    return sendMessage(targetChat, text);
}

module.exports = {
    sendMessage,
    notifyNewUser,
    notifyNewComment,
    broadcastPost
};
