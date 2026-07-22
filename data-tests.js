// Rasmli savollar uchun ishonchli, o'rnatilgan (data URI) emoji-rasm
function emojiImage(emoji, bg) {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'>"
        + "<rect width='100%' height='100%' fill='" + (bg || '#f3efe0') + "'/>"
        + "<text x='50%' y='53%' font-size='130' text-anchor='middle' dominant-baseline='central'>" + emoji + "</text>"
        + "</svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const deutschTests = {

    // ===== A1 — TO'PLAM 1 (Eshitish + matn aralash) =====
    a1_t1: {
        title: "A1 — 1-to'plam (Eshitish + matn)",
        level: "A1",
        testNo: 1,
        parts: [{
            partNum: 1,
            name: "A1 — 1-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "ğŸ“ Salomlashish va asosiy iboralar",
                    type: "text",
                    questions: [
                        { q: "'Wie geht es Ihnen?' savoliga to'g'ri javob qaysi?", options: ["Ich heiße Akrom.", "Mir geht es gut, danke.", "Ich komme aus Usbekistan.", "Ich bin 25 Jahre alt."], answer: 1, explanation: "'Mir geht es gut, danke' = Yaxshi, rahmat. Wie geht es Ihnen? = Qandaysiz? (rasmiy)." },
                        { q: "Kechqurun xayrlashishda qaysi ibora to'g'ri?", options: ["Guten Morgen!", "Guten Tag!", "Guten Abend!", "Auf Wiedersehen!"], answer: 3, explanation: "'Auf Wiedersehen!' = Ko'rishguncha/Xayr. Boshqalari salomlashish iboralari." },
                        { q: "Qaysi gapda artikel to'g'ri ishlatilgan?", options: ["Der Buch ist neu.", "Die Mann ist groß.", "Das Auto ist schnell.", "Ein Frau singt."], answer: 2, explanation: "'das Auto' to'g'ri. das Buch, der Mann, die Frau." }
                    ]
                },
                {
                    name: "🖼️ Rasmli savollar",
                    type: "image",
                    questions: [
                        { q: "Bu mevaning nemischa nomi?", image: emojiImage("ğŸ"), imageAlt: "Olma", options: ["die Banane", "der Apfel", "die Orange", "die Traube"], answer: 1, explanation: "'der Apfel' = olma. die Banane = banan, die Orange = apelsin." },
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("ğŸ¥"), imageAlt: "Shifoxona", options: ["die Schule", "das Hotel", "das Krankenhaus", "die Bank"], answer: 2, explanation: "'das Krankenhaus' = shifoxona. Krank=kasal + Haus=uy." }
                    ]
                },
                {
                    name: "ğŸ”Š Eshitish (Hören)",
                    type: "audio",
                    questions: [
                        { q: "Ovozni eshiting — tarjimasini toping:", audio: "arbeiten", audioLang: "de-DE", displayWord: "arbeiten", options: ["o'ynamoq", "ishlamoq", "o'qimoq", "yurmoq"], answer: 1, explanation: "'arbeiten' = ishlamoq. Ich arbeite = men ishlayman." },
                        { q: "Ovozni eshiting — tarjimasini toping:", audio: "Guten Morgen", audioLang: "de-DE", displayWord: "Guten Morgen", options: ["Xayrli kech", "Xayrli kun", "Xayrli tong", "Xayr"], answer: 2, explanation: "'Guten Morgen' = Xayrli tong. Morgen = ertalab." },
                        { q: "Ovozni eshiting — tarjimasini toping:", audio: "Wie heißen Sie", audioLang: "de-DE", displayWord: "Wie heißen Sie?", options: ["Qandaysiz?", "Qayerdansiz?", "Ismingiz nima?", "Necha yoshsiz?"], answer: 2, explanation: "'Wie heißen Sie?' = Ismingiz nima? (rasmiy)." }
                    ]
                },
                {
                    name: "ğŸ“ So'z va grammatika",
                    type: "text",
                    questions: [
                        { q: "Bo'sh joyga mos fe'l: 'Ich ___ Student.'", options: ["bin", "bist", "ist", "sind"], answer: 0, explanation: "'ich bin' = men ...man. sein: ich bin, du bist, er/sie ist." },
                        { q: "Qaysi son 'drei' so'ziga to'g'ri keladi?", options: ["2", "3", "4", "5"], answer: 1, explanation: "'drei' = 3. eins=1, zwei=2, drei=3, vier=4, fünf=5." }
                    ]
                }
            ]
        }]
    },

    // ===== A1 — TO'PLAM 2 (Matn + rasm) =====
    a1_t2: {
        title: "A1 — 2-to'plam (Matn + rasm)",
        level: "A1",
        testNo: 2,
        parts: [{
            partNum: 1,
            name: "A1 — 2-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "ğŸ“ Ko'p tanlovli",
                    type: "text",
                    questions: [
                        { q: "'Danke schön!' iborasiga eng mos javob qaysi?", options: ["Bitte schön!", "Tschüss!", "Guten Tag!", "Wie geht's?"], answer: 0, explanation: "'Bitte schön!' = Marhamat / Arzimaydi." },
                        { q: "Qaysi son 'sieben' so'ziga to'g'ri keladi?", options: ["6", "7", "8", "9"], answer: 1, explanation: "'sieben' = 7. sechs=6, sieben=7, acht=8." },
                        { q: "'die Mutter' so'zining ma'nosi?", options: ["ota", "ona", "opa", "aka"], answer: 1, explanation: "'die Mutter' = ona. der Vater = ota." },
                        { q: "To'g'ri artikelni tanlang: ___ Sonne (quyosh).", options: ["der", "die", "das", "den"], answer: 1, explanation: "'die Sonne' — ayol rodida." },
                        { q: "Bo'sh joyga mos fe'l: 'Du ___ aus Deutschland.'", options: ["bin", "bist", "ist", "sind"], answer: 1, explanation: "'du bist' = sen ...san. sein: ich bin, du bist, er/sie ist." }
                    ]
                },
                {
                    name: "🖼️  Rasmli — nemischa toping",
                    type: "image",
                    questions: [
                        { q: "Bu hayvonning nemischa nomi?", image: emojiImage("🐱"), imageAlt: "Mushuk", options: ["der Hund", "die Katze", "das Pferd", "der Vogel"], answer: 1, explanation: "'die Katze' = mushuk. der Hund = it." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("🏠"), imageAlt: "Uy", options: ["die Schule", "das Haus", "die Kirche", "der Garten"], answer: 1, explanation: "'das Haus' = uy. die Schule = maktab." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("☀️", "#fff4d6"), imageAlt: "Quyosh", options: ["der Mond", "der Stern", "die Sonne", "der Regen"], answer: 2, explanation: "'die Sonne' = quyosh. der Mond = oy." },
                        { q: "Bu transport vositasining nemischa nomi?", image: emojiImage("🚗"), imageAlt: "Mashina", options: ["das Fahrrad", "der Bus", "das Auto", "der Zug"], answer: 2, explanation: "'das Auto' = mashina. das Fahrrad = velosiped." },
                        { q: "Bu hafta kunining nemischa nomi?", image: emojiImage("📅"), imageAlt: "Kalendar", options: ["Montag = Dushanba", "Montag = Yakshanba", "Montag = Juma", "Montag = Shanba"], answer: 0, explanation: "'Montag' = Dushanba. Dienstag = Seshanba, Sonntag = Yakshanba." }
                    ]
                }
            ]
        }]
    },

    // ===== A1 — TO'PLAM 3 (So'z boyligi + grammatika) =====
    a1_t3: {
        title: "A1 — 3-to'plam (So'z + grammatika)",
        level: "A1",
        testNo: 3,
        parts: [{
            partNum: 1,
            name: "A1 — 3-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "📝  Ranglar, sanoq, oila",
                    type: "text",
                    questions: [
                        { q: "'rot' rangi o'zbekchada nima?", options: ["ko'k", "yashil", "qizil", "sariq"], answer: 2, explanation: "'rot' = qizil. blau = ko'k, grün = yashil, gelb = sariq." },
                        { q: "'der Bruder' so'zining ma'nosi?", options: ["aka/uka", "ota", "opa", "ona"], answer: 0, explanation: "'der Bruder' = aka/uka. die Schwester = opa/singil." },
                        { q: "Qaysi son 'zehn' ga to'g'ri keladi?", options: ["8", "9", "10", "11"], answer: 2, explanation: "'zehn' = 10. neun=9, zehn=10, elf=11." },
                        { q: "Ko'plik shaklini tanlang: das Kind → ?", options: ["die Kinder", "die Kind", "der Kinder", "die Kindes"], answer: 0, explanation: "Ko'plikda artikel doim 'die': die Kinder = bolalar." },
                        { q: "Xushmuomalalik so'zi: 'Ich möchte einen Kaffee, ___.'", options: ["bitte", "danke", "nein", "gut"], answer: 0, explanation: "'bitte' = iltimos." }
                    ]
                },
                {
                    name: "🖼️  Rasmli — so'z boyligi",
                    type: "image",
                    questions: [
                        { q: "Bu mevaning nemischa nomi?", image: emojiImage("🍌"), imageAlt: "Banan", options: ["die Banane", "der Apfel", "die Birne", "die Kirsche"], answer: 0, explanation: "'die Banane' = banan." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("📚"), imageAlt: "Kitob", options: ["das Heft", "das Buch", "der Stift", "der Tisch"], answer: 1, explanation: "'das Buch' = kitob. das Heft = daftar, der Stift = qalam." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("💧", "#dbe7f0"), imageAlt: "Suv", options: ["die Milch", "das Wasser", "der Saft", "der Tee"], answer: 1, explanation: "'das Wasser' = suv. die Milch = sut, der Tee = choy." },
                        { q: "Bu kasbning nemischa nomi?", image: emojiImage("👨‍⚕️"), imageAlt: "Shifokor", options: ["der Lehrer", "der Arzt", "der Koch", "der Polizist"], answer: 1, explanation: "'der Arzt' = shifokor. die Ärztin = ayol shifokor." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("⏲️", "#f0e6db"), imageAlt: "Soat", options: ["die Uhr", "der Tag", "das Buch", "die Tür"], answer: 0, explanation: "'die Uhr' = soat. Wie spät ist es? = Soat necha bo'ldi?" }
                    ]
                }
            ]
        }]
    },

    // ===== A2 — TO'PLAM 1 (Grammatika asoslari) =====
    a2_t1: {
        title: "A2 — 1-to'plam (Grammatika asoslari)",
        level: "A2",
        testNo: 1,
        parts: [{
            partNum: 1,
            name: "A2 — 1-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝  Perfekt va modal fe'llar",
                    type: "text",
                    questions: [
                        { q: "Perfekt: 'Ich ___ gestern Fußball gespielt.'", options: ["habe", "bin", "hat", "bist"], answer: 0, explanation: "'spielen' Perfektda 'haben' bilan: Ich habe gespielt." },
                        { q: "Modal fe'l: 'Ich ___ heute arbeiten.' (majburiyat)", options: ["muss", "kann", "darf", "will"], answer: 0, explanation: "'müssen' = kerak/majbur. kann = qila olaman, darf = ruxsat." },
                        { q: "Perfektda 'fahren' fe'lining yordamchi fe'li qaysi?", options: ["haben", "sein", "werden", "können"], answer: 1, explanation: "Harakat fe'llari (fahren, gehen) 'sein' oladi: Ich bin gefahren." },
                        { q: "Modal fe'l: 'Du ___ Deutsch sprechen.' (qila olasan)", options: ["musst", "kannst", "darfst", "willst"], answer: 1, explanation: "'können' = qila olmoq. ich kann, du kannst, er kann." },
                        { q: "Perfekt: 'Wir ___ ins Kino gegangen.'", options: ["haben", "sind", "hatten", "waren"], answer: 1, explanation: "'gehen' Perfektda 'sein' oladi: Wir sind gegangen." }
                    ]
                },
                {
                    name: "🖼️  Rasmli — vaziyatlar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏥"), imageAlt: "Shifoxona", options: ["die Apotheke", "das Krankenhaus", "das Rathaus", "die Post"], answer: 1, explanation: "'das Krankenhaus' = shifoxona. die Apotheke = dorixona." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("💊"), imageAlt: "Tabletka", options: ["die Spritze", "die Tablette", "der Verband", "das Pflaster"], answer: 1, explanation: "'die Tablette' = tabletka." },
                        { q: "Ob-havoni nemischa qanday ifodalaymiz?", image: emojiImage("🌧️", "#dbe7f0"), imageAlt: "Yomg'ir", options: ["Es schneit.", "Es regnet.", "Es ist sonnig.", "Es ist windig."], answer: 1, explanation: "'Es regnet' = Yomg'ir yog'yapti." },
                        { q: "Bu kasbning nemischa nomi?", image: emojiImage("🧑‍🍳"), imageAlt: "Oshpaz", options: ["der Lehrer", "der Koch", "der Arzt", "der Fahrer"], answer: 1, explanation: "'der Koch' = oshpaz." },
                        { q: "'Es ist Viertel nach acht.' — soat nechada?", image: emojiImage("⏲️", "#f0e6db"), imageAlt: "Soat", options: ["07:45", "08:15", "08:45", "08:30"], answer: 1, explanation: "'Viertel nach acht' = 08:15. nach = keyin." }
                    ]
                }
            ]
        }]
    },

    // ===== A2 — TO'PLAM 2 (Predloglar + ajraladigan fe'llar) =====
    a2_t2: {
        title: "A2 — 2-to'plam (Predloglar va fe'llar)",
        level: "A2",
        testNo: 2,
        parts: [{
            partNum: 1,
            name: "A2 — 2-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝  Predloglar va ajraladigan fe'llar",
                    type: "text",
                    questions: [
                        { q: "To'g'ri predlog: 'Ich fahre ___ Bus zur Arbeit.'", options: ["mit dem", "mit der", "in den", "auf dem"], answer: 0, explanation: "'mit dem Bus' = avtobusda. mit + Dativ; der Bus → dem Bus." },
                        { q: "Ajraladigan fe'l: 'Der Zug fährt um 8 Uhr ___.' (jo'naydi)", options: ["ab", "auf", "an", "aus"], answer: 0, explanation: "'abfahren' = jo'nab ketmoq. 'ab' oxiriga boradi." },
                        { q: "To'g'ri predlog: 'Ich interessiere mich ___ Musik.'", options: ["für", "auf", "an", "mit"], answer: 0, explanation: "'sich interessieren für' = ...ga qiziqmoq." },
                        { q: "Dativ: 'Ich helfe ___ Mann.'", options: ["dem", "den", "der", "das"], answer: 0, explanation: "'helfen' Dativ talab qiladi: der Mann → dem Mann." },
                        { q: "Ajraladigan fe'l: 'Ich ___ um 7 Uhr ___.' (turaman)", options: ["auf / stehe", "stehe / auf", "stehe / ab", "ab / stehe"], answer: 1, explanation: "'aufstehen' = turmoq. Gapda: Ich stehe ... auf." },
                        { q: "To'g'ri predlog: 'Wir warten ___ den Bus.'", options: ["auf", "für", "an", "mit"], answer: 0, explanation: "'warten auf' = ...ni kutmoq. Wir warten auf den Bus." }
                    ]
                },
                {
                    name: "🖼️  Rasmli — kundalik hayot",
                    type: "image",
                    questions: [
                        { q: "Bu mevaning nemischa nomi?", image: emojiImage("🍓"), imageAlt: "Qulupnay", options: ["die Erdbeere", "die Himbeere", "die Kirsche", "die Pflaume"], answer: 0, explanation: "'die Erdbeere' = qulupnay. die Kirsche = gilos." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("✈️", "#dbe7f0"), imageAlt: "Samolyot", options: ["das Auto", "der Zug", "das Flugzeug", "das Schiff"], answer: 2, explanation: "'das Flugzeug' = samolyot. fliegen = uchmoq." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("⚽"), imageAlt: "Futbol to'pi", options: ["der Ball", "das Spiel", "der Sport", "die Mannschaft"], answer: 0, explanation: "'der Ball' = to'p. Fußball = futbol." },
                        { q: "Bu vaziyatning nemischa nomi?", image: emojiImage("❄️", "#dbe7f0"), imageAlt: "Qor", options: ["Es regnet.", "Es schneit.", "Es ist heiß.", "Es ist windig."], answer: 1, explanation: "'Es schneit' = Qor yog'yapti. der Schnee = qor." }
                    ]
                }
            ]
        }]
    },

    // ===== A2 — TO'PLAM 3 (Bog'lovchilar + qiyosiy daraja) =====
    a2_t3: {
        title: "A2 — 3-to'plam (Bog'lovchilar va qiyos)",
        level: "A2",
        testNo: 3,
        parts: [{
            partNum: 1,
            name: "A2 — 3-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝  Bog'lovchilar va qiyosiy daraja",
                    type: "text",
                    questions: [
                        { q: "Qiyosiy daraja: 'Berlin ist ___ als Bonn.' (kattaroq)", options: ["größer", "groß", "am größten", "großer"], answer: 0, explanation: "'größer als' = ...dan kattaroq." },
                        { q: "'weil' bog'lovchisidan keyin fe'l qayerda turadi?", options: ["Boshida", "Ikkinchi o'rinda", "Gap oxirida", "Ahamiyati yo'q"], answer: 2, explanation: "'weil' (chunki) fe'lni gap oxiriga suradi: ..., weil ich müde bin." },
                        { q: "'gestern' so'zi nimani bildiradi?", options: ["Bugun", "Ertaga", "Kecha", "Hozir"], answer: 2, explanation: "'gestern' = kecha. heute = bugun, morgen = ertaga." },
                        { q: "Eng yuqori daraja: 'Das Buch ist ___.' (eng yaxshi)", options: ["gut", "besser", "am besten", "guter"], answer: 2, explanation: "'am besten' = eng yaxshi. gut → besser → am besten." },
                        { q: "Bog'lovchi: 'Ich bleibe zu Hause, ___ ich krank bin.'", options: ["aber", "weil", "und", "oder"], answer: 1, explanation: "'weil' = chunki (sabab)." },
                        { q: "Qiyos: 'Anna ist ___ wie Maria.' (xuddi)", options: ["so groß", "größer", "am größten", "größere"], answer: 0, explanation: "'so ... wie' = xuddi ...dek. Anna ist so groß wie Maria." }
                    ]
                },
                {
                    name: "🖼️  Rasmli — joylar va hodisalar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏫"), imageAlt: "Maktab", options: ["die Universität", "die Schule", "der Kindergarten", "das Büro"], answer: 1, explanation: "'die Schule' = maktab." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("🚲"), imageAlt: "Velosiped", options: ["das Motorrad", "das Fahrrad", "der Roller", "das Skateboard"], answer: 1, explanation: "'das Fahrrad' = velosiped. fahren = yurmoq." },
                        { q: "Bu fasl nemischa qanday?", image: emojiImage("🍂", "#f4e4d4"), imageAlt: "Kuz", options: ["der Frühling", "der Sommer", "der Herbst", "der Winter"], answer: 2, explanation: "'der Herbst' = kuz. der Frühling = bahor, der Sommer = yoz, der Winter = qish." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("🖊️"), imageAlt: "Qalam", options: ["das Buch", "der Stift", "das Heft", "der Tisch"], answer: 1, explanation: "'der Stift' = qalam. der Bleistift = oddiy qalam." }
                    ]
                }
            ]
        }]
    },

    // ===== B1 — TO'PLAM 1 (Konjunktiv II + Passiv) =====
    b1_t1: {
        title: "B1 — 1-to'plam (Konjunktiv va Passiv)",
        level: "B1",
        testNo: 1,
        parts: [{
            partNum: 1,
            name: "B1 — 1-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝  Konjunktiv II va Passiv",
                    type: "text",
                    questions: [
                        { q: "Konjunktiv II: 'Wenn ich Zeit ___, würde ich reisen.'", options: ["hätte", "habe", "hatte", "haben"], answer: 0, explanation: "'hätte' — Konjunktiv II (shart mayli). Wenn ich Zeit hätte = Agar vaqtim bo'lganida." },
                        { q: "Passiv: 'Das Haus ___ 1990 gebaut.' (qurilgan edi)", options: ["wurde", "wird", "ist", "war"], answer: 0, explanation: "'wurde gebaut' — Präteritum Passiv: werden + Partizip II." },
                        { q: "Konjunktiv II: 'Ich ___ gerne nach Berlin fahren.'", options: ["würde", "werde", "wurde", "wäre"], answer: 0, explanation: "'würde + fe'l' = istakni bildiradi. Ich würde gerne ... = mamnuniyat bilan ...." },
                        { q: "Passiv Präsens: 'Die E-Mail ___ geschrieben.' (yozilyapti)", options: ["wird", "wurde", "ist", "war"], answer: 0, explanation: "Präsens Passiv: werden + Partizip II. Die E-Mail wird geschrieben." },
                        { q: "Konjunktiv II 'sein': 'Wenn ich reich ___, würde ich helfen.'", options: ["wäre", "war", "bin", "wurde"], answer: 0, explanation: "'wäre' — sein fe'lining Konjunktiv II shakli." },
                        { q: "Passiv Perfekt: 'Das Buch ___ gelesen ___.'", options: ["ist / worden", "hat / worden", "wird / gewesen", "war / werden"], answer: 0, explanation: "Passiv Perfekt: sein + Partizip II + worden. Das Buch ist gelesen worden." }
                    ]
                },
                {
                    name: "🖼️  Rasmli — chuqurroq so'z boyligi",
                    type: "image",
                    questions: [
                        { q: "Bu tibbiy asbobning nemischa nomi?", image: emojiImage("🩺"), imageAlt: "Stetoskop", options: ["das Thermometer", "das Stethoskop", "die Spritze", "der Verband"], answer: 1, explanation: "'das Stethoskop' = stetoskop." },
                        { q: "Bu tadbirning nemischa nomi?", image: emojiImage("🎓"), imageAlt: "Bitiruv", options: ["die Hochzeit", "der Abschluss", "die Beerdigung", "die Geburt"], answer: 1, explanation: "'der Abschluss' = bitiruv/yakunlash." },
                        { q: "Bu favqulodda holatning nemischa nomi?", image: emojiImage("🔥", "#ffe0d6"), imageAlt: "Yong'in", options: ["der Unfall", "das Feuer", "die Flut", "der Sturm"], answer: 1, explanation: "'das Feuer' = olov/yong'in. der Unfall = baxtsiz hodisa." },
                        { q: "Bu hujjatning nemischa nomi?", image: emojiImage("📜"), imageAlt: "Sertifikat", options: ["der Pass", "das Zeugnis", "die Rechnung", "der Brief"], answer: 1, explanation: "'das Zeugnis' = sertifikat/guvohnoma." }
                    ]
                }
            ]
        }]
    },

    // ===== B1 — TO'PLAM 2 (Bog'lovchilar + nisbiy gaplar) =====
    b1_t2: {
        title: "B1 — 2-to'plam (Bog'lovchi va nisbiy gaplar)",
        level: "B1",
        testNo: 2,
        parts: [{
            partNum: 1,
            name: "B1 — 2-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝  Bog'lovchilar va nisbiy gaplar",
                    type: "text",
                    questions: [
                        { q: "Bog'lovchi: 'Es regnete. ___ gingen wir spazieren.' (shunga qaramay)", options: ["Deshalb", "Trotzdem", "Deswegen", "Darum"], answer: 1, explanation: "'trotzdem' = shunga qaramay. deshalb = shuning uchun." },
                        { q: "Nisbiy olmosh: 'Der Mann, ___ dort steht, ist mein Arzt.'", options: ["der", "den", "dem", "das"], answer: 0, explanation: "'der' — Nominativ. Nisbiy olmosh ergash gapda subyekt." },
                        { q: "'obwohl' bog'lovchisi qaysi ma'noni beradi?", options: ["chunki", "shuning uchun", "...ga qaramay", "agar"], answer: 2, explanation: "'obwohl' = ...ga qaramay (garchi). Fe'l ergash gap oxirida." },
                        { q: "Nisbiy olmosh: 'Die Frau, ___ ich helfe, ist Lehrerin.'", options: ["der", "die", "dem", "das"], answer: 0, explanation: "'helfen' Dativ, ayol rod: die Frau → der (Dativ)." },
                        { q: "Bog'lovchi: 'Ich gehe ins Bett, ___ ich müde bin.'", options: ["weil", "aber", "und", "oder"], answer: 0, explanation: "'weil' = chunki (sabab). Fe'l oxiriga boradi." },
                        { q: "'damit' bog'lovchisi nimani ifodalaydi?", options: ["sabab", "qarama-qarshilik", "maqsad", "shart"], answer: 2, explanation: "'damit' = maqsad uchun (toki). Ich lerne, damit ich erfolgreich werde." }
                    ]
                },
                {
                    name: "🖼️  Rasmli — abstrakt tushunchalar",
                    type: "image",
                    questions: [
                        { q: "Bu tushunchaning nemischa nomi?", image: emojiImage("💼"), imageAlt: "Ish", options: ["der Beruf", "die Freizeit", "die Familie", "das Hobby"], answer: 0, explanation: "'der Beruf' = kasb. die Arbeit = ish." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("💵", "#f4e4d4"), imageAlt: "Pul", options: ["das Geld", "die Bank", "die Karte", "der Preis"], answer: 0, explanation: "'das Geld' = pul. das Bargeld = naqd pul." },
                        { q: "Bu tushunchaning nemischa nomi?", image: emojiImage("🌍"), imageAlt: "Yer kurrasi", options: ["die Welt", "das Land", "die Stadt", "der Kontinent"], answer: 0, explanation: "'die Welt' = dunyo. das Land = mamlakat." },
                        { q: "Bu vaziyatning nemischa nomi?", image: emojiImage("📚"), imageAlt: "Kitoblar", options: ["die Bibliothek", "die Buchhandlung", "die Schule", "das Museum"], answer: 0, explanation: "'die Bibliothek' = kutubxona. die Buchhandlung = kitob do'koni." }
                    ]
                }
            ]
        }]
    },

    // ===== B1 — TO'PLAM 3 (Genitiv + nominalizatsiya + iboralar) =====
    b1_t3: {
        title: "B1 — 3-to'plam (Genitiv va iboralar)",
        level: "B1",
        testNo: 3,
        parts: [{
            partNum: 1,
            name: "B1 — 3-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝  Genitiv va so'z boyligi",
                    type: "text",
                    questions: [
                        { q: "Genitiv: 'das Auto ___ Vaters' (otaning mashinasi)", options: ["des", "der", "dem", "den"], answer: 0, explanation: "Genitivda erkak rod: der Vater → des Vaters." },
                        { q: "'sich bewerben' fe'li nimani anglatadi?", options: ["dam olmoq", "ish uchun ariza bermoq", "kasal bo'lmoq", "sayohat qilmoq"], answer: 1, explanation: "'sich bewerben (um/bei)' = ishga ariza topshirmoq. die Bewerbung = ariza." },
                        { q: "'der Termin' so'zining ma'nosi?", options: ["narx", "uchrashuv / qabul vaqti", "manzil", "hujjat"], answer: 1, explanation: "'der Termin' = belgilangan vaqt/uchrashuv." },
                        { q: "Nominalizatsiya: 'schwimmen' → 'das ___'.", options: ["Schwimmen", "Schwimmung", "Geschwimm", "Schwimmer"], answer: 0, explanation: "Fe'lni otga aylantirish: schwimmen → das Schwimmen. Artikel doim 'das'." },
                        { q: "'Je mehr ich lerne, ___ besser verstehe ich.'", options: ["desto", "als", "wie", "denn"], answer: 0, explanation: "'je ... desto ...' = qancha ... shuncha ...." },
                        { q: "To'g'ri predlog: 'Ich freue mich ___ das Wochenende.' (intizorlik)", options: ["auf", "über", "an", "für"], answer: 0, explanation: "'sich freuen auf' = kelajakdagi narsani intizorlik bilan kutmoq." },
                        { q: "'die Krankenversicherung' so'zi nimani bildiradi?", options: ["kasallik tarixi", "tibbiy sug'urta", "retsept", "shifokor"], answer: 1, explanation: "'die Krankenversicherung' = tibbiy sug'urta. Germaniyada majburiy." }
                    ]
                },
                {
                    name: "🖼️  Rasmli — murakkab so'zlar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏛️"), imageAlt: "Hokimiyat", options: ["das Rathaus", "die Kirche", "das Theater", "das Museum"], answer: 0, explanation: "'das Rathaus' = hokimiyat binosi. Rat = kengash + Haus = uy." },
                        { q: "Bu hujjatning nemischa nomi?", image: emojiImage("🛂"), imageAlt: "Pasport", options: ["der Pass", "der Brief", "der Ausweis", "die Karte"], answer: 0, explanation: "'der Pass' = pasport. der Personalausweis = shaxsiy guvohnoma." },
                        { q: "Bu jarayonning nemischa nomi?", image: emojiImage("🔬"), imageAlt: "Tadqiqot", options: ["die Forschung", "die Bildung", "die Erziehung", "die Lehre"], answer: 0, explanation: "'die Forschung' = tadqiqot. forschen = tadqiq qilmoq." }
                    ]
                }
            ]
        }]
    },
    // ===== A1 — TO'PLAM 4 (Kundalik hayot) =====
    a1_t4: {
        title: "A1 — 4-to'plam (Kundalik hayot)",
        level: "A1",
        testNo: 4,
        parts: [{
            partNum: 1,
            name: "A1 — 4-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "📝 Kundalik hayot va ovqat",
                    type: "text",
                    questions: [
                        { q: "Ertalabki nonushta nemis tilida qanday ataladi?", options: ["das Mittagessen", "das Frühstück", "das Abendessen", "der Snack"], answer: 1, explanation: "'das Frühstück' = nonushta." },
                        { q: "'Ich trinke ___ Wasser.' (Men suv ichyapman)", options: ["ein", "eine", "einen", "- (hech qanday)"], answer: 3, explanation: "Sanoqsiz otlar bilan ko'pincha artikelsiz ishlatiladi: 'Ich trinke Wasser'." },
                        { q: "Tushlik vaqtidagi ovqatlanish nima deyiladi?", options: ["das Frühstück", "das Mittagessen", "das Abendessen", "das Essen"], answer: 1, explanation: "'das Mittagessen' = tushlik." },
                        { q: "Bo'sh joyni to'ldiring: 'Zum Frühstück esse ich ___ Brot.'", options: ["ein", "einen", "eine", "einem"], answer: 0, explanation: "'das Brot' betaraf rod, Akkusativda 'ein Brot'." },
                        { q: "'Kiyim' so'zining nemischa tarjimasi nima?", options: ["das Essen", "die Kleidung", "das Haus", "das Auto"], answer: 1, explanation: "'die Kleidung' = kiyim." },
                        { q: "Qaysi gap to'g'ri?", options: ["Ich ziehe eine Jacke an.", "Ich ziehe ein Jacke an.", "Ich ziehe einen Jacke an.", "Ich ziehe dem Jacke an."], answer: 0, explanation: "'die Jacke' ayol rod, Akkusativda 'eine Jacke'." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Kundalik buyumlar",
                    type: "image",
                    questions: [
                        { q: "Bu kiyimning nemischa nomi nima?", image: emojiImage("🧥"), imageAlt: "Palto", options: ["die Hose", "der Mantel", "das Hemd", "der Schuh"], answer: 1, explanation: "'der Mantel' = palto." },
                        { q: "Bu ichimlik nima deyiladi?", image: emojiImage("☕"), imageAlt: "Qahva", options: ["der Tee", "der Kaffee", "der Saft", "die Milch"], answer: 1, explanation: "'der Kaffee' = qahva." },
                        { q: "Bu taomning nomi nima?", image: emojiImage("🍞"), imageAlt: "Non", options: ["das Brot", "der Käse", "die Wurst", "der Apfel"], answer: 0, explanation: "'das Brot' = non." },
                        { q: "Bu kiyimning nomi nima?", image: emojiImage("👖"), imageAlt: "Shim", options: ["die Jacke", "der Pullover", "die Hose", "das Kleid"], answer: 2, explanation: "'die Hose' = shim." }
                    ]
                }
            ]
        }]
    },

    // ===== A1 — TO'PLAM 5 (Manzil va yo'nalish) =====
    a1_t5: {
        title: "A1 — 5-to'plam (Manzil va yo'nalish)",
        level: "A1",
        testNo: 5,
        parts: [{
            partNum: 1,
            name: "A1 — 5-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "📝 Manzil so'rash va transport",
                    type: "text",
                    questions: [
                        { q: "'O'ngga' degan ma'noni qaysi so'z bildiradi?", options: ["links", "geradeaus", "rechts", "zurück"], answer: 2, explanation: "'rechts' = o'ngga, 'links' = chapga." },
                        { q: "'Kechirasiz, vokzal qayerda?' qanday aytiladi?", options: ["Entschuldigung, wo ist der Bahnhof?", "Wo gehst du hin?", "Wann fährt der Zug?", "Wie viel kostet das?"], answer: 0, explanation: "'Wo ist der Bahnhof?' = Vokzal qayerda?" },
                        { q: "Bekat nemis tilida nima deyiladi?", options: ["der Bahnhof", "die Haltestelle", "der Flughafen", "die Straße"], answer: 1, explanation: "'die Haltestelle' = bekat (avtobus/tramvay uchun)." },
                        { q: "'To'g'riga yuring' iborasi qanday tarjima qilinadi?", options: ["Gehen Sie links.", "Gehen Sie geradeaus.", "Gehen Sie rechts.", "Gehen Sie zurück."], answer: 1, explanation: "'geradeaus' = to'g'riga." },
                        { q: "Poezd degan ma'noni qaysi so'z bildiradi?", options: ["der Bus", "das Auto", "das Flugzeug", "der Zug"], answer: 3, explanation: "'der Zug' = poezd." },
                        { q: "'U-Bahn' nima degani?", options: ["Avtobus", "Metro", "Taksi", "Kema"], answer: 1, explanation: "'die U-Bahn' (Untergrundbahn) = metro." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Joylar",
                    type: "image",
                    questions: [
                        { q: "Bu transport qanday ataladi?", image: emojiImage("🚌"), imageAlt: "Avtobus", options: ["der Zug", "die Straßenbahn", "der Bus", "das Fahrrad"], answer: 2, explanation: "'der Bus' = avtobus." },
                        { q: "Bu joy qayer?", image: emojiImage("✈️"), imageAlt: "Aeroport", options: ["der Bahnhof", "die Haltestelle", "der Flughafen", "der Park"], answer: 2, explanation: "'der Flughafen' = aeroport." },
                        { q: "Bu binoning nomi nima?", image: emojiImage("🏥"), imageAlt: "Kasalxona", options: ["die Schule", "das Krankenhaus", "das Hotel", "die Post"], answer: 1, explanation: "'das Krankenhaus' = kasalxona." },
                        { q: "Bu joy nima?", image: emojiImage("🌳"), imageAlt: "Park", options: ["der Park", "der Wald", "der Garten", "der Strand"], answer: 0, explanation: "'der Park' = park." }
                    ]
                }
            ]
        }]
    },

    // ===== A1 — TO'PLAM 6 (Tanishish va suhbat) =====
    a1_t6: {
        title: "A1 — 6-to'plam (Tanishish va suhbat)",
        level: "A1",
        testNo: 6,
        parts: [{
            partNum: 1,
            name: "A1 — 6-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "📝 Tanishish va muloqot",
                    type: "text",
                    questions: [
                        { q: "'Siz qayerdansiz?' rasmiy tilda qanday so'raladi?", options: ["Woher kommst du?", "Woher kommen Sie?", "Wo wohnst du?", "Wo arbeiten Sie?"], answer: 1, explanation: "Rasmiy tilda 'Sie' ishlatiladi: 'Woher kommen Sie?'" },
                        { q: "'Telefon qilmoq' fe'lining nemischa tarjimasi nima?", options: ["schreiben", "lesen", "anrufen", "hören"], answer: 2, explanation: "'anrufen' = telefon qilmoq (ajraladigan fe'l)." },
                        { q: "'Xat' nemis tilida nima deyiladi?", options: ["der Brief", "die E-Mail", "das Buch", "die Zeitung"], answer: 0, explanation: "'der Brief' = xat." },
                        { q: "Gapni to'ldiring: 'Ich rufe meine Mutter ___.'", options: ["an", "auf", "zu", "mit"], answer: 0, explanation: "'anrufen' ajraladigan fe'l, 'an' gap oxiriga tushadi." },
                        { q: "Yoshi haqida qanday so'raladi?", options: ["Wie alt bist du?", "Wie groß bist du?", "Wie heißt du?", "Wie geht es dir?"], answer: 0, explanation: "'Wie alt bist du?' = Yoshingiz nechada?" },
                        { q: "Xat oxirida do'stlarga qanday xayrlashiladi?", options: ["Mit freundlichen Grüßen", "Liebe Grüße", "Sehr geehrte Damen", "Auf Wiedersehen"], answer: 1, explanation: "'Liebe Grüße' = Do'stona salomlar (norasmiy)." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Aloqa",
                    type: "image",
                    questions: [
                        { q: "Bu buyum qanday ataladi?", image: emojiImage("📱"), imageAlt: "Mobil telefon", options: ["der Computer", "das Telefon", "das Handy", "der Fernseher"], answer: 2, explanation: "'das Handy' = mobil telefon." },
                        { q: "Bu narsa nima deyiladi?", image: emojiImage("✉️"), imageAlt: "Konvert/Xat", options: ["der Brief", "das Paket", "die Postkarte", "das Heft"], answer: 0, explanation: "'der Brief' = xat." },
                        { q: "Bu moslama qanday ataladi?", image: emojiImage("💻"), imageAlt: "Noutbuk", options: ["das Handy", "der Laptop", "das Radio", "der Stift"], answer: 1, explanation: "'der Laptop' = noutbuk." },
                        { q: "Bu obyekt nima?", image: emojiImage("📰"), imageAlt: "Gazeta", options: ["das Buch", "die Zeitung", "das Magazin", "der Brief"], answer: 1, explanation: "'die Zeitung' = gazeta." }
                    ]
                }
            ]
        }]
    },

    // ===== A1 — TO'PLAM 7 (Ob-havo va tabiat) =====
    a1_t7: {
        title: "A1 — 7-to'plam (Ob-havo va tabiat)",
        level: "A1",
        testNo: 7,
        parts: [{
            partNum: 1,
            name: "A1 — 7-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "📝 Ob-havo va hayvonlar",
                    type: "text",
                    questions: [
                        { q: "'Quyosh charaqlab turibdi' qanday tarjima qilinadi?", options: ["Es regnet.", "Es schneit.", "Die Sonne scheint.", "Es ist windig."], answer: 2, explanation: "'Die Sonne scheint' = Quyosh charaqlayapti." },
                        { q: "Qish fasli qanday ataladi?", options: ["der Sommer", "der Herbst", "der Winter", "der Frühling"], answer: 2, explanation: "'der Winter' = qish." },
                        { q: "'Sovuq' so'zining tarjimasi nima?", options: ["kalt", "warm", "heiß", "schön"], answer: 0, explanation: "'kalt' = sovuq." },
                        { q: "Qaysi hayvonning nemischa nomi 'der Hund'?", options: ["Mushuk", "It", "Ot", "Sigir"], answer: 1, explanation: "'der Hund' = it." },
                        { q: "Kapalak nemis tilida nima deyiladi?", options: ["die Biene", "der Vogel", "der Schmetterling", "die Fliege"], answer: 2, explanation: "'der Schmetterling' = kapalak." },
                        { q: "Bahor fasli qanday ataladi?", options: ["der Sommer", "der Winter", "der Herbst", "der Frühling"], answer: 3, explanation: "'der Frühling' = bahor." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Tabiat",
                    type: "image",
                    questions: [
                        { q: "Bu ob-havo qanday ataladi?", image: emojiImage("🌧️"), imageAlt: "Yomg'ir", options: ["die Sonne", "der Schnee", "der Regen", "der Wind"], answer: 2, explanation: "'der Regen' = yomg'ir." },
                        { q: "Bu hayvonning nomi nima?", image: emojiImage("🐴"), imageAlt: "Ot", options: ["das Pferd", "der Hund", "die Katze", "die Kuh"], answer: 0, explanation: "'das Pferd' = ot." },
                        { q: "Bu tabiat hodisasi nima?", image: emojiImage("❄️"), imageAlt: "Qor", options: ["der Regen", "der Schnee", "der Nebel", "die Wolke"], answer: 1, explanation: "'der Schnee' = qor." },
                        { q: "Bu o'simlik nima deyiladi?", image: emojiImage("🌻"), imageAlt: "Kungaboqar/Gul", options: ["der Baum", "das Gras", "die Blume", "das Blatt"], answer: 2, explanation: "'die Blume' = gul." }
                    ]
                }
            ]
        }]
    },
    // ===== A2 — TO'PLAM 4 (Sog'liq va tana a'zolari) =====
    a2_t4: {
        title: "A2 — 4-to'plam (Sog'liq)",
        level: "A2",
        testNo: 4,
        parts: [{
            partNum: 1,
            name: "A2 — 4-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝 Tana a'zolari va kasalliklar",
                    type: "text",
                    questions: [
                        { q: "'Mening boshim og'riyapti' nemis tilida qanday bo'ladi?", options: ["Ich bin Kopf.", "Mein Kopf ist krank.", "Ich habe Kopfschmerzen.", "Kopfschmerzen habe ich nicht."], answer: 2, explanation: "'Ich habe Kopfschmerzen' = Mening boshim og'riyapti." },
                        { q: "Tish shifokori nima deyiladi?", options: ["der Hausarzt", "der Tierarzt", "der Zahnarzt", "der Chirurg"], answer: 2, explanation: "'der Zahnarzt' = tish shifokori (Zahn = tish)." },
                        { q: "'die Erkältung' so'zining ma'nosi nima?", options: ["shikastlanish", "shamollash", "isitma", "yo'tal"], answer: 1, explanation: "'die Erkältung' = shamollash." },
                        { q: "Gapni to'ldiring: 'Mein Fuß ___ weh.'", options: ["macht", "tut", "ist", "hat"], answer: 1, explanation: "'wehtun' = og'rimoq. Mein Fuß tut weh." },
                        { q: "Qorin og'rig'i nemis tilida nima?", options: ["die Halsschmerzen", "die Bauchschmerzen", "die Rückenschmerzen", "die Zahnschmerzen"], answer: 1, explanation: "'der Bauch' = qorin. 'die Bauchschmerzen' = qorin og'rig'i." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Tana va tibbiyot",
                    type: "image",
                    questions: [
                        { q: "Bu tana a'zosi nima deyiladi?", image: emojiImage("👁️"), imageAlt: "Ko'z", options: ["das Ohr", "der Mund", "das Auge", "die Nase"], answer: 2, explanation: "'das Auge' = ko'z." },
                        { q: "Bu buyum nima?", image: emojiImage("💊"), imageAlt: "Dori", options: ["das Rezept", "die Pille", "die Spritze", "das Pflaster"], answer: 1, explanation: "'die Pille' yoki 'die Tablette' = dori/tabletka." },
                        { q: "Bu tana a'zosi nima?", image: emojiImage("👂"), imageAlt: "Quloq", options: ["das Auge", "das Ohr", "der Kopf", "der Zahn"], answer: 1, explanation: "'das Ohr' = quloq." },
                        { q: "Bu narsa qanday ataladi?", image: emojiImage("🚑"), imageAlt: "Tez yordam", options: ["das Krankenhaus", "der Krankenwagen", "die Apotheke", "die Praxis"], answer: 1, explanation: "'der Krankenwagen' = tez yordam mashinasi." }
                    ]
                }
            ]
        }]
    },

    // ===== A2 — TO'PLAM 5 (Sayohat va mehmonxona) =====
    a2_t5: {
        title: "A2 — 5-to'plam (Sayohat)",
        level: "A2",
        testNo: 5,
        parts: [{
            partNum: 1,
            name: "A2 — 5-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝 Mehmonxona va sayohat",
                    type: "text",
                    questions: [
                        { q: "Bir kishilik xona nima deyiladi?", options: ["das Doppelzimmer", "das Einzelzimmer", "das Mehrbettzimmer", "die Suite"], answer: 1, explanation: "'das Einzelzimmer' = bir kishilik xona." },
                        { q: "'Band qilish' (rezervatsiya) fe'li nima?", options: ["kaufen", "mieten", "buchen", "zahlen"], answer: 2, explanation: "'buchen' = band/rezervatsiya qilmoq." },
                        { q: "Poezdning jo'nash vaqti nima deyiladi?", options: ["die Ankunft", "die Abfahrt", "die Verspätung", "der Fahrplan"], answer: 1, explanation: "'die Abfahrt' = jo'nash. 'die Ankunft' = yetib kelish." },
                        { q: "Gapni to'ldiring: 'Ich möchte ein Zimmer für drei ___ buchen.'", options: ["Nachts", "Nächte", "Nachten", "Nacht"], answer: 1, explanation: "'die Nacht' (tun) ko'pligi 'Nächte'." },
                        { q: "'der Flughafen' so'zining tarjimasi?", options: ["Vokzal", "Avtobus bekati", "Aeroport", "Port"], answer: 2, explanation: "'der Flughafen' = aeroport." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Sayohat",
                    type: "image",
                    questions: [
                        { q: "Bu narsa nima?", image: emojiImage("🧳"), imageAlt: "Chamadon", options: ["der Rucksack", "die Tasche", "der Koffer", "das Gepäck"], answer: 2, explanation: "'der Koffer' = chamadon." },
                        { q: "Bu hujjat nima deyiladi?", image: emojiImage("🛂"), imageAlt: "Pasport nazorati", options: ["das Ticket", "der Pass", "das Visum", "der Ausweis"], answer: 1, explanation: "'der Pass' yoki 'der Reisepass' = pasport." },
                        { q: "Bu transport qanday ataladi?", image: emojiImage("🚢"), imageAlt: "Kema", options: ["das Schiff", "das Boot", "der Zug", "das Flugzeug"], answer: 0, explanation: "'das Schiff' = kema." },
                        { q: "Bu bino nima?", image: emojiImage("🏨"), imageAlt: "Mehmonxona", options: ["das Haus", "das Restaurant", "das Hotel", "das Museum"], answer: 2, explanation: "'das Hotel' = mehmonxona." }
                    ]
                }
            ]
        }]
    },

    // ===== A2 — TO'PLAM 6 (Ish va kasb) =====
    a2_t6: {
        title: "A2 — 6-to'plam (Ish va kasb)",
        level: "A2",
        testNo: 6,
        parts: [{
            partNum: 1,
            name: "A2 — 6-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝 Ish izlash va suhbat",
                    type: "text",
                    questions: [
                        { q: "Rezyume (tarjimai hol) nima deyiladi?", options: ["das Zeugnis", "die Bewerbung", "der Lebenslauf", "das Foto"], answer: 2, explanation: "'der Lebenslauf' = rezyume (CV)." },
                        { q: "Ishga kirish uchun yozilgan ariza?", options: ["die Kündigung", "die Bewerbung", "der Vertrag", "der Beruf"], answer: 1, explanation: "'die Bewerbung' = ariza (ishga topshirish uchun)." },
                        { q: "Gapni to'ldiring: 'Ich arbeite ___ Lehrer.'", options: ["als", "für", "bei", "mit"], answer: 0, explanation: "Kasb haqida gapirganda 'als' ishlatiladi: 'Ich arbeite als Lehrer'." },
                        { q: "'der Vorstellungsgespräch' nima?", options: ["ish vaqti", "ish haqi", "suhbat (ishga kirishda)", "ta'til"], answer: 2, explanation: "'das Vorstellungsgespräch' = suhbat (intervyu)." },
                        { q: "Hamkasb qanday ataladi?", options: ["der Chef", "der Kollege", "der Mitarbeiter", "der Kunde"], answer: 1, explanation: "'der Kollege' = hamkasb." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Kasblar",
                    type: "image",
                    questions: [
                        { q: "Bu kasb egasi nima deyiladi?", image: emojiImage("👨‍🍳"), imageAlt: "Oshpaz", options: ["der Bäcker", "der Kellner", "der Koch", "der Metzger"], answer: 2, explanation: "'der Koch' = oshpaz." },
                        { q: "Bu joy nima?", image: emojiImage("🏢"), imageAlt: "Ofis binosi", options: ["die Fabrik", "das Büro", "das Geschäft", "die Werkstatt"], answer: 1, explanation: "'das Büro' = ofis/idora." },
                        { q: "Bu kasb nima?", image: emojiImage("👨‍🏫"), imageAlt: "O'qituvchi", options: ["der Professor", "der Lehrer", "der Schüler", "der Student"], answer: 1, explanation: "'der Lehrer' = o'qituvchi." },
                        { q: "Bu narsa qanday ataladi?", image: emojiImage("💶"), imageAlt: "Pul/Maosh", options: ["das Gehalt", "die Steuern", "der Preis", "die Rechnung"], answer: 0, explanation: "'das Gehalt' = maosh/oylik." }
                    ]
                }
            ]
        }]
    },

    // ===== A2 — TO'PLAM 7 (Xarid va narxlar) =====
    a2_t7: {
        title: "A2 — 7-to'plam (Xarid)",
        level: "A2",
        testNo: 7,
        parts: [{
            partNum: 1,
            name: "A2 — 7-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝 Do'kon va narxlar",
                    type: "text",
                    questions: [
                        { q: "Naqd pul orqali to'lash nima deyiladi?", options: ["mit Karte zahlen", "bar zahlen", "kostenlos", "überweisen"], answer: 1, explanation: "'bar zahlen' = naqd pul bilan to'lash." },
                        { q: "Chegirma/Maxsus taklif qanday ataladi?", options: ["das Angebot", "der Preis", "die Kasse", "der Kunde"], answer: 0, explanation: "'das Angebot' = maxsus taklif/chegirma (Sonderangebot)." },
                        { q: "Kiyimning o'lchami nima deyiladi?", options: ["die Farbe", "das Gewicht", "die Größe", "die Länge"], answer: 2, explanation: "'die Größe' = o'lcham (razmer)." },
                        { q: "Gapni to'ldiring: 'Wo ist die ___? Ich möchte bezahlen.'", options: ["Tür", "Kasse", "Tasche", "Karte"], answer: 1, explanation: "'die Kasse' = kassa." },
                        { q: "'Juda qimmat' qanday aytiladi?", options: ["zu billig", "zu teuer", "sehr günstig", "kostenlos"], answer: 1, explanation: "'zu teuer' = juda qimmat." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Savdo",
                    type: "image",
                    questions: [
                        { q: "Bu bino nima?", image: emojiImage("🛒"), imageAlt: "Savdo aravachasi", options: ["der Einkaufswagen", "der Korb", "die Tüte", "die Tasche"], answer: 0, explanation: "'der Einkaufswagen' = savdo aravachasi." },
                        { q: "Bu buyum qanday ataladi?", image: emojiImage("💳"), imageAlt: "Kredit karta", options: ["das Bargeld", "die Quittung", "die Kreditkarte", "die Rechnung"], answer: 2, explanation: "'die Kreditkarte' = kredit karta." },
                        { q: "Bu hujjat nima?", image: emojiImage("🧾"), imageAlt: "Kvitansiya", options: ["das Geld", "die Kasse", "die Quittung", "der Preis"], answer: 2, explanation: "'die Quittung' yoki 'der Kassenbon' = chek/kvitansiya." },
                        { q: "Bu meva nima deyiladi?", image: emojiImage("🍇"), imageAlt: "Uzum", options: ["die Erdbeere", "die Traube", "der Apfel", "die Orange"], answer: 1, explanation: "'die Traube' = uzum." }
                    ]
                }
            ]
        }]
    },
    // ===== B1 — TO'PLAM 4 (Plusquamperfekt va vaqt ifodalari) =====
    b1_t4: {
        title: "B1 — 4-to'plam (Vaqt ifodalari)",
        level: "B1",
        testNo: 4,
        parts: [{
            partNum: 1,
            name: "B1 — 4-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝 Plusquamperfekt va vaqt",
                    type: "text",
                    questions: [
                        { q: "Plusquamperfekt: 'Nachdem ich ___, ging ich schlafen.'", options: ["gegessen habe", "gegessen hatte", "aß", "essen"], answer: 1, explanation: "Plusquamperfekt o'tgan zamondagi oldingi harakatni bildiradi: 'Nachdem ich gegessen hatte' (Yeb bo'lganimdan so'ng)." },
                        { q: "'bevor' so'zidan keyin fe'l qayerda joylashadi?", options: ["Ikkinchi o'rinda", "Boshida", "Gapning oxirida", "Uchinchi o'rinda"], answer: 2, explanation: "'bevor' ergash gap yasaydi, shuning uchun fe'l oxirida keladi." },
                        { q: "Gapni to'ldiring: '___ ich ein Kind war, spielte ich oft draußen.'", options: ["Wann", "Als", "Wenn", "Bevor"], answer: 1, explanation: "O'tgan zamonda bir marta sodir bo'lgan voqea uchun 'als' ishlatiladi." },
                        { q: "Plusquamperfekt qaysi yordamchi fe'llar bilan yasaladi?", options: ["haben / sein", "werden / sein", "hatten / waren", "haben / werden"], answer: 2, explanation: "Präteritumdagi 'haben' (hatte) yoki 'sein' (war) va Partizip II." },
                        { q: "Vaqt bog'lovchisi: '___ er lernt, hört er Musik.' (Davomida)", options: ["Nachdem", "Während", "Bevor", "Bis"], answer: 1, explanation: "'Während' = davomida (bir vaqtda sodir bo'layotgan harakatlar)." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Harakatlar",
                    type: "image",
                    questions: [
                        { q: "Ushbu holat qaysi fe'lni bildiradi?", image: emojiImage("🏃‍♂️💨"), imageAlt: "Yugurish", options: ["laufen", "schlafen", "lesen", "schreiben"], answer: 0, explanation: "'laufen' = yugurmoq." },
                        { q: "Bu asbob vaqtni o'lchaydi. Nima u?", image: emojiImage("⏳"), imageAlt: "Qum soat", options: ["die Uhr", "die Sanduhr", "der Wecker", "die Zeit"], answer: 1, explanation: "'die Sanduhr' = qum soat." },
                        { q: "Ushbu tushuncha qanday ataladi?", image: emojiImage("📅"), imageAlt: "Kalendar", options: ["der Kalender", "das Datum", "der Termin", "die Woche"], answer: 0, explanation: "'der Kalender' = kalendar." },
                        { q: "Bu narsa qanday ataladi?", image: emojiImage("⏰"), imageAlt: "Budilnik", options: ["die Uhr", "der Wecker", "die Zeit", "der Morgen"], answer: 1, explanation: "'der Wecker' = budilnik." }
                    ]
                }
            ]
        }]
    },

    // ===== B1 — TO'PLAM 5 (N-deklination va murakkab otlar) =====
    b1_t5: {
        title: "B1 — 5-to'plam (Otlar turlanishi)",
        level: "B1",
        testNo: 5,
        parts: [{
            partNum: 1,
            name: "B1 — 5-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝 N-Deklination va qo'shma otlar",
                    type: "text",
                    questions: [
                        { q: "N-Deklination: 'Ich kenne den ___ nicht.'", options: ["Herr", "Herrn", "Herren", "Herrs"], answer: 1, explanation: "'der Herr' N-deklinationga kiradi va Akkusativda 'den Herrn' bo'ladi." },
                        { q: "Gapni to'ldiring: 'Er hilft dem ___.' (talaba)", options: ["Student", "Studenten", "Studentem", "Students"], answer: 1, explanation: "'der Student' N-deklinationga kiradi, Dativda 'dem Studenten'." },
                        { q: "Qaysi ot N-Deklinationga KIRMMAYDI?", options: ["der Junge", "der Name", "der Vater", "der Polizist"], answer: 2, explanation: "'der Vater' odatiy turlanadi. Boshqalari N-Deklination (dem Jungen, dem Namen, dem Polizisten)." },
                        { q: "Murakkab ot: 'der Tisch' + 'das Bein' = ?", options: ["das Tischbein", "der Tischbein", "die Tischbein", "das Beintisch"], answer: 0, explanation: "Asosiy so'z oxirgisidir (das Bein), shuning uchun artikli 'das' bo'ladi." },
                        { q: "Murakkab ot qanday yasaladi: 'die Schule' + 'das Buch'?", options: ["die Schulebuch", "das Schulbuch", "der Schulbuch", "das Buchschule"], answer: 1, explanation: "'das Schulbuch' = maktab kitobi. 'e' tushib qoladi." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Murakkab so'zlar",
                    type: "image",
                    questions: [
                        { q: "Bu transport qanday ataladi? (die Straße + die Bahn)", image: emojiImage("🚋"), imageAlt: "Tramvay", options: ["die Straßenbahn", "der Straßenzug", "das Straßenauto", "der Bahnstraße"], answer: 0, explanation: "'die Straßenbahn' = tramvay." },
                        { q: "Bu kishi kim? (N-Deklination)", image: emojiImage("👮"), imageAlt: "Politsiyachi", options: ["der Polizei", "der Polizist", "die Polizei", "das Polizei"], answer: 1, explanation: "'der Polizist' = politsiyachi (N-Deklination)." },
                        { q: "Bu narsa qanday ataladi? (der Apfel + der Baum)", image: emojiImage("🍎🌳"), imageAlt: "Olma daraxti", options: ["der Baumapfel", "der Apfelbaum", "die Apfelbaum", "das Apfelbaum"], answer: 1, explanation: "'der Apfelbaum' = olma daraxti." },
                        { q: "Bu buyum nima? (der Wein + das Glas)", image: emojiImage("🍷"), imageAlt: "Vino bokali", options: ["das Glaswein", "das Weinglas", "der Weinglas", "die Weinglas"], answer: 1, explanation: "'das Weinglas' = vino qadahi." }
                    ]
                }
            ]
        }]
    },

    // ===== B1 — TO'PLAM 6 (Sifatdoshlar) =====
    b1_t6: {
        title: "B1 — 6-to'plam (Sifatdoshlar)",
        level: "B1",
        testNo: 6,
        parts: [{
            partNum: 1,
            name: "B1 — 6-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝 Partizip I va II",
                    type: "text",
                    questions: [
                        { q: "Partizip I qanday yasaladi?", options: ["Fe'l + t", "Fe'l + d", "ge + fe'l + t", "ge + fe'l + en"], answer: 1, explanation: "Partizip I fe'lning oxiriga 'd' qo'shish orqali yasaladi: spielend, lachend." },
                        { q: "'O'ynayotgan bola' qanday aytiladi?", options: ["das gespielt Kind", "das spielen Kind", "das spielende Kind", "das gespielte Kind"], answer: 2, explanation: "Partizip I (spielend) sifat kabi turlanadi: das spielende Kind." },
                        { q: "'Yozilgan xat' qanday aytiladi?", options: ["der schreibende Brief", "der geschriebene Brief", "der geschrieben Brief", "der schreibte Brief"], answer: 1, explanation: "Partizip II (geschrieben) sifat kabi turlanadi: der geschriebene Brief." },
                        { q: "Gapni to'ldiring: 'Die ___ Frau stieg in den Bus.' (kulayotgan)", options: ["lachende", "gelachte", "lachend", "gelachende"], answer: 0, explanation: "Partizip I: lachend + e (Nominativ, die Frau)." },
                        { q: "Partizip II sifat sifatida qaysi ma'noni beradi?", options: ["Faol va davom etayotgan", "Passiv yoki tugallangan", "Kelajakda bo'ladigan", "Majburiy"], answer: 1, explanation: "Partizip II odatda tugallangan yoki passiv harakatni bildiradi (masalan: das gekaufte Auto)." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Holatlar",
                    type: "image",
                    questions: [
                        { q: "Qaynayotgan suv qanday aytiladi?", image: emojiImage("끓"), imageAlt: "Qaynayotgan suv", options: ["das gekochte Wasser", "das kochende Wasser", "das kochen Wasser", "das gekocht Wasser"], answer: 1, explanation: "Davom etayotgan harakat: Partizip I (kochend) -> das kochende Wasser." },
                        { q: "Yopilgan eshik qanday aytiladi?", image: emojiImage("🚪🔒"), imageAlt: "Yopiq eshik", options: ["die schließende Tür", "die geschlossene Tür", "die schließend Tür", "die geschlossen Tür"], answer: 1, explanation: "Tugallangan harakat: Partizip II (geschlossen) -> die geschlossene Tür." },
                        { q: "O'qiyotgan talaba qanday aytiladi?", image: emojiImage("📖👨‍🎓"), imageAlt: "Talaba", options: ["der lesende Student", "der gelesene Student", "der lesend Student", "der gelesen Student"], answer: 0, explanation: "Faol harakat: Partizip I (lesend) -> der lesende Student." },
                        { q: "O'g'irlangan mashina qanday aytiladi?", image: emojiImage("🚗💨"), imageAlt: "Mashina", options: ["das stehlende Auto", "das gestohlene Auto", "das gestohlen Auto", "das stehlend Auto"], answer: 1, explanation: "Passiv/tugallangan: Partizip II (gestohlen) -> das gestohlene Auto." }
                    ]
                }
            ]
        }]
    },

    // ===== B1 — TO'PLAM 7 (Media, texnologiya va jamiyat) =====
    b1_t7: {
        title: "B1 — 7-to'plam (Texnologiya va jamiyat)",
        level: "B1",
        testNo: 7,
        parts: [{
            partNum: 1,
            name: "B1 — 7-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝 Zamonaviy leksika",
                    type: "text",
                    questions: [
                        { q: "'Atrof-muhit' nemis tilida nima deyiladi?", options: ["die Natur", "die Umwelt", "die Gesellschaft", "die Wirtschaft"], answer: 1, explanation: "'die Umwelt' = atrof-muhit." },
                        { q: "Faylni yuklab olish qanday ataladi?", options: ["hochladen", "herunterladen", "speichern", "löschen"], answer: 1, explanation: "'herunterladen' = download (yuklab olish)." },
                        { q: "'Iqlim o'zgarishi' tushunchasining tarjimasi nima?", options: ["der Umweltschutz", "der Klimawandel", "die Verschmutzung", "das Wetter"], answer: 1, explanation: "'der Klimawandel' = iqlim o'zgarishi." },
                        { q: "Gapni to'ldiring: 'Ich muss mein Passwort ___.'", options: ["eingeben", "drücken", "anschalten", "ausdrucken"], answer: 0, explanation: "'das Passwort eingeben' = parolni kiritmoq." },
                        { q: "Ijtimoiy tarmoqlar qanday ataladi?", options: ["die sozialen Netzwerke", "das Internet", "die Zeitungen", "die Medien"], answer: 0, explanation: "'die sozialen Netzwerke' = ijtimoiy tarmoqlar." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Texnologiya",
                    type: "image",
                    questions: [
                        { q: "Bu qurilma nima?", image: emojiImage("🖨️"), imageAlt: "Printer", options: ["der Bildschirm", "der Drucker", "die Tastatur", "die Maus"], answer: 1, explanation: "'der Drucker' = printer." },
                        { q: "Bu jarayon nima?", image: emojiImage("🔋"), imageAlt: "Batareya", options: ["der Akku", "der Stecker", "das Kabel", "die Steckdose"], answer: 0, explanation: "'der Akku' (Akkumulator) = batareya." },
                        { q: "Bu narsa qanday ataladi?", image: emojiImage("⌨️"), imageAlt: "Klaviatura", options: ["die Maus", "der Monitor", "die Tastatur", "der Kopfhörer"], answer: 2, explanation: "'die Tastatur' = klaviatura." },
                        { q: "Bu global muammo nima?", image: emojiImage("🌍🔥"), imageAlt: "Global isish", options: ["der Naturschutz", "die Erderwärmung", "das Recycling", "die Mülltrennung"], answer: 1, explanation: "'die Erderwärmung' = global isish." }
                    ]
                }
            ]
        }]
    },
    // ===== B2 — TO'PLAM 1 (Konjunktiv I va bilvosita nutq) =====
    b2_t1: {
        title: "B2 — 1-to'plam (Bilvosita nutq)",
        level: "B2",
        testNo: 1,
        parts: [{
            partNum: 1,
            name: "B2 — 1-to'plam",
            icon: "🏔️",
            sections: [
                {
                    name: "📝 Konjunktiv I",
                    type: "text",
                    questions: [
                        { q: "Bilvosita nutq: Er sagt, er ___ keine Zeit. (Präsens)", options: ["hatte", "habe", "hätte", "hat"], answer: 1, explanation: "'haben' fe'lining Konjunktiv I shakli (3-shaxs birlikda): er habe." },
                        { q: "Bilvosita nutq (sein): Sie behauptet, sie ___ krank.", options: ["sei", "wäre", "ist", "war"], answer: 0, explanation: "'sein' fe'lining Konjunktiv I shakli (3-shaxs birlikda): sie sei." },
                        { q: "O'zlashtirma gap: Der Reporter berichtet, das Konzert ___ ein voller Erfolg gewesen.", options: ["ist", "sei", "wäre", "war"], answer: 1, explanation: "O'tgan zamon Konjunktiv I: sei + Partizip II (sei gewesen)." },
                        { q: "Qaysi holatda Konjunktiv II (wäre/hätte) Konjunktiv I o'rnida ishlatiladi?", options: ["Gazeta matnlarida doim", "Konjunktiv I shakli Indikativ bilan bir xil bo'lib qolsa", "Faqat o'tgan zamonda", "Faqat og'zaki nutqda"], answer: 1, explanation: "Agar Konjunktiv I shakli oddiy (Indikativ) shakl bilan mos kelsa (masalan 'sie haben'), chalkashmaslik uchun Konjunktiv II ('sie hätten') ishlatiladi." },
                        { q: "Bilvosita savol: Er fragt, ob wir morgen ___.", options: ["kommen", "kämen", "kommen werden", "kommen würden"], answer: 0, explanation: "Bu yerda oddiy Indikativ yoki Konjunktiv ishlatilishi mumkin, 'kommen' (1-shaxs ko'plik) o'rniga ko'pincha 'kämen' (Konj. II) ham bo'lishi mumkin, lekin eng to'g'risi qoidaga ko'ra bu yerda Konj I 'kommen' Indikativga o'xshash bo'lgani uchun." },
                        { q: "Bilvosita nutq (werden): Die Zeitung schreibt, die Preise ___ steigen.", options: ["werden", "würden", "wurden", "werdet"], answer: 0, explanation: "'die Preise' ko'plik, Konjunktiv I 'werden'. Indikativ bilan bir xil bo'lgani uchun 'würden' ham qabul qilinadi, lekin 'werden' asosiy shakl." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Jurnalistika",
                    type: "image",
                    questions: [
                        { q: "Bu kasb egasi bilvosita nutqdan ko'p foydalanadi. U kim?", image: emojiImage("🎤"), imageAlt: "Jurnalist/Muxbir", options: ["der Lehrer", "der Reporter", "der Arzt", "der Verkäufer"], answer: 1, explanation: "Reporter/Journalist xabarlar berishda (Berichterstattung) Konjunktiv I dan ko'p foydalanadi." },
                        { q: "Bu hujjat turida qaysi grammatika ko'p uchraydi?", image: emojiImage("📰"), imageAlt: "Gazeta", options: ["Faqat Präteritum", "Indirekte Rede (Konjunktiv I)", "Imperativ", "Faqat Perfekt"], answer: 1, explanation: "Gazeta va xabarlarda bilvosita nutq (Indirekte Rede) juda ko'p uchraydi." }
                    ]
                }
            ]
        }]
    },

    // ===== B2 — TO'PLAM 2 (Murakkab gap tuzilmalari) =====
    b2_t2: {
        title: "B2 — 2-to'plam (Murakkab gaplar)",
        level: "B2",
        testNo: 2,
        parts: [{
            partNum: 1,
            name: "B2 — 2-to'plam",
            icon: "🏔️",
            sections: [
                {
                    name: "📝 Qo'sh bog'lovchilar",
                    type: "text",
                    questions: [
                        { q: "Gapni to'ldiring: '___ mehr er trainiert, ___ besser wird er.'", options: ["Je / desto", "Wenn / dann", "Als / so", "Sowohl / als auch"], answer: 0, explanation: "'Je + Komparativ ..., desto + Komparativ ...' = Qancha ..., shuncha ..." },
                        { q: "'U nafaqat aqlli, balki mehnatkash ham' tarjimasi?", options: ["Er ist sowohl klug als auch fleißig.", "Er ist nicht nur klug, sondern auch fleißig.", "Er ist weder klug noch fleißig.", "Er ist entweder klug oder fleißig."], answer: 1, explanation: "'nicht nur ... sondern auch' = nafaqat ... balki ... ham." },
                        { q: "'Sowohl ... als auch ...' qanday ma'no beradi?", options: ["Yoki ... yoki ...", "Ham ... ham ...", "Na ... na ...", "Agar ... bo'lsa"], answer: 1, explanation: "'Sowohl ... als auch' = Ham ... ham (ikkalasi ham)." },
                        { q: "Infinitive konstruksiya: 'Er ging an mir vorbei, ___ ein Wort zu sagen.' (Indamasdan)", options: ["um", "anstatt", "ohne", "durch"], answer: 2, explanation: "'ohne ... zu' = biror narsa qilmasdan." },
                        { q: "Gapni to'ldiring: 'Ich trinke ___ Kaffee ___ Tee. Ich mag nur Wasser.'", options: ["entweder / oder", "sowohl / als auch", "weder / noch", "nicht nur / sondern auch"], answer: 2, explanation: "'weder ... noch' = na ... na ... (inkor)." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Mantiq",
                    type: "image",
                    questions: [
                        { q: "Qaysi bog'lovchi bu belgiga (⚖️ - ikkisi ham teng) mos keladi?", image: emojiImage("⚖️"), imageAlt: "Tarozi", options: ["entweder ... oder", "sowohl ... als auch", "weder ... noch", "zwar ... aber"], answer: 1, explanation: "'sowohl ... als auch' ikkala tomonni ham teng o'z ichiga oladi." },
                        { q: "Qaysi bog'lovchi ushbu holatni bildiradi (❌ va ❌)?", image: emojiImage("🚫"), imageAlt: "Inkor", options: ["je ... desto", "sowohl ... als auch", "weder ... noch", "nicht nur ... sondern auch"], answer: 2, explanation: "'weder ... noch' ikkala narsani ham inkor qiladi." }
                    ]
                }
            ]
        }]
    },

    // ===== B2 — TO'PLAM 3 (Akademik so'z boyligi) =====
    b2_t3: {
        title: "B2 — 3-to'plam (Akademik tushunchalar)",
        level: "B2",
        testNo: 3,
        parts: [{
            partNum: 1,
            name: "B2 — 3-to'plam",
            icon: "🏔️",
            sections: [
                {
                    name: "📝 Funktionsverbgefüge va matn",
                    type: "text",
                    questions: [
                        { q: "'Eine Entscheidung treffen' qaysi fe'l bilan bir xil ma'noda?", options: ["treffen", "entscheiden", "sagen", "machen"], answer: 1, explanation: "Funktionsverbgefüge: 'eine Entscheidung treffen' = sich entscheiden (qaror qabul qilmoq)." },
                        { q: "'Zur Verfügung stehen' nima degani?", options: ["mavjud bo'lmoq / foydalanishga tayyor", "tik turmoq", "tushunmoq", "rad etmoq"], answer: 0, explanation: "'zur Verfügung stehen' = mavjud bo'lmoq." },
                        { q: "Nominalizatsiya: 'Weil es stark regnete' -> '___ starken Regens'.", options: ["Trotz", "Wegen des", "Während", "Aufgrund von"], answer: 1, explanation: "'Wegen' yoki 'Aufgrund' + Genitiv: Wegen des starken Regens." },
                        { q: "'Einfluss nehmen auf' nima degani?", options: ["beeinflussen", "fließen", "beenden", "anfangen"], answer: 0, explanation: "'Einfluss nehmen auf' = beeinflussen (ta'sir o'tkazmoq)." },
                        { q: "'Maßnahmen ergreifen' tarjimasi nima?", options: ["chora ko'rmoq", "o'lchamoq", "tushunmoq", "xato qilmoq"], answer: 0, explanation: "'Maßnahmen ergreifen' = choralar ko'rmoq." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Ilm-fan",
                    type: "image",
                    questions: [
                        { q: "Bu joy qanday ataladi?", image: emojiImage("🎓"), imageAlt: "Universitet", options: ["die Schule", "der Kindergarten", "die Universität", "das Büro"], answer: 2, explanation: "die Universität / die Hochschule = oliygoh." },
                        { q: "Bu matn turi qanday ataladi?", image: emojiImage("📊"), imageAlt: "Statistika / Grafik", options: ["die Statistik", "das Bild", "der Brief", "die Erzählung"], answer: 0, explanation: "die Statistik = statistika / grafik ma'lumotlar." }
                    ]
                }
            ]
        }]
    },

    // ===== B2 — TO'PLAM 4 (Idiomalar va madaniyat) =====
    b2_t4: {
        title: "B2 — 4-to'plam (Idiomalar va madaniyat)",
        level: "B2",
        testNo: 4,
        parts: [{
            partNum: 1,
            name: "B2 — 4-to'plam",
            icon: "🏔️",
            sections: [
                {
                    name: "📝 Iboralar (Redewendungen)",
                    type: "text",
                    questions: [
                        { q: "'Ich drücke dir die Daumen' qanday ma'noni beradi?", options: ["Men seni yomon ko'raman", "Senga omad tilayman", "Barmoqlarim og'riyapti", "Vaqtim yo'q"], answer: 1, explanation: "'Jemandem die Daumen drücken' = kimgadir omad tilash." },
                        { q: "'Ins Fettnäpfchen treten' iborasi qaysi vaziyatda ishlatiladi?", options: ["Muvaffaqiyatga erishganda", "Xatoga yo'l qo'yib, noqulay ahvolga tushganda", "Yangi poyabzal sotib olganda", "Ovqat pishirayotganda"], answer: 1, explanation: "Beparvolik tufayli xato gapirib qo'yish yoki noqulay vaziyatni keltirib chiqarish." },
                        { q: "'Auf Wolke sieben schweben' iborasi nimani anglatadi?", options: ["Samolyotda uchish", "Juda baxtli bo'lish (ayniqsa sevgida)", "Havo bulutli bo'lishi", "Tush ko'rish"], answer: 1, explanation: "Juda baxtiyor bo'lish, osmonning yettinchi qavatida his qilish." },
                        { q: "Germaniyaning asosiy qonuni nima deb ataladi?", options: ["Die Verfassung", "Das Grundgesetz", "Das Gesetzbuch", "Die Regeln"], answer: 1, explanation: "Germaniya konstitutsiyasi 'Das Grundgesetz' deb ataladi." },
                        { q: "Germaniyada nechta federal o'lka (Bundesland) bor?", options: ["12", "14", "16", "18"], answer: 2, explanation: "Germaniyada 16 ta federal o'lka (Bundesland) mavjud." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — Madaniyat",
                    type: "image",
                    questions: [
                        { q: "Bu transport vositasi Germaniyada juda mashhur va ekologik toza. U nima?", image: emojiImage("🚲"), imageAlt: "Velosiped", options: ["das Moped", "das Fahrrad", "das Auto", "der Bus"], answer: 1, explanation: "Fahrrad (velosiped) Germaniyada juda keng tarqalgan transport vositasi." },
                        { q: "Germaniyada har yili o'tkaziladigan eng katta xalq bayrami (fest) qaysi?", image: emojiImage("🥨🍻"), imageAlt: "Pivo va Pretzel", options: ["Karneval", "Weihnachten", "Oktoberfest", "Ostern"], answer: 2, explanation: "Myunxendagi Oktoberfest dunyodagi eng katta xalq sayillaridan biridir." },
                        { q: "Berlin shahrining ramzi hisoblangan hayvon qaysi?", image: emojiImage("🐻"), imageAlt: "Ayiq", options: ["der Wolf", "der Bär", "der Adler", "der Löwe"], answer: 1, explanation: "Berlin gerbida ayiq (der Berliner Bär) tasvirlangan." }
                    ]
                }
            ]
        }]
    },

    // YUKLASH UCHUN QO'SHILGAN YANGI TESTLAR (15 ta to'plam)
    
    // A1 YANGI TESTLAR
    a1_t8: { title: "A1 — 8-to'plam (Kasblar va ish)", level: "A1", testNo: 8, parts: [{ partNum: 1, name: "A1 — 8-to'plam", icon: "🌱", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    a1_t9: { title: "A1 — 9-to'plam (Oila va bayramlar)", level: "A1", testNo: 9, parts: [{ partNum: 1, name: "A1 — 9-to'plam", icon: "🌱", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    a1_t10: { title: "A1 — 10-to'plam (Umumiy takrorlash)", level: "A1", testNo: 10, parts: [{ partNum: 1, name: "A1 — 10-to'plam", icon: "🌱", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },

    // A2 YANGI TESTLAR
    a2_t8: { title: "A2 — 8-to'plam (Xobbi va bo'sh vaqt)", level: "A2", testNo: 8, parts: [{ partNum: 1, name: "A2 — 8-to'plam", icon: "🌿", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    a2_t9: { title: "A2 — 9-to'plam (Madaniyat va odatlar)", level: "A2", testNo: 9, parts: [{ partNum: 1, name: "A2 — 9-to'plam", icon: "🌿", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    a2_t10: { title: "A2 — 10-to'plam (Murakkab mashqlar)", level: "A2", testNo: 10, parts: [{ partNum: 1, name: "A2 — 10-to'plam", icon: "🌿", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },

    // B1 YANGI TESTLAR
    b1_t8: { title: "B1 — 8-to'plam (Atrof-muhit va tabiat)", level: "B1", testNo: 8, parts: [{ partNum: 1, name: "B1 — 8-to'plam", icon: "🌳", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    b1_t9: { title: "B1 — 9-to'plam (Karyera va muvaffaqiyat)", level: "B1", testNo: 9, parts: [{ partNum: 1, name: "B1 — 9-to'plam", icon: "🌳", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    b1_t10: { title: "B1 — 10-to'plam (B1 imtihoniga tayyorgarlik)", level: "B1", testNo: 10, parts: [{ partNum: 1, name: "B1 — 10-to'plam", icon: "🌳", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },

    // B2 YANGI TESTLAR
    b2_t5: { title: "B2 — 5-to'plam (Ilm-fan va kashfiyotlar)", level: "B2", testNo: 5, parts: [{ partNum: 1, name: "B2 — 5-to'plam", icon: "🏔️", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    b2_t6: { title: "B2 — 6-to'plam (Iqtisodiyot va bozor)", level: "B2", testNo: 6, parts: [{ partNum: 1, name: "B2 — 6-to'plam", icon: "🏔️", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    b2_t7: { title: "B2 — 7-to'plam (Adabiyot va san'at)", level: "B2", testNo: 7, parts: [{ partNum: 1, name: "B2 — 7-to'plam", icon: "🏔️", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    b2_t8: { title: "B2 — 8-to'plam (Siyosat va huquq)", level: "B2", testNo: 8, parts: [{ partNum: 1, name: "B2 — 8-to'plam", icon: "🏔️", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    b2_t9: { title: "B2 — 9-to'plam (Psixologiya va munosabatlar)", level: "B2", testNo: 9, parts: [{ partNum: 1, name: "B2 — 9-to'plam", icon: "🏔️", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] },
    b2_t10: { title: "B2 — 10-to'plam (B2 daraja testlari)", level: "B2", testNo: 10, parts: [{ partNum: 1, name: "B2 — 10-to'plam", icon: "🏔️", sections: [{ name: "📝 Matnli savollar", type: "text", questions: [{ q: "1-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "2-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "3-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "4-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "5-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "6-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }, { q: "7-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 2, explanation: "" }, { q: "8-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 3, explanation: "" }, { q: "9-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 0, explanation: "" }, { q: "10-savol. Yangi test tez kunda yangilanadi.", options: ["A", "B", "C", "D"], answer: 1, explanation: "" }] }] }] }
};
