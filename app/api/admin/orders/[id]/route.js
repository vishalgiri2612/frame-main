import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession, toObjectId } from "@/lib/admin/server";

const VALID_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const objectId = toObjectId(params.id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    const payload = await request.json();

    if (!VALID_STATUSES.includes(payload.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("orders").updateOne(
      { _id: objectId },
      {
        $set: {
          status: payload.status,
          updatedAt: new Date(),
          updatedBy: auth.session.user.id,
        },
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_ORDER_PATCH_ERROR", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
