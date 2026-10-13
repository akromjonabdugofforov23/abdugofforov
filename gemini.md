# 📘 GEMINI.MD — ABDUGOFFOROV EKOTIZIMI VA BOSHQARUV JURNALI
> Ushbu hujjat loyihada amalga oshirilgan barcha ishlar, sahifalar tuzilishi, funksionalliklar va arxitektura o'zgarishlarini avtonom ravishda hujjatlashtirib boruvchi yagona boshqaruv manbasi hisoblanadi.

---

## 🏛️ 1. Loyihaning Umumiy Arxitekturasi

* **Domen**: `abdugofforov.uz`
* **Texnologik stak**: 
  * Frontend: Vanilla HTML5, CSS3 (Modern Glassmorphism, Responsive Grid/Flexbox), ES6+ JavaScript.
  * Backend: Node.js / Express (`server.js`) + Cloudflare Pages Functions (`/functions`).
  * Ma'lumotlar bazasi: Atomik JSON NoSQL bazasi (`data/db.json` & `database.js`) va Cloudflare KV (`POSTS_KV`).
  * Xavfsizlik: Helmet, Multi-layer WAF & Threat Detector, Rate-limiter, Scrypt & PBKDF2 parollar hashi, SHA-256 PIN & Telegram 2FA himoyasi.
* **Build tizimi**: `build.mjs` (Terser JS, Clean-CSS, HTML Minifier) -> `dist/` katalogi.

---

## 📄 2. Sahifalar va Ularda Amalga Oshirilgan Ishlar

