import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ensureAdminIndexes } from "@/lib/admin/indexes";
import {
  containsFilter,
  parsePagination,
  parseSort,
  requireAdminSession,
  serializeList,
} from "@/lib/admin/server";

const VALID_STATUSES = ["confirmed", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function GET(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const db = await getDb();
    await ensureAdminIndexes(db);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams, { defaultLimit: 15, maxLimit: 50 });
    const sort = parseSort(searchParams, ["createdAt", "totalAmount", "status"], { createdAt: -1 });

    const status = searchParams.get("status");
    const query = {
      ...(status && VALID_STATUSES.includes(status) ? { status } : {}),
    };

    const term = searchParams.get("q");

    const pipeline = [
      { $match: query },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          uid: { $toObjectId: "$userId" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$userDetails", 0] }
        }
      },
      {
        $project: {
          orderNumber: { $ifNull: ["$orderNumber", { $concat: ["#", { $substr: [{ $toString: "$_id" }, 18, 6] }] }] },
          customerName: { $ifNull: ["$customerName", "$user.name", "Guest"] },
          customerEmail: { $ifNull: ["$customerEmail", "$user.email", "N/A"] },
          status: 1,
          totalAmount: { $ifNull: ["$totalAmount", "$total", 0] },
          itemCount: { $ifNull: ["$itemCount", { $size: { $ifNull: ["$items", []] } }] },
          createdAt: 1,
        }
      }
    ];

    if (term) {
      pipeline.push({
        $match: {
          $or: [
            { orderNumber: { $regex: term, $options: 'i' } },
            { customerName: { $regex: term, $options: 'i' } },
            { customerEmail: { $regex: term, $options: 'i' } }
          ]
        }
      });
    }

    const [items, totalCountResult] = await Promise.all([
      db.collection("orders").aggregate(pipeline).toArray(),
      db.collection("orders").countDocuments(query),
    ]);

    return NextResponse.json({
      items: serializeList(items),
      pagination: {
        page,
        limit,
        total: totalCountResult,
        totalPages: Math.max(1, Math.ceil(totalCountResult / limit)),
      },
    });
  } catch (error) {
    console.error("ADMIN_ORDERS_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
