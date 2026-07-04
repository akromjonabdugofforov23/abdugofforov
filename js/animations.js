



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
);
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
    initParticles();
    initFooterParticles();
    initCarousel();
    initHeroCta();
    init3DTilt();
    initFloatingAddBtn();

    // O'quvchi auth — token bo'lsa tiklaymiz, UI'ni yangilaymiz
    initAuthUI();
    if (window.Auth) {
        await Auth.restore();
        updateAuthUI();
    }
}

bootstrap();


// ===== DEUTSCH TESTLAR =====
// Rasmli savollar uchun ishonchli, o'rnatilgan (data URI) emoji-rasm — tashqi havola talab qilmaydi
function emojiImage(emoji, bg) {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'>"
        + "<rect width='100%' height='100%' fill='" + (bg || '#f3efe0') + "'/>"
        + "<text x='50%' y='53%' font-size='130' text-anchor='middle' dominant-baseline='central'>" + emoji + "</text>"
        + "</svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// ============================================================
// DEUTSCH TESTLAR — 3 daraja, har birida 3 ta to'plam, 10 ta savol
// A1: a1_t1, a1_t2, a1_t3   (A1 — Boshlang'ich)
// A2: a2_t1, a2_t2, a2_t3   (A2 — Asosiy)
// B1: b1_t1, b1_t2, b1_t3   (B1 — O'rta)
// Jami: 9 ta to'plam × 10 ta savol = 90 ta savol
// ============================================================
const deutschTests = {

    // ===== A1 — TO'PLAM 1 (Eshitish + matn aralash) =====
    a1_t1: {
        title: "A1 — 1-to'plam (Eshitish + matn)",
        level: "A1",
        testNo: 1,
        parts: [{
            partNum: 1,
            name: "A1 — 1-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "📝 Salomlashish va asosiy iboralar",
                    type: "text",
                    questions: [
                        { q: "'Wie geht es Ihnen?' savoliga to'g'ri javob qaysi?", options: ["Ich heiße Akrom.", "Mir geht es gut, danke.", "Ich komme aus Usbekistan.", "Ich bin 25 Jahre alt."], answer: 1, explanation: "'Mir geht es gut, danke' = Yaxshi, rahmat. Wie geht es Ihnen? = Qandaysiz? (rasmiy)." },
                        { q: "Kechqurun xayrlashishda qaysi ibora to'g'ri?", options: ["Guten Morgen!", "Guten Tag!", "Guten Abend!", "Auf Wiedersehen!"], answer: 3, explanation: "'Auf Wiedersehen!' = Ko'rishguncha/Xayr. Boshqalari salomlashish iboralari." },
                        { q: "Qaysi gapda artikel to'g'ri ishlatilgan?", options: ["Der Buch ist neu.", "Die Mann ist groß.", "Das Auto ist schnell.", "Ein Frau singt."], answer: 2, explanation: "'das Auto' to'g'ri. das Buch, der Mann, die Frau." }
                    ]
                },
                {
                    name: "🖼️ Rasmli savollar",
                    type: "image",
                    questions: [
                        { q: "Bu mevaning nemischa nomi?", image: emojiImage("🍎"), imageAlt: "Olma", options: ["die Banane", "der Apfel", "die Orange", "die Traube"], answer: 1, explanation: "'der Apfel' = olma. die Banane = banan, die Orange = apelsin." },
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏥"), imageAlt: "Shifoxona", options: ["die Schule", "das Hotel", "das Krankenhaus", "die Bank"], answer: 2, explanation: "'das Krankenhaus' = shifoxona. Krank=kasal + Haus=uy." }
                    ]
                },
                {
                    name: "🔊 Eshitish (Hören)",
                    type: "audio",
                    questions: [
                        { q: "Ovozni eshiting — tarjimasini toping:", audio: "arbeiten", audioLang: "de-DE", displayWord: "arbeiten", options: ["o'ynamoq", "ishlamoq", "o'qimoq", "yurmoq"], answer: 1, explanation: "'arbeiten' = ishlamoq. Ich arbeite = men ishlayman." },
                        { q: "Ovozni eshiting — tarjimasini toping:", audio: "Guten Morgen", audioLang: "de-DE", displayWord: "Guten Morgen", options: ["Xayrli kech", "Xayrli kun", "Xayrli tong", "Xayr"], answer: 2, explanation: "'Guten Morgen' = Xayrli tong. Morgen = ertalab." },
                        { q: "Ovozni eshiting — tarjimasini toping:", audio: "Wie heißen Sie", audioLang: "de-DE", displayWord: "Wie heißen Sie?", options: ["Qandaysiz?", "Qayerdansiz?", "Ismingiz nima?", "Necha yoshsiz?"], answer: 2, explanation: "'Wie heißen Sie?' = Ismingiz nima? (rasmiy)." }
                    ]
                },
                {
                    name: "📝 So'z va grammatika",
                    type: "text",
                    questions: [
                        { q: "Bo'sh joyga mos fe'l: 'Ich ___ Student.'", options: ["bin", "bist", "ist", "sind"], answer: 0, explanation: "'ich bin' = men ...man. sein: ich bin, du bist, er/sie ist." },
                        { q: "Qaysi son 'drei' so'ziga to'g'ri keladi?", options: ["2", "3", "4", "5"], answer: 1, explanation: "'drei' = 3. eins=1, zwei=2, drei=3, vier=4, fünf=5." }
                    ]
                }
            ]
        }]
    },

    // ===== A1 — TO'PLAM 2 (Matn + rasm) =====
    a1_t2: {
        title: "A1 — 2-to'plam (Matn + rasm)",
        level: "A1",
        testNo: 2,
        parts: [{
            partNum: 1,
            name: "A1 — 2-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "📝 Ko'p tanlovli",
                    type: "text",
                    questions: [
                        { q: "'Danke schön!' iborasiga eng mos javob qaysi?", options: ["Bitte schön!", "Tschüss!", "Guten Tag!", "Wie geht's?"], answer: 0, explanation: "'Bitte schön!' = Marhamat / Arzimaydi." },
                        { q: "Qaysi son 'sieben' so'ziga to'g'ri keladi?", options: ["6", "7", "8", "9"], answer: 1, explanation: "'sieben' = 7. sechs=6, sieben=7, acht=8." },
                        { q: "'die Mutter' so'zining ma'nosi?", options: ["ota", "ona", "opa", "aka"], answer: 1, explanation: "'die Mutter' = ona. der Vater = ota." },
                        { q: "To'g'ri artikelni tanlang: ___ Sonne (quyosh).", options: ["der", "die", "das", "den"], answer: 1, explanation: "'die Sonne' — ayol rodida." },
                        { q: "Bo'sh joyga mos fe'l: 'Du ___ aus Deutschland.'", options: ["bin", "bist", "ist", "sind"], answer: 1, explanation: "'du bist' = sen ...san. sein: ich bin, du bist, er/sie ist." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — nemischa toping",
                    type: "image",
                    questions: [
                        { q: "Bu hayvonning nemischa nomi?", image: emojiImage("🐱"), imageAlt: "Mushuk", options: ["der Hund", "die Katze", "das Pferd", "der Vogel"], answer: 1, explanation: "'die Katze' = mushuk. der Hund = it." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("🏠"), imageAlt: "Uy", options: ["die Schule", "das Haus", "die Kirche", "der Garten"], answer: 1, explanation: "'das Haus' = uy. die Schule = maktab." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("☀️", "#fff4d6"), imageAlt: "Quyosh", options: ["der Mond", "der Stern", "die Sonne", "der Regen"], answer: 2, explanation: "'die Sonne' = quyosh. der Mond = oy." },
                        { q: "Bu transport vositasining nemischa nomi?", image: emojiImage("🚗"), imageAlt: "Mashina", options: ["das Fahrrad", "der Bus", "das Auto", "der Zug"], answer: 2, explanation: "'das Auto' = mashina. das Fahrrad = velosiped." },
                        { q: "Bu hafta kunining nemischa nomi?", image: emojiImage("📅"), imageAlt: "Kalendar", options: ["Montag = Dushanba", "Montag = Yakshanba", "Montag = Juma", "Montag = Shanba"], answer: 0, explanation: "'Montag' = Dushanba. Dienstag = Seshanba, Sonntag = Yakshanba." }
                    ]
                }
            ]
        }]
    },

    // ===== A1 — TO'PLAM 3 (So'z boyligi + grammatika) =====
    a1_t3: {
        title: "A1 — 3-to'plam (So'z + grammatika)",
        level: "A1",
        testNo: 3,
        parts: [{
            partNum: 1,
            name: "A1 — 3-to'plam",
            icon: "🌱",
            sections: [
                {
                    name: "📝 Ranglar, sanoq, oila",
                    type: "text",
                    questions: [
                        { q: "'rot' rangi o'zbekchada nima?", options: ["ko'k", "yashil", "qizil", "sariq"], answer: 2, explanation: "'rot' = qizil. blau = ko'k, grün = yashil, gelb = sariq." },
                        { q: "'der Bruder' so'zining ma'nosi?", options: ["aka/uka", "ota", "opa", "ona"], answer: 0, explanation: "'der Bruder' = aka/uka. die Schwester = opa/singil." },
                        { q: "Qaysi son 'zehn' ga to'g'ri keladi?", options: ["8", "9", "10", "11"], answer: 2, explanation: "'zehn' = 10. neun=9, zehn=10, elf=11." },
                        { q: "Ko'plik shaklini tanlang: das Kind → ?", options: ["die Kinder", "die Kind", "der Kinder", "die Kindes"], answer: 0, explanation: "Ko'plikda artikel doim 'die': die Kinder = bolalar." },
                        { q: "Xushmuomalalik so'zi: 'Ich möchte einen Kaffee, ___.'", options: ["bitte", "danke", "nein", "gut"], answer: 0, explanation: "'bitte' = iltimos." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — so'z boyligi",
                    type: "image",
                    questions: [
                        { q: "Bu mevaning nemischa nomi?", image: emojiImage("🍌"), imageAlt: "Banan", options: ["die Banane", "der Apfel", "die Birne", "die Kirsche"], answer: 0, explanation: "'die Banane' = banan." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("📚"), imageAlt: "Kitob", options: ["das Heft", "das Buch", "der Stift", "der Tisch"], answer: 1, explanation: "'das Buch' = kitob. das Heft = daftar, der Stift = qalam." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("💧", "#dbe7f0"), imageAlt: "Suv", options: ["die Milch", "das Wasser", "der Saft", "der Tee"], answer: 1, explanation: "'das Wasser' = suv. die Milch = sut, der Tee = choy." },
                        { q: "Bu kasbning nemischa nomi?", image: emojiImage("👨‍⚕️"), imageAlt: "Shifokor", options: ["der Lehrer", "der Arzt", "der Koch", "der Polizist"], answer: 1, explanation: "'der Arzt' = shifokor. die Ärztin = ayol shifokor." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("⏰", "#f0e6db"), imageAlt: "Soat", options: ["die Uhr", "der Tag", "das Buch", "die Tür"], answer: 0, explanation: "'die Uhr' = soat. Wie spät ist es? = Soat necha bo'ldi?" }
                    ]
                }
            ]
        }]
    },

    // ===== A2 — TO'PLAM 1 (Grammatika asoslari) =====
    a2_t1: {
        title: "A2 — 1-to'plam (Grammatika asoslari)",
        level: "A2",
        testNo: 1,
        parts: [{
            partNum: 1,
            name: "A2 — 1-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝 Perfekt va modal fe'llar",
                    type: "text",
                    questions: [
                        { q: "Perfekt: 'Ich ___ gestern Fußball gespielt.'", options: ["habe", "bin", "hat", "bist"], answer: 0, explanation: "'spielen' Perfektda 'haben' bilan: Ich habe gespielt." },
                        { q: "Modal fe'l: 'Ich ___ heute arbeiten.' (majburiyat)", options: ["muss", "kann", "darf", "will"], answer: 0, explanation: "'müssen' = kerak/majbur. kann = qila olaman, darf = ruxsat." },
                        { q: "Perfektda 'fahren' fe'lining yordamchi fe'li qaysi?", options: ["haben", "sein", "werden", "können"], answer: 1, explanation: "Harakat fe'llari (fahren, gehen) 'sein' oladi: Ich bin gefahren." },
                        { q: "Modal fe'l: 'Du ___ Deutsch sprechen.' (qila olasan)", options: ["musst", "kannst", "darfst", "willst"], answer: 1, explanation: "'können' = qila olmoq. ich kann, du kannst, er kann." },
                        { q: "Perfekt: 'Wir ___ ins Kino gegangen.'", options: ["haben", "sind", "hatten", "waren"], answer: 1, explanation: "'gehen' Perfektda 'sein' oladi: Wir sind gegangen." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — vaziyatlar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏥"), imageAlt: "Shifoxona", options: ["die Apotheke", "das Krankenhaus", "das Rathaus", "die Post"], answer: 1, explanation: "'das Krankenhaus' = shifoxona. die Apotheke = dorixona." },
                        { q: "Bu narsaning nemischa nomi?", image: emojiImage("💊"), imageAlt: "Tabletka", options: ["die Spritze", "die Tablette", "der Verband", "das Pflaster"], answer: 1, explanation: "'die Tablette' = tabletka." },
                        { q: "Ob-havoni nemischa qanday ifodalaymiz?", image: emojiImage("🌧️", "#dbe7f0"), imageAlt: "Yomg'ir", options: ["Es schneit.", "Es regnet.", "Es ist sonnig.", "Es ist windig."], answer: 1, explanation: "'Es regnet' = Yomg'ir yog'yapti." },
                        { q: "Bu kasbning nemischa nomi?", image: emojiImage("🧑‍🍳"), imageAlt: "Oshpaz", options: ["der Lehrer", "der Koch", "der Arzt", "der Fahrer"], answer: 1, explanation: "'der Koch' = oshpaz." },
                        { q: "'Es ist Viertel nach acht.' — soat nechada?", image: emojiImage("⏰", "#f0e6db"), imageAlt: "Soat", options: ["07:45", "08:15", "08:45", "08:30"], answer: 1, explanation: "'Viertel nach acht' = 08:15. nach = keyin." }
                    ]
                }
            ]
        }]
    },

    // ===== A2 — TO'PLAM 2 (Predloglar + ajraladigan fe'llar) =====
    a2_t2: {
        title: "A2 — 2-to'plam (Predloglar va fe'llar)",
        level: "A2",
        testNo: 2,
        parts: [{
            partNum: 1,
            name: "A2 — 2-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝 Predloglar va ajraladigan fe'llar",
                    type: "text",
                    questions: [
                        { q: "To'g'ri predlog: 'Ich fahre ___ Bus zur Arbeit.'", options: ["mit dem", "mit der", "in den", "auf dem"], answer: 0, explanation: "'mit dem Bus' = avtobusda. mit + Dativ; der Bus → dem Bus." },
                        { q: "Ajraladigan fe'l: 'Der Zug fährt um 8 Uhr ___.' (jo'naydi)", options: ["ab", "auf", "an", "aus"], answer: 0, explanation: "'abfahren' = jo'nab ketmoq. 'ab' oxiriga boradi." },
                        { q: "To'g'ri predlog: 'Ich interessiere mich ___ Musik.'", options: ["für", "auf", "an", "mit"], answer: 0, explanation: "'sich interessieren für' = ...ga qiziqmoq." },
                        { q: "Dativ: 'Ich helfe ___ Mann.'", options: ["dem", "den", "der", "das"], answer: 0, explanation: "'helfen' Dativ talab qiladi: der Mann → dem Mann." },
                        { q: "Ajraladigan fe'l: 'Ich ___ um 7 Uhr ___.' (turaman)", options: ["auf / stehe", "stehe / auf", "stehe / ab", "ab / stehe"], answer: 1, explanation: "'aufstehen' = turmoq. Gapda: Ich stehe ... auf." },
                        { q: "To'g'ri predlog: 'Wir warten ___ den Bus.'", options: ["auf", "für", "an", "mit"], answer: 0, explanation: "'warten auf' = ...ni kutmoq. Wir warten auf den Bus." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — kundalik hayot",
                    type: "image",
                    questions: [
                        { q: "Bu mevaning nemischa nomi?", image: emojiImage("🍓"), imageAlt: "Qulupnay", options: ["die Erdbeere", "die Himbeere", "die Kirsche", "die Pflaume"], answer: 0, explanation: "'die Erdbeere' = qulupnay. die Kirsche = gilos." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("✈️", "#dbe7f0"), imageAlt: "Samolyot", options: ["das Auto", "der Zug", "das Flugzeug", "das Schiff"], answer: 2, explanation: "'das Flugzeug' = samolyot. fliegen = uchmoq." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("⚽"), imageAlt: "Futbol to'pi", options: ["der Ball", "das Spiel", "der Sport", "die Mannschaft"], answer: 0, explanation: "'der Ball' = to'p. Fußball = futbol." },
                        { q: "Bu vaziyatning nemischa nomi?", image: emojiImage("❄️", "#dbe7f0"), imageAlt: "Qor", options: ["Es regnet.", "Es schneit.", "Es ist heiß.", "Es ist windig."], answer: 1, explanation: "'Es schneit' = Qor yog'yapti. der Schnee = qor." }
                    ]
                }
            ]
        }]
    },

    // ===== A2 — TO'PLAM 3 (Bog'lovchilar + qiyosiy daraja) =====
    a2_t3: {
        title: "A2 — 3-to'plam (Bog'lovchilar va qiyos)",
        level: "A2",
        testNo: 3,
        parts: [{
            partNum: 1,
            name: "A2 — 3-to'plam",
            icon: "🌿",
            sections: [
                {
                    name: "📝 Bog'lovchilar va qiyosiy daraja",
                    type: "text",
                    questions: [
                        { q: "Qiyosiy daraja: 'Berlin ist ___ als Bonn.' (kattaroq)", options: ["größer", "groß", "am größten", "großer"], answer: 0, explanation: "'größer als' = ...dan kattaroq." },
                        { q: "'weil' bog'lovchisidan keyin fe'l qayerda turadi?", options: ["Boshida", "Ikkinchi o'rinda", "Gap oxirida", "Ahamiyati yo'q"], answer: 2, explanation: "'weil' (chunki) fe'lni gap oxiriga suradi: ..., weil ich müde bin." },
                        { q: "'gestern' so'zi nimani bildiradi?", options: ["Bugun", "Ertaga", "Kecha", "Hozir"], answer: 2, explanation: "'gestern' = kecha. heute = bugun, morgen = ertaga." },
                        { q: "Eng yuqori daraja: 'Das Buch ist ___.' (eng yaxshi)", options: ["gut", "besser", "am besten", "guter"], answer: 2, explanation: "'am besten' = eng yaxshi. gut → besser → am besten." },
                        { q: "Bog'lovchi: 'Ich bleibe zu Hause, ___ ich krank bin.'", options: ["aber", "weil", "und", "oder"], answer: 1, explanation: "'weil' = chunki (sabab)." },
                        { q: "Qiyos: 'Anna ist ___ wie Maria.' (xuddi)", options: ["so groß", "größer", "am größten", "größere"], answer: 0, explanation: "'so ... wie' = xuddi ...dek. Anna ist so groß wie Maria." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — joylar va hodisalar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏫"), imageAlt: "Maktab", options: ["die Universität", "die Schule", "der Kindergarten", "das Büro"], answer: 1, explanation: "'die Schule' = maktab." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("🚲"), imageAlt: "Velosiped", options: ["das Motorrad", "das Fahrrad", "der Roller", "das Skateboard"], answer: 1, explanation: "'das Fahrrad' = velosiped. fahren = yurmoq." },
                        { q: "Bu fasl nemischa qanday?", image: emojiImage("🍂", "#f4e4d4"), imageAlt: "Kuz", options: ["der Frühling", "der Sommer", "der Herbst", "der Winter"], answer: 2, explanation: "'der Herbst' = kuz. der Frühling = bahor, der Sommer = yoz, der Winter = qish." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("✏️"), imageAlt: "Qalam", options: ["das Buch", "der Stift", "das Heft", "der Tisch"], answer: 1, explanation: "'der Stift' = qalam. der Bleistift = oddiy qalam." }
                    ]
                }
            ]
        }]
    },

    // ===== B1 — TO'PLAM 1 (Konjunktiv II + Passiv) =====
    b1_t1: {
        title: "B1 — 1-to'plam (Konjunktiv va Passiv)",
        level: "B1",
        testNo: 1,
        parts: [{
            partNum: 1,
            name: "B1 — 1-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝 Konjunktiv II va Passiv",
                    type: "text",
                    questions: [
                        { q: "Konjunktiv II: 'Wenn ich Zeit ___, würde ich reisen.'", options: ["hätte", "habe", "hatte", "haben"], answer: 0, explanation: "'hätte' — Konjunktiv II (shart mayli). Wenn ich Zeit hätte = Agar vaqtim bo'lganida." },
                        { q: "Passiv: 'Das Haus ___ 1990 gebaut.' (qurilgan edi)", options: ["wurde", "wird", "ist", "war"], answer: 0, explanation: "'wurde gebaut' — Präteritum Passiv: werden + Partizip II." },
                        { q: "Konjunktiv II: 'Ich ___ gerne nach Berlin fahren.'", options: ["würde", "werde", "wurde", "wäre"], answer: 0, explanation: "'würde + fe'l' = istakni bildiradi. Ich würde gerne ... = mamnuniyat bilan ...." },
                        { q: "Passiv Präsens: 'Die E-Mail ___ geschrieben.' (yozilyapti)", options: ["wird", "wurde", "ist", "war"], answer: 0, explanation: "Präsens Passiv: werden + Partizip II. Die E-Mail wird geschrieben." },
                        { q: "Konjunktiv II 'sein': 'Wenn ich reich ___, würde ich helfen.'", options: ["wäre", "war", "bin", "wurde"], answer: 0, explanation: "'wäre' — sein fe'lining Konjunktiv II shakli." },
                        { q: "Passiv Perfekt: 'Das Buch ___ gelesen ___.'", options: ["ist / worden", "hat / worden", "wird / gewesen", "war / werden"], answer: 0, explanation: "Passiv Perfekt: sein + Partizip II + worden. Das Buch ist gelesen worden." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — chuqurroq so'z boyligi",
                    type: "image",
                    questions: [
                        { q: "Bu tibbiy asbobning nemischa nomi?", image: emojiImage("🩺"), imageAlt: "Stetoskop", options: ["das Thermometer", "das Stethoskop", "die Spritze", "der Verband"], answer: 1, explanation: "'das Stethoskop' = stetoskop." },
                        { q: "Bu tadbirning nemischa nomi?", image: emojiImage("🎓"), imageAlt: "Bitiruv", options: ["die Hochzeit", "der Abschluss", "die Beerdigung", "die Geburt"], answer: 1, explanation: "'der Abschluss' = bitiruv/yakunlash." },
                        { q: "Bu favqulodda holatning nemischa nomi?", image: emojiImage("🔥", "#ffe0d6"), imageAlt: "Yong'in", options: ["der Unfall", "das Feuer", "die Flut", "der Sturm"], answer: 1, explanation: "'das Feuer' = olov/yong'in. der Unfall = baxtsiz hodisa." },
                        { q: "Bu hujjatning nemischa nomi?", image: emojiImage("📜"), imageAlt: "Sertifikat", options: ["der Pass", "das Zeugnis", "die Rechnung", "der Brief"], answer: 1, explanation: "'das Zeugnis' = sertifikat/guvohnoma." }
                    ]
                }
            ]
        }]
    },

    // ===== B1 — TO'PLAM 2 (Bog'lovchilar + nisbiy gaplar) =====
    b1_t2: {
        title: "B1 — 2-to'plam (Bog'lovchi va nisbiy gaplar)",
        level: "B1",
        testNo: 2,
        parts: [{
            partNum: 1,
            name: "B1 — 2-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝 Bog'lovchilar va nisbiy gaplar",
                    type: "text",
                    questions: [
                        { q: "Bog'lovchi: 'Es regnete. ___ gingen wir spazieren.' (shunga qaramay)", options: ["Deshalb", "Trotzdem", "Deswegen", "Darum"], answer: 1, explanation: "'trotzdem' = shunga qaramay. deshalb = shuning uchun." },
                        { q: "Nisbiy olmosh: 'Der Mann, ___ dort steht, ist mein Arzt.'", options: ["der", "den", "dem", "das"], answer: 0, explanation: "'der' — Nominativ. Nisbiy olmosh ergash gapda subyekt." },
                        { q: "'obwohl' bog'lovchisi qaysi ma'noni beradi?", options: ["chunki", "shuning uchun", "...ga qaramay", "agar"], answer: 2, explanation: "'obwohl' = ...ga qaramay (garchi). Fe'l ergash gap oxirida." },
                        { q: "Nisbiy olmosh: 'Die Frau, ___ ich helfe, ist Lehrerin.'", options: ["der", "die", "dem", "das"], answer: 0, explanation: "'helfen' Dativ, ayol rod: die Frau → der (Dativ)." },
                        { q: "Bog'lovchi: 'Ich gehe ins Bett, ___ ich müde bin.'", options: ["weil", "aber", "und", "oder"], answer: 0, explanation: "'weil' = chunki (sabab). Fe'l oxiriga boradi." },
                        { q: "'damit' bog'lovchisi nimani ifodalaydi?", options: ["sabab", "qarama-qarshilik", "maqsad", "shart"], answer: 2, explanation: "'damit' = maqsad uchun (toki). Ich lerne, damit ich erfolgreich werde." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — abstrakt tushunchalar",
                    type: "image",
                    questions: [
                        { q: "Bu tushunchaning nemischa nomi?", image: emojiImage("💼"), imageAlt: "Ish", options: ["der Beruf", "die Freizeit", "die Familie", "das Hobby"], answer: 0, explanation: "'der Beruf' = kasb. die Arbeit = ish." },
                        { q: "Bu obyektning nemischa nomi?", image: emojiImage("💰", "#f4e4d4"), imageAlt: "Pul", options: ["das Geld", "die Bank", "die Karte", "der Preis"], answer: 0, explanation: "'das Geld' = pul. das Bargeld = naqd pul." },
                        { q: "Bu tushunchaning nemischa nomi?", image: emojiImage("🌍"), imageAlt: "Yer kurrasi", options: ["die Welt", "das Land", "die Stadt", "der Kontinent"], answer: 0, explanation: "'die Welt' = dunyo. das Land = mamlakat." },
                        { q: "Bu vaziyatning nemischa nomi?", image: emojiImage("📚"), imageAlt: "Kitoblar", options: ["die Bibliothek", "die Buchhandlung", "die Schule", "das Museum"], answer: 0, explanation: "'die Bibliothek' = kutubxona. die Buchhandlung = kitob do'koni." }
                    ]
                }
            ]
        }]
    },

    // ===== B1 — TO'PLAM 3 (Genitiv + nominalizatsiya + iboralar) =====
    b1_t3: {
        title: "B1 — 3-to'plam (Genitiv va iboralar)",
        level: "B1",
        testNo: 3,
        parts: [{
            partNum: 1,
            name: "B1 — 3-to'plam",
            icon: "🌳",
            sections: [
                {
                    name: "📝 Genitiv va so'z boyligi",
                    type: "text",
                    questions: [
                        { q: "Genitiv: 'das Auto ___ Vaters' (otaning mashinasi)", options: ["des", "der", "dem", "den"], answer: 0, explanation: "Genitivda erkak rod: der Vater → des Vaters." },
                        { q: "'sich bewerben' fe'li nimani anglatadi?", options: ["dam olmoq", "ish uchun ariza bermoq", "kasal bo'lmoq", "sayohat qilmoq"], answer: 1, explanation: "'sich bewerben (um/bei)' = ishga ariza topshirmoq. die Bewerbung = ariza." },
                        { q: "'der Termin' so'zining ma'nosi?", options: ["narx", "uchrashuv / qabul vaqti", "manzil", "hujjat"], answer: 1, explanation: "'der Termin' = belgilangan vaqt/uchrashuv." },
                        { q: "Nominalizatsiya: 'schwimmen' → 'das ___'.", options: ["Schwimmen", "Schwimmung", "Geschwimm", "Schwimmer"], answer: 0, explanation: "Fe'lni otga aylantirish: schwimmen → das Schwimmen. Artikel doim 'das'." },
                        { q: "'Je mehr ich lerne, ___ besser verstehe ich.'", options: ["desto", "als", "wie", "denn"], answer: 0, explanation: "'je ... desto ...' = qancha ... shuncha ...." },
                        { q: "To'g'ri predlog: 'Ich freue mich ___ das Wochenende.' (intizorlik)", options: ["auf", "über", "an", "für"], answer: 0, explanation: "'sich freuen auf' = kelajakdagi narsani intizorlik bilan kutmoq." },
                        { q: "'die Krankenversicherung' so'zi nimani bildiradi?", options: ["kasallik tarixi", "tibbiy sug'urta", "retsept", "shifokor"], answer: 1, explanation: "'die Krankenversicherung' = tibbiy sug'urta. Germaniyada majburiy." }
                    ]
                },
                {
                    name: "🖼️ Rasmli — murakkab so'zlar",
                    type: "image",
                    questions: [
                        { q: "Bu joyning nemischa nomi?", image: emojiImage("🏛️"), imageAlt: "Hokimiyat", options: ["das Rathaus", "die Kirche", "das Theater", "das Museum"], answer: 0, explanation: "'das Rathaus' = hokimiyat binosi. Rat = kengash + Haus = uy." },
                        { q: "Bu hujjatning nemischa nomi?", image: emojiImage("🛂"), imageAlt: "Pasport", options: ["der Pass", "der Brief", "der Ausweis", "die Karte"], answer: 0, explanation: "'der Pass' = pasport. der Personalausweis = shaxsiy guvohnoma." },
                        { q: "Bu jarayonning nemischa nomi?", image: emojiImage("🔬"), imageAlt: "Tadqiqot", options: ["die Forschung", "die Bildung", "die Erziehung", "die Lehre"], answer: 0, explanation: "'die Forschung' = tadqiqot. forschen = tadqiq qilmoq." }
                    ]
                }
            ]
        }]
    }
};

// Test holati
let currentTest = null;
let currentLevel = 'a1_t1';
let currentSection = 0;
let currentQuestion = 0;
let score = 0;
let answered = false;

function renderDeutschHome() {
    const view = document.getElementById('deutsch-content');

    // Darajalar va ularning to'plamlari (har birida 10 ta savol)
    const levels = [
        {
            key: 'A1', icon: '🌱', label: "A1 — Boshlang'ich daraja",
            sub: "Salomlashish, raqamlar, asosiy so'zlar",
            tests: [
                { id: 'a1_t1', name: "1-to'plam", note: "Eshitish + matn" },
                { id: 'a1_t2', name: "2-to'plam", note: "Matn + rasm" },
                { id: 'a1_t3', name: "3-to'plam", note: "So'z + grammatika" }
            ]
        },
        {
            key: 'A2', icon: '🌿', label: "A2 — Asosiy daraja",
            sub: "Perfekt, modal fe'llar, predloglar",
            tests: [
                { id: 'a2_t1', name: "1-to'plam", note: "Grammatika asoslari" },
                { id: 'a2_t2', name: "2-to'plam", note: "Predloglar va fe'llar" },
                { id: 'a2_t3', name: "3-to'plam", note: "Bog'lovchilar va qiyos" }
            ]
        },
        {
            key: 'B1', icon: '🌳', label: "B1 — O'rta daraja",
            sub: "Konjunktiv, Passiv, nisbiy gaplar",
            tests: [
                { id: 'b1_t1', name: "1-to'plam", note: "Konjunktiv va Passiv" },
                { id: 'b1_t2', name: "2-to'plam", note: "Bog'lovchi va nisbiy gap" },
                { id: 'b1_t3', name: "3-to'plam", note: "Genitiv va iboralar" }
            ]
        }
    ];

    // Har bir savol soni 10 ta — etibordan chetda qolmasin
    function countQs(testId) {
        const t = deutschTests[testId];
        if (!t) return 0;
        return t.parts.reduce((s, p) => s + p.sections.reduce((s2, sec) => s2 + sec.questions.length, 0), 0);
    }

    const levelsHTML = levels.map(lv => {
        const cards = lv.tests.map(t => {
            const qCount = countQs(t.id);
            return `
                <button class="test-card" onclick="startTest('${t.id}')">
                    <div class="test-card-head">
                        <span class="test-card-name">${t.name}</span>
                        <span class="test-card-badge">${qCount} savol</span>
                    </div>
                    <div class="test-card-note">${t.note}</div>
                    <div class="test-card-cta">Boshlash &rarr;</div>
                </button>`;
        }).join('');
        return `
            <section class="level-block">
                <header class="level-head">
                    <span class="level-icon">${lv.icon}</span>
                    <div>
                        <h3 class="level-title">${lv.label}</h3>
                        <p class="level-sub">${lv.sub}</p>
                    </div>
                </header>
                <div class="test-grid">${cards}</div>
            </section>`;
    }).join('');

    view.innerHTML = `
        <div class="deutsch-hero">
            <div class="deutsch-flag">🇩🇪</div>
            <h2 class="deutsch-title">Nemis tili testlari</h2>
            <p class="deutsch-sub">3 daraja &middot; har birida 3 to'plam &middot; jami 9 ta test</p>
        </div>
        <div class="levels-stack">
            ${levelsHTML}
        </div>
        ${renderTestHistory()}
    `;
}

let currentPart = 0;

function startTest(level) {
    currentTest = deutschTests[level];
    if (!currentTest) return;
    currentLevel = level;
    currentPart = 0;
    currentSection = 0;
    currentQuestion = 0;
    score = 0;
    answered = false;
    renderPartIntro();
}

function renderPartIntro() {
    const part = currentTest.parts[currentPart];
    if (!part) { renderTestResult(); return; }
    const totalQ = part.sections.reduce((s,sec) => s + sec.questions.length, 0);
    const audioNote = currentPart === 1
        ? '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:24px;">Har bir savol uchun nemischa ovoz avtomatik o\'qiladi</p>'
        : '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:24px;">Rasmlar va matnli savollar</p>';
    document.getElementById('deutsch-content').innerHTML =
        '<div style="max-width:480px; margin:0 auto; text-align:center; padding:20px 0;">'
        + '<div style="font-size:48px; margin-bottom:16px;">' + part.icon + '</div>'
        + '<h2 style="font-family:\'Playfair Display\',serif; font-size:24px; margin-bottom:8px;">' + part.name + '</h2>'
        + '<p style="color:var(--text-secondary); margin-bottom:8px;">' + totalQ + ' ta savol</p>'
        + audioNote
        + '<button onclick="startPart()" class="btn-primary" style="padding:14px 32px; font-size:16px;">Boshlash &rarr;</button>'
        + '</div>';
}

function startPart() {
    currentSection = 0;
    currentQuestion = 0;
    renderQuestion();
}

function speakText(text, lang) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang || 'de-DE';
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
}

