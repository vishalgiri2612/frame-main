const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.DATABASE_URL;

async function createAdmin() {
  if (!uri) {
    console.error("DATABASE_URL not found");
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const email = 'admin@frame.com';
    const password = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = {
      name: 'Site Administrator',
      email: email,
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: new Date(),
    };

    const exists = await users.findOne({ email });
    if (exists) {
      await users.updateOne({ email }, { $set: { role: 'ADMIN', password: hashedPassword } });
      console.log(`Admin user updated: ${email}`);
    } else {
      await users.insertOne(adminUser);
      console.log(`Admin user created: ${email}`);
    }

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

createAdmin();
