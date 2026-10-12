/**
 * ============================================================
 * ABDUGOFFOROV ADMIN CMS & MANAGEMENT API
 * Foydalanuvchilar, postlar, loyihalar, iqtiboslar, vazifalar,
 * natijalar, sayt sozlamalari va zaxira nusxalari boshqaruvi
 * ============================================================
 */

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../database');
const { requireAdmin } = require('../middlewares/auth');
const { broadcastPost } = require('../services/telegram');

// Scrypt xavfsiz shifrlash parametrlari
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 };

function hashPassword(password) {
    const salt = crypto.randomBytes(32);
    const hash = crypto.scryptSync(password, salt, 64, SCRYPT_PARAMS).toString('hex');
    return {
        passHash: hash,
        salt: salt.toString('hex'),
        algo: 'scrypt'
    };
}

// Barcha admin marshrutlarini himoyalash
router.use(requireAdmin);

// ============================================================
// 1. TIZIM STATISTIKASI (STATS)
// ============================================================
router.get('/stats', (req, res) => {
    const stats = db.getStats();
    res.json({
        ok: true,
        stats: {
            ...stats,
            uptimeSeconds: Math.floor(process.uptime()),
            nodeVersion: process.version,
            memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024))
        }
    });
});

// ============================================================
// 2. MAQOLALAR BOSHQARUVI (POSTS CRUD)
// ============================================================
router.get('/posts', (req, res) => {
    const posts = db.find('posts');
    res.json({ ok: true, posts });
});

router.post('/posts', (req, res) => {
    const { id, title, content, excerpt, tags, published, slug, image, coverImage } = req.body || {};
    if (!title || !content) {
        return res.status(400).json({ ok: false, error: "Sarlavha va kontent kiritilishi shart" });
    }

    const postImage = image ? String(image).trim() : (coverImage ? String(coverImage).trim() : '');

    // Agar ID berilgan bo'lsa va mavjud bo'lsa -> yangilash
    if (id && db.findById('posts', id)) {
        const updated = db.update('posts', id, {
            title: String(title).trim(),
            content: String(content).trim(),
            excerpt: excerpt ? String(excerpt).trim() : title.slice(0, 150),
            tags: Array.isArray(tags) ? tags : [],
            image: postImage || undefined,
            published: published !== false,
            slug: slug ? String(slug).trim() : undefined
        });

        const shouldNotifyTg = req.body.telegram === true || req.body.sendTelegram === true || req.body.notifyTelegram === true;
        if (updated.published && shouldNotifyTg) {
            broadcastPost(updated).catch(() => {});
        }
        return res.json({ ok: true, post: updated, message: "Post muvaffaqiyatli yangilandi" });
    }

    // Yangi post yaratish
    const newPost = db.insert('posts', {
        id: id || undefined,
        title: String(title).trim(),
        content: String(content).trim(),
        excerpt: excerpt ? String(excerpt).trim() : title.slice(0, 150),
        tags: Array.isArray(tags) ? tags : [],
        image: postImage,
        published: published !== false,
        slug: slug ? String(slug).trim() : undefined,
        author: req.user?.name || req.user?.username || "Abdug'afforov",
        authorId: req.user?.id || 'admin',
        views: 0,
        likes: 0
    });

    const shouldNotifyTg = req.body.telegram === true || req.body.sendTelegram === true || req.body.notifyTelegram === true;
    if (newPost.published && shouldNotifyTg) {
        broadcastPost(newPost).catch(() => {});
    }

    res.json({ ok: true, post: newPost, message: "Yangi post yaratildi" });
});

router.put('/posts/:id', (req, res) => {
    const post = db.findById('posts', req.params.id);
    if (!post) {
        return res.status(404).json({ ok: false, error: "Post topilmadi" });
    }

    const { title, content, excerpt, tags, published, slug, image, coverImage } = req.body || {};
    const updates = {};
    if (title !== undefined) updates.title = String(title).trim();
    if (content !== undefined) updates.content = String(content).trim();
    if (excerpt !== undefined) updates.excerpt = String(excerpt).trim();
    if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : [];
    if (published !== undefined) updates.published = !!published;
    if (slug !== undefined) updates.slug = String(slug).trim();
    if (image !== undefined) updates.image = String(image).trim();
    else if (coverImage !== undefined) updates.image = String(coverImage).trim();

    const updated = db.update('posts', req.params.id, updates);

    const shouldNotifyTg = req.body.telegram === true || req.body.sendTelegram === true || req.body.notifyTelegram === true;
    if (updated.published && shouldNotifyTg) {
        broadcastPost(updated).catch(() => {});
    }

    res.json({ ok: true, post: updated, message: "Post muvaffaqiyatli tahrirlandi" });
});

