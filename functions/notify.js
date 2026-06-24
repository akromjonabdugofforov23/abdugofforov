// Cloudflare Pages Function — admin hodisalari haqida Telegram bildirishnomasi (ixtiyoriy)
// Ishlashi uchun Cloudflare Pages sozlamalarida quyidagi muhit o'zgaruvchilarini qo'ying:
//   TELEGRAM_BOT_TOKEN  — BotFather'dan olingan token
//   TELEGRAM_CHAT_ID    — sizning Telegram chat ID raqamingiz
// O'zgaruvchilar bo'lmasa, funksiya jimgina o'tkazib yuboradi (xato bermaydi).

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'no-store'
};

export async function onRequestPost(context) {
  const { request, env } = context;

  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;

  // Sozlanmagan bo'lsa — xavfsiz tarzda o'tkazib yuboramiz
  if (!token || !chatId) {
    return new Response(JSON.stringify({ ok: false, configured: false }), { headers: JSON_HEADERS });
  }

  let payload = {};
  try { payload = await request.json(); } catch (e) { payload = {}; }

  const event = String(payload.event || 'event').slice(0, 40);
  const note = String(payload.note || '').slice(0, 200);
  const time = new Date().toISOString();
  const ip = request.headers.get('CF-Connecting-IP') || 'noma\'lum';

  const text = `🔔 Abdugofforov admin\nHodisa: ${event}\n${note ? 'Izoh: ' + note + '\n' : ''}IP: ${ip}\nVaqt: ${time}`;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
    });
    const ok = tgRes.ok;
    return new Response(JSON.stringify({ ok, configured: true }), { headers: JSON_HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, configured: true, error: 'send_failed' }), { headers: JSON_HEADERS });
  }
}
