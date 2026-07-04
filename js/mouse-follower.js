// Sichqoncha (Cursor) kuzatuvchisi animatsiyasi
window.initMouseFollower = function() {
    // Mobil qurilmalarda kursor kerak emas
    if (window.innerWidth <= 768) return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isMoving = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isMoving) {
            isMoving = true;
            cursor.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    const elements = document.querySelectorAll('a, button, .interactive, input, textarea, select, .post-card, .zoomable');
    elements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    function animate() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        // Lerp factor
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.transform = `translate3d(${cursorX - 10}px, ${cursorY - 10}px, 0)`;
        requestAnimationFrame(animate);
    }
    animate();
};
