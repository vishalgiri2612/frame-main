import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  requireAdminSession,
} from "@/lib/admin/server";

export async function PATCH(request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const { id } = params;
    const payload = await request.json();
    const db = await getDb();

    const update = {
      updatedAt: new Date(),
    };

    if (payload.name) update.name = payload.name.trim();
    if (payload.slug) update.slug = payload.slug.trim().toLowerCase().replace(/\s+/g, '-');
    if (payload.year !== undefined) update.year = payload.year.trim();
    if (payload.count !== undefined) update.count = Number(payload.count);
    if (payload.image !== undefined) update.image = payload.image.trim();
    if (payload.accent) update.accent = payload.accent.trim();
    if (payload.origin !== undefined) update.origin = payload.origin.trim();
    if (payload.order !== undefined) update.order = Number(payload.order);
    if (payload.status) update.status = payload.status;

    const result = await db.collection("brands").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_BRANDS_PATCH_ERROR", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const { id } = params;
    const db = await getDb();

    const result = await db.collection("brands").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_BRANDS_DELETE_ERROR", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
