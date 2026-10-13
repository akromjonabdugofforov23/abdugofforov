// Cloudflare Pages Function — Rejalar / Tasks API (/tasks)
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

export async function onRequestGet(context) {
  const { request, env } = context;

  if (env && env.POSTS_KV) {
    try {
      const raw = await env.POSTS_KV.get(KV_TASKS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          return jsonResponse({ ok: true, tasks: parsed }, 200, request, env);
        }
      }
    } catch (_) {}
  }

  return jsonResponse({ ok: true, tasks: DEFAULT_TASKS }, 200, request, env);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'tasks-edit', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json();
    if (!body || !body.title) {
      return jsonResponse({ ok: false, error: "Vazifa nomi kiritilishi shart" }, 400, request, env);
    }

    let tasks = DEFAULT_TASKS;
    if (env && env.POSTS_KV) {
      try {
        const raw = await env.POSTS_KV.get(KV_TASKS_KEY);
        if (raw) tasks = JSON.parse(raw);
      } catch (_) {}
    }

    const newTask = {
      id: body.id || 'task_' + Date.now(),
      title: String(body.title).trim(),
      status: body.status || 'todo',
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

    return jsonResponse({ ok: true, task: newTask, tasks }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato" }, 400, request, env);
  }
}
