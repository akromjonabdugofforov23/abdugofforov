const rateLimit = require('express-rate-limit');

// 1-bosqich himoya: Rate Limiting
// Agar bitta IP manzildan 15 daqiqa ichida 100 martadan ko'p so'rov kelsa, uni bloklaydi.
// Bu DDoS hujumlarining oldini oladi.
const securityLayer1 = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 daqiqa
    max: 100, // Maksimal ruxsat etilgan so'rovlar soni
    message: "Juda ko'p so'rov yuborildi. Iltimos, 15 daqiqadan so'ng qayta urinib ko'ring.",
    standardHeaders: true, 
    legacyHeaders: false,
});

module.exports = securityLayer1;
