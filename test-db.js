require('dotenv').config();
const { MongoClient } = require('mongodb');
const dns = require('dns');

// Set Google DNS as requested
console.log('Setting DNS resolvers to 8.8.8.8, 8.8.4.4...');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function testConnection() {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error('❌ Error: DATABASE_URL not found in .env file');
    process.exit(1);
  }

  console.log('\n--- MongoDB Connection Test ---');
  // Mask password for safe logging
  const maskedUri = uri.replace(/\/\/(.*):(.*)@/, '//****:****@');
  console.log(`Connecting to: ${maskedUri}`);

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    console.log('1. Attempting to connect to cluster...');
    await client.connect();

    console.log('2. Connected! Sending ping...');
    await client.db("admin").command({ ping: 1 });

    console.log('✅ Success: Connected to MongoDB successfully!');

    const db = client.db();
    console.log(`\nConnected to Database: ${db.databaseName}`);

    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections.`);

  } catch (error) {
    console.error('\n❌ Connection Failed!');
    console.error('---------------------------');
    console.error(`Error Code: ${error.code || 'N/A'}`);
    console.error(`Error Name: ${error.name}`);
    console.error(`Message: ${error.message}`);
    console.error('---------------------------');

    if (error.message.includes('ECONNREFUSED')) {
      console.log('POSSIBLE CAUSES:');
      console.log('1. IP Whitelist: Your current IP is not allowed in MongoDB Atlas.');
      console.log('2. Network: Your firewall or ISP is blocking port 27017.');
      console.log('3. DNS: If using custom DNS (8.8.8.8) still fails, check if your router/ISP blocks 3rd-party DNS.');
    }

    if (error.message.includes('123')) {
      console.log('CRITICAL: The driver is still misinterpreting "@123" in your password.');
      console.log('I have updated .env to use "%40123" instead. Please ensure .env is saved.');
    }
  } finally {
    await client.close();
    console.log('--- Test Completed ---\n');
  }
}

testConnection().catch(err => {
  console.error('CRITICAL_SCRIPT_ERROR:', err);
});
