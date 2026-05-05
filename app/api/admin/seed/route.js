import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin/server";
import fs from 'fs';
import path from 'path';

export async function POST() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seeding disabled in production" }, { status: 403 });
  }

  try {
    const db = await getDb();
    
    const dumpPath = path.join(process.cwd(), 'scratch', 'excel-dump.json');
    let products = [];
    
    if (fs.existsSync(dumpPath)) {
       const rawData = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
       const rows = rawData.slice(1);
       products = rows.map((row, index) => {
          const brand = row.__EMPTY_1 || 'Ray-Ban';
          const category = row.__EMPTY_2 || 'SUNGLASSES';
          const modelNo = row.__EMPTY_3 || `MODEL-${index}`;
          const color = row.__EMPTY_4 || '';
          
          const brandUpper = brand.toUpperCase().trim();
          const brandPricing = {
            'RAY-BAN': { base: 9900, variation: 3000 },
            'RAYBAN': { base: 9900, variation: 3000 },
            'OAKLEY': { base: 12000, variation: 4000 },
            'GUCCI': { base: 25000, variation: 10000 },
            'PRADA': { base: 22000, variation: 8000 },
          };

          let basePrice = 15000;
          let variation = 5000;
          if (brandPricing[brandUpper]) {
            basePrice = brandPricing[brandUpper].base;
            variation = brandPricing[brandUpper].variation;
          }

          const seed = (modelNo + color).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
          const finalPrice = basePrice + (seed % variation);
          const price = Math.floor(finalPrice / 100) * 100 + 90;
          
          return {
             name: `${brandUpper === 'RAYBAN' || brandUpper === 'RAY-BAN' ? 'Ray-Ban' : brand} ${modelNo}`.trim(),
             sku: `${modelNo}-${color}`.replace(/\//g, '-'),
             slug: `${brand}-${modelNo}-${color}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
             brand: brandUpper === 'RAYBAN' || brandUpper === 'RAY-BAN' ? 'Ray-Ban' : brand,
             brandSlug: brand.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
             category,
             price,
             stock: index % 5 === 0 ? 2 : 50, // Create some low stock items
             status: 'ACTIVE',
             image: '/images/placeholders/wayfarer_front.png',
             images: ['/images/placeholders/wayfarer_front.png'],
             featured: index < 6,
             createdAt: new Date(),
             updatedAt: new Date()
          };
       });
    }

    await Promise.all([
      db.collection("products").deleteMany({}),
      db.collection("orders").deleteMany({}),
      db.collection("users").deleteMany({ role: { $ne: "ADMIN" } }),
    ]);

    if (products.length > 0) {
      await db.collection("products").insertMany(products);
      
      // Generate some mock orders for the last 30 days
      const orders = [];
      const customers = [
        { name: 'Arjun Sharma', email: 'arjun@example.com' },
        { name: 'Priya Patel', email: 'priya@example.com' },
        { name: 'Vikram Singh', email: 'vikram@example.com' },
        { name: 'Ananya Iyer', email: 'ananya@example.com' },
        { name: 'Rohan Gupta', email: 'rohan@example.com' },
      ];

      for (let i = 0; i < 25; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const numItems = Math.floor(Math.random() * 2) + 1;
        const items = [];
        let total = 0;
        
        for (let j = 0; j < numItems; j++) {
          const p = products[Math.floor(Math.random() * products.length)];
          items.push({
            id: p.sku,
            name: p.name,
            brand: p.brand,
            price: p.price,
            quantity: 1,
            image: p.image
          });
          total += p.price;
        }

        orders.push({
          orderNumber: `ORD-${1000 + i}`,
          customerName: customer.name,
          customerEmail: customer.email,
          items,
          totalAmount: total,
          status: i % 10 === 0 ? 'PENDING' : 'confirmed',
          createdAt: date,
        });
      }
      
      await db.collection("orders").insertMany(orders);
    }

    return NextResponse.json({
      message: "Catalog and realistic mock data synchronized.",
      counts: {
        products: products.length,
        orders: 25,
      },
    });
  } catch (error) {
    console.error("ADMIN_SEED_ERROR", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}

