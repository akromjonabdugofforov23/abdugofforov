// functions/quotes.js
// Cloudflare Pages Function — Kun Hikmatlari API (/quotes va /api/admin/quotes)
// GET: barcha hikmatlarni qaytarish (KV: quotes:list)
// POST: yangi hikmat qo'shish
// PUT: hikmatni tahrirlash (id bo'yicha)
// DELETE: hikmatni o'chirish (id bo'yicha)

import { jsonResponse, corsHeaders, isAdmin, rateLimit, tooManyRequests } from './_lib.js';

const KV_QUOTES_KEY = 'quotes:list';

const DEFAULT_QUOTES = [
  {
    id: 'quote-1',
    quote: "Mantiq sizni A nuqtadan B nuqtaga olib boradi, tasavvur esa har qanday manzilga yetaklay oladi.",
    uz: "Mantiq sizni A nuqtadan B nuqtaga olib boradi, tasavvur esa har qanday manzilga yetaklay oladi.",
    author: "Albert Eynshteyn",
    de: "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.",
    category: "✦ KUN HIKMATI · ILHOM",
    cat: "✦ KUN HIKMATI · ILHOM"
  },
  {
    id: 'quote-2',
    quote: "Kurashgan inson yutqazishi mumkin. Kurashmagan esa allaqachon mag'lubdir.",
    uz: "Kurashgan inson yutqazishi mumkin. Kurashmagan esa allaqachon mag'lubdir.",
    author: "Bertolt Brext",
    de: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
    category: "✦ KUN HIKMATI · SHIDDAT",
    cat: "✦ KUN HIKMATI · SHIDDAT"
  },
  {
    id: 'quote-3',
    quote: "Biz takror va takror nima qilsak, o'shamiz. Demak, yuksaklik — bu harakat emas, balki odatdir.",
    uz: "Biz takror va takror nima qilsak, o'shamiz. Demak, yuksaklik — bu harakat emas, balki odatdir.",
    author: "Aristotel",
    de: "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.",
    category: "✦ KUN HIKMATI · ODATLAR",
    cat: "✦ KUN HIKMATI · ODATLAR"
  },
  {
    id: 'quote-4',
    quote: "Ming chaqirimlik yo'l ham birgina kichik qadam bilan boshlanadi.",
    uz: "Ming chaqirimlik yo'l ham birgina kichik qadam bilan boshlanadi.",
    author: "Lao-szi",
    de: "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.",
    category: "✦ KUN HIKMATI · SABOT",
    cat: "✦ KUN HIKMATI · SABOT"
  }
];

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

function extractQuoteId(context, body) {
  const { request, params } = context;
  if (params && params.path && params.path.length > 0) {
    const raw = params.path[0];
    if (raw && raw !== 'quotes') return String(raw).trim();
  }

  try {
    const url = new URL(request.url);
    const m = url.pathname.match(/\/(?:api\/admin\/|admin\/)?quotes\/([^/]+)/);
    if (m && m[1] && m[1] !== 'quotes') {
      return decodeURIComponent(m[1]).trim();
    }
    const q = url.searchParams.get('id');
    if (q) return String(q).trim();
  } catch (_) {}

  if (body && body.id) return String(body.id).trim();
  return '';
}

async function getStoredQuotes(env) {
  if (env && env.POSTS_KV) {
    try {
      let raw = await env.POSTS_KV.get(KV_QUOTES_KEY);
      if (!raw) raw = await env.POSTS_KV.get('weekly_quotes');
      if (raw) {
        const parsed = JSON.parse(raw);
        const arr = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.quotes) ? parsed.quotes : null);
        if (arr && arr.length) return arr;
      }
    } catch (_) {}
  }
  return [...DEFAULT_QUOTES];
}

// GET /quotes
export async function onRequestGet(context) {
  const { request, env } = context;
  const quotes = await getStoredQuotes(env);
  return jsonResponse({ ok: true, quotes }, 200, request, env);
}

