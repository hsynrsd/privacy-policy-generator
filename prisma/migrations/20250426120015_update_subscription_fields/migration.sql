/*
  Warnings:

  - You are about to drop the `subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `subscription` DROP FOREIGN KEY `subscription_userId_fkey`;

-- DropTable
DROP TABLE `subscription`;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING') NOT NULL DEFAULT 'ACTIVE',
    `plan` ENUM('FREE', 'PREMIUM') NOT NULL DEFAULT 'FREE',
    `current_period_start` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `current_period_end` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `stripe_subscription_id` VARCHAR(191) NULL,

    UNIQUE INDEX `subscriptions_userId_key`(`userId`),
    UNIQUE INDEX `subscriptions_stripe_subscription_id_key`(`stripe_subscription_id`),
    INDEX `subscriptions_stripe_subscription_id_idx`(`stripe_subscription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
