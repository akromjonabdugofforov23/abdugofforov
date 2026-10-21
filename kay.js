// ===== KAY ADMIN PANEL =====
// XAVFSIZLIK: PIN endi MIJOZDA tekshirilmaydi. PIN to'g'riligini faqat
// SERVER (/admin/request-code yoki /check-pin) hal qiladi. Shu sababli
// PIN hashi bu yerda saqlanmaydi.

// Global keshlar
let cachedUsers = [];
let cachedResults = [];
let cachedPosts = [];
let cachedLiveStats = null;
let currentTaskFilter = 'all';

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `cyber-toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${typeof _esc === 'function' ? _esc(message) : message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
window.showToast = showToast;

// DOM tayyor bo'lgach admin holatini tekshiramiz
async function initKay() {
    // 1. URL orqali token uzatilgan bo'lsa (Magic Gate redirect yoki havola)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
        try {
            const res = await fetch('/auth/magic-gate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: urlToken })
            });
            const data = await res.json().catch(() => ({}));
            if (data && (data.ok || data.success)) {
                sessionStorage.setItem('kay_admin', 'true');
                if (data.token) sessionStorage.setItem('kay_admin_token', data.token);
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
                document.documentElement.style.display = '';
                showAdminPanel();
                return;
            }
        } catch (_) {}

        // Token yaroqsiz bo'lsa — PIN ekranga o'tamiz
        sessionStorage.removeItem('kay_admin');
        sessionStorage.removeItem('kay_admin_token');
        showPinScreen();
        return;
    }

    // 2. Foydalanuvchi ma'lumotlaridan adminlikni tekshirish
    try {
        const u = JSON.parse(localStorage.getItem('abdu_user_data') || localStorage.getItem('kay_auth_user') || 'null');
        const adminNames = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
        if (u && (u.role === 'admin' || (u.username && adminNames.includes(u.username.toLowerCase())))) {
            sessionStorage.setItem('kay_admin', 'true');
            if (u.token && !sessionStorage.getItem('kay_admin_token')) {
                sessionStorage.setItem('kay_admin_token', u.token);
            }
        }
    } catch (_) {}

    // 3. Agar sessionStorage 'kay_admin' yoki faol token bo'lsa
    const hasAdmin = sessionStorage.getItem('kay_admin') === 'true';
    const adminToken = sessionStorage.getItem('kay_admin_token');

    if (hasAdmin || adminToken) {
        document.documentElement.style.display = '';
        showAdminPanel();
    } else {
        document.documentElement.style.display = '';
        showPinScreen();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKay);
} else {
    initKay();
}

// ===== PIN LOGIKASI =====
const pinInput = document.getElementById('pin-input');
const pinError = document.getElementById('pin-error');
const pinAttempts = document.getElementById('pin-attempts');

async function tryLogin() {
    const pin = pinInput.value.trim();
    if (!pin) return;

    const lockUntil = parseInt(localStorage.getItem('kay_lock') || '0');
    if (Date.now() < lockUntil) {
        const s = Math.ceil((lockUntil - Date.now()) / 1000);
        pinError.textContent = `${s} soniya kuting...`;
        pinError.style.display = 'block';
        return;
    }

    const submitBtn = document.getElementById('pin-submit-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Tekshirilmoqda...'; }

    // Noto'g'ri PIN holatini ishlovchi
    function registerWrongPin(msg) {
        const attempts = parseInt(localStorage.getItem('kay_attempts') || '0') + 1;
        localStorage.setItem('kay_attempts', attempts);
        addLog('fail', `Noto'g'ri PIN urinish #${attempts}`);
        if (attempts >= 5) {
            const lockCount = parseInt(localStorage.getItem('kay_lockcount') || '0') + 1;
            localStorage.setItem('kay_lockcount', lockCount);
            const lockSeconds = Math.min(30 * Math.pow(2, lockCount - 1), 300);
            localStorage.setItem('kay_lock', Date.now() + lockSeconds * 1000);
            localStorage.removeItem('kay_attempts');
            addLog('fail', `Blok faollashtirildi: ${lockSeconds}s`);
            pinError.textContent = `5 marta xato! ${lockSeconds} soniya kuting.`;
        } else {
            pinError.textContent = msg || `Noto'g'ri PIN (${attempts}/5)`;
        }
        pinError.style.display = 'block';
        pinInput.value = '';
        pinInput.focus();
    }

    let res, data;
    try {
        // 1-qadam: Telegram 2FA (/admin/request-code) orqali PIN tekshirish va tasdiqlash kodini so'rash
        res = await fetch('/admin/request-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });
        data = await res.json().catch(() => ({}));
    } catch (e) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Kirish'; }
        addLog('fail', 'Server bilan bog\'lanib bo\'lmadi');
        pinError.textContent = 'Server bilan bog\'lanib bo\'lmadi';
        pinError.style.display = 'block';
        return;
    }

    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Kirish'; }

    // 1) PIN to'g'ri + Telegram kodi yuborildi → 2FA ekrani
    if (data.ok && data.sessionId) {
        localStorage.removeItem('kay_attempts');
        localStorage.removeItem('kay_lock');
        localStorage.removeItem('kay_lockcount');
        window.__authSession = { sessionId: data.sessionId, pin };
        showTgScreen();
        addLog('success', 'PIN to\'g\'ri — Telegramga kod yuborildi');
        return;
    }

    // 2) Telegram sozlanmagan yoki local server → PIN ni /check-pin orqali SERVERDA tasdiqlaymiz
    if (data.configured === false || res.status === 404 || (res.status === 503 && /telegram/i.test(data.message || ''))) {
        try {
            const cp = await fetch('/check-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin })
            });
            const cpData = await cp.json().catch(() => ({}));
            if (cpData.success) {
                localStorage.removeItem('kay_attempts');
                localStorage.removeItem('kay_lock');
                localStorage.removeItem('kay_lockcount');
                addLog('info', 'Telegram sozlanmagan — PIN bilan kirildi (legacy)');
                sessionStorage.setItem('kay_admin', 'true');
                if (cpData.token) {
                    sessionStorage.setItem('kay_admin_token', cpData.token);
                    localStorage.setItem('kay_admin_token', cpData.token);
                    localStorage.setItem('abdu_user_token', cpData.token);
                    try {
                        const domain = (window.location.hostname.endsWith('abdugofforov.uz')) ? '; Domain=.abdugofforov.uz' : '';
                        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
                        const expires = new Date(Date.now() + 30 * 864e5).toUTCString();
                        document.cookie = `abdu_session_token=${encodeURIComponent(cpData.token)}; Expires=${expires}; Path=/; SameSite=Lax${domain}${secure}`;
                        document.cookie = `kay_admin_token=${encodeURIComponent(cpData.token)}; Expires=${expires}; Path=/; SameSite=Lax${domain}${secure}`;
                    } catch (_) {}
                }
                const adminUser = {
                    id: 'abdugofforov',
                    name: "Abdug'afforov",
                    username: 'abdugofforov',
                    role: 'admin'
                };
                localStorage.setItem('abdu_user_data', JSON.stringify(adminUser));
                sessionStorage.setItem('kay_admin_pin', pin);
                showAdminPanel();
            } else {
                registerWrongPin(cpData.message);
            }
        } catch (e) {
            pinError.textContent = 'Server bilan bog\'lanib bo\'lmadi';
            pinError.style.display = 'block';
        }
        return;
    }

    // 3) PIN noto'g'ri (401)
    if (res.status === 401) {
        registerWrongPin(data.message);
        return;
    }

    // 4) Boshqa server xatosi
    pinError.textContent = data.message || 'Server xatosi';
    pinError.style.display = 'block';
    pinInput.value = '';
}

document.getElementById('pin-submit-btn')?.addEventListener('click', tryLogin);
pinInput?.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

// ===== TELEGRAM 2FA EKRANI =====
function showPinScreen() {
    document.getElementById('tg-screen').style.display = 'none';
    document.getElementById('pin-screen').style.display = 'block';
    pinInput.value = '';
    pinError.style.display = 'none';
    pinInput.focus();
}

function showTgScreen() {
    document.getElementById('pin-screen').style.display = 'none';
    document.getElementById('tg-screen').style.display = 'block';
    const tgInput = document.getElementById('tg-code-input');
    const tgErr = document.getElementById('tg-error');
    tgInput.value = '';
    tgErr.style.display = 'none';
    tgInput.focus();
    startTgCountdown();
}

let tgCountdownTimer = null;
function startTgCountdown() {
    const attemptsEl = document.getElementById('tg-attempts');
    let secs = 300; // 5 daqiqa
    if (tgCountdownTimer) clearInterval(tgCountdownTimer);
    function tick() {
        if (secs <= 0) {
            attemptsEl.textContent = '⏱ Kod eskirdi — qaytadan yuboring';
            clearInterval(tgCountdownTimer);
            return;
        }
        const mm = Math.floor(secs / 60);
        const ss = (secs % 60).toString().padStart(2, '0');
        attemptsEl.textContent = `Kod amal qilish muddati: ${mm}:${ss}`;
        secs--;
    }
    tick();
    tgCountdownTimer = setInterval(tick, 1000);
}

async function verifyTgCode() {
    const tgInput = document.getElementById('tg-code-input');
    const tgErr = document.getElementById('tg-error');
    const submitBtn = document.getElementById('tg-submit-btn');

    const code = (tgInput.value || '').trim();
    if (!/^\d{6}$/.test(code)) {
        tgErr.textContent = "Kod 6 xonali raqam bo'lishi kerak";
        tgErr.style.display = 'block';
        return;
    }
    if (!window.__authSession || !window.__authSession.sessionId) {
        tgErr.textContent = 'Sessiya yo\'q — qaytadan PIN kiriting';
        tgErr.style.display = 'block';
        setTimeout(showPinScreen, 1500);
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Tekshirilmoqda...';

    try {
        const res = await fetch('/admin/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: window.__authSession.sessionId,
                code,
            })
        });
        const data = await res.json().catch(() => ({}));

        if (data.ok && data.token) {
            sessionStorage.setItem('kay_admin', 'true');
            sessionStorage.setItem('kay_admin_token', data.token);
            localStorage.setItem('kay_admin_token', data.token);
            localStorage.setItem('abdu_user_token', data.token);
            sessionStorage.setItem('kay_admin_pin', window.__authSession.pin);
            try {
                const domain = (window.location.hostname.endsWith('abdugofforov.uz')) ? '; Domain=.abdugofforov.uz' : '';
                const secure = window.location.protocol === 'https:' ? '; Secure' : '';
                const expires = new Date(Date.now() + 30 * 864e5).toUTCString();
                document.cookie = `abdu_session_token=${encodeURIComponent(data.token)}; Expires=${expires}; Path=/; SameSite=Lax${domain}${secure}`;
                document.cookie = `kay_admin_token=${encodeURIComponent(data.token)}; Expires=${expires}; Path=/; SameSite=Lax${domain}${secure}`;
            } catch (_) {}
            const adminUser = {
                id: 'abdugofforov',
                name: "Abdug'afforov",
                username: 'abdugofforov',
                role: 'admin'
            };
            localStorage.setItem('abdu_user_data', JSON.stringify(adminUser));
            window.__authSession = null;
            if (tgCountdownTimer) clearInterval(tgCountdownTimer);
            addLog('success', 'Telegram tasdiqlandi — admin panel ochildi');
            showAdminPanel();
        } else {
            tgErr.textContent = data.message || "Kod noto'g'ri";
            tgErr.style.display = 'block';
            tgInput.value = '';
            tgInput.focus();
            addLog('fail', "Telegram kod noto'g'ri");
            if (res.status === 429 || /eskirgan|topilmadi/i.test(data.message || '')) {
                setTimeout(showPinScreen, 1800);
            }
        }
    } catch (e) {
        tgErr.textContent = "Tarmoq xatosi: " + (e.message || 'bog\'lanib bo\'lmadi');
        tgErr.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Tasdiqlash';
    }
}

async function resendTgCode() {
    if (!window.__authSession || !window.__authSession.pin) {
        showPinScreen();
        return;
    }
    const btn = document.getElementById('tg-resend-btn');
    const tgErr = document.getElementById('tg-error');
    btn.disabled = true;
    btn.textContent = 'Yuborilmoqda...';
    try {
        const res = await fetch('/admin/request-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: window.__authSession.pin })
        });
        const data = await res.json().catch(() => ({}));
        if (data.ok && data.sessionId) {
            window.__authSession.sessionId = data.sessionId;
            tgErr.textContent = "";
            tgErr.style.display = 'none';
            startTgCountdown();
            addLog('info', 'Telegramga yangi kod yuborildi');
        } else {
            tgErr.textContent = data.message || "Qayta yuborishda xato";
            tgErr.style.display = 'block';
        }
    } catch (e) {
        tgErr.textContent = "Tarmoq xatosi";
        tgErr.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = '🔄 Qayta yuborish';
    }
}

document.getElementById('tg-submit-btn')?.addEventListener('click', verifyTgCode);
document.getElementById('tg-code-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') verifyTgCode();
});
document.getElementById('tg-code-input')?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
});
document.getElementById('tg-resend-btn')?.addEventListener('click', resendTgCode);
document.getElementById('tg-cancel-btn')?.addEventListener('click', () => {
    if (tgCountdownTimer) clearInterval(tgCountdownTimer);
    window.__authSession = null;
    showPinScreen();
});

function checkLock() {
    const lockUntil = parseInt(localStorage.getItem('kay_lock') || '0');
    if (Date.now() < lockUntil) {
        const s = Math.ceil((lockUntil - Date.now()) / 1000);
        pinAttempts.textContent = `Bloklangan: ${s}s`;
        setTimeout(checkLock, 1000);
    } else {
        pinAttempts.textContent = '';
    }
}
checkLock();

