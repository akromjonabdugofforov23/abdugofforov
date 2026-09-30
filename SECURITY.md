# Xavfsizlik protokollari va sozlamalari (Security Architecture)

Ushbu loyiha Cloudflare Pages Functions (`functions/`), Express Server (`server.js`) va statik frontend arxitekturasida ishlaydi. Quyidagi xavfsizlik protokollari va muhit o'zgaruvchilari (Environment Variables) tizimning mustahkamligini ta'minlaydi.

---

## 1. Asosiy Xavfsizlik Sozlamalari (Environment Variables)

Cloudflare Pages → **Settings → Environment variables** (yoki Node.js `.env` faylida) quyidagilarni sozlang:

### `ADMIN_PIN_HASH` (O'ta muhim — zudlik bilan o'rnating)
Admin PIN kodi kodda saqlanmaydi. U `ADMIN_PIN_HASH` ENV o'zgaruvchisidan o'qiladi (PIN'ning SHA-256 hashi).

> ⚠️ **Muhim qoida**: Agar `ADMIN_PIN_HASH` o'rnatilgan bo'lsa, tizim eski zaxira PIN (`0509`) ni **mutlaqo qabul qilmaydi**. Bu orqali eski oshkor bo'lgan kod orqali kirish ehtimoli 100% yopilgan.

Yangi kuchli PIN (kamida 8+ belgi) xeshini yaratish (terminalda):
```bash
printf '%s' '<yangi-kuchli-pin>' | shasum -a 256 | awk '{print $1}'
```
Chiqqan 64 belgili hex qiymatni `ADMIN_PIN_HASH` ga yozing.

### `ALLOWED_ORIGINS` (CORS himoyasi)
Wildcard (`*`) CORS sarlavhalari to'liq bloklangan. Standart holatda faqat `same-origin` va `abdugofforov.uz` domenlariga ruxsat beriladi. Qo'shimcha domenlar uchun:
```env
ALLOWED_ORIGINS=https://abdugofforov.uz,https://deutsch.abdugofforov.uz
```

### `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` (2FA va Xavfsizlik signallari)
- Telegram 2FA yoqilganda barcha admin amallari 2 bosqichli autentifikatsiya (PIN + Telegram bir martalik kod) orqali bajariladi.
- Telegram OAuth/WebApp kirishlarida HMAC-SHA256 imzosi tekshiriladi va 24 soatlik replay attack filtratsiyasi qo'llaniladi.
- Hujumlar va shubhali faolliklar bo'yicha admin chatga tezkor xabarlar yuboriladi.

---

## 2. Takomillashtirilgan Xavfsizlik Protokollari

### A. Autentifikatsiya va Ruxsatlar (Auth & Access Control)
1. **Account Takeover himoyasi**:
   - `/auth/register` endi hech qachon mavjud foydalanuvchini ustidan yozmaydi (overwrite taqiqlangan). Band username bilan so'rov kelsa darhol `409 Conflict` qaytadi.
   - Parol sifatida admin PIN kiritilgani uchungina foydalanuvchiga avtomatik admin huquqi berilmaydi.
2. **Kuchli Parol Siyosati (Password Policy)**:
   - Ro'yxatdan o'tish va parolni tiklashda minimal parol uzunligi **kamida 8 ta belgi** qilib belgilandi.
   - Parollar **PBKDF2-SHA256 (100,000 iteratsiya)** va kriptografik tuz (salt) bilan saqlanadi.
3. **Doimiy Vaqtli Taqqoslash (Timing-Attack Protection)**:
   - PIN, Telegram tasdiqlash kodlari va parol xeshlarini solishtirishda doimiy vaqtli (`timingSafeEqual`) algoritmidan foydalaniladi.
4. **Sessiya Boshqaruvi**:
   - Har bir sessiya tokeni mijoz IP manzili bilan bog'lanadi va 30 kunlik muddat (TTL) bilan cheklanadi.

### B. Tarmoq va Shifrlash (Transport & HTTP Security — 15/15 Himoya Sarlavhalari)
1. **Content Security Policy (CSP)**:
   - Barcha sahifalar va Cloudflare Functions javoblarida qat'iy CSP faol. Tashqi xavfli skriptlar, ruxsat etilmagan iframelar (`frame-ancestors: 'none'`) va ma'lumotlar o'g'irlanishi (XSS) oldi olingan. Shuningdek, xatoliklarni kuzatish uchun `report-uri /csp-report; report-to csp-endpoint` sozlangan.
2. **HSTS va Preload**:
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` barcha HTTPS trafigini majburiy qilib, SSL Striping hujumlarini bartaraf etadi.
3. **Cross-Origin Izolyatsiyasi**:
   - `Cross-Origin-Opener-Policy: same-origin-allow-popups` (Telegram WebApp / OAuth popuplarini xavfsiz ochish).
   - `Cross-Origin-Embedder-Policy: credentialless` (Resurslarni xavfsiz cross-origin izolyatsiyada yuklash).
   - `Cross-Origin-Resource-Policy: same-site` (Sayt resurslarining begona domenlar tomonidan o'zlashtirilishini to'sish).
4. **Brauzer va Ma'lumotlar Himoyasi**:
   - `X-Frame-Options: DENY` (Clickjacking ga qarshi qat'iy himoya).
   - `X-Content-Type-Options: nosniff` (MIME-sniffing hujumlarini bloklash).
   - `Referrer-Policy: strict-origin-when-cross-origin` (Foydalanuvchi maxfiyligini saqlash).
   - `Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), display-capture=()` (Zararli API'lar, jumladan ekranni yozib olish `display-capture` to'liq cheklangan).
   - `X-Permitted-Cross-Domain-Policies: none` (Flash va PDF cross-domain fayllarini bloklash).
   - `X-DNS-Prefetch-Control: off` (Foydalanuvchi ma'lumotlari sizib chiqmasligi uchun brauzerning avtomatik DNS qidiruvini to'xtatish).
   - `Origin-Agent-Cluster: ?1` (Brauzer darajasida saytni alohida jarayon/klasterga ajratish).
   - `X-XSS-Protection: 0` (Zamonaviy standart: eskirgan va zaif auditor o'chirilgan, himoya to'liq CSP zimmasida).
   - `Clear-Site-Data: "cache", "cookies", "storage"` (Chiqish (`/auth/logout`) amali bajarilganda foydalanuvchining barcha sessiya va kesh ma'lumotlarini brauzerdan tozalash).
5. **IP Spoofing himoyasi**:
   - `getClientIp` funksiyasi `CF-Connecting-IP` va `X-Forwarded-For` sarlavhalaridan faqat birinchi haqiqiy IP manzilini ajratib oladi va regex orqali IPv4/IPv6 validatsiya qiladi.


### C. WAF va Bot Himoyasi (AI / Threat Detector)
1. **Zararli Skanerlar Filtratsiyasi**:
   - `sqlmap`, `nikto`, `wpscan`, `masscan`, `acunetix`, `gobuster` va boshqa zararli skanerlar `aiBotDetector` orqali darhol 403 bilan to'xtatiladi.
2. **Path Traversal va Maxfiy Fayllar Qidiruvini Bloklash**:
   - `/.env`, `/.git`, `/wp-admin`, `phpmyadmin`, `eval-stdin.php` kabi server zaifliklarini tekshiruvchi avtomatlashgan so'rovlar filtrlanadi.
3. **Inyeksiya va XSS Filtratsiyasi**:
   - URL va so'rov parametrlaridagi SQL inyeksiyalari (`UNION SELECT`, `' OR 1=1`) va XSS skriptlar bloklanadi.

### D. Rate Limiting va DDoS Himoyasi
1. **Bosqichma-bosqich Rate Limiting**:
   - `login` va `register` endpointlariga maxsus qat'iy cheklovlar (masalan, 15 daqiqada 10-15 urinish).
   - Turnir natijalari va postlar yozishga mos ravishda IP bo'yicha limitlar.
2. **Cloudflare Avtomatik Qorovuli (`cloudflare_qorovul.ps1`)**:
   - **TLS 1.2 va TLS 1.3** zamonaviy shifrlash protokollari.
   - Sayt to'xtab qolganda avtomatik ravishda Cloudflare **"Under Attack"** rejimini yoqish.
   - **Auto-Recovery protokoli**: Sayt normallashib, ketma-ket 10 marta muvaffaqiyatli javob berganda, tizim himoyani avtomatik ravishda "Medium" darajasiga tushiradi.
   - Telegram xabarlarini spam bo'lishidan himoyalash (alert throttling).
