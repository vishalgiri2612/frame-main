import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession, serializeId, toObjectId } from "@/lib/admin/server";

export async function GET(_request, { params }) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const objectId = toObjectId(params.id);
  if (!objectId) {
    return NextResponse.json({ error: "Invalid ticket id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const ticket = await db.collection("supportTickets").findOne({ _id: objectId });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(serializeId(ticket));
  } catch (error) {
    console.error("ADMIN_SUPPORT_TICKET_GET_ERROR", error);
    return NextResponse.json({ error: "Failed to load ticket" }, { status: 500 });
  }
}
