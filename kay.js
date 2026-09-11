// ===== KAY ADMIN PANEL =====
// XAVFSIZLIK: PIN endi MIJOZDA tekshirilmaydi. PIN to'g'riligini faqat
// SERVER (/admin/request-code yoki /check-pin) hal qiladi. Shu sababli
// PIN hashi bu yerda saqlanmaydi (avval oshkor bo'lgan hash olib tashlandi).

// Postlarni IndexedDB orqali o'qish/yozish (katta rasm/audio sig'imi uchun)
function getPosts() {
    if (window.Store && Store.ready) return Store.get('abdu_posts') || [];
    return JSON.parse(localStorage.getItem('abdu_posts') || '[]');
}

// Postlarni saqlash — HAM lokal (IndexedDB), HAM server (Cloudflare KV).
// KV ga yozilmasa, o'zgarish faqat shu brauzerda qoladi va mehmonlar
// eski holatni ko'rishda davom etadi. Shuning uchun KV sinxronlash shart.
async function setPosts(arr) {
    if (window.Store && Store.ready) Store.set('abdu_posts', arr);
    else localStorage.setItem('abdu_posts', JSON.stringify(arr));

    // Serverga (KV) yuborish — admin token yoki PIN bilan
    if (window.Sync) {
        const token = sessionStorage.getItem('kay_admin_token');
        const pin = sessionStorage.getItem('kay_admin_pin');
        try {
            const res = await Sync.pushPosts(arr, { token, pin });
            if (res && res.ok) {
                addLog('success', 'Postlar serverga sinxronlandi (hammaga ko\'rinadi)');
            } else if (res && res.reason === 'not_configured') {
                addLog('fail', 'Server ombori (KV) sozlanmagan — faqat shu qurilmada');
            } else if (res && res.reason === 'unauthorized') {
                addLog('fail', 'Sessiya tugagan — qayta kiring (server yangilanmadi)');
            } else {
                addLog('fail', 'Serverga yuborilmadi: ' + ((res && res.message) || 'xato'));
            }
        } catch (e) {
            addLog('fail', 'Serverga ulanib bo\'lmadi');
        }
    }
}

