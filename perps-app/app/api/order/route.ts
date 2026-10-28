// {
//   "market": "SOL",
//   "type": "LONG",
//   "qty": 10,
//   "orderType": "limit",
//   "price": 90
// }
// a post API for placing an order
import z from "zod";
import { auth } from "@/auth";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

const OrderSchema = z.object({
    market: z.string(),
    type: z.enum(["LONG", "SHORT"]),
    qty: z.number().positive(),
    orderType: z.enum(["limit", "market"]),
    price: z.number().positive().optional(),
});
async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session.user.email) {
        return NextResponse.json({ error: "Email not found in session" }, { status: 400 });
    }
    const body = await req.json();
    const order = OrderSchema.parse(body);
    
    const eventData = {
        "userEmail": session.user.email,
        "market": order.market,
        "type": order.type,
        "qty": order.qty.toString(),
        "orderType": order.orderType,
        "price": order.price?.toString() || "",
    };
    const messageId = await redis.xAdd("place-order", "*", eventData);
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
        const status = await redis.hGetAll(
            `order:status:${messageId}`
        );
        const orderCompleted = (status["order-processor"] === "addedToOrderBook");
        if (orderCompleted) {
            return NextResponse.json(
                {
                    message: "Order placed successfully",
                    orderId: messageId,
                },
                { status: 200 }
            );
        }
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 100);
        });
    }

    return NextResponse.json(
        {
            message: "Order is still processing",
            orderId: messageId,
        },
        { status: 200 }
    );
}
async function DELETE(req: Request) {

}
//a Delete API for canceling an existingorder
