// ============================================================
// DEUTSCH AKADEMIYASI — B1 CURRICULUM
// B1 — Zertifikat Deutsch (O'rta daraja) O'quv Rejasi
// ============================================================

if (typeof window === 'undefined') {
    globalThis.window = globalThis;
}

window.deutschCurriculum = window.deutschCurriculum || {};
window.deutschCurriculum['B1'] = {
    level: 'B1',
    badge: '🌳 O\'rta',
    title: 'B1 — Zertifikat Deutsch (O\'rta daraja)',
    description: 'Mustaqil til egasi bo\'lish, fikr bildirish, hikoya qilish va Goethe B1 imtihoniga tayyorgarlik.',
    topics: [
        // ============================================================
        // MAVZU 1: Präteritum — Hikoya o'tgan zamoni
        // ============================================================
        {
            id: 'b1_1',
            number: 1,
            title: 'Präteritum — Hikoya o\'tgan zamoni',
            germanTitle: 'Das Präteritum (Vergangenheit in Erzählung und Schrift)',
            icon: '📜',
            description: 'Yozma nutqda, adabiyotda va yangiliklarda o\'tgan zamon: kuchsiz, kuchli va aralash fe\'llar, hamda og\'zaki nutqdagi sein, haben va modal fe\'llar.',
            theory: {
                summary: 'Präteritum (Imperfekt) — nemis tilida o\'tgan zamon shakllaridan biri bo\'lib, asosan yozma adabiyotda, gazeta-jurnallarda, rasmiy hisobotlarda va ertak-hikoyalarda ishlatiladi. Og\'zaki jonli muloqotda esa Perfekt ko\'proq ishlatilsa-da, "sein", "haben" va barcha modal fe\'llar (können, müssen, wollen...) uchun aynan Präteritum shakllari og\'zaki tilda ham mutlaq ustunlik qiladi.',
                sections: [
                    {
                        heading: '1. Kuchsiz fe\'llar (Regelmäßige / Schwache Verben)',
                        content: '<p>Kuchsiz fe\'llarning Präteritum shakli fe\'l o\'zagiga <strong>-te</strong> suffiksi va shaxs qo\'shimchalarini qo\'shish orqali yasaladi:</p>' +
                            '<ul>' +
                            '<li><strong>ich</strong> mach-te (men qildim)</li>' +
                            '<li><strong>du</strong> mach-test (sen qilding)</li>' +
                            '<li><strong>er / sie / es</strong> mach-te (u qildi)</li>' +
                            '<li><strong>wir</strong> mach-ten (biz qildik)</li>' +
                            '<li><strong>ihr</strong> mach-tet (sizlar qildingiz)</li>' +
                            '<li><strong>sie / Sie</strong> mach-ten (ular / Siz qildingiz)</li>' +
                            '</ul>' +
                            '<p><strong>Muhim eslatma:</strong> 1-shaxs birlik (<em>ich</em>) va 3-shaxs birlik (<em>er/sie/es</em>) shakllari har doim bir xil bo\'ladi!</p>' +
                            '<p>Agar fe\'l o\'zagi <em>-t, -d, -m, -n</em> bilan tugasa, talaffuz oson bo\'lishi uchun o\'zak va qo\'shimcha orasiga <strong>-e-</strong> tovushi kiradi: <em>arbeit-e-te</em>, <em>bad-e-te</em>, <em>antwo-rt-e-te</em>.</p>',
                        examples: [
                            { de: 'Gestern arbeitete mein Vater bis spät in die Nacht.', uz: 'Kecha otam tunda kechgacha ishladi.', tip: 'arbeiten -> arbeitete (-ete qo\'shiladi)' },
                            { de: 'Als Kind wohnte ich mit meiner Familie in einem kleinen Dorf.', uz: 'Bolaligimda oilam bilan kichik qishloqda yashaganman.', tip: 'wohnen -> wohnte (kuchsiz fe\'l)' },
                            { de: 'Sie kauften letztes Jahr ein schönes Haus in Berlin.', uz: 'Ular o\'tgan yili Berlindan chiroyli uy sotib olishdi.', tip: 'kaufen -> kauften' }
                        ]
                    },
                    {
                        heading: '2. Kuchli va aralash fe\'llar (Unregelmäßige / Starke Verben)',
                        content: '<p>Kuchli fe\'llarda o\'zak unlisi o\'zgaradi (<em>Ablaut</em>). Eng muhim qoida: kuchli fe\'llarning 1- va 3-shaxs birligida <strong>hech qanday shaxs qo\'shimchasi bo\'lmaydi</strong>!</p>' +
                            '<table style="width:100%; border-collapse:collapse; margin:10px 0;">' +
                            '<tr style="background:var(--bg-card);"><th style="padding:6px; border:1px solid #888;">Infinitiv</th><th style="padding:6px; border:1px solid #888;">Präteritum (ich/er)</th><th style="padding:6px; border:1px solid #888;">O\'zbekcha</th></tr>' +
                            '<tr><td style="padding:6px; border:1px solid #888;">gehen</td><td style="padding:6px; border:1px solid #888;"><strong>ging</strong></td><td style="padding:6px; border:1px solid #888;">bordi</td></tr>' +
                            '<tr><td style="padding:6px; border:1px solid #888;">sehen</td><td style="padding:6px; border:1px solid #888;"><strong>sah</strong></td><td style="padding:6px; border:1px solid #888;">ko\'rdi</td></tr>' +
                            '<tr><td style="padding:6px; border:1px solid #888;">schreiben</td><td style="padding:6px; border:1px solid #888;"><strong>schrieb</strong></td><td style="padding:6px; border:1px solid #888;">yozdi</td></tr>' +
                            '<tr><td style="padding:6px; border:1px solid #888;">sprechen</td><td style="padding:6px; border:1px solid #888;"><strong>sprach</strong></td><td style="padding:6px; border:1px solid #888;">gapirdi</td></tr>' +
                            '<tr><td style="padding:6px; border:1px solid #888;">kommen</td><td style="padding:6px; border:1px solid #888;"><strong>kam</strong></td><td style="padding:6px; border:1px solid #888;">keldi</td></tr>' +
                            '<tr><td style="padding:6px; border:1px solid #888;">bleiben</td><td style="padding:6px; border:1px solid #888;"><strong>blieb</strong></td><td style="padding:6px; border:1px solid #888;">qoldi</td></tr>' +
                            '</table>' +
                            '<p><strong>Aralash fe\'llar (Mischverben):</strong> Unli o\'zgaradi va kuchsiz fe\'llardek <em>-te</em> qo\'shimchasini oladi: <em>denken &rarr; dachte</em>, <em>bringen &rarr; brachte</em>, <em>wissen &rarr; wusste</em>, <em>kennen &rarr; kannte</em>.</p>',
                        examples: [
                            { de: 'Goethe schrieb viele weltberühmte Gedichte und Dramen.', uz: 'Gyote ko\'plab jahonga mashhur she\'rlar va dramalar yozgan.', tip: 'schreiben -> schrieb (qo\'shimchasiz)' },
                            { de: 'Er kam gestern sehr spät nach Hause und ging sofort ins Bett.', uz: 'U kecha uyga juda kech keldi va darhol uyquga ketdi.', tip: 'kommen -> kam, gehen -> ging' },
                            { de: 'Niemand wusste die richtige Antwort auf diese schwere Frage.', uz: 'Hech kim bu qiyin savolga to\'g\'ri javobni bilmas edi.', tip: 'wissen -> wusste (aralash fe\'l)' }
                        ]
                    },
                    {
                        heading: '3. sein, haben va Modal fe\'llar (Og\'zaki nutqda ham qo\'llanadi)',
                        content: '<p>Ushbu fe\'llarning Präteritumi og\'zaki nutqda ham Perfekt o\'rniga keng ishlatiladi, chunki ular nutqni ancha qisqa va tabiiy qiladi:</p>' +
                            '<ul>' +
                            '<li><strong>sein:</strong> ich war, du warst, er war, wir waren, ihr wart, sie waren</li>' +
                            '<li><strong>haben:</strong> ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten</li>' +
                            '</ul>' +
                            '<p><strong>Modal fe\'llar:</strong> Barcha modal fe\'llar Präteritumda <strong>Umlaut (ä, ö, ü) nuqtalarini yo\'qotadi</strong> va <em>-te</em> oladi:</p>' +
                            '<ul>' +
                            '<li>können &rarr; <strong>konnte</strong> (qila oldi / qila olar edi)</li>' +
                            '<li>müssen &rarr; <strong>musste</strong> (majbur bo\'ldi / to\'g\'ri keldi)</li>' +
                            '<li>dürfen &rarr; <strong>durfte</strong> (ruxsat etildi)</li>' +
                            '<li>wollen &rarr; <strong>wollte</strong> (xohladi / niyat qildi)</li>' +
                            '<li>sollen &rarr; <strong>sollte</strong> (kerak edi / buyurildi)</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Ich war gestern krank und hatte hohes Fieber.', uz: 'Men kecha kasal edim va yuqori isitmasi bor edi.', tip: 'war va hatte og\'zaki nutqda har doim afzal' },
                            { de: 'Er konnte leider nicht zur Party kommen, weil er arbeiten musste.', uz: 'U kechaga kela olmadi, chunki ishlashga majbur edi.', tip: 'konnte va musste (modal fe\'llar)' },
                            { de: 'Wir durften als Kinder abends nicht lange fernsehen.', uz: 'Bolaligimizda bizga kechasi uzoq televizor ko\'rishga ruxsat berilmasdi.', tip: 'dürfen -> durfte' }
                        ]
                    }
                ],
                keyRules: [
                    '1- va 3-shaxs birlikda (ich va er/sie/es) Präteritum shakli doimo bir xil bo\'ladi (ich machte = er machte, ich ging = er ging).',
                    'Kuchli fe\'llarning 1- va 3-shaxsida hech qanday shaxs qo\'shimchasi qo\'shilmaydi: ich sang, er sang.',
                    'Modal fe\'llar Präteritumda o\'z Umlaut (ä, ö, ü) belgilarini yo\'qotadi: können → konnte, müssen → musste.',
                    'Og\'zaki nutqda "war", "hatte" va modal fe\'llarning Präteritumini ishlatish Perfektga nisbatan ancha tabiiy va to\'g\'ri eshitiladi.'
                ]
            },
            flashcards: [
                { front: 'gingen (gehen)', back: 'bordilar / borgan edilar', tip: 'gehen -> ging -> gegangen (kuchli fe\'l)' },
                { front: 'sprach (sprechen)', back: 'gapirdi / gapirgan edi', tip: 'sprechen -> sprach -> gesprochen' },
                { front: 'schrieb (schreiben)', back: 'yozdi / yozgan edi', tip: 'schreiben -> schrieb -> geschrieben' },
                { front: 'kam (kommen)', back: 'keldi', tip: 'kommen -> kam -> gekommen' },
                { front: 'dachte (denken)', back: 'o\'yladi / fikr qildi', tip: 'denken -> dachte -> gedacht (aralash fe\'l)' },
                { front: 'wusste (wissen)', back: 'bildi / xabardor edi', tip: 'wissen -> wusste -> gewusst' },
                { front: 'durfte (dürfen)', back: 'ruxsati bor edi', tip: 'Umlaut yo\'qoladi: dürfen -> durfte' },
                { front: 'musste (müssen)', back: 'majbur bo\'ldi / kerak edi', tip: 'müssen -> musste' },
                { front: 'konnte (können)', back: 'qila oldi / qila olar edi', tip: 'können -> konnte' },
                { front: 'wollte (wollen)', back: 'xohladi / niyat qildi', tip: 'wollen -> wollte' },
                { front: 'blieb (bleiben)', back: 'qoldi', tip: 'bleiben -> blieb -> geblieben' },
                { front: 'fand (finden)', back: 'topdi / deb hisobladi', tip: 'finden -> fand -> gefunden' },
                { front: 'gab (geben)', back: 'berdi (Es gab = bor edi)', tip: 'geben -> gab -> gegeben' },
                { front: 'sah (sehen)', back: 'ko\'rdi', tip: 'sehen -> sah -> gesehen' }
            ],
            test: [
                {
                    q: 'Kuchsiz (muntazam) fe\'llarning Präteritum shakli qanday yasaladi?',
                    options: [
                        'Fe\'l o\'zagiga -te va shaxs qo\'shimchalari qo\'shiladi',
                        'haben yoki sein yordamchi fe\'li va Partizip II orqali',
                        'werden fe\'li va asosiy fe\'lning infinitivi orqali',
                        'Faqat o\'zakdagi unli o\'zgarishi orqali'
                    ],
                    answer: 0,
                    explanation: 'Kuchsiz fe\'llar o\'zakka -te suffiksini qo\'shish orqali Präteritum hosil qiladi (machen -> machte).'
                },
                {
                    q: '"Er ___ gestern den ganzen Tag gearbeitet" o\'rniga Präteritumda "U kecha kun bo\'yi ishladi" qanday bo\'ladi?',
                    options: [
                        'Er arbeitete gestern den ganzen Tag.',
                        'Er arbeitet gestern den ganzen Tag.',
                        'Er hat gestern gearbeitet.',
                        'Er wird gestern arbeiten.'
                    ],
                    answer: 0,
                    explanation: 'arbeiten fe\'lining Präteritum 3-shaxs birlik shakli: "arbeitete".'
                },
                {
                    q: '"gehen" (bormoq) kuchli fe\'lining "ich" va "er" uchun Präteritum shakli qaysi?',
                    options: [
                        'gingte',
                        'ging',
                        'gehte',
                        'gegangen'
                    ],
                    answer: 1,
                    explanation: 'gehen kuchli fe\'l bo\'lib, Präteritumda "ging" shaklini oladi va 1- hamda 3-shaxsda qo\'shimcha olmaydi.'
                },
                {
                    q: 'Qaysi qatorda "sein" fe\'lining Präteritum shakllari to\'g\'ri berilgan?',
                    options: [
                        'ich bin, du bist, er ist',
                        'ich war, du warst, er war',
                        'ich wäre, du wärst, er wäre',
                        'ich werde, du wirst, er wird'
                    ],
                    answer: 1,
                    explanation: 'sein fe\'lining Präteritumi: ich war, du warst, er war, wir waren, ihr wart, sie waren.'
                },
                {
                    q: '"Wir ___ gestern leider keine Zeit." (Bizning kecha vaqtimiz yo\'q edi). Mos shaklni qo\'ying:',
                    options: [
                        'hatten',
                        'hattet',
                        'haben',
                        'hätten'
                    ],
                    answer: 0,
                    explanation: 'haben fe\'lining wir uchun Präteritum shakli "hatten" bo\'ladi.'
                },
                {
                    q: '"können" modal fe\'lining Präteritum shaklida qanday fonetik o\'zgarish yuz beradi?',
                    options: [
                        'Umlaut saqlanib qoladi (könnte)',
                        'Umlaut yo\'qoladi va -te qo\'shiladi (konnte)',
                        'Fe\'l umuman o\'zgarmaydi',
                        'Fe\'l oldiga ge- prefiksi qo\'shiladi'
                    ],
                    answer: 1,
                    explanation: 'Modal fe\'llar Präteritumda Umlaut belgilarini yo\'qotadi: können -> konnte, müssen -> musste.'
                },
                {
                    q: '"Gestern ___ ich wegen Krankheit zu Hause bleiben." (Kecha kasallik tufayli uyda qolishga majbur bo\'ldim). To\'g\'ri modal fe\'lni tanlang:',
                    options: [
                        'musste',
                        'müsste',
                        'muss',
                        'gemusst'
                    ],
                    answer: 0,
                    explanation: 'müssen fe\'lining Präteritum 1-shaxs shakli "musste" (majbur bo\'ldim).'
                },
                {
                    q: '"schreiben" fe\'lining Präteritumi qaysi gapda to\'g\'ri ishlatilgan?',
                    options: [
                        'Er schreibte einen Brief.',
                        'Er schrieb einen langen Brief.',
                        'Er hat geschrieben einen Brief.',
                        'Er schrob einen Brief.'
                    ],
                    answer: 1,
                    explanation: 'schreiben kuchli fe\'l: Präteritum shakli "schrieb" bo\'ladi.'
                },
                {
                    q: 'Kuchli fe\'llarning 1-shaxs (ich) va 3-shaxs (er/sie/es) Präteritum shakli haqidagi qaysi qoida to\'g\'ri?',
                    options: [
                        'Ularga har doim -te qo\'shimchasi qo\'shiladi',
                        'Ular bir-biriga teng bo\'ladi va hech qanday shaxs qo\'shimchasi olmaydi',
                        'Faqat 1-shaxs -e qo\'shimchasini oladi',
                        '3-shaxsda -t qo\'shimchasi qo\'yiladi'
                    ],
                    answer: 1,
                    explanation: 'Kuchli fe\'llarda ich va er/sie/es uchun qo\'shimcha bo\'lmaydi: ich ging, er ging; ich kam, er kam.'
                },
                {
                    q: '"wissen" (bilmoq) fe\'lining Präteritum 3-shaxs birlik shakli qaysi?',
                    options: [
                        'wusste',
                        'weisste',
                        'wiss',
                        'wüsste'
                    ],
                    answer: 0,
                    explanation: 'wissen aralash fe\'l bo\'lib, Präteritumda "wusste" bo\'ladi ("wüsste" esa Konjunktiv II).'
                }
            ],
            gamePairs: [
                { de: 'gingen', uz: 'bordilar' },
                { de: 'schrieb', uz: 'yozdi' },
                { de: 'wusste', uz: 'bildi' },
                { de: 'konnte', uz: 'qila oldi' },
                { de: 'musste', uz: 'majbur edi' },
                { de: 'blieb', uz: 'qoldi' },
                { de: 'sprach', uz: 'gapirdi' },
                { de: 'dachte', uz: 'o\'yladi' }
            ]
        },

        // ============================================================
        // MAVZU 2: Nisbiy ergash gaplar (Relativsätze)
        // ============================================================
        {
            id: 'b1_2',
            number: 2,
            title: 'Nisbiy ergash gaplar',
            germanTitle: 'Relativsätze (im Nominativ, Akkusativ, Dativ und mit Präpositionen)',
            icon: '🔗',
            description: 'Bosh gapdagi ot yoki olmoshni aniqlovchi ergash gaplar: der, die, das, den, dem, der, denen va predlogli nisbiy olmoshlar.',
            theory: {
                summary: 'Relativsätze (nisbiy ergash gaplar) asosiy gapdagi biror ot yoki olmosh haqida qo\'shimcha aniqlik kiritadi ("qaysiki...", "...gan kishi/narsa"). Nisbiy olmoshning jinsi (maskulin, feminin, neutrum) va soni (birlik, ko\'plik) bosh gapdagi otdan olinadi, kelishigi (Nominativ, Akkusativ, Dativ) esa ergash gapdagi fe\'l yoki predlogning talabiga qarab belgilanadi. Ergash gapda kesim (fe\'l) doimo eng oxirgi o\'rinda turadi.',
                sections: [
                    {
                        heading: '1. Nominativ va Akkusativda nisbiy olmoshlar',
                        content: '<p>Nisbiy olmoshlar ko\'rinishi jihatidan aniq artikellarga (der, die, das, die) deyarli bir xil:</p>' +
                            '<ul>' +
                            '<li><strong>Nominativ (ega bo\'lib kelganda):</strong>' +
                            '<ul>' +
                            '<li>Maskulin: <em>Der Mann, <strong>der</strong> dort steht, ist mein Lehrer.</em> (U yerda turgan erkak — mening o\'qituvchim).</li>' +
                            '<li>Feminin: <em>Die Frau, <strong>die</strong> lacht, ist meine Tante.</em></li>' +
                            '<li>Neutrum: <em>Das Kind, <strong>das</strong> spielt, ist sehr süß.</em></li>' +
                            '<li>Plural: <em>Die Leute, <strong>die</strong> hier wohnen, sind nett.</em></li>' +
                            '</ul></li>' +
                            '<li><strong>Akkusativ (to\'ldiruvchi bo\'lib kelganda):</strong> Faqat maskulin shakli <strong>den</strong> ga o\'zgaradi!' +
                            '<ul>' +
                            '<li>Maskulin: <em>Der Film, <strong>den</strong> wir gestern sahen, war spannend.</em> (Biz kecha ko\'rgan film juda qiziqarli edi).</li>' +
                            '<li>Feminin: <em>Die Tasche, <strong>die</strong> ich gekauft habe, ist teuer.</em></li>' +
                            '<li>Neutrum: <em>Das Buch, <strong>das</strong> du liest, kenne ich nicht.</em></li>' +
                            '<li>Plural: <em>Die Freunde, <strong>die</strong> ich eingeladen habe, kommen bald.</em></li>' +
                            '</ul></li>' +
                            '</ul>',
                        examples: [
                            { de: 'Das ist der Arzt, der mich erfolgreich operiert hat.', uz: 'Bu meni muvaffaqiyatli operatsiya qilgan shifokor.', tip: 'der Arzt (maskulin) -> ergash gapda ega (Nominativ) -> der' },
                            { de: 'Der Wagen, den mein Nachbar gekauft hat, ist nagelneu.', uz: 'Qo\'shnim sotib olgan mashina — top-toza yangi.', tip: 'der Wagen (maskulin) -> kaufte wen? (Akkusativ) -> den' },
                            { de: 'Kennst du die Frau, die gerade das Zimmer betreten hat?', uz: 'Hozirgina xonaga kirgan ayolni taniysanmi?', tip: 'die Frau -> Nominativ -> die' }
                        ]
                    },
                    {
                        heading: '2. Dativda nisbiy olmoshlar (Ayniqsa "denen" shakliga e\'tibor bering!)',
                        content: '<p>Agar ergash gapdagi fe\'l Dativ talab qilsa (<em>helfen, danken, gefallen, gehören, vertrauen, gratulieren</em>), nisbiy olmosh Dativ shaklida bo\'ladi:</p>' +
                            '<ul>' +
                            '<li>Maskulin: <strong>dem</strong> &mdash; <em>Der Kollege, <strong>dem</strong> ich helfe...</em></li>' +
                            '<li>Neutrum: <strong>dem</strong> &mdash; <em>Das Kind, <strong>dem</strong> ich den Ball gab...</em></li>' +
                            '<li>Feminin: <strong>der</strong> &mdash; <em>Die Nachbarin, <strong>der</strong> das Auto gehört...</em></li>' +
                            '<li>Plural: <strong>denen</strong> (!) &mdash; <em>Die Kollegen, <strong>denen</strong> wir vertrauen...</em></li>' +
                            '</ul>' +
                            '<p><strong>Oltin qoida:</strong> Dativ ko\'plikda nisbiy olmosh <em>den</em> emas, balki <strong>denen</strong> bo\'ladi. B1 imtihonlarida bu eng ko\'p chalg\'ituvchi test savollaridan biridir!</p>',
                        examples: [
                            { de: 'Das ist die Lehrerin, der alle Schüler dankbar sind.', uz: 'Bu barcha o\'quvchilar undan minnatdor bo\'lgan o\'qituvchi ayol.', tip: 'danken + Dativ -> feminin -> der' },
                            { de: 'Das Kind, dem das Spielzeug gehört, weint laut.', uz: 'O\'yinchoq tegishli bo\'lgan bola baland ovozda yig\'layapti.', tip: 'gehören + Dativ -> neutrum -> dem' },
                            { de: 'Das sind die Freunde, denen ich immer vertrauen kann.', uz: 'Bu men doimo ishonishim mumkin bo\'lgan do\'stlarim.', tip: 'Dativ ko\'plik shakli har doim "denen"!' }
                        ]
                    },
                    {
                        heading: '3. Predlogli nisbiy ergash gaplar (Relativsätze mit Präpositionen)',
                        content: '<p>Agar ergash gapdagi fe\'l predlog bilan boshqarilsa (masalan: <em>warten auf, sprechen über, denken an, sich interessieren für, träumen von</em>), u holda predlog nisbiy olmoshning oldiga qo\'yiladi:</p>' +
                            '<p>Predlog kelishikni (Akkusativ yoki Dativ) belgilaydi:</p>' +
                            '<ul>' +
                            '<li><em>Der Freund, <strong>auf den</strong> ich warte, kommt gleich.</em> (warten auf + Akk -> maskulin: auf den)</li>' +
                            '<li><em>Das Thema, <strong>über das</strong> wir gesprochen haben, ist wichtig.</em> (sprechen über + Akk -> neutrum: über das)</li>' +
                            '<li><em>Die Stadt, <strong>in der</strong> ich lebe, ist sehr modern.</em> (wohnen/leben in + Dat -> feminin: in der)</li>' +
                            '<li><em>Die Kollegen, <strong>mit denen</strong> ich arbeite, sind hilfsbereit.</em> (mit + Dat Plural -> mit denen)</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Der Zug, auf den wir warten, hat 20 Minuten Verspätung.', uz: 'Biz kutayotgan poyezd 20 daqiqa kechikmoqda.', tip: 'warten auf + Akkusativ Maskulin -> auf den' },
                            { de: 'Die Musikschule, für die sie sich interessiert, ist sehr berühmt.', uz: 'U qiziqayotgan musiqa maktabi juda mashhur.', tip: 'sich interessieren für + Akkusativ Feminin -> für die' },
                            { de: 'Das Projekt, an dem wir gerade arbeiten, ist fast fertig.', uz: 'Biz hozir ishlayotgan loyiha deyarli tayyor.', tip: 'arbeiten an + Dativ Neutrum -> an dem' }
                        ]
                    }
                ],
                keyRules: [
                    'Nisbiy olmoshning jinsi va soni bosh gapdagi aniqlanayotgan so\'zga qarab belgilanadi.',
                    'Nisbiy olmoshning kelishigi esa ergash gapdagi fe\'l yoki predlogning talabiga (Kasus) binoan qo\'yiladi.',
                    'Dativ ko\'plikdagi nisbiy olmosh shakli artikeldan farq qiladi: "den" emas, albatta "denen" bo\'ladi.',
                    'Nisbiy ergash gaplar har doim ikki tomondan vergul bilan ajratiladi va tuslangan fe\'l gapning eng oxirida turadi.'
                ]
            },
            flashcards: [
                { front: 'der (Relativpronomen Nom. Mask.)', back: 'qaysiki... (erkak jinsidagi ega)', tip: 'Der Mann, der dort steht...' },
                { front: 'den (Relativpronomen Akk. Mask.)', back: 'qaysiniki... (erkak jinsi to\'ldiruvchi)', tip: 'Der Film, den ich sah...' },
                { front: 'dem (Relativpronomen Dat. Mask./Neut.)', back: 'unga... / kimga... (Dativ)', tip: 'Dem Mann, dem ich half...' },
                { front: 'der (Relativpronomen Dat. Fem.)', back: 'unga... / qaysi ayolga...', tip: 'Die Frau, der das Buch gehört...' },
                { front: 'denen (Relativpronomen Dat. Plural)', back: 'ularga... (ko\'plik Dativ)', tip: 'Die Kinder, denen ich helfe...' },
                { front: 'auf den / auf die / auf das', back: 'kutayotgan... (warten auf)', tip: 'Der Bus, auf den ich warte...' },
                { front: 'mit dem / mit der / mit denen', back: 'birga... bo\'lgan (mit + Dativ)', tip: 'Die Freunde, mit denen ich reise...' },
                { front: 'über das / über die', back: 'haqida... gaplashilgan', tip: 'Das Thema, über das wir sprechen...' },
                { front: 'in dem (im) / in der', back: 'ichida... yashaydigan/bo\'lgan', tip: 'Die Stadt, in der ich lebe...' },
                { front: 'für den / für die / für das', back: 'uchun... (für + Akkusativ)', tip: 'Die Stelle, für die ich mich bewerbe...' },
                { front: 'von dem / von der', back: 'haqida / undan... (von + Dativ)', tip: 'Der Autor, von dem ich las...' },
                { front: 'an den / an die / an dem', back: 'o\'ylayotgan / ishlayotgan...', tip: 'denken an + Akk, arbeiten an + Dat' },
                { front: 'ohne den / ohne die', back: 'unsiz... (ohne + Akkusativ)', tip: 'Der Freund, ohne den ich nicht gehe...' },
                { front: 'zu dem / zu der', back: 'borgan... (zu + Dativ)', tip: 'Der Arzt, zu dem ich gehe...' }
            ],
            test: [
                {
                    q: 'Nisbiy ergash gapda (Relativsatz) tuslangan fe\'l qayerda joylashadi?',
                    options: [
                        'Gapning boshida, nisbiy olmoshdan oldin',
                        'Ikkinchi o\'rinda',
                        'Ergash gapning eng oxirgi o\'rnida',
                        'Nisbiy olmoshdan keyin darhol'
                    ],
                    answer: 2,
                    explanation: 'Barcha ergash gaplar kabi nisbiy gaplarda ham tuslangan fe\'l eng oxirgi o\'rinda keladi.'
                },
                {
                    q: '"Das ist der Mann, ___ mich gestern gegrüßt hat." Bo\'sh o\'ringa mos nisbiy olmoshni qo\'ying (Nominativ, Maskulin):',
                    options: [
                        'der',
                        'den',
                        'dem',
                        'dessen'
                    ],
                    answer: 0,
                    explanation: 'der Mann (maskulin) gapda ega bo\'lib kelmoqda (kim salom berdi?), shuning uchun Nominativ "der".'
                },
                {
                    q: '"Der Film, ___ wir gestern im Kino gesehen haben, war fantastisch." To\'g\'ri olmoshni toping:',
                    options: [
                        'der',
                        'den',
                        'dem',
                        'das'
                    ],
                    answer: 1,
                    explanation: 'der Film (maskulin), lekin ergash gapda "wir sahen wen?" to\'ldiruvchi (Akkusativ) bo\'lgani uchun "den".'
                },
                {
                    q: '"Die Frau, ___ ich beim Umzug geholfen habe, ist sehr nett." (helfen fe\'li Dativ talab qiladi):',
                    options: [
                        'die',
                        'der',
                        'den',
                        'denen'
                    ],
                    answer: 1,
                    explanation: 'die Frau (feminin) + helfen fe\'li Dativ talab qiladi -> die Frau Dativda "der" oladi.'
                },
                {
                    q: 'Ko\'plikdagi (Plural) Dativ nisbiy olmoshi qaysi qatorda to\'g\'ri ko\'rsatilgan?',
                    options: [
                        'die',
                        'den',
                        'denen',
                        'deren'
                    ],
                    answer: 2,
                    explanation: 'Dativ ko\'plikdagi nisbiy olmosh shakli "denen" bo\'ladi (masalan: die Menschen, denen ich danke).'
                },
                {
                    q: '"Das ist das Kind, ___ ein Eis möchte." (Nominativ, Neutrum):',
                    options: [
                        'das',
                        'dem',
                        'den',
                        'des'
                    ],
                    answer: 0,
                    explanation: 'das Kind (neutrum), ergash gapda ega bo\'lib kelyapti -> Nominativ "das".'
                },
                {
                    q: '"Die Kollegen, mit ___ ich arbeite, sind sehr freundlich." Bo\'sh o\'rinni to\'ldiring (mit + Dativ Plural):',
                    options: [
                        'denen',
                        'die',
                        'den',
                        'ihnen'
                    ],
                    answer: 0,
                    explanation: 'mit predlogi Dativ talab qiladi, die Kollegen esa ko\'plikda -> "mit denen".'
                },
                {
                    q: '"Der Bus, auf ___ ich seit 20 Minuten warte, kommt endlich." (warten auf + Akkusativ Maskulin):',
                    options: [
                        'dem',
                        'den',
                        'der',
                        'das'
                    ],
                    answer: 1,
                    explanation: 'warten auf + Akkusativ talab qiladi; der Bus maskulin bo\'lgani uchun "auf den".'
                },
                {
                    q: '"Die Stadt, in ___ ich geboren wurde, ist wunderschön." (in + Dativ Feminin, "qayerda?"):',
                    options: [
                        'der',
                        'die',
                        'das',
                        'den'
                    ],
                    answer: 0,
                    explanation: 'in + Dativ (qayerda? die Stadt -> in der Stadt) -> "in der".'
                },
                {
                    q: 'Nisbiy olmoshning jinsi va kelishigi qanday aniqlanadi?',
                    options: [
                        'Jinsi ham, kelishigi ham bosh gapdagi so\'zdan olinadi',
                        'Jinsi bosh gapdagi otdan, kelishigi esa ergash gapdagi fe\'l/predlog talabidan olinadi',
                        'Faqat ergash gapdagi fe\'lga qarab ikkisi ham belgilanadi',
                        'Nisbiy olmosh har doim Nominativda bo\'ladi'
                    ],
                    answer: 1,
                    explanation: 'Jinsi va soni bosh gapdagi otdan olinadi, kelishigi (Kasus) esa ergash gapdagi sintaktik vazifasidan kelib chiqadi.'
                }
            ],
            gamePairs: [
                { de: 'der Mann, der', uz: 'turgan kishi (Nom)' },
                { de: 'den Film, den', uz: 'ko\'rgan filmim (Akk)' },
                { de: 'der Frau, der', uz: 'yordam berganim ayol (Dat)' },
                { de: 'Freunde, denen', uz: 'ishongan do\'stlarim (Dat Pl)' },
                { de: 'auf den', uz: 'men kutayotgan' },
                { de: 'mit dem', uz: 'u bilan birga' },
                { de: 'über das', uz: 'haqida gaplashganimiz' },
                { de: 'in der', uz: 'u yerda yashaydiganim' }
            ]
        },

        // ============================================================
        // MAVZU 3: Konjunktiv II — Istaklar, orzular va muloyimlik
        // ============================================================
        {
            id: 'b1_3',
            number: 3,
            title: 'Konjunktiv II — Istaklar va muloyimlik',
            germanTitle: 'Der Konjunktiv II (Wünsche, Träume, Höflichkeit und Ratschläge)',
            icon: '✨',
            description: 'Noreal istaklar, xayoliy shartlar, o\'ta muloyim iltimoslar va do\'stona maslahatlar: wäre, hätte, würde + Infinitiv, könnte va sollte.',
            theory: {
                summary: 'Konjunktiv II — voqelikda mavjud bo\'lmagan, lekin orzu qilingan yoki faraz qilinayotgan holatlarni ("agar shunday bo\'lganida edi..."), o\'ta muloyim iltimoslarni ("menga qila olarmidingiz?") va maslahatlarni ("sen shunday qilishing kerak edi") ifodalash uchun xizmat qiladi.',
                sections: [
                    {
                        heading: '1. wäre va hätte shakllari (sein va haben fe\'llari uchun)',
                        content: '<p><em>sein</em> va <em>haben</em> fe\'llari uchun <em>würde</em> konstruktsiyasi ishlatilmaydi! Ularning o\'z maxsus Konjunktiv II shakllari bor:</p>' +
                            '<ul>' +
                            '<li><strong>wäre (sein):</strong> ich wäre, du wär(e)st, er wäre, wir wären, ihr wärt, sie/Sie wären &mdash; <em>bo\'lganimda edi / bo\'lsam edi</em></li>' +
                            '<li><strong>hätte (haben):</strong> ich hätte, du hättest, er hätte, wir hätten, ihr hättet, sie/Sie hätten &mdash; <em>menda bo\'lganida edi / bo\'lsa edi</em></li>' +
                            '</ul>' +
                            '<p>Noreal shart gaplarda (Konditionalsatz) ikkala qismda ham Konjunktiv II qo\'llaniladi:</p>' +
                            '<p><em>Wenn ich reich <strong>wäre</strong>, <strong>hätte</strong> ich eine Villa am Meer.</em> (Agar boy bo\'lganimda, dengiz bo\'yida villam bo\'lardi).</p>',
                        examples: [
                            { de: 'Wenn ich doch nur mehr Freizeit hätte!', uz: 'Qaniydi menda ko\'proq bo\'sh vaqt bo\'lsa edi!', tip: 'hätte = orzu-istak ifodasi' },
                            { de: 'Ich wäre jetzt so gern im Urlaub am Strand.', uz: 'Hozir sohil bo\'yida ta\'tilda bo\'lishni juda ham xohlardim.', tip: 'wäre = bo\'lsam edi' },
                            { de: 'Wenn das Wetter besser wäre, könnten wir spazieren gehen.', uz: 'Agar ob-havo yaxshiroq bo\'lganida, sayrga chiqa olardik.', tip: 'noreal shart gap' }
                        ]
                    },
                    {
                        heading: '2. würde + Infinitiv konstruktsiyasi (Asosiy fe\'llar uchun)',
                        content: '<p>Nemis tilidagi deyarli barcha boshqa fe\'llar uchun Konjunktiv II <strong>würde + asosiy fe\'lning infinitivi</strong> (gap oxirida) orqali yasaladi:</p>' +
                            '<ul>' +
                            '<li><strong>ich würde</strong> machen / reisen / kaufen</li>' +
                            '<li><strong>du würdest</strong> ...</li>' +
                            '<li><strong>er / sie / es würde</strong> ...</li>' +
                            '<li><strong>wir würden</strong> ...</li>' +
                            '<li><strong>ihr würdet</strong> ...</li>' +
                            '<li><strong>sie / Sie würden</strong> ...</li>' +
                            '</ul>' +
                            '<p><strong>Muloyim iltimos (Höfliche Bitte):</strong> Kundalik hayotda yoki restoranda, do\'konda juda muloyim gapirish uchun <em>würden</em> ishlatiladi:</p>' +
                            '<p><em><strong>Würden</strong> Sie mir bitte das Salz <strong>geben</strong>?</em> (Iltimos, menga tuzni uzatib yubora olmaysizmi?)</p>',
                        examples: [
                            { de: 'Würden Sie bitte das Fenster schließen? Es zieht.', uz: 'Iltimos, derazani yopib yubora olmaysizmi? Shamol esyapti.', tip: 'Muloyim iltimos: würden + Infinitiv' },
                            { de: 'Ich würde gern ein Glas Apfelsaft trinken.', uz: 'Bir stakan olma sharbati ichgan bo\'lardim.', tip: 'xushmuomala buyurtma' },
                            { de: 'An deiner Stelle würde ich sofort Deutsch lernen.', uz: 'Sening o\'rningda bo\'lganimda, darhol nemis tilini o\'rgangan bo\'lardim.', tip: 'an deiner Stelle = sening o\'rningda' }
                        ]
                    },
                    {
                        heading: '3. Modal fe\'llar Konjunktiv II da: könnte va sollte',
                        content: '<p>Modal fe\'llar ham <em>würde</em> olmasdan, o\'ziga xos Konjunktiv II shakliga ega bo\'ladi:</p>' +
                            '<ul>' +
                            '<li>können &rarr; <strong>könnte</strong> (qila olgan bo\'lardi / iltimoslarda: qila olasizmi?)</li>' +
                            '<li>sollen &rarr; <strong>sollte</strong> (qilishi kerak edi / qilsangiz yaxshi bo\'lardi &mdash; <strong>maslahat berish</strong>)</li>' +
                            '<li>dürfen &rarr; <strong>dürfte</strong> (ehtimol / taxmin qilishda)</li>' +
                            '<li>müssen &rarr; <strong>müsste</strong> (to\'g\'ri kelgan bo\'lardi)</li>' +
                            '</ul>' +
                            '<p><strong>Maslahat berish (Ratschläge geben):</strong></p>' +
                            '<p><em>Du siehst sehr müde aus. Du <strong>solltest</strong> früher schlafen gehen.</em> (Charchagan ko\'rinasan. Barvaqtroq uxlashga yotishing kerak edi).</p>' +
                            '<p><strong>Muloyim so\'rov:</strong> <em><strong>Könnten</strong> Sie mir bitte helfen?</em> (Menga yordam bera olarmidingiz?)</p>',
                        examples: [
                            { de: 'Könnten Sie mir bitte sagen, wie spät es ist?', uz: 'Iltimos, menga soat necha bo\'lganini ayta olmaysizmi?', tip: 'könnten = o\'ta muloyim iltimos' },
                            { de: 'Du hast Halsschmerzen? Du solltest heißen Tee trinken.', uz: 'Tomog\'ing og\'riyaptimi? Issiq choy ichishing kerak edi.', tip: 'sollte = do\'stona maslahat' },
                            { de: 'Wir könnten am Wochenende zusammen ins Kino gehen.', uz: 'Dam olish kunlari birga kinoga borsak bo\'lardi.', tip: 'taklif bildirish' }
                        ]
                    }
                ],
                keyRules: [
                    'sein va haben fe\'llari bilan "würde" qo\'shilmaydi; faqat "wäre" va "hätte" ishlatiladi.',
                    'Oddiy fe\'llar uchun "würde + Infinitiv" qolipi ishlatiladi va asosiy fe\'l gapning eng oxiriga suriladi.',
                    'Maslahat berishda (Ratschlag) eng ko\'p "sollte" fe\'li qo\'llaniladi: "Du solltest zum Arzt gehen".',
                    'Muloyim iltimoslar uchun "Könnten Sie...?" va "Würden Sie...?" shakllari eng nafis uslub hisoblanadi.'
                ]
            },
            flashcards: [
                { front: 'ich wäre', back: 'bo\'lganimda edi / bo\'lsam edi', tip: 'sein fe\'lining Konjunktiv II shakli' },
                { front: 'ich hätte', back: 'menda bo\'lganida edi / bo\'lsa edi', tip: 'haben fe\'lining Konjunktiv II shakli' },
                { front: 'ich würde gern...', back: '...ishni xohlardim / qilgan bo\'lardim', tip: 'würde + gern + Infinitiv' },
                { front: 'Könnten Sie...?', back: 'Qila olarmidingiz? / Qila olasizmi?', tip: 'o\'ta muloyim so\'rov' },
                { front: 'Würden Sie...?', back: 'Bajarib bera olmaysizmi?', tip: 'o\'ta muloyim iltimos' },
                { front: 'du solltest...', back: 'sen shunday qilishing kerak edi', tip: 'maslahat berish ifodasi' },
                { front: 'an deiner Stelle', back: 'sening o\'rningda bo\'lganimda', tip: 'An deiner Stelle würde ich...' },
                { front: 'ich hätte gern...', back: 'men mamnuniyat bilan olgan bo\'lardim', tip: 'Ich hätte gern einen Kaffee' },
                { front: 'Wenn ich Zeit hätte,...', back: 'Agar vaqtim bo\'lganida edi,...', tip: 'noreal shart gap boshlanishi' },
                { front: 'Wenn ich du wäre,...', back: 'Agar men sening o\'rningda bo\'lsam,...', tip: 'Wenn ich du wäre, würde ich lernen' },
                { front: 'könnte (können)', back: 'qila olar edi / imkoni bo\'lardi', tip: 'können -> könnte' },
                { front: 'müsste (müssen)', back: 'to\'g\'ri kelgan bo\'lardi', tip: 'müssen -> müsste' },
                { front: 'dürfte ich...?', back: 'ruxsat bersangiz... / mumkinmi?', tip: 'Dürfte ich etwas fragen?' },
                { front: 'Es wäre toll / schön', back: 'Ajoyib / chiroyli bo\'lgan bo\'lardi', tip: 'Es wäre toll, wenn du kommst' }
            ],
            test: [
                {
                    q: 'Hozirgi zamon orzu-istaklarini ifodalashda "haben" fe\'lining Konjunktiv II shakli qaysi?',
                    options: [
                        'habe',
                        'hatte',
                        'hätte',
                        'würde haben'
                    ],
                    answer: 2,
                    explanation: 'haben ning Konjunktiv II shakli "hätte" bo\'ladi (ich hätte gern mehr Zeit).'
                },
                {
                    q: '"sein" fe\'lining "ich" uchun Konjunktiv II shakli qaysi?',
                    options: [
                        'bin',
                        'war',
                        'wäre',
                        'würde sein'
                    ],
                    answer: 2,
                    explanation: 'sein ning Konjunktiv II si "wäre" bo\'ladi (Wenn ich reich wäre...).'
                },
                {
                    q: 'Asosiy (mustaqil) fe\'llar bilan Konjunktiv II odatda qanday yasaladi?',
                    options: [
                        'haben + Partizip II',
                        'würde + Infinitiv',
                        'werden + Partizip II',
                        'sein + Infinitiv'
                    ],
                    answer: 1,
                    explanation: 'Deyarli barcha asosiy fe\'llar uchun "würde + Infinitiv" qolipi ishlatiladi.'
                },
                {
                    q: 'Muloyim iltimos: "___ Sie mir bitte das Salz geben?" Bo\'sh o\'ringa mos fe\'lni qo\'ying:',
                    options: [
                        'Würden',
                        'Werden',
                        'Wurden',
                        'Hätten'
                    ],
                    answer: 0,
                    explanation: 'Muloyim iltimoslarda "Würden Sie bitte... geben?" konstruksiyasi ishlatiladi.'
                },
                {
                    q: 'Boshqalarga maslahat berishda (Ratschlag) eng ko\'p qaysi Konjunktiv II fe\'li ishlatiladi?',
                    options: [
                        'sollte',
                        'könnte',
                        'müsste',
                        'dürfte'
                    ],
                    answer: 0,
                    explanation: '"sollte" maslahat berish uchun maxsus xizmat qiladi: Du solltest mehr schlafen.'
                },
                {
                    q: '"An deiner Stelle ___ ich mehr für die Deutschprüfung lernen." Bo\'sh o\'ringa mos fe\'l:',
                    options: [
                        'würde',
                        'werde',
                        'wurde',
                        'habe'
                    ],
                    answer: 0,
                    explanation: '"An deiner Stelle würde ich..." = sening o\'rningda bo\'lganimda ... qilgan bo\'lardim.'
                },
                {
                    q: '"Könnten Sie mir bitte helfen?" jumlasining aniq ma\'nosi nima?',
                    options: [
                        'Menga yordam bera olarmidingiz? (o\'ta muloyim iltimos)',
                        'Siz menga kecha yordam berdingiz',
                        'Siz menga yordam berishingiz shart',
                        'Siz menga yordam bermoqchisiz'
                    ],
                    answer: 0,
                    explanation: '"Könnten Sie...?" bu "Können Sie...?" ning yanada muloyim, xushmuomala shaklidir.'
                },
                {
                    q: '"Wenn ich reich ___, ___ ich eine Weltreise machen." Bo\'sh o\'rinlarni to\'ldiring:',
                    options: [
                        'wäre / würde',
                        'bin / werde',
                        'war / wurde',
                        'hätte / würde'
                    ],
                    answer: 0,
                    explanation: 'Noreal shart gap: Wenn ich reich wäre, würde ich eine Weltreise machen.'
                },
                {
                    q: 'Qaysi gapda xato yoki noo\'rin shakl ishlatilgan?',
                    options: [
                        'Ich würde gern ein Auto haben.',
                        'Ich hätte gern ein neues Auto.',
                        'Wenn ich Zeit hätte, käme ich zu dir.',
                        'Ich wäre jetzt so gern im Urlaub.'
                    ],
                    answer: 0,
                    explanation: 'haben bilan "würde haben" ishlatilmaydi; uning o\'rniga to\'g\'ridan-to\'g\'ri "hätte" ishlatilishi shart.'
                },
                {
                    q: '"Du siehst sehr müde aus. Du ___ früher ins Bett gehen." (Maslahat):',
                    options: [
                        'solltest',
                        'wirst',
                        'konntest',
                        'musstest'
                    ],
                    answer: 0,
                    explanation: 'Maslahat berishda "solltest" qo\'llanadi: Du solltest früher ins Bett gehen.'
                }
            ],
            gamePairs: [
                { de: 'ich wäre', uz: 'bo\'lganimda edi' },
                { de: 'ich hätte', uz: 'menda bo\'lganida edi' },
                { de: 'ich würde reisen', uz: 'sayohat qilgan bo\'lardim' },
                { de: 'Könnten Sie...?', uz: 'Qila olarmidingiz?' },
                { de: 'Würden Sie...?', uz: 'Bajarib berarmidingiz?' },
                { de: 'du solltest', uz: 'qilishing kerak edi (maslahat)' },
                { de: 'an deiner Stelle', uz: 'sening o\'rningda bo\'lganimda' },
                { de: 'ich hätte gern', uz: 'mamnuniyat bilan olardim' }
            ]
        },

        // ============================================================
        // MAVZU 4: Majhul nisbat — Passiv
        // ============================================================
        {
            id: 'b1_4',
            number: 4,
            title: 'Majhul nisbat — Passiv',
            germanTitle: 'Das Passiv (Vorgangspassiv in Präsens und Präteritum)',
            icon: '⚙️',
            description: 'Harakat bajaruvchisi emas, harakatning o\'zi muhim bo\'lgan tuzilma: werden + Partizip II, von (Dativ) va durch (Akkusativ) agentlari.',
            theory: {
                summary: 'Passiv (majhul nisbat) harakatni kim bajarganidan ko\'ra, aynan qanday jarayon yoki harakat amalga oshirilayotganiga e\'tibor qaratilganda ishlatiladi. Masalan: "Mashina ta\'mirlanmoqda" (kim ta\'mirlayotgani muhim emas yoki noma\'lum). Nemis tilida Passiv gazeta, yangiliklar, yo\'riqnomalar va ilmiy matnlarda juda keng qo\'llaniladi.',
                sections: [
                    {
                        heading: '1. Passiv Präsens (Hozirgi zamon majhul nisbati)',
                        content: '<p>Passiv Präsens formulasi:</p>' +
                            '<p style="font-size:1.1em; text-align:center; padding:8px; background:var(--bg-card); border-radius:6px;"><strong>werden (tuslangan) + ... + Partizip II (gap oxirida)</strong></p>' +
                            '<p><strong>werden fe\'lining Präsensda tuslanishi:</strong>' +
                            ' ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden.</p>' +
                            '<p><strong>Aktiv gapdan Passiv gap hosil qilish:</strong>' +
                            ' Aktiv gapdagi Akkusativ to\'ldiruvchi Passiv gapda Nominativ egaga aylanadi:</p>' +
                            '<ul>' +
                            '<li>Aktiv: <em>Der Mechaniker repariert <strong>das Auto</strong>.</em></li>' +
                            '<li>Passiv: <em><strong>Das Auto</strong> wird (vom Mechaniker) repariert.</em></li>' +
                            '</ul>',
                        examples: [
                            { de: 'In Deutschland wird sehr viel Kaffee getrunken.', uz: 'Germaniyada juda ko\'p qahva ichiladi.', tip: 'wird + getrunken (jarayon muhim)' },
                            { de: 'Die E-Mails werden jeden Morgen pünktlich beantwortet.', uz: 'Elektron xatlarga har kuni ertalab o\'z vaqtida javob beriladi.', tip: 'werden + beantwortet (ko\'plik)' },
                            { de: 'Der Patient wird gerade vom Chefarzt untersucht.', uz: 'Bemor ayni daqiqada bosh shifokor tomonidan tekshirilmoqda.', tip: 'wird + untersucht' }
                        ]
                    },
                    {
                        heading: '2. Passiv Präteritum (O\'tgan zamon majhul nisbati)',
                        content: '<p>Tarixiy voqealarni bayon qilishda yoki rasmiy hisobotlarda Passiv Präteritum juda ko\'p uchraydi:</p>' +
                            '<p style="font-size:1.1em; text-align:center; padding:8px; background:var(--bg-card); border-radius:6px;"><strong>wurde / wurden + ... + Partizip II (gap oxirida)</strong></p>' +
                            '<ul>' +
                            '<li>ich wurde, du wurdest, er/sie/es <strong>wurde</strong></li>' +
                            '<li>wir <strong>wurden</strong>, ihr wurdet, sie/Sie <strong>wurden</strong></li>' +
                            '</ul>' +
                            '<p><strong>Diqqat!</strong> Umlautga e\'tibor bering: <em>wurde</em> (nuqtasiz) bu Passiv Präteritum ("qilindi"), <em>würde</em> (nuqtali) esa Konjunktiv II ("qilgan bo\'lardi"). Bu ikkisini aslo adashtirmang!</p>',
                        examples: [
                            { de: 'Das Brandenburger Tor wurde im Jahr 1791 fertiggestellt.', uz: 'Brandenburg darvozasi 1791-yilda qurib bitkazilgan.', tip: 'wurde + fertiggestellt' },
                            { de: 'Das alte Gebäude wurde letztes Jahr komplett renoviert.', uz: 'Eski bino o\'tgan yili to\'liq ta\'mirlandi.', tip: 'wurde + renoviert' },
                            { de: 'Die Verletzten wurden sofort ins Krankenhaus gebracht.', uz: 'Yaralanganlar zudlik bilan kasalxonaga olib borildi.', tip: 'wurden + gebracht (ko\'plik)' }
                        ]
                    },
                    {
                        heading: '3. Harakat bajaruvchisini ko\'rsatish: von va durch',
                        content: '<p>Agar harakat kim yoki nima tomonidan bajarilganini ta\'kidlash zarur bo\'lsa, quyidagi predloglar qo\'yiladi:</p>' +
                            '<ul>' +
                            '<li><strong>von + Dativ:</strong> Harakat tirik mavjudot, shaxs yoki muassasa/tashkilot tomonidan bevosita bajarilganda:' +
                            '<br><em>Das Buch wurde <strong>von einem berühmten Autor</strong> geschrieben.</em></li>' +
                            '<li><strong>durch + Akkusativ:</strong> Harakat vosita, vositachi sabab yoki tabiiy hodisa orqali yuz berganda:' +
                            '<br><em>Das Haus wurde <strong>durch den Sturm</strong> beschädigt.</em></li>' +
                            '</ul>' +
                            '<p>Agar aktiv gapda <strong>man</strong> (noaniq shaxs) bo\'lsa, Passivga o\'girilganda u butunlay tushib qoladi:' +
                            '<br><em>Man spricht hier Deutsch. &rarr; Hier wird Deutsch gesprochen.</em></p>',
                        examples: [
                            { de: 'Die Symphonie wurde von Ludwig van Beethoven komponiert.', uz: 'Simfoniya Lyudvig van Betxoven tomonidan bastalangan.', tip: 'von + Dativ (shaxs bajaruvchi)' },
                            { de: 'Die Stadt wurde durch das schwere Erdbeben zerstört.', uz: 'Shahar kuchli zilzila tufayli vayron bo\'ldi.', tip: 'durch + Akkusativ (tabiiy hodisa/sabab)' },
                            { de: 'Hier wird nicht geraucht!', uz: 'Bu yerda chekilmaydi! (man raucht hier nicht)', tip: 'man tushib qoladi' }
                        ]
                    }
                ],
                keyRules: [
                    'Passiv formulasi har doim "werden + Partizip II" ko\'rinishida bo\'lib, Partizip II gap oxirida turadi.',
                    'Aktiv gapdagi Akkusativ to\'ldiruvchi Passiv gapda Nominativ egaga aylanadi.',
                    'Adashtirmang: "wurde" (nuqtasiz) — Passiv Präteritum ("qilindi"), "würde" (nuqtali) — Konjunktiv II.',
                    'Bajaruvchi shaxs uchun "von + Dativ", sabab yoki vositachi omillar uchun "durch + Akkusativ" ishlatiladi.'
                ]
            },
            flashcards: [
                { front: 'wird gebaut', back: 'qurilmoqda (Passiv Präsens)', tip: 'werden + Partizip II' },
                { front: 'wurde repariert', back: 'ta\'mirlandi (Passiv Präteritum)', tip: 'wurde + Partizip II' },
                { front: 'werden gereinigt', back: 'tozalanmoqda (ko\'plik)', tip: 'Die Zimmer werden gereinigt' },
                { front: 'wurden gerettet', back: 'qutqarildilar (o\'tgan zamon ko\'plik)', tip: 'Die Tiere wurden gerettet' },
                { front: 'von + Dativ', back: '... tomonidan (shaxs yoki tashkilot)', tip: 'vom Arzt, von der Polizei' },
                { front: 'durch + Akkusativ', back: 'orqali / tufayli (vosita, sabab)', tip: 'durch das Feuer, durch die Medien' },
                { front: 'wird gekocht', back: 'pishirilmoqda', tip: 'Das Essen wird gekocht' },
                { front: 'wurde gegründet', back: 'asos solindi / tashkil etildi', tip: 'Die Firma wurde 1990 gegründet' },
                { front: 'wird eröffnet', back: 'ochilmoqda / ochiladi', tip: 'Das Geschäft wird morgen eröffnet' },
                { front: 'wurde gestohlen', back: 'o\'g\'irlandi', tip: 'Mein Fahrrad wurde gestern gestohlen' },
                { front: 'wird eingeladen', back: 'taklif qilinmoqda', tip: 'Er wird zur Feier eingeladen' },
                { front: 'wurde operiert', back: 'operatsiya qilindi', tip: 'Der Patient wurde operiert' },
                { front: 'wird bezahlt', back: 'to\'lanmoqda', tip: 'Die Rechnung wird sofort bezahlt' },
                { front: 'Hier wird gearbeitet', back: 'Bu yerda ish olib borilmoqda', tip: 'Egasiz passiv tuzilma' }
            ],
            test: [
                {
                    q: 'Passiv Präsens (hozirgi zamon majhul nisbati) qanday formulaga ega?',
                    options: [
                        'werden + Partizip II',
                        'haben + Partizip II',
                        'sein + Infinitiv',
                        'wurden + Infinitiv'
                    ],
                    answer: 0,
                    explanation: 'Passiv Präsens = werden ning tuslangan shakli + asosiy fe\'lning Partizip II shakli.'
                },
                {
                    q: '"Der Mechaniker repariert das Auto." gapini to\'g\'ri Passivga aylantiring:',
                    options: [
                        'Das Auto wird vom Mechaniker repariert.',
                        'Das Auto hat der Mechaniker repariert.',
                        'Das Auto wurde repariert werden.',
                        'Der Mechaniker wird repariert.'
                    ],
                    answer: 0,
                    explanation: 'das Auto ega bo\'ladi + wird + vom Mechaniker + repariert.'
                },
                {
                    q: 'Passiv Präteritumda (o\'tgan zamonda) yordamchi fe\'l qaysi shaklda bo\'ladi?',
                    options: [
                        'wurde / wurden',
                        'würde / würden',
                        'war / waren',
                        'hatte / hatten'
                    ],
                    answer: 0,
                    explanation: 'werden ning Präteritumi "wurde" (birlik) va "wurden" (ko\'plik) bo\'ladi.'
                },
                {
                    q: '"Das Brandenburger Tor ___ 1791 erbaut." Nuqtalar o\'rniga mos Passiv Präteritum shaklini qo\'ying:',
                    options: [
                        'wurde',
                        'würde',
                        'worden',
                        'wird'
                    ],
                    answer: 0,
                    explanation: 'Tarixiy fakt uchun o\'tgan zamon majhul nisbati "wurde" ishlatiladi.'
                },
                {
                    q: 'Harakat bajaruvchisi shaxs bo\'lganda, Passivda qaysi predlog ishlatiladi?',
                    options: [
                        'von + Dativ',
                        'durch + Akkusativ',
                        'mit + Dativ',
                        'für + Akkusativ'
                    ],
                    answer: 0,
                    explanation: 'Shaxs yoki bevosita muassasa bajaruvchi bo\'lsa, "von + Dativ" ishlatiladi.'
                },
                {
                    q: 'Harakat vosita, sabab yoki tabiiy omil orqali yuz berganda qaysi predlog qo\'yiladi?',
                    options: [
                        'durch + Akkusativ',
                        'von + Dativ',
                        'aus + Dativ',
                        'über + Akkusativ'
                    ],
                    answer: 0,
                    explanation: 'Vosita va sabablar uchun "durch + Akkusativ" ishlatiladi (durch den Sturm, durch das Internet).'
                },
                {
                    q: '"Hier ___ Deutsch gesprochen." (Bu yerda nemischa gapiriladi). To\'g\'ri shaklni toping:',
                    options: [
                        'wird',
                        'werden',
                        'ist',
                        'hat'
                    ],
                    answer: 0,
                    explanation: 'Birlikda Passiv Präsens: Hier wird Deutsch gesprochen.'
                },
                {
                    q: '"Die Rechnungen ___ gestern bezahlt." (Hisoblar kecha to\'landi — ko\'plik):',
                    options: [
                        'wurden',
                        'wurde',
                        'worden',
                        'werden'
                    ],
                    answer: 0,
                    explanation: 'die Rechnungen ko\'plikda bo\'lgani uchun Präteritumda "wurden" bo\'ladi.'
                },
                {
                    q: 'Aktiv gapdagi qaysi bo\'lak Passiv gapda Nominativ egaga aylanadi?',
                    options: [
                        'Akkusativ to\'ldiruvchi',
                        'Dativ to\'ldiruvchi',
                        'Predlogli birikma',
                        'Hol'
                    ],
                    answer: 0,
                    explanation: 'Faqatgina Akkusativ to\'ldiruvchi (vositasiz to\'ldiruvchi) passiv gapning egasiga aylanadi.'
                },
                {
                    q: '"wurde" va "würde" so\'zlarining farqi nimada?',
                    options: [
                        '"wurde" — Passiv Präteritum (qilindi), "würde" — Konjunktiv II (qilgan bo\'lardi)',
                        '"wurde" — kelasi zamon, "würde" — o\'tgan zamon',
                        'Ikkisi aynan bir xil ma\'noni bildiradi',
                        '"würde" — Passiv, "wurde" — buyruq mayli'
                    ],
                    answer: 0,
                    explanation: '"wurde" (nuqtasiz) Passiv o\'tgan zamon, "würde" (nuqtali) esa Konjunktiv II maylidir.'
                }
            ],
            gamePairs: [
                { de: 'wird gebaut', uz: 'qurilmoqda (Präsens)' },
                { de: 'wurde repariert', uz: 'ta\'mirlandi (Präteritum)' },
                { de: 'werden gereinigt', uz: 'tozalanmoqda (ko\'plik)' },
                { de: 'wurden gerettet', uz: 'qutqarildi (ko\'plik Prät)' },
                { de: 'vom Arzt', uz: 'shifokor tomonidan (von)' },
                { de: 'durch den Wind', uz: 'shamol vositasida (durch)' },
                { de: 'wird gekocht', uz: 'pishirilmoqda' },
                { de: 'wurde gegründet', uz: 'asos solingan' }
            ]
        },

        // ============================================================
        // MAVZU 5: Infinitiv konstruktsiyalari: 'zu' va 'um...zu'
        // ============================================================
        {
            id: 'b1_5',
            number: 5,
            title: 'Infinitiv konstruktsiyalari',
            germanTitle: 'Infinitivsätze (Infinitiv mit "zu", "um...zu", "ohne...zu", "statt...zu")',
            icon: '🎯',
            description: 'Fe\'lning noaniq shakli bilan gap tuzish: "zu" yuklamasi, maqsad (um...zu), inkor (ohne...zu) va o\'rniga (statt...zu) ifodalari.',
            theory: {
                summary: 'Infinitiv konstruktsiyalari ikki gapdagi ega (subyekt) bir xil shaxs bo\'lganda nutqni ixcham, chiroyli va ravon qilish imkonini beradi. B1 darajasida ayniqsa maqsadni ifodalovchi "um...zu", bajarmaslikni bildiruvchi "ohne...zu" va muqobillikni ko\'rsatuvchi "statt...zu" konstruktsiyalari hal qiluvchi ahamiyatga ega.',
                sections: [
                    {
                        heading: '1. Infinitiv mit "zu" (Qachon "zu" qo\'yiladi va qachon qo\'yilmaydi)',
                        content: '<p>Quyidagi hollarda ikkinchi fe\'l oldidan <strong>zu</strong> yuklamasi qo\'yiladi:</p>' +
                            '<ul>' +
                            '<li>Muayyan fe\'llardan keyin: <em>versuchen</em> (harakat qilmoq), <em>planen</em> (rejalashtirmoq), <em>vergessen</em> (unutmoq), <em>versprechen</em> (va\'da bermoq), <em>hoffen</em> (umid qilmoq), <em>vorhaben</em> (niyat qilmoq).</li>' +
                            '<li>Sifatlardan keyin: <em>Es ist wichtig / gesund / verboten / schwer / leicht ... <strong>zu</strong> lernen.</em></li>' +
                            '<li>Ot birikmalaridan keyin: <em>Lust haben</em> (havasi kelmoq), <em>Zeit haben</em> (vaqti bo\'lmoq), <em>Angst haben</em> (qo\'rqmoq) ... <strong>zu</strong> machen.</li>' +
                            '</ul>' +
                            '<p><strong>Ajraladigan fe\'llar:</strong> "zu" prefiks va o\'zak orasiga kiradi: <em>an-<strong>zu</strong>-rufen</em>, <em>ein-<strong>zu</strong>-kaufen</em>, <em>auf-<strong>zu</strong>-stehen</em>.</p>' +
                            '<p><strong>Qachon "zu" ISHLATILMAYDI:</strong> Modal fe\'llar (<em>können, müssen, dürfen, wollen, sollen, möchten</em>), harakat fe\'llari (<em>gehen, fahren</em>) va his-tuyg\'u fe\'llari (<em>sehen, hören</em>) bilan hech qachon "zu" ishlatilmaydi!</p>',
                        examples: [
                            { de: 'Ich habe vor, dieses Jahr die B1-Prüfung zu bestehen.', uz: 'Men bu yil B1 imtihonini topshirishni niyat qilganman.', tip: 'vorhaben ... zu bestehen' },
                            { de: 'Vergiss bitte nicht, mich heute Abend anzurufen!', uz: 'Iltimos, bugun kechqurun menga qo\'ng\'iroq qilishni unutma!', tip: 'an-zu-rufen (ajraladigan fe\'l)' },
                            { de: 'Es ist verboten, in diesem Gebäude zu rauchen.', uz: 'Ushbu binoda chekish taqiqlangan.', tip: 'Es ist verboten ... zu rauchen' }
                        ]
                    },
                    {
                        heading: '2. um ... zu + Infinitiv (Maqsad konstruktsiyasi)',
                        content: '<p><em>"Wozu?"</em> (Nima maqsadda?) savoliga javob beradi va <strong>"...ish uchun / ...moq uchun"</strong> degan ma\'noni anglatadi.</p>' +
                            '<p><strong>Eng muhim shart:</strong> Asosiy gap va infinitiv gapning <strong>egasi BIR XIL shaxs bo\'lishi shart</strong>!</p>' +
                            '<p><em>Ich lerne Deutsch. Ich möchte in Deutschland studieren.</em><br>' +
                            '&rarr; <em>Ich lerne Deutsch, <strong>um</strong> in Deutschland <strong>zu</strong> studieren.</em></p>',
                        examples: [
                            { de: 'Er spart jeden Monat Geld, um sich ein neues Auto zu kaufen.', uz: 'U o\'ziga yangi mashina sotib olish uchun har oy pul tejamoqda.', tip: 'um ... zu kaufen' },
                            { de: 'Ich stehe früh auf, um den ersten Bus nicht zu verpassen.', uz: 'Birinchi avtobusni o\'tkazib yubormaslik uchun erta turaman.', tip: 'um ... nicht zu verpassen' },
                            { de: 'Sie treibt regelmäßig Sport, um gesund und fit zu bleiben.', uz: 'U sog\'lom va tetik qolish uchun muntazam sport bilan shug\'ullanadi.', tip: 'um ... fit zu bleiben' }
                        ]
                    },
                    {
                        heading: '3. ohne ... zu va anstatt ... zu konstruktsiyalari',
                        content: '<p>Ushbu ikki konstruktsiya ham B1 imtihonida juda yuqori baholanadi:</p>' +
                            '<ul>' +
                            '<li><strong>ohne ... zu + Infinitiv:</strong> <em>"...masdan / ...magan holda"</em> (kutilgan ish qilinmaganligini bildiradi):' +
                            '<br><em>Er ging an mir vorbei, <strong>ohne</strong> mich <strong>zu</strong> grüßen.</em> (U menga salom ham bermasdan yonimdan o\'tib ketdi).</li>' +
                            '<li><strong>(an)statt ... zu + Infinitiv:</strong> <em>"...ish o\'rniga / ...o\'rniga"</em> (bajarilishi kerak bo\'lgan ish qilinmay boshqa ish qilinganda):' +
                            '<br><em><strong>Statt</strong> die Hausaufgaben <strong>zu</strong> machen, spielte er Computerspiele.</em> (Vazifalarni bajarish o\'rniga u kompyuter o\'yinlarini o\'ynadi).</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Sie verließ das Zimmer, ohne ein einziges Wort zu sagen.', uz: 'U bitta ham so\'z aytmasdan xonani tark etdi.', tip: 'ohne ... zu sagen = aytmasdan' },
                            { de: 'Statt zum Arzt zu gehen, nahm er einfach Schmerzmittel.', uz: 'Shifokorga borish o\'rniga u shunchaki og\'riq qoldiruvchi dori ichdi.', tip: 'statt ... zu gehen = borish o\'rniga' },
                            { de: 'Er hat den Vertrag unterschrieben, ohne ihn genau zu lesen.', uz: 'U shartnomani diqqat bilan o\'qib chiqmasdan imzolab yubordi.', tip: 'ohne ... zu lesen' }
                        ]
                    }
                ],
                keyRules: [
                    'Modal fe\'llar (können, müssen...) va harakat fe\'llari (gehen, fahren...) bilan "zu" HECH QACHON ishlatilmaydi.',
                    'Ajraladigan prefiksli fe\'llarda "zu" yuklamasi prefiks va o\'zak orasiga kiradi: an-zu-rufen, ein-zu-kaufen.',
                    '"um...zu" (maqsad), "ohne...zu" (inkor) va "statt...zu" (o\'rniga) qoliplarida ikkala gapning egasi bir xil bo\'lishi shart.',
                    'Infinitiv fe\'l "zu" bilan birga har doim gapning eng oxirgi o\'rnida turadi.'
                ]
            },
            flashcards: [
                { front: 'um ... zu + Infinitiv', back: '...ish uchun / ...moq maqsadida', tip: 'um Deutsch zu lernen' },
                { front: 'ohne ... zu + Infinitiv', back: '...masdan / ...magan holda', tip: 'ohne ein Wort zu sagen' },
                { front: 'statt ... zu + Infinitiv', back: '...ish o\'rniga', tip: 'statt zu schlafen' },
                { front: 'vorhaben ... zu', back: '...ishni rejalashtirmoq / niyat qilmoq', tip: 'Ich habe vor zu reisen' },
                { front: 'versuchen ... zu', back: '...ishga harakat qilmoq / urinmoq', tip: 'Ich versuche zu helfen' },
                { front: 'vergessen ... zu', back: '...ishni unutib qo\'ymoq', tip: 'Vergiss nicht anzurufen' },
                { front: 'hoffen ... zu', back: '...ishga umid qilmoq', tip: 'Ich hoffe zu bestehen' },
                { front: 'Es ist wichtig ... zu', back: '...ish muhim', tip: 'Es ist wichtig zu lernen' },
                { front: 'Es ist verboten ... zu', back: '...ish taqiqlangan', tip: 'Es ist verboten hier zu parken' },
                { front: 'Lust haben ... zu', back: '...ishga havasi/istagi bo\'lmoq', tip: 'Ich habe Lust ins Kino zu gehen' },
                { front: 'Zeit haben ... zu', back: '...ishga vaqti bo\'lmoq', tip: 'Ich habe keine Zeit zu kochen' },
                { front: 'aufzustehen', back: 'o\'rnidan turmoq (Infinitiv mit zu)', tip: 'auf + zu + stehen' },
                { front: 'einzukaufen', back: 'bozorlik qilmoq (Infinitiv mit zu)', tip: 'ein + zu + kaufen' },
                { front: 'anzurufen', back: 'qo\'ng\'iroq qilmoq (Infinitiv mit zu)', tip: 'an + zu + rufen' }
            ],
            test: [
                {
                    q: 'Qaysi fe\'llar guruhidan keyin ikkinchi fe\'l bilan "zu" ISHLATILMAYDI?',
                    options: [
                        'Modal fe\'llar (können, müssen, wollen, dürfen...)',
                        'Umid va reja fe\'llari (hoffen, planen)',
                        'Sifat birikmalari (es ist wichtig, es ist gesund)',
                        'Ot birikmalari (Lust haben, Zeit haben)'
                    ],
                    answer: 0,
                    explanation: 'Modal fe\'llardan so\'ng "zu" yuklamasi ishlatilmaydi (Ich kann Deutsch sprechen).'
                },
                {
                    q: 'Ajraladigan fe\'llarda "zu" yuklamasi qayerga qo\'yiladi?',
                    options: [
                        'Prefiks va fe\'l o\'zagi o\'rtasiga (auf-zu-stehen)',
                        'Fe\'ldan keyin alohida',
                        'Prefiksdan ham oldinga (zu-aufstehen)',
                        'Gapning eng boshiga'
                    ],
                    answer: 0,
                    explanation: 'Ajraluvchi fe\'llarda "zu" prefiks va o\'zak orasiga qo\'shiladi: an-zu-rufen, ein-zu-kaufen.'
                },
                {
                    q: '"um ... zu + Infinitiv" konstruktsiyasi qanday ma\'noni bildiradi?',
                    options: [
                        'Maqsad (...ish uchun / ...moq uchun)',
                        'Inkor (...masdan)',
                        'Zidlik (...bo\'lsa ham)',
                        'Vaqt (...ganda)'
                    ],
                    answer: 0,
                    explanation: '"um...zu" qolipi maqsadni (Wozu?) ifodalaydi: um Geld zu verdienen.'
                },
                {
                    q: '"Er lernt viel Deutsch, ___ in München studieren ___ können." Bo\'sh o\'rinlarni to\'ldiring:',
                    options: [
                        'um ... zu',
                        'ohne ... zu',
                        'statt ... zu',
                        'damit ... zu'
                    ],
                    answer: 0,
                    explanation: 'Maqsad konstruktsiyasi: um ... studieren zu können (o\'qiy olish maqsadida).'
                },
                {
                    q: '"ohne ... zu + Infinitiv" konstruktsiyasining ma\'nosi nima?',
                    options: [
                        '...masdan / ...magan holda',
                        '...ish o\'rniga',
                        '...ish maqsadida',
                        '...ishdan avval'
                    ],
                    answer: 0,
                    explanation: '"ohne...zu" kutilmagan harakatning bajarilmasligini bildiradi (ohne zu fragen = so\'ramasdan).'
                },
                {
                    q: '"Er ging an mir vorbei, ___ mich ___ grüßen." (U menga salom ham bermasdan yonimdan o\'tib ketdi):',
                    options: [
                        'ohne ... zu',
                        'statt ... zu',
                        'um ... zu',
                        'weil ... zu'
                    ],
                    answer: 0,
                    explanation: '"salom bermasdan" ma\'nosi uchun "ohne ... zu grüßen" to\'g\'ri keladi.'
                },
                {
                    q: '"(an)statt ... zu + Infinitiv" qanday ma\'noni bildiradi?',
                    options: [
                        '...ish o\'rniga / ...o\'rniga',
                        '...ish uchun',
                        '...gandan so\'ng',
                        '...masdan'
                    ],
                    answer: 0,
                    explanation: '"statt...zu" muqobil ish-harakatni ko\'rsatadi (statt zu lernen = o\'rganish o\'rniga).'
                },
                {
                    q: '"Statt die Hausaufgaben ___ machen, spielte er am Handy." Bo\'sh o\'ringa mos so\'zni qo\'ying:',
                    options: [
                        'zu',
                        'um',
                        'ohne',
                        'für'
                    ],
                    answer: 0,
                    explanation: 'statt ... zu machen konstruktsiyasi.'
                },
                {
                    q: 'Qaysi gapda "zu" yuklamasi ortiqcha va grammatik jihatdan xato ishlatilgan?',
                    options: [
                        'Ich kann sehr gut Deutsch zu sprechen.',
                        'Ich habe vor, Deutsch zu lernen.',
                        'Es ist verboten, hier zu rauchen.',
                        'Er hofft, die Prüfung zu bestehen.'
                    ],
                    answer: 0,
                    explanation: '"kann" modal fe\'li bilan "zu" aslo ishlatilmaydi: "Ich kann sprechen" bo\'lishi kerak.'
                },
                {
                    q: '"um...zu" konstruktsiyasini qo\'llashning majburiy sharti nima?',
                    options: [
                        'Ikkala gapning egasi bir xil shaxs bo\'lishi shart',
                        'Egalar har xil shaxslar bo\'lishi shart',
                        'Faqat o\'tgan zamonda qo\'llaniladi',
                        'Faqat so\'roq gaplarda keladi'
                    ],
                    answer: 0,
                    explanation: '"um...zu" qolipi faqat bosh va ergash gapning egasi bir xil bo\'lgandagina ishlatiladi.'
                }
            ],
            gamePairs: [
                { de: 'um Deutsch zu lernen', uz: 'nemis tilini o\'rganish uchun' },
                { de: 'ohne zu fragen', uz: 'so\'ramasdan / so\'ramagan holda' },
                { de: 'statt zu schlafen', uz: 'uxlash o\'rniga' },
                { de: 'Zeit haben zu...', uz: '...ishga vaqti bo\'lmoq' },
                { de: 'vergessen anzurufen', uz: 'qo\'ng\'iroq qilishni unutmoq' },
                { de: 'es ist verboten zu...', uz: '...ish taqiqlangan' },
                { de: 'vorhaben zu...', uz: '...ishni niyat qilmoq' },
                { de: 'versuchen zu helfen', uz: 'yordam berishga urinmoq' }
            ]
        },

        // ============================================================
        // MAVZU 6: Murakkab bog'lovchilar
        // ============================================================
        {
            id: 'b1_6',
            number: 6,
            title: 'Murakkab bog\'lovchilar',
            germanTitle: 'Komplexe Konjunktionen (obwohl, trotzdem, damit, als vs. wenn, während, seitdem)',
            icon: '🔀',
            description: 'Zidlik, vaqt va maqsad munosabatlari: ergash gap bog\'lovchilari (fe\'l oxirida) va bog\'lovchi ravishlar (fe\'l 2-o\'rinda) o\'rtasidagi aniq farqlar.',
            theory: {
                summary: 'B1 darajasida o\'z fikrini mantiqiy bog\'langan, boy va ravon jumlalar bilan ifodalash uchun zidlik (obwohl vs. trotzdem), maqsad (damit vs. um...zu) va vaqt munosabatlari (als vs. wenn, während, seitdem) bog\'lovchilarini to\'g\'ri gap tartibi bilan ishlatish zarur.',
                sections: [
                    {
                        heading: '1. Zidlik munosabati: obwohl (ergash gap) vs. trotzdem (bog\'lovchi ravish)',
                        content: '<p>Ikkala so\'z ham zidlikni ("shunga qaramay", "garchi... bo\'lsa ham") ifodalaydi, lekin gap tuzilishi mutlaqo farq qiladi:</p>' +
                            '<ul>' +
                            '<li><strong>obwohl (Subjunktion):</strong> Ergash gap yasaydi &mdash; tuslangan fe\'l <strong>gap oxiriga</strong> boradi:' +
                            '<br><em><strong>Obwohl</strong> es stark regnete, <strong>gingen</strong> wir spazieren.</em>' +
                            '<br><em>Wir gingen spazieren, <strong>obwohl</strong> es stark <strong>regnete</strong>.</em></li>' +
                            '<li><strong>trotzdem (Konjunktionaladverb):</strong> Mustaqil gapda keladi &mdash; tuslangan fe\'l darhol <strong>2-o\'ringa</strong> keladi:' +
                            '<br><em>Es regnete stark. <strong>Trotzdem gingen</strong> wir spazieren.</em></li>' +
                            '</ul>',
                        examples: [
                            { de: 'Obwohl er sehr müde war, lernte er bis spät in die Nacht.', uz: 'U juda charchagan bo\'lishiga qaramay, kechgacha dars qildi.', tip: 'obwohl -> fe\'l (war) gap oxirida' },
                            { de: 'Er war sehr müde. Trotzdem lernte er bis spät in die Nacht.', uz: 'U juda charchagan edi. Shunga qaramay u kechgacha dars qildi.', tip: 'trotzdem -> fe\'l (lernte) 2-o\'rinda' },
                            { de: 'Wir haben das Spiel verloren, obwohl wir gut gespielt haben.', uz: 'Yaxshi o\'ynagan bo\'lsak ham, o\'yinni yutqazib qo\'ydik.', tip: 'obwohl ergash gapi' }
                        ]
                    },
                    {
                        heading: '2. Vaqt bog\'lovchilari: "als" vs. "wenn", "während" va "seitdem"',
                        content: '<p>Vaqt bog\'lovchilarining barchasi ergash gap yasaydi (fe\'l oxirida):</p>' +
                            '<ul>' +
                            '<li><strong>als:</strong> O\'tgan zamonda faqat <strong>BIR MARTA</strong> yuz bergan aniq voqea-hodisalar yoki hayotiy davrlar uchun:' +
                            '<br><em><strong>Als</strong> ich 18 Jahre alt <strong>war</strong>, machte ich den Führerschein.</em> (18 yoshga to\'lganimda haydovchilik guvohnomasini oldim).</li>' +
                            '<li><strong>wenn:</strong> Hozirgi yoki kelasi zamonda, YOKI o\'tgan zamonda <strong>muntazam takrorlanib turgan</strong> harakatlar uchun (<em>immer wenn, jedes Mal wenn</em>):' +
                            '<br><em>Immer <strong>wenn</strong> ich Zeit <strong>hatte</strong>, besuchte ich meine Oma.</em></li>' +
                            '<li><strong>während:</strong> Bir vaqtda davom etayotgan parallel harakatlar (<em>"...paytida / ...davomida"</em>):' +
                            '<br><em><strong>Während</strong> ich kochte, <strong>hörte</strong> mein Bruder Musik.</em></li>' +
                            '<li><strong>seitdem:</strong> O\'tmishda boshlanib hozirgacha davom etayotgan harakat (<em>"...dan beri"</em>):' +
                            '<br><em><strong>Seitdem</strong> er in Berlin lebt, <strong>spricht</strong> er fließend Deutsch.</em></li>' +
                            '</ul>',
                        examples: [
                            { de: 'Als ich zum ersten Mal nach Deutschland flog, war ich sehr aufgeregt.', uz: 'Birinchi marta Germaniyaga uchganimda juda hayajonlangan edim.', tip: 'als = o\'tmishdagi 1 martalik voqea' },
                            { de: 'Wenn ich Urlaub habe, fahre ich immer ans Meer.', uz: 'Ta\'tilga chiqqanimda doimo dengizga boraman.', tip: 'wenn = hozirgi/kelasi zamon yoki takroriylik' },
                            { de: 'Während meine Mutter die Küche putzte, machte ich die Hausaufgaben.', uz: 'Onam oshxonani tozalayotgan paytda men vazifalarni bajardim.', tip: 'während = parallel davom etgan harakat' }
                        ]
                    },
                    {
                        heading: '3. Maqsad bog\'lovchisi: damit (vs. um...zu)',
                        content: '<p><em>damit</em> ham <em>"...ishi uchun / ...moq uchun"</em> degan maqsadni bildiradi va fe\'lni gap oxiriga suradi.</p>' +
                            '<p><strong>Eng asosiy qoida:</strong> Agar bosh gap va ergash gapning <strong>egasi HAR XIL shaxslar bo\'lsa, faqat "damit" ishlatilishi shart</strong> (bunday holatda "um...zu" ISHLATIB BO\'LMAYDI!):</p>' +
                            '<p><em>Der Vater arbeitet viel, <strong>damit seine Kinder</strong> an der Universität studieren können.</em><br>' +
                            '(Ota ko\'p ishlaydi &mdash; bolalari universitetda o\'qiy olishi uchun. Ota &ne; bolalar!).</p>' +
                            '<p>Agar ega bir xil bo\'lsa, "damit" ham, "um...zu" ham mumkin, lekin "um...zu" ixchamroq hisoblanadi.</p>',
                        examples: [
                            { de: 'Ich erkläre es dir noch einmal, damit du die Grammatik besser verstehst.', uz: 'Grammatikani yaxshiroq tushunishing uchun buni senga yana bir bor tushuntiraman.', tip: 'ich va du (egalari har xil) -> faqat damit!' },
                            { de: 'Schließe bitte die Tür, damit der Lärm von draußen uns nicht stört.', uz: 'Tashqaridagi shovqin bizga xalaqit bermasligi uchun eshikni yopib qo\'y.', tip: 'damit bilan ergash gap' },
                            { de: 'Er gibt mir seine Telefonnummer, damit ich ihn anrufen kann.', uz: 'Qo\'ng\'iroq qila olishim uchun u menga telefon raqamini berdi.', tip: 'er va ich (har xil egalar)' }
                        ]
                    }
                ],
                keyRules: [
                    '"als" faqat o\'tgan zamonda 1 marta sodir bo\'lgan voqealar uchun qo\'llaniladi (Als ich ein Kind war...).',
                    '"wenn" esa hozirgi/kelasi zamon yoki o\'tgan zamondagi takroriy harakatlar (immer wenn) uchun ishlatiladi.',
                    'Bosh va ergash gapning egalari har xil bo\'lganda maqsad uchun faqat "damit" ishlatiladi, "um...zu" mumkin emas!',
                    '"obwohl" ergash gap yasaydi (fe\'l oxirida), "trotzdem" esa mustaqil gapda fe\'lni darhol 2-o\'ringa talab qiladi.'
                ]
            },
            flashcards: [
                { front: 'obwohl', back: 'garchi ... bo\'lsa ham (fe\'l oxirida)', tip: 'Obwohl es regnet, gehe ich...' },
                { front: 'trotzdem', back: 'shunga qaramay / baribir (fe\'l 2-o\'rinda)', tip: 'Es regnet. Trotzdem gehe ich...' },
                { front: 'als', back: '...ganida (o\'tgan zamonda bir marta)', tip: 'Als ich klein war...' },
                { front: 'wenn', back: '...ganda (har gal) / agar', tip: 'Wenn ich Zeit habe...' },
                { front: 'immer wenn', back: 'har doim ...ganida (takroriylik)', tip: 'Immer wenn er kam,...' },
                { front: 'während', back: '...vaqtida / ...davomida (parallel harakat)', tip: 'Während ich aß, las ich ein Buch' },
                { front: 'seitdem', back: '...dan beri (o\'tmishdan hozirgacha)', tip: 'Seitdem er hier ist,...' },
                { front: 'damit', back: '...ishi uchun (har xil egalar uchun)', tip: 'damit du lernst (ich != du)' },
                { front: 'deshalb / darum', back: 'shu sababli (fe\'l 2-o\'rinda)', tip: 'Ich war krank, deshalb kam ich nicht' },
                { front: 'weil', back: 'chunki (fe\'l oxirida)', tip: 'weil ich müde bin' },
                { front: 'da', back: 'chunki / ...sababli (gap boshida)', tip: 'Da es regnet, bleibe ich hier' },
                { front: 'sodass', back: 'natijada / shunday qilib (fe\'l oxirida)', tip: 'Er sprach schnell, sodass ich...' },
                { front: 'entweder ... oder', back: 'yo ... yoki (juft bog\'lovchi)', tip: 'Entweder heute oder morgen' },
                { front: 'sowohl ... als auch', back: 'ham ... ham (juft bog\'lovchi)', tip: 'Sowohl Deutsch als auch Englisch' }
            ],
            test: [
                {
                    q: '"obwohl" bog\'lovchisi qanday gap turini yasaydi va fe\'l qayerda turadi?',
                    options: [
                        'Ergash gap yasaydi, tuslangan fe\'l gapning eng oxiriga boradi',
                        'Bosh gap yasaydi, fe\'l 1-o\'rinda bo\'ladi',
                        'Fe\'l darhol bog\'lovchidan keyin (2-o\'rinda) turadi',
                        'Faqat fe\'lsiz gaplarda ishlatiladi'
                    ],
                    answer: 0,
                    explanation: '"obwohl" Subjunktion bo\'lib, tuslangan fe\'lni ergash gap oxiriga suradi.'
                },
                {
                    q: '"trotzdem" so\'zidan keyin gapdagi so\'z tartibi qanday bo\'ladi?',
                    options: [
                        'Tuslangan fe\'l darhol "trotzdem"dan keyin (2-o\'rinda) keladi',
                        'Fe\'l gapning eng oxiriga suriladi',
                        'Fe\'l gapning boshiga chiqadi',
                        'Tartib o\'zgarmaydi, birinchi ega keladi'
                    ],
                    answer: 0,
                    explanation: '"trotzdem" bog\'lovchi ravish bo\'lib, inversiya yasaydi: trotzdem + fe\'l + ega.'
                },
                {
                    q: '"___ es kalt war, trug er keine Jacke." (Havo sovuq bo\'lishiga qaramay, u kurtka kiymadi):',
                    options: [
                        'Obwohl',
                        'Trotzdem',
                        'Weil',
                        'Deshalb'
                    ],
                    answer: 0,
                    explanation: 'Fe\'l (war) gap oxirida bo\'lgani uchun ergash gap bog\'lovchisi "Obwohl" qo\'yiladi.'
                },
                {
                    q: 'O\'tgan zamonda faqat bir marta sodir bo\'lgan voqealar uchun qaysi bog\'lovchi ishlatiladi?',
                    options: [
                        'als',
                        'wenn',
                        'wann',
                        'während'
                    ],
                    answer: 0,
                    explanation: '"als" faqat o\'tgan zamonda bir marta yuz bergan harakatlar uchun ishlatiladi.'
                },
                {
                    q: '"___ ich 10 Jahre alt war, lebte ich in Samarkand." Bo\'sh o\'ringa mos bog\'lovchini toping:',
                    options: [
                        'Als',
                        'Wenn',
                        'Wann',
                        'Seitdem'
                    ],
                    answer: 0,
                    explanation: '10 yoshda bo\'lish hayotda faqat bir marta o\'tgan zamonda sodir bo\'ladi -> "Als".'
                },
                {
                    q: 'O\'tgan zamondagi takroriy harakatlar ("har gal ...ganda") uchun qaysi birikma to\'g\'ri?',
                    options: [
                        'immer wenn',
                        'immer als',
                        'immer wann',
                        'nur als'
                    ],
                    answer: 0,
                    explanation: 'Takrorlanuvchi harakatlar uchun doimo "immer wenn" ishlatiladi.'
                },
                {
                    q: '"während" bog\'lovchisi qanday ma\'noni bildiradi?',
                    options: [
                        'Bir vaqtda sodir bo\'layotgan parallel harakatlar (...vaqtida / ...davomida)',
                        'Sabab (...chunki)',
                        'Zidlik (...ammo)',
                        'Natija (...shuning uchun)'
                    ],
                    answer: 0,
                    explanation: '"während" ikkita harakat bir vaqtning o\'zida davom etayotganini ko\'rsatadi.'
                },
                {
                    q: '"seitdem" bog\'lovchisining asosiy ma\'nosi nima?',
                    options: [
                        '...dan beri (o\'tmishda boshlanib hozir ham davom etayotgan)',
                        '...gacha',
                        '...gandan so\'ng',
                        '...o\'rniga'
                    ],
                    answer: 0,
                    explanation: '"seitdem" o\'tmishda boshlangan va hozir ham davom etayotgan ish-harakatni bildiradi.'
                },
                {
                    q: 'Bosh gap va ergash gapning egalari HAR XIL bo\'lganda maqsad uchun qaysi bog\'lovchi ishlatiladi?',
                    options: [
                        'damit (fe\'l oxirida)',
                        'um...zu',
                        'deshalb',
                        'trotzdem'
                    ],
                    answer: 0,
                    explanation: 'Egalar turlicha bo\'lganda faqat "damit" ishlatilishi mumkin, "um...zu" ishlatib bo\'lmaydi.'
                },
                {
                    q: '"Die Eltern sparen Geld, ___ die Kinder an einer Universität studieren können." To\'g\'ri bog\'lovchi qaysi?',
                    options: [
                        'damit',
                        'um zu',
                        'obwohl',
                        'als'
                    ],
                    answer: 0,
                    explanation: 'Die Eltern &ne; die Kinder (har xil egalar) -> faqat "damit" to\'g\'ri.'
                }
            ],
            gamePairs: [
                { de: 'obwohl', uz: 'garchi ... bo\'lsa ham (fe\'l oxirida)' },
                { de: 'trotzdem', uz: 'shunga qaramay (fe\'l 2-o\'rinda)' },
                { de: 'als', uz: 'o\'tgan zamonda bir marta (...ganda)' },
                { de: 'wenn', uz: 'har gal ...ganda / agar' },
                { de: 'während', uz: 'davomida / bir vaqtning o\'zida' },
                { de: 'seitdem', uz: '...dan beri' },
                { de: 'damit', uz: '...ishi uchun (har xil egalar)' },
                { de: 'immer wenn', uz: 'har doim ...ganida' }
            ]
        },

        // ============================================================
        // MAVZU 7: Kasb, Mehnat bozori va Ishga qabul
        // ============================================================
        {
            id: 'b1_7',
            number: 7,
            title: 'Kasb, Mehnat bozori va Ishga qabul',
            germanTitle: 'Beruf, Arbeitsmarkt und Bewerbung (Lebenslauf und Vorstellungsgespräch)',
            icon: '💼',
            description: 'Nemis tilida rezyume (Lebenslauf), ariza xati (Anschreiben), ish suhbati (Vorstellungsgespräch) va mehnat sharoitlari bo\'yicha muhim leksika hamda iboralar.',
            theory: {
                summary: 'B1 Goethe imtihonining yozma (Schreiben - rasmiy xat) va og\'zaki (Sprechen - o\'zini tanishtirish va suhbat) bo\'limlarida eng ko\'p uchraydigan, Germaniyada yashash, ishlash yoki Ausbildung qilish uchun o\'ta muhim amaliy mavzu — bu ish qidirish (Jobsuche), hujjat topshirish (Bewerbung) va ish suhbati (Vorstellungsgespräch) hisoblanadi.',
                sections: [
                    {
                        heading: '1. Ish arizasi hujjatlari (Die Bewerbungsunterlagen)',
                        content: '<p>Germaniyada ishga topshirishda (<em>die Bewerbung</em>) quyidagi standart hujjatlar to\'plami talab qilinadi:</p>' +
                            '<ul>' +
                            '<li><strong>Das Anschreiben (Yo\'llanma / Ariza xati):</strong> Nega aynan shu kompaniya va mazkur lavozimga topshirayotganingizni tushuntiruvchi 1 sahifalik rasmiy xat.</li>' +
                            '<li><strong>Der tabellarische Lebenslauf (Rezyume):</strong> Ma\'lumotingiz, ish tajribangiz va ko\'nikmalaringiz jadval shaklida xronologik tartibda yoziladi.</li>' +
                            '<li><strong>Die Zeugnisse (Diplom va tavsiyanomalar):</strong> Til sertifikatlari (masalan, B1 Zertifikat), universitet diplomi va avvalgi ish joylaridan tavsiyanomalar (<em>Arbeitszeugnis</em>).</li>' +
                            '</ul>' +
                            '<p><strong>Rasmiy xatdagi oltin iboralar:</strong></p>' +
                            '<ul>' +
                            '<li><em>Sehr geehrte Damen und Herren, ...</em> (Hurmatli xonimlar va janoblar)</li>' +
                            '<li><em>Ich bewerbe mich um die Stelle als ...</em> (... lavozimiga o\'z nomzodimni taqdim etaman)</li>' +
                            '<li><em>Mit großem Interesse habe ich Ihre Anzeige gelesen.</em> (E\'loningizni katta qiziqish bilan o\'qidim)</li>' +
                            '<li><em>Über eine Einladung zu einem Vorstellungsgespräch würde ich mich sehr freuen.</em> (Suhbatga taklif qilsangiz juda mamnun bo\'lardim)</li>' +
                            '<li><em>Mit freundlichen Grüßen</em> (Hurmat bilan)</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Ich bewerbe mich um die ausgeschriebene Stelle als Softwareentwickler.', uz: 'Men e\'lon qilingan dasturchi lavozimiga o\'z arizamni topshirmoqdaman.', tip: 'sich bewerben um + Akkusativ' },
                            { de: 'Im Anhang finden Sie meinen tabellarischen Lebenslauf und meine Zeugnisse.', uz: 'Ilovada mening jadval ko\'rinishidagi rezyumeyim va sertifikatlarimni topasiz.', tip: 'der Anhang = xat ilovasi' },
                            { de: 'Ich habe drei Jahre Berufserfahrung im Bereich Logistik.', uz: 'Men logistika sohasida 3 yillik ish tajribasiga egaman.', tip: 'die Berufserfahrung = ish tajribasi' }
                        ]
                    },
                    {
                        heading: '2. Ish suhbati (Das Vorstellungsgespräch) va Xarakter xislatlari',
                        content: '<p>Ish suhbatida o\'zingizning kuchli va kuchsiz tomonlaringizni (<em>Stärken und Schwächen</em>) aniq dalillar bilan aytib berish talab qilinadi:</p>' +
                            '<ul>' +
                            '<li><strong>teamfähig:</strong> jamoada yaxshi ishlay oladigan</li>' +
                            '<li><strong>zuverlässig:</strong> o\'z ishiga mas\'uliyatli, ishonchli</li>' +
                            '<li><strong>pünktlich:</strong> vaqtga qat\'iy rioya qiluvchi</li>' +
                            '<li><strong>belastbar / flexibel:</strong> stressli vaziyatlarga chidamli / moslashuvchan</li>' +
                            '<li><strong>selbstständig:</strong> mustaqil ish yurita oladigan</li>' +
                            '</ul>' +
                            '<p><strong>Intervyuda eng ko\'p beriladigan savollar:</strong></p>' +
                            '<ul>' +
                            '<li><em>Warum möchten Sie gerade bei uns arbeiten?</em> (Nega aynan bizning korxonada ishlamoqchisiz?)</li>' +
                            '<li><em>Was sind Ihre größten Stärken?</em> (Eng kuchli fazilatlaringiz nimalardan iborat?)</li>' +
                            '<li><em>Wo sehen Sie sich in fünf Jahren?</em> (Besh yildan keyin o\'zingizni qayerda ko\'rasiz?)</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Zu meinen größten Stärken gehören Zuverlässigkeit und Teamfähigkeit.', uz: 'Mening eng katta afzalliklarim — ishonchlilik va jamoada ishlay olish qobiliyatidir.', tip: 'die Stärken = kuchli tomonlar' },
                            { de: 'Ich kann mich sehr schnell in neue Aufgabengebiete einarbeiten.', uz: 'Men yangi vazifalarga juda tez moslashib, o\'rganib keta olaman.', tip: 'sich einarbeiten = ishga moslashmoq' },
                            { de: 'Ich bin es gewohnt, auch unter Zeitdruck sorgfältig zu arbeiten.', uz: 'Men vaqt tig\'iz bo\'lganda ham sinchkovlik bilan ishlashga o\'rganganman.', tip: 'belastbar bo\'lish ifodasi' }
                        ]
                    },
                    {
                        heading: '3. Mehnat shartnomasi va Mehnat sharoitlari (Arbeitsvertrag)',
                        content: '<p>Germaniyada mehnat munosabatlariga oid eng asosiy tushunchalar:</p>' +
                            '<ul>' +
                            '<li><strong>Das Gehalt / Der Lohn:</strong> Maosh, oylik ish haqi.</li>' +
                            '<li><strong>Brutto vs. Netto:</strong> <em>Bruttogehalt</em> &mdash; soliqlardan oldingi umumiy summa; <em>Nettogehalt</em> &mdash; soliqlar va sug\'urtalar ushlab qolingandan keyin to\'g\'ridan-to\'g\'ri bank kartasiga tushadigan toza maosh.</li>' +
                            '<li><strong>Die Arbeitszeiten:</strong>' +
                            '<ul>' +
                            '<li><em>die Vollzeit:</em> to\'liq stavka (haftasiga odatda 38&ndash;40 soat).</li>' +
                            '<li><em>die Teilzeit:</em> yarim stavka (haftasiga 20&ndash;30 soat).</li>' +
                            '<li><em>die Gleitzeit:</em> erkin / moslashuvchan ish grafigi.</li>' +
                            '<li><em>die Überstunden:</em> ortiqcha ishlangan soatlar (overtime).</li>' +
                            '</ul></li>' +
                            '<li><strong>Die Probezeit:</strong> Sinov muddati (odatda 3 oydan 6 oygacha).</li>' +
                            '<li><strong>Die Kündigungsfrist:</strong> Ishdan bo\'shash yoki bo\'shatish haqida oldindan ogohlantirish muddati.</li>' +
                            '<li><strong>Der bezahlte Urlaub:</strong> To\'lanadigan qonuniy mehnat ta\'tili (Germaniyada yiliga kamida 24&ndash;30 ish kuni).</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Die Probezeit in diesem Vertrag beträgt sechs Monate.', uz: 'Ushbu shartnomadagi sinov muddati olti oyni tashkil etadi.', tip: 'die Probezeit = sinov muddati' },
                            { de: 'Das Bruttogehalt liegt bei 3.500 Euro pro Monat.', uz: 'Yalpi maosh oyiga 3500 yevroni tashkil qiladi.', tip: 'das Bruttogehalt = soliqsiz yalpi oylik' },
                            { de: 'Ich habe Anspruch auf 28 Urlaubstage im Jahr.', uz: 'Men yiliga 28 kunlik mehnat ta\'tiliga ega bo\'lish huquqiga egaman.', tip: 'der Anspruch = qonuniy huquq' }
                        ]
                    }
                ],
                keyRules: [
                    'Nemis tilida ishga ariza topshirishda doimo "sich bewerben um (+ Akkusativ)" fe\'li ishlatiladi.',
                    'Rasmiy xatlar har doim "Sehr geehrte Damen und Herren," bilan boshlanib, "Mit freundlichen Grüßen" bilan yakunlanadi.',
                    'Maosh haqida gap ketganda doimo Brutto (soliqlarsiz umumiy) va Netto (toza qo\'lga tegadigan) farqlanadi.',
                    'CV / Rezyume tuzishda "der tabellarische Lebenslauf" (jadval ko\'rinishidagi xronologik rezyume) standarti qo\'llaniladi.'
                ]
            },
            flashcards: [
                { front: 'das Anschreiben', back: 'yo\'llanma xati / ariza xati (Cover Letter)', tip: 'Bewerbungning asosiy qismi' },
                { front: 'der Lebenslauf', back: 'tarjimai hol / rezyume (CV)', tip: 'tabellarischer Lebenslauf' },
                { front: 'das Vorstellungsgespräch', back: 'ish suhbati / intervyu', tip: 'Einladung zum Vorstellungsgespräch' },
                { front: 'sich bewerben um (+ Akk)', back: '...lavozimiga ariza topshirmoq', tip: 'Ich bewerbe mich um die Stelle' },
                { front: 'die Stellenanzeige', back: 'ish e\'loni', tip: 'eine Stellenanzeige in der Zeitung' },
                { front: 'die Berufserfahrung', back: 'ish tajribasi', tip: 'Ich habe viel Berufserfahrung' },
                { front: 'die Probezeit', back: 'sinov muddati (3-6 oy)', tip: 'Die Probezeit dauert 6 Monate' },
                { front: 'das Bruttogehalt', back: 'yalpi oylik (soliqlardan oldingi)', tip: 'Brutto ist vor den Steuern' },
                { front: 'das Nettogehalt', back: 'toza maosh (qo\'lga tegadigan)', tip: 'Netto ist nach den Steuern' },
                { front: 'die Vollzeit / die Teilzeit', back: 'to\'liq stavka / yarim stavka', tip: 'Ich arbeite in Vollzeit (40h)' },
                { front: 'teamfähig', back: 'jamoada ishlay oladigan', tip: 'Er ist sehr teamfähig' },
                { front: 'zuverlässig', back: 'ishonchli / mas\'uliyatli', tip: 'eine zuverlässige Person' },
                { front: 'die Kündigungsfrist', back: 'ishdan bo\'shash ogohlantirish muddati', tip: 'Kündigungsfrist von 3 Monaten' },
                { front: 'die Überstunden', back: 'ortiqcha ishlangan soatlar', tip: 'Überstunden machen / abbauen' },
                { front: 'das Arbeitszeugnis', back: 'ish joyidan tavsiyanoma / baho', tip: 'ein sehr gutes Zeugnis' }
            ],
            test: [
                {
                    q: 'Nemis tilida ishga topshirish ariza xatining nomi nima?',
                    options: [
                        'das Anschreiben / das Bewerbungsschreiben',
                        'der Mietvertrag',
                        'die Kündigung',
                        'der Führerschein'
                    ],
                    answer: 0,
                    explanation: 'Ishga topshirilayotgan xat "das Anschreiben" yoki "das Bewerbungsschreiben" deb ataladi.'
                },
                {
                    q: '"sich bewerben" (ariza topshirmoq) fe\'li qaysi predlog va kelishik bilan ishlatiladi?',
                    options: [
                        'um + Akkusativ',
                        'an + Dativ',
                        'für + Dativ',
                        'über + Akkusativ'
                    ],
                    answer: 0,
                    explanation: 'Biror ish o\'rniga da\'vogarlik qilishda: sich bewerben um + Akkusativ.'
                },
                {
                    q: 'Nemischa rezyume / tarjimai hol qanday ataladi?',
                    options: [
                        'der Lebenslauf',
                        'das Zeugnis',
                        'die Stellenanzeige',
                        'das Gehalt'
                    ],
                    answer: 0,
                    explanation: 'Rezyume nemis tilida "der Lebenslauf" deyiladi.'
                },
                {
                    q: 'Rasmiy ariza xati yakunida hurmat bildirish uchun qaysi ibora to\'g\'ri keladi?',
                    options: [
                        'Mit freundlichen Grüßen',
                        'Tschüss und alles Gute',
                        'Bis bald',
                        'Liebe Grüße'
                    ],
                    answer: 0,
                    explanation: 'Rasmiy maktublar har doim "Mit freundlichen Grüßen" iborasi bilan yakunlanadi.'
                },
                {
                    q: 'Ish suhbati nemis tilida qanday nomlanadi?',
                    options: [
                        'das Vorstellungsgespräch',
                        'das Klassentreffen',
                        'die Abschlussprüfung',
                        'der Feierabend'
                    ],
                    answer: 0,
                    explanation: 'Ish beruvchi bilan o\'tkaziladigan rasmiy suhbat — "das Vorstellungsgespräch".'
                },
                {
                    q: '"Ich bin teamfähig und zuverlässig" gapining ma\'nosi qaysi?',
                    options: [
                        'Men jamoada ishlay olaman va ishonchliman',
                        'Men yolg\'iz ishlashni afzal ko\'raman',
                        'Men tez-tez kechikib turaman',
                        'Mening hech qanday tajribam yo\'q'
                    ],
                    answer: 0,
                    explanation: 'teamfähig = jamoada ishlay oluvchi, zuverlässig = mas\'uliyatli, ishonchli.'
                },
                {
                    q: 'Germaniyada yangi qabul qilingan xodim uchun sinov muddati qanday ataladi?',
                    options: [
                        'die Probezeit',
                        'die Teilzeit',
                        'die Vollzeit',
                        'die Gleitzeit'
                    ],
                    answer: 0,
                    explanation: 'Sinov muddati "die Probezeit" deb nomlanadi (odatda 6 oygacha davom etadi).'
                },
                {
                    q: '"Bruttogehalt" va "Nettogehalt" tushunchalari o\'rtasidagi farq nima?',
                    options: [
                        'Brutto — soliqlardan oldingi umumiy oylik, Netto — barcha soliqlardan keyingi toza maosh',
                        'Brutto — toza oylik, Netto — soliq summasi',
                        'Ikkala tushuncha ham aynan bir xil maoshni anglatadi',
                        'Brutto — soatbay ish haqi, Netto — yillik mukofot'
                    ],
                    answer: 0,
                    explanation: 'Brutto — ushlab qolinmagan oylik, Netto — soliqlar va sug\'urtalar to\'langach qo\'lga tegadigan pul.'
                },
                {
                    q: 'Mehnat shartnomasini bekor qilish haqida oldindan ogohlantirish muddati qanday ataladi?',
                    options: [
                        'die Kündigungsfrist',
                        'der Jahresurlaub',
                        'die Überstunden',
                        'die Gleitzeit'
                    ],
                    answer: 0,
                    explanation: 'Ogohlantirish muddati "die Kündigungsfrist" deb ataladi.'
                },
                {
                    q: '"Über eine Einladung zu einem Vorstellungsgespräch würde ich mich sehr freuen" iborasining ma\'nosi nima?',
                    options: [
                        'Suhbatga taklif qilsangiz, juda mamnun bo\'lardim',
                        'Men ushbu ishdan bo\'shamoqchiman',
                        'Men suhbatga bora olmayman',
                        'Menga bu ish taklifi umuman yoqmadi'
                    ],
                    answer: 0,
                    explanation: 'Bu rasmiy Bewerbung xatining oxirida suhbatga taklif kutishni ifodalovchi standart jumlasi.'
                }
            ],
            gamePairs: [
                { de: 'das Anschreiben', uz: 'ariza / yo\'llanma xati' },
                { de: 'der Lebenslauf', uz: 'rezyume / tarjimai hol' },
                { de: 'das Vorstellungsgespräch', uz: 'ish suhbati / intervyu' },
                { de: 'sich bewerben um', uz: 'ishga nomzod topshirmoq' },
                { de: 'die Probezeit', uz: 'sinov muddati' },
                { de: 'das Bruttogehalt', uz: 'soliqlardan oldingi oylik' },
                { de: 'teamfähig', uz: 'jamoada ishlay oladigan' },
                { de: 'die Kündigungsfrist', uz: 'ogohlantirish muddati' }
            ]
        }
    ]
};
