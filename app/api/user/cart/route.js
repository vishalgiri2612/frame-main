import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ cart: [] });

    const client = await clientPromise;
    const db = client.db();
    
    const query = {};
    if (ObjectId.isValid(session.user.id)) {
      query._id = new ObjectId(session.user.id);
    } else {
      query._id = session.user.id;
    }

    const user = await db.collection('users').findOne(query);

    return NextResponse.json({ cart: user?.cart || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Log in to save cart' }, { status: 401 });

    const { cart } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    
    const query = {};
    if (ObjectId.isValid(session.user.id)) {
      query._id = new ObjectId(session.user.id);
    } else {
      query._id = session.user.id;
    }

    await db.collection('users').updateOne(
      query,
      { $set: { cart: cart } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clientPromise;
    const db = client.db();

    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { cart: [] } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
