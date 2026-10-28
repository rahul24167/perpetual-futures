import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const streamKey = 'mystream:events';

    // XADD streamKey * field1 value1 field2 value2 ...
    // '*' automatically generates a timestamp-based entry ID
    const entryId = await redis.xAdd(streamKey, '*', {
      userId: String(userId),
      action: String(action),
      timestamp: String(Date.now()),
    });

    return NextResponse.json({ success: true, entryId });
  } catch (error) {
    console.error('Redis XADD Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
