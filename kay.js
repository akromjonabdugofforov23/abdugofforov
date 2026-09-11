// ===== KAY ADMIN PANEL =====
// XAVFSIZLIK: PIN endi MIJOZDA tekshirilmaydi. PIN to'g'riligini faqat
// SERVER (/admin/request-code yoki /check-pin) hal qiladi. Shu sababli
// PIN hashi bu yerda saqlanmaydi.

// Global keshlar
let cachedUsers = [];
let cachedResults = [];
let currentTaskFilter = 'all';

// Sahifa yuklanishida admin holatini tekshiramiz
(function initKay() {
    if (sessionStorage.getItem('kay_admin') === 'true') {
        showAdminPanel();
    }
})();

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
        if (attempts >= 3) {
            const lockCount = parseInt(localStorage.getItem('kay_lockcount') || '0') + 1;
            localStorage.setItem('kay_lockcount', lockCount);
            const lockSeconds = Math.min(60 * Math.pow(2, lockCount - 1), 3600);
            localStorage.setItem('kay_lock', Date.now() + lockSeconds * 1000);
            localStorage.removeItem('kay_attempts');
            addLog('fail', `Blok faollashtirildi: ${lockSeconds}s`);
            pinError.textContent = `3 marta xato! ${lockSeconds} soniya kuting.`;
        } else {
            pinError.textContent = msg || `Noto'g'ri PIN (${attempts}/3)`;
        }
        pinError.style.display = 'block';
        pinInput.value = '';
        pinInput.focus();
    }

    let res, data;
    try {
        // PIN ni SERVERGA yuboramiz — to'g'riligini FAQAT server hal qiladi
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

    // 2) Telegram sozlanmagan → PIN ni /check-pin orqali SERVERDA tasdiqlaymiz
    if (data.configured === false || (res.status === 503 && /telegram/i.test(data.message || ''))) {
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

document.getElementById('pin-submit-btn').addEventListener('click', tryLogin);
pinInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

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

document.getElementById('tg-submit-btn').addEventListener('click', verifyTgCode);
document.getElementById('tg-code-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') verifyTgCode();
});
document.getElementById('tg-code-input').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
});
document.getElementById('tg-resend-btn').addEventListener('click', resendTgCode);
document.getElementById('tg-cancel-btn').addEventListener('click', () => {
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
    document.getElementById('pin-screen').style.display = 'none';
    const tg = document.getElementById('tg-screen');
    if (tg) tg.style.display = 'none';
    if (typeof tgCountdownTimer !== 'undefined' && tgCountdownTimer) {
        clearInterval(tgCountdownTimer);
        tgCountdownTimer = null;
    }
    document.getElementById('admin-screen').classList.add('show');

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech';
    document.getElementById('admin-greeting').textContent = `${greeting}, Akromjon 👋`;

    const dateEl = document.getElementById('glz-date');
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    loadDashboardAndRealData();
    loadTasks();
    loadSecurityLog();
}

document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem('kay_admin');
    sessionStorage.removeItem('kay_admin_token');
    sessionStorage.removeItem('kay_admin_pin');
    document.getElementById('admin-screen').classList.remove('show');
    document.getElementById('pin-screen').style.display = 'block';
    pinInput.value = '';
    pinError.style.display = 'none';
});

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
        // Parallel so'rov: Foydalanuvchilar va Test natijalari
        const [usersRes, resultsRes] = await Promise.all([
            fetch('/admin/users', { headers: _adminHeaders() }).catch(() => null),
            fetch('/results', { headers: _adminHeaders() }).catch(() => null)
        ]);

        if (usersRes && usersRes.ok) {
            const uData = await usersRes.json().catch(() => ({}));
            if (uData.ok && Array.isArray(uData.users)) {
                cachedUsers = uData.users;
                if (dbStatusEl) { dbStatusEl.textContent = 'Ulangan'; dbStatusEl.className = 'glz-ok'; }
            }
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

    const totalStudents = cachedUsers.length;
    const totalTests = cachedResults.length;
    const avgScore = totalTests ? Math.round(cachedResults.reduce((s, r) => s + (r.pct || 0), 0) / totalTests) : 0;

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

    if (!targetUsername || !newPassword || newPassword.length < 6) {
        if (msgEl) {
            msgEl.textContent = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
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
