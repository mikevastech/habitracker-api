-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "habitracker_app";

-- CreateEnum
CREATE TYPE "habitracker_app"."TaskType" AS ENUM ('HABIT', 'ROUTINE', 'TODO', 'MINDSET');

-- CreateEnum
CREATE TYPE "habitracker_app"."HabitDirection" AS ENUM ('POSITIVE', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "habitracker_app"."TaskPriority" AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "auth"."SubscriptionTier" AS ENUM ('FREE', 'PRO', 'LIFETIME');

-- CreateTable
CREATE TABLE "auth"."user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "subscriptionTier" "auth"."SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "lastActive" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user_setting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "user_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user_block" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blockedUserId" TEXT NOT NULL,

    CONSTRAINT "user_block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."follows" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "habitracker_app"."daily_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recordDate" DATE NOT NULL,
    "totalCompleted" INTEGER NOT NULL DEFAULT 0,
    "activeStreak" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "type" "habitracker_app"."TaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "iconName" TEXT,
    "colorValue" INTEGER,
    "imageUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPredefined" BOOLEAN NOT NULL DEFAULT false,
    "forkCount" INTEGER NOT NULL DEFAULT 0,
    "isForked" BOOLEAN NOT NULL DEFAULT false,
    "originalTaskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "frequencyId" TEXT,
    "notes" TEXT[],

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconName" TEXT,
    "colorValue" INTEGER,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."task_frequency" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "daysOfWeek" INTEGER[],
    "dayOfMonth" INTEGER,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "timesPerPeriod" INTEGER,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "task_frequency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."habit_details" (
    "taskId" TEXT NOT NULL,
    "goalValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unitId" TEXT,
    "direction" "habitracker_app"."HabitDirection" NOT NULL DEFAULT 'POSITIVE',

    CONSTRAINT "habit_details_pkey" PRIMARY KEY ("taskId")
);

-- CreateTable
CREATE TABLE "habitracker_app"."task_unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "task_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."routine_details" (
    "taskId" TEXT NOT NULL,
    "steps" TEXT[],
    "startTime" TEXT,
    "endTime" TEXT,

    CONSTRAINT "routine_details_pkey" PRIMARY KEY ("taskId")
);

-- CreateTable
CREATE TABLE "habitracker_app"."todo_details" (
    "taskId" TEXT NOT NULL,
    "dueTime" TIMESTAMP(3),
    "priority" "habitracker_app"."TaskPriority" NOT NULL DEFAULT 'NONE',
    "url" TEXT,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "todo_details_pkey" PRIMARY KEY ("taskId")
);

-- CreateTable
CREATE TABLE "habitracker_app"."mindset_details" (
    "taskId" TEXT NOT NULL,
    "affirmation" TEXT,
    "durationMinutes" INTEGER,

    CONSTRAINT "mindset_details_pkey" PRIMARY KEY ("taskId")
);

-- CreateTable
CREATE TABLE "habitracker_app"."todo_subtask" (
    "id" TEXT NOT NULL,
    "todoDetailsId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "todo_subtask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."task_reminder" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "time" TEXT,
    "locationName" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "message" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "task_reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."task_completion" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION,
    "status" TEXT,
    "notes" TEXT,

    CONSTRAINT "task_completion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."pomodoro_settings" (
    "taskId" TEXT NOT NULL,
    "focusDuration" INTEGER NOT NULL DEFAULT 25,
    "breakDuration" INTEGER NOT NULL DEFAULT 5,
    "longBreakDuration" INTEGER NOT NULL DEFAULT 15,
    "totalSessions" INTEGER NOT NULL DEFAULT 4,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoStartBreaks" BOOLEAN NOT NULL DEFAULT false,
    "autoStartFocus" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pomodoro_settings_pkey" PRIMARY KEY ("taskId")
);

-- CreateTable
CREATE TABLE "habitracker_app"."post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."comment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."like" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "habitracker_app"."challenge" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."challenge_member" (
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_member_pkey" PRIMARY KEY ("challengeId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "auth"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "auth"."user"("username");

-- CreateIndex
CREATE INDEX "user_username_idx" ON "auth"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "auth"."session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "auth"."session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "auth"."account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_setting_userId_key_key" ON "auth"."user_setting"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "user_block_userId_blockedUserId_key" ON "auth"."user_block"("userId", "blockedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_userId_recordDate_key" ON "habitracker_app"."daily_stats"("userId", "recordDate");

-- CreateIndex
CREATE INDEX "task_userId_isDeleted_createdAt_idx" ON "habitracker_app"."task"("userId", "isDeleted", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "like_postId_userId_key" ON "habitracker_app"."like"("postId", "userId");

-- CreateIndex
CREATE INDEX "challenge_groupId_idx" ON "habitracker_app"."challenge"("groupId");

-- AddForeignKey
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_setting" ADD CONSTRAINT "user_setting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_block" ADD CONSTRAINT "user_block_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."user_block" ADD CONSTRAINT "user_block_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."daily_stats" ADD CONSTRAINT "daily_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."task" ADD CONSTRAINT "task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."task" ADD CONSTRAINT "task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "habitracker_app"."category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "habitracker_app"."post" ADD CONSTRAINT "post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "habitracker_app"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."comment" ADD CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."like" ADD CONSTRAINT "like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "habitracker_app"."post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."challenge" ADD CONSTRAINT "challenge_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "habitracker_app"."group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."challenge_member" ADD CONSTRAINT "challenge_member_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "habitracker_app"."challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."challenge_member" ADD CONSTRAINT "challenge_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
