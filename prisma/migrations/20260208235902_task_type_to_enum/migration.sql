/*
  Warnings:

  - The primary key for the `like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrl` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `postType` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `task_type` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,key]` on the table `user_setting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `task_reminder` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `verification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `verification` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('HABIT', 'ROUTINE', 'TODO', 'MINDSET');

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_groupId_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_typeId_fkey";

-- DropForeignKey
ALTER TABLE "user_setting" DROP CONSTRAINT "user_setting_userId_fkey";

-- DropIndex
DROP INDEX "comment_postId_createdAt_idx";

-- DropIndex
DROP INDEX "post_groupId_createdAt_idx";

-- DropIndex
DROP INDEX "post_userId_createdAt_idx";

-- DropIndex
DROP INDEX "task_typeId_idx";

-- DropIndex
DROP INDEX "task_completion_taskId_completedAt_idx";

-- DropIndex
DROP INDEX "user_setting_userId_idx";

-- AlterTable
ALTER TABLE "like" DROP CONSTRAINT "like_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "pomodoro_settings" ADD COLUMN     "autoStartBreaks" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoStartFocus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "post" DROP COLUMN "groupId",
DROP COLUMN "mediaUrl",
DROP COLUMN "postType",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task" DROP COLUMN "typeId",
ADD COLUMN     "type" "TaskType" NOT NULL;

-- AlterTable
ALTER TABLE "task_completion" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "task_reminder" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "locationName" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- DropTable
DROP TABLE "task_type";

-- CreateIndex
CREATE UNIQUE INDEX "user_setting_userId_key_key" ON "user_setting"("userId", "key");

-- AddForeignKey
ALTER TABLE "user_setting" ADD CONSTRAINT "user_setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
