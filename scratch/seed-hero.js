require('dotenv').config({ path: '.env' });
const { getDb } = require('../lib/mongodb');

const initialHeroSlides = [
  {
    src: "/m1.png",
    frameImg: "/image copy.png",
    frameName: "Mega Wayfarer II — Tortoise",
    frameLink: "/shop/RB0832S-902/R5",
    theme: "rgba(212,175,55,0.4)",
    badge: "ESTABLISHED 1987 / LUXURY EYEWEAR",
    titleTop: "SEE THE",
    titleItalic: "UNSEEN.",
    sub: "Engineering the perfect balance between architectural precision and timeless editorial aesthetics. Explore our curated selection of global masterpieces.",
    order: 1,
    status: "ACTIVE"
  },
  {
    src: "/m2.png",
    frameImg: "/image.png",
    frameName: "Mega Wayfarer II — Black",
    frameLink: "/shop/RB0832S-901/58",
    theme: "rgba(255,255,255,0.25)",
    badge: "CRAFTED EXCELLENCE / PREMIUM SERIES",
    titleTop: "TIMELESS",
    titleItalic: "ELEGANCE.",
    sub: "A fusion of heritage craftsmanship and cutting-edge design. Discover eyewear that defines your unique perspective with unparalleled clarity.",
    order: 2,
    status: "ACTIVE"
  },
  {
    src: "/m3.png",
    frameImg: "/image copy.png",
    frameName: "Mega Wayfarer II — Tortoise",
    frameLink: "/shop/RB0832S-902/R5",
    theme: "rgba(212,175,55,0.4)",
    badge: "MODERN VISION / ARTISAN FRAMES",
    titleTop: "BEYOND",
    titleItalic: "SIGHT.",
    sub: "Sculpting the future of optics with sustainable materials and bold silhouettes. Elevate your everyday style with a vision for tomorrow.",
    order: 3,
    status: "ACTIVE"
  }
];

async function seedHeroSlides() {
  try {
    const db = await getDb();
    
    // Clear existing slides
    await db.collection("hero_slides").deleteMany({});
    
    // Insert initial slides
    const result = await db.collection("hero_slides").insertMany(initialHeroSlides);
    
    console.log(`Successfully seeded ${result.insertedCount} hero slides.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding hero slides:", error);
    process.exit(1);
  }
}

seedHeroSlides();
