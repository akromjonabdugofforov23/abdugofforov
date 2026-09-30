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
        const views = ['deutsch-view', 'flashcards-view', 'tournament-view', 'verb-trainer-view'];
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

        // Top nav active class
        document.querySelectorAll('#top-nav-links a').forEach(a => {
            const navLvl = (a.getAttribute('data-nav-lvl') || '').toUpperCase();
            if (navLvl === p) {
                a.classList.add('active');
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
        if (typeof renderTournamentHome === 'function') renderTournamentHome();
        if (pushHistory) history.pushState({ page: 'tournament' }, '', '#tournament');
    };

    window.openDeutschHorror = function(pushHistory = true) {
        hideAllViews();
        const v = document.getElementById('deutsch-view');
        if (v) v.style.display = 'block';
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

    // Routing
    function applyRoute() {
        const hash = (window.location.hash || '#a1').toLowerCase();
        if (hash.includes('test')) {
            openDeutschTests(false);
        } else if (hash.includes('a1')) {
            openDeutschLevel('A1', false);
        } else if (hash.includes('a2')) {
            openDeutschLevel('A2', false);
        } else if (hash.includes('b1')) {
            openDeutschLevel('B1', false);
        } else if (hash.includes('b2')) {
            openDeutschLevel('B2', false);
        } else if (hash.includes('flashcard') || hash.includes('lugat')) {
            openDeutschFlashcards(false);
        } else if (hash.includes('game') || hash.includes('match') || hash.includes('oyin')) {
            openDeutschGames(false);
        } else if (hash.includes('tournament') || hash.includes('turnir')) {
            openDeutschTournament(false);
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

        // 3. Top Nav havolalari
        const navLink = e.target.closest('#top-nav-links a[data-nav-lvl]');
        if (navLink) {
            e.preventDefault();
            const lvl = navLink.getAttribute('data-nav-lvl');
            if (['A1', 'A2', 'B1', 'B2'].includes(lvl)) {
                openDeutschLevel(lvl);
            } else if (lvl === 'tests') {
                openDeutschTests();
            } else if (lvl === 'flashcards') {
                openDeutschFlashcards();
            } else if (lvl === 'games') {
                openDeutschGames();
            } else if (lvl === 'tournament') {
                openDeutschTournament();
            }
            return;
        }

        // 4. Desktop Dock navigatsiya tugmalari
        const dockItem = e.target.closest('.desktop-dock .dock-item');
        if (dockItem) {
            e.preventDefault();
            const page = dockItem.getAttribute('data-page');
            if (['A1', 'A2', 'B1', 'B2'].includes(page)) {
                openDeutschLevel(page);
            } else if (page === 'tests') {
                openDeutschTests();
            } else if (page === 'flashcards') {
                openDeutschFlashcards();
            } else if (page === 'games') {
                openDeutschGames();
            } else if (page === 'tournament') {
                openDeutschTournament();
            } else if (page === 'verbs') {
                openDeutschVerbs();
            }
            return;
        }
    });

    // Boot
    document.addEventListener('DOMContentLoaded', () => {
        initCarousel();
        applyRoute();
    });
})();