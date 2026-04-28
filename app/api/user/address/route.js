import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const userId = session.user.id;
  const userEmail = session.user.email;
  
  const user = await db.collection("users").findOne({
    $or: [
      { _id: userId },
      { _id: new ObjectId(userId) },
      { email: userEmail }
    ]
  });
  
  return NextResponse.json(user?.addresses || []);
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { address } = await req.json();
    if (!address) return NextResponse.json({ error: "Address data required" }, { status: 400 });

    const db = await getDb();
    const userId = session.user.id;
    const userEmail = session.user.email;
    
    // Recovery logic: Search by ID or Email (handles stale session after DB clear)
    const query = {
      $or: [
        { _id: userId },
        { _id: new ObjectId(userId) },
        { email: userEmail }
      ]
    };

    const newAddress = {
      ...address,
      id: new ObjectId().toString(),
      isDefault: address.isDefault || false,
      createdAt: new Date()
    };

    // If new address is default, unset other defaults
    if (newAddress.isDefault) {
      await db.collection("users").updateOne(
        query,
        { $set: { "addresses.$[].isDefault": false } }
      );
    }

    const result = await db.collection("users").updateOne(
      query,
      { $push: { addresses: newAddress } }
    );

    if (result.matchedCount === 0) {
      console.error("USER_NOT_FOUND_FOR_ADDRESS_SAVE", userId);
      return NextResponse.json({ error: "User profile not found in database" }, { status: 404 });
    }

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error("ADDRESS_SAVE_ERROR", error);
    return NextResponse.json({ error: "Internal server error during save" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const db = await getDb();
  await db.collection("users").updateOne(
    { _id: new ObjectId(session.user.id) },
    { $pull: { addresses: { id: id } } }
  );

  return NextResponse.json({ success: true });
}
