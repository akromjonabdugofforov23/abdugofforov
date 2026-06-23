// Abdugofforov Blog & Portfolio - JavaScript Engine

// 1. Dastlabki Ma'lumotlar (Boshlang'ich Postlar)
const defaultPosts = [
    {
        id: 1,
        title: "Toshkent qahratoni va kutilmagan hayajonlar",
        category: "Yangiliklar",
        type: "news",
        excerpt: "Eski ko'rinishdagi zich matnlardan uzoqlashib, hayotning eng qiziqarli lahzalarini zamonaviy onlayn-jurnal formatida qayta kashf etamiz...",
        content: "Eski ko'rinishdagi zich matnlardan uzoqlashib, hayotning eng qiziqarli lahzalarini zamonaviy onlayn-jurnal formatida qayta kashf etamiz.\n\nToshkentning sovuq qishi har doim o'ziga xos romantikaga ega. Qorli ko'chalar, issiq qahva hidi va kelajak rejalari haqidagi o'ylar. Ushbu sahifa mening shaxsiy xotiralarim, safarlarim va hayotiy tajribalarimni jamlaydigan yangi qadamdir. Biz bu yerda shunchaki yozmaymiz, balki har bir daqiqa qadrini his qilamiz.",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1000",
        date: "2026-06-22",
        likes: 14,
        liked: false,
        comments: [
            { id: 1, author: "Farrux", text: "Ajoyib dizayn va samimiy so'zlar! Davomini kutamiz.", date: "2026-06-22" }
        ]
    },
    {
        id: 2,
        title: "Nemis tili va yangi marralar sari sayohat",
        category: "Saboqlar",
        type: "lessons",
        excerpt: "Til o'rganish shunchaki qoidalar emas, balki yangi madaniyat, dunyoqarash va yangi muhit estetikasiga sho'ng'ish demakdir.",
        content: "Til o'rganish shunchaki qoidalar emas, balki yangi madaniyat, dunyoqarash va yangi muhit estetikasiga sho'ng'ish demakdir.\n\nNemis tilini o'rganishni boshlaganimda, har bir yangi so'z ortida butun bir falsafa borligini angladim. Masalan, 'Waldeinsamkeit' so'zi - o'rmonda yolg'iz qolib, tabiat bilan uyg'unlashish hissini anglatadi. Til orqali odamlarni, ularning yashash tarzini va eng asosiysi o'zimizni boshqacha anglashni boshlaymiz. Sayohatlar ise bu bilimlarni sinash uchun eng zo'r maydondir.",
        image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1000",
        date: "2026-06-18",
        likes: 9,
        liked: false,
        comments: []
    },
    {
        id: 3,
        title: "Ilk saboqlar va kutish hikmati",
        category: "G'oyalar",
        type: "ideas",
        excerpt: "Ba'zida hayotdagi eng oddiy tuyulgan narsalar ham bizga vaqt nisbiyligi va sabr qilishning eng go'zal darslarini beradi.",
        content: "Ba'zida hayotdagi eng oddiy tuyulgan narsalar ham bizga vaqt nisbiyligi va sabr qilishning eng go'zal darslarini beradi.\n\nPazandachilik - bu nafaqat masalliqlarni aralashtirish, balki olov, vaqt va hidlarning ajoyib simfoniyasidir. Biror shirinlik pishishini kutish jarayoni bizga sabr qilishni va har bir ish o'z vaqt-soati bilan go'zallashishini o'rgatadi. Oshxonadagi tajribalarim meni har doim tinchlantiradi va ijodiy erkinlik beradi.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000",
        date: "2026-06-10",
        likes: 21,
        liked: false,
        comments: []
    },
    {
        id: 4,
        title: "Shaxsiy Brending va Minimalist Estetika",
        category: "Loyihalar",
        type: "project",
        excerpt: "Abdugofforov brendining vizual identifikatsiyasi, ranglar uyg'unligi va minimalist dizayn konseptini ishlab chiqish jarayoni.",
        content: "Abdugofforov brendining vizual identifikatsiyasi, ranglar uyg'unligi va minimalist dizayn konseptini ishlab chiqish jarayoni.\n\nUshbu loyihada maqsad - foydalanuvchiga qulay, ko'zni charchatmaydigan va shu bilan birga o'ziga xos retro-minimalizm hissini beruvchi interfeys yaratish edi. Shriftdan boshlab ranglargacha har bir detal shaxsiyatni va yozuvlarning nafisligini ko'rsatishga qaratilgan.",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000",
        date: "2026-06-01",
        likes: 35,
        liked: false,
        comments: [
            { id: 1, author: "Lola", text: "Dizayn va ranglar juda mos tushibdi. Juda ajoyib ish!", date: "2026-06-02" }
        ]
    },
    {
        id: 5,
        title: "Lofi Beats - Chill Out Track",
        category: "Musiqa",
        type: "music",
        excerpt: "Yozish va fikrni jamlash jarayonida tinglash uchun sokin musiqiy to'plam.",
        content: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600",
        date: "2026-06-21",
        likes: 18,
        liked: false,
        comments: []
    },
    {
        id: 6,
        title: "Tog'lar go'zalligi - Tabiat Estetikasidan Lavha",
        category: "Rasmlar",
        type: "image",
        excerpt: "Buloqboshi tog' etaklari va go'zal tabiat manzarasidan ilhomlangan estetik lahza.",
        content: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600",
        date: "2026-06-20",
        likes: 29,
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
const adminBtn = document.getElementById('admin-btn');
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
    blogGrid.innerHTML = '';
    blogGrid.classList.remove('animate-fade-in');
    void blogGrid.offsetWidth;
    blogGrid.classList.add('animate-fade-in');

    const filtered = posts.filter(post => {
        // Tab navigatsiyasi
        if (currentTab === 'projects' && post.type !== 'project') return false;

        // Toolbar filtr tugmalari
        if (filterType !== 'all') {
            if (filterType === 'memory' && !['memory', 'news', 'ideas', 'lessons', 'events'].includes(post.type)) return false;
            if (filterType === 'project' && post.type !== 'project') return false;
            if (filterType === 'news' && post.type !== 'news') return false;
            if (filterType === 'ideas' && post.type !== 'ideas') return false;
            if (filterType === 'lessons' && post.type !== 'lessons') return false;
            if (filterType === 'events' && post.type !== 'events') return false;
            if (filterType === 'music' && post.type !== 'music') return false;
            if (filterType === 'image' && post.type !== 'image') return false;
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
}

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
        <div class="modal-actions-bar">
            <button class="btn-secondary btn-sm edit-post-btn">✏️ Tahrirlash</button>
            <button class="btn-secondary btn-sm delete-post-btn" style="color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2);">🗑️ O'chirish</button>
        </div>
        
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

    editBtn.addEventListener('click', () => {
        editingPostId = post.id;
        addPostModal.querySelector('.write-title').textContent = "Maqolani tahrirlash";
        
        document.getElementById('post-title-input').value = post.title;
        document.getElementById('post-category-input').value = post.category;
        document.getElementById('post-type-input').value = post.type;
        document.getElementById('post-image-input').value = post.image;
        document.getElementById('post-excerpt-input').value = post.excerpt;
        document.getElementById('post-content-input').value = post.content;
        
        closePostDetailModal();
        addPostModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm("Ushbu maqolani o'chirmoqchimisiz?")) {
            posts = posts.filter(p => p.id !== post.id);
            savePosts();
            renderPosts();
            closePostDetailModal();
        }
    });

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
adminBtn.addEventListener('click', () => {
    pinInput.value = '';
    pinError.style.display = 'none';
    pinModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closePinModal.addEventListener('click', () => {
    pinModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Admin panelga kirish so'rovi (Xavfsiz Serverless API)
async function handleAdminLogin(pinInputValue) {
    try {
        const response = await fetch('/check-pin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pin: pinInputValue })
        });

        const data = await response.json();

        if (data.success) {
            alert("Xush kelibsiz, Admin!");
            if (typeof pinModal !== 'undefined' && pinModal) pinModal.classList.remove('active');
            if (typeof openAdminPanel === 'function') openAdminPanel();
            localStorage.setItem('isAdmin', 'true');
        } else {
            alert(data.message || "Noto'g'ri PIN-kod!");
        }
    } catch (error) {
        console.error("Xavfsizlik tizimida xatolik:", error);
        alert("Server bilan aloqa o'rnatib bo'lmadi.");
    }
}

// Hodisalarni tinglovchilar (Faqat elementlar mavjud bo'lsa ishlaydi)
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('pinSubmitBtn') || (typeof pinSubmitBtn !== 'undefined' ? pinSubmitBtn : null);
    const inputField = document.getElementById('pinInput') || (typeof pinInput !== 'undefined' ? pinInput : null);

    if (submitBtn && inputField) {
        // Klik bo'lganda
        submitBtn.addEventListener('click', () => {
            handleAdminLogin(inputField.value.trim());
        });

        // Enter bosilganda
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleAdminLogin(inputField.value.trim());
            }
        });
    }
});

// 13. Admin Panel Boshqaruvi
function openAdminPanel() {
    adminPanelModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    adminTabPlansBtn.click();
    renderTasks();
    loadPortfolioForm();
}

closeAdminPanelBtn.addEventListener('click', () => {
    adminPanelModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Tablararo navigatsiya
adminTabPlansBtn.addEventListener('click', () => {
    adminTabPlansBtn.classList.add('active');
    adminTabPortBtn.classList.remove('active');
    adminPlansSection.style.display = 'block';
    adminPortfolioSection.style.display = 'none';
});

adminTabPortBtn.addEventListener('click', () => {
    adminTabPortBtn.classList.add('active');
    adminTabPlansBtn.classList.remove('active');
    adminPortfolioSection.style.display = 'block';
    adminPlansSection.style.display = 'none';
});

// Rejalar CRUD
adminTaskForm.addEventListener('submit', (e) => {
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

    document.getElementById('count-todo').textContent = countTodo;
    document.getElementById('count-progress').textContent = countProgress;
    document.getElementById('count-done').textContent = countDone;

    const total = tasks.length;
    const percentage = total === 0 ? 0 : Math.round((countDone / total) * 100);
    document.getElementById('chart-percentage-text').textContent = `${percentage}%`;

    const circle = document.getElementById('progress-ring-circle');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius; 
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
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
    portNameInput.value = portfolioInfo.name;
    portTitleInput.value = portfolioInfo.title;
    portBioInput.value = portfolioInfo.bio;
    portSkillsInput.value = portfolioInfo.skills;
    portExperienceInput.value = portfolioInfo.experience;
}

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

// Bir martalik token yaratish
generateTokenBtn.addEventListener('click', () => {
    const token = 'abdu_' + Math.random().toString(36).substr(2, 8);
    portfolioTokens.push(token);
    localStorage.setItem('abdu_portfolio_tokens', JSON.stringify(portfolioTokens));

    const link = `${window.location.origin}${window.location.pathname}?token=${token}`;
    generatedLinkInput.value = link;
    generatedLinkBox.style.display = 'block';
});

copyLinkBtn.addEventListener('click', () => {
    generatedLinkInput.select();
    document.execCommand('copy');
    alert("Havola nusxalandi!");
});

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
