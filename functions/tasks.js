// functions/tasks.js
// Cloudflare Pages Function — Rejalar / Tasks API (/tasks va /api/admin/tasks)
// GET: barcha rejalarni qaytarish (KV: tasks:list)
// POST: yangi reja qo'shish
// PUT: reja holatini yoki sarlavhasini o'zgartirish (id bo'yicha)
// DELETE: rejani o'chirish (id bo'yicha)

import { jsonResponse, corsHeaders, isAdmin, rateLimit, tooManyRequests } from './_lib.js';

const KV_TASKS_KEY = 'tasks:list';

const DEFAULT_TASKS = [
  { id: 'task-1', title: 'Deutsch Akademiya B2 grammatika modulini yangilash', status: 'progress', createdAt: Date.now() - 86400000 },
  { id: 'task-2', title: "O'quvchilar o'rtasida haftalik grammatika turnirini boshlash", status: 'todo', createdAt: Date.now() - 43200000 },
  { id: 'task-3', title: 'Sayt xavfsizligini A+ darajasiga chiqarish va CSP ni sozlash', status: 'done', createdAt: Date.now() - 172800000 }
];

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

function extractTaskId(context, body) {
  const { request, params } = context;
  if (params && params.path && params.path.length > 0) {
    const raw = params.path[0];
    if (raw && raw !== 'tasks') return String(raw).trim();
  }

  try {
    const url = new URL(request.url);
    const m = url.pathname.match(/\/(?:api\/admin\/|admin\/)?tasks\/([^/]+)/);
    if (m && m[1] && m[1] !== 'tasks') {
      return decodeURIComponent(m[1]).trim();
    }
    const q = url.searchParams.get('id');
    if (q) return String(q).trim();
  } catch (_) {}

  if (body && body.id) return String(body.id).trim();
  return '';
}

async function getStoredTasks(env) {
  if (env && env.POSTS_KV) {
    try {
      const raw = await env.POSTS_KV.get(KV_TASKS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (_) {}
  }
  return [...DEFAULT_TASKS];
}

// GET /tasks
export async function onRequestGet(context) {
  const { request, env } = context;
  const tasks = await getStoredTasks(env);
  return jsonResponse({ ok: true, tasks }, 200, request, env);
}

// POST /tasks — yangi reja qo'shish yoki yangilash
export async function onRequestPost(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'tasks-edit', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json().catch(() => ({}));
    if (!body || !body.title) {
      return jsonResponse({ ok: false, error: "Vazifa nomi kiritilishi shart" }, 400, request, env);
    }

    const tasks = await getStoredTasks(env);

    const newTask = {
      id: body.id ? String(body.id).trim() : 'task_' + Date.now(),
      title: String(body.title).trim(),
      description: body.description ? String(body.description).trim() : '',
      status: ['todo', 'progress', 'done', 'in_progress', 'completed'].includes(body.status) ? body.status : 'todo',
      priority: ['low', 'medium', 'high'].includes(body.priority) ? body.priority : 'medium',
      dueDate: body.dueDate || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      createdAt: body.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    const existingIdx = tasks.findIndex(t => String(t.id) === String(newTask.id));
    if (existingIdx >= 0) {
      tasks[existingIdx] = Object.assign({}, tasks[existingIdx], newTask);
    } else {
      tasks.unshift(newTask);
    }

    if (env && env.POSTS_KV) {
      await env.POSTS_KV.put(KV_TASKS_KEY, JSON.stringify(tasks));
    }

    return jsonResponse({ ok: true, task: newTask, tasks, message: "Vazifa muvaffaqiyatli qo'shildi" }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}

// PUT /tasks/:id yoki body { id, ... } — reja holatini yoki sarlavhasini o'zgartirish
export async function onRequestPut(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'tasks-put', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const id = extractTaskId(context, body);
    if (!id) {
      return jsonResponse({ ok: false, error: "Vazifa ID ko'rsatilmadi" }, 400, request, env);
    }

    const tasks = await getStoredTasks(env);
    const idx = tasks.findIndex(t => String(t.id) === String(id));
    if (idx < 0) {
      return jsonResponse({ ok: false, error: "Vazifa topilmadi" }, 404, request, env);
    }

    const target = { ...tasks[idx] };
    if (body.title !== undefined) target.title = String(body.title).trim();
    if (body.description !== undefined) target.description = String(body.description).trim();
    if (body.status !== undefined && ['todo', 'progress', 'done', 'in_progress', 'completed'].includes(body.status)) {
      target.status = body.status;
    }
    if (body.priority !== undefined && ['low', 'medium', 'high'].includes(body.priority)) {
      target.priority = body.priority;
    }
    if (body.dueDate !== undefined) target.dueDate = body.dueDate;
    if (body.tags !== undefined) target.tags = Array.isArray(body.tags) ? body.tags : [];
    target.updatedAt = Date.now();

    tasks[idx] = target;

    if (env && env.POSTS_KV) {
      await env.POSTS_KV.put(KV_TASKS_KEY, JSON.stringify(tasks));
    }

    return jsonResponse({ ok: true, task: target, tasks, message: "Vazifa muvaffaqiyatli tahrirlandi" }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}

// DELETE /tasks/:id yoki body { id } — rejani o'chirish
export async function onRequestDelete(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'tasks-del', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    let body = {};
    try { body = await request.json(); } catch (_) { body = {}; }
    const id = extractTaskId(context, body);
    if (!id) {
      return jsonResponse({ ok: false, error: "Vazifa ID ko'rsatilmadi" }, 400, request, env);
    }

    const tasks = await getStoredTasks(env);
    const idx = tasks.findIndex(t => String(t.id) === String(id));
    if (idx < 0) {
      return jsonResponse({ ok: false, error: "Vazifa topilmadi" }, 404, request, env);
    }

    tasks.splice(idx, 1);

    if (env && env.POSTS_KV) {
      await env.POSTS_KV.put(KV_TASKS_KEY, JSON.stringify(tasks));
    }

    return jsonResponse({ ok: true, message: "Vazifa muvaffaqiyatli o'chirildi", tasks }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato", message: err.message }, 400, request, env);
  }
}
