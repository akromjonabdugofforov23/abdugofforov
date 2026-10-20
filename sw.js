// ===== Abdugofforov PWA Service Worker =====
// App-shell keshlash: oflayn ishlash va tezroq yuklash uchun.
// CACHE versiyasini bump qildik (v2) — yangi dark dizayn keshda eski versiya
// bilan qorishib qolmasligi uchun
const CACHE = 'abdu-cache-v20';
const SHELL = [
    '/',
    '/index.html',
    '/deutsch',
    '/deutsch.html',
    '/tools',
    '/tools.html',
    '/clock.html',
    '/style.css',
    '/style.min.css',
    '/animations.css',
    '/css/liquid-glass.css',
    '/css/horror.css',
    '/css/claps-reactions.css',
    '/css/matching-game.css',
    '/css/verb-trainer.css',
    '/css/light-variants.css',
    '/css/bookmarks.css',
    '/css/cyber-hero.css',
    '/app.js',
    '/deutsch.js',
    '/tools.js',
    '/i18n.js',
    '/storage.js',
    '/auth.js',
    '/data-flashcards.js',
    '/data-tests.js',
    '/data/curriculum-a1.js',
    '/data/curriculum-a2.js',
    '/data/curriculum-b1.js',
    '/data/curriculum-b2.js',
    '/scripts/curriculum-engine.js',
    '/scripts/matching-game.js',
    '/scripts/verb-trainer.js',
    '/scripts/verb-trainer-data.js',
    '/scripts/tools-text-suite.js',
    '/scripts/tools-media-suite.js',
    '/scripts/tools-dev-suite.js',
    '/scripts/flashcards.js',
    '/scripts/tests.js',
    '/scripts/horror-data.js',
    '/scripts/horror-logic.js',
    '/scripts/gamification.js',
    '/scripts/quote-widget.js',
    '/scripts/claps-reactions.js',
    '/scripts/aesthetic-features.js',
    '/scripts/super-palette.js',
    '/scripts/story-card.js',
    '/scripts/video-lesson.js',
    '/scripts/cyber-hero-3d.js',
    '/manifest.webmanifest',
    '/icon.svg',
    '/og-image.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    // Faqat shu domen; YouTube/Unsplash/API ni keshlamaymiz
    if (url.origin !== self.location.origin) return;

    // Admin, maxfiy servislar va API funksiyalarini mutlaqo keshlamaymiz
    const noCachePaths = ['/kay', '/kay.html'];
    if (url.pathname.startsWith('/functions') || 
        url.pathname.startsWith('/admin') || 
        url.pathname.startsWith('/auth') || 
        url.pathname.startsWith('/api') || 
        url.pathname.startsWith('/posts') || 
        url.pathname.startsWith('/projects') || 
        url.pathname.startsWith('/quotes') || 
        url.pathname.startsWith('/tasks') || 
        url.pathname.startsWith('/results') || 
        url.pathname.startsWith('/tournament') || 
        noCachePaths.includes(url.pathname)) return;

    // Navigatsiya (HTML) — tarmoq birinchi, keyin kesh (oflayn ishlashi uchun)
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req).then((res) => {
                const copy = res.clone();
                const path = url.pathname;
                if (path === '/' || path === '/index.html') {
                    caches.open(CACHE).then((c) => c.put('/index.html', copy)).catch(() => {});
                } else if (path === '/deutsch' || path === '/deutsch.html') {
                    caches.open(CACHE).then((c) => {
                        c.put('/deutsch.html', copy);
                        c.put('/deutsch', copy.clone());
                    }).catch(() => {});
                } else if (path === '/tools' || path === '/tools.html') {
                    caches.open(CACHE).then((c) => {
                        c.put('/tools.html', copy);
                        c.put('/tools', copy.clone());
                    }).catch(() => {});
                }
                return res;
            }).catch(() => {
                const path = url.pathname;
                if (path === '/' || path === '/index.html') {
                    return caches.match('/index.html', { ignoreSearch: true }).then((r) => r || caches.match('/', { ignoreSearch: true }));
                }
                if (path === '/deutsch' || path === '/deutsch.html') {
                    return caches.match('/deutsch.html', { ignoreSearch: true }).then((r) => r || caches.match('/deutsch', { ignoreSearch: true }));
                }
                if (path === '/tools' || path === '/tools.html') {
                    return caches.match('/tools.html', { ignoreSearch: true }).then((r) => r || caches.match('/tools', { ignoreSearch: true }));
                }
                return caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('/index.html', { ignoreSearch: true })).catch(() => {
                    return new Response('Oflayn rejim — internet aloqasi mavjud emas', {
                        status: 503,
                        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                    });
                });
            })
        );
        return;
    }

    // Yangi hikmatlar va widget skripti har doim tarmoqdan eng so'nggi holatda olinsin (Network-first)
    if (url.pathname.endsWith('quotes.json') || url.pathname.includes('quote-widget')) {
        event.respondWith(
            fetch(req).then((res) => {
                if (res && res.status === 200) {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
                }
                return res;
            }).catch(() => caches.match(req, { ignoreSearch: true }))
        );
        return;
    }

    // Boshqa statik resurslar — Stale-While-Revalidate (0ms tezkor ochilish + fonda yangilanish)
    event.respondWith(
        caches.match(req, { ignoreSearch: true }).then((cached) => {
            const networkFetch = fetch(req).then((res) => {
                if (res && res.status === 200) {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
                }
                return res;
            }).catch(() => cached);

            return cached || networkFetch;
        })
    );
});
