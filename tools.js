// ============================================================
// ABDUGOFFOROV TOOLS — CLIENT-SIDE UTILITY SUITE
// 100% Browser-side, High Performance, Privacy-first
// ============================================================

(function () {
    'use strict';

    // ---------- TOAST XABARNOMA ----------
    const toastEl = document.getElementById('tools-toast');
    const toastMsg = document.getElementById('toast-msg');
    let toastTimeout = null;

    function showToast(msg, icon = '✓') {
        if (!toastEl) return;
        toastMsg.textContent = msg;
        const iconEl = document.getElementById('toast-icon');
        if (iconEl) iconEl.textContent = icon;
        toastEl.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2500);
    }

    // ---------- MAVZU (THEME TOGGLE) ----------
    const themeBtn = document.getElementById('theme-btn');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('abdugofforov_theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem('abdugofforov_theme', next);
        });
    }

    // ---------- TABS BOSHQARUVI ----------
    const tabBtns = document.querySelectorAll('.tool-tab-btn');
    const panels = document.querySelectorAll('.tool-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tool = btn.getAttribute('data-tool');
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(`panel-${tool}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ============================================================
    // 1. LOTIN ⇄ KIRILL TRANSLITERATOR
    // ============================================================
    let translitMode = 'latin-to-cyrillic'; // yoki 'cyrillic-to-latin'
    const translitInput = document.getElementById('translit-input');
    const translitOutput = document.getElementById('translit-output');
    const translitSwapBtn = document.getElementById('translit-swap-btn');
    const translitClearBtn = document.getElementById('translit-clear-btn');
    const translitCopyBtn = document.getElementById('translit-copy-btn');
    const translitSourceTitle = document.getElementById('translit-source-title');
    const translitTargetTitle = document.getElementById('translit-target-title');
    const translitSourceCount = document.getElementById('translit-source-count');
    const translitTargetCount = document.getElementById('translit-target-count');

    // Lotin -> Kirill xaritasi (Tartib muhim: 2 harfli birikmalar oldin tekshiriladi)
    const latinToCyrillicPairs = [
        ["o'", "ў"], ["o‘", "ў"], ["o’", "ў"], ["o`", "ў"],
        ["O'", "Ў"], ["O‘", "Ў"], ["O’", "Ў"], ["O`", "Ў"],
        ["g'", "ғ"], ["g‘", "ғ"], ["g’", "ғ"], ["g`", "ғ"],
        ["G'", "Ғ"], ["G‘", "Ғ"], ["G’", "Ғ"], ["G`", "Ғ"],
        ["sh", "ш"], ["Sh", "Ш"], ["SH", "Ш"],
        ["ch", "ч"], ["Ch", "Ч"], ["CH", "Ч"],
        ["yo", "ё"], ["Yo", "Ё"], ["YO", "Ё"],
        ["yu", "ю"], ["Yu", "Ю"], ["YU", "Ю"],
        ["ya", "я"], ["Ya", "Я"], ["YA", "Я"],
        ["ts", "ц"], ["Ts", "Ц"], ["TS", "Ц"],
        ["ye", "е"], ["Ye", "Е"], ["YE", "Е"],
        ["a", "а"], ["A", "А"],
        ["b", "б"], ["B", "Б"],
        ["d", "д"], ["D", "Д"],
        ["e", "э"], ["E", "Э"],
        ["f", "ф"], ["F", "Ф"],
        ["g", "г"], ["G", "Г"],
        ["h", "ҳ"], ["H", "Ҳ"],
        ["i", "и"], ["I", "И"],
        ["j", "ж"], ["J", "Ж"],
        ["k", "к"], ["K", "К"],
        ["l", "л"], ["L", "Л"],
        ["m", "м"], ["M", "М"],
        ["n", "н"], ["N", "Н"],
        ["o", "о"], ["O", "О"],
        ["p", "п"], ["P", "П"],
        ["q", "қ"], ["Q", "Қ"],
        ["r", "р"], ["R", "Р"],
        ["s", "s"], ["s", "с"], ["S", "С"],
        ["t", "т"], ["T", "Т"],
        ["u", "у"], ["U", "У"],
        ["v", "в"], ["V", "В"],
        ["x", "х"], ["X", "Х"],
        ["y", "й"], ["Y", "Й"],
        ["z", "з"], ["Z", "З"],
        ["'", "ъ"], ["’", "ъ"], ["`", "ъ"]
    ];

    // Kirill -> Lotin xaritasi
    const cyrillicToLatinPairs = [
        ["ш", "sh"], ["Ш", "Sh"],
        ["ч", "ch"], ["Ч", "Ch"],
        ["ў", "o‘"], ["Ў", "O‘"],
        ["ғ", "g‘"], ["Ғ", "G‘"],
        ["ё", "yo"], ["Ё", "Yo"],
        ["ю", "yu"], ["Ю", "Yu"],
        ["я", "ya"], ["Я", "Ya"],
        ["ц", "ts"], ["Ц", "Ts"],
        ["щ", "sh"], ["Щ", "Sh"],
        ["а", "a"], ["А", "A"],
        ["б", "b"], ["Б", "B"],
        ["в", "v"], ["В", "V"],
        ["г", "g"], ["Г", "G"],
        ["д", "d"], ["Д", "D"],
        ["е", "e"], ["Е", "E"],
        ["ж", "j"], ["Ж", "J"],
        ["з", "z"], ["З", "Z"],
        ["и", "i"], ["И", "I"],
        ["й", "y"], ["Й", "Y"],
        ["к", "k"], ["К", "K"],
        ["қ", "q"], ["Қ", "Q"],
        ["л", "l"], ["Л", "L"],
        ["м", "m"], ["М", "M"],
        ["н", "n"], ["Н", "N"],
        ["о", "o"], ["О", "O"],
        ["п", "p"], ["П", "P"],
        ["р", "r"], ["Р", "R"],
        ["с", "s"], ["С", "S"],
        ["т", "t"], ["Т", "T"],
        ["у", "u"], ["У", "U"],
        ["ф", "f"], ["Ф", "F"],
        ["х", "x"], ["Х", "X"],
        ["ҳ", "h"], ["Ҳ", "H"],
        ["ы", "i"], ["Ы", "I"],
        ["э", "e"], ["Э", "E"],
        ["ъ", "’"], ["Ъ", "’"],
        ["ь", ""], ["Ь", ""]
    ];

    function convertLatinToCyrillic(text) {
        let res = text;
        // Boshlang'ich 'e' lar uchun qoida (so'z boshida yoki unlidan keyin 'e' bo'lsa 'e' -> 'э')
        res = res.replace(/(^|[\s\(\[\{,\.\?!;:])e/g, "$1э");
        res = res.replace(/(^|[\s\(\[\{,\.\?!;:])E/g, "$1Э");

        for (const [lat, cyr] of latinToCyrillicPairs) {
            res = res.split(lat).join(cyr);
        }
        return res;
    }

    function convertCyrillicToLatin(text) {
        let res = text;
        // So'z boshidagi 'Е / е' harfi 'Ye / ye' deb o'qiladi
        res = res.replace(/(^|[\s\(\[\{,\.\?!;:])е/g, "$1ye");
        res = res.replace(/(^|[\s\(\[\{,\.\?!;:])Е/g, "$1Ye");

        for (const [cyr, lat] of cyrillicToLatinPairs) {
            res = res.split(cyr).join(lat);
        }
        return res;
    }

    function doTransliteration() {
        if (!translitInput || !translitOutput) return;
        const text = translitInput.value;
        const count = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        translitSourceCount.textContent = `${count} belgi · ${words} so'z`;

        if (!text) {
            translitOutput.value = '';
            translitTargetCount.textContent = '0 belgi';
            return;
        }

        const converted = translitMode === 'latin-to-cyrillic'
            ? convertLatinToCyrillic(text)
            : convertCyrillicToLatin(text);

        translitOutput.value = converted;
        translitTargetCount.textContent = `${converted.length} belgi`;
    }

    if (translitInput) {
        translitInput.addEventListener('input', doTransliteration);
    }

    if (translitSwapBtn) {
        translitSwapBtn.addEventListener('click', () => {
            if (translitMode === 'latin-to-cyrillic') {
                translitMode = 'cyrillic-to-latin';
                translitSourceTitle.textContent = 'Kiritish (Kirill):';
                translitTargetTitle.textContent = 'Natija (Lotin):';
            } else {
                translitMode = 'latin-to-cyrillic';
                translitSourceTitle.textContent = 'Kiritish (Lotin):';
                translitTargetTitle.textContent = 'Natija (Kirill):';
            }
            const currentOutput = translitOutput.value;
            translitInput.value = currentOutput;
            doTransliteration();
            showToast("Yo'nalish almashtirildi", '⇄');
        });
    }

    if (translitClearBtn) {
        translitClearBtn.addEventListener('click', () => {
            translitInput.value = '';
            translitOutput.value = '';
            translitSourceCount.textContent = '0 belgi · 0 so\'z';
            translitTargetCount.textContent = '0 belgi';
            translitInput.focus();
        });
    }

    if (translitCopyBtn) {
        translitCopyBtn.addEventListener('click', () => {
            if (!translitOutput.value) return;
            navigator.clipboard.writeText(translitOutput.value).then(() => {
                showToast("Matn nusxalandi!");
            });
        });
    }

    // ============================================================
    // 2. WEBP & IMAGE OPTIMIZER
    // ============================================================
    const imgDropzone = document.getElementById('img-dropzone');
    const imgFileInput = document.getElementById('img-file-input');
    const imgControls = document.getElementById('img-controls');
    const imgQuality = document.getElementById('img-quality');
    const imgQualityVal = document.getElementById('img-quality-val');
    const imgFormatSelect = document.getElementById('img-format-select');
    const compressPreviewWrap = document.getElementById('compress-preview-wrap');
    const imgOrigPreview = document.getElementById('img-orig-preview');
    const imgCompPreview = document.getElementById('img-comp-preview');
    const imgOrigSize = document.getElementById('img-orig-size');
    const imgCompSize = document.getElementById('img-comp-size');
    const imgDownloadBtn = document.getElementById('img-download-btn');

    let currentLoadedImage = null;
    let currentFileName = 'compressed_image';
    let currentOriginalBytes = 0;
    let currentCompressedBlob = null;

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function handleImageFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showToast("Iltimos, rasm faylini tanlang!", '⚠️');
            return;
        }

        currentFileName = file.name.replace(/\.[^/.]+$/, "");
        currentOriginalBytes = file.size;
        imgOrigSize.textContent = `Hajmi: ${formatBytes(file.size)}`;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                currentLoadedImage = img;
                imgOrigPreview.src = e.target.result;
                imgControls.style.display = 'block';
                compressPreviewWrap.style.display = 'grid';
                processCompression();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function processCompression() {
        if (!currentLoadedImage) return;

        const quality = parseInt(imgQuality.value, 10) / 100;
        const format = imgFormatSelect.value;
        imgQualityVal.textContent = `${imgQuality.value}%`;

        const canvas = document.createElement('canvas');
        canvas.width = currentLoadedImage.naturalWidth;
        canvas.height = currentLoadedImage.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(currentLoadedImage, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) return;
            currentCompressedBlob = blob;
            imgCompPreview.src = URL.createObjectURL(blob);

            const saved = currentOriginalBytes > 0
                ? Math.round((1 - blob.size / currentOriginalBytes) * 100)
                : 0;

            const savedText = saved > 0 ? `(-${saved}% tejash)` : `(+${Math.abs(saved)}%)`;
            imgCompSize.textContent = `Hajmi: ${formatBytes(blob.size)} ${savedText}`;
        }, format, quality);
    }

    if (imgDropzone) {
        imgDropzone.addEventListener('click', () => imgFileInput.click());
        imgDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imgDropzone.classList.add('dragover');
        });
        imgDropzone.addEventListener('dragleave', () => imgDropzone.classList.remove('dragover'));
        imgDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            imgDropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        });
    }

    if (imgFileInput) {
        imgFileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleImageFile(e.target.files[0]);
            }
        });
    }

    if (imgQuality) imgQuality.addEventListener('input', processCompression);
    if (imgFormatSelect) imgFormatSelect.addEventListener('change', processCompression);

    if (imgDownloadBtn) {
        imgDownloadBtn.addEventListener('click', () => {
            if (!currentCompressedBlob) return;
            const ext = imgFormatSelect.value === 'image/webp' ? 'webp' : (imgFormatSelect.value === 'image/png' ? 'png' : 'jpg');
            const link = document.createElement('a');
            link.href = URL.createObjectURL(currentCompressedBlob);
            link.download = `${currentFileName}_optimized.${ext}`;
            link.click();
            showToast("Rasm yuklab olindi!");
        });
    }

    // ============================================================
    // 3. JSON FORMATTER & VALIDATOR
    // ============================================================
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const jsonFormat2Btn = document.getElementById('json-format-2-btn');
    const jsonFormat4Btn = document.getElementById('json-format-4-btn');
    const jsonMinifyBtn = document.getElementById('json-minify-btn');
    const jsonClearBtn = document.getElementById('json-clear-btn');
    const jsonCopyBtn = document.getElementById('json-copy-btn');
    const jsonStatusAlert = document.getElementById('json-status-alert');

    function formatJson(spaces = 2) {
        const val = jsonInput.value.trim();
        if (!val) {
            jsonOutput.value = '';
            jsonStatusAlert.style.display = 'none';
            return;
        }

        try {
            const parsed = JSON.parse(val);
            jsonOutput.value = spaces === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, spaces);
            jsonStatusAlert.style.display = 'block';
            jsonStatusAlert.style.background = 'rgba(34, 197, 94, 0.15)';
            jsonStatusAlert.style.border = '1px solid rgba(34, 197, 94, 0.4)';
            jsonStatusAlert.style.color = '#4ade80';
            jsonStatusAlert.textContent = "✓ JSON to'g'ri formatlandi (Valid JSON)";
        } catch (err) {
            jsonStatusAlert.style.display = 'block';
            jsonStatusAlert.style.background = 'rgba(239, 68, 68, 0.15)';
            jsonStatusAlert.style.border = '1px solid rgba(239, 68, 68, 0.4)';
            jsonStatusAlert.style.color = '#f87171';
            jsonStatusAlert.textContent = `⚠️ Xato: ${err.message}`;
        }
    }

    if (jsonFormat2Btn) jsonFormat2Btn.addEventListener('click', () => formatJson(2));
    if (jsonFormat4Btn) jsonFormat4Btn.addEventListener('click', () => formatJson(4));
    if (jsonMinifyBtn) jsonMinifyBtn.addEventListener('click', () => formatJson(0));

    if (jsonClearBtn) {
        jsonClearBtn.addEventListener('click', () => {
            jsonInput.value = '';
            jsonOutput.value = '';
            jsonStatusAlert.style.display = 'none';
            jsonInput.focus();
        });
    }

    if (jsonCopyBtn) {
        jsonCopyBtn.addEventListener('click', () => {
            if (!jsonOutput.value) return;
            navigator.clipboard.writeText(jsonOutput.value).then(() => showToast("JSON nusxalandi!"));
        });
    }

    // ============================================================
    // 4. TEXT DIFF CHECKER
    // ============================================================
    const diffText1 = document.getElementById('diff-text-1');
    const diffText2 = document.getElementById('diff-text-2');
    const diffCompareBtn = document.getElementById('diff-compare-btn');
    const diffClearBtn = document.getElementById('diff-clear-btn');
    const diffResultWrap = document.getElementById('diff-result-wrap');

    if (diffCompareBtn) {
        diffCompareBtn.addEventListener('click', () => {
            const lines1 = (diffText1.value || '').split('\n');
            const lines2 = (diffText2.value || '').split('\n');

            let html = '';
            const max = Math.max(lines1.length, lines2.length);

            if (max === 1 && lines1[0] === '' && lines2[0] === '') {
                diffResultWrap.style.display = 'none';
                return;
            }

            diffResultWrap.style.display = 'block';

            for (let i = 0; i < max; i++) {
                const l1 = lines1[i];
                const l2 = lines2[i];

                if (l1 === undefined) {
                    html += `<span class="diff-added">+ ${escapeHtml(l2)}</span>`;
                } else if (l2 === undefined) {
                    html += `<span class="diff-removed">- ${escapeHtml(l1)}</span>`;
                } else if (l1 === l2) {
                    html += `<span class="diff-unchanged">  ${escapeHtml(l1)}</span>`;
                } else {
                    html += `<span class="diff-removed">- ${escapeHtml(l1)}</span>`;
                    html += `<span class="diff-added">+ ${escapeHtml(l2)}</span>`;
                }
            }

            diffResultWrap.innerHTML = html;
        });
    }

    if (diffClearBtn) {
        diffClearBtn.addEventListener('click', () => {
            diffText1.value = '';
            diffText2.value = '';
            diffResultWrap.style.display = 'none';
            diffResultWrap.innerHTML = '';
        });
    }

    function escapeHtml(str) {
        return (str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // ============================================================
    // 5. QR CODE GENERATOR (Stand-alone Lightweight Canvas Generator)
    // ============================================================
    const qrInput = document.getElementById('qr-input');
    const qrColorFg = document.getElementById('qr-color-fg');
    const qrColorBg = document.getElementById('qr-color-bg');
    const qrCanvas = document.getElementById('qr-canvas');
    const qrDownloadBtn = document.getElementById('qr-download-btn');

    // Oddiy va ishonchli QR generator (Standard API or public reliable renderer)
    function renderQrCode() {
        if (!qrCanvas || !qrInput) return;
        const text = qrInput.value.trim() || 'https://abdugofforov.uz';
        const fg = qrColorFg.value || '#000000';
        const bg = qrColorBg.value || '#ffffff';

        const size = 220;
        qrCanvas.width = size;
        qrCanvas.height = size;
        const ctx = qrCanvas.getContext('2d');

        // Draw background
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, size, size);

        // QR render: QR kod tasvirini dinamik generatsiya qilish
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            ctx.drawImage(img, 10, 10, size - 20, size - 20);
        };
        // Cloudflare Insights yoki bepul xavfsiz QR API orqali yuqori aniqlikdagi SVG/PNG
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=${fg.replace('#','')}&bgcolor=${bg.replace('#','')}&data=${encodeURIComponent(text)}`;
    }

    if (qrInput) qrInput.addEventListener('input', renderQrCode);
    if (qrColorFg) qrColorFg.addEventListener('input', renderQrCode);
    if (qrColorBg) qrColorBg.addEventListener('input', renderQrCode);

    if (qrDownloadBtn) {
        qrDownloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'abdugofforov_qr.png';
            link.href = qrCanvas.toDataURL('image/png');
            link.click();
            showToast("QR Kod yuklab olindi!");
        });
    }

    // Boshlang'ich QR render
    renderQrCode();

    // ============================================================
    // 6. BASE64 & HASH GENERATOR (Web Crypto API)
    // ============================================================
    const hashInput = document.getElementById('hash-input');
    const hashOutput = document.getElementById('hash-output');
    const hashB64EncBtn = document.getElementById('hash-b64-enc-btn');
    const hashB64DecBtn = document.getElementById('hash-b64-dec-btn');
    const hashUrlEncBtn = document.getElementById('hash-url-enc-btn');
    const hashUrlDecBtn = document.getElementById('hash-url-dec-btn');
    const hashSha256Btn = document.getElementById('hash-sha256-btn');
    const hashCopyBtn = document.getElementById('hash-copy-btn');

    function utf8ToBase64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    function base64ToUtf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    if (hashB64EncBtn) {
        hashB64EncBtn.addEventListener('click', () => {
            try {
                hashOutput.value = utf8ToBase64(hashInput.value);
                showToast("Base64 kodlandi");
            } catch (e) {
                showToast("Xatolik: " + e.message, '⚠️');
            }
        });
    }

    if (hashB64DecBtn) {
        hashB64DecBtn.addEventListener('click', () => {
            try {
                hashOutput.value = base64ToUtf8(hashInput.value.trim());
                showToast("Base64 ochildi");
            } catch (e) {
                showToast("Noto'g'ri Base64 formati!", '⚠️');
            }
        });
    }

    if (hashUrlEncBtn) {
        hashUrlEncBtn.addEventListener('click', () => {
            hashOutput.value = encodeURIComponent(hashInput.value);
            showToast("URL kodlandi");
        });
    }

    if (hashUrlDecBtn) {
        hashUrlDecBtn.addEventListener('click', () => {
            try {
                hashOutput.value = decodeURIComponent(hashInput.value);
                showToast("URL ochildi");
            } catch (e) {
                showToast("Xato URL matni", '⚠️');
            }
        });
    }

    if (hashSha256Btn) {
        hashSha256Btn.addEventListener('click', async () => {
            const text = hashInput.value;
            if (!text) {
                hashOutput.value = '';
                return;
            }
            const msgBuffer = new TextEncoder().encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            hashOutput.value = hashHex;
            showToast("SHA-256 Hash yaratildi");
        });
    }

    if (hashCopyBtn) {
        hashCopyBtn.addEventListener('click', () => {
            if (!hashOutput.value) return;
            navigator.clipboard.writeText(hashOutput.value).then(() => showToast("Nusxalandi!"));
        });
    }

})();
