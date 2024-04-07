/*
  Warnings:

  - A unique constraint covering the columns `[events_id,email]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attendees_events_id_email_key" ON "attendees"("events_id", "email");
