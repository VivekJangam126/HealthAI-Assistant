// Phase 1 - Authentication API Test Script
// Run with: node test-phase1.js

const API_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let authToken = '';
let userId = '';

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

// Test functions
async function testHealthCheck() {
  console.log(`\n${colors.cyan}[TEST 1] Health Check${colors.reset}`);
  const result = await apiCall('GET', '/health');
  
  if (result.status === 200 && result.data.success) {
    console.log(`${colors.green}✓ PASSED${colors.reset} - API is running`);
    console.log(`  Response:`, result.data.message);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - API not responding`);
    return false;
  }
}

async function testRegister() {
  console.log(`\n${colors.cyan}[TEST 2] User Registration${colors.reset}`);
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'test123456',
    displayName: 'Test User',
  };

  const result = await apiCall('POST', '/auth/register', testUser);
  
  if (result.status === 201 && result.data && result.data.success) {
    authToken = result.data.token;
    userId = result.data.user.id;
    console.log(`${colors.green}✓ PASSED${colors.reset} - User registered successfully`);
    console.log(`  User ID: ${userId}`);
    console.log(`  Email: ${result.data.user.email}`);
    console.log(`  Display Name: ${result.data.user.displayName}`);
    console.log(`  Token received: ${authToken.substring(0, 20)}...`);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - Registration failed`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Response:`, JSON.stringify(result.data || result.error, null, 2));
    return false;
  }
}

async function testDuplicateRegistration() {
  console.log(`\n${colors.cyan}[TEST 3] Duplicate Registration (Should Fail)${colors.reset}`);
  const testUser = {
    email: 'duplicate@example.com',
    password: 'test123456',
    displayName: 'Duplicate User',
  };

  // Register first time
  await apiCall('POST', '/auth/register', testUser);
  
  // Try to register again with same email
  const result = await apiCall('POST', '/auth/register', testUser);
  
  if (result.status === 400 && !result.data.success) {
    console.log(`${colors.green}✓ PASSED${colors.reset} - Duplicate registration correctly rejected`);
    console.log(`  Error message: ${result.data.message}`);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - Duplicate registration should be rejected`);
    return false;
  }
}

async function testInvalidRegistration() {
  console.log(`\n${colors.cyan}[TEST 4] Invalid Registration Data (Should Fail)${colors.reset}`);
  const invalidUser = {
    email: 'invalid-email',
    password: '123', // Too short
    displayName: '',
  };

  const result = await apiCall('POST', '/auth/register', invalidUser);
  
  if (result.status === 400 && !result.data.success) {
    console.log(`${colors.green}✓ PASSED${colors.reset} - Invalid data correctly rejected`);
    console.log(`  Validation errors detected`);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - Invalid data should be rejected`);
    return false;
  }
}

async function testLogin() {
  console.log(`\n${colors.cyan}[TEST 5] User Login${colors.reset}`);
  
  // First register a user
  const testUser = {
    email: `login${Date.now()}@example.com`,
    password: 'test123456',
    displayName: 'Login Test User',
  };
  await apiCall('POST', '/auth/register', testUser);

  // Now login
  const loginData = {
    email: testUser.email,
    password: testUser.password,
  };

  const result = await apiCall('POST', '/auth/login', loginData);
  
  if (result.status === 200 && result.data && result.data.success) {
    authToken = result.data.token;
    console.log(`${colors.green}✓ PASSED${colors.reset} - Login successful`);
    console.log(`  Email: ${result.data.user.email}`);
    console.log(`  Last Login: ${result.data.user.lastLogin}`);
    console.log(`  Token received: ${authToken.substring(0, 20)}...`);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - Login failed`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Response:`, JSON.stringify(result.data || result.error, null, 2));
    return false;
  }
}

async function testInvalidLogin() {
  console.log(`\n${colors.cyan}[TEST 6] Invalid Login (Should Fail)${colors.reset}`);
  const invalidLogin = {
    email: 'nonexistent@example.com',
    password: 'wrongpassword',
  };

  const result = await apiCall('POST', '/auth/login', invalidLogin);
  
  if (result.status === 401 && !result.data.success) {
    console.log(`${colors.green}✓ PASSED${colors.reset} - Invalid credentials correctly rejected`);
    console.log(`  Error message: ${result.data.message}`);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - Invalid login should be rejected`);
    return false;
  }
}

