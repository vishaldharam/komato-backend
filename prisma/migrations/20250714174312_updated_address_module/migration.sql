/*
  Warnings:

  - Added the required column `district` to the `UserAddresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAddresses" ADD COLUMN     "district" TEXT NOT NULL;
