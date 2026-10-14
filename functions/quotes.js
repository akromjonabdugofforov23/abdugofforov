// Cloudflare Pages Function — Kun Hikmatlari API (/quotes)
import { jsonResponse, corsHeaders, isAdmin, rateLimit, tooManyRequests } from './_lib.js';

const KV_QUOTES_KEY = 'quotes:list';

const DEFAULT_QUOTES = [
  {
    id: 'quote-1',
    quote: "Mantiq sizni A nuqtadan B nuqtaga olib boradi, tasavvur esa har qanday manzilga yetaklay oladi.",
    author: "Albert Eynshteyn",
    de: "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.",
    category: "✦ KUN HIKMATI · ILHOM"
  },
  {
    id: 'quote-2',
    quote: "Kurashgan inson yutqazishi mumkin. Kurashmagan esa allaqachon mag'lubdir.",
    author: "Bertolt Brext",
    de: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
    category: "✦ KUN HIKMATI · SHIDDAT"
  },
  {
    id: 'quote-3',
    quote: "Biz takror va takror nima qilsak, o'shamiz. Demak, yuksaklik — bu harakat emas, balki odatdir.",
    author: "Aristotel",
    de: "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.",
    category: "✦ KUN HIKMATI · ODATLAR"
  },
  {
    id: 'quote-4',
    quote: "Ming chaqirimlik yo'l ham birgina kichik qadam bilan boshlanadi.",
    author: "Lao-szi",
    de: "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.",
    category: "✦ KUN HIKMATI · SABOT"
  }
];

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestGet(context) {
  const { request, env } = context;

  if (env && env.POSTS_KV) {
    try {
      let raw = await env.POSTS_KV.get(KV_QUOTES_KEY);
      if (!raw) raw = await env.POSTS_KV.get('weekly_quotes');
      if (raw) {
        const parsed = JSON.parse(raw);
        const quotesArray = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.quotes) ? parsed.quotes : null);
        if (quotesArray && quotesArray.length) {
          return jsonResponse({ ok: true, quotes: quotesArray }, 200, request, env);
        }
      }
    } catch (_) {}
  }

  return jsonResponse({ ok: true, quotes: DEFAULT_QUOTES }, 200, request, env);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'quotes-edit', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json();
    if (!body || !body.quote) {
      return jsonResponse({ ok: false, error: "Iqtibos matni kiritilishi shart" }, 400, request, env);
    }

    let quotes = DEFAULT_QUOTES;
    if (env && env.POSTS_KV) {
      try {
        const raw = await env.POSTS_KV.get(KV_QUOTES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) quotes = parsed;
        }
      } catch (_) {}
    }

    const newQuote = {
      id: body.id || 'quote_' + Date.now(),
      quote: String(body.quote).trim(),
      author: body.author ? String(body.author).trim() : 'Noma\'lum',
      de: body.de ? String(body.de).trim() : '',
      category: body.category || 'Hikmat',
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

    return jsonResponse({ ok: true, quote: newQuote, quotes }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato" }, 400, request, env);
  }
}
