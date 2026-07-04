// Qorong'u rejim (Dark Mode) boshqaruvi
window.initTheme = function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    if (window.themeBtn) {
        window.themeBtn.addEventListener('click', () => {
            const current = document.body.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeButton(newTheme);
            
            // refresh particles if theme changes
            if (typeof window.initParticles === 'function') window.initParticles();
            if (typeof window.initFooterParticles === 'function') window.initFooterParticles();
        });
    }
};

window.updateThemeButton = function(theme) {
    if (!window.themeBtn) return;
    const sunIcon = window.themeBtn.querySelector('.sun-icon');
    const moonIcon = window.themeBtn.querySelector('.moon-icon');
    if(sunIcon && moonIcon) {
        if (theme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
};
