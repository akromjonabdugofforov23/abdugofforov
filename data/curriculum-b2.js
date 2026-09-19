// ============================================================
// DEUTSCH AKADEMIYASI — B2 O'QUV DASTURI (CURRICULUM)
// Daraja: B2 (Mittelstufe Deutsch / Yuqori O'rta)
// Mavzular soni: 7 ta to'liq modul
// ============================================================

window.deutschCurriculum = window.deutschCurriculum || {};

window.deutschCurriculum['B2'] = {
    level: 'B2',
    badge: '🏔️ Yuqori O\'rta',
    title: 'B2 — Mittelstufe Deutsch (Yuqori daraja)',
    description: 'Kasbiy, akademik va ilmiy nemis tili, murakkab grammatik strukturalar va bahs-munozara mahorati.',
    topics: [
        // ========================================================
        // 1-MAVZU: Majhul nisbat alternativlari (Passiv-Ersatzformen)
        // ========================================================
        {
            id: 'b2_1',
            number: 1,
            title: 'Majhul nisbat alternativlari',
            germanTitle: 'Passiv-Ersatzformen (Passiv-Alternativen)',
            icon: '🔄',
            description: 'Passiv (werden + Partizip II) o\'rnini bosuvchi modal konstruksiyalar: sein + zu + Inf., sich lassen, -bar, -lich, -fähig qo\'shimchalari va ilmiy uslub vositalari.',
            theory: {
                summary: 'Nemis tili B2 darajasida an\'anaviy Passiv (Vorgangspassiv) konstruktsiyalarining matnda ketma-ket takrorlanishidan qochish va matnga ixcham, rasmiy yoki ilmiy tus berish uchun Passiv-Ersatzformen (Passiv o\'rnini bosuvchi shakllar) faol qo\'llaniladi. Bu tuzilmalar asosan "können + Passiv" (imkoniyat) yoki "müssen / nicht dürfen + Passiv" (majburiyat / taqiq) ma\'nolarini ifodalaydi.',
                sections: [
                    {
                        heading: '1. sein + zu + Infinitiv konstruksiyasi',
                        content: '<p>Ushbu qolip B2 darajasida eng ko\'p uchraydigan passiv alternativlardan biridir. U kontekstga qarab ikki xil modal ma\'noni beradi:</p>' +
                            '<ul>' +
                            '<li><strong>Imkoniyat (können + Passiv):</strong> Agar gapda inkor yoki qiyinchilik/osonlik ma\'nosi bo\'lsa: <em>Das Problem ist leicht zu lösen</em> (= Das Problem kann leicht gelöst werden).</li>' +
                            '<li><strong>Majburiyat (müssen / sollen + Passiv):</strong> Agar ishni bajarish shart bo\'lsa: <em>Die Hausaufgabe ist bis morgen abzugeben</em> (= Die Hausaufgabe muss bis morgen abgegeben werden).</li>' +
                            '<li><strong>Taqiq (nicht dürfen + Passiv):</strong> Inkor yuklamasi bilan: <em>Hier ist nicht zu rauchen</em> (= Hier darf nicht geraucht werden).</li>' +
                            '</ul>' +
                            '<p>E\'tibor bering: gapdagi ega (Subjekt) grammatik jihatdan bosh kelishikda (Nominativ) bo\'lsa-da, aslida ish-harakat obyekti hisoblanadi.</p>',
                        examples: [
                            { de: 'Diese wichtige Aufgabe ist bis Freitag zu erledigen.', uz: 'Bu muhim vazifa jumagacha bajarilishi shart (muss erledigt werden).', tip: 'sein + zu = majburiyat' },
                            { de: 'Die Handschrift des Arztes ist kaum zu entziffern.', uz: 'Shifokorning qo\'lyozmasini deyarli o\'qib bo\'lmaydi (kann kaum entziffert werden).', tip: 'sein + zu = imkoniyat (inkor bilan)' },
                            { de: 'Dieses Dokument ist vertraulich zu behandeln.', uz: 'Ushbu hujjat maxfiy tarzda saqlanishi / ko\'rib chiqilishi lozim.', tip: 'muss vertraulich behandelt werden' }
                        ]
                    },
                    {
                        heading: '2. sich lassen + Infinitiv va o\'zlik fe\'llari',
                        content: '<p><strong>sich lassen + Infinitiv</strong> har doim faqat <strong>können + Passiv</strong> (imkoniyat yoki mumkinlik) ma\'nosini beradi. Bu qolipda ish-harakat bajaruvchisi (agent) ko\'rsatilmaydi:</p>' +
                            '<p><em>Das Auto lässt sich reparieren.</em> = Das Auto kann repariert werden (Mashinani tuzatsa bo\'ladi).</p>' +
                            '<p><em>Der Fehler lässt sich nicht mehr korrigieren.</em> = Der Fehler kann nicht mehr korrigiert werden (Xatoni endi to\'g\'rilab bo\'lmaydi).</p>' +
                            '<p>Shuningdek, ba\'zi fe\'llar o\'zlik olmoshi (sich) bilan passiv ma\'no kasb etadi: <em>Das Buch verkauft sich hervorragend</em> (= Das Buch wird sehr gut verkauft).</p>',
                        examples: [
                            { de: 'Die Theorie lässt sich durch Experimente belegen.', uz: 'Nazariyani tajribalar orqali isbotlasa bo\'ladi (kann belegt werden).', tip: 'sich lassen = qilsa bo\'ladi' },
                            { de: 'Dieser Konflikt lässt sich nur friedlich beilegen.', uz: 'Bu mojaroni faqat tinch yo\'l bilan hal qilish mumkin.', tip: 'kann nur friedlich beigelegt werden' },
                            { de: 'Die Tür lässt sich schwer öffnen.', uz: 'Eshik qiyinchilik bilan ochilyapti / ochilmoqda.', tip: 'kann schwer geöffnet werden' }
                        ]
                    },
                    {
                        heading: '3. Sifat yasovchi qo\'shimchalar (-bar, -lich, -fähig) va boshqa qoliplar',
                        content: '<p>O\'timli fe\'llardan yasalgan maxsus sifatlar ham passiv ma\'nosini beradi:</p>' +
                            '<table>' +
                            '<tr><th>Qo\'shimcha</th><th>Misol</th><th>Passiv ma\'nosi</th></tr>' +
                            '<tr><td><strong>-bar</strong></td><td>machbar, lösbar, bezahlbar</td><td>kann gemacht / gelöst / bezahlt werden</td></tr>' +
                            '<tr><td><strong>-lich</strong></td><td>verständlich, vermeidlich</td><td>kann verstanden / vermieden werden</td></tr>' +
                            '<tr><td><strong>-fähig</strong></td><td>anpassungsfähig, transportfähig</td><td>kann angepasst / transportiert werden</td></tr>' +
                            '</table>' +
                            '<p>Qo\'shimcha ravishda: <strong>bleiben + zu + Infinitiv</strong> ("hali qilinishi kerak"): <em>Es bleibt abzuwarten</em> (= Man muss noch abwarten).</p>',
                        examples: [
                            { de: 'Das Leitungswasser in dieser Region ist absolut trinkbar.', uz: 'Bu hududdagi kran suvi to\'liq ichishga yaroqli (kann getrunken werden).', tip: '-bar qo\'shimchasi' },
                            { de: 'Die entstandenen Schäden waren leider unvermeidlich.', uz: 'Yuzaga kelgan zararlar afsuski muqarrar edi (konnten nicht vermieden werden).', tip: '-lich qo\'shimchasi' },
                            { de: 'Es bleibt noch vieles vor der Konferenz zu besprechen.', uz: 'Konferensiyadan oldin hali muhokama qilinishi kerak bo\'lgan ko\'p narsa bor.', tip: 'bleiben + zu = hali shart' }
                        ]
                    }
                ],
                keyRules: [
                    'sein + zu + Infinitiv gap mazmuniga ko\'ra majburiyat (müssen) yoki imkoniyat (können) ifodalaydi.',
                    'sich lassen + Infinitiv doimo "können + Passiv"ga teng bo\'lib, unda hech qachon "von + Dativ" orqali bajaruvchi ko\'rsatilmaydi.',
                    '-bar qo\'shimchasi faqat o\'timli (Akkusativ talab qiluvchi) fe\'llardan yasaladi va "qilsa bo\'ladigan" sifatini hosil qiladi.',
                    'bleiben + zu + Infinitiv o\'zbek tiliga "qilinishi kerak bo\'lib qolmoqda" deb tarjima qilinadi.'
                ]
            },
            flashcards: [
                { front: 'machbar', back: 'amalga oshirib bo\'ladigan, qilsa bo\'ladigan', tip: 'kann gemacht werden' },
                { front: 'lösbar', back: 'yechsa bo\'ladigan, hal qilinadigan', tip: 'kann gelöst werden' },
                { front: 'sichtbar', back: 'ko\'rinadigan, ko\'zga tashlanadigan', tip: 'kann gesehen werden' },
                { front: 'unvermeidlich', back: 'muqarrar, qochib qutulib bo\'lmaydigan', tip: 'kann nicht vermieden werden' },
                { front: 'bezahlbar', back: 'narxi cho\'ntakbop, to\'lasa bo\'ladigan', tip: 'kann bezahlt werden' },
                { front: 'lesbar', back: 'o\'qilishi oson, ravshan', tip: 'kann gelesen werden' },
                { front: 'die Passiv-Ersatzform', back: 'majhul nisbat o\'rnini bosuvchi shakl', tip: 'Grammatik atama' },
                { front: 'sich lassen + Infinitiv', back: '...sa bo\'ladi (imkoniyat ma\'nosida)', tip: 'Das lässt sich einrichten' },
                { front: 'sein + zu + Infinitiv', back: '...ilishi kerak / ...sa bo\'ladi', tip: 'müssen / können + Passiv' },
                { front: 'bleiben + zu + Infinitiv', back: '...ilishi kerak bo\'lib qolmoqda', tip: 'Es bleibt festzuhalten' },
                { front: 'anwendbar', back: 'qo\'llasa / tatbiq etsa bo\'ladigan', tip: 'kann angewendet werden' },
                { front: 'heilbar', back: 'tuzatsa / davolasa bo\'ladigan', tip: 'kann geheilt werden' },
                { front: 'zerbrechlich', back: 'tez sinuvchan, mo\'rt', tip: 'kann leicht zerbrechen' },
                { front: 'erneuerbar', back: 'qayta tiklanuvchi (energiya)', tip: 'erneuerbare Energien' },
                { front: 'nachvollziehbar', back: 'mantiqan tushunarli, asosli', tip: 'kann nachvollzogen werden' }
            ],
            test: [
                {
                    q: '"Der Text lässt sich ohne Wörterbuch übersetzen." gapi qanday ma\'noni bildiradi?',
                    options: [
                        'Matn lug\'atsiz tarjima qilinishi shart.',
                        'Matnni lug\'atsiz tarjima qilsa bo\'ladi (mumkin).',
                        'Matn lug\'atsiz tarjima qilinmasligi kerak.',
                        'Kimdir matnni lug\'atsiz tarjima qilishga ruxsat bermoqda.'
                    ],
                    answer: 1,
                    explanation: '"sich lassen + Infinitiv" har doim "können + Passiv" ma\'nosini beradi: Der Text kann ohne Wörterbuch übersetzt werden.'
                },
                {
                    q: '"Diese Dokumente sind sofort an den Chef zu schicken." Ushbu gapning Passiv ekvivalenti qaysi?',
                    options: [
                        'Diese Dokumente können sofort an den Chef geschickt werden.',
                        'Diese Dokumente dürfen sofort an den Chef geschickt werden.',
                        'Diese Dokumente müssen sofort an den Chef geschickt werden.',
                        'Diese Dokumente wollen sofort an den Chef geschickt werden.'
                    ],
                    answer: 2,
                    explanation: '"sofort" (zudlik bilan) so\'zi majburiyatni ko\'rsatadi. Demak, "sein + zu" bu yerda "müssen + Passiv" ma\'nosida kelgan.'
                },
                {
                    q: 'Qaysi qo\'shimcha o\'timli fe\'ldan yasalib, "qilsa bo\'ladigan" ma\'nosidagi sifat hosil qiladi?',
                    options: ['-los', '-reich', '-bar', '-arm'],
                    answer: 2,
                    explanation: '-bar qo\'shimchasi (masalan, machbar, lösbar, essbar) "können + Passiv" ma\'nosidagi sifatlarni hosil qiladi.'
                },
                {
                    q: '"Hier ist nicht zu parken." nimani anglatadi?',
                    options: [
                        'Bu yerda mashina to\'xtatish taqiqlanadi (Hier darf nicht geparkt werden).',
                        'Bu yerda mashina to\'xtatish oson emas.',
                        'Bu yerda mashina to\'xtatish tavsiya qilinadi.',
                        'Bu yerda hamma mashinasini to\'xtatishi shart.'
                    ],
                    answer: 0,
                    explanation: '"sein + nicht zu + Infinitiv" qat\'iy taqiqni (nicht dürfen + Passiv) ifodalaydi.'
                },
                {
                    q: '"Es bleibt noch abzuwarten, wie sich die Lage entwickelt." Ushbu gap qanday tarjima qilinadi?',
                    options: [
                        'Vaziyat qanday rivojlanishini kutib bo\'lmaydi.',
                        'Vaziyat qanday rivojlanishini hali kutib ko\'rish kerak bo\'ladi.',
                        'Vaziyat allaqachon rivojlanib bo\'ldi.',
                        'Vaziyat rivojlanishini kutish taqiqlandi.'
                    ],
                    answer: 1,
                    explanation: '"bleiben + zu + Infinitiv" hali amalga oshirilishi shart bo\'lgan harakatni anglatadi.'
                },
                {
                    q: 'Qaysi javobda "sich lassen" to\'g\'ri grammatik shaklda qo\'llangan?',
                    options: [
                        'Das Problem lasst sich schnell lösen.',
                        'Das Problem lässt sich schnell lösen.',
                        'Das Problem lässt sich schnell gelöst werden.',
                        'Das Problem lassen sich schnell lösen.'
                    ],
                    answer: 1,
                    explanation: 'Das Problem (birlik, 3-shaxs) -> lässt sich + Infinitiv (lösen). Infinitiv passiv emas, oddiy shaklda bo\'ladi.'
                },
                {
                    q: '"nachvollziehbar" so\'zining ma\'nosi nima?',
                    options: [
                        'Kechikib keladigan',
                        'Mantiqan tushunarli va qabul qilsa bo\'ladigan',
                        'Harakatga keltirib bo\'lmaydigan',
                        'To\'liq bekor qilingan'
                    ],
                    answer: 1,
                    explanation: 'nachvollziehbar = kann nachvollzogen / verstanden werden (mantiqan anglasa bo\'ladigan).'
                },
                {
                    q: '"Seine Aussagen sind kaum glaubhaft." Ushbu gapda qanday ma\'no bor?',
                    options: [
                        'Uning gaplariga deyarli ishonib bo\'lmaydi (können kaum geglaubt werden).',
                        'Uning gaplari mutlaqo to\'g\'ri.',
                        'U hamma narsaga ishonadi.',
                        'Uning gaplariga hamma ishonishi shart.'
                    ],
                    answer: 0,
                    explanation: 'kaum glaubhaft = deyarli ishonarsiz / ishonib bo\'lmaydigan darajada.'
                },
                {
                    q: 'Qaysi gap Passiv-Ersatzform hisoblanmaydi?',
                    options: [
                        'Der Antrag ist schriftlich einzureichen.',
                        'Die Batterie lässt sich aufladen.',
                        'Der Brief wurde gestern vom Boten zugestellt.',
                        'Diese Methode ist wissenschaftlich anwendbar.'
                    ],
                    answer: 2,
                    explanation: '"Der Brief wurde gestern... zugestellt" bu klassik Vorgangspassiv (werden + Partizip II), uning alternativ shakli emas.'
                },
                {
                    q: 'Bo\'sh o\'rinni to\'ldiring: "Die alte Brücke ist wegen Baufälligkeit nicht mehr zu ______."',
                    options: ['benutzen', 'benutzt', 'benutzte', 'benutzbar'],
                    answer: 0,
                    explanation: '"sein + zu" qolipida fe\'l doimo Infinitiv (noaniq shakl) shaklida bo\'ladi: zu benutzen.'
                }
            ],
            gamePairs: [
                { de: 'machbar', uz: 'amalga oshirsa bo\'ladigan' },
                { de: 'lösbar', uz: 'yechimi bor' },
                { de: 'unvermeidlich', uz: 'qochib bo\'lmas, muqarrar' },
                { de: 'bezahlbar', uz: 'cho\'ntakbop, to\'lasa bo\'ladigan' },
                { de: 'erneuerbar', uz: 'qayta tiklanuvchi' },
                { de: 'sichtbar', uz: 'ko\'rinib turgan' },
                { de: 'lesbar', uz: 'o\'qilishi oson' },
                { de: 'zerbrechlich', uz: 'tez sinuvchan, mo\'rt' }
            ]
        },

        // ========================================================
        // 2-MAVZU: Bilvosita nutq va Konjunktiv I (Indirekte Rede)
        // ========================================================
        {
            id: 'b2_2',
            number: 2,
            title: 'Bilvosita nutq va Konjunktiv I',
            germanTitle: 'Indirekte Rede und Konjunktiv I',
            icon: '📰',
            description: 'Jurnalistika, OAV va rasmiy hisobotlarda uchinchi shaxs fikrini xolis yetkazish: Konjunktiv I shakllari, zamonlar va Konjunktiv II almashtirish qoidalari.',
            theory: {
                summary: 'Konjunktiv I nemis tilida asosan bilvosita nutqda (indirekte Rede) qo\'llanadi. Undan gazeta, televideniye, ilmiy tadqiqotlar va sud bayonnomalarida foydalaniladi. Uning asosiy vazifasi — xabar beruvchi shaxs ma\'lumot muallifi emasligini va o\'zini bu fikrdan xolis tutayotganini ko\'rsatishdir.',
                sections: [
                    {
                        heading: '1. Konjunktiv I ning yasalishi',
                        content: '<p>Konjunktiv I fe\'l negiziga maxsus qo\'shimchalar qo\'shish orqali yasaladi: <strong>-e, -est, -e, -en, -et, -en</strong>. Eng ko\'p ishlatiladigani 3-shaxs birlik (er/sie/es) shaklidir:</p>' +
                            '<ul>' +
                            '<li><em>haben:</em> er habe, sie habe</li>' +
                            '<li><em>sein:</em> ich sei, du seiest, er sei, wir seien, ihr seiet, sie seien (juda muhim va maxsus!)</li>' +
                            '<li><em>modal fe\'llar:</em> er könne, er müsse, er wolle, er solle, er dürfe</li>' +
                            '<li><em>boshqa fe\'llar:</em> er komme, er wisse, er sage</li>' +
                            '</ul>' +
                            '<p>Bilvosita nutqda to\'g\'ridan-to\'g\'ri gapdagi 1-shaxs 3-shaxsga o\'zgaradi: <em>"Ich bin krank"</em> &rarr; <em>Er sagt, er sei krank.</em></p>',
                        examples: [
                            { de: 'Der Minister betonte, die Wirtschaftskrise sei bald überwunden.', uz: 'Vazir iqtisodiy inqiroz tez orada yengib o\'tilishini ta\'kidladi.', tip: 'sein -> er sei' },
                            { de: 'Die Zeugin behauptet, sie habe den Täter genau erkannt.', uz: 'Guvoh jinoyatchini aniq taniganini da\'vo qilmoqda.', tip: 'haben -> sie habe' },
                            { de: 'Der Arzt rät, der Patient solle mehr Wasser trinken.', uz: 'Shifokor bemorga ko\'proq suv ichishi kerakligini maslahat bermoqda.', tip: 'sollen -> er solle' }
                        ]
                    },
                    {
                        heading: '2. Ersatzformen: Konjunktiv II bilan almashtirish',
                        content: '<p>Oltin qoida: <strong>Agar Konjunktiv I shakli oddiy hozirgi zamon (Indikativ) shakli bilan bir xil bo\'lib qolsa, uning o\'rniga Konjunktiv II ishlatiladi!</strong></p>' +
                            '<p>Masalan, <em>sie haben</em> (Indikativ) va <em>sie haben</em> (Konjunktiv I) bir xil. Shuning uchun bilvosita nutqda chalkashlik bo\'lmasligi uchun <strong>sie hätten</strong> shakliga o\'tiladi.</p>' +
                            '<p>Agar Konjunktiv II ham Indikativ Präteritum bilan bir xil bo\'lib qolsa, <strong>würde + Infinitiv</strong> konstruktsiyasi qo\'llanadi:</p>' +
                            '<p><em>Die Mitarbeiter sagten, sie würden morgen streiken.</em></p>',
                        examples: [
                            { de: 'Die Studenten meinten, sie hätten nicht genügend Zeit gehabt.', uz: 'Talabalar yetarli vaqtga ega bo\'lmaganliklarini aytishdi.', tip: 'haben o\'rniga hätten (Konjunktiv II)' },
                            { de: 'Experten warnen, die Preise würden drastisch steigen.', uz: 'Ekspertlar narxlar keskin ko\'tarilishi haqida ogohlantirmoqda.', tip: 'würden steigen' },
                            { de: 'Sie behaupteten, sie wüssten nichts von dem Vorfall.', uz: 'Ular hodisadan mutlaqo bexabar ekanliklarini da\'vo qilishdi.', tip: 'wissen -> wüssten' }
                        ]
                    },
                    {
                        heading: '3. Bilvosita nutqda zamonlar tizimi',
                        content: '<p>Bilvosita nutqda faqat 3 ta zamon tekisligi mavjud:</p>' +
                            '<table>' +
                            '<tr><th>Zamon</th><th>To\'g\'ridan-to\'g\'ri nutq</th><th>Bilvosita nutq (Konjunktiv I)</th></tr>' +
                            '<tr><td><strong>Gegenwart (Hozir)</strong></td><td>Präsens</td><td>Konjunktiv I Präsens (er lerne / er sei)</td></tr>' +
                            '<tr><td><strong>Vergangenheit (O\'tgan)</strong></td><td>Präteritum, Perfekt, Plusquamperfekt</td><td>sei / habe + Partizip II (er habe gelernt / er sei gereist)</td></tr>' +
                            '<tr><td><strong>Zukunft (Kelasi)</strong></td><td>Futur I / II</td><td>werde + Infinitiv (er werde lernen)</td></tr>' +
                            '</table>' +
                            '<p>E\'tibor bering: barcha o\'tgan zamonlar bitta Perfekt Konjunktiv I shakliga tushadi!</p>',
                        examples: [
                            { de: '"Ich arbeitete gestern." -> Er sagte, er habe gestern gearbeitet.', uz: 'U kecha ishlaganini aytdi.', tip: 'Präteritum -> habe gearbeitet' },
                            { de: '"Wir werden pünktlich ankommen." -> Sie versicherten, sie würden pünktlich ankommen.', uz: 'Ular o\'z vaqtida yetib borishlarini bildirishdi.', tip: 'werde / würden ankommen' },
                            { de: 'Laut Medienberichten sei der Präsident gestern abgereist.', uz: 'OAV xabarlariga ko\'ra, prezident kecha jo\'nab ketgan emish.', tip: 'sei abgereist' }
                        ]
                    }
                ],
                keyRules: [
                    'Konjunktiv I asosan 3-shaxsda (er/sie/es/man) o\'ziga xos shaklga ega: sei, habe, könne, wisse.',
                    'Konjunktiv I oddiy Indikativ bilan mos tushib qolganda, darhol Konjunktiv II ga (hätten, wären, würden) almashtiriladi.',
                    'O\'tgan zamondagi barcha 3 ta zamon (Präteritum, Perfekt, Plusquamperfekt) bilvosita nutqda bitta shaklga aylanadi: habe / sei + Partizip II.',
                    'Bilvosita nutq "dass" bog\'lovchisi bilan ham, bog\'lovchisiz to\'g\'ridan-to\'g\'ri gap tartibida ham ifodalanishi mumkin.'
                ]
            },
            flashcards: [
                { front: 'die indirekte Rede', back: 'bilvosita nutq', tip: 'Grammatik atama' },
                { front: 'er sei', back: 'u (erkak) emish / ekan', tip: 'sein fe\'li Konjunktiv I' },
                { front: 'er habe', back: 'unda bor emish / qilibdi', tip: 'haben fe\'li Konjunktiv I' },
                { front: 'er werde', back: 'u ... qilar emish / bo\'lar emish', tip: 'werden fe\'li Konjunktiv I' },
                { front: 'behaupten', back: 'da\'vo qilmoq, ta\'kidlamoq', tip: 'Er behauptet, er wisse nichts' },
                { front: 'mitteilen', back: 'ma\'lum qilmoq, xabar bermoq', tip: 'Die Behörde teilte mit...' },
                { front: 'betonen', back: 'alohida urg\'u berib ta\'kidlamoq', tip: 'Der Sprecher betonte...' },
                { front: 'versichern', back: 'ishontirib aytmoq, kafolat bermoq', tip: 'Er versicherte, er komme' },
                { front: 'laut + Dativ', back: '...ga ko\'ra, ...ning aytishicha', tip: 'Laut dem Bericht' },
                { front: 'nach Angaben von', back: '...ning bergan ma\'lumotlariga ko\'ra', tip: 'Nach Angaben der Polizei' },
                { front: 'demnach', back: 'shunga ko\'ra, demak', tip: 'Demnach sei der Plan fertig' },
                { front: 'bestreiten', back: 'inkor etmoq, rad qilmoq', tip: 'Er bestreitet die Vorwürfe' },
                { front: 'hervorheben', back: 'ajratib ko\'rsatmoq', tip: 'Die Studie hebt hervor...' },
                { front: 'unterstreichen', back: 'ta\'kidlamoq, ostiga chizmoq', tip: 'Der Kanzler unterstrich...' },
                { front: 'angeblich', back: 'taxmin qilinishicha, emish', tip: 'Er ist angeblich krank' }
            ],
            test: [
                {
                    q: 'Direkte Rede: "Ich habe den Schlüssel verloren." Ushbu gapning Konjunktiv I dagi bilvosita nutqi qaysi?',
                    options: [
                        'Er sagt, er habe den Schlüssel verloren.',
                        'Er sagt, er hat den Schlüssel verloren.',
                        'Er sagt, er hatte den Schlüssel verloren.',
                        'Er sagt, er verliere den Schlüssel.'
                    ],
                    answer: 0,
                    explanation: '3-shaxsda haben fe\'lining Konjunktiv I shakli "er habe" bo\'ladi: er habe den Schlüssel verloren.'
                },
                {
                    q: '"sein" fe\'lining Konjunktiv I 3-shaxs birlik (er/sie/es) shakli qaysi?',
                    options: ['ist', 'wäre', 'sei', 'seie'],
                    answer: 2,
                    explanation: 'sein fe\'lining Konjunktiv I shakllari: ich sei, du seiest, er/sie/es sei, wir seien, ihr seiet, sie seien.'
                },
                {
                    q: 'Nima uchun "Die Abgeordneten sagen, sie hätten keine Zeit" gapida "haben" o\'rniga "hätten" ishlatildi?',
                    options: [
                        'Chunki bu yerda gap shart mayli haqida ketmoqda.',
                        'Chunki "sie haben" shakli Indikativ bilan bir xil bo\'lib, noaniqlik tug\'diradi (Ersatzform).',
                        'Chunki "haben" fe\'lida Konjunktiv I shakli mavjud emas.',
                        'Chunki "hätten" fe\'li hurmat ma\'nosini bildiradi.'
                    ],
                    answer: 1,
                    explanation: 'Qoida: agar Konjunktiv I shakli Indikativ bilan bir xil bo\'lsa (sie haben = sie haben), chalkashmaslik uchun Konjunktiv II (hätten) ishlatiladi.'
                },
                {
                    q: 'Direkte Rede: "Wir kamen gestern spät an." Bilvosita nutqda qanday ifodalanadi?',
                    options: [
                        'Sie sagten, sie kamen gestern spät an.',
                        'Sie sagten, sie seien gestern spät angekommen.',
                        'Sie sagten, sie waren gestern spät angekommen.',
                        'Sie sagten, sie kämen gestern spät an.'
                    ],
                    answer: 1,
                    explanation: 'O\'tgan zamon (Präteritum) bilvosita nutqda "sei/seien + Partizip II" bo\'ladi: sie seien angekommen.'
                },
                {
                    q: 'Qaysi fe\'l uchinchi shaxs bayonotini yetkazish uchun mos EMAS?',
                    options: ['berichten', 'versichern', 'behaupten', 'einschlafen'],
                    answer: 3,
                    explanation: 'einschlafen (uxlab qolmoq) nutq yoki hisobot yetkazuvchi fe\'l (Verbum des Sagens) emas.'
                },
                {
                    q: '"Der Sprecher erklärte, die Verhandlungen ______ unterbrochen worden."',
                    options: ['seien', 'sind', 'waren', 'würden'],
                    answer: 0,
                    explanation: 'Passivning o\'tgan zamoni: seien ... unterbrochen worden (Konjunktiv I ko\'plikda seien).'
                },
                {
                    q: '"müssen" fe\'lining Konjunktiv I 3-shaxs birlik shakli qaysi?',
                    options: ['muss', 'müsste', 'müsse', 'musste'],
                    answer: 2,
                    explanation: 'müssen negizi muss- + Konjunktiv I qo\'shimchasi -e = er müsse (diqqat: umlauts bo\'lmaydi: er müsse).'
                },
                {
                    q: '"Laut der Umfrage ______ 60 Prozent der Bürger für die Reform."',
                    options: ['seien', 'waren', 'hätten', 'würden'],
                    answer: 0,
                    explanation: 'Laut + Dativ kontekstida uchinchi shaxs ko\'plikdagi holat Konjunktiv I da "seien" deb beriladi.'
                },
                {
                    q: 'Jurnalistlar nima sababdan to\'g\'ridan-to\'g\'ri Indikativ o\'rniga Konjunktiv I ni tanlashadi?',
                    options: [
                        'Nutqni bezash va uzunroq gaplar tuzish uchun.',
                        'O\'zlarining shaxsiy munosabatini va roziligini bildirish uchun.',
                        'Fikr manbasidan xolis bo\'lish va xabarning ishonchliligiga shaxsan kafolat bermaslik uchun.',
                        'Grammatik qoidalar shuni majbur qilgani uchun.'
                    ],
                    answer: 2,
                    explanation: 'Konjunktiv I jurnalistga xolislik (Distanzierung) beradi: fikr meniki emas, men faqat guvohning so\'zini keltiryapman.'
                },
                {
                    q: 'Quyidagi gaplardan qaysi biri Konjunktiv I da to\'g\'ri tuzilgan?',
                    options: [
                        'Er meinte, er weiß die Antwort ganz genau.',
                        'Er meinte, er wisse die Antwort ganz genau.',
                        'Er meinte, er gewusst die Antwort ganz genau.',
                        'Er meinte, er wissen die Antwort ganz genau.'
                    ],
                    answer: 1,
                    explanation: 'wissen fe\'lining Konjunktiv I shakli: er wisse.'
                }
            ],
            gamePairs: [
                { de: 'er sei', uz: 'u ekan / emish (sein)' },
                { de: 'er habe', uz: 'unda bor emish (haben)' },
                { de: 'er müsse', uz: 'u qilishi kerak emish' },
                { de: 'behaupten', uz: 'da\'vo qilmoq' },
                { de: 'mitteilen', uz: 'ma\'lum qilmoq' },
                { de: 'angeblich', uz: 'taxmin qilinishicha, emish' },
                { de: 'laut Bericht', uz: 'hisobotga ko\'ra' },
                { de: 'unterstreichen', uz: 'alohida ta\'kidlamoq' }
            ]
        },

        // ========================================================
        // 3-MAVZU: Juft bog'lovchilar (Doppelkonnektoren)
        // ========================================================
        {
            id: 'b2_3',
            number: 3,
            title: 'Juft bog\'lovchilar',
            germanTitle: 'Doppelkonnektoren (Mehrteilige Konnektoren)',
            icon: '🔗',
            description: 'Murakkab qiyoslash, zidlash, inkor va qo\'shish vositalari: nicht nur... sondern auch, sowohl... als auch, weder... noch, je... desto/umso, zwar... aber.',
            theory: {
                summary: 'Doppelkonnektoren (juft yoki ko\'p qismli bog\'lovchilar) fikrlar o\'rtasidagi mantiqiy bog\'liqlikni aniq va jozibali ifodalash uchun xizmat qiladi. B2 darajasida ular yozma va og\'zaki nutqni akademik darajaga ko\'tarib, gap tuzilishini boyitadi.',
                sections: [
                    {
                        heading: '1. Qo\'shish va birlashtirish: sowohl... als auch & nicht nur... sondern auch',
                        content: '<p>Ikkita ijobiy fikrni yoki sifatni bir-biriga qo\'shish uchun ishlatiladi:</p>' +
                            '<ul>' +
                            '<li><strong>sowohl... als auch</strong> (ham... ham...): Odatda <em>vergulsiz</em> yoziladi. Teng qiymatli ikkita narsani bog\'laydi. Masalan: <em>Er spricht sowohl Deutsch als auch Englisch.</em></li>' +
                            '<li><strong>nicht nur... sondern auch</strong> (nafaqat... balki... ham): Ikkinchi qism birinchisidan ko\'ra kuchliroq ekanini ta\'kidlaydi. <strong>sondern</strong> dan oldin doimo vergul qo\'yiladi! Masalan: <em>Sie ist nicht nur hochbegabt, sondern auch äußerst fleißig.</em></li>' +
                            '</ul>',
                        examples: [
                            { de: 'Das neue Smartphone ist sowohl benutzerfreundlich als auch energieeffizient.', uz: 'Yangi smartfon ham foydalanuvchiga qulay, ham energiyani tejovchidir.', tip: 'sowohl... als auch (vergulsiz)' },
                            { de: 'Er unterstützt uns nicht nur finanziell, sondern auch mit wertvollen Ratschlägen.', uz: 'U bizni nafaqat moliyaviy, balki qimmatli maslahatlari bilan ham qo\'llab-quvvatlaydi.', tip: 'nicht nur..., sondern auch (vergul bilan)' },
                            { de: 'Dieses Seminar richtet sich sowohl an Studierende als auch an Berufstätige.', uz: 'Ushbu seminar ham talabalarga, ham ishlayotgan mutaxassislarga mo\'ljallangan.', tip: 'Teng bog\'lanish' }
                        ]
                    },
                    {
                        heading: '2. Inkor va alternativa: weder... noch & entweder... oder',
                        content: '<p>Ikkita elementni birdek inkor qilish yoki birini tanlash:</p>' +
                            '<ul>' +
                            '<li><strong>weder... noch</strong> (na... va na...): Ikkala narsani ham to\'liq inkor qiladi. <em>DIQQAT:</em> Bu konstruksiyada gapda "nicht" yoki "kein" ishlatilmaydi, chunki inkor ma\'nosi bog\'lovchining o\'zida bor! Masalan: <em>Ich trinke weder Kaffee noch Tee.</em></li>' +
                            '<li><strong>entweder... oder</strong> (yoki... yoki...): Ikki variantdan birini tanlashni talab qiladi. Masalan: <em>Entweder wir unterschreiben den Vertrag heute, oder wir verlieren das Projekt.</em></li>' +
                            '</ul>',
                        examples: [
                            { de: 'Er hat weder die nötige Erfahrung noch die passende Ausbildung.', uz: 'Unda na zaruriy tajriba bor, na mos keluvchi ma\'lumot.', tip: 'weder... noch (inkorsiz gap)' },
                            { de: 'Entweder du kommst jetzt sofort mit, oder du bleibst ganz hier.', uz: 'Yoki sen hoziroq men bilan ketasan, yoki butunlay shu yerda qolasan.', tip: 'entweder... oder' },
                            { de: 'Das Hotel war weder sauber noch preiswert.', uz: 'Mehmonxona na toza edi, na arzon.', tip: 'Ikkala sifatni inkor qilish' }
                        ]
                    },
                    {
                        heading: '3. Qiyoslash va zidlash: je... desto/umso & zwar... aber',
                        content: '<p>Proporsional bog\'liqlik va yon bosish (zidlash):</p>' +
                            '<ul>' +
                            '<li><strong>je... desto / umso</strong> (qancha... shuncha...): "je" qismida qiyosiy sifat (Komparativ) va ergash gap so\'z tartibi (fe\'l oxirida). "desto/umso" qismida qiyosiy sifat va darhol tuslangan fe\'l (Inversion): <em>Je mehr du lernst, desto besser sprichst du.</em></li>' +
                            '<li><strong>zwar... aber</strong> (to\'g\'ri... lekin...): Biror haqiqatni tan olib, keyin unga qarshi dalil keltirish: <em>Das Auto ist zwar alt, aber sehr zuverlässig.</em></li>' +
                            '<li><strong>einerseits... andererseits</strong> (bir tomondan... ikkinchi tomondan...): Fe\'l darhol bog\'lovchidan keyin keladi: <em>Einerseits verstehe ich dich, andererseits muss ich ablehnen.</em></li>' +
                            '</ul>',
                        examples: [
                            { de: 'Je intensiver man eine Fremdsprache übt, desto schneller erzielt man Fortschritte.', uz: 'Chet tilini qanchalik jiddiy mashq qilsa, shunchalik tez yutuqlarga erishiladi.', tip: 'je + Nebensatz, desto + Verb' },
                            { de: 'Die Wohnung ist zwar relativ klein, aber sie hat eine wunderschöne Aussicht.', uz: 'Kvartira to\'g\'ri ancha kichkina, lekin uning ajoyib manzarasi bor.', tip: 'zwar... aber' },
                            { de: 'Einerseits reizt mich das Angebot, andererseits habe ich Bedenken.', uz: 'Bir tomondan taklif meni qiziqtirmoqda, ikkinchi tomondan menda xavotirlar bor.', tip: 'einerseits / andererseits' }
                        ]
                    }
                ],
                keyRules: [
                    '"je... desto/umso" qolipida "je" dan keyin doimo Nebensatz (fe\'l oxirida), "desto/umso" dan keyin esa Inversion (sifat + fe\'l + ega) bo\'ladi.',
                    '"weder... noch" o\'zida inkor ma\'nosini saqlaganligi sababli gapda boshqa inkor so\'zlari (nicht, nie, kein) ishlatilmaydi.',
                    '"nicht nur..., sondern auch" da "sondern" oldidan har doim vergul qo\'yiladi, "sowohl... als auch" da esa vergul qo\'yilmaydi.',
                    '"einerseits" va "andererseits" gap boshida kelganda darhol tuslangan fe\'l (Pozitsiya 2) keladi.'
                ]
            },
            flashcards: [
                { front: 'sowohl... als auch', back: 'ham... ham... (ikkalasi ham)', tip: 'vergulsiz qo\'llaniladi' },
                { front: 'nicht nur... sondern auch', back: 'nafaqat... balki... ham', tip: 'sondern oldidan vergul' },
                { front: 'weder... noch', back: 'na... va na... (inkor)', tip: 'qo\'shimcha inkor talab qilmaydi' },
                { front: 'entweder... oder', back: 'yoki... yoki... (tanlov)', tip: 'alternativa ifodasi' },
                { front: 'je... desto / umso', back: 'qanchalik... shunchalik...', tip: 'je + Komparativ, desto + Komparativ' },
                { front: 'zwar... aber', back: 'to\'g\'ri... ammo / lekin...', tip: 'yon bosish va zidlash' },
                { front: 'einerseits... andererseits', back: 'bir tomondan... ikkinchi tomondan...', tip: 'ikkala tomondan qarash' },
                { front: 'teils... teils', back: 'qisman... qisman...', tip: 'Teils lachte er, teils weinte er' },
                { front: 'mal... mal', back: 'goh... goh...', tip: 'Mal regnet es, mal scheint die Sonne' },
                { front: 'nicht so... wie', back: '...chalik emas (tengsizlik)', tip: 'nicht so teuer wie gedacht' },
                { front: 'je nachdem', back: '...ga qarab, holatga qarab', tip: 'Je nachdem, wie das Wetter wird' },
                { front: 'umso mehr', back: 'ayniqsa, shunchalik ko\'proq', tip: 'Ich freue mich umso mehr' },
                { front: 'geschweige denn', back: 'u yoqda tursin, hatto ... ham emas', tip: 'Er kann nicht schwimmen, geschweige denn tauchen' },
                { front: 'nicht etwa..., sondern', back: 'umuman bunday emas, aksincha...', tip: 'kuchli rad etish' },
                { front: 'weder Fisch noch Fleisch', back: 'na u yoqlik, na bu yoqlik (idioma)', tip: 'noaniq narsa haqida' }
            ],
            test: [
                {
                    q: 'Bo\'sh o\'rinni to\'ldiring: "Je mehr Vokabeln man lernt, ______ sicherer fühlt man sich."',
                    options: ['umso', 'desto mehr', 'als', 'wie'],
                    answer: 0,
                    explanation: '"je... desto" yoki "je... umso" qolipi. Sifat allaqachon berilgan ("sicherer"), shuning uchun faqat "umso" yoki "desto" kerak.'
                },
                {
                    q: 'Qaysi gapda tinish belgisi (vergul) to\'g\'ri qo\'yilgan?',
                    options: [
                        'Er spricht sowohl fließend Deutsch, als auch Spanisch.',
                        'Er spricht, sowohl fließend Deutsch als auch Spanisch.',
                        'Er spricht nicht nur fließend Deutsch, sondern auch Spanisch.',
                        'Er spricht nicht nur fließend Deutsch sondern auch Spanisch.'
                    ],
                    answer: 2,
                    explanation: '"nicht nur..., sondern auch" da "sondern" oldidan vergul shart. "sowohl... als auch" da esa vergul qo\'yilmaydi.'
                },
                {
                    q: '"Er hat weder Geld noch Freunde." Ushbu gap nimani anglatadi?',
                    options: [
                        'Unda pul ham, do\'stlar ham ko\'p.',
                        'Unda na pul bor, na do\'stlar.',
                        'Unda faqat pul bor, do\'stlari yo\'q.',
                        'U pulini faqat do\'stlariga sarflaydi.'
                    ],
                    answer: 1,
                    explanation: '"weder... noch" ikkala narsani ham inkor qiladi: na puli bor, na do\'sti.'
                },
                {
                    q: '"je... desto" qolipida so\'z tartibi qanday bo\'ladi?',
                    options: [
                        'je + Hauptsatz, desto + Nebensatz',
                        'je + Nebensatz (fe\'l oxirida), desto + Inversion (sifat + fe\'l + ega)',
                        'je + Inversion, desto + Hauptsatz',
                        'Ikkala qismda ham fe\'l oxirida keladi.'
                    ],
                    answer: 1,
                    explanation: '"je" qismi ergash gap (Nebensatz, fe\'l oxirida), "desto" qismi esa bosh gap (Inversion: Komparativ + tuslangan fe\'l + ega).'
                },
                {
                    q: 'Bo\'sh o\'rinni to\'ldiring: "Einerseits möchte ich reisen, ______ muss ich Geld sparen."',
                    options: ['sondern', 'andererseits', 'weder', 'desto'],
                    answer: 1,
                    explanation: '"einerseits" jufti "andererseits" hisoblanadi (bir tomondan... ikkinchi tomondan...).'
                },
                {
                    q: 'Qaysi gapda xatolik mavjud?',
                    options: [
                        'Er hat weder Zeit noch Lust.',
                        'Er hat weder keine Zeit noch keine Lust.',
                        'Er hat sowohl Zeit als auch Lust.',
                        'Er hat nicht nur Zeit, sondern auch Lust.'
                    ],
                    answer: 1,
                    explanation: '"weder... noch" o\'zida inkor saqlagani uchun unga "keine" yoki "nicht" qo\'shish qo\'pol xatodir.'
                },
                {
                    q: '"Das Hotel ist zwar teuer, ______ der Service ist hervorragend."',
                    options: ['aber', 'sondern', 'oder', 'denn'],
                    answer: 0,
                    explanation: '"zwar... aber" (to\'g\'ri... lekin...) barqaror juft bog\'lovchidir.'
                },
                {
                    q: '"Entweder wir beginnen jetzt sofort mit der Arbeit, ______ wir verschieben das Projekt auf nächste Woche."',
                    options: ['und', 'oder', 'aber', 'als'],
                    answer: 1,
                    explanation: '"entweder... oder" (yoki... yoki...) alternativani bildiradi.'
                },
                {
                    q: 'Quyidagi gapni to\'g\'ri davom ettiring: "Je länger der Vortrag dauerte, ______"',
                    options: [
                        'desto müder wurden die Zuhörer.',
                        'desto die Zuhörer wurden müder.',
                        'desto müder die Zuhörer wurden.',
                        'umso wurden müder die Zuhörer.'
                    ],
                    answer: 0,
                    explanation: 'desto + qiyosiy sifat (müder) + fe\'l (wurden) + ega (die Zuhörer) to\'g\'ri inversiya tartibidir.'
                },
                {
                    q: '"Er beherrscht nicht nur zwei Fremdsprachen perfekt, sondern hat auch jahrelange Auslandserfahrung." Ushbu gap nimani ta\'kidlaydi?',
                    options: [
                        'U chet tillarini umuman bilmaydi.',
                        'U nafaqat ikki tilni biladi, balki xorijda ham ko\'p yillik tajribaga ega.',
                        'U faqat chet elda ishlashni xohlaydi.',
                        'U tillarni o\'rganishga qiynalgan.'
                    ],
                    answer: 1,
                    explanation: '"nicht nur..., sondern auch" birinchi fikrga qo\'shimcha ravishda undan ham muhimroq ikkinchi faktni qo\'shadi.'
                }
            ],
            gamePairs: [
                { de: 'sowohl... als auch', uz: 'ham... ham... (ikkalasi)' },
                { de: 'nicht nur... sondern auch', uz: 'nafaqat... balki... ham' },
                { de: 'weder... noch', uz: 'na u... va na bu...' },
                { de: 'entweder... oder', uz: 'yoki... yoki... (tanlov)' },
                { de: 'je... desto', uz: 'qancha... shuncha...' },
                { de: 'zwar... aber', uz: 'to\'g\'ri... lekin...' },
                { de: 'einerseits... andererseits', uz: 'bir tomondan... boshqa tomondan...' },
                { de: 'teils... teils', uz: 'qisman... qisman...' }
            ]
        },

        // ========================================================
        // 4-MAVZU: Nomen-Verb-Verbindungen (Funktionsverbgefüge)
        // ========================================================
        {
            id: 'b2_4',
            number: 4,
            title: 'Nomen-Verb-Verbindungen (FVG)',
            germanTitle: 'Nomen-Verb-Verbindungen (Funktionsverbgefüge)',
            icon: '💼',
            description: 'B2/C1 darajasidagi rasmiy, ilmiy va kasbiy nutq qoliplari: zur Verfügung stehen/stellen, in Betracht ziehen, Abschied nehmen, eine Rolle spielen, in Kauf nehmen.',
            theory: {
                summary: 'Nomen-Verb-Verbindungen (Funktionsverbgefüge — FVG) — bu ot (ko\'pincha predlog bilan) va o\'z mustaqil lug\'aviy ma\'nosini qisman yoki butunlay yo\'qotgan fe\'l (Funktionsverb) ning barqaror birikmasidir. Ular oddiy fe\'llarning o\'rnini bosib, nutqni ancha nufuzli, ilmiy va professional darajaga ko\'taradi (masalan: sich entscheiden o\'rniga eine Entscheidung treffen).',
                sections: [
                    {
                        heading: '1. Aktiv va Passiv ma\'nodagi FVG farqi (stellen vs. stehen)',
                        content: '<p>Juda ko\'p FVG juftliklari aktiv yoki passiv ma\'no berishi bilan ajralib turadi:</p>' +
                            '<table>' +
                            '<tr><th>Aktiv qolip (harakat qildiruvchi)</th><th>Passiv qolip (holat/mavjudlik)</th><th>O\'zbekcha ma\'nosi</th></tr>' +
                            '<tr><td><strong>zur Verfügung stellen</strong></td><td><strong>zur Verfügung stehen</strong></td><td>taqdim etmoq / tayyor (mavjud) bo\'lmoq</td></tr>' +
                            '<tr><td><strong>zur Diskussion stellen</strong></td><td><strong>zur Diskussion stehen</strong></td><td>muhokamaga qo\'ymoq / muhokamada bo\'lmoq</td></tr>' +
                            '<tr><td><strong>in Aussicht stellen</strong></td><td><strong>in Aussicht stehen</strong></td><td>va\'da qilmoq / ko\'zda tutilmoq</td></tr>' +
                            '</table>' +
                            '<p><em>Die Universität stellt Unterkünfte zur Verfügung.</em> (Aktiv: taqdim etadi).<br>' +
                            '<em>Die Unterkünfte stehen den Studierenden zur Verfügung.</em> (Passiv ma\'no: mavjud/tayyor turibdi).</p>',
                        examples: [
                            { de: 'Für Rückfragen stehe ich Ihnen jederzeit gern zur Verfügung.', uz: 'Qo\'shimcha savollar uchun istalgan vaqtda sizning xizmatingizdaman.', tip: 'zur Verfügung stehen (juda mashhur rasmiy ibora)' },
                            { de: 'Die Firma stellt ihren Mitarbeitern moderne Laptops zur Verfügung.', uz: 'Kompaniya o\'z xodimlariga zamonaviy noutbuklar taqdim etadi.', tip: 'zur Verfügung stellen (aktiv harakat)' },
                            { de: 'Dieser strittige Punkt steht heute nicht zur Diskussion.', uz: 'Ushbu bahsli masala bugun muhokama qilinmaydi.', tip: 'zur Diskussion stehen' }
                        ]
                    },
                    {
                        heading: '2. Qaror, qabul qilish va xulosa birikmalari',
                        content: '<p>Qaror qabul qilish, mulohaza yuritish va tavakkal qilish ifodalari:</p>' +
                            '<ul>' +
                            '<li><strong>in Betracht ziehen</strong> (= berücksichtigen): Hisobga olmoq, e\'tiborga olmoq.</li>' +
                            '<li><strong>in Kauf nehmen</strong> (= akzeptieren): Biror salbiy oqibatni oldindan bilib, rozi bo\'lmoq / tavakkal qilmoq.</li>' +
                            '<li><strong>eine Entscheidung treffen</strong> (= sich entscheiden): Qaror qabul qilmoq.</li>' +
                            '<li><strong>in Kraft treten</strong> (= gültig werden): Qonun/qoida kuchga kirmoq.</li>' +
                            '<li><strong>einen Entschluss fassen</strong> (= beschließen): Qat\'iy qarorga kelmoq.</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Wir müssen alle Eventualitäten sorgfältig in Betracht ziehen.', uz: 'Biz barcha ehtimolliklarni sinchkovlik bilan hisobga olishimiz shart.', tip: 'in Betracht ziehen = berücksichtigen' },
                            { de: 'Wer ein eigenes Unternehmen gründet, muss Risiken in Kauf nehmen.', uz: 'O\'z kompaniyasini ochgan odam xatarlarni bo\'yniga olishi lozim.', tip: 'in Kauf nehmen = nochor rozi bo\'lmoq' },
                            { de: 'Die neuen Vorschriften treten ab dem 1. Oktober in Kraft.', uz: 'Yangi tartib-qoidalar 1-oktabrdan kuchga kiradi.', tip: 'in Kraft treten' }
                        ]
                    },
                    {
                        heading: '3. Ta\'sir, munosabat va e\'tiroz birikmalari',
                        content: '<p>Jamoat va ish munosabatlarida qo\'llaniladigan birikmalar:</p>' +
                            '<ul>' +
                            '<li><strong>Einfluss nehmen auf + Akk.</strong> (= beeinflussen): Ta\'sir o\'tkazmoq.</li>' +
                            '<li><strong>Kritik üben an + Dat.</strong> (= kritisieren): Tanqid qilmoq.</li>' +
                            '<li><strong>einen Beitrag leisten zu + Dat.</strong> (= beitragen): Hissa qo\'shmoq.</li>' +
                            '<li><strong>in Frage kommen</strong>: Mumkin bo\'lmoq, ko\'rib chiqilmoq (ko\'pincha inkorda: <em>Das kommt nicht in Frage!</em> = Gap ham bo\'lishi mumkin emas!).</li>' +
                            '<li><strong>Rücksicht nehmen auf + Akk.</strong> (= berücksichtigen): Hurmat qilmoq, inobatga olmoq.</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Die Medien nehmen großen Einfluss auf die öffentliche Meinung.', uz: 'OAV jamoatchilik fikriga ulkan ta\'sir ko\'rsatadi.', tip: 'Einfluss nehmen auf + Akk.' },
                            { de: 'Die Opposition übte scharfe Kritik an der Reform.', uz: 'Muxolifat islohotni keskin tanqid qildi.', tip: 'Kritik üben an + Dat.' },
                            { de: 'Ein Abbruch des Studiums kommt für mich überhaupt nicht in Frage.', uz: 'O\'qishni tashlab ketish men uchun aslo ko\'rib chiqilmaydi / mutlaqo mumkin emas.', tip: 'in Frage kommen' }
                        ]
                    }
                ],
                keyRules: [
                    'Nomen-Verb-Verbindungen tarkibidagi predloglar va kelishiklar qat\'iydir (in Betracht ziehen, zur Verfügung stehen).',
                    'Aktiv va passiv juftliklarni adashtirmang: stellen (aktiv boshqarish) vs. stehen (mavjud holat).',
                    'FVG tarkibidagi ot odatda sifat orqali kengaytirilishi mumkin: eine wichtige Entscheidung treffen, scharfe Kritik üben.',
                    'Goethe va telc B2 imtihonlarining "Schreiben" qismida FVG qo\'llash eng yuqori baholash mezonlaridan biri sanaladi.'
                ]
            },
            flashcards: [
                { front: 'zur Verfügung stehen', back: 'mavjud bo\'lmoq, tayyor turmoq (passiv)', tip: 'Ich stehe zur Verfügung' },
                { front: 'zur Verfügung stellen', back: 'taqdim etmoq, berib qo\'ymoq (aktiv)', tip: 'Wir stellen Geld zur Verfügung' },
                { front: 'in Betracht ziehen', back: 'hisobga olmoq, o\'ylab ko\'rmoq', tip: '= berücksichtigen' },
                { front: 'in Kauf nehmen', back: 'noiloj qabul qilmoq, tavakkal qilmoq', tip: '= akzeptieren (Nachteile)' },
                { front: 'eine Entscheidung treffen', back: 'qaror qabul qilmoq', tip: '= sich entscheiden' },
                { front: 'in Frage kommen', back: 'ehtimolda bo\'lmoq, hisobga olinmoq', tip: 'Das kommt nicht in Frage!' },
                { front: 'in Kraft treten', back: 'kuchga kirmoq (qonun)', tip: '= gültig werden' },
                { front: 'Einfluss nehmen auf', back: '...ga ta\'sir ko\'rsatmoq', tip: '= beeinflussen (+ Akk.)' },
                { front: 'Kritik üben an', back: '...ni tanqid qilmoq', tip: '= kritisieren (+ Dat.)' },
                { front: 'einen Beitrag leisten zu', back: '...ga hissa qo\'shmoq', tip: '= beitragen zu (+ Dat.)' },
                { front: 'Rücksicht nehmen auf', back: 'e\'tiborga olmoq, hisoblashmoq', tip: '= berücksichtigen (+ Akk.)' },
                { front: 'Abschied nehmen von', back: '...bilan xayrlashmoq', tip: '= sich verabschieden von' },
                { front: 'eine Rolle spielen', back: 'rol o\'ynamoq, ahamiyatga ega bo\'lmoq', tip: '= wichtig sein' },
                { front: 'Zweifel hegen an', back: '...ga shubha qilmoq', tip: '= zweifeln an (+ Dat.)' },
                { front: 'unter Beweis stellen', back: 'isbotlamoq, namoyish etmoq', tip: '= beweisen' }
            ],
            test: [
                {
                    q: '"Wir müssen alle Risiken in Kauf nehmen." Ushbu gapda "in Kauf nehmen" qanday ma\'noda kelgan?',
                    options: [
                        'Bozordan mahsulot sotib olmoq.',
                        'Ehtimoliy noqulaylik yoki zararlarni oldindan qabul qilmoq / bo\'yniga olmoq.',
                        'Savdolashib narxni tushirmoq.',
                        'Moliyaviy hisobot tayyorlamoq.'
                    ],
                    answer: 1,
                    explanation: '"in Kauf nehmen" noxush oqibatlarga qaramay vaziyatni qabul qilishni (akzeptieren) bildiradi.'
                },
                {
                    q: 'Bo\'sh o\'rinni to\'ldiring: "Ich möchte mich bei Ihnen bedanken und ______ nehmen."',
                    options: ['Abschied', 'Entscheidung', 'Einfluss', 'Zweifel'],
                    answer: 0,
                    explanation: '"Abschied nehmen von" = xayrlashmoq (sich verabschieden).'
                },
                {
                    q: '"beeinflussen" fe\'lining Nomen-Verb-Verbindung ekvivalenti qaysi?',
                    options: [
                        'Einfluss haben mit',
                        'Einfluss nehmen auf',
                        'in Einfluss stehen',
                        'Einfluss stellen zu'
                    ],
                    answer: 1,
                    explanation: 'Einfluss nehmen auf + Akkusativ = beeinflussen (ta\'sir ko\'rsatmoq).'
                },
                {
                    q: '"Das neue Sicherheitsgesetz ist gestern in ______ getreten."',
                    options: ['Kraft', 'Macht', 'Recht', 'Frage'],
                    answer: 0,
                    explanation: '"in Kraft treten" = kuchga kirmoq (amalda qo\'llana boshlamoq).'
                },
                {
                    q: '"Für weitere Auskünfte ______ Ihnen unser Berater gern zur Verfügung."',
                    options: ['stellt', 'steht', 'zieht', 'leistet'],
                    answer: 1,
                    explanation: 'Maslahatchi o\'zi sizning xizmatingizda turadi, shuning uchun passiv ma\'nodagi "steht" ishlatiladi.'
                },
                {
                    q: '"kritisieren" fe\'lining FVG shakli qaysi?',
                    options: [
                        'Kritik üben an (+ Dat.)',
                        'Kritik stellen auf (+ Akk.)',
                        'Kritik nehmen zu (+ Dat.)',
                        'in Kritik geraten von (+ Dat.)'
                    ],
                    answer: 0,
                    explanation: 'Kritik üben an + Dativ = kritisieren (tanqid qilmoq).'
                },
                {
                    q: '"Das kommt überhaupt nicht in Frage!" iborasining tarjimasi qanday?',
                    options: [
                        'Savolga hech kim javob bermadi.',
                        'Bu haqda gap ham bo\'lishi mumkin emas / mutlaqo istisno!',
                        'Bu savol juda qiziqarli.',
                        'Savolni qaytadan o\'qib chiqing.'
                    ],
                    answer: 1,
                    explanation: '"in Frage kommen" = mumkin bo\'lmoq. Inkor shaklda: "aslo mumkin emas / aslo bo\'lmaydi".'
                },
                {
                    q: '"berücksichtigen" fe\'lini qaysi birikma bilan almashtirish mumkin?',
                    options: [
                        'in Kauf nehmen',
                        'in Betracht ziehen',
                        'eine Rolle spielen',
                        'zur Debatte stehen'
                    ],
                    answer: 1,
                    explanation: 'in Betracht ziehen = berücksichtigen (inobatga olmoq, hisobga olmoq).'
                },
                {
                    q: '"Jeder Bürger kann einen wichtigen Beitrag zum Umweltschutz ______."',
                    options: ['treffen', 'stellen', 'leisten', 'ziehen'],
                    answer: 2,
                    explanation: '"einen Beitrag leisten zu" = hissa qo\'shmoq.'
                },
                {
                    q: 'Qaysi juftlikda AKTIV ma\'nodagi fe\'l qo\'llangan?',
                    options: [
                        'zur Verfügung stehen',
                        'zur Verfügung stellen',
                        'in Aussicht stehen',
                        'zur Diskussion stehen'
                    ],
                    answer: 1,
                    explanation: '"stellen" aktiv (harakat beruvchi) ma\'noda, "stehen" esa holat (passiv ma\'noda) qo\'llanadi.'
                }
            ],
            gamePairs: [
                { de: 'zur Verfügung stellen', uz: 'taqdim etmoq, bermoq' },
                { de: 'zur Verfügung stehen', uz: 'xizmatingizda tayyor turmoq' },
                { de: 'in Betracht ziehen', uz: 'hisobga olmoq' },
                { de: 'in Kauf nehmen', uz: 'tavakkalga rozi bo\'lmoq' },
                { de: 'eine Entscheidung treffen', uz: 'qaror qabul qilmoq' },
                { de: 'in Kraft treten', uz: 'kuchga kirmoq (qonun)' },
                { de: 'Kritik üben an', uz: 'tanqid qilmoq' },
                { de: 'einen Beitrag leisten', uz: 'hissa qo\'shmoq' }
            ]
        },

        // ========================================================
        // 5-MAVZU: Sifatdosh konstruksiyalari (Partizipialattribute)
        // ========================================================
        {
            id: 'b2_5',
            number: 5,
            title: 'Sifatdosh konstruksiyalari',
            germanTitle: 'Partizipien als Adjektive und erweiterte Partizipialattribute',
            icon: '📜',
            description: 'Partizip I (-end) va Partizip II sifat sifatida: erweiterte Partizipialattribute (kengaytirilgan sifatdosh guruhlari), Gerundivum (zu + Partizip I) va ularni tahlil qilish.',
            theory: {
                summary: 'Nemis tilida sifatdoshlar (Partizip I va Partizip II) ot oldida sifat kabi kelib, otning qo\'shimcha xususiyatini ko\'rsatishi mumkin. B2 va ilmiy-akademik matnlarda "kengaytirilgan sifatdosh guruhlari" (erweiterte Partizipialattribute) keng qo\'llanadi. Ular uzun nisbiy ergash gaplarning (Relativsatz) o\'rnini bosib, axborotni ixcham va zich tarzda yetkazadi.',
                sections: [
                    {
                        heading: '1. Partizip I sifat sifatida (Hozirgi davomli sifatdosh)',
                        content: '<p><strong>Partizip I</strong> fe\'lning noaniq shakliga (Infinitiv) <strong>-d</strong> harfini qo\'shish orqali yasaladi: <em>spielend, schlafend, steigend</em>. Ot oldida kelganda u sifat kabi moslashuvchi qo\'shimcha oladi:</p>' +
                            '<p>Partizip I har doim <strong>hozirgi zamonda sodir bo\'layotgan, davomli va aktiv</strong> jarayonni ifodalaydi: <em>das weinende Kind</em> (= das Kind, das weint).</p>' +
                            '<p><strong>Gerundivum (zu + Partizip I):</strong> Agar Partizip I oldidan "zu" qo\'yilsa, u <em>majburiyat yoki imkoniyat bildiruvchi passiv</em> sifatga aylanadi: <em>das zu lösende Problem</em> (= das Problem, das gelöst werden muss).</p>',
                        examples: [
                            { de: 'Die rasant steigenden Preise bereiten den Bürgern große Sorgen.', uz: 'Shiddat bilan ko\'tarilayotgan narxlar fuqarolarni jiddiy xavotirga solmoqda.', tip: 'steigend + e = o\'sayotgan (aktiv)' },
                            { de: 'Der am Fenster sitzende Mann las ein altes Buch.', uz: 'Deraza yonida o\'tirgan kishi eski kitob o\'qiyotgan edi.', tip: 'sitzend = o\'tirgan holatda bo\'lgan' },
                            { de: 'Die bis morgen einzureichenden Berichte müssen vollständig sein.', uz: 'Ertagacha topshirilishi kerak bo\'lgan hisobotlar to\'liq bo\'lishi shart.', tip: 'zu + Partizip I = Gerundivum (majburiyat)' }
                        ]
                    },
                    {
                        heading: '2. Partizip II sifat sifatida (Tugallangan va Majhul sifatdosh)',
                        content: '<p><strong>Partizip II</strong> (ge- ... -t / -en) sifat sifatida qo\'llanilganda:</p>' +
                            '<ul>' +
                            '<li><strong>O\'timli fe\'llarda:</strong> Har doim <em>o\'tgan zamon va majhul (passiv)</em> natijani ifodalaydi: <em>das reparierte Auto</em> (= das Auto, das repariert wurde).</li>' +
                            '<li><strong>Harakat bildiruvchi o\'timsiz (sein bilan keluvchi) fe\'llarda:</strong> <em>Tugallangan aktiv</em> harakatni ifodalaydi: <em>der angekommene Zug</em> (= der Zug, der angekommen ist).</li>' +
                            '</ul>' +
                            '<p>Partizip II ham ot oldida sifat kabi turlanadi (Adjektivdeklination).</p>',
                        examples: [
                            { de: 'Die gestern vom Parlament verabschiedeten Gesetze treten bald in Kraft.', uz: 'Kecha parlament tomonidan qabul qilingan qonunlar tez orada kuchga kiradi.', tip: '= die Gesetze, die verabschiedet wurden' },
                            { de: 'Das frisch renovierte Gebäude sieht wie neu aus.', uz: 'Yangi ta\'mirlangan bino xuddi yangidek ko\'rinmoqda.', tip: '= das Gebäude, das renoviert worden ist' },
                            { de: 'Die verspäteten Passagiere wurden umgebucht.', uz: 'Kechikib kelgan yo\'lovchilar boshqa reysga o\'tkazildi.', tip: '= die Passagiere, die sich verspätet haben' }
                        ]
                    },
                    {
                        heading: '3. Erweiterte Partizipialattribute (Kengaytirilgan oborotlar)',
                        content: '<p>Ilmiy va rasmiy nemis tilida artikl va ot o\'rtasiga butun bir ibora joylashtiriladi:</p>' +
                            '<p style="font-family: monospace; background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px;">' +
                            'Artikl + [ KENGAYTIRILGAN TO\'LDIRUVCHILAR + Sifatdosh ] + Ot' +
                            '</p>' +
                            '<p>Bunday murakkab konstruksiyalarni tushunish va tarjima qilish usuli:</p>' +
                            '<ol>' +
                            '<li>Avval asosiy <strong>Artikl va Otni</strong> toping (masalan: <em>Die ... Forscher</em>).</li>' +
                            '<li>Otning oldidagi <strong>Sifatdoshni</strong> toping (<em>... arbeitenden ...</em>).</li>' +
                            '<li>Ular orasidagi ma\'lumotni o\'zbek tiliga sifatdosh bilan bog\'lab o\'qing: <em>Die [seit vielen Jahren an diesem Projekt] arbeitenden Forscher...</em> (= Ushbu loyiha ustida ko\'p yillardan beri ishlayotgan tadqiqotchilar...).</li>' +
                            '</ol>',
                        examples: [
                            { de: 'Die [von den Wissenschaftlern sorgfältig durchgeführten] Untersuchungen brachten neue Erkenntnisse.', uz: 'Olimlar tomonidan sinchkovlik bilan o\'tkazilgan tekshiruvlar yangi xulosalarni olib keldi.', tip: 'Partizip II oboroti' },
                            { de: 'Das [für alle Beteiligten überraschend gekommene] Ergebnis schockierte die Experten.', uz: 'Barcha ishtirokchilar uchun kutilmaganda kelgan natija mutaxassislarni hayratda qoldirdi.', tip: 'Kengaytirilgan struktura' },
                            { de: 'Die [im vergangenen Jahr drastisch gesunkenen] Exportzahlen erholen sich langsam.', uz: 'O\'tgan yili keskin tushib ketgan eksport ko\'rsatkichlari asta-sekin tiklanmoqda.', tip: 'Partizip II als Adjektiv' }
                        ]
                    }
                ],
                keyRules: [
                    'Partizip I (Infinitiv + d) doimo davom etayotgan aktiv harakatni anglatadi (lachend, brennend).',
                    'zu + Partizip I (Gerundivum) faqat passiv ma\'noda "bajarilishi shart yoki mumkin bo\'lgan" narsani ifodalaydi.',
                    'Partizip II o\'timli fe\'llarda har doim passiv ma\'noni (das geschriebene Buch = yozilgan kitob) beradi.',
                    'Kengaytirilgan sifatdosh guruhini oson tushunish uchun avval eng chetdagi artikl va otni, so\'ngra sifatdoshni ajratib oling.'
                ]
            },
            flashcards: [
                { front: 'das Partizip I', back: 'hozirgi zamon sifatdoshi (Infinitiv + d)', tip: 'das lesende Kind' },
                { front: 'das Partizip II', back: 'o\'tgan zamon / majhul sifatdoshi', tip: 'das gelesene Buch' },
                { front: 'das Gerundivum', back: 'zu + Partizip I (majburiyat sifatdoshi)', tip: 'die zu lösende Aufgabe' },
                { front: 'steigend', back: 'o\'sib borayotgan, ko\'tarilayotgan', tip: 'die steigenden Preise' },
                { front: 'sinkend', back: 'kamayib borayotgan, pasayayotgan', tip: 'die sinkenden Zahlen' },
                { front: 'anwesend', back: 'hozir bo\'lgan, ishtirok etayotgan', tip: 'die anwesenden Gäste' },
                { front: 'abwesend', back: 'kelmagan, yo\'q bo\'lgan', tip: 'der abwesende Schüler' },
                { front: 'überwältigend', back: 'nihoyatda ulkan, hayratlanarli', tip: 'ein überwältigender Erfolg' },
                { front: 'zutreffend', back: 'to\'g\'ri, mos keluvchi', tip: 'eine zutreffende Antwort' },
                { front: 'entscheidend', back: 'hal qiluvchi, asosiy', tip: 'ein entscheidender Moment' },
                { front: 'beunruhigend', back: 'xavotirga soluvchi, bezovta qiluvchi', tip: 'eine beunruhigende Nachricht' },
                { front: 'überraschend', back: 'kutilmagan, hayratomuz', tip: 'ein überraschendes Ende' },
                { front: 'vergangen', back: 'o\'tgan, ortda qolgan', tip: 'im vergangenen Jahr' },
                { front: 'beschädigt', back: 'shikastlangan, zararlangan', tip: 'die beschädigte Ware' },
                { front: 'überarbeitet', back: 'qayta ko\'rib chiqilgan / haddan tashqari toliqqan', tip: 'eine überarbeitete Fassung' }
            ],
            test: [
                {
                    q: '"Das weinende Kind suchte seine Mutter." gapidagi "weinende" so\'zi qaysi grammatik shaklda?',
                    options: [
                        'Partizip I (hozirgi zamon sifatdoshi)',
                        'Partizip II (o\'tgan zamon sifatdoshi)',
                        'Gerundivum',
                        'Infinitiv mit zu'
                    ],
                    answer: 0,
                    explanation: 'weinen + d + e = Partizip I (yig\'layotgan bola).'
                },
                {
                    q: '"Die zu lösende Aufgabe ist sehr komplex." Ushbu gap nimani anglatadi?',
                    options: [
                        'Yechilgan vazifa juda murakkab edi.',
                        'Yechilishi kerak bo\'lgan vazifa juda murakkab.',
                        'Vazifani hech kim yecha olmaydi.',
                        'Vazifa o\'z-o\'zidan yechildi.'
                    ],
                    answer: 1,
                    explanation: '"zu + Partizip I" (Gerundivum) majburiyatni bildiradi: die Aufgabe, die gelöst werden muss.'
                },
                {
                    q: 'Qaysi birikma "die gestern eingetroffenen Waren" ga ma\'nodosh hisoblanadi?',
                    options: [
                        'die Waren, die gestern eintreffen',
                        'die Waren, die gestern eingetroffen sind',
                        'die Waren, die gestern eintreffen werden',
                        'die Waren, die gestern eintreffen müssen'
                    ],
                    answer: 1,
                    explanation: 'Partizip II (eingetroffen) o\'tgan zamondagi tugallangan harakatni bildiradi: die eingetroffen sind.'
                },
                {
                    q: 'Bo\'sh o\'rinni to\'ldiring: "Die Zahl der im Ausland ______ Studenten steigt kontinuierlich."',
                    options: ['studierende', 'studierenden', 'studiert', 'gestudiert'],
                    answer: 1,
                    explanation: '"der ... Studenten" (Genitiv ko\'plik). Partizip I kuchsiz turlanishda Genitivda "-en" oladi: studierenden.'
                },
                {
                    q: '"die geschlossene Tür" nimani anglatadi?',
                    options: ['yopilayotgan eshik', 'yopilgan eshik', 'yopilishi kerak bo\'lgan eshik', 'ochiq eshik'],
                    answer: 1,
                    explanation: 'Partizip II (geschlossen) passiv tugallangan sifat: yopilgan eshik.'
                },
                {
                    q: '"ein schlafender Hund" birikmasi qanday tarjima qilinadi?',
                    options: ['uxlagan it (o\'tmishda)', 'uxlayotgan it (hozirgi jarayon)', 'uxlashi kerak bo\'lgan it', 'uyg\'oq it'],
                    answer: 1,
                    explanation: 'Partizip I (schlafend) ayni damdagi jarayonni bildiradi: uxlayotgan it.'
                },
                {
                    q: 'Quyidagi gapdagi kengaytirilgan sifatdosh guruhini toping: "Die vom Chef gestern unterschriebenen Verträge liegen auf dem Tisch."',
                    options: [
                        'liegen auf dem Tisch',
                        'Die vom Chef gestern unterschriebenen',
                        'Verträge liegen',
                        'vom Chef'
                    ],
                    answer: 1,
                    explanation: 'Artikl (Die) bilan ot (Verträge) orasidagi barcha qism kengaytirilgan sifatdosh guruhidir: vom Chef gestern unterschriebenen.'
                },
                {
                    q: '"zutreffend" so\'zining ma\'nosi qaysi?',
                    options: ['xato', 'to\'g\'ri, haqiqatga mos', 'tez o\'tuvchi', 'kechiktirilgan'],
                    answer: 1,
                    explanation: 'zutreffend = to\'g\'ri, mos keluvchi, o\'rinli.'
                },
                {
                    q: 'Gerundivum qaysi holatda yasaladi?',
                    options: [
                        'zu + Infinitiv',
                        'zu + Partizip I + Adjektivendung',
                        'haben + Partizip II',
                        'sein + Partizip II'
                    ],
                    answer: 1,
                    explanation: 'Gerundivum faqat "zu + Partizip I (Infinitiv + d) + sifat qo\'shimchasi" qolipi bilan yasaladi (masalan: das zu lesende Buch).'
                },
                {
                    q: '"Die rasant wachsende Wirtschaft des Landes zieht Investoren an." gapi qanday ma\'noga ega?',
                    options: [
                        'Mamlakatning tez sur\'atlarda o\'sayotgan iqtisodiyoti investorlarni jalb qilmoqda.',
                        'Mamlakat iqtisodiyoti inqirozga yuz tutmoqda.',
                        'Investorlar mamlakat iqtisodiyotini tark etmoqda.',
                        'Iqtisodiyot kelajakda o\'sishi kerak.'
                    ],
                    answer: 0,
                    explanation: 'wachsend (o\'sayotgan) + rasant (shiddat bilan) = shiddat bilan o\'sib borayotgan.'
                }
            ],
            gamePairs: [
                { de: 'steigend', uz: 'o\'sib borayotgan' },
                { de: 'sinkend', uz: 'kamayib borayotgan' },
                { de: 'das zu lösende Problem', uz: 'yechilishi shart bo\'lgan muammo' },
                { de: 'die renovierte Wohnung', uz: 'ta\'mirlangan kvartira' },
                { de: 'der schlafende Junge', uz: 'uxlayotgan bola' },
                { de: 'zutreffend', uz: 'haqiqatga mos, to\'g\'ri' },
                { de: 'entscheidend', uz: 'hal qiluvchi' },
                { de: 'beschädigt', uz: 'zararlangan, singan' }
            ]
        },

        // ========================================================
        // 6-MAVZU: Murakkab ergash gaplar va Subjunktivlar (Komplexe Nebensätze)
        // ========================================================
        {
            id: 'b2_6',
            number: 6,
            title: 'Murakkab ergash gaplar va Subjunktivlar',
            germanTitle: 'Komplexe Nebensätze (indem, sodass, ohne dass, anstatt dass, vorausgesetzt dass)',
            icon: '🧩',
            description: 'Usul-vosita, oqibat, shart va istisno bildiruvchi B2 bog\'lovchilari: indem, sodass, ohne dass, anstatt dass, vorausgesetzt dass, es sei denn.',
            theory: {
                summary: 'B2 darajasida gaplar orasidagi mantiqiy va sababiy munosabatlarni aniq ifodalash uchun maxsus ergash gap bog\'lovchilari (Subjunktionen) qo\'llaniladi. Ular harakatning qanday vosita orqali amalga oshishini (indem), salbiy holatni (ohne dass), yuzaga kelgan oqibatni (sodass) yoki istisnoni (es sei denn) aniq belgilab beradi.',
                sections: [
                    {
                        heading: '1. Vosita va usul-tarz: indem va dadurch, dass',
                        content: '<p><strong>indem</strong> va <strong>dadurch, dass</strong> harakatning qanday yo\'l, vosita yoki usul orqali yuz berayotganini tushuntiradi. Ular <em>"Wie?"</em> (Qanday?) yoki <em>"Wodurch?"</em> (Nima orqali?) so\'roqlariga javob beradi:</p>' +
                            '<p>O\'zbek tiliga ko\'pincha <strong>"-ib / -ish orqali / -ish yo\'li bilan"</strong> deb tarjima qilinadi. Fe\'l ergash gap qoidasiga binoan oxirida keladi:</p>' +
                            '<p><em>Man lernt eine Sprache am besten, indem man sie täglich spricht.</em> (= Tilni har kuni gapirish orqali eng yaxshi o\'rganiladi).</p>',
                        examples: [
                            { de: 'Man kann Energie sparen, indem man die Heizung etwas herunterdreht.', uz: 'Isitish haroratini biroz pasaytirish orqali energiyani tejash mumkin.', tip: 'indem = ... orqali' },
                            { de: 'Er überzeugte das Publikum dadurch, dass er klare Fakten nannte.', uz: 'U aniq faktlarni keltirish yo\'li bilan tinglovchilarni ishontirdi.', tip: 'dadurch, dass' },
                            { de: 'Indem wir zusammenarbeiten, erreichen wir das Ziel schneller.', uz: 'Birgalikda ishlash orqali biz maqsadga tezroq erishamiz.', tip: 'Gap boshida kelishi' }
                        ]
                    },
                    {
                        heading: '2. Inkor va alternativa: ohne dass / ohne... zu va anstatt dass / anstatt... zu',
                        content: '<p>Salbiy fon yoki kutilgan ishning o\'rniga boshqa ish qilinganini ifodalaydi:</p>' +
                            '<ul>' +
                            '<li><strong>Egalari bir xil bo\'lsa:</strong> Infinitiv tuzilma ishlatiladi: <strong>ohne ... zu + Infinitiv</strong> ("...masdan") yoki <strong>anstatt ... zu + Infinitiv</strong> ("...o\'rniga"):<br>' +
                            '<em>Er ging weg, ohne sich zu verabschieden.</em> (U xayrlashmasdan ketib qoldi).</li>' +
                            '<li><strong>Egalari har xil bo\'lsa:</strong> <strong>ohne dass</strong> yoki <strong>anstatt dass</strong> bilan to\'liq ergash gap tuziladi:<br>' +
                            '<em>Der Chef traf die Entscheidung, ohne dass die Mitarbeiter informiert wurden.</em> (Xodimlar xabardor qilinmasdan turib, boshliq qaror qabul qildi).</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Er unterschrieb das Dokument, ohne die Bedingungen genau gelesen zu haben.', uz: 'U shartlarni sinchiklab o\'qib chiqmasdan hujjatni imzoladi.', tip: 'ohne ... zu (bir xil ega)' },
                            { de: 'Die Eltern bezahlten die Miete, ohne dass ihr Sohn darum gebeten hatte.', uz: 'O\'g\'illari so\'ramagan bo\'lsa ham, ota-ona ijara haqini to\'lab berishdi.', tip: 'ohne dass (har xil ega)' },
                            { de: 'Anstatt sich auf die Prüfung vorzubereiten, schaute er Serien.', uz: 'Imtihonga tayyorlanish o\'rniga, u seriallar tomosha qildi.', tip: 'anstatt ... zu' }
                        ]
                    },
                    {
                        heading: '3. Oqibat va istisno: sodass, vorausgesetzt dass, es sei denn',
                        content: '<p>Harakat natijasi, qat\'iy shart va yagona istisno:</p>' +
                            '<ul>' +
                            '<li><strong>sodass</strong> (natijada, shu sababli): Bosh gapdagi harakatning oqibatini ko\'rsatadi: <em>Es schneite stark, sodass die Straßen gesperrt wurden.</em></li>' +
                            '<li><strong>vorausgesetzt, dass</strong> (...sharti bilan): Qat\'iy shart bildiradi: <em>Ich helfe dir, vorausgesetzt, dass du pünktlik bist.</em></li>' +
                            '<li><strong>es sei denn</strong> (faqat ... bo\'lmasa / bundan mustasno): Istisno ifodasi. <em>DIQQAT:</em> Undan keyin odatda bosh gap so\'z tartibi (Subjekt + Verb) saqlanadi: <em>Wir gehen spazieren, es sei denn, es regnet in Strömen.</em></li>' +
                            '</ul>',
                        examples: [
                            { de: 'Der Zug hatte erhebliche Verspätung, sodass ich meinen Anschluss verpasste.', uz: 'Poyezd jiddiy kechikdi, oqibatda men transfer reysimga ulgurmay qoldim.', tip: 'sodass = natijada' },
                            { de: 'Wir unterschreiben den Vertrag, vorausgesetzt, dass alle Fristen eingehalten werden.', uz: 'Barcha muddatlarga rioya qilinishi sharti bilan biz shartnomani imzolaymiz.', tip: 'vorausgesetzt, dass = agar ... sharti bilan' },
                            { de: 'Ich nehme die Stelle an, es sei denn, das Gehalt reicht nicht zum Leben.', uz: 'Men ishni qabul qilaman, faqat maosh yashashga yetmaydigan bo\'lsa bundan mustasno.', tip: 'es sei denn (to\'g\'ri so\'z tartibi)' }
                        ]
                    }
                ],
                keyRules: [
                    'indem harakatning vositasi yoki usulini ifodalaydi va har doim Nebensatz (fe\'l oxirida) talab qiladi.',
                    'ohne dass va anstatt dass turli egalar bilan, ohne... zu va anstatt... zu esa bir xil egalar bilan qo\'llanadi.',
                    'es sei denn bog\'lovchisidan keyin to\'g\'ri so\'z tartibi (ega + fe\'l) saqlanadi va u "faqat ... bo\'lmasa" ma\'nosini beradi.',
                    'sodass (birga yozilganda) natijani ko\'rsatadi; so ..., dass (ajratib yozilganda) esa sifat darajasini kuchaytiradi.'
                ]
            },
            flashcards: [
                { front: 'indem', back: '...ish orqali, ...ib (vosita / usul)', tip: 'Indem man viel liest...' },
                { front: 'dadurch, dass', back: '...tufayli, ...ish orqali', tip: 'fe\'l oxirida' },
                { front: 'ohne dass', back: '...masdan turib (har xil ega)', tip: 'ohne dass er es merkte' },
                { front: 'ohne ... zu', back: '...masdan (bir xil ega)', tip: 'ohne ein Wort zu sagen' },
                { front: 'anstatt dass', back: '...o\'rniga (har xil ega)', tip: 'anstatt dass sie halfen' },
                { front: 'anstatt ... zu', back: '...o\'rniga (bir xil ega)', tip: 'anstatt zu schlafen' },
                { front: 'sodass', back: 'natijada, oqibatda, shunday qilib', tip: 'konsekutiv bog\'lovchi' },
                { front: 'vorausgesetzt, dass', back: '...sharti bilan, basharti', tip: 'konditsional bog\'lovchi' },
                { front: 'es sei denn', back: 'faqat ... bo\'lmasa, bundan mustasno', tip: 'to\'g\'ri so\'z tartibi' },
                { front: 'angenommen, dass', back: 'faraz qilaylik, agar...', tip: 'Angenommen, du gewinnst' },
                { front: 'außer wenn', back: 'faqat ... bo\'lmasa', tip: '= es sei denn, dass' },
                { front: 'sofern', back: 'modomiki, agar ... ekan', tip: 'Sofern nichts dazwischenkommt' },
                { front: 'soweit', back: 'qanchalik, bilishimcha', tip: 'Soweit ich weiß' },
                { front: 'inwiefern', back: 'qay darajada, qanchalik', tip: 'Inwiefern stimmt das?' },
                { front: 'je nachdem, ob', back: '...ga qarab (shart)', tip: 'Je nachdem, ob es klappt' }
            ],
            test: [
                {
                    q: 'Qaysi holatda "ohne ... zu" o\'rniga "ohne dass" ishlatilishi shart?',
                    options: [
                        'Bosh gap va ergash gapning egalari har xil bo\'lganda.',
                        'Gap o\'tgan zamonda bo\'lganda.',
                        'Gapda modal fe\'l ishtirok etganda.',
                        'Bosh gap inkor shaklida bo\'lganda.'
                    ],
                    answer: 0,
                    explanation: 'Bosh va ergash gapning subyektlari (egalari) boshqa-boshqa bo\'lsa, infinitivli "ohne... zu" emas, to\'liq gap "ohne dass" ishlatiladi.'
                },
                {
                    q: 'Bo\'sh o\'rinni to\'ldiring: "Man erweitert seinen Wortschatz, ______ man regelmäßig Vokabeln wiederholt."',
                    options: ['indem', 'sodass', 'ohne dass', 'anstatt'],
                    answer: 0,
                    explanation: '"indem" harakat qanday vosita/usul bilan amalga oshishini bildiradi (muntazam takrorlash orqali).'
                },
                {
                    q: '"Er verließ das Büro, ______ er den Computer ausgeschaltet hatte."',
                    options: ['ohne dass', 'ohne zu', 'anstatt zu', 'indem'],
                    answer: 0,
                    explanation: 'Egalari bir xil bo\'lsa ham, agar to\'liq ergash gap tuzilsa va tuslangan fe\'l bo\'lsa, "ohne dass" qo\'yiladi (agar "ohne den Computer auszuschalten" bo\'lsa "ohne zu" bo\'lardi).'
                },
                {
                    q: '"Wir treffen uns morgen um 18 Uhr, ______ es kommt dir etwas Wichtiges dazwischen."',
                    options: ['es sei denn,', 'sodass', 'indem', 'vorausgesetzt dass'],
                    answer: 0,
                    explanation: '"es sei denn" to\'g\'ri so\'z tartibini oladi va "faqat biror muhim ish chiqib qolmasa" degan istisnoni bildiradi.'
                },
                {
                    q: '"Die Nachfrage war enorm hoch, ______ das Produkt innerhalb weniger Stunden ausverkauft war."',
                    options: ['sodass', 'indem', 'anstatt dass', 'ohne dass'],
                    answer: 0,
                    explanation: '"sodass" oqibatni (Konsekutivsatz) ifodalaydi: talab juda yuqori bo\'ldi, natijada bir necha soatda sotilib ketdi.'
                },
                {
                    q: '"Anstatt die Wahrheit zu sagen, ______ er eine Ausrede."',
                    options: ['erfand', 'erfinden', 'hat erfunden', 'erfindet dass'],
                    answer: 0,
                    explanation: 'Bosh gap boshlanmoqda: Infinitiv guruhidan keyin darhol tuslangan fe\'l (erfand) keladi.'
                },
                {
                    q: '"vorausgesetzt, dass" bog\'lovchisining ma\'nosi qaysi?',
                    options: [
                        '...sharti bilan / basharti',
                        '...o\'rniga',
                        '...ga qaramasdan',
                        '...shuning uchun'
                    ],
                    answer: 0,
                    explanation: '"vorausgesetzt, dass" qat\'iy shart maylini bildiradi (bedingend).'
                },
                {
                    q: '"Soweit ich mich erinnern kann, war das Treffen am Montag." Ushbu gapdagi "soweit" qanday ma\'noda?',
                    options: [
                        'Eslay olishim bo\'yicha / xotiram aldamasa',
                        'Uzoq masofada',
                        'Hech qachon eslay olmayman',
                        'Uchrashuv bekor bo\'ldi'
                    ],
                    answer: 0,
                    explanation: '"soweit ich weiß / mich erinnern kann" = bilishimcha, xotirlashim bo\'yicha.'
                },
                {
                    q: 'Qaysi bog\'lovchidan keyin odatda fe\'l oxiriga surilmaydi (to\'g\'ri so\'z tartibi qoladi)?',
                    options: ['es sei denn', 'indem', 'sodass', 'ohne dass'],
                    answer: 0,
                    explanation: '"es sei denn" dan keyin odatda to\'g\'ri gap so\'z tartibi (bosh gap tartibi) qo\'llanadi.'
                },
                {
                    q: '"Er ging im strömenden Regen spazieren, ohne einen Regenschirm mitgenommen zu haben." gapi qanday tarjima qilinadi?',
                    options: [
                        'U soyabon olib, yomg\'irda sayr qildi.',
                        'U o\'zi bilan soyabon olmasdan, shiddatli yomg\'ir ostida sayrga chiqdi.',
                        'Soyaboni yo\'qligi sababli u uyda qoldi.',
                        'U yangi soyabon sotib olmoqchi bo\'ldi.'
                    ],
                    answer: 1,
                    explanation: '"ohne ... mitgenommen zu haben" = o\'zi bilan olmasdan turib.'
                }
            ],
            gamePairs: [
                { de: 'indem', uz: '...ish orqali, ...ib' },
                { de: 'ohne dass', uz: '...masdan turib (har xil ega)' },
                { de: 'ohne ... zu', uz: '...masdan (bir xil ega)' },
                { de: 'anstatt dass', uz: '...o\'rniga (har xil ega)' },
                { de: 'anstatt ... zu', uz: '...o\'rniga (bir xil ega)' },
                { de: 'sodass', uz: 'natijada, oqibatda' },
                { de: 'vorausgesetzt, dass', uz: '...sharti bilan' },
                { de: 'es sei denn', uz: 'faqat ... bo\'lmasa' }
            ]
        },

        // ========================================================
        // 7-MAVZU: Rasmiy muzokara, munozara va Taqdimot vositalari
        // ========================================================
        {
            id: 'b2_7',
            number: 7,
            title: 'Rasmiy muzokara, munozara va Taqdimot vositalari',
            germanTitle: 'Redemittel für Diskussion, Argumentation und Präsentation',
            icon: '🎙️',
            description: 'Goethe va telc B2 imtihonlari uchun professional nutq qoliplari: ilmiy taqdimot, dalillarni asoslash, muloyim e\'tiroz bildirish va murosaga kelish san\'ati.',
            theory: {
                summary: 'B2 darajasi bo\'yicha sertifikat imtihonlarida (Goethe-Zertifikat B2, telc B2, TestDaF) muvaffaqiyat qozonish uchun shunchaki so\'zlashuv tili yetarli emas. Talabadan ilmiy va rasmiy uslubdagi nutqiy qoliplardan (Redemittel) mohirona foydalana olish, taqdimotni aniq tuzilish asosida olib borish va professional bahs-munozara olib borish talab qilinadi.',
                sections: [
                    {
                        heading: '1. Taqdimot (Präsentation) tuzilishi va boshqaruvi',
                        content: '<p>Taqdimot to\'rt asosiy bosqichdan iborat bo\'ladi:</p>' +
                            '<ul>' +
                            '<li><strong>Mavzuni kiritish (Einleitung):</strong><br>' +
                            '<em>Das Thema meiner heutigen Präsentation lautet...</em> (Bugungi taqdimotimning mavzusi...).<br>' +
                            '<em>Ich möchte Ihnen heute ein hochaktuelles Thema vorstellen.</em></li>' +
                            '<li><strong>Taqdimot rejasi (Gliederung):</strong><br>' +
                            '<em>Mein Vortrag gliedert sich in folgende Abschnitte...</em> (Ma\'ruzam quyidagi qismlardan iborat...).<br>' +
                            '<em>Zuerst spreche ich über..., danach gehe ich auf... ein.</em></li>' +
                            '<li><strong>Qismdan-qismga o\'tish (Überleitung):</strong><br>' +
                            '<em>Nun möchte ich mich dem nächsten Punkt zuwenden.</em> (Endi navbatdagi bandga o\'tsam).<br>' +
                            '<em>Ein weiterer wesentlicher Aspekt ist...</em></li>' +
                            '<li><strong>Xulosa va minnatdorchilik (Abschluss):</strong><br>' +
                            '<em>Zusammenfassend lässt sich sagen, dass...</em> (Xulosa qilib aytganda...).<br>' +
                            '<em>Ich bedanke mich ganz herzlich für Ihre Aufmerksamkeit.</em></li>' +
                            '</ul>',
                        examples: [
                            { de: 'Das Thema meiner heutigen Präsentation lautet: "Digitalisierung im Bildungswesen".', uz: 'Bugungi taqdimotimning mavzusi: "Ta\'lim tizimida raqamlashtirish".', tip: 'Mavzuni ochib berish' },
                            { de: 'Nachdem ich die Vor- und Nachteile beleuchtet habe, komme ich nun zum Fazit.', uz: 'Ijobiy va salbiy tomonlarni ko\'rib chiqqanimdan so\'ng, endi xulosaga kelaman.', tip: 'Bosqichlar o\'rtasida o\'tish' },
                            { de: 'Ich stehe Ihnen nun gern für Fragen zur Verfügung.', uz: 'Endi sizning savollaringizga mamnuniyat bilan javob berishga tayyorman.', tip: 'Taqdimot yakuni' }
                        ]
                    },
                    {
                        heading: '2. Fikr bildirish va dalillash (Meinung äußern & Argumentieren)',
                        content: '<p>Shaxsiy qarashni professional darajada bayon etish:</p>' +
                            '<ul>' +
                            '<li><em>Meiner Auffassung / Ansicht nach...</em> (Mening fikrimcha... + fe\'l darhol keladi).</li>' +
                            '<li><em>Ich stehe auf dem Standpunkt, dass...</em> (Men shunday pozitsiyadaman-ki...).</li>' +
                            '<li><em>Ich bin der festen Überzeugung, dass...</em> (Men qat\'iy ishonamanki...).</li>' +
                            '<li><em>Ein entscheidender Vorteil / Nachteil besteht darin, dass...</em> (Hal qiluvchi afzallik / kamchilik shundan iboratki...).</li>' +
                            '<li><em>Man darf keineswegs außer Acht lassen, dass...</em> (Hech qachon nazardan chetda qoldirib bo\'lmaydiki...).</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Meiner Ansicht nach sollten die erneuerbaren Energien staatlich subventioniert werden.', uz: 'Mening fikrimcha, qayta tiklanuvchi energiya davlat tomonidan moliyalashtirilishi lozim.', tip: 'Meiner Ansicht nach + Verb' },
                            { de: 'Ein wesentlicher Vorteil dieses Modells liegt in der hohen Flexibilität.', uz: 'Ushbu modelning muhim ustunligi uning yuqori moslashuvchanligidadir.', tip: 'Ustunlikni ta\'kidlash' },
                            { de: 'Ich halte diese Maßnahme für absolut unzureichend.', uz: 'Men bu chorani mutlaqo yetarli emas deb hisoblayman.', tip: 'etwas halten für + Akk.' }
                        ]
                    },
                    {
                        heading: '3. E\'tiroz bildirish va murosaga kelish (Widerspruch & Kompromiss)',
                        content: '<p>Munozarada madaniyatli va diplomatik tarzda e\'tiroz bildirish:</p>' +
                            '<ul>' +
                            '<li><strong>Muloyim e\'tiroz:</strong><br>' +
                            '<em>Da bin ich ganz anderer Meinung.</em> (Bu borada men mutlaqo boshqacha fikrdaman).<br>' +
                            '<em>Das überzeugt mich nicht ganz, denn...</em> (Bu meni to\'liq qanoatlantirmaydi, chunki...).<br>' +
                            '<em>Dem kann ich nur teilweise zustimmen.</em> (Bunga faqat qisman qo\'shila olaman).</li>' +
                            '<li><strong>Murosaga kelish (Einigung / Kompromiss):</strong><br>' +
                            '<em>Wir könnten uns darauf einigen, dass...</em> (Biz ... degan kelishuvga kelishimiz mumkin).<br>' +
                            '<em>Wie wäre es, wenn wir einen Mittelweg wählen?</em> (Oltin o\'rtaliqni tanlasak nima deysiz?).</li>' +
                            '</ul>',
                        examples: [
                            { de: 'Da muss ich Ihnen leider widersprechen; die Daten belegen das Gegenteil.', uz: 'Bu masalada sizga afsuski e\'tiroz bildirishimga to\'g\'ri keladi; raqamlar buning aksini ko\'rsatmoqda.', tip: 'widersprechen + Dativ' },
                            { de: 'Einerseits stimme ich Ihnen zu, andererseits müssen wir die Kosten bedenken.', uz: 'Bir tomondan sizga qo\'shilaman, ikkinchi tomondan xarajatlarni ham o\'ylashimiz shart.', tip: 'Qisman qo\'shilish' },
                            { de: 'Lassen Sie uns einen Kompromiss finden, der für beide Seiten akzeptabel ist.', uz: 'Keling, har ikki tomon uchun ham maqbul bo\'lgan murosani topaylik.', tip: 'Kompromiss finden' }
                        ]
                    }
                ],
                keyRules: [
                    '"Meiner Meinung / Ansicht / Auffassung nach" iborasidan keyin darhol tuslangan fe\'l (Inversion) keladi.',
                    'Rasmiy munozaralarda "Das ist falsch!" deb qo\'pol rad etish o\'rniga "Da bin ich anderer Ansicht" yoki "Dem kann ich nicht ganz zustimmen" kabi diplomatik iboralar qo\'llaniladi.',
                    'Taqdimotda har bir qism yakunida navbatdagi bosqichga o\'tish vositalaridan (Überleitungen) foydalanish nutqning mantiqiy yaxlitligini ta\'minlaydi.',
                    '"widersprechen" fe\'li doimo Dativ kelishigini talab qiladi: Ich widerspreche Ihnen (Ihnen = Dativ).'
                ]
            },
            flashcards: [
                { front: 'Das Thema lautet...', back: 'Mavzu ...dan iborat / Mavzu shunday nomlanadi', tip: 'Taqdimot boshlanishi' },
                { front: 'sich gliedern in (+ Akk.)', back: '...qismlarga bo\'linmoq', tip: 'Mein Vortrag gliedert sich in...' },
                { front: 'sich zuwenden (+ Dat.)', back: '...ga yuzlanmoq / o\'tmoq', tip: 'Ich wende mich dem Thema zu' },
                { front: 'zusammenfassend', back: 'xulosa qilib aytganda', tip: 'Zusammenfassend lässt sich sagen' },
                { front: 'Meiner Auffassung nach', back: 'Mening nuqtai nazarimga ko\'ra', tip: 'ketidan darhol fe\'l keladi' },
                { front: 'auf dem Standpunkt stehen', back: '...pozitsiyasida / fikrida turmoq', tip: 'Ich stehe auf dem Standpunkt' },
                { front: 'überzeugt sein von', back: '...ga qat\'iy ishongan bo\'lmoq', tip: 'Ich bin davon überzeugt' },
                { front: 'außer Acht lassen', back: 'nazardan chetda qoldirmoq', tip: 'Das darf man nicht außer Acht lassen' },
                { front: 'widersprechen (+ Dat.)', back: '...ga e\'tiroz bildirmoq, qarshi chiqmoq', tip: 'Da muss ich Ihnen widersprechen' },
                { front: 'zustimmen (+ Dat.)', back: '...ga qo\'shilmoq, ma\'qullamoq', tip: 'Ich stimme Ihnen völlig zu' },
                { front: 'einen Kompromiss schließen', back: 'murosa / kelishuvga erishmoq', tip: '= sich einigen' },
                { front: 'im Gegenteil', back: 'aksincha, aks holatda', tip: 'Ganz im Gegenteil!' },
                { front: 'in Bezug auf (+ Akk.)', back: '...ga nisbatan, ...xususida', tip: 'In Bezug auf dieses Problem' },
                { front: 'das Fazit', back: 'yakuniy xulosa', tip: 'Ein Fazit ziehen' },
                { front: 'Vielen Dank für Ihre Aufmerksamkeit', back: 'E\'tiboringiz uchun katta rahmat', tip: 'Taqdimot yakuniy iborasi' }
            ],
            test: [
                {
                    q: '"Meiner Meinung nach ______ diese Maßnahme nicht sinnvoll."',
                    options: ['ist', 'dass ist', 'es ist', 'sein'],
                    answer: 0,
                    explanation: '"Meiner Meinung nach" dan keyin darhol tuslangan fe\'l (Inversion: ist) keladi.'
                },
                {
                    q: 'Qaysi ibora taqdimotning yangi bandiga o\'tishda qo\'llaniladi?',
                    options: [
                        'Ich bedanke mich für Ihre Aufmerksamkeit.',
                        'Nun möchte ich mich dem nächsten Punkt zuwenden.',
                        'Das Thema lautet wie folgt.',
                        'Mein Vortrag ist hiermit beendet.'
                    ],
                    answer: 1,
                    explanation: '"sich dem nächsten Punkt zuwenden" navbatdagi mavzuga o\'tish (Überleitung) iborasidir.'
                },
                {
                    q: '"widersprechen" fe\'li qaysi kelishikni (Kasus) talab qiladi?',
                    options: ['Akkusativ', 'Dativ', 'Genitiv', 'Nominativ'],
                    answer: 1,
                    explanation: 'widersprechen fe\'li doimo Dativ talab qiladi: Ich widerspreche Ihnen / dir.'
                },
                {
                    q: 'Birovning fikriga muloyim tarzda e\'tiroz bildirish uchun qaysi ibora eng mos keladi?',
                    options: [
                        'Das ist totaler Unsinn!',
                        'Dem kann ich mich leider nicht ganz anschließen.',
                        'Sie haben überhaupt keine Ahnung.',
                        'Hören Sie sofort auf zu reden!'
                    ],
                    answer: 1,
                    explanation: '"Dem kann ich mich leider nicht ganz anschließen" akademik va muloyim e\'tiroz ifodasidir.'
                },
                {
                    q: '"außer Acht lassen" iborasining ma\'nosi qaysi?',
                    options: [
                        'Diqqat bilan o\'rganmoq',
                        'E\'tibordan chetda qoldirmoq / unutmoq',
                        'Sakkiz marta hisoblamoq',
                        'Qattiq qo\'riqlamoq'
                    ],
                    answer: 1,
                    explanation: 'etwas außer Acht lassen = biror narsani e\'tibordan chetda qoldirmoq (nicht berücksichtigen).'
                },
                {
                    q: '"Ich bin der festen Überzeugung, dass..." gapi nimani bildiradi?',
                    options: [
                        'Men mutlaqo shubhadaman.',
                        'Men qat\'iy ishonamanki...',
                        'Men hech narsani bilmayman.',
                        'Men bu taklifga qarshiman.'
                    ],
                    answer: 1,
                    explanation: 'der festen Überzeugung sein = qat\'iy ishonchda bo\'lmoq.'
                },
                {
                    q: 'Bo\'sh o\'rinni to\'ldiring: "Könnten wir uns auf folgenden Kompromiss ______?"',
                    options: ['einigen', 'treffen', 'schließen', 'legen'],
                    answer: 0,
                    explanation: '"sich einigen auf + Akkusativ" = biror kelishuvga rozi bo\'lmoq / kelishmoq.'
                },
                {
                    q: '"Zusammenfassend lässt sich sagen, dass..." iborasi taqdimotning qaysi qismida ishlatiladi?',
                    options: ['Boshida (Einleitung)', 'O\'rtasida (Hauptteil)', 'Xulosasida (Schluss / Fazit)', 'Savol-javobda'],
                    answer: 2,
                    explanation: '"zusammenfassend" (xulosa qilib aytganda) taqdimot yakunida qo\'llaniladi.'
                },
                {
                    q: '"Ein entscheidender Vorteil besteht darin, dass..." Ushbu qolip qanday ma\'no beradi?',
                    options: [
                        'Hal qiluvchi ustunlik shundaki...',
                        'Asosiy xavf shundaki...',
                        'Hech qanday foyda yo\'q...',
                        'Kamchiliklar juda ko\'p...'
                    ],
                    answer: 0,
                    explanation: 'der entscheidende Vorteil = hal qiluvchi, eng muhim ustunlik/afzallik.'
                },
                {
                    q: '"Mein Vortrag gliedert sich ______ drei Hauptteile."',
                    options: ['in', 'auf', 'an', 'zu'],
                    answer: 0,
                    explanation: '"sich gliedern in + Akkusativ" = qismlarga bo\'linmoq.'
                }
            ],
            gamePairs: [
                { de: 'Das Thema lautet...', uz: 'Mavzu quyidagicha...' },
                { de: 'Meiner Auffassung nach', uz: 'Mening qarashim bo\'yicha' },
                { de: 'außer Acht lassen', uz: 'e\'tibordan chetda qoldirmoq' },
                { de: 'widersprechen (+ Dat.)', uz: 'e\'tiroz bildirmoq' },
                { de: 'zustimmen (+ Dat.)', uz: 'fikrga qo\'shilmoq' },
                { de: 'sich einigen auf', uz: 'kelishuvga erishmoq' },
                { de: 'das Fazit ziehen', uz: 'yakuniy xulosa chiqarmoq' },
                { de: 'Vielen Dank für Ihre Aufmerksamkeit', uz: 'E\'tiboringiz uchun tashakkur' }
            ]
        }
    ]
};
