const { MongoClient } = require('mongodb');

// Update this URI if you are not using Atlas
const uri = "mongodb://db_user_frame:db_user_frame@ac-owwcm40-shard-00-00.h17tqbc.mongodb.net:27017,ac-owwcm40-shard-00-01.h17tqbc.mongodb.net:27017,ac-owwcm40-shard-00-02.h17tqbc.mongodb.net:27017/frame?ssl=true&replicaSet=atlas-e17yqe-shard-0&authSource=admin&retryWrites=true&w=majority";

async function seed() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    const products = [
      {
        name: "Ray-Ban RB3931 Metal Unisex Sunglass",
        sku: "RB3931-00131-54",
        price: 13590,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3931__001_31__p21__shad__qt_1.png",
        images: [
          "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3931__001_31__p21__shad__qt_1.png",
          "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3931__001_31__p21__shad__fr.png",
          "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3931__001_31__p21__shad__cfr.png",
          "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3931__001_31__p21__shad__al2.png"
        ],
        description: "Product Details\nMetal Unisex Sunglass\nSKU: 0RB3931001/31\n\nFRAME DESCRIPTION\nShape: Pillow\nFrame Color: Gold\nTemple Color: Gold\nMaterial: Metal\nEye Size: 54\n\nLENS INFORMATION\nLens Color: Green\nLens Height: 42.4 mm\nPolarized: No\nGradient: No\n\nPRODUCT DIMENSIONS\nTemple Length: 145 mm\nBridge Size: 21 mm\nLens Height: 42.4 mm\n\nFITTING\nNosepads: Metal Standard\nBridge Type: Single\nBridge Design: Standard\n\nIncluded in your order:\nCASE, CLEANING CLOTH",
        featured: false,
        tags: ["Metal", "Unisex", "Non-polarised", "Ray-Ban", "Oval"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB0832S MEGA WAYFARER UNISEX",
        sku: "RB0832S-684532-55",
        price: 13650,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__al2_1.png",
        images: [
          "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__al2_1.png",
          "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__cfr_1.png",
          "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__qt_1.png",
          "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__lt_1.png"
        ],
        description: "Mega Wayfarer II: Icons never fade - they only grow bolder. This oversized silhouette pairs mega temples with the signature rivets of the original Wayfarer for an unmistakable look.\n\nModel code: RB0832S 684532\n\nFRAME DESCRIPTION\nFrame Shape: Square\nFrame material: Propionate\n\nLENS INFORMATION\nTreatment: Solid Color\n\nPRODUCT DIMENSIONS\nLens height: 40.6 mm\nBridge Width: 21 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Generous\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Mega Wayfarer", "Unisex", "Non-polarised", "Ray-Ban", "Square"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB0832S MEGA WAYFARER UNISEX Dark",
        sku: "RB0832S-68463F-55",
        price: 13650,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__68463f__p21__shad__al2.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__68463f__p21__shad__al2.png", "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__68463f__p21__shad__cfr.png"],
        description: "Mega Wayfarer II: Icons never fade - they only grow bolder.\n\nModel code: RB0832S 68463F\n\nFRAME DESCRIPTION\nFrame Shape: Square\nFrame material: Propionate\n\nLENS INFORMATION\nTreatment: Gradient/Solid Color\n\nPRODUCT DIMENSIONS\nLens height: 40.6 mm\nBridge Width: 21 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Generous\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Mega Wayfarer", "Unisex", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB0832S MEGA WAYFARER UNISEX Polarized",
        sku: "RB0832S-90158-55",
        price: 13890,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__901_58__p21__shad__al2.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__901_58__p21__shad__al2.png", "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__901_58__p21__shad__cfr.png"],
        description: "Mega Wayfarer II: Icons never fade - they only grow bolder.\n\nModel code: RB0832S 901/58\n\nFRAME DESCRIPTION\nFrame Shape: Square\nFrame material: Propionate\n\nLENS INFORMATION\nLens Color: Green\nPolarized: Yes\nTreatment: Solid Color\n\nPRODUCT DIMENSIONS\nLens height: 40.6 mm\nBridge Width: 21 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Generous\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Mega Wayfarer", "Polarised", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB0832S MEGA WAYFARER UNISEX Red",
        sku: "RB0832S-902R5-52",
        price: 13650,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__902_r5__p21__shad__al2.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__902_r5__p21__shad__al2.png"],
        description: "Mega Wayfarer II: Icons never fade - they only grow bolder.\n\nModel code: RB0832S 902/R5\n\nFRAME DESCRIPTION\nFrame Shape: Square\nFrame material: Propionate\n\nLENS INFORMATION\nTreatment: Solid Color\n\nPRODUCT DIMENSIONS\nLens height: 40.6 mm\nBridge Width: 21 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Generous\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Mega Wayfarer", "Unisex", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB2224 UNISEX SUNGLASSES Brown Polarized",
        sku: "RB2224-71057-57",
        price: 11690,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2224__710_57__p21__shad__al2.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2224__710_57__p21__shad__al2.png"],
        description: "UNISEX SUNGLASSES\nModel Code: RB2224 710/57\n\nFRAME DESCRIPTION\nFrame Shape: Rectangle\nFrame material: Nylon/Acetate\nEye Size: 57\n\nLENS INFORMATION\nLens Color: Brown\nPolarized: Yes\nLens height: 37.1 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 20 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Generous\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Unisex", "Polarised", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB2224 UNISEX SUNGLASSES Gradient",
        sku: "RB2224-90132-57",
        price: 11450,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2224__901_32__p21__shad__al2.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2224__901_32__p21__shad__al2.png"],
        description: "UNISEX SUNGLASSES\nModel Code: RB2224 901/32\n\nFRAME DESCRIPTION\nFrame Shape: Rectangle\nFrame material: Nylon/Acetate\n\nLENS INFORMATION\nGradient: Yes\nPolarized: No\nLens height: 37.1 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 20 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Generous\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Unisex", "Gradient", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB2224 UNISEX SUNGLASSES Green Polarized",
        sku: "RB2224-90158-57",
        price: 11690,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2224__901_58__p21__shad__al2.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2224__901_58__p21__shad__al2.png"],
        description: "UNISEX SUNGLASSES\nModel Code: RB2224 901/58\n\nFRAME DESCRIPTION\nFrame Shape: Rectangle\nFrame material: Nylon/Acetate\nEye Size: 57\n\nLENS INFORMATION\nLens Color: Green\nPolarized: Yes\nLens height: 37.1 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 20 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Generous\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Polarised", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB2226 UNISEX SUNGLASSES Grey Gradient",
        sku: "RB2226-664171-54",
        price: 11450,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2226__664171__p21__shad__al2.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2226__664171__p21__shad__al2.png"],
        description: "UNISEX SUNGLASSES\nModel Code: RB2226 664171\n\nFRAME DESCRIPTION\nFrame Shape: Geometric\nFrame material: Nylon/Propionate\nEye Size: 54\n\nLENS INFORMATION\nLens Color: Grey\nGradient: Yes\nPolarized: No\nLens height: 38.2 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 20 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Standard\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Unisex", "Gradient", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB2226 UNISEX SUNGLASSES Green",
        sku: "RB2226-71031-54",
        price: 11390,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2226__710_31__p21__shad__al2.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2226__710_31__p21__shad__al2.png"],
        description: "UNISEX SUNGLASSES\nModel Code: RB2226 710/31\n\nFRAME DESCRIPTION\nFrame Shape: Geometric\nFrame material: Nylon/Propionate\nEye Size: 54\n\nLENS INFORMATION\nLens Color: Green\nPolarized: No\nLens height: 38.2 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 20 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Standard\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Unisex", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB2226 UNISEX SUNGLASSES Dark Grey",
        sku: "RB2226-901B1-54",
        price: 11390,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2226__901_b1__p21__shad__al2.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2226__901_b1__p21__shad__al2.png"],
        description: "UNISEX SUNGLASSES\nModel Code: RB2226 901/B1\n\nFRAME DESCRIPTION\nFrame Shape: Geometric\nFrame material: Nylon/Propionate\nEye Size: 54\n\nLENS INFORMATION\nLens Color: Dark Grey\nPolarized: No\nLens height: 38.2 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 20 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Standard\nBridge & nosepads: High Bridge Fit\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Unisex", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB3025 AVIATOR Black Classic Polarized",
        sku: "RB3025-24858-58",
        price: 14990,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb302500248_1.jpg",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb302500248_1.jpg"],
        description: "AVIATOR UNISEX SUNGLASSES\nModel Code: RB3025 24858\n\nFRAME DESCRIPTION\nFrame Shape: Pilot / Teardrop\nFrame material: Metal\nEye Size: 58\n\nLENS INFORMATION\nLens Color: Black Classic\nPolarized: Yes\nLens height: 50.1 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 14 mm\nTemple Length: 135 mm\n\nFITTING\nFace coverage: Standard\nBridge & nosepads: Adjustable Nosepads\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: true,
        tags: ["Aviator", "Unisex", "Polarised", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB3025 AVIATOR Grey Polarized",
        sku: "RB3025-919648-55",
        price: 14990,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_919648_030a_new_1.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_919648_030a_new_1.png"],
        description: "AVIATOR UNISEX SUNGLASSES\nModel Code: RB3025 919648\n\nFRAME DESCRIPTION\nFrame Shape: Pilot / Teardrop\nFrame material: Metal\nEye Size: 55\n\nLENS INFORMATION\nLens Color: Grey\nPolarized: Yes\nLens height: 50.1 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 14 mm\nTemple Length: 135 mm\n\nFITTING\nFace coverage: Standard\nBridge & nosepads: Adjustable Nosepads\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: true,
        tags: ["Aviator", "Polarised", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB3025 AVIATOR Green Polarized",
        sku: "RB3025-00158-55",
        price: 14990,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_001_58_030a_new.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_001_58_030a_new.png"],
        description: "AVIATOR UNISEX SUNGLASSES\nModel Code: RB3025 001/58\n\nFRAME DESCRIPTION\nFrame Shape: Pilot / Teardrop\nFrame material: Metal\nEye Size: 55\n\nLENS INFORMATION\nLens Color: Green\nPolarized: Yes\nLens height: 50.1 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 14 mm\nTemple Length: 135 mm\n\nFITTING\nFace coverage: Standard\nBridge & nosepads: Adjustable Nosepads\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: true,
        tags: ["Aviator", "Polarised", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB3025 AVIATOR Blue Polarised",
        sku: "RB3025-30258-58",
        price: 14990,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/p/r/prod_2fproduct-image_2frayban_20monobrand_2frayban_2f8056597860727_2f8056597860727_1.jpg",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/p/r/prod_2fproduct-image_2frayban_20monobrand_2frayban_2f8056597860727_2f8056597860727_1.jpg"],
        description: "AVIATOR UNISEX SUNGLASSES\nModel Code: RB3025 30258\n\nFRAME DESCRIPTION\nFrame Shape: Pilot / Teardrop\nFrame material: Metal\nEye Size: 58\n\nLENS INFORMATION\nLens Color: Blue\nPolarized: Yes\nLens height: 50.1 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 14 mm\nTemple Length: 135 mm\n\nFITTING\nFace coverage: Standard\nBridge & nosepads: Adjustable Nosepads\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: true,
        tags: ["Aviator", "Polarised", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB2140 CLASSIC Wayfarer G-15 Green",
        sku: "RB2140-901-50",
        price: 12790,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2140_901_030a.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2140_901_030a.png"],
        description: "ORIGINAL WAYFARER CLASSIC\nModel Code: RB2140 901\n\nFRAME DESCRIPTION\nFrame Shape: Square\nFrame material: Acetate\nEye Size: 50\n\nLENS INFORMATION\nLens Color: G-15 Green\nPolarized: No\nLens height: 41.0 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 22 mm\nTemple Length: 150 mm\n\nFITTING\nFace coverage: Standard\nBridge & nosepads: High Bridge Fit (Pantascopic Tilt)\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: true,
        tags: ["Wayfarer", "Classic", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB2140 WAYFARER CLASSIC Green Polarized",
        sku: "RB2140-90158-50",
        price: 14990,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2140_901_58_030a_1.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2140_901_58_030a_1.png"],
        description: "ORIGINAL WAYFARER CLASSIC\nModel Code: RB2140 901/58\n\nFRAME DESCRIPTION\nFrame Shape: Square\nFrame material: Acetate\nEye Size: 50\n\nLENS INFORMATION\nLens Color: Green\nPolarized: Yes\nLens height: 41.0 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 22 mm\nTemple Length: 150 mm\n\nFITTING\nFace coverage: Standard\nBridge & nosepads: High Bridge Fit (Pantascopic Tilt)\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: true,
        tags: ["Wayfarer", "Classic", "Polarised", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB3447 ROUND METAL G-15 Green",
        sku: "RB3447-919631-50",
        price: 12790,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919631_030a.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919631_030a.png"],
        description: "ROUND METAL SUNGLASSES\nModel Code: RB3447 919631\n\nFRAME DESCRIPTION\nFrame Shape: Round\nFrame material: Metal\nEye Size: 50\n\nLENS INFORMATION\nLens Color: G-15 Green\nPolarized: No\nLens height: 46.9 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 21 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Narrow / Petite\nBridge & nosepads: Adjustable Nosepads\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Round Metal", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB3447N ROUND METAL Clear Gradient Blue",
        sku: "RB3447N-0013F-50",
        price: 13590,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447n_001_3f_030a.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447n_001_3f_030a.png"],
        description: "ROUND METAL FLAT LENSES\nModel Code: RB3447N 001/3F\n\nFRAME DESCRIPTION\nFrame Shape: Round\nFrame material: Metal\nEye Size: 50\n\nLENS INFORMATION\nLens Color: Clear Gradient Blue\nTreatment: Flat Crystal Lenses\nPolarized: No\nLens height: 47.0 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 21 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Narrow / Petite\nBridge & nosepads: Adjustable Nosepads\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Round Metal", "Gradient", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ray-Ban RB3447N ROUND METAL G-15 Green",
        sku: "RB3447N-919931-50",
        price: 12790,
        brand: "Ray-Ban",
        category: "SUNGLASSES",
        stock: 50,
        status: "ACTIVE",
        image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919931_030a.png",
        images: ["https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919931_030a.png"],
        description: "ROUND METAL FLAT LENSES\nModel Code: RB3447N 919931\n\nFRAME DESCRIPTION\nFrame Shape: Round\nFrame material: Metal\nEye Size: 50\n\nLENS INFORMATION\nLens Color: G-15 Green\nTreatment: Flat Crystal Lenses\nPolarized: No\nLens height: 47.0 mm\n\nPRODUCT DIMENSIONS\nBridge Width: 21 mm\nTemple Length: 145 mm\n\nFITTING\nFace coverage: Narrow / Petite\nBridge & nosepads: Adjustable Nosepads\n\nIncluded in your order:\nCase, Cleaning cloth",
        featured: false,
        tags: ["Round Metal", "Ray-Ban"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    for (let p of products) {
        p.brandSlug = slugify(p.brand);
        p.categorySlug = slugify(p.category);
        p.slug = slugify(`${p.brand}-${p.category}-${p.name}-${p.sku}`);
        
        // Ensure not duplicating
        const exists = await db.collection("products").findOne({ sku: p.sku });
        if (!exists) {
           await db.collection("products").insertOne(p);
           console.log(`Inserted ${p.sku}`);
        } else {
           console.log(`Skipped ${p.sku} (already exists)`);
        }
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

seed();
