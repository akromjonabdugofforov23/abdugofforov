// Cloudflare Pages Function — Loyihalar API (/projects)
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
    techStack: ['HTML5', 'Canvas', 'JavaScript', 'Tailwind'],
    link: '/tools',
    github: 'https://github.com/akrin4477/abdugofforov',
    status: 'active'
  },
  {
    id: 'proj_deutsch_akademie',
    title: 'Deutsch Akademiya (A1-B2)',
    cat: 'Ta\'lim & Til',
    category: 'Ta\'lim & Til',
    desc: "Nemis tilini interaktiv o'rganish platformasi: darslar, grammatika, audio lug'at, testlar va SRS fleshkartalar.",
    description: "Nemis tilini interaktiv o'rganish platformasi: darslar, grammatika, audio lug'at, testlar va SRS fleshkartalar.",
    tech: ['Vanilla JS', 'IndexedDB', 'Audio API', 'CSS Grid'],
    techStack: ['Vanilla JS', 'IndexedDB', 'Audio API', 'CSS Grid'],
    link: '/deutsch',
    github: 'https://github.com/akrin4477/abdugofforov',
    status: 'active'
  },
  {
    id: 'proj_3d_lab',
    title: '3D Lab & Universe',
    cat: 'Grafika & Three.js',
    category: 'Grafika & Three.js',
    desc: "Three.js va WebGL texnologiyasiga asoslangan interaktiv kosmik fazo, sayyoralar va vizual 3D laboratoriyasi.",
    description: "Three.js va WebGL texnologiyasiga asoslangan interaktiv kosmik fazo, sayyoralar va vizual 3D laboratoriyasi.",
    tech: ['Three.js', 'WebGL', 'GLSL', 'Math'],
    techStack: ['Three.js', 'WebGL', 'GLSL', 'Math'],
    link: '/3d-lab',
    github: 'https://github.com/akrin4477/abdugofforov',
    status: 'active'
  }
];

export async function onRequestOptions(context) {
  return new Response(null, { headers: corsHeaders(context.request, context.env) });
}

export async function onRequestGet(context) {
  const { request, env } = context;

  if (env && env.POSTS_KV) {
    try {
      const raw = await env.POSTS_KV.get(KV_PROJECTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          return jsonResponse({ ok: true, projects: parsed }, 200, request, env);
        }
      }
    } catch (_) {}
  }

  return jsonResponse({ ok: true, projects: DEFAULT_PROJECTS }, 200, request, env);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const rl = await rateLimit(env, request, 'projects-edit', 30, 60);
  if (!rl.ok) return tooManyRequests(request, rl.retryAfter, env);

  const auth = await isAdmin(env, request);
  if (!auth) {
    return jsonResponse({ ok: false, error: "Faqat admin uchun" }, 401, request, env);
  }

  try {
    const body = await request.json();
    if (!body || !body.title) {
      return jsonResponse({ ok: false, error: "Loyiha nomi kiritilishi shart" }, 400, request, env);
    }

    let projects = DEFAULT_PROJECTS;
    if (env && env.POSTS_KV) {
      try {
        const raw = await env.POSTS_KV.get(KV_PROJECTS_KEY);
        if (raw) projects = JSON.parse(raw);
      } catch (_) {}
    }

    const newProject = {
      id: body.id || 'proj_' + Date.now(),
      title: String(body.title).trim(),
      desc: body.desc || body.description || '',
      description: body.desc || body.description || '',
      cat: body.cat || body.category || 'Loyihalar',
      category: body.cat || body.category || 'Loyihalar',
      tech: body.tech || body.techStack || [],
      techStack: body.tech || body.techStack || [],
      link: body.link || '',
      github: body.github || '',
      status: body.status || 'active',
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

    return jsonResponse({ ok: true, project: newProject, projects }, 200, request, env);
  } catch (err) {
    return jsonResponse({ ok: false, error: "So'rovni qayta ishlashda xato" }, 400, request, env);
  }
}
