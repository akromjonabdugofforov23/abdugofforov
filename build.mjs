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
import { execSync } from 'child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'dist');

const JS_FILES = ['auth.js', 'i18n.js', 'storage.js', 'sw.js'];
const JS_MODULES = [
    'js/state.js', 'js/utils.js', 'js/theme.js', 'js/clock.js', 'js/mouse-follower.js', 
    'js/posts.js', 'js/navigation.js', 'js/admin.js', 'js/music-player.js', 
    'js/deutsch-data.js', 'js/deutsch.js', 'js/flashcards.js', 'js/tournament.js', 
    'js/particles.js', 'js/animations.js', 'js/auth-ui.js', 'js/bootstrap.js'
];
const CSS_FILES = ['style.css'];
const HTML_FILES = ['index.html', 'kay.html', 'deutsch.html', 'flashcards.html', 'tournament.html'];
// Statik fayllar (o'zgartirilmasdan ko'chiriladi)
const COPY_FILES = [
  '_headers', 'robots.txt', 'sitemap.xml', 'manifest.webmanifest',
  'icon.svg', 'og-image.svg',
];
const COPY_DIRS = ['images'];

// terser sozlamalari: toplevel=false => global (top-level) nomlar SAQLANADI.
// Bu fayllararo global funksiyalar (escapeHTML, i18n, ...) va kay.html'dagi
// onclick="editPost(...)" kabi havolalar buzilmasligini kafolatlaydi.
const TERSER_OPTS = {
  compress: { drop_console: false, passes: 2 },
  mangle: { toplevel: false },
  format: { comments: false },
};

async function copyFile(name) {
  await fs.copyFile(path.join(ROOT, name), path.join(OUT, name));
}

async function copyDir(name) {
  await fs.cp(path.join(ROOT, name), path.join(OUT, name), { recursive: true });
}

async function buildJs(name) {
  const code = await fs.readFile(path.join(ROOT, name), 'utf8');
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
  return { name, before: code.length, after: out.styles.length };
}

async function buildHtml(name) {
  const code = await fs.readFile(path.join(ROOT, name), 'utf8');
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

async function main() {
  try {
    console.log('Dead Code Analyzer ishga tushirilmoqda...');
    execSync('node scripts/dead-code-analyzer.mjs --fix', { stdio: 'inherit' });
  } catch(e) {
    console.warn('Dead Code Analyzer xatolik berdi yoki node o\\'rnatilmagan. Davom etilmoqda...');
  }

  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(path.join(OUT, 'js'), { recursive: true });

  console.log('JS minify (terser):');
  report(await Promise.all(JS_FILES.map(buildJs)));
  
  console.log('JS Modules minify:');
  report(await Promise.all(JS_MODULES.map(buildJs)));

  console.log('CSS minify (clean-css):');
  report(await Promise.all(CSS_FILES.map(buildCss)));

  console.log('HTML minify (html-minifier-terser):');
  report(await Promise.all(HTML_FILES.map(buildHtml)));

  for (const f of COPY_FILES) await copyFile(f);
  for (const d of COPY_DIRS) await copyDir(d);

  console.log('\nTayyor: dist/ (statik). funksiyalar /functions ildizida qoladi.');
}

main().catch((e) => { console.error('BUILD XATO:', e); process.exit(1); });
