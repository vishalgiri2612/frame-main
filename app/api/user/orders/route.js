import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const { items, total, addressId, paymentMethod } = await req.json();
    const userId = session.user.id;

    const order = {
      userId: userId,
      items,
      total,
      addressId,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(order);

    return NextResponse.json({ success: true, orderId: result.insertedId });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Recovery Logic: Find user by email to get canonical ID
    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) return NextResponse.json([]); // No user, no orders

    const userId = user._id;

    const orders = await db.collection('orders')
      .find({ 
        $or: [
          { userId: userId.toString() },
          { userId: userId }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("FETCH_ORDERS_ERROR", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
