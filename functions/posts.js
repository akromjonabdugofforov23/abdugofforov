// functions/posts.js
// Cloudflare Pages Function — Postlar API (/posts va /api/admin/posts)
// GET: barcha postlarni qaytarish
// POST: bitta post yaratish yoki tahrirlash (Telegramga xabar bilan)
// PUT: bulk update ({ posts: [...] }) yoki bitta postni tahrirlash (/posts/:id)
// DELETE: bitta postni o'chirish (id bo'yicha)

import {
  jsonResponse,
  corsHeaders,
  isAdmin,
  rateLimit,
  tooManyRequests
} from './_lib.js';

const KV_KEY = 'posts:list';
const MAX_BYTES = 24 * 1024 * 1024; // 24MB

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

function extractPostId(context, body) {
  const { request, params } = context;
  if (params && params.path && params.path.length > 0) {
    const raw = params.path[0];
    if (raw && raw !== 'posts') return String(raw).trim();
  }

  try {
    const url = new URL(request.url);
    const m = url.pathname.match(/\/(?:api\/admin\/|admin\/)?posts\/([^/]+)/);
    if (m && m[1] && m[1] !== 'posts') {
      return decodeURIComponent(m[1]).trim();
    }
    const q = url.searchParams.get('id');
    if (q) return String(q).trim();
  } catch (_) {}

  if (body && body.id) return String(body.id).trim();
  return '';
}

async function sendTelegramPost(env, post) {
  if (!env || !env.TELEGRAM_BOT_TOKEN) return;
  const chatId = env.TELEGRAM_CHANNEL_ID || env.TELEGRAM_ADMIN_CHAT_ID || env.TELEGRAM_CHAT_ID;
  if (!chatId) return;

  const text = `📰 <b>Yangi Hikoya / Maqola!</b>\n\n` +
               `✨ <b>${post.title}</b>\n\n` +
               `${post.excerpt || (post.content ? post.content.slice(0, 180) : '')}...\n\n` +
               `🔗 Saytda o'qish: <a href="https://abdugofforov.uz/#blog">abdugofforov.uz</a>`;

  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });
  } catch (_) {}
}

async function getStoredPosts(env) {
  if (!env || !env.POSTS_KV) return [];
  try {
    const raw = await env.POSTS_KV.get(KV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

// GET /posts
export async function onRequestGet(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: true, posts: [], configured: false }, 200, request, env);
  }

  const posts = await getStoredPosts(env);
  const singleId = extractPostId(context, null);
  if (singleId) {
    const post = posts.find(p => String(p.id) === String(singleId));
    if (!post) {
      return jsonResponse({ ok: false, error: "Post topilmadi" }, 404, request, env);
    }
    return jsonResponse({ ok: true, post }, 200, request, env);
  }

  return jsonResponse({ ok: true, posts, configured: true }, 200, request, env);
}

