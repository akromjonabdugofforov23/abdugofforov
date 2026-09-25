// Abdugofforov Blog & Portfolio - JavaScript Engine

function getCategoryIcon(category, type) {
    return '✍️';
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ============================================================
// IN-MEMORY SEARCH ENGINE & FUZZY MATCHER (Abdugofforov Engine)
// ============================================================
const SearchEngine = {
    index: {
        posts: [],
        tests: [],
        flashcards: []
    },

    normalize(str) {
        if (!str || typeof str !== 'string') return '';
        return str
            .toLowerCase()
            .replace(/[äàáâã]/g, 'a')
            .replace(/[öòóôõ]/g, 'o')
            .replace(/[üùúû]/g, 'u')
            .replace(/ß/g, 'ss')
            .replace(/[ʻʼ'`’‘]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    },

    tokenize(str) {
        const norm = this.normalize(str);
        return norm ? norm.split(' ').filter(t => t.length > 0) : [];
    },

    levenshtein(a, b) {
        if (a === b) return 0;
        const la = a.length, lb = b.length;
        if (la === 0) return lb;
        if (lb === 0) return la;
        if (Math.abs(la - lb) > 2) return 999;

        let prev = new Array(lb + 1);
        let curr = new Array(lb + 1);
        for (let j = 0; j <= lb; j++) prev[j] = j;

        for (let i = 1; i <= la; i++) {
            curr[0] = i;
            const ca = a.charCodeAt(i - 1);
            for (let j = 1; j <= lb; j++) {
                const cb = b.charCodeAt(j - 1);
                const cost = (ca === cb) ? 0 : 1;
                curr[j] = Math.min(
                    prev[j] + 1,
                    curr[j - 1] + 1,
                    prev[j - 1] + cost
                );
            }
            const tmp = prev;
            prev = curr;
            curr = tmp;
        }
        return prev[lb];
    },

    isWordMatch(qToken, tToken) {
        if (!qToken || !tToken) return { match: false, score: 0 };
        if (tToken === qToken) return { match: true, score: 100 };
        if (tToken.startsWith(qToken)) return { match: true, score: 85 };
        if (tToken.includes(qToken)) return { match: true, score: 70 };
        if (qToken.includes(tToken) && tToken.length >= 3) return { match: true, score: 60 };

        // Fuzzy match: max distance 1 for 3-4 chars, 2 for 5+ chars
        if (qToken.length >= 3) {
            const prefix = tToken.slice(0, qToken.length + 1);
            const dPrefix = this.levenshtein(qToken, prefix);
            if (dPrefix <= (qToken.length <= 4 ? 1 : 2)) {
                return { match: true, score: 65 - dPrefix * 15 };
            }
            const dist = this.levenshtein(qToken, tToken);
            if (dist <= (qToken.length <= 4 ? 1 : 2)) {
                return { match: true, score: 55 - dist * 15 };
            }
        }
        return { match: false, score: 0 };
    },

    rebuildIndex() {
        // Posts
        this.index.posts = (typeof posts !== 'undefined' && Array.isArray(posts) ? posts : []).map(p => {
            const rawText = `${p.title || ''} ${p.excerpt || ''} ${p.category || ''} ${p.content || ''} ${p.artist || ''} ${p.author || ''} ${(p.tags || []).join(' ')}`;
            return {
                id: p.id,
                type: 'post',
                category: p.category || 'Maqola',
                title: p.title || '',
                excerpt: p.excerpt || '',
                normText: this.normalize(rawText),
                tokens: this.tokenize(rawText),
                raw: p
            };
        });

        // Tests
        this.index.tests = [];
        if (typeof deutschTests !== 'undefined') {
            for (let testId in deutschTests) {
                const t = deutschTests[testId];
                const rawText = `${t.title || ''} ${t.level || ''} ${t.note || ''} nemis tili test deutsch`;
                this.index.tests.push({
                    id: testId,
                    type: 'test',
                    category: `Nemis tili testi (${t.level || 'A1'})`,
                    title: t.title || `Nemis tili ${t.level || 'A1'} Testi`,
                    excerpt: t.note || `${t.level || 'A1'} darajali nemis tili interaktiv test to'plami.`,
                    level: t.level || 'A1',
                    normText: this.normalize(rawText),
                    tokens: this.tokenize(rawText),
                    raw: t
                });
            }
        } else if (typeof DEUTSCH_LEVELS_DATA !== 'undefined') {
            DEUTSCH_LEVELS_DATA.forEach(lv => {
                lv.tests.forEach(t => {
                    const rawText = `${t.name || ''} ${t.note || ''} ${lv.label || ''} ${lv.sub || ''} ${lv.key || ''} nemis tili test deutsch`;
                    this.index.tests.push({
                        id: t.id,
                        type: 'test',
                        category: `Nemis tili (${lv.key})`,
                        title: `${lv.key} - ${t.name}`,
                        excerpt: t.note,
                        level: lv.key,
                        normText: this.normalize(rawText),
                        tokens: this.tokenize(rawText),
                        raw: t
                    });
                });
            });
        }

        // Flashcards
        this.index.flashcards = [];
        if (typeof flashcardDecks !== 'undefined') {
            const deckNames = {
                de_uz: "Nemischa → O'zbekcha",
                uz_de: "O'zbekcha → Nemischa",
                grammar: "Grammatika",
                sentences: "Gaplar va iboralar",
                quotes: "Iqtiboslar & hikmatlar",
                ueber_mich: "O'zim haqimda"
            };
            for (let deckKey in flashcardDecks) {
                const deckArr = flashcardDecks[deckKey] || [];
                const deckLabel = deckNames[deckKey] || deckKey;
                deckArr.forEach((c, idx) => {
                    const rawText = `${c.front || ''} ${c.back || ''} ${deckLabel} flashcard kartochka nemis tili`;
                    this.index.flashcards.push({
                        id: `${deckKey}_${idx}`,
                        deckKey: deckKey,
                        cardIndex: idx,
                        type: 'flashcard',
                        category: `Kartochka (${deckLabel})`,
                        title: c.front || '',
                        excerpt: c.back || '',
                        front: c.front || '',
                        back: c.back || '',
                        normText: this.normalize(rawText),
                        tokens: this.tokenize(rawText),
                        raw: c
                    });
                });
            }
        }
    },

    search(query, typeFilter = 'all') {
        const qNorm = this.normalize(query);
        if (!qNorm) return [];
        const qTokens = this.tokenize(query);
        if (qTokens.length === 0) return [];

        if (this.index.posts.length === 0 && posts.length > 0) {
            this.rebuildIndex();
        }

        let candidates = [];
        if (typeFilter === 'all' || typeFilter === 'posts') candidates = candidates.concat(this.index.posts);
        if (typeFilter === 'all' || typeFilter === 'tests') candidates = candidates.concat(this.index.tests);
        if (typeFilter === 'all' || typeFilter === 'flashcards') candidates = candidates.concat(this.index.flashcards);

        const results = [];

        for (let i = 0; i < candidates.length; i++) {
            const item = candidates[i];
            let totalScore = 0;
            let matchedTokens = 0;

            if (item.normText.includes(qNorm)) {
                totalScore += 100;
            }

            const titleNorm = this.normalize(item.title || item.front || '');
            if (titleNorm.includes(qNorm)) {
                totalScore += titleNorm.startsWith(qNorm) ? 120 : 80;
            }

            for (let q = 0; q < qTokens.length; q++) {
                const qToken = qTokens[q];
                let bestScore = 0;
                for (let t = 0; t < item.tokens.length; t++) {
                    const res = this.isWordMatch(qToken, item.tokens[t]);
                    if (res.match && res.score > bestScore) {
                        bestScore = res.score;
                    }
                }
                if (bestScore > 0) {
                    matchedTokens++;
                    totalScore += bestScore;
                }
            }

            if (totalScore >= 45 && (matchedTokens >= Math.min(1, qTokens.length) || item.normText.includes(qNorm))) {
                results.push({
                    item: item,
                    score: totalScore,
                    tokens: qTokens
                });
            }
        }

        results.sort((a, b) => b.score - a.score);
        return results;
    },

    highlight(text, query) {
        if (!text || typeof text !== 'string') return '';
        if (!query || typeof query !== 'string' || !query.trim()) return escapeHTML(text);

        const qTokens = this.tokenize(query);
        if (qTokens.length === 0) return escapeHTML(text);

        const escaped = escapeHTML(text);
        const sortedTokens = [...qTokens].filter(t => t.length >= 2).sort((a, b) => b.length - a.length);
        if (sortedTokens.length === 0) return escaped;

        const regexPattern = sortedTokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        if (!regexPattern) return escaped;

        try {
            const regex = new RegExp(`(${regexPattern})`, 'gi');
            return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
        } catch (e) {
            return escaped;
        }
    }
};
window.SearchEngine = SearchEngine;

// State (Holat) - Abdugofforov rebrending kalitlari bilan boshlash
// posts endi IndexedDB (Store) orqali yuklanadi Ã¢â‚¬â€  bootstrap() ichida hydrate qilinadi.
let posts = [];
let currentTab = 'home'; 
let filterType = 'all'; 
let searchQuery = '';
let searchCategoryTab = 'all'; 
let editingPostId = null;
function checkIsAdmin() {
    try {
        if (window.Auth && typeof Auth.isAdmin === 'function') {
            return Auth.isAdmin();
        }
    } catch (_) {}
    return sessionStorage.getItem('kay_admin') === 'true';
}
let isAdmin = checkIsAdmin();

// 2. DOM Elementlari
const blogGrid = document.getElementById('blog-grid');
const mainNav = document.getElementById('main-nav');
const navLogo = document.getElementById('nav-logo');
const searchInput = document.getElementById('search-input');
const filterTags = document.getElementById('filter-tags');
const themeBtn = document.getElementById('theme-btn');
const addPostBtn = document.getElementById('add-post-btn');

// Modallar
const postDetailModal = document.getElementById('post-detail-modal');
const closeDetailModal = document.getElementById('close-detail-modal');
const detailModalBody = document.getElementById('detail-modal-body');

const mainContent = document.getElementById('main-content');

// Hero Section elementlari
const heroMainTitle = document.getElementById('hero-main-title');
const heroSub = document.getElementById('hero-sub');

// 4. Ob-havo va Vaqt Vidjeti
function updateClock() {
    try {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const mo = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();
        const dateStr = `${d}.${mo}.${y}`;

        document.querySelectorAll('[data-clock="h"]').forEach(el => {
            if (el.textContent !== h) el.textContent = h;
        });
        document.querySelectorAll('[data-clock="m"]').forEach(el => {
            if (el.textContent !== m) el.textContent = m;
        });
        document.querySelectorAll('[data-clock="s"]').forEach(el => {
            if (el.textContent !== s) el.textContent = s;
        });

        document.querySelectorAll('#widget-date, .fc-date').forEach(el => {
            el.textContent = dateStr;
        });
    } catch (e) {
        console.error("Soatni yangilashda xatolik:", e);
    }
}
setInterval(updateClock, 1000);
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateClock);
} else {
    updateClock();
}

// 5. Mavzuni boshqarish (Kunduzgi / Tungi rejim)
function initTheme() {
    const savedTheme = localStorage.getItem('kay_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (document.body) document.body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function updateThemeButton(theme) {
    const themeBtns = document.querySelectorAll('.theme-toggle, #theme-btn, #dock-theme, #drawer-theme-btn');
    themeBtns.forEach(btn => {
        btn.setAttribute('aria-label', theme === 'dark' ? 'Kunduzgi rejimga o\'tish' : 'Tungi rejimga o\'tish');
        const moon = btn.querySelector('.moon-icon');
        const sun = btn.querySelector('.sun-icon');
        if (moon && sun) {
            if (theme === 'light') {
                moon.style.display = 'none';
                sun.style.display = 'block';
            } else {
                moon.style.display = 'block';
                sun.style.display = 'none';
            }
        }
    });

    // Mobil menyu (drawer) ichidagi rejim matnini yangilash
    const drawerLabel = document.getElementById('drawer-theme-label');
    if (drawerLabel) {
        drawerLabel.textContent = theme === 'dark' ? '☀️ Kunduzgi rejim' : '🌙 Tungi rejim';
    }
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('#theme-btn, .theme-toggle, #dock-theme, #drawer-theme-btn');
    if (btn) {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        if (document.body) document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('kay_theme', newTheme);
        updateThemeButton(newTheme);
        if (typeof refreshParticlesTheme === 'function') refreshParticlesTheme();
    }
});

// 6. Ma'lumotlarni saqlash (IndexedDB orqali Ã¢â‚¬â€  katta sig'im) + serverga sinxronlash
function savePosts() {
    try {
        if (window.Store && Store.ready) {
            Store.set('abdu_posts', posts);
        } else {
            localStorage.setItem('abdu_posts', JSON.stringify(posts));
        }
    } catch (e) {
        console.error('Postlarni saqlashda xato:', e);
        throw e;
    }

    // Agar admin tizimga kirgan bo'lsa Ã¢â‚¬â€ postlarni umumiy serverga ham yuboramiz
    // shunda barcha mehmonlar yangi postlarni ko'radi.
    syncPostsToServer();
}

// Server bilan sinxronlash holatini ko'rsatish uchun oddiy "toast"
function showToast(message, kind) {
    let el = document.getElementById('abdu-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'abdu-toast';
        el.className = 'abdu-toast';
        document.body.appendChild(el);
    }
    el.textContent = message;
    el.dataset.kind = kind || 'info';
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove('show'), 3800);
}

let _syncInFlight = false;
let _syncQueued = false;

async function syncPostsToServer() {
    isAdmin = checkIsAdmin();
    if (!isAdmin || !window.Sync) return;
    const token = sessionStorage.getItem('kay_admin_token');
    const pin = sessionStorage.getItem('kay_admin_pin');
    const userToken = (window.Auth && Auth.token) || null;
    if (!token && !pin && !userToken) return; // auth ma'lumoti yo'q

    // Bir vaqtning o'zida bir nechta yuborishni oldini olamiz
    if (_syncInFlight) { _syncQueued = true; return; }
    _syncInFlight = true;

    const result = await Sync.pushPosts(posts, { token, pin, userToken });
    _syncInFlight = false;

    if (result.ok) {
        showToast("✅ Post serverga sinxronlandi — endi hammaga ko'rinadi", 'success');
    } else if (result.reason === 'not_configured') {
        showToast("⚠️ Server ombori sozlanmagan (POSTS_KV) — post faqat shu qurilmada ko'rinadi", 'warn');
    } else if (result.reason === 'unauthorized') {
        // Token eskirgan bo'lishi mumkin — admin sessiyasi tugagan
        sessionStorage.removeItem('kay_admin_token');
        showToast("❌ Admin sessiyasi tugagan — /kay sahifasiga kirib qayta tasdiqlang", 'error');
    } else if (result.reason === 'too_large') {
        showToast("⚠️ Ma'lumot juda katta — rasmlarni kichraytiring", 'warn');
    } else {
        showToast("⚠️ Sinxronlash bo'lmadi: " + (result.message || "noma'lum xato"), 'warn');
    }

    // Qator turgan yangi o'zgarishlar bo'lsa, yana yuboramiz
    if (_syncQueued) {
        _syncQueued = false;
        syncPostsToServer();
    }
}

// 7. Hero matnini dinamik o'zgartirish
// MUHIM: hero-main-title (h1) ichida typewriter span va cursor bor.
// textContent bilan to'liq almashtirsak ular o'chadi. Faqat subtitle'ni
// yangilaymiz; sarlavhani typewriter boshqaradi.
function updateHeroContent() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.classList.remove('animate-fade-in');
        void heroSection.offsetWidth;
        heroSection.classList.add('animate-fade-in');
    }
    if (heroSub) {
        heroSub.textContent = (currentTab === 'projects')
            ? (window.i18n ? window.i18n.t('hero.subtitle.projects') : 'Ijodiy Loyihalar')
            : (window.i18n ? window.i18n.t('hero.subtitle') : 'Shaxsiy blog & rivojlanish uchun');
    }
}