// Sahifa yuklanishida: avval server (KV) dan eng so'nggi postlarni olamiz,
// keyin admin holatini tekshiramiz. Shunda admin panelda KV bilan bir xil
// ro'yxat ko'rinadi va o'chirish/tahrir KV ga to'g'ri yoziladi.
(async function initKay() {
    if (window.Store) {
        try { await Store.init(['abdu_posts']); } catch (e) { console.warn('Store init:', e); }
    }
    // Serverdan (KV) postlarni yuklab, lokalga keshlaymiz
    if (window.Sync) {
        try {
            const serverPosts = await Sync.fetchPosts();
            if (serverPosts && Array.isArray(serverPosts)) {
                if (window.Store && Store.ready) Store.set('abdu_posts', serverPosts);
                else localStorage.setItem('abdu_posts', JSON.stringify(serverPosts));
            }
        } catch (e) { console.warn('KV fetch:', e); }
    }
    if (sessionStorage.getItem('kay_admin') === 'true') showAdminPanel();
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

    // Noto'g'ri PIN holatini ishlovchi (urinish/blok hisoblagichi — faqat UX uchun)
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

    // 3) PIN noto'g'ri (401) → urinish/blok hisoblagichi (server ham rate-limit qiladi)
    if (res.status === 401) {
        registerWrongPin(data.message);
        return;
    }

    // 4) Boshqa server xatosi (KV yo'q, 429 — juda ko'p urinish, va h.k.)
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
            // Muvaffaqiyatli kirish — token saqlaymiz va admin panelga o'tamiz
            sessionStorage.setItem('kay_admin', 'true');
            sessionStorage.setItem('kay_admin_token', data.token);
            sessionStorage.setItem('kay_admin_pin', window.__authSession.pin); // backward compat fallback
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
                // Sessiya tugagan — PIN ekraniga qaytamiz
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
// Faqat raqam kiritish
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

// ===== ADMIN PANEL =====
function showAdminPanel() {
    document.getElementById('pin-screen').style.display = 'none';
    // Telegram 2FA ekranini ham yopamiz (aks holda dashboard ustida qolib ketadi)
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
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });

    loadStats();
    loadPosts();
    loadTasks();
    loadPortfolioForm();
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

// ===== O'QUVCHILAR VA NATIJALAR =====
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
async function loadStudents() {
    const usersBox = document.getElementById('students-list');
    const resultsBox = document.getElementById('results-table');
    if (!usersBox || !resultsBox) return;
    try {
        const res = await fetch('/admin/users', { headers: _adminHeaders() });
        const data = await res.json().catch(() => ({}));
        if (data.ok && Array.isArray(data.users)) {
            document.getElementById('students-count').textContent = data.count || data.users.length;
            usersBox.innerHTML = data.users.length ? `<table style="width:100%;border-collapse:collapse;font-size:14px;">
                <thead><tr style="text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);color:#9aa;font-size:12px;">
                    <th style="padding:8px 10px;">Ism</th><th style="padding:8px 10px;">Username</th><th style="padding:8px 10px;">Ro'yxatdan o'tgan</th><th style="padding:8px 10px;text-align:right;">Amallar</th>
                </tr></thead><tbody>${data.users.map(u => {
                    const d = u.createdAt ? new Date(u.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                    return `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                        <td style="padding:8px 10px;font-weight:600;">${_esc(u.name)}</td>
                        <td style="padding:8px 10px;color:#2dd4bf;font-weight:500;">@${_esc(u.username)}</td>
                        <td style="padding:8px 10px;color:#9aa;font-size:12px;">${d}</td>
                        <td style="padding:8px 10px;text-align:right;">
                            <button type="button" class="btn-secondary" data-action="open-reset-password" data-username="${_esc(u.username)}" data-name="${_esc(u.name)}" style="padding:4px 10px;font-size:12px;border-radius:6px;border-color:rgba(45,212,191,0.3);color:#2dd4bf;">🔑 Parol o'zgartirish</button>
                        </td>
                    </tr>`;
                }).join('')}</tbody></table>` : '<p style="color:#9aa;font-size:13px;">Hali hech kim ro\'yxatdan o\'tmagan.</p>';
        } else {
            usersBox.innerHTML = '<p style="color:#f87171;font-size:13px;">' + _esc(data.message || 'Yuklab bo\'lmadi (admin kerak)') + '</p>';
        }
    } catch (e) { usersBox.innerHTML = '<p style="color:#f87171;font-size:13px;">Serverga ulanib bo\'lmadi</p>'; }

    try {
        const res = await fetch('/results', { headers: _adminHeaders() });
        const data = await res.json().catch(() => ({}));
        if (data.ok && Array.isArray(data.results)) {
            document.getElementById('results-count').textContent = data.count || data.results.length;
            resultsBox.innerHTML = data.results.length ? `<table style="width:100%;border-collapse:collapse;font-size:14px;min-width:560px;">
                <thead><tr style="text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);color:#9aa;font-size:12px;">
                    <th style="padding:8px 10px;">O'quvchi</th><th style="padding:8px 10px;">Username</th><th style="padding:8px 10px;">Test</th><th style="padding:8px 10px;">To'g'ri</th><th style="padding:8px 10px;">Xato</th><th style="padding:8px 10px;">Foiz</th><th style="padding:8px 10px;">Sana</th>
                </tr></thead><tbody>${data.results.map(r => {
                    const d = new Date(r.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                    const color = r.pct >= 80 ? '#34d399' : r.pct >= 60 ? '#fbbf24' : '#f87171';
                    return `<tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:8px 10px;font-weight:600;">${_esc(r.name)}</td><td style="padding:8px 10px;color:#9aa;">@${_esc(r.username)}</td><td style="padding:8px 10px;">${_esc(r.testTitle || r.testId)}</td><td style="padding:8px 10px;color:#34d399;font-weight:600;">${r.score}</td><td style="padding:8px 10px;color:#f87171;font-weight:600;">${r.wrong}</td><td style="padding:8px 10px;color:${color};font-weight:700;">${r.pct}%</td><td style="padding:8px 10px;color:#9aa;font-size:12px;white-space:nowrap;">${d}</td></tr>`;
                }).join('')}</tbody></table>` : '<p style="color:#9aa;font-size:13px;">Hali test ishlanmagan.</p>';
        } else {
            resultsBox.innerHTML = '<p style="color:#f87171;font-size:13px;">' + _esc(data.message || 'Yuklab bo\'lmadi') + '</p>';
        }
    } catch (e) { resultsBox.innerHTML = '<p style="color:#f87171;font-size:13px;">Serverga ulanib bo\'lmadi</p>'; }
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

// ===== SIDEBAR NAV / TABLAR =====
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Barcha admin-tab lardan active classni olib tashlash
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Sidebar va Dock dagi barcha mos tablarni active qilish
        document.querySelectorAll(`.admin-tab[data-tab="${targetTab}"]`).forEach(t => t.classList.add('active'));
        
        // Contentni ochish
        const contentEl = document.getElementById('tab-' + targetTab);
        if (contentEl) contentEl.classList.add('active');
        
        if (targetTab === 'students') loadStudents();
        const titleEl = document.getElementById('glz-page-title');
        
        // Agar tabda o'zining title'i bo'lsa uni oladi, bo'lmasa matnini
        const titleText = tab.dataset.title || tab.querySelector('.dock-label')?.textContent || tab.textContent.replace(/[^\w\s]/g,'').trim();
        if (titleEl && titleText) titleEl.textContent = titleText;
        
        // mobil sidebarni yopish
        const sidebar = document.getElementById('glz-sidebar');
        if (sidebar) sidebar.classList.remove('open');
        const overlay = document.getElementById('glz-overlay');
        if (overlay) overlay.classList.remove('show');
    });
});

// Mobil sidebar toggle
document.getElementById('glz-menu-toggle').addEventListener('click', () => {
    document.getElementById('glz-sidebar').classList.toggle('open');
    document.getElementById('glz-overlay').classList.toggle('show');
});
document.getElementById('glz-overlay').addEventListener('click', () => {
    document.getElementById('glz-sidebar').classList.remove('open');
    document.getElementById('glz-overlay').classList.remove('show');
});

// Qidiruv (postlar bo'yicha)
document.getElementById('admin-search').addEventListener('input', () => loadPosts());

// ===== STATISTIKA =====
function loadStats() {
    const posts = getPosts();
    const tasks = JSON.parse(localStorage.getItem('abdu_tasks') || '[]');
    const totalLikes = posts.reduce((s, p) => s + (p.likes || 0), 0);
    const activeTasks = tasks.filter(t => t.status !== 'done').length;
    const uniqueDays = new Set(posts.map(p => p.date)).size;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('stat-posts', posts.length);
    set('stat-likes', totalLikes);
    set('stat-tasks', activeTasks);
    set('stat-days', uniqueDays);
    set('side-posts', posts.length);
    set('side-likes', totalLikes);
    set('side-tasks', activeTasks);
}

// ===== POSTLAR =====
function loadPosts() {
    let posts = getPosts();
    const q = (document.getElementById('admin-search')?.value || '').trim().toLowerCase();
    if (q) posts = posts.filter(p => (p.title || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q));

    const list = document.getElementById('admin-posts-list');
    if (!posts.length) {
        list.innerHTML = '<div class="glz-empty">' + (q ? 'Hech narsa topilmadi' : 'Hali post yo\'q') + '</div>';
    } else {
        list.innerHTML = posts.map(p => `
            <div class="glz-row">
                <img src="${p.image||''}">
                <div class="info">
                    <div class="t">${_esc(p.title)}</div>
                    <div class="m">${_esc(p.category)} - ${p.date} - ❤️ ${p.likes||0}</div>
                </div>
                <div class="acts">
                    <button class="icon-btn" data-action="edit-post" data-id="${p.id}" title="Tahrirlash">✏️</button>
                    <button class="icon-btn danger" data-action="delete-post" data-id="${p.id}" title="O'chirish">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    // Dashboard — so'nggi postlar
    const recent = document.getElementById('dash-recent');
    if (recent) {
        const all = getPosts();
        recent.innerHTML = all.length
            ? all.slice(0, 4).map(p => `
                <div class="glz-mini-row">
                    <img src="${p.image||''}">
                    <div><strong>${_esc(p.title)}</strong><small>${_esc(p.category)} - ❤️ ${p.likes||0}</small></div>
                </div>`).join('')
            : '<div class="glz-empty">Hali post yo\'q</div>';
    }
}

