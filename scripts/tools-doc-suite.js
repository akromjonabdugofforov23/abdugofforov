/**
 * ABDUGOFFOROV WEB EKOTIZIMI — TOOLS DOC SUITE
 * scripts/tools-doc-suite.js
 * 
 * 100% Client-side Word (.docx) ⇄ PDF (.pdf) Konverter:
 * 1. Word (.docx) ➔ PDF (.pdf): Mammoth.js / OOXML parser + jsPDF
 * 2. PDF (.pdf) ➔ Word (.docx): PDF.js + JSZip OpenXML builder
 * 
 * Privacy-first: Ma'lumotlar hech qayerga yuborilmaydi, brauzerda qayta ishlanadi.
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // 0. DINAMIK CSS USLUBI
    // -------------------------------------------------------------------------
    function injectDocSuiteStyles() {
        if (document.getElementById('tools-doc-suite-styles')) return;
        const style = document.createElement('style');
        style.id = 'tools-doc-suite-styles';
        style.textContent = `
            .docconvert-mode-btn {
                padding: 8px 18px;
                font-size: 0.9rem;
                font-weight: 600;
                border-radius: 10px;
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.1));
                background: rgba(255, 255, 255, 0.05);
                color: var(--text-secondary, #94a3b8);
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .docconvert-mode-btn:hover {
                color: var(--text-primary, #ffffff);
                border-color: var(--tools-accent, #6366f1);
                background: rgba(99, 102, 241, 0.1);
            }
            .docconvert-mode-btn.active {
                background: var(--tools-accent, #6366f1);
                border-color: var(--tools-accent, #6366f1);
                color: #ffffff;
                box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
            }
            .doc-dropzone {
                border: 2px dashed var(--tools-border, rgba(255, 255, 255, 0.15));
                border-radius: 16px;
                padding: 44px 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.25s ease;
                background: rgba(0, 0, 0, 0.12);
            }
            .doc-dropzone:hover, .doc-dropzone.dragover {
                border-color: var(--tools-accent, #6366f1);
                background: rgba(99, 102, 241, 0.08);
                transform: translateY(-2px);
            }
            .doc-preview-box {
                min-height: 240px;
                max-height: 480px;
                overflow-y: auto;
                line-height: 1.75;
                padding: 22px;
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 0.95rem;
                background: rgba(0, 0, 0, 0.25);
                border: 1px solid var(--tools-border, rgba(255, 255, 255, 0.08));
                border-radius: 12px;
                color: var(--text-primary, #f8fafc);
                outline: none;
                white-space: pre-wrap;
            }
            [data-theme="light"] .doc-preview-box {
                background: #ffffff;
                color: #0f172a;
            }
            .doc-preview-box h1, .doc-preview-box h2, .doc-preview-box h3 {
                margin: 16px 0 8px 0;
                color: #38bdf8;
                font-weight: 700;
            }
            .doc-preview-box p {
                margin: 0 0 12px 0;
            }
        `;
        document.head.appendChild(style);
    }

    // -------------------------------------------------------------------------
    // 1. DINAMIK KUTUBXONA YUKLOVCHI (LAZY LOADER)
    // -------------------------------------------------------------------------
    const SCRIPT_URLS = {
        pdfjs: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        pdfjsWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
        mammoth: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
        jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        jszip: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
    };

    const loadedScripts = {};

    function loadScript(name, url) {
        if (loadedScripts[name]) return loadedScripts[name];
        loadedScripts[name] = new Promise((resolve, reject) => {
            if (
                (name === 'pdfjs' && window.pdfjsLib) ||
                (name === 'mammoth' && window.mammoth) ||
                (name === 'jspdf' && window.jspdf) ||
                (name === 'jszip' && window.JSZip)
            ) {
                return resolve();
            }
            const s = document.createElement('script');
            s.src = url;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error(`Kutubxona yuklanmadi: ${url}`));
            document.head.appendChild(s);
        });
        return loadedScripts[name];
    }

    function notify(message, icon = '✓') {
        const toast = document.getElementById('tools-toast');
        const iconEl = document.getElementById('toast-icon');
        const msgEl = document.getElementById('toast-msg');

        if (toast && msgEl) {
            if (iconEl) iconEl.textContent = icon;
            msgEl.textContent = message;
            toast.classList.add('show');
            clearTimeout(window.__toolsToastTimer);
            window.__toolsToastTimer = setTimeout(() => {
                toast.classList.remove('show');
            }, 2600);
        }
    }

    function formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function escapeXml(str) {
        return (str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    // -------------------------------------------------------------------------
    // 2. OOXML (.docx) ZAPIS QILUVCHI GENERATOR
    // -------------------------------------------------------------------------
    async function buildDocxBlob(docTitle, paragraphs) {
        await loadScript('jszip', SCRIPT_URLS.jszip);
        if (!window.JSZip) throw new Error("JSZip kutubxonasi mavjud emas");

        const zip = new window.JSZip();

        // 1. [Content_Types].xml
        const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;
        zip.file("[Content_Types].xml", contentTypesXml);

        // 2. _rels/.rels
        const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
        zip.folder("_rels").file(".rels", relsXml);

        // 3. word/_rels/document.xml.rels
        const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
        zip.folder("word").folder("_rels").file("document.xml.rels", docRelsXml);

        // 4. word/styles.xml
        const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="23"/>
        <w:szCs w:val="23"/>
        <w:color w:val="1E293B"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`;
        zip.folder("word").file("styles.xml", stylesXml);

        // 5. word/document.xml
        let bodyXml = '';

        if (docTitle) {
            bodyXml += `<w:p>
              <w:pPr>
                <w:spacing w:before="240" w:after="240"/>
                <w:jc w:val="center"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:b/>
                  <w:sz w:val="34"/>
                  <w:color w:val="0F172A"/>
                </w:rPr>
                <w:t xml:space="preserve">${escapeXml(docTitle)}</w:t>
              </w:r>
            </w:p>`;
        }

        for (const para of paragraphs) {
            const trimmed = para.trim();
            if (!trimmed) continue;

            const isHeading = trimmed.length <= 80 && (
                trimmed === trimmed.toUpperCase() ||
                trimmed.startsWith('#') ||
                trimmed.endsWith(':') ||
                /^(?:[IVXLCDM]+\.|\d+\.)\s+[A-Z\u0400-\u04FF]/i.test(trimmed)
            );
            const cleanText = trimmed.replace(/^#+\s*/, '');

            if (isHeading) {
                bodyXml += `<w:p>
                  <w:pPr>
                    <w:spacing w:before="200" w:after="100"/>
                  </w:pPr>
                  <w:r>
                    <w:rPr>
                      <w:b/>
                      <w:sz w:val="28"/>
                      <w:color w:val="2563EB"/>
                    </w:rPr>
                    <w:t xml:space="preserve">${escapeXml(cleanText)}</w:t>
                  </w:r>
                </w:p>`;
            } else {
                bodyXml += `<w:p>
                  <w:pPr>
                    <w:spacing w:after="140" w:line="276" w:lineRule="auto"/>
                  </w:pPr>
                  <w:r>
                    <w:t xml:space="preserve">${escapeXml(cleanText)}</w:t>
                  </w:r>
                </w:p>`;
            }
        }

        const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
        zip.folder("word").file("document.xml", docXml);

        return await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
    }

    // -------------------------------------------------------------------------
    // 3. WORD (.docx) -> PDF (.pdf) MODULI
    // -------------------------------------------------------------------------
    function initWordToPdf() {
        const dropzone = document.getElementById('doc-word-dropzone');
        const fileInput = document.getElementById('doc-word-file-input');
        const infoCard = document.getElementById('doc-word-info-card');
        const filenameEl = document.getElementById('doc-word-filename');
        const metaEl = document.getElementById('doc-word-meta');
        const resetBtn = document.getElementById('doc-word-reset-btn');
        const convertBtn = document.getElementById('doc-word-convert-btn');
        const previewWrap = document.getElementById('doc-word-preview-wrap');
        const previewEl = document.getElementById('doc-word-preview');
        const copyBtn = document.getElementById('doc-word-copy-btn');

        if (!dropzone || !fileInput) return;

        let currentFile = null;
        let currentRawText = '';
        let currentArrayBuffer = null;

        function resetWordState() {
            currentFile = null;
            currentRawText = '';
            currentArrayBuffer = null;
            fileInput.value = '';
            infoCard.style.display = 'none';
            previewWrap.style.display = 'none';
            dropzone.style.display = 'block';
            previewEl.textContent = '';
        }

        if (resetBtn) resetBtn.addEventListener('click', resetWordState);

        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) handleWordFile(files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files && files.length > 0) handleWordFile(files[0]);
        });

        async function handleWordFile(file) {
            if (!file.name.match(/\.(docx|doc)$/i)) {
                notify("Faqat Word (.docx yoki .doc) fayllari qabul qilinadi!", '⚠️');
                return;
            }

            currentFile = file;
            filenameEl.textContent = file.name;
            metaEl.textContent = `${formatFileSize(file.size)} · Tahlil qilinmoqda...`;
            infoCard.style.display = 'block';
            dropzone.style.display = 'none';

            notify("Word hujjati o'qilmoqda...", '⏳');

            try {
                currentArrayBuffer = await file.arrayBuffer();
                let extractedHtml = '';
                let extractedText = '';

                // 1. Mammoth.js orqali o'qishga urinish
                try {
                    await loadScript('mammoth', SCRIPT_URLS.mammoth);
                    if (window.mammoth) {
                        const result = await window.mammoth.convertToHtml({ arrayBuffer: currentArrayBuffer });
                        extractedHtml = result.value;
                        const textResult = await window.mammoth.extractRawText({ arrayBuffer: currentArrayBuffer });
                        extractedText = textResult.value;
                    }
                } catch (mammothErr) {
                    console.warn("Mammoth yuklanmadi, XML zaxira tekshiriladi:", mammothErr);
                }

                // 2. Agar Mammoth bo'lmasa, JSZip orqali document.xml ni o'qish
                if (!extractedText) {
                    await loadScript('jszip', SCRIPT_URLS.jszip);
                    if (window.JSZip) {
                        const zip = await window.JSZip.loadAsync(currentArrayBuffer);
                        const docXmlFile = zip.file("word/document.xml");
                        if (docXmlFile) {
                            const xmlStr = await docXmlFile.async("string");
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
                            const paragraphs = xmlDoc.getElementsByTagName("w:p");
                            const paraTexts = [];
                            for (let p of paragraphs) {
                                const texts = p.getElementsByTagName("w:t");
                                let line = '';
                                for (let t of texts) line += t.textContent;
                                if (line.trim()) paraTexts.push(line.trim());
                            }
                            extractedText = paraTexts.join('\n\n');
                        }
                    }
                }

                if (!extractedText.trim()) {
                    throw new Error("Hujjatdan matn ajratib olinmadi yoki fayl shifrlangan.");
                }

                currentRawText = extractedText;
                const wordsCount = extractedText.trim().split(/\s+/).length;
                metaEl.textContent = `${formatFileSize(file.size)} · ~${wordsCount.toLocaleString('uz-UZ')} so'z`;

                if (extractedHtml) {
                    previewEl.innerHTML = extractedHtml;
                } else {
                    previewEl.textContent = extractedText;
                }

                previewWrap.style.display = 'block';
                notify("Hujjat muvaffaqiyatli tahlil qilindi!", '✓');
            } catch (err) {
                console.error("Word o'qishda xatolik:", err);
                notify("Xatolik: " + err.message, '⚠️');
                resetWordState();
            }
        }

        // Matnni nusxalash
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const text = previewEl.innerText || previewEl.textContent || currentRawText;
                if (!text.trim()) {
                    notify("Nusxalash uchun matn mavjud emas!", '⚠️');
                    return;
                }
                navigator.clipboard.writeText(text).then(() => {
                    notify("Hujjat matni nusxalandi!", '✓');
                });
            });
        }

        // PDF ga aylantirish va Yuklab olish
        if (convertBtn) {
            convertBtn.addEventListener('click', async () => {
                const text = previewEl.innerText || previewEl.textContent || currentRawText;
                if (!text.trim()) {
                    notify("Konvertatsiya qilish uchun matn yo'q!", '⚠️');
                    return;
                }

                notify("PDF tayyorlanmoqda...", '⏳');

                try {
                    await loadScript('jspdf', SCRIPT_URLS.jspdf);
                    if (!window.jspdf || !window.jspdf.jsPDF) {
                        throw new Error("jsPDF kutubxonasi yuklanmadi");
                    }

                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF({
                        orientation: 'portrait',
                        unit: 'pt',
                        format: 'a4'
                    });

                    const pageWidth = 595.28;
                    const pageHeight = 841.89;
                    const margin = 45;
                    const maxLineWidth = pageWidth - (margin * 2);
                    let cursorY = margin + 25;

                    const docTitle = currentFile ? currentFile.name.replace(/\.(docx|doc)$/i, '') : 'Hujjat';

                    // Sarlavha
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(16);
                    doc.setTextColor(15, 23, 42); // #0f172a
                    const titleLines = doc.splitTextToSize(docTitle, maxLineWidth);
                    doc.text(titleLines, margin, cursorY);
                    cursorY += (titleLines.length * 20) + 16;

                    // Ajratuvchi chiziq
                    doc.setDrawColor(226, 232, 240); // #e2e8f0
                    doc.setLineWidth(0.8);
                    doc.line(margin, cursorY - 8, pageWidth - margin, cursorY - 8);

                    const paragraphs = text.split(/\n\s*\n+/);

                    paragraphs.forEach(para => {
                        const trimmed = para.trim();
                        if (!trimmed) return;

                        const isHeading = trimmed.length <= 80 && (
                            trimmed === trimmed.toUpperCase() ||
                            trimmed.startsWith('#') ||
                            trimmed.endsWith(':') ||
                            /^(?:[IVXLCDM]+\.|\d+\.)\s+[A-Z\u0400-\u04FF]/i.test(trimmed)
                        );
                        const cleanPara = trimmed.replace(/^#+\s*/, '');

                        if (isHeading) {
                            cursorY += 14;
                            if (cursorY > pageHeight - margin - 30) {
                                doc.addPage();
                                cursorY = margin + 25;
                            }
                            doc.setFont('helvetica', 'bold');
                            doc.setFontSize(12.5);
                            doc.setTextColor(37, 99, 235); // #2563eb
                            const lines = doc.splitTextToSize(cleanPara, maxLineWidth);
                            doc.text(lines, margin, cursorY);
                            cursorY += (lines.length * 16) + 8;
                        } else {
                            doc.setFont('helvetica', 'normal');
                            doc.setFontSize(10.5);
                            doc.setTextColor(30, 41, 59); // #1e293b
                            const lines = doc.splitTextToSize(cleanPara, maxLineWidth);
                            if (cursorY + (lines.length * 14.5) > pageHeight - margin - 25) {
                                doc.addPage();
                                cursorY = margin + 25;
                            }
                            doc.text(lines, margin, cursorY);
                            cursorY += (lines.length * 14.5) + 8;
                        }
                    });

                    // Pastki sahifa raqamlari
                    const totalPages = doc.internal.getNumberOfPages();
                    for (let i = 1; i <= totalPages; i++) {
                        doc.setPage(i);
                        doc.setFont('helvetica', 'normal');
                        doc.setFontSize(8.5);
                        doc.setTextColor(148, 163, 184); // #94a3b8
                        doc.text(`Sahifa ${i} / ${totalPages} · abdugofforov.tools`, pageWidth / 2, pageHeight - 20, { align: 'center' });
                    }

                    const outName = `${docTitle}.pdf`;
                    doc.save(outName);
                    notify(`"${outName}" muvaffaqiyatli yuklab olindi!`, '📥');
                } catch (err) {
                    console.error("PDF yaratishda xato:", err);
                    notify("PDF yaratishda xatolik: " + err.message, '⚠️');
                }
            });
        }
    }

    // -------------------------------------------------------------------------
    // 4. PDF (.pdf) -> WORD (.docx) MODULI
    // -------------------------------------------------------------------------
    function initPdfToWord() {
        const dropzone = document.getElementById('doc-pdf-dropzone');
        const fileInput = document.getElementById('doc-pdf-file-input');
        const infoCard = document.getElementById('doc-pdf-info-card');
        const filenameEl = document.getElementById('doc-pdf-filename');
        const metaEl = document.getElementById('doc-pdf-meta');
        const resetBtn = document.getElementById('doc-pdf-reset-btn');
        const convertBtn = document.getElementById('doc-pdf-convert-btn');
        const progressWrap = document.getElementById('doc-pdf-progress-wrap');
        const progressMsg = document.getElementById('doc-pdf-progress-msg');
        const progressPct = document.getElementById('doc-pdf-progress-pct');
        const progressBar = document.getElementById('doc-pdf-progress-bar');
        const previewWrap = document.getElementById('doc-pdf-preview-wrap');
        const previewEl = document.getElementById('doc-pdf-preview');
        const copyBtn = document.getElementById('doc-pdf-copy-btn');
        const txtBtn = document.getElementById('doc-pdf-txt-btn');

        if (!dropzone || !fileInput) return;

        let currentPdfFile = null;
        let extractedParagraphs = [];

        function resetPdfState() {
            currentPdfFile = null;
            extractedParagraphs = [];
            fileInput.value = '';
            infoCard.style.display = 'none';
            previewWrap.style.display = 'none';
            progressWrap.style.display = 'none';
            dropzone.style.display = 'block';
            previewEl.textContent = '';
        }

        if (resetBtn) resetBtn.addEventListener('click', resetPdfState);

        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) handlePdfFile(files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files && files.length > 0) handlePdfFile(files[0]);
        });

        function updateProgress(pct, msg) {
            if (progressWrap) progressWrap.style.display = 'block';
            if (progressPct) progressPct.textContent = `${pct}%`;
            if (progressBar) progressBar.style.width = `${pct}%`;
            if (progressMsg && msg) progressMsg.textContent = msg;
        }

        async function handlePdfFile(file) {
            if (!file.name.match(/\.pdf$/i)) {
                notify("Faqat PDF (.pdf) fayllari qabul qilinadi!", '⚠️');
                return;
            }

            currentPdfFile = file;
            filenameEl.textContent = file.name;
            metaEl.textContent = `${formatFileSize(file.size)} · Tahlil qilinmoqda...`;
            infoCard.style.display = 'block';
            dropzone.style.display = 'none';

            updateProgress(15, "PDF.js dvigateli yuklanmoqda...");

            try {
                await loadScript('pdfjs', SCRIPT_URLS.pdfjs);
                if (!window.pdfjsLib) throw new Error("PDF.js kutubxonasi yuklanmadi");

                window.pdfjsLib.GlobalWorkerOptions.workerSrc = SCRIPT_URLS.pdfjsWorker;

                updateProgress(30, "PDF fayl ochilmoqda...");
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;

                const numPages = pdf.numPages;
                extractedParagraphs = [];

                for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                    const currentPct = 30 + Math.round((pageNum / numPages) * 60);
                    updateProgress(currentPct, `Sahifa ${pageNum} / ${numPages} tahlil qilinmoqda...`);

                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const items = textContent.items;

                    if (!items || items.length === 0) continue;

                    // Matn elementlarini vertikal pozitsiya (Y) bo'yicha guruhlash
                    let lines = [];
                    let currentLine = [];
                    let lastY = null;

                    for (const item of items) {
                        const y = Math.round(item.transform[5]);
                        if (lastY !== null && Math.abs(y - lastY) > 4) {
                            if (currentLine.length > 0) {
                                lines.push(currentLine.map(t => t.str).join(' '));
                                currentLine = [];
                            }
                        }
                        currentLine.push(item);
                        lastY = y;
                    }
                    if (currentLine.length > 0) {
                        lines.push(currentLine.map(t => t.str).join(' '));
                    }

                    // Satrlarni xatboshilarga birlashtirish
                    let pagePara = [];
                    let currentPara = '';

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed) {
                            if (currentPara) {
                                pagePara.push(currentPara);
                                currentPara = '';
                            }
                            continue;
                        }

                        if (!currentPara) {
                            currentPara = trimmed;
                        } else {
                            // Agar oldingi satr nuqta yoki ikki nuqta bilan tugagan bo'lsa
                            if (/[.:!?]$/.test(currentPara)) {
                                pagePara.push(currentPara);
                                currentPara = trimmed;
                            } else {
                                currentPara += ' ' + trimmed;
                            }
                        }
                    }
                    if (currentPara) pagePara.push(currentPara);

                    extractedParagraphs = extractedParagraphs.concat(pagePara);
                }

                updateProgress(100, "Tahlil yakunlandi!");
                setTimeout(() => {
                    if (progressWrap) progressWrap.style.display = 'none';
                }, 600);

                const fullText = extractedParagraphs.join('\n\n');
                const wordsCount = fullText.trim().split(/\s+/).filter(Boolean).length;
                metaEl.textContent = `${numPages} ta sahifa · ${formatFileSize(file.size)} · ~${wordsCount.toLocaleString('uz-UZ')} so'z`;

                previewEl.textContent = fullText;
                previewWrap.style.display = 'block';

                notify(`PDF dan ${numPages} sahifa matni ajratildi!`, '✓');
            } catch (err) {
                console.error("PDF o'qishda xato:", err);
                notify("PDF o'qishda xatolik: " + err.message, '⚠️');
                resetPdfState();
            }
        }

        // Matnni nusxalash
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const text = previewEl.innerText || previewEl.textContent;
                if (!text.trim()) {
                    notify("Nusxalash uchun matn mavjud emas!", '⚠️');
                    return;
                }
                navigator.clipboard.writeText(text).then(() => {
                    notify("Matn nusxalandi!", '✓');
                });
            });
        }

        // .txt fayl yuklab olish
        if (txtBtn) {
            txtBtn.addEventListener('click', () => {
                const text = previewEl.innerText || previewEl.textContent;
                if (!text.trim()) {
                    notify("Yuklab olish uchun matn mavjud emas!", '⚠️');
                    return;
                }
                const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                const baseName = currentPdfFile ? currentPdfFile.name.replace(/\.pdf$/i, '') : 'matn';
                a.download = `${baseName}_ajratilgan.txt`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 150);
                notify("Matn .txt fayl sifatida yuklandi!", '📥');
            });
        }

        // Word (.docx) formatiga aylantirish va Yuklab olish
        if (convertBtn) {
            convertBtn.addEventListener('click', async () => {
                const rawText = previewEl.innerText || previewEl.textContent;
                if (!rawText.trim()) {
                    notify("Word fayli yaratish uchun matn yo'q!", '⚠️');
                    return;
                }

                notify("Word (.docx) hujjati tayyorlanmoqda...", '⏳');

                try {
                    const docTitle = currentPdfFile ? currentPdfFile.name.replace(/\.pdf$/i, '') : 'PDF_Hujjat';
                    const paragraphs = rawText.split(/\n+/).filter(p => p.trim());

                    const docxBlob = await buildDocxBlob(docTitle, paragraphs);
                    const url = URL.createObjectURL(docxBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${docTitle}.docx`;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 200);

                    notify(`"${docTitle}.docx" muvaffaqiyatli yuklab olindi!`, '📥');
                } catch (err) {
                    console.error("Word generatsiyasida xato:", err);
                    notify("Word yaratishda xatolik: " + err.message, '⚠️');
                }
            });
        }
    }

    // -------------------------------------------------------------------------
    // 5. REJIMLARNI ALMASHTIRISH (SUBNAV)
    // -------------------------------------------------------------------------
    function initDocConvertSubnav() {
        const modeBtns = document.querySelectorAll('.docconvert-mode-btn');
        const views = document.querySelectorAll('.docconvert-view');

        function switchMode(modeName) {
            if (!modeName) return;
            const targetBtn = document.querySelector(`.docconvert-mode-btn[data-mode="${modeName}"]`);
            const targetView = document.getElementById(`docconvert-view-${modeName}`);
            if (!targetBtn || !targetView) return;

            modeBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => { v.style.display = 'none'; });

            targetBtn.classList.add('active');
            targetView.style.display = 'block';
        }

        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                switchMode(mode);
                if (mode === 'word2pdf') {
                    try { history.replaceState(null, '', '#word2pdf'); } catch (e) { location.hash = '#word2pdf'; }
                } else if (mode === 'pdf2word') {
                    try { history.replaceState(null, '', '#pdf2word'); } catch (e) { location.hash = '#pdf2word'; }
                }
            });
        });

        // URL hash orqali rejimni tanlash
        const hash = (window.location.hash || '').replace('#', '').toLowerCase();
        if (hash === 'pdf2word') {
            switchMode('pdf2word');
        } else if (hash === 'word2pdf' || hash === 'word' || hash === 'docx') {
            switchMode('word2pdf');
        }

        // Global metod
        window.ToolsDocSuite = {
            switchMode
        };
    }

    // Initsializatsiya
    function initDocSuite() {
        injectDocSuiteStyles();
        initDocConvertSubnav();
        initWordToPdf();
        initPdfToWord();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDocSuite);
    } else {
        initDocSuite();
    }

})();
