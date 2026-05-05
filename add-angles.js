const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/frame';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({ brand: /Ray-Ban/i }).toArray();

    for (const product of products) {
      if (!product.image) continue;

      let newImages = [];
      const primaryUrl = product.image;

      if (primaryUrl.includes('__shad__')) {
        // Pattern: ...__shad__al2.png
        const base = primaryUrl.split('__shad__')[0];
        const ext = '.png';
        const angles = ['qt', 'fr', 'cfr', 'al2', 'lt'];
        
        newImages = angles.map(angle => {
           // Handle the _1 suffix seen in some urls
           if (primaryUrl.includes('__shad__al2_1.png')) return `${base}__shad__${angle}_1.png`;
           return `${base}__shad__${angle}.png`;
        });
      } else if (primaryUrl.includes('_030a')) {
        // Pattern: ..._030a.png
        const base = primaryUrl.split('_030a')[0];
        const angles = ['_030a', '_030f', '_030c', '_030e'];
        newImages = angles.map(angle => `${base}${angle}.png`);
      } else {
        // Fallback: just use what's there
        newImages = product.images && product.images.length > 0 ? product.images : [primaryUrl];
      }

      // Filter out duplicates and keep primary first
      newImages = [...new Set([primaryUrl, ...newImages])];

      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: { images: newImages } }
      );
      console.log(`Updated angles for: ${product.name}`);
    }
    console.log('Finished updating product angles.');
  } finally {
    await client.close();
  }
}

run();
