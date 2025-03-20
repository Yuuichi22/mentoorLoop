/*
  Warnings:

  - You are about to drop the column `rating` on the `Alumini` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Alumini` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Alumini" DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "rating";

-- CreateIndex
CREATE UNIQUE INDEX "Alumini_user_id_key" ON "Alumini"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_user_id_key" ON "Student"("user_id");
