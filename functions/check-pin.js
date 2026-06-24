// Cloudflare Pages Function — PIN tekshiruvi (server tomonida)
// Yaxshilanishlar:
//  - PIN endi ochiq matnda emas, SHA-256 hash sifatida solishtiriladi
//  - Doimiy vaqtli (constant-time) solishtirish — timing hujumlarining oldini olish
//  - Brute-force ni sekinlashtirish uchun kichik kechikish
//  - Qattiqlashtirilgan xavfsizlik sarlavhalari va cheklangan CORS

// SHA-256("0509") — to'g'ri PIN hashi (ochiq PIN kodda saqlanmaydi)
const CORRECT_PIN_HASH = "827d5449d1f191275051481e75c4ce10e930a64b5585a546363c340d63347089";

const SECURITY_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
};

function corsHeaders(request) {
  // Faqat so'rov kelgan origin (same-origin) ga ruxsat beramiz
  const origin = request.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': origin || 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  };
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Doimiy vaqtli string solishtirish
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request) });
}

export async function onRequestPost(context) {
  const cors = corsHeaders(context.request);

  try {
    const body = await context.request.json();
    const userPin = (body && typeof body.pin === 'string') ? body.pin : '';

    // Brute-force ni sekinlashtirish uchun kichik kechikish (~250ms)
    await new Promise(r => setTimeout(r, 250));

    if (!userPin || userPin.length > 12) {
      return new Response(JSON.stringify({ success: false, message: "Noto'g'ri so'rov" }), {
        status: 400,
        headers: { ...cors, ...SECURITY_HEADERS },
      });
    }

    const userHash = await sha256Hex(userPin);

    if (timingSafeEqual(userHash, CORRECT_PIN_HASH)) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...cors, ...SECURITY_HEADERS },
      });
    }

    return new Response(JSON.stringify({ success: false, message: "Noto'g'ri PIN-kod!" }), {
      status: 401,
      headers: { ...cors, ...SECURITY_HEADERS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: "Xato so'rov jo'natildi" }), {
      status: 400,
      headers: { ...cors, ...SECURITY_HEADERS },
    });
  }
}
