import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ensureAdminIndexes } from "@/lib/admin/indexes";
import { containsFilter, parsePagination, requireAdminSession, serializeList, toObjectId } from "@/lib/admin/server";

const VALID_STATUS = ["OPEN", "IN_PROGRESS", "RESOLVED"];
const VALID_PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export async function GET(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const db = await getDb();
    await ensureAdminIndexes(db);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams, { defaultLimit: 12, maxLimit: 50 });

    const status = searchParams.get("status");
    const query = {
      ...(status && VALID_STATUS.includes(status) ? { status } : {}),
    };

    const term = searchParams.get("q");
    if (term) {
      query.$or = [containsFilter("subject", term), containsFilter("customerName", term), containsFilter("ticketNumber", term)];
    }

    const [items, total] = await Promise.all([
      db.collection("supportTickets")
        .find(query, {
          projection: {
            ticketNumber: 1,
            customerName: 1,
            customerEmail: 1,
            subject: 1,
            status: 1,
            priority: 1,
            updatedAt: 1,
            createdAt: 1,
            messages: { $slice: -1 },
          },
        })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("supportTickets").countDocuments(query),
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
    console.error("ADMIN_SUPPORT_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load support tickets" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const payload = await request.json();

    if (!payload.ticketId || !payload.message || !String(payload.message).trim()) {
      return NextResponse.json({ error: "ticketId and message are required" }, { status: 400 });
    }

    const ticketObjectId = toObjectId(payload.ticketId);
    if (!ticketObjectId) {
      return NextResponse.json({ error: "Invalid ticketId" }, { status: 400 });
    }

    const db = await getDb();
    await ensureAdminIndexes(db);
    const now = new Date();
    const status = VALID_STATUS.includes(payload.status) ? payload.status : "IN_PROGRESS";
    const priority = VALID_PRIORITY.includes(payload.priority) ? payload.priority : undefined;

    const result = await db.collection("supportTickets").updateOne(
      { _id: ticketObjectId },
      {
        $push: {
          messages: {
            sender: "ADMIN",
            senderId: auth.session.user.id,
            text: String(payload.message).trim(),
            createdAt: now,
          },
        },
        $set: {
          status,
          ...(priority ? { priority } : {}),
          updatedAt: now,
          updatedBy: auth.session.user.id,
        },
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_SUPPORT_POST_ERROR", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
