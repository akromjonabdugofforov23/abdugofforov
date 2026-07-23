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

        async updateProfile(name, photo) {
            if (!this.user) return { ok: false, message: "Tizimga kirilmagan" };
            if (name && typeof name === 'string') this.user.name = name.trim();
            if (photo !== undefined) this.user.photo = photo;
            
            localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
            this.updateUIState();

            try {
                const res = await fetch('/auth/profile', {
                    method: 'POST',
                    headers: this._headers(),
                    body: JSON.stringify({ name: this.user.name, photo: this.user.photo }),
                });
                const data = await res.json().catch(() => ({}));
                if (data.ok && data.user) {
                    this.user = Object.assign(this.user, data.user);
                    localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
                    this.updateUIState();
                }
            } catch (e) {}

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
                    if (avatarEl) {
                        if (this.user.photo && (this.user.photo.startsWith('http') || this.user.photo.startsWith('data:'))) {
                            avatarEl.innerHTML = `<img src="${this.user.photo}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                        } else if (this.user.photo) {
                            avatarEl.textContent = this.user.photo; // Emoji avatar
                        } else {
                            avatarEl.textContent = nameStr.charAt(0).toUpperCase();
                        }
                    }
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

    window.Auth = Auth;
})();
