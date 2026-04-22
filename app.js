const AppState = { user: null, status: 'new', isAdmin: false };
const OWNER_ID = 5569487012; // ያንተ ID

function initApp() {
    let tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    // 1. የዩዘር ዳታ ማግኘት
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        AppState.user = tg.initDataUnsafe.user;
    }

    // 2. ከ URL Parameters ዳታ ማንበብ (B.B የላከውን)
    const urlParams = new URLSearchParams(window.location.search);
    let statusFromUrl = urlParams.get('status') || 'new';
    let idFromUrl = urlParams.get('userId');

    // 3. አድሚን መሆንህን ቼክ ማድረግ (በጣም ወሳኝ ክፍል)
    // ከቴሌግራም ወይም ከ URL የመጣው ID ካንተ ID ጋር እኩል መሆኑን ማረጋገጥ
    let currentUserId = AppState.user ? AppState.user.id : idFromUrl;

    if (Number(currentUserId) === OWNER_ID) {
        AppState.isAdmin = true;
        AppState.status = 'vip'; // አድሚን ሁሌም VIP ነው
    } else {
        AppState.status = statusFromUrl;
    }

    renderUI();
}

function renderUI() {
    const DOM = {
        adminNavItem: document.getElementById('admin-nav-item'),
        welcomeMessage: document.getElementById('welcome-message'),
        navUsername: document.getElementById('nav-username'),
        userBadge: document.getElementById('user-badge'),
        ichimokuContent: document.getElementById('ichimoku-vip-content'),
        ichimokuPrompt: document.getElementById('ichimoku-upgrade-prompt')
    };

    // ስም እና ባጅ ማስተካከል
    let name = AppState.user ? AppState.user.first_name : "ተጠቃሚ";
    DOM.welcomeMessage.textContent = `እንኳን ደህና መጡ፣ ${name}!`;
    DOM.navUsername.textContent = name;

    if (AppState.isAdmin) {
        DOM.adminNavItem.classList.remove('hidden');
        DOM.userBadge.textContent = "Admin";
        DOM.userBadge.className = "badge gold-badge";
    } else if (AppState.status === 'vip') {
        DOM.userBadge.textContent = "VIP Member";
        DOM.userBadge.className = "badge gold-badge";
    } else {
        DOM.userBadge.textContent = "Standard";
        DOM.userBadge.className = "badge";
    }

    // ፔጆችን ማሳየት
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

// ቬሪፋይ እና VIP ጥያቄ በተኖች
document.getElementById('verify-btn')?.addEventListener('click', () => {
    window.Telegram.WebApp.openTelegramLink("https://t.me/enqopazyon2bot?start=verify_me");
    window.Telegram.WebApp.close();
});

document.getElementById('request-vip-btn')?.addEventListener('click', () => {
    window.Telegram.WebApp.openTelegramLink("https://t.me/enqopazyon2bot?start=request_vip");
    window.Telegram.WebApp.close();
});

// Sidebar & Page Switchers (ያለህበት እንዲቀጥል)
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

window.addEventListener('DOMContentLoaded', initApp);
