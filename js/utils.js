// Yordamchi Funksiyalar
window.escapeHTML = function(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

window.formatDate = function(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });
};

window.safeUrl = function(url) {
    if (!url) return '#';
    try {
        const parsed = new URL(url, window.location.origin);
        if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
            return parsed.href;
        }
    } catch(e) {}
    return '#';
};

window.safeImageUrl = function(url) {
    if (!url) return '#';
    if (url.startsWith('data:image/')) return url;
    try {
        const parsed = new URL(url, window.location.origin);
        if (['http:', 'https:'].includes(parsed.protocol)) {
            return parsed.href;
        }
    } catch(e) {}
    return '#';
};

window.cssUrl = function(url, fallback) {
    let u = safeImageUrl(url);
    if (!u || u === '#') u = fallback || '';
    return String(u).replace(/['"()<>\\]/g, c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'));
};

window.showToast = function(message, kind = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${kind}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

window.readingTime = function(post) {
    if (post.type === 'music') return '3 min tinglash';
    if (post.type === 'video') return '5 min tomosha';
    const text = (post.content || '') + ' ' + (post.excerpt || '');
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return time > 0 ? time + ' min o\'qish' : '1 min o\'qish';
};

window.renderTags = function(post) {
    if (!post.tags || post.tags.length === 0) return '';
    return `<div class="post-detail-tags">` + 
           post.tags.map(tag => `<span class="tag-pill" onclick="filterByTag('${escapeHTML(tag.trim())}')">#${escapeHTML(tag.trim())}</span>`).join('') +
           `</div>`;
};

window.filterByTag = function(tag) {
    if(window.closePostDetailModal) window.closePostDetailModal();
    if(window.showMainView) window.showMainView();
    window.searchQuery = '#' + tag;
    if(window.searchInput) window.searchInput.value = window.searchQuery;
    if(window.renderPosts) window.renderPosts();
    window.scrollTo({ top: document.getElementById('blog-grid').offsetTop - 100, behavior: 'smooth' });
};
