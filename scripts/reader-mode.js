/**
 * ============================================================================
 * Abdugofforov Blog - Modern Reader Mode Engine
 * 
 * Features:
 * 1. Neon Gradient Reading Progress Bar (Fixed at top, viewport & modal scroll tracking)
 * 2. Bionic Reading Mode (1-3 letter fixation, zero corruption reversibility)
 * 3. Web Speech API (TTS) Audio Reader (Multi-voice: UZ/RU/EN, sentence tracking, visualizer)
 * 4. Self-initializing & Zero external dependencies
 * ============================================================================
 */

(function () {
    'use strict';

    // Prevent duplicate initialization
    if (window.ReaderMode && window.ReaderMode.__initialized) {
        return;
    }

    /* --------------------------------------------------------------------------
       STATE & CONSTANTS
       -------------------------------------------------------------------------- */
    const STORAGE_KEY_BIONIC = 'reader_bionic_enabled';
    const STORAGE_KEY_VOICE = 'reader_tts_voice_name';
    const STORAGE_KEY_RATE = 'reader_tts_rate';

    let isBionicActive = false;
    let bionicOriginalMap = new WeakMap();

    // TTS State
    let ttsState = 'stopped'; // 'stopped' | 'playing' | 'paused'
    let ttsSentences = [];
    let ttsSentenceIndex = 0;
    let currentUtterance = null;
    let availableVoices = [];
    let selectedVoice = null;
    let selectedRate = 1.0;

    // DOM Elements cache
    let progressBarEl = null;
    let progressContainerEl = null;
    let floatingFabEl = null;
    let modalEl = null;
    let modalContainerEl = null;

    /* --------------------------------------------------------------------------
       1. AUTO-LOAD CSS & SELF-INITIALIZATION
       -------------------------------------------------------------------------- */
    function ensureStylesLoaded() {
        if (!document.querySelector('link[href*="reader-mode.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/reader-mode.css';
            document.head.appendChild(link);
        }
    }

    /* --------------------------------------------------------------------------
       2. READING PROGRESS BAR
       -------------------------------------------------------------------------- */
    function createProgressBar() {
        if (document.getElementById('reader-progress-container')) {
            progressContainerEl = document.getElementById('reader-progress-container');
            progressBarEl = document.getElementById('reader-progress-bar');
            return;
        }

        const container = document.createElement('div');
        container.className = 'reader-progress-container visible';
        container.id = 'reader-progress-container';
        container.setAttribute('aria-hidden', 'true');

        const bar = document.createElement('div');
        bar.className = 'reader-progress-bar';
        bar.id = 'reader-progress-bar';

        const glow = document.createElement('span');
        glow.className = 'reader-progress-glow';

        bar.appendChild(glow);
        container.appendChild(bar);
        document.body.appendChild(container);

        progressContainerEl = container;
        progressBarEl = bar;
    }

    let progressRafId = null;

    function updateProgress() {
        if (progressRafId) return;

        progressRafId = requestAnimationFrame(() => {
            progressRafId = null;
            if (!progressBarEl) return;

            let percentage = 0;
            const isModalOpen = modalEl && modalEl.classList.contains('active');

            if (isModalOpen && modalContainerEl) {
                // Track modal scroll
                const scrollTop = modalContainerEl.scrollTop;
                const scrollHeight = modalContainerEl.scrollHeight - modalContainerEl.clientHeight;
                percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            } else {
                // Track window scroll
                const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
                const scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
                percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            }

            const clamped = Math.min(100, Math.max(0, percentage));
            progressBarEl.style.width = clamped.toFixed(1) + '%';
        });
    }

    function initProgressTracking() {
        createProgressBar();

        modalEl = document.getElementById('post-detail-modal');
        if (modalEl) {
            modalContainerEl = modalEl.querySelector('.modal-container');
            if (modalContainerEl) {
                modalContainerEl.addEventListener('scroll', updateProgress, { passive: true });
            }
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    }

    /* --------------------------------------------------------------------------
       3. BIONIC READING ENGINE
       -------------------------------------------------------------------------- */
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function bionicWord(token) {
        // Matches leading punctuation, word core (letters, numbers, Uzbek apostrophes), and trailing punctuation
        const regex = /^([^\p{L}\p{N}]*)([\p{L}\p{N}'ʻ’]+)([^\p{L}\p{N}]*)$/u;
        const match = token.match(regex);
        if (!match) return escapeHtml(token);

        const lead = match[1];
        const core = match[2];
        const trail = match[3];

        const len = core.length;
        if (len === 0) return escapeHtml(token);

        // Fixation rule: bolding the first 1-3 letters of words (e.g. **ha**yot, **za**monaviy)
        let fix = 1;
        if (len >= 10) {
            fix = 3;
        } else if (len >= 4) {
            fix = 2; // e.g. "hayot" (5) -> "ha", "zamonaviy" (9) -> "za"
        } else {
            fix = 1; // e.g. "va" -> "v", "bir" -> "b"
        }

        // Handle Uzbek apostrophes gracefully (e.g. o'qish, ma'rifat)
        if (fix === 1 && len > 2 && (core[1] === "'" || core[1] === "’" || core[1] === "ʻ")) {
            fix = 2;
        } else if (fix === 2 && len > 3 && (core[2] === "'" || core[2] === "’" || core[2] === "ʻ")) {
            fix = 3;
        }

        const boldPart = core.slice(0, fix);
        const restPart = core.slice(fix);

        return `${escapeHtml(lead)}<b class="bionic-bold">${escapeHtml(boldPart)}</b>${escapeHtml(restPart)}${escapeHtml(trail)}`;
    }

    function applyBionicToElement(el) {
        if (!el || el.classList.contains('bionic-applied')) return;

        // Save original innerHTML before modifying for clean 100% restoration
        if (!bionicOriginalMap.has(el)) {
            bionicOriginalMap.set(el, el.innerHTML);
        }

        const walker = document.createTreeWalker(
            el,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentNode;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.tagName ? parent.tagName.toUpperCase() : '';
                    if (['SCRIPT', 'STYLE', 'PRE', 'CODE', 'SVG', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(tag) ||
                        parent.classList.contains('bionic-bold') ||
                        parent.classList.contains('bionic-node') ||
                        parent.closest('pre, code, svg, button, textarea, input, .no-bionic')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(node => {
            const rawText = node.nodeValue;
            const parts = rawText.split(/(\s+)/);
            const fragment = document.createDocumentFragment();

            parts.forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    fragment.appendChild(document.createTextNode(part));
                } else {
                    const span = document.createElement('span');
                    span.className = 'bionic-node';
                    span.innerHTML = bionicWord(part);
                    fragment.appendChild(span);
                }
            });

            if (node.parentNode) {
                node.parentNode.replaceChild(fragment, node);
            }
        });

        el.classList.add('bionic-applied');
    }

    function removeBionicFromElement(el) {
        if (!el || !el.classList.contains('bionic-applied')) return;

        if (bionicOriginalMap.has(el)) {
            el.innerHTML = bionicOriginalMap.get(el);
            bionicOriginalMap.delete(el);
        } else {
            // Safe fallback if innerHTML wasn't cached
            el.querySelectorAll('.bionic-node').forEach(span => {
                const text = document.createTextNode(span.textContent);
                span.parentNode.replaceChild(text, span);
            });
        }
        el.classList.remove('bionic-applied');
    }

    function applyBionicAll() {
        // Apply to post cards on main page
        document.querySelectorAll('.post-card .post-title, .post-card .post-excerpt').forEach(applyBionicToElement);

        // Apply to open detail modal
        const modalTitle = document.querySelector('#detail-modal-body .modal-post-title');
        const modalText = document.querySelector('#detail-modal-body .modal-post-text');
        if (modalTitle) applyBionicToElement(modalTitle);
        if (modalText) applyBionicToElement(modalText);

        updateBionicUI(true);
    }

    function removeBionicAll() {
        document.querySelectorAll('.bionic-applied').forEach(removeBionicFromElement);
        updateBionicUI(false);
    }

    function toggleBionic(forceState) {
        isBionicActive = typeof forceState === 'boolean' ? forceState : !isBionicActive;

        try {
            localStorage.setItem(STORAGE_KEY_BIONIC, isBionicActive ? 'true' : 'false');
        } catch (e) { /* LocalStorage disabled or quota */ }

        if (isBionicActive) {
            applyBionicAll();
            if (window.showToast && typeof window.showToast === 'function') {
                window.showToast("👁️ Bionic Mutolaa rejimi yoqildi", "success");
            }
        } else {
            removeBionicAll();
            if (window.showToast && typeof window.showToast === 'function') {
                window.showToast("Bionic Mutolaa rejimi o'chirildi", "info");
            }
        }
    }

    function updateBionicUI(active) {
        // Floating FAB
        if (floatingFabEl) {
            const btn = floatingFabEl.querySelector('.reader-fab-btn');
            if (btn) {
                btn.classList.toggle('active', active);
                const textSpan = btn.querySelector('.reader-fab-text');
                if (textSpan) {
                    textSpan.textContent = active ? 'Bionic: Yoniq' : 'Bionic';
                }
            }
        }

        // Modal Action Button
        const modalBtn = document.getElementById('modal-bionic-toggle');
        if (modalBtn) {
            modalBtn.classList.toggle('active', active);
            const label = modalBtn.querySelector('.bionic-label');
            if (label) {
                label.textContent = active ? "Bionic: Yoniq" : "Bionic: O'chiq";
            }
        }
    }

    /* --------------------------------------------------------------------------
       4. WEB SPEECH API (TTS) AUDIO READER
       -------------------------------------------------------------------------- */
    function isTTSSupported() {
        return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    }

    function loadVoices() {
        if (!isTTSSupported()) return [];
        availableVoices = window.speechSynthesis.getVoices() || [];
        return availableVoices;
    }

    function getBestVoice(langPreference) {
        if (!availableVoices.length) loadVoices();
        if (!availableVoices.length) return null;

        // 1. Try to find saved voice from localStorage
        const savedName = localStorage.getItem(STORAGE_KEY_VOICE);
        if (savedName) {
            const savedVoice = availableVoices.find(v => v.name === savedName);
            if (savedVoice) return savedVoice;
        }

        // 2. Try match preferred language
        if (langPreference) {
            const match = availableVoices.find(v => v.lang.toLowerCase().startsWith(langPreference.toLowerCase()));
            if (match) return match;
        }

        // 3. Look for Uzbek voices (uz, uz-UZ)
        const uzVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith('uz'));
        if (uzVoice) return uzVoice;

        // 4. Look for Turkish (phonetically closest to Uzbek Latin)
        const trVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith('tr'));
        if (trVoice) return trVoice;

        // 5. Look for Russian voices (ru, ru-RU)
        const ruVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith('ru'));
        if (ruVoice) return ruVoice;

        // 6. Look for English voices (en, en-US, en-GB)
        const enVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith('en'));
        if (enVoice) return enVoice;

        // 7. System default
        return availableVoices.find(v => v.default) || availableVoices[0];
    }

    function extractPostText() {
        const titleEl = document.querySelector('#detail-modal-body .modal-post-title');
        const textEl = document.querySelector('#detail-modal-body .modal-post-text');

        let raw = '';
        if (titleEl) raw += titleEl.textContent + '. ';
        if (textEl) {
            // Clone and strip unwanted tags
            const clone = textEl.cloneNode(true);
            clone.querySelectorAll('script, style, pre, code, svg, audio, video, .bionic-bold').forEach(e => {
                if (e.classList.contains('bionic-bold')) {
                    // keep bold letter text
                    e.replaceWith(document.createTextNode(e.textContent));
                } else {
                    e.remove();
                }
            });
            raw += clone.textContent || clone.innerText || '';
        }

        // Clean markdown remnants, symbols, excess whitespace
        const clean = raw
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1')
            .replace(/[#*_~>]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (!clean) return [];

        // Split into natural sentences
        const parts = clean.match(/[^.!?\n]+[.!?\n]+/g) || [clean];
        const sentences = [];
        parts.forEach(p => {
            const t = p.trim();
            if (t.length > 200) {
                const sub = t.match(/[^,;:]+[,;:]*/g) || [t];
                sub.forEach(s => { if (s.trim()) sentences.push(s.trim()); });
            } else if (t.length > 0) {
                sentences.push(t);
            }
        });

        return sentences.length > 0 ? sentences : [clean];
    }

    function playTTS() {
        if (!isTTSSupported()) {
            if (window.showToast) window.showToast("Brauzerda ovozli o'qish qo'llab-quvvatlanmaydi", "warn");
            return;
        }

        if (ttsState === 'paused') {
            window.speechSynthesis.resume();
            ttsState = 'playing';
            updateTTSUI();
            return;
        }

        // Start from beginning or current position
        if (ttsState === 'stopped') {
            ttsSentences = extractPostText();
            ttsSentenceIndex = 0;
        }

        if (!ttsSentences.length) return;

        window.speechSynthesis.cancel();
        ttsState = 'playing';
        updateTTSUI();
        speakNextSentence();
    }

    function speakNextSentence() {
        if (ttsState !== 'playing') return;

        if (ttsSentenceIndex >= ttsSentences.length) {
            stopTTS();
            return;
        }

        const sentence = ttsSentences[ttsSentenceIndex];
        const utterance = new SpeechSynthesisUtterance(sentence);

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        }
        utterance.rate = selectedRate;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            if (ttsState === 'playing') {
                ttsSentenceIndex++;
                updateTTSProgress();
                speakNextSentence();
            }
        };

        utterance.onerror = (e) => {
            // 'canceled' or 'interrupted' is normal when stop/pause is called
            if (e.error !== 'canceled' && e.error !== 'interrupted') {
                console.warn('TTS utterance error:', e.error);
            }
            if (ttsState === 'playing') {
                ttsSentenceIndex++;
                updateTTSProgress();
                speakNextSentence();
            }
        };

        currentUtterance = utterance;
        try {
            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.warn('Speech synthesis speak error:', err);
        }
    }

    function pauseTTS() {
        if (!isTTSSupported() || ttsState !== 'playing') return;

        try {
            window.speechSynthesis.pause();
        } catch (e) {}

        ttsState = 'paused';
        updateTTSUI();
    }

    function stopTTS() {
        if (!isTTSSupported()) return;

        try {
            window.speechSynthesis.cancel();
        } catch (e) {}

        ttsState = 'stopped';
        ttsSentenceIndex = 0;
        currentUtterance = null;
        updateTTSUI();
        updateTTSProgress(0);
    }

    function updateTTSProgress(forcedPct) {
        const fill = document.getElementById('reader-tts-progress-fill');
        if (!fill) return;

        let pct = 0;
        if (typeof forcedPct === 'number') {
            pct = forcedPct;
        } else if (ttsSentences.length > 0) {
            pct = (ttsSentenceIndex / ttsSentences.length) * 100;
        }
        fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }

    function updateTTSUI() {
        const card = document.getElementById('reader-tts-card');
        const playBtn = document.getElementById('reader-play-btn');
        const pauseBtn = document.getElementById('reader-pause-btn');
        const stopBtn = document.getElementById('reader-stop-btn');
        const statusText = document.getElementById('reader-tts-status');

        if (!card) return;

        card.classList.remove('is-playing', 'is-paused');

        if (ttsState === 'playing') {
            card.classList.add('is-playing');
            if (statusText) statusText.textContent = "O'qilmoqda...";
            if (playBtn) playBtn.classList.add('active');
            if (pauseBtn) pauseBtn.classList.remove('active');
            if (stopBtn) stopBtn.disabled = false;
        } else if (ttsState === 'paused') {
            card.classList.add('is-paused');
            if (statusText) statusText.textContent = "To'xtatildi";
            if (playBtn) playBtn.classList.remove('active');
            if (pauseBtn) pauseBtn.classList.add('active');
            if (stopBtn) stopBtn.disabled = false;
        } else {
            // stopped
            if (statusText) statusText.textContent = "Tayyor";
            if (playBtn) playBtn.classList.remove('active');
            if (pauseBtn) pauseBtn.classList.remove('active');
            if (stopBtn) stopBtn.disabled = true;
        }
    }

    function populateVoicesDropdown(selectEl) {
        if (!selectEl) return;
        selectEl.innerHTML = '';

        if (!availableVoices.length) {
            loadVoices();
        }

        if (!availableVoices.length) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = "Standart ovoz";
            selectEl.appendChild(opt);
            return;
        }

        // Filter / prioritize: UZ, TR, RU, EN
        const uzVoices = availableVoices.filter(v => v.lang.toLowerCase().startsWith('uz'));
        const trVoices = availableVoices.filter(v => v.lang.toLowerCase().startsWith('tr'));
        const ruVoices = availableVoices.filter(v => v.lang.toLowerCase().startsWith('ru'));
        const enVoices = availableVoices.filter(v => v.lang.toLowerCase().startsWith('en'));
        const otherVoices = availableVoices.filter(v => 
            !v.lang.toLowerCase().startsWith('uz') &&
            !v.lang.toLowerCase().startsWith('tr') &&
            !v.lang.toLowerCase().startsWith('ru') &&
            !v.lang.toLowerCase().startsWith('en')
        ).slice(0, 5);

        function addGroup(label, list) {
            if (!list.length) return;
            const group = document.createElement('optgroup');
            group.label = label;
            list.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.name;
                opt.textContent = `${v.name} (${v.lang})`;
                if (selectedVoice && selectedVoice.name === v.name) {
                    opt.selected = true;
                }
                group.appendChild(opt);
            });
            selectEl.appendChild(group);
        }

        addGroup("🇺🇿 O'zbekcha", uzVoices);
        addGroup("🇹🇷 Turkcha (Fonetika)", trVoices);
        addGroup("🇷🇺 Ruscha", ruVoices);
        addGroup("🇬🇧 Inglizcha", enVoices);
        addGroup("🌐 Boshqa ovozlar", otherVoices);

        // Preselect current or best
        if (!selectedVoice) {
            selectedVoice = getBestVoice();
        }
        if (selectedVoice) {
            selectEl.value = selectedVoice.name;
        }
    }

    /* --------------------------------------------------------------------------
       5. MODAL INTEGRATION (Controls Injection & Sync)
       -------------------------------------------------------------------------- */
    function injectModalControls() {
        const modalBody = document.getElementById('detail-modal-body');
        if (!modalBody) return;

        // 1. Inject Bionic Toggle into .modal-actions-bar
        const actionsBar = modalBody.querySelector('.modal-actions-bar');
        if (actionsBar && !document.getElementById('modal-bionic-toggle')) {
            const bionicBtn = document.createElement('button');
            bionicBtn.type = 'button';
            bionicBtn.className = `bionic-toggle-btn ${isBionicActive ? 'active' : ''}`;
            bionicBtn.id = 'modal-bionic-toggle';
            bionicBtn.title = "Bionic Reading (Tez o'qish) rejimini yoqish/o'chirish";
            bionicBtn.innerHTML = `
                <span class="bionic-icon">👁️</span>
                <span class="bionic-label">${isBionicActive ? "Bionic: Yoniq" : "Bionic: O'chiq"}</span>
                <span class="bionic-status-dot"></span>
            `;
            bionicBtn.addEventListener('click', () => {
                toggleBionic();
            });
            actionsBar.appendChild(bionicBtn);
        }

        // 2. Inject TTS Reader Card if not already present
        if (!document.getElementById('reader-tts-card')) {
            const ttsCard = document.createElement('div');
            ttsCard.className = 'reader-tts-card';
            ttsCard.id = 'reader-tts-card';

            if (!isTTSSupported()) {
                ttsCard.innerHTML = `
                    <div class="reader-tts-header">
                        <div class="reader-tts-info">
                            <div class="reader-tts-icon-wrap">🎧</div>
                            <div>
                                <strong class="reader-tts-title">Audio Mutolaa</strong>
                                <span class="reader-tts-status">Qo'llab-quvvatlanmaydi</span>
                            </div>
                        </div>
                    </div>
                    <div class="reader-tts-unsupported">
                        Brauzeringizda Web Speech API (TTS) qo'llab-quvvatlanmaydi.
                    </div>
                `;
            } else {
                ttsCard.innerHTML = `
                    <div class="reader-tts-header">
                        <div class="reader-tts-info">
                            <div class="reader-tts-icon-wrap">🎧</div>
                            <div>
                                <strong class="reader-tts-title">Audio Mutolaa (AI Reader)</strong>
                                <span class="reader-tts-status" id="reader-tts-status">Tayyor</span>
                            </div>
                        </div>
                        <div class="reader-tts-equalizer" id="reader-tts-equalizer" aria-hidden="true">
                            <span></span><span></span><span></span><span></span>
                        </div>
                    </div>
                    
                    <div class="reader-tts-progress-track">
                        <div class="reader-tts-progress-fill" id="reader-tts-progress-fill"></div>
                    </div>

                    <div class="reader-tts-controls">
                        <div class="reader-tts-btn-group">
                            <button type="button" class="reader-btn reader-play-btn" id="reader-play-btn" title="Tinglash">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                <span>Tinglash</span>
                            </button>
                            <button type="button" class="reader-btn reader-pause-btn" id="reader-pause-btn" title="To'xtatib turish">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                <span>To'xtatish</span>
                            </button>
                            <button type="button" class="reader-btn reader-stop-btn" id="reader-stop-btn" title="To'xtatish / Bekor qilish" disabled>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14"></rect></svg>
                                <span>To'xtatish</span>
                            </button>
                        </div>

                        <div class="reader-tts-options">
                            <select class="reader-select reader-voice-select" id="reader-voice-select" title="Ovoz tanlash" aria-label="Ovoz tanlash"></select>
                            <select class="reader-select reader-rate-select" id="reader-rate-select" title="Tezlik" aria-label="O'qish tezligi">
                                <option value="0.85">0.85x</option>
                                <option value="1.0" selected>1.0x</option>
                                <option value="1.25">1.25x</option>
                                <option value="1.5">1.5x</option>
                            </select>
                        </div>
                    </div>
                `;

                // Wire TTS button listeners
                const playBtn = ttsCard.querySelector('#reader-play-btn');
                const pauseBtn = ttsCard.querySelector('#reader-pause-btn');
                const stopBtn = ttsCard.querySelector('#reader-stop-btn');
                const voiceSelect = ttsCard.querySelector('#reader-voice-select');
                const rateSelect = ttsCard.querySelector('#reader-rate-select');

                if (playBtn) playBtn.addEventListener('click', playTTS);
                if (pauseBtn) pauseBtn.addEventListener('click', pauseTTS);
                if (stopBtn) stopBtn.addEventListener('click', stopTTS);

                if (voiceSelect) {
                    populateVoicesDropdown(voiceSelect);
                    voiceSelect.addEventListener('change', (e) => {
                        const voiceName = e.target.value;
                        selectedVoice = availableVoices.find(v => v.name === voiceName) || null;
                        if (selectedVoice) {
                            try { localStorage.setItem(STORAGE_KEY_VOICE, selectedVoice.name); } catch(err) {}
                        }
                        if (ttsState === 'playing') {
                            // Restart with new voice
                            playTTS();
                        }
                    });
                }

                if (rateSelect) {
                    const savedRate = localStorage.getItem(STORAGE_KEY_RATE);
                    if (savedRate) {
                        rateSelect.value = savedRate;
                        selectedRate = parseFloat(savedRate) || 1.0;
                    }
                    rateSelect.addEventListener('change', (e) => {
                        selectedRate = parseFloat(e.target.value) || 1.0;
                        try { localStorage.setItem(STORAGE_KEY_RATE, e.target.value); } catch(err) {}
                        if (ttsState === 'playing') {
                            playTTS();
                        }
                    });
                }
            }

            // Insert above .modal-post-text
            const postText = modalBody.querySelector('.modal-post-text');
            if (postText) {
                modalBody.insertBefore(ttsCard, postText);
            } else {
                modalBody.appendChild(ttsCard);
            }
        }

        // If Bionic is enabled, apply to newly injected modal content
        if (isBionicActive) {
            const modalTitle = modalBody.querySelector('.modal-post-title');
            const modalText = modalBody.querySelector('.modal-post-text');
            if (modalTitle) applyBionicToElement(modalTitle);
            if (modalText) applyBionicToElement(modalText);
        }

        updateTTSUI();
    }

    /* --------------------------------------------------------------------------
       6. FLOATING BIONIC ACTION BUTTON (FAB)
       -------------------------------------------------------------------------- */
    function createFloatingFab() {
        if (document.getElementById('reader-floating-toggle')) {
            floatingFabEl = document.getElementById('reader-floating-toggle');
            return;
        }

        const wrap = document.createElement('aside');
        wrap.className = 'reader-floating-toggle';
        wrap.id = 'reader-floating-toggle';
        wrap.setAttribute('aria-label', "Mutolaa Rejimi Boshqaruvi");

        wrap.innerHTML = `
            <button type="button" class="reader-fab-btn ${isBionicActive ? 'active' : ''}" id="reader-fab-btn" title="Bionic Mutolaa rejimini yoqish/o'chirish">
                <span class="reader-fab-icon">👁️</span>
                <span class="reader-fab-text">${isBionicActive ? 'Bionic: Yoniq' : 'Bionic'}</span>
                <span class="reader-fab-indicator"></span>
            </button>
        `;

        wrap.querySelector('#reader-fab-btn').addEventListener('click', () => {
            toggleBionic();
        });

        document.body.appendChild(wrap);
        floatingFabEl = wrap;
    }

    /* --------------------------------------------------------------------------
       7. LIFECYCLE, MUTATION OBSERVERS & MODAL EVENTS
       -------------------------------------------------------------------------- */
    function initObservers() {
        // Observe modal open/close & body changes
        if (modalEl) {
            const modalObserver = new MutationObserver(() => {
                const isActive = modalEl.classList.contains('active');
                if (isActive) {
                    injectModalControls();
                    updateProgress();
                } else {
                    // Modal closed - immediately stop TTS reading
                    stopTTS();
                    updateProgress();
                }
            });

            modalObserver.observe(modalEl, {
                attributes: true,
                attributeFilter: ['class']
            });

            // Also observe #detail-modal-body content replacement
            const detailModalBody = document.getElementById('detail-modal-body');
            if (detailModalBody) {
                const bodyObserver = new MutationObserver(() => {
                    if (modalEl.classList.contains('active')) {
                        injectModalControls();
                    }
                });
                bodyObserver.observe(detailModalBody, { childList: true });
            }

            // Close listeners: stop speech immediately
            const closeBtn = document.getElementById('close-detail-modal');
            if (closeBtn) {
                closeBtn.addEventListener('click', stopTTS);
            }
            modalEl.addEventListener('click', (e) => {
                if (e.target === modalEl) stopTTS();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modalEl.classList.contains('active')) {
                    stopTTS();
                }
            });
        }

        // Observe #posts-container or main content for dynamically added post cards
        const postsContainer = document.getElementById('posts-container') || document.getElementById('main-content');
        if (postsContainer) {
            let debounceTimer = null;
            const postsObserver = new MutationObserver(() => {
                if (!isBionicActive) return;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    applyBionicAll();
                }, 100);
            });

            postsObserver.observe(postsContainer, {
                childList: true,
                subtree: true
            });
        }
    }

    function initSpeechVoices() {
        if (!isTTSSupported()) return;

        loadVoices();
        if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
            window.speechSynthesis.onvoiceschanged = () => {
                loadVoices();
                const selectEl = document.getElementById('reader-voice-select');
                if (selectEl) {
                    populateVoicesDropdown(selectEl);
                }
            };
        }
    }

    /* --------------------------------------------------------------------------
       8. INITIALIZE EVERYTHING
       -------------------------------------------------------------------------- */
    function init() {
        ensureStylesLoaded();
        initProgressTracking();
        createFloatingFab();
        initSpeechVoices();
        initObservers();

        // Restore saved Bionic preference
        try {
            if (localStorage.getItem(STORAGE_KEY_BIONIC) === 'true') {
                isBionicActive = true;
                // Defer slightly so post cards are populated
                setTimeout(() => {
                    applyBionicAll();
                }, 150);
            }
        } catch (e) {}

        // Expose public API
        window.ReaderMode = {
            __initialized: true,
            toggleBionic,
            applyBionic: applyBionicAll,
            removeBionic: removeBionicAll,
            isBionicActive: () => isBionicActive,
            playTTS,
            pauseTTS,
            stopTTS,
            updateProgress
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
