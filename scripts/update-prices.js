const { MongoClient } = require('mongodb');

async function updatePrices() {
  const client = new MongoClient('mongodb://localhost:27017/frame');
  try {
    await client.connect();
    const db = client.db();

    // Brand-specific pricing map (Standard retail prices in INR)
    const brandPricing = {
      'RAY-BAN': { base: 9900, variation: 3000 },
      'RAYBAN': { base: 9900, variation: 3000 },
      'OAKLEY': { base: 12000, variation: 4000 },
      'GUCCI': { base: 25000, variation: 10000 },
      'PRADA': { base: 22000, variation: 8000 },
      'CARTIER': { base: 45000, variation: 20000 },
      'TOM FORD': { base: 28000, variation: 12000 },
      'PERSOL': { base: 18000, variation: 5000 },
    };

    const products = await db.collection('products').find({}).toArray();
    
    console.log(`Updating prices for ${products.length} products...`);

    for (const product of products) {
      const brandUpper = (product.brand || '').toUpperCase().trim();
      let basePrice = 15000;
      let variation = 5000;

      if (brandPricing[brandUpper]) {
        basePrice = brandPricing[brandUpper].base;
        variation = brandPricing[brandUpper].variation;
      }

      // Generate a semi-deterministic price based on SKU/ID to keep it consistent
      const seed = (product.sku || product._id.toString()).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const finalPrice = basePrice + (seed % variation);
      
      // Round to nearest 100 or 99 for a "retail" look
      const roundedPrice = Math.floor(finalPrice / 100) * 100 + 90;

      // Normalize brand name while we're at it
      let normalizedBrand = product.brand;
      if (brandUpper === 'RAYBAN' || brandUpper === 'RAY-BAN') normalizedBrand = 'Ray-Ban';

      await db.collection('products').updateOne(
        { _id: product._id },
        { 
          $set: { 
            price: roundedPrice,
            brand: normalizedBrand 
          } 
        }
      );
    }

    console.log('Successfully updated all prices according to brand standards.');
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

updatePrices();
