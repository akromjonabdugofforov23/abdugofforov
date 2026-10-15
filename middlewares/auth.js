/**
 * ============================================================
 * ABDUGOFFOROV AUTHENTICATION & ACCESS CONTROL MIDDLEWARE
 * Sessiya tokenlari, xavfsizlik va rollar (Admin / Student)
 * ============================================================
 */

const crypto = require('crypto');
const db = require('../database');
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 kun

// Vaqt hujumlariga qarshi xavfsiz taqqoslash
function timingSafeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

// Admin PIN kodini tekshirish (Hash yoki tekis PIN bilan)
function checkAdminPin(pin) {
    if (pin === undefined || pin === null) return false;
    const cleanPin = String(pin).trim();
    if (!cleanPin || cleanPin.length > 64) return false;

    const pinSha256 = crypto.createHash('sha256').update(cleanPin).digest('hex').toLowerCase();
    const PRIMARY_PIN_SHA256 = 'd85deaee34f56859e36a22eab32a6c8dc6cb695440e051e396b865247e9e9349';
    const LEGACY_PIN_SHA256 = '827d5449d1f191275051481e75c4ce10e930a64b5585a546363c340d63347089';

    // 1. data/db.json (settings.adminPinHash yoki settings.adminPin) tekshiruvi (Ustuvor)
    try {
        const settings = db.getSettings ? db.getSettings() : {};
        if (settings) {
            if (settings.adminPinHash && typeof settings.adminPinHash === 'string') {
                const sHash = String(settings.adminPinHash).trim().toLowerCase();
                if (timingSafeCompare(pinSha256, sHash)) return true;
                if (sHash.includes(':')) {
                    const [saltHex, expectedHash] = sHash.split(':');
                    try {
                        const derived = crypto.pbkdf2Sync(cleanPin, Buffer.from(saltHex, 'hex'), 100000, 32, 'sha256').toString('hex');
                        if (timingSafeCompare(derived, expectedHash)) return true;
                    } catch (_) {}
                }
            }
            if (settings.adminPin && (typeof settings.adminPin === 'string' || typeof settings.adminPin === 'number')) {
                const sPin = String(settings.adminPin).trim();
                if (timingSafeCompare(cleanPin, sPin)) return true;
                const sPinSha = crypto.createHash('sha256').update(sPin).digest('hex').toLowerCase();
                if (timingSafeCompare(pinSha256, sPinSha)) return true;
            }
        }
    } catch (_) {}

    // 2. .env / muhit o'zgaruvchilari (ADMIN_PIN_HASH va ADMIN_PIN)
    const envHash = process.env.ADMIN_PIN_HASH ? String(process.env.ADMIN_PIN_HASH).trim().toLowerCase() : '';
    if (envHash) {
        if (timingSafeCompare(pinSha256, envHash)) return true;
        if (envHash.includes(':')) {
            const [saltHex, expectedHash] = envHash.split(':');
            try {
                const derived = crypto.pbkdf2Sync(cleanPin, Buffer.from(saltHex, 'hex'), 100000, 32, 'sha256').toString('hex');
                if (timingSafeCompare(derived, expectedHash)) return true;
            } catch (_) {}
        }
    }

    const envPin = process.env.ADMIN_PIN || process.env.ADMIN_PIN_CODE;
    if (envPin) {
        const cleanEnvPin = String(envPin).trim();
        if (timingSafeCompare(cleanPin, cleanEnvPin)) return true;
        const envPinSha = crypto.createHash('sha256').update(cleanEnvPin).digest('hex').toLowerCase();
        if (timingSafeCompare(pinSha256, envPinSha)) return true;
    }

    // 3. Standart SHA-256 xeshlar orqali tekshirish va zaxira fallback
    if (timingSafeCompare(pinSha256, PRIMARY_PIN_SHA256) || timingSafeCompare(pinSha256, LEGACY_PIN_SHA256)) {
        return true;
    }

    return false;
}

function authenticateUser(req, res, next) {
    const token = req.headers['x-user-token'] || req.headers['x-admin-token'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    
    if (!token) {
        return res.status(401).json({
            ok: false,
            error: "Avtorizatsiyadan o'tilmagan",
            message: "Avtorizatsiyadan o'tilmagan"
        });
    }

    const user = db.findOne('users', u => u.token === token);
    if (!user) {
        return res.status(401).json({
            ok: false,
            error: "Token yaroqsiz",
            message: "Token yaroqsiz"
        });
    }

    // Sessiya muddatini tekshirish
    if (user.tokenCreatedAt && (Date.now() - user.tokenCreatedAt > SESSION_TTL_MS)) {
        db.update('users', user.id, { token: null });
        return res.status(401).json({
            ok: false,
            error: "Sessiya muddati tugagan",
            message: "Sessiya muddati tugagan. Qaytadan tizimga kiring."
        });
    }

    req.user = user;
    next();
}

function optionalAuth(req, res, next) {
    const token = req.headers['x-user-token'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    if (token) {
        const user = db.findOne('users', u => u.token === token);
        if (user && (!user.tokenCreatedAt || (Date.now() - user.tokenCreatedAt <= SESSION_TTL_MS))) {
            req.user = user;
        }
    }
    next();
}

function requireAdmin(req, res, next) {
    // 1. PIN tekshiruvi (x-admin-pin fallback sifatida)
    const adminPin = req.headers['x-admin-pin'] || req.headers['x-pin'];
    if (adminPin && checkAdminPin(adminPin)) {
        let adminUser = db.findOne('users', u => u.role === 'admin' || (u.username && ['abdugofforov', 'admin', 'akrin4477', 'akrin'].includes(u.username.toLowerCase())));
        req.user = adminUser || { id: 'admin_pin', username: 'admin', role: 'admin', name: 'Administrator' };
        return next();
    }

    // 2. Token tekshiruvi (x-user-token yoki x-admin-token)
    const token = req.headers['x-user-token'] || req.headers['x-admin-token'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    if (!token) {
        return res.status(401).json({
            ok: false,
            error: "Avtorizatsiyadan o'tilmagan",
            message: "Avtorizatsiyadan o'tilmagan. Administrator tokeni yoki PIN talab qilinadi."
        });
    }

    authenticateUser(req, res, () => {
        const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
        const isUsernameAdmin = req.user.username && adminUsers.includes(req.user.username.toLowerCase());
        if (req.user.role === 'admin' || isUsernameAdmin) {
            return next();
        }
        return res.status(403).json({
            ok: false,
            error: "Ruxsat berilmadi: Faqat administratorlar uchun",
            message: "Ushbu amalni bajarish uchun admin huquqi talab qilinadi"
        });
    });
}

module.exports = {
    authenticateUser,
    optionalAuth,
    requireAdmin,
    checkAdminPin,
    SESSION_TTL_MS
};
