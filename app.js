// Abdugofforov Blog & Portfolio - JavaScript Engine

// 1. Dastlabki Ma'lumotlar (Boshlang'ich Postlar)
const defaultPosts = [
    {
        id: 1,
        title: "Bugun boshladim",
        category: "Kun",
        type: "kun",
        excerpt: "Har bir uzoq safar bitta qadamdan boshlanadi.",
        content: "Har bir uzoq safar bitta qadamdan boshlanadi.\n\nBugun abdugofforov.uz ni yangidan boshladim. Oddiy, toza, faqat o'zim uchun. Nemischa o'rganish, hamshiralik, IT — barchasi shu yerda bir joyda bo'ladi.",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000",
        date: "2026-06-24",
        likes: 0,
        liked: false,
        comments: []
    }
];

// State (Holat) - Abdugofforov rebrending kalitlari bilan boshlash
// posts endi IndexedDB (Store) orqali yuklanadi — bootstrap() ichida hydrate qilinadi.
let posts = defaultPosts;
let currentTab = 'home'; 
let filterType = 'all'; 
let searchQuery = '';
let editingPostId = null;
let isAdmin = sessionStorage.getItem('kay_admin') === 'true';

// Rejalar va Portfolio state
let tasks = JSON.parse(localStorage.getItem('abdu_tasks')) || [];
let portfolioInfo = JSON.parse(localStorage.getItem('abdu_portfolio')) || {
    name: "Abdugofforov",
    title: "Senior UI/UX Designer & Software Engineer",
    bio: "Men ijodiy va sodda veb interfeyslar, yuqori darajadagi foydalanuvchanlik (UX) hamda interaktiv sahifalar yaratishga ishtiyoqmandman. Ushbu portfolio shaxsiy ishlarim ro'yxatini jamlaydi.",
    skills: "HTML5, CSS3, JavaScript (ES6+), React, TailwindCSS, Figma, UI/UX Design, Git, Webpack",
    experience: "Freelance Web Developer (2024 - Hozirgacha); UI/UX Engineer at IT Park (2025)"
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

// 4. Ob-havo va Vaqt Vidjeti
function updateClock() {
    const now = new Date();
    const timeOptions = { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' };
    
    document.getElementById('widget-time').textContent = now.toLocaleTimeString('uz-UZ', timeOptions);
    
    const dStr = now.toLocaleDateString('uz-UZ', dateOptions);
    document.getElementById('widget-date').textContent = dStr;
}
setInterval(updateClock, 1000);
updateClock();

async function fetchWeather() {
    try {
        // Buloqboshi koordinatalari: 40.6932 N, 72.4836 E
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=40.6932&longitude=72.4836&current=temperature_2m,weather_code&timezone=Asia%2FTashkent');
        const data = await res.json();
        
        if (data && data.current) {
            const temp = Math.round(data.current.temperature_2m);
            const code = data.current.weather_code;
            
            document.getElementById('weather-temp').textContent = `${temp}°C`;
            
            let icon = '☁️';
            let desc = 'Bulutli';
            if (code === 0) { icon = '☀️'; desc = 'Quyoshli'; }
            else if (code >= 1 && code <= 3) { icon = '⛅'; desc = 'Qisman bulutli'; }
            else if (code >= 45 && code <= 48) { icon = '🌫️'; desc = 'Tumanli'; }
            else if (code >= 51 && code <= 65) { icon = '🌧️'; desc = 'Yomg\'ir'; }
            else if (code >= 71 && code <= 77) { icon = '❄️'; desc = 'Qorli'; }
            else if (code >= 80 && code <= 82) { icon = '🌦️'; desc = 'Jala yomg\'ir'; }
            else if (code >= 95 && code <= 99) { icon = '⛈️'; desc = 'Momaqaldiroq'; }
            
            document.getElementById('weather-icon').textContent = icon;
            document.getElementById('weather-desc').textContent = desc;
        }
    } catch (e) {
        console.error('Ob-havoni yuklashda xatolik:', e);
        document.getElementById('weather-desc').textContent = 'Kutish rejimi';
    }
}
fetchWeather();
setInterval(fetchWeather, 30 * 60 * 1000); 

// 5. Mavzuni boshqarish (Dark/Light Mode)
function initTheme() {
    const savedTheme = localStorage.getItem('kay_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kay_theme', newTheme);
});

// 6. Ma'lumotlarni saqlash (IndexedDB orqali — katta sig'im)
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
}

// 7. Hero matnini dinamik o'zgartirish
function updateHeroContent() {
    const heroSection = document.querySelector('.hero');
    heroSection.classList.remove('animate-fade-in');
    void heroSection.offsetWidth; 
    heroSection.classList.add('animate-fade-in');

    if (currentTab === 'home') {
        heroSub.textContent = "Shaxsiy blog & Hikoyalar";
        heroMainTitle.textContent = "Vaqt sarguzashtlari va unutilmas xotiralar kundaligi.";
    } else if (currentTab === 'projects') {
        heroSub.textContent = "Ijodiy Loyihalar";
        heroMainTitle.textContent = "Amalga oshirilgan g'oyalar, dizaynlar va dasturiy ishlar.";
    }
}