router.delete('/posts/:id', (req, res) => {
    const success = db.delete('posts', req.params.id);
    if (!success) {
        return res.status(404).json({ ok: false, error: "Post topilmadi" });
    }
    res.json({ ok: true, message: "Post muvaffaqiyatli o'chirildi" });
});

// ============================================================
// 3. LOYIHALAR BOSHQARUVI (PROJECTS CRUD)
// ============================================================
router.get('/projects', (req, res) => {
    const projects = db.find('projects');
    res.json({ ok: true, projects });
});

router.post('/projects', (req, res) => {
    const { title, description, desc, link, category, cat, tags, tech, status, techStack, icon, github, image } = req.body || {};
    const finalDesc = description || desc;
    if (!title || !finalDesc) {
        return res.status(400).json({ ok: false, error: "Loyiha nomi va tavsifi kiritilishi shart" });
    }

    const newProject = db.insert('projects', {
        id: req.body.id || undefined,
        title: String(title).trim(),
        description: String(finalDesc).trim(),
        desc: String(finalDesc).trim(),
        link: link ? String(link).trim() : '#',
        github: github ? String(github).trim() : '',
        category: category ? String(category).trim() : (cat ? String(cat).trim() : 'General'),
        cat: cat ? String(cat).trim() : (category ? String(category).trim() : 'General'),
        tags: Array.isArray(tags) ? tags : (Array.isArray(tech) ? tech : []),
        tech: Array.isArray(tech) ? tech : (Array.isArray(tags) ? tags : []),
        status: status ? String(status).trim() : 'active',
        techStack: Array.isArray(techStack) ? techStack : (Array.isArray(tech) ? tech : []),
        icon: icon ? String(icon).trim() : 'fa-code',
        image: image ? String(image).trim() : ''
    });

    res.json({ ok: true, project: newProject, message: "Loyiha muvaffaqiyatli qo'shildi" });
});

router.put('/projects/:id', (req, res) => {
    const project = db.findById('projects', req.params.id);
    if (!project) {
        return res.status(404).json({ ok: false, error: "Loyiha topilmadi" });
    }

    const { title, description, desc, link, category, cat, tags, tech, status, techStack, icon, github, image } = req.body || {};
    const updates = {};
    if (title !== undefined) updates.title = String(title).trim();
    const finalDesc = description !== undefined ? description : desc;
    if (finalDesc !== undefined) {
        updates.description = String(finalDesc).trim();
        updates.desc = String(finalDesc).trim();
    }
    if (link !== undefined) updates.link = String(link).trim();
    if (github !== undefined) updates.github = String(github).trim();
    const finalCat = category !== undefined ? category : cat;
    if (finalCat !== undefined) {
        updates.category = String(finalCat).trim();
        updates.cat = String(finalCat).trim();
    }
    const finalTech = tags !== undefined ? tags : tech;
    if (finalTech !== undefined) {
        updates.tags = Array.isArray(finalTech) ? finalTech : [];
        updates.tech = Array.isArray(finalTech) ? finalTech : [];
    }
    if (status !== undefined) updates.status = String(status).trim();
    if (techStack !== undefined) updates.techStack = Array.isArray(techStack) ? techStack : [];
    if (icon !== undefined) updates.icon = String(icon).trim();
    if (image !== undefined) updates.image = String(image).trim();

    const updated = db.update('projects', req.params.id, updates);
    res.json({ ok: true, project: updated, message: "Loyiha muvaffaqiyatli tahrirlandi" });
});

router.delete('/projects/:id', (req, res) => {
    const success = db.delete('projects', req.params.id);
    if (!success) {
        return res.status(404).json({ ok: false, error: "Loyiha topilmadi" });
    }
    res.json({ ok: true, message: "Loyiha muvaffaqiyatli o'chirildi" });
});

