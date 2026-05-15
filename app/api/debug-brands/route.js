import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const brands = await db.collection("brands").find({}).toArray();
    const products = await db.collection("products").find({}).toArray();
    return NextResponse.json({ brands, products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
