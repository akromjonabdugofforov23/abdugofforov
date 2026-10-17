/**
 * ABDUGOFFOROV WEB EKOTIZIMI — TOOLS MEDIA SUITE
 * scripts/tools-media-suite.js
 * 
 * Ushbu modul quyidagi media va vizual vositalarni to'laqonli ta'minlaydi:
 * 1. Favicon & PWA App Icon Generator (16x16, 32x32, 48x48, 180x180, 192x192, 512x512, .ico generator, HTML meta-teglari)
 * 2. Code to Image (Retina High-DPI Canvas, haqiqiy sintaksis ranglash, macOS oynasi, nafis gradientlar, PNG yuklab olish)
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // YORDAMCHI FUNKSIYALAR (TOAST & NOTIFICATIONS)
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
            }, 3000);
            return;
        }

        // Agar mavjud showToast bo'lsa
        if (typeof window.showToast === 'function') {
            window.showToast(message, icon);
        }
    }

    // -------------------------------------------------------------------------
    // 1. FAVICON & PWA APP ICON GENERATOR (#panel-icon)
    // -------------------------------------------------------------------------
    const ICON_SPECS = [
        { size: 16, name: 'favicon-16x16.png', label: 'Brauzer Favicon', desc: 'Brauzer tablari (16x16)' },
        { size: 32, name: 'favicon-32x32.png', label: 'Standart Favicon', desc: 'Retina / Desktop tablari (32x32)' },
        { size: 48, name: 'favicon-48x48.png', label: 'Windows Shortcut', desc: 'Ish stoli va yorliqlar (48x48)' },
        { size: 180, name: 'apple-touch-icon.png', label: 'Apple Touch Icon', desc: 'iOS bosh ekrani (180x180)' },
        { size: 192, name: 'android-chrome-192x192.png', label: 'Android PWA Icon', desc: 'Chrome / PWA ilova (192x192)' },
        { size: 512, name: 'android-chrome-512x512.png', label: 'PWA Splash Icon', desc: 'Ochilish ekrani / Do\'kon (512x512)' }
    ];

    /**
     * Sof JavaScript da 16x16 va 32x32 PNG lar asosida haqiqiy .ico fayl yaratish.
     * Standart ICO: Header (6 bayt) + 2x Directory Entry (har biri 16 bayt) + PNG baytlari.
     */
    async function generateMultiResIcoBlob(canvas16, canvas32) {
        const getPngBuffer = (cvs) => {
            return new Promise((resolve, reject) => {
                cvs.toBlob(blob => {
                    if (!blob) return reject(new Error("PNG generatsiya qilib bo'lmadi"));
                    blob.arrayBuffer().then(resolve).catch(reject);
                }, 'image/png');
            });
        };

        const [buf16, buf32] = await Promise.all([
            getPngBuffer(canvas16),
            getPngBuffer(canvas32)
        ]);

        const imageCount = 2;
        const headerSize = 6;
        const entrySize = 16;
        const dirOffset = headerSize;
        const img1Offset = headerSize + (imageCount * entrySize);
        const img2Offset = img1Offset + buf16.byteLength;
        const totalSize = img2Offset + buf32.byteLength;

        const buffer = new ArrayBuffer(totalSize);
        const view = new DataView(buffer);
        const bytes = new Uint8Array(buffer);

        // ICO Header
        view.setUint16(0, 0, true);       // Reserved: doim 0
        view.setUint16(2, 1, true);       // Type: 1 = Icon (.ico)
        view.setUint16(4, imageCount, true); // Rasmlar soni: 2 ta

        // Entry 1: 16x16
        view.setUint8(dirOffset + 0, 16);               // Width
        view.setUint8(dirOffset + 1, 16);               // Height
        view.setUint8(dirOffset + 2, 0);                // Ranglar palitrasi (0 = >=8bpp)
        view.setUint8(dirOffset + 3, 0);                // Reserved: 0
        view.setUint16(dirOffset + 4, 1, true);         // Color planes
        view.setUint16(dirOffset + 6, 32, true);        // Bits per pixel (32-bit RGBA)
        view.setUint32(dirOffset + 8, buf16.byteLength, true); // Rasm hajmi (bayt)
        view.setUint32(dirOffset + 12, img1Offset, true);      // Fayldagi offseti

        // Entry 2: 32x32
        const dir2Offset = dirOffset + entrySize;
        view.setUint8(dir2Offset + 0, 32);              // Width
        view.setUint8(dir2Offset + 1, 32);              // Height
        view.setUint8(dir2Offset + 2, 0);               // Ranglar palitrasi
        view.setUint8(dir2Offset + 3, 0);               // Reserved: 0
        view.setUint16(dir2Offset + 4, 1, true);        // Color planes
        view.setUint16(dir2Offset + 6, 32, true);       // Bits per pixel (32-bit RGBA)
        view.setUint32(dir2Offset + 8, buf32.byteLength, true); // Rasm hajmi (bayt)
        view.setUint32(dir2Offset + 12, img2Offset, true);     // Fayldagi offseti

        // Rasmlar PNG ma'lumotlarini nusxalash
        bytes.set(new Uint8Array(buf16), img1Offset);
        bytes.set(new Uint8Array(buf32), img2Offset);

        return new Blob([buffer], { type: 'image/x-icon' });
    }

    function initFaviconGenerator() {
        const fileInput = document.getElementById('icon-file-input');
        const dropZone = document.getElementById('icon-dropzone');
        const previewWrap = document.getElementById('icon-previews');
        if (!fileInput || !dropZone || !previewWrap) return;

        let generatedCanvases = {};

        function renderIconSet(img) {
            previewWrap.innerHTML = '';
            previewWrap.style.display = 'block';

            // 1. Yuklanish holati ko'rsatkichi
            const loadingBox = document.createElement('div');
            loadingBox.style.cssText = 'text-align:center; padding:20px; color:var(--tools-accent); font-weight:600;';
            loadingBox.innerHTML = '⚙️ O\'lchamlar hisoblanmoqda va yuqori sifatda generatsiya qilinmoqda...';
            previewWrap.appendChild(loadingBox);

            setTimeout(async () => {
                loadingBox.remove();
                generatedCanvases = {};

                // Yuqori boshqaruv paneli (Barcha PNG lar, ICO va HTML kod)
                const controlBar = document.createElement('div');
                controlBar.style.cssText = `
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    align-items: center;
                    justify-content: space-between;
                    background: var(--card-bg);
                    border: 1px solid var(--tools-border);
                    border-radius: 14px;
                    padding: 14px 18px;
                    margin-bottom: 20px;
                `;

                controlBar.innerHTML = `
                    <div>
                        <strong style="display:block; font-size:14px;">Ikonkalar muvaffaqiyatli tayyorlandi!</strong>
                        <small style="color:var(--text-secondary);">Saytingiz va PWA ilovangiz uchun to'liq to'plam</small>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button type="button" id="btn-download-ico" class="tool-btn tool-btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
                            <span>⭐</span> <span>favicon.ico yuklab olish</span>
                        </button>
                        <button type="button" id="btn-copy-html-tags" class="tool-btn" style="display:inline-flex; align-items:center; gap:6px;">
                            <span>📋</span> <span>HTML Meta-teglarni nusxalash</span>
                        </button>
                    </div>
                `;
                previewWrap.appendChild(controlBar);

                // Grid kartochkalar konteyneri
                const grid = document.createElement('div');
                grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; margin-bottom: 24px;';
                previewWrap.appendChild(grid);

                // Har bir o'lchamni hisoblash
                for (const spec of ICON_SPECS) {
                    const canvas = document.createElement('canvas');
                    canvas.width = spec.size;
                    canvas.height = spec.size;
                    const ctx = canvas.getContext('2d');

                    // Yuqori sifatli qisqartirish
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    // O'lchamlarni proporsional joylashtirish
                    const hRatio = spec.size / img.width;
                    const vRatio = spec.size / img.height;
                    const ratio = Math.min(hRatio, vRatio);
                    const centerShiftX = (spec.size - img.width * ratio) / 2;
                    const centerShiftY = (spec.size - img.height * ratio) / 2;

                    ctx.clearRect(0, 0, spec.size, spec.size);
                    ctx.drawImage(img, 0, 0, img.width, img.height,
                        centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);

                    generatedCanvases[spec.size] = canvas;
                    const dataUrl = canvas.toDataURL('image/png');

                    // Kartochka
                    const card = document.createElement('div');
                    card.style.cssText = `
                        background: var(--card-bg);
                        border: 1px solid var(--tools-border);
                        border-radius: 12px;
                        padding: 16px 12px;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        transition: transform 0.2s, border-color 0.2s;
                    `;

                    card.innerHTML = `
                        <div style="width:72px; height:72px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; border-radius:10px; background: rgba(0,0,0,0.08); background-image: linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%); background-size: 12px 12px; background-position: 0 0, 0 6px, 6px -6px, -6px 0px; border: 1px solid var(--tools-border); overflow: hidden;">
                            <img src="${dataUrl}" style="max-width:100%; max-height:100%; image-rendering: pixelated; object-fit: contain;" alt="${spec.label}">
                        </div>
                        <div style="font-size:13px; font-weight:600; margin-bottom:3px;">${spec.label}</div>
                        <div style="font-size:11px; color:var(--text-secondary); margin-bottom:12px;">${spec.size}x${spec.size} px</div>
                        <a href="${dataUrl}" download="${spec.name}" class="tool-btn tool-btn-primary" style="font-size:11px; padding:6px 12px; text-decoration:none; width:100%; box-sizing:border-box; text-align:center;">
                            📥 PNG Yuklash
                        </a>
                    `;
                    grid.appendChild(card);
                }

                // HTML Meta teglari ko'rish bloki
                const metaSnippet = `<!-- Favicon & PWA App Icons (abdugofforov.uz) -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
<meta name="theme-color" content="#07111c">`;

                const codeBox = document.createElement('div');
                codeBox.style.cssText = `
                    background: var(--card-bg);
                    border: 1px solid var(--tools-border);
                    border-radius: 12px;
                    padding: 16px;
                `;
                codeBox.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:12px; font-weight:600; color:var(--text-secondary);">Saytingiz &lt;head&gt; qismiga qo'yish uchun HTML kodi:</span>
                        <button type="button" id="btn-copy-code-block" class="tool-btn" style="font-size:11px; padding:4px 10px;">Нусха олиш</button>
                    </div>
                    <pre style="margin:0; padding:12px; background:#07111c; border-radius:8px; border:1px solid rgba(255,255,255,0.06); font-family:monospace; font-size:12px; color:#38bdf8; overflow-x:auto; white-space:pre-wrap;">${metaSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                `;
                previewWrap.appendChild(codeBox);

                // Hodisalar: favicon.ico yuklab olish
                const btnIco = document.getElementById('btn-download-ico');
                if (btnIco) {
                    btnIco.addEventListener('click', async () => {
                        try {
                            btnIco.disabled = true;
                            btnIco.textContent = '⏳ ICO tayyorlanmoqda...';
                            const icoBlob = await generateMultiResIcoBlob(generatedCanvases[16], generatedCanvases[32]);
                            const icoUrl = URL.createObjectURL(icoBlob);
                            const a = document.createElement('a');
                            a.href = icoUrl;
                            a.download = 'favicon.ico';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            setTimeout(() => URL.revokeObjectURL(icoUrl), 2000);
                            notify('favicon.ico (16x16 + 32x32) yuklab olindi!');
                        } catch (err) {
                            console.error('ICO xatosi:', err);
                            notify('ICO yaratishda xatolik yuz berdi', '⚠️');
                        } finally {
                            btnIco.disabled = false;
                            btnIco.innerHTML = '<span>⭐</span> <span>favicon.ico yuklab olish</span>';
                        }
                    });
                }

                // Hodisalar: HTML Meta teglarni nusxalash
                const copyMetaAction = () => {
                    navigator.clipboard.writeText(metaSnippet).then(() => {
                        notify('HTML meta-teglari nusxalandi!');
                    }).catch(() => {
                        notify('Nusxalashda xatolik yuz berdi', '⚠️');
                    });
                };

                const btnCopyTags = document.getElementById('btn-copy-html-tags');
                if (btnCopyTags) btnCopyTags.addEventListener('click', copyMetaAction);

                const btnCopyCode = document.getElementById('btn-copy-code-block');
                if (btnCopyCode) btnCopyCode.addEventListener('click', copyMetaAction);

                notify("Barcha o'lchamdagi ikonkalar muvaffaqiyatli tayyorlandi!");
            }, 60);
        }

        function handleFile(file) {
            if (!file) return;
            const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
            if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpe?g|webp|svg)$/i)) {
                notify("Faqat PNG, JPG, WebP yoki SVG rasmlari qabul qilinadi", '⚠️');
                return;
            }

            dropZone.style.borderColor = 'var(--tools-accent)';
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    dropZone.style.borderColor = '';
                    renderIconSet(img);
                };
                img.onerror = () => {
                    dropZone.style.borderColor = '';
                    notify("Rasmni o'qib bo'lmadi", '⚠️');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--tools-accent)';
            dropZone.style.background = 'rgba(99, 102, 241, 0.05)';
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '';
            dropZone.style.background = '';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '';
            dropZone.style.background = '';
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
    }

    // -------------------------------------------------------------------------
    // 2. CODE SNIPPET TO IMAGE (Carbon / Ray.so High-DPI Stili) (#panel-codeshot)
    // -------------------------------------------------------------------------
    
    // Sintaktik tokenlashtiruvchi
    const KEYWORDS_JS = new Set([
        'const', 'let', 'var', 'function', 'return', 'class', 'extends', 'import', 'export',
        'from', 'as', 'default', 'async', 'await', 'if', 'else', 'for', 'while', 'do', 'switch',
        'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super',
        'typeof', 'instanceof', 'void', 'delete', 'in', 'of', 'yield'
    ]);

    const KEYWORDS_PY = new Set([
        'def', 'class', 'import', 'from', 'as', 'return', 'if', 'elif', 'else', 'for', 'while',
        'try', 'except', 'finally', 'raise', 'with', 'lambda', 'pass', 'break', 'continue',
        'yield', 'global', 'nonlocal', 'assert', 'async', 'await', 'in', 'is', 'not', 'and', 'or'
    ]);

    const KEYWORDS_SQL = new Set([
        'select', 'from', 'where', 'insert', 'into', 'update', 'delete', 'table', 'create',
        'drop', 'alter', 'join', 'left', 'right', 'inner', 'outer', 'group', 'by', 'order',
        'having', 'limit', 'offset', 'as', 'on', 'and', 'or', 'not', 'distinct'
    ]);

    function tokenizeCodeLine(line, lang = 'javascript') {
        const tokens = [];
        let i = 0;
        const len = line.length;

        // Izohlar tekshiruvi
        const trimmed = line.trimStart();
        const leadingWhitespace = line.substring(0, line.length - trimmed.length);

        if (leadingWhitespace) {
            tokens.push({ type: 'whitespace', text: leadingWhitespace });
            i += leadingWhitespace.length;
        }

        while (i < len) {
            const rest = line.substring(i);

            // 1. Bir qatorli izohlar
            if (rest.startsWith('//') || (lang === 'python' && rest.startsWith('#'))) {
                tokens.push({ type: 'comment', text: rest });
                break;
            }

            // 2. Satrlar: "", '', ``
            const strMatch = rest.match(/^("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/);
            if (strMatch) {
                tokens.push({ type: 'string', text: strMatch[0] });
                i += strMatch[0].length;
                continue;
            }

            // 3. Raqamlar: 123, 0.45, 0x1A
            const numMatch = rest.match(/^(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/);
            if (numMatch) {
                tokens.push({ type: 'number', text: numMatch[0] });
                i += numMatch[0].length;
                continue;
            }

            // 4. Funksiya chaqiruvlari yoki e'lonlari: myFunc(...)
            const fnMatch = rest.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/);
            if (fnMatch) {
                tokens.push({ type: 'function', text: fnMatch[0] });
                i += fnMatch[0].length;
                continue;
            }

            // 5. So'zlar (Kalit so'zlar, Booleans, Identifikatorlar)
            const wordMatch = rest.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
            if (wordMatch) {
                const word = wordMatch[0];
                const lower = word.toLowerCase();

                let isKw = false;
                if (lang === 'python') {
                    isKw = KEYWORDS_PY.has(word);
                } else if (lang === 'json' || lang === 'sql') {
                    isKw = KEYWORDS_SQL.has(lower);
                } else {
                    isKw = KEYWORDS_JS.has(word);
                }

                if (isKw) {
                    tokens.push({ type: 'keyword', text: word });
                } else if (['true', 'false', 'null', 'undefined', 'none', 'true', 'false'].includes(lower)) {
                    tokens.push({ type: 'boolean', text: word });
                } else {
                    tokens.push({ type: 'identifier', text: word });
                }
                i += word.length;
                continue;
            }

            // 6. Maxsus operatorlar va qavslar
            const opMatch = rest.match(/^(?:=>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~?:;,.(){}\[\]])/);
            if (opMatch) {
                tokens.push({ type: 'operator', text: opMatch[0] });
                i += opMatch[0].length;
                continue;
            }

            // 7. Boshqa harflar / bo'shliqlar
            tokens.push({ type: 'text', text: rest[0] });
            i += 1;
        }

        return tokens;
    }

    const TOKEN_COLORS = {
        keyword: '#c084fc',      // Och binafsha
        string: '#34d399',       // Zumrad yashil
        number: '#fbbf24',       // Sariq
        boolean: '#fb923c',      // Olovrang
        comment: '#64748b',      // Xira kulrang (italik)
        function: '#38bdf8',     // Moviy-firuza
        operator: '#f472b6',     // Pushti-havorang
        identifier: '#f8fafc',   // Oppoq
        text: '#f1f5f9',         // Oddiy matn
        whitespace: 'transparent'
    };

    function initCodeToImage() {
        const codeInput = document.getElementById('code-input');
        const langInput = document.getElementById('code-lang');
        const themeSelect = document.getElementById('code-bg-theme');
        const canvas = document.getElementById('code-canvas');
        const renderBtn = document.getElementById('code-render-btn');
        const dlBtn = document.getElementById('code-dl-btn');

        if (!codeInput || !canvas) return;

        let debounceTimer = null;

        function renderSnippet() {
            const code = codeInput.value || '// Kodingiz bu yerda chiqadi';
            const lang = langInput ? langInput.value : 'javascript';
            const theme = themeSelect ? themeSelect.value : 'aurora';

            const lines = code.split('\n');
            const lineHeight = 26;
            const padX = 48;
            const padY = 48;
            const headerHeight = 48;
            const fontSize = 14;
            const fontStack = '"JetBrains Mono", "Fira Code", Consolas, Menlo, monospace';

            // High-DPI Retina hisobi
            const dpr = Math.max(window.devicePixelRatio || 1, 2);

            // Eni va bo'yini aniqlash uchun vaqtinchalik o'lchash
            const dummyCanvas = document.createElement('canvas');
            const dummyCtx = dummyCanvas.getContext('2d');
            dummyCtx.font = `${fontSize}px ${fontStack}`;

            let maxCodeLineWidth = 0;
            lines.forEach(line => {
                const w = dummyCtx.measureText(line).width;
                if (w > maxCodeLineWidth) maxCodeLineWidth = w;
            });

            // Qator raqamlari kengligi (Gutter)
            const lineNumWidth = 42;
            const innerCodeWidth = Math.max(460, maxCodeLineWidth + lineNumWidth + 40);
            const innerCodeHeight = lines.length * lineHeight + headerHeight + 36;

            const logicalWidth = innerCodeWidth + padX * 2;
            const logicalHeight = innerCodeHeight + padY * 2;

            // Canvas hajmini sozlash
            canvas.width = Math.round(logicalWidth * dpr);
            canvas.height = Math.round(logicalHeight * dpr);
            canvas.style.width = `${logicalWidth}px`;
            canvas.style.height = `${logicalHeight}px`;

            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);

            // 1. Orqa fon gradienti
            const bgGrad = ctx.createLinearGradient(0, 0, logicalWidth, logicalHeight);
            if (theme === 'aurora') {
                bgGrad.addColorStop(0, '#06b6d4');
                bgGrad.addColorStop(0.5, '#3b82f6');
                bgGrad.addColorStop(1, '#8b5cf6');
            } else if (theme === 'prism') {
                bgGrad.addColorStop(0, '#ec4899');
                bgGrad.addColorStop(0.5, '#8b5cf6');
                bgGrad.addColorStop(1, '#6366f1');
            } else if (theme === 'sunset') {
                bgGrad.addColorStop(0, '#f97316');
                bgGrad.addColorStop(0.5, '#e11d48');
                bgGrad.addColorStop(1, '#7c3aed');
            } else if (theme === 'matrix') {
                bgGrad.addColorStop(0, '#052e16');
                bgGrad.addColorStop(0.5, '#10b981');
                bgGrad.addColorStop(1, '#022c22');
            } else {
                // deep slate
                bgGrad.addColorStop(0, '#0f172a');
                bgGrad.addColorStop(0.5, '#1e293b');
                bgGrad.addColorStop(1, '#334155');
            }

            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, logicalWidth, logicalHeight);

            // 2. MacOS Oynasi konteyneri
            const winX = padX;
            const winY = padY;
            const winW = innerCodeWidth;
            const winH = innerCodeHeight;
            const winRadius = 16;

            ctx.save();
            // Nafis soya
            ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
            ctx.shadowBlur = 34;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 16;

            ctx.fillStyle = '#0d1117';
            ctx.beginPath();
            ctx.roundRect(winX, winY, winW, winH, winRadius);
            ctx.fill();
            ctx.restore();

            // Oyna xoshiyasi
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(winX, winY, winW, winH, winRadius);
            ctx.stroke();

            // 3. MacOS Traffic Light tugmachalari
            const macDots = [
                { color: '#ff5f56', border: '#e0443e' },
                { color: '#ffbd2e', border: '#dea123' },
                { color: '#27c93f', border: '#1aab29' }
            ];

            macDots.forEach((dot, idx) => {
                const dotX = winX + 22 + idx * 20;
                const dotY = winY + 24;
                ctx.beginPath();
                ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
                ctx.fillStyle = dot.color;
                ctx.fill();
                ctx.strokeStyle = dot.border;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });

            // 4. Oyna sarlavhasi (Fayl nomi / Til)
            let filename = 'snippet.js';
            if (lang === 'python') filename = 'main.py';
            else if (lang === 'html') filename = 'index.html';
            else if (lang === 'json') filename = 'data.json';

            ctx.fillStyle = '#64748b';
            ctx.font = '12px "Inter", -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(filename, winX + winW / 2, winY + 24);

            // 5. Kod matnini chizish (Syntax Highlighting va Line Numbers)
            const codeStartY = winY + headerHeight + 14;

            lines.forEach((lineText, lineIdx) => {
                const currentY = codeStartY + lineIdx * lineHeight;

                // A) Qator raqami
                ctx.font = `${fontSize}px ${fontStack}`;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'alphabetic';
                ctx.fillStyle = '#475569';
                ctx.fillText(String(lineIdx + 1), winX + lineNumWidth, currentY);

                // B) Sintaksis bo'yicha tokenlar
                let tokenX = winX + lineNumWidth + 16;
                ctx.textAlign = 'left';

                const tokens = tokenizeCodeLine(lineText, lang);
                tokens.forEach(tok => {
                    if (tok.type === 'comment') {
                        ctx.font = `italic ${fontSize}px ${fontStack}`;
                    } else {
                        ctx.font = `${fontSize}px ${fontStack}`;
                    }
                    ctx.fillStyle = TOKEN_COLORS[tok.type] || TOKEN_COLORS.text;
                    ctx.fillText(tok.text, tokenX, currentY);
                    tokenX += ctx.measureText(tok.text).width;
                });
            });

            // 6. Watermark (Pastki o'ng burchak)
            ctx.font = '11px "Inter", sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.textAlign = 'right';
            ctx.fillText('⚡ abdugofforov.uz', winX + winW - 18, winY + winH - 14);

            // Yuklab olish tugmasini ko'rsatish
            if (dlBtn) dlBtn.style.display = 'inline-flex';
        }

        function triggerDebouncedRender() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(renderSnippet, 150);
        }

        // Hodisalar
        codeInput.addEventListener('input', triggerDebouncedRender);
        if (langInput) langInput.addEventListener('change', renderSnippet);
        if (themeSelect) themeSelect.addEventListener('change', renderSnippet);
        if (renderBtn) renderBtn.addEventListener('click', renderSnippet);

        if (dlBtn) {
            dlBtn.addEventListener('click', () => {
                try {
                    const dataUrl = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = dataUrl;
                    a.download = 'code-snippet.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    notify("High-DPI rasm muvaffaqiyatli yuklab olindi!");
                } catch (err) {
                    console.error('Yuklab olish xatosi:', err);
                    notify("Rasmni yuklab olishda xatolik yuz berdi", '⚠️');
                }
            });
        }

        // Boshlang'ich render
        renderSnippet();
    }


    // -------------------------------------------------------------------------
    // BOSHLANG'ICH INITIALIZATSIYA
    // -------------------------------------------------------------------------
    function initAll() {
        initFaviconGenerator();
        initCodeToImage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // Global eksport
    window.ToolsMediaSuite = {
        init: initAll,
        initFaviconGenerator,
        initCodeToImage,
        generateMultiResIcoBlob
    };

})();