function setSearchCategoryTab(tab) {
    searchCategoryTab = tab;
    renderPosts(true);
}

// 8. Postlarni filtrlash va render qilish
let _renderTimer = null;
function renderPosts(instant) {
    if (_renderTimer) { clearTimeout(_renderTimer); _renderTimer = null; }

    const currentHeight = blogGrid ? blogGrid.offsetHeight : 0;
    if (currentHeight > 0 && blogGrid) blogGrid.style.minHeight = currentHeight + 'px';

    const doRender = () => {
        _renderTimer = null;
        if (!blogGrid) return;
        blogGrid.innerHTML = '';
        blogGrid.classList.remove('animate-fade-in');
        void blogGrid.offsetWidth;
        blogGrid.classList.add('animate-fade-in');

        // ==========================================
        // 1. QIDIRUV REJIMI (Instant Search Engine)
        // ==========================================
        if (searchQuery) {
            blogGrid.style.display = '';
            SearchEngine.rebuildIndex();
            const allHits = SearchEngine.search(searchQuery, 'all');
            const counts = {
                all: allHits.length,
                posts: allHits.filter(h => h.item.type === 'post').length,
                tests: allHits.filter(h => h.item.type === 'test').length,
                flashcards: allHits.filter(h => h.item.type === 'flashcard').length
            };

            const filteredHits = searchCategoryTab === 'all'
                ? allHits
                : allHits.filter(h => h.item.type === (searchCategoryTab === 'tests' ? 'test' : (searchCategoryTab === 'flashcards' ? 'flashcard' : 'post')));

            // Search Results Summary & Filter Pills Header
            const searchHeader = document.createElement('div');
            searchHeader.className = 'search-results-header';
            searchHeader.style.gridColumn = '1 / -1';
            searchHeader.innerHTML = `
                <div class="search-results-meta">
                    <div class="search-query-info">
                        🔍 <strong>"${escapeHTML(searchQuery)}"</strong> bo'yicha <b>${counts.all}</b> ta natija topildi
                    </div>
                    <div class="search-filter-pills">
                        <button class="search-filter-pill ${searchCategoryTab === 'all' ? 'active' : ''}" data-action="set-search-tab" data-tab="all">✨ Barchasi (${counts.all})</button>
                        <button class="search-filter-pill ${searchCategoryTab === 'posts' ? 'active' : ''}" data-action="set-search-tab" data-tab="posts">📝 Maqolalar (${counts.posts})</button>
                        <button class="search-filter-pill ${searchCategoryTab === 'tests' ? 'active' : ''}" data-action="set-search-tab" data-tab="tests">🇩🇪 Testlar (${counts.tests})</button>
                        <button class="search-filter-pill ${searchCategoryTab === 'flashcards' ? 'active' : ''}" data-action="set-search-tab" data-tab="flashcards">🃏 Kartochkalar (${counts.flashcards})</button>
                    </div>
                </div>
            `;
            blogGrid.appendChild(searchHeader);

            if (filteredHits.length === 0) {
                const emptyCard = document.createElement('div');
                emptyCard.className = 'empty-state atelier-empty-state';
                emptyCard.innerHTML = `
                    <div class="atelier-empty-icon-wrap" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <h3 class="atelier-empty-title">Hech qanday natija topilmadi</h3>
                    <p class="atelier-empty-desc">“${escapeHTML(searchQuery)}” so'zi bo'yicha bu toifada hech qanday ma'lumot chiqmadi.</p>
                    <div class="atelier-suggestions-label">Tavsiya etilgan toifalar</div>
                    <div class="atelier-suggestion-chips">
                        <button type="button" class="atelier-chip" data-action="set-search-tab" data-tab="all">✦ Barcha natijalar</button>
                        <button type="button" class="atelier-chip" data-action="clear-search">✕ Qidiruvni tozalash</button>
                    </div>
                `;
                blogGrid.appendChild(emptyCard);
                setTimeout(() => { if (blogGrid) blogGrid.style.minHeight = ''; }, 100);
                return;
            }

            filteredHits.forEach(hit => {
                const item = hit.item;
                
                // POST ITEM
                if (item.type === 'post') {
                    const post = item.raw;
                    const card = document.createElement('article');
                    card.className = 'post-card';
                    const highlightedTitle = SearchEngine.highlight(post.title, searchQuery);
                    const highlightedExcerpt = SearchEngine.highlight(post.excerpt, searchQuery);
                    const highlightedCat = SearchEngine.highlight(post.category, searchQuery);

                    card.innerHTML = `
                        <div class="post-image-wrapper">
                            <div class="post-image" style="background-image: url('${cssUrl(post.image, 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600')}');"></div>
                        </div>
                        <div class="post-content">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <span class="post-meta" style="margin-bottom:0;">${getCategoryIcon(post.category, post.type)} ${highlightedCat}</span>
                                <span class="search-type-badge badge-type-post">Maqola</span>
                            </div>
                            <h2 class="post-title">${highlightedTitle}</h2>
                            <p class="post-excerpt">${highlightedExcerpt}</p>
                            <div class="post-footer">
                                <span class="post-date">${formatDate(post.date)} - ⏳ ${readingTime(post)}</span>
                                <div class="post-stats">
                                    <div class="post-stat like-btn" data-id="${post.id}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                        <span>${post.likes || 0}</span>
                                    </div>
                                    <div class="post-stat">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <span>${(post.comments || []).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    card.addEventListener('click', (e) => {
                        if (e.target.closest('.like-btn')) {
                            handleLike(post.id);
                        } else if (post.type === 'music') {
                            playMusic(post);
                        } else {
                            openPostDetail(post.id);
                        }
                    });

                    blogGrid.appendChild(card);
                    observeReveal(card);
                } 
                // TEST ITEM
                else if (item.type === 'test') {
                    const card = document.createElement('div');
                    card.className = 'test-card post-card';
                    card.style.padding = '22px';
                    const highlightedTitle = SearchEngine.highlight(item.title, searchQuery);
                    const highlightedExcerpt = SearchEngine.highlight(item.excerpt, searchQuery);

                    card.innerHTML = `
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                <span class="search-type-badge badge-type-test">🇩🇪 Nemis tili (${item.level})</span>
                                <span class="test-card-badge">10 savol</span>
                            </div>
                            <h3 class="post-title" style="font-size:18px; margin-bottom:8px;">${highlightedTitle}</h3>
                            <p class="test-card-note" style="font-size:13.5px; line-height:1.5;">${highlightedExcerpt}</p>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; border-top:1px solid var(--glass-border); padding-top:12px;">
                            <span style="font-size:12px; color:var(--text-muted);">Interaktiv test</span>
                            <div class="test-card-cta">Testni boshlash &rarr;</div>
                        </div>
                    `;

                    card.addEventListener('click', () => {
                        if (typeof openDeutschView === 'function') openDeutschView();
                        if (typeof startTest === 'function') startTest(item.id);
                    });

                    blogGrid.appendChild(card);
                    observeReveal(card);
                } 
                // FLASHCARD ITEM
                else if (item.type === 'flashcard') {
                    const card = document.createElement('div');
                    card.className = 'fc-search-card post-card';
                    const highlightedFront = SearchEngine.highlight(item.front, searchQuery);
                    const highlightedBack = SearchEngine.highlight(item.back, searchQuery);

                    card.innerHTML = `
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <span class="search-type-badge badge-type-fc">${escapeHTML(item.category)}</span>
                                <button class="btn-icon fc-audio-btn" style="width:30px; height:30px; font-size:14px;" title="Talaffuz" data-click="speakGermanText('${escapeHTML(item.deckKey === 'uz_de' ? item.back : item.front).replace(/'/g, "\\'")}', event)">🔊</button>
                            </div>
                            <div class="fc-search-front" style="margin-bottom:8px;">${highlightedFront}</div>
                            <div class="fc-search-back">${highlightedBack}</div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--accent-color); font-weight:600; border-top:1px dashed var(--border-color); padding-top:10px;">
                            <span>🃏 Kartochkalarda mashq qilish</span>
                            <span>Ochish &rarr;</span>
                        </div>
                    `;

                    card.addEventListener('click', (e) => {
                        if (e.target.closest('.fc-audio-btn')) return;
                        if (typeof openFlashcardsView === 'function') openFlashcardsView();
                        if (typeof startFlashcardAt === 'function') startFlashcardAt(item.deckKey, item.cardIndex);
                        else if (typeof startFlashcards === 'function') startFlashcards(item.deckKey);
                    });

                    blogGrid.appendChild(card);
                    observeReveal(card);
                }
            });

            setTimeout(() => { if (blogGrid) blogGrid.style.minHeight = ''; }, 100);
            return;
        }

        // ==========================================
        // 2. ODDIY POSTLAR REJIMI (Category Filters)
        // ==========================================
        const filtered = posts.filter(post => {
            if (filterType === 'none') return false;
            if (currentTab === 'projects' && post.type !== 'project') return false;

            if (filterType !== 'all') {
                const postCat = (post && post.category ? post.category : '').toLowerCase().replace(/[^a-z0-9]/g, '');
                const targetCat = (filterType || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                if (postCat !== targetCat) return false;
            }
            return true;
        });

        if (filtered.length === 0) {
            blogGrid.style.display = 'grid';
            blogGrid.innerHTML = `
                <div class="empty-blog-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--card-bg); border: 1px dashed var(--border-color); border-radius: 16px; margin: 10px 0 30px;">
                    <div style="font-size: 42px; margin-bottom: 12px; line-height: 1;">✍️</div>
                    <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0;">Hozircha maqolalar mavjud emas</h3>
                    <p style="font-size: 14px; color: var(--text-secondary); max-width: 440px; margin: 0 auto; line-height: 1.6;">Tez orada yangi maqolalar joylanadi. Yangiliklarni kuzatib boring!</p>
                </div>
            `;
            return;
        }

        blogGrid.style.display = '';

        filtered.forEach(post => {
            const card = document.createElement('article');
            card.className = 'post-card';
            
            if (post.type === 'music') {
                card.innerHTML = `
                    <div class="post-image-wrapper">
                        <div class="post-image" style="background-image: url('${cssUrl(post.image, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600')}');"></div>
                    </div>
                    <div class="post-content">
                        <span class="post-meta">${getCategoryIcon(post.category, post.type)} ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>

                        <div class="music-actions">
                            ${post.artist ? `<span class="music-artist">🎤 ${escapeHTML(post.artist)}</span>` : ''}
                            <div class="music-btn-row">
                                ${post.link ? `<button class="btn-primary btn-sm music-play-btn" data-id="${post.id}">${i18n.t('music.listen')}</button>` : ''}
                                ${post.link ? `<a class="btn-secondary btn-sm music-open-btn" href="${safeUrl(post.link)}" target="_blank" rel="noopener noreferrer">${i18n.t('music.open')}</a>` : ''}
                            </div>
                        </div>

                        <div class="post-footer" style="margin-top: 15px;">
                            <span class="post-date">${formatDate(post.date)} - ⏳ ${readingTime(post)}</span>
                            <div class="post-stats">
                                <div class="post-stat like-btn" data-id="${post.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>${post.likes || 0}</span>
                                </div>
                                <div class="post-stat">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>${(post.comments || []).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (post.type === 'image') {
                card.innerHTML = `
                    <div class="post-image-wrapper image-gallery-card">
                        <div class="post-image zoomable-bg" data-zoom-src="${escapeHTML(safeImageUrl(post.image))}" style="background-image: url('${cssUrl(post.image)}');"></div>
                    </div>
                    <div class="post-content">
                        <span class="post-meta">${getCategoryIcon(post.category, post.type)} ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
                        
                        <div class="post-footer">
                            <span class="post-date">${formatDate(post.date)} - ⏳ ${readingTime(post)}</span>
                            <div class="post-stats">
                                <div class="post-stat like-btn" data-id="${post.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>${post.likes || 0}</span>
                                </div>
                                <div class="post-stat">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>${(post.comments || []).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (post.type === 'video') {
                card.innerHTML = `
                    <div class="post-image-wrapper">
                        ${post.videoData 
                            ? `<video class="post-video-thumb" style="width:100%; height:100%; object-fit:cover; border-radius:12px 12px 0 0;" muted preload="metadata" src="${post.videoData}"></video>`
                            : `<div class="post-image" style="background-image: url('${cssUrl(post.image, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600')}');"></div>`
                        }
                        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.6); border-radius:50%; width:48px; height:48px; display:flex; align-items:center; justify-content:center; pointer-events:none;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <span class="post-meta">${getCategoryIcon(post.category, post.type)} ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
                        <div class="post-footer">
                            <span class="post-date">${formatDate(post.date)} - ⏳ ${readingTime(post)}</span>
                            <div class="post-stats">
                                <div class="post-stat like-btn" data-id="${post.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>${post.likes || 0}</span>
                                </div>
                                <div class="post-stat">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>${(post.comments || []).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="post-image-wrapper">
                        <div class="post-image" style="background-image: url('${cssUrl(post.image, 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600')}');"></div>
                    </div>
                    <div class="post-content">
                        <span class="post-meta">${getCategoryIcon(post.category, post.type)} ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
                        <div class="post-footer">
                            <span class="post-date">${formatDate(post.date)} - ⏳ ${readingTime(post)}</span>
                            <div class="post-stats">
                                <div class="post-stat like-btn" data-id="${post.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>${post.likes || 0}</span>
                                </div>
                                <div class="post-stat">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>${(post.comments || []).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            card.addEventListener('click', (e) => {
                if (e.target.closest('.like-btn')) {
                    handleLike(post.id);
                } else if (e.target.closest('.zoomable-bg')) {
                    const z = e.target.closest('.zoomable-bg');
                    openLightbox(z.getAttribute('data-zoom-src'));
                } else if (e.target.closest('.music-open-btn')) {
                    e.stopPropagation();
                } else if (e.target.closest('.music-play-btn')) {
                    e.stopPropagation();
                    playMusic(post);
                } else {
                    openPostDetail(post.id);
                }
            });

            blogGrid.appendChild(card);
            observeReveal(card);
        });

        setTimeout(() => { if (blogGrid) blogGrid.style.minHeight = ''; }, 100);
    };

    if (instant) {
        doRender();
    } else {
        showSkeletons(3);
        _renderTimer = setTimeout(doRender, 150);
    }
} // <-- renderPosts funksiyasi shu yerda yopildi

// // Ko'rinishlarni almashtirish yordamchilari
function hideAuxViews() {
    const fortune = document.getElementById('fortune-widget-wrap');
    if (fortune) fortune.style.display = 'none';
}

function getDeutschDestination(hash) {
    let dest = 'https://deutsch.abdugofforov.uz/';
    if (!window.location.hostname.includes('abdugofforov.uz')) {
        dest = 'deutsch.html';
    }
    return hash ? dest + hash : dest;
}

// ===== SPA ROUTER & HISTORY STATE MANAGEMENT =====
function setAppRoute(route, push = true) {
    if (push && window.location.hash !== route) {
        try { history.pushState({ route: route }, '', route); } catch (e) {}
    }
}

function applyAppRoute(route) {
    const cleanRoute = (route || window.location.hash || '#home').toLowerCase();

    if (cleanRoute.includes('horror-deutsch') || cleanRoute.includes('nemistili') || cleanRoute.includes('deutsch') || cleanRoute.includes('verb') || cleanRoute.includes('flashcards') || cleanRoute.includes('tournament') || cleanRoute.includes('game')) {
        let dest = getDeutschDestination('#tests');
        if (cleanRoute.includes('verb')) dest = getDeutschDestination('#verbs');
        else if (cleanRoute.includes('flashcards')) dest = getDeutschDestination('#flashcards');
        else if (cleanRoute.includes('tournament')) dest = getDeutschDestination('#tournament');
        else if (cleanRoute.includes('game')) dest = getDeutschDestination('#games');
        else if (cleanRoute.includes('horror')) dest = getDeutschDestination('#horror');

        window.location.href = dest;
        return;
    } else {
        showMainView(false);
    }
}

window.addEventListener('popstate', (e) => {
    const route = (e.state && e.state.route) ? e.state.route : (window.location.hash || '#home');
    applyAppRoute(route);
});

function showMainView(pushHistory = true) {
    document.body.classList.remove('horror-theme');
    hideAuxViews();
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = '';
    if (mainContent) mainContent.style.display = '';
    const fortune = document.getElementById('fortune-widget-wrap');
    if (fortune) fortune.style.display = 'block';
    if (pushHistory) setAppRoute('#home', true);
}

function openDeutschView() {
    window.location.href = getDeutschDestination('#tests');
}

function openVerbTrainerView() {
    window.location.href = getDeutschDestination('#verbs');
}

function openFlashcardsView() {
    window.location.href = getDeutschDestination('#flashcards');
}

function openGamesView() {
    window.location.href = getDeutschDestination('#games');
}

function openTournamentView() {
    window.location.href = getDeutschDestination('#tournament');
}


// 9. SPA Routing Navigation
// 9. SPA Routing Navigation
if (mainNav) {
    mainNav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        if (href.startsWith('http://') || href.startsWith('https://') || link.getAttribute('target') === '_blank') {
            return;
        }
        e.preventDefault();

        if (link.id === 'nav-contact-link' || link.getAttribute('href') === '#contact') {
            openContactModal();
            return;
        }
        if (link.id === 'nav-deutsch-link' || link.getAttribute('data-page') === 'deutsch') {
            openDeutschView();
            syncActiveNavState('deutsch');
            return;
        }
        if (link.id === 'nav-verbs-link' || link.getAttribute('data-page') === 'verbs') {
            openVerbTrainerView();
            syncActiveNavState('verbs');
            return;
        }
        if (link.id === 'nav-flashcards-link' || link.getAttribute('data-page') === 'flashcards') {
            openFlashcardsView();
            syncActiveNavState('flashcards');
            return;
        }
        if (link.id === 'nav-tournament-link' || link.getAttribute('data-page') === 'tournament') {
            openTournamentView();
            syncActiveNavState('tournament');
            return;
        }

        const page = link.getAttribute('data-page') || 'home';
        showMainView();
        syncActiveNavState(page);

        currentTab = page;
        if (currentTab === 'projects') {
            filterType = 'project';
        } else {
            filterType = 'all';
        }

        if (filterTags) {
            filterTags.querySelectorAll('.filter-tag').forEach(tag => {
                if (tag.getAttribute('data-filter') === filterType) tag.classList.add('active');
                else tag.classList.remove('active');
            });
        }

        if (typeof updateHeroContent === 'function') updateHeroContent();
        if (typeof renderPosts === 'function') renderPosts();

        if (page === 'blog') {
            const targetEl = document.getElementById('main-content') || document.getElementById('blog-grid');
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (page === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Mobil Drawer Navigatsiya Linklari
const drawerNavLinks = document.getElementById('drawer-nav-links');
if (drawerNavLinks) {
    drawerNavLinks.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
        const href = link.getAttribute('href') || '';
        if (href.startsWith('http://') || href.startsWith('https://') || link.getAttribute('target') === '_blank') {
            return;
        }
        e.preventDefault();
        if (link.id === 'drawer-contact-link' || href === '#contact') {
            openContactModal();
            return;
        }
        const page = link.getAttribute('data-page') || 'home';
        showMainView();
        syncActiveNavState(page);
        currentTab = page;
        filterType = 'all';
        if (filterTags) {
            filterTags.querySelectorAll('.filter-tag').forEach(tag => {
                if (tag.getAttribute('data-filter') === 'all') tag.classList.add('active');
                else tag.classList.remove('active');
            });
        }
        if (typeof renderPosts === 'function') renderPosts();

        if (page === 'blog') {
            const targetEl = document.getElementById('main-content') || document.getElementById('blog-grid');
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Portfolio sahifasidagi "Bosh sahifaga qaytish" tugmasi
const closePortfolioBtn = document.getElementById('close-portfolio-btn');
if (closePortfolioBtn) {
    closePortfolioBtn.addEventListener('click', () => {
        const pv = document.getElementById('portfolio-view');
        if (pv) pv.style.display = 'none';
        showMainView();
        syncActiveNavState('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Kontakt modali
const contactModal = document.getElementById('contact-modal');
function openContactModal() {
    contactModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeContactModal() {
    contactModal?.classList.remove('active');
    document.body.style.overflow = '';
}
document.getElementById('close-contact-modal')?.addEventListener('click', closeContactModal);
contactModal?.addEventListener('click', (e) => {
    if (e.target === contactModal) closeContactModal();
});

if (navLogo) {
    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        showMainView();
        syncActiveNavState('home');
    });
}

// ===== DESKTOP DOCK NAVIGATION =====
const desktopDock = document.getElementById('desktop-dock');
if (desktopDock) {
    desktopDock.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        if (href.startsWith('http://') || href.startsWith('https://') || link.getAttribute('target') === '_blank') {
            return;
        }
        e.preventDefault();

        // Maxsus tugmalar
        if (link.id === 'dock-contact' || href === '#contact') {
            openContactModal();
            return;
        }
        if (link.id === 'dock-theme') {
            const themeBtn = document.getElementById('theme-btn');
            if (themeBtn) themeBtn.click();
            return;
        }
        if (link.id === 'dock-deutsch' || link.getAttribute('data-page') === 'deutsch') {
            let dest = 'https://deutsch.abdugofforov.uz/';
            if (!window.location.hostname.includes('abdugofforov.uz')) dest = 'deutsch.html';
            window.location.href = dest;
            return;
        }

        let page = link.getAttribute('data-page') || 'home';
        showMainView();
        syncActiveNavState(page);
        
        currentTab = page;
        if (page === 'blog') {
            filterType = 'all';
        } else if (page === 'projects') {
            filterType = 'project';
        } else {
            filterType = 'all';
        }

        if (filterTags) {
            filterTags.querySelectorAll('.filter-tag').forEach(tag => {
                const f = tag.getAttribute('data-filter');
                if (f === filterType || (filterType === 'all' && f === 'all')) {
                    tag.classList.add('active');
                } else {
                    tag.classList.remove('active');
                }
            });
        }

        if (typeof updateHeroContent === 'function') updateHeroContent();
        if (typeof renderPosts === 'function') renderPosts();
    });
}

function syncActiveNavState(page) {
    // Drawer nav-links
    if (typeof drawerNavLinks !== 'undefined' && drawerNavLinks) {
        drawerNavLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        const drawerLink = drawerNavLinks.querySelector('[data-page="' + page + '"]');
        if (drawerLink) drawerLink.classList.add('active');
    }
    // Top nav-links
    if (mainNav) {
        mainNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        const topLink = mainNav.querySelector(`[data-page="${page}"]`);
        if (topLink) topLink.classList.add('active');
    }
    // Bottom dock
    if (desktopDock) {
        desktopDock.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        const dockLink = desktopDock.querySelector(`[data-page="${page}"]`);
        if (dockLink) {
            dockLink.classList.add('active');
        } else if (page === 'home' || page === 'all') {
            const homeLink = desktopDock.querySelector('#dock-home');
            if (homeLink) homeLink.classList.add('active');
        } else if (page === 'blog') {
            const bLink = desktopDock.querySelector('#dock-blog');
            if (bLink) bLink.classList.add('active');
        } else if (page === 'music') {
            const mLink = desktopDock.querySelector('#dock-music');
            if (mLink) mLink.classList.add('active');
        }
    }
}


// ===== SKELETON LOADER =====
function showSkeletons(count = 3) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    grid.innerHTML = Array(count).fill(`
        <div class="skeleton-card">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-meta"></div>
            </div>
        </div>
    `).join('');
}

const toolbarEl = document.querySelector('.toolbar');
if (toolbarEl) toolbarEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-tag');
    if (!btn) return;

    if (btn.id === 'main-deutsch-btn') {
        openDeutschView();
        return;
    }
    if (btn.id === 'main-verbs-btn') {
        openVerbTrainerView();
        return;
    }

    // Odatiy filtr tugmalari
    document.querySelectorAll('.toolbar .filter-tag').forEach(tag => tag.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    filterType = filter || 'all';

    renderPosts();
});

// ===== JONLI QIDIRUV (live search) =====
// Foydalanuvchi yozishni boshlashi bilan, barcha postlar (kundalik) ichidan
// sarlavha/qisqacha/kategoriya/matn bo'yicha darhol qidiradi.
// Eslatma: qidiruv FAQAT public postlar ichidan boradi Ã¢â‚¬â€ admin paneli (kay.html)
// alohida sahifa, uning kontenti va so'zlari bu yerga umuman kirmaydi.
let _searchTimer = null;

function showBlogResultsView() {
    if (typeof hideAuxViews === 'function') hideAuxViews();
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = '';
    if (mainContent) mainContent.style.display = '';
}

if (searchInput) searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    if (_searchTimer) clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => {
        if (searchQuery) {
            // Qidiruv rejimi: barcha postlar ichidan jonli qidiramiz
            currentTab = 'home';
            filterType = 'all'; 
            showBlogResultsView();
            renderPosts(true); // darhol (skeletonsiz)
        } else {
            // Qidiruv tozalandi — kategoriya tanlanmagan bo'lsa, dastlabki holatga qaytamiz
            const activeBtn = filterTags.querySelector('.filter-tag.active');
            if (!activeBtn) filterType = 'all';
            renderPosts(true);
        }
    }, 120);
});

// Like bosish
function handleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.liked) {
        post.likes--;
        post.liked = false;
    } else {
        post.likes++;
        post.liked = true;
    }

    savePosts();
    renderPosts();

    const modalLikeBtn = document.getElementById(`modal-like-${postId}`);
    if (modalLikeBtn) {
        modalLikeBtn.querySelector('span').textContent = post.likes;
        const svg = modalLikeBtn.querySelector('svg');
        if (post.liked) {
            svg.setAttribute('fill', 'var(--accent-color)');
            svg.style.color = 'var(--accent-color)';
        } else {
            svg.setAttribute('fill', 'none');
            svg.style.color = 'inherit';
        }
    }
}

// 10. Post Detail Modali
function openPostDetail(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    isAdmin = checkIsAdmin();

    detailModalBody.innerHTML = `
        <div class="modal-actions-bar">
            <button class="btn-secondary btn-sm share-post-btn">🔗 Ulashish</button>
            ${isAdmin ? `<button class="btn-secondary btn-sm edit-post-btn">✏️ Tahrirlash</button>
            <button class="btn-secondary btn-sm delete-post-btn" style="color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2);">🗑️ O'chirish</button>` : ''}
        </div>
        
        <div class="modal-post-header">
            <span class="post-meta">${getCategoryIcon(post.category, post.type)} ${escapeHTML(post.category)}</span>
            <h1 class="modal-post-title">${escapeHTML(post.title)}</h1>
            <div class="modal-post-meta">
                <span>📅 ${formatDate(post.date)}</span>
                <span>⏳ ${readingTime(post)}</span>
                <span class="post-stat" id="modal-like-${post.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${post.liked ? 'var(--accent-color)' : 'inherit'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span>${post.likes}</span>
                </span>
            </div>
        </div>
        
        ${post.type === 'music' 
            ? `<div style="margin-bottom: 30px;">
                   <img src="${post.image}" class="zoomable" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; cursor: zoom-in;">
                   ${post.musicData ? `<audio controls style="width:100%; margin-bottom:12px;" src="${post.musicData}"></audio>` : ''}
                   <div class="music-actions" style="justify-content:flex-start;">
                       ${post.artist ? `<span class="music-artist">🎤 ${escapeHTML(post.artist)}</span>` : ''}
                       <div class="music-btn-row">
                           ${(post.musicData || post.link) ? `<button class="btn-primary btn-sm" id="detail-play-${post.id}">${i18n.t('music.listen')}</button>` : ''}
                           ${post.link ? `<a class="btn-secondary btn-sm" href="${safeUrl(post.link)}" target="_blank" rel="noopener noreferrer">${i18n.t('music.open')}</a>` : ''}
                       </div>
                   </div>
               </div>`
            : post.type === 'video'
                ? `<div style="margin-bottom: 30px;">
                       ${post.videoData 
                           ? `<video controls style="width:100%; max-height:500px; border-radius:12px;" src="${post.videoData}"></video>`
                           : `<div class="modal-post-image" style="background-image: url('${cssUrl(post.image, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000')}');"></div>`
                       }
                   </div>`
            : post.type === 'image' 
                ? `<div style="margin-bottom: 30px;"><img src="${escapeHTML(safeImageUrl(post.image))}" class="zoomable" style="width: 100%; border-radius: 12px; cursor: zoom-in;"></div>`
                : `<div class="modal-post-image zoomable-bg" data-zoom-src="${escapeHTML(safeImageUrl(post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000'))}" style="background-image: url('${cssUrl(post.image, 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000')}'); cursor: zoom-in;"></div>`
        }

        <div class="modal-post-text markdown-body" style="line-height:1.6;">${post.type === 'music' ? renderMarkdown(post.content || post.excerpt) : renderMarkdown(post.content)}</div>
        ${renderTags(post)}
        
        <div class="comments-section">
            <h3 class="comments-title">Izohlar (${post.comments.length})</h3>
            <div class="comments-list" id="modal-comments-list">
                ${renderComments(post.comments)}
            </div>
            ${(window.Auth && Auth.isLoggedIn()) ? `
            <form class="comment-form" id="modal-comment-form">
                <input type="hidden" id="comment-author-input" value="${escapeHTML(Auth.user.name || Auth.user.username)}">
                <div class="form-group">
                    <label for="comment-text-input">Izoh — <span style="color:var(--color-purple-light);">${escapeHTML(Auth.user.name || Auth.user.username)}</span> nomidan</label>
                    <textarea id="comment-text-input" class="form-textarea" placeholder="Fikringizni yozib qoldiring..." required></textarea>
                </div>
                <button type="submit" class="btn-primary" style="align-self: flex-end;">Izoh qoldirish</button>
            </form>` : `
            <div style="text-align:center; padding:20px; border:1px dashed var(--glass-border); border-radius:12px; margin-top:16px;">
                <p style="color:var(--text-secondary); margin-bottom:12px; font-size:14px;">Izoh qoldirish uchun tizimga kiring</p>
                <button class="btn-primary" type="button" data-action="open-auth" data-mode="login" style="margin:0 auto;">Kirish / Ro'yxatdan o'tish</button>
            </div>`}
        </div>
    `;

    const editBtn = detailModalBody.querySelector('.edit-post-btn');
    const deleteBtn = detailModalBody.querySelector('.delete-post-btn');

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            closePostDetailModal();
            openZenEditor(post.id);
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm("Ushbu maqolani o'chirmoqchimisiz?")) {
                posts = posts.filter(p => p.id !== post.id);
                savePosts();
                renderPosts();
                closePostDetailModal();
            }
        });
    }

    const modalLikeBtn = document.getElementById(`modal-like-${post.id}`);
    modalLikeBtn.addEventListener('click', () => {
        handleLike(post.id);
    });

    const detailPlayBtn = document.getElementById(`detail-play-${post.id}`);
    if (detailPlayBtn) detailPlayBtn.addEventListener('click', () => playMusic(post));

    const shareBtn = detailModalBody.querySelector('.share-post-btn');
    if (shareBtn) shareBtn.addEventListener('click', () => sharePost(post));

    const commentForm = document.getElementById('modal-comment-form');
    if (commentForm) commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const authorInput = document.getElementById('comment-author-input');
        const textInput = document.getElementById('comment-text-input');

        const newComment = {
            id: Date.now(),
            author: authorInput.value.trim(),
            text: textInput.value.trim(),
            date: new Date().toISOString().split('T')[0]
        };

        post.comments.push(newComment);
        savePosts();
        
        document.getElementById('modal-comments-list').innerHTML = renderComments(post.comments);
        document.querySelector('.comments-title').textContent = `Izohlar (${post.comments.length})`;
        
        if (textInput) textInput.value = '';
        renderPosts();
    });

    postDetailModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Deep-link (ulashiladigan havola) va dinamik meta
    currentDetailPostId = post.id;
    try {
        } catch (e) { /* file:// muhitida o'tkazib yuboriladi */ }
    setMeta(`${post.title} | Abdugofforov`, post.excerpt || DEFAULT_DESC);
}

function renderComments(commentsList) {
    if (commentsList.length === 0) {
        return `<p style="color: var(--text-muted); font-size: 14px;">Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!</p>`;
    }
    return commentsList.map(comment => `
        <div class="comment-item">
            <div class="comment-meta">
                <span class="comment-author">${escapeHTML(comment.author)}</span>
                <span class="comment-date">${formatDate(comment.date)}</span>
            </div>
            <p class="comment-text">${escapeHTML(comment.text)}</p>
            ${comment.reply ? `
                <div class="comment-reply">
                    <div class="comment-meta">
                        <span class="comment-author">↳ ${escapeHTML(comment.reply.author)}</span>
                        <span class="comment-date">${formatDate(comment.reply.date)}</span>
                    </div>
                    <p class="comment-text">${escapeHTML(comment.reply.text)}</p>
                </div>` : ''}
            ${checkIsAdmin() && !comment.reply ? `<button class="btn-secondary btn-sm comment-reply-btn" data-action="reply-comment" data-id="${comment.id}" style="margin-top:8px;">↳ Javob berish</button>` : ''}
        </div>
    `).join('');
}

function closePostDetailModal() {
    postDetailModal.classList.remove('active');
    document.body.style.overflow = '';
    // Deep-link va meta'ni tiklash
    if (currentDetailPostId != null) {
        currentDetailPostId = null;
        try {
            if (new URLSearchParams(location.search).has('post')) {
                }
        } catch (e) { /* o'tkazib yuboriladi */ }
        setMeta(DEFAULT_TITLE, DEFAULT_DESC);
    }
}

if (closeDetailModal) closeDetailModal.addEventListener('click', closePostDetailModal);
if (postDetailModal) postDetailModal.addEventListener('click', (e) => {
    if (e.target === postDetailModal) closePostDetailModal();
});


// ============================================================
// 11. ZEN CREATIVE WRITING STUDIO (NOTION / MEDIUM USLUBI)
// ============================================================
const zenEditor = document.getElementById('zen-editor');
const zenCloseBtn = document.getElementById('zen-close-btn');
const zenSaveStatus = document.getElementById('zen-save-status');
const zenStatusText = document.getElementById('zen-status-text');
const zenStatsPill = document.getElementById('zen-stats-pill');
const zenPublishBtn = document.getElementById('zen-publish-btn');
const zenPublishLabel = document.getElementById('zen-publish-label');

const zenTabWrite = document.getElementById('zen-tab-write');
const zenTabPreview = document.getElementById('zen-tab-preview');
const zenEditPane = document.getElementById('zen-edit-pane');
const zenPreviewPane = document.getElementById('zen-preview-pane');
const zenPreviewContent = document.getElementById('zen-preview-content');

const zenCoverZone = document.getElementById('zen-cover-zone');
const zenCoverEmpty = document.getElementById('zen-cover-empty');
const zenCoverPreview = document.getElementById('zen-cover-preview');
const zenCoverImg = document.getElementById('zen-cover-img');
const zenTriggerCoverBtn = document.getElementById('zen-trigger-cover-btn');
const zenChangeCoverBtn = document.getElementById('zen-change-cover-btn');
const zenRemoveCoverBtn = document.getElementById('zen-remove-cover-btn');
const zenCoverFile = document.getElementById('zen-cover-file');
const zenUrlPopover = document.getElementById('zen-url-popover');
const zenCoverUrlInput = document.getElementById('zen-cover-url-input');
const zenApplyUrlBtn = document.getElementById('zen-apply-url-btn');
const zenCancelUrlBtn = document.getElementById('zen-cancel-url-btn');

const zenTitle = document.getElementById('zen-title');
const zenExcerpt = document.getElementById('zen-excerpt');
const zenTags = document.getElementById('zen-tags');
const zenToolbar = document.getElementById('zen-toolbar');
const zenContent = document.getElementById('zen-content');

let pendingImageData = null;
let zenDraftTimer = null;

function compressImage(file, maxSize = 1920, quality = 0.9) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > height && width > maxSize) {
                    height = Math.round(height * maxSize / width);
                    width = maxSize;
                } else if (height >= width && height > maxSize) {
                    width = Math.round(width * maxSize / height);
                    height = maxSize;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function autoResize(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

function updateZenStats() {
    if (!zenStatsPill) return;
    const text = ((zenTitle ? zenTitle.value : '') + ' ' + (zenContent ? zenContent.value : '')).trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const minutes = Math.max(1, Math.round(words / 180));
    zenStatsPill.textContent = `${words} ta so'z · ${minutes} daqiqa`;
}

function scheduleZenDraftSave() {
    if (editingPostId) return;
    if (zenSaveStatus) {
        zenSaveStatus.classList.add('saving');
        if (zenStatusText) zenStatusText.textContent = "Saqlanmoqda...";
    }
    clearTimeout(zenDraftTimer);
    zenDraftTimer = setTimeout(() => {
        try {
            const draft = {
                title: zenTitle ? zenTitle.value : '',
                excerpt: zenExcerpt ? zenExcerpt.value : '',
                content: zenContent ? zenContent.value : '',
                tags: zenTags ? zenTags.value : '',
                image: pendingImageData,
                updatedAt: Date.now()
            };
            localStorage.setItem('zen_studio_draft', JSON.stringify(draft));
            if (zenSaveStatus) {
                zenSaveStatus.classList.remove('saving');
                if (zenStatusText) zenStatusText.textContent = "Qoralama saqlandi";
            }
        } catch (e) {}
    }, 600);
}

function setZenCover(dataUrl) {
    pendingImageData = dataUrl;
    if (dataUrl) {
        if (zenCoverImg) zenCoverImg.src = dataUrl;
        if (zenCoverPreview) zenCoverPreview.style.display = 'block';
        if (zenCoverEmpty) zenCoverEmpty.style.display = 'none';
    } else {
        if (zenCoverPreview) zenCoverPreview.style.display = 'none';
        if (zenCoverEmpty) zenCoverEmpty.style.display = 'block';
        if (zenCoverImg) zenCoverImg.src = '';
    }
}

function switchZenTab(mode) {
    if (mode === 'preview') {
        if (zenTabPreview) zenTabPreview.classList.add('active');
        if (zenTabWrite) zenTabWrite.classList.remove('active');
        if (zenEditPane) zenEditPane.style.display = 'none';
        if (zenPreviewPane) zenPreviewPane.style.display = 'block';

        if (zenPreviewContent) {
            const rawTitle = zenTitle ? zenTitle.value.trim() : '';
            const rawContent = zenContent ? zenContent.value.trim() : '';
            const rawExcerpt = zenExcerpt ? zenExcerpt.value.trim() : '';
            
            let html = '';
            if (pendingImageData) {
                html += `<img src="${cssUrl(pendingImageData)}" style="width:100%;max-height:320px;object-fit:cover;border-radius:14px;margin-bottom:24px;">`;
            }
            html += `<h1 style="font-size:28px;font-weight:700;margin:0 0 12px 0;line-height:1.3;color:var(--text-primary);">${escapeHTML(rawTitle || 'Sarlavhasiz')}</h1>`;
            if (rawExcerpt) {
                html += `<blockquote style="font-size:16px;color:var(--text-secondary);font-style:italic;margin-bottom:20px;">${escapeHTML(rawExcerpt)}</blockquote>`;
            }
            html += renderMarkdown(rawContent || '*Hali hech qanday matn yozilmadi...*');
            zenPreviewContent.innerHTML = html;
        }
    } else {
        if (zenTabWrite) zenTabWrite.classList.add('active');
        if (zenTabPreview) zenTabPreview.classList.remove('active');
        if (zenPreviewPane) zenPreviewPane.style.display = 'none';
        if (zenEditPane) zenEditPane.style.display = 'block';
    }
}

function openZenEditor(postId = null) {
    if (!zenEditor) return;
    if (!checkIsAdmin()) {
        if (typeof showToast === 'function') showToast("⚠️ Maqola yozish faqat admin uchun ruxsat etilgan!", "warn");
        return;
    }
    editingPostId = postId;

    switchZenTab('write');

    if (postId) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            if (zenPublishLabel) zenPublishLabel.textContent = "Saqlash";
            if (zenTitle) zenTitle.value = post.title || '';
            if (zenExcerpt) zenExcerpt.value = post.excerpt || '';
            if (zenContent) zenContent.value = post.content || '';
            if (zenTags) zenTags.value = (post.tags || []).join(', ');
            setZenCover(post.image || null);
        }
    } else {
        if (zenPublishLabel) zenPublishLabel.textContent = "Chop etish";
        
        let draft = null;
        try { draft = JSON.parse(localStorage.getItem('zen_studio_draft')); } catch (e) {}
        
        if (draft && (draft.title || draft.content)) {
            if (zenTitle) zenTitle.value = draft.title || '';
            if (zenExcerpt) zenExcerpt.value = draft.excerpt || '';
            if (zenContent) zenContent.value = draft.content || '';
            if (zenTags) zenTags.value = draft.tags || '';
            setZenCover(draft.image || null);
        } else {
            if (zenTitle) zenTitle.value = '';
            if (zenExcerpt) zenExcerpt.value = '';
            if (zenContent) zenContent.value = '';
            if (zenTags) zenTags.value = '';
            setZenCover(null);
        }
    }

    zenEditor.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        autoResize(zenTitle);
        updateZenStats();
        if (zenTitle) zenTitle.focus();
    }, 80);
}

