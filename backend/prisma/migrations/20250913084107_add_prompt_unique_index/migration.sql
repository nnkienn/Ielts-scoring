/*
  Warnings:

  - A unique constraint covering the columns `[question,taskType]` on the table `Prompt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Prompt_question_taskType_key" ON "public"."Prompt"("question", "taskType");
