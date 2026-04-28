import { getDb } from "@/lib/mongodb";
import { ensureAdminIndexes } from "@/lib/admin/indexes";

const PRODUCT_STATUS = ["ACTIVE", "DRAFT", "ARCHIVED"];
const ORDER_STATUS = ["confirmed", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function getDashboardSnapshot() {
  const db = await getDb();
  await ensureAdminIndexes(db);

  const [
    productStats,
    orderStats,
    userCount,
    ticketStats,
    revenueSummary,
    latestOrders,
  ] = await Promise.all([
    getProductStats(db),
    getOrderStats(db),
    db.collection("users").countDocuments(),
    getTicketStats(db),
    getRevenueSummary(db),
    db.collection("orders")
      .find({}, { projection: { orderNumber: 1, customerName: 1, total: 1, totalAmount: 1, status: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray(),
  ]);

  // Return real metrics only. If empty, return zeros.
  return {
    productStats,
    orderStats,
    userCount,
    ticketStats,
    revenueSummary,
    latestOrders: latestOrders.map((order) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalAmount: order.totalAmount ?? order.total ?? 0,
      status: order.status ?? "confirmed",
      createdAt: order.createdAt,
    })),
    generatedAt: new Date(),
  };
}

async function getProductStats(db) {
  const [rows, lowStockCount] = await Promise.all([
    db.collection("products")
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray(),
    db.collection("products").countDocuments({ stock: { $lte: 5 }, status: "ACTIVE" }),
  ]);

  const byStatus = PRODUCT_STATUS.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  for (const row of rows) {
    byStatus[row._id || "DRAFT"] = row.count;
  }

  return {
    total: rows.reduce((sum, row) => sum + row.count, 0),
    byStatus,
    lowStockCount,
  };
}

async function getOrderStats(db) {
  const rows = await db.collection("orders")
    .aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const byStatus = ORDER_STATUS.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  for (const row of rows) {
    byStatus[row._id || "PENDING"] = row.count;
  }

  return {
    total: rows.reduce((sum, row) => sum + row.count, 0),
    byStatus,
    open: (byStatus.PENDING || 0) + (byStatus.PROCESSING || 0),
  };
}

async function getTicketStats(db) {
  const rows = await db.collection("supportTickets")
    .aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const byStatus = {
    OPEN: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
  };

  for (const row of rows) {
    const key = row._id || "OPEN";
    if (Object.prototype.hasOwnProperty.call(byStatus, key)) {
      byStatus[key] = row.count;
    }
  }

  return {
    total: rows.reduce((sum, row) => sum + row.count, 0),
    byStatus,
    queueSize: (byStatus.OPEN || 0) + (byStatus.IN_PROGRESS || 0),
  };
}

async function getRevenueSummary(db) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const [row] = await db.collection("orders")
    .aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "PROCESSING", "SHIPPED", "DELIVERED"] },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $ifNull: ["$totalAmount", "$total"] } },
          avgOrderValue: { $avg: { $ifNull: ["$totalAmount", "$total"] } },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return {
    windowDays: 30,
    revenue: row?.revenue ?? 0,
    avgOrderValue: row?.avgOrderValue ?? 0,
    count: row?.count ?? 0,
  };
}