function closeZenEditor() {
    if (!zenEditor) return;
    zenEditor.style.display = 'none';
    document.body.style.overflow = '';
    editingPostId = null;
}

function insertFormatting(cmd) {
    if (!zenContent) return;
    const start = zenContent.selectionStart;
    const end = zenContent.selectionEnd;
    const text = zenContent.value;
    const selected = text.substring(start, end);

    let before = text.substring(0, start);
    let after = text.substring(end);
    let replacement = '';
    let newCursorPos = start;

    switch (cmd) {
        case 'bold':
            replacement = selected ? `**${selected}**` : `**qalin matn**`;
            newCursorPos = start + (selected ? replacement.length : 2);
            break;
        case 'italic':
            replacement = selected ? `*${selected}*` : `*kursiv matn*`;
            newCursorPos = start + (selected ? replacement.length : 1);
            break;
        case 'h2':
            replacement = selected ? `\n## ${selected}\n` : `\n## Sarlavha 2\n`;
            newCursorPos = start + replacement.length;
            break;
        case 'h3':
            replacement = selected ? `\n### ${selected}\n` : `\n### Sarlavha 3\n`;
            newCursorPos = start + replacement.length;
            break;
        case 'quote':
            replacement = selected ? `\n> ${selected}\n` : `\n> Iqtibos matni...\n`;
            newCursorPos = start + replacement.length;
            break;
        case 'ul':
            replacement = selected ? `\n- ${selected}\n` : `\n- Element 1\n- Element 2\n`;
            newCursorPos = start + replacement.length;
            break;
        case 'ol':
            replacement = selected ? `\n1. ${selected}\n` : `\n1. Birinchi qadam\n2. Ikkinchi qadam\n`;
            newCursorPos = start + replacement.length;
            break;
        case 'code':
            replacement = selected ? `\n\`\`\`javascript\n${selected}\n\`\`\`\n` : `\n\`\`\`javascript\n// kod yozing\n\`\`\`\n`;
            newCursorPos = start + replacement.length;
            break;
        case 'link':
            const url = prompt("Havola (URL) manzilini kiriting:", "https://");
            if (url) {
                replacement = `[${selected || 'Havola matni'}](${url})`;
                newCursorPos = start + replacement.length;
            } else {
                return;
            }
            break;
        case 'img':
            const imgUrl = prompt("Rasm havolasini (URL) kiriting:", "https://");
            if (imgUrl) {
                replacement = `\n![${selected || 'Rasm tavsifi'}](${imgUrl})\n`;
                newCursorPos = start + replacement.length;
            } else {
                return;
            }
            break;
        case 'hr':
            replacement = `\n\n---\n\n`;
            newCursorPos = start + replacement.length;
            break;
        default:
            return;
    }

    zenContent.value = before + replacement + after;
    zenContent.focus();
    zenContent.setSelectionRange(newCursorPos, newCursorPos);
    updateZenStats();
    scheduleZenDraftSave();
}

