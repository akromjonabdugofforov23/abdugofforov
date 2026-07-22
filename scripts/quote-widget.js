// ===== 2. SMART MULTI-LANGUAGE DAILY FORTUNE & MOTIVATIONAL QUOTE WIDGET =====
(function() {
    const QUOTES_DB = {
        uz: [
            { quote: "Mag'lubiyat to'xtaganingda sodir bo'ladi. Har kuni kichik bo'lsa ham qadam tashla!", author: "Stoyatsizm Hikmati", de: "Es spielt keine Rolle, wie langsam du gehst, solange du nicht anhältst." },
            { quote: "Nolish variant emas, harakat variant! Bugungi intizoming ertangi erkinligingdir.", author: "Marcus Aurelius", de: "Disziplin heute ist Freiheit morgen." },
            { quote: "Qiyinchilik kelganda chekinma, bu seni kuchliroq bo'lishing uchun imkoniyatdir!", author: "Friedrich Nietzsche", de: "Was mich nicht umbringt, macht mich stärker." },
            { quote: "Chegara faqat hayolingda. Har kuni o'zingdan 1% yaxshiroq bo'l!", author: "Kaizen Falsafasi", de: "Jeden Tag 1% besser als gestern." }
        ],
        ru: [
            { quote: "Поражение происходит только тогда, когда ты останавливаешься. Иди вперёд каждый день!", author: "Мудрость Стоиков", de: "Es spielt keine Rolle, wie langsam du gehst, solange du nicht anhältst." },
            { quote: "Жалобы — это не вариант, только действия имеют значение!", author: "Марк Аврелий", de: "Disziplin heute ist Freiheit morgen." },
            { quote: "Что нас не убивает, то делает нас сильнее. Преодолевай любые препятствия!", author: "Фридрих Ницше", de: "Was mich nicht umbringt, macht mich stärker." }
        ],
        de: [
            { quote: "Es spielt keine Rolle, wie langsam du gehst, solange du nicht anhältst.", author: "Konfuzius", de: "Stärke kommt nicht aus körperlicher Kraft, sondern aus unbeugsamem Willen." },
            { quote: "Was mich nicht umbringt, macht mich stärker. Gib niemals auf!", author: "Friedrich Nietzsche", de: "Wer ein Warum zum Leben hat, erträgt fast jedes Wie." },
            { quote: "Disziplin heute bedeutet Freiheit morgen. Handle jetzt!", author: "Stoiker Weisheit", de: "Der Weg ist das Ziel." }
        ],
        en: [
            { quote: "It does not matter how slowly you go as long as you do not stop. Keep pushing!", author: "Stoic Wisdom", de: "Es spielt keine Rolle, wie langsam du gehst, solange du nicht anhältst." },
            { quote: "Complaining is not a strategy. Action is the only antidote to fear!", author: "Marcus Aurelius", de: "Disziplin heute ist Freiheit morgen." },
            { quote: "What doesn't kill you makes you stronger. Overcome every challenge!", author: "Friedrich Nietzsche", de: "Was mich nicht umbringt, macht mich stärker." }
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

    function getRandomQuote() {
        const lang = userCountryLang || 'uz';
        const pool = QUOTES_DB[lang] || QUOTES_DB.uz;
        const index = Math.floor(Math.random() * pool.length);
        return pool[index];
    }

    function speakGermanText(text) {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'de-DE';
            u.rate = 0.9;
            window.speechSynthesis.speak(u);
        } catch(e) {}
    }

    window.renderDailyFortuneWidget = async function() {
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
        const item = getRandomQuote();

        wrap.innerHTML = `
            <div class="fortune-card-3d" id="fortune-card">
                <span class="fortune-quote-badge">💡 BUGUNGI MOTIVATSIYA & KUN IQTIBOSI</span>
                <div class="fortune-quote-text">"${item.quote}"</div>
                <div class="fortune-quote-author">— ${item.author}</div>
                
                <div style="font-size:13px; color:#a7f3d0; margin-bottom:14px; background:rgba(0,0,0,0.3); padding:8px 14px; border-radius:10px; display:inline-block;">
                    🇩🇪 Nemischa O'rganish Iqtibosi: <b>"${item.de}"</b>
                </div>

                <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                    <button class="fortune-action-btn" onclick="speakCurrentQuote('${item.de.replace(/'/g, "\\'")}')">
                        🔊 Nemischa Audio Eshitish
                    </button>
                    <button class="fortune-action-btn" style="background:linear-gradient(90deg, #3b82f6, #10b981);" onclick="renderDailyFortuneWidget()">
                        🎲 Yangi Iqtibos
                    </button>
                </div>
            </div>
        `;
    };

    window.speakCurrentQuote = function(text) {
        speakGermanText(text);
        if (window.Gamification) Gamification.addXP(10);
    };

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(renderDailyFortuneWidget, 300);
    });
})();
