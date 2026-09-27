// ============================================================
// ABDUGOFFOROV — BACKGROUND WEB WORKER (OFFSCREEN CANVAS ENGINE)
// Zero-Lag, 30FPS Capped, Multi-Threaded Background Engine
// ============================================================

let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
let dpr = 1;
let rafId = null;
let isRunning = false;
let isPaused = false;
let activeMode = 'stars'; // 'stars' | 'galaxy' | 'none'
let isDark = true;

const config = {
    speed: 1.0,
    density: 1.0,
    enableCompanion: true
};

let clock = 0;
let lastFrameTime = 0;
const TARGET_FPS = 30;
const FPS_INTERVAL = 1000 / TARGET_FPS; // ~33.33ms

// RequestAnimationFrame polyfill for Workers
const requestFrame = (typeof self.requestAnimationFrame === 'function')
    ? (cb) => self.requestAnimationFrame(cb)
    : (cb) => setTimeout(() => cb(performance.now()), FPS_INTERVAL);

const cancelFrame = (typeof self.cancelAnimationFrame === 'function')
    ? (id) => self.cancelAnimationFrame(id)
    : (id) => clearTimeout(id);

// ============================================================
// 1. SOKIN YULDUZLAR VA UCHAR YULDUZ (METEOR)
// ============================================================
let tranquilStars = [];
let shootingMeteors = [];
let nextMeteorTime = 60;

