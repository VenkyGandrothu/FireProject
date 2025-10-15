// Test script to verify API configuration
// Run this in browser console to test your API connection

// Test the API configuration
console.log('Testing API Configuration...');

// Test 1: Check if API_URL is set correctly
console.log('API_URL:', window.location.hostname === 'localhost' ? 'Development' : 'Production');

// Test 2: Test API endpoints
async function testAPI() {
  try {
    // Test customers endpoint
    const response = await fetch('https://fireproject-backend.onrender.com/api/customers');
    const data = await response.json();
    console.log('✅ API Test Successful:', data);
    return true;
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    return false;
  }
}

// Run the test
testAPI();
