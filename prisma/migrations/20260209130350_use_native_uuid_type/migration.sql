/*
  Warnings:

  - The primary key for the `account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `verification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `achievement_definition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `userId` column on the `category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `challenge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `challenge_member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `daily_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `group_member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `habit_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `unitId` column on the `habit_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `habit_profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `mindset_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notification_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pomodoro_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `challengeId` column on the `post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `groupId` column on the `post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `reward_event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `routine_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `categoryId` column on the `task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `originalTaskId` column on the `task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `frequencyId` column on the `task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `challengeId` column on the `task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `task_completion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_frequency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_reminder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_unit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `userId` column on the `task_unit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `todo_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `todo_subtask` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_block` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `user_setting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `user_setting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `verification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `achievement_definition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `challenge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groupId` on the `challenge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `creatorId` on the `challenge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `challengeId` on the `challenge_member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `challenge_member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `daily_stats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `daily_stats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `followerId` on the `follows` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `followingId` on the `follows` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `group` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `group_member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groupId` on the `group_member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `group_member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `taskId` on the `habit_details` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `habit_profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `like` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `like` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `taskId` on the `mindset_details` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `receiverId` on the `notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `senderId` on the `notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `notificationTypeId` on the `notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `notification_type` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `taskId` on the `pomodoro_settings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `reward_event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `reward_event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `achievementDefinitionId` on the `reward_event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `taskId` on the `routine_details` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `task_completion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `taskId` on the `task_completion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `task_frequency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `task_reminder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `taskId` on the `task_reminder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `task_unit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `taskId` on the `todo_details` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `todo_subtask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `todoDetailsId` on the `todo_subtask` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `user_block` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `profileId` on the `user_block` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `blockedId` on the `user_block` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "auth"."account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "auth"."session" DROP CONSTRAINT "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "auth"."user_setting" DROP CONSTRAINT "user_setting_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."challenge" DROP CONSTRAINT "challenge_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."challenge" DROP CONSTRAINT "challenge_groupId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."challenge_member" DROP CONSTRAINT "challenge_member_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."challenge_member" DROP CONSTRAINT "challenge_member_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."comment" DROP CONSTRAINT "comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."comment" DROP CONSTRAINT "comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."daily_stats" DROP CONSTRAINT "daily_stats_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."follows" DROP CONSTRAINT "follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."follows" DROP CONSTRAINT "follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."group_member" DROP CONSTRAINT "group_member_groupId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."group_member" DROP CONSTRAINT "group_member_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."habit_details" DROP CONSTRAINT "habit_details_taskId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."habit_details" DROP CONSTRAINT "habit_details_unitId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."habit_profile" DROP CONSTRAINT "habit_profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."like" DROP CONSTRAINT "like_postId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."like" DROP CONSTRAINT "like_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."mindset_details" DROP CONSTRAINT "mindset_details_taskId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."notification" DROP CONSTRAINT "notification_notificationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."notification" DROP CONSTRAINT "notification_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."notification" DROP CONSTRAINT "notification_senderId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."pomodoro_settings" DROP CONSTRAINT "pomodoro_settings_taskId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."post" DROP CONSTRAINT "post_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."post" DROP CONSTRAINT "post_groupId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."post" DROP CONSTRAINT "post_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."reward_event" DROP CONSTRAINT "reward_event_achievementDefinitionId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."reward_event" DROP CONSTRAINT "reward_event_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."routine_details" DROP CONSTRAINT "routine_details_taskId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."task" DROP CONSTRAINT "task_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."task" DROP CONSTRAINT "task_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."task" DROP CONSTRAINT "task_frequencyId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."task" DROP CONSTRAINT "task_userId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."task_completion" DROP CONSTRAINT "task_completion_taskId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."task_reminder" DROP CONSTRAINT "task_reminder_taskId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."todo_details" DROP CONSTRAINT "todo_details_taskId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."todo_subtask" DROP CONSTRAINT "todo_subtask_todoDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."user_block" DROP CONSTRAINT "user_block_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "habitracker_app"."user_block" DROP CONSTRAINT "user_block_profileId_fkey";

-- AlterTable
ALTER TABLE "auth"."account" DROP CONSTRAINT "account_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "auth"."session" DROP CONSTRAINT "session_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "auth"."user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "auth"."user_setting" DROP CONSTRAINT "user_setting_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "user_setting_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "auth"."verification" DROP CONSTRAINT "verification_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "verification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."achievement_definition" DROP CONSTRAINT "achievement_definition_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "achievement_definition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."category" DROP CONSTRAINT "category_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID,
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."challenge" DROP CONSTRAINT "challenge_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" UUID NOT NULL,
DROP COLUMN "creatorId",
ADD COLUMN     "creatorId" UUID NOT NULL,
ADD CONSTRAINT "challenge_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."challenge_member" DROP CONSTRAINT "challenge_member_pkey",
DROP COLUMN "challengeId",
ADD COLUMN     "challengeId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "challenge_member_pkey" PRIMARY KEY ("challengeId", "userId");

-- AlterTable
ALTER TABLE "habitracker_app"."comment" DROP CONSTRAINT "comment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "postId",
ADD COLUMN     "postId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."daily_stats" DROP CONSTRAINT "daily_stats_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."follows" DROP CONSTRAINT "follows_pkey",
DROP COLUMN "followerId",
ADD COLUMN     "followerId" UUID NOT NULL,
DROP COLUMN "followingId",
ADD COLUMN     "followingId" UUID NOT NULL,
ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("followerId", "followingId");

-- AlterTable
ALTER TABLE "habitracker_app"."group" DROP CONSTRAINT "group_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "group_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."group_member" DROP CONSTRAINT "group_member_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "group_member_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."habit_details" DROP CONSTRAINT "habit_details_pkey",
DROP COLUMN "taskId",
ADD COLUMN     "taskId" UUID NOT NULL,
DROP COLUMN "unitId",
ADD COLUMN     "unitId" UUID,
ADD CONSTRAINT "habit_details_pkey" PRIMARY KEY ("taskId");

-- AlterTable
ALTER TABLE "habitracker_app"."habit_profile" DROP CONSTRAINT "habit_profile_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "habit_profile_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "habitracker_app"."like" DROP COLUMN "postId",
ADD COLUMN     "postId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "habitracker_app"."mindset_details" DROP CONSTRAINT "mindset_details_pkey",
DROP COLUMN "taskId",
ADD COLUMN     "taskId" UUID NOT NULL,
ADD CONSTRAINT "mindset_details_pkey" PRIMARY KEY ("taskId");

-- AlterTable
ALTER TABLE "habitracker_app"."notification" DROP CONSTRAINT "notification_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "receiverId",
ADD COLUMN     "receiverId" UUID NOT NULL,
DROP COLUMN "senderId",
ADD COLUMN     "senderId" UUID NOT NULL,
DROP COLUMN "notificationTypeId",
ADD COLUMN     "notificationTypeId" UUID NOT NULL,
ADD CONSTRAINT "notification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."notification_type" DROP CONSTRAINT "notification_type_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "notification_type_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."pomodoro_settings" DROP CONSTRAINT "pomodoro_settings_pkey",
DROP COLUMN "taskId",
ADD COLUMN     "taskId" UUID NOT NULL,
ADD CONSTRAINT "pomodoro_settings_pkey" PRIMARY KEY ("taskId");

-- AlterTable
ALTER TABLE "habitracker_app"."post" DROP CONSTRAINT "post_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "challengeId",
ADD COLUMN     "challengeId" UUID,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" UUID,
ADD CONSTRAINT "post_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."reward_event" DROP CONSTRAINT "reward_event_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "achievementDefinitionId",
ADD COLUMN     "achievementDefinitionId" UUID NOT NULL,
ADD CONSTRAINT "reward_event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."routine_details" DROP CONSTRAINT "routine_details_pkey",
DROP COLUMN "taskId",
ADD COLUMN     "taskId" UUID NOT NULL,
ADD CONSTRAINT "routine_details_pkey" PRIMARY KEY ("taskId");

-- AlterTable
ALTER TABLE "habitracker_app"."task" DROP CONSTRAINT "task_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" UUID,
DROP COLUMN "originalTaskId",
ADD COLUMN     "originalTaskId" UUID,
DROP COLUMN "frequencyId",
ADD COLUMN     "frequencyId" UUID,
DROP COLUMN "challengeId",
ADD COLUMN     "challengeId" UUID,
ADD CONSTRAINT "task_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."task_completion" DROP CONSTRAINT "task_completion_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "taskId",
ADD COLUMN     "taskId" UUID NOT NULL,
ADD CONSTRAINT "task_completion_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."task_frequency" DROP CONSTRAINT "task_frequency_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "task_frequency_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."task_reminder" DROP CONSTRAINT "task_reminder_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "taskId",
ADD COLUMN     "taskId" UUID NOT NULL,
ADD CONSTRAINT "task_reminder_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."task_unit" DROP CONSTRAINT "task_unit_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID,
ADD CONSTRAINT "task_unit_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."todo_details" DROP CONSTRAINT "todo_details_pkey",
DROP COLUMN "taskId",
ADD COLUMN     "taskId" UUID NOT NULL,
ADD CONSTRAINT "todo_details_pkey" PRIMARY KEY ("taskId");

-- AlterTable
ALTER TABLE "habitracker_app"."todo_subtask" DROP CONSTRAINT "todo_subtask_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "todoDetailsId",
ADD COLUMN     "todoDetailsId" UUID NOT NULL,
ADD CONSTRAINT "todo_subtask_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "habitracker_app"."user_block" DROP CONSTRAINT "user_block_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "profileId",
ADD COLUMN     "profileId" UUID NOT NULL,
DROP COLUMN "blockedId",
ADD COLUMN     "blockedId" UUID NOT NULL,
ADD CONSTRAINT "user_block_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "auth"."account"("userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "auth"."session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_setting_userId_key_key" ON "auth"."user_setting"("userId", "key");

-- CreateIndex
CREATE INDEX "category_userId_idx" ON "habitracker_app"."category"("userId");

-- CreateIndex
CREATE INDEX "challenge_groupId_idx" ON "habitracker_app"."challenge"("groupId");

-- CreateIndex
CREATE INDEX "challenge_creatorId_idx" ON "habitracker_app"."challenge"("creatorId");

-- CreateIndex
CREATE INDEX "comment_postId_idx" ON "habitracker_app"."comment"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_userId_recordDate_key" ON "habitracker_app"."daily_stats"("userId", "recordDate");

-- CreateIndex
CREATE INDEX "group_member_userId_idx" ON "habitracker_app"."group_member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "group_member_groupId_userId_key" ON "habitracker_app"."group_member"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "like_postId_userId_key" ON "habitracker_app"."like"("postId", "userId");

-- CreateIndex
CREATE INDEX "notification_receiverId_isRead_createdAt_idx" ON "habitracker_app"."notification"("receiverId", "isRead", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "notification_notificationTypeId_idx" ON "habitracker_app"."notification"("notificationTypeId");

-- CreateIndex
CREATE INDEX "post_userId_createdAt_idx" ON "habitracker_app"."post"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "post_groupId_idx" ON "habitracker_app"."post"("groupId");

-- CreateIndex
CREATE INDEX "post_challengeId_idx" ON "habitracker_app"."post"("challengeId");

-- CreateIndex
CREATE INDEX "reward_event_userId_createdAt_idx" ON "habitracker_app"."reward_event"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "reward_event_achievementDefinitionId_idx" ON "habitracker_app"."reward_event"("achievementDefinitionId");

-- CreateIndex
CREATE INDEX "task_userId_isDeleted_createdAt_idx" ON "habitracker_app"."task"("userId", "isDeleted", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "task_challengeId_idx" ON "habitracker_app"."task"("challengeId");

-- CreateIndex
CREATE INDEX "task_completion_taskId_completedAt_idx" ON "habitracker_app"."task_completion"("taskId", "completedAt" DESC);

-- CreateIndex
CREATE INDEX "task_unit_userId_idx" ON "habitracker_app"."task_unit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_block_profileId_blockedId_key" ON "habitracker_app"."user_block"("profileId", "blockedId");

-- AddForeignKey
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_setting" ADD CONSTRAINT "user_setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "habitracker_app"."reward_event" ADD CONSTRAINT "reward_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."reward_event" ADD CONSTRAINT "reward_event_achievementDefinitionId_fkey" FOREIGN KEY ("achievementDefinitionId") REFERENCES "habitracker_app"."achievement_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."task" ADD CONSTRAINT "task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."task" ADD CONSTRAINT "task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "habitracker_app"."category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."task" ADD CONSTRAINT "task_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "habitracker_app"."challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."task" ADD CONSTRAINT "task_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "habitracker_app"."task_frequency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."habit_details" ADD CONSTRAINT "habit_details_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "habitracker_app"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."habit_details" ADD CONSTRAINT "habit_details_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "habitracker_app"."task_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."routine_details" ADD CONSTRAINT "routine_details_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "habitracker_app"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."todo_details" ADD CONSTRAINT "todo_details_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "habitracker_app"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."mindset_details" ADD CONSTRAINT "mindset_details_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "habitracker_app"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."todo_subtask" ADD CONSTRAINT "todo_subtask_todoDetailsId_fkey" FOREIGN KEY ("todoDetailsId") REFERENCES "habitracker_app"."todo_details"("taskId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."task_reminder" ADD CONSTRAINT "task_reminder_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "habitracker_app"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."task_completion" ADD CONSTRAINT "task_completion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "habitracker_app"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."pomodoro_settings" ADD CONSTRAINT "pomodoro_settings_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "habitracker_app"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."post" ADD CONSTRAINT "post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."post" ADD CONSTRAINT "post_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "habitracker_app"."group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."post" ADD CONSTRAINT "post_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "habitracker_app"."challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "habitracker_app"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."comment" ADD CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."like" ADD CONSTRAINT "like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "habitracker_app"."post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."challenge" ADD CONSTRAINT "challenge_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "habitracker_app"."group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."challenge" ADD CONSTRAINT "challenge_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."group_member" ADD CONSTRAINT "group_member_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "habitracker_app"."group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."group_member" ADD CONSTRAINT "group_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."challenge_member" ADD CONSTRAINT "challenge_member_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "habitracker_app"."challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."challenge_member" ADD CONSTRAINT "challenge_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."notification" ADD CONSTRAINT "notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."notification" ADD CONSTRAINT "notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."notification" ADD CONSTRAINT "notification_notificationTypeId_fkey" FOREIGN KEY ("notificationTypeId") REFERENCES "habitracker_app"."notification_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
