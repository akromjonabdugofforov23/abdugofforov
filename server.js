const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const authRoutes = require('./routes/auth'); // Qo'shildi

// Xavfsizlik qatlamlarini import qilish (Middlewares)
const securityLayer1 = require('./middlewares/securityLayer1');
const securityLayer2 = require('./middlewares/securityLayer2');
const aiBotDetector = require('./middlewares/aiBotDetector');
const cacheMiddleware = require('./middlewares/cache');

const app = express();
const PORT = process.env.PORT || 8000;

// Body-parser qo'shildi (JSON o'qish uchun)
app.use(express.json());

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

// 1-bosqich: Helmet yordamida HTTP xavfsizlik sarlavhalari
app.use(securityLayer2);

// 2-bosqich: DDoS va ortiqcha so'rovlardan himoya
app.use('/auth', securityLayer1); // faqat /auth uchun limit kuchliroq qilsak ham bo'ladi, lekin hozircha barcha APIlarga qilsak ham bo'ladi
// Yoki avvalgidek hammasiga:
app.use(securityLayer1);

// 3-bosqich: AI bot detektori (Kelajakda kuchaytiriladi)
app.use(aiBotDetector);

// Tezlikni oshirish uchun Caching tizimi
// app.use(cacheMiddleware); // Hozircha cache API requestlarga xalaqit qilishi mumkin, lekin qoldiramiz

// Statik fayllarni ilova manbalaridan o'qish
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, 'public')));

// Marshrutlarni ulash
app.use('/auth', authRoutes); // Auth marshrutlari
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server ishga tushdi: http://localhost:${PORT}`);
    console.log(`Himoya qatlamlari: FAOL`);
});