function renderQuestion() {
    const part = currentTest.parts[currentPart];
    if (!part) { renderTestResult(); return; }
    const section = part.sections[currentSection];
    if (!section) { renderTestResult(); return; }
    const q = section.questions[currentQuestion];
    if (!q) { renderTestResult(); return; }

    const totalQ = part.sections.reduce((s,sec) => s + sec.questions.length, 0);
    const doneQ = part.sections.slice(0, currentSection).reduce((s,sec) => s + sec.questions.length, 0) + currentQuestion;
    const pct = Math.round((doneQ / totalQ) * 100);
    const isLastSection = currentSection === part.sections.length-1;
    const isLast = isLastSection && currentQuestion === section.questions.length-1;
    const sectionType = section.type || 'text';

    // Savol qismi — turga qarab
    let questionHTML = '';
    if (sectionType === 'image' || sectionType === 'image_reverse') {
        questionHTML = `
            <div class="post-card" style="padding:0; overflow:hidden; margin-bottom:16px;">
                <img src="${q.image}" alt="${q.imageAlt}" loading="lazy" decoding="async"
                    style="width:100%; height:200px; object-fit:cover; display:block;">
                <div style="padding:20px;">
                    <p style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--accent-color); margin-bottom:8px;">Savol ${doneQ+1}</p>
                    <h3 style="font-size:17px; line-height:1.5; margin:0;">${q.q}</h3>
                </div>
            </div>`;
    } else if (sectionType === 'audio') {
        questionHTML = `
            <div class="post-card" style="padding:28px; margin-bottom:16px; text-align:center;">
                <p style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--accent-color); margin-bottom:16px;">Savol ${doneQ+1} — 🔊 Hören</p>
                <div style="background:var(--tag-bg); border-radius:16px; padding:24px; margin-bottom:16px;">
                    <div style="font-size:22px; font-weight:700; color:var(--text-primary); margin-bottom:16px; font-family:'Playfair Display',serif;">
                        ${q.displayWord}
                    </div>
                    <button onclick="speakText('${q.audio}', '${q.audioLang}')"
                        style="background:var(--accent-color); color:#000; border:none; border-radius:50px;
                        padding:12px 28px; font-size:15px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">
                        🔊 Eshitish
                    </button>
                </div>
                <p style="font-size:14px; color:var(--text-secondary);">${q.q}</p>
            </div>`;
        // Avtomatik o'qish
        setTimeout(() => speakText(q.audio, q.audioLang), 300);
    } else {
        questionHTML = `
            <div class="post-card" style="padding:28px; margin-bottom:16px;">
                <p style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--accent-color); margin-bottom:12px;">Savol ${doneQ+1}</p>
                <h3 style="font-size:18px; line-height:1.5; margin:0;">${q.q}</h3>
            </div>`;
    }

    const nextLabel = isLast ? "Natijani ko'rish 🏁" : 'Keyingi savol \u2192';
    const optionsHTML = q.options.map((opt, i) =>
        `<button onclick="checkAnswer(${i})" id="opt-${i}"
            style="text-align:left; padding:14px 18px; border-radius:12px; border:1px solid var(--border-color);
            background:var(--card-bg); color:var(--text-primary); cursor:pointer; font-size:15px;
            transition:all 0.2s; display:flex; align-items:center; gap:12px;">
            <span style="width:28px; height:28px; border-radius:50%; background:var(--tag-bg);
            display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0;">
                ${['A','B','C','D'][i]}
            </span>
            ${opt}
        </button>`
    ).join('');

    document.getElementById('deutsch-content').innerHTML = `
        <div style="max-width:640px; margin:0 auto;">
            <div style="margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:13px; color:var(--text-secondary);">${section.name}</span>
                    <span style="font-size:13px; color:var(--text-secondary);">${doneQ+1} / ${totalQ}</span>
                </div>
                <div style="height:4px; background:var(--border-color); border-radius:2px;">
                    <div style="height:4px; background:var(--accent-color); border-radius:2px; width:${pct}%; transition:width 0.3s;"></div>
                </div>
            </div>
            ${questionHTML}
            <div id="options-list" style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                ${optionsHTML}
            </div>
            <div id="explanation-box" style="display:none;"></div>
            <div id="next-btn-wrap" style="display:none; text-align:right; margin-top:16px;">
                <button onclick="nextQuestion()" class="btn-primary">${nextLabel}</button>
            </div>
        </div>
    `;
    answered = false;
}

