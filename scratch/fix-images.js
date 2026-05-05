const { MongoClient } = require('mongodb');

async function fix() {
  const client = new MongoClient('mongodb://localhost:27017/frame');
  await client.connect();
  
  const db = client.db();
  const products = await db.collection('products').find().toArray();
  const invalid = products.filter(p => !p.image.startsWith('/') && !p.image.startsWith('http'));
  
  for (const product of invalid) {
    await db.collection('products').updateOne(
      { _id: product._id },
      { 
        $set: { 
          image: '/images/placeholders/wayfarer_front.png',
          images: ['/images/placeholders/wayfarer_front.png']
        } 
      }
    );
    console.log(`Fixed product ${product._id}`);
  }
  
  await client.close();
  console.log('Done fixing products');
}

fix();
