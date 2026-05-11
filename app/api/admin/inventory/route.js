import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession, serializeList } from "@/lib/admin/server";

export async function GET(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const db = await getDb();
    
    // 1. Fetch all products for basic metrics
    const products = await db.collection("products").find({}).toArray();
    
    // 2. Calculate Valuation & Low Stock
    let totalValuation = 0;
    const lowStockItems = [];
    const zeroStockItems = [];
    const brandStats = {}; // For turnover by brand chart
    
    products.forEach(p => {
      const stock = Number(p.stock) || 0;
      const price = Number(p.price) || 0;
      totalValuation += stock * price;
      
      if (stock === 0) zeroStockItems.push(p);
      else if (stock <= 5) lowStockItems.push(p);
      
      if (!brandStats[p.brand]) brandStats[p.brand] = { stock: 0, value: 0, products: 0 };
      brandStats[p.brand].stock += stock;
      brandStats[p.brand].value += stock * price;
      brandStats[p.brand].products += 1;
    });

    // 3. Calculate Bestsellers from Orders
    // We aggregate quantity sold per product SKU
    const bestsellersData = await db.collection("orders").aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.sku",
          name: { $first: "$items.name" },
          totalSold: { $sum: { $toInt: "$items.quantity" } },
          revenue: { $sum: { $multiply: [{ $toDouble: "$items.price" }, { $toInt: "$items.quantity" }] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]).toArray();

    // 4. Identify Dead Stock (Stock > 0 but 0 sales in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const soldSkus = await db.collection("orders").distinct("items.sku", {
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const deadStock = products.filter(p => p.stock > 0 && !soldSkus.includes(p.sku)).slice(0, 10);

    return NextResponse.json({
      summary: {
        totalProducts: products.length,
        totalValuation,
        lowStockCount: lowStockItems.length,
        zeroStockCount: zeroStockItems.length
      },
      charts: {
        brandTurnover: Object.entries(brandStats).map(([name, stats]) => ({
          name,
          value: stats.value,
          stock: stats.stock
        })).sort((a, b) => b.value - a.value).slice(0, 8),
        stockHealth: [
          { name: 'Healthy', value: products.length - lowStockItems.length - zeroStockItems.length, fill: '#10b981' },
          { name: 'Low Stock', value: lowStockItems.length, fill: '#f59e0b' },
          { name: 'Zero Stock', value: zeroStockItems.length, fill: '#ef4444' }
        ]
      },
      bestsellers: bestsellersData,
      deadStock: serializeList(deadStock),
      lowStockItems: serializeList(lowStockItems)
    });
  } catch (error) {
    console.error("ADMIN_INVENTORY_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load inventory data" }, { status: 500 });
  }
}
