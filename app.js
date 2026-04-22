const AppState = { user: null, status: 'new', isAdmin: false };
const OWNER_ID = "5569487012"; // ያንተ ID (እንደ ጽሁፍ)

function initApp() {
    let tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    // 1. የዩዘር ዳታ ከቴሌግራም ማግኘት
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        AppState.user = tg.initDataUnsafe.user;
    }

    // 2. ከ URL ላይ Status እና ID ማግኘት
    const urlParams = new URLSearchParams(window.location.search);
    let statusFromUrl = urlParams.get('status') || 'new';
    let idFromUrl = urlParams.get('userId');

    // 3. አድሚን መሆንህን ማረጋገጥ (OWNER_ID ቼክ)
    // ከቴሌግራም የመጣው ID ወይም ከ URL የመጣው ID ካንተ ID ጋር እኩል መሆኑን ማየት
    let currentId = AppState.user ? AppState.user.id.toString() : (idFromUrl ? idFromUrl.toString() : "");

    if (currentId === OWNER_ID) {
        AppState.isAdmin = true;
        AppState.status = 'vip'; // አድሚን ሁሌም VIP ነው
    } else {
        AppState.status = statusFromUrl;
    }

    renderUI();
}

function renderUI() {
    // ኤለመንቶችን ማግኘት
    const adminMenu = document.getElementById('admin-nav-item');
    const userBadge = document.getElementById('user-badge');
    const welcomeMsg = document.getElementById('welcome-message');
    const navUser = document.getElementById('nav-username');
    const ichimokuVIP = document.getElementById('ichimoku-vip-content');
    const ichimokuLock = document.getElementById('ichimoku-upgrade-prompt');

    // ስም መቀየር
    let firstName = AppState.user ? AppState.user.first_name : "Melek";
    if(welcomeMsg) welcomeMsg.textContent = `እንኳን ደህና መጡ፣ ${firstName}!`;
    if(navUser) navUser.textContent = firstName;

    // አድሚን ከሆነ ፓነሉን አሳይ
    if (AppState.isAdmin) {
        if(adminMenu) adminMenu.classList.remove('hidden');
        if(userBadge) {
            userBadge.textContent = "Admin";
            userBadge.className = "badge gold-badge";
        }
    } else {
        // ተራ ተጠቃሚ ከሆነ
        if(userBadge) {
            if(AppState.status === 'vip') {
                userBadge.textContent = "VIP Member";
                userBadge.className = "badge gold-badge";
            } else {
                userBadge.textContent = "Standard";
                userBadge.className = "badge";
            }
        }
    }

    // የፔጅ አሳያየጥ (Status-based Navigation)
    if (AppState.status === 'approved' || AppState.status === 'vip') {
        showPage('dashboard-page');
        
        // የ Ichimoku VIP ገደብ
        if (AppState.status === 'vip') {
            if(ichimokuVIP) ichimokuVIP.style.display = 'block';
            if(ichimokuLock) ichimokuLock.style.display = 'none';
        } else {
            if(ichimokuVIP) ichimokuVIP.style.display = 'none';
            if(ichimokuLock) ichimokuLock.style.display = 'block';
        }
    } else if (AppState.status === 'pending') {
        showPage('waiting-page');
    } else {
        showPage('login-page');
    }
}

// ቬሪፋይ እና VIP ጥያቄ (ወደ ቦቱ የሚመልሱ)
document.getElementById('verify-btn')?.addEventListener('click', () => {
    window.Telegram.WebApp.openTelegramLink("https://t.me/enqopazyon2bot?start=verify_me");
});

document.getElementById('request-vip-btn')?.addEventListener('click', () => {
    window.Telegram.WebApp.openTelegramLink("https://t.me/enqopazyon2bot?start=request_vip");
});

// Sidebar መቆጣጠሪያ
document.getElementById('open-sidebar')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('show');
});

document.getElementById('close-sidebar')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('show');
});

// የሜኑ ሊንኮች ክሊክ ሲደረጉ
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = link.dataset.target;
        if(target) {
            // ሁሉንም ሴክሽን ደብቅ
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            // የተመረጠውን አሳይ
            const targetSection = document.getElementById(target);
            if(targetSection) targetSection.classList.add('active');
            
            // የአክቲቭ ሊንክ ቀለም ቀይር
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // ሞባይል ከሆነ ሳይድባሩን ዝጋ
            if(window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('sidebar-overlay').classList.remove('show');
            }
        }
    });
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const p = document.getElementById(pageId);
    if(p) p.classList.add('active');
}

window.addEventListener('DOMContentLoaded', initApp);
