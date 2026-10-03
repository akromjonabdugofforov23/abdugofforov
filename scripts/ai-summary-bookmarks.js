/**
 * ============================================================
 * ABDUGOFFOROV — AI POST SUMMARY (TL;DR) & OFFLINE BOOKMARKS
 * Feature 5: Intelligent extraction, 3-point accordion summary card,
 * offline bookmark persistence, filter tag integration & toast alerts.
 * ============================================================
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'bookmarked_posts';
    const CACHE_KEY = 'abdu_ai_summary_cache';

    // ------------------------------------------------------------
    // 1. DYNAMIC CSS LOADER
    // ------------------------------------------------------------
    function ensureStylesLoaded() {
        const existing = document.querySelector('link[href*="ai-summary-bookmarks.css"]');
        if (!existing) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/ai-summary-bookmarks.css';
            document.head.appendChild(link);
        }
    }

    // ------------------------------------------------------------
    // 2. HELPER FUNCTIONS
    // ------------------------------------------------------------
    function safeEscapeHTML(str) {
        if (!str || typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showNotification(message, kind = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, kind);
            return;
        }
        let el = document.getElementById('abdu-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'abdu-toast';
            el.className = 'abdu-toast';
            document.body.appendChild(el);
        }
        el.textContent = message;
        el.dataset.kind = kind;
        el.classList.add('show');
        clearTimeout(showNotification._timer);
        showNotification._timer = setTimeout(() => {
            el.classList.remove('show');
        }, 3200);
    }

    function getAllPosts() {
        if (typeof window.getPosts === 'function') {
            try {
                const list = window.getPosts();
                if (Array.isArray(list) && list.length) return list;
            } catch (_) {}
        }
        if (Array.isArray(window.posts) && window.posts.length) {
            return window.posts;
        }
        if (window.Store && typeof Store.get === 'function') {
            try {
                const stored = Store.get('abdu_posts');
                if (Array.isArray(stored) && stored.length) return stored;
            } catch (_) {}
        }
        try {
            const ls = JSON.parse(localStorage.getItem('abdu_posts') || '[]');
            if (Array.isArray(ls)) return ls;
        } catch (_) {}
        return [];
    }

    function findPostById(id) {
        if (id == null) return null;
        const posts = getAllPosts();
        return posts.find(p => String(p.id) === String(id)) || null;
    }

    // ------------------------------------------------------------
    // 3. BOOKMARKS MANAGER (OFFLINE PERSISTENCE)
    // ------------------------------------------------------------
    const BookmarkManager = {
        getBookmarks() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                const parsed = JSON.parse(raw || '[]');
                return Array.isArray(parsed) ? parsed.map(String) : [];
            } catch (e) {
                console.warn('Bookmarks parse error:', e);
                return [];
            }
        },

        saveBookmarks(list) {
            try {
                const unique = Array.from(new Set(list.map(String)));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
                this.updateUI();
                window.dispatchEvent(new CustomEvent('bookmarksUpdated', { detail: { bookmarks: unique } }));
            } catch (e) {
                console.error('Bookmarks save error:', e);
            }
        },

        isBookmarked(id) {
            if (id == null) return false;
            const list = this.getBookmarks();
            return list.includes(String(id));
        },

        toggleBookmark(id) {
            if (id == null) return false;
            const sid = String(id);
            const list = this.getBookmarks();
            const idx = list.indexOf(sid);
            let added = false;

            if (idx === -1) {
                list.unshift(sid);
                added = true;
            } else {
                list.splice(idx, 1);
                added = false;
            }

            this.saveBookmarks(list);

            if (added) {
                showNotification("🔖 Maqola saqlanganlarga qo'shildi (Oflayn foydalanish mumkin)", "success");
            } else {
                showNotification("🔖 Maqola saqlanganlardan olib tashlandi", "info");
            }

            // Agar ayni paytda Saqlanganlar filtri ochiq bo'lsa, ro'yxatni yangilaymiz
            const activeTag = document.querySelector('.toolbar .filter-tag.active');
            if (activeTag && activeTag.getAttribute('data-filter') === 'bookmarks') {
                renderBookmarkedPostsGrid();
            }

            return added;
        },

        updateUI() {
            const bookmarks = this.getBookmarks();
            const count = bookmarks.length;

            // 1. Filtr tugmasi hisoblagichini yangilash
            const badge = document.getElementById('bookmark-count-badge');
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'inline-flex' : 'none';
            }

            // 2. Post kartochkalaridagi xatcho'p tugmalarini yangilash
            document.querySelectorAll('.post-card-bookmark-btn').forEach(btn => {
                const pid = btn.getAttribute('data-post-id');
                const isSaved = bookmarks.includes(String(pid));
                btn.classList.toggle('bookmarked', isSaved);
                btn.title = isSaved ? "Saqlanganlardan o'chirish" : "Oflayn saqlab qo'yish";
                btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
            });

            // 3. Post-stats ichidagi xatcho'p tugmalarini yangilash
            document.querySelectorAll('.post-stat.bookmark-btn').forEach(btn => {
                const pid = btn.getAttribute('data-post-id');
                const isSaved = bookmarks.includes(String(pid));
                btn.classList.toggle('bookmarked', isSaved);
                btn.title = isSaved ? "Saqlanganlardan o'chirish" : "Xatcho'pga qo'shish";
            });

            // 4. Modal ichidagi xatcho'p tugmasini yangilash
            const modalBtn = document.getElementById('modal-bookmark-btn');
            if (modalBtn) {
                const pid = modalBtn.getAttribute('data-post-id');
                const isSaved = bookmarks.includes(String(pid));
                modalBtn.classList.toggle('bookmarked', isSaved);
                const label = modalBtn.querySelector('.bookmark-label');
                if (label) {
                    label.textContent = isSaved ? "Saqlangan" : "Saqlab qo'yish";
                }
            }
        }
    };

    // ------------------------------------------------------------
    // 4. INTELLIGENT AI SUMMARY GENERATOR (3-POINT TL;DR)
    // ------------------------------------------------------------
    function getSummaryCache() {
        try {
            return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        } catch (_) {
            return {};
        }
    }

    function saveSummaryCache(cache) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (_) {}
    }

    function cleanTextForAI(content) {
        if (!content || typeof content !== 'string') return '';
        return content
            .replace(/```[\s\S]*?```/g, '') // kod bloklarini olib tashlash
            .replace(/`.*?`/g, '') // inline kod
            .replace(/!\[.*?\]\(.*?\)/g, '') // rasmlar
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // link matnlari
            .replace(/<[^>]+>/g, '') // HTML teglar
            .replace(/^#+\s+(.*)$/gm, '$1. ') // sarlavhalar
            .replace(/^>\s+(.*)$/gm, '$1. ') // iqtiboslar
            .replace(/^[-*+]\s+/gm, '') // ro'yxat belgilari
            .replace(/\s+/g, ' ')
            .trim();
    }

    function extractIntelligentSummary(post) {
        if (!post) {
            return [
                "Maqola mazmuni bilan to'liq tanishib chiqing.",
                "Amaliy tavsiyalar va foydali ma'lumotlar keltirilgan.",
                "O'rganilgan ma'lumotlarni amaliyotda qo'llang."
            ];
        }

        // 1. Agar postda tayyor ai_summary bo'lsa
        if (Array.isArray(post.ai_summary) && post.ai_summary.length === 3) {
            return post.ai_summary;
        }

        // 2. Keshdan tekshirish
        const cache = getSummaryCache();
        const cacheKey = `summary_${post.id}_${(post.title || '').length}`;
        if (cache[cacheKey] && Array.isArray(cache[cacheKey]) && cache[cacheKey].length === 3) {
            return cache[cacheKey];
        }

        const title = (post.title || '').trim();
        const category = (post.category || 'Umumiy').trim();
        const rawContent = (post.content || post.excerpt || '').trim();
        const cleanContent = cleanTextForAI(rawContent);

        // Gaplarga ajratish
        const sentenceRegex = /[^.!?]+[.!?]+(?:\s+|$)/g;
        const rawSentences = cleanContent.match(sentenceRegex) || [];
        const validSentences = rawSentences
            .map(s => s.trim())
            .filter(s => s.length >= 25 && s.length <= 160 && !s.startsWith('http'));

        // Kalit so'zlarga ko'ra ballash (Heuristic AI extraction)
        const priorityKeywords = [
            'muhim', 'xulosa', 'tavsiya', 'natija', 'asosiy', 'afzallik',
            'o\'rganish', 'kerak', 'sababli', 'foydali', 'usul', 'qoida',
            'amaliy', 'tajriba', 'maqsad', 'dasturlash', 'wichtig', 'fazit',
            'lernen', 'tipp', 'vazifa', 'imkoniyat', 'yondashuv'
        ];

        const scored = validSentences.map((sent, index) => {
            let score = 0;
            const lower = sent.toLowerCase();

            priorityKeywords.forEach(kw => {
                if (lower.includes(kw)) score += 3;
            });

            // Birinchi yoki oxirgi qismdagi xulosalarga ustunlik
            if (index === 0) score += 2;
            if (index === validSentences.length - 1) score += 3;
            if (sent.length >= 40 && sent.length <= 110) score += 2;

            return { sentence: sent, score, origIndex: index };
        });

        // Eng yuqori ball to'plagan gaplarni tanlab, matndagi tabiiy tartibida saralaymiz
        scored.sort((a, b) => b.score - a.score);
        const topCandidates = scored.slice(0, 3);
        topCandidates.sort((a, b) => a.origIndex - b.origIndex);

        let finalPoints = topCandidates.map(c => {
            let s = c.sentence.trim();
            // Oxiridagi nuqtani to'g'rilash
            s = s.replace(/[.!?]+$/, '') + '.';
            return s.charAt(0).toUpperCase() + s.slice(1);
        });

        // Agar matndan 3 ta to'liq gap topilmagan bo'lsa (qisqa postlar yoki media uchun)
        if (finalPoints.length < 3) {
            const fallbackPoints = [];
            const cleanExcerpt = cleanTextForAI(post.excerpt || '');

            // 1-band: Asosiy yo'nalish va maqsad
            fallbackPoints.push(
                `«${title}» — ${category} sohasidagi muhim tushunchalar va asosiy tamoyillarni qamrab oladi.`
            );

            // 2-band: Mazmun va tavsiyalar
            if (cleanExcerpt && cleanExcerpt.length > 20) {
                const trimmed = cleanExcerpt.replace(/[.!?]+$/, '') + '.';
                fallbackPoints.push(trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
            } else {
                fallbackPoints.push(
                    `Mavzuda keltirilgan amaliy tavsiyalar va metodlar mavzuni oson o'zlashtirishga qaratilgan.`
                );
            }

            // 3-band: Amaliy xulosa
            fallbackPoints.push(
                `Olingan bilimlarni amaliyotda muntazam sinab ko'rish orqali eng yuqori samaradorlikka erishish mumkin.`
            );

            // Birlashtirish
            while (finalPoints.length < 3 && fallbackPoints.length) {
                const nextPt = fallbackPoints.shift();
                if (!finalPoints.includes(nextPt)) {
                    finalPoints.push(nextPt);
                }
            }
        }

        finalPoints = finalPoints.slice(0, 3);

        // Keshga saqlash
        cache[cacheKey] = finalPoints;
        saveSummaryCache(cache);

        return finalPoints;
    }

    // ------------------------------------------------------------
    // 5. ACCORDION SUMMARY HTML BUILDER
    // ------------------------------------------------------------
    function createSummaryCardElement(points, isCard = false) {
        const wrap = document.createElement('div');
        wrap.className = 'ai-summary-card atelier-glass-card';

        wrap.innerHTML = `
            <div class="ai-summary-card-header">
                <div class="ai-summary-badge">
                    <span class="ai-sparkle">✦</span>
                    <span>AI Xulosa</span>
                </div>
                <div class="ai-summary-reading-time">
                    <span>⚡ ~30 soniya o'qish</span>
                </div>
            </div>
            <h4 class="ai-summary-title">Asosiy fikrlar:</h4>
            <ul class="ai-summary-list">
                ${points.map((pt, i) => `
                    <li class="ai-summary-item">
                        <span class="ai-bullet-num">${i + 1}</span>
                        <span class="ai-bullet-text">${safeEscapeHTML(pt)}</span>
                    </li>
                `).join('')}
            </ul>
        `;
        return wrap;
    }

    // ------------------------------------------------------------
    // 6. ENHANCING POST CARDS (BOOKMARKS + AI SUMMARY PILL)
    // ------------------------------------------------------------
    function enhancePostCard(card) {
        if (!card || card.classList.contains('has-ai-enhancements')) return;

        // Post ID ni aniqlash
        const likeBtn = card.querySelector('.like-btn');
        const playBtn = card.querySelector('.music-play-btn');
        const postId = (likeBtn && likeBtn.getAttribute('data-id')) ||
                       (playBtn && playBtn.getAttribute('data-id')) ||
                       card.getAttribute('data-post-id');

        if (!postId) return;

        const post = findPostById(postId);
        const isSaved = BookmarkManager.isBookmarked(postId);

        // 1. FLOATING BOOKMARK BUTTON (Rasm ustidagi burchakda)
        const imgWrapper = card.querySelector('.post-image-wrapper');
        if (imgWrapper && !imgWrapper.querySelector('.post-card-bookmark-btn')) {
            const bmBtn = document.createElement('button');
            bmBtn.type = 'button';
            bmBtn.className = `post-card-bookmark-btn ${isSaved ? 'bookmarked' : ''}`;
            bmBtn.setAttribute('data-post-id', postId);
            bmBtn.title = isSaved ? "Saqlanganlardan o'chirish" : "Oflayn saqlab qo'yish";
            bmBtn.setAttribute('aria-label', "Xatcho'p");
            bmBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
            `;

            bmBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                BookmarkManager.toggleBookmark(postId);
            });

            imgWrapper.appendChild(bmBtn);
        }

        // 2. POST-STATS ICHIDAGI BOOKMARK ICON
        const postStats = card.querySelector('.post-stats');
        if (postStats && !postStats.querySelector('.bookmark-btn')) {
            const statBm = document.createElement('div');
            statBm.className = `post-stat bookmark-btn ${isSaved ? 'bookmarked' : ''}`;
            statBm.setAttribute('data-post-id', postId);
            statBm.title = isSaved ? "Saqlanganlardan o'chirish" : "Xatcho'pga qo'shish";
            statBm.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
            `;

            statBm.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                BookmarkManager.toggleBookmark(postId);
            });

            postStats.appendChild(statBm);
        }

        // 3. AI SUMMARY PILL & ACCORDION (Post kartochkasida)
        const contentDiv = card.querySelector('.post-content');
        const footerDiv = card.querySelector('.post-footer');

        if (contentDiv && !contentDiv.querySelector('.card-ai-summary-wrap')) {
            const summaryWrap = document.createElement('div');
            summaryWrap.className = 'card-ai-summary-wrap';

            const pillBtn = document.createElement('button');
            pillBtn.type = 'button';
            pillBtn.className = 'btn-ai-summary-pill card-summary-trigger';
            pillBtn.setAttribute('data-post-id', postId);
            pillBtn.setAttribute('aria-expanded', 'false');
            pillBtn.innerHTML = `
                <span class="ai-sparkle-icon">✦</span>
                <span>30 soniyada o'qish (AI Xulosa)</span>
                <span class="ai-accordion-arrow">▾</span>
            `;

            const accordion = document.createElement('div');
            accordion.className = 'ai-summary-accordion';
            const inner = document.createElement('div');
            inner.className = 'ai-summary-accordion-inner';
            accordion.appendChild(inner);

            pillBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                const isExpanded = pillBtn.classList.toggle('expanded');
                accordion.classList.toggle('expanded', isExpanded);
                pillBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

                if (isExpanded && inner.children.length === 0) {
                    const currentPost = post || findPostById(postId) || {
                        id: postId,
                        title: card.querySelector('.post-title') ? card.querySelector('.post-title').textContent : '',
                        excerpt: card.querySelector('.post-excerpt') ? card.querySelector('.post-excerpt').textContent : '',
                        category: card.querySelector('.post-meta') ? card.querySelector('.post-meta').textContent : ''
                    };
                    const points = extractIntelligentSummary(currentPost);
                    const cardEl = createSummaryCardElement(points, true);
                    inner.appendChild(cardEl);
                }
            });

            // Akkordeon ichidagi bosishlar karta ochilishiga olib kelmasligi kerak
            accordion.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            summaryWrap.appendChild(pillBtn);
            summaryWrap.appendChild(accordion);

            if (footerDiv) {
                contentDiv.insertBefore(summaryWrap, footerDiv);
            } else {
                contentDiv.appendChild(summaryWrap);
            }
        }

        card.classList.add('has-ai-enhancements');
    }

    // ------------------------------------------------------------
    // 7. ENHANCING POST DETAIL MODAL
    // ------------------------------------------------------------
    function enhanceDetailModal() {
        const modal = document.getElementById('post-detail-modal');
        const modalBody = document.getElementById('detail-modal-body');
        if (!modal || !modalBody) return;

        // Post ID ni modal kontentidan aniqlash
        const likeElem = modalBody.querySelector('[id^="modal-like-"]');
        const playElem = modalBody.querySelector('[id^="detail-play-"]');
        let postId = null;

        if (likeElem && likeElem.id) {
            postId = likeElem.id.replace('modal-like-', '');
        } else if (playElem && playElem.id) {
            postId = playElem.id.replace('detail-play-', '');
        }

        if (!postId) return;
        const post = findPostById(postId);
        const isSaved = BookmarkManager.isBookmarked(postId);

        // 1. MODAL ACTIONS BAR: Bookmark Toggle Button
        const actionsBar = modalBody.querySelector('.modal-actions-bar');
        if (actionsBar && !actionsBar.querySelector('#modal-bookmark-btn')) {
            const modalBmBtn = document.createElement('button');
            modalBmBtn.type = 'button';
            modalBmBtn.id = 'modal-bookmark-btn';
            modalBmBtn.className = `btn-secondary btn-sm modal-bookmark-btn ${isSaved ? 'bookmarked' : ''}`;
            modalBmBtn.setAttribute('data-post-id', postId);
            modalBmBtn.innerHTML = `
                <svg class="bookmark-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="bookmark-label">${isSaved ? "Saqlangan" : "Saqlab qo'yish"}</span>
            `;

            modalBmBtn.addEventListener('click', (e) => {
                e.preventDefault();
                BookmarkManager.toggleBookmark(postId);
            });

            // Ulashish tugmasidan oldin yoki yoniga qo'yish
            actionsBar.prepend(modalBmBtn);
        }

        // 2. MODAL AI SUMMARY (TL;DR) PILL & ACCORDION
        const postHeader = modalBody.querySelector('.modal-post-header');
        if (postHeader && !modalBody.querySelector('.modal-ai-summary-container')) {
            const container = document.createElement('div');
            container.className = 'modal-ai-summary-container';

            const pillBtn = document.createElement('button');
            pillBtn.type = 'button';
            pillBtn.className = 'btn-ai-summary-pill modal-summary-trigger';
            pillBtn.setAttribute('data-post-id', postId);
            pillBtn.setAttribute('aria-expanded', 'false');
            pillBtn.innerHTML = `
                <span class="ai-sparkle-icon">✦</span>
                <span>30 soniyada o'qish (AI Xulosa)</span>
                <span class="ai-summary-meta-tag">⚡ ~30 soniya</span>
                <span class="ai-accordion-arrow">▾</span>
            `;

            const accordion = document.createElement('div');
            accordion.className = 'ai-summary-accordion';
            const inner = document.createElement('div');
            inner.className = 'ai-summary-accordion-inner';
            accordion.appendChild(inner);

            pillBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isExpanded = pillBtn.classList.toggle('expanded');
                accordion.classList.toggle('expanded', isExpanded);
                pillBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

                if (isExpanded && inner.children.length === 0) {
                    const currentPost = post || findPostById(postId) || {
                        id: postId,
                        title: modalBody.querySelector('.modal-post-title') ? modalBody.querySelector('.modal-post-title').textContent : '',
                        content: modalBody.querySelector('.modal-post-text') ? modalBody.querySelector('.modal-post-text').textContent : '',
                        category: modalBody.querySelector('.post-meta') ? modalBody.querySelector('.post-meta').textContent : ''
                    };
                    const points = extractIntelligentSummary(currentPost);
                    const cardEl = createSummaryCardElement(points, false);
                    inner.appendChild(cardEl);
                }
            });

            container.appendChild(pillBtn);
            container.appendChild(accordion);

            // Headerdan keyin joylashtirish
            postHeader.insertAdjacentElement('afterend', container);
        }
    }

    // ------------------------------------------------------------
    // 8. INJECT "🔖 SAQLANGANLAR" FILTER BUTTON
    // ------------------------------------------------------------
    function injectBookmarksFilterButton() {
        const filterContainer = document.getElementById('filter-tags');
        if (!filterContainer) return;

        if (document.getElementById('main-bookmarks-btn')) return;

        const bookmarksBtn = document.createElement('button');
        bookmarksBtn.className = 'filter-tag filter-tag-bookmarks';
        bookmarksBtn.id = 'main-bookmarks-btn';
        bookmarksBtn.type = 'button';
        bookmarksBtn.setAttribute('data-filter', 'bookmarks');

        const savedCount = BookmarkManager.getBookmarks().length;
        bookmarksBtn.innerHTML = `
            <span>🔖</span>
            <span>Saqlanganlar</span>
            <span class="bookmark-count-badge" id="bookmark-count-badge" style="display: ${savedCount > 0 ? 'inline-flex' : 'none'};">${savedCount}</span>
        `;

        bookmarksBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Filtr tugmalarini faollashtirish
            document.querySelectorAll('.toolbar .filter-tag').forEach(tag => tag.classList.remove('active'));
            bookmarksBtn.classList.add('active');

            // Agar global filterType bo'lsa, o'rnatish
            if (typeof window.filterType !== 'undefined') {
                window.filterType = 'bookmarks';
            }

            // Postlarni faqat saqlanganlar bo'yicha chiqarish
            renderBookmarkedPostsGrid();
        });

        // "Barcha maqolalar" dan keyin yoki boshida joylashtirish
        const allBtn = filterContainer.querySelector('[data-filter="all"]');
        if (allBtn && allBtn.nextSibling) {
            filterContainer.insertBefore(bookmarksBtn, allBtn.nextSibling);
        } else {
            filterContainer.appendChild(bookmarksBtn);
        }
    }

    // ------------------------------------------------------------
    // 9. RENDER BOOKMARKED POSTS GRID
    // ------------------------------------------------------------
    function renderBookmarkedPostsGrid() {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;

        const bookmarks = BookmarkManager.getBookmarks();
        const allPosts = getAllPosts();
        const bookmarkedPosts = allPosts.filter(p => bookmarks.includes(String(p.id)));

        blogGrid.innerHTML = '';
        blogGrid.style.display = 'grid';

        if (bookmarkedPosts.length === 0) {
            blogGrid.innerHTML = `
                <div class="bookmarks-empty-state atelier-empty-state">
                    <div class="bookmarks-empty-icon" aria-hidden="true">🔖</div>
                    <h3 class="bookmarks-empty-title">Hozircha saqlangan maqolalar yo'q</h3>
                    <p class="bookmarks-empty-desc">
                        Maqolalar kartochkalaridagi yoki batafsil mutolaa sahifasidagi 🔖 belgisini bosib,
                        sevimli maqolalaringizni saqlab qo'ying. Ular hatto oflayn rejimda ham saqlanib qoladi.
                    </p>
                    <button type="button" class="btn-primary btn-sm btn-show-all-bookmarks" id="btn-empty-show-all">
                        <span>Barcha maqolalarni ko'rish &rarr;</span>
                    </button>
                </div>
            `;

            const showAllBtn = document.getElementById('btn-empty-show-all');
            if (showAllBtn) {
                showAllBtn.addEventListener('click', () => {
                    const allTag = document.querySelector('.toolbar .filter-tag[data-filter="all"]');
                    if (allTag) {
                        allTag.click();
                    } else if (typeof window.renderPosts === 'function') {
                        if (typeof window.filterType !== 'undefined') window.filterType = 'all';
                        window.renderPosts();
                    }
                });
            }
            return;
        }

        // Post kartochkalarini render qilish
        bookmarkedPosts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'post-card animate-fade-in';
            card.setAttribute('data-post-id', post.id);

            const isSaved = true;
            const postDate = post.date || new Date().toISOString().split('T')[0];
            const category = post.category || 'Maqola';
            const title = safeEscapeHTML(post.title || '');
            const excerpt = safeEscapeHTML(post.excerpt || '');
            const reading = typeof window.readingTime === 'function' ? window.readingTime(post) : '3 daqiqa';
            const likes = post.likes || 0;
            const commentsCount = (post.comments || []).length;
            const bgImg = post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600';

            card.innerHTML = `
                <div class="post-image-wrapper">
                    <div class="post-image" style="background-image: url('${bgImg}');"></div>
                    <button type="button" class="post-card-bookmark-btn bookmarked" data-post-id="${post.id}" title="Saqlanganlardan o'chirish" aria-label="Xatcho'p">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                </div>
                <div class="post-content">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span class="post-meta" style="margin-bottom:0;">📖 ${safeEscapeHTML(category)}</span>
                        <span class="search-type-badge badge-type-post" style="background:rgba(139,92,246,0.12); color:#8b5cf6;">🔖 Saqlangan</span>
                    </div>
                    <h2 class="post-title">${title}</h2>
                    <p class="post-excerpt">${excerpt}</p>
                    
                    <div class="card-ai-summary-wrap">
                        <button type="button" class="btn-ai-summary-pill card-summary-trigger" data-post-id="${post.id}" aria-expanded="false">
                            <span class="ai-sparkle-icon">✦</span>
                            <span>30 soniyada o'qish (AI Xulosa)</span>
                            <span class="ai-accordion-arrow">▾</span>
                        </button>
                        <div class="ai-summary-accordion">
                            <div class="ai-summary-accordion-inner"></div>
                        </div>
                    </div>

                    <div class="post-footer">
                        <span class="post-date">${postDate} - ⏳ ${reading}</span>
                        <div class="post-stats">
                            <div class="post-stat like-btn" data-id="${post.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${post.liked ? 'var(--accent-color)' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                <span>${likes}</span>
                            </div>
                            <div class="post-stat">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                                <span>${commentsCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Karta bosilganda modalni ochish
            card.addEventListener('click', (e) => {
                if (e.target.closest('.post-card-bookmark-btn')) return;
                if (e.target.closest('.card-ai-summary-wrap')) return;
                if (e.target.closest('.like-btn')) {
                    if (typeof window.handleLike === 'function') window.handleLike(post.id);
                    return;
                }
                if (typeof window.openPostDetail === 'function') {
                    window.openPostDetail(post.id);
                }
            });

            // Kartadagi bookmark tugmasi
            const bmBtn = card.querySelector('.post-card-bookmark-btn');
            if (bmBtn) {
                bmBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    BookmarkManager.toggleBookmark(post.id);
                });
            }

            // Kartadagi AI Summary tugmasi
            const pillBtn = card.querySelector('.btn-ai-summary-pill');
            const accordion = card.querySelector('.ai-summary-accordion');
            const inner = card.querySelector('.ai-summary-accordion-inner');

            if (pillBtn && accordion && inner) {
                pillBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const isExpanded = pillBtn.classList.toggle('expanded');
                    accordion.classList.toggle('expanded', isExpanded);
                    pillBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

                    if (isExpanded && inner.children.length === 0) {
                        const points = extractIntelligentSummary(post);
                        const cardEl = createSummaryCardElement(points, true);
                        inner.appendChild(cardEl);
                    }
                });

                accordion.addEventListener('click', (e) => e.stopPropagation());
            }

            card.classList.add('has-ai-enhancements');
            blogGrid.appendChild(card);
        });
    }

    // ------------------------------------------------------------
    // 10. OBSERVER & INITIALIZATION
    // ------------------------------------------------------------
    function scanAndEnhanceAllCards() {
        const cards = document.querySelectorAll('.blog-grid .post-card:not(.has-ai-enhancements)');
        cards.forEach(enhancePostCard);
    }

    function setupObservers() {
        // 1. Blog Grid observer (har gal yangi kartalar render bo'lganda avtomatik qo'shish)
        const blogGrid = document.getElementById('blog-grid');
        if (blogGrid) {
            const gridObserver = new MutationObserver(() => {
                scanAndEnhanceAllCards();
            });
            gridObserver.observe(blogGrid, { childList: true, subtree: false });
        }

        // 2. Modal Body observer (har gal modal ochilganda avtomatik qo'shish)
        const modalBody = document.getElementById('detail-modal-body');
        if (modalBody) {
            const modalObserver = new MutationObserver(() => {
                enhanceDetailModal();
            });
            modalObserver.observe(modalBody, { childList: true, subtree: false });
        }

        // 3. Modalning o'zi active bo'lganda ham tekshirish
        const modal = document.getElementById('post-detail-modal');
        if (modal) {
            const modalStateObserver = new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    if (m.attributeName === 'class' && modal.classList.contains('active')) {
                        setTimeout(enhanceDetailModal, 20);
                    }
                });
            });
            modalStateObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });
        }
    }

    function init() {
        ensureStylesLoaded();
        injectBookmarksFilterButton();
        scanAndEnhanceAllCards();
        enhanceDetailModal();
        setupObservers();
        BookmarkManager.updateUI();

        // Agar post detail ochilgan bo'lsa hodisani tinglash
        if (typeof window.addEventListener === 'function') {
            window.addEventListener('postOpenedInModal', () => {
                setTimeout(enhanceDetailModal, 30);
            });
        }

        // Boshqa filtrlarga bosilganda xatcho'p tugmasining active holatini yechish
        const toolbar = document.querySelector('.toolbar');
        if (toolbar) {
            toolbar.addEventListener('click', (e) => {
                const btn = e.target.closest('.filter-tag');
                if (btn && btn.id !== 'main-bookmarks-btn') {
                    const bmBtn = document.getElementById('main-bookmarks-btn');
                    if (bmBtn) bmBtn.classList.remove('active');
                }
            });
        }
    }

    // DOM ready tekshiruvi
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Global eksport
    window.BookmarkManager = BookmarkManager;
    window.AISummaryBookmarks = {
        init,
        extractIntelligentSummary,
        BookmarkManager,
        renderBookmarkedPostsGrid,
        enhancePostCard,
        enhanceDetailModal
    };

})();
