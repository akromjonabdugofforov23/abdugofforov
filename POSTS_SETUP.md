# Postlarni umumiy ko'rsatish — Cloudflare KV sozlash

Sayt **Cloudflare Pages** da joylashgan. Yangi yozilgan postlar
hammaga (mehmonlarga) ko'rinishi uchun **Cloudflare KV** (key-value)
omborini ulash kerak. Bir martalik sozlash — keyin avtomatik ishlaydi.

## Nima sodir bo'ladi

- Admin (siz) sayda PIN bilan kirib post yozsangiz, post serverga
  yuboriladi (`PUT /posts`).
- Boshqa mehmonlar saytni ochganda, postlar serverdan o'qiladi
  (`GET /posts`) — shu sababli ular ham sizning postlaringizni ko'radi.
- Agar KV bog'lanmagan bo'lsa, post faqat sizning brauzeringizda
  saqlanadi (eski hatti-harakat) va siz **toast** orqali ogohlantirilasiz.

## 1. KV namespace yaratish

1. <https://dash.cloudflare.com/> ga kiring
2. Chap menyudan **Workers & Pages → KV** ni tanlang
3. **Create a namespace** tugmasini bosing
4. Nom: `ABDU_POSTS` (yoki xohlagan nomingiz)
5. **Add** tugmasini bosing

## 2. Pages loyihasiga ulash

1. **Workers & Pages → Overview** dan sayt loyihangizni oching
   (`abdugofforov`)
2. **Settings** tab → **Functions** bo'limini oching
3. Pastga aylantirib **KV namespace bindings** ni toping
4. **Add binding** tugmasini bosing:
   - **Variable name:** `POSTS_KV` (**aniq shu nom — boshqa qilmang**)
   - **KV namespace:** `ABDU_POSTS` (1-bosqichda yaratganingizni tanlang)
5. **Save** tugmasini bosing

## 3. Qayta deploy qilish

Sozlash o'zgarganidan keyin, sayt qayta deploy bo'lishi kerak.
Pages > Deployments dan **Retry deployment** yoki yangi git push
qiling — Cloudflare avtomatik deploy qiladi.

## 4. Sinab ko'rish

1. Saytni oching va PIN bilan adminga kiring
2. Yangi post yozib saqlang
3. **Inkognito (Private) oynada** saytni qayta oching
4. Postingizni ko'rsangiz — sinxronlash ishlayapti ✅

## Xatolar va ularni hal qilish

| Toast xabari | Sabab | Yechim |
|--------------|-------|--------|
| `⚠️ Server ombori sozlanmagan (POSTS_KV)` | Binding qo'shilmagan | 2-bosqichni bajaring |
| `❌ PIN noto'g'ri` | Admin sessiyasi tugagan | Saytga qayta PIN bilan kiring |
| `⚠️ Ma'lumot juda katta` | Rasmlar 24MB dan oshdi | Eski yoki katta rasmli postlarni o'chiring |
| `✅ Post serverga sinxronlandi` | Hammasi joyida | — |

## Texnik tafsilotlar

- **Endpoint:** `/posts` (Pages Function: `functions/posts.js`)
- **GET:** ochiq, postlar JSON ro'yxati qaytaradi
- **PUT:** `x-admin-pin` header bilan, PIN SHA-256 hash bilan tekshiriladi
  (kod: `functions/posts.js` ichida `CORRECT_PIN_HASH`)
- **KV kalit:** `posts:list` (barcha postlar shu kalitda JSON sifatida)
- **Hajm chegarasi:** 24MB (KV qiymat chegarasidan ehtiyot)

## PIN ni o'zgartirish (ixtiyoriy)

Agar PIN ni almashtirmoqchi bo'lsangiz:

1. Yangi PIN (masalan `1234`) SHA-256 hashini hisoblang. Brauzerda:
   ```js
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('1234'))
     .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
   ```
2. Quyidagi 3 ta fayldagi `CORRECT_PIN_HASH` / `ADMIN_HASH` ni almashtiring:
   - `functions/check-pin.js`
   - `functions/posts.js`
   - `app.js` (`handlePinSubmit` ichida `ADMIN_HASH`)
3. Commit + push qiling.
