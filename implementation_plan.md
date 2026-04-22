# የትሬዲንግ ዳሽቦርድ ስርዓት (Trading Dashboard System)

በሰጠኸኝ ዝርዝር መስፈርት (Requirements Document) መሰረት፣ ይሄንን ዌብ አፕሊኬሽን በ HTML፣ CSS እና Vanilla JavaScript በመጠቀም በአንድ ገጽ (Single Page Application - SPA) መልክ እንገነባዋለን። 

## User Review Required

> [!IMPORTANT]
> **የቦት ማረጋገጫ (Bot Verification) እና አድሚን ዳታቤዝ**
> በአሁኑ ሰዓት የጀርባ ኮድ (Backend/Database) ስለሌለን፣ የቦት ማረጋገጫውን እና የአድሚን ፓነሉን ዳታ በ **Local Storage (የብራውዘር ማህደረ ትውስታ)** በመጠቀም (Mock አድርገን) እንሰራዋለን። በኋላ ላይ ከእውነተኛ ቦት (ለምሳሌ Telegram Web App) እና ከእውነተኛ ዳታቤዝ ጋር ማገናኘት ትችላለህ።

## Open Questions

> [!CAUTION]
> **ግልጽ መሆን ያለባቸው ጥያቄዎች:**
> 1. **የቦት ውህደት (Bot Integration):** ዌብ አፑ የሚከፈተው በቴሌግራም ሚኒ አፕ (Telegram Mini App) ውስጥ ነው? ከሆነ የቴሌግራምን `window.Telegram.WebApp` ስክሪፕት መጠቀም ያስፈልገናል።
> 2. **Google Sheets ውህደት:** ጆርናሉን ወደ Google Sheets ለመላክ የ **Google Apps Script** URL ያስፈልገናል። ለጊዜው የውሸት (Placeholder) ሊንክ ተጠቅሜ ልስራው?

## Proposed Changes

አፕሊኬሽኑን በ 3 ዋና ዋና ፋይሎች እንከፍለዋለን፡-

---

### Frontend Files

#### [NEW] index.html
ይህ ፋይል ሁሉንም ክፍሎች (Sections) በአንድ ላይ አቅፎ ይይዛል።
- የመግቢያ እና ማረጋገጫ ገጽ (Login & Verification)
- የአድሚን ፓነል ገጽ (Admin Panel)
- የዳሽቦርድ ዋና ክፍል (Sidebar እና Content Area)
  - Home, Analysis (TradingView & Calendar iframes), Journal (Form), Academy (Videos), Stats

#### [NEW] style.css
- **Dark & Gold Theme:** ዳራው ጥቁር (#121212 ወይም #000000) ሆኖ ጽሁፎች እና በተኖች በወርቃማ ቀለም (#D4AF37 ወይም #FFD700) ያጌጣሉ።
- **Responsive Design:** ለስልክ ሲከፈት ሄደር (Header) ሳይኖረው ሜኑው ከስር ወይንም ከጎን ተደብቆ (Hamburger menu) እንዲወጣ ይደረጋል።
- **Animations:** ገጾች ሲቀያየሩ ለስላሳ የትራንዚሽን አኒሜሽን (Smooth Transitions) ይኖረዋል።

#### [NEW] app.js
- **State Management:** የተጠቃሚውን ሁኔታ (Verifying, Waiting Approval, Approved, Admin) የሚቆጣጠር ሎጂክ።
- **Navigation:** በዳሽቦርዱ ውስጥ ከገጽ ወደ ገጽ (Home -> Analysis -> Journal ወዘተ) ሲኬድ ክፍሎቹን መደበቅ እና ማሳየት።
- **Admin Actions:** አድሚኑ ተጠቃሚዎችን ሲያጸድቅ (Approve/Reject) የሚሰራበት ተግባር።
- **Journal Submission:** ፎርሙ ሲሞላ መረጃውን ሰብስቦ በ `fetch` ወደ Google Sheets የሚልክበት ኮድ።

## Verification Plan

### Manual Verification
- ዌብ አፑን በብራውዘር ላይ በመክፈት የመግቢያ ሂደቱን (Login Flow) እንሞክራለን።
- ሆን ብለን ወደ አድሚን ፓነል በመግባት "ተጠቃሚዎችን" አጽድቀን (Approve አድርገን) ዳሽቦርዱ መከፈቱን እናረጋግጣለን።
- በዳሽቦርዱ ውስጥ ያሉት ሁሉም ክፍሎች (Analysis, Journal, Academy) በትክክል መስራታቸውን እና የ Dark/Gold ዲዛይኑ ማራኪ መሆኑን እናረጋግጣለን።
- በስልክ እይታ (Mobile View) Responsive መሆኑን ቼክ እናደርጋለን።
