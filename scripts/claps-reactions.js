// ============================================================
// ABDUGOFFOROV — CLAPS, LIVE REACTIONS & QUOTE SELECTION SHARE
// Medium-Style Claps (50 max), Live Emojis & Floating Quote Share
// ============================================================

(function () {
    'use strict';

    // 0. Ensure CSS Stylesheet is loaded
    function ensureStylesheet() {
        const cssId = 'claps-reactions-css';
        if (!document.getElementById(cssId)) {
            const existing = document.querySelector('link[href*="claps-reactions.css"]');
            if (!existing) {
                const link = document.createElement('link');
                link.id = cssId;
                link.rel = 'stylesheet';
                link.href = 'css/claps-reactions.css';
                document.head.appendChild(link);
            }
        }
    }

    // 1. Web Audio API Micro-Sound Engine (Synthesized dynamically)
    let audioCtx = null;

    function playMicroSound(type = 'clap', count = 1) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!audioCtx) {
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const now = audioCtx.currentTime;

            if (type === 'clap') {
                // Ascending melodic pop (Medium-style rising pitch feedback)
                const baseFreq = 480;
                const freq = baseFreq + Math.min(count, 50) * 11;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.07);

                gain.gain.setValueAtTime(0.14, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.07);
            } else if (type === 'emoji') {
                // Pleasant chime/bubble pop for emojis
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(620, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            }
        } catch (e) {
            // Audio policy or unsupported browser
        }
    }

    // 2. Storage Helpers
    const STORAGE_PREFIX_CLAPS = 'post_claps_';
    const STORAGE_PREFIX_TOTAL = 'post_claps_total_';
    const STORAGE_PREFIX_REACTIONS = 'post_reactions_';

    function getUserClaps(postId) {
        try {
            return parseInt(localStorage.getItem(STORAGE_PREFIX_CLAPS + postId), 10) || 0;
        } catch (e) {
            return 0;
        }
    }

    function getTotalClaps(postId) {
        try {
            const stored = localStorage.getItem(STORAGE_PREFIX_TOTAL + postId);
            if (stored !== null) {
                return parseInt(stored, 10) || 0;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    function addClap(postId) {
        const userClaps = getUserClaps(postId);
        if (userClaps >= 50) {
            return { success: false, userClaps, totalClaps: getTotalClaps(postId), maxReached: true };
        }

        const newUserClaps = userClaps + 1;
        const newTotalClaps = getTotalClaps(postId) + 1;

        try {
            localStorage.setItem(STORAGE_PREFIX_CLAPS + postId, newUserClaps);
            localStorage.setItem(STORAGE_PREFIX_TOTAL + postId, newTotalClaps);
        } catch (e) {}

        return { success: true, userClaps: newUserClaps, totalClaps: newTotalClaps, maxReached: newUserClaps >= 50 };
    }

    function getReactions(postId) {
        const emptyReactions = { '🔥': 0, '💡': 0, '👏': 0, '❤️': 0 };
        try {
            const raw = localStorage.getItem(STORAGE_PREFIX_REACTIONS + postId);
            if (raw) {
                return { ...emptyReactions, ...JSON.parse(raw) };
            }
            return emptyReactions;
        } catch (e) {
            return emptyReactions;
        }
    }

    function incrementReaction(postId, emoji) {
        const reactions = getReactions(postId);
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        try {
            localStorage.setItem(STORAGE_PREFIX_REACTIONS + postId, JSON.stringify(reactions));
        } catch (e) {}
        return reactions;
    }

    // 3. UI Animation Effects
    function spawnFloatingBadge(targetEl, countText) {
        const badge = document.createElement('div');
        badge.className = 'clap-floating-badge';
        badge.textContent = countText;
        targetEl.appendChild(badge);

        badge.addEventListener('animationend', () => {
            badge.remove();
        });
    }

    function spawnParticleBurst(targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
        const numParticles = 8;

        for (let i = 0; i < numParticles; i++) {
            const p = document.createElement('div');
            p.className = 'clap-particle';
            const size = Math.floor(Math.random() * 4 + 4);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = (Math.PI * 2 * i) / numParticles + (Math.random() * 0.4 - 0.2);
            const distance = Math.random() * 32 + 24;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 25; // drift upward

            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.background = color;
            p.style.setProperty('--tx', `${tx}px`);
            p.style.setProperty('--ty', `${ty}px`);
            p.style.left = '50%';
            p.style.top = '50%';

            targetEl.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        }
    }

    function spawnFloatingEmoji(targetEl, emoji) {
        const span = document.createElement('span');
        span.className = 'floating-emoji';
        span.textContent = emoji;
        span.style.left = `${Math.random() * 20 + 20}%`;
        span.style.top = '0';
        targetEl.appendChild(span);
        span.addEventListener('animationend', () => span.remove());
    }

    // 4. SVG Clap Icon Markup
    const CLAP_SVG = `
        <svg class="clap-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
    `;

    // 5. Enhance Post Card with Clap Button - Disabled per user request (remove artificial likes)
    function enhancePostCard(card) {
        if (!card) return;
        const existing = card.querySelector('.clap-btn-wrapper, .clap-btn');
        if (existing) existing.remove();
    }

    function handleClapClick(postId, btnEl, wrapperEl) {
        const result = addClap(postId);
        if (!result.success && result.maxReached) {
            spawnFloatingBadge(wrapperEl, "Maksimal: 50 👏");
            return;
        }

        // Play Web Audio pop
        playMicroSound('clap', result.userClaps);

        // Update counts across the page
        syncClapCount(postId, result.totalClaps, result.userClaps);

        // Micro-animations
        btnEl.classList.remove('clap-animate');
        void btnEl.offsetWidth; // trigger reflow
        btnEl.classList.add('clap-animate');
        btnEl.classList.add('clapped');

        spawnFloatingBadge(wrapperEl, `+${result.userClaps}`);
        spawnParticleBurst(wrapperEl);
    }

    function syncClapCount(postId, totalClaps, userClaps) {
        document.querySelectorAll(`.clap-btn[data-post-id="${postId}"] .clap-count, .modal-clap-btn[data-post-id="${postId}"] .clap-count`).forEach(el => {
            el.textContent = totalClaps;
        });
        document.querySelectorAll(`.clap-btn[data-post-id="${postId}"], .modal-clap-btn[data-post-id="${postId}"]`).forEach(btn => {
            if (userClaps > 0) btn.classList.add('clapped');
        });
    }

    // 6. Enhance Post Detail Modal with Claps & Live Reactions
    function enhanceDetailModal() {
        const modalBody = document.getElementById('detail-modal-body');
        if (!modalBody) return;

        // Find postId from modal content
        const likeStat = modalBody.querySelector('[id^="modal-like-"]');
        if (!likeStat) return;
        const postId = likeStat.id.replace('modal-like-', '');
        if (!postId) return;

        // 6A. Add Clap button in header post-meta if not yet present
        const modalMeta = modalBody.querySelector('.modal-post-meta');
        if (modalMeta && !modalMeta.querySelector('.modal-clap-btn')) {
            const totalClaps = getTotalClaps(postId);
            const userClaps = getUserClaps(postId);

            const clapWrapper = document.createElement('div');
            clapWrapper.className = 'clap-btn-wrapper';

            const clapBtn = document.createElement('button');
            clapBtn.type = 'button';
            clapBtn.className = 'modal-clap-btn' + (userClaps > 0 ? ' clapped' : '');
            clapBtn.setAttribute('data-post-id', postId);
            clapBtn.title = "Qarsak chalish (Medium uslubida, 50 tagacha)";
            clapBtn.innerHTML = `
                ${CLAP_SVG}
                <span class="clap-count">${totalClaps}</span>
            `;

            clapBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleClapClick(postId, clapBtn, clapWrapper);
            });

            clapWrapper.appendChild(clapBtn);
            modalMeta.appendChild(clapWrapper);
        }

        // 6B. Add Live Emoji Reaction Bar before comments-section
        if (!modalBody.querySelector('.live-reactions-container')) {
            const commentsSection = modalBody.querySelector('.comments-section');
            const reactions = getReactions(postId);
            const totalClaps = getTotalClaps(postId);
            const userClaps = getUserClaps(postId);

            const container = document.createElement('div');
            container.className = 'live-reactions-container';
            container.innerHTML = `
                <div class="live-reactions-header">
                    <span class="reaction-title">
                        <span>✨ Jonli reaksiyalar &amp; Qarsaklar</span>
                    </span>
                    <span style="font-size:12px; font-weight:normal; opacity:0.8;">Fikringizni bildiring</span>
                </div>
                <div class="live-reactions-bar">
                    <div class="clap-btn-wrapper">
                        <button type="button" class="modal-clap-btn${userClaps > 0 ? ' clapped' : ''}" data-post-id="${postId}" style="padding: 8px 16px; font-size: 14px;">
                            ${CLAP_SVG}
                            <span>Qarsak</span>
                            <span class="clap-count" style="font-weight:700;">${totalClaps}</span>
                        </button>
                    </div>
                    <button type="button" class="reaction-btn" data-emoji="🔥">
                        <span class="reaction-emoji">🔥</span>
                        <span class="reaction-count">${reactions['🔥'] || 0}</span>
                    </button>
                    <button type="button" class="reaction-btn" data-emoji="💡">
                        <span class="reaction-emoji">💡</span>
                        <span class="reaction-count">${reactions['💡'] || 0}</span>
                    </button>
                    <button type="button" class="reaction-btn" data-emoji="👏">
                        <span class="reaction-emoji">👏</span>
                        <span class="reaction-count">${reactions['👏'] || 0}</span>
                    </button>
                    <button type="button" class="reaction-btn" data-emoji="❤️">
                        <span class="reaction-emoji">❤️</span>
                        <span class="reaction-count">${reactions['❤️'] || 0}</span>
                    </button>
                </div>
            `;

            // Wire up clap button inside reaction bar
            const barClapBtn = container.querySelector('.modal-clap-btn');
            const barClapWrapper = container.querySelector('.clap-btn-wrapper');
            barClapBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleClapClick(postId, barClapBtn, barClapWrapper);
            });

            // Wire up emoji reaction buttons
            container.querySelectorAll('.reaction-btn').forEach(btn => {
                const emoji = btn.getAttribute('data-emoji');
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const updated = incrementReaction(postId, emoji);
                    btn.querySelector('.reaction-count').textContent = updated[emoji];
                    btn.classList.add('user-reacted');

                    // Audio feedback
                    playMicroSound('emoji');

                    // Animation
                    btn.classList.remove('reaction-pulse');
                    void btn.offsetWidth;
                    btn.classList.add('reaction-pulse');

                    spawnFloatingEmoji(btn, emoji);
                });
            });

            if (commentsSection) {
                modalBody.insertBefore(container, commentsSection);
            } else {
                modalBody.appendChild(container);
            }
        }
    }

    // 7. Quote Selection Share (Telegram & Copy Popover)
    let quotePopover = null;
    let currentSelectedText = '';

    function createQuotePopover() {
        if (quotePopover) return quotePopover;

        const popover = document.createElement('div');
        popover.className = 'quote-share-popover arrow-bottom';
        popover.id = 'quote-share-popover';
        popover.innerHTML = `
            <button type="button" class="quote-popover-btn telegram-btn" title="Telegramda ulashish">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.18 3.35-1.38 3.73-1.39.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                <span>Telegram</span>
            </button>
            <div class="quote-popover-divider"></div>
            <button type="button" class="quote-popover-btn copy-btn" title="Iqtibosdan nusxa olish">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Nusxa</span>
            </button>
            <div class="quote-copied-tooltip" id="quote-copied-tooltip">Nusxalandi! ✓</div>
        `;

        document.body.appendChild(popover);

        // Telegram click handler
        const tgBtn = popover.querySelector('.telegram-btn');
        tgBtn.addEventListener('mousedown', (e) => e.stopPropagation());
        tgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!currentSelectedText) return;
            const quoteText = '“' + currentSelectedText.trim() + '”';
            const pageUrl = window.location.href;
            const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(quoteText)}`;
            window.open(tgUrl, '_blank', 'noopener,noreferrer');
            hideQuotePopover();
        });

        // Copy click handler
        const copyBtn = popover.querySelector('.copy-btn');
        const tooltip = popover.querySelector('#quote-copied-tooltip');
        copyBtn.addEventListener('mousedown', (e) => e.stopPropagation());
        copyBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!currentSelectedText) return;

            const textToCopy = `“${currentSelectedText.trim()}” — Abdugofforov (${window.location.origin || 'https://abdugofforov.uz'})`;

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    tempInput.remove();
                }

                playMicroSound('clap', 10);
                tooltip.classList.add('show');
                setTimeout(() => {
                    tooltip.classList.remove('show');
                    hideQuotePopover();
                }, 1000);
            } catch (err) {
                console.warn('Copy failed', err);
            }
        });

        quotePopover = popover;
        return popover;
    }

    function hideQuotePopover() {
        if (quotePopover && quotePopover.classList.contains('active')) {
            quotePopover.classList.remove('active');
        }
    }

    function checkTextSelection() {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            hideQuotePopover();
            return;
        }

        const text = selection.toString().trim();
        if (text.length < 3) {
            hideQuotePopover();
            return;
        }

        // Don't trigger if user is selecting inside an input or textarea or inside the popover
        const anchorNode = selection.anchorNode;
        if (anchorNode) {
            const parent = anchorNode.nodeType === 3 ? anchorNode.parentElement : anchorNode;
            if (parent && (parent.closest('input, textarea, [contenteditable="true"]') || parent.closest('#quote-share-popover'))) {
                return;
            }
        }

        currentSelectedText = text;
        const popover = createQuotePopover();

        try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) {
                hideQuotePopover();
                return;
            }

            // Calculate position
            const popoverWidth = 190;
            const popoverHeight = 40;
            let top = rect.top + window.scrollY - popoverHeight - 12;
            let left = rect.left + window.scrollX + (rect.width / 2) - (popoverWidth / 2);

            // Bounds protection (horizontal)
            const margin = 12;
            if (left < margin) {
                left = margin;
            } else if (left + popoverWidth > window.innerWidth - margin) {
                left = window.innerWidth - popoverWidth - margin;
            }

            // Arrow flip if too close to viewport top
            if (rect.top < 65) {
                top = rect.bottom + window.scrollY + 12;
                popover.classList.remove('arrow-bottom');
                popover.classList.add('arrow-top');
            } else {
                popover.classList.remove('arrow-top');
                popover.classList.add('arrow-bottom');
            }

            popover.style.top = `${Math.round(top)}px`;
            popover.style.left = `${Math.round(left)}px`;
            popover.classList.add('active');
        } catch (e) {
            hideQuotePopover();
        }
    }

    // 8. Observer & Init
    function scanAndEnhance() {
        // Enhance all post cards
        document.querySelectorAll('.post-card').forEach(enhancePostCard);

        // Check if modal is active
        const modal = document.getElementById('post-detail-modal');
        if (modal && modal.classList.contains('active')) {
            enhanceDetailModal();
        }
    }

    function init() {
        ensureStylesheet();
        scanAndEnhance();

        // Observe DOM changes for dynamically loaded posts or modal openings
        const observer = new MutationObserver(() => {
            scanAndEnhance();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        // Setup Selection Share listeners
        document.addEventListener('mouseup', () => {
            setTimeout(checkTextSelection, 10);
        });

        document.addEventListener('touchend', () => {
            setTimeout(checkTextSelection, 50);
        });

        document.addEventListener('selectionchange', () => {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) {
                hideQuotePopover();
            }
        });

        document.addEventListener('mousedown', (e) => {
            if (quotePopover && !quotePopover.contains(e.target)) {
                hideQuotePopover();
            }
        });
    }

    // Public API
    window.ClapsReactions = {
        init,
        getUserClaps,
        getTotalClaps,
        getReactions,
        enhancePostCard,
        enhanceDetailModal
    };

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