function checkAnswer(selected) {
    if (answered) return;
    answered = true;

    const section = currentTest.parts[currentPart].sections[currentSection];
    const q = section.questions[currentQuestion];
    const isCorrect = selected === q.answer;
    if (isCorrect) score++;

    // Tugmalar rangini o'zgartirish
    q.options.forEach((_, i) => {
        const btn = document.getElementById('opt-' + i);
        btn.style.cursor = 'default';
        if (i === q.answer) {
            btn.style.background = 'rgba(34,197,94,0.15)';
            btn.style.borderColor = '#22c55e';
            btn.style.color = '#22c55e';
        } else if (i === selected && !isCorrect) {
            btn.style.background = 'rgba(239,68,68,0.15)';
            btn.style.borderColor = '#ef4444';
            btn.style.color = '#ef4444';
        }
    });

    // Izoh
    const box = document.getElementById('explanation-box');
    box.style.display = 'block';
    box.innerHTML = `
        <div style="padding:16px 20px; border-radius:12px; border:1px solid ${isCorrect ? '#22c55e' : '#ef4444'};
            background:${isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'};">
            <p style="font-weight:600; margin-bottom:6px; color:${isCorrect ? '#22c55e' : '#ef4444'};">
                ${isCorrect ? '✅ To\u02BBg\u02BBri!' : '❌ Noto\u02BBg\u02BBri'}
            </p>
            <p style="font-size:14px; color:var(--text-primary); line-height:1.6;">💡 ${q.explanation}</p>
        </div>
    `;

    document.getElementById('next-btn-wrap').style.display = 'block';
}

