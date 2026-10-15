// functions/projects.js
// Cloudflare Pages Function — Loyihalar API (/projects va /api/admin/projects)
// GET: barcha loyihalarni qaytarish (KV: projects:list)
// POST: yangi loyiha qo'shish
// PUT: loyihani tahrirlash (id bo'yicha)
// DELETE: loyihani o'chirish (id bo'yicha)

import { jsonResponse, corsHeaders, isAdmin, rateLimit, tooManyRequests } from './_lib.js';

const KV_PROJECTS_KEY = 'projects:list';

const DEFAULT_PROJECTS = [
  {
    id: 'proj_tools_lab',
    title: 'Tools Lab (Mikro-asboblar)',
    cat: 'Web Ilova & Asboblar',
    category: 'Web Ilova & Asboblar',
    desc: "Keng qamrovli veb-muhandislik asboblari: WebP konvertori, JSON formatlovchi, Base64 dekoder va ranglar palitrasi.",
    description: "Keng qamrovli veb-muhandislik asboblari: WebP konvertori, JSON formatlovchi, Base64 dekoder va ranglar palitrasi.",
    tech: ['HTML5', 'Canvas', 'JavaScript', 'Tailwind'],
    tags: ['HTML5', 'Canvas', 'JavaScript', 'Tailwind'],
    techStack: ['HTML5', 'Canvas', 'JavaScript', 'Tailwind'],
    link: '/tools',
    github: 'https://github.com/akrin4477/abdugofforov',
    status: 'active'
  },
  {
    id: 'proj_deutsch_akademie',
    title: 'Deutsch Akademiya (A1-B2)',
    cat: "Ta'lim & Til",
    category: "Ta'lim & Til",
    desc: "Nemis tilini interaktiv o'rganish platformasi: darslar, grammatika, audio lug'at, testlar va SRS fleshkartalar.",
    description: "Nemis tilini interaktiv o'rganish platformasi: darslar, grammatika, audio lug'at, testlar va SRS fleshkartalar.",
    tech: ['Vanilla JS', 'IndexedDB', 'Audio API', 'CSS Grid'],
    tags: ['Vanilla JS', 'IndexedDB', 'Audio API', 'CSS Grid'],
    techStack: ['Vanilla JS', 'IndexedDB', 'Audio API', 'CSS Grid'],
    link: '/deutsch',
    github: 'https://github.com/akrin4477/abdugofforov',
    status: 'active'
  }
];

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

function extractProjectId(context, body) {
  const { request, params } = context;
  if (params && params.path && params.path.length > 0) {
    const raw = params.path[0];
    if (raw && raw !== 'projects') return String(raw).trim();
  }

  try {
    const url = new URL(request.url);
    const m = url.pathname.match(/\/(?:api\/admin\/|admin\/)?projects\/([^/]+)/);
    if (m && m[1] && m[1] !== 'projects') {
      return decodeURIComponent(m[1]).trim();
    }
    const q = url.searchParams.get('id');
    if (q) return String(q).trim();
  } catch (_) {}

  if (body && body.id) return String(body.id).trim();
  return '';
}