// ===== ADMIN PANEL ASOSIY EKRANI =====
function showAdminPanel() {
    try {
        const pinScreen = document.getElementById('pin-screen');
        if (pinScreen) pinScreen.style.display = 'none';

        const tg = document.getElementById('tg-screen');
        if (tg) tg.style.display = 'none';

        if (typeof tgCountdownTimer !== 'undefined' && tgCountdownTimer) {
            clearInterval(tgCountdownTimer);
            tgCountdownTimer = null;
        }

        const adminScreen = document.getElementById('admin-screen');
        if (adminScreen) adminScreen.classList.add('show');

        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech';
        const greetingEl = document.getElementById('admin-greeting');
        if (greetingEl) greetingEl.textContent = `${greeting}, Akromjon 👋`;

        const dateEl = document.getElementById('glz-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        try { loadDashboardAndRealData(); } catch (e) { console.warn('Dashboard data yuklashda xato:', e); }
        try { loadTasks(); } catch (e) { console.warn('Tasks yuklashda xato:', e); }
        try { loadProjects(); } catch (e) {}
        try { loadQuotes(); } catch (e) {}
        try { loadSettingsInputs(); } catch (e) {}
        try { loadSecurityLog(); } catch (e) { console.warn('Security log yuklashda xato:', e); }
    } catch (err) {
        console.error('showAdminPanel error:', err);
        // Favqulodda holat: hech qachon bo'sh ekran qolib ketmasin
        const pinScreen = document.getElementById('pin-screen');
        if (pinScreen) pinScreen.style.display = 'block';
    }
}

// ===== PANIC LOGOUT (FAVQULODDA CHIQISH) =====
async function triggerPanicLogout() {
    try {
        // Sessiya va mahalliy tokenlarni to'liq tozalash
        sessionStorage.removeItem('kay_admin');
        sessionStorage.removeItem('kay_admin_token');
        sessionStorage.removeItem('kay_admin_pin');
        sessionStorage.removeItem('abdu_user_token');
        localStorage.removeItem('kay_admin');
        localStorage.removeItem('kay_admin_token');
        localStorage.removeItem('kay_admin_pin');
        localStorage.removeItem('abdu_user_token');

        // Serverda sessiyani bekor qilish
        try {
            await fetch('/auth/logout', {
                method: 'POST',
                headers: _adminHeaders({ 'Content-Type': 'application/json' })
            });
        } catch (_) {}
    } catch (e) {
        console.warn('Panic logout xatosi:', e);
    } finally {
        // Bosh sahifaga yo'naltirish
        window.location.replace('/');
    }
}

document.getElementById('panic-logout-btn')?.addEventListener('click', triggerPanicLogout);
document.getElementById('logout-btn')?.addEventListener('click', triggerPanicLogout);

// ===== REAL DATA & DASHBOARD STATISTIKA =====
function _adminHeaders(extra) {
    const h = Object.assign({}, extra || {});
    const token = sessionStorage.getItem('kay_admin_token') || localStorage.getItem('kay_admin_token') || localStorage.getItem('abdu_token') || sessionStorage.getItem('abdu_token') || '';
    const pin = sessionStorage.getItem('kay_admin_pin') || localStorage.getItem('kay_admin_pin') || '';
    if (token) {
        h['x-admin-token'] = token;
        h['x-user-token'] = token;
        h['Authorization'] = 'Bearer ' + token;
    }
    if (pin) {
        h['x-admin-pin'] = pin;
        h['x-pin'] = pin;
    }
    return h;
}

async function safeAdminFetch(primaryUrl, fallbackUrl, options = {}) {
    const opts = Object.assign({}, options);
    opts.headers = _adminHeaders(opts.headers || {});
    try {
        const res = await fetch(primaryUrl, opts);
        if (res && res.ok) return res;
        if (fallbackUrl) {
            const fbRes = await fetch(fallbackUrl, opts);
            if (fbRes && fbRes.ok) return fbRes;
            return fbRes || res;
        }
        return res;
    } catch (err) {
        if (fallbackUrl) {
            try {
                return await fetch(fallbackUrl, opts);
            } catch (_) {
                return null;
            }
        }
        return null;
    }
}

function _esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function loadDashboardAndRealData(forceRefresh = false) {
    const recentBox = document.getElementById('dash-recent-results');
    const dbStatusEl = document.getElementById('dash-status-db');
    const testsStatusEl = document.getElementById('dash-status-tests');

    try {
        // Parallel so'rov: Tizim statistikasi, Foydalanuvchilar, Postlar, Natijalar, Loyihalar, Iqtiboslar, Rejalar
        const [statsRes, usersRes, postsRes, resultsRes, projectsRes, quotesRes, tasksRes] = await Promise.all([
            safeAdminFetch('/api/admin/stats', '/admin/stats'),
            safeAdminFetch('/api/admin/users', '/admin/users'),
            safeAdminFetch('/api/admin/posts', '/posts'),
            safeAdminFetch('/api/admin/results', '/results'),
            safeAdminFetch('/api/admin/projects', '/projects'),
            safeAdminFetch('/api/admin/quotes', '/quotes'),
            safeAdminFetch('/api/admin/tasks', '/tasks')
        ]);

        if (statsRes && statsRes.ok) {
            const sData = await statsRes.json().catch(() => ({}));
            if (sData.ok && sData.stats) {
                cachedLiveStats = sData.stats;
            }
        }

        if (usersRes && usersRes.ok) {
            const uData = await usersRes.json().catch(() => ({}));
            if (uData.ok && Array.isArray(uData.users)) {
                cachedUsers = uData.users;
                if (dbStatusEl) { dbStatusEl.textContent = 'Ulangan'; dbStatusEl.className = 'glz-ok'; }
            }
        }

        if (postsRes && postsRes.ok) {
            const pData = await postsRes.json().catch(() => ({}));
            const pList = pData.ok && Array.isArray(pData.posts) ? pData.posts : (Array.isArray(pData) ? pData : null);
            if (pList) {
                cachedPosts = pList;
                try { localStorage.setItem('abdu_posts', JSON.stringify(pList)); } catch (_) {}
            }
        } else {
            try {
                const lp = JSON.parse(localStorage.getItem('abdu_posts') || '[]');
                if (Array.isArray(lp)) cachedPosts = lp;
            } catch (_) {}
        }

        if (resultsRes && resultsRes.ok) {
            const rData = await resultsRes.json().catch(() => ({}));
            if (rData.ok && Array.isArray(rData.results)) {
                cachedResults = rData.results;
                if (testsStatusEl) { testsStatusEl.textContent = 'Faol'; testsStatusEl.className = 'glz-ok'; }
            }
        }

        if (projectsRes && projectsRes.ok) {
            const projData = await projectsRes.json().catch(() => ({}));
            if (projData.ok && Array.isArray(projData.projects) && projData.projects.length) {
                try { localStorage.setItem('abdu_portfolio', JSON.stringify(projData.projects)); } catch (_) {}
            }
        }

        if (quotesRes && quotesRes.ok) {
            const qData = await quotesRes.json().catch(() => ({}));
            if (qData.ok && Array.isArray(qData.quotes) && qData.quotes.length) {
                try { localStorage.setItem('abdu_quotes', JSON.stringify(qData.quotes)); } catch (_) {}
            }
        }

        if (tasksRes && tasksRes.ok) {
            const tData = await tasksRes.json().catch(() => ({}));
            if (tData.ok && Array.isArray(tData.tasks)) {
                try { localStorage.setItem('abdu_tasks', JSON.stringify(tData.tasks)); } catch (_) {}
            }
        }

        renderRealDataMetrics();
    } catch (e) {
        console.warn('Dashboard real data yuklashda xato:', e);
        if (recentBox) {
            recentBox.innerHTML = '<div class="glz-empty" style="color:#f87171;">Serverga ulanishda xatolik yuz berdi</div>';
        }
    }
}

function renderRealDataMetrics() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    const totalStudents = cachedLiveStats?.usersCount ?? cachedUsers.length;
    const totalPosts = cachedLiveStats?.postsCount ?? cachedPosts.length;
    const totalTests = cachedLiveStats?.testsCount ?? cachedLiveStats?.resultsCount ?? cachedResults.length;
    const avgScore = totalTests && cachedResults.length ? Math.round(cachedResults.reduce((s, r) => s + (r.pct || 0), 0) / cachedResults.length) : 0;
    const highScores = cachedResults.filter(r => (r.pct || 0) >= 80).length;
    const projects = typeof getProjects === 'function' ? getProjects() : [];
    const quotes = typeof getQuotes === 'function' ? getQuotes() : [];

    // Creator Studio Quick Actions: Jonli Statistika (Users, Posts, Tests)
    set('quick-stat-users', totalStudents);
    set('quick-stat-posts', totalPosts);
    set('quick-stat-tests', totalTests);
    set('posts-count-badge', `${totalPosts} ta`);

    // Sidebar ko'rsatkichlari
    set('side-posts', totalPosts);
    set('side-students', totalStudents);
    set('side-tests', totalTests);

    // Dashboard 6 ta karta
    set('stat-posts', totalPosts);
    set('stat-students', totalStudents);
    set('stat-projects', projects.length);
    set('stat-tasks', getTasks().filter(t => t.status !== 'done').length);
    set('stat-quotes', quotes.length);
    set('stat-avg-score', `${avgScore}%`);

    // Foydalanuvchilar va Natijalar sahifasi
    set('students-count', totalStudents);
    set('results-count', totalTests);
    set('students-avg-score', `${avgScore}%`);
    set('results-high-count', highScores);
    set('projects-count-badge', `${projects.length} ta loyiha`);
    set('quotes-count-badge', `${quotes.length} ta hikmat`);

    // Dashboard — So'nggi test natijalari (jonli oqim)
    const recentBox = document.getElementById('dash-recent-results');
    if (recentBox) {
        if (!cachedResults.length) {
            recentBox.innerHTML = '<div class="glz-empty">Hali test topshirilmagan</div>';
        } else {
            const top5 = cachedResults.slice(0, 5);
            recentBox.innerHTML = top5.map(r => {
                const d = new Date(r.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                const isGreat = r.pct >= 80;
                const isMedium = r.pct >= 60;
                const color = isGreat ? '#34d399' : (isMedium ? '#fbbf24' : '#f87171');
                const bg = isGreat ? 'rgba(52,211,153,0.15)' : (isMedium ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)');

                return `
                <div class="glz-mini-row" style="padding:10px 0;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;">
                    <div style="min-width:0;flex:1;margin-right:12px;">
                        <strong style="font-size:13px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${_esc(r.name)} <span style="font-size:11px;color:var(--text-muted);font-weight:400;">(@${_esc(r.username)})</span>
                        </strong>
                        <small style="color:var(--text-secondary);font-size:11px;">${_esc(r.testTitle || r.testId)} • ${d}</small>
                    </div>
                    <div style="text-align:right;flex-shrink:0;">
                        <span style="display:inline-block;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:700;color:${color};background:${bg};">
                            ${r.pct}% (${r.score}/${(r.score || 0) + (r.wrong || 0)})
                        </span>
                    </div>
                </div>`;
            }).join('');
        }
    }

    // Jadval va ro'yxatlarni to'ldirish
    renderStudentsList();
    renderResultsTable();
}

function renderStudentsList(filterQuery = '') {
    const usersBox = document.getElementById('students-list');
    if (!usersBox) return;

    let users = cachedUsers;
    const q = (filterQuery || '').trim().toLowerCase();
    if (q) {
        users = users.filter(u =>
            (u.name || '').toLowerCase().includes(q) ||
            (u.username || '').toLowerCase().includes(q)
        );
    }

    const adminNames = ['abdugofforov', 'admin', 'akrin4477', 'akrin'];
    const adminCount = users.filter(u => u.role === 'admin' || (u.username && adminNames.includes(u.username.toLowerCase()))).length;
    const adminCountEl = document.getElementById('admins-count');
    if (adminCountEl) adminCountEl.textContent = adminCount;

    const studentsCountEl = document.getElementById('students-count');
    if (studentsCountEl) studentsCountEl.textContent = cachedUsers.length;
    const sideStudents = document.getElementById('side-students');
    if (sideStudents) sideStudents.textContent = cachedUsers.length;
    const statStudents = document.getElementById('stat-students');
    if (statStudents) statStudents.textContent = cachedUsers.length;
    const quickStatUsers = document.getElementById('quick-stat-users');
    if (quickStatUsers) quickStatUsers.textContent = cachedUsers.length;

    if (!users.length) {
        usersBox.innerHTML = `<p style="color:#9aa;font-size:13px;padding:16px;text-align:center;">${q ? 'Qidiruv bo\'yicha foydalanuvchi topilmadi.' : 'Hali hech kim ro\'yxatdan o\'tmagan.'}</p>`;
        return;
    }

    usersBox.innerHTML = `<table class="cyber-table">
        <thead>
            <tr>
                <th>Foydalanuvchi</th>
                <th>Username</th>
                <th>Rol</th>
                <th>Ro'yxatdan o'tgan</th>
                <th style="text-align:right;">Amallar</th>
            </tr>
        </thead>
        <tbody>
            ${users.map(u => {
                const d = u.createdAt ? new Date(u.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                const isAdmin = u.role === 'admin' || (u.username && adminNames.includes(u.username.toLowerCase()));
                const initial = (u.name || u.username || 'U').charAt(0).toUpperCase();

                return `
                <tr>
                    <td style="font-weight:600;">
                        <span class="user-table-avatar">${initial}</span>
                        ${_esc(u.name || u.username)}
                    </td>
                    <td style="color:#2dd4bf;font-weight:500;">@${_esc(u.username)}</td>
                    <td>
                        <span class="cyber-badge ${isAdmin ? 'rose' : 'teal'}">${isAdmin ? 'Admin' : 'O\'quvchi'}</span>
                    </td>
                    <td style="color:#9aa;font-size:12px;">${d}</td>
                    <td style="text-align:right;white-space:nowrap;">
                        <button type="button" class="btn-secondary" data-action="toggle-user-role" data-username="${_esc(u.username)}" data-role="${isAdmin ? 'admin' : 'student'}" style="padding:4px 8px;font-size:12px;margin-right:6px;" title="Rolni almashtirish">
                            🔄 Rol
                        </button>
                        <button type="button" class="btn-secondary" data-action="open-reset-password" data-username="${_esc(u.username)}" data-name="${_esc(u.name)}" style="padding:4px 10px;font-size:12px;margin-right:6px;">
                            🔑 Parol
                        </button>
                        ${!isAdmin ? `
                        <button type="button" class="btn-secondary btn-danger" data-action="delete-user" data-username="${_esc(u.username)}" style="padding:4px 8px;font-size:12px;" title="O'chirish">
                            🗑️
                        </button>` : ''}
                    </td>
                </tr>`;
            }).join('')}
        </tbody>
    </table>`;
}

async function loadUsers(filterQuery = '', forceRefresh = false) {
    const usersBox = document.getElementById('students-list');
    if (forceRefresh || !cachedUsers || !cachedUsers.length) {
        if (usersBox && (!cachedUsers || !cachedUsers.length)) {
            usersBox.innerHTML = '<div class="glz-empty" style="padding:20px;text-align:center;">Foydalanuvchilar ro\'yxati yuklanmoqda...</div>';
        }
        try {
            const res = await safeAdminFetch('/api/admin/users', '/admin/users');
            if (res && res.ok) {
                const uData = await res.json().catch(() => ({}));
                if (uData.ok && Array.isArray(uData.users)) {
                    cachedUsers = uData.users;
                }
            }
        } catch (e) {
            console.warn('Users load error:', e);
        }
    }
    renderStudentsList(filterQuery);
    renderRealDataMetrics();
}

function renderResultsTable(filterQuery = '') {
    const resultsBox = document.getElementById('results-table');
    if (!resultsBox) return;

    let results = cachedResults;
    const q = (filterQuery || '').trim().toLowerCase();
    if (q) {
        results = results.filter(r =>
            (r.name || '').toLowerCase().includes(q) ||
            (r.username || '').toLowerCase().includes(q) ||
            (r.testTitle || r.testId || '').toLowerCase().includes(q)
        );
    }

    if (!results.length) {
        resultsBox.innerHTML = `<p style="color:#9aa;font-size:13px;padding:16px;text-align:center;">${q ? 'Qidiruv bo\'yicha natijalar topilmadi.' : 'Hali test topshirilmagan.'}</p>`;
        return;
    }

    resultsBox.innerHTML = `<table class="cyber-table">
        <thead>
            <tr>
                <th>O'quvchi</th>
                <th>Username</th>
                <th>Test Nomi</th>
                <th style="text-align:center;">To'g'ri</th>
                <th style="text-align:center;">Xato</th>
                <th style="text-align:center;">Natija</th>
                <th>Sana</th>
                <th style="text-align:right;">Amallar</th>
            </tr>
        </thead>
        <tbody>
            ${results.map((r, idx) => {
                const d = new Date(r.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                const isGreat = r.pct >= 80;
                const isMed = r.pct >= 60;
                const color = isGreat ? '#34d399' : (isMed ? '#fbbf24' : '#f87171');
                const bg = isGreat ? 'rgba(52,211,153,0.12)' : (isMed ? 'rgba(251,191,36,0.12)' : 'rgba(248,113,113,0.12)');

                return `
                <tr>
                    <td style="font-weight:600;">${_esc(r.name)}</td>
                    <td style="color:#9aa;">@${_esc(r.username)}</td>
                    <td style="font-weight:500;">${_esc(r.testTitle || r.testId)}</td>
                    <td style="color:#34d399;font-weight:700;text-align:center;">${r.score}</td>
                    <td style="color:#f87171;font-weight:700;text-align:center;">${r.wrong}</td>
                    <td style="text-align:center;">
                        <span style="display:inline-block;padding:2px 8px;border-radius:10px;font-weight:700;font-size:12px;color:${color};background:${bg};">
                            ${r.pct}%
                        </span>
                    </td>
                    <td style="color:#9aa;font-size:12px;white-space:nowrap;">${d}</td>
                    <td style="text-align:right;">
                        <button type="button" class="icon-btn danger" data-action="delete-result" data-id="${idx}" title="Natijani o'chirish" style="width:30px;height:30px;font-size:12px;">
                            🗑️
                        </button>
                    </td>
                </tr>`;
            }).join('')}
        </tbody>
    </table>`;
}

// Foydalanuvchi rolini o'zgartirish
async function toggleUserRole(username, currentRole) {
    if (!username) return;
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!confirm(`@${username} foydalanuvchisi rolini "${newRole === 'admin' ? 'Admin' : 'O\'quvchi'}" ga o'zgartirishni tasdiqlaysizmi?`)) return;

    try {
        const res = await safeAdminFetch(
            `/api/admin/users/${encodeURIComponent(username)}/role`,
            `/admin/users/${encodeURIComponent(username)}/role`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, role: newRole })
            }
        );
        const data = res ? await res.json().catch(() => ({})) : null;
        if (data && data.ok) {
            showToast(`@${username} roli "${newRole}" ga o'zgartirildi! ✅`, 'success');
        } else {
            showToast((data && data.error) || 'Rolni o\'zgartirib bo\'lmadi', 'error');
        }
        const u = cachedUsers.find(item => (item.username || '').toLowerCase() === username.toLowerCase());
        if (u) u.role = newRole;
        renderStudentsList();
        renderRealDataMetrics();
        addLog('info', `@${username} roli yangilandi: ${newRole}`);
    } catch (e) {
        console.error('Toggle role error:', e);
        showToast('Rolni o\'zgartirishda xatolik yuz berdi', 'error');
    }
}

