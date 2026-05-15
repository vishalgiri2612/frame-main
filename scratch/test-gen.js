const fetch = require('node-fetch');

async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/magazine/generate', { method: 'POST' });
        const json = await res.json();
        console.log("RESPONSE:", JSON.stringify(json, null, 2));
    } catch (err) {
        console.error("TEST_ERROR:", err);
    }
}

test();
