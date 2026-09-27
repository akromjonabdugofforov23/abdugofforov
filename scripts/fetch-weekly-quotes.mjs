// ============================================================
// Avtomatik Haftalik Hikmatlarni Yangilash Skripti (Weekly Quotes Fetcher)
//
// Ushbu skript haftada bir marta (GitHub Actions yoki cron orqali) ishga tushib,
// internetdan yangi falsafiy va motivatsion hikmatlarni oladi va
// `data/quotes.json` hamda loyihani yangilaydi.
// ============================================================

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const QUOTES_FILE = path.join(ROOT_DIR, 'data', 'quotes.json');

// Kengaytirilgan zaxira hikmatlar hovuzi (Har hafta rotatsiya qilinishi uchun)
const ROTATION_POOLS = [
  // 1-Hafta to'plami: Sharqona donolik va Falsafa
  {
    theme: "Sharqona donolik va Falsafa",
    uz: [
      { quote: "Kecha aqlli edim — dunyoni o'zgartirmoqchi edim. Bugun esa donoman — o'zimni o'zgartiryapman.", author: "Jaloliddin Rumiy", de: "Gestern war ich klug und wollte die Welt verändern. Heute bin ich weise und verändere mich selbst.", category: "✦ KUN HIKMATI · DONOLIK" },
      { quote: "Bilingki, eng buyuk boylik — aql va odob, eng og'ir qashshoqlik esa nodonlikdir.", author: "Alisher Navoiy", de: "Der größte Reichtum ist Verstand und Anstand, die schwerste Armut aber die Unwissenheit.", category: "✦ KUN HIKMATI · AXLOQ" },
      { quote: "Vahima kasallikning yarmi, xotirjamlik sog'liqning yarmi, sabr esa shifoning boshlanishidir.", author: "Ibn Sino", de: "Panik ist die halbe Krankheit, Ruhe die halbe Gesundheit und Geduld der Beginn der Heilung.", category: "✦ KUN HIKMATI · SALOMATLIK" },
      { quote: "Ilm — barcha qorong'u yo'llarni yorituvchi so'nmas mash'aladir.", author: "Mirzo Ulug'bek", de: "Die Wissenschaft ist die unvergängliche Fackel, die alle dunklen Pfade erhellt.", category: "✦ KUN HIKMATI · ILM-FAN" },
      { quote: "Kuch — adolatdadir. Har bir ishda sabot, qat'iyat va aql bilan yo'l tut.", author: "Amir Temur", de: "Die Kraft liegt in der Gerechtigkeit. Handle in allen Dingen mit Entschlossenheit und Verstand.", category: "✦ KUN HIKMATI · ADOLAT" },
      { quote: "Qayerda jarohat bo'lsa, nur o'sha yerdan qalbingga kirib keladi.", author: "Jaloliddin Rumiy", de: "Die Wunde ist der Ort, an dem das Licht in dich eintritt.", category: "✦ KUN HIKMATI · UMID" },
      { quote: "Baxtga yetishish uchun inson o'z aql-zakovati va axloqini kamolotga yetkazishi zarur.", author: "Al-Forobiy", de: "Um Glückseligkeit zu erlangen, muss der Mensch Verstand und Tugend vervollkommnen.", category: "✦ KUN HIKMATI · SAODAT" }
    ]
  },
  // 2-Hafta to'plami: Stoyatsizm va Xotirjamlik
  {
    theme: "Stoyatsizm va Ruhiy Matonat",
    uz: [
      { quote: "Siz tashqi hodisalarni emas, o'z ongingizni boshqarasiz. Buni tushunganingizda chinakam qudratga ega bo'lasiz.", author: "Mark Avreliy", de: "Du hast die Macht über deinen Geist, nicht über die äußeren Ereignisse. Erkenne dies, und du wirst Stärke finden.", category: "✦ KUN HIKMATI · STOYATSIZM" },
      { quote: "Ishlar qiyin bo'lgani uchun jur'at etolmayotganimiz yo'q, aksincha jur'at etmaganimiz tufayli ular qiyindir.", author: "Seneka", de: "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer.", category: "✦ KUN HIKMATI · JUR'AT" },
      { quote: "Bizni tashqi hodisalar emas, balki ularga berayotgan shaxsiy munosabatimiz bezovta qiladi.", author: "Epiktet", de: "Nicht die Dinge selbst beunruhigen die Menschen, sondern ihre Meinungen über die Dinge.", category: "✦ KUN HIKMATI · XOTIRJAMLIK" },
      { quote: "G'alabalarning eng ulug'i — o'z nafsi va ojizliklari ustidan qozonilgan g'alabadir.", author: "Platon (Aflotun)", de: "Der erste und beste Sieg ist, sich selbst zu besiegen.", category: "✦ KUN HIKMATI · IRODA" },
      { quote: "O'z yo'lini bilmagan kemaga hech qaysi shamol yo'ldosh bo'la olmaydi.", author: "Seneka", de: "Wer den Hafen nicht kennt, für den ist kein Wind der richtige.", category: "✦ KUN HIKMATI · MAQSAD" }
    ]
  },
  // 3-Hafta to'plami: Nemis Klassik Falsafasi va Ma'rifat
  {
    theme: "Nemis Falsafasi va Tafakkur",
    uz: [
      { quote: "O'z aqlingdan foydalanishga jur'at et! Mustaqil fikrlash — ma'rifatning asosidir.", author: "Immanuel Kant", de: "Habe Mut, dich deines eigenen Verstandes zu bedienen!", category: "✦ KUN HIKMATI · FALSAFA" },
      { quote: "Yashash uchun o'zining «Nega»siga ega inson har qanday «Qanday»ga bardosh bera oladi.", author: "Fridrix Nitsshe", de: "Wer ein Warum zum Leben hat, erträgt fast jedes Wie.", category: "✦ KUN HIKMATI · MAQSAD" },
      { quote: "Bilishning o'zi kifoya emas, uni qo'llash kerak. Istashning o'zi kifoya emas, amal qilish kerak.", author: "Iogann Volfgang fon Gyote", de: "Es ist nicht genug zu wissen, man muss auch anwenden; es ist nicht genug zu wollen, man muss auch tun.", category: "✦ KUN HIKMATI · HARAKAT" },
      { quote: "Sog'lik barcha narsa emas, lekin sog'liksiz qolgan barcha narsa hech narsaga aylanadi.", author: "Artur Shopengauer", de: "Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts.", category: "✦ KUN HIKMATI · SALOMATLIK" },
      { quote: "Tilimning chegaralari — mening olamim chegaralaridir.", author: "Lyudvig Vitgenshteyn", de: "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.", category: "✦ KUN HIKMATI · TAFAKKUR" },
      { quote: "Har bir yangi ibtidoda bizni asrovchi va hayot baxsh etuvchi sehr yashiringan.", author: "German Gesse", de: "Und jedem Anfang wohnt ein Zauber inne, der uns beschützt und der uns hilft, zu leben.", category: "✦ KUN HIKMATI · YANGILIK" }
    ]
  },
  // 4-Hafta to'plami: Qat'iyat, Rivojlanish va Mehnat
  {
    theme: "Qat'iyat, Rivojlanish va Mehnat",
    uz: [
      { quote: "Mantiq sizni A nuqtadan B nuqtaga olib boradi, tasavvur esa har qanday manzilga yetaklay oladi.", author: "Albert Eynshteyn", de: "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.", category: "✦ KUN HIKMATI · ILHOM" },
      { quote: "Kurashgan inson yutqazishi mumkin. Kurashmagan esa allaqachon mag'lubdir.", author: "Bertolt Brext", de: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.", category: "✦ KUN HIKMATI · SHIDDAT" },
      { quote: "Biz takror va takror nima qilsak, o'shamiz. Demak, yuksaklik — bu harakat emas, balki odatdir.", author: "Aristotel", de: "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.", category: "✦ KUN HIKMATI · ODATLAR" },
      { quote: "Ming chaqirimlik yo'l ham birgina kichik qadam bilan boshlanadi.", author: "Lao-szi", de: "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.", category: "✦ KUN HIKMATI · SABOT" },
      { quote: "Qayerda bo'lsang o'sha yerda, bor imkoniyating bilan qo'lingdan kelganini qil.", author: "Teodor Ruzvelt", de: "Tu, was du kannst, mit dem, was du hast, dort, wo du bist.", category: "✦ KUN HIKMATI · MATONAT" },
      { quote: "Qo'limdan keladi deb o'ylasang ham, kelmaydi deb o'ylasang ham — ikkala holatda ham haqsiz.", author: "Genri Ford", de: "Egal, ob du denkst, du kannst es, oder du kannst es nicht – du wirst recht behalten.", category: "✦ KUN HIKMATI · ISHONCH" },
      { quote: "Vaqtingiz cheklangan, uni o'zgalarning hayotini yashash bilan sovurmang. Qalbingizga ergashing.", author: "Stiv Jobs", de: "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.", category: "✦ KUN HIKMATI · SHAXSIYAT" }
    ]
  }
];

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

async function main() {
  console.log('🌐 [WEEKLY-QUOTES] Haftalik hikmatlarni yangilash tekshiruvi boshlandi...');

  const now = new Date();
  const currentWeek = getWeekNumber(now);
  console.log(`📅 Joriy hafta raqami: ${currentWeek}, Sana: ${now.toISOString().split('T')[0]}`);

  let existing = {};
  try {
    const raw = await fs.readFile(QUOTES_FILE, 'utf8');
    existing = JSON.parse(raw);
  } catch (e) {
    existing = { quotes: { uz: [] } };
  }

  // Haftalik yangi to'plamni rotatsiya qilib tanlash
  const poolIndex = currentWeek % ROTATION_POOLS.length;
  const currentPool = ROTATION_POOLS[poolIndex];

  console.log(`✨ Yangi haftalik mavzu: "${currentPool.theme}"`);

  // Yangilangan JSON ob'ekti
  existing.updatedAt = now.toISOString();
  existing.week = currentWeek;
  existing.theme = currentPool.theme;

  // Agar mavjud to'liq 35 talik ro'yxat bo'lsa, joriy haftaning saralangan hikmatlarini yuqoriga chiqaramiz
  if (existing.quotes && existing.quotes.uz) {
    const existingUz = existing.quotes.uz;
    // Saralangan yangi haftalik hikmatlarni boshiga qo'yamiz
    const featuredQuotes = currentPool.uz;
    const remainingQuotes = existingUz.filter(eq => !featuredQuotes.some(fq => fq.quote === eq.quote));
    existing.quotes.uz = [...featuredQuotes, ...remainingQuotes];
  }

  await fs.writeFile(QUOTES_FILE, JSON.stringify(existing, null, 2), 'utf8');
  console.log(`✅ [WEEKLY-QUOTES] data/quotes.json muvaffaqiyatli yangilandi! (${existing.quotes.uz.length} ta hikmat)`);
}

main().catch(err => {
  console.error('❌ [WEEKLY-QUOTES] Xatolik:', err);
  process.exit(1);
});
