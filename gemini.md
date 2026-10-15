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
4. **Dual-Backend Qoidasi**: Har qanday API yoki ma'lumotlar strukturasi o'zgarganda, o'zgarish bir vaqtning o'zida ham Express (routes/ va database.js), ham Cloudflare Pages Functions (functions/) qatlamida bir xil amalga oshirilishi shart.

---

## 📝 4. Oxirgi O'zgarishlar Tarixi (Changelog)

### [2026-10-13]
- **Kritik Xavfsizlik va Arxitektura Muammolari To'liq Bartaraf Etildi**:
  - **Data Leak To'xtatildi**: `build.mjs` da `copyDir` filtri o'rnatildi, `data/db.json` va `users.json` endi hech qachon `dist/` papkasiga ko'chirilmaydi.
  - **WAF & Path Blocking**: `middlewares/aiBotDetector.js` va `functions/_middleware.js` da `db.json`, `users.json`, `package.json`, server kodlari va ichki modullar yo'llari 403/404 bilan to'liq to'sildi.
  - **Hardcoded Parollar Tozalandi**: `routes/index.js`, `middlewares/auth.js`, `routes/auth.js`, va `functions/_lib.js` fayllaridan ochiq matndagi `'[REDACTED_PIN]'` va `'[REDACTED_PASSWORD]'` simvollari butunlay olib tashlandi; doimiy vaqtli (timing-safe) SHA-256 va `ADMIN_PIN_HASH` ustuvor tekshiruvi o'rnatildi.
  - **Privilege Escalation Bartaraf Etildi**: `/auth/register` orqali begona foydalanuvchilar PIN kiritib `admin` bo'lib olishi taqiqlandi (faqat tizimda oldindan ruxsat berilgan `adminUsers` username'larigina admin bo'la oladi).
  - **Loyihalar (Portfolio Projects) To'liq Sinxronlashtirildi**:
    - `app.js` da `getPortfolioProjects()` yordamchisi va loyihalar tabini chiroyli Glassmorphism kartalarida render qilish tizimi qo'shildi. Bosh sahifa ochilganda `/projects` dan avtomatik sinxronlanadi.
    - Cloudflare Pages Functions uchun `functions/projects.js` va `functions/tasks.js` yaratildi.
    - `kay.js` dagi fetch so'rovlariga Cloudflare endpointlari zaxira sifatida ulandi.
  - **Telegram 2FA (2-Bosqichli Kirish) To'liq Faollashtirildi**:
    - `kay.js` dagi avvalgi `/check-pin` orqali to'g'ridan-to'g'ri kirish bypassi butunlay olib tashlandi. Endi PIN kiritilgandan so'ng darhol `/admin/request-code` orqali Telegram 2FA kodi talab qilinadi.
    - Node.js Express serveriga (`routes/admin.js`) `/admin/request-code` va `/admin/verify-code` endpointlari qo'shildi (`services/telegram.js` orqali botga 6 xonali tasdiqlash kodi yuboriladi va tekshiriladi).
    - `server.js` da nol-qaramlikli `.env` loaderi ulandi.
