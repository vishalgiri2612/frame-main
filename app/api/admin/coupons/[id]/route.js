import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession, toObjectId } from "@/lib/admin/server";

export async function PATCH(request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const objectId = toObjectId(params.id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid coupon id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const update = {};

    if (body.status) update.status = body.status;
    if (body.discountValue !== undefined) update.discountValue = Number(body.discountValue);
    if (body.minOrderValue !== undefined) update.minOrderValue = Number(body.minOrderValue);
    if (body.usageLimit !== undefined) update.usageLimit = body.usageLimit === null ? null : Number(body.usageLimit);
    if (body.expiryDate !== undefined) update.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
    if (body.applicableBrands) update.applicableBrands = body.applicableBrands;
    if (body.applicableCategories) update.applicableCategories = body.applicableCategories;

    update.updatedAt = new Date();

    const db = await getDb();
    const result = await db.collection("coupons").updateOne(
      { _id: objectId },
      { $set: update }
    );

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_COUPON_PATCH_ERROR", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const objectId = toObjectId(params.id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid coupon id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db.collection("coupons").deleteOne({ _id: objectId });

    if (!result.deletedCount) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_COUPON_DELETE_ERROR", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
