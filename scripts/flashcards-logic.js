// ===== KARTOCHKALAR HOLATI VA KO'RINISHI =====
let fcDeckKey = null;
let fcOrder = [];
let fcIndex = 0;

function renderFlashcardsHome() {
    const view = document.getElementById('flashcards-content');
    if (!view) return;
    const decks = [
        { key: 'de_uz', i: 'deck.de_uz' },
        { key: 'uz_de', i: 'deck.uz_de' },
        { key: 'grammar', i: 'deck.grammar' },
        { key: 'sentences', i: 'deck.sentences' },
        { key: 'quotes', i: 'deck.quotes' },
        { key: 'ueber_mich', i: 'deck.ueber_mich' }
    ];
    view.innerHTML = `
        <div style="text-align:center; margin-bottom:36px;">
            <div style="font-size:48px; margin-bottom:12px;">🃏</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">${i18n.t('fc.title')}</h2>
            <p style="color:var(--text-secondary);">${i18n.t('fc.subtitle')}</p>
            <div style="margin-top:14px; display:inline-flex; gap:10px; align-items:center; background:var(--tag-bg); padding:8px 16px; border-radius:30px; font-size:13px;">
                🔥 <b>${getFcStreak()}</b> kunlik streak
            </div>
        </div>
        <div class="fc-deck-grid">
            ${decks.map(d => `
                <div class="post-card fc-deck-card" onclick="startFlashcards('${d.key}')">
                    <div class="fc-deck-emoji">${i18n.t(d.i).split(' ')[0]}</div>
                    <h3>${i18n.t(d.i)}</h3>
                    <span class="fc-deck-count">${fcMasteredCount(d.key)} / ${flashcardDecks[d.key].length}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function startFlashcards(key) {
    if (!flashcardDecks[key]) return;
    fcDeckKey = key;
    // Spaced repetition: muddati kelgan (yoki yangi) kartalar oldinga
    const prog = fcProgress();
    const now = Date.now();
    const idxs = flashcardDecks[key].map((_, i) => i);
    idxs.sort((a, bb) => {
        const da = (prog[fcCardKey(key, a)] && prog[fcCardKey(key, a)].due) || 0;
        const db = (prog[fcCardKey(key, bb)] && prog[fcCardKey(key, bb)].due) || 0;
        const ka = da <= now ? 0 : da;
        const kb = db <= now ? 0 : db;
        return ka - kb;
    });
    fcOrder = idxs;
    fcIndex = 0;
    renderFlashcard();
}

function renderFlashcard() {
    const view = document.getElementById('flashcards-content');
    const deck = flashcardDecks[fcDeckKey];
    if (!view || !deck) { renderFlashcardsHome(); return; }
    const card = deck[fcOrder[fcIndex]];
    view.innerHTML = `
        <div style="max-width:560px; margin:0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:10px;">
                <button class="btn-secondary btn-sm" onclick="renderFlashcardsHome()">${i18n.t('fc.back')}</button>
                <span style="color:var(--text-muted); font-size:13px;">🔥 ${getFcStreak()} &nbsp;-&nbsp; ${fcIndex + 1} / ${deck.length}</span>
                <button class="btn-secondary btn-sm" onclick="shuffleFlashcards()">${i18n.t('fc.shuffle')}</button>
            </div>
            <div class="flashcard" id="flashcard">
                <div class="flashcard-inner">
                    <div class="flashcard-face flashcard-front">
                        <div class="fc-text">${escapeHTML(card.front)}</div>
                        <span class="fc-hint">${i18n.t('fc.tapHint')}</span>
                    </div>
                    <div class="flashcard-face flashcard-back">
                        <div class="fc-text">${escapeHTML(card.back)}</div>
                    </div>
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px; margin-top:18px;">
                <button class="btn-secondary" onclick="prevFlashcard()">${i18n.t('fc.prev')}</button>
                <button class="btn-primary" onclick="flipFlashcard()">${i18n.t('fc.flip')}</button>
                <button class="btn-secondary" onclick="nextFlashcard()">${i18n.t('fc.next')}</button>
            </div>
            <div style="display:flex; gap:12px; margin-top:12px;">
                <button class="btn-secondary" style="flex:1; border-color:rgba(248,113,113,0.4); color:#ef4444;" onclick="fcAnswer(false)">✗ Bilmayman</button>
                <button class="btn-primary" style="flex:1; background:#22c55e; border-color:#22c55e; color:#fff;" onclick="fcAnswer(true)">✓ Bilaman</button>
            </div>
        </div>
    `;
    const fcEl = document.getElementById('flashcard');
    if (fcEl) fcEl.addEventListener('click', flipFlashcard);
}

function flipFlashcard() {
    const fc = document.getElementById('flashcard');
    if (fc) fc.classList.toggle('flipped');
}

function nextFlashcard() {
    const deck = flashcardDecks[fcDeckKey];
    if (!deck) return;
    fcIndex = (fcIndex + 1) % deck.length;
    renderFlashcard();
}

function prevFlashcard() {
    const deck = flashcardDecks[fcDeckKey];
    if (!deck) return;
    fcIndex = (fcIndex - 1 + deck.length) % deck.length;
    renderFlashcard();
}

function shuffleFlashcards() {
    for (let i = fcOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fcOrder[i], fcOrder[j]] = [fcOrder[j], fcOrder[i]];
    }
    fcIndex = 0;
    renderFlashcard();
}