// POST /posts yoki /api/admin/posts — bitta post yaratish yoki yangilash
export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, configured: false, message: "KV ombori ulanmagan" }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'posts-post', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { id, title, content, excerpt, tags, published, slug, image, coverImage } = body;
    if (!title || !content) {
      return jsonResponse({ ok: false, error: "Sarlavha va kontent kiritilishi shart" }, 400, request, env);
    }

    const posts = await getStoredPosts(env);
    const postImage = image ? String(image).trim() : (coverImage ? String(coverImage).trim() : '');

    // Mavjud postni yangilash
    if (id && posts.some(p => String(p.id) === String(id))) {
      const idx = posts.findIndex(p => String(p.id) === String(id));
      const updated = {
        ...posts[idx],
        title: String(title).trim(),
        content: String(content).trim(),
        excerpt: excerpt ? String(excerpt).trim() : title.slice(0, 150),
        tags: Array.isArray(tags) ? tags : [],
        image: postImage || posts[idx].image || '',
        published: published !== false,
        slug: slug ? String(slug).trim() : posts[idx].slug,
        updatedAt: Date.now()
      };
      posts[idx] = updated;

      await env.POSTS_KV.put(KV_KEY, JSON.stringify(posts));

      const shouldNotifyTg = body.telegram === true || body.sendTelegram === true || body.notifyTelegram === true;
      if (updated.published && shouldNotifyTg) {
        await sendTelegramPost(env, updated);
      }

      return jsonResponse({ ok: true, post: updated, posts, message: "Post muvaffaqiyatli yangilandi" }, 200, request, env);
    }

    // Yangi post yaratish
    const newPost = {
      id: id || 'post_' + Date.now(),
      title: String(title).trim(),
      content: String(content).trim(),
      excerpt: excerpt ? String(excerpt).trim() : title.slice(0, 150),
      tags: Array.isArray(tags) ? tags : [],
      image: postImage,
      published: published !== false,
      slug: slug ? String(slug).trim() : undefined,
      author: "Abdug'afforov",
      authorId: 'admin',
      views: 0,
      likes: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    posts.unshift(newPost);
    await env.POSTS_KV.put(KV_KEY, JSON.stringify(posts));

    const shouldNotifyTg = body.telegram === true || body.sendTelegram === true || body.notifyTelegram === true;
    if (newPost.published && shouldNotifyTg) {
      await sendTelegramPost(env, newPost);
    }

    return jsonResponse({ ok: true, post: newPost, posts, message: "Yangi post yaratildi" }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}

// PUT /posts yoki /api/admin/posts — bulk update yoki bitta postni tahrirlash
export async function onRequestPut(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, configured: false, message: "KV ombori ulanmagan" }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'posts-put', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, message: "Noto'g'ri JSON" }, 400, request, env);
  }

  // 1-holat: Bulk update ({ posts: [...] })
  if (Array.isArray(body && body.posts)) {
    const cleaned = body.posts.filter(p => p && typeof p === 'object' && p.id != null && typeof p.title === 'string');
    const serialized = JSON.stringify(cleaned);
    if (serialized.length > MAX_BYTES) {
      return jsonResponse({ ok: false, message: "Ma'lumot juda katta (24MB chegara)" }, 413, request, env);
    }

    try {
      await env.POSTS_KV.put(KV_KEY, serialized);
      return jsonResponse({ ok: true, count: cleaned.length, posts: cleaned, message: "Postlar muvaffaqiyatli saqlandi" }, 200, request, env);
    } catch (e) {
      return jsonResponse({ ok: false, message: "Saqlashda xato" }, 500, request, env);
    }
  }

  // 2-holat: Bitta postni tahrirlash (/posts/:id yoki body { id, ... })
  const id = extractPostId(context, body);
  if (!id) {
    return jsonResponse({ ok: false, error: "Post ID yoki posts massivi ko'rsatilmadi" }, 400, request, env);
  }

  const posts = await getStoredPosts(env);
  const idx = posts.findIndex(p => String(p.id) === String(id));
  if (idx < 0) {
    return jsonResponse({ ok: false, error: "Post topilmadi" }, 404, request, env);
  }

  const target = { ...posts[idx] };
  const { title, content, excerpt, tags, published, slug, image, coverImage } = body;
  if (title !== undefined) target.title = String(title).trim();
  if (content !== undefined) target.content = String(content).trim();
  if (excerpt !== undefined) target.excerpt = String(excerpt).trim();
  if (tags !== undefined) target.tags = Array.isArray(tags) ? tags : [];
  if (published !== undefined) target.published = !!published;
  if (slug !== undefined) target.slug = String(slug).trim();
  if (image !== undefined) target.image = String(image).trim();
  else if (coverImage !== undefined) target.image = String(coverImage).trim();
  target.updatedAt = Date.now();

  posts[idx] = target;
  await env.POSTS_KV.put(KV_KEY, JSON.stringify(posts));

  const shouldNotifyTg = body.telegram === true || body.sendTelegram === true || body.notifyTelegram === true;
  if (target.published && shouldNotifyTg) {
    await sendTelegramPost(env, target);
  }

  return jsonResponse({ ok: true, post: target, posts, message: "Post muvaffaqiyatli tahrirlandi" }, 200, request, env);
}

// DELETE /posts/:id yoki body { id } — bitta postni o'chirish
export async function onRequestDelete(context) {
  const { env, request } = context;

  if (!env || !env.POSTS_KV) {
    return jsonResponse({ ok: false, message: "KV ombori ulanmagan" }, 503, request, env);
  }

  const rl = await rateLimit(env, request, 'posts-del', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  let body = {};
  try { body = await request.json(); } catch (_) { body = {}; }

  const id = extractPostId(context, body);
  if (!id) {
    return jsonResponse({ ok: false, error: "Post ID ko'rsatilmadi" }, 400, request, env);
  }

  const posts = await getStoredPosts(env);
  const idx = posts.findIndex(p => String(p.id) === String(id));
  if (idx < 0) {
    return jsonResponse({ ok: false, error: "Post topilmadi" }, 404, request, env);
  }

  posts.splice(idx, 1);
  await env.POSTS_KV.put(KV_KEY, JSON.stringify(posts));

  return jsonResponse({ ok: true, message: "Post muvaffaqiyatli o'chirildi", posts }, 200, request, env);
}