// Foydalanuvchini o'chirish
async function deleteUser(username) {
    if (!username) return;
    if (!confirm(`@${username} foydalanuvchisini o'chirishni tasdiqlaysizmi?`)) return;

    try {
        await safeAdminFetch(
            `/api/admin/users/${encodeURIComponent(username)}`,
            `/admin/users/${encodeURIComponent(username)}`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            }
        );

        cachedUsers = cachedUsers.filter(u => (u.username || '').toLowerCase() !== username.toLowerCase());
        renderStudentsList();
        renderRealDataMetrics();
        addLog('info', `Foydalanuvchi o'chirildi: @${username}`);
        showToast(`@${username} foydalanuvchisi o'chirildi! 🗑️`, 'info');
    } catch (e) {
        console.error('Delete user error:', e);
        showToast('O\'chirishda xatolik yuz berdi', 'error');
    }
}

// Test natijasini o'chirish
async function deleteResult(idx) {
    const num = Number(idx);
    if (isNaN(num) || !cachedResults[num]) return;
    if (!confirm('Ushbu test natijasini o\'chirishni tasdiqlaysizmi?')) return;

    const item = cachedResults[num];
    const targetId = item ? (item.id || item._id || num) : num;
    safeAdminFetch(
        `/api/admin/results/${encodeURIComponent(targetId)}`,
        `/results?id=${encodeURIComponent(targetId)}`,
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: targetId, action: 'delete' })
        }
    ).catch(() => {});

    cachedResults.splice(num, 1);
    renderResultsTable();
    renderRealDataMetrics();
    addLog('info', 'Test natijasi o\'chirildi');
    showToast('Test natijasi o\'chirildi! 🗑️', 'info');
}

// Barcha test natijalarini tozalash
async function clearAllResults() {
    if (!cachedResults.length) {
        showToast('Natijalar allaqachon bo\'sh', 'info');
        return;
    }
    if (!confirm('Barcha test natijalarini tozalashni tasdiqlaysizmi? Bu amalni ortga qaytarib bo\'lmaydi.')) return;

    safeAdminFetch(
        '/api/admin/results',
        '/results?all=true',
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ all: true, action: 'clear_all' })
        }
    ).catch(() => {});

    cachedResults = [];
    renderResultsTable();
    renderRealDataMetrics();
    addLog('info', 'Barcha test natijalari tozalandi');
    showToast('Barcha test natijalari tozalandi! 🗑️', 'success');
}

// ===== PAROLNI O'ZGARTIRISH (ADMIN) =====
function openResetPasswordModal(username, name) {
    const modal = document.getElementById('reset-password-modal');
    const userSpan = document.getElementById('reset-modal-username');
    const nameSpan = document.getElementById('reset-modal-name');
    const targetInput = document.getElementById('reset-target-username');
    const passInput = document.getElementById('reset-new-password');
    const msgEl = document.getElementById('reset-modal-msg');

    if (userSpan) userSpan.textContent = '@' + username;
    if (nameSpan) nameSpan.textContent = name || username;
    if (targetInput) targetInput.value = username;
    if (passInput) passInput.value = '';
    if (msgEl) { msgEl.style.display = 'none'; msgEl.textContent = ''; }

    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => passInput?.focus(), 100);
    }
}

function closeResetPasswordModal() {
    const modal = document.getElementById('reset-password-modal');
    if (modal) modal.style.display = 'none';
}

async function handleResetPasswordSubmit(e) {
    e.preventDefault();
    const targetUsername = document.getElementById('reset-target-username')?.value;
    const newPassword = document.getElementById('reset-new-password')?.value;
    const submitBtn = document.getElementById('reset-modal-submit-btn');
    const msgEl = document.getElementById('reset-modal-msg');

    if (!targetUsername || !newPassword || newPassword.length < 4) {
        if (msgEl) {
            msgEl.textContent = "Parol kamida 4 ta belgidan iborat bo'lishi kerak";
            msgEl.style.color = '#f87171';
            msgEl.style.background = 'rgba(248,113,113,0.1)';
            msgEl.style.display = 'block';
        }
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saqlanmoqda...';
    }

    try {
        const res = await fetch('/admin/reset-password', {
            method: 'POST',
            headers: _adminHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ username: targetUsername, newPassword })
        });
        const data = await res.json().catch(() => ({}));

        if (data.ok) {
            if (msgEl) {
                msgEl.textContent = '✅ ' + (data.message || 'Parol muvaffaqiyatli o\'zgartirildi');
                msgEl.style.color = '#34d399';
                msgEl.style.background = 'rgba(52,211,153,0.1)';
                msgEl.style.display = 'block';
            }
            addLog('success', `@${targetUsername} foydalanuvchi paroli o'zgartirildi`);
            setTimeout(() => {
                closeResetPasswordModal();
            }, 1200);
        } else {
            if (msgEl) {
                msgEl.textContent = '❌ ' + (data.message || 'Xatolik yuz berdi');
                msgEl.style.color = '#f87171';
                msgEl.style.background = 'rgba(248,113,113,0.1)';
                msgEl.style.display = 'block';
            }
        }
    } catch (err) {
        if (msgEl) {
            msgEl.textContent = '❌ Server bilan bog\'lanishda xatolik';
            msgEl.style.color = '#f87171';
            msgEl.style.background = 'rgba(248,113,113,0.1)';
            msgEl.style.display = 'block';
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Saqlash';
        }
    }
}

// ===== INTERAKTIV REJALAR (TASKS) =====
// Server va frontend status nomlarini sinxronlashtirish
function normalizeTaskStatus(status) {
    const map = { 'in_progress': 'progress', 'completed': 'done', 'pending': 'todo' };
    return map[status] || status || 'todo';
}
function toServerStatus(status) {
    const map = { 'progress': 'in_progress', 'done': 'completed' };
    return map[status] || status || 'todo';
}
function normalizeTasks(tasks) {
    if (!Array.isArray(tasks)) return [];
    return tasks.map(t => ({ ...t, status: normalizeTaskStatus(t.status) }));
}

function getTasks() {
    const raw = localStorage.getItem('abdu_tasks');
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return normalizeTasks(parsed);
        } catch (e) {
            // parse error
        }
    }
    // Bo'sh massiv qaytarish — hardcoded default rejalar yo'q
    return [];
}

function saveTasks(tasks) {
    const normalized = normalizeTasks(tasks);
    localStorage.setItem('abdu_tasks', JSON.stringify(normalized));
}

function loadTasks() {
    const tasks = getTasks();
    const list = document.getElementById('admin-task-list');

    const todo = tasks.filter(t => t.status === 'todo').length;
    const progress = tasks.filter(t => t.status === 'progress').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const activeTasks = todo + progress;
    const total = tasks.length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    // Hisoblagichlarni yangilash
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('count-todo', todo);
    set('count-progress', progress);
    set('count-done', done);
    set('stat-tasks', activeTasks);
    set('side-tasks', activeTasks);
    set('chart-percentage-text', `${pct}%`);

    const circle = document.getElementById('progress-ring-circle');
    if (circle) {
        circle.style.strokeDashoffset = 314.16 - (314.16 * pct / 100);
    }

    if (!list) return;

    // Filtrlash
    let filtered = tasks;
    if (currentTaskFilter !== 'all') {
        filtered = filtered.filter(t => t.status === currentTaskFilter);
    }

    const q = (document.getElementById('admin-search')?.value || '').trim().toLowerCase();
    if (q) {
        filtered = filtered.filter(t => (t.title || '').toLowerCase().includes(q));
    }

    if (!filtered.length) {
        list.innerHTML = `<div class="glz-empty">${q ? 'Qidiruv bo\'yicha reja topilmadi' : (currentTaskFilter === 'all' ? 'Hozircha reja yo\'q. Yangi reja qo\'shing!' : 'Ushbu bo\'limda reja yo\'q.')}</div>`;
        return;
    }

    const badgeData = {
        todo: { cls: 'todo', label: '🔴 Bajariladigan', next: 'progress' },
        progress: { cls: 'progress', label: '🟡 Jarayonda', next: 'done' },
        done: { cls: 'done', label: '🟢 Bajarildi', next: 'todo' }
    };

    list.innerHTML = filtered.map(t => {
        const b = badgeData[t.status] || badgeData.todo;
        const isDone = t.status === 'done';
        const dStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }) : '';

        return `
        <div class="glz-row" style="padding:14px 16px;display:flex;align-items:center;gap:12px;border-radius:12px;">
            <button type="button" class="task-status-badge ${b.cls}" data-action="cycle-task-status" data-id="${t.id}" title="Holatni o'zgartirish uchun bosing">
                ${b.label}
            </button>
            <div class="info" style="flex:1;min-width:0;">
                <span class="${isDone ? 'task-title-done' : ''}" style="font-size:14px;font-weight:500;display:block;word-break:break-word;">
                    ${_esc(t.title)}
                </span>
                ${dStr ? `<span style="font-size:11px;color:var(--text-muted);">${dStr} qo'shildi</span>` : ''}
            </div>
            <div class="acts" style="display:flex;gap:6px;flex-shrink:0;">
                <button type="button" class="icon-btn" data-action="edit-task" data-id="${t.id}" title="Tahrirlash">✏️</button>
                <button type="button" class="icon-btn danger" data-action="delete-task" data-id="${t.id}" title="O'chirish">🗑️</button>
            </div>
        </div>`;
    }).join('');
}

async function cycleTaskStatus(id) {
    if (!id) return;
    const tasks = getTasks();
    const task = tasks.find(t => String(t.id) === String(id));
    if (!task) return;

    const cycleOrder = { todo: 'progress', progress: 'done', done: 'todo' };
    task.status = cycleOrder[task.status] || 'todo';
    task.updatedAt = Date.now();
    saveTasks(tasks);
    loadTasks();

    const payload = { id: task.id, status: toServerStatus(task.status), title: task.title };
    try {
        const res = await safeAdminFetch(
            `/api/admin/tasks/${encodeURIComponent(task.id)}`,
            '/tasks',
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );
        if (res && res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data && data.tasks && Array.isArray(data.tasks)) {
                saveTasks(data.tasks);
                loadTasks();
            }
        }
    } catch (_) {}

    addLog('info', `Reja holati o'zgartirildi: "${task.title.slice(0, 30)}..." -> ${task.status}`);
    const statusLabel = task.status === 'done' ? 'Bajarildi' : task.status === 'progress' ? 'Jarayonda' : 'Bajariladigan';
    showToast(`Reja holati yangilandi! (${statusLabel}) ✅`, 'success');
}

