export type PlaceOrderRequest = {
  requestId: string;
  userId: string;
  symbol: string;
  side: "BUY" | "SELL";
  type: "LIMIT" | "MARKET";
  quantity: string;
  price?: string;
};