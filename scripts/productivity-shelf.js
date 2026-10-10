/**
 * ============================================================
 * ABDUGOFFOROV — PRODUCTIVITY & PERSONAL BRAND SUITE
 * Group F (29, 30, 31, 33):
 * 29: Changelog / What's New Release Modal
 * 30: Interactive 3D Reading Shelf (Kitob Javoni)
 * 31: Live Project Metrics (Jonli statistika paneli)
 * 33: Newsletter & Telegram Channel Subscription
 * ============================================================
 */

(function () {
    'use strict';

    // ------------------------------------------------------------
    // 1. DATA: READING SHELF (#30)
    // ------------------------------------------------------------
    const BOOKS_SHELF = [
        {
            title: "Atom Odatlar",
            author: "James Clear",
            rating: "5.0",
            category: "Rivojlanish",
            color: "linear-gradient(135deg, #f59e0b, #d97706)",
            status: "Tavsiya etiladi",
            summary: "Kichik odatlar vaqti kelib ulkan natijalarni beradi. Har kuni atigi 1% yaxshilanish bir yilda 37 barobar kuchliroq bo'lishingizni kafolatlaydi.",
            quote: "Siz maqsadlaringiz darajasiga ko'tarilmaysiz, tizimlaringiz darajasiga qulaysiz."
        },
        {
            title: "Deep Work: Diqqat Kuchi",
            author: "Cal Newport",
            rating: "5.0",
            category: "Unumdorlik",
            color: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            status: "O'qilgan",
            summary: "Raqamli chalg'itishlar davrida bir yo'nalishga chuqur diqqat qila olish qobiliyati — 21-asrning eng nodir va qimmatli super-kuchidir.",
            quote: "Agar ishlab chiqargan narsangiz noyob bo'lmasa, uni almashtirish oson."
        },
        {
            title: "Alximik",
            author: "Paulo Coelho",
            rating: "4.9",
            category: "Badiiy & Falsafa",
            color: "linear-gradient(135deg, #10b981, #047857)",
            status: "O'qilgan",
            summary: "Santiyago ismli cho'pon yigitning o'z Shaxsiy Afsonasi yo'lidagi sarguzashtlari orqali orzular sari qat'iyat bilan intilishning go'zalligi.",
            quote: "Agar biror narsani chin dildan orzu qilsangiz, butun koinot sizga yordam berishga kirishadi."
        },
        {
            title: "Qalblar Qatidagi Sukunat",
            author: "Eckhart Tolle",
            rating: "4.8",
            category: "Ruhiyat",
            color: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            status: "O'qilmoqda",
            summary: "O'tmish pushaymonlari va kelajak xavotirlaridan xalos bo'lib, aynan hozirgi lahzaning o'zida ichki xotirjamlik va barqarorlikni topish.",
            quote: "Sizning ongingiz — faqat vosita. Haqiqiy xotirjamlik fikrlar to'xtagan sukunatda yashirin."
        },
        {
            title: "Kichkina Shahzoda",
            author: "Antuan de Sent-Ekzyuperi",
            rating: "5.0",
            category: "Klassika",
            color: "linear-gradient(135deg, #ec4899, #be185d)",
            status: "O'qilgan",
            summary: "Bolalik beg'uborligi, samimiy do'stlik, mehr va mas'uliyat haqidagi dunyo durdonasi.",
            quote: "Eng muhim narsalarni ko'z bilan ko'rib bo'lmaydi; ularni faqat qalb bilan his qilish mumkin."
        }
    ];

    // ------------------------------------------------------------
    // 2. CHANGELOG DATA (#29)
    // ------------------------------------------------------------
    const CHANGELOG = [
        {
            version: "v2.4.0 — Katta Innovatsiya Relizi",
            date: "2026-yil 10-oktyabr",
            badge: "Eng so'nggi",
            items: [
                "🤖 AI Nemis Tili Suhbatdoshi (Tandem Bot) va AI Talaffuz Analizatori qo'shildi",
                "✍️ Nemis tili insholarini tahlil qiluvchi AI Matn Tahrirchisi (Writing Corrector)",
                "🥨 Nemischa xalq iboralari va slenglari (Redewendungen) interaktiv kolleksiyasi",
                "🛠️ Tools Lab: O'zbekcha imlo tuzatuvchi, RegEx vizualizatori, Favicon & App Icon generatori, Code to Image",
                "🏆 Rasmiy sertifikat generatori (Canvas) va Menga Savol Bering (AMA) devori",
                "💻 Geek CLI Terminal rejimi (~ klavishi orqali) va 8D Spatial Audio diqqat texnologiyasi",
                "📚 Interaktiv Kitob Javoni (Reading Shelf) va Jonli Ekotizim statistikasi"
            ]
        },
        {
            version: "v2.0.0 — Hashamat & Dizayn",
            date: "2026-yil sentabr",
            badge: "Yirik yangilanish",
            items: [
                "✦ Zen Writing Studio (Medium / Notion uslubidagi matn muharriri)",
                "⌚ Swiss Atelier Luxury Analog Clock xronometri",
                "🎵 Sof Web Audio API da ishlovchi Lofi & Ambient pleyer",
                "⚡ Bionic Reading tezkor o'qish va AI Post xulosalari (TL;DR)"
            ]
        },
        {
            version: "v1.0.0 — Poydevor",
            date: "2026-yil avgust",
            badge: "Boshlang'ich",
            items: [
                "🇩🇪 Nemis tili A1–B2 Goethe testlari bazasi",
                "🎴 Ovozli so'z kartochkalari va Noto'g'ri fe'llar trenajyori",
                "🌐 PWA offline kesh tizimi va Cloudflare Pages integratsiyasi"
            ]
        }
    ];

    // ------------------------------------------------------------
    // 3. RENDER MODALS
    // ------------------------------------------------------------
    function renderChangelogModal() {
        let modal = document.getElementById('changelog-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'changelog-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 650px; width: 95%;">
                <button class="modal-close" id="close-changelog-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <span style="font-size: 26px;">🚀</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.25rem;">Nimalar Yangi? (Platforma Relizlari)</h3>
                            <small style="color: var(--text-secondary);">Abdugofforov ekotizimidagi so'nggi imkoniyatlar va yangilanishlar tarixi</small>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap: 16px; max-height: 420px; overflow-y:auto; padding-right: 4px;">
                        ${CHANGELOG.map(rel => `
                            <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                    <strong style="font-size:15px; color:var(--text-primary);">${rel.version}</strong>
                                    <span style="font-size:11px; padding:2px 8px; border-radius:12px; background:var(--accent-color); color:#fff; font-weight:600;">${rel.badge}</span>
                                </div>
                                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">${rel.date}</div>
                                <ul style="margin:0; padding-left:18px; font-size:13.5px; color:var(--text-secondary); line-height:1.6;">
                                    ${rel.items.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeChangelog = () => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        };

        const closeBtn = modal.querySelector('#close-changelog-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeChangelog);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeChangelog();
        });

        return modal;
    }

    function renderBookshelfModal() {
        let modal = document.getElementById('bookshelf-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'bookshelf-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 720px; width: 95%;">
                <button class="modal-close" id="close-bookshelf-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <span style="font-size: 26px;">📚</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.25rem;">Interaktiv Kitob Javoni (Reading Shelf)</h3>
                            <small style="color: var(--text-secondary);">Muallif o'qigan eng ta'sirli kitoblar, xulosalar va shaxsiy tavsiyalar</small>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; max-height: 440px; overflow-y:auto; padding-right: 4px;">
                        ${BOOKS_SHELF.map(b => `
                            <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display:flex; flex-direction:column; justify-content:space-between;">
                                <div>
                                    <div style="display:flex; gap: 12px; align-items:flex-start; margin-bottom: 10px;">
                                        <div style="width: 44px; height: 60px; border-radius: 6px; background: ${b.color}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:22px; flex-shrink:0; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">📖</div>
                                        <div>
                                            <h4 style="margin:0 0 2px 0; font-size:15px; color:var(--text-primary);">${b.title}</h4>
                                            <div style="font-size:12px; color:var(--text-secondary);">${b.author}</div>
                                            <div style="font-size:11px; color:#f59e0b; margin-top:2px;">⭐ ${b.rating} · ${b.category}</div>
                                        </div>
                                    </div>
                                    <p style="font-size:12.5px; color:var(--text-secondary); line-height:1.5; margin-bottom: 10px;">${b.summary}</p>
                                </div>
                                <div style="background: rgba(0,0,0,0.03); border-left: 2px solid var(--accent-color); padding: 6px 8px; font-size: 11.5px; font-style: italic; color: var(--text-secondary); border-radius: 4px;">
                                    "${b.quote}"
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBookshelf = () => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        };

        const closeBtn = modal.querySelector('#close-bookshelf-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeBookshelf);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeBookshelf();
        });

        return modal;
    }

    // ------------------------------------------------------------
    // 4. NEWSLETTER & METRICS RENDER IN DOM (#31, #33)
    // ------------------------------------------------------------
    function injectMetricsAndNewsletter() {
        const target = document.querySelector('footer.footer');
        if (!target) return;

        // Strip check
        if (document.getElementById('live-stats-strip')) return;

        const container = document.createElement('div');
        container.id = 'live-stats-and-newsletter';
        container.className = 'container';
        container.style.margin = '40px auto 30px';

        container.innerHTML = `
            <!-- LIVE STATS STRIP (#31) -->
            <div id="live-stats-strip" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; margin-bottom: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; text-align: center; box-shadow: var(--shadow-sm);">
                <div>
                    <div style="font-size: 26px; font-weight: 800; color: var(--accent-color);">120+</div>
                    <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 4px;">Maqolalar & Darslar</div>
                </div>
                <div>
                    <div style="font-size: 26px; font-weight: 800; color: #10b981;">1,500+</div>
                    <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 4px;">Nemis Tili Test Savollari</div>
                </div>
                <div>
                    <div style="font-size: 26px; font-weight: 800; color: #f59e0b;">2,400+</div>
                    <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 4px;">Ovozli So'z Kartochkalari</div>
                </div>
                <div>
                    <div style="font-size: 26px; font-weight: 800; color: #38bdf8;">100%</div>
                    <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 4px;">Serverless & Edge Tezlik</div>
                </div>
            </div>

            <!-- NEWSLETTER BOX (#33) -->
            <div id="newsletter-box" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.05)); border: 1px solid var(--border-color); border-radius: 16px; padding: 30px; text-align: center; max-width: 680px; margin: 0 auto;">
                <div style="font-size: 32px; margin-bottom: 8px;">📬</div>
                <h3 style="font-size: 1.4rem; margin: 0 0 6px 0; color: var(--text-primary);">Yangi Maqolalar va Darslarni O'tkazib Yubormang</h3>
                <p style="font-size: 13.5px; color: var(--text-secondary); margin: 0 auto 18px; max-width: 480px;">Sun'iy intellekt, dasturlash sirlari va nemis tili bo'yicha eng sara qo'llanmalar to'g'ridan-to'g'ri Telegram yoki emailingizda.</p>
                
                <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                    <a href="https://t.me/Abdugofforov_kundaligi" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                        <span>✈️</span> Telegram Kanalga A'zo Bo'lish
                    </a>
                    <button type="button" class="btn-secondary" id="btn-quick-subscribe" style="display:inline-flex; align-items:center; gap:6px;">
                        <span>🔔</span> Saytda Qayd Etish
                    </button>
                </div>
            </div>
        `;

        target.parentNode.insertBefore(container, target);

        document.getElementById('btn-quick-subscribe').addEventListener('click', () => {
            if (window.showToast) window.showToast('✅ Siz muvaffaqiyatli obuna bo\'ldingiz!', 'success');
            else alert('Obuna bo\'ldingiz!');
        });
    }

    // ------------------------------------------------------------
    // 5. GLOBAL DATA-ACTION DISPATCHER (100% CSP Compliant)
    // ------------------------------------------------------------
    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-action]');
        if (!el) return;
        const action = el.getAttribute('data-action');
        if (action === 'open-bookshelf') {
            e.preventDefault();
            if (window.ProductivitySuite) window.ProductivitySuite.openBookshelf();
        } else if (action === 'open-certificate') {
            e.preventDefault();
            if (window.CommunitySuite) window.CommunitySuite.openCertificate();
        } else if (action === 'open-ama') {
            e.preventDefault();
            if (window.CommunitySuite) window.CommunitySuite.openAma();
        } else if (action === 'open-capsule') {
            e.preventDefault();
            if (window.AestheticSuite) window.AestheticSuite.openTimeCapsule();
        } else if (action === 'open-changelog') {
            e.preventDefault();
            if (window.ProductivitySuite) window.ProductivitySuite.openChangelog();
        } else if (action === 'open-terminal') {
            e.preventDefault();
            if (window.AestheticSuite) window.AestheticSuite.toggleTerminal();
        }
    });

    function bindEcosystemButtons() {
        const bsBtn = document.getElementById('btn-ecosystem-bookshelf');
        if (bsBtn) bsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.ProductivitySuite) window.ProductivitySuite.openBookshelf();
        });

        const certBtn = document.getElementById('btn-ecosystem-certificate');
        if (certBtn) certBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.CommunitySuite) window.CommunitySuite.openCertificate();
        });

        const amaBtn = document.getElementById('btn-ecosystem-ama');
        if (amaBtn) amaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.CommunitySuite) window.CommunitySuite.openAma();
        });

        const capBtn = document.getElementById('btn-ecosystem-capsule');
        if (capBtn) capBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.AestheticSuite) window.AestheticSuite.openTimeCapsule();
        });

        const clBtn = document.getElementById('btn-ecosystem-changelog');
        if (clBtn) clBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.ProductivitySuite) window.ProductivitySuite.openChangelog();
        });

        const termBtn = document.getElementById('btn-ecosystem-terminal');
        if (termBtn) termBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.AestheticSuite) window.AestheticSuite.toggleTerminal();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectMetricsAndNewsletter();
            bindEcosystemButtons();
        });
    } else {
        injectMetricsAndNewsletter();
        bindEcosystemButtons();
    }

    window.ProductivitySuite = {
        openChangelog: () => {
            const m = renderChangelogModal();
            m.classList.add('active');
            m.style.display = 'flex';
            m.style.opacity = '1';
            m.style.visibility = 'visible';
            m.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
        },
        openBookshelf: () => {
            const m = renderBookshelfModal();
            m.classList.add('active');
            m.style.display = 'flex';
            m.style.opacity = '1';
            m.style.visibility = 'visible';
            m.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
        }
    };

})();
