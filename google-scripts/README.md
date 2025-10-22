# Google Apps Script - Deposit Page

This folder contains Google Apps Script files for the deposit page functionality.

## Files

- `deposit-backend.gs` - Backend script that handles GET/POST requests
- `deposit-page.html` - Frontend HTML page for deposits

## Setup Instructions

### 1. Create a New Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Name your project (e.g., "Deposit System")

### 2. Add the Files

1. **Add the backend script:**
   - In the Apps Script editor, rename `Code.gs` to `deposit-backend`
   - Copy the contents of `deposit-backend.gs` into this file

2. **Add the HTML file:**
   - Click the `+` button next to "Files"
   - Select "HTML"
   - Name it `deposit-page`
   - Copy the contents of `deposit-page.html` into this file

### 3. Configure Supabase

In `deposit-backend.gs`, update the following constants with your actual values:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SERVICE_ROLE_KEY = 'your-service-role-key-here';
```

**Important:** Use your SERVICE_ROLE_KEY (not the anon key) for backend operations.

### 4. Deploy as Web App

1. Click "Deploy" > "New deployment"
2. Select type: "Web app"
3. Configure:
   - Description: "Deposit Page v1"
   - Execute as: "Me"
   - Who has access: "Anyone" (or your preferred setting)
4. Click "Deploy"
5. Authorize the script when prompted
6. Copy the Web App URL

### 5. Usage

Access your deposit page using the Web App URL with parameters:

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?username=shahid9211&userId=45ab6f42-ab0b-4ca4-913d-166289484f7a
```

## Key Features Fixed

✅ **URL Parameter Handling:** 
- Parameters are properly extracted from the URL in the backend
- Parameters are passed to the HTML template using Apps Script templating (`<?= ?>`)

✅ **User Display:**
- Username and userId from URL are displayed immediately
- No more "Guest" issue - proper user info is shown

✅ **Supabase Integration:**
- Fetches user details from Supabase database
- Falls back to URL parameters if database fetch fails
- Proper error handling for missing configuration

✅ **Pay Now Button:**
- Fully functional payment processing
- Amount validation
- Success/error message display
- Balance update after successful payment

## How It Works

1. **Backend (deposit-backend.gs):**
   - `doGet(e)` receives URL parameters (`username`, `userId`)
   - Creates HTML template from `deposit-page.html`
   - Passes parameters to the template
   - Returns evaluated HTML with embedded parameters

2. **Frontend (deposit-page.html):**
   - Receives parameters via Apps Script scriptlets (`<?= ?>`)
   - Stores parameters in JavaScript variables
   - Fetches additional user details from Supabase
   - Displays user information
   - Handles payment processing

## Troubleshooting

### Issue: Still shows "Guest"
- Make sure you're passing parameters in the URL
- Check that parameters are not empty
- Verify the deployment is using the latest code

### Issue: Supabase errors
- Verify SUPABASE_URL is correct (should be like `https://xxx.supabase.co`)
- Verify SERVICE_ROLE_KEY is the service role key (not anon key)
- Check Supabase table name is `users` with columns `id`, `username`, `balance`

### Issue: Pay Now button doesn't work
- Check browser console for JavaScript errors
- Ensure amount is greater than 0
- Verify all scripts loaded correctly

## Security Notes

- Never expose your SERVICE_ROLE_KEY in client-side code
- Use Apps Script templating to pass sensitive data securely
- Consider implementing proper authentication for production use
- Add rate limiting for payment endpoints
