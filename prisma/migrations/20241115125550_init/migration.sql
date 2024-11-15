/*
  Warnings:

  - You are about to drop the column `userId` on the `Carpool` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Carpool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "departure" TEXT NOT NULL,
    "arrival" TEXT NOT NULL,
    "description" TEXT,
    "departureDate" DATETIME NOT NULL,
    "departureTime" TEXT NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "isDriverSoberNeeded" BOOLEAN NOT NULL DEFAULT false,
    "soberDriverFound" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "privateCode" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "soberDriverId" TEXT,
    CONSTRAINT "Carpool_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Carpool_soberDriverId_fkey" FOREIGN KEY ("soberDriverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Carpool" ("arrival", "availableSeats", "createdAt", "creatorId", "departure", "departureDate", "departureTime", "description", "id", "isArchived", "isDriverSoberNeeded", "isFinished", "isPrivate", "privateCode", "soberDriverFound", "updatedAt") SELECT "arrival", "availableSeats", "createdAt", "creatorId", "departure", "departureDate", "departureTime", "description", "id", "isArchived", "isDriverSoberNeeded", "isFinished", "isPrivate", "privateCode", "soberDriverFound", "updatedAt" FROM "Carpool";
DROP TABLE "Carpool";
ALTER TABLE "new_Carpool" RENAME TO "Carpool";
CREATE UNIQUE INDEX "Carpool_privateCode_key" ON "Carpool"("privateCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
