const express = require('express');
const path = require('path');
const routes = require('./routes/index');

// Xavfsizlik qatlamlarini import qilish (Middlewares)
const securityLayer1 = require('./middlewares/securityLayer1');
const securityLayer2 = require('./middlewares/securityLayer2');
const aiBotDetector = require('./middlewares/aiBotDetector');
const cacheMiddleware = require('./middlewares/cache');

const app = express();
const PORT = process.env.PORT || 8000;

// 1-bosqich: Helmet yordamida HTTP xavfsizlik sarlavhalari
app.use(securityLayer2);

// 2-bosqich: DDoS va ortiqcha so'rovlardan himoya
app.use(securityLayer1);

// 3-bosqich: AI bot detektori (Kelajakda kuchaytiriladi)
app.use(aiBotDetector);

// Tezlikni oshirish uchun Caching tizimi
app.use(cacheMiddleware);

// Statik fayllarni ilova manbalaridan o'qish
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, 'public')));

// Marshrutlarni ulash
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server ishga tushdi: http://localhost:${PORT}`);
    console.log(`Himoya qatlamlari: FAOL`);
});