// 8. Postlarni filtrlash va render qilish
function renderPosts() {
    // Skeleton ko'rsatish (tez o'chadi)
    showSkeletons(3);
    setTimeout(() => {
        blogGrid.innerHTML = '';
        blogGrid.classList.remove('animate-fade-in');
        void blogGrid.offsetWidth;
        blogGrid.classList.add('animate-fade-in');

        const filtered = posts.filter(post => {
            // Tab navigatsiyasi
            if (currentTab === 'projects' && post.type !== 'project') return false;

            // Toolbar filtr tugmalari
            if (filterType !== 'all') {
                if (post.category.toLowerCase().replace(/[^a-z0-9]/g, '') !== filterType.toLowerCase().replace(/[^a-z0-9]/g, '')) return false;
            }

            // Qidiruv
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = post.title.toLowerCase().includes(query);
                const matchesExcerpt = post.excerpt.toLowerCase().includes(query);
                const matchesCategory = post.category.toLowerCase().includes(query);
                return matchesTitle || matchesExcerpt || matchesCategory;
            }

            return true;
        });

        if (filtered.length === 0) {
            blogGrid.innerHTML = `
                <div class="empty-state">
                    <span class="empty-state-icon">📝</span>
                    <p class="empty-state-text">Hech qanday maqola yoki ma'lumot topilmadi.</p>
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
                        <div class="post-image" style="background-image: url('${post.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600'}');"></div>
                    </div>
                    <div class="post-content">
                        <span class="post-meta">🎵 ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
                        
                        <div class="music-player-container">
                            <audio src="${post.audio || ''}" controls class="music-audio-player" style="width:100%; margin-top:10px;"></audio>
                        </div>

                        <div class="post-footer" style="margin-top: 15px;">
                            <span class="post-date">${formatDate(post.date)}</span>
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
                        <div class="post-image" style="background-image: url('${post.image}');"></div>
                    </div>
                    <div class="post-content">
                        <span class="post-meta">🖼️ ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
                        
                        <div class="post-footer">
                            <span class="post-date">${formatDate(post.date)}</span>
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
                        <div class="post-image" style="background-image: url('${post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600'}');"></div>
                    </div>
                    <div class="post-content">
                        <span class="post-meta">📝 ${escapeHTML(post.category)}</span>
                        <h2 class="post-title">${escapeHTML(post.title)}</h2>
                        <p class="post-excerpt">${escapeHTML(post.excerpt)}</p>
                        <div class="post-footer">
                            <span class="post-date">${formatDate(post.date)}</span>
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
                } else if (e.target.closest('audio') || e.target.closest('.music-player-container')) {
                    // Audio tinglash
                } else {
                    openPostDetail(post.id);
                }
            });

            blogGrid.appendChild(card);
            observeReveal(card);
        });
    }, 400); // <-- setTimeout shu yerda yopildi
} // <-- renderPosts funksiyasi shu yerda yopildi

// Ko'rinishlarni almashtirish yordamchilari (asosiy <-> deutsch)
function showMainView() {
    const deutschView = document.getElementById('deutsch-view');
    if (deutschView) deutschView.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = '';
    if (mainContent) mainContent.style.display = '';
}

function openDeutschView() {
    if (mainContent) mainContent.style.display = 'none';
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'none';
    const deutschView = document.getElementById('deutsch-view');
    if (deutschView) deutschView.style.display = 'block';
    renderDeutschHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 9. SPA Routing Navigation
mainNav.addEventListener('click', (e) => {
    e.preventDefault();
    const link = e.target.closest('a');
    if (!link) return;

    // Kontakt havolasi — modal ochiladi, navigatsiya emas
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
        filterType = 'all';
    }

    filterTags.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
    filterTags.querySelector('[data-filter="all"]').classList.add('active');

    updateHeroContent();
    renderPosts();
});

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

navLogo.addEventListener('click', (e) => {
    e.preventDefault();
    const homeLink = mainNav.querySelector('[data-page="home"]');
    if (homeLink) homeLink.click();
});

// Toolbar filtrlari

// ===== HAMBURGER MENYU =====
const hamburgerBtn = document.getElementById('hamburger-btn');
const navRight = document.getElementById('nav-right');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMobileMenu() {
    hamburgerBtn.classList.add('active');
    navRight.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
    hamburgerBtn.classList.remove('active');
    navRight.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', () => {
    navRight.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});
mobileOverlay.addEventListener('click', closeMobileMenu);

// Nav link bosilganda menyu yopilsin
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

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

    showMainView();

    filterTags.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
    btn.classList.add('active');

    filterType = btn.getAttribute('data-filter');
    renderPosts();
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPosts();
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
        ${isAdmin ? `<div class="modal-actions-bar">
            <button class="btn-secondary btn-sm edit-post-btn">✏️ Tahrirlash</button>
            <button class="btn-secondary btn-sm delete-post-btn" style="color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2);">🗑️ O'chirish</button>
        </div>` : ''}
        
        <div class="modal-post-header">
            <span class="post-meta">${escapeHTML(post.category)}</span>
            <h1 class="modal-post-title">${escapeHTML(post.title)}</h1>
            <div class="modal-post-meta">
                <span>📅 ${formatDate(post.date)}</span>
                <span class="post-stat" id="modal-like-${post.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${post.liked ? 'var(--accent-color)' : 'inherit'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <span>${post.likes}</span>
                </span>
            </div>
        </div>
        
        ${post.type === 'music' 
            ? `<div style="margin-bottom: 30px;"><img src="${post.image}" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;"><audio src="${post.audio || ''}" controls style="width: 100%;"></audio></div>`
            : post.type === 'image' 
                ? `<div style="margin-bottom: 30px;"><img src="${post.image}" style="width: 100%; border-radius: 12px;"></div>`
                : `<div class="modal-post-image" style="background-image: url('${post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000'}');"></div>`
        }

        <div class="modal-post-text">${post.type === 'music' ? escapeHTML(post.content || post.excerpt) : escapeHTML(post.content)}</div>
        
        <div class="comments-section">
            <h3 class="comments-title">Izohlar (${post.comments.length})</h3>
            <div class="comments-list" id="modal-comments-list">
                ${renderComments(post.comments)}
            </div>
            
            <form class="comment-form" id="modal-comment-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="comment-author-input">Ismingiz</label>
                        <input type="text" id="comment-author-input" class="form-input" placeholder="Ismingizni kiriting..." required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="comment-text-input">Izoh matni</label>
                    <textarea id="comment-text-input" class="form-textarea" placeholder="Fikringizni yozib qoldiring..." required></textarea>
                </div>
                <button type="submit" class="btn-primary" style="align-self: flex-end;">Izoh qoldirish</button>
            </form>
        </div>
    `;

    const editBtn = detailModalBody.querySelector('.edit-post-btn');
    const deleteBtn = detailModalBody.querySelector('.delete-post-btn');

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            editingPostId = post.id;
            addPostModal.querySelector('.write-title').textContent = "Maqolani tahrirlash";
            
            document.getElementById('post-title-input').value = post.title;
            document.getElementById('post-category-input').value = post.category;
            document.getElementById('post-type-input').value = post.type;
            document.getElementById('post-excerpt-input').value = post.excerpt;
            document.getElementById('post-content-input').value = post.content;

            // Mavjud rasmni saqlab qolish (yangi fayl tanlanmasa o'zgarmaydi)
            pendingImageData = post.image || null;
            if (postImageUrlInput) postImageUrlInput.value = (post.image && post.image.startsWith('http')) ? post.image : '';
            if (postImageFileInput) postImageFileInput.value = '';
            showImagePreview(post.image || null);

            // Mavjud audioni saqlab qolish
            pendingAudioData = post.audio || null;
            if (postAudioFileInput) postAudioFileInput.value = '';
            showAudioPreview(post.audio || null);
            toggleAudioGroup();
            
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

    const commentForm = document.getElementById('modal-comment-form');
    commentForm.addEventListener('submit', (e) => {
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
        
        authorInput.value = '';
        textInput.value = '';
        renderPosts();
    });

    postDetailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
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
        </div>
    `).join('');
}

