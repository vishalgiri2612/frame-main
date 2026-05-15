const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

/**
 * THEMATICALLY MATCHED ARTICLES
 * 
 * Every article has an image that MATCHES its headline and topic.
 * Images are curated from Unsplash with verified IDs.
 * 
 * Rule: Image must match the MOOD + STYLE of the article heading.
 */
async function seed() {
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    const db = client.db();
    
    await db.collection('magazine_articles').deleteMany({});
    console.log("🗑️  Cleared old mismatched articles.");

    const articles = [
        {
            // HERO: Bold, street-style woman in oversized sunglasses
            title: "Rihanna's Neon Street Style: A New Era of Eyewear",
            tag: "Celebrity Sightings",
            excerpt: "Rihanna continues to redefine street style, this time opting for high-performance neon wraparound shades that blend athleticism with high fashion during her latest outing in Manhattan.",
            readTime: "3 min",
            // Bold, dramatic woman in statement sunglasses — matches neon/street vibe
            image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1080&auto=format&fit=crop",
            createdAt: new Date(),
            status: "ACTIVE"
        },
        {
            // TREND ALERT: Blue tinted, summer, luxury feel
            title: "Bella Hadid's Blue-Tinted Summer Statement",
            tag: "Trend Alert",
            excerpt: "Supermodel Bella Hadid was seen channeling retro cool on a luxury yacht, sporting blue-tinted lenses that are quickly becoming the most sought-after accessory of the summer season.",
            readTime: "4 min",
            // Warm summer tones, woman in stylish sunglasses — matches beach/yacht summer vibe
            image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1080&auto=format&fit=crop",
            createdAt: new Date(Date.now() - 10000),
            status: "ACTIVE"
        },
        {
            // STYLE GUIDE: Vintage, retro, oversized — 70s aesthetic
            title: "Vintage Glamour: The Return of Oversized Frames",
            tag: "Style Guide",
            excerpt: "Vintage vibes are back. This season, oversized gradient lenses are dominating the runway, offering a sophisticated nod to 70s glamour with modern, high-tech craftsmanship.",
            readTime: "2 min",
            // Retro/vintage fashion portrait — matches 70s glamour vibe
            image: "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?q=80&w=1080&auto=format&fit=crop",
            createdAt: new Date(Date.now() - 20000),
            status: "ACTIVE"
        },
        {
            // CELEBRITY: Male, minimalist, clean aesthetic
            title: "Timothée Chalamet's Minimalist Aesthetic",
            tag: "Celebrity Sightings",
            excerpt: "Actor Timothée Chalamet proves that minimalism is the new statement, rocking crystal-clear acetate frames that pair perfectly with his signature effortless aesthetic.",
            readTime: "5 min",
            // Clean, sharp male portrait — matches Timothée's minimalist brand
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1080&auto=format&fit=crop",
            createdAt: new Date(Date.now() - 30000),
            status: "ACTIVE"
        },
        {
            // CRAFTSMANSHIP: Eco, natural, premium — bio material feel
            title: "Bio-Acetate: Sustainable Luxury Redefined",
            tag: "Craftsmanship",
            excerpt: "As the industry moves towards sustainability, bio-acetate frames are leading the charge, offering eco-friendly luxury without compromising on the durability or glossy finish.",
            readTime: "5 min",
            // Elegant woman with natural/organic aesthetic — matches sustainability theme
            image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1080&auto=format&fit=crop",
            createdAt: new Date(Date.now() - 40000),
            status: "ACTIVE"
        }
    ];

    await db.collection('magazine_articles').insertMany(articles);
    
    console.log("✅ THEMATIC MATCH SUCCESS: Every article now has a matching image.\n");
    console.log("📸 Article → Image Match:");
    console.log("  1. Rihanna/Neon     → Bold woman in statement sunglasses (street style)");
    console.log("  2. Bella Hadid/Blue → Summer fashion model (warm, beach vibe)");
    console.log("  3. Vintage Glamour  → Retro-style glamour portrait (70s aesthetic)");
    console.log("  4. Timothée/Minimal → Sharp male portrait (minimalist, clean)");
    console.log("  5. Bio-Acetate/Eco  → Elegant woman (natural, organic tones)");
    
    await client.close();
}

seed().catch(console.error);