### [2026-10-14]
- **6 Bosqichli Keng Ko'lamli Texnik Topshiriq To'liq Yakunlandi**:
  - **1. Admin boshqaruv elementlari oddiy foydalanuvchilardan ajratildi**:
    - `index.html` dan ro'yxatdan o'tish modalidagi ortiqcha `#auth-admin-pin-group` olib tashlandi; oddiy tashrif buyuruvchilar endi faqat oddiy o'quvchi sifatida ro'yxatdan o'tadi.
    - `#zen-editor` va `#add-post-btn` elementlari `<template>` ichiga joylandi. `auth.js` faqat autentifikatsiyadan o'tgan haqiqiy admin foydalanuvchi uchungina ularni DOM ga dinamik ulaydi; oddiy foydalanuvchilar va mehmonlar uchun ushbu elementlar DOM daraxtida umuman mavjud bo'lmaydi.
  - **2. Boshlang'ich yuklanish va bo'sh holatlar (Empty States & Shimmer) bartaraf etildi**:
    - Bosh sahifadagi `#functional-clock` soatidagi dastlabki `00:00:00` va `--.--.----` miltillashi inline skript orqali bartaraf etildi.
    - `deutsch.html` da `scripts/verb-trainer-data.js` skripti ulanmaganligi sababli fe'llar trenajyori doim "Fe'llar topilmadi" deb chiqishi tuzatildi (skript ulandi va `FALLBACK_A1_VERBS` zaxirasi qo'shildi).
    - Loyihalar va maqolalar uchun yengil va qorong'u rejimga moslashuvchan CSS skeleton shimmer animatsiyalari (`css/components.css`) joriy etildi.
  - **3. Karusel matnlaridagi imlo xatolari tuzatildi (`deutsch.html`)**:
    - Germaniya diqqatga sazovor joylari karuselidagi barcha 5 ta slayd sarlavhalari to'g'ri o'zbek tili lotin orfografiyasiga keltirildi: `"Ertak qalʼa"`, `"800 yillik moʻjiza"`, `"Vaqt toʻxtagan joy"`, `"Germaniyaning choʻqqisi"`, `"Sirli yoʻllar"`.
  - **4. Darslik mavzularida vizual progress va bosqichlar tekshiruvi (A1-B2)**:
    - `scripts/curriculum-engine.js` da 4 qismli progress moduli (`{ theory, flashcards, quiz, game }`) joriy etildi.
    - Har bir kartochka tepasida dinamik SVG/CSS progress paneli va foiz (`0%` - `100%`) ko'rsatkichi, to'liq yakunlanganda yashil `✓ 100% O'zlashtirildi` belgisi o'rnatildi.
    - 4 ta amal tugmasida (`📖 Dars`, `🎴 Lug'at`, `📝 Test`, `🎮 O'yin`) har bir bosqich bajarilganda yashil tasdiq belgisi (`✓`) paydo bo'ladi.
    - Natijalar `localStorage` va tizimga kirgan foydalanuvchilar uchun `Auth.submitResult` orqali profil bilan sinxronlashadi.
  - **5. SEO, URL Tarixi va Dinamik Meta-Teglar**:
    - Maqola modali ochilganda URL History API orqali avtomatik `?post={id}` ga o'zgaradi va brauzer Back/Forward (`popstate`) orqali sahifani qayta yuklamasdan boshqariladi.
    - Dinamik ravishda Open Graph (`og:title`, `og:description`, `og:image`, `og:url`), Twitter kartalari va Canonical havolalari yangilanadi; modal yopilganda asl holatiga qaytariladi.
    - `deutsch.js` va `curriculum-engine.js` da darajalar va mavzular bo'yicha mustaqil hash-marshrutlash (`#a1-a1_1`) joriy etildi; sahifa yangilanganda ham ochilgan dars saqlanib qoladi.
    - `sitemap.xml` kengaytirildi va `robots.txt` ga `/kay` hamda `/admin` uchun taqiqlovchi (`Disallow`) qoidalar qo'shildi.
  - **6. Unumdorlik va Lazy-Loading**:
    - Barcha audio va video elementlariga `preload="none"` joriy etildi; tarmoq trafigi va sahifa ochilish tezligi optimallashtirildi.
  - **Muvaffaqiyatli Sinov va Build**:
    - `node scripts/health-check.js`: 0 xato, 0 ogohlantirish.
    - `node build.mjs`: `dist/` statik to'plami muvaffaqiyatli yangilandi.

