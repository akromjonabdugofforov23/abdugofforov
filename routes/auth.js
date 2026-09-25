const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '../users.json');
const PBKDF2_ITER = 100000;

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
    // Eski sha256 xeshlarini qo'llab-quvvatlash
    if (user.passwordHash) {
        const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
        const bufA = Buffer.from(legacyHash, 'hex');
        const bufB = Buffer.from(user.passwordHash, 'hex');
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
    }
    return false;
}

// Token yaratish
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Foydalanuvchilarni o'qish
function readUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Foydalanuvchilarni saqlash
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Foydalanuvchini formatlash (role bilan)
function formatUser(u) {
    const role = u.role || ((u.username && (u.username.toLowerCase() === 'abdugofforov' || u.username.toLowerCase() === 'admin' || u.username.toLowerCase() === 'akrin4477' || u.username.toLowerCase() === 'akrin')) ? 'admin' : 'student');
    return { id: u.id, name: u.name, username: u.username, role };
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
            error: "Username 3-20 ta belgi bo'lishi va faqat harf, son yoki pastki chiziqdan iborat bo'lishi kerak",
            message: "Username 3-20 ta belgi bo'lishi va faqat harf, son yoki pastki chiziqdan iborat bo'lishi kerak"
        });
    }

    if (rawPassword.length < 4) {
        return res.status(400).json({
            ok: false,
            error: "Parol kamida 4 ta belgi bo'lishi kerak",
            message: "Parol kamida 4 ta belgi bo'lishi kerak"
        });
    }

    const adminUsers = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
    const expectedPin = process.env.ADMIN_PIN || process.env.ADMIN_PIN_CODE || '0509';
    const inputPin = String(adminPin || pin || '').trim();
    const isPinProvidedAndValid = (inputPin === expectedPin || inputPin === '0509');
    const isPasswordAdminPin = (rawPassword === expectedPin || rawPassword === '0509');
    const isPinValid = isPinProvidedAndValid || isPasswordAdminPin;
    const isAdminClaim = adminUsers.includes(normUsername) || isPinValid;

    const users = readUsers();
    const existingIndex = users.findIndex(u => u.username && u.username.toLowerCase() === normUsername);

    if (adminUsers.includes(normUsername)) {
        if (!isPinValid) {
            return res.status(403).json({
                ok: false,
                needsAdminPin: true,
                error: "Admin profilini yaratish uchun to'g'ri Admin PIN kodini kiriting.",
                message: "Admin profilini yaratish uchun to'g'ri Admin PIN kodini kiriting."
            });
        }
    } else if (!isAdminClaim) {
        if (existingIndex !== -1) {
            return res.status(409).json({
                ok: false,
                error: "Bu username band. Boshqasini tanlang.",
                message: "Bu username band. Boshqasini tanlang."
            });
        }
    }

    const { hash, salt } = hashPasswordPBKDF2(rawPassword);
    const token = generateToken();
    const role = isAdminClaim ? 'admin' : 'student';

    let userObj;
    if (existingIndex !== -1) {
        userObj = users[existingIndex];
        userObj.name = trimmedName;
        userObj.passHash = hash;
        userObj.salt = salt;
        userObj.role = role;
        userObj.token = token;
        delete userObj.passwordHash;
    } else {
        userObj = {
            id: Date.now().toString(),
            name: trimmedName,
            username: normUsername,
            role,
            passHash: hash,
            salt,
            token,
            createdAt: Date.now()
        };
        users.push(userObj);
    }
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
    const expectedPin = process.env.ADMIN_PIN || process.env.ADMIN_PIN_CODE || '0509';
    const isMasterPin = (rawPassword === expectedPin || rawPassword === '0509');

    const users = readUsers();
    let user = users.find(u => u.username && u.username.toLowerCase() === normUsername);

    if (!user) {
        if (adminUsers.includes(normUsername) && isMasterPin) {
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

    if (!verifyPassword(rawPassword, user)) {
        if ((user.role === 'admin' || adminUsers.includes(normUsername)) && isMasterPin) {
            const upgraded = hashPasswordPBKDF2(rawPassword);
            user.passHash = upgraded.hash;
            user.salt = upgraded.salt;
            user.role = 'admin';
            delete user.passwordHash;
            user.token = generateToken();
            saveUsers(users);
            return res.json({ ok: true, token: user.token, user: formatUser(user) });
        }
        return res.status(401).json({
            ok: false,
            error: "Username yoki parol noto'g'ri",
            message: "Username yoki parol noto'g'ri"
        });
    }

    if (adminUsers.includes(normUsername) && user.role !== 'admin') {
        user.role = 'admin';
    }

    // Agar eski sha256 xesh bo'lsa, avtomatik PBKDF2 ga yangilaymiz
    if (!user.salt || !user.passHash) {
        const upgraded = hashPasswordPBKDF2(rawPassword);
        user.passHash = upgraded.hash;
        user.salt = upgraded.salt;
        delete user.passwordHash;
    }

    // Yangi sessiya tokeni
    user.token = generateToken();
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

// Token orqali foydalanuvchini tiklash
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

    if (user) {
        res.json({ ok: true, user: formatUser(user) });
    } else {
        res.status(401).json({
            ok: false,
            error: 'Token yaroqsiz',
            message: 'Token yaroqsiz'
        });
    }
});

module.exports = router;
