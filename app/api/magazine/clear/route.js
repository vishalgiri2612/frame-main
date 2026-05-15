import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/magazine/clear
 * Wipes ALL magazine articles so fresh ones can be regenerated.
 * Used by the reset-magazine.js scratch script.
 */
export async function DELETE() {
  try {
    const db = await getDb();
    const result = await db.collection("magazine_articles").deleteMany({});

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount,
      message: `Cleared ${result.deletedCount} magazine articles.`
    });
  } catch (error) {
    console.error("MAGAZINE_CLEAR_ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
