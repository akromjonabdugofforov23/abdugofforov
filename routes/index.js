const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const db = require('../database');
const { checkAdminPin } = require('../middlewares/auth');
const telegramService = require('../services/telegram');

// Asosiy sahifa (Frontend) uchun marshrut
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Deutsch akademiyasi
router.get(['/deutsch', '/deutsch/'], (req, res) => {
    res.sendFile(path.join(__dirname, '../deutsch.html'));
});

// Micro-Tools & Dev Utilities (Tools Lab)
router.get(['/tools', '/tools/', '/tools.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '../tools.html'));
});

// Kay Admin Paneli
router.get(['/kay', '/kay/', '/kay.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '../kay.html'));
});

// Admin PIN tekshiruvi (Local Node.js fallback)
router.post('/check-pin', (req, res) => {
    const { pin, token, adminPin } = req.body || {};
    const candidate = pin || token || adminPin || '';
    const cleanPin = String(candidate).trim();
    if (!cleanPin || cleanPin.length > 64 || !checkAdminPin(cleanPin)) {
        return res.status(401).json({ success: false, ok: false, message: "Noto'g'ri PIN-kod!" });
    }

    const tokenGenerated = crypto.randomBytes(32).toString('hex');
    let adminUser = db.findOne('users', u => u.username && ['abdugofforov', 'admin', 'akrin4477', 'akrin'].includes(u.username.toLowerCase())) ||
                    db.findOne('users', u => u.role === 'admin');
    if (adminUser) {
        db.update('users', adminUser.id, { token: tokenGenerated, tokenCreatedAt: Date.now(), lastLoginAt: Date.now() });
    }
    return res.json({ success: true, ok: true, token: tokenGenerated });
});

// 3D Lab
router.get(['/3d-lab', '/3d-lab.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '../3d-lab.html'));
});

