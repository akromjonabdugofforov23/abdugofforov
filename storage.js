// ===== ABDU STORAGE LAYER =====
// Rasm va audio kabi katta ma'lumotlarni saqlash uchun IndexedDB ishlatiladi.
// localStorage ~5MB bilan cheklangan; IndexedDB esa yuzlab MB sig'imga ega.
// Eski localStorage ma'lumotlari avtomatik IndexedDB ga ko'chiriladi (migratsiya).

(function () {
    const DB_NAME = 'abdu_db';
    const DB_VERSION = 1;
    const STORE = 'kv';

    let dbPromise = null;

    function openDB() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) {
                reject(new Error('IndexedDB qo\'llab-quvvatlanmaydi'));
                return;
            }
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(STORE)) {
                    db.createObjectStore(STORE);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
        return dbPromise;
    }

    function idbGet(key) {
        return openDB().then(db => new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, 'readonly');
            const r = tx.objectStore(STORE).get(key);
            r.onsuccess = () => resolve(r.result);
            r.onerror = () => reject(r.error);
        }));
    }

    function idbSet(key, value) {
        return openDB().then(db => new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, 'readwrite');
            const r = tx.objectStore(STORE).put(value, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            r.onerror = () => reject(r.error);
        }));
    }

    function idbDel(key) {
        return openDB().then(db => new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, 'readwrite');
            tx.objectStore(STORE).delete(key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        }));
    }

    // Katta ma'lumotlar (rasm/audio) shu kalitlarda saqlanadi va localStorage'dan ko'chiriladi
    const BIG_KEYS = ['abdu_posts'];

    const Store = {
        cache: {},
        ready: false,
        usingIDB: false,

        // Berilgan kalitlarni IndexedDB'ga hydrate qiladi (kerak bo'lsa localStorage'dan ko'chiradi)
        async init(keys) {
            try {
                await openDB();
                this.usingIDB = true;
            } catch (e) {
                console.warn('IndexedDB ochilmadi, localStorage rejimi ishlatiladi:', e);
                this.usingIDB = false;
            }

            for (const key of keys) {
                let val;
                if (this.usingIDB) {
                    try {
                        val = await idbGet(key);
                    } catch (e) {
                        val = undefined;
                    }
                }

                // IndexedDB'da yo'q bo'lsa — localStorage'dan o'qib, ko'chiramiz
                if (val === undefined || val === null) {
                    const ls = localStorage.getItem(key);
                    if (ls != null) {
                        try { val = JSON.parse(ls); } catch (e) { val = ls; }
                        if (this.usingIDB && val != null) {
                            try {
                                await idbSet(key, val);
                                // Katta kalitlarni localStorage'dan tozalaymiz (joy bo'shatish)
                                if (BIG_KEYS.includes(key)) localStorage.removeItem(key);
                            } catch (e) { /* migratsiya muvaffaqiyatsiz — localStorage qoladi */ }
                        }
                    }
                }

                if (val !== undefined && val !== null) this.cache[key] = val;
            }
            this.ready = true;
            return this.cache;
        },

        get(key, def) {
            return (key in this.cache) ? this.cache[key] : def;
        },

        set(key, val) {
            this.cache[key] = val;
            if (this.usingIDB) {
                idbSet(key, val).catch(e => {
                    console.error('IndexedDB saqlashda xato, localStorage ga zaxira:', e);
                    this._lsFallback(key, val);
                });
            } else {
                this._lsFallback(key, val);
            }
        },

        _lsFallback(key, val) {
            try {
                localStorage.setItem(key, JSON.stringify(val));
            } catch (e) {
                console.error('localStorage ham to\'ldi:', e);
                throw e;
            }
        },

        remove(key) {
            delete this.cache[key];
            if (this.usingIDB) idbDel(key).catch(() => {});
            localStorage.removeItem(key);
        }
    };

    // ============================================================
    // SERVER SYNC — Cloudflare Pages Function (functions/posts.js)
    // GET  /posts      -> public, postlar ro'yxatini qaytaradi
    // PUT  /posts      -> admin (x-admin-pin header bilan)
    // ============================================================
    const Sync = {
        endpoint: '/posts',

        // Server holatini saqlash (UI uchun foydali)
        lastStatus: { configured: null, online: null, error: null },

        // Serverdan postlarni o'qish
        async fetchPosts(timeoutMs = 6000) {
            try {
                const ctrl = new AbortController();
                const timer = setTimeout(() => ctrl.abort(), timeoutMs);
                const res = await fetch(this.endpoint, {
                    method: 'GET',
                    signal: ctrl.signal,
                    headers: { 'Accept': 'application/json' },
                });
                clearTimeout(timer);

                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = await res.json();
                this.lastStatus = {
                    configured: !!data.configured,
                    online: true,
                    error: null,
                };
                return Array.isArray(data.posts) ? data.posts : [];
            } catch (e) {
                this.lastStatus = {
                    configured: null,
                    online: false,
                    error: (e && e.message) || 'fetch_failed',
                };
                return null; // null = serverdan o'qib bo'lmadi (mahalliyga fallback qiling)
            }
        },

        // Postlarni serverga yuborish (admin uchun)
        // Muvaffaqiyatda { ok: true } qaytaradi, aks holda { ok: false, ... }
        async pushPosts(posts, pin) {
            if (!pin || typeof pin !== 'string') {
                return { ok: false, reason: 'no_pin', message: 'PIN topilmadi — admin sessiyasi tugagan.' };
            }
            try {
                const res = await fetch(this.endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-pin': pin,
                    },
                    body: JSON.stringify({ posts }),
                });
                const data = await res.json().catch(() => ({}));

                if (res.status === 503) {
                    this.lastStatus.configured = false;
                    return { ok: false, reason: 'not_configured', message: data.message || 'Server omborini sozlash kerak.' };
                }
                if (res.status === 401) {
                    return { ok: false, reason: 'unauthorized', message: data.message || 'PIN noto\'g\'ri.' };
                }
                if (res.status === 413) {
                    return { ok: false, reason: 'too_large', message: data.message || 'Ma\'lumot juda katta.' };
                }
                if (!res.ok) {
                    return { ok: false, reason: 'server_error', message: data.message || ('HTTP ' + res.status) };
                }
                this.lastStatus.configured = true;
                this.lastStatus.online = true;
                return { ok: true, count: data.count || 0 };
            } catch (e) {
                this.lastStatus.online = false;
                return { ok: false, reason: 'network', message: (e && e.message) || 'Tarmoq xatosi.' };
            }
        },
    };

    window.Store = Store;
    window.Sync = Sync;
})();
