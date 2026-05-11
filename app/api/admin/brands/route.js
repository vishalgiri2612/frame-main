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
    const items = await db.collection("brands")
      .find({})
      .sort({ order: 1 })
      .toArray();
    
    return NextResponse.json({
      items: serializeList(items),
    });
  } catch (error) {
    console.error("ADMIN_BRANDS_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load brands" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const payload = await request.json();
    
    if (!payload.name || !payload.slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date();

    const normalized = {
      name: payload.name.trim(),
      slug: payload.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      year: payload.year?.trim() || "",
      count: Number(payload.count) || 0,
      image: payload.image?.trim() || "",
      accent: payload.accent?.trim() || "#C9A84C",
      origin: payload.origin?.trim() || "",
      order: Number(payload.order) || 0,
      status: payload.status || "ACTIVE",
      showcase: Boolean(payload.showcase),
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("brands").insertOne(normalized);
    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("ADMIN_BRANDS_POST_ERROR", error);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
