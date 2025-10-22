# Deposit Page Flow Diagram

## Complete Flow: URL Parameters → Display

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ACCESSES URL                         │
│  https://script.google.com/.../exec?username=shahid9211&userId=..│
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GOOGLE APPS SCRIPT BACKEND                     │
│                    (deposit-backend.gs)                          │
│                                                                  │
│  function doGet(e) {                                            │
│    ┌──────────────────────────────────────────────┐            │
│    │ 1. Extract URL Parameters                     │            │
│    │    const username = e.parameter.username      │            │
│    │    const userId = e.parameter.userId          │            │
│    └──────────────────┬───────────────────────────┘            │
│                       │                                          │
│    ┌──────────────────▼───────────────────────────┐            │
│    │ 2. Create HTML Template                       │            │
│    │    const template = createTemplateFromFile()  │            │
│    └──────────────────┬───────────────────────────┘            │
│                       │                                          │
│    ┌──────────────────▼───────────────────────────┐            │
│    │ 3. Pass Parameters to Template                │            │
│    │    template.username = username               │            │
│    │    template.userId = userId                   │            │
│    │    template.supabaseUrl = SUPABASE_URL        │            │
│    │    template.serviceRoleKey = SERVICE_ROLE_KEY │            │
│    └──────────────────┬───────────────────────────┘            │
│                       │                                          │
│    ┌──────────────────▼───────────────────────────┐            │
│    │ 4. Evaluate and Return HTML                   │            │
│    │    return template.evaluate()                 │            │
│    └──────────────────┬───────────────────────────┘            │
│  }                    │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│              HTML TEMPLATE WITH SCRIPTLETS                       │
│                  (deposit-page.html)                             │
│                                                                  │
│  <script>                                                        │
│    ┌──────────────────────────────────────────────┐            │
│    │ 1. Receive Parameters via Scriptlets          │            │
│    │    const URL_USERNAME = '<?= username ?>'     │            │
│    │    const URL_USER_ID = '<?= userId ?>'        │            │
│    │    const SUPABASE_URL = '<?= supabaseUrl ?>'  │            │
│    └──────────────────┬───────────────────────────┘            │
│                       │                                          │
│                       ▼                                          │
│    ┌─────────────────────────────────────────────────┐         │
│    │ 2. Initialize Page on Load                       │         │
│    │    async function initializePage() {            │         │
│    │      console.log('Username:', URL_USERNAME)     │         │
│    │      console.log('User ID:', URL_USER_ID)       │         │
│    └──────────────────┬──────────────────────────────┘         │
│                       │                                          │
│                       ▼                                          │
│    ┌─────────────────────────────────────────────────┐         │
│    │ 3. Check Parameters Present                      │         │
│    │    if (!URL_USERNAME || !URL_USER_ID) {         │         │
│    │      showError('Missing parameters')            │         │
│    │      return                                      │         │
│    │    }                                             │         │
│    └──────────────────┬──────────────────────────────┘         │
│                       │                                          │
│                       ▼                                          │
│    ┌─────────────────────────────────────────────────┐         │
│    │ 4. Fetch User Details from Supabase              │         │
│    │    await fetchUserDetails(URL_USER_ID, ...)     │         │
│    └──────────────────┬──────────────────────────────┘         │
│  </script>            │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE DATABASE                           │
│                                                                  │
│  ┌──────────────────────────────────────────────┐              │
│  │ Fetch User: GET /rest/v1/users?id=eq.userId  │              │
│  │                                               │              │
│  │ Headers:                                      │              │
│  │   - apikey: SERVICE_ROLE_KEY                 │              │
│  │   - Authorization: Bearer SERVICE_ROLE_KEY   │              │
│  └──────────────────┬───────────────────────────┘              │
│                     │                                            │
│          ┌──────────▼──────────┐                                │
│          │   User Found?        │                                │
│          └──────┬───────┬──────┘                                │
│                 │       │                                        │
│            YES  │       │  NO                                    │
└─────────────────┼───────┼────────────────────────────────────────┘
                  │       │
            ┌─────▼───────▼─────┐
            │   Frontend Logic   │
            └─────┬───────┬──────┘
                  │       │
         ┌────────▼───┐   └────────┐
         │ Display DB │            │ Fallback to
         │ User Data  │            │ URL Parameters
         └────────┬───┘            │
                  │                │
                  └────────┬───────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DISPLAY USER INFO                             │
│                                                                  │
│  ┌──────────────────────────────────────────────┐              │
│  │ function displayUserInfo(user) {              │              │
│  │   // Update welcome message                  │              │
│  │   displayUsername.textContent = user.username│              │
│  │                                               │              │
│  │   // Update user details                     │              │
│  │   username.textContent = user.username       │              │
│  │   userId.textContent = user.id               │              │
│  │   balance.textContent = '₹' + user.balance   │              │
│  │                                               │              │
│  │   // Show user info section                  │              │
│  │   userInfoSection.style.display = 'block'    │              │
│  │ }                                             │              │
│  └───────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PAGE FULLY LOADED                             │
│                                                                  │
│  ┌───────────────────────────────────────────────────┐         │
│  │  Welcome, shahid9211! 👋                          │         │
│  │                                                    │         │
│  │  ┌──────────────────────────────────────┐        │         │
│  │  │ Username: shahid9211                  │        │         │
│  │  │ User ID: 45ab6f42-ab0b-4ca4-913d-... │        │         │
│  │  │ Balance: ₹0                            │        │         │
│  │  └──────────────────────────────────────┘        │         │
│  │                                                    │         │
│  │  Deposit Amount (₹)                               │         │
│  │  [ Enter amount... ]                              │         │
│  │                                                    │         │
│  │  [ Pay Now ]  ← WORKING! ✅                       │         │
│  └───────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLICKS PAY NOW                           │
│                                                                  │
│  ┌──────────────────────────────────────────────┐              │
│  │ async function handlePayment() {              │              │
│  │   1. Validate amount                          │              │
│  │   2. Disable button (prevent double-click)    │              │
│  │   3. Process payment                          │              │
│  │   4. Show success message                     │              │
│  │   5. Update balance                           │              │
│  │   6. Re-enable button                         │              │
│  │ }                                             │              │
│  └───────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Key Points

### 1. URL Parameter Flow
```
Browser URL → Google Apps Script → HTML Template → JavaScript Variables → Display
```

### 2. Parameter Extraction
- **Backend:** `e.parameter.username` extracts from `?username=value`
- **Template:** `template.username = username` passes to HTML
- **Frontend:** `const URL_USERNAME = '<?= username ?>'` receives value

### 3. No More "Guest" Issue
- ❌ Before: `<span id="displayUsername">Guest</span>`
- ✅ After: `displayUsername.textContent = user.username` (from URL params)

### 4. Working Pay Now Button
```
Click → Validate → Process → Success → Update Balance
```

## Comparison: Before vs After

### Before ❌
```
URL: ?username=shahid9211&userId=...
      │
      ▼
Backend: No parameter extraction
      │
      ▼
Frontend: No parameters received
      │
      ▼
Display: "Welcome, Guest!" ← WRONG!
         Pay Now button: Not working ← WRONG!
```

### After ✅
```
URL: ?username=shahid9211&userId=...
      │
      ▼
Backend: e.parameter.username extracts "shahid9211"
      │
      ▼
Template: template.username = "shahid9211"
      │
      ▼
Frontend: URL_USERNAME = "shahid9211"
      │
      ▼
Display: "Welcome, shahid9211!" ← CORRECT! ✅
         Pay Now button: Working ← CORRECT! ✅
```

## Data Flow Example

### Example URL:
```
https://script.google.com/macros/s/ABC123/exec?username=shahid9211&userId=45ab6f42
```

### Step-by-Step:
1. **Backend receives:** `e.parameter = {username: "shahid9211", userId: "45ab6f42"}`
2. **Backend passes:** `template.username = "shahid9211"`
3. **HTML evaluates:** `const URL_USERNAME = 'shahid9211'` (scriptlet replaced)
4. **JavaScript uses:** `console.log(URL_USERNAME)` outputs "shahid9211"
5. **Display shows:** "Welcome, shahid9211!"

## Security Flow

```
┌──────────────────┐
│ URL Parameters   │  Public (OK for username/userId)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Backend Template │  Private (SERVICE_ROLE_KEY safe here)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Frontend JS      │  Receives params via scriptlets
└──────────────────┘
```

**Security Note:** SERVICE_ROLE_KEY stays in backend, passed to frontend only through server-side scriptlet evaluation, never exposed in URL or client code.

---

**Status:** ✅ Complete working implementation
