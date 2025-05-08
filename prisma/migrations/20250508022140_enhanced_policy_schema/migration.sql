/*
  Warnings:

  - Added the required column `effectiveDate` to the `policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `policy` ADD COLUMN `effectiveDate` DATETIME(3) NOT NULL,
    ADD COLUMN `lastReviewDate` DATETIME(3) NULL,
    ADD COLUMN `metadata` JSON NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'ACTIVE', 'ARCHIVED', 'SUPERSEDED') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `version` VARCHAR(191) NOT NULL,
    MODIFY `content` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `policyHistory` (
    `id` VARCHAR(191) NOT NULL,
    `policyId` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `effectiveDate` DATETIME(3) NOT NULL,
    `changes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NULL,

    INDEX `policyHistory_policyId_idx`(`policyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `policyHistory` ADD CONSTRAINT `policyHistory_policyId_fkey` FOREIGN KEY (`policyId`) REFERENCES `policy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
