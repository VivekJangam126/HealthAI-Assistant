const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testUserId = '';
let testHistoryId = '';

// Test data
const testUser = {
  email: `testuser_${Date.now()}@test.com`,
  password: 'Test123!@#',
  displayName: 'Test User Phase 2',
};

const testConversation = {
  feature: 'symptoms',
  title: 'Test Symptom Analysis',
  messages: [
    {
      role: 'user',
      content: 'I have a headache and fever',
      timestamp: new Date(),
    },
    {
      role: 'assistant',
      content: 'Based on your symptoms, you might have a common cold or flu. Please consult a doctor.',
      timestamp: new Date(),
    },
  ],
  tags: ['headache', 'fever'],
};

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, useAuth = false) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: useAuth ? { Authorization: `Bearer ${authToken}` } : {},
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n[TEST 1] Health Check');
  const result = await apiCall('GET', '/health');
  
  if (result.success) {
    console.log('✓ PASSED - API is running');
    console.log(`  Response:`, result.data);
    return true;
  } else {
    console.log('✗ FAILED - API is not responding');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n[TEST 2] User Registration');
  const result = await apiCall('POST', '/auth/register', testUser);
  
  if (result.success && result.data.token) {
    authToken = result.data.token;
    testUserId = result.data.user._id;
    console.log('✓ PASSED - User registered successfully');
    console.log(`  User ID: ${testUserId}`);
    console.log(`  Token received: ${authToken.substring(0, 20)}...`);
    return true;
  } else {
    console.log('✗ FAILED - Registration failed');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testCreateConversation() {
  console.log('\n[TEST 3] Create Conversation');
  const result = await apiCall('POST', '/history', testConversation, true);
  
  if (result.success && result.data.history) {
    testHistoryId = result.data.history._id;
    console.log('✓ PASSED - Conversation created');
    console.log(`  History ID: ${testHistoryId}`);
    console.log(`  Title: ${result.data.history.title}`);
    console.log(`  Feature: ${result.data.history.feature}`);
    console.log(`  Messages: ${result.data.history.messages.length}`);
    return true;
  } else {
    console.log('✗ FAILED - Failed to create conversation');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testGetAllConversations() {
  console.log('\n[TEST 4] Get All Conversations');
  const result = await apiCall('GET', '/history', null, true);
  
  if (result.success && result.data.history) {
    console.log('✓ PASSED - Conversations retrieved');
    console.log(`  Total conversations: ${result.data.pagination.total}`);
    console.log(`  Current page: ${result.data.pagination.page}`);
    console.log(`  Total pages: ${result.data.pagination.pages}`);
    return true;
  } else {
    console.log('✗ FAILED - Failed to get conversations');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testGetConversationById() {
  console.log('\n[TEST 5] Get Conversation by ID');
  const result = await apiCall('GET', `/history/${testHistoryId}`, null, true);
  
  if (result.success && result.data.history) {
    console.log('✓ PASSED - Conversation retrieved');
    console.log(`  Title: ${result.data.history.title}`);
    console.log(`  Messages: ${result.data.history.messages.length}`);
    console.log(`  Bookmarked: ${result.data.history.bookmarked}`);
    return true;
  } else {
    console.log('✗ FAILED - Failed to get conversation');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testUpdateConversation() {
  console.log('\n[TEST 6] Update Conversation');
  
  const updatedData = {
    title: 'Updated Test Symptom Analysis',
    messages: [
      ...testConversation.messages,
      {
        role: 'user',
        content: 'Thank you for the advice',
        timestamp: new Date(),
      },
    ],
  };
  
  const result = await apiCall('PUT', `/history/${testHistoryId}`, updatedData, true);
  
  if (result.success && result.data.history) {
    console.log('✓ PASSED - Conversation updated');
    console.log(`  New title: ${result.data.history.title}`);
    console.log(`  Messages count: ${result.data.history.messages.length}`);
    return true;
  } else {
    console.log('✗ FAILED - Failed to update conversation');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testToggleBookmark() {
  console.log('\n[TEST 7] Toggle Bookmark');
  const result = await apiCall('POST', `/history/${testHistoryId}/bookmark`, null, true);
  
  if (result.success) {
    console.log('✓ PASSED - Bookmark toggled');
    console.log(`  Bookmarked: ${result.data.bookmarked}`);
    console.log(`  Message: ${result.data.message}`);
    return true;
  } else {
    console.log('✗ FAILED - Failed to toggle bookmark');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testSearchConversations() {
  console.log('\n[TEST 8] Search Conversations');
  const result = await apiCall('GET', '/history?search=headache', null, true);
  
  if (result.success && result.data.history) {
    console.log('✓ PASSED - Search completed');
    console.log(`  Results found: ${result.data.history.length}`);
    return true;
  } else {
    console.log('✗ FAILED - Search failed');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testFilterByFeature() {
  console.log('\n[TEST 9] Filter by Feature');
  const result = await apiCall('GET', '/history?feature=symptoms', null, true);
  
  if (result.success && result.data.history) {
    console.log('✓ PASSED - Filter applied');
    console.log(`  Symptom conversations: ${result.data.history.length}`);
    return true;
  } else {
    console.log('✗ FAILED - Filter failed');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testFilterBookmarked() {
  console.log('\n[TEST 10] Filter Bookmarked');
  const result = await apiCall('GET', '/history?bookmarked=true', null, true);
  
  if (result.success && result.data.history) {
    console.log('✓ PASSED - Bookmarked filter applied');
    console.log(`  Bookmarked conversations: ${result.data.history.length}`);
    return true;
  } else {
    console.log('✗ FAILED - Bookmarked filter failed');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testGetByFeatureType() {
  console.log('\n[TEST 11] Get by Feature Type');
  const result = await apiCall('GET', '/history/feature/symptoms', null, true);
  
  if (result.success && result.data.history) {
    console.log('✓ PASSED - Feature type retrieved');
    console.log(`  Count: ${result.data.count}`);
    return true;
  } else {
    console.log('✗ FAILED - Feature type retrieval failed');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testPagination() {
  console.log('\n[TEST 12] Pagination');
  const result = await apiCall('GET', '/history?page=1&limit=5', null, true);
  
  if (result.success && result.data.pagination) {
    console.log('✓ PASSED - Pagination working');
    console.log(`  Page: ${result.data.pagination.page}`);
    console.log(`  Limit: ${result.data.pagination.limit}`);
    console.log(`  Total: ${result.data.pagination.total}`);
    return true;
  } else {
    console.log('✗ FAILED - Pagination failed');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testDeleteConversation() {
  console.log('\n[TEST 13] Delete Conversation');
  const result = await apiCall('DELETE', `/history/${testHistoryId}`, null, true);
  
  if (result.success) {
    console.log('✓ PASSED - Conversation deleted');
    console.log(`  Message: ${result.data.message}`);
    return true;
  } else {
    console.log('✗ FAILED - Failed to delete conversation');
    console.log(`  Error:`, result.error);
    return false;
  }
}

async function testUnauthorizedAccess() {
  console.log('\n[TEST 14] Unauthorized Access (Should Fail)');
  const result = await apiCall('GET', '/history', null, false);
  
  if (!result.success && result.status === 401) {
    console.log('✓ PASSED - Unauthorized access blocked');
    console.log(`  Error: ${result.error}`);
    return true;
  } else {
    console.log('✗ FAILED - Unauthorized access should be blocked');
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('PHASE 2 - CONVERSATION HISTORY API TEST SUITE');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Testing API at: ${API_URL}`);
  console.log(`Time: ${new Date().toLocaleString()}`);

  const tests = [
    testHealthCheck,
    testUserRegistration,
    testCreateConversation,
    testGetAllConversations,
    testGetConversationById,
    testUpdateConversation,
    testToggleBookmark,
    testSearchConversations,
    testFilterByFeature,
    testFilterBookmarked,
    testGetByFeatureType,
    testPagination,
    testDeleteConversation,
    testUnauthorizedAccess,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log('✗ TEST ERROR:', error.message);
      failed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Phase 2 implementation is complete.\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.\n');
  }
}

// Check if server is running before starting tests
async function checkServer() {
  console.log('Checking if server is running...');
  try {
    await axios.get(`${API_URL}/health`);
    console.log('✓ Server is running\n');
    return true;
  } catch (error) {
    console.log('✗ Server is not running!');
    console.log('Please start the server with: npm run dev\n');
    return false;
  }
}

// Run the tests
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
})();
