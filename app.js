import { flashcardDecks } from './data-flashcards.js';
import { deutschTests } from './data-tests.js';

// Abdugofforov Blog & Portfolio - JavaScript Engine

// 1. Dastlabki Ma'lumotlar (Boshlang'ich Postlar)
// Boshlang'ich postlar yo'q — sayt toza boshlanadi.
// Postlar faqat admin panelidan (PIN + Telegram) yoziladi va serverda
// (Cloudflare KV) saqlanadi. Mehmonlar faqat o'qiydi.
const defaultPosts = [];

// State (Holat) - Abdugofforov rebrending kalitlari bilan boshlash
// posts endi IndexedDB (Store) orqali yuklanadi — bootstrap() ichida hydrate qilinadi.
let posts = defaultPosts;
let currentTab = 'home'; 
let filterType = 'none'; 
let searchQuery = '';
let editingPostId = null;
let isAdmin = sessionStorage.getItem('kay_admin') === 'true';

// Rejalar va Portfolio state
let tasks = JSON.parse(localStorage.getItem('abdu_tasks')) || [];
let portfolioInfo = JSON.parse(localStorage.getItem('abdu_portfolio')) || {
    name: "Abdugofforov",
    title: "",
    bio: "",
    skills: "",
    experience: ""
};
let portfolioTokens = JSON.parse(localStorage.getItem('abdu_portfolio_tokens')) || [];

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
        const lerpFactor = 0.12;
        followerX += (mouseX - followerX) * lerpFactor;
        followerY += (mouseY - followerY) * lerpFactor;

        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;

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

// 4. Ob-havo va Vaqt Vidjeti — animatsiyali zamonaviy soat
function updateClock() {
    const now = new Date();
    // Toshkent vaqti — qismlar
    const fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const parts = fmt.formatToParts(now).reduce((acc, p) => { if (p.type !== 'literal') acc[p.type] = p.value; return acc; }, {});
    const h = parts.hour || '00';
    const m = parts.minute || '00';
    const s = parts.second || '00';

    document.querySelectorAll('[data-clock="h"]').forEach(el => {
        if (el.textContent !== h) { el.textContent = h; el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); }
    });
    document.querySelectorAll('[data-clock="m"]').forEach(el => {
        if (el.textContent !== m) { el.textContent = m; el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); }
    });
    document.querySelectorAll('[data-clock="s"]').forEach(el => {
        el.textContent = s;
    });

    // Sana
    const dateOptions = { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' };
    const dateStr = now.toLocaleDateString('uz-UZ', dateOptions);
    document.querySelectorAll('#widget-date, .fc-date').forEach(el => {
        el.textContent = dateStr;
    });
}
setInterval(updateClock, 1000);
updateClock();

// (Ob-havo widgeti olib tashlandi — endi faqat soat/vaqt ko'rsatiladi)

// 5. Mavzuni boshqarish (Kunduzgi / Tungi rejim)
// Default: tungi (dark) — qora futuristic. Foydalanuvchi tanlovi saqlanadi.
function initTheme() {
    const savedTheme = localStorage.getItem('kay_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function updateThemeButton(theme) {
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Kunduzgi rejimga o\'tish' : 'Tungi rejimga o\'tish');
}

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('kay_theme', newTheme);
        updateThemeButton(newTheme);
        // Particles fonini yangi rejimga moslash (rang yorqinligi)
        if (typeof refreshParticlesTheme === 'function') refreshParticlesTheme();
    });
}

// 6. Ma'lumotlarni saqlash (IndexedDB orqali — katta sig'im) + serverga sinxronlash
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

    // Agar admin tizimga kirgan bo'lsa — postlarni umumiy serverga ham yuboramiz
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
            ? i18n.t('hero.subtitle.projects')
            : i18n.t('hero.subtitle');
    }
}

// 8. Postlarni filtrlash va render qilish
let _renderTimer = null;
function renderPosts(instant) {
    // Avvalgi kutilayotgan renderni bekor qilamiz (qidiruvda har bosishda chaqiriladi —
    // bu skeletonlar ustma-ust tushib miltillashining oldini oladi)
    if (_renderTimer) { clearTimeout(_renderTimer); _renderTimer = null; }

    const doRender = () => {
        _renderTimer = null;
        blogGrid.innerHTML = '';
        blogGrid.classList.remove('animate-fade-in');
        void blogGrid.offsetWidth;
        blogGrid.classList.add('animate-fade-in');

        const filtered = posts.filter(post => {
            // QIDIRUV REJIMI: matn kiritilgan bo'lsa, kategoriya/tab cheklovini
            // e'tiborsiz qoldirib, BARCHA postlar ichidan qidiramiz
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const fields = [post.title, post.excerpt, post.category, post.content, post.artist, post.author];
                return fields.some(f => typeof f === 'string' && f.toLowerCase().includes(q));
            }

            // Qidiruv yo'q — oddiy kategoriya/tab filtri
            // Default holat: hech narsa ko'rsatmaslik
            if (filterType === 'none') return false;

            // Tab navigatsiyasi
            if (currentTab === 'projects' && post.type !== 'project') return false;

            // Toolbar filtr tugmalari
            if (filterType !== 'all') {
                if (post.category.toLowerCase().replace(/[^a-z0-9]/g, '') !== filterType.toLowerCase().replace(/[^a-z0-9]/g, '')) return false;
            }

            return true;
        });

        if (filtered.length === 0) {
            blogGrid.innerHTML = `
                <div class="empty-state">
                    <span class="empty-state-icon">${searchQuery ? '🔍' : '📝'}</span>
                    <p class="empty-state-text">${searchQuery ? ('"' + escapeHTML(searchQuery) + '" bo\'yicha hech narsa topilmadi.') : "Hech qanday maqola yoki ma'lumot topilmadi."}</p>
                </div>
            `;
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
                        <span class="post-meta">🎵 ${escapeHTML(post.category)}</span>
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
                            <span class="post-date">${formatDate(post.date)} · ⏱ ${readingTime(post)}</span>
                            <div class="post-stats">
                                <div class="post-stat like-btn" data-id="${post.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${post.liked ? 'var(--accent-color)' : 'inherit'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>${post.likes}</span>
                                </div>
                                <div class="post-stat">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>${post.comments.length}</span>
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
                        <span class="post-meta">🖼️ ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
                        
                        <div class="post-footer">
                            <span class="post-date">${formatDate(post.date)} · ⏱ ${readingTime(post)}</span>
                            <div class="post-stats">
                                <div class="post-stat like-btn" data-id="${post.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${post.liked ? 'var(--accent-color)' : 'inherit'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>${post.likes}</span>
                                </div>
                                <div class="post-stat">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>${post.comments.length}</span>
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
                        <span class="post-meta">🎬 ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
                        <div class="post-footer">
                            <span class="post-date">${formatDate(post.date)} · ⏱ ${readingTime(post)}</span>
                            <div class="post-stats">
                                <div class="post-stat like-btn" data-id="${post.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${post.liked ? 'var(--accent-color)' : 'inherit'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>${post.likes}</span>
                                </div>
                                <div class="post-stat">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>${post.comments.length}</span>
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
                        <span class="post-meta">📝 ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
                        <div class="post-footer">
                            <span class="post-date">${formatDate(post.date)} · ⏱ ${readingTime(post)}</span>
                            <div class="post-stats">
                                <div class="post-stat like-btn" data-id="${post.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${post.liked ? 'var(--accent-color)' : 'inherit'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                    <span>${post.likes}</span>
                                </div>
                                <div class="post-stat">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span>${post.comments.length}</span>
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
                    // Havola yangi oynada ochiladi — batafsil oyna ochilmasin
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
    };

    // Qidiruvda darhol (skeletonsiz) ko'rsatamiz; aks holda yengil skeleton animatsiyasi
    if (instant) {
        doRender();
    } else {
        showSkeletons(3);
        _renderTimer = setTimeout(doRender, 400);
    }
} // <-- renderPosts funksiyasi shu yerda yopildi