async function getStoredProjects(env) {
  if (env && env.POSTS_KV) {
    try {
      const raw = await env.POSTS_KV.get(KV_PROJECTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (_) {}
  }
  return [...DEFAULT_PROJECTS];
}

// GET /projects
export async function onRequestGet(context) {
  const { request, env } = context;
  const projects = await getStoredProjects(env);
  return jsonResponse({ ok: true, projects }, 200, request, env);
}

// POST /projects — yangi loyiha yaratish yoki mavjudini yangilash
export async function onRequestPost(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'projects-edit', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const finalDesc = body.description || body.desc;
    if (!body || !body.title || !finalDesc) {
      return jsonResponse({ ok: false, error: "Loyiha nomi va tavsifi kiritilishi shart" }, 400, request, env);
    }

    const projects = await getStoredProjects(env);

    const finalCat = body.category || body.cat || 'General';
    const finalTech = Array.isArray(body.tags) ? body.tags : (Array.isArray(body.tech) ? body.tech : (Array.isArray(body.techStack) ? body.techStack : []));

    const newProject = {
      id: body.id ? String(body.id).trim() : 'proj_' + Date.now(),
      title: String(body.title).trim(),
      description: String(finalDesc).trim(),
      desc: String(finalDesc).trim(),
      link: body.link ? String(body.link).trim() : '#',
      github: body.github ? String(body.github).trim() : '',
      category: String(finalCat).trim(),
      cat: String(finalCat).trim(),
      tags: finalTech,
      tech: finalTech,
      techStack: finalTech,
      status: body.status ? String(body.status).trim() : 'active',
      icon: body.icon ? String(body.icon).trim() : 'fa-code',
      image: body.image ? String(body.image).trim() : '',
      updatedAt: Date.now()
    };

    const existingIdx = projects.findIndex(p => String(p.id) === String(newProject.id));
    if (existingIdx >= 0) {
      projects[existingIdx] = Object.assign({}, projects[existingIdx], newProject);
    } else {
      projects.unshift(newProject);
    }

    if (env && env.POSTS_KV) {
      await env.POSTS_KV.put(KV_PROJECTS_KEY, JSON.stringify(projects));
    }

    return jsonResponse({ ok: true, project: newProject, projects, message: "Loyiha muvaffaqiyatli qo'shildi" }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}

// PUT /projects/:id yoki body { id, ... } — loyihani tahrirlash
export async function onRequestPut(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'projects-put', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const id = extractProjectId(context, body);
    if (!id) {
      return jsonResponse({ ok: false, error: "Loyiha ID ko'rsatilmadi" }, 400, request, env);
    }

    const projects = await getStoredProjects(env);
    const idx = projects.findIndex(p => String(p.id) === String(id));
    if (idx < 0) {
      return jsonResponse({ ok: false, error: "Loyiha topilmadi" }, 404, request, env);
    }

    const target = { ...projects[idx] };
    if (body.title !== undefined) target.title = String(body.title).trim();
    const finalDesc = body.description !== undefined ? body.description : body.desc;
    if (finalDesc !== undefined) {
      target.description = String(finalDesc).trim();
      target.desc = String(finalDesc).trim();
    }
    if (body.link !== undefined) target.link = String(body.link).trim();
    if (body.github !== undefined) target.github = String(body.github).trim();
    const finalCat = body.category !== undefined ? body.category : body.cat;
    if (finalCat !== undefined) {
      target.category = String(finalCat).trim();
      target.cat = String(finalCat).trim();
    }
    const finalTech = body.tags !== undefined ? body.tags : (body.tech !== undefined ? body.tech : body.techStack);
    if (finalTech !== undefined) {
      const arr = Array.isArray(finalTech) ? finalTech : [];
      target.tags = arr;
      target.tech = arr;
      target.techStack = arr;
    }
    if (body.status !== undefined) target.status = String(body.status).trim();
    if (body.icon !== undefined) target.icon = String(body.icon).trim();
    if (body.image !== undefined) target.image = String(body.image).trim();
    target.updatedAt = Date.now();

    projects[idx] = target;

    if (env && env.POSTS_KV) {
      await env.POSTS_KV.put(KV_PROJECTS_KEY, JSON.stringify(projects));
    }

    return jsonResponse({ ok: true, project: target, projects, message: "Loyiha muvaffaqiyatli tahrirlandi" }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}

// DELETE /projects/:id yoki body { id } — loyihani o'chirish
export async function onRequestDelete(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'projects-del', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    let body = {};
    try { body = await request.json(); } catch (_) { body = {}; }
    const id = extractProjectId(context, body);
    if (!id) {
      return jsonResponse({ ok: false, error: "Loyiha ID ko'rsatilmadi" }, 400, request, env);
    }

    const projects = await getStoredProjects(env);
    const idx = projects.findIndex(p => String(p.id) === String(id));
    if (idx < 0) {
      return jsonResponse({ ok: false, error: "Loyiha topilmadi" }, 404, request, env);
    }

    projects.splice(idx, 1);

    if (env && env.POSTS_KV) {
      await env.POSTS_KV.put(KV_PROJECTS_KEY, JSON.stringify(projects));
    }

    return jsonResponse({ ok: true, message: "Loyiha muvaffaqiyatli o'chirildi", projects }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}
