// Soat vidjeti (jonli vaqt)
window.updateClock = function() {
    const hEl = document.querySelector('[data-clock="h"]');
    const mEl = document.querySelector('[data-clock="m"]');
    const sEl = document.querySelector('[data-clock="s"]');
    const dateEl = document.getElementById('widget-date');
    if (!hEl || !mEl || !sEl || !dateEl) return;

    // Tashkent vaqti
    const d = new Date();
    const opts = { timeZone: 'Asia/Tashkent' };
    const h = parseInt(d.toLocaleString('en-US', { ...opts, hour: 'numeric', hour12: false }));
    const m = parseInt(d.toLocaleString('en-US', { ...opts, minute: 'numeric' }));
    const s = parseInt(d.toLocaleString('en-US', { ...opts, second: 'numeric' }));

    const hs = h.toString().padStart(2, '0');
    const ms = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');

    if (hEl.textContent !== hs) { hEl.style.animation = 'none'; hEl.offsetHeight; hEl.style.animation = 'flipIn 0.3s ease-out'; hEl.textContent = hs; }
    if (mEl.textContent !== ms) { mEl.style.animation = 'none'; mEl.offsetHeight; mEl.style.animation = 'flipIn 0.3s ease-out'; mEl.textContent = ms; }
    if (sEl.textContent !== ss) { sEl.style.animation = 'none'; sEl.offsetHeight; sEl.style.animation = 'flipIn 0.3s ease-out'; sEl.textContent = ss; }

    const day = d.toLocaleString('uz-UZ', { ...opts, day: '2-digit' });
    const mo = d.toLocaleString('uz-UZ', { ...opts, month: '2-digit' });
    const yr = d.toLocaleString('uz-UZ', { ...opts, year: 'numeric' });
    const dateStr = `${day}.${mo}.${yr}`;
    if (dateEl.textContent !== dateStr) {
        dateEl.textContent = dateStr;
    }
};

if (document.querySelector('[data-clock="h"]')) {
    updateClock();
    setInterval(updateClock, 1000);
}
