/*
  Warnings:

  - Changed the type of `milestone` on the `Claim` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Claim" DROP COLUMN "milestone",
ADD COLUMN     "milestone" INTEGER NOT NULL;
