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
function initApp() {
    let tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        AppState.user = tg.initDataUnsafe.user;
    } else {
        AppState.user = { id: 1001, first_name: "Test User", username: "testuser" };
    }

    // ከ Bots.Business በ URL የተላከውን የዩዘር Status ማንበብ
    const urlParams = new URLSearchParams(window.location.search);
    AppState.status = urlParams.get('status') || 'new';
    AppState.isAdmin = urlParams.get('admin') === 'true';

    checkUserStatus();
    loadTradingViewWidget();
    loadEconomicCalendar();
}

// ገፆቹን በ Status መክፈት
function checkUserStatus() {
    if (AppState.status === 'approved' || AppState.status === 'vip') {
        setupDashboard();
        showPage('dashboard-page');
        if (AppState.isAdmin) {
            document.getElementById('admin-nav-item').classList.remove('hidden');
        }
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
    
    const badge = document.getElementById('user-badge');
    if (AppState.status === 'vip') {
        badge.textContent = 'VIP Member';
        badge.className = 'badge gold-badge';
        document.getElementById('ichimoku-vip-content').style.display = 'block';
        document.getElementById('ichimoku-upgrade-prompt').style.display = 'none';
    } else {
        badge.textContent = 'Standard';
        document.getElementById('ichimoku-vip-content').style.display = 'none';
        document.getElementById('ichimoku-upgrade-prompt').style.display = 'block';
    }
}

// TradingView Widget
function loadTradingViewWidget(symbol = "BINANCE:BTCUSDT") {
    const container = document.getElementById('tv-chart-container');
    if (!container) return;
    
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tv-chart-container"
        });
    };
    document.head.appendChild(script);
}

// Economic Calendar
function loadEconomicCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;

    container.innerHTML = `<iframe src="https://sslecal2.forexprostools.com?columns=exc_flags,exc_currencies,exc_importance,exc_actual,exc_forecast,exc_previous&category=_employment,_economicIndicators,_gdp,_centralBanks,_inflation&importance=1,2,3&features=datepicker,timezone&countries=25,32,6,37,7,5,22,11,10,35,43,56,36,110,17,42,15,4,12,72&calType=week&timeZone=15&lang=1" width="100%" height="500" frameborder="0" allowtransparency="true" marginwidth="0" marginheight="0"></iframe>`;
}

// Asset Selector Event
document.getElementById('asset-selector')?.addEventListener('change', (e) => {
    loadTradingViewWidget(e.target.value);
});

// ቬሪፋይ በተን ሲነካ...
document.getElementById('verify-btn')?.addEventListener('click', () => {
    window.Telegram.WebApp.openTelegramLink("https://t.me/enqopazyon2bot?start=verify");
});

// ጆርናል መመዝገቢያ
document.getElementById('journal-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        userId: AppState.user.id,
        username: AppState.user.username,
        type: e.target['trade-type'].value,
        pair: document.getElementById('currency-pair').value,
        entry: document.getElementById('entry-price').value,
        exit: document.getElementById('exit-price').value,
        pnl: document.getElementById('pnl').value,
        notes: document.getElementById('trade-notes').value,
        sheetUrl: document.getElementById('sheet-url').value
    };

    showToast("ትሬዱ እየተመዘገበ ነው...");
    
    // Bots.Business HTTP API ካለህ እዚህ ጋር መላክ ትችላለህ
    // ለምሳሌ፡ fetch('YOUR_BOTS_BUSINESS_API_URL', { method: 'POST', body: JSON.stringify(formData) })
    
    console.log("Journal Data:", formData);
    setTimeout(() => {
        showToast("ትሬዱ በተሳካ ሁኔታ ተመዝግቧል!");
        e.target.reset();
    }, 1500);
});

// Ichimoku Setup መመዝገቢያ
document.getElementById('ichimoku-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("ሴታፑ ተቀምጧል! ለቦቱ ይላካል።");
});

// Admin Dashboard Button
document.getElementById('admin-dashboard-btn')?.addEventListener('click', () => {
    showPage('dashboard-page');
});

// VIP Request Button
document.getElementById('request-vip-btn')?.addEventListener('click', () => {
    window.Telegram.WebApp.openTelegramLink("https://t.me/enqopazyon2bot?start=upgrade_vip");
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
