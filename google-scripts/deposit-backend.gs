// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY';

/**
 * Handle GET requests and serve the deposit page with URL parameters
 */
function doGet(e) {
  // Extract URL parameters
  const username = e.parameter.username || '';
  const userId = e.parameter.userId || '';
  
  // Create HTML output from the deposit-page.html file
  const template = HtmlService.createTemplateFromFile('deposit-page');
  
  // Pass parameters to the HTML template
  template.username = username;
  template.userId = userId;
  template.supabaseUrl = SUPABASE_URL;
  template.serviceRoleKey = SERVICE_ROLE_KEY;
  
  // Return the evaluated HTML
  return template.evaluate()
    .setTitle('Deposit Page')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Handle POST requests for payment processing
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const userId = data.userId;
    const amount = data.amount;
    const username = data.username;
    
    if (!userId || !amount) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Missing required fields'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Here you can add payment processing logic
    // For now, we'll just return a success response
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Payment initiated successfully',
      userId: userId,
      amount: amount,
      username: username
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error processing payment: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fetch user details from Supabase
 */
function getUserFromSupabase(userId) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`;
    
    const options = {
      method: 'get',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode === 200) {
      const users = JSON.parse(response.getContentText());
      return users.length > 0 ? users[0] : null;
    } else {
      Logger.log('Error fetching user: ' + responseCode);
      return null;
    }
  } catch (error) {
    Logger.log('Error in getUserFromSupabase: ' + error.toString());
    return null;
  }
}