// ============================================================
// 4. IQTIBOSLAR / KUN HIKMATLARI (QUOTES CRUD)
// ============================================================
router.get('/quotes', (req, res) => {
    const quotes = db.find('quotes');
    res.json({ ok: true, quotes });
});

router.post('/quotes', (req, res) => {
    const { uz, de, author, category, text, quote } = req.body || {};
    const uzText = uz || text || quote || '';
    if (!uzText && !de) {
        return res.status(400).json({ ok: false, error: "O'zbekcha yoki nemischa iqtibos matni talab qilinadi" });
    }

    const newQuote = db.insert('quotes', {
        id: req.body.id || undefined,
        uz: uzText ? String(uzText).trim() : '',
        quote: uzText ? String(uzText).trim() : '',
        de: de ? String(de).trim() : '',
        author: author ? String(author).trim() : "Noma'lum",
        category: category ? String(category).trim() : 'General',
        cat: category ? String(category).trim() : 'General'
    });

    res.json({ ok: true, quote: newQuote, message: "Iqtibos muvaffaqiyatli qo'shildi" });
});

router.put('/quotes/:id', (req, res) => {
    const targetQuote = db.findById('quotes', req.params.id);
    if (!targetQuote) {
        return res.status(404).json({ ok: false, error: "Iqtibos topilmadi" });
    }

    const { uz, de, author, category, text, quote } = req.body || {};
    const updates = {};
    const uzText = uz || text || quote;
    if (uzText !== undefined) {
        updates.uz = String(uzText).trim();
        updates.quote = String(uzText).trim();
    }
    if (de !== undefined) updates.de = String(de).trim();
    if (author !== undefined) updates.author = String(author).trim();
    if (category !== undefined) {
        updates.category = String(category).trim();
        updates.cat = String(category).trim();
    }

    const updated = db.update('quotes', req.params.id, updates);
    res.json({ ok: true, quote: updated, message: "Iqtibos muvaffaqiyatli tahrirlandi" });
});

router.delete('/quotes/:id', (req, res) => {
    const success = db.delete('quotes', req.params.id);
    if (!success) {
        return res.status(404).json({ ok: false, error: "Iqtibos topilmadi" });
    }
    res.json({ ok: true, message: "Iqtibos muvaffaqiyatli o'chirildi" });
});

// ============================================================
// 5. REJALAR VA VAZIFALAR (TASKS CRUD)
// ============================================================
router.get('/tasks', (req, res) => {
    const tasks = db.find('tasks');
    res.json({ ok: true, tasks });
});

router.post('/tasks', (req, res) => {
    const { title, description, status, priority, dueDate, tags } = req.body || {};
    if (!title) {
        return res.status(400).json({ ok: false, error: "Vazifa nomi kiritilishi shart" });
    }

    const newTask = db.insert('tasks', {
        id: req.body.id ? String(req.body.id) : undefined,
        title: String(title).trim(),
        description: description ? String(description).trim() : '',
        status: ['todo', 'progress', 'done', 'in_progress', 'completed'].includes(status) ? status : 'todo',
        priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
        dueDate: dueDate || null,
        tags: Array.isArray(tags) ? tags : []
    });

    res.json({ ok: true, task: newTask, message: "Vazifa muvaffaqiyatli qo'shildi" });
});

router.put('/tasks/:id', (req, res) => {
    const task = db.findById('tasks', req.params.id);
    if (!task) {
        return res.status(404).json({ ok: false, error: "Vazifa topilmadi" });
    }

    const { title, description, status, priority, dueDate, tags } = req.body || {};
    const updates = {};
    if (title !== undefined) updates.title = String(title).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (status !== undefined && ['todo', 'progress', 'done', 'in_progress', 'completed'].includes(status)) updates.status = status;
    if (priority !== undefined && ['low', 'medium', 'high'].includes(priority)) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : [];

    const updated = db.update('tasks', req.params.id, updates);
    res.json({ ok: true, task: updated, message: "Vazifa muvaffaqiyatli tahrirlandi" });
});

