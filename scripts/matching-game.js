// ===== MATCHING PAIRS & SPEED QUIZ — 3D Vision Interactive Game Modules =====
// Abdugofforov Platform — Apple VisionOS & Spatial UI uslubidagi interaktiv o'yinlar

// 3D Tilt va yorug'lik aksini kuzatuvchi funksiya
function initVision3DTilt(containerSelector) {
    const sel = containerSelector || '.match-card:not(.matched), .game-mode-card, .sq-option';
    const cards = document.querySelectorAll(sel);
    cards.forEach(card => {
        if (card._visionTiltBound) return;
        card._visionTiltBound = true;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rx = ((y - cy) / cy) * -10;
            const ry = ((x - cx) / cx) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(10px)`;
            card.style.setProperty('--glare-x', `${((x / rect.width) * 100).toFixed(1)}%`);
            card.style.setProperty('--glare-y', `${((y / rect.height) * 100).toFixed(1)}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ============================================================
// 1. MATCHING PAIRS (3D Vision So'zlarni juftlash mini-o'yini)
// ============================================================
const MatchingGame = {
    cards: [],
    selected: [],
    matched: [],
    moves: 0,
    startTime: 0,
    timerInterval: null,
    currentDeck: null,
    pairCount: 8, // 8 juftlik = 16 karta

    start(deckKey) {
        this.currentDeck = deckKey || 'de_uz';
        const deck = flashcardDecks[this.currentDeck];
        if (!deck || deck.length < this.pairCount) {
            alert('Bu to\'plamda yetarli kartochka yo\'q!');
            return;
        }

        // Tasodifiy 8 ta kartochka tanlash
        const shuffled = [...deck].sort(() => Math.random() - 0.5).slice(0, this.pairCount);

        // Har bir kartochkadan 2 ta karta yaratish (front va back)
        this.cards = [];
        shuffled.forEach((card, idx) => {
            this.cards.push({
                id: idx * 2,
                pairId: idx,
                text: card.front,
                type: 'front'
            });
            this.cards.push({
                id: idx * 2 + 1,
                pairId: idx,
                text: card.back,
                type: 'back'
            });
        });

        // Kartalarni aralashtirish
        this.cards.sort(() => Math.random() - 0.5);
        this.selected = [];
        this.matched = [];
        this.moves = 0;
        this.startTime = Date.now();

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);

        this.render();
    },

    updateTimer() {
        const el = document.getElementById('matching-timer');
        if (el) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
            const sec = String(elapsed % 60).padStart(2, '0');
            el.textContent = `${min}:${sec}`;
        }
    },

    selectCard(cardId) {
        if (this.selected.length >= 2) return;
        if (this.matched.includes(cardId)) return;
        if (this.selected.find(s => s.id === cardId)) return;

        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;

        this.selected.push(card);

        // Kartani ochish 3D animatsiyasi
        const el = document.getElementById(`match-card-${cardId}`);
        if (el) {
            el.classList.add('flipped');
            const back = el.querySelector('.match-card-back');
            if (back) back.textContent = card.text;
        }

        if (this.selected.length === 2) {
            this.moves++;
            this.updateMoves();
            setTimeout(() => this.checkMatch(), 650);
        }
    },

    checkMatch() {
        const [a, b] = this.selected;
        if (!a || !b) return;

        const elA = document.getElementById(`match-card-${a.id}`);
        const elB = document.getElementById(`match-card-${b.id}`);

        if (a.pairId === b.pairId && a.type !== b.type) {
            // To'g'ri juftlik topildi!
            this.matched.push(a.id, b.id);
            if (elA) elA.classList.add('matched');
            if (elB) elB.classList.add('matched');

            // Ovozli effekt
            this.playSound('correct');

            // Barcha juftliklar topildimi?
            if (this.matched.length === this.cards.length) {
                clearInterval(this.timerInterval);
                setTimeout(() => this.showResults(), 600);
            }
        } else {
            // Noto'g'ri — kartalarni 3D silkiniw bilan yopish
            this.playSound('wrong');
            if (elA) elA.classList.add('shake-wrong');
            if (elB) elB.classList.add('shake-wrong');

            setTimeout(() => {
                if (elA) {
                    elA.classList.remove('flipped', 'shake-wrong');
                }
                if (elB) {
                    elB.classList.remove('flipped', 'shake-wrong');
                }
            }, 600);
        }
        this.selected = [];
    },

    playSound(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.value = 0.15;

            if (type === 'correct') {
                osc.frequency.value = 587.33; // D5
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.18, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
            } else {
                osc.frequency.value = 180;
                osc.type = 'sawtooth';
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.25);
            }
        } catch (e) {
            // Audio context brauzer cheklovi bo'lsa xatosiz o'tadi
        }
    },

    updateMoves() {
        const el = document.getElementById('matching-moves');
        if (el) el.textContent = this.moves;
    },

    showResults() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const min = Math.floor(elapsed / 60);
        const sec = elapsed % 60;
        const timeStr = min > 0 ? `${min} daqiqa ${sec} soniya` : `${sec} soniya`;

        // Ball va XP hisoblash
        let stars = 3;
        if (this.moves > 14) stars = 2;
        if (this.moves > 20) stars = 1;

        const baseXP = 30;
        const movesBonus = Math.max(0, (16 - this.moves) * 2);
        const timeBonus = Math.max(0, (60 - elapsed));
        const totalXP = baseXP + movesBonus + timeBonus;

        // Saqlash
        const savedXP = parseInt(localStorage.getItem('matching_total_xp') || '0');
        localStorage.setItem('matching_total_xp', savedXP + totalXP);

        const view = document.getElementById('flashcards-content') || document.getElementById('matching-game-area');
        if (!view) return;

        view.innerHTML = `
            <div class="matching-results vision-scene">
                <div class="matching-results-icon">${stars === 3 ? '🏆' : stars === 2 ? '⭐' : '👍'}</div>
                <h3 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">${stars === 3 ? 'Ajoyib natija!' : "G'alaba!"}</h3>
                <p style="color:var(--text-secondary); margin-bottom:20px;">Barcha 8 ta juftlikni muvaffaqiyatli topdingiz!</p>
                <div class="matching-stats-grid">
                    <div class="matching-stat">
                        <span class="stat-value">${this.moves}</span>
                        <span class="stat-label">🔄 Urinishlar</span>
                    </div>
                    <div class="matching-stat">
                        <span class="stat-value">${elapsed}s</span>
                        <span class="stat-label">⏱️ Vaqt</span>
                    </div>
                    <div class="matching-stat">
                        <span class="stat-value">+${totalXP}</span>
                        <span class="stat-label">✨ Olingan XP</span>
                    </div>
                    <div class="matching-stat">
                        <span class="stat-value">${'⭐'.repeat(stars)}</span>
                        <span class="stat-label">Reyting</span>
                    </div>
                </div>
                <div class="matching-actions">
                    <button class="btn-primary vision-btn" data-click="MatchingGame.start('${this.currentDeck}')">🔄 Qayta o'ynash</button>
                    <button class="btn-secondary vision-btn" data-click="showMatchingHome()">📋 Boshqa to'plam</button>
                </div>
            </div>
        `;
    },

    render() {
        const view = document.getElementById('flashcards-content') || document.getElementById('matching-game-area');
        if (!view) return;

        const deckInfo = (typeof FC_ALL_DECKS !== 'undefined' ? FC_ALL_DECKS : []).find(d => d.key === this.currentDeck);
        const deckName = deckInfo && window.i18n ? i18n.t(deckInfo.i) : this.currentDeck;

        view.innerHTML = `
            <div class="matching-container vision-scene">
                <div class="matching-header vision-card">
                    <button class="btn-secondary btn-sm vision-btn" data-click="showMatchingHome()">⬅ Orqaga</button>
                    <div class="matching-info">
                        <span class="matching-info-item">🔄 Urinishlar: <b id="matching-moves">0</b></span>
                        <span class="matching-info-item">⏱️ <b id="matching-timer">00:00</b></span>
                        <span class="matching-info-item">📦 ${escapeHTML(deckName)}</span>
                    </div>
                </div>
                <div class="matching-grid" id="matching-game-area">
                    ${this.cards.map(card => `
                        <div class="match-card match-card-3d ${this.matched.includes(card.id) ? 'matched flipped' : ''}"
                             id="match-card-${card.id}"
                             data-click="MatchingGame.selectCard(${card.id})">
                            <div class="vision-glare"></div>
                            <div class="match-card-front">❓</div>
                            <div class="match-card-back">${this.matched.includes(card.id) ? escapeHTML(card.text) : ''}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        setTimeout(() => initVision3DTilt('.match-card:not(.matched)'), 60);
    }
};

