// ===== I18N — KO'P TILLILIK (UZ / RU / DE / EN) =====
// Faqat interfeys (UI) matnlari tarjima qilinadi. Foydalanuvchi kontenti
// (postlar, test/kartochka mazmuni) o'z tilida qoladi.

(function () {
    const translations = {
        uz: {
            "nav.home": "Bosh sahifa",
            "nav.projects": "Loyihalar",
            "nav.contact": "Kontakt",
            "nav.write": "Yozish",
            "hero.subtitle": "Shaxsiy blog & Hikoyalar",
            "hero.title": "Vaqt sarguzashtlari va unutilmas xotiralar kundaligi.",
            "hero.subtitle.projects": "Ijodiy Loyihalar",
            "hero.title.projects": "Amalga oshirilgan g'oyalar, dizaynlar va dasturiy ishlar.",
            "search.placeholder": "Kundalikdan qidirish...",
            "filter.all": "Barchasi",
            "filter.day": "🌅 Kun",
            "filter.learned": "📚 O'rganganlarim",
            "filter.plans": "🎯 Rejalar",
            "filter.music": "🎵 Musiqa",
            "filter.flashcards": "🃏 Kartochka",
            "footer.rights": "© 2026 Abdugofforov. Barcha huquqlar himoyalangan.",
            "contact.title": "Bog'lanish",
            "contact.text": "Savol, taklif yoki hamkorlik uchun men bilan bog'laning.",
            "form.artist": "Ijrochi",
            "form.musicLink": "Havola (YouTube / Telegram)",
            "form.musicHint": "YouTube havolasi kompyuterda saytni tark etmasdan pleyerda ijro etiladi. Telefonda havola yangi oynada ochiladi.",
            "music.listen": "▶ Tinglash",
            "music.open": "🔗 Havolani ochish",
            "music.by": "Ijrochi",
            "music.desktopOnly": "Ichki pleyer faqat kompyuterda ishlaydi",
            "fc.title": "So'z va bilim kartochkalari",
            "fc.subtitle": "Kartani bosib aylantiring — old tomonda savol, orqasida javob",
            "fc.flip": "Aylantirish",
            "fc.next": "Keyingi →",
            "fc.prev": "← Oldingi",
            "fc.shuffle": "🔀 Aralashtirish",
            "fc.back": "← Kartochkalar",
            "fc.tapHint": "Javobni ko'rish uchun bosing",
            "deck.de_uz": "🇩🇪→🇺🇿 So'zlar",
            "deck.uz_de": "🇺🇿→🇩🇪 So'zlar",
            "deck.grammar": "📐 Grammatika",
            "deck.sentences": "💬 Gaplar",
            "deck.quotes": "🏛️ Faylasuf gaplari"
        },
        ru: {
            "nav.home": "Главная",
            "nav.projects": "Проекты",
            "nav.contact": "Контакты",
            "nav.write": "Написать",
            "hero.subtitle": "Личный блог и истории",
            "hero.title": "Дневник путешествий во времени и незабываемых воспоминаний.",
            "hero.subtitle.projects": "Творческие проекты",
            "hero.title.projects": "Воплощённые идеи, дизайны и программные работы.",
            "search.placeholder": "Поиск по дневнику...",
            "filter.all": "Все",
            "filter.day": "🌅 День",
            "filter.learned": "📚 Изучил",
            "filter.plans": "🎯 Планы",
            "filter.music": "🎵 Музыка",
            "filter.flashcards": "🃏 Карточки",
            "footer.rights": "© 2026 Abdugofforov. Все права защищены.",
            "contact.title": "Связаться",
            "contact.text": "Свяжитесь со мной по вопросам, предложениям или сотрудничеству.",
            "form.artist": "Исполнитель",
            "form.musicLink": "Ссылка (YouTube / Telegram)",
            "form.musicHint": "Ссылка YouTube воспроизводится в плеере без ухода с сайта на компьютере. На телефоне ссылка откроется в новом окне.",
            "music.listen": "▶ Слушать",
            "music.open": "🔗 Открыть ссылку",
            "music.by": "Исполнитель",
            "music.desktopOnly": "Встроенный плеер работает только на компьютере",
            "fc.title": "Карточки слов и знаний",
            "fc.subtitle": "Нажмите на карточку — спереди вопрос, сзади ответ",
            "fc.flip": "Перевернуть",
            "fc.next": "Далее →",
            "fc.prev": "← Назад",
            "fc.shuffle": "🔀 Перемешать",
            "fc.back": "← Карточки",
            "fc.tapHint": "Нажмите, чтобы увидеть ответ",
            "deck.de_uz": "🇩🇪→🇺🇿 Слова",
            "deck.uz_de": "🇺🇿→🇩🇪 Слова",
            "deck.grammar": "📐 Грамматика",
            "deck.sentences": "💬 Предложения",
            "deck.quotes": "🏛️ Цитаты философов"
        },
        de: {
            "nav.home": "Startseite",
            "nav.projects": "Projekte",
            "nav.contact": "Kontakt",
            "nav.write": "Schreiben",
            "hero.subtitle": "Persönlicher Blog & Geschichten",
            "hero.title": "Ein Tagebuch der Zeitreisen und unvergesslichen Erinnerungen.",
            "hero.subtitle.projects": "Kreative Projekte",
            "hero.title.projects": "Umgesetzte Ideen, Designs und Softwarearbeiten.",
            "search.placeholder": "Im Tagebuch suchen...",
            "filter.all": "Alle",
            "filter.day": "🌅 Tag",
            "filter.learned": "📚 Gelernt",
            "filter.plans": "🎯 Pläne",
            "filter.music": "🎵 Musik",
            "filter.flashcards": "🃏 Karten",
            "footer.rights": "© 2026 Abdugofforov. Alle Rechte vorbehalten.",
            "contact.title": "Kontakt",
            "contact.text": "Kontaktiere mich für Fragen, Vorschläge oder Zusammenarbeit.",
            "form.artist": "Interpret",
            "form.musicLink": "Link (YouTube / Telegram)",
            "form.musicHint": "Der YouTube-Link wird am Computer im Player abgespielt, ohne die Seite zu verlassen. Auf dem Handy öffnet er sich in einem neuen Fenster.",
            "music.listen": "▶ Anhören",
            "music.open": "🔗 Link öffnen",
            "music.by": "Interpret",
            "music.desktopOnly": "Der eingebaute Player funktioniert nur am Computer",
            "fc.title": "Wort- und Wissenskarten",
            "fc.subtitle": "Karte antippen zum Umdrehen — vorne Frage, hinten Antwort",
            "fc.flip": "Umdrehen",
            "fc.next": "Weiter →",
            "fc.prev": "← Zurück",
            "fc.shuffle": "🔀 Mischen",
            "fc.back": "← Karten",
            "fc.tapHint": "Tippen, um die Antwort zu sehen",
            "deck.de_uz": "🇩🇪→🇺🇿 Wörter",
            "deck.uz_de": "🇺🇿→🇩🇪 Wörter",
            "deck.grammar": "📐 Grammatik",
            "deck.sentences": "💬 Sätze",
            "deck.quotes": "🏛️ Philosophen-Zitate"
        },
        en: {
            "nav.home": "Home",
            "nav.projects": "Projects",
            "nav.contact": "Contact",
            "nav.write": "Write",
            "hero.subtitle": "Personal blog & Stories",
            "hero.title": "A diary of time adventures and unforgettable memories.",
            "hero.subtitle.projects": "Creative Projects",
            "hero.title.projects": "Realized ideas, designs and software works.",
            "search.placeholder": "Search the diary...",
            "filter.all": "All",
            "filter.day": "🌅 Day",
            "filter.learned": "📚 Learned",
            "filter.plans": "🎯 Plans",
            "filter.music": "🎵 Music",
            "filter.flashcards": "🃏 Flashcards",
            "footer.rights": "© 2026 Abdugofforov. All rights reserved.",
            "contact.title": "Get in touch",
            "contact.text": "Contact me for questions, suggestions or collaboration.",
            "form.artist": "Artist",
            "form.musicLink": "Link (YouTube / Telegram)",
            "form.musicHint": "A YouTube link plays in the player without leaving the site on desktop. On mobile the link opens in a new tab.",
            "music.listen": "▶ Listen",
            "music.open": "🔗 Open link",
            "music.by": "Artist",
            "music.desktopOnly": "The built-in player works on desktop only",
            "fc.title": "Word & knowledge flashcards",
            "fc.subtitle": "Tap a card to flip — question on front, answer on back",
            "fc.flip": "Flip",
            "fc.next": "Next →",
            "fc.prev": "← Prev",
            "fc.shuffle": "🔀 Shuffle",
            "fc.back": "← Flashcards",
            "fc.tapHint": "Tap to reveal the answer",
            "deck.de_uz": "🇩🇪→🇺🇿 Words",
            "deck.uz_de": "🇺🇿→🇩🇪 Words",
            "deck.grammar": "📐 Grammar",
            "deck.sentences": "💬 Sentences",
            "deck.quotes": "🏛️ Philosopher quotes"
        }
    };

    const SUPPORTED = ['uz', 'ru', 'de', 'en'];

    function getLang() {
        const saved = localStorage.getItem('site_lang');
        return SUPPORTED.includes(saved) ? saved : 'uz';
    }

    function t(key) {
        const lang = getLang();
        return (translations[lang] && translations[lang][key])
            || translations.uz[key]
            || key;
    }

    function applyStaticTranslations(root) {
        const scope = root || document;
        scope.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            if (val) el.textContent = val;
        });
        scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const val = t(key);
            if (val) el.setAttribute('placeholder', val);
        });
    }

    function setLang(lang) {
        if (!SUPPORTED.includes(lang)) lang = 'uz';
        localStorage.setItem('site_lang', lang);
        document.documentElement.setAttribute('lang', lang);
        applyStaticTranslations();
        // app.js dinamik qismlarni qayta chizishi uchun hodisa
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }

    // Global API
    window.i18n = { t, getLang, setLang, applyStaticTranslations, supported: SUPPORTED };
})();
