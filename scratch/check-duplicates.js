const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.DATABASE_URL;

async function check() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("products");

    const duplicates = await collection.aggregate([
      { $group: { _id: "$sku", count: { $sum: 1 }, docs: { $push: "$_id" } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    console.log("Duplicate SKUs found:", JSON.stringify(duplicates, null, 2));
    console.log("Total unique SKUs with duplicates:", duplicates.length);

  } finally {
    await client.close();
  }
}

check();
