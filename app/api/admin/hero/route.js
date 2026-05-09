import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  requireAdminSession,
  serializeList,
} from "@/lib/admin/server";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const db = await getDb();
    const items = await db.collection("hero_slides")
      .find({})
      .sort({ order: 1 })
      .toArray();
    
    return NextResponse.json({
      items: serializeList(items),
    });
  } catch (error) {
    console.error("ADMIN_HERO_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load hero slides" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const payload = await request.json();
    
    if (!payload.src || !payload.titleTop) {
      return NextResponse.json({ error: "Image and Title are required" }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date();

    const normalized = {
      src: payload.src.trim(),
      frameImg: payload.frameImg?.trim() || "",
      frameName: payload.frameName?.trim() || "",
      frameLink: payload.frameLink?.trim() || "/shop",
      theme: payload.theme?.trim() || "rgba(212,175,55,0.4)",
      badge: payload.badge?.trim() || "",
      titleTop: payload.titleTop?.trim() || "",
      titleItalic: payload.titleItalic?.trim() || "",
      sub: payload.sub?.trim() || "",
      order: Number(payload.order) || 0,
      status: payload.status || "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("hero_slides").insertOne(normalized);
    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("ADMIN_HERO_POST_ERROR", error);
    return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 });
  }
}
