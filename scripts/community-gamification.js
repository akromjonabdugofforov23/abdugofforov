/**
 * ============================================================
 * ABDUGOFFOROV — COMMUNITY, GAMIFICATION & TELEGRAM SUITE
 * Group D (#19): Telegram WebApp 100% Sync & Haptic Engine
 * Group D (#22): Badges & Official Canvas Certificate Generator
 * Group D (#23): Ask Me Anything (AMA) Interactive Wall
 * ============================================================
 */

(function () {
    'use strict';

    // ------------------------------------------------------------
    // 1. TELEGRAM WEBAPP 100% INTEGRATION (#19)
    // ------------------------------------------------------------
    const TG = window.Telegram && window.Telegram.WebApp;

    function initTelegramMiniApp() {
        if (!TG) return;

        try {
            TG.ready();
            TG.expand();

            // Set Header and Background to match site palette
            if (TG.setHeaderColor) TG.setHeaderColor('#0f172a');
            if (TG.setBackgroundColor) TG.setBackgroundColor('#0b0f19');

            // Auto-login or sync user if available
            if (TG.initDataUnsafe && TG.initDataUnsafe.user) {
                const tgUser = TG.initDataUnsafe.user;
                const name = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') || tgUser.username || 'Mehmon';
                
                // Update avatar or name if logged in
                const nameLabel = document.getElementById('user-name-label');
                if (nameLabel) nameLabel.textContent = name;
            }
        } catch (e) {
            console.warn('Telegram WebApp init warning:', e);
        }
    }

    function triggerHaptic(type = 'light') {
        if (TG && TG.HapticFeedback) {
            try {
                if (type === 'success' || type === 'error' || type === 'warning') {
                    TG.HapticFeedback.notificationOccurred(type);
                } else {
                    TG.HapticFeedback.impactOccurred(type);
                }
            } catch (e) {}
        }
    }

    // ------------------------------------------------------------
    // 2. BADGES & OFFICIAL CERTIFICATE GENERATOR (#22)
    // ------------------------------------------------------------
    const BADGES = [
        { id: 'first_step', icon: '🎯', name: 'Ilk Qadam', desc: 'Birinchi maqolani o\'qigan yoki test yechgan' },
        { id: 'deutsch_fan', icon: '🇩🇪', name: 'Goethe Bilimdoni', desc: 'Nemis tili testlarida faol qatnashuvchi' },
        { id: 'polyglot', icon: '🎙️', name: 'Ovozli Poliglot', desc: 'Talaffuz murabbiyida mashq bajargan' },
        { id: 'speed_reader', icon: '⚡', name: 'Bionik O\'quvchi', desc: 'Bionic Reading rejimidan foydalangan' },
        { id: 'zen_master', icon: '🧘', name: 'Zen Fokus', desc: 'Lofi va Ambient audio bilan diqqatni jamlagan' },
        { id: 'ecosystem_pro', icon: '👑', name: 'Ekotizim Ustasi', desc: 'Barcha laboratoriya asboblarini sinab ko\'rgan' }
    ];

    function generateCertificate(userName, courseName = "Nemis Tili & Zamonaviy Web Texnologiyalari") {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 840;
        const ctx = canvas.getContext('2d');

        // Luxury Background
        const grad = ctx.createLinearGradient(0, 0, 1200, 840);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#090d16');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 840);

        // Elegant Gold Borders
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 6;
        ctx.strokeRect(30, 30, 1140, 780);

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(44, 44, 1112, 752);

        // Header
        ctx.textAlign = 'center';
        ctx.fillStyle = '#d4af37';
        ctx.font = '600 24px "Cinzel", "Playfair Display", serif';
        ctx.fillText('ABDUGOFFOROV AKADEMIYASI', 600, 120);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 54px "Playfair Display", Georgia, serif';
        ctx.fillText('YUTUQ SERTIFIKATI', 600, 190);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '18px "Inter", sans-serif';
        ctx.fillText('USHBU RASMIY HUJJAT TASDIQLAYDIKI,', 600, 260);

        // Name
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 46px "Playfair Display", Georgia, serif';
        ctx.fillText(userName || 'Hurmatli O\'rganuvchi', 600, 340);

        // Divider
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(400, 370);
        ctx.lineTo(800, 370);
        ctx.stroke();

        // Course & Description
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '20px "Inter", sans-serif';
        ctx.fillText(`"${courseName}"`, 600, 420);

        ctx.font = '16px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fillText('yo\'nalishida interaktiv mashg\'ulotlar, testlar va ko\'nikmalarni', 600, 460);
        ctx.fillText('muvaffaqiyatli o\'zlashtirib, yuqori natijaga erishdi.', 600, 490);

        // Gold Seal Emulation
        ctx.beginPath();
        ctx.arc(600, 600, 54, 0, Math.PI * 2);
        ctx.fillStyle = '#d4af37';
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 15px "Inter", sans-serif';
        ctx.fillText('RASMIY', 600, 595);
        ctx.fillText('MUHR', 600, 615);

        // Signatures & Metadata
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '14px "Inter", sans-serif';
        ctx.fillText(`Sana: ${new Date().toLocaleDateString('uz-UZ')}`, 100, 720);
        ctx.fillText(`Sertifikat ID: AGY-${Math.floor(100000 + Math.random() * 900000)}`, 100, 745);

        ctx.textAlign = 'right';
        ctx.fillText('Ta\'sischi: Akromjon Abdug\'offorov', 1100, 720);
        ctx.fillText('abdugofforov.uz', 1100, 745);

        return canvas.toDataURL('image/png');
    }

    function renderCertificateModal() {
        let modal = document.getElementById('certificate-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'certificate-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 640px; width: 95%;">
                <button class="modal-close" id="close-cert-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <span style="font-size: 26px;">🏆</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.25rem;">Akademiya Rasmiy Sertifikati</h3>
                            <small style="color: var(--text-secondary);">Ismingiz tushirilgan yuqori sifatli rasmiy yutuq hujjati</small>
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="font-size: 13px; color: var(--text-secondary); display:block; margin-bottom: 6px;">Ism va Familiyangizni kiriting:</label>
                        <input type="text" id="cert-name-input" class="form-input" placeholder="Masalan: Akromjon Abdug'offorov" style="width: 100%;">
                    </div>

                    <div style="margin-bottom: 18px;">
                        <label style="font-size: 13px; color: var(--text-secondary); display:block; margin-bottom: 6px;">Yo'nalish:</label>
                        <select id="cert-course-select" class="form-input" style="width: 100%;">
                            <option value="Nemis Tili A1-B2 & Goethe Akademiyasi">🇩🇪 Nemis Tili A1-B2 & Goethe Akademiyasi</option>
                            <option value="Zamonaviy Web Dasturlash & AI Texnologiyalari">💻 Zamonaviy Web Dasturlash & AI Texnologiyalari</option>
                            <option value="Abdugofforov Ekotizimi Faol Ishtirokchisi">🌟 Abdugofforov Ekotizimi Faol Ishtirokchisi</option>
                        </select>
                    </div>

                    <div id="cert-preview-wrap" style="text-align: center; margin-bottom: 18px; display: none;">
                        <img id="cert-preview-img" style="width: 100%; max-height: 280px; object-fit: contain; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: var(--shadow-md);" alt="Sertifikat">
                    </div>

                    <div style="display:flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" class="btn-primary" id="cert-generate-btn">🎨 Sertifikatni yaratish</button>
                        <a id="cert-download-btn" class="btn-primary" style="display:none; text-decoration: none;" download="Sertifikat-Abdugofforov.png">📥 Yuklab olish</a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeCert = () => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        };

        const closeBtn = modal.querySelector('#close-cert-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeCert);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCert();
        });

        modal.querySelector('#cert-generate-btn').addEventListener('click', () => {
            const name = modal.querySelector('#cert-name-input').value.trim() || 'Hurmatli O\'rganuvchi';
            const course = modal.querySelector('#cert-course-select').value;
            const dataUrl = generateCertificate(name, course);

            const img = modal.querySelector('#cert-preview-img');
            img.src = dataUrl;
            modal.querySelector('#cert-preview-wrap').style.display = 'block';

            const dlBtn = modal.querySelector('#cert-download-btn');
            dlBtn.href = dataUrl;
            dlBtn.style.display = 'inline-flex';
            triggerHaptic('success');
        });

        return modal;
    }

    // ------------------------------------------------------------
    // 3. ASK ME ANYTHING (AMA) DEVORI (#23) — FAQAT HAQIQIY FOYDALANUVCHILAR UCHUN
    // ------------------------------------------------------------
    const AMA_STORAGE_KEY = 'abdu_ama_questions';
    const DEFAULT_AMA = [];

    function escapeText(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c] || c));
    }

    function getAmaQuestions() {
        try {
            const raw = localStorage.getItem(AMA_STORAGE_KEY);
            if (!raw) return [];
            const list = JSON.parse(raw);
            if (!Array.isArray(list)) return [];
            // Soxta demo savollarni butkul tozalash (Azizbek, Malika, Jasur)
            const cleanList = list.filter(item => item && item.id !== 1 && item.id !== 2 && item.id !== 3 && item.author !== "Azizbek" && item.author !== "Malika" && item.author !== "Jasur");
            if (cleanList.length !== list.length) {
                saveAmaQuestions(cleanList);
            }
            return cleanList;
        } catch (e) {
            return [];
        }
    }

    function saveAmaQuestions(list) {
        try {
            localStorage.setItem(AMA_STORAGE_KEY, JSON.stringify(list));
        } catch (e) {}
    }

    function renderAmaModal() {
        let modal = document.getElementById('ama-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'ama-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 680px; width: 95%;">
                <button class="modal-close" id="close-ama-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <span style="font-size: 26px;">💬</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.25rem;">Menga Savol Bering (Ask Me Anything)</h3>
                            <small style="color: var(--text-secondary);">Dasturlash, nemis tili, sayt va hayot haqida erkin savol qoldiring</small>
                        </div>
                    </div>

                    <!-- New Question Form -->
                    <form id="ama-form" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                        <div style="display:flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" id="ama-name-input" class="form-input" placeholder="Ismingiz (ixtiyoriy, bo'sh qolsa: Anonim)" style="flex: 1;">
                        </div>
                        <textarea id="ama-text-input" class="form-input" rows="2" placeholder="Savolingizni bu yerga yozing..." required style="width: 100%; margin-bottom: 10px; font-family: inherit; font-size: 14px;"></textarea>
                        <div style="text-align: right;">
                            <button type="submit" class="btn-primary" style="padding: 8px 18px;">Yuborish</button>
                        </div>
                    </form>

                    <!-- Questions List -->
                    <div id="ama-list" style="display:flex; flex-direction:column; gap:12px; max-height: 380px; overflow-y:auto; padding-right: 4px;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeAma = () => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        };

        const closeBtn = modal.querySelector('#close-ama-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeAma);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAma();
        });

        modal.querySelector('#ama-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = modal.querySelector('#ama-name-input').value.trim() || 'Anonim';
            const text = modal.querySelector('#ama-text-input').value.trim();
            if (!text) return;

            const list = getAmaQuestions();
            const newQ = {
                id: Date.now(),
                author: name,
                question: text,
                answer: "Savolingiz qabul qilindi! Tez orada Akromjon javob qaytaradi.",
                likes: 1,
                date: new Date().toISOString().split('T')[0]
            };
            list.unshift(newQ);
            saveAmaQuestions(list);

            modal.querySelector('#ama-text-input').value = '';
            renderAmaList();
            if (window.showToast) window.showToast('✅ Savolingiz muvaffaqiyatli qoldirildi!', 'success');
            triggerHaptic('success');
        });

        return modal;
    }

    function renderAmaList() {
        const modal = document.getElementById('ama-modal');
        if (!modal) return;
        const container = modal.querySelector('#ama-list');
        const list = getAmaQuestions();

        if (list.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 36px 16px; background: var(--card-bg); border: 1px dashed var(--border-color); border-radius: 12px; color: var(--text-secondary); font-size: 13.5px;">
                    <span style="font-size: 28px; display: block; margin-bottom: 8px;">✍️</span>
                    Hozircha savollar qoldirilmagan.<br>Birinchi bo'lib o'z savolingizni yuboring!
                </div>
            `;
            return;
        }

        container.innerHTML = list.map(item => `
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <strong style="color: var(--accent-color); font-size: 14px;">👤 ${escapeText(item.author || 'Mehmon')}</strong>
                    <small style="color: var(--text-secondary); font-size: 11px;">${escapeText(item.date || '')}</small>
                </div>
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 500; color: var(--text-primary); line-height: 1.45;">${escapeText(item.question)}</p>
                ${item.answer ? `
                <div style="background: rgba(99, 102, 241, 0.05); border-left: 3px solid var(--accent-color); padding: 8px 12px; border-radius: 6px; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
                    <strong style="color: var(--text-primary);">Javob:</strong> ${escapeText(item.answer)}
                </div>` : ''}
            </div>
        `).join('');
    }

    // ------------------------------------------------------------
    // 4. INIT & EXPOSURE
    // ------------------------------------------------------------
    initTelegramMiniApp();

    window.CommunitySuite = {
        openCertificate: () => {
            const m = renderCertificateModal();
            m.classList.add('active');
            m.style.display = 'flex';
            m.style.opacity = '1';
            m.style.visibility = 'visible';
            m.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
        },
        openAma: () => {
            const m = renderAmaModal();
            renderAmaList();
            m.classList.add('active');
            m.style.display = 'flex';
            m.style.opacity = '1';
            m.style.visibility = 'visible';
            m.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
        },
        triggerHaptic
    };

})();
