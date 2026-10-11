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

    // 1-qadam: To'g'ridan-to'g'ri /check-pin orqali PIN/parolni tekshirish (Tezkor va 2FA kutmasdan kirish)
    try {
        const cp = await fetch('/check-pin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });
        const cpData = await cp.json().catch(() => ({}));
        if (cpData && (cpData.success || cpData.ok)) {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Kirish'; }
            localStorage.removeItem('kay_attempts');
            localStorage.removeItem('kay_lock');
            localStorage.removeItem('kay_lockcount');
            sessionStorage.setItem('kay_admin', 'true');
            sessionStorage.setItem('kay_admin_pin', pin);
            if (cpData.token) sessionStorage.setItem('kay_admin_token', cpData.token);
            addLog('success', 'Admin paroli tasdiqlandi — panel ochildi');
            showAdminPanel();
            return;
        }
    } catch (_) {}

    let res, data;
    try {
        // 2-qadam: Agar /check-pin qanoatlantirmasa, Telegram 2FA (/admin/request-code) ga murojaat
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
            sessionStorage.setItem('kay_admin_pin', window.__authSession.pin);
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
    const token = sessionStorage.getItem('kay_admin_token');
    const pin = sessionStorage.getItem('kay_admin_pin');
    if (token) h['x-admin-token'] = token;
    if (pin) h['x-admin-pin'] = pin;
    return h;
}

function _esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function loadDashboardAndRealData(forceRefresh = false) {
    const recentBox = document.getElementById('dash-recent-results');
    const dbStatusEl = document.getElementById('dash-status-db');
    const testsStatusEl = document.getElementById('dash-status-tests');

    try {
        // Parallel so'rov: Tizim statistikasi (/api/admin/stats), Foydalanuvchilar, Postlar va Natijalar
        const [statsRes, usersRes, postsRes, resultsRes] = await Promise.all([
            fetch('/api/admin/stats', { headers: _adminHeaders() }).catch(() => null),
            fetch('/api/admin/users', { headers: _adminHeaders() }).catch(() => fetch('/admin/users', { headers: _adminHeaders() }).catch(() => null)),
            fetch('/api/admin/posts', { headers: _adminHeaders() }).catch(() => null),
            fetch('/results', { headers: _adminHeaders() }).catch(() => null)
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
            if (pData.ok && Array.isArray(pData.posts)) {
                cachedPosts = pData.posts;
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

    // Creator Studio Quick Actions: Jonli Statistika (Users, Posts, Tests)
    set('quick-stat-users', totalStudents);
    set('quick-stat-posts', totalPosts);
    set('quick-stat-tests', totalTests);
    set('posts-count-badge', `${totalPosts} ta`);

    // Sidebar ko'rsatkichlari
    set('side-students', totalStudents);
    set('side-tests', totalTests);

    // Dashboard 4 ta karta
    set('stat-students', totalStudents);
    set('stat-tests', totalTests);
    set('stat-avg-score', `${avgScore}%`);

    // O'quvchilar sahifasi kartalari
    set('students-count', totalStudents);
    set('results-count', totalTests);
    set('students-avg-score', `${avgScore}%`);

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

    if (!users.length) {
        usersBox.innerHTML = `<p style="color:#9aa;font-size:13px;padding:12px 0;">${q ? 'Qidiruv bo\'yicha foydalanuvchi topilmadi.' : 'Hali hech kim ro\'yxatdan o\'tmagan.'}</p>`;
        return;
    }

    usersBox.innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:14px;min-width:520px;">
        <thead>
            <tr style="text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);color:#9aa;font-size:12px;">
                <th style="padding:10px 8px;">Ism</th>
                <th style="padding:10px 8px;">Username</th>
                <th style="padding:10px 8px;">Ro'yxatdan o'tgan</th>
                <th style="padding:10px 8px;text-align:right;">Amallar</th>
            </tr>
        </thead>
        <tbody>
            ${users.map(u => {
                const d = u.createdAt ? new Date(u.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                    <td style="padding:10px 8px;font-weight:600;">${_esc(u.name)}</td>
                    <td style="padding:10px 8px;color:#2dd4bf;font-weight:500;">@${_esc(u.username)}</td>
                    <td style="padding:10px 8px;color:#9aa;font-size:12px;">${d}</td>
                    <td style="padding:10px 8px;text-align:right;">
                        <button type="button" class="btn-secondary" data-action="open-reset-password" data-username="${_esc(u.username)}" data-name="${_esc(u.name)}" style="padding:4px 10px;font-size:12px;border-radius:6px;border-color:rgba(45,212,191,0.3);color:#2dd4bf;cursor:pointer;">
                            🔑 Parol o'zgartirish
                        </button>
                    </td>
                </tr>`;
            }).join('')}
        </tbody>
    </table>`;
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
        resultsBox.innerHTML = `<p style="color:#9aa;font-size:13px;padding:12px 0;">${q ? 'Qidiruv bo\'yicha natijalar topilmadi.' : 'Hali test ishlanmagan.'}</p>`;
        return;
    }

    resultsBox.innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:14px;min-width:640px;">
        <thead>
            <tr style="text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);color:#9aa;font-size:12px;">
                <th style="padding:10px 8px;">O'quvchi</th>
                <th style="padding:10px 8px;">Username</th>
                <th style="padding:10px 8px;">Test</th>
                <th style="padding:10px 8px;text-align:center;">To'g'ri</th>
                <th style="padding:10px 8px;text-align:center;">Xato</th>
                <th style="padding:10px 8px;text-align:center;">Natija</th>
                <th style="padding:10px 8px;text-align:right;">Sana</th>
            </tr>
        </thead>
        <tbody>
            ${results.map(r => {
                const d = new Date(r.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                const isGreat = r.pct >= 80;
                const isMed = r.pct >= 60;
                const color = isGreat ? '#34d399' : (isMed ? '#fbbf24' : '#f87171');
                const bg = isGreat ? 'rgba(52,211,153,0.12)' : (isMed ? 'rgba(251,191,36,0.12)' : 'rgba(248,113,113,0.12)');

                return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:10px 8px;font-weight:600;">${_esc(r.name)}</td>
                    <td style="padding:10px 8px;color:#9aa;">@${_esc(r.username)}</td>
                    <td style="padding:10px 8px;font-weight:500;">${_esc(r.testTitle || r.testId)}</td>
                    <td style="padding:10px 8px;color:#34d399;font-weight:700;text-align:center;">${r.score}</td>
                    <td style="padding:10px 8px;color:#f87171;font-weight:700;text-align:center;">${r.wrong}</td>
                    <td style="padding:10px 8px;text-align:center;">
                        <span style="display:inline-block;padding:2px 8px;border-radius:10px;font-weight:700;font-size:12px;color:${color};background:${bg};">
                            ${r.pct}%
                        </span>
                    </td>
                    <td style="padding:10px 8px;color:#9aa;font-size:12px;white-space:nowrap;text-align:right;">${d}</td>
                </tr>`;
            }).join('')}
        </tbody>
    </table>`;
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
function getTasks() {
    const raw = localStorage.getItem('abdu_tasks');
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) return parsed;
        } catch (e) {
            // parse error
        }
    }

    // Dastlabki namunaviy rejalar
    const defaultTasks = [
        { id: 1, title: 'B1 darajasi uchun yangi nemis tili testlari kiritish', status: 'progress', createdAt: Date.now() - 86400000 },
        { id: 2, title: "O'quvchilar o'rtasida haftalik grammatika turnirini boshlash", status: 'todo', createdAt: Date.now() - 43200000 },
        { id: 3, title: 'Sayt xavfsizligini A+ darajasiga chiqarish va CSP ni sozlash', status: 'done', createdAt: Date.now() - 172800000 }
    ];
    localStorage.setItem('abdu_tasks', JSON.stringify(defaultTasks));
    return defaultTasks;
}

function saveTasks(tasks) {
    localStorage.setItem('abdu_tasks', JSON.stringify(tasks));
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

function cycleTaskStatus(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const cycleOrder = { todo: 'progress', progress: 'done', done: 'todo' };
    task.status = cycleOrder[task.status] || 'todo';
    saveTasks(tasks);
    addLog('info', `Reja holati o'zgartirildi: "${task.title.slice(0, 30)}..." -> ${task.status}`);
    loadTasks();
}

function deleteTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (confirm(`"${task.title}" rejasini o'chirishni tasdiqlaysizmi?`)) {
        saveTasks(tasks.filter(t => t.id !== id));
        addLog('info', `Reja o'chirildi: "${task.title.slice(0, 30)}..."`);
        loadTasks();
    }
}

function editTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const titleInput = document.getElementById('task-title-input');
    const statusInput = document.getElementById('task-status-input');
    const editIdInput = document.getElementById('task-edit-id');
    const saveBtn = document.getElementById('task-save-btn');

    if (titleInput) titleInput.value = task.title;
    if (statusInput) statusInput.value = task.status;
    if (editIdInput) editIdInput.value = task.id;
    if (saveBtn) saveBtn.textContent = '💾 O\'zgarishni saqlash';

    titleInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    titleInput?.focus();
}

// Yangi reja kiritish yoki tahrirlash formasi
document.getElementById('admin-task-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const titleInput = document.getElementById('task-title-input');
    const statusInput = document.getElementById('task-status-input');
    const editIdInput = document.getElementById('task-edit-id');
    const saveBtn = document.getElementById('task-save-btn');

    const title = (titleInput?.value || '').trim();
    const status = statusInput?.value || 'todo';
    const editId = editIdInput?.value ? Number(editIdInput.value) : null;

    if (!title) return;

    const tasks = getTasks();

    if (editId) {
        // Tahrirlash
        const existing = tasks.find(t => t.id === editId);
        if (existing) {
            existing.title = title;
            existing.status = status;
            addLog('info', `Reja tahrirlandi: "${title.slice(0, 30)}..."`);
        }
    } else {
        // Yangi qo'shish
        tasks.unshift({
            id: Date.now(),
            title,
            status,
            createdAt: Date.now()
        });
        addLog('info', `Yangi reja kiritildi: "${title.slice(0, 30)}..."`);
    }

    saveTasks(tasks);

    // Formani tozalash
    if (titleInput) titleInput.value = '';
    if (editIdInput) editIdInput.value = '';
    if (statusInput) statusInput.value = 'todo';
    if (saveBtn) saveBtn.textContent = '➕ Rejani saqlash';

    loadTasks();
});

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
    if (targetTab === 'students') {
        renderStudentsList();
        renderResultsTable();
    } else if (targetTab === 'tasks') {
        loadTasks();
    } else if (targetTab === 'posts') {
        loadCreatorPosts();
    } else if (targetTab === 'dashboard') {
        renderRealDataMetrics();
    }

    const titleEl = document.getElementById('glz-page-title');
    const activeBtn = document.querySelector(`.admin-tab[data-tab="${targetTab}"]`);
    if (titleEl && activeBtn) {
        titleEl.textContent = activeBtn.dataset.title || activeBtn.querySelector('.dock-label')?.textContent || 'Boshqaruv paneli';
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
    // Qaysi tab faolligiga qarab qidiradi
    const activeTab = document.querySelector('.tab-content.active')?.id;
    if (activeTab === 'tab-students') {
        renderStudentsList(q);
        renderResultsTable(q);
    } else if (activeTab === 'tab-tasks') {
        loadTasks();
    }
});

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

// ===== SOZLAMALAR =====
document.getElementById('save-settings-btn')?.addEventListener('click', () => {
    const siteName = document.getElementById('setting-site-name')?.value;
    const siteDesc = document.getElementById('setting-site-desc')?.value;
    if (siteName) localStorage.setItem('kay_site_name', siteName);
    if (siteDesc) localStorage.setItem('kay_site_desc', siteDesc);
    addLog('info', 'Sayt sozlamalari yangilandi');
    alert('Sozlamalar saqlandi ✅');
});

document.getElementById('reset-all-btn')?.addEventListener('click', () => {
    if (!confirm('Barcha lokal ma\'lumotlar (rejalar, keshlar va loglar) o\'chadi! Davom etasizmi?')) return;
    localStorage.removeItem('abdu_tasks');
    localStorage.removeItem('kay_logs');
    localStorage.removeItem('abdu_posts');
    localStorage.removeItem('abdu_portfolio');
    alert('Barcha mahalliy ma\'lumotlar tozalandi ✅');
    loadTasks();
    loadSecurityLog();
});

// ===== GLOBAL EVENT DELEGATION FOR CSP COMPLIANCE =====
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'cycle-task-status') {
        cycleTaskStatus(Number(btn.dataset.id));
    } else if (action === 'edit-task') {
        editTask(Number(btn.dataset.id));
    } else if (action === 'delete-task') {
        deleteTask(Number(btn.dataset.id));
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
        // 1. Server admin posts API
        try {
            const res = await fetch('/api/admin/posts', { headers: _adminHeaders() });
            if (res.ok) {
                const data = await res.json();
                if (data.ok && Array.isArray(data.posts) && data.posts.length) {
                    posts = data.posts;
                }
            }
        } catch (_) {}

        // 2. Ommaviy /posts API dan yuklash
        if (!posts.length) {
            try {
                const resPub = await fetch('/posts');
                if (resPub.ok) {
                    const dataPub = await resPub.json();
                    if (Array.isArray(dataPub) && dataPub.length) posts = dataPub;
                    else if (dataPub.posts && Array.isArray(dataPub.posts) && dataPub.posts.length) posts = dataPub.posts;
                }
            } catch (_) {}
        }

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
                    id: 'post_ai_agentic_2026',
                    title: "2026-yilgi Sun'iy Intellekt Inqilobi: Chatbotlardan Avtonom Agentlargacha",
                    excerpt: "LLM modellari endi oddiy suhbatdosh emas, balki murakkab vazifalarni mustaqil rejalashtirib, kod yozib, natija beruvchi avtonom agentlarga aylandi.",
                    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
                    tags: ['AI', 'Texnologiya', 'Agentlar'],
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
                    title: "Abdugofforov Ekotizimi 2.0: Zen Studio, Lofi Focus va Yangilangan Tools Lab",
                    excerpt: "Saytimiz tubdan yangilandi: endi chalg'itmaydigan ijodiy muharrir, Lofi/Ambient audio pleyer va yangi asboblar sizning xizmatingizda!",
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
        await fetch(`/api/admin/posts/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: _adminHeaders()
        }).catch(() => {});

        try {
            let local = JSON.parse(localStorage.getItem('abdu_posts') || '[]');
            local = local.filter(p => String(p.id) !== String(id));
            localStorage.setItem('abdu_posts', JSON.stringify(local));
        } catch (_) {}

        await loadDashboardAndRealData(true);
        loadCreatorPosts();
    } catch (e) {
        console.error('Postni o\'chirishda xato:', e);
        alert('O\'chirishda xatolik yuz berdi');
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
            await fetch('/api/admin/posts', {
                method: 'POST',
                headers: _adminHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(postPayload)
            });
        } catch (apiErr) {
            console.warn('Server posts API ga yuborishda ogohlantirish:', apiErr);
        }

        // 2. Telegram kanalga avtomatik e'lon yuborish (agar checkbox belgilangan bo'lsa)
        if (isTelegramChecked) {
            try {
                await fetch('/api/admin/notify/telegram', {
                    method: 'POST',
                    headers: _adminHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({ post: postPayload })
                });
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

        showPostFeedback(
            isTelegramChecked 
                ? '✅ Post muvaffaqiyatli saqlandi va Telegram kanalga e\'lon qilindi!' 
                : '✅ Post muvaffaqiyatli saqlandi va chop etildi!',
            'success'
        );

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

