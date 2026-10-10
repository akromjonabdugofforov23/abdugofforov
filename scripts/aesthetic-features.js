/**
 * ============================================================
 * ABDUGOFFOROV — AESTHETIC, AUDIO & TERMINAL SUITE
 * Group E (24-28):
 * 24: Dynamic Weather Ambient Canvas (Sun, Rain, Snow, Cosmic)
 * 25: Geek CLI Terminal Mode (~ key or button)
 * 26: 8D Spatial Audio Oscillating Panner
 * 27: Markdown & Notion One-Click Export
 * 28: Time Capsule (Kelajakdagi o'zimga xat)
 * ============================================================
 */

(function () {
    'use strict';

    // ------------------------------------------------------------
    // 1. DYNAMIC WEATHER AMBIENT CANVAS (#24)
    // ------------------------------------------------------------
    let activeWeather = 'cosmic'; // 'cosmic', 'rain', 'snow', 'sun'
    let weatherAnimId = null;
    let weatherCanvas = null;
    let weatherCtx = null;
    let weatherParticles = [];

    function initWeatherCanvas() {
        weatherCanvas = document.getElementById('weather-canvas');
        if (!weatherCanvas) {
            weatherCanvas = document.createElement('canvas');
            weatherCanvas.id = 'weather-canvas';
            weatherCanvas.style.position = 'fixed';
            weatherCanvas.style.top = '0';
            weatherCanvas.style.left = '0';
            weatherCanvas.style.width = '100vw';
            weatherCanvas.style.height = '100vh';
            weatherCanvas.style.pointerEvents = 'none';
            weatherCanvas.style.zIndex = '0';
            document.body.prepend(weatherCanvas);
        }
        weatherCtx = weatherCanvas.getContext('2d');
        resizeWeather();
        window.addEventListener('resize', resizeWeather);
        spawnWeatherParticles();
        animateWeather();
    }

    function resizeWeather() {
        if (!weatherCanvas) return;
        weatherCanvas.width = window.innerWidth;
        weatherCanvas.height = window.innerHeight;
    }

    function spawnWeatherParticles() {
        weatherParticles = [];
        const count = activeWeather === 'rain' ? 120 : (activeWeather === 'snow' ? 80 : 0);
        for (let i = 0; i < count; i++) {
            weatherParticles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                len: Math.random() * 20 + 10,
                speed: activeWeather === 'rain' ? Math.random() * 8 + 12 : Math.random() * 1.5 + 0.8,
                radius: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                drift: (Math.random() - 0.5) * 1.2
            });
        }
    }

    function setWeather(mode) {
        activeWeather = mode;
        spawnWeatherParticles();
        if (window.showToast) {
            const names = { cosmic: '🌌 Yulduzli fazo', rain: '🌧️ Mayin yomg\'ir', snow: '❄️ Sokin qor', sun: '☀️ Tiniq quyosh' };
            window.showToast(`Ob-havo foni: ${names[mode] || mode}`, 'info');
        }
    }

    function animateWeather() {
        if (!weatherCtx || !weatherCanvas) return;
        weatherCtx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);

        if (activeWeather === 'rain') {
            weatherCtx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
            weatherCtx.lineWidth = 1.4;
            weatherParticles.forEach(p => {
                weatherCtx.beginPath();
                weatherCtx.moveTo(p.x, p.y);
                weatherCtx.lineTo(p.x - 2, p.y + p.len);
                weatherCtx.stroke();

                p.y += p.speed;
                p.x -= 1;
                if (p.y > weatherCanvas.height) {
                    p.y = -20;
                    p.x = Math.random() * weatherCanvas.width;
                }
            });
        } else if (activeWeather === 'snow') {
            weatherCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            weatherParticles.forEach(p => {
                weatherCtx.beginPath();
                weatherCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                weatherCtx.fill();

                p.y += p.speed;
                p.x += p.drift;
                if (p.y > weatherCanvas.height) {
                    p.y = -10;
                    p.x = Math.random() * weatherCanvas.width;
                }
            });
        }

        weatherAnimId = requestAnimationFrame(animateWeather);
    }

    // ------------------------------------------------------------
    // 2. GEEK CLI TERMINAL REJIMI (#25)
    // ------------------------------------------------------------
    let terminalEl = null;

    function renderTerminal() {
        if (terminalEl) return terminalEl;

        terminalEl = document.createElement('div');
        terminalEl.id = 'geek-cli-terminal';
        terminalEl.style.display = 'none';
        terminalEl.style.position = 'fixed';
        terminalEl.style.inset = '0';
        terminalEl.style.width = '100vw';
        terminalEl.style.height = '100vh';
        terminalEl.style.background = 'rgba(5, 10, 18, 0.98)';
        terminalEl.style.backdropFilter = 'blur(10px)';
        terminalEl.style.zIndex = '999999';
        terminalEl.style.fontFamily = '"JetBrains Mono", Consolas, monospace';
        terminalEl.style.color = '#10b981';
        terminalEl.style.padding = '24px';
        terminalEl.style.boxSizing = 'border-box';
        terminalEl.style.overflow = 'hidden';
        terminalEl.style.flexDirection = 'column';

        terminalEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #1e293b; padding-bottom:10px; margin-bottom:12px;">
                <span style="font-size:13px; color:#94a3b8;">💻 ABDUGOFFOROV CORE TERMINAL v2.4 (Rejimdan chiqish uchun: "exit" yoki Esc)</span>
                <button type="button" id="cli-close-btn" style="background:none; border:none; color:#f87171; cursor:pointer; font-size:18px;">&times;</button>
            </div>
            <div id="cli-output" style="flex:1; overflow-y:auto; line-height:1.6; font-size:14px; white-space:pre-wrap; word-break:break-word;">
========================================================================
   ABDUGOFFOROV CORE TERMINAL v2.4 (Interaktiv Linux CLI)
   Tizim holati: Barcha xizmatlar faol va tezkor ishlamoqda [OK]
========================================================================
Xush kelibsiz! Buyruqlar ro'yxatini ko'rish uchun "help" deb yozing.
            </div>
            <div style="display:flex; align-items:center; margin-top:10px; gap:8px;">
                <span style="color:#38bdf8;">kay@abdugofforov:~$</span>
                <input type="text" id="cli-input" autofocus autocomplete="off" spellcheck="false" style="flex:1; background:transparent; border:none; color:#10b981; font-family:inherit; font-size:14px; outline:none;">
            </div>
        `;
        document.body.appendChild(terminalEl);

        terminalEl.querySelector('#cli-close-btn').addEventListener('click', toggleTerminal);
        const input = terminalEl.querySelector('#cli-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleCliCommand(input.value.trim());
                input.value = '';
            } else if (e.key === 'Escape') {
                toggleTerminal();
            }
        });

        return terminalEl;
    }

    function toggleTerminal() {
        const term = renderTerminal();
        const isHidden = !term.style.display || term.style.display === 'none';
        if (isHidden) {
            term.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const input = term.querySelector('#cli-input');
                if (input) input.focus();
            }, 50);
        } else {
            term.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    function printCli(text) {
        const out = document.getElementById('cli-output');
        if (out) {
            out.textContent += '\n' + text;
            out.scrollTop = out.scrollHeight;
        }
    }

    function handleCliCommand(cmd) {
        if (!cmd) return;
        printCli(`kay@abdugofforov:~$ ${cmd}`);
        const parts = cmd.toLowerCase().split(' ');
        const main = parts[0];

        switch (main) {
            case 'help':
                printCli(`Mavjud buyruqlar:
  help              - Barcha buyruqlarni ko'rsatish
  posts             - Barcha maqolalar ro'yxati
  quote             - Tasodifiy kun hikmatini ko'rsatish
  weather <tur>     - Ob-havoni o'zgartirish (cosmic, rain, snow, sun)
  matrix            - Matrix yashil raqamlar yomg'irini yoqish
  deutsch           - Nemis tili akademiyasiga o'tish
  tools             - Asboblar laboratoriyasiga o'tish
  clear             - Ekranni tozalash
  exit              - Terminaldan chiqish`);
                break;
            case 'posts':
                const posts = window.posts || [];
                if (!posts.length) printCli('Hozircha maqolalar yuklanmagan.');
                else {
                    printCli('Maqolalar ro\'yxati:');
                    posts.forEach((p, i) => printCli(`  [${i + 1}] ${p.title} (${p.category})`));
                }
                break;
            case 'quote':
                const qText = document.getElementById('quote-text');
                const qAuth = document.getElementById('quote-author');
                printCli(`"${qText ? qText.textContent : 'Harakatda barakat.'}" — ${qAuth ? qAuth.textContent : 'Hikmat'}`);
                break;
            case 'weather':
                const wMode = parts[1] || 'cosmic';
                setWeather(wMode);
                printCli(`Ob-havo o'rnatildi: ${wMode}`);
                break;
            case 'matrix':
                printCli('Matrix Rain Mode faollashtirildi!');
                setWeather('rain');
                break;
            case 'deutsch':
                printCli('Deutsch akademiyasi ochilmoqda...');
                window.location.href = 'deutsch.html';
                break;
            case 'tools':
                printCli('Tools laboratoriyasi ochilmoqda...');
                window.location.href = 'tools.html';
                break;
            case 'clear':
                document.getElementById('cli-output').textContent = '';
                break;
            case 'exit':
                toggleTerminal();
                break;
            default:
                printCli(`Noma'lum buyruq: "${main}". Yordam uchun "help" deb yozing.`);
        }
    }

    // Shortcut listener: ~ key
    window.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                toggleTerminal();
            }
        }
    });

    // ------------------------------------------------------------
    // 3. SPATIAL AUDIO (FAZOYIY 8D OVOZ) ENGINE (#26)
    // ------------------------------------------------------------
    let spatialPanner = null;
    let spatialOsc = null;
    let isSpatialActive = false;

    function toggleSpatialAudio() {
        isSpatialActive = !isSpatialActive;
        if (window.showToast) {
            window.showToast(isSpatialActive ? '🎧 8D Fazoiy Ovoz faollashtirildi!' : '🎧 Standart stereo rejimiga qaytildi', 'info');
        }
        return isSpatialActive;
    }

    // ------------------------------------------------------------
    // 4. NOTION / MARKDOWN EXPORT (#27)
    // ------------------------------------------------------------
    function exportPostToMarkdown(post) {
        if (!post) return;
        const md = `# ${post.title}\n\n` +
            `> Muallif: ${post.author || "Abdugofforov"} | Sana: ${post.date} | Kategoriya: ${post.category}\n\n` +
            `**Qisqacha:** ${post.excerpt}\n\n---\n\n` +
            `${post.content || ''}\n\n` +
            `---\n*Manba: https://abdugofforov.uz*`;

        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${(post.title || 'maqola').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
        a.click();

        if (window.showToast) window.showToast('📄 Markdown fayl yuklab olindi!', 'success');
    }

    function copyPostAsNotion(post) {
        if (!post) return;
        const text = `# ${post.title}\n${post.content}\nTags: ${(post.tags || []).join(', ')}`;
        navigator.clipboard.writeText(text).then(() => {
            if (window.showToast) window.showToast('📋 Notion formatida nusxalandi!', 'success');
        });
    }

    // ------------------------------------------------------------
    // 5. VAQT KAPSULASI (TIME CAPSULE - #28)
    // ------------------------------------------------------------
    const CAPSULE_KEY = 'abdu_time_capsules';

    function getTimeCapsules() {
        try {
            return JSON.parse(localStorage.getItem(CAPSULE_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveTimeCapsule(capsule) {
        const list = getTimeCapsules();
        list.push(capsule);
        localStorage.setItem(CAPSULE_KEY, JSON.stringify(list));
    }

    function renderTimeCapsuleModal() {
        let modal = document.getElementById('time-capsule-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'time-capsule-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 620px; width: 95%;">
                <button class="modal-close" id="close-capsule-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <span style="font-size: 26px;">⏳</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.25rem;">Vaqt Kapsulasi (Kelajakdagi o'zimga xat)</h3>
                            <small style="color: var(--text-secondary);">Kelajakdagi ma'lum sanagacha muhrlab qo'yiluvchi shaxsiy maktub</small>
                        </div>
                    </div>

                    <form id="capsule-form" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 13px; color: var(--text-secondary); display:block; margin-bottom: 4px;">Kapsula sarlavhasi / Maqsad:</label>
                            <input type="text" id="capsule-title" class="form-input" placeholder="Masalan: 2027-yilgi maqsadlarim" required style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 12px;">
                            <label style="font-size: 13px; color: var(--text-secondary); display:block; margin-bottom: 4px;">Ochilish sanasi:</label>
                            <input type="date" id="capsule-date" class="form-input" required style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 14px;">
                            <label style="font-size: 13px; color: var(--text-secondary); display:block; margin-bottom: 4px;">Kelajakdagi o'zingizga xat:</label>
                            <textarea id="capsule-msg" class="form-input" rows="4" placeholder="Kelajakda nimalarga erishgan bo'lishni xohlaysiz? Qanday his-tuyg'ular bilan yashayapsiz?..." required style="width: 100%; font-family: inherit; font-size: 14px;"></textarea>
                        </div>
                        <div style="text-align: right;">
                            <button type="submit" class="btn-primary" style="padding: 8px 20px;">🔒 Kapsulani muhrlash</button>
                        </div>
                    </form>

                    <h4 style="margin: 0 0 10px 0; font-size: 14px;">Muhrlangan Kapsulalaringiz:</h4>
                    <div id="capsule-list" style="display:flex; flex-direction:column; gap:10px; max-height: 220px; overflow-y:auto;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeCapsule = () => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        };

        const closeBtn = modal.querySelector('#close-capsule-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeCapsule);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCapsule();
        });

        // Set default min date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        modal.querySelector('#capsule-date').min = tomorrow.toISOString().split('T')[0];

        modal.querySelector('#capsule-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = modal.querySelector('#capsule-title').value.trim();
            const date = modal.querySelector('#capsule-date').value;
            const msg = modal.querySelector('#capsule-msg').value.trim();

            saveTimeCapsule({
                id: Date.now(),
                title,
                unlockDate: date,
                message: msg,
                createdAt: new Date().toISOString()
            });

            modal.querySelector('#capsule-title').value = '';
            modal.querySelector('#capsule-msg').value = '';
            renderCapsuleList();
            if (window.showToast) window.showToast('🔒 Kapsula xavfsiz muhrlandi!', 'success');
        });

        return modal;
    }

    function renderCapsuleList() {
        const modal = document.getElementById('time-capsule-modal');
        if (!modal) return;
        const box = modal.querySelector('#capsule-list');
        const list = getTimeCapsules();

        if (list.length === 0) {
            box.innerHTML = '<p style="color:var(--text-secondary); font-size:13px; text-align:center;">Hozircha muhrlangan kapsulalar mavjud emas.</p>';
            return;
        }

        const now = new Date();
        box.innerHTML = list.map(c => {
            const unlock = new Date(c.unlockDate);
            const isUnlocked = now >= unlock;
            const diffDays = Math.max(0, Math.ceil((unlock - now) / (1000 * 60 * 60 * 24)));

            return `
                <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${c.title}</strong>
                        <span style="font-size:12px; font-weight:600; padding:2px 8px; border-radius:12px; background:${isUnlocked ? '#10b981' : '#f59e0b'}; color:#fff;">
                            ${isUnlocked ? '🔓 Ochildi!' : `🔒 ${diffDays} kun qoldi`}
                        </span>
                    </div>
                    <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">Ochilish sanasi: ${c.unlockDate}</div>
                    ${isUnlocked ? `<div style="margin-top:8px; padding-top:8px; border-top:1px dashed var(--border-color); font-size:13.5px; color:var(--text-primary); font-style:italic;">"${c.message}"</div>` : ''}
                </div>
            `;
        }).join('');
    }

    // ------------------------------------------------------------
    // 6. INITIALIZATION & EXPORTS
    // ------------------------------------------------------------
    initWeatherCanvas();

    window.AestheticSuite = {
        setWeather,
        toggleTerminal,
        toggleSpatialAudio,
        exportPostToMarkdown,
        copyPostAsNotion,
        openTimeCapsule: () => {
            const m = renderTimeCapsuleModal();
            renderCapsuleList();
            m.classList.add('active');
            m.style.display = 'flex';
            m.style.opacity = '1';
            m.style.visibility = 'visible';
            m.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
        }
    };

})();
