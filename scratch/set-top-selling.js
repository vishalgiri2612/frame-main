require('dotenv').config({ path: '.env' });
const { getDb } = require('../lib/mongodb');

async function setTopSelling() {
  try {
    const db = await getDb();
    
    // Clear existing top selling
    await db.collection("products").updateMany({}, { $set: { topSelling: false } });
    
    // Get 5 active products
    const products = await db.collection("products")
      .find({ status: "ACTIVE" })
      .limit(5)
      .toArray();
    
    if (products.length === 0) {
      console.log("No active products found.");
      return;
    }
    
    const ids = products.map(p => p._id);
    
    // Set top selling
    const result = await db.collection("products").updateMany(
      { _id: { $in: ids } },
      { $set: { topSelling: true } }
    );
    
    console.log(`Successfully marked ${result.modifiedCount} products as Top Selling.`);
    process.exit(0);
  } catch (error) {
    console.error("Error setting top selling:", error);
    process.exit(1);
  }
}

setTopSelling();
