-- AlterTable
ALTER TABLE "auth"."user" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
