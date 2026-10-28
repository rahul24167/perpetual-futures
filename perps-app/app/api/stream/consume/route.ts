// import { NextRequest, NextResponse } from 'next/server';
// import { redis } from '@/lib/redis';

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     // By default, '$' reads only new messages, '0' reads from the beginning
//     const lastId = searchParams.get('lastId') || '0'; 

//     const streamKey = 'mystream:events';

//     // Read up to 10 entries and block for up to 2000ms when no new events exist.
//     const response = await redis.xRead(
//       [
//         {
//           key: streamKey,
//           id: lastId,
//         },
//       ],
//       {
//         COUNT: 10,
//         BLOCK: 2000, // Block for up to 2000ms if no new events exist
//       }
//     );

//     // Format the response for clean consumption
//     if (!response || response.length === 0) {
//       return NextResponse.json({ messages: [] });
//     }

//     const messages = response[0].messages.map((msg) => ({
//       id: msg.id,
//       data: msg.message, // Contains the object key-value pairs
//     }));

//     return NextResponse.json({ messages });
//   } catch (error) {
//     console.error('Redis XREAD Error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
