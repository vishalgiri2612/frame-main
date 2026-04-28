import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getDashboardSnapshot } from "@/lib/admin/metrics";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const snapshot = await getDashboardSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("ADMIN_DASHBOARD_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
