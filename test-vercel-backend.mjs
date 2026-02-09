const BACKEND_URL = "https://ayumitra2026.vercel.app/api";

async function testBackend() {
  console.log("Testing Vercel Backend Connection...");
  console.log("Backend URL:", BACKEND_URL);
  console.log("=" .repeat(60));

  // Test 1: Health Check
  console.log("\n1. Testing Health Endpoint...");
  try {
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health Check:", healthResponse.status, healthData);
  } catch (error) {
    console.error("❌ Health Check Failed:", error.message);
  }

  // Test 2: Test Login (with test credentials)
  console.log("\n2. Testing Login Endpoint...");
  try {
    const loginResponse = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log("Status:", loginResponse.status);
    
    if (loginResponse.ok) {
      console.log("✅ Login endpoint working");
      console.log("Response includes token:", !!loginData.token);
      console.log("Response includes user:", !!loginData.user);
      console.log("User has geminiApiKey field:", 'geminiApiKey' in (loginData.user || {}));
    } else {
      console.log("⚠️ Login failed (expected for test credentials):", loginData.message);
      console.log("This is normal - endpoint is working, just no test user exists");
    }
  } catch (error) {
    console.error("❌ Login Test Failed:", error.message);
  }

  // Test 3: Test Register
  console.log("\n3. Testing Register Endpoint...");
  try {
    const registerResponse = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log("Status:", registerResponse.status);
    
    if (registerResponse.ok) {
      console.log("✅ Register endpoint working");
      console.log("Response includes token:", !!registerData.token);
      console.log("Response includes user:", !!registerData.user);
      console.log("User has geminiApiKey field:", 'geminiApiKey' in (registerData.user || {}));
      console.log("geminiApiKey value:", registerData.user?.geminiApiKey || '(empty)');
    } else {
      console.log("❌ Register failed:", registerData.message);
    }
  } catch (error) {
    console.error("❌ Register Test Failed:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("Backend Testing Complete!");
}

testBackend();
