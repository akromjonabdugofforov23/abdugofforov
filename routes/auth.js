const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '../users.json');
const PBKDF2_ITER = 100000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 kun

// Parolni PBKDF2-SHA256 (100,000 iteratsiya) bilan xesh qilish
function hashPasswordPBKDF2(password, saltHex) {
    const salt = saltHex ? Buffer.from(saltHex, 'hex') : crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITER, 32, 'sha256').toString('hex');
    return { hash, salt: salt.toString('hex') };
}

// Parolni tekshirish (PBKDF2 va eski sha256 bilan moslashuvchan)
function verifyPassword(password, user) {
    if (!user || !password) return false;
    if (user.salt && user.passHash) {
        const { hash } = hashPasswordPBKDF2(password, user.salt);
        const bufA = Buffer.from(hash, 'hex');
        const bufB = Buffer.from(user.passHash, 'hex');
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
    }
    // Eski sha256 xeshlarini xavfsiz taqqoslash
    if (user.passwordHash) {
        const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
        const bufA = Buffer.from(legacyHash, 'hex');
        const bufB = Buffer.from(user.passwordHash, 'hex');
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
    }
    return false;
}

// Doimiy vaqtli string taqqoslash
function timingSafeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

// Admin PIN kodini tekshirish
function checkAdminPin(pin) {
    if (!pin || typeof pin !== 'string') return false;
    const cleanPin = pin.trim();
    const envPin = process.env.ADMIN_PIN || process.env.ADMIN_PIN_CODE;
    if (envPin) {
        return timingSafeCompare(cleanPin, String(envPin).trim());
    }
    // Agar env o'rnatilmagan bo'lsa (dev/test uchun ogohlantirish bilan)
    console.warn("⚠️ [SECURITY WARNING] Node muhitida ADMIN_PIN sozlanmagan! Zaxira PIN ishlatilmoqda.");
    return timingSafeCompare(cleanPin, '0509');
}

// Token yaratish
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Foydalanuvchilarni o'qish
function readUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

// Foydalanuvchilarni saqlash
function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (e) {
        console.error("Foydalanuvchilarni faylga yozishda xato:", e);
    }
}

// Foydalanuvchini formatlash (role bilan, parolsiz)
function formatUser(u) {
    const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
    const isAdmin = u.role === 'admin' || (u.username && adminUsers.includes(u.username.toLowerCase()));
    return {
        id: u.id || u.username,
        name: u.name,
        username: u.username,
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

    const users = readUsers();
    const existingIndex = users.findIndex(u => u.username && u.username.toLowerCase() === normUsername);

    // XAVFSIZLIK: Mavjud username hech qachon ustidan yozilmaydi (Account takeover himoyasi)
    if (existingIndex !== -1) {
        return res.status(409).json({
            ok: false,
            error: "Bu username band. Boshqasini tanlang.",
            message: "Bu username band. Boshqasini tanlang."
        });
    }

    const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
    const inputPin = String(adminPin || pin || '').trim();
    const isPinValid = inputPin ? checkAdminPin(inputPin) : false;

    // Admin nomlaridan biri bilan ro'yxatdan o'tmoqchi bo'lsa, to'g'ri Admin PIN shart
    if (adminUsers.includes(normUsername)) {
        if (!isPinValid) {
            return res.status(403).json({
                ok: false,
                needsAdminPin: true,
                error: "Admin profilini ro'yxatdan o'tkazish uchun to'g'ri Admin PIN kodini kiriting.",
                message: "Admin profilini ro'yxatdan o'tkazish uchun to'g'ri Admin PIN kodini kiriting."
            });
        }
    }

    const role = (adminUsers.includes(normUsername) || isPinValid) ? 'admin' : 'student';
    const { hash, salt } = hashPasswordPBKDF2(rawPassword);
    const token = generateToken();

    const userObj = {
        id: Date.now().toString(),
        name: trimmedName,
        username: normUsername,
        role,
        passHash: hash,
        salt,
        token,
        tokenCreatedAt: Date.now(),
        createdAt: Date.now()
    };

    users.push(userObj);
    saveUsers(users);

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
    const users = readUsers();
    let user = users.find(u => u.username && u.username.toLowerCase() === normUsername);

    // Agar foydalanuvchi mavjud bo'lmasa, dastlabki adminni ro'yxatdan o'tkazish
    if (!user) {
        if (adminUsers.includes(normUsername) && checkAdminPin(rawPassword)) {
            const { hash, salt } = hashPasswordPBKDF2(rawPassword);
            const token = generateToken();
            const newAdmin = {
                id: Date.now().toString(),
                name: normUsername,
                username: normUsername,
                role: 'admin',
                passHash: hash,
                salt,
                token,
                tokenCreatedAt: Date.now(),
                createdAt: Date.now()
            };
            users.push(newAdmin);
            saveUsers(users);
            return res.json({ ok: true, token: newAdmin.token, user: formatUser(newAdmin) });
        }
        return res.status(401).json({
            ok: false,
            error: "Username yoki parol noto'g'ri",
            message: "Username yoki parol noto'g'ri"
        });
    }

    // Parolni tekshirish
    if (!verifyPassword(rawPassword, user)) {
        return res.status(401).json({
            ok: false,
            error: "Username yoki parol noto'g'ri",
            message: "Username yoki parol noto'g'ri"
        });
    }

    if (adminUsers.includes(normUsername) && user.role !== 'admin') {
        user.role = 'admin';
    }

    // Eski sha256 xesh bo'lsa, avtomatik PBKDF2 ga yangilaymiz
    if (!user.salt || !user.passHash) {
        const upgraded = hashPasswordPBKDF2(rawPassword);
        user.passHash = upgraded.hash;
        user.salt = upgraded.salt;
        delete user.passwordHash;
    }

    // Yangi sessiya tokeni va vaqti
    user.token = generateToken();
    user.tokenCreatedAt = Date.now();
    saveUsers(users);

    res.json({
        ok: true,
        token: user.token,
        user: formatUser(user)
    });
});

// Chiqish
router.post('/logout', (req, res) => {
    const token = req.headers['x-user-token'];
    if (token) {
        const users = readUsers();
        const user = users.find(u => u.token === token);
        if (user) {
            user.token = null;
            saveUsers(users);
        }
    }
    res.json({ ok: true });
});

// Token orqali foydalanuvchini tiklash (me)
router.get('/me', (req, res) => {
    const token = req.headers['x-user-token'];
    if (!token) {
        return res.status(401).json({
            ok: false,
            error: 'Avtorizatsiyadan o\'tilmagan',
            message: 'Avtorizatsiyadan o\'tilmagan'
        });
    }

    const users = readUsers();
    const user = users.find(u => u.token === token);

    if (!user) {
        return res.status(401).json({
            ok: false,
            error: 'Token yaroqsiz',
            message: 'Token yaroqsiz'
        });
    }

    // Token muddatini tekshirish (30 kun)
    if (user.tokenCreatedAt && (Date.now() - user.tokenCreatedAt > SESSION_TTL_MS)) {
        user.token = null;
        saveUsers(users);
        return res.status(401).json({
            ok: false,
            error: 'Sessiya muddati tugagan',
            message: 'Sessiya muddati tugagan. Qaytadan tizimga kiring.'
        });
    }

    res.json({ ok: true, user: formatUser(user) });
});

module.exports = router;
