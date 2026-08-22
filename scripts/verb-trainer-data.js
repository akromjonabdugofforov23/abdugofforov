/**
 * Nemis Tili Fe'llar Trenajyori — Fe'llar Bazasi (Verbs Database)
 * A1, A2, B1 darajalari bo'yicha Präsens, Präteritum va Perfekt zamonlari
 */

const GERMAN_VERBS_DB = [
    {
        id: 'sein',
        infinitive: 'sein',
        translation: "bo'lmoq",
        level: 'A1',
        type: 'irregular', // irregular, regular, modal, auxiliary
        auxiliary: 'sein',
        example: "Ich bin Student. Er war gestern krank. Wir sind glücklich gewesen.",
        notes: "Eng muhim yordamchi va mustaqil fe'l. Butunlay tartibsiz turlanadi.",
        praesens: {
            ich: 'bin',
            du: 'bist',
            er_sie_es: 'ist',
            wir: 'sind',
            ihr: 'seid',
            sie_Sie: 'sind'
        },
        praeteritum: {
            ich: 'war',
            du: 'warst',
            er_sie_es: 'war',
            wir: 'waren',
            ihr: 'wart',
            sie_Sie: 'waren'
        },
        perfekt: {
            auxiliary: 'sein',
            partizip2: 'gewesen',
            full: 'ist gewesen'
        }
    },
    {
        id: 'haben',
        infinitive: 'haben',
        translation: "ega bo'lmoq, bor bo'lmoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Ich habe ein Buch. Du hattest keine Zeit. Er hat viel gearbeitet.",
        notes: "Asosiy yordamchi fe'l. Präsensda du/er shakllarida 'b' tushib qoladi.",
        praesens: {
            ich: 'habe',
            du: 'hast',
            er_sie_es: 'hat',
            wir: 'haben',
            ihr: 'habt',
            sie_Sie: 'haben'
        },
        praeteritum: {
            ich: 'hatte',
            du: 'hattest',
            er_sie_es: 'hatte',
            wir: 'hatten',
            ihr: 'hattet',
            sie_Sie: 'hatten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gehabt',
            full: 'hat gehabt'
        }
    },
    {
        id: 'werden',
        infinitive: 'werden',
        translation: "bo'lmoq, aylanmoq (kelasi zamon va passiv uchun)",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'sein',
        example: "Er wird Arzt. Es wurde dunkel. Wir sind müde geworden.",
        notes: "Kelasi zamon (Futur I) va Passiv hosil qilishda xizmat qiladi.",
        praesens: {
            ich: 'werde',
            du: 'wirst',
            er_sie_es: 'wird',
            wir: 'werden',
            ihr: 'werdet',
            sie_Sie: 'werden'
        },
        praeteritum: {
            ich: 'wurde',
            du: 'wurdest',
            er_sie_es: 'wurde',
            wir: 'wurden',
            ihr: 'wurdet',
            sie_Sie: 'wurden'
        },
        perfekt: {
            auxiliary: 'sein',
            partizip2: 'geworden',
            full: 'ist geworden'
        }
    },
    {
        id: 'gehen',
        infinitive: 'gehen',
        translation: "bormoq, piyoda yurmoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'sein',
        example: "Ich gehe nach Hause. Wir gingen in den Park. Sie ist schon gegangen.",
        notes: "Harakat fe'li bo'lgani uchun Perfekt zamonida 'sein' oladi.",
        praesens: {
            ich: 'gehe',
            du: 'gehst',
            er_sie_es: 'geht',
            wir: 'gehen',
            ihr: 'geht',
            sie_Sie: 'gehen'
        },
        praeteritum: {
            ich: 'ging',
            du: 'gingst',
            er_sie_es: 'ging',
            wir: 'gingen',
            ihr: 'gingt',
            sie_Sie: 'gingen'
        },
        perfekt: {
            auxiliary: 'sein',
            partizip2: 'gegangen',
            full: 'ist gegangen'
        }
    },
    {
        id: 'kommen',
        infinitive: 'kommen',
        translation: "kelmoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'sein',
        example: "Woher kommst du? Er kam gestern an. Sie ist aus Deutschland gekommen.",
        notes: "Harakat fe'li — Perfektda 'sein' bilan ishlatiladi.",
        praesens: {
            ich: 'komme',
            du: 'kommst',
            er_sie_es: 'kommt',
            wir: 'kommen',
            ihr: 'kommt',
            sie_Sie: 'kommen'
        },
        praeteritum: {
            ich: 'kam',
            du: 'kamst',
            er_sie_es: 'kam',
            wir: 'kamen',
            ihr: 'kamt',
            sie_Sie: 'kamen'
        },
        perfekt: {
            auxiliary: 'sein',
            partizip2: 'gekommen',
            full: 'ist gekommen'
        }
    },
    {
        id: 'sprechen',
        infinitive: 'sprechen',
        translation: "gapirmoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Sprichst du Deutsch? Sie sprach leise. Er hat mit dem Lehrer gesprochen.",
        notes: "Präsensda e -> i o'zgarishi bor (du sprichst, er spricht).",
        praesens: {
            ich: 'spreche',
            du: 'sprichst',
            er_sie_es: 'spricht',
            wir: 'sprechen',
            ihr: 'sprecht',
            sie_Sie: 'sprechen'
        },
        praeteritum: {
            ich: 'sprach',
            du: 'sprachst',
            er_sie_es: 'sprach',
            wir: 'sprachen',
            ihr: 'spracht',
            sie_Sie: 'sprachen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gesprochen',
            full: 'hat gesprochen'
        }
    },
    {
        id: 'sehen',
        infinitive: 'sehen',
        translation: "ko'rmoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Siehst du den Film? Ich sah einen Vogel. Hast du ihn gesehen?",
        notes: "Präsensda e -> ie o'zgarishi bor (du siehst, er sieht).",
        praesens: {
            ich: 'sehe',
            du: 'siehst',
            er_sie_es: 'sieht',
            wir: 'sehen',
            ihr: 'seht',
            sie_Sie: 'sehen'
        },
        praeteritum: {
            ich: 'sah',
            du: 'sahst',
            er_sie_es: 'sah',
            wir: 'sahen',
            ihr: 'saht',
            sie_Sie: 'sahen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gesehen',
            full: 'hat gesehen'
        }
    },
    {
        id: 'lesen',
        infinitive: 'lesen',
        translation: "o'qimoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Liest du gern Bücher? Sie las einen Artikel. Ich habe den Brief gelesen.",
        notes: "Präsensda e -> ie o'zgaradi va du shaklida 's' qo'shilmaydi (du liest).",
        praesens: {
            ich: 'lese',
            du: 'liest',
            er_sie_es: 'liest',
            wir: 'lesen',
            ihr: 'lest',
            sie_Sie: 'lesen'
        },
        praeteritum: {
            ich: 'las',
            du: 'lasest',
            er_sie_es: 'las',
            wir: 'lasen',
            ihr: 'last',
            sie_Sie: 'lasen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gelesen',
            full: 'hat gelesen'
        }
    },
    {
        id: 'schreiben',
        infinitive: 'schreiben',
        translation: "yozmoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Ich schreibe eine E-Mail. Er schrieb ein Buch. Sie hat mir geschrieben.",
        notes: "Vokal o'zgarishi: ei -> ie -> ie (schreiben, schrieb, geschrieben).",
        praesens: {
            ich: 'schreibe',
            du: 'schreibst',
            er_sie_es: 'schreibt',
            wir: 'schreiben',
            ihr: 'schreibt',
            sie_Sie: 'schreiben'
        },
        praeteritum: {
            ich: 'schrieb',
            du: 'schriebst',
            er_sie_es: 'schrieb',
            wir: 'schrieben',
            ihr: 'schriebt',
            sie_Sie: 'schrieben'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'geschrieben',
            full: 'hat geschrieben'
        }
    },
    {
        id: 'essen',
        infinitive: 'essen',
        translation: "yemoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Was isst du zum Frühstück? Wir aßen Pizza. Sie hat einen Apfel gegessen.",
        notes: "Präsensda e -> i (du isst, er isst). Perfekt: gegessen.",
        praesens: {
            ich: 'esse',
            du: 'isst',
            er_sie_es: 'isst',
            wir: 'essen',
            ihr: 'esst',
            sie_Sie: 'essen'
        },
        praeteritum: {
            ich: 'aß',
            du: 'aßest',
            er_sie_es: 'aß',
            wir: 'aßen',
            ihr: 'aßt',
            sie_Sie: 'aßen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gegessen',
            full: 'hat gegessen'
        }
    },
    {
        id: 'trinken',
        infinitive: 'trinken',
        translation: "ichmoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Ich trinke Tee. Er trank Kaffee. Wir haben Wasser getrunken.",
        notes: "Vokal o'zgarishi: i -> a -> u (trinken, trank, getrunken).",
        praesens: {
            ich: 'trinke',
            du: 'trinkst',
            er_sie_es: 'trinkt',
            wir: 'trinken',
            ihr: 'trinkt',
            sie_Sie: 'trinken'
        },
        praeteritum: {
            ich: 'trank',
            du: 'trankst',
            er_sie_es: 'trank',
            wir: 'tranken',
            ihr: 'trankt',
            sie_Sie: 'tranken'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'getrunken',
            full: 'hat getrunken'
        }
    },
    {
        id: 'fahren',
        infinitive: 'fahren',
        translation: "transportda bormoq, haydamoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'sein',
        example: "Fährst du mit dem Zug? Er fuhr nach Berlin. Sie sind nach Deutschland gefahren.",
        notes: "Präsensda a -> ä (du fährst, er fährt). Perfektda harakat uchun 'sein' oladi.",
        praesens: {
            ich: 'fahre',
            du: 'fährst',
            er_sie_es: 'fährt',
            wir: 'fahren',
            ihr: 'fahrt',
            sie_Sie: 'fahren'
        },
        praeteritum: {
            ich: 'fuhr',
            du: 'fuhrst',
            er_sie_es: 'fuhr',
            wir: 'fuhren',
            ihr: 'fuhrt',
            sie_Sie: 'fuhren'
        },
        perfekt: {
            auxiliary: 'sein',
            partizip2: 'gefahren',
            full: 'ist gefahren'
        }
    },
    {
        id: 'schlafen',
        infinitive: 'schlafen',
        translation: "uxlamoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Schläfst du gut? Er schlief 8 Stunden. Wir haben lange geschlafen.",
        notes: "Präsensda a -> ä (du schläfst, er schläft).",
        praesens: {
            ich: 'schlafe',
            du: 'schläfst',
            er_sie_es: 'schläft',
            wir: 'schlafen',
            ihr: 'schlaft',
            sie_Sie: 'schlafen'
        },
        praeteritum: {
            ich: 'schlief',
            du: 'schliefst',
            er_sie_es: 'schlief',
            wir: 'schliefen',
            ihr: 'schlieft',
            sie_Sie: 'schliefen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'geschlafen',
            full: 'hat geschlafen'
        }
    },
    {
        id: 'nehmen',
        infinitive: 'nehmen',
        translation: "olmoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Ich nehme den Bus. Er nahm die Tasche. Hast du die Medizin genommen?",
        notes: "Präsensda e -> i va 'h' o'rniga 'mm' keladi (du nimmst, er nimmt).",
        praesens: {
            ich: 'nehme',
            du: 'nimmst',
            er_sie_es: 'nimmt',
            wir: 'nehmen',
            ihr: 'nehmt',
            sie_Sie: 'nehmen'
        },
        praeteritum: {
            ich: 'nahm',
            du: 'nahmst',
            er_sie_es: 'nahm',
            wir: 'nahmen',
            ihr: 'nahmt',
            sie_Sie: 'nahmen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'genommen',
            full: 'hat genommen'
        }
    },
    {
        id: 'geben',
        infinitive: 'geben',
        translation: "bermoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Gibst du mir das Buch? Er gab mir die Hand. Es hat viel Regen gegeben.",
        notes: "Präsensda e -> i (du gibst, er gibt). 'Es gibt' — mavjud bo'lmoq.",
        praesens: {
            ich: 'gebe',
            du: 'gibst',
            er_sie_es: 'gibt',
            wir: 'geben',
            ihr: 'gebt',
            sie_Sie: 'geben'
        },
        praeteritum: {
            ich: 'gab',
            du: 'gabst',
            er_sie_es: 'gab',
            wir: 'gaben',
            ihr: 'gabt',
            sie_Sie: 'gaben'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gegeben',
            full: 'hat gegeben'
        }
    },
    {
        id: 'helfen',
        infinitive: 'helfen',
        translation: "yordam bermoq (+ Dativ)",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Kannst du mir helfen? Sie half ihren Eltern. Er hat mir sehr geholfen.",
        notes: "Dativ talab qiladi. Präsensda e -> i (du hilfst, er hilft).",
        praesens: {
            ich: 'helfe',
            du: 'hilfst',
            er_sie_es: 'hilft',
            wir: 'helfen',
            ihr: 'helft',
            sie_Sie: 'helfen'
        },
        praeteritum: {
            ich: 'half',
            du: 'halfst',
            er_sie_es: 'half',
            wir: 'halfen',
            ihr: 'halft',
            sie_Sie: 'halfen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'geholfen',
            full: 'hat geholfen'
        }
    },
    {
        id: 'bleiben',
        infinitive: 'bleiben',
        translation: "qolmoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'sein',
        example: "Ich bleibe zu Hause. Wir blieben dort. Er ist bis morgen geblieben.",
        notes: "Harakat bo'lmasa-da, holat saqlangani uchun Perfektda 'sein' oladi!",
        praesens: {
            ich: 'bleibe',
            du: 'bleibst',
            er_sie_es: 'bleibt',
            wir: 'bleiben',
            ihr: 'bleibt',
            sie_Sie: 'bleiben'
        },
        praeteritum: {
            ich: 'blieb',
            du: 'bliebst',
            er_sie_es: 'blieb',
            wir: 'blieben',
            ihr: 'bliebt',
            sie_Sie: 'blieben'
        },
        perfekt: {
            auxiliary: 'sein',
            partizip2: 'geblieben',
            full: 'ist geblieben'
        }
    },
    {
        id: 'finden',
        infinitive: 'finden',
        translation: "topmoq, deb hisoblamoq",
        level: 'A1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Ich finde den Schlüssel nicht. Er fand eine neue Stelle. Wie hast du das gefunden?",
        notes: "Präteritumda i -> a (fand), Perfektda gefunden.",
        praesens: {
            ich: 'finde',
            du: 'findest',
            er_sie_es: 'findet',
            wir: 'finden',
            ihr: 'findet',
            sie_Sie: 'finden'
        },
        praeteritum: {
            ich: 'fand',
            du: 'fandest',
            er_sie_es: 'fand',
            wir: 'fanden',
            ihr: 'fandet',
            sie_Sie: 'fanden'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gefunden',
            full: 'hat gefunden'
        }
    },
    {
        id: 'machen',
        infinitive: 'machen',
        translation: "qilmoq, bajarmoq",
        level: 'A1',
        type: 'regular',
        auxiliary: 'haben',
        example: "Was machst du heute? Er machte seine Hausaufgaben. Sie hat alles gut gemacht.",
        notes: "Muntazam (to'g'ri) fe'l. Oson turlanadi (-te, ge-...-t).",
        praesens: {
            ich: 'mache',
            du: 'machst',
            er_sie_es: 'macht',
            wir: 'machen',
            ihr: 'macht',
            sie_Sie: 'machen'
        },
        praeteritum: {
            ich: 'machte',
            du: 'machtest',
            er_sie_es: 'machte',
            wir: 'machten',
            ihr: 'machtet',
            sie_Sie: 'machten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gemacht',
            full: 'hat gemacht'
        }
    },
    {
        id: 'lernen',
        infinitive: 'lernen',
        translation: "o'rganmoq",
        level: 'A1',
        type: 'regular',
        auxiliary: 'haben',
        example: "Ich lerne Deutsch. Wir lernten fleißig. Er hat viel gelernt.",
        notes: "Muntazam fe'l: lernen - lernte - gelernt.",
        praesens: {
            ich: 'lerne',
            du: 'lernst',
            er_sie_es: 'lernt',
            wir: 'lernen',
            ihr: 'lernt',
            sie_Sie: 'lernen'
        },
        praeteritum: {
            ich: 'lernte',
            du: 'lerntest',
            er_sie_es: 'lernte',
            wir: 'lernten',
            ihr: 'lerntet',
            sie_Sie: 'lernten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gelernt',
            full: 'hat gelernt'
        }
    },
    {
        id: 'können',
        infinitive: 'können',
        translation: "qila olmoq, bilmoq (modal fe'l)",
        level: 'A1',
        type: 'modal',
        auxiliary: 'haben',
        example: "Ich kann Deutsch sprechen. Er konnte nicht kommen. Wir haben es gekonnt.",
        notes: "Modal fe'l: ich/er shakllarida qo'shimcha bo'lmaydi va umlaut tushadi (kann).",
        praesens: {
            ich: 'kann',
            du: 'kannst',
            er_sie_es: 'kann',
            wir: 'können',
            ihr: 'könnt',
            sie_Sie: 'können'
        },
        praeteritum: {
            ich: 'konnte',
            du: 'konntest',
            er_sie_es: 'konnte',
            wir: 'konnten',
            ihr: 'konntet',
            sie_Sie: 'konnten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gekonnt',
            full: 'hat gekonnt'
        }
    },
    {
        id: 'müssen',
        infinitive: 'müssen',
        translation: "majbur bo'lmoq, kerak (modal fe'l)",
        level: 'A1',
        type: 'modal',
        auxiliary: 'haben',
        example: "Ich muss jetzt gehen. Er musste viel lernen. Sie haben arbeiten müssen.",
        notes: "Präsens birlikda umlaut tushadi (muss). Präteritum: musste.",
        praesens: {
            ich: 'muss',
            du: 'musst',
            er_sie_es: 'muss',
            wir: 'müssen',
            ihr: 'müsst',
            sie_Sie: 'müssen'
        },
        praeteritum: {
            ich: 'musste',
            du: 'musstest',
            er_sie_es: 'musste',
            wir: 'mussten',
            ihr: 'musstet',
            sie_Sie: 'mussten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gemusst',
            full: 'hat gemusst'
        }
    },
    {
        id: 'wollen',
        infinitive: 'wollen',
        translation: "xohlamoq, istamoq (modal fe'l)",
        level: 'A1',
        type: 'modal',
        auxiliary: 'haben',
        example: "Ich will nach Deutschland reisen. Wir wollten dich besuchen.",
        notes: "Präsensda unli o'zgaradi (ich will, du willst, er will).",
        praesens: {
            ich: 'will',
            du: 'willst',
            er_sie_es: 'will',
            wir: 'wollen',
            ihr: 'wollt',
            sie_Sie: 'wollen'
        },
        praeteritum: {
            ich: 'wollte',
            du: 'wolltest',
            er_sie_es: 'wollte',
            wir: 'wollten',
            ihr: 'wolltet',
            sie_Sie: 'wollten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gewollt',
            full: 'hat gewollt'
        }
    },
    {
        id: 'wissen',
        infinitive: 'wissen',
        translation: "bilmoq (fakt yoki ma'lumotni)",
        level: 'A2',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Weißt du die Antwort? Ich wusste das nicht. Wir haben Bescheid gewusst.",
        notes: "Modal fe'llarga o'xshab turlanadi (ich weiß, du weißt, er weiß).",
        praesens: {
            ich: 'weiß',
            du: 'weißt',
            er_sie_es: 'weiß',
            wir: 'wissen',
            ihr: 'wisst',
            sie_Sie: 'wissen'
        },
        praeteritum: {
            ich: 'wusste',
            du: 'wusstest',
            er_sie_es: 'wusste',
            wir: 'wussten',
            ihr: 'wusstet',
            sie_Sie: 'wussten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gewusst',
            full: 'hat gewusst'
        }
    },
    {
        id: 'denken',
        infinitive: 'denken',
        translation: "o'ylamoq, fikrlamoq",
        level: 'A2',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Woran denkst du? Er dachte an seine Zukunft. Ich habe oft daran gedacht.",
        notes: "Aralash fe'l (Mischverb): dachte, gedacht.",
        praesens: {
            ich: 'denke',
            du: 'denkst',
            er_sie_es: 'denkt',
            wir: 'denken',
            ihr: 'denkt',
            sie_Sie: 'denken'
        },
        praeteritum: {
            ich: 'dachte',
            du: 'dachtest',
            er_sie_es: 'dachte',
            wir: 'dachten',
            ihr: 'dachtet',
            sie_Sie: 'dachten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gedacht',
            full: 'hat gedacht'
        }
    },
    {
        id: 'bring',
        infinitive: 'bringen',
        translation: "olib kelmoq, yetkazmoq",
        level: 'A2',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Bringst du mir ein Glas Wasser? Er brachte Geschenke mit. Sie hat das Geld gebracht.",
        notes: "Aralash fe'l: bringen -> brachte -> gebracht.",
        praesens: {
            ich: 'bringe',
            du: 'bringst',
            er_sie_es: 'bringt',
            wir: 'bringen',
            ihr: 'bringt',
            sie_Sie: 'bringen'
        },
        praeteritum: {
            ich: 'brachte',
            du: 'brachtest',
            er_sie_es: 'brachte',
            wir: 'brachten',
            ihr: 'brachtet',
            sie_Sie: 'brachten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gebracht',
            full: 'hat gebracht'
        }
    },
    {
        id: 'kennen',
        infinitive: 'kennen',
        translation: "tanimoq, bilmoq (inson yoki joyni)",
        level: 'A2',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Kennst du diesen Mann? Ich kannte ihn früher. Wir haben die Stadt gut gekannt.",
        notes: "Aralash fe'l: kennen -> kannte -> gekannt.",
        praesens: {
            ich: 'kenne',
            du: 'kennst',
            er_sie_es: 'kennt',
            wir: 'kennen',
            ihr: 'kennt',
            sie_Sie: 'kennen'
        },
        praeteritum: {
            ich: 'kannte',
            du: 'kanntest',
            er_sie_es: 'kannte',
            wir: 'kannten',
            ihr: 'kanntet',
            sie_Sie: 'kannten'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gekannt',
            full: 'hat gekannt'
        }
    },
    {
        id: 'treffen',
        infinitive: 'treffen',
        translation: "uchratmoq, uchrashmoq",
        level: 'A2',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Ich treffe heute Freunde. Sie traf ihren Chef. Wir haben uns im Café getroffen.",
        notes: "Präsensda e -> i (du triffst, er trifft). Perfekt: getroffen.",
        praesens: {
            ich: 'treffe',
            du: 'triffst',
            er_sie_es: 'trifft',
            wir: 'treffen',
            ihr: 'trefft',
            sie_Sie: 'treffen'
        },
        praeteritum: {
            ich: 'traf',
            du: 'trafst',
            er_sie_es: 'traf',
            wir: 'trafen',
            ihr: 'traft',
            sie_Sie: 'trafen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'getroffen',
            full: 'hat getroffen'
        }
    },
    {
        id: 'beginnen',
        infinitive: 'beginnen',
        translation: "boshlamoq, boshlanmoq",
        level: 'A2',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Der Unterricht beginnt um 9 Uhr. Der Film begann spät. Sie hat das Studium begonnen.",
        notes: "Ajralmas prefiks (be-), shuning uchun ge- qo'shimchasisiz: begonnen.",
        praesens: {
            ich: 'beginne',
            du: 'beginnst',
            er_sie_es: 'beginnt',
            wir: 'beginnen',
            ihr: 'beginnt',
            sie_Sie: 'beginnen'
        },
        praeteritum: {
            ich: 'begann',
            du: 'begannst',
            er_sie_es: 'begann',
            wir: 'begannen',
            ihr: 'begannt',
            sie_Sie: 'begannen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'begonnen',
            full: 'hat begonnen'
        }
    },
    {
        id: 'verstehen',
        infinitive: 'verstehen',
        translation: "tushunmoq",
        level: 'A2',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Verstehst du die Grammatik? Ich verstand den Text nicht. Hast du mich verstanden?",
        notes: "Ajralmas prefiks (ver-): verstehen -> verstand -> verstanden.",
        praesens: {
            ich: 'verstehe',
            du: 'verstehst',
            er_sie_es: 'versteht',
            wir: 'verstehen',
            ihr: 'versteht',
            sie_Sie: 'verstehen'
        },
        praeteritum: {
            ich: 'verstand',
            du: 'verstandest',
            er_sie_es: 'verstand',
            wir: 'verstanden',
            ihr: 'verstandet',
            sie_Sie: 'verstanden'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'verstanden',
            full: 'hat verstanden'
        }
    },
    {
        id: 'laufen',
        infinitive: 'laufen',
        translation: "yugurmoq, yurmoq",
        level: 'A2',
        type: 'irregular',
        auxiliary: 'sein',
        example: "Er läuft sehr schnell. Sie liefen im Wald. Ich bin 5 Kilometer gelaufen.",
        notes: "Präsensda au -> äu (du läufst, er läuft). Harakat tufayli 'sein' oladi.",
        praesens: {
            ich: 'laufe',
            du: 'läufst',
            er_sie_es: 'läuft',
            wir: 'laufen',
            ihr: 'lauft',
            sie_Sie: 'laufen'
        },
        praeteritum: {
            ich: 'lief',
            du: 'liefst',
            er_sie_es: 'lief',
            wir: 'liefen',
            ihr: 'lieft',
            sie_Sie: 'liefen'
        },
        perfekt: {
            auxiliary: 'sein',
            partizip2: 'gelaufen',
            full: 'ist gelaufen'
        }
    },
    {
        id: 'tragen',
        infinitive: 'tragen',
        translation: "ko'tarmoq, kiyib yurmoq",
        level: 'A2',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Sie trägt ein schönes Kleid. Er trug schwere Kisten. Was hast du getragen?",
        notes: "Präsensda a -> ä (du trägst, er trägt).",
        praesens: {
            ich: 'trage',
            du: 'trägst',
            er_sie_es: 'trägt',
            wir: 'tragen',
            ihr: 'tragt',
            sie_Sie: 'tragen'
        },
        praeteritum: {
            ich: 'trug',
            du: 'trugst',
            er_sie_es: 'trug',
            wir: 'trugen',
            ihr: 'trugt',
            sie_Sie: 'trugen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'getragen',
            full: 'hat getragen'
        }
    },
    {
        id: 'gewinnen',
        infinitive: 'gewinnen',
        translation: "yutmoq, g'olib bo'lmoq",
        level: 'B1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Unsere Mannschaft gewinnt das Spiel. Er gewann eine Medaille. Wer hat gewonnen?",
        notes: "Ajralmas fe'l: gewinnen -> gewann -> gewonnen.",
        praesens: {
            ich: 'gewinne',
            du: 'gewinnst',
            er_sie_es: 'gewinnt',
            wir: 'gewinnen',
            ihr: 'gewinnt',
            sie_Sie: 'gewinnen'
        },
        praeteritum: {
            ich: 'gewann',
            du: 'gewannst',
            er_sie_es: 'gewann',
            wir: 'gewannen',
            ihr: 'gewannt',
            sie_Sie: 'gewannen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'gewonnen',
            full: 'hat gewonnen'
        }
    },
    {
        id: 'verlieren',
        infinitive: 'verlieren',
        translation: "yo'qotmoq, yutqazmoq",
        level: 'B1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Ich verliere oft meine Brille. Sie verloren das Match. Er hat viel Zeit verloren.",
        notes: "Ajralmas fe'l: verlieren -> verlor -> verloren.",
        praesens: {
            ich: 'verliere',
            du: 'verlierst',
            er_sie_es: 'verliert',
            wir: 'verlieren',
            ihr: 'verliert',
            sie_Sie: 'verlieren'
        },
        praeteritum: {
            ich: 'verlor',
            du: 'verlorst',
            er_sie_es: 'verlor',
            wir: 'verloren',
            ihr: 'verlort',
            sie_Sie: 'verloren'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'verloren',
            full: 'hat verloren'
        }
    },
    {
        id: 'entscheiden',
        infinitive: 'entscheiden',
        translation: "qaror qabul qilmoq",
        level: 'B1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Ich entscheide mich für diesen Kurs. Er entschied schnell. Wir haben uns entschieden.",
        notes: "Vokal o'zgarishi: ei -> ie -> ie (entscheiden, entschied, entschieden).",
        praesens: {
            ich: 'entscheide',
            du: 'entscheidest',
            er_sie_es: 'entscheidet',
            wir: 'entscheiden',
            ihr: 'entscheidet',
            sie_Sie: 'entscheiden'
        },
        praeteritum: {
            ich: 'entschied',
            du: 'entschiedest',
            er_sie_es: 'entschied',
            wir: 'entschieden',
            ihr: 'entschiedet',
            sie_Sie: 'entschieden'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'entschieden',
            full: 'hat entschieden'
        }
    },
    {
        id: 'versprechen',
        infinitive: 'versprechen',
        translation: "va'da bermoq",
        level: 'B1',
        type: 'irregular',
        auxiliary: 'haben',
        example: "Ich verspreche es dir. Er versprach pünktlich zu sein. Sie hat mir geholfen wie versprochen.",
        notes: "Präsensda e -> i (du versprichst, er verspricht).",
        praesens: {
            ich: 'verspreche',
            du: 'versprichst',
            er_sie_es: 'verspricht',
            wir: 'versprechen',
            ihr: 'versprecht',
            sie_Sie: 'versprechen'
        },
        praeteritum: {
            ich: 'versprach',
            du: 'versprachst',
            er_sie_es: 'versprach',
            wir: 'versprachen',
            ihr: 'verspracht',
            sie_Sie: 'versprachen'
        },
        perfekt: {
            auxiliary: 'haben',
            partizip2: 'versprochen',
            full: 'hat versprochen'
        }
    }
];

if (typeof window !== 'undefined') {
    window.GERMAN_VERBS_DB = GERMAN_VERBS_DB;
}
