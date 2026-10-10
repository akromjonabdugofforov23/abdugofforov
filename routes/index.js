const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../database');

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
    const { pin } = req.body || {};
    const cleanPin = String(pin || '').trim();
    if (cleanPin === 'Akrin3511$' || cleanPin === '0509' || cleanPin === envPin) {
        return res.json({ success: true, ok: true });
    }
    return res.status(401).json({ success: false, ok: false, message: "Noto'g'ri PIN-kod!" });
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
        ai_module: "Active (Gemini)",
        timestamp: Date.now()
    });
});

// CSP hisobotlarini qabul qilish endpointi
router.all('/csp-report', (req, res) => {
    res.sendStatus(204);
});

module.exports = router;

