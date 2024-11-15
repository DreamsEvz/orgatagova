/*
  Warnings:

  - You are about to drop the `ArchivedCarpool` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Carpool` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carpoolCode` on the `Carpool` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `Carpool` table. All the data in the column will be lost.
  - You are about to drop the column `isEnded` on the `Carpool` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `Carpool` table. All the data in the column will be lost.
  - You are about to drop the column `seats` on the `Carpool` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Carpool` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `arrival` to the `Carpool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableSeats` to the `Carpool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Carpool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Carpool` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArchivedCarpool";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CarpoolParticipants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "carpoolId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CarpoolParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CarpoolParticipants_carpoolId_fkey" FOREIGN KEY ("carpoolId") REFERENCES "Carpool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "userId" TEXT,
    CONSTRAINT "Carpool_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Carpool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Carpool" ("departure", "departureDate", "departureTime", "description", "id", "userId") SELECT "departure", "departureDate", "departureTime", "description", "id", "userId" FROM "Carpool";
DROP TABLE "Carpool";
ALTER TABLE "new_Carpool" RENAME TO "Carpool";
CREATE UNIQUE INDEX "Carpool_privateCode_key" ON "Carpool"("privateCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CarpoolParticipants_userId_carpoolId_key" ON "CarpoolParticipants"("userId", "carpoolId");