// Dinamik XML Sitemap (SEO)
router.get('/sitemap.xml', (req, res) => {
    const baseUrl = 'https://abdugofforov.uz';
    const posts = db.find('posts', p => p.published !== false);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const staticPages = [
        { loc: '/', priority: '1.0', changefreq: 'daily' },
        { loc: '/deutsch', priority: '0.9', changefreq: 'weekly' },
        { loc: '/tools', priority: '0.8', changefreq: 'monthly' },
        { loc: '/3d-lab', priority: '0.7', changefreq: 'monthly' }
    ];

    staticPages.forEach(p => {
        xml += `  <url>\n    <loc>${baseUrl}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    });

    posts.forEach(post => {
        const modDate = new Date(post.updatedAt || post.createdAt).toISOString().split('T')[0];
        xml += `  <url>\n    <loc>${baseUrl}/#post-${post.id}</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
});

// Dinamik RSS Feed (Blog obunalari uchun)
router.get(['/rss.xml', '/feed.xml'], (req, res) => {
    const baseUrl = 'https://abdugofforov.uz';
    const posts = db.find('posts', p => p.published !== false);

    let rss = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
    rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
    rss += `<channel>\n`;
    rss += `  <title>Abdugofforov | Kay Kundaligi</title>\n`;
    rss += `  <link>${baseUrl}</link>\n`;
    rss += `  <description>Shaxsiy blog: xotiralar, nemis tili, texnologiya va intellektual fikrlar</description>\n`;
    rss += `  <language>uz</language>\n`;

    posts.slice(0, 20).forEach(post => {
        rss += `  <item>\n`;
        rss += `    <title><![CDATA[${post.title}]]></title>\n`;
        rss += `    <link>${baseUrl}/#post-${post.id}</link>\n`;
        rss += `    <guid>${baseUrl}/#post-${post.id}</guid>\n`;
        rss += `    <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>\n`;
        rss += `    <description><![CDATA[${post.excerpt || post.content.slice(0, 200)}]]></description>\n`;
        rss += `  </item>\n`;
    });

    rss += `</channel>\n`;
    rss += `</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml');
    res.send(rss);
});

// API tekshirish uchun holat (Health check)
router.get('/api/status', (req, res) => {
    res.json({
        status: "success",
        message: "Sayt va xavfsizlik qatlamlari a'lo darajada ishlamoqda!",
        ai_module: "Disabled",
        timestamp: Date.now()
    });
});

// ============================================================
// OMMAVIY API MARSHRUTLARI (PUBLIC API ENDPOINTS)
// ============================================================

// 1. Maqolalar (Faqat chop etilgan / published postlar)
router.get(['/posts', '/api/posts'], (req, res) => {
    const posts = db.find('posts', p => p.published !== false);
    res.json({ ok: true, posts });
});

router.get(['/posts/:id', '/api/posts/:id'], (req, res) => {
    const post = db.findById('posts', req.params.id) || db.findOne('posts', p => p.slug === req.params.id);
    if (!post || post.published === false) {
        return res.status(404).json({ ok: false, error: "Maqola topilmadi" });
    }
    // Ko'rishlar sonini oshirish (views count)
    db.update('posts', post.id, { views: (post.views || 0) + 1 });
    res.json({ ok: true, post: { ...post, views: (post.views || 0) + 1 } });
});

// 2. Kun hikmatlari / Iqtiboslar
router.get(['/quotes', '/api/quotes'], (req, res) => {
    const quotes = db.find('quotes');
    res.json({ ok: true, quotes });
});

// 3. Loyihalar
router.get(['/projects', '/api/projects'], (req, res) => {
    const projects = db.find('projects', p => p.status !== 'archived');
    res.json({ ok: true, projects });
});

// 4. Sayt sozlamalari
router.get(['/settings', '/api/settings'], (req, res) => {
    const settings = db.getSettings();
    res.json({ ok: true, settings });
});

// 5. Rejalar (Tasks)
router.get(['/tasks', '/api/tasks'], (req, res) => {
    const tasks = db.find('tasks');
    res.json({ ok: true, tasks });
});

// 5. Test natijalari (Results)
router.get(['/results', '/api/results'], (req, res) => {
    const results = db.find('results');
    res.json({ ok: true, results });
});

router.post(['/results', '/api/results'], (req, res) => {
    const { testId, testTitle, score, total, wrong, name, username } = req.body || {};
    const tTotal = Math.max(0, Math.min(200, parseInt(total, 10) || 0));
    const tScore = Math.max(0, Math.min(tTotal, parseInt(score, 10) || 0));
    const tWrong = wrong !== undefined ? parseInt(wrong, 10) : Math.max(0, tTotal - tScore);
    const pct = tTotal ? Math.round((tScore / tTotal) * 100) : 0;

    const entry = db.insert('results', {
        username: username || 'mehmon',
        name: name || username || 'Foydalanuvchi',
        testId: String(testId || '').slice(0, 40),
        testTitle: String(testTitle || '').slice(0, 80),
        score: tScore,
        total: tTotal,
        wrong: tWrong,
        pct,
        date: new Date().toISOString()
    });
    res.json({ ok: true, result: entry, message: "Natija saqlandi" });
});

// 6. Telegram Bildirishnomalari (Notify) va Izohlar
router.post(['/notify', '/api/notify'], async (req, res) => {
    try {
        const payload = req.body || {};
        const event = String(payload.event || 'event').slice(0, 40);

        if (event === 'comment') {
            const comment = {
                author: String(payload.author || 'Anonim').slice(0, 60),
                content: String(payload.content || payload.text || '').slice(0, 500)
            };
            const postTitle = String(payload.postTitle || 'Umumiy').slice(0, 100);
            await telegramService.notifyNewComment(comment, postTitle);
            return res.json({ ok: true, message: "Izoh haqida Telegramga xabar yuborildi" });
        }

        const note = String(payload.note || '').slice(0, 200);
        const text = `🔔 Abdugofforov admin\nHodisa: ${event}\n${note ? 'Izoh: ' + note + '\n' : ''}Vaqt: ${new Date().toISOString()}`;
        const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
        await telegramService.sendMessage(adminChatId, text);
        res.json({ ok: true });
    } catch (e) {
        res.json({ ok: false, error: e.message });
    }
});

// CSP hisobotlarini qabul qilish endpointi
router.all('/csp-report', (req, res) => {
    res.sendStatus(204);
});

module.exports = router;

