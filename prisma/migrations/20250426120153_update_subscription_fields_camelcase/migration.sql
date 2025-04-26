/*
  Warnings:

  - You are about to drop the column `current_period_end` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `current_period_start` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `subscriptions_stripe_subscription_id_idx` ON `subscriptions`;

-- DropIndex
DROP INDEX `subscriptions_stripe_subscription_id_key` ON `subscriptions`;

-- AlterTable
ALTER TABLE `subscriptions` DROP COLUMN `current_period_end`,
    DROP COLUMN `current_period_start`,
    DROP COLUMN `stripe_subscription_id`,
    ADD COLUMN `currentPeriodEnd` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `currentPeriodStart` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `stripeSubscriptionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `subscriptions_stripeSubscriptionId_key` ON `subscriptions`(`stripeSubscriptionId`);

-- CreateIndex
CREATE INDEX `subscriptions_stripeSubscriptionId_idx` ON `subscriptions`(`stripeSubscriptionId`);
