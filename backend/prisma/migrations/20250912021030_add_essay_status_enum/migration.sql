/*
  Warnings:

  - The `status` column on the `EssaySubmission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."EssayStatus" AS ENUM ('PENDING', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "public"."EssaySubmission" DROP COLUMN "status",
ADD COLUMN     "status" "public"."EssayStatus" NOT NULL DEFAULT 'PENDING';
