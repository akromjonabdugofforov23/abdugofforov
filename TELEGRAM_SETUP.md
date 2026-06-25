# Telegram 2FA — Admin panelga kirishni xavfsizlash

Admin panelga (`/kay`) endi 2 bosqichli tasdiqlash bilan kiriladi:

1. **PIN** kiritish (oldindek)
2. **Telegram'ga keladigan 6 xonali kod** ni kiritish

Bu yo'riqnoma Telegram bot va env o'zgaruvchilarini sozlash uchun.

## 1. Telegram bot yaratish

1. Telegram'da **@BotFather** ni toping va `/start` yuboring
2. `/newbot` deb yozing
3. Bot uchun nom kiriting (masalan: `Abdugofforov Admin`)
4. Bot uchun **username** ko'yib bering (oxiri `bot` bilan tugashi shart, masalan `abdugofforov_admin_bot`)
5. BotFather sizga **token** beradi, masalan:
   ```
   1234567890:AAFkkrjas8923kjfASDJK_xxxxxxxxxxx
   ```
   Bu tokenni saqlab qo'ying — keyin kerak bo'ladi.

## 2. O'zingizning Telegram chat ID ni topish

Bot sizga xabar yuborishi uchun **sizning chat ID raqamingiz** kerak (telefon raqami emas — Telegram'ning ichki ID raqami).

### Eng oson usul (1 daqiqada):

1. Telegram'da **@userinfobot** ni qidirib toping
2. `/start` yuboring
3. Bot sizga shu kabi xabar qaytaradi:
   ```
   Id: 123456789
   First: Akromjon
   Username: @herrr_kai23
   ```
4. **Id** raqamini (masalan `123456789`) saqlab qo'ying

### Muqobil usul:

1. Yangi yaratilgan botga (1-bosqichdagi) **/start** yuboring
2. Brauzerda oching:
   ```
   https://api.telegram.org/bot<SIZNING_TOKEN>/getUpdates
   ```
   `<SIZNING_TOKEN>` ni 1-bosqichdagi token bilan almashtiring
3. JSON ichida `"chat":{"id": 123456789, ...}` qatorini toping
4. Shu raqamni oling

## 3. Botga "Start" yuborish (MAJBURIY!)

Telegram qoidasiga ko'ra, bot **faqat siz oldin `/start` yuborgan** odamga xabar yubora oladi.

1. 1-bosqichda yaratilgan **o'zingizning botingiz** (`@abdugofforov_admin_bot` yoki shunga o'xshash) ni Telegram'da oching
2. **/start** tugmasini bosing yoki yozib yuboring

Agar buni bajarmasangiz, bot kodni yubora olmaydi va sayt "Telegram xato: Forbidden" deb javob beradi.

## 4. Cloudflare Pages env o'zgaruvchilarini qo'shish

1. <https://dash.cloudflare.com/> ga kiring
2. **Workers & Pages → abdugofforov** loyihasini oching
3. **Settings** tab → pastga aylantirib **Environment variables** (yoki **Variables and Secrets**) bo'limini toping
4. **Production** muhitiga 2 ta o'zgaruvchi qo'shing:

   | Variable name | Type | Value |
   |---------------|------|-------|
   | `TELEGRAM_BOT_TOKEN` | **Encrypted** (Secret) | 1-bosqichdagi token (`1234567890:AAFkkr...`) |
   | `TELEGRAM_CHAT_ID` | **Encrypted** (Secret) | 2-bosqichdagi chat ID (`123456789`) |

   > ⚠️ **Encrypted** ni tanlang — token maxfiy bo'lishi kerak.

5. **Save** bosing
6. **Preview** muhitiga ham xuddi shu qiymatlarni qo'shing (ixtiyoriy — branch preview testlari uchun)

## 5. KV namespace ham ulanganini tasdiqlang

Telegram auth ham KV (POSTS_KV) ga muhtoj (sessiya va tokenlarni saqlash uchun).

Agar oldin sozlamagan bo'lsangiz: [POSTS_SETUP.md](./POSTS_SETUP.md)

## 6. Qayta deploy qiling

Env o'zgaruvchilari qo'shilgandan keyin:

- **Workers & Pages → abdugofforov → Deployments** tab
- Eng yangi deploy yonidagi **`...`** menyu → **Retry deployment**
- 1-2 daqiqa kuting

## 7. Sinab ko'ring

1. <https://abdugofforov.pages.dev/kay> ga kiring
2. PIN ni kiriting → **Kirish** bosing
3. Tugma **"Telegramga yuborilmoqda..."** ga aylanadi
4. Telegram'ga **🔐 Admin panel kirish kodi** xabari kelishi kerak:
   ```
   🔐 Admin panel kirish kodi
   123456
   IP: ...
   Muddat: 5 daqiqa
   ```
5. Saytda yangi ekran ochiladi — kodni kiriting → **Tasdiqlash**
6. Admin panel ochiladi va Telegram'ga "✅ Admin panelga muvaffaqiyatli kirildi" xabari keladi

## Xavfsizlik

| Hodisa | Holat |
|--------|-------|
| 5 marta noto'g'ri kod | Sessiya o'chiriladi, PIN ni qayta kiritish kerak |
| 5 daqiqa o'tdi | Kod eskirdi — "Qayta yuborish" tugmasi |
| Token muddati | 8 soat. Keyin PIN + TG kod qayta kerak. |
| Token saqlash joyi | sessionStorage (tab yopilsa o'chadi) |
| PIN noto'g'ri | 3 marotaba xato → 60 soniyalik blok (eski mexanizm saqlangan) |

## Telegram sozlanmagan paytda nima bo'ladi?

Agar `TELEGRAM_BOT_TOKEN` yoki `TELEGRAM_CHAT_ID` env o'zgaruvchilari **yo'q** bo'lsa:
- Admin panelga **faqat PIN** bilan kirish ishlaydi (eski rejim)
- Postlar serverga PIN bilan sinxronlanadi
- Eslatma: bu kamroq xavfsiz — Telegram sozlangach, faqat 2FA bilan ishlaydigan bo'ladi

## Texnik tafsilotlar

- `POST /admin/request-code` body `{pin}` → sessionId + Telegram'ga 6 xonali kod
- `POST /admin/verify-code` body `{sessionId, code}` → admin token (8 soat)
- `PUT /posts` header `x-admin-token: <token>` (Telegram sozlangan bo'lsa)
- KV kalitlar: `auth:session:<id>` (5 daqiqa), `auth:token:<id>` (8 soat)
- Telegram'ga muvaffaqiyatli kirish haqida ham xabar yuboriladi