function deletePost(id) {
    if (!confirm('O\'chirasizmi?')) return;
    const posts = getPosts();
    setPosts(posts.filter(p => p.id !== id));
    loadPosts(); loadStats();
}

function editPost(id) {
    sessionStorage.setItem('kay_edit_post', id);
    window.location.href = '/';
}

// ===== REJALAR =====
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('abdu_tasks') || '[]');
    const list = document.getElementById('admin-task-list');

    const todo = tasks.filter(t => t.status === 'todo').length;
    const progress = tasks.filter(t => t.status === 'progress').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const total = tasks.length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    document.getElementById('count-todo').textContent = todo;
    document.getElementById('count-progress').textContent = progress;
    document.getElementById('count-done').textContent = done;
    document.getElementById('chart-percentage-text').textContent = pct + '%';
    const circle = document.getElementById('progress-ring-circle');
    if (circle) circle.style.strokeDashoffset = 314.16 - (314.16 * pct / 100);

    if (!tasks.length) {
        list.innerHTML = '<div class="glz-empty">Reja yo\'q</div>';
        return;
    }
    const icons = { todo: '🔴', progress: '🟡', done: '🟢' };
    list.innerHTML = tasks.map(t => `
        <div class="glz-row">
            <span style="font-size:18px;">${icons[t.status]||'⚪'}</span>
            <span class="info" style="font-size:14px;">${_esc(t.title)}</span>
            <div class="acts"><button class="icon-btn danger" data-action="delete-task" data-id="${t.id}">✕</button></div>
        </div>
    `).join('');
}

