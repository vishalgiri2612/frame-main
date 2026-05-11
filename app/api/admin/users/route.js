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

    // Filtering
    const role = searchParams.get("role");
    const query = {
      ...(role ? { role: { $regex: new RegExp(`^${role}$`, 'i') } } : {}),
    };

    const term = searchParams.get("q");
    if (term) {
      query.$or = [containsFilter("name", term), containsFilter("email", term)];
    }

    // Sorting logic
    const sortBy = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;
    const sortObj = {};
    sortObj[sortBy] = order;

    // Aggregation pipeline to get users with stats
    const pipeline = [
      { $match: query },
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
      // Map stats to root level for sorting if needed
      {
        $addFields: {
          totalSpent: "$stats.totalSpent",
          cartCount: "$stats.cartCount",
          wishlistCount: "$stats.wishlistCount"
        }
      },
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          password: 0,
          emailVerified: 0,
          userOrders: 0
        }
      }
    ];

    const [items, total, newToday, activeStats] = await Promise.all([
      db.collection("users").aggregate(pipeline).toArray(),
      db.collection("users").countDocuments(query),
      db.collection("users").countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      db.collection("users").aggregate([
        {
          $group: {
            _id: null,
            avgWishlist: { $avg: { $size: { $ifNull: ["$wishlist", []] } } },
            avgCart: { $avg: { $size: { $ifNull: ["$cart", []] } } }
          }
        }
      ]).toArray()
    ]);

    return NextResponse.json({
      items: serializeList(items),
      summary: {
        total,
        newToday,
        engagement: activeStats[0] || { avgWishlist: 0, avgCart: 0 }
      },
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