// Ko'rinishlarni almashtirish yordamchilari
// (asosiy <-> deutsch <-> kartochka <-> turnir)
function hideAuxViews() {
    ['deutsch-view', 'flashcards-view', 'tournament-view'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

function showMainView() {
    hideAuxViews();
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = '';
    if (mainContent) mainContent.style.display = '';
}

function openDeutschView() {
    if (mainContent) mainContent.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    hideAuxViews();
    const deutschView = document.getElementById('deutsch-view');
    if (deutschView) deutschView.style.display = 'block';
    renderDeutschHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openFlashcardsView() {
    if (mainContent) mainContent.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    hideAuxViews();
    const flashView = document.getElementById('flashcards-view');
    if (flashView) flashView.style.display = 'block';
    renderFlashcardsHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openTournamentView() {
    if (mainContent) mainContent.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    hideAuxViews();
    const tView = document.getElementById('tournament-view');
    if (tView) tView.style.display = 'block';
    renderTournamentHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 9. SPA Routing Navigation
if (mainNav) {
    mainNav.addEventListener('click', (e) => {
        e.preventDefault();
        const link = e.target.closest('a');
        if (!link) return;

        if (link.id === 'nav-contact-link') {
            openContactModal();
            return;
        }

        showMainView();

        mainNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        
        currentTab = link.getAttribute('data-page');

        if (currentTab === 'projects') {
            filterType = 'project';
        } else {
            filterType = 'none';
        }

        filterTags.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));

        updateHeroContent();
        renderPosts();
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

if (navLogo && mainNav) {
    navLogo.addEventListener('click', (e) => {
        e.preventDefault();
        const homeLink = mainNav.querySelector('[data-page="home"]');
        if (homeLink) homeLink.click();
    });
}

// ===== DESKTOP DOCK NAVIGATION =====
const desktopDock = document.getElementById('desktop-dock');
if (desktopDock) {
    desktopDock.addEventListener('click', (e) => {
        e.preventDefault();
        const link = e.target.closest('a');
        if (!link) return;

        // Maxsus tugmalar
        if (link.id === 'dock-contact') {
            openContactModal();
            return;
        }
        if (link.id === 'dock-theme') {
            const themeBtn = document.getElementById('theme-btn');
            if (themeBtn) themeBtn.click();
            return;
        }
        if (link.id === 'dock-deutsch') {
            openDeutschView();
            syncActiveNavState('deutsch');
            return;
        }
        
        // Blog tugmasi (Asosiy sahifaga o'tadi)
        let page = link.getAttribute('data-page');
        if (page === 'blog') page = 'home'; // Blog aslida home

        showMainView();

        // Active state sinxronlash (dock va main-nav)
        syncActiveNavState(page);
        
        currentTab = page;
        filterType = (page === 'projects') ? 'project' : 'none';

        filterTags.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));

        updateHeroContent();
        renderPosts();
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

// ===== HAMBURGER MENYU (eski mobil drawer) — endi nav linklar doim tepada
// turadi, drawer kerak emas. DOM elementlari yo'q bo'lsa, xavfsiz tarzda
// hech narsa qilmaymiz.
const hamburgerBtn = document.getElementById('hamburger-btn');
const navRight = document.getElementById('nav-right');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMobileMenu() { /* deprecated */ }
function closeMobileMenu() { /* deprecated */ }

if (hamburgerBtn && navRight && mobileOverlay) {
    hamburgerBtn.addEventListener('click', () => {
        navRight.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
    mobileOverlay.addEventListener('click', closeMobileMenu);
    // Nav link bosilganda menyu yopilsin
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
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

filterTags.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-tag');
    if (!btn) return;

    // Deutsch tugmasi — filtr emas, test sahifasini ochadi
    if (btn.id === 'deutsch-tag-btn') {
        openDeutschView();
        return;
    }

    // Kartochka tugmasi — flashcards sahifasini ochadi
    if (btn.id === 'flashcards-tag-btn') {
        openFlashcardsView();
        return;
    }

    // Turnir tugmasi — turnir sahifasini ochadi
    if (btn.id === 'tournament-tag-btn') {
        if (typeof openTournamentView === 'function') openTournamentView();
        return;
    }

    showMainView();

    // Kategoriya tanlanganda jonli qidiruvni tozalaymiz (chalkashmaslik uchun)
    searchQuery = '';
    if (searchInput) searchInput.value = '';

    filterTags.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
    btn.classList.add('active');

    filterType = btn.getAttribute('data-filter');
    renderPosts();
});

// ===== JONLI QIDIRUV (live search) =====
// Foydalanuvchi yozishni boshlashi bilan, barcha postlar (kundalik) ichidan
// sarlavha/qisqacha/kategoriya/matn bo'yicha darhol qidiradi.
// Eslatma: qidiruv FAQAT public postlar ichidan boradi — admin paneli (kay.html)
// alohida sahifa, uning kontenti va so'zlari bu yerga umuman kirmaydi.
let _searchTimer = null;

function showBlogResultsView() {
    if (typeof hideAuxViews === 'function') hideAuxViews();
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = '';
    if (mainContent) mainContent.style.display = '';
}

searchInput.addEventListener('input', (e) => {
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
            if (!activeBtn) filterType = 'none';
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
            <span class="post-meta">${escapeHTML(post.category)}</span>
            <h1 class="modal-post-title">${escapeHTML(post.title)}</h1>
            <div class="modal-post-meta">
                <span>📅 ${formatDate(post.date)}</span>
                <span>⏱ ${readingTime(post)}</span>
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

        <div class="modal-post-text">${post.type === 'music' ? escapeHTML(post.content || post.excerpt) : escapeHTML(post.content)}</div>
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
            document.getElementById('post-category-input').value = post.category || '';
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
        history.pushState({ post: post.id }, '', `?post=${post.id}`);
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
                history.pushState({}, '', location.pathname);
            }
        } catch (e) { /* o'tkazib yuboriladi */ }
        setMeta(DEFAULT_TITLE, DEFAULT_DESC);
    }
}

closeDetailModal.addEventListener('click', closePostDetailModal);
postDetailModal.addEventListener('click', (e) => {
    if (e.target === postDetailModal) closePostDetailModal();
});

// 11. Yangi Post Qo'shish / Tahrirlash Formasi
addPostBtn.addEventListener('click', () => {
    editingPostId = null;
    addPostModal.querySelector('.write-title').textContent = "Yangi sahifa yaratish";
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

closeAddModal.addEventListener('click', closeAddPostModal);
cancelAddBtn.addEventListener('click', closeAddPostModal);
addPostModal.addEventListener('click', (e) => {
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
const postMusicGroup = document.getElementById('post-music-group');
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

newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title-input').value.trim();
    const category = document.getElementById('post-category-input').value.trim();
    const excerpt = document.getElementById('post-excerpt-input').value.trim();
    const content = document.getElementById('post-content-input').value.trim();
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
        if (pinModal) pinModal.classList.add('active');
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
    document.getElementById('port-display-name').textContent = portfolioInfo.name;
    document.getElementById('port-display-title').textContent = portfolioInfo.title;
    document.getElementById('port-display-bio').textContent = portfolioInfo.bio;

    const skillsList = document.getElementById('port-display-skills');
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

    const expDiv = document.getElementById('port-display-experience');
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

// Tokenni tekshirish
function checkPortfolioAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        const tokenIndex = portfolioTokens.indexOf(token);
        if (tokenIndex !== -1) {
            // Bir martalik kirish: token o'chiriladi
            portfolioTokens.splice(tokenIndex, 1);
            localStorage.setItem('abdu_portfolio_tokens', JSON.stringify(portfolioTokens));

            renderPortfolioView();
            
            // Portfolioni ko'rsatish
            document.querySelector('.hero').style.display = 'none';
            mainContent.style.display = 'none';
            document.querySelector('.footer').style.display = 'none';
            portfolioView.style.display = 'block';

            // Sichqonchani portfolio rejimiga (qizil neon) o'tkazish
            const follower = document.getElementById('cursor-follower');
            if (follower) {
                follower.classList.add('portfolio-mode');
            }
        } else {
            // Eskirgan token
            document.querySelector('.hero').style.display = 'none';
            mainContent.style.display = 'none';
            document.querySelector('.footer').style.display = 'none';
            
            portfolioView.innerHTML = `
                <div class="portfolio-expired animate-fade-in" style="background:#000; min-height:80vh; display:flex; flex-direction:column; justify-content:center; align-items:center; border-radius:24px;">
                    <span style="font-size: 64px; display: block; margin-bottom: 20px;">🔒</span>
                    <h2 style="color:#ff4d4d; font-family:'Playfair Display', serif;">Ushbu kirish havolasi eskirgan!</h2>
                    <p style="color:#626a7f;">Xavfsizlik maqsadida ushbu portfolio havolasi faqat bir martalik foydalanish uchun mo'ljallangan.</p>
                    <button class="btn-primary" onclick="window.location.href = window.location.pathname" style="margin-top: 25px; border-color:#00ff88; color:#00ff88; background:transparent;">Bosh sahifaga o'tish</button>
                </div>
            `;
            portfolioView.style.display = 'block';
        }
    }
}

closePortfolioBtn.addEventListener('click', () => {
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

// ===== KARTOCHKALAR HOLATI VA KO'RINISHI =====
let fcDeckKey = null;
let fcOrder = [];
let fcIndex = 0;

function renderFlashcardsHome() {
    const view = document.getElementById('flashcards-content');
    if (!view) return;
    const decks = [
        { key: 'de_uz', i: 'deck.de_uz' },
        { key: 'uz_de', i: 'deck.uz_de' },
        { key: 'grammar', i: 'deck.grammar' },
        { key: 'sentences', i: 'deck.sentences' },
        { key: 'quotes', i: 'deck.quotes' }
    ];
    view.innerHTML = `
        <div style="text-align:center; margin-bottom:36px;">
            <div style="font-size:48px; margin-bottom:12px;">🃏</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">${i18n.t('fc.title')}</h2>
            <p style="color:var(--text-secondary);">${i18n.t('fc.subtitle')}</p>
            <div style="margin-top:14px; display:inline-flex; gap:10px; align-items:center; background:var(--tag-bg); padding:8px 16px; border-radius:30px; font-size:13px;">
                🔥 <b>${getFcStreak()}</b> kunlik streak
            </div>
        </div>
        <div class="fc-deck-grid">
            ${decks.map(d => `
                <div class="post-card fc-deck-card" onclick="startFlashcards('${d.key}')">
                    <div class="fc-deck-emoji">${i18n.t(d.i).split(' ')[0]}</div>
                    <h3>${i18n.t(d.i)}</h3>
                    <span class="fc-deck-count">${fcMasteredCount(d.key)} / ${flashcardDecks[d.key].length}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function startFlashcards(key) {
    if (!flashcardDecks[key]) return;
    fcDeckKey = key;
    // Spaced repetition: muddati kelgan (yoki yangi) kartalar oldinga
    const prog = fcProgress();
    const now = Date.now();
    const idxs = flashcardDecks[key].map((_, i) => i);
    idxs.sort((a, bb) => {
        const da = (prog[fcCardKey(key, a)] && prog[fcCardKey(key, a)].due) || 0;
        const db = (prog[fcCardKey(key, bb)] && prog[fcCardKey(key, bb)].due) || 0;
        const ka = da <= now ? 0 : da;
        const kb = db <= now ? 0 : db;
        return ka - kb;
    });
    fcOrder = idxs;
    fcIndex = 0;
    renderFlashcard();
}

function renderFlashcard() {
    const view = document.getElementById('flashcards-content');
    const deck = flashcardDecks[fcDeckKey];
    if (!view || !deck) { renderFlashcardsHome(); return; }
    const card = deck[fcOrder[fcIndex]];
    view.innerHTML = `
        <div style="max-width:560px; margin:0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:10px;">
                <button class="btn-secondary btn-sm" onclick="renderFlashcardsHome()">${i18n.t('fc.back')}</button>
                <span style="color:var(--text-muted); font-size:13px;">🔥 ${getFcStreak()} &nbsp;·&nbsp; ${fcIndex + 1} / ${deck.length}</span>
                <button class="btn-secondary btn-sm" onclick="shuffleFlashcards()">${i18n.t('fc.shuffle')}</button>
            </div>
            <div class="flashcard" id="flashcard">
                <div class="flashcard-inner">
                    <div class="flashcard-face flashcard-front">
                        <div class="fc-text">${escapeHTML(card.front)}</div>
                        <span class="fc-hint">${i18n.t('fc.tapHint')}</span>
                    </div>
                    <div class="flashcard-face flashcard-back">
                        <div class="fc-text">${escapeHTML(card.back)}</div>
                    </div>
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px; margin-top:18px;">
                <button class="btn-secondary" onclick="prevFlashcard()">${i18n.t('fc.prev')}</button>
                <button class="btn-primary" onclick="flipFlashcard()">${i18n.t('fc.flip')}</button>
                <button class="btn-secondary" onclick="nextFlashcard()">${i18n.t('fc.next')}</button>
            </div>
            <div style="display:flex; gap:12px; margin-top:12px;">
                <button class="btn-secondary" style="flex:1; border-color:rgba(248,113,113,0.4); color:#ef4444;" onclick="fcAnswer(false)">✗ Bilmayman</button>
                <button class="btn-primary" style="flex:1; background:#22c55e; border-color:#22c55e; color:#fff;" onclick="fcAnswer(true)">✓ Bilaman</button>
            </div>
        </div>
    `;
    const fcEl = document.getElementById('flashcard');
    if (fcEl) fcEl.addEventListener('click', flipFlashcard);
}

function flipFlashcard() {
    const fc = document.getElementById('flashcard');
    if (fc) fc.classList.toggle('flipped');
}

function nextFlashcard() {
    const deck = flashcardDecks[fcDeckKey];
    if (!deck) return;
    fcIndex = (fcIndex + 1) % deck.length;
    renderFlashcard();
}

function prevFlashcard() {
    const deck = flashcardDecks[fcDeckKey];
    if (!deck) return;
    fcIndex = (fcIndex - 1 + deck.length) % deck.length;
    renderFlashcard();
}

function shuffleFlashcards() {
    for (let i = fcOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fcOrder[i], fcOrder[j]] = [fcOrder[j], fcOrder[i]];
    }
    fcIndex = 0;
    renderFlashcard();
}

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
    if (navigator.share) {
        navigator.share({ title: post.title, text: post.excerpt || '', url }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => alert('Havola nusxalandi:\n' + url)).catch(() => prompt('Havola:', url));
    } else {
        prompt('Havola:', url);
    }
}

// ===== O'QISH VAQTI VA TEGLAR =====
function escapeAttr(s) { return String(s || '').replace(/['"\\<>&]/g, ''); }

function readingTime(post) {
    const text = ((post.content || '') + ' ' + (post.excerpt || '')).trim();
    const words = text ? text.split(/\s+/).length : 0;
    return Math.max(1, Math.round(words / 180)) + ' daqiqa';
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
    filterType = 'all';
    searchQuery = tag;
    const si = document.getElementById('search-input');
    if (si) si.value = tag;
    document.querySelectorAll('#filter-tags .filter-tag').forEach(t => t.classList.remove('active'));
    document.querySelector('#filter-tags [data-filter="all"]')?.classList.add('active');
    renderPosts();
    window.scrollTo({ top: 220, behavior: 'smooth' });
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
function saveTestResult(level, score, total) {
    const hist = JSON.parse(localStorage.getItem('deutsch_history') || '[]');
    hist.unshift({ level, score, total, pct: total ? Math.round(score / total * 100) : 0, date: new Date().toISOString() });
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
            <span style="width:70px;text-align:right;color:var(--text-secondary);">${h.score}/${h.total} · ${h.pct}%</span>
            <span style="width:56px;text-align:right;color:var(--text-muted);font-size:11px;">${d}</span>
        </div>`;
    }).join('');
    return `<div class="post-card" style="max-width:680px;margin:30px auto 0;padding:22px;">
        <h3 style="font-size:16px;margin-bottom:12px;">📈 Sizning natijalaringiz</h3>
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
            <div style="font-size:60px;margin-bottom:14px;">🎉</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:26px;margin-bottom:8px;">To'plam yakunlandi!</h2>
            <p style="color:var(--text-secondary);margin-bottom:24px;">O'zlashtirildi: <b>${mastered}/${total}</b> &nbsp;·&nbsp; 🔥 Streak: <b>${getFcStreak()} kun</b></p>
            <div style="display:flex;gap:12px;justify-content:center;">
                <button class="btn-primary" onclick="startFlashcards('${fcDeckKey}')">🔄 Qayta</button>
                <button class="btn-secondary" onclick="renderFlashcardsHome()">${i18n.t('fc.back')}</button>
            </div>
        </div>`;
}

// ===== HERO PARTICLES (Canvas API) =====
// Mayda nuqtalar suzib yuradi, sichqonchaga react qiladi, yaqinlashganda chiziq tortadi
function createParticleCanvas(canvasId, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return null;

    const count = options.count || (isMobile ? 40 : 90);
    const linkDist = options.linkDist || (isMobile ? 80 : 120);
    const speed = options.speed || 0.4;
    const maxSpeed = options.maxSpeed || 1;
    const particleRadius = options.particleRadius || { min: 0.6, range: 1.6 };
    const baseAlpha = options.baseAlpha || { min: 0.45, range: 0.35 };
    const linkAlpha = options.linkAlpha || 0.25;
    const enableMouse = options.enableMouse !== false;

    let particles = [];
    let mouse = { x: -9999, y: -9999, active: false };
    let raf = null;

    function size() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function spawn() {
        particles = [];
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        for (let i = 0; i < count; i++) {
            const useBlue = Math.random() > 0.5;
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                r: Math.random() * particleRadius.range + particleRadius.min,
                color: useBlue ? '59, 130, 246' : '139, 92, 246',
                a: baseAlpha.min + Math.random() * baseAlpha.range,
            });
        }
    }

    function step() {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
            if (enableMouse && mouse.active) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 120 * 120) {
                    const d = Math.sqrt(d2) || 1;
                    p.vx += (dx / d) * 0.06;
                    p.vy += (dy / d) * 0.06;
                }
            }
            p.x += p.vx; p.y += p.vy;
            p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx * 0.99));
            p.vy = Math.max(-maxSpeed, Math.min(maxSpeed, p.vy * 0.99));
            if (p.x < 0) { p.x = 0; p.vx *= -1; }
            else if (p.x > w) { p.x = w; p.vx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; }
            else if (p.y > h) { p.y = h; p.vy *= -1; }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.a})`;
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < linkDist * linkDist) {
                    const alpha = (1 - Math.sqrt(d2) / linkDist) * linkAlpha;
                    ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        raf = requestAnimationFrame(step);
    }

    function onMove(e) {
        const rect = canvas.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        mouse.x = t.clientX - rect.left;
        mouse.y = t.clientY - rect.top;
        mouse.active = true;
    }
    function onLeave() { mouse.active = false; }

    size();
    spawn();
    step();
    window.addEventListener('resize', () => { size(); spawn(); }, { passive: true });

    if (enableMouse) {
        canvas.parentElement.addEventListener('mousemove', onMove);
        canvas.parentElement.addEventListener('mouseleave', onLeave);
        canvas.parentElement.addEventListener('touchmove', onMove, { passive: true });
    }

    return () => { if (raf) cancelAnimationFrame(raf); };
}

function initParticles() {
    return createParticleCanvas('particles-canvas', {
        count: window.matchMedia('(max-width: 768px)').matches ? 40 : 90,
        linkDist: window.matchMedia('(max-width: 768px)').matches ? 80 : 120,
        speed: 0.4,
        maxSpeed: 1,
        particleRadius: { min: 0.6, range: 1.6 },
        baseAlpha: { min: 0.45, range: 0.35 },
        linkAlpha: 0.25,
        enableMouse: true
    });
}

// ===== FOOTER PARTICLES (Canvas API) =====
function initFooterParticles() {
    return createParticleCanvas('footer-particles-canvas', {
        count: window.matchMedia('(max-width: 768px)').matches ? 20 : 50,
        linkDist: window.matchMedia('(max-width: 768px)').matches ? 80 : 110,
        speed: 0.3,
        maxSpeed: 0.8,
        particleRadius: { min: 0.5, range: 1.4 },
        baseAlpha: { min: 0.35, range: 0.3 },
        linkAlpha: 0.2,
        enableMouse: false
    });
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

async function bootstrap() {
    // 3D kirish animatsiyasi darhol boshlanadi
    initIntroSplash();

    // Til (i18n) — statik tarjimalar va til tanlagich
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
                // Serverdagi versiya birlamchi
                posts = serverPosts;
                Store.set('abdu_posts', posts); // mahalliyga ham keshlaymiz
            } else if (stored && Array.isArray(stored) && stored.length) {
                posts = stored;
            } else {
                posts = defaultPosts;
                Store.set('abdu_posts', posts);
            }
        } else {
            if (serverPosts && serverPosts.length) {
                posts = serverPosts;
                try { localStorage.setItem('abdu_posts', JSON.stringify(posts)); } catch (e) {}
            } else {
                const ls = JSON.parse(localStorage.getItem('abdu_posts') || 'null');
                posts = (ls && ls.length) ? ls : defaultPosts;
            }
        }
    } catch (e) {
        console.error('Xotira yuklashda xato, standart postlar ishlatiladi:', e);
        const ls = JSON.parse(localStorage.getItem('abdu_posts') || 'null');
        posts = (ls && ls.length) ? ls : defaultPosts;
    }

    // Admin holatini tiklash — sahifa yangilanganda ham admin tugmalari
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

    // Yangi: hero particles + footer particles + CTA tugmasi + 3D tilt + Floating +
    // initParticles(); // Performance optimization
    // initFooterParticles(); // Performance optimization
    initCarousel();
    initHeroCta();
    // init3DTilt(); // Performance optimization
    initFloatingAddBtn();

    // O'quvchi auth — token bo'lsa tiklaymiz, UI'ni yangilaymiz
    initAuthUI();
    if (window.Auth) {
        await Auth.restore();
        updateAuthUI();
    }
}

bootstrap();


// ===== DEUTSCH TESTLAR =====
// Rasmli savollar uchun ishonchli, o'rnatilgan (data URI) emoji-rasm — tashqi havola talab qilmaydi
function emojiImage(emoji, bg) {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'>"
        + "<rect width='100%' height='100%' fill='" + (bg || '#f3efe0') + "'/>"
        + "<text x='50%' y='53%' font-size='130' text-anchor='middle' dominant-baseline='central'>" + emoji + "</text>"
        + "</svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// ============================================================
// DEUTSCH TESTLAR — 3 daraja, har birida 3 ta to'plam, 10 ta savol
// A1: a1_t1, a1_t2, a1_t3   (A1 — Boshlang'ich)
// A2: a2_t1, a2_t2, a2_t3   (A2 — Asosiy)
// B1: b1_t1, b1_t2, b1_t3   (B1 — O'rta)
// Jami: 9 ta to'plam × 10 ta savol = 90 ta savol
// ============================================================
// ===== DEUTSCH TESTS MOVED TO data-tests.js =====

// Test holati
let currentTest = null;
let currentLevel = 'a1_t1';
let currentSection = 0;
let currentQuestion = 0;
let score = 0;
let answered = false;

function renderDeutschHome() {
    const view = document.getElementById('deutsch-content');

    // Darajalar va ularning to'plamlari (har birida 10 ta savol)
    const levels = [
        {
            key: 'A1', icon: '🌱', label: "A1 — Boshlang'ich daraja",
            sub: "Salomlashish, raqamlar, asosiy so'zlar",
            tests: [
                { id: 'a1_t1', name: "1-to'plam", note: "Eshitish + matn" },
                { id: 'a1_t2', name: "2-to'plam", note: "Matn + rasm" },
                { id: 'a1_t3', name: "3-to'plam", note: "So'z + grammatika" }
            ]
        },
        {
            key: 'A2', icon: '🌿', label: "A2 — Asosiy daraja",
            sub: "Perfekt, modal fe'llar, predloglar",
            tests: [
                { id: 'a2_t1', name: "1-to'plam", note: "Grammatika asoslari" },
                { id: 'a2_t2', name: "2-to'plam", note: "Predloglar va fe'llar" },
                { id: 'a2_t3', name: "3-to'plam", note: "Bog'lovchilar va qiyos" }
            ]
        },
        {
            key: 'B1', icon: '🌳', label: "B1 — O'rta daraja",
            sub: "Konjunktiv, Passiv, nisbiy gaplar",
            tests: [
                { id: 'b1_t1', name: "1-to'plam", note: "Konjunktiv va Passiv" },
                { id: 'b1_t2', name: "2-to'plam", note: "Bog'lovchi va nisbiy gap" },
                { id: 'b1_t3', name: "3-to'plam", note: "Genitiv va iboralar" }
            ]
        }
    ];

    // Har bir savol soni 10 ta — etibordan chetda qolmasin
    function countQs(testId) {
        const t = deutschTests[testId];
        if (!t) return 0;
        return t.parts.reduce((s, p) => s + p.sections.reduce((s2, sec) => s2 + sec.questions.length, 0), 0);
    }

    const levelsHTML = levels.map(lv => {
        const cards = lv.tests.map(t => {
            const qCount = countQs(t.id);
            return `
                <button class="test-card" onclick="startTest('${t.id}')">
                    <div class="test-card-head">
                        <span class="test-card-name">${t.name}</span>
                        <span class="test-card-badge">${qCount} savol</span>
                    </div>
                    <div class="test-card-note">${t.note}</div>
                    <div class="test-card-cta">Boshlash &rarr;</div>
                </button>`;
        }).join('');
        return `
            <section class="level-block">
                <header class="level-head">
                    <span class="level-icon">${lv.icon}</span>
                    <div>
                        <h3 class="level-title">${lv.label}</h3>
                        <p class="level-sub">${lv.sub}</p>
                    </div>
                </header>
                <div class="test-grid">${cards}</div>
            </section>`;
    }).join('');

    view.innerHTML = `
        <div class="deutsch-hero">
            <div class="deutsch-flag">🇩🇪</div>
            <h2 class="deutsch-title">Nemis tili testlari</h2>
            <p class="deutsch-sub">3 daraja &middot; har birida 3 to'plam &middot; jami 9 ta test</p>
        </div>
        <div class="levels-stack">
            ${levelsHTML}
        </div>
        ${renderTestHistory()}
    `;
}

let currentPart = 0;

function startTest(level) {
    currentTest = deutschTests[level];
    if (!currentTest) return;
    currentLevel = level;
    currentPart = 0;
    currentSection = 0;
    currentQuestion = 0;
    score = 0;
    answered = false;
    renderPartIntro();
}

function renderPartIntro() {
    const part = currentTest.parts[currentPart];
    if (!part) { renderTestResult(); return; }
    const totalQ = part.sections.reduce((s,sec) => s + sec.questions.length, 0);
    const audioNote = currentPart === 1
        ? '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:24px;">Har bir savol uchun nemischa ovoz avtomatik o\'qiladi</p>'
        : '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:24px;">Rasmlar va matnli savollar</p>';
    document.getElementById('deutsch-content').innerHTML =
        '<div style="max-width:480px; margin:0 auto; text-align:center; padding:20px 0;">'
        + '<div style="font-size:48px; margin-bottom:16px;">' + part.icon + '</div>'
        + '<h2 style="font-family:\'Playfair Display\',serif; font-size:24px; margin-bottom:8px;">' + part.name + '</h2>'
        + '<p style="color:var(--text-secondary); margin-bottom:8px;">' + totalQ + ' ta savol</p>'
        + audioNote
        + '<button onclick="startPart()" class="btn-primary" style="padding:14px 32px; font-size:16px;">Boshlash &rarr;</button>'
        + '</div>';
}

function startPart() {
    currentSection = 0;
    currentQuestion = 0;
    renderQuestion();
}

function speakText(text, lang) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang || 'de-DE';
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
}

function renderQuestion() {
    const part = currentTest.parts[currentPart];
    if (!part) { renderTestResult(); return; }
    const section = part.sections[currentSection];
    if (!section) { renderTestResult(); return; }
    const q = section.questions[currentQuestion];
    if (!q) { renderTestResult(); return; }

    const totalQ = part.sections.reduce((s,sec) => s + sec.questions.length, 0);
    const doneQ = part.sections.slice(0, currentSection).reduce((s,sec) => s + sec.questions.length, 0) + currentQuestion;
    const pct = Math.round((doneQ / totalQ) * 100);
    const isLastSection = currentSection === part.sections.length-1;
    const isLast = isLastSection && currentQuestion === section.questions.length-1;
    const sectionType = section.type || 'text';

    // Savol qismi — turga qarab
    let questionHTML = '';
    if (sectionType === 'image' || sectionType === 'image_reverse') {
        questionHTML = `
            <div class="post-card" style="padding:0; overflow:hidden; margin-bottom:16px;">
                <img src="${q.image}" alt="${q.imageAlt}" loading="lazy" decoding="async"
                    style="width:100%; height:200px; object-fit:cover; display:block;">
                <div style="padding:20px;">
                    <p style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--accent-color); margin-bottom:8px;">Savol ${doneQ+1}</p>
                    <h3 style="font-size:17px; line-height:1.5; margin:0;">${q.q}</h3>
                </div>
            </div>`;
    } else if (sectionType === 'audio') {
        questionHTML = `
            <div class="post-card" style="padding:28px; margin-bottom:16px; text-align:center;">
                <p style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--accent-color); margin-bottom:16px;">Savol ${doneQ+1} — 🔊 Hören</p>
                <div style="background:var(--tag-bg); border-radius:16px; padding:24px; margin-bottom:16px;">
                    <div style="font-size:22px; font-weight:700; color:var(--text-primary); margin-bottom:16px; font-family:'Playfair Display',serif;">
                        ${q.displayWord}
                    </div>
                    <button onclick="speakText('${q.audio}', '${q.audioLang}')"
                        style="background:var(--accent-color); color:#000; border:none; border-radius:50px;
                        padding:12px 28px; font-size:15px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
                        🔊 Eshitish
                    </button>
                </div>
                <p style="font-size:14px; color:var(--text-secondary);">${q.q}</p>
            </div>`;
        // Avtomatik o'qish
        setTimeout(() => speakText(q.audio, q.audioLang), 300);
    } else {
        questionHTML = `
            <div class="post-card" style="padding:28px; margin-bottom:16px;">
                <p style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--accent-color); margin-bottom:12px;">Savol ${doneQ+1}</p>
                <h3 style="font-size:18px; line-height:1.5; margin:0;">${q.q}</h3>
            </div>`;
    }

    const nextLabel = isLast ? "Natijani ko'rish 🏁" : 'Keyingi savol \u2192';
    const optionsHTML = q.options.map((opt, i) =>
        `<button onclick="checkAnswer(${i})" id="opt-${i}"
            style="text-align:left; padding:14px 18px; border-radius:12px; border:1px solid var(--border-color);
            background:var(--card-bg); color:var(--text-primary); cursor:pointer; font-size:15px;
            transition:all 0.2s; display:flex; align-items:center; gap:12px;">
            <span style="width:28px; height:28px; border-radius:50%; background:var(--tag-bg);
            display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0;">
                ${['A','B','C','D'][i]}
            </span>
            ${opt}
        </button>`
    ).join('');

    document.getElementById('deutsch-content').innerHTML = `
        <div style="max-width:640px; margin:0 auto;">
            <div style="margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:13px; color:var(--text-secondary);">${section.name}</span>
                    <span style="font-size:13px; color:var(--text-secondary);">${doneQ+1} / ${totalQ}</span>
                </div>
                <div style="height:4px; background:var(--border-color); border-radius:2px;">
                    <div style="height:4px; background:var(--accent-color); border-radius:2px; width:${pct}%; transition:width 0.3s;"></div>
                </div>
            </div>
            ${questionHTML}
            <div id="options-list" style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                ${optionsHTML}
            </div>
            <div id="explanation-box" style="display:none;"></div>
            <div id="next-btn-wrap" style="display:none; text-align:right; margin-top:16px;">
                <button onclick="nextQuestion()" class="btn-primary">${nextLabel}</button>
            </div>
        </div>
    `;
    answered = false;
}

function checkAnswer(selected) {
    if (answered) return;
    answered = true;

    const section = currentTest.parts[currentPart].sections[currentSection];
    const q = section.questions[currentQuestion];
    const isCorrect = selected === q.answer;
    if (isCorrect) score++;

    // Tugmalar rangini o'zgartirish
    q.options.forEach((_, i) => {
        const btn = document.getElementById('opt-' + i);
        btn.style.cursor = 'default';
        if (i === q.answer) {
            btn.style.background = 'rgba(34,197,94,0.15)';
            btn.style.borderColor = '#22c55e';
            btn.style.color = '#22c55e';
        } else if (i === selected && !isCorrect) {
            btn.style.background = 'rgba(239,68,68,0.15)';
            btn.style.borderColor = '#ef4444';
            btn.style.color = '#ef4444';
        }
    });

    // Izoh
    const box = document.getElementById('explanation-box');
    box.style.display = 'block';
    box.innerHTML = `
        <div style="padding:16px 20px; border-radius:12px; border:1px solid ${isCorrect ? '#22c55e' : '#ef4444'};
            background:${isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'};">
            <p style="font-weight:600; margin-bottom:6px; color:${isCorrect ? '#22c55e' : '#ef4444'};">
                ${isCorrect ? '✅ To\u02BBg\u02BBri!' : '❌ Noto\u02BBg\u02BBri'}
            </p>
            <p style="font-size:14px; color:var(--text-primary); line-height:1.6;">💡 ${q.explanation}</p>
        </div>
    `;

    document.getElementById('next-btn-wrap').style.display = 'block';
}

function nextQuestion() {
    const part = currentTest.parts[currentPart];
    const section = part.sections[currentSection];
    currentQuestion++;
    if (currentQuestion >= section.questions.length) {
        currentSection++;
        currentQuestion = 0;
        if (currentSection >= part.sections.length) {
            // Qism tugadi
            currentPart++;
            currentSection = 0;
            if (currentPart >= currentTest.parts.length) {
                renderTestResult();
            } else {
                renderPartIntro();
            }
            return;
        }
    }
    renderQuestion();
}

function renderTestResult() {
    const total = currentTest.parts.reduce((s,part) => s + part.sections.reduce((s2,sec) => s2 + sec.questions.length, 0), 0);
    const pct = total ? Math.round((score / total) * 100) : 0;
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
    const levelName = (currentTest && currentTest.title) ? currentTest.title : 'test';
    const msg = pct >= 80 ? "Ajoyib natija! Bu darajani yaxshi egallabsiz." 
              : pct >= 60 ? "Yaxshi! Bir oz mashq qilsangiz mukammal boʻladi."
              : "Qoʻrqmang! Qayta oʻrganib, yana sinab koʻring.";

    // Natijani tarixga saqlaymiz (lokal)
    saveTestResult(currentLevel, score, total);

    // Login bo'lgan o'quvchi natijasini serverga ham yuboramiz (admin ko'radi)
    if (window.Auth && Auth.isLoggedIn()) {
        Auth.submitResult({ testId: currentLevel, testTitle: levelName, score: score, total: total })
            .then(r => { if (r && r.ok) showToast('📊 Natija saqlandi', 'success'); });
    }

    document.getElementById('deutsch-content').innerHTML = `
        <div style="max-width:480px; margin:0 auto; text-align:center;">
            <div style="font-size:64px; margin-bottom:16px;">${emoji}</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">Test yakunlandi!</h2>
            <p style="font-size:13px; color:var(--accent-color); margin-bottom:4px; text-transform:uppercase; letter-spacing:1px;">${levelName}</p>
            <p style="color:var(--text-secondary); margin-bottom:32px;">${msg}</p>

            <div class="post-card" style="padding:32px; margin-bottom:24px;">
                <div style="font-size:52px; font-weight:700; color:var(--accent-color); font-family:'Playfair Display',serif;">
                    ${score}/${total}
                </div>
                <div style="font-size:15px; color:var(--text-secondary); margin-top:4px;">${pct}% to'g'ri</div>
                <div style="height:8px; background:var(--border-color); border-radius:4px; margin-top:20px;">
                    <div style="height:8px; background:var(--accent-color); border-radius:4px; width:${pct}%; transition:width 1s;"></div>
                </div>
            </div>

            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                <button onclick="startTest('${currentLevel}')" class="btn-primary">🔄 Qayta boshlash</button>
                <button onclick="renderDeutschHome()" class="btn-secondary">← Testlar</button>
            </div>
        </div>
        ${renderTestHistory()}
    `;
}

// Nav Deutsch havolasi endi pastdagi filtrlar yonidagi tugma orqali ishlaydi
// (yuqoridagi filterTags ishlovchisiga qarang)



// ============================================================
// TURNIR — 30 savol (nemis testlari + kartochkalardan aralash)
// Mehmon ism bilan qatnashadi; ro'yxatdan o'tgan bo'lsa avatar bilan.
// ============================================================
let tState = null;

function _tShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Savollar to'plamini ikkala manbadan yig'adi
function buildTournamentQuestions(count) {
    const pool = [];

    // 1) Nemis testlaridan (allaqachon ko'p tanlovli)
    try {
        Object.values(deutschTests).forEach(test => {
            (test.parts || []).forEach(part => {
                (part.sections || []).forEach(sec => {
                    (sec.questions || []).forEach(q => {
                        if (q.options && q.options.length >= 2 && typeof q.answer === 'number') {
                            pool.push({ q: q.q, image: q.image || null, options: q.options.slice(), answer: q.answer });
                        }
                    });
                });
            });
        });
    } catch (e) {}

    // 2) Kartochkalardan (front -> to'g'ri back + 3 ta chalg'ituvchi)
    try {
        Object.values(flashcardDecks).forEach(deck => {
            if (!Array.isArray(deck) || deck.length < 4) return;
            const backs = deck.map(c => c.back);
            deck.forEach(card => {
                const distractors = _tShuffle(backs.filter(b => b !== card.back)).slice(0, 3);
                if (distractors.length < 3) return;
                const opts = _tShuffle([card.back, ...distractors]);
                pool.push({
                    q: card.front + " — tarjimasi/ma'nosi?",
                    options: opts,
                    answer: opts.indexOf(card.back),
                });
            });
        });
    } catch (e) {}

    return _tShuffle(pool).slice(0, count);
}

function renderTournamentHome() {
    const view = document.getElementById('tournament-content');
    if (!view) return;

    const loggedIn = window.Auth && Auth.isLoggedIn();
    const name = loggedIn ? (Auth.user.name || Auth.user.username) : '';
    const initial = (name || 'M').charAt(0).toUpperCase();

    const playerBlock = loggedIn
        ? `<div class="t-player">
               <span class="t-avatar">${escapeHTML(initial)}</span>
               <div><strong>${escapeHTML(name)}</strong><br><small style="color:var(--text-muted);">@${escapeHTML(Auth.user.username)}</small></div>
           </div>
           <button class="btn-primary t-start-btn" onclick="startTournamentGame()" style="margin-top:16px;">🏆 Turnirni boshlash</button>`
        : `<div class="form-group" style="max-width:320px;margin:0 auto 14px;">
               <label for="t-name-input">Ismingiz (mehmon sifatida)</label>
               <input type="text" id="t-name-input" class="form-input" placeholder="Masalan: Ism" maxlength="40">
           </div>
           <button class="btn-primary t-start-btn" onclick="startTournamentGame()">🏆 Turnirni boshlash</button>
           <p style="font-size:12px;color:var(--text-muted);margin-top:10px;">Ro'yxatdan o'tsangiz — ism va avataringiz bilan, qayta yozmasdan qatnashasiz.
               <a href="#" onclick="openAuthModal('register');return false;" style="color:var(--color-purple-light);">Ro'yxatdan o'tish</a></p>`;

    view.innerHTML = `
        <div class="t-hero">
            <div style="font-size:50px;margin-bottom:8px;">🏆</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:30px;margin-bottom:8px;">Turnir</h2>
            <p style="color:var(--text-secondary);font-size:15px;margin-bottom:6px;">30 ta savol — nemis testlari va kartochkalaridan aralash</p>
            <p style="color:var(--text-muted);font-size:13px;">Eng yaxshi natijangiz reytingga yoziladi</p>
        </div>
        <div class="t-card">
            ${playerBlock}
        </div>
        <div id="t-leaderboard" class="t-card" style="margin-top:18px;">
            <h3 style="font-size:17px;margin-bottom:12px;">📊 Reyting</h3>
            <p style="color:var(--text-muted);font-size:13px;">Yuklanmoqda...</p>
        </div>
    `;
    loadLeaderboard();
}

async function loadLeaderboard() {
    const box = document.getElementById('t-leaderboard');
    if (!box) return;
    try {
        const res = await fetch('/tournament');
        const data = await res.json().catch(() => ({}));
        const lb = (data && data.leaderboard) || [];
        if (!lb.length) {
            box.innerHTML = '<h3 style="font-size:17px;margin-bottom:12px;">📊 Reyting</h3><p style="color:var(--text-muted);font-size:13px;">Hali hech kim qatnashmagan. Birinchi bo\'ling!</p>';
            return;
        }
        const rows = lb.map((e, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '.';
            const init = (e.name || '?').charAt(0).toUpperCase();
            const reg = e.registered ? `<span class="t-badge-reg" title="Ro'yxatdan o'tgan">✓</span>` : '';
            return `<div class="t-lb-row">
                <span class="t-lb-rank">${medal}</span>
                <span class="t-avatar t-avatar-sm">${escapeHTML(init)}</span>
                <span class="t-lb-name">${escapeHTML(e.name)} ${reg}</span>
                <span class="t-lb-score">${e.score}/${e.total}</span>
                <span class="t-lb-pct">${e.pct}%</span>
            </div>`;
        }).join('');
        box.innerHTML = '<h3 style="font-size:17px;margin-bottom:12px;">📊 Reyting (eng yaxshi natijalar)</h3>' + rows;
    } catch (e) {
        box.innerHTML = '<h3 style="font-size:17px;margin-bottom:12px;">📊 Reyting</h3><p style="color:#f87171;font-size:13px;">Reytingni yuklab bo\'lmadi</p>';
    }
}

function startTournamentGame() {
    const loggedIn = window.Auth && Auth.isLoggedIn();
    let name;
    if (loggedIn) {
        name = Auth.user.name || Auth.user.username;
    } else {
        const input = document.getElementById('t-name-input');
        name = (input && input.value.trim()) || '';
        if (!name) {
            if (input) { input.focus(); input.style.borderColor = '#f87171'; }
            return;
        }
    }

    const questions = buildTournamentQuestions(30);
    if (!questions.length) {
        showToast('Savollar topilmadi', 'warn');
        return;
    }
    tState = { questions, idx: 0, score: 0, name, answered: false };
    renderTournamentQ();
}

function renderTournamentQ() {
    const view = document.getElementById('tournament-content');
    if (!view || !tState) return;
    const q = tState.questions[tState.idx];
    if (!q) { renderTournamentResult(); return; }

    const total = tState.questions.length;
    const num = tState.idx + 1;
    const pct = Math.round((tState.idx / total) * 100);

    const optionsHTML = q.options.map((opt, i) =>
        `<button class="t-opt" id="t-opt-${i}" onclick="tournamentAnswer(${i})">
            <span class="t-opt-letter">${['A', 'B', 'C', 'D', 'E'][i] || (i + 1)}</span>
            <span>${escapeHTML(opt)}</span>
        </button>`
    ).join('');

    view.innerHTML = `
        <div style="max-width:640px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:13px;color:var(--text-secondary);">🏆 Turnir</span>
                <span style="font-size:13px;color:var(--text-secondary);">${num} / ${total} &nbsp;·&nbsp; ✅ ${tState.score}</span>
            </div>
            <div style="height:5px;background:var(--glass-border);border-radius:3px;margin-bottom:20px;">
                <div style="height:5px;background:var(--grad-primary);border-radius:3px;width:${pct}%;transition:width 0.3s;"></div>
            </div>
            <div class="t-card" style="margin-bottom:16px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--color-purple-light);margin-bottom:10px;">Savol ${num}</p>
                <h3 style="font-size:19px;line-height:1.5;margin:0;">${escapeHTML(q.q)}</h3>
            </div>
            <div id="t-options" style="display:flex;flex-direction:column;gap:10px;">
                ${optionsHTML}
            </div>
            <div id="t-next-wrap" style="display:none;text-align:right;margin-top:16px;">
                <button class="btn-primary" onclick="tournamentNext()">${num >= total ? "Natija 🏁" : 'Keyingi →'}</button>
            </div>
        </div>
    `;
    tState.answered = false;
}

function tournamentAnswer(selected) {
    if (!tState || tState.answered) return;
    tState.answered = true;
    const q = tState.questions[tState.idx];
    const correct = selected === q.answer;
    if (correct) tState.score++;

    q.options.forEach((_, i) => {
        const btn = document.getElementById('t-opt-' + i);
        if (!btn) return;
        btn.style.cursor = 'default';
        btn.classList.add('t-opt-disabled');
        if (i === q.answer) btn.classList.add('t-opt-correct');
        else if (i === selected) btn.classList.add('t-opt-wrong');
    });

    const nextWrap = document.getElementById('t-next-wrap');
    if (nextWrap) nextWrap.style.display = 'block';
}

function tournamentNext() {
    if (!tState) return;
    tState.idx++;
    if (tState.idx >= tState.questions.length) renderTournamentResult();
    else renderTournamentQ();
}

async function renderTournamentResult() {
    const view = document.getElementById('tournament-content');
    if (!view || !tState) return;
    const total = tState.questions.length;
    const score = tState.score;
    const pct = Math.round((score / total) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';

    view.innerHTML = `
        <div style="max-width:480px;margin:0 auto;text-align:center;">
            <div style="font-size:64px;margin-bottom:12px;">${emoji}</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:28px;margin-bottom:6px;">Turnir yakunlandi!</h2>
            <p style="color:var(--text-secondary);margin-bottom:24px;">${escapeHTML(tState.name)}</p>
            <div class="t-card" style="padding:30px;margin-bottom:20px;">
                <div style="font-size:50px;font-weight:700;color:var(--color-purple-light);font-family:'Playfair Display',serif;">${score}/${total}</div>
                <div style="font-size:15px;color:var(--text-secondary);margin-top:4px;">${pct}% to'g'ri</div>
                <div id="t-rank-info" style="margin-top:14px;font-size:14px;color:var(--text-muted);">Reytingga yozilmoqda...</div>
            </div>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                <button class="btn-primary" onclick="startTournamentGame()">🔄 Qayta</button>
                <button class="btn-secondary" onclick="renderTournamentHome()">📊 Reyting</button>
            </div>
        </div>
    `;

    // Natijani serverga yuborish (mehmon ham, login ham)
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (window.Auth && Auth.token) headers['x-user-token'] = Auth.token;
        const res = await fetch('/tournament', {
            method: 'POST',
            headers,
            body: JSON.stringify({ name: tState.name, score, total }),
        });
        const data = await res.json().catch(() => ({}));
        const info = document.getElementById('t-rank-info');
        if (info) {
            if (data.ok && data.rank) {
                info.innerHTML = `🏅 Reytingdagi o'rningiz: <b style="color:var(--color-purple-light);">${data.rank}</b> / ${data.totalPlayers}`;
            } else {
                info.textContent = 'Natija saqlandi';
            }
        }
    } catch (e) {
        const info = document.getElementById('t-rank-info');
        if (info) info.textContent = "Natija saqlanmadi (tarmoq xatosi)";
    }
}



// ============================================================
// O'QUVCHI AUTH UI (login / register / profil)
// ============================================================
let _authMode = 'login';

function openAuthModal(mode) {
    _authMode = mode || 'login';
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    setAuthMode(_authMode);
    const err = document.getElementById('auth-error');
    if (err) { err.textContent = ''; err.classList.remove('show'); }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('auth-username')?.focus(), 100);
}
function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}
function setAuthMode(mode) {
    _authMode = mode;
    const isReg = mode === 'register';
    document.getElementById('auth-tab-login')?.classList.toggle('active', !isReg);
    document.getElementById('auth-tab-register')?.classList.toggle('active', isReg);
    const nameGroup = document.getElementById('auth-name-group');
    if (nameGroup) nameGroup.style.display = isReg ? 'flex' : 'none';
    const hint = document.getElementById('auth-username-hint');
    if (hint) hint.style.display = isReg ? 'block' : 'none';
    const submit = document.getElementById('auth-submit');
    if (submit) submit.textContent = isReg ? "Ro'yxatdan o'tish" : 'Kirish';
    const pwd = document.getElementById('auth-password');
    if (pwd) pwd.setAttribute('autocomplete', isReg ? 'new-password' : 'current-password');
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    if (!window.Auth) return;
    if (Auth.isLoggedIn()) {
        const u = Auth.user;
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'inline-flex';
        const initial = (u.name || u.username || '?').charAt(0).toUpperCase();
        const av = document.getElementById('user-avatar');
        if (av) av.textContent = initial;
        const nameLabel = document.getElementById('user-name-label');
        if (nameLabel) nameLabel.textContent = u.name || u.username;
        const ddName = document.getElementById('user-dd-name');
        if (ddName) ddName.textContent = u.name || u.username;
        const ddUser = document.getElementById('user-dd-username');
        if (ddUser) ddUser.textContent = '@' + u.username;
    } else {
        if (loginBtn) loginBtn.style.display = '';
        if (userMenu) userMenu.style.display = 'none';
    }
}

function initAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.addEventListener('click', () => openAuthModal('login'));

    document.getElementById('close-auth-modal')?.addEventListener('click', closeAuthModal);
    document.getElementById('auth-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'auth-modal') closeAuthModal();
    });
    document.getElementById('auth-tab-login')?.addEventListener('click', () => setAuthMode('login'));
    document.getElementById('auth-tab-register')?.addEventListener('click', () => setAuthMode('register'));

    document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const err = document.getElementById('auth-error');
        const submit = document.getElementById('auth-submit');
        const name = document.getElementById('auth-name')?.value.trim() || '';
        const username = document.getElementById('auth-username')?.value.trim() || '';
        const password = document.getElementById('auth-password')?.value || '';
        if (err) { err.textContent = ''; err.classList.remove('show'); }
        if (submit) { submit.disabled = true; submit.textContent = 'Iltimos kuting...'; }

        let data;
        if (_authMode === 'register') data = await Auth.register(name, username, password);
        else data = await Auth.login(username, password);

        if (submit) { submit.disabled = false; submit.textContent = _authMode === 'register' ? "Ro'yxatdan o'tish" : 'Kirish'; }

        if (data && data.ok) {
            closeAuthModal();
            updateAuthUI();
            showToast('✅ Xush kelibsiz, ' + (Auth.user.name || Auth.user.username) + '!', 'success');
        } else if (err) {
            err.textContent = (data && data.message) || 'Xatolik yuz berdi';
            err.classList.add('show');
        }
    });

    const chip = document.getElementById('user-chip');
    const dropdown = document.getElementById('user-dropdown');
    if (chip && dropdown) {
        chip.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('open'); });
        document.addEventListener('click', () => dropdown.classList.remove('open'));
    }
    document.getElementById('user-logout-btn')?.addEventListener('click', async () => {
        await Auth.logout();
        updateAuthUI();
        showToast('Tizimdan chiqdingiz', 'info');
    });
    document.getElementById('user-results-btn')?.addEventListener('click', () => {
        dropdown?.classList.remove('open');
        openMyResults();
    });
    document.getElementById('close-myresults-modal')?.addEventListener('click', () => {
        document.getElementById('myresults-modal')?.classList.remove('active');
        document.body.style.overflow = '';
    });
    document.getElementById('myresults-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'myresults-modal') {
            e.currentTarget.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function openMyResults() {
    const modal = document.getElementById('myresults-modal');
    const content = document.getElementById('myresults-content');
    if (!modal || !content) return;
    const hist = (window.Auth && Auth.getLocalResults) ? Auth.getLocalResults() : [];
    if (!hist.length) {
        content.innerHTML = '<p style="color:var(--text-secondary);">Hali test ishlamadingiz. Nemis testlari yoki Turnirdan boshlang!</p>';
    } else {
        const rows = hist.slice(0, 30).map(h => {
            const d = new Date(h.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
            const color = h.pct >= 80 ? '#34d399' : h.pct >= 60 ? '#fbbf24' : '#f87171';
            return `<div style="display:flex;align-items:center;gap:10px;font-size:13px;padding:10px 0;border-bottom:1px solid var(--glass-border);">
                <span style="text-transform:uppercase;font-weight:700;width:60px;color:var(--color-purple-light);">${escapeHTML(String(h.level || ''))}</span>
                <div style="flex:1;height:6px;background:var(--glass-border);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:${h.pct}%;background:${color};"></div>
                </div>
                <span style="width:64px;text-align:right;color:var(--text-secondary);">${h.score}/${h.total}</span>
                <span style="width:90px;text-align:right;color:var(--text-muted);font-size:11px;">${d}</span>
            </div>`;
        }).join('');
        content.innerHTML = rows;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== GLOBAL SCOPE BINDINGS (ES MODULE UCHUN) =====
window.initMouseFollower = initMouseFollower;
window.updateClock = updateClock;
window.initTheme = initTheme;
window.updateThemeButton = updateThemeButton;
window.savePosts = savePosts;
window.showToast = showToast;
window.updateHeroContent = updateHeroContent;
window.renderPosts = renderPosts;
window.hideAuxViews = hideAuxViews;
window.showMainView = showMainView;
window.openDeutschView = openDeutschView;
window.openFlashcardsView = openFlashcardsView;
window.openTournamentView = openTournamentView;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.showSkeletons = showSkeletons;
window.showBlogResultsView = showBlogResultsView;
window.handleLike = handleLike;
window.openPostDetail = openPostDetail;
window.renderComments = renderComments;
window.closePostDetailModal = closePostDetailModal;
window.closeAddPostModal = closeAddPostModal;
window.compressImage = compressImage;
window.readFileAsDataURL = readFileAsDataURL;
window.showImagePreview = showImagePreview;
window.toggleMusicGroup = toggleMusicGroup;
window.handlePinSubmit = handlePinSubmit;
window.openAdminPanel = openAdminPanel;
window.renderTasks = renderTasks;
window.loadPortfolioForm = loadPortfolioForm;
window.renderPortfolioView = renderPortfolioView;
window.checkPortfolioAccess = checkPortfolioAccess;
window.escapeHTML = escapeHTML;
window.formatDate = formatDate;
window.safeUrl = safeUrl;
window.safeImageUrl = safeImageUrl;
window.cssUrl = cssUrl;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.initLightbox = initLightbox;
window.isDesktopPlayer = isDesktopPlayer;
window.getYouTubeId = getYouTubeId;
window.playMusic = playMusic;
window.stopMusic = stopMusic;
window.initMiniPlayer = initMiniPlayer;
window.renderFlashcardsHome = renderFlashcardsHome;
window.startFlashcards = startFlashcards;
window.renderFlashcard = renderFlashcard;
window.flipFlashcard = flipFlashcard;
window.nextFlashcard = nextFlashcard;
window.prevFlashcard = prevFlashcard;
window.shuffleFlashcards = shuffleFlashcards;
window.initLanguage = initLanguage;
window.initIntroSplash = initIntroSplash;
window.getRevealObserver = getRevealObserver;
window.observeReveal = observeReveal;
window.initScrollReveal = initScrollReveal;
window.initFloatingAddBtn = initFloatingAddBtn;
window.registerServiceWorker = registerServiceWorker;
window.setMeta = setMeta;
window.openPostFromUrl = openPostFromUrl;
window.sharePost = sharePost;
window.escapeAttr = escapeAttr;
window.readingTime = readingTime;
window.renderTags = renderTags;
window.filterByTag = filterByTag;
window.replyToComment = replyToComment;
window.saveTestResult = saveTestResult;
window.getTestHistory = getTestHistory;
window.renderTestHistory = renderTestHistory;
window.fcProgress = fcProgress;
window.fcSaveProgress = fcSaveProgress;
window.fcCardKey = fcCardKey;
window.fcAnswer = fcAnswer;
window.updateFcStreak = updateFcStreak;
window.getFcStreak = getFcStreak;
window.fcMasteredCount = fcMasteredCount;
window.renderFlashcardDone = renderFlashcardDone;
window.createParticleCanvas = createParticleCanvas;
window.initParticles = initParticles;
window.initFooterParticles = initFooterParticles;
window.initCarousel = initCarousel;
window.runTypewriter = runTypewriter;
window.initHeroCta = initHeroCta;
window.init3DTilt = init3DTilt;
window.emojiImage = emojiImage;
window.renderDeutschHome = renderDeutschHome;
window.startTest = startTest;
window.renderPartIntro = renderPartIntro;
window.startPart = startPart;
window.speakText = speakText;
window.renderQuestion = renderQuestion;
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
window.renderTestResult = renderTestResult;
window._tShuffle = _tShuffle;
window.buildTournamentQuestions = buildTournamentQuestions;
window.renderTournamentHome = renderTournamentHome;
window.startTournamentGame = startTournamentGame;
window.renderTournamentQ = renderTournamentQ;
window.tournamentAnswer = tournamentAnswer;
window.tournamentNext = tournamentNext;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.setAuthMode = setAuthMode;
window.updateAuthUI = updateAuthUI;
window.initAuthUI = initAuthUI;
window.openMyResults = openMyResults;
window.flashcardDecks = flashcardDecks;
window.deutschTests = deutschTests;


// ===== EPIC VANTA.JS BACKGROUND =====
let vantaEffect = null;
let vantaHue = 200; // Boshlang'ich rang (moviy)

function initVantaBg() {
    return; // O'chirilgan
    if (typeof VANTA === 'undefined') return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (vantaEffect) {
        vantaEffect.destroy();
    }
    
    // Light rejimda oq fon, Dark rejimda qora fon
    const bgColor = isDark ? 0x000000 : 0xffffff;
    
    vantaEffect = VANTA.WAVES({
        el: "#vanta-bg",
        mouseControls: false, // Sichqonchaga hamohang harakat O'CHIRILGAN
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x0ea5e9, // Boshlang'ich
        backgroundColor: bgColor,
        shininess: isDark ? 50 : 150,
        waveHeight: 30.00,
        waveSpeed: 1.20,
        zoom: 0.8
    });
    
    // Tinimsiz rang o'zgartirish (Color shifting)
    if (!window.vantaInterval) {
        window.vantaInterval = setInterval(() => {
            if (!vantaEffect) return;
            vantaHue = (vantaHue + 1) % 360;
            
            // HSL dan RGB Hex ga o'tkazish
            const h = vantaHue / 360;
            const s = isDark ? 1.0 : 0.8; // Darkda yorqinroq (neon)
            const l = isDark ? 0.5 : 0.6; // Lightda ochroq
            
            let r, g, b;
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if(t < 0) t += 1;
                    if(t > 1) t -= 1;
                    if(t < 1/6) return p + (q - p) * 6 * t;
                    if(t < 1/2) return q;
                    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            const colorHex = (Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255);
            vantaEffect.setOptions({ color: colorHex });
        }, 50); // Har 50ms da rang ozgina o'zgaradi
    }
}

// Buni app.js oxiriga qo'shdik. Tema o'zgarganda Vanta fonini ham yangilash kerak
window.refreshParticlesTheme = initVantaBg;

window.addEventListener('DOMContentLoaded', () => {
    // Biraz kechiktirib ishga tushiramiz, Vanta script yuklanishi uchun
    setTimeout(initVantaBg, 500);
});

// ===== HAMBURGER MENU =====
window.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    
    if (hamburgerBtn && hamburgerMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
        });
        
        // Tashqariga bosilganda yopish
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
            }
        });
    }
});