- **Takomillashtirishning 2-Bosqichi To'liq Amalga Oshirildi (Arxitektura, Kesh va Sinxronizatsiya)**:
  - **`gemini.md` Maxfiyligi va Xavfsizligi**:
    - `gemini.md` dagi barcha ochiq parollar qat'iy tozalandi; `build.mjs` da `copyDir` filtri orqali `gemini.md`, `readme.md` va barcha `*.md` fayllar `dist/` statik to'plamidan butunlay chetlatildi.
    - WAF qatlami (`middlewares/aiBotDetector.js` va `functions/_middleware.js`) orqali `gemini.md` ga to'g'ridan-to'g'ri tashqi murojaatlar 403 bilan to'liq to'sildi.
  - **Service Worker (`sw.js`) Kesh va `?v=hash` Optimallashtirildi**:
    - `sw.js` dagi barcha `caches.match` chaqiruvlariga `{ ignoreSearch: true }` parametri qo'shildi — natijada `?v=${BUILD_HASH}` bilan yuklangan app-shell resurslari keshdan chaqmoqdek tez yuklanadi.
    - API va funksiya yo'llari (`/api`, `/posts`, `/projects`, `/quotes`, `/tasks`, `/results`, `/auth`, `/functions`, `/admin`, `/kay`) Service Worker keshidan qat'iy chiqarildi.
  - **Subdomenlararo Autentifikatsiya va Natijalar Sinxronizatsiyasi (`abdugofforov.uz` <-> `deutsch.abdugofforov.uz`)**:
    - `auth.js` ga `Domain=.abdugofforov.uz; Path=/; SameSite=Lax; Secure` cookie mexanizmi o'rnatildi; foydalanuvchi asosiy domenda kirsa, nemis tili subdomenida ham uning sessiyasi avtomatik tiklanadi.
    - `deutsch.html` bosh navigatsiyasiga `#login-btn` va `#user-menu` (user-chip, avatar, username, profil tahrirlash, natijalar va chiqish) qo'shildi.
    - `deutsch.html` ga `#auth-modal` kiritildi va `scripts/tests.js` hamda `auth.js` dagi modal ochish/yopish/topshirish mantiqi uzluksiz bog'landi.
  - **Dual-Backend Pariteti Ta'minlandi (Node.js Express <-> Cloudflare Pages)**:
    - `functions/posts.js`, `functions/quotes.js`, `functions/results.js`, `functions/tasks.js` va `functions/projects.js` endpointlari Express (`routes/index.js` va `routes/admin.js`) javob formatlari (`ok: true`, `posts`, `quotes`, `results`, `tasks`, `projects`) bilan 100% muvofiqlashtirildi.
    - Express `routes/index.js` ga `/tasks` GET marshruti qo'shildi.
    - Section 3 ga "Dual-Backend Qoidasi" rasman kiritildi.

