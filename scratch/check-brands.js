require('dotenv').config({ path: '.env' });
const { getDb } = require('../lib/mongodb');

async function checkBrands() {
  try {
    const db = await getDb();
    const brands = await db.collection("brands").find({}).toArray();
    console.log("Brands count:", brands.length);
    console.log(JSON.stringify(brands, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Error checking brands:", error);
    process.exit(1);
  }
}

checkBrands();
