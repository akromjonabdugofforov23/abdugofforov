// ===== HORROR DEUTSCH GAME DATA =====
// Har bir daraja uchun o'zining dahshatli ssenariysi va topishmoqlari

window.HorrorGamesData = {
    // -------------------------------------------------------------
    // 🌱 A1 Level: "Das Geisterschloss" (Ruhlar Qasri)
    // -------------------------------------------------------------
    a1: {
        id: 'a1',
        title: 'Das Geisterschloss',
        subtitle: 'Ruhlar Qasridan Qochish (A1 Boshlang\'ich)',
        icon: '🏰',
        badge: 'A1 - Boshlang\'ich',
        intro: 'Siz sirli va qorong\'u nemis qasrida uyg\'ondingiz. Qasrdan tirik chiqish uchun 5 ta qulflangan eshik parolini nemischa so\'zlar bilan topishingiz kerak!',
        rooms: [
            {
                roomName: '1-xona: Qasr Kirish Zali (Die Halle)',
                story: 'Qasrning og\'ir yog\'och eshigi zanjirlangan. Nemischa to\'g\'ri artiklni tanlab eshikni oching!',
                q: '"... Buch" (Kitob) so\'zining to\'g\'ri artikli qaysi?',
                options: ['der', 'die', 'das', 'den'],
                answer: 2,
                explanation: 'Nemis tilida kitob "das Buch" bo\'ladi.'
            },
            {
                roomName: '2-xona: Ko\'zgular Xonasi (Der Spiegel)',
                story: 'Ko\'zguda sirli yozuv ko\'rindi: "Guten Abend!" — bu nimani anglatadi?',
                q: '"Guten Abend!" iborasining ma\'nosi nima?',
                options: ['Xayrli kun', 'Xayrli kech', 'Xayrli tong', 'Xayrli tun'],
                answer: 1,
                explanation: 'Guten Abend = Xayrli kech.'
            },
            {
                roomName: '3-xona: Shamlar Xonasi (Die Kerzen)',
                story: 'Stolda 3 ta sham yonmoqda. Nemis tilida "3" raqami qanday aytiladi?',
                q: 'Nemis tilida "3" soni qaysi?',
                options: ['zwei', 'drei', 'vier', 'fünf'],
                answer: 1,
                explanation: 'drei = 3.'
            },
            {
                roomName: '4-xona: Maxfiy Kutubxona (Die Bibliothek)',
                story: 'Eskirgan kitobda yozilgan: "Ich ___ Deutsch." (Men nemis tilida gapiraman). Bo\'sh joyni to\'ldiring!',
                q: '"Ich ___ Deutsch." fe\'l shaklini toping:',
                options: ['spreche', 'sprichst', 'spricht', 'sprechen'],
                answer: 0,
                explanation: 'Ich (men) kishilik olmoshi bilan fe\'l "-e" qo\'shimchasini oladi: Ich spreche.'
            },
            {
                roomName: '5-xona: Qasrdan Chiqish Darvozasi (Das Tor)',
                story: 'Songgi darvoza paroli: Nemis tilida "Rahmat!" so\'zining to\'g\'ri shakli qaysi?',
                q: '"Rahmat" nemis tilida nima bo\'ladi?',
                options: ['Bitte', 'Danke', 'Entschuldigung', 'Hallo'],
                answer: 1,
                explanation: 'Danke = Rahmat!'
            }
        ]
    },

    // -------------------------------------------------------------
    // 🌿 A2 Level: "Der Dunkle Wald" (Qorong'u O'rmon)
    // -------------------------------------------------------------
    a2: {
        id: 'a2',
        title: 'Der Dunkle Wald',
        subtitle: 'Qorong\'u O\'rmon Omon Qolishi (A2 Asosiy)',
        icon: '🌲',
        badge: 'A2 - Asosiy',
        intro: 'Tungi Schwarzwald o\'rmonida adashib qoldingiz. Orqangizdan shubhali sharpalar kelmoqda. Modal fe\'llar va Perfekt zamoni topshiriqlarini yechib o\'rmondan qutuling!',
        rooms: [
            {
                roomName: '1-bosqich: Bo mezonlar Yo\'lagi',
                story: 'O\'rmon ichida harakatlanish uchun: "Ich ___ heute lernen." (Men bugun o\'rganishim kerak) bo\'sh joyni to\'ldiring.',
                q: 'Qaysi modal fe\'l to\'g\'ri kelsa keladi?',
                options: ['muss', 'müssten', 'gemacht', 'wollen'],
                answer: 0,
                explanation: 'Ich muss = men majburman / kerak.'
            },
            {
                roomName: '2-bosqich: Yalamas Sharshara',
                story: 'Perfekt zamonda o\'tgan ish: "Er ___ nach Hause gegangen." (U uyga ketdi). Yordamchi fe\'l qaysi?',
                q: 'Gehen fe\'li Perfektda qaysi yordamchi fe\'l bilan keladi?',
                options: ['hat', 'ist', 'wird', 'sein'],
                answer: 1,
                explanation: 'Harakat bildirish fe\'llari (gehen) Perfektda "sein" (ist) bilan ishlatiladi.'
            },
            {
                roomName: '3-bosqich: Yaqinlashayotgan Bo mezon',
                story: '"Wir können nicht bleiben!" iborasining tarjimasi qanday?',
                q: 'Gapning to\'g\'ri ma\'nosi:',
                options: ['Biz bu yerda qolishimiz kerak', 'Biz qola olmaymiz!', 'Biz keta olmaymiz', 'Biz kelmoqchimiz'],
                answer: 1,
                explanation: 'Wir können nicht bleiben = Biz qola olmaymiz!'
            },
            {
                roomName: '4-bosqich: Qora Ko\'prik',
                story: 'Predlog tanlang: "Das Auto steht ___ dem Haus." (Mashina uyning oldida turibdi).',
                q: 'Qaysi predlog ishlatiladi?',
                options: ['vor', 'ohne', 'aus', 'mit'],
                answer: 0,
                explanation: 'vor dem Haus = uyning oldida.'
            },
            {
                roomName: '5-bosqich: O\'rmon Chiqish Yo\'li',
                story: 'Omon qolish uchun so\'nggi ibora: "Ich habe angst" nimani anglatadi?',
                q: '"Ich habe Angst" tarjimasi:',
                options: ['Men ochman', 'Men qo\'rqyapman', 'Men charchadim', 'Men xursandman'],
                answer: 1,
                explanation: 'Ich habe Angst = Men qo\'rqyapman!'
            }
        ]
    },

    // -------------------------------------------------------------
    // 🌳 B1 Level: "Die Verlassene Anstalt" (Tashlab Ketilgan Shifoxona)
    // -------------------------------------------------------------
    b1: {
        id: 'b1',
        title: 'Die Verlassene Anstalt',
        subtitle: 'Sirli Shifoxona (B1 O\'rta)',
        icon: '🏥',
        badge: 'B1 - O\'rta',
        intro: 'Tashlab ketilgan shifoxonaning qorong\'u koridorida qulflangansiz. Passiv va Konjunktiv II grammatik parollarini yechib tashqariga chiqing!',
        rooms: [
            {
                roomName: '1-koridor: Qulflangan Qabulxona',
                story: 'Passiv shakli: "Das Haus ___ gebaut." (Uy qurilmoqda).',
                q: 'Passiv zamoni uchun yordamchi fe\'l:',
                options: ['wird', 'hat', 'ist', 'wäre'],
                answer: 0,
                explanation: 'Passiv Präsens: werden + Partizip II (wird gebaut).'
            },
            {
                roomName: '2-koridor: Dorixona Qulfi',
                story: 'Konjunktiv II (istak shakli): "Wenn ich Zeit ___, würde ich kommen." (Vaqtim bo\'lganda kelardim).',
                q: 'Bo\'sh joyga to\'g\'ri shakl:',
                options: ['hätte', 'habe', 'hatte', 'wäre'],
                answer: 0,
                explanation: 'haben fe\'lining Konjunktiv II shakli: hätte.'
            },
            {
                roomName: '3-koridor: Rentgen Xonasi',
                story: 'Nisbiy gap (Relativsatz): "Der Mann, ___ ich gesehen habe..." (Men ko\'rgan kishi...)',
                q: 'Nisbiy olmoshni toping:',
                options: ['den', 'der', 'dem', 'dessen'],
                answer: 0,
                explanation: 'Akkusativ rod masculinum: den.'
            },
            {
                roomName: '4-koridor: Jarrohlik Xonasi',
                story: '"Obwohl" (Barcha to\'siqlarga qaramay) bog\'lovchisidan so\'ng fe\'l qayerda keladi?',
                q: 'Obwohl bog\'lovchisi bor gapda fe\'l o\'rni:',
                options: ['Gap oxirida', 'Egalikdan keyin', 'Gap boshida', 'O\'rtada'],
                answer: 0,
                explanation: 'Nebensatz bog\'lovchisi (obwohl) fe\'lni gap oxiriga suradi.'
            },
            {
                roomName: '5-koridor: Shifoxona Chiqish Eshigi',
                story: 'Qutulish paroli: "Ich wünschte, ich ___ hier nicht." (Koshki men bu yerda bo\'lmasam edi).',
                q: 'Sein fe\'lining Konjunktiv II shakli:',
                options: ['wäre', 'bin', 'war', 'sei'],
                answer: 0,
                explanation: 'sein fe\'lining Konjunktiv II shakli: wäre.'
            }
        ]
    },

    // -------------------------------------------------------------
    // 🏔️ B2 Level: "Der Untergang von Waldfeld" (Gothic Qal'a Halokati)
    // -------------------------------------------------------------
    b2: {
        id: 'b2',
        title: 'Der Untergang von Waldfeld',
        subtitle: 'Gothic Qal\'a Halokati (B2 Nightmare Mode)',
        icon: '🌋',
        badge: 'B2 - Nightmare',
        intro: 'Qadimgi Waldfeld qal\'asi buzilib bormoqda! Murakkab akademik nemis tili va tezkor logika bilan qal\'a portalidan qochib qoling!',
        rooms: [
            {
                roomName: '1-zal: Minora Zali',
                story: 'Konjunktiv I (O\'zlashtirma gap): "Er sagte, er ___ krank." (U kasal ekanligini aytdi).',
                q: 'Konjunktiv I shakli:',
                options: ['sei', 'wäre', 'ist', 'war'],
                answer: 0,
                explanation: 'Sein fe\'lining Konjunktiv I (Er) shakli: sei.'
            },
            {
                roomName: '2-zal: Kimyogar Laboratoriyasi',
                story: '"Nichtsdestotrotz" iborasining ma\'nodoshi qaysi?',
                q: 'Nichtsdestotrotz ma\'nosi:',
                options: ['Tushunarli', 'Shunga qaramay / Baribir', 'Chunki', 'Aks holda'],
                answer: 1,
                explanation: 'Nichtsdestotrotz = Trotzdem (shunga qaramay).'
            },
            {
                roomName: '3-zal: Soyalar Ombori',
                story: 'Partizip II sifat o\'rnida: "Die ___ Entscheidung..." (Qabul qilingan qaror...)',
                q: 'To\'g\'ri sifat shaklini toping:',
                options: ['getroffene', 'getroffen', 'treffende', 'getroffenes'],
                answer: 0,
                explanation: 'die getroffene Entscheidung (Partizip II als Adjektiv).'
            },
            {
                roomName: '4-zal: Taxt Xonasi',
                story: 'Genitiv predlog: "Anstatt ___ Hilfe zu bitten..." (Yordam so\'rash o\'rniga...)',
                q: 'Anstatt predlogidan keyin qaysi kelishik keladi?',
                options: ['Genitiv', 'Dativ', 'Akkusativ', 'Nominativ'],
                answer: 0,
                explanation: 'Anstatt predlogi Genitiv kelishigini talab qiladi.'
            },
            {
                roomName: '5-zal: Portal Chiqishi',
                story: 'So\'nggi akademik paroli: "Infrage kommen" iborasi nimani anglatadi?',
                q: '"Infrage kommen" ma\'nosi:',
                options: ['Imkoniyatga ega bo\'lmoq / To\'g\'ri kelmoq', 'Savol bermoq', 'Rad etmoq', 'Javob berishga majbur bo\'lmoq'],
                answer: 0,
                explanation: 'Infrage kommen = e\'tiborga molik / mos kelmoq (möglich sein).'
            }
        ]
    },

    // -------------------------------------------------------------
    // ⚡ 10 Second Survival Questions Pool
    // -------------------------------------------------------------
    survivalPool: [
        { q: '"der Hund" ma\'nosi nima?', options: ['Kuchuk', 'Mushuk', 'Qush', 'Ot'], answer: 0 },
        { q: '"Wasser" artikli qaysi?', options: ['das', 'die', 'der', 'den'], answer: 0 },
        { q: '"Tisch" (Stol) artikli qaysi?', options: ['der', 'die', 'das', 'dem'], answer: 0 },
        { q: '"Ich bin 20 Jahre alt." ma\'nosi?', options: ['Men 20 yoshdaman', 'Men 20 yoshda emasman', 'U 20 yoshda', 'Biz 20 yoshdamiz'], answer: 0 },
        { q: 'Germaniya poytaxti qaysi?', options: ['Berlin', 'München', 'Hamburg', 'Köln'], answer: 0 },
        { q: '"Schule" (Maktab) artikli qaysi?', options: ['die', 'der', 'das', 'den'], answer: 0 },
        { q: '"Ja" inkor shakli qaysi?', options: ['Nein', 'Nicht', 'Kein', 'Nie'], answer: 0 },
        { q: '"Jawohl!" nimani anglatadi?', options: ['Xuddi shunday!', 'Yo\'q', 'Xayr', 'Kechirasiz'], answer: 0 }
    ]
};
