import { NextResponse } from 'next/server';
import { getAllAvailableBrandsDB } from '@/lib/feed';

export async function GET() {
  try {
    const brands = await getAllAvailableBrandsDB();
    return NextResponse.json(brands);
  } catch (error) {
    console.error('API_BRANDS_ERROR', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}
