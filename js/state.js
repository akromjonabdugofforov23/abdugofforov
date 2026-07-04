// 1. Dastlabki ma'lumotlar va Holat
window.posts = [];
window.currentTab = 'home';
window.filterType = 'all';
window.searchQuery = '';
window.editingPostId = null;
window.isAdmin = false;
window.tasks = [];
window.portfolioInfo = null;
window.portfolioTokens = [];

// 2. DOM Elementlarni keshlash
window.blogGrid = document.getElementById('blog-grid');
window.mainNav = document.getElementById('main-nav');
window.navLogo = document.getElementById('nav-logo');
window.searchInput = document.getElementById('search-input');
window.filterTags = document.getElementById('filter-tags');
window.themeBtn = document.getElementById('theme-btn');
window.addPostBtn = document.getElementById('add-post-btn');
window.cancelAddBtn = document.getElementById('cancel-add-btn');
window.postDetailModal = document.getElementById('post-detail-modal');
window.closeDetailModal = document.getElementById('close-detail-modal');
window.detailModalBody = document.getElementById('detail-modal-body');
window.addPostModal = document.getElementById('add-post-modal');
window.closeAddModal = document.getElementById('close-add-modal');
window.newPostForm = document.getElementById('new-post-form');
window.heroSub = document.getElementById('hero-sub');

// Admin elements (may be null on index)
window.adminBtn = document.getElementById('admin-btn');
window.pinModal = document.getElementById('pin-modal');
window.closePinModal = document.getElementById('close-pin-modal');
window.pinInput = document.getElementById('admin-pin');
window.pinSubmitBtn = document.getElementById('pin-submit-btn');
window.pinError = document.getElementById('pin-error');
window.adminPanelModal = document.getElementById('admin-panel-modal');
window.closeAdminPanelBtn = document.getElementById('close-admin-panel-btn');
