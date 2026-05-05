const { MongoClient } = require('mongodb');

async function fixAngles() {
  const client = new MongoClient('mongodb://localhost:27017/frame');
  try {
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({}).toArray();
    
    for (const p of products) {
      let mainImage = '/images/placeholders/wayfarer_front.png'; // Default
      let angleImages = [
        '/images/placeholders/wayfarer_front.png',
        '/images/placeholders/wayfarer_perspective.png',
        '/images/placeholders/wayfarer_side.png',
        '/images/placeholders/wayfarer_tilted.png'
      ];
      
      const name = p.name.toLowerCase();
      
      if (name.includes('aviator')) {
        mainImage = '/images/placeholders/aviator_front.png';
        angleImages = [
          '/images/placeholders/aviator_front.png',
          '/images/placeholders/aviator_perspective.png',
          '/images/placeholders/aviator_side.png',
          '/images/placeholders/aviator_tilted.png'
        ];
      } else if (name.includes('wayfarer')) {
        mainImage = '/images/placeholders/wayfarer_front.png';
        angleImages = [
          '/images/placeholders/wayfarer_front.png',
          '/images/placeholders/wayfarer_perspective.png',
          '/images/placeholders/wayfarer_side.png',
          '/images/placeholders/wayfarer_tilted.png'
        ];
      } else if (name.includes('clubmaster')) {
        mainImage = '/images/placeholders/clubmaster_front.png';
        angleImages = [
          '/images/placeholders/clubmaster_front.png',
          '/images/placeholders/clubmaster_perspective.png',
          '/images/placeholders/clubmaster_side.png',
          '/images/placeholders/clubmaster_tilted.png'
        ];
      } else if (name.includes('round')) {
        mainImage = '/images/placeholders/round_front.png';
        angleImages = [
          '/images/placeholders/round_front.png',
          '/images/placeholders/round.png',
          '/images/placeholders/round_placeholder.png'
        ];
      }
      
      // Update both main image and images gallery array with the angles
      await db.collection('products').updateOne(
        { _id: p._id },
        { 
          $set: { 
            image: mainImage,
            images: angleImages 
          } 
        }
      );
    }
    
    console.log('Successfully updated all products with multi-angle placeholders for rotation.');
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

fixAngles();
