// ===== 2. SMART MULTI-LANGUAGE DAILY FORTUNE & MOTIVATIONAL QUOTE WIDGET =====
(function() {
    window.App = window.App || {};

    const QUOTES_DB = {
        uz: [
            { quote: "Muvaffaqiyat — bu har kungi kichik intilishlarning yig'indisidir.", author: "Robert Collier", de: "Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden." },
            { quote: "Katta maqsadlarga erishish uchun nafaqat harakat qilish, balki orzu qilish va qat'iy ishonish ham kerak.", author: "Anatole France", de: "Um große Dinge zu erreichen, müssen wir nicht nur handeln, sondern auch träumen und glauben." },
            { quote: "Kelajak bugun nima qilayotganingizga bog'liq, ertaga nima qilmoqchi ekanligingizga emas.", author: "Mahatma Gandhi", de: "Die Zukunft hängt davon ab, was wir heute tun." },
            { quote: "Qiyinchiliklar insonni sindirish uchun emas, uning ichki qudratini uyg'otish uchun keladi.", author: "Johann Wolfgang von Goethe", de: "Schwierigkeiten sind da, um überwunden zu werden und den Charakter zu stärken." },
            { quote: "Bilim olishga kiritilgan sarmoya doimo eng yuqori foyda keltiradi.", author: "Benjamin Franklin", de: "Eine Investition in Wissen bringt immer noch die besten Zinsen." },
            { quote: "O'zgarishni boshqalardan kutma, dunyoda ko'rmoqchi bo'lgan o'zgarishing o'zing bo'l.", author: "Mahatma Gandhi", de: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt." },
            { quote: "Yiqilishdan qo'rqma, qayta turmaslikdan qo'rq. Haqiqiy kuch har yiqilganda qayta ko'tarilishdadir.", author: "Konfutsiy", de: "Der größte Ruhm im Leben liegt darin, jedes Mal wieder aufzustehen." },
            { quote: "Vaqtingiz cheklangan, shuning uchun uni boshqalarning hayotini yashashga sarflamang.", author: "Steve Jobs", de: "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben." },
            { quote: "Intizom — bu xohishing bilan erishmoqchi bo'lgan maqsading o'rtasidagi ko'prikdir.", author: "Jim Rohn", de: "Disziplin ist die Brücke zwischen deinen Zielen und ihren Erfolgen." },
            { quote: "Muvaffaqiyatli inson bo'lishga emas, balki qadrli va foydali inson bo'lishga intil.", author: "Albert Einstein", de: "Versuche nicht, ein erfolgreicher, sondern ein wertvoller Mensch zu sein." }
        ],
        ru: [
            { quote: "Успех — это сумма маленьких усилий, повторяющихся изо дня в день.", author: "Роберт Кольер", de: "Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden." },
            { quote: "Будущее зависит от того, что вы делаете сегодня.", author: "Махатма Ганди", de: "Die Zukunft hängt davon ab, was wir heute tun." },
            { quote: "Трудности существуют, чтобы закалять наш дух и делать нас сильнее.", author: "Иоганн Вольфганг фон Гёте", de: "Schwierigkeiten sind da, um überwunden zu werden und den Charakter zu stärken." },
            { quote: "Инвестиции в знания всегда приносят наибольший доход.", author: "Бенджамин Франклин", de: "Eine Investition in Wissen bringt immer noch die besten Zinsen." },
            { quote: "Будьте тем изменением, которое вы хотите видеть в этом мире.", author: "Махатма Ганди", de: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt." },
            { quote: "Не бойся падать, бойся не подняться. Сила в том, чтобы вставать каждый раз.", author: "Конфуций", de: "Der größte Ruhm im Leben liegt darin, jedes Mal wieder aufzustehen." },
            { quote: "Ваше время ограничено, не тратьте его, живя чужой жизнью.", author: "Стив Джобс", de: "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben." },
            { quote: "Дисциплина — это мост между целями и достижениями.", author: "Джим Рон", de: "Disziplin ist die Brücke zwischen deinen Zielen und ihren Erfolgen." },
            { quote: "Чтобы достичь великих целей, нужно не только действовать, но и мечтать.", author: "Анатоль Франс", de: "Um große Dinge zu erreichen, müssen wir nicht nur handeln, sondern auch träumen." },
            { quote: "Стремись не к успеху, а к тому, чтобы твоя жизнь имела смысл и ценность.", author: "Альберт Эйнштейн", de: "Versuche nicht, ein erfolgreicher, sondern ein wertvoller Mensch zu sein." }
        ],
        de: [
            { quote: "Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden.", author: "Robert Collier", de: "Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden." },
            { quote: "Die Zukunft hängt davon ab, was wir heute tun.", author: "Mahatma Gandhi", de: "Die Zukunft hängt davon ab, was wir heute tun." },
            { quote: "Schwierigkeiten sind da, um überwunden zu werden und den Charakter zu stärken.", author: "Johann Wolfgang von Goethe", de: "Schwierigkeiten sind da, um überwunden zu werden und den Charakter zu stärken." },
            { quote: "Eine Investition in Wissen bringt immer noch die besten Zinsen.", author: "Benjamin Franklin", de: "Eine Investition in Wissen bringt immer noch die besten Zinsen." },
            { quote: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt.", author: "Mahatma Gandhi", de: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt." },
            { quote: "Der größte Ruhm im Leben liegt darin, jedes Mal wieder aufzustehen.", author: "Konfuzius", de: "Der größte Ruhm im Leben liegt darin, jedes Mal wieder aufzustehen." },
            { quote: "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.", author: "Steve Jobs", de: "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben." },
            { quote: "Disziplin ist die Brücke zwischen deinen Zielen und ihren Erfolgen.", author: "Jim Rohn", de: "Disziplin ist die Brücke zwischen deinen Zielen und ihren Erfolgen." },
            { quote: "Um große Dinge zu erreichen, müssen wir träumen sowie handeln.", author: "Anatole France", de: "Um große Dinge zu erreichen, müssen wir träumen sowie handeln." },
            { quote: "Versuche nicht, ein erfolgreicher, sondern ein wertvoller Mensch zu sein.", author: "Albert Einstein", de: "Versuche nicht, ein erfolgreicher, sondern ein wertvoller Mensch zu sein." }
        ],
        en: [
            { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier", de: "Erfolg ist die Summe kleiner Anstrengungen, die Tag für Tag wiederholt werden." },
            { quote: "The future depends on what you do today.", author: "Mahatma Gandhi", de: "Die Zukunft hängt davon ab, was wir heute tun." },
            { quote: "Difficulties are meant to rouse, not discourage. The human spirit is to grow strong by conflict.", author: "Johann Wolfgang von Goethe", de: "Schwierigkeiten sind da, um überwunden zu werden und den Charakter zu stärken." },
            { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", de: "Eine Investition in Wissen bringt immer noch die besten Zinsen." },
            { quote: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi", de: "Sei du selbst die Veränderung, die du dir wünschst für diese Welt." },
            { quote: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius", de: "Der größte Ruhm im Leben liegt darin, jedes Mal wieder aufzustehen." },
            { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", de: "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben." },
            { quote: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn", de: "Disziplin ist die Brücke zwischen deinen Zielen und ihren Erfolgen." },
            { quote: "To accomplish great things, we must not only act, but also dream; not only plan, but also believe.", author: "Anatole France", de: "Um große Dinge zu erreichen, müssen wir träumen sowie handeln." },
            { quote: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein", de: "Versuche nicht, ein erfolgreicher, sondern ein wertvoller Mensch zu sein." }
        ]
    };

    let userCountryLang = 'uz';

    async function detectUserLanguage() {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            const country = (data.country_code || '').toLowerCase();
            if (country === 'uz') userCountryLang = 'uz';
            else if (['ru', 'by', 'kz'].includes(country)) userCountryLang = 'ru';
            else if (['de', 'at', 'ch'].includes(country)) userCountryLang = 'de';
            else userCountryLang = 'en';
        } catch(e) {
            userCountryLang = (window.i18n && typeof i18n.getLang === 'function') ? i18n.getLang() : 'uz';
        }
    }

    function getPinnedQuote(pool) {
        const today = new Date().toDateString();
        try {
            const saved = localStorage.getItem('user_pinned_quote');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.date === today && typeof parsed.index === 'number' && pool[parsed.index]) {
                    return { item: pool[parsed.index], index: parsed.index };
                }
            }
        } catch(e) {}

        const randIndex = Math.floor(Math.random() * pool.length);
        savePinnedQuote(randIndex, today);
        return { item: pool[randIndex], index: randIndex };
    }

    function savePinnedQuote(index, date) {
        try {
            localStorage.setItem('user_pinned_quote', JSON.stringify({ index, date }));
        } catch(e) {}
    }

    function speakGermanText(text) {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'de-DE';
            u.rate = 0.9;
            const audioBtn = document.getElementById('quote-audio-btn');
            if (audioBtn) {
                u.onstart = () => audioBtn.classList.add('playing');
                u.onend = () => audioBtn.classList.remove('playing');
                u.onerror = () => audioBtn.classList.remove('playing');
            }
            window.speechSynthesis.speak(u);
        } catch(e) {}
    }

    function nextQuote() {
        const lang = userCountryLang || 'uz';
        const pool = QUOTES_DB[lang] || QUOTES_DB.uz;
        const today = new Date().toDateString();
        const randIndex = Math.floor(Math.random() * pool.length);
        savePinnedQuote(randIndex, today);
        renderDailyFortuneWidget(true);
    }

    async function renderDailyFortuneWidget(forceUpdate = false) {
        const hero = document.querySelector('.hero') || document.getElementById('functional-row');
        if (!hero) return;

        let wrap = document.getElementById('fortune-widget-wrap');
        if (!wrap) {
            wrap = document.createElement('div');
            wrap.id = 'fortune-widget-wrap';
            wrap.className = 'fortune-widget-wrap container';
            hero.parentNode.insertBefore(wrap, hero.nextSibling);
        }

        await detectUserLanguage();
        const lang = userCountryLang || 'uz';
        const pool = QUOTES_DB[lang] || QUOTES_DB.uz;
        const { item } = getPinnedQuote(pool);

        const cleanQuote = (item.quote || '').replace(/^["“”„]+|["“”„]+$/g, '');
        const cleanDe = (item.de || '').replace(/^["“”„]+|["“”„]+$/g, '');

        wrap.innerHTML = `
            <article class="fortune-card-3d atelier-quote-card" id="fortune-card">
                <header class="atelier-card-header">
                    <span class="fortune-quote-badge atelier-tag" id="quote-category-badge">✦ KUN HIKMATI · FILOSOFIYA</span>
                    <span class="atelier-edition-label">KAY KUNDALIGI · ATELIER</span>
                </header>

                <div class="atelier-quote-body">
                    <blockquote class="fortune-quote-text atelier-quote-text" id="quote-text">“${cleanQuote}”</blockquote>
                    <cite class="fortune-quote-author atelier-quote-author" id="quote-author">${item.author || ''}</cite>
                </div>

                <div class="atelier-german-folio" id="quote-de-wrap">
                    <div class="atelier-german-header">
                        <span class="atelier-flag-badge">🇩🇪 DE · PARALLEL</span>
                        <span>Nemischa Asl Nusxa / Tarjima</span>
                    </div>
                    <p class="atelier-german-text" id="quote-de-text">„${cleanDe}“</p>
                </div>

                <footer class="atelier-actions-bar">
                    <button class="fortune-action-btn atelier-audio-player" id="quote-audio-btn" type="button" aria-label="Nemischa talaffuzni eshitish" data-click="speakCurrentQuote('${cleanDe.replace(/'/g, "\\'")}')">
                        <span class="atelier-play-disc" aria-hidden="true">
                            <svg viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                        </span>
                        <span class="atelier-soundwave" aria-hidden="true">
                            <span class="bar"></span><span class="bar"></span><span class="bar"></span><span class="bar"></span>
                        </span>
                        <span class="atelier-audio-label">Talaffuzni eshitish</span>
                    </button>
                    <button class="atelier-btn-secondary" id="quote-next-btn" type="button" aria-label="Boshqa iqtibos tanlash" data-click="nextIndividualQuote()">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                        </svg>
                        <span>Boshqa hikmat</span>
                    </button>
                </footer>
            </article>
        `;
    }

    function speakCurrent(text) {
        speakGermanText(text);
        if (App.Gamification) App.Gamification.addXP(10);
    }

    // Module Export
    App.Quote = { render: renderDailyFortuneWidget, next: nextQuote, speak: speakCurrent };
    window.renderDailyFortuneWidget = renderDailyFortuneWidget;
    window.nextIndividualQuote = nextQuote;
    window.speakCurrentQuote = speakCurrent;

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(renderDailyFortuneWidget, 300);
    });
})();
