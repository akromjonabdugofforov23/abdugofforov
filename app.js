


// Abdugofforov Blog & Portfolio - JavaScript Engine

function getCategoryIcon(category, type) {
    if (!category) return '📝';
    if (category === 'Borishga arziydigan joylar') return '✈️';
    if (category === 'Musiqa') return '🎵';
    if (category === 'Video') return '🎥';
    if (category === 'Loyiha') return '💼';
    
    if (type === 'music') return '🎵';
    if (type === 'video') return '🎥';
    if (type === 'image') return '🖼️';
    return '📝';
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
                category: p.category || 'Kundalik Blog',
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
                const rawText = `${t.title || ''} ${t.level || ''} ${t.note || ''} nemis tili test deutsch goethe`;
                this.index.tests.push({
                    id: testId,
                    type: 'test',
                    category: `Nemis tili testi (${t.level || 'A1'})`,
                    title: t.title || `Goethe ${t.level || 'A1'} Test`,
                    excerpt: t.note || `${t.level || 'A1'} darajali Goethe nemis tili interaktiv test to'plami.`,
                    level: t.level || 'A1',
                    normText: this.normalize(rawText),
                    tokens: this.tokenize(rawText),
                    raw: t
                });
            }
        } else if (typeof DEUTSCH_LEVELS_DATA !== 'undefined') {
            DEUTSCH_LEVELS_DATA.forEach(lv => {
                lv.tests.forEach(t => {
                    const rawText = `${t.name || ''} ${t.note || ''} ${lv.label || ''} ${lv.sub || ''} ${lv.key || ''} nemis tili test deutsch goethe`;
                    this.index.tests.push({
                        id: t.id,
                        type: 'test',
                        category: `Nemis tili (${lv.key})`,
                        title: `Goethe ${lv.key} - ${t.name}`,
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
let filterType = 'Kundalik Blog'; 
let searchQuery = '';
let searchCategoryTab = 'all'; 
let editingPostId = null;
let isAdmin = sessionStorage.getItem('kay_admin') === 'true';

// Rejalar va Portfolio state
function safeJSONParse(key, defaultVal) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultVal;
    } catch (e) {
        console.error('LocalStorage parsing error for ' + key, e);
        return defaultVal;
    }
}
let tasks = safeJSONParse('abdu_tasks', []);
let portfolioInfo = safeJSONParse('abdu_portfolio', {
    name: "Abdugofforov",
    title: "",
    bio: "",
    skills: "",
    experience: ""
});
let portfolioTokens = safeJSONParse('abdu_portfolio_tokens', []);

// 2. DOM Elementlari
const blogGrid = document.getElementById('blog-grid');
const mainNav = document.getElementById('main-nav');
const navLogo = document.getElementById('nav-logo');
const searchInput = document.getElementById('search-input');
const filterTags = document.getElementById('filter-tags');
const themeBtn = document.getElementById('theme-btn');
const addPostBtn = document.getElementById('add-post-btn');
const cancelAddBtn = document.getElementById('cancel-add-btn');

// Modallar
const postDetailModal = document.getElementById('post-detail-modal');
const closeDetailModal = document.getElementById('close-detail-modal');
const detailModalBody = document.getElementById('detail-modal-body');

const addPostModal = document.getElementById('add-post-modal');
const closeAddModal = document.getElementById('close-add-modal');
const newPostForm = document.getElementById('new-post-form');

// Admin Modallari va tugmalari
const adminBtn = document.getElementById('admin-btn'); // kay.html da bor
const pinModal = document.getElementById('pin-modal');
const closePinModal = document.getElementById('close-pin-modal');
const pinInput = document.getElementById('pin-input');
const pinSubmitBtn = document.getElementById('pin-submit-btn');
const pinError = document.getElementById('pin-error');

const adminPanelModal = document.getElementById('admin-panel-modal');
const closeAdminPanelBtn = document.getElementById('close-admin-panel-btn');
const adminTabPlansBtn = document.getElementById('admin-tab-plans-btn');
const adminTabPortBtn = document.getElementById('admin-tab-port-btn');
const adminPlansSection = document.getElementById('admin-plans-section');
const adminPortfolioSection = document.getElementById('admin-portfolio-section');

// Rejalar shakli
const adminTaskForm = document.getElementById('admin-task-form');
const taskTitleInput = document.getElementById('task-title-input');
const taskStatusInput = document.getElementById('task-status-input');
const taskEditId = document.getElementById('task-edit-id');
const adminTaskList = document.getElementById('admin-task-list');

// Portfolio Tahrirlash shakli
const adminPortForm = document.getElementById('admin-port-settings-form');
const portNameInput = document.getElementById('port-name-input');
const portTitleInput = document.getElementById('port-title-input');
const portBioInput = document.getElementById('port-bio-input');
const portSkillsInput = document.getElementById('port-skills-input');
const portExperienceInput = document.getElementById('port-experience-input');

// Havola yaratish elementlari
const generateTokenBtn = document.getElementById('generate-token-btn');
const generatedLinkBox = document.getElementById('generated-link-box');
const generatedLinkInput = document.getElementById('generated-link-input');
const copyLinkBtn = document.getElementById('copy-link-btn');

// Portfolio ko'rish elementlari
const portfolioView = document.getElementById('portfolio-view');
const mainContent = document.getElementById('main-content');
const closePortfolioBtn = document.getElementById('close-portfolio-btn');

// Hero Section elementlari
const heroMainTitle = document.getElementById('hero-main-title');
const heroSub = document.getElementById('hero-sub');

// 3. Sichqonchaga Ergashuvchi Doira (Mouse Follower)
function initMouseFollower() {
    const follower = document.createElement('div');
    follower.id = 'cursor-follower';
    document.body.appendChild(follower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        follower.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        follower.classList.remove('active');
    });

    // Lerp yordamida silliq harakatlantirish
    function animateFollower() {
        // Mobil qurilmalarda kursor kerak emas
        const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
        if (isMobile) {
            follower.style.display = 'none';
            return;
        }

        const lerpFactor = 0.12;
        followerX += (mouseX - followerX) * lerpFactor;
        followerY += (mouseY - followerY) * lerpFactor;

        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effektlari
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .post-card, .filter-tag, .form-input, .form-textarea, .modal-close')) {
            follower.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .post-card, .filter-tag, .form-input, .form-textarea, .modal-close')) {
            follower.classList.remove('cursor-hover');
        }
    });
}

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
    const themeBtns = document.querySelectorAll('.theme-toggle, #theme-btn, #dock-theme');
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
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('#theme-btn, .theme-toggle, #dock-theme');
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

// 6. Ma'lumotlarni saqlash (IndexedDB orqali Ã¢â‚¬â€ katta sig'im) + serverga sinxronlash
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
    if (!isAdmin || !window.Sync) return;
    const token = sessionStorage.getItem('kay_admin_token');
    const pin = sessionStorage.getItem('kay_admin_pin');
    if (!token && !pin) return; // sessionstorage'da auth ma'lumoti yo'q

    // Bir vaqtning o'zida bir nechta yuborishni oldini olamiz
    if (_syncInFlight) { _syncQueued = true; return; }
    _syncInFlight = true;

    const result = await Sync.pushPosts(posts, { token, pin });
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
                        <button class="search-filter-pill ${searchCategoryTab === 'all' ? 'active' : ''}" onclick="setSearchCategoryTab('all')">✨ Barchasi (${counts.all})</button>
                        <button class="search-filter-pill ${searchCategoryTab === 'posts' ? 'active' : ''}" onclick="setSearchCategoryTab('posts')">📝 Maqolalar (${counts.posts})</button>
                        <button class="search-filter-pill ${searchCategoryTab === 'tests' ? 'active' : ''}" onclick="setSearchCategoryTab('tests')">🇩🇪 Testlar (${counts.tests})</button>
                        <button class="search-filter-pill ${searchCategoryTab === 'flashcards' ? 'active' : ''}" onclick="setSearchCategoryTab('flashcards')">🃏 Kartochkalar (${counts.flashcards})</button>
                    </div>
                </div>
            `;
            blogGrid.appendChild(searchHeader);

            if (filteredHits.length === 0) {
                const emptyCard = document.createElement('div');
                emptyCard.className = 'empty-state';
                emptyCard.innerHTML = `
                    <span class="empty-state-icon">🔍</span>
                    <p class="empty-state-text">"${escapeHTML(searchQuery)}" bo'yicha bu toifada hech narsa topilmadi.</p>
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
                                <span class="search-type-badge badge-type-test">🇩🇪 Goethe Test (${item.level})</span>
                                <span class="test-card-badge">10 savol</span>
                            </div>
                            <h3 class="post-title" style="font-size:18px; margin-bottom:8px;">${highlightedTitle}</h3>
                            <p class="test-card-note" style="font-size:13.5px; line-height:1.5;">${highlightedExcerpt}</p>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; border-top:1px solid var(--glass-border); padding-top:12px;">
                            <span style="font-size:12px; color:var(--text-muted);">Goethe Imtihoni formati</span>
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
                                <button class="btn-icon fc-audio-btn" style="width:30px; height:30px; font-size:14px;" title="Talaffuz" onclick="speakGermanText('${escapeHTML(item.deckKey === 'uz_de' ? item.back : item.front).replace(/'/g, "\\'")}', event)">🔊</button>
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
            blogGrid.innerHTML = `
                <div class="empty-state">
                    <span class="empty-state-icon">📭</span>
                    <p class="empty-state-text">Hech qanday maqola yoki ma'lumot topilmadi.</p>
                </div>
            `;
            setTimeout(() => { if (blogGrid) blogGrid.style.minHeight = ''; }, 100);
            return;
        }

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

