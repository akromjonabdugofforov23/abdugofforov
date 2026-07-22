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

    // Web Audio API yordamida yurak urishi va qo'rqinchli ovoz generatori (0 KB resurs!)
    function playHeartbeatSound() {
        if (!soundEnabled) return;
        try {
            if (!horrorAudioContext) {
                horrorAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (horrorAudioContext.state === 'suspended') {
                horrorAudioContext.resume();
            }

            const osc = horrorAudioContext.createOscillator();
            const gain = horrorAudioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(60, horrorAudioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, horrorAudioContext.currentTime + 0.15);

            gain.gain.setValueAtTime(0.4, horrorAudioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, horrorAudioContext.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(horrorAudioContext.destination);

            osc.start();
            osc.stop(horrorAudioContext.currentTime + 0.15);
        } catch (e) {}
    }

    function playScaryScreamSound() {
        if (!soundEnabled) return;
        try {
            if (!horrorAudioContext) {
                horrorAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            const osc = horrorAudioContext.createOscillator();
            const gain = horrorAudioContext.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, horrorAudioContext.currentTime);
            osc.frequency.linearRampToValueAtTime(150, horrorAudioContext.currentTime + 0.4);

            gain.gain.setValueAtTime(0.3, horrorAudioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, horrorAudioContext.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(horrorAudioContext.destination);

            osc.start();
            osc.stop(horrorAudioContext.currentTime + 0.4);
        } catch (e) {}
    }

    // Main Horror Home View
    window.openHorrorHome = function() {
        const view = document.getElementById('deutsch-content');
        if (!view) return;

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

    window.closeHorrorMode = function() {
        document.body.classList.remove('horror-theme');
        if (timerInterval) clearInterval(timerInterval);
        if (typeof renderDeutschHome === 'function') renderDeutschHome();
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

        view.innerHTML = `
            <div class="horror-container">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <button class="btn-secondary btn-sm" onclick="openHorrorHome()">← Qochishni to'xtatish</button>
                    <div style="font-size:14px; font-weight:700; color:#ef4444;">Hayot: ${hearts}</div>
                </div>

                <div class="horror-hero-card" id="horror-card" style="text-align:left; padding:28px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <span class="horror-level-badge">${game.badge}</span>
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

    window.checkHorrorEscapeAns = function(selected) {
        const game = HorrorGamesData[currentDeckKey];
        const room = game.rooms[currentRoomIndex];
        const card = document.getElementById('horror-card');
        const box = document.getElementById('horror-explain-box');

        const isCorrect = selected === room.answer;

        if (isCorrect) {
            box.style.display = 'block';
            box.innerHTML = `
                <div style="padding:14px; border-radius:10px; background:rgba(34,197,94,0.15); border:1px solid #22c55e; color:#22c55e;">
                    <b>✅ Parol to'g'ri! Eshik ochildi.</b>
                    <p style="font-size:13px; color:#d1d5db; margin-top:4px;">💡 ${room.explanation}</p>
                </div>
                <button onclick="nextEscapeRoom()" class="btn-primary" style="margin-top:12px; width:100%; background:#22c55e; border-color:#22c55e;">Keyingi Xonaga O'tish →</button>
            `;
        } else {
            hp--;
            playScaryScreamSound();
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
                    <b>❌ Noto'g'ri parol! Qasr ruhi yaqinlashmoqda (-1 🩸 Hayot).</b>
                    <p style="font-size:13px; color:#d1d5db; margin-top:4px;">💡 ${room.explanation}</p>
                </div>
                <button onclick="nextEscapeRoom()" class="btn-primary" style="margin-top:12px; width:100%; background:#ef4444; border-color:#ef4444;">Davom Etish →</button>
            `;
        }
    };

    window.nextEscapeRoom = function() {
        currentRoomIndex++;
        renderEscapeRoom();
    };

    // 10 Second Survival Mode
    window.startSurvivalMode = function() {
        currentMode = 'survival';
        currentRoomIndex = 0;
        hp = 3;
        renderSurvivalQuestion();
    };

    function renderSurvivalQuestion() {
        const view = document.getElementById('deutsch-content');
        const pool = HorrorGamesData.survivalPool;
        const q = pool[currentRoomIndex % pool.length];

        timeLeft = 10;
        const hearts = '🩸'.repeat(hp) + '🖤'.repeat(3 - hp);

        view.innerHTML = `
            <div class="horror-container">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <button class="btn-secondary btn-sm" onclick="openHorrorHome()">← Survivalni to'xtatish</button>
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
                </div>
            </div>
        `;

        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            playHeartbeatSound();

            const fill = document.getElementById('timer-fill');
            const secEl = document.getElementById('timer-sec');
            if (fill) fill.style.width = (timeLeft * 10) + '%';
            if (secEl) secEl.innerHTML = `⏱️ ${timeLeft}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                checkSurvivalAns(-1); // timeout
            }
        }, 1000);
    }

    window.checkSurvivalAns = function(selected) {
        if (timerInterval) clearInterval(timerInterval);
        const pool = HorrorGamesData.survivalPool;
        const q = pool[currentRoomIndex % pool.length];
        const card = document.getElementById('horror-card');

        if (selected === q.answer) {
            currentRoomIndex++;
            renderSurvivalQuestion();
        } else {
            hp--;
            playScaryScreamSound();

            if (card) {
                card.classList.add('screen-shake', 'screen-flicker');
            }

            if (hp <= 0) {
                setTimeout(renderHorrorGameOver, 400);
            } else {
                currentRoomIndex++;
                setTimeout(renderSurvivalQuestion, 500);
            }
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
                        <button class="btn-primary" style="background:#ef4444; border-color:#ef4444;" onclick="openHorrorHome()">🔄 Qayta Sinash</button>
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
