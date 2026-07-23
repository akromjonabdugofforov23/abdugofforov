// ===== HORROR DEUTSCH GAME LOGIC =====

(function() {
    let horrorAudioContext = null;
    let currentMode = null; // 'escape' or 'survival'
    let currentDeckKey = null; // 'a1', 'a2', 'b1', 'b2'
    let currentRoomIndex = 0;
    let hp = 3;
    let timerInterval = null;
    let timeLeft = 10;
    let soundEnabled = true;

    // Web Audio API yordamida yurak urishi, og'ir nafas va mistik horror effektlar generatori
    function initAudioContext() {
        if (!horrorAudioContext) {
            horrorAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (horrorAudioContext.state === 'suspended') {
            horrorAudioContext.resume();
        }
    }

    // 1. Qo'shaloq Yurak Urishi (lub-dub) + Past Ovozli Og'ir Nafas Olish
    function playHeartbeatSound(isPanic = false) {
        if (!soundEnabled) return;
        try {
            initAudioContext();
            const now = horrorAudioContext.currentTime;

            // First Thump (lub)
            const osc1 = horrorAudioContext.createOscillator();
            const gain1 = horrorAudioContext.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(isPanic ? 80 : 60, now);
            osc1.frequency.exponentialRampToValueAtTime(30, now + 0.12);
            gain1.gain.setValueAtTime(isPanic ? 0.5 : 0.35, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc1.connect(gain1);
            gain1.connect(horrorAudioContext.destination);
            osc1.start(now);
            osc1.stop(now + 0.12);

            // Second Thump (dub) - slightly delayed
            const osc2 = horrorAudioContext.createOscillator();
            const gain2 = horrorAudioContext.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(isPanic ? 65 : 48, now + 0.14);
            osc2.frequency.exponentialRampToValueAtTime(25, now + 0.26);
            gain2.gain.setValueAtTime(isPanic ? 0.35 : 0.22, now + 0.14);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.26);
            osc2.connect(gain2);
            gain2.connect(horrorAudioContext.destination);
            osc2.start(now + 0.14);
            osc2.stop(now + 0.26);

            // Past ovozda og'ir nafas olish effekti (Low-pass Filtered Noise Breath)
            playSubtleBreathingSound(now, isPanic);
        } catch (e) {}
    }

    // Past Ovozli Og'ir Nafas Synth (Background Breath)
    function playSubtleBreathingSound(startTime, isPanic = false) {
        try {
            const bufferSize = horrorAudioContext.sampleRate * 0.4;
            const buffer = horrorAudioContext.createBuffer(1, bufferSize, horrorAudioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = horrorAudioContext.createBufferSource();
            noise.buffer = buffer;

            const filter = horrorAudioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(180, startTime);
            filter.frequency.linearRampToValueAtTime(320, startTime + 0.2);
            filter.frequency.linearRampToValueAtTime(140, startTime + 0.4);

            const breathGain = horrorAudioContext.createGain();
            const maxVol = isPanic ? 0.07 : 0.04;
            breathGain.gain.setValueAtTime(0.005, startTime);
            breathGain.gain.linearRampToValueAtTime(maxVol, startTime + 0.2);
            breathGain.gain.linearRampToValueAtTime(0.001, startTime + 0.4);

            noise.connect(filter);
            filter.connect(breathGain);
            breathGain.connect(horrorAudioContext.destination);

            noise.start(startTime);
            noise.stop(startTime + 0.4);
        } catch (e) {}
    }

    // 2. Kuchli, Aqlli va Mistik Noto'g'ri Javob SFX (Layered Detuned Echo)
    function playScaryScreamSound() {
        if (!soundEnabled) return;
        try {
            initAudioContext();
            const now = horrorAudioContext.currentTime;

            // Qatlam 1: Chuqur Sub-Bass Drop (220Hz -> 32Hz)
            const subOsc = horrorAudioContext.createOscillator();
            const subGain = horrorAudioContext.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(220, now);
            subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.5);
            subGain.gain.setValueAtTime(0.35, now);
            subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            subOsc.connect(subGain);
            subGain.connect(horrorAudioContext.destination);
            subOsc.start(now);
            subOsc.stop(now + 0.5);

            // Qatlam 2: Mistik Qo'rqinchli Interferensiya (Detuned Sawtooth Pair)
            const oscA = horrorAudioContext.createOscillator();
            const oscB = horrorAudioContext.createOscillator();
            const filter = horrorAudioContext.createBiquadFilter();
            const mainGain = horrorAudioContext.createGain();

            oscA.type = 'sawtooth';
            oscB.type = 'sawtooth';

            oscA.frequency.setValueAtTime(460, now);
            oscA.frequency.linearRampToValueAtTime(140, now + 0.45);
            oscB.frequency.setValueAtTime(468, now);
            oscB.frequency.linearRampToValueAtTime(144, now + 0.45);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1600, now);
            filter.frequency.exponentialRampToValueAtTime(180, now + 0.45);

            mainGain.gain.setValueAtTime(0.25, now);
            mainGain.gain.exponentialRampToValueAtTime(0.005, now + 0.45);

            oscA.connect(filter);
            oscB.connect(filter);
            filter.connect(mainGain);
            mainGain.connect(horrorAudioContext.destination);

            oscA.start(now);
            oscB.start(now);
            oscA.stop(now + 0.45);
            oscB.stop(now + 0.45);
        } catch (e) {}
    }

    let selectedHero = 'boy'; // 'boy' (👦 Kay) or 'girl' (👧 Gerda)

    function getHeroEmoji() {
        return selectedHero === 'girl' ? '👧' : '👦';
    }

    function getHeroName() {
        return selectedHero === 'girl' ? 'Gerda' : 'Kay';
    }

    window.selectHorrorHero = function(hero) {
        selectedHero = hero;
        document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
        const el = document.querySelector(`.character-card[onclick*="${hero}"]`);
        if (el) el.classList.add('selected');
        playFootstepSound();
    };

    // Door Unlock Sound (Creepy Iron Creak)
    function playDoorOpenSound() {
        if (!soundEnabled) return;
        try {
            initAudioContext();
            const now = horrorAudioContext.currentTime;
            const osc = horrorAudioContext.createOscillator();
            const gain = horrorAudioContext.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(420, now + 0.35);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.connect(gain);
            gain.connect(horrorAudioContext.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {}
    }

    // Footsteps Sound (Walking on stone floor)
    function playFootstepSound() {
        if (!soundEnabled) return;
        try {
            initAudioContext();
            const now = horrorAudioContext.currentTime;
            const osc = horrorAudioContext.createOscillator();
            const gain = horrorAudioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.connect(gain);
            gain.connect(horrorAudioContext.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {}
    }

    // Main Horror Home View
    window.openHorrorHome = function(fromPopState = false) {
        const view = document.getElementById('deutsch-content');
        if (!view) return;

        if (!fromPopState && typeof setAppRoute === 'function') {
            setAppRoute('#nemistili/horror-deutsch', true);
        }

        // body kungi/tungi temaga horror sinfini ulash
        document.body.classList.add('horror-theme');

        view.innerHTML = `
            <div class="horror-container">
                <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                    <button class="btn-secondary btn-sm" onclick="closeHorrorMode()">← Oddiy Testlarga Qaytish</button>
                    <button class="horror-sound-toggle" onclick="toggleHorrorSound()">
                        ${soundEnabled ? '🔊 Ovoz Yoniq' : '🔇 Ovoz O\'chiq'}
                    </button>
                </div>

                <div class="horror-hero-card">
                    <div style="font-size:56px; margin-bottom:12px; filter:drop-shadow(0 0 10px #ef4444);">💀</div>
                    <h1 class="horror-title">HORROR DEUTSCH</h1>
                    <p class="horror-subtitle">Adrenaliningizni oshiruvchi nemis tili omon qolish o'yini!</p>

                    <div style="margin-top:16px;">
                        <h4 style="color:#fff; font-size:14px; margin-bottom:10px;">🦸‍♂️ Personajingizni Tanlang:</h4>
                        <div class="character-picker">
                            <div class="character-card ${selectedHero === 'boy' ? 'selected' : ''}" onclick="selectHorrorHero('boy')">
                                <div style="font-size:36px; margin-bottom:4px;">👦</div>
                                <div style="font-weight:700; color:#fff; font-size:14px;">Kay</div>
                                <div style="font-size:11px; color:#9ca3af;">Qasr tadqiqotchisi</div>
                            </div>

                            <div class="character-card ${selectedHero === 'girl' ? 'selected' : ''}" onclick="selectHorrorHero('girl')">
                                <div style="font-size:36px; margin-bottom:4px;">👧</div>
                                <div style="font-weight:700; color:#fff; font-size:14px;">Gerda</div>
                                <div style="font-size:11px; color:#9ca3af;">Jasur sayyoh</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-top:20px;">
                        <button class="btn-primary" style="background:#ef4444; border-color:#ef4444; padding:12px 24px; font-weight:700;" onclick="startSurvivalMode()">
                            ⚡ 10-Second Survival (Vaqtga qarshi)
                        </button>
                    </div>
                </div>

                <h3 style="font-size:18px; margin-top:32px; margin-bottom:16px; color:#fff; display:flex; align-items:center; gap:8px;">
                    🏰 Qasrdan Qochish (Darajalar bo'yicha)
                </h3>

                <div class="horror-level-grid">
                    <div class="horror-level-card" onclick="startHorrorEscape('a1')">
                        <span class="horror-level-badge">🌱 A1 Boshlang'ich</span>
                        <div class="horror-level-name">🏰 Das Geisterschloss</div>
                        <div class="horror-level-desc">Ruhlar qasridan 5 ta eshik paroli va artikllar yordamida qutuling.</div>
                    </div>

                    <div class="horror-level-card" onclick="startHorrorEscape('a2')">
                        <span class="horror-level-badge">🌿 A2 Asosiy</span>
                        <div class="horror-level-name">🌲 Der Dunkle Wald</div>
                        <div class="horror-level-desc">Schwarzwald o'rmonidagi sharpalardan Perfekt va modal fe'llar bilan qoching.</div>
                    </div>

                    <div class="horror-level-card" onclick="startHorrorEscape('b1')">
                        <span class="horror-level-badge">🌳 B1 O'rta</span>
                        <div class="horror-level-name">🏥 Die Verlassene Anstalt</div>
                        <div class="horror-level-desc">Tashlab ketilgan sirli shifoxonadan Konjunktiv va Passiv grammatikasi orqali chiqing.</div>
                    </div>

                    <div class="horror-level-card" onclick="startHorrorEscape('b2')">
                        <span class="horror-level-badge" style="background:rgba(168,85,247,0.2); color:#a855f7;">🏔️ B2 Nightmare</span>
                        <div class="horror-level-name">🌋 Waldfeld Halokati</div>
                        <div class="horror-level-desc">Mistik qal'a buzilmoqda! Akademik so'zlar va o'ta tezkor logika sinovi.</div>
                    </div>
                </div>
            </div>
        `;
    };

    window.closeHorrorMode = function(fromPopState = false) {
        document.body.classList.remove('horror-theme');
        if (timerInterval) clearInterval(timerInterval);
        if (!fromPopState && typeof setAppRoute === 'function') {
            setAppRoute('#nemistili', true);
        } else if (typeof renderDeutschHome === 'function') {
            renderDeutschHome();
        }
    };

    window.toggleHorrorSound = function() {
        soundEnabled = !soundEnabled;
        const btn = document.querySelector('.horror-sound-toggle');
        if (btn) btn.innerHTML = soundEnabled ? '🔊 Ovoz Yoniq' : '🔇 Ovoz O\'chiq';
    };

    // Start Escape Mode
    window.startHorrorEscape = function(key) {
        if (!window.HorrorGamesData || !HorrorGamesData[key]) return;
        currentMode = 'escape';
        currentDeckKey = key;
        currentRoomIndex = 0;
        hp = 3;
        renderEscapeRoom();
    };

    function renderEscapeRoom() {
        const view = document.getElementById('deutsch-content');
        const game = HorrorGamesData[currentDeckKey];
        const room = game.rooms[currentRoomIndex];

        if (!room) {
            renderHorrorVictory();
            return;
        }

        const hearts = '🩸'.repeat(hp) + '🖤'.repeat(3 - hp);
        const heroPos = Math.min(80, 40 + (currentRoomIndex / game.rooms.length) * 40);
        const monsterPos = Math.max(5, 30 - (3 - hp) * 10);

        view.innerHTML = `
            <div class="horror-container">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <button class="btn-secondary btn-sm" onclick="openHorrorHome()">← Qochishni to'xtatish</button>
                    <div style="font-size:14px; font-weight:700; color:#ef4444;">Hayot: ${hearts}</div>
                </div>

                <!-- Animated 2D Game Scene Canvas -->
                <div class="horror-game-canvas-wrap">
                    <div class="horror-canvas-bg"></div>
                    <div class="horror-corridor-walls"></div>
                    
                    <!-- Monster Stalker pursuing behind -->
                    <div class="horror-character-sprite horror-monster-avatar" style="left: ${monsterPos}%;">
                        👻
                    </div>

                    <!-- Player Hero Avatar -->
                    <div class="horror-character-sprite horror-hero-avatar" style="left: ${heroPos}%;">
                        ${getHeroEmoji()}
                    </div>

                    <!-- Locked Door / Exit Key -->
                    <div class="horror-door-avatar">
                        ${currentRoomIndex === game.rooms.length - 1 ? '🔑' : '🚪'}
                    </div>
                </div>

                <div class="horror-hero-card" id="horror-card" style="text-align:left; padding:28px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <span class="horror-level-badge">${game.badge} &middot; Qahramon: ${getHeroName()}</span>
                        <span style="color:#9ca3af; font-size:13px;">Xona ${currentRoomIndex + 1} / ${game.rooms.length}</span>
                    </div>

                    <h2 style="font-size:22px; color:#fff; margin-bottom:8px;">${room.roomName}</h2>
                    <p style="color:#d1d5db; font-size:14px; margin-bottom:20px; line-height:1.5; background:rgba(0,0,0,0.4); padding:12px; border-radius:10px; border-left:3px solid #ef4444;">
                        📖 ${room.story}
                    </p>

                    <h3 style="font-size:17px; color:#fff; margin-bottom:16px;">❓ ${room.q}</h3>

                    <div style="display:flex; flex-direction:column; gap:10px;" id="horror-options">
                        ${room.options.map((opt, i) => `
                            <button onclick="checkHorrorEscapeAns(${i})" class="btn-secondary" style="text-align:left; padding:14px; border-color:var(--horror-border); background:rgba(0,0,0,0.5); color:#fff;">
                                <b>${['A','B','C','D'][i]}.</b> ${opt}
                            </button>
                        `).join('')}
                    </div>

                    <div id="horror-explain-box" style="display:none; margin-top:16px;"></div>
                </div>
            </div>
        `;
    }

    function triggerScaryBorderOverlay(durationMs = 2800) {
        let overlay = document.getElementById('horror-scary-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'horror-scary-overlay';
            overlay.className = 'horror-scary-overlay';
            overlay.innerHTML = `
                <div class="scary-vignette-border"></div>
                <div class="scary-corner scary-top-left">👻</div>
                <div class="scary-corner scary-top-right">👹</div>
                <div class="scary-corner scary-bottom-left">🕷️</div>
                <div class="scary-corner scary-bottom-right">💀</div>
                <div class="scary-corner scary-left-edge">🩸</div>
                <div class="scary-corner scary-right-edge">👀</div>
            `;
            document.body.appendChild(overlay);
        }

        overlay.classList.remove('active');
        void overlay.offsetWidth;
        overlay.classList.add('active');

        clearTimeout(triggerScaryBorderOverlay._t);
        triggerScaryBorderOverlay._t = setTimeout(() => {
            overlay.classList.remove('active');
        }, durationMs);
    }

    window.checkHorrorEscapeAns = function(selected) {
        const game = HorrorGamesData[currentDeckKey];
        const room = game.rooms[currentRoomIndex];
        const card = document.getElementById('horror-card');
        const box = document.getElementById('horror-explain-box');

        const isCorrect = selected === room.answer;

        if (isCorrect) {
            playDoorOpenSound();
            box.style.display = 'block';
            box.innerHTML = `
                <div style="padding:14px; border-radius:10px; background:rgba(34,197,94,0.15); border:1px solid #22c55e; color:#22c55e;">
                    <b>🔓 Parol to'g'ri! Eshik qulfi ochildi.</b>
                    <p style="font-size:13px; color:#d1d5db; margin-top:4px;">💡 ${room.explanation}</p>
                </div>
                <button onclick="nextEscapeRoom()" class="btn-primary" style="margin-top:12px; width:100%; background:#22c55e; border-color:#22c55e;">🚶‍♂️ Keyingi Xonaga O'tish →</button>
            `;
        } else {
            hp--;
            playScaryScreamSound();
            triggerScaryBorderOverlay(2500);
            if (card) {
                card.classList.add('screen-shake', 'screen-flicker');
                setTimeout(() => card.classList.remove('screen-shake', 'screen-flicker'), 400);
            }

            if (hp <= 0) {
                renderHorrorGameOver();
                return;
            }

            box.style.display = 'block';
            box.innerHTML = `
                <div style="padding:14px; border-radius:10px; background:rgba(239,68,68,0.15); border:1px solid #ef4444; color:#ef4444;">
                    <b>😱 Noto'g'ri parol! Qasr ruhi yaqinlashdi (-1 🩸 Hayot).</b>
                    <p style="font-size:13px; color:#d1d5db; margin-top:4px;">💡 ${room.explanation}</p>
                </div>
                <button onclick="nextEscapeRoom()" class="btn-primary" style="margin-top:12px; width:100%; background:#ef4444; border-color:#ef4444;">🏃 Qochishda Davom Etish →</button>
            `;
        }
    };

    window.nextEscapeRoom = function() {
        playFootstepSound();
        currentRoomIndex++;
        renderEscapeRoom();
    };

    // 10 Second Survival Mode
    let survivalScore = 0;

    window.startSurvivalMode = function() {
        currentMode = 'survival';
        currentRoomIndex = 0;
        survivalScore = 0;
        hp = 3;
        renderSurvivalQuestion();
    };

    function renderSurvivalQuestion() {
        const view = document.getElementById('deutsch-content');
        const pool = HorrorGamesData.survivalPool;

        if (currentRoomIndex >= pool.length) {
            renderSurvivalVictory();
            return;
        }

        const q = pool[currentRoomIndex];
        timeLeft = 10;
        const hearts = '🩸'.repeat(hp) + '🖤'.repeat(3 - hp);

        view.innerHTML = `
            <div class="horror-container">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <button class="btn-secondary btn-sm" onclick="openHorrorHome()">← Survivalni to'xtatish</button>
                    <div style="font-size:13px; color:#9ca3af;">Savol ${currentRoomIndex + 1} / ${pool.length}</div>
                    <div style="font-size:14px; font-weight:700; color:#ef4444;">Hayot: ${hearts}</div>
                </div>

                <div class="horror-timer-bar">
                    <div class="horror-timer-fill" id="timer-fill"></div>
                </div>

                <div class="horror-hero-card" id="horror-card" style="text-align:center; padding:28px;">
                    <div style="font-size:40px; margin-bottom:8px;" id="timer-sec">⏱️ 10</div>
                    <h3 style="font-size:20px; color:#fff; margin-bottom:20px;">${q.q}</h3>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;" id="survival-opts">
                        ${q.options.map((opt, i) => `
                            <button onclick="checkSurvivalAns(${i})" class="btn-secondary" style="padding:16px; font-size:15px; border-color:var(--horror-border); background:rgba(0,0,0,0.6); color:#fff;">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>

                    <div id="survival-explain-box" style="display:none; margin-top:16px;"></div>
                </div>
            </div>
        `;

        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            const isPanic = timeLeft <= 4;
            playHeartbeatSound(isPanic);

            const fill = document.getElementById('timer-fill');
            const secEl = document.getElementById('timer-sec');
            const card = document.getElementById('horror-card');

            if (fill) {
                fill.style.width = (timeLeft * 10) + '%';
                if (isPanic) {
                    fill.style.background = '#ef4444';
                    fill.style.boxShadow = '0 0 14px #ef4444';
                }
            }
            if (secEl) {
                secEl.innerHTML = isPanic ? `⚠️ 00:0${timeLeft}` : `⏱️ ${timeLeft}`;
                if (isPanic) secEl.style.color = '#ef4444';
            }
            if (isPanic && card) {
                card.classList.add('screen-shake');
                setTimeout(() => card.classList.remove('screen-shake'), 180);
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                checkSurvivalAns(-1); // timeout
            }
        }, 1000);
    }

    window.checkSurvivalAns = function(selected) {
        if (timerInterval) clearInterval(timerInterval);
        const pool = HorrorGamesData.survivalPool;
        const q = pool[currentRoomIndex];
        const card = document.getElementById('horror-card');
        const box = document.getElementById('survival-explain-box');

        // Disabling option buttons during pause
        const optsContainer = document.getElementById('survival-opts');
        if (optsContainer) {
            optsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);
        }

        const isCorrect = selected === q.answer;

        if (isCorrect) {
            survivalScore++;
            playDoorOpenSound();
            if (card) card.style.borderColor = '#22c55e';
            
            setTimeout(() => {
                currentRoomIndex++;
                renderSurvivalQuestion();
            }, 600);
        } else {
            hp--;
            playScaryScreamSound();
            triggerScaryBorderOverlay(3000);

            if (card) {
                card.classList.add('screen-shake', 'screen-flicker');
                card.style.borderColor = '#ef4444';
            }

            if (box) {
                box.style.display = 'block';
                box.innerHTML = `
                    <div style="padding:14px; border-radius:12px; background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#fff; font-size:14px; text-align:left;">
                        <div style="font-weight:700; color:#ef4444; margin-bottom:4px;">
                            ${selected === -1 ? '⏱️ Vaqt tugadi! Qasr ruhi hujum qildi (-1 🩸 Hayot)' : "❌ Noto'g'ri javob! Qasr ruhi yaqinlashdi (-1 🩸 Hayot)"}
                        </div>
                        <div style="color:#22c55e; font-weight:600; margin-top:4px;">
                            ✅ To'g'ri javob: <b>${q.options[q.answer]}</b>
                        </div>
                    </div>
                `;
            }

            // 3 SONIYA KUTISH (3000ms pause)
            setTimeout(() => {
                if (hp <= 0) {
                    renderHorrorGameOver();
                } else {
                    currentRoomIndex++;
                    renderSurvivalQuestion();
                }
            }, 3000);
        }
    };

    function renderHorrorGameOver() {
        const view = document.getElementById('deutsch-content');
        view.innerHTML = `
            <div class="horror-container" style="text-align:center;">
                <div class="horror-hero-card" style="padding:48px 24px;">
                    <div style="font-size:72px; margin-bottom:12px; filter:drop-shadow(0 0 15px #ef4444);">👻</div>
                    <h1 class="horror-title" style="color:#ef4444;">GAME OVER</h1>
                    <p class="horror-subtitle" style="font-size:16px;">Siz qasrdan qutula olmadingiz... Qasr ruhi sizni asir oldi!</p>
                    <div style="margin-top:24px; display:flex; justify-content:center; gap:12px;">
                        <button class="btn-primary" style="background:#ef4444; border-color:#ef4444;" onclick="startSurvivalMode()">🔄 Qayta Sinash</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSurvivalVictory() {
        const view = document.getElementById('deutsch-content');
        const pool = HorrorGamesData.survivalPool;
        const total = pool.length;
        const pct = Math.round((survivalScore / total) * 100);

        view.innerHTML = `
            <div class="horror-container" style="text-align:center;">
                <div class="horror-hero-card" style="padding:40px 24px; border-color:#22c55e;">
                    <div style="font-size:64px; margin-bottom:12px; filter:drop-shadow(0 0 15px #22c55e);">🏆</div>
                    <h1 class="horror-title" style="color:#22c55e;">SURVIVAL YAKUNLANDI!</h1>
                    <p class="horror-subtitle" style="font-size:16px;">10 soniyalik vaqtga qarshi shiddatli kurash yakuniga etdi!</p>
                    
                    <div style="background:rgba(0,0,0,0.5); padding:20px; border-radius:16px; border:1px solid rgba(34,197,94,0.3); margin:20px auto; max-width:320px;">
                        <div style="font-size:14px; color:#d1d5db; margin-bottom:6px;">Sizning Natijangiz:</div>
                        <div style="font-size:36px; font-weight:800; color:#34d399;">${survivalScore} / ${total}</div>
                        <div style="font-size:13px; color:#a7f3d0; margin-top:4px;">To'g'rilik ko'rsatkichi: ${pct}%</div>
                    </div>

                    <div style="margin-top:24px; display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                        <button class="btn-primary" style="background:#22c55e; border-color:#22c55e; font-weight:700;" onclick="startSurvivalMode()">🔄 Qayta O'ynash</button>
                        <button class="btn-secondary" onclick="openHorrorHome()">🏰 Bosh Rejimlar</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderHorrorVictory() {
        const view = document.getElementById('deutsch-content');
        view.innerHTML = `
            <div class="horror-container" style="text-align:center;">
                <div class="horror-hero-card" style="padding:48px 24px; border-color:#22c55e;">
                    <div style="font-size:72px; margin-bottom:12px; filter:drop-shadow(0 0 15px #22c55e);">🏆</div>
                    <h1 class="horror-title" style="color:#22c55e;">QASRDAN QUTULDINGIZ!</h1>
                    <p class="horror-subtitle" style="font-size:16px;">Tabriklaymiz! Barcha nemischa parollarni to'g'ri topib, omon qoldingiz!</p>
                    <div style="margin-top:24px; display:flex; justify-content:center; gap:12px;">
                        <button class="btn-primary" style="background:#22c55e; border-color:#22c55e;" onclick="openHorrorHome()">🏰 Boshqa Darajani O'ynash</button>
                    </div>
                </div>
            </div>
        `;
    }
})();