// Ko'rinishlarni almashtirish yordamchilari
// (asosiy <-> deutsch <-> kartochka <-> turnir)
function hideAuxViews() {
    ['deutsch-view', 'flashcards-view', 'tournament-view', 'verb-trainer-view'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const fortune = document.getElementById('fortune-widget-wrap');
    if (fortune) fortune.style.display = 'none';
}

// ===== SPA ROUTER & HISTORY STATE MANAGEMENT =====
function setAppRoute(route, push = true) {
    if (push && window.location.hash !== route) {
        try { history.pushState({ route: route }, '', route); } catch (e) {}
    }
}

function applyAppRoute(route) {
    const cleanRoute = (route || window.location.hash || '#home').toLowerCase();

    if (cleanRoute.includes('horror-deutsch')) {
        if (mainContent) mainContent.style.display = 'none';
        const hero = document.querySelector('.hero');
        if (hero) hero.style.display = 'none';
        hideAuxViews();
        const deutschView = document.getElementById('deutsch-view');
        if (deutschView) deutschView.style.display = 'block';
        if (typeof openHorrorHome === 'function') openHorrorHome(true);
    } else if (cleanRoute.includes('nemistili') || cleanRoute.includes('deutsch')) {
        openDeutschView(false);
    } else if (cleanRoute.includes('verb')) {
        openVerbTrainerView(false);
    } else if (cleanRoute.includes('flashcards')) {
        openFlashcardsView(false);
    } else if (cleanRoute.includes('tournament')) {
        openTournamentView(false);
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

function openDeutschView(pushHistory = true) {
    document.body.classList.remove('horror-theme');
    if (mainContent) mainContent.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    hideAuxViews();
    const deutschView = document.getElementById('deutsch-view');
    if (deutschView) deutschView.style.display = 'block';
    renderDeutschHome();
    if (pushHistory) setAppRoute('#nemistili', true);
}

function openVerbTrainerView(pushHistory = true) {
    document.body.classList.remove('horror-theme');
    if (mainContent) mainContent.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    hideAuxViews();
    const vView = document.getElementById('verb-trainer-view');
    if (vView) vView.style.display = 'block';
    if (window.verbTrainerApp && typeof window.verbTrainerApp.init === 'function') {
        window.verbTrainerApp.init();
    }
    if (pushHistory) setAppRoute('#verbs', true);
}

function openFlashcardsView(pushHistory = true) {
    document.body.classList.remove('horror-theme');
    if (mainContent) mainContent.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    hideAuxViews();
    const flashView = document.getElementById('flashcards-view');
    if (flashView) flashView.style.display = 'block';
    renderFlashcardsHome();
    if (pushHistory) setAppRoute('#flashcards', true);
}

function openGamesView(pushHistory = true) {
    document.body.classList.remove('horror-theme');
    if (mainContent) mainContent.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    hideAuxViews();
    const flashView = document.getElementById('flashcards-view');
    if (flashView) flashView.style.display = 'block';
    if (typeof showMatchingHome === 'function') showMatchingHome();
    if (pushHistory) setAppRoute('#games', true);
}

function openTournamentView(pushHistory = true) {
    document.body.classList.remove('horror-theme');
    if (mainContent) mainContent.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    hideAuxViews();
    const tView = document.getElementById('tournament-view');
    if (tView) tView.style.display = 'block';
    renderTournamentHome();
    if (pushHistory) setAppRoute('#tournament', true);
}

// 9. SPA Routing Navigation
// 9. SPA Routing Navigation
if (mainNav) {
    mainNav.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
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
            const activeTag = filterTags ? filterTags.querySelector('.filter-tag.active') : null;
            filterType = activeTag && activeTag.getAttribute('data-filter') ? activeTag.getAttribute('data-filter') : 'Kundalik Blog';
        }

        if (filterTags) {
            filterTags.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
        }

        if (typeof updateHeroContent === 'function') updateHeroContent();
        if (typeof renderPosts === 'function') renderPosts();
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
        e.preventDefault();

        // Maxsus tugmalar
        if (link.id === 'dock-contact' || link.getAttribute('href') === '#contact') {
            openContactModal();
            return;
        }
        if (link.id === 'dock-theme') {
            const themeBtn = document.getElementById('theme-btn');
            if (themeBtn) themeBtn.click();
            return;
        }
        if (link.id === 'dock-deutsch' || link.getAttribute('data-page') === 'deutsch') {
            openDeutschView();
            syncActiveNavState('deutsch');
            return;
        }
        if (link.id === 'dock-verbs' || link.getAttribute('data-page') === 'verbs') {
            openVerbTrainerView();
            syncActiveNavState('verbs');
            return;
        }
        if (link.getAttribute('data-page') === 'flashcards') {
            openFlashcardsView();
            syncActiveNavState('flashcards');
            return;
        }
        if (link.getAttribute('data-page') === 'tournament') {
            openTournamentView();
            syncActiveNavState('tournament');
            return;
        }
        
        let page = link.getAttribute('data-page') || 'home';
        if (page === 'blog') page = 'home';

        showMainView();
        syncActiveNavState(page);
        
        currentTab = page;
        const activeTag = filterTags ? filterTags.querySelector('.filter-tag.active') : null;
        filterType = (page === 'projects') ? 'project' : (activeTag && activeTag.getAttribute('data-filter') ? activeTag.getAttribute('data-filter') : 'Kundalik Blog');

        if (filterTags) {
            filterTags.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
        }

        if (typeof updateHeroContent === 'function') updateHeroContent();
        if (typeof renderPosts === 'function') renderPosts();
    });
}

