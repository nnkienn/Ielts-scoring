-- CreateTable
CREATE TABLE "public"."Translation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "sourceLang" TEXT NOT NULL,
    "targetLang" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromCache" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Translation" ADD CONSTRAINT "Translation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