router.delete('/tasks/:id', (req, res) => {
    const success = db.delete('tasks', req.params.id);
    if (!success) {
        return res.status(404).json({ ok: false, error: "Vazifa topilmadi" });
    }
    res.json({ ok: true, message: "Vazifa muvaffaqiyatli o'chirildi" });
});

// ============================================================
// 6. FOYDALANUVCHILAR BOSHQARUVI (USERS CRUD)
// ============================================================
router.get('/users', (req, res) => {
    const users = db.find('users').map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        role: u.role,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt || null,
        isLocked: !!(u.lockUntil && u.lockUntil > Date.now())
    }));
    res.json({ ok: true, users });
});

router.post('/users', (req, res) => {
    const { name, username, password, role } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ ok: false, error: "Username va parol kiritilishi shart" });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const existing = db.findOne('users', u => u.username && u.username.toLowerCase() === cleanUsername);
    if (existing) {
        return res.status(400).json({ ok: false, error: "Bu username allaqachon band" });
    }

    const { passHash, salt, algo } = hashPassword(String(password));
    const newUser = db.insert('users', {
        name: name ? String(name).trim() : cleanUsername,
        username: cleanUsername,
        role: role === 'admin' ? 'admin' : 'student',
        passHash,
        salt,
        algo,
        token: null,
        failedAttempts: 0,
        lockUntil: null
    });

    res.json({
        ok: true,
        user: {
            id: newUser.id,
            name: newUser.name,
            username: newUser.username,
            role: newUser.role,
            createdAt: newUser.createdAt
        },
        message: "Foydalanuvchi muvaffaqiyatli qo'shildi"
    });
});

router.put('/users/:id/role', (req, res) => {
    const { role } = req.body || {};
    if (!['admin', 'student'].includes(role)) {
        return res.status(400).json({ ok: false, error: "Noto'g'ri rol (faqat admin yoki student)" });
    }

    const targetUser = db.findById('users', req.params.id) || db.findOne('users', u => u.username && u.username.toLowerCase() === String(req.params.id).toLowerCase());
    if (!targetUser) {
        return res.status(404).json({ ok: false, error: "Foydalanuvchi topilmadi" });
    }

    if (targetUser.id === req.user?.id && role !== 'admin') {
        return res.status(400).json({ ok: false, error: "O'zingizning admin rolingizni o'chira olmaysiz" });
    }

    const updated = db.update('users', targetUser.id, { role });
    res.json({ ok: true, user: { id: updated.id, username: updated.username, role: updated.role }, message: "Foydalanuvchi roli yangilandi" });
});

router.put('/users/:id/password', (req, res) => {
    const { password } = req.body || {};
    if (!password || String(password).length < 4) {
        return res.status(400).json({ ok: false, error: "Parol kamida 4 ta belgidan iborat bo'lishi kerak" });
    }

    const targetUser = db.findById('users', req.params.id) || db.findOne('users', u => u.username && u.username.toLowerCase() === String(req.params.id).toLowerCase());
    if (!targetUser) {
        return res.status(404).json({ ok: false, error: "Foydalanuvchi topilmadi" });
    }

    const { passHash, salt, algo } = hashPassword(String(password));
    db.update('users', targetUser.id, {
        passHash,
        salt,
        algo,
        token: null, // Parol o'zgarganda mavjud sessiya tokenini bekor qilish
        failedAttempts: 0,
        lockUntil: null
    });

    res.json({ ok: true, message: "Parol muvaffaqiyatli yangilandi" });
});

router.post(['/reset-password', '/users/reset-password'], (req, res) => {
    const { username, newPassword, password } = req.body || {};
    const pass = newPassword || password;
    if (!username || !pass || String(pass).length < 4) {
        return res.status(400).json({ ok: false, error: "Username va kamida 4 belgili parol kiritilishi shart" });
    }

    const targetUser = db.findOne('users', u => (u.username && u.username.toLowerCase() === String(username).toLowerCase()) || String(u.id) === String(username));
    if (!targetUser) {
        return res.status(404).json({ ok: false, error: "Foydalanuvchi topilmadi" });
    }

    const { passHash, salt, algo } = hashPassword(String(pass));
    db.update('users', targetUser.id, {
        passHash,
        salt,
        algo,
        token: null,
        failedAttempts: 0,
        lockUntil: null
    });

    res.json({ ok: true, message: "Parol muvaffaqiyatli yangilandi" });
});

