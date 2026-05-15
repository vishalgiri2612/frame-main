const { getDb } = require('../lib/mongodb');

async function checkUsers() {
  try {
    const db = await getDb();
    const users = await db.collection('users').find({}).toArray();
    console.log('--- User List ---');
    users.forEach(u => {
      console.log(`Email: ${u.email}, Role: ${u.role}`);
    });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkUsers();
