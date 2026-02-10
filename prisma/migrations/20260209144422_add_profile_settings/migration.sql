-- CreateTable
CREATE TABLE "auth"."two_factor" (
    "id" UUID NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "two_factor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."passkey" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "credentialID" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passkey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitracker_app"."profile_settings" (
    "userId" UUID NOT NULL,
    "isSearchable" BOOLEAN NOT NULL DEFAULT true,
    "analyticsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "profileVisibility" "habitracker_app"."PostVisibility" NOT NULL DEFAULT 'PUBLIC',
    "challengeVisibility" "habitracker_app"."PostVisibility" NOT NULL DEFAULT 'PUBLIC',
    "challengePostVisibility" "habitracker_app"."PostVisibility" NOT NULL DEFAULT 'PUBLIC',
    "taskDailyReminderTime" TEXT,
    "taskWeekStartDay" INTEGER NOT NULL DEFAULT 1,
    "taskArchiveVisible" BOOLEAN NOT NULL DEFAULT false,
    "pomodoroFocusDuration" INTEGER NOT NULL DEFAULT 25,
    "pomodoroBreakDuration" INTEGER NOT NULL DEFAULT 5,
    "pomodoroLongBreakDuration" INTEGER NOT NULL DEFAULT 15,

    CONSTRAINT "profile_settings_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "two_factor_userId_key" ON "auth"."two_factor"("userId");

-- AddForeignKey
ALTER TABLE "auth"."two_factor" ADD CONSTRAINT "two_factor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."passkey" ADD CONSTRAINT "passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitracker_app"."profile_settings" ADD CONSTRAINT "profile_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "habitracker_app"."habit_profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
