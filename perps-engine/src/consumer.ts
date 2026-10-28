import { redis } from "./redis.js";
import { updateBalance } from "./balances.js";

const STREAM = "perps-ramp";
const GROUP = "engine";
const CONSUMER = `engine-${process.pid}`;

export async function startConsumer() {
    // Create the consumer group if it does not exist.
    try {
        await redis.xGroupCreate(
            STREAM,
            GROUP,
            "0",
            { MKSTREAM: true },
        );
    } catch (error) {
        if (
            !(error instanceof Error) ||
            !error.message.includes("BUSYGROUP")
        ) {
            throw error;
        }
    }

    console.log(`Consumer ${CONSUMER} started`);

    while (true) {
        const messages = await redis.xReadGroup(
            GROUP,
            CONSUMER,
            [{ key: STREAM, id: ">" }],
            {
                COUNT: 10,
                BLOCK: 5000,
            },
        );

        if (!messages) {
            continue;
        }

        for (const stream of messages) {
            for (const entry of stream.messages) {
                const { id, message: data } = entry;
                const statusKey = `perps:transaction:${id}`;

                try {
                    const email = data.email;
                    const type = data.type;
                    const amount = Number(data.amount);

                    if (!email) {
                        throw new Error("Missing email");
                    }

                    if (
                        type !== "deposit" &&
                        type !== "withdrawal"
                    ) {
                        throw new Error("Invalid transaction type");
                    }

                    const newBalance = updateBalance(
                        email,
                        type,
                        amount,
                    );

                    await redis.hSet(statusKey, {
                        engine: "completed",
                        balance: String(newBalance),
                    });

                    console.log({
                        transactionId: id,
                        email,
                        type,
                        amount,
                        newBalance,
                    });

                    await redis.xAck(STREAM, GROUP, id);
                } catch (error) {
                    console.error(
                        `Failed to process transaction ${id}:`,
                        error,
                    );

                    await redis.hSet(statusKey, {
                        engine: "failed",
                    });

                    await redis.xAck(STREAM, GROUP, id);
                }
            }
        }
    }
}