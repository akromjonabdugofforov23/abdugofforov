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
        const navRight = document.getElementById('nav-right');
        if (!navRight) return;

        let container = document.getElementById('user-gamification-wrap');
        if (!container) {
            container = document.createElement('div');
            container.id = 'user-gamification-wrap';
            container.style.cssText = 'display:inline-flex; align-items:center; gap:8px; margin-right:8px;';
            navRight.insertBefore(container, navRight.firstChild);
        }

        const info = getLevelInfo(data.xp);

        container.innerHTML = `
            <div class="user-streak-chip" title="Har kuni kirganingiz uchun ketma-ket alanga!">
                🔥 ${data.count} Kun
            </div>
            <div class="user-xp-badge" title="To'plangan XP: ${data.xp}">
                ${info.level}
            </div>
        `;
    }

    // Module Export
    App.Gamification = { updateStreak, addXP, getStreakData, getLevelInfo };
    window.Gamification = App.Gamification; // Backward compatibility

    document.addEventListener('DOMContentLoaded', updateStreak);
})();
