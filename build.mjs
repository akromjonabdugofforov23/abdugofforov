// ============================================================
// Build skripti — statik fayllarni minifikatsiya/obfuskatsiya qilib
// `dist/` papkasiga chiqaradi. Cloudflare Pages buni "Build output
// directory = dist" sifatida deploy qiladi.
//
// MUHIM: `functions/` papkasi LOYIHA ILDIZIDA qoladi (dist ichida emas) —
// Cloudflare Pages funksiyalarni ildizdagi /functions dan oladi.
//
// Minifikatsiya:
//   - JS  -> terser (mangle local, toplevel=false => global nomlar saqlanadi,
//            shuning uchun fayllararo global funksiyalar buzilmaydi)
//   - CSS -> clean-css
//   - HTML-> html-minifier-terser (ichki <script>/<style> ham minify bo'ladi)
// ============================================================

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify as terserMinify } from 'terser';
import CleanCSS from 'clean-css';
import { minify as htmlMinify } from 'html-minifier-terser';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'dist');

const JS_FILES = ['data-flashcards.js', 'data-tests.js', 'app.js', 'auth.js', 'i18n.js', 'storage.js', 'sw.js', 'kay.js', 'deutsch.js', 'tools.js'];
const CSS_FILES = ['style.css'];
const HTML_FILES = ['index.html', 'kay.html', 'deutsch.html', 'tools.html', 'clock.html'];
// Statik fayllar (o'zgartirilmasdan ko'chiriladi)
const COPY_FILES = [
  '_headers', 'robots.txt', 'sitemap.xml', 'manifest.webmanifest',
  'icon.svg', 'og-image.svg', 'animations.css', 'style.min.css',
];
const COPY_DIRS = ['images', 'css', 'data'];

// terser sozlamalari: toplevel=false => global (top-level) nomlar SAQLANADI.
// Bu fayllararo global funksiyalar (escapeHTML, i18n, ...) va kay.html'dagi
// onclick="editPost(...)" kabi havolalar buzilmasligini kafolatlaydi.
const TERSER_OPTS = {
  compress: { drop_console: false, passes: 3, dead_code: true },
  mangle: { toplevel: false },
  format: { comments: false },
  module: false,
};

async function copyFile(name) {
  const src = path.join(ROOT, name);
  try {
    await fs.access(src);
    await fs.copyFile(src, path.join(OUT, name));
  } catch {}
}

async function copyDir(name) {
  const src = path.join(ROOT, name);
  const dest = path.join(OUT, name);
  try {
    await fs.access(src);
    await fs.cp(src, dest, {
      recursive: true,
      filter: (source) => {
        const basename = path.basename(source).toLowerCase();
        // Xavfsizlik: Baza, developer va maxfiy ma'lumotlar dist/ ga ko'chirilmasligi shart
        if (basename === 'db.json' || basename.endsWith('.tmp') || basename === 'users.json' || basename === 'gemini.md' || basename === 'readme.md' || basename.endsWith('.md') || basename.endsWith('.ps1') || basename.endsWith('.py') || basename.endsWith('.bak')) {
          return false;
        }
        return true;
      }
    });
  } catch {}
}

async function buildScripts() {
  const scriptsDir = path.join(ROOT, 'scripts');
  const outScriptsDir = path.join(OUT, 'scripts');
  await fs.mkdir(outScriptsDir, { recursive: true });
  const entries = await fs.readdir(scriptsDir, { withFileTypes: true });
  const rows = [];
  const EXCLUDE_EXTS = ['.ps1', '.py', '.tmp', '.bak', '.sh'];
  const STUB_FILES = ['ai-innovations.js', 'ai-summary-bookmarks.js', 'luxury-clock-modal.js', 'reader-mode.js'];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const lower = entry.name.toLowerCase();
    const ext = path.extname(lower);
    if (EXCLUDE_EXTS.includes(ext) || STUB_FILES.includes(lower)) {
      continue;
    }

    const srcPath = path.join(scriptsDir, entry.name);
    const destPath = path.join(outScriptsDir, entry.name);
    await fs.mkdir(outScriptsDir, { recursive: true });
    if (entry.name.endsWith('.js')) {
      const code = await fs.readFile(srcPath, 'utf8');
      try {
        const res = await terserMinify({ [entry.name]: code }, TERSER_OPTS);
        await fs.mkdir(outScriptsDir, { recursive: true });
        await fs.writeFile(destPath, res.code, 'utf8');
        rows.push({ name: 'scripts/' + entry.name, before: code.length, after: res.code.length });
      } catch (err) {
        console.warn('Terser warning for scripts/' + entry.name, err.message);
        await fs.mkdir(outScriptsDir, { recursive: true });
        await fs.copyFile(srcPath, destPath);
      }
    } else {
      await fs.mkdir(outScriptsDir, { recursive: true });
      await fs.copyFile(srcPath, destPath);
    }
  }
  return rows;
}