document.getElementById('admin-task-form').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('task-title-input').value.trim();
    const status = document.getElementById('task-status-input').value;
    if (!title) return;
    const tasks = JSON.parse(localStorage.getItem('abdu_tasks') || '[]');
    tasks.push({ id: Date.now(), title, status });
    localStorage.setItem('abdu_tasks', JSON.stringify(tasks));
    document.getElementById('task-title-input').value = '';
    loadTasks(); loadStats();
});

function deleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem('abdu_tasks') || '[]');
    localStorage.setItem('abdu_tasks', JSON.stringify(tasks.filter(t => t.id !== id)));
    loadTasks(); loadStats();
}

// ===== PORTFOLIO =====
function loadPortfolioForm() {
    const info = JSON.parse(localStorage.getItem('abdu_portfolio') || '{}');
    if (info.name) document.getElementById('port-name-input').value = info.name;
    if (info.title) document.getElementById('port-title-input').value = info.title;
    if (info.bio) document.getElementById('port-bio-input').value = info.bio;
    if (info.skills) document.getElementById('port-skills-input').value = info.skills;
    if (info.experience) document.getElementById('port-experience-input').value = info.experience;
}

document.getElementById('admin-port-settings-form').addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem('abdu_portfolio', JSON.stringify({
        name: document.getElementById('port-name-input').value,
        title: document.getElementById('port-title-input').value,
        bio: document.getElementById('port-bio-input').value,
        skills: document.getElementById('port-skills-input').value,
        experience: document.getElementById('port-experience-input').value,
    }));
    alert('Portfolio saqlandi ✅');
});

document.getElementById('generate-token-btn').addEventListener('click', () => {
    const pData = localStorage.getItem('abdu_portfolio');
    if (!pData) {
        alert("Oldin portfolioni saqlang!");
        return;
    }
    const payload = JSON.stringify({
        data: JSON.parse(pData),
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 soat
    });
    const token = btoa(encodeURIComponent(payload));
    const link = `${window.location.origin}/?p=${token}`;
    document.getElementById('generated-link-input').value = link;
    document.getElementById('generated-link-box').style.display = 'block';
});

