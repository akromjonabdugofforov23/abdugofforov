const express = require('express');
const crypto = require('crypto');
const db = require('../database');
const { authenticateUser, checkAdminPin, SESSION_TTL_MS } = require('../middlewares/auth');
const { notifyNewUser } = require('../services/telegram');

const router = express.Router();

// Zamonaviy xavfsizlik: Scrypt (Xotiraga asoslangan, GPU/ASIC hujumlariga chidamli zamonaviy shifr)
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };
const PBKDF2_ITER_MODERN = 600000; // OWASP 2023+ tavsiyasi
const PBKDF2_ITER_LEGACY = 100000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 daqiqa

// Zamonaviy Scrypt yordamida parolni xesh qilish (Asosiy xavfsizlik protokoli)
function hashPasswordScrypt(password, saltHex) {
    const salt = saltHex ? Buffer.from(saltHex, 'hex') : crypto.randomBytes(32);
    const hash = crypto.scryptSync(password, salt, 64, SCRYPT_PARAMS).toString('hex');
    return { hash, salt: salt.toString('hex'), algo: 'scrypt' };
}

// PBKDF2-HMAC-SHA256 xesh qilish (Merosiy va oraliq xavfsizlik uchun)
function hashPasswordPBKDF2(password, saltHex, iterations = PBKDF2_ITER_MODERN) {
    const salt = saltHex ? Buffer.from(saltHex, 'hex') : crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
    return { hash, salt: salt.toString('hex') };
}

// Parolni tekshirish (Scrypt, PBKDF2 va eski sha256 bilan to'liq orqaga moslashuvchan)
function verifyPassword(password, user) {
    if (!user || !password) return { valid: false, needsUpgrade: false };

    // 1. Zamonaviy Scrypt xeshi tekshiruvi (64 bayt = 128 ta hex belgi)
    if (user.algo === 'scrypt' || (user.passHash && user.passHash.length === 128)) {
        if (user.salt && user.passHash) {
            const { hash } = hashPasswordScrypt(password, user.salt);
            const bufA = Buffer.from(hash, 'hex');
            const bufB = Buffer.from(user.passHash, 'hex');
            if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
                return { valid: true, needsUpgrade: false };
            }
        }
    }

    // 2. PBKDF2 tekshiruvi (zamonaviy 600k yoki merosiy 100k)
    if (user.salt && user.passHash) {
        // Modern PBKDF2 (600,000)
        const modern = hashPasswordPBKDF2(password, user.salt, PBKDF2_ITER_MODERN);
        const bufModA = Buffer.from(modern.hash, 'hex');
        const bufModB = Buffer.from(user.passHash, 'hex');
        if (bufModA.length === bufModB.length && crypto.timingSafeEqual(bufModA, bufModB)) {
            return { valid: true, needsUpgrade: true };
        }

        // Legacy PBKDF2 (100,000)
        const legacy = hashPasswordPBKDF2(password, user.salt, PBKDF2_ITER_LEGACY);
        const bufLegA = Buffer.from(legacy.hash, 'hex');
        const bufLegB = Buffer.from(user.passHash, 'hex');
        if (bufLegA.length === bufLegB.length && crypto.timingSafeEqual(bufLegA, bufLegB)) {
            return { valid: true, needsUpgrade: true };
        }
    }

    // 3. Eski SHA-256 xeshlarini xavfsiz vaqtli taqqoslash
    if (user.passwordHash) {
        const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
        const bufA = Buffer.from(legacyHash, 'hex');
        const bufB = Buffer.from(user.passwordHash, 'hex');
        if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
            return { valid: true, needsUpgrade: true };
        }
    }

    return { valid: false, needsUpgrade: false };
}

// Doimiy vaqtli string taqqoslash (Timing attack'larning oldini oladi)
function timingSafeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}


// Token yaratish
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Foydalanuvchini formatlash (role bilan, parolsiz)
function formatUser(u) {
    const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
    const isAdmin = u.role === 'admin' || (u.username && adminUsers.includes(u.username.toLowerCase()));
    return {
        id: u.id || u.username,
        name: u.name,
        username: u.username,
        photo: u.photo || '',
        role: isAdmin ? 'admin' : 'student'
    };
}