async function deleteTask(id) {
    if (!id) return;
    const tasks = getTasks();
    const task = tasks.find(t => String(t.id) === String(id));
    if (!task) return;

    if (confirm(`"${task.title}" rejasini o'chirishni tasdiqlaysizmi?`)) {
        const filtered = tasks.filter(t => String(t.id) !== String(id));
        saveTasks(filtered);
        loadTasks();

        try {
            const res = await safeAdminFetch(
                `/api/admin/tasks/${encodeURIComponent(id)}`,
                `/tasks?id=${encodeURIComponent(id)}`,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, action: 'delete' })
                }
            );
            if (res && res.ok) {
                const data = await res.json().catch(() => ({}));
                if (data && data.tasks && Array.isArray(data.tasks)) {
                    saveTasks(data.tasks);
                    loadTasks();
                }
            }
        } catch (_) {}

        addLog('info', `Reja o'chirildi: "${task.title.slice(0, 30)}..."`);
        showToast('Reja muvaffaqiyatli o\'chirildi! 🗑️', 'info');
    }
}

function editTask(id) {
    if (!id) return;
    const tasks = getTasks();
    const task = tasks.find(t => String(t.id) === String(id));
    if (!task) return;

    const titleInput = document.getElementById('task-title-input');
    const statusInput = document.getElementById('task-status-input');
    const editIdInput = document.getElementById('task-edit-id');
    const saveBtn = document.getElementById('task-save-btn');

    if (titleInput) titleInput.value = task.title;
    if (statusInput) statusInput.value = task.status;
    if (editIdInput) editIdInput.value = String(task.id);
    if (saveBtn) saveBtn.textContent = '💾 O\'zgarishni saqlash';

    titleInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    titleInput?.focus();
}

// Yangi reja kiritish yoki tahrirlash formasi
document.getElementById('admin-task-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const titleInput = document.getElementById('task-title-input');
    const statusInput = document.getElementById('task-status-input');
    const editIdInput = document.getElementById('task-edit-id');
    const saveBtn = document.getElementById('task-save-btn');

    const title = (titleInput?.value || '').trim();
    const status = statusInput?.value || 'todo';
    const editId = (editIdInput?.value || '').trim();

    if (!title) {
        showToast('Reja sarlavhasini kiriting!', 'error');
        return;
    }

    const tasks = getTasks();

    if (editId) {
        // Tahrirlash
        const existing = tasks.find(t => String(t.id) === String(editId));
        if (existing) {
            existing.title = title;
            existing.status = status;
            existing.updatedAt = Date.now();
            saveTasks(tasks);
            loadTasks();

            const payload = { id: editId, title, status: toServerStatus(status) };
            try {
                const res = await safeAdminFetch(
                    `/api/admin/tasks/${encodeURIComponent(editId)}`,
                    '/tasks',
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }
                );
                if (res && res.ok) {
                    const data = await res.json().catch(() => ({}));
                    if (data && data.tasks && Array.isArray(data.tasks)) {
                        saveTasks(data.tasks);
                        loadTasks();
                    }
                }
            } catch (_) {}

            addLog('info', `Reja tahrirlandi: "${title.slice(0, 30)}..."`);
            showToast('Reja muvaffaqiyatli saqlandi! 💾', 'success');
        }
    } else {
        // Yangi qo'shish
        const newTaskItem = {
            id: 'task_' + Date.now(),
            title,
            status,
            createdAt: Date.now()
        };
        tasks.unshift(newTaskItem);
        saveTasks(tasks);
        loadTasks();

        // Serverga yuborishda statusni server formatiga o'girish
        const serverPayload = { ...newTaskItem, status: toServerStatus(status) };
        try {
            const res = await safeAdminFetch(
                '/api/admin/tasks',
                '/tasks',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serverPayload)
                }
            );
            if (res && res.ok) {
                const data = await res.json().catch(() => ({}));
                if (data && data.tasks && Array.isArray(data.tasks)) {
                    saveTasks(data.tasks);
                    loadTasks();
                }
            }
        } catch (_) {}

        addLog('info', `Yangi reja kiritildi: "${title.slice(0, 30)}..."`);
        showToast('Yangi reja muvaffaqiyatli qo\'shildi! 🚀', 'success');
    }

    // Formani tozalash
    if (titleInput) titleInput.value = '';
    if (editIdInput) editIdInput.value = '';
    if (statusInput) statusInput.value = 'todo';
    if (saveBtn) saveBtn.textContent = '➕ Rejani saqlash';
});

// ===== LOYIHALAR VA IQTIBOSLAR STANDART MA'LUMOTLARI =====
const defaultProjects = [
    {
        id: 'proj_tools_lab',
        title: 'Tools Lab (Mikro-asboblar)',
        cat: 'Web Ilova & Asboblar',
        desc: "Keng qamrovli veb-muhandislik asboblari: WebP konvertori, JSON formatlovchi, Base64 dekoder va ranglar palitrasi.",
        tech: ['HTML5', 'Canvas', 'JavaScript', 'Tailwind'],
        link: '/tools',
        github: 'https://github.com/akrin4477/abdugofforov',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800'
    },
    {
        id: 'proj_deutsch_akademie',
        title: 'Deutsch Akademiya (Nemis Tili)',
        cat: "Ta'lim & Til O'rganish",
        desc: "A1 dan B2 gacha nemis tili testlari, audio talaffuzlar, 3D interaktiv fleshkardlar va kundalik mashg'ulotlar.",
        tech: ['Web Audio API', 'IndexedDB', 'CSS 3D', 'i18n'],
        link: '/deutsch',
        github: 'https://github.com/akrin4477/abdugofforov',
        image: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?q=80&w=800'
    },
    {
        id: 'proj_zen_studio',
        title: 'Zen Focus Studio',
        cat: 'Mahsuldorlik',
        desc: "Chalg'itmaydigan ijodiy matn muharriri va Pomodoro taymer vositasi.",
        tech: ['Local Storage', 'Minimalism', 'Productivity'],
        link: '/clock',
        github: 'https://github.com/akrin4477/abdugofforov',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800'
    }
];

const defaultQuotes = [
    {
        id: 'quote_1',
        quote: "Mantiq sizni A nuqtadan B nuqtaga olib boradi, tasavvur esa har qanday manzilga yetaklay oladi.",
        de: "Logik bringt dich von A nach B. Fantasie bringt dich überall hin.",
        author: "Albert Eynshteyn",
        cat: "ILHOM"
    },
    {
        id: 'quote_2',
        quote: "Kurashgan inson yutqazishi mumkin. Kurashmagan esa allaqachon mag'lubdir.",
        de: "Wer kämpft, kann verlieren. Wer nicht kämpft, hat schon verloren.",
        author: "Bertolt Brext",
        cat: "SHIDDAT"
    },
    {
        id: 'quote_3',
        quote: "Biz takror va takror nima qilsak, o'shamiz. Demak, yuksaklik — bu harakat emas, balki odatdir.",
        de: "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist daher keine Handlung, sondern eine Gewohnheit.",
        author: "Aristotel",
        cat: "ODATLAR"
    },
    {
        id: 'quote_4',
        quote: "Ming chaqirimlik yo'l ham birgina kichik qadam bilan boshlanadi.",
        de: "Auch eine Reise von tausend Meilen beginnt mit einem einzigen Schritt.",
        author: "Lao-szi",
        cat: "SABOT"
    }
];

// ===== TABLAR VA NAVIGATSIYA =====
function switchTab(targetTab) {
    if (!targetTab) return;

    // Barcha tab tugmalaridan active classni olib tashlash
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    // Sidebar va Dock dagi mos tablarni active qilish
    document.querySelectorAll(`.admin-tab[data-tab="${targetTab}"]`).forEach(t => t.classList.add('active'));

    // Contentni ochish
    const contentEl = document.getElementById('tab-' + targetTab);
    if (contentEl) contentEl.classList.add('active');

    // Tabga xos ma'lumotlarni yangilash
    if (targetTab === 'students' || targetTab === 'users') {
        loadUsers();
    } else if (targetTab === 'results') {
        renderResultsTable();
    } else if (targetTab === 'projects') {
        loadProjects();
    } else if (targetTab === 'quotes') {
        loadQuotes();
    } else if (targetTab === 'tasks') {
        loadTasks();
    } else if (targetTab === 'posts') {
        loadCreatorPosts();
    } else if (targetTab === 'dashboard') {
        renderRealDataMetrics();
    } else if (targetTab === 'settings') {
        loadSettingsInputs();
    } else if (targetTab === 'security') {
        loadSecurityLog();
    }

    const titleEl = document.getElementById('glz-page-title');
    const activeBtn = document.querySelector(`.admin-tab[data-tab="${targetTab}"]`);
    if (titleEl && activeBtn) {
        titleEl.textContent = activeBtn.dataset.title || activeBtn.querySelector('.dock-label')?.textContent || 'Boshqaruv Markazi';
    }

    // Mobil sidebarni yopish
    const sidebar = document.getElementById('glz-sidebar');
    if (sidebar) sidebar.classList.remove('open');
    const overlay = document.getElementById('glz-overlay');
    if (overlay) overlay.classList.remove('show');
}

document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// Mobil sidebar toggle
document.getElementById('glz-menu-toggle')?.addEventListener('click', () => {
    document.getElementById('glz-sidebar')?.classList.toggle('open');
    document.getElementById('glz-overlay')?.classList.toggle('show');
});
document.getElementById('glz-overlay')?.addEventListener('click', () => {
    document.getElementById('glz-sidebar')?.classList.remove('open');
    document.getElementById('glz-overlay')?.classList.remove('show');
});

// Qidiruv (Universal filter)
document.getElementById('admin-search')?.addEventListener('input', e => {
    const q = e.target.value.trim();
    const activeTab = document.querySelector('.tab-content.active')?.id;
    if (activeTab === 'tab-students' || activeTab === 'tab-users') {
        renderStudentsList(q);
    } else if (activeTab === 'tab-results') {
        renderResultsTable(q);
    } else if (activeTab === 'tab-projects') {
        loadProjects(q);
    } else if (activeTab === 'tab-quotes') {
        loadQuotes(q);
    } else if (activeTab === 'tab-tasks') {
        loadTasks();
    }
});

// ===== LOYIHALAR BOSHQARUVI (PROJECTS) =====
function getProjects() {
    try {
        const local = JSON.parse(localStorage.getItem('abdu_portfolio') || '[]');
        if (Array.isArray(local) && local.length) return local;
    } catch (_) {}
    localStorage.setItem('abdu_portfolio', JSON.stringify(defaultProjects));
    return defaultProjects;
}

function saveProjects(projects) {
    localStorage.setItem('abdu_portfolio', JSON.stringify(projects));
}

function loadProjects(filterQuery = '', fetchFromServer = false) {
    if (fetchFromServer) {
        safeAdminFetch('/api/admin/projects', '/projects').then(async res => {
            if (res && res.ok) {
                const d = await res.json().catch(() => ({}));
                if (d && Array.isArray(d.projects)) {
                    saveProjects(d.projects);
                    loadProjects(filterQuery, false);
                }
            }
        }).catch(() => {});
    }
    const listEl = document.getElementById('projects-list');
    const badgeEl = document.getElementById('projects-count-badge');
    const projects = getProjects();
    if (badgeEl) badgeEl.textContent = `${projects.length} ta loyiha`;

    if (!listEl) return;
    let filtered = projects;
    const q = (filterQuery || '').trim().toLowerCase();
    if (q) {
        filtered = filtered.filter(p =>
            (p.title || '').toLowerCase().includes(q) ||
            (p.desc || '').toLowerCase().includes(q) ||
            (p.cat || '').toLowerCase().includes(q) ||
            (Array.isArray(p.tech) && p.tech.some(t => t.toLowerCase().includes(q)))
        );
    }

    if (!filtered.length) {
        listEl.innerHTML = `<div class="glz-empty">${q ? 'Qidiruv bo\'yicha loyiha topilmadi' : 'Hozircha loyihalar yo\'q. Yuqoridagi formadan yangi loyiha qo\'shing!'}</div>`;
        return;
    }

    listEl.innerHTML = filtered.map(p => {
        const tags = Array.isArray(p.tech) ? p.tech.map(t => `<span class="tech-tag">${_esc(t)}</span>`).join('') : '';
        const link = p.link ? `<a href="${_esc(p.link)}" target="_blank" rel="noopener" class="btn-secondary" style="font-size:12px;padding:6px 12px;">👁️ Jonli ko'rish ↗</a>` : '';
        const gh = p.github ? `<a href="${_esc(p.github)}" target="_blank" rel="noopener" class="btn-secondary" style="font-size:12px;padding:6px 12px;">💻 GitHub ↗</a>` : '';

        return `
        <div class="project-card-styled">
            <div class="project-header-row">
                <div>
                    <h4 class="project-title">${_esc(p.title)}</h4>
                    ${p.cat ? `<span class="cyber-badge cyan" style="margin-top:4px;">${_esc(p.cat)}</span>` : ''}
                </div>
                <div style="display:flex;gap:6px;">
                    <button type="button" class="icon-btn" data-action="edit-project" data-id="${_esc(p.id)}" title="Tahrirlash">✏️</button>
                    <button type="button" class="icon-btn danger" data-action="delete-project" data-id="${_esc(p.id)}" title="O'chirish">🗑️</button>
                </div>
            </div>
            <p class="project-desc">${_esc(p.desc || '')}</p>
            ${tags ? `<div class="tech-tags-list">${tags}</div>` : ''}
            <div class="project-footer-acts">
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    ${link}
                    ${gh}
                </div>
            </div>
        </div>`;
    }).join('');
}