// ===== TIL (i18n) BOSHQARUVI =====
function initLanguage() {
    // Bayroqli custom dropdown (mobil va veb bir xil komponent)
    const dropEl = document.getElementById('lang-select');
    if (dropEl && i18n.buildLangDropdown) {
        i18n.buildLangDropdown(dropEl);
    }
    i18n.applyStaticTranslations();
    document.documentElement.setAttribute('lang', i18n.getLang());

    // Til o'zgarganda dinamik qismlarni qayta chizamiz
    document.addEventListener('langchange', () => {
        updateHeroContent();
        renderPosts();
        const deutschView = document.getElementById('deutsch-view');
        const flashView = document.getElementById('flashcards-view');
        if (deutschView && deutschView.style.display !== 'none') renderDeutschHome();
        if (flashView && flashView.style.display !== 'none') {
            fcDeckKey ? renderFlashcard() : renderFlashcardsHome();
        }
    });
}

// ===== 3D KIRISH ANIMATSIYASINI YASHIRISH =====
function initIntroSplash() {
    const splash = document.getElementById('intro-splash');
    if (!splash) return;
    const start = Date.now();
    const MIN_MS = 1800; // kamida shuncha vaqt ko'rsatiladi

    function hide() {
        const wait = Math.max(0, MIN_MS - (Date.now() - start));
        setTimeout(() => {
            splash.classList.add('hide');
            setTimeout(() => splash.remove(), 800);
        }, wait);
    }

    // Bosib o'tkazib yuborish mumkin
    splash.addEventListener('click', () => {
        splash.classList.add('hide');
        setTimeout(() => splash.remove(), 800);
    });

    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
}

// ===== SCROLL REVEAL (pastdan/tepadan kirish animatsiyasi) =====
let revealObserver = null;

function getRevealObserver() {
    if (revealObserver) return revealObserver;
    if (!('IntersectionObserver' in window)) return null;
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                // Element ko'rinishdan chiqqanda yo'nalishni belgilaymiz
                entry.target.classList.remove('in-view');
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('reveal-down');
                    entry.target.classList.add('reveal-up');
                } else {
                    entry.target.classList.remove('reveal-up');
                    entry.target.classList.add('reveal-down');
                }
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    return revealObserver;
}

function observeReveal(el) {
    if (!el) return;
    const obs = getRevealObserver();
    if (!obs) { el.classList.add('in-view'); return; }
    el.classList.add('reveal', 'reveal-up');
    obs.observe(el);
}

function initScrollReveal() {
    // Yangi dizaynda widget'lar hero ichida — eski selector kerak emas.
    // Faqat toolbar va footer container'iga reveal qo'llaymiz.
    document.querySelectorAll('.toolbar, .footer .container')
        .forEach(observeReveal);
}

