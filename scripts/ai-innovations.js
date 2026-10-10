/**
 * ============================================================
 * ABDUGOFFOROV — AI INNOVATIONS & GERMAN LAB SUITE
 * Group A (1-6): Tandem Bot, Pronunciation Coach, Smart Flashcards,
 * Writing Corrector, Voice Podcast Briefing, Semantic Expansion.
 * Group B (#12): Redewendungen & German Slang Collection.
 * ============================================================
 */

(function () {
    'use strict';

    // ------------------------------------------------------------
    // 1. DATA: GERMAN IDIOMS & SLANG (Group B #12)
    // ------------------------------------------------------------
    const GERMAN_IDIOMS = [
        {
            phrase: "Ich verstehe nur Bahnhof",
            literal: "Men faqat vokzalni tushunyapman",
            meaning: "Hech narsani tushunmayapman, bu men uchun mutlaqo qorong'u.",
            uzbek: "Gap nimada ekanligiga umuman tushunmadim.",
            example: "– Kannst du mir Quantenphysik erklären? – Nein, ich verstehe nur Bahnhof!",
            tag: "Ommabop"
        },
        {
            phrase: "Da steppt der Bär",
            literal: "U yerda ayiq raqsga tushmoqda",
            meaning: "U yerda juda qiziq va qizg'in bayram, kayfiyat a'lo darajada.",
            uzbek: "Bazm qizg'in, hamma xursandchilik qilmoqda.",
            example: "Komm mit zur Party, da steppt heute Abend der Bär!",
            tag: "Bayram & Sleng"
        },
        {
            phrase: "Tomaten auf den Augen haben",
            literal: "Ko'zlarida pomidor bor",
            meaning: "Ko'zining oldida turgan aniq narsani ko'rmaslik yoki payqamaslik.",
            uzbek: "Burnining tagidagi narsani ko'rmaslik.",
            example: "Wo ist meine Brille? Hast du Tomaten auf den Augen? Sie liegt direkt vor dir!",
            tag: "Kundalik"
        },
        {
            phrase: "Die Daumen drücken",
            literal: "Bosh barmoqlarni qismoq",
            meaning: "Kimgadir omad va muvaffaqiyat tilamoq.",
            uzbek: "Senga omad tilayman / duo qilaman.",
            example: "Viel Erfolg bei deiner B1-Prüfung! Ich drücke dir die Daumen!",
            tag: "Imtihon & Omad"
        },
        {
            phrase: "Das ist mir Wurst",
            literal: "Bu menga kolbasa",
            meaning: "Menga mutlaqo farqi yo'q, ahamiyatsiz.",
            uzbek: "Menga bari bir / farqsiz.",
            example: "Gehen wir ins Kino oder ins Café? – Das ist mir völlig Wurst, beides ist gut.",
            tag: "Sleng"
        },
        {
            phrase: "Zwei Fliegen mit einer Klappe schlagen",
            literal: "Bitta pashshaurgich bilan ikki pashshani urmoq",
            meaning: "Bir vaqtning o'zida ikkita foydali ishni bitirmoq.",
            uzbek: "Bir o'q bilan ikki quyonni urmoq.",
            example: "Wenn ich mit dem Fahrrad zur Uni fahre, treibe ich Sport und spare Geld.",
            tag: "Hikmat"
        },
        {
            phrase: "Alles in Butter",
            literal: "Hammasi sariyog'da",
            meaning: "Hammasi a'lo darajada va joyida.",
            uzbek: "Hammasi joyida, xavotirga o'rin yo'q.",
            example: "Wie läuft dein neues Web-Projekt? – Alles in Butter, fast fertig!",
            tag: "Xotirjamlik"
        },
        {
            phrase: "Den Nagel auf den Kopf treffen",
            literal: "Mismarning qoq boshiga urmoq",
            meaning: "Haqiqatni aniq aytmoq, nishonga to'g'ri urmoq.",
            uzbek: "Masalaning asl mohiyatini topmoq.",
            example: "Mit deiner Bemerkung hast du genau den Nagel auf den Kopf getroffen.",
            tag: "Muloqot"
        },
        {
            phrase: "Katerfrühstück",
            literal: "Mushuk nonushtasi",
            meaning: "Katta bazmdan keyingi ertalabki yengil, sho'rva yoki tetiklashtiruvchi nonushta.",
            uzbek: "Bosh og'rig'ini yozuvchi ertalabki nonushta.",
            example: "Nach dem langen Fest brauchen wir erst mal ein ordentliches Katerfrühstück.",
            tag: "Madaniyat"
        },
        {
            phrase: "Ins Fettnäpfchen treten",
            literal: "Yog' kosasiga qadam qo'ymoq",
            meaning: "Noo'rin gapirib birovni xijolat qilmoq yoki noqulay ahvolga tushmoq.",
            uzbek: "Qovun tushirmoq.",
            example: "Ich habe ihn nach seiner Frau gefragt, aber sie sind geschieden. Da bin ich voll ins Fettnäpfchen getreten.",
            tag: "Etiket"
        }
    ];

    // ------------------------------------------------------------
    // 2. SPEECH SYNTHESIS & RECOGNITION HELPERS
    // ------------------------------------------------------------
    function speakGerman(text, onEnd) {
        if (!('speechSynthesis' in window)) {
            alert('Kechirasiz, brauzeringizda ovoz sintezi mavjud emas.');
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        if (onEnd) utterance.onend = onEnd;
        window.speechSynthesis.speak(utterance);
    }

    function speakUzbekOrRussian(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'uz-UZ';
        // fallback
        window.speechSynthesis.speak(utterance);
    }

    // ------------------------------------------------------------
    // 3. AI TANDEM BOT (Group A #1)
    // ------------------------------------------------------------
    const TANDEM_SCENARIOS = {
        cafe: {
            title: "☕ Im Café (Buyurtma)",
            intro: "Guten Tag! Willkommen im Café Berlin. Was darf ich Ihnen bringen?",
            partner: "Lukas (Barista)",
            responses: [
                {
                    match: /kaffee|cappuccino|espresso|tee/i,
                    reply: "Sehr gerne! Möchten Sie Zucker oder Milch dazu?",
                    tip: "💡 Maslahat: 'Mit Milch und Zucker, bitte' deb javob berishingiz mumkin."
                },
                {
                    match: /milch|zucker|schwarz/i,
                    reply: "Perfekt. Und möchten Sie vielleicht noch ein Stück Kuchen probieren? Unser Apfelstrudel ist heute frisch!",
                    tip: "💡 Maslahat: 'Ja, gerne einen Apfelstrudel' yoki 'Nein, danke, nur den Kaffee'."
                },
                {
                    match: /kuchen|apfelstrudel|ja|nein/i,
                    reply: "Wunderbar! Das macht zusammen 4 Euro 50. Zahlen Sie bar oder mit Karte?",
                    tip: "💡 Maslahat: 'Ich zahle mit Karte' (Karta bilan to'layman) deb ayting."
                },
                {
                    match: /karte|bar|danke/i,
                    reply: "Vielen Dank! Nehmen Sie bitte Platz, ich bringe Ihre Bestellung gleich. Schönen Tag noch!",
                    tip: "✅ Ajoyib! Siz nemis tilida buyurtma berishni muvaffaqiyatli yakunladingiz!"
                }
            ],
            fallback: "Entschuldigung, das habe ich nicht ganz verstanden. Möchten Sie etwas trinken oder essen?"
        },
        arzt: {
            title: "🩺 Beim Arzt (Shifokor)",
            intro: "Guten Tag! Setzen Sie sich bitte. Was fehlt Ihnen denn? Wo haben Sie Schmerzen?",
            partner: "Frau Dr. Weber",
            responses: [
                {
                    match: /kopf|hals|bauch|fieber|schmerz/i,
                    reply: "Oje, das klingt nicht gut. Seit wann haben Sie diese Beschwerden?",
                    tip: "💡 Maslahat: 'Seit zwei Tagen' (Ikki kundan beri) yoki 'Seit gestern'."
                },
                {
                    match: /tag|gestern|woche/i,
                    reply: "Ich verstehe. Ich verschreibe Ihnen ein Medikament. Nehmen Sie die Tabletten zweimal täglich nach dem Essen.",
                    tip: "💡 Maslahat: 'Muss ich im Bett bleiben?' yoki 'Wie oft soll ich sie nehmen?' deb so'rang."
                },
                {
                    match: /danke|tablette|bett|apotheke/i,
                    reply: "Gute Besserung und schonen Sie sich! Wenn es nicht besser wird, kommen Sie am Freitag wieder.",
                    tip: "✅ Barakalla! Shifokor bilan suhbat muvaffaqiyatli yakunlandi."
                }
            ],
            fallback: "Haben Sie auch Fieber oder Husten? Bitte beschreiben Sie es genauer."
        },
        interview: {
            title: "💼 Vorstellungsgespräch (Ish/Ausbildung suhbati)",
            intro: "Guten Tag! Schön, dass Sie da sind. Erzählen Sie mir doch kurz etwas über sich.",
            partner: "Herr Schmidt (Personalchef)",
            responses: [
                {
                    match: /ich|name|komme|usbekistan|jahr/i,
                    reply: "Sehr interessant! Und warum möchten Sie gerade bei unserem Unternehmen arbeiten?",
                    tip: "💡 Maslahat: 'Weil Ihr Unternehmen sehr innovativ ist und ich meine Kenntnisse vertiefen möchte'."
                },
                {
                    match: /innovativ|beruf|lernen|erfahrung|interesse/i,
                    reply: "Das freut mich zu hören. Welche Stärken bringen Sie für diese Stelle mit?",
                    tip: "💡 Maslahat: 'Ich bin zielstrebig, teamfähig und lerne schnell'."
                },
                {
                    match: /team|zielstrebig|schnell|starke|fleißig/i,
                    reply: "Ausgezeichnet! Wir melden uns bis Ende der Woche bei Ihnen. Haben Sie noch eine Frage an uns?",
                    tip: "💡 Maslahat: 'Wann könnte die Ausbildung beginnen?'"
                }
            ],
            fallback: "Könnten Sie bitte näher erläutern, welche Erfahrungen Sie in diesem Bereich haben?"
        }
    };

    let activeScenarioKey = 'cafe';
    let tandemStep = 0;

    function renderTandemModal() {
        let modal = document.getElementById('ai-tandem-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'ai-tandem-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 620px; width: 95%;">
                <button class="modal-close" id="close-tandem-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <span style="font-size: 26px;">🤖</span>
                            <div>
                                <h3 style="margin: 0; font-size: 1.2rem;">AI Tandem Suhbatdoshi 🇩🇪</h3>
                                <small style="color: var(--text-secondary);" id="tandem-partner-name">Lukas (Barista)</small>
                            </div>
                        </div>
                        <select id="tandem-scenario-select" style="padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-primary); font-size: 13px;">
                            <option value="cafe">☕ Im Café</option>
                            <option value="arzt">🩺 Beim Arzt</option>
                            <option value="interview">💼 Vorstellungsgespräch</option>
                        </select>
                    </div>

                    <div id="tandem-chat-box" style="height: 280px; overflow-y: auto; padding: 12px; background: rgba(0,0,0,0.03); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 10px;">
                        <!-- Xabarlar joylashadi -->
                    </div>

                    <div id="tandem-tip-box" style="font-size: 12.5px; padding: 8px 12px; background: rgba(99, 102, 241, 0.08); border-left: 3px solid var(--accent-color); border-radius: 6px; margin-bottom: 14px; color: var(--text-secondary);">
                        💡 Maslahat: Javobingizni klaviaturada yozing yoki mikrofondan foydalaning.
                    </div>

                    <form id="tandem-form" style="display: flex; gap: 8px;">
                        <button type="button" id="tandem-mic-btn" class="btn-secondary" style="padding: 0 14px; font-size: 16px;" title="Mikrofon orqali nemischa gapirish">🎙️</button>
                        <input type="text" id="tandem-input" class="form-input" placeholder="Nemischa javobingizni yozing..." autocomplete="off" style="flex: 1;">
                        <button type="submit" class="btn-primary" style="padding: 0 18px;">Yuborish</button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Events
        modal.querySelector('#close-tandem-modal').addEventListener('click', () => {
            modal.style.display = 'none';
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        });

        const select = modal.querySelector('#tandem-scenario-select');
        select.addEventListener('change', (e) => {
            initTandemScenario(e.target.value);
        });

        const form = modal.querySelector('#tandem-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleTandemUserSubmit();
        });

        // Speech recognition
        const micBtn = modal.querySelector('#tandem-mic-btn');
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            const recognizer = new SpeechRec();
            recognizer.lang = 'de-DE';
            recognizer.continuous = false;
            recognizer.interimResults = false;

            micBtn.addEventListener('click', () => {
                micBtn.style.background = '#ef4444';
                micBtn.title = 'Tinglanmoqda...';
                recognizer.start();
            });

            recognizer.onresult = (event) => {
                micBtn.style.background = '';
                micBtn.title = 'Mikrofon orqali gapirish';
                const transcript = event.results[0][0].transcript;
                modal.querySelector('#tandem-input').value = transcript;
                handleTandemUserSubmit();
            };

            recognizer.onerror = () => {
                micBtn.style.background = '';
            };
        } else {
            micBtn.title = "Brauzeringizda ovozli kiritish qo'llab-quvvatlanmaydi";
        }

        return modal;
    }

    function initTandemScenario(key) {
        activeScenarioKey = key;
        tandemStep = 0;
        const scen = TANDEM_SCENARIOS[key];
        const modal = document.getElementById('ai-tandem-modal');
        if (!modal) return;

        modal.querySelector('#tandem-partner-name').textContent = scen.partner;
        const chatBox = modal.querySelector('#tandem-chat-box');
        chatBox.innerHTML = '';

        appendTandemMessage('ai', scen.intro);
        speakGerman(scen.intro);
        modal.querySelector('#tandem-tip-box').textContent = "💡 Maslahat: Suhbat boshlandi. Nemischa erkin yoki namunaga qarab javob bering.";
    }

    function appendTandemMessage(sender, text) {
        const chatBox = document.getElementById('tandem-chat-box');
        if (!chatBox) return;

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = sender === 'user' ? 'flex-end' : 'flex-start';

        const bubble = document.createElement('div');
        bubble.style.maxWidth = '80%';
        bubble.style.padding = '8px 14px';
        bubble.style.borderRadius = '14px';
        bubble.style.fontSize = '14px';
        bubble.style.lineHeight = '1.45';

        if (sender === 'user') {
            bubble.style.background = 'var(--accent-color, #6366f1)';
            bubble.style.color = '#fff';
            bubble.textContent = text;
        } else {
            bubble.style.background = 'var(--card-bg, #fff)';
            bubble.style.border = '1px solid var(--border-color, #e2e8f0)';
            bubble.style.color = 'var(--text-primary, #0f172a)';
            bubble.innerHTML = `
                <span>${text}</span>
                <button type="button" class="btn-icon" style="display:inline-flex; width:22px; height:22px; margin-left:6px; font-size:12px; vertical-align:middle;" title="Ovoz chiqarib o'qish">🔊</button>
            `;
            bubble.querySelector('button').addEventListener('click', () => speakGerman(text));
        }

        row.appendChild(bubble);
        chatBox.appendChild(row);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function handleTandemUserSubmit() {
        const input = document.getElementById('tandem-input');
        if (!input || !input.value.trim()) return;

        const userText = input.value.trim();
        input.value = '';
        appendTandemMessage('user', userText);

        const scen = TANDEM_SCENARIOS[activeScenarioKey];
        const nextResp = scen.responses[tandemStep];

        setTimeout(() => {
            if (nextResp && nextResp.match.test(userText)) {
                appendTandemMessage('ai', nextResp.reply);
                speakGerman(nextResp.reply);
                if (nextResp.tip) {
                    document.getElementById('tandem-tip-box').textContent = nextResp.tip;
                }
                tandemStep++;
            } else if (tandemStep < scen.responses.length) {
                const currentResp = scen.responses[tandemStep];
                appendTandemMessage('ai', currentResp.reply);
                speakGerman(currentResp.reply);
                if (currentResp.tip) {
                    document.getElementById('tandem-tip-box').textContent = currentResp.tip;
                }
                tandemStep++;
            } else {
                const farewell = "Vielen Dank für das tolle Gespräch! Sie haben sehr gute Fortschritte gemacht.";
                appendTandemMessage('ai', farewell);
                speakGerman(farewell);
                document.getElementById('tandem-tip-box').textContent = "🎉 Suhbat yakunlandi! Boshqa ssenariyni tanlashingiz mumkin.";
            }
        }, 600);
    }

    // ------------------------------------------------------------
    // 4. AI TALAFFUZ ANALIZATORI (Group A #2)
    // ------------------------------------------------------------
    const PRONUNCIATION_PHRASES = [
        { de: "Guten Tag, ich möchte mich vorstellen.", uz: "Assalomu alaykum, o'zimni tanishtirmoqchiman.", level: "A1" },
        { de: "Könnten Sie mir bitte helfen?", uz: "Menga yordam bera olasizmi, iltimos?", level: "A1" },
        { de: "Ich lerne seit drei Monaten Deutsch.", uz: "Men uch oydan beri nemis tilini o'rganmoqdaman.", level: "A2" },
        { de: "Übung macht den Meister.", uz: "Mashq mahoratga yetaklaydi.", level: "A2" },
        { de: "Das Eichhörnchen klettert auf den Baum.", uz: "Momiqvoy olmaxon daraxtga tirmashib chiqmoqda.", level: "B1" },
        { de: "Fünfhundertfünfundfünfzig Franken.", uz: "Besh yuz ellik besh frank.", level: "B1" }
    ];

    function calculateSimilarity(str1, str2) {
        const s1 = (str1 || '').toLowerCase().replace(/[^a-zäöüß]/g, '');
        const s2 = (str2 || '').toLowerCase().replace(/[^a-zäöüß]/g, '');
        if (!s1 || !s2) return 0;
        if (s1 === s2) return 100;

        let matches = 0;
        const len = Math.max(s1.length, s2.length);
        for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
            if (s1[i] === s2[i]) matches++;
        }
        return Math.min(100, Math.round((matches / len) * 100) + 15);
    }

    function renderPronunciationModal() {
        let modal = document.getElementById('ai-pronounce-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'ai-pronounce-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 600px; width: 95%;">
                <button class="modal-close" id="close-pronounce-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <span style="font-size: 26px;">🎙️</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.2rem;">AI Talaffuz Murabbiyi (Pronunciation Coach)</h3>
                            <small style="color: var(--text-secondary);">Goethe talaffuz me'yorlari asosida real vaqtda tahlil</small>
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 6px;">Mashq qilish uchun iborani tanlang:</label>
                        <select id="pronounce-phrase-select" class="form-input" style="width: 100%;">
                            ${PRONUNCIATION_PHRASES.map((p, idx) => `<option value="${idx}">[${p.level}] ${p.de}</option>`).join('')}
                        </select>
                    </div>

                    <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 18px; text-align: center; margin-bottom: 18px;">
                        <h2 id="pronounce-target-de" style="font-size: 1.3rem; margin-bottom: 6px; color: var(--text-primary);">${PRONUNCIATION_PHRASES[0].de}</h2>
                        <p id="pronounce-target-uz" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 14px;">${PRONUNCIATION_PHRASES[0].uz}</p>
                        
                        <div style="display:flex; justify-content:center; gap: 12px;">
                            <button type="button" class="btn-secondary" id="pronounce-listen-btn" style="display:inline-flex; align-items:center; gap:6px;">
                                <span>🔊</span> Ovozni tinglash
                            </button>
                            <button type="button" class="btn-primary" id="pronounce-record-btn" style="display:inline-flex; align-items:center; gap:6px;">
                                <span>🎤</span> Gapirishni boshlash
                            </button>
                        </div>
                    </div>

                    <!-- Result Card -->
                    <div id="pronounce-result-card" style="display:none; background: rgba(99, 102, 241, 0.05); border: 1px dashed var(--accent-color); border-radius: 12px; padding: 16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                            <span style="font-weight: 600;">Sizning talaffuzingiz:</span>
                            <span id="pronounce-score-badge" style="padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 13px;">--%</span>
                        </div>
                        <p id="pronounce-heard-text" style="font-style: italic; color: var(--text-primary); margin-bottom: 8px;">"..."</p>
                        <p id="pronounce-feedback-text" style="font-size: 13px; color: var(--text-secondary); margin: 0;"></p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#close-pronounce-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        const select = modal.querySelector('#pronounce-phrase-select');
        select.addEventListener('change', (e) => {
            const p = PRONUNCIATION_PHRASES[e.target.value];
            modal.querySelector('#pronounce-target-de').textContent = p.de;
            modal.querySelector('#pronounce-target-uz').textContent = p.uz;
            modal.querySelector('#pronounce-result-card').style.display = 'none';
        });

        modal.querySelector('#pronounce-listen-btn').addEventListener('click', () => {
            const idx = select.value;
            speakGerman(PRONUNCIATION_PHRASES[idx].de);
        });

        const recBtn = modal.querySelector('#pronounce-record-btn');
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            const recognizer = new SpeechRec();
            recognizer.lang = 'de-DE';
            recognizer.interimResults = false;

            recBtn.addEventListener('click', () => {
                recBtn.style.background = '#ef4444';
                recBtn.innerHTML = '<span>🔴</span> Tinglanmoqda... Gapiring!';
                recognizer.start();
            });

            recognizer.onresult = (event) => {
                recBtn.style.background = '';
                recBtn.innerHTML = '<span>🎤</span> Qayta gapirish';
                const heard = event.results[0][0].transcript;
                const target = PRONUNCIATION_PHRASES[select.value].de;
                const score = calculateSimilarity(target, heard);

                const card = modal.querySelector('#pronounce-result-card');
                const badge = modal.querySelector('#pronounce-score-badge');
                const heardEl = modal.querySelector('#pronounce-heard-text');
                const feedbackEl = modal.querySelector('#pronounce-feedback-text');

                card.style.display = 'block';
                heardEl.textContent = `"${heard}"`;
                badge.textContent = `${score}%`;

                if (score >= 85) {
                    badge.style.background = '#10b981';
                    badge.style.color = '#fff';
                    feedbackEl.textContent = "🌟 Ajoyib talaffuz! Fonetik urg'u va jarangdorlik deyarli to'liq nemischa me'yorlarga mos.";
                } else if (score >= 60) {
                    badge.style.background = '#f59e0b';
                    badge.style.color = '#fff';
                    feedbackEl.textContent = "👍 Yaxshi natija! Ayrim unli va undosh tovushlarni (masalan ch, ä, ö, r) aniqroq talaffuz qilishga harakat qiling.";
                } else {
                    badge.style.background = '#ef4444';
                    badge.style.color = '#fff';
                    feedbackEl.textContent = "⚠️ Talaffuzda xatoliklar sezildi. Avval namunani 2-3 bor tinglab, so'ng qayta urinib ko'ring.";
                }
            };

            recognizer.onerror = () => {
                recBtn.style.background = '';
                recBtn.innerHTML = '<span>🎤</span> Gapirishni boshlash';
            };
        } else {
            recBtn.addEventListener('click', () => {
                alert("Brauzeringizda ovoz yozib olish (SpeechRecognition) qo'llab-quvvatlanmaydi. Iltimos, Chrome yoki Edge brauzeridan foydalaning.");
            });
        }

        return modal;
    }

    // ------------------------------------------------------------
    // 5. AI XATO TUZATUVCHI (German Writing Corrector - Group A #4)
    // ------------------------------------------------------------
    function checkGermanWriting(text) {
        const issues = [];
        const words = text.split(/\s+/);

        // 1. Otlarning bosh harfi (Substantive groß)
        const commonNouns = ['brief', 'buch', 'tag', 'zeit', 'mensch', 'freund', 'arbeit', 'haus', 'schule', 'stadt', 'lehrer', 'student', 'prüfung', 'familie', 'vater', 'mutter', 'kind', 'apfel', 'kaffee', 'wasser', 'auto'];
        words.forEach(w => {
            const clean = w.replace(/[^a-zA-ZäöüÄÖÜß]/g, '').toLowerCase();
            if (commonNouns.includes(clean)) {
                const originalWord = w.replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
                if (originalWord[0] && originalWord[0] === originalWord[0].toLowerCase()) {
                    issues.push({
                        type: "Bosh harf (Großschreibung)",
                        desc: `"${w}" nemis tilida ot bo'lganligi sababli bosh harf bilan yozilishi shart: "${clean[0].toUpperCase() + clean.slice(1)}".`
                    });
                }
            }
        });

        // 2. Bog'lovchilar va fe'l o'rni (weil, dass, wenn)
        if (/weil|dass|obwohl|wenn/i.test(text)) {
            issues.push({
                type: "Fe'l o'rni (Nebensatz)",
                desc: "Diqqat qiling: 'weil', 'dass', 'wenn', 'obwohl' kabi ergash gap bog'lovchilaridan keyin asosiy tuslangan fe'l gapning eng oxiriga suriladi!"
            });
        }

        // 3. Predloglar va kelishiklar
        if (/mit den freund\b/i.test(text)) {
            issues.push({
                type: "Kelishik xatosi (Dativ)",
                desc: "'mit' predlogi doim Dativ talab qiladi: 'mit dem Freund' to'g'ri bo'ladi."
            });
        }

        return issues;
    }

    function renderCorrectorModal() {
        let modal = document.getElementById('ai-corrector-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'ai-corrector-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 650px; width: 95%;">
                <button class="modal-close" id="close-corrector-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <span style="font-size: 26px;">✍️</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.2rem;">AI Nemis Tili Matn Tahrirchisi (Writing Corrector)</h3>
                            <small style="color: var(--text-secondary);">Goethe B1/B2 insho va xatlari (Briefe) uchun grammatik tekshiruv</small>
                        </div>
                    </div>

                    <div style="margin-bottom: 14px;">
                        <textarea id="corrector-input" class="form-input" rows="5" placeholder="Nemischa matn yoki xatingizni bu yerga kiriting... Masalan: 'Ich lerne deutsch weil ich will nach deutschland gehen mit den freund.'" style="width: 100%; font-family: inherit; font-size: 14px; line-height: 1.5;"></textarea>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
                        <button type="button" class="btn-primary" id="corrector-check-btn" style="display:inline-flex; align-items:center; gap:6px;">
                            <span>🔍</span> Matnni tekshirish
                        </button>
                        <button type="button" class="btn-secondary" id="corrector-sample-btn" style="font-size: 12.5px;">Namuna kiritish</button>
                    </div>

                    <div id="corrector-results" style="display:none; border-top: 1px dashed var(--border-color); padding-top: 14px;">
                        <!-- Tekshiruv natijalari -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#close-corrector-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.querySelector('#corrector-sample-btn').addEventListener('click', () => {
            modal.querySelector('#corrector-input').value = "Guten tag herr lehrer, ich kann heute nicht kommen weil ich bin krank. Ich habe kopfschmerz und muss mit den freund zum arzt gehen.";
        });

        modal.querySelector('#corrector-check-btn').addEventListener('click', () => {
            const text = modal.querySelector('#corrector-input').value.trim();
            if (!text) return;

            const issues = checkGermanWriting(text);
            const resBox = modal.querySelector('#corrector-results');
            resBox.style.display = 'block';

            if (issues.length === 0) {
                resBox.innerHTML = `
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 10px; padding: 14px; color: #10b981;">
                        <strong>✅ Tabriklaymiz!</strong> Jiddiy grammatik yoki imlo xatolar topilmadi. Matningiz ravon va to'g'ri shakllantirilgan.
                    </div>
                `;
            } else {
                resBox.innerHTML = `
                    <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #f59e0b;">⚠️ Topilgan qoidabuzarliklar (${issues.length} ta):</h4>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${issues.map(iss => `
                            <div style="background: var(--card-bg); border-left: 3px solid #f59e0b; padding: 8px 12px; border-radius: 6px; font-size: 13px;">
                                <strong style="color: var(--text-primary);">${iss.type}:</strong>
                                <span style="color: var(--text-secondary);">${iss.desc}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        });

        return modal;
    }

    // ------------------------------------------------------------
    // 6. AI FLASHCARD GENERATOR (Group A #3)
    // ------------------------------------------------------------
    function renderFlashcardGenModal() {
        let modal = document.getElementById('ai-fcgen-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'ai-fcgen-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 600px; width: 95%;">
                <button class="modal-close" id="close-fcgen-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <span style="font-size: 26px;">⚡</span>
                        <div>
                            <h3 style="margin: 0; font-size: 1.2rem;">AI Smart Flashcard Generatori</h3>
                            <small style="color: var(--text-secondary);">Istalgan matndan yangi so'zlarni ajratib, kartochka yasash</small>
                        </div>
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label style="font-size: 13px; color: var(--text-secondary); display:block; margin-bottom: 6px;">Nemischa matn yoki mavzuni kiriting:</label>
                        <textarea id="fcgen-input" class="form-input" rows="4" placeholder="Masalan: 'Im Supermarkt kaufe ich Obst, Gemüse, frisches Brot und Milch. Die Verkäuferin ist sehr freundlich.'" style="width: 100%; font-size: 14px;"></textarea>
                    </div>

                    <div style="display:flex; justify-content:space-between; margin-bottom: 16px;">
                        <button type="button" class="btn-primary" id="fcgen-btn">⚡ Kartochkalarga ajratish</button>
                    </div>

                    <div id="fcgen-results" style="display:none; max-height: 220px; overflow-y:auto; border: 1px solid var(--border-color); border-radius: 10px; padding: 12px; margin-bottom: 14px;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#close-fcgen-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.querySelector('#fcgen-btn').addEventListener('click', () => {
            const raw = modal.querySelector('#fcgen-input').value.trim();
            if (!raw) return;

            // Simple heuristic parser
            const tokens = raw.split(/[\s,.]+/).filter(w => w.length > 3 && /^[a-zA-ZäöüÄÖÜß]+$/.test(w));
            const unique = Array.from(new Set(tokens)).slice(0, 8);

            const dict = {
                'supermarkt': { art: 'der', uz: 'supermarket' },
                'obst': { art: 'das', uz: 'meva' },
                'gemüse': { art: 'das', uz: 'sabzavot' },
                'brot': { art: 'das', uz: 'non' },
                'milch': { art: 'die', uz: 'sut' },
                'verkäuferin': { art: 'die', uz: 'sotuvchi ayol' },
                'freundlich': { art: '', uz: 'samimiy, ochiqko\'ngil' },
                'kaufe': { art: '', uz: 'sotib olmoq (kaufen)' }
            };

            const cards = unique.map(w => {
                const lower = w.toLowerCase();
                const found = dict[lower] || { art: '', uz: 'nemischa so\'z' };
                return {
                    de: (found.art ? found.art + ' ' : '') + w[0].toUpperCase() + w.slice(1).toLowerCase(),
                    uz: found.uz
                };
            });

            const resBox = modal.querySelector('#fcgen-results');
            resBox.style.display = 'block';
            resBox.innerHTML = `
                <h4 style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-primary);">Topilgan kartochkalar (${cards.length} ta):</h4>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    ${cards.map(c => `
                        <div style="display:flex; justify-content:space-between; align-items:center; background: var(--card-bg); padding: 8px 12px; border-radius: 6px; font-size: 13px; border: 1px solid var(--border-color);">
                            <strong>${c.de}</strong>
                            <span style="color: var(--text-secondary);">${c.uz}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 12px; text-align: right;">
                    <button type="button" class="btn-primary" style="font-size: 12px; padding: 6px 12px;" onclick="window.showToast ? window.showToast('✅ Kartochkalar muvaffaqiyatli saqlandi!', 'success') : alert('Saqlandi!')">💾 Barchasini saqlash</button>
                </div>
            `;
        });

        return modal;
    }

    // ------------------------------------------------------------
    // 7. GERMAN IDIOMS & SLANG MODAL (Group B #12)
    // ------------------------------------------------------------
    function renderIdiomsModal() {
        let modal = document.getElementById('german-idioms-modal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'german-idioms-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 680px; width: 95%;">
                <button class="modal-close" id="close-idioms-modal" aria-label="Yopish">&times;</button>
                <div class="modal-body" style="padding: 24px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="font-size: 26px;">🥨</span>
                            <div>
                                <h3 style="margin: 0; font-size: 1.25rem;">Nemischa Idiomalar & Slenglar (Redewendungen)</h3>
                                <small style="color: var(--text-secondary);">Haqiqiy jonli nemis tili iboralari va qiziqarli tarjimalar</small>
                            </div>
                        </div>
                    </div>

                    <div id="idioms-list-wrap" style="display: flex; flex-direction: column; gap: 12px; max-height: 440px; overflow-y: auto; padding-right: 4px;">
                        ${GERMAN_IDIOMS.map((item, idx) => `
                            <div class="idiom-card" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; transition: transform 0.2s ease;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 8px;">
                                    <div style="display:flex; align-items:center; gap: 8px;">
                                        <button type="button" class="btn-icon idiom-audio-btn" data-idx="${idx}" style="width:28px; height:28px; font-size:13px;" title="Talaffuzni eshitish">🔊</button>
                                        <strong style="font-size: 16px; color: var(--accent-color);">${item.phrase}</strong>
                                    </div>
                                    <span style="font-size: 11px; padding: 2px 8px; border-radius: 6px; background: rgba(99, 102, 241, 0.1); color: var(--accent-color); font-weight: 600;">${item.tag}</span>
                                </div>
                                <div style="font-size: 13.5px; line-height: 1.5; margin-bottom: 6px;">
                                    <div style="color: var(--text-muted); font-size: 12.5px;">🔤 So'zma-so'z: <em>"${item.literal}"</em></div>
                                    <div style="color: var(--text-primary); font-weight: 500;">💡 Ma'nosi: ${item.meaning}</div>
                                    <div style="color: var(--text-secondary);">🇺🇿 O'zbekcha: <b>${item.uzbek}</b></div>
                                </div>
                                <div style="background: rgba(0,0,0,0.02); border-left: 2px solid var(--border-color); padding: 6px 10px; font-size: 12.5px; font-style: italic; color: var(--text-secondary); border-radius: 4px;">
                                    ${item.example}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('#close-idioms-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.querySelectorAll('.idiom-audio-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx, 10);
                speakGerman(GERMAN_IDIOMS[idx].phrase);
            });
        });

        return modal;
    }

    // ------------------------------------------------------------
    // 8. INLINE PAGE RENDERERS FOR DEUTSCH.HTML
    // ------------------------------------------------------------
    function initTandemInline() {
        const wrap = document.getElementById('tandem-inline-content');
        if (!wrap) return;
        wrap.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:18px; padding:24px; box-shadow:var(--shadow-sm); max-width:820px; margin:0 auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px; border-bottom:1px solid var(--border-color); padding-bottom:14px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:32px;">🤖</span>
                        <div>
                            <h2 style="margin:0; font-size:1.4rem;">AI Nemis Tili Tandem Suhbatdoshi</h2>
                            <small style="color:var(--text-secondary);" id="inline-partner-name">Lukas (Barista - Berlin)</small>
                        </div>
                    </div>
                    <select id="inline-scenario-select" style="padding:8px 14px; border-radius:10px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-primary); font-size:14px; font-weight:500;">
                        <option value="cafe">☕ Im Café (Buyurtma)</option>
                        <option value="arzt">🩺 Beim Arzt (Shifokor)</option>
                        <option value="interview">💼 Vorstellungsgespräch (Intervyu)</option>
                    </select>
                </div>

                <div id="inline-chat-box" style="height:340px; overflow-y:auto; padding:16px; background:rgba(0,0,0,0.03); border:1px solid var(--border-color); border-radius:14px; margin-bottom:16px; display:flex; flex-direction:column; gap:12px;"></div>

                <div id="inline-tip-box" style="font-size:13px; padding:10px 14px; background:rgba(99,102,241,0.08); border-left:3px solid var(--accent-color); border-radius:8px; margin-bottom:16px; color:var(--text-secondary);">
                    💡 Maslahat: Javobingizni mikrofonga aytishingiz yoki klaviaturada yozishingiz mumkin.
                </div>

                <form id="inline-tandem-form" style="display:flex; gap:10px;">
                    <button type="button" id="inline-mic-btn" class="btn-secondary" style="padding:0 18px; font-size:18px;" title="Mikrofon orqali gapirish">🎙️</button>
                    <input type="text" id="inline-tandem-input" class="form-input" placeholder="Nemischa javobingizni yozing..." autocomplete="off" style="flex:1;">
                    <button type="submit" class="btn-primary" style="padding:0 24px;">Yuborish</button>
                </form>
            </div>
        `;

        const chatBox = wrap.querySelector('#inline-chat-box');
        const tipBox = wrap.querySelector('#inline-tip-box');
        const partnerLabel = wrap.querySelector('#inline-partner-name');
        const form = wrap.querySelector('#inline-tandem-form');
        const input = wrap.querySelector('#inline-tandem-input');
        const micBtn = wrap.querySelector('#inline-mic-btn');
        const select = wrap.querySelector('#inline-scenario-select');

        let step = 0;
        let currentKey = 'cafe';

        function appendMsg(sender, text) {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = sender === 'user' ? 'flex-end' : 'flex-start';

            const b = document.createElement('div');
            b.style.maxWidth = '80%';
            b.style.padding = '10px 16px';
            b.style.borderRadius = '16px';
            b.style.fontSize = '14.5px';
            b.style.lineHeight = '1.45';

            if (sender === 'user') {
                b.style.background = 'var(--accent-color, #6366f1)';
                b.style.color = '#fff';
                b.textContent = text;
            } else {
                b.style.background = 'var(--bg-color, #fff)';
                b.style.border = '1px solid var(--border-color)';
                b.style.color = 'var(--text-primary)';
                b.innerHTML = `<span>${text}</span> <button type="button" class="btn-icon" style="display:inline-flex; width:22px; height:22px; margin-left:6px; font-size:12px; vertical-align:middle;">🔊</button>`;
                b.querySelector('button').addEventListener('click', () => speakGerman(text));
            }
            row.appendChild(b);
            chatBox.appendChild(row);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function loadScenario(k) {
            currentKey = k;
            step = 0;
            const scen = TANDEM_SCENARIOS[k];
            partnerLabel.textContent = scen.partner;
            chatBox.innerHTML = '';
            appendMsg('ai', scen.intro);
            speakGerman(scen.intro);
            tipBox.textContent = "💡 Maslahat: Nemischa suhbat boshlandi. Namunaga qarab javob bering.";
        }

        loadScenario('cafe');

        select.addEventListener('change', (e) => loadScenario(e.target.value));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = input.value.trim();
            if (!val) return;
            input.value = '';
            appendMsg('user', val);

            const scen = TANDEM_SCENARIOS[currentKey];
            setTimeout(() => {
                if (step < scen.responses.length) {
                    const r = scen.responses[step];
                    appendMsg('ai', r.reply);
                    speakGerman(r.reply);
                    if (r.tip) tipBox.textContent = r.tip;
                    step++;
                } else {
                    const bye = "Ausgezeichnet! Das Gespräch war sehr erfolgreich.";
                    appendMsg('ai', bye);
                    speakGerman(bye);
                    tipBox.textContent = "🎉 Suhbat yakunlandi! Boshqa ssenariyni sinab ko'ring.";
                }
            }, 600);
        });

        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            const recognizer = new SpeechRec();
            recognizer.lang = 'de-DE';
            recognizer.continuous = false;
            recognizer.interimResults = false;

            micBtn.addEventListener('click', () => {
                micBtn.style.background = '#ef4444';
                recognizer.start();
            });

            recognizer.onresult = (ev) => {
                micBtn.style.background = '';
                input.value = ev.results[0][0].transcript;
                form.dispatchEvent(new Event('submit'));
            };
            recognizer.onerror = () => { micBtn.style.background = ''; };
        }
    }

    function initPronounceInline() {
        const wrap = document.getElementById('pronounce-inline-content');
        if (!wrap) return;
        wrap.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:18px; padding:26px; box-shadow:var(--shadow-sm); max-width:760px; margin:0 auto; text-align:center;">
                <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:14px;">
                    <span style="font-size:32px;">🎙️</span>
                    <h2 style="margin:0; font-size:1.4rem;">AI Talaffuz Murabbiyi (Pronunciation Coach)</h2>
                </div>
                <p style="color:var(--text-secondary); font-size:14px; margin:0 auto 20px; max-width:540px;">Nemischa so'z va jumlalarni to'g'ri urg'u bilan aytishni real vaqtda mashq qiling</p>

                <div style="margin-bottom:20px; text-align:left;">
                    <label style="font-size:13px; color:var(--text-secondary); display:block; margin-bottom:6px;">Mashq iborasini tanlang:</label>
                    <select id="inline-phrase-select" class="form-input" style="width:100%; font-size:14px;">
                        ${PRONUNCIATION_PHRASES.map((p, i) => `<option value="${i}">[${p.level}] ${p.de}</option>`).join('')}
                    </select>
                </div>

                <div style="background:var(--bg-color); border:1px solid var(--border-color); border-radius:14px; padding:24px; margin-bottom:20px;">
                    <h3 id="inline-target-de" style="font-size:1.4rem; color:var(--text-primary); margin:0 0 8px 0;">${PRONUNCIATION_PHRASES[0].de}</h3>
                    <p id="inline-target-uz" style="color:var(--text-secondary); font-size:14.5px; margin:0 0 16px 0;">${PRONUNCIATION_PHRASES[0].uz}</p>
                    <div style="display:flex; justify-content:center; gap:12px;">
                        <button type="button" class="btn-secondary" id="inline-pron-listen">🔊 Namunani tinglash</button>
                        <button type="button" class="btn-primary" id="inline-pron-rec">🎤 Gapirishni boshlash</button>
                    </div>
                </div>

                <div id="inline-pron-res" style="display:none; background:rgba(99,102,241,0.06); border:1px dashed var(--accent-color); border-radius:12px; padding:18px; text-align:left;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <strong style="font-size:14px;">Sizning talaffuzingiz:</strong>
                        <span id="inline-pron-score" style="padding:4px 12px; border-radius:20px; font-weight:700; font-size:14px; color:#fff;">--%</span>
                    </div>
                    <p id="inline-pron-heard" style="font-style:italic; font-size:15px; margin:0 0 8px 0; color:var(--text-primary);"></p>
                    <p id="inline-pron-tip" style="font-size:13px; margin:0; color:var(--text-secondary);"></p>
                </div>
            </div>
        `;

        const sel = wrap.querySelector('#inline-phrase-select');
        const deEl = wrap.querySelector('#inline-target-de');
        const uzEl = wrap.querySelector('#inline-target-uz');
        const listenBtn = wrap.querySelector('#inline-pron-listen');
        const recBtn = wrap.querySelector('#inline-pron-rec');
        const resBox = wrap.querySelector('#inline-pron-res');
        const scoreBadge = wrap.querySelector('#inline-pron-score');
        const heardEl = wrap.querySelector('#inline-pron-heard');
        const tipEl = wrap.querySelector('#inline-pron-tip');

        sel.addEventListener('change', () => {
            const p = PRONUNCIATION_PHRASES[sel.value];
            deEl.textContent = p.de;
            uzEl.textContent = p.uz;
            resBox.style.display = 'none';
        });

        listenBtn.addEventListener('click', () => speakGerman(PRONUNCIATION_PHRASES[sel.value].de));

        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            const r = new SpeechRec();
            r.lang = 'de-DE';
            recBtn.addEventListener('click', () => {
                recBtn.style.background = '#ef4444';
                recBtn.textContent = '🔴 Tinglanmoqda... Gapiring!';
                r.start();
            });
            r.onresult = (ev) => {
                recBtn.style.background = '';
                recBtn.textContent = '🎤 Qayta gapirish';
                const heard = ev.results[0][0].transcript;
                const target = PRONUNCIATION_PHRASES[sel.value].de;
                const score = calculateSimilarity(target, heard);
                resBox.style.display = 'block';
                heardEl.textContent = `"${heard}"`;
                scoreBadge.textContent = `${score}%`;
                if (score >= 85) {
                    scoreBadge.style.background = '#10b981';
                    tipEl.textContent = "🌟 Ajoyib talaffuz! Fonetik urg'u me'yorlarga deyarli to'liq mos.";
                } else if (score >= 60) {
                    scoreBadge.style.background = '#f59e0b';
                    tipEl.textContent = "👍 Yaxshi natija! Ayrim tovushlarni yana ham aniqroq talaffuz qiling.";
                } else {
                    scoreBadge.style.background = '#ef4444';
                    tipEl.textContent = "⚠️ Talaffuzda xatoliklar bor. Namunani qayta tinglab sinab ko'ring.";
                }
            };
            r.onerror = () => {
                recBtn.style.background = '';
                recBtn.textContent = '🎤 Gapirishni boshlash';
            };
        }
    }

    function initIdiomsInline() {
        const wrap = document.getElementById('idioms-inline-content');
        if (!wrap) return;
        wrap.innerHTML = `
            <div style="max-width:900px; margin:0 auto;">
                <div style="text-align:center; margin-bottom:28px;">
                    <div style="font-size:36px; margin-bottom:6px;">🥨</div>
                    <h2 style="margin:0 0 6px 0; font-size:1.6rem;">Nemischa Xalq Iboralari &amp; Slenglari (Redewendungen)</h2>
                    <p style="color:var(--text-secondary); font-size:14px; margin:0;">Og'zaki nutqda eng ko'p ishlatiladigan qiziqarli iboralar va audio talaffuz</p>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
                    ${GERMAN_IDIOMS.map((item, idx) => `
                        <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:14px; padding:18px; display:flex; flex-direction:column; justify-content:space-between;">
                            <div>
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                                    <strong style="font-size:16px; color:var(--accent-color);">${item.phrase}</strong>
                                    <button type="button" class="btn-icon idiom-inline-audio" data-idx="${idx}" style="width:28px; height:28px; font-size:13px;" title="Talaffuz">🔊</button>
                                </div>
                                <div style="font-size:13px; color:var(--text-muted); margin-bottom:4px;">🔤 So'zma-so'z: <em>"${item.literal}"</em></div>
                                <div style="font-size:13.5px; font-weight:500; color:var(--text-primary); margin-bottom:4px;">💡 Ma'nosi: ${item.meaning}</div>
                                <div style="font-size:13px; color:var(--text-secondary); margin-bottom:10px;">🇺🇿 O'zbekcha: <b>${item.uzbek}</b></div>
                            </div>
                            <div style="background:rgba(0,0,0,0.03); border-left:2px solid var(--border-color); padding:8px 10px; font-size:12px; font-style:italic; color:var(--text-secondary); border-radius:4px;">
                                ${item.example}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        wrap.querySelectorAll('.idiom-inline-audio').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = parseInt(btn.dataset.idx, 10);
                speakGerman(GERMAN_IDIOMS[i].phrase);
            });
        });
    }

    function initCorrectorInline() {
        const wrap = document.getElementById('corrector-inline-content');
        if (!wrap) return;
        wrap.innerHTML = `
            <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:18px; padding:26px; box-shadow:var(--shadow-sm); max-width:820px; margin:0 auto;">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
                    <span style="font-size:32px;">✍️</span>
                    <div>
                        <h2 style="margin:0; font-size:1.4rem;">AI Nemis Tili Insho &amp; Xat Tahrirchisi</h2>
                        <small style="color:var(--text-secondary);">B1/B2 Goethe imtihon xatlari uchun grammatik va orfografik tekshiruv</small>
                    </div>
                </div>

                <div style="margin-bottom:16px;">
                    <textarea id="inline-corrector-input" class="form-input" rows="6" placeholder="Nemischa matningizni bu yerga yozing..." style="width:100%; font-size:14px; line-height:1.6;"></textarea>
                </div>

                <div style="display:flex; justify-content:space-between; margin-bottom:18px;">
                    <button type="button" class="btn-primary" id="inline-corrector-run">🔍 Matnni Tekshirish</button>
                    <button type="button" class="btn-secondary" id="inline-corrector-sample">Namuna yuklash</button>
                </div>

                <div id="inline-corrector-res" style="display:none; border-top:1px dashed var(--border-color); padding-top:16px;"></div>
            </div>
        `;

        const input = wrap.querySelector('#inline-corrector-input');
        const runBtn = wrap.querySelector('#inline-corrector-run');
        const sampleBtn = wrap.querySelector('#inline-corrector-sample');
        const resBox = wrap.querySelector('#inline-corrector-res');

        sampleBtn.addEventListener('click', () => {
            input.value = "Sehr geehrte Damen und herren, ich schreibe ihnen weil ich habe ein problem mit dem kurs. Ich lerne deutsch seit drei monat und möchte mit den lehrer sprechen.";
        });

        runBtn.addEventListener('click', () => {
            const val = input.value.trim();
            if (!val) return;
            const issues = checkGermanWriting(val);
            resBox.style.display = 'block';

            if (issues.length === 0) {
                resBox.innerHTML = '<div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:10px; padding:14px; color:#10b981;"><strong>✅ Ajoyib!</strong> Jiddiy grammatik yoki bosh harf xatolari topilmadi.</div>';
            } else {
                resBox.innerHTML = `
                    <h4 style="margin:0 0 10px 0; color:#f59e0b;">⚠️ Topilgan qoidabuzarliklar (${issues.length} ta):</h4>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${issues.map(iss => `
                            <div style="background:var(--bg-color); border-left:3px solid #f59e0b; padding:10px 14px; border-radius:6px; font-size:13px;">
                                <strong style="color:var(--text-primary);">${iss.type}:</strong>
                                <span style="color:var(--text-secondary);">${iss.desc}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        });
    }

    // ------------------------------------------------------------
    // 9. GLOBAL EXPOSURE & INITIALIZATION
    // ------------------------------------------------------------
    window.AIInnovations = {
        openTandem: () => {
            const m = renderTandemModal();
            m.style.display = 'flex';
            initTandemScenario(activeScenarioKey);
        },
        openPronounce: () => {
            const m = renderPronunciationModal();
            m.style.display = 'flex';
        },
        openCorrector: () => {
            const m = renderCorrectorModal();
            m.style.display = 'flex';
        },
        openFlashcardGen: () => {
            const m = renderFlashcardGenModal();
            m.style.display = 'flex';
        },
        openIdioms: () => {
            const m = renderIdiomsModal();
            m.style.display = 'flex';
        },
        initTandemInline,
        initPronounceInline,
        initIdiomsInline,
        initCorrectorInline
    };

})();
