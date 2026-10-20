// ===== DUAL KINETIC NEURAL WAVE & MAGNETIC PARTICLE STREAM (3-VARIANT) =====
// Abdugofforov ekotizimi uchun 60-120 FPS apparat tezlanishli kiber-neyron to'lqini.
// Chap va o'ng bo'shliqlarda sichqoncha harakatiga magnit kabi egiluvchi,
// oqib turuvchi 3D kiber-aurora to'lqinlari va neyron to'rlari (neural plexus).
// Markazdagi "Kun Hikmati" va "Postlar" toza, o'qishga 100% qulay bo'lib qoladi.

(function () {
    'use strict';

    let canvas, ctx;
    let width = 0, height = 0, dpr = 1;
    let animationId = null;
    let isVisible = true;

    // Sichqoncha koordinatalari va magnit kuchi
    let mouse = {
        x: -9999, y: -9999,
        normX: 0, normY: 0,
        targetNormX: 0, targetNormY: 0,
        isDown: false,
        shockwave: 0, shockwaveVel: 0
    };

    let scrollOffset = 0;

    // Ranglar palitrasi (Dark / Light)
    let themeColors = {
        leftGlow: 'rgba(56, 189, 248, ',     // Cyan
        rightGlow: 'rgba(168, 85, 247, ',   // Binafsha / Purple
        tealGlow: 'rgba(45, 212, 191, ',    // Teal
        nodeLight: '#ffffff'
    };

    function updateTheme() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            themeColors.leftGlow = 'rgba(2, 132, 199, ';
            themeColors.rightGlow = 'rgba(124, 58, 237, ';
            themeColors.tealGlow = 'rgba(13, 148, 136, ';
            themeColors.nodeLight = '#4f46e5';
        } else {
            themeColors.leftGlow = 'rgba(56, 189, 248, ';
            themeColors.rightGlow = 'rgba(168, 85, 247, ';
            themeColors.tealGlow = 'rgba(45, 212, 191, ';
            themeColors.nodeLight = '#ffffff';
        }
    }

    // -------------------------------------------------------------
    // 1. IKKI QANOTLI NEYRON TO'LQIN TUGUNLARI (NEURAL WAVE NODES)
    // -------------------------------------------------------------
    const leftStreamNodes = [];
    const rightStreamNodes = [];
    const AMBIENT_SPARKS_COUNT = 70;
    const ambientSparks = [];

    function initStreamNodes() {
        leftStreamNodes.length = 0;
        rightStreamNodes.length = 0;
        ambientSparks.length = 0;

        const containerWidth = 1100;
        const sideGutter = Math.max(120, (width - containerWidth) / 2);

        const leftCenter = Math.max(90, sideGutter * 0.48);
        const rightCenter = width - leftCenter;

        const verticalStep = 38;
        const totalRows = Math.ceil((height + 200) / verticalStep) + 4;
        const cols = 3; // Har bir tomonda 3 ta parallel to'lqin zanjiri

        // Chap To'lqin Tugunlari
        for (let c = 0; c < cols; c++) {
            const colOffset = (c - 1) * 38;
            for (let r = -2; r < totalRows; r++) {
                const baseY = r * verticalStep;
                const baseX = leftCenter + colOffset;
                leftStreamNodes.push({
                    baseX: baseX,
                    baseY: baseY,
                    currentX: baseX,
                    currentY: baseY,
                    vx: 0, vy: 0,
                    col: c,
                    row: r,
                    phase: r * 0.28 + c * 0.8,
                    size: 1.6 + Math.random() * 1.6,
                    side: 'left'
                });
            }
        }

        // O'ng To'lqin Tugunlari
        for (let c = 0; c < cols; c++) {
            const colOffset = (c - 1) * 38;
            for (let r = -2; r < totalRows; r++) {
                const baseY = r * verticalStep;
                const baseX = rightCenter + colOffset;
                rightStreamNodes.push({
                    baseX: baseX,
                    baseY: baseY,
                    currentX: baseX,
                    currentY: baseY,
                    vx: 0, vy: 0,
                    col: c,
                    row: r,
                    phase: r * 0.28 + c * 0.8 + Math.PI,
                    size: 1.6 + Math.random() * 1.6,
                    side: 'right'
                });
            }
        }

        // Erkin suzuvchi kiber uchqunlar (Ambient Sparks)
        for (let i = 0; i < AMBIENT_SPARKS_COUNT; i++) {
            const isLeft = i % 2 === 0;
            const center = isLeft ? leftCenter : rightCenter;
            ambientSparks.push({
                x: center + (Math.random() - 0.5) * 160,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -0.3 - Math.random() * 0.6,
                size: 1.0 + Math.random() * 2.0,
                alpha: 0.2 + Math.random() * 0.6,
                isLeft: isLeft
            });
        }
    }

    // -------------------------------------------------------------
    // 2. 3D TO'LQIN FIZIKASI VA RENDERLASH
    // -------------------------------------------------------------
    function render(timestamp) {
        if (!isVisible || !ctx) {
            animationId = requestAnimationFrame(render);
            return;
        }

        const t = (timestamp || performance.now()) * 0.001;

        // Kursorni LERP bilan tekislash
        mouse.normX += (mouse.targetNormX - mouse.normX) * 0.08;
        mouse.normY += (mouse.targetNormY - mouse.normY) * 0.08;

        // Shockwave to'lqini
        if (mouse.shockwave > 0.001) {
            mouse.shockwave += mouse.shockwaveVel;
            mouse.shockwaveVel *= 0.91;
            if (mouse.shockwave > 60) mouse.shockwaveVel = -mouse.shockwaveVel * 0.6;
            if (mouse.shockwave < 0) mouse.shockwave = 0;
        }

        ctx.clearRect(0, 0, width, height);

        // Kichik ekranda to'lqinlarni o'chirish (matnlarga xalal bermaslik uchun)
        if (width < 980) {
            animationId = requestAnimationFrame(render);
            return;
        }

        // 1. Orqa fondagi Vertikal Kiber-Aurora Nurlanishi (Neon Pillar Glow)
        const containerWidth = 1100;
        const sideGutter = Math.max(120, (width - containerWidth) / 2);
        const leftCenter = Math.max(90, sideGutter * 0.48);
        const rightCenter = width - leftCenter;

        drawVerticalAura(leftCenter, themeColors.leftGlow);
        drawVerticalAura(rightCenter, themeColors.rightGlow);

        // 2. Chap To'lqinni hisoblash va chizish
        updateAndDrawStream(leftStreamNodes, t, true);

        // 3. O'ng To'lqinni hisoblash va chizish
        updateAndDrawStream(rightStreamNodes, t, false);

        // 4. Yuqoriga oquvchi kiber uchqunlar (Floating Sparks)
        drawAmbientSparks(t);

        animationId = requestAnimationFrame(render);
    }

    // Vertikal Nur Ustuni (Aurora Beam)
    function drawVerticalAura(centerX, colorPrefix) {
        const grad = ctx.createRadialGradient(centerX, height * 0.4, 20, centerX, height * 0.4, 180);
        grad.addColorStop(0, colorPrefix + '0.14)');
        grad.addColorStop(0.6, colorPrefix + '0.03)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, height * 0.4, 180, 0, Math.PI * 2);
        ctx.fill();
    }

    // To'lqin Zanjirini Yangilash va Chizish
    function updateAndDrawStream(nodes, t, isLeft) {
        const colorPrefix = isLeft ? themeColors.leftGlow : themeColors.rightGlow;
        const maxMagnetDist = 240;
        const maxDistSq = maxMagnetDist * maxMagnetDist;

        // Har bir tugun fizikasini hisoblash
        for (let i = 0; i < nodes.length; i++) {
            const p = nodes[i];

            // Garmonik 3D to'lqin harakati (Harmonic Silk Wave)
            const waveX = Math.sin(t * 1.6 + p.phase) * 28 + Math.cos(t * 0.9 + p.baseY * 0.005) * 16;
            const waveY = Math.sin(t * 1.2 + p.baseX * 0.01) * 12;

            // Skroll bo'yicha siljish
            const targetY = p.baseY + waveY - (scrollOffset % 38);
            let targetX = p.baseX + waveX;

            // Sichqonchaga nisbatan magnit tortilishi
            const dx = mouse.x - p.currentX;
            const dy = mouse.y - p.currentY;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
                const dist = Math.sqrt(distSq);
                const magnetFactor = (1 - dist / maxMagnetDist);
                // Sichqoncha tomon mayin egilish
                p.vx += (dx / dist) * magnetFactor * 2.8;
                p.vy += (dy / dist) * magnetFactor * 1.8;
            }

            // Shockwave impulsi
            if (mouse.shockwave > 0.001) {
                const shockDx = p.currentX - (isLeft ? p.baseX : p.baseX);
                p.vx += (isLeft ? -1 : 1) * Math.sin(p.phase * 3) * mouse.shockwave * 0.25;
            }

            // Prujina qaytishi (Spring Return Physics)
            p.vx += (targetX - p.currentX) * 0.07;
            p.vy += (targetY - p.currentY) * 0.07;

            // Damping (Ishqalanish)
            p.vx *= 0.86;
            p.vy *= 0.86;

            p.currentX += p.vx;
            p.currentY += p.vy;
        }

        // Tugunlarni o'zaro chiziqlar bilan bog'lash (Neural Mesh Connections)
        const connectionDist = 65;
        const connDistSq = connectionDist * connectionDist;
        ctx.lineWidth = 1.0;

        for (let i = 0; i < nodes.length; i++) {
            const p1 = nodes[i];
            for (let j = i + 1; j < Math.min(i + 8, nodes.length); j++) {
                const p2 = nodes[j];
                const dx = p1.currentX - p2.currentX;
                const dy = p1.currentY - p2.currentY;
                const distSq = dx * dx + dy * dy;

                if (distSq < connDistSq) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - dist / connectionDist) * 0.38;
                    ctx.strokeStyle = colorPrefix + alpha.toFixed(3) + ')';
                    ctx.beginPath();
                    ctx.moveTo(p1.currentX, p1.currentY);
                    ctx.lineTo(p2.currentX, p2.currentY);
                    ctx.stroke();
                }
            }
        }

        // Tugunlarni chizish (Glowing Nodes)
        for (let i = 0; i < nodes.length; i++) {
            const p = nodes[i];
            const pulse = 1 + Math.sin(t * 3 + p.phase) * 0.25;

            // Tugun atrofidagi mikroskopik nurlanish
            ctx.fillStyle = colorPrefix + '0.65)';
            ctx.beginPath();
            ctx.arc(p.currentX, p.currentY, p.size * pulse, 0, Math.PI * 2);
            ctx.fill();

            // Oq nur markazi
            ctx.fillStyle = themeColors.nodeLight;
            ctx.beginPath();
            ctx.arc(p.currentX, p.currentY, p.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Suzuvchi Kiber Uchqunlar (Floating Sparks)
    function drawAmbientSparks(t) {
        for (let i = 0; i < ambientSparks.length; i++) {
            const sp = ambientSparks[i];
            sp.y += sp.vy;
            sp.x += sp.vx + Math.sin(t + sp.y * 0.01) * 0.3;

            if (sp.y < -10) {
                sp.y = height + 10;
            }

            const colorPrefix = sp.isLeft ? themeColors.leftGlow : themeColors.rightGlow;
            ctx.fillStyle = colorPrefix + sp.alpha.toFixed(2) + ')';
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // -------------------------------------------------------------
    // 3. GLOBAL 3D CARD TILT (BUTUN SAYT KARTALARI UCHUN)
    // -------------------------------------------------------------
    function initGlobalCard3DTilt() {
        const targets = document.querySelectorAll('.post-card, .atelier-quote-card, .project-card, .curr-topic-card');

        targets.forEach(card => {
            if (card.dataset.hasTilt) return;
            card.dataset.hasTilt = 'true';

            let glare = card.querySelector('.spatial-glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.className = 'spatial-glare';
                card.style.position = 'relative';
                card.style.transformStyle = 'preserve-3d';
                card.appendChild(glare);
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;

                const rotX = ((y - cy) / cy) * -8;
                const rotY = ((x - cx) / cx) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(10px)`;
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.2) 0%, rgba(56, 189, 248, 0.08) 40%, transparent 70%)`;
                glare.style.opacity = '1';
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                glare.style.opacity = '0';
            }, { passive: true });
        });
    }

    // -------------------------------------------------------------
    // 4. EVENT LISTENERS
    // -------------------------------------------------------------
    function handleMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.targetNormX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetNormY = (e.clientY / window.innerHeight) * 2 - 1;
    }

    function handleMouseDown(e) {
        if (e.target.closest('button, a, input, textarea, select, [data-action], .post-card, .atelier-quote-card')) {
            return;
        }
        mouse.isDown = true;
    }

    function handleMouseUp() {
        mouse.isDown = false;
    }

    function handleClick(e) {
        if (e.target.closest('button, a, input, textarea, select, [data-action]')) return;
        mouse.shockwave = 18;
        mouse.shockwaveVel = 4.5;
        if (navigator.vibrate) {
            try { navigator.vibrate(15); } catch (_) {}
        }
    }

    function handleScroll() {
        scrollOffset = window.scrollY || window.pageYOffset || 0;
    }

    function handleResize() {
        if (!canvas) return;
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        if (ctx) {
            ctx.scale(dpr, dpr);
        }

        initStreamNodes();
    }

    // -------------------------------------------------------------
    // 5. INITIALIZATION
    // -------------------------------------------------------------
    function init() {
        canvas = document.getElementById('spatial-3d-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        updateTheme();
        handleResize();

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        const obs = new MutationObserver(() => updateTheme());
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        initGlobalCard3DTilt();

        const blogGrid = document.getElementById('blog-grid');
        if (blogGrid) {
            const blogObs = new MutationObserver(() => initGlobalCard3DTilt());
            blogObs.observe(blogGrid, { childList: true });
        }

        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(render);
    }

    window.Spatial3D = {
        init: init,
        refreshTilts: initGlobalCard3DTilt
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
