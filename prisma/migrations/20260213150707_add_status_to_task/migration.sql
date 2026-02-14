/*
  Warnings:

  - You are about to drop the column `completed` on the `tasks` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "completed",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NOT_STARTED';