// Zen Event Listeners
if (zenCloseBtn) zenCloseBtn.addEventListener('click', closeZenEditor);
if (zenTabWrite) zenTabWrite.addEventListener('click', () => switchZenTab('write'));
if (zenTabPreview) zenTabPreview.addEventListener('click', () => switchZenTab('preview'));

if (zenTitle) {
    zenTitle.addEventListener('input', () => {
        autoResize(zenTitle);
        updateZenStats();
        scheduleZenDraftSave();
    });
}
if (zenExcerpt) {
    zenExcerpt.addEventListener('input', scheduleZenDraftSave);
}
if (zenTags) {
    zenTags.addEventListener('input', scheduleZenDraftSave);
}
if (zenContent) {
    zenContent.addEventListener('input', () => {
        updateZenStats();
        scheduleZenDraftSave();
    });
}

// Cover image handlers
if (zenTriggerCoverBtn) zenTriggerCoverBtn.addEventListener('click', () => zenCoverFile?.click());
if (zenChangeCoverBtn) zenChangeCoverBtn.addEventListener('click', () => zenCoverFile?.click());
if (zenRemoveCoverBtn) zenRemoveCoverBtn.addEventListener('click', () => {
    setZenCover(null);
    scheduleZenDraftSave();
});

if (zenCoverFile) {
    zenCoverFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const dataUrl = await compressImage(file);
            setZenCover(dataUrl);
            scheduleZenDraftSave();
        } catch (err) {
            alert("Rasmni yuklashda xatolik.");
        }
    });
}

