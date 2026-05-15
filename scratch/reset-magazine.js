/**
 * reset-magazine.js
 *
 * Clears ALL magazine articles and generates 5 fresh ones:
 *   1. Celebrity with sunglasses    (Celebrity Sightings)
 *   2. Best-seller sunglasses       (Trend Alert)
 *   3. Model with sunglasses        (Red Carpet)
 *   4. Sunglasses detail / craft    (Style Guide)
 *   5. Street style sunglasses      (Style Guide)
 *
 * Images are generated via Magnific Flux Pro 1.1 (falls back to Unsplash if no key).
 * Text is generated via OpenRouter gpt-oss-120b:free (falls back to Gemini).
 *
 * Run: node scratch/reset-magazine.js
 */
const fetch = require('node-fetch');
const BASE  = 'http://localhost:3000';

const SLOT_NAMES = [
  'Celebrity with sunglasses',
  'Best-seller sunglasses',
  'Model with sunglasses',
  'Sunglasses detail / craft',
  'Street style sunglasses',
];

async function reset() {
  console.log('🗑️  Clearing old magazine articles...');
  const clearRes = await fetch(`${BASE}/api/magazine/clear`, { method: 'DELETE' }).catch(e => {
    console.error('❌ Cannot reach dev server:', e.message);
    process.exit(1);
  });
  const clearJson = await clearRes.json();
  console.log(`✅ Cleared ${clearJson.deleted} articles.\n`);

  console.log('🚀 Generating 5 fresh editorial articles...');
  console.log('   (Images via Magnific — each may take ~30-60s)\n');

  let ok = 0;
  for (let i = 0; i < 5; i++) {
    console.log(`📄 [${i+1}/5] ${SLOT_NAMES[i]}...`);
    const start = Date.now();
    try {
      const res  = await fetch(`${BASE}/api/magazine/generate`, { method: 'POST' });
      const json = await res.json();
      const secs = ((Date.now() - start) / 1000).toFixed(1);

      if (json.success) {
        console.log(`   ✅ ${json.data.title}`);
        console.log(`   🏷️  ${json.data.tag} · Slot: ${json.data.slotId}`);
        console.log(`   🖼️  ${json.data.image}`);
        console.log(`   ⏱️  ${secs}s\n`);
        ok++;
      } else {
        console.log(`   ❌ ${json.error}\n`);
      }
    } catch (e) {
      console.log(`   💥 ${e.message}\n`);
    }

    // 2s gap between requests (Magnific is async; Gemini needs rate-limit buffer)
    if (i < 4) await new Promise(r => setTimeout(r, 2000));
  }

  console.log('─'.repeat(52));
  console.log(`✨ Done! ${ok}/5 articles generated.`);
  console.log(`📖 Visit: http://localhost:3000/magazine\n`);
}

reset();
