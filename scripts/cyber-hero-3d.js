// ===== CYBER HERO 3D (ADVANCED SPATIAL 3D ENGINE & WHOLE-PAGE PARALLAX) =====
// Abdugofforov ekotizimi uchun to'liq ekranli, 60-120 FPS apparat tezlanishli
// 3D fazoviy dunyo. Sichqoncha orqali 360° erkin aylantirish (orbit drag),
// butun ekran bo'ylab kursorni kuzatuvchi 3D kamera, zarrachalar girdobi (vortex),
// Torus Tuguni (Knot), Giroskop va barcha sayt kartochkalariga 3D Tilt effekti.

(function () {
    'use strict';

    let canvas, ctx;
    let width = 0, height = 0, dpr = 1;
    let animationId = null;
    let isVisible = true;
    let currentShape = 0; // 0: Gyro-Sphere, 1: Torus Knot, 2: Cyber Monolith

    // Butun ekran bo'ylab sichqoncha koordinatalari
    let mouse = {
        screenX: 0, screenY: 0,       // -1 dan 1 gacha (butun oyna bo'yicha)
        targetScreenX: 0, targetScreenY: 0,
        isDown: false,
        dragStartX: 0, dragStartY: 0,
        dragRotX: 0, dragRotY: 0,
        velX: 0, velY: 0
    };

    // 3D Kamera va Burilish o'zgaruvchilari
    let camRotX = 0, camRotY = 0;
    let autoRotY = 0;
    let scrollProgress = 0;
    let shockwave = 0, shockwaveVel = 0;

    // Mavzuga mos ranglar (Dark / Light)
    let themeColors = {
        cyan: '#38bdf8',
        purple: '#818cf8',
        teal: '#2dd4bf',
        amber: '#fbbf24',
        coreGlow: 'rgba(56, 189, 248, 0.25)',
        lineAlpha: 0.35,
        nodeAlpha: 0.85
    };

    function updateTheme() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            themeColors.cyan = '#4f46e5';
            themeColors.purple = '#7c3aed';
            themeColors.teal = '#0284c7';
            themeColors.amber = '#d97706';
            themeColors.coreGlow = 'rgba(79, 70, 229, 0.18)';
            themeColors.lineAlpha = 0.28;
            themeColors.nodeAlpha = 0.9;
        } else {
            themeColors.cyan = '#38bdf8';
            themeColors.purple = '#818cf8';
            themeColors.teal = '#2dd4bf';
            themeColors.amber = '#fbbf24';
            themeColors.coreGlow = 'rgba(56, 189, 248, 0.25)';
            themeColors.lineAlpha = 0.35;
            themeColors.nodeAlpha = 0.85;
        }
    }

    // -------------------------------------------------------------
    // 1. ZARRACHALAR GIRDOBI (COSMIC DUST PARTICLES — 3D DEPTH)
    // -------------------------------------------------------------
    const PARTICLE_COUNT = 160;
    const cosmosParticles = [];

    function initCosmosParticles() {
        cosmosParticles.length = 0;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const radius = 180 + Math.random() * 320;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI;
            cosmosParticles.push({
                baseX: radius * Math.cos(phi) * Math.cos(theta),
                baseY: radius * Math.sin(phi) * 0.7,
                baseZ: radius * Math.cos(phi) * Math.sin(theta),
                speed: 0.002 + Math.random() * 0.004,
                size: 1.0 + Math.random() * 2.2,
                orbitAngle: theta,
                pulse: Math.random() * Math.PI * 2,
                colorType: i % 3 // 0: cyan, 1: purple, 2: teal
            });
        }
    }

    // -------------------------------------------------------------
    // 2. 3D GEOMETRIYALAR GENERATSIYASI
    // -------------------------------------------------------------

    // A. Kvant Giroskop Sferasi (Fibonacci + 3 ta Metallik Giroskop Halqasi)
    function buildGyroSphere() {
        const points = [];
        const count = 160;
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
        const radius = 145;

        for (let i = 0; i < count; i++) {
            const y = 1 - (i / (count - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;
            points.push({
                baseX: Math.cos(theta) * radiusAtY * radius,
                baseY: y * radius,
                baseZ: Math.sin(theta) * radiusAtY * radius,
                pulseOffset: theta + y * 2,
                isOuter: false
            });
        }
        return points;
    }

    // B. Hyper-Torus Tuguni (Trefoil Knot p=2, q=3)
    function buildTorusKnot() {
        const points = [];
        const total = 180;
        const scale = 42;

        for (let i = 0; i < total; i++) {
            const phi = (i / total) * Math.PI * 2 * 3; // 3 to'liq aylanma
            const r = 2.4 + Math.cos(3 * phi) * 0.9;
            const x = r * Math.cos(2 * phi) * scale;
            const y = r * Math.sin(2 * phi) * scale;
            const z = -Math.sin(3 * phi) * scale * 1.5;

            points.push({
                baseX: x,
                baseY: y,
                baseZ: z,
                pulseOffset: phi,
                isKnot: true
            });
        }
        return points;
    }

    // C. Kiber Monolit (Ikozaedr Kristall Yadrosi + Kvant Koronasi)
    function buildCyberMonolith() {
        const points = [];
        const t = (1.0 + Math.sqrt(5.0)) / 2.0;
        const baseVerts = [
            [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
            [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
            [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
        ];

        // Ichki kristal qirralari
        baseVerts.forEach(v => {
            const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            const r = 105;
            points.push({
                baseX: (v[0] / len) * r,
                baseY: (v[1] / len) * r,
                baseZ: (v[2] / len) * r,
                pulseOffset: Math.random() * Math.PI * 2,
                isCore: true
            });
        });

        // 24 ta aylanuvchi kvant plazma tugunlari
        for (let i = 0; i < 28; i++) {
            const angle = (i / 28) * Math.PI * 2;
            const r = 165 + Math.sin(i * 3) * 20;
            points.push({
                baseX: Math.cos(angle) * r,
                baseY: (i % 2 === 0 ? 1 : -1) * 45 + Math.sin(angle * 2) * 25,
                baseZ: Math.sin(angle) * r,
                pulseOffset: angle,
                isSatellite: true,
                orbitSpeed: 0.015 + (i % 4) * 0.008
            });
        }
        return points;
    }

    const geomGyro = buildGyroSphere();
    const geomKnot = buildTorusKnot();
    const geomMonolith = buildCyberMonolith();

    // 3 ta Gigant Giroskop Halqasi (X, Y, Z tekisliklarida)
    function buildGimbalRings() {
        const rings = [];
        const segs = 64;

        // 1-Ring (Gorizontal X-Z)
        const ring1 = [];
        for (let i = 0; i < segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            ring1.push({ x: Math.cos(a) * 195, y: 0, z: Math.sin(a) * 195 });
        }
        rings.push({ points: ring1, rotAxis: 'y', speed: 0.008, color: 'cyan', tilt: 0.25 });

        // 2-Ring (Vertikal Y-Z)
        const ring2 = [];
        for (let i = 0; i < segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            ring2.push({ x: 0, y: Math.cos(a) * 215, z: Math.sin(a) * 215 });
        }
        rings.push({ points: ring2, rotAxis: 'x', speed: -0.01, color: 'purple', tilt: -0.35 });

        // 3-Ring (Diagonal Y-X)
        const ring3 = [];
        for (let i = 0; i < segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            ring3.push({ x: Math.cos(a) * 228, y: Math.sin(a) * 228, z: 0 });
        }
        rings.push({ points: ring3, rotAxis: 'z', speed: 0.006, color: 'teal', tilt: 0.6 });

        return rings;
    }

    const gimbalRings = buildGimbalRings();

    // -------------------------------------------------------------
    // 3. MATRITSA VA 3D PROYEKTSIYA
    // -------------------------------------------------------------
    function rotate3D(x, y, z, angleX, angleY, angleZ) {
        // Y o'qi
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;

        // X o'qi
        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Z o'qi
        if (angleZ) {
            const cosZ = Math.cos(angleZ), sinZ = Math.sin(angleZ);
            let x3 = x1 * cosZ - y2 * sinZ;
            let y3 = x1 * sinZ + y2 * cosZ;
            return { x: x3, y: y3, z: z2 };
        }
        return { x: x1, y: y2, z: z2 };
    }

    function project3D(p, cx, cy, fov, zoom) {
        const distance = 520;
        const zEffective = p.z + distance;
        if (zEffective <= 10) return null;
        const scale = (distance / zEffective) * zoom;
        return {
            x: cx + p.x * scale,
            y: cy + p.y * scale,
            scale: scale,
            z: p.z
        };
    }

    // -------------------------------------------------------------
    // 4. ASOSIY RENDERLASH SIKLI (60-120 FPS)
    // -------------------------------------------------------------
    function render(timestamp) {
        if (!isVisible || !ctx) {
            animationId = requestAnimationFrame(render);
            return;
        }

        const t = (timestamp || performance.now()) * 0.001;

        // Butun ekran bo'ylab kursorni LERP bilan kuzatish
        mouse.screenX += (mouse.targetScreenX - mouse.screenX) * 0.06;
        mouse.screenY += (mouse.targetScreenY - mouse.screenY) * 0.06;

        // Drag & Throw inersiya fizikasi
        mouse.dragRotX += mouse.velX;
        mouse.dragRotY += mouse.velY;
        mouse.velX *= 0.94;
        mouse.velY *= 0.94;

        // Tinch holatdagi avto-aylanish + foydalanuvchi orqali burilish
        autoRotY += 0.005;
        const targetCamY = autoRotY + mouse.screenX * 0.9 + mouse.dragRotX;
        const targetCamX = -mouse.screenY * 0.7 + mouse.dragRotY;

        camRotX += (targetCamX - camRotX) * 0.08;
        camRotY += (targetCamY - camRotY) * 0.08;

        // Shockwave to'lqini
        if (shockwave > 0.001) {
            shockwave += shockwaveVel;
            shockwaveVel *= 0.92;
            if (shockwave > 55) shockwaveVel = -shockwaveVel * 0.7;
            if (shockwave < 0) shockwave = 0;
        }

        // Tozalash
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const fov = 500;
        // Scroll bo'yicha kameraning yaqinlashishi (Apple fly-through)
        const zoom = Math.max(0.7, 1.0 + scrollProgress * 0.55);

        // A. Radial chuqurlikdagi kiber-nur (Volumetric Aura)
        const auraGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 280 * zoom);
        auraGrad.addColorStop(0, themeColors.coreGlow);
        auraGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.08)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 280 * zoom, 0, Math.PI * 2);
        ctx.fill();

        // B. 3D Zarrachalar Girdobi (Cosmic Dust Cloud)
        for (let i = 0; i < cosmosParticles.length; i++) {
            const cp = cosmosParticles[i];
            cp.orbitAngle += cp.speed;

            let px = cp.baseX * Math.cos(cp.orbitAngle) - cp.baseZ * Math.sin(cp.orbitAngle);
            let py = cp.baseY + Math.sin(t * 1.5 + cp.pulse) * 12;
            let pz = cp.baseX * Math.sin(cp.orbitAngle) + cp.baseZ * Math.cos(cp.orbitAngle);

            const rot = rotate3D(px, py, pz, camRotX * 0.6, camRotY * 0.6, 0);
            const pr = project3D(rot, cx, cy, fov, zoom);
            if (!pr) continue;

            const pAlpha = Math.max(0.1, Math.min(0.8, (pr.scale - 0.4) * 1.2));
            ctx.fillStyle = cp.colorType === 0 ? themeColors.cyan : (cp.colorType === 1 ? themeColors.purple : themeColors.teal);
            ctx.globalAlpha = pAlpha;
            ctx.beginPath();
            ctx.arc(pr.x, pr.y, cp.size * pr.scale, 0, Math.PI * 2);
            ctx.fill();
        }

        // C. 3D Giroskop Halqalari (Gimbal Rings)
        gimbalRings.forEach(gRing => {
            const ringAngle = t * gRing.speed * 40;
            ctx.strokeStyle = gRing.color === 'cyan' ? themeColors.cyan : (gRing.color === 'purple' ? themeColors.purple : themeColors.teal);
            ctx.lineWidth = 1.2 * zoom;
            ctx.globalAlpha = 0.45;
            ctx.beginPath();

            let first = true;
            for (let i = 0; i < gRing.points.length; i++) {
                const rp = gRing.points[i];
                let rx = rp.x, ry = rp.y, rz = rp.z;

                // Halqaning o'z o'qida aylanishi
                if (gRing.rotAxis === 'y') {
                    const c = Math.cos(ringAngle), s = Math.sin(ringAngle);
                    const tx = rx * c + rz * s;
                    rz = -rx * s + rz * c;
                    rx = tx;
                } else if (gRing.rotAxis === 'x') {
                    const c = Math.cos(ringAngle), s = Math.sin(ringAngle);
                    const ty = ry * c - rz * s;
                    rz = ry * s + rz * c;
                    ry = ty;
                }

                const rot = rotate3D(rx, ry, rz, camRotX + gRing.tilt, camRotY + ringAngle * 0.2, 0);
                const pr = project3D(rot, cx, cy, fov, zoom);
                if (!pr) continue;

                if (first) {
                    ctx.moveTo(pr.x, pr.y);
                    first = false;
                } else {
                    ctx.lineTo(pr.x, pr.y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        });

        // D. Asosiy 3D Obyekt (Sphere / Torus Knot / Monolith)
        let activeGeom;
        if (currentShape === 0) activeGeom = geomGyro;
        else if (currentShape === 1) activeGeom = geomKnot;
        else activeGeom = geomMonolith;

        const projPoints = [];
        const numPts = activeGeom.length;

        for (let i = 0; i < numPts; i++) {
            const pt = activeGeom[i];
            const pulse = Math.sin(t * 2.5 + pt.pulseOffset) * 4.5;
            const shock = shockwave ? (Math.sin(pt.pulseOffset * 4) * shockwave) : 0;
            const rScale = 1 + (pulse + shock) * 0.012;

            let bx = pt.baseX * rScale;
            let by = pt.baseY * rScale;
            let bz = pt.baseZ * rScale;

            if (pt.isSatellite) {
                const satAngle = pt.pulseOffset + t * pt.orbitSpeed * 45;
                bx = Math.cos(satAngle) * 165;
                by = Math.sin(satAngle * 0.8) * 60;
                bz = Math.sin(satAngle) * 165;
            }

            const rot = rotate3D(bx, by, bz, camRotX, camRotY, t * 0.05);
            const pr = project3D(rot, cx, cy, fov, zoom);
            if (!pr) continue;

            projPoints.push({
                x: pr.x,
                y: pr.y,
                z: pr.z,
                scale: pr.scale,
                alpha: Math.max(0.18, Math.min(1.0, (pr.scale - 0.4) * 1.6)),
                isKnot: !!pt.isKnot,
                isCore: !!pt.isCore,
                isSatellite: !!pt.isSatellite
            });
        }

        // Chuqurlik bo'yicha z-sorting
        projPoints.sort((a, b) => a.z - b.z);

        // O'zaro qirralar (Constellation Mesh & Torus Ribbon)
        const maxDist = currentShape === 1 ? 55 : (currentShape === 2 ? 70 : 48);
        ctx.lineWidth = 1.0 * zoom;

        for (let i = 0; i < projPoints.length; i += 2) {
            const p1 = projPoints[i];
            if (p1.z > 90 && currentShape === 0) continue;

            for (let j = i + 1; j < Math.min(i + 8, projPoints.length); j++) {
                const p2 = projPoints[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDist * maxDist) {
                    const lineAlpha = (1 - Math.sqrt(distSq) / maxDist) * themeColors.lineAlpha * Math.min(p1.alpha, p2.alpha);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha.toFixed(3)})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Tugunlarni (Vertices) chizish
        for (let i = 0; i < projPoints.length; i++) {
            const p = projPoints[i];
            const size = Math.max(1.4, (p.isSatellite ? 3.8 : (p.isCore ? 3.4 : 2.4)) * p.scale * zoom);

            ctx.fillStyle = p.z > 0 ? themeColors.cyan : themeColors.purple;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();

            // Yorug'lik aks etishi (Specular highlight)
            if (p.z < -30) {
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = p.alpha * 0.9;
                ctx.beginPath();
                ctx.arc(p.x - size * 0.25, p.y - size * 0.25, size * 0.45, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1.0;
        animationId = requestAnimationFrame(render);
    }

    // -------------------------------------------------------------
    // 5. GLOBAL 3D CARD TILT DASTURI (BUTUN SAYT KARTALARI UCHUN)
    // -------------------------------------------------------------
    function initGlobalCard3DTilt() {
        // Maqola kartochkalari, kun hikmati, loyihalar va modallarga fazoviy 3D burilish
        const targets = document.querySelectorAll('.post-card, .atelier-quote-card, .project-card, .curr-topic-card');

        targets.forEach(card => {
            if (card.dataset.hasTilt) return;
            card.dataset.hasTilt = 'true';

            // Karta ustida dinamik yorug'lik qatlami (Specular Glare)
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

                const rotX = ((y - cy) / cy) * -9; // Max 9 deg
                const rotY = ((x - cx) / cx) * 9;

                card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(12px)`;

                // Nur dog'i koordinatasi
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.22) 0%, rgba(56, 189, 248, 0.08) 40%, transparent 70%)`;
                glare.style.opacity = '1';
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                glare.style.opacity = '0';
            }, { passive: true });
        });
    }

    // -------------------------------------------------------------
    // 6. EVENT TINGLOVCHILAR VA SICHQONCHA / TOUCH BOSHQARUVI
    // -------------------------------------------------------------
    function handleWindowMouseMove(e) {
        // Butun ekran bo'ylab kursorni hisoblash (-1 dan 1 gacha)
        mouse.targetScreenX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetScreenY = (e.clientY / window.innerHeight) * 2 - 1;

        if (mouse.isDown) {
            const dx = e.clientX - mouse.dragStartX;
            const dy = e.clientY - mouse.dragStartY;
            mouse.velX = dx * 0.005;
            mouse.velY = -dy * 0.005;
            mouse.dragStartX = e.clientX;
            mouse.dragStartY = e.clientY;
        }

        // Hero sarlavhasi va orqa fondagi elementlar uchun CSS o'zgaruvchilari
        document.documentElement.style.setProperty('--mouse-norm-x', mouse.targetScreenX.toFixed(3));
        document.documentElement.style.setProperty('--mouse-norm-y', mouse.targetScreenY.toFixed(3));
    }

    function handleMouseDown(e) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            mouse.isDown = true;
            mouse.dragStartX = e.clientX;
            mouse.dragStartY = e.clientY;
            canvas.style.cursor = 'grabbing';
        }
    }

    function handleMouseUp() {
        if (mouse.isDown) {
            mouse.isDown = false;
            if (canvas) canvas.style.cursor = 'grab';
        }
    }

    function handleClickCanvas(e) {
        shockwave = 15;
        shockwaveVel = 4.2;
        if (navigator.vibrate) {
            try { navigator.vibrate(20); } catch (_) {}
        }
    }

    function handleTouchStart(e) {
        if (e.touches && e.touches[0]) {
            mouse.isDown = true;
            mouse.dragStartX = e.touches[0].clientX;
            mouse.dragStartY = e.touches[0].clientY;
        }
    }

    function handleTouchMove(e) {
        if (!e.touches || !e.touches[0]) return;
        const t = e.touches[0];
        mouse.targetScreenX = (t.clientX / window.innerWidth) * 2 - 1;
        mouse.targetScreenY = (t.clientY / window.innerHeight) * 2 - 1;

        if (mouse.isDown) {
            const dx = t.clientX - mouse.dragStartX;
            const dy = t.clientY - mouse.dragStartY;
            mouse.velX = dx * 0.006;
            mouse.velY = -dy * 0.006;
            mouse.dragStartX = t.clientX;
            mouse.dragStartY = t.clientY;
        }
    }

    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        scrollProgress = Math.min(1.5, Math.max(0, scrollY / (window.innerHeight * 0.85)));
    }

    function handleResize() {
        if (!canvas) return;
        const stage = canvas.closest('.spatial-hero-stage') || canvas.parentElement || canvas;
        const rect = stage.getBoundingClientRect();

        width = rect.width || window.innerWidth;
        height = rect.height || 560;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        if (ctx) {
            ctx.scale(dpr, dpr);
        }
    }

    function switchShape(nextIndex) {
        if (typeof nextIndex === 'number') {
            currentShape = nextIndex % 3;
        } else {
            currentShape = (currentShape + 1) % 3;
        }

        shockwave = 22;
        shockwaveVel = 5.0;

        const label = document.getElementById('spatial-shape-name');
        if (label) {
            const names = ['Kvant Giroskopi', 'Torus Tuguni', 'Kiber Monolit'];
            label.textContent = names[currentShape];
        }

        // Tugma holatini yangilash
        document.querySelectorAll('.spatial-shape-btn').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === currentShape);
        });
    }

    // -------------------------------------------------------------
    // 7. ISHGA TUSHIRISH (INITIALIZATION)
    // -------------------------------------------------------------
    function init() {
        canvas = document.getElementById('spatial-3d-canvas') || document.getElementById('cyber-3d-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        updateTheme();
        initCosmosParticles();
        handleResize();

        // Butun oyna bo'yicha sichqoncha va skroll hodisalari
        window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        // Sensorli ekranlar
        canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
        canvas.addEventListener('touchend', handleMouseUp, { passive: true });
        canvas.addEventListener('click', handleClickCanvas);

        // Shakl almashtirish tugmalari
        document.querySelectorAll('[data-shape-idx]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.dataset.shapeIdx, 10);
                switchShape(idx);
            });
        });

        const toggleBtn = document.getElementById('spatial-toggle-btn') || document.getElementById('cyber-3d-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                switchShape();
            });
        }

        // Mavzu o'zgarganda
        const obs = new MutationObserver(() => updateTheme());
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // Sahifa skroll qilinib ko'rinmay qolganda GPU tejash
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.05 });
        io.observe(canvas);

        // Butun sayt kartochkalariga 3D Tilt ulash
        initGlobalCard3DTilt();

        // Maqolalar kechroq yuklansa ham qayta ulash uchun observer
        const blogGrid = document.getElementById('blog-grid');
        if (blogGrid) {
            const blogObs = new MutationObserver(() => initGlobalCard3DTilt());
            blogObs.observe(blogGrid, { childList: true });
        }

        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(render);
    }

    // Global api
    window.Spatial3D = {
        init: init,
        switchShape: switchShape,
        refreshTilts: initGlobalCard3DTilt
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
