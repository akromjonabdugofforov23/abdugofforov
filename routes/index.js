const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const db = require('../database');
const { checkAdminPin, optionalAuth } = require('../middlewares/auth');
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

// Swiss Luxury Clock
router.get(['/clock', '/clock/', '/clock.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '../clock.html'));
});


// Cookie sarlavhasini tahlil qilish
function parseCookies(header) {
    const map = {};
    if (!header) return map;
    const parts = header.split(';');
    for (const p of parts) {
        const idx = p.indexOf('=');
        if (idx > -1) {
            const key = p.slice(0, idx).trim();
            const val = p.slice(idx + 1).trim();
            if (key) {
                try {
                    map[key] = decodeURIComponent(val);
                } catch (_) {
                    map[key] = val;
                }
            }
        }
    }
    return map;
}

const FORBIDDEN_HTML = `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 Forbidden — Kirish Taqiqlangan</title>
    <meta name="robots" content="noindex, nofollow, noarchive">
    <link rel="icon" type="image/svg+xml" href="/icon.svg">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: #07111c;
            color: #f0f6fc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background-image: 
                radial-gradient(ellipse 60% 50% at 50% 0%, rgba(244, 63, 94, 0.15) 0%, transparent 70%),
                radial-gradient(ellipse 50% 50% at 50% 100%, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
        }
        .forbidden-card {
            background: rgba(14, 30, 48, 0.85);
            border: 1px solid rgba(244, 63, 94, 0.35);
            border-radius: 20px;
            padding: 44px 36px;
            max-width: 480px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(244, 63, 94, 0.15);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .shield-icon {
            width: 72px;
            height: 72px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.05));
            border: 1px solid rgba(244, 63, 94, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 0 0 20px rgba(244, 63, 94, 0.25);
        }
        .status-badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #f43f5e;
            background: rgba(244, 63, 94, 0.12);
            border: 1px solid rgba(244, 63, 94, 0.3);
            padding: 4px 14px;
            border-radius: 999px;
            margin-bottom: 16px;
        }
        h1 {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #ffffff;
            letter-spacing: -0.5px;
        }
        p {
            font-size: 14px;
            line-height: 1.6;
            color: #9cb3c9;
            margin-bottom: 28px;
        }
        .btn-home {
            display: inline-block;
            width: 100%;
            padding: 13px 24px;
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
            background: linear-gradient(135deg, #0284c7, #2563eb);
            border: none;
            border-radius: 12px;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
        }
        .btn-home:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 22px rgba(37, 99, 235, 0.45);
        }
        .meta-notice {
            margin-top: 24px;
            font-size: 11px;
            color: #627d98;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
    </style>
</head>
<body>
    <div class="forbidden-card">
        <div class="shield-icon">🛡️</div>
        <div class="status-badge">403 Forbidden</div>
        <h1>Kirish Taqiqlangan</h1>
        <p>Ushbu boshqaruv qismiga to'g'ridan-to'g'ri kirish cheklangan. Tizim xavfsizlik protokoli tomonidan so'rov bloklandi.</p>
        <a href="/" class="btn-home">← Asosiy sahifaga qaytish</a>
        <div class="meta-notice">Security Shield: Access Denied</div>
    </div>
</body>
</html>`;

// Kay Admin Paneli — Stealth Shield (403 Forbidden Himoyasi)
router.get(['/kay', '/kay/', '/kay.html'], (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    const secretKey = req.query.key || req.query.secret || req.query.pin || req.query.token || req.query.gate;

    let isAuthorized = false;
    let shouldSetStealthCookie = false;

    // A) URL Query parametri orqali to'g'ri PIN yoki maxfiy token uzatilgan bo'lsa
    if (secretKey) {
        if (checkAdminPin(secretKey)) {
            isAuthorized = true;
            shouldSetStealthCookie = true;
        } else if (process.env.MAGIC_GATE_TOKEN && secretKey === process.env.MAGIC_GATE_TOKEN) {
            isAuthorized = true;
            shouldSetStealthCookie = true;
        } else if (process.env.ADMIN_TOKEN && secretKey === process.env.ADMIN_TOKEN) {
            isAuthorized = true;
            shouldSetStealthCookie = true;
        } else if (/^[a-f0-9]{32,128}$/i.test(secretKey)) {
            const adminUser = db.findOne('users', u => u.token === secretKey && (u.role === 'admin' || ['abdugofforov', 'admin'].includes(u.username)));
            if (adminUser) {
                isAuthorized = true;
                shouldSetStealthCookie = true;
            }
        }
    }

    // B) Cookie yoki mavjud admin sessiyasi orqali tekshirish
    if (!isAuthorized) {
        if (cookies.kay_stealth_pass === '1' || cookies.kay_admin_token) {
            isAuthorized = true;
        } else if (cookies.abdu_session_token) {
            const sessionUser = db.findOne('users', u => u.token === cookies.abdu_session_token);
            if (sessionUser && (sessionUser.role === 'admin' || ['abdugofforov', 'admin'].includes(sessionUser.username))) {
                isAuthorized = true;
            }
        }
    }

    // C) Ruxsat berilmagan bo'lsa — Qat'iy 403 Forbidden qaytariladi
    if (!isAuthorized) {
        return res.status(403).send(FORBIDDEN_HTML);
    }

    // D) Agar ruxsat berilgan bo'lsa
    if (shouldSetStealthCookie) {
        const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
        res.setHeader('Set-Cookie', `kay_stealth_pass=1; Path=/; Max-Age=2592000; SameSite=Lax${isSecure ? '; Secure' : ''}`);
    }

    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.sendFile(path.join(__dirname, '../kay.html'));
});

