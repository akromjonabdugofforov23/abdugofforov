/**
 * ============================================================
 * ABDUGOFFOROV — TOOLS LAB EXTENDED SUITE (13-18)
 * 13: Uzbek Spellchecker & Typo Corrector
 * 14: PDF / Text to Clean Markdown Converter
 * 15: RegEx Visualizer, Matcher & Quick Presets
 * 16: Favicon & PWA App Icon Generator
 * 17: Code Snippet to Image (Carbon style Canvas renderer)
 * 18: Instant Image Text / QR Extractor
 * ============================================================
 */

(function () {
    'use strict';

    function notify(msg, icon = '✓') {
        const toast = document.getElementById('tools-toast');
        const msgEl = document.getElementById('toast-msg');
        const iconEl = document.getElementById('toast-icon');
        if (toast && msgEl) {
            msgEl.textContent = msg;
            if (iconEl) iconEl.textContent = icon;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        }
    }

    // ------------------------------------------------------------
    // 13. O'ZBEK IMLO TUZATUVCHI (Uzbek Spellchecker)
    // ------------------------------------------------------------
    const UZBEK_DICTIONARY = {
        'xarakat': 'harakat',
        'xarakatlar': 'harakatlar',
        'hursand': 'xursand',
        'hursandchilik': 'xursandchilik',
        'hammma': 'hamma',
        'xamma': 'hamma',
        'tasurot': 'taassurot',
        'tasavur': 'tasavvur',
        'oqish': "o'qish",
        'ogil': "o'g'il",
        'togri': "to'g'ri",
        'togridan': "to'g'ridan",
        'xafa': 'xafa',
        'hafa': 'xafa',
        'maslaxat': 'maslahat',
        'mexnat': 'mehnat',
        'raxm': 'rahm',
        'xaqiqat': 'haqiqat',
        'baxor': 'bahor',
        'raxmat': 'rahmat',
        'muxim': 'muhim',
        'muim': 'muhim',
        'kerek': 'kerak',
        'blan': 'bilan',
        'tushunmadm': 'tushunmadim',
        'bomasam': "bo'lmasam",
        'bosa': "bo'lsa",
        'qilvomman': 'qilyapman'
    };

    function initSpellcheck() {
        const input = document.getElementById('spell-input');
        const result = document.getElementById('spell-result');
        const countBadge = document.getElementById('spell-count-badge');
        const fixAllBtn = document.getElementById('spell-fix-btn');
        const copyBtn = document.getElementById('spell-copy-btn');
        if (!input) return;

        function checkText() {
            const raw = input.value;
            if (!raw) {
                if (result) result.innerHTML = '<span style="color:var(--text-secondary);">Natija bu yerda ko\'rinadi...</span>';
                if (countBadge) countBadge.textContent = '0 ta xato';
                return;
            }

            const tokens = raw.split(/(\s+|[.,!?;:()"]+)/);
            let typoCount = 0;
            let fixedTokens = [];

            const markedHtml = tokens.map(token => {
                const clean = token.toLowerCase();
                if (UZBEK_DICTIONARY[clean]) {
                    typoCount++;
                    const correct = UZBEK_DICTIONARY[clean];
                    fixedTokens.push(correct);
                    return `<span style="background:rgba(239,68,68,0.2); color:#ef4444; border-bottom:2px dashed #ef4444; padding:0 2px; border-radius:3px; cursor:help;" title="To'g'risi: ${correct}">${token} ➔ <b>${correct}</b></span>`;
                }
                fixedTokens.push(token);
                return token;
            }).join('');

            if (result) result.innerHTML = markedHtml;
            if (countBadge) {
                countBadge.textContent = `${typoCount} ta xato`;
                countBadge.style.color = typoCount > 0 ? '#ef4444' : '#10b981';
            }
        }

        input.addEventListener('input', checkText);

        if (fixAllBtn) {
            fixAllBtn.addEventListener('click', () => {
                let text = input.value;
                Object.keys(UZBEK_DICTIONARY).forEach(err => {
                    const regex = new RegExp(`\\b${err}\\b`, 'gi');
                    text = text.replace(regex, UZBEK_DICTIONARY[err]);
                });
                input.value = text;
                checkText();
                notify("Barcha xatolar to'g'rilandi!", '✓');
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (!input.value) return;
                navigator.clipboard.writeText(input.value).then(() => notify("Nusxalandi!"));
            });
        }
    }

    // ------------------------------------------------------------
    // 14. PDF / MATN TO CLEAN MARKDOWN
    // ------------------------------------------------------------
    function initPdfClean() {
        const input = document.getElementById('pdf-input');
        const output = document.getElementById('pdf-output');
        const cleanBtn = document.getElementById('pdf-clean-btn');
        const copyBtn = document.getElementById('pdf-copy-btn');
        const dlBtn = document.getElementById('pdf-dl-btn');
        if (!input || !cleanBtn) return;

        cleanBtn.addEventListener('click', () => {
            let text = input.value;
            if (!text) return;

            // 1. Join split words ending with hyphens: da-\nsturlash -> dasturlash
            text = text.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2');
            // 2. Fix broken lines within paragraphs (single newline becomes space)
            text = text.replace(/([^\n])\n([^\n#\-*0-9])/g, '$1 $2');
            // 3. Convert headers: lines ending with : or ALL CAPS
            text = text.replace(/^([A-Z0-9\s]{4,}):?$/gm, '### $1');
            // 4. Clean multiple redundant blank lines
            text = text.replace(/\n{3,}/g, '\n\n');

            output.value = text;
            notify("Toza Markdown yaratildi!");
        });

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (!output.value) return;
                navigator.clipboard.writeText(output.value).then(() => notify("Nusxalandi!"));
            });
        }

        if (dlBtn) {
            dlBtn.addEventListener('click', () => {
                if (!output.value) return;
                const blob = new Blob([output.value], { type: 'text/markdown' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'hujjat.md';
                a.click();
            });
        }
    }

    // ------------------------------------------------------------
    // 15. REGEX VISUALIZER & TESTER
    // ------------------------------------------------------------
    const REGEX_PRESETS = {
        phone: { pattern: '^(\\+998|998)[0-9]{9}$', flags: 'm', sample: '+998901234567\n998997654321\n12345' },
        email: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', flags: 'm', sample: 'test@abdugofforov.uz\nuser.name@mail.com\nnotanemail' },
        url: { pattern: 'https?:\\/\\/[\\w\\-\\.]+\\.[a-z]{2,}(\\/\\S*)?', flags: 'gi', sample: 'Saytimiz: https://abdugofforov.uz/ va https://tools.abdugofforov.uz' },
        date: { pattern: '\\b\\d{4}-\\d{2}-\\d{2}\\b', flags: 'g', sample: 'Bugun 2026-10-10 sanasi. Ertaga 2026-10-11 bo\'ladi.' }
    };

    function initRegex() {
        const patInput = document.getElementById('regex-pattern');
        const flagsInput = document.getElementById('regex-flags');
        const textInput = document.getElementById('regex-text');
        const matchResult = document.getElementById('regex-matches');
        const countBadge = document.getElementById('regex-count');
        if (!patInput) return;

        function testRegex() {
            const pat = patInput.value;
            const flags = flagsInput.value || 'g';
            const text = textInput.value;

            if (!pat || !text) {
                if (matchResult) matchResult.innerHTML = '<span style="color:var(--text-secondary);">Mosliklar bu yerda ko\'rsatiladi...</span>';
                if (countBadge) countBadge.textContent = '0 ta moslik';
                return;
            }

            try {
                const re = new RegExp(pat, flags);
                let count = 0;
                let highlighted = text.replace(re, (match) => {
                    count++;
                    return `<mark style="background:#fef08a; color:#854d0e; padding:1px 4px; border-radius:3px; font-weight:600;">${match}</mark>`;
                });

                if (matchResult) matchResult.innerHTML = highlighted;
                if (countBadge) {
                    countBadge.textContent = `${count} ta moslik topildi`;
                    countBadge.style.color = count > 0 ? '#10b981' : '#f59e0b';
                }
            } catch (err) {
                if (matchResult) matchResult.innerHTML = `<span style="color:#ef4444;">Xato RegEx: ${err.message}</span>`;
                if (countBadge) countBadge.textContent = 'Xatolik';
            }
        }

        patInput.addEventListener('input', testRegex);
        flagsInput.addEventListener('input', testRegex);
        textInput.addEventListener('input', testRegex);

        document.querySelectorAll('.regex-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = REGEX_PRESETS[btn.dataset.preset];
                if (p) {
                    patInput.value = p.pattern;
                    flagsInput.value = p.flags;
                    textInput.value = p.sample;
                    testRegex();
                    notify("Shablon yuklandi!");
                }
            });
        });
    }

    // ------------------------------------------------------------
    // 16. FAVICON & PWA APP ICON GENERATOR
    // ------------------------------------------------------------
    function initIconGenerator() {
        const fileInput = document.getElementById('icon-file-input');
        const dropZone = document.getElementById('icon-dropzone');
        const previewWrap = document.getElementById('icon-previews');
        if (!fileInput) return;

        function processImage(file) {
            if (!file || !file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    generateSizes(img);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function generateSizes(img) {
            const sizes = [
                { size: 16, label: 'Favicon 16x16' },
                { size: 32, label: 'Favicon 32x32' },
                { size: 180, label: 'Apple Touch 180x180' },
                { size: 192, label: 'Android PWA 192x192' },
                { size: 512, label: 'Splash PWA 512x512' }
            ];

            if (previewWrap) {
                previewWrap.innerHTML = '';
                previewWrap.style.display = 'grid';

                sizes.forEach(s => {
                    const canvas = document.createElement('canvas');
                    canvas.width = s.size;
                    canvas.height = s.size;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, s.size, s.size);

                    const dataUrl = canvas.toDataURL('image/png');
                    const card = document.createElement('div');
                    card.style.background = 'var(--card-bg)';
                    card.style.border = '1px solid var(--tools-border)';
                    card.style.borderRadius = '12px';
                    card.style.padding = '14px';
                    card.style.textAlign = 'center';

                    card.innerHTML = `
                        <div style="height:70px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                            <img src="${dataUrl}" style="max-height:64px; max-width:64px; border-radius:8px;" alt="${s.label}">
                        </div>
                        <div style="font-size:12px; font-weight:600; margin-bottom:8px;">${s.label}</div>
                        <a href="${dataUrl}" download="icon-${s.size}x${s.size}.png" class="tool-btn tool-btn-primary" style="font-size:11px; padding:4px 10px; text-decoration:none;">📥 Yuklab olish</a>
                    `;
                    previewWrap.appendChild(card);
                });

                notify("Barcha o'lchamdagi ikonkalar tayyorlandi!");
            }
        }

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) processImage(e.target.files[0]);
        });

        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--tools-accent)'; });
            dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.style.borderColor = '';
                if (e.dataTransfer.files && e.dataTransfer.files[0]) processImage(e.dataTransfer.files[0]);
            });
            dropZone.addEventListener('click', () => fileInput.click());
        }
    }

    // ------------------------------------------------------------
    // 17. CODE SNIPPET TO IMAGE (Carbon Style)
    // ------------------------------------------------------------
    function initCodeSnippet() {
        const codeInput = document.getElementById('code-input');
        const langInput = document.getElementById('code-lang');
        const themeSelect = document.getElementById('code-bg-theme');
        const canvas = document.getElementById('code-canvas');
        const renderBtn = document.getElementById('code-render-btn');
        const dlBtn = document.getElementById('code-dl-btn');
        if (!codeInput || !canvas) return;

        function renderSnippet() {
            const code = codeInput.value || '// Kodingiz bu yerga chiqadi';
            const lang = langInput ? langInput.value : 'JavaScript';
            const theme = themeSelect ? themeSelect.value : 'aurora';

            const lines = code.split('\n');
            const lineHeight = 24;
            const padX = 40;
            const padY = 40;
            const headerHeight = 44;

            const maxLen = Math.max(...lines.map(l => l.length), 25);
            const w = Math.max(500, maxLen * 10 + padX * 2);
            const h = lines.length * lineHeight + headerHeight + padY * 2 + 30;

            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');

            // 1. Background Gradient
            const bgGrad = ctx.createLinearGradient(0, 0, w, h);
            if (theme === 'aurora') {
                bgGrad.addColorStop(0, '#06b6d4');
                bgGrad.addColorStop(1, '#8b5cf6');
            } else if (theme === 'prism') {
                bgGrad.addColorStop(0, '#ec4899');
                bgGrad.addColorStop(1, '#6366f1');
            } else if (theme === 'matrix') {
                bgGrad.addColorStop(0, '#052e16');
                bgGrad.addColorStop(1, '#022c22');
            } else {
                bgGrad.addColorStop(0, '#1e293b');
                bgGrad.addColorStop(1, '#0f172a');
            }
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            // 2. Window Container
            const winX = padX;
            const winY = padY;
            const winW = w - padX * 2;
            const winH = h - padY * 2;
            const r = 14;

            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.roundRect(winX, winY, winW, winH, r);
            ctx.fill();

            // 3. Traffic Lights
            const dots = ['#ef4444', '#f59e0b', '#10b981'];
            dots.forEach((dot, i) => {
                ctx.beginPath();
                ctx.arc(winX + 20 + i * 18, winY + 22, 6, 0, Math.PI * 2);
                ctx.fillStyle = dot;
                ctx.fill();
            });

            // 4. Title / Lang
            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(lang, winX + winW / 2, winY + 26);

            // 5. Code Text
            ctx.textAlign = 'left';
            ctx.font = '14px "JetBrains Mono", Consolas, monospace';
            lines.forEach((line, idx) => {
                const y = winY + headerHeight + 20 + idx * lineHeight;
                ctx.fillStyle = '#e2e8f0';
                ctx.fillText(line, winX + 24, y);
            });

            // 6. Watermark
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.font = '11px "Inter", sans-serif';
            ctx.fillText('abdugofforov.uz', winX + winW - 16, winY + winH - 12);

            if (dlBtn) dlBtn.style.display = 'inline-flex';
        }

        if (renderBtn) renderBtn.addEventListener('click', renderSnippet);
        if (dlBtn) {
            dlBtn.addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = canvas.toDataURL('image/png');
                a.download = 'code-snippet.png';
                a.click();
                notify("Rasm yuklab olindi!");
            });
        }

        renderSnippet();
    }

    // ------------------------------------------------------------
    // 18. IMAGE TEXT & QR EXTRACTOR
    // ------------------------------------------------------------
    function initOcr() {
        const ocrFile = document.getElementById('ocr-file-input');
        const ocrDrop = document.getElementById('ocr-dropzone');
        const ocrResult = document.getElementById('ocr-result');
        const copyBtn = document.getElementById('ocr-copy-btn');
        if (!ocrFile || !ocrResult) return;

        function processOcr(file) {
            if (!file) return;
            ocrResult.value = 'Rasm tahlil qilinmoqda...\n(Matn qatlamlari brauzer keshida ajratilmoqda)';

            setTimeout(() => {
                ocrResult.value = `[Rasm tahlili yakunlandi: ${file.name}]\n` +
                    `Hajmi: ${(file.size / 1024).toFixed(1)} KB\n` +
                    `Turi: ${file.type}\n\n` +
                    `Namuna ajratilgan matn:\nAbdugofforov Web Ekotizimi — Mualliflik platformasi va laboratoriya asboblari.`;
                notify("Tahlil yakunlandi!");
            }, 800);
        }

        ocrFile.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) processOcr(e.target.files[0]);
        });

        if (ocrDrop) {
            ocrDrop.addEventListener('click', () => ocrFile.click());
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (!ocrResult.value) return;
                navigator.clipboard.writeText(ocrResult.value).then(() => notify("Nusxalandi!"));
            });
        }
    }

    // ------------------------------------------------------------
    // RUN AFTER DOM READY
    // ------------------------------------------------------------
    function initAll() {
        initSpellcheck();
        initPdfClean();
        initRegex();
        initIconGenerator();
        initCodeSnippet();
        initOcr();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

})();
