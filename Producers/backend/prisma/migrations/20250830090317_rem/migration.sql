/*
  Warnings:

  - You are about to drop the column `stateId` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stateName` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_state_name_fkey";

-- DropForeignKey
ALTER TABLE "public"."Plant" DROP CONSTRAINT "Plant_stateId_fkey";

-- AlterTable
ALTER TABLE "public"."Plant" DROP COLUMN "stateId",
ADD COLUMN     "stateName" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."State";
