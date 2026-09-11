// ===== KARTOCHKALAR HOLATI VA KO'RINISHI =====
let fcDeckKey = null;
let fcOrder = [];
let fcIndex = 0;
let fcDeckFilter = 'all';
let fcSearchQuery = '';
let _fcSearchTimer = null;

const FC_ALL_DECKS = [
    { key: 'de_uz', i: 'deck.de_uz' },
    { key: 'uz_de', i: 'deck.uz_de' },
    { key: 'grammar', i: 'deck.grammar' },
    { key: 'sentences', i: 'deck.sentences' },
    { key: 'quotes', i: 'deck.quotes' },
    { key: 'ueber_mich', i: 'deck.ueber_mich' }
];

function renderFlashcardsGridHTML() {
    const q = (fcSearchQuery || '').trim().toLowerCase();
    const activeDeck = fcDeckFilter || 'all';

    const hl = (txt) => {
        if (!q || typeof window.SearchEngine === 'undefined') return (typeof escapeHTML === 'function' ? escapeHTML(txt) : txt);
        return window.SearchEngine.highlight(txt, q);
    };

    // SEARCH MODE: Agar qidiruv so'zi kiritilgan bo'lsa, barcha kartalar ichidan qidiramiz
    if (q) {
        let matchedCards = [];
        const targetDecks = activeDeck === 'all' ? FC_ALL_DECKS.map(d => d.key) : [activeDeck];

        targetDecks.forEach(dKey => {
            const deck = flashcardDecks[dKey] || [];
            const deckInfo = FC_ALL_DECKS.find(d => d.key === dKey);
            const deckName = deckInfo && window.i18n ? i18n.t(deckInfo.i) : dKey;

            deck.forEach((card, idx) => {
                const f = card.front || '';
                const b = card.back || '';
                const fNorm = typeof window.SearchEngine !== 'undefined' ? window.SearchEngine.normalize(f) : f.toLowerCase();
                const bNorm = typeof window.SearchEngine !== 'undefined' ? window.SearchEngine.normalize(b) : b.toLowerCase();
                const qNorm = typeof window.SearchEngine !== 'undefined' ? window.SearchEngine.normalize(q) : q;

                if (fNorm.includes(qNorm) || bNorm.includes(qNorm)) {
                    matchedCards.push({
                        deckKey: dKey,
                        deckName: deckName,
                        cardIndex: idx,
                        front: f,
                        back: b
                    });
                }
            });
        });

        if (matchedCards.length === 0) {
            return `
                <div class="empty-state" style="grid-column: 1 / -1; margin-top: 20px;">
                    <span class="empty-state-icon">🔍</span>
                    <p class="empty-state-text">"${typeof escapeHTML === 'function' ? escapeHTML(q) : q}" bo'yicha hech qanday so'z yoki kartochka topilmadi.</p>
                </div>
            `;
        }

        return `
            <div style="margin-bottom: 12px; font-size: 14px; color: var(--text-secondary);">
                🎯 Topildi: <b>${matchedCards.length}</b> ta so'z kartochkasi
            </div>
            <div class="fc-result-grid">
                ${matchedCards.map(c => `
                    <div class="fc-search-card" data-click="startFlashcardAt('${c.deckKey}', ${c.cardIndex})">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                            <span class="search-type-badge badge-type-fc">${escapeHTML(c.deckName)}</span>
                            <button class="btn-icon" style="width: 28px; height: 28px; font-size: 13px;" title="Ovozli eshitish" data-click="speakGermanText('${escapeHTML(c.deckKey === 'uz_de' ? c.back : c.front).replace(/'/g, "\\'")}', event)">🔊</button>
                        </div>
                        <div class="fc-search-front">${hl(c.front)}</div>
                        <div class="fc-search-back">${hl(c.back)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // DECK GRID MODE: Oddiy to'plamlar ro'yxati
    let filteredDecks = FC_ALL_DECKS;
    if (activeDeck !== 'all') {
        filteredDecks = FC_ALL_DECKS.filter(d => d.key === activeDeck);
    }

    return `
        <div class="fc-deck-grid">
            ${filteredDecks.map(d => `
                <div class="post-card fc-deck-card" data-click="startFlashcards('${d.key}')" style="animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                    <div class="fc-deck-emoji">${i18n.t(d.i).split(' ')[0]}</div>
                    <h3>${i18n.t(d.i)}</h3>
                    <span class="fc-deck-count">${fcMasteredCount(d.key)} / ${flashcardDecks[d.key] ? flashcardDecks[d.key].length : 0}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function updateFlashcardsView() {
    const container = document.getElementById('fc-grid-container');
    if (container) {
        container.innerHTML = renderFlashcardsGridHTML();
    }
}

function setFcDeckFilter(dk) {
    fcDeckFilter = dk;
    const filterContainer = document.getElementById('fc-deck-filters');
    if (filterContainer) {
        filterContainer.querySelectorAll('.filter-tag').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-deck') === dk);
        });
    }
    updateFlashcardsView();
}

function startFlashcardAt(key, targetIndex) {
    if (!flashcardDecks[key]) return;
    fcDeckKey = key;
    const len = flashcardDecks[key].length;
    fcOrder = Array.from({ length: len }, (_, i) => i);
    // Move targetIndex to front
    const pos = fcOrder.indexOf(targetIndex);
    if (pos > -1) {
        fcOrder.splice(pos, 1);
        fcOrder.unshift(targetIndex);
    }
    fcIndex = 0;
    renderFlashcard();
}

