# Advanced Web Project with Node.js Backend

Bu loyiha saytni yuqori xavfsizlik (DDoS, XSS himoyalari) va yuqori tezlikda (Server-side Caching) ishlashi uchun mo'ljallangan Node.js poydevori (backend) hisoblanadi.

Shuningdek, u o'zida kelajakda integratsiya qilinadigan AI-bot detektori arxitekturasini qamrab oladi.
Frontend qismida esa interaktiv zarralardan iborat 3D gologramma uslubidagi (Canvas API) logotip yaratilgan.

## Papkalar tuzilishi

- `/middlewares` - Himoya va kesh qatlamlari:
  - `securityLayer1.js` - Rate Limiter
  - `securityLayer2.js` - Helmet (Header Security)
  - `aiBotDetector.js` - AI Model integratsiyasi uchun tayyor shablon
  - `cache.js` - Server kesh tizimi
- `/routes` - Sayt sahifalarini boshqarish uchun API marshrutlari.
- `/public` - Statik dizayn (HTML, CSS, JS Canvas) shu yerda saqlanadi.
- `server.js` - Barcha tizimlarni birlashtirib ishga tushiruvchi asosiy Node.js dasturi.

## Qanday ishga tushiriladi?

1. Loyiha papkasiga kiring:
```bash
cd logo-project
```

2. Modullarni o'rnating:
```bash
npm install
```

3. Dasturni ishga tushiring:
```bash
npm start
```
Server `http://localhost:8000` portida ishga tushadi.