function syncActiveNavState(page) {
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
        if (dockLink) dockLink.classList.add('active');
        else if (page === 'deutsch') {
            const dLink = desktopDock.querySelector('#dock-deutsch');
            if (dLink) dLink.classList.add('active');
        } else if (page === 'home' || page === 'blog') {
            const homeLink = desktopDock.querySelector('#dock-home') || desktopDock.querySelector('#dock-blog');
            if (homeLink) homeLink.classList.add('active');
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
            if (!activeBtn) filterType = 'Kundalik Blog';
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
                <button class="btn-primary" type="button" onclick="openAuthModal('login')" style="margin:0 auto;">Kirish / Ro'yxatdan o'tish</button>
            </div>`}
        </div>
    `;

    const editBtn = detailModalBody.querySelector('.edit-post-btn');
    const deleteBtn = detailModalBody.querySelector('.delete-post-btn');

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            editingPostId = post.id;
            addPostModal.querySelector('.write-title').textContent = "Maqolani tahrirlash";
            
            document.getElementById('post-title-input').value = post.title;
            const catInput = document.getElementById('post-category-input');
            if (catInput) {
                catInput.value = post.category || 'Kundalik Blog';
                catInput.dispatchEvent(new Event('change'));
            }
            document.getElementById('post-type-input').value = post.type || 'memory';
            document.getElementById('post-excerpt-input').value = post.excerpt || '';
            document.getElementById('post-content-input').value = post.content || '';
            const tagsInput = document.getElementById('post-tags-input');
            if (tagsInput) tagsInput.value = (post.tags || []).join(', ');

            // Mavjud rasmni saqlab qolish
            pendingImageData = post.image || null;
            if (postImageUrlInput) postImageUrlInput.value = (post.image && post.image.startsWith('http')) ? post.image : '';
            if (postImageFileInput) postImageFileInput.value = '';
            showImagePreview(post.image || null);

            // Musiqa maydonlari (ijrochi + havola + lokal fayl)
            if (postArtistInput) postArtistInput.value = post.artist || '';
            if (postLinkInput) postLinkInput.value = post.link || '';
            pendingMusicData = post.musicData || null;
            pendingMusicName = post.musicName || null;
            if (post.musicData && post.musicName && postMusicPreview && postMusicFilename) {
                postMusicFilename.textContent = post.musicName;
                postMusicPreview.style.display = 'block';
            } else if (postMusicPreview) {
                postMusicPreview.style.display = 'none';
            }
            if (postMusicFileInput) postMusicFileInput.value = '';

            // Video maydonlari
            pendingVideoData = post.videoData || null;
            pendingVideoName = post.videoName || null;
            if (post.videoData && postVideoPlayer && postVideoPreview) {
                postVideoPlayer.src = post.videoData;
                postVideoPreview.style.display = 'block';
            } else if (postVideoPreview) {
                postVideoPreview.style.display = 'none';
                if (postVideoPlayer) postVideoPlayer.src = '';
            }
            if (postVideoFileInput) postVideoFileInput.value = '';
            
            closePostDetailModal();
            addPostModal.classList.add('active');
            document.body.style.overflow = 'hidden';
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
            ${isAdmin && !comment.reply ? `<button class="btn-secondary btn-sm comment-reply-btn" onclick="replyToComment(${comment.id})" style="margin-top:8px;">↳ Javob berish</button>` : ''}
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

// Kategoriya o'zgarganda dinamik formani boshqarish
const postCategoryInput = document.getElementById('post-category-input');
const postMusicGroup = document.getElementById('post-music-group');
const postVideoGroup = document.getElementById('post-video-group');

if (postCategoryInput) {
    postCategoryInput.addEventListener('change', () => {
        const val = postCategoryInput.value;
        if (postMusicGroup) postMusicGroup.style.display = (val === 'Musiqa') ? 'block' : 'none';
        if (postVideoGroup) postVideoGroup.style.display = (val === 'Video') ? 'block' : 'none';
    });
}

// 11. Yangi Post Qo'shish / Tahrirlash Formasi
if (addPostBtn) addPostBtn.addEventListener('click', () => {
    editingPostId = null;
    addPostModal.querySelector('.write-title').textContent = "Yangi sahifa yaratish";
    newPostForm.reset();
    if (postCategoryInput) {
        postCategoryInput.value = 'Kundalik Blog';
        postCategoryInput.dispatchEvent(new Event('change'));
    }
    pendingImageData = null;
    pendingMusicData = null;
    pendingMusicName = null;
    pendingVideoData = null;
    pendingVideoName = null;
    showImagePreview(null);
    if (postMusicPreview) postMusicPreview.style.display = 'none';
    if (postVideoPreview) postVideoPreview.style.display = 'none';
    if (postVideoPlayer) postVideoPlayer.src = '';
    addPostModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeAddPostModal() {
    addPostModal.classList.remove('active');
    document.body.style.overflow = '';
    newPostForm.reset();
    pendingImageData = null;
    pendingMusicData = null;
    pendingMusicName = null;
    pendingVideoData = null;
    pendingVideoName = null;
    showImagePreview(null);
    if (postMusicPreview) postMusicPreview.style.display = 'none';
    if (postVideoPreview) postVideoPreview.style.display = 'none';
    if (postVideoPlayer) postVideoPlayer.src = '';
}

if (closeAddModal) closeAddModal.addEventListener('click', closeAddPostModal);
if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddPostModal);
if (addPostModal) addPostModal.addEventListener('click', (e) => {
    if (e.target === addPostModal) closeAddPostModal();
});

// ===== FAYL YUKLASH: rasm + musiqa (lokal) + video (lokal) =====
let pendingImageData = null; // data URL yoki tashqi havola
let pendingMusicData = null; // data URL (lokal audio fayl)
let pendingMusicName = null; // fayl nomi
let pendingVideoData = null; // data URL (lokal video fayl)
let pendingVideoName = null; // fayl nomi

const postImageFileInput = document.getElementById('post-image-file');
const postImageUrlInput = document.getElementById('post-image-input');
const postImagePreview = document.getElementById('post-image-preview');
const postArtistInput = document.getElementById('post-artist-input');
const postLinkInput = document.getElementById('post-link-input');
const postTypeInput = document.getElementById('post-type-input');
const postMusicFileInput = document.getElementById('post-music-file');
const postMusicPreview = document.getElementById('post-music-preview');
const postMusicFilename = document.getElementById('post-music-filename');
const postMusicRemove = document.getElementById('post-music-remove');
const postVideoFileInput = document.getElementById('post-video-file');
const postVideoPreview = document.getElementById('post-video-preview');
const postVideoPlayer = document.getElementById('post-video-player');
const postVideoRemove = document.getElementById('post-video-remove');

// Rasmni canvas orqali kichraytirib JPEG data URL ga aylantirish (xotira tejaladi)
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

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function showImagePreview(src) {
    if (!postImagePreview) return;
    if (src) {
        postImagePreview.style.backgroundImage = `url('${src}')`;
        postImagePreview.style.display = 'block';
    } else {
        postImagePreview.style.display = 'none';
        postImagePreview.style.backgroundImage = '';
    }
}

function toggleMusicGroup() {
    // Musiqa bo'limi endi doim ko'rinadi, alohida type tanlash kerak emas
}

// Rasm fayl tanlanganda — kichraytirib saqlaymiz
postImageFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const dataUrl = await compressImage(file);
        pendingImageData = dataUrl;
        if (postImageUrlInput) postImageUrlInput.value = ''; // fayl ustun turadi
        showImagePreview(dataUrl);
    } catch (err) {
        alert("Rasmni o'qishda xatolik yuz berdi.");
    }
});

// Rasm havolasi (URL) kiritilganda
postImageUrlInput?.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
        pendingImageData = url;
        showImagePreview(url);
    } else if (!postImageFileInput?.files.length) {
        pendingImageData = null;
        showImagePreview(null);
    }
});

// Musiqa fayl yuklash
postMusicFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const dataUrl = await readFileAsDataURL(file);
        pendingMusicData = dataUrl;
        pendingMusicName = file.name;
        if (postMusicFilename) postMusicFilename.textContent = file.name;
        if (postMusicPreview) postMusicPreview.style.display = 'block';
    } catch (err) {
        alert("Audio faylni o'qishda xatolik yuz berdi.");
    }
});

// Musiqa faylni olib tashlash
postMusicRemove?.addEventListener('click', () => {
    pendingMusicData = null;
    pendingMusicName = null;
    if (postMusicFileInput) postMusicFileInput.value = '';
    if (postMusicPreview) postMusicPreview.style.display = 'none';
});

// Video fayl yuklash
postVideoFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const dataUrl = await readFileAsDataURL(file);
        pendingVideoData = dataUrl;
        pendingVideoName = file.name;
        if (postVideoPlayer) {
            postVideoPlayer.src = dataUrl;
            postVideoPreview.style.display = 'block';
        }
    } catch (err) {
        alert("Video faylni o'qishda xatolik yuz berdi.");
    }
});

// Video faylni olib tashlash
postVideoRemove?.addEventListener('click', () => {
    pendingVideoData = null;
    pendingVideoName = null;
    if (postVideoFileInput) postVideoFileInput.value = '';
    if (postVideoPlayer) postVideoPlayer.src = '';
    if (postVideoPreview) postVideoPreview.style.display = 'none';
});

if (newPostForm) newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title-input').value.trim();
    const category = document.getElementById('post-category-input').value.trim();
    let excerpt = document.getElementById('post-excerpt-input').value.trim();
    const content = document.getElementById('post-content-input').value.trim();
    if (!excerpt && content) {
        excerpt = content.split('\n')[0].substring(0, 100);
    }
    const tagsRaw = document.getElementById('post-tags-input') ? document.getElementById('post-tags-input').value : '';
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean).slice(0, 8);

    // Post turini avtomatik aniqlash: musiqa > video > rasm > xotira
    let type = 'memory';
    const artist = postArtistInput ? postArtistInput.value.trim() : '';
    const link = postLinkInput ? postLinkInput.value.trim() : '';
    if (pendingMusicData || link) {
        type = 'music';
    } else if (pendingVideoData) {
        type = 'video';
    }
    // Yashirin type inputni ham yangilash
    if (postTypeInput) postTypeInput.value = type;

    // Rasm: yuklangan fayl / havola, bo'lmasa standart rasm
    let image = pendingImageData;
    if (!image) {
        if (type === 'music') {
            image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600';
        } else if (type === 'video') {
            image = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600';
        } else {
            image = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600';
        }
    }

    // Musiqa uchun lokal fayl yoki havola (biri bo'lsa yetarli)
    if (type === 'music' && link && !/^https?:\/\//i.test(link)) {
        alert("Havola http:// yoki https:// bilan boshlanishi kerak.");
        return;
    }

    if (editingPostId) {
        const postIndex = posts.findIndex(p => p.id === editingPostId);
        if (postIndex !== -1) {
            posts[postIndex] = {
                ...posts[postIndex],
                title,
                category,
                type,
                image,
                excerpt,
                content,
                tags,
                artist: type === 'music' ? artist : (posts[postIndex].artist || null),
                link: type === 'music' ? link : (posts[postIndex].link || null),
                musicData: type === 'music' ? (pendingMusicData || posts[postIndex].musicData || null) : null,
                musicName: type === 'music' ? (pendingMusicName || posts[postIndex].musicName || null) : null,
                videoData: type === 'video' ? (pendingVideoData || posts[postIndex].videoData || null) : null,
                videoName: type === 'video' ? (pendingVideoName || posts[postIndex].videoName || null) : null
            };
        }
        editingPostId = null;
    } else {
        const newPost = {
            id: Date.now(),
            title,
            category,
            type,
            excerpt,
            content,
            image,
            tags,
            artist: type === 'music' ? artist : null,
            link: type === 'music' ? link : null,
            musicData: type === 'music' ? pendingMusicData : null,
            musicName: type === 'music' ? pendingMusicName : null,
            videoData: type === 'video' ? pendingVideoData : null,
            videoName: type === 'video' ? pendingVideoName : null,
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            liked: false,
            comments: []
        };
        posts.unshift(newPost);
    }

    try {
        savePosts();
    } catch (err) {
        alert("Saqlashda xatolik: brauzer xotirasi to'lgan bo'lishi mumkin. Iltimos kamroq yoki kichikroq rasm/audio ishlating.");
        return;
    }
    renderPosts();
    closeAddPostModal();
});

// 12. PIN-Kod Kirish (Admin)
if (adminBtn) {
    adminBtn.addEventListener('click', () => {
        if (pinInput) pinInput.value = '';
        if (pinError) pinError.style.display = 'none';
        if (pinModal) {
            pinModal.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    });
}

document.getElementById('close-pin-modal')?.addEventListener('click', () => {
    pinModal?.classList.remove('active');
    document.body.style.overflow = '';
});

pinSubmitBtn?.addEventListener('click', handlePinSubmit);
pinInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handlePinSubmit();
});

