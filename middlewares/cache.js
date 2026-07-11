// Tezlikni oshirish uchun Caching tizimi
// Bu qatlam foydalanuvchi bir xil ma'lumotni qayta so'raganda,
// uni bazadan emas, balki to'g'ridan-to'g'ri xotiradan juda tez berib yuboradi.

const cache = new Map();

const cacheMiddleware = (req, res, next) => {
    // Faqat GET so'rovlari keshlanadi
    if (req.method !== 'GET') {
        return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log(`[Cache] Tezkor xotiradan berildi: ${key}`);
        return res.send(cachedResponse);
    } else {
        // Res.send funksiyasini ushlab qolib, javobni xotiraga saqlaymiz
        const originalSend = res.send;
        res.send = function (body) {
            cache.set(key, body);
            originalSend.call(this, body);
        };
        next();
    }
};

module.exports = cacheMiddleware;
