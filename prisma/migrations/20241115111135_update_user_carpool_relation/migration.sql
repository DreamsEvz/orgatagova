-- CreateTable
CREATE TABLE "Carpool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "departure" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "departureDate" DATETIME NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "seats" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "isEnded" BOOLEAN NOT NULL DEFAULT false,
    "carpoolCode" TEXT NOT NULL,
    CONSTRAINT "Carpool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArchivedCarpool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carpoolId" TEXT NOT NULL,
    CONSTRAINT "ArchivedCarpool_carpoolId_fkey" FOREIGN KEY ("carpoolId") REFERENCES "Carpool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Carpool_userId_key" ON "Carpool"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Carpool_carpoolCode_key" ON "Carpool"("carpoolCode");