function closePostDetailModal() {
    postDetailModal.classList.remove('active');
    document.body.style.overflow = '';
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
    pendingAudioData = null;
    showImagePreview(null);
    showAudioPreview(null);
    toggleAudioGroup();
    addPostModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeAddPostModal() {
    addPostModal.classList.remove('active');
    document.body.style.overflow = '';
    newPostForm.reset();
    pendingImageData = null;
    pendingAudioData = null;
    showImagePreview(null);
    showAudioPreview(null);
}

closeAddModal.addEventListener('click', closeAddPostModal);
cancelAddBtn.addEventListener('click', closeAddPostModal);
addPostModal.addEventListener('click', (e) => {
    if (e.target === addPostModal) closeAddPostModal();
});

// ===== FAYL YUKLASH: rasm va audio (telefondan) =====
let pendingImageData = null; // data URL yoki tashqi havola
let pendingAudioData = null; // audio data URL

const postImageFileInput = document.getElementById('post-image-file');
const postImageUrlInput = document.getElementById('post-image-input');
const postImagePreview = document.getElementById('post-image-preview');
const postAudioFileInput = document.getElementById('post-audio-file');
const postAudioPreview = document.getElementById('post-audio-preview');
const postAudioGroup = document.getElementById('post-audio-group');
const postTypeInput = document.getElementById('post-type-input');

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

function showAudioPreview(src) {
    if (!postAudioPreview) return;
    if (src) {
        postAudioPreview.innerHTML = `<audio src="${src}" controls style="width:100%;"></audio>`;
        postAudioPreview.style.display = 'block';
    } else {
        postAudioPreview.innerHTML = '';
        postAudioPreview.style.display = 'none';
    }
}

function toggleAudioGroup() {
    if (!postAudioGroup || !postTypeInput) return;
    postAudioGroup.style.display = postTypeInput.value === 'music' ? 'block' : 'none';
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

// Audio fayl tanlanganda
postAudioFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
        alert("Audio fayl juda katta (25MB dan oshmasin). Iltimos kichikroq fayl tanlang.");
        e.target.value = '';
        return;
    }
    try {
        pendingAudioData = await readFileAsDataURL(file);
        showAudioPreview(pendingAudioData);
    } catch (err) {
        alert("Audioni o'qishda xatolik yuz berdi.");
    }
});

postTypeInput?.addEventListener('change', toggleAudioGroup);

newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title-input').value.trim();
    const category = document.getElementById('post-category-input').value.trim();
    const type = document.getElementById('post-type-input').value;
    const excerpt = document.getElementById('post-excerpt-input').value.trim();
    const content = document.getElementById('post-content-input').value.trim();

    // Rasm: yuklangan fayl / havola, bo'lmasa standart rasm
    let image = pendingImageData;
    if (!image) {
        if (type === 'music') {
            image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600';
        } else if (type === 'project') {
            image = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600';
        } else {
            image = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600';
        }
    }

    // Musiqa uchun audio shart
    if (type === 'music' && !pendingAudioData) {
        alert("Musiqa posti uchun audio fayl yuklang.");
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
                audio: type === 'music' ? pendingAudioData : (posts[postIndex].audio || null)
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
            audio: type === 'music' ? pendingAudioData : null,
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
    
    const ADMIN_HASH = '827d5449d1f191275051481e75c4ce10e930a64b5585a546363c340d63347089';
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const enteredHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (enteredHash === ADMIN_HASH) {
            sessionStorage.removeItem('pin_attempts');
            sessionStorage.removeItem('pin_lock_until');
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
            pinInput.focus();
        }
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
    document.querySelectorAll('.widgets-row, .toolbar, .footer .container')
        .forEach(observeReveal);
}


