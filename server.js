const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');

// Xavfsizlik qatlamlarini import qilish (Middlewares)
const securityLayer1 = require('./middlewares/securityLayer1');
const securityLayer2 = require('./middlewares/securityLayer2');
const aiBotDetector = require('./middlewares/aiBotDetector');

const app = express();
const PORT = process.env.PORT || 8000;

// Xavfsizlik: Server texnologiyasini oshkor qilmaslik
app.disable('x-powered-by');

// Xavfsizlik: Reverse proxy (Cloudflare/Nginx) orqasidagi haqiqiy mijoz IP sini olish
app.set('trust proxy', 1);

// Xavfsizlik: Katta hajmdagi zararli so'rovlar (DoS) ning oldini olish uchun body limit
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: false, limit: '500kb' }));

// CORS xavfsizligi — Wildcard (*) emas, faqat same-origin va ruxsat etilgan domenlar
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowed = [req.headers.host ? `${req.protocol}://${req.headers.host}` : ''];
    if (process.env.ALLOWED_ORIGINS) {
        process.env.ALLOWED_ORIGINS.split(',').forEach(o => {
            const t = o.trim();
            if (t) allowed.push(t);
        });
    }
    if (origin && (allowed.includes(origin) || allowed.includes(origin.replace(/\/$/, '')))) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
    }
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, x-user-token, x-admin-token, x-admin-pin");
    res.header("X-Content-Type-Options", "nosniff");
    if ('OPTIONS' === req.method) {
        res.sendStatus(204);
    } else {
        next();
    }
});

// 1-bosqich: Helmet yordamida HTTP xavfsizlik sarlavhalari (CSP, HSTS, X-Frame-Options)
app.use(securityLayer2);

// 2-bosqich: WAF & AI Bot Detektori (Zararli skanerlar, Traversal, Inyeksiya)
app.use(aiBotDetector);

// 3-bosqich: DDoS va ortiqcha so'rovlardan himoya (Rate Limiting)
app.use('/auth', securityLayer1.authLimiter || securityLayer1);
app.use(securityLayer1);

// Marshrutlarni ulash
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Statik fayllarni ilova manbalaridan o'qish
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server ishga tushdi: http://localhost:${PORT}`);
    console.log(`Himoya qatlamlari: FAOL (WAF, Helmet, RateLimiter, StrictAuth, Gemini AI, CMS)`);
});
