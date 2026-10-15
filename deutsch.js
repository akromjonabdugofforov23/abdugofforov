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
        const savedTheme = localStorage.getItem('abdu_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('abdu_theme', next);
        });
    }
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

    function renderFallbackTandem() {
        const c = document.getElementById('tandem-inline-content');
        if (!c || c.dataset.loaded) return;
        c.dataset.loaded = '1';
        c.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:20px; padding:28px 24px; max-width:860px; margin:0 auto; box-shadow:var(--shadow-sm);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                    <div style="font-size:32px;">💬</div>
                    <div>
                        <h2 style="font-size:22px; font-weight:700; color:var(--text-primary); margin:0;">Tandem Muloqot Simulyatori</h2>
                        <p style="color:var(--text-secondary); font-size:13px; margin:4px 0 0 0;">Kundalik hayotdagi real dialog ssenariylari orqali nemischa gapirishni mashq qiling</p>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
                    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:14px; padding:18px;">
                        <span style="font-size:11px; font-weight:700; color:#2dd4bf; text-transform:uppercase; letter-spacing:0.05em;">☕ Ssenariy 1</span>
                        <h4 style="font-size:16px; margin:6px 0 10px 0; color:var(--text-primary);">Im Café (Kafeda)</h4>
                        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">– Guten Tag! Was darf es sein?<br>– Ein Cappuccino bitte, und ein Stück Kuchen.</p>
                        <button type="button" class="btn-primary" style="padding:6px 14px; font-size:12px;" onclick="speakGermanText('Guten Tag! Was darf es sein? Ein Cappuccino bitte, und ein Stück Kuchen.')">🔊 Tinglash</button>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:14px; padding:18px;">
                        <span style="font-size:11px; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:0.05em;">🚆 Ssenariy 2</span>
                        <h4 style="font-size:16px; margin:6px 0 10px 0; color:var(--text-primary);">Am Bahnhof (Vokzalda)</h4>
                        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">– Entschuldigung, wann fährt der nächste Zug nach Berlin?<br>– Gleis 4, in zehn Minuten.</p>
                        <button type="button" class="btn-primary" style="padding:6px 14px; font-size:12px;" onclick="speakGermanText('Entschuldigung, wann fährt der nächste Zug nach Berlin? Gleis 4, in zehn Minuten.')">🔊 Tinglash</button>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:14px; padding:18px;">
                        <span style="font-size:11px; font-weight:700; color:#a855f7; text-transform:uppercase; letter-spacing:0.05em;">🤝 Ssenariy 3</span>
                        <h4 style="font-size:16px; margin:6px 0 10px 0; color:var(--text-primary);">Kennenlernen (Tanishuv)</h4>
                        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">– Hallo! Ich heiße Anna, wie heißt du?<br>– Freut mich! Ich bin Akrom und lerne Deutsch.</p>
                        <button type="button" class="btn-primary" style="padding:6px 14px; font-size:12px;" onclick="speakGermanText('Hallo! Ich heiße Anna, wie heißt du? Freut mich! Ich bin Akrom und lerne Deutsch.')">🔊 Tinglash</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderFallbackPronounce() {
        const c = document.getElementById('pronounce-inline-content');
        if (!c || c.dataset.loaded) return;
        c.dataset.loaded = '1';
        c.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:20px; padding:28px 24px; max-width:860px; margin:0 auto; box-shadow:var(--shadow-sm);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                    <div style="font-size:32px;">🎙️</div>
                    <div>
                        <h2 style="font-size:22px; font-weight:700; color:var(--text-primary); margin:0;">Nemis Tili Talaffuz Murabbiyi</h2>
                        <p style="color:var(--text-secondary); font-size:13px; margin:4px 0 0 0;">Nemis tilidagi murakkab tovushlar va tez aytishlar (Zungenbrecher)</p>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px; margin-bottom:24px;">
                    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:12px; padding:14px;">
                        <strong style="color:#2dd4bf; font-size:15px;">ä, ö, ü (Umlautlar)</strong>
                        <p style="font-size:12.5px; color:var(--text-secondary); margin:6px 0 10px 0;">Äpfel, schön, über, für, hören</p>
                        <button type="button" class="btn-primary" style="padding:5px 12px; font-size:11px;" onclick="speakGermanText('Äpfel, schön, über, für, hören')">🔊 Tinglash</button>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:12px; padding:14px;">
                        <strong style="color:#38bdf8; font-size:15px;">ch & sch tovushlari</strong>
                        <p style="font-size:12.5px; color:var(--text-secondary); margin:6px 0 10px 0;">ich, nicht, Buch, Sprache, Schule</p>
                        <button type="button" class="btn-primary" style="padding:5px 12px; font-size:11px;" onclick="speakGermanText('ich, nicht, Buch, Sprache, Schule')">🔊 Tinglash</button>
                    </div>
                    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:12px; padding:14px;">
                        <strong style="color:#a855f7; font-size:15px;">sp & st tovushlari</strong>
                        <p style="font-size:12.5px; color:var(--text-secondary); margin:6px 0 10px 0;">Sport, sprechen, Stadt, stehen</p>
                        <button type="button" class="btn-primary" style="padding:5px 12px; font-size:11px;" onclick="speakGermanText('Sport, sprechen, Stadt, stehen')">🔊 Tinglash</button>
                    </div>
                </div>
                <h4 style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:12px;">⚡ Mashhur Nemis Tez Aytishlari:</h4>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:12px; padding:14px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                        <span style="font-size:13.5px; color:var(--text-primary); flex:1; min-width:240px;">"Fischers Fritz fischt frische Fische, frische Fische fischt Fischers Fritz."</span>
                        <button type="button" class="btn-primary" style="padding:6px 12px; font-size:11.5px;" onclick="speakGermanText('Fischers Fritz fischt frische Fische, frische Fische fischt Fischers Fritz.')">🔊 Tinglash</button>
                    </div>
                    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:12px; padding:14px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                        <span style="font-size:13.5px; color:var(--text-primary); flex:1; min-width:240px;">"Braune Borstenviecher bürsten brave Bauernburschen."</span>
                        <button type="button" class="btn-primary" style="padding:6px 12px; font-size:11.5px;" onclick="speakGermanText('Braune Borstenviecher bürsten brave Bauernburschen.')">🔊 Tinglash</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderFallbackIdioms() {
        const c = document.getElementById('idioms-inline-content');
        if (!c || c.dataset.loaded) return;
        c.dataset.loaded = '1';
        const IDIOMS = [
            { de: "Daumen drücken", uz: "Omad tilamoq", lit: "Bosh barmoqlarni qismoq", ex: "Ich drücke dir die Daumen!" },
            { de: "Ich verstehe nur Bahnhof", uz: "Hech narsaga tushunmayapman", lit: "Faqat vokzalni tushunyapman", ex: "Rede langsamer, ich verstehe nur Bahnhof." },
            { de: "Das ist nicht mein Bier", uz: "Bu mening ishim emas", lit: "Bu mening pivom emas", ex: "Lass mich in Ruhe, das ist nicht mein Bier." },
            { de: "Tomaten auf den Augen haben", uz: "Ko'rib ko'rmaslikka olmoq", lit: "Ko'zida pomidor bo'lmoq", ex: "Hast du Tomaten auf den Augen? Da steht es doch!" },
            { de: "Ins Fettnäpfchen treten", uz: "Noo'rin gap aytib qo'ymoq", lit: "Yog' kosasiga qadam bosmoq", ex: "Er ist gestern ins Fettnäpfchen getreten." },
            { de: "Alles in Butter", uz: "Hammasi joyida, hammasi a'lo", lit: "Hammasi sariyog' ichida", ex: "Keine Sorge, alles ist in Butter." }
        ];
        c.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:20px; padding:28px 24px; max-width:860px; margin:0 auto; box-shadow:var(--shadow-sm);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                    <div style="font-size:32px;">🥨</div>
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

    function renderFallbackCorrector() {
        const c = document.getElementById('corrector-inline-content');
        if (!c || c.dataset.loaded) return;
        c.dataset.loaded = '1';
        c.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:20px; padding:28px 24px; max-width:860px; margin:0 auto; box-shadow:var(--shadow-sm);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                    <div style="font-size:32px;">✍️</div>
                    <div>
                        <h2 style="font-size:22px; font-weight:700; color:var(--text-primary); margin:0;">Insho va Matn Tahrirchisi</h2>
                        <p style="color:var(--text-secondary); font-size:13px; margin:4px 0 0 0;">Nemis tilida gap yoki insho yozing — so'zlar va qoidalar hisobi real vaqtda ko'rsatiladi</p>
                    </div>
                </div>
                <div style="margin-bottom:12px; display:flex; gap:6px; flex-wrap:wrap;">
                    <span style="font-size:12px; color:var(--text-secondary); align-self:center;">Tezkor harflar:</span>
                    ${['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß'].map(ch => `
                        <button type="button" class="btn-icon" style="width:32px; height:32px; min-width:32px; min-height:32px; font-size:13px; border-radius:6px;" onclick="insertCorrectorChar('${ch}')">${ch}</button>
                    `).join('')}
                </div>
                <textarea id="corrector-textarea" placeholder="Nemis tilidagi matningizni bu yerga yozing..." style="width:100%; min-height:160px; padding:14px; border-radius:12px; background:rgba(0,0,0,0.25); border:1px solid var(--border-color); color:var(--text-primary); font-family:inherit; font-size:14.5px; line-height:1.6; resize:vertical; outline:none;"></textarea>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-top:12px; flex-wrap:wrap; gap:10px;">
                    <div style="font-size:12.5px; color:var(--text-secondary);" id="corrector-stats">
                        So'zlar: <strong>0</strong> | Belgilar: <strong>0</strong>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button type="button" class="btn-primary" style="padding:8px 16px; font-size:13px;" id="corrector-speak-btn">🔊 O'qib berish</button>
                    </div>
                </div>
            </div>
        `;
        const ta = document.getElementById('corrector-textarea');
        const stats = document.getElementById('corrector-stats');
        const speakBtn = document.getElementById('corrector-speak-btn');
        if (ta && stats) {
            ta.addEventListener('input', () => {
                const text = ta.value.trim();
                const words = text ? text.split(/\s+/).length : 0;
                const chars = text.length;
                stats.innerHTML = `So'zlar: <strong>${words}</strong> | Belgilar: <strong>${chars}</strong>`;
            });
        }
        if (speakBtn && ta) {
            speakBtn.addEventListener('click', () => {
                const text = ta.value.trim();
                if (text) speakGermanText(text);
            });
        }
        window.insertCorrectorChar = function(ch) {
            if (!ta) return;
            const start = ta.selectionStart || 0;
            const end = ta.selectionEnd || 0;
            ta.value = ta.value.substring(0, start) + ch + ta.value.substring(end);
            ta.focus();
            ta.setSelectionRange(start + ch.length, start + ch.length);
            ta.dispatchEvent(new Event('input'));
        };
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