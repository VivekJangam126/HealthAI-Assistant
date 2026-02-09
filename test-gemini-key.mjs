import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBWrKeumJQtJhYILEdvMLt6xJvHu3rr7Ws";

async function testGeminiAPI() {
  try {
    console.log("Testing Gemini API key...");
    console.log("API Key:", API_KEY.substring(0, 10) + "..." + API_KEY.substring(API_KEY.length - 5));
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Say 'Hello, the API key is working!' in one sentence.";
    
    console.log("\nSending test request...");
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log("\n✅ SUCCESS! API Key is working!");
    console.log("Response:", response);
    console.log("\nAPI Key Status: VALID ✓");
    
  } catch (error) {
    console.error("\n❌ ERROR! API Key test failed!");
    console.error("Error details:", error.message);
    
    if (error.message?.includes('quota') || error.message?.includes('429') || error.status === 429) {
      console.error("\n⚠️ QUOTA EXCEEDED - Your API key has reached its usage limit");
      console.error("Please check: https://ai.google.dev/gemini-api/docs/rate-limits");
    } else if (error.message?.includes('API key not valid') || error.message?.includes('invalid')) {
      console.error("\n⚠️ INVALID API KEY - The API key is not valid");
    } else {
      console.error("\n⚠️ UNKNOWN ERROR");
    }
    
    console.error("\nAPI Key Status: FAILED ✗");
  }
}

testGeminiAPI();
