const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function restore() {
  const client = new MongoClient('mongodb://localhost:27017/frame');
  try {
    await client.connect();
    const db = client.db();

    const dumpPath = path.join(__dirname, '../scratch/excel-dump.json');
    if (!fs.existsSync(dumpPath)) {
      console.log('No excel-dump.json found');
      return;
    }

    const rawData = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
    
    // The first row is headers: SNO, BRAND, CATEGORY, MODEL NO, COLOUR, SIZE, PRODUCT DESCRIPTION, POLARISED, PIC 1-4, AMOUNT
    const rows = rawData.slice(1);

    const products = rows.map((row, index) => {
      const brand = row.__EMPTY_1 || 'Ray-Ban';
      const category = row.__EMPTY_2 || 'SUNGLASSES';
      const modelNo = row.__EMPTY_3 || `MODEL-${index}`;
      const color = row.__EMPTY_4 || '';
      const size = row.__EMPTY_5 || '';
      const description = row.__EMPTY_6 || '';
      const brandUpper = brand.toUpperCase().trim();
      const brandPricing = {
        'RAY-BAN': { base: 9900, variation: 3000 },
        'RAYBAN': { base: 9900, variation: 3000 },
        'OAKLEY': { base: 12000, variation: 4000 },
        'GUCCI': { base: 25000, variation: 10000 },
        'PRADA': { base: 22000, variation: 8000 },
        'CARTIER': { base: 45000, variation: 20000 },
      };

      let basePrice = 15000;
      let variation = 5000;
      if (brandPricing[brandUpper]) {
        basePrice = brandPricing[brandUpper].base;
        variation = brandPricing[brandUpper].variation;
      }

      const seed = (modelNo + color).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const finalPrice = basePrice + (seed % variation);
      const roundedPrice = Math.floor(finalPrice / 100) * 100 + 90;

      // Determine product name and type for images
      let name = `${brand === 'RAYBAN' ? 'Ray-Ban' : brand} ${modelNo}`.trim();
      if (description.toLowerCase().includes('aviator')) name = `Aviator Classic ${modelNo}`;
      else if (description.toLowerCase().includes('wayfarer')) name = `Wayfarer Classic ${modelNo}`;
      else if (description.toLowerCase().includes('clubmaster')) name = `Clubmaster Classic ${modelNo}`;
      else if (description.toLowerCase().includes('round')) name = `Round Metal ${modelNo}`;

      // Set placeholder images based on name
      let mainImage = '/images/placeholders/wayfarer_front.png';
      let angleImages = [
        '/images/placeholders/wayfarer_front.png',
        '/images/placeholders/wayfarer_perspective.png',
        '/images/placeholders/wayfarer_side.png',
        '/images/placeholders/wayfarer_tilted.png'
      ];
      
      const lowerName = name.toLowerCase();
      if (lowerName.includes('aviator')) {
        mainImage = '/images/placeholders/aviator_front.png';
        angleImages = [
          '/images/placeholders/aviator_front.png',
          '/images/placeholders/aviator_perspective.png',
          '/images/placeholders/aviator_side.png',
          '/images/placeholders/aviator_tilted.png'
        ];
      } else if (lowerName.includes('clubmaster')) {
        mainImage = '/images/placeholders/clubmaster_front.png';
        angleImages = [
          '/images/placeholders/clubmaster_front.png',
          '/images/placeholders/clubmaster_perspective.png',
          '/images/placeholders/clubmaster_side.png',
          '/images/placeholders/clubmaster_tilted.png'
        ];
      } else if (lowerName.includes('round')) {
        mainImage = '/images/placeholders/round_front.png';
        angleImages = [
          '/images/placeholders/round_front.png',
          '/images/placeholders/round.png',
          '/images/placeholders/round_placeholder.png'
        ];
      }

      return {
        name: name,
        sku: `${modelNo}-${color}`.replace(/\//g, '-'),
        slug: `${brand}-${modelNo}-${color}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: brand === 'RAYBAN' ? 'Ray-Ban' : brand,
        brandSlug: brand.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: category,
        categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: roundedPrice,
        stock: Math.floor(Math.random() * 50) + 5,
        status: 'ACTIVE',
        image: mainImage,
        images: angleImages,
        description: `FRAME DESCRIPTION: \n${description}\n\nPRODUCT DIMENSIONS:\nSize: ${size}`,
        featured: Math.random() > 0.8,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    console.log(`Prepared ${products.length} products. Inserting...`);
    
    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(products);
    
    console.log('Successfully restored products!');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

restore();
