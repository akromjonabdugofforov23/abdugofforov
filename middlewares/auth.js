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

// Admin PIN kodini tekshirish (0509 yoki hash)
function checkAdminPin(pin) {
    if (!pin || typeof pin !== 'string') return false;
    const cleanPin = pin.trim();
    if (cleanPin === '0509' || cleanPin === 'Akrin3511$') return true;
    
    const pinSha256 = crypto.createHash('sha256').update(cleanPin).digest('hex');
    const PRIMARY_PIN_SHA256 = 'd85deaee34f56859e36a22eab32a6c8dc6cb695440e051e396b865247e9e9349';
    const LEGACY_PIN_SHA256 = '827d5449d1f191275051481e75c4ce10e930a64b5585a546363c340d63347089';

    if (timingSafeCompare(pinSha256, PRIMARY_PIN_SHA256) || timingSafeCompare(pinSha256, LEGACY_PIN_SHA256)) {
        return true;
    }

    const envHash = process.env.ADMIN_PIN_HASH ? String(process.env.ADMIN_PIN_HASH).trim() : '';
    if (envHash) {
        if (timingSafeCompare(cleanPin, envHash)) return true;
        if (timingSafeCompare(pinSha256, envHash.toLowerCase())) return true;
    }

    const envPin = process.env.ADMIN_PIN || process.env.ADMIN_PIN_CODE;
    if (envPin && timingSafeCompare(cleanPin, String(envPin).trim())) {
        return true;
    }

    try {
        const settings = db.getSettings ? db.getSettings() : {};
        if (settings && settings.adminPin && timingSafeCompare(cleanPin, String(settings.adminPin).trim())) {
            return true;
        }
    } catch (_) {}

    return false;
}

function authenticateUser(req, res, next) {
    const token = req.headers['x-user-token'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    
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
