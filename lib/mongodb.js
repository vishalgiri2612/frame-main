import { MongoClient } from "mongodb";
import dns from "dns";

// Set custom DNS resolvers to fix SRV resolution issues in some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.DATABASE_URL;
const options = {};

let client;
let clientPromise;

if (!process.env.DATABASE_URL) {
  throw new Error("Please add your Mongo URI to .env");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    console.log("Creating new MongoDB client connection...");
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .then(c => {
        console.log("MongoDB Connected Successfully");
        return c;
      })
      .catch(err => {
        console.error("MongoDB Connection Failed:", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export { clientPromise };

export async function getDb() {
  try {
    const client = await clientPromise;
    return client.db();
  } catch (error) {
    console.error("GET_DB_ERROR:", error);
    throw error;
  }
}