### 🏠 1. Bosh Sahifa (`index.html`, `app.js`, `style.css`)
* **Vazifasi**: Shaxsiy blog, portfel, nemis tili va texnologiya markazi.
* **Funksionalligi & Qilingan ishlar**:
  * **Hero & Kun Hikmati**: Dinamik aforizm vidjeti (O'zbekcha va Nemischa tarjimasi bilan).
  * **Jonli Soat & Qidiruv (⌘K)**: Swiss Chronometer soati va real vaqtda maqolalarni qidirish paneli.
  * **Blog Panjarasi (Blog Grid)**: Barcha e'lon qilingan postlar, toifalar filtri, layklar, o'qish vaqti va xatcho'plar.
  * **Lofi / Ambient Player**: Sayt fonida chalg'itmaydigan audio pleyer.
  * **Zen Studio**: O'quvchilar va admin uchun qulay yozish va xotira muharriri.
  * **Foydalanuvchi Tizimi**: Ro'yxatdan o'tish, kirish (Login), Telegram orqali 1-klikda kirish, natijalar kabineti.

---

### 🎛️ 2. Boshqaruv Paneli (`kay.html`, `kay.js`)
* **Vazifasi**: Saytning to'liq avtonom CMS va boshqaruv markazi (`/kay`).
* **Funksionalligi & Qilingan ishlar**:
  * **Dizayn**: Dark Cyber Glassmorphism (`#07111c` — `#0c1e30`), neon teal (`#2dd4bf`), sapphire cyan (`#38bdf8`) va shaffof oynasimon panellar (`backdrop-filter: blur(20px)`).
  * **Mobil Moslashuvchanlik**: Smartfonlar uchun qulay pastki boshqaruv dok-paneli (**Bottom Dock**) va yuqori mobil menyu (☰).
  * **9 ta Boshqaruv Tabi**:
    1. 🏠 **Dashboard**: 6 ta neon nurli halqa statistikasi, 5 ta tezkor amal kartasi, server holati monitori (HTTPS, DB, WAF, 2FA, Backup).
    2. ✍️ **Maqolalar (CMS Studio)**: Maqola yaratish, tahrirlash, o'chirish, qidiruv, qurilmadan muqova rasmini yuklash + Unsplash presetlari, Markdown mini-toolbari, Telegram kanalga avtomatik e'lon qilish.
    3. 🚀 **Loyihalar (Projects)**: Loyihalar qo'shish, tahrirlash, o'chirish, texnologiyalar teglari, demo va GitHub havolalari.
    4. 💡 **Iqtiboslar (Quotes)**: Kun hikmatlarini boshqarish (O'zbek va Nemis tillarida).
    5. 👥 **Foydalanuvchilar (Users)**: O'quvchilar ro'yxati, rol almashtirish (Admin <-> Student), parolni yangilash, o'chirish.
    6. 📊 **Test Natijalari (Results)**: Real test natijalari tahlili, qidiruv, yagona o'chirish va barchasini tozalash.
    7. 📋 **Rejalar (Tasks Kanban)**: Rejalar yaratish, holatni 1 bosishda almashtirish (`todo` -> `progress` -> `done`), SVG doiraviy progress foizi.
    8. ⚙️ **Sayt Sozlamalari**: Sayt nomi, tavsif, muallif, bio, aloqa ma'lumotlari, ijtimoiy tarmoqlar, e'lon banneri, to'liq Zaxira (JSON Backup) yuklab olish va Tiklash (JSON Restore).
    9. 🔐 **Xavfsizlik**: PIN o'zgartirish, tizim loglari, Favqulodda chiqish (Panic Logout).

---

### 🇩🇪 3. Nemis Tili Akademiyasi (`deutsch.html`, `deutsch.js`)
* **Vazifasi**: Nemis tilini A1 dan B2 gacha interaktiv o'rganish platformasi (`/deutsch`).
* **Funksionalligi & Qilingan ishlar**:
  * **Grammatika & Darslar**: A1, A2, B1, B2 o'quv dasturlari (`data/curriculum-*.js`).
  * **Testlar Moduli**: Mavzulashtirilgan testlar, ballar hisobi, natijalarni serverga saqlash.
  * **Fleshkartalar (SRS)**: Leitner tizimi asosida so'zlarni yodlash (`scripts/flashcards.js`).
  * **Fe'llar Mashqi (Verb Trainer)**: Kuchli va noto'g'ri fe'llarning shakllarini mashq qilish.
  * **Matching Game**: So'z va ma'nolarini juftlash o'yini.

---

### 🛠️ 4. Mikro-Utilitalar Markazi (`tools.html`, `tools.js`)
* **Vazifasi**: Dasturchilar va foydalanuvchilar uchun mikro asboblar (`/tools`).
* **Funksionalligi & Qilingan ishlar**:
  * **WebP Image Converter**: Rasmlarni WebP formatiga siqish va o'lchamini optimallashtirish.
  * **JSON Formatter & Validator**: JSON ma'lumotlarini tekshirish, chiroyli formatlash va xatolarni ko'rsatish.
  * **Code Beautifier & Minifier**: HTML, CSS, JavaScript kodlarini tartibga keltirish.
  * **Matn va Kripto vositalari**: Hash generatsiya (MD5, SHA-256), Base64 kodlash/dekodlash, Word Counter.

---

### 🌌 5. 3D Vizual Lab (`3d-lab.html`)
* **Vazifasi**: Kosmik 3D tajribalar va WebGL vizualizatsiyasi (`/3d-lab`).
* **Funksionalligi & Qilingan ishlar**:
  * Three.js asosidagi interaktiv 3D fazo va sayyoralar modeli.
  * Kosmik zarrachalar (particles) va kamera harakatlari.

---

### 🔒 6. Backend, API va Xavfsizlik Qatlami
* **Fayllar**: `server.js`, `database.js`, `routes/`, `middlewares/`, `functions/`
* **Funksionalligi & Qilingan ishlar**:
  * **`database.js`**: `users`, `posts`, `projects`, `quotes`, `tasks`, `results`, `settings` atomik tranzaksiyaviy ma'lumotlar bazasi.
  * **`routes/admin.js`**: Barcha 9 ta modul uchun RESTful API (`GET`, `POST`, `PUT`, `DELETE`).
  * **`middlewares/auth.js`**: `x-user-token` va `x-admin-pin` fallback tizimi orqali uzluksiz xavfsiz avtorizatsiya.
  * **`services/telegram.js`**: Yangi maqola chop etilganda Telegram kanalga avtomatik chiroyli xabar tarqatish.
  * **`services/gemini.js`**: Gemini AI integratsiyasi.

---

## 🤖 3. Avtonom Ishlash Protokoli (AI Ko'rsatmasi)

Ushbu loyihada ishlovchi har qanday Gemini yoki AI Agent quyidagi qoidalarga qat'iy rioya qiladi:
1. **Doimiy Qayd**: Har bir sahifa yoki kodda yangi funksiya, tuzatish yoki o'zgarish qilinganda, ushbu `gemini.md` fayliga darhol yangi yozuv qo'shiladi.
2. **Sinov Majburiyati**: O'zgarish kiritilgandan so'ng `npm test` (`node scripts/health-check.js`) va `npm run build` (`node build.mjs`) muvaffaqiyatli yakunlanishi shart.
3. **Versiya va Git**: Har bir muhim bosqichdan so'ng o'zgarishlar Git orqali izoh bilan saqlanadi.

---

## 📝 4. Oxirgi O'zgarishlar Tarixi (Changelog)

### [2026-10-12 / 2026-10-13]
- **Admin Paneli Tubdan Yangilandi (`kay.html`, `kay.js`)**:
  - Dark Cyber Glassmorphism dizayni to'liq joriy etildi.
  - 9 ta to'liq CRUD boshqaruv tablari (Dashboard, Posts, Projects, Quotes, Users, Results, Tasks, Settings, Security) ulandi.
  - Mobil pastki dok-paneli (Bottom Dock) va responsive boshqaruv qo'shildi.
  - Server va Cloudflare API endpointlari to'liq sinxronlashtirildi.
  - `health-check.js` auditi: 0 xato, 0 ogohlantirish.
  - Git commit va GitHub ga muvaffaqiyatli push qilindi (`8540541`).
- **`gemini.md` hujjatlashtirish tizimi ishga tushirildi**:
  - Butun sayt sahifalari va vazifalari to'liq tavsiflandi.