// ===== FLOATING "+" TUGMA (faqat mobilda) =====
function initFloatingAddBtn() {
    const fab = document.getElementById('fab-add');
    if (!fab) return;
    fab.addEventListener('click', (e) => {
        e.preventDefault();
        // "Yozish" tugmasini chaqirib bersa o'sha modal ochiladi
        const addBtn = document.getElementById('add-post-btn');
        if (addBtn) {
            addBtn.click();
        } else {
            // Backup: modal'ni to'g'ridan-to'g'ri ochish
            const modal = document.getElementById('add-post-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });
}


// ===== PWA, DEEP-LINK (ulashiladigan post havolasi) VA ULASHISH =====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
}

const DEFAULT_TITLE = document.title;
const DEFAULT_DESC = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
let currentDetailPostId = null;

function setMeta(title, desc) {
    document.title = title;
    const m = document.querySelector('meta[name="description"]');
    if (m && desc) m.setAttribute('content', desc);
}

function openPostFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('post');
    if (id) {
        const post = posts.find(p => String(p.id) === String(id));
        if (post) openPostDetail(post.id);
    }

    // PWA shortcuts:  /?new=1  → "Yangi yozuv" modalini ochish
    if (params.get('new') === '1') {
        const addBtn = document.getElementById('add-post-btn');
        if (addBtn) {
            setTimeout(() => addBtn.click(), 300);
        }
    }

    // /?view=deutsch  → Deutsch testlar sahifasiga o'tish
    if (params.get('view') === 'deutsch') {
        setTimeout(() => {
            if (typeof openDeutschView === 'function') openDeutschView();
        }, 300);
    }
}

function sharePost(post) {
    const url = `${location.origin}/?post=${post.id}`;
    if (navigator.share) {
        navigator.share({ title: post.title, text: post.excerpt || '', url }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => alert('Havola nusxalandi:\n' + url)).catch(() => prompt('Havola:', url));
    } else {
        prompt('Havola:', url);
    }
}

// ===== O'QISH VAQTI VA TEGLAR =====
function escapeAttr(s) { return String(s || '').replace(/['"\\<>&]/g, ''); }

function readingTime(post) {
    const text = ((post.content || '') + ' ' + (post.excerpt || '')).trim();
    const words = text ? text.split(/\s+/).length : 0;
    return Math.max(1, Math.round(words / 180)) + ' daqiqalik o\'qish';
}

function renderTags(post) {
    if (!post.tags || !post.tags.length) return '';
    return `<div class="post-tags">${post.tags.map(t =>
        `<button class="tag-pill" onclick="filterByTag('${escapeAttr(t)}')">#${escapeHTML(t)}</button>`
    ).join('')}</div>`;
}

function filterByTag(tag) {
    closePostDetailModal();
    showMainView();
    currentTab = 'home';
    filterType = 'all';
    searchQuery = tag;
    const si = document.getElementById('search-input');
    if (si) si.value = tag;
    document.querySelectorAll('#filter-tags .filter-tag').forEach(t => t.classList.remove('active'));
    document.querySelector('#filter-tags [data-filter="all"]')?.classList.add('active');
    renderPosts();
    window.scrollTo({ top: 220, behavior: 'smooth' });
}

// ===== IZOHGA ADMIN JAVOBI =====
function replyToComment(commentId) {
    if (!isAdmin || currentDetailPostId == null) return;
    const post = posts.find(p => p.id === currentDetailPostId);
    if (!post) return;
    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;
    const text = prompt('Javobingiz:');
    if (!text || !text.trim()) return;
    comment.reply = { author: 'Akromjon (admin)', text: text.trim(), date: new Date().toISOString().split('T')[0] };
    savePosts();
    const list = document.getElementById('modal-comments-list');
    if (list) list.innerHTML = renderComments(post.comments);
}

// ===== NEMIS TESTLARI — NATIJALAR TARIXI =====
function saveTestResult(level, score, total) {
    const hist = JSON.parse(localStorage.getItem('deutsch_history') || '[]');
    hist.unshift({ level, score, total, pct: total ? Math.round(score / total * 100) : 0, date: new Date().toISOString() });
    localStorage.setItem('deutsch_history', JSON.stringify(hist.slice(0, 50)));
}
function getTestHistory() {
    return JSON.parse(localStorage.getItem('deutsch_history') || '[]');
}
function renderTestHistory() {
    const hist = getTestHistory();
    if (!hist.length) return '';
    const rows = hist.slice(0, 6).map(h => {
        const d = new Date(h.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
        const color = h.pct >= 80 ? '#34d399' : h.pct >= 60 ? '#fbbf24' : '#f87171';
        return `<div style="display:flex;align-items:center;gap:10px;font-size:13px;padding:8px 0;border-bottom:1px solid var(--border-color);">
            <span style="text-transform:uppercase;font-weight:600;width:42px;">${escapeHTML(h.level)}</span>
            <div style="flex:1;height:6px;background:var(--border-color);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${h.pct}%;background:${color};"></div>
            </div>
            <span style="width:70px;text-align:right;color:var(--text-secondary);">${h.score}/${h.total} - ${h.pct}%</span>
            <span style="width:56px;text-align:right;color:var(--text-muted);font-size:11px;">${d}</span>
        </div>`;
    }).join('');
    return `<div class="post-card" style="max-width:680px;margin:30px auto 0;padding:22px;">
        <h3 style="font-size:16px;margin-bottom:12px;">📈 Sizning natijalaringiz</h3>
        ${rows}
    </div>`;
}

// ===== FLASHCARD — SPACED REPETITION (Leitner) + STREAK =====
const FC_INTERVALS = [0, 1, 2, 4, 7, 15]; // box raqami -> kunlar
function fcProgress() { return JSON.parse(localStorage.getItem('fc_progress') || '{}'); }
function fcSaveProgress(p) { localStorage.setItem('fc_progress', JSON.stringify(p)); }
function fcCardKey(deck, idx) { return deck + ':' + idx; }

function fcAnswer(known) {
    const prog = fcProgress();
    const key = fcCardKey(fcDeckKey, fcOrder[fcIndex]);
    let box = (prog[key] && prog[key].box) || 1;
    box = known ? Math.min(box + 1, 5) : 1;
    prog[key] = { box, due: Date.now() + FC_INTERVALS[box] * 86400000 };
    fcSaveProgress(prog);
    updateFcStreak();
    if (fcIndex < fcOrder.length - 1) { fcIndex++; renderFlashcard(); }
    else renderFlashcardDone();
}

function updateFcStreak() {
    const today = new Date().toISOString().split('T')[0];
    const s = JSON.parse(localStorage.getItem('fc_streak') || '{"count":0,"last":""}');
    if (s.last === today) return s.count;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    s.count = (s.last === yesterday) ? (s.count + 1) : 1;
    s.last = today;
    localStorage.setItem('fc_streak', JSON.stringify(s));
    return s.count;
}
function getFcStreak() {
    return (JSON.parse(localStorage.getItem('fc_streak') || '{"count":0}').count) || 0;
}
function fcMasteredCount(deckKey) {
    const prog = fcProgress();
    let n = 0;
    (flashcardDecks[deckKey] || []).forEach((_, i) => {
        const e = prog[fcCardKey(deckKey, i)];
        if (e && e.box >= 4) n++;
    });
    return n;
}
function renderFlashcardDone() {
    const view = document.getElementById('flashcards-content');
    if (!view) return;
    const mastered = fcMasteredCount(fcDeckKey);
    const total = flashcardDecks[fcDeckKey].length;
    view.innerHTML = `
        <div style="max-width:480px;margin:0 auto;text-align:center;">
            <div style="font-size:60px;margin-bottom:14px;">🎉</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:26px;margin-bottom:8px;">To'plam yakunlandi!</h2>
            <p style="color:var(--text-secondary);margin-bottom:24px;">O'zlashtirildi: <b>${mastered}/${total}</b> &nbsp;-&nbsp; 🔥 Streak: <b>${getFcStreak()} kun</b></p>
            <div style="display:flex;gap:12px;justify-content:center;">
                <button class="btn-primary" onclick="startFlashcards('${fcDeckKey}')">🔄 Qayta</button>
                <button class="btn-secondary" onclick="renderFlashcardsHome()">${i18n.t('fc.back')}</button>
            </div>
        </div>`;
}

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

// ===== GERMANY CAROUSEL =====
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (!track || !dotsContainer) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const total = slides.length;
    let current = 0;
    let autoSlideInterval = null;

    // Dots yaratish
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsContainer.appendChild(dot);
    }

    function goTo(idx) {
        current = ((idx % total) + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dotsContainer.querySelectorAll('.carousel-dot').forEach(function(d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    // Slide-left: always advance forward (right to left)
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (prevBtn) prevBtn.addEventListener('click', function() { prev(); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { next(); resetAuto(); });

    // Auto-play: 15 seconds interval
    function startAuto() {
        autoSlideInterval = setInterval(next, 15000);
    }
    function stopAuto() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    function resetAuto() {
        stopAuto();
        startAuto();
    }

    startAuto();

    // Pause carousel when tab is hidden to prevent slide jumps on return
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAuto();
        } else {
            startAuto();
        }
    });

    // Image onerror fallback: hide broken image (shows dark bg)
    slides.forEach(function(slide) {
        var img = slide.querySelector('img');
        if (img) {
            img.onerror = function() {
                this.style.display = 'none';
            };
        }
    });

    // Touch/swipe support via pointer events
    var pointerStartX = 0;
    var pointerDown = false;

    track.addEventListener('pointerdown', function(e) {
        pointerStartX = e.clientX;
        pointerDown = true;
        track.setPointerCapture(e.pointerId);
    });

    track.addEventListener('pointerup', function(e) {
        if (!pointerDown) return;
        pointerDown = false;
        var diff = pointerStartX - e.clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) { next(); } else { prev(); }
            resetAuto();
        }
    });

    track.addEventListener('pointercancel', function() {
        pointerDown = false;
    });

    // Also support touch events for older mobile browsers
    var touchStartX = 0;
    track.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) next(); else prev();
            resetAuto();
        }
    }, { passive: true });
}

// ===== HERO TYPEWRITER =====
// hero-title-text'ning matnini harfma-harf qayta yozadi (langchange'da yangilanadi)
let _typewriterTimer = null;
function runTypewriter() {
    const el = document.querySelector('.hero-title-text');
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const full = (window.i18n && i18n.t) ? i18n.t('hero.title') : (el.getAttribute('data-final') || el.textContent || '');
    el.setAttribute('data-final', full);
    if (reduced) { el.textContent = full; return; }
    if (_typewriterTimer) { clearInterval(_typewriterTimer); _typewriterTimer = null; }
    el.textContent = '';
    let i = 0;
    const speed = 55;
    _typewriterTimer = setInterval(() => {
        if (i >= full.length) {
            clearInterval(_typewriterTimer);
            _typewriterTimer = null;
            return;
        }
        el.textContent += full.charAt(i);
        i++;
    }, speed);
}

// CTA tugmasi — blog grid'iga skroll
function initHeroCta() {
    const btn = document.getElementById('hero-cta-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const grid = document.getElementById('blog-grid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// ===== 3D TILT EFFEKT (kartochkalar) =====
// Mouse hover'da kartochka 3D buriladi. Touch qurilmalarda o'chiriladi.
// Tilt observer DOM o'zgargach yangi kartochkalarga ham qo'shiladi.
function init3DTilt() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || touch) return; // touch ekranlarda 3D tilt yo'q

    const MAX = 12; // maksimal burchak (daraja)
    const PERSPECTIVE = 1000;

    function attach(card) {
        if (card._tiltAttached) return;
        card._tiltAttached = true;

        let raf = null;
        let bound = null;
        function onMove(e) {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                if (!bound) bound = card.getBoundingClientRect();
                const x = e.clientX - bound.left;
                const y = e.clientY - bound.top;
                const cx = bound.width / 2;
                const cy = bound.height / 2;
                const rx = ((y - cy) / cy) * -MAX;
                const ry = ((x - cx) / cx) *  MAX;
                card.style.transform =
                    `perspective(${PERSPECTIVE}px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
                card.classList.add('tilting');
            });
        }
        function onEnter() { bound = card.getBoundingClientRect(); }
        function onLeave() {
            card.style.transform = '';
            card.classList.remove('tilting');
            bound = null;
        }
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
    }

    function scan() {
        document.querySelectorAll('.post-card').forEach(attach);
    }

    // Birinchi skanlash
    scan();
    // Yangi kartochkalar qo'shilganda
    const grid = document.getElementById('blog-grid');
    if (grid) {
        const mo = new MutationObserver(() => scan());
        mo.observe(grid, { childList: true });
    }
}

