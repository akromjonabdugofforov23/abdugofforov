export const deutschTests = {

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
                    name: "📝 Salomlashish va asosiy iboralar",
                    type: "text",
                    questions: [
                        { q: "'Wie geht es Ihnen?' savoliga to'g'ri javob qaysi?", options: ["Ich heiße Akrom.", "Mir geht es gut, danke.", "Ich komme aus Usbekistan.", "Ich bin 25 Jahre alt."], answer: 1, explanation: "'Mir geht es gut, danke' = Yaxshi, rahmat. Wie geht es Ihnen? = Qandaysiz? (rasmiy)." },
                        { q: "Kechqurun xayrlashishda qaysi ibora to'g'ri?", options: ["Guten Morgen!", "Guten Tag!", "Guten Abend!", "Auf Wiedersehen!"], answer: 3, explanation: "'Auf Wiedersehen!' = Ko'rishguncha/Xayr. Boshqalari salomlashish iboralari." },
                        { q: "Qaysi gapda artikel to'g'ri ishlatilgan?", options: ["Der Buch ist neu.", "Die Mann ist groß.", "Das Auto ist schnell.", "Ein Frau singt."], answer: 2, explanation: "'das Auto' to'g'ri. das Buch, der Mann, die Frau." }
                    ]
                },
                {
                    name: "🖼️ Rasmli savollar",
                    type: "image",
                    questions: [
                        { q: "Bu mevaning nemischa nomi?", image: emojiImage("🍎"), imageAlt: "Olma", options: ["die Banane", "der Apfel", "die Orange", "die Traube"], answer: 1, explanation: "'der Apfel' = olma. die Banane = banan, die Orange = apelsin." },
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏥"), imageAlt: "Shifoxona", options: ["die Schule", "das Hotel", "das Krankenhaus", "die Bank"], answer: 2, explanation: "'das Krankenhaus' = shifoxona. Krank=kasal + Haus=uy." }
                    ]
                },
                {
                    name: "🔊 Eshitish (Hören)",
                    type: "audio",
                    questions: [
                        { q: "Ovozni eshiting — tarjimasini toping:", audio: "arbeiten", audioLang: "de-DE", displayWord: "arbeiten", options: ["o'ynamoq", "ishlamoq", "o'qimoq", "yurmoq"], answer: 1, explanation: "'arbeiten' = ishlamoq. Ich arbeite = men ishlayman." },
                        { q: "Ovozni eshiting — tarjimasini toping:", audio: "Guten Morgen", audioLang: "de-DE", displayWord: "Guten Morgen", options: ["Xayrli kech", "Xayrli kun", "Xayrli tong", "Xayr"], answer: 2, explanation: "'Guten Morgen' = Xayrli tong. Morgen = ertalab." },
                        { q: "Ovozni eshiting — tarjimasini toping:", audio: "Wie heißen Sie", audioLang: "de-DE", displayWord: "Wie heißen Sie?", options: ["Qandaysiz?", "Qayerdansiz?", "Ismingiz nima?", "Necha yoshsiz?"], answer: 2, explanation: "'Wie heißen Sie?' = Ismingiz nima? (rasmiy)." }
                    ]
                },
                {
                    name: "📝 So'z va grammatika",
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
                    name: "📝 Ko'p tanlovli",
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
                    name: "🖼️ Rasmli — nemischa toping",
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
                    name: "📝 Ranglar, sanoq, oila",
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
                    name: "🖼️ Rasmli — so'z boyligi",
                    type: "image",
                    questions: [
                        { q: "Bu mevaning nemischa nomi?", image: emojiImage("🍌"), imageAlt: "Banan", options: ["die Banane", "der Apfel", "die Birne", "die Kirsche"], answer: 0, explanation: "'die Banane' = banan." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("📚"), imageAlt: "Kitob", options: ["das Heft", "das Buch", "der Stift", "der Tisch"], answer: 1, explanation: "'das Buch' = kitob. das Heft = daftar, der Stift = qalam." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("💧", "#dbe7f0"), imageAlt: "Suv", options: ["die Milch", "das Wasser", "der Saft", "der Tee"], answer: 1, explanation: "'das Wasser' = suv. die Milch = sut, der Tee = choy." },
                        { q: "Bu kasbning nemischa nomi?", image: emojiImage("👨‍⚕️"), imageAlt: "Shifokor", options: ["der Lehrer", "der Arzt", "der Koch", "der Polizist"], answer: 1, explanation: "'der Arzt' = shifokor. die Ärztin = ayol shifokor." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("⏰", "#f0e6db"), imageAlt: "Soat", options: ["die Uhr", "der Tag", "das Buch", "die Tür"], answer: 0, explanation: "'die Uhr' = soat. Wie spät ist es? = Soat necha bo'ldi?" }
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
                    name: "📝 Perfekt va modal fe'llar",
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
                    name: "🖼️ Rasmli — vaziyatlar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏥"), imageAlt: "Shifoxona", options: ["die Apotheke", "das Krankenhaus", "das Rathaus", "die Post"], answer: 1, explanation: "'das Krankenhaus' = shifoxona. die Apotheke = dorixona." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("💊"), imageAlt: "Tabletka", options: ["die Spritze", "die Tablette", "der Verband", "das Pflaster"], answer: 1, explanation: "'die Tablette' = tabletka." },
                        { q: "Ob-havoni nemischa qanday ifodalaymiz?", image: emojiImage("🌧️", "#dbe7f0"), imageAlt: "Yomg'ir", options: ["Es schneit.", "Es regnet.", "Es ist sonnig.", "Es ist windig."], answer: 1, explanation: "'Es regnet' = Yomg'ir yog'yapti." },
                        { q: "Bu kasbning nemischa nomi?", image: emojiImage("🧑‍🍳"), imageAlt: "Oshpaz", options: ["der Lehrer", "der Koch", "der Arzt", "der Fahrer"], answer: 1, explanation: "'der Koch' = oshpaz." },
                        { q: "'Es ist Viertel nach acht.' — soat nechada?", image: emojiImage("⏰", "#f0e6db"), imageAlt: "Soat", options: ["07:45", "08:15", "08:45", "08:30"], answer: 1, explanation: "'Viertel nach acht' = 08:15. nach = keyin." }
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
                    name: "📝 Predloglar va ajraladigan fe'llar",
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
                    name: "🖼️ Rasmli — kundalik hayot",
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
                    name: "📝 Bog'lovchilar va qiyosiy daraja",
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
                    name: "🖼️ Rasmli — joylar va hodisalar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏫"), imageAlt: "Maktab", options: ["die Universität", "die Schule", "der Kindergarten", "das Büro"], answer: 1, explanation: "'die Schule' = maktab." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("🚲"), imageAlt: "Velosiped", options: ["das Motorrad", "das Fahrrad", "der Roller", "das Skateboard"], answer: 1, explanation: "'das Fahrrad' = velosiped. fahren = yurmoq." },
                        { q: "Bu fasl nemischa qanday?", image: emojiImage("🍂", "#f4e4d4"), imageAlt: "Kuz", options: ["der Frühling", "der Sommer", "der Herbst", "der Winter"], answer: 2, explanation: "'der Herbst' = kuz. der Frühling = bahor, der Sommer = yoz, der Winter = qish." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("✏️"), imageAlt: "Qalam", options: ["das Buch", "der Stift", "das Heft", "der Tisch"], answer: 1, explanation: "'der Stift' = qalam. der Bleistift = oddiy qalam." }
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
                    name: "📝 Konjunktiv II va Passiv",
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
                    name: "🖼️ Rasmli — chuqurroq so'z boyligi",
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
                    name: "📝 Bog'lovchilar va nisbiy gaplar",
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
                    name: "🖼️ Rasmli — abstrakt tushunchalar",
                    type: "image",
                    questions: [
                        { q: "Bu tushunchaning nemischa nomi?", image: emojiImage("💼"), imageAlt: "Ish", options: ["der Beruf", "die Freizeit", "die Familie", "das Hobby"], answer: 0, explanation: "'der Beruf' = kasb. die Arbeit = ish." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("💰", "#f4e4d4"), imageAlt: "Pul", options: ["das Geld", "die Bank", "die Karte", "der Preis"], answer: 0, explanation: "'das Geld' = pul. das Bargeld = naqd pul." },
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
                    name: "📝 Genitiv va so'z boyligi",
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
                    name: "🖼️ Rasmli — murakkab so'zlar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏛️"), imageAlt: "Hokimiyat", options: ["das Rathaus", "die Kirche", "das Theater", "das Museum"], answer: 0, explanation: "'das Rathaus' = hokimiyat binosi. Rat = kengash + Haus = uy." },
                        { q: "Bu hujjatning nemischa nomi?", image: emojiImage("🛂"), imageAlt: "Pasport", options: ["der Pass", "der Brief", "der Ausweis", "die Karte"], answer: 0, explanation: "'der Pass' = pasport. der Personalausweis = shaxsiy guvohnoma." },
                        { q: "Bu jarayonning nemischa nomi?", image: emojiImage("🔬"), imageAlt: "Tadqiqot", options: ["die Forschung", "die Bildung", "die Erziehung", "die Lehre"], answer: 0, explanation: "'die Forschung' = tadqiqot. forschen = tadqiq qilmoq." }
                    ]
                }
            ]
        }]
    }
};

