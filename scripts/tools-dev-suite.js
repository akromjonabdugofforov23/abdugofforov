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
