// ========================================================================
// DEUTSCH AKADEMIYASI — GOETHE A1 O'QUV DASTURI (CURRICULUM)
// Start Deutsch A1 — Boshlang'ich daraja uchun 7 ta interaktiv modul
// ========================================================================

window.deutschCurriculum = window.deutschCurriculum || {};

window.deutschCurriculum['A1'] = {
    level: 'A1',
    badge: '🌱 Boshlang\'ich',
    title: 'A1 — Start Deutsch (Boshlang\'ich daraja)',
    description: 'Nemis tilini noldan o\'rganuvchilar uchun 7 ta eng muhim va interaktiv dars.',
    topics: [
        // ====================================================================
        // TOPIC 1: Begrüßung, Alphabet & Vorstellen
        // ====================================================================
        {
            id: 'a1_1',
            number: 1,
            title: 'Salomlashish, Tanishtirish va Alifbo',
            germanTitle: 'Begrüßung, Alphabet & Vorstellen',
            icon: '👋',
            description: 'Nemis alifbosi, tovushlar, salomlashish va xayrlashish iboralari hamda o\'zini tanishtirish asoslari.',
            theory: {
                summary: 'Ushbu darsda nemis alifbosi, o\'qilish qoidalari, rasmiy va norasmiy salomlashuv hamda o\'zingiz haqingizda dastlabki ma\'lumot berishni o\'rganasiz.',
                sections: [
                    {
                        heading: '1. Nemis alifbosi va o\'qilish qoidalari (Das Alphabet)',
                        content: '<p>Nemis alifbosida <strong>26 ta asosiy lotin harfi</strong>, <strong>3 ta umlaut</strong> (ä, ö, ü) va <strong>1 ta maxsus belgi</strong> (ß — Eszett / o\'tkir s) mavjud.</p><p>Asosiy tovush birikmalari (Diphthonge):</p><ul><li><strong>ei</strong> — [ay] deb o\'qiladi: <em>mein, heißen</em></li><li><strong>ie</strong> — cho\'ziq [i:] deb o\'qiladi: <em>Sie, wie, hier</em></li><li><strong>eu / äu</strong> — [oy] deb o\'qiladi: <em>Deutsch, neu, Häuser</em></li><li><strong>ch</strong> — a, o, u harflaridan keyin qattiq [x] (<em>Buch, machen</em>), boshqa harflardan keyin esa yumshoq [ç] (<em>ich, nicht</em>)</li><li><strong>sch</strong> — [sh] deb o\'qiladi: <em>Schule, schön</em></li><li><strong>sp / st</strong> — so\'z boshida [shp / sht] deb talaffuz qilinadi: <em>Sport, Stadt</em></li><li><strong>v</strong> — [f] deb o\'qiladi: <em>Vater, vier, von</em></li><li><strong>w</strong> — [v] deb o\'qiladi: <em>Wasser, wo, wer</em></li><li><strong>z</strong> — [ts] deb o\'qiladi: <em>Zimmer, Zug, zwei</em></li><li><strong>ß</strong> — doimo qo\'sh [s] deb o\'qiladi: <em>groß, heißen</em></li></ul>',
                        examples: [
                            { de: 'heißen', uz: 'nomlanmoq / ismi ... bo\'lmoq', tip: 'ei = [ay], ß = [s]' },
                            { de: 'Deutschland', uz: 'Germaniya', tip: 'eu = [oy], sch = [sh]' },
                            { de: 'spielen', uz: 'o\'ynamoq', tip: 'sp so\'z boshida [shp]' },
                            { de: 'wunderbar', uz: 'ajoyib / a\'lo darajada', tip: 'w harfi o\'zbekcha [v]' }
                        ]
                    },
                    {
                        heading: '2. Salomlashish va Xayrlashish (Begrüßung & Verabschiedung)',
                        content: '<p>Nemis tilida salomlashish va xayrlashish vaziyatga hamda kun vaqtiga qarab farqlanadi:</p><table style="width:100%; border-collapse:collapse; margin:10px 0;"><thead><tr style="background:rgba(255,255,255,0.08); text-align:left;"><th style="padding:8px;">Nemischa</th><th style="padding:8px;">O\'zbekcha</th><th style="padding:8px;">Qo\'llanishi</th></tr></thead><tbody><tr><td style="padding:8px;"><strong>Guten Morgen!</strong></td><td style="padding:8px;">Xayrli tong!</td><td style="padding:8px;">Ertalabdan ~11:00 gacha</td></tr><tr><td style="padding:8px;"><strong>Guten Tag!</strong></td><td style="padding:8px;">Xayrli kun!</td><td style="padding:8px;">11:00 dan ~18:00 gacha</td></tr><tr><td style="padding:8px;"><strong>Guten Abend!</strong></td><td style="padding:8px;">Xayrli kech!</td><td style="padding:8px;">18:00 dan keyin</td></tr><tr><td style="padding:8px;"><strong>Gute Nacht!</strong></td><td style="padding:8px;">Xayrli tun!</td><td style="padding:8px;">Faqat uyquga ketishda</td></tr><tr><td style="padding:8px;"><strong>Hallo!</strong></td><td style="padding:8px;">Salom!</td><td style="padding:8px;">Do\'stona / norasmiy</td></tr><tr><td style="padding:8px;"><strong>Auf Wiedersehen!</strong></td><td style="padding:8px;">Ko\'rishguncha xayr!</td><td style="padding:8px;">Rasmiy xayrlashuv</td></tr><tr><td style="padding:8px;"><strong>Tschüss!</strong></td><td style="padding:8px;">Xayr!</td><td style="padding:8px;">Norasmiy xayrlashuv</td></tr><tr><td style="padding:8px;"><strong>Bis bald! / Bis morgen!</strong></td><td style="padding:8px;">Ko\'rishguncha! / Ertagacha!</td><td style="padding:8px;">Yaqin oradagi uchrashuvda</td></tr></tbody></table>',
                        examples: [
                            { de: 'Guten Morgen, Herr Schmidt! Wie geht es Ihnen?', uz: 'Xayrli tong, janob Shmidt! Qandaysiz?', tip: 'Rasmiy salomlashuv' },
                            { de: 'Hallo Anna, wie geht\'s?', uz: 'Salom Anna, ishlaring qanday?', tip: 'Norasmiy do\'stona salomlashuv' },
                            { de: 'Auf Wiedersehen, Frau Weber!', uz: 'Xayr, ko\'rishguncha, Veber xonim!', tip: 'Rasmiy xayrlashuv' }
                        ]
                    },
                    {
                        heading: '3. O\'zini tanishtirish (Sich vorstellen)',
                        content: '<p>Yangi inson bilan tanishganda quyidagi 3 ta asosiy savol-javob qo\'llaniladi:</p><ul><li><strong>Ism so\'rash:</strong><br><em>Rasmiy:</em> Wie heißen Sie? (Ismingiz nima?) → <strong>Ich heiße...</strong> / <strong>Mein Name ist...</strong><br><em>Norasmiy:</em> Wer bist du? / Wie heißt du? (Isming nima?) → <strong>Ich bin...</strong></li><li><strong>Kelib chiqish:</strong><br><em>Rasmiy:</em> Woher kommen Sie? (Qayerdansiz?) → <strong>Ich komme aus Usbekistan / aus Taschkent.</strong></li><li><strong>Yashash joyi:</strong><br><em>Rasmiy:</em> Wo wohnen Sie? (Qayerda yashaysiz?) → <strong>Ich wohne in Berlin / in Samarkand.</strong></li></ul>',
                        examples: [
                            { de: 'Mein Name ist Sardor. Freut mich!', uz: 'Mening ismim Sardor. Tanishganimdan xursandman!', tip: 'Freut mich = Tanishganimdan xursandman' },
                            { de: 'Ich komme aus Usbekistan und wohne in Taschkent.', uz: 'Men O\'zbekistondanman va Toshkentda yashayman.', tip: 'aus = -dan, in = -da' },
                            { de: 'Wie heißen Sie, bitte?', uz: 'Ismingiz nima, iltimos?', tip: 'Xushmuomala so\'rov' }
                        ]
                    }
                ],
                keyRules: [
                    'Barcha nemischa otlar (har qanday so\'z turkumidagi otlar) istisnosiz KATTA bosh harf bilan yoziladi (der Name, der Tag).',
                    'Faqat "Gute Nacht" iborasida oxirgi qo\'shimcha -e (die Nacht ayol jinsi bo\'lgani uchun), qolganlarida -en bo\'ladi (Guten Morgen, Guten Tag, Guten Abend).',
                    'Rasmiy muloqotdagi "Sie" (Siz) har doim KATTA harf bilan yoziladi va fe\'l oxiriga -en oladi.',
                    'Darak gapda tuslangan fe\'l har doim ikkinchi o\'rinda turadi (Verb an Position 2).'
                ]
            },
            flashcards: [
                { front: 'Hallo', back: 'salom', tip: 'norasmiy salomlashuv' },
                { front: 'Guten Morgen', back: 'xayrli tong', tip: 'ertalabki salom (~11:00 gacha)' },
                { front: 'Guten Tag', back: 'xayrli kun', tip: 'kunduzgi asosiy salom' },
                { front: 'Guten Abend', back: 'xayrli kech', tip: 'kechki salom (18:00 dan so\'ng)' },
                { front: 'Gute Nacht', back: 'xayrli tun', tip: 'uyquga ketish oldidan aytiladi' },
                { front: 'Auf Wiedersehen', back: 'ko\'rishguncha xayr', tip: 'rasmiy xayrlashuv' },
                { front: 'Tschüss', back: 'xayr / omon bo\'l', tip: 'norasmiy do\'stona xayrlashuv' },
                { front: 'Bitte', back: 'iltimos / marhamat / arzmaydi', tip: 'ko\'p qirrali odob so\'zi' },
                { front: 'Danke schön', back: 'katta rahmat', tip: 'minnatdorchilik bildirish' },
                { front: 'Wie heißen Sie?', back: 'Ismingiz nima? (rasmiy)', tip: 'heißen fe\'li bilan rasmiy savol' },
                { front: 'Ich heiße...', back: 'Mening ismim...', tip: 'o\'zini tanishtirish' },
                { front: 'Woher kommen Sie?', back: 'Qayerdansiz? (rasmiy)', tip: 'mamlakat yoki shaharni so\'rash' },
                { front: 'Ich komme aus...', back: 'Men ...dan kelganman / ...likman', tip: 'aus predlogi bilan' },
                { front: 'Freut mich!', back: 'Tanishganimdan xursandman!', tip: 'ilk tanishuvdagi ibora' },
                { front: 'Bis bald!', back: 'Tez orada ko\'rishguncha!', tip: 'do\'stona xayrlashuv' }
            ],
            test: [
                {
                    q: 'Ertalab soat 08:30 da qanday salomlashish eng to\'g\'ri?',
                    options: ['Guten Abend!', 'Guten Morgen!', 'Gute Nacht!', 'Auf Wiedersehen!'],
                    answer: 1,
                    explanation: 'Ertalab soat 11:00 gacha "Guten Morgen!" (Xayrli tong) deb salomlashiladi.'
                },
                {
                    q: 'Rasmiy xayrlashuv iborasini toping:',
                    options: ['Tschüss!', 'Bis gleich!', 'Auf Wiedersehen!', 'Hallo!'],
                    answer: 2,
                    explanation: '"Auf Wiedersehen!" rasmiy va xushmuomala xayrlashuv iborasidir.'
                },
                {
                    q: '"Wie heißen Sie?" savoliga eng to\'g\'ri javob qaysi?',
                    options: ['Ich komme aus Samarkand.', 'Mir geht es gut, danke.', 'Ich heiße Jasur.', 'Ich bin 22 Jahre alt.'],
                    answer: 2,
                    explanation: '"Wie heißen Sie?" = Ismingiz nima? Bunga "Ich heiße..." deb javob qaytariladi.'
                },
                {
                    q: '"Gute Nacht" iborasi qachon ishlatiladi?',
                    options: ['Tushlik paytida', 'Faqat uyquga ketish oldidan', 'Tanishganda', 'Tonggi nonushtada'],
                    answer: 1,
                    explanation: '"Gute Nacht" uyquga yotish oldidan "Xayrli tun" ma\'nosida ishlatiladi.'
                },
                {
                    q: 'Nemischa "Deutschland" so\'zida "eu" harf birikmasi qanday talaffuz qilinadi?',
                    options: ['ev', 'oy', 'ey', 'yu'],
                    answer: 1,
                    explanation: 'Nemis tilida "eu" va "äu" diftonglari o\'zbek tilidagi [oy] tovushini beradi.'
                },
                {
                    q: '"Woher kommen Sie?" savolining ma\'nosi nima?',
                    options: ['Qayerda yashaysiz?', 'Qayerga ketyapsiz?', 'Qayerdansiz?', 'Kim bilan kelyapsiz?'],
                    answer: 2,
                    explanation: '"Woher kommen Sie?" = Qayerdansiz? (kelib chiqishingiz qayerdan?).'
                },
                {
                    q: '"Ich wohne ___ Taschkent." Bo\'sh o\'ringa mos predlogni qo\'ying:',
                    options: ['aus', 'in', 'nach', 'von'],
                    answer: 1,
                    explanation: 'Shaharda yashashni ifodalashda "in" predlogi ishlatiladi: "in Taschkent".'
                },
                {
                    q: 'Qaysi so\'z minnatdorchilik bildirish ("Rahmat") ma\'nosini beradi?',
                    options: ['Bitte', 'Danke', 'Entschuldigung', 'Genau'],
                    answer: 1,
                    explanation: '"Danke" = Rahmat. "Bitte" esa marhamat yoki iltimos degani.'
                },
                {
                    q: 'Nemis tilida barcha otlar qanday qoidaga ko\'ra yoziladi?',
                    options: ['Faqat gap boshida katta harf bilan', 'Doimo kichik harf bilan', 'Har doim va hamma joyda KATTA harf bilan', 'Ixtiyoriy tanlanadi'],
                    answer: 2,
                    explanation: 'Nemis tili grammatikasining qat\'iy qoidasi: barcha otlar (Substantive) doimo bosh harf bilan yoziladi.'
                },
                {
                    q: '"Entschuldigung!" so\'zining o\'zbekcha ma\'nosi nima?',
                    options: ['Xush kelibsiz!', 'Kechirasiz / Uzr!', 'Rahmat!', 'Arzimaydi!'],
                    answer: 1,
                    explanation: '"Entschuldigung!" kechirim so\'rash yoki birovga murojaat qilishda "Kechirasiz!" degan ma\'noni bildiradi.'
                }
            ],
            gamePairs: [
                { de: 'Guten Morgen', uz: 'Xayrli tong' },
                { de: 'Auf Wiedersehen', uz: 'Ko\'rishguncha xayr' },
                { de: 'Danke schön', uz: 'Katta rahmat' },
                { de: 'Bitte sehr', uz: 'Marhamat / Arzmaydi' },
                { de: 'Entschuldigung', uz: 'Kechirasiz' },
                { de: 'Ich heiße', uz: 'Mening ismim' },
                { de: 'Woher', uz: 'Qayerdan' },
                { de: 'Tschüss', uz: 'Xayr (norasmiy)' }
            ]
        },

        // ====================================================================
        // TOPIC 2: Familie, Zahlen 1-100 & Personalpronomen
        // ====================================================================
        {
            id: 'a1_2',
            number: 2,
            title: 'Oila, Shaxsiy ma\'lumotlar va Sonlar',
            germanTitle: 'Familie, Zahlen 1-100 & Personalpronomen',
            icon: '👨‍👩‍👧‍👦',
            description: 'Oila a\'zolari, shaxsiy kishilik olmoshlari, 1 dan 100 gacha sonlar va yoshni ifodalash.',
            theory: {
                summary: 'Bu darsda oila a\'zolari nomlari, nemis tilidagi kishilik olmoshlari (ich, du, er, sie, es...), sonlarni tuzish mantiqi va yoshni aytishni o\'rganasiz.',
                sections: [
                    {
                        heading: '1. Oila a\'zolari (Die Familie)',
                        content: '<p>Nemis tilida oila a\'zolari jinsiga qarab aniq artikellar bilan yodlanadi:</p><ul><li><strong>der Vater</strong> — ota (der Papa)</li><li><strong>die Mutter</strong> — ona (die Mama)</li><li><strong>die Eltern</strong> — ota-ona (faqat ko\'plikda)</li><li><strong>der Sohn</strong> — o\'g\'il farzand</li><li><strong>die Tochter</strong> — qiz farzand</li><li><strong>das Kind / die Kinder</strong> — bola / bolalar</li><li><strong>der Bruder</strong> — aka yoki uka</li><li><strong>die Schwester</strong> — opa yoki singil</li><li><strong>die Geschwister</strong> — aka-uka va opa-singillar (umumiy)</li><li><strong>der Großvater (Opa)</strong> — bobo</li><li><strong>die Großmutter (Oma)</strong> — buvi</li><li><strong>die Großeltern</strong> — bobo va buvi (ko\'plik)</li></ul>',
                        examples: [
                            { de: 'Das ist mein Vater und das ist meine Mutter.', uz: 'Bu mening otam va bu mening onam.', tip: 'Erkak: mein, Ayol: meine' },
                            { de: 'Ich habe zwei Geschwister: einen Bruder und eine Schwester.', uz: 'Mening ikki aka-singlim bor: bir akam va bir singlim.', tip: 'Geschwister = aka-singillar' },
                            { de: 'Meine Großeltern wohnen in Samarkand.', uz: 'Mening bobo-buvim Samarqandda yashashadi.', tip: 'Großeltern = bobo va buvi' }
                        ]
                    },
                    {
                        heading: '2. Kishilik olmoshlari (Personalpronomen)',
                        content: '<p>Kishilik olmoshlari shaxslarni ifodalash uchun xizmat qiladi:</p><table style="width:100%; border-collapse:collapse; margin:10px 0;"><thead><tr style="background:rgba(255,255,255,0.08); text-align:left;"><th style="padding:8px;">Olmosh</th><th style="padding:8px;">O\'zbekcha</th><th style="padding:8px;">Izoh</th></tr></thead><tbody><tr><td style="padding:8px;"><strong>ich</strong></td><td style="padding:8px;">men</td><td style="padding:8px;">1-shaxs birlik</td></tr><tr><td style="padding:8px;"><strong>du</strong></td><td style="padding:8px;">sen</td><td style="padding:8px;">2-shaxs birlik (norasmiy)</td></tr><tr><td style="padding:8px;"><strong>er</strong></td><td style="padding:8px;">u (erkak)</td><td style="padding:8px;">der rodidagi otlar o\'rniga</td></tr><tr><td style="padding:8px;"><strong>sie</strong></td><td style="padding:8px;">u (ayol)</td><td style="padding:8px;">die rodidagi otlar o\'rniga</td></tr><tr><td style="padding:8px;"><strong>es</strong></td><td style="padding:8px;">u (o\'rta jins)</td><td style="padding:8px;">das rodidagi otlar o\'rniga</td></tr><tr><td style="padding:8px;"><strong>wir</strong></td><td style="padding:8px;">biz</td><td style="padding:8px;">1-shaxs ko\'plik</td></tr><tr><td style="padding:8px;"><strong>ihr</strong></td><td style="padding:8px;">sizlar</td><td style="padding:8px;">2-shaxs norasmiy ko\'plik ("du"ning ko\'pligi)</td></tr><tr><td style="padding:8px;"><strong>sie</strong></td><td style="padding:8px;">ular</td><td style="padding:8px;">3-shaxs ko\'plik</td></tr><tr><td style="padding:8px;"><strong>Sie</strong></td><td style="padding:8px;">Siz</td><td style="padding:8px;">Hurmat shakli (doimo KATTA harf bilan)</td></tr></tbody></table>',
                        examples: [
                            { de: 'Er heißt Thomas und sie heißt Anna.', uz: 'Uning ismi Tomas va uning ismi Anna.', tip: 'er = o\'g\'il bola, sie = qiz bola' },
                            { de: 'Wir lernen zusammen Deutsch.', uz: 'Biz birgalikda nemis tili o\'rganyapmiz.', tip: 'wir = biz' },
                            { de: 'Woher kommt ihr?', uz: 'Sizlar qayerdansizlar?', tip: 'ihr = sizlar (do\'stlarga qarata)' }
                        ]
                    },
                    {
                        heading: '3. Sonlar 1 dan 100 gacha (Die Zahlen von 1 bis 100)',
                        content: '<p>Nemischa sonlarning o\'ziga xos mantiqiy tuzilishi mavjud:</p><ul><li><strong>0–12:</strong> null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf</li><li><strong>13–19:</strong> birlik + zehn (dreizehn, vierzehn, fünfzehn...).<br><em>Diqqat:</em> 16 = <strong>sechzehn</strong> (s harfi tushadi), 17 = <strong>siebzehn</strong> (en tushadi).</li><li><strong>20, 30, 40...:</strong> zwanzig, dreißig (ß bilan!), vierzig, fünfzig, sechzig, siebzig, achtzig, neunzig, (ein)hundert.</li><li><strong>21–99 orasi:</strong> Oldin BIRLIK, keyin "und", keyin O\'NLIK aytiladi!<br>21 = <strong>einundzwanzig</strong> (bir-va-yigirma)<br>35 = <strong>fünfunddreißig</strong> (besh-va-o\'ttiz)<br>99 = <strong>neunundneunzig</strong></li></ul>',
                        examples: [
                            { de: 'Ich bin vierundzwanzig Jahre alt.', uz: 'Men 24 yoshdaman.', tip: '24 = vier + und + zwanzig' },
                            { de: 'Meine Telefonnummer ist null-eins-sieben-eins...', uz: 'Telefon raqamim 0171...', tip: 'Raqamlar donalab aytiladi' },
                            { de: 'Das Buch kostet einunddreißig Euro.', uz: 'Kitob 31 yevro turadi.', tip: '31 = einunddreißig' }
                        ]
                    }
                ],
                keyRules: [
                    '21 dan 99 gacha bo\'lgan sonlarda avval BIRLIK, keyin "und", keyin O\'NLIK aytiladi (masalan: 45 = fünfundvierzig).',
                    '30 soni "dreißig" deb "ß" bilan yoziladi, qolgan barcha o\'nliklar "-zig" bilan tugaydi (vierzig, fünfzig...).',
                    'Egalik olmoshida muzskoy va neytral uchun "mein", jenskiy va ko\'plik uchun esa "meine" ishlatiladi (mein Vater, meine Mutter).',
                    '"sie" olmoshi 3 xil ma\'noga ega: kichik "sie" + birlik fe\'l = u (ayol), kichik "sie" + ko\'plik fe\'l = ular, katta "Sie" = Siz (hurmat).'
                ]
            },
            flashcards: [
                { front: 'die Familie', back: 'oila', tip: 'jenskiy rod (die)' },
                { front: 'der Vater', back: 'ota', tip: 'muzskoy rod (der)' },
                { front: 'die Mutter', back: 'ona', tip: 'jenskiy rod (die)' },
                { front: 'die Eltern', back: 'ota-ona', tip: 'doimo ko\'plikda ishlatiladi' },
                { front: 'der Sohn', back: 'o\'g\'il farzand', tip: 'muzskoy: der Sohn, Plural: die Söhne' },
                { front: 'die Tochter', back: 'qiz farzand', tip: 'jenskiy: die Tochter, Plural: die Töchter' },
                { front: 'der Bruder', back: 'aka / uka', tip: 'muzskoy: der Bruder, Plural: die Brüder' },
                { front: 'die Schwester', back: 'opa / singil', tip: 'jenskiy: die Schwester' },
                { front: 'die Geschwister', back: 'aka-uka, opa-singillar', tip: 'umumiy aka-singillarni anglatadi' },
                { front: 'die Großeltern', back: 'bobo va buvi', tip: 'ko\'plik' },
                { front: 'das Kind', back: 'bola / farzand', tip: 'neytral: das Kind, Plural: die Kinder' },
                { front: 'eins, zwei, drei', back: 'bir, ikki, uch', tip: 'dastlabki sanoq sonlari' },
                { front: 'zwanzig', back: 'yigirma (20)', tip: 'o\'nlik son' },
                { front: 'einundzwanzig', back: 'yigirma bir (21)', tip: 'avval birlik (ein), keyin zwanzig' },
                { front: 'hundert', back: 'yuz (100)', tip: 'yuzlik son' }
            ],
            test: [
                {
                    q: '"Ota-ona" so\'zi nemis tilida qanday nomlanadi?',
                    options: ['die Großeltern', 'die Geschwister', 'die Eltern', 'die Kinder'],
                    answer: 2,
                    explanation: '"die Eltern" = ota-ona. Großeltern = bobo-buvi, Geschwister = aka-uka/opa-singillar.'
                },
                {
                    q: 'Nemis tilida 45 soni qanday yoziladi?',
                    options: ['vierzigundfünf', 'fünfundvierzig', 'vierfünf', 'fünfzigundvier'],
                    answer: 1,
                    explanation: 'Nemis tilida avval birlik (fünf), keyin "und", so\'ng o\'nlik (vierzig) yoziladi: "fünfundvierzig".'
                },
                {
                    q: 'Bo\'sh joyga mos egalik olmoshi: "Das ist ___ Mutter."',
                    options: ['mein', 'meine', 'meinen', 'meiner'],
                    answer: 1,
                    explanation: '"die Mutter" ayol jinsida bo\'lgani uchun egalik shakli "meine Mutter" bo\'ladi.'
                },
                {
                    q: '"ihr" kishilik olmoshi qanday ma\'noni bildiradi?',
                    options: ['biz', 'sen', 'sizlar (norasmiy ko\'plik)', 'ular'],
                    answer: 2,
                    explanation: '"ihr" = sizlar (do\'stlar, tanishlar yoki bolalarga qaratilgan norasmiy ko\'plik).'
                },
                {
                    q: '30 sonining to\'g\'ri yozilishini aniqlang:',
                    options: ['dreizig', 'dreißig', 'dreizehn', 'dreißich'],
                    answer: 1,
                    explanation: 'Faqat 30 soni "ß" harfi bilan yoziladi: "dreißig". Qolgan o\'nliklar -zig oladi.'
                },
                {
                    q: '"Wie alt bist du?" savoliga to\'g\'ri javob qaysi?',
                    options: ['Ich komme aus Usbekistan.', 'Ich bin 20 Jahre alt.', 'Ich wohne in Berlin.', 'Mir geht es gut.'],
                    answer: 1,
                    explanation: '"Wie alt bist du?" = Yoshing nechada? Javob: "Ich bin 20 Jahre alt" (Men 20 yoshdaman).'
                },
                {
                    q: '"Geschwister" so\'zi nimani anglatadi?',
                    options: ['Ota-ona', 'Aka-uka va opa-singillar', 'Bobo va buvi', 'Farzandlar'],
                    answer: 1,
                    explanation: '"die Geschwister" bir ota-onaning farzandlari — aka-uka va opa-singillarni birgalikda ifodalaydi.'
                },
                {
                    q: 'Qaysi sonlarda o\'zakdagi harf qisqarishi kuzatiladi?',
                    options: ['16 (sechzehn) va 17 (siebzehn)', '15 (fünfzehn)', '13 (dreizehn)', '18 (achtzehn)'],
                    answer: 0,
                    explanation: 'sechs (6) da "s" tushib "sechzehn", sieben (7) da "en" tushib "siebzehn" hosil bo\'ladi.'
                },
                {
                    q: 'Erkak kishiga nisbatan "U shifokor" demoqchi bo\'lsak, qaysi olmosh ishlatiladi?',
                    options: ['Sie', 'Es', 'Er', 'Du'],
                    answer: 2,
                    explanation: 'Muzskoy rod (erkak kishi) uchun 3-shaxs olmoshi "er" (u) ishlatiladi.'
                },
                {
                    q: '70 soni nemis tilida qanday nomlanadi?',
                    options: ['siebenzig', 'siebzehn', 'siebzig', 'siebenundzwanzig'],
                    answer: 2,
                    explanation: '70 sonida "en" qisqaradi va "siebzig" deb yoziladi hamda talaffuz qilinadi.'
                }
            ],
            gamePairs: [
                { de: 'der Vater', uz: 'ota' },
                { de: 'die Mutter', uz: 'ona' },
                { de: 'die Eltern', uz: 'ota-ona' },
                { de: 'der Bruder', uz: 'aka / uka' },
                { de: 'die Schwester', uz: 'opa / singil' },
                { de: 'das Kind', uz: 'bola / farzand' },
                { de: 'fünfundzwanzig', uz: 'yigirma besh (25)' },
                { de: 'die Großeltern', uz: 'bobo va buvi' }
            ]
        },

        // ====================================================================
        // TOPIC 3: der, die, das, ein/kein, Plural
        // ====================================================================
        {
            id: 'a1_3',
            number: 3,
            title: 'Artikellar va Otlar',
            germanTitle: 'der, die, das, ein/kein, Plural',
            icon: '📦',
            description: 'Nemis tilining yuragi: aniq va noaniq artikellar, inkor (kein/keine) va otlarning ko\'plik shakllari.',
            theory: {
                summary: 'Nemis tilidagi har bir ot rod (jins) va songa ega. Ushbu darsda artikellarning turlari, "kein" bilan inkor qilish hamda ko\'plik yasash usullarini o\'rganasiz.',
                sections: [
                    {
                        heading: '1. Aniq artikellar (Bestimmte Artikel: der, die, das)',
                        content: '<p>Nemis tilida 3 xil grammatik jins mavjud bo\'lib, ularni aniq artikellar belgilaydi:</p><ul><li><strong>der</strong> — Muzskoy (Maskulin): <em>der Mann</em> (erkak), <em>der Tisch</em> (stol), <em>der Apfel</em> (olma). Ko\'pincha -er, -ling, -or, -ist bilan tugovchi so\'zlar.</li><li><strong>die</strong> — Jenskiy (Feminin): <em>die Frau</em> (ayol), <em>die Lampe</em> (chiroq), <em>die Tasche</em> (sumka). Ko\'pincha -ung, -heit, -keit, -schaft, -tät, -e bilan tugovchi so\'zlar.</li><li><strong>das</strong> — Neytral (Neutral): <em>das Kind</em> (bola), <em>das Buch</em> (kitob), <em>das Auto</em> (mashina). Ko\'pincha -chen, -lein, -um, -ment bilan tugovchi so\'zlar.</li><li><strong>die (Plural)</strong> — Ko\'plikda barcha jinsdagi otlar umumiy <strong>die</strong> artikelini oladi: <em>die Tische, die Lampen, die Bücher</em>.</li></ul>',
                        examples: [
                            { de: 'Der Tisch ist neu.', uz: 'Stol yangi (aniq bir stol haqida).', tip: 'der = muzskoy rod' },
                            { de: 'Die Zeitung liegt hier.', uz: 'Gazeta bu yerda turibdi.', tip: '-ung bilan tugagan otlar doimo die' },
                            { de: 'Das Mädchen spielt im Garten.', uz: 'Qizaloq bog\'da o\'ynamoqda.', tip: '-chen qo\'shimchasi doimo das bo\'ladi' }
                        ]
                    },
                    {
                        heading: '2. Noaniq va Inkor artikellari (Unbestimmte Artikel & kein)',
                        content: '<p>Predmet haqida birinchi marta gapirilganda yoki noaniq bo\'lganda <strong>noaniq artikel</strong> ishlatiladi:</p><table style="width:100%; border-collapse:collapse; margin:10px 0;"><thead><tr style="background:rgba(255,255,255,0.08); text-align:left;"><th style="padding:8px;">Jins</th><th style="padding:8px;">Aniq</th><th style="padding:8px;">Noaniq</th><th style="padding:8px;">Inkor (kein)</th></tr></thead><tbody><tr><td style="padding:8px;">Maskulin</td><td style="padding:8px;">der Tisch</td><td style="padding:8px;"><strong>ein</strong> Tisch</td><td style="padding:8px;"><strong>kein</strong> Tisch</td></tr><tr><td style="padding:8px;">Feminin</td><td style="padding:8px;">die Lampe</td><td style="padding:8px;"><strong>eine</strong> Lampe</td><td style="padding:8px;"><strong>keine</strong> Lampe</td></tr><tr><td style="padding:8px;">Neutral</td><td style="padding:8px;">das Buch</td><td style="padding:8px;"><strong>ein</strong> Buch</td><td style="padding:8px;"><strong>kein</strong> Buch</td></tr><tr><td style="padding:8px;">Plural</td><td style="padding:8px;">die Bücher</td><td style="padding:8px;"><em>— (artikelsiz)</em></td><td style="padding:8px;"><strong>keine</strong> Bücher</td></tr></tbody></table><p><strong>Muhim:</strong> Noaniq artikelning ko\'plik shakli bo\'lmaydi! Otlarni inkor qilishda "nicht" emas, balki <strong>kein / keine</strong> ishlatiladi.</p>',
                        examples: [
                            { de: 'Das ist ein Buch. Das ist kein Heft.', uz: 'Bu kitob. Bu daftar emas.', tip: 'das Buch -> ein Buch, kein Heft' },
                            { de: 'Ich habe eine Schwester, aber keinen Bruder.', uz: 'Mening singlim bor, lekin akam yo\'q.', tip: 'eine Schwester, inkor: keinen Bruder' },
                            { de: 'Das sind keine Äpfel, das sind Orangen.', uz: 'Bular olma emas, bular apelsin.', tip: 'Ko\'plikdagi inkor: keine' }
                        ]
                    },
                    {
                        heading: '3. Otlarning ko\'plik shakllari (Pluralformen)',
                        content: '<p>Nemis tilida ko\'plik 5 ta asosiy usul bilan yasaladi:</p><ul><li><strong>1. -e (ko\'pincha Umlaut bilan):</strong> der Tag → die Tage, der Stuhl → die Stühle</li><li><strong>2. -(e)n:</strong> die Frau → die Frauen, die Lampe → die Lampen</li><li><strong>3. -er (odatda Umlaut bilan):</strong> das Bild → die Bilder, das Buch → die Bücher</li><li><strong>4. -s (chet tilidan kirgan so\'zlar):</strong> das Auto → die Autos, das Sofa → die Sofas</li><li><strong>5. Qo\'shimchasiz (ba\'zan faqat Umlaut):</strong> der Koffer → die Koffer, der Apfel → die Äpfel</li></ul>',
                        examples: [
                            { de: 'Ein Buch — zwei Bücher', uz: 'Bitta kitob — ikkita kitob', tip: '-er va Umlaut (u -> ü)' },
                            { de: 'Eine Lampe — viele Lampen', uz: 'Bitta chiroq — ko\'plab chiroqlar', tip: '-e bilan tugagan otlar -n oladi' },
                            { de: 'Ein Auto — drei Autos', uz: 'Bitta mashina — uchta mashina', tip: 'Chet so\'zlar -s qo\'shimchasini oladi' }
                        ]
                    }
                ],
                keyRules: [
                    'Nemis tilida har bir yangi otni doimo ARTIKELI va KO\'PLIK shakli bilan birga yodlash shart (masalan: das Buch, die Bücher).',
                    'Noaniq artikelning (ein/eine) ko\'plik shakli YO\'Q! Ko\'plikda ot shunchaki artikelsiz ishlatiladi (ein Apfel → Äpfel).',
                    'Otlar oldidagi inkor uchun "nicht" emas, "kein / keine" qo\'llanadi (Das ist kein Problem).',
                    '-ung, -heit, -keit, -schaft, -tät qo\'shimchali so\'zlar 100% "die" (jenskiy) bo\'ladi.'
                ]
            },
            flashcards: [
                { front: 'der Mann', back: 'erkak kishi', tip: 'muzskoy (der), Plural: die Männer' },
                { front: 'die Frau', back: 'ayol / xonim', tip: 'jenskiy (die), Plural: die Frauen' },
                { front: 'das Kind', back: 'bola', tip: 'neytral (das), Plural: die Kinder' },
                { front: 'der Tisch', back: 'stol', tip: 'muzskoy (der), Plural: die Tische' },
                { front: 'der Stuhl', back: 'stul', tip: 'muzskoy (der), Plural: die Stühle' },
                { front: 'das Buch', back: 'kitob', tip: 'neytral (das), Plural: die Bücher' },
                { front: 'das Heft', back: 'daftar', tip: 'neytral (das), Plural: die Hefte' },
                { front: 'die Lampe', back: 'chiroq / lampa', tip: 'jenskiy (die), Plural: die Lampen' },
                { front: 'die Tasche', back: 'sumka', tip: 'jenskiy (die), Plural: die Taschen' },
                { front: 'das Auto', back: 'mashina / avtomobil', tip: 'neytral (das), Plural: die Autos' },
                { front: 'der Stift', back: 'ruchka / qalam', tip: 'muzskoy (der), Plural: die Stifte' },
                { front: 'ein / eine', back: 'bir / qandaydir (noaniq artikel)', tip: 'maskulin/neutral: ein, feminin: eine' },
                { front: 'kein / keine', back: '...emas / yo\'q (inkor artikeli)', tip: 'otlarni inkor qilish uchun' },
                { front: 'die Zeitung', back: 'gazeta', tip: 'jenskiy (-ung bilan tugagan)' },
                { front: 'das Bild', back: 'rasm', tip: 'neytral (das), Plural: die Bilder' }
            ],
            test: [
                {
                    q: '"die Zeitung" so\'zining jinsi nima va qaysi qoidaga asoslanadi?',
                    options: ['Muzskoy, chunki -ung bilan tugagan', 'Jenskiy, chunki -ung bilan tugagan barcha otlar "die" bo\'ladi', 'Neytral, chunki buyum', 'Faqat ko\'plikda ishlatiladi'],
                    answer: 1,
                    explanation: '-ung qo\'shimchasi bilan tugagan barcha nemischa otlar istisnosiz "die" (jenskiy) bo\'ladi.'
                },
                {
                    q: '"Das ist ___ Auto." (Bu mashina emas) Bo\'sh joyga to\'g\'ri inkor so\'zini qo\'ying:',
                    options: ['nicht', 'keine', 'kein', 'nie'],
                    answer: 2,
                    explanation: '"das Auto" neytral jinsda bo\'lgani uchun inkor artikeli "kein" bo\'ladi: "Das ist kein Auto".'
                },
                {
                    q: 'Qaysi so\'z "die" (jenskiy) artikeliga ega?',
                    options: ['Tisch', 'Buch', 'Lampe', 'Stift'],
                    answer: 2,
                    explanation: 'die Lampe (chiroq). Stol: der Tisch, kitob: das Buch, ruchka: der Stift.'
                },
                {
                    q: 'Noaniq artikelning (ein/eine) ko\'plikdagi shakli qanday bo\'ladi?',
                    options: ['einen', 'eines', 'U ko\'plikda mavjud emas (artikelsiz qo\'llanadi)', 'einer'],
                    answer: 2,
                    explanation: 'Noaniq artikelning ko\'plik shakli yo\'q. Ko\'plikda otlar artikelsiz keladi: "Das sind Bücher".'
                },
                {
                    q: '"-chen" kichraytirish qo\'shimchasi bilan tugagan so\'zlar qaysi artikelni oladi?',
                    options: ['Har doim "das"', 'Har doim "die"', 'Har doim "der"', 'So\'z ma\'nosiga qarab o\'zgaradi'],
                    answer: 0,
                    explanation: '"-chen" va "-lein" bilan tugagan barcha kichraytirilgan otlar doimo neytral: "das" bo\'ladi (das Mädchen, das Brötchen).'
                },
                {
                    q: '"der Stuhl" so\'zining to\'g\'ri ko\'plik shakli qaysi?',
                    options: ['die Stuhle', 'die Stühle', 'die Stuhlen', 'die Stühler'],
                    answer: 1,
                    explanation: '"der Stuhl" ko\'plikda o\'zakdagi u -> ü ga aylanadi va -e oladi: "die Stühle".'
                },
                {
                    q: 'Bo\'sh joyni to\'ldiring: "Ich habe ___ Tasche." (Mening bitta sumkam bor)',
                    options: ['ein', 'eine', 'einen', 'kein'],
                    answer: 1,
                    explanation: '"die Tasche" ayol jinsida bo\'lgani uchun noaniq artikel "eine" bo\'ladi: "eine Tasche".'
                },
                {
                    q: 'Otlarni inkor qilishda "nicht" o\'rniga nima ishlatiladi?',
                    options: ['doch', 'kein / keine', 'nein', 'ohne'],
                    answer: 1,
                    explanation: 'Otlar oldidagi inkorni bildirish uchun inkor artikeli "kein / keine" ishlatiladi.'
                },
                {
                    q: 'Qaysi so\'zning ko\'pligi "-s" qo\'shimchasi bilan yasaladi?',
                    options: ['das Auto → die Autos', 'der Mann → die Männer', 'die Frau → die Frauen', 'das Kind → die Kinder'],
                    answer: 0,
                    explanation: 'Chet tillardan kirib kelgan so\'zlar ko\'plikda odatda "-s" oladi: das Auto → die Autos.'
                },
                {
                    q: '"die Bilder" so\'zining birlik shakli qaysi?',
                    options: ['der Bild', 'die Bild', 'das Bild', 'das Bilder'],
                    answer: 2,
                    explanation: 'Rasm so\'zining birligi neytral jinsda: "das Bild", ko\'pligi esa "die Bilder".'
                }
            ],
            gamePairs: [
                { de: 'der Tisch', uz: 'stol' },
                { de: 'die Lampe', uz: 'chiroq' },
                { de: 'das Buch', uz: 'kitob' },
                { de: 'die Tasche', uz: 'sumka' },
                { de: 'das Auto', uz: 'mashina' },
                { de: 'der Stuhl', uz: 'stul' },
                { de: 'das Kind', uz: 'bola' },
                { de: 'die Bücher', uz: 'kitoblar' }
            ]
        },

        // ====================================================================
        // TOPIC 4: Präsens: regelmäßige Verben, sein, haben, heißen
        // ====================================================================
        {
            id: 'a1_4',
            number: 4,
            title: 'Hozirgi zamon va Fe\'llar tuslanishi',
            germanTitle: 'Präsens: regelmäßige Verben, sein, haben, heißen',
            icon: '⚡',
            description: 'Muntazam fe\'llar tuslanishi (-e, -st, -t, -en), yordamchi fe\'llar (sein, haben) va gapdagi so\'z tartibi.',
            theory: {
                summary: 'Nemis tilida gap qurishning asosi fe\'llar tuslanishidir. Bu darsda asosiy tuslanish qoidalari, eng muhim "sein" va "haben" fe\'llari hamda gapdagi so\'z tartibini o\'rganasiz.',
                sections: [
                    {
                        heading: '1. Muntazam fe\'llar tuslanishi (Regelmäßige Verben)',
                        content: '<p>Nemis tilida fe\'l o\'zagiga shaxs-son qo\'shimchalari qo\'shiladi. Masalan: <strong>lernen</strong> (o\'rganmoq), o\'zagi: <em>lern-</em></p><ul><li><strong>ich</strong> lern-<strong>e</strong> (men o\'rganaman)</li><li><strong>du</strong> lern-<strong>st</strong> (sen o\'rganasan)</li><li><strong>er / sie / es</strong> lern-<strong>t</strong> (u o\'rganadi)</li><li><strong>wir</strong> lern-<strong>en</strong> (biz o\'rganamiz)</li><li><strong>ihr</strong> lern-<strong>t</strong> (sizlar o\'rganasizlar)</li><li><strong>sie / Sie</strong> lern-<strong>en</strong> (ular / Siz o\'rganasiz)</li></ul><p><strong>Maxsus holatlar:</strong></p><ul><li>O\'zagi -s, -ß, -z bilan tugasa (<em>heißen</em>): du shaxsida faqat <strong>-t</strong> oladi (<em>du heißt</em>).</li><li>O\'zagi -t, -d bilan tugasa (<em>arbeiten</em>): talaffuz qulayligi uchun <strong>-est, -et</strong> oladi (<em>du arbeitest, er arbeitet</em>).</li></ul>',
                        examples: [
                            { de: 'Ich lerne jeden Tag Deutsch.', uz: 'Men har kuni nemis tili o\'rganaman.', tip: 'ich + lerne (-e oladi)' },
                            { de: 'Wo wohnst du?', uz: 'Sen qayerda yashaysan?', tip: 'du + wohnst (-st oladi)' },
                            { de: 'Er arbeitet bei Siemens.', uz: 'U Siemens kompaniyasida ishlaydi.', tip: 'arbeiten: er arbeitet (-et oladi)' }
                        ]
                    },
                    {
                        heading: '2. "sein" va "haben" fe\'llari (Bo\'lmoq va Ega bo\'lmoq)',
                        content: '<p>Bu ikki fe\'l nemis tilidagi eng muhim va notog\'ri tuslanuvchi (unregelmäßig) fe\'llardir:</p><table style="width:100%; border-collapse:collapse; margin:10px 0;"><thead><tr style="background:rgba(255,255,255,0.08); text-align:left;"><th style="padding:8px;">Shaxs</th><th style="padding:8px;">sein (bo\'lmoq)</th><th style="padding:8px;">haben (ega bo\'lmoq)</th></tr></thead><tbody><tr><td style="padding:8px;">ich</td><td style="padding:8px;"><strong>bin</strong> (men ...man)</td><td style="padding:8px;"><strong>habe</strong> (menda bor)</td></tr><tr><td style="padding:8px;">du</td><td style="padding:8px;"><strong>bist</strong></td><td style="padding:8px;"><strong>hast</strong> (b tushadi!)</td></tr><tr><td style="padding:8px;">er / sie / es</td><td style="padding:8px;"><strong>ist</strong></td><td style="padding:8px;"><strong>hat</strong> (b tushadi!)</td></tr><tr><td style="padding:8px;">wir</td><td style="padding:8px;"><strong>sind</strong></td><td style="padding:8px;"><strong>haben</strong></td></tr><tr><td style="padding:8px;">ihr</td><td style="padding:8px;"><strong>seid</strong></td><td style="padding:8px;"><strong>habt</strong></td></tr><tr><td style="padding:8px;">sie / Sie</td><td style="padding:8px;"><strong>sind</strong></td><td style="padding:8px;"><strong>haben</strong></td></tr></tbody></table>',
                        examples: [
                            { de: 'Ich bin Student und ich habe viel Zeit.', uz: 'Men talabaman va mening vaqtim ko\'p.', tip: 'ich bin, ich habe' },
                            { de: 'Hast du Geschwister?', uz: 'Sening aka-singillaring bormi?', tip: 'haben: du hast' },
                            { de: 'Wir sind sehr glücklich.', uz: 'Biz juda baxtlimiz.', tip: 'wir sind' }
                        ]
                    },
                    {
                        heading: '3. Gapda so\'z tartibi (Satzbau: Verb an Position 2)',
                        content: '<p>Nemis tili gap tartibining qat\'iy qoidalari mavjud:</p><ul><li><strong>Darak gapda:</strong> Tuslangan fe\'l HAR DOIM ikkinchi o\'rinda turadi!<br><em>Ich lerne heute Deutsch.</em> yoki <em>Heute lerne ich Deutsch.</em> (Ikkala holatda ham fe\'l 2-o\'rinda!)</li><li><strong>W-Fragen (Maxsus so\'roq):</strong> So\'roq so\'z 1-o\'rinda, fe\'l 2-o\'rinda:<br><em>Woher kommen Sie?</em> / <em>Was machst du?</em></li><li><strong>Ja/Nein-Fragen (Ha/Yo\'q so\'roqlari):</strong> Tuslangan fe\'l 1-o\'ringa chiqadi:<br><em>Lernst du Deutsch?</em> — Ja, ich lerne Deutsch.</li></ul>',
                        examples: [
                            { de: 'Heute spiele ich Fußball.', uz: 'Bugun men futbol o\'ynayman.', tip: 'Vaqt 1-o\'rinda kelsa ham fe\'l 2-o\'rinda qoladi!' },
                            { de: 'Kommst du morgen?', uz: 'Ertaga kelasanmi?', tip: 'Ha/Yo\'q savollarida fe\'l 1-o\'rinda' },
                            { de: 'Was machst du am Wochenende?', uz: 'Dam olish kunida nima qilasan?', tip: 'W-savol: Was + fe\'l (2-o\'rin)' }
                        ]
                    }
                ],
                keyRules: [
                    'Darak gapda tuslangan fe\'l HAR DOIM ikkinchi o\'rinda (Position 2) turadi.',
                    'Ha/Yo\'q savollarida (Ja/Nein-Fragen) tuslangan fe\'l gapning birinchi o\'rniga chiqadi (Kommst du?).',
                    '"sein" fe\'lining shakllari butunlay o\'zgaradi: bin, bist, ist, sind, seid, sind — buni yodlash shart!',
                    '"haben" fe\'li "du" va "er/sie/es" shaxslarida o\'zakdagi "b" harfini yo\'qotadi: du hast, er hat.'
                ]
            },
            flashcards: [
                { front: 'lernen', back: 'o\'rganmoq / dars qilmoq', tip: 'muntazam fe\'l: ich lerne, du lernst' },
                { front: 'machen', back: 'qilmoq / bajarmoq', tip: 'muntazam: ich mache, er macht' },
                { front: 'wohnen', back: 'yashamoq', tip: 'ich wohne, du wohnst' },
                { front: 'kommen', back: 'kelmoq', tip: 'ich komme, er kommt' },
                { front: 'arbeiten', back: 'ishlamoq', tip: 'du arbeitest, er arbeitet (-et oladi)' },
                { front: 'heißen', back: 'atalmoq / ismi ... bo\'lmoq', tip: 'du heißt, er heißt' },
                { front: 'sein', back: 'bo\'lmoq (to be)', tip: 'ich bin, du bist, er ist, wir sind' },
                { front: 'haben', back: 'ega bo\'lmoq (to have)', tip: 'ich habe, du hast, er hat' },
                { front: 'spielen', back: 'o\'ynamoq', tip: 'ich spiele, du spielst' },
                { front: 'hören', back: 'eshitmoq / tinglamoq', tip: 'ich höre, du hörst' },
                { front: 'schreiben', back: 'yozmoq', tip: 'ich schreibe, du schreibst' },
                { front: 'lesen', back: 'o\'qimoq (mutolaa qilmoq)', tip: 'kuchli fe\'l: du liest, er liest' },
                { front: 'sprechen', back: 'gapirmoq', tip: 'kuchli fe\'l: du sprichst, er spricht' },
                { front: 'verstehen', back: 'tushunmoq', tip: 'ich verstehe, wir verstehen' },
                { front: 'fragen', back: 'so\'ramoq', tip: 'ich frage, du fragst' }
            ],
            test: [
                {
                    q: '"du" shaxsida "lernen" fe\'li qanday tuslanadi?',
                    options: ['lerne', 'lernst', 'lernt', 'lernen'],
                    answer: 1,
                    explanation: '"du" olmoshi bilan muntazam fe\'llar "-st" qo\'shimchasini oladi: "du lernst".'
                },
                {
                    q: '"sein" fe\'lining "wir" shaxsidagi shakli qaysi?',
                    options: ['bin', 'bist', 'seid', 'sind'],
                    answer: 3,
                    explanation: '"wir sind" = biz ...miz. sein tuslanishi: wir sind, ihr seid, sie sind.'
                },
                {
                    q: '"er" shaxsida "haben" fe\'li qanday bo\'ladi?',
                    options: ['habe', 'habst', 'hat', 'habt'],
                    answer: 2,
                    explanation: '"haben" fe\'li er/sie/es da "hat" bo\'ladi (b harfi tushib qoladi).'
                },
                {
                    q: 'Nemis tilidagi darak gaplarda fe\'l nechanchi o\'rinda turadi?',
                    options: ['Birinchi o\'rinda', 'Har doim ikkinchi o\'rinda', 'Oxirgi o\'rinda', 'Uchinchi o\'rinda'],
                    answer: 1,
                    explanation: 'Darak gaplarda tuslangan fe\'l har doim ikkinchi pozitsiyada (Position 2) turadi.'
                },
                {
                    q: '"du" shaxsida "heißen" fe\'li qanday qo\'shimcha oladi?',
                    options: ['-st (du heißst)', '-t (du heißt)', '-en (du heißen)', '-e (du heiße)'],
                    answer: 1,
                    explanation: 'O\'zagi "ß", "s", "z" bilan tugagan fe\'llarga "du" shaxsida faqat "-t" qo\'shiladi: "du heißt".'
                },
                {
                    q: '"arbeiten" fe\'lining "er" shaxsidagi shakli qaysi?',
                    options: ['arbeitt', 'arbeitet', 'arbeitest', 'arbeiten'],
                    answer: 1,
                    explanation: 'O\'zagi "t" yoki "d" bilan tugagan fe\'llarga talaffuz osonligi uchun "-et" qo\'shiladi: "er arbeitet".'
                },
                {
                    q: '"Kommst du aus Usbekistan?" — bu qanday turdagi gap?',
                    options: ['Darak gap', 'W-Frage (maxsus so\'roq)', 'Ja/Nein-Frage (ha/yo\'q so\'roq gapi)', 'Buyruq gap'],
                    answer: 2,
                    explanation: 'Fe\'l birinchi o\'rinda kelib, ha yoki yo\'q javobini talab qiluvchi so\'roq: Ja/Nein-Frage.'
                },
                {
                    q: 'Bo\'sh o\'ringa mos fe\'l shakli: "Ihr ___ sehr freundlich."',
                    options: ['bist', 'seid', 'sind', 'ist'],
                    answer: 1,
                    explanation: '"ihr" kishilik olmoshi bilan "sein" fe\'li "seid" bo\'ladi: "ihr seid".'
                },
                {
                    q: '"Heute ___ ich nach Hause." Bo\'sh joyga qaysi fe\'l shakli to\'g\'ri keladi?',
                    options: ['gehe', 'gehen', 'gehst', 'geht'],
                    answer: 0,
                    explanation: 'Ega "ich" bo\'lgani sababli fe\'l "-e" oladi va 2-o\'rinda turadi: "Heute gehe ich...".'
                },
                {
                    q: '"sprechen" fe\'li "er" shaxsida qanday o\'zgaradi?',
                    options: ['er sprecht', 'er sprichst', 'er spricht', 'er sprechen'],
                    answer: 2,
                    explanation: '"sprechen" kuchli fe\'l bo\'lib, o\'zakdagi e -> i ga o\'zgaradi: "er spricht".'
                }
            ],
            gamePairs: [
                { de: 'ich bin', uz: 'men ...man (sein)' },
                { de: 'du bist', uz: 'sen ...san (sein)' },
                { de: 'wir haben', uz: 'bizda bor (haben)' },
                { de: 'er hat', uz: 'unda bor (haben)' },
                { de: 'lernen', uz: 'o\'rganmoq' },
                { de: 'arbeiten', uz: 'ishlamoq' },
                { de: 'wohnen', uz: 'yashamoq' },
                { de: 'sprechen', uz: 'gapirmoq' }
            ]
        },

        // ====================================================================
        // TOPIC 5: Essen, Trinken, Einkaufen & Akkusativ: den/einen
        // ====================================================================
        {
            id: 'a1_5',
            number: 5,
            title: 'Oziq-ovqat, Xarid va Akkusativ',
            germanTitle: 'Essen, Trinken, Einkaufen & Akkusativ: den/einen',
            icon: '🍏',
            description: 'Oziq-ovqatlar, bozor va restoranda xarid qilish hamda tushum kelishigi (Akkusativ: den, einen, keinen).',
            theory: {
                summary: 'Nemis tilining eng faol kelishigi — Akkusativ (tushum kelishigi: kimni? nimani?). Ushbu darsda oziq-ovqat va ichimliklar vositasida xarid qilish hamda Akkusativni to\'liq o\'rganasiz.',
                sections: [
                    {
                        heading: '1. Oziq-ovqat va Ichimliklar (Essen und Trinken)',
                        content: '<p>Oziq-ovqat mahsulotlari jinsi bilan yodlanadi:</p><ul><li><strong>der:</strong> der Apfel (olma), der Tee (choy), der Kaffee (qahva), der Käse (pishloq), der Fisch (baliq), der Salat (salat), der Reis (guruch)</li><li><strong>die:</strong> die Banane (banan), die Milch (sut), die Tomate (pomidor), die Kartoffel (kartoshka), die Pizza (pitsa), die Suppe (sho\'rva)</li><li><strong>das:</strong> das Brot (non), das Brötchen (bulochka), das Wasser (suv), das Fleisch (go\'sht), das Ei (tuxum), das Obst (meva), das Gemüse (sabzavot)</li></ul>',
                        examples: [
                            { de: 'Zum Frühstück esse ich Brot mit Käse.', uz: 'Nonushtaga pishloqli non yeyman.', tip: 'das Frühstück = nonushta' },
                            { de: 'Ich trinke gern Tee mit Zitrone.', uz: 'Men limonli choyni sevib ichaman.', tip: 'gern = bajonidil / yoqtirib' },
                            { de: 'Obst und Gemüse sind sehr gesund.', uz: 'Meva va sabzavotlar juda foydali.', tip: 'gesund = sog\'lom / foydali' }
                        ]
                    },
                    {
                        heading: '2. Akkusativ qoidasi (Tushum kelishigi: Wen? Was?)',
                        content: '<p>Akkusativ "Kimni? Nimani?" (Wen? Was?) so\'rog\'iga javob beradi.</p><p><strong>Akkusativning Oltin Qoidasi:</strong> Faqatgina <strong>Muzskoy rod (der)</strong> o\'zgaradi! Qolgan barcha jinslar o\'zgarishsiz qoladi:</p><table style="width:100%; border-collapse:collapse; margin:10px 0;"><thead><tr style="background:rgba(255,255,255,0.08); text-align:left;"><th style="padding:8px;">Jins</th><th style="padding:8px;">Nominativ (Bosh kelishik)</th><th style="padding:8px;">Akkusativ (Tushum kelishigi)</th></tr></thead><tbody><tr><td style="padding:8px;">Maskulin</td><td style="padding:8px;">der / ein / kein Tisch</td><td style="padding:8px;"><strong>den / einen / keinen</strong> Tisch</td></tr><tr><td style="padding:8px;">Feminin</td><td style="padding:8px;">die / eine / keine Lampe</td><td style="padding:8px;"><strong>die / eine / keine</strong> Lampe</td></tr><tr><td style="padding:8px;">Neutral</td><td style="padding:8px;">das / ein / kein Buch</td><td style="padding:8px;"><strong>das / ein / kein</strong> Buch</td></tr><tr><td style="padding:8px;">Plural</td><td style="padding:8px;">die / — / keine Bücher</td><td style="padding:8px;"><strong>die / — / keine</strong> Bücher</td></tr></tbody></table><p>Akkusativ talab qiluvchi fe\'llar: <em>haben, brauchen, möchten, essen, trinken, kaufen, nehmen, sehen</em>.</p>',
                        examples: [
                            { de: 'Ich möchte einen Apfel und eine Banane.', uz: 'Men bitta olma va bitta banan xohlayman.', tip: 'der Apfel -> einen Apfel (Akkusativ)' },
                            { de: 'Wir trinken einen Kaffee und ein Wasser.', uz: 'Biz bitta qahva va bitta suv ichamiz.', tip: 'der Kaffee -> einen Kaffee, das Wasser o\'zgarmaydi' },
                            { de: 'Ich habe keinen Hunger.', uz: 'Mening qornim och emas.', tip: 'der Hunger -> keinen Hunger' }
                        ]
                    },
                    {
                        heading: '3. Bozor va Do\'konda xarid qilish (Einkaufen)',
                        content: '<p>Supermarket va bozorda zarur bo\'ladigan asosiy iboralar:</p><ul><li><strong>Was möchten Sie? / Was darf es sein?</strong> — Nima xohlaysiz? Nima buyurasiz?</li><li><strong>Ich möchte... / Ich hätte gern...</strong> — Menga ... bersangiz / ... olmoqchi edim.</li><li><strong>Wie viel kostet das? / Was kostet...?</strong> — Bu qancha turadi?</li><li><strong>Das kostet 2 Euro 50 (zwei Euro fünfzig).</strong> — Bu 2 yevro 50 sent turadi.</li><li><strong>Sonst noch etwas?</strong> — Yana biror narsami? → <strong>Nein danke, das ist alles.</strong> (Yo\'q rahmat, hammasi shu.)</li></ul>',
                        examples: [
                            { de: 'Was kostet ein Kilo Tomaten?', uz: 'Bir kilo pomidor qancha turadi?', tip: 'Narx so\'rash: Was kostet...?' },
                            { de: 'Ich hätte gern zwei Flaschen Milch.', uz: 'Ikkita shisha sut olmoqchi edim.', tip: 'Ich hätte gern = xushmuomala buyurtma' },
                            { de: 'Das ist alles, vielen Dank!', uz: 'Hammasi shu, katta rahmat!', tip: 'Xaridni yakunlash' }
                        ]
                    }
                ],
                keyRules: [
                    'Akkusativda (tushum kelishigida) FAQATGINA MUZSKOY (der) o\'zgaradi: der → den, ein → einen, kein → keinen.',
                    'Jenskiy (die/eine), Neytral (das/ein) va Ko\'plik (die/keine) Akkusativda mutlaqo O\'ZGARMAYDI.',
                    '"haben", "brauchen", "möchten", "kaufen", "essen", "trinken" fe\'llaridan keyin doimo Akkusativ keladi.',
                    'Xarid va buyurtmada "Ich will..." (qo\'pol) o\'rniga doimo "Ich möchte..." yoki "Ich hätte gern..." ishlatiladi.'
                ]
            },
            flashcards: [
                { front: 'der Apfel', back: 'olma', tip: 'muzskoy: der Apfel, Plural: die Äpfel' },
                { front: 'das Brot', back: 'non', tip: 'neytral: das Brot, Plural: die Brote' },
                { front: 'das Brötchen', back: 'kichik noncha / bulochka', tip: 'neytral (-chen qo\'shimchasi)' },
                { front: 'die Milch', back: 'sut', tip: 'jenskiy: die Milch' },
                { front: 'der Käse', back: 'pishloq / sir', tip: 'muzskoy: der Käse' },
                { front: 'das Fleisch', back: 'go\'sht', tip: 'neytral: das Fleisch' },
                { front: 'der Fisch', back: 'baliq', tip: 'muzskoy: der Fisch' },
                { front: 'das Wasser', back: 'suv', tip: 'neytral: das Wasser' },
                { front: 'der Tee', back: 'choy', tip: 'muzskoy: der Tee' },
                { front: 'der Kaffee', back: 'qahva', tip: 'muzskoy: der Kaffee' },
                { front: 'das Ei', back: 'tuxum', tip: 'neytral: das Ei, Plural: die Eier' },
                { front: 'kaufen', back: 'sotib olmoq', tip: 'fe\'l + Akkusativ' },
                { front: 'essen', back: 'yemoq', tip: 'kuchli fe\'l: du isst, er isst' },
                { front: 'trinken', back: 'ichmoq', tip: 'ich trinke, du trinkst' },
                { front: 'kosten', back: 'narxda turmoq', tip: 'Was kostet das?' }
            ],
            test: [
                {
                    q: 'Akkusativ (tushum kelishigi)da qaysi jins artikeli o\'zgaradi?',
                    options: ['Faqat neytral (das)', 'Faqat jenskiy (die)', 'Faqat muzskoy (der)', 'Barcha jinslar o\'zgaradi'],
                    answer: 2,
                    explanation: 'Akkusativda faqat muzskoy rod o\'zgaradi: der -> den, ein -> einen, kein -> keinen.'
                },
                {
                    q: '"Ich möchte ___ Apfel." Bo\'sh o\'ringa mos artikelni qo\'ying:',
                    options: ['ein', 'eine', 'einen', 'einem'],
                    answer: 2,
                    explanation: '"der Apfel" muzskoy jinsda, "möchten" fe\'li Akkusativ talab qilgani uchun "einen Apfel" bo\'ladi.'
                },
                {
                    q: '"Ich trinke ___ Milch." (Men sut ichmayman) Bo\'sh joyga to\'g\'ri inkor so\'zi:',
                    options: ['kein', 'keine', 'keinen', 'nicht'],
                    answer: 1,
                    explanation: '"die Milch" jenskiy bo\'lib, Akkusativda ham "keine" shaklida qoladi.'
                },
                {
                    q: '"Wie viel kostet das?" savolining ma\'nosi nima?',
                    options: ['Bu qancha turadi?', 'Bu qayerda sotiladi?', 'Bu qanday mahsulot?', 'Qachon ochiladi?'],
                    answer: 0,
                    explanation: '"Wie viel kostet das?" = Bu qancha turadi? degan ma\'noni anglatadi.'
                },
                {
                    q: '"essen" fe\'lining "du" shaxsidagi tuslanishi qanday?',
                    options: ['esst', 'isst', 'essest', 'esstet'],
                    answer: 1,
                    explanation: '"essen" kuchli fe\'l: o\'zakdagi e -> i ga aylanadi: "du isst", "er isst".'
                },
                {
                    q: 'Do\'konda xaridni tugatganda nima deb aytiladi?',
                    options: ['Gute Reise!', 'Das ist alles, danke.', 'Ich verstehe nicht.', 'Wie bitte?'],
                    answer: 1,
                    explanation: '"Das ist alles, danke" = Hammasi shu, rahmat.'
                },
                {
                    q: '"Wir brauchen ___ Tisch." (Bizga bitta stol kerak)',
                    options: ['ein', 'eine', 'einen', 'einem'],
                    answer: 2,
                    explanation: '"der Tisch" muzskoy rod, "brauchen" esa Akkusativ talab qiladi: "einen Tisch".'
                },
                {
                    q: '"das Brötchen" so\'zi nimani bildiradi?',
                    options: ['Katta non', 'Kichik bulochka / noncha', 'Tuxum', 'Pishloq'],
                    answer: 1,
                    explanation: '"das Brötchen" nemis nonushtasining ajralmas qismi — kichik noncha / bulochkadir.'
                },
                {
                    q: '"haben" fe\'lidan keyin ot qaysi kelishikda keladi?',
                    options: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'],
                    answer: 1,
                    explanation: '"haben" fe\'li har doim Akkusativ (tushum kelishigi)ni talab qiladi.'
                },
                {
                    q: '"das Wasser" so\'zi Akkusativda qanday shaklda bo\'ladi?',
                    options: ['den Wasser', 'dem Wasser', 'das Wasser (o\'zgarmaydi)', 'des Wassers'],
                    answer: 2,
                    explanation: 'Neytral (das) va jenskiy (die) otlar Akkusativda shaklini o\'zgartirmaydi.'
                }
            ],
            gamePairs: [
                { de: 'der Apfel', uz: 'olma' },
                { de: 'das Brot', uz: 'non' },
                { de: 'die Milch', uz: 'sut' },
                { de: 'der Käse', uz: 'pishloq' },
                { de: 'das Fleisch', uz: 'go\'sht' },
                { de: 'das Wasser', uz: 'suv' },
                { de: 'einen Kaffee', uz: 'qahvani (Akkusativ)' },
                { de: 'Wie viel kostet', uz: 'Qancha turadi' }
            ]
        },

        // ====================================================================
        // TOPIC 6: Uhrzeit, Tagesablauf & Trennbare Verben
        // ====================================================================
        {
            id: 'a1_6',
            number: 6,
            title: 'Vaqt, Soat va Ajraluvchi fe\'llar',
            germanTitle: 'Uhrzeit, Tagesablauf & Trennbare Verben: aufstehen, anrufen...',
            icon: '⏰',
            description: 'Soat necha bo\'lganini aytish, kun tartibi va ajraluvchi old qo\'shimchali fe\'llar (aufstehen, anrufen, einkaufen).',
            theory: {
                summary: 'Nemis tilida vaqtni aytish va kun tartibini so\'zlash uchun ajraluvchi fe\'llar (Trennbare Verben) nihoyatda muhim. Ushbu darsda ikkala mavzuni birgalikda o\'zlashtirasiz.',
                sections: [
                    {
                        heading: '1. Soat va Vaqtni aytish (Die Uhrzeit)',
                        content: '<p>Soatni so\'rash: <strong>Wie spät ist es?</strong> yoki <strong>Wie viel Uhr ist es?</strong> (Soat necha bo\'ldi?)</p><ul><li><strong>Rasmiy shakl (Offiziell):</strong> 24 soatlik format, poezd, samolyot va yangiliklarda:<br>14:15 = <em>vierzehn Uhr fünfzehn</em><br>08:30 = <em>acht Uhr dreißig</em></li><li><strong>Norasmiy shakl (Umgangssprachlich):</strong> Og\'zaki nutqda:<br><strong>vor</strong> = qoldi, <strong>nach</strong> = o\'tdi, <strong>Viertel</strong> = chorak (15 daqiqa), <strong>halb</strong> = yarim.<br>08:15 = <em>Viertel nach acht</em> (sakkizdan 15 o\'tdi)<br>08:30 = <strong>halb neun</strong> (to\'qqiz yarim! Diqqat: kelgusi soatning yarmi aytiladi!)<br>08:45 = <em>Viertel vor neun</em> (to\'qqiztaga 15 ta qoldi)</li></ul>',
                        examples: [
                            { de: 'Es ist genau acht Uhr.', uz: 'Ayni soat sakkiz bo\'ldi.', tip: 'Aniq soat' },
                            { de: 'Es ist halb zehn (9:30).', uz: 'Soat to\'qqiz yarim.', tip: 'halb zehn = 9:30 (10 ga yarim soat qoldi)!' },
                            { de: 'Um wie viel Uhr beginnt der Kurs?', uz: 'Kurs soat nechada boshlanadi?', tip: 'Soat bilan "um" predlogi ishlatiladi' }
                        ]
                    },
                    {
                        heading: '2. Ajraluvchi fe\'llar (Trennbare Verben)',
                        content: '<p>Nemis tilida ba\'zi fe\'llarning prefiksi (old qo\'shimchasi) urg\'uli bo\'lib, hozirgi zamonda fe\'l o\'zagidan <strong>AJRALIB, gapning eng OXIRIGA</strong> boradi:</p><p>Asosiy ajraluvchi prefikslar: <strong>ab-, an-, auf-, aus-, ein-, mit-, vor-, zu-</strong>.</p><ul><li><strong>aufstehen</strong> (o\'rnidan turmoq): Ich stehe um 6 Uhr <strong>auf</strong>.</li><li><strong>anrufen</strong> (telefon qilmoq): Er ruft seine Mutter <strong>an</strong>.</li><li><strong>einkaufen</strong> (bozorlik qilmoq): Wir kaufen im Supermarkt <strong>ein</strong>.</li><li><strong>fernsehen</strong> (televizor ko\'rmoq): Am Abend sieht er <strong>fern</strong>.</li><li><strong>mitkommen</strong> (birga bormoq): Kommst du <strong>mit</strong>?</li><li><strong>anfangen</strong> (boshlanmoq): Der Unterricht fängt um 9 Uhr <strong>an</strong>.</li></ul>',
                        examples: [
                            { de: 'Ich stehe jeden Morgen um sechs Uhr auf.', uz: 'Men har kuni ertalab soat oltida o\'rnimdan turaman.', tip: 'aufstehen: stehe (2-o\'rin) ... auf (gap oxirida)' },
                            { de: 'Wann rufst du mich an?', uz: 'Menga qachon telefon qilasan?', tip: 'anrufen: rufst ... an (oxirda)' },
                            { de: 'Am Samstag kaufe ich im Supermarkt ein.', uz: 'Shanba kuni men supermarketda xarid qilaman.', tip: 'einkaufen: kaufe ... ein (oxirda)' }
                        ]
                    },
                    {
                        heading: '3. Kun tartibi va Vaqt predloglari (Tagesablauf & Zeitangaben)',
                        content: '<p>Kun tartibini ifodalashda predloglar juda muhim rol o\'ynaydi:</p><ul><li><strong>um</strong> — aniq soat vaqtlari bilan: <em>um 8 Uhr, um halb neun</em></li><li><strong>am</strong> — hafta kunlari va kun paytlari bilan: <em>am Montag, am Morgen, am Nachmittag, am Abend, am Wochenende</em></li><li><strong>im</strong> — oylar va fasllar bilan: <em>im Mai, im Sommer</em></li><li><strong>Muhim istisno:</strong> Tunda demoqchi bo\'lsak — <strong>in der Nacht</strong> ishlatiladi!</li></ul>',
                        examples: [
                            { de: 'Am Vormittag arbeite ich, am Abend lerne ich Deutsch.', uz: 'Tushgacha ishlayman, kechqurun nemis tili o\'rganaman.', tip: 'am Vormittag, am Abend' },
                            { de: 'Der Zug fährt um 15 Uhr ab.', uz: 'Poyezd soat 15:00 da jo\'nab ketadi.', tip: 'abfahren: fährt ... ab' },
                            { de: 'In der Nacht schlafe ich fest.', uz: 'Tunda men qattiq uxlayman.', tip: 'in der Nacht (istisno)' }
                        ]
                    }
                ],
                keyRules: [
                    'Soat bilan "UM" predlogi ishlatiladi (um 8 Uhr), hafta kunlari va kun paytlari bilan "AM" ishlatiladi (am Montag, am Abend).',
                    'Istisno holat: "am Nacht" emas, balki "in der Nacht" (tunda) deb aytiladi.',
                    'Ajraluvchi fe\'llarda prefiks (ab, an, auf, ein...) darak gapda gapning ENG OXIRIGA o\'tadi.',
                    'Nemischa "halb" kelgusi soatni bildiradi: "halb acht" = 7:30 (sakkiz yarim emas, yetti yarim!).'
                ]
            },
            flashcards: [
                { front: 'die Uhrzeit', back: 'vaqt / soat vaqti', tip: 'Wie spät ist es?' },
                { front: 'aufstehen', back: 'o\'rnidan turmoq (uyqudan)', tip: 'ajraluvchi: ich stehe auf' },
                { front: 'anrufen', back: 'telefon qilmoq', tip: 'ajraluvchi: ich rufe an' },
                { front: 'einkaufen', back: 'bozorlik qilmoq', tip: 'ajraluvchi: ich kaufe ein' },
                { front: 'fernsehen', back: 'televizor ko\'rmoq', tip: 'ajraluvchi: du siehst fern' },
                { front: 'abfahren', back: 'jo\'nab ketmoq (transport)', tip: 'ajraluvchi: der Zug fährt ab' },
                { front: 'anfangen', back: 'boshlanmoq', tip: 'ajraluvchi: der Kurs fängt an' },
                { front: 'aufhören', back: 'to\'xtatmoq / tugatmoq', tip: 'ajraluvchi: hör auf!' },
                { front: 'mitkommen', back: 'birga bormoq', tip: 'ajraluvchi: kommst du mit?' },
                { front: 'halb', back: 'yarim', tip: 'halb acht = 7:30' },
                { front: 'das Viertel', back: 'chorak (15 daqiqa)', tip: 'Viertel nach / vor' },
                { front: 'vor / nach', back: 'qoldi / o\'tdi', tip: 'soat aytishda: vor (qoldi), nach (o\'tdi)' },
                { front: 'am Morgen', back: 'ertalab', tip: 'am + kun payti' },
                { front: 'am Abend', back: 'kechqurun', tip: 'am + kun payti' },
                { front: 'in der Nacht', back: 'tunda', tip: 'istisno: in der Nacht' }
            ],
            test: [
                {
                    q: 'Nemis tilida "halb neun" soati nechini anglatadi?',
                    options: ['9:30', '8:30', '10:30', '9:15'],
                    answer: 1,
                    explanation: '"halb" keyingi soatning yarmini bildiradi, demak "halb neun" = 8:30 (to\'qqizga yarim soat qoldi).'
                },
                {
                    q: 'Aniq soat vaqtlari bilan qaysi predlog ishlatiladi?',
                    options: ['am', 'im', 'um', 'an'],
                    answer: 2,
                    explanation: 'Aniq soatlar bilan doimo "um" predlogi qo\'llanadi: "um 8 Uhr".'
                },
                {
                    q: '"aufstehen" fe\'li gapda qanday to\'g\'ri ishlatiladi?',
                    options: ['Ich aufstehe um 7 Uhr.', 'Ich stehe um 7 Uhr auf.', 'Ich aufstehen um 7 Uhr.', 'Stehe auf ich um 7 Uhr.'],
                    answer: 1,
                    explanation: 'Ajraluvchi fe\'llarda o\'zak (stehe) 2-o\'rinda, prefiks (auf) esa gapning eng oxirida turadi.'
                },
                {
                    q: 'Hafta kunlari (Montag, Dienstag...) bilan qaysi predlog ishlatiladi?',
                    options: ['im', 'am', 'um', 'in'],
                    answer: 1,
                    explanation: 'Hafta kunlari bilan "am" ishlatiladi: am Montag, am Dienstag, am Wochenende.'
                },
                {
                    q: '"Viertel vor acht" qaysi vaqtni bildiradi?',
                    options: ['08:15', '07:45', '08:45', '07:15'],
                    answer: 1,
                    explanation: '"Viertel vor acht" = sakkiztaga chorak (15 daqiqa) qoldi, ya\'ni 07:45.'
                },
                {
                    q: 'Qaysi biri ajraluvchi fe\'l EMAS?',
                    options: ['anrufen', 'einkaufen', 'aufstehen', 'verstehen'],
                    answer: 3,
                    explanation: '"verstehen" ajralmaydigan fe\'l (ver- prefiksi hech qachon ajralmaydi).'
                },
                {
                    q: '"Tunda" iborasi nemis tilida qanday to\'g\'ri ifodalanadi?',
                    options: ['am Nacht', 'im Nacht', 'in der Nacht', 'um Nacht'],
                    answer: 2,
                    explanation: 'die Nacht ayol jinsida bo\'lgani uchun istisno tariqasida "in der Nacht" deyiladi.'
                },
                {
                    q: 'Bo\'sh joyni to\'ldiring: "Wann fängt der Film ___?"',
                    options: ['ein', 'auf', 'an', 'aus'],
                    answer: 2,
                    explanation: '"anfangen" (boshlanmoq) fe\'li bo\'lgani uchun gap oxiriga "an" prefiksi boradi.'
                },
                {
                    q: '"Wie spät ist es?" savolining o\'zbekcha ma\'nosi nima?',
                    options: ['Qayerga ketyapsiz?', 'Soat necha bo\'ldi?', 'Qachon kelasiz?', 'Bugun qaysi kun?'],
                    answer: 1,
                    explanation: '"Wie spät ist es?" yoki "Wie viel Uhr ist es?" = Soat necha bo\'ldi?'
                },
                {
                    q: '"anrufen" fe\'lining "er" shaxsidagi to\'g\'ri qo\'llanishi:',
                    options: ['Er ruft seine Mutter an.', 'Er anruft seine Mutter.', 'Er ruft an seine Mutter.', 'Er anrufen seine Mutter.'],
                    answer: 0,
                    explanation: 'Prefiks gapning oxiriga chiqadi: "Er ruft seine Mutter an".'
                }
            ],
            gamePairs: [
                { de: 'aufstehen', uz: 'o\'rnidan turmoq' },
                { de: 'anrufen', uz: 'telefon qilmoq' },
                { de: 'einkaufen', uz: 'bozorlik qilmoq' },
                { de: 'fernsehen', uz: 'televizor ko\'rmoq' },
                { de: 'halb acht', uz: 'yetti yarim (7:30)' },
                { de: 'Viertel nach', uz: 'chorak o\'tdi (15 daqiqa)' },
                { de: 'am Montag', uz: 'dushanba kuni' },
                { de: 'um wie viel Uhr', uz: 'soat nechada' }
            ]
        },

        // ====================================================================
        // TOPIC 7: Wohnen, Möbel & Lokale Präpositionen: in, an, auf
        // ====================================================================
        {
            id: 'a1_7',
            number: 7,
            title: 'Uy-joy, Mebel va Joylashuv predloglari',
            germanTitle: 'Wohnen, Möbel & Lokale Präpositionen: in, an, auf',
            icon: '🏠',
            description: 'Xonadon, xonalar, mebellar, ijara masalalari va qayerda (Wo? + Dativ) joylashuv predloglari.',
            theory: {
                summary: 'Ushbu darsda uy-joy, mebellar, ijara xonadonini qidirish so\'zlari hamda qayerda (Wo?) so\'rog\'iga javob beruvchi joylashuv predloglari va Dativ asoslarini o\'rganasiz.',
                sections: [
                    {
                        heading: '1. Xonadon va Xonalar (Die Wohnung und die Zimmer)',
                        content: '<p>Uy-joy bilan bog\'liq asosiy so\'zlar:</p><ul><li><strong>das Haus</strong> — uy / hovli</li><li><strong>die Wohnung</strong> — kvartira / xonadon</li><li><strong>das Wohnzimmer</strong> — mehmonxona (yashash xonasi)</li><li><strong>das Schlafzimmer</strong> — yotoqxona</li><li><strong>das Kinderzimmer</strong> — bolalar xonasi</li><li><strong>die Küche</strong> — oshxona</li><li><strong>das Bad / Badezimmer</strong> — hammom / yuvinish xonasi</li><li><strong>der Flur</strong> — dahliz / koridor</li><li><strong>der Balkon</strong> — balkon</li><li><strong>der Garten</strong> — bog\'</li></ul><p>Uy ta\'rifi: <strong>hell</strong> (yorug\'), <strong>dunkel</strong> (qorong\'i), <strong>groß</strong> (katta), <strong>klein</strong> (kichik), <strong>ruhig</strong> (tinch), <strong>laut</strong> (shovqin), <strong>teuer</strong> (qimmat), <strong>günstig / billig</strong> (arzon/qulay), <strong>die Miete</strong> (ijara haqi).</p>',
                        examples: [
                            { de: 'Unsere Wohnung hat drei Zimmer, eine Küche und ein Bad.', uz: 'Bizning xonadonimizda uchta xona, oshxona va hammom bor.', tip: 'Wohnung = kvartira, Zimmer = xona' },
                            { de: 'Die Küche ist sehr hell und modern.', uz: 'Oshxona juda yorug\' va zamonaviy.', tip: 'hell = yorug\'' },
                            { de: 'Die Miete ist sehr günstig.', uz: 'Ijara haqi juda arzon.', tip: 'die Miete = ijara haqi' }
                        ]
                    },
                    {
                        heading: '2. Mebellar (Die Möbel)',
                        content: '<p>Uy jihozlari va mebellar:</p><ul><li><strong>der Tisch</strong> — stol</li><li><strong>der Stuhl</strong> — stul</li><li><strong>der Schrank</strong> — shkaf / javon</li><li><strong>der Kühlschrank</strong> — muzlatgich (xolodilnik)</li><li><strong>der Teppich</strong> — gilam</li><li><strong>der Fernseher</strong> — televizor</li><li><strong>das Bett</strong> — karavot</li><li><strong>das Sofa</strong> — divan</li><li><strong>das Regal</strong> — kitob javoni / polka</li><li><strong>das Bild</strong> — rasm</li><li><strong>die Lampe</strong> — chiroq / lampa</li><li><strong>die Waschmaschine</strong> — kir yuvish mashinasi</li></ul>',
                        examples: [
                            { de: 'Im Wohnzimmer steht ein bequemes Sofa.', uz: 'Mehmonxonada qulay divan turibdi.', tip: 'das Sofa -> ein Sofa' },
                            { de: 'Der Kühlschrank steht in der Küche.', uz: 'Muzlatgich oshxonada turibdi.', tip: 'der Kühlschrank = muzlatgich' },
                            { de: 'Das Bett ist sehr groß und gemütlich.', uz: 'Karavot juda katta va shinam.', tip: 'das Bett = karavot' }
                        ]
                    },
                    {
                        heading: '3. Joylashuv predloglari (Lokale Präpositionen: Wo? + Dativ)',
                        content: '<p><strong>"Wo?" (Qayerda?)</strong> so\'rog\'i berilganda, joylashuv predloglaridan so\'ng <strong>DATIV</strong> keladi:</p><ul><li>der / das → <strong>dem</strong> (in dem = <strong>im</strong>, an dem = <strong>am</strong>, auf dem, unter dem...)</li><li>die → <strong>der</strong> (in der Küche, an der Wand, auf der Straße...)</li><li>die (Plural) → <strong>den</strong> + -n (unter den Tischen)</li></ul><p>Asosiy predloglar:</p><ul><li><strong>in</strong> — ichida: <em>im Zimmer</em> (xona ichida), <em>in der Küche</em></li><li><strong>auf</strong> — ustida (gorizontal yuzaga tegib turgan): <em>auf dem Tisch</em> (stol ustida)</li><li><strong>an</strong> — yonida / devorida (vertikal sirtga tegib turgan): <em>an der Wand</em> (devorda), <em>am Fenster</em> (deraza oldida)</li><li><strong>unter</strong> — tagida / ostida: <em>unter dem Bett</em> (karavot tagida)</li><li><strong>über</strong> — tepasida (tegmasdan): <em>über dem Tisch</em></li><li><strong>neben</strong> — yonida: <em>neben dem Schrank</em></li><li><strong>zwischen</strong> — o\'rtasida / orasida: <em>zwischen den Stühlen</em></li></ul>',
                        examples: [
                            { de: 'Das Buch liegt auf dem Tisch.', uz: 'Kitob stol ustida yotibdi.', tip: 'auf dem Tisch (der Tisch -> dem Tisch)' },
                            { de: 'Das Bild hängt an der Wand.', uz: 'Rasm devorda osilib turibdi.', tip: 'an der Wand (die Wand -> der Wand)' },
                            { de: 'Die Katze schläft unter dem Bett.', uz: 'Mushuk karavot tagida uxlayapti.', tip: 'unter dem Bett (das Bett -> dem Bett)' }
                        ]
                    }
                ],
                keyRules: [
                    '"Wo?" (Qayerda?) so\'rog\'iga javob berganda joylashuv predloglaridan so\'ng DATIV keladi (der/das → dem, die → der).',
                    '"in dem" qisqarib "im" bo\'ladi (im Zimmer), "an dem" esa qisqarib "am" bo\'ladi (am Fenster).',
                    'Gorizontal sirtga tegib turish uchun "auf" (auf dem Tisch), vertikal sirtga (devorga) tegish uchun "an" (an der Wand) ishlatiladi.',
                    '"liegen" (yotmoq), "stehen" (tik turmoq), "hängen" (osilib turmoq) fe\'llari joylashuv holatini ifodalaydi va Dativ bilan keladi.'
                ]
            },
            flashcards: [
                { front: 'die Wohnung', back: 'xonadon / kvartira', tip: 'die Wohnung, Plural: die Wohnungen' },
                { front: 'das Zimmer', back: 'xona', tip: 'neytral: das Zimmer' },
                { front: 'die Küche', back: 'oshxona', tip: 'jenskiy: die Küche' },
                { front: 'das Bad', back: 'hammom / yuvinish xonasi', tip: 'neytral: das Bad' },
                { front: 'das Wohnzimmer', back: 'mehmonxona (yashash xonasi)', tip: 'das Wohnzimmer' },
                { front: 'das Schlafzimmer', back: 'yotoqxona', tip: 'das Schlafzimmer' },
                { front: 'der Schrank', back: 'shkaf / javon', tip: 'muzskoy: der Schrank' },
                { front: 'das Bett', back: 'karavot', tip: 'neytral: das Bett' },
                { front: 'das Sofa', back: 'divan', tip: 'neytral: das Sofa' },
                { front: 'der Teppich', back: 'gilam', tip: 'muzskoy: der Teppich' },
                { front: 'der Kühlschrank', back: 'muzlatgich / xolodilnik', tip: 'kühl (salqin) + Schrank (javon)' },
                { front: 'die Miete', back: 'ijara haqi', tip: 'jenskiy: die Miete' },
                { front: 'auf', back: 'ustida (gorizontal sirtda)', tip: 'auf dem Tisch' },
                { front: 'an', back: 'yonida / devorida (vertikal sirtda)', tip: 'an der Wand' },
                { front: 'unter', back: 'tagida / ostida', tip: 'unter dem Bett' }
            ],
            test: [
                {
                    q: '"Qayerda?" so\'rog\'i nemis tilida qanday bo\'ladi?',
                    options: ['Wohin?', 'Woher?', 'Wo?', 'Wann?'],
                    answer: 2,
                    explanation: '"Wo?" = Qayerda? "Wohin?" = Qayerga?, "Woher?" = Qayerdan?'
                },
                {
                    q: 'Rasm devorda osilib turganda qaysi predlog ishlatiladi?',
                    options: ['auf der Wand', 'an der Wand', 'in der Wand', 'unter der Wand'],
                    answer: 1,
                    explanation: 'Devor kabi vertikal yuzalar uchun "an" predlogi ishlatiladi: "an der Wand".'
                },
                {
                    q: '"Das Buch liegt ___ Tisch." (der Tisch) Bo\'sh joyga to\'g\'ri shaklni qo\'ying:',
                    options: ['auf den', 'auf dem', 'in die', 'an das'],
                    answer: 1,
                    explanation: '"Wo?" so\'rog\'ida muzskoy rod (der Tisch) Dativda "dem Tisch" bo\'ladi: "auf dem Tisch".'
                },
                {
                    q: '"in dem" birikmasining qisqartma shakli qaysi?',
                    options: ['am', 'im', 'ins', 'ans'],
                    answer: 1,
                    explanation: '"in + dem" qisqarib "im" bo\'ladi (masalan: im Zimmer, im Haus).'
                },
                {
                    q: 'Oshxona nemis tilida nima deyiladi?',
                    options: ['das Bad', 'das Schlafzimmer', 'die Küche', 'der Flur'],
                    answer: 2,
                    explanation: '"die Küche" = oshxona. das Bad = hammom, das Schlafzimmer = yotoqxona.'
                },
                {
                    q: '"Kühlschrank" so\'zining o\'zbekcha ma\'nosi nima?',
                    options: ['Kir yuvish mashinasi', 'Muzlatgich / xolodilnik', 'Gaz plitasi', 'Idish yuvgich'],
                    answer: 1,
                    explanation: '"der Kühlschrank" = muzlatgich (kühl = salqin, Schrank = javon/shkaf).'
                },
                {
                    q: '"Die Wohnung ist sehr ruhig." Ushbu gapning to\'g\'ri tarjimasi qaysi?',
                    options: ['Kvartira juda shovqinli.', 'Kvartira juda qimmat.', 'Kvartira juda tinch.', 'Kvartira juda qorong\'i.'],
                    answer: 2,
                    explanation: '"ruhig" = tinch, sokin degan ma\'noni anglatadi.'
                },
                {
                    q: 'Gilam polda yotgan holatda qaysi fe\'l ishlatiladi?',
                    options: ['stehen', 'liegen', 'hängen', 'sitzen'],
                    answer: 1,
                    explanation: 'Gorizontal tekislikda yotish holati uchun "liegen" fe\'li qo\'llanadi.'
                },
                {
                    q: '"unter" predlogining ma\'nosi nima?',
                    options: ['tepasida', 'tagida / ostida', 'orasida', 'orqasida'],
                    answer: 1,
                    explanation: '"unter" = ostida / tagida (masalan: unter dem Tisch = stol tagida).'
                },
                {
                    q: '"zwischen" predlogi qanday ma\'noni bildiradi?',
                    options: ['yonida', 'ichida', 'o\'rtasida / orasida', 'qarshisida'],
                    answer: 2,
                    explanation: '"zwischen" = ikki narsa yoki shaxs o\'rtasida / orasida.'
                }
            ],
            gamePairs: [
                { de: 'die Wohnung', uz: 'xonadon / kvartira' },
                { de: 'die Küche', uz: 'oshxona' },
                { de: 'das Schlafzimmer', uz: 'yotoqxona' },
                { de: 'der Kühlschrank', uz: 'muzlatgich' },
                { de: 'das Sofa', uz: 'divan' },
                { de: 'auf dem Tisch', uz: 'stol ustida' },
                { de: 'an der Wand', uz: 'devorda' },
                { de: 'unter dem Bett', uz: 'karavot tagida' }
            ]
        }
    ]
};
