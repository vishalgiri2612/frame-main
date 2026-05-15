/**
 * scripts/update_celebrity_watch.js
 * 
 * Usage: node scripts/update_celebrity_watch.js
 * 
 * This script triggers the AI generation for the "Celebrity Watch" section
 * of the FRAME Magazine. It calls the dedicated API endpoint.
 */

async function updateCelebrityWatch() {
  console.log('--- 📰 FRAME Magazine: Celebrity Watch Updater ---');
  console.log('Sending request to AI pipeline...');

  // Use localhost for local dev, or the production URL if deployed
  const API_URL = process.env.API_URL || 'http://localhost:3000/api/magazine/update-celebrity';

  try {
    const startTime = Date.now();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (result.success) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log('\n✅ SUCCESS: Celebrity Watch has been updated!');
      console.log('------------------------------------------------');
      console.log(`Title:    ${result.article.title}`);
      console.log(`Time:     ${duration}s`);
      console.log(`Image:    ${result.article.image}`);
      console.log('------------------------------------------------');
    } else {
      console.error('\n❌ FAILED:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('\n❌ NETWORK ERROR:', error.message);
    console.log('Make sure your local server is running (npm run dev)');
  }
}

updateCelebrityWatch();
