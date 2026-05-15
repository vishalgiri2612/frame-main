const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDJZJG3W41zJlcDdTx4cVk_JY2F6Ticmz0");

async function listModels() {
    try {
        // The library doesn't have a direct listModels, but we can try to hit a known model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("test");
        console.log("SUCCESS");
    } catch (err) {
        console.error("ERROR:", err.message);
    }
}

listModels();
