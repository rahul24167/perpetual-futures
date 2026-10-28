import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";


export const resolveMap = new Map<string, (value: NextResponse<unknown> | PromiseLike<NextResponse<unknown>>) => void>();

export async function resolveLoopback() {
    while (true) {

        const allTransactions = await redis.hGetAll(
            `perps:transaction`
        );
        for (const [txId, stringifiedStatus] of Object.entries(allTransactions)) {
            const status = JSON.parse(stringifiedStatus);
            if (status.dbPollerCompleted && status.engineCompleted) {
                const resolve = resolveMap.get(txId);
                if (resolve) {
                    resolve(NextResponse.json(
                        {
                            message: "Transaction successful",
                            transactionId: txId,
                        },
                        { status: 200 }
                    ));

                    resolveMap.delete(txId);
                    await redis.hDel(`perps:transaction`, txId);
                }
            }
        }
    }
}