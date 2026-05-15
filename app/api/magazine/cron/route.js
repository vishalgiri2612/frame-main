import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const REFRESH_INTERVAL_HOURS = 48;

/**
 * GET /api/magazine/cron
 *
 * Called by Vercel Cron every 2 days.
 * If the oldest article is > 48 hours old, regenerates ALL 5 slots.
 * Secured by CRON_SECRET header to prevent unauthorized triggers.
 */
export async function GET(req) {
  // Validate cron secret
  const authHeader = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const col = db.collection("magazine_articles");

    // Check age of oldest active article
    const oldest = await col
      .find({ status: "ACTIVE" })
      .sort({ createdAt: 1 })
      .limit(1)
      .toArray();

    const now = new Date();
    const ageHours = oldest.length > 0
      ? (now - new Date(oldest[0].createdAt)) / (1000 * 60 * 60)
      : Infinity;

    if (ageHours < REFRESH_INTERVAL_HOURS) {
      return NextResponse.json({
        success: true,
        message: `Content is fresh (${Math.round(ageHours)}h old). No refresh needed.`,
        nextRefreshIn: `${Math.round(REFRESH_INTERVAL_HOURS - ageHours)}h`,
      });
    }

    // Trigger regeneration of all 5 slots
    console.log(`[Cron] Articles are ${Math.round(ageHours)}h old — triggering full refresh.`);

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Delete all existing articles first
    await col.deleteMany({ status: "ACTIVE" });

    // Generate all 5 slots sequentially
    const results = [];
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch(`${baseUrl}/api/magazine/generate`, { method: 'POST' });
        const json = await res.json();
        results.push({ slot: i + 1, success: json.success, title: json.data?.title });
      } catch (e) {
        results.push({ slot: i + 1, success: false, error: e.message });
      }
      // Small delay to avoid rate limits
      if (i < 4) await new Promise(r => setTimeout(r, 4000));
    }

    const successCount = results.filter(r => r.success).length;
    return NextResponse.json({
      success: true,
      message: `Refreshed ${successCount}/5 articles.`,
      results,
    });
  } catch (error) {
    console.error('[Cron] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
