/**
 * ============================================================
 * ABDUGOFFOROV PERSISTENT DATABASE & DATA LAYER
 * Atomik va xavfsiz fayl asosidagi NoSQL/Relyatsion ma'lumotlar bazasi.
 * Katta yuklamalarda ma'lumotlar poygasi (race conditions) va
 * buzilishining oldini oluvchi tranzaksiyaviy saqlash mexanizmi.
 * ============================================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const USERS_LEGACY_FILE = path.join(__dirname, 'users.json');

// Papka mavjudligini ta'minlash
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
    constructor() {
        this.cache = {
            users: [],
            posts: [],
            comments: [],
            results: [],
            gamification: [],
            quotes: [],
            projects: [],
            tasks: [],
            settings: {}
        };
        this.isSaving = false;
        this.saveQueue = false;
        this.init();
    }

    init() {
        try {
            if (fs.existsSync(DB_FILE)) {
                const raw = fs.readFileSync(DB_FILE, 'utf8');
                const parsed = JSON.parse(raw);
                this.cache = Object.assign(this.cache, parsed);
                ['users', 'posts', 'comments', 'results', 'gamification', 'quotes', 'projects', 'tasks'].forEach(col => {
                    if (!Array.isArray(this.cache[col])) {
                        this.cache[col] = [];
                    }
                });
                if (!this.cache.settings || typeof this.cache.settings !== 'object' || Array.isArray(this.cache.settings)) {
                    this.cache.settings = {};
                }
            } else {
                // Eski users.json dan foydalanuvchilarni migratsiya qilish
                if (fs.existsSync(USERS_LEGACY_FILE)) {
                    try {
                        const legacyUsers = JSON.parse(fs.readFileSync(USERS_LEGACY_FILE, 'utf8'));
                        if (Array.isArray(legacyUsers)) {
                            this.cache.users = legacyUsers;
                        }
                    } catch (_) {}
                }
                this.saveImmediate();
            }
        } catch (e) {
            console.error("Ma'lumotlar bazasini yuklashda xatolik:", e);
        }
    }

    saveImmediate() {
        try {
            const tempFile = `${DB_FILE}.${crypto.randomBytes(4).toString('hex')}.tmp`;
            fs.writeFileSync(tempFile, JSON.stringify(this.cache, null, 2), 'utf8');
            fs.renameSync(tempFile, DB_FILE);
            // users.json ni ham orqaga moslik uchun yangilab qo'yamiz
            if (Array.isArray(this.cache.users)) {
                fs.writeFileSync(USERS_LEGACY_FILE, JSON.stringify(this.cache.users, null, 2), 'utf8');
            }
        } catch (err) {
            console.error("Ma'lumotlar bazasini diskka yozishda xato:", err);
        }
    }

    persist() {
        if (this.isSaving) {
            this.saveQueue = true;
            return;
        }
        this.isSaving = true;
        setImmediate(() => {
            this.saveImmediate();
            this.isSaving = false;
            if (this.saveQueue) {
                this.saveQueue = false;
                this.persist();
            }
        });
    }

    getCollection(name) {
        if (!this.cache[name]) {
            this.cache[name] = [];
        }
        return this.cache[name];
    }

    find(collectionName, filterFn) {
        const col = this.getCollection(collectionName);
        return filterFn ? col.filter(filterFn) : [...col];
    }

    findOne(collectionName, filterFn) {
        const col = this.getCollection(collectionName);
        return col.find(filterFn) || null;
    }

    findById(collectionName, id) {
        const strId = String(id);
        return this.findOne(collectionName, item => String(item.id) === strId);
    }

    insert(collectionName, doc) {
        const col = this.getCollection(collectionName);
        const docCopy = { ...doc };
        if (!docCopy.id) {
            docCopy.id = Date.now().toString() + crypto.randomBytes(3).toString('hex');
        }
        if (!docCopy.createdAt) {
            docCopy.createdAt = Date.now();
        }
        col.push(docCopy);
        this.persist();
        return docCopy;
    }

    update(collectionName, id, updates) {
        const col = this.getCollection(collectionName);
        const strId = String(id);
        const idx = col.findIndex(item => String(item.id) === strId);
        if (idx === -1) return null;

        col[idx] = {
            ...col[idx],
            ...updates,
            updatedAt: Date.now()
        };
        this.persist();
        return col[idx];
    }

    delete(collectionName, id) {
        const col = this.getCollection(collectionName);
        const strId = String(id);
        const idx = col.findIndex(item => String(item.id) === strId);
        if (idx === -1) return false;

        col.splice(idx, 1);
        this.persist();
        return true;
    }

    // Statistika hisoblash
    getStats() {
        return {
            usersCount: this.getCollection('users').length,
            postsCount: this.getCollection('posts').length,
            projectsCount: this.getCollection('projects').length,
            quotesCount: this.getCollection('quotes').length,
            tasksCount: this.getCollection('tasks').length,
            resultsCount: this.getCollection('results').length,
            commentsCount: this.getCollection('comments').length,
            testsCount: this.getCollection('results').length
        };
    }

    // Sozlamalarni olish va yangilash
    getSettings() {
        if (!this.cache.settings || typeof this.cache.settings !== 'object' || Array.isArray(this.cache.settings)) {
            this.cache.settings = {};
        }
        return this.cache.settings;
    }

    updateSettings(updates) {
        this.cache.settings = {
            ...this.getSettings(),
            ...(updates || {}),
            updatedAt: Date.now()
        };
        this.persist();
        return this.cache.settings;
    }

    // Kolleksiyani tozalash
    clear(collectionName) {
        if (this.cache[collectionName] && Array.isArray(this.cache[collectionName])) {
            this.cache[collectionName] = [];
            this.persist();
            return true;
        }
        return false;
    }

    // Zaxira nusxadan tiklash
    restore(newData) {
        if (!newData || typeof newData !== 'object') return false;
        const targetData = (newData.data && typeof newData.data === 'object') ? newData.data : newData;
        this.cache = {
            users: Array.isArray(targetData.users) ? targetData.users : (this.cache.users || []),
            posts: Array.isArray(targetData.posts) ? targetData.posts : [],
            comments: Array.isArray(targetData.comments) ? targetData.comments : [],
            results: Array.isArray(targetData.results) ? targetData.results : [],
            gamification: Array.isArray(targetData.gamification) ? targetData.gamification : [],
            quotes: Array.isArray(targetData.quotes) ? targetData.quotes : [],
            projects: Array.isArray(targetData.projects) ? targetData.projects : [],
            tasks: Array.isArray(targetData.tasks) ? targetData.tasks : [],
            settings: (targetData.settings && typeof targetData.settings === 'object' && !Array.isArray(targetData.settings))
                ? targetData.settings
                : (this.cache.settings || {})
        };
        this.saveImmediate();
        return true;
    }
}

const db = new Database();
module.exports = db;
