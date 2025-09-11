/*
  Warnings:

  - Added the required column `annotations` to the `AIGrading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta` to the `AIGrading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentenceTips` to the `AIGrading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vocabulary` to the `AIGrading` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AIGrading" ADD COLUMN     "annotations" JSONB NOT NULL,
ADD COLUMN     "meta" JSONB NOT NULL,
ADD COLUMN     "sentenceTips" JSONB NOT NULL,
ADD COLUMN     "structureTips" TEXT,
ADD COLUMN     "vocabulary" JSONB NOT NULL;