function handleProjectSubmit(e) {
    e.preventDefault();
    const idInput = document.getElementById('project-id-input');
    const titleInput = document.getElementById('project-title-input');
    const descInput = document.getElementById('project-desc-input');
    const catInput = document.getElementById('project-cat-input');
    const techInput = document.getElementById('project-tech-input');
    const linkInput = document.getElementById('project-link-input');
    const githubInput = document.getElementById('project-github-input');
    const imageInput = document.getElementById('project-image-input');

    const title = titleInput?.value.trim();
    const desc = descInput?.value.trim();
    if (!title || !desc) {
        showToast('Loyiha nomi va tavsifini kiritish shart!', 'error');
        return;
    }

    const editId = idInput?.value;
    const projects = getProjects();
    const tech = techInput?.value ? techInput.value.split(',').map(t => t.trim()).filter(Boolean) : [];

    const projectData = {
        id: editId || ('proj_' + Date.now()),
        title,
        desc,
        cat: catInput?.value.trim() || 'Loyiha',
        tech,
        link: linkInput?.value.trim() || '',
        github: githubInput?.value.trim() || '',
        image: imageInput?.value.trim() || ''
    };

    const isTgChecked = !!document.getElementById('project-telegram-notify')?.checked;

    if (editId) {
        const idx = projects.findIndex(p => String(p.id) === String(editId));
        if (idx >= 0) projects[idx] = projectData;
        addLog('info', `Loyiha tahrirlandi: "${title}"`);
        showToast('Loyiha yangilandi! ✅', 'success');

        safeAdminFetch(`/api/admin/projects/${encodeURIComponent(editId)}`, '/projects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: projectData.id,
                title: projectData.title,
                desc: projectData.desc,
                description: projectData.desc,
                link: projectData.link,
                github: projectData.github,
                category: projectData.cat,
                cat: projectData.cat,
                techStack: projectData.tech,
                tech: projectData.tech,
                image: projectData.image,
                notifyTelegram: isTgChecked,
                sendTelegram: isTgChecked
            })
        }).then(async res => {
            if (res && res.ok) {
                const d = await res.json().catch(() => ({}));
                if (d && Array.isArray(d.projects) && d.projects.length) {
                    saveProjects(d.projects);
                    loadProjects();
                }
            }
        }).catch(() => {});
    } else {
        projects.unshift(projectData);
        addLog('info', `Yangi loyiha qo'shildi: "${title}"`);
        showToast('Yangi loyiha muvaffaqiyatli qo\'shildi! 🚀', 'success');

        safeAdminFetch('/api/admin/projects', '/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: projectData.id,
                title: projectData.title,
                desc: projectData.desc,
                description: projectData.desc,
                link: projectData.link,
                github: projectData.github,
                category: projectData.cat,
                cat: projectData.cat,
                techStack: projectData.tech,
                tech: projectData.tech,
                image: projectData.image,
                notifyTelegram: isTgChecked,
                sendTelegram: isTgChecked
            })
        }).then(async res => {
            if (res && res.ok) {
                const d = await res.json().catch(() => ({}));
                if (d && Array.isArray(d.projects) && d.projects.length) {
                    saveProjects(d.projects);
                    loadProjects();
                }
            }
        }).catch(() => {});
    }

    if (isTgChecked) {
        safeAdminFetch('/api/admin/notify/telegram', '/admin/notify/telegram', {
            method: 'POST',
            body: JSON.stringify({ type: 'project', project: projectData, isUpdate: !!editId })
        }).then(async r => {
            if (r && r.ok) {
                const d = await r.json().catch(() => ({}));
                if (d && d.ok) {
                    showToast('📢 Loyiha Telegram kanalga ham e\'lon qilindi!', 'info');
                }
            }
        }).catch(() => {});
    }

    saveProjects(projects);
    resetProjectForm();
    loadProjects();
    renderRealDataMetrics();
}

function resetProjectForm() {
    document.getElementById('project-editor-form')?.reset();
    const idInput = document.getElementById('project-id-input');
    if (idInput) idInput.value = '';
    const titleEl = document.getElementById('project-form-mode-title');
    if (titleEl) titleEl.textContent = '➕ Yangi Loyiha Qo\'shish';
    const saveBtn = document.getElementById('project-save-btn');
    if (saveBtn) saveBtn.textContent = '💾 Loyihani Saqlash';
}

function editProject(id) {
    const projects = getProjects();
    const p = projects.find(item => String(item.id) === String(id));
    if (!p) return;

    switchTab('projects');
    const idInput = document.getElementById('project-id-input');
    const titleInput = document.getElementById('project-title-input');
    const descInput = document.getElementById('project-desc-input');
    const catInput = document.getElementById('project-cat-input');
    const techInput = document.getElementById('project-tech-input');
    const linkInput = document.getElementById('project-link-input');
    const githubInput = document.getElementById('project-github-input');
    const imageInput = document.getElementById('project-image-input');
    const titleEl = document.getElementById('project-form-mode-title');
    const saveBtn = document.getElementById('project-save-btn');

    if (idInput) idInput.value = p.id;
    if (titleInput) titleInput.value = p.title || '';
    if (descInput) descInput.value = p.desc || '';
    if (catInput) catInput.value = p.cat || '';
    if (techInput) techInput.value = Array.isArray(p.tech) ? p.tech.join(', ') : '';
    if (linkInput) linkInput.value = p.link || '';
    if (githubInput) githubInput.value = p.github || '';
    if (imageInput) imageInput.value = p.image || '';

    if (titleEl) titleEl.textContent = `✏️ Tahrirlash: "${p.title.slice(0, 20)}..."`;
    if (saveBtn) saveBtn.textContent = '💾 O\'zgarishlarni Saqlash';

    titleInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => titleInput?.focus(), 150);
}

function deleteProject(id) {
    const projects = getProjects();
    const p = projects.find(item => String(item.id) === String(id));
    if (!p) return;

    if (confirm(`"${p.title}" loyihasini o'chirishni tasdiqlaysizmi?`)) {
        const filtered = projects.filter(item => String(item.id) !== String(id));
        saveProjects(filtered);
        safeAdminFetch(`/api/admin/projects/${encodeURIComponent(id)}`, `/projects?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, action: 'delete' })
        }).then(async res => {
            if (res && res.ok) {
                const d = await res.json().catch(() => ({}));
                if (d && Array.isArray(d.projects)) {
                    saveProjects(d.projects);
                    loadProjects();
                }
            }
        }).catch(() => {});
        addLog('info', `Loyiha o'chirildi: "${p.title}"`);
        showToast('Loyiha o\'chirildi! 🗑️', 'info');
        loadProjects();
        renderRealDataMetrics();
    }
}

// ===== IQTIBOSLAR & KUN HIKMATI BOSHQARUVI (QUOTES) =====
function getQuotes() {
    try {
        const local = JSON.parse(localStorage.getItem('abdu_quotes') || '[]');
        if (Array.isArray(local) && local.length) return local;
    } catch (_) {}
    localStorage.setItem('abdu_quotes', JSON.stringify(defaultQuotes));
    return defaultQuotes;
}

function saveQuotes(quotes) {
    localStorage.setItem('abdu_quotes', JSON.stringify(quotes));
}

function loadQuotes(filterQuery = '', fetchFromServer = false) {
    if (fetchFromServer) {
        safeAdminFetch('/api/admin/quotes', '/quotes').then(async res => {
            if (res && res.ok) {
                const d = await res.json().catch(() => ({}));
                if (d && Array.isArray(d.quotes)) {
                    saveQuotes(d.quotes);
                    loadQuotes(filterQuery, false);
                }
            }
        }).catch(() => {});
    }
    const listEl = document.getElementById('quotes-list');
    const badgeEl = document.getElementById('quotes-count-badge');
    const quotes = getQuotes();
    if (badgeEl) badgeEl.textContent = `${quotes.length} ta hikmat`;

    if (!listEl) return;
    let filtered = quotes;
    const q = (filterQuery || '').trim().toLowerCase();
    if (q) {
        filtered = filtered.filter(item =>
            (item.quote || '').toLowerCase().includes(q) ||
            (item.author || '').toLowerCase().includes(q) ||
            (item.de || '').toLowerCase().includes(q) ||
            (item.cat || '').toLowerCase().includes(q)
        );
    }

    if (!filtered.length) {
        listEl.innerHTML = `<div class="glz-empty">${q ? 'Qidiruv bo\'yicha hikmat topilmadi' : 'Hozircha hikmatlar yo\'q. Yangi hikmat qo\'shing!'}</div>`;
        return;
    }

    listEl.innerHTML = filtered.map(item => `
    <div class="quote-card-styled">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
            <span class="cyber-badge amber">${_esc(item.cat || 'KUN HIKMATI')}</span>
            <div style="display:flex;gap:6px;">
                <button type="button" class="icon-btn" data-action="edit-quote" data-id="${_esc(item.id)}" title="Tahrirlash">✏️</button>
                <button type="button" class="icon-btn danger" data-action="delete-quote" data-id="${_esc(item.id)}" title="O'chirish">🗑️</button>
            </div>
        </div>
        <p class="quote-uz">"${_esc(item.quote)}"</p>
        ${item.de ? `<p class="quote-de">🇩🇪 "${_esc(item.de)}"</p>` : ''}
        <div class="quote-author">— ${_esc(item.author)}</div>
    </div>`).join('');
}

function handleQuoteSubmit(e) {
    e.preventDefault();
    const idInput = document.getElementById('quote-id-input');
    const textInput = document.getElementById('quote-text-input');
    const deInput = document.getElementById('quote-de-input');
    const authorInput = document.getElementById('quote-author-input');
    const catInput = document.getElementById('quote-cat-input');

    const quote = textInput?.value.trim();
    const author = authorInput?.value.trim();
    if (!quote || !author) {
        showToast('Iqtibos matni va muallifini kiritish shart!', 'error');
        return;
    }

    const editId = idInput?.value;
    const quotes = getQuotes();

    const quoteData = {
        id: editId || ('quote_' + Date.now()),
        quote,
        de: deInput?.value.trim() || '',
        author,
        cat: catInput?.value.trim() || 'ILHOM'
    };

    const isTgChecked = !!document.getElementById('quote-telegram-notify')?.checked;

    if (editId) {
        const idx = quotes.findIndex(q => String(q.id) === String(editId));
        if (idx >= 0) quotes[idx] = quoteData;
        addLog('info', `Iqtibos tahrirlandi: "${quote.slice(0, 25)}..."`);
        showToast('Iqtibos yangilandi! ✅', 'success');

        safeAdminFetch(`/api/admin/quotes/${encodeURIComponent(editId)}`, '/quotes', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: quoteData.id,
                text: quoteData.quote,
                quote: quoteData.quote,
                author: quoteData.author,
                category: quoteData.cat,
                de: quoteData.de,
                notifyTelegram: isTgChecked,
                sendTelegram: isTgChecked
            })
        }).then(async res => {
            if (res && res.ok) {
                const d = await res.json().catch(() => ({}));
                if (d && Array.isArray(d.quotes) && d.quotes.length) {
                    saveQuotes(d.quotes);
                    loadQuotes();
                }
            }
        }).catch(() => {});
    } else {
        quotes.unshift(quoteData);
        addLog('info', `Yangi iqtibos qo'shildi: "${quote.slice(0, 25)}..."`);
        showToast('Yangi hikmat qo\'shildi! 💡', 'success');

        safeAdminFetch('/api/admin/quotes', '/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: quoteData.id,
                text: quoteData.quote,
                quote: quoteData.quote,
                author: quoteData.author,
                category: quoteData.cat,
                de: quoteData.de,
                notifyTelegram: isTgChecked,
                sendTelegram: isTgChecked
            })
        }).then(async res => {
            if (res && res.ok) {
                const d = await res.json().catch(() => ({}));
                if (d && Array.isArray(d.quotes) && d.quotes.length) {
                    saveQuotes(d.quotes);
                    loadQuotes();
                }
            }
        }).catch(() => {});
    }

    if (isTgChecked) {
        safeAdminFetch('/api/admin/notify/telegram', '/admin/notify/telegram', {
            method: 'POST',
            body: JSON.stringify({ type: 'quote', quote: quoteData })
        }).then(async r => {
            if (r && r.ok) {
                const d = await r.json().catch(() => ({}));
                if (d && d.ok) {
                    showToast('💡 Hikmat Telegram kanalga ham e\'lon qilindi!', 'info');
                }
            }
        }).catch(() => {});
    }

    saveQuotes(quotes);
    resetQuoteForm();
    loadQuotes();
    renderRealDataMetrics();
}

function resetQuoteForm() {
    document.getElementById('quote-editor-form')?.reset();
    const idInput = document.getElementById('quote-id-input');
    if (idInput) idInput.value = '';
    const titleEl = document.getElementById('quote-form-mode-title');
    if (titleEl) titleEl.textContent = '➕ Yangi Hikmat Qo\'shish';
    const saveBtn = document.getElementById('quote-save-btn');
    if (saveBtn) saveBtn.textContent = '💾 Hikmatni Saqlash';
}

function editQuote(id) {
    const quotes = getQuotes();
    const q = quotes.find(item => String(item.id) === String(id));
    if (!q) return;

    switchTab('quotes');
    const idInput = document.getElementById('quote-id-input');
    const textInput = document.getElementById('quote-text-input');
    const deInput = document.getElementById('quote-de-input');
    const authorInput = document.getElementById('quote-author-input');
    const catInput = document.getElementById('quote-cat-input');
    const titleEl = document.getElementById('quote-form-mode-title');
    const saveBtn = document.getElementById('quote-save-btn');

    if (idInput) idInput.value = q.id;
    if (textInput) textInput.value = q.quote || '';
    if (deInput) deInput.value = q.de || '';
    if (authorInput) authorInput.value = q.author || '';
    if (catInput) catInput.value = q.cat || '';

    if (titleEl) titleEl.textContent = `✏️ Tahrirlash: "${q.author}"`;
    if (saveBtn) saveBtn.textContent = '💾 O\'zgarishlarni Saqlash';

    textInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => textInput?.focus(), 150);
}

function deleteQuote(id) {
    const quotes = getQuotes();
    const q = quotes.find(item => String(item.id) === String(id));
    if (!q) return;

    if (confirm(`"${q.quote.slice(0, 30)}..." hikmatini o'chirishni tasdiqlaysizmi?`)) {
        const filtered = quotes.filter(item => String(item.id) !== String(id));
        saveQuotes(filtered);
        safeAdminFetch(`/api/admin/quotes/${encodeURIComponent(id)}`, `/quotes?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, action: 'delete' })
        }).then(async res => {
            if (res && res.ok) {
                const d = await res.json().catch(() => ({}));
                if (d && Array.isArray(d.quotes)) {
                    saveQuotes(d.quotes);
                    loadQuotes();
                }
            }
        }).catch(() => {});
        addLog('info', `Iqtibos o'chirildi: "${q.author}"`);
        showToast('Iqtibos o\'chirildi! 🗑️', 'info');
        loadQuotes();
        renderRealDataMetrics();
    }
}

// ===== FOYDALANUVCHILAR BOSHQARUVI (USERS) =====
async function handleCreateUser(e) {
    e.preventDefault();
    const name = document.getElementById('new-user-name')?.value.trim();
    const username = document.getElementById('new-user-username')?.value.trim();
    const password = document.getElementById('new-user-password')?.value.trim();
    const role = document.getElementById('new-user-role')?.value || 'student';

    if (!name || !username || !password) {
        showToast('Barcha maydonlarni to\'ldiring!', 'error');
        return;
    }

    try {
        await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, password, role })
        }).catch(() => null);

        const newUser = {
            id: 'user_' + Date.now(),
            name,
            username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
            role,
            createdAt: new Date().toISOString()
        };

        const existingIdx = cachedUsers.findIndex(u => (u.username || '').toLowerCase() === newUser.username);
        if (existingIdx >= 0) {
            cachedUsers[existingIdx] = newUser;
        } else {
            cachedUsers.unshift(newUser);
        }

        renderStudentsList();
        renderRealDataMetrics();
        addLog('info', `Yangi foydalanuvchi yaratildi: @${newUser.username}`);
        showToast(`Foydalanuvchi @${newUser.username} muvaffaqiyatli qo'shildi! ✅`, 'success');
        document.getElementById('user-create-form')?.reset();
    } catch (err) {
        console.error('User create error:', err);
        showToast('Foydalanuvchi yaratishda xato: ' + err.message, 'error');
    }
}