async function testGetCurrentUser() {
  console.log(`\n${colors.cyan}[TEST 7] Get Current User (Protected Route)${colors.reset}`);
  
  if (!authToken) {
    console.log(`${colors.yellow}⚠ SKIPPED${colors.reset} - No auth token available`);
    return false;
  }

  const result = await apiCall('GET', '/auth/me', null, authToken);
  
  if (result.status === 200 && result.data.success) {
    console.log(`${colors.green}✓ PASSED${colors.reset} - User data retrieved`);
    console.log(`  User ID: ${result.data.user.id}`);
    console.log(`  Email: ${result.data.user.email}`);
    console.log(`  Display Name: ${result.data.user.displayName}`);
    console.log(`  Preferences:`, result.data.user.preferences);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - Failed to get user data`);
    console.log(`  Error:`, result.data.message || result.error);
    return false;
  }
}

async function testUnauthorizedAccess() {
  console.log(`\n${colors.cyan}[TEST 8] Unauthorized Access (Should Fail)${colors.reset}`);
  
  const result = await apiCall('GET', '/auth/me', null, 'invalid_token');
  
  if (result.status === 401 && !result.data.success) {
    console.log(`${colors.green}✓ PASSED${colors.reset} - Unauthorized access correctly blocked`);
    console.log(`  Error message: ${result.data.message}`);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - Unauthorized access should be blocked`);
    return false;
  }
}

async function testUpdateProfile() {
  console.log(`\n${colors.cyan}[TEST 9] Update User Profile${colors.reset}`);
  
  if (!authToken) {
    console.log(`${colors.yellow}⚠ SKIPPED${colors.reset} - No auth token available`);
    return false;
  }

  const updateData = {
    displayName: 'Updated Test User',
    preferences: {
      language: 'es',
      theme: 'dark',
      notifications: false,
    },
  };

  const result = await apiCall('PUT', '/auth/update-profile', updateData, authToken);
  
  if (result.status === 200 && result.data.success) {
    console.log(`${colors.green}✓ PASSED${colors.reset} - Profile updated successfully`);
    console.log(`  New Display Name: ${result.data.user.displayName}`);
    console.log(`  New Language: ${result.data.user.preferences.language}`);
    console.log(`  New Theme: ${result.data.user.preferences.theme}`);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - Profile update failed`);
    console.log(`  Error:`, result.data.message || result.error);
    return false;
  }
}

async function testLogout() {
  console.log(`\n${colors.cyan}[TEST 10] User Logout${colors.reset}`);
  
  if (!authToken) {
    console.log(`${colors.yellow}⚠ SKIPPED${colors.reset} - No auth token available`);
    return false;
  }

  const result = await apiCall('POST', '/auth/logout', null, authToken);
  
  if (result.status === 200 && result.data.success) {
    console.log(`${colors.green}✓ PASSED${colors.reset} - Logout successful`);
    console.log(`  Message: ${result.data.message}`);
    return true;
  } else {
    console.log(`${colors.red}✗ FAILED${colors.reset} - Logout failed`);
    console.log(`  Error:`, result.data.message || result.error);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  PHASE 1 - AUTHENTICATION API TEST SUITE${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`\nTesting API at: ${API_URL}`);
  console.log(`Time: ${new Date().toLocaleString()}\n`);

  const results = [];

  // Run all tests
  results.push(await testHealthCheck());
  results.push(await testRegister());
  results.push(await testDuplicateRegistration());
  results.push(await testInvalidRegistration());
  results.push(await testLogin());
  results.push(await testInvalidLogin());
  results.push(await testGetCurrentUser());
  results.push(await testUnauthorizedAccess());
  results.push(await testUpdateProfile());
  results.push(await testLogout());

  // Summary
  const passed = results.filter(r => r === true).length;
  const failed = results.filter(r => r === false).length;
  const total = results.length;

  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  TEST SUMMARY${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`\nTotal Tests: ${total}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log(`${colors.green}🎉 ALL TESTS PASSED! Phase 1 implementation is working correctly.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}\n`);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Start tests
(async () => {
  console.log('Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log(`${colors.red}✗ ERROR: Server is not running at ${API_URL}${colors.reset}`);
    console.log(`\nPlease start the server first:`);
    console.log(`  cd server`);
    console.log(`  npm run dev\n`);
    process.exit(1);
  }

  await runTests();
})();
