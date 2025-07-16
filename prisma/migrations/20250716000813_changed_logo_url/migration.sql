/*
  Warnings:

  - You are about to drop the column `docURL` on the `RestaurantDocs` table. All the data in the column will be lost.
  - Added the required column `docUrl` to the `RestaurantDocs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "logoID" TEXT;

-- AlterTable
ALTER TABLE "RestaurantDocs" DROP COLUMN "docURL",
ADD COLUMN     "docUrl" TEXT NOT NULL;
