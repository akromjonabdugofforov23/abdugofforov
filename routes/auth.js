const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '../users.json');

// Parolni xesh qilish uchun yordamchi funksiya
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
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

// Ro'yxatdan o'tish
router.post('/register', (req, res) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
        return res.status(400).json({ ok: false, error: "Barcha maydonlarni to'ldiring" });
    }

    const users = readUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ ok: false, error: "Bu username band" });
    }

    const token = generateToken();
    const newUser = {
        id: Date.now().toString(),
        name,
        username,
        passwordHash: hashPassword(password),
        token
    };

    users.push(newUser);
    saveUsers(users);

    res.json({
        ok: true,
        token,
        user: { id: newUser.id, name: newUser.name, username: newUser.username }
    });
});

// Kirish
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ ok: false, error: "Username va parolni kiriting" });
    }

    const users = readUsers();
    const user = users.find(u => u.username === username && u.passwordHash === hashPassword(password));

    if (!user) {
        return res.status(401).json({ ok: false, error: "Username yoki parol noto'g'ri" });
    }

    // Yangi token berish
    user.token = generateToken();
    saveUsers(users);

    res.json({
        ok: true,
        token: user.token,
        user: { id: user.id, name: user.name, username: user.username }
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
    if (!token) return res.status(401).json({ ok: false });

    const users = readUsers();
    const user = users.find(u => u.token === token);

    if (user) {
        res.json({ ok: true, user: { id: user.id, name: user.name, username: user.username } });
    } else {
        res.status(401).json({ ok: false });
    }
});

module.exports = router;
