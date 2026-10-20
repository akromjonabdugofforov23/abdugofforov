// ===== DUAL-FLANK SPATIAL 3D ENGINE (CHAP VA O'NG SIMMETRIK 3D OBYEKTLAR) =====
// Abdugofforov ekotizimi uchun 60-120 FPS apparat tezlanishli ikki qanotli 3D fazo.
// Chap tomonda: Kvant Giroskopi (3 ta gimbal halqasi + kvant sferasi)
// O'ng tomonda: Kiber Torus Tuguni (Torus Knot + 16 ta plazma sun'iy yo'ldoshlari)
// Markazdagi "Kun Hikmati" va "Postlar" toza, o'qishga 100% qulay bo'lib,
// ikki chetdagi keng monitor bo'shlig'i sichqonchaga sinxron 3D koinot bilan to'ladi.

(function () {
    'use strict';

    let canvas, ctx;
    let width = 0, height = 0, dpr = 1;
    let animationId = null;
    let isVisible = true;

    // Sichqoncha koordinatalari
    let mouse = {
        x: 0, y: 0,
        normX: 0, normY: 0, // -1 dan 1 gacha
        targetNormX: 0, targetNormY: 0,
        isDown: false,
        dragStartX: 0, dragStartY: 0,
        dragRotX: 0, dragRotY: 0,
        velX: 0, velY: 0
    };

    // 3D aylanish va dinamika
    let autoRotY = 0;
    let scrollOffset = 0;
    let shockwave = 0, shockwaveVel = 0;

    // Mavzuga mos ranglar (Dark / Light)
    let themeColors = {
        leftPrimary: '#38bdf8',    // Chap: Neon Cyan / Sapphire
        leftSecondary: '#2dd4bf',  // Chap: Neon Teal
        rightPrimary: '#818cf8',   // O'ng: Kiber Binafsha
        rightSecondary: '#c084fc', // O'ng: Ametist
        ambientDust: '#38bdf8',
        coreGlowLeft: 'rgba(56, 189, 248, 0.22)',
        coreGlowRight: 'rgba(129, 140, 248, 0.22)',
        lineAlpha: 0.32
    };

    function updateTheme() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            themeColors.leftPrimary = '#0284c7';
            themeColors.leftSecondary = '#0d9488';
            themeColors.rightPrimary = '#4f46e5';
            themeColors.rightSecondary = '#7c3aed';
            themeColors.ambientDust = '#4f46e5';
            themeColors.coreGlowLeft = 'rgba(2, 132, 199, 0.14)';
            themeColors.coreGlowRight = 'rgba(79, 70, 229, 0.14)';
            themeColors.lineAlpha = 0.22;
        } else {
            themeColors.leftPrimary = '#38bdf8';
            themeColors.leftSecondary = '#2dd4bf';
            themeColors.rightPrimary = '#818cf8';
            themeColors.rightSecondary = '#c084fc';
            themeColors.ambientDust = '#38bdf8';
            themeColors.coreGlowLeft = 'rgba(56, 189, 248, 0.22)';
            themeColors.coreGlowRight = 'rgba(129, 140, 248, 0.22)';
            themeColors.lineAlpha = 0.32;
        }
    }

    // -------------------------------------------------------------
    // 1. ZARRACHALAR BULUTI (COSMIC DUST PARTICLES)
    // -------------------------------------------------------------
    const DUST_COUNT = 120;
    const dustParticles = [];

    function initDustParticles() {
        dustParticles.length = 0;
        for (let i = 0; i < DUST_COUNT; i++) {
            dustParticles.push({
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 1200 - 600,
                z: Math.random() * 600 - 300,
                baseSize: 1.0 + Math.random() * 2.0,
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.3,
                pulse: Math.random() * Math.PI * 2,
                colorType: i % 2 // 0: cyan, 1: purple
            });
        }
    }

    // -------------------------------------------------------------
    // 2. CHAP OBYEKT: KVANT GIROSKOPI GEOMETRIYASI
    // -------------------------------------------------------------
    function buildLeftGyroSphere() {
        const points = [];
        const count = 90;
        const phi = Math.PI * (3 - Math.sqrt(5));
        const radius = 105;

        for (let i = 0; i < count; i++) {
            const y = 1 - (i / (count - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;
            points.push({
                baseX: Math.cos(theta) * radiusAtY * radius,
                baseY: y * radius,
                baseZ: Math.sin(theta) * radiusAtY * radius,
                pulseOffset: theta + y * 2
            });
        }
        return points;
    }

    function buildLeftGimbalRings() {
        const rings = [];
        const segs = 48;

        // 1-Ring (X-Z Gorizontal)
        const ring1 = [];
        for (let i = 0; i < segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            ring1.push({ x: Math.cos(a) * 145, y: 0, z: Math.sin(a) * 145 });
        }
        rings.push({ points: ring1, rotAxis: 'y', speed: 0.012, tilt: 0.3 });

        // 2-Ring (Y-Z Vertikal)
        const ring2 = [];
        for (let i = 0; i < segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            ring2.push({ x: 0, y: Math.cos(a) * 162, z: Math.sin(a) * 162 });
        }
        rings.push({ points: ring2, rotAxis: 'x', speed: -0.014, tilt: -0.4 });

        // 3-Ring (Diagonal Y-X)
        const ring3 = [];
        for (let i = 0; i < segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            ring3.push({ x: Math.cos(a) * 175, y: Math.sin(a) * 175, z: 0 });
        }
        rings.push({ points: ring3, rotAxis: 'z', speed: 0.009, tilt: 0.65 });

        return rings;
    }

    const leftSpherePoints = buildLeftGyroSphere();
    const leftGimbalRings = buildLeftGimbalRings();

    // -------------------------------------------------------------
    // 3. O'NG OBYEKT: KIBER TORUS TUGUNI (TREFOIL KNOT & PLAZMA)
    // -------------------------------------------------------------
    function buildRightTorusKnot() {
        const points = [];
        const total = 110;
        const scale = 28;

        for (let i = 0; i < total; i++) {
            const phi = (i / total) * Math.PI * 2 * 3;
            const r = 2.4 + Math.cos(3 * phi) * 0.9;
            const x = r * Math.cos(2 * phi) * scale;
            const y = r * Math.sin(2 * phi) * scale;
            const z = -Math.sin(3 * phi) * scale * 1.5;

            points.push({
                baseX: x,
                baseY: y,
                baseZ: z,
                pulseOffset: phi
            });
        }
        return points;
    }

    function buildRightSatellites() {
        const sats = [];
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            sats.push({
                baseRadius: 135 + (i % 3) * 15,
                angle: angle,
                speed: 0.016 + (i % 4) * 0.006,
                tilt: (i % 2 === 0 ? 0.45 : -0.55),
                size: 2.2 + Math.random() * 1.8
            });
        }
        return sats;
    }

    const rightKnotPoints = buildRightTorusKnot();
    const rightSatellites = buildRightSatellites();

    // -------------------------------------------------------------
    // 4. 3D BURISH VA PROYEKTSIYA MATRITSALARI
    // -------------------------------------------------------------
    function rotate3D(x, y, z, angleX, angleY, angleZ) {
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;

        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        if (angleZ) {
            const cosZ = Math.cos(angleZ), sinZ = Math.sin(angleZ);
            let x3 = x1 * cosZ - y2 * sinZ;
            let y3 = x1 * sinZ + y2 * cosZ;
            return { x: x3, y: y3, z: z2 };
        }
        return { x: x1, y: y2, z: z2 };
    }

    function project3D(p, cx, cy, fov, scaleMultiplier) {
        const distance = 540;
        const zEffective = p.z + distance;
        if (zEffective <= 10) return null;
        const scale = (distance / zEffective) * scaleMultiplier;
        return {
            x: cx + p.x * scale,
            y: cy + p.y * scale,
            scale: scale,
            z: p.z
        };
    }

    // -------------------------------------------------------------
    // 5. ASOSIY RENDERLASH SIKLI (60-120 FPS RAF)
    // -------------------------------------------------------------
    function render(timestamp) {
        if (!isVisible || !ctx) {
            animationId = requestAnimationFrame(render);
            return;
        }

        const t = (timestamp || performance.now()) * 0.001;

        // Kursorni LERP bilan silliq kuzatish
        mouse.normX += (mouse.targetNormX - mouse.normX) * 0.06;
        mouse.normY += (mouse.targetNormY - mouse.normY) * 0.06;

        // Drag & Throw inersiyasi
        mouse.dragRotX += mouse.velX;
        mouse.dragRotY += mouse.velY;
        mouse.velX *= 0.94;
        mouse.velY *= 0.94;

        autoRotY += 0.005;

        // Shockwave zarbasi
        if (shockwave > 0.001) {
            shockwave += shockwaveVel;
            shockwaveVel *= 0.92;
            if (shockwave > 45) shockwaveVel = -shockwaveVel * 0.65;
            if (shockwave < 0) shockwave = 0;
        }

        ctx.clearRect(0, 0, width, height);

        // Keng ekranda o'lchamlarni hisoblash
        const containerWidth = 1100;
        const sideGutter = Math.max(0, (width - containerWidth) / 2);

        // Katta monitorlarda (1440px - 1920px+) to'liq yonboshda turadi
        let cxLeft, cxRight, cy, scaleFactor;

        if (width >= 1380) {
            cxLeft = Math.max(130, sideGutter * 0.52);
            cxRight = width - cxLeft;
            scaleFactor = 1.0;
        } else if (width >= 1180) {
            cxLeft = Math.max(90, sideGutter * 0.46);
            cxRight = width - cxLeft;
            scaleFactor = 0.82;
        } else if (width >= 960) {
            cxLeft = 70;
            cxRight = width - 70;
            scaleFactor = 0.65;
        } else {
            // Kichik ekranlarda (planshet/smartfon) matnlarga xalaqit bermaslik uchun
            // markazda yengil fon rejimiga o'tadi
            cxLeft = -9999;
            cxRight = -9999;
            scaleFactor = 0.5;
        }

        cy = Math.min(height * 0.40, 310) - scrollOffset * 0.2;
        const fov = 500;

        // Kichik ekranda faqat bitta markaziy ambient fon
        if (width < 960) {
            const cxCenter = width / 2;
            renderLeftGuardian(cxCenter, cy, fov, 0.75, t);
            animationId = requestAnimationFrame(render);
            return;
        }

        // 1. Fon bo'ylab suzuvchi kosmik zarrachalar (Ambient Dust)
        ctx.globalAlpha = 0.35;
        for (let i = 0; i < dustParticles.length; i++) {
            const dp = dustParticles[i];
            dp.x += dp.speedX;
            dp.y += dp.speedY;

            if (dp.x < -width / 2) dp.x = width / 2;
            if (dp.x > width / 2) dp.x = -width / 2;
            if (dp.y < -height / 2) dp.y = height / 2;
            if (dp.y > height / 2) dp.y = -height / 2;

            const rot = rotate3D(dp.x, dp.y, dp.z, mouse.normY * 0.2, mouse.normX * 0.2, 0);
            const pr = project3D(rot, width / 2, cy + 80, fov, 1.0);
            if (!pr) continue;

            ctx.fillStyle = dp.colorType === 0 ? themeColors.leftPrimary : themeColors.rightPrimary;
            ctx.beginPath();
            ctx.arc(pr.x, pr.y, dp.baseSize * pr.scale, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        // 2. CHAP QANOT: KVANT GIROSKOPI
        renderLeftGuardian(cxLeft, cy, fov, scaleFactor, t);

        // 3. O'NG QANOT: KIBER TORUS TUGUNI
        renderRightGuardian(cxRight, cy, fov, scaleFactor, t);

        animationId = requestAnimationFrame(render);
    }

    // -------------------------------------------------------------
    // CHAP QANOT (KVANT GIROSKOP) RENDERING
    // -------------------------------------------------------------
    function renderLeftGuardian(cx, cy, fov, scaleFactor, t) {
        // Mahalliy kursorni hisoblash (chap markazga nisbatan burchak)
        const localNormX = ((mouse.x - cx) / (width * 0.5));
        const rotY = autoRotY + localNormX * 0.85 + mouse.dragRotX;
        const rotX = -mouse.normY * 0.65 + mouse.dragRotY;

        // Markaziy Kiber Aura
        const auraGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 190 * scaleFactor);
        auraGrad.addColorStop(0, themeColors.coreGlowLeft);
        auraGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.04)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 190 * scaleFactor, 0, Math.PI * 2);
        ctx.fill();

        // Giroskop Halqalari (Gimbal Rings)
        leftGimbalRings.forEach(gRing => {
            const ringAngle = t * gRing.speed * 40;
            ctx.strokeStyle = themeColors.leftPrimary;
            ctx.lineWidth = 1.3 * scaleFactor;
            ctx.globalAlpha = 0.42;
            ctx.beginPath();

            let first = true;
            for (let i = 0; i < gRing.points.length; i++) {
                const rp = gRing.points[i];
                let rx = rp.x, ry = rp.y, rz = rp.z;

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

                const rot = rotate3D(rx, ry, rz, rotX + gRing.tilt, rotY + ringAngle * 0.2, 0);
                const pr = project3D(rot, cx, cy, fov, scaleFactor);
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

        // Sfera Nuqtalari & To'rlari (Constellation Mesh)
        const projPoints = [];
        for (let i = 0; i < leftSpherePoints.length; i++) {
            const pt = leftSpherePoints[i];
            const pulse = Math.sin(t * 2.2 + pt.pulseOffset) * 4;
            const shock = shockwave ? (Math.sin(pt.pulseOffset * 4) * shockwave) : 0;
            const rScale = 1 + (pulse + shock) * 0.012;

            const rot = rotate3D(pt.baseX * rScale, pt.baseY * rScale, pt.baseZ * rScale, rotX, rotY, t * 0.04);
            const pr = project3D(rot, cx, cy, fov, scaleFactor);
            if (!pr) continue;

            projPoints.push({
                x: pr.x, y: pr.y, z: pr.z,
                scale: pr.scale,
                alpha: Math.max(0.2, Math.min(1.0, (pr.scale - 0.4) * 1.6))
            });
        }

        projPoints.sort((a, b) => a.z - b.z);

        // Chiziqlar bilan bog'lash
        ctx.lineWidth = 0.9 * scaleFactor;
        const maxDist = 42 * scaleFactor;

        for (let i = 0; i < projPoints.length; i += 2) {
            const p1 = projPoints[i];
            if (p1.z > 70) continue;

            for (let j = i + 1; j < Math.min(i + 7, projPoints.length); j++) {
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

        // Tugunlar (Vertices)
        for (let i = 0; i < projPoints.length; i++) {
            const p = projPoints[i];
            const size = Math.max(1.3, 2.3 * p.scale * scaleFactor);

            ctx.fillStyle = p.z > 0 ? themeColors.leftPrimary : themeColors.leftSecondary;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();

            if (p.z < -25) {
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = p.alpha * 0.85;
                ctx.beginPath();
                ctx.arc(p.x - size * 0.25, p.y - size * 0.25, size * 0.45, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1.0;
    }

    // -------------------------------------------------------------
    // O'NG QANOT (KIBER TORUS TUGUNI) RENDERING
    // -------------------------------------------------------------
    function renderRightGuardian(cx, cy, fov, scaleFactor, t) {
        // Mahalliy kursorni hisoblash (o'ng markazga nisbatan burchak)
        const localNormX = ((mouse.x - cx) / (width * 0.5));
        const rotY = -autoRotY * 1.1 + localNormX * 0.85 + mouse.dragRotX;
        const rotX = -mouse.normY * 0.65 + mouse.dragRotY;

        // O'ng Aura
        const auraGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 190 * scaleFactor);
        auraGrad.addColorStop(0, themeColors.coreGlowRight);
        auraGrad.addColorStop(0.6, 'rgba(129, 140, 248, 0.04)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 190 * scaleFactor, 0, Math.PI * 2);
        ctx.fill();

        // 1. Torus Tuguni Nuqtalari
        const knotProj = [];
        for (let i = 0; i < rightKnotPoints.length; i++) {
            const pt = rightKnotPoints[i];
            const pulse = Math.sin(t * 2.8 + pt.pulseOffset) * 4;
            const shock = shockwave ? (Math.sin(pt.pulseOffset * 4) * shockwave) : 0;
            const rScale = 1 + (pulse + shock) * 0.014;

            const rot = rotate3D(pt.baseX * rScale, pt.baseY * rScale, pt.baseZ * rScale, rotX, rotY, t * 0.06);
            const pr = project3D(rot, cx, cy, fov, scaleFactor);
            if (!pr) continue;

            knotProj.push({
                x: pr.x, y: pr.y, z: pr.z,
                scale: pr.scale,
                alpha: Math.max(0.2, Math.min(1.0, (pr.scale - 0.4) * 1.6))
            });
        }

        // Torus lentasini chizish (Continuous Ribbon)
        if (knotProj.length > 2) {
            ctx.strokeStyle = themeColors.rightPrimary;
            ctx.lineWidth = 1.6 * scaleFactor;
            ctx.globalAlpha = 0.55;
            ctx.beginPath();
            ctx.moveTo(knotProj[0].x, knotProj[0].y);
            for (let i = 1; i < knotProj.length; i++) {
                ctx.lineTo(knotProj[i].x, knotProj[i].y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Tugunlar
        for (let i = 0; i < knotProj.length; i++) {
            const p = knotProj[i];
            const size = Math.max(1.4, 2.5 * p.scale * scaleFactor);

            ctx.fillStyle = p.z > 0 ? themeColors.rightPrimary : themeColors.rightSecondary;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Plazma Sun'iy Yo'ldoshlari (Orbiting Satellites)
        for (let i = 0; i < rightSatellites.length; i++) {
            const sat = rightSatellites[i];
            sat.angle += sat.speed;

            const sx = Math.cos(sat.angle) * sat.baseRadius;
            const sy = Math.sin(sat.angle * 0.8) * (sat.baseRadius * 0.45);
            const sz = Math.sin(sat.angle) * sat.baseRadius;

            const rot = rotate3D(sx, sy, sz, rotX + sat.tilt, rotY + sat.angle * 0.15, 0);
            const pr = project3D(rot, cx, cy, fov, scaleFactor);
            if (!pr) continue;

            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.max(0.3, Math.min(1.0, (pr.scale - 0.4) * 1.8));
            ctx.beginPath();
            ctx.arc(pr.x, pr.y, sat.size * pr.scale * scaleFactor, 0, Math.PI * 2);
            ctx.fill();

            // Kichik porlash
            ctx.fillStyle = themeColors.rightSecondary;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(pr.x, pr.y, sat.size * 2.2 * pr.scale * scaleFactor, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1.0;
    }

    // -------------------------------------------------------------
    // 6. GLOBAL 3D CARD TILT (BUTUN SAYT KARTALARI UCHUN)
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
    // 7. EVENT LISTENERS
    // -------------------------------------------------------------
    function handleMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.targetNormX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetNormY = (e.clientY / window.innerHeight) * 2 - 1;

        if (mouse.isDown) {
            const dx = e.clientX - mouse.dragStartX;
            const dy = e.clientY - mouse.dragStartY;
            mouse.velX = dx * 0.005;
            mouse.velY = -dy * 0.005;
            mouse.dragStartX = e.clientX;
            mouse.dragStartY = e.clientY;
        }
    }

    function handleMouseDown(e) {
        if (e.target.closest('button, a, input, textarea, select, [data-action], .post-card, .atelier-quote-card')) {
            return;
        }
        mouse.isDown = true;
        mouse.dragStartX = e.clientX;
        mouse.dragStartY = e.clientY;
    }

    function handleMouseUp() {
        mouse.isDown = false;
    }

    function handleClick(e) {
        if (e.target.closest('button, a, input, textarea, select, [data-action]')) return;
        shockwave = 15;
        shockwaveVel = 4.0;
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
    }

    // -------------------------------------------------------------
    // 8. INITIALIZATION
    // -------------------------------------------------------------
    function init() {
        canvas = document.getElementById('spatial-3d-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        updateTheme();
        initDustParticles();
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