// URL Popover
if (zenApplyUrlBtn) {
    zenApplyUrlBtn.addEventListener('click', () => {
        const url = zenCoverUrlInput?.value.trim();
        if (url) {
            setZenCover(url);
            if (zenUrlPopover) zenUrlPopover.style.display = 'none';
            scheduleZenDraftSave();
        }
    });
}
if (zenCancelUrlBtn) {
    zenCancelUrlBtn.addEventListener('click', () => {
        if (zenUrlPopover) zenUrlPopover.style.display = 'none';
    });
}

if (zenToolbar) {
    zenToolbar.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-cmd]');
        if (btn) {
            insertFormatting(btn.getAttribute('data-cmd'));
        }
    });
}

// Chop etish / Saqlash
if (zenPublishBtn) {
    zenPublishBtn.addEventListener('click', () => {
        if (!checkIsAdmin()) {
            if (typeof showToast === 'function') showToast("⚠️ Chop etish faqat admin uchun!", "error");
            return;
        }
        const title = zenTitle ? zenTitle.value.trim() : '';
        if (!title) {
            if (typeof showToast === 'function') showToast("⚠️ Iltimos, sarlavha kiriting!", "warn");
            else alert("Iltimos, sarlavha kiriting!");
            if (zenTitle) zenTitle.focus();
            return;
        }

        const content = zenContent ? zenContent.value.trim() : '';
        let excerpt = zenExcerpt ? zenExcerpt.value.trim() : '';
        if (!excerpt && content) {
            excerpt = content.split('\n')[0].substring(0, 110);
        }

        const tagsRaw = zenTags ? zenTags.value : '';
        const tags = tagsRaw.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean).slice(0, 8);
        const category = (tags && tags.length > 0) ? tags[0] : 'Maqola';
        const image = pendingImageData || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600';

        if (editingPostId) {
            const postIndex = posts.findIndex(p => p.id === editingPostId);
            if (postIndex !== -1) {
                posts[postIndex] = {
                    ...posts[postIndex],
                    title,
                    category,
                    type: 'article',
                    image,
                    excerpt,
                    content,
                    tags
                };
            }
            editingPostId = null;
            if (typeof showToast === 'function') showToast("✅ O'zgarishlar saqlandi!", "success");
        } else {
            const newPost = {
                id: Date.now(),
                title,
                category,
                type: 'article',
                excerpt,
                content,
                image,
                tags,
                date: new Date().toISOString().split('T')[0],
                likes: 0,
                liked: false,
                comments: []
            };
            posts.unshift(newPost);
            try { localStorage.removeItem('zen_studio_draft'); } catch (e) {}
            if (typeof showToast === 'function') showToast("🎉 Maqola muvaffaqiyatli chop etildi!", "success");
        }

        try {
            savePosts();
        } catch (err) {
            alert("Saqlashda xatolik: xotira to'lgan bo'lishi mumkin.");
            return;
        }

        renderPosts();
        closeZenEditor();
    });
}

