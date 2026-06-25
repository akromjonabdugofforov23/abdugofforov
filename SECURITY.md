# Xavfsizlik sozlamalari (Security)

Bu loyiha Cloudflare Pages Functions (`functions/`) orqali ishlaydi. Quyidagi
muhit o'zgaruvchilarini (Environment Variables) Cloudflare Pages →
**Settings → Environment variables** bo'limida sozlang.

## 1. ADMIN_PIN_HASH (MUHIM — zudlik bilan o'rnating)

Admin PIN endi kodda hardcode qilinmaydi. U `ADMIN_PIN_HASH` ENV
o'zgaruvchisidan o'qiladi (PIN'ning SHA-256 hashi, hex ko'rinishida).

> ⚠️ Eski 4 xonali PIN (`0509`) git tarixida **oshkor bo'lgan**. Uni
> ishlatishni darhol to'xtating va yangi, kuchli PIN (kamida 8+ belgi)
> tanlang.

Yangi PIN hashini yaratish (terminalda):

```bash
# "<yangi-pin>" ni o'z PIN'ingizga almashtiring
printf '%s' '<yangi-pin>' | shasum -a 256 | awk '{print $1}'
```

Chiqqan 64 belgili hex qiymatni `ADMIN_PIN_HASH` ga yozing.

Agar `ADMIN_PIN_HASH` o'rnatilmasa, kod faqat zaxira (fallback) qiymatga
qaytadi — bu oshkor bo'lgan eski PIN, shuning uchun ishlab chiqarishda buni
albatta o'rnating.

## 2. ALLOWED_ORIGINS (ixtiyoriy)

CORS endi har qanday origin'ni aks ettirmaydi. Standart holatda faqat
**same-origin** so'rovlarga ruxsat beriladi. Boshqa domenlardan murojaat
kerak bo'lsa, vergul bilan ajratib qo'shing:

```
ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

## 3. Telegram 2FA (tavsiya etiladi)

`TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` o'rnatilganda admin kirishi
ikki bosqichli (PIN + Telegram kod) bo'ladi va `x-admin-pin` faqat-PIN
fallback'i **o'chiriladi**. Ishlab chiqarishda ikkalasini ham sozlang.

## Ushbu yangilanishda qo'shilgan himoyalar

- Admin PIN hashi ENV'ga ko'chirildi; oshkor PIN izohi olib tashlandi.
- Barcha sezgir endpointlarga IP bo'yicha rate-limiting qo'shildi
  (`login`, `register`, `check-pin`, `admin/request-code`,
  `admin/verify-code`, `posts` PUT, `notify`).
- CORS wildcard (`*`) o'rniga same-origin / allowlist joriy etildi.
- Telegram kod solishtiruvi doimiy vaqtli (timing-safe) qilindi.
- Takrorlangan xavfsizlik kodi `functions/_lib.js` da markazlashtirildi.

> Eslatma: KV asosidagi rate-limit eventual-consistent. Qattiqroq himoya
> kerak bo'lsa, Cloudflare WAF / Rate Limiting Rules'ni ham yoqing.
