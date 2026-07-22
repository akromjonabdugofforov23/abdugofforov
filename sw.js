// ===== Abdugofforov PWA Service Worker =====
// App-shell keshlash: oflayn ishlash va tezroq yuklash uchun.
// CACHE versiyasini bump qildik (v2) — yangi dark dizayn keshda eski versiya
// bilan qorishib qolmasligi uchun
const CACHE = 'abdu-cache-v4';
const SHELL = [
    '/',
    '/index.html',
    '/style.css',
    '/style.min.css',
    '/animations.css',
    '/css/horror.css',
    '/app.js',
    '/i18n.js',
    '/storage.js',
    '/auth.js',
    '/data-flashcards.js',
    '/data-tests.js',
    '/scripts/flashcards.js',
    '/scripts/tests.js',
    '/scripts/horror-data.js',
    '/scripts/horror-logic.js',
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
    // Admin sahifa va funksiyalarni keshlamaymiz
    if (url.pathname.startsWith('/functions') || url.pathname === '/kay.html') return;

    // Navigatsiya (HTML) — tarmoq birinchi, keyin kesh (oflayn uchun)
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req).then((res) => {
                const copy = res.clone();
                caches.open(CACHE).then((c) => c.put('/index.html', copy)).catch(() => {});
                return res;
            }).catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
        );
        return;
    }

    // Statik resurslar — kesh birinchi, keyin tarmoq
    event.respondWith(
        caches.match(req).then((cached) =>
            cached || fetch(req).then((res) => {
                if (res && res.status === 200) {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
                }
                return res;
            }).catch(() => cached)
        )
    );
});
