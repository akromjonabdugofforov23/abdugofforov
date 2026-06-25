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
            "nav.login": "Kirish",
            "hero.subtitle": "Shaxsiy blog & rivojlanish uchun",
            "hero.title": "",
            "hero.subtitle.projects": "Ijodiy Loyihalar",
            "hero.title.projects": "Amalga oshirilgan g'oyalar, dizaynlar va dasturiy ishlar.",
            "search.placeholder": "🔍 Qidirish...",
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
            "nav.login": "Войти",
            "hero.subtitle": "Lichnyy blog i razvitiye",
            "hero.title": "",
            "hero.subtitle.projects": "Творческие проекты",
            "hero.title.projects": "Воплощённые идеи, дизайны и программные работы.",
            "search.placeholder": "🔍 Поиск...",
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
            "nav.login": "Anmelden",
            "hero.subtitle": "Personlicher Blog & Entwicklung",
            "hero.title": "",
            "hero.subtitle.projects": "Kreative Projekte",
            "hero.title.projects": "Umgesetzte Ideen, Designs und Softwarearbeiten.",
            "search.placeholder": "🔍 Suchen...",
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
            "nav.login": "Sign in",
            "hero.subtitle": "Personal blog & development",
            "hero.title": "",
            "hero.subtitle.projects": "Creative Projects",
            "hero.title.projects": "Realized ideas, designs and software works.",
            "search.placeholder": "🔍 Search...",
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

    // ============================================================
    // SVG BAYROQLAR — Aniq, barcha qurilmalarda bir xil ko'rinadi
    // (emoji bayroqlar Windows va eski brauzerlarda ko'rinmaydi)
    // ============================================================
    const FLAGS = {
        uz: `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="24" height="16" fill="#1EB53A"/>
            <rect width="24" height="5.33" fill="#0099B5"/>
            <rect y="5.33" width="24" height="5.33" fill="#fff"/>
            <rect y="5.05" width="24" height="0.28" fill="#CE1126"/>
            <rect y="10.66" width="24" height="0.28" fill="#CE1126"/>
            <circle cx="4.5" cy="2.7" r="1.25" fill="#fff"/>
            <circle cx="5.1" cy="2.7" r="1.05" fill="#0099B5"/>
        </svg>`,
        ru: `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="24" height="5.33" fill="#fff"/>
            <rect y="5.33" width="24" height="5.33" fill="#0039A6"/>
            <rect y="10.66" width="24" height="5.34" fill="#D52B1E"/>
        </svg>`,
        de: `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="24" height="5.33" fill="#000"/>
            <rect y="5.33" width="24" height="5.33" fill="#DD0000"/>
            <rect y="10.66" width="24" height="5.34" fill="#FFCE00"/>
        </svg>`,
        en: `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <clipPath id="gb-clip"><rect width="24" height="16"/></clipPath>
            <g clip-path="url(#gb-clip)">
                <rect width="24" height="16" fill="#012169"/>
                <path d="M0,0 L24,16 M24,0 L0,16" stroke="#fff" stroke-width="3"/>
                <path d="M0,0 L24,16" stroke="#C8102E" stroke-width="1.5" clip-path="polygon(0 0, 50% 0, 50% 100%, 0 100%)"/>
                <path d="M24,0 L0,16" stroke="#C8102E" stroke-width="1.5" clip-path="polygon(50% 0, 100% 0, 100% 100%, 50% 100%)"/>
                <path d="M12,0 V16 M0,8 H24" stroke="#fff" stroke-width="4"/>
                <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" stroke-width="2"/>
            </g>
        </svg>`
    };

    const LANG_LABELS = {
        uz: { code: 'UZ', name: "O'zbekcha" },
        ru: { code: 'RU', name: "Русский" },
        de: { code: 'DE', name: "Deutsch" },
        en: { code: 'EN', name: "English" }
    };

    function flag(lang) {
        return FLAGS[lang] || '';
    }

    // Custom til dropdown qurish (mobil va veb uchun bir xil komponent)
    function buildLangDropdown(container) {
        if (!container) return;
        const cur = getLang();
        const meta = LANG_LABELS[cur] || LANG_LABELS.uz;

        container.innerHTML = `
            <button class="lang-toggle" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Til tanlash">
                <span class="lang-flag" data-lang-flag>${flag(cur)}</span>
                <span class="lang-code" data-lang-code>${meta.code}</span>
                <svg class="lang-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 4l3 3 3-3" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <ul class="lang-menu" role="listbox">
                ${SUPPORTED.map(l => {
                    const m = LANG_LABELS[l] || { code: l.toUpperCase(), name: l };
                    return `<li role="option" data-value="${l}" ${l === cur ? 'aria-selected="true"' : ''}>
                        <span class="lang-flag">${flag(l)}</span>
                        <span class="lang-code">${m.code}</span>
                        <span class="lang-name">${m.name}</span>
                    </li>`;
                }).join('')}
            </ul>
        `;

        const toggle = container.querySelector('.lang-toggle');
        const menu = container.querySelector('.lang-menu');

        function open() {
            container.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            // Outside click handler
            setTimeout(() => document.addEventListener('click', onDocClick), 0);
        }
        function close() {
            container.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', onDocClick);
        }
        function onDocClick(e) {
            if (!container.contains(e.target)) close();
        }

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            container.classList.contains('open') ? close() : open();
        });

        menu.addEventListener('click', (e) => {
            const li = e.target.closest('li[role="option"]');
            if (!li) return;
            const val = li.getAttribute('data-value');
            // UI ni yangilash
            container.querySelectorAll('li[role="option"]').forEach(x => x.removeAttribute('aria-selected'));
            li.setAttribute('aria-selected', 'true');
            const m2 = LANG_LABELS[val] || { code: val.toUpperCase() };
            const fEl = toggle.querySelector('[data-lang-flag]');
            const cEl = toggle.querySelector('[data-lang-code]');
            if (fEl) fEl.innerHTML = flag(val);
            if (cEl) cEl.textContent = m2.code;
            close();
            setLang(val);
        });

        // Klaviatura: Escape = yopish
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }

    window.i18n.flag = flag;
    window.i18n.buildLangDropdown = buildLangDropdown;
})();
