// ===== 1. GAMIFICATION MODULE: DAILY STREAKS & XP LEVEL SYSTEM =====
(function() {
    window.App = window.App || {};

    function getStreakData() {
        const defaultData = { count: 1, lastDate: new Date().toDateString(), xp: 50 };
        try {
            const saved = localStorage.getItem('user_gamification');
            return saved ? JSON.parse(saved) : defaultData;
        } catch(e) {
            return defaultData;
        }
    }

    function saveStreakData(data) {
        try {
            localStorage.setItem('user_gamification', JSON.stringify(data));
        } catch(e) {}
    }

    function updateStreak() {
        const data = getStreakData();
        const today = new Date().toDateString();
        
        if (data.lastDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (data.lastDate === yesterday) {
                data.count += 1;
            } else {
                data.count = 1;
            }
            data.lastDate = today;
            data.xp += 20;
            saveStreakData(data);
        }
        renderGamificationPill(data);
    }

    function addXP(amount) {
        const data = getStreakData();
        data.xp += amount;
        saveStreakData(data);
        renderGamificationPill(data);
    }

    function getLevelInfo(xp) {
        if (xp >= 500) return { level: '🏆 Master Adventurer', rank: 3 };
        if (xp >= 150) return { level: '⚡ German Scholar', rank: 2 };
        return { level: '🌱 Novice Explorer', rank: 1 };
    }

    function renderGamificationPill(data) {
        const container = document.getElementById('user-gamification-wrap');
        if (container) container.remove();
    }

    // Module Export
    App.Gamification = { updateStreak, addXP, getStreakData, getLevelInfo };
    window.Gamification = App.Gamification; // Backward compatibility

    document.addEventListener('DOMContentLoaded', updateStreak);
})();

// ===== 2. SPACED REPETITION ENGINE (SM-2 ALGORITHM FOR FLASHCARDS) =====
(function() {
    window.App = window.App || {};

    const SM2 = {
        calculate(card, quality) {
            // quality: 0..5 (0 = umuman eslay olmadi, 5 = mukammal esladi)
            let q = Math.max(0, Math.min(5, Math.round(quality)));
            let repetitions = card.repetitions || 0;
            let easeFactor = card.easeFactor || 2.5;
            let interval = card.interval || 0;

            if (q >= 3) {
                if (repetitions === 0) {
                    interval = 1;
                } else if (repetitions === 1) {
                    interval = 6;
                } else {
                    interval = Math.round(interval * easeFactor);
                }
                repetitions += 1;
            } else {
                repetitions = 0;
                interval = 1;
            }

            // Ease Factor hisoblash
            easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
            if (easeFactor < 1.3) easeFactor = 1.3;

            const nextReview = Date.now() + (interval * 24 * 60 * 60 * 1000);

            return {
                ...card,
                repetitions,
                easeFactor: Number(easeFactor.toFixed(2)),
                interval,
                nextReview,
                lastReviewed: Date.now()
            };
        },

        isCardDue(card) {
            if (!card.nextReview) return true;
            return Date.now() >= card.nextReview;
        },

        filterDueCards(cards) {
            if (!Array.isArray(cards)) return [];
            return cards.filter(c => this.isCardDue(c));
        }
    };

    window.App.SM2 = SM2;
})();
