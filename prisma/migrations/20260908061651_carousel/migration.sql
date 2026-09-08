-- AlterTable
ALTER TABLE "menu_item" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "carousel" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "link" TEXT,
    "type" VARCHAR(50) NOT NULL DEFAULT 'homepage',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carousel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "carousel_type_isActive_sortOrder_idx" ON "carousel"("type", "isActive", "sortOrder");
