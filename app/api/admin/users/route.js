import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ensureAdminIndexes } from "@/lib/admin/indexes";
import { containsFilter, parsePagination, requireAdminSession, serializeList } from "@/lib/admin/server";

const VALID_ROLES = ["USER", "ADMIN"];

export async function GET(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const db = await getDb();
    await ensureAdminIndexes(db);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams, { defaultLimit: 20, maxLimit: 80 });

    const role = searchParams.get("role");
    const query = {
      ...(role && VALID_ROLES.includes(role) ? { role } : {}),
    };

    const term = searchParams.get("q");
    if (term) {
      query.$or = [containsFilter("name", term), containsFilter("email", term)];
    }

    const [items, total] = await Promise.all([
      db.collection("users")
        .find(query, {
          projection: {
            password: 0,
            emailVerified: 0,
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("users").countDocuments(query),
    ]);

    return NextResponse.json({
      items: serializeList(items),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("ADMIN_USERS_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