// Tugmalarni Zen Editor ga ulash
if (addPostBtn) {
    addPostBtn.addEventListener('click', () => {
        if (!checkIsAdmin()) {
            if (typeof showToast === 'function') showToast("⚠️ Maqola yozish faqat admin uchun!", "warn");
            return;
        }
        openZenEditor();
    });
}

// Yordamchi Funksiyalar
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function loadMarkedIfNeeded(cb) {
    if (window.marked) {
        if (cb) cb();
        return;
    }
    if (document.getElementById('marked-script')) {
        if (cb) {
            const existing = document.getElementById('marked-script');
            existing.addEventListener('load', cb);
        }
        return;
    }
    const s = document.createElement('script');
    s.id = 'marked-script';
    s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    s.async = true;
    if (cb) s.onload = cb;
    document.head.appendChild(s);
}

function renderMarkdown(str) {
    if (!str) return '';
    if (window.marked && typeof window.marked.parse === 'function') {
        return window.marked.parse(str);
    }
    loadMarkedIfNeeded();
    let text = escapeHTML(str);
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    text = text.replace(/\n\n+/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    return '<p>' + text + '</p>';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return dateStr;
    } catch (e) {
        return dateStr;
    }
}

// ===== XAVFSIZ URL TEKSHIRUVI =====
function safeUrl(url) {
    if (!url) return '#';
    return /^https?:\/\//i.test(url) ? url : '#';
}

// Rasmlar uchun — http(s) va data:image ga ruxsat (yuklangan rasmlar data: bo'ladi)
function safeImageUrl(url) {
    if (!url) return '#';
    return (/^https?:\/\//i.test(url) || /^data:image\//i.test(url)) ? url : '#';
}

// CSS `url(...)` va HTML atribut kontekstida xavfsiz rasm manzili.
// safeImageUrl bilan tekshiradi, so'ng kontekstdan "chiqib ketadigan" belgilarni
// (' " ( ) < > \) percent-encode qiladi — XSS/CSS-injection oldini oladi.
function cssUrl(url, fallback) {
    let u = safeImageUrl(url);
    if (!u || u === '#') u = fallback || '';
    return String(u).replace(/['"()<>\\]/g, c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'));
}

// ===== RASM LIGHTBOX (bosilganda kattalashtirish) =====
function openLightbox(src) {
    if (!src || src === '#') return;
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img) return;
    img.src = src;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('active');
    const img = document.getElementById('lightbox-img');
    if (img) img.src = '';
    document.body.style.overflow = '';
}

function initLightbox() {
    const lb = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    // Delegatsiya: <img class="zoomable"> va modal ichidagi .zoomable-bg
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img.zoomable');
        if (img) { openLightbox(img.getAttribute('src')); return; }
        const bg = e.target.closest('.zoomable-bg');
        if (bg && bg.closest('.modal-body')) {
            openLightbox(bg.getAttribute('data-zoom-src'));
        }
    });
}

// ===== DOIMIY MUSIQA PLEYERI (faqat kompyuter/noutbook) =====
function isDesktopPlayer() {
    return window.matchMedia('(min-width: 769px) and (hover: hover)').matches;
}

