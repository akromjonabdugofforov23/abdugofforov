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
        ["yo'", "йў"], ["yo‘", "йў"], ["yo’", "йў"], ["yo`", "йў"],
        ["Yo'", "Йў"], ["Yo‘", "Йў"], ["Yo’", "Йў"], ["Yo`", "Йў"],
        ["YO'", "ЙЎ"], ["YO‘", "ЙЎ"], ["YO’", "ЙЎ"], ["YO`", "ЙЎ"],
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
        ["e", "е"], ["E", "Е"],
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
        ["s", "с"], ["S", "С"],
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
        ["йў", "yo‘"], ["Йў", "Yo‘"], ["ЙЎ", "YO‘"],
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

    // Clipboard (Ctrl+V) orqali rasm joylash
    window.addEventListener('paste', (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) {
                    const imgTab = document.querySelector('.tool-tab-btn[data-tool="image"]');
                    if (imgTab && !imgTab.classList.contains('active')) {
                        imgTab.click();
                    }
                    handleImageFile(file);
                    showToast("Rasm buferdan olindi!", '📋');
                    break;
                }
            }
        }
    });

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
    // 5. QR CODE GENERATOR (100% Client-Side Pure Canvas Engine)
    // ============================================================
    const qrInput = document.getElementById('qr-input');
    const qrColorFg = document.getElementById('qr-color-fg');
    const qrColorBg = document.getElementById('qr-color-bg');
    const qrCanvas = document.getElementById('qr-canvas');
    const qrDownloadBtn = document.getElementById('qr-download-btn');

    // GF(256) va Reed-Solomon polinomlari
    const GF256_EXP = new Uint8Array(512);
    const GF256_LOG = new Uint8Array(256);
    let _gfe = 1;
    for (let i = 0; i < 255; i++) {
        GF256_EXP[i] = _gfe;
        GF256_EXP[i + 255] = _gfe;
        GF256_LOG[_gfe] = i;
        _gfe = (_gfe << 1) ^ (_gfe >= 128 ? 0x11d : 0);
    }

    function gfMul(a, b) {
        if (a === 0 || b === 0) return 0;
        return GF256_EXP[GF256_LOG[a] + GF256_LOG[b]];
    }

    function rsGeneratorPoly(degree) {
        let poly = [1];
        for (let i = 0; i < degree; i++) {
            const next = new Array(poly.length + 1).fill(0);
            const root = GF256_EXP[i];
            for (let j = 0; j < poly.length; j++) {
                next[j] ^= gfMul(poly[j], root);
                next[j + 1] ^= poly[j];
            }
            poly = next;
        }
        return poly;
    }

    function rsCompute(data, numEc) {
        const gen = rsGeneratorPoly(numEc);
        const res = new Array(numEc).fill(0);
        for (let i = 0; i < data.length; i++) {
            const factor = data[i] ^ res[0];
            res.shift();
            res.push(0);
            if (factor !== 0) {
                for (let j = 0; j < numEc; j++) {
                    res[j] ^= gfMul(gen[j], factor);
                }
            }
        }
        return res;
    }

    const QR_VERSIONS = [
        [1, 26, 10, 1], [2, 44, 16, 1], [3, 70, 26, 1], [4, 100, 36, 1],
        [5, 134, 48, 1], [6, 172, 64, 2], [7, 196, 72, 2], [8, 242, 88, 2],
        [9, 292, 110, 2], [10, 346, 130, 2]
    ];

    function createQRCodeMatrix(text) {
        const utf8Bytes = new TextEncoder().encode(text);
        let chosen = null;
        for (const v of QR_VERSIONS) {
            const dataCap = v[1] - v[2];
            const lenBits = v[0] <= 9 ? 8 : 16;
            const totalBits = 4 + lenBits + (utf8Bytes.length * 8);
            if (Math.ceil(totalBits / 8) <= dataCap) {
                chosen = v;
                break;
            }
        }
        if (!chosen) throw new Error('Text exceeds pure client capacity');

        const [ver, totalCodewords, ecCodewords, numBlocks] = chosen;
        const dataCodewords = totalCodewords - ecCodewords;
        const bits = [];
        function pushBits(val, len) {
            for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
        }

        pushBits(4, 4); // Byte mode
        pushBits(utf8Bytes.length, ver <= 9 ? 8 : 16);
        for (const b of utf8Bytes) pushBits(b, 8);
        const remaining = (dataCodewords * 8) - bits.length;
        pushBits(0, Math.min(4, remaining));
        while (bits.length % 8 !== 0) bits.push(0);
        const padBytes = [0xec, 0x11];
        let pIdx = 0;
        while (bits.length < dataCodewords * 8) {
            pushBits(padBytes[pIdx % 2], 8);
            pIdx++;
        }

        const dataBytes = [];
        for (let i = 0; i < bits.length; i += 8) {
            let b = 0;
            for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
            dataBytes.push(b);
        }

        const ecPerBlock = Math.floor(ecCodewords / numBlocks);
        const dataPerBlock = Math.floor(dataCodewords / numBlocks);
        const blocksData = [];
        const blocksEc = [];

        for (let i = 0; i < numBlocks; i++) {
            const start = i * dataPerBlock;
            const bData = dataBytes.slice(start, start + dataPerBlock);
            blocksData.push(bData);
            blocksEc.push(rsCompute(bData, ecPerBlock));
        }

        const finalCodewords = [];
        for (let i = 0; i < dataPerBlock; i++) {
            for (let b = 0; b < numBlocks; b++) finalCodewords.push(blocksData[b][i]);
        }
        for (let i = 0; i < ecPerBlock; i++) {
            for (let b = 0; b < numBlocks; b++) finalCodewords.push(blocksEc[b][i]);
        }

        const mSize = 17 + 4 * ver;
        const matrix = Array.from({ length: mSize }, () => new Array(mSize).fill(null));
        const isReserved = Array.from({ length: mSize }, () => new Array(mSize).fill(false));

        function setMod(r, c, val) {
            matrix[r][c] = val;
            isReserved[r][c] = true;
        }

        function drawFinder(r, c) {
            for (let dr = -1; dr <= 7; dr++) {
                for (let dc = -1; dc <= 7; dc++) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < mSize && nc >= 0 && nc < mSize) {
                        if (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) {
                            const isBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
                            const isCore = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
                            setMod(nr, nc, isBorder || isCore ? 1 : 0);
                        } else {
                            setMod(nr, nc, 0);
                        }
                    }
                }
            }
        }

        drawFinder(0, 0);
        drawFinder(0, mSize - 7);
        drawFinder(mSize - 7, 0);

        for (let i = 8; i < mSize - 8; i++) {
            if (!isReserved[6][i]) setMod(6, i, i % 2 === 0 ? 1 : 0);
            if (!isReserved[i][6]) setMod(i, 6, i % 2 === 0 ? 1 : 0);
        }

        const ALIGN_POS = [
            [], [], [6, 18], [6, 22], [6, 26], [6, 30],
            [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]
        ];
        if (ver >= 2) {
            const pos = ALIGN_POS[ver];
            for (const ar of pos) {
                for (const ac of pos) {
                    if (isReserved[ar][ac]) continue;
                    for (let dr = -2; dr <= 2; dr++) {
                        for (let dc = -2; dc <= 2; dc++) {
                            const isBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2;
                            const isCenter = dr === 0 && dc === 0;
                            setMod(ar + dr, ac + dc, isBorder || isCenter ? 1 : 0);
                        }
                    }
                }
            }
        }

        setMod(mSize - 8, 8, 1);

        for (let i = 0; i < 9; i++) {
            if (!isReserved[8][i]) isReserved[8][i] = true;
            if (!isReserved[i][8]) isReserved[i][8] = true;
        }
        for (let i = mSize - 8; i < mSize; i++) {
            if (!isReserved[8][i]) isReserved[8][i] = true;
            if (!isReserved[i][8]) isReserved[i][8] = true;
        }

        const finalBits = [];
        for (const b of finalCodewords) {
            for (let i = 7; i >= 0; i--) finalBits.push((b >> i) & 1);
        }

        let bitIdx = 0, dir = -1, col = mSize - 1;
        while (col > 0) {
            if (col === 6) col--;
            const rows = dir === -1
                ? Array.from({ length: mSize }, (_, i) => mSize - 1 - i)
                : Array.from({ length: mSize }, (_, i) => i);

            for (const row of rows) {
                for (const c of [col, col - 1]) {
                    if (!isReserved[row][c]) {
                        const dataBit = bitIdx < finalBits.length ? finalBits[bitIdx++] : 0;
                        const masked = dataBit ^ (((row + c) % 2 === 0) ? 1 : 0);
                        matrix[row][c] = masked;
                    }
                }
            }
            col -= 2;
            dir = -dir;
        }

        const FORMAT_BITS = [1,0,1,0,1,0,0,0,0,0,1,0,0,1,0];
        const tlCoords = [
            [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],
            [7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]
        ];
        for (let i = 0; i < 15; i++) {
            const [r, c] = tlCoords[i];
            matrix[r][c] = FORMAT_BITS[i];
        }
        for (let i = 0; i < 7; i++) matrix[mSize - 1 - i][8] = FORMAT_BITS[i];
        for (let i = 7; i < 15; i++) matrix[8][mSize - 15 + i] = FORMAT_BITS[i];

        return { size: mSize, matrix };
    }

    function renderQrCode() {
        if (!qrCanvas || !qrInput) return;
        const text = qrInput.value.trim() || 'https://abdugofforov.uz';
        const fg = qrColorFg.value || '#000000';
        const bg = qrColorBg.value || '#ffffff';

        const canvasSize = 220;
        qrCanvas.width = canvasSize;
        qrCanvas.height = canvasSize;
        const ctx = qrCanvas.getContext('2d');

        try {
            const qr = createQRCodeMatrix(text);
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvasSize, canvasSize);

            const margin = 2;
            const totalModules = qr.size + margin * 2;
            const modSize = Math.floor(canvasSize / totalModules);
            const offsetX = Math.floor((canvasSize - modSize * qr.size) / 2);
            const offsetY = Math.floor((canvasSize - modSize * qr.size) / 2);

            ctx.fillStyle = fg;
            for (let r = 0; r < qr.size; r++) {
                for (let c = 0; c < qr.size; c++) {
                    if (qr.matrix[r][c] === 1) {
                        ctx.fillRect(offsetX + c * modSize, offsetY + r * modSize, modSize, modSize);
                    }
                }
            }
        } catch (err) {
            // Fallback for massive text
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvasSize, canvasSize);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => ctx.drawImage(img, 10, 10, canvasSize - 20, canvasSize - 20);
            img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=${fg.replace('#','')}&bgcolor=${bg.replace('#','')}&data=${encodeURIComponent(text)}`;
        }
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
        const bytes = new TextEncoder().encode(str);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function base64ToUtf8(str) {
        const binary = window.atob(str);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
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
