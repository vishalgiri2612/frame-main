const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://localhost:27017/frame');
  await client.connect();
  const db = client.db();
  
  const products = await db.collection('products').find({}).toArray();
  let missing = 0;
  const domains = new Set();
  const productsWithoutImage = [];
  
  products.forEach(p => {
    if (!p.images || p.images.length === 0) {
      if (p.image) {
        db.collection('products').updateOne({ _id: p._id }, { $set: { images: [p.image] } });
        console.log(`Fixed images array for ${p.sku}`);
      } else {
        missing++;
        productsWithoutImage.push({ name: p.name, sku: p.sku });
      }
    } else {
      try {
        const url = new URL(p.image);
        domains.add(url.hostname);
      } catch(e) {}
    }
  });
  
  console.log("Total products:", products.length);
  console.log("Missing images:", missing);
  if (missing > 0) {
      console.log("Products without image:", productsWithoutImage);
  }
  console.log("Domains used in main image:", Array.from(domains));
  
  await client.close();
}

check().catch(console.error);
