import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/admin/server";
import { getProducts } from "@/lib/feed";

export async function POST() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seeding disabled in production" }, { status: 403 });
  }

  try {
    const db = await getDb();

    const now = new Date();
    const products = getProducts().map((product) => ({
      ...product,
      createdAt: now,
      updatedAt: now,
      createdBy: auth.session.user.id,
    }));

    await Promise.all([
      db.collection("products").deleteMany({}),
      db.collection("orders").deleteMany({}),
      db.collection("supportTickets").deleteMany({}),
      db.collection("users").deleteMany({}),
    ]);

    if (products.length) {
      await db.collection("products").insertMany(products);
    }

    return NextResponse.json({
      message: "Catalog data synchronized with database.",
      counts: {
        products: products.length,
      },
    });
  } catch (error) {
    console.error("ADMIN_SEED_ERROR", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