// Kay Admin JS skripti himoyasi
router.get(['/kay.js', '/kay.min.js'], (req, res, next) => {
    const cookies = parseCookies(req.headers.cookie);
    const isAuth = cookies.kay_stealth_pass === '1' || cookies.kay_admin_token || 
                   (cookies.abdu_session_token && db.findOne('users', u => u.token === cookies.abdu_session_token && (u.role === 'admin' || ['abdugofforov', 'admin'].includes(u.username))));
    if (!isAuth) {
        return res.status(403).type('text/javascript').send('// 403 Forbidden: Unauthorized access.');
    }
    next();
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
    let adminUser = db.findOne('users', u => u.username && ['abdugofforov', 'admin'].includes(u.username.toLowerCase())) ||
                    db.findOne('users', u => u.role === 'admin');
    if (adminUser) {
        db.update('users', adminUser.id, { token: tokenGenerated, tokenCreatedAt: Date.now(), lastLoginAt: Date.now() });
    }
    return res.json({ success: true, ok: true, token: tokenGenerated });
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
        { loc: '/clock', priority: '0.7', changefreq: 'monthly' }
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
    const b = req.body || {};
    const rawTotal = b.total !== undefined ? b.total : (b.maxScore !== undefined ? b.maxScore : 10);
    const tTotal = Math.max(1, Math.min(200, parseInt(rawTotal, 10) || 10));
    const rawScore = b.score !== undefined ? b.score : (b.correct !== undefined ? b.correct : 0);
    const tScore = Math.max(0, Math.min(tTotal, parseInt(rawScore, 10) || 0));
    const tWrong = b.wrong !== undefined ? parseInt(b.wrong, 10) : Math.max(0, tTotal - tScore);
    const pct = Math.round((tScore / tTotal) * 100);

    const testId = String(b.testId || b.topicId || 'quiz').slice(0, 40);
    const testTitle = String(b.testTitle || b.topicTitle || (b.level ? b.level + ' Test' : 'Nemis tili testi')).slice(0, 80);

    const entry = db.insert('results', {
        username: b.username || 'mehmon',
        name: b.name || b.username || 'Foydalanuvchi',
        testId,
        testTitle,
        score: tScore,
        total: tTotal,
        wrong: tWrong,
        pct,
        date: new Date().toISOString()
    });
    res.json({ ok: true, result: entry, message: "Natija saqlandi" });
});

// 6. Turnir (Tournament & Leaderboard)
router.get(['/tournament', '/api/tournament'], (req, res) => {
    const leaderboard = db.getTournamentLeaderboard(50);
    res.json({ ok: true, leaderboard, count: leaderboard.length });
});

router.post(['/tournament', '/api/tournament'], optionalAuth, (req, res) => {
    const body = req.body || {};
    const total = Math.max(1, Math.min(200, parseInt(body.total, 10) || 0));
    const score = Math.max(0, Math.min(total, parseInt(body.score, 10) || 0));

    let username = req.user ? req.user.username : null;
    let name, registered = false;
    if (req.user) {
        name = req.user.name || req.user.username;
        registered = true;
    } else {
        name = String(body.name || '').trim().slice(0, 40) || 'Mehmon';
    }

    const entry = {
        id: crypto.randomBytes(4).toString('hex'),
        name,
        username: username || null,
        registered,
        score,
        total,
        pct: total ? Math.round((score / total) * 100) : 0,
        date: new Date().toISOString()
    };

    db.saveTournamentScore(entry);

    const leaderboard = db.getTournamentLeaderboard(0);
    const rank = leaderboard.findIndex(e =>
        (entry.username && e.username === entry.username) ||
        (!entry.username && e.name === entry.name && e.score === entry.score)
    );

    res.json({
        ok: true,
        saved: entry,
        rank: rank >= 0 ? rank + 1 : null,
        totalPlayers: leaderboard.length
    });
});

// 7. Telegram Bildirishnomalari (Notify) va Izohlar
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

