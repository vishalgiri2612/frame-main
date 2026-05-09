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

    if (payload.src) update.src = payload.src.trim();
    if (payload.frameImg !== undefined) update.frameImg = payload.frameImg.trim();
    if (payload.frameName !== undefined) update.frameName = payload.frameName.trim();
    if (payload.frameLink !== undefined) update.frameLink = payload.frameLink.trim();
    if (payload.theme) update.theme = payload.theme.trim();
    if (payload.badge !== undefined) update.badge = payload.badge.trim();
    if (payload.titleTop !== undefined) update.titleTop = payload.titleTop.trim();
    if (payload.titleItalic !== undefined) update.titleItalic = payload.titleItalic.trim();
    if (payload.sub !== undefined) update.sub = payload.sub.trim();
    if (payload.order !== undefined) update.order = Number(payload.order);
    if (payload.status) update.status = payload.status;

    const result = await db.collection("hero_slides").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_HERO_PATCH_ERROR", error);
    return NextResponse.json({ error: "Failed to update hero slide" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const { id } = params;
    const db = await getDb();

    const result = await db.collection("hero_slides").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_HERO_DELETE_ERROR", error);
    return NextResponse.json({ error: "Failed to delete hero slide" }, { status: 500 });
  }
}
