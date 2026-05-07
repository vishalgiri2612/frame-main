import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin/server";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const db = await getDb();
    const coupons = await db.collection("coupons").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("ADMIN_COUPONS_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { code, discountType, discountValue, minOrderValue, usageLimit, expiryDate, applicableBrands, applicableCategories } = body;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if code already exists
    const existing = await db.collection("coupons").findOne({ code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = {
      code: code.toUpperCase(),
      discountType, // 'PERCENTAGE' or 'FLAT'
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      usageLimit: Number(usageLimit) || null,
      usedCount: 0,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      status: "ACTIVE",
      applicableBrands: applicableBrands || [],
      applicableCategories: applicableCategories || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: auth.session?.user?.id || null
    };

    const result = await db.collection("coupons").insertOne(coupon);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("ADMIN_COUPONS_POST_ERROR", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
