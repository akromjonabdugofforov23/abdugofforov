// functions/admin/stats.js
// Cloudflare Pages Function — Admin Tizim Statistikasi (/admin/stats)
// Header: x-admin-token yoki x-admin-pin
// KV dan barcha asosiy jadvallar/modullar hajmini hisoblab qaytaradi

import {
  jsonResponse,
  corsHeaders,
  isAdmin,
  getUsersIndex
} from '../_lib.js';

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestGet(context) {
  const { env, request } = context;

  const admin = await isAdmin(env, request);
  if (!admin) {
    return jsonResponse({ ok: false, error: "Ruxsat berilmadi", message: "Ruxsat berilmadi (admin talab etiladi)" }, 401, request, env);
  }

  if (!env || !env.POSTS_KV) {
    return jsonResponse({
      ok: true,
      stats: {
        usersCount: 0,
        postsCount: 0,
        projectsCount: 0,
        quotesCount: 0,
        tasksCount: 0,
        resultsCount: 0,
        testsCount: 0,
        commentsCount: 0
      },
      configured: false
    }, 200, request, env);
  }

  // 1. Foydalanuvchilar soni
  let usersCount = 0;
  try {
    const uList = await getUsersIndex(env);
    usersCount = Array.isArray(uList) ? uList.length : 0;
  } catch (_) {}

  // 2. Postlar soni ('posts' yoki 'posts:list')
  let postsCount = 0;
  try {
    const rawPosts = await env.POSTS_KV.get('posts') || await env.POSTS_KV.get('posts:list');
    if (rawPosts) {
      const parsed = JSON.parse(rawPosts);
      postsCount = Array.isArray(parsed) ? parsed.length : (Array.isArray(parsed?.posts) ? parsed.posts.length : 0);
    }
  } catch (_) {}

  // 3. Loyihalar soni ('projects:all', 'projects:list', 'projects')
  let projectsCount = 0;
  try {
    const rawProj = await env.POSTS_KV.get('projects:all') || await env.POSTS_KV.get('projects:list') || await env.POSTS_KV.get('projects');
    if (rawProj) {
      const parsed = JSON.parse(rawProj);
      projectsCount = Array.isArray(parsed) ? parsed.length : (Array.isArray(parsed?.projects) ? parsed.projects.length : 0);
    }
  } catch (_) {}

  // 4. Iqtiboslar soni ('quotes:all', 'quotes:list', 'quotes')
  let quotesCount = 0;
  try {
    const rawQuotes = await env.POSTS_KV.get('quotes:all') || await env.POSTS_KV.get('quotes:list') || await env.POSTS_KV.get('quotes');
    if (rawQuotes) {
      const parsed = JSON.parse(rawQuotes);
      quotesCount = Array.isArray(parsed) ? parsed.length : (Array.isArray(parsed?.quotes) ? parsed.quotes.length : 0);
    }
  } catch (_) {}

  // 5. Rejalar soni ('tasks:all', 'tasks:list', 'tasks')
  let tasksCount = 0;
  try {
    const rawTasks = await env.POSTS_KV.get('tasks:all') || await env.POSTS_KV.get('tasks:list') || await env.POSTS_KV.get('tasks');
    if (rawTasks) {
      const parsed = JSON.parse(rawTasks);
      tasksCount = Array.isArray(parsed) ? parsed.length : (Array.isArray(parsed?.tasks) ? parsed.tasks.length : 0);
    }
  } catch (_) {}

  // 6. Natijalar / Testlar soni ('results:all', 'results:list', 'results')
  let resultsCount = 0;
  try {
    const rawResults = await env.POSTS_KV.get('results:all') || await env.POSTS_KV.get('results:list') || await env.POSTS_KV.get('results');
    if (rawResults) {
      const parsed = JSON.parse(rawResults);
      resultsCount = Array.isArray(parsed) ? parsed.length : (Array.isArray(parsed?.results) ? parsed.results.length : 0);
    }
  } catch (_) {}

  // 7. Izohlar soni ('comments:all', 'comments')
  let commentsCount = 0;
  try {
    const rawComments = await env.POSTS_KV.get('comments:all') || await env.POSTS_KV.get('comments');
    if (rawComments) {
      const parsed = JSON.parse(rawComments);
      commentsCount = Array.isArray(parsed) ? parsed.length : 0;
    }
  } catch (_) {}

  return jsonResponse({
    ok: true,
    stats: {
      usersCount,
      postsCount,
      projectsCount,
      quotesCount,
      tasksCount,
      resultsCount,
      testsCount: resultsCount,
      commentsCount,
      environment: "Cloudflare Pages",
      timestamp: Date.now()
    }
  }, 200, request, env);
}