// ===== SAYT SOZLAMALARI =====
async function loadSettingsInputs() {
    try {
        const res = await safeAdminFetch('/api/admin/settings', '/admin/settings');
        if (res && res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data.ok && data.settings) {
                const s = data.settings;
                if (s.siteName) localStorage.setItem('kay_site_name', s.siteName);
                if (s.siteDesc) localStorage.setItem('kay_site_desc', s.siteDesc);
                if (s.authorName) localStorage.setItem('kay_author_name', s.authorName);
                if (s.authorBio) localStorage.setItem('kay_author_bio', s.authorBio);
                if (s.contactEmail) localStorage.setItem('kay_contact_email', s.contactEmail);
                if (s.contactPhone) localStorage.setItem('kay_contact_phone', s.contactPhone);
                if (s.socialTg) localStorage.setItem('kay_social_tg', s.socialTg);
                if (s.socialGh) localStorage.setItem('kay_social_gh', s.socialGh);
                if (s.socialLc) localStorage.setItem('kay_social_lc', s.socialLc);
                if (s.socialIg) localStorage.setItem('kay_social_ig', s.socialIg);
                if (s.bannerText) localStorage.setItem('kay_banner_text', s.bannerText);
                if (s.bannerActive !== undefined) localStorage.setItem('kay_banner_active', String(s.bannerActive));
                if (s.telegramBotToken) localStorage.setItem('kay_tg_bot_token', s.telegramBotToken);
                if (s.telegramChannelId) localStorage.setItem('kay_tg_channel', s.telegramChannelId);
                if (s.telegramAdminChatId) localStorage.setItem('kay_tg_admin_chat', s.telegramAdminChatId);
                if (s.telegramAutoBroadcast !== undefined) localStorage.setItem('kay_tg_auto_broadcast', String(s.telegramAutoBroadcast));
            }
        }
    } catch (_) {}

    const siteName = localStorage.getItem('kay_site_name') || 'Abdugofforov';
    const siteDesc = localStorage.getItem('kay_site_desc') || 'Vaqt sarguzashtlari va unutilmas xotiralar kundaligi.';
    const authorName = localStorage.getItem('kay_author_name') || 'Akromjon Abdugofforov';
    const authorBio = localStorage.getItem('kay_author_bio') || 'Dasturchi, muhandis va nemis tili o\'rganuvchisi. Sun\'iy intellekt, veb-texnologiyalar va avtomatlashtirish ishqibozi.';
    const email = localStorage.getItem('kay_contact_email') || 'akromjon@abdugofforov.uz';
    const phone = localStorage.getItem('kay_contact_phone') || '+998 (90) 000-00-00';
    const tg = localStorage.getItem('kay_social_tg') || 'https://t.me/abdugofforov_uz';
    const gh = localStorage.getItem('kay_social_gh') || 'https://github.com/akrin4477';
    const lc = localStorage.getItem('kay_social_lc') || 'https://leetcode.com/u/akrin4477';
    const ig = localStorage.getItem('kay_social_ig') || 'https://instagram.com/abdugofforov';
    const bannerActive = localStorage.getItem('kay_banner_active') !== 'false';
    const bannerText = localStorage.getItem('kay_banner_text') || '🚀 2026-yilgi yangi ekotizim yangilanishi e\'lon qilindi! Tools Lab va 3D tajribalarni sinab ko\'ring.';

    const tgBotToken = localStorage.getItem('kay_tg_bot_token') || '';
    const tgChannel = localStorage.getItem('kay_tg_channel') || '@abdugofforov_uz';
    const tgAdminChat = localStorage.getItem('kay_tg_admin_chat') || '';
    const tgAutoBroadcast = localStorage.getItem('kay_tg_auto_broadcast') !== 'false';

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    setVal('setting-site-name', siteName);
    setVal('setting-site-desc', siteDesc);
    setVal('setting-author-name', authorName);
    setVal('setting-author-bio', authorBio);
    setVal('setting-contact-email', email);
    setVal('setting-contact-phone', phone);
    setVal('setting-social-tg', tg);
    setVal('setting-social-gh', gh);
    setVal('setting-social-lc', lc);
    setVal('setting-social-ig', ig);
    setVal('setting-banner-text', bannerText);
    const bCheck = document.getElementById('setting-banner-active');
    if (bCheck) bCheck.checked = bannerActive;

    setVal('setting-tg-bot-token', tgBotToken);
    setVal('setting-tg-channel', tgChannel);
    setVal('setting-tg-admin-chat', tgAdminChat);
    const tgAutoCheck = document.getElementById('setting-tg-auto-broadcast');
    if (tgAutoCheck) tgAutoCheck.checked = tgAutoBroadcast;

    const tgBadge = document.getElementById('tg-status-badge');
    if (tgBadge) {
        if (tgBotToken && tgChannel) {
            tgBadge.textContent = 'Faol & Sozlangan';
            tgBadge.className = 'cyber-badge emerald';
        } else {
            tgBadge.textContent = 'Sozlanmagan';
            tgBadge.className = 'cyber-badge amber';
        }
    }
}

function saveSettingsInputs() {
    const getVal = id => document.getElementById(id)?.value?.trim();
    const siteName = getVal('setting-site-name') || 'Abdugofforov';
    const siteDesc = getVal('setting-site-desc') || '';
    const authorName = getVal('setting-author-name') || '';
    const authorBio = getVal('setting-author-bio') || '';
    const contactEmail = getVal('setting-contact-email') || '';
    const contactPhone = getVal('setting-contact-phone') || '';
    const socialTg = getVal('setting-social-tg') || '';
    const socialGh = getVal('setting-social-gh') || '';
    const socialLc = getVal('setting-social-lc') || '';
    const socialIg = getVal('setting-social-ig') || '';
    const bannerText = getVal('setting-banner-text') || '';
    const bCheck = document.getElementById('setting-banner-active');
    const bannerActive = bCheck ? bCheck.checked : true;

    const tgBotToken = getVal('setting-tg-bot-token') || '';
    const tgChannel = getVal('setting-tg-channel') || '';
    const tgAdminChat = getVal('setting-tg-admin-chat') || '';
    const tgAutoCheck = document.getElementById('setting-tg-auto-broadcast');
    const tgAutoBroadcast = tgAutoCheck ? tgAutoCheck.checked : true;

    localStorage.setItem('kay_site_name', siteName);
    localStorage.setItem('kay_site_desc', siteDesc);
    localStorage.setItem('kay_author_name', authorName);
    localStorage.setItem('kay_author_bio', authorBio);
    localStorage.setItem('kay_contact_email', contactEmail);
    localStorage.setItem('kay_contact_phone', contactPhone);
    localStorage.setItem('kay_social_tg', socialTg);
    localStorage.setItem('kay_social_gh', socialGh);
    localStorage.setItem('kay_social_lc', socialLc);
    localStorage.setItem('kay_social_ig', socialIg);
    localStorage.setItem('kay_banner_text', bannerText);
    localStorage.setItem('kay_banner_active', String(bannerActive));

    localStorage.setItem('kay_tg_bot_token', tgBotToken);
    localStorage.setItem('kay_tg_channel', tgChannel);
    localStorage.setItem('kay_tg_admin_chat', tgAdminChat);
    localStorage.setItem('kay_tg_auto_broadcast', String(tgAutoBroadcast));

    safeAdminFetch('/api/admin/settings', '/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            siteName,
            siteDesc,
            authorName,
            authorBio,
            contactEmail,
            contactPhone,
            socialTg,
            socialGh,
            socialLc,
            socialIg,
            bannerText,
            bannerActive,
            telegramBotToken: tgBotToken,
            telegramChannelId: tgChannel,
            telegramAdminChatId: tgAdminChat,
            telegramAutoBroadcast: tgAutoBroadcast
        })
    }).catch(() => {});

    const tgBadge = document.getElementById('tg-status-badge');
    if (tgBadge) {
        if (tgBotToken && tgChannel) {
            tgBadge.textContent = 'Faol & Sozlangan';
            tgBadge.className = 'cyber-badge emerald';
        } else {
            tgBadge.textContent = 'Sozlanmagan';
            tgBadge.className = 'cyber-badge amber';
        }
    }

    addLog('info', 'Sayt sozlamalari yangilandi');
    showToast('Sayt sozlamalari muvaffaqiyatli saqlandi! ✅', 'success');
}

// ===== TELEGRAM ULIK VA INTEGRATSIYANI SINASH =====
async function testTelegramConnection() {
    const btn = document.getElementById('test-tg-connection-btn');
    const feedback = document.getElementById('tg-test-feedback');
    const botTokenInput = document.getElementById('setting-tg-bot-token');
    const channelInput = document.getElementById('setting-tg-channel');
    const adminChatInput = document.getElementById('setting-tg-admin-chat');

    const botToken = botTokenInput?.value?.trim();
    const channelId = channelInput?.value?.trim();
    const adminChatId = adminChatInput?.value?.trim();

    if (!botToken) {
        showToast('Iltimos, avval Telegram Bot Tokenni kiriting!', 'warning');
        if (botTokenInput) botTokenInput.focus();
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ Tekshirilmoqda...';
    }
    if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(56, 189, 248, 0.1)';
        feedback.style.border = '1px solid rgba(56, 189, 248, 0.3)';
        feedback.style.color = '#38bdf8';
        feedback.textContent = 'Telegram API ga ulanish sinovdan o\'tkazilmoqda...';
    }

    try {
        const res = await safeAdminFetch('/api/admin/notify/telegram', '/admin/notify/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'test',
                config: { botToken, channelId, adminChatId }
            })
        });

        const data = await res.json().catch(() => ({}));
        if (data && data.ok) {
            if (feedback) {
                feedback.style.display = 'block';
                feedback.style.background = 'rgba(16, 185, 129, 0.15)';
                feedback.style.border = '1px solid rgba(16, 185, 129, 0.4)';
                feedback.style.color = '#34d399';
                feedback.textContent = '✅ ' + (data.message || 'Telegram ulanishi muvaffaqiyatli!');
            }
            const tgBadge = document.getElementById('tg-status-badge');
            if (tgBadge) {
                tgBadge.textContent = 'Faol & Ulangan';
                tgBadge.className = 'cyber-badge emerald';
            }
            showToast('✅ Telegram ulanishi muvaffaqiyatli!', 'success');
        } else {
            const errText = data?.message || data?.error || 'Telegram serveriga ulanib bo\'lmadi';
            if (feedback) {
                feedback.style.display = 'block';
                feedback.style.background = 'rgba(239, 68, 68, 0.15)';
                feedback.style.border = '1px solid rgba(239, 68, 68, 0.4)';
                feedback.style.color = '#f87171';
                feedback.textContent = '❌ Xatolik: ' + errText;
            }
            const tgBadge = document.getElementById('tg-status-badge');
            if (tgBadge) {
                tgBadge.textContent = 'Ulanishda xato';
                tgBadge.className = 'cyber-badge rose';
            }
            showToast('⚠️ Telegram: ' + errText, 'warning');
        }
    } catch (err) {
        if (feedback) {
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(239, 68, 68, 0.15)';
            feedback.style.border = '1px solid rgba(239, 68, 68, 0.4)';
            feedback.style.color = '#f87171';
            feedback.textContent = '❌ Tarmoq xatosi: ' + err.message;
        }
        showToast('Xatolik: ' + err.message, 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = '⚡ Telegram Ulanishini Tekshirish';
        }
    }
}