function nextQuestion() {
    const part = currentTest.parts[currentPart];
    const section = part.sections[currentSection];
    currentQuestion++;
    if (currentQuestion >= section.questions.length) {
        currentSection++;
        currentQuestion = 0;
        if (currentSection >= part.sections.length) {
            // Qism tugadi
            currentPart++;
            currentSection = 0;
            if (currentPart >= currentTest.parts.length) {
                renderTestResult();
            } else {
                renderPartIntro();
            }
            return;
        }
    }
    renderQuestion();
}

function renderTestResult() {
    const total = currentTest.parts.reduce((s,part) => s + part.sections.reduce((s2,sec) => s2 + sec.questions.length, 0), 0);
    const pct = total ? Math.round((score / total) * 100) : 0;
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
    const levelName = (currentTest && currentTest.title) ? currentTest.title : 'test';
    const msg = pct >= 80 ? "Ajoyib natija! Bu darajani yaxshi egallabsiz." 
              : pct >= 60 ? "Yaxshi! Bir oz mashq qilsangiz mukammal boʻladi."
              : "Qoʻrqmang! Qayta oʻrganib, yana sinab koʻring.";

    // Natijani tarixga saqlaymiz (lokal)
    saveTestResult(currentLevel, score, total);

    // Login bo'lgan o'quvchi natijasini serverga ham yuboramiz (admin ko'radi)
    if (window.Auth && Auth.isLoggedIn()) {
        Auth.submitResult({ testId: currentLevel, testTitle: levelName, score: score, total: total })
            .then(r => { if (r && r.ok) showToast('📊 Natija saqlandi', 'success'); });
    }

    document.getElementById('deutsch-content').innerHTML = `
        <div style="max-width:480px; margin:0 auto; text-align:center;">
            <div style="font-size:64px; margin-bottom:16px;">${emoji}</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">Test yakunlandi!</h2>
            <p style="font-size:13px; color:var(--accent-color); margin-bottom:4px; text-transform:uppercase; letter-spacing:1px;">${levelName}</p>
            <p style="color:var(--text-secondary); margin-bottom:32px;">${msg}</p>

            <div class="post-card" style="padding:32px; margin-bottom:24px;">
                <div style="font-size:52px; font-weight:700; color:var(--accent-color); font-family:'Playfair Display',serif;">
                    ${score}/${total}
                </div>
                <div style="font-size:15px; color:var(--text-secondary); margin-top:4px;">${pct}% to'g'ri</div>
                <div style="height:8px; background:var(--border-color); border-radius:4px; margin-top:20px;">
                    <div style="height:8px; background:var(--accent-color); border-radius:4px; width:${pct}%; transition:width 1s;"></div>
                </div>
            </div>

            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                <button onclick="startTest('${currentLevel}')" class="btn-primary">🔄 Qayta boshlash</button>
                <button onclick="renderDeutschHome()" class="btn-secondary">← Testlar</button>
            </div>
        </div>
        ${renderTestHistory()}
    `;
}

