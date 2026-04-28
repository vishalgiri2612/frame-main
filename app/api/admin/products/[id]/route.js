import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession, toObjectId } from "@/lib/admin/server";

const VALID_STATUSES = ["ACTIVE", "DRAFT", "ARCHIVED"];

export async function PATCH(request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const objectId = toObjectId(params.id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const update = buildUpdate(payload);

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    update.updatedAt = new Date();
    update.updatedBy = auth.session.user.id;

    const db = await getDb();
    const result = await db.collection("products").updateOne({ _id: objectId }, { $set: update });

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_PRODUCT_PATCH_ERROR", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const objectId = toObjectId(params.id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db.collection("products").deleteOne({ _id: objectId });

    if (!result.deletedCount) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_PRODUCT_DELETE_ERROR", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

function buildUpdate(payload) {
  const update = {};

  if (typeof payload.name === "string" && payload.name.trim()) {
    update.name = payload.name.trim();
  }

  if (typeof payload.brand === "string" && payload.brand.trim()) {
    update.brand = payload.brand.trim();
  }

  if (typeof payload.sku === "string" && payload.sku.trim()) {
    update.sku = payload.sku.trim().toUpperCase();
  }

  if (typeof payload.category === "string" && payload.category.trim()) {
    update.category = payload.category.trim();
  }

  if (update.name || update.brand || update.sku || update.category) {
    update.slug = buildProductSlug({
      name: update.name || payload.name,
      brand: update.brand || payload.brand,
      sku: update.sku || payload.sku,
      category: update.category || payload.category,
    });
  }

  if (typeof payload.description === "string") {
    update.description = payload.description.trim();
  }

  if (typeof payload.image === "string") {
    update.image = payload.image.trim();
  }

  if (typeof payload.status === "string" && VALID_STATUSES.includes(payload.status)) {
    update.status = payload.status;
  }

  if (payload.featured !== undefined) {
    update.featured = Boolean(payload.featured);
  }

  if (payload.price !== undefined) {
    const price = Number(payload.price);
    if (Number.isFinite(price) && price >= 0) {
      update.price = price;
    }
  }

  if (payload.stock !== undefined) {
    const stock = Number(payload.stock);
    if (Number.isInteger(stock) && stock >= 0) {
      update.stock = stock;
    }
  }

  if (Array.isArray(payload.tags)) {
    update.tags = payload.tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  return update;
}

function buildProductSlug(payload) {
  return String(`${payload.brand || ''}-${payload.category || ''}-${payload.name || ''}-${payload.sku || ''}`)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
