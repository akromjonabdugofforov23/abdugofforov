/**
 * ABDUGOFFOROV WEB EKOTIZIMI — TOOLS TEXT SUITE
 * scripts/tools-text-suite.js
 * 
 * Ushbu modul 'tools.abdugofforov.uz' uchun matn va lingvistik vositalar to'plamini ta'minlaydi:
 * 1. O'zbek Tili Imlo Tuzatuvchi (#panel-spellcheck):
 *    - 550+ dan ortiq orfografik xatolar lug'ati (h/x chalkashliklari, tutuq belgilari, o'/g' harflari, so'zlashuv shakllari)
 *    - Case-preserving (Katta/kichik harflarni saqlagan holda tuzatish)
 *    - Real-vaqtli tahlil, xatolar soni sanagichi (#spell-count-badge)
 *    - Interaktiv taklif chiplari (bosganda aynan shu so'zni almashtirish)
 *    - Barchasini birdaniga to'g'rilash (#spell-fix-btn) va nusxalash (#spell-copy-btn)
 * 2. PDF & Xom Matndan Toza Markdown (#panel-pdfclean):
 *    - Qator o'rtasidagi tire bilan bo'lingan so'zlarni ulash (tas-\nkil -> tashkil)
 *    - Sun'iy qator uzilishlarini (single newline) bitta xatboshiga birlashtirish
 *    - Katta harfli va ikki nuqtali satrlarni Markdown sarlavhalariga aylantirish (### Sarlavha)
 *    - Ro'yxat belgilari (•, ⁃, 1) kabilarni standart Markdown ro'yxatlariga o'tkazish
 *    - Real-vaqtli reaktiv konversiya, nusxalash va .md fayl yuklab olish (#pdf-dl-btn)
 * 3. Smart RegEx Tester & Vizualizator (#panel-regex):
 *    - Xavfsiz RegEx dvigateli (zero-length loop prevention, lastIndex xavfsizligi)
 *    - Xavfsiz HTML escape va <mark> teglari bilan ranglash
 *    - Mosliklar va guruhlar sonini real vaqtda ko'rsatish
 *    - Tayyor andozalar (Tel +998, Email, URL, Sana, IP, Kripto Hash)
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // 0. DINAMIK CSS USLUBI
    // -------------------------------------------------------------------------
    function injectSuiteStyles() {
        if (document.getElementById('tools-text-suite-styles')) return;
        const style = document.createElement('style');
        style.id = 'tools-text-suite-styles';
        style.textContent = `
            .spell-typo-item {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 2px 7px;
                margin: 1px 3px;
                border-radius: 6px;
                background: rgba(239, 68, 68, 0.12);
                border: 1px dashed rgba(239, 68, 68, 0.45);
                color: #ef4444;
                font-size: 13px;
                line-height: 1.4;
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
                vertical-align: middle;
            }
            .spell-typo-item:hover {
                background: rgba(239, 68, 68, 0.22);
                border-color: #ef4444;
                transform: translateY(-1px);
                box-shadow: 0 3px 10px rgba(239, 68, 68, 0.2);
            }
            .spell-typo-wrong {
                text-decoration: line-through;
                opacity: 0.85;
            }
            .spell-typo-arrow {
                font-size: 10px;
                color: var(--text-secondary, #94a3b8);
            }
            .spell-typo-suggest {
                font-weight: 700;
                color: #10b981;
                background: rgba(16, 185, 129, 0.14);
                padding: 1px 5px;
                border-radius: 4px;
            }
            .regex-match {
                background: rgba(234, 179, 8, 0.28) !important;
                color: #ca8a04 !important;
                border: 1px solid rgba(234, 179, 8, 0.5) !important;
                border-radius: 4px !important;
                padding: 1px 3px !important;
                font-weight: 600 !important;
                cursor: help;
                transition: background 0.15s ease;
            }
            .regex-match:hover {
                background: rgba(234, 179, 8, 0.45) !important;
            }
            .regex-match-empty {
                background: #f43f5e !important;
                color: #ffffff !important;
                padding: 0 4px !important;
                font-size: 11px !important;
                border-radius: 3px !important;
                font-weight: 700 !important;
                cursor: help;
            }
        `;
        document.head.appendChild(style);
    }

    // -------------------------------------------------------------------------
    // YORDAMCHI: TOAST BILDIRISHNOMA
    // -------------------------------------------------------------------------
    function notify(message, icon = '✓') {
        const toast = document.getElementById('tools-toast');
        const iconEl = document.getElementById('toast-icon');
        const msgEl = document.getElementById('toast-msg');

        if (toast && msgEl) {
            if (iconEl) iconEl.textContent = icon;
            msgEl.textContent = message;
            toast.classList.add('show');
            clearTimeout(window.__toolsToastTimer);
            window.__toolsToastTimer = setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
            return;
        }

        if (typeof window.showToast === 'function') {
            window.showToast(message, icon);
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Matn bosh harflarini saqlab qolish (Case Preservation):
     * "XARAKAT" -> "HARAKAT", "Xursand" -> "Xursand", "xursand" -> "xursand"
     */
    function matchCase(source, target) {
        if (!source || !target) return target;
        // Barcha harflar KATTA bo'lsa
        if (source === source.toUpperCase() && source !== source.toLowerCase()) {
            return target.toUpperCase();
        }
        // Bosh harf KATTA bo'lsa (Capitalized)
        if (source[0] === source[0].toUpperCase() && source.slice(1) === source.slice(1).toLowerCase()) {
            return target.charAt(0).toUpperCase() + target.slice(1);
        }
        return target.toLowerCase();
    }

    // -------------------------------------------------------------------------
    // 1. O'ZBEK TILI IMLO TUZATUVCHI LUG'ATI (550+ JUFTLIK)
    // -------------------------------------------------------------------------
    const UZBEK_DICTIONARY = {
        // --- H / X CHALKASHLIKLARI (x -> h) ---
        'xarakat': 'harakat',
        'xarakatlar': 'harakatlar',
        'xarakatda': 'harakatda',
        'xarakatga': 'harakatga',
        'xarakati': 'harakati',
        'xarakatsiz': 'harakatsiz',
        'xarakatlanish': 'harakatlanish',
        'xarakatlanmoq': 'harakatlanmoq',
        'xaqiqat': 'haqiqat',
        'xaqiqatan': 'haqiqatan',
        'xaqiqiy': 'haqiqiy',
        'xaqiqatda': 'haqiqatda',
        'xaqiqati': 'haqiqati',
        'xaqiqatparvar': 'haqiqatparvar',
        'xar': 'har',
        'xar doim': 'har doim',
        'xar kim': 'har kim',
        'xar qanday': 'har qanday',
        'xar qaysi': 'har qaysi',
        'xar kuni': 'har kuni',
        'xar bir': 'har bir',
        'xar holda': 'har holda',
        'xamma': 'hamma',
        'hammma': 'hamma',
        'xammaga': 'hammaga',
        'xammamiz': 'hammamiz',
        'xammasi': 'hammasi',
        'muxim': 'muhim',
        'muximlik': 'muhimlik',
        'muximroq': 'muhimroq',
        'muim': 'muhim',
        'maslaxat': 'maslahat',
        'maslaxatchi': 'maslahatchi',
        'maslaxatlashmoq': 'maslahatlashmoq',
        'maslaxatlashuv': 'maslahatlashuv',
        'mexnat': 'mehnat',
        'mexnatkash': 'mehnatkash',
        'mexnati': 'mehnati',
        'mexnatsevar': 'mehnatsevar',
        'mexmon': 'mehmon',
        'mexmonxona': 'mehmonxona',
        'mexmonlar': 'mehmonlar',
        'mexmondost': "mehmondo'st",
        'mexmondo\'st': "mehmondo'st",
        'raxmat': 'rahmat',
        'raxmatli': 'rahmatli',
        'raxm': 'rahm',
        'raxmdil': 'rahmdil',
        'raxmsiz': 'rahmsiz',
        'baxor': 'bahor',
        'baxorgi': 'bahorgi',
        'baxo': 'baho',
        'baxolash': 'baholash',
        'baxosi': 'bahosi',
        'shaxar': 'shahar',
        'shaxarlar': 'shaharlar',
        'shaxarlik': 'shaharlik',
        'shaxarda': 'shaharda',
        'zaxar': 'zahar',
        'zaxarlanish': 'zaharlanish',
        'zaxarli': 'zaharli',
        'qaxramon': 'qahramon',
        'qaxramonlik': 'qahramonlik',
        'saxar': 'sahar',
        'saxarlik': 'saharlik',
        'xurmat': 'hurmat',
        'xurmatli': 'hurmatli',
        'xurmatlash': 'hurmatlash',
        'xurmati': 'hurmati',
        'xisob': 'hisob',
        'xisobot': 'hisobot',
        'xisoblash': 'hisoblash',
        'xisobchi': 'hisobchi',
        'xisob-kitob': 'hisob-kitob',
        'xisoblanadi': 'hisoblanadi',
        'xis': 'his',
        'xis-tuygu': "his-tuyg'u",
        'xis-tuyg\'u': "his-tuyg'u",
        'xislar': 'hislar',
        'xissiyot': 'hissiyot',
        'xissiy': 'hissiy',
        'xavo': 'havo',
        'xavoda': 'havoda',
        'xavoning': 'havoning',
        'xamroh': 'hamroh',
        'xamrohlar': 'hamrohlar',
        'xamkor': 'hamkor',
        'xamkorlik': 'hamkorlik',
        'xammom': 'hammom',
        'xali': 'hali',
        'xaliyam': 'haliyam',
        'xatto': 'hatto',
        'xattoki': 'hattoki',
        'xozir': 'hozir',
        'xozircha': 'hozircha',
        'xozirgi': 'hozirgi',
        'xalol': 'halol',
        'xalollik': 'halollik',
        'xarom': 'harom',
        'xamisha': 'hamisha',
        'xamdard': 'hamdard',
        'xamdardlik': 'hamdardlik',
        'xamnafas': 'hamnafas',
        'xayot': 'hayot',
        'xayotiy': 'hayotiy',
        'xayotim': 'hayotim',
        'xayvon': 'hayvon',
        'xayvonlar': 'hayvonlar',
        'xayrat': 'hayrat',
        'xayratlanmoq': 'hayratlanmoq',
        'xayron': 'hayron',
        'xayronman': 'hayronman',
        'xayajon': 'hayajon',
        'xayajonli': 'hayajonli',
        'xaykal': 'haykal',
        'xaykaltarosh': 'haykaltarosh',
        'xaydash': 'haydash',
        'xaydovchi': 'haydovchi',
        'xissa': 'hissa',
        'xissador': 'hissador',
        'xukm': 'hukm',
        'xukumat': 'hukumat',
        'xukmdor': 'hukmdor',
        'xujjat': 'hujjat',
        'xujjatlar': 'hujjatlar',
        'xujjatli': 'hujjatli',
        'xaq-xuquq': 'haq-huquq',
        'xuquq': 'huquq',
        'xuquqiy': 'huquqiy',
        'xuquqshunos': 'huquqshunos',
        'xunar': 'hunar',
        'xunarmand': 'hunarmand',
        'xovli': 'hovli',
        'xovlida': 'hovlida',
        'xovuz': 'hovuz',
        'xosil': 'hosil',
        'xosildor': 'hosildor',
        'xosildorlik': 'hosildorlik',
        'xid': 'hid',
        'xidli': 'hidli',
        'xidsiz': 'hidsiz',
        'xiyla': 'hiyla',
        'xiylagar': 'hiylagar',
        'xikoya': 'hikoya',
        'xikoyalar': 'hikoyalar',
        'xikmat': 'hikmat',
        'xikmatli': 'hikmatli',
        'xamjihat': 'hamjihat',
        'xamjihatlik': 'hamjihatlik',
        'xassa': 'hassa',
        'xasad': 'hasad',
        'xasadgoy': "hasadgo'y",
        'xasadgo\'y': "hasadgo'y",
        'xavas': 'havas',
        'xavaskor': 'havaskor',
        'xalokat': 'halokat',
        'xalokatli': 'halokatli',
        'xalqa': 'halqa',
        'xamshira': 'hamshira',
        'xovliqmoq': 'hovliqmoq',
        'xojat': 'hojat',
        'xojatxona': 'hojatxona',
        'xojatbaror': 'hojatbaror',
        'xayat': "hay'at",
        'xayati': "hay'ati",
        'mexr': 'mehr',
        'mexribon': 'mehribon',
        'mexribonlik': 'mehribonlik',
        'mexrsiz': 'mehrsiz',
        'mexr-oqibat': 'mehr-oqibat',
        'pinxon': 'pinhon',
        'pinxona': 'pinhona',
        'jaxon': 'jahon',
        'jaxoniy': 'jahoniy',
        'extiyot': 'ehtiyot',
        'extiyotkor': 'ehtiyotkor',
        'extiyoj': 'ehtiyoj',
        'extiyojlar': 'ehtiyojlar',
        'extimol': 'ehtimol',
        'extimolki': 'ehtimolki',
        'extirom': 'ehtirom',
        'muxr': 'muhr',
        'muxrlangan': 'muhrlangan',
        'shaxodatnoma': 'shahodatnoma',
        'shaxid': 'shahid',
        'zaxmat': 'zahmat',
        'zaxmatkash': 'zahmatkash',
        'raxbar': 'rahbar',
        'raxbarlik': 'rahbarlik',
        'raxbarimiz': 'rahbarimiz',
        'qaxva': 'qahva',
        'qaxvaxona': 'qahvaxona',
        'muxabbat': 'muhabbat',
        'muxabbatim': 'muhabbatim',
        'muxtoj': 'muhtoj',
        'muxtojlik': 'muhtojlik',
        'muxtaram': 'muhtaram',
        'muxtasham': 'muhtasham',

        // --- H / X CHALKASHLIKLARI (h -> x) ---
        'hursand': 'xursand',
        'hursandchilik': 'xursandchilik',
        'hursandman': 'xursandman',
        'hursandmiz': 'xursandmiz',
        'hursandligi': 'xursandligi',
        'hato': 'xato',
        'hatolar': 'xatolar',
        'hatosi': 'xatosi',
        'hatolik': 'xatolik',
        'hatolari': 'xatolari',
        'hatosiz': 'xatosiz',
        'holos': 'xolos',
        'hizmat': 'xizmat',
        'hizmatlar': 'xizmatlar',
        'hizmatkor': 'xizmatkor',
        'hizmatida': 'xizmatida',
        'hizmatchi': 'xizmatchi',
        'habar': 'xabar',
        'habarlar': 'xabar',
        'habardor': 'xabardor',
        'habarchi': 'xabarchi',
        'habari': 'xabari',
        'honadon': 'xonadon',
        'honadoni': 'xonadoni',
        'honadonlar': 'xonadonlar',
        'hona': 'xona',
        'honadosh': 'xonadosh',
        'honalar': 'xonalar',
        'honasi': 'xonasi',
        'hos': 'xos',
        'hosiyat': 'xosiyat',
        'hususiyat': 'xususiyat',
        'hususiyatlar': 'xususiyatlar',
        'hususiy': 'xususiy',
        'hususan': 'xususan',
        'hatar': 'xatar',
        'hatarli': 'xatarli',
        'hatarsiz': 'xatarsiz',
        'hotira': 'xotira',
        'hotiralar': 'xotiralar',
        'hotirlamoq': 'xotirlamoq',
        'hotirjam': 'xotirjam',
        'hotirjamlik': 'xotirjamlik',
        'hotin': 'xotin',
        'hohish': 'xohish',
        'hohlamoq': 'xohlamoq',
        'hohlasa': 'xohlasa',
        'hohlardim': 'xohlardim',
        'hohlagan': 'xohlagan',
        'halq': 'xalq',
        'halqaro': 'xalqaro',
        'halqimiz': 'xalqimiz',
        'halqi': 'xalqi',
        'halqlar': 'xalqlar',
        'hamir': 'xamir',
        'hat': 'xat',
        'hatlar': 'xatlar',
        'hatchop': "xatcho'p",
        'hatcho\'p': "xatcho'p",
        'hiyonat': 'xiyonat',
        'hiyonatkor': 'xiyonatkor',
        'hiyonati': 'xiyonati',
        'hulosa': 'xulosa',
        'hulosalar': 'xulosalar',
        'hulosasi': 'xulosasi',
        'huddi': 'xuddi',
        'hudo': 'xudo',
        'hudoga': 'xudoga',
        'hushyor': 'xushyor',
        'hushyorlik': 'xushyorlik',
        'humor': 'xumor',
        'hodim': 'xodim',
        'hodimlar': 'xodimlar',
        'hodimi': 'xodimi',
        'hontaxta': 'xontaxta',
        'hushchaqchaq': 'xushchaqchaq',
        'hushmuomala': 'xushmuomala',
        'hushovoz': 'xushovoz',
        'hushfel': "xushfe'l",
        'hushfe\'l': "xushfe'l",
        'hushboy': "xushbo'y",
        'hushbo\'y': "xushbo'y",
        'hushroy': "xushro'y",
        'hushro\'y': "xushro'y",
        'hushnud': 'xushnud',
        'hurofot': 'xurofot',
        'homashyo': 'xomashyo',
        'hom': 'xom',
        'homlik': 'xomlik',
        'honaki': 'xonaki',
        'hurmo': 'xurmo',
        'hurjun': 'xurjun',
        'hira': 'xira',
        'hiralashmoq': 'xiralashmoq',
        'hil': 'xil',
        'hilma-hil': 'xilma-xil',
        'hitob': 'xitob',
        'huruj': 'xuruj',
        'husumat': 'xusumat',
        'haloyiq': 'xaloyiq',
        'halovat': 'xalovat',
        'halovatsiz': 'xalovatsiz',
        'hazina': 'xazina',
        'hazinabon': 'xazinabon',
        'hazon': 'xazon',
        'havf': 'xavf',
        'havfli': 'xavfli',
        'havfsiz': 'xavfsiz',
        'havfsizlik': 'xavfsizlik',
        'havotir': 'xavotir',
        'havotirli': 'xavotirli',
        'havotirlanmoq': 'xavotirlanmoq',
        'hislat': 'xislat',
        'hislatlar': 'xislatlar',
        'honaqoh': 'xonaqoh',
        'homxayol': 'xomxayol',
        'hotamtoy': 'xotamtoy',
        'hushbichim': 'xushbichim',
        'hushxulq': 'xushxulq',
        'hushxabar': 'xushxabar',
        'hushhabar': 'xushxabar',
        'xushhabar': 'xushxabar',

        // --- TUTUQ BELGISI TUSHIB QOLGAN SO'ZLAR ---
        'etibor': "e'tibor",
        'etiborli': "e'tiborli",
        'etiborsiz': "e'tiborsiz",
        'etiborini': "e'tiborini",
        'etiborga': "e'tiborga",
        'elon': "e'lon",
        'elonlar': "e'lonlar",
        'eloni': "e'loni",
        'elonda': "e'londa",
        'malumot': "ma'lumot",
        'malumotlar': "ma'lumotlar",
        'malumoti': "ma'lumoti",
        'malumotnoma': "ma'lumotnoma",
        'malum': "ma'lum",
        'nomalum': "noma'lum",
        'talim': "ta'lim",
        'talimiy': "ta'limiy",
        'talim-tarbiya': "ta'lim-tarbiya",
        'talimda': "ta'limda",
        'tasir': "ta'sir",
        'tasirli': "ta'sirli",
        'tasirsiz': "ta'sirsiz",
        'tasirchan': "ta'sirchan",
        'mano': "ma'no",
        'manosiz': "ma'nosiz",
        'manoli': "ma'noli",
        'manosi': "ma'nosi",
        'sanat': "san'at",
        'sanati': "san'ati",
        'sanatkor': "san'atkor",
        'sanatkori': "san'atkori",
        'sher': "she'r",
        'sherlar': "she'rlar",
        'sheriyat': "she'riyat",
        'sheriy': "she'riy",
        'qatiy': "qat'iy",
        'qatiyan': "qat'iyan",
        'qatiyat': "qat'iyat",
        'qatiylik': "qat'iylik",
        'tarif': "ta'rif",
        'tariflar': "ta'riflar",
        'tarifi': "ta'rifi",
        'tamir': "ta'mir",
        'tamirlash': "ta'mirlash",
        'tamirlandi': "ta'mirlandi",
        'masul': "mas'ul",
        'masuliyat': "mas'uliyat",
        'masuliyatli': "mas'uliyatli",
        'masuliyatsiz': "mas'uliyatsiz",
        'mamur': "ma'mur",
        'mamuriyat': "ma'muriyat",
        'mamuriy': "ma'muriy",
        'nemat': "ne'mat",
        'nematlar': "ne'matlar",
        'nemati': "ne'mati",
        'jurat': "jur'at",
        'juratli': "jur'atli",
        'juratsiz': "jur'atsiz",
        'fel': "fe'l",
        'fellar': "fe'llar",
        'fel-atvor': "fe'l-atvor",
        'davo': "da'vo",
        'davogar': "da'vogar",
        'davosi': "da'vosi",
        'davat': "da'vat",
        'davatnoma': "da'vatnoma",
        'davati': "da'vati",
        'mojiza': "mo'jiza",
        'mojizaviy': "mo'jizaviy",
        'mojizalar': "mo'jizalar",
        'motadil': "mo'tadil",
        'motabar': "mo'tabar",
        'ezoz': "e'zoz",
        'ezozlash': "e'zozlash",
        'ezozli': "e'zozli",
        'etiqod': "e'tiqod",
        'etiqodli': "e'tiqodli",
        'etiqodsiz': "e'tiqodsiz",
        'etirof': "e'tirof",
        'etirof etmoq': "e'tirof etmoq",
        'takid': "ta'kid",
        'takidlamoq': "ta'kidlamoq",
        'takidladi': "ta'kidladi",
        'tamin': "ta'min",
        'taminot': "ta'minot",
        'taminlash': "ta'minlash",
        'taminlandi': "ta'minlandi",
        'tasis': "ta'sis",
        'tasischisi': "ta'sischisi",
        'tana': "ta'na",
        'tanalar': "ta'nalar",
        'taziya': "ta'ziya",
        'taziyanoma': "ta'ziyanoma",
        'vada': "va'da",
        'vadalar': "va'dalar",
        'vadasi': "va'dasi",
        'memor': "me'mor",
        'memorchilik': "me'morchilik",
        'memoriy': "me'moriy",
        'tasurot': "taassurot",
        'tasurotlar': "taassurotlar",
        'ta\'surot': "taassurot",
        'tasavur': "tasavvur",
        'tasavurlar': "tasavvurlar",
        'tasavurim': "tasavvurim",
        'muamo': "muammo",
        'muamolar': "muammolar",
        'muammosi': "muammosi",
        'mutaxasis': "mutaxassis",
        'mutaxasislar': "mutaxassislar",
        'mudat': "muddat",
        'mudatli': "muddatli",
        'modiy': "moddiy",
        'modiyat': "moddiyat",
        'taraqiyot': "taraqqiyot",
        'taraqiy': "taraqqiy",
        'muvafaqiyat': "muvaffaqiyat",
        'muvafaqqiyat': "muvaffaqiyat",
        'muvaffaqqiyat': "muvaffaqiyat",
        'taluqli': "taalluqli",
        'taluq': "taalluq",
        'tajub': "taajjub",
        'taajub': "taajjub",
        'tasuf': "taassuf",
        'ta\'suf': "taassuf",
        'janat': "jannat",
        'janatiy': "jannatiy",

        // --- O' VA G' HARFLARI TUSHIB QOLGAN SO'ZLAR ---
        'oqituvchi': "o'qituvchi",
        'oqituvchilar': "o'qituvchilar",
        'oqituvchim': "o'qituvchim",
        'oquvchi': "o'quvchi",
        'oquvchilar': "o'quvchilar",
        'oquvchim': "o'quvchim",
        'oqish': "o'qish",
        'oqidim': "o'qidim",
        'oqigan': "o'qigan",
        'oqimoq': "o'qimoq",
        'organish': "o'rganish",
        'organdim': "o'rgandim",
        'organamiz': "o'rganamiz",
        'organmoq': "o'rganmoq",
        'ogil': "o'g'il",
        'ogli': "o'g'li",
        'ogillar': "o'g'illar",
        'togri': "to'g'ri",
        'togrisi': "to'g'risi",
        'togridan': "to'g'ridan",
        'togriroq': "to'g'riroq",
        'togrilash': "to'g'rilash",
        'gozal': "go'zal",
        'gozallik': "go'zallik",
        'gozalroq': "go'zalroq",
        'gozallar': "go'zallar",
        'bolish': "bo'lish",
        'boldi': "bo'ldi",
        'bolgan': "bo'lgan",
        'boladi': "bo'ladi",
        'bolayotgan': "bo'layotgan",
        'bolishi': "bo'lishi",
        'bolmadi': "bo'lmadi",
        'bosa': "bo'lsa",
        'bolsa': "bo'lsa",
        'bomasa': "bo'lmasa",
        'bolmasa': "bo'lmasa",
        'bomasam': "bo'lmasam",
        'ozbek': "o'zbek",
        'ozbekcha': "o'zbekcha",
        'ozbekiston': "O'zbekiston",
        'ozbekistonlik': "O'zbekistonlik",
        'ozim': "o'zim",
        'ozimiz': "o'zimiz",
        'ozicha': "o'zicha",
        'korish': "ko'rish",
        'kordim': "ko'rdim",
        'korsatish': "ko'rsatish",
        'korik': "ko'rik",
        'korindi': "ko'rindi",
        'soz': "so'z",
        'sozlar': "so'zlar",
        'sozlash': "so'zlash",
        'sozlashuv': "so'zlashuv",
        'sozladi': "so'zladi",
        'qol': "qo'l",
        'qollar': "qo'llar",
        'qolim': "qo'lim",
        'qolida': "qo'lida",
        'yol': "yo'l",
        'yollar': "yo'llar",
        'yolim': "yo'lim",
        'yolboshchi': "yo'lboshchi",
        'yolida': "yo'lida",
        'bog': "bog'",
        'boglar': "bog'lar",
        'bogni': "bog'ni",
        'tog': "tog'",
        'toglar': "tog'lar",
        'togda': "tog'da",
        'sog': "sog'",
        'soglik': "sog'lik",
        'soglom': "sog'lom",
        'sog-omon': "sog'-omon",
        'yiglash': "yig'lash",
        'yigladi': "yig'ladi",
        'yiglama': "yig'lama",
        'ogir': "og'ir",
        'ogirlik': "og'irlik",
        'ogiz': "og'iz",
        'ogzi': "og'zi",
        'bogliq': "bog'liq",
        'bogliqlik': "bog'liqlik",
        'yomgir': "yomg'ir",
        'yomgirli': "yomg'irli",
        'kop': "ko'p",
        'kopchilik': "ko'pchilik",
        'koproq': "ko'proq",
        'koz': "ko'z",
        'kozlar': "ko'zlar",
        'kozoynak': "ko'zoynak",
        'kozim': "ko'zim",
        'koylak': "ko'ylak",
        'koylek': "ko'ylak",
        'kongil': "ko'ngil",
        'kongli': "ko'ngli",
        'kongildagi': "ko'ngildagi",
        'kol': "ko'l",
        'kollar': "ko'llar",
        'kok': "ko'k",
        'koklam': "ko'klam",
        'royxat': "ro'yxat",
        'royxatdan': "ro'yxatdan",
        'royhat': "ro'yxat",
        'royhatdan': "ro'yxatdan",
        'roza': "ro'za",
        'dost': "do'st",
        'dostlar': "do'stlar",
        'dostim': "do'stim",
        'dostlik': "do'stlik",
        'gosht': "go'sht",
        'goshti': "go'shti",
        'tort': "to'rt",
        'tortta': "to'rtta",
        'toqqiz': "toqqiz",
        'toqqizta': "to'qqizta",
        'onlab': "o'nlab",
        'onta': "o'nta",
        'onbosh': "o'nboshi",
        'ottiz': "o'ttiz",
        'ottizta': "o'ttizta",
        'toqson': "to'qson",
        'toshak': "to'shak",
        'toy': "to'y",
        'toylar': "to'ylar",
        'toyxona': "to'yxona",
        'qoshiqchi': "qo'shiqchi",
        'qoshiqlar': "qo'shiqlar",
        'oyin': "o'yin",
        'oyinlar': "o'yinlar",
        'oynash': "o'ynash",
        'oynamoq': "o'ynamoq",
        'oyinchi': "o'yinchi",
        'otin': "o'tin",
        'otinchi': "o'tinchi",
        'ogri': "o'g'ri",
        'ogrilar': "o'g'rilar",
        'boyoq': "bo'yoq",
        'boyoqchi': "bo'yoqchi",
        'soroq': "so'roq",
        'soroqlar': "so'roqlar",
        'sorovnoma': "so'rovnoma",
        'soramoq': "so'ramoq",
        'soradi': "so'radi",
        'sorayman': "so'rayman",
        'oylamoq': "o'ylamoq",
        'oyladi': "o'yladi",
        'oylayman': "o'ylayman",
        'komak': "ko'mak",
        'komaklashmoq': "ko'maklashmoq",
        'bolim': "bo'lim",
        'bolimlar': "bo'limlar",
        'bolimi': "bo'limi",
        'kolam': "ko'lam",
        'kolamli': "ko'lamli",
        'kongilli': "ko'ngilli",
        'kongillilar': "ko'ngillilar",
        'kozgu': "ko'zgu",
        'orik': "o'rik",
        'qorqmoq': "qo'rqmoq",
        'qorqdi': "qo'rqdi",
        'qorqinchli': "qo'rqinchli",
        'qorqmang': "qo'rqmang",
        'qoriqchi': "qo'riqchi",
        'qoriqlash': "qo'riqlash",
        'qoriqxona': "qo'riqxona",
        'qoshni': "qo'shni",
        'qoshnilar': "qo'shnilar",
        'qoshmoq': "qo'shmoq",
        'qoshildi': "qo'shildi",
        'qoshimcha': "qo'shimcha",
        'toplam': "to'plam",
        'toplash': "to'plash",
        'toplandi': "to'plandi",
        'tolqin': "to'lqin",
        'tolqinlar': "to'lqinlar",
        'boron': "bo'ron",
        'ormon': "o'rmon",
        'ormonlar': "o'rmonlar",
        'ormonchi': "o'rmonchi",
        'korpa': "ko'rpa",
        'korpacha': "ko'rpacha",
        'togarak': "to'garak",
        'togaraklar': "to'garaklar",
        'romol': "ro'mol",
        'rozgor': "ro'zg'or",
        'rozgorda': "ro'zg'orda",
        'song': "so'ng",
        'songra': "so'ngra",
        'songgi': "so'nggi",
        'ornatish': "o'rnatish",
        'ornashmoq': "o'rnashmoq",
        'osimlik': "o'simlik",
        'osimliklar': "o'simliklar",
        'osmoq': "o'smoq",
        'osdi': "o'sdi",
        'osish': "o'sish",
        'otkir': "o'tkir",
        'ojar': "o'jar",
        'ojarlik': "o'jarlik",
        'olchov': "o'lchov",
        'olchash': "o'lchash",
        'olchandi': "o'lchandi",
        'olik': "o'lik",
        'olim': "o'lim",
        'olimlar': "o'limlar",
        'orindiq': "o'rindiq",
        'otkinchi': "o'tkinchi",
        'kocha': "ko'cha",
        'kochalar': "ko'chalar",
        'kochada': "ko'chada",
        'kochat': "ko'chat",
        'kochmoq': "ko'chmoq",
        'kochdi': "ko'chdi",
        'kochirish': "ko'chirish",
        'boyin': "bo'yin",
        'boyni': "bo'yni",
        'bori': "bo'ri",
        'borilar': "bo'rilar",
        'bogoz': "bo'g'oz",
        'bogin': "bo'g'in",
        'boginlar': "bo'g'inlar",
        'bogmoq': "bo'g'moq",
        'bogildi': "bo'g'ildi",
        'godak': "go'dak",
        'godaklar': "go'daklar",
        'gong': "go'ng",
        'yotal': "yo'tal",
        'yotallamoq': "yo'tallamoq",
        'yorgak': "yo'rgak",
        'yolbars': "yo'lbars",
        'yoldosh': "yo'ldosh",
        'yolovchi': "yo'lovchi",
        'yolovchilar': "yo'lovchilar",
        'yoqotmoq': "yo'qotmoq",
        'yoqotdi': "yo'qotdi",
        'yoqolmoq': "yo'qolmoq",
        'yoqoldi': "yo'qoldi",
        'yoqlama': "yo'qlama",
        'yoqlamoq': "yo'qlamoq",
        'chol': "cho'l",
        'chollar': "cho'llar",
        'choqqi': "cho'qqi",
        'choqqilar': "cho'qqilar",
        'chontak': "cho'ntak",
        'chontaklar': "cho'ntaklar",
        'choponlik': "cho'ponlik",
        'chokmoq': "cho'kmoq",
        'chokdi': "cho'kdi",
        'chokich': "cho'kich",
        'chomich': "cho'mich",
        'chochqa': "cho'chqa",
        'shorva': "sho'rva",
        'shor': "sho'r",
        'shorlik': "sho'rlik",
        'qozi': "qo'zi",
        'qozichoq': "qo'zichoq",
        'qongiz': "qo'ng'iz",
        'qongiroq': "qo'ng'iroq",
        'qongiroqlar': "qo'ng'iroqlar",
        'qozgalmoq': "qo'zg'almoq",
        'qozgolon': "qo'zg'olon",
        'qopol': "qo'pol",
        'qopollik': "qo'pollik",
        'golib': "g'olib",
        'goliblar': "g'oliblar",
        'golibona': "g'olibona",
        'galaba': "g'alaba",
        'galabalar': "g'alabalar",
        'gildirak': "g'ildirak",
        'gildiraklar': "g'ildiraklar",
        'gamxor': "g'amxo'r",
        'gamxorlik': "g'amxo'rlik",
        'gazab': "g'azab",
        'gazablangan': "g'azablangan",
        'garoyib': "g'aroyib",
        'goza': "g'o'za",
        'gisht': "g'isht",
        'gishtlar': "g'ishtlar",
        'gam': "g'am",
        'gamgin': "g'amgin",
        'gayrat': "g'ayrat",
        'gayratli': "g'ayratli",
        'garaz': "g'araz",
        'garazli': "g'arazli",
        'goyib': "g'oyib",
        'goyibona': "g'oyibona",
        'goya': "g'oya",
        'goyalar': "g'oyalar",
        'goyaviy': "g'oyaviy",
        'gor': "g'or",
        'gorlar': "g'orlar",
        'goz': "g'oz",
        'gozlar': "g'ozlar",
        'ganimat': "g'animat",
        'gofil': "g'ofil",
        'gubor': "g'ubor",
        'guborsiz': "g'uborsiz",
        'gurur': "g'urur",
        'gururli': "g'ururli",
        'gilof': "g'ilof",
        'gijim': "g'ijim",
        'gov': "g'ov",
        'galati': "g'alati",

        // --- SO'ZLASHUV, SMS VA SLANG SHAKLLARI ---
        'kerek': 'kerak',
        'kere': 'kerak',
        'keregi': 'keragi',
        'kereli': 'kerakli',
        'blan': 'bilan',
        'qilvomman': 'qilyapman',
        'qivomman': 'qilyapman',
        'qivotgan': 'qilayotgan',
        'qilvotgan': 'qilayotgan',
        'qilyappan': 'qilyapman',
        'qivotti': 'qilyapti',
        'qilvotti': 'qilyapti',
        'qilvomiz': 'qilyapmiz',
        'kevotgan': 'kelayotgan',
        'kevotti': 'kelyapti',
        'kevotganlar': 'kelayotganlar',
        'kelvomman': 'kelyapman',
        'kevommiz': 'kelyapmiz',
        'borvomman': 'boryapman',
        'borvotti': 'boryapti',
        'borvotgan': 'borayotgan',
        'borommiz': 'boryapmiz',
        'gapirvomman': 'gapiryapman',
        'gapirvotti': 'gapiryapti',
        'oylavomman': "o'ylayapman",
        'oylavotti': "o'ylayapti",
        'yozvomman': 'yozayapman',
        'yozvotti': 'yozayapti',
        'oqivomman': "o'qiyapman",
        'oqivotti': "o'qiyapti",
        'qildm': 'qildim',
        'bordm': 'bordim',
        'keldm': 'keldim',
        'bildm': 'bildim',
        'kordm': "ko'rdim",
        'aytdm': 'aytdim',
        'etdim': 'aytdim',
        'etdimmi': 'aytdimmi',
        'etgan': 'aytgan',
        'etmoq': 'aytmoq',
        'tushundm': 'tushundim',
        'tushunmadm': 'tushunmadim',
        'iltmos': 'iltimos',
        'iltimoz': 'iltimos',
        'slm': 'salom',
        'assalomualaykum': 'assalomu alaykum',
        'assalomalaykum': 'assalomu alaykum',
        'albata': 'albatta',
        'albattada': 'albatta',
        'apsus': 'afsus',
        'apsuski': 'afsuski',
        'sharoyit': 'sharoit',
        'sharoyitlar': 'sharoitlar',
        'sharoyiti': 'sharoiti',
        'tabiyat': 'tabiat',
        'tabiyati': 'tabiati',
        'jamyat': 'jamiyat',
        'jamiyati': 'jamiyati',
        'faolyat': 'faoliyat',
        'faoliyati': 'faoliyati',
        'madanyat': 'madaniyat',
        'madaniyati': 'madaniyati',
        'vazyat': 'vaziyat',
        'vaziyati': 'vaziyati',
        'qziq': 'qiziq',
        'qziqarli': 'qiziqarli',
        'yahshi': 'yaxshi',
        'yahshiroq': 'yaxshiroq',
        'yahshilik': 'yaxshilik',
        'yahshilar': 'yaxshilar',
        'oxshash': "o'xshash",
        'oxshaydi': "o'xshaydi",
        'oxshatish': "o'xshatish",
        'otirmoq': "o'tirmoq",
        'otirdi': "o'tirdi",
        'otiring': "o'tiring",
        'otmoq': "o'tmoq",
        'otdi': "o'tdi",
        'otgan': "o'tgan",
        'orniga': "o'rniga",
        'orni': "o'rni",
        'barcasi': 'barchasi',
        'nmaga': 'nimaga',
        'nme': 'nima',
        'nmadir': 'nimadir',
        'negadr': 'negadir'
    };

    /**
     * Noto'g'ri apostroflarni standartlashtirish:
     * `o‘`, `o’`, `oʻ`, `o` ` -> `o'`
     */
    function normalizeApostrophes(text) {
        if (!text) return '';
        return text
            .replace(/[’‘ʻʼ`´′]/g, "'")
            .replace(/o''/gi, "o'")
            .replace(/g''/gi, "g'");
    }

    // =========================================================================
    // O'ZBEK TILI LOTIN ↔ KIRILL KONTEKSTUAL TRANSLITERATORI
    // =========================================================================
    function transliterateLatinToCyrillic(text) {
        if (!text) return '';
        let res = text;

        // Boshlang'ich yoki unlilardan keyingi 'E / e' -> 'Э / э'
        // Masalan: 'eshik' -> 'эшик', 'aeroport' -> 'аэропорт'
        res = res.replace(/(^|[\s\(\[\{<«"“'.,!?;:/-])e/g, '$1э');
        res = res.replace(/(^|[\s\(\[\{<«"“'.,!?;:/-])E/g, '$1Э');
        res = res.replace(/([aouieAOUIEʻʼ'`’‘])e/g, '$1э');
        res = res.replace(/([aouieAOUIEʻʼ'`’‘])E/g, '$1Э');

        const LAT_TO_CYR_RULES = [
            // Uch va ikki harfli murakkab birikmalar
            [/yo['ʻʼ`’‘]/g, 'йў'], [/Yo['ʻʼ`’‘]/g, 'Йў'], [/YO['ʻʼ`’‘]/g, 'ЙЎ'],
            [/o['ʻʼ`’‘]/g, 'ў'], [/O['ʻʼ`’‘]/g, 'Ў'],
            [/g['ʻʼ`’‘]/g, 'ғ'], [/G['ʻʼ`’‘]/g, 'Ғ'],
            [/sh/g, 'ш'], [/Sh/g, 'Ш'], [/SH/g, 'Ш'],
            [/ch/g, 'ч'], [/Ch/g, 'Ч'], [/CH/g, 'Ч'],
            [/yo/g, 'ё'], [/Yo/g, 'Ё'], [/YO/g, 'Ё'],
            [/yu/g, 'ю'], [/Yu/g, 'Ю'], [/YU/g, 'Ю'],
            [/ya/g, 'я'], [/Ya/g, 'Я'], [/YA/g, 'Я'],
            [/ye/g, 'е'], [/Ye/g, 'Е'], [/YE/g, 'Е'],
            [/ts/g, 'ц'], [/Ts/g, 'Ц'], [/TS/g, 'Ц'],
            // Yagona harflar
            [/a/g, 'а'], [/A/g, 'А'],
            [/b/g, 'б'], [/B/g, 'Б'],
            [/d/g, 'д'], [/D/g, 'Д'],
            [/e/g, 'е'], [/E/g, 'Е'],
            [/f/g, 'ф'], [/F/g, 'Ф'],
            [/g/g, 'г'], [/G/g, 'Г'],
            [/h/g, 'ҳ'], [/H/g, 'Ҳ'],
            [/i/g, 'и'], [/I/g, 'И'],
            [/j/g, 'ж'], [/J/g, 'Ж'],
            [/k/g, 'к'], [/K/g, 'К'],
            [/l/g, 'л'], [/L/g, 'Л'],
            [/m/g, 'м'], [/M/g, 'М'],
            [/n/g, 'н'], [/N/g, 'Н'],
            [/o/g, 'о'], [/O/g, 'О'],
            [/p/g, 'п'], [/P/g, 'П'],
            [/q/g, 'қ'], [/Q/g, 'Қ'],
            [/r/g, 'р'], [/R/g, 'Р'],
            [/s/g, 'с'], [/S/g, 'С'],
            [/t/g, 'т'], [/T/g, 'Т'],
            [/u/g, 'у'], [/U/g, 'У'],
            [/v/g, 'в'], [/V/g, 'В'],
            [/x/g, 'х'], [/X/g, 'Х'],
            [/y/g, 'й'], [/Y/g, 'Й'],
            [/z/g, 'з'], [/Z/g, 'З'],
            // Tutuq belgisi
            [/[ʻʼ'`’‘]/g, 'ъ']
        ];

        for (const [regex, cyr] of LAT_TO_CYR_RULES) {
            res = res.replace(regex, cyr);
        }

        return res;
    }

    function transliterateCyrillicToLatin(text) {
        if (!text) return '';
        let res = text;

        // So'z boshidagi yoki unlilardan keyingi 'Е / е' -> 'Ye / ye'
        res = res.replace(/(^|[\s\(\[\{<«"“'.,!?;:/-])е/g, '$1ye');
        res = res.replace(/(^|[\s\(\[\{<«"“'.,!?;:/-])Е/g, '$1Ye');
        res = res.replace(/([аоуиэеяюёўғАОУИЭЕЯЮЁЎҒ])е/g, '$1ye');
        res = res.replace(/([аоуиэеяюёўғАОУИЭЕЯЮЁЎҒ])Е/g, '$1Ye');

        const CYR_TO_LAT_RULES = [
            [/ў/g, "o'"], [/Ў/g, "O'"],
            [/ғ/g, "g'"], [/Ғ/g, "G'"],
            [/ш/g, 'sh'], [/Ш/g, 'Sh'],
            [/ч/g, 'ch'], [/Ч/g, 'Ch'],
            [/ё/g, 'yo'], [/Ё/g, 'Yo'],
            [/ю/g, 'yu'], [/Ю/g, 'Yu'],
            [/я/g, 'ya'], [/Я/g, 'Ya'],
            [/ц/g, 'ts'], [/Ц/g, 'Ts'],
            [/э/g, 'e'], [/Э/g, 'E'],
            [/е/g, 'e'], [/Е/g, 'E'],
            [/а/g, 'a'], [/А/g, 'A'],
            [/б/g, 'b'], [/Б/g, 'B'],
            [/в/g, 'v'], [/В/g, 'V'],
            [/г/g, 'g'], [/Г/g, 'G'],
            [/д/g, 'd'], [/Д/g, 'D'],
            [/ж/g, 'j'], [/Ж/g, 'J'],
            [/з/g, 'z'], [/З/g, 'Z'],
            [/и/g, 'i'], [/И/g, 'I'],
            [/й/g, 'y'], [/Й/g, 'Y'],
            [/к/g, 'k'], [/К/g, 'K'],
            [/қ/g, 'q'], [/Қ/g, 'Q'],
            [/л/g, 'l'], [/Л/g, 'L'],
            [/м/g, 'm'], [/М/g, 'M'],
            [/н/g, 'n'], [/Н/g, 'N'],
            [/о/g, 'o'], [/О/g, 'O'],
            [/п/g, 'p'], [/П/g, 'P'],
            [/р/g, 'r'], [/Р/g, 'R'],
            [/с/g, 's'], [/С/g, 'S'],
            [/т/g, 't'], [/Т/g, 'T'],
            [/у/g, 'u'], [/У/g, 'U'],
            [/ф/g, 'f'], [/Ф/g, 'F'],
            [/х/g, 'x'], [/Х/g, 'X'],
            [/ҳ/g, 'h'], [/Ҳ/g, 'H'],
            [/ъ/g, "’"], [/Ъ/g, "’"],
            [/ь/g, ''], [/Ь/g, '']
        ];

        for (const [regex, lat] of CYR_TO_LAT_RULES) {
            res = res.replace(regex, lat);
        }

        return res;
    }

    // -------------------------------------------------------------------------
    // LIVE SO'Z VA BELGILAR STATISTIKASI (WORD & CHARACTER METRICS)
    // -------------------------------------------------------------------------
    function updateTextMetrics(text, prefix) {
        const wordsEl = document.getElementById(`${prefix}-stat-words`);
        const charsEl = document.getElementById(`${prefix}-stat-chars`);
        const charsNoSpaceEl = document.getElementById(`${prefix}-stat-chars-nospace`);
        const linesEl = document.getElementById(`${prefix}-stat-lines`);
        const readEl = document.getElementById(`${prefix}-stat-reading`);
        if (!wordsEl || !charsEl) return;

        if (!text) {
            wordsEl.textContent = '0';
            charsEl.textContent = '0';
            charsNoSpaceEl.textContent = '0';
            linesEl.textContent = '0';
            if (readEl) readEl.textContent = '~0 daq';
            return;
        }

        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).length : 0;
        const lines = text.split(/\r\n|\r|\n/).length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        const readingTime = words === 0 ? '~0 daq' : (words < 50 ? '< 1 daq' : `~${minutes} daq`);

        wordsEl.textContent = words.toLocaleString('uz-UZ');
        charsEl.textContent = chars.toLocaleString('uz-UZ');
        charsNoSpaceEl.textContent = charsNoSpace.toLocaleString('uz-UZ');
        linesEl.textContent = lines.toLocaleString('uz-UZ');
        if (readEl) readEl.textContent = readingTime;
    }

    function initSpellcheck() {
        const input = document.getElementById('spell-input');
        const result = document.getElementById('spell-result');
        const countBadge = document.getElementById('spell-count-badge');
        const fixAllBtn = document.getElementById('spell-fix-btn');
        const copyBtn = document.getElementById('spell-copy-btn');
        const toCyrlBtn = document.getElementById('spell-to-cyrl-btn');
        const toLatBtn = document.getElementById('spell-to-lat-btn');
        const sampleBtn = document.getElementById('spell-sample-btn');
        const clearBtn = document.getElementById('spell-clear-btn');
        if (!input) return;

        let currentTypoMap = []; // { tokenIdx, orig, fix }

        function checkText() {
            const raw = input.value;
            updateTextMetrics(raw, 'spell');

            if (!raw.trim()) {
                if (result) {
                    result.innerHTML = '<span style="color:var(--text-secondary);">Natija bu yerda ko\'rinadi...</span>';
                }
                if (countBadge) {
                    countBadge.textContent = '0 ta xato';
                    countBadge.style.background = 'rgba(16,185,129,0.12)';
                    countBadge.style.color = '#10b981';
                }
                currentTypoMap = [];
                return;
            }

            // So'zlarni va oraliq belgilarni alohida tokenlarga ajratish
            // Diqqat: O'zbek tilida apostrof so'zning ajralmas qismidir (o'qituvchi, ta'lim)
            const tokens = raw.split(/([^a-zA-Z\u0400-\u04FF0-9_ʻʼ'`´’]+)/);
            let typoCount = 0;
            currentTypoMap = [];

            const markedHtml = tokens.map((token, idx) => {
                // Agar bo'shliq yoki tinish belgisi bo'lsa
                if (!token || /^[^a-zA-Z\u0400-\u04FF0-9_ʻʼ'`´’]+$/.test(token)) {
                    return escapeHtml(token);
                }

                // Normalizatsiya qilingan kalit
                const lookupKey = normalizeApostrophes(token.toLowerCase());
                if (UZBEK_DICTIONARY[lookupKey]) {
                    typoCount++;
                    const suggestedFix = matchCase(token, UZBEK_DICTIONARY[lookupKey]);
                    currentTypoMap.push({
                        tokenIdx: idx,
                        orig: token,
                        fix: suggestedFix
                    });

                    return `<span class="spell-typo-item" data-token-idx="${idx}" data-orig="${escapeHtml(token)}" data-fix="${escapeHtml(suggestedFix)}" title="Bosib to'g'rilash: '${escapeHtml(suggestedFix)}'">` +
                        `<span class="spell-typo-wrong">${escapeHtml(token)}</span>` +
                        `<span class="spell-typo-arrow">➔</span>` +
                        `<span class="spell-typo-suggest">${escapeHtml(suggestedFix)}</span>` +
                        `</span>`;
                }

                return escapeHtml(token);
            }).join('');

            if (result) {
                result.innerHTML = markedHtml || '<span style="color:var(--text-secondary);">Matn toza!</span>';
            }

            if (countBadge) {
                if (typoCount > 0) {
                    countBadge.textContent = `${typoCount} ta xato`;
                    countBadge.style.background = 'rgba(239,68,68,0.12)';
                    countBadge.style.color = '#ef4444';
                } else {
                    countBadge.textContent = '0 ta xato (Toza)';
                    countBadge.style.background = 'rgba(16,185,129,0.12)';
                    countBadge.style.color = '#10b981';
                }
            }
        }

        // Interaktiv taklif chiplarini bosganda aynan shu so'zni almashtirish
        if (result) {
            result.addEventListener('click', (e) => {
                const item = e.target.closest('.spell-typo-item');
                if (!item) return;

                const tokenIdx = parseInt(item.dataset.tokenIdx, 10);
                const orig = item.dataset.orig;
                const fix = item.dataset.fix;

                if (isNaN(tokenIdx) || !fix) return;

                const raw = input.value;
                const tokens = raw.split(/([^a-zA-Z\u0400-\u04FF0-9_ʻʼ'`´’]+)/);
                if (tokens[tokenIdx] !== undefined) {
                    tokens[tokenIdx] = fix;
                    input.value = tokens.join('');
                    checkText();
                    notify(`"${orig}" ➔ "${fix}" to'g'rilandi!`, '✓');
                }
            });
        }

        // Barcha xatolarni birdaniga to'g'rilash
        if (fixAllBtn) {
            fixAllBtn.addEventListener('click', () => {
                const raw = input.value;
                if (!raw.trim()) {
                    notify("To'g'rilash uchun matn kiritilmagan!", '⚠️');
                    return;
                }

                const tokens = raw.split(/([^a-zA-Z\u0400-\u04FF0-9_ʻʼ'`´’]+)/);
                let fixCount = 0;

                const fixedTokens = tokens.map(token => {
                    if (!token || /^[^a-zA-Z\u0400-\u04FF0-9_ʻʼ'`´’]+$/.test(token)) {
                        return token;
                    }
                    const lookupKey = normalizeApostrophes(token.toLowerCase());
                    if (UZBEK_DICTIONARY[lookupKey]) {
                        fixCount++;
                        return matchCase(token, UZBEK_DICTIONARY[lookupKey]);
                    }
                    return token;
                });

                // Umumiy apostroflarni ham standartlashtirish
                let newText = fixedTokens.join('');
                newText = normalizeApostrophes(newText);
                input.value = newText;
                checkText();

                if (fixCount > 0) {
                    notify(`Barcha ${fixCount} ta xato to'g'rilandi!`, '✓');
                } else {
                    notify("Matnda xatoliklar topilmadi!", '✓');
                }
            });
        }

        // Nusxa olish
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (!input.value.trim()) {
                    notify("Nusxalash uchun matn kiritilmagan!", '⚠️');
                    return;
                }
                navigator.clipboard.writeText(input.value).then(() => {
                    notify("Tozalangan matn nusxalandi!", '✓');
                }).catch(() => {
                    input.select();
                    document.execCommand('copy');
                    notify("Tozalangan matn nusxalandi!", '✓');
                });
            });
        }

        // Tezkor Lotin -> Kirill
        if (toCyrlBtn) {
            toCyrlBtn.addEventListener('click', () => {
                if (!input.value.trim()) {
                    notify("Konvertatsiya uchun matn kiriting!", 'ℹ️');
                    return;
                }
                input.value = transliterateLatinToCyrillic(input.value);
                checkText();
                notify("Matn Kirill alifbosiga o'girildi!", '🔄');
            });
        }

        // Tezkor Kirill -> Lotin
        if (toLatBtn) {
            toLatBtn.addEventListener('click', () => {
                if (!input.value.trim()) {
                    notify("Konvertatsiya uchun matn kiriting!", 'ℹ️');
                    return;
                }
                input.value = transliterateCyrillicToLatin(input.value);
                checkText();
                notify("Matn Lotin alifbosiga o'girildi!", '🔄');
            });
        }

        // Namuna matnni yuklash
        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => {
                input.value = "Bugun men juda xursand bo'ldim. Hamma xarakatlarimiz besamar ketmadi, muxim natijalarga erishdik. Ustozimizga katta raxmat aytdik va yangi maslaxatlar oldik. Mexnat qilishdan hech qachon to'xtamaymiz.";
                checkText();
                notify("Namunaviy matn yuklandi!", 'ℹ️');
            });
        }

        // Tozalash
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                input.value = '';
                checkText();
                notify("Matn tozalandi", '🗑️');
            });
        }

        input.addEventListener('input', checkText);

        // Dastlabki matn mavjud bo'lsa tekshirish
        if (input.value) {
            checkText();
        } else {
            updateTextMetrics('', 'spell');
        }
    }

    // -------------------------------------------------------------------------
    // 2. TEXT & PDF TO CLEAN MARKDOWN (#panel-pdfclean)
    // -------------------------------------------------------------------------
    function cleanPdfToMarkdown(rawText) {
        if (!rawText) return '';

        // 1. Standartlashtirish: \r\n -> \n
        let text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // 2. Qator ko'chishidagi tirelarni birlashtirish (so'z uzilishi):
        // Masalan: "tas-\nkil" -> "tashkil", "dastur-\nchi" -> "dasturchi"
        text = text.replace(/([a-zA-Zа-яА-ЯoʻgʻOʻGʻ\u0400-\u04FF\w]+)-\s*\n\s*([a-zA-Zа-яА-ЯoʻgʻOʻGʻ\u0400-\u04FF\w]+)/g, '$1$2');

        // 3. Ro'yxat belgilarini tozalash:
        // Unicode bulletlar: •, ⁃, ◦, ▪, ▫, –, —, *
        text = text.replace(/^[ \t]*[•⁃◦▪▫–—−*·][ \t]+/gm, '- ');
        // Tartibli ro'yxatlar: "1) ", "1 . ", "(1) "
        text = text.replace(/^[ \t]*(?:\(?(\d+)\)|(\d+)[.)\s]+)[ \t]*/gm, '$1$2. ');

        // 4. Paragraflarni ajratish (bo'sh qatorlar bilan bo'lingan bloklar)
        const blocks = text.split(/\n\s*\n+/);

        const cleanedBlocks = blocks.map(block => {
            const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length === 0) return '';

            // Agar blok bitta sarlavha bo'lsa:
            if (lines.length === 1) {
                const single = lines[0];
                // ALL CAPS sarlavha (masalan: "LOYIHAGA KIRISH" yoki "1. BOSQICH")
                if (/^[A-Z0-9\s\u0400-\u04FF'ʻʼ\-_.:]{3,65}$/.test(single) && !single.startsWith('#') && single.length >= 3 && single === single.toUpperCase() && /[A-Z\u0400-\u04FF]/.test(single)) {
                    return `### ${single.replace(/:$/, '')}`;
                }
                // Ikki nuqta bilan tugagan qisqa satr (masalan: "Asosiy talablar:")
                if (single.endsWith(':') && single.length <= 60 && !single.startsWith('#')) {
                    return `### ${single}`;
                }
                // Tartibli boblar: "I BOB.", "1-QISM.", "1. Kirish"
                if (/^(?:[IVXLCDM]+\s+(?:BOB|QISM)|(\d+)\.\s+[A-Z\u0400-\u04FF])/i.test(single) && !single.startsWith('#')) {
                    return `## ${single}`;
                }
                return single;
            }

            // Agar blok bir nechta qatordan iborat bo'lsa:
            let merged = [];
            let currentPara = '';

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Agar qator ro'yxat elementi bo'lsa:
                if (/^(?:[-*]|\d+\.)\s+/.test(line)) {
                    if (currentPara) {
                        merged.push(currentPara);
                        currentPara = '';
                    }
                    merged.push(line);
                    continue;
                }

                // Agar qator Markdown sarlavhasi bo'lsa:
                if (/^#{1,6}\s+/.test(line)) {
                    if (currentPara) {
                        merged.push(currentPara);
                        currentPara = '';
                    }
                    merged.push(line);
                    continue;
                }

                // Agar qator butunlay ALL CAPS qisqa satr bo'lsa (ichki sarlavha):
                if (/^[A-Z0-9\s\u0400-\u04FF'ʻʼ\-_.:]{3,50}$/.test(line) && line === line.toUpperCase() && /[A-Z\u0400-\u04FF]/.test(line)) {
                    if (currentPara) {
                        merged.push(currentPara);
                        currentPara = '';
                    }
                    merged.push(`### ${line.replace(/:$/, '')}`);
                    continue;
                }

                // Oddiy matn satri - sun'iy newline'ni bitta probel bilan ulaymiz
                if (currentPara) {
                    currentPara += ' ' + line;
                } else {
                    currentPara = line;
                }
            }

            if (currentPara) {
                merged.push(currentPara);
            }

            return merged.join('\n');
        });

        // 5. Bloklarni ikki qator bo'shliq bilan birlashtirish
        let result = cleanedBlocks.filter(Boolean).join('\n\n');

        // 6. Ortiqcha probellarni tozalash
        result = result.replace(/[ \t]{2,}/g, ' ');
        result = result.replace(/\n{3,}/g, '\n\n').trim();

        return result;
    }

    function initPdfClean() {
        const input = document.getElementById('pdf-input');
        const output = document.getElementById('pdf-output');
        const cleanBtn = document.getElementById('pdf-clean-btn');
        const copyBtn = document.getElementById('pdf-copy-btn');
        const dlBtn = document.getElementById('pdf-dl-btn');
        const uploadBtn = document.getElementById('pdf-upload-btn');
        const fileInput = document.getElementById('pdf-file-input');
        if (!input || !output) return;

        function runCleaning() {
            const raw = input.value;
            updateTextMetrics(raw, 'pdf');
            if (!raw.trim()) {
                output.value = '';
                return;
            }
            output.value = cleanPdfToMarkdown(raw);
        }

        // Fayl yuklash tugmasi (.txt, .md)
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                    input.value = evt.target.result || '';
                    runCleaning();
                    notify(`"${file.name}" yuklandi va tozalashga tayyor!`, '📎');
                };
                reader.readAsText(file, 'UTF-8');
            });
        }

        if (cleanBtn) {
            cleanBtn.addEventListener('click', () => {
                if (!input.value.trim()) {
                    notify("Formatlash uchun matn kiriting!", '⚠️');
                    return;
                }
                runCleaning();
                notify("Toza Markdown formatiga o'tkazildi!", '✓');
            });
        }

        // Reaktiv input (debounce 250ms)
        let debounceTimer;
        input.addEventListener('input', () => {
            updateTextMetrics(input.value, 'pdf');
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runCleaning, 250);
        });

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (!output.value.trim()) {
                    notify("Nusxalash uchun Markdown matni yo'q!", '⚠️');
                    return;
                }
                navigator.clipboard.writeText(output.value).then(() => {
                    notify("Markdown nusxalandi!", '✓');
                }).catch(() => {
                    output.select();
                    document.execCommand('copy');
                    notify("Markdown nusxalandi!", '✓');
                });
            });
        }

        if (dlBtn) {
            dlBtn.addEventListener('click', () => {
                const content = output.value;
                if (!content.trim()) {
                    notify("Yuklab olish uchun Markdown matni yo'q!", '⚠️');
                    return;
                }

                // Sarlavhani fayl nomiga aylantirish
                const headingMatch = content.match(/^#+\s+([^\n]+)/m);
                let filename = 'hujjat-toza.md';
                if (headingMatch && headingMatch[1]) {
                    const slug = headingMatch[1]
                        .toLowerCase()
                        .replace(/[^a-z0-9\u0400-\u04FF]+/gi, '-')
                        .replace(/^-+|-+$/g, '')
                        .slice(0, 30);
                    if (slug) filename = `${slug}.md`;
                }

                const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 150);

                notify(`"${filename}" fayli yuklab olindi!`, '📥');
            });
        }

        if (input.value) {
            runCleaning();
        } else {
            updateTextMetrics('', 'pdf');
        }
    }

    // -------------------------------------------------------------------------
    // 3. REGEX TESTER & VISUALIZER (#panel-regex)
    // -------------------------------------------------------------------------
    const REGEX_PRESETS = {
        phone: {
            pattern: '(?:\\+?998|998)[-\\s]?([0-9]{2})[-\\s]?([0-9]{3})[-\\s]?([0-9]{2})[-\\s]?([0-9]{2})',
            flags: 'g',
            sample: 'Aloqa uchun raqamlar:\n+998 90 123-45-67\n998991112233\n+998-93-777-88-99\nNoto\'g\'ri format: 12345 va 99812'
        },
        email: {
            pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
            flags: 'gi',
            sample: 'Foydalanuvchi maillari:\nadmin@abdugofforov.uz\nakrom_dev@gmail.com\ninfo@company.co.uk\nNoto\'g\'ri: user@com va @yoq.uz'
        },
        url: {
            pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
            flags: 'gi',
            sample: 'Foydali havolalar:\nhttps://abdugofforov.uz/blog?id=42\nhttps://tools.abdugofforov.uz\nhttp://example.com/api/v1/users\nOddiy manzil: google.com'
        },
        date: {
            pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b',
            flags: 'g',
            sample: 'Muhim sanalar:\n2026-10-17: Loyiha ishga tushishi\n2025-05-09: Xotira kuni\n2024-12-31: Yangi yil\nNoto\'g\'ri: 2026-15-45'
        },
        ip: {
            pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
            flags: 'g',
            sample: 'Server IP manzillari:\n192.168.1.1 (Lokal router)\n10.0.0.254 (Shlyuz)\n127.0.0.1 (Loopback)\n8.8.8.8 (Google DNS)\nNoto\'g\'ri: 999.999.999.999'
        },
        hash: {
            pattern: '\\b[a-fA-F0-9]{128}\\b|\\b[a-fA-F0-9]{64}\\b',
            flags: 'gi',
            sample: 'SHA-256 va SHA-512 xeshlari (Web Crypto API):\n2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824 (SHA-256 64-belgi)\ncf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e (SHA-512 128-belgi)'
        }
    };

    function initRegex() {
        const patInput = document.getElementById('regex-pattern');
        const flagsInput = document.getElementById('regex-flags');
        const textInput = document.getElementById('regex-text');
        const matchResult = document.getElementById('regex-matches');
        const countBadge = document.getElementById('regex-count');
        if (!patInput || !flagsInput || !textInput) return;

        // Qo'shimcha IP va Hash andozalari tugmalarini tekshirish va qo'shish
        const presetContainer = patInput.closest('.tool-panel')?.querySelector('.regex-preset-btn')?.parentElement;
        if (presetContainer && !presetContainer.querySelector('[data-preset="ip"]')) {
            const ipBtn = document.createElement('button');
            ipBtn.type = 'button';
            ipBtn.className = 'tool-btn regex-preset-btn';
            ipBtn.dataset.preset = 'ip';
            ipBtn.style.cssText = 'font-size:11px; padding:3px 8px;';
            ipBtn.textContent = '🌐 IP Manzil';
            presetContainer.appendChild(ipBtn);

            const hashBtn = document.createElement('button');
            hashBtn.type = 'button';
            hashBtn.className = 'tool-btn regex-preset-btn';
            hashBtn.dataset.preset = 'hash';
            hashBtn.style.cssText = 'font-size:11px; padding:3px 8px;';
            hashBtn.textContent = '🔑 Hash';
            presetContainer.appendChild(hashBtn);
        }

        function testRegex() {
            const pat = patInput.value.trim();
            const rawFlags = flagsInput.value.trim() || 'g';
            // Flaglarni filtrlash va xavfsiz qilish
            const validFlags = Array.from(new Set(rawFlags.replace(/[^gimsuy]/g, ''))).join('');
            const text = textInput.value;

            if (!pat) {
                if (matchResult) matchResult.innerHTML = '<span style="color:var(--text-secondary);">Muntazam ifodani (Pattern) kiriting...</span>';
                if (countBadge) {
                    countBadge.textContent = '0 ta moslik';
                    countBadge.style.background = 'rgba(99,102,241,0.1)';
                    countBadge.style.color = 'var(--tools-accent)';
                }
                return;
            }

            if (!text) {
                if (matchResult) matchResult.innerHTML = '<span style="color:var(--text-secondary);">Tekshiriluvchi matn kiritilmagan...</span>';
                if (countBadge) {
                    countBadge.textContent = '0 ta moslik';
                    countBadge.style.background = 'rgba(99,102,241,0.1)';
                    countBadge.style.color = 'var(--tools-accent)';
                }
                return;
            }

            try {
                // Vizualizator barcha mosliklarni qidirishi uchun 'g' flagi zarur
                const execFlags = validFlags.includes('g') ? validFlags : validFlags + 'g';
                const re = new RegExp(pat, execFlags);

                let match;
                let matchCount = 0;
                let totalGroups = 0;
                let lastIdx = 0;
                let htmlParts = [];
                const MAX_MATCHES = 3000;

                while ((match = re.exec(text)) !== null) {
                    matchCount++;

                    // Matchdan oldingi oddiy matn
                    if (match.index > lastIdx) {
                        htmlParts.push(escapeHtml(text.slice(lastIdx, match.index)));
                    }

                    const matchedText = match[0];
                    let tooltip = `Moslik #${matchCount}`;
                    if (match.length > 1) {
                        totalGroups += (match.length - 1);
                        const groupsStr = match.slice(1).map((g, gi) => `Guruh ${gi + 1}: "${g !== undefined ? g : ''}"`).join('\n');
                        tooltip += `\n${groupsStr}`;
                    }

                    // Bo'sh string (zero-width match: ^, $, \\b)
                    if (matchedText.length === 0) {
                        htmlParts.push(`<mark class="regex-match-empty" title="${escapeHtml(tooltip)} [bo'sh moslik]">∅</mark>`);
                    } else {
                        htmlParts.push(`<mark class="regex-match" title="${escapeHtml(tooltip)}">${escapeHtml(matchedText)}</mark>`);
                    }

                    lastIdx = match.index + matchedText.length;

                    // Qotib qolmaslik (infinite loop) himoyasi:
                    // Agar zero-length match bo'lsa, re.lastIndex ni qo'lda oshiramiz
                    if (match.index === re.lastIndex) {
                        re.lastIndex++;
                        if (re.lastIndex > text.length) break;
                    }

                    if (matchCount >= MAX_MATCHES) {
                        htmlParts.push(`<span style="color:#f59e0b; font-weight:600;"> ... (limit: ${MAX_MATCHES} ta moslikdan oshdi)</span>`);
                        break;
                    }
                }

                // Matnning qolgan qismi
                if (lastIdx < text.length) {
                    htmlParts.push(escapeHtml(text.slice(lastIdx)));
                }

                if (matchResult) {
                    matchResult.innerHTML = htmlParts.join('') || '<span style="color:var(--text-secondary);">Moslik topilmadi</span>';
                }

                if (countBadge) {
                    if (matchCount > 0) {
                        let badgeText = `${matchCount} ta moslik`;
                        if (totalGroups > 0) {
                            badgeText += ` (${totalGroups} ta guruh)`;
                        }
                        countBadge.textContent = badgeText;
                        countBadge.style.background = 'rgba(16,185,129,0.12)';
                        countBadge.style.color = '#10b981';
                    } else {
                        countBadge.textContent = '0 ta moslik';
                        countBadge.style.background = 'rgba(239,68,68,0.1)';
                        countBadge.style.color = '#ef4444';
                    }
                }
            } catch (err) {
                if (matchResult) {
                    matchResult.innerHTML = `<span style="color:#ef4444; font-weight:500;">⚠️ Sintaktik xato: ${escapeHtml(err.message)}</span>`;
                }
                if (countBadge) {
                    countBadge.textContent = 'Xatolik';
                    countBadge.style.background = 'rgba(239,68,68,0.15)';
                    countBadge.style.color = '#ef4444';
                }
            }
        }

        patInput.addEventListener('input', testRegex);
        flagsInput.addEventListener('input', testRegex);
        textInput.addEventListener('input', testRegex);

        // Delegatsiya orqali barcha andozalar tugmalariga hodisa ulash
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.regex-preset-btn');
            if (!btn) return;
            const presetKey = btn.dataset.preset;
            const p = REGEX_PRESETS[presetKey];
            if (p) {
                patInput.value = p.pattern;
                flagsInput.value = p.flags;
                textInput.value = p.sample;
                testRegex();
                notify(`"${btn.textContent.trim()}" andozasi yuklandi!`, '✓');
            }
        });

        if (patInput.value && textInput.value) {
            testRegex();
        }
    }

    // -------------------------------------------------------------------------
    // BOSHLANG'ICH INIZIALIZATSIYA
    // -------------------------------------------------------------------------
    function initAll() {
        injectSuiteStyles();
        initSpellcheck();
        initPdfClean();
        initRegex();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // Global eksport
    window.ToolsTextSuite = {
        init: initAll,
        initSpellcheck,
        initPdfClean,
        initRegex,
        transliterateLatinToCyrillic,
        transliterateCyrillicToLatin,
        cleanPdfToMarkdown,
        normalizeApostrophes,
        matchCase,
        UZBEK_DICTIONARY,
        REGEX_PRESETS
    };

})();