function getYouTubeId(url) {
    if (!url) return null;
    const patterns = [
        /youtube\.com\/watch\?v=([\w-]{11})/,
        /youtu\.be\/([\w-]{11})/,
        /youtube\.com\/embed\/([\w-]{11})/,
        /youtube\.com\/shorts\/([\w-]{11})/,
        /music\.youtube\.com\/watch\?v=([\w-]{11})/
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

function playMusic(post) {
    // Lokal audio fayl (data URL)
    if (post && post.musicData) {
        const player = document.getElementById('mini-player');
        const frame = document.getElementById('mini-player-frame');
        if (!player || !frame) return;
        document.getElementById('mini-player-title').textContent = post.title || 'Musiqa';
        document.getElementById('mini-player-artist').textContent = post.artist || '';
        frame.innerHTML = `<audio controls autoplay style="width:100%; height:100%;" src="${post.musicData}"></audio>`;
        player.classList.add('active');
        return;
    }

    const link = post && post.link;
    if (!link) return;
    const ytId = getYouTubeId(link);

    // Telefon/planshet yoki YouTube bo'lmagan havola — yangi oynada ochiladi
    if (!isDesktopPlayer() || !ytId) {
        window.open(safeUrl(link), '_blank', 'noopener');
        return;
    }

    const player = document.getElementById('mini-player');
    const frame = document.getElementById('mini-player-frame');
    if (!player || !frame) return;
    document.getElementById('mini-player-title').textContent = post.title || 'Musiqa';
    document.getElementById('mini-player-artist').textContent = post.artist || '';
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0" title="YouTube player" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%; height:100%;"></iframe>`;
    player.classList.add('active');
}

function stopMusic() {
    const player = document.getElementById('mini-player');
    const frame = document.getElementById('mini-player-frame');
    if (frame) frame.innerHTML = '';
    if (player) player.classList.remove('active');
}

function initMiniPlayer() {
    const closeBtn = document.getElementById('mini-player-close');
    if (closeBtn) closeBtn.addEventListener('click', stopMusic);
}

// ===== KARTOCHKALAR (FLASHCARDS) MA'LUMOTLARI =====
// ===== FLASHCARDS MOVED TO data-flashcards.js =====

// ===== TIL (i18n) BOSHQARUVI =====
function initLanguage() {
    // Bayroqli custom dropdown (mobil va veb bir xil komponent)
    const dropEl = document.getElementById('lang-select');
    if (dropEl && i18n.buildLangDropdown) {
        i18n.buildLangDropdown(dropEl);
    }
    i18n.applyStaticTranslations();
    document.documentElement.setAttribute('lang', i18n.getLang());

    // Til o'zgarganda dinamik qismlarni qayta chizamiz
    document.addEventListener('langchange', () => {
        updateHeroContent();
        renderPosts();
    });
}

// ===== SCROLL REVEAL (pastdan/tepadan kirish animatsiyasi) =====
let revealObserver = null;

function getRevealObserver() {
    if (revealObserver) return revealObserver;
    if (!('IntersectionObserver' in window)) return null;
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                // Element ko'rinishdan chiqqanda yo'nalishni belgilaymiz
                entry.target.classList.remove('in-view');
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('reveal-down');
                    entry.target.classList.add('reveal-up');
                } else {
                    entry.target.classList.remove('reveal-up');
                    entry.target.classList.add('reveal-down');
                }
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    return revealObserver;
}

function observeReveal(el) {
    if (!el) return;
    const obs = getRevealObserver();
    if (!obs) { el.classList.add('in-view'); return; }
    el.classList.add('reveal', 'reveal-up');
    obs.observe(el);
}

function initScrollReveal() {
    // Yangi dizaynda widget'lar hero ichida — eski selector kerak emas.
    // Faqat toolbar va footer container'iga reveal qo'llaymiz.
    document.querySelectorAll('.toolbar, .footer .container')
        .forEach(observeReveal);
}

// ===== FLOATING "+" TUGMA (faqat mobilda) =====
function initFloatingAddBtn() {
    const fab = document.getElementById('fab-add');
    if (!fab) return;
    fab.addEventListener('click', (e) => {
        e.preventDefault();
        if (!checkIsAdmin()) {
            if (typeof showToast === 'function') showToast("⚠️ Maqola yozish faqat admin uchun!", "warn");
            return;
        }
        const addBtn = document.getElementById('add-post-btn');
        if (addBtn) {
            addBtn.click();
        } else if (typeof openZenEditor === 'function') {
            openZenEditor();
        }
    });
}


// ===== PWA, DEEP-LINK (ulashiladigan post havolasi) VA ULASHISH =====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
}

const DEFAULT_TITLE = document.title;
const DEFAULT_DESC = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
let currentDetailPostId = null;

function setMeta(title, desc) {
    document.title = title;
    const m = document.querySelector('meta[name="description"]');
    if (m && desc) m.setAttribute('content', desc);
}

function openPostFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('post');
    if (id) {
        const post = posts.find(p => String(p.id) === String(id));
        if (post) openPostDetail(post.id);
    }

    // PWA shortcuts:  /?new=1  → "Yangi yozuv" modalini ochish
    if (params.get('new') === '1') {
        const addBtn = document.getElementById('add-post-btn');
        if (addBtn) {
            setTimeout(() => addBtn.click(), 300);
        }
    }

    // /?view=deutsch  → Deutsch testlar sahifasiga o'tish
    if (params.get('view') === 'deutsch') {
        setTimeout(() => {
            if (typeof openDeutschView === 'function') openDeutschView();
        }, 300);
    }
}

function sharePost(post) {
    const url = `${location.origin}/?post=${post.id}`;
    const text = `📖 ${post.title}\n\n${post.excerpt || ''}`;
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

    if (navigator.share) {
        navigator.share({ title: post.title, text: post.excerpt || '', url }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            if (typeof showToast === 'function') {
                showToast("✅ Havola ko'chirildi!", 'success');
            } else {
                alert('Havola nusxalandi:\n' + url);
            }
        }).catch(() => prompt('Havola:', url));
    } else {
        window.open(tgUrl, '_blank');
    }
}

// ===== O'QISH VAQTI VA TEGLAR =====
function escapeAttr(s) { return String(s || '').replace(/['"\\<>&]/g, ''); }

function readingTime(post) {
    const text = ((post.content || '') + ' ' + (post.excerpt || '')).trim();
    const words = text ? text.split(/\s+/).length : 0;
    return Math.max(1, Math.round(words / 180)) + ' daqiqalik o\'qish';
}

function renderTags(post) {
    if (!post.tags || !post.tags.length) return '';
    return `<div class="post-tags">${post.tags.map(t =>
        `<button class="tag-pill" data-action="filter-by-tag" data-tag="${escapeAttr(t)}">#${escapeHTML(t)}</button>`
    ).join('')}</div>`;
}

function filterByTag(tag) {
    closePostDetailModal();
    showMainView();
    currentTab = 'home';
    filterType = 'all'; // Temporarily all to search tags
    searchQuery = tag;
    const si = document.getElementById('search-input');
    if (si) si.value = tag;
    document.querySelectorAll('#filter-tags .filter-tag').forEach(t => t.classList.remove('active'));
    
    renderPosts();
}

// ===== IZOHGA ADMIN JAVOBI =====
function replyToComment(commentId) {
    if (!checkIsAdmin() || currentDetailPostId == null) return;
    const post = posts.find(p => p.id === currentDetailPostId);
    if (!post) return;
    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;
    const text = prompt('Javobingiz:');
    if (!text || !text.trim()) return;
    comment.reply = { author: 'Akromjon (admin)', text: text.trim(), date: new Date().toISOString().split('T')[0] };
    savePosts();
    const list = document.getElementById('modal-comments-list');
    if (list) list.innerHTML = renderComments(post.comments);
}

// CTA tugmasi — blog grid'iga skroll
function initHeroCta() {
    const btn = document.getElementById('hero-cta-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const grid = document.getElementById('blog-grid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// ===== 3D TILT EFFEKT (kartochkalar) =====
// Mouse hover'da kartochka 3D buriladi. Touch qurilmalarda o'chiriladi.
// Tilt observer DOM o'zgargach yangi kartochkalarga ham qo'shiladi.
function init3DTilt() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || touch) return; // touch ekranlarda 3D tilt yo'q

    const MAX = 12; // maksimal burchak (daraja)
    const PERSPECTIVE = 1000;

    function attach(card) {
        if (card._tiltAttached) return;
        card._tiltAttached = true;

        let raf = null;
        let bound = null;
        function onMove(e) {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                if (!bound) bound = card.getBoundingClientRect();
                const x = e.clientX - bound.left;
                const y = e.clientY - bound.top;
                const cx = bound.width / 2;
                const cy = bound.height / 2;
                const rx = ((y - cy) / cy) * -MAX;
                const ry = ((x - cx) / cx) *  MAX;
                card.style.transform =
                    `perspective(${PERSPECTIVE}px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
                card.classList.add('tilting');
            });
        }
        function onEnter() { bound = card.getBoundingClientRect(); }
        function onLeave() {
            card.style.transform = '';
            card.classList.remove('tilting');
            bound = null;
        }
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
    }

    function scan() {
        document.querySelectorAll('.post-card').forEach(attach);
    }

    // Birinchi skanlash
    scan();
    // Yangi kartochkalar qo'shilganda
    const grid = document.getElementById('blog-grid');
    if (grid) {
        const mo = new MutationObserver(() => scan());
        mo.observe(grid, { childList: true });
    }
}

const DUMMY_POST_IDS = new Set([
    'post_goethe_guide_1',
    'post_roadmap_2026',
    'post_articles_grammar_3',
    'post_travel_budget_4'
]);

function getHighValueDefaultPosts() {
    return [];
}

function sanitizePosts(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(p => p && p.id && String(p.id) !== '1710000' && !DUMMY_POST_IDS.has(String(p.id)) && p.title && p.category);
}

async function bootstrap() {
    // Til (i18n) — statik tarjimalar va til tanlagich
    initLanguage();

    // Mavzu darhol ishga tushiramiz (ma'lumotga bog'liq emas)
    initTheme();

    // Yangi imkoniyatlar
    initLightbox();
    initMiniPlayer();

    // Postlarni yuklash strategiyasi:
    //   1. Avval serverdan (Cloudflare KV) o'qiymiz — bu admin yuborgan
    //      eng so'nggi versiya; barcha mehmonlar shuni ko'radi.
    //   2. Server javob bermasa yoki bo'sh bo'lsa, mahalliy (IndexedDB) ga
    //      qaytamiz.
    //   3. Mahalliy ham bo'sh bo'lsa — standart postlar.
    let serverPosts = null;
    if (window.Sync) {
        serverPosts = await Sync.fetchPosts();
    }

    try {
        if (window.Store) {
            await Store.init(['abdu_posts']);
            const stored = Store.get('abdu_posts');

            if (serverPosts && serverPosts.length) {
                posts = sanitizePosts(serverPosts);
                Store.set('abdu_posts', posts);
            } else if (stored && Array.isArray(stored) && stored.length) {
                posts = sanitizePosts(stored);
                Store.set('abdu_posts', posts);
            } else {
                posts = getHighValueDefaultPosts();
                Store.set('abdu_posts', posts);
            }
        } else {
            if (serverPosts && serverPosts.length) {
                posts = sanitizePosts(serverPosts);
                try { localStorage.setItem('abdu_posts', JSON.stringify(posts)); } catch (e) {}
            } else {
                const ls = JSON.parse(localStorage.getItem('abdu_posts') || 'null');
                posts = (ls && Array.isArray(ls) && ls.length) ? sanitizePosts(ls) : getHighValueDefaultPosts();
                try { localStorage.setItem('abdu_posts', JSON.stringify(posts)); } catch (e) {}
            }
        }
    } catch (e) {
        console.error('Xotira yuklashda xato:', e);
        posts = getHighValueDefaultPosts();
    }

    // Admin holatini tiklash — sahifa yangilanganda ham admin tugmalari
    // (Yozish, Floating +) faqat admin uchun ko'rinishi uchun
    isAdmin = checkIsAdmin();
    if (true) {
        document.body.classList.toggle('admin-mode', checkIsAdmin());
    }

    renderPosts();
    initScrollReveal();
    registerServiceWorker();
    openPostFromUrl();
    if (window.location.hash) {
        applyAppRoute(window.location.hash);
    }

    initHeroCta();
    initFloatingAddBtn();

    // O'quvchi auth – token bo'lsa tiklaymiz, UI'ni yangilaymiz
    try {
        if (window.Auth) {
            await Auth.restore();
            // Agar hali tizimga kirilmagan bo'lsa va sayt Telegram ichida (WebApp/Mini App) ochilgan bo'lsa, avto 1-click kirish
            if (!Auth.isLoggedIn() && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
                await Auth.loginWithTelegram(window.Telegram.WebApp.initDataUnsafe.user);
            } else {
                Auth.updateUIState();
            }
            isAdmin = checkIsAdmin();
            document.body.classList.toggle('admin-mode', isAdmin);
        }
    } catch (authErr) {
        console.error('Auth tiklashda xatolik:', authErr);
    }
}

bootstrap().catch(e => {
    console.error("Bootstrap xatolik:", e);
});




// --- Mobile Off-Canvas Drawer & Hamburger Menu ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const hamburgerMenu = document.getElementById('hamburger-menu');
const drawerBackdrop = document.getElementById('drawer-backdrop');
const drawerCloseBtn = document.getElementById('drawer-close-btn');

function openMobileDrawer() {
    if (hamburgerMenu) hamburgerMenu.classList.add('active');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileDrawer() {
    if (hamburgerMenu) hamburgerMenu.classList.remove('active');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
}
window.openMobileDrawer = openMobileDrawer;
window.closeMobileDrawer = closeMobileDrawer;

if (hamburgerBtn && hamburgerMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hamburgerMenu.classList.contains('active')) {
            closeMobileDrawer();
        } else {
            openMobileDrawer();
        }
    });

    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeMobileDrawer);
    }
    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    }

    document.addEventListener('click', (e) => {
        if (hamburgerMenu.classList.contains('active') &&
            !hamburgerMenu.contains(e.target) &&
            !hamburgerBtn.contains(e.target)) {
            closeMobileDrawer();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (typeof hamburgerMenu !== 'undefined' && hamburgerMenu && hamburgerMenu.classList.contains('active')) {
                closeMobileDrawer();
            }
            const modal = document.getElementById('auth-modal');
            if (modal && modal.classList.contains('active')) {
                closeAuthModal();
            }
        }
    });
}

const loginBtn = document.getElementById('login-btn');
const authModal = document.getElementById('auth-modal');
const closeAuthModalBtn = document.getElementById('close-auth-modal');

window.openAuthModal = function(tab) {
    if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        modal.style.zIndex = '10000';
        document.body.style.overflow = 'hidden';
        try {
            if (typeof initTelegramWidget === 'function') {
                initTelegramWidget();
            }
        } catch (e) {
            console.warn('Telegram widget init:', e);
        }
        try {
            if (tab === 'register') {
                const tabReg = document.getElementById('auth-tab-register');
                if (tabReg) tabReg.click();
            } else {
                const tabLog = document.getElementById('auth-tab-login');
                if (tabLog) tabLog.click();
            }
        } catch (e) {
            console.warn('Auth tab switch:', e);
        }
    }
};

window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = '';
        modal.style.visibility = '';
        modal.style.opacity = '';
        modal.style.pointerEvents = '';
        document.body.style.overflow = '';
    }
};

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openAuthModal('login');
    });
}

if (closeAuthModalBtn && authModal) {
    closeAuthModalBtn.addEventListener('click', () => {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

const userChip = document.getElementById('user-chip');
const userDropdown = document.getElementById('user-dropdown');
if (userChip && userDropdown) {
    userChip.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = userDropdown.classList.contains('open') || userDropdown.classList.contains('active');
        if (isOpen) {
            userDropdown.classList.remove('open', 'active');
        } else {
            userDropdown.classList.add('open', 'active');
        }
    });
    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userChip.contains(e.target)) {
            userDropdown.classList.remove('open', 'active');
        }
    });
}

const userResultsBtn = document.getElementById('user-results-btn');
const userEditProfileBtn = document.getElementById('user-edit-profile-btn');
const userLogoutBtn = document.getElementById('user-logout-btn');
const myresultsModal = document.getElementById('myresults-modal');
const closeMyresultsModal = document.getElementById('close-myresults-modal');