function handlePinSubmit() {
    const pin = pinInput?.value.trim();
    
    // Brute-force himoya
    const attempts = parseInt(sessionStorage.getItem('pin_attempts') || '0');
    const lockUntil = parseInt(sessionStorage.getItem('pin_lock_until') || '0');
    
    if (Date.now() < lockUntil) {
        const secsLeft = Math.ceil((lockUntil - Date.now()) / 1000);
        if (pinError) pinError.textContent = `Juda ko'p urinish! ${secsLeft} soniya kuting.`;
        if (pinError) pinError.style.display = 'block';
        return;
    }
    
    if (!pin) return;

    // PIN ni SERVERDA tekshiramiz — hash KODDA saqlanmaydi (server /check-pin hal qiladi)
    fetch('/check-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
    })
    .then(r => r.json().catch(() => ({})))
    .then(data => {
        if (data && data.success) {
            sessionStorage.removeItem('pin_attempts');
            sessionStorage.removeItem('pin_lock_until');
            // PIN ni admin sessiyasi uchun saqlaymiz (server yozishlarida kerak bo'ladi).
            sessionStorage.setItem('kay_admin_pin', pin);
            pinModal?.classList.remove('active');
            openAdminPanel();
        } else {
            const newAttempts = attempts + 1;
            sessionStorage.setItem('pin_attempts', newAttempts);
            if (newAttempts >= 3) {
                const lockTime = Date.now() + 60000; // 60 soniya
                sessionStorage.setItem('pin_lock_until', lockTime);
                if (pinError) pinError.textContent = 'Juda ko\'p urinish! 60 soniya kuting.';
                sessionStorage.setItem('pin_attempts', '0');
            } else {
                if (pinError) pinError.textContent = `PIN noto\'g\'ri! (${newAttempts}/3 urinish)`;
            }
            if (pinError) pinError.style.display = 'block';
            if (pinInput) pinInput.value = '';
            pinInput?.focus();
        }
    })
    .catch(() => {
        if (pinError) { pinError.textContent = 'Server bilan bog\'lanib bo\'lmadi'; pinError.style.display = 'block'; }
    });
}

// 13. Admin Panel Boshqaruvi
function openAdminPanel() {
    sessionStorage.setItem('kay_admin', 'true');
    isAdmin = true;
    adminPanelModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('admin-mode');
    // Loyihalar nav havolasini admin uchun ko'rsatish
    const navPortfolioLink = document.getElementById('nav-portfolio-link');
    if (navPortfolioLink) navPortfolioLink.style.display = 'inline-flex';
    adminTabPlansBtn?.click();
    renderTasks();
    loadPortfolioForm();
    renderPosts(); // Admin tugmalarini ko'rsatish uchun qayta render
}

closeAdminPanelBtn?.addEventListener('click', () => {
    isAdmin = false;
    sessionStorage.removeItem('kay_admin');
    sessionStorage.removeItem('kay_admin_pin');
    adminPanelModal?.classList.remove('active');
    document.body.classList.remove('admin-mode');
    // Loyihalar nav havolasini yashirish
    const navPortfolioLink = document.getElementById('nav-portfolio-link');
    if (navPortfolioLink) navPortfolioLink.style.display = 'none';
    renderPosts(); // Admin tugmalarini yashirish uchun qayta render
    document.body.style.overflow = '';
});

// Tablararo navigatsiya
adminTabPlansBtn?.addEventListener('click', () => {
    adminTabPlansBtn?.classList.add('active');
    adminTabPortBtn?.classList.remove('active');
    if (adminPlansSection) adminPlansSection.style.display = 'block';
    if (adminPortfolioSection) adminPortfolioSection.style.display = 'none';
});

adminTabPortBtn?.addEventListener('click', () => {
    adminTabPortBtn?.classList.add('active');
    adminTabPlansBtn?.classList.remove('active');
    if (adminPortfolioSection) adminPortfolioSection.style.display = 'block';
    if (adminPlansSection) adminPlansSection.style.display = 'none';
});

// Rejalar CRUD
adminTaskForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    const status = taskStatusInput.value;
    const editId = taskEditId.value;

    if (editId) {
        const task = tasks.find(t => t.id === parseInt(editId));
        if (task) {
            task.title = title;
            task.status = status;
        }
        taskEditId.value = '';
    } else {
        const newTask = {
            id: Date.now(),
            title,
            status
        };
        tasks.push(newTask);
    }

    localStorage.setItem('abdu_tasks', JSON.stringify(tasks));
    adminTaskForm.reset();
    renderTasks();
});

function renderTasks() {
    if (!adminTaskList) return;
    adminTaskList.innerHTML = '';
    
    let countTodo = 0;
    let countProgress = 0;
    let countDone = 0;

    tasks.forEach(task => {
        if (task.status === 'todo') countTodo++;
        else if (task.status === 'progress') countProgress++;
        else if (task.status === 'done') countDone++;

        const item = document.createElement('div');
        item.className = 'admin-task-item';
        
        let badgeClass = 'badge-todo';
        let badgeText = 'Todo';
        if (task.status === 'progress') { badgeClass = 'badge-progress'; badgeText = 'Progress'; }
        else if (task.status === 'done') { badgeClass = 'badge-done'; badgeText = 'Done'; }

        item.innerHTML = `
            <span>${escapeHTML(task.title)}</span>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="task-badge ${badgeClass}">${badgeText}</span>
                <div class="admin-task-actions">
                    <button type="button" class="btn-icon" onclick="editTask(${task.id})" style="font-size:12px; padding: 4px;">✏️</button>
                    <button type="button" class="btn-icon" onclick="deleteTask(${task.id})" style="font-size:12px; padding: 4px; color:#ff4d4d;">🗑️</button>
                </div>
            </div>
        `;
        adminTaskList.appendChild(item);
    });

    const countTodoEl = document.getElementById('count-todo');
    const countProgressEl = document.getElementById('count-progress');
    const countDoneEl = document.getElementById('count-done');
    if (countTodoEl) countTodoEl.textContent = countTodo;
    if (countProgressEl) countProgressEl.textContent = countProgress;
    if (countDoneEl) countDoneEl.textContent = countDone;

    const total = tasks.length;
    const percentage = total === 0 ? 0 : Math.round((countDone / total) * 100);
    const pctEl = document.getElementById('chart-percentage-text');
    if (pctEl) pctEl.textContent = `${percentage}%`;

    const circle = document.getElementById('progress-ring-circle');
    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius; 
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

window.editTask = function(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    taskTitleInput.value = task.title;
    taskStatusInput.value = task.status;
    taskEditId.value = task.id;
    taskTitleInput.focus();
};

window.deleteTask = function(taskId) {
    if (confirm("Ushbu vazifani o'chirmoqchimisiz?")) {
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('abdu_tasks', JSON.stringify(tasks));
        renderTasks();
    }
};

// Portfolio yuklash
function loadPortfolioForm() {
    if (!portNameInput) return;
    portNameInput.value = portfolioInfo.name;
    portTitleInput.value = portfolioInfo.title;
    portBioInput.value = portfolioInfo.bio;
    portSkillsInput.value = portfolioInfo.skills;
    portExperienceInput.value = portfolioInfo.experience;
}

if (adminPortForm) {
    adminPortForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        portfolioInfo = {
            name: portNameInput.value.trim(),
            title: portTitleInput.value.trim(),
            bio: portBioInput.value.trim(),
            skills: portSkillsInput.value.trim(),
            experience: portExperienceInput.value.trim()
        };
        
        localStorage.setItem('abdu_portfolio', JSON.stringify(portfolioInfo));
        alert("Portfolio ma'lumotlari muvaffaqiyatli saqlandi!");
        renderPortfolioView();
    });
}

// Bir martalik token yaratish
if (generateTokenBtn) {
    generateTokenBtn.addEventListener('click', () => {
        const token = 'abdu_' + Math.random().toString(36).substr(2, 8);
        portfolioTokens.push(token);
        localStorage.setItem('abdu_portfolio_tokens', JSON.stringify(portfolioTokens));

        const link = `${window.location.origin}${window.location.pathname}?token=${token}`;
        if (generatedLinkInput) generatedLinkInput.value = link;
        if (generatedLinkBox) generatedLinkBox.style.display = 'block';
    });
}

if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
        if (generatedLinkInput) generatedLinkInput.select();
        document.execCommand('copy');
        alert("Havola nusxalandi!");
    });
}