function renderFlashcardsHome() {
    const view = document.getElementById('flashcards-content');
    if (!view) return;

    view.innerHTML = `
        <div style="text-align:center; margin-bottom:28px;">
            <div style="font-size:48px; margin-bottom:12px;">🃏</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:28px; margin-bottom:8px;">${i18n.t('fc.title')}</h2>
            <p style="color:var(--text-secondary);">${i18n.t('fc.subtitle')}</p>
            <div style="margin-top:14px; display:inline-flex; gap:10px; align-items:center; background:var(--tag-bg); padding:8px 16px; border-radius:30px; font-size:13px;">
                🔥 <b>${getFcStreak()}</b> kunlik streak
            </div>
        </div>

        <!-- Flashcards Qidiruv va To'plam Filtrlari -->
        <div class="fc-search-box">
            <input type="text" id="flashcard-search-input" class="search-input" placeholder="🔍 Kartochkalar ichidan so'z qidirish (150+ so'z)..." value="${escapeAttr(fcSearchQuery)}">
        </div>

        <div class="fc-deck-filters" id="fc-deck-filters">
            <button class="filter-tag ${fcDeckFilter === 'all' ? 'active' : ''}" data-deck="all" data-click="setFcDeckFilter('all')">✨ Barchasi</button>
            <button class="filter-tag ${fcDeckFilter === 'de_uz' ? 'active' : ''}" data-deck="de_uz" data-click="setFcDeckFilter('de_uz')">🇩🇪→🇺🇿 Nemischa-O'zbekcha</button>
            <button class="filter-tag ${fcDeckFilter === 'uz_de' ? 'active' : ''}" data-deck="uz_de" data-click="setFcDeckFilter('uz_de')">🇺🇿→🇩🇪 O'zbekcha-Nemischa</button>
            <button class="filter-tag ${fcDeckFilter === 'grammar' ? 'active' : ''}" data-deck="grammar" data-click="setFcDeckFilter('grammar')">📐 Grammatika</button>
            <button class="filter-tag ${fcDeckFilter === 'sentences' ? 'active' : ''}" data-deck="sentences" data-click="setFcDeckFilter('sentences')">💬 Gaplar</button>
            <button class="filter-tag ${fcDeckFilter === 'quotes' ? 'active' : ''}" data-deck="quotes" data-click="setFcDeckFilter('quotes')">🏛️ Iqtiboslar</button>
            <button class="filter-tag ${fcDeckFilter === 'ueber_mich' ? 'active' : ''}" data-deck="ueber_mich" data-click="setFcDeckFilter('ueber_mich')">🙋‍♂️ O'zim haqimda</button>
        </div>

        <div id="fc-grid-container">
            ${renderFlashcardsGridHTML()}
        </div>
    `;

    // Debounced real-time search input listener
    const fcInput = document.getElementById('flashcard-search-input');
    if (fcInput) {
        fcInput.addEventListener('input', (e) => {
            fcSearchQuery = e.target.value;
            if (_fcSearchTimer) clearTimeout(_fcSearchTimer);
            _fcSearchTimer = setTimeout(() => {
                updateFlashcardsView();
            }, 50); // Instant 50ms debouncing
        });
    }
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

function speakGermanText(text, event) {
    if (event) event.stopPropagation();
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Brauzeringiz ovozli talaffuzni qo'llab-quvvatlamaydi.");
    }
}

function renderFlashcard() {
    const view = document.getElementById('flashcards-content');
    const deck = flashcardDecks[fcDeckKey];
    if (!view || !deck) { renderFlashcardsHome(); return; }
    const card = deck[fcOrder[fcIndex]];
    const germanText = fcDeckKey === 'uz_de' ? card.back : card.front;
    view.innerHTML = `
        <div style="max-width:560px; margin:0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:10px;">
                <button class="btn-secondary btn-sm" data-click="renderFlashcardsHome()">${i18n.t('fc.back')}</button>
                <span style="color:var(--text-muted); font-size:13px;">🔥 ${getFcStreak()} &nbsp;-&nbsp; ${fcIndex + 1} / ${deck.length}</span>
                <button class="btn-secondary btn-sm" data-click="shuffleFlashcards()">${i18n.t('fc.shuffle')}</button>
            </div>
            <div class="flashcard" id="flashcard">
                <div class="flashcard-inner">
                    <div class="flashcard-face flashcard-front">
                        <button class="fc-audio-btn" title="Talaffuzni eshitish" data-click="speakGermanText('${escapeHTML(card.front).replace(/'/g, "\\'")}', event)">🔊</button>
                        <div class="fc-text">${escapeHTML(card.front)}</div>
                        <span class="fc-hint">${i18n.t('fc.tapHint')}</span>
                    </div>
                    <div class="flashcard-face flashcard-back">
                        <button class="fc-audio-btn" title="Talaffuzni eshitish" data-click="speakGermanText('${escapeHTML(card.back).replace(/'/g, "\\'")}', event)">🔊</button>
                        <div class="fc-text">${escapeHTML(card.back)}</div>
                    </div>
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px; margin-top:18px;">
                <button class="btn-secondary" data-click="prevFlashcard()">${i18n.t('fc.prev')}</button>
                <button class="btn-primary" data-click="flipFlashcard()">${i18n.t('fc.flip')}</button>
                <button class="btn-secondary" data-click="nextFlashcard()">${i18n.t('fc.next')}</button>
            </div>
            <div style="display:flex; gap:12px; margin-top:12px;">
                <button class="btn-secondary" style="flex:1; border-color:rgba(248,113,113,0.4); color:#ef4444;" data-click="fcAnswer(false)">✗ Bilmayman</button>
                <button class="btn-primary" style="flex:1; background:#22c55e; border-color:#22c55e; color:#fff;" data-click="fcAnswer(true)">✓ Bilaman</button>
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