- **3 ta Yangi Flagman Modul Ishga Tushirildi (Modulli Texnik Topshiriq)**:
  - **1. `⌘K` Super-Terminal (`scripts/super-palette.js`)**:
    - Raycast va Spotlight uslubidagi qidiruv va buyruqlar markazi yaratildi (global `⌘K` yoki `Ctrl+K` tugmalari hamda navigatsiyadagi qidiruv orqali ishlaydi).
    - **Prefikslar**:
      - `de <so'z>`: Nemis tili fe'llari (`GERMAN_VERBS_DB`) va o'quv dasturi lug'atidan darhol qidiradi, ma'nosi, tuslanishlari va `🔊 de-DE` talaffuzini chiqaradi.
      - `calc <ifoda>`: `eval` siz, xavfsiz matematik ifodalarni hisoblab beradi va `Enter` bosilganda nusxalaydi.
      - `base64 <matn>`: Matnni Base64 formatiga o'giradi.
      - `hash <matn>`: Web Crypto API yordamida matnning SHA-256 xeshini chiqaradi.
      - `theme <nom>`: Sayt mavzularini (Dark, Light, Quantum Aurora, Swiss Atelier) tezkor almashtiradi.
      - `audio <rejim>`: Fokus (174Hz) va Koinot fon tovushlarini Web Audio API orqali boshqaradi.
    - To'liq klaviatura boshqaruvi: `↑`, `↓` navigatsiya, `Enter` ijro/nusxalash, `Esc` yopish.
  - **2. "Sertifikat va Iqtibos Kartasi" — Story Generator (`scripts/story-card.js`)**:
    - Tashqi kutubxonalarsiz toza HTML5 Canvas API da `1080x1920` (9:16 Story) va `1080x1080` (1:1 Post) formatda Dark Cyber Glassmorphism kartalar chizuvchi modul yaratildi.
    - **Iqtibos va Maqola ulashish**: Kun Hikmati kartasida `"📸 Story Karta"` tugmasi ulandi; shuningdek matn belgilanganda avtomatik suzuvchi `"✨ Kartochka yaratish"` tugmasi chiqadi.
    - **Nemis tili Sertifikati**: Testlar yakunlanganda (`curriculum-engine.js` va `tests.js`) `"🏆 Sertifikat olish"` tugmasi orqali o'quvchi ismi, daraja, ball, sana va brending aks etgan sertifikat generatsiya qilinadi.
    - Rasm oldindan ko'rinishi (preview modal), PNG yuklab olish va mobil qurilmalarda Web Share API orqali ulashish imkoniyati yaratildi.
  - **3. Interaktiv Subtitrli Video-Darslik (`scripts/video-lesson.js`)**:
    - Nemis tili A1, A2, B1, B2 darajalari uchun 4 ta bosqichli real dialog ssenariysi (Kafeda buyurtma berish, Poyezd chiptasi, Ish suhbati, Ekologiya munozarasi).
    - Nutq sintezi (`de-DE`) bilan sinxron audio-dialog pleyeri (Play/Pause, oldingi/keyingi, 0.8x-1.2x tezlik).
    - **Click-to-Translate**: Har bir nemischa so'z bosilganda pleyer pauza bo'ladi, so'z ustida Glassmorphism popover ochilib, o'zbekcha tarjima, grammatik turkum, talaffuz tugmasi va `"🎴 Flashcard lug'atimga qo'shish"` tugmasi chiqadi (Leitner SRS bilan to'liq bog'langan).
  - **Integratsiya va Kesh**:
    - Barcha 3 modul `index.html` va `deutsch.html` ga ulandi, `sw.js` SHELL keshiga kiritildi, `build.mjs` orqali minifikatsiya qilindi.
    - `node scripts/health-check.js` 0 xato va 0 ogohlantirish bilan yakunlandi.

