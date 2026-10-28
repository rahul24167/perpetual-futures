import { randomUUID } from "node:crypto";
import { connectRedis, redis } from "@/lib/redis";
import type { PlaceOrderRequest } from "./types";

const ORDER_STREAM = "perps:orders";

export async function publishOrder(
  order: Omit<PlaceOrderRequest, "requestId">,
) {
  await connectRedis();

  const request: PlaceOrderRequest = {
    ...order,
    requestId: randomUUID(),
  };

  const messageId = await redis.xAdd(
    ORDER_STREAM,
    "*",
    {
      payload: JSON.stringify(request),
    },
  );

  return {
    requestId: request.requestId,
    messageId,
    status: "QUEUED" as const,
  };
}