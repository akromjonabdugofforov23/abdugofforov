/**
 * ============================================================
 * ABDUGOFFOROV AUTHENTICATION & ACCESS CONTROL MIDDLEWARE
 * Sessiya tokenlari, xavfsizlik va rollar (Admin / Student)
 * ============================================================
 */

const db = require('../database');
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 kun

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
    SESSION_TTL_MS
};