// Nav Deutsch havolasi endi pastdagi filtrlar yonidagi tugma orqali ishlaydi
// (yuqoridagi filterTags ishlovchisiga qarang)



// ============================================================
// TURNIR — 30 savol (nemis testlari + kartochkalardan aralash)
// Mehmon ism bilan qatnashadi; ro'yxatdan o'tgan bo'lsa avatar bilan.
// ============================================================
let tState = null;

function _tShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Savollar to'plamini ikkala manbadan yig'adi
function buildTournamentQuestions(count) {
    const pool = [];

    // 1) Nemis testlaridan (allaqachon ko'p tanlovli)
    try {
        Object.values(deutschTests).forEach(test => {
            (test.parts || []).forEach(part => {
                (part.sections || []).forEach(sec => {
                    (sec.questions || []).forEach(q => {
                        if (q.options && q.options.length >= 2 && typeof q.answer === 'number') {
                            pool.push({ q: q.q, image: q.image || null, options: q.options.slice(), answer: q.answer });
                        }
                    });
                });
            });
        });
    } catch (e) {}

    // 2) Kartochkalardan (front -> to'g'ri back + 3 ta chalg'ituvchi)
    try {
        Object.values(flashcardDecks).forEach(deck => {
            if (!Array.isArray(deck) || deck.length < 4) return;
            const backs = deck.map(c => c.back);
            deck.forEach(card => {
                const distractors = _tShuffle(backs.filter(b => b !== card.back)).slice(0, 3);
                if (distractors.length < 3) return;
                const opts = _tShuffle([card.back, ...distractors]);
                pool.push({
                    q: card.front + " — tarjimasi/ma'nosi?",
                    options: opts,
                    answer: opts.indexOf(card.back),
                });
            });
        });
    } catch (e) {}

    return _tShuffle(pool).slice(0, count);
}

