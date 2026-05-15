import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { processProduct } from '@/lib/feed';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const db = await getDb();
    
    // Sanitize input to prevent Regex Injection
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Search by name, brand, category, or SKU
    const products = await db.collection("products")
      .find({
        status: "ACTIVE",
        $or: [
          { name: { $regex: escapedQuery, $options: 'i' } },
          { brand: { $regex: escapedQuery, $options: 'i' } },
          { category: { $regex: escapedQuery, $options: 'i' } },
          { sku: { $regex: escapedQuery, $options: 'i' } }
        ]
      })
      .limit(8)
      .toArray();

    // Process products to match UI expectations (IDs, image labels, etc.)
    const processedProducts = products.map(processProduct);

    return NextResponse.json({ products: processedProducts });
  } catch (error) {
    console.error("SEARCH_API_ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
