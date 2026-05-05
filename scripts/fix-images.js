const { MongoClient } = require('mongodb');

async function fix() {
  const client = new MongoClient('mongodb://localhost:27017/frame');
  try {
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({}).toArray();
    
    for (const p of products) {
      let placeholder = '/images/placeholders/wayfarer.png'; // Default
      const name = p.name.toLowerCase();
      
      if (name.includes('aviator')) {
        placeholder = '/images/placeholders/aviator.png';
      } else if (name.includes('wayfarer')) {
        placeholder = '/images/placeholders/wayfarer.png';
      } else if (name.includes('clubmaster')) {
        placeholder = '/images/placeholders/clubmaster.png';
      } else if (name.includes('round')) {
        placeholder = '/images/placeholders/round.png';
      }
      
      // Update both main image and images gallery
      await db.collection('products').updateOne(
        { _id: p._id },
        { 
          $set: { 
            image: placeholder,
            images: [placeholder] 
          } 
        }
      );
    }
    
    console.log('Successfully updated all products with high-quality placeholders.');
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

fix();
