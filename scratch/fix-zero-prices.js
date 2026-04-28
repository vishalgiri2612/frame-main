const { MongoClient } = require('mongodb');
const uri = 'mongodb://db_user_frame:db_user_frame@ac-owwcm40-shard-00-00.h17tqbc.mongodb.net:27017,ac-owwcm40-shard-00-01.h17tqbc.mongodb.net:27017,ac-owwcm40-shard-00-02.h17tqbc.mongodb.net:27017/frame?ssl=true&replicaSet=atlas-e17yqe-shard-0&authSource=admin&retryWrites=true&w=majority';

async function fixPrices() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const products = db.collection('products');

    const result1 = await products.updateOne(
      { sku: 'RB0832S-902/R5' },
      { $set: { price: 14500 } }
    );
    console.log('Updated RB0832S:', result1.modifiedCount);

    const result2 = await products.updateOne(
      { sku: 'RB3025-24858' },
      { $set: { price: 14990 } }
    );
    console.log('Updated RB3025:', result2.modifiedCount);

    console.log('Prices fixed successfully.');
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

fixPrices();
