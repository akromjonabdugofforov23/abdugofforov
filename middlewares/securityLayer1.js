const rateLimit = require('express-rate-limit');

// 1-bosqich himoya: Rate Limiting
// Umumiy so'rovlar uchun limiter: 15 daqiqada 150 ta so'rov
const securityLayer1 = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 daqiqa
    max: 150, // Maksimal ruxsat etilgan so'rovlar soni
    message: {
        ok: false,
        error: "Juda ko'p so'rov yuborildi. Iltimos, 15 daqiqadan so'ng qayta urinib ko'ring."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Autentifikatsiya (login/register) uchun qat'iy limiter: 15 daqiqada 15 ta urinish
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
        ok: false,
        error: "Juda ko'p autentifikatsiya urinishlari. Iltimos, 15 daqiqadan so'ng qayta urinib ko'ring."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

securityLayer1.authLimiter = authLimiter;

module.exports = securityLayer1;
