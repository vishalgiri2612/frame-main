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
      ...(role ? { 
        role: { $regex: new RegExp(`^${role}$`, 'i') } 
      } : {}),
    };

    const term = searchParams.get("q");
    if (term) {
      query.$or = [containsFilter("name", term), containsFilter("email", term)];
    }

    // Aggregation pipeline to get users with stats
    const pipeline = [
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      // Join with orders
      {
        $lookup: {
          from: "orders",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$userId", { $toString: "$$userId" }] },
                    { $eq: ["$userId", "$$userId" ] }
                  ]
                }
              }
            }
          ],
          as: "userOrders"
        }
      },
      // Calculate stats
      {
        $addFields: {
          stats: {
            cartCount: { $size: { $ifNull: ["$cart", []] } },
            wishlistCount: { $size: { $ifNull: ["$wishlist", []] } },
            orderCount: { $size: "$userOrders" },
            totalSpent: { $sum: "$userOrders.total" }
          }
        }
      },
      {
        $project: {
          password: 0,
          emailVerified: 0,
          userOrders: 0
        }
      }
    ];

    const [items, total] = await Promise.all([
      db.collection("users").aggregate(pipeline).toArray(),
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
