// ============================================================
// AUTH — O'quvchi ro'yxatdan o'tish / kirish (frontend)
// Token localStorage'da saqlanadi ("eslab qolish"). Server: /auth/*
// ============================================================
(function () {
    const TOKEN_KEY = 'abdu_user_token';

    const Auth = {
        token: localStorage.getItem(TOKEN_KEY) || null,
        user: null,

        isLoggedIn() { return !!this.token && !!this.user; },
        isAdmin() {
            if (!this.isLoggedIn() || !this.user) return false;
            if (this.user.role === 'admin') return true;
            const u = (this.user.username || '').toLowerCase();
            if (u === 'abdugofforov' || u === 'admin' || u === 'akrin4477' || u === 'akrin') return true;
            return false;
        },

        _headers(extra) {
            const h = Object.assign({ 'Content-Type': 'application/json' }, extra || {});
            if (this.token) h['x-user-token'] = this.token;
            return h;
        },

        async register(name, username, password, adminPin = '') {
            const body = { name, username, password };
            if (adminPin) body.adminPin = adminPin;
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json().catch(() => ({}));
            if (data.ok && data.token) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
                this.updateUIState();
            }
            return data;
        },

        async login(username, password) {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json().catch(() => ({}));
            if (data.ok && data.token) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
                this.updateUIState();
            }
            return data;
        },

        // Real Telegram OAuth / WebApp foydalanuvchisini autentifikatsiya qilish
        async loginWithTelegram(tgUser) {
            if (!tgUser) return { ok: false, message: "Telegram foydalanuvchi ma'lumoti bo'sh" };

            try {
                const res = await fetch('/auth/telegram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: tgUser }),
                });
                const data = await res.json().catch(() => ({}));
                if (data.ok && data.token) {
                    this.token = data.token;
                    this.user = data.user;
                    localStorage.setItem(TOKEN_KEY, data.token);
                    localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
                    this.updateUIState();
                    return { ok: true, user: this.user };
                } else if (data.message) {
                    return { ok: false, message: data.message };
                }
            } catch (e) {
                console.warn('Server Telegram Auth so\'rovida xatolik:', e);
            }

            return { ok: false, message: "Server bilan bog'lanishda xatolik." };
        },

        async updateProfile(name, photo, extra = {}) {
            if (!this.user) return { ok: false, message: "Tizimga kirilmagan" };
            if (name && typeof name === 'string' && name.trim()) this.user.name = name.trim();
            if (photo !== undefined) this.user.photo = photo;
            
            localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
            this.updateUIState();

            try {
                const payload = Object.assign({ name: this.user.name, photo: this.user.photo }, extra);
                const res = await fetch('/auth/profile', {
                    method: 'POST',
                    headers: this._headers(),
                    body: JSON.stringify(payload),
                });
                const data = await res.json().catch(() => ({}));
                if (data.ok && data.user) {
                    this.user = Object.assign(this.user, data.user);
                    localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
                    this.updateUIState();
                    return { ok: true, user: this.user, message: data.message };
                } else if (!data.ok && data.message) {
                    return { ok: false, message: data.message };
                }
            } catch (e) {
                console.warn('Profile update error:', e);
            }

            return { ok: true, user: this.user };
        },

        async logout() {
            try {
                await fetch('/auth/logout', { method: 'POST', headers: this._headers() });
            } catch (e) {}
            this.token = null;
            this.user = null;
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('abdu_user_data');
            sessionStorage.removeItem('kay_admin');
            sessionStorage.removeItem('kay_admin_token');
            sessionStorage.removeItem('kay_admin_pin');
            document.body.classList.remove('admin-mode');
            this.updateUIState();
            if (typeof renderPosts === 'function') renderPosts();
        },

        // Token amal qilsa, foydalanuvchini tiklaydi
        async restore() {
            if (!this.token) return null;
            const savedData = localStorage.getItem('abdu_user_data');
            if (savedData) {
                try {
                    this.user = JSON.parse(savedData);
                    this.updateUIState();
                    return this.user;
                } catch(e) {}
            }
            try {
                const res = await fetch('/auth/me', { headers: this._headers() });
                const data = await res.json().catch(() => ({}));
                if (data.ok && data.user) {
                    this.user = data.user;
                    localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
                    this.updateUIState();
                    return this.user;
                }
            } catch (e) {}

            this.token = null;
            this.user = null;
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('abdu_user_data');
            document.body.classList.remove('admin-mode');
            this.updateUIState();
            return null;
        },

        // UI holatini yangilash
        updateUIState() {
            try {
                const userMenu = document.getElementById('user-menu');
                const loginBtnEl = document.getElementById('login-btn');
                const addPostBtnEl = document.getElementById('add-post-btn');
                const fabAddEl = document.getElementById('fab-add');
                const isCurrentlyAdmin = this.isAdmin() || (sessionStorage.getItem('kay_admin') === 'true');

                if (isCurrentlyAdmin) {
                    document.body.classList.add('admin-mode');
                    if (addPostBtnEl) addPostBtnEl.style.display = 'inline-flex';
                    if (fabAddEl && window.innerWidth <= 768) fabAddEl.style.display = 'flex';
                } else {
                    document.body.classList.remove('admin-mode');
                    if (addPostBtnEl) addPostBtnEl.style.display = 'none';
                    if (fabAddEl) fabAddEl.style.display = 'none';
                }

                if (this.isLoggedIn()) {
                    if (userMenu) userMenu.style.display = '';
                    if (loginBtnEl) loginBtnEl.style.display = 'none';
                    const nameLabel = document.getElementById('user-name-label');
                    const avatarEl = document.getElementById('user-avatar');
                    const ddName = document.getElementById('user-dd-name');
                    const ddUsername = document.getElementById('user-dd-username');
                    const nameStr = this.user.name || this.user.username || 'Foydalanuvchi';
                    
                    if (nameLabel) nameLabel.textContent = nameStr;
                    if (avatarEl) {
                        if (this.user.photo && (this.user.photo.startsWith('http') || this.user.photo.startsWith('data:'))) {
                            avatarEl.innerHTML = `<img src="${this.user.photo}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                        } else if (this.user.photo) {
                            avatarEl.textContent = this.user.photo; // Emoji avatar
                        } else {
                            avatarEl.textContent = nameStr.charAt(0).toUpperCase();
                        }
                    }
                    if (ddName) {
                        const safeName = String(nameStr).replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t));
                        ddName.innerHTML = `${safeName} ${isCurrentlyAdmin ? '<span style="font-size:11px; background:linear-gradient(135deg,#8b5cf6,#38bdf8); color:#fff; padding:2px 8px; border-radius:999px; margin-left:4px; font-weight:700;">👑 Admin</span>' : ''}`;
                    }
                    if (ddUsername) ddUsername.textContent = '@' + (this.user.username || '');
                    const userAdminLink = document.getElementById('user-admin-link');
                    if (userAdminLink) userAdminLink.style.display = isCurrentlyAdmin ? 'flex' : 'none';
                    const drawerAuthLink = document.getElementById('drawer-auth-link');
                    const drawerAuthText = document.getElementById('drawer-auth-text');
                    if (drawerAuthText) drawerAuthText.textContent = nameStr;
                    if (drawerAuthLink) {
                        drawerAuthLink.setAttribute('data-action', 'open-results');
                        drawerAuthLink.removeAttribute('data-mode');
                    }
                } else {
                    if (userMenu) userMenu.style.display = 'none';
                    if (loginBtnEl) loginBtnEl.style.display = '';
                    const userAdminLink = document.getElementById('user-admin-link');
                    if (userAdminLink) userAdminLink.style.display = 'none';
                    const drawerAuthLink = document.getElementById('drawer-auth-link');
                    const drawerAuthText = document.getElementById('drawer-auth-text');
                    if (drawerAuthText) drawerAuthText.textContent = 'Kirish';
                    if (drawerAuthLink) {
                        drawerAuthLink.setAttribute('data-action', 'open-auth');
                        drawerAuthLink.setAttribute('data-mode', 'login');
                    }
                }
            } catch (e) {
                console.error("UI state update error:", e);
            }
        },

        // Test natijasini serverga yuborish
        async submitResult(result) {
            if (!this.isLoggedIn()) return { ok: false, reason: 'not_logged_in' };
            try {
                const res = await fetch('/results', {
                    method: 'POST',
                    headers: this._headers(),
                    body: JSON.stringify(result),
                });
                return await res.json().catch(() => ({ ok: false }));
            } catch (e) {
                return { ok: false, reason: 'network' };
            }
        },

        getLocalResults() {
            try { return JSON.parse(localStorage.getItem('deutsch_history') || '[]'); }
            catch (e) { return []; }
        },
    };

    // Global Telegram OAuth Widget Callback
    window.onTelegramAuth = async function(user) {
        if (window.Auth && user) {
            const res = await Auth.loginWithTelegram(user);
            if (res.ok) {
                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.classList.remove('active');
                document.body.style.overflow = '';
                if (typeof showToast === 'function') {
                    showToast("✈️ Telegram orqali tasdiqlangan profil bilan kirdingiz!", "success");
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast(res.message || "Telegram tasdiqlashda xatolik yuz berdi", "error");
                }
            }
        }
    };

    // Rasmiy Telegram Widget funksiyasini yuklash
    window.initTelegramWidget = function(botUsername) {
        const container = document.getElementById('telegram-official-widget-container');
        if (!container) return;
        container.innerHTML = '';

        const botName = botUsername || window.TELEGRAM_BOT_USERNAME || 'abdugofforov_admin_bot';
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '12');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;
        container.appendChild(script);
    };

    // Telegram Code Auth UI ko'rsatish/yashirish
    window.toggleTelegramCodeAuthUI = function() {
        const form = document.getElementById('tg-code-form');
        if (!form) return;
        if (form.style.display === 'none' || !form.style.display) {
            form.style.display = 'block';
            const chatInput = document.getElementById('tg-chat-input');
            if (chatInput) chatInput.focus();
        } else {
            form.style.display = 'none';
        }
    };

    // Telegram Bot orqali 6-xonali kod so'rash
    let pendingTgTarget = '';
    window.sendTelegramAuthCode = async function() {
        const chatInput = document.getElementById('tg-chat-input');
        const target = chatInput ? chatInput.value.trim() : '';
        const btn = document.getElementById('tg-send-code-btn');

        if (!target) {
            if (typeof showToast === 'function') showToast("Telegram Chat ID yoki @username kiriting", "error");
            return;
        }

        if (btn) { btn.disabled = true; btn.textContent = 'Yuborilmoqda...'; }

        try {
            const res = await fetch('/auth/telegram-code-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target })
            });
            const data = await res.json().catch(() => ({}));
            if (data.ok) {
                pendingTgTarget = data.target || target.replace('@', '');
                document.getElementById('tg-code-step-1').style.display = 'none';
                document.getElementById('tg-code-step-2').style.display = 'block';
                const codeInput = document.getElementById('tg-code-input');
                if (codeInput) codeInput.focus();
                if (typeof showToast === 'function') showToast("📩 Kod Telegram'ingizga yuborildi!", "success");
            } else {
                if (typeof showToast === 'function') showToast(data.message || "Kod yuborishda xatolik!", "error");
            }
        } catch (e) {
            if (typeof showToast === 'function') showToast("Server bilan bog'lanishda xato!", "error");
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Kod olish'; }
        }
    };

    // Telegram 6-xonali kodini tasdiqlash
    window.verifyTelegramAuthCode = async function() {
        const codeInput = document.getElementById('tg-code-input');
        const code = codeInput ? codeInput.value.trim() : '';
        const btn = document.getElementById('tg-verify-code-btn');

        if (!code || code.length !== 6) {
            if (typeof showToast === 'function') showToast("6 xonali kodni kiriting", "error");
            return;
        }

        if (btn) { btn.disabled = true; btn.textContent = 'Tekshirilmoqda...'; }

        try {
            const res = await fetch('/auth/telegram-code-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target: pendingTgTarget, code })
            });
            const data = await res.json().catch(() => ({}));
            if (data.ok && data.token) {
                Auth.token = data.token;
                Auth.user = data.user;
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem('abdu_user_data', JSON.stringify(Auth.user));
                Auth.updateUIState();

                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.classList.remove('active');
                document.body.style.overflow = '';
                if (typeof showToast === 'function') showToast("✈️ Telegram orqali muvaffaqiyatli kirdingiz!", "success");
            } else {
                if (typeof showToast === 'function') showToast(data.message || "Kod noto'g'ri!", "error");
            }
        } catch (e) {
            if (typeof showToast === 'function') showToast("Tasdiqlashda xatolik yuz berdi", "error");
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Tasdiqlash'; }
        }
    };

    // ============================================================
    // UNIVERSAL FOYDALANUVCHI PROFILI VA TAHRIRLASH TIZIMI (Admin & O'quvchi)
    // ============================================================
    function safeEscape(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, t => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[t] || t));
    }
    if (!window.escapeHTML) window.escapeHTML = safeEscape;

    function notifyToast(msg, kind) {
        if (typeof window.showToast === 'function') {
            window.showToast(msg, kind || 'info');
        }
    }

    function openMyResults(tab) {
        const modal = document.getElementById('myresults-modal');
        const content = document.getElementById('myresults-content');
        if (!modal || !content) return;

        const user = (window.Auth && Auth.user) ? Auth.user : { name: 'Foydalanuvchi', username: 'mehmon' };
        const isAdmin = window.Auth ? Auth.isAdmin() : false;
        const hist = (window.Auth && Auth.getLocalResults) ? Auth.getLocalResults() : [];

        let totalTests = hist.length;
        let totalScore = 0;
        let totalQuestions = 0;
        let totalCorrect = 0;
        let totalWrong = 0;

        hist.forEach(h => {
            totalScore += (h.score || 0);
            totalQuestions += (h.total || 0);
            totalCorrect += (h.score || 0);
            totalWrong += ((h.total || 0) - (h.score || 0));
        });

        const avgPct = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        const xp = localStorage.getItem('abdu_xp') || '0';
        const streak = localStorage.getItem('abdu_streak') || '1';

        const nameStr = user.name || user.username || 'Foydalanuvchi';
        const initial = safeEscape(nameStr.charAt(0).toUpperCase());

        let avatarHtml = `<div id="profile-avatar-display" style="width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#38bdf8);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#fff;box-shadow:0 4px 14px rgba(139,92,246,0.35);flex-shrink:0;">${initial}</div>`;
        if (user.photo && (user.photo.startsWith('http') || user.photo.startsWith('data:'))) {
            avatarHtml = `<img id="profile-avatar-display" src="${safeEscape(user.photo)}" alt="Avatar" style="width:58px;height:58px;border-radius:50%;object-fit:cover;border:2px solid var(--accent-color,#8b5cf6);box-shadow:0 4px 14px rgba(139,92,246,0.3);flex-shrink:0;">`;
        } else if (user.photo) {
            avatarHtml = `<div id="profile-avatar-display" style="width:58px;height:58px;border-radius:50%;background:var(--glass-bg-strong,rgba(255,255,255,0.08));display:flex;align-items:center;justify-content:center;font-size:30px;border:1px solid var(--glass-border);box-shadow:0 4px 14px rgba(0,0,0,0.15);flex-shrink:0;">${safeEscape(user.photo)}</div>`;
        }

        let historyRows = '';
        if (!hist.length) {
            historyRows = `
                <div style="text-align:center;padding:22px;color:var(--text-secondary);background:var(--glass-bg);border-radius:12px;border:1px solid var(--glass-border);font-size:13px;">
                    <div style="font-size:26px;margin-bottom:6px;">📚</div>
                    <div>Hali biror test ishlanmadi. Bilimingizni sinash uchun Nemis tili testlaridan boshlang!</div>
                    <a href="https://deutsch.abdugofforov.uz/" target="_blank" rel="noopener noreferrer" class="btn-primary" style="display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:7px 16px;font-size:12px;text-decoration:none;">
                        🇩🇪 Nemis tili bo'limiga o'tish
                    </a>
                </div>
            `;
        } else {
            historyRows = hist.slice(0, 25).map((h, idx) => {
                const d = new Date(h.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                const color = h.pct >= 80 ? '#34d399' : h.pct >= 60 ? '#fbbf24' : '#f87171';
                const wrongCount = (h.total || 0) - (h.score || 0);

                let detailsBtn = '';
                let detailsBlock = '';
                if (h.details && h.details.length) {
                    const detailsId = `hist-details-${idx}`;
                    detailsBtn = `<button type="button" data-action="toggle-details" data-target="${detailsId}" style="background:transparent;border:none;color:var(--color-purple-light,#8b5cf6);font-size:12px;cursor:pointer;padding:4px 0;text-decoration:underline;">🔍 Xatolar va to'g'ri javoblarni ko'rish (${h.details.length} ta)</button>`;
                    
                    detailsBlock = `
                        <div id="${detailsId}" style="display:none;margin-top:10px;padding:12px;background:var(--tag-bg,rgba(0,0,0,0.2));border-radius:10px;border-left:3px solid #ef4444;font-size:12px;text-align:left;">
                            ${h.details.map((w, wIdx) => `
                                <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed var(--glass-border);">
                                    <div style="font-weight:600;color:var(--text-primary);">${wIdx+1}. ${safeEscape(w.q || '')}</div>
                                    <div style="color:#ef4444;">Sizning javobingiz: <s>${safeEscape(w.userAns || '')}</s></div>
                                    <div style="color:#22c55e;font-weight:500;">To'g'ri javob: ${safeEscape(w.correctAns || '')}</div>
                                    ${w.explanation ? `<div style="color:var(--text-muted);font-size:11px;margin-top:2px;">💡 ${safeEscape(w.explanation)}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    `;
                }

                return `
                    <div style="padding:12px 14px;margin-bottom:10px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:12px;text-align:left;">
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:13px;margin-bottom:6px;">
                            <span style="text-transform:uppercase;font-weight:700;color:var(--color-purple-light,#8b5cf6);">${safeEscape(String(h.level || 'TEST'))}</span>
                            <span style="font-weight:700;color:${color};">${h.score}/${h.total} (${h.pct}%)</span>
                            <span style="color:var(--text-muted);font-size:11px;">${d}</span>
                        </div>
                        <div style="height:6px;background:var(--glass-border);border-radius:3px;overflow:hidden;margin-bottom:8px;">
                            <div style="height:100%;width:${h.pct}%;background:${color};"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--text-secondary);">
                            <span>🟢 ${h.score} to'g'ri | 🔴 ${wrongCount} xato</span>
                            ${detailsBtn}
                        </div>
                        ${detailsBlock}
                    </div>
                `;
            }).join('');
        }

        const roleBadge = isAdmin
            ? `<span style="font-size:11px;background:linear-gradient(135deg,#8b5cf6,#38bdf8);color:#fff;padding:2px 8px;border-radius:999px;font-weight:700;box-shadow:0 2px 6px rgba(139,92,246,0.3);">👑 Admin</span>`
            : `<span style="font-size:11px;background:rgba(56,189,248,0.15);color:#38bdf8;padding:2px 8px;border-radius:999px;font-weight:600;border:1px solid rgba(56,189,248,0.3);">🎓 O'quvchi</span>`;

        const adminActions = isAdmin ? `
            <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
                <a href="kay.html" class="btn-secondary" style="padding:6px 12px;font-size:12px;text-decoration:none;display:inline-flex;align-items:center;gap:4px;border-radius:8px;">
                    ⚙️ Admin paneli
                </a>
                <button type="button" data-action="profile-zen-write" class="btn-primary" style="padding:6px 12px;font-size:12px;display:inline-flex;align-items:center;gap:4px;border-radius:8px;">
                    ✍️ Yangi maqola
                </button>
            </div>
        ` : '';

        content.innerHTML = `
            <!-- Profile Header Card -->
            <div style="display:flex;align-items:center;gap:16px;padding:16px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:16px;margin-bottom:18px;flex-wrap:wrap;text-align:left;">
                ${avatarHtml}
                <div style="flex:1;min-width:180px;">
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <h3 style="font-family:'Playfair Display',serif;font-size:20px;margin:0;color:var(--text-primary);font-weight:700;">${safeEscape(nameStr)}</h3>
                        ${roleBadge}
                        <button type="button" data-action="toggle-edit-profile" class="btn-secondary" style="padding:4px 10px;font-size:12px;border-radius:6px;cursor:pointer;" title="Profilni tahrirlash">✏️ Tahrirlash</button>
                    </div>
                    <p style="color:var(--text-secondary);font-size:13px;margin:3px 0 0 0;">@${safeEscape(user.username || 'user')}</p>
                    <div style="display:flex;gap:8px;margin-top:8px;font-size:12px;flex-wrap:wrap;">
                        <span style="background:rgba(147,51,234,0.15);color:var(--color-purple-light,#a855f7);padding:3px 8px;border-radius:8px;font-weight:600;">🔥 ${streak} Kunlik Streak</span>
                        <span style="background:rgba(59,130,246,0.15);color:#60a5fa;padding:3px 8px;border-radius:8px;font-weight:600;">⭐ ${xp} XP</span>
                    </div>
                    ${adminActions}
                </div>
            </div>

            <!-- Inline Profile Edit Section -->
            <div id="profile-edit-section" style="display:${tab === 'edit' ? 'block' : 'none'};padding:18px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.25);border-radius:16px;margin-bottom:20px;text-align:left;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <h4 style="margin:0;font-size:16px;color:var(--text-primary);font-weight:600;">✏️ Profilni Tahrirlash</h4>
                    <span style="font-size:12px;color:var(--text-muted);">${isAdmin ? '👑 Admin profili' : '🎓 Foydalanuvchi'}</span>
                </div>
                
                <form id="edit-profile-form">
                    <div style="margin-bottom:14px;">
                        <label for="edit-profile-name" style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">Ism / Nickname:</label>
                        <input type="text" id="edit-profile-name" class="form-input" value="${safeEscape(user.name || '')}" placeholder="Ismingizni kiriting" style="width:100%;box-sizing:border-box;" required maxlength="50">
                    </div>

                    <div style="margin-bottom:14px;">
                        <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;">Avatar tanlang (Emoji yoki Rasm URL):</label>
                        <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
                            ${['👨‍💻', '🎓', '🦁', '🚀', '⭐', '⚡', '👑', '🔥', '🐱', '🦊', '🥋', '💡'].map(emoji => `
                                <button type="button" data-action="select-profile-photo" data-emoji="${emoji}" style="padding:6px 10px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:8px;cursor:pointer;font-size:18px;">${emoji}</button>
                            `).join('')}
                        </div>
                        <input type="text" id="edit-profile-photo" class="form-input" value="${safeEscape(user.photo || '')}" placeholder="Masalan: 👨‍💻 yoki https://example.com/avatar.jpg" style="width:100%;box-sizing:border-box;">
                        <small style="color:var(--text-muted);font-size:11px;display:block;margin-top:4px;">Yuqoridagi emojilardan birini bosing yoki o'zingizning rasm havolangizni (URL) kiriting.</small>
                    </div>

                    <!-- Parolni o'zgartirish bloki (ochilib-yopiluvchi) -->
                    <div style="margin-bottom:16px;border-top:1px dashed var(--glass-border);padding-top:12px;">
                        <button type="button" data-action="toggle-profile-password" style="background:none;border:none;color:var(--color-purple-light,#8b5cf6);font-size:13px;cursor:pointer;padding:0;font-weight:600;display:flex;align-items:center;gap:6px;">
                            <span>🔒</span> <span>Parolni o'zgartirish (ixtiyoriy)</span> <span>▾</span>
                        </button>
                        
                        <div id="profile-password-fields" style="display:none;margin-top:10px;padding:12px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:10px;">
                            <div style="margin-bottom:10px;">
                                <label for="edit-profile-current-pass" style="font-size:12px;color:var(--text-secondary);display:block;margin-bottom:4px;">Joriy parol ${isAdmin ? '(yoki Admin PIN)' : ''}:</label>
                                <input type="password" id="edit-profile-current-pass" class="form-input" placeholder="Joriy parolingizni kiriting" style="width:100%;box-sizing:border-box;" autocomplete="current-password">
                            </div>
                            <div>
                                <label for="edit-profile-new-pass" style="font-size:12px;color:var(--text-secondary);display:block;margin-bottom:4px;">Yangi parol (kamida 6 ta belgi):</label>
                                <input type="password" id="edit-profile-new-pass" class="form-input" placeholder="Yangi parolni kiriting" style="width:100%;box-sizing:border-box;" autocomplete="new-password">
                            </div>
                        </div>
                    </div>

                    <div style="display:flex;gap:10px;justify-content:flex-end;">
                        <button type="button" data-action="toggle-edit-profile" class="btn-secondary" style="padding:8px 16px;font-size:13px;">Bekor qilish</button>
                        <button type="submit" id="save-profile-btn" class="btn-primary" style="padding:8px 20px;font-size:13px;font-weight:600;">Saqlash</button>
                    </div>
                </form>
            </div>

            <!-- Statistics Grid -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;">
                <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:12px;padding:10px;text-align:center;">
                    <div style="font-size:18px;font-weight:700;color:var(--color-purple-light,#8b5cf6);">${totalTests}</div>
                    <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">Testlar</div>
                </div>
                <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:12px;padding:10px;text-align:center;">
                    <div style="font-size:18px;font-weight:700;color:#22c55e;">${totalCorrect}</div>
                    <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">To'g'ri 🟢</div>
                </div>
                <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:12px;padding:10px;text-align:center;">
                    <div style="font-size:18px;font-weight:700;color:#ef4444;">${totalWrong}</div>
                    <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">Xatolar 🔴</div>
                </div>
                <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:12px;padding:10px;text-align:center;">
                    <div style="font-size:18px;font-weight:700;color:#fbbf24;">${avgPct}%</div>
                    <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">O'rtacha</div>
                </div>
            </div>

            <h4 style="text-align:left;font-size:14px;margin:0 0 10px 0;color:var(--text-primary);font-weight:600;">
                📜 Ishlangan Testlar va Faollik:
            </h4>
            <div style="max-height:260px;overflow-y:auto;padding-right:4px;">
                ${historyRows}
            </div>

            <div style="margin-top:20px;padding-top:14px;border-top:1px solid var(--glass-border);display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--text-muted);">Sessiya: Faol</span>
                <button type="button" data-action="profile-logout" class="btn-secondary" style="padding:6px 14px;font-size:12px;color:#f87171;border-color:rgba(248,113,113,0.3);">
                    🚪 Chiqish
                </button>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (tab === 'edit') {
            const nameInput = document.getElementById('edit-profile-name');
            if (nameInput) setTimeout(() => nameInput.focus(), 150);
        }
    }

    function toggleEditProfileForm() {
        const sec = document.getElementById('profile-edit-section');
        if (sec) {
            const isHidden = (sec.style.display === 'none' || !sec.style.display);
            sec.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                const nameInput = document.getElementById('edit-profile-name');
                if (nameInput) nameInput.focus();
            }
        }
    }

    function toggleProfilePasswordFields() {
        const fields = document.getElementById('profile-password-fields');
        if (fields) {
            fields.style.display = (fields.style.display === 'none' || !fields.style.display) ? 'block' : 'none';
        }
    }

    async function saveProfileChanges(e) {
        if (e && e.preventDefault) e.preventDefault();
        const nameInput = document.getElementById('edit-profile-name');
        const photoInput = document.getElementById('edit-profile-photo');
        const currPassInput = document.getElementById('edit-profile-current-pass');
        const newPassInput = document.getElementById('edit-profile-new-pass');
        const saveBtn = document.getElementById('save-profile-btn');

        const name = nameInput ? nameInput.value.trim() : '';
        const photo = photoInput ? photoInput.value.trim() : '';
        const currentPassword = currPassInput ? currPassInput.value : '';
        const newPassword = newPassInput ? newPassInput.value : '';

        if (!name) {
            notifyToast("Iltimos, ismingizni kiriting", "warn");
            if (nameInput) nameInput.focus();
            return;
        }

        if (newPassword && !currentPassword) {
            notifyToast("Parolni o'zgartirish uchun joriy parolni kiriting", "warn");
            if (currPassInput) currPassInput.focus();
            return;
        }
        if (newPassword && newPassword.length < 6) {
            notifyToast("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak", "warn");
            if (newPassInput) newPassInput.focus();
            return;
        }

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saqlanmoqda...';
        }

        const extra = {};
        if (newPassword) {
            extra.currentPassword = currentPassword;
            extra.newPassword = newPassword;
        }

        const res = await Auth.updateProfile(name, photo, extra);
        if (res.ok) {
            notifyToast("✏️ Profil muvaffaqiyatli yangilandi!", "success");
            openMyResults(); // Yangilangan holatda modalni qayta chizamiz
        } else {
            notifyToast(res.message || "Profilni yangilashda xatolik yuz berdi", "error");
        }

        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Saqlash';
        }
    }

    // Modal va Profil hodisalarini ushlash
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;

        // Emoji tanlash
        const emojiBtn = target.closest('[data-action="select-profile-photo"]');
        if (emojiBtn) {
            e.preventDefault();
            const emoji = emojiBtn.dataset.emoji;
            const photoInput = document.getElementById('edit-profile-photo');
            if (photoInput && emoji) photoInput.value = emoji;
            return;
        }

        // Tahrirlashni ochish/yopish
        const toggleEditBtn = target.closest('[data-action="toggle-edit-profile"]');
        if (toggleEditBtn) {
            e.preventDefault();
            toggleEditProfileForm();
            return;
        }

        // Parol blokini ochish/yopish
        const togglePassBtn = target.closest('[data-action="toggle-profile-password"]');
        if (togglePassBtn) {
            e.preventDefault();
            toggleProfilePasswordFields();
            return;
        }

        // Test detallarini ko'rish
        const toggleDetailsBtn = target.closest('[data-action="toggle-details"]');
        if (toggleDetailsBtn) {
            e.preventDefault();
            const targetId = toggleDetailsBtn.dataset.target;
            const detailsEl = document.getElementById(targetId);
            if (detailsEl) {
                detailsEl.style.display = detailsEl.style.display === 'none' ? 'block' : 'none';
            }
            return;
        }

        // Modal ichidagi Chiqish
        const logoutBtn = target.closest('[data-action="profile-logout"]');
        if (logoutBtn) {
            e.preventDefault();
            const modal = document.getElementById('myresults-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
            Auth.logout();
            notifyToast('🚪 Tizimdan muvaffaqiyatli chiqdingiz', 'info');
            return;
        }

        // Zen Editor ga o'tish
        const zenBtn = target.closest('[data-action="profile-zen-write"]');
        if (zenBtn) {
            e.preventDefault();
            const modal = document.getElementById('myresults-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
            const addPostBtn = document.getElementById('add-post-btn');
            if (addPostBtn) {
                addPostBtn.click();
            } else if (typeof window.openZenEditor === 'function') {
                window.openZenEditor();
            }
            return;
        }

        // Modalni yopish
        if (target.id === 'close-myresults-modal' || target.closest('#close-myresults-modal')) {
            const modal = document.getElementById('myresults-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
            return;
        }
        if (target.id === 'myresults-modal') {
            target.classList.remove('active');
            document.body.style.overflow = '';
            return;
        }
    });

    document.addEventListener('submit', (e) => {
        if (e.target && e.target.id === 'edit-profile-form') {
            e.preventDefault();
            saveProfileChanges(e);
        }
    });

    window.openMyResults = openMyResults;
    window.toggleEditProfileForm = toggleEditProfileForm;
    window.toggleProfilePasswordFields = toggleProfilePasswordFields;
    window.saveProfileChanges = saveProfileChanges;

    window.Auth = Auth;
})();
