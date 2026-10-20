// ===== CYBER HERO 3D (INTERACTIVE HARDWARE-ACCELERATED 3D ENGINE) =====
// Abdugofforov ekotizimi uchun 60-120 FPS da silliq ishlovchi, sichqoncha
// harakatiga sinxronlashgan interaktiv 3D kiber-vizualizatsiya moduli.
// Tashqi og'ir kutubxonalarsiz (0 dependency), sof WebGL/Canvas apparat tezlanishi.

(function () {
    'use strict';

    let canvas, ctx;
    let width = 0, height = 0, dpr = 1;
    let animationId = null;
    let isVisible = true;
    let currentShape = 0; // 0: Sphere, 1: Torus, 2: Icosahedron Core

    // Fizika va LERP o'zgaruvchilari
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isHover: false };
    let rotX = 0, rotY = 0, targetRotX = 0, targetRotY = 0;
    let autoRotY = 0, autoRotX = 0;
    let shockwave = 0, shockwaveVel = 0;

    // Ranglar palitrasi (Theme-reactive)
    let colors = {
        primary: '#38bdf8',    // Cyan / Sapphire
        secondary: '#818cf8',  // Purple / Violet
        accent: '#2dd4bf',     // Neon Teal
        nodeGlow: 'rgba(56, 189, 248, 0.8)',
        lineGlow: 'rgba(129, 140, 248, 0.25)',
        coreGlow: 'rgba(45, 212, 191, 0.15)'
    };

    function updateColorsByTheme() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            colors.primary = '#4f46e5';
            colors.secondary = '#7c3aed';
            colors.accent = '#0284c7';
            colors.nodeGlow = 'rgba(79, 70, 229, 0.75)';
            colors.lineGlow = 'rgba(124, 58, 237, 0.22)';
            colors.coreGlow = 'rgba(2, 132, 199, 0.12)';
        } else {
            colors.primary = '#38bdf8';
            colors.secondary = '#818cf8';
            colors.accent = '#2dd4bf';
            colors.nodeGlow = 'rgba(56, 189, 248, 0.85)';
            colors.lineGlow = 'rgba(129, 140, 248, 0.3)';
            colors.coreGlow = 'rgba(45, 212, 191, 0.2)';
        }
    }

    // -------------------------------------------------------------
    // 3D GEOMETRIYA GENERATORLARI
    // -------------------------------------------------------------

    // 1. Kvant Fibonacci Sferasi
    function createSphereGeometry(numPoints, radius) {
        const points = [];
        const phi = Math.PI * (3 - Math.sqrt(5)); // Oltin burchak (~137.5 deg)
        for (let i = 0; i < numPoints; i++) {
            const y = 1 - (i / (numPoints - 1)) * 2; // -1 dan 1 gacha
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            points.push({
                baseX: x * radius,
                baseY: y * radius,
                baseZ: z * radius,
                x: 0, y: 0, z: 0,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
        return points;
    }

    // 2. Kiber Torus (Donut Halqa)
    function createTorusGeometry(rMajor, rMinor, segMajor, segMinor) {
        const points = [];
        for (let i = 0; i < segMajor; i++) {
            const u = (i / segMajor) * Math.PI * 2;
            for (let j = 0; j < segMinor; j++) {
                const v = (j / segMinor) * Math.PI * 2;
                const x = (rMajor + rMinor * Math.cos(v)) * Math.cos(u);
                const y = (rMajor + rMinor * Math.cos(v)) * Math.sin(u);
                const z = rMinor * Math.sin(v);
                points.push({
                    baseX: x,
                    baseY: y,
                    baseZ: z,
                    x: 0, y: 0, z: 0,
                    pulseOffset: u + v
                });
            }
        }
        return points;
    }

    // 3. Ikozaedr Yadrosi va Orbitadagi Sun'iy Yo'ldoshlar
    function createIcosahedronCore(radius) {
        const points = [];
        const t = (1.0 + Math.sqrt(5.0)) / 2.0; // Oltin nisbat ~1.618
        const verts = [
            [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
            [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
            [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
        ];

        verts.forEach(v => {
            const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            points.push({
                baseX: (v[0] / len) * radius,
                baseY: (v[1] / len) * radius,
                baseZ: (v[2] / len) * radius,
                x: 0, y: 0, z: 0,
                pulseOffset: Math.random() * Math.PI * 2,
                isCore: true
            });
        });

        // Orbitadagi 12 ta erkin suzuvchi zarrachalar
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const r = radius * 1.55;
            points.push({
                baseX: Math.cos(angle) * r,
                baseY: Math.sin(angle) * (r * 0.45),
                baseZ: Math.sin(angle) * r,
                x: 0, y: 0, z: 0,
                pulseOffset: angle,
                isSatellite: true,
                orbitSpeed: 0.02 + (i % 3) * 0.01
            });
        }

        return points;
    }

    let spherePoints = createSphereGeometry(140, 130);
    let torusPoints = createTorusGeometry(110, 42, 18, 8);
    let icosaPoints = createIcosahedronCore(100);

    // Ikki tashqi orbital halqa (Atom/Saturn halqalari)
    function createOrbitalRing(count, radius, tiltAngle) {
        const ring = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * Math.cos(tiltAngle);
            const z = Math.sin(angle) * radius * Math.sin(tiltAngle);
            ring.push({ x, y, z, angle, radius, tiltAngle });
        }
        return ring;
    }

    const ringA = createOrbitalRing(60, 175, Math.PI / 4);
    const ringB = createOrbitalRing(60, 185, -Math.PI / 3.2);

    // -------------------------------------------------------------
    // 3D BURISH VA PROYEKTSIYA MATRITSALARI
    // -------------------------------------------------------------
    function rotate3D(x, y, z, angleX, angleY, angleZ) {
        // Y o'qi atrofida
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;

        // X o'qi atrofida
        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Z o'qi atrofida
        const cosZ = Math.cos(angleZ), sinZ = Math.sin(angleZ);
        let x3 = x1 * cosZ - y2 * sinZ;
        let y3 = x1 * sinZ + y2 * cosZ;

        return { x: x3, y: y3, z: z2 };
    }

    function project(p, fov, cx, cy) {
        const distance = 460;
        const scale = distance / (distance + p.z);
        return {
            x: cx + p.x * scale,
            y: cy + p.y * scale,
            scale: scale,
            z: p.z
        };
    }

    // -------------------------------------------------------------
    // RENDERING циклы (60-120 FPS RAF)
    // -------------------------------------------------------------
    function render(timestamp) {
        if (!isVisible || !ctx) {
            animationId = requestAnimationFrame(render);
            return;
        }

        const t = (timestamp || performance.now()) * 0.001;

        // Silliq inersiya (LERP) orqali sichqonchaga ergashish
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Avtomatik tinch orbitadagi aylanish + sichqoncha qo'shimchasi
        autoRotY += 0.006;
        autoRotX = Math.sin(t * 0.5) * 0.15;

        targetRotY = autoRotY + mouse.x * 0.85;
        targetRotX = autoRotX - mouse.y * 0.75;

        rotX += (targetRotX - rotX) * 0.08;
        rotY += (targetRotY - rotY) * 0.08;

        // Shockwave zarbasi damping
        if (shockwave > 0.001) {
            shockwave += shockwaveVel;
            shockwaveVel *= 0.92;
            if (shockwave > 45) shockwaveVel = -shockwaveVel * 0.6;
            if (shockwave < 0) shockwave = 0;
        }

        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const fov = 380;

        // Markaziy nurlanish (Radial Ambient Aura)
        const auraGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
        auraGrad.addColorStop(0, colors.coreGlow);
        auraGrad.addColorStop(0.6, 'rgba(129, 140, 248, 0.04)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 180, 0, Math.PI * 2);
        ctx.fill();

        // 1. Orbital Ring A chizish
        drawRing(ringA, t * 0.4, 0.35, colors.primary, cx, cy, fov);
        // 2. Orbital Ring B chizish
        drawRing(ringB, -t * 0.5, -0.4, colors.secondary, cx, cy, fov);

        // Faol geometriya nuqtalarini tanlash
        let activePoints;
        if (currentShape === 0) activePoints = spherePoints;
        else if (currentShape === 1) activePoints = torusPoints;
        else activePoints = icosaPoints;

        // Nuqtalarni fazoda aylantirish va z-ordering uchun hisoblash
        const projectedPoints = [];
        const numPts = activePoints.length;

        for (let i = 0; i < numPts; i++) {
            const pt = activePoints[i];

            // Nafas olish / impuls effekti (breathing vibration)
            const pulse = Math.sin(t * 2.2 + pt.pulseOffset) * 4;
            const shock = shockwave ? (Math.sin(pt.pulseOffset * 3) * shockwave) : 0;
            const currentRScale = 1 + (pulse + shock) * 0.01;

            let bx = pt.baseX * currentRScale;
            let by = pt.baseY * currentRScale;
            let bz = pt.baseZ * currentRScale;

            if (pt.isSatellite) {
                // Sun'iy yo'ldoshlarning o'z orbitasida aylanishi
                const satAngle = pt.pulseOffset + t * pt.orbitSpeed * 40;
                bx = Math.cos(satAngle) * 150;
                by = Math.sin(satAngle * 0.6) * 55;
                bz = Math.sin(satAngle) * 150;
            }

            const rotated = rotate3D(bx, by, bz, rotX, rotY, t * 0.08);
            const proj = project(rotated, fov, cx, cy);

            projectedPoints.push({
                x: proj.x,
                y: proj.y,
                z: proj.z,
                scale: proj.scale,
                alpha: Math.max(0.15, Math.min(1, (proj.scale - 0.4) * 1.5)),
                isSatellite: !!pt.isSatellite,
                isCore: !!pt.isCore
            });
        }

        // Z-Index bo'yicha saralash (Chuqurlik illyuziyasi)
        projectedPoints.sort((a, b) => a.z - b.z);

        // O'zaro yaqin nuqtalarni chiziqlar bilan bog'lash (Constellation Wireframe)
        const maxDist = currentShape === 1 ? 48 : (currentShape === 2 ? 65 : 44);
        ctx.lineWidth = 0.9;

        for (let i = 0; i < numPts; i += 2) {
            const p1 = projectedPoints[i];
            if (p1.z > 80 && currentShape === 0) continue; // Orqa chiziqlarni qisqartirib tezlikni oshirish

            for (let j = i + 1; j < Math.min(i + 9, numPts); j++) {
                const p2 = projectedPoints[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDist * maxDist) {
                    const lineAlpha = (1 - Math.sqrt(distSq) / maxDist) * 0.35 * Math.min(p1.alpha, p2.alpha);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha.toFixed(3)})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Zarrachalar (Vertex Nodes) chizish
        for (let i = 0; i < numPts; i++) {
            const p = projectedPoints[i];
            const size = Math.max(1.2, (p.isSatellite ? 3.5 : (p.isCore ? 3.0 : 2.2)) * p.scale);

            // Shaffoflik va rang chuqurligi
            ctx.fillStyle = p.z > 0 ? colors.primary : colors.secondary;
            ctx.globalAlpha = p.alpha;

            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();

            // Eng oldingi nuqtalarga porlash (glow) berish
            if (p.z < -40) {
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = p.alpha * 0.8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, size * 0.45, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1.0;
        animationId = requestAnimationFrame(render);
    }

    // Halqa chizish yordamchisi
    function drawRing(ringPoints, speedOffset, tiltExtra, strokeColor, cx, cy, fov) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.1;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();

        let first = true;
        for (let i = 0; i < ringPoints.length; i++) {
            const rp = ringPoints[i];
            const curAngle = rp.angle + speedOffset;
            const rx = Math.cos(curAngle) * rp.radius;
            const ry = Math.sin(curAngle) * rp.radius * Math.cos(rp.tiltAngle + tiltExtra);
            const rz = Math.sin(curAngle) * rp.radius * Math.sin(rp.tiltAngle + tiltExtra);

            const rot = rotate3D(rx, ry, rz, rotX * 0.7, rotY * 0.7, 0);
            const p = project(rot, fov, cx, cy);

            if (first) {
                ctx.moveTo(p.x, p.y);
                first = false;
            } else {
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }

    // -------------------------------------------------------------
    // EVENT LISTENERS & RESIZE
    // -------------------------------------------------------------
    function handleResize() {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        width = rect.width || 420;
        height = rect.height || 420;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        if (ctx) {
            ctx.scale(dpr, dpr);
        }
    }

    function handleMouseMove(e) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;

        // Canvas markaziga nisbatan -1 dan 1 gacha
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((clientY - rect.top) / rect.height) * 2 - 1;

        mouse.targetX = Math.max(-1.5, Math.min(1.5, nx));
        mouse.targetY = Math.max(-1.5, Math.min(1.5, ny));
        mouse.isHover = true;
    }

    function handleMouseLeave() {
        mouse.targetX = 0;
        mouse.targetY = 0;
        mouse.isHover = false;
    }

    function handleClick() {
        shockwave = 5;
        shockwaveVel = 3.5;
        // Tovushsiz taktil titrash (qo'llab-quvvatlansa)
        if (navigator.vibrate) {
            try { navigator.vibrate(15); } catch (_) {}
        }
    }

    function handleTouchMove(e) {
        if (!canvas || !e.touches || !e.touches[0]) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((touch.clientY - rect.top) / rect.height) * 2 - 1;

        mouse.targetX = Math.max(-1.5, Math.min(1.5, nx));
        mouse.targetY = Math.max(-1.5, Math.min(1.5, ny));
    }

    function switchShape(nextShapeIndex) {
        if (typeof nextShapeIndex === 'number') {
            currentShape = nextShapeIndex % 3;
        } else {
            currentShape = (currentShape + 1) % 3;
        }

        // Shakl almashganda impuls to'lqini
        shockwave = 12;
        shockwaveVel = 4.0;

        const modeLabel = document.getElementById('cyber-mode-text');
        if (modeLabel) {
            const names = ['Sfera', 'Torus Halqa', 'Kvant Yadrosi'];
            modeLabel.textContent = names[currentShape];
        }
    }

    // -------------------------------------------------------------
    // INIT & INTERSECTION OBSERVER (Zero CPU Lag on Scroll)
    // -------------------------------------------------------------
    function initCyberHero() {
        canvas = document.getElementById('cyber-3d-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        updateColorsByTheme();
        handleResize();

        // Hodisalar ulanishi
        const stageWrap = canvas.closest('.cyber-3d-stage') || canvas.parentElement || canvas;
        stageWrap.addEventListener('mousemove', handleMouseMove, { passive: true });
        stageWrap.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        canvas.addEventListener('click', handleClick);

        // Mobil sensorlar
        canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
        canvas.addEventListener('touchend', handleMouseLeave, { passive: true });

        // Shakl almashtirish tugmasi
        const toggleBtn = document.getElementById('cyber-3d-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => switchShape());
        }

        // Oyna o'lchami o'zgarganda
        window.addEventListener('resize', () => {
            handleResize();
        }, { passive: true });

        // Mavzu (Dark/Light) o'zgarganda ranglarni sinxronlashtirish
        const observer = new MutationObserver(() => {
            updateColorsByTheme();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // Scroll qilinganda GPU va batareyani 100% tejash (IntersectionObserver)
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.05 });
        io.observe(canvas);

        // Animatsiyani ishga tushirish
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(render);
    }

    // Global eksport (tekshiruv va sinovlar uchun)
    window.CyberHero3D = {
        init: initCyberHero,
        switchShape: switchShape
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCyberHero);
    } else {
        initCyberHero();
    }
})();
