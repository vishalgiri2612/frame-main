require('dotenv').config({ path: '.env' });
const { getDb } = require('../lib/mongodb');

const initialBrands = [
  {
    slug: "ray-ban",
    name: "Ray-Ban",
    year: "1937",
    count: 142,
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_001_58_030a_new.png",
    accent: "#FF3333",
    origin: "Milan, Italy",
    order: 1,
    status: "ACTIVE"
  },
  {
    slug: "oakley",
    name: "Oakley",
    year: "1975",
    count: 89,
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__al2_1.png",
    accent: "#FF7700",
    origin: "California, USA",
    order: 2,
    status: "ACTIVE"
  },
  {
    slug: "gucci",
    name: "Gucci",
    year: "1921",
    count: 112,
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919631_030a.png",
    accent: "#00FF87",
    origin: "Florence, Italy",
    order: 3,
    status: "ACTIVE"
  },
  {
    slug: "prada",
    name: "Prada",
    year: "1913",
    count: 76,
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2224__901_32__p21__shad__al2.png",
    accent: "#C9A84C",
    origin: "Milan, Italy",
    order: 4,
    status: "ACTIVE"
  },
  {
    slug: "versace",
    name: "Versace",
    year: "1978",
    count: 94,
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_001_58_030a_new.png",
    accent: "#FFD700",
    origin: "Reggio Calabria, Italy",
    order: 5,
    status: "ACTIVE"
  },
  {
    slug: "tom-ford",
    name: "Tom Ford",
    year: "2005",
    count: 65,
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__al2_1.png",
    accent: "#FF007F",
    origin: "Austin, USA",
    order: 6,
    status: "ACTIVE"
  },
  {
    slug: "carrera",
    name: "Carrera",
    year: "1956",
    count: 54,
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919631_030a.png",
    accent: "#00d2ff",
    origin: "Verona, Italy",
    order: 7,
    status: "ACTIVE"
  },
];

async function seedBrands() {
  try {
    const db = await getDb();
    
    // Clear existing brands
    await db.collection("brands").deleteMany({});
    
    // Insert initial brands
    const result = await db.collection("brands").insertMany(initialBrands);
    
    console.log(`Successfully seeded ${result.insertedCount} brands.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding brands:", error);
    process.exit(1);
  }
}

seedBrands();
