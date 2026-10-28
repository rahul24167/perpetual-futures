-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avilableCollateral" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedCollateral" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "margin" INTEGER NOT NULL,
    "liquidationPrice" INTEGER NOT NULL,
    "averagePrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "margin" INTEGER NOT NULL,
    "orderType" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "collateral" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fill" (
    "id" TEXT NOT NULL,
    "MakerOrderId" TEXT NOT NULL,
    "TakerOrderId" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "longPrice" INTEGER NOT NULL,
    "shortPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fill" ADD CONSTRAINT "Fill_MakerOrderId_fkey" FOREIGN KEY ("MakerOrderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fill" ADD CONSTRAINT "Fill_TakerOrderId_fkey" FOREIGN KEY ("TakerOrderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
