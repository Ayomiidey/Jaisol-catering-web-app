-- AlterTable
ALTER TABLE "catering_booking" ADD COLUMN     "eventTime" TEXT,
ADD COLUMN     "phone" VARCHAR(20);

-- CreateIndex
CREATE INDEX "catering_booking_date_idx" ON "catering_booking"("date");
