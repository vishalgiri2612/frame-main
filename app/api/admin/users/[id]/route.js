import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession, toObjectId } from "@/lib/admin/server";

const VALID_ROLES = ["USER", "ADMIN"];

export async function PATCH(request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const objectId = toObjectId(params.id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const update = {};

    if (typeof payload.name === "string" && payload.name.trim()) {
      update.name = payload.name.trim();
    }

    if (typeof payload.role === "string" && VALID_ROLES.includes(payload.role)) {
      update.role = payload.role;
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    update.updatedAt = new Date();

    const db = await getDb();
    const result = await db.collection("users").updateOne({ _id: objectId }, { $set: update });

    if (!result.matchedCount) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_USER_PATCH_ERROR", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