function renderTournamentHome() {
    const view = document.getElementById('tournament-content');
    if (!view) return;

    const loggedIn = window.Auth && Auth.isLoggedIn();
    const name = loggedIn ? (Auth.user.name || Auth.user.username) : '';
    const initial = (name || 'M').charAt(0).toUpperCase();

    const playerBlock = loggedIn
        ? `<div class="t-player">
               <span class="t-avatar">${escapeHTML(initial)}</span>
               <div><strong>${escapeHTML(name)}</strong><br><small style="color:var(--text-muted);">@${escapeHTML(Auth.user.username)}</small></div>
           </div>
           <button class="btn-primary t-start-btn" onclick="startTournamentGame()" style="margin-top:16px;">🏆 Turnirni boshlash</button>`
        : `<div class="form-group" style="max-width:320px;margin:0 auto 14px;">
               <label for="t-name-input">Ismingiz (mehmon sifatida)</label>
               <input type="text" id="t-name-input" class="form-input" placeholder="Masalan: Ism" maxlength="40">
           </div>
           <button class="btn-primary t-start-btn" onclick="startTournamentGame()">🏆 Turnirni boshlash</button>
           <p style="font-size:12px;color:var(--text-muted);margin-top:10px;">Ro'yxatdan o'tsangiz — ism va avataringiz bilan, qayta yozmasdan qatnashasiz.
               <a href="#" onclick="openAuthModal('register');return false;" style="color:var(--color-purple-light);">Ro'yxatdan o'tish</a></p>`;

    view.innerHTML = `
        <div class="t-hero">
            <div style="font-size:50px;margin-bottom:8px;">🏆</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:30px;margin-bottom:8px;">Turnir</h2>
            <p style="color:var(--text-secondary);font-size:15px;margin-bottom:6px;">30 ta savol — nemis testlari va kartochkalaridan aralash</p>
            <p style="color:var(--text-muted);font-size:13px;">Eng yaxshi natijangiz reytingga yoziladi</p>
        </div>
        <div class="t-card">
            ${playerBlock}
        </div>
        <div id="t-leaderboard" class="t-card" style="margin-top:18px;">
            <h3 style="font-size:17px;margin-bottom:12px;">📊 Reyting</h3>
            <p style="color:var(--text-muted);font-size:13px;">Yuklanmoqda...</p>
        </div>
    `;
    loadLeaderboard();
}