const BUILD_HASH = Date.now().toString(36);

function injectCacheBusting(html, hash) {
  // <script src="..."> dagi mahalliy JS fayllarga ?v=hash qo'shish/yangilash
  let res = html.replace(/(<script\b[^>]*\bsrc=["'])(?!https?:\/\/|\/\/|data:)([^"'>]+)(["'][^>]*>)/gi, (match, prefix, url, suffix) => {
    const cleanUrl = url.split('?')[0];
    return `${prefix}${cleanUrl}?v=${hash}${suffix}`;
  });

  // <link rel="stylesheet" href="..."> dagi mahalliy CSS fayllarga ?v=hash qo'shish/yangilash
  res = res.replace(/(<link\b[^>]*\bhref=["'])(?!https?:\/\/|\/\/|data:)([^"'>]+\.css)(?:\?[^"'>]*)?(["'][^>]*>)/gi, (match, prefix, url, suffix) => {
    const cleanUrl = url.split('?')[0];
    return `${prefix}${cleanUrl}?v=${hash}${suffix}`;
  });

  return res;
}

async function buildJs(name) {
  let code = await fs.readFile(path.join(ROOT, name), 'utf8');
  if (name === 'sw.js') {
    code = code.replace(/const CACHE = ['"][^'"]+['"];/, `const CACHE = 'abdu-cache-${BUILD_HASH}';`);
  }
  const res = await terserMinify({ [name]: code }, TERSER_OPTS);
  if (res.error) throw res.error;
  await fs.writeFile(path.join(OUT, name), res.code, 'utf8');
  return { name, before: code.length, after: res.code.length };
}

async function buildCss(name) {
  const code = await fs.readFile(path.join(ROOT, name), 'utf8');
  const out = new CleanCSS({ level: 2 }).minify(code);
  if (out.errors && out.errors.length) throw new Error(out.errors.join('; '));
  await fs.writeFile(path.join(OUT, name), out.styles, 'utf8');
  await fs.writeFile(path.join(OUT, 'style.min.css'), out.styles, 'utf8');
  await fs.writeFile(path.join(ROOT, 'style.min.css'), out.styles, 'utf8');
  return { name, before: code.length, after: out.styles.length };
}

async function buildHtml(name) {
  let code = await fs.readFile(path.join(ROOT, name), 'utf8');
  code = injectCacheBusting(code, BUILD_HASH);
  const out = await htmlMinify(code, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    // Ichki <script> larni terser bilan minify (toplevel default = false => xavfsiz)
    minifyJS: { compress: { passes: 2 }, mangle: { toplevel: false }, format: { comments: false } },
    keepClosingSlash: true,
    removeScriptTypeAttributes: false,
    removeStyleLinkTypeAttributes: false,
  });
  await fs.writeFile(path.join(OUT, name), out, 'utf8');
  return { name, before: code.length, after: out.length };
}

function report(rows) {
  for (const r of rows) {
    const pct = r.before ? Math.round((1 - r.after / r.before) * 100) : 0;
    console.log(`  ${r.name.padEnd(24)} ${String(r.before).padStart(7)} -> ${String(r.after).padStart(7)} bayt (-${pct}%)`);
  }
}

async function filterExisting(files) {
  const existing = [];
  for (const f of files) {
    try {
      await fs.access(path.join(ROOT, f));
      existing.push(f);
    } catch {}
  }
  return existing;
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  console.log('JS minify (terser):');
  report(await Promise.all((await filterExisting(JS_FILES)).map(buildJs)));

  console.log('Scripts JS minify (terser):');
  report(await buildScripts());

  console.log('CSS minify (clean-css):');
  report(await Promise.all((await filterExisting(CSS_FILES)).map(buildCss)));

  console.log('HTML minify (html-minifier-terser):');
  report(await Promise.all((await filterExisting(HTML_FILES)).map(buildHtml)));

  for (const f of COPY_FILES) await copyFile(f);
  for (const d of COPY_DIRS) await copyDir(d);

  console.log('\nTayyor: dist/ (statik). funksiyalar /functions ildizida qoladi.');
}

main().catch((e) => { console.error('BUILD XATO:', e); process.exit(1); });