router.delete('/users/:id', (req, res) => {
    const targetUser = db.findById('users', req.params.id) || db.findOne('users', u => u.username && u.username.toLowerCase() === String(req.params.id).toLowerCase());
    if (!targetUser) {
        return res.status(404).json({ ok: false, error: "Foydalanuvchi topilmadi" });
    }
    if (targetUser.id === req.user?.id) {
        return res.status(400).json({ ok: false, error: "O'zingizni o'chira olmaysiz" });
    }

    db.delete('users', targetUser.id);
    res.json({ ok: true, message: "Foydalanuvchi muvaffaqiyatli o'chirildi" });
});

router.post('/change-pin', (req, res) => {
    try {
        const { oldPin, newPin } = req.body || {};
        if (!newPin || typeof newPin !== 'string' || newPin.trim().length < 4) {
            return res.status(400).json({ ok: false, error: "Yangi PIN kamida 4 belgidan iborat bo'lishi kerak" });
        }
        const { checkAdminPin } = require('../middlewares/auth');
        if (oldPin && !checkAdminPin(oldPin)) {
            return res.status(403).json({ ok: false, error: "Eski PIN noto'g'ri kiritildi" });
        }
        db.updateSettings({ adminPin: newPin.trim() });
        res.json({ ok: true, message: "PIN kod muvaffaqiyatli yangilandi" });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// ============================================================
// 7. NATIJALAR BOSHQARUVI (RESULTS MANAGEMENT)
// ============================================================
router.get('/results', (req, res) => {
    const results = db.find('results');
    res.json({ ok: true, results });
});

router.delete('/results/:id', (req, res) => {
    const success = db.delete('results', req.params.id);
    if (!success) {
        return res.status(404).json({ ok: false, error: "Natija topilmadi" });
    }
    res.json({ ok: true, message: "Natija muvaffaqiyatli o'chirildi" });
});

router.delete('/results', (req, res) => {
    db.clear('results');
    res.json({ ok: true, message: "Barcha test natijalari tozalandi" });
});

// ============================================================
// 8. SAYT SOZLAMALARI (SETTINGS)
// ============================================================
router.get('/settings', (req, res) => {
    const settings = db.getSettings();
    res.json({ ok: true, settings });
});

router.post('/settings', (req, res) => {
    const updated = db.updateSettings(req.body);
    res.json({ ok: true, settings: updated, message: "Sozlamalar saqlandi" });
});

router.put('/settings', (req, res) => {
    const updated = db.updateSettings(req.body);
    res.json({ ok: true, settings: updated, message: "Sozlamalar yangilandi" });
});

// ============================================================
// 9. ZAXIRA NUSXA VA TIKLASH (BACKUP & RESTORE)
// ============================================================
router.get('/backup', (req, res) => {
    const backupData = {
        exportedAt: new Date().toISOString(),
        version: "2.0.0",
        data: db.cache
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="abdugofforov_backup_${Date.now()}.json"`);
    res.send(JSON.stringify(backupData, null, 2));
});

router.post('/backup/restore', (req, res) => {
    try {
        const payload = req.body;
        if (!payload || typeof payload !== 'object') {
            return res.status(400).json({ ok: false, error: "Yaroqsiz zaxira fayl formati" });
        }
        const success = db.restore(payload);
        if (success) {
            return res.json({ ok: true, message: "Ma'lumotlar bazasi zaxira nusxadan muvaffaqiyatli tiklandi" });
        }
        res.status(500).json({ ok: false, error: "Tiklash jarayonida xatolik yuz berdi" });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// ============================================================
// 10. TELEGRAM XABARNOMA XIZMATI
// ============================================================
router.post('/notify/telegram', async (req, res) => {
    try {
        const { post, message } = req.body || {};
        const targetPost = post || {
            title: message || 'Yangi xabar',
            excerpt: message ? message.slice(0, 160) : '',
            content: message || ''
        };
        const result = await broadcastPost(targetPost);
        res.json({ ok: true, result, message: "Telegram kanalga xabar yuborildi" });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

module.exports = router;