// POST /quotes — yangi hikmat qo'shish yoki yangilash
export async function onRequestPost(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'quotes-edit', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const uzText = body.uz || body.text || body.quote || '';
    if (!uzText && !body.de) {
      return jsonResponse({ ok: false, error: "O'zbekcha yoki nemischa iqtibos matni talab qilinadi" }, 400, request, env);
    }

    const quotes = await getStoredQuotes(env);
    const finalCat = body.category || body.cat || '✦ KUN HIKMATI';

    const newQuote = {
      id: body.id ? String(body.id).trim() : 'quote_' + Date.now(),
      quote: String(uzText || body.de).trim(),
      uz: String(uzText).trim(),
      de: body.de ? String(body.de).trim() : '',
      author: body.author ? String(body.author).trim() : "Noma'lum",
      category: String(finalCat).trim(),
      cat: String(finalCat).trim(),
      updatedAt: Date.now()
    };

    const existingIdx = quotes.findIndex(q => String(q.id) === String(newQuote.id));
    if (existingIdx >= 0) {
      quotes[existingIdx] = Object.assign({}, quotes[existingIdx], newQuote);
    } else {
      quotes.unshift(newQuote);
    }

    if (env && env.POSTS_KV) {
      await env.POSTS_KV.put(KV_QUOTES_KEY, JSON.stringify(quotes));
    }

    return jsonResponse({ ok: true, quote: newQuote, quotes, message: "Iqtibos muvaffaqiyatli qo'shildi" }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}

// PUT /quotes/:id yoki body { id, ... } — hikmatni tahrirlash
export async function onRequestPut(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'quotes-put', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const id = extractQuoteId(context, body);
    if (!id) {
      return jsonResponse({ ok: false, error: "Iqtibos ID ko'rsatilmadi" }, 400, request, env);
    }

    const quotes = await getStoredQuotes(env);
    const idx = quotes.findIndex(q => String(q.id) === String(id));
    if (idx < 0) {
      return jsonResponse({ ok: false, error: "Iqtibos topilmadi" }, 404, request, env);
    }

    const target = { ...quotes[idx] };
    const uzText = body.uz !== undefined ? body.uz : (body.text !== undefined ? body.text : body.quote);
    if (uzText !== undefined) {
      target.uz = String(uzText).trim();
      target.quote = String(uzText).trim();
    }
    if (body.de !== undefined) target.de = String(body.de).trim();
    if (body.author !== undefined) target.author = String(body.author).trim();
    const finalCat = body.category !== undefined ? body.category : body.cat;
    if (finalCat !== undefined) {
      target.category = String(finalCat).trim();
      target.cat = String(finalCat).trim();
    }
    target.updatedAt = Date.now();

    quotes[idx] = target;

    if (env && env.POSTS_KV) {
      await env.POSTS_KV.put(KV_QUOTES_KEY, JSON.stringify(quotes));
    }

    return jsonResponse({ ok: true, quote: target, quotes, message: "Iqtibos muvaffaqiyatli tahrirlandi" }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}

// DELETE /quotes/:id yoki body { id } — hikmatni o'chirish
export async function onRequestDelete(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'quotes-del', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    let body = {};
    try { body = await request.json(); } catch (_) { body = {}; }
    const id = extractQuoteId(context, body);
    if (!id) {
      return jsonResponse({ ok: false, error: "Iqtibos ID ko'rsatilmadi" }, 400, request, env);
    }

    const quotes = await getStoredQuotes(env);
    const idx = quotes.findIndex(q => String(q.id) === String(id));
    if (idx < 0) {
      return jsonResponse({ ok: false, error: "Iqtibos topilmadi" }, 404, request, env);
    }

    quotes.splice(idx, 1);

    if (env && env.POSTS_KV) {
      await env.POSTS_KV.put(KV_QUOTES_KEY, JSON.stringify(quotes));
    }

    return jsonResponse({ ok: true, message: "Iqtibos muvaffaqiyatli o'chirildi", quotes }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}
