// ===== Abdugofforov PWA Service Worker =====
// App-shell keshlash: oflayn ishlash va tezroq yuklash uchun.
// CACHE versiyasini bump qildik (v2) — yangi dark dizayn keshda eski versiya
// bilan qorishib qolmasligi uchun
const CACHE = 'abdu-cache-v12';
const SHELL = [
    '/',
    '/index.html',
    '/deutsch',
    '/deutsch.html',
    '/tools',
    '/tools.html',
    '/3d-lab.html',
    '/clock.html',
    '/style.css',
    '/style.min.css',
    '/animations.css',
    '/css/horror.css',
    '/css/claps-reactions.css',
    '/css/ambient-player.css',
    '/css/luxury-clock-modal.css',
    '/css/matching-game.css',
    '/css/verb-trainer.css',
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
    '/scripts/tools-extended.js',
    '/scripts/flashcards.js',
    '/scripts/tests.js',
    '/scripts/horror-data.js',
    '/scripts/horror-logic.js',
    '/scripts/gamification.js',
    '/scripts/quote-widget.js',
    '/scripts/pro-3d-background.js',
    '/scripts/bg-worker.js',
    '/scripts/claps-reactions.js',
    '/scripts/ambient-player.js',
    '/scripts/luxury-clock-modal.js',
    '/scripts/community-gamification.js',
    '/scripts/aesthetic-features.js',
    '/scripts/productivity-shelf.js',
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
    if (url.pathname.startsWith('/functions') || url.pathname.startsWith('/admin') || url.pathname.startsWith('/auth') || noCachePaths.includes(url.pathname)) return;

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
                } else if (path === '/3d-lab.html') {
                    caches.open(CACHE).then((c) => c.put('/3d-lab.html', copy)).catch(() => {});
                }
                return res;
            }).catch(() => {
                const path = url.pathname;
                if (path === '/' || path === '/index.html') {
                    return caches.match('/index.html').then((r) => r || caches.match('/'));
                }
                if (path === '/deutsch' || path === '/deutsch.html') {
                    return caches.match('/deutsch.html').then((r) => r || caches.match('/deutsch'));
                }
                if (path === '/tools' || path === '/tools.html') {
                    return caches.match('/tools.html').then((r) => r || caches.match('/tools'));
                }
                if (path === '/3d-lab.html') {
                    return caches.match('/3d-lab.html');
                }
                return caches.match(req).then((r) => r || caches.match('/index.html')).catch(() => {
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
            }).catch(() => caches.match(req))
        );
        return;
    }

    // Boshqa statik resurslar — Stale-While-Revalidate (0ms tezkor ochilish + fonda yangilanish)
    event.respondWith(
        caches.match(req).then((cached) => {
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
