// ============================================================
// ⌘K SUPER-TERMINAL (Raycast & Spotlight Uslubidagi Buyruqlar Markazi)
// Fayl: scripts/super-palette.js — Modulli mustaqil tizim
// ============================================================
(function() {
    'use strict';

    let isOpen = false;
    let selectedIndex = 0;
    let currentResults = [];
    let modalEl = null;
    let inputEl = null;
    let resultsEl = null;
    let hintEl = null;

    // Yordamchi HTML tozalagich
    function safeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Nusxalash
    async function copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (_) {}
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Talaffuz (Nemis tili de-DE)
    function speakGerman(text) {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(text);
            utt.lang = 'de-DE';
            utt.rate = 0.9;
            window.speechSynthesis.speak(utt);
        } catch (_) {}
    }

    // Xavfsiz Matematik Hisoblagich (Eval siz)
    function safeCalculate(expr) {
        if (!expr) return null;
        let clean = expr.trim()
            .replace(/pi\b/gi, String(Math.PI))
            .replace(/e\b/gi, String(Math.E))
            .replace(/\^/g, '**');

        // Faqat ruxsat etilgan belgilar: raqamlar, probel, nuqta, qavs, operatorlar
        if (!/^[0-9+\-*/%.()*\s]+$/.test(clean)) {
            return null;
        }

        try {
            // Function orqali xavfsiz hisoblash
            const res = Function('"use strict"; return (' + clean + ')')();
            if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
                return Number(res.toFixed(6));
            }
            return null;
        } catch (_) {
            return null;
        }
    }

    // Base64 Konverter
    function handleBase64(text) {
        if (!text) return null;
        try {
            const encoded = btoa(unescape(encodeURIComponent(text)));
            return { type: 'encode', value: encoded };
        } catch (_) {
            return null;
        }
    }

    // SHA-256 Hash Hisoblagich
    async function handleSha256(text) {
        if (!text || !window.crypto || !window.crypto.subtle) return null;
        try {
            const enc = new TextEncoder();
            const buf = await window.crypto.subtle.digest('SHA-256', enc.encode(text));
            const arr = Array.from(new Uint8Array(buf));
            return arr.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (_) {
            return null;
        }
    }

    // Nemis tili lug'at qidiruvi (Verbs + Curriculum)
    function lookupGermanWord(query) {
        if (!query) return [];
        const q = query.trim().toLowerCase();
        const results = [];

        // 1. Fe'llar bazasidan qidiruv
        const verbsDb = window.GERMAN_VERBS_DB || [];
        for (let i = 0; i < verbsDb.length; i++) {
            const v = verbsDb[i];
            const inf = (v.infinitive || '').toLowerCase();
            const tr = (v.translation || '').toLowerCase();
            if (inf.startsWith(q) || inf === q || tr.includes(q)) {
                results.push({
                    title: `${v.infinitive} (${v.translation})`,
                    subtitle: `Turi: ${v.type || 'fe\'l'} · Zamonlar: ${v.praesens ? (v.praesens.ich + ' / ' + v.praesens.du) : ''} · Perfekt: ${v.perfekt?.full || ''}`,
                    badge: `🇩🇪 ${v.level || 'A1'} Fe'l`,
                    action: () => speakGerman(v.infinitive),
                    copyText: `${v.infinitive} - ${v.translation} (Perfekt: ${v.perfekt?.full || ''})`,
                    speakText: v.infinitive
                });
                if (results.length >= 6) break;
            }
        }

        // 2. O'quv dasturi (Curriculum A1-B2)
        const curr = window.deutschCurriculum || {};
        Object.keys(curr).forEach(lvl => {
            const topics = curr[lvl]?.topics || [];
            topics.forEach(t => {
                const fcs = t.flashcards || [];
                fcs.forEach(fc => {
                    const front = (fc.front || '').toLowerCase();
                    const back = (fc.back || '').toLowerCase();
                    if (front.includes(q) || back.includes(q)) {
                        results.push({
                            title: `${fc.front} — ${fc.back}`,
                            subtitle: `${fc.tip || 'Mavzu: ' + t.title} (${lvl})`,
                            badge: `🎴 ${lvl} So'z`,
                            action: () => speakGerman(fc.front),
                            copyText: `${fc.front} - ${fc.back}`,
                            speakText: fc.front
                        });
                    }
                });
            });
        });

        return results.slice(0, 8);
    }

    // Fon audiosi boshqaruvi
    let audioCtx = null;
    let ambientGain = null;
    let ambientOsc = null;

    function playSyntheticAmbient(type) {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();

            if (ambientGain) {
                ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
                if (ambientOsc) ambientOsc.stop();
                ambientGain = null;
                ambientOsc = null;
            }

            if (type === 'pause' || type === 'stop') {
                if (window.showToast) window.showToast('🔇 Fon musiqasi to\'xtatildi', 'info');
                return;
            }

            // Ovoz generatori (Fokus, Koinot, Yomg'ir)
            ambientGain = audioCtx.createGain();
            ambientGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            ambientGain.connect(audioCtx.destination);

            ambientOsc = audioCtx.createOscillator();
            ambientOsc.type = type === 'space' ? 'sawtooth' : 'sine';
            ambientOsc.frequency.setValueAtTime(type === 'space' ? 65 : 174, audioCtx.currentTime);
            ambientOsc.connect(ambientGain);
            ambientOsc.start();

            if (window.showToast) {
                window.showToast(`🎵 ${type === 'space' ? 'Koinot' : 'Fokus'} ambient ovozi yoqildi`, 'success');
            }
        } catch (_) {}
    }

    // Modal DOM ini qurish
    function buildPaletteDOM() {
        if (modalEl) return;

        const overlay = document.createElement('div');
        overlay.id = 'super-palette-modal';
        overlay.className = 'super-palette-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 11000;
            display: none; align-items: flex-start; justify-content: center;
            padding-top: 10vh; background: rgba(7, 17, 28, 0.75);
            backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
            opacity: 0; transition: opacity 0.2s ease;
        `;

        overlay.innerHTML = `
            <div class="super-palette-box" style="
                width: 92%; max-width: 660px;
                background: rgba(12, 30, 48, 0.95);
                border: 1px solid rgba(56, 189, 248, 0.25);
                border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(45,212,191,0.15);
                overflow: hidden; display: flex; flex-direction: column;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            ">
                <div class="super-palette-header" style="
                    display: flex; align-items: center; gap: 12px;
                    padding: 16px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(255, 255, 255, 0.02);
                ">
                    <span style="font-size: 20px; color: #2dd4bf; filter: drop-shadow(0 0 6px #2dd4bf);">⚡</span>
                    <input type="text" id="super-palette-input" placeholder="Buyruq yoki qidiruv... (de, calc, base64, hash, theme, audio)" style="
                        flex: 1; background: transparent; border: none; outline: none;
                        font-size: 16px; color: #f8fafc; font-family: inherit;
                    " autocomplete="off" spellcheck="false">
                    <span class="palette-kbd" style="
                        font-size: 11px; padding: 4px 8px; border-radius: 6px;
                        background: rgba(255, 255, 255, 0.08); color: #94a3b8;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    ">ESC</span>
                </div>

                <div id="super-palette-results" style="
                    max-height: 380px; overflow-y: auto; padding: 10px;
                    display: flex; flex-direction: column; gap: 6px;
                "></div>

                <div class="super-palette-footer" style="
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 10px 20px; background: rgba(0, 0, 0, 0.25);
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    font-size: 12px; color: #64748b;
                ">
                    <div style="display: flex; gap: 14px;">
                        <span><b style="color:#94a3b8;">↑↓</b> O'tish</span>
                        <span><b style="color:#94a3b8;">↵</b> Tanlash/Nusxa</span>
                    </div>
                    <span id="super-palette-hint" style="color: #38bdf8;">⌘K Super-Terminal</span>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        modalEl = overlay;
        inputEl = overlay.querySelector('#super-palette-input');
        resultsEl = overlay.querySelector('#super-palette-results');
        hintEl = overlay.querySelector('#super-palette-hint');

        // Modal tashqarisiga bosganda yopish
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSuperPalette();
        });

        // Input hodisasi
        inputEl.addEventListener('input', () => {
            renderResults(inputEl.value);
        });

        // Klaviatura navigatsiyasi
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                moveSelection(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                moveSelection(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                executeCurrent();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeSuperPalette();
            }
        });
    }

    function moveSelection(direction) {
        if (!currentResults.length) return;
        selectedIndex = (selectedIndex + direction + currentResults.length) % currentResults.length;
        updateSelectionUI();
    }

    function updateSelectionUI() {
        const items = resultsEl.querySelectorAll('.super-item');
        items.forEach((item, idx) => {
            if (idx === selectedIndex) {
                item.style.background = 'rgba(56, 189, 248, 0.14)';
                item.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.style.background = 'rgba(255, 255, 255, 0.03)';
                item.style.borderColor = 'transparent';
            }
        });
    }

    function executeCurrent() {
        if (!currentResults.length || selectedIndex < 0 || selectedIndex >= currentResults.length) return;
        const item = currentResults[selectedIndex];
        if (item.copyText) {
            copyToClipboard(item.copyText);
            if (window.showToast) window.showToast(`📋 Nusxalandi: "${item.copyText}"`, 'success');
        }
        if (typeof item.action === 'function') {
            item.action();
        }
        if (!item.keepOpen) {
            closeSuperPalette();
        }
    }

    // Natijalarni render qilish
    async function renderResults(queryRaw) {
        const q = (queryRaw || '').trim();
        resultsEl.innerHTML = '';
        currentResults = [];
        selectedIndex = 0;

        // 1. "de <so'z>"
        if (q.startsWith('de ')) {
            const word = q.slice(3).trim();
            const list = lookupGermanWord(word);
            if (!list.length) {
                showEmpty(`"${safeHtml(word)}" bo'yicha nemischa so'z topilmadi`);
                return;
            }
            currentResults = list;
            renderItems(list);
            return;
        }

        // 2. "calc <ifoda>"
        if (q.startsWith('calc ')) {
            const expr = q.slice(5).trim();
            const val = safeCalculate(expr);
            if (val !== null) {
                const item = {
                    title: `= ${val}`,
                    subtitle: `Matematik ifoda: ${expr} (Enter: nusxalash)`,
                    badge: '🧮 Hisoblagich',
                    copyText: String(val)
                };
                currentResults = [item];
                renderItems([item]);
            } else {
                showEmpty('Noto\'g\'ri matematik ifoda. Masalan: calc 145 * 12');
            }
            return;
        }

        // 3. "base64 <matn>"
        if (q.startsWith('base64 ')) {
            const text = q.slice(7).trim();
            const res = handleBase64(text);
            if (res) {
                const item = {
                    title: res.value,
                    subtitle: `Base64 kodlangan matn: "${text}" (Enter: nusxalash)`,
                    badge: '🔐 Base64',
                    copyText: res.value
                };
                currentResults = [item];
                renderItems([item]);
            }
            return;
        }

        // 4. "hash <matn>"
        if (q.startsWith('hash ')) {
            const text = q.slice(5).trim();
            const hash = await handleSha256(text);
            if (hash) {
                const item = {
                    title: hash,
                    subtitle: `SHA-256 xesh: "${text}" (Enter: nusxalash)`,
                    badge: '🛡️ SHA-256',
                    copyText: hash
                };
                currentResults = [item];
                renderItems([item]);
            }
            return;
        }

        // 5. "theme <nom>"
        if (q.startsWith('theme')) {
            const themes = [
                { name: 'Dark Cyber (Tungi)', val: 'dark', icon: '🌙' },
                { name: 'Prism Lux (Yorug\')', val: 'light', icon: '☀️' },
                { name: 'Quantum Aurora', val: 'aurora', icon: '🌌' },
                { name: 'Swiss Atelier', val: 'atelier', icon: '🏔️' }
            ];
            currentResults = themes.map(t => ({
                title: `${t.icon} ${t.name}`,
                subtitle: `Sayt mavzusini "${t.name}" ga almashtirish`,
                badge: '🎨 Mavzu',
                action: () => {
                    document.documentElement.setAttribute('data-theme', t.val);
                    try { localStorage.setItem('abdu_theme', t.val); } catch (_) {}
                    if (window.showToast) window.showToast(`🎨 Mavzu o'zgartirildi: ${t.name}`, 'info');
                }
            }));
            renderItems(currentResults);
            return;
        }

        // 6. "audio <rejim>"
        if (q.startsWith('audio')) {
            const modes = [
                { name: 'Fokus (174Hz Tinchlantiruvchi)', type: 'focus', icon: '🧘' },
                { name: 'Koinot (Kosmik ambient)', type: 'space', icon: '🪐' },
                { name: 'To\'xtatish (Musiqa va ovozni o\'chirish)', type: 'pause', icon: '⏹️' }
            ];
            currentResults = modes.map(m => ({
                title: `${m.icon} ${m.name}`,
                subtitle: `Fon ovozini boshqarish`,
                badge: '🎵 Audio',
                action: () => playSyntheticAmbient(m.type)
            }));
            renderItems(currentResults);
            return;
        }

        // 7. Bo'sh holat — Tezkor harakatlar va tavsiyalar
        if (!q) {
            const defaults = [
                { title: 'de <so\'z>', subtitle: 'Nemischa so\'z qidirish, tarjima va talaffuz (masalan: de Haus)', badge: '🇩🇪 Lug\'at', prefix: 'de ' },
                { title: 'calc <ifoda>', subtitle: 'Tezkor kalkulyator (masalan: calc 250 * 1.15)', badge: '🧮 Hisob', prefix: 'calc ' },
                { title: 'base64 <matn>', subtitle: 'Matnni Base64 formatiga o\'girish', badge: '🔐 Kripto', prefix: 'base64 ' },
                { title: 'hash <matn>', subtitle: 'Matnning SHA-256 xeshini chiqarish', badge: '🛡️ Hash', prefix: 'hash ' },
                { title: 'theme', subtitle: 'Tungi, kunduzgi va maxsus mavzularni o\'zgartirish', badge: '🎨 Mavzu', prefix: 'theme ' },
                { title: 'audio', subtitle: 'Fokus yoki koinot fon ovozini yoqish/o\'chirish', badge: '🎵 Fon', prefix: 'audio ' },
                { title: '🇩🇪 Nemis Tili Bo\'limi', subtitle: 'A1-B2 darslari, testlar va trenajyorlar', badge: 'Navigatsiya', action: () => { window.location.href = 'deutsch.html'; } },
                { title: '🛠️ Mikro-Vositalar (Tools)', subtitle: 'WebP konvertor, JSON formatlovchi va asboblar', badge: 'Navigatsiya', action: () => { window.location.href = 'tools.html'; } }
            ];

            currentResults = defaults;
            renderItems(defaults);
            return;
        }

        // 8. Umumiy qidiruv (saytdagi maqola va darslar)
        const genResults = [];
        if (window.App && Array.isArray(window.App.posts)) {
            window.App.posts.forEach(p => {
                if ((p.title && p.title.toLowerCase().includes(q.toLowerCase())) || (p.excerpt && p.excerpt.toLowerCase().includes(q.toLowerCase()))) {
                    genResults.push({
                        title: p.title,
                        subtitle: p.excerpt || 'Blog maqolasi',
                        badge: '📰 Maqola',
                        action: () => {
                            if (typeof window.openPostDetail === 'function') {
                                window.openPostDetail(p.id);
                            } else {
                                window.location.href = `/?post=${p.id}`;
                            }
                        }
                    });
                }
            });
        }

        if (genResults.length) {
            currentResults = genResults.slice(0, 8);
            renderItems(currentResults);
        } else {
            showEmpty(`"${safeHtml(q)}" bo'yicha natija topilmadi. Buyruqlardan foydalaning: de, calc, base64, hash, theme, audio`);
        }
    }

    function renderItems(items) {
        resultsEl.innerHTML = '';
        items.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'super-item';
            div.style.cssText = `
                padding: 12px 14px; border-radius: 12px;
                background: ${idx === 0 ? 'rgba(56, 189, 248, 0.14)' : 'rgba(255, 255, 255, 0.03)'};
                border: 1px solid ${idx === 0 ? 'rgba(56, 189, 248, 0.4)' : 'transparent'};
                cursor: pointer; display: flex; align-items: center; justify-content: space-between;
                transition: background 0.15s, border-color 0.15s;
            `;

            div.innerHTML = `
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 14px; font-weight: 600; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${safeHtml(item.title)}
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${safeHtml(item.subtitle)}
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-left: 12px; flex-shrink: 0;">
                    ${item.speakText ? `<button class="palette-speak-btn" style="background:rgba(45,212,191,0.15); border:1px solid rgba(45,212,191,0.3); color:#2dd4bf; border-radius:8px; padding:4px 8px; cursor:pointer; font-size:12px;">🔊</button>` : ''}
                    <span style="font-size: 11px; padding: 3px 8px; border-radius: 6px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-weight: 500;">
                        ${safeHtml(item.badge || '')}
                    </span>
                </div>
            `;

            div.addEventListener('click', (e) => {
                if (e.target && e.target.classList.contains('palette-speak-btn')) {
                    e.stopPropagation();
                    speakGerman(item.speakText);
                    return;
                }
                selectedIndex = idx;
                if (item.prefix) {
                    inputEl.value = item.prefix;
                    inputEl.focus();
                    renderResults(item.prefix);
                } else {
                    executeCurrent();
                }
            });

            div.addEventListener('mouseenter', () => {
                selectedIndex = idx;
                updateSelectionUI();
            });

            resultsEl.appendChild(div);
        });
    }

    function showEmpty(text) {
        resultsEl.innerHTML = `
            <div style="padding: 30px 20px; text-align: center; color: #64748b; font-size: 13px;">
                <div style="font-size: 26px; margin-bottom: 8px;">🔍</div>
                <div>${text}</div>
            </div>
        `;
    }

    function openSuperPalette(initialQuery = '') {
        buildPaletteDOM();
        isOpen = true;
        modalEl.style.display = 'flex';
        setTimeout(() => {
            modalEl.style.opacity = '1';
            inputEl.value = initialQuery;
            inputEl.focus();
            renderResults(initialQuery);
        }, 20);
        document.body.style.overflow = 'hidden';
    }

    function closeSuperPalette() {
        if (!modalEl || !isOpen) return;
        isOpen = false;
        modalEl.style.opacity = '0';
        setTimeout(() => {
            modalEl.style.display = 'none';
            document.body.style.overflow = '';
        }, 180);
    }

    // Global Hotkey (⌘K / Ctrl+K)
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            if (isOpen) closeSuperPalette();
            else openSuperPalette();
        }
    });

    // Tugma bosilishlarini tinglash (Search va [data-action="open-search"])
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#search-btn, [data-action="open-search"], #super-palette-btn');
        if (btn) {
            e.preventDefault();
            openSuperPalette();
        }
    });

    // Global eksport
    window.SuperPalette = {
        open: openSuperPalette,
        close: closeSuperPalette,
        isOpen: () => isOpen
    };
})();