async function loadLeaderboard() {
    const box = document.getElementById('t-leaderboard');
    if (!box) return;
    try {
        const res = await fetch('/tournament');
        const data = await res.json().catch(() => ({}));
        const lb = (data && data.leaderboard) || [];
        if (!lb.length) {
            box.innerHTML = '<h3 style="font-size:17px;margin-bottom:12px;">📊 Reyting</h3><p style="color:var(--text-muted);font-size:13px;">Hali hech kim qatnashmagan. Birinchi bo\'ling!</p>';
            return;
        }
        const rows = lb.map((e, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '.';
            const init = (e.name || '?').charAt(0).toUpperCase();
            const reg = e.registered ? `<span class="t-badge-reg" title="Ro'yxatdan o'tgan">✓</span>` : '';
            return `<div class="t-lb-row">
                <span class="t-lb-rank">${medal}</span>
                <span class="t-avatar t-avatar-sm">${escapeHTML(init)}</span>
                <span class="t-lb-name">${escapeHTML(e.name)} ${reg}</span>
                <span class="t-lb-score">${e.score}/${e.total}</span>
                <span class="t-lb-pct">${e.pct}%</span>
            </div>`;
        }).join('');
        box.innerHTML = '<h3 style="font-size:17px;margin-bottom:12px;">📊 Reyting (eng yaxshi natijalar)</h3>' + rows;
    } catch (e) {
        box.innerHTML = '<h3 style="font-size:17px;margin-bottom:12px;">📊 Reyting</h3><p style="color:#f87171;font-size:13px;">Reytingni yuklab bo\'lmadi</p>';
    }
}

function startTournamentGame() {
    const loggedIn = window.Auth && Auth.isLoggedIn();
    let name;
    if (loggedIn) {
        name = Auth.user.name || Auth.user.username;
    } else {
        const input = document.getElementById('t-name-input');
        name = (input && input.value.trim()) || '';
        if (!name) {
            if (input) { input.focus(); input.style.borderColor = '#f87171'; }
            return;
        }
    }

    const questions = buildTournamentQuestions(30);
    if (!questions.length) {
        showToast('Savollar topilmadi', 'warn');
        return;
    }
    tState = { questions, idx: 0, score: 0, name, answered: false };
    renderTournamentQ();
}

function renderTournamentQ() {
    const view = document.getElementById('tournament-content');
    if (!view || !tState) return;
    const q = tState.questions[tState.idx];
    if (!q) { renderTournamentResult(); return; }

    const total = tState.questions.length;
    const num = tState.idx + 1;
    const pct = Math.round((tState.idx / total) * 100);

    const optionsHTML = q.options.map((opt, i) =>
        `<button class="t-opt" id="t-opt-${i}" onclick="tournamentAnswer(${i})">
            <span class="t-opt-letter">${['A', 'B', 'C', 'D', 'E'][i] || (i + 1)}</span>
            <span>${escapeHTML(opt)}</span>
        </button>`
    ).join('');

    view.innerHTML = `
        <div style="max-width:640px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:13px;color:var(--text-secondary);">🏆 Turnir</span>
                <span style="font-size:13px;color:var(--text-secondary);">${num} / ${total} &nbsp;·&nbsp; ✅ ${tState.score}</span>
            </div>
            <div style="height:5px;background:var(--glass-border);border-radius:3px;margin-bottom:20px;">
                <div style="height:5px;background:var(--grad-primary);border-radius:3px;width:${pct}%;transition:width 0.3s;"></div>
            </div>
            <div class="t-card" style="margin-bottom:16px;">
                <p style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--color-purple-light);margin-bottom:10px;">Savol ${num}</p>
                <h3 style="font-size:19px;line-height:1.5;margin:0;">${escapeHTML(q.q)}</h3>
            </div>
            <div id="t-options" style="display:flex;flex-direction:column;gap:10px;">
                ${optionsHTML}
            </div>
            <div id="t-next-wrap" style="display:none;text-align:right;margin-top:16px;">
                <button class="btn-primary" onclick="tournamentNext()">${num >= total ? "Natija 🏁" : 'Keyingi →'}</button>
            </div>
        </div>
    `;
    tState.answered = false;
}

function tournamentAnswer(selected) {
    if (!tState || tState.answered) return;
    tState.answered = true;
    const q = tState.questions[tState.idx];
    const correct = selected === q.answer;
    if (correct) tState.score++;

    q.options.forEach((_, i) => {
        const btn = document.getElementById('t-opt-' + i);
        if (!btn) return;
        btn.style.cursor = 'default';
        btn.classList.add('t-opt-disabled');
        if (i === q.answer) btn.classList.add('t-opt-correct');
        else if (i === selected) btn.classList.add('t-opt-wrong');
    });

    const nextWrap = document.getElementById('t-next-wrap');
    if (nextWrap) nextWrap.style.display = 'block';
}

function tournamentNext() {
    if (!tState) return;
    tState.idx++;
    if (tState.idx >= tState.questions.length) renderTournamentResult();
    else renderTournamentQ();
}

