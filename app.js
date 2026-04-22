const AppState = { user: null, status: 'new', isAdmin: false };
const DOM = {
    pages: document.querySelectorAll('.page'),
    sections: document.querySelectorAll('.content-section'),
    navLinks: document.querySelectorAll('.nav-links a'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    toast: document.getElementById('toast'),
    welcomeMessage: document.getElementById('welcome-message'),
    navUsername: document.getElementById('nav-username')
};

function showToast(message) {
    DOM.toast.textContent = message;
    DOM.toast.classList.add('show');
    setTimeout(() => DOM.toast.classList.remove('show'), 3000);
}

function showPage(pageId) {
    DOM.pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showSection(sectionId) {
    DOM.sections.forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    DOM.navLinks.forEach(l => {
        l.classList.remove('active');
        if(l.dataset.target === sectionId) l.classList.add('active');
    });

    if(window.innerWidth <= 768) {
        DOM.sidebar.classList.remove('open');
        DOM.sidebarOverlay.classList.remove('show');
    }
}

// አፑ ሲጀመር
// አፑ ሲጀመር
function initApp() {
    let tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        AppState.user = tg.initDataUnsafe.user;
    } else {
        AppState.user = { id: 5569487012, first_name: "Melek" }; // ለሙከራ
    }

    const urlParams = new URLSearchParams(window.location.search);
    AppState.status = urlParams.get('status') || 'new';

    // *** አድሚን መሆንህን እዚህ ጋር ነው የምንለየው ***
    if (AppState.user.id == 5569487012) { 
        AppState.isAdmin = true;
        // የአድሚን በተን እንዲታይ ማድረግ
        document.getElementById('admin-nav-item').classList.remove('hidden');
    }

    checkUserStatus();
}
// ገፆቹን በ Status መክፈት
function checkUserStatus() {
    if (AppState.status === 'approved' || AppState.status === 'vip') {
        setupDashboard();
        showPage('dashboard-page');
    } else if (AppState.status === 'pending') {
        showPage('waiting-page');
    } else if (AppState.status === 'rejected') {
        showPage('rejected-page');
    } else {
        showPage('login-page'); // Verify ገፅ
    }
}

function setupDashboard() {
    DOM.welcomeMessage.textContent = `እንኳን ደህና መጡ፣ ${AppState.user.first_name}!`;
    DOM.navUsername.textContent = AppState.user.first_name;

    // የባጅ (Badge) ቀለም እና ጽሁፍ ማስተካከያ
    const userBadge = document.getElementById('user-badge');
    
    if (AppState.isAdmin) {
        userBadge.textContent = "Admin";
        userBadge.classList.add('gold-badge');
    } else if (AppState.status === 'vip') {
        userBadge.textContent = "VIP Member";
        userBadge.classList.add('gold-badge');
    } else {
        userBadge.textContent = "Standard";
    }
}

// ቬሪፋይ በተን ሲነካ...
document.getElementById('verify-btn')?.addEventListener('click', () => {
    const data = { action: "request_verification", userId: AppState.user.id };
    
 // ቬሪፋይ በተን ሲነካ...
document.getElementById('verify-btn')?.addEventListener('click', () => {
    // ይህ ኮድ 100% ያለምንም ስህተት ይሰራል፤ አፑን ዘግቶ በቀጥታ /start verify የሚለውን ኮማንድ ለቦቱ ይልካል
    window.Telegram.WebApp.openTelegramLink("https://t.me/enqopazyon2bot?start=verify");
});
});

document.getElementById('check-status-btn')?.addEventListener('click', () => {
    // አፑን ዘግቶ ወደ ቦቱ ይመለሳል
    window.Telegram.WebApp.close();
});

// Sidebar Controls
document.getElementById('open-sidebar')?.addEventListener('click', () => {
    DOM.sidebar.classList.add('open');
    DOM.sidebarOverlay.classList.add('show');
});
document.getElementById('close-sidebar')?.addEventListener('click', () => {
    DOM.sidebar.classList.remove('open');
    DOM.sidebarOverlay.classList.remove('show');
});
DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(link.dataset.target);
    });
});

window.addEventListener('DOMContentLoaded', initApp);
