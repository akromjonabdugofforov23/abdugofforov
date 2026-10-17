/**
 * ABDUGOFFOROV WEB EKOTIZIMI — TOOLS DEV SUITE
 * scripts/tools-dev-suite.js
 * 
 * Ushbu modul 'tools.abdugofforov.uz' platformasi uchun 4 ta talabgir
 * dasturchi utilitasini 100% brauzer-klient (zero-dependency) arxitekturasida ta'minlaydi:
 * 
 * 1. O'zbekcha URL Slug & Case Generator (#panel-slug):
 *    - O'zbek tili harflarini to'liq normalizatsiya qilish (o', o‘, o’, g', g‘, g’, sh, ch, ng -> o, g, sh, ch, ng)
 *    - 6 ta format: Kebab-case (SEO slug), Snake_case, CamelCase, PascalCase, UPPER_CASE / CONSTANT, Title Case
 *    - Matn tahlili statistikasi: belgilar soni, so'zlar soni, taxminiy o'qish vaqti
 *    - Har bir format kartochkasida 1 bosishda nusxalash tugmasi
 * 
 * 2. Cyber Glassmorphism & Neon CSS Generator (#panel-glass):
 *    - Slayderlar: Fon shaffofligi (0-100%), Xiralik blur (0-40px), Hoshiya qalinligi & shaffofligi,
 *      Neon glow & blur (0-60px), Burchak radiusi (0-32px), Neon ranglar palitrasi (Cyan, Violet, Emerald, Amber, Rose, Custom)
 *    - Jonli ko'rinish oynasi (Live Preview Box) — barcha slayder harakatlarida real vaqtda yangilanadi
 *    - Toza va optimallashgan CSS kodini chiqarish va 1 bosishda nusxalash (#glass-copy-btn)
 * 
 * 3. Unix Timestamp & Sana Kalkulyatori (#panel-timestamp):
 *    - Jonli sekundomer: Joriy Unix timestamp (soniya va millisoniya) real vaqtda yangilanadi
 *    - Timestamp -> Inson tushunadigan sana: Toshkent vaqti (UTC+5), UTC, ISO 8601 va o'zbekcha nisbiy vaqt
 *    - Sana -> Timestamp: Tanlangan sana/vaqtdan soniya va ms timestamp hisoblash
 *    - Ikki sana orasidagi farq kalkulyatori: kun, soat, daqiqa, soniya aniq hisobi
 * 
 * 4. JWT (JSON Web Token) Dekoder (#panel-jwt):
 *    - 100% brauzerda, mutlaqo maxfiy (hech qayerga yuborilmaydi)
 *    - UTF-8 Base64Url dekoder (Unicode, o'zbekcha va kirill harflari buzilmaydi)
 *    - 3 qismli sintaktik ranglangan formatli JSON: Header (#f43f5e), Payload (#a855f7), Signature (#06b6d4)
 *    - Token amal qilish muddati ('exp', 'iat') ni avtomatik o'qib, yaroqlilik statusini aniqlash
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // 0. DINAMIK CSS USLUBI (CYBER GLASS & DEV SUITE STYLES)
    // -------------------------------------------------------------------------
    function injectSuiteStyles() {
        if (document.getElementById('tools-dev-suite-styles')) return;
        const style = document.createElement('style');
        style.id = 'tools-dev-suite-styles';
        style.textContent = `
            /* ===== DEV SUITE UMUMIY USLUBLAR ===== */
            .dev-stats-bar {
                display: flex;
                align-items: center;
                gap: 16px;
                flex-wrap: wrap;
                padding: 10px 16px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
                border-radius: 12px;
                margin-bottom: 16px;
                font-size: 0.86rem;
            }
            .dev-stat-item {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: var(--text-secondary, #94a3b8);
            }
            .dev-stat-value {
                font-weight: 700;
                color: var(--tools-accent, #6366f1);
                font-family: 'JetBrains Mono', monospace;
            }

            /* ===== 1. SLUG & CASE GENERATOR ===== */
            .slug-formats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 14px;
                margin-top: 16px;
            }
            .slug-format-card {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
                border-radius: 12px;
                padding: 12px 14px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                transition: border-color 0.2s ease, transform 0.2s ease;
            }
            [data-theme="light"] .slug-format-card {
                background: #f8fafc;
            }
            .slug-format-card:hover {
                border-color: var(--tools-accent, #6366f1);
                transform: translateY(-1px);
            }
            .slug-format-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .slug-format-title {
                font-size: 0.8rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary, #94a3b8);
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .slug-format-badge {
                font-size: 0.72rem;
                padding: 2px 6px;
                border-radius: 6px;
                background: rgba(99, 102, 241, 0.12);
                color: var(--tools-accent, #6366f1);
                font-weight: 600;
            }
            .slug-format-body {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .slug-format-input {
                flex: 1;
                background: rgba(0, 0, 0, 0.25);
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
                border-radius: 8px;
                padding: 8px 12px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.86rem;
                color: var(--text-primary, #f8fafc);
                outline: none;
                transition: border-color 0.2s;
            }
            [data-theme="light"] .slug-format-input {
                background: #ffffff;
                color: #0f172a;
            }
            .slug-format-input:focus {
                border-color: var(--tools-accent, #6366f1);
            }
            .slug-copy-btn {
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 0.8rem;
                font-weight: 600;
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
                background: rgba(255, 255, 255, 0.05);
                color: var(--text-primary, #f8fafc);
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }
            .slug-copy-btn:hover {
                border-color: var(--tools-accent, #6366f1);
                background: rgba(99, 102, 241, 0.12);
                color: var(--tools-accent, #6366f1);
            }
            .slug-copy-btn.copied {
                background: #10b981 !important;
                border-color: #10b981 !important;
                color: #ffffff !important;
            }

            /* ===== 2. CYBER GLASSMORPHISM GENERATOR ===== */
            .glass-layout-grid {
                display: grid;
                grid-template-columns: 360px 1fr;
                gap: 24px;
            }
            @media (max-width: 900px) {
                .glass-layout-grid {
                    grid-template-columns: 1fr;
                }
            }
            .glass-controls-panel {
                display: flex;
                flex-direction: column;
                gap: 14px;
                background: rgba(0, 0, 0, 0.15);
                padding: 20px;
                border-radius: 16px;
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
            }
            .glass-control-row {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .glass-label-wrap {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.84rem;
                font-weight: 600;
                color: var(--text-secondary, #94a3b8);
            }
            .glass-val-badge {
                font-family: 'JetBrains Mono', monospace;
                color: var(--tools-accent, #6366f1);
                font-size: 0.8rem;
            }
            .glass-range {
                width: 100%;
                accent-color: var(--tools-accent, #6366f1);
                cursor: pointer;
            }
            .glass-color-presets {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 4px;
            }
            .glass-color-dot {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 2px solid transparent;
                cursor: pointer;
                transition: transform 0.2s, border-color 0.2s;
                position: relative;
            }
            .glass-color-dot:hover {
                transform: scale(1.15);
            }
            .glass-color-dot.active {
                border-color: #ffffff;
                box-shadow: 0 0 10px currentColor;
            }
            .glass-preview-stage {
                position: relative;
                min-height: 380px;
                border-radius: 20px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px 20px;
                background: radial-gradient(circle at 20% 20%, #1e1b4b 0%, #030712 100%);
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
            }
            /* Suzuvchi neon fon elementlari */
            .glass-stage-orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(50px);
                opacity: 0.7;
                pointer-events: none;
                animation: floatOrb 8s ease-in-out infinite alternate;
            }
            .glass-stage-orb-1 {
                width: 220px;
                height: 220px;
                background: #06b6d4;
                top: 10%;
                left: 15%;
            }
            .glass-stage-orb-2 {
                width: 240px;
                height: 240px;
                background: #a855f7;
                bottom: 10%;
                right: 15%;
                animation-duration: 10s;
                animation-direction: alternate-reverse;
            }
            .glass-stage-orb-3 {
                width: 160px;
                height: 160px;
                background: #f43f5e;
                top: 40%;
                right: 35%;
                animation-duration: 7s;
            }
            @keyframes floatOrb {
                0% { transform: translate(0, 0) scale(1); }
                100% { transform: translate(30px, 20px) scale(1.12); }
            }
            .glass-demo-card {
                position: relative;
                z-index: 2;
                max-width: 440px;
                width: 100%;
                padding: 28px;
                color: #ffffff;
                transition: all 0.15s ease-out;
            }
            .glass-demo-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 0.72rem;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                padding: 4px 10px;
                border-radius: 20px;
                background: rgba(255, 255, 255, 0.1);
                margin-bottom: 14px;
            }
            .glass-demo-badge-dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #10b981;
                box-shadow: 0 0 8px #10b981;
            }
            .glass-demo-title {
                font-size: 1.35rem;
                font-weight: 700;
                margin: 0 0 8px 0;
            }
            .glass-demo-desc {
                font-size: 0.9rem;
                line-height: 1.55;
                color: rgba(255, 255, 255, 0.85);
                margin: 0 0 20px 0;
            }
            .glass-demo-actions {
                display: flex;
                gap: 10px;
            }
            .glass-demo-btn {
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.12);
                color: #ffffff;
            }
            .glass-demo-btn-primary {
                background: #06b6d4;
                border-color: #06b6d4;
                color: #030712;
            }
            .glass-css-output-box {
                margin-top: 16px;
                background: rgba(0, 0, 0, 0.35);
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
                border-radius: 14px;
                padding: 16px;
            }
            .glass-css-code {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.84rem;
                line-height: 1.6;
                color: #38bdf8;
                white-space: pre-wrap;
                word-break: break-all;
                display: block;
                max-height: 160px;
                overflow-y: auto;
            }

            /* ===== 3. UNIX TIMESTAMP & DATE CALCULATOR ===== */
            .ts-live-ticker-wrap {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08));
                border: 1px solid rgba(99, 102, 241, 0.25);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 16px;
            }
            .ts-ticker-numbers {
                display: flex;
                align-items: baseline;
                gap: 16px;
                flex-wrap: wrap;
            }
            .ts-ticker-sec {
                font-family: 'JetBrains Mono', monospace;
                font-size: 2rem;
                font-weight: 800;
                color: var(--text-primary, #ffffff);
                letter-spacing: 1px;
            }
            .ts-ticker-ms {
                font-family: 'JetBrains Mono', monospace;
                font-size: 1.15rem;
                font-weight: 600;
                color: var(--tools-accent, #6366f1);
            }
            .ts-sections-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            @media (max-width: 800px) {
                .ts-sections-grid {
                    grid-template-columns: 1fr;
                }
            }
            .ts-card {
                background: rgba(0, 0, 0, 0.18);
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
                border-radius: 16px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 14px;
            }
            [data-theme="light"] .ts-card {
                background: #f8fafc;
            }
            .ts-card-title {
                font-size: 1rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 8px;
                color: var(--text-primary, #ffffff);
            }
            .ts-result-row {
                background: rgba(0, 0, 0, 0.22);
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.06));
                border-radius: 10px;
                padding: 10px 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
            }
            [data-theme="light"] .ts-result-row {
                background: #ffffff;
            }
            .ts-result-label {
                font-size: 0.8rem;
                color: var(--text-secondary, #94a3b8);
                font-weight: 600;
                min-width: 110px;
            }
            .ts-result-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.86rem;
                font-weight: 600;
                color: var(--text-primary, #f8fafc);
                flex: 1;
                text-align: right;
                word-break: break-all;
            }
            .ts-diff-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                text-align: center;
                margin-top: 8px;
            }
            @media (max-width: 500px) {
                .ts-diff-stats {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            .ts-diff-box {
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
                border-radius: 10px;
                padding: 8px;
            }
            .ts-diff-box-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--tools-accent, #6366f1);
            }
            .ts-diff-box-lbl {
                font-size: 0.72rem;
                color: var(--text-secondary, #94a3b8);
                text-transform: uppercase;
                margin-top: 2px;
            }

            /* ===== 4. JWT DEKODER ===== */
            .jwt-status-card {
                padding: 12px 18px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.9rem;
                font-weight: 600;
                margin-bottom: 16px;
                transition: all 0.2s ease;
            }
            .jwt-status-valid {
                background: rgba(16, 185, 129, 0.12);
                border: 1px solid rgba(16, 185, 129, 0.35);
                color: #10b981;
            }
            .jwt-status-expired {
                background: rgba(244, 63, 94, 0.12);
                border: 1px solid rgba(244, 63, 94, 0.35);
                color: #f43f5e;
            }
            .jwt-status-invalid {
                background: rgba(245, 158, 11, 0.12);
                border: 1px solid rgba(245, 158, 11, 0.35);
                color: #f59e0b;
            }
            .jwt-parts-container {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                margin-top: 18px;
            }
            .jwt-part-box {
                border-radius: 14px;
                background: rgba(0, 0, 0, 0.25);
                overflow: hidden;
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
            }
            [data-theme="light"] .jwt-part-box {
                background: #ffffff;
            }
            .jwt-part-header {
                padding: 10px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.85rem;
                font-weight: 700;
                border-bottom: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
            }
            .jwt-part-header.header-color {
                background: rgba(244, 63, 94, 0.1);
                color: #f43f5e;
                border-bottom-color: rgba(244, 63, 94, 0.25);
            }
            .jwt-part-header.payload-color {
                background: rgba(168, 85, 247, 0.1);
                color: #a855f7;
                border-bottom-color: rgba(168, 85, 247, 0.25);
            }
            .jwt-part-header.signature-color {
                background: rgba(6, 182, 212, 0.1);
                color: #06b6d4;
                border-bottom-color: rgba(6, 182, 212, 0.25);
            }
            .jwt-part-code {
                padding: 16px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.88rem;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-all;
                margin: 0;
                max-height: 280px;
                overflow-y: auto;
            }
            /* Sintaktik ranglar */
            .jwt-json-key { color: #38bdf8; font-weight: 600; }
            .jwt-json-str { color: #a7f3d0; }
            .jwt-json-num { color: #f59e0b; font-weight: 600; }
            .jwt-json-bool { color: #ec4899; font-weight: 700; }
            .jwt-json-null { color: #94a3b8; font-style: italic; }
        `;
        document.head.appendChild(style);
    }

    // -------------------------------------------------------------------------
    // UMUMIY YORDAMCHILAR (NOTIFY & CLIPBOARD)
    // -------------------------------------------------------------------------
    function notify(message, icon = '✓') {
        const toast = document.getElementById('tools-toast');
        const iconEl = document.getElementById('toast-icon');
        const msgEl = document.getElementById('toast-msg');

        if (toast && msgEl) {
            if (iconEl) iconEl.textContent = icon;
            msgEl.textContent = message;
            toast.classList.add('show');
            clearTimeout(window.__toolsToastTimer);
            window.__toolsToastTimer = setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
            return;
        }

        if (typeof window.showToast === 'function') {
            window.showToast(message, icon);
        }
    }

    async function copyText(text, btnElement = null, successMsg = "Nusxa olindi!") {
        if (!text) {
            notify("Nusxalash uchun matn yo'q", "⚠️");
            return;
        }
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }

            notify(successMsg, "✓");

            if (btnElement) {
                const oldText = btnElement.innerHTML;
                btnElement.classList.add('copied');
                btnElement.innerHTML = `<span>✓</span> Nusxalandi!`;
                setTimeout(() => {
                    btnElement.classList.remove('copied');
                    btnElement.innerHTML = oldText;
                }, 1800);
            }
        } catch (err) {
            console.error("Nusxalashda xatolik:", err);
            notify("Nusxalashda xatolik yuz berdi", "❌");
        }
    }

    // =========================================================================
    // 1. O'ZBEKCHA URL SLUG & CASE GENERATOR (#panel-slug)
    // =========================================================================
    const CYRILLIC_TO_LATIN_MAP = {
        'ў': 'o', 'Ў': 'O',
        'ғ': 'g', 'Ғ': 'G',
        'ш': 'sh', 'Ш': 'Sh',
        'ч': 'ch', 'Ч': 'Ch',
        'ё': 'yo', 'Ё': 'Yo',
        'ю': 'yu', 'Ю': 'Yu',
        'я': 'ya', 'Я': 'Ya',
        'ц': 'ts', 'Ц': 'Ts',
        'ж': 'j', 'Ж': 'J',
        'х': 'x', 'Х': 'X',
        'ҳ': 'h', 'Ҳ': 'H',
        'қ': 'q', 'Қ': 'Q',
        'э': 'e', 'Э': 'E',
        'а': 'a', 'А': 'A',
        'б': 'b', 'Б': 'B',
        'в': 'v', 'В': 'V',
        'г': 'g', 'Г': 'G',
        'д': 'd', 'Д': 'D',
        'е': 'e', 'Е': 'E',
        'з': 'z', 'З': 'Z',
        'и': 'i', 'И': 'I',
        'й': 'y', 'Й': 'Y',
        'к': 'k', 'К': 'K',
        'л': 'l', 'Л': 'L',
        'м': 'm', 'М': 'M',
        'н': 'n', 'Н': 'N',
        'о': 'o', 'О': 'O',
        'п': 'p', 'П': 'P',
        'р': 'r', 'Р': 'R',
        'с': 's', 'С': 'S',
        'т': 't', 'Т': 'T',
        'у': 'u', 'У': 'U',
        'ф': 'f', 'Ф': 'F',
        'ы': 'i', 'Ы': 'I',
        'ъ': '', 'Ъ': '',
        'ь': '', 'Ь': ''
    };

    /**
     * O'zbek tili harflarini va simvollarini to'liq slug uchun normalizatsiya qilish:
     * o', o‘, o’, o`, oʻ, oʼ -> o
     * g', g‘, g’, g`, gʻ, gʼ -> g
     * sh, ch, ng -> saqlanadi
     */
    function normalizeUzbekForSlug(text) {
        if (!text) return '';
        let str = text;

        // Agar kirill bo'lsa, lotinga o'girish
        if (/[а-яёўғқҳ]/i.test(str)) {
            str = str.replace(/[а-яёўғқҳ]/gi, char => CYRILLIC_TO_LATIN_MAP[char] || char);
        }

        // 1. O' va G' ning barcha apostrof variantlarini to'g'rilash
        str = str.replace(/o['‘`’ʻʼ]/gi, m => m[0] === 'O' ? 'O' : 'o');
        str = str.replace(/g['‘`’ʻʼ]/gi, m => m[0] === 'G' ? 'G' : 'g');

        // 2. Qolgan ichki tutuq belgilarini tozalash (masalan: ma'lumot -> malumot, ta'lim -> talim)
        str = str.replace(/['‘`’ʻʼ]/g, '');

        return str;
    }

    /**
     * Matndan so'zlarni ajratib olish (CamelCase, snake, probellarni hisobga olgan holda)
     */
    function extractWords(rawText) {
        if (!rawText || !rawText.trim()) return [];
        const normalized = normalizeUzbekForSlug(rawText);

        // CamelCase / PascalCase so'zlarni ajratish (masalan: YangiDarslik -> Yangi Darslik)
        const spaced = normalized.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

        // Harflar va raqamlardan boshqa hamma belgilarni bo'shliqqa almashtirish
        const clean = spaced.replace(/[^a-zA-Z0-9\s]/g, ' ');

        return clean.trim().split(/\s+/).filter(Boolean);
    }

    function generateAllCases(rawText) {
        const words = extractWords(rawText);

        if (!words.length) {
            return {
                kebab: '',
                snake: '',
                camel: '',
                pascal: '',
                constant: '',
                title: '',
                charCount: 0,
                charNoSpace: 0,
                wordCount: 0,
                readingTimeSec: 0
            };
        }

        const lowerWords = words.map(w => w.toLowerCase());

        // 1. Kebab-case (SEO Slug)
        const kebab = lowerWords.join('-');

        // 2. Snake_case
        const snake = lowerWords.join('_');

        // 3. CamelCase
        const camel = lowerWords.map((w, i) => i === 0 ? w : (w.charAt(0).toUpperCase() + w.slice(1))).join('');

        // 4. PascalCase
        const pascal = lowerWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

        // 5. UPPER_CASE / CONSTANT
        const constant = words.map(w => w.toUpperCase()).join('_');

        // 6. Title Case
        const title = lowerWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // Statistika
        const charCount = rawText.length;
        const charNoSpace = rawText.replace(/\s+/g, '').length;
        const wordCount = words.length;
        const readingTimeSec = Math.max(1, Math.round((wordCount / 200) * 60));

        return {
            kebab,
            snake,
            camel,
            pascal,
            constant,
            title,
            charCount,
            charNoSpace,
            wordCount,
            readingTimeSec
        };
    }

    function initSlugTool() {
        const inputEl = document.getElementById('slug-input');
        if (!inputEl) return;

        const kebabOut = document.getElementById('slug-out-kebab');
        const snakeOut = document.getElementById('slug-out-snake');
        const camelOut = document.getElementById('slug-out-camel');
        const pascalOut = document.getElementById('slug-out-pascal');
        const constOut = document.getElementById('slug-out-const');
        const titleOut = document.getElementById('slug-out-title');

        const statChars = document.getElementById('slug-stat-chars');
        const statWords = document.getElementById('slug-stat-words');
        const statRead = document.getElementById('slug-stat-read');

        const clearBtn = document.getElementById('slug-clear-btn');
        const sampleBtn = document.getElementById('slug-sample-btn');

        function updateOutputs() {
            const val = inputEl.value;
            const res = generateAllCases(val);

            if (kebabOut) kebabOut.value = res.kebab;
            if (snakeOut) snakeOut.value = res.snake;
            if (camelOut) camelOut.value = res.camel;
            if (pascalOut) pascalOut.value = res.pascal;
            if (constOut) constOut.value = res.constant;
            if (titleOut) titleOut.value = res.title;

            if (statChars) statChars.textContent = `${res.charCount} (${res.charNoSpace} probelsiz)`;
            if (statWords) statWords.textContent = `${res.wordCount} ta`;
            if (statRead) statRead.textContent = res.wordCount > 0 ? `~${res.readingTimeSec} soniya` : `0 soniya`;
        }

        inputEl.addEventListener('input', updateOutputs);

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                inputEl.value = '';
                updateOutputs();
                inputEl.focus();
            });
        }

        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => {
                inputEl.value = "Yangi darsliklar, zamonaviy o'quv qo'llanmalari va axborot texnologiyalari haqida!";
                updateOutputs();
            });
        }

        // Barcha formatlar yonidagi nusxa olish tugmalari
        document.querySelectorAll('.slug-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const targetInput = document.getElementById(targetId);
                if (targetInput && targetInput.value) {
                    copyText(targetInput.value, btn, "Format nusxalandi!");
                } else {
                    notify("Nusxalash uchun natija mavjud emas", "⚠️");
                }
            });
        });

        // Dastlabki yangilanish
        updateOutputs();
    }

    // =========================================================================
    // 2. CYBER GLASSMORPHISM & NEON CSS GENERATOR (#panel-glass)
    // =========================================================================
    const GLASS_COLOR_MAP = {
        'cyan': { hex: '#06b6d4', rgb: '6, 182, 212' },
        'violet': { hex: '#a855f7', rgb: '168, 85, 247' },
        'emerald': { hex: '#10b981', rgb: '16, 185, 129' },
        'amber': { hex: '#f59e0b', rgb: '245, 158, 11' },
        'rose': { hex: '#f43f5e', rgb: '244, 63, 94' }
    };

    function hexToRgb(hex) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    }

    function initGlassTool() {
        const previewCard = document.getElementById('glass-preview-card');
        if (!previewCard) return;

        const opacityInput = document.getElementById('glass-bg-opacity');
        const blurInput = document.getElementById('glass-blur');
        const borderWidthInput = document.getElementById('glass-border-width');
        const borderOpacityInput = document.getElementById('glass-border-opacity');
        const glowBlurInput = document.getElementById('glass-glow-blur');
        const glowOpacityInput = document.getElementById('glass-glow-opacity');
        const radiusInput = document.getElementById('glass-radius');
        const customColorInput = document.getElementById('glass-custom-color');
        const cssCodeEl = document.getElementById('glass-css-code');
        const copyBtn = document.getElementById('glass-copy-btn');
        const resetBtn = document.getElementById('glass-reset-btn');

        // Qiymat ko'rsatuvchi teglar
        const opacityVal = document.getElementById('glass-val-opacity');
        const blurVal = document.getElementById('glass-val-blur');
        const borderWidthVal = document.getElementById('glass-val-border-width');
        const borderOpacityVal = document.getElementById('glass-val-border-opacity');
        const glowBlurVal = document.getElementById('glass-val-glow-blur');
        const glowOpacityVal = document.getElementById('glass-val-glow-opacity');
        const radiusVal = document.getElementById('glass-val-radius');

        let currentRgb = GLASS_COLOR_MAP.cyan.rgb;

        function updateGlass() {
            const bgOp = (opacityInput ? parseInt(opacityInput.value, 10) : 65) / 100;
            const blur = blurInput ? parseInt(blurInput.value, 10) : 16;
            const bWidth = borderWidthInput ? parseInt(borderWidthInput.value, 10) : 1;
            const bOp = (borderOpacityInput ? parseInt(borderOpacityInput.value, 10) : 15) / 100;
            const gBlur = glowBlurInput ? parseInt(glowBlurInput.value, 10) : 24;
            const gOp = (glowOpacityInput ? parseInt(glowOpacityInput.value, 10) : 35) / 100;
            const radius = radiusInput ? parseInt(radiusInput.value, 10) : 18;

            // Badgelarni yangilash
            if (opacityVal) opacityVal.textContent = `${Math.round(bgOp * 100)}%`;
            if (blurVal) blurVal.textContent = `${blur}px`;
            if (borderWidthVal) borderWidthVal.textContent = `${bWidth}px`;
            if (borderOpacityVal) borderOpacityVal.textContent = `${Math.round(bOp * 100)}%`;
            if (glowBlurVal) glowBlurVal.textContent = `${gBlur}px`;
            if (glowOpacityVal) glowOpacityVal.textContent = `${Math.round(gOp * 100)}%`;
            if (radiusVal) radiusVal.textContent = `${radius}px`;

            // Jonli preview kartasiga uslub berish
            const bgCss = `rgba(13, 18, 30, ${bgOp.toFixed(2)})`;
            const borderCss = `${bWidth}px solid rgba(255, 255, 255, ${bOp.toFixed(2)})`;
            const shadowCss = `0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 ${gBlur}px 2px rgba(${currentRgb}, ${gOp.toFixed(2)})`;

            previewCard.style.background = bgCss;
            previewCard.style.backdropFilter = `blur(${blur}px)`;
            previewCard.style.webkitBackdropFilter = `blur(${blur}px)`;
            previewCard.style.border = borderCss;
            previewCard.style.borderRadius = `${radius}px`;
            previewCard.style.boxShadow = shadowCss;

            // Tayyor CSS kodini generatsiya qilish
            const generatedCSS = [
                `/* Cyber Glassmorphism & Neon Box */`,
                `background: ${bgCss};`,
                `backdrop-filter: blur(${blur}px);`,
                `-webkit-backdrop-filter: blur(${blur}px);`,
                `border: ${borderCss};`,
                `border-radius: ${radius}px;`,
                `box-shadow: ${shadowCss};`
            ].join('\n');

            if (cssCodeEl) {
                cssCodeEl.textContent = generatedCSS;
            }
        }

        // Barcha slayderlar hodisasi
        const controls = [opacityInput, blurInput, borderWidthInput, borderOpacityInput, glowBlurInput, glowOpacityInput, radiusInput];
        controls.forEach(ctrl => {
            if (ctrl) ctrl.addEventListener('input', updateGlass);
        });

        // Rang presetlari
        document.querySelectorAll('.glass-color-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                document.querySelectorAll('.glass-color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                const colorKey = dot.getAttribute('data-color');
                if (GLASS_COLOR_MAP[colorKey]) {
                    currentRgb = GLASS_COLOR_MAP[colorKey].rgb;
                    if (customColorInput) customColorInput.value = GLASS_COLOR_MAP[colorKey].hex;
                    updateGlass();
                }
            });
        });

        // Maxsus rang tanlash (Color picker)
        if (customColorInput) {
            customColorInput.addEventListener('input', (e) => {
                document.querySelectorAll('.glass-color-dot').forEach(d => d.classList.remove('active'));
                currentRgb = hexToRgb(e.target.value);
                updateGlass();
            });
        }

        // CSS nusxalash tugmasi
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (cssCodeEl) {
                    copyText(cssCodeEl.textContent, copyBtn, "CSS kodi nusxalandi!");
                }
            });
        }

        // Qayta tiklash (Reset)
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (opacityInput) opacityInput.value = 65;
                if (blurInput) blurInput.value = 16;
                if (borderWidthInput) borderWidthInput.value = 1;
                if (borderOpacityInput) borderOpacityInput.value = 15;
                if (glowBlurInput) glowBlurInput.value = 24;
                if (glowOpacityInput) glowOpacityInput.value = 35;
                if (radiusInput) radiusInput.value = 18;

                const cyanDot = document.querySelector('.glass-color-dot[data-color="cyan"]');
                if (cyanDot) {
                    document.querySelectorAll('.glass-color-dot').forEach(d => d.classList.remove('active'));
                    cyanDot.classList.add('active');
                }
                currentRgb = GLASS_COLOR_MAP.cyan.rgb;
                if (customColorInput) customColorInput.value = GLASS_COLOR_MAP.cyan.hex;

                updateGlass();
                notify("Standart parametrlarga qaytarildi", "✓");
            });
        }

        // Boshlang'ich render
        updateGlass();
    }

    // =========================================================================
    // 3. UNIX TIMESTAMP & SANA KALKULYATORI (#panel-timestamp)
    // =========================================================================
    const UZ_MONTHS = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
    ];

    /**
     * Toshkent vaqti (UTC+5) bo'yicha chiroyli formatlash
     */
    function formatTashkentTime(dateObj) {
        if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return 'Noto\'g\'ri sana';

        // Toshkent UTC+5 ga o'tkazish
        const utcMs = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
        const tktDate = new Date(utcMs + (5 * 3600000));

        const day = tktDate.getDate();
        const month = UZ_MONTHS[tktDate.getMonth()];
        const year = tktDate.getFullYear();
        const hours = String(tktDate.getHours()).padStart(2, '0');
        const minutes = String(tktDate.getMinutes()).padStart(2, '0');
        const seconds = String(tktDate.getSeconds()).padStart(2, '0');

        return `${day}-${month} ${year}, ${hours}:${minutes}:${seconds} (UTC+5)`;
    }

    /**
     * Nisbiy vaqtni o'zbek tilida hisoblash
     */
    function formatUzbekRelativeTime(targetDate) {
        if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) return '';
        const now = Date.now();
        const diffMs = targetDate.getTime() - now;
        const isPast = diffMs < 0;
        const absSec = Math.floor(Math.abs(diffMs) / 1000);

        if (absSec < 5) return 'hozirgina';

        let amount, unit;
        if (absSec < 60) {
            amount = absSec;
            unit = 'soniya';
        } else if (absSec < 3600) {
            amount = Math.floor(absSec / 60);
            unit = 'daqiqa';
        } else if (absSec < 86400) {
            amount = Math.floor(absSec / 3600);
            unit = 'soat';
        } else if (absSec < 2592000) {
            amount = Math.floor(absSec / 86400);
            unit = 'kun';
        } else if (absSec < 31536000) {
            amount = Math.floor(absSec / 2592000);
            unit = 'oy';
        } else {
            amount = Math.floor(absSec / 31536000);
            unit = 'yil';
        }

        return isPast ? `${amount} ${unit} oldin` : `${amount} ${unit}dan keyin`;
    }

    function initTimestampTool() {
        const liveSecEl = document.getElementById('ts-live-sec');
        if (!liveSecEl) return;

        const liveMsEl = document.getElementById('ts-live-ms');
        const pauseBtn = document.getElementById('ts-live-pause-btn');
        const copySecBtn = document.getElementById('ts-copy-sec-btn');
        const copyMsBtn = document.getElementById('ts-copy-ms-btn');

        let isLiveActive = true;
        let tickerInterval = null;

        function tick() {
            if (!isLiveActive) return;
            const now = Date.now();
            if (liveSecEl) liveSecEl.textContent = Math.floor(now / 1000);
            if (liveMsEl) liveMsEl.textContent = `.${String(now % 1000).padStart(3, '0')}`;
        }

        tickerInterval = setInterval(tick, 100);
        tick();

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                isLiveActive = !isLiveActive;
                pauseBtn.textContent = isLiveActive ? '⏸️ Pauza' : '▶️ Davom ettirish';
                pauseBtn.classList.toggle('tool-btn-primary', !isLiveActive);
            });
        }

        if (copySecBtn) {
            copySecBtn.addEventListener('click', () => {
                const nowSec = String(Math.floor(Date.now() / 1000));
                copyText(nowSec, copySecBtn, "Sekund timestamp nusxalandi!");
            });
        }

        if (copyMsBtn) {
            copyMsBtn.addEventListener('click', () => {
                const nowMs = String(Date.now());
                copyText(nowMs, copyMsBtn, "Millisekund timestamp nusxalandi!");
            });
        }

        // --- 1. TIMESTAMP -> SANA ---
        const tsInput = document.getElementById('ts-to-date-input');
        const outTkt = document.getElementById('ts-out-tkt');
        const outUtc = document.getElementById('ts-out-utc');
        const outIso = document.getElementById('ts-out-iso');
        const outRel = document.getElementById('ts-out-rel');
        const setNowBtn = document.getElementById('ts-set-now-btn');

        function convertTsToDate() {
            if (!tsInput) return;
            let raw = tsInput.value.trim();
            if (!raw) {
                if (outTkt) outTkt.textContent = '—';
                if (outUtc) outUtc.textContent = '—';
                if (outIso) outIso.textContent = '—';
                if (outRel) outRel.textContent = '—';
                return;
            }

            let num = Number(raw);
            if (isNaN(num)) {
                if (outTkt) outTkt.textContent = 'Raqam kiritilishi shart!';
                return;
            }

            // Agar 10 ta raqam bo'lsa (soniyalar), ms ga o'tkazamiz
            let ms = raw.length <= 11 ? num * 1000 : num;
            const d = new Date(ms);

            if (isNaN(d.getTime())) {
                if (outTkt) outTkt.textContent = 'Noto\'g\'ri timestamp';
                return;
            }

            if (outTkt) outTkt.textContent = formatTashkentTime(d);
            if (outUtc) outUtc.textContent = d.toUTCString();
            if (outIso) outIso.textContent = d.toISOString();
            if (outRel) outRel.textContent = formatUzbekRelativeTime(d);
        }

        if (tsInput) {
            tsInput.addEventListener('input', convertTsToDate);
        }

        if (setNowBtn && tsInput) {
            setNowBtn.addEventListener('click', () => {
                tsInput.value = Math.floor(Date.now() / 1000);
                convertTsToDate();
            });
        }

        // --- 2. SANA -> TIMESTAMP ---
        const dtInput = document.getElementById('ts-date-picker');
        const outDateSec = document.getElementById('ts-date-out-sec');
        const outDateMs = document.getElementById('ts-date-out-ms');
        const dateNowBtn = document.getElementById('ts-date-now-btn');

        function convertDateToTs() {
            if (!dtInput || !dtInput.value) return;
            const picked = new Date(dtInput.value);
            if (isNaN(picked.getTime())) return;

            const ms = picked.getTime();
            const sec = Math.floor(ms / 1000);

            if (outDateSec) outDateSec.textContent = sec;
            if (outDateMs) outDateMs.textContent = ms;
        }

        if (dtInput) {
            dtInput.addEventListener('input', convertDateToTs);
        }

        if (dateNowBtn && dtInput) {
            dateNowBtn.addEventListener('click', () => {
                const now = new Date();
                const tzOffset = now.getTimezoneOffset() * 60000;
                const localISOTime = (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);
                dtInput.value = localISOTime;
                convertDateToTs();
            });
        }

        // Boshlang'ich sana qiymati
        if (dtInput && !dtInput.value) {
            const now = new Date();
            const tzOffset = now.getTimezoneOffset() * 60000;
            dtInput.value = (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);
            convertDateToTs();
        }

        // --- 3. IKKI SANA ORASIDAGI FARQ KALKULYATORI ---
        const diffStartInput = document.getElementById('ts-diff-start');
        const diffEndInput = document.getElementById('ts-diff-end');
        const diffDaysEl = document.getElementById('ts-diff-days');
        const diffHoursEl = document.getElementById('ts-diff-hours');
        const diffMinsEl = document.getElementById('ts-diff-mins');
        const diffSecsEl = document.getElementById('ts-diff-secs');
        const diffSummaryEl = document.getElementById('ts-diff-summary');

        function calculateDateDiff() {
            if (!diffStartInput || !diffEndInput || !diffStartInput.value || !diffEndInput.value) return;
            const d1 = new Date(diffStartInput.value);
            const d2 = new Date(diffEndInput.value);

            if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;

            const diffMs = Math.abs(d2.getTime() - d1.getTime());
            let remain = Math.floor(diffMs / 1000);

            const days = Math.floor(remain / 86400);
            remain %= 86400;

            const hours = Math.floor(remain / 3600);
            remain %= 3600;

            const minutes = Math.floor(remain / 60);
            const seconds = remain % 60;

            if (diffDaysEl) diffDaysEl.textContent = days;
            if (diffHoursEl) diffHoursEl.textContent = hours;
            if (diffMinsEl) diffMinsEl.textContent = minutes;
            if (diffSecsEl) diffSecsEl.textContent = seconds;

            const totalHours = Math.floor(diffMs / 3600000);
            const totalMinutes = Math.floor(diffMs / 60000);
            const totalSeconds = Math.floor(diffMs / 1000);

            if (diffSummaryEl) {
                const relation = d2 >= d1 ? "farq (kelajak)" : "farq (o'tmish)";
                diffSummaryEl.textContent = `Jami: ${totalHours.toLocaleString()} soat | ${totalMinutes.toLocaleString()} daqiqa | ${totalSeconds.toLocaleString()} soniya (${relation})`;
            }
        }

        if (diffStartInput) diffStartInput.addEventListener('input', calculateDateDiff);
        if (diffEndInput) diffEndInput.addEventListener('input', calculateDateDiff);

        // Standart boshlang'ich va tugash sanalari
        if (diffStartInput && !diffStartInput.value && diffEndInput && !diffEndInput.value) {
            const now = new Date();
            const tzOffset = now.getTimezoneOffset() * 60000;
            diffStartInput.value = (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);

            // 7 kun keyin
            const weekLater = new Date(now.getTime() + 7 * 86400000 - tzOffset);
            diffEndInput.value = weekLater.toISOString().slice(0, 16);
            calculateDateDiff();
        }

        // Barcha ts nusxa olish tugmalari
        document.querySelectorAll('.ts-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                if (targetEl && targetEl.textContent && targetEl.textContent !== '—') {
                    copyText(targetEl.textContent, btn);
                }
            });
        });

        // Boshlang'ich hisob
        if (tsInput && !tsInput.value) {
            tsInput.value = Math.floor(Date.now() / 1000);
            convertTsToDate();
        }
    }

    // =========================================================================
    // 4. JWT (JSON WEB TOKEN) DEKODER (#panel-jwt)
    // =========================================================================

    /**
     * UTF-8 qo'llab-quvvatlovchi xavfsiz Base64Url dekoder
     * (O'zbekcha krill/lotin va emoji simvollarini buzmamasdan o'qiydi)
     */
    function base64UrlDecodeUtf8(str) {
        if (!str) return '';
        // 1. Base64Url simvollarini standart Base64 ga o'tkazish
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // 2. Padding (=) qo'shish
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
        // 3. Ikkilik baytlar orqali UTF-8 dekodlash
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder('utf-8').decode(bytes);
    }

    /**
     * JSON matniga sintaktik ranglar berish (HTML escape bilan)
     */
    function syntaxHighlightJson(jsonObj) {
        const jsonStr = JSON.stringify(jsonObj, null, 2);
        const escaped = jsonStr
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
            let cls = 'jwt-json-num';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'jwt-json-key';
                } else {
                    cls = 'jwt-json-str';
                }
            } else if (/true|false/.test(match)) {
                cls = 'jwt-json-bool';
            } else if (/null/.test(match)) {
                cls = 'jwt-json-null';
            }
            return `<span class="${cls}">${match}</span>`;
        });
    }

    function decodeJwtToken(tokenStr) {
        if (!tokenStr || !tokenStr.trim()) {
            return { error: 'Iltimos, JWT tokenni kiriting.' };
        }

        const parts = tokenStr.trim().split('.');
        if (parts.length !== 3) {
            return {
                error: `Noto'g'ri JWT formati: Token 3 qismdan (Header.Payload.Signature) iborat bo'lishi kerak. Topildi: ${parts.length} ta qism.`
            };
        }

        try {
            const rawHeader = base64UrlDecodeUtf8(parts[0]);
            const headerObj = JSON.parse(rawHeader);

            const rawPayload = base64UrlDecodeUtf8(parts[1]);
            const payloadObj = JSON.parse(rawPayload);

            const signature = parts[2];

            // Muddatni (exp, iat) tekshirish
            let expiryInfo = null;
            const nowSec = Math.floor(Date.now() / 1000);

            if (payloadObj && typeof payloadObj.exp === 'number') {
                const expDate = new Date(payloadObj.exp * 1000);
                const isExpired = nowSec >= payloadObj.exp;
                const diffSec = Math.abs(payloadObj.exp - nowSec);

                let remainingStr = '';
                if (diffSec < 60) {
                    remainingStr = `${diffSec} soniya`;
                } else if (diffSec < 3600) {
                    remainingStr = `${Math.floor(diffSec / 60)} daqiqa`;
                } else if (diffSec < 86400) {
                    remainingStr = `${Math.floor(diffSec / 3600)} soat ${Math.floor((diffSec % 3600) / 60)} daqiqa`;
                } else {
                    remainingStr = `${Math.floor(diffSec / 86400)} kun ${Math.floor((diffSec % 86400) / 3600)} soat`;
                }

                expiryInfo = {
                    hasExp: true,
                    isExpired: isExpired,
                    expDate: expDate,
                    expFormatted: formatTashkentTime(expDate),
                    remainingText: remainingStr
                };
            } else {
                expiryInfo = { hasExp: false };
            }

            return {
                headerObj,
                payloadObj,
                signature,
                rawHeader,
                rawPayload,
                expiryInfo
            };
        } catch (err) {
            return {
                error: `Dekodlashda xatolik: Token ma'lumotlari shikastlangan yoki yaroqsiz JSON (${err.message})`
            };
        }
    }

    function initJwtTool() {
        const inputEl = document.getElementById('jwt-input');
        if (!inputEl) return;

        const statusEl = document.getElementById('jwt-status');
        const headerCode = document.getElementById('jwt-header-code');
        const payloadCode = document.getElementById('jwt-payload-code');
        const signatureCode = document.getElementById('jwt-signature-code');
        const resultsWrap = document.getElementById('jwt-results-wrap');

        const sampleBtn = document.getElementById('jwt-sample-btn');
        const clearBtn = document.getElementById('jwt-clear-btn');

        function renderJwt() {
            const token = inputEl.value.trim();
            if (!token) {
                if (resultsWrap) resultsWrap.style.display = 'none';
                if (statusEl) {
                    statusEl.style.display = 'none';
                }
                return;
            }

            const res = decodeJwtToken(token);

            if (res.error) {
                if (statusEl) {
                    statusEl.style.display = 'flex';
                    statusEl.className = 'jwt-status-card jwt-status-invalid';
                    statusEl.innerHTML = `<span>⚠️</span> <span>${res.error}</span>`;
                }
                if (resultsWrap) resultsWrap.style.display = 'none';
                return;
            }

            // Muvaffaqiyatli dekodlandi
            if (resultsWrap) resultsWrap.style.display = 'grid';

            // Status xabari
            if (statusEl) {
                statusEl.style.display = 'flex';
                if (!res.expiryInfo.hasExp) {
                    statusEl.className = 'jwt-status-card jwt-status-invalid';
                    statusEl.innerHTML = `<span>ℹ️</span> <span>Token amal qilish muddati ('exp') belgilanmagan (Muddatsiz token).</span>`;
                } else if (res.expiryInfo.isExpired) {
                    statusEl.className = 'jwt-status-card jwt-status-expired';
                    statusEl.innerHTML = `<span>❌</span> <span>Muddati o'tgan (${res.expiryInfo.remainingText} oldin tugagan: ${res.expiryInfo.expFormatted})</span>`;
                } else {
                    statusEl.className = 'jwt-status-card jwt-status-valid';
                    statusEl.innerHTML = `<span>✓</span> <span>Token Yaroqli (Tugashiga ${res.expiryInfo.remainingText} qoldi — ${res.expiryInfo.expFormatted})</span>`;
                }
            }

            // Header chiqarish
            if (headerCode) {
                headerCode.innerHTML = syntaxHighlightJson(res.headerObj);
            }

            // Payload chiqarish
            if (payloadCode) {
                payloadCode.innerHTML = syntaxHighlightJson(res.payloadObj);
            }

            // Signature chiqarish
            if (signatureCode) {
                signatureCode.textContent = res.signature;
            }
        }

        inputEl.addEventListener('input', renderJwt);

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                inputEl.value = '';
                renderJwt();
                inputEl.focus();
            });
        }

        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => {
                // Namuna JWT: 24 soatlik amal qilish muddati bilan
                const nowSec = Math.floor(Date.now() / 1000);
                const expSec = nowSec + 86400; // 24 soat

                const sampleHeader = {
                    alg: "HS256",
                    typ: "JWT"
                };

                const samplePayload = {
                    sub: "user_784920",
                    name: "Alisher Abdug'offorov",
                    role: "lead_developer",
                    email: "info@abdugofforov.uz",
                    iss: "https://abdugofforov.uz",
                    iat: nowSec,
                    exp: expSec
                };

                const b64Header = btoa(JSON.stringify(sampleHeader)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
                const b64Payload = btoa(unescape(encodeURIComponent(JSON.stringify(samplePayload)))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
                const sampleSignature = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

                inputEl.value = `${b64Header}.${b64Payload}.${sampleSignature}`;
                renderJwt();
                notify("Namunaviy JWT token yuklandi", "🔑");
            });
        }

        // Qismlarni nusxalash
        document.querySelectorAll('.jwt-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    copyText(targetEl.textContent || targetEl.innerText, btn, "Nusxalandi!");
                }
            });
        });

        // Agar inputda dastlabki qiymat bo'lsa
        if (inputEl.value) {
            renderJwt();
        }
    }

    // =========================================================================
    // INITSIALIZATSIYA VA GLOBAL EKSPORT
    // =========================================================================
    function initAll() {
        injectSuiteStyles();
        initSlugTool();
        initGlassTool();
        initTimestampTool();
        initJwtTool();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // Global eksport
    window.ToolsDevSuite = {
        slug: {
            normalizeUzbekForSlug,
            extractWords,
            generateAllCases
        },
        glass: {
            hexToRgb,
            colorPresets: GLASS_COLOR_MAP
        },
        timestamp: {
            formatTashkentTime,
            formatUzbekRelativeTime
        },
        jwt: {
            decode: decodeJwtToken,
            base64UrlDecodeUtf8
        },
        init: initAll,
        version: '1.0.0'
    };

})();
