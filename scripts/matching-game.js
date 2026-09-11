// ===== MATCHING PAIRS & SPEED QUIZ — Interactive Game Modules =====
// Abdugofforov Platform — Nemis tili o'rganish uchun 2 ta yangi rejim

// ============================================================
// 1. MATCHING PAIRS (So'zlarni juftlash mini-o'yini)
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

        // Kartani ochish animatsiyasi
        const el = document.getElementById(`match-card-${cardId}`);
        if (el) {
            el.classList.add('flipped');
            el.querySelector('.match-card-back').textContent = card.text;
        }

        if (this.selected.length === 2) {
            this.moves++;
            this.updateMoves();
            setTimeout(() => this.checkMatch(), 700);
        }
    },

    checkMatch() {
        const [a, b] = this.selected;
        if (a.pairId === b.pairId && a.type !== b.type) {
            // To'g'ri juftlik topildi!
            this.matched.push(a.id, b.id);
            const elA = document.getElementById(`match-card-${a.id}`);
            const elB = document.getElementById(`match-card-${b.id}`);
            if (elA) elA.classList.add('matched');
            if (elB) elB.classList.add('matched');

            // Ovozli effekt
            this.playSound('correct');

            // Barcha juftliklar topildimi?
            if (this.matched.length === this.cards.length) {
                clearInterval(this.timerInterval);
                setTimeout(() => this.showResults(), 500);
            }
        } else {
            // Noto'g'ri — kartalarni yopish
            this.playSound('wrong');
            setTimeout(() => {
                const elA = document.getElementById(`match-card-${a.id}`);
                const elB = document.getElementById(`match-card-${b.id}`);
                if (elA) elA.classList.remove('flipped');
                if (elB) elB.classList.remove('flipped');
            }, 400);
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
                osc.frequency.value = 523;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            } else {
                osc.frequency.value = 200;
                osc.type = 'square';
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.2);
            }
        } catch (e) { /* Audio not supported */ }
    },

    updateMoves() {
        const el = document.getElementById('matching-moves');
        if (el) el.textContent = this.moves;
    },

    showResults() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const min = Math.floor(elapsed / 60);
        const sec = elapsed % 60;
        const stars = this.moves <= this.pairCount + 2 ? '⭐⭐⭐' :
                      this.moves <= this.pairCount + 6 ? '⭐⭐' : '⭐';
        const xp = this.moves <= this.pairCount + 2 ? 50 :
                   this.moves <= this.pairCount + 6 ? 30 : 15;

        // XP saqlash
        const savedXP = parseInt(localStorage.getItem('matching_total_xp') || '0');
        localStorage.setItem('matching_total_xp', savedXP + xp);

        const container = document.getElementById('matching-game-area');
        if (!container) return;

        container.innerHTML = `
            <div class="matching-results">
                <div class="matching-results-icon">🎉</div>
                <h3>Tabriklaymiz!</h3>
                <p>Barcha juftliklarni topdingiz!</p>
                <div class="matching-stats-grid">
                    <div class="matching-stat">
                        <span class="stat-value">${min > 0 ? min + ' daq ' : ''}${sec} sek</span>
                        <span class="stat-label">⏱️ Vaqt</span>
                    </div>
                    <div class="matching-stat">
                        <span class="stat-value">${this.moves}</span>
                        <span class="stat-label">🔄 Urinishlar</span>
                    </div>
                    <div class="matching-stat">
                        <span class="stat-value">${stars}</span>
                        <span class="stat-label">Baho</span>
                    </div>
                    <div class="matching-stat">
                        <span class="stat-value">+${xp} XP</span>
                        <span class="stat-label">🏆 Ball</span>
                    </div>
                </div>
                <div class="matching-actions">
                    <button class="btn-primary" data-click="MatchingGame.start('${this.currentDeck}')">🔄 Qayta o'ynash</button>
                    <button class="btn-secondary" data-click="showMatchingHome()">📋 Boshqa to'plam</button>
                </div>
            </div>
        `;
    },

    render() {
        const view = document.getElementById('flashcards-content') || document.getElementById('matching-game-area');
        if (!view) return;

        const deckInfo = FC_ALL_DECKS.find(d => d.key === this.currentDeck);
        const deckName = deckInfo && window.i18n ? i18n.t(deckInfo.i) : this.currentDeck;

        view.innerHTML = `
            <div class="matching-container">
                <div class="matching-header">
                    <button class="btn-secondary btn-sm" data-click="showMatchingHome()">⬅ Orqaga</button>
                    <div class="matching-info">
                        <span>🔄 Urinishlar: <b id="matching-moves">0</b></span>
                        <span>⏱️ <b id="matching-timer">00:00</b></span>
                        <span>📦 ${escapeHTML(deckName)}</span>
                    </div>
                </div>
                <div class="matching-grid" id="matching-game-area">
                    ${this.cards.map(card => `
                        <div class="match-card ${this.matched.includes(card.id) ? 'matched flipped' : ''}"
                             id="match-card-${card.id}"
                             data-click="MatchingGame.selectCard(${card.id})">
                            <div class="match-card-front">❓</div>
                            <div class="match-card-back">${this.matched.includes(card.id) ? escapeHTML(card.text) : ''}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

// ============================================================
// 2. SPEED QUIZ (Tezkor Test — Time Attack rejimi)
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

        // Animatsiya
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
        }, 600);
    },

    updateTimerUI() {
        const el = document.getElementById('sq-timer');
        if (el) {
            el.textContent = this.timeLeft;
            el.className = 'sq-timer-value' + (this.timeLeft <= 10 ? ' sq-timer-danger' : '');
        }
        // Timer bar
        const bar = document.getElementById('sq-timer-bar');
        if (bar) {
            bar.style.width = `${(this.timeLeft / 60) * 100}%`;
            if (this.timeLeft <= 10) bar.classList.add('danger');
        }
    },

    updateScoreUI() {
        const scoreEl = document.getElementById('sq-score');
        const streakEl = document.getElementById('sq-streak');
        if (scoreEl) scoreEl.textContent = this.score;
        if (streakEl) {
            streakEl.textContent = this.streak > 0 ? `🔥 ${this.streak}x` : '';
        }
    },

    endGame() {
        this.isRunning = false;
        clearInterval(this.timerInterval);

        const accuracy = this.totalAnswered > 0 ?
            Math.round((this.score / (this.totalAnswered * 12)) * 100) : 0;
        const xp = this.score;

        // XP saqlash
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
            <div class="sq-results">
                <div class="sq-results-icon">${isNewBest ? '🏆' : '🎯'}</div>
                <h3>${isNewBest ? 'Yangi Rekord!' : 'Vaqt tugadi!'}</h3>
                ${isNewBest ? '<p style="color: #f59e0b; font-weight: 600;">🎉 Tabriklaymiz! Yangi eng yaxshi natija!</p>' : ''}
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
                    <button class="btn-primary" data-click="SpeedQuiz.start('${this.currentDeck}')">⚡ Qayta o'ynash</button>
                    <button class="btn-secondary" data-click="showMatchingHome()">📋 Boshqa rejim</button>
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
            <div class="sq-question-area">
                <div class="sq-question-number">${this.currentIdx + 1} / ${this.questions.length}</div>
                <div class="sq-question-text">${escapeHTML(q.question)}</div>
                <div class="sq-options">
                    ${q.options.map((opt, i) => `
                        <button class="sq-option" data-click="SpeedQuiz.answer(${i})">
                            <span class="sq-option-key">${String.fromCharCode(65 + i)}</span>
                            ${escapeHTML(opt.text)}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    render() {
        const view = document.getElementById('flashcards-content') || document.getElementById('matching-game-area');
        if (!view) return;

        view.innerHTML = `
            <div class="sq-container">
                <div class="sq-header">
                    <button class="btn-secondary btn-sm" data-click="showMatchingHome()">⬅ Orqaga</button>
                    <div class="sq-stats">
                        <span>🏆 <b id="sq-score">0</b></span>
                        <span id="sq-streak"></span>
                    </div>
                    <div class="sq-timer">
                        <div class="sq-timer-bar-bg">
                            <div class="sq-timer-bar" id="sq-timer-bar" style="width:100%"></div>
                        </div>
                        <span id="sq-timer" class="sq-timer-value">${this.timeLeft}</span>s
                    </div>
                </div>
                <div id="speed-quiz-content"></div>
            </div>
        `;
        this.renderQuestion();
    }
};

// ============================================================
// MATCHING HOME (Rejimlar menyusi)
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

    view.innerHTML = `
        <div style="text-align:center; margin-bottom:28px;">
            <div style="font-size:48px; margin-bottom:12px;">🎮</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">Interaktiv O'yinlar</h2>
            <p style="color:var(--text-secondary);">Nemis tilini o'yin orqali o'rganing — Matching Pairs va Speed Quiz!</p>
            <div style="margin-top:14px; display:inline-flex; gap:16px; align-items:center; background:var(--tag-bg); padding:10px 20px; border-radius:30px; font-size:13px;">
                🏆 Matching: <b>${matchXP} XP</b> &nbsp;|&nbsp; ⚡ Speed: <b>${speedXP} XP</b> (Rekord: ${bestScore})
            </div>
        </div>

        <div class="game-mode-grid">
            <div class="game-mode-card matching-mode">
                <div class="game-mode-icon">🧩</div>
                <h3>Matching Pairs</h3>
                <p>So'zlarni juftlash — xotirani mustahkamlash uchun 16 ta kartochkani juftlab toping!</p>
                <div class="game-mode-decks">
                    <span class="game-mode-label">To'plamni tanlang:</span>
                    ${FC_ALL_DECKS.filter(d => flashcardDecks[d.key] && flashcardDecks[d.key].length >= 8).map(d => `
                        <button class="btn-secondary btn-sm" data-click="MatchingGame.start('${d.key}')">
                            ${window.i18n ? i18n.t(d.i) : d.key}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="game-mode-card speed-mode">
                <div class="game-mode-icon">⚡</div>
                <h3>Speed Quiz</h3>
                <p>60 soniya ichida imkon qadar ko'proq to'g'ri javob bering! Streak bonuslari + vaqt bonuslari!</p>
                <div class="game-mode-decks">
                    <span class="game-mode-label">To'plamni tanlang:</span>
                    ${FC_ALL_DECKS.filter(d => flashcardDecks[d.key] && flashcardDecks[d.key].length >= 4).map(d => `
                        <button class="btn-secondary btn-sm" data-click="SpeedQuiz.start('${d.key}')">
                            ${window.i18n ? i18n.t(d.i) : d.key}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>

        <div style="text-align:center; margin-top:24px;">
            <button class="btn-secondary" data-click="renderFlashcardsHome()">🃏 Kartochkalarga qaytish</button>
        </div>
    `;
}
