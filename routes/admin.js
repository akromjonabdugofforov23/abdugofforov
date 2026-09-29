/**
 * ============================================================
 * ABDUGOFFOROV ADMIN CMS & MANAGEMENT API
 * Foydalanuvchilar, postlar, natijalar va tizim statistikasi
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAdmin } = require('../middlewares/auth');
const { broadcastPost } = require('../services/telegram');

// Barcha admin marshrutlarini himoyalash
router.use(requireAdmin);

// 1. Tizim statistikasi
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

// 2. Foydalanuvchilar ro'yxati
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

// 3. Foydalanuvchi rolini o'zgartirish
router.put('/users/:id/role', (req, res) => {
    const { role } = req.body || {};
    if (!['admin', 'student'].includes(role)) {
        return res.status(400).json({ ok: false, error: "Noto'g'ri rol (faqat admin yoki student)" });
    }

    const targetUser = db.findById('users', req.params.id);
    if (!targetUser) {
        return res.status(404).json({ ok: false, error: "Foydalanuvchi topilmadi" });
    }

    // O'z-o'zini adminlikdan tushira olmaslik
    if (targetUser.id === req.user.id && role !== 'admin') {
        return res.status(400).json({ ok: false, error: "O'zingizning admin rolingizni o'chira olmaysiz" });
    }

    const updated = db.update('users', req.params.id, { role });
    res.json({ ok: true, user: { id: updated.id, username: updated.username, role: updated.role } });
});

// 4. Foydalanuvchini o'chirish
router.delete('/users/:id', (req, res) => {
    const targetUser = db.findById('users', req.params.id);
    if (!targetUser) {
        return res.status(404).json({ ok: false, error: "Foydalanuvchi topilmadi" });
    }
    if (targetUser.id === req.user.id) {
        return res.status(400).json({ ok: false, error: "O'zingizni o'chira olmaysiz" });
    }

    db.delete('users', req.params.id);
    res.json({ ok: true, message: "Foydalanuvchi o'chirildi" });
});

// 5. Postlar boshqaruvi (CMS)
router.get('/posts', (req, res) => {
    const posts = db.find('posts');
    res.json({ ok: true, posts });
});

router.post('/posts', (req, res) => {
    const { title, content, excerpt, tags, published } = req.body || {};
    if (!title || !content) {
        return res.status(400).json({ ok: false, error: "Sarlavha va kontent kiritilishi shart" });
    }

    const newPost = db.insert('posts', {
        title: String(title).trim(),
        content: String(content).trim(),
        excerpt: excerpt ? String(excerpt).trim() : title.slice(0, 150),
        tags: Array.isArray(tags) ? tags : [],
        published: published !== false,
        author: req.user.name || req.user.username,
        authorId: req.user.id,
        views: 0,
        likes: 0
    });

    if (newPost.published) broadcastPost(newPost).catch(() => {});
    res.json({ ok: true, post: newPost });
});

router.delete('/posts/:id', (req, res) => {
    const success = db.delete('posts', req.params.id);
    if (!success) {
        return res.status(404).json({ ok: false, error: "Post topilmadi" });
    }
    res.json({ ok: true, message: "Post muvaffaqiyatli o'chirildi" });
});

// 6. Zaxira nusxa (Backup) yuklab olish
router.get('/backup', (req, res) => {
    const backupData = {
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
        data: db.cache
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="abdugofforov_backup_${Date.now()}.json"`);
    res.send(JSON.stringify(backupData, null, 2));
});

module.exports = router;