// ===== ZAXIRA NUSXA (EXPORT & IMPORT) =====
function downloadBackup() {
    try {
        const backupData = {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            posts: JSON.parse(localStorage.getItem('abdu_posts') || '[]'),
            portfolio: JSON.parse(localStorage.getItem('abdu_portfolio') || '[]'),
            quotes: JSON.parse(localStorage.getItem('abdu_quotes') || '[]'),
            tasks: JSON.parse(localStorage.getItem('abdu_tasks') || '[]'),
            logs: JSON.parse(localStorage.getItem('kay_logs') || '[]'),
            settings: {
                siteName: localStorage.getItem('kay_site_name'),
                siteDesc: localStorage.getItem('kay_site_desc'),
                authorName: localStorage.getItem('kay_author_name'),
                authorBio: localStorage.getItem('kay_author_bio'),
                email: localStorage.getItem('kay_contact_email'),
                phone: localStorage.getItem('kay_contact_phone'),
                bannerActive: localStorage.getItem('kay_banner_active'),
                bannerText: localStorage.getItem('kay_banner_text'),
                socialTg: localStorage.getItem('kay_social_tg'),
                socialGh: localStorage.getItem('kay_social_gh')
            }
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const d = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `abdugofforov_backup_${d}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addLog('info', 'Zaxira nusxa fayli yuklab olindi');
        showToast('Zaxira nusxa yuklab olindi! 📦', 'success');
    } catch (e) {
        console.error('Backup error:', e);
        showToast('Zaxira olishda xatolik yuz berdi: ' + e.message, 'error');
    }
}

function handleRestoreBackupFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data || typeof data !== 'object') throw new Error('Fayl formati noto\'g\'ri');
            if (confirm('Ushbu zaxira nusxani qayta tiklashni tasdiqlaysizmi? Mavjud mahalliy ma\'lumotlar almashtiriladi.')) {
                if (Array.isArray(data.posts)) localStorage.setItem('abdu_posts', JSON.stringify(data.posts));
                if (Array.isArray(data.portfolio)) localStorage.setItem('abdu_portfolio', JSON.stringify(data.portfolio));
                if (Array.isArray(data.quotes)) localStorage.setItem('abdu_quotes', JSON.stringify(data.quotes));
                if (Array.isArray(data.tasks)) localStorage.setItem('abdu_tasks', JSON.stringify(data.tasks));
                if (Array.isArray(data.logs)) localStorage.setItem('kay_logs', JSON.stringify(data.logs));
                if (data.settings) {
                    if (data.settings.siteName) localStorage.setItem('kay_site_name', data.settings.siteName);
                    if (data.settings.siteDesc) localStorage.setItem('kay_site_desc', data.settings.siteDesc);
                    if (data.settings.authorName) localStorage.setItem('kay_author_name', data.settings.authorName);
                    if (data.settings.authorBio) localStorage.setItem('kay_author_bio', data.settings.authorBio);
                    if (data.settings.email) localStorage.setItem('kay_contact_email', data.settings.email);
                    if (data.settings.phone) localStorage.setItem('kay_contact_phone', data.settings.phone);
                    if (data.settings.bannerActive) localStorage.setItem('kay_banner_active', data.settings.bannerActive);
                    if (data.settings.bannerText) localStorage.setItem('kay_banner_text', data.settings.bannerText);
                }

                fetch('/api/admin/backup/restore', {
                    method: 'POST',
                    headers: _adminHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(data)
                }).catch(() => {});

                addLog('info', 'Zaxira nusxa fayldan qayta tiklandi');
                showToast('Ma\'lumotlar qayta tiklandi! Qayta yuklanmoqda...', 'success');
                setTimeout(() => window.location.reload(), 1200);
            }
        } catch (err) {
            console.error('Restore parse error:', err);
            showToast('Zaxira faylini o\'qishda xatolik: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
}

// ===== PIN KODNI O'ZGARTIRISH =====
async function handleChangePin(e) {
    e.preventDefault();
    const oldPin = document.getElementById('old-pin-input')?.value.trim();
    const newPin = document.getElementById('new-pin-input')?.value.trim();
    const confirmPin = document.getElementById('new-pin-confirm')?.value.trim();
    const msgEl = document.getElementById('change-pin-msg');

    const showMsg = (text, isOk) => {
        if (!msgEl) return;
        msgEl.style.display = 'block';
        msgEl.style.color = isOk ? '#34d399' : '#f87171';
        msgEl.textContent = text;
    };

    if (!oldPin || !newPin || !confirmPin) {
        showMsg('Barcha maydonlarni to\'ldiring', false);
        return;
    }
    if (newPin !== confirmPin) {
        showMsg('Yangi PIN kodlar mos kelmadi!', false);
        return;
    }
    if (newPin.length < 4) {
        showMsg('PIN kod kamida 4 ta belgidan iborat bo\'lishi kerak', false);
        return;
    }

    try {
        const payload = JSON.stringify({ oldPin, newPin });
        const headers = _adminHeaders({ 'Content-Type': 'application/json' });

        let res = await fetch('/api/admin/change-pin', {
            method: 'POST',
            headers,
            body: payload
        }).catch(() => null);

        if (!res || res.status === 404) {
            res = await fetch('/admin/change-pin', {
                method: 'POST',
                headers,
                body: payload
            }).catch(() => null);
        }

        const data = res ? await res.json().catch(() => null) : null;

        if (res && res.ok && data && data.ok) {
            sessionStorage.setItem('kay_admin_pin', newPin);
            showMsg('PIN kod serverda muvaffaqiyatli yangilandi! ✅', true);
            addLog('info', 'Admin PIN kodi o\'zgartirildi');
            showToast('PIN kod muvaffaqiyatli o\'zgartirildi! ✅', 'success');
            document.getElementById('change-pin-form')?.reset();
        } else {
            const errMsg = data?.error || data?.message || (res ? `Server xatosi (${res.status})` : 'Serverda PIN yangilanmadi');
            showMsg(errMsg, false);
            showToast(errMsg, 'error');
            addLog('fail', 'PIN o\'zgartirishda xatolik: ' + errMsg);
        }
    } catch (err) {
        showMsg('Xatolik: ' + err.message, false);
        showToast('Xatolik: ' + err.message, 'error');
    }
}

// ===== XAVFSIZLIK LOGLARI =====
function addLog(type, message) {
    const logs = JSON.parse(localStorage.getItem('kay_logs') || '[]');
    logs.unshift({ type, message, time: new Date().toLocaleString('uz-UZ') });
    localStorage.setItem('kay_logs', JSON.stringify(logs.slice(0, 50)));
}

function loadSecurityLog() {
    const logs = JSON.parse(localStorage.getItem('kay_logs') || '[]');
    const list = document.getElementById('security-log-list');
    if (!list) return;

    if (!logs.length) {
        list.innerHTML = '<div class="log-item" style="color:var(--text-secondary);justify-content:center;">Hali log mavjud emas</div>';
        return;
    }
    list.innerHTML = logs.map(l => `
        <div class="log-item">
            <div class="log-dot ${l.type === 'success' ? 'ok' : (l.type === 'fail' ? 'fail' : 'ok')}"></div>
            <span>${_esc(l.message)}</span>
            <span class="log-time">${l.time}</span>
        </div>
    `).join('');
}

document.getElementById('clear-log-btn')?.addEventListener('click', () => {
    if (!confirm('Barcha loglarni tozalashni xohlaysizmi?')) return;
    localStorage.removeItem('kay_logs');
    loadSecurityLog();
});

// Sozlamalar va Zaxira tugmalari
document.getElementById('save-settings-btn')?.addEventListener('click', saveSettingsInputs);
document.getElementById('test-tg-connection-btn')?.addEventListener('click', testTelegramConnection);
document.getElementById('backup-download-btn')?.addEventListener('click', downloadBackup);
document.getElementById('backup-upload-file')?.addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (file) handleRestoreBackupFile(file);
});

document.getElementById('reset-all-btn')?.addEventListener('click', () => {
    if (!confirm('Barcha lokal ma\'lumotlar (rejalar, keshlar va loglar) o\'chadi! Davom etasizmi?')) return;
    localStorage.removeItem('abdu_tasks');
    localStorage.removeItem('kay_logs');
    localStorage.removeItem('abdu_posts');
    localStorage.removeItem('abdu_portfolio');
    localStorage.removeItem('abdu_quotes');
    showToast('Barcha mahalliy ma\'lumotlar tozalandi ✅', 'info');
    loadTasks();
    loadProjects();
    loadQuotes();
    loadSecurityLog();
});

// Formalar tinglovchilari
document.getElementById('project-editor-form')?.addEventListener('submit', handleProjectSubmit);
document.getElementById('project-reset-btn')?.addEventListener('click', resetProjectForm);
document.getElementById('projects-search-input')?.addEventListener('input', e => loadProjects(e.target.value));

document.getElementById('quote-editor-form')?.addEventListener('submit', handleQuoteSubmit);
document.getElementById('quote-reset-btn')?.addEventListener('click', resetQuoteForm);
document.getElementById('quote-search-input')?.addEventListener('input', e => loadQuotes(e.target.value));

document.getElementById('user-create-form')?.addEventListener('submit', handleCreateUser);
document.getElementById('user-search-input')?.addEventListener('input', e => renderStudentsList(e.target.value));

document.getElementById('results-search')?.addEventListener('input', e => renderResultsTable(e.target.value));
document.getElementById('clear-results-btn')?.addEventListener('click', clearAllResults);

document.getElementById('change-pin-form')?.addEventListener('submit', handleChangePin);

// ===== GLOBAL EVENT DELEGATION FOR CSP COMPLIANCE =====
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'cycle-task-status') {
        cycleTaskStatus(btn.dataset.id);
    } else if (action === 'edit-task') {
        editTask(btn.dataset.id);
    } else if (action === 'delete-task') {
        deleteTask(btn.dataset.id);
    } else if (action === 'filter-task') {
        currentTaskFilter = btn.dataset.filter || 'all';
        document.querySelectorAll('.task-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadTasks();
    } else if (action === 'goto-tab') {
        switchTab(btn.dataset.tab);
    } else if (action === 'refresh-data') {
        btn.textContent = 'Yuklanmoqda...';
        loadDashboardAndRealData(true).finally(() => {
            btn.textContent = '🔄 Yangilash';
        });
    } else if (action === 'open-reset-password') {
        openResetPasswordModal(btn.dataset.username, btn.dataset.name);
    } else if (action === 'close-reset-password') {
        closeResetPasswordModal();
    } else if (action === 'edit-post') {
        editCreatorPost(btn.dataset.id);
    } else if (action === 'delete-post') {
        deleteCreatorPost(btn.dataset.id);
    } else if (action === 'edit-project') {
        editProject(btn.dataset.id);
    } else if (action === 'delete-project') {
        deleteProject(btn.dataset.id);
    } else if (action === 'edit-quote') {
        editQuote(btn.dataset.id);
    } else if (action === 'delete-quote') {
        deleteQuote(btn.dataset.id);
    } else if (action === 'toggle-user-role') {
        toggleUserRole(btn.dataset.username, btn.dataset.role);
    } else if (action === 'delete-user') {
        deleteUser(btn.dataset.username);
    } else if (action === 'delete-result') {
        deleteResult(btn.dataset.id);
    }
});

// Global image error handler
document.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
}, true);

// Password reset modal form submission
document.getElementById('reset-password-form')?.addEventListener('submit', handleResetPasswordSubmit);

// ===== SUBDOMENLAR VA LOYIHALARGA O'TISH =====
function openService(service) {
    let url;
    if (window.location.hostname.includes('abdugofforov.uz')) {
        url = `https://${service}.abdugofforov.uz/`;
    } else {
        url = `/${service}.html`;
    }
    window.open(url, '_blank');
}

document.getElementById('admin-tools-link')?.addEventListener('click', () => openService('tools'));
document.getElementById('dash-btn-tools')?.addEventListener('click', () => openService('tools'));

// ===== CREATOR STUDIO: POST EDITOR & TELEGRAM AUTO-POST =====
function focusNewPostEditor() {
    switchTab('posts');
    const form = document.getElementById('post-editor-form');
    if (form) {
        const idInput = document.getElementById('post-id');
        const modeBadge = document.getElementById('post-editor-mode-badge');
        const saveBtn = document.getElementById('post-save-btn');
        if (idInput) idInput.value = '';
        if (modeBadge) modeBadge.textContent = 'Yangi Post';
        if (saveBtn) saveBtn.textContent = '🚀 Chop etish & Saqlash';
    }
    const titleInput = document.getElementById('post-title-input');
    if (titleInput) {
        titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => titleInput.focus(), 150);
    }
}

function showPostFeedback(message, type = 'success') {
    const el = document.getElementById('post-feedback-msg');
    if (!el) return;
    el.className = `post-feedback ${type}`;
    el.innerHTML = message;
    el.style.display = 'flex';
    setTimeout(() => {
        if (el) el.style.display = 'none';
    }, 4500);
}

async function loadCreatorPosts() {
    const listEl = document.getElementById('creator-posts-list');
    const badgeEl = document.getElementById('posts-count-badge');
    if (!listEl) return;

    try {
        let posts = [];
        // 1. Server admin posts API (avval /api/admin/posts, fallback /posts)
        try {
            const res = await safeAdminFetch('/api/admin/posts', '/posts');
            if (res && res.ok) {
                const data = await res.json().catch(() => ({}));
                if (data.ok && Array.isArray(data.posts) && data.posts.length) {
                    posts = data.posts;
                } else if (Array.isArray(data) && data.length) {
                    posts = data;
                }
            }
        } catch (_) {}

        // 3. LocalStorage
        if (!posts.length) {
            try {
                const local = JSON.parse(localStorage.getItem('abdu_posts') || '[]');
                if (Array.isArray(local) && local.length) posts = local;
            } catch (_) {}
        }

        // 4. Standart asosiy maqolalar zaxirasi (saytda doim mavjud postlar)
        if (!posts.length) {
            posts = [
                {
                    id: 'post_web_architecture_2026',
                    title: "Zamonaviy Web Arxitektura: Frontend va Backend Tizimlarini Optimallashtirish",
                    excerpt: "Yuqori yuklamali veb-ilovalarda frontend va backend arxitekturasini loyihalash, keshlashtirish va mikroservislar o'rtasida ma'lumotlar almashinuvini optimallashtirish bo'yicha amaliy qo'llanma.",
                    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
                    tags: ['Architecture', 'Frontend', 'Backend', 'Dasturlash'],
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'post_germany_chancenkarte_2026',
                    title: "Germaniya Chancenkarte (Imkoniyat Kartasi) 2026: Dasturchilar uchun Yangi Qoidalar",
                    excerpt: "Germaniyada ish qidirish uchun yangi ball tizimi qanday ishlaydi? Nemis tili darajasi va diplomni tasdiqlashning oson yo'llari.",
                    image: "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?q=80&w=1200",
                    tags: ['Germaniya', 'Chancenkarte', 'Karyera'],
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 'post_ecosystem_release_2_0',
                    title: "Abdugofforov Ekotizimi 2.0: Zen Studio va Yangilangan Tools Lab",
                    excerpt: "Saytimiz tubdan yangilandi: endi chalg'itmaydigan ijodiy muharrir va yangi asboblar sizning xizmatingizda!",
                    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200",
                    tags: ['Yangiliklar', 'Ekotizim', 'Release'],
                    createdAt: new Date(Date.now() - 172800000).toISOString()
                }
            ];
            try { localStorage.setItem('abdu_posts', JSON.stringify(posts)); } catch (_) {}
        }

        cachedPosts = posts;
        if (badgeEl) badgeEl.textContent = `${posts.length} ta`;
        const quickPostsEl = document.getElementById('quick-stat-posts');
        if (quickPostsEl) quickPostsEl.textContent = posts.length;

        renderCreatorPostsList(posts);
    } catch (e) {
        console.warn('Postlarni yuklashda xato:', e);
        listEl.innerHTML = '<div class="glz-empty" style="color:#f87171;">Postlarni yuklashda xatolik yuz berdi</div>';
    }
}

