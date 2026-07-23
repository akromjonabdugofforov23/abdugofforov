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

        _headers(extra) {
            const h = Object.assign({ 'Content-Type': 'application/json' }, extra || {});
            if (this.token) h['x-user-token'] = this.token;
            return h;
        },

        async register(name, username, password) {
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, password }),
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

        async loginWithTelegram(tgUser) {
            if (!tgUser) return { ok: false, message: "Foydalanuvchi ma'lumoti bo'sh" };

            // 1. Server API (/auth/telegram) ga so'rov yuborish
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
                }
            } catch (e) {
                console.warn('Server Telegram Auth so\'rovida xatolik (offlayn fallback ishlatiladi):', e);
            }

            // 2. Local fallback rejim (server javob bermasa)
            const id = tgUser.id || Math.floor(Math.random() * 89999999) + 10000000;
            const cleanName = (tgUser.first_name || tgUser.name || 'Telegram Foydalanuvchi').trim();
            const username = tgUser.username || ('tg_' + id);
            const token = 'tg_token_' + id + '_' + Date.now();

            this.token = token;
            this.user = {
                id: id,
                name: cleanName + (tgUser.last_name ? (' ' + tgUser.last_name) : ''),
                username: username,
                photo: tgUser.photo_url || tgUser.photo || '',
                provider: 'telegram'
            };

            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
            this.updateUIState();
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
            this.updateUIState();
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
            // Token yaroqsiz — tozalaymiz
            this.token = null;
            this.user = null;
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('abdu_user_data');
            this.updateUIState();
            return null;
        },

        // UI holatini yangilash
        updateUIState() {
            try {
                const userMenu = document.getElementById('user-menu');
                const loginBtnEl = document.getElementById('login-btn');
                if (this.isLoggedIn()) {
                    if (userMenu) userMenu.style.display = '';
                    if (loginBtnEl) loginBtnEl.style.display = 'none';
                    const nameLabel = document.getElementById('user-name-label');
                    const avatarEl = document.getElementById('user-avatar');
                    const ddName = document.getElementById('user-dd-name');
                    const ddUsername = document.getElementById('user-dd-username');
                    const nameStr = this.user.name || this.user.username || 'Foydalanuvchi';
                    if (nameLabel) nameLabel.textContent = nameStr;
                    if (avatarEl) avatarEl.textContent = nameStr.charAt(0).toUpperCase();
                    if (ddName) ddName.textContent = nameStr;
                    if (ddUsername) ddUsername.textContent = '@' + (this.user.username || '');
                } else {
                    if (userMenu) userMenu.style.display = 'none';
                    if (loginBtnEl) loginBtnEl.style.display = '';
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

    // Global Telegram Callback
    window.onTelegramAuth = async function(user) {
        if (window.Auth && user) {
            const res = await Auth.loginWithTelegram(user);
            if (res.ok) {
                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.classList.remove('active');
                document.body.style.overflow = '';
                if (typeof showToast === 'function') {
                    showToast("✈️ Telegram orqali muvaffaqiyatli kirdingiz!", "success");
                }
            }
        }
    };

    // Telegram WebApp ichida bo'lsa avto-detect
    function detectTelegramWebApp() {
        try {
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
                return window.Telegram.WebApp.initDataUnsafe.user;
            }
        } catch (e) {}
        return null;
    }

    // 1-Click Telegram tugmasi bosilganda
    window.handleTelegramAuthFallback = async function() {
        // 1. Agar Telegram WebApp (Mini App) ichida bo'lsak — avtomatik 1-click kirish!
        const webAppUser = detectTelegramWebApp();
        if (webAppUser) {
            const res = await Auth.loginWithTelegram(webAppUser);
            if (res.ok) {
                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.classList.remove('active');
                document.body.style.overflow = '';
                if (typeof showToast === 'function') {
                    showToast("✈️ Telegram: " + (res.user.name || res.user.username) + " sifatida kirdingiz!", "success");
                }
                return;
            }
        }

        // 2. Agar modal ichida telegram quick-form bo'lsa, uni ko'rsatamiz
        const tgInlineForm = document.getElementById('tg-inline-form');
        const tgCustomBtn = document.getElementById('tg-custom-btn');
        if (tgInlineForm) {
            tgInlineForm.style.display = 'block';
            if (tgCustomBtn) tgCustomBtn.style.display = 'none';
            const tgInput = document.getElementById('tg-username-input');
            if (tgInput) tgInput.focus();
            return;
        }

        // 3. Muqobil dialog (agar inline form bo'lmasa)
        const input = prompt("Telegram ismingizni yoki username'ingizni kiriting (Masalan: Akromjon yoki @username):");
        if (!input || !input.trim()) return;

        const cleanName = input.replace('@', '').trim();
        const generatedId = Math.floor(Math.random() * 89999999) + 10000000;

        const tgUser = {
            id: generatedId,
            first_name: cleanName,
            username: cleanName.toLowerCase().replace(/\s+/g, '_'),
            provider: 'telegram'
        };

        if (window.Auth) {
            const res = await Auth.loginWithTelegram(tgUser);
            if (res.ok) {
                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.classList.remove('active');
                document.body.style.overflow = '';
                if (typeof showToast === 'function') {
                    showToast("✈️ Telegram: " + cleanName + " nomidan muvaffaqiyatli kirdingiz!", "success");
                }
            }
        }
    };

    // Quick form'dan kirish funksiyasi
    window.submitTelegramQuickAuth = async function(e) {
        if (e) e.preventDefault();
        const tgInput = document.getElementById('tg-username-input');
        const val = tgInput ? tgInput.value.trim() : '';
        if (!val) {
            if (typeof showToast === 'function') showToast("Telegram username yoki ismingizni kiriting", "error");
            return;
        }
        const cleanName = val.replace('@', '').trim();
        const generatedId = Math.floor(Math.random() * 89999999) + 10000000;
        const tgUser = {
            id: generatedId,
            first_name: cleanName,
            username: cleanName.toLowerCase().replace(/\s+/g, '_'),
            provider: 'telegram'
        };
        const res = await Auth.loginWithTelegram(tgUser);
        if (res.ok) {
            const authModal = document.getElementById('auth-modal');
            if (authModal) authModal.classList.remove('active');
            document.body.style.overflow = '';
            if (typeof showToast === 'function') {
                showToast("✈️ Telegram: " + cleanName + " nomidan muvaffaqiyatli kirdingiz!", "success");
            }
        }
    };

    window.Auth = Auth;
})();
