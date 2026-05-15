const fetch = require('node-fetch');

async function populate() {
    console.log("🚀 Starting Bulk Magazine Generation (5 Articles)...");
    
    for (let i = 1; i <= 5; i++) {
        console.log(`\n📄 Generating Article ${i}/5...`);
        try {
            const response = await fetch('http://localhost:3000/api/magazine/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            
            if (result.success) {
                console.log(`✅ Success: ${result.data.title}`);
                console.log(`🖼️ Image: ${result.data.image}`);
            } else {
                console.log(`❌ Failed: ${result.error}`);
            }
            
            // Wait 2 seconds between requests to avoid AI rate limits
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`💥 Error generating article ${i}:`, error.message);
        }
    }
    
    console.log("\n✨ Bulk generation complete. Please check your website.");
}

populate();