async function bootstrap() {
    // 3D kirish animatsiyasi darhol boshlanadi
    initIntroSplash();

    // Mavzu va kursorni darhol ishga tushiramiz (ma'lumotga bog'liq emas)
    initTheme();
    initMouseFollower();

    // Postlarni IndexedDB'dan yuklash (yoki localStorage'dan migratsiya)
    try {
        if (window.Store) {
            await Store.init(['abdu_posts']);
            const stored = Store.get('abdu_posts');
            if (stored && Array.isArray(stored) && stored.length) {
                posts = stored;
            } else {
                // Birinchi marta — standart postlarni saqlaymiz
                posts = defaultPosts;
                Store.set('abdu_posts', posts);
            }
        } else {
            const ls = JSON.parse(localStorage.getItem('abdu_posts') || 'null');
            posts = (ls && ls.length) ? ls : defaultPosts;
        }
    } catch (e) {
        console.error('Xotira yuklashda xato, standart postlar ishlatiladi:', e);
        const ls = JSON.parse(localStorage.getItem('abdu_posts') || 'null');
        posts = (ls && ls.length) ? ls : defaultPosts;
    }

    renderPosts();
    checkPortfolioAccess();
    initScrollReveal();
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

const deutschTests = {
    a1: {
        title: "A1 — Boshlang'ich daraja",
        parts: [
            {
                partNum: 1,
                name: "1-qism — Ko'rish va o'qish",
                icon: "👁️",
                sections: [
                    {
                        name: "📝 Ko'p tanlovli",
                        type: "text",
                        questions: [
                            {
                                q: "'Wie geht es Ihnen?' savoliga to'g'ri javob qaysi?",
                                options: ["Ich heiße Akrom.", "Mir geht es gut, danke.", "Ich komme aus Usbekistan.", "Ich bin 25 Jahre alt."],
                                answer: 1,
                                explanation: "'Mir geht es gut, danke' = 'Yaxshi, rahmat.' Wie geht es Ihnen? = Qandaysiz? (rasmiy)."
                            },
                            {
                                q: "Kechqurun xayrlashishda qaysi ibora to'g'ri?",
                                options: ["Guten Morgen!", "Guten Tag!", "Guten Abend!", "Auf Wiedersehen!"],
                                answer: 3,
                                explanation: "'Auf Wiedersehen!' = Ko'rishguncha/Xayr. Guten Morgen = tong, Guten Tag = kun, Guten Abend = kech uchrashganda."
                            },
                            {
                                q: "Qaysi gapda artikel to'g'ri ishlatilgan?",
                                options: ["Der Buch ist neu.", "Die Mann ist groß.", "Das Auto ist schnell.", "Ein Frau singt."],
                                answer: 2,
                                explanation: "'das Auto' — to'g'ri. das Buch (kitob), der Mann (erkak), die Frau (ayol)."
                            }
                        ]
                    },
                    {
                        name: "🖼️ Rasmli — nemischa toping",
                        type: "image",
                        questions: [
                            {
                                q: "Bu rasmda ko'ringan narsaning nemischa nomi?",
                                image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=400&q=80",
                                imageAlt: "Yashil alma",
                                options: ["die Banane", "der Apfel", "die Orange", "die Traube"],
                                answer: 1,
                                explanation: "'der Apfel' = alma. Mevalar: die Banane = banan, die Orange = apelsin, die Traube = uzum."
                            },
                            {
                                q: "Bu joyning nemischa nomi?",
                                image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
                                imageAlt: "Shifoxona",
                                options: ["die Schule", "das Hotel", "das Krankenhaus", "die Bank"],
                                answer: 2,
                                explanation: "'das Krankenhaus' = shifoxona. Krank = kasal, Haus = uy. Hamshira uchun eng muhim so'z!"
                            }
                        ]
                    },
                    {
                        name: "🖼️ Rasmli — o'zbekcha toping",
                        type: "image_reverse",
                        questions: [
                            {
                                q: "'der Hund' so'zining o'zbekcha tarjimasi?",
                                image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80",
                                imageAlt: "It",
                                options: ["mushuk", "ot", "it", "qush"],
                                answer: 2,
                                explanation: "'der Hund' = it. Hayvonlar: die Katze = mushuk, das Pferd = ot, der Vogel = qush."
                            },
                            {
                                q: "'das Brot' so'zining o'zbekcha tarjimasi?",
                                image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
                                imageAlt: "Non",
                                options: ["pishloq", "sut", "non", "sariyog'"],
                                answer: 2,
                                explanation: "'das Brot' = non. Nemislar nonni juda yaxshi ko'radi — 300+ turi bor! Oziq-ovqat: der Käse = pishloq, die Milch = sut."
                            }
                        ]
                    }
                ]
            },
            {
                partNum: 2,
                name: "2-qism — Eshitish (Hören)",
                icon: "🔊",
                sections: [
                    {
                        name: "🔊 Hören — Eshitib tanlang",
                        type: "audio",
                        questions: [
                            {
                                q: "Ovozni eshiting — tarjimasini toping:",
                                audio: "arbeiten",
                                audioLang: "de-DE",
                                displayWord: "arbeiten",
                                options: ["o'ynamoq", "ishlаmoq", "o'qimoq", "yurmoq"],
                                answer: 1,
                                explanation: "'arbeiten' = ishlamoq. 'Ich arbeite im Krankenhaus' = Men shifoxonada ishlayman."
                            },
                            {
                                q: "Ovozni eshiting — tarjimasini toping:",
                                audio: "Guten Morgen",
                                audioLang: "de-DE",
                                displayWord: "Guten Morgen",
                                options: ["Xayrli kech", "Xayrli kun", "Xayrli tong", "Xayr"],
                                answer: 2,
                                explanation: "'Guten Morgen' = Xayrli tong. Morgen = ertalab/ertaga."
                            },
                            {
                                q: "Ovozni eshiting — tarjimasini toping:",
                                audio: "Krankenschwester",
                                audioLang: "de-DE",
                                displayWord: "die Krankenschwester",
                                options: ["doktor", "bemor", "aptekachi", "hamshira (ayol)"],
                                answer: 3,
                                explanation: "'die Krankenschwester' = hamshira (ayol). Krank + Schwester = kasal + opa. Erkak: der Krankenpfleger."
                            },
                            {
                                q: "Ovozni eshiting — tarjimasini toping:",
                                audio: "Wie heißen Sie",
                                audioLang: "de-DE",
                                displayWord: "Wie heißen Sie?",
                                options: ["Qandaysiz?", "Qayerdansiz?", "Ismingiz nima?", "Necha yoshsiz?"],
                                answer: 2,
                                explanation: "'Wie heißen Sie?' = Ismingiz nima? (rasmiy). Norasmiy: 'Wie heißt du?'"
                            },
                            {
                                q: "Ovozni eshiting — tarjimasini toping:",
                                audio: "das Krankenhaus",
                                audioLang: "de-DE",
                                displayWord: "das Krankenhaus",
                                options: ["maktab", "shifoxona", "do'kon", "mehmonxona"],
                                answer: 1,
                                explanation: "'das Krankenhaus' = shifoxona. Germaniyada eng ko'p ishlatadigan joylardan biri."
                            },
                            {
                                q: "Ovozni eshiting — tarjimasini toping:",
                                audio: "Ich komme aus Usbekistan",
                                audioLang: "de-DE",
                                displayWord: "Ich komme aus Usbekistan.",
                                options: ["Men O'zbekistonda yashayaman.", "Men O'zbekistonlikman.", "Men O'zbekistonga boraman.", "Men O'zbekistonni yaxshi ko'raman."],
                                answer: 1,
                                explanation: "'Ich komme aus ...' = Men ... danman. Woher kommen Sie? savoliga shu bilan javob beriladi."
                            },
                            {
                                q: "Ovozni eshiting — tarjimasini toping:",
                                audio: "Auf Wiedersehen",
                                audioLang: "de-DE",
                                displayWord: "Auf Wiedersehen",
                                options: ["Salom!", "Rahmat!", "Iltimos!", "Ko'rishguncha!"],
                                answer: 3,
                                explanation: "'Auf Wiedersehen' = Ko'rishguncha / Xayr (rasmiy). Norasmiy: 'Tschüss!'"
                            },
                            {
                                q: "Ovozni eshiting — tarjimasini toping:",
                                audio: "Ich verstehe nicht",
                                audioLang: "de-DE",
                                displayWord: "Ich verstehe nicht.",
                                options: ["Men bilmayman.", "Men tushunmayapman.", "Men eshitmayapman.", "Men gapirmayman."],
                                answer: 1,
                                explanation: "'Ich verstehe nicht' = Men tushunmayapman. Juda muhim ibora! Shuningdek: 'Können Sie bitte langsamer sprechen?' = Sekinroq gapira olasizmi?"
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

// ===== A1 — 2-TO'PLAM (matn + rasm, audiosiz) =====
deutschTests.a1b = {
    title: "A1 — 2-to'plam (matn + rasm)",
    parts: [
        {
            partNum: 1,
            name: "Matn va rasm — aralash",
            icon: "📝",
            sections: [
                {
                    name: "📝 Ko'p tanlovli",
                    type: "text",
                    questions: [
                        { q: "'Danke schön!' iborasiga eng mos javob qaysi?", options: ["Bitte schön!", "Tschüss!", "Guten Tag!", "Wie geht's?"], answer: 0, explanation: "'Bitte schön!' = Marhamat / Arzimaydi. Rahmatga shunday javob beriladi." },
                        { q: "Qaysi son 'sieben' so'ziga to'g'ri keladi?", options: ["6", "7", "8", "9"], answer: 1, explanation: "'sieben' = 7. Sanoq: fünf=5, sechs=6, sieben=7, acht=8." },
                        { q: "'die Mutter' so'zining ma'nosi?", options: ["ota", "ona", "opa", "aka"], answer: 1, explanation: "'die Mutter' = ona. Oila: der Vater = ota, die Schwester = opa/singil, der Bruder = aka/uka." },
                        { q: "To'g'ri artikelni tanlang: ___ Sonne (quyosh).", options: ["der", "die", "das", "den"], answer: 1, explanation: "'die Sonne' — quyosh ayol rodida. Ko'p '-e' bilan tugaydigan so'zlar 'die' oladi." },
                        { q: "Bo'sh joyga mos fe'l: 'Ich ___ Student.'", options: ["bin", "bist", "ist", "sind"], answer: 0, explanation: "'ich bin' = men ...man. sein fe'li: ich bin, du bist, er/sie ist, wir sind." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — nemischa toping",
                    type: "image",
                    questions: [
                        { q: "Bu hayvonning nemischa nomi?", image: emojiImage("🐱"), imageAlt: "Mushuk", options: ["der Hund", "die Katze", "das Pferd", "der Vogel"], answer: 1, explanation: "'die Katze' = mushuk. der Hund = it, das Pferd = ot, der Vogel = qush." },
                        { q: "Bu mevaning nemischa nomi?", image: emojiImage("🍌"), imageAlt: "Banan", options: ["die Banane", "der Apfel", "die Birne", "die Kirsche"], answer: 0, explanation: "'die Banane' = banan. der Apfel = olma, die Birne = nok, die Kirsche = gilos." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("🏠"), imageAlt: "Uy", options: ["die Schule", "das Haus", "die Kirche", "der Garten"], answer: 1, explanation: "'das Haus' = uy. die Schule = maktab, der Garten = bog'." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("☀️", "#fff4d6"), imageAlt: "Quyosh", options: ["der Mond", "der Stern", "die Sonne", "der Regen"], answer: 2, explanation: "'die Sonne' = quyosh. der Mond = oy, der Stern = yulduz, der Regen = yomg'ir." },
                        { q: "Bu transport vositasining nemischa nomi?", image: emojiImage("🚗"), imageAlt: "Mashina", options: ["das Fahrrad", "der Bus", "das Auto", "der Zug"], answer: 2, explanation: "'das Auto' = mashina. das Fahrrad = velosiped, der Zug = poyezd." }
                    ]
                },
                {
                    name: "📝 So'z va grammatika",
                    type: "text",
                    questions: [
                        { q: "'Montag' qaysi hafta kuni?", options: ["Yakshanba", "Dushanba", "Seshanba", "Juma"], answer: 1, explanation: "'Montag' = Dushanba. Dienstag = Seshanba, Mittwoch = Chorshanba, Sonntag = Yakshanba." },
                        { q: "'Wie viel Uhr ist es?' savoli nimani so'raydi?", options: ["Narxni", "Soat (vaqt)ni", "Ismni", "Yoshni"], answer: 1, explanation: "'Wie viel Uhr ist es?' = Soat necha bo'ldi? Wie viel = qancha." },
                        { q: "'rot' rangi o'zbekchada nima?", options: ["ko'k", "yashil", "qizil", "sariq"], answer: 2, explanation: "'rot' = qizil. blau = ko'k, grün = yashil, gelb = sariq." },
                        { q: "Ko'plik shaklini tanlang: das Kind → ?", options: ["die Kinder", "die Kind", "der Kinder", "die Kindes"], answer: 0, explanation: "'das Kind' (bola) → 'die Kinder' (bolalar). Ko'plikda artikel doim 'die'." },
                        { q: "Xushmuomalalik so'zi: 'Ich möchte einen Kaffee, ___.'", options: ["bitte", "danke", "nein", "gut"], answer: 0, explanation: "'bitte' = iltimos. Buyurtma berishda muloyimlik uchun ishlatiladi." }
                    ]
                }
            ]
        }
    ]
};

// ===== A2 — 15 SAVOL (matn + rasm, audiosiz) =====
deutschTests.a2 = {
    title: "A2 — Asosiy daraja (15 savol)",
    parts: [
        {
            partNum: 1,
            name: "Matn va rasm — aralash",
            icon: "🌿",
            sections: [
                {
                    name: "📝 Grammatika va iboralar",
                    type: "text",
                    questions: [
                        { q: "Perfekt: 'Ich ___ gestern Fußball gespielt.'", options: ["habe", "bin", "hat", "bist"], answer: 0, explanation: "'Ich habe ... gespielt' — Perfektda 'spielen' fe'li 'haben' bilan ishlatiladi." },
                        { q: "Modal fe'l: 'Ich ___ heute arbeiten.' (kerak/majburiyat)", options: ["muss", "kann", "darf", "will"], answer: 0, explanation: "'müssen' = kerak/majbur. kann = qila olaman, darf = ruxsat, will = xohlayman." },
                        { q: "To'g'ri predlog: 'Ich fahre ___ Bus zur Arbeit.'", options: ["mit dem", "mit der", "in den", "auf dem"], answer: 0, explanation: "'mit dem Bus' = avtobusda. mit + Dativ; der Bus → dem Bus." },
                        { q: "Ajraladigan fe'l: 'Der Zug fährt um 8 Uhr ___.' (jo'naydi)", options: ["ab", "auf", "an", "aus"], answer: 0, explanation: "'abfahren' = jo'nab ketmoq. Gapda old qo'shimcha 'ab' oxiriga boradi: fährt ... ab." },
                        { q: "Qiyosiy daraja: 'Berlin ist ___ als Bonn.' (kattaroq)", options: ["größer", "groß", "am größten", "großer"], answer: 0, explanation: "'größer als' = ...dan kattaroq. groß → größer (qiyosiy daraja)." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — vaziyat va so'zlar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏥"), imageAlt: "Shifoxona", options: ["die Apotheke", "das Krankenhaus", "das Rathaus", "die Post"], answer: 1, explanation: "'das Krankenhaus' = shifoxona. die Apotheke = dorixona, das Rathaus = hokimiyat binosi." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("💊"), imageAlt: "Tabletka", options: ["die Spritze", "die Tablette", "der Verband", "das Pflaster"], answer: 1, explanation: "'die Tablette' = tabletka. die Spritze = ukol, der Verband = bint, das Pflaster = leykoplastir." },
                        { q: "Ob-havoni nemischa qanday ifodalaymiz?", image: emojiImage("🌧️", "#dbe7f0"), imageAlt: "Yomg'ir", options: ["Es schneit.", "Es regnet.", "Es ist sonnig.", "Es ist windig."], answer: 1, explanation: "'Es regnet' = Yomg'ir yog'yapti. Es schneit = qor yog'yapti." },
                        { q: "Bu kasbning nemischa nomi?", image: emojiImage("🧑‍🍳"), imageAlt: "Oshpaz", options: ["der Lehrer", "der Koch", "der Arzt", "der Fahrer"], answer: 1, explanation: "'der Koch' = oshpaz. der Lehrer = o'qituvchi, der Arzt = shifokor, der Fahrer = haydovchi." },
                        { q: "'Es ist Viertel nach acht.' — soat nechada?", image: emojiImage("⏰", "#f0e6db"), imageAlt: "Soat", options: ["07:45", "08:15", "08:45", "08:30"], answer: 1, explanation: "'Viertel nach acht' = sakkizdan o'n besh daqiqa o'tdi = 08:15. nach = keyin." }
                    ]
                },
                {
                    name: "📝 Grammatika — chuqurroq",
                    type: "text",
                    questions: [
                        { q: "Dativ: 'Ich helfe ___ Mann.' (yordam beraman)", options: ["dem", "den", "der", "das"], answer: 0, explanation: "'helfen' fe'li Dativ talab qiladi: der Mann → dem Mann." },
                        { q: "'weil' bog'lovchisidan keyin fe'l qayerda turadi?", options: ["Boshida", "Ikkinchi o'rinda", "Gap oxirida", "Ahamiyati yo'q"], answer: 2, explanation: "'weil' (chunki) ergash gapda fe'lni gap oxiriga suradi: ..., weil ich müde bin." },
                        { q: "'gestern' so'zi nimani bildiradi?", options: ["Bugun", "Ertaga", "Kecha", "Hozir"], answer: 2, explanation: "'gestern' = kecha. heute = bugun, morgen = ertaga, jetzt = hozir." },
                        { q: "To'g'ri predlog: 'Ich interessiere mich ___ Musik.'", options: ["für", "auf", "an", "mit"], answer: 0, explanation: "'sich interessieren für' = ...ga qiziqmoq. Ich interessiere mich für Musik." },
                        { q: "Perfektda 'fahren' fe'lining yordamchi fe'li qaysi?", options: ["haben", "sein", "werden", "können"], answer: 1, explanation: "Harakat fe'llari (fahren, gehen, kommen) Perfektda 'sein' oladi: Ich bin gefahren." }
                    ]
                }
            ]
        }
    ]
};

// ===== B1 — 15 SAVOL (matn + rasm, audiosiz) =====
deutschTests.b1 = {
    title: "B1 — O'rta daraja (15 savol)",
    parts: [
        {
            partNum: 1,
            name: "Matn va rasm — aralash",
            icon: "🌳",
            sections: [
                {
                    name: "📝 Grammatika (Konjunktiv, Passiv, bog'lovchilar)",
                    type: "text",
                    questions: [
                        { q: "Konjunktiv II: 'Wenn ich Zeit ___, würde ich reisen.'", options: ["hätte", "habe", "hatte", "haben"], answer: 0, explanation: "'hätte' — Konjunktiv II (shart mayli). Wenn ich Zeit hätte = Agar vaqtim bo'lganida." },
                        { q: "Passiv: 'Das Haus ___ 1990 gebaut.' (qurilgan edi)", options: ["wurde", "wird", "ist", "war"], answer: 0, explanation: "'wurde gebaut' — o'tgan zamon majhul nisbati (Präteritum Passiv): werden + Partizip II." },
                        { q: "Bog'lovchi: 'Es regnete. ___ gingen wir spazieren.' (shunga qaramay)", options: ["Deshalb", "Trotzdem", "Deswegen", "Darum"], answer: 1, explanation: "'trotzdem' = shunga qaramay. deshalb/deswegen/darum = shuning uchun." },
                        { q: "Nisbiy olmosh: 'Der Mann, ___ dort steht, ist mein Arzt.'", options: ["der", "den", "dem", "das"], answer: 0, explanation: "'der' — Nominativ (kim turibdi). Nisbiy olmosh ergash gapda subyekt vazifasini bajaradi." },
                        { q: "'obwohl' bog'lovchisi qaysi ma'noni beradi?", options: ["chunki", "shuning uchun", "...ga qaramay", "agar"], answer: 2, explanation: "'obwohl' = ...ga qaramay (garchi). Fe'l ergash gap oxirida turadi." },
                        { q: "Genitiv: 'das Auto ___ Vaters' (otaning mashinasi)", options: ["des", "der", "dem", "den"], answer: 0, explanation: "Genitivda erkak rod: der Vater → des Vaters. Egalikni bildiradi." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — so'z boyligi",
                    type: "image",
                    questions: [
                        { q: "Bu tibbiy asbobning nemischa nomi?", image: emojiImage("🩺"), imageAlt: "Stetoskop", options: ["das Thermometer", "das Stethoskop", "die Spritze", "der Verband"], answer: 1, explanation: "'das Stethoskop' = stetoskop. das Thermometer = termometr." },
                        { q: "Bu tadbirning nemischa nomi?", image: emojiImage("🎓"), imageAlt: "Bitiruv", options: ["die Hochzeit", "der Abschluss", "die Beerdigung", "die Geburt"], answer: 1, explanation: "'der Abschluss' = bitiruv/yakunlash. die Hochzeit = to'y, die Geburt = tug'ilish." },
                        { q: "Bu favqulodda holatning nemischa nomi?", image: emojiImage("🔥", "#ffe0d6"), imageAlt: "Yong'in", options: ["der Unfall", "das Feuer", "die Flut", "der Sturm"], answer: 1, explanation: "'das Feuer' = olov/yong'in (der Brand ham). der Unfall = baxtsiz hodisa, der Sturm = bo'ron." }
                    ]
                },
                {
                    name: "📝 So'z boyligi va iboralar",
                    type: "text",
                    questions: [
                        { q: "'sich bewerben' fe'li nimani anglatadi?", options: ["dam olmoq", "ish uchun ariza bermoq", "kasal bo'lmoq", "sayohat qilmoq"], answer: 1, explanation: "'sich bewerben (um/bei)' = ishga ariza topshirmoq. die Bewerbung = ariza." },
                        { q: "'der Termin' so'zining ma'nosi?", options: ["narx", "uchrashuv / qabul vaqti", "manzil", "hujjat"], answer: 1, explanation: "'der Termin' = belgilangan vaqt/uchrashuv. einen Termin machen = vaqt belgilamoq." },
                        { q: "Nominalizatsiya: 'schwimmen' → 'das ___'.", options: ["Schwimmen", "Schwimmung", "Geschwimm", "Schwimmer"], answer: 0, explanation: "Fe'lni otga aylantirish: schwimmen → das Schwimmen (suzish). Artikel doim 'das'." },
                        { q: "'Je mehr ich lerne, ___ besser verstehe ich.'", options: ["desto", "als", "wie", "denn"], answer: 0, explanation: "'je ... desto ...' = qancha ... shuncha ... Je mehr, desto besser." },
                        { q: "To'g'ri predlog: 'Ich freue mich ___ das Wochenende.' (intizorlik)", options: ["auf", "über", "an", "für"], answer: 0, explanation: "'sich freuen auf' = kelajakdagi narsani intizorlik bilan kutmoq. (sich freuen über = bo'lib o'tgan narsadan xursand bo'lmoq)." },
                        { q: "'die Krankenversicherung' so'zi nimani bildiradi?", options: ["kasallik tarixi", "tibbiy sug'urta", "retsept", "shifokor"], answer: 1, explanation: "'die Krankenversicherung' = tibbiy/sog'liq sug'urtasi. Germaniyada yashash uchun majburiy." }
                    ]
                }
            ]
        }
    ]
};

// Test holati
let currentTest = null;
let currentLevel = 'a1';
let currentSection = 0;
let currentQuestion = 0;
let score = 0;
let answered = false;

function renderDeutschHome() {
    const view = document.getElementById('deutsch-content');
    view.innerHTML = `
        <div style="text-align:center; margin-bottom:40px;">
            <div style="font-size:48px; margin-bottom:12px;">🇩🇪</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">Nemis tili testlari</h2>
            <p style="color:var(--text-secondary); font-size:15px;">O'z bilimingizni sinab ko'ring — har bir xato tushuntirma bilan</p>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap:16px; max-width:900px; margin:0 auto;">
            <div class="post-card" onclick="startTest('a1')" style="cursor:pointer; padding:28px; text-align:center; border:2px solid var(--accent-color);">
                <div style="font-size:36px; margin-bottom:12px;">🌱</div>
                <h3 style="font-size:18px; margin-bottom:8px;">A1 — 1-to'plam</h3>
                <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">Salomlashish, raqamlar, artikel + Eshitish (audio)</p>
                <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
                    <span class="filter-tag" style="margin:0;">Audio bor</span>
                    <span class="filter-tag" style="margin:0; color:var(--accent-color);">Mavjud</span>
                </div>
            </div>
            <div class="post-card" onclick="startTest('a1b')" style="cursor:pointer; padding:28px; text-align:center; border:2px solid var(--accent-color);">
                <div style="font-size:36px; margin-bottom:12px;">🌱</div>
                <h3 style="font-size:18px; margin-bottom:8px;">A1 — 2-to'plam</h3>
                <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">Matn va rasm aralash — audiosiz (15 savol)</p>
                <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
                    <span class="filter-tag" style="margin:0;">15 ta savol</span>
                    <span class="filter-tag" style="margin:0; color:var(--accent-color);">Yangi</span>
                </div>
            </div>
            <div class="post-card" onclick="startTest('a2')" style="cursor:pointer; padding:28px; text-align:center;">
                <div style="font-size:36px; margin-bottom:12px;">🌿</div>
                <h3 style="font-size:18px; margin-bottom:8px;">A2 — Asosiy</h3>
                <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">Perfekt, modal fe'llar, predloglar (15 savol)</p>
                <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
                    <span class="filter-tag" style="margin:0;">15 ta savol</span>
                    <span class="filter-tag" style="margin:0; color:var(--accent-color);">Yangi</span>
                </div>
            </div>
            <div class="post-card" onclick="startTest('b1')" style="cursor:pointer; padding:28px; text-align:center;">
                <div style="font-size:36px; margin-bottom:12px;">🌳</div>
                <h3 style="font-size:18px; margin-bottom:8px;">B1 — O'rta</h3>
                <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">Konjunktiv II, Passiv, bog'lovchilar (15 savol)</p>
                <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
                    <span class="filter-tag" style="margin:0;">15 ta savol</span>
                    <span class="filter-tag" style="margin:0; color:var(--accent-color);">Yangi</span>
                </div>
            </div>
        </div>
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
                <img src="${q.image}" alt="${q.imageAlt}"
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
    `;
}

// Nav Deutsch havolasi endi pastdagi filtrlar yonidagi tugma orqali ishlaydi
// (yuqoridagi filterTags ishlovchisiga qarang)