function renderCreatorPostsList(posts) {
    const listEl = document.getElementById('creator-posts-list');
    const badgeEl = document.getElementById('posts-count-badge');
    if (!listEl) return;
    if (badgeEl) badgeEl.textContent = `${posts.length} ta`;

    if (!posts.length) {
        listEl.innerHTML = '<div class="glz-empty">Hech qanday maqola topilmadi. Yuqoridagi formadan yangi post yarating!</div>';
        return;
    }

    const sorted = [...posts].reverse();
    listEl.innerHTML = sorted.map(post => {
        const title = _esc(post.title || 'Nomsiz post');
        const excerpt = _esc(post.excerpt || (post.content ? post.content.slice(0, 120) : ''));
        const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Yaqinda';
        const image = post.image ? _esc(post.image) : '';
        const tags = Array.isArray(post.tags) && post.tags.length 
            ? post.tags.map(t => `<span style="font-size:10px;padding:2px 7px;border-radius:6px;background:rgba(45,212,191,0.15);color:var(--accent-color);">${_esc(t)}</span>`).join(' ')
            : '';

        const thumbHtml = image
            ? `<div class="post-card-thumb" style="background-image: url('${image}');"></div>`
            : `<div class="post-card-thumb" style="background: linear-gradient(135deg, rgba(45,212,191,0.25), rgba(56,189,248,0.25)); font-size:32px;">✍️</div>`;

        return `
            <div class="post-card-item" data-post-id="${_esc(post.id)}">
                ${thumbHtml}
                <div class="post-card-body">
                    <h4 class="post-card-title">${title}</h4>
                    <p class="post-card-excerpt">${excerpt}</p>
                    <div class="post-card-meta">
                        <span>📅 ${dateStr}</span>
                        <div>${tags}</div>
                    </div>
                    <div class="post-card-actions">
                        <button type="button" data-action="edit-post" data-id="${_esc(post.id)}" title="Tahrirlash">✏️ Tahrirlash</button>
                        <a href="/#post-${_esc(post.id)}" target="_blank" rel="noopener" title="Saytda ko'rish">👁️ Ko'rish ↗</a>
                        <button type="button" class="btn-del" data-action="delete-post" data-id="${_esc(post.id)}" title="O'chirish">🗑️ O'chirish</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function editCreatorPost(id) {
    const post = cachedPosts.find(p => String(p.id) === String(id));
    if (!post) return;

    switchTab('posts');
    const idInput = document.getElementById('post-id');
    const titleInput = document.getElementById('post-title-input');
    const excerptInput = document.getElementById('post-excerpt-input');
    const tagsInput = document.getElementById('post-tags-input');
    const imageInput = document.getElementById('post-image-input');
    const contentInput = document.getElementById('post-content-input');
    const modeBadge = document.getElementById('post-editor-mode-badge');
    const saveBtn = document.getElementById('post-save-btn');

    if (idInput) idInput.value = post.id;
    if (titleInput) titleInput.value = post.title || '';
    if (excerptInput) excerptInput.value = post.excerpt || '';
    if (tagsInput) tagsInput.value = Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '');
    if (contentInput) contentInput.value = post.content || '';
    if (imageInput) {
        imageInput.value = post.image || '';
        updatePostImagePreview(post.image || '');
    }
    if (modeBadge) modeBadge.textContent = 'Tahrirlash: ' + (post.title ? post.title.slice(0, 20) + '...' : '');
    if (saveBtn) saveBtn.textContent = '💾 O\'zgarishlarni saqlash';

    if (titleInput) {
        titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => titleInput.focus(), 150);
    }
}

async function deleteCreatorPost(id) {
    if (!confirm('Haqiqatan ham ushbu maqolani o\'chirmoqchimisiz?')) return;

    try {
        await safeAdminFetch(
            `/api/admin/posts/${encodeURIComponent(id)}`,
            `/posts?id=${encodeURIComponent(id)}`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'delete' })
            }
        ).catch(() => {});

        try {
            let local = JSON.parse(localStorage.getItem('abdu_posts') || '[]');
            local = local.filter(p => String(p.id) !== String(id));
            localStorage.setItem('abdu_posts', JSON.stringify(local));

            const pin = sessionStorage.getItem('kay_admin_pin');
            if (pin) {
                fetch('/posts', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
                    body: JSON.stringify({ posts: local })
                }).catch(() => {});
            }
        } catch (_) {}

        await loadDashboardAndRealData(true);
        loadCreatorPosts();
        showToast('Maqola muvaffaqiyatli o\'chirildi! 🗑️', 'info');
    } catch (e) {
        console.error('Postni o\'chirishda xato:', e);
        showToast('O\'chirishda xatolik yuz berdi', 'error');
    }
}

async function handlePostEditorSubmit(e) {
    e.preventDefault();
    const idInput = document.getElementById('post-id');
    const titleInput = document.getElementById('post-title-input');
    const excerptInput = document.getElementById('post-excerpt-input');
    const tagsInput = document.getElementById('post-tags-input');
    const imageInput = document.getElementById('post-image-input');
    const contentInput = document.getElementById('post-content-input');
    const tgCheckbox = document.getElementById('post-telegram-notify');
    const saveBtn = document.getElementById('post-save-btn');

    const title = titleInput?.value.trim();
    const content = contentInput?.value.trim();
    if (!title || !content) {
        showPostFeedback('Sarlavha va maqola matnini kiritish shart!', 'error');
        return;
    }

    const postId = idInput?.value || ('post_' + Date.now());
    const excerpt = excerptInput?.value.trim() || title.slice(0, 150);
    const tags = tagsInput?.value ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : [];
    const image = imageInput?.value.trim() || '';
    const isTelegramChecked = !!tgCheckbox?.checked;

    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Saqlanmoqda...';
    }

    const postPayload = {
        id: postId,
        title,
        excerpt,
        content,
        image,
        tags,
        published: true,
        notifyTelegram: isTelegramChecked,
        sendTelegram: isTelegramChecked,
        createdAt: new Date().toISOString()
    };

    try {
        // 1. Serverga saqlash (CMS API)
        try {
            await safeAdminFetch('/api/admin/posts', '/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postPayload)
            });
        } catch (apiErr) {
            console.warn('Server posts API ga yuborishda ogohlantirish:', apiErr);
        }

        // 2. Telegram kanalga avtomatik e'lon yuborish (agar checkbox belgilangan bo'lsa)
        let telegramResult = null;
        if (isTelegramChecked) {
            try {
                const tgRes = await safeAdminFetch('/api/admin/notify/telegram', '/admin/notify/telegram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'post',
                        post: postPayload,
                        isUpdate: !!(idInput && idInput.value)
                    })
                });
                if (tgRes) {
                    telegramResult = await tgRes.json().catch(() => ({}));
                }
            } catch (tgErr) {
                console.warn('Telegram bildirishnoma yuborishda ogohlantirish:', tgErr);
            }
        }

        // 3. LocalStorage va Cloudflare KV ga saqlash
        try {
            let local = [];
            try { local = JSON.parse(localStorage.getItem('abdu_posts') || '[]'); } catch (_) { local = []; }
            if (!Array.isArray(local)) local = [];
            const idx = local.findIndex(p => String(p.id) === String(postPayload.id));
            if (idx >= 0) {
                local[idx] = Object.assign({}, local[idx], postPayload);
            } else {
                local.unshift(postPayload);
            }
            localStorage.setItem('abdu_posts', JSON.stringify(local));

            const pin = sessionStorage.getItem('kay_admin_pin');
            if (pin) {
                fetch('/posts', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
                    body: JSON.stringify(local)
                }).catch(() => {});
            }
        } catch (locErr) {
            console.warn('Local/KV saqlashda ogohlantirish:', locErr);
        }

        // Formani tozalash
        if (idInput) idInput.value = '';
        if (titleInput) titleInput.value = '';
        if (excerptInput) excerptInput.value = '';
        if (tagsInput) tagsInput.value = '';
        if (contentInput) contentInput.value = '';
        if (imageInput) { imageInput.value = ''; updatePostImagePreview(''); }
        const fileInput = document.getElementById('post-image-file');
        if (fileInput) fileInput.value = '';
        const modeBadge = document.getElementById('post-editor-mode-badge');
        if (modeBadge) modeBadge.textContent = 'Yangi Post';

        if (isTelegramChecked) {
            if (telegramResult && telegramResult.ok) {
                showPostFeedback('✅ Post muvaffaqiyatli saqlandi va Telegram kanalga e\'lon qilindi! 📢', 'success');
                showToast('✅ Post saqlandi va Telegram kanalga e\'lon qilindi!', 'success');
            } else if (telegramResult && telegramResult.configured === false) {
                showPostFeedback('ℹ️ Post saqlandi, lekin Telegram bot sozlanmagani sababli kanalga yuborilmadi (Sozlamalar bo\'limida botni sozlang)', 'info');
                showToast('ℹ️ Post saqlandi (Telegram bot sozlanmagan)', 'info');
            } else {
                const tgMsg = telegramResult?.message || telegramResult?.error || 'Telegramga yuborib bo\'lmadi';
                showPostFeedback(`⚠️ Post saqlandi, lekin Telegram xatosi: ${tgMsg}`, 'error');
                showToast(`⚠️ Telegramga yuborilmadi: ${tgMsg}`, 'warning');
            }
        } else {
            showPostFeedback('✅ Post muvaffaqiyatli saqlandi va chop etildi!', 'success');
            showToast('✅ Post muvaffaqiyatli saqlandi!', 'success');
        }

        await loadDashboardAndRealData(true);
        loadCreatorPosts();
    } catch (err) {
        console.error('Post saqlash xatosi:', err);
        showPostFeedback('Xatolik: ' + (err.message || 'Saqlab bo\'lmadi'), 'error');
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = '🚀 Chop etish & Saqlash';
        }
    }
}

// Rasm va matn muharriri yordamchilari
function updatePostImagePreview(url) {
    const wrap = document.getElementById('post-image-preview-wrap');
    const img = document.getElementById('post-image-preview');
    if (!wrap || !img) return;
    if (url) {
        img.src = url;
        wrap.style.display = 'block';
    } else {
        img.src = '';
        wrap.style.display = 'none';
    }
}

function insertAtCursor(textarea, textToInsert) {
    if (!textarea) return;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const oldVal = textarea.value;
    textarea.value = oldVal.substring(0, start) + textToInsert + oldVal.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
    textarea.focus();
}

function wrapSelection(textarea, before, after) {
    if (!textarea) return;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selected = textarea.value.substring(start, end) || 'matn';
    const replacement = before + selected + after;
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
    textarea.focus();
}

function initPostEditorHelpers() {
    const imgInput = document.getElementById('post-image-input');
    const fileInput = document.getElementById('post-image-file');
    const removeBtn = document.getElementById('post-image-remove-btn');
    const contentTextarea = document.getElementById('post-content-input');
    const searchInput = document.getElementById('creator-posts-search');
    const refreshBtn = document.getElementById('refresh-posts-btn');

    imgInput?.addEventListener('input', (e) => {
        updatePostImagePreview(e.target.value.trim());
    });

    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target.result;
                if (imgInput) imgInput.value = base64;
                updatePostImagePreview(base64);
            };
            reader.readAsDataURL(file);
        }
    });

    removeBtn?.addEventListener('click', () => {
        if (imgInput) imgInput.value = '';
        if (fileInput) fileInput.value = '';
        updatePostImagePreview('');
    });

    document.querySelectorAll('.image-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.dataset.url;
            if (url && imgInput) {
                imgInput.value = url;
                updatePostImagePreview(url);
            }
        });
    });

    // Toolbar tugmalari
    document.querySelector('.editor-mini-toolbar')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.tb-btn');
        if (!btn || !contentTextarea) return;
        e.preventDefault();
        const action = btn.dataset.action;

        if (action === 'tb-bold') wrapSelection(contentTextarea, '**', '**');
        else if (action === 'tb-italic') wrapSelection(contentTextarea, '*', '*');
        else if (action === 'tb-h2') insertAtCursor(contentTextarea, '\n## Sarlavha 2\n');
        else if (action === 'tb-h3') insertAtCursor(contentTextarea, '\n### Sarlavha 3\n');
        else if (action === 'tb-quote') insertAtCursor(contentTextarea, '\n> Muhim iqtibos...\n');
        else if (action === 'tb-code') wrapSelection(contentTextarea, '\n```javascript\n', '\n```\n');
        else if (action === 'tb-link') {
            const url = prompt('Havola URL manzilini kiriting:', 'https://');
            if (url) wrapSelection(contentTextarea, '[', `](${url})`);
        } else if (action === 'tb-img') {
            const url = prompt('Matn ichiga joylash uchun rasm havolasini kiriting:', 'https://images.unsplash.com/...');
            if (url) {
                const alt = prompt('Rasm tavsifi (alt):', 'Rasm') || 'Rasm';
                insertAtCursor(contentTextarea, `\n![${alt}](${url})\n`);
            }
        }
    });

    // Real-time Post Qidirish
    searchInput?.addEventListener('input', (e) => {
        const query = (e.target.value || '').trim().toLowerCase();
        if (!query) {
            renderCreatorPostsList(cachedPosts);
            return;
        }
        const filtered = cachedPosts.filter(p => {
            const t = (p.title || '').toLowerCase();
            const ex = (p.excerpt || '').toLowerCase();
            const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
            return t.includes(query) || ex.includes(query) || tags.includes(query);
        });
        renderCreatorPostsList(filtered);
    });

    refreshBtn?.addEventListener('click', () => {
        loadCreatorPosts();
        if (typeof showPostFeedback === 'function') {
            showPostFeedback('🔄 Postlar ro\'yxati yangilandi', 'success');
        }
    });
}

// Global hodisalar va tinglovchilar
document.getElementById('quick-new-post-btn')?.addEventListener('click', focusNewPostEditor);
document.getElementById('post-editor-form')?.addEventListener('submit', handlePostEditorSubmit);
document.getElementById('post-reset-btn')?.addEventListener('click', () => {
    const idInput = document.getElementById('post-id');
    const titleInput = document.getElementById('post-title-input');
    const excerptInput = document.getElementById('post-excerpt-input');
    const tagsInput = document.getElementById('post-tags-input');
    const imageInput = document.getElementById('post-image-input');
    const fileInput = document.getElementById('post-image-file');
    const contentInput = document.getElementById('post-content-input');
    const modeBadge = document.getElementById('post-editor-mode-badge');
    const saveBtn = document.getElementById('post-save-btn');
    if (idInput) idInput.value = '';
    if (titleInput) titleInput.value = '';
    if (excerptInput) excerptInput.value = '';
    if (tagsInput) tagsInput.value = '';
    if (contentInput) contentInput.value = '';
    if (imageInput) { imageInput.value = ''; updatePostImagePreview(''); }
    if (fileInput) fileInput.value = '';
    if (modeBadge) modeBadge.textContent = 'Yangi Post';
    if (saveBtn) saveBtn.textContent = '🚀 Chop etish & Saqlash';
});

// Postlar ro'yxatidagi delegatsiyalangan harakatlar (Tahrirlash / O'chirish)
document.getElementById('creator-posts-list')?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-action="edit-post"]');
    if (editBtn) {
        e.preventDefault();
        const id = editBtn.dataset.id;
        if (id) editCreatorPost(id);
        return;
    }
    const delBtn = e.target.closest('[data-action="delete-post"]');
    if (delBtn) {
        e.preventDefault();
        const id = delBtn.dataset.id;
        if (id) deleteCreatorPost(id);
        return;
    }
});

// Yordamchilarni ishga tushirish
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostEditorHelpers);
} else {
    initPostEditorHelpers();
}

window.editCreatorPost = editCreatorPost;
window.deleteCreatorPost = deleteCreatorPost;
window.focusNewPostEditor = focusNewPostEditor;
window.updatePostImagePreview = updatePostImagePreview;
window.testTelegramConnection = testTelegramConnection;

