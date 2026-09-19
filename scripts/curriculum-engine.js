// ============================================================
// DEUTSCH AKADEMIYASI — INTERAKTIV DARSLIK VA TIZIM DVIGATELI
// A1, A2, B1, B2 Darajalar & 7 tadan Interaktiv Mavzular Dvigateli
// ============================================================

(function() {
    'use strict';

    let currentLevel = 'A1';
    let currentTopic = null;
    let currentActiveTab = 'theory'; // 'theory', 'flashcards', 'quiz', 'game'

    // Nutq sintezi (Nemischa talaffuz)
    function speakGerman(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    window.speakGerman = speakGerman;

    // LocalStorage progress
    function getTopicProgress(topicId) {
        try {
            const raw = localStorage.getItem('abdu_curriculum_progress');
            const data = raw ? JSON.parse(raw) : {};
            return data[topicId] || { completed: false, score: 0, testPassed: false };
        } catch (e) {
            return { completed: false, score: 0, testPassed: false };
        }
    }

    function saveTopicProgress(topicId, update) {
        try {
            const raw = localStorage.getItem('abdu_curriculum_progress');
            const data = raw ? JSON.parse(raw) : {};
            data[topicId] = Object.assign(data[topicId] || {}, update);
            localStorage.setItem('abdu_curriculum_progress', JSON.stringify(data));
        } catch (e) {}
    }

    // Bosh sahifani chizish (Darajalar va 7 ta mavzu kartochkalari)
    function renderCurriculumHome(lvl) {
        if (lvl) currentLevel = lvl;
        const container = document.getElementById('deutsch-content');
        if (!container) return;

        const curriculum = window.deutschCurriculum || {};
        const levelData = curriculum[currentLevel];

        const levels = ['A1', 'A2', 'B1', 'B2'];
        const levelIcons = { A1: '🌱', A2: '🌿', B1: '🌳', B2: '🏔️' };
        const levelNames = {
            A1: 'A1 Boshlang\'ich',
            A2: 'A2 Asosiy',
            B1: 'B1 O\'rta',
            B2: 'B2 Yuqori'
        };

        let html = `
            <div class="curriculum-hero" style="text-align: center; margin-bottom: 28px;">
                <div class="hero-badge" style="display:inline-flex; align-items:center; gap:8px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 12px;">
                    <span>🇩🇪</span> Deutsch Akademiyasi — Interaktiv Dastur
                </div>
                <h1 style="font-size: clamp(26px, 4vw, 40px); font-weight: 800; color: var(--text-primary); margin: 0 0 10px 0; letter-spacing: -0.02em;">
                    Nemis Tilini Bosqichma-bosqich O'rganing
                </h1>
                <p style="color: var(--text-secondary); max-width: 680px; margin: 0 auto; font-size: 15px; line-height: 1.6;">
                    Har bir daraja bo'yicha 7 ta asosiy mavzu: oson tushuntirilgan nazariya, ovozli so'z kartochkalari, maxsus testlar va 3D o'yinlar.
                </p>

                <!-- Darajalar tanlovi -->
                <div class="curriculum-level-tabs" style="display:flex; justify-content:center; gap:12px; margin-top: 24px; flex-wrap:wrap;">
                    ${levels.map(l => `
                        <button class="curr-lvl-btn ${l === currentLevel ? 'active' : ''}" data-lvl="${l}" style="display:flex; align-items:center; gap:8px; padding: 12px 22px; border-radius: 14px; font-size: 15px; font-weight: 700; cursor:pointer; transition: all 0.25s ease; border: 1px solid ${l === currentLevel ? 'var(--accent-color, #3b82f6)' : 'rgba(255,255,255,0.08)'}; background: ${l === currentLevel ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.15))' : 'rgba(255,255,255,0.03)'}; color: ${l === currentLevel ? '#ffffff' : 'var(--text-secondary)'}; box-shadow: ${l === currentLevel ? '0 8px 20px rgba(59, 130, 246, 0.25)' : 'none'};">
                            <span style="font-size: 18px;">${levelIcons[l]}</span>
                            <span>${levelNames[l]}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        if (!levelData || !levelData.topics || !levelData.topics.length) {
            html += `
                <div class="empty-state" style="text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 40px; margin-bottom: 12px;">⏳</div>
                    <h3 style="color: var(--text-primary); margin-bottom: 8px;">${currentLevel} darajasi ma'lumotlari yuklanmoqda...</h3>
                    <p style="color: var(--text-secondary); font-size: 14px;">Iltimos, bir necha soniya kuting.</p>
                </div>
            `;
            container.innerHTML = html;
            bindLevelEvents();
            return;
        }

        // 7 ta mavzu kartalari ro'yxati
        html += `
            <div class="curriculum-topics-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-top: 16px;">
                ${levelData.topics.map(topic => {
                    const prog = getTopicProgress(topic.id);
                    return `
                        <div class="curr-topic-card" data-topic-id="${topic.id}" style="background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 22px; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                            ${prog.testPassed ? `
                                <div style="position: absolute; top: 14px; right: 14px; background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.4); color: #4ade80; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; display:flex; align-items:center; gap:4px;">
                                    ✓ O'zlashtirildi
                                </div>
                            ` : ''}

                            <div>
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
                                    <div style="width: 46px; height: 46px; border-radius: 14px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); display: flex; align-items: center; justify-content: center; font-size: 24px;">
                                        ${topic.icon || '📖'}
                                    </div>
                                    <div>
                                        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #60a5fa;">
                                            ${currentLevel} &bull; ${topic.number}-Mavzu
                                        </div>
                                        <h3 style="font-size: 17px; font-weight: 700; color: #ffffff; margin: 2px 0 0 0; line-height: 1.3;">
                                            ${topic.title}
                                        </h3>
                                        <div style="font-size: 13px; color: #94a3b8; font-style: italic; margin-top: 2px;">
                                            ${topic.germanTitle || ''}
                                        </div>
                                    </div>
                                </div>

                                <p style="font-size: 13px; color: #cbd5e1; line-height: 1.5; margin: 0 0 18px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                    ${topic.description || ''}
                                </p>
                            </div>

                            <!-- 4 ta interaktiv tugma -->
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                                <button class="topic-action-btn" data-topic-id="${topic.id}" data-action="theory" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 8px; border-radius: 12px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1px solid rgba(59, 130, 246, 0.3); background: rgba(59, 130, 246, 0.12); color: #93c5fd; transition: all 0.2s;">
                                    <span>📖</span> Dars
                                </button>
                                <button class="topic-action-btn" data-topic-id="${topic.id}" data-action="flashcards" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 8px; border-radius: 12px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1px solid rgba(168, 85, 247, 0.3); background: rgba(168, 85, 247, 0.12); color: #d8b4fe; transition: all 0.2s;">
                                    <span>🎴</span> Lug'at (${(topic.flashcards || []).length})
                                </button>
                                <button class="topic-action-btn" data-topic-id="${topic.id}" data-action="quiz" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 8px; border-radius: 12px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1px solid rgba(34, 197, 94, 0.3); background: rgba(34, 197, 94, 0.12); color: #86efac; transition: all 0.2s;">
                                    <span>📝</span> Test (${(topic.test || []).length})
                                </button>
                                <button class="topic-action-btn" data-topic-id="${topic.id}" data-action="game" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 8px; border-radius: 12px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1px solid rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.12); color: #fde68a; transition: all 0.2s;">
                                    <span>🎮</span> O'yin
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = html;
        bindLevelEvents();
        bindTopicCardEvents();
    }

    function bindLevelEvents() {
        document.querySelectorAll('.curr-lvl-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lvl = btn.getAttribute('data-lvl');
                if (lvl) {
                    renderCurriculumHome(lvl);
                    if (history && history.pushState) {
                        history.pushState({ level: lvl }, '', `#${lvl.toLowerCase()}`);
                    }
                }
            });
        });
    }

    function bindTopicCardEvents() {
        document.querySelectorAll('.topic-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const topicId = btn.getAttribute('data-topic-id');
                const action = btn.getAttribute('data-action');
                openTopicStudio(topicId, action);
            });
        });

        document.querySelectorAll('.curr-topic-card').forEach(card => {
            card.addEventListener('click', () => {
                const topicId = card.getAttribute('data-topic-id');
                openTopicStudio(topicId, 'theory');
            });
        });
    }

    // Interaktiv O'quv Studiyasi Modali
    function openTopicStudio(topicId, initialTab = 'theory') {
        const curriculum = window.deutschCurriculum || {};
        const levelData = curriculum[currentLevel];
        if (!levelData || !levelData.topics) return;

        const topic = levelData.topics.find(t => t.id === topicId);
        if (!topic) return;

        currentTopic = topic;
        currentActiveTab = initialTab;

        let modal = document.getElementById('curriculum-studio-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'curriculum-studio-modal';
            modal.className = 'modal-overlay animate-fade-in';
            document.body.appendChild(modal);
        }

        renderStudioModalContent(modal);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeTopicStudio() {
        const modal = document.getElementById('curriculum-studio-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.body.style.overflow = '';
        renderCurriculumHome(currentLevel);
    }

    function renderStudioModalContent(modal) {
        if (!currentTopic) return;
        const topic = currentTopic;

        modal.innerHTML = `
            <div class="modal-container studio-container" style="max-width: 900px; width: 95%; max-height: 90vh; background: #0f172a; border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.6);">
                <!-- Modal Yuqori Paneli -->
                <div style="padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; background: rgba(15, 23, 42, 0.8);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 26px;">${topic.icon || '📖'}</span>
                        <div>
                            <div style="font-size: 12px; color: #60a5fa; font-weight: 700;">
                                ${currentLevel} &bull; ${topic.number}-MAVZU
                            </div>
                            <h2 style="font-size: 18px; font-weight: 800; color: #ffffff; margin: 0;">
                                ${topic.title} <span style="font-weight: 400; color: #94a3b8; font-size: 14px;">(${topic.germanTitle || ''})</span>
                            </h2>
                        </div>
                    </div>
                    <button class="studio-close-btn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-size: 20px; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                        &times;
                    </button>
                </div>

                <!-- Modal Ichki Tablari -->
                <div style="display: flex; gap: 8px; padding: 12px 24px; background: rgba(30, 41, 59, 0.4); border-bottom: 1px solid rgba(255,255,255,0.06); overflow-x: auto;">
                    <button class="studio-tab-btn ${currentActiveTab === 'theory' ? 'active' : ''}" data-tab="theory" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid ${currentActiveTab === 'theory' ? '#3b82f6' : 'transparent'}; background: ${currentActiveTab === 'theory' ? 'rgba(59,130,246,0.2)' : 'transparent'}; color: ${currentActiveTab === 'theory' ? '#60a5fa' : '#94a3b8'};">
                        <span>📖</span> Dars va Nazariya
                    </button>
                    <button class="studio-tab-btn ${currentActiveTab === 'flashcards' ? 'active' : ''}" data-tab="flashcards" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid ${currentActiveTab === 'flashcards' ? '#a855f7' : 'transparent'}; background: ${currentActiveTab === 'flashcards' ? 'rgba(168,85,247,0.2)' : 'transparent'}; color: ${currentActiveTab === 'flashcards' ? '#c084fc' : '#94a3b8'};">
                        <span>🎴</span> Lug'at Kartochkalari (${(topic.flashcards || []).length})
                    </button>
                    <button class="studio-tab-btn ${currentActiveTab === 'quiz' ? 'active' : ''}" data-tab="quiz" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid ${currentActiveTab === 'quiz' ? '#22c55e' : 'transparent'}; background: ${currentActiveTab === 'quiz' ? 'rgba(34,197,94,0.2)' : 'transparent'}; color: ${currentActiveTab === 'quiz' ? '#4ade80' : '#94a3b8'};">
                        <span>📝</span> Mavzuli Test (${(topic.test || []).length})
                    </button>
                    <button class="studio-tab-btn ${currentActiveTab === 'game' ? 'active' : ''}" data-tab="game" style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid ${currentActiveTab === 'game' ? '#f59e0b' : 'transparent'}; background: ${currentActiveTab === 'game' ? 'rgba(245,158,11,0.2)' : 'transparent'}; color: ${currentActiveTab === 'game' ? '#fbbf24' : '#94a3b8'};">
                        <span>🎮</span> Juftlash O'yini
                    </button>
                </div>

                <!-- Modal Asosiy Kontent Maydoni -->
                <div id="studio-tab-content" style="padding: 24px; overflow-y: auto; flex: 1;">
                    <!-- Dinamik ravishda tanlangan tab yuklanadi -->
                </div>
            </div>
        `;

        // Eventlar
        modal.querySelector('.studio-close-btn').addEventListener('click', closeTopicStudio);
        modal.querySelectorAll('.studio-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentActiveTab = btn.getAttribute('data-tab');
                modal.querySelectorAll('.studio-tab-btn').forEach(b => {
                    const isActive = b.getAttribute('data-tab') === currentActiveTab;
                    b.classList.toggle('active', isActive);
                    b.style.border = isActive ? '1px solid #3b82f6' : 'transparent';
                    b.style.background = isActive ? 'rgba(59,130,246,0.2)' : 'transparent';
                    b.style.color = isActive ? '#60a5fa' : '#94a3b8';
                });
                renderCurrentStudioTab();
            });
        });

        renderCurrentStudioTab();
    }

    function renderCurrentStudioTab() {
        const body = document.getElementById('studio-tab-content');
        if (!body || !currentTopic) return;

        if (currentActiveTab === 'theory') {
            renderTheoryTab(body, currentTopic);
        } else if (currentActiveTab === 'flashcards') {
            renderFlashcardsTab(body, currentTopic);
        } else if (currentActiveTab === 'quiz') {
            renderQuizTab(body, currentTopic);
        } else if (currentActiveTab === 'game') {
            renderGameTab(body, currentTopic);
        }
    }

    // 1. NAZARIYA VA DARS TABI
    function renderTheoryTab(container, topic) {
        const t = topic.theory || {};
        let html = `
            <div class="theory-view" style="color: #e2e8f0; line-height: 1.7; font-size: 15px;">
                ${t.summary ? `
                    <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px; color: #cbd5e1; font-size: 15px;">
                        ${t.summary}
                    </div>
                ` : ''}

                ${(t.sections || []).map(sec => `
                    <div class="theory-section" style="margin-bottom: 28px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 20px;">
                        <h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <span style="color: #60a5fa;">§</span> ${sec.heading}
                        </h3>
                        <div style="color: #cbd5e1; margin-bottom: 16px;">
                            ${sec.content}
                        </div>

                        ${(sec.examples || []).length ? `
                            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px;">
                                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; letter-spacing: 0.05em;">
                                    Misollar &bull; Beispielen (Ovozli eshiting):
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 10px;">
                                    ${sec.examples.map(ex => `
                                        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 8px 12px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                                            <div>
                                                <div style="font-weight: 700; color: #60a5fa; font-size: 15px;">${ex.de}</div>
                                                <div style="color: #e2e8f0; font-size: 13.5px;">${ex.uz}</div>
                                                ${ex.tip ? `<div style="color: #94a3b8; font-size: 11.5px; margin-top: 2px;">💡 ${ex.tip}</div>` : ''}
                                            </div>
                                            <button onclick="window.speakGerman('${escapeAttr(ex.de)}')" style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #93c5fd; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;" title="Ovoz chiqarish">
                                                🔊
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}

                ${(t.keyRules || []).length ? `
                    <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; padding: 18px 20px; margin-top: 24px;">
                        <h4 style="color: #fbbf24; margin: 0 0 10px 0; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                            <span>⭐</span> Oltin Qoidalar:
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: #fde68a; font-size: 14px;">
                            ${t.keyRules.map(r => `<li style="margin-bottom: 6px;">${r}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div style="display: flex; justify-content: center; gap: 14px; margin-top: 30px;">
                    <button class="btn-primary" onclick="document.querySelector('.studio-tab-btn[data-tab=\\'flashcards\\']').click();" style="display:flex; align-items:center; gap:8px; padding: 12px 24px; border-radius: 14px; background: #3b82f6; color: #fff; font-weight: 700; cursor: pointer; border: none;">
                        <span>🎴</span> Lug'at kartochkalariga o'tish &rarr;
                    </button>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    // 2. LUG'AT VA FLASHCARDS TABI
    let fcCurrentIndex = 0;
    let fcFlipped = false;

    function renderFlashcardsTab(container, topic) {
        const cards = topic.flashcards || [];
        if (!cards.length) {
            container.innerHTML = '<p style="color: #94a3b8; text-align: center;">Bu mavzuda hozircha so\'z kartochkalari yo\'q.</p>';
            return;
        }

        fcCurrentIndex = 0;
        fcFlipped = false;

        function updateCardView() {
            const card = cards[fcCurrentIndex];
            fcFlipped = false;

            container.innerHTML = `
                <div style="max-width: 520px; margin: 0 auto; text-align: center;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: #94a3b8; font-size: 13px;">
                        <span>So'z ${fcCurrentIndex + 1} / ${cards.length}</span>
                        <div style="display:flex; gap: 8px;">
                            <button id="fc-sound-btn" style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #93c5fd; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px;">
                                🔊 Talaffuz
                            </button>
                        </div>
                    </div>

                    <!-- 3D Flip Card -->
                    <div id="interactive-flip-card" style="perspective: 1000px; cursor: pointer; height: 260px; margin-bottom: 24px;">
                        <div id="flip-card-inner" style="position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; border-radius: 24px; box-shadow: 0 12px 32px rgba(0,0,0,0.4);">
                            <!-- Old tomoni (Nemischa) -->
                            <div style="position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95)); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px;">
                                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #60a5fa; letter-spacing: 0.08em; margin-bottom: 8px;">
                                    🇩🇪 Deutsch
                                </div>
                                <div style="font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
                                    ${card.front}
                                </div>
                                ${card.tip ? `<div style="font-size: 13px; color: #94a3b8;">💡 ${card.tip}</div>` : ''}
                                <div style="font-size: 11px; color: #64748b; margin-top: 18px;">
                                    🔄 Tarjimasini ko'rish uchun bosing
                                </div>
                            </div>

                            <!-- Orqa tomoni (O'zbekcha) -->
                            <div style="position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; transform: rotateY(180deg); background: linear-gradient(145deg, rgba(168, 85, 247, 0.15), rgba(15, 23, 42, 0.95)); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px;">
                                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #c084fc; letter-spacing: 0.08em; margin-bottom: 8px;">
                                    🇺🇿 O'zbekcha
                                </div>
                                <div style="font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
                                    ${card.back}
                                </div>
                                <div style="font-size: 14px; color: #93c5fd;">
                                    ${card.front}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Boshqaruv tugmalari -->
                    <div style="display: flex; justify-content: space-between; gap: 12px;">
                        <button id="fc-prev-btn" style="flex: 1; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-weight: 600; cursor: pointer;">
                            &larr; Oldingisi
                        </button>
                        <button id="fc-flip-btn" style="flex: 1.2; padding: 12px; border-radius: 12px; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #93c5fd; font-weight: 700; cursor: pointer;">
                            🔄 Aylantirish
                        </button>
                        <button id="fc-next-btn" style="flex: 1; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; font-weight: 600; cursor: pointer;">
                            Keyingisi &rarr;
                        </button>
                    </div>
                </div>
            `;

            const cardEl = document.getElementById('interactive-flip-card');
            const inner = document.getElementById('flip-card-inner');
            const toggleFlip = () => {
                fcFlipped = !fcFlipped;
                inner.style.transform = fcFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
            };

            cardEl.addEventListener('click', toggleFlip);
            document.getElementById('fc-flip-btn').addEventListener('click', toggleFlip);

            document.getElementById('fc-sound-btn').addEventListener('click', () => {
                speakGerman(card.front);
            });

            document.getElementById('fc-prev-btn').addEventListener('click', () => {
                fcCurrentIndex = (fcCurrentIndex - 1 + cards.length) % cards.length;
                updateCardView();
            });

            document.getElementById('fc-next-btn').addEventListener('click', () => {
                fcCurrentIndex = (fcCurrentIndex + 1) % cards.length;
                updateCardView();
            });
        }

        updateCardView();
    }

    // 3. MAVZULI TEST TABI
    function renderQuizTab(container, topic) {
        const questions = topic.test || [];
        if (!questions.length) {
            container.innerHTML = '<p style="color: #94a3b8; text-align: center;">Bu mavzuda test savollari topilmadi.</p>';
            return;
        }

        let currentQIdx = 0;
        let score = 0;
        let answered = false;

        function renderQuestion() {
            if (currentQIdx >= questions.length) {
                const percentage = Math.round((score / questions.length) * 100);
                const passed = percentage >= 70;
                saveTopicProgress(topic.id, { testPassed: passed, score: percentage, completed: true });

                container.innerHTML = `
                    <div style="text-align: center; max-width: 480px; margin: 30px auto; padding: 30px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px;">
                        <div style="font-size: 54px; margin-bottom: 12px;">${passed ? '🎉' : '📚'}</div>
                        <h2 style="color: #ffffff; margin-bottom: 8px;">Test Yakunlandi!</h2>
                        <div style="font-size: 32px; font-weight: 800; color: ${passed ? '#4ade80' : '#f59e0b'}; margin-bottom: 12px;">
                            ${percentage}%
                        </div>
                        <p style="color: #cbd5e1; font-size: 15px; margin-bottom: 24px;">
                            ${passed ? 'Ajoyib natija! Ushbu mavzuni to\'liq o\'zlashtirdingiz.' : 'Yaxshi harakat, ammo mavzuni yana bir bor takrorlab qayta topshirishingizni tavsiya qilamiz.'}
                        </p>
                        <div style="display: flex; justify-content: center; gap: 12px;">
                            <button id="quiz-restart-btn" style="padding: 12px 24px; border-radius: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-weight: 600; cursor: pointer;">
                                Qayta urinish
                            </button>
                            <button id="quiz-to-game-btn" style="padding: 12px 24px; border-radius: 12px; background: #3b82f6; border: none; color: #fff; font-weight: 700; cursor: pointer;">
                                O'yin o'ynash &rarr;
                            </button>
                        </div>
                    </div>
                `;

                document.getElementById('quiz-restart-btn').addEventListener('click', () => {
                    renderQuizTab(container, topic);
                });
                document.getElementById('quiz-to-game-btn').addEventListener('click', () => {
                    document.querySelector('.studio-tab-btn[data-tab="game"]').click();
                });
                return;
            }

            const q = questions[currentQIdx];
            answered = false;

            container.innerHTML = `
                <div style="max-width: 640px; margin: 0 auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                        <span style="font-size: 13px; font-weight: 700; color: #60a5fa;">SAVOL ${currentQIdx + 1} / ${questions.length}</span>
                        <span style="font-size: 13px; color: #94a3b8;">To'g'ri: ${score}</span>
                    </div>

                    <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 24px; margin-bottom: 20px;">
                        <h3 style="color: #ffffff; font-size: 17px; font-weight: 700; line-height: 1.5; margin: 0 0 20px 0;">
                            ${q.q}
                        </h3>

                        <div id="quiz-options-list" style="display: flex; flex-direction: column; gap: 10px;">
                            ${q.options.map((opt, idx) => `
                                <button class="quiz-opt-btn" data-idx="${idx}" style="text-align: left; padding: 14px 18px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #e2e8f0; font-size: 15px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px;">
                                    <span style="width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #94a3b8;">
                                        ${String.fromCharCode(65 + idx)}
                                    </span>
                                    <span>${opt}</span>
                                </button>
                            `).join('')}
                        </div>

                        <div id="quiz-explanation-box" style="display: none; margin-top: 18px; padding: 14px; border-radius: 12px; font-size: 14px; line-height: 1.5;"></div>
                    </div>

                    <div style="text-align: right;">
                        <button id="quiz-next-btn" style="display: none; padding: 12px 24px; border-radius: 12px; background: #3b82f6; border: none; color: #fff; font-weight: 700; cursor: pointer;">
                            Keyingi savol &rarr;
                        </button>
                    </div>
                </div>
            `;

            const nextBtn = document.getElementById('quiz-next-btn');
            const expBox = document.getElementById('quiz-explanation-box');

            document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (answered) return;
                    answered = true;
                    const chosenIdx = parseInt(btn.getAttribute('data-idx'), 10);
                    const isCorrect = chosenIdx === q.answer;

                    if (isCorrect) {
                        score++;
                        btn.style.background = 'rgba(34, 197, 94, 0.25)';
                        btn.style.borderColor = '#22c55e';
                        btn.style.color = '#86efac';
                    } else {
                        btn.style.background = 'rgba(239, 68, 68, 0.25)';
                        btn.style.borderColor = '#ef4444';
                        btn.style.color = '#fca5a5';

                        const correctBtn = document.querySelector(`.quiz-opt-btn[data-idx="${q.answer}"]`);
                        if (correctBtn) {
                            correctBtn.style.background = 'rgba(34, 197, 94, 0.2)';
                            correctBtn.style.borderColor = '#22c55e';
                        }
                    }

                    if (q.explanation) {
                        expBox.style.display = 'block';
                        expBox.style.background = isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                        expBox.style.border = isCorrect ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.3)';
                        expBox.style.color = isCorrect ? '#86efac' : '#fca5a5';
                        expBox.innerHTML = `<strong>${isCorrect ? '✅ To\'g\'ri!' : '❌ Noto\'g\'ri!'}</strong> ${q.explanation}`;
                    }

                    nextBtn.style.display = 'inline-block';
                });
            });

            nextBtn.addEventListener('click', () => {
                currentQIdx++;
                renderQuestion();
            });
        }

        renderQuestion();
    }

    // 4. JUFTLASH O'YINI TABI
    function renderGameTab(container, topic) {
        const pairs = topic.gamePairs || [];
        if (!pairs.length) {
            container.innerHTML = '<p style="color: #94a3b8; text-align: center;">Bu mavzuda o\'yin ma\'lumotlari mavjud emas.</p>';
            return;
        }

        // 8 ta juftlik kartalarini yaratish
        let cards = [];
        pairs.forEach((p, idx) => {
            cards.push({ id: idx, text: p.de, type: 'de', pairId: idx });
            cards.push({ id: idx + 100, text: p.uz, type: 'uz', pairId: idx });
        });

        // Aralashtirish
        cards.sort(() => Math.random() - 0.5);

        let selected = [];
        let matched = [];
        let moves = 0;

        function renderGameBoard() {
            const allMatched = matched.length === pairs.length;

            container.innerHTML = `
                <div style="max-width: 640px; margin: 0 auto; text-align: center;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: #94a3b8; font-size: 13px;">
                        <span>Moslashtirildi: <strong style="color:#4ade80;">${matched.length}</strong> / ${pairs.length}</span>
                        <span>Urinishlar: <strong>${moves}</strong></span>
                    </div>

                    ${allMatched ? `
                        <div style="padding: 30px; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: 20px; margin-bottom: 20px;">
                            <div style="font-size: 48px; margin-bottom: 10px;">🏆</div>
                            <h3 style="color: #4ade80; margin: 0 0 8px 0;">Tabriklaymiz! Barcha so'zlarni topdingiz!</h3>
                            <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 16px 0;">Siz ${moves} ta urinishda barcha juftliklarni to'g'ri topdingiz.</p>
                            <button id="game-restart-btn" style="padding: 10px 20px; border-radius: 10px; background: #22c55e; border: none; color: #fff; font-weight: 700; cursor: pointer;">
                                Qayta o'ynash
                            </button>
                        </div>
                    ` : `
                        <div class="match-game-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                            ${cards.map(card => {
                                const isMatched = matched.includes(card.pairId);
                                const isSelected = selected.some(s => s.id === card.id);

                                return `
                                    <button class="match-card-btn ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}" data-card-id="${card.id}" style="height: 80px; padding: 8px; border-radius: 14px; font-size: 13px; font-weight: 700; cursor: ${isMatched ? 'default' : 'pointer'}; border: 1px solid ${isMatched ? '#22c55e' : (isSelected ? '#3b82f6' : 'rgba(255,255,255,0.1)')}; background: ${isMatched ? 'rgba(34, 197, 94, 0.2)' : (isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(30, 41, 59, 0.8)')}; color: ${isMatched ? '#86efac' : (isSelected ? '#93c5fd' : '#ffffff')}; transition: all 0.2s; display: flex; align-items: center; justify-content: center; text-align: center; word-break: break-word; visibility: ${isMatched ? 'hidden' : 'visible'};">
                                        ${card.text}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
            `;

            if (allMatched) {
                document.getElementById('game-restart-btn').addEventListener('click', () => {
                    renderGameTab(container, topic);
                });
                return;
            }

            document.querySelectorAll('.match-card-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const cardId = parseInt(btn.getAttribute('data-card-id'), 10);
                    const card = cards.find(c => c.id === cardId);
                    if (!card || matched.includes(card.pairId) || selected.some(s => s.id === card.id)) return;

                    if (card.type === 'de') speakGerman(card.text);

                    selected.push(card);
                    if (selected.length === 2) {
                        moves++;
                        const [c1, c2] = selected;
                        if (c1.pairId === c2.pairId && c1.type !== c2.type) {
                            matched.push(c1.pairId);
                            selected = [];
                            renderGameBoard();
                        } else {
                            renderGameBoard();
                            setTimeout(() => {
                                selected = [];
                                renderGameBoard();
                            }, 700);
                        }
                    } else {
                        renderGameBoard();
                    }
                });
            });
        }

        renderGameBoard();
    }

    // Global eksport
    window.renderDeutschCurriculum = renderCurriculumHome;
    window.openDeutschTopicStudio = openTopicStudio;

    // Sahifa yuklanganda ishga tushirish
    document.addEventListener('DOMContentLoaded', () => {
        const hash = (window.location.hash || '').toUpperCase();
        if (hash === '#A1' || hash === '#A2' || hash === '#B1' || hash === '#B2') {
            currentLevel = hash.replace('#', '');
        }
        renderCurriculumHome(currentLevel);
    });

})();