// 14. Portfolio Sahifasini Render Qilish
function renderPortfolioView() {
    const nameEl = document.getElementById('port-display-name');
    const titleEl = document.getElementById('port-display-title');
    const bioEl = document.getElementById('port-display-bio');
    if (nameEl) nameEl.textContent = portfolioInfo.name;
    if (titleEl) titleEl.textContent = portfolioInfo.title;
    if (bioEl) bioEl.textContent = portfolioInfo.bio;

    const skillsList = document.getElementById('port-display-skills');
    if (skillsList) {
    skillsList.innerHTML = '';
    const skillsArr = portfolioInfo.skills.split(',');
    skillsArr.forEach(s => {
        if (s.trim()) {
            const li = document.createElement('li');
            li.textContent = s.trim();
            li.style.background = '#111827';
            li.style.color = '#00ff88';
            li.style.border = '1px solid rgba(0, 255, 136, 0.2)';
            li.style.padding = '6px 14px';
            li.style.borderRadius = '20px';
            li.style.fontSize = '12px';
            li.style.fontFamily = 'monospace';
            skillsList.appendChild(li);
        }
    });
    }

    const expDiv = document.getElementById('port-display-experience');
    if (expDiv) {
    expDiv.innerHTML = '';
    const expArr = portfolioInfo.experience.split(';');
    expArr.forEach(exp => {
        if (exp.trim()) {
            const p = document.createElement('p');
            p.style.marginBottom = '12px';
            p.style.color = '#f3f4f6';
            
            const parts = exp.trim().split('(');
            if (parts.length === 2) {
                const comp = parts[0].trim();
                const year = parts[1].replace(')', '').trim();
                p.innerHTML = `<strong style="color:#ff4d4d;">${comp}</strong> (${year})`;
            } else {
                p.innerHTML = exp.trim();
            }
            expDiv.appendChild(p);
        }
    });
    }
}

// Tokenni tekshirish
function checkPortfolioAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const pToken = urlParams.get('p');
    const token = urlParams.get('token');

    let isValid = false;

    if (pToken) {
        try {
            const decoded = JSON.parse(decodeURIComponent(atob(pToken)));
            if (decoded.exp && Date.now() > decoded.exp) {
                isValid = false;
            } else {
                portfolioInfo = decoded.data;
                isValid = true;
            }
        } catch (e) {
            isValid = false;
        }
    } else if (token) {
        const tokenIndex = portfolioTokens.indexOf(token);
        if (tokenIndex !== -1) {
            portfolioTokens.splice(tokenIndex, 1);
            localStorage.setItem('abdu_portfolio_tokens', JSON.stringify(portfolioTokens));
            isValid = true;
        }
    }

    if (pToken || token) {
        if (isValid) {
            renderPortfolioView();
            document.querySelector('.hero').style.display = 'none';
            mainContent.style.display = 'none';
            document.querySelector('.footer').style.display = 'none';
            portfolioView.style.display = 'block';

            const follower = document.getElementById('cursor-follower');
            if (follower) {
                follower.classList.add('portfolio-mode');
            }
        } else {
            document.querySelector('.hero').style.display = 'none';
            mainContent.style.display = 'none';
            document.querySelector('.footer').style.display = 'none';
            
            portfolioView.innerHTML = `
                <div class="portfolio-expired animate-fade-in" style="background:#000; min-height:80vh; display:flex; flex-direction:column; justify-content:center; align-items:center; border-radius:24px;">
                    <span style="font-size: 64px; display: block; margin-bottom: 20px;">🔒</span>
                    <h2 style="color:#ff4d4d; font-family:'Playfair Display', serif;">Ushbu kirish havolasi eskirgan yoki noto'g'ri!</h2>
                    <p style="color:#626a7f;">Xavfsizlik maqsadida ushbu portfolio havolasi faqat cheklangan vaqt yoki bir martalik foydalanish uchun mo'ljallangan.</p>
                    <button class="btn-primary" onclick="window.location.href = window.location.pathname" style="margin-top: 25px; border-color:#00ff88; color:#00ff88; background:transparent;">Bosh sahifaga o'tish</button>
                </div>
            `;
            portfolioView.style.display = 'block';
        }
    }
}

if (closePortfolioBtn) closePortfolioBtn.addEventListener('click', () => {
    window.location.href = window.location.pathname;
});

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

function renderMarkdown(str) {
    if (!str) return '';
    if (window.marked) {
        return window.marked.parse(str);
    }
    return escapeHTML(str);
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
        const deutschView = document.getElementById('deutsch-view');
        const flashView = document.getElementById('flashcards-view');
        if (deutschView && deutschView.style.display !== 'none') renderDeutschHome();
        if (flashView && flashView.style.display !== 'none') {
            fcDeckKey ? renderFlashcard() : renderFlashcardsHome();
        }
    });
}

// ===== 3D KIRISH ANIMATSIYASINI YASHIRISH =====
function initIntroSplash() {
    const splash = document.getElementById('intro-splash');
    if (!splash) return;
    const start = Date.now();
    const MIN_MS = 1800; // kamida shuncha vaqt ko'rsatiladi

    function hide() {
        const wait = Math.max(0, MIN_MS - (Date.now() - start));
        setTimeout(() => {
            splash.classList.add('hide');
            setTimeout(() => splash.remove(), 800);
        }, wait);
    }

    // Bosib o'tkazib yuborish mumkin
    splash.addEventListener('click', () => {
        splash.classList.add('hide');
        setTimeout(() => splash.remove(), 800);
    });

    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
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
        // "Yozish" tugmasini chaqirib bersa o'sha modal ochiladi
        const addBtn = document.getElementById('add-post-btn');
        if (addBtn) {
            addBtn.click();
        } else {
            // Backup: modal'ni to'g'ridan-to'g'ri ochish
            const modal = document.getElementById('add-post-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
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
        `<button class="tag-pill" onclick="filterByTag('${escapeAttr(t)}')">#${escapeHTML(t)}</button>`
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
    if (!isAdmin || currentDetailPostId == null) return;
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

// ===== NEMIS TESTLARI — NATIJALAR TARIXI =====
function saveTestResult(level, score, total, wrongDetails) {
    const hist = JSON.parse(localStorage.getItem('deutsch_history') || '[]');
    hist.unshift({
        level,
        score,
        total,
        pct: total ? Math.round(score / total * 100) : 0,
        date: new Date().toISOString(),
        details: wrongDetails ? JSON.parse(JSON.stringify(wrongDetails)) : []
    });
    localStorage.setItem('deutsch_history', JSON.stringify(hist.slice(0, 50)));
}
function getTestHistory() {
    return JSON.parse(localStorage.getItem('deutsch_history') || '[]');
}
function renderTestHistory() {
    const hist = getTestHistory();
    if (!hist.length) return '';
    const rows = hist.slice(0, 6).map(h => {
        const d = new Date(h.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
        const color = h.pct >= 80 ? '#34d399' : h.pct >= 60 ? '#fbbf24' : '#f87171';
        return `<div style="display:flex;align-items:center;gap:10px;font-size:13px;padding:8px 0;border-bottom:1px solid var(--border-color);">
            <span style="text-transform:uppercase;font-weight:600;width:42px;">${escapeHTML(h.level)}</span>
            <div style="flex:1;height:6px;background:var(--border-color);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${h.pct}%;background:${color};"></div>
            </div>
            <span style="width:70px;text-align:right;color:var(--text-secondary);">${h.score}/${h.total} - ${h.pct}%</span>
            <span style="width:56px;text-align:right;color:var(--text-muted);font-size:11px;">${d}</span>
        </div>`;
    }).join('');
    return `<div class="post-card" style="max-width:680px;margin:30px auto 0;padding:22px;">
        <h3 style="font-size:16px;margin-bottom:12px;">🏆 Sizning natijalaringiz</h3>
        ${rows}
    </div>`;
}

// ===== FLASHCARD — SPACED REPETITION (Leitner) + STREAK =====
const FC_INTERVALS = [0, 1, 2, 4, 7, 15]; // box raqami -> kunlar
function fcProgress() { return JSON.parse(localStorage.getItem('fc_progress') || '{}'); }
function fcSaveProgress(p) { localStorage.setItem('fc_progress', JSON.stringify(p)); }
function fcCardKey(deck, idx) { return deck + ':' + idx; }

function fcAnswer(known) {
    const prog = fcProgress();
    const key = fcCardKey(fcDeckKey, fcOrder[fcIndex]);
    let box = (prog[key] && prog[key].box) || 1;
    box = known ? Math.min(box + 1, 5) : 1;
    prog[key] = { box, due: Date.now() + FC_INTERVALS[box] * 86400000 };
    fcSaveProgress(prog);
    updateFcStreak();
    if (fcIndex < fcOrder.length - 1) { fcIndex++; renderFlashcard(); }
    else renderFlashcardDone();
}

function updateFcStreak() {
    const today = new Date().toISOString().split('T')[0];
    const s = JSON.parse(localStorage.getItem('fc_streak') || '{"count":0,"last":""}');
    if (s.last === today) return s.count;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    s.count = (s.last === yesterday) ? (s.count + 1) : 1;
    s.last = today;
    localStorage.setItem('fc_streak', JSON.stringify(s));
    return s.count;
}
function getFcStreak() {
    return (JSON.parse(localStorage.getItem('fc_streak') || '{"count":0}').count) || 0;
}
function fcMasteredCount(deckKey) {
    const prog = fcProgress();
    let n = 0;
    (flashcardDecks[deckKey] || []).forEach((_, i) => {
        const e = prog[fcCardKey(deckKey, i)];
        if (e && e.box >= 4) n++;
    });
    return n;
}
function renderFlashcardDone() {
    const view = document.getElementById('flashcards-content');
    if (!view) return;
    const mastered = fcMasteredCount(fcDeckKey);
    const total = flashcardDecks[fcDeckKey].length;
    view.innerHTML = `
        <div style="max-width:480px;margin:0 auto;text-align:center;">
            <div style="font-size:60px;margin-bottom:14px;">🌟</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:26px;margin-bottom:8px;">To'plam yakunlandi!</h2>
            <p style="color:var(--text-secondary);margin-bottom:24px;">O'zlashtirildi: <b>${mastered}/${total}</b> &nbsp;-&nbsp; 🔥 Streak: <b>${getFcStreak()} kun</b></p>
            <div style="display:flex;gap:12px;justify-content:center;">
                <button class="btn-primary" onclick="startFlashcards('${fcDeckKey}')">🔄 Qayta</button>
                <button class="btn-secondary" onclick="renderFlashcardsHome()">${i18n.t('fc.back')}</button>
            </div>
        </div>`;
}

// ===== GERMANY CAROUSEL =====
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (!track || !dotsContainer) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const total = slides.length;
    let current = 0;
    let autoSlideInterval = null;

    // Dots yaratish
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsContainer.appendChild(dot);
    }

    function goTo(idx) {
        current = ((idx % total) + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dotsContainer.querySelectorAll('.carousel-dot').forEach(function(d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    // Slide-left: always advance forward (right to left)
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (prevBtn) prevBtn.addEventListener('click', function() { prev(); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { next(); resetAuto(); });

    // Auto-play: 15 seconds interval
    function startAuto() {
        autoSlideInterval = setInterval(next, 15000);
    }
    function stopAuto() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    function resetAuto() {
        stopAuto();
        startAuto();
    }

    startAuto();

    // Pause carousel when tab is hidden to prevent slide jumps on return
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAuto();
        } else {
            startAuto();
        }
    });

    // Image onerror fallback: hide broken image (shows dark bg)
    slides.forEach(function(slide) {
        var img = slide.querySelector('img');
        if (img) {
            img.onerror = function() {
                this.style.display = 'none';
            };
        }
    });

    // Touch/swipe support via pointer events
    var pointerStartX = 0;
    var pointerDown = false;

    track.addEventListener('pointerdown', function(e) {
        pointerStartX = e.clientX;
        pointerDown = true;
        track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointerup', function(e) {
        if (!pointerDown) return;
        pointerDown = false;
        var diff = pointerStartX - e.clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) { next(); } else { prev(); }
            resetAuto();
        }
    });

    track.addEventListener('pointercancel', function() {
        pointerDown = false;
    });

    // Also support touch events for older mobile browsers
    var touchStartX = 0;
    track.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next(); else prev();
            resetAuto();
        }
    }, { passive: true });
}