if (userResultsBtn) {
    userResultsBtn.addEventListener('click', () => {
        if (userDropdown) userDropdown.classList.remove('open', 'active');
        if (typeof openMyResults === 'function') openMyResults();
    });
}

if (userEditProfileBtn) {
    userEditProfileBtn.addEventListener('click', () => {
        if (userDropdown) userDropdown.classList.remove('open', 'active');
        if (typeof openMyResults === 'function') openMyResults('edit');
    });
}

if (userLogoutBtn) {
    userLogoutBtn.addEventListener('click', async () => {
        if (userDropdown) userDropdown.classList.remove('open', 'active');
        if (window.Auth) {
            await Auth.logout();
            if (typeof showToast === 'function') showToast('🚪 Tizimdan muvaffaqiyatli chiqdingiz', 'info');
        }
    });
}

if (closeMyresultsModal && myresultsModal) {
    closeMyresultsModal.addEventListener('click', () => {
        myresultsModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    myresultsModal.addEventListener('click', (e) => {
        if (e.target === myresultsModal) {
            myresultsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== AUTH FORM MANTIQI (Kirish / Ro'yxatdan o'tish) =====
(function initAuthForm() {
    const authFormEl = document.getElementById('auth-form');
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    const nameGroup = document.getElementById('auth-name-group');
    const usernameHint = document.getElementById('auth-username-hint');
    const errorEl = document.getElementById('auth-error');
    const submitBtn = document.getElementById('auth-submit');
    const adminPinGroup = document.getElementById('auth-admin-pin-group');
    const adminPinInput = document.getElementById('auth-admin-pin');
    let loginMode = true;

    if (!authFormEl) return; // forma topilmasa chiqamiz

    // Tab almashtirish
    if (tabLogin) {
        tabLogin.addEventListener('click', () => {
            loginMode = true;
            tabLogin.classList.add('active');
            if (tabRegister) tabRegister.classList.remove('active');
            if (nameGroup) nameGroup.style.display = 'none';
            if (usernameHint) usernameHint.style.display = 'none';
            if (adminPinGroup) adminPinGroup.style.display = 'none';
            if (submitBtn) submitBtn.textContent = 'Kirish';
            if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
        });
    }
    if (tabRegister) {
        tabRegister.addEventListener('click', () => {
            loginMode = false;
            tabRegister.classList.add('active');
            if (tabLogin) tabLogin.classList.remove('active');
            if (nameGroup) nameGroup.style.display = 'block';
            if (usernameHint) usernameHint.style.display = 'block';
            if (submitBtn) submitBtn.textContent = "Ro'yxatdan o'tish";
            updateAdminPinVisibility();
            if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
        });
    }

    function updateAdminPinVisibility() {
        if (!adminPinGroup) return;
        if (loginMode) {
            adminPinGroup.style.display = 'none';
        } else {
            adminPinGroup.style.display = 'block';
        }
    }
    const usernameInputForPin = document.getElementById('auth-username');
    if (usernameInputForPin) {
        usernameInputForPin.addEventListener('input', updateAdminPinVisibility);
    }

    // Formani yuborish
    authFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }

        const nameInput = document.getElementById('auth-name');
        const usernameInput = document.getElementById('auth-username');
        const passwordInput = document.getElementById('auth-password');

        const name = nameInput ? nameInput.value.trim() : '';
        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        // Validatsiya
        if (!username || !password) {
            if (errorEl) { errorEl.textContent = "Username va parolni kiriting"; errorEl.style.display = 'block'; }
            return;
        }
        if (password.length < 4) {
            if (errorEl) { errorEl.textContent = "Parol kamida 4 belgidan iborat bo'lishi kerak"; errorEl.style.display = 'block'; }
            return;
        }
        if (!loginMode && !name) {
            if (errorEl) { errorEl.textContent = "Ismingizni kiriting"; errorEl.style.display = 'block'; }
            return;
        }

        // Tugmani bloklash
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Kutilmoqda...';
        }

        try {
            let result;
            if (loginMode) {
                result = await window.Auth.login(username, password);
            } else {
                const adminPin = (adminPinInput && adminPinGroup && adminPinGroup.style.display !== 'none') ? adminPinInput.value.trim() : '';
                const finalAdminPin = adminPin || (password === '0509' ? '0509' : '');
                result = await window.Auth.register(name, username, password, finalAdminPin);
            }

            if (result && result.ok) {
                // Muvaffaqiyat — sahifani yangilaymiz
                if (typeof showToast === 'function') {
                    showToast(loginMode ? "✅ Muvaffaqiyatli kirdingiz!" : "✅ Ro'yxatdan o'tdingiz!", 'success');
                }
                setTimeout(() => location.reload(), 600);
            } else {
                // Xatolik xabari
                const errMsg = (result && (result.message || result.error)) ? (result.message || result.error) : "Xatolik yuz berdi. Qayta urinib ko'ring.";
                if (errorEl) { errorEl.textContent = errMsg; errorEl.style.display = 'block'; }
            }
        } catch (networkErr) {
            console.error('Auth xatolik:', networkErr);
            if (errorEl) { 
                errorEl.textContent = "Server bilan aloqa yo'q. Server ishga tushganligini tekshiring."; 
                errorEl.style.display = 'block'; 
            }
        }

        // Tugmani qayta yoqish
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = loginMode ? 'Kirish' : "Ro'yxatdan o'tish";
        }
    });
})();

// Mobile & iOS Safari Audio Unlocker
(function initAudioUnlocker() {
    let unlocked = false;
    function unlockAudio() {
        if (unlocked) return;
        unlocked = true;
        if (window.speechSynthesis) {
            try { window.speechSynthesis.cancel(); } catch(e) {}
        }
        if (window.AudioContext || window.webkitAudioContext) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                if (ctx.state === 'suspended') ctx.resume();
            } catch(e) {}
        }
    }
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
})();

// ===== GLOBAL EVENT DELEGATION (CSP COMPLIANT) =====
document.addEventListener('click', (e) => {
    const loginTarget = e.target.closest('#login-btn, [data-action="open-auth"], #drawer-auth-link');
    if (loginTarget) {
        e.preventDefault();
        e.stopPropagation();
        const mode = loginTarget.dataset.mode || 'login';
        if (typeof openAuthModal === 'function') openAuthModal(mode);
        return;
    }

    const closeAuthTarget = e.target.closest('#close-auth-modal, [data-action="close-auth"]');
    if (closeAuthTarget) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof closeAuthModal === 'function') closeAuthModal();
        return;
    }

    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    switch (action) {
        case 'scroll-to-tests':
            window.scrollTo({ top: 350, behavior: 'smooth' });
            break;
        case 'open-flashcards':
            if (typeof openFlashcardsView === 'function') openFlashcardsView();
            break;
        case 'open-tournament':
            if (typeof openTournamentView === 'function') openTournamentView();
            break;
        case 'open-verb-trainer':
            if (typeof openVerbTrainerView === 'function') openVerbTrainerView();
            break;
        case 'open-horror':
            if (typeof openHorrorHome === 'function') openHorrorHome();
            break;
        case 'go-home':
            window.location.href = window.location.pathname;
            break;
        case 'set-deutsch-filter':
            if (typeof setDeutschLevelFilter === 'function') setDeutschLevelFilter(el.dataset.level);
            break;
        case 'start-part':
            if (typeof startPart === 'function') startPart();
            break;
        case 'speak-text':
            if (typeof speakText === 'function') speakText(el.dataset.audio, el.dataset.lang);
            break;
        case 'check-answer':
            if (typeof checkAnswer === 'function') checkAnswer(Number(el.dataset.index));
            break;
        case 'next-question':
            if (typeof nextQuestion === 'function') nextQuestion();
            break;
        case 'start-test':
            if (typeof startTest === 'function') startTest(el.dataset.level);
            break;
        case 'render-deutsch-home':
            if (typeof renderDeutschHome === 'function') renderDeutschHome();
            break;
        case 'start-tournament':
            if (typeof startTournamentGame === 'function') startTournamentGame();
            break;
        case 'tournament-answer':
            if (typeof tournamentAnswer === 'function') tournamentAnswer(Number(el.dataset.index));
            break;
        case 'tournament-next':
            if (typeof tournamentNext === 'function') tournamentNext();
            break;
        case 'render-tournament-home':
            if (typeof renderTournamentHome === 'function') renderTournamentHome();
            break;
        case 'toggle-details': {
            const target = document.getElementById(el.dataset.target);
            if (target) target.style.display = target.style.display === 'none' ? 'block' : 'none';
            break;
        }
        case 'toggle-edit-profile':
            if (typeof toggleEditProfileForm === 'function') toggleEditProfileForm();
            break;
        case 'select-profile-photo': {
            const input = document.getElementById('edit-profile-photo');
            if (input) input.value = el.dataset.emoji;
            break;
        }
        case 'set-search-tab':
            if (typeof setSearchCategoryTab === 'function') setSearchCategoryTab(el.dataset.tab);
            break;
        case 'clear-search': {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                searchInput.focus();
            }
            break;
        }
        case 'speak-german':
            if (typeof speakGermanText === 'function') speakGermanText(el.dataset.text, e);
            break;
        case 'quote-audio': {
            const deEl = document.getElementById('quote-de-text');
            const textToSpeak = (el.dataset.text || (deEl ? deEl.textContent : '')).replace(/^["“”„]+|["“”„]+$/g, '').trim();
            if (textToSpeak) {
                if (typeof speakCurrentQuote === 'function') {
                    speakCurrentQuote(textToSpeak);
                } else if (window.App && window.App.Quote && typeof window.App.Quote.speak === 'function') {
                    window.App.Quote.speak(textToSpeak);
                } else if (typeof speakGermanText === 'function') {
                    speakGermanText(textToSpeak, e);
                }
            }
            break;
        }
        case 'quote-next': {
            if (typeof nextIndividualQuote === 'function') {
                nextIndividualQuote();
            } else if (window.App && window.App.Quote && typeof window.App.Quote.next === 'function') {
                window.App.Quote.next();
            }
            break;
        }
        case 'open-auth':
            if (typeof openAuthModal === 'function') openAuthModal(el.dataset.mode);
            break;
        case 'close-auth':
            if (typeof closeAuthModal === 'function') closeAuthModal();
            break;
        case 'open-results':
            if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
            if (typeof openMyResults === 'function') openMyResults();
            break;
        case 'reply-comment':
            if (typeof replyToComment === 'function') replyToComment(Number(el.dataset.id));
            break;
        case 'edit-task':
            if (typeof editTask === 'function') editTask(Number(el.dataset.id));
            break;
        case 'delete-task':
            if (typeof deleteTask === 'function') deleteTask(Number(el.dataset.id));
            break;
        case 'filter-by-tag':
            if (typeof filterByTag === 'function') filterByTag(el.dataset.tag);
            break;
        case 'start-flashcards':
            if (typeof startFlashcards === 'function') startFlashcards(el.dataset.deck);
            break;
        case 'render-flashcards-home':
            if (typeof renderFlashcardsHome === 'function') renderFlashcardsHome();
            break;
        case 'verb-set-quiz':
            if (window.verbTrainerApp) window.verbTrainerApp.setMode('quiz');
            break;
        case 'verb-reset-daily':
            if (window.verbTrainerApp) window.verbTrainerApp.resetDaily();
            break;
    }
});

// Profile edit form submission
document.addEventListener('submit', (e) => {
    if (e.target && e.target.id === 'edit-profile-form') {
        e.preventDefault();
        if (typeof saveProfileChanges === 'function') saveProfileChanges(e);
    }
});


// ===== SAFE DATA-CLICK DISPATCHER (CSP COMPLIANT - ZERO EVAL) =====
function runDataClickAction(expr, event) {
    if (!expr) return;
    const m = expr.match(/^([a-zA-Z0-9_$]+(?:\.[a-zA-Z0-9_$]+)?)\s*\(([\s\S]*)\)\s*;?$/);
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

document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-click]');
    if (el) {
        runDataClickAction(el.getAttribute('data-click'), e);
    }
});

// Cmd/Ctrl + K shortcut to focus command bar search input
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
});

