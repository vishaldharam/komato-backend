/*
  Warnings:

  - Added the required column `gstNo` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RestaurantOnboardingStatus" AS ENUM ('INITIATED', 'DOCS_PENDING', 'REVIEW', 'VERIFIED', 'REJECTED', 'LIVE');

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "gstNo" TEXT NOT NULL,
ADD COLUMN     "isBlocked" BOOLEAN DEFAULT false,
ADD COLUMN     "onboardingStatus" "RestaurantOnboardingStatus" DEFAULT 'INITIATED',
ALTER COLUMN "isVerified" DROP NOT NULL,
ALTER COLUMN "onboardingComplete" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RestaurantDocs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "docID" TEXT NOT NULL,
    "docURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "RestaurantDocs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantDocs" ADD CONSTRAINT "RestaurantDocs_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
