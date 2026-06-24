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

    window.Store = Store;
})();