document.getElementById('copy-link-btn').addEventListener('click', () => {
    const input = document.getElementById('generated-link-input');
    navigator.clipboard.writeText(input.value).then(() => {
        document.getElementById('copy-link-btn').textContent = 'Nusxalandi ✅';
        setTimeout(() => document.getElementById('copy-link-btn').textContent = 'Nusxa', 2000);
    });
});

// ===== XAVFSIZLIK LOG =====
function addLog(type, message) {
    const logs = JSON.parse(localStorage.getItem('kay_logs') || '[]');
    logs.unshift({ type, message, time: new Date().toLocaleString('uz-UZ') });
    localStorage.setItem('kay_logs', JSON.stringify(logs.slice(0, 50)));
}

function loadSecurityLog() {
    const logs = JSON.parse(localStorage.getItem('kay_logs') || '[]');
    const list = document.getElementById('security-log-list');
    if (!logs.length) {
        list.innerHTML = '<div class="log-item" style="color:var(--text-secondary);justify-content:center;">Hali log yo\'q</div>';
        return;
    }
    list.innerHTML = logs.map(l => `
        <div class="log-item">
            <div class="log-dot ${l.type === 'success' ? 'ok' : 'fail'}"></div>
            <span>${l.message}</span>
            <span class="log-time">${l.time}</span>
        </div>
    `).join('');
}

document.getElementById('clear-log-btn').addEventListener('click', () => {
    if (!confirm('Loglarni tozalash?')) return;
    localStorage.removeItem('kay_logs');
    loadSecurityLog();
});

// ===== SOZLAMALAR =====
document.getElementById('save-settings-btn').addEventListener('click', () => {
    localStorage.setItem('kay_site_name', document.getElementById('setting-site-name').value);
    localStorage.setItem('kay_site_desc', document.getElementById('setting-site-desc').value);
    alert('Sozlamalar saqlandi ✅');
});

document.getElementById('reset-all-btn').addEventListener('click', async () => {
    if (!confirm('BARCHA ma\'lumotlar o\'chadi! Ishonchingiz komilmi?')) return;
    if (!confirm('Bu amalni qaytarib bo\'lmaydi. Davom etasizmi?')) return;
    if (window.Store) Store.remove('abdu_posts');
    ['abdu_posts','abdu_tasks','abdu_portfolio','abdu_portfolio_tokens','kay_logs'].forEach(k => localStorage.removeItem(k));
    // Serverni (KV) ham tozalaymiz — aks holda mehmonlar eski postlarni
    // ko'rishda davom etadi
    if (window.Sync) {
        const token = sessionStorage.getItem('kay_admin_token');
        const pin = sessionStorage.getItem('kay_admin_pin');
        try {
            const res = await Sync.pushPosts([], { token, pin });
            if (res && res.ok) {
                alert('Tozalandi (server ham yangilandi — postlar hammadan o\'chdi)');
            } else {
                alert('Lokal tozalandi, lekin serverga yetib bormadi: ' + ((res && res.message) || 'xato') + '\nQayta kirib urinib ko\'ring.');
            }
        } catch (e) {
            alert('Lokal tozalandi, lekin serverga ulanib bo\'lmadi.');
        }
    } else {
        alert('Tozalandi');
    }
    loadStats(); loadPosts(); loadTasks();
});


// ===== GLOBAL EVENT DELEGATION FOR CSP COMPLIANCE =====
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'delete-post') {
        deletePost(Number(btn.dataset.id));
    } else if (action === 'edit-post') {
        editPost(Number(btn.dataset.id));
    } else if (action === 'delete-task') {
        deleteTask(Number(btn.dataset.id));
    } else if (action === 'open-reset-password') {
        openResetPasswordModal(btn.dataset.username, btn.dataset.name);
    } else if (action === 'close-reset-password') {
        closeResetPasswordModal();
    }
});

// Global image error handler (replaces inline onerror)
document.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
}, true);

// Password reset modal form submission
document.getElementById('reset-password-form')?.addEventListener('submit', handleResetPasswordSubmit);
