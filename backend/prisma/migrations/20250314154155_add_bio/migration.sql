/*
  Warnings:

  - You are about to drop the column `amount` on the `Bidder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bidder" DROP COLUMN "amount";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "profileUrl" TEXT;
