import { auth } from "@/auth";
import { z } from "zod";
import { resolveMap } from "@/lib/resolveLoopback";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";


const TransactionSchema = z.object({
    type: z.enum(["deposit", "withdrawal"]),
    amount: z.number().positive(),
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const transaction = TransactionSchema.parse(body);
    const eventData = {
        email: session.user.email,
        type: transaction.type,
        amount: transaction.amount.toString(),
        timestamp: Date.now().toString(),
    };

    const messageId = await redis.xAdd("perps-ramp", "*", eventData);
    // Status Check, in future we will probably have pub/sub here 

    const result = await new Promise<NextResponse>((resolve) => {
        resolveMap.set(messageId, resolve);
        setTimeout(() => {
            resolveMap.delete(messageId);
            resolve(NextResponse.json(
                {
                    message: "Transaction is still processing",
                    transactionId: messageId,
                },
                { status: 202 }
            ));
        }, 5000);
    })
    return result;
    // const deadline = Date.now() + 5000;
    // while (Date.now() < deadline) {
    //     const status = await redis.hGetAll(
    //         `perps:transaction:${messageId}`
    //     );

    //     const dbCompleted = (status["db-poller"] === "completed");
    //     const engineCompleted = (status["engine"] === "completed");

    //     if (dbCompleted && engineCompleted) {
    //         // Both consumers have completed successfully.
    //         return NextResponse.json(
    //             {
    //                 message: "Transaction successful",
    //                 transactionId: messageId,
    //             },
    //             { status: 200 }
    //         );
    //     }
    //     await new Promise((resolve) => {
    //         setTimeout(() => {
    //             resolve(true);
    //         }, 100);
    //     });

    // }
    // return NextResponse.json(
    //     {
    //         message: "Transaction is still processing",
    //         transactionId: messageId,
    //     },
    //     { status: 202 }
    // );
}

// prisma.$transaction(async (tx) => {
//     const users = await tx.$queryRaw<User[]>`
//         SELECT * FROM "User"
//         WHERE "email"= ${session.user.email}
//         FOR UPDATE`;

//     const user = users[0];
//     if (!user) {
//         return NextResponse.json({ error: "User Not found" })
//     }
//     if (transaction.type === "withdrawal" && user.balance < transaction.amount) {
//         throw new Error("INSUFFICIENT_FUNDS");
//     }

//     await prisma.user.update({
//         where: {
//             email: user.email
//         },
//         data: {
//             balance: {
//                 increment: (transaction.type ==="deposit"  ?transaction.amount: -(transaction.amount))
//             }
//         }
//     })
// })