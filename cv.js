// ============================================================
// ABDUGOFFOROV CV — DUAL MODE (VISUAL & CLI TERMINAL)
// ============================================================

(function () {
    'use strict';

    // ---------- MAVZU (THEME TOGGLE) ----------
    const themeBtn = document.getElementById('theme-btn');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('abdugofforov_theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem('abdugofforov_theme', next);
        });
    }

    // ---------- REJIMLAR (VISUAL VS TERMINAL) ----------
    const btnModeVisual = document.getElementById('btn-mode-visual');
    const btnModeTerminal = document.getElementById('btn-mode-terminal');
    const visualView = document.getElementById('visual-view');
    const terminalView = document.getElementById('terminal-view');
    const termInput = document.getElementById('term-input');

    function setMode(mode) {
        if (mode === 'visual') {
            btnModeVisual.classList.add('active');
            btnModeTerminal.classList.remove('active');
            visualView.style.display = 'block';
            terminalView.style.display = 'none';
        } else {
            btnModeTerminal.classList.add('active');
            btnModeVisual.classList.remove('active');
            visualView.style.display = 'none';
            terminalView.style.display = 'block';
            if (termInput) {
                setTimeout(() => termInput.focus(), 50);
            }
        }
    }

    if (btnModeVisual) btnModeVisual.addEventListener('click', () => setMode('visual'));
    if (btnModeTerminal) btnModeTerminal.addEventListener('click', () => setMode('terminal'));

    // Rezyumeni chop etish / PDF eksport
    const printCvBtn = document.getElementById('print-cv-btn');
    if (printCvBtn) {
        printCvBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // ============================================================
    // TERMINAL / CLI ENGINE
    // ============================================================
    const termHistory = document.getElementById('term-history');
    const terminalBody = document.getElementById('terminal-body');

    const commandHistory = [];
    let historyIndex = -1;

    const COMMANDS = {
        help: `Mavjud buyruqlar:
  • <span style="color:#60a5fa;">about</span>     - Muallif haqida qisqacha ma'lumot
  • <span style="color:#60a5fa;">skills</span>    - Texnologiyalar va ko'nikmalar ro'yxati
  • <span style="color:#60a5fa;">projects</span>  - Jonli loyihalar va veb-platformalar
  • <span style="color:#60a5fa;">exp</span>       - Ish tajribasi va faoliyat
  • <span style="color:#60a5fa;">theme</span>     - Sayt mavzusini o'zgartirish (Dark / Light)
  • <span style="color:#60a5fa;">matrix</span>    - Hacker rejimini yoqish (Matrix effekti)
  • <span style="color:#60a5fa;">clear</span>     - Terminal ekranini tozalash
  • <span style="color:#60a5fa;">visual</span>    - Vizual rejimga qaytish`,

        about: `Akromjon Abdug'offorov (Kay)
Role: Full-Stack Web Developer & EdTech Creator
Location: O'zbekiston
Bio: Yuqori xavfsizlikka ega zamonaviy veb-arxitekturalar, Cloudflare ekotizimi,
interaktiv ta'lim tizimlari va tezyurar foydalanuvchi interfeyslarini yaratishga
ixtisoslashgan dasturchi.`,

        skills: `TEXNOLOGIYALAR RO'YXATI:
[+] Frontend: JavaScript (ES6+), HTML5 Canvas, CSS3/PostCSS, PWA, UI/UX Glassmorphism
[+] Backend: Node.js, Express.js, Cloudflare Pages Functions, REST APIs, WebSockets
[+] Cloud & Edge: Cloudflare (Workers, KV, DNS, WAF, DDoS Guard), GitHub Actions
[+] DevOps & Tools: Git, PowerShell, Terser, Clean-CSS, Performance Optimizations
[+] Tillar: O'zbek tili (Ona tili), Nemis tili (Goethe B1/B2), Ingliz tili (Texnik)`,

        projects: `ASOSIY LOYIHALAR:
1. Abdugofforov.uz Platformasi
   - Tavsif: Shaxsiy blog, 3D vizuallar, xavfsiz Cloudflare arxitekturasi.
   - Havola: <a href="https://abdugofforov.uz" target="_blank" style="color:#6366f1;">https://abdugofforov.uz</a>

2. Deutsch Akademiyasi
   - Tavsif: Nemis tili testlari, audio kartochkalar, tartibsiz fe'llar va turnirlar.
   - Havola: <a href="https://deutsch.abdugofforov.uz" target="_blank" style="color:#6366f1;">https://deutsch.abdugofforov.uz</a>

3. Abdugofforov Tools
   - Tavsif: 100% brauzerda ishlovchi mikro-asboblar laboratoriyasi (Lotin-Kirill, WebP, JSON).
   - Havola: <a href="https://tools.abdugofforov.uz" target="_blank" style="color:#6366f1;">https://tools.abdugofforov.uz</a>

4. Cloudflare Qorovul & WAF Layer
   - Tavsif: DDoS va botlardan himoyalovchi aqlli himoya qatlami.`,

        exp: `TAJRIBA VA BOSQICHLAR:
• 2024 — Hozirgacha: Mustaqil Full-Stack Dasturchi & EdTech Loyihalar Muallifi
  - Cloudflare Pages, Edge Functions va shaxsiy blog infratuzilmasi.
  - O'zbek tili va nemis tili bo'yicha interaktiv ta'lim vositalarini yaratish.

• 2022 — 2024: Web Dasturchi & Interaktiv Ta'lim Loyihalari
  - Frontend arxitekturasi, Canvas animatsiyalari va mustaqil dasturlar.`,

        whoami: "guest@abdugofforov (Visitor / Recruiter)",
        sudo: "Permission denied: Sudo huquqi faqat Akromjon Abdug'offorovga berilgan :)",
        date: () => new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }) + " (Toshkent vaqti)"
    };

    function addTerminalLine(content, isCommand = false) {
        const line = document.createElement('div');
        line.className = 'term-line-output';
        if (isCommand) {
            line.innerHTML = `<span style="color:#4ade80;">guest@abdugofforov:~$</span> ${escapeHtml(content)}`;
        } else {
            line.innerHTML = content;
        }
        termHistory.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function runMatrixEffect() {
        addTerminalLine("<span style='color:#22c55e;'>Wake up, Neo... The Matrix has you.</span>");
        let count = 0;
        const interval = setInterval(() => {
            let row = '';
            for (let i = 0; i < 40; i++) {
                row += String.fromCharCode(33 + Math.floor(Math.random() * 90)) + ' ';
            }
            addTerminalLine(`<span style="color:#22c55e; opacity:0.8;">${row}</span>`);
            count++;
            if (count > 8) {
                clearInterval(interval);
                addTerminalLine("<span style='color:#4ade80;'>Matrix seansi yakunlandi.</span>");
            }
        }, 120);
    }

    function handleCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        commandHistory.push(rawCmd);
        historyIndex = commandHistory.length;

        addTerminalLine(rawCmd, true);

        if (cmd === 'clear') {
            termHistory.innerHTML = '';
            return;
        }

        if (cmd === 'visual' || cmd === 'mode visual') {
            setMode('visual');
            return;
        }

        if (cmd === 'matrix') {
            runMatrixEffect();
            return;
        }

        if (cmd === 'theme') {
            const current = htmlEl.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem('abdugofforov_theme', next);
            addTerminalLine(`Mavzu almashtirildi: <span style="color:#60a5fa;">${next.toUpperCase()}</span>`);
            return;
        }

        if (COMMANDS[cmd]) {
            const res = typeof COMMANDS[cmd] === 'function' ? COMMANDS[cmd]() : COMMANDS[cmd];
            addTerminalLine(res);
        } else {
            addTerminalLine(`Buyruq topilmadi: "<span style="color:#f87171;">${escapeHtml(cmd)}</span>". Yordam uchun <span style="color:#4ade80;">help</span> deb yozing.`);
        }
    }

    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = termInput.value;
                termInput.value = '';
                handleCommand(val);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    termInput.value = commandHistory[historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    termInput.value = commandHistory[historyIndex] || '';
                } else {
                    historyIndex = commandHistory.length;
                    termInput.value = '';
                }
            }
        });
    }

    function escapeHtml(str) {
        return (str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

})();
