-- CreateTable
CREATE TABLE "attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "events_id" TEXT NOT NULL,
    CONSTRAINT "attendees_events_id_fkey" FOREIGN KEY ("events_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
