-- CreateEnum
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VerificationPurpose') THEN
		CREATE TYPE "VerificationPurpose" AS ENUM (
			'FORGOT_PASSWORD',
			'EMAIL_VERIFICATION',
			'PHONE_VERIFICATION',
			'ADMIN_LOGIN_OTP'
		);
	END IF;
END $$;

-- CreateEnum
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VerificationStatus') THEN
		CREATE TYPE "VerificationStatus" AS ENUM (
			'PENDING',
			'VERIFIED',
			'EXPIRED',
			'CANCELED'
		);
	END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "VerificationCode" (
	"id" TEXT NOT NULL,
	"userId" TEXT,
	"email" TEXT,
	"phoneNumber" TEXT,
	"purpose" "VerificationPurpose" NOT NULL,
	"channel" "NotificationChannel" NOT NULL,
	"codeHash" TEXT NOT NULL,
	"status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
	"expiresAt" TIMESTAMP(3) NOT NULL,
	"verifiedAt" TIMESTAMP(3),
	"consumedAt" TIMESTAMP(3),
	"attempts" INTEGER NOT NULL DEFAULT 0,
	"maxAttempts" INTEGER NOT NULL DEFAULT 5,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,
	CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AdminAuditLog" (
	"id" TEXT NOT NULL,
	"actorUserId" TEXT NOT NULL,
	"businessId" TEXT,
	"action" TEXT NOT NULL,
	"targetType" TEXT,
	"targetId" TEXT,
	"ipAddress" TEXT,
	"userAgent" TEXT,
	"metadata" JSONB,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VerificationCode_email_purpose_status_idx"
ON "VerificationCode"("email", "purpose", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VerificationCode_phoneNumber_purpose_status_idx"
ON "VerificationCode"("phoneNumber", "purpose", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VerificationCode_expiresAt_idx"
ON "VerificationCode"("expiresAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AdminAuditLog_actorUserId_createdAt_idx"
ON "AdminAuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AdminAuditLog_businessId_createdAt_idx"
ON "AdminAuditLog"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AdminAuditLog_action_idx"
ON "AdminAuditLog"("action");

-- AddForeignKey
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'VerificationCode_userId_fkey'
	) THEN
		ALTER TABLE "VerificationCode"
		ADD CONSTRAINT "VerificationCode_userId_fkey"
		FOREIGN KEY ("userId") REFERENCES "User"("id")
		ON DELETE SET NULL ON UPDATE CASCADE;
	END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'AdminAuditLog_actorUserId_fkey'
	) THEN
		ALTER TABLE "AdminAuditLog"
		ADD CONSTRAINT "AdminAuditLog_actorUserId_fkey"
		FOREIGN KEY ("actorUserId") REFERENCES "User"("id")
		ON DELETE CASCADE ON UPDATE CASCADE;
	END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'AdminAuditLog_businessId_fkey'
	) THEN
		ALTER TABLE "AdminAuditLog"
		ADD CONSTRAINT "AdminAuditLog_businessId_fkey"
		FOREIGN KEY ("businessId") REFERENCES "Business"("id")
		ON DELETE SET NULL ON UPDATE CASCADE;
	END IF;
END $$;
