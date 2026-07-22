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
            }
            return data;
        },

        async loginWithTelegram(tgUser) {
            if (!tgUser) return { ok: false };
            const token = 'tg_token_' + tgUser.id + '_' + Date.now();
            this.token = token;
            this.user = {
                id: tgUser.id,
                name: tgUser.first_name + (tgUser.last_name ? (' ' + tgUser.last_name) : ''),
                username: tgUser.username || ('tg_' + tgUser.id),
                photo: tgUser.photo_url || '',
                provider: 'telegram'
            };
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem('abdu_user_data', JSON.stringify(this.user));
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
        },

        // Token amal qilsa, foydalanuvchini tiklaydi
        async restore() {
            if (!this.token) return null;
            const savedData = localStorage.getItem('abdu_user_data');
            if (savedData) {
                try {
                    this.user = JSON.parse(savedData);
                    return this.user;
                } catch(e) {}
            }
            try {
                const res = await fetch('/auth/me', { headers: this._headers() });
                const data = await res.json().catch(() => ({}));
                if (data.ok && data.user) {
                    this.user = data.user;
                    return this.user;
                }
            } catch (e) {}
            // Token yaroqsiz — tozalaymiz
            this.token = null;
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('abdu_user_data');
            return null;
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

    window.onTelegramAuth = function(user) {
        if (window.Auth && user) {
            Auth.loginWithTelegram(user);
            if (typeof showToast === 'function') {
                showToast("✈️ Telegram orqali muvaffaqiyatli kirdingiz!", "success");
            }
            setTimeout(() => location.reload(), 500);
        }
    };

    window.Auth = Auth;
})();
