const AppState = { user: null, status: 'new', isAdmin: false };
const ADMIN_ID = 5569487012; // ያንተ ID

const DOM = {
    pages: document.querySelectorAll('.page'),
    sections: document.querySelectorAll('.content-section'),
    navLinks: document.querySelectorAll('.nav-links a'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    toast: document.getElementById('toast'),
    welcomeMessage: document.getElementById('welcome-message'),
    navUsername: document.getElementById('nav-username'),
    userBadge: document.getElementById('user-badge'),
    adminNavItem: document.getElementById('admin-nav-item'),
    ichimokuNavItem: document.getElementById('ichimoku-nav-item'),
    ichimokuContent: document.getElementById('ichimoku-vip-content'),
    ichimokuPrompt: document.getElementById('ichimoku-upgrade-prompt')
};

function initApp() {
    let tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        AppState.user = tg.initDataUnsafe.user;
    } else {
        AppState.user = { id: ADMIN_ID, first_name: "Melek Admin" };
    }

    const urlParams = new URLSearchParams(window.location.search);
    AppState.status = urlParams.get('status') || 'new';

    // የአድሚን እና የባለቤቱ ID ቼክ
    if (AppState.user.id == ADMIN_ID) {
        AppState.isAdmin = true;
        AppState.status = 'vip'; // አድሚን ሁሌም VIP ነው
        DOM.adminNavItem.classList.remove('hidden');
    }

    setupDashboard();
    checkUserStatus();
}

function checkUserStatus() {
    if (AppState.status === 'approved' || AppState.status === 'vip') {
        showPage('dashboard-page');
        
        // VIP ካልሆነ Ichimoku ቆልፍ
        if (AppState.status !== 'vip') {
            DOM.ichimokuContent.style.display = 'none';
            DOM.ichimokuPrompt.style.display = 'block';
        } else {
            DOM.ichimokuContent.style.display = 'block';
            DOM.ichimokuPrompt.style.display = 'none';
        }
    } else if (AppState.status === 'pending') {
        showPage('waiting-page');
    } else {
        showPage('login-page');
    }
}

function setupDashboard() {
    DOM.welcomeMessage.textContent = `እንኳን ደህና መጡ፣ ${AppState.user.first_name}!`;
    DOM.navUsername.textContent = AppState.user.first_name;
    
    if (AppState.isAdmin) {
        DOM.userBadge.textContent = "Admin";
        DOM.userBadge.className = "badge gold-badge";
    } else if (AppState.status === 'vip') {
        DOM.userBadge.textContent = "VIP Member";
        DOM.userBadge.className = "badge gold-badge";
    } else {
        DOM.userBadge.textContent = "Standard";
        DOM.userBadge.className = "badge";
    }
}

// ክስተቶች (Events)
document.getElementById('verify-btn')?.addEventListener('click', () => {
    window.Telegram.WebApp.openTelegramLink("https://t.me/enqopazyon2bot?start=verify_me");
    window.Telegram.WebApp.close();
});

document.getElementById('request-vip-btn')?.addEventListener('click', () => {
    window.Telegram.WebApp.openTelegramLink("https://t.me/enqopazyon2bot?start=request_vip");
    window.Telegram.WebApp.close();
});

// Sidebar & Navigation Controls... (ያለህበት ይቀጥል)
DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(link.dataset.target);
    });
});

document.getElementById('open-sidebar')?.addEventListener('click', () => {
    DOM.sidebar.classList.add('open');
    DOM.sidebarOverlay.classList.add('show');
});
document.getElementById('close-sidebar')?.addEventListener('click', () => {
    DOM.sidebar.classList.remove('open');
    DOM.sidebarOverlay.classList.remove('show');
});

function showPage(pageId) {
    DOM.pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showSection(sectionId) {
    DOM.sections.forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    if(window.innerWidth <= 768) {
        DOM.sidebar.classList.remove('open');
        DOM.sidebarOverlay.classList.remove('show');
    }
}

window.addEventListener('DOMContentLoaded', initApp);
