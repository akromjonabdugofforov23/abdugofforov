// ============================================================
// INTERAKTIV SUBTITRLI VIDEO-DARSLIK (Click-to-Translate Player)
// Fayl: scripts/video-lesson.js — Modulli mustaqil ta'lim tizimi
// ============================================================
(function() {
    'use strict';

    // 4 ta daraja bo'yicha interaktiv dialoglar bazasi
    const LESSON_SCENARIOS = {
        'A1': {
            id: 'a1_cafe',
            title: 'Kafeda Buyurtma Berish',
            germanTitle: 'Im Café — Bestellen',
            level: 'A1',
            badge: '🌱 A1 Boshlang\'ich',
            description: 'Kafeda o\'tirish, menyu so\'rash, qahva va shirinlik buyurtma qilish hamda hisob-kitob qilish dialogi.',
            duration: 24,
            dialogues: [
                {
                    id: 1, start: 0, end: 5.5, speaker: 'Ober (Ofitsiant)', avatar: '👨‍🍳',
                    de: 'Guten Tag! Was möchten Sie bitte trinken?',
                    uz: 'Xayrli kun! Nimani ichishni istaysiz, iltimos?',
                    words: {
                        'Guten': { uz: 'xayrli', grammar: 'Sifat (akkusativ, erkak)' },
                        'Tag': { uz: 'kun', grammar: 'der Tag, die Tage (Ot, m)' },
                        'Was': { uz: 'nima', grammar: 'So\'roq olmoshi' },
                        'möchten': { uz: 'xohlaysiz / istaysiz', grammar: 'möchten fe\'li (Konjunktiv II)' },
                        'Sie': { uz: 'Siz (hurmat)', grammar: 'Kishilik olmoshi (3-shaxs)' },
                        'bitte': { uz: 'iltimos / marhamat', grammar: 'Odob so\'zi' },
                        'trinken': { uz: 'ichmoq', grammar: 'Infinitiv fe\'l' }
                    }
                },
                {
                    id: 2, start: 5.5, end: 11.5, speaker: 'Anna', avatar: '👩‍💼',
                    de: 'Ich möchte einen Kaffee mit Milch und Zucker.',
                    uz: 'Men sut va shakar bilan bir chashka qahva istardim.',
                    words: {
                        'Ich': { uz: 'men', grammar: 'Kishilik olmoshi (1-shaxs)' },
                        'möchte': { uz: 'xohlardim', grammar: 'möchten (1-shaxs birlik)' },
                        'einen': { uz: 'bir (noaniq artikl)', grammar: 'Akkusativ, erkak jinsi' },
                        'Kaffee': { uz: 'qahva', grammar: 'der Kaffee (Ot, m)' },
                        'mit': { uz: 'bilan', grammar: 'Dativ talab qiluvchi predlog' },
                        'Milch': { uz: 'sut', grammar: 'die Milch (Ot, f)' },
                        'und': { uz: 'va', grammar: 'Bog\'lovchi' },
                        'Zucker': { uz: 'shakar', grammar: 'der Zucker (Ot, m)' }
                    }
                },
                {
                    id: 3, start: 11.5, end: 17.5, speaker: 'Ober (Ofitsiant)', avatar: '👨‍🍳',
                    de: 'Sehr gerne. Möchten Sie auch etwas essen?',
                    uz: 'Jonim bilan. Biror narsa yeyishni ham xohlaysizmi?',
                    words: {
                        'Sehr': { uz: 'juda', grammar: 'Ravish' },
                        'gerne': { uz: 'jon deb / mamnuniyat bilan', grammar: 'Ravish' },
                        'Möchten': { uz: 'xohlaysizmi', grammar: 'Fe\'l (savol gapda 1-o\'rinda)' },
                        'Sie': { uz: 'Siz', grammar: 'Kishilik olmoshi' },
                        'auch': { uz: 'ham', grammar: 'Yuklama' },
                        'etwas': { uz: 'biror narsa', grammar: 'Gumon olmoshi' },
                        'essen': { uz: 'yemoq', grammar: 'Infinitiv fe\'l' }
                    }
                },
                {
                    id: 4, start: 17.5, end: 24, speaker: 'Anna', avatar: '👩‍💼',
                    de: 'Ja, ein Stück Apfelkuchen, bitte.',
                    uz: 'Ha, bir bo\'lak olma pirogi, iltimos.',
                    words: {
                        'Ja': { uz: 'ha', grammar: 'Tasdiq so\'zi' },
                        'ein': { uz: 'bir', grammar: 'Noaniq artikl (neytral)' },
                        'Stück': { uz: 'bo\'lak / parcha', grammar: 'das Stück, die Stücke (Ot, n)' },
                        'Apfelkuchen': { uz: 'olma pirogi', grammar: 'der Apfelkuchen (Murakkab ot: Apfel + Kuchen)' },
                        'bitte': { uz: 'iltimos', grammar: 'Odob so\'zi' }
                    }
                }
            ]
        },
        'A2': {
            id: 'a2_train',
            title: 'Poyezd Chiptasi Xarid Qilish',
            germanTitle: 'Am Bahnhof — Fahrkarte kaufen',
            level: 'A2',
            badge: '🌿 A2 Rivojlanayotgan',
            description: 'Temir yo\'l vokzalida jo\'nash vaqti, poyezd yo\'lagi va chipta narxini surishtirish dialogi.',
            duration: 22,
            dialogues: [
                {
                    id: 1, start: 0, end: 6.0, speaker: 'Reisender (Yo\'lovchi)', avatar: '🧳',
                    de: 'Guten Tag, ich brauche eine Fahrkarte nach München.',
                    uz: 'Xayrli kun, menga Myunxenga borish uchun chipta kerak.',
                    words: {
                        'brauche': { uz: 'kerak / muhtojman', grammar: 'brauchen fe\'li (Präsens, 1-shaxs)' },
                        'eine': { uz: 'bir', grammar: 'Noaniq artikl (feminin akkusativ)' },
                        'Fahrkarte': { uz: 'chipta', grammar: 'die Fahrkarte, -n (Ot, f)' },
                        'nach': { uz: 'tomon / ga', grammar: 'Shahar va mamlakatlarga nisbatan predlog' },
                        'München': { uz: 'Myunxen shahri', grammar: 'Atoqli ot' }
                    }
                },
                {
                    id: 2, start: 6.0, end: 12.0, speaker: 'Bahn-Beamter (Kassir)', avatar: '🎫',
                    de: 'Einfach oder hin und zurück? Haben Sie eine BahnCard?',
                    uz: 'Bir tomongami yoki borish-qaytishgami? BahnCard kartangiz bormi?',
                    words: {
                        'Einfach': { uz: 'bir tomonga / oddiy', grammar: 'Bu kontekstda bir tomonlama chipta' },
                        'oder': { uz: 'yoki', grammar: 'Teng bog\'lovchi' },
                        'hin': { uz: 'u yerga / borish', grammar: 'Yo\'nalish ravishi' },
                        'zurück': { uz: 'qaytish / orqaga', grammar: 'Yo\'nalish ravishi' },
                        'Haben': { uz: 'bormi / ega bo\'lmoq', grammar: 'haben fe\'li (savol shakli)' },
                        'BahnCard': { uz: 'temir yo\'l chegirma kartasi', grammar: 'die BahnCard (Deutsche Bahn xizmati)' }
                    }
                },
                {
                    id: 3, start: 12.0, end: 17.0, speaker: 'Reisender (Yo\'lovchi)', avatar: '🧳',
                    de: 'Hin und zurück, bitte. Nein, ich habe keine BahnCard.',
                    uz: 'Borish va qaytish, iltimos. Yo\'q, menda BahnCard yo\'q.',
                    words: {
                        'Nein': { uz: 'yo\'q', grammar: 'Inkor so\'zi' },
                        'keine': { uz: 'hech qanday / -siz (inkor)', grammar: 'kein inkor artikli (akkusativ)' }
                    }
                },
                {
                    id: 4, start: 17.0, end: 22.0, speaker: 'Bahn-Beamter (Kassir)', avatar: '🎫',
                    de: 'Das macht 58 Euro. Der Zug fährt von Gleis 4 ab.',
                    uz: 'Jami 58 yevro bo\'ladi. Poyezd 4-yo\'lakdan jo\'nab ketadi.',
                    words: {
                        'macht': { uz: 'bo\'ladi / tashkil qiladi', grammar: 'machen fe\'li (narx hisobida)' },
                        'Zug': { uz: 'poyezd', grammar: 'der Zug, die Züge (Ot, m)' },
                        'fährt': { uz: 'harakatlanadi / jo\'naydi', grammar: 'fahren fe\'li (du/er shaklida a -> ä)' },
                        'von': { uz: '-dan', grammar: 'Dativ predlogi' },
                        'Gleis': { uz: 'temir yo\'l perroni / yo\'lagi', grammar: 'das Gleis, -e (Ot, n)' },
                        'ab': { uz: 'jo\'nash prefiksi', grammar: 'abfahren ajraluvchi fe\'l prefiksi' }
                    }
                }
            ]
        },
        'B1': {
            id: 'b1_interview',
            title: 'Ish Suhbatida O\'zini Tanishtirish',
            germanTitle: 'Das Vorstellungsgespräch — Stärken',
            level: 'B1',
            badge: '🌲 B1 Mustaqil',
            description: 'Nemis kompaniyasida ishga kirish suhbati: tajriba, kuchli tomonlar va motivatsiyani tushuntirish.',
            duration: 20,
            dialogues: [
                {
                    id: 1, start: 0, end: 6.0, speaker: 'Interviewer (HR Menejer)', avatar: '💼',
                    de: 'Warum möchten Sie gerade bei unserem Unternehmen arbeiten?',
                    uz: 'Nima uchun aynan bizning kompaniyamizda ishlashni xohlaysiz?',
                    words: {
                        'Warum': { uz: 'nima uchun / sabab', grammar: 'Sabab so\'roq olmoshi' },
                        'gerade': { uz: 'aynan', grammar: 'Kuchaytiruvchi yuklama' },
                        'bei': { uz: '-da / huzurida', grammar: 'Kompaniya va shaxslar bilan dativ' },
                        'unserem': { uz: 'bizning', grammar: 'Egalik olmoshi (Dativ, n)' },
                        'Unternehmen': { uz: 'korxona / kompaniya', grammar: 'das Unternehmen, - (Ot, n)' },
                        'arbeiten': { uz: 'ishlamoq', grammar: 'Infinitiv fe\'l' }
                    }
                },
                {
                    id: 2, start: 6.0, end: 13.0, speaker: 'Bewerber (Nomzod)', avatar: '👨‍💼',
                    de: 'Weil Sie führend in Innovation sind und ich meine Fähigkeiten weiterentwickeln will.',
                    uz: 'Chunki siz innovatsiyada yetakchisiz va men o\'z ko\'nikmalarimni yanada rivojlantirmoqchiman.',
                    words: {
                        'Weil': { uz: 'chunki', grammar: 'Ergashgan gap bog\'lovchisi (fe\'lni oxiriga suradi)' },
                        'führend': { uz: 'yetakchi / oldingi', grammar: 'Sifat' },
                        'Innovation': { uz: 'yangilik / innovatsiya', grammar: 'die Innovation, -en (Ot, f)' },
                        'Fähigkeiten': { uz: 'qobiliyatlar / ko\'nikmalar', grammar: 'die Fähigkeit, -en (Ko\'plik)' },
                        'weiterentwickeln': { uz: 'yanada rivojlantirmoq', grammar: 'Ajraluvchi murakkab fe\'l' },
                        'will': { uz: 'istayman', grammar: 'wollen modal fe\'li (1-shaxs)' }
                    }
                },
                {
                    id: 3, start: 13.0, end: 20.0, speaker: 'Interviewer (HR Menejer)', avatar: '💼',
                    de: 'Das klingt überzeugend. Welche praktischen Erfahrungen bringen Sie mit?',
                    uz: 'Bu juda ishonarli yangramoqda. Qanday amaliy tajribalarni olib kelasiz?',
                    words: {
                        'klingt': { uz: 'yangramoqda / eshitilmoqda', grammar: 'klingen fe\'li (3-shaxs)' },
                        'überzeugend': { uz: 'ishonarli', grammar: 'Sifat / ravish' },
                        'Welche': { uz: 'qanday / qaysi', grammar: 'So\'roq olmoshi (ko\'plik)' },
                        'praktischen': { uz: 'amaliy', grammar: 'Sifat (akkusativ ko\'plik)' },
                        'Erfahrungen': { uz: 'tajribalar', grammar: 'die Erfahrung, -en (Ko\'plik)' },
                        'bringen': { uz: 'keltirmoq', grammar: 'mitbringen ajraluvchi fe\'l' },
                        'mit': { uz: 'birgalikda', grammar: 'mitbringen prefiksi' }
                    }
                }
            ]
        },
        'B2': {
            id: 'b2_eco',
            title: 'Ekologiya va Qayta Ishlash Muhokamasi',
            germanTitle: 'Umweltschutz & Nachhaltigkeit',
            level: 'B2',
            badge: '🏔️ B2 Ilg\'or',
            description: 'Chiqindilarni saralash, qayta ishlash va atrof-muhitni asrash bo\'yicha chuqur munozara.',
            duration: 21,
            dialogues: [
                {
                    id: 1, start: 0, end: 7.0, speaker: 'Lukas', avatar: '🌱',
                    de: 'In Deutschland wird die Mülltrennung als eine gesellschaftliche Pflicht angesehen.',
                    uz: 'Germaniyada chiqindilarni saralash ijtimoiy burch sifatida qaraladi.',
                    words: {
                        'wird': { uz: 'bo\'linadi / qilinadi', grammar: 'Passiv (Vorgangspassiv) yordamchisi' },
                        'Mülltrennung': { uz: 'chiqindilarni saralash', grammar: 'die Mülltrennung (Müll + Trennung)' },
                        'gesellschaftliche': { uz: 'ijtimoiy', grammar: 'Sifat (feminin nominativ)' },
                        'Pflicht': { uz: 'burch / majburiyat', grammar: 'die Pflicht, -en (Ot, f)' },
                        'angesehen': { uz: 'qaralmoq / baholanmoq', grammar: 'ansehen Partizip II' }
                    }
                },
                {
                    id: 2, start: 7.0, end: 14.0, speaker: 'Sophia', avatar: '👩‍🔬',
                    de: 'Stimmt genau. Durch konsequentes Recycling können wertvolle Ressourcen geschont werden.',
                    uz: 'Mutlaqo to\'g\'ri. Izchil qayta ishlash orqali qimmatli resurslarni tejash mumkin.',
                    words: {
                        'Stimmt': { uz: 'to\'g\'ri / mos', grammar: 'stimmen fe\'li' },
                        'genau': { uz: 'aniq / mutlaqo', grammar: 'Ravish' },
                        'Durch': { uz: 'orqali / tufayli', grammar: 'Akkusativ talab qiluvchi predlog' },
                        'konsequentes': { uz: 'izchil / muntazam', grammar: 'Sifat (neytral)' },
                        'Recycling': { uz: 'qayta ishlash', grammar: 'das Recycling (Ot, n)' },
                        'wertvolle': { uz: 'qimmatli', grammar: 'Sifat' },
                        'Ressourcen': { uz: 'resurslar / xomashyo', grammar: 'die Ressource, -n (Ko\'plik)' },
                        'geschont': { uz: 'asralmoq / tejalmoq', grammar: 'schonen Partizip II' }
                    }
                },
                {
                    id: 3, start: 14.0, end: 21.0, speaker: 'Lukas', avatar: '🌱',
                    de: 'Zweifellos. Es erfordert jedoch ein hohes Maß an individuellem Bewusstsein.',
                    uz: 'Shubhasiz. Ammo bu har bir shaxsdan yuksak darajadagi onglilikni talab qiladi.',
                    words: {
                        'Zweifellos': { uz: 'shubhasiz', grammar: 'Kirish so\'z / ravish' },
                        'erfordert': { uz: 'talab etadi', grammar: 'erfordern fe\'li' },
                        'jedoch': { uz: 'ammo / biroq', grammar: 'Bog\'lovchi ravish' },
                        'hohes': { uz: 'yuksak / baland', grammar: 'hoch sifatining tuslanishi' },
                        'Maß': { uz: 'me\'yor / daraja', grammar: 'das Maß, -e (Ot, n)' },
                        'individuellem': { uz: 'shaxsiy / individual', grammar: 'Sifat (Dativ)' },
                        'Bewusstsein': { uz: 'onglilik / tushuncha', grammar: 'das Bewusstsein (Ot, n)' }
                    }
                }
            ]
        }
    };

    let activeLevel = 'A1';
    let isPlaying = false;
    let playbackRate = 1.0;
    let currentDialogueIdx = 0;
    let playTimer = null;
    let popoverEl = null;

    // Yordamchi HTML tozalash
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Talaffuz (Web Speech API)
    function speakGermanText(text) {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(text);
            utt.lang = 'de-DE';
            utt.rate = playbackRate * 0.9;
            window.speechSynthesis.speak(utt);
        } catch (_) {}
    }

    // So'zni shaxsiy lug'atga qo'shish (Leitner SRS / localStorage)
    function saveWordToFlashcards(germanWord, uzbekTranslation, grammarTip) {
        try {
            const customCards = JSON.parse(localStorage.getItem('deutsch_custom_cards') || '[]');
            // Agar oldin qo'shilmagan bo'lsa
            const exists = customCards.some(c => c.front.toLowerCase() === germanWord.toLowerCase());
            if (!exists) {
                customCards.unshift({
                    front: germanWord,
                    back: uzbekTranslation,
                    tip: grammarTip || 'Video-darslikdan qo\'shildi'
                });
                localStorage.setItem('deutsch_custom_cards', JSON.stringify(customCards));
            }

            // Global flashcardDecks ga ham qo'shamiz
            if (window.flashcardDecks && window.flashcardDecks.de_uz) {
                const deckExists = window.flashcardDecks.de_uz.some(c => c.front.toLowerCase() === germanWord.toLowerCase());
                if (!deckExists) {
                    window.flashcardDecks.de_uz.unshift({
                        front: germanWord,
                        back: uzbekTranslation,
                        tip: grammarTip
                    });
                }
            }

            if (window.showToast) {
                window.showToast(`🎴 "${germanWord}" shaxsiy lug'atingizga qo'shildi!`, 'success');
            }
            return true;
        } catch (_) {
            return false;
        }
    }

    // Click-to-Translate Popoverini ko'rsatish
    function showWordPopover(wordSpan, wordInfo, cleanWord) {
        pauseLesson();
        if (!popoverEl) {
            popoverEl = document.createElement('div');
            popoverEl.id = 'click-translate-popover';
            popoverEl.style.cssText = `
                position: fixed; z-index: 10500;
                background: rgba(12, 30, 48, 0.95);
                border: 1px solid rgba(56, 189, 248, 0.4);
                backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
                border-radius: 16px; padding: 14px 18px;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(45, 212, 191, 0.2);
                color: #f8fafc; font-family: 'Inter', sans-serif;
                max-width: 300px; width: 90vw; opacity: 0;
                transform: translateY(-8px); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            `;
            document.body.appendChild(popoverEl);
        }

        const uzbek = wordInfo ? wordInfo.uz : 'Tarjima topilmadi';
        const grammar = wordInfo ? wordInfo.grammar : 'Grammatik ma\'lumot yo\'q';

        popoverEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                    <strong style="font-size: 16px; color: #2dd4bf; display: flex; align-items: center; gap: 6px;">
                        ${escapeHtml(cleanWord)}
                        <button id="popover-audio-btn" style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; border-radius: 6px; padding: 2px 6px; cursor: pointer; font-size: 11px;">🔊</button>
                    </strong>
                    <div style="font-size: 14px; font-weight: 600; color: #f8fafc; margin-top: 2px;">${escapeHtml(uzbek)}</div>
                </div>
                <button id="popover-close-btn" style="background: none; border: none; font-size: 18px; color: #64748b; cursor: pointer; padding: 0 4px;">&times;</button>
            </div>
            <div style="font-size: 11px; color: #94a3b8; background: rgba(255, 255, 255, 0.04); padding: 5px 8px; border-radius: 6px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.06);">
                ${escapeHtml(grammar)}
            </div>
            <button id="popover-add-flashcard-btn" style="
                width: 100%; padding: 8px 12px; border-radius: 10px; border: none;
                background: linear-gradient(135deg, #2dd4bf, #38bdf8); color: #07111c;
                font-size: 12px; font-weight: 700; cursor: pointer; display: flex;
                align-items: center; justify-content: center; gap: 6px;
            ">
                <span>🎴</span> Lug'atimga qo'shish
            </button>
        `;

        // Joylashuvini hisoblash
        const rect = wordSpan.getBoundingClientRect();
        let top = rect.top - popoverEl.offsetHeight - 12;
        if (top < 20) top = rect.bottom + 12;
        let left = rect.left + (rect.width / 2) - 150;
        if (left < 10) left = 10;
        if (left + 300 > window.innerWidth) left = window.innerWidth - 310;

        popoverEl.style.top = `${Math.max(10, top)}px`;
        popoverEl.style.left = `${Math.max(10, left)}px`;
        popoverEl.style.display = 'block';

        setTimeout(() => {
            popoverEl.style.opacity = '1';
            popoverEl.style.transform = 'translateY(0)';
        }, 10);

        // Tugmalar hodisalari
        popoverEl.querySelector('#popover-audio-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            speakGermanText(cleanWord);
        });

        popoverEl.querySelector('#popover-close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            closeWordPopover();
        });

        const addBtn = popoverEl.querySelector('#popover-add-flashcard-btn');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            saveWordToFlashcards(cleanWord, uzbek, grammar);
            addBtn.innerHTML = '<span>✓</span> Qo\'shildi!';
            addBtn.style.background = '#4ade80';
            setTimeout(closeWordPopover, 600);
        });
    }

    function closeWordPopover() {
        if (!popoverEl) return;
        popoverEl.style.opacity = '0';
        popoverEl.style.transform = 'translateY(-8px)';
        setTimeout(() => {
            popoverEl.style.display = 'none';
        }, 200);
    }

    // Matnni so'zlarga ajratib <span class="sub-word"> ga o'rash
    function renderInteractiveSubtitles(deText, wordsDict) {
        // So'z va tinish belgilarini ajratish
        const tokens = deText.split(/([,.;:!?\s]+)/);
        let html = '';

        tokens.forEach(token => {
            const clean = token.replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
            if (clean) {
                const wordInfo = wordsDict[clean] || wordsDict[clean.toLowerCase()] || null;
                html += `<span class="sub-word" data-word="${escapeHtml(clean)}" style="
                    display: inline-block; padding: 1px 4px; margin: 1px; border-radius: 4px;
                    cursor: pointer; border-bottom: 2px dashed rgba(45, 212, 191, 0.4);
                    transition: background 0.15s, color 0.15s;
                ">${escapeHtml(token)}</span>`;
            } else {
                html += escapeHtml(token);
            }
        });

        return html;
    }

    // Darslik interfeysini chizish
    function renderVideoLessonSection() {
        const container = document.getElementById('video-lesson-container');
        if (!container) return;

        const scenario = LESSON_SCENARIOS[activeLevel] || LESSON_SCENARIOS['A1'];
        const currentDlg = scenario.dialogues[currentDialogueIdx] || scenario.dialogues[0];

        container.innerHTML = `
            <div class="video-lesson-card" style="
                background: rgba(12, 30, 48, 0.85); border: 1px solid rgba(56, 189, 248, 0.25);
                border-radius: 24px; padding: 26px; box-shadow: 0 20px 50px rgba(0,0,0,0.4);
                backdrop-filter: blur(25px); font-family: 'Inter', sans-serif;
            ">
                <!-- Yuqori qism: Daraja tanlash & Sarlavha -->
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; margin-bottom: 20px;">
                    <div>
                        <div style="font-size: 12px; font-weight: 700; color: #2dd4bf; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
                            <span>🎬</span> CLICK-TO-TRANSLATE VIDEO-DIALOG
                        </div>
                        <h3 style="font-size: 22px; font-weight: 700; color: #f8fafc; margin-top: 4px;">
                            ${escapeHtml(scenario.title)} <span style="font-size: 16px; font-weight: 400; color: #94a3b8;">(${escapeHtml(scenario.germanTitle)})</span>
                        </h3>
                    </div>

                    <!-- Daraja Tanlagich Tabs (A1, A2, B1, B2) -->
                    <div style="display: flex; gap: 6px; background: rgba(255,255,255,0.04); padding: 4px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                        ${['A1', 'A2', 'B1', 'B2'].map(lvl => `
                            <button class="lvl-tab-btn" data-level="${lvl}" style="
                                padding: 6px 14px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
                                background: ${activeLevel === lvl ? 'linear-gradient(135deg, #2dd4bf, #38bdf8)' : 'transparent'};
                                color: ${activeLevel === lvl ? '#07111c' : '#94a3b8'};
                            ">${lvl}</button>
                        `).join('')}
                    </div>
                </div>

                <!-- Vizual Sahna & Speaker Bubble -->
                <div style="
                    background: radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.12), rgba(7, 17, 28, 0.95));
                    border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 32px 24px;
                    display: flex; flex-direction: column; align-items: center; text-align: center;
                    position: relative; overflow: hidden; margin-bottom: 20px; min-height: 220px; justify-content: center;
                ">
                    <!-- Speaker avatar -->
                    <div style="
                        width: 76px; height: 76px; border-radius: 50%; background: rgba(255,255,255,0.08);
                        display: flex; align-items: center; justify-content: center; font-size: 38px;
                        border: 2px solid #2dd4bf; box-shadow: 0 0 25px rgba(45, 212, 191, 0.35); margin-bottom: 14px;
                    ">
                        ${currentDlg.avatar || '🗣️'}
                    </div>

                    <div style="font-size: 14px; font-weight: 600; color: #38bdf8; margin-bottom: 8px;">
                        ${escapeHtml(currentDlg.speaker)}
                    </div>

                    <!-- Subtitrlar bloki (Click-to-Translate) -->
                    <div id="active-subtitle-de" style="
                        font-size: 20px; font-weight: 600; color: #f8fafc; line-height: 1.5;
                        max-width: 600px; margin-bottom: 8px;
                    ">
                        ${renderInteractiveSubtitles(currentDlg.de, currentDlg.words)}
                    </div>

                    <!-- O'zbekcha tarjima -->
                    <div style="font-size: 14px; color: #94a3b8; max-width: 540px;">
                        ${escapeHtml(currentDlg.uz)}
                    </div>

                    <div style="position: absolute; bottom: 8px; right: 14px; font-size: 11px; color: rgba(255,255,255,0.3);">
                        💡 So'z ustiga bosing — tarjima va lug'at ochiladi
                    </div>
                </div>

                <!-- Boshqaruv Paneli (Play, Pause, Progress, Tezlik) -->
                <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button id="lesson-play-btn" style="
                            width: 44px; height: 44px; border-radius: 50%; border: none;
                            background: linear-gradient(135deg, #2dd4bf, #38bdf8); color: #07111c;
                            font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;
                        ">
                            ${isPlaying ? '⏸' : '▶'}
                        </button>

                        <button id="lesson-prev-btn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; border-radius: 10px; padding: 8px 14px; cursor: pointer; font-size: 12px; font-weight: 600;">
                            ⏮ Oldingi
                        </button>
                        <button id="lesson-next-btn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; border-radius: 10px; padding: 8px 14px; cursor: pointer; font-size: 12px; font-weight: 600;">
                            Keyingi ⏭
                        </button>
                    </div>

                    <!-- Dialog bosqich indikatori -->
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 13px; color: #94a3b8;">Jumla:</span>
                        <span style="font-size: 14px; font-weight: 700; color: #2dd4bf;">${currentDialogueIdx + 1}/${scenario.dialogues.length}</span>
                    </div>

                    <!-- Tezlik boshqaruvi (0.8x, 1.0x, 1.2x) -->
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <span style="font-size: 12px; color: #64748b;">Tezlik:</span>
                        ${[0.8, 1.0, 1.2].map(r => `
                            <button class="rate-btn" data-rate="${r}" style="
                                padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;
                                border: 1px solid ${playbackRate === r ? '#38bdf8' : 'rgba(255,255,255,0.1)'};
                                background: ${playbackRate === r ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)'};
                                color: ${playbackRate === r ? '#38bdf8' : '#94a3b8'};
                            ">${r}x</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        bindLessonEvents(container, scenario);
    }

    function bindLessonEvents(container, scenario) {
        // Daraja almashtirish
        container.querySelectorAll('.lvl-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activeLevel = btn.dataset.level;
                currentDialogueIdx = 0;
                pauseLesson();
                renderVideoLessonSection();
            });
        });

        // Play / Pause
        container.querySelector('#lesson-play-btn').addEventListener('click', () => {
            if (isPlaying) {
                pauseLesson();
            } else {
                startLesson();
            }
        });

        // Oldingi / Keyingi
        container.querySelector('#lesson-prev-btn').addEventListener('click', () => {
            if (currentDialogueIdx > 0) {
                currentDialogueIdx--;
                pauseLesson();
                renderVideoLessonSection();
                startLesson();
            }
        });

        container.querySelector('#lesson-next-btn').addEventListener('click', () => {
            if (currentDialogueIdx < scenario.dialogues.length - 1) {
                currentDialogueIdx++;
                pauseLesson();
                renderVideoLessonSection();
                startLesson();
            }
        });

        // Tezlik
        container.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                playbackRate = parseFloat(btn.dataset.rate) || 1.0;
                renderVideoLessonSection();
            });
        });

        // Click-to-Translate so'zlar
        container.querySelectorAll('.sub-word').forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                const cleanWord = span.dataset.word;
                const currentDlg = scenario.dialogues[currentDialogueIdx];
                const wordInfo = currentDlg?.words?.[cleanWord] || currentDlg?.words?.[cleanWord.toLowerCase()];
                showWordPopover(span, wordInfo, cleanWord);
            });

            span.addEventListener('mouseenter', () => {
                span.style.background = 'rgba(45, 212, 191, 0.25)';
                span.style.color = '#2dd4bf';
            });
            span.addEventListener('mouseleave', () => {
                span.style.background = 'transparent';
                span.style.color = 'inherit';
            });
        });
    }

    function startLesson() {
        const scenario = LESSON_SCENARIOS[activeLevel];
        if (!scenario) return;
        const currentDlg = scenario.dialogues[currentDialogueIdx];
        if (!currentDlg) return;

        isPlaying = true;
        updatePlayBtnUI(true);

        // Nemischa nutqni ijro etish
        speakGermanText(currentDlg.de);

        // Dialog tugaganda keyingisiga o'tish
        clearTimeout(playTimer);
        const approxDurationMs = Math.max(3000, ((currentDlg.end - currentDlg.start) / playbackRate) * 1000);
        playTimer = setTimeout(() => {
            if (currentDialogueIdx < scenario.dialogues.length - 1) {
                currentDialogueIdx++;
                renderVideoLessonSection();
                startLesson();
            } else {
                pauseLesson();
                if (window.showToast) window.showToast('🎉 Dialog muvaffaqiyatli yakunlandi!', 'success');
            }
        }, approxDurationMs);
    }

    function pauseLesson() {
        isPlaying = false;
        clearTimeout(playTimer);
        if ('speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch (_) {}
        }
        updatePlayBtnUI(false);
    }

    function updatePlayBtnUI(playing) {
        const btn = document.getElementById('lesson-play-btn');
        if (btn) btn.textContent = playing ? '⏸' : '▶';
    }

    // Tashqariga bosilganda popoverni yopish
    document.addEventListener('click', (e) => {
        if (popoverEl && popoverEl.style.display !== 'none' && !popoverEl.contains(e.target) && !e.target.closest('.sub-word')) {
            closeWordPopover();
        }
    });

    // Avtomatik o'rnatish
    function initVideoLesson() {
        // Agar deutsch.html da container bo'lsa darhol render qilamiz
        let container = document.getElementById('video-lesson-container');
        if (!container) {
            // Nemis tili sahifasida bo'lim mavjud bo'lsa, avtomatik joylashtiramiz
            const targetParent = document.getElementById('deutsch-content') || document.querySelector('.main-container') || document.body;
            if (window.location.pathname.includes('deutsch') || document.getElementById('top-nav-links')) {
                container = document.createElement('section');
                container.id = 'video-lesson-container';
                container.style.cssText = 'max-width: 900px; margin: 30px auto; padding: 0 16px;';
                // Darsliklar yoki testlar oldiga qo'yish
                const testsEl = document.getElementById('tests-section') || document.getElementById('grammar-curriculum');
                if (testsEl && testsEl.parentNode) {
                    testsEl.parentNode.insertBefore(container, testsEl);
                } else if (targetParent) {
                    targetParent.appendChild(container);
                }
            }
        }

        if (container) {
            renderVideoLessonSection();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoLesson);
    } else {
        initVideoLesson();
    }

    // Global eksport
    window.VideoLesson = {
        init: initVideoLesson,
        setLevel: (lvl) => {
            if (LESSON_SCENARIOS[lvl]) {
                activeLevel = lvl;
                currentDialogueIdx = 0;
                renderVideoLessonSection();
            }
        },
        play: startLesson,
        pause: pauseLesson
    };
})();
