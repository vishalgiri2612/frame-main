const { MongoClient } = require('mongodb');

async function update() {
  const client = new MongoClient('mongodb://localhost:27017/frame');
  await client.connect();
  const db = client.db();
  
  const p = await db.collection('products').findOne({ sku: 'CT0061RS-001' });
  if (p && p.image) {
    await db.collection('products').updateOne(
      { sku: 'CT0061RS-001' },
      { $set: { images: [p.image] } }
    );
    console.log("Successfully updated Cartier product images array.");
  }
  
  await client.close();
}

update().catch(console.error);