async function renderTournamentResult() {
    const view = document.getElementById('tournament-content');
    if (!view || !tState) return;
    const total = tState.questions.length;
    const score = tState.score;
    const pct = Math.round((score / total) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';

    view.innerHTML = `
        <div style="max-width:480px;margin:0 auto;text-align:center;">
            <div style="font-size:64px;margin-bottom:12px;">${emoji}</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:28px;margin-bottom:6px;">Turnir yakunlandi!</h2>
            <p style="color:var(--text-secondary);margin-bottom:24px;">${escapeHTML(tState.name)}</p>
            <div class="t-card" style="padding:30px;margin-bottom:20px;">
                <div style="font-size:50px;font-weight:700;color:var(--color-purple-light);font-family:'Playfair Display',serif;">${score}/${total}</div>
                <div style="font-size:15px;color:var(--text-secondary);margin-top:4px;">${pct}% to'g'ri</div>
                <div id="t-rank-info" style="margin-top:14px;font-size:14px;color:var(--text-muted);">Reytingga yozilmoqda...</div>
            </div>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                <button class="btn-primary" onclick="startTournamentGame()">🔄 Qayta</button>
                <button class="btn-secondary" onclick="renderTournamentHome()">📊 Reyting</button>
            </div>
        </div>
    `;

    // Natijani serverga yuborish (mehmon ham, login ham)
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (window.Auth && Auth.token) headers['x-user-token'] = Auth.token;
        const res = await fetch('/tournament', {
            method: 'POST',
            headers,
            body: JSON.stringify({ name: tState.name, score, total }),
        });
        const data = await res.json().catch(() => ({}));
        const info = document.getElementById('t-rank-info');
        if (info) {
            if (data.ok && data.rank) {
                info.innerHTML = `🏅 Reytingdagi o'rningiz: <b style="color:var(--color-purple-light);">${data.rank}</b> / ${data.totalPlayers}`;
            } else {
                info.textContent = 'Natija saqlandi';
            }
        }
    } catch (e) {
        const info = document.getElementById('t-rank-info');
        if (info) info.textContent = "Natija saqlanmadi (tarmoq xatosi)";
    }
}



// ============================================================
// O'QUVCHI AUTH UI (login / register / profil)
// ============================================================
let _authMode = 'login';

function openAuthModal(mode) {
    _authMode = mode || 'login';
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    setAuthMode(_authMode);
    const err = document.getElementById('auth-error');
    if (err) { err.textContent = ''; err.classList.remove('show'); }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('auth-username')?.focus(), 100);
}
function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}
function setAuthMode(mode) {
    _authMode = mode;
    const isReg = mode === 'register';
    document.getElementById('auth-tab-login')?.classList.toggle('active', !isReg);
    document.getElementById('auth-tab-register')?.classList.toggle('active', isReg);
    const nameGroup = document.getElementById('auth-name-group');
    if (nameGroup) nameGroup.style.display = isReg ? 'flex' : 'none';
    const hint = document.getElementById('auth-username-hint');
    if (hint) hint.style.display = isReg ? 'block' : 'none';
    const submit = document.getElementById('auth-submit');
    if (submit) submit.textContent = isReg ? "Ro'yxatdan o'tish" : 'Kirish';
    const pwd = document.getElementById('auth-password');
    if (pwd) pwd.setAttribute('autocomplete', isReg ? 'new-password' : 'current-password');
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    if (!window.Auth) return;
    if (Auth.isLoggedIn()) {
        const u = Auth.user;
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'inline-flex';
        const initial = (u.name || u.username || '?').charAt(0).toUpperCase();
        const av = document.getElementById('user-avatar');
        if (av) av.textContent = initial;
        const nameLabel = document.getElementById('user-name-label');
        if (nameLabel) nameLabel.textContent = u.name || u.username;
        const ddName = document.getElementById('user-dd-name');
        if (ddName) ddName.textContent = u.name || u.username;
        const ddUser = document.getElementById('user-dd-username');
        if (ddUser) ddUser.textContent = '@' + u.username;
    } else {
        if (loginBtn) loginBtn.style.display = '';
        if (userMenu) userMenu.style.display = 'none';
    }
}

function initAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.addEventListener('click', () => openAuthModal('login'));

    document.getElementById('close-auth-modal')?.addEventListener('click', closeAuthModal);
    document.getElementById('auth-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'auth-modal') closeAuthModal();
    });
    document.getElementById('auth-tab-login')?.addEventListener('click', () => setAuthMode('login'));
    document.getElementById('auth-tab-register')?.addEventListener('click', () => setAuthMode('register'));

    document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const err = document.getElementById('auth-error');
        const submit = document.getElementById('auth-submit');
        const name = document.getElementById('auth-name')?.value.trim() || '';
        const username = document.getElementById('auth-username')?.value.trim() || '';
        const password = document.getElementById('auth-password')?.value || '';
        if (err) { err.textContent = ''; err.classList.remove('show'); }
        if (submit) { submit.disabled = true; submit.textContent = 'Iltimos kuting...'; }

        let data;
        if (_authMode === 'register') data = await Auth.register(name, username, password);
        else data = await Auth.login(username, password);

        if (submit) { submit.disabled = false; submit.textContent = _authMode === 'register' ? "Ro'yxatdan o'tish" : 'Kirish'; }

        if (data && data.ok) {
            closeAuthModal();
            updateAuthUI();
            showToast('✅ Xush kelibsiz, ' + (Auth.user.name || Auth.user.username) + '!', 'success');
        } else if (err) {
            err.textContent = (data && data.message) || 'Xatolik yuz berdi';
            err.classList.add('show');
        }
    });

    const chip = document.getElementById('user-chip');
    const dropdown = document.getElementById('user-dropdown');
    if (chip && dropdown) {
        chip.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('open'); });
        document.addEventListener('click', () => dropdown.classList.remove('open'));
    }
    document.getElementById('user-logout-btn')?.addEventListener('click', async () => {
        await Auth.logout();
        updateAuthUI();
        showToast('Tizimdan chiqdingiz', 'info');
    });
    document.getElementById('user-results-btn')?.addEventListener('click', () => {
        dropdown?.classList.remove('open');
        openMyResults();
    });
    document.getElementById('close-myresults-modal')?.addEventListener('click', () => {
        document.getElementById('myresults-modal')?.classList.remove('active');
        document.body.style.overflow = '';
    });
    document.getElementById('myresults-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'myresults-modal') {
            e.currentTarget.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function openMyResults() {
    const modal = document.getElementById('myresults-modal');
    const content = document.getElementById('myresults-content');
    if (!modal || !content) return;
    const hist = (window.Auth && Auth.getLocalResults) ? Auth.getLocalResults() : [];
    if (!hist.length) {
        content.innerHTML = '<p style="color:var(--text-secondary);">Hali test ishlamadingiz. Nemis testlari yoki Turnirdan boshlang!</p>';
    } else {
        const rows = hist.slice(0, 30).map(h => {
            const d = new Date(h.date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
            const color = h.pct >= 80 ? '#34d399' : h.pct >= 60 ? '#fbbf24' : '#f87171';
            return `<div style="display:flex;align-items:center;gap:10px;font-size:13px;padding:10px 0;border-bottom:1px solid var(--glass-border);">
                <span style="text-transform:uppercase;font-weight:700;width:60px;color:var(--color-purple-light);">${escapeHTML(String(h.level || ''))}</span>
                <div style="flex:1;height:6px;background:var(--glass-border);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:${h.pct}%;background:${color};"></div>
                </div>
                <span style="width:64px;text-align:right;color:var(--text-secondary);">${h.score}/${h.total}</span>
                <span style="width:90px;text-align:right;color:var(--text-muted);font-size:11px;">${d}</span>
            </div>`;
        }).join('');
        content.innerHTML = rows;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}


