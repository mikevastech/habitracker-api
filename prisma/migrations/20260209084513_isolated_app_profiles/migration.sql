/*
  Warnings:

  - You are about to drop the column `subscriptionTier` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `follows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_block` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email,originAppId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "habitracker_app"."SubscriptionTier" AS ENUM ('FREE', 'PRO', 'LIFETIME');

-- DropForeignKey
ALTER TABLE "auth"."follows" DROP CONSTRAINT "follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "auth"."follows" DROP CONSTRAINT "follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "auth"."user_block" DROP CONSTRAINT "user_block_blockedUserId_fkey";

-- DropForeignKey
ALTER TABLE "auth"."user_block" DROP CONSTRAINT "user_block_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."challenge_member" DROP CONSTRAINT "challenge_member_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."comment" DROP CONSTRAINT "comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."daily_stats" DROP CONSTRAINT "daily_stats_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."like" DROP CONSTRAINT "like_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."post" DROP CONSTRAINT "post_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."task" DROP CONSTRAINT "task_userId_fkey";

-- DropIndex
DROP INDEX "auth"."user_email_key";

-- DropIndex
DROP INDEX "auth"."user_username_idx";

-- DropIndex
DROP INDEX "auth"."user_username_key";

-- AlterTable
ALTER TABLE "auth"."user" DROP COLUMN "subscriptionTier",
DROP COLUMN "username",
ADD COLUMN     "originAppId" TEXT NOT NULL DEFAULT 'pacez_habit_tracker';

-- DropTable
DROP TABLE "auth"."follows";

-- DropTable
DROP TABLE "auth"."user_block";

-- DropEnum
DROP TYPE "auth"."SubscriptionTier";

-- CreateTable
CREATE TABLE "habitracker_app"."habit_profile" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "subscriptionTier" "habitracker_app"."SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "bio" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "habit_profile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "habitracker_app"."user_block" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,

    CONSTRAINT "user_block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."follows" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "habit_profile_username_key" ON "habitracker_app"."habit_profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_block_profileId_blockedId_key" ON "habitracker_app"."user_block"("profileId", "blockedId");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "auth"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_originAppId_key" ON "auth"."user"("email", "originAppId");

-- AddForeignKey
ALTER TABLE "habitracker_app"."habit_profile" ADD CONSTRAINT "habit_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."user_block" ADD CONSTRAINT "user_block_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."user_block" ADD CONSTRAINT "user_block_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."daily_stats" ADD CONSTRAINT "daily_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."task" ADD CONSTRAINT "task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."post" ADD CONSTRAINT "post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."comment" ADD CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."challenge_member" ADD CONSTRAINT "challenge_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
