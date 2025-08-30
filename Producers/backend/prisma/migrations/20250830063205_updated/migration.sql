/*
  Warnings:

  - You are about to drop the column `subsidyRate` on the `State` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "city" TEXT;

-- AlterTable
ALTER TABLE "public"."Plant" ADD COLUMN     "city" TEXT;

-- AlterTable
ALTER TABLE "public"."State" DROP COLUMN "subsidyRate";
