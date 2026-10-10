// ===== SMART MULTI-LANGUAGE DAILY FORTUNE & MOTIVATIONAL QUOTE WIDGET =====
// Kay Kundaligi (Atelier) — Har tashrifda yangilanuvchi boy kun hikmatlari
(function() {
    window.App = window.App || {};

    const QUOTES_SYS_VERSION = '2026-w39-v3';

    // 0. Cache tozalash & Versiya migratsiyasi:
    // Yangi versiya chiqqanida eski kesh darhol tozalanadi va yangi hikmatlar chiqadi
    try {
        const savedVer = localStorage.getItem('kay_quotes_sys_version');
        if (savedVer !== QUOTES_SYS_VERSION) {
            localStorage.removeItem('remote_quotes_pool');
            localStorage.removeItem('quotes_last_weekly_sync');
            localStorage.removeItem('quotes_data_updated_at');
            localStorage.removeItem('seen_quotes_history');
            localStorage.setItem('kay_quotes_sys_version', QUOTES_SYS_VERSION);
        }
    } catch(e) {}

    const LOCAL_QUOTES_DB = {
        "uz": [
                {
                        "quote": "Mantiq sizni A nuqtadan B nuqtaga olib boradi, tasavvur esa har qanday manzilga yetaklay oladi.",
                        "author": "Albert Eynshteyn",
                        "de": "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.",
                        "category": "✦ KUN HIKMATI · ILHOM"
                },
                {
                        "quote": "Kurashgan inson yutqazishi mumkin. Kurashmagan esa allaqachon mag'lubdir.",
                        "author": "Bertolt Brext",
                        "de": "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
                        "category": "✦ KUN HIKMATI · SHIDDAT"
                },
                {
                        "quote": "Biz takror va takror nima qilsak, o'shamiz. Demak, yuksaklik — bu harakat emas, balki odatdir.",
                        "author": "Aristotel",
                        "de": "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.",
                        "category": "✦ KUN HIKMATI · ODATLAR"
                },
                {
                        "quote": "Ming chaqirimlik yo'l ham birgina kichik qadam bilan boshlanadi.",
                        "author": "Lao-szi",
                        "de": "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.",
                        "category": "✦ KUN HIKMATI · SABOT"
                },
                {
                        "quote": "Qayerda bo'lsang o'sha yerda, bor imkoniyating bilan qo'lingdan kelganini qil.",
                        "author": "Teodor Ruzvelt",
                        "de": "Tu, was du kannst, mit dem, was du hast, dort, wo du bist.",
                        "category": "✦ KUN HIKMATI · MATONAT"
                },
                {
                        "quote": "Qo'limdan keladi deb o'ylasang ham, kelmaydi deb o'ylasang ham — ikkala holatda ham haqsiz.",
                        "author": "Genri Ford",
                        "de": "Egal, ob du denkst, du kannst es, oder du kannst es nicht – du wirst recht behalten.",
                        "category": "✦ KUN HIKMATI · ISHONCH"
                },
                {
                        "quote": "Vaqtingiz cheklangan, uni o'zgalarning hayotini yashash bilan sovurmang. Qalbingizga ergashing.",
                        "author": "Stiv Jobs",
                        "de": "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.",
                        "category": "✦ KUN HIKMATI · SHAXSIYAT"
                },
                {
                        "quote": "Kecha aqlli edim — dunyoni o'zgartirmoqchi edim. Bugun esa donoman — o'zimni o'zgartiryapman.",
                        "author": "Jaloliddin Rumiy",
                        "de": "Gestern war ich klug und wollte die Welt verändern. Heute bin ich weise und verändere mich selbst.",
                        "category": "✦ KUN HIKMATI · DONOLIK"
                },
                {
                        "quote": "Bilingki, eng buyuk boylik — aql va odob, eng og'ir qashshoqlik esa nodonlikdir.",
                        "author": "Alisher Navoiy",
                        "de": "Der größte Reichtum ist Verstand und Anstand, die schwerste Armut aber die Unwissenheit.",
                        "category": "✦ KUN HIKMATI · AXLOQ"
                },
                {
                        "quote": "Vahima kasallikning yarmi, xotirjamlik sog'liqning yarmi, sabr esa shifoning boshlanishidir.",
                        "author": "Ibn Sino (Avitsenna)",
                        "de": "Panik ist die halbe Krankheit, Ruhe die halbe Gesundheit und Geduld der Beginn der Heilung.",
                        "category": "✦ KUN HIKMATI · SALOMATLIK"
                },
                {
                        "quote": "Siz tashqi hodisalarni emas, o'z ongingizni boshqarasiz. Buni tushunganingizda chinakam qudratga ega bo'lasiz.",
                        "author": "Mark Avreliy",
                        "de": "Du hast die Macht über deinen Geist, nicht über die äußeren Ereignisse. Erkenne dies, und du wirst Stärke finden.",
                        "category": "✦ KUN HIKMATI · STOYATSIZM"
                },
                {
                        "quote": "Ishlar qiyin bo'lgani uchun jur'at etolmayotganimiz yo'q, aksincha jur'at etmaganimiz tufayli ular qiyindir.",
                        "author": "Seneka",
                        "de": "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer.",
                        "category": "✦ KUN HIKMATI · JUR'AT"
                },
                {
                        "quote": "Yashash uchun o'zining «Nega»siga ega inson har qanday «Qanday»ga bardosh bera oladi.",
                        "author": "Fridrix Nitsshe",
                        "de": "Wer ein Warum zum Leben hat, erträgt fast jedes Wie.",
                        "category": "✦ KUN HIKMATI · MAQSAD"
                },
                {
                        "quote": "O'z aqlingdan foydalanishga jur'at et! Mustaqil fikrlash — ma'rifatning asosidir.",
                        "author": "Immanuel Kant",
                        "de": "Habe Mut, dich deines eigenen Verstandes zu bedienen!",
                        "category": "✦ KUN HIKMATI · FALSAFA"
                },
                {
                        "quote": "Sog'lik barcha narsa emas, lekin sog'liksiz qolgan barcha narsa hech narsaga aylanadi.",
                        "author": "Artur Shopengauer",
                        "de": "Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts.",
                        "category": "✦ KUN HIKMATI · SALOMATLIK"
                },
                {
                        "quote": "Vaziyatni o'zgartirish qo'limizdan kelmasa, o'zimizni o'zgartirish vaqti yetgan bo'ladi.",
                        "author": "Viktor Frankl",
                        "de": "Wenn wir eine Situation nicht mehr ändern können, müssen wir uns selbst ändern.",
                        "category": "✦ KUN HIKMATI · RUHIYAT"
                },
                {
                        "quote": "Bilishning o'zi kifoya emas, uni qo'llash kerak. Istashning o'zi kifoya emas, amal qilish kerak.",
                        "author": "Iogann Volfgang fon Gyote",
                        "de": "Es ist nicht genug zu wissen, man muss auch anwenden; es ist nicht genug zu wollen, man muss auch tun.",
                        "category": "✦ KUN HIKMATI · HARAKAT"
                },
                {
                        "quote": "Zulmatdan nolib o'tirgandan ko'ra, kichik bir sham yoqib qo'yganing ming bor afzal.",
                        "author": "Konfutsiy",
                        "de": "Es ist besser, ein einziges kleines Licht anzuzünden, als die Dunkelheit zu verfluchen.",
                        "category": "✦ KUN HIKMATI · AMAL"
                },
                {
                        "quote": "Ilm — barcha qorong'u yo'llarni yorituvchi so'nmas mash'aladir.",
                        "author": "Mirzo Ulug'bek",
                        "de": "Die Wissenschaft ist die unvergängliche Fackel, die alle dunklen Pfade erhellt.",
                        "category": "✦ KUN HIKMATI · ILM-FAN"
                },
                {
                        "quote": "Kuch — adolatdadir. Har bir ishda sabot, qat'iyat va aql bilan yo'l tut.",
                        "author": "Amir Temur",
                        "de": "Die Kraft liegt in der Gerechtigkeit. Handle in allen Dingen mit Entschlossenheit und Verstand.",
                        "category": "✦ KUN HIKMATI · ADOLAT"
                },
                {
                        "quote": "Tilimning chegaralari — mening olamim chegaralaridir.",
                        "author": "Lyudvig Vitgenshteyn",
                        "de": "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.",
                        "category": "✦ KUN HIKMATI · TAFAKKUR"
                },
                {
                        "quote": "Tarbiya — bu alangani yoqishdir, bo'sh idishni to'ldirish emas.",
                        "author": "Sokrat",
                        "de": "Erziehung ist das Entzünden einer Flamme, nicht das Füllen eines Gefäßes.",
                        "category": "✦ KUN HIKMATI · TA'LIM"
                },
                {
                        "quote": "Men fikrlayapman, demak men mavjudman.",
                        "author": "Rene Dekart",
                        "de": "Ich denke, also bin ich.",
                        "category": "✦ KUN HIKMATI · ONGLILIK"
                },
                {
                        "quote": "G'alabalarning eng ulug'i — o'z nafsi va ojizliklari ustidan qozonilgan g'alabadir.",
                        "author": "Platon (Aflotun)",
                        "de": "Der erste und beste Sieg ist, sich selbst zu besiegen.",
                        "category": "✦ KUN HIKMATI · IRODA"
                },
                {
                        "quote": "Har bir yangi ibtidoda bizni asrovchi va hayot baxsh etuvchi sehr yashiringan.",
                        "author": "German Gesse",
                        "de": "Und jedem Anfang wohnt ein Zauber inne, der uns beschützt und der uns hilft, zu leben.",
                        "category": "✦ KUN HIKMATI · YANGILIK"
                },
                {
                        "quote": "Kecha — bugungi kunning xotirasi, ertaga esa — bugungi kunning orzusidir.",
                        "author": "Xalil Jibron",
                        "de": "Das Gestern ist die Erinnerung von heute, das Morgen ist der Traum von heute.",
                        "category": "✦ KUN HIKMATI · HAYOT"
                },
                {
                        "quote": "Hamma insoniyatni o'zgartirishni istaydi, ammo hech kim o'zini o'zgartirish haqida o'ylamaydi.",
                        "author": "Lev Tolstoy",
                        "de": "Alle wollen die Menschheit verändern, doch niemand denkt daran, sich selbst zu verändern.",
                        "category": "✦ KUN HIKMATI · HAQIQAT"
                },
                {
                        "quote": "Baxtga yetishish uchun inson o'z aql-zakovati va axloqini kamolotga yetkazishi zarur.",
                        "author": "Al-Forobiy",
                        "de": "Um Glückseligkeit zu erlangen, muss der Mensch Verstand und Tugend vervollkommnen.",
                        "category": "✦ KUN HIKMATI · SAODAT"
                },
                {
                        "quote": "Ilm — bu dunyoni o'zgartirish uchun ishlatish mumkin bo'lgan eng qudratli quroldir.",
                        "author": "Nelson Mandela",
                        "de": "Bildung ist die mächtigste Waffe, die man verwenden kann, um die Welt zu verändern.",
                        "category": "✦ KUN HIKMATI · ZIYO"
                },
                {
                        "quote": "Bilim — bu qudratdir.",
                        "author": "Frensis Bekon",
                        "de": "Wissen ist Macht.",
                        "category": "✦ KUN HIKMATI · BILIM"
                },
                {
                        "quote": "Bizni tashqi hodisalar emas, balki ularga berayotgan shaxsiy munosabatimiz bezovta qiladi.",
                        "author": "Epiktet",
                        "de": "Nicht die Dinge selbst beunruhigen die Menschen, sondern ihre Meinungen über die Dinge.",
                        "category": "✦ KUN HIKMATI · XOTIRJAMLIK"
                },
                {
                        "quote": "Bugundan 20 yil o'tib, qilgan ishlaringizdan emas, jur'at etolmay qilmagan ishlaringizdan ko'proq afsuslanasiz.",
                        "author": "Mark Tven",
                        "de": "In zwanzig Jahren wirst du mehr bereuen, was du nicht getan hast, als was du getan hast.",
                        "category": "✦ KUN HIKMATI · IMKONIYAT"
                },
                {
                        "quote": "Qayerda jarohat bo'lsa, nur o'sha yerdan qalbingga kirib keladi.",
                        "author": "Jaloliddin Rumiy",
                        "de": "Die Wunde ist der Ort, an dem das Licht in dich eintritt.",
                        "category": "✦ KUN HIKMATI · UMID"
                },
                {
                        "quote": "Eshitdim — unutdim, ko'rdim — eslab qoldim, bajardim — angladim.",
                        "author": "Konfutsiy",
                        "de": "Ich hörte und vergaß; ich sah und erinnerte mich; ich tat und verstand.",
                        "category": "✦ KUN HIKMATI · TAJRIBA"
                },
                {
                        "quote": "Insonning har bir jihati go'zal bo'lmog'i lozim: yuzi ham, kiyimi ham, qalbi ham, fikri ham.",
                        "author": "Anton Chexov",
                        "de": "Am Menschen muss alles schön sein: das Gesicht, die Kleidung, die Seele und die Gedanken.",
                        "category": "✦ KUN HIKMATI · GO'ZALLIK"
                }
        ],
        "ru": [
                {
                        "quote": "Вчера я был умным и хотел изменить мир. Сегодня я мудр, поэтому меняю себя.",
                        "author": "Джалаладдин Руми",
                        "de": "Gestern war ich klug und wollte die Welt verändern. Heute bin ich weise und verändere mich selbst.",
                        "category": "✦ МУДРОСТЬ ДНЯ · СМЫСЛ"
                },
                {
                        "quote": "Наивысшее богатство — это разум и благовоспитанность, а тягчайшая бедность — невежество.",
                        "author": "Алишер Навои",
                        "de": "Der größte Reichtum ist Verstand und Anstand, die schwerste Armut aber die Unwissenheit.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ЭТИКА"
                },
                {
                        "quote": "Паника — это половина болезни, спокойствие — половина здоровья, а терпение — начало исцеления.",
                        "author": "Ибн Сина (Авиценна)",
                        "de": "Panik ist die halbe Krankheit, Ruhe die halbe Gesundheit und Geduld der Beginn der Heilung.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ЗДОРОВЬЕ"
                },
                {
                        "quote": "У вас есть власть над своим разумом, а не над внешними событиями. Осознайте это, и вы обретете силу.",
                        "author": "Марк Аврелий",
                        "de": "Du hast die Macht über deinen Geist, nicht über die äußeren Ereignisse. Erkenne dies, und du wirst Stärke finden.",
                        "category": "✦ МУДРОСТЬ ДНЯ · СТОИЦИЗМ"
                },
                {
                        "quote": "Не потому мы не смеем, что это трудно, а потому это трудно, что мы не смеем.",
                        "author": "Сенека",
                        "de": "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer.",
                        "category": "✦ МУДРОСТЬ ДНЯ · СМЕЛОСТЬ"
                },
                {
                        "quote": "Тот, у кого есть «Зачем» жить, может выдержать почти любое «Как».",
                        "author": "Фридрих Ницше",
                        "de": "Wer ein Warum zum Leben hat, erträgt fast jedes Wie.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ЦЕЛЬ"
                },
                {
                        "quote": "Имей мужество пользоваться собственным умом!",
                        "author": "Иммануил Кант",
                        "de": "Habe Mut, dich deines eigenen Verstandes zu bedienen!",
                        "category": "✦ МУДРОСТЬ ДНЯ · ФИЛОСОФИЯ"
                },
                {
                        "quote": "Здоровье до того перевешивает все остальные блага, что истинно здоровый нищий счастливее больного короля.",
                        "author": "Артур Шопенгауэр",
                        "de": "Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ЗДОРОВЬЕ"
                },
                {
                        "quote": "Когда мы больше не можем изменить ситуацию, мы призваны изменить самих себя.",
                        "author": "Виктор Франкл",
                        "de": "Wenn wir eine Situation nicht mehr ändern können, müssen wir uns selbst ändern.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ПСИХОЛОГИЯ"
                },
                {
                        "quote": "Недостаточно только знать, нужно применять; недостаточно только желать, нужно действовать.",
                        "author": "Иоганн Вольфганг фон Гёте",
                        "de": "Es ist nicht genug zu wissen, man muss auch anwenden; es ist nicht genug zu wollen, man muss auch tun.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ДЕЙСТВИЕ"
                },
                {
                        "quote": "Логика приведет вас из пункта А в пункт Б. Воображение доставит вас куда угодно.",
                        "author": "Альберт Эйнштейн",
                        "de": "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ВДОХНОВЕНИЕ"
                },
                {
                        "quote": "Лучше зажечь одну маленькую свечу, чем вечно проклинать темноту.",
                        "author": "Конфуций",
                        "de": "Es ist besser, ein einziges kleines Licht anzuzünden, als die Dunkelheit zu verfluchen.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ПОСТУПКИ"
                },
                {
                        "quote": "Наука — это неугасимый факел, освещающий все темные пути.",
                        "author": "Мирзо Улугбек",
                        "de": "Die Wissenschaft ist die unvergängliche Fackel, die alle dunklen Pfade erhellt.",
                        "category": "✦ МУДРОСТЬ ДНЯ · НАУКА"
                },
                {
                        "quote": "Сила — в справедливости. В каждом деле действуй с твердостью и разумом.",
                        "author": "Амир Темур",
                        "de": "Die Kraft liegt in der Gerechtigkeit. Handle in allen Dingen mit Entschlossenheit und Verstand.",
                        "category": "✦ МУДРОСТЬ ДНЯ · СПРАВЕДЛИВОСТЬ"
                },
                {
                        "quote": "Границы моего языка означают границы моего мира.",
                        "author": "Людвиг Витгенштейн",
                        "de": "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.",
                        "category": "✦ МУДРОСТЬ ДНЯ · МЫШЛЕНИЕ"
                },
                {
                        "quote": "Тот, кто борется, может проиграть. Тот, кто не борется, уже проиграл.",
                        "author": "Бертольт Брехт",
                        "de": "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
                        "category": "✦ МУДРОСТЬ ДНЯ · СИЛА ДУХА"
                },
                {
                        "quote": "Воспитание — это зажжение факела, а не наполнение пустого сосуда.",
                        "author": "Сократ",
                        "de": "Erziehung ist das Entzünden einer Flamme, nicht das Füllen eines Gefäßes.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ОБРАЗОВАНИЕ"
                },
                {
                        "quote": "Я мыслю, следовательно, я существую.",
                        "author": "Рене Декарт",
                        "de": "Ich denke, also bin ich.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ОСОЗНАННОСТЬ"
                },
                {
                        "quote": "Мы то, что мы делаем изо дня в день. Совершенство, таким образом, не действие, а привычка.",
                        "author": "Аристотель",
                        "de": "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ПРИВЫЧКИ"
                },
                {
                        "quote": "Первая и величайшая победа — это победа над самим собой.",
                        "author": "Платон",
                        "de": "Der erste und beste Sieg ist, sich selbst zu besiegen.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ВОЛЯ"
                },
                {
                        "quote": "В каждом начале таится волшебная сила, которая защищает нас и помогает нам жить.",
                        "author": "Герман Гессе",
                        "de": "Und jedem Anfang wohnt ein Zauber inne, der uns beschützt und der uns hilft, zu leben.",
                        "category": "✦ МУДРОСТЬ ДНЯ · НАДЕЖДА"
                },
                {
                        "quote": "Вчера — это память сегодняшнего дня, а завтра — мечта сегодняшнего дня.",
                        "author": "Халиль Джебран",
                        "de": "Das Gestern ist die Erinnerung von heute, das Morgen ist der Traum von heute.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ЖИЗНЬ"
                },
                {
                        "quote": "Все думают о том, как изменить мир, но никто не думает о том, как изменить себя.",
                        "author": "Лев Толстой",
                        "de": "Alle wollen die Menschheit verändern, doch niemand denkt daran, sich selbst zu verändern.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ИСТИНА"
                },
                {
                        "quote": "Для достижения счастья человеку необходимо совершенствовать свой разум и нравственность.",
                        "author": "Аль-Фараби",
                        "de": "Um Glückseligkeit zu erlangen, muss der Mensch Verstand und Tugend vervollkommnen.",
                        "category": "✦ МУДРОСТЬ ДНЯ · СЧАСТЬЕ"
                },
                {
                        "quote": "Путь в тысячу ли начинается с одного-единственного первого шага.",
                        "author": "Лао-цзы",
                        "de": "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.",
                        "category": "✦ МУДРОСТЬ ДНЯ · СТОЙКОСТЬ"
                },
                {
                        "quote": "Образование — самое мощное оружие, с помощью которого можно изменить мир.",
                        "author": "Нельсон Мандела",
                        "de": "Bildung ist die mächtigste Waffe, die man verwenden kann, um die Welt zu verändern.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ЗНАНИЯ"
                },
                {
                        "quote": "Знание — сила.",
                        "author": "Фрэнсис Бэкон",
                        "de": "Wissen ist Macht.",
                        "category": "✦ МУДРОСТЬ ДНЯ · СИЛА"
                },
                {
                        "quote": "Людей мучают не сами вещи, а их представления о них.",
                        "author": "Эпиктет",
                        "de": "Nicht die Dinge selbst beunruhigen die Menschen, sondern ihre Meinungen über die Dinge.",
                        "category": "✦ МУДРОСТЬ ДНЯ · СПОКОЙСТВИЕ"
                },
                {
                        "quote": "Делай, что можешь, с тем, что имеешь, прямо там, где ты находишься.",
                        "author": "Теодор Рузвельт",
                        "de": "Tu, was du kannst, mit dem, was du hast, dort, wo du bist.",
                        "category": "✦ МУДРОСТЬ ДНЯ · РЕШИМОСТЬ"
                },
                {
                        "quote": "Думаете ли вы, что сможете, или думаете, что не сможете, — в обоих случаях вы правы.",
                        "author": "Генри Форд",
                        "de": "Egal, ob du denkst, du kannst es, oder du kannst es nicht – du wirst recht behalten.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ВЕРА В СЕБЯ"
                },
                {
                        "quote": "Ваше время ограничено, не тратьте его, живя чужой жизнью. Имейте смелость следовать своему сердцу.",
                        "author": "Стив Джобс",
                        "de": "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ИНДИВИДУАЛЬНОСТЬ"
                },
                {
                        "quote": "Через двадцать лет вы будете больше сожалеть о том, чего не сделали, чем о том, что сделали.",
                        "author": "Марк Твен",
                        "de": "In zwanzig Jahren wirst du mehr bereuen, was du nicht getan hast, als was du getan hast.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ВОЗМОЖНОСТИ"
                },
                {
                        "quote": "Рана — это то самое место, через которое в тебя проникает Свет.",
                        "author": "Джалаладдин Руми",
                        "de": "Die Wunde ist der Ort, an dem das Licht in dich eintritt.",
                        "category": "✦ МУДРОСТЬ ДНЯ · НАДЕЖДА"
                },
                {
                        "quote": "Я услышал и забыл; я увидел и запомнил; я сделал и понял.",
                        "author": "Конфуций",
                        "de": "Ich hörte und vergaß; ich sah und erinnerte mich; ich tat und verstand.",
                        "category": "✦ МУДРОСТЬ ДНЯ · ПРАКТИКА"
                },
                {
                        "quote": "В человеке должно быть всё прекрасно: и лицо, и одежда, и душа, и мысли.",
                        "author": "Антон Чехов",
                        "de": "Am Menschen muss alles schön sein: das Gesicht, die Kleidung, die Seele und die Gedanken.",
                        "category": "✦ МУДРОСТЬ ДНЯ · КРАСОТА"
                }
        ],
        "de": [
                {
                        "quote": "Gestern war ich klug und wollte die Welt verändern. Heute bin ich weise und verändere mich selbst.",
                        "author": "Dschalal ad-Din Rumi",
                        "de": "Gestern war ich klug und wollte die Welt verändern. Heute bin ich weise und verändere mich selbst.",
                        "category": "✦ WEISHEIT DES TAGES · WEISHEIT"
                },
                {
                        "quote": "Der größte Reichtum ist Verstand und Anstand, die schwerste Armut aber die Unwissenheit.",
                        "author": "Alischer Nawoi",
                        "de": "Der größte Reichtum ist Verstand und Anstand, die schwerste Armut aber die Unwissenheit.",
                        "category": "✦ WEISHEIT DES TAGES · ETHIK"
                },
                {
                        "quote": "Panik ist die halbe Krankheit, Ruhe die halbe Gesundheit und Geduld der Beginn der Heilung.",
                        "author": "Avicenna (Ibn Sina)",
                        "de": "Panik ist die halbe Krankheit, Ruhe die halbe Gesundheit und Geduld der Beginn der Heilung.",
                        "category": "✦ WEISHEIT DES TAGES · GESUNDHEIT"
                },
                {
                        "quote": "Du hast die Macht über deinen Geist, nicht über die äußeren Ereignisse. Erkenne dies, und du wirst Stärke finden.",
                        "author": "Marc Aurel",
                        "de": "Du hast die Macht über deinen Geist, nicht über die äußeren Ereignisse. Erkenne dies, und du wirst Stärke finden.",
                        "category": "✦ WEISHEIT DES TAGES · STOIZISMUS"
                },
                {
                        "quote": "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer.",
                        "author": "Seneca",
                        "de": "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer.",
                        "category": "✦ WEISHEIT DES TAGES · MUT"
                },
                {
                        "quote": "Wer ein Warum zum Leben hat, erträgt fast jedes Wie.",
                        "author": "Friedrich Nietzsche",
                        "de": "Wer ein Warum zum Leben hat, erträgt fast jedes Wie.",
                        "category": "✦ WEISHEIT DES TAGES · SINN"
                },
                {
                        "quote": "Habe Mut, dich deines eigenen Verstandes zu bedienen!",
                        "author": "Immanuel Kant",
                        "de": "Habe Mut, dich deines eigenen Verstandes zu bedienen!",
                        "category": "✦ WEISHEIT DES TAGES · PHILOSOPHIE"
                },
                {
                        "quote": "Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts.",
                        "author": "Arthur Schopenhauer",
                        "de": "Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts.",
                        "category": "✦ WEISHEIT DES TAGES · GESUNDHEIT"
                },
                {
                        "quote": "Wenn wir eine Situation nicht mehr ändern können, müssen wir uns selbst ändern.",
                        "author": "Viktor Frankl",
                        "de": "Wenn wir eine Situation nicht mehr ändern können, müssen wir uns selbst ändern.",
                        "category": "✦ WEISHEIT DES TAGES · PSYCHOLOGIE"
                },
                {
                        "quote": "Es ist nicht genug zu wissen, man muss auch anwenden; es ist nicht genug zu wollen, man muss auch tun.",
                        "author": "Johann Wolfgang von Goethe",
                        "de": "Es ist nicht genug zu wissen, man muss auch anwenden; es ist nicht genug zu wollen, man muss auch tun.",
                        "category": "✦ WEISHEIT DES TAGES · TATKRAFT"
                },
                {
                        "quote": "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.",
                        "author": "Albert Einstein",
                        "de": "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.",
                        "category": "✦ WEISHEIT DES TAGES · INSPIRATION"
                },
                {
                        "quote": "Es ist besser, ein einziges kleines Licht anzuzünden, als die Dunkelheit zu verfluchen.",
                        "author": "Konfuzius",
                        "de": "Es ist besser, ein einziges kleines Licht anzuzünden, als die Dunkelheit zu verfluchen.",
                        "category": "✦ WEISHEIT DES TAGES · HANDELN"
                },
                {
                        "quote": "Die Wissenschaft ist die unvergängliche Fackel, die alle dunklen Pfade erhellt.",
                        "author": "Mirzo Ulugh Beg",
                        "de": "Die Wissenschaft ist die unvergängliche Fackel, die alle dunklen Pfade erhellt.",
                        "category": "✦ WEISHEIT DES TAGES · WISSENSCHAFT"
                },
                {
                        "quote": "Die Kraft liegt in der Gerechtigkeit. Handle in allen Dingen mit Entschlossenheit und Verstand.",
                        "author": "Amir Timur",
                        "de": "Die Kraft liegt in der Gerechtigkeit. Handle in allen Dingen mit Entschlossenheit und Verstand.",
                        "category": "✦ WEISHEIT DES TAGES · GERECHTIGKEIT"
                },
                {
                        "quote": "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.",
                        "author": "Ludwig Wittgenstein",
                        "de": "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.",
                        "category": "✦ WEISHEIT DES TAGES · SPRACHE"
                },
                {
                        "quote": "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
                        "author": "Bertolt Brecht",
                        "de": "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
                        "category": "✦ WEISHEIT DES TAGES · MUT"
                },
                {
                        "quote": "Erziehung ist das Entzünden einer Flamme, nicht das Füllen eines Gefäßes.",
                        "author": "Sokrates",
                        "de": "Erziehung ist das Entzünden einer Flamme, nicht das Füllen eines Gefäßes.",
                        "category": "✦ WEISHEIT DES TAGES · BILDUNG"
                },
                {
                        "quote": "Ich denke, also bin ich.",
                        "author": "René Descartes",
                        "de": "Ich denke, also bin ich.",
                        "category": "✦ WEISHEIT DES TAGES · BEWUSSTSEIN"
                },
                {
                        "quote": "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.",
                        "author": "Aristoteles",
                        "de": "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.",
                        "category": "✦ WEISHEIT DES TAGES · GEWOHNHEIT"
                },
                {
                        "quote": "Der erste und beste Sieg ist, sich selbst zu besiegen.",
                        "author": "Platon",
                        "de": "Der erste und beste Sieg ist, sich selbst zu besiegen.",
                        "category": "✦ WEISHEIT DES TAGES · WILLE"
                },
                {
                        "quote": "Und jedem Anfang wohnt ein Zauber inne, der uns beschützt und der uns hilft, zu leben.",
                        "author": "Hermann Hesse",
                        "de": "Und jedem Anfang wohnt ein Zauber inne, der uns beschützt und der uns hilft, zu leben.",
                        "category": "✦ WEISHEIT DES TAGES · HOFFNUNG"
                },
                {
                        "quote": "Das Gestern ist die Erinnerung von heute, das Morgen ist der Traum von heute.",
                        "author": "Khalil Gibran",
                        "de": "Das Gestern ist die Erinnerung von heute, das Morgen ist der Traum von heute.",
                        "category": "✦ WEISHEIT DES TAGES · LEBEN"
                },
                {
                        "quote": "Alle wollen die Menschheit verändern, doch niemand denkt daran, sich selbst zu verändern.",
                        "author": "Leo Tolstoi",
                        "de": "Alle wollen die Menschheit verändern, doch niemand denkt daran, sich selbst zu verändern.",
                        "category": "✦ WEISHEIT DES TAGES · WAHRHEIT"
                },
                {
                        "quote": "Um Glückseligkeit zu erlangen, muss der Mensch Verstand und Tugend vervollkommnen.",
                        "author": "Al-Farabi",
                        "de": "Um Glückseligkeit zu erlangen, muss der Mensch Verstand und Tugend vervollkommnen.",
                        "category": "✦ WEISHEIT DES TAGES · GLÜCK"
                },
                {
                        "quote": "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.",
                        "author": "Laotse",
                        "de": "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.",
                        "category": "✦ WEISHEIT DES TAGES · AUSDAUER"
                },
                {
                        "quote": "Bildung ist die mächtigste Waffe, die man verwenden kann, um die Welt zu verändern.",
                        "author": "Nelson Mandela",
                        "de": "Bildung ist die mächtigste Waffe, die man verwenden kann, um die Welt zu verändern.",
                        "category": "✦ WEISHEIT DES TAGES · BILDUNG"
                },
                {
                        "quote": "Wissen ist Macht.",
                        "author": "Francis Bacon",
                        "de": "Wissen ist Macht.",
                        "category": "✦ WEISHEIT DES TAGES · WISSEN"
                },
                {
                        "quote": "Nicht die Dinge selbst beunruhigen die Menschen, sondern ihre Meinungen über die Dinge.",
                        "author": "Epiktet",
                        "de": "Nicht die Dinge selbst beunruhigen die Menschen, sondern ihre Meinungen über die Dinge.",
                        "category": "✦ WEISHEIT DES TAGES · GELASSENHEIT"
                },
                {
                        "quote": "Tu, was du kannst, mit dem, was du hast, dort, wo du bist.",
                        "author": "Theodore Roosevelt",
                        "de": "Tu, was du kannst, mit dem, was du hast, dort, wo du bist.",
                        "category": "✦ WEISHEIT DES TAGES · ENTSCHLOSSENHEIT"
                },
                {
                        "quote": "Egal, ob du denkst, du kannst es, oder du kannst es nicht – du wirst recht behalten.",
                        "author": "Henry Ford",
                        "de": "Egal, ob du denkst, du kannst es, oder du kannst es nicht – du wirst recht behalten.",
                        "category": "✦ WEISHEIT DES TAGES · ZUVERSICHT"
                },
                {
                        "quote": "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.",
                        "author": "Steve Jobs",
                        "de": "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.",
                        "category": "✦ WEISHEIT DES TAGES · INDIVIDUALITÄT"
                },
                {
                        "quote": "In zwanzig Jahren wirst du mehr bereuen, was du nicht getan hast, als was du getan hast.",
                        "author": "Mark Twain",
                        "de": "In zwanzig Jahren wirst du mehr bereuen, was du nicht getan hast, als was du getan hast.",
                        "category": "✦ WEISHEIT DES TAGES · CHANCE"
                },
                {
                        "quote": "Die Wunde ist der Ort, an dem das Licht in dich eintritt.",
                        "author": "Dschalal ad-Din Rumi",
                        "de": "Die Wunde ist der Ort, an dem das Licht in dich eintritt.",
                        "category": "✦ WEISHEIT DES TAGES · HOFFNUNG"
                },
                {
                        "quote": "Ich hörte und vergaß; ich sah und erinnerte mich; ich tat und verstand.",
                        "author": "Konfuzius",
                        "de": "Ich hörte und vergaß; ich sah und erinnerte mich; ich tat und verstand.",
                        "category": "✦ WEISHEIT DES TAGES · ERFAHRUNG"
                },
                {
                        "quote": "Am Menschen muss alles schön sein: das Gesicht, die Kleidung, die Seele und die Gedanken.",
                        "author": "Anton Tschechow",
                        "de": "Am Menschen muss alles schön sein: das Gesicht, die Kleidung, die Seele und die Gedanken.",
                        "category": "✦ WEISHEIT DES TAGES · SCHÖNHEIT"
                }
        ],
        "en": [
                {
                        "quote": "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
                        "author": "Rumi",
                        "de": "Gestern war ich klug und wollte die Welt verändern. Heute bin ich weise und verändere mich selbst.",
                        "category": "✦ QUOTE OF THE DAY · WISDOM"
                },
                {
                        "quote": "The greatest wealth is wisdom and virtue, and the heaviest poverty is ignorance.",
                        "author": "Alisher Navoiy",
                        "de": "Der größte Reichtum ist Verstand und Anstand, die schwerste Armut aber die Unwissenheit.",
                        "category": "✦ QUOTE OF THE DAY · VIRTUE"
                },
                {
                        "quote": "Panic is half of disease, calmness is half of health, and patience is the beginning of healing.",
                        "author": "Avicenna (Ibn Sina)",
                        "de": "Panik ist die halbe Krankheit, Ruhe die halbe Gesundheit und Geduld der Beginn der Heilung.",
                        "category": "✦ QUOTE OF THE DAY · HEALTH"
                },
                {
                        "quote": "You have power over your mind - not outside events. Realize this, and you will find strength.",
                        "author": "Marcus Aurelius",
                        "de": "Du hast die Macht über deinen Geist, nicht über die äußeren Ereignisse. Erkenne dies, und du wirst Stärke finden.",
                        "category": "✦ QUOTE OF THE DAY · STOICISM"
                },
                {
                        "quote": "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.",
                        "author": "Seneca",
                        "de": "Nicht weil es schwer ist, wagen wir es nicht, sondern weil wir es nicht wagen, ist es schwer.",
                        "category": "✦ QUOTE OF THE DAY · COURAGE"
                },
                {
                        "quote": "He who has a why to live can bear almost any how.",
                        "author": "Friedrich Nietzsche",
                        "de": "Wer ein Warum zum Leben hat, erträgt fast jedes Wie.",
                        "category": "✦ QUOTE OF THE DAY · PURPOSE"
                },
                {
                        "quote": "Have the courage to use your own understanding!",
                        "author": "Immanuel Kant",
                        "de": "Habe Mut, dich deines eigenen Verstandes zu bedienen!",
                        "category": "✦ QUOTE OF THE DAY · PHILOSOPHY"
                },
                {
                        "quote": "Health is not everything, but without health, everything is nothing.",
                        "author": "Arthur Schopenhauer",
                        "de": "Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts.",
                        "category": "✦ QUOTE OF THE DAY · HEALTH"
                },
                {
                        "quote": "When we are no longer able to change a situation, we are challenged to change ourselves.",
                        "author": "Viktor Frankl",
                        "de": "Wenn wir eine Situation nicht mehr ändern können, müssen wir uns selbst ändern.",
                        "category": "✦ QUOTE OF THE DAY · PSYCHOLOGY"
                },
                {
                        "quote": "Knowing is not enough; we must apply. Willing is not enough; we must do.",
                        "author": "Johann Wolfgang von Goethe",
                        "de": "Es ist nicht genug zu wissen, man muss auch anwenden; es ist nicht genug zu wollen, man muss auch tun.",
                        "category": "✦ QUOTE OF THE DAY · ACTION"
                },
                {
                        "quote": "Logic will get you from A to B. Imagination will take you everywhere.",
                        "author": "Albert Einstein",
                        "de": "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.",
                        "category": "✦ QUOTE OF THE DAY · INSPIRATION"
                },
                {
                        "quote": "It is better to light a candle than curse the darkness.",
                        "author": "Confucius",
                        "de": "Es ist besser, ein einziges kleines Licht anzuzünden, als die Dunkelheit zu verfluchen.",
                        "category": "✦ QUOTE OF THE DAY · DEEDS"
                },
                {
                        "quote": "Science is the imperishable torch that illuminates every dark path.",
                        "author": "Mirzo Ulugh Beg",
                        "de": "Die Wissenschaft ist die unvergängliche Fackel, die alle dunklen Pfade erhellt.",
                        "category": "✦ QUOTE OF THE DAY · SCIENCE"
                },
                {
                        "quote": "Power lies in justice. Act with resolve, perseverance, and wisdom in all matters.",
                        "author": "Amir Timur",
                        "de": "Die Kraft liegt in der Gerechtigkeit. Handle in allen Dingen mit Entschlossenheit und Verstand.",
                        "category": "✦ QUOTE OF THE DAY · JUSTICE"
                },
                {
                        "quote": "The limits of my language mean the limits of my world.",
                        "author": "Ludwig Wittgenstein",
                        "de": "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.",
                        "category": "✦ QUOTE OF THE DAY · THOUGHT"
                },
                {
                        "quote": "Those who fight, may fail. Those who do not fight, have already failed.",
                        "author": "Bertolt Brecht",
                        "de": "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
                        "category": "✦ QUOTE OF THE DAY · DETERMINATION"
                },
                {
                        "quote": "Education is the kindling of a flame, not the filling of a vessel.",
                        "author": "Socrates",
                        "de": "Erziehung ist das Entzünden einer Flamme, nicht das Füllen eines Gefäßes.",
                        "category": "✦ QUOTE OF THE DAY · EDUCATION"
                },
                {
                        "quote": "I think, therefore I am.",
                        "author": "René Descartes",
                        "de": "Ich denke, also bin ich.",
                        "category": "✦ QUOTE OF THE DAY · CONSCIOUSNESS"
                },
                {
                        "quote": "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
                        "author": "Aristotle",
                        "de": "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.",
                        "category": "✦ QUOTE OF THE DAY · HABITS"
                },
                {
                        "quote": "The first and greatest victory is to conquer yourself.",
                        "author": "Plato",
                        "de": "Der erste und beste Sieg ist, sich selbst zu besiegen.",
                        "category": "✦ QUOTE OF THE DAY · WILLPOWER"
                },
                {
                        "quote": "And in every beginning there is a magic dwelling that protects us and helps us to live.",
                        "author": "Hermann Hesse",
                        "de": "Und jedem Anfang wohnt ein Zauber inne, der uns beschützt und der uns hilft, zu leben.",
                        "category": "✦ QUOTE OF THE DAY · HOPE"
                },
                {
                        "quote": "Yesterday is but today's memory, and tomorrow is today's dream.",
                        "author": "Kahlil Gibran",
                        "de": "Das Gestern ist die Erinnerung von heute, das Morgen ist der Traum von heute.",
                        "category": "✦ QUOTE OF THE DAY · LIFE"
                },
                {
                        "quote": "Everyone thinks of changing the world, but no one thinks of changing himself.",
                        "author": "Leo Tolstoy",
                        "de": "Alle wollen die Menschheit verändern, doch niemand denkt daran, sich selbst zu verändern.",
                        "category": "✦ QUOTE OF THE DAY · TRUTH"
                },
                {
                        "quote": "To achieve true happiness, one must perfect their intellect and virtue.",
                        "author": "Al-Farabi",
                        "de": "Um Glückseligkeit zu erlangen, muss der Mensch Verstand und Tugend vervollkommnen.",
                        "category": "✦ QUOTE OF THE DAY · HAPPINESS"
                },
                {
                        "quote": "A journey of a thousand miles begins with a single step.",
                        "author": "Lao Tzu",
                        "de": "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.",
                        "category": "✦ QUOTE OF THE DAY · PERSEVERANCE"
                },
                {
                        "quote": "Education is the most powerful weapon which you can use to change the world.",
                        "author": "Nelson Mandela",
                        "de": "Bildung ist die mächtigste Waffe, die man verwenden kann, um die Welt zu verändern.",
                        "category": "✦ QUOTE OF THE DAY · KNOWLEDGE"
                },
                {
                        "quote": "Knowledge is power.",
                        "author": "Francis Bacon",
                        "de": "Wissen ist Macht.",
                        "category": "✦ QUOTE OF THE DAY · POWER"
                },
                {
                        "quote": "Men are disturbed not by things, but by the view which they take of them.",
                        "author": "Epictetus",
                        "de": "Nicht die Dinge selbst beunruhigen die Menschen, sondern ihre Meinungen über die Dinge.",
                        "category": "✦ QUOTE OF THE DAY · SERENITY"
                },
                {
                        "quote": "Do what you can, with what you have, where you are.",
                        "author": "Theodore Roosevelt",
                        "de": "Tu, was du kannst, mit dem, was du hast, dort, wo du bist.",
                        "category": "✦ QUOTE OF THE DAY · RESILIENCE"
                },
                {
                        "quote": "Whether you think you can, or you think you can't — you're right.",
                        "author": "Henry Ford",
                        "de": "Egal, ob du denkst, du kannst es, oder du kannst es nicht – du wirst recht behalten.",
                        "category": "✦ QUOTE OF THE DAY · BELIEF"
                },
                {
                        "quote": "Your time is limited, don't waste it living someone else's life. Have the courage to follow your heart.",
                        "author": "Steve Jobs",
                        "de": "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.",
                        "category": "✦ QUOTE OF THE DAY · INDIVIDUALITY"
                },
                {
                        "quote": "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do.",
                        "author": "Mark Twain",
                        "de": "In zwanzig Jahren wirst du mehr bereuen, was du nicht getan hast, als was du getan hast.",
                        "category": "✦ QUOTE OF THE DAY · OPPORTUNITY"
                },
                {
                        "quote": "The wound is the place where the Light enters you.",
                        "author": "Rumi",
                        "de": "Die Wunde ist der Ort, an dem das Licht in dich eintritt.",
                        "category": "✦ QUOTE OF THE DAY · HOPE"
                },
                {
                        "quote": "I hear and I forget; I see and I remember; I do and I understand.",
                        "author": "Confucius",
                        "de": "Ich hörte und vergaß; ich sah und erinnerte mich; ich tat und verstand.",
                        "category": "✦ QUOTE OF THE DAY · EXPERIENCE"
                },
                {
                        "quote": "Man must be beautiful in every respect: in the face, in the clothes, in the soul and in the thoughts.",
                        "author": "Anton Chekhov",
                        "de": "Am Menschen muss alles schön sein: das Gesicht, die Kleidung, die Seele und die Gedanken.",
                        "category": "✦ QUOTE OF THE DAY · BEAUTY"
                }
        ]
};

    let currentQuoteItem = null;

    // 1. Foydalanuvchi tilini darhol aniqlash (tarmoqsiz, 0ms kechikish bilan)
    function detectUserLanguage() {
        if (window.i18n && typeof window.i18n.getLang === 'function') {
            return window.i18n.getLang();
        }
        try {
            const saved = localStorage.getItem('lang');
            if (saved && ['uz', 'ru', 'de', 'en'].includes(saved)) return saved;
        } catch (e) {}

        const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (navLang.startsWith('ru') || navLang.startsWith('uz') || navLang.startsWith('de') || navLang.startsWith('en')) {
            if (navLang.startsWith('ru')) return 'ru';
            if (navLang.startsWith('de')) return 'de';
            if (navLang.startsWith('en')) return 'en';
            return 'uz';
        }
        return 'uz';
    }

    // 2. Aktiv hikmatlar bazasini olish (offline zaxira + internet orqali olingan yangilanishlar)
    function getActiveQuotesPool(lang) {
        let pool = LOCAL_QUOTES_DB[lang] || LOCAL_QUOTES_DB.uz;
        try {
            const remoteRaw = localStorage.getItem('remote_quotes_pool');
            if (remoteRaw) {
                const remote = JSON.parse(remoteRaw);
                if (remote && Array.isArray(remote[lang]) && remote[lang].length > 0) {
                    pool = remote[lang];
                }
            }
        } catch (e) {}
        return pool;
    }

    // 3. Har safar saytga tashrif buyurilganda takrorlanmaydigan yangi hikmat tanlash
    function getNextRandomQuote(pool) {
        if (!pool || pool.length === 0) return null;
        if (pool.length === 1) return { item: pool[0], index: 0 };

        let seen = [];
        try {
            const raw = localStorage.getItem('seen_quotes_history');
            if (raw) seen = JSON.parse(raw);
            if (!Array.isArray(seen)) seen = [];
        } catch (e) {
            seen = [];
        }

        // Hali ko'rilmagan indekslar
        let available = [];
        for (let i = 0; i < pool.length; i++) {
            if (!seen.includes(i)) {
                available.push(i);
            }
        }

        // Agar barcha hikmatlar ko'rib chiqilgan bo'lsa, tarixni yangilaymiz (faqat oxirgisini istisno qilgan holda)
        if (available.length === 0) {
            const lastIdx = seen[seen.length - 1];
            seen = (typeof lastIdx === 'number') ? [lastIdx] : [];
            available = pool.map((_, i) => i).filter(i => i !== lastIdx);
            if (available.length === 0) available = [0];
        }

        // Ilk ko'rishda joriy haftaning yangi saralangan hikmatlariga (0-6) ustunlik beriladi
        let chosenIdx;
        const freshAvailable = available.filter(idx => idx < 7);
        if (seen.length === 0 && freshAvailable.length > 0) {
            chosenIdx = freshAvailable[Math.floor(Math.random() * freshAvailable.length)];
        } else {
            chosenIdx = available[Math.floor(Math.random() * available.length)];
        }

        seen.push(chosenIdx);
        if (seen.length > 50) seen.shift();

        try {
            localStorage.setItem('seen_quotes_history', JSON.stringify(seen));
            sessionStorage.setItem('current_quote_index', String(chosenIdx));
        } catch (e) {}

        return { item: pool[chosenIdx], index: chosenIdx };
    }

    // 4. Yuqori sifatli Nemischa audio talaffuz qilish (Neural / Natural Web Speech Engine)
    let cachedGermanVoice = null;

    function getBestGermanVoice() {
        if (cachedGermanVoice) return cachedGermanVoice;
        if (!('speechSynthesis' in window)) return null;

        const voices = window.speechSynthesis.getVoices() || [];

        // 1-darajali: Microsoft Natural / Online studio ovozlari (Katja, Conrad, Amala)
        let v = voices.find(v => (v.lang.startsWith('de') || v.lang === 'de_DE') && (
            v.name.includes('Natural') || 
            v.name.includes('Online (Natural)') || 
            v.name.includes('Katja') ||
            v.name.includes('Conrad')
        ));
        if (v) { cachedGermanVoice = v; return v; }

        // 2-darajali: Google Deutsch (Chrome online yuqori sifatli ovoz)
        v = voices.find(v => v.lang.startsWith('de') && v.name.includes('Google'));
        if (v) { cachedGermanVoice = v; return v; }

        // 3-darajali: Apple Premium / Enhanced / Siri (Safari va macOS/iOS)
        v = voices.find(v => v.lang.startsWith('de') && (
            v.name.includes('Enhanced') || 
            v.name.includes('Premium') || 
            v.name.includes('Siri') ||
            v.name.includes('Anna')
        ));
        if (v) { cachedGermanVoice = v; return v; }

        // 4-darajali: de-DE standart aniq ovozi
        v = voices.find(v => v.lang === 'de-DE' || v.lang === 'de_DE');
        if (v) { cachedGermanVoice = v; return v; }

        // 5-darajali: Har qanday nemis tili ovozi
        v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('de'));
        if (v) { cachedGermanVoice = v; return v; }

        return null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            cachedGermanVoice = null;
            getBestGermanVoice();
        };
        setTimeout(() => getBestGermanVoice(), 250);
    }

    function sanitizeForSpeech(raw) {
        return raw
            .replace(/[„“"”»«]/g, '')
            .replace(/s+/g, ' ')
            .replace(/—|–/g, ', ')
            .trim();
    }

    function speakGermanText(text) {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const cleanText = sanitizeForSpeech(text);

            const u = new SpeechSynthesisUtterance(cleanText);
            u.lang = 'de-DE';

            const bestVoice = getBestGermanVoice();
            if (bestVoice) {
                u.voice = bestVoice;
                u.rate = bestVoice.name.includes('Natural') ? 0.94 : 0.88;
                u.pitch = 1.0;
            } else {
                u.rate = 0.88;
                u.pitch = 1.0;
            }

            const audioBtn = document.getElementById('quote-audio-btn');
            if (audioBtn) {
                audioBtn.classList.add('playing');
                u.onstart = () => audioBtn.classList.add('playing');
                u.onend = () => audioBtn.classList.remove('playing');
                u.onerror = () => audioBtn.classList.remove('playing');
            }

            window.speechSynthesis.speak(u);
        } catch (e) {
            console.warn("Audio talaffuzda xato:", e);
        }
    }

    // 5. Hikmatni DOM'da chiroyli animatsiya bilan yangilash
    function applyQuoteToDOM(item, animate) {
        if (!item) return;
        currentQuoteItem = item;

        const textEl = document.getElementById('quote-text');
        const authorEl = document.getElementById('quote-author');
        const deEl = document.getElementById('quote-de-text');
        const badgeEl = document.getElementById('quote-category-badge');
        const cardEl = document.getElementById('fortune-card');

        const cleanQuote = (item.quote || '').replace(/^[\"“”„]+|[\"“”„]+$/g, '').trim();
        const cleanDe = (item.de || '').replace(/^[\"“”„]+|[\"“”„]+$/g, '').trim();
        const author = item.author || '';
        const category = item.category || '✦ KUN HIKMATI · DONOLIK';

        const updateFields = () => {
            if (textEl) textEl.textContent = '“' + cleanQuote + '”';
            if (authorEl) authorEl.textContent = author;
            if (deEl) deEl.textContent = '„' + cleanDe + '“';
            if (badgeEl) badgeEl.textContent = category;
        };

        if (animate && cardEl) {
            cardEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            cardEl.style.opacity = '0.35';
            cardEl.style.transform = 'translateY(4px)';
            setTimeout(() => {
                updateFields();
                cardEl.style.opacity = '1';
                cardEl.style.transform = 'translateY(0)';
            }, 180);
        } else {
            updateFields();
        }
    }

    // 6. Foydalanuvchi "Boshqa hikmat" tugmasini bosganda
    function nextQuote() {
        const lang = detectUserLanguage();
        const pool = getActiveQuotesPool(lang);
        const { item } = getNextRandomQuote(pool);
        applyQuoteToDOM(item, true);

        const nextBtn = document.getElementById('quote-next-btn');
        if (nextBtn) {
            nextBtn.classList.add('rotating');
            setTimeout(() => nextBtn.classList.remove('rotating'), 450);
        }
    }

    // 7. Haftalik internetdan yangi hikmatlarni yuklab olish (Avtomatik fon yangilanishi)
    async function syncWeeklyQuotes(force = false) {
        try {
            const lastSync = localStorage.getItem('quotes_last_weekly_sync');
            const now = Date.now();
            // Oxirgi tekshiruvdan 15 daqiqa o'tmagan bo'lsa va force bo'lmasa, tarmoqni ortiqcha yuklamaymiz
            if (!force && lastSync && (now - parseInt(lastSync, 10)) < (15 * 60 * 1000)) {
                return;
            }

            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 4000);
            const res = await fetch('data/quotes.json?t=' + now, {
                signal: controller.signal,
                cache: 'no-cache'
            });
            clearTimeout(timer);

            if (res.ok) {
                const data = await res.json();
                if (data && data.quotes && typeof data.quotes === 'object') {
                    const prevUpdatedAt = localStorage.getItem('quotes_data_updated_at');
                    const isNewUpdate = !prevUpdatedAt || prevUpdatedAt !== data.updatedAt;

                    localStorage.setItem('remote_quotes_pool', JSON.stringify(data.quotes));
                    localStorage.setItem('quotes_data_updated_at', data.updatedAt || String(now));
                    localStorage.setItem('quotes_last_weekly_sync', String(now));

                    if (isNewUpdate) {
                        localStorage.removeItem('seen_quotes_history');
                        const lang = detectUserLanguage();
                        const pool = (data.quotes && data.quotes[lang]) || data.quotes.uz;
                        if (pool && pool.length > 0) {
                            applyQuoteToDOM(pool[0], true);
                        }
                    }
                }
            }
        } catch (e) {
            // Internet bo'lmasa yoki tarmoq xatosi bo'lsa, ichki boy zaxira uzluksiz ishlaydi
        }
    }

    // 8. Bosh sahifada widgetni render / initsializatsiya qilish
    function renderDailyFortuneWidget() {
        const hero = document.querySelector('.hero') || document.getElementById('functional-row');
        let wrap = document.getElementById('fortune-widget-wrap');

        // Agar HTML'da widget skeleti bo'lmasa, uni yaratamiz
        if (!wrap && hero) {
            wrap = document.createElement('div');
            wrap.id = 'fortune-widget-wrap';
            wrap.className = 'fortune-widget-wrap atelier-quote-wrap container';
            hero.parentNode.insertBefore(wrap, hero.nextSibling);
            wrap.innerHTML = `
                <article class="atelier-quote-card" id="fortune-card">
                    <header class="atelier-card-header">
                        <span class="fortune-quote-badge atelier-tag" id="quote-category-badge">✦ KUN HIKMATI · ILHOM</span>
                        <div class="atelier-header-actions">
                            <button class="atelier-icon-btn" id="quote-copy-btn" type="button" aria-label="Iqtibosdan nusxa olish" title="Nusxa olish" data-action="quote-copy">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                            <button class="atelier-icon-btn" id="quote-image-btn" type="button" aria-label="Iqtibosni rasm qilib saqlash" title="Rasm sifatida yuklab olish (Instagram / Telegram)" data-action="quote-image">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            </button>
                            <button class="atelier-icon-btn" id="quote-next-btn" type="button" aria-label="Boshqa hikmat tanlash" title="Boshqa hikmat" data-action="quote-next">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                                </svg>
                            </button>
                        </div>
                    </header>
                    <div class="atelier-quote-body">
                        <blockquote class="fortune-quote-text atelier-quote-text" id="quote-text"></blockquote>
                        <cite class="fortune-quote-author atelier-quote-author" id="quote-author"></cite>
                    </div>
                    <div class="atelier-german-folio" id="quote-de-wrap">
                        <div class="atelier-german-meta">
                            <span class="atelier-flag-badge">🇩🇪 DE</span>
                            <p class="atelier-german-text" id="quote-de-text"></p>
                        </div>
                    </div>
                </article>
            `;
        }

        const lang = detectUserLanguage();
        const pool = getActiveQuotesPool(lang);
        const { item } = getNextRandomQuote(pool);
        applyQuoteToDOM(item, false);

        const imgBtn = document.getElementById('quote-image-btn');
        if (imgBtn && !imgBtn._hasImgListener) {
            imgBtn._hasImgListener = true;
            imgBtn.addEventListener('click', (e) => {
                e.preventDefault();
                generateQuoteImage();
            });
        }

        // Orqa fonda yangilanishni tekshirish
        setTimeout(() => syncWeeklyQuotes(false), 800);
    }

    function speakCurrent(text) {
        // Audio funksiyasi foydalanuvchi talabiga ko'ra o'chirildi
        return;
    }

    // 9. Iqtibosni Yuqori Sifatli Rasm Qilib Generatsiya Qilish (Canvas 1080x1080)
    let isGeneratingImage = false;

    function wrapCanvasText(ctx, text, maxWidth) {
        const words = text.split(/\s+/);
        const lines = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            if (ctx.measureText(testLine).width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        return lines;
    }

    function drawCanvasRoundRect(ctx, x, y, w, h, r) {
        if (typeof ctx.roundRect === 'function') {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
        } else {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }
    }

    async function generateQuoteImage() {
        if (isGeneratingImage) return;
        isGeneratingImage = true;

        const btn = document.getElementById('quote-image-btn');
        const origSvg = btn ? btn.innerHTML : '';
        if (btn) {
            btn.classList.add('copied');
            btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        }

        try {
            if (document.fonts && document.fonts.ready) {
                try { await document.fonts.ready; } catch (e) {}
            }

            const item = currentQuoteItem || {};
            const textEl = document.getElementById('quote-text');
            const authorEl = document.getElementById('quote-author');
            const deEl = document.getElementById('quote-de-text');
            const badgeEl = document.getElementById('quote-category-badge');

            const uzQuote = (item.quote || (textEl ? textEl.textContent : '') || '').replace(/^["“”„]+|["“”„]+$/g, '').trim();
            const author = (item.author || (authorEl ? authorEl.textContent : '') || '').replace(/^—\s*/, '').trim();
            const deQuote = (item.de || (deEl ? deEl.textContent : '') || '').replace(/^["“”„]+|["“”„]+$/g, '').trim();
            const categoryText = (item.category || (badgeEl ? badgeEl.textContent : '') || '✦ KUN HIKMATI · ILHOM').trim();

            const canvas = document.createElement('canvas');
            const WIDTH = 1080;
            const HEIGHT = 1080;
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas 2D context not supported');

            // 1. Sleek Dark Luxury Atelier Background
            const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
            bgGrad.addColorStop(0, '#090d16');
            bgGrad.addColorStop(0.5, '#0e1424');
            bgGrad.addColorStop(1, '#151b2d');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            // Ambient Glow Circles (Violet / Indigo)
            const glow1 = ctx.createRadialGradient(880, 180, 10, 880, 180, 500);
            glow1.addColorStop(0, 'rgba(139, 92, 246, 0.28)');
            glow1.addColorStop(0.45, 'rgba(99, 102, 241, 0.12)');
            glow1.addColorStop(1, 'rgba(99, 102, 241, 0)');
            ctx.fillStyle = glow1;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            const glow2 = ctx.createRadialGradient(200, 900, 10, 200, 900, 520);
            glow2.addColorStop(0, 'rgba(99, 102, 241, 0.22)');
            glow2.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
            glow2.addColorStop(1, 'rgba(59, 130, 246, 0)');
            ctx.fillStyle = glow2;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            // Subtle Architectural Grid
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
            ctx.lineWidth = 1;
            for (let x = 60; x < WIDTH; x += 60) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, HEIGHT);
                ctx.stroke();
            }
            for (let y = 60; y < HEIGHT; y += 60) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(WIDTH, y);
                ctx.stroke();
            }
            ctx.restore();

            // 2. Atelier Glass Card Container
            const cardX = 64;
            const cardY = 64;
            const cardW = 952;
            const cardH = 952;
            const cardR = 32;

            drawCanvasRoundRect(ctx, cardX, cardY, cardW, cardH, cardR);
            ctx.fillStyle = 'rgba(13, 18, 30, 0.78)';
            ctx.fill();

            const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
            borderGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
            borderGrad.addColorStop(0.3, 'rgba(139, 92, 246, 0.38)');
            borderGrad.addColorStop(0.7, 'rgba(99, 102, 241, 0.18)');
            borderGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
            ctx.strokeStyle = borderGrad;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // 3. Top Header
            const contentLeft = cardX + 48; // 112
            const contentRight = cardX + cardW - 48; // 968
            const contentWidth = contentRight - contentLeft; // 856

            // Badge (Category)
            const cleanCategory = (categoryText || '✦ KUN HIKMATI · ILHOM').toUpperCase();
            ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Inter", sans-serif';
            const catMetrics = ctx.measureText(cleanCategory);
            const badgeW = catMetrics.width + 28;
            const badgeH = 34;
            const badgeX = contentLeft;
            const badgeY = 112;

            drawCanvasRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 17);
            ctx.fillStyle = 'rgba(139, 92, 246, 0.16)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#c4b5fd';
            ctx.textAlign = 'left';
            ctx.fillText(cleanCategory, badgeX + 14, badgeY + 22);

            // Brand Mark (Right)
            ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Inter", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'right';
            ctx.fillText('ABDUGOFFOROV.UZ', contentRight, 134);
            const brandW = ctx.measureText('ABDUGOFFOROV.UZ').width;
            ctx.fillStyle = '#8b5cf6';
            ctx.fillText('✦', contentRight - brandW - 10, 134);
            ctx.textAlign = 'left';

            // Header Divider
            const divGrad = ctx.createLinearGradient(contentLeft, 168, contentRight, 168);
            divGrad.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
            divGrad.addColorStop(0.3, 'rgba(139, 92, 246, 0.28)');
            divGrad.addColorStop(0.7, 'rgba(99, 102, 241, 0.18)');
            divGrad.addColorStop(1, 'rgba(255, 255, 255, 0.03)');
            ctx.strokeStyle = divGrad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(contentLeft, 168);
            ctx.lineTo(contentRight, 168);
            ctx.stroke();

            // 4. Calculate Dynamic Typography & Heights
            let uzFontSize = 38;
            if (uzQuote.length > 200) {
                uzFontSize = 28;
            } else if (uzQuote.length > 130) {
                uzFontSize = 33;
            } else if (uzQuote.length < 75) {
                uzFontSize = 42;
            }
            const uzLineHeight = Math.round(uzFontSize * 1.48);

            ctx.font = `600 ${uzFontSize}px "Playfair Display", Georgia, serif`;
            const uzLines = wrapCanvasText(ctx, `“${uzQuote}”`, contentWidth - 30);
            const uzBlockHeight = uzLines.length * uzLineHeight;

            const hasGerman = Boolean(deQuote && deQuote.length > 0);
            let deFontSize = uzFontSize > 34 ? 22 : 19;
            let deLineHeight = Math.round(deFontSize * 1.48);
            let deLines = [];
            let deBoxH = 0;
            if (hasGerman) {
                ctx.font = `italic 400 ${deFontSize}px "Playfair Display", Georgia, serif`;
                deLines = wrapCanvasText(ctx, `„${deQuote}“`, contentWidth - 64);
                deBoxH = 32 + (deLines.length * deLineHeight) + 40;
            }

            const authorH = author ? 40 : 0;
            const deTotalH = hasGerman ? deBoxH + 32 : 0;
            const totalContentH = uzBlockHeight + authorH + deTotalH;

            const availableH = 920 - 180;
            const contentStartY = 180 + Math.max(20, Math.floor((availableH - totalContentH) / 2));

            // Decorative Elegant Watermark Quote
            ctx.save();
            ctx.font = 'italic 125px "Playfair Display", Georgia, serif';
            ctx.fillStyle = 'rgba(139, 92, 246, 0.22)';
            ctx.fillText('“', contentLeft - 8, contentStartY + 30);
            ctx.restore();

            // Draw Uzbek Quote Text
            ctx.save();
            ctx.font = `600 ${uzFontSize}px "Playfair Display", Georgia, serif`;
            ctx.fillStyle = '#f8fafc';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 3;

            let curY = contentStartY + (uzFontSize > 36 ? 42 : 34);
            for (let i = 0; i < uzLines.length; i++) {
                ctx.fillText(uzLines[i], contentLeft, curY);
                curY += uzLineHeight;
            }
            ctx.restore();

            // Author Name
            if (author) {
                curY += 12;
                ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Inter", sans-serif';
                ctx.fillStyle = '#a5b4fc';
                ctx.fillText(`— ${author}`, contentLeft, curY);
                curY += 26;
            }

            // German Translation Card (Secondary Folio)
            if (hasGerman) {
                curY += 28;
                const boxX = contentLeft;
                const boxY = curY;
                const boxW = contentWidth;

                drawCanvasRoundRect(ctx, boxX, boxY, boxW, deBoxH, 18);
                ctx.fillStyle = 'rgba(10, 15, 27, 0.72)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Left Accent Stripe
                ctx.save();
                drawCanvasRoundRect(ctx, boxX, boxY, boxW, deBoxH, 18);
                ctx.clip();
                const stripeGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + deBoxH);
                stripeGrad.addColorStop(0, '#8b5cf6');
                stripeGrad.addColorStop(1, '#6366f1');
                ctx.fillStyle = stripeGrad;
                ctx.fillRect(boxX, boxY, 5, deBoxH);
                ctx.restore();

                // German badge
                const badgeInnerY = boxY + 28;
                ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Inter", sans-serif';
                ctx.fillStyle = '#94a3b8';
                ctx.fillText('🇩🇪  NEMISCHA TARJIMA', boxX + 24, badgeInnerY);

                // German text
                ctx.font = `italic 400 ${deFontSize}px "Playfair Display", Georgia, serif`;
                ctx.fillStyle = '#cbd5e1';
                let deCurY = badgeInnerY + 28;
                for (let i = 0; i < deLines.length; i++) {
                    ctx.fillText(deLines[i], boxX + 24, deCurY);
                    deCurY += deLineHeight;
                }
            }

            // 5. Footer inside card
            const footerLineY = cardY + cardH - 74;
            const fGrad = ctx.createLinearGradient(contentLeft, footerLineY, contentRight, footerLineY);
            fGrad.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
            fGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
            fGrad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
            ctx.strokeStyle = fGrad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(contentLeft, footerLineY);
            ctx.lineTo(contentRight, footerLineY);
            ctx.stroke();

            const footerTextY = footerLineY + 36;
            ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Inter", sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText('✦ Kay Kundaligi · Shaxsiy Blog & Falsafa', contentLeft, footerTextY);

            ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", "Inter", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.textAlign = 'right';
            ctx.fillText('abdugofforov.uz', contentRight, footerTextY);
            ctx.textAlign = 'left';

            // 6. Export as PNG and Download
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error('Blob generation failed');

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            const fileName = `abdugofforov-iqtibos-${timestamp}.png`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1200);

            // Copy to clipboard if supported
            if (navigator.clipboard && window.ClipboardItem) {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                } catch (e) {}
            }

            if (typeof showToast === 'function') {
                showToast("Iqtibos rasm ko'rinishida saqlandi! 🎨");
            }
        } catch (err) {
            console.error('Quote to image generation failed:', err);
            if (typeof showToast === 'function') {
                showToast("Rasm yaratishda xatolik yuz berdi");
            }
        } finally {
            setTimeout(() => {
                if (btn) {
                    btn.classList.remove('copied');
                    if (origSvg) btn.innerHTML = origSvg;
                }
                isGeneratingImage = false;
            }, 1800);
        }
    }

    // Module Export
    window.App = window.App || {};
    window.App.Quote = {
        render: renderDailyFortuneWidget,
        next: nextQuote,
        speak: speakCurrent,
        syncWeekly: syncWeeklyQuotes,
        getPool: getActiveQuotesPool,
        generateImage: generateQuoteImage
    };

    window.renderDailyFortuneWidget = renderDailyFortuneWidget;
    window.nextIndividualQuote = nextQuote;
    window.speakCurrentQuote = speakCurrent;
    window.generateQuoteImage = generateQuoteImage;

    // Til o'zgarganda yangi tildagi hikmatga moslashtirish
    window.addEventListener('languageChanged', () => {
        const lang = detectUserLanguage();
        const pool = getActiveQuotesPool(lang);
        const { item } = getNextRandomQuote(pool);
        applyQuoteToDOM(item, true);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderDailyFortuneWidget);
    } else {
        renderDailyFortuneWidget();
    }
})();
