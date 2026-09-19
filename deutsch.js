// ============================================================
// DEUTSCH AKADEMIYASI — DEUTSCH.ABDUGOFFOROV.UZ
// Mustaqil Nemis Tili Ta'lim Platformasi Mantiqi
// ============================================================

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
        const views = ['deutsch-view', 'flashcards-view', 'tournament-view'];
        views.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        document.body.classList.remove('horror-theme');
    }

    function setActiveDock(page) {
        document.querySelectorAll('.dock-item').forEach(item => {
            const itemPage = (item.getAttribute('data-page') || '').toUpperCase();
            if (itemPage === (page || '').toUpperCase()) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Top nav active class
        document.querySelectorAll('#top-nav-links a').forEach(a => {
            const navLvl = (a.getAttribute('data-nav-lvl') || '').toUpperCase();
            if (navLvl === (page || '').toUpperCase()) {
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
        openDeutschLevel('A1', pushHistory);
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

    // Routing
    function applyRoute() {
        const hash = (window.location.hash || '#a1').toLowerCase();
        if (hash.includes('a1')) {
            openDeutschLevel('A1', false);
        } else if (hash.includes('a2')) {
            openDeutschLevel('A2', false);
        } else if (hash.includes('b1')) {
            openDeutschLevel('B1', false);
        } else if (hash.includes('b2')) {
            openDeutschLevel('B2', false);
        } else if (hash.includes('flashcard')) {
            openDeutschFlashcards(false);
        } else if (hash.includes('game') || hash.includes('match')) {
            openDeutschGames(false);
        } else if (hash.includes('tournament')) {
            openDeutschTournament(false);
        } else if (hash.includes('horror')) {
            openDeutschHorror(false);
        } else {
            openDeutschLevel('A1', false);
        }
    }

    window.addEventListener('popstate', applyRoute);

    // Event Delegations
    document.addEventListener('click', (e) => {
        // Top Nav Level havolalari
        const navLink = e.target.closest('#top-nav-links a[data-nav-lvl]');
        if (navLink) {
            e.preventDefault();
            const lvl = navLink.getAttribute('data-nav-lvl');
            openDeutschLevel(lvl);
            return;
        }

        const modeCard = e.target.closest('.deutsch-mode-card');
        if (modeCard) {
            const action = modeCard.getAttribute('data-action');
            if (action === 'open-flashcards') openDeutschFlashcards();
            else if (action === 'open-tournament') openDeutschTournament();
            else if (action === 'open-horror') openDeutschHorror();
            return;
        }

        const dockItem = e.target.closest('.desktop-dock .dock-item');
        if (dockItem) {
            const page = dockItem.getAttribute('data-page');
            if (['A1', 'A2', 'B1', 'B2'].includes(page)) {
                openDeutschLevel(page);
            } else if (page === 'tests') openDeutschTests();
            else if (page === 'flashcards') openDeutschFlashcards();
            else if (page === 'games') openDeutschGames();
            else if (page === 'tournament') openDeutschTournament();
        }
    });

    // Boot
    document.addEventListener('DOMContentLoaded', () => {
        initCarousel();
        applyRoute();
    });
})();