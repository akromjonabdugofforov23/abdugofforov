// ============================================================
// DEUTSCH AKADEMIYASI — NEMIS TILI A2 O'QUV DASTURI (CURRICULUM)
// Daraja: A2 — Grundstufe Deutsch (Asosiy daraja)
// Muallif: Nemis tili A2 ta'lim mutaxassisi
// ============================================================

if (typeof window === 'undefined') {
    var window = global;
}

window.deutschCurriculum = window.deutschCurriculum || {};
window.deutschCurriculum['A2'] = {
    level: 'A2',
    badge: '🌿 Asosiy',
    title: 'A2 — Grundstufe Deutsch (Asosiy daraja)',
    description: 'Kundalik vaziyatlarda erkin muloqot qilish va o\'tgan zamon hamda murakkabroq grammatikani o\'rganish.',
    topics: [
        // ============================================================
        // 1-MAVZU: O'tgan zamon: Perfekt
        // ============================================================
        {
            id: 'a2_1',
            number: 1,
            title: "O'tgan zamon: Perfekt",
            germanTitle: "Das Perfekt: haben oder sein, Partizip II",
            icon: "⏳",
            description: "Nemis tilida og'zaki nutqning asosiy o'tgan zamon shakli: haben va sein yordamchi fe'llari, Partizip II yasalishi hamda gap tuzilishi.",
            theory: {
                summary: "Nemis tilida o'tgan zamonda sodir bo'lgan voqea-hodisalarni og'zaki nutqda (kundalik suhbatlarda) ifodalash uchun asosan Perfekt zamoni qo'llaniladi. Perfekt formulasi: haben / sein (hozirgi zamonda tuslangan) + Partizip II (gap oxirida).",
                sections: [
                    {
                        heading: "1. Yordamchi fe'l tanlash: haben yoki sein?",
                        content: "<p>Perfekt zamonini to'g'ri qo'llashning birinchi siri — to'g'ri yordamchi fe'lni (<strong>haben</strong> yoki <strong>sein</strong>) tanlashdir. Ushbu yordamchi fe'llar shaxs va songa qarab tuslanadi va darak gapda qat'iy <strong>2-o'rinda</strong> keladi.</p><ul><li><strong>sein bilan yasaladigan fe'llar:</strong><br>1) <em>Harakat yo'nalishi yoki joy o'zgarishi:</em> gehen (bormoq), fahren (yurmoq/bormoq), fliegen (uchmoq), kommen (kelmoq), laufen (yugurmoq).<br>2) <em>Holat o'zgarishi:</em> aufstehen (uyg'onmoq/turmoq), einschlafen (uxlab qolmoq), sterben (vafot etmoq), wachsen (o'smoq).<br>3) <em>To'rtta maxsus fe'l:</em> sein (bo'lmoq &rarr; ist gewesen), bleiben (qolmoq &rarr; ist geblieben), werden (bo'lmoq &rarr; ist geworden), passieren (sodir bo'lmoq &rarr; ist passiert).</li><li><strong>haben bilan yasaladigan fe'llar (fe'llarning 90% qismi):</strong><br>1) Barcha tranzitiv (Akkusativ to'ldiruvchi talab qiladigan) fe'llar: kaufen, lesen, essen, trinken, schreiben.<br>2) Barcha o'zlik fe'llari (Reflexivverben): sich freuen, sich waschen, sich interessieren.<br>3) Joy o'zgarmaydigan, holat bildiruvchi davomiy fe'llar: schlafen, wohnen, arbeiten, warten.</li></ul>",
                        examples: [
                            { de: "Ich habe gestern ein interessantes Buch gelesen.", uz: "Men kecha qiziqarli kitob o'qidim.", tip: "lesen fe'li to'ldiruvchi olgani uchun haben bilan yasaladi; Partizip II gap oxirida." },
                            { de: "Wir sind am Wochenende nach Berlin gefahren.", uz: "Biz dam olish kunlarida Berlinga bordik.", tip: "fahren harakat yo'nalishini bildirgani sababli sein bilan yasaladi (wir sind)." },
                            { de: "Er ist heute Morgen sehr früh aufgestanden.", uz: "U bugun ertalab juda erta turdi.", tip: "aufstehen holat o'zgarishi fe'li bo'lgani uchun sein oladi." }
                        ]
                    },
                    {
                        heading: "2. Partizip II (Sifatdosh II) qanday yasaladi?",
                        content: "<p>Partizip II fe'lning turiga qarab turlicha yasaladi:</p><table class=\"curriculum-table\"><thead><tr><th>Fe'l turi</th><th>Yasalish qoidasi</th><th>Misollar</th></tr></thead><tbody><tr><td><strong>Kuchsiz (Muntazam)</strong></td><td>ge- + asos + -(e)t</td><td>machen &rarr; <strong>gemacht</strong><br>lernen &rarr; <strong>gelernt</strong><br>arbeiten &rarr; <strong>gearbeitet</strong></td></tr><tr><td><strong>Kuchli (Nomuntazam)</strong></td><td>ge- + o'zak o'zgarishi + -en</td><td>trinken &rarr; <strong>getrunken</strong><br>sprechen &rarr; <strong>gesprochen</strong><br>gehen &rarr; <strong>gegangen</strong></td></tr><tr><td><strong>Ajraladigan fe'llar</strong></td><td>prefiks + -ge- + asos + -t/-en</td><td>einkaufen &rarr; <strong>eingekauft</strong><br>aufstehen &rarr; <strong>aufgestanden</strong></td></tr><tr><td><strong>Ajralmaydigan fe'llar</strong> (be-, ver-, er-, ent-, zer-, emp-, ge-, miss-)</td><td>ge- qo'shimchasi <strong>olmaydi</strong>!</td><td>besuchen &rarr; <strong>besucht</strong><br>verstehen &rarr; <strong>verstanden</strong></td></tr><tr><td><strong>-ieren bilan tugovchi</strong></td><td>ge- qo'shimchasi <strong>olmaydi</strong>, faqat -t oladi</td><td>studieren &rarr; <strong>studiert</strong><br>telefonieren &rarr; <strong>telefoniert</strong></td></tr></tbody></table>",
                        examples: [
                            { de: "Hast du deine Hausaufgaben gemacht?", uz: "Uy vazifalaringni bajardingmi?", tip: "Kuchsiz fe'l: ge + mach + t = gemacht." },
                            { de: "Ich habe den Lehrer sehr gut verstanden.", uz: "Men o'qituvchini juda yaxshi tushundim.", tip: "verstehen fe'lida 'ver-' ajralmaydigan prefiks bo'lgani sababli ge- qo'shilmaydi." },
                            { de: "Er hat gestern lange mit seiner Mutter telefoniert.", uz: "U kecha onasi bilan uzoq telefonlashdi.", tip: "-ieren bilan tugaydigan xorijiy o'zlashma fe'llar ge- olmaydi." }
                        ]
                    },
                    {
                        heading: "3. Gapdagi so'z tartibi: Qavs qoidasi (Satzklammer)",
                        content: "<p>Nemis tilidagi Perfekt zamoni mashhur <strong>\"Satzklammer\" (gap qavsi)</strong> tamoyiliga tayanadi:</p><ul><li><strong>2-o'rinda:</strong> Yordamchi fe'l (haben / sein) shaxsga qarab tuslanadi.</li><li><strong>Gapning eng oxirida:</strong> Asosiy fe'lning Partizip II shakli o'zgarmagan holda turadi.</li><li>Oraliqdagi barcha to'ldiruvchilar va hol bo'laklari (qachon? qayerda? qanday?) shu ikki fe'l orasiga o'raladi.</li></ul><p><em>Eslatma:</em> <strong>sein</strong> va <strong>haben</strong> fe'llarining o'zi og'zaki nutqda ham Perfekt shaklida emas, balki Präteritumda (<em>ich war</em>, <em>ich hatte</em>) qo'llaniladi. Bu nutqni ancha yengil va tabiiy qiladi.</p>",
                        examples: [
                            { de: "Thomas hat gestern den ganzen Tag fleißig im Büro gearbeitet.", uz: "Tomas kecha kun bo'yi ofisda tirishqoqlik bilan ishladi.", tip: "hat (2-o'rinda) va gearbeitet (oxirgi o'rinda) butun gapni ramka ichiga oladi." },
                            { de: "Gestern war ich krank und hatte starkes Kopfweh.", uz: "Kecha men kasal edim va qattiq bosh og'rig'im bor edi.", tip: "sein va haben fe'llari o'tgan zamonda asosan war va hatte shaklida ishlatiladi." },
                            { de: "Wann bist du gestern nach Hause gekommen?", uz: "Kecha uyga soat nechada kelding?", tip: "So'roq gaplarda ham: bist (2-o'rinda), gekommen (eng oxirida)." }
                        ]
                    }
                ],
                keyRules: [
                    "Harakat yo'nalishi (fahren, gehen) va holat o'zgarishi (aufstehen) fe'llari 'sein' bilan, qolgan aksariyat fe'llar 'haben' bilan yasaladi.",
                    "Ajralmaydigan prefikslar (be-, ver-, er-, ent-, zer-) va '-ieren' bilan tugovchi fe'llar Partizip II da hech qachon 'ge-' qo'shimchasini olmaydi.",
                    "Ajraladigan fe'llarda 'ge-' prefiks bilan o'zak o'rtasiga tushadi: auf-ge-standen, ein-ge-kauft.",
                    "Gap ramkasi (Satzklammer): yordamchi fe'l 2-o'rinda tuslanadi, Partizip II esa qat'iy gap oxirida keladi."
                ]
            },
            flashcards: [
                { front: "aufstehen (ist aufgestanden)", back: "uyg'onmoq, o'rnidan turmoq", tip: "Holat o'zgarishi -> sein: Ich bin um 7 Uhr aufgestanden." },
                { front: "einschlafen (ist eingeschlafen)", back: "uxlab qolmoq", tip: "Holat o'zgarishi -> sein: Er ist sofort eingeschlafen." },
                { front: "fahren (ist gefahren)", back: "bormoq (transportda)", tip: "Harakat yo'nalishi -> sein: Wir sind nach Berlin gefahren." },
                { front: "gehen (ist gegangen)", back: "bormoq (piyoda)", tip: "Harakat yo'nalishi -> sein: Bist du nach Hause gegangen?" },
                { front: "bleiben (ist geblieben)", back: "qolmoq", tip: "Holat bildiradi, lekin qat'iy 'sein' oladi: Ich bin zu Hause geblieben." },
                { front: "passieren (ist passiert)", back: "sodir bo'lmoq, ro'y bermoq", tip: "sein oladi: Was ist passiert?" },
                { front: "verstehen (hat verstanden)", back: "tushunmoq", tip: "Ajralmaydigan 'ver-' sababli ge- olmaydi: Hast du alles verstanden?" },
                { front: "anrufen (hat angerufen)", back: "telefon qilmoq", tip: "Ajraladigan fe'l: Er hat mich gestern angerufen." },
                { front: "einkaufen (hat eingekauft)", back: "bozorlik qilmoq", tip: "Ajraladigan fe'l: Wir haben im Supermarkt eingekauft." },
                { front: "mitbringen (hat mitgebracht)", back: "o'zi bilan olib kelmoq", tip: "Aralash fe'l: Sie hat einen Kuchen mitgebracht." },
                { front: "treffen (hat getroffen)", back: "uchratmoq, uchrashmoq", tip: "Kuchli fe'l (e -> o): Ich habe Freunde getroffen." },
                { front: "schreiben (hat geschrieben)", back: "yozmoq", tip: "Kuchli fe'l (ei -> ie): Er hat eine E-Mail geschrieben." },
                { front: "fernsehen (hat ferngesehen)", back: "televizor ko'rmoq", tip: "Ajraladigan fe'l: Wir haben fernsehen geschaut / ferngesehen." },
                { front: "bezahlen (hat bezahlt)", back: "to'lamoq", tip: "Ajralmaydigan 'be-' -> ge- yo'q: Ich habe die Rechnung bezahlt." },
                { front: "studieren (hat studiert)", back: "oliygohda o'qimoq", tip: "-ieren qo'shimchasi -> ge- olmaydi: Er hat Medizin studiert." }
            ],
            test: [
                {
                    q: "Qaysi fe'l Perfekt zamonida 'sein' yordamchi fe'li bilan ishlatiladi?",
                    options: ["arbeiten", "kaufen", "aufstehen", "lesen"],
                    answer: 2,
                    explanation: "'aufstehen' holat o'zgarishini bildirgani sababli har doim 'sein' bilan ishlatiladi (ist aufgestanden)."
                },
                {
                    q: "Bo'sh joyni to'ldiring: 'Ich ___ gestern nach Samarkand gefahren.'",
                    options: ["habe", "bin", "hat", "ist"],
                    answer: 1,
                    explanation: "'fahren' harakat yo'nalishini bildiruvchi fe'l, shuning uchun 'ich' bilan 'bin' qo'yiladi."
                },
                {
                    q: "'studieren' fe'lining to'g'ri Partizip II shakli qaysi?",
                    options: ["gestudiert", "gestudieren", "studiert", "studierte"],
                    answer: 2,
                    explanation: "'-ieren' bilan tugaydigan xorijiy o'zlashma fe'llar 'ge-' prefiksini olmaydi: studiert."
                },
                {
                    q: "'einkaufen' (xarid qilmoq) fe'lining to'g'ri Partizip II shakli qaysi?",
                    options: ["geeinkauft", "eingekauft", "einkauft", "eingekaufen"],
                    answer: 1,
                    explanation: "Ajraladigan fe'llarda 'ge-' old qo'shimcha bilan o'zak o'rtasiga tushadi: ein-ge-kauft."
                },
                {
                    q: "Bo'sh joyga mos so'zni tanlang: 'Wir haben den ganzen Tag im Büro ___.'",
                    options: ["arbeiten", "gearbeitet", "gearbeiten", "gearbeit"],
                    answer: 1,
                    explanation: "Kuchsiz fe'l 'arbeiten': ge- + arbeit + -et = gearbeitet (t asos bilan tugagani uchun -et oladi)."
                },
                {
                    q: "Qaysi gapda nemis tili so'z tartibi (Satzklammer) to'g'ri tuzilgan?",
                    options: [
                        "Er hat gesehen gestern einen interessanten Film.",
                        "Er hat gestern einen interessanten Film gesehen.",
                        "Er gestern hat einen interessanten Film gesehen.",
                        "Er einen interessanten Film gestern gesehen hat."
                    ],
                    answer: 1,
                    explanation: "Darak gapda yordamchi fe'l (hat) 2-o'rinda, Partizip II (gesehen) esa qat'iy gapning oxirida kelishi shart."
                },
                {
                    q: "'verstehen' fe'lining Partizip II shakli nima sababdan 'ge-' qo'shimchasini olmaydi?",
                    options: [
                        "'ver-' ajralmaydigan prefiks bo'lgani uchun",
                        "Bu kuchsiz fe'l bo'lgani uchun",
                        "Bu fe'l 'sein' bilan ishlatilgani uchun",
                        "Bu fe'l -ieren bilan tugagani uchun"
                    ],
                    answer: 0,
                    explanation: "be-, ver-, er-, ent-, zer-, emp-, miss- kabi ajralmaydigan old qo'shimchalar hech qachon 'ge-' olmaydi."
                },
                {
                    q: "Bo'sh joyni to'ldiring: 'Mein Freund ist gestern zu Hause ___.'",
                    options: ["gebleiben", "geblieben", "bleiben", "gebleibt"],
                    answer: 1,
                    explanation: "'bleiben' kuchli fe'l bo'lib, Partizip II shakli 'geblieben' va u 'sein' bilan ishlatiladi."
                },
                {
                    q: "'Haben' va 'sein' fe'llari o'tgan zamon haqidagi og'zaki nutqda odatda qanday ishlatiladi?",
                    options: [
                        "Doimo Perfekt shaklida (habe gehabt, bin gewesen)",
                        "Präteritum shaklida (hatte, war)",
                        "Faqat Plusquamperfektda",
                        "Kelasi zamon shaklida"
                    ],
                    answer: 1,
                    explanation: "Og'zaki nutqda ham 'sein' va 'haben' fe'llari Perfekt o'rniga Präteritumda (ich war, ich hatte) qo'llanilishi tabiiy va qulaydir."
                },
                {
                    q: "Qaysi qatordagi barcha fe'llar Perfektda 'sein' bilan ishlatiladi?",
                    options: [
                        "gehen, fliegen, aufstehen, bleiben",
                        "machen, lernen, wohnen, arbeiten",
                        "trinken, essen, lesen, schreiben",
                        "kaufen, anrufen, bezahlen, suchen"
                    ],
                    answer: 0,
                    explanation: "gehen (harakat), fliegen (harakat), aufstehen (holat o'zgarishi) va bleiben (istisno) fe'llari 'sein' oladi."
                }
            ],
            gamePairs: [
                { de: "hat gemacht", uz: "qildi (bajardi)" },
                { de: "ist gefahren", uz: "bordi (transportda)" },
                { de: "ist aufgestanden", uz: "uyg'ondi (turdi)" },
                { de: "hat verstanden", uz: "tushundi" },
                { de: "ist geblieben", uz: "qoldi" },
                { de: "hat angerufen", uz: "qo'ng'iroq qildi" },
                { de: "hat geschrieben", uz: "yozdi" },
                { de: "ist passiert", uz: "sodir bo'ldi" }
            ]
        },

        // ============================================================
        // 2-MAVZU: Modal fe'llar va ularning o'tgan zamoni
        // ============================================================
        {
            id: 'a2_2',
            number: 2,
            title: "Modal fe'llar va ularning o'tgan zamoni",
            germanTitle: "Die Modalverben im Präsens und Präteritum",
            icon: "🎯",
            description: "Nemis tilidagi 6 ta asosiy modal fe'l ma'nolari, hozirgi (Präsens) va o'tgan zamon (Präteritum) tuslanishi hamda gapdagi o'rni.",
            theory: {
                summary: "Modal fe'llar harakatning o'zini emas, balki so'zlovchining harakatga bo'lgan munosabatini (imkoniyat, majburiyat, ruxsat, istak, burch) ifodalaydi. A2 darajasida modal fe'llarning o'tgan zamoni Perfekt o'rniga qulay Präteritum shaklida ishlatiladi.",
                sections: [
                    {
                        heading: "1. Modal fe'llarning ma'nolari va Präsensda tuslanishi",
                        content: "<p>Nemis tilida 6 ta asosiy modal fe'l mavjud:</p><ul><li><strong>können</strong> — jismoniy yoki aqliy qobiliyat, imkoniyat (-a olmoq, qila bilmoq).</li><li><strong>müssen</strong> — ichki yoki tashqi qat'iy majburiyat, zaruriyat (shart, majbur bo'lmoq).</li><li><strong>dürfen</strong> — qonuniy yoki axloqiy ruxsat, ijozat (mumkin bo'lmoq, ruxsat berilmoq).</li><li><strong>wollen</strong> — qat'iy niyat, reja, iroda (xohlamoq, niyat qilmoq).</li><li><strong>sollen</strong> — boshqa birovning buyrug'i, vazifasi, maslahati (kerak, tavsiya etiladi).</li><li><strong>möchten</strong> — muloyim iltimos yoki istak (xohlardim, istar edim).</li></ul><p><em>Asosiy qoida:</em> Barcha modal fe'llarda <strong>ich</strong> (men) va <strong>er/sie/es</strong> (u) shakllari mutlaqo bir xil bo'ladi va shaxs qo'shimchasi <strong>olmaydi</strong> (<em>ich kann, er kann; ich muss, er muss</em>)!</p>",
                        examples: [
                            { de: "Ich kann sehr gut Deutsch sprechen und verstehen.", uz: "Men nemis tilida juda yaxshi gapira olaman va tushunaman.", tip: "können qobiliyatni ifodalaydi." },
                            { de: "Er muss heute bis 20 Uhr im Büro bleiben.", uz: "U bugun soat 20:00 gacha ofisda qolishi shart.", tip: "müssen majburiyatni bildiradi." },
                            { de: "Hier darf man nicht fotografieren.", uz: "Bu yerda rasmga tushirish taqiqlanadi (mumkin emas).", tip: "nicht dürfen qat'iy taqiqni anglatadi." }
                        ]
                    },
                    {
                        heading: "2. Modal fe'llarning o'tgan zamoni (Präteritum)",
                        content: "<p>A2 darajasida va jonli nemis tilida modal fe'llar o'tgan zamonda deyarli hech qachon Perfektda aytilmaydi (chunki 'hat gekonnt' noqulay). Buning o'rniga o'ta qulay <strong>Präteritum</strong> shakli qo'llaniladi.</p><p><em>Oltin qoida:</em> Barcha modal fe'llar o'tgan zamonda o'z <strong>umlautlarini (nuqtalarini) yo'qotadi</strong> va <strong>-(e)te</strong> qo'shimchasini oladi:</p><table class=\"curriculum-table\"><thead><tr><th>Infinitiv</th><th>Präteritum (ich / er)</th><th>O'zbekcha ma'nosi</th></tr></thead><tbody><tr><td>können</td><td><strong>konnte</strong></td><td>qila oldim / oldi</td></tr><tr><td>müssen</td><td><strong>musste</strong></td><td>majbur edim / edi</td></tr><tr><td>dürfen</td><td><strong>durfte</strong></td><td>ruxsat bor edi</td></tr><tr><td>wollen</td><td><strong>wollte</strong></td><td>xohlagan edim / edi</td></tr><tr><td>sollen</td><td><strong>sollte</strong></td><td>kerak edi / topshirilgan edi</td></tr><tr><td>mögen / möchten</td><td><strong>mochte / wollte</strong></td><td>yoqtirgan edim / xohlagan edim</td></tr></tbody></table><p>Tuslanishi: <em>ich konnte, du konntest, er/sie/es konnte, wir konnten, ihr konntet, sie/Sie konnten</em>.</p>",
                        examples: [
                            { de: "Gestern konnte ich nicht kommen, weil ich krank war.", uz: "Kecha kela olmadim, chunki kasal edim.", tip: "konnte = kela oldim; fe'l oxirida kommen (infinitiv)." },
                            { de: "Wir mussten gestern sehr lange auf den Bus warten.", uz: "Kecha avtobusni juda uzoq kutishga majbur bo'ldik.", tip: "musste shaklida umlaut yo'qoladi." },
                            { de: "Als Kind durfte ich nicht lange draußen spielen.", uz: "Bolaligimda menga tashqarida uzoq o'ynashga ruxsat berilmas edi.", tip: "durfte = ruxsat bor edi." }
                        ]
                    },
                    {
                        heading: "3. Gap tuzilishi va inkor: \"nicht dürfen\" vs \"nicht müssen\"",
                        content: "<p>Modal fe'l qatnashgan gaplarda fe'llar joylashuvi:</p><ul><li>Modal fe'l 2-o'rinda tuslangan holda turadi.</li><li>Asosiy harakat fe'li esa gapning <strong>eng oxirida Infinitiv (boshlang'ich)</strong> shaklida keladi.</li></ul><p><strong>Eng muhim farq (chalg'ituvchi holat):</strong></p><ul><li><strong>nicht dürfen</strong> = mutlaq taqiq (qilish umuman mumkin emas, qat'iyan taqiqlanadi!). <em>\"Du darfst hier nicht rauchen.\"</em></li><li><strong>nicht müssen</strong> = majburiyat yo'q (qilmasang ham bo'ladi, xohlasang qil, majbur emassan). <em>\"Du musst heute nicht kochen, wir gehen ins Restaurant.\"</em></li></ul>",
                        examples: [
                            { de: "Man darf im Flugzeug nicht telefonieren.", uz: "Samolyotda telefon orqali gaplashish taqiqlanadi.", tip: "nicht dürfen = taqiq, man qilingan." },
                            { de: "Morgen ist Sonntag, du musst nicht früh aufstehen.", uz: "Ertaga yakshanba, erta turishing shart emas.", tip: "nicht müssen = ixtiyoriy, majburiyat yo'q." },
                            { de: "Der Arzt sagt, ich soll mich viel bewegen.", uz: "Shifokor ko'proq harakat qilishim kerakligini aytyapti.", tip: "sollen = birovning maslahati yoki topshirig'i." }
                        ]
                    }
                ],
                keyRules: [
                    "Modal fe'llarda 'ich' va 'er/sie/es' shakllari doimo bir xil va qo'shimchasiz bo'ladi (ich kann = er kann).",
                    "Asosiy fe'l har doim gap oxirida o'zgarmas Infinitiv shaklida keladi: Ich muss heute lange arbeiten.",
                    "O'tgan zamonda (Präteritum) barcha umlautlar yo'qoladi: konnte, musste, durfte, wollte, sollte.",
                    "'nicht dürfen' = qat'iyan taqiqlanadi; 'nicht müssen' = qilish shart emas, ixtiyoriy."
                ]
            },
            flashcards: [
                { front: "können (konnte)", back: "qila olmoq, eplamoq", tip: "Qobiliyat: Ich kann schwimmen. / Ich konnte nicht kommen." },
                { front: "müssen (musste)", back: "majbur bo'lmoq, shart bo'lmoq", tip: "Majburiyat: Wir müssen die Prüfung bestehen." },
                { front: "dürfen (durfte)", back: "ruxsat bo'lmoq, mumkin bo'lmoq", tip: "Ruxsat: Darf ich hier parken?" },
                { front: "wollen (wollte)", back: "xohlamoq, niyat qilmoq", tip: "Qat'iy niyat: Ich will Deutsch lernen." },
                { front: "sollen (sollte)", back: "kerak bo'lmoq (maslahat/topshiriq)", tip: "Tavsiya: Du sollst mehr Wasser trinken." },
                { front: "möchten (wollte)", back: "xohlardim (istak)", tip: "Iltimos: Ich möchte einen Kaffee, bitte." },
                { front: "Man darf hier nicht rauchen.", back: "Bu yerda chekish taqiqlanadi.", tip: "nicht dürfen = qat'iy taqiq." },
                { front: "Du musst keine Angst haben.", back: "Qo'rqishing shart emas.", tip: "nicht müssen = majburiyat yo'qligi." },
                { front: "Ich konnte gestern nicht kommen.", back: "Men kecha kela olmadim.", tip: "können o'tgan zamoni: konnte." },
                { front: "Er musste lange arbeiten.", back: "U uzoq ishlashga majbur bo'ldi.", tip: "müssen o'tgan zamoni: musste." },
                { front: "Wir wollten nach Hause gehen.", back: "Biz uyga ketmoqchi edik.", tip: "wollen o'tgan zamoni: wollte." },
                { front: "Was soll ich jetzt tun?", back: "Hozir nima qilishim kerak?", tip: "Maslahat so'rash." },
                { front: "Darf ich Sie etwas fragen?", back: "Sizdan bir narsa so'rasam maylimi?", tip: "Muloyim ruxsat so'rash." },
                { front: "das Verbot (-e)", back: "taqiq, man etish", tip: "Rauchen verboten = Chekish taqiqlangan." },
                { front: "die Erlaubnis (-se)", back: "ruxsat, ijozat", tip: "um Erlaubnis bitten = ruxsat so'ramoq." }
            ],
            test: [
                {
                    q: "Bo'sh joyni to'ldiring: 'Ich ___ gestern leider nicht kommen, weil ich krank war.'",
                    options: ["konnte", "kann", "gekonnt", "könnte"],
                    answer: 0,
                    explanation: "O'tgan zamon bo'lgani uchun 'konnte' to'g'ri. 'Ich' va 'er/sie/es' shaklida shaxs qo'shimchasi bo'lmaydi."
                },
                {
                    q: "'Hier ___ man nicht rauchen! Es ist streng verboten.' Gapga mos fe'l qaysi?",
                    options: ["muss", "soll", "darf", "will"],
                    answer: 2,
                    explanation: "Taqiq (verboten) bo'lgan hollarda 'dürfen' fe'lining inkori (nicht dürfen) qo'llaniladi."
                },
                {
                    q: "'Der Arzt hat gesagt, ich ___ dreimal am Tag die Medizin nehmen.' Qaysi fe'l mos?",
                    options: ["soll", "darf", "kann", "will"],
                    answer: 0,
                    explanation: "Shifokorning ko'rsatmasi va birovning maslahati uchun 'sollen' fe'li ishlatiladi."
                },
                {
                    q: "'müssen' fe'lining o'tgan zamon (Präteritum) 'ich' shakli qanday yoziladi?",
                    options: ["müsste", "musste", "gemusst", "musstet"],
                    answer: 1,
                    explanation: "Präteritumda barcha modal fe'llar umlautlarini yo'qotadi: musste."
                },
                {
                    q: "'Du musst heute nicht kommen' jumlasining aniq ma'nosi nima?",
                    options: [
                        "Senga kelish qat'iyan man etiladi",
                        "Kelishing shart emas, ixtiyoriy",
                        "Sen kela olmaysan",
                        "Sen kelishni xohlamaysan"
                    ],
                    answer: 1,
                    explanation: "'nicht müssen' majburiyat yo'qligini bildiradi: kelishing shart emas (majbur emassan)."
                },
                {
                    q: "Modal fe'l qatnashgan darak gapda asosiy fe'l qayerda va qanday ko'rinishda turadi?",
                    options: [
                        "2-o'rinda, tuslangan holda",
                        "Gapning eng oxirida, Infinitiv (boshlang'ich) shaklda",
                        "Eganing oldida",
                        "Gap boshida, Partizip II shaklida"
                    ],
                    answer: 1,
                    explanation: "Modal fe'lli gapda ikkinchi fe'l har doim gap oxirida Infinitiv (lug'at shaklida) keladi."
                },
                {
                    q: "Bo'sh joyni to'ldiring: 'Wir ___ letztes Jahr nach Deutschland fliegen, aber die Tickets waren zu teuer.'",
                    options: ["wollten", "will", "gewollt", "wollt"],
                    answer: 0,
                    explanation: "O'tgan yili rejalashtirilgan niyat 'wollten' (wollen fe'lining Präteritum shakli) orqali beriladi."
                },
                {
                    q: "'können' fe'lining 'er/sie/es' uchun hozirgi zamon (Präsens) shakli qaysi?",
                    options: ["könnt", "kann", "kannst", "können"],
                    answer: 1,
                    explanation: "Modal fe'llarda 1-shaxs va 3-shaxs birlik bir xil bo'ladi: ich kann, er/sie/es kann."
                },
                {
                    q: "'Doktor menga ko'proq dam olishimni aytdi' jumlasining eng to'g'ri nemischa varianti:",
                    options: [
                        "Der Arzt sagt, ich darf mich ausruhen.",
                        "Der Arzt sagt, ich will mich ausruhen.",
                        "Der Arzt sagt, ich soll mich ausruhen.",
                        "Der Arzt sagt, ich kann mich ausruhen."
                    ],
                    answer: 2,
                    explanation: "Birovning buyrug'i yoki maslahati 'sollen' (ich soll) orqali ifodalanadi."
                },
                {
                    q: "'dürfen' fe'lining o'tgan zamon 'ich' shakli qaysi?",
                    options: ["durfte", "dürfte", "darfte", "gedurft"],
                    answer: 0,
                    explanation: "'dürfen' fe'lining o'tgan zamoni 'durfte' (umlautsiz) bo'ladi."
                }
            ],
            gamePairs: [
                { de: "ich kann", uz: "men qila olaman" },
                { de: "er muss", uz: "u majbur (shart)" },
                { de: "man darf nicht", uz: "taqiqlanadi" },
                { de: "ich wollte", uz: "xohlagan edim" },
                { de: "wir konnten", uz: "qila oldik" },
                { de: "er musste", uz: "u majbur bo'ldi" },
                { de: "du solltest", uz: "qilishing kerak edi" },
                { de: "ich mochte", uz: "yoqtirgan edim" }
            ]
        },

        // ============================================================
        // 3-MAVZU: Dativ kelishigi va Dativ predloglari
        // ============================================================
        {
            id: 'a2_3',
            number: 3,
            title: "Dativ kelishigi va Dativ predloglari",
            germanTitle: "Der Dativ und feste Dativpräpositionen",
            icon: "🧭",
            description: "Dativ (jo'nalish-o'rin/kimga?) kelishigi artikellari, kishilik olmoshlari, Dativ fe'llari va faqat Dativ talab qiluvchi predloglar.",
            theory: {
                summary: "Dativ kelishigi nemis tilida 'Wem?' (Kimga?) va 'Wo?' (Qayerda?) so'roqlariga javob beradi. A2 darajasida qat'iy Dativ talab qiluvchi 7 ta asosiy predlog va maxsus fe'llarni mukammal bilish talab etiladi.",
                sections: [
                    {
                        heading: "1. Dativ kelishigi artikellari va kishilik olmoshlari",
                        content: "<p>Dativ kelishigida artikellar quyidagicha o'zgaradi:</p><table class=\"curriculum-table\"><thead><tr><th>Rod (Jins)</th><th>Nominativ</th><th>Dativ (Aniq)</th><th>Dativ (Noaniq / Inkor)</th></tr></thead><tbody><tr><td>Maskulin (Muzh.)</td><td>der Mann</td><td><strong>dem</strong> Mann</td><td><strong>einem / keinem</strong> Mann</td></tr><tr><td>Neutrum (O'rta)</td><td>das Kind</td><td><strong>dem</strong> Kind</td><td><strong>einem / keinem</strong> Kind</td></tr><tr><td>Feminin (Ayol)</td><td>die Frau</td><td><strong>der</strong> Frau</td><td><strong>einer / keiner</strong> Frau</td></tr><tr><td>Plural (Ko'plik)</td><td>die Kinder</td><td><strong>den</strong> Kinder<strong>n</strong></td><td><strong>keinen</strong> Kinder<strong>n</strong></td></tr></tbody></table><p><em>Juda muhim qoida:</em> Dativ ko'plikda (Plural) barcha otlar oxiriga <strong>-n</strong> harfi qo'shiladi (agar so'z allaqachon -n yoki -s bilan tugamagan bo'lsa): <em>den Freunden, den Büchern</em>.</p><p><strong>Kishilik olmoshlari Dativda:</strong> mir (menga), dir (senga), ihm (unga - o'g'il/o'rta), ihr (unga - qiz), uns (bizga), euch (sizlarga), ihnen (ularga), Ihnen (Sizga - hurmat).</p>",
                        examples: [
                            { de: "Ich helfe dem alten Mann.", uz: "Men qariya kishiga yordam beryapman.", tip: "der Mann Dativda dem Mann bo'ladi." },
                            { de: "Wie geht es dir? - Mir geht es sehr gut, danke!", uz: "Qandaysan? - Menga juda yaxshi, rahmat!", tip: "Wie geht es + Dativ (dir, mir)." },
                            { de: "Sie schenkt den Kindern neue Bücher.", uz: "U bolalarga yangi kitoblar sovg'a qilyapti.", tip: "Dativ ko'plik: den Kindern (+n)." }
                        ]
                    },
                    {
                        heading: "2. Faqat Dativ talab qiluvchi predloglar (Dativ-Präpositionen)",
                        content: "<p>Quyidagi predloglardan keyin kelgan ot yoki olmosh istisnosiz har doim <strong>faqat Dativ</strong> kelishigida bo'ladi. Ularni qofiya tarzida yodlash oson:</p><p style=\"font-size:1.15em; text-align:center; font-weight:bold; color:var(--primary, #0d9488);\">aus — bei — mit — nach — seit — von — zu (+ gegenüber)</p><ul><li><strong>aus:</strong> ichidan (bino/quti); kelib chiqish (mamlakat, shahar): <em>aus dem Haus, aus Usbekistan</em>.</li><li><strong>bei:</strong> huzurida, yonida (shaxs); biror firmada: <em>beim Arzt (bei dem), bei meinen Eltern, bei Siemens</em>.</li><li><strong>mit:</strong> bilan (birga; transport vositasi orqali): <em>mit dem Bus, mit meiner Freundin</em>.</li><li><strong>nach:</strong> ...dan keyin (vaqt); ...ga tomon (shahar/mamlakat): <em>nach der Arbeit, nach Berlin, nach Hause</em>.</li><li><strong>seit:</strong> ...dan beri (o'tmishda boshlanib, hozir ham davom etayotgan ish-harakat): <em>seit einem Jahr</em>.</li><li><strong>von:</strong> ...dan (shaxs/joydan qaytish); ...ning: <em>vom Bahnhof (von dem), das Auto von meinem Vater</em>.</li><li><strong>zu:</strong> ...ga, tomon (shaxs, muassasa, bino): <em>zum Arzt (zu dem), zur Schule (zu der), zu Fuß</em>.</li></ul>",
                        examples: [
                            { de: "Ich fahre jeden Tag mit der U-Bahn zur Arbeit.", uz: "Men har kuni metroda ishga boraman.", tip: "mit + der U-Bahn (Feminin Dativ), zu + der Arbeit = zur Arbeit." },
                            { de: "Er wohnt schon seit einem Monat bei seinem Onkel.", uz: "U bir oydan beri amakisining uyida yashayapti.", tip: "seit + einem Monat (Maskulin Dativ), bei + seinem Onkel." },
                            { de: "Nach dem Unterricht gehen wir zusammen essen.", uz: "Darsdan keyin birga ovqatlanishga boramiz.", tip: "nach + dem Unterricht." }
                        ]
                    },
                    {
                        heading: "3. Faqat Dativ talab qiluvchi fe'llar (Verben mit Dativ)",
                        content: "<p>Nemis tilida shunday fe'llar borki, ular o'zbek tilidagi tushum kelishigiga to'g'ri kelsa ham, nemis tilida qat'iy <strong>Dativ</strong> talab qiladi:</p><ul><li><strong>helfen</strong> — yordam bermoq: <em>Kannst du mir helfen?</em></li><li><strong>danken</strong> — rahmat aytmoq: <em>Ich danke Ihnen vom Herzen.</em></li><li><strong>gefallen</strong> — yoqmoq: <em>Die Stadt gefällt mir sehr.</em></li><li><strong>gehören</strong> — tegishli bo'lmoq: <em>Das Buch gehört dem Lehrer.</em></li><li><strong>schmecken</strong> — ta'mi yoqmoq: <em>Das Essen schmeckt den Gästen.</em></li><li><strong>passen</strong> — mos kelmoq (o'lchami/vaqti): <em>Die Hose passt mir gut. Der Termin passt mir.</em></li><li><strong>gratulieren</strong> — tabriklamoq: <em>Wir gratulieren dir zum Geburtstag!</em></li><li><strong>antworten</strong> — javob bermoq: <em>Bitte antworte mir schnell!</em></li></ul>",
                        examples: [
                            { de: "Das rote Auto gehört meinem Vater.", uz: "Qizil mashina otamga tegishli.", tip: "gehören + Dativ (meinem Vater)." },
                            { de: "Die Suppe schmeckt dem Kind leider nicht.", uz: "Sho'rva bolaga afsuski yoqmadi.", tip: "schmecken + Dativ (dem Kind)." },
                            { de: "Ich gratuliere Ihnen herzlich zum Erfolg!", uz: "Sizni muvaffaqiyat bilan chin yurakdan tabriklayman!", tip: "gratulieren + Dativ (Ihnen)." }
                        ]
                    }
                ],
                keyRules: [
                    "Dativ kelishigida der/das -> dem, die -> der, ko'plik die -> den (+ otga -n) shakliga o'tadi.",
                    "7 ta doimiy Dativ predlogi: aus, bei, mit, nach, seit, von, zu (doim Dativ oladi).",
                    "Dativ ko'plikda ot oxiriga -n qo'shiladi: den Kindern, den Freunden.",
                    "helfen, danken, gefallen, gehören, schmecken, passen fe'llari faqat Dativ bilan ishlatiladi."
                ]
            },
            flashcards: [
                { front: "aus (Dat.)", back: "ichidan; ...dan (kelib chiqish)", tip: "aus dem Haus, aus Usbekistan." },
                { front: "bei (Dat.)", back: "huzurida, ...da (shaxs/firma)", tip: "beim Arzt (bei dem), bei Siemens." },
                { front: "mit (Dat.)", back: "bilan (transport, vosita, shaxs)", tip: "mit dem Bus, mit meiner Mutter." },
                { front: "nach (Dat.)", back: "...dan keyin; ...ga tomon", tip: "nach der Schule, nach Deutschland." },
                { front: "seit (Dat.)", back: "...dan beri (hozirgacha davom etuvchi)", tip: "seit einem Monat, seit einer Woche." },
                { front: "von (Dat.)", back: "...dan (joy/odamdan); ...ning", tip: "vom Bahnhof, das Buch von Ali." },
                { front: "zu (Dat.)", back: "...ga, huzuriga (shaxs/muassasa)", tip: "zum Arzt (zu dem), zur Bank (zu der)." },
                { front: "gegenüber (Dat.)", back: "qarshisida, ro'parasida", tip: "dem Bahnhof gegenüber." },
                { front: "helfen (+ Dat.)", back: "yordam bermoq", tip: "Kannst du mir helfen?" },
                { front: "danken (+ Dat.)", back: "minnatdorchilik bildirmoq", tip: "Ich danke dir herzlich." },
                { front: "gehören (+ Dat.)", back: "tegishli bo'lmoq", tip: "Das gehört mir nicht." },
                { front: "gefallen (+ Dat.)", back: "yoqmoq", tip: "Wie gefällt dir Taschkent?" },
                { front: "schmecken (+ Dat.)", back: "ta'mi yoqmoq, mazali tuyulmoq", tip: "Das Essen schmeckt mir gut." },
                { front: "zum Arzt gehen", back: "shifokor huzuriga bormoq", tip: "zu + dem = zum Arzt." },
                { front: "mit dem Bus fahren", back: "avtobusda bormoq", tip: "mit + dem Bus (Dativ)." }
            ],
            test: [
                {
                    q: "Bo'sh joyni to'ldiring: 'Ich fahre jeden Morgen mit ___ Bus zur Arbeit (der Bus).'",
                    options: ["den", "dem", "der", "des"],
                    answer: 1,
                    explanation: "'mit' har doim Dativ talab qiladi. Maskulin 'der Bus' Dativda 'dem Bus' bo'ladi."
                },
                {
                    q: "'Er wohnt schon seit ___ Jahr in Deutschland (das Jahr).' Qaysi artikle mos?",
                    options: ["einer", "einen", "einem", "ein"],
                    answer: 2,
                    explanation: "'seit' Dativ talab qiladi. O'rta jins 'das Jahr' Dativda 'einem Jahr' bo'ladi."
                },
                {
                    q: "'Kannst du ___ bitte helfen? Ich verstehe die Grammatik nicht.' Bo'sh joyga mos olmosh:",
                    options: ["mich", "mir", "ich", "mein"],
                    answer: 1,
                    explanation: "'helfen' fe'li qat'iy Dativ oladi: helfen + mir (menga yordam bermoq)."
                },
                {
                    q: "Qaysi qatordagi barcha predloglar faqat Dativ kelishigi bilan ishlatiladi?",
                    options: [
                        "aus, bei, mit, nach, seit, von, zu",
                        "durch, für, gegen, ohne, um",
                        "in, an, auf, neben, hinter",
                        "wegen, während, trotz, statt"
                    ],
                    answer: 0,
                    explanation: "aus, bei, mit, nach, seit, von, zu — sof Dativ predloglaridir."
                },
                {
                    q: "'Das Auto gehört ___ Vater (der Vater).' Bo'sh joyni to'ldiring:",
                    options: ["meinen", "meinem", "meiner", "meines"],
                    answer: 1,
                    explanation: "'gehören' Dativ talab qiladi: der Vater &rarr; meinem Vater."
                },
                {
                    q: "Dativ ko'plikda (Plural) ot oxiriga qaysi harf qo'shiladi?",
                    options: ["-s", "-e", "-n", "-er"],
                    answer: 2,
                    explanation: "Dativ ko'plikdagi barcha otlar (agar -n yoki -s bilan tugamagan bo'lsa) qo'shimcha -n oladi: den Kindern."
                },
                {
                    q: "'nach' predlogidan keyin 'die Schule' qanday o'zgaradi?",
                    options: ["nach die Schule", "nach den Schule", "nach der Schule", "nach dem Schule"],
                    answer: 2,
                    explanation: "'nach' Dativ talab qiladi, 'die Schule' (Feminin) Dativda 'der Schule' bo'ladi."
                },
                {
                    q: "'Ich gehe heute ___ Arzt (zu + dem).' To'g'ri qisqartma shakli qaysi?",
                    options: ["zur", "zum", "ans", "ins"],
                    answer: 1,
                    explanation: "zu + dem = zum. 'Arzt' maskulin bo'lgani uchun 'zum Arzt'."
                },
                {
                    q: "Bo'sh joyni to'ldiring: 'Wie schmeckt ___ die Pizza?' (sen uchun)",
                    options: ["dich", "du", "dir", "dein"],
                    answer: 2,
                    explanation: "'schmecken' Dativ talab qiladi: 'dir' (senga)."
                },
                {
                    q: "'Wir treffen uns nach ___ Unterricht (der Unterricht).' Bo'sh joyga mos artikl:",
                    options: ["dem", "den", "der", "des"],
                    answer: 0,
                    explanation: "'nach' Dativ oladi: der Unterricht &rarr; nach dem Unterricht."
                }
            ],
            gamePairs: [
                { de: "mit dem Auto", uz: "mashina bilan" },
                { de: "zum Arzt", uz: "shifokor huzuriga" },
                { de: "nach der Arbeit", uz: "ishdan keyin" },
                { de: "seit einem Monat", uz: "bir oydan beri" },
                { de: "bei meinen Eltern", uz: "ota-onamnikida" },
                { de: "aus dem Haus", uz: "uydan (tashqariga)" },
                { de: "hilf mir!", uz: "menga yordam ber!" },
                { de: "das gefällt mir", uz: "bu menga yoqadi" }
            ]
        },

        // ============================================================
        // 4-MAVZU: Wechselpräpositionen (Ikki yoqlama predloglar)
        // ============================================================
        {
            id: 'a2_4',
            number: 4,
            title: "Ikki yoqlama predloglar (Wechselpräpositionen)",
            germanTitle: "Die Wechselpräpositionen: Wo? (Dativ) vs. Wohin? (Akkusativ)",
            icon: "📍",
            description: "9 ta o'zgaruvchan predlog: holat va joylashuv (Wo? + Dativ) hamda harakat yo'nalishi (Wohin? + Akkusativ).",
            theory: {
                summary: "Nemis tilida 9 ta predlog borki, ular vaziyatga qarab Dativ yoki Akkusativ kelishigini oladi. Agar harakat yo'nalishi va maqsad (Wohin? - Qayerga?) bo'lsa Akkusativ, agar tinch holat va joylashuv (Wo? - Qayerda?) bo'lsa Dativ ishlatiladi.",
                sections: [
                    {
                        heading: "1. 9 ta Wechselpräposition va oltin qoida: Wo? vs Wohin?",
                        content: "<p>Ushbu 9 ta predlogni yodda saqlang:</p><p style=\"font-size:1.15em; font-weight:bold; text-align:center; color:var(--primary, #0d9488);\">an, auf, hinter, in, neben, über, unter, vor, zwischen</p><ul><li><strong>Wo? (Qayerda?) &rarr; DATIV:</strong> Tinch holat, ma'lum bir joyda turish, harakatsizlik.<br><em>Misol: Das Buch liegt auf <strong>dem</strong> Tisch (stol ustida yotibdi).</em></li><li><strong>Wohin? (Qayerga?) &rarr; AKKUSATIV:</strong> Harakat yo'nalishi, joy o'zgarishi, ob'ektni bir joyga olib borib qo'yish.<br><em>Misol: Ich lege das Buch auf <strong>den</strong> Tisch (stol ustiga qo'yyapman).</em></li></ul><p>Predloglarning fazoviy ma'nolari:<br><strong>an</strong> — vertikal yuzaga tegib turish yoki qirg'oq bo'yi (an der Wand, am Meer);<br><strong>auf</strong> — gorizontal yuzaning ustida (auf dem Tisch);<br><strong>in</strong> — ichida (im Zimmer);<br><strong>über</strong> — tepasida (tegmasdan);<br><strong>unter</strong> — tagida, ostida;<br><strong>vor</strong> — oldida;<br><strong>hinter</strong> — orqasida;<br><strong>neben</strong> — yonida;<br><strong>zwischen</strong> — o'rtasida, orasida.</p>",
                        examples: [
                            { de: "Das Bild hängt an der Wand.", uz: "Rasm devorda osilib turibdi.", tip: "Wo? (Qayerda?) -> Dativ: an + der Wand." },
                            { de: "Ich hänge das Bild an die Wand.", uz: "Men rasmni devorga osyapman.", tip: "Wohin? (Qayerga?) -> Akkusativ: an + die Wand." },
                            { de: "Die Kinder spielen im Garten.", uz: "Bolalar bog'da o'ynashyapti.", tip: "Wo? -> in + dem Garten = im Garten (Dativ)." }
                        ]
                    },
                    {
                        heading: "2. Juft fe'llar: stellen/stehen, legen/liegen, setzen/sitzen, hängen",
                        content: "<p>Wechselpräpositionen mavzusining eng muhim amaliy qismi — maxsus fe'l juftliklaridir:</p><table class=\"curriculum-table\"><thead><tr><th>Wohin? + Akkusativ (Kuchsiz, harakat)</th><th>Wo? + Dativ (Kuchli, holat)</th></tr></thead><tbody><tr><td><strong>stellen</strong> (tik qo'ymoq)<br><em>Ich stelle die Flasche auf den Tisch.</em></td><td><strong>stehen</strong> (tik turmoq)<br><em>Die Flasche steht auf dem Tisch.</em></td></tr><tr><td><strong>legen</strong> (yotiq qo'ymoq)<br><em>Ich lege das Buch auf das Bett.</em></td><td><strong>liegen</strong> (yotmoq)<br><em>Das Buch liegt auf dem Bett.</em></td></tr><tr><td><strong>setzen</strong> (o'tqazmoq / o'tirmoq)<br><em>Ich setze das Kind auf den Stuhl.</em></td><td><strong>sitzen</strong> (o'tirmoq)<br><em>Das Kind sitzt auf dem Stuhl.</em></td></tr><tr><td><strong>hängen</strong> (osmoq - kuchsiz)<br><em>Ich hänge die Jacke in den Schrank.</em></td><td><strong>hängen</strong> (osilib turmoq - kuchli)<br><em>Die Jacke hängt im Schrank.</em></td></tr></tbody></table><p><em>Xulosa:</em> Agar siz biror buyumni joylashtirsangiz (stellen, legen, setzen) &rarr; <strong>Akkusativ</strong>; agar u o'zi o'sha yerda turgan/yotgan bo'lsa (stehen, liegen, sitzen) &rarr; <strong>Dativ</strong>.</p>",
                        examples: [
                            { de: "Er stellt das Glas auf den Tisch.", uz: "U stakanni stol ustiga tik qo'ymoqda.", tip: "stellen + Wohin? -> auf den Tisch (Akkusativ)." },
                            { de: "Das Glas steht auf dem Tisch.", uz: "Stakan stol ustida turibdi.", tip: "stehen + Wo? -> auf dem Tisch (Dativ)." },
                            { de: "Wir setzen uns auf die Bank.", uz: "Biz o'rindiqqa o'tiryapmiz.", tip: "sich setzen + Wohin? -> auf die Bank (Akkusativ)." }
                        ]
                    },
                    {
                        heading: "3. Muhim qisqartmalar va nozik farqlar (an vs auf vs in)",
                        content: "<p>Kundalik nutqda predlog va artikellar ko'pincha qo'shilib ketadi:</p><ul><li><strong>Dativ qisqartmalari:</strong> in + dem = <strong>im</strong> (im Kino, im Zimmer), an + dem = <strong>am</strong> (am Bahnhof, am Fenster).</li><li><strong>Akkusativ qisqartmalari:</strong> in + das = <strong>ins</strong> (ins Kino, ins Bett), an + das = <strong>ans</strong> (ans Meer, ans Fenster).</li></ul><p><strong>an vs auf farqi:</strong></p><ul><li><strong>auf</strong> — ochiq gorizontal yuza ustida bo'lish (auf dem Tisch, auf dem Boden, auf der Straße, auf dem Markt).</li><li><strong>an</strong> — vertikal yuza bilan tutashish yoki chekka/qirg'oqda bo'lish (an der Wand, an der Tafel, am Fluss, am Meer).</li></ul>",
                        examples: [
                            { de: "Wir fahren im Sommer ans Meer.", uz: "Biz yozda dengiz bo'yiga boramiz.", tip: "Wohin? -> ans Meer (an + das Meer, Akkusativ)." },
                            { de: "Er wartet am Bahnhof auf seinen Freund.", uz: "U vokzalda do'stini kutyapti.", tip: "Wo? -> am Bahnhof (an + dem Bahnhof, Dativ)." },
                            { de: "Gehst du heute Abend ins Kino?", uz: "Bugun kechqurun kinoga borasanmi?", tip: "Wohin? -> ins Kino (in + das Kino, Akkusativ)." }
                        ]
                    }
                ],
                keyRules: [
                    "Wo? (Qayerda?) savoli doimo Dativ talab qiladi (tinch holat, joylashuv).",
                    "Wohin? (Qayerga?) savoli doimo Akkusativ talab qiladi (harakat, yo'nalish).",
                    "stellen / legen / setzen fe'llari Akkusativ oladi; stehen / liegen / sitzen fe'llari Dativ oladi.",
                    "an + dem = am, in + dem = im (Dativ); an + das = ans, in + das = ins (Akkusativ)."
                ]
            },
            flashcards: [
                { front: "an (Wo? Dat. / Wohin? Akk.)", back: "yonida, devorga, qirg'og'ida", tip: "an der Wand (Dat.) / an die Wand (Akk.)." },
                { front: "auf (Wo? Dat. / Wohin? Akk.)", back: "ustida (gorizontal yuza)", tip: "auf dem Tisch (Dat.) / auf den Tisch (Akk.)." },
                { front: "in (Wo? Dat. / Wohin? Akk.)", back: "ichida, ichiga", tip: "im Zimmer (Dat.) / ins Zimmer (Akk.)." },
                { front: "hinter (Wo? Dat. / Wohin? Akk.)", back: "orqasida, orqasiga", tip: "hinter dem Haus / hinter das Haus." },
                { front: "neben (Wo? Dat. / Wohin? Akk.)", back: "yonida, yoniga", tip: "neben mir / neben mich." },
                { front: "über (Wo? Dat. / Wohin? Akk.)", back: "tepasida (tegmasdan), ustidan", tip: "über der Lampe / über die Straße." },
                { front: "unter (Wo? Dat. / Wohin? Akk.)", back: "ostida, tagiga", tip: "unter dem Bett / unter das Bett." },
                { front: "vor (Wo? Dat. / Wohin? Akk.)", back: "oldida, oldiga", tip: "vor der Tür / vor die Tür." },
                { front: "zwischen (Wo? Dat. / Wohin? Akk.)", back: "o'rtasida, orasiga", tip: "zwischen den Stühlen." },
                { front: "stellen (hat gestellt)", back: "tik qo'ymoq (Akkusativ)", tip: "Wohin? Ich stelle die Flasche auf den Tisch." },
                { front: "stehen (hat gestanden)", back: "tik turmoq (Dativ)", tip: "Wo? Die Flasche steht auf dem Tisch." },
                { front: "legen (hat gelegt)", back: "yotiq qo'ymoq (Akkusativ)", tip: "Wohin? Ich lege das Buch auf das Bett." },
                { front: "liegen (hat gelegen)", back: "yotmoq (Dativ)", tip: "Wo? Das Buch liegt auf dem Bett." },
                { front: "setzen (hat gesetzt)", back: "o'tqazmoq, o'tirmoq (Akkusativ)", tip: "Wohin? Setz dich auf den Stuhl!" },
                { front: "sitzen (hat gesessen)", back: "o'tirmoq (Dativ)", tip: "Wo? Er sitzt auf dem Stuhl." }
            ],
            test: [
                {
                    q: "Bo'sh joyni to'ldiring: 'Das Buch liegt auf ___ Tisch (der Tisch).'",
                    options: ["den", "dem", "das", "des"],
                    answer: 1,
                    explanation: "'liegt' (yotibdi) tinch holatni (Wo? - Qayerda?) bildiradi, shuning uchun Dativ: auf dem Tisch."
                },
                {
                    q: "Bo'sh joyni to'ldiring: 'Ich lege das Buch auf ___ Tisch (der Tisch).'",
                    options: ["dem", "den", "der", "des"],
                    answer: 1,
                    explanation: "'lege' (qo'yyapman) harakat yo'nalishini (Wohin? - Qayerga?) bildiradi, shuning uchun Akkusativ: auf den Tisch."
                },
                {
                    q: "'Die Lampe hängt über ___ Bett (das Bett, Wo?).' Bo'sh joyga mos artikl:",
                    options: ["das", "dem", "den", "des"],
                    answer: 1,
                    explanation: "Lampar karavot tepasida osilib turibdi (Wo? - Dativ): über dem Bett."
                },
                {
                    q: "'Er stellt die Blumen in ___ Vase (die Vase, Wohin?).' To'g'ri shakl:",
                    options: ["der", "die", "den", "dem"],
                    answer: 1,
                    explanation: "Gullarni vazaga qo'ymoqda (Wohin? - Akkusativ): in die Vase."
                },
                {
                    q: "'Wo schläft die Katze? - Sie schläft unter ___ Sofa (das Sofa).'",
                    options: ["dem", "das", "den", "der"],
                    answer: 0,
                    explanation: "Mushuk divan tagida uxlayapti (Wo? - Dativ): unter dem Sofa."
                },
                {
                    q: "'Wohin gehst du heute Abend? - Ich gehe ___ Kino (in + das).'",
                    options: ["im", "ins", "ans", "am"],
                    answer: 1,
                    explanation: "Kinoga bormoq (Wohin? - Akkusativ): in + das = ins Kino."
                },
                {
                    q: "'Das Foto hängt an ___ Wand (die Wand, Wo?).'",
                    options: ["die", "der", "den", "dem"],
                    answer: 1,
                    explanation: "Rasm devorda osig'liq turibdi (Wo? - Dativ): an der Wand (die &rarr; der)."
                },
                {
                    q: "Qaysi fe'l 'Wohin? + Akkusativ' talab qiladi va narsani tik qo'yishni bildiradi?",
                    options: ["stehen", "stellen", "liegen", "sitzen"],
                    answer: 1,
                    explanation: "'stellen' harakat fe'li bo'lib, narsani tik qo'yishni bildiradi va Akkusativ oladi."
                },
                {
                    q: "'Der Stuhl steht zwischen ___ Tisch (der) und ___ Tür (die).' To'g'ri artikellar:",
                    options: ["dem / der", "den / die", "dem / die", "der / dem"],
                    answer: 0,
                    explanation: "Stul stol va eshik o'rtasida turibdi (Wo? - Dativ): dem Tisch (mask.) va der Tür (fem.)."
                },
                {
                    q: "'Wir sitzen im Garten.' Bu gapda qaysi so'roq va kelishik qatnashgan?",
                    options: [
                        "Wohin? — Akkusativ",
                        "Wo? — Dativ",
                        "Woher? — Dativ",
                        "Wann? — Akkusativ"
                    ],
                    answer: 1,
                    explanation: "'im Garten' (in dem Garten) bog'da o'tirganlikni (Wo? - Qayerda? - Dativ) bildiradi."
                }
            ],
            gamePairs: [
                { de: "auf dem Tisch", uz: "stol ustida (Dativ)" },
                { de: "auf den Tisch", uz: "stol ustiga (Akkusativ)" },
                { de: "an der Wand", uz: "devorda (Dativ)" },
                { de: "ins Kino", uz: "kinoga (Akkusativ)" },
                { de: "im Zimmer", uz: "xona ichida (Dativ)" },
                { de: "unter das Bett", uz: "karavot tagiga (Akkusativ)" },
                { de: "hinter dem Haus", uz: "uy orqasida (Dativ)" },
                { de: "neben die Tür", uz: "eshik yoniga (Akkusativ)" }
            ]
        },

        // ============================================================
        // 5-MAVZU: Sifat darajalari va Sifat tuslanishi
        // ============================================================
        {
            id: 'a2_5',
            number: 5,
            title: "Sifat darajalari va Sifat tuslanishi",
            germanTitle: "Komparation und Adjektivdeklination",
            icon: "📈",
            description: "Sifatlarning qiyosiy va orttirma darajalari, qiyoslash bog'lovchilari (als, so...wie) hamda ot oldida sifatlarning turlanishi.",
            theory: {
                summary: "Sifatlar narsa va shaxslarning belgilarini ifodalaydi va qiyoslanadi. Shuningdek, sifat otning oldida kelganda otning rod, son va kelishigiga mos ravishda maxsus qo'shimchalar oladi (Adjektivdeklination).",
                sections: [
                    {
                        heading: "1. Sifat darajalari: Positiv, Komparativ va Superlativ",
                        content: "<p>Nemis tilida sifatlarning 3 ta darajasi mavjud:</p><ul><li><strong>Positiv (Oddiy daraja):</strong> sifatning asl shakli: <em>klein, schnell, schön</em>.</li><li><strong>Komparativ (Qiyosiy daraja):</strong> sifatga <strong>-er</strong> qo'shiladi: <em>kleiner, schneller, schöner</em>.</li><li><strong>Superlativ (Orttirma daraja):</strong> sifat oldiga <strong>am</strong> va oxiriga <strong>-(e)sten</strong> qo'shiladi: <em>am kleinsten, am schnellsten</em>. (Agar sifat -d, -t, -s, -z, -ß bilan tugasa, talaffuz oson bo'lishi uchun -esten oladi: <em>am ältesten, am heißesten</em>).</li></ul><p><em>Umlaut qoidasi:</em> Bir bo'g'inli ko'pgina sifatlarda <strong>a, o, u</strong> unlilari <strong>ä, ö, ü</strong> ga aylanadi:<br>alt &rarr; <strong>älter</strong> &rarr; <strong>am ältesten</strong>;<br>groß &rarr; <strong>größer</strong> &rarr; <strong>am größten</strong>;<br>warm &rarr; <strong>wärmer</strong> &rarr; <strong>am wärmsten</strong>.</p><p><strong>Noto'g'ri (istisno) sifatlar (yod oling!):</strong></p><table class=\"curriculum-table\"><thead><tr><th>Positiv</th><th>Komparativ</th><th>Superlativ</th><th>O'zbekcha</th></tr></thead><tbody><tr><td>gut</td><td><strong>besser</strong></td><td><strong>am besten</strong></td><td>yaxshi &rarr; yaxshiroq &rarr; eng yaxshi</td></tr><tr><td>viel</td><td><strong>mehr</strong></td><td><strong>am meisten</strong></td><td>ko'p &rarr; ko'proq &rarr; eng ko'p</td></tr><tr><td>gern</td><td><strong>lieber</strong></td><td><strong>am liebsten</strong></td><td>jon deb &rarr; mamnunroq &rarr; eng yoqimlisi</td></tr><tr><td>hoch</td><td><strong>höher</strong></td><td><strong>am höchsten</strong></td><td>baland &rarr; balandroq &rarr; eng baland (c harfi tushadi!)</td></tr><tr><td>nah</td><td><strong>näher</strong></td><td><strong>am nächsten</strong></td><td>yaqin &rarr; yaqinroq &rarr; eng yaqin</td></tr></tbody></table>",
                        examples: [
                            { de: "Mein Bruder ist älter als ich.", uz: "Mening akam mendan kattaroq.", tip: "alt -> älter (umlaut oladi); qiyoslashda als ishlatiladi." },
                            { de: "Im Sommer ist Taschkent am heißesten.", uz: "Yozda Toshkent eng issiq bo'ladi.", tip: "heiß -> am heißesten (-t bilan tugagani uchun -esten)." },
                            { de: "Ich trinke gern Tee, aber Kaffee trinke ich lieber.", uz: "Men choyni yaxshi ko'raman, ammo kofeni ko'proq xush ko'raman.", tip: "gern -> lieber." }
                        ]
                    },
                    {
                        heading: "2. Qiyoslash bog'lovchilari: \"so ... wie\" vs \"als\"",
                        content: "<p>Ikkita narsa yoki shaxsni bir-biri bilan taqqoslaganda quyidagi ikkita qolip qo'llaniladi:</p><ul><li><strong>Tenglik (o'xshashlik) bo'lsa:</strong> <strong>so + Positiv (oddiy sifat) + wie</strong>.<br><em>Misol: Ali ist <strong>so groß wie</strong> Vali. (Ali Vali kabi baland bo'yli).</em><br>Bu yerda sifat o'zgarmas asl holida turadi.</li><li><strong>Tengsizlik (ortiqlik yoki kamlik) bo'lsa:</strong> <strong>Komparativ (-er) + als</strong>.<br><em>Misol: Ali ist <strong>größer als</strong> Vali. (Ali Validan balandroq).</em><br>Bu yerda sifat albatta qiyosiy darajada bo'lishi shart!</li></ul>",
                        examples: [
                            { de: "Das Auto ist so schnell wie der Zug.", uz: "Mashina poyezddek tez yuradi.", tip: "so schnell wie = poyezd kabi tez (tenglik)." },
                            { de: "Ein Flugzeug ist viel schneller als ein Auto.", uz: "Samolyot mashinadan ancha tezroq.", tip: "schneller als = ...dan tezroq (ortiqlik)." },
                            { de: "Deutsch ist nicht so schwer wie viele Leute denken.", uz: "Nemis tili ko'p odamlar o'ylaganchalik qiyin emas.", tip: "nicht so ... wie = ...chalik emas." }
                        ]
                    },
                    {
                        heading: "3. Sifat tuslanishi (Adjektivdeklination) asoslari",
                        content: "<p>Sifat otning oldida kelib, uni aniqlab tursa (masalan: <em>yangi mashina, chiroyli qiz</em>), u albatta otning artikli, rodi va kelishigiga qarab qo'shimcha oladi:</p><ul><li><strong>Aniq artikeldan keyin (der, die, das):</strong><br>Nominativ: der <strong>neue</strong> Wagen, die <strong>neue</strong> Tasche, das <strong>neue</strong> Buch; Ko'plik: die <strong>neuen</strong> Bücher.<br>Akkusativ: den <strong>neuen</strong> Wagen (maskulinda -en!), die <strong>neue</strong> Tasche, das <strong>neue</strong> Buch.<br>Dativ: barcha rodlarda qat'iy <strong>-en</strong> oladi (dem neuen Wagen, der neuen Tasche, den neuen Büchern).</li><li><strong>Noaniq artikeldan keyin (ein, eine, ein):</strong><br>Sifat rod signalini o'ziga oladi:<br>Nominativ: ein neu<strong>er</strong> Wagen (der signali: -er), eine neu<strong>e</strong> Tasche (die signali: -e), ein neu<strong>es</strong> Buch (das signali: -es).<br>Akkusativ: einen neu<strong>en</strong> Wagen, eine neu<strong>e</strong> Tasche, ein neu<strong>es</strong> Buch.<br>Dativ: har doim <strong>-en</strong> (einem neuen Wagen, einer neuen Tasche).</li></ul>",
                        examples: [
                            { de: "Er hat sich ein neues Auto gekauft.", uz: "U o'ziga yangi mashina sotib oldi.", tip: "ein neues Auto (das Auto -> noaniq artikldan keyin -es oladi)." },
                            { de: "Der junge Mann spricht sehr gut Deutsch.", uz: "Yosh yigit nemis tilida juda yaxshi gapiradi.", tip: "der junge Mann (aniq artikldan keyin Nominativda -e)." },
                            { de: "Ich wohne in einer großen Stadt.", uz: "Men katta shaharda yashayman.", tip: "Dativda noaniq artikldan keyin har doim -en: einer großen Stadt." }
                        ]
                    }
                ],
                keyRules: [
                    "Komparativ -er oladi (schneller); Superlativ am ...-(e)sten oladi (am schnellsten).",
                    "Bir xil bo'lsa: 'so ... wie' (asl sifat bilan); Farqli bo'lsa: 'Komparativ + als'.",
                    "gut -> besser -> am besten; viel -> mehr -> am meisten; gern -> lieber -> am liebsten.",
                    "Sifat ot oldida kelganda Dativ kelishigida har doim '-en' qo'shimchasini oladi."
                ]
            },
            flashcards: [
                { front: "besser (am besten)", back: "yaxshiroq (eng yaxshi)", tip: "gut ning qiyosiy darajasi: gut -> besser -> am besten." },
                { front: "mehr (am meisten)", back: "ko'proq (eng ko'p)", tip: "viel ning qiyosiy darajasi: viel -> mehr -> am meisten." },
                { front: "lieber (am liebsten)", back: "afzalroq, mamnunroq", tip: "gern ning darajasi: gern -> lieber -> am liebsten." },
                { front: "höher (am höchsten)", back: "balandroq (eng baland)", tip: "hoch ning darajasi: c harfi tushib qoladi (höher)." },
                { front: "näher (am nächsten)", back: "yaqinroq (eng yaqin)", tip: "nah ning darajasi: nah -> näher -> am nächsten." },
                { front: "älter (am ältesten)", back: "yoshi kattaroq (eng qari)", tip: "alt -> älter -> am ältesten (umlaut oladi)." },
                { front: "größer (am größten)", back: "kattaroq (eng katta)", tip: "groß -> größer -> am größten." },
                { front: "so ... wie", back: "...dek, ...kabi (tenglik)", tip: "Er ist so alt wie ich." },
                { front: "... als", back: "...dan ko'ra (qiyoslash)", tip: "Er ist älter als ich." },
                { front: "billig / teuer", back: "arzon / qimmat", tip: "Das ist billiger als das andere." },
                { front: "bequemer", back: "qulayroq", tip: "Der Stuhl ist bequemer als das Sofa." },
                { front: "das neue Auto", back: "yangi mashina (aniq)", tip: "Aniq artikeldan keyin: das neue Auto." },
                { front: "ein neues Auto", back: "yangi mashina (noaniq)", tip: "Noaniq artikeldan keyin: ein neues Auto." },
                { front: "der große Tisch", back: "katta stol", tip: "Maskulin Nominativ: der große Tisch." },
                { front: "mit der besten Freundin", back: "eng yaxshi dugonasi bilan", tip: "Dativda sifat har doim -en oladi." }
            ],
            test: [
                {
                    q: "'gut' sifatining qiyosiy (Komparativ) shakli qaysi?",
                    options: ["guter", "besser", "am besten", "mehr gut"],
                    answer: 1,
                    explanation: "'gut' noto'g'ri sifat bo'lib, Komparativ shakli 'besser' bo'ladi."
                },
                {
                    q: "Bo'sh joyni to'ldiring: 'Mein Bruder ist zwei Jahre älter ___ ich.'",
                    options: ["wie", "als", "so", "denn"],
                    answer: 1,
                    explanation: "Qiyosiy darajadan (älter) keyin har doim 'als' (ko'ra) ishlatiladi."
                },
                {
                    q: "'Er ist genauso alt ___ mein bester Freund.' Bo'sh joyga mos so'z:",
                    options: ["als", "wie", "so", "für"],
                    answer: 1,
                    explanation: "Tenglik va o'xshashlikni bildirishda 'so / genauso ... wie' qolipi ishlatiladi."
                },
                {
                    q: "'hoch' (baland) sifatining orttirma (Superlativ) shakli qaysi?",
                    options: ["am hochsten", "am höchsten", "am höhesten", "am mehrsten"],
                    answer: 1,
                    explanation: "'hoch' fe'lida Superlativda 'c' harfi tushib qoladi va umlaut oladi: am höchsten."
                },
                {
                    q: "'Ich trinke gern Tee, aber Kaffee trinke ich noch ___.'",
                    options: ["lieber", "besser", "mehr", "am liebsten"],
                    answer: 0,
                    explanation: "'gern' so'zining qiyosiy darajasi 'lieber' (afzalroq ko'raman) bo'ladi."
                },
                {
                    q: "Bo'sh joyni to'ldiring: 'Er hat sich ein ___ Auto gekauft (das Auto, Akkusativ).'",
                    options: ["neuer", "neues", "neue", "neuen"],
                    answer: 1,
                    explanation: "Noaniq artikeldan (ein) keyin o'rta jins (das) sifatga '-es' qo'shimchasini beradi: ein neues Auto."
                },
                {
                    q: "'Der ___ Mann hilft der Dame über die Straße (der Mann, Nominativ).'",
                    options: ["junge", "junger", "jungen", "junges"],
                    answer: 0,
                    explanation: "Aniq artikeldan (der) keyin Nominativda sifat faqat '-e' qo'shimchasini oladi: der junge Mann."
                },
                {
                    q: "'Ich wohne in einem ___ Haus (das Haus, Dativ).'",
                    options: ["großes", "große", "großen", "großer"],
                    answer: 2,
                    explanation: "Dativ kelishigida har qanday artikeldan keyin sifat doimo '-en' oladi: einem großen Haus."
                },
                {
                    q: "'Welcher Berg ist ___ in Europa?' (eng baland)",
                    options: ["am höchsten", "am hohesten", "höher", "am besten"],
                    answer: 0,
                    explanation: "'am höchsten' = eng baland."
                },
                {
                    q: "'Im Sommer ist es in Taschkent viel ___ als im Frühling.'",
                    options: ["heißer", "heiß", "am heißesten", "heißere"],
                    answer: 0,
                    explanation: "'als' qatnashgani uchun qiyosiy daraja (Komparativ) kerak: heißer."
                }
            ],
            gamePairs: [
                { de: "gut - am besten", uz: "yaxshi - eng yaxshi" },
                { de: "viel - am meisten", uz: "ko'p - eng ko'p" },
                { de: "gern - am liebsten", uz: "jon deb - eng sevimlisi" },
                { de: "hoch - am höchsten", uz: "baland - eng baland" },
                { de: "schneller als", uz: "...dan tezroq" },
                { de: "so groß wie", uz: "...dek katta" },
                { de: "das schöne Bild", uz: "chiroyli rasm" },
                { de: "ein neues Haus", uz: "yangi uy" }
            ]
        },

        // ============================================================
        // 6-MAVZU: Salomatlik, Tana a'zolari va Shifokor huzurida
        // ============================================================
        {
            id: 'a2_6',
            number: 6,
            title: "Salomatlik, Tana a'zolari va Shifokor huzurida",
            germanTitle: "Gesundheit, Körperteile, Beim Arzt und Imperativ",
            icon: "🩺",
            description: "Inson tana a'zolari, kasallik alomatlari, shifokor qabuliga yozilish, shikoyat qilish hamda buyruq/maslahat mayli (Imperativ).",
            theory: {
                summary: "Kundalik hayotda salomatlik haqida gapirish, shifokor qabuliga (Termin) yozilish, og'riqlarni ifodalash va shifokor ko'rsatmalarini (Imperativ - buyruq/maslahat mayli) to'g'ri tushunish A2 darajasining muhim ko'nikmasidir.",
                sections: [
                    {
                        heading: "1. Inson tana a'zolari va og'riqni ifodalash (Körperteile und Schmerzen)",
                        content: "<p>Asosiy tana a'zolari artikellari bilan:</p><ul><li><strong>Maskulin:</strong> der Kopf (bosh), der Hals (tomoq/bo'yin), der Rücken (bel/orqa), der Bauch (qorin), der Arm (qo'l - yelkadan), der Fuß (oyoq - pastki panja), der Zahn (tish).</li><li><strong>Neutrum:</strong> das Auge (ko'z), das Ohr (quloq), das Bein (oyoq - umumiy), das Herz (yurak).</li><li><strong>Feminin:</strong> die Hand (qo'l panjasi), die Nase (burun), die Brust (ko'krak).</li></ul><p><strong>Og'riqni aytishning 2 xil usuli:</strong></p><ol><li><strong>weh tun fe'li bilan:</strong><br><em>Mein Kopf tut weh.</em> (Boshim og'riyapti - birlik).<br><em>Meine Augen tun weh.</em> (Ko'zlarim og'riyapti - ko'plikda <strong>tun</strong>!).</li><li><strong>Schmerzen (og'riqlar) so'zi bilan:</strong><br>Ich habe Kopfschmerzen (bosh og'rig'i), Halsschmerzen (tomoq og'rig'i), Bauchschmerzen (qorin og'rig'i), Zahnschmerzen (tish og'rig'i), Rückenschmerzen (bel og'rig'i).</li></ol><p>Alomatlar: <em>Ich habe Fieber (isitma), Husten (yo'tal), Schnupfen (tumov), Grippe (gripp).</em></p>",
                        examples: [
                            { de: "Was tut Ihnen weh? - Mein Rücken tut sehr weh.", uz: "Qayeringiz og'riyapti? - Belim juda qattiq og'riyapti.", tip: "weh tun ajraladigan fe'l: tut ... weh." },
                            { de: "Ich habe seit zwei Tagen hohes Fieber und Husten.", uz: "Ikki kundan beri yuqori isitma va yo'talim bor.", tip: "seit + Dativ; Fieber va Husten kasallik belgilari." },
                            { de: "Meine Beine tun nach dem Sport weh.", uz: "Sportdan keyin oyoqlarim og'riyapti.", tip: "Ko'plikda 'tun weh' bo'ladi." }
                        ]
                    },
                    {
                        heading: "2. Shifokor huzurida muloqot va qabul (Termin vereinbaren)",
                        content: "<p>Nemis tilida shifokor qabuliga borish uchun avval <strong>Termin (uchrashuv vaqti)</strong> belgilash shart:</p><ul><li><em>\"Guten Tag, ich möchte einen Termin beim Arzt vereinbaren.\"</em> (Xayrli kun, shifokor qabuliga yozilmoqchi edim).</li><li><em>\"Geht es heute noch? Es ist dringend.\"</em> (Bugunga iloji bormi? Bu shoshilinch).</li></ul><p>Shifokor xonasidagi muhim iboralar:</p><ul><li><strong>Was fehlt Ihnen?</strong> — Sizga nima bo'ldi? (Nimangiz bezovta qilyapti?)</li><li><strong>Wo tut es weh?</strong> — Qayeringiz og'riyapti?</li><li><strong>Seit wann haben Sie diese Beschwerden?</strong> — Qachondan beri bu bezovtaliklar bor?</li><li><strong>Ich verschreibe Ihnen ein Medikament.</strong> — Sizga dori yozib beraman.</li><li><strong>das Rezept</strong> — shifokor retsepti; <strong>die Apotheke</strong> — dorixona; <strong>die Tablette</strong> — tabletka.</li><li><strong>Gute Besserung!</strong> — Tezroq tuzalib keting! (Kasallarga aytiladigan eng muhim tilak).</li></ul>",
                        examples: [
                            { de: "Was fehlt Ihnen denn? - Ich fühle mich schwach und habe Halsschmerzen.", uz: "Sizga nima bo'ldi? - O'zimni holsiz his qilyapman va tomog'im og'riyapti.", tip: "Was fehlt Ihnen? = Shifokorning an'anaviy savoli." },
                            { de: "Nehmen Sie diese Tabletten dreimal täglich nach dem Essen!", uz: "Ushbu tabletkalarni kuniga uch mahal ovqatdan keyin iching!", tip: "Tabletten einnehmen = dori qabul qilmoq." },
                            { de: "Ich wünsche Ihnen gute Besserung!", uz: "Sizga tezroq tuzalib ketishingizni tilayman!", tip: "Gute Besserung = shifo tilash." }
                        ]
                    },
                    {
                        heading: "3. Buyruq va maslahat mayli (Der Imperativ)",
                        content: "<p>Shifokor bemorga ko'rsatma va maslahat berganda <strong>Imperativ (buyruq mayli)</strong> dan foydalanadi. U 3 xil shaxsga qaratiladi:</p><ol><li><strong>du (sen) uchun:</strong> Fe'l asosidan <strong>-(s)t</strong> tushirib qoldiriladi, olmosh ishlatilmaydi:<br>trinken &rarr; <strong>Trink</strong> viel Tee!<br>gehen &rarr; <strong>Geh</strong> sofort ins Bett!<br>schlafen &rarr; <strong>Schlaf</strong> viel! (a &rarr; ä o'zgarishi yo'qoladi: schläfst emas, schlaf!)<br>nehmen &rarr; <strong>Nimm</strong> die Medizin! (e &rarr; i o'zgarishi saqlanadi!).</li><li><strong>ihr (sizlar) uchun:</strong> Oddiy fe'l tuslanishi, faqat 'ihr' olmoshi aytilmaydi:<br>trinken &rarr; <strong>Trinkt</strong> regelmäßig Wasser!<br>bleiben &rarr; <strong>Bleibt</strong> zu Hause!</li><li><strong>Sie (Siz - xushmuomala) uchun:</strong> Fe'l 1-o'ringa chiqadi + 'Sie' olmoshi qoladi:<br>trinken &rarr; <strong>Trinken Sie</strong> viel warmen Tee!<br>bleiben &rarr; <strong>Bleiben Sie</strong> drei Tage im Bett!</li></ol><p><em>sein fe'lining buyruq shakli (istisno):</em> Sei ruhig! (du) / Seid leise! (ihr) / <strong>Seien Sie</strong> vorsichtig! (Sie).</p>",
                        examples: [
                            { de: "Ruh dich gut aus und trink viel Wasser!", uz: "Yaxshilab dam ol va ko'p suv ich!", tip: "du uchun Imperativ: olmoshsiz va qo'shimchasiz." },
                            { de: "Nehmen Sie die Tabletten morgens und abends!", uz: "Tabletkalarni ertalab va kechqurun iching!", tip: "Sie uchun Imperativ: Fe'l + Sie." },
                            { de: "Seien Sie bitte geduldig!", uz: "Iltimos, sabrli bo'ling!", tip: "sein fe'lining hurmatli Imperativ shakli: Seien Sie." }
                        ]
                    }
                ],
                keyRules: [
                    "Birlikda 'tut weh' (Mein Kopf tut weh), ko'plikda 'tun weh' (Meine Augen tun weh).",
                    "Kasallik belgilari: Kopfschmerzen, Fieber, Husten, Schnupfen, Halsschmerzen haben.",
                    "du uchun Imperativda shaxs qo'shimchasi -(s)t tushib qoladi: Trink! Geh! Nimm!",
                    "Kasallarga har doim 'Gute Besserung!' (Tezroq sog'ayib keting!) deb tilak bildiriladi."
                ]
            },
            flashcards: [
                { front: "der Kopfschmerz (-en)", back: "bosh og'rig'i", tip: "Ich habe starke Kopfschmerzen." },
                { front: "weh tun (tut weh)", back: "og'rimoq", tip: "Mein Bauch tut weh." },
                { front: "das Fieber", back: "isitma, tana harorati", tip: "Er hat hohes Fieber (39 Grad)." },
                { front: "der Husten", back: "yo'tal", tip: "Ich habe Husten und Schnupfen." },
                { front: "der Schnupfen", back: "tumov, burun oqishi", tip: "Er hat eine Erkältung mit Schnupfen." },
                { front: "der Termin (-e)", back: "qabul vaqti, uchrashuv", tip: "einen Termin beim Arzt vereinbaren." },
                { front: "das Medikament (-e)", back: "dori-darmon", tip: "Medikamente einnehmen." },
                { front: "das Rezept (-e)", back: "shifokor retsepti", tip: "Der Arzt gibt mir ein Rezept." },
                { front: "die Tablette (-n)", back: "tabletka, dori", tip: "eine Tablette gegen Schmerzen." },
                { front: "Gute Besserung!", back: "Tezroq tuzalib keting!", tip: "Shifo tilash iborasi." },
                { front: "untersuchen (hat untersucht)", back: "tekshirmoq, ko'rikdan o'tkazmoq", tip: "Der Arzt untersucht den Patienten." },
                { front: "krankmelden (hat krankgemeldet)", back: "kasallik ta'tili haqida xabar bermoq", tip: "sich bei der Arbeit krankmelden." },
                { front: "einnehmen (nimmt ein)", back: "dori ichmoq (qabul qilmoq)", tip: "Wie oft soll ich die Tropfen einnehmen?" },
                { front: "sich ausruhen", back: "dam olmoq, xordiq chiqarmoq", tip: "Ruhen Sie sich bitte aus!" },
                { front: "der Körperteil (-e)", back: "tana a'zosi", tip: "Körperteile beschreiben." }
            ],
            test: [
                {
                    q: "'Mein Kopf tut sehr ___.' Bo'sh joyga mos so'z:",
                    options: ["weh", "schlecht", "krank", "leid"],
                    answer: 0,
                    explanation: "'weh tun' iborasi og'rishni bildiradi: Mein Kopf tut weh."
                },
                {
                    q: "'Was ___ Ihnen? - Ich habe seit gestern starkes Fieber.' Shifokor savoli:",
                    options: ["tut", "fehlt", "geht", "ist"],
                    answer: 1,
                    explanation: "'Was fehlt Ihnen?' — shifokorlarning an'anaviy 'Sizga nima bo'ldi / Qayeringiz bezovta qilyapti?' degan savolidir."
                },
                {
                    q: "'nehmen' fe'lining 'du' uchun buyruq (Imperativ) shakli qaysi?",
                    options: ["Nehm!", "Nimmt!", "Nimm!", "Nehmen!"],
                    answer: 2,
                    explanation: "'nehmen' fe'lida o'zak 'e &rarr; i' o'zgaradi va shaxs qo'shimchasisiz 'Nimm!' bo'ladi."
                },
                {
                    q: "'Trinken ___ viel Wasser und bleiben ___ im Bett!' Bo'sh joylarga mos olmosh:",
                    options: ["du / du", "Sie / Sie", "ihr / ihr", "er / er"],
                    answer: 1,
                    explanation: "Hurmat shaklidagi Imperativda fe'l boshida keladi va 'Sie' olmoshi saqlanadi: Trinken Sie ... bleiben Sie."
                },
                {
                    q: "Ko'plikdagi tana a'zolari bilan qaysi biri to'g'ri: 'Meine Beine ___ weh.'",
                    options: ["tut", "tun", "macht", "haben"],
                    answer: 1,
                    explanation: "'Meine Beine' (oyoqlarim) ko'plikda bo'lgani uchun fe'l ham ko'plikda bo'ladi: tun weh."
                },
                {
                    q: "Shifokor yozib beradigan dori qog'ozi nemis tilida nima deyiladi?",
                    options: ["der Schein", "das Rezept", "die Rechnung", "der Brief"],
                    answer: 1,
                    explanation: "Shifokor retsepti 'das Rezept' deb ataladi."
                },
                {
                    q: "Kasal bo'lgan insonga tezroq sog'ayib ketishini tilash uchun qaysi ibora aytiladi?",
                    options: ["Guten Appetit!", "Herzlichen Glückwunsch!", "Gute Besserung!", "Viel Glück!"],
                    answer: 2,
                    explanation: "'Gute Besserung!' = Tezroq tuzalib keting / Shifo tilayman."
                },
                {
                    q: "'sein' fe'lining 'du' uchun buyruq shakli qaysi?",
                    options: ["Bist!", "Sei!", "Seid!", "Seien!"],
                    answer: 1,
                    explanation: "'sein' fe'lining 'du' uchun maxsus Imperativ shakli 'Sei!' (masalan: Sei ruhig!)."
                },
                {
                    q: "'Ich möchte einen ___ beim Zahnarzt vereinbaren.' Bo'sh joyga mos so'z:",
                    options: ["Termin", "Urlaub", "Beruf", "Ausflug"],
                    answer: 0,
                    explanation: "Shifokor qabuliga vaqt belgilash 'einen Termin vereinbaren' deyiladi."
                },
                {
                    q: "'schlafen' fe'lining 'du' uchun buyruq shakli qanday bo'ladi?",
                    options: ["Schläf!", "Schlafst!", "Schlaf!", "Schlafe!"],
                    answer: 2,
                    explanation: "Imperativda 'du' shaklida a &rarr; ä umlaut o'zgarishi sodir bo'lmaydi: Schlaf gut!"
                }
            ],
            gamePairs: [
                { de: "der Kopf tut weh", uz: "bosh og'riyapti" },
                { de: "Gute Besserung!", uz: "Tezroq tuzaling!" },
                { de: "das Medikament", uz: "dori-darmon" },
                { de: "der Termin", uz: "shifokor qabuli vaqti" },
                { de: "hohes Fieber", uz: "yuqori isitma" },
                { de: "Nimm die Medizin!", uz: "Dorini ich!" },
                { de: "Bleiben Sie im Bett!", uz: "O'rinda yoting!" },
                { de: "Halsschmerzen", uz: "tomoq og'rig'i" }
            ]
        },

        // ============================================================
        // 7-MAVZU: Bog'lovchilar va Ergash gaplar
        // ============================================================
        {
            id: 'a2_7',
            number: 7,
            title: "Bog'lovchilar va Ergash gaplar",
            germanTitle: "Konjunktionen und Nebensätze (weil, dass, wenn, deshalb, denn)",
            icon: "🔗",
            description: "Sabab, shart va mazmun bog'lovchilari: fe'lni gap oxiriga suruvchi bog'lovchilar (Nebensatz) va odatiy bosh gap tartibi (Hauptsatz).",
            theory: {
                summary: "Murakkab fikrlarni bir-biriga bog'lash, sababini tushuntirish va shart qo'yish uchun nemis tilida maxsus bog'lovchilar ishlatiladi. Ushbu bog'lovchilar gapdagi so'z tartibiga bevosita ta'sir ko'rsatadi.",
                sections: [
                    {
                        heading: "1. Ergash gaplar va \"Fe'l oxirda\" qoidasi (weil, dass, wenn)",
                        content: "<p>Nemis tilida <strong>Nebensatz (ergash gap)</strong> yasovchi bog'lovchilardan so'ng eng muhim qoida amal qiladi: <strong>tuslangan fe'l qat'iy ravishda gapning eng oxiriga suriladi!</strong></p><ul><li><strong>weil (chunki, sababli):</strong> harakatning sababini tushuntiradi.<br><em>Ich lerne Deutsch, <strong>weil</strong> ich in Deutschland studieren <strong>will</strong>.</em> (will eng oxirida!)<br><em>Er kommt heute nicht, <strong>weil</strong> er krank <strong>ist</strong>.</em></li><li><strong>dass (-ki, -ganligini):</strong> fikr, sezgi yoki xabarning mazmunini to'ldiradi.<br><em>Ich weiß, <strong>dass</strong> Deutsch sehr wichtig <strong>ist</strong>.</em><br><em>Ich hoffe, <strong>dass</strong> du bald gesund <strong>wirst</strong>.</em></li><li><strong>wenn (agar, -sa / qachonki):</strong> shart yoki takrorlanuvchi paytni bildiradi.<br><em><strong>Wenn</strong> ich Zeit <strong>habe</strong>, lese ich ein Buch.</em><br><em>Diqqat:</em> Agar gap 'Wenn...' bilan boshlansa, verguldan keyingi bosh gap darhol <strong>fe'l bilan</strong> boshlanadi: <em>Wenn es regnet, <strong>bleibe</strong> ich zu Hause.</em></li></ul>",
                        examples: [
                            { de: "Ich bleibe heute zu Hause, weil ich müde bin.", uz: "Men bugun uyda qolaman, chunki charchaganman.", tip: "weil sababli 'bin' fe'li gapning eng oxiriga o'tdi." },
                            { de: "Ich glaube, dass er die Prüfung besteht.", uz: "Men uning imtihondan o'tishiga ishonaman.", tip: "dass bog'lovchisi -> besteht fe'li oxirda." },
                            { de: "Wenn das Wetter schön ist, machen wir ein Picknick.", uz: "Agar ob-havo yaxshi bo'lsa, biz piknik qilamiz.", tip: "Wenn bilan boshlansa: verguldan so'ng darhol fe'l (machen wir)." }
                        ]
                    },
                    {
                        heading: "2. \"denn\" va \"deshalb / darum\" bilan qiyoslash",
                        content: "<p>Nemis tilida sabab va natijani ifodalashning 3 xil usuli mavjud bo'lib, ularda so'z tartibi mutlaqo boshqacha bo'ladi:</p><table class=\"curriculum-table\"><thead><tr><th>Bog'lovchi</th><th>Gap turi va Fe'l o'rni</th><th>Misol</th></tr></thead><tbody><tr><td><strong>weil</strong> (chunki)</td><td>Ergash gap (Nebensatz):<br>Fe'l <strong>eng oxirida</strong></td><td>Ich bleibe zu Hause, <strong>weil</strong> ich krank <strong>bin</strong>.</td></tr><tr><td><strong>denn</strong> (chunki)</td><td>Bosh gap (Hauptsatz, 0-o'rin):<br>So'z tartibi <strong>o'zgarmaydi</strong> (fe'l 2-o'rinda)</td><td>Ich bleibe zu Hause, <strong>denn</strong> ich <strong>bin</strong> krank.</td></tr><tr><td><strong>deshalb / darum</strong> (shuning uchun)</td><td>Bog'lovchi ravish (1-o'rin):<br>Fe'l darhol <strong>2-o'rinda</strong> keladi</td><td>Ich bin krank, <strong>deshalb</strong> <strong>bleibe</strong> ich zu Hause.</td></tr></tbody></table><p><em>Xulosa:</em> <strong>weil</strong> fe'lni oxirga suradi; <strong>denn</strong> o'zidan keyin odatiy gap tartibini saqlaydi (denn + ega + fe'l); <strong>deshalb</strong> esa o'zidan keyin darhol fe'lni talab qiladi (deshalb + fe'l + ega).</p>",
                        examples: [
                            { de: "Er kann nicht schlafen, weil er zu viel Kaffee getrunken hat.", uz: "U uxlay olmayapti, chunki juda ko'p kofe ichgan.", tip: "weil: tuslangan yordamchi fe'l 'hat' eng oxirida." },
                            { de: "Er kann nicht schlafen, denn er hat zu viel Kaffee getrunken.", uz: "U uxlay olmayapti, chunki u juda ko'p kofe ichgan.", tip: "denn: 0-o'rin, ketidan ega (er) va fe'l (hat) keladi." },
                            { de: "Er hat zu viel Kaffee getrunken, deshalb kann er nicht schlafen.", uz: "U juda ko'p kofe ichgan, shuning uchun uxlay olmayapti.", tip: "deshalb: darhol fe'l (kann) keladi." }
                        ]
                    },
                    {
                        heading: "3. Fikr bildirish va muloqotda ravonlik",
                        content: "<p>Ergash gaplar yordamida nutqingizni ancha boyitishingiz va A2 darajasida erkin fikr bildirishingiz mumkin:</p><ul><li><strong>Fikr bildirish:</strong><br><em>Ich finde, dass...</em> (Menimcha, ...ki)<br><em>Ich meine, dass...</em> (Men shunday hisoblaymanki, ...)<br><em>Ich bin sicher, dass...</em> (Aminmanki, ...)</li><li><strong>Sababini izohlash:</strong><br><em>Ich kann leider nicht mitkommen, weil ich noch arbeiten muss.</em></li><li><strong>Shart va taklif:</strong><br><em>Sag mir bitte Bescheid, wenn du Zeit hast!</em> (Vaqting bo'lsa, menga xabar ber).</li></ul>",
                        examples: [
                            { de: "Ich finde, dass Deutsch lernen viel Spaß macht.", uz: "Menimcha, nemis tilini o'rganish juda qiziqarli.", tip: "Ich finde, dass... iborasi nutqda eng ko'p ishlatiladi." },
                            { de: "Sag mir bitte Bescheid, wenn du am Bahnhof ankommst!", uz: "Vokzalga yetib kelganingda menga xabar ber!", tip: "Bescheid sagen = xabar bermoq; wenn fe'lni oxirga suradi." },
                            { de: "Es ist wichtig, dass wir pünktlich sind.", uz: "Vaqtida yetib borishimiz muhimdir.", tip: "Es ist wichtig, dass... = ...muhimdir." }
                        ]
                    }
                ],
                keyRules: [
                    "weil, dass, wenn bog'lovchilaridan keyin tuslangan fe'l gapning eng oxiriga boradi.",
                    "Agar gap 'Wenn...' bilan boshlansa, ikkinchi gap darhol fe'l bilan boshlanadi: Wenn..., mache ich...",
                    "denn 0-o'rinda turadi, gap tartibi o'zgarmaydi: ..., denn ich bin krank.",
                    "deshalb 1-o'rinda turadi, undan keyin darhol fe'l keladi: ..., deshalb bleibe ich zu Hause."
                ]
            },
            flashcards: [
                { front: "weil", back: "chunki, sababli (fe'l oxirda)", tip: "Ich lerne, weil ich die Prüfung bestehen will." },
                { front: "dass", back: "-ki, -ganligini (fe'l oxirda)", tip: "Ich weiß, dass du recht hast." },
                { front: "wenn", back: "agar, -sa; qachonki (fe'l oxirda)", tip: "Wenn es regnet, bleibe ich zu Hause." },
                { front: "denn", back: "chunki (0-o'rin, fe'l 2-o'rinda)", tip: "..., denn ich habe keine Zeit." },
                { front: "deshalb / darum", back: "shuning uchun (fe'l 2-o'rinda)", tip: "Ich habe keine Zeit, deshalb komme ich nicht." },
                { front: "Ich glaube, dass...", back: "Ishonamanki, ... / O'ylaymanki, ...", tip: "Fikr bildirish: Ich glaube, dass es klappt." },
                { front: "Ich weiß, dass...", back: "Bilamanki, ...", tip: "Ich weiß, dass du fleißig bist." },
                { front: "Ich finde, dass...", back: "Menimcha, ...", tip: "Ich finde, dass dieser Film toll ist." },
                { front: "Wenn es regnet, ...", back: "Agar yomg'ir yog'sa, ...", tip: "Wenn es regnet, nehmen wir einen Regenschirm." },
                { front: "...weil ich keine Zeit habe", back: "...chunki vaqtim yo'q", tip: "weil da fe'l oxirda turadi." },
                { front: "Sag mir Bescheid!", back: "Menga xabar ber!", tip: "Bescheid sagen = xabardor qilmoq." },
                { front: "die Meinung (-en)", back: "fikr, mulohaza", tip: "meiner Meinung nach = mening fikrimcha." },
                { front: "der Grund (⸚e)", back: "sabab, asos", tip: "aus diesem Grund = shu sababli." },
                { front: "wichtig", back: "muhim", tip: "Es ist sehr wichtig, dass..." },
                { front: "wahrscheinlich", back: "ehtimol, katta ehtimol bilan", tip: "Er kommt wahrscheinlich morgen." }
            ],
            test: [
                {
                    q: "Bo'sh joyni to'ldiring: 'Ich lerne Deutsch, weil ich in Deutschland studieren ___.'",
                    options: ["will", "willst", "wollen", "wollte"],
                    answer: 0,
                    explanation: "'weil' bo'lgani sababli tuslangan modal fe'l gapning eng oxiriga boradi: ich ... will."
                },
                {
                    q: "'Er kommt heute nicht, denn er ___ krank.' Bo'sh joyga mos fe'l:",
                    options: ["ist", "bin", "sein", "wäre"],
                    answer: 0,
                    explanation: "'denn' 0-o'rinda turadi va so'z tartibi o'zgarmaydi: denn (0) + er (1) + ist (2) krank."
                },
                {
                    q: "'Er ist krank, deshalb ___ er heute zu Hause.' Bo'sh joyni to'ldiring:",
                    options: ["bleibt", "bleiben", "geblieben", "bleibe"],
                    answer: 0,
                    explanation: "'deshalb' ko'rsatuvchi ravish bo'lib, 1-o'rinda keladi, 2-o'rinda darhol fe'l (bleibt) kelishi shart."
                },
                {
                    q: "'Wenn ich nach Hause komme, ___ ich zuerst zu Abend.' Qaysi so'z tartibi to'g'ri?",
                    options: ["esse", "ich esse", "gegessen", "habe gegessen"],
                    answer: 0,
                    explanation: "Agar gap 'Wenn...' bilan boshlansa, bosh gap verguldan keyin darhol fe'l bilan boshlanadi: esse ich."
                },
                {
                    q: "Bo'sh joyni to'ldiring: 'Ich finde, ___ Deutsch eine sehr interessante Sprache ist.'",
                    options: ["weil", "dass", "denn", "deshalb"],
                    answer: 1,
                    explanation: "'Ich finde, dass...' (Menimcha, ...ki) tobe gap bog'lovchisi bo'lib, fikr mazmunini bildiradi."
                },
                {
                    q: "'weil' bog'lovchisidan keyin tuslangan fe'l qayerda joylashadi?",
                    options: [
                        "Darak gapdagi kabi 2-o'rinda",
                        "Gapning eng oxirida",
                        "Gapning eng boshida",
                        "Eganing oldida"
                    ],
                    answer: 1,
                    explanation: "'weil' tobe ergash gap (Nebensatz) bog'lovchisi bo'lib, tuslangan fe'lni gap oxiriga suradi."
                },
                {
                    q: "'denn' bog'lovchisi gapda nechanchi o'rinni egallaydi?",
                    options: [
                        "0-o'rinni, so'z tartibi o'zgarmaydi",
                        "1-o'rinni, ketidan fe'l keladi",
                        "Eng oxirgi o'rinni",
                        "2-o'rinni"
                    ],
                    answer: 0,
                    explanation: "'denn' koordinatsiyalovchi bog'lovchi (ADUSO guruhiga kiradi) bo'lib, 0-o'rinda hisoblanadi va so'z tartibi o'zgarmaydi."
                },
                {
                    q: "'Wir gehen spazieren, wenn das Wetter schön ___.' Bo'sh joyni to'ldiring:",
                    options: ["ist", "wird", "sein", "war"],
                    answer: 0,
                    explanation: "'wenn' ergash gap yasovchi bog'lovchi bo'lgani uchun 'ist' fe'li gapning eng oxirida turadi."
                },
                {
                    q: "Qaysi gap grammatik jihatdan 100% to'g'ri tuzilgan?",
                    options: [
                        "Ich bleibe zu Hause, weil es heute stark regnet.",
                        "Ich bleibe zu Hause, weil regnet es heute stark.",
                        "Ich bleibe zu Hause, denn es heute stark regnet.",
                        "Ich bleibe zu Hause, deshalb es heute stark regnet."
                    ],
                    answer: 0,
                    explanation: "'weil' dan keyin fe'l (regnet) gap oxiriga o'tadi: weil es heute stark regnet."
                },
                {
                    q: "'U juda charchagan edi, shuning uchun uxlab qoldi' gapining to'g'ri nemischa varianti:",
                    options: [
                        "Er war sehr müde, deshalb ist er eingeschlafen.",
                        "Er war sehr müde, deshalb er ist eingeschlafen.",
                        "Er war sehr müde, weil ist er eingeschlafen.",
                        "Er war sehr müde, denn er eingeschlafen ist."
                    ],
                    answer: 0,
                    explanation: "'deshalb' dan keyin darhol yordamchi fe'l (ist) keladi: deshalb ist er eingeschlafen."
                }
            ],
            gamePairs: [
                { de: "weil ich müde bin", uz: "chunki charchaganman" },
                { de: "denn ich bin müde", uz: "chunki men charchaganman" },
                { de: "deshalb schlafe ich", uz: "shuning uchun uxlayapman" },
                { de: "ich weiß, dass...", uz: "bilamanki, ..." },
                { de: "wenn du Zeit hast", uz: "agar vaqting bo'lsa" },
                { de: "ich glaube, dass...", uz: "o'ylaymanki, ..." },
                { de: "deshalb lerne ich", uz: "shuning uchun o'rganyapman" },
                { de: "weil es regnet", uz: "chunki yomg'ir yog'yapti" }
            ]
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.deutschCurriculum['A2'];
}
