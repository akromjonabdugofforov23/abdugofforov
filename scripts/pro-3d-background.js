// ============================================================
// ABDUGOFFOROV — PRO AI BACKGROUND ENGINE (TRANQUIL STARS & METEOR)
// ULTRA-HIGH PERFORMANCE EDITION (OffscreenCanvas + Web Worker & Fallback)
// Main Thread 100% Free / Zero-Lag / 30FPS Capped
// ============================================================

(function() {
    'use strict';

    let canvas, ctx;
    let width = 0, height = 0, dpr = 1;
    let rafId = null;
    let isRunning = false;
    let activeMode = 'stars'; // Default: Sokin yulduzlar va uchar yulduz

    // Web Worker & OffscreenCanvas state
    let worker = null;
    let useWorker = false;

    const rawConfig = {
        speed: 1.0,
        density: 1.0,
        enableCompanion: true
    };

    // Proxy config so external scripts (e.g. 3d-lab.html) can modify properties and sync to worker
    const config = new Proxy(rawConfig, {
        get(target, prop) {
            if (prop === 'enableMouse') return target.enableCompanion;
            return target[prop];
        },
        set(target, prop, val) {
            if (prop === 'enableMouse') {
                target.enableCompanion = Boolean(val);
            } else {
                target[prop] = val;
            }

            if (useWorker && worker) {
                worker.postMessage({
                    type: 'config',
                    config: {
                        speed: target.speed,
                        density: target.density,
                        enableCompanion: target.enableCompanion
                    }
                });
            } else if (ctx) {
                if (prop === 'density') {
                    if (activeMode === 'stars') initTranquilStars();
                    else if (activeMode === 'galaxy') initGalaxy();
                }
            }
            return true;
        }
    });

    let clock = 0;
    let lastFrameTime = 0;
    const TARGET_FPS = 30;
    const FPS_INTERVAL = 1000 / TARGET_FPS; // ~33.3ms

    let isPageHidden = false;
    let isScrolling = false;
    let scrollTimer = null;

    // ============================================================
    // 1. SOKIN YULDUZLAR VA UCHAR YULDUZ (METEOR) [FALLBACK ENGINE]
    // ============================================================
    let tranquilStars = [];
    let shootingMeteors = [];
    let nextMeteorTime = 60;

    function initTranquilStars() {
        tranquilStars = [];
        shootingMeteors = [];
        const w = width || window.innerWidth || 1200;
        const h = height || window.innerHeight || 800;

        // 75 ta nafis, estetik yulduzlar (ortiqcha yuklama bermaydi)
        const count = Math.floor(75 * config.density);

        for (let i = 0; i < count; i++) {
            tranquilStars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: 0.8 + Math.random() * 1.5,
                baseAlpha: 0.3 + Math.random() * 0.5,
                twinkleSpeed: 0.015 + Math.random() * 0.03,
                twinklePhase: Math.random() * Math.PI * 2,
                colorType: i % 4 // 0: oq, 1: binafsha, 2: feruza, 3: oltin
            });
        }
    }

    function spawnShootingStar() {
        const w = width || window.innerWidth || 1200;
        const h = height || window.innerHeight || 800;

        const fromLeft = Math.random() > 0.45;
        const startX = fromLeft 
            ? -30 + Math.random() * (w * 0.35) 
            : w * 0.65 + Math.random() * (w * 0.35 + 30);
        const startY = -20 + Math.random() * (h * 0.25);

        const angle = fromLeft 
            ? (Math.PI * 0.18 + (Math.random() - 0.5) * 0.14) 
            : (Math.PI * 0.82 + (Math.random() - 0.5) * 0.14);

        const speed = 14 + Math.random() * 6;
        const length = 160 + Math.random() * 100;

        shootingMeteors.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: length,
            width: 1.8 + Math.random() * 0.6,
            alpha: 1.0,
            fadeSpeed: 0.018 + Math.random() * 0.01
        });
    }

    function renderTranquilStars() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';

        for (let i = 0; i < tranquilStars.length; i++) {
            const s = tranquilStars[i];
            const tw = Math.sin(clock * s.twinkleSpeed + s.twinklePhase);
            const alpha = Math.max(0.15, s.baseAlpha + tw * 0.25);
            const radius = Math.max(0.5, s.size * (1 + tw * 0.12));

            let col, glowCol;
            if (isDark) {
                if (s.colorType === 0) {
                    col = `rgba(255, 255, 255, ${alpha * 0.95})`;
                    glowCol = `rgba(255, 255, 255, ${alpha * 0.15})`;
                } else if (s.colorType === 1) {
                    col = `rgba(167, 139, 250, ${alpha * 0.90})`;
                    glowCol = `rgba(167, 139, 250, ${alpha * 0.15})`;
                } else if (s.colorType === 2) {
                    col = `rgba(56, 189, 248, ${alpha * 0.90})`;
                    glowCol = `rgba(56, 189, 248, ${alpha * 0.15})`;
                } else {
                    col = `rgba(253, 224, 71, ${alpha * 0.85})`;
                    glowCol = `rgba(253, 224, 71, ${alpha * 0.15})`;
                }
            } else {
                if (s.colorType === 0) col = `rgba(100, 116, 139, ${alpha * 0.35})`;
                else if (s.colorType === 1) col = `rgba(99, 102, 241, ${alpha * 0.30})`;
                else if (s.colorType === 2) col = `rgba(148, 163, 184, ${alpha * 0.35})`;
                else col = `rgba(71, 85, 105, ${alpha * 0.28})`;
            }

            // Asosiy yulduzcha
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.arc(s.x, s.y, isDark ? radius : Math.max(0.4, radius * 0.7), 0, Math.PI * 2);
            ctx.fill();

            // Yulduz nurli halosi (tezkor arc)
            if (isDark && s.size > 1.6 && alpha > 0.45) {
                ctx.fillStyle = glowCol;
                ctx.beginPath();
                ctx.arc(s.x, s.y, radius * 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Vaqti-vaqti bilan uchuvchi yulduz (Meteor)
        if (clock >= nextMeteorTime) {
            spawnShootingStar();
            nextMeteorTime = clock + Math.floor((150 + Math.random() * 200) / Math.max(0.5, config.speed));
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

            const headR = isDark ? m.width * 1.5 : 1.4;
            ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${m.alpha})` : `rgba(79, 70, 229, ${m.alpha * 0.85})`;
            ctx.beginPath();
            ctx.arc(m.x, m.y, headR, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ============================================================
    // 2. 🌌 3D SPIRAL GALAXY [FALLBACK ENGINE]
    // ============================================================
    let galaxyStars = [];

    function initGalaxy() {
        galaxyStars = [];
        const numStars = Math.floor(450 * config.density);
        const numArms = 3;
        const maxRadius = 450;

        const coreCount = Math.floor(numStars * 0.25);
        for (let i = 0; i < coreCount; i++) {
            const u = Math.random();
            const r = Math.pow(u, 2.2) * 80;
            galaxyStars.push({
                r: r,
                theta: Math.random() * Math.PI * 2,
                phi: (Math.random() - 0.5) * Math.PI,
                isCore: true,
                speed: 0.004 / Math.sqrt(Math.max(15, r * 0.1)),
                size: 0.8 + Math.random() * 1.4,
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
                size: 0.6 + Math.random() * 1.4,
                colorType: r > 300 ? 'outer' : (r < 100 ? 'inner' : 'mid'),
                twinkleSpeed: 0.02 + Math.random() * 0.04,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    function renderGalaxy(cx, cy) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const pitch = 1.02;
        const yaw = -0.22;

        const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
        const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
        const fov = 500, camDist = 600;

        ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';

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
    // 3. SICHQONCHA HAMROHI [FALLBACK ENGINE]
    // ============================================================
    const companion = {
        x: -200,
        y: -200,
        targetX: -200,
        targetY: -200,
        alpha: 0,
        targetAlpha: 0,
        lastMoveTime: 0,
        active: false,
        ripples: []
    };

    function updateCompanion() {
        if (!config.enableCompanion || !companion.active) return;

        if (Date.now() - companion.lastMoveTime > 1200) {
            companion.targetAlpha = 0;
        }

        const dx = companion.targetX - companion.x;
        const dy = companion.targetY - companion.y;
        companion.x += dx * 0.15;
        companion.y += dy * 0.15;
        companion.alpha += (companion.targetAlpha - companion.alpha) * 0.08;
    }

    function renderRipples() {
        if (companion.ripples.length === 0) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        for (let i = companion.ripples.length - 1; i >= 0; i--) {
            const rp = companion.ripples[i];
            rp.radius += 1.5;
            rp.alpha -= 0.03;
            if (rp.alpha <= 0 || rp.radius >= rp.maxRadius) {
                companion.ripples.splice(i, 1);
                continue;
            }
            ctx.strokeStyle = isDark
                ? `rgba(167, 139, 250, ${rp.alpha * 0.4})`
                : `rgba(99, 102, 241, ${rp.alpha * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    function renderMouseCompanion() {
        if (!companion.active) return;
        updateCompanion();
        renderRipples();

        if (companion.alpha < 0.03) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const pulse = 1 + Math.sin(clock * 0.06) * 0.18;
        const dotR = (isDark ? 1.5 : 1.2) * pulse;

        // Yumshoq tashqi nur (yengil arc)
        ctx.fillStyle = isDark
            ? `rgba(167, 139, 250, ${0.08 * companion.alpha})`
            : `rgba(99, 102, 241, ${0.05 * companion.alpha})`;
        ctx.beginPath();
        ctx.arc(companion.x, companion.y, isDark ? 40 : 30, 0, Math.PI * 2);
        ctx.fill();

        // Markaziy yorug'lik nuqtasi
        ctx.fillStyle = isDark
            ? `rgba(224, 231, 255, ${0.65 * companion.alpha})`
            : `rgba(99, 102, 241, ${0.45 * companion.alpha})`;
        ctx.beginPath();
        ctx.arc(companion.x, companion.y, dotR, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================================================
    // 4. MAIN LOOP (FALLBACK REJIM UCHUN: 30 FPS CAPPED)
    // ============================================================
    function loop(timestamp) {
        if (!isRunning) return;

        rafId = requestAnimationFrame(loop);

        if (isPageHidden || isScrolling) return;

        const elapsed = timestamp - lastFrameTime;
        if (elapsed < FPS_INTERVAL) return;
        lastFrameTime = timestamp - (elapsed % FPS_INTERVAL);

        clock += 1;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        if (activeMode === 'stars') {
            renderTranquilStars();
        } else if (activeMode === 'galaxy') {
            renderGalaxy(cx, cy);
        }

        renderMouseCompanion();
    }

    function resize() {
        if (!canvas) return;
        dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        if (useWorker && worker) {
            worker.postMessage({
                type: 'resize',
                width: width,
                height: height,
                dpr: dpr
            });
        } else if (ctx) {
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            if (activeMode === 'stars') {
                initTranquilStars();
            }
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

        if (useWorker && worker) {
            worker.postMessage({
                type: 'mode',
                mode: mode
            });
        } else if (ctx) {
            if (mode === 'stars') initTranquilStars();
            else if (mode === 'galaxy') initGalaxy();
        }

        document.querySelectorAll('[data-3d-mode]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-3d-mode') === mode);
        });
    }

    // ============================================================
    // 5. INIZIALIZATSIYA (OFFSCREENCANVAS & WORKER + FALLBACK)
    // ============================================================
    function init() {
        // Redused motion tekshiruvi
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        canvas = document.getElementById('pro-3d-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'pro-3d-canvas';
            canvas.className = 'pro-3d-canvas';
            canvas.setAttribute('aria-hidden', 'true');
            // GPU layer isolation: contain:strict va translate3d
            canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;contain:strict;transform:translate3d(0,0,0);will-change:transform;opacity:0.95;transition:opacity 0.4s ease;';
            document.body.prepend(canvas);
        }

        dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        const savedMode = localStorage.getItem('kay_3d_bg') || 'stars';
        activeMode = savedMode;

        // OffscreenCanvas va Worker mavjudligini tekshirish
        if (canvas.transferControlToOffscreen && window.Worker) {
            try {
                let workerPath = 'scripts/bg-worker.js';
                try {
                    const scriptEl = document.currentScript || document.querySelector('script[src*="pro-3d-background"]');
                    if (scriptEl && scriptEl.src) {
                        workerPath = new URL('bg-worker.js', scriptEl.src).href;
                    }
                } catch (_) {}
                worker = new Worker(workerPath);
                const offscreen = canvas.transferControlToOffscreen();
                useWorker = true;

                worker.onerror = (err) => {
                    console.error('[pro-3d-background] Worker error:', err);
                };

                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                worker.postMessage({
                    type: 'init',
                    canvas: offscreen,
                    width: width,
                    height: height,
                    dpr: dpr,
                    theme: isDark ? 'dark' : 'light',
                    mode: activeMode,
                    config: {
                        speed: config.speed,
                        density: config.density,
                        enableCompanion: config.enableCompanion
                    }
                }, [offscreen]);
            } catch (err) {
                console.warn('[pro-3d-background] OffscreenCanvas/Worker initialization failed, falling back to Main Thread:', err);
                useWorker = false;
                if (worker) {
                    try { worker.terminate(); } catch (_) {}
                    worker = null;
                }
            }
        }

        // Agar OffscreenCanvas qo'llab-quvvatlanmasa: mavjud optimallashtirilgan Main Thread fallbacki ishlaydi
        if (!useWorker) {
            ctx = canvas.getContext('2d', { alpha: true });
            if (!ctx) return;

            resize();
            switch3DMode(savedMode);

            isRunning = true;
            lastFrameTime = performance.now();
            rafId = requestAnimationFrame(loop);
        } else {
            // Tugmalar holatini sinxronlash
            document.querySelectorAll('[data-3d-mode]').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-3d-mode') === activeMode);
            });
        }

        // Window resize tinglovchisi
        window.addEventListener('resize', resize, { passive: true });

        // Tab yashiringanda render to'xtaydi (batareya va CPU ni asrash)
        document.addEventListener('visibilitychange', () => {
            isPageHidden = document.hidden;
            if (useWorker && worker) {
                worker.postMessage({ type: isPageHidden ? 'pause' : 'resume' });
            } else {
                if (isPageHidden) {
                    if (rafId) {
                        cancelAnimationFrame(rafId);
                        rafId = null;
                    }
                } else {
                    if (isRunning && !rafId) {
                        lastFrameTime = performance.now();
                        rafId = requestAnimationFrame(loop);
                    }
                }
            }
        });

        // Tezkor skroll paytida kadrni to'xtatib turish (60/120fps silliq skroll uchun)
        window.addEventListener('scroll', () => {
            isScrolling = true;
            if (useWorker && worker) {
                worker.postMessage({ type: 'pause' });
            }
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                isScrolling = false;
                if (useWorker && worker) {
                    if (!isPageHidden) worker.postMessage({ type: 'resume' });
                }
            }, 100);
        }, { passive: true });

        // Sichqoncha harakatini kuzatish (RAF bilan cheklangan)
        let mouseRaf = false;
        window.addEventListener('mousemove', (e) => {
            if (!config.enableCompanion || mouseRaf) return;
            mouseRaf = true;
            requestAnimationFrame(() => {
                mouseRaf = false;
                if (useWorker && worker) {
                    worker.postMessage({
                        type: 'mouse',
                        action: 'move',
                        x: e.clientX,
                        y: e.clientY
                    });
                } else {
                    companion.targetX = e.clientX;
                    companion.targetY = e.clientY;
                    companion.targetAlpha = 1.0;
                    companion.lastMoveTime = Date.now();
                    companion.active = true;
                }
            });
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            if (useWorker && worker) {
                worker.postMessage({
                    type: 'mouse',
                    action: 'leave'
                });
            } else {
                companion.targetAlpha = 0;
                companion.active = false;
            }
        });

        window.addEventListener('click', (e) => {
            if (!config.enableCompanion) return;
            if (useWorker && worker) {
                worker.postMessage({
                    type: 'mouse',
                    action: 'click',
                    x: e.clientX,
                    y: e.clientY
                });
            } else {
                if (!companion.active) return;
                if (companion.ripples.length < 3) {
                    companion.ripples.push({
                        x: e.clientX,
                        y: e.clientY,
                        radius: 4,
                        maxRadius: 26,
                        alpha: 0.35
                    });
                }
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!config.enableCompanion || !e.touches[0]) return;
            const touch = e.touches[0];
            if (useWorker && worker) {
                worker.postMessage({
                    type: 'mouse',
                    action: 'move',
                    x: touch.clientX,
                    y: touch.clientY,
                    isTouch: true
                });
            } else {
                companion.targetX = touch.clientX;
                companion.targetY = touch.clientY;
                companion.targetAlpha = 0.8;
                companion.lastMoveTime = Date.now();
                companion.active = true;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            if (useWorker && worker) {
                worker.postMessage({
                    type: 'mouse',
                    action: 'leave'
                });
            } else {
                companion.targetAlpha = 0;
                companion.active = false;
            }
        }, { passive: true });

        // Mavzu o'zgarganda xabardor qilish
        const themeObserver = new MutationObserver(() => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (useWorker && worker) {
                worker.postMessage({
                    type: 'theme',
                    theme: isDark ? 'dark' : 'light'
                });
            } else {
                if (activeMode === 'stars') initTranquilStars();
                else if (activeMode === 'galaxy') initGalaxy();
            }
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-light-variant'] });

        // data-3d-mode tugmalari bosilganda
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-3d-mode]');
            if (btn) {
                e.preventDefault();
                const m = btn.getAttribute('data-3d-mode');
                switch3DMode(m);
            }
        });
    }

    // Global eksportlar
    window.switch3DBackground = switch3DMode;
    window.get3DMode = () => activeMode;
    window.config3D = config;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
