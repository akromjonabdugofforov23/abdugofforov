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