### [2026-10-15]
- **Stealth Admin Gate va Admin PIN Autentifikatsiyasi To'liq Birxillashtirildi**:
  - **Uch Qavatli (3-tier) PIN Fallback Zanjiri**:
    - `middlewares/auth.js` va `functions/_lib.js` da PIN tekshiruvi birxillashtirildi:
      1. `data/db.json` (`settings.adminPinHash` yoki `settings.adminPin`) tekshiruvi (ustuvor).
      2. `.env` / Cloudflare Environment Variables dagi `ADMIN_PIN_HASH` (SHA-256) va `ADMIN_PIN`.
      3. Standart va zaxira SHA-256 xeshlar (`PRIMARY_PIN_SHA256` va `LEGACY_PIN_SHA256`).
    - Barcha tekshiruvlar `timingSafeCompare` / `timingSafeEqual` orqali xavfsiz vaqt tengligida amalga oshiriladi.
    - `routes/auth.js` va `routes/index.js` (`/check-pin`) dagi takroriy va nomutanosib PIN kodlari olib tashlanib, `middlewares/auth.js` ga ulandi.
    - `routes/admin.js` dagi `/change-pin` marshrutida yangi PIN yangilanganda bir vaqtning o'zida `adminPinHash` ham avtomatik hisoblanib saqlanadigan qilindi.
  - **Stealth Admin Gate Oqimi (`app.js`, `auth.js`)**:
    - `app.js` da `checkIsAdmin()` funksiyasidagi sessiya tekshiruvi tuzatildi (`Auth.isAdmin()` bilan `sessionStorage.kay_admin` zanjiri to'g'rilandi).
    - Secret Knock orqali ochiladigan `#secret-gate-modal` submit qilinganda:
      - So'rov `x-admin-pin` sarlavhasi va `{ token, pin, adminPin }` korpusi bilan `/auth/magic-gate` ga yuboriladi; 404 yoki 503 holatlarida `/check-pin` ga avtomatik fallback qilinadi.
      - Muvaffaqiyatli kirilganda `sessionStorage`, `localStorage` (`kay_admin`, `kay_admin_token`, `abdu_user_token`, `abdu_user_data`), hamda `.abdugofforov.uz` domeniga mos sessiya kukilari (`abdu_session_token`, `kay_admin_token`) bir vaqtning o'zida faollashadi.
      - Bosh sahifadagi `#zen-editor` va `#add-post-btn` elementlari dinamik ravishda DOMga ulanadi va foydalanuvchi `/kay.html` ga uzluksiz o'tkaziladi.
  - **KAY Admin Paneli Pariteti (`kay.js`)**:
    - Telegram bot sozlanmagan holatlarda `/check-pin` orqali kirilganda ham barcha tokenlar va kukilar to'liq saqlanib, keyingi barcha ma'lumotlar yuklanishi ta'minlandi.
  - **Sinov va QA Auditi**:
    - `node scripts/health-check.js`: 0 xato, 0 ogohlantirish.
    - `node build.mjs`: `dist/` to'liq minifikatsiya qilindi.
- **Admin PIN Yangilash (Cloudflare Pariteti), CI Tuzatish va Xavfsizlik Tozalashlari**:
  - **Cloudflare `change-pin` Endpointi**:
    - `functions/admin/change-pin.js` va `functions/api/admin/change-pin.js` yaratildi. U `isAdmin(env, request)` va `verifyAdminPin(env, oldPin)` orqali tekshiradi va yangi PIN ning SHA-256 xeshini `env.POSTS_KV` dagi `'site_settings'` ga saqlaydi (`settings.adminPinHash`), ochiq PIN ni butunlay o'chirib tashlaydi.
    - `routes/admin.js` dagi `/change-pin` marshrutida ochiq `adminPin` saqlanishi to'xtatildi, faqat `adminPinHash` yangilanadigan qilindi.
    - `kay.js` dagi `handleChangePin` yangilandi: avval `/api/admin/change-pin` ga, agar 404 bo'lsa `/admin/change-pin` ga murojaat qiladi; xato holatida soxta muvaffaqiyat xabari o'rniga haqiqiy server xato xabarini ko'rsatadi.
  - **GitHub Actions CI/CD va Health-Check Audit**:
    - `.github/workflows/ci.yml` ga `node scripts/health-check.js` dan oldin `run: npm run build` qadami qo'shildi.
    - `.github/workflows/node.js.yml` da Node versiyasi `[22.x]` qilib birxillashtirildi; ishlatilmayotgan `.github/workflows/npm-publish-github-packages.yml` o'chirildi.
    - `scripts/health-check.js` ning 1-bo'limida ES modullar va `functions/` papkasidagi fayllar uchun `--input-type=module` orqali stdin tekshiruvi joriy etildi.
  - **Git va Maxfiylik**:
    - `.gitignore` dagi xavfli `data/` qatori o'rniga `data/db.json` va `data/*.tmp` belgilandi; natijada o'quv dasturlari (`curriculum-*.js`) va aforizmlar git kuzatuvida saqlanadi.
    - `SECURITY.md` va `.env.example` dagi ochiq PIN va xeshlar `[REDACTED]` va `<YOUR_PIN>` formatiga keltirildi.