// ============================================================
// 2. SPEED QUIZ (3D Cyber-HUD Tezkor Test — Time Attack)
// ============================================================
const SpeedQuiz = {
    questions: [],
    currentIdx: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    timeLeft: 60,
    timerInterval: null,
    isRunning: false,
    currentDeck: null,
    totalAnswered: 0,

    start(deckKey) {
        this.currentDeck = deckKey || 'de_uz';
        const deck = flashcardDecks[this.currentDeck];
        if (!deck || deck.length < 4) {
            alert('Bu to\'plamda yetarli kartochka yo\'q!');
            return;
        }

        // 4 xil variant bilan test savollarini generatsiya qilish
        this.questions = this.generateQuestions(deck, 30);
        this.currentIdx = 0;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.timeLeft = 60;
        this.totalAnswered = 0;
        this.isRunning = true;

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);

        this.render();
    },

    generateQuestions(deck, count) {
        const questions = [];
        const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);

        for (let i = 0; i < Math.min(count, shuffledDeck.length); i++) {
            const correct = shuffledDeck[i];
            // 3 ta noto'g'ri javob
            const wrongs = deck
                .filter(c => c.back !== correct.back)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            const options = [
                { text: correct.back, correct: true },
                ...wrongs.map(w => ({ text: w.back, correct: false }))
            ].sort(() => Math.random() - 0.5);

            questions.push({
                question: correct.front,
                options: options,
                correctAnswer: correct.back
            });
        }
        return questions;
    },

    answer(idx) {
        if (!this.isRunning) return;
        const q = this.questions[this.currentIdx];
        if (!q) return;

        const isCorrect = q.options[idx].correct;
        this.totalAnswered++;

        // 3D Animatsiya
        const btns = document.querySelectorAll('.sq-option');
        btns.forEach((btn, i) => {
            btn.disabled = true;
            if (q.options[i].correct) btn.classList.add('sq-correct');
            if (i === idx && !isCorrect) btn.classList.add('sq-wrong');
        });

        if (isCorrect) {
            this.streak++;
            if (this.streak > this.bestStreak) this.bestStreak = this.streak;
            const streakBonus = Math.min(this.streak, 5);
            this.score += 10 + (streakBonus * 2);
            // Bonus vaqt +2 sekund
            this.timeLeft = Math.min(this.timeLeft + 2, 99);
            MatchingGame.playSound('correct');
        } else {
            this.streak = 0;
            MatchingGame.playSound('wrong');
        }

        this.updateScoreUI();

        setTimeout(() => {
            this.currentIdx++;
            if (this.currentIdx >= this.questions.length) {
                this.endGame();
            } else {
                this.renderQuestion();
            }
        }, 550);
    },

    updateTimerUI() {
        const el = document.getElementById('sq-timer');
        const orb = document.getElementById('sq-timer-orb');
        if (el) {
            el.textContent = this.timeLeft;
            if (orb) {
                orb.classList.toggle('danger', this.timeLeft <= 10);
            }
        }
    },

    updateScoreUI() {
        const scoreEl = document.getElementById('sq-score');
        const streakEl = document.getElementById('sq-streak');
        if (scoreEl) scoreEl.textContent = this.score;
        if (streakEl) {
            streakEl.innerHTML = this.streak > 1 ?
                `<span class="sq-streak-badge">🔥 ${this.streak}x COMBO</span>` : '';
        }
    },

    endGame() {
        this.isRunning = false;
        clearInterval(this.timerInterval);

        const xp = this.score;
        const savedXP = parseInt(localStorage.getItem('speedquiz_total_xp') || '0');
        const bestScore = parseInt(localStorage.getItem('speedquiz_best_score') || '0');
        localStorage.setItem('speedquiz_total_xp', savedXP + xp);
        if (this.score > bestScore) {
            localStorage.setItem('speedquiz_best_score', this.score);
        }

        const view = document.getElementById('speed-quiz-content');
        if (!view) return;

        const isNewBest = this.score > bestScore;

        view.innerHTML = `
            <div class="sq-results vision-scene">
                <div class="sq-results-icon">${isNewBest ? '🏆' : '🎯'}</div>
                <h3 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">${isNewBest ? 'Yangi Rekord!' : 'Vaqt tugadi!'}</h3>
                ${isNewBest ? '<p style="color: #f59e0b; font-weight: 600;">🎉 Tabriklaymiz! Yangi eng yuqori natija!</p>' : ''}
                <div class="matching-stats-grid">
                    <div class="matching-stat">
                        <span class="stat-value">${this.score}</span>
                        <span class="stat-label">🏆 Ball</span>
                    </div>
                    <div class="matching-stat">
                        <span class="stat-value">${this.totalAnswered}</span>
                        <span class="stat-label">📝 Javoblar</span>
                    </div>
                    <div class="matching-stat">
                        <span class="stat-value">${this.bestStreak}x</span>
                        <span class="stat-label">🔥 Eng uzun streak</span>
                    </div>
                    <div class="matching-stat">
                        <span class="stat-value">${Math.max(bestScore, this.score)}</span>
                        <span class="stat-label">👑 Eng yaxshi</span>
                    </div>
                </div>
                <div class="matching-actions">
                    <button class="btn-primary vision-btn" data-click="SpeedQuiz.start('${this.currentDeck}')">⚡ Qayta o'ynash</button>
                    <button class="btn-secondary vision-btn" data-click="showMatchingHome()">📋 Boshqa rejim</button>
                </div>
            </div>
        `;
    },

    renderQuestion() {
        const q = this.questions[this.currentIdx];
        if (!q) return;

        const area = document.getElementById('speed-quiz-content');
        if (!area) return;

        area.innerHTML = `
            <div class="sq-question-area vision-scene">
                <div class="sq-question-number">SAVOL ${this.currentIdx + 1} / ${this.questions.length}</div>
                <div class="sq-question-text vision-card">${escapeHTML(q.question)}</div>
                <div class="sq-options">
                    ${q.options.map((opt, i) => `
                        <button class="sq-option vision-btn" data-click="SpeedQuiz.answer(${i})">
                            <span class="sq-option-key">${String.fromCharCode(65 + i)}</span>
                            <span>${escapeHTML(opt.text)}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        setTimeout(() => initVision3DTilt('.sq-option'), 60);
    },

    render() {
        const view = document.getElementById('flashcards-content') || document.getElementById('matching-game-area');
        if (!view) return;

        view.innerHTML = `
            <div class="sq-container vision-scene">
                <div class="sq-header vision-card">
                    <button class="btn-secondary btn-sm vision-btn" data-click="showMatchingHome()">⬅ Orqaga</button>
                    <div class="sq-stats">
                        <span class="vision-badge">🏆 <b id="sq-score">0</b> XP</span>
                        <span id="sq-streak"></span>
                    </div>
                    <div class="vision-timer-orb" id="sq-timer-orb">
                        <span id="sq-timer" class="sq-timer-value">${this.timeLeft}</span>
                        <small style="font-size:8px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:0.5px;">SEK</small>
                    </div>
                </div>
                <div id="speed-quiz-content"></div>
            </div>
        `;
        this.renderQuestion();
    }
};

