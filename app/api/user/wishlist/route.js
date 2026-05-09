import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ wishlist: [] });

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ 
      _id: ObjectId.isValid(session.user.id) ? new ObjectId(session.user.id) : session.user.id 
    });

    return NextResponse.json({ wishlist: user?.wishlist || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Log in to save wishlist' }, { status: 401 });

    const { wishlist } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    await db.collection('users').updateOne(
      { _id: ObjectId.isValid(session.user.id) ? new ObjectId(session.user.id) : session.user.id },
      { $set: { wishlist: wishlist } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}
