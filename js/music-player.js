// Mini musiqa pleyer
window.isDesktopPlayer = function() {
    return window.innerWidth > 768; // telefon va planshetlarda false
};

window.getYouTubeId = function(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
};

window.playMusic = function(post) {
    // Lokal audio fayl (data URL)
    if (post && post.musicData) {
        const player = document.getElementById('mini-player');
        const frame = document.getElementById('mini-player-frame');
        if (!player || !frame) return;
        document.getElementById('mini-player-title').textContent = post.title || 'Musiqa';
        document.getElementById('mini-player-artist').textContent = post.artist || '';
        frame.innerHTML = `<audio controls autoplay style="width:100%; height:100%;" src="${post.musicData}"></audio>`;
        player.classList.add('active');
        return;
    }

    const link = post && post.link;
    if (!link) return;
    const ytId = getYouTubeId(link);

    // Telefon/planshet yoki YouTube bo'lmagan havola — yangi oynada ochiladi
    if (!isDesktopPlayer() || !ytId) {
        window.open(safeUrl(link), '_blank', 'noopener');
        return;
    }

    const player = document.getElementById('mini-player');
    const frame = document.getElementById('mini-player-frame');
    if (!player || !frame) return;
    document.getElementById('mini-player-title').textContent = post.title || 'Musiqa';
    document.getElementById('mini-player-artist').textContent = post.artist || '';
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0" title="YouTube player" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%; height:100%;"></iframe>`;
    player.classList.add('active');
};

window.stopMusic = function() {
    const player = document.getElementById('mini-player');
    const frame = document.getElementById('mini-player-frame');
    if (frame) frame.innerHTML = '';
    if (player) player.classList.remove('active');
};

window.initMiniPlayer = function() {
    const closeBtn = document.getElementById('mini-player-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', stopMusic);
    }
};
