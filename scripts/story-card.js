// ============================================================
// SERTIFIKAT VA IQTIBOS KARTASI (Story & Post Generator)
// Fayl: scripts/story-card.js — Modulli mustaqil HTML5 Canvas tizimi
// ============================================================
(function() {
    'use strict';

    let currentCardData = null;
    let currentFormat = 'story'; // 'story' (1080x1920) yoki 'post' (1080x1080)
    let modalEl = null;
    let canvasEl = null;
    let previewImgEl = null;

    // Yordamchi matnni qatorlarga ajratish (Word Wrap)
    function wrapText(ctx, text, maxWidth) {
        const words = (text || '').split(' ');
        const lines = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    // Canvasda yumaloq burchakli to'rtburchak chizish
    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    // Asosiy Canvas Generatori
    function renderCardToCanvas(data, format = 'story') {
        if (!canvasEl) {
            canvasEl = document.createElement('canvas');
        }

        const width = 1080;
        const height = format === 'story' ? 1920 : 1080;
        canvasEl.width = width;
        canvasEl.height = height;

        const ctx = canvasEl.getContext('2d');
        if (!ctx) return;

        // 1. Fon: Qorong'u Cyber Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#050c14');
        bgGrad.addColorStop(0.5, '#07111c');
        bgGrad.addColorStop(1, '#0c1e30');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // 2. Ambient Glowing Orbs (Neon nurli tumanlar)
        const orb1 = ctx.createRadialGradient(width * 0.2, height * 0.15, 20, width * 0.2, height * 0.15, 450);
        orb1.addColorStop(0, 'rgba(45, 212, 191, 0.22)');
        orb1.addColorStop(1, 'rgba(45, 212, 191, 0)');
        ctx.fillStyle = orb1;
        ctx.fillRect(0, 0, width, height);

        const orb2 = ctx.createRadialGradient(width * 0.8, height * 0.85, 20, width * 0.8, height * 0.85, 550);
        orb2.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
        orb2.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = orb2;
        ctx.fillRect(0, 0, width, height);

        // 3. Cyber Grid Chiziqlari (Nozik to'r)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        const step = 60;
        for (let x = 0; x < width; x += step) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // 4. Glassmorphism Kartasi (Asosiy panel)
        const cardMargin = 70;
        const cardX = cardMargin;
        const cardY = format === 'story' ? 220 : 100;
        const cardW = width - (cardMargin * 2);
        const cardH = format === 'story' ? height - 440 : height - 200;
        const cardRadius = 36;

        ctx.save();
        roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
        ctx.fillStyle = 'rgba(12, 30, 48, 0.75)';
        ctx.fill();

        // Kartaning glowing borderi
        const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
        borderGrad.addColorStop(0, 'rgba(45, 212, 191, 0.6)');
        borderGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
        borderGrad.addColorStop(1, 'rgba(139, 92, 246, 0.5)');
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // 5. Brending va Logo (Yuqori qism)
        ctx.save();
        // Logo belgisi
        const logoX = cardX + 50;
        const logoY = cardY + 50;
        roundRect(ctx, logoX, logoY, 56, 56, 14);
        ctx.fillStyle = 'linear-gradient(135deg, #2dd4bf, #38bdf8)';
        ctx.fillStyle = '#2dd4bf';
        ctx.fill();

        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.fillStyle = '#07111c';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('A', logoX + 28, logoY + 28);

        // Brend nomi
        ctx.textAlign = 'left';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(data.brandTitle || 'Abdugofforov.uz', logoX + 74, logoY + 22);

        ctx.font = '500 18px Inter, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(data.category || '✦ KUN HIKMATI · ILHOM', logoX + 74, logoY + 46);
        ctx.restore();

        // 6. Kontent (Senariy 1: Iqtibos yoki Senariy 2: Sertifikat)
        const isCertificate = data.type === 'certificate';

        if (!isCertificate) {
            // === SENARIY 1: IQTIBOS / MAQOLA KARTASI ===
            // Katta qo'shtirnoq belgisi
            ctx.save();
            ctx.font = 'bold 160px Playfair Display, serif';
            ctx.fillStyle = 'rgba(45, 212, 191, 0.08)';
            ctx.fillText('“', cardX + 40, cardY + 230);
            ctx.restore();

            // Asosiy Iqtibos Matni (O'zbekcha)
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = format === 'story' ? 'italic 500 44px "Playfair Display", Georgia, serif' : 'italic 500 36px "Playfair Display", Georgia, serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            const textX = cardX + 60;
            const textY = cardY + 160;
            const maxTextWidth = cardW - 120;
            const lines = wrapText(ctx, `"${data.quote || ''}"`, maxTextWidth);
            const lineHeight = format === 'story' ? 64 : 52;

            lines.forEach((line, idx) => {
                ctx.fillText(line, textX, textY + (idx * lineHeight));
            });

            let currentY = textY + (lines.length * lineHeight) + 40;

            // Nemischa tarjimasi (agar mavjud bo'lsa)
            if (data.germanQuote) {
                ctx.font = '400 28px Inter, sans-serif';
                ctx.fillStyle = '#94a3b8';
                const deLines = wrapText(ctx, data.germanQuote, maxTextWidth);
                deLines.forEach((deLine, dIdx) => {
                    ctx.fillText(deLine, textX, currentY + (dIdx * 40));
                });
                currentY += (deLines.length * 40) + 40;
            }

            // Muallif Pilli
            if (data.author) {
                const authorText = `— ${data.author}`;
                ctx.font = 'bold 26px Inter, sans-serif';
                const authorW = ctx.measureText(authorText).width + 40;
                roundRect(ctx, textX, currentY, authorW, 50, 25);
                ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
                ctx.stroke();

                ctx.fillStyle = '#38bdf8';
                ctx.textBaseline = 'middle';
                ctx.fillText(authorText, textX + 20, currentY + 25);
            }
            ctx.restore();

        } else {
            // === SENARIY 2: NEMIS TILI TEST SERTIFIKATI ===
            ctx.save();
            ctx.textAlign = 'center';

            const centerX = cardX + (cardW / 2);
            let curY = cardY + 130;

            // Trophy icon / Badge
            ctx.font = '80px sans-serif';
            ctx.fillText('🏆', centerX, curY);
            curY += 70;

            // Sarlavha
            ctx.font = 'bold 42px Inter, sans-serif';
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('MUVAFFAQIYAT SERTIFIKATI', centerX, curY);
            curY += 40;

            ctx.font = '500 22px Inter, sans-serif';
            ctx.fillStyle = '#38bdf8';
            ctx.fillText('Nemis Tili Akademiyasi — telc Standarti', centerX, curY);
            curY += 50;

            // Ism va profil
            ctx.font = 'bold 48px "Playfair Display", Georgia, serif';
            ctx.fillStyle = '#2dd4bf';
            ctx.fillText(data.userName || 'Aziz O\'quvchi', centerX, curY);
            curY += 50;

            // Mavzu va daraja
            ctx.font = '500 26px Inter, sans-serif';
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText(`Daraja: ${data.level || 'A1'} · ${data.topicTitle || 'Umumiy Test'}`, centerX, curY);
            curY += 60;

            // Natija Metriklari (3 ta blok: Ball, Foiz, XP)
            const boxW = 160;
            const boxH = 90;
            const gap = 20;
            const startBoxX = centerX - (boxW * 1.5 + gap);

            const metrics = [
                { label: 'NATIJA', val: `${data.score || 0}/${data.total || 0}` },
                { label: 'O\'ZLASHTIRISH', val: `${data.pct || 100}%` },
                { label: 'XP MUKOFOT', val: `+${data.xp || 100} XP` }
            ];

            metrics.forEach((m, i) => {
                const bX = startBoxX + i * (boxW + gap);
                roundRect(ctx, bX, curY, boxW, boxH, 18);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
                ctx.stroke();

                ctx.font = '600 13px Inter, sans-serif';
                ctx.fillStyle = '#94a3b8';
                ctx.fillText(m.label, bX + boxW / 2, curY + 28);

                ctx.font = 'bold 24px Inter, sans-serif';
                ctx.fillStyle = '#f8fafc';
                ctx.fillText(m.val, bX + boxW / 2, curY + 62);
            });

            curY += boxH + 60;

            // Sana va ID
            const dateStr = new Date().toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' });
            ctx.font = '400 18px Inter, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText(`Berilgan sana: ${dateStr} · Sertifikat ID: #${Math.floor(100000 + Math.random() * 900000)}`, centerX, curY);

            ctx.restore();
        }

        // 7. Footer: Veb-sayt va QR uslubidagi dekorativ havola
        ctx.save();
        const footerY = cardY + cardH - 50;
        ctx.font = '600 20px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'left';
        ctx.fillText('🌐 https://' + (data.siteDomain || 'abdugofforov.uz'), cardX + 50, footerY);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#2dd4bf';
        ctx.fillText('✓ Rasmiy Tasdiqlangan', cardX + cardW - 50, footerY);
        ctx.restore();

        // 8. Pastki Tashqi Manzil (Watermark)
        ctx.save();
        ctx.font = '500 16px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.textAlign = 'center';
        ctx.fillText('Kay Kundaligi & Deutsch Akademiya · Barcha huquqlar himoyalangan', width / 2, height - 40);
        ctx.restore();
    }

    // Modal interfeysi yaratish
    function buildStoryModalDOM() {
        if (modalEl) return;

        const overlay = document.createElement('div');
        overlay.id = 'story-card-modal';
        overlay.className = 'story-card-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 12000;
            display: none; align-items: center; justify-content: center;
            background: rgba(7, 17, 28, 0.85); backdrop-filter: blur(25px);
            padding: 20px; opacity: 0; transition: opacity 0.2s ease;
        `;

        overlay.innerHTML = `
            <div class="story-card-box" style="
                background: rgba(12, 30, 48, 0.95); border: 1px solid rgba(56, 189, 248, 0.3);
                border-radius: 24px; box-shadow: 0 30px 70px rgba(0,0,0,0.6);
                max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto;
                padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 18px;
                font-family: 'Inter', sans-serif;
            ">
                <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 700; font-size: 18px; color: #f8fafc; display: flex; align-items: center; gap: 8px;">
                        <span>📸</span>
                        <span id="story-modal-title">Story & Post Generator</span>
                    </div>
                    <button id="close-story-modal-btn" style="background: none; border: none; font-size: 26px; color: #94a3b8; cursor: pointer;">&times;</button>
                </div>

                <!-- Format Tanlash (9:16 Story vs 1:1 Post) -->
                <div style="display: flex; gap: 8px; width: 100%; background: rgba(255,255,255,0.04); padding: 4px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                    <button id="format-story-btn" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; background: #38bdf8; color: #07111c;">📱 Story (9:16)</button>
                    <button id="format-post-btn" style="flex: 1; padding: 8px; border: none; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; background: transparent; color: #94a3b8;">🖼️ Post (1:1)</button>
                </div>

                <!-- Preview Image -->
                <div style="width: 100%; display: flex; justify-content: center; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 16px;">
                    <img id="story-preview-img" alt="Karta ko'rinishi" style="max-height: 50vh; max-width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                </div>

                <!-- Harakatlar (Yuklab olish & Ulashish) -->
                <div style="display: flex; gap: 12px; width: 100%;">
                    <button id="download-story-btn" style="flex: 1; padding: 12px; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; background: linear-gradient(135deg, #2dd4bf, #38bdf8); color: #07111c; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span>📥</span> Yuklab olish (PNG)
                    </button>
                    <button id="share-story-btn" style="padding: 12px 18px; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; font-weight: 600; font-size: 14px; background: rgba(255,255,255,0.06); color: #f8fafc; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <span>📤</span> Ulashish
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        modalEl = overlay;
        previewImgEl = overlay.querySelector('#story-preview-img');

        // Yopish
        overlay.querySelector('#close-story-modal-btn').addEventListener('click', closeStoryModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeStoryModal();
        });

        // Format almashtirish
        const storyBtn = overlay.querySelector('#format-story-btn');
        const postBtn = overlay.querySelector('#format-post-btn');

        storyBtn.addEventListener('click', () => {
            currentFormat = 'story';
            storyBtn.style.background = '#38bdf8'; storyBtn.style.color = '#07111c';
            postBtn.style.background = 'transparent'; postBtn.style.color = '#94a3b8';
            updatePreview();
        });

        postBtn.addEventListener('click', () => {
            currentFormat = 'post';
            postBtn.style.background = '#38bdf8'; postBtn.style.color = '#07111c';
            storyBtn.style.background = 'transparent'; storyBtn.style.color = '#94a3b8';
            updatePreview();
        });

        // Yuklab olish
        overlay.querySelector('#download-story-btn').addEventListener('click', () => {
            if (!canvasEl) return;
            const link = document.createElement('a');
            link.download = `abdugofforov-${currentFormat}-${Date.now()}.png`;
            link.href = canvasEl.toDataURL('image/png');
            link.click();
            if (window.showToast) window.showToast('📥 Rasm muvaffaqiyatli yuklab olindi!', 'success');
        });

        // Ulashish (Web Share API)
        overlay.querySelector('#share-story-btn').addEventListener('click', async () => {
            if (!canvasEl) return;
            canvasEl.toBlob(async (blob) => {
                if (!blob) return;
                const file = new File([blob], `story-${Date.now()}.png`, { type: 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'Abdugofforov.uz Story',
                            text: currentCardData?.quote || 'Abdugofforov.uz kartasi'
                        });
                    } catch (_) {}
                } else {
                    // Fallback: yuklab olish
                    const link = document.createElement('a');
                    link.download = `story-${Date.now()}.png`;
                    link.href = canvasEl.toDataURL('image/png');
                    link.click();
                    if (window.showToast) window.showToast('Havola yoki rasm yuklab olindi', 'info');
                }
            });
        });
    }

    function updatePreview() {
        if (!currentCardData) return;
        renderCardToCanvas(currentCardData, currentFormat);
        if (previewImgEl && canvasEl) {
            previewImgEl.src = canvasEl.toDataURL('image/png');
        }
    }

    function openStoryModal(data) {
        buildStoryModalDOM();
        currentCardData = data || {
            type: 'quote',
            quote: 'Mantiq sizni A dan B ga olib boradi, tasavvur esa har qanday manzilga yetaklay oladi.',
            author: 'Albert Eynshteyn',
            category: '✦ KUN HIKMATI · ILHOM'
        };

        updatePreview();

        modalEl.style.display = 'flex';
        setTimeout(() => {
            modalEl.style.opacity = '1';
        }, 20);
        document.body.style.overflow = 'hidden';
    }

    function closeStoryModal() {
        if (!modalEl) return;
        modalEl.style.opacity = '0';
        setTimeout(() => {
            modalEl.style.display = 'none';
            document.body.style.overflow = '';
        }, 180);
    }

    // ============================================================
    // SELECTION LISTENER: Sichqoncha bilan belgilaganda "✨ Kartochka"
    // ============================================================
    let floatingBtn = null;

    function initTextSelectionCardTrigger() {
        floatingBtn = document.createElement('button');
        floatingBtn.id = 'floating-story-card-btn';
        floatingBtn.style.cssText = `
            position: fixed; display: none; z-index: 9999;
            background: linear-gradient(135deg, #0c1e30, #07111c);
            border: 1px solid #38bdf8; color: #f8fafc;
            padding: 7px 14px; border-radius: 999px;
            font-size: 13px; font-weight: 600; cursor: pointer;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(56,189,248,0.3);
            align-items: center; gap: 6px; font-family: 'Inter', sans-serif;
            transition: transform 0.15s ease;
        `;
        floatingBtn.innerHTML = `<span>✨</span> <span>Kartochka yaratish</span>`;
        document.body.appendChild(floatingBtn);

        document.addEventListener('mouseup', () => {
            setTimeout(() => {
                const sel = window.getSelection();
                if (!sel || sel.isCollapsed) {
                    floatingBtn.style.display = 'none';
                    return;
                }
                const text = sel.toString().trim();
                if (text.length >= 15 && text.length <= 500) {
                    const range = sel.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    floatingBtn.style.left = `${Math.max(10, rect.left + (rect.width / 2) - 80)}px`;
                    floatingBtn.style.top = `${Math.max(10, rect.top - 46)}px`;
                    floatingBtn.style.display = 'inline-flex';
                    floatingBtn.dataset.text = text;
                } else {
                    floatingBtn.style.display = 'none';
                }
            }, 100);
        });

        floatingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const text = floatingBtn.dataset.text;
            floatingBtn.style.display = 'none';
            if (text) {
                openStoryModal({
                    type: 'quote',
                    quote: text,
                    author: 'Abdugofforov.uz',
                    category: '✦ SARALANGAN IQTIBOS'
                });
            }
        });
    }

    // Hodisalarni tinglash (Quote vidjeti va sertifikat tugmalari)
    document.addEventListener('click', (e) => {
        // 1. Kun Hikmati Story Tugmasi
        const quoteBtn = e.target.closest('[data-action="quote-story-card"], [data-action="quote-image"]');
        if (quoteBtn) {
            e.preventDefault();
            const textEl = document.getElementById('daily-quote-text') || document.getElementById('quote-text') || document.querySelector('.quote-text');
            const authorEl = document.getElementById('daily-quote-author') || document.getElementById('quote-author') || document.querySelector('.quote-author');
            const deEl = document.getElementById('quote-de-text');
            const quote = textEl ? textEl.textContent.trim().replace(/^["“]|["”]$/g, '') : '';
            const author = authorEl ? authorEl.textContent.trim().replace(/^—\s*/, '') : '';
            const deQuote = deEl ? deEl.textContent.trim().replace(/^[„"“]|[”"„]$/g, '') : '';

            openStoryModal({
                type: 'quote',
                quote: quote || 'Mantiq sizni A dan B ga olib boradi, tasavvur esa har qanday manzilga.',
                germanQuote: deQuote,
                author: author || 'Kun Hikmati',
                category: '✦ KUN HIKMATI · ILHOM'
            });
            return;
        }

        // 2. Test natijasini sertifikat sifatida yuklash
        const certBtn = e.target.closest('[data-action="download-test-certificate"]');
        if (certBtn) {
            e.preventDefault();
            const user = (window.Auth && Auth.user) ? Auth.user : { name: 'O\'quvchi', username: 'student' };
            const score = certBtn.dataset.score || 10;
            const total = certBtn.dataset.total || 10;
            const topic = certBtn.dataset.topic || 'Nemis Tili Testi';
            const level = certBtn.dataset.level || 'A1';
            const pct = Math.round((Number(score) / (Number(total) || 1)) * 100);

            openStoryModal({
                type: 'certificate',
                userName: user.name || user.username || 'Nemis Tili O\'quvchisi',
                level: level,
                topicTitle: topic,
                score: score,
                total: total,
                pct: pct,
                xp: pct >= 80 ? 150 : 80,
                siteDomain: 'deutsch.abdugofforov.uz',
                category: '🏆 TELC STANDARTI SERTIFIKATI'
            });
            return;
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTextSelectionCardTrigger);
    } else {
        initTextSelectionCardTrigger();
    }

    // Global eksport
    window.StoryCard = {
        open: openStoryModal,
        close: closeStoryModal,
        render: renderCardToCanvas
    };
})();
