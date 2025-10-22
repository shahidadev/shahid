# 🚀 Quick Start Guide - Deposit Page

## 5-Minute Setup

### Step 1: Open Google Apps Script
Go to: https://script.google.com/

### Step 2: Create New Project
1. Click **"New Project"**
2. Name it: "Deposit System"

### Step 3: Add Backend File
1. Rename `Code.gs` to `deposit-backend`
2. Delete any existing code
3. Copy entire content from `deposit-backend.gs`
4. Paste into the editor

### Step 4: Add Frontend File
1. Click **`+`** next to "Files"
2. Select **"HTML"**
3. Name it: `deposit-page`
4. Delete any existing code
5. Copy entire content from `deposit-page.html`
6. Paste into the editor

### Step 5: Configure Supabase
In `deposit-backend.gs`, find these lines (at top):
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY';
```

Replace with your actual values:
```javascript
const SUPABASE_URL = 'https://xyzabc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Where to find these:**
- **SUPABASE_URL:** Supabase Dashboard → Settings → API → Project URL
- **SERVICE_ROLE_KEY:** Supabase Dashboard → Settings → API → service_role key (Secret!)

### Step 6: Deploy
1. Click **"Deploy"** (top right)
2. Select **"New deployment"**
3. Click gear icon ⚙️ next to "Select type"
4. Choose **"Web app"**
5. Fill in:
   - Description: `Deposit Page v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **"Deploy"**
7. Click **"Authorize access"**
8. Choose your Google account
9. Click **"Advanced"** → **"Go to [Project Name] (unsafe)"**
10. Click **"Allow"**
11. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123...`)

### Step 7: Test It!
Open your browser and go to:
```
[YOUR_WEB_APP_URL]?username=shahid9211&userId=45ab6f42-ab0b-4ca4-913d-166289484f7a
```

**Expected Result:**
✅ Page loads with "Welcome, shahid9211!"
✅ User details displayed
✅ Pay Now button works

---

## Troubleshooting

### Problem: "Missing URL parameters" error
**Solution:** Make sure you added `?username=...&userId=...` to the URL

### Problem: Still shows "Guest"
**Solution:** 
1. Check URL has parameters
2. Redeploy as new version
3. Use the new URL

### Problem: Supabase errors
**Solution:**
1. Verify `SUPABASE_URL` is correct
2. Verify `SERVICE_ROLE_KEY` is the **service role key** (not anon key)
3. Check Supabase table exists: `users` with columns `id`, `username`, `balance`

### Problem: Pay Now button doesn't respond
**Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Ensure amount is greater than 0

---

## Testing Checklist

Before sharing with users, verify:

- [ ] URL opens without errors
- [ ] Username displays correctly (not "Guest")
- [ ] User ID displays correctly
- [ ] Balance shows (₹0 if new user)
- [ ] Amount input accepts numbers
- [ ] Pay Now button is clickable
- [ ] Success message appears after payment
- [ ] Balance updates after payment
- [ ] Console shows no errors (F12 → Console)

---

## Example URLs

### Test User 1:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?username=shahid9211&userId=45ab6f42-ab0b-4ca4-913d-166289484f7a
```

### Test User 2:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?username=testuser&userId=12345678-1234-1234-1234-123456789012
```

---

## What's Fixed?

| Issue | Before ❌ | After ✅ |
|-------|-----------|----------|
| Username display | Shows "Guest" | Shows actual username from URL |
| User details | Not loaded | Loaded from Supabase or URL |
| Pay Now button | Not working | Fully functional |
| Parameters | Not read | Properly extracted and used |
| Error handling | None | Comprehensive with messages |

---

## Support

If issues persist:
1. Check `SOLUTION.md` for detailed technical explanation
2. Review `README.md` for complete setup guide
3. See `FLOW-DIAGRAM.md` to understand the flow
4. Check browser console (F12) for errors
5. Verify Supabase configuration

---

## Next Steps

### For Development:
1. Add actual payment gateway integration
2. Update balance in Supabase after payment
3. Add transaction history
4. Implement proper authentication

### For Production:
1. Secure the deployment (change "Anyone" to "Anyone with link")
2. Add rate limiting
3. Implement proper error logging
4. Add user authentication
5. Use environment variables for sensitive keys

---

**🎉 You're all set! The deposit page should now work correctly with URL parameters.**

For more details, see:
- `README.md` - Complete documentation
- `SOLUTION.md` - Technical details
- `FLOW-DIAGRAM.md` - Visual flow explanation
