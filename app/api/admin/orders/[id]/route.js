import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession, toObjectId } from "@/lib/admin/server";

const VALID_STATUSES = ["confirmed", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function GET(request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const objectId = toObjectId(params.id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const order = await db.collection("orders").findOne({ _id: objectId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch user details if possible
    let customer = null;
    if (order.userId) {
      const user = await db.collection("users").findOne(
        { _id: toObjectId(order.userId) || order.userId },
        { projection: { password: 0 } }
      );
      if (user) {
        customer = {
          name: user.name,
          email: user.email,
          id: user._id.toString()
        };
      }
    }

    // Fetch address if it exists
    let address = null;
    if (order.addressId && order.userId) {
       const userWithAddress = await db.collection("users").findOne(
         { _id: toObjectId(order.userId) || order.userId, "addresses.id": order.addressId },
         { projection: { addresses: { $elemMatch: { id: order.addressId } } } }
       );
       if (userWithAddress && userWithAddress.addresses) {
         address = userWithAddress.addresses[0];
       }
    }

    return NextResponse.json({
      ...order,
      _id: order._id.toString(),
      customer,
      address
    });
  } catch (error) {
    console.error("ADMIN_ORDER_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load order details" }, { status: 500 });
  }
}

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