// ===== HERO TYPEWRITER =====
// hero-title-text'ning matnini harfma-harf qayta yozadi (langchange'da yangilanadi)
let _typewriterTimer = null;
function runTypewriter() {
    const el = document.querySelector('.hero-title-text');
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const full = (window.i18n && i18n.t) ? i18n.t('hero.title') : (el.getAttribute('data-final') || el.textContent || '');
    el.setAttribute('data-final', full);
    if (reduced) { el.textContent = full; return; }
    if (_typewriterTimer) { clearInterval(_typewriterTimer); _typewriterTimer = null; }
    el.textContent = '';
    let i = 0;
    const speed = 55;
    _typewriterTimer = setInterval(() => {
        if (i >= full.length) {
            clearInterval(_typewriterTimer);
            _typewriterTimer = null;
            return;
        }
        el.textContent += full.charAt(i);
        i++;
    }, speed);
}

// CTA tugmasi Ã¢â‚¬â€ blog grid'iga skroll
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

function getHighValueDefaultPosts() {
    return [
        {
            id: 'post_goethe_guide_1',
            type: 'memory',
            title: "🇩🇪 Goethe Zertifikat A1-B1 Imtihonini 1-Marta Topshirish Sirlari va Tayyorgarlik Rejasi",
            category: "Kundalik Blog",
            excerpt: "Nemis tili imtihonidan muvaffaqiyatli o'tish uchun Hören, Lesen, Schreiben va Sprechen bo'limlari bo'yicha amaliy maslahatlar va eng ko'p yo'l qo'yiladigan xatolar.",
            content: "## 🇩🇪 Goethe Zertifikat Imtihoniga Mukammal Tayyorgarlik\n\nNemis tili xalqaro sertifikatini (A1, A2, B1) birinchi urinishda topshirish uchun faqat so'z yodlash yetarli emas. Imtihon formatini va baholash mezonlarini to'g'ri tushunish o'ta muhimdir.\n\n---\n\n### 1. 🎧 Hören (Eshitib tushunish)\n- **Asosiy sir:** Savollarni audio boshlanishidan oldin berilgan 15-30 soniya ichida ko'zdan kechirib, kalit so'zlarga (Keywords) tagiga chizing.\n- Sonlar, vaqtlar va narxlarda (masalan, *14:30* yoki *40 Euro*) aldatuvchi variantlarga e'tibor bering.\n\n---\n\n### 2. 📖 Lesen (O'qib tushunish)\n- Har bir matnni so'zma-so'z tarjima qilish shart emas. Asosiy maqsad — savoldagi iboraning **sinonimini (Synonyme)** matndan topish.\n\n---\n\n### 3. ✍️ Schreiben (Yozma ish)\n- Xat yozishda 3 ta asosiy topshiriq (Punkte) beriladi. Ularning har biriga kamida **2-3 ta gap** bilan javob bering.\n- Standart kirish/chiqish iboralari (`Sehr geehrte Damen und Herren`, `Ich schreibe Ihnen, weil...`) ni xatosiz yoddan biling.\n\n---\n\n### 4. 🗣️ Sprechen (Og'zaki imtihon)\n- Sherigingiz bilan muloqotda adashib ketsangiz to'xtab qolmang: *\"Entschuldigung, ich meine...\"* deb qayta ayting.\n- Imtihon oluvchi balni grammatikadan ko'ra **erkin va ishonchli gapirishingizga** qarab qo'yadi!",
            image: "images/neuschwanstein.webp",
            date: new Date().toISOString(),
            likes: 24,
            comments: [
                { author: "Jasur", text: "Juda foydali maslahatlar bo'libdi, raxmat!", date: "2026-07-20T10:00:00Z" }
            ]
        },
        {
            id: 'post_roadmap_2026',
            type: 'memory',
            title: "💻 2026-Yilda Zamonaviy Web Dasturchi Bo'lish Yo'l Xaritasi (Roadmap)",
            category: "Kundalik Blog",
            excerpt: "Noldan boshlab zamonaviy web dasturlash, HTML5, CSS3, JavaScript ES6+ va Sun'iy Intellekt vositalari orqali haqiqiy loyihalar yaratish qo'llanmasi.",
            content: "## 💻 2026-Yilda Zamonaviy Dasturchi Yo'l Xaritasi\n\nZamonaviy dasturlashda faqat nazariya bilish yetarsiz. Bugungi kunda **sun'iy intellekt (AI Agentlar)** bilan birgalikda tez va sifatli kod yozish asosiy ko'nikmaga aylandi.\n\n---\n\n### 🚀 Bosqichma-Bosqich Qadamlar:\n\n1. **HTML5 & Vanilla CSS (Semantik va UI Dizayn):**\n   - Flexbox va CSS Grid bilan ishlash.\n   - Glassmorphism va Dark Mode ranglar palitrasini o'zlashtirish.\n\n2. **JavaScript (Core Logic & ES6+):**\n   - Async/Await, Promises va Fetch API orqali server bilan ishlash.\n   - SPA (Single Page Application) arxitekturasi va State Management.\n\n3. **AI Pair Programming:**\n   - Sun'iy intellekt vositalaridan to'g'ri va samarali foydalanish hamda koddagi xatolarni avtomatik tuzatish.\n\n---\n\n> 💡 **Oltin Qoida:** Kodni shunchaki nusxalamang, har bir satr nimaga javob berishini tushunib yeting!",
            image: "images/hamburg.webp",
            date: new Date(Date.now() - 86400000).toISOString(),
            likes: 31,
            comments: []
        },
        {
            id: 'post_articles_grammar_3',
            type: 'memory',
            title: "🇩🇪 Nemis Tilidadagi Artikllar (Der, Die, Das) ni Oson Eslab Qolish Texnikasi",
            category: "Kundalik Blog",
            excerpt: "Artikllarni yodlashda qoidalarsiz mantiqiy usullar: otlarning qo'shimchasi (-ung, -heit, -keit, -chen, -ismus) orqali jinsini topish formulasi.",
            content: "## 🇩🇪 Artikllarni Yodlashning Oson Usuli\n\nNemis tilida har bir otning jinsi bor (*der*, *die*, *das*). Lekin ularning 80% qismini otning oxiridagi qo'shimchasiga (Suffix) qarab darhol aniqlash mumkin!\n\n---\n\n### 1. 🔴 DIE (Ayollar va Ko'plik):\nHar doim **DIE** artiklini oladigan qo'shimchalar:\n- **-ung** (die Wohnung, die Zeitung)\n- **-heit** (die Freiheit, die Gesundheit)\n- **-keit** (die Möglichkeit, die Einsamkeit)\n- **-schaft** (die Freundschaft, die Mannschaft)\n- **-tät** (die Universität, die Qualität)\n\n---\n\n### 2. 🔵 DER (Erkaklar Jinsi):\nHar doim **DER** artiklini oladigan qo'shimchalar:\n- **-ling** (der Schmetterling, der Lehrling)\n- **-ismus** (der Optimismus, der Realismus)\n- **-or** (der Motor, der Reaktor)\n\n---\n\n### 3. 🟢 DAS (Neutral Jins):\nHar doim **DAS** artiklini oladigan qo'shimchalar:\n- **-chen** (das Mädchen, das Brötchen)\n- **-lein** (das Fräulein)\n- **-ment** (das Dokument, das Instrument)",
            image: "images/koelner-dom.webp",
            date: new Date(Date.now() - 172800000).toISOString(),
            likes: 19,
            comments: []
        },
        {
            id: 'post_travel_budget_4',
            type: 'memory',
            title: "✈️ O'zbekiston Fuqarolari Uchun Hamyonbop Sayohat va Vizasiz Maskanlar",
            category: "Borishga arziydigan joylar",
            excerpt: "Budjetni tejagan holda Qirg'iziston Issiqko'li, Gruziya Batumi qirg'oqlari va Turkiya tabiatiga maroqli sayohat uyushtirish sirlari.",
            content: "## ✈️ Hamyonbop va Vizasiz Tabiat Maskanlari\n\nKo'pchilik sayohat qilish uchun minglab dollar va qiyin viza hujjatlari kerak deb o'ylaydi. Aslida O'zbekiston fuqarolari uchun juda ko'p arzon va vizasiz ajoyib yo'nalishlar bor!\n\n---\n\n### 🏔️ 1. Issiqko'l (Qirg'iziston)\n- **Viza:** Vizasiz (Passport bilan).\n- **Transport:** Toshkentdan to'g'ridan-to'g'ri avtobus yoki poyezd.\n- **Nima uchun borish kerak:** Tien-Shan tog'lari bag'ridagi musaffo havo, shifobaxsh sho'r suv va arzon milliy taomlar.\n\n---\n\n### 🌴 2. Batumi va Ajariya (Gruziya)\n- **Viza:** 90 kun Vizasiz.\n- **Transport:** Arzon aviaparvozlar.\n- **Nima uchun borish kerak:** Qora dengiz sohili va Kavkaz tog'larining maftunkor tabiat manzaralari.",
            image: "images/schwarzwald.webp",
            date: new Date(Date.now() - 259200000).toISOString(),
            likes: 42,
            comments: []
        }
    ];
}

