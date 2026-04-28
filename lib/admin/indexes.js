let indexPromise;

export function ensureAdminIndexes(db) {
  if (!indexPromise) {
    indexPromise = Promise.all([
      db.collection("products").createIndexes([
        { key: { sku: 1 }, name: "products_sku_unique", unique: true },
        { key: { name: 1 }, name: "products_name" },
        { key: { status: 1, updatedAt: -1 }, name: "products_status_updatedAt" },
      ]),
      db.collection("orders").createIndexes([
        { key: { orderNumber: 1 }, name: "orders_number" },
        { key: { status: 1, createdAt: -1 }, name: "orders_status_createdAt" },
      ]),
      db.collection("supportTickets").createIndexes([
        { key: { ticketNumber: 1 }, name: "tickets_number" },
        { key: { status: 1, updatedAt: -1 }, name: "tickets_status_updatedAt" },
      ]),
      db.collection("users").createIndexes([
        { key: { email: 1 }, name: "users_email_unique", unique: true },
        { key: { role: 1, createdAt: -1 }, name: "users_role_createdAt" },
      ]),
    ]).catch((error) => {
      indexPromise = null;
      throw error;
    });
  }

  return indexPromise;
}
