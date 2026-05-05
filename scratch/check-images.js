const { MongoClient } = require('mongodb');

async function check() {
  const client = new MongoClient('mongodb://localhost:27017/frame');
  await client.connect();
  
  const products = await client.db().collection('products').find().toArray();
  const invalid = products.filter(p => !p.image.startsWith('/') && !p.image.startsWith('http'));
  
  console.log(JSON.stringify(invalid, null, 2));
  await client.close();
}

check();