function sanitizePosts(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(p => p && p.id && String(p.id) !== '1710000' && p.title && p.category);
}

async function bootstrap() {
    // 3D kirish animatsiyasi darhol boshlanadi
    initIntroSplash();

    // Til (i18n) Ã¢â‚¬â€  statik tarjimalar va til tanlagich
    initLanguage();

    // Mavzu va kursorni darhol ishga tushiramiz (ma'lumotga bog'liq emas)
    initTheme();
    initMouseFollower();

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
            }
        }
    } catch (e) {
        console.error('Xotira yuklashda xato:', e);
        posts = getHighValueDefaultPosts();
    }

    // Admin holatini tiklash Ã¢â‚¬â€ sahifa yangilanganda ham admin tugmalari
    // (Yozish, Floating +) faqat admin uchun ko'rinishi uchun
    if (isAdmin) {
        document.body.classList.add('admin-mode');
        const navPortfolioLink = document.getElementById('nav-portfolio-link');
        if (navPortfolioLink) navPortfolioLink.style.display = 'inline-flex';
    }

    renderPosts();
    checkPortfolioAccess();
    initScrollReveal();
    registerServiceWorker();
    openPostFromUrl();
    if (window.location.hash) {
        applyAppRoute(window.location.hash);
    }

    // Yangi: hero particles + footer particles + CTA tugmasi + 3D tilt + Floating +
    // initParticles(); // Performance optimization
    // initFooterParticles(); // Performance optimization
    initCarousel();
    initHeroCta();
    initFortuneQuotes();
    initStatsCounters();
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
        }
    } catch (authErr) {
        console.error('Auth tiklashda xatolik:', authErr);
    }
}

bootstrap().catch(e => {
    console.error("Bootstrap xatolik:", e);
});




// Typing Animation
const phrases = ['Medik', 'Dasturchi', 'Futbolchi'];
let currentPhraseIndex = 0;
let isDeleting = false;
let currentText = '';
function typeEffect() {
    const el = document.getElementById('typed-text');
    if(!el) return;
    const fullText = phrases[currentPhraseIndex];
    if (isDeleting) { currentText = fullText.substring(0, currentText.length - 1); }
    else { currentText = fullText.substring(0, currentText.length + 1); }
    el.textContent = currentText;
    let typeSpeed = isDeleting ? 100 : 300;
    if (!isDeleting && currentText === fullText) { typeSpeed = 2500; isDeleting = true; }
    else if (isDeleting && currentText === '') { isDeleting = false; currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; typeSpeed = 1000; }
    setTimeout(typeEffect, typeSpeed);
}
document.addEventListener('DOMContentLoaded', typeEffect);


setTimeout(typeEffect, 500);




// --- Missing Button Handlers Added ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const hamburgerMenu = document.getElementById('hamburger-menu');
if (hamburgerBtn && hamburgerMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburgerMenu.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
        }
    });
}

const loginBtn = document.getElementById('login-btn');
const authModal = document.getElementById('auth-modal');
const closeAuthModalBtn = document.getElementById('close-auth-modal');

window.openAuthModal = function(tab) {
    if (authModal) {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof initTelegramWidget === 'function') {
            initTelegramWidget();
        }
    }
};

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
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
            if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
        });
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
        if (password.length < 6) {
            if (errorEl) { errorEl.textContent = "Parol kamida 6 belgidan iborat bo'lishi kerak"; errorEl.style.display = 'block'; }
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
                result = await window.Auth.register(name, username, password);
            }

            if (result && result.ok) {
                // Muvaffaqiyat — sahifani yangilaymiz
                if (typeof showToast === 'function') {
                    showToast(loginMode ? "✅ Muvaffaqiyatli kirdingiz!" : "✅ Ro'yxatdan o'tdingiz!", 'success');
                }
                setTimeout(() => location.reload(), 600);
            } else {
                // Xatolik xabari
                const errMsg = (result && result.error) ? result.error : "Xatolik yuz berdi. Qayta urinib ko'ring.";
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

    // Dynamic Language Switching Handler
    document.addEventListener('langchange', () => {
        if (window.i18n && typeof i18n.applyStaticTranslations === 'function') {
            i18n.applyStaticTranslations();
        }
        const deutschView = document.getElementById('deutsch-view');
        if (deutschView && deutschView.style.display !== 'none') {
            if (typeof renderDeutschHome === 'function') renderDeutschHome();
        }
        if (typeof renderPosts === 'function') renderPosts();
    });

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
})();

