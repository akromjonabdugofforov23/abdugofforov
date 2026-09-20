// ============================================================
// ABDUGOFFOROV — PRO AI BACKGROUND ENGINE (TRANQUIL STARS & METEOR)
// 1. 'stars'     : ✨ Sokin Yulduzlar & Uchar Yulduz (DEFAULT)
// 2. 'galaxy'    : 🌌 3D Spiral Galaxy
// 3. 'nebula'    : 🪐 3D Cosmic Nebula
// 4. 'none'      : ✦ Statik Fon (Faqat Avrora gradienti)
// ============================================================

(function() {
    'use strict';

    let canvas, ctx;
    let width = 0, height = 0, dpr = 1;
    let rafId = null;
    let isRunning = false;
    let activeMode = 'stars'; // Default: Sokin yulduzlar va uchar yulduz!

    // Mouse parallax damping
    const mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        active: false
    };

    const config = {
        speed: 1.0,
        density: 1.0,
        enableMouse: true
    };

    let clock = 0;

    // ============================================================
    // 1. ENGINE: ✨ SOKIN YULDUZLAR VA UCHAR YULDUZ (METEOR)
    // ============================================================
    let tranquilStars = [];
    let shootingMeteors = [];
    let nextMeteorTime = 120; // Ilk uchar yulduz tezda ko'rinishi uchun (2 soniya)

    function initTranquilStars() {
        tranquilStars = [];
        shootingMeteors = [];
        const w = width || window.innerWidth || 1200;
        const h = height || window.innerHeight || 800;

        // 200-240 ta sokin, chiroyli miltillovchi yulduzlar (ko'zni charchatmaydi)
        const count = Math.floor(220 * config.density);

        for (let i = 0; i < count; i++) {
            tranquilStars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                z: 0.2 + Math.random() * 0.8, // 3D chuqurlik qatlami
                size: 0.7 + Math.random() * 1.5, // 0.7px dan 2.2px gacha
                baseAlpha: 0.25 + Math.random() * 0.55,
                twinkleSpeed: 0.015 + Math.random() * 0.035,
                twinklePhase: Math.random() * Math.PI * 2,
                colorType: i % 4 // 0: oq, 1: binafsha, 2: feruza/sapfir, 3: iliq oltin
            });
        }
    }

    function spawnShootingStar() {
        const w = width || window.innerWidth || 1200;
        const h = height || window.innerHeight || 800;

        // Bir burchakdan ikkinchi burchakka (ko'pincha yuqori burchakdan pastki burchakka)
        const fromLeft = Math.random() > 0.45;
        const startX = fromLeft 
            ? -40 + Math.random() * (w * 0.35) 
            : w * 0.65 + Math.random() * (w * 0.35 + 40);
        const startY = -30 + Math.random() * (h * 0.25);

        // Burchak bo'ylab yo'nalish (~30° dan 42° gacha qiyalik)
        const angle = fromLeft 
            ? (Math.PI * 0.18 + (Math.random() - 0.5) * 0.14) 
            : (Math.PI * 0.82 + (Math.random() - 0.5) * 0.14);

        const speed = 13 + Math.random() * 7;
        const length = 170 + Math.random() * 130;

        shootingMeteors.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: length,
            width: 1.8 + Math.random() * 0.8,
            alpha: 1.0,
            fadeSpeed: 0.012 + Math.random() * 0.008
        });
    }

    function renderTranquilStars() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';

        // 1. Sokin miltillovchi yulduzlar
        const mouseShiftX = mouse.x * 0.028;
        const mouseShiftY = mouse.y * 0.028;

        for (let i = 0; i < tranquilStars.length; i++) {
            const s = tranquilStars[i];

            // Ohista sichqoncha parallaksi (chuqurlik hissi)
            let px = s.x + mouseShiftX * s.z;
            let py = s.y + mouseShiftY * s.z;

            // Ekranning chetidan o'tsa aylantirish
            if (px < 0) px = width + (px % width);
            else if (px > width) px = px % width;
            if (py < 0) py = height + (py % height);
            else if (py > height) py = py % height;

            // Miltillash effekti (twinkle)
            const tw = Math.sin(clock * s.twinkleSpeed + s.twinklePhase);
            const alpha = Math.max(0.12, s.baseAlpha + tw * 0.28);
            const radius = Math.max(0.4, s.size * (1 + tw * 0.12));

            let col;
            if (isDark) {
                if (s.colorType === 0) col = `rgba(255, 255, 255, ${alpha * 0.95})`;       // Pure White Starlight
                else if (s.colorType === 1) col = `rgba(167, 139, 250, ${alpha * 0.90})`;  // Cyber Lavender (#a78bfa)
                else if (s.colorType === 2) col = `rgba(56, 189, 248, ${alpha * 0.90})`;   // Electric Cyan (#38bdf8)
                else col = `rgba(253, 224, 71, ${alpha * 0.85})`;                          // Galactic Gold (#fde047)
            } else {
                // Kunduzgi rejim: faqat nozik, toza kumush va nafis indigo zarrachalari (rang-barang dog'larsiz)
                if (s.colorType === 0) col = `rgba(100, 116, 139, ${alpha * 0.35})`;        // Starlight Slate
                else if (s.colorType === 1) col = `rgba(99, 102, 241, ${alpha * 0.30})`;    // Refined Indigo Tint
                else if (s.colorType === 2) col = `rgba(148, 163, 184, ${alpha * 0.35})`;   // Cool Silver
                else col = `rgba(71, 85, 105, ${alpha * 0.28})`;                           // Subtle Graphite
            }

            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.arc(px, py, isDark ? radius : Math.max(0.4, radius * 0.7), 0, Math.PI * 2);
            ctx.fill();

            // Faqat tungi rejimda nurli halo (kunduzgi rejimda dog' bo'lib ko'rinmasligi uchun)
            if (isDark && s.size > 1.6 && alpha > 0.45) {
                const glowR = radius * 2.8;
                const halo = ctx.createRadialGradient(px, py, 0, px, py, glowR);
                halo.addColorStop(0, col);
                halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(px, py, glowR, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 2. Vaqti-vaqti bilan burchakdan burchakka uchuvchi yulduz (Uchar Yulduz / Meteor)
        if (clock >= nextMeteorTime) {
            spawnShootingStar();
            // Har 4-8 soniyada yangi uchar yulduz (60fps da 240-480 kadr)
            nextMeteorTime = clock + Math.floor((220 + Math.random() * 280) / Math.max(0.5, config.speed));
        }

        for (let i = shootingMeteors.length - 1; i >= 0; i--) {
            const m = shootingMeteors[i];
            m.x += m.vx * config.speed;
            m.y += m.vy * config.speed;
            m.alpha -= m.fadeSpeed * config.speed;

            if (m.alpha <= 0 || m.x < -150 || m.x > width + 150 || m.y > height + 150) {
                shootingMeteors.splice(i, 1);
                continue;
            }

            const tailX = m.x - (m.vx / 14) * m.length;
            const tailY = m.y - (m.vy / 14) * m.length;

            const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            grad.addColorStop(0, 'rgba(0, 0, 0, 0)');

            if (isDark) {
                grad.addColorStop(0.5, `rgba(56, 189, 248, ${m.alpha * 0.4})`);
                grad.addColorStop(0.85, `rgba(192, 132, 252, ${m.alpha * 0.75})`);
                grad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`);
            } else {
                // Kunduzgi nozik kumush-indigo meteor
                grad.addColorStop(0.5, `rgba(14, 165, 233, ${m.alpha * 0.25})`);
                grad.addColorStop(0.85, `rgba(79, 70, 229, ${m.alpha * 0.55})`);
                grad.addColorStop(1, `rgba(15, 23, 42, ${m.alpha * 0.75})`);
            }

            ctx.strokeStyle = grad;
            ctx.lineWidth = isDark ? m.width : Math.max(0.8, m.width * 0.75);
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();

            // Uchar yulduzning yorqin nurlanuvchi boshi
            const headR = isDark ? m.width * 1.6 : 1.5;
            ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${m.alpha})` : `rgba(79, 70, 229, ${m.alpha * 0.85})`;
            ctx.beginPath();
            ctx.arc(m.x, m.y, headR, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ============================================================
    // 2. ENGINE: 🌌 3D SPIRAL GALAXY (QO'SHIMCHA VARIANT SIFATIDA SAQLANGAN)
    // ============================================================
    let galaxyStars = [];
    let galaxyDust = [];

    function initGalaxy() {
        galaxyStars = [];
        galaxyDust = [];
        const numStars = Math.floor(1400 * config.density);
        const numArms = 3;
        const maxRadius = 480;

        const coreCount = Math.floor(numStars * 0.25);
        for (let i = 0; i < coreCount; i++) {
            const u = Math.random();
            const r = Math.pow(u, 2.2) * 90;
            galaxyStars.push({
                r: r,
                theta: Math.random() * Math.PI * 2,
                phi: (Math.random() - 0.5) * Math.PI,
                isCore: true,
                speed: 0.004 / Math.sqrt(Math.max(15, r * 0.1)),
                size: 0.8 + Math.random() * 1.6,
                colorType: 'core',
                twinkleSpeed: 0.03 + Math.random() * 0.05,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }

        const armCount = numStars - coreCount;
        for (let i = 0; i < armCount; i++) {
            const arm = i % numArms;
            const armAngle = arm * ((Math.PI * 2) / numArms);
            const r = 25 + Math.pow(Math.random(), 1.6) * (maxRadius - 25);
            const theta = armAngle + 3.6 * Math.log(r / 25) + (Math.random() - 0.5) * 0.45;
            const z = (24 * Math.exp(-r / 250) + 6) * (Math.random() - 0.5);

            galaxyStars.push({
                r: r,
                theta: theta,
                zBase: z,
                isCore: false,
                speed: 0.0018 * (130 / Math.sqrt(r + 35)),
                size: 0.6 + Math.random() * 1.5,
                colorType: r > 300 ? 'outer' : (r < 100 ? 'inner' : 'mid'),
                twinkleSpeed: 0.02 + Math.random() * 0.04,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    function renderGalaxy(cx, cy) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const basePitch = 1.02;
        const baseYaw = -0.22;
        const pitch = basePitch + (mouse.y / (height || 1)) * 0.35;
        const yaw = baseYaw + (mouse.x / (width || 1)) * 0.45;

        const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
        const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
        const fov = 500, camDist = 600;

        ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';

        // Core glow
        const coreR = 70 * (fov / camDist);
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        if (isDark) {
            coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            coreGrad.addColorStop(0.3, 'rgba(253, 224, 71, 0.4)');
            coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
            coreGrad.addColorStop(0, 'rgba(217, 119, 6, 0.3)');
            coreGrad.addColorStop(0.3, 'rgba(124, 58, 237, 0.15)');
            coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < galaxyStars.length; i++) {
            const s = galaxyStars[i];
            s.theta += s.speed * config.speed;

            let x0, y0, z0;
            if (s.isCore) {
                x0 = s.r * Math.cos(s.theta) * Math.cos(s.phi);
                y0 = s.r * Math.sin(s.theta) * Math.cos(s.phi);
                z0 = s.r * Math.sin(s.phi) * 0.7;
            } else {
                x0 = s.r * Math.cos(s.theta);
                y0 = s.r * Math.sin(s.theta);
                z0 = s.zBase;
            }

            const y1 = y0 * cosP - z0 * sinP;
            const z1 = y0 * sinP + z0 * cosP;
            const x2 = x0 * cosY + z1 * sinY;
            const z2 = -x0 * sinY + z1 * cosY;

            const depth = z2 + camDist;
            if (depth < 40) continue;

            const scale = fov / depth;
            const px = cx + x2 * scale;
            const py = cy + y1 * scale;

            if (px < -20 || px > width + 20 || py < -20 || py > height + 20) continue;

            const tw = 0.75 + Math.sin(clock * s.twinkleSpeed + s.twinkleOffset) * 0.25;
            const rad = Math.max(0.4, s.size * scale * tw);

            let col;
            if (isDark) {
                col = s.colorType === 'core' ? `rgba(254, 240, 138, ${0.8 * tw})` : `rgba(56, 189, 248, ${0.75 * tw})`;
            } else {
                col = s.colorType === 'core' ? `rgba(180, 83, 9, ${0.85 * tw})` : `rgba(109, 40, 217, ${0.75 * tw})`;
            }

            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.arc(px, py, rad, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ============================================================
    // MAIN LOOP & DISPATCHER
    // ============================================================
    function loop() {
        if (!isRunning) return;

        clock += 1;

        // Smooth mouse damping (Lerp)
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        if (activeMode === 'stars') {
            renderTranquilStars();
        } else if (activeMode === 'galaxy') {
            renderGalaxy(cx, cy);
        } else if (activeMode === 'none') {
            // Statik toza fon
        } else {
            renderTranquilStars();
        }

        rafId = requestAnimationFrame(loop);
    }

    function resize() {
        if (!canvas) return;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        if (activeMode === 'stars') {
            initTranquilStars();
        }
    }

    function switch3DMode(mode) {
        const validModes = ['stars', 'galaxy', 'none'];
        if (!validModes.includes(mode)) {
            mode = 'stars';
        }
        activeMode = mode;

        try {
            localStorage.setItem('kay_3d_bg', mode);
        } catch(e) {}

        if (mode === 'stars') initTranquilStars();
        else if (mode === 'galaxy') initGalaxy();

        // Update UI buttons across the page
        document.querySelectorAll('[data-3d-mode]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-3d-mode') === mode);
        });

        if (typeof window.showToast === 'function') {
            const names = {
                stars: '✨ Sokin Yulduzlar & Uchar Yulduz (Meteor)',
                galaxy: '🌌 3D Spiral Galaxy',
                none: '✦ Statik Fon (3D o\'chirildi)'
            };
            window.showToast(`Fon: ${names[mode] || mode}`);
        }
    }

    function init() {
        canvas = document.getElementById('pro-3d-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'pro-3d-canvas';
            canvas.className = 'pro-3d-canvas';
            canvas.setAttribute('aria-hidden', 'true');
            canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;opacity:0.95;transition:opacity 0.4s ease;';
            document.body.prepend(canvas);
        }

        ctx = canvas.getContext('2d');
        if (!ctx) return;

        resize();
        window.addEventListener('resize', resize, { passive: true });

        // Mouse move listener for soft tranquil parallax
        window.addEventListener('mousemove', (e) => {
            if (!config.enableMouse) return;
            mouse.targetX = e.clientX - width / 2;
            mouse.targetY = e.clientY - height / 2;
            mouse.active = true;
        }, { passive: true });

        // Touch listener for mobile
        window.addEventListener('touchmove', (e) => {
            if (!config.enableMouse || !e.touches[0]) return;
            mouse.targetX = e.touches[0].clientX - width / 2;
            mouse.targetY = e.touches[0].clientY - height / 2;
            mouse.active = true;
        }, { passive: true });

        // Watch for theme and variant switches to refresh star color palette
        const themeObserver = new MutationObserver(() => {
            if (activeMode === 'stars') initTranquilStars();
            else if (activeMode === 'galaxy') initGalaxy();
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-light-variant'] });

        // Trigger star spawn
        switch3DMode('stars');

        isRunning = true;
        rafId = requestAnimationFrame(loop);

        // Click delegation for 3D buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-3d-mode]');
            if (btn) {
                e.preventDefault();
                const m = btn.getAttribute('data-3d-mode');
                switch3DMode(m);
            }
        });
    }

    // Expose API
    window.switch3DBackground = switch3DMode;
    window.get3DMode = () => activeMode;
    window.config3D = config;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
