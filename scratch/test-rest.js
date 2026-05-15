const axios = require('axios');

async function testRest() {
    const apiKey = "AIzaSyDJZJG3W41zJlcDdTx4cVk_JY2F6Ticmz0";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    try {
        const res = await axios.post(url, {
            contents: [{ parts: [{ text: "Write a short poem about sunglasses." }] }]
        });
        console.log("REST_SUCCESS:", JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error("REST_ERROR:", err.response ? err.response.data : err.message);
    }
}

testRest();
