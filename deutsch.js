// ============================================================
// DEUTSCH AKADEMIYASI — DEUTSCH.ABDUGOFFOROV.UZ
// Mustaqil Nemis Tili Ta'lim Platformasi Mantiqi
// ============================================================

// Global Xavfsiz Yordamchi Funksiyalar (XSS & CSP Himoyasi)
window.escapeHTML = window.escapeHTML || function(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

window.escapeAttr = window.escapeAttr || function(s) {
    return String(s || '').replace(/['"\\<>&]/g, '');
};

// Safe Data-Click Dispatcher (CSP Compliant - Zero Eval)
function runDataClickAction(expr, event) {
    if (!expr) return;
    expr = expr.trim();
    const m = expr.match(/^([a-zA-Z0-9_$]+(?:\.[a-zA-Z0-9_$]+)*)\s*\(([\s\S]*)\)\s*;?$/);
    if (!m) return;
    const path = m[1].split('.');
    let fn = window;
    let ctx = window;
    for (let i = 0; i < path.length; i++) {
        ctx = fn;
        fn = fn[path[i]];
        if (!fn) return;
    }
    if (typeof fn !== 'function') return;

    const argsStr = m[2].trim();
    if (!argsStr) {
        fn.call(ctx);
        return;
    }
    const args = [];
    const argRegex = /'([^']*)'|"([^"]*)"|(-?\d+(?:\.\d+)?)|(true|false)|(null|undefined)|(event)/g;
    let am;
    while ((am = argRegex.exec(argsStr)) !== null) {
        if (am[1] !== undefined) args.push(am[1]);
        else if (am[2] !== undefined) args.push(am[2]);
        else if (am[3] !== undefined) args.push(Number(am[3]));
        else if (am[4] !== undefined) args.push(am[4] === 'true');
        else if (am[5] !== undefined) args.push(am[5] === 'null' ? null : undefined);
        else if (am[6] !== undefined) args.push(event);
    }
    fn.apply(ctx, args);
}
window.runDataClickAction = runDataClickAction;

(function() {
    'use strict';

    // Theme Management
    const themeBtn = document.getElementById('theme-btn');
    function initTheme() {
        const savedTheme = localStorage.getItem('abdu_theme') || localStorage.getItem('kay_theme') || localStorage.getItem('abdugofforov_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            try {
                localStorage.setItem('abdu_theme', next);
                localStorage.setItem('kay_theme', next);
                localStorage.setItem('abdugofforov_theme', next);
            } catch (_) {}
        });
    }
    window.addEventListener('storage', (e) => {
        if (e.key === 'abdu_theme' || e.key === 'kay_theme' || e.key === 'abdugofforov_theme') {
            if (e.newValue) document.documentElement.setAttribute('data-theme', e.newValue);
        }
    });
    initTheme();

    // Carousel Logic
    function initCarousel() {
        const track = document.getElementById('carousel-track');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const dotsContainer = document.getElementById('carousel-dots');
        if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

        const slides = track.querySelectorAll('.carousel-slide');
        if (!slides.length) return;

        let currentIndex = 0;
        let timer = null;

        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Slayd ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        function update() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        }

        function goTo(index) {
            currentIndex = (index + slides.length) % slides.length;
            update();
            resetAutoplay();
        }

        function next() { goTo(currentIndex + 1); }
        function prev() { goTo(currentIndex - 1); }

        prevBtn.addEventListener('click', prev);
        nextBtn.addEventListener('click', next);

        function resetAutoplay() {
            if (timer) clearInterval(timer);
            timer = setInterval(next, 5000);
        }
        resetAutoplay();
    }

    // View Switching
    function hideAllViews() {
        const views = [
            'deutsch-view', 'flashcards-view', 'tournament-view', 'verb-trainer-view',
            'tandem-view', 'pronounce-view', 'idioms-view', 'corrector-view',
            'video-lessons-view'
        ];
        views.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        document.body.classList.remove('horror-theme');
    }

    function setActiveDock(page) {
        const p = (page || '').toUpperCase();
        document.querySelectorAll('.dock-item').forEach(item => {
            const itemPage = (item.getAttribute('data-page') || '').toUpperCase();
            if (itemPage === p) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Sub-nav pill bar (#top-nav-links) active class
        document.querySelectorAll('#top-nav-links a').forEach(a => {
            const navLvl = (a.getAttribute('data-nav-lvl') || '').toUpperCase();
            if (navLvl === p) {
                a.classList.add('active');
                try {
                    a.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                } catch (_) {}
            } else {
                a.classList.remove('active');
            }
        });
    }

    window.openDeutschLevel = function(lvl = 'A1', pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('deutsch-view');
        if (v) v.style.display = 'block';
        setActiveDock(lvl);
        if (typeof renderDeutschCurriculum === 'function') {
            renderDeutschCurriculum(lvl);
        }
        if (pushHistory) history.pushState({ level: lvl }, '', `#${lvl.toLowerCase()}`);
    };

    window.openDeutschTests = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('deutsch-view');
        if (v) v.style.display = 'block';
        setActiveDock('tests');
        if (typeof loadGermanTests === 'function' && !window.germanTests && !window.deutschTests && typeof deutschTests === 'undefined') {
            loadGermanTests();
        }
        if (typeof renderDeutschHome === 'function') {
            renderDeutschHome();
        } else if (typeof renderDeutschCurriculum === 'function') {
            renderDeutschCurriculum('A1');
        }
        if (pushHistory) history.pushState({ page: 'tests' }, '', '#tests');
    };

    window.openDeutschFlashcards = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('flashcards-view');
        if (v) v.style.display = 'block';
        setActiveDock('flashcards');
        if (typeof renderFlashcardsHome === 'function') renderFlashcardsHome();
        if (pushHistory) history.pushState({ page: 'flashcards' }, '', '#flashcards');
    };

    window.openDeutschGames = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('flashcards-view');
        if (v) v.style.display = 'block';
        setActiveDock('games');
        if (typeof showMatchingHome === 'function') showMatchingHome();
        if (pushHistory) history.pushState({ page: 'games' }, '', '#games');
    };

    window.openDeutschTournament = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('tournament-view');
        if (v) v.style.display = 'block';
        setActiveDock('tournament');
        if (typeof loadGermanTests === 'function' && !window.germanTests && !window.deutschTests && typeof deutschTests === 'undefined') {
            loadGermanTests();
        }
        if (typeof renderTournamentHome === 'function') renderTournamentHome();
        if (pushHistory) history.pushState({ page: 'tournament' }, '', '#tournament');
    };

    // Dinamik Horror o'yini skriptlarini yuklash mexanizmi (Code Splitting / Lazy Loading)
    let _horrorLoadPromise = null;
    function loadHorrorGameScripts() {
        if ((window.horrorGameData || window.HorrorGamesData) && (typeof window.startHorrorGame === 'function' || typeof window.openHorrorHome === 'function')) {
            return Promise.resolve();
        }
        if (_horrorLoadPromise) return _horrorLoadPromise;

        _horrorLoadPromise = new Promise((resolve, reject) => {
            // Horror CSS ni dinamik ulash (agar ulanmagan bo'lsa)
            if (!document.querySelector('link[href*="horror.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'css/horror.css';
                document.head.appendChild(link);
            }

            const loadScript = (src) => new Promise((res, rej) => {
                const s = document.createElement('script');
                s.src = src;
                s.async = true;
                s.onload = () => res();
                s.onerror = (e) => rej(e);
                document.body.appendChild(s);
            });

            loadScript('scripts/horror-data.js')
                .then(() => loadScript('scripts/horror-logic.js'))
                .then(() => {
                    if (window.HorrorGamesData && !window.horrorGameData) {
                        window.horrorGameData = window.HorrorGamesData;
                    }
                    if (typeof window.startHorrorEscape === 'function' && !window.startHorrorGame) {
                        window.startHorrorGame = window.startHorrorEscape;
                    }
                    resolve();
                })
                .catch(err => {
                    console.error('Horror skriptlarini yuklashda xatolik:', err);
                    _horrorLoadPromise = null;
                    reject(err);
                });
        });
        return _horrorLoadPromise;
    }
    window.loadHorrorGame = loadHorrorGameScripts;

    if (typeof window.startHorrorGame !== 'function') {
        window.startHorrorGame = async function(...args) {
            if (!window.horrorGameData || typeof window.startHorrorEscape !== 'function') {
                await loadHorrorGameScripts();
            }
            if (typeof window.startHorrorEscape === 'function') {
                return window.startHorrorEscape(...args);
            }
        };
    }

    window.openDeutschHorror = async function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('deutsch-view');
        if (v) v.style.display = 'block';

        if (!window.horrorGameData && !window.HorrorGamesData) {
            const container = document.getElementById('deutsch-content');
            if (container) {
                container.innerHTML = `
                    <div class="horror-container" style="text-align: center; padding: 80px 20px; color: #ef4444;">
                        <div style="font-size: 54px; margin-bottom: 16px; animation: pulse 1s infinite;">💀</div>
                        <h2 style="color: #ef4444; font-size: 24px; font-weight: 800; margin-bottom: 10px;">HORROR DEUTSCH YUKLANMOQDA...</h2>
                        <p style="color: #94a3b8; font-size: 15px;">Qorong'u qasr eshiklari ochilmoqda, iltimos kuting...</p>
                    </div>
                `;
            }
        }

        if (!window.horrorGameData || !window.startHorrorGame || typeof openHorrorHome !== 'function') {
            try {
                await loadHorrorGameScripts();
            } catch (e) {
                console.error('Horror yuklanmadi:', e);
                return;
            }
        }

        if (typeof openHorrorHome === 'function') openHorrorHome(true);
        if (pushHistory) history.pushState({ page: 'horror' }, '', '#horror');
    };

    window.openDeutschVerbs = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('verb-trainer-view');
        if (v) v.style.display = 'block';
        setActiveDock('verbs');
        if (window.verbTrainerApp && typeof window.verbTrainerApp.init === 'function') {
            window.verbTrainerApp.init();
        }
        if (pushHistory) history.pushState({ page: 'verbs' }, '', '#verbs');
    };

    // Audio Talaffuz Yordamchisi (Web Speech API)
    function speakGermanText(text) {
        if (!text || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(text);
            utt.lang = 'de-DE';
            utt.rate = 0.9;
            window.speechSynthesis.speak(utt);
        } catch (_) {}
    }
    window.speakGermanText = speakGermanText;

    // Video-Dialog Darslik Moduli
    window.openDeutschVideoLessons = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('video-lessons-view');
        if (v) v.style.display = 'block';
        setActiveDock('video-lessons');
        if (window.VideoLesson && typeof window.VideoLesson.init === 'function') {
            window.VideoLesson.init();
        }
        if (pushHistory) history.pushState({ page: 'video-lessons' }, '', '#video-lessons');
        const targetEl = document.getElementById('video-lessons-view') || document.getElementById('deutsch-subnav-section');
        if (targetEl && targetEl.getBoundingClientRect().top < 0) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // ============================================================
    // 1. INTERAKTIV TANDEM MULOQOT SIMULYATORI
    // ============================================================
    const TANDEM_SCENARIOS = [
        {
            id: 'cafe',
            icon: '☕',
            title: 'Im Café (Kafeda buyurtma berish)',
            level: 'A1-A2',
            desc: 'Kafeda ofitsiant bilan muloqot va hisob-kitob qilish',
            dialogue: [
                { role: 'partner', name: 'Kellner', de: 'Guten Tag! Was darf ich Ihnen bringen?', uz: 'Assalomu alaykum! Sizga nima keltiray?', tip: 'Salomlashish va taklif' },
                { role: 'user', name: 'Siz', de: 'Guten Tag! Ich möchte bitte einen Kaffee und ein Stück Apfelkuchen.', uz: 'Assalomu alaykum! Menga iltimos bitta kofe va bir bo\'lak olma pirogi bering.', options: ['Ich möchte bitte einen Kaffee.', 'Ein Wasser, bitte.', 'Haben Sie Tee?'] },
                { role: 'partner', name: 'Kellner', de: 'Sehr gerne. Mit Milch und Zucker?', uz: 'Jon deb. Sut va shakar bilanmi?', tip: 'Qo\'shimchalar haqida so\'rash' },
                { role: 'user', name: 'Siz', de: 'Nur mit etwas Milch, bitte. Ohne Zucker.', uz: 'Faqat ozgina sut bilan, iltimos. Shakarsiz.', options: ['Mit Milch, bitte.', 'Schwarz, bitte.', 'Mit viel Zucker!'] },
                { role: 'partner', name: 'Kellner', de: 'Kommt sofort! Hat es Ihnen geschmeckt?', uz: 'Hozir keltiraman! Taom yoqdimi?', tip: 'Xizmat yakuni' },
                { role: 'user', name: 'Siz', de: 'Ja, es war sehr lecker! Ich möchte bitte zahlen.', uz: 'Ha, juda mazali bo\'ldi! Hisobni olsam degandim.', options: ['Die Rechnung, bitte.', 'Zusammen, bitte.', 'Kann ich mit Karte zahlen?'] }
            ]
        },
        {
            id: 'train',
            icon: '🚆',
            title: 'Am Bahnhof (Poyezd chiptasi va platforma)',
            level: 'A2',
            desc: 'Kassadan chipta xarid qilish va yo\'nalishni so\'rash',
            dialogue: [
                { role: 'partner', name: 'Schaffner', de: 'Guten Morgen! Wohin möchten Sie reisen?', uz: 'Xayrli tong! Qayerga sayohat qilmoqchisiz?', tip: 'Yo\'nalish so\'rovi' },
                { role: 'user', name: 'Siz', de: 'Guten Morgen! Eine Fahrkarte nach München, bitte. Einfach.', uz: 'Xayrli tong! Myunxenga bitta chipta, iltimos. Bir tomonga.', options: ['Nach Berlin, bitte.', 'Hin und zurück, bitte.', 'Wann fährt der Zug?'] },
                { role: 'partner', name: 'Schaffner', de: 'Der nächste ICE fährt um 10:15 Uhr von Gleis 7 ab.', uz: 'Keyingi tezyurar poyezd 10:15 da 7-yo\'ldan jo\'naydi.', tip: 'Jo\'nash vaqti va perron' },
                { role: 'user', name: 'Siz', de: 'Muss ich umsteigen oder fährt er direkt?', uz: 'Poyezd almashtirishim kerakmi yoki to\'g\'ridan-to\'g\'ri boradimi?', options: ['Fährt er direkt?', 'Muss ich umsteigen?', 'Wie lange dauert die Fahrt?'] },
                { role: 'partner', name: 'Schaffner', de: 'Er fährt direkt. Gute Reise!', uz: 'To\'g\'ridan-to\'g\'ri boradi. Oq yo\'l!', tip: 'Muvaffaqiyatli yakun' }
            ]
        },
        {
            id: 'doctor',
            icon: '🏥',
            title: 'Beim Arzt (Shifokor qabulida)',
            level: 'B1',
            desc: 'O\'zingizni his qilishingiz va alomatlarni tushuntirish',
            dialogue: [
                { role: 'partner', name: 'Frau Dr. Weber', de: 'Guten Tag! Was fehlt Ihnen denn? Wo haben Sie Schmerzen?', uz: 'Assalomu alaykum! Sizni nima bezovta qilyapti? Qayeringiz og\'riyapti?', tip: 'Shifokor shikoyat so\'ramoqda' },
                { role: 'user', name: 'Siz', de: 'Guten Tag, Frau Doktor. Ich habe seit zwei Tagen starke Halsschmerzen und Fieber.', uz: 'Salom, doktor. Ikki kundan beri tomog\'im qattiq og\'riyapti va isitmayapman.', options: ['Ich habe Kopfschmerzen.', 'Mir ist schwindelig.', 'Ich fühle mich schwach.'] },
                { role: 'partner', name: 'Frau Dr. Weber', de: 'Ich verstehe. Bitte machen Sie den Mund auf und sagen Sie "Aah".', uz: 'Tushundim. Iltimos og\'zingizni oching va "Aah" deng.', tip: 'Tekshirish' },
                { role: 'user', name: 'Siz', de: 'Aah... Ist es eine schwere Erkältung?', uz: 'Aah... Bu og\'ir shamollashmi?', options: ['Brauche ich Antibiotika?', 'Muss ich im Bett bleiben?', 'Wie lange dauert das?'] },
                { role: 'partner', name: 'Frau Dr. Weber', de: 'Es ist eine leichte Mandelentzündung. Ich verschreibe Ihnen Tabletten.', uz: 'Bu yengil angina. Sizga dorilar yozib beraman.', tip: 'Retsept berish' }
            ]
        },
        {
            id: 'interview',
            icon: '💼',
            title: 'Im Vorstellungsgespräch (Ish suhbati)',
            level: 'B1-B2',
            desc: 'Rezyume, tajriba va kuchli tomonlarni taqdim etish',
            dialogue: [
                { role: 'partner', name: 'Personalchef', de: 'Herzlich willkommen! Erzählen Sie mir bitte etwas über sich.', uz: 'Xush kelibsiz! Iltimos, o\'zingiz haqingizda gapirib bering.', tip: 'O\'zini tanishtirish' },
                { role: 'user', name: 'Siz', de: 'Vielen Dank! Ich bin Softwareentwickler und interessiere mich sehr für moderne Webtechnologien.', uz: 'Katta rahmat! Men dasturchiman va zamonaviy veb-texnologiyalarga juda qiziqaman.', options: ['Ich lerne schnell.', 'Ich habe viel Erfahrung.', 'Ich arbeite gerne im Team.'] },
                { role: 'partner', name: 'Personalchef', de: 'Sehr gut. Warum möchten Sie ausgerechnet bei unserem Unternehmen arbeiten?', uz: 'Juda yaxshi. Nega aynan bizning kompaniyamizda ishlashni xohlaysiz?', tip: 'Motivatsiya so\'rovi' },
                { role: 'user', name: 'Siz', de: 'Weil Ihre innovativen Projekte und die Unternehmenskultur mich sehr begeistern.', uz: 'Chunki sizning innovatsion loyihalaringiz va jamoaviy madaniyatingiz menda katta qiziqish uyg\'otdi.', options: ['Wegen der Herausforderung.', 'Wegen der guten Zukunft.', 'Um mich weiterzuentwickeln.'] }
            ]
        },
        {
            id: 'flat',
            icon: '🏠',
            title: 'Wohnungssuche & WG (Xonadon ijarasi)',
            level: 'A2-B1',
            desc: 'Germaniyada kvartira ko\'rish va shartlarni muhokama qilish',
            dialogue: [
                { role: 'partner', name: 'Vermieter', de: 'Hallo! Kommen Sie rein, das ist das Zimmer zur Miete.', uz: 'Salom! Kiring, mana bu ijaraga beriladigan xona.', tip: 'Xonani ko\'rsatish' },
                { role: 'user', name: 'Siz', de: 'Guten Tag! Das Zimmer ist wirklich sehr hell und geräumig.', uz: 'Salom! Xona haqiqatan ham juda yorug\' va shinam ekan.', options: ['Wie hoch ist die Warmmiete?', 'Ist die Küche möbliert?', 'Sind Haustiere erlaubt?'] },
                { role: 'partner', name: 'Vermieter', de: 'Die Warmmiete beträgt 450 Euro inklusive Nebenkosten und Internet.', uz: 'To\'liq ijara haqi kommunal va internet bilan 450 yevro.', tip: 'Narx va shartlar' },
                { role: 'user', name: 'Siz', de: 'Das passt mir sehr gut. Ab wann ist das Zimmer frei?', uz: 'Bu menga juda ma\'qul. Xona qachondan bo\'sh bo\'ladi?', options: ['Ab sofort?', 'Ab nächstem Monat?', 'Gibt es eine Kaution?'] }
            ]
        },
        {
            id: 'supermarket',
            icon: '🛒',
            title: 'Im Supermarkt (Do\'konda xarid)',
            level: 'A1',
            desc: 'Mahsulotlar joyini so\'rash va kassada to\'lov qilish',
            dialogue: [
                { role: 'user', name: 'Siz', de: 'Entschuldigung, wo finde ich frisches Obst und Gemüse?', uz: 'Kechirasiz, yangi meva va sabzavotlar qayerda joylashgan?', options: ['Wo ist die Milch?', 'Wo finde ich Brot?', 'Haben Sie Käse?'] },
                { role: 'partner', name: 'Mitarbeiter', de: 'Gleich vorne rechts neben dem Eingang.', uz: 'To\'g\'rida o\'ng tomonda, kiraverishning yonida.', tip: 'Yo\'nalish ko\'rsatish' },
                { role: 'user', name: 'Siz', de: 'Vielen Dank für Ihre Hilfe!', uz: 'Yordamingiz uchun katta rahmat!', options: ['Danke schön!', 'Einen schönen Tag noch!', 'Auf Wiedersehen!'] }
            ]
        }
    ];

    let _activeTandemIdx = 0;
    let _activeTandemStep = 0;

    function renderFallbackTandem() {
        const c = document.getElementById('tandem-inline-content');
        if (!c) return;

        const scenario = TANDEM_SCENARIOS[_activeTandemIdx] || TANDEM_SCENARIOS[0];
        const dialogues = scenario.dialogue || [];
        const currentLine = dialogues[_activeTandemStep] || dialogues[0];

        c.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:24px; padding:28px 24px; max-width:920px; margin:0 auto; box-shadow:var(--shadow-sm);">
                <!-- Header -->
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid var(--border-color);">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:36px;">${scenario.icon}</span>
                        <div>
                            <h2 style="font-size:22px; font-weight:700; color:var(--text-primary); margin:0;">Tandem Muloqot Simulyatori</h2>
                            <p style="color:var(--text-secondary); font-size:13px; margin:4px 0 0 0;">Kundalik hayotdagi real vaziyatlar bo'yicha dialoglarni mashq qiling</p>
                        </div>
                    </div>
                    <span style="font-size:11px; font-weight:700; background:rgba(45,212,191,0.15); color:#2dd4bf; padding:4px 10px; border-radius:999px;">${scenario.level}</span>
                </div>

                <!-- Ssenariylar Kapsula Menyusi -->
                <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:20px; scrollbar-width:none;">
                    ${TANDEM_SCENARIOS.map((sc, idx) => `
                        <button type="button" class="btn-secondary" style="white-space:nowrap; padding:8px 14px; font-size:12.5px; border-radius:12px; ${idx === _activeTandemIdx ? 'border-color:#2dd4bf; color:#2dd4bf; background:rgba(45,212,191,0.1);' : ''}" onclick="selectTandemScenario(${idx})">
                            ${sc.icon} ${escapeHTML(sc.title.split('(')[0].trim())}
                        </button>
                    `).join('')}
                </div>

                <!-- Dialog oynasi -->
                <div style="background:rgba(0,0,0,0.25); border:1px solid var(--border-color); border-radius:18px; padding:20px; min-height:260px; margin-bottom:20px; display:flex; flex-direction:column; gap:14px;" id="tandem-chat-box">
                    ${dialogues.slice(0, _activeTandemStep + 1).map((dItem, sIdx) => {
                        const isPartner = dItem.role === 'partner';
                        return `
                            <div style="display:flex; flex-direction:column; align-items:${isPartner ? 'flex-start' : 'flex-end'}; max-width:85%; align-self:${isPartner ? 'flex-start' : 'flex-end'};">
                                <span style="font-size:11px; color:var(--text-muted); margin-bottom:4px; margin-left:${isPartner ? '6px' : '0'}; margin-right:${isPartner ? '0' : '6px'};">
                                    ${isPartner ? '🤖 ' + dItem.name : '👤 ' + dItem.name}
                                </span>
                                <div style="padding:14px 18px; border-radius:16px; ${isPartner ? 'background:rgba(255,255,255,0.06); border:1px solid var(--border-color); border-bottom-left-radius:4px;' : 'background:linear-gradient(135deg, rgba(45,212,191,0.2), rgba(56,189,248,0.2)); border:1px solid rgba(45,212,191,0.3); border-bottom-right-radius:4px;'}">
                                    <p style="font-size:15px; font-weight:600; color:var(--text-primary); margin:0 0 6px 0; line-height:1.5;">${escapeHTML(dItem.de)}</p>
                                    <p style="font-size:12.5px; color:var(--text-secondary); margin:0; font-style:italic;">${escapeHTML(dItem.uz)}</p>
                                </div>
                                <div style="display:flex; gap:8px; margin-top:6px;">
                                    <button type="button" class="btn-icon" style="width:26px; height:26px; font-size:11px; border-radius:6px;" onclick="speakGermanText('${dItem.de.replace(/'/g, "\\'")}')" title="Tinglash">🔊</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Boshqaruv & Keyingi qadam -->
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                    <div style="font-size:12.5px; color:var(--text-secondary);">
                        Bosqich: <strong>${Math.min(_activeTandemStep + 1, dialogues.length)} / ${dialogues.length}</strong>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button type="button" class="btn-secondary" style="padding:8px 16px; font-size:13px;" onclick="resetTandemScenario()">🔄 Boshidan boshlash</button>
                        ${_activeTandemStep < dialogues.length - 1 ? `
                            <button type="button" class="btn-primary" style="padding:8px 20px; font-size:13px;" onclick="nextTandemStep()">Keyingi gap &rarr;</button>
                        ` : `
                            <button type="button" class="btn-primary" style="padding:8px 20px; font-size:13px; background:#10b981;" onclick="finishTandemScenario()">🎉 Tugatish</button>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Avtomatik chat oxiriga siljitish
        setTimeout(() => {
            const box = document.getElementById('tandem-chat-box');
            if (box) box.scrollTop = box.scrollHeight;
        }, 50);
    }

    window.selectTandemScenario = function(idx) {
        _activeTandemIdx = idx;
        _activeTandemStep = 0;
        renderFallbackTandem();
    };

    window.nextTandemStep = function() {
        const scenario = TANDEM_SCENARIOS[_activeTandemIdx];
        if (scenario && _activeTandemStep < scenario.dialogue.length - 1) {
            _activeTandemStep++;
            renderFallbackTandem();
            const curr = scenario.dialogue[_activeTandemStep];
            if (curr && curr.de) speakGermanText(curr.de);
        }
    };

    window.resetTandemScenario = function() {
        _activeTandemStep = 0;
        renderFallbackTandem();
    };

    window.finishTandemScenario = function() {
        if (window.showToast) window.showToast('🎉 Ssenariy muvaffaqiyatli yakunlandi!', 'success');
        _activeTandemStep = 0;
        _activeTandemIdx = (_activeTandemIdx + 1) % TANDEM_SCENARIOS.length;
        renderFallbackTandem();
    };

    // ============================================================
    // 2. TALAFFUZ MURABBIYI VA OVOZLI TANISH (SPEECH RECOGNITION)
    // ============================================================
    const PRONOUNCE_DATA = [
        {
            category: "ä, ö, ü (Umlautlar)",
            color: "#2dd4bf",
            examples: "Äpfel, schön, über, für, hören",
            tip: "Og'iz lablarini doira qilib 'i' yoki 'e' tovushini chiqarish orqali hosil qilinadi."
        },
        {
            category: "ch & sch tovushlari",
            color: "#38bdf8",
            examples: "ich, nicht, Buch, Sprache, Schule",
            tip: "Unlilardan keyin (a, o, u) qattiq [x], boshqa hollarda yumshoq [sh/hy] eshitiladi."
        },
        {
            category: "sp & st tovushlari",
            color: "#a855f7",
            examples: "Sport, sprechen, Stadt, stehen",
            tip: "So'z boshida 'sp' va 'st' birikmalari mos ravishda [shp] va [sht] deb o'qiladi."
        },
        {
            category: "ei vs ie birikmalari",
            color: "#f59e0b",
            examples: "mein, sein, Liebe, Lied, sieben",
            tip: "'ei' [ay] deb, 'ie' esa cho'ziq [i:] deb talaffuz qilinadi."
        }
    ];

    const TONGUE_TWISTERS = [
        { de: "Fischers Fritz fischt frische Fische, frische Fische fischt Fischers Fritz.", uz: "Baliqchi Frits yangi baliqlarni ovlaydi." },
        { de: "Braune Borstenviecher bürsten brave Bauernburschen.", uz: "Jigarrang qiltiqli hayvonlar botir dehqon yigitlarini cho'tkalaydi." },
        { de: "Kleine Kinder können keine Kaffeebohnen knacken.", uz: "Kichik bolalar qahva donalarini chaqa olmaydilar." },
        { de: "Zehn zahme Ziegen zogen zehn Zentner Zucker zum Zoo.", uz: "O'nta yuvosh echki o'n sentner shakarni hayvonot bog'iga tortib bordi." }
    ];

    function renderFallbackPronounce() {
        const c = document.getElementById('pronounce-inline-content');
        if (!c) return;
        c.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:24px; padding:28px 24px; max-width:880px; margin:0 auto; box-shadow:var(--shadow-sm);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                    <div style="font-size:36px;">🎙️</div>
                    <div>
                        <h2 style="font-size:22px; font-weight:700; color:var(--text-primary); margin:0;">Nemis Tili Talaffuz Murabbiyi</h2>
                        <p style="color:var(--text-secondary); font-size:13px; margin:4px 0 0 0;">Nemischa tovushlar, qoidalar va ovozli talaffuzni real vaqtda tekshirish</p>
                    </div>
                </div>

                <!-- Tovushlar panjarasi -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px; margin-bottom:26px;">
                    ${PRONOUNCE_DATA.map(item => `
                        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                            <div>
                                <strong style="color:${item.color}; font-size:15px; display:block; margin-bottom:6px;">${escapeHTML(item.category)}</strong>
                                <p style="font-size:13.5px; font-weight:600; color:var(--text-primary); margin:0 0 4px 0;">${escapeHTML(item.examples)}</p>
                                <p style="font-size:12px; color:var(--text-secondary); margin:0 0 12px 0;">${escapeHTML(item.tip)}</p>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button type="button" class="btn-primary" style="padding:6px 12px; font-size:12px;" onclick="speakGermanText('${item.examples.replace(/'/g, "\\'")}')">🔊 Tinglash</button>
                                <button type="button" class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="startPronounceRecognition('${item.examples.split(',')[0].trim().replace(/'/g, "\\'")}')">🎤 Sinash</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Tez aytishlar (Zungenbrecher) -->
                <h3 style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                    <span>⚡ Mashhur Nemis Tez Aytishlari (Zungenbrecher):</span>
                </h3>
                <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                    ${TONGUE_TWISTERS.map((tw, idx) => `
                        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:14px; padding:16px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;">
                            <div style="flex:1; min-width:260px;">
                                <p style="font-size:14px; font-weight:600; color:var(--text-primary); margin:0 0 4px 0;">"${escapeHTML(tw.de)}"</p>
                                <small style="color:var(--text-secondary); font-size:12px;">${escapeHTML(tw.uz)}</small>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button type="button" class="btn-primary" style="padding:6px 14px; font-size:12px;" onclick="speakGermanText('${tw.de.replace(/'/g, "\\'")}')">🔊 Tinglash</button>
                                <button type="button" class="btn-secondary" style="padding:6px 14px; font-size:12px;" onclick="startPronounceRecognition('${tw.de.replace(/'/g, "\\'")}')">🎤 Ovozli sinash</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Ovozli sinov natijasi indikatori -->
                <div id="pronounce-feedback-box" style="display:none; padding:14px 18px; border-radius:14px; font-size:13.5px; text-align:center;"></div>
            </div>
        `;
    }

    // Brauzer Web Speech API orqali talaffuzni tekshirish
    window.startPronounceRecognition = function(targetText) {
        const fb = document.getElementById('pronounce-feedback-box');
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRec) {
            if (fb) {
                fb.style.display = 'block';
                fb.style.background = 'rgba(239, 68, 68, 0.15)';
                fb.style.color = '#f87171';
                fb.style.border = '1px solid rgba(239, 68, 68, 0.3)';
                fb.innerHTML = '⚠️ Brauzeringiz mikrofon orqali tanishni qo\'llab-quvvatlamaydi (Google Chrome yoki Microsoft Edge tavsiya etiladi).';
            }
            return;
        }

        try {
            const rec = new SpeechRec();
            rec.lang = 'de-DE';
            rec.interimResults = false;
            rec.maxAlternatives = 1;

            if (fb) {
                fb.style.display = 'block';
                fb.style.background = 'rgba(56, 189, 248, 0.15)';
                fb.style.color = '#38bdf8';
                fb.style.border = '1px solid rgba(56, 189, 248, 0.3)';
                fb.innerHTML = `🎙️ <b>Eshitilmoqda...</b> Iltimos nemischa ayting: <i>"${escapeHTML(targetText)}"</i>`;
            }

            rec.onresult = (e) => {
                const spoken = e.results[0][0].transcript.trim();
                const cleanTarget = targetText.toLowerCase().replace(/[^a-zäöüß0-9]/gi, '');
                const cleanSpoken = spoken.toLowerCase().replace(/[^a-zäöüß0-9]/gi, '');

                let match = false;
                if (cleanTarget === cleanSpoken || cleanTarget.includes(cleanSpoken) || cleanSpoken.includes(cleanTarget)) {
                    match = true;
                }

                if (fb) {
                    if (match) {
                        fb.style.background = 'rgba(16, 185, 129, 0.15)';
                        fb.style.color = '#34d399';
                        fb.style.border = '1px solid rgba(16, 185, 129, 0.4)';
                        fb.innerHTML = `🎉 <b>A'lo darajada!</b> Siz aytdingiz: "${escapeHTML(spoken)}" (100% Moslik)`;
                    } else {
                        fb.style.background = 'rgba(245, 158, 11, 0.15)';
                        fb.style.color = '#fbbf24';
                        fb.style.border = '1px solid rgba(245, 158, 11, 0.4)';
                        fb.innerHTML = `💡 <b>Yaxshi harakat!</b> Siz aytdingiz: "${escapeHTML(spoken)}". Kutilgan so'z: "${escapeHTML(targetText)}"`;
                    }
                }
            };

            rec.onerror = (err) => {
                if (fb) {
                    fb.style.background = 'rgba(239, 68, 68, 0.15)';
                    fb.style.color = '#f87171';
                    fb.style.border = '1px solid rgba(239, 68, 68, 0.3)';
                    fb.innerHTML = `⚠️ Ovoz eshitilmadi yoki ruxsat berilmadi (${err.error || 'Xatolik'}). Qayta urinib ko'ring.`;
                }
            };

            rec.start();
        } catch (err) {
            console.warn('Speech recognition xatosi:', err);
        }
    };

    // ============================================================
    // 3. MATN VA INSHO TAHRIRCHISI (SMART GRAMMAR ASSISTANT)
    // ============================================================
    const GERMAN_COMMON_NOUNS = new Set([
        'haus', 'auto', 'buch', 'mensch', 'zeit', 'tag', 'jahr', 'freund', 'schule', 'arbeit',
        'familie', 'stadt', 'kind', 'land', 'leben', 'frage', 'problem', 'mann', 'frau', 'wasser',
        'essen', 'geld', 'student', 'lehrer', 'tisch', 'fenster', 'zimmer', 'nacht', 'morgen',
        'abend', 'woche', 'monat', 'name', 'ort', 'sprache', 'glück', 'liebe', 'hilfe', 'arzt',
        'zug', 'bus', 'reise', 'musik', 'film', 'foto', 'brief', 'post', 'kaffee', 'tee', 'brot',
        'kuchen', 'apfel', 'handy', 'beruf', 'wohnung', 'kurs', 'klasse', 'leute', 'sonne', 'mond'
    ]);

    function analyzeGermanText(text) {
        if (!text || !text.trim()) {
            return { words: 0, chars: 0, sentences: 0, level: 'A1', issues: [] };
        }

        const rawWords = text.trim().split(/\s+/);
        const chars = text.length;
        const sentences = (text.match(/[.!?]+/g) || []).length || 1;
        const words = rawWords.length;

        const issues = [];

        // 1. Otlar bosh harfda yozilishi qoidasi
        rawWords.forEach(w => {
            const clean = w.replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
            const lower = clean.toLowerCase();
            if (GERMAN_COMMON_NOUNS.has(lower) && clean[0] === lower[0]) {
                const proper = clean.charAt(0).toUpperCase() + clean.slice(1);
                issues.push({
                    type: 'capitalization',
                    word: clean,
                    suggest: proper,
                    msg: `Nemis tilida barcha otlar katta harf bilan boshlanadi: "${proper}"`
                });
            }
        });

        // 2. Ergash gaplarda fe'l oxirida kelishi (weil, dass, wenn, ob)
        const subConjRegex = /\b(weil|dass|wenn|obwohl|damit)\s+([^,.]+)/gi;
        let match;
        while ((match = subConjRegex.exec(text)) !== null) {
            const clause = match[2].trim().toLowerCase();
            if (/\b(ist|sind|habe|hat|kann|muss|will|war)\b/.test(clause) && !clause.endsWith('ist') && !clause.endsWith('sind') && !clause.endsWith('hat') && !clause.endsWith('kann')) {
                issues.push({
                    type: 'subordinate',
                    word: match[1],
                    suggest: match[1],
                    msg: `"${match[1]}" ergash gapida tuslangan fe'l gapning eng oxiriga o'tishi tavsiya etiladi.`
                });
            }
        }

        // 3. Prepozitsiyalar eslatmasi
        if (/\bmit\s+den\s+([A-ZÄÖÜa-zäöü]+)\b/.test(text) && !/\bmit\s+den\s+([A-ZÄÖÜa-zäöü]+)n\b/.test(text)) {
            issues.push({
                type: 'dativ',
                word: 'mit',
                suggest: 'mit dem / mit der / mit den ...n',
                msg: `"mit" predlogidan keyin doim Dativ keladi (ko'plikda -n qo'shiladi).`
            });
        }

        // O'qish darajasini aniqlash (A1-B2)
        let level = 'A1';
        if (words > 60 || text.includes('obwohl') || text.includes('deshalb')) level = 'B2';
        else if (words > 30 || text.includes('weil') || text.includes('dass')) level = 'B1';
        else if (words > 12) level = 'A2';

        return { words, chars, sentences, level, issues: issues.slice(0, 5) };
    }

    function renderFallbackCorrector() {
        const c = document.getElementById('corrector-inline-content');
        if (!c) return;

        c.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:24px; padding:28px 24px; max-width:880px; margin:0 auto; box-shadow:var(--shadow-sm);">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="font-size:36px;">✍️</div>
                        <div>
                            <h2 style="font-size:22px; font-weight:700; color:var(--text-primary); margin:0;">Insho va Grammatika Tahrirchisi</h2>
                            <p style="color:var(--text-secondary); font-size:13px; margin:4px 0 0 0;">Nemischa matn yozing — otlar registri, grammatik qoidalar va statistika real vaqtda tahlil qilinadi</p>
                        </div>
                    </div>
                    <span id="corrector-level-badge" style="font-size:11px; font-weight:700; background:rgba(56,189,248,0.15); color:#38bdf8; padding:4px 12px; border-radius:999px;">Daraja: A1</span>
                </div>

                <!-- Tezkor nemis harflari -->
                <div style="margin-bottom:12px; display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                    <span style="font-size:12px; color:var(--text-secondary);">Tezkor harflar:</span>
                    ${['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß'].map(ch => `
                        <button type="button" class="btn-icon" style="width:32px; height:32px; font-size:13px; border-radius:6px; background:rgba(255,255,255,0.05); border:1px solid var(--border-color); color:var(--text-primary);" onclick="insertCorrectorChar('${ch}')">${ch}</button>
                    `).join('')}
                </div>

                <!-- Matn maydoni -->
                <textarea id="corrector-textarea" placeholder="Nemis tilidagi gapingiz yoki inshongizni shu yerga yozing..." style="width:100%; min-height:170px; padding:16px; border-radius:14px; background:rgba(0,0,0,0.25); border:1px solid var(--border-color); color:var(--text-primary); font-family:inherit; font-size:15px; line-height:1.6; resize:vertical; outline:none; box-sizing:border-box;"></textarea>

                <!-- Status va Hisob-kitob paneli -->
                <div style="display:flex; align-items:center; justify-content:space-between; margin-top:12px; flex-wrap:wrap; gap:10px;">
                    <div style="font-size:13px; color:var(--text-secondary);" id="corrector-stats">
                        So'zlar: <strong>0</strong> | Belgilar: <strong>0</strong> | Gaplar: <strong>0</strong>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button type="button" class="btn-secondary" style="padding:6px 14px; font-size:12.5px;" id="corrector-clear-btn">Tozalash</button>
                        <button type="button" class="btn-secondary" style="padding:6px 14px; font-size:12.5px;" id="corrector-copy-btn">📋 Nusxalash</button>
                        <button type="button" class="btn-primary" style="padding:6px 16px; font-size:12.5px;" id="corrector-speak-btn">🔊 Tinglash</button>
                    </div>
                </div>

                <!-- Grammatik xatoliklar va Tavsiyalar paneli -->
                <div id="corrector-suggestions-box" style="margin-top:18px; display:none;">
                    <h4 style="font-size:14px; margin:0 0 10px 0; color:#38bdf8; display:flex; align-items:center; gap:6px;">
                        <span>💡 Grammatik tavsiyalar & Imlo tekshiruvi:</span>
                    </h4>
                    <div id="corrector-suggestions-list" style="display:flex; flex-direction:column; gap:8px;"></div>
                </div>
            </div>
        `;

        const ta = document.getElementById('corrector-textarea');
        const stats = document.getElementById('corrector-stats');
        const speakBtn = document.getElementById('corrector-speak-btn');
        const clearBtn = document.getElementById('corrector-clear-btn');
        const copyBtn = document.getElementById('corrector-copy-btn');
        const lvlBadge = document.getElementById('corrector-level-badge');
        const suggBox = document.getElementById('corrector-suggestions-box');
        const suggList = document.getElementById('corrector-suggestions-list');

        function updateAnalysis() {
            if (!ta) return;
            const res = analyzeGermanText(ta.value);
            if (stats) stats.innerHTML = `So'zlar: <strong>${res.words}</strong> | Belgilar: <strong>${res.chars}</strong> | Gaplar: <strong>${res.sentences}</strong>`;
            if (lvlBadge) lvlBadge.textContent = `Taxminiy daraja: ${res.level}`;

            if (suggBox && suggList) {
                if (res.issues && res.issues.length) {
                    suggBox.style.display = 'block';
                    suggList.innerHTML = res.issues.map(iss => `
                        <div style="background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
                            <span style="font-size:13px; color:#fde68a;">${escapeHTML(iss.msg)}</span>
                            ${iss.type === 'capitalization' ? `
                                <button type="button" class="btn-primary" style="padding:4px 10px; font-size:11.5px; background:#f59e0b; color:#000;" onclick="replaceCorrectorWord('${iss.word}', '${iss.suggest}')">
                                    Tuzatish (${iss.suggest})
                                </button>
                            ` : ''}
                        </div>
                    `).join('');
                } else {
                    suggBox.style.display = 'none';
                    suggList.innerHTML = '';
                }
            }
        }

        if (ta) {
            ta.addEventListener('input', updateAnalysis);
        }
        if (speakBtn && ta) {
            speakBtn.addEventListener('click', () => {
                const text = ta.value.trim();
                if (text) speakGermanText(text);
            });
        }
        if (clearBtn && ta) {
            clearBtn.addEventListener('click', () => {
                ta.value = '';
                updateAnalysis();
                ta.focus();
            });
        }
        if (copyBtn && ta) {
            copyBtn.addEventListener('click', () => {
                if (ta.value.trim()) {
                    navigator.clipboard.writeText(ta.value.trim()).then(() => {
                        if (window.showToast) window.showToast("📋 Matn buferga nusxalandi!", "success");
                    });
                }
            });
        }

        window.insertCorrectorChar = function(ch) {
            if (!ta) return;
            const start = ta.selectionStart || 0;
            const end = ta.selectionEnd || 0;
            ta.value = ta.value.substring(0, start) + ch + ta.value.substring(end);
            ta.focus();
            ta.setSelectionRange(start + ch.length, start + ch.length);
            updateAnalysis();
        };

        window.replaceCorrectorWord = function(oldWord, newWord) {
            if (!ta) return;
            const regex = new RegExp('\\b' + oldWord + '\\b', 'g');
            ta.value = ta.value.replace(regex, newWord);
            updateAnalysis();
        };
    }

    // ============================================================
    // 4. NEMIS TILI IBORALARI (REDEWENDUNGEN)
    // ============================================================
    function renderFallbackIdioms() {
        const c = document.getElementById('idioms-inline-content');
        if (!c) return;
        const IDIOMS = [
            { de: "Daumen drücken", uz: "Omad tilamoq", lit: "Bosh barmoqlarni qismoq", ex: "Ich drücke dir die Daumen!" },
            { de: "Ich verstehe nur Bahnhof", uz: "Hech narsaga tushunmayapman", lit: "Faqat vokzalni tushunyapman", ex: "Rede langsamer, ich verstehe nur Bahnhof." },
            { de: "Das ist nicht mein Bier", uz: "Bu mening ishim emas", lit: "Bu mening pivom emas", ex: "Lass mich in Ruhe, das ist nicht mein Bier." },
            { de: "Tomaten auf den Augen haben", uz: "Ko'rib ko'rmaslikka olmoq", lit: "Ko'zida pomidor bo'lmoq", ex: "Hast du Tomaten auf den Augen? Da steht es doch!" },
            { de: "Ins Fettnäpfchen treten", uz: "Noo'rin gap aytib qo'ymoq", lit: "Yog' kosasiga qadam bosmoq", ex: "Er ist gestern ins Fettnäpfchen getreten." },
            { de: "Alles in Butter", uz: "Hammasi joyida, hammasi a'lo", lit: "Hammasi sariyog' ichida", ex: "Keine Sorge, alles ist in Butter." },
            { de: "Schwein haben", uz: "Juda omadi kelmoq", lit: "Cho'chqaga ega bo'lmoq", ex: "Du hast wirklich Schwein gehabt!" },
            { de: "Die Kirche im Dorf lassen", uz: "Ortiqcha vahima qilmaslik", lit: "Cherkovni qishloqda qoldirmoq", ex: "Lass mal die Kirche im Dorf." }
        ];
        c.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:24px; padding:28px 24px; max-width:880px; margin:0 auto; box-shadow:var(--shadow-sm);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                    <div style="font-size:36px;">🥨</div>
                    <div>
                        <h2 style="font-size:22px; font-weight:700; color:var(--text-primary); margin:0;">Nemis Tili Iboralari (Redewendungen)</h2>
                        <p style="color:var(--text-secondary); font-size:13px; margin:4px 0 0 0;">Nemis xalqining eng mashhur iboralari, ko'chma ma'nosi va jonli talaffuzi</p>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
                    ${IDIOMS.map(item => `
                        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
                            <div>
                                <h4 style="font-size:16px; margin:0 0 6px 0; color:#2dd4bf;">${escapeHTML(item.de)}</h4>
                                <p style="font-size:13.5px; font-weight:600; color:var(--text-primary); margin:0 0 4px 0;">🎯 ${escapeHTML(item.uz)}</p>
                                <small style="color:var(--text-secondary); font-size:11.5px; display:block; margin-bottom:8px;">Harfiy: "${escapeHTML(item.lit)}"</small>
                                <p style="font-size:12.5px; font-style:italic; color:var(--text-muted); margin:0 0 12px 0;">"${escapeHTML(item.ex)}"</p>
                            </div>
                            <button type="button" class="btn-primary" style="padding:6px 12px; font-size:11.5px; align-self:flex-start;" onclick="speakGermanText('${item.de.replace(/'/g, "\\'")}. ${item.ex.replace(/'/g, "\\'")}')">🔊 Tinglash</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.openDeutschTandem = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('tandem-view');
        if (v) v.style.display = 'block';
        setActiveDock('tandem');
        if (window.AIInnovations && typeof window.AIInnovations.initTandemInline === 'function') {
            window.AIInnovations.initTandemInline();
        } else {
            renderFallbackTandem();
        }
        if (pushHistory) history.pushState({ page: 'tandem' }, '', '#tandem');
    };

    window.openDeutschPronounce = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('pronounce-view');
        if (v) v.style.display = 'block';
        setActiveDock('pronounce');
        if (window.AIInnovations && typeof window.AIInnovations.initPronounceInline === 'function') {
            window.AIInnovations.initPronounceInline();
        } else {
            renderFallbackPronounce();
        }
        if (pushHistory) history.pushState({ page: 'pronounce' }, '', '#pronounce');
    };

    window.openDeutschIdioms = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('idioms-view');
        if (v) v.style.display = 'block';
        setActiveDock('idioms');
        if (window.AIInnovations && typeof window.AIInnovations.initIdiomsInline === 'function') {
            window.AIInnovations.initIdiomsInline();
        } else {
            renderFallbackIdioms();
        }
        if (pushHistory) history.pushState({ page: 'idioms' }, '', '#idioms');
    };

    window.openDeutschCorrector = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('corrector-view');
        if (v) v.style.display = 'block';
        setActiveDock('corrector');
        if (window.AIInnovations && typeof window.AIInnovations.initCorrectorInline === 'function') {
            window.AIInnovations.initCorrectorInline();
        } else {
            renderFallbackCorrector();
        }
        if (pushHistory) history.pushState({ page: 'corrector' }, '', '#corrector');
    };

    // Unified Module Navigator (Pill Bar & Dock & Direct API)
    function navigateToModule(target, pushHistory = true) {
        if (!target) return;
        const key = target.toLowerCase();
        if (['a1', 'a2', 'b1', 'b2'].includes(key)) {
            openDeutschLevel(key.toUpperCase(), pushHistory);
        } else if (key === 'tests') {
            openDeutschTests(pushHistory);
        } else if (key === 'flashcards' || key === 'lugat') {
            openDeutschFlashcards(pushHistory);
        } else if (key === 'tandem') {
            openDeutschTandem(pushHistory);
        } else if (key === 'pronounce') {
            openDeutschPronounce(pushHistory);
        } else if (key === 'idioms' || key === 'ibora' || key === 'iboralar') {
            openDeutschIdioms(pushHistory);
        } else if (key === 'corrector' || key === 'insho') {
            openDeutschCorrector(pushHistory);
        } else if (key === 'games' || key === 'match' || key === 'oyin' || key === 'oyinlar') {
            openDeutschGames(pushHistory);
        } else if (key === 'tournament' || key === 'turnir') {
            openDeutschTournament(pushHistory);
        } else if (key === 'video-lessons' || key === 'video' || key === 'dialog') {
            openDeutschVideoLessons(pushHistory);
        } else if (key === 'verbs' || key === "fe'llar") {
            openDeutschVerbs(pushHistory);
        } else if (key === 'horror') {
            openDeutschHorror(pushHistory);
        } else {
            openDeutschLevel('A1', pushHistory);
        }
    }
    window.navigateToDeutschModule = navigateToModule;

    // Routing
    function applyRoute() {
        const hash = (window.location.hash || '#a1').toLowerCase();
        const cleanHash = hash.replace('#', '');
        const parts = cleanHash.split('-');
        const lvlPart = parts[0];
        const topicPart = parts.length > 1 ? parts.slice(1).join('-') : null;

        if (['a1', 'a2', 'b1', 'b2'].includes(lvlPart)) {
            const lvlUpper = lvlPart.toUpperCase();
            openDeutschLevel(lvlUpper, false);
            if (topicPart && typeof openDeutschTopicStudio === 'function') {
                setTimeout(() => {
                    openDeutschTopicStudio(topicPart, 'theory', false);
                }, 100);
            }
            return;
        }

        if (hash.includes('test')) {
            openDeutschTests(false);
        } else if (hash.includes('flashcard') || hash.includes('lugat')) {
            openDeutschFlashcards(false);
        } else if (hash.includes('tandem')) {
            openDeutschTandem(false);
        } else if (hash.includes('pronounce')) {
            openDeutschPronounce(false);
        } else if (hash.includes('idiom')) {
            openDeutschIdioms(false);
        } else if (hash.includes('corrector') || hash.includes('insho')) {
            openDeutschCorrector(false);
        } else if (hash.includes('game') || hash.includes('match') || hash.includes('oyin')) {
            openDeutschGames(false);
        } else if (hash.includes('tournament') || hash.includes('turnir')) {
            openDeutschTournament(false);
        } else if (hash.includes('video') || hash.includes('dialog')) {
            openDeutschVideoLessons(false);
        } else if (hash.includes('horror')) {
            openDeutschHorror(false);
        } else if (hash.includes('verb')) {
            openDeutschVerbs(false);
        } else {
            openDeutschLevel('A1', false);
        }
    }

    window.addEventListener('popstate', applyRoute);

    // Data-action handler
    function handleDataAction(el, e) {
        const action = el.getAttribute('data-action');
        if (!action) return;

        // Topic action buttons (Curriculum kartochkalari)
        if (el.classList.contains('topic-action-btn')) {
            e.stopPropagation();
            const topicId = el.getAttribute('data-topic-id');
            if (typeof openTopicStudio === 'function') {
                openTopicStudio(topicId, action);
            }
            return;
        }

        switch (action) {
            case 'scroll-to-tests': {
                const elTests = document.getElementById('deutsch-levels-container') || document.getElementById('deutsch-content');
                if (elTests) elTests.scrollIntoView({ behavior: 'smooth' });
                break;
            }
            case 'open-flashcards':
                openDeutschFlashcards();
                break;
            case 'open-tournament':
                openDeutschTournament();
                break;
            case 'open-horror':
                openDeutschHorror();
                break;
            case 'open-verbs':
                openDeutschVerbs();
                break;
            case 'set-deutsch-filter':
                if (typeof setDeutschLevelFilter === 'function') {
                    setDeutschLevelFilter(el.getAttribute('data-level') || 'all');
                }
                break;
            case 'start-test':
                if (typeof startTest === 'function') {
                    startTest(el.getAttribute('data-level'));
                }
                break;
            case 'start-part':
                if (typeof startPart === 'function') startPart();
                break;
            case 'speak-text':
                if (typeof speakText === 'function') {
                    speakText(el.getAttribute('data-audio'), el.getAttribute('data-lang'));
                }
                break;
            case 'check-answer':
                if (typeof checkAnswer === 'function') {
                    checkAnswer(Number(el.getAttribute('data-index')));
                }
                break;
            case 'next-question':
                if (typeof nextQuestion === 'function') nextQuestion();
                break;
            case 'render-deutsch-home':
                openDeutschTests();
                break;
            case 'start-tournament':
                if (typeof startTournamentGame === 'function') startTournamentGame();
                break;
            case 'tournament-answer':
                if (typeof tournamentAnswer === 'function') {
                    tournamentAnswer(Number(el.getAttribute('data-index')));
                }
                break;
            case 'tournament-next':
                if (typeof tournamentNext === 'function') tournamentNext();
                break;
            case 'render-tournament-home':
                if (typeof renderTournamentHome === 'function') renderTournamentHome();
                break;
        }
    }

    // Global Event Delegations
    document.addEventListener('click', (e) => {
        // 1. data-click elementlar (Flashcards, Matching Game, Tests va hk.)
        const clickEl = e.target.closest('[data-click]');
        if (clickEl) {
            runDataClickAction(clickEl.getAttribute('data-click'), e);
            return;
        }

        // 2. data-action elementlar
        const actionEl = e.target.closest('[data-action]');
        if (actionEl) {
            handleDataAction(actionEl, e);
            return;
        }

        // 3. Sub-nav Pill bar havolalari (#top-nav-links)
        const navLink = e.target.closest('#top-nav-links a[data-nav-lvl]');
        if (navLink) {
            e.preventDefault();
            const lvl = navLink.getAttribute('data-nav-lvl');
            navigateToModule(lvl, true);
            return;
        }

        // 4. Desktop Dock navigatsiya tugmalari
        const dockItem = e.target.closest('.desktop-dock .dock-item');
        if (dockItem) {
            e.preventDefault();
            const page = dockItem.getAttribute('data-page');
            navigateToModule(page, true);
            return;
        }
    });

    // Asosiy saytga qaytish linki (Local vs Prod domenni avtomatik aniqlash)
    function initBackToMain() {
        const btn = document.getElementById('back-to-main');
        if (!btn) return;
        const host = (window.location.hostname || '').toLowerCase();
        if (host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:') {
            btn.setAttribute('href', '/index.html');
        } else if (host === 'abdugofforov.uz' || host === 'www.abdugofforov.uz') {
            btn.setAttribute('href', '/');
        } else {
            btn.setAttribute('href', 'https://abdugofforov.uz');
        }
    }

    // Boot
    document.addEventListener('DOMContentLoaded', () => {
        initBackToMain();
        initCarousel();
        applyRoute();
    });
})();