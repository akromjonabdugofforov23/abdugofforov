// Asosiy ishga tushirish (Bootstrap)
window.bootstrap = async function() {
    // 1. Storage va Sync tekshirish
    if (!window.Store || !window.Sync) {
        console.error("Storage yoki Sync moduli topilmadi.");
        return;
    }

    try {
        await window.Store.init();
        window.posts = await window.Store.get('abdu_posts') || [];
        window.tasks = await window.Store.get('abdu_tasks') || [];
        
        // Agar bo'sh bo'lsa serverdan tortib kelamiz
        if (window.posts.length === 0) {
            const serverPosts = await window.Sync.fetchPosts();
            if (serverPosts && serverPosts.length > 0) {
                window.posts = serverPosts;
                await window.Store.set('abdu_posts', window.posts);
            }
        }
    } catch(e) {
        console.error("Storage init xatosi:", e);
    }

    // 2. Auth tizimi (agar mavjud bo'lsa)
    if (window.Auth && typeof window.Auth.restore === 'function') {
        window.Auth.restore();
        if (typeof window.updateAuthUI === 'function') {
            window.updateAuthUI();
        }
        window.isAdmin = window.Auth.isLoggedIn(); // Admin tekshiruvi (hozircha shunday)
    }

    // 3. UI modullarini ishga tushirish
    if (typeof window.initTheme === 'function') window.initTheme();
    if (typeof window.initLanguage === 'function') window.initLanguage();
    if (typeof window.initMouseFollower === 'function') window.initMouseFollower();
    if (typeof window.initLightbox === 'function') window.initLightbox();
    if (typeof window.initMiniPlayer === 'function') window.initMiniPlayer();
    if (typeof window.initCarousel === 'function') window.initCarousel();
    if (typeof window.init3DTilt === 'function') window.init3DTilt();
    
    // 4. Boshlang'ich kontentni yuklash
    if (typeof window.renderPosts === 'function') {
        window.renderPosts();
    }
};

// DOM yuklangandan so'ng bootstrapni chaqirish
document.addEventListener('DOMContentLoaded', () => {
    window.bootstrap();
});
