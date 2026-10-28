import "dotenv/config";
import express from "express";
import { redis } from "./redis.js";
import { startConsumer } from "./consumer.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

async function main() {
    await redis.connect();
    console.log("Connected to Redis");

    void startConsumer().catch((error) => {
        console.error("Consumer stopped:", error);
        process.exitCode = 1;
    });

    app.listen(PORT, () => {
        console.log(`Engine listening on port ${PORT}`);
    });
}

main().catch((error) => {
    console.error("Engine startup failed:", error);
    process.exitCode = 1;
});
//Need some kind of Genric here For the Price
interface IOrder{
    id: String,
    email: String,
    assetSlug: String,
    margin: Number,
    qty: Number,
    type:"LONG"|"SHORT",
    orderType: "limit"|"market",
    price: Number | undefined
}
//have to do some kind of sorting when putting orders in the order book
const orderBook = [{
    assetSlug: "BTC-USD",
    ask:[{id: "1", email: "user1@example.com", assetSlug: "BTC-USD", margin: 100, qty: 1, type: "LONG", orderType: "limit", price: 50000}],
    bid:[{id: "2", email: "user2@example.com", assetSlug: "BTC-USD", margin: 100, qty: 1, type: "SHORT", orderType: "limit", price: 49000}]}
]

const matchOrders=()=>{
    //check If any order is matched
    orderBook.forEach((order)=>{
        order.ask.forEach((askOrder)=>{
            order.bid.forEach((bidOrder)=>{
                if(askOrder.price && bidOrder.price && askOrder.price <= bidOrder.price){
                    console.log(`Matched Order: ${askOrder.id} and ${bidOrder.id}`);
                    //Remove the matched orders from the order book
                    order.ask = order.ask.filter((o)=>o.id !== askOrder.id);
                    order.bid = order.bid.filter((o)=>o.id !== bidOrder.id);
                }
            })
        })
    })
}