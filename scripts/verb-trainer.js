/**
 * Nemis Tili Fe'llar Trenajyori (German Verb Conjugation Trainer)
 * Muallif: Abdugofforov Platformasi
 */

(function () {
    'use strict';

    // State
    const state = {
        mode: 'quiz', // 'quiz' | 'input' | 'table' | 'daily' | 'library'
        levelFilter: 'ALL',
        currentVerb: null,
        currentQuestion: null,
        streak: parseInt(localStorage.getItem('verb_streak') || '0', 10),
        score: parseInt(localStorage.getItem('verb_score') || '0', 10),
        totalSolved: parseInt(localStorage.getItem('verb_total_solved') || '0', 10),
        dailyDate: localStorage.getItem('verb_daily_date') || '',
        dailyCompleted: localStorage.getItem('verb_daily_completed') === 'true',
        dailyQuestions: [],
        dailyIndex: 0,
        dailyScore: 0,
        tableInputs: {}
    };

    const PRONOUNS = [
        { key: 'ich', label: 'ich (men)' },
        { key: 'du', label: 'du (sen)' },
        { key: 'er_sie_es', label: 'er/sie/es (u)' },
        { key: 'wir', label: 'wir (biz)' },
        { key: 'ihr', label: 'ihr (sizlar)' },
        { key: 'sie_Sie', label: 'sie/Sie (ular/Siz)' }
    ];

    const TENSES = [
        { key: 'praesens', label: 'Präsens (Hozirgi zamon)' },
        { key: 'praeteritum', label: 'Präteritum (O\'tgan zamon - hikoya)' },
        { key: 'perfekt', label: 'Perfekt (O\'tgan zamon - so\'zlashuv)' }
    ];

    // Ovoz chiqarish (Speech Synthesis)
    function speakGerman(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    // Saqlash
    function saveStats() {
        localStorage.setItem('verb_streak', state.streak.toString());
        localStorage.setItem('verb_score', state.score.toString());
        localStorage.setItem('verb_total_solved', state.totalSolved.toString());
        updateStatsUI();
    }

    function updateStatsUI() {
        const streakEl = document.getElementById('verb-streak-val');
        const scoreEl = document.getElementById('verb-score-val');
        const solvedEl = document.getElementById('verb-solved-val');
        if (streakEl) streakEl.textContent = state.streak + ' 🔥';
        if (scoreEl) scoreEl.textContent = state.score + ' XP';
        if (solvedEl) solvedEl.textContent = state.totalSolved;
    }

    // Filtr bo'yicha fe'llar ro'yxatini olish
    function getFilteredVerbs() {
        const db = window.GERMAN_VERBS_DB || [];
        if (state.levelFilter === 'ALL') return db;
        if (state.levelFilter === 'irregular') return db.filter(v => v.type === 'irregular');
        return db.filter(v => v.level === state.levelFilter);
    }

    // Tasodifiy element
    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Savol generatsiyasi (Quiz / Input uchun)
    function generateQuestion(verbInput = null) {
        const verbs = getFilteredVerbs();
        if (!verbs.length) return null;

        const verb = verbInput || getRandom(verbs);
        state.currentVerb = verb;

        // Savol turlari:
        // 1. Präsens turlanishi
        // 2. Präteritum turlanishi
        // 3. Perfekt shakli (Partizip II yoki aux + partizip II)
        // 4. Yordamchi fe'l (haben / sein)
        const qTypes = ['praesens', 'praeteritum', 'perfekt_full', 'auxiliary'];
        const qType = getRandom(qTypes);
        const pronounObj = getRandom(PRONOUNS);

        let questionText = '';
        let contextText = '';
        let correctAnswer = '';
        let tenseLabel = '';
        let options = [];

        if (qType === 'praesens') {
            tenseLabel = 'Präsens';
            correctAnswer = verb.praesens[pronounObj.key];
            questionText = `${pronounObj.key} (${verb.infinitive}) — Präsens?`;
            contextText = `Tarjimasi: "${verb.translation}". Gapda qo'llanilishi: ${verb.example}`;
        } else if (qType === 'praeteritum') {
            tenseLabel = 'Präteritum';
            correctAnswer = verb.praeteritum[pronounObj.key];
            questionText = `${pronounObj.key} (${verb.infinitive}) — Präteritum?`;
            contextText = `Tarjimasi: "${verb.translation}". Qoida: ${verb.notes}`;
        } else if (qType === 'perfekt_full') {
            tenseLabel = 'Perfekt';
            correctAnswer = verb.perfekt.full;
            questionText = `(${verb.infinitive}) ning Perfekt shakli (er/sie/es bilan)?`;
            contextText = `Yordamchi fe'l: "${verb.perfekt.auxiliary}", Partizip II: "${verb.perfekt.partizip2}".`;
        } else {
            tenseLabel = 'Yordamchi fe\'l (Hilfsverb)';
            correctAnswer = verb.perfekt.auxiliary;
            questionText = `"${verb.infinitive}" fe'li Perfekt zamonida qaysi yordamchi fe'l bilan keladi?`;
            contextText = `Misol: Er ${verb.perfekt.full}.`;
        }

        // Multiple choice variantlar yaratish
        if (state.mode === 'quiz' || state.mode === 'daily') {
            const optsSet = new Set([correctAnswer]);

            if (qType === 'auxiliary') {
                optsSet.add(correctAnswer === 'haben' ? 'sein' : 'haben');
                optsSet.add('werden');
                optsSet.add('bleiben');
            } else if (qType === 'perfekt_full') {
                const wrongAux = verb.perfekt.auxiliary === 'haben' ? 'ist' : 'hat';
                optsSet.add(`${wrongAux} ${verb.perfekt.partizip2}`);
                optsSet.add(`${verb.perfekt.auxiliary} ge${verb.infinitive}t`);
                optsSet.add(`${verb.perfekt.auxiliary} ${verb.infinitive}`);
            } else {
                // Boshqa shaxs shakllari yoki boshqa fe'llardan noto'g'ri variantlar
                const pKeys = ['ich', 'du', 'er_sie_es', 'wir', 'ihr', 'sie_Sie'];
                pKeys.forEach(k => {
                    if (optsSet.size < 4 && verb[qType][k] !== correctAnswer) {
                        optsSet.add(verb[qType][k]);
                    }
                });
                // Yetmay qolsa boshqa fe'ldan olamiz
                while (optsSet.size < 4) {
                    const otherVerb = getRandom(verbs);
                    if (otherVerb[qType] && otherVerb[qType][pronounObj.key]) {
                        optsSet.add(otherVerb[qType][pronounObj.key]);
                    } else {
                        optsSet.add(otherVerb.infinitive + 't');
                    }
                }
            }
            options = Array.from(optsSet).sort(() => 0.5 - Math.random());
        }

        return {
            verb,
            qType,
            pronoun: pronounObj,
            tenseLabel,
            questionText,
            contextText,
            correctAnswer,
            options
        };
    }

    // Daily Challenge tayyorlash
    function initDailyChallenge() {
        const todayStr = new Date().toISOString().slice(0, 10);
        const db = window.GERMAN_VERBS_DB || [];
        if (!db.length) return;

        state.dailyDate = todayStr;
        state.dailyIndex = 0;
        state.dailyScore = 0;

        // Har kuni sana asosida barqaror 5 ta savol
        let seed = 0;
        for (let i = 0; i < todayStr.length; i++) {
            seed += todayStr.charCodeAt(i);
        }

        const shuffled = [...db].sort((a, b) => {
            const hashA = (a.id.charCodeAt(0) * seed) % 100;
            const hashB = (b.id.charCodeAt(0) * seed) % 100;
            return hashA - hashB;
        });

        const selectedVerbs = shuffled.slice(0, 5);
        state.dailyQuestions = selectedVerbs.map(v => generateQuestion(v));
    }

    // UI Renderlash
    function renderVerbTrainer() {
        const container = document.getElementById('verb-trainer-content');
        if (!container) return;

        container.innerHTML = `
            <div class="verb-trainer-wrap">
                <!-- Header -->
                <div class="verb-header">
                    <span class="verb-badge">⚡ INTERAKTIV TRENAJYOR</span>
                    <h1 class="verb-title">Nemis Tili Fe'llar Trenajyori</h1>
                    <p class="verb-subtitle">
                        Präsens, Präteritum va Perfekt zamonlari bo'yicha turlanishni mustahkamlang, darhol feedback oling va o'z bilim darajangizni oshiring!
                    </p>
                </div>

                <!-- Stats Bar -->
                <div class="verb-stats-bar">
                    <div class="verb-stat-card">
                        <div class="verb-stat-icon">🔥</div>
                        <div class="verb-stat-info">
                            <h4>Ketma-ket to'g'ri (Streak)</h4>
                            <div class="stat-val" id="verb-streak-val">${state.streak} 🔥</div>
                        </div>
                    </div>
                    <div class="verb-stat-card">
                        <div class="verb-stat-icon">⭐</div>
                        <div class="verb-stat-info">
                            <h4>Jamg'arilgan Ball (XP)</h4>
                            <div class="stat-val" id="verb-score-val">${state.score} XP</div>
                        </div>
                    </div>
                    <div class="verb-stat-card">
                        <div class="verb-stat-icon">🎯</div>
                        <div class="verb-stat-info">
                            <h4>Yechilgan Mashqlar</h4>
                            <div class="stat-val" id="verb-solved-val">${state.totalSolved}</div>
                        </div>
                    </div>
                </div>

                <!-- Rejimlar Navigatsiyasi -->
                <div class="verb-modes-nav">
                    <button class="verb-mode-btn ${state.mode === 'quiz' ? 'active' : ''}" data-mode="quiz">
                        <span>🎯</span> Tezkor Test (Variantli)
                    </button>
                    <button class="verb-mode-btn ${state.mode === 'input' ? 'active' : ''}" data-mode="input">
                        <span>✍️</span> Yozma Mashq (Live Check)
                    </button>
                    <button class="verb-mode-btn ${state.mode === 'table' ? 'active' : ''}" data-mode="table">
                        <span>📊</span> Jadval Turlanishi
                    </button>
                    <button class="verb-mode-btn ${state.mode === 'daily' ? 'active' : ''}" data-mode="daily">
                        <span>📅</span> Kunlik Challenge (5 ta)
                    </button>
                    <button class="verb-mode-btn ${state.mode === 'library' ? 'active' : ''}" data-mode="library">
                        <span>📖</span> Fe'llar Lug'ati & Jadvali
                    </button>
                </div>

                <!-- Darajalar Filtri (Faqat mashq rejimlarida) -->
                ${state.mode !== 'daily' && state.mode !== 'library' ? `
                    <div class="verb-filters">
                        <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Daraja / Filtr:</span>
                        <div class="verb-filter-pills">
                            <button class="filter-pill ${state.levelFilter === 'ALL' ? 'active' : ''}" data-level="ALL">Barchasi</button>
                            <button class="filter-pill ${state.levelFilter === 'A1' ? 'active' : ''}" data-level="A1">🌱 A1 Asosiy</button>
                            <button class="filter-pill ${state.levelFilter === 'A2' ? 'active' : ''}" data-level="A2">🌿 A2 O'rta</button>
                            <button class="filter-pill ${state.levelFilter === 'B1' ? 'active' : ''}" data-level="B1">🌳 B1 Kuchli</button>
                            <button class="filter-pill ${state.levelFilter === 'irregular' ? 'active' : ''}" data-level="irregular">⚡ Tartibsiz fe'llar</button>
                        </div>
                    </div>
                ` : ''}

                <!-- Asosiy Ish Maydoni -->
                <div id="verb-active-area"></div>
            </div>

            <!-- Verb Detail Modal Container -->
            <div class="modal-overlay" id="verb-table-modal" style="display:none;">
                <div class="modal-container" style="max-width: 650px;">
                    <button class="modal-close" id="close-verb-table-modal">&times;</button>
                    <div class="modal-body" id="verb-table-modal-body"></div>
                </div>
            </div>
        `;

        bindHeaderEvents();
        renderActiveMode();
    }

    function bindHeaderEvents() {
        // Mode buttons
        document.querySelectorAll('.verb-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                state.mode = target.getAttribute('data-mode');
                renderVerbTrainer();
            });
        });

        // Filter pills
        document.querySelectorAll('.filter-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                state.levelFilter = target.getAttribute('data-level');
                renderVerbTrainer();
            });
        });

        // Close modal
        const closeBtn = document.getElementById('close-verb-table-modal');
        const modal = document.getElementById('verb-table-modal');
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.style.display = 'none');
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });
        }
    }

    function renderActiveMode() {
        const area = document.getElementById('verb-active-area');
        if (!area) return;

        if (state.mode === 'quiz') {
            renderQuizMode(area);
        } else if (state.mode === 'input') {
            renderInputMode(area);
        } else if (state.mode === 'table') {
            renderTableMode(area);
        } else if (state.mode === 'daily') {
            renderDailyMode(area);
        } else if (state.mode === 'library') {
            renderLibraryMode(area);
        }
    }

    // 1. QUIZ MODE (Multiple Choice)
    function renderQuizMode(area) {
        state.currentQuestion = generateQuestion();
        if (!state.currentQuestion) {
            area.innerHTML = `<p style="text-align:center; color: var(--text-secondary);">Fe'llar topilmadi.</p>`;
            return;
        }

        const q = state.currentQuestion;
        area.innerHTML = `
            <div class="verb-practice-container">
                <div class="verb-card-head">
                    <div class="verb-infinitive-box">
                        <span class="verb-infinitive">${q.verb.infinitive}</span>
                        <span class="verb-translation">— ${q.verb.translation}</span>
                        <button class="verb-audio-btn" id="verb-audio-btn" title="Nemischa talaffuz">
                            🔊 Eshitish
                        </button>
                    </div>
                    <div class="verb-meta-badges">
                        <span class="badge-level">${q.verb.level}</span>
                        <span class="badge-tense">${q.tenseLabel}</span>
                        <span class="badge-aux">Yordamchi: ${q.verb.auxiliary}</span>
                    </div>
                </div>

                <div class="verb-prompt-box">
                    <div class="verb-prompt-question">${q.questionText}</div>
                    <div class="verb-prompt-context">${q.contextText}</div>
                </div>

                <div class="verb-options-grid" id="verb-options-grid">
                    ${q.options.map(opt => `
                        <button class="verb-option-btn" data-val="${opt}">
                            <span>${opt}</span>
                            <span class="opt-status"></span>
                        </button>
                    `).join('')}
                </div>

                <div class="verb-feedback-box" id="verb-feedback-box"></div>

                <div class="verb-controls-bar">
                    <button class="verb-btn-secondary" id="verb-view-full-table-btn">
                        📖 Fe'lning to'liq jadvalini ko'rish
                    </button>
                    <button class="verb-btn-primary" id="verb-next-q-btn" style="display:none;">
                        Keyingi savol &rarr;
                    </button>
                </div>
            </div>
        `;

        // Ovoz
        const audioBtn = document.getElementById('verb-audio-btn');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => speakGerman(q.verb.infinitive));
        }

        // Full table modal
        const viewTableBtn = document.getElementById('verb-view-full-table-btn');
        if (viewTableBtn) {
            viewTableBtn.addEventListener('click', () => showVerbModal(q.verb));
        }

        // Option tanlash
        const optBtns = area.querySelectorAll('.verb-option-btn');
        const feedbackBox = document.getElementById('verb-feedback-box');
        const nextBtn = document.getElementById('verb-next-q-btn');

        optBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selected = btn.getAttribute('data-val');
                optBtns.forEach(b => b.disabled = true);

                const isCorrect = (selected.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
                if (isCorrect) {
                    btn.classList.add('correct');
                    state.streak += 1;
                    state.score += 10 + Math.min(state.streak * 2, 20);
                    state.totalSolved += 1;
                    saveStats();

                    feedbackBox.className = 'verb-feedback-box show feedback-success';
                    feedbackBox.innerHTML = `
                        <div class="feedback-title">✅ Barakalla! To'g'ri javob! (+${10 + Math.min(state.streak * 2, 20)} XP)</div>
                        <div class="feedback-desc"><strong>${q.verb.infinitive}</strong>: ${q.verb.notes || q.contextText}</div>
                    `;
                    speakGerman(q.correctAnswer);
                } else {
                    btn.classList.add('wrong');
                    // To'g'risini ham belgilash
                    optBtns.forEach(b => {
                        if (b.getAttribute('data-val').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
                            b.classList.add('correct');
                        }
                    });
                    state.streak = 0;
                    state.totalSolved += 1;
                    saveStats();

                    feedbackBox.className = 'verb-feedback-box show feedback-error';
                    feedbackBox.innerHTML = `
                        <div class="feedback-title">❌ Noto'g'ri javob!</div>
                        <div class="feedback-desc">To'g'ri javob: <strong>"${q.correctAnswer}"</strong>. <br>${q.verb.notes || ''}</div>
                    `;
                }

                nextBtn.style.display = 'inline-flex';
            });
        });

        nextBtn.addEventListener('click', () => renderQuizMode(area));
    }

    // 2. INPUT MODE (Yozma kiritish)
    function renderInputMode(area) {
        state.currentQuestion = generateQuestion();
        if (!state.currentQuestion) return;

        const q = state.currentQuestion;
        area.innerHTML = `
            <div class="verb-practice-container">
                <div class="verb-card-head">
                    <div class="verb-infinitive-box">
                        <span class="verb-infinitive">${q.verb.infinitive}</span>
                        <span class="verb-translation">— ${q.verb.translation}</span>
                        <button class="verb-audio-btn" id="verb-audio-btn" title="Nemischa talaffuz">🔊 Eshitish</button>
                    </div>
                    <div class="verb-meta-badges">
                        <span class="badge-level">${q.verb.level}</span>
                        <span class="badge-tense">${q.tenseLabel}</span>
                        <span class="badge-aux">Yordamchi: ${q.verb.auxiliary}</span>
                    </div>
                </div>

                <div class="verb-prompt-box">
                    <div class="verb-prompt-question">${q.questionText}</div>
                    <div class="verb-prompt-context">${q.contextText}</div>
                </div>

                <div class="verb-input-wrap">
                    <input type="text" id="verb-live-input" class="verb-input-field" placeholder="To'g'ri shaklni yozing..." autocomplete="off" autofocus>
                    
                    <!-- Maxsus Nemis harflari -->
                    <div class="german-keys-bar">
                        <span class="german-keys-label">Nemischa harflar:</span>
                        <button type="button" class="german-char-btn" data-char="ä">ä</button>
                        <button type="button" class="german-char-btn" data-char="ö">ö</button>
                        <button type="button" class="german-char-btn" data-char="ü">ü</button>
                        <button type="button" class="german-char-btn" data-char="ß">ß</button>
                        <button type="button" class="german-char-btn" data-char="Ä">Ä</button>
                        <button type="button" class="german-char-btn" data-char="Ö">Ö</button>
                        <button type="button" class="german-char-btn" data-char="Ü">Ü</button>
                    </div>
                </div>

                <div class="verb-feedback-box" id="verb-feedback-box"></div>

                <div class="verb-controls-bar">
                    <button class="verb-btn-secondary" id="verb-view-full-table-btn">
                        📖 Fe'l jadvalini ko'rish
                    </button>
                    <div style="display:flex; gap:10px;">
                        <button class="verb-btn-primary" id="verb-check-input-btn">
                            Tekshirish ↵
                        </button>
                        <button class="verb-btn-primary" id="verb-next-input-btn" style="display:none;">
                            Keyingisi &rarr;
                        </button>
                    </div>
                </div>
            </div>
        `;

        const inputField = document.getElementById('verb-live-input');
        const feedbackBox = document.getElementById('verb-feedback-box');
        const checkBtn = document.getElementById('verb-check-input-btn');
        const nextBtn = document.getElementById('verb-next-input-btn');

        // Speech
        document.getElementById('verb-audio-btn')?.addEventListener('click', () => speakGerman(q.verb.infinitive));
        document.getElementById('verb-view-full-table-btn')?.addEventListener('click', () => showVerbModal(q.verb));

        // German chars insertion
        area.querySelectorAll('.german-char-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ch = btn.getAttribute('data-char');
                if (inputField) {
                    inputField.value += ch;
                    inputField.focus();
                }
            });
        });

        function doCheck() {
            if (!inputField || inputField.disabled) return;
            const val = inputField.value.trim().toLowerCase();
            if (!val) return;

            inputField.disabled = true;
            checkBtn.style.display = 'none';
            nextBtn.style.display = 'inline-flex';

            const isCorrect = (val === q.correctAnswer.trim().toLowerCase());
            if (isCorrect) {
                inputField.classList.add('input-correct');
                state.streak += 1;
                state.score += 15 + Math.min(state.streak * 2, 20);
                state.totalSolved += 1;
                saveStats();

                feedbackBox.className = 'verb-feedback-box show feedback-success';
                feedbackBox.innerHTML = `
                    <div class="feedback-title">🎯 Ajoyib! To'g'ri yozdingiz! (+${15 + Math.min(state.streak * 2, 20)} XP)</div>
                    <div class="feedback-desc"><strong>${q.verb.infinitive}</strong>: ${q.verb.notes || q.contextText}</div>
                `;
                speakGerman(q.correctAnswer);
            } else {
                inputField.classList.add('input-wrong');
                state.streak = 0;
                state.totalSolved += 1;
                saveStats();

                feedbackBox.className = 'verb-feedback-box show feedback-error';
                feedbackBox.innerHTML = `
                    <div class="feedback-title">❌ Xatolik bor!</div>
                    <div class="feedback-desc">To'g'ri shakl: <strong>"${q.correctAnswer}"</strong>.</div>
                `;
            }
        }

        checkBtn.addEventListener('click', doCheck);
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (checkBtn.style.display !== 'none') doCheck();
                else nextBtn.click();
            }
        });

        nextBtn.addEventListener('click', () => renderInputMode(area));
    }

    // 3. TABLE MODE (To'liq turlanish matritsasi)
    function renderTableMode(area) {
        const verbs = getFilteredVerbs();
        const verb = getRandom(verbs);
        state.currentVerb = verb;

        // Tanlanadigan zamon (Präsens yoki Präteritum)
        const chosenTense = Math.random() > 0.5 ? 'praesens' : 'praeteritum';
        const tenseTitle = chosenTense === 'praesens' ? 'Präsens (Hozirgi zamon)' : 'Präteritum (O\'tgan zamon)';

        area.innerHTML = `
            <div class="verb-practice-container">
                <div class="verb-card-head">
                    <div class="verb-infinitive-box">
                        <span class="verb-infinitive">${verb.infinitive}</span>
                        <span class="verb-translation">— ${verb.translation}</span>
                        <button class="verb-audio-btn" id="verb-audio-btn">🔊 Eshitish</button>
                    </div>
                    <div class="verb-meta-badges">
                        <span class="badge-level">${verb.level}</span>
                        <span class="badge-tense">${tenseTitle}</span>
                        <span class="badge-aux">Perfekt: ${verb.perfekt.full}</span>
                    </div>
                </div>

                <div class="verb-prompt-box">
                    <div class="verb-prompt-question">Ushbu fe'lning ${tenseTitle}dagi barcha shaxs shakllarini to'ldiring:</div>
                    <div class="verb-prompt-context">Maslahat: Nemischa harflar uchun pastdagi tugmalardan foydalanishingiz mumkin.</div>
                </div>

                <div class="german-keys-bar" style="margin-bottom:15px;">
                    <span class="german-keys-label">Kiritish tugmalari:</span>
                    <button type="button" class="german-char-btn" data-char="ä">ä</button>
                    <button type="button" class="german-char-btn" data-char="ö">ö</button>
                    <button type="button" class="german-char-btn" data-char="ü">ü</button>
                    <button type="button" class="german-char-btn" data-char="ß">ß</button>
                </div>

                <div class="conjugation-matrix" id="conjugation-matrix">
                    ${PRONOUNS.map(p => `
                        <div class="conjugation-row">
                            <span class="conjugation-pronoun">${p.label}:</span>
                            <input type="text" class="conjugation-input" data-pronoun="${p.key}" placeholder="${verb.infinitive}..." autocomplete="off">
                        </div>
                    `).join('')}
                </div>

                <div class="verb-feedback-box" id="verb-feedback-box"></div>

                <div class="verb-controls-bar">
                    <button class="verb-btn-secondary" id="verb-view-full-table-btn">
                        📖 Barcha zamonlar jadvali
                    </button>
                    <div style="display:flex; gap:10px;">
                        <button class="verb-btn-primary" id="verb-check-table-btn">
                            Jadvalni tekshirish
                        </button>
                        <button class="verb-btn-primary" id="verb-next-table-btn" style="display:none;">
                            Yangi fe'l &rarr;
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('verb-audio-btn')?.addEventListener('click', () => speakGerman(verb.infinitive));
        document.getElementById('verb-view-full-table-btn')?.addEventListener('click', () => showVerbModal(verb));

        let lastFocusedInput = null;
        area.querySelectorAll('.conjugation-input').forEach(inp => {
            inp.addEventListener('focus', () => { lastFocusedInput = inp; });
        });

        area.querySelectorAll('.german-char-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ch = btn.getAttribute('data-char');
                if (lastFocusedInput) {
                    lastFocusedInput.value += ch;
                    lastFocusedInput.focus();
                }
            });
        });

        const checkBtn = document.getElementById('verb-check-table-btn');
        const nextBtn = document.getElementById('verb-next-table-btn');
        const feedbackBox = document.getElementById('verb-feedback-box');

        checkBtn.addEventListener('click', () => {
            let correctCount = 0;
            const inputs = area.querySelectorAll('.conjugation-input');

            inputs.forEach(inp => {
                const pKey = inp.getAttribute('data-pronoun');
                const targetVal = verb[chosenTense][pKey].trim().toLowerCase();
                const userVal = inp.value.trim().toLowerCase();

                inp.disabled = true;
                if (userVal === targetVal) {
                    inp.classList.add('correct');
                    correctCount++;
                } else {
                    inp.classList.add('wrong');
                    inp.value = `${inp.value || '—'} -> ${verb[chosenTense][pKey]}`;
                }
            });

            checkBtn.style.display = 'none';
            nextBtn.style.display = 'inline-flex';

            if (correctCount === 6) {
                state.streak += 1;
                state.score += 30;
                state.totalSolved += 1;
                saveStats();

                feedbackBox.className = 'verb-feedback-box show feedback-success';
                feedbackBox.innerHTML = `
                    <div class="feedback-title">🏆 Mukammal! 6/6 to'g'ri topildi! (+30 XP)</div>
                    <div class="feedback-desc">${verb.infinitive} — ${verb.translation}. Qoida: ${verb.notes}</div>
                `;
            } else {
                state.streak = 0;
                state.score += correctCount * 3;
                state.totalSolved += 1;
                saveStats();

                feedbackBox.className = 'verb-feedback-box show feedback-error';
                feedbackBox.innerHTML = `
                    <div class="feedback-title">Natija: ${correctCount}/6 to'g'ri</div>
                    <div class="feedback-desc">Xato qilingan katakchalarda to'g'ri variant ko'rsatildi. Mashq qilishda davom eting!</div>
                `;
            }
        });

        nextBtn.addEventListener('click', () => renderTableMode(area));
    }

    // 4. DAILY CHALLENGE MODE
    function renderDailyMode(area) {
        initDailyChallenge();
        const todayStr = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });

        if (state.dailyCompleted) {
            area.innerHTML = `
                <div class="verb-practice-container" style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 50px; margin-bottom: 15px;">🎉</div>
                    <h2 style="font-family: var(--font-serif); font-size: 26px; margin-bottom: 10px;">Bugungi Daily Challenge bajarildi!</h2>
                    <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 24px auto;">
                        Bugungi (${todayStr}) barcha 5 ta maxsus fe'l topshiriqlarini muvaffaqiyatli yakunladingiz. Ertaga yangi vazifalar sizni kutadi!
                    </p>
                    <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                        <button class="verb-btn-primary" data-action="verb-set-quiz">
                            Tezkor testga o'tish
                        </button>
                        <button class="verb-btn-secondary" data-action="verb-reset-daily">
                            🔄 Qayta yechish
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        const q = state.dailyQuestions[state.dailyIndex];
        if (!q) {
            // Hammasi tugadi
            state.dailyCompleted = true;
            localStorage.setItem('verb_daily_completed', 'true');
            state.score += 50; // Daily bonus
            saveStats();
            renderDailyMode(area);
            return;
        }

        area.innerHTML = `
            <div class="verb-practice-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px dashed rgba(255,255,255,0.12); padding-bottom: 14px;">
                    <div>
                        <span style="font-size: 13px; font-weight: 700; color: #a855f7;">📅 KUNLIK CHALLENGE</span>
                        <h3 style="margin: 4px 0 0 0; font-size: 18px;">Topshiriq ${state.dailyIndex + 1} / 5</h3>
                    </div>
                    <div style="font-size: 14px; font-weight: 600; color: #4ade80;">
                        To'g'ri: ${state.dailyScore} / ${state.dailyIndex}
                    </div>
                </div>

                <div class="verb-card-head">
                    <div class="verb-infinitive-box">
                        <span class="verb-infinitive">${q.verb.infinitive}</span>
                        <span class="verb-translation">— ${q.verb.translation}</span>
                        <button class="verb-audio-btn" id="verb-audio-btn">🔊 Eshitish</button>
                    </div>
                    <div class="verb-meta-badges">
                        <span class="badge-level">${q.verb.level}</span>
                        <span class="badge-tense">${q.tenseLabel}</span>
                    </div>
                </div>

                <div class="verb-prompt-box">
                    <div class="verb-prompt-question">${q.questionText}</div>
                    <div class="verb-prompt-context">${q.contextText}</div>
                </div>

                <div class="verb-options-grid" id="daily-options-grid">
                    ${q.options.map(opt => `
                        <button class="verb-option-btn" data-val="${opt}">
                            <span>${opt}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="verb-feedback-box" id="verb-feedback-box"></div>

                <div class="verb-controls-bar" style="justify-content: flex-end;">
                    <button class="verb-btn-primary" id="daily-next-btn" style="display:none;">
                        ${state.dailyIndex === 4 ? 'Natijani ko\'rish 🏆' : 'Keyingisi &rarr;'}
                    </button>
                </div>
            </div>
        `;

        document.getElementById('verb-audio-btn')?.addEventListener('click', () => speakGerman(q.verb.infinitive));

        const optBtns = area.querySelectorAll('.verb-option-btn');
        const feedbackBox = document.getElementById('verb-feedback-box');
        const nextBtn = document.getElementById('daily-next-btn');

        optBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selected = btn.getAttribute('data-val');
                optBtns.forEach(b => b.disabled = true);

                const isCorrect = (selected.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
                if (isCorrect) {
                    btn.classList.add('correct');
                    state.dailyScore++;
                    state.score += 15;
                    feedbackBox.className = 'verb-feedback-box show feedback-success';
                    feedbackBox.innerHTML = `<div class="feedback-title">✅ To'g'ri! (+15 XP)</div>`;
                    speakGerman(q.correctAnswer);
                } else {
                    btn.classList.add('wrong');
                    optBtns.forEach(b => {
                        if (b.getAttribute('data-val').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
                            b.classList.add('correct');
                        }
                    });
                    feedbackBox.className = 'verb-feedback-box show feedback-error';
                    feedbackBox.innerHTML = `<div class="feedback-title">❌ To'g'ri javob: "${q.correctAnswer}"</div>`;
                }

                saveStats();
                nextBtn.style.display = 'inline-flex';
            });
        });

        nextBtn.addEventListener('click', () => {
            state.dailyIndex++;
            renderDailyMode(area);
        });
    }

    // 5. LIBRARY & DICTIONARY MODE (Lug'at va ma'lumotnoma)
    function renderLibraryMode(area) {
        const db = window.GERMAN_VERBS_DB || [];

        area.innerHTML = `
            <div class="verb-dict-container">
                <input type="text" id="verb-search-box" class="verb-search-input" placeholder="🔍 Fe'lni nemischa yoki o'zbekcha qidiring (masalan: sprechen, yozmoq)...">
                
                <div class="verb-cards-grid" id="verb-cards-grid"></div>
            </div>
        `;

        const searchBox = document.getElementById('verb-search-box');
        const grid = document.getElementById('verb-cards-grid');

        function renderGrid(filterText = '') {
            const query = filterText.trim().toLowerCase();
            const filtered = db.filter(v => 
                v.infinitive.toLowerCase().includes(query) ||
                v.translation.toLowerCase().includes(query)
            );

            if (!filtered.length) {
                grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-secondary);">Hech qanday fe'l topilmadi.</p>`;
                return;
            }

            grid.innerHTML = filtered.map(v => `
                <div class="verb-dict-card" data-id="${v.id}">
                    <div class="dict-card-head">
                        <span class="dict-card-verb">${v.infinitive}</span>
                        <span class="badge-level">${v.level}</span>
                    </div>
                    <div class="dict-card-uz">${v.translation}</div>
                    <div class="dict-card-tenses">
                        <div><strong>Präsens (er):</strong> ${v.praesens.er_sie_es}</div>
                        <div><strong>Präteritum (er):</strong> ${v.praeteritum.er_sie_es}</div>
                        <div><strong>Perfekt:</strong> ${v.perfekt.full}</div>
                    </div>
                </div>
            `).join('');

            grid.querySelectorAll('.verb-dict-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-id');
                    const verb = db.find(x => x.id === id);
                    if (verb) showVerbModal(verb);
                });
            });
        }

        renderGrid();

        if (searchBox) {
            searchBox.addEventListener('input', (e) => {
                renderGrid(e.target.value);
            });
        }
    }

    // Verb Table Modalni ko'rsatish
    function showVerbModal(verb) {
        const modal = document.getElementById('verb-table-modal');
        const body = document.getElementById('verb-table-modal-body');
        if (!modal || !body) return;

        body.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; border-bottom: 1px dashed rgba(255,255,255,0.15); padding-bottom: 12px;">
                <div>
                    <h2 style="font-size: 26px; color: #a855f7; margin: 0;">${verb.infinitive}</h2>
                    <div style="font-size: 15px; color: var(--text-secondary); margin-top: 4px;">${verb.translation}</div>
                </div>
                <button class="verb-audio-btn" id="modal-audio-btn">🔊 Talaffuz</button>
            </div>

            <div style="margin-bottom: 16px; font-size: 13px; color: #cbd5e1; background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: 10px;">
                <strong>Izoh:</strong> ${verb.notes || "Muntazam turlanuvchi fe'l."}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div style="background: rgba(15,23,42,0.6); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                    <h4 style="margin: 0 0 10px 0; color: #60a5fa; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px;">Präsens</h4>
                    ${PRONOUNS.map(p => `
                        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                            <span style="color: var(--text-secondary);">${p.key}:</span>
                            <strong>${verb.praesens[p.key]}</strong>
                        </div>
                    `).join('')}
                </div>

                <div style="background: rgba(15,23,42,0.6); padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                    <h4 style="margin: 0 0 10px 0; color: #c084fc; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px;">Präteritum</h4>
                    ${PRONOUNS.map(p => `
                        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                            <span style="color: var(--text-secondary);">${p.key}:</span>
                            <strong>${verb.praeteritum[p.key]}</strong>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.3); padding: 12px 16px; border-radius: 12px; margin-bottom: 18px;">
                <div style="font-weight: 700; color: #facc15; font-size: 14px; margin-bottom: 4px;">Perfekt Zamon:</div>
                <div style="font-size: 15px; color: #fff;">${verb.perfekt.full} (Yordamchi fe'l: <strong>${verb.perfekt.auxiliary}</strong>)</div>
            </div>

            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                <strong>Misol:</strong> <em>"${verb.example}"</em>
            </div>
        `;

        document.getElementById('modal-audio-btn')?.addEventListener('click', () => speakGerman(verb.infinitive));
        modal.style.display = 'flex';
    }

    // Global Obyekt Eksport qilish
    window.verbTrainerApp = {
        init: function () {
            renderVerbTrainer();
        },
        setMode: function (newMode) {
            state.mode = newMode;
            renderVerbTrainer();
        },
        resetDaily: function () {
            state.dailyCompleted = false;
            localStorage.removeItem('verb_daily_completed');
            renderVerbTrainer();
        }
    };

    // DOM tayyor bo'lganda
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('verb-trainer-content')) {
                window.verbTrainerApp.init();
            }
        });
    } else {
        if (document.getElementById('verb-trainer-content')) {
            window.verbTrainerApp.init();
        }
    }
})();
