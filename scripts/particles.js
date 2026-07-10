// ===== HERO PARTICLES (Canvas API) =====
// Mayda nuqtalar suzib yuradi, sichqonchaga react qiladi, yaqinlashganda chiziq tortadi
function createParticleCanvas(canvasId, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return null;

    const count = options.count || (isMobile ? 40 : 90);
    const linkDist = options.linkDist || (isMobile ? 80 : 120);
    const speed = options.speed || 0.4;
    const maxSpeed = options.maxSpeed || 1;
    const particleRadius = options.particleRadius || { min: 0.6, range: 1.6 };
    const baseAlpha = options.baseAlpha || { min: 0.45, range: 0.35 };
    const linkAlpha = options.linkAlpha || 0.25;
    const enableMouse = options.enableMouse !== false;

    let particles = [];
    let mouse = { x: -9999, y: -9999, active: false };
    let raf = null;

    function size() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function spawn() {
        particles = [];
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        for (let i = 0; i < count; i++) {
            const useBlue = Math.random() > 0.5;
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                r: Math.random() * particleRadius.range + particleRadius.min,
                color: useBlue ? '59, 130, 246' : '139, 92, 246',
                a: baseAlpha.min + Math.random() * baseAlpha.range,
            });
        }
    }

    function step() {
        if (!isVisible) {
            raf = requestAnimationFrame(step);
            return;
        }
        const w = canvas.clientWidth, h = canvas.clientHeight;
        ctx.clearRect(0, 0, w, h);

        for (const p of particles) {
            if (enableMouse && mouse.active) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 120 * 120) {
                    const d = Math.sqrt(d2) || 1;
                    p.vx += (dx / d) * 0.06;
                    p.vy += (dy / d) * 0.06;
                }
            }
            p.x += p.vx; p.y += p.vy;
            p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx * 0.99));
            p.vy = Math.max(-maxSpeed, Math.min(maxSpeed, p.vy * 0.99));
            if (p.x < 0) { p.x = 0; p.vx *= -1; }
            else if (p.x > w) { p.x = w; p.vx *= -1; }
            if (p.y < 0) { p.y = 0; p.vy *= -1; }
            else if (p.y > h) { p.y = h; p.vy *= -1; }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.a})`;
            ctx.fill();
        }

        // Fikr: Mobil qurilmalarda chiziqlarni (lines) chizmaslik orqali ishlash tezligini keskin oshiramiz
        if (!isMobile) {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < linkDist * linkDist) {
                        const alpha = (1 - Math.sqrt(d2) / linkDist) * linkAlpha;
                        ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
        }

        raf = requestAnimationFrame(step);
    }

    function onMove(e) {
        const rect = canvas.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        mouse.x = t.clientX - rect.left;
        mouse.y = t.clientY - rect.top;
        mouse.active = true;
    }
    function onLeave() { mouse.active = false; }

    size();
    spawn();

    let isVisible = true;
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
        });
        observer.observe(canvas);
    }

    step();
    window.addEventListener('resize', () => { size(); spawn(); }, { passive: true });

    if (enableMouse && !isMobile) {
        canvas.parentElement.addEventListener('mousemove', onMove);
        canvas.parentElement.addEventListener('mouseleave', onLeave);
    }

    return () => { if (raf) cancelAnimationFrame(raf); };
}

function initParticles() {
    return createParticleCanvas('particles-canvas', {
        count: window.matchMedia('(max-width: 768px)').matches ? 40 : 90,
        linkDist: window.matchMedia('(max-width: 768px)').matches ? 80 : 120,
        speed: 0.4,
        maxSpeed: 1,
        particleRadius: { min: 0.6, range: 1.6 },
        baseAlpha: { min: 0.45, range: 0.35 },
        linkAlpha: 0.25,
        enableMouse: true
    });
}

// ===== FOOTER PARTICLES (Canvas API) =====
function initFooterParticles() {
    return createParticleCanvas('footer-particles-canvas', {
        count: window.matchMedia('(max-width: 768px)').matches ? 20 : 50,
        linkDist: window.matchMedia('(max-width: 768px)').matches ? 80 : 110,
        speed: 0.3,
        maxSpeed: 0.8,
        particleRadius: { min: 0.5, range: 1.4 },
        baseAlpha: { min: 0.35, range: 0.3 },
        linkAlpha: 0.2,
        enableMouse: false
    });
}

