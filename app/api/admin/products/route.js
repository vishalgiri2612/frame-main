import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ensureAdminIndexes } from "@/lib/admin/indexes";
import { getProducts } from "@/lib/feed";
import {
  asDate,
  containsFilter,
  parsePagination,
  parseSort,
  requireAdminSession,
  serializeList,
} from "@/lib/admin/server";

const VALID_STATUSES = ["ACTIVE", "DRAFT", "ARCHIVED"];

export async function GET(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const pagination = parsePagination(searchParams);
    const sort = parseSort(searchParams, "createdAt", "desc");
    
    const db = await getDb();
    const query = {};

    // Basic filtering
    const status = searchParams.get("status");
    if (status && VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    const search = searchParams.get("search");
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      db.collection("products")
        .find(query)
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .toArray(),
      db.collection("products").countDocuments(query),
    ]);
    
    return NextResponse.json({
      items,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.error("ADMIN_PRODUCTS_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}


export async function POST(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const payload = await request.json();
    const validation = validateProductPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const db = await getDb();
    await ensureAdminIndexes(db);
    const now = new Date();

    const normalized = {
      name: payload.name.trim(),
      slug: buildProductSlug(payload),
      sku: payload.sku.trim().toUpperCase(),
      price: Number(payload.price),
      brand: payload.brand.trim(),
      brandSlug: slugify(payload.brand),
      category: payload.category.trim(),
      categorySlug: slugify(payload.category),
      stock: Number(payload.stock),
      status: payload.status,
      image: payload.image?.trim() || "",
      description: payload.description?.trim() || "",
      featured: Boolean(payload.featured),
      tags: Array.isArray(payload.tags)
        ? payload.tags.map((tag) => String(tag).trim()).filter(Boolean)
        : [],
      createdAt: asDate(payload.createdAt) || now,
      updatedAt: now,
      createdBy: auth.session.user.id,
    };

    const existingSku = await db.collection("products").findOne({ sku: normalized.sku });
    if (existingSku) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
    }

    const result = await db.collection("products").insertOne(normalized);
    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("ADMIN_PRODUCTS_POST_ERROR", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

function validateProductPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Invalid payload" };
  }

  if (!payload.name || !String(payload.name).trim()) {
    return { ok: false, error: "Product name is required" };
  }

  if (!payload.sku || !String(payload.sku).trim()) {
    return { ok: false, error: "SKU is required" };
  }

  if (!payload.category || !String(payload.category).trim()) {
    return { ok: false, error: "Category is required" };
  }

  if (!payload.brand || !String(payload.brand).trim()) {
    return { ok: false, error: "Brand is required" };
  }

  const price = Number(payload.price);
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: "Price must be a non-negative number" };
  }

  const stock = Number(payload.stock);
  if (!Number.isInteger(stock) || stock < 0) {
    return { ok: false, error: "Stock must be a non-negative integer" };
  }

  if (!VALID_STATUSES.includes(payload.status)) {
    return { ok: false, error: "Invalid status" };
  }

  return { ok: true };
}

function buildProductSlug(payload) {
  return slugify(`${payload.brand || ''}-${payload.category || ''}-${payload.name || ''}-${payload.sku || ''}`);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
