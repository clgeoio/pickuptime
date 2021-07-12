/*
  Warnings:

  - You are about to drop the column `participants` on the `Timeslot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Timeslot" DROP COLUMN "participants";

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timeslotId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ready" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Participant" ADD FOREIGN KEY ("timeslotId") REFERENCES "Timeslot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
