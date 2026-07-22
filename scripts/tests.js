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
// ===== DEUTSCH TESTS MOVED TO data-tests.js =====

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
                { id: 'a1_t3', name: "3-to'plam", note: "So'z + grammatika" },
                { id: 'a1_t4', name: "4-to'plam", note: "Kundalik hayot" },
                { id: 'a1_t5', name: "5-to'plam", note: "Manzil va yo'nalish" },
                { id: 'a1_t6', name: "6-to'plam", note: "Tanishish va suhbat" },
                { id: 'a1_t7', name: "7-to'plam", note: "Ob-havo va tabiat" },
                { id: 'a1_t8', name: "8-to'plam", note: "Kasblar va ish" },
                { id: 'a1_t9', name: "9-to'plam", note: "Oila va bayramlar" },
                { id: 'a1_t10', name: "10-to'plam", note: "Umumiy takrorlash" }
            ]
        },
        {
            key: 'A2', icon: '🌿', label: "A2 — Asosiy daraja",
            sub: "Perfekt, modal fe'llar, predloglar",
            tests: [
                { id: 'a2_t1', name: "1-to'plam", note: "Grammatika asoslari" },
                { id: 'a2_t2', name: "2-to'plam", note: "Predloglar va fe'llar" },
                { id: 'a2_t3', name: "3-to'plam", note: "Bog'lovchilar va qiyos" },
                { id: 'a2_t4', name: "4-to'plam", note: "Sog'liq va tana" },
                { id: 'a2_t5', name: "5-to'plam", note: "Sayohat va mehmonxona" },
                { id: 'a2_t6', name: "6-to'plam", note: "Ish va kasb" },
                { id: 'a2_t7', name: "7-to'plam", note: "Xarid va narxlar" },
                { id: 'a2_t8', name: "8-to'plam", note: "Xobbi va bo'sh vaqt" },
                { id: 'a2_t9', name: "9-to'plam", note: "Madaniyat va odatlar" },
                { id: 'a2_t10', name: "10-to'plam", note: "Murakkab mashqlar" }
            ]
        },
        {
            key: 'B1', icon: '🌳', label: "B1 — O'rta daraja",
            sub: "Konjunktiv, Passiv, nisbiy gaplar",
            tests: [
                { id: 'b1_t1', name: "1-to'plam", note: "Konjunktiv va Passiv" },
                { id: 'b1_t2', name: "2-to'plam", note: "Bog'lovchi va nisbiy gap" },
                { id: 'b1_t3', name: "3-to'plam", note: "Genitiv va iboralar" },
                { id: 'b1_t4', name: "4-to'plam", note: "Plusquamperfekt va vaqt" },
                { id: 'b1_t5', name: "5-to'plam", note: "N-deklination, otlar" },
                { id: 'b1_t6', name: "6-to'plam", note: "Partizip sifatlari" },
                { id: 'b1_t7', name: "7-to'plam", note: "Media va texnologiya" },
                { id: 'b1_t8', name: "8-to'plam", note: "Atrof-muhit va tabiat" },
                { id: 'b1_t9', name: "9-to'plam", note: "Karyera va muvaffaqiyat" },
                { id: 'b1_t10', name: "10-to'plam", note: "B1 imtihoniga tayyorgarlik" }
            ]
        },
        {
            key: 'B2', icon: '🏔️', label: "B2 — Yuqori-o'rta daraja",
            sub: "Murakkab gaplar, idiomalar, matn",
            tests: [
                { id: 'b2_t1', name: "1-to'plam", note: "Konjunktiv I" },
                { id: 'b2_t2', name: "2-to'plam", note: "Murakkab gaplar" },
                { id: 'b2_t3', name: "3-to'plam", note: "Akademik so'zlar" },
                { id: 'b2_t4', name: "4-to'plam", note: "Idiomalar va madaniyat" },
                { id: 'b2_t5', name: "5-to'plam", note: "Ilm-fan va kashfiyotlar" },
                { id: 'b2_t6', name: "6-to'plam", note: "Iqtisodiyot va bozor" },
                { id: 'b2_t7', name: "7-to'plam", note: "Adabiyot va san'at" },
                { id: 'b2_t8', name: "8-to'plam", note: "Siyosat va huquq" },
                { id: 'b2_t9', name: "9-to'plam", note: "Psixologiya va munosabatlar" },
                { id: 'b2_t10', name: "10-to'plam", note: "B2 daraja testlari" }
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
            <p class="deutsch-sub">4 daraja &middot; jami 25 ta test</p>
            <div style="margin-top:16px;">
                <button class="btn-primary" style="background:linear-gradient(135deg, #ef4444, #991b1b); border:none; padding:12px 24px; font-weight:700; box-shadow:0 4px 15px rgba(239,68,68,0.4);" onclick="openHorrorHome()">
                    💀 HORROR DEUTSCH — Adrenalin Rejimi
                </button>
            </div>
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
    wrongQuestions = [];
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

let wrongQuestions = [];

function checkAnswer(selected) {
    if (answered) return;
    answered = true;

    const section = currentTest.parts[currentPart].sections[currentSection];
    const q = section.questions[currentQuestion];
    const isCorrect = selected === q.answer;
    if (isCorrect) {
        score++;
    } else {
        wrongQuestions.push({
            q: q.q,
            userAns: q.options[selected],
            correctAns: q.options[q.answer],
            explanation: q.explanation
        });
    }

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

    let mistakesHTML = '';
    if (wrongQuestions.length > 0) {
        mistakesHTML = `
            <div class="post-card" style="padding:24px; margin-top:24px; text-align:left;">
                <h3 style="font-size:16px; color:#ef4444; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                    ❌ Xatolar tahlili (${wrongQuestions.length} ta savol)
                </h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${wrongQuestions.map((w, idx) => `
                        <div style="background:var(--tag-bg); padding:14px; border-radius:10px; font-size:13px; border-left:3px solid #ef4444;">
                            <div style="font-weight:600; margin-bottom:4px; color:var(--text-primary);">${idx+1}. ${escapeHTML(w.q)}</div>
                            <div style="color:#ef4444; margin-bottom:2px;">Sizning javobingiz: <s>${escapeHTML(w.userAns)}</s></div>
                            <div style="color:#22c55e; font-weight:500;">To'g'ri javob: ${escapeHTML(w.correctAns)}</div>
                            <div style="color:var(--text-muted); font-size:12px; margin-top:4px;">💡 ${escapeHTML(w.explanation)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    document.getElementById('deutsch-content').innerHTML = `
        <div style="max-width:540px; margin:0 auto; text-align:center;">
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

            ${mistakesHTML}

            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:24px;">
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
                <span style="font-size:13px;color:var(--text-secondary);">${num} / ${total} &nbsp;-&nbsp; ✅ ${tState.score}</span>
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

window.renderFlashcardDone = renderFlashcardDone;
window.createParticleCanvas = createParticleCanvas;
window.initParticles = initParticles;
window.initFooterParticles = initFooterParticles;
window.initCarousel = initCarousel;
window.runTypewriter = runTypewriter;
window.initHeroCta = initHeroCta;
window.init3DTilt = init3DTilt;
window.emojiImage = emojiImage;
window.renderDeutschHome = renderDeutschHome;
window.startTest = startTest;
window.renderPartIntro = renderPartIntro;
window.startPart = startPart;
window.speakText = speakText;
window.renderQuestion = renderQuestion;
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
window.renderTestResult = renderTestResult;
window._tShuffle = _tShuffle;
window.buildTournamentQuestions = buildTournamentQuestions;
window.renderTournamentHome = renderTournamentHome;
window.startTournamentGame = startTournamentGame;
window.renderTournamentQ = renderTournamentQ;
window.tournamentAnswer = tournamentAnswer;
window.tournamentNext = tournamentNext;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.setAuthMode = setAuthMode;
window.updateAuthUI = updateAuthUI;
window.initAuthUI = initAuthUI;
window.openMyResults = openMyResults;
window.flashcardDecks = flashcardDecks;
window.deutschTests = deutschTests;


// ===== HAMBURGER MENU =====
window.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    
    if (hamburgerBtn && hamburgerMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
        });
        
        // Tashqariga bosilganda yopish
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
            }
        });
    }
});




