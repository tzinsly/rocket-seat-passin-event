-- CreateTable
CREATE TABLE "checkins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendees_id" INTEGER NOT NULL,
    CONSTRAINT "checkins_attendees_id_fkey" FOREIGN KEY ("attendees_id") REFERENCES "attendees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "checkins_attendees_id_key" ON "checkins"("attendees_id");