// Ro'yxatdan o'tish
router.post('/register', (req, res) => {
    const { name, username, password, adminPin, pin } = req.body || {};
    const trimmedName = String(name || '').trim().slice(0, 50);
    const normUsername = String(username || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    if (!trimmedName || !normUsername || !rawPassword) {
        return res.status(400).json({
            ok: false,
            error: "Barcha maydonlarni to'ldiring",
            message: "Barcha maydonlarni to'ldiring"
        });
    }

    if (trimmedName.length < 2) {
        return res.status(400).json({
            ok: false,
            error: "Ism kamida 2 ta belgi bo'lishi kerak",
            message: "Ism kamida 2 ta belgi bo'lishi kerak"
        });
    }

    if (!/^[a-z0-9_]{3,20}$/.test(normUsername)) {
        return res.status(400).json({
            ok: false,
            error: "Username 3-20 ta belgi: faqat a-z, 0-9, _",
            message: "Username 3-20 ta belgi: faqat a-z, 0-9, _"
        });
    }

    // Parol kamida 8 ta belgi bo'lishi shart
    if (rawPassword.length < 8) {
        return res.status(400).json({
            ok: false,
            error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
            message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak"
        });
    }

    const existing = db.findOne('users', u => u.username && u.username.toLowerCase() === normUsername);
    if (existing) {
        return res.status(409).json({
            ok: false,
            error: "Bu username band. Boshqasini tanlang.",
            message: "Bu username band. Boshqasini tanlang."
        });
    }

    const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
    const inputPin = String(adminPin || pin || '').trim();
    const isPinValid = inputPin ? checkAdminPin(inputPin) : false;

    if (adminUsers.includes(normUsername) && !isPinValid) {
        return res.status(403).json({
            ok: false,
            needsAdminPin: true,
            error: "Admin profilini ro'yxatdan o'tkazish uchun to'g'ri Admin PIN kodini kiriting.",
            message: "Admin profilini ro'yxatdan o'tkazish uchun to'g'ri Admin PIN kodini kiriting."
        });
    }

    const role = (adminUsers.includes(normUsername) && isPinValid) ? 'admin' : 'student';
    const { hash, salt, algo } = hashPasswordScrypt(rawPassword);
    const token = generateToken();

    const userObj = db.insert('users', {
        name: trimmedName,
        username: normUsername,
        role,
        passHash: hash,
        salt,
        algo,
        token,
        tokenCreatedAt: Date.now(),
        failedAttempts: 0,
        lockUntil: null
    });

    notifyNewUser(userObj).catch(() => {});
    res.json({
        ok: true,
        token,
        user: formatUser(userObj)
    });
});

// Kirish
router.post('/login', (req, res) => {
    const { username, password } = req.body || {};
    const normUsername = String(username || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    if (!normUsername || !rawPassword) {
        return res.status(400).json({
            ok: false,
            error: "Username va parolni kiriting",
            message: "Username va parolni kiriting"
        });
    }

    const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
    let user = db.findOne('users', u => u.username && u.username.toLowerCase() === normUsername);
    const isAdminAccount = adminUsers.includes(normUsername) || (user && user.role === 'admin');

    // Admin foydalanuvchi to'g'ri PIN yoki parol bilan kirganda
    if (isAdminAccount && checkAdminPin(rawPassword)) {
        const { hash, salt, algo } = hashPasswordScrypt(rawPassword);
        const token = generateToken();
        const adminData = {
            name: user ? user.name : normUsername,
            username: normUsername,
            role: 'admin',
            passHash: hash,
            salt,
            algo,
            token,
            tokenCreatedAt: Date.now(),
            lastLoginAt: Date.now(),
            failedAttempts: 0,
            lockUntil: null
        };
        const saved = user ? db.update('users', user.id, adminData) : db.insert('users', adminData);
        return res.json({ ok: true, token: saved.token, user: formatUser(saved) });
    }

    if (!user) {
        return res.status(401).json({
            ok: false,
            error: "Username yoki parol noto'g'ri",
            message: "Username yoki parol noto'g'ri"
        });
    }

    // Bloklanganlikni tekshirish (Brute force himoyasi)
    if (user.lockUntil && user.lockUntil > Date.now()) {
        const remainingMin = Math.ceil((user.lockUntil - Date.now()) / 60000);
        return res.status(429).json({
            ok: false,
            error: `Ko'p xato urinishlar! Hisob ${remainingMin} daqiqaga vaqtincha bloklandi.`,
            message: `Ko'p xato urinishlar! Hisob ${remainingMin} daqiqaga vaqtincha bloklandi.`
        });
    }

    // Parolni tekshirish (Scrypt, PBKDF2 va SHA-256 ni xavfsiz tekshiradi)
    const { valid, needsUpgrade } = verifyPassword(rawPassword, user);
    if (!valid) {
        if ((user.role === 'admin' || adminUsers.includes(normUsername)) && checkAdminPin(rawPassword)) {
            const { hash, salt, algo } = hashPasswordScrypt(rawPassword);
            const token = generateToken();
            db.update('users', user.id, {
                passHash: hash,
                salt,
                algo,
                token,
                tokenCreatedAt: Date.now(),
                failedAttempts: 0,
                lockUntil: null
            });
            return res.json({ ok: true, token, user: formatUser(user) });
        }
        const failed = (user.failedAttempts || 0) + 1;
        const updates = { failedAttempts: failed };
        if (failed >= MAX_FAILED_ATTEMPTS) {
            updates.lockUntil = Date.now() + LOCK_TIME_MS;
        }
        db.update('users', user.id, updates);
        return res.status(401).json({
            ok: false,
            error: "Username yoki parol noto'g'ri",
            message: "Username yoki parol noto'g'ri"
        });
    }

    const updates = {
        failedAttempts: 0,
        lockUntil: null,
        token: generateToken(),
        tokenCreatedAt: Date.now(),
        lastLoginAt: Date.now()
    };

    if (adminUsers.includes(normUsername) && user.role !== 'admin') {
        updates.role = 'admin';
    }

    // Xavfsizlik protokollarini avtomatik oshirish (Eski xeshni zamonaviy Scrypt ga ko'chirish)
    if (needsUpgrade || user.algo !== 'scrypt' || !user.salt || !user.passHash) {
        const upgraded = hashPasswordScrypt(rawPassword);
        updates.passHash = upgraded.hash;
        updates.salt = upgraded.salt;
        updates.algo = 'scrypt';
    }

    const updatedUser = db.update('users', user.id, updates);

    res.json({
        ok: true,
        token: updatedUser.token,
        user: formatUser(updatedUser)
    });
});

// Chiqish
router.post('/logout', (req, res) => {
    const token = req.headers['x-user-token'];
    if (token) {
        const user = db.findOne('users', u => u.token === token);
        if (user) {
            db.update('users', user.id, { token: null });
        }
    }
    res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');
    res.json({ ok: true });
});

// Profil ma'lumotlari (me)
router.get('/me', authenticateUser, (req, res) => {
    res.json({ ok: true, user: formatUser(req.user) });
});

// Profil ma'lumotlarini yangilash (Ism, Avatar, Parol)
router.post('/profile', authenticateUser, (req, res) => {
    const { name, photo, currentPassword, newPassword } = req.body || {};
    const user = req.user;
    const updates = {};

    if (name && typeof name === 'string') {
        const trimmed = name.trim().slice(0, 50);
        if (trimmed) updates.name = trimmed;
    }
    if (photo !== undefined && typeof photo === 'string') {
        updates.photo = photo.trim().slice(0, 5000);
    }

    // Parolni o'zgartirish (ixtiyoriy)
    if (newPassword) {
        if (!currentPassword) {
            return res.status(400).json({ ok: false, message: "Parolni o'zgartirish uchun joriy parolni kiriting" });
        }
        const { valid } = verifyPassword(currentPassword, user);
        const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
        const isAdmin = user.role === 'admin' || (user.username && adminUsers.includes(user.username.toLowerCase()));
        
        if (!valid) {
            if (!isAdmin || !checkAdminPin(currentPassword)) {
                return res.status(400).json({ ok: false, message: "Joriy parol noto'g'ri" });
            }
        }
        if (String(newPassword).length < 6) {
            return res.status(400).json({ ok: false, message: "Yangi parol kamida 6 belgidan iborat bo'lishi kerak" });
        }
        const { hash, salt, algo } = hashPasswordScrypt(String(newPassword));
        updates.passHash = hash;
        updates.salt = salt;
        updates.algo = algo;
    }

    const updatedUser = db.update('users', user.id, updates);
    const resultUser = updatedUser || Object.assign({}, user, updates);
    return res.json({ ok: true, user: formatUser(resultUser), message: "Profil muvaffaqiyatli yangilandi" });
});

// Parolni yangilash (Change Password)
router.post('/change-password', authenticateUser, (req, res) => {
    const { oldPassword, currentPassword, newPassword } = req.body || {};
    const oldPass = String(oldPassword || currentPassword || '');
    const newPass = String(newPassword || '');

    if (!oldPass || !newPass) {
        return res.status(400).json({
            ok: false,
            error: "Eski va yangi parolni kiriting",
            message: "Eski va yangi parolni kiriting"
        });
    }

    if (newPass.length < 6) {
        return res.status(400).json({
            ok: false,
            error: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak",
            message: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak"
        });
    }

    if (oldPass === newPass) {
        return res.status(400).json({
            ok: false,
            error: "Yangi parol eski paroldan farq qilishi kerak",
            message: "Yangi parol eski paroldan farq qilishi kerak"
        });
    }

    const user = req.user;
    const { valid } = verifyPassword(oldPass, user);
    const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
    const isAdmin = user.role === 'admin' || (user.username && adminUsers.includes(user.username.toLowerCase()));

    let isOldPassValid = valid;
    if (!isOldPassValid && isAdmin && checkAdminPin(oldPass)) {
        isOldPassValid = true;
    }

    if (!isOldPassValid) {
        return res.status(400).json({
            ok: false,
            error: "Joriy (eski) parol noto'g'ri",
            message: "Joriy (eski) parol noto'g'ri"
        });
    }

    const { hash, salt, algo } = hashPasswordScrypt(newPass);
    const updatedUser = db.update('users', user.id, {
        passHash: hash,
        salt,
        algo
    });

    return res.json({
        ok: true,
        message: "Parol muvaffaqiyatli yangilandi",
        user: formatUser(updatedUser || user)
    });
});

// ============================================================
// STEALTH ADMIN GATE: /auth/magic-gate
// GET /auth/magic-gate?token=... yoki ?pin=...
// POST /auth/magic-gate { token, pin }
// ============================================================
function handleMagicGate(req, res) {
    const candidate = (req.body && (req.body.token || req.body.pin || req.body.adminPin || req.body.key)) ||
                      req.headers['x-admin-pin'] || req.headers['x-pin'] || req.headers['x-admin-token'] ||
                      req.query.token || req.query.pin || req.query.key || req.query.secret || '';
    const clean = candidate != null ? String(candidate).trim() : '';

    const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
    let isValid = false;

    if (clean) {
        // 1. PIN tekshiruvi (hashlar va env orqali)
        if (checkAdminPin(clean)) {
            isValid = true;
        }

        // 2. Maxfiy tokenlar (process.env.MAGIC_GATE_TOKEN, ADMIN_TOKEN, MAGIC_TOKEN)
        if (!isValid) {
            const envTokens = [
                process.env.MAGIC_GATE_TOKEN,
                process.env.ADMIN_TOKEN,
                process.env.MAGIC_TOKEN
            ].filter(Boolean);
            for (const t of envTokens) {
                if (timingSafeCompare(clean, String(t).trim())) {
                    isValid = true;
                    break;
                }
            }
        }

        // 3. Faol admin session tokeni tekshiruvi
        if (!isValid && /^[a-f0-9]{32,128}$/i.test(clean)) {
            const existingAdmin = db.findOne('users', u => u.token === clean && (u.role === 'admin' || adminUsers.includes(u.username)));
            if (existingAdmin && (!existingAdmin.tokenCreatedAt || (Date.now() - existingAdmin.tokenCreatedAt <= SESSION_TTL_MS))) {
                isValid = true;
            }
        }
    }

    const acceptsHtml = req.accepts('html') && !req.xhr && (!req.headers.accept || !req.headers.accept.includes('application/json'));

    if (!isValid) {
        if (req.method === 'GET' && acceptsHtml) {
            return res.redirect('/');
        }
        return res.status(401).json({
            ok: false,
            success: false,
            message: "Noto'g'ri token yoki PIN-kod"
        });
    }

    // Muvaffaqiyatli: admin sessiyasi va yangi token beriladi
    let adminUser = db.findOne('users', u => u.username && adminUsers.includes(u.username.toLowerCase())) ||
                    db.findOne('users', u => u.role === 'admin');

    const newToken = generateToken();

    if (adminUser) {
        adminUser = db.update('users', adminUser.id, {
            token: newToken,
            tokenCreatedAt: Date.now(),
            lastLoginAt: Date.now(),
            failedAttempts: 0,
            lockUntil: null,
            role: 'admin'
        });
    } else {
        const { hash, salt, algo } = hashPasswordScrypt(clean || 'AdminSecret2026!');
        adminUser = db.insert('users', {
            name: 'abdugofforov',
            username: 'abdugofforov',
            role: 'admin',
            passHash: hash,
            salt,
            algo,
            token: newToken,
            tokenCreatedAt: Date.now(),
            lastLoginAt: Date.now(),
            failedAttempts: 0,
            lockUntil: null
        });
    }

    if (req.method === 'GET' && acceptsHtml) {
        return res.redirect(`/kay.html?token=${encodeURIComponent(newToken)}`);
    }

    return res.json({
        ok: true,
        success: true,
        token: newToken,
        user: formatUser(adminUser),
        redirectUrl: `/kay.html?token=${newToken}`
    });
}

router.get('/magic-gate', handleMagicGate);
router.post('/magic-gate', handleMagicGate);

// 7. FOYDALANUVCHILAR VA SAHIFA FAOLLIGI (PRESENCE / ONLINE)
// ============================================================
router.post('/presence', (req, res) => {
    const token = req.headers['x-user-token'];
    const page = String(req.body?.page || 'deutsch').slice(0, 30);
    let username = null;
    if (token) {
        const u = db.findOne('users', x => x.token === token);
        if (u) username = u.username;
    }
    const stats = db.recordPresence(username, page);
    res.json({ ok: true, stats });
});

router.get('/presence', (req, res) => {
    const page = String(req.query?.page || 'deutsch').slice(0, 30);
    const stats = db.getPresenceStats(page);
    res.json({ ok: true, stats });
});

module.exports = router;

