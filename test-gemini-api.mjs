// Quick test script for Gemini API key
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAwqS6yj7nNBpH9lkkR_79EN1tB1_5XzFU";

async function testGeminiAPI() {
  console.log("🔍 Testing Gemini API Key...\n");
  
  try {
    // Initialize the API
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    console.log("✅ API Key format is valid");
    console.log("📡 Sending test request to Gemini API...\n");
    
    // Send a simple test prompt
    const result = await model.generateContent("Say 'Hello! API is working!' in one sentence.");
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ SUCCESS! API Key is working!\n");
    console.log("📝 Response from Gemini:");
    console.log("─".repeat(50));
    console.log(text);
    console.log("─".repeat(50));
    console.log("\n✨ Your Gemini API key is valid and functional!");
    
  } catch (error) {
    console.error("❌ ERROR: API Key test failed!\n");
    
    if (error.message.includes("API_KEY_INVALID") || error.message.includes("invalid")) {
      console.error("🔑 The API key appears to be invalid or expired.");
      console.error("   Please generate a new key at: https://aistudio.google.com/app/apikey");
    } else if (error.message.includes("quota") || error.message.includes("limit")) {
      console.error("📊 API quota exceeded or rate limit reached.");
      console.error("   Wait a moment and try again, or check your quota.");
    } else if (error.message.includes("permission") || error.message.includes("403")) {
      console.error("🚫 Permission denied. The API key may not have access to this model.");
    } else {
      console.error("⚠️  Error details:", error.message);
    }
    
    console.error("\n💡 Troubleshooting tips:");
    console.error("   1. Verify the API key at https://aistudio.google.com/app/apikey");
    console.error("   2. Ensure the API key has Generative AI API enabled");
    console.error("   3. Check if there are any usage restrictions on your key");
    console.error("   4. Try generating a new API key if this one is old");
  }
}

// Run the test
testGeminiAPI();
