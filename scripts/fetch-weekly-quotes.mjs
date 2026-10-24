// ============================================================
// Avtomatik Haftalik Hikmatlarni Yangilash Skripti (Weekly Quotes Fetcher)
//
// Ushbu skript haftada bir marta (GitHub Actions yoki cron orqali) ishga tushib,
// falsafiy va motivatsion hikmatlar rotatsiyasini amalga oshiradi va
// `data/quotes.json` hamda loyihani yangilaydi.
// ============================================================

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const QUOTES_FILE = path.join(ROOT_DIR, 'data', 'quotes.json');

// Kengaytirilgan zaxira hikmatlar hovuzi (Har hafta rotatsiya qilinishi uchun 6 ta buyuk mavzu)
const ROTATION_POOLS = [
  // 1-Hafta: Sharqona donolik va Ma'naviyat
  {
    theme: "Sharqona donolik va Ma'naviyat",
    uz: [
      { quote: "Kecha aqlli edim — dunyoni o'zgartirmoqchi edim. Bugun esa donoman — o'zimni o'zgartiryapman.", author: "Jaloliddin Rumiy", de: "Gestern war ich klug und wollte die Welt verändern. Heute bin ich weise und verändere mich selbst.", category: "✦ KUN HIKMATI · DONOLIK" },
      { quote: "Bilingki, eng buyuk boylik — aql va odob, eng og'ir qashshoqlik esa nodonlikdir.", author: "Alisher Navoiy", de: "Der größte Reichtum ist Verstand und Anstand, die schwerste Armut aber die Unwissenheit.", category: "✦ KUN HIKMATI · AXLOQ" },
      { quote: "Inson agar go'zal axloqqa ega bo'lsa — bu 1 ga teng. Agar husn sohibi bo'lsa, 0 ni qo'shing — 10 bo'ladi. Agar boylikka ega bo'lsa, yana 0 ni qo'shing — 100 bo'ladi. Ammo axloq ketsa, faqat nollar qoladi.", author: "Muhammad al-Xorazmiy", de: "Wenn der Mensch Moral besitzt, ist er eine 1. Hat er Schönheit, füge eine 0 hinzu: 10. Hat er Reichtum, füge eine 0 hinzu: 100. Verliert er aber die Moral, bleiben nur Nullen.", category: "✦ KUN HIKMATI · AXLOQ" },
      { quote: "Ilmning maqsadi — haqiqatni kashf etishdir. Haqiqatni bilish esa insonni xurofot va nodonlik zanjirlaridan ozod qiladi.", author: "Abu Rayhon Beruniy", de: "Das Ziel der Wissenschaft ist die Entdeckung der Wahrheit. Das Erkennen der Wahrheit befreit den Menschen von den Fesseln der Unwissenheit.", category: "✦ KUN HIKMATI · ILM-FAN" },
      { quote: "Vahima kasallikning yarmi, xotirjamlik sog'liqning yarmi, sabr esa shifoning boshlanishidir.", author: "Ibn Sino", de: "Panik ist die halbe Krankheit, Ruhe die halbe Gesundheit und Geduld der Beginn der Heilung.", category: "✦ KUN HIKMATI · SALOMATLIK" },
      { quote: "Ilm — barcha qorong'u yo'llarni yorituvchi so'nmas mash'aladir.", author: "Mirzo Ulug'bek", de: "Die Wissenschaft ist die unvergängliche Fackel, die alle dunklen Pfade erhellt.", category: "✦ KUN HIKMATI · ILM-FAN" },
      { quote: "Kuch — adolatdadir. Har bir ishda sabot, qat'iyat va aql bilan yo'l tut.", author: "Amir Temur", de: "Die Kraft liegt in der Gerechtigkeit. Handle in allen Dingen mit Entschlossenheit und Verstand.", category: "✦ KUN HIKMATI · ADOLAT" },
      { quote: "Har kimki vafo qilsa, vafo topqusidur, Har kimki jafo qilsa, jafo topqusidur. Yaxshi kishi ko'rmag'ay yomonlik hargiz...", author: "Zahiriddin Muhammad Bobur", de: "Wer Treue sät, wird Treue ernten; wer Unrecht tut, wird Unrecht erfahren. Ein edler Mensch wird niemals dem Bösen verfallen.", category: "✦ KUN HIKMATI · ADABIYOT" },
      { quote: "Baxtga yetishish uchun inson o'z aql-zakovati va axloqini kamolotga yetkazishi zarur.", author: "Al-Forobiy", de: "Um Glückseligkeit zu erlangen, muss der Mensch Verstand und Tugend vervollkommnen.", category: "✦ KUN HIKMATI · SAODAT" }
    ]
  },
  // 2-Hafta: Stoyatsizm va Ruhiy Matonat
  {
    theme: "Stoyatsizm va Ruhiy Matonat",
    uz: [
      { quote: "Siz tashqi hodisalarni emas, o'z ongingizni boshqarasiz. Buni tushunganingizda chinakam qudratga ega bo'lasiz.", author: "Mark Avreliy", de: "Du hast die Macht über deinen Geist, nicht über die äußeren Ereignisse. Erkenne dies, und du wirst Stärke finden.", category: "✦ KUN HIKMATI · STOYATSIZM" },
      { quote: "Ishlar qiyin bo'lgani uchun jur'at etolmayotganimiz yo'q, aksincha jur'at etmaganimiz tufayli ular qiyindir.", author: "Seneka", de: "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer.", category: "✦ KUN HIKMATI · JUR'AT" },
      { quote: "Tongda uyg'onganingizda tirik ekaningiz, nafas olayotganingiz, fikrlayotganingiz qanday buyuk ne'mat ekanini eslang.", author: "Mark Avreliy", de: "Wenn du am Morgen erwachst, denke daran, was für ein köstlicher Schatz es ist, zu leben, zu atmen und sich zu freuen.", category: "✦ KUN HIKMATI · SHUKRONALIK" },
      { quote: "Bizni tashqi hodisalar emas, balki ularga berayotgan shaxsiy munosabatimiz bezovta qiladi.", author: "Epiktet", de: "Nicht die Dinge selbst beunruhigen die Menschen, sondern ihre Meinungen über die Dinge.", category: "✦ KUN HIKMATI · XOTIRJAMLIK" },
      { quote: "G'alabalarning eng ulug'i — o'z nafsi va ojizliklari ustidan qozonilgan g'alabadir.", author: "Platon (Aflotun)", de: "Der erste und beste Sieg ist, sich selbst zu besiegen.", category: "✦ KUN HIKMATI · IRODA" },
      { quote: "O'z yo'lini bilmagan kemaga hech qaysi shamol yo'ldosh bo'la olmaydi.", author: "Seneka", de: "Wer den Hafen nicht kennt, für den ist kein Wind der richtige.", category: "✦ KUN HIKMATI · MAQSAD" },
      { quote: "Men faqat bir narsani bilaman — u ham bo'lsa, hech narsani bilmasligimdir.", author: "Sokrat", de: "Ich weiß, dass ich nichts weiß.", category: "✦ KUN HIKMATI · KAMTARLIK" }
    ]
  },
  // 3-Hafta: Nemis Klassik Falsafasi va Ma'rifat
  {
    theme: "Nemis Falsafasi va Ma'rifat",
    uz: [
      { quote: "O'z aqlingdan foydalanishga jur'at et! Mustaqil fikrlash — ma'rifatning asosidir.", author: "Immanuel Kant", de: "Habe Mut, dich deines eigenen Verstandes zu bedienen!", category: "✦ KUN HIKMATI · FALSAFA" },
      { quote: "Yashash uchun o'zining «Nega»siga ega inson har qanday «Qanday»ga bardosh bera oladi.", author: "Fridrix Nitsshe", de: "Wer ein Warum zum Leben hat, erträgt fast jedes Wie.", category: "✦ KUN HIKMATI · MAQSAD" },
      { quote: "Bilishning o'zi kifoya emas, uni qo'llash kerak. Istashning o'zi kifoya emas, amal qilish kerak.", author: "Iogann Volfgang fon Gyote", de: "Es ist nicht genug zu wissen, man muss auch anwenden; es ist nicht genug zu wollen, man muss auch tun.", category: "✦ KUN HIKMATI · HARAKAT" },
      { quote: "Kitob — ichimizdagi muzlagan dengizni yorib yuboruvchi bolta bo'lishi kerak.", author: "Frans Kafka", de: "Ein Buch muss die Axt sein für das gefrorene Meer in uns.", category: "✦ KUN HIKMATI · TAFAKKUR" },
      { quote: "Faqat o'z oldiga buyuk maqsadlarni qo'ygan insonlargina buyuk narsalarga erisha oladi.", author: "Fridrix Shiller", de: "Nur wer große Ziele hat, kann Großes vollbringen.", category: "✦ KUN HIKMATI · MAQSAD" },
      { quote: "Sog'lik barcha narsa emas, lekin sog'liksiz qolgan barcha narsa hech narsaga aylanadi.", author: "Artur Shopengauer", de: "Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts.", category: "✦ KUN HIKMATI · SALOMATLIK" },
      { quote: "Tilimning chegaralari — mening olamim chegaralaridir.", author: "Lyudvig Vitgenshteyn", de: "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.", category: "✦ KUN HIKMATI · TAFAKKUR" },
      { quote: "Har bir yangi ibtidoda bizni asrovchi va hayot baxsh etuvchi sehr yashiringan.", author: "German Gesse", de: "Und jedem Anfang wohnt ein Zauber inne, der uns beschützt und der uns hilft, zu leben.", category: "✦ KUN HIKMATI · YANGILIK" }
    ]
  },
  // 4-Hafta: Ilm-Fan, Texnologiya va Tafakkur
  {
    theme: "Ilm-Fan, Texnologiya va Tafakkur",
    uz: [
      { quote: "Mantiq sizni A nuqtadan B nuqtaga olib boradi, tasavvur esa har qanday manzilga yetaklay oladi.", author: "Albert Eynshteyn", de: "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.", category: "✦ KUN HIKMATI · ILHOM" },
      { quote: "Ba'zan hech kim tasavvur ham qilolmagan insonlar hech kim o'ylab topolmagan narsalarni yaratadilar.", author: "Alan Tyuring", de: "Manchmal sind es die Menschen, von denen man es sich am wenigsten vorstellt, die Dinge tun, die sich niemand vorstellen kann.", category: "✦ KUN HIKMATI · TEXNOLOGIYA" },
      { quote: "Biror narsani bolaga oddiy tushuntirib bera olmasangiz, demak uni o'zingiz ham yetarlicha tushunmabsiz.", author: "Richard Feynman", de: "Wenn du es einem Kind nicht einfach erklären kannst, hast du es selbst nicht gut genug verstanden.", category: "✦ KUN HIKMATI · ILM-FAN" },
      { quote: "Agar koinot sirlarini anglamoqchi bo'lsangiz, energiya, chastota va tebranishlar orqali fikrlang.", author: "Nikola Tesla", de: "Wenn du die Geheimnisse des Universums finden willst, denke in Begriffen wie Energie, Frequenz und Schwingung.", category: "✦ KUN HIKMATI · ILM-FAN" },
      { quote: "Gapirish oson. Menga kodni ko'rsat.", author: "Linus Torvalds", de: "Reden ist billig. Zeig mir den Code.", category: "✦ KUN HIKMATI · AMALIYOT" },
      { quote: "Haqiqatni bilishni istagan kishi hayotida kamida bir marta barcha narsadan shubhalanib ko'rishi shart.", author: "Rene Dekart", de: "Wer nach der Wahrheit sucht, muss zumindest einmal im Leben an allem zweifeln, soweit es möglich ist.", category: "✦ KUN HIKMATI · TAFAKKUR" },
      { quote: "Bilim — bu qudratdir.", author: "Frensis Bekon", de: "Wissen ist Macht.", category: "✦ KUN HIKMATI · QUDRAT" }
    ]
  },
  // 5-Hafta: Qat'iyat, Rivojlanish va Mehnat
  {
    theme: "Qat'iyat, Rivojlanish va Mehnat",
    uz: [
      { quote: "Kurashgan inson yutqazishi mumkin. Kurashmagan esa allaqachon mag'lubdir.", author: "Bertolt Brext", de: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.", category: "✦ KUN HIKMATI · SHIDDAT" },
      { quote: "Biz takror va takror nima qilsak, o'shamiz. Demak, yuksaklik — bu harakat emas, balki odatdir.", author: "Aristotel", de: "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.", category: "✦ KUN HIKMATI · ODATLAR" },
      { quote: "Ming chaqirimlik yo'l ham birgina kichik qadam bilan boshlanadi.", author: "Lao-szi", de: "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.", category: "✦ KUN HIKMATI · SABOT" },
      { quote: "Qayerda bo'lsang o'sha yerda, bor imkoniyating bilan qo'lingdan kelganini qil.", author: "Teodor Ruzvelt", de: "Tu, was du kannst, mit dem, was du hast, dort, wo du bist.", category: "✦ KUN HIKMATI · MATONAT" },
      { quote: "Qo'limdan keladi deb o'ylasang ham, kelmaydi deb o'ylasang ham — ikkala holatda ham haqsiz.", author: "Genri Ford", de: "Egal, ob du denkst, du kannst es, oder du kannst es nicht – du wirst recht behalten.", category: "✦ KUN HIKMATI · ISHONCH" },
      { quote: "Vaqtingiz cheklangan, uni o'zgalarning hayotini yashash bilan sovurmang. Qalbingizga ergashing.", author: "Stiv Jobs", de: "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.", category: "✦ KUN HIKMATI · SHAXSIYAT" },
      { quote: "Siz qashshoq tug'ilganingiz bu sizning xatoingiz emas. Ammo qashshoq vafot etsangiz — bu faqat sizning xatoingizdir.", author: "Bill Geyts", de: "Wenn du arm geboren wirst, ist es nicht dein Fehler. Aber wenn du arm stirbst, ist es dein Fehler.", category: "✦ KUN HIKMATI · MEHNAT" }
    ]
  },
  // 6-Hafta: Donolik, San'at va Insoniylik
  {
    theme: "Donolik, San'at va Insoniylik",
    uz: [
      { quote: "Eng sevimli ishingiz bilan shug'ullaning, shunda hayotingizda biror kun ham ishlashga to'g'ri kelmaydi.", author: "Konfutsiy", de: "Wähle einen Beruf, den du liebst, und du brauchst keinen Tag in deinem Leben mehr zu arbeiten.", category: "✦ KUN HIKMATI · KASB" },
      { quote: "Inson hayotidagi ikki eng muhim kun: biri — u dunyoga kelgan kun, ikkinchisi — nega kelganini tushungan kun.", author: "Mark Tven", de: "Die zwei wichtigsten Tage in deinem Leben sind der Tag, an dem du geboren wirst, und der Tag, an dem du herausfindest, warum.", category: "✦ KUN HIKMATI · MAQSAD" },
      { quote: "Hamma insoniyatni o'zgartirishni istaydi, ammo hech kim o'zini o'zgartirish haqida o'ylamaydi.", author: "Lev Tolstoy", de: "Alle wollen die Welt verändern, aber niemand denkt daran, sich selbst zu verändern.", category: "✦ KUN HIKMATI · ISLOHOT" },
      { quote: "Ilm — bu dunyoni o'zgartirish uchun ishlatish mumkin bo'lgan eng qudratli quroldir.", author: "Nelson Mandela", de: "Bildung ist die mächtigste Waffe, die du verwenden kannst, um die Welt zu verändern.", category: "✦ KUN HIKMATI · ILM" },
      { quote: "Kecha — bugungi kunning xotirasi, ertaga esa — bugungi kunning orzusidir.", author: "Xalil Jibron", de: "Gestern ist nur der Traum von heute und morgen nur die Vision von heute.", category: "✦ KUN HIKMATI · VAQT" },
      { quote: "Insonning har bir jihati go'zal bo'lmog'i lozim: yuzi ham, kiyimi ham, qalbi ham, fikrlari ham.", author: "Anton Chexov", de: "Im Menschen muss alles herrlich sein: das Gesicht, die Kleidung, die Seele und die Gedanken.", category: "✦ KUN HIKMATI · KAMOLOT" }
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
  existing.version = `2026-w${currentWeek}-v1`;
  existing.theme = currentPool.theme;

  // Agar mavjud to'liq ro'yxat bo'lsa, joriy haftaning saralangan hikmatlarini yuqoriga chiqaramiz
  if (existing.quotes && existing.quotes.uz) {
    const existingUz = existing.quotes.uz;
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
