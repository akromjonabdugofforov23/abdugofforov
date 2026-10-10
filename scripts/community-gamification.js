/**
 * ABDUGOFFOROV — TELEGRAM SUITE (Cleaned & De-mocked)
 * Soxta diplom/sertifikat generatori va avto-javobli AMA olib tashlandi.
 */

(function () {
    'use strict';

    const TG = window.Telegram && window.Telegram.WebApp;

    function initTelegramMiniApp() {
        if (!TG) return;

        try {
            TG.ready();
            TG.expand();

            if (TG.setHeaderColor) TG.setHeaderColor('#0f172a');
            if (TG.setBackgroundColor) TG.setBackgroundColor('#0b0f19');

            if (TG.initDataUnsafe && TG.initDataUnsafe.user) {
                const tgUser = TG.initDataUnsafe.user;
                const name = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') || tgUser.username || 'Mehmon';
                const nameLabel = document.getElementById('user-name-label');
                if (nameLabel) nameLabel.textContent = name;
            }
        } catch (e) {
            console.warn('Telegram WebApp init warning:', e);
        }
    }

    function triggerHaptic(type = 'light') {
        if (TG && TG.HapticFeedback) {
            try {
                if (type === 'success' || type === 'error' || type === 'warning') {
                    TG.HapticFeedback.notificationOccurred(type);
                } else {
                    TG.HapticFeedback.impactOccurred(type);
                }
            } catch (e) {}
        }
    }

    initTelegramMiniApp();

    window.CommunitySuite = {
        openCertificate: () => {},
        openAma: () => {},
        triggerHaptic
    };

})();