async function bootstrap() {
    // 3D kirish animatsiyasi darhol boshlanadi
    initIntroSplash();

    // Til (i18n) — statik tarjimalar va til tanlagich
    initLanguage();

    // Mavzu va kursorni darhol ishga tushiramiz (ma'lumotga bog'liq emas)
    initTheme();
    initMouseFollower();

    // Yangi imkoniyatlar
    initLightbox();
    initMiniPlayer();

    // Postlarni yuklash strategiyasi:
    //   1. Avval serverdan (Cloudflare KV) o'qiymiz — bu admin yuborgan
    //      eng so'nggi versiya; barcha mehmonlar shuni ko'radi.
    //   2. Server javob bermasa yoki bo'sh bo'lsa, mahalliy (IndexedDB) ga
    //      qaytamiz.
    //   3. Mahalliy ham bo'sh bo'lsa — standart postlar.
    let serverPosts = null;
    if (window.Sync) {
        serverPosts = await Sync.fetchPosts();
    }

    try {
        if (window.Store) {
            await Store.init(['abdu_posts']);
            const stored = Store.get('abdu_posts');

            if (serverPosts && serverPosts.length) {
                // Serverdagi versiya birlamchi
                posts = serverPosts;
                Store.set('abdu_posts', posts); // mahalliyga ham keshlaymiz
            } else if (stored && Array.isArray(stored) && stored.length) {
                posts = stored;
            } else {
                posts = defaultPosts;
                Store.set('abdu_posts', posts);
            }
        } else {
            if (serverPosts && serverPosts.length) {
                posts = serverPosts;
                try { localStorage.setItem('abdu_posts', JSON.stringify(posts)); } catch (e) {}
            } else {
                const ls = JSON.parse(localStorage.getItem('abdu_posts') || 'null');
                posts = (ls && ls.length) ? ls : defaultPosts;
            }
        }
    } catch (e) {
        console.error('Xotira yuklashda xato, standart postlar ishlatiladi:', e);
        const ls = JSON.parse(localStorage.getItem('abdu_posts') || 'null');
        posts = (ls && ls.length) ? ls : defaultPosts;
    }

    // Admin holatini tiklash — sahifa yangilanganda ham admin tugmalari
    // (Yozish, Floating +) faqat admin uchun ko'rinishi uchun
    if (isAdmin) {
        document.body.classList.add('admin-mode');
        const navPortfolioLink = document.getElementById('nav-portfolio-link');
        if (navPortfolioLink) navPortfolioLink.style.display = 'inline-flex';
    }

    renderPosts();
    checkPortfolioAccess();
    initScrollReveal();
    registerServiceWorker();
    openPostFromUrl();

    // Yangi: hero particles + footer particles + CTA tugmasi + 3D tilt + Floating +
    // initParticles(); // Performance optimization
    // initFooterParticles(); // Performance optimization
    initCarousel();
    initHeroCta();
    // init3DTilt(); // Performance optimization
    initFloatingAddBtn();

    // O'quvchi auth — token bo'lsa tiklaymiz, UI'ni yangilaymiz
    initAuthUI();
    if (window.Auth) {
        await Auth.restore();
        updateAuthUI();
    }
}

bootstrap();




