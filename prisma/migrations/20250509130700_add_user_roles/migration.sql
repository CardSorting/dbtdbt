-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- AlterTable to add role field to User table
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- CreateTable for permissions (if not already exists)
CREATE TABLE IF NOT EXISTS "Permission" (
  "id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable for role permissions (if not already exists)
CREATE TABLE IF NOT EXISTS "RolePermission" (
  "role" "UserRole" NOT NULL,
  "permissionId" TEXT NOT NULL,

  CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role","permissionId")
);

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed default admin user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM "User" WHERE "role" = 'ADMIN' LIMIT 1) THEN
    UPDATE "User" SET "role" = 'ADMIN' WHERE "id" = 'user-1' LIMIT 1;
  END IF;
END $$;

-- Seed default teacher user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM "User" WHERE "role" = 'TEACHER' LIMIT 1) THEN
    UPDATE "User" SET "role" = 'TEACHER' WHERE "id" = 'user-2' LIMIT 1;
  END IF;
END $$;
