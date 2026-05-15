import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();

    // Return all active articles sorted by slotOrder (0–4) so the magazine
    // pages always render in the same consistent order:
    //   Slot 0 → Oversized (Trend Alert)
    //   Slot 1 → Aviator (Style Guide)
    //   Slot 2 → Cat-Eye (Red Carpet)
    //   Slot 3 → Tinted Lens (Celebrity Sightings)
    //   Slot 4 → Round/Vintage (Style Guide)
    const articles = await db.collection("magazine_articles")
      .find({ status: "ACTIVE" })
      .sort({ slotOrder: 1, createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json(
      { success: true, data: articles },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (error) {
    console.error("MAGAZINE_FETCH_ERROR", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch magazine articles" },
      { status: 500 }
    );
  }
}
