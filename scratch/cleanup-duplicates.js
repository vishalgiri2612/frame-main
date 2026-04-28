const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const uri = process.env.DATABASE_URL;

if (!uri) {
  console.error("DATABASE_URL not found in .env. Current path: " + path.join(__dirname, '..', '.env'));
  process.exit(1);
}

async function cleanup() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("products");

    console.log("Starting duplicate cleanup by SKU...");

    const duplicates = await collection.aggregate([
      {
        $group: {
          _id: "$sku",
          uniqueIds: { $addToSet: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();

    console.log(`Found ${duplicates.length} SKUs with duplicates.`);

    let totalRemoved = 0;
    for (const dup of duplicates) {
      // Keep the first one, delete the rest
      const idsToRemove = dup.uniqueIds.slice(1);
      const result = await collection.deleteMany({ _id: { $in: idsToRemove } });
      totalRemoved += result.deletedCount;
    }

    console.log(`Successfully removed ${totalRemoved} duplicate documents.`);

  } catch (error) {
    console.error("Cleanup failed:", error);
  } finally {
    await client.close();
  }
}

cleanup();
