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
    const allowed = [
        req.headers.host ? `${req.protocol}://${req.headers.host}` : '',
        'https://abdugofforov.uz',
        'https://deutsch.abdugofforov.uz',
        'https://tools.abdugofforov.uz',
        'https://cv.abdugofforov.uz'
    ];
    if (process.env.ALLOWED_ORIGINS) {
        process.env.ALLOWED_ORIGINS.split(',').forEach(o => {
            const t = o.trim();
            if (t) allowed.push(t);
        });
    }

    let isOriginAllowed = false;
    if (origin) {
        try {
            const originUrl = new URL(origin);
            if (originUrl.hostname === 'abdugofforov.uz' || originUrl.hostname.endsWith('.abdugofforov.uz')) {
                isOriginAllowed = true;
            }
        } catch (_) {}
        if (!isOriginAllowed && (allowed.includes(origin) || allowed.includes(origin.replace(/\/$/, '')))) {
            isOriginAllowed = true;
        }
    }

    if (origin && isOriginAllowed) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
    }
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, x-user-token, x-admin-token, x-admin-pin");
    res.header("Access-Control-Max-Age", "86400");
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
app.use('/api/ai', securityLayer1.aiLimiter || securityLayer1);
app.use('/api/admin', securityLayer1.adminLimiter || securityLayer1);
app.use(securityLayer1);

// Maxfiy ma'lumotlar va API endpointlar uchun keshlanishni taqiqlash (No-Cache protokoli)
const noCacheMiddleware = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
};

// Marshrutlarni ulash
app.use('/auth', noCacheMiddleware, authRoutes);
app.use('/api/admin', noCacheMiddleware, adminRoutes);
app.use('/api/ai', noCacheMiddleware, aiRoutes);

// Statik fayllarni ilova manbalaridan o'qish
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server ishga tushdi: http://localhost:${PORT}`);
    console.log(`Himoya qatlamlari: FAOL (WAF, Helmet, RateLimiter, StrictAuth, Gemini AI, CMS)`);
});
