// ============================================================
// ABDUGOFFOROV — PRO AI LAB CONTROLLER
// Handles Variant Switching, 3D Tilt, Audio Equalizer & Spotlights
// ============================================================

(function() {
    'use strict';

    const TITLES = {
        prism: '✦ PRISM LUX (Apple Vision Pro & Linear)',
        aurora: '🌌 QUANTUM AURORA (OpenAI & Perplexity)',
        atelier: '🏛️ SWISS ATELIER (Stripe Press & Arc)'
    };

    // 1. Variant almashtirish funksiyasi
    function setVariant(variant, silent = false) {
        if (!variant || !['prism', 'aurora', 'atelier'].includes(variant)) {
            variant = 'aurora';
        }

        // HTML va Body atributlarini yangilash
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.setAttribute('data-light-variant', variant);

        if (document.body) {
            document.body.setAttribute('data-theme', 'light');
            document.body.setAttribute('data-light-variant', variant);
        }

        // Mahalliy xotirada saqlash
        try {
            localStorage.setItem('kay_theme', 'light');
            localStorage.setItem('kay_pro_variant', variant);
        } catch(e) {}

        // Lab tablarini yangilash (prototype.html)
        document.querySelectorAll('.lab-tab').forEach(tab => {
            const isTarget = tab.id === 'tab-' + variant || tab.getAttribute('data-variant') === variant;
            tab.classList.toggle('active', isTarget);
        });

        // AI Lab drawer tugmalarini yangilash (index.html)
        document.querySelectorAll('.ai-variant-btn').forEach(btn => {
            const isTarget = btn.getAttribute('data-v') === variant;
            btn.classList.toggle('active', isTarget);
        });

        // Agar asosiy saytda bo'lsa, mavzu tugmasini yangilash
        if (typeof window.updateThemeButton === 'function') {
            window.updateThemeButton('light');
        }

        if (!silent) {
            showToast(`Faollashtirildi: ${TITLES[variant] || variant}`);
        }
    }

    // 2. Toast bildirishnomasi
    function showToast(msg) {
        let toast = document.getElementById('lab-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'lab-toast';
            toast.className = 'lab-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    }

    // 3. Asosiy saytga yo'naltirish
    function applyVariantToSite() {
        const current = document.documentElement.getAttribute('data-light-variant') || 'aurora';
        try {
            localStorage.setItem('kay_pro_variant', current);
            localStorage.setItem('kay_theme', 'light');
        } catch(e) {}
        showToast(`✅ ${current.toUpperCase()} varianti asosiy saytga o'tkazildi! index.html ga o'tilmoqda...`);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    }

    // 4. Hikmatlar demo aylanishi
    const DEMO_QUOTES = [
        {
            q: "“Yiqilishdan qo'rqma, qayta turmaslikdan qo'rq. Haqiqiy kuch har yiqilganda qayta ko'tarilishdadir.”",
            a: "Konfutsiy",
            de: "„Der größte Ruhm im Leben liegt darin, jedes Mal wieder aufzustehen.“",
            c: "KUN HIKMATI · FILOSOFIYA"
        },
        {
            q: "“Vaqtingiz cheklangan, shuning uchun uni boshqalarning hayotini yashashga sarflamang.”",
            a: "Steve Jobs",
            de: "„Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.“",
            c: "KUN HIKMATI · INNOVATSIYA"
        },
        {
            q: "“Qiyinchiliklar insonni sindirish uchun emas, balki uning ichki qudratini uyg'otish uchun keladi.”",
            a: "Goethe",
            de: "„Schwierigkeiten sind da, um überwunden zu werden und den Charakter zu stärken.“",
            c: "KUN HIKMATI · ADABIYOT"
        }
    ];
    let demoQIdx = 0;
    function nextDemoQuote() {
        demoQIdx = (demoQIdx + 1) % DEMO_QUOTES.length;
        const quote = DEMO_QUOTES[demoQIdx];
        const textEl = document.getElementById('demo-quote-text');
        const authorEl = document.getElementById('demo-quote-author');
        const deEl = document.getElementById('demo-quote-de');
        const catEl = document.getElementById('demo-quote-cat');
        if (textEl) textEl.textContent = quote.q;
        if (authorEl) authorEl.textContent = quote.a;
        if (deEl) deEl.textContent = quote.de;
        if (catEl) catEl.textContent = quote.c;
    }

    // 5. Audio Player demo
    let isAudioPlaying = false;
    function toggleAudioDemo() {
        isAudioPlaying = !isAudioPlaying;
        const btn = document.getElementById('demo-audio-btn');
        const label = document.getElementById('demo-audio-label');
        const icon = document.getElementById('demo-play-icon');

        if (!btn) return;

        if (isAudioPlaying) {
            btn.classList.add('playing');
            if (label) label.textContent = "Ijro etilmoqda...";
            if (icon) icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';

            if ('speechSynthesis' in window) {
                const deEl = document.getElementById('demo-quote-de');
                const deText = deEl ? deEl.textContent : "Der größte Ruhm im Leben liegt darin, jedes Mal wieder aufzustehen.";
                const utter = new SpeechSynthesisUtterance(deText);
                utter.lang = 'de-DE';
                utter.onend = () => toggleAudioDemo();
                utter.onerror = () => toggleAudioDemo();
                window.speechSynthesis.speak(utter);
            }
        } else {
            btn.classList.remove('playing');
            if (label) label.textContent = "Talaffuzni eshitish";
            if (icon) icon.innerHTML = '<polygon points="6 3 20 12 6 21 6 3"/>';
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }
    }

    // 6. Chronometer Soat
    function updateDemoClock() {
        const hEl = document.getElementById('demo-h');
        const mEl = document.getElementById('demo-m');
        const sEl = document.getElementById('demo-s');
        const dEl = document.getElementById('demo-date');
        if (!hEl || !mEl || !sEl) return;

        const now = new Date();
        hEl.textContent = String(now.getHours()).padStart(2, '0');
        mEl.textContent = String(now.getMinutes()).padStart(2, '0');
        sEl.textContent = String(now.getSeconds()).padStart(2, '0');
        if (dEl) {
            const d = String(now.getDate()).padStart(2, '0');
            const mo = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear();
            dEl.textContent = `${d}.${mo}.${y}`;
        }
    }

    // 7. 3D Tilt & Mouse Spotlight Logic
    function initSpotlights() {
        const cards = document.querySelectorAll('.post-card, .hero-card-surface, .fortune-card-3d, .atelier-quote-card');
        cards.forEach(card => {
            card.classList.add('ai-spotlight', 'tilt-card');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Global eksportlar
    window.setVariant = setVariant;
    window.applyProVariant = setVariant;
    window.applyVariantToSite = applyVariantToSite;
    window.nextDemoQuote = nextDemoQuote;
    window.toggleAudioDemo = toggleAudioDemo;
    window.showToast = showToast;

    // Hodisalarni boshlash
    function init() {
        // Kliklar uchun delegatsiya (CSP inline onclick cheklovlarini to'liq aylanib o'tadi)
        document.addEventListener('click', (e) => {
            // Lab tablar (prototype.html)
            const labTab = e.target.closest('.lab-tab');
            if (labTab) {
                e.preventDefault();
                const variant = labTab.id.replace('tab-', '') || labTab.getAttribute('data-variant');
                setVariant(variant);
                return;
            }

            // AI Lab drawer tugmalari (index.html)
            const variantBtn = e.target.closest('.ai-variant-btn');
            if (variantBtn) {
                e.preventDefault();
                const v = variantBtn.getAttribute('data-v');
                setVariant(v);
                const fab = document.getElementById('ai-lab-fab');
                if (fab) fab.classList.remove('open');
                return;
            }

            // AI Lab trigger tugmasi (index.html)
            const trigger = e.target.closest('#ai-lab-trigger');
            if (trigger) {
                e.preventDefault();
                const fab = document.getElementById('ai-lab-fab');
                if (fab) fab.classList.toggle('open');
                return;
            }

            // Saytga o'tkazish tugmasi
            const applyBtn = e.target.closest('.lab-btn-apply');
            if (applyBtn) {
                e.preventDefault();
                applyVariantToSite();
                return;
            }

            // Audio demo
            const audioBtn = e.target.closest('#demo-audio-btn');
            if (audioBtn) {
                e.preventDefault();
                toggleAudioDemo();
                return;
            }
        });

        // Boshlang'ich saqlangan variantni yuklash
        const savedVariant = localStorage.getItem('kay_pro_variant') || 'prism';
        setVariant(savedVariant === 'aurora' ? 'prism' : savedVariant, true);

        // Soatni yangilash
        setInterval(updateDemoClock, 1000);
        updateDemoClock();

        // Spotlightlarni ishga tushirish
        initSpotlights();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