function initTranquilStars() {
    tranquilStars = [];
    shootingMeteors = [];
    const w = width || 1200;
    const h = height || 800;

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
    const w = width || 1200;
    const h = height || 800;

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

        // Yulduz nurli halosi
        if (isDark && s.size > 1.6 && alpha > 0.45) {
            ctx.fillStyle = glowCol;
            ctx.beginPath();
            ctx.arc(s.x, s.y, radius * 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 2. Vaqti-vaqti bilan uchuvchi yulduz (Meteor)
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
// 2. 🌌 3D SPIRAL GALAXY
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
// 3. SICHQONCHA HAMROHI (MOUSE COMPANION & RIPPLES)
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

    if (Date.now() - companion.lastMoveTime > 1100) {
        companion.targetAlpha = 0;
    }

    const dx = companion.targetX - companion.x;
    const dy = companion.targetY - companion.y;
    companion.x += dx * 0.38;
    companion.y += dy * 0.38;
    companion.alpha += (companion.targetAlpha - companion.alpha) * 0.22;

    if (companion.alpha < 0.01 && companion.targetAlpha === 0) {
        companion.active = false;
    }
}

function renderRipples() {
    if (companion.ripples.length === 0) return;

    for (let i = companion.ripples.length - 1; i >= 0; i--) {
        const rp = companion.ripples[i];
        rp.radius += 1.8;
        rp.alpha -= 0.035;
        if (rp.alpha <= 0 || rp.radius >= rp.maxRadius) {
            companion.ripples.splice(i, 1);
            continue;
        }
        ctx.strokeStyle = isDark
            ? `rgba(192, 132, 252, ${rp.alpha * 0.55})`
            : `rgba(79, 70, 229, ${rp.alpha * 0.60})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function renderMouseCompanion() {
    if (!companion.active) return;
    updateCompanion();
    renderRipples();

    if (companion.alpha < 0.02) return;

    const pulse = 1 + Math.sin(clock * 0.08) * 0.14;
    const glowR = 18;
    const ringR = 12 * pulse;
    const coreR = (isDark ? 2.2 : 2.4) * pulse;

    // 1. Yumshoq tashqi gradient aura (chegarasi xira/qirrali emas, 0% ga silliq o'chadi)
    const auraGrad = ctx.createRadialGradient(
        companion.x, companion.y, 0,
        companion.x, companion.y, glowR
    );
    if (isDark) {
        auraGrad.addColorStop(0, `rgba(167, 139, 250, ${0.28 * companion.alpha})`);
        auraGrad.addColorStop(0.5, `rgba(139, 92, 246, ${0.12 * companion.alpha})`);
        auraGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
    } else {
        auraGrad.addColorStop(0, `rgba(99, 102, 241, ${0.26 * companion.alpha})`);
        auraGrad.addColorStop(0.55, `rgba(129, 140, 248, ${0.10 * companion.alpha})`);
        auraGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
    }
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(companion.x, companion.y, glowR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Nafis ingichka orbital halqa (aniq va zamonaviy chegara)
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = isDark
        ? `rgba(192, 132, 252, ${0.45 * companion.alpha})`
        : `rgba(99, 102, 241, ${0.55 * companion.alpha})`;
    ctx.beginPath();
    ctx.arc(companion.x, companion.y, ringR, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Markaziy yorug'lik nuqtasi (kunduzi ham, tunda ham ravshan ko'rinadi)
    ctx.fillStyle = isDark
        ? `rgba(167, 139, 250, ${0.45 * companion.alpha})`
        : `rgba(99, 102, 241, ${0.35 * companion.alpha})`;
    ctx.beginPath();
    ctx.arc(companion.x, companion.y, coreR * 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isDark
        ? `rgba(255, 255, 255, ${0.95 * companion.alpha})`
        : `rgba(79, 70, 229, ${0.92 * companion.alpha})`;
    ctx.beginPath();
    ctx.arc(companion.x, companion.y, coreR, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================================
// 4. ANIMATION LOOP (DYNAMIC 60FPS ON MOVE / 30FPS IDLE)
// ============================================================
function loop(timestamp) {
    if (!isRunning || isPaused) {
        rafId = null;
        return;
    }

    rafId = requestFrame(loop);

    // Sichqoncha harakatlanganda 60 FPS (silliq va zudlik bilan ergashadi),
    // to'xtaganda esa batareya va resurslarni tejash uchun 30 FPS ga o'tadi
    const activeTargetFps = (companion.active && companion.alpha > 0.05) ? 60 : TARGET_FPS;
    const currentInterval = 1000 / activeTargetFps;

    const elapsed = timestamp - lastFrameTime;
    if (elapsed < currentInterval) return;
    lastFrameTime = timestamp - (elapsed % currentInterval);

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

function pause() {
    isPaused = true;
    if (rafId) {
        cancelFrame(rafId);
        rafId = null;
    }
}

function resume() {
    if (!isRunning) return;
    isPaused = false;
    if (!rafId) {
        lastFrameTime = performance.now();
        rafId = requestFrame(loop);
    }
}

// ============================================================
// 5. MESSAGE DISPATCHER (ONMESSAGE)
// ============================================================
self.onmessage = function(event) {
    const data = event.data;
    if (!data) return;

    switch (data.type) {
        case 'init': {
            canvas = data.canvas;
            if (!canvas) return;

            ctx = canvas.getContext('2d', { alpha: true });
            if (!ctx) return;

            width = data.width || 800;
            height = data.height || 600;
            dpr = data.dpr || 1;
            isDark = data.theme ? data.theme === 'dark' : true;
            activeMode = data.mode || 'stars';

            if (data.config) {
                Object.assign(config, data.config);
            }

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            if (activeMode === 'stars') initTranquilStars();
            else if (activeMode === 'galaxy') initGalaxy();

            isRunning = true;
            isPaused = false;
            lastFrameTime = performance.now();
            if (!rafId) {
                rafId = requestFrame(loop);
            }
            break;
        }

        case 'resize': {
            if (!canvas || !ctx) return;
            width = data.width || width;
            height = data.height || height;
            dpr = data.dpr || dpr;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            if (activeMode === 'stars') {
                initTranquilStars();
            }
            break;
        }

        case 'theme': {
            isDark = data.theme ? data.theme === 'dark' : Boolean(data.isDark);
            if (activeMode === 'stars') initTranquilStars();
            else if (activeMode === 'galaxy') initGalaxy();
            break;
        }

        case 'mode': {
            const validModes = ['stars', 'galaxy', 'none'];
            activeMode = validModes.includes(data.mode) ? data.mode : 'stars';
            if (activeMode === 'stars') initTranquilStars();
            else if (activeMode === 'galaxy') initGalaxy();
            break;
        }

        case 'pause': {
            pause();
            break;
        }

        case 'resume': {
            resume();
            break;
        }

        case 'mouse': {
            if (!config.enableCompanion) return;

            if (data.action === 'leave' || data.isLeave) {
                companion.targetAlpha = 0;
            } else if (data.action === 'click' || data.isClick) {
                companion.active = true;
                companion.targetAlpha = 1.0;
                companion.lastMoveTime = Date.now();
                if (companion.ripples.length < 3) {
                    companion.ripples.push({
                        x: data.x,
                        y: data.y,
                        radius: 4,
                        maxRadius: 24,
                        alpha: 0.4
                    });
                }
            } else {
                // move or touch
                if (companion.x < -100 || !companion.active) {
                    companion.x = data.x;
                    companion.y = data.y;
                }
                companion.targetX = data.x;
                companion.targetY = data.y;
                companion.targetAlpha = data.alpha !== undefined ? data.alpha : (data.isTouch ? 0.8 : 1.0);
                companion.lastMoveTime = Date.now();
                companion.active = true;
            }
            break;
        }

        case 'config': {
            if (data.config) {
                Object.assign(config, data.config);
                if (activeMode === 'stars') initTranquilStars();
                else if (activeMode === 'galaxy') initGalaxy();
            }
            break;
        }
    }
};
