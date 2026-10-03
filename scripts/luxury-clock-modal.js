/**
 * ============================================================
 * LUXURY ANALOG CLOCK MODAL (Swiss Atelier & Rolex Aesthetic)
 * ============================================================
 * Opens interactive luxury analog timepiece modal when
 * #functional-clock or [data-action="open-luxury-clock"] is clicked.
 */

(function () {
    'use strict';

    // Inject CSS if missing
    function ensureStyles() {
        if (!document.querySelector('link[href*="luxury-clock-modal.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/luxury-clock-modal.css?v=1';
            document.head.appendChild(link);
        }
    }

    let modalEl = null;
    let hourEl = null;
    let minuteEl = null;
    let secondEl = null;
    let dateDigitEl = null;
    let digitalReadoutEl = null;
    let animFrameId = null;
    let isModalOpen = false;
    let isSmooth = true;
    let isMuted = true;
    let audioCtx = null;
    let lastSec = -1;

    function playTick() {
        if (isMuted || !isModalOpen) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.025);

            gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.025);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.03);
        } catch (e) {}
    }

    function createModal() {
        if (modalEl) return modalEl;

        const overlay = document.createElement('div');
        overlay.className = 'lcm-modal-overlay';
        overlay.id = 'luxury-clock-modal';
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Luxury Swiss Chronometer');

        overlay.innerHTML = `
            <div class="lcm-card" id="lcm-card">
                <div class="lcm-header">
                    <span class="lcm-title-badge">✦ ATELIER · CHRONOMETER</span>
                    <div class="lcm-top-tools">
                        <button class="lcm-btn-icon" id="lcm-audio-btn" type="button" title="Tik-tak ovozi" aria-label="Soat ovozi">🔇</button>
                        <button class="lcm-btn-icon lcm-close-btn" id="lcm-close-btn" type="button" title="Yopish" aria-label="Yopish">&times;</button>
                    </div>
                </div>

                <div class="lcm-bezel">
                    <div class="lcm-clock">
                        <div class="lcm-rays"></div>
                        <div class="lcm-ticks-ring" id="lcm-ticks-ring"></div>

                        <div class="lcm-branding">
                            <img class="lcm-logo-img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Logo_da_Rolex.png/1280px-Logo_da_Rolex.png?20210605010030" alt="Crown Logo" onerror="this.style.display='none'">
                            <span class="lcm-brand-title">ABDUGOFFOROV</span>
                            <span class="lcm-brand-sub">ATELIER · GENÈVE</span>
                        </div>

                        <div class="lcm-numbers">
                            <span class="lcm-num-12">12</span>
                            <span class="lcm-num-3">3</span>
                            <span class="lcm-num-6">6</span>
                            <span class="lcm-num-9">9</span>
                        </div>

                        <div class="lcm-cyclops" title="Bugungi sana">
                            <span class="lcm-date-digit" id="lcm-date-digit">01</span>
                        </div>

                        <div class="lcm-arrows">
                            <div class="lcm-hour" id="lcm-hour"></div>
                            <div class="lcm-minute" id="lcm-minute"></div>
                            <div class="lcm-second" id="lcm-second"></div>
                        </div>
                    </div>
                </div>

                <div class="lcm-footer">
                    <div class="lcm-digital-readout" id="lcm-digital-readout">00:00:00</div>
                    <div class="lcm-footer-actions">
                        <button class="lcm-action-btn" id="lcm-mode-toggle" type="button">Silliq harakat: Yoqilgan</button>
                        <a href="clock.html" class="lcm-action-link" target="_blank" rel="noopener noreferrer">To'liq ekran ↗</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Generate 60 ticks
        const ticksRing = overlay.querySelector('#lcm-ticks-ring');
        if (ticksRing) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < 60; i++) {
                if (i % 15 === 0) continue;
                const tick = document.createElement('div');
                tick.className = 'lcm-tick' + (i % 5 === 0 ? ' major' : '');
                tick.style.transform = `rotate(${i * 6}deg)`;
                fragment.appendChild(tick);
            }
            ticksRing.appendChild(fragment);
        }

        // Cache elements
        modalEl = overlay;
        hourEl = overlay.querySelector('#lcm-hour');
        minuteEl = overlay.querySelector('#lcm-minute');
        secondEl = overlay.querySelector('#lcm-second');
        dateDigitEl = overlay.querySelector('#lcm-date-digit');
        digitalReadoutEl = overlay.querySelector('#lcm-digital-readout');

        // Events
        overlay.querySelector('#lcm-close-btn').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        const audioBtn = overlay.querySelector('#lcm-audio-btn');
        audioBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            audioBtn.textContent = isMuted ? '🔇' : '🔊';
            if (!isMuted && !audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        });

        const modeBtn = overlay.querySelector('#lcm-mode-toggle');
        modeBtn.addEventListener('click', () => {
            isSmooth = !isSmooth;
            modeBtn.textContent = isSmooth ? 'Silliq harakat: Yoqilgan' : 'Silliq harakat: O\'chirilgan';
        });

        return overlay;
    }

    function updateWatch() {
        if (!isModalOpen) return;

        const now = new Date();
        const ms = now.getMilliseconds();
        const sec = now.getSeconds();
        const min = now.getMinutes();
        const hr = now.getHours();
        const day = now.getDate();

        const secondDegree = isSmooth
            ? ((sec + ms / 1000) / 60) * 360
            : (sec / 60) * 360;

        const minuteDegree = ((min + sec / 60) / 60) * 360;
        const hourDegree = (((hr % 12) + min / 60) / 12) * 360;

        if (secondEl) secondEl.style.transform = `rotate(${secondDegree}deg)`;
        if (minuteEl) minuteEl.style.transform = `rotate(${minuteDegree}deg)`;
        if (hourEl) hourEl.style.transform = `rotate(${hourDegree}deg)`;

        if (dateDigitEl && dateDigitEl.textContent !== String(day)) {
            dateDigitEl.textContent = day;
        }

        if (sec !== lastSec) {
            lastSec = sec;
            playTick();

            if (digitalReadoutEl) {
                const hStr = String(hr).padStart(2, '0');
                const mStr = String(min).padStart(2, '0');
                const sStr = String(sec).padStart(2, '0');
                digitalReadoutEl.textContent = `${hStr}:${mStr}:${sStr}`;
            }
        }

        animFrameId = requestAnimationFrame(updateWatch);
    }

    function openModal(e) {
        if (e) {
            // allow ctrl+click or middle-click to open clock.html in new tab
            if (e.ctrlKey || e.metaKey || e.button === 1) return;
            e.preventDefault();
        }

        ensureStyles();
        createModal();

        isModalOpen = true;
        modalEl.classList.add('active');
        document.body.style.overflow = 'hidden';

        animFrameId = requestAnimationFrame(updateWatch);
    }

    function closeModal() {
        if (!modalEl) return;
        isModalOpen = false;
        modalEl.classList.remove('active');
        document.body.style.overflow = '';
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
    }

    // Keydown ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen) {
            closeModal();
        }
    });

    // Bind triggers
    function bindTriggers() {
        const clockTrigger = document.getElementById('functional-clock');
        if (clockTrigger) {
            clockTrigger.addEventListener('click', openModal);
        }

        document.querySelectorAll('[data-action="open-luxury-clock"]').forEach((el) => {
            el.addEventListener('click', openModal);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ensureStyles();
            bindTriggers();
        });
    } else {
        ensureStyles();
        bindTriggers();
    }

    // Global helper
    window.openLuxuryClockModal = openModal;
    window.closeLuxuryClockModal = closeModal;
})();