// ============================================================
// 3. 3D VISION GAME HUB (Rejimlar Portali)
// ============================================================
function showMatchingHome() {
    if (MatchingGame.timerInterval) clearInterval(MatchingGame.timerInterval);
    if (SpeedQuiz.timerInterval) clearInterval(SpeedQuiz.timerInterval);
    SpeedQuiz.isRunning = false;

    const view = document.getElementById('flashcards-content');
    if (!view) return;

    const matchXP = parseInt(localStorage.getItem('matching_total_xp') || '0');
    const speedXP = parseInt(localStorage.getItem('speedquiz_total_xp') || '0');
    const bestScore = parseInt(localStorage.getItem('speedquiz_best_score') || '0');
    const decks = typeof FC_ALL_DECKS !== 'undefined' ? FC_ALL_DECKS : [];

    view.innerHTML = `
        <div style="text-align:center; margin-bottom:32px;" class="vision-scene">
            <div style="font-size:52px; margin-bottom:12px; filter:drop-shadow(0 8px 20px rgba(56,189,248,0.4));">🎮</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:32px; margin-bottom:8px; color:var(--text-primary);">3D Vision O'yinlar</h2>
            <p style="color:var(--text-secondary); max-width:540px; margin:0 auto;">Nemis tilini fazoviy shisha UI va immersiv interaktiv o'yinlar orqali o'rganing!</p>
            <div style="margin-top:16px; display:inline-flex; gap:16px; align-items:center; background:var(--vision-glass-bg); border:1px solid var(--vision-glass-border); padding:10px 22px; border-radius:30px; font-size:13px; box-shadow:0 6px 20px rgba(0,0,0,0.25);">
                🏆 Matching: <b style="color:#38bdf8;">${matchXP} XP</b> &nbsp;|&nbsp; ⚡ Speed: <b style="color:#f59e0b;">${speedXP} XP</b> (Rekord: ${bestScore})
            </div>
        </div>

        <div class="game-mode-grid vision-scene">
            <!-- 1. Matching Pairs -->
            <div class="game-mode-card matching-mode vision-card">
                <div class="vision-glare"></div>
                <div class="game-mode-icon">🧩</div>
                <h3>Matching Pairs</h3>
                <p>So'zlarni juftlash — xotirani mustahkamlash uchun 16 ta 3D shisha kartochkani juftlab oching!</p>
                <div class="game-mode-decks">
                    <span class="game-mode-label">To'plamni tanlang:</span>
                    ${decks.filter(d => flashcardDecks[d.key] && flashcardDecks[d.key].length >= 8).map(d => `
                        <button class="btn-secondary btn-sm vision-btn" data-click="MatchingGame.start('${d.key}')">
                            ${window.i18n ? i18n.t(d.i) : d.key}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- 2. Speed Quiz -->
            <div class="game-mode-card speed-mode vision-card">
                <div class="vision-glare"></div>
                <div class="game-mode-icon">⚡</div>
                <h3>Speed Quiz</h3>
                <p>60 soniya ichida imkon qadar ko'proq to'g'ri javob bering! 3D Cyber-HUD va combo bonuslari!</p>
                <div class="game-mode-decks">
                    <span class="game-mode-label">To'plamni tanlang:</span>
                    ${decks.filter(d => flashcardDecks[d.key] && flashcardDecks[d.key].length >= 4).map(d => `
                        <button class="btn-secondary btn-sm vision-btn" data-click="SpeedQuiz.start('${d.key}')">
                            ${window.i18n ? i18n.t(d.i) : d.key}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- 3. Horror Deutsch -->
            <div class="game-mode-card horror-mode vision-card">
                <div class="vision-glare"></div>
                <div class="game-mode-icon">🩸</div>
                <h3 style="color:#ef4444;">Horror Deutsch</h3>
                <p>Qorong'u gotik qal'ada omon qolish va nemis tili testlaridan xatosiz o'tish kvesti!</p>
                <div class="game-mode-decks">
                    <button class="btn-primary vision-btn" style="background:#dc2626; border-color:#ef4444;" data-click="if(typeof openHorrorHome==='function'){openHorrorHome();}else{alert('Horror rejim yuklanmoqda...');}">
                        🏰 Qal'aga kirish
                    </button>
                </div>
            </div>

            <!-- 4. Fe'llar Trenajyori -->
            <div class="game-mode-card verbs-mode vision-card">
                <div class="vision-glare"></div>
                <div class="game-mode-icon">🧪</div>
                <h3 style="color:#a855f7;">Fe'llar Trenajyori</h3>
                <p>Kuchli va noto'g'ri fe'llarning 3 ta shaklini (Infinitiv, Präteritum, Partizip II) yodlash!</p>
                <div class="game-mode-decks">
                    <button class="btn-primary vision-btn" style="background:#7c3aed; border-color:#a855f7;" data-click="if(typeof openVerbTrainerView==='function'){openVerbTrainerView();}else{alert('Fe\'llar trenajyori ochilmoqda...');}">
                        ⚡ Mashg'ulotni boshlash
                    </button>
                </div>
            </div>
        </div>

        <div style="text-align:center; margin-top:32px;">
            <button class="btn-secondary vision-btn" data-click="renderFlashcardsHome()">🃏 Kartochkalarga qaytish</button>
        </div>
    `;

    setTimeout(() => initVision3DTilt('.game-mode-card'), 60);
}
