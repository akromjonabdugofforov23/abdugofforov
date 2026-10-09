const rateLimit = require('express-rate-limit');

// Ishonchli mijoz IP sini aniqlash (Cloudflare & Reverse Proxy xavfsizligi)
const getClientIp = (req) => {
    const cfIp = req.headers['cf-connecting-ip'];
    if (cfIp && typeof cfIp === 'string' && /^[0-9a-fA-F:.]+$/.test(cfIp.trim())) {
        return cfIp.trim();
    }
    const xff = req.headers['x-forwarded-for'];
    if (xff && typeof xff === 'string') {
        const first = xff.split(',')[0].trim();
        if (/^[0-9a-fA-F:.]+$/.test(first)) return first;
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
};

// 1-bosqich himoya: Umumiy so'rovlar uchun Rate Limiter (15 daqiqada 200 ta so'rov)
const securityLayer1 = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    keyGenerator: getClientIp,
    message: {
        ok: false,
        error: "Juda ko'p so'rov yuborildi. Iltimos, birozdan so'ng qayta urinib ko'ring."
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// Autentifikatsiya (login/register) uchun qat'iy limiter: 15 daqiqada 15 ta urinish
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    keyGenerator: getClientIp,
    message: {
        ok: false,
        error: "Juda ko'p autentifikatsiya urinishlari. Iltimos, 15 daqiqadan so'ng qayta urinib ko'ring."
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// Sun'iy intellekt (Gemini AI) so'rovlari uchun himoya: 10 daqiqada 25 ta so'rov
const aiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 25,
    keyGenerator: getClientIp,
    message: {
        ok: false,
        error: "AI so'rovlari kvotasi oshib ketdi. Iltimos, 10 daqiqadan so'ng qayta urinib ko'ring."
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// Admin API boshqaruvi uchun himoya limiteri: 10 daqiqada 60 ta so'rov
const adminLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 60,
    keyGenerator: getClientIp,
    message: {
        ok: false,
        error: "Admin so'rovlari limiti oshib ketdi. Iltimos, kuting."
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

securityLayer1.authLimiter = authLimiter;
securityLayer1.aiLimiter = aiLimiter;
securityLayer1.adminLimiter = adminLimiter;
securityLayer1.getClientIp = getClientIp;

module.exports = securityLayer1;
