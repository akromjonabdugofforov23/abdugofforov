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
let posts = JSON.parse(localStorage.getItem('abdu_posts')) || defaultPosts;
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

if (!localStorage.getItem('abdu_posts')) {
    savePosts();
}

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

// 6. Ma'lumotlarni saqlash
function savePosts() {
    localStorage.setItem('abdu_posts', JSON.stringify(posts));
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
                            <audio src="${post.content}" controls class="music-audio-player" style="width:100%; margin-top:10px;"></audio>
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
        });
    }, 400); // <-- setTimeout shu yerda yopildi
} // <-- renderPosts funksiyasi shu yerda yopildi

// 9. SPA Routing Navigation
mainNav.addEventListener('click', (e) => {
    e.preventDefault();
    const link = e.target.closest('a');
    if (!link) return;

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
            ? `<div style="margin-bottom: 30px;"><img src="${post.image}" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;"><audio src="${post.content}" controls style="width: 100%;"></audio></div>`
            : post.type === 'image' 
                ? `<div style="margin-bottom: 30px;"><img src="${post.content}" style="width: 100%; border-radius: 12px;"></div>`
                : `<div class="modal-post-image" style="background-image: url('${post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000'}');"></div>`
        }

        <div class="modal-post-text">${post.type === 'music' ? escapeHTML(post.excerpt) : escapeHTML(post.content)}</div>
        
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
            document.getElementById('post-image-input').value = post.image || '';
            document.getElementById('post-excerpt-input').value = post.excerpt;
            document.getElementById('post-content-input').value = post.content;
            
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
    addPostModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeAddPostModal() {
    addPostModal.classList.remove('active');
    document.body.style.overflow = '';
    newPostForm.reset();
}

closeAddModal.addEventListener('click', closeAddPostModal);
cancelAddBtn.addEventListener('click', closeAddPostModal);
addPostModal.addEventListener('click', (e) => {
    if (e.target === addPostModal) closeAddPostModal();
});

newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title-input').value.trim();
    const category = document.getElementById('post-category-input').value.trim();
    const type = document.getElementById('post-type-input').value;
    let image = document.getElementById('post-image-input').value.trim();
    const excerpt = document.getElementById('post-excerpt-input').value.trim();
    const content = document.getElementById('post-content-input').value.trim();

    if (!image) {
        if (type === 'music') {
            image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600';
        } else if (type === 'project') {
            image = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600';
        } else {
            image = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600';
        }
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
                content
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
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            liked: false,
            comments: []
        };
        posts.unshift(newPost);
    }

    savePosts();
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

// 15. Dasturni ishga tushirish
initTheme();
renderPosts();
initMouseFollower();
checkPortfolioAccess();


// ===== DEUTSCH TESTLAR =====
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

// Test holati
let currentTest = null;
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
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap:16px; max-width:800px; margin:0 auto;">
            <div class="post-card" onclick="startTest('a1')" style="cursor:pointer; padding:28px; text-align:center; border:2px solid var(--accent-color);">
                <div style="font-size:36px; margin-bottom:12px;">🌱</div>
                <h3 style="font-size:18px; margin-bottom:8px;">A1 — Boshlang'ich</h3>
                <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">Salomlashish, raqamlar, ranglar, artikel</p>
                <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
                    <span class="filter-tag" style="margin:0;">20 ta savol</span>
                    <span class="filter-tag" style="margin:0; color:var(--accent-color);">Hozir mavjud</span>
                </div>
            </div>
            <div class="post-card" style="padding:28px; text-align:center; opacity:0.5;">
                <div style="font-size:36px; margin-bottom:12px;">🌿</div>
                <h3 style="font-size:18px; margin-bottom:8px;">A2 — Asosiy</h3>
                <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">Tez kunda...</p>
                <span class="filter-tag" style="margin:0;">Yaqinda</span>
            </div>
            <div class="post-card" style="padding:28px; text-align:center; opacity:0.5;">
                <div style="font-size:36px; margin-bottom:12px;">🌳</div>
                <h3 style="font-size:18px; margin-bottom:8px;">B1 — O'rta</h3>
                <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">TELC B1 tayyorgarlik</p>
                <span class="filter-tag" style="margin:0;">Yaqinda</span>
            </div>
        </div>
    `;
}

let currentPart = 0;

function startTest(level) {
    currentTest = deutschTests[level];
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
    const pct = Math.round((score / total) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
    const msg = pct >= 80 ? "Ajoyib natija! Siz A1 ni yaxshi bilasiz." 
              : pct >= 60 ? "Yaxshi! Bir oz mashq qilsangiz mukammal boʻladi."
              : "Qoʻrqmang! Qayta oʻrganib, yana sinab koʻring.";

    document.getElementById('deutsch-content').innerHTML = `
        <div style="max-width:480px; margin:0 auto; text-align:center;">
            <div style="font-size:64px; margin-bottom:16px;">${emoji}</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">Test yakunlandi!</h2>
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

            <div style="display:flex; gap:12px; justify-content:center;">
                <button onclick="startTest('a1')" class="btn-primary">🔄 Qayta boshlash</button>
                <button onclick="renderDeutschHome()" class="btn-secondary">← Testlar</button>
            </div>
        </div>
    `;
}

// Nav Deutsch link
document.getElementById('nav-deutsch-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById('main-content').style.display = 'none';
    document.querySelector('.hero').style.display = 'none';
    document.getElementById('deutsch-view').style.display = 'block';
    renderDeutschHome();
});