// ===== 3D KUN IQTIBOSI (FORTUNE QUOTES ENGINE) =====
const FORTUNE_QUOTES = [
    {
        category: "🎯 STOYATSIZM",
        quote: "Mag'lubiyat to'xtaganingda sodir bo'ladi. Har kuni kichik bo'lsa ham qadam tashla!",
        author: "— Stoyatsizm Hikmati",
        de: "Es spielt keine Rolle, wie langsam du gehst, solange du nicht anhältst."
    },
    {
        category: "🏛️ MARKUS AURELIY",
        quote: "Sening hayoting sening fikrlaring qanday bo'lsa, shunday shakllanadi.",
        author: "— Markus Aureliy (Rim imperatori & faylasuf)",
        de: "Das Leben eines Menschen ist das, was seine Gedanken daraus machen."
    },
    {
        category: "🧠 SENEKA",
        quote: "Bizda vaqt kam emas, shunchaki biz foydalanmaydigan vaqt juda ko'p.",
        author: "— Seneka (Rim faylasufi)",
        de: "Es ist nicht zu wenig Zeit, die wir haben, sondern es ist zu viel Zeit, die wir nicht nutzen."
    },
    {
        category: "⚡ EPIKTET",
        quote: "Seni voqealar emas, balki u voqealarga bo'lgan munosabating tashvishga soladi.",
        author: "— Epiktet (Stoyik faylasuf)",
        de: "Nicht die Dinge selbst beunruhigen die Menschen, sondern die Vorstellungen von den Dingen."
    },
    {
        category: "💻 DASTURLASH",
        quote: "Muammoni avval tushunib yet, keyin kod yoz. Kod bu faqat fikrlash mahsulidir.",
        author: "— John Johnson (Dasturlash arxitektori)",
        de: "Erst das Problem verstehen, dann den Code schreiben."
    },
    {
        category: "💻 STEVE JOBS",
        quote: "Ajoyib ish qilishning yagona yo'li — qilayotgan ishingizni sevishdir.",
        author: "— Steve Jobs (Apple asoschisi)",
        de: "Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was man tut."
    },
    {
        category: "🚀 INTIZOM",
        quote: "Har kuni qilingan kichik harakatlar vaqt o'tishi bilan buyuk natijalarni beradi.",
        author: "— Robin Sharma (Rivojlanish ustozi)",
        de: "Kleine tägliche Verbesserungen führen im Laufe der Zeit zu erstaunlichen Ergebnissen."
    },
    {
        category: "🎯 GYOTE",
        quote: "Yo'lingizga qo'yilgan toshlardan ham chiroyli narsalar qurishingiz mumkin.",
        author: "— Johann Wolfgang von Goethe",
        de: "Auch aus Steinen, die einem in den Weg gelegt werden, kann man Schönes bauen."
    },
    {
        category: "💡 ALBERT EYNSHTEYN",
        quote: "Muvaffaqiyatli odam bo'lishga emas, balki qadrli odam bo'lishga intiling.",
        author: "— Albert Eynshteyn (Fizik olim)",
        de: "Versuche nicht, ein erfolgreicher, sondern ein wertvoller Mensch zu werden."
    },
    {
        category: "💻 LINUS TORVALDS",
        quote: "Gapirish oson. Menga kodni ko'rsat (Talk is cheap. Show me the code).",
        author: "— Linus Torvalds (Linux & Git yaratuvchisi)",
        de: "Reden ist billig. Zeig mir den Code."
    },
    {
        category: "🔥 CHIDAM",
        quote: "Meni o'ldirmagan narsa meni kuchliroq qiladi.",
        author: "— Friedrich Nietzsche (Faylasuf)",
        de: "Was mich nicht umbringt, macht mich starker."
    },
    {
        category: "🌱 MAQSAD",
        quote: "Qaysi portga suzishni bilmagan kapitan uchun hech qanday shamol qulay emas.",
        author: "— Seneka (Faylasuf)",
        de: "Wer den Hafen nicht kennt, in den er segeln will, für den ist kein Wind der richtige."
    },
    {
        category: "🎓 BILIM",
        quote: "Bilim — bu kuch, lekin amaliyotsiz u faqat potensial bo'lib qolaveradi.",
        author: "— Francis Bacon",
        de: "Wissen ist Macht, aber ohne Anwendung bleibt es nur Potenzial."
    },
    {
        category: "⚖️ ARISTOTEL",
        quote: "Biz qayta-qayta qilayotgan narsamizning o'zimizmiz. Mukammallik amaliyat emas, odatdir.",
        author: "— Aristotel (Yunon faylasufi)",
        de: "Wir sind das, was wir wiederholt tun. Vorzuglichkeit ist also eine Gewohnheit."
    },
    {
        category: "💻 BILL GATES",
        quote: "Ko'pchilik odamlar 1 yilda nima qila olishlarini oshirib yuborishadi, lekin 10 yilda nima qila olishlarini past baholaydilar.",
        author: "— Bill Gates (Microsoft asoschisi)",
        de: "Die meisten Menschen uberschatzen, was sie in einem Jahr tun konnen, und unterschatzen, was sie in 10 Jahren tun konnen."
    },
    {
        category: "🧭 KONFUTSIY",
        quote: "Qanchalik sekin yurishingiz muhim emas, muhimi to'xtab qolmasligingizda.",
        author: "— Konfutsiy (Faylasuf)",
        de: "Es spielt keine Rolle, wie langsam du gehst, solange du nicht anhaltst."
    },
    {
        category: "💡 NIKOLA TESLA",
        quote: "Koinot sirlarini tushunmoqchi bo'lsangiz, energiya, chastota va tebranishlar haqida o'ylang.",
        author: "— Nikola Tesla (Ixtirochi olim)",
        de: "Wenn du die Geheimnisse des Universums finden willst, denke in Begriffen von Energie, Frequenz und Schwingung."
    },
    {
        category: "💻 ALAN KAY",
        quote: "Kelajakni bashorat qilishning eng yaxshi yo'li — uni yaratishdir.",
        author: "— Alan Kay (Informatik olim)",
        de: "Die beste Moglichkeit, die Zukunft vorauszusagen, ist, sie zu erfinden."
    },
    {
        category: "🏆 DIQQAT VA FOKUS",
        quote: "G'oliblar diqqatini g'alabaga qaratadi, mag'lublar esa g'oliblarga.",
        author: "— Motivatsion Hikmat",
        de: "Gewinner konzentrieren sich auf das Gewinnen, Verlierer auf die Gewinner."
    },
    {
        category: "✨ VIZION",
        quote: "Tasavvur bilimdan muhimroqdir, chunki bilim cheklangan, tasavvur esa butun dunyoni qamrab oladi.",
        author: "— Albert Eynshteyn",
        de: "Phantasie ist wichtiger als Wissen, denn Wissen ist begrenzt."
    }
];

let currentQuoteIndex = 0;

function initFortuneQuotes() {
    const card = document.getElementById('fortune-card');
    const badge = document.getElementById('quote-category-badge');
    const qText = document.getElementById('quote-text');
    const qAuthor = document.getElementById('quote-author');
    const deText = document.getElementById('quote-de-text');
    const audioBtn = document.getElementById('quote-audio-btn');
    const nextBtn = document.getElementById('quote-next-btn');

    if (!card || !qText || !qAuthor) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('abdu_quote_today');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.date === todayStr && typeof parsed.idx === 'number' && FORTUNE_QUOTES[parsed.idx]) {
                currentQuoteIndex = parsed.idx;
            } else {
                currentQuoteIndex = Math.floor(Math.random() * FORTUNE_QUOTES.length);
                localStorage.setItem('abdu_quote_today', JSON.stringify({ date: todayStr, idx: currentQuoteIndex }));
            }
        } catch (e) {
            currentQuoteIndex = Math.floor(Math.random() * FORTUNE_QUOTES.length);
        }
    } else {
        currentQuoteIndex = Math.floor(Math.random() * FORTUNE_QUOTES.length);
        localStorage.setItem('abdu_quote_today', JSON.stringify({ date: todayStr, idx: currentQuoteIndex }));
    }

    function renderQuote(idx) {
        const item = FORTUNE_QUOTES[idx];
        if (!item) return;

        card.style.opacity = '0';
        card.style.transform = 'perspective(1000px) rotateX(15deg) translateY(10px)';

        setTimeout(() => {
            if (badge) badge.textContent = item.category || '💡 HIKMAT';
            qText.textContent = `"${item.quote}"`;
            qAuthor.textContent = item.author;
            if (deText) deText.textContent = `"${item.de || ''}"`;

            card.style.opacity = '1';
            card.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0deg)';
        }, 200);
    }

    renderQuote(currentQuoteIndex);

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentQuoteIndex = (currentQuoteIndex + 1 + Math.floor(Math.random() * (FORTUNE_QUOTES.length - 1))) % FORTUNE_QUOTES.length;
            renderQuote(currentQuoteIndex);
        });
    }

    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            const item = FORTUNE_QUOTES[currentQuoteIndex];
            if (!item || !window.speechSynthesis) return;

            window.speechSynthesis.cancel();
            
            const textToSpeak = item.de ? item.de : item.quote;
            const langCode = item.de ? 'de-DE' : 'uz-UZ';

            const utter = new SpeechSynthesisUtterance(textToSpeak);
            utter.lang = langCode;
            utter.rate = 0.9;
            window.speechSynthesis.speak(utter);
            
            audioBtn.textContent = '🔊 Ovoz berilmoqda...';
            utter.onend = () => { audioBtn.textContent = '🔊 Audio Eshitish'; };
            utter.onerror = () => { audioBtn.textContent = '🔊 Audio Eshitish'; };
        });
    }
}

// ===== LIVE STATS & MILESTONES COUNTER ENGINE =====
function initStatsCounters() {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const counters = statsSection.querySelectorAll('.stat-counter');
    if (!counters.length) return;

    let animated = false;

    function animateCounters() {
        if (animated) return;
        animated = true;

        const duration = 2000; // 2 seconds counting animation
        const startTime = performance.now();

        function update(now) {
            const elapsedTime = now - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            // Ease-out cubic formula for smooth deceleration
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target') || '0', 10);
                const currentValue = Math.floor(easeOutProgress * target);
                counter.textContent = currentValue.toLocaleString();
            });

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target') || '0', 10);
                    counter.textContent = target.toLocaleString();
                });
            }
        }

        requestAnimationFrame(update);
    }

    // IntersectionObserver to trigger counter when scrolled into view
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(statsSection);
    } else {
        // Fallback for browsers without IntersectionObserver support
        animateCounters();
    }
}

// ===== QUICK CONTACT FORM SUBMISSION ENGINE =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const contactInput = document.getElementById('contact-contact');
        const messageInput = document.getElementById('contact-message');
        const submitBtn = document.getElementById('contact-submit-btn');

        const name = nameInput ? nameInput.value.trim() : '';
        const contact = contactInput ? contactInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !contact || !message) {
            if (typeof showToast === 'function') {
                showToast("⚠️ Iltimos, barcha maydonlarni to'ldiring!", "warn");
            } else {
                alert("Iltimos, barcha maydonlarni to'ldiring!");
            }
            return;
        }

        // Disable submit button temporarily to prevent duplicate submissions
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
        }

        // Save message locally
        try {
            const savedMessages = safeJSONParse('abdu_contact_messages', []);
            savedMessages.push({
                id: Date.now(),
                name: name,
                contact: contact,
                message: message,
                date: new Date().toISOString()
            });
            localStorage.setItem('abdu_contact_messages', JSON.stringify(savedMessages));
        } catch (e) {
            console.error('Contact message save error:', e);
        }

        // Show toast notification
        if (typeof showToast === 'function') {
            showToast("✅ Xabaringiz muvaffaqiyatli yuborildi! Rahmat.", "success");
        }

        // Reset form inputs
        contactForm.reset();

        if (submitBtn) {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 800);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initContactForm();
        if (typeof initStatsCounters === 'function') initStatsCounters();
    });
} else {
    initContactForm();
    if (typeof initStatsCounters === 'function') initStatsCounters();
}



