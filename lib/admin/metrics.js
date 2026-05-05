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
    revenueStats,
    latestOrders,
    topBrands,
    salesTrend,
  ] = await Promise.all([
    getProductStats(db),
    getOrderStats(db),
    db.collection("users").countDocuments(),
    getTicketStats(db),
    getRevenueStats(db),
    db.collection("orders")
      .find({}, { projection: { orderNumber: 1, customerName: 1, total: 1, totalAmount: 1, status: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray(),
    getTopSellingBrands(db),
    getSalesTrend(db),
  ]);

  return {
    productStats,
    orderStats,
    userCount,
    ticketStats,
    revenueStats,
    topBrands,
    salesTrend,
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
  const [rows, lowStockItems] = await Promise.all([
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
    db.collection("products")
      .find({ stock: { $lte: 5 }, status: "ACTIVE" })
      .limit(10)
      .toArray(),
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
    lowStockCount: lowStockItems.length,
    lowStockItems: lowStockItems.map(p => ({
      id: p._id.toString(),
      name: p.name,
      stock: p.stock,
      sku: p.sku
    })),
  };
}

async function getOrderStats(db) {
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now);
  startOfMonth.setDate(now.getDate() - 30);

  const [statusRows, timeframeStats] = await Promise.all([
    db.collection("orders")
      .aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]).toArray(),
    db.collection("orders")
      .aggregate([
        {
          $facet: {
            today: [{ $match: { createdAt: { $gte: startOfToday } } }, { $count: "count" }],
            week: [{ $match: { createdAt: { $gte: startOfWeek } } }, { $count: "count" }],
            month: [{ $match: { createdAt: { $gte: startOfMonth } } }, { $count: "count" }],
          }
        }
      ]).toArray()
  ]);

  const byStatus = ORDER_STATUS.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  for (const row of statusRows) {
    byStatus[row._id || "PENDING"] = row.count;
  }

  return {
    total: statusRows.reduce((sum, row) => sum + row.count, 0),
    byStatus,
    open: (byStatus.PENDING || 0) + (byStatus.PROCESSING || 0),
    today: timeframeStats[0].today[0]?.count || 0,
    week: timeframeStats[0].week[0]?.count || 0,
    month: timeframeStats[0].month[0]?.count || 0,
  };
}

async function getRevenueStats(db) {
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const startOfMonth = new Date(now);
  startOfMonth.setDate(now.getDate() - 30);

  const stats = await db.collection("orders").aggregate([
    {
      $match: {
        status: { $in: ["confirmed", "PROCESSING", "SHIPPED", "DELIVERED"] }
      }
    },
    {
      $facet: {
        today: [
          { $match: { createdAt: { $gte: startOfToday } } },
          { $group: { _id: null, total: { $sum: { $ifNull: ["$totalAmount", "$total"] } } } }
        ],
        week: [
          { $match: { createdAt: { $gte: startOfWeek } } },
          { $group: { _id: null, total: { $sum: { $ifNull: ["$totalAmount", "$total"] } } } }
        ],
        month: [
          { $match: { createdAt: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: { $ifNull: ["$totalAmount", "$total"] } } } }
        ],
        allTime: [
          { $group: { _id: null, total: { $sum: { $ifNull: ["$totalAmount", "$total"] } } } }
        ]
      }
    }
  ]).toArray();

  const data = stats[0];
  return {
    today: data.today[0]?.total || 0,
    week: data.week[0]?.total || 0,
    month: data.month[0]?.total || 0,
    allTime: data.allTime[0]?.total || 0,
  };
}

async function getTopSellingBrands(db) {
  return await db.collection("orders").aggregate([
    { $match: { status: { $in: ["confirmed", "PROCESSING", "SHIPPED", "DELIVERED"] } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.brand",
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        unitsSold: { $sum: "$items.quantity" }
      }
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 5 },
    {
      $project: {
        brand: "$_id",
        revenue: 1,
        unitsSold: 1,
        _id: 0
      }
    }
  ]).toArray();
}

async function getSalesTrend(db) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return await db.collection("orders").aggregate([
    {
      $match: {
        status: { $in: ["confirmed", "PROCESSING", "SHIPPED", "DELIVERED"] },
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: { $ifNull: ["$totalAmount", "$total"] } },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
        revenue: 1,
        orders: 1,
        _id: 0
      }
    }
  ]).toArray();
}

async function getTicketStats(db) {
  const rows = await db.collection("supportTickets")
    .aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]).toArray();

  const byStatus = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0 };
  for (const row of rows) {
    const key = row._id || "OPEN";
    if (byStatus.hasOwnProperty(key)) byStatus[key] = row.count;
  }

  return {
    total: rows.reduce((sum, row) => sum + row.count, 0),
    byStatus,
    queueSize: (byStatus.OPEN || 0) + (byStatus.IN_PROGRESS || 0),
  };
}

